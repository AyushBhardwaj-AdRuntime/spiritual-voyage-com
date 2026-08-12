import express, { Router } from "express";
import Stripe from "stripe";
import { BookingModel } from "../../../models";
import { confirmBooking } from "../../bookings";

const stripeSecret = process.env.STRIPE_SECRET || "";
const stripe = new Stripe(stripeSecret, { apiVersion: "2022-11-15" });

export const webhookRouter = Router();

// In-memory idempotency store — swap for DB in production
const processedEvents = new Set<string>();

webhookRouter.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.header("stripe-signature");
    if (!signature) {
      return res.status(401).json({ ok: false, error: "Missing Stripe signature" });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || "",
      );
    } catch (err) {
      console.error("[webhook/stripe] Signature verification failed", err);
      return res.status(401).json({ ok: false, error: "Invalid Stripe signature" });
    }

    // ── Idempotency: skip replays ────────────────────────────────────────
    if (processedEvents.has(event.id)) {
      console.log(`[webhook/stripe] Duplicate event ignored: ${event.id}`);
      return res.json({ ok: true, duplicate: true });
    }

    console.log(`[webhook/stripe] Processing event: ${event.type} (${event.id})`);

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const bookingId = session.metadata?.bookingId;

          if (!bookingId) {
            console.error("[webhook/stripe] checkout.session.completed has no bookingId in metadata");
            break;
          }

          // Verify the amount matches what we expect
          const booking = await BookingModel.findById(bookingId).exec();
          if (!booking) {
            console.error(`[webhook/stripe] Booking ${bookingId} not found`);
            break;
          }

          const mode = session.metadata?.mode ?? "full";
          const expectedAmount =
            mode === "deposit"
              ? Math.round(booking.priceQuote * 0.25) * 100
              : booking.priceQuote * 100;

          if (session.amount_total !== expectedAmount) {
            console.error(
              `[webhook/stripe] Amount mismatch for booking ${bookingId}: expected ${expectedAmount}, got ${session.amount_total}`,
            );
            // Flag for review — don't confirm
            await BookingModel.findByIdAndUpdate(bookingId, {
              $set: { needsManualResolution: true },
            }).exec();
            break;
          }

          await confirmBooking(bookingId);
          console.log(`[webhook/stripe] Booking ${bookingId} confirmed`);
          break;
        }

        case "payment_intent.succeeded": {
          const pi = event.data.object as Stripe.PaymentIntent;
          console.log(`[webhook/stripe] PaymentIntent succeeded: ${pi.id}`);
          // Confirmation is handled via checkout.session.completed — no action needed here
          break;
        }

        case "payment_intent.payment_failed": {
          const pi = event.data.object as Stripe.PaymentIntent;
          console.warn(`[webhook/stripe] Payment failed for intent: ${pi.id}`);
          // The booking stays in draft — user can retry
          break;
        }

        case "charge.refunded": {
          const charge = event.data.object as Stripe.Charge;
          const paymentIntentId = charge.payment_intent as string;
          console.log(`[webhook/stripe] Charge refunded. PaymentIntent: ${paymentIntentId}`);
          // TODO: look up booking by paymentIntentId and sync refund status
          break;
        }

        case "charge.dispute.created": {
          const dispute = event.data.object as Stripe.Dispute;
          console.warn(`[webhook/stripe] Dispute created: ${dispute.id}`);
          // TODO: alert ops
          break;
        }

        default:
          console.log(`[webhook/stripe] Unhandled event type: ${event.type}`);
      }

      // Mark as processed after handling
      processedEvents.add(event.id);
      // Prevent unbounded growth
      if (processedEvents.size > 10_000) {
        const [first] = processedEvents;
        processedEvents.delete(first);
      }

      // Always return 2xx — email retries belong to cron
      return res.json({ ok: true });
    } catch (err) {
      console.error(`[webhook/stripe] Handler error for event ${event.id}`, err);
      // Still return 2xx to prevent Stripe retrying a handler bug indefinitely
      return res.status(500).json({ ok: false, error: "Handler error" });
    }
  },
);
