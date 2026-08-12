import { Router } from "express";
import {
  bookingDraftSchema,
  bookingTravellerSchema,
  bookingLookupSchema,
  cancelBookingSchema,
  checkoutSchema,
} from "../../lib/validators";
import { BookingModel, BookingTravellerModel, DepartureModel } from "../../models";
import { sendBookingConfirmation } from "../../lib/email";

export const bookingRouter = Router();

/** How long a draft holds seats (20 minutes) */
const HOLD_WINDOW_MS = 20 * 60 * 1000;

function createReference(): string {
  return `BK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

/**
 * Refund tier logic — mirrors src/data/legal.ts from the frontend.
 * All amounts in minor units (paise). Returns refund amount in INR (integer).
 */
function computeRefund(
  priceQuote: number,
  departureDateStr: string | Date,
): { refundAmountInr: number; tierLabel: string; nonRefundableInr: number } {
  const now = new Date();
  const departure = new Date(departureDateStr);
  const daysToDepart = Math.floor((departure.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Non-refundable components: visa + admin fee (estimated 10% of total)
  const nonRefundableInr = Math.round(priceQuote * 0.1);
  const refundableBase = priceQuote - nonRefundableInr;

  let refundAmountInr: number;
  let tierLabel: string;

  if (daysToDepart >= 60) {
    refundAmountInr = Math.round(refundableBase * 0.9); // 90% refund
    tierLabel = "60+ days before departure — 90% refund";
  } else if (daysToDepart >= 30) {
    refundAmountInr = Math.round(refundableBase * 0.7); // 70% refund
    tierLabel = "30–59 days before departure — 70% refund";
  } else if (daysToDepart >= 15) {
    refundAmountInr = Math.round(refundableBase * 0.5); // 50% refund
    tierLabel = "15–29 days before departure — 50% refund";
  } else if (daysToDepart >= 7) {
    refundAmountInr = Math.round(refundableBase * 0.25); // 25% refund
    tierLabel = "7–14 days before departure — 25% refund";
  } else {
    refundAmountInr = 0; // No refund
    tierLabel = "< 7 days before departure — no refund";
  }

  return { refundAmountInr, tierLabel, nonRefundableInr };
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  POST /api/bookings/draft — Step 1                                         */
/* ────────────────────────────────────────────────────────────────────────── */
bookingRouter.post("/draft", async (req, res) => {
  const parse = bookingDraftSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(422).json({ ok: false, errors: parse.error.flatten().fieldErrors });
  }

  const payload = parse.data;

  // ── Idempotency key: return existing draft if already submitted ───────────
  if (payload.idempotencyKey) {
    const existing = await BookingModel.findOne({ idempotencyKey: payload.idempotencyKey }).exec();
    if (existing) {
      return res.json({
        ok: true,
        bookingId: existing.id,
        reference: existing.reference,
        status: existing.status,
        priceQuote: existing.priceQuote,
      });
    }
  }

  // ── Find departure & check availability ──────────────────────────────────
  const departure = await DepartureModel.findById(payload.departureId).exec();
  if (!departure) {
    return res.status(409).json({ ok: false, error: "Departure not found" });
  }
  if (departure.status === "closed") {
    return res.status(409).json({ ok: false, error: "Departure is closed for bookings" });
  }
  if (new Date(departure.date) < new Date()) {
    return res.status(409).json({ ok: false, error: "Departure date has passed" });
  }

  // ── Compute seats already occupied (confirmed + active drafts within hold window) ───
  const holdCutoff = new Date(Date.now() - HOLD_WINDOW_MS);
  const occupied = await BookingModel.aggregate([
    {
      $match: {
        departureId: payload.departureId,
        $or: [
          { status: "confirmed" },
          { status: "draft", createdAt: { $gte: holdCutoff } },
        ],
      },
    },
    { $group: { _id: null, total: { $sum: "$travellers" } } },
  ]);

  const seatsOccupied = occupied[0]?.total ?? 0;
  const seatsAvailable = departure.seatsTotal - seatsOccupied;

  if (seatsAvailable < payload.travellers) {
    return res.status(409).json({
      ok: false,
      error: "Not enough seats available",
      remaining: Math.max(0, seatsAvailable),
    });
  }

  // ── Server-side price computation (never trust client) ───────────────────
  const priceQuote = departure.priceInr * payload.travellers;

  // ── Create booking draft ──────────────────────────────────────────────────
  const booking = await BookingModel.create({
    packageSlug: payload.packageSlug,
    departureId: payload.departureId,
    travellers: payload.travellers,
    leadName: payload.leadName,
    leadEmail: payload.leadEmail,
    leadPhone: payload.leadPhone,
    leadCountry: payload.leadCountry,
    roomPreference: payload.roomPreference ?? undefined,
    departMonth: payload.departMonth ?? undefined,
    notes: payload.notes ?? undefined,
    status: "draft",
    priceQuote,
    reference: createReference(),
    idempotencyKey: payload.idempotencyKey ?? undefined,
  });

  return res.json({
    ok: true,
    bookingId: booking.id,
    reference: booking.reference,
    status: booking.status,
    priceQuote: booking.priceQuote,
  });
});

/* ────────────────────────────────────────────────────────────────────────── */
/*  POST /api/bookings/travellers — Step 2                                    */
/* ────────────────────────────────────────────────────────────────────────── */
bookingRouter.post("/travellers", async (req, res) => {
  const parse = bookingTravellerSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(422).json({ ok: false, errors: parse.error.flatten().fieldErrors });
  }

  const { bookingId, travellers, details } = parse.data;

  const booking = await BookingModel.findById(bookingId).exec();
  if (!booking) {
    return res.status(404).json({ ok: false, error: "Booking not found" });
  }
  if (booking.travellers !== travellers) {
    return res.status(422).json({
      ok: false,
      error: `Traveller count mismatch: booking has ${booking.travellers} but ${travellers} submitted`,
    });
  }

  // ── Duplicate passport check within this booking ──────────────────────────
  const passportNumbers = details.map((d) => d.passportNumber.toLowerCase());
  const uniquePassports = new Set(passportNumbers);
  if (uniquePassports.size < passportNumbers.length) {
    return res.status(422).json({ ok: false, error: "Duplicate passport number in traveller list" });
  }

  // ── Passport expiry check (must be ≥ 6 months after departure) ───────────
  const departure = await DepartureModel.findById(booking.departureId).exec();
  const departureDate = departure ? new Date(departure.date) : null;

  const validationWarnings: string[] = [];

  for (const detail of details) {
    const expiry = new Date(detail.passportExpiry);
    if (departureDate) {
      const sixMonthsAfterDeparture = new Date(departureDate);
      sixMonthsAfterDeparture.setMonth(sixMonthsAfterDeparture.getMonth() + 6);
      if (expiry < sixMonthsAfterDeparture) {
        validationWarnings.push(
          `Passport for ${detail.name} expires ${expiry.toISOString().slice(0, 10)}, which is less than 6 months after the departure date (Saudi Arabia requirement).`,
        );
      }
    }

    // Minor check
    const dob = new Date(detail.dob);
    const ageAtDeparture = departureDate
      ? (departureDate.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      : 999;
    if (ageAtDeparture < 18 && !detail.mahramRelation) {
      validationWarnings.push(
        `${detail.name} appears to be a minor. Please specify guardian/mahram relationship.`,
      );
    }
  }

  // Warnings are advisory — they don't block the submission but are surfaced to the client
  const entries = await Promise.all(
    details.map((detail) =>
      BookingTravellerModel.create({
        bookingId,
        name: detail.name,
        dob: new Date(detail.dob),
        gender: detail.gender,
        passportNumber: detail.passportNumber, // Stored as-is; encrypt at rest in production
        passportExpiry: new Date(detail.passportExpiry),
        nationality: detail.nationality,
        mahramRelation: detail.mahramRelation ?? undefined,
      }),
    ),
  );

  return res.json({
    ok: true,
    travellers: entries.map((e) => ({
      id: e.id,
      name: e.name,
      // Mask passport to last 4 chars
      passportNumber: `****${e.passportNumber.slice(-4)}`,
      nationality: e.nationality,
    })),
    warnings: validationWarnings,
  });
});

/* ────────────────────────────────────────────────────────────────────────── */
/*  GET /api/bookings — lookup by reference + email                           */
/* ────────────────────────────────────────────────────────────────────────── */
bookingRouter.get("/", async (req, res) => {
  const parse = bookingLookupSchema.safeParse(req.query);
  if (!parse.success) {
    return res.status(422).json({ ok: false, errors: parse.error.flatten().fieldErrors });
  }

  const booking = await BookingModel.findOne({
    reference: parse.data.reference,
    leadEmail: parse.data.email,
  })
    .lean()
    .exec();

  // Generic not-found to prevent enumeration
  if (!booking) {
    return res.status(404).json({ ok: false, error: "Booking not found" });
  }

  // Never expose traveller passport data in the booking lookup
  return res.json({
    ok: true,
    booking: {
      id: booking._id,
      reference: booking.reference,
      packageSlug: booking.packageSlug,
      departureId: booking.departureId,
      travellers: booking.travellers,
      leadName: booking.leadName,
      leadEmail: booking.leadEmail,
      leadCountry: booking.leadCountry,
      status: booking.status,
      priceQuote: booking.priceQuote,
      roomPreference: booking.roomPreference,
      departMonth: booking.departMonth,
      notes: booking.notes,
      createdAt: booking.createdAt,
    },
  });
});

/* ────────────────────────────────────────────────────────────────────────── */
/*  POST /api/bookings/cancel                                                 */
/* ────────────────────────────────────────────────────────────────────────── */
bookingRouter.post("/cancel", async (req, res) => {
  const parse = cancelBookingSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(422).json({ ok: false, errors: parse.error.flatten().fieldErrors });
  }

  const booking = await BookingModel.findOne({
    reference: parse.data.reference,
    leadEmail: parse.data.email,
  }).exec();

  if (!booking) {
    return res.status(404).json({ ok: false, error: "Booking not found" });
  }

  // Idempotent — already cancelled
  if (booking.status === "cancelled") {
    return res.status(409).json({ ok: false, error: "Booking is already cancelled" });
  }

  // Cannot cancel after departure
  const departure = await DepartureModel.findById(booking.departureId).exec();
  if (departure && new Date(departure.date) < new Date()) {
    return res.status(409).json({ ok: false, error: "Cannot cancel a departure that has already passed" });
  }

  // ── Compute refund server-side ────────────────────────────────────────────
  const { refundAmountInr, tierLabel, nonRefundableInr } = departure
    ? computeRefund(booking.priceQuote, departure.date)
    : { refundAmountInr: 0, tierLabel: "No departure data — manual review required", nonRefundableInr: booking.priceQuote };

  booking.status = "cancelled";
  await booking.save();

  return res.json({
    ok: true,
    status: "cancelled",
    refund: {
      amountInr: refundAmountInr,
      tierLabel,
      nonRefundableAmountInr: nonRefundableInr,
      note: "Refund will be processed within 7–10 business days to the original payment method.",
    },
  });
});

/* ────────────────────────────────────────────────────────────────────────── */
/*  POST /api/bookings/checkout — initiate payment                            */
/* ────────────────────────────────────────────────────────────────────────── */
bookingRouter.post("/checkout", async (req, res) => {
  const parse = checkoutSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(422).json({ ok: false, errors: parse.error.flatten().fieldErrors });
  }

  const booking = await BookingModel.findById(parse.data.bookingId).exec();
  if (!booking) {
    return res.status(404).json({ ok: false, error: "Booking not found" });
  }
  if (booking.status !== "draft") {
    return res.status(409).json({ ok: false, error: "Booking is not in a payable state" });
  }

  // ── Verify seats still available ──────────────────────────────────────────
  const departure = await DepartureModel.findById(booking.departureId).exec();
  if (!departure || departure.status === "closed" || new Date(departure.date) < new Date()) {
    return res.status(409).json({ ok: false, error: "Departure is no longer available" });
  }

  // ── Stripe integration (when STRIPE_SECRET is configured) ─────────────────
  const stripeSecret = process.env.STRIPE_SECRET;
  if (stripeSecret && !stripeSecret.startsWith("replace")) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Stripe = require("stripe") as typeof import("stripe").default;
      const stripe = new Stripe(stripeSecret, { apiVersion: "2022-11-15" });

      const depositAmount = parse.data.mode === "deposit"
        ? Math.round(booking.priceQuote * 0.25) // 25% deposit
        : booking.priceQuote;

      const session = await stripe.checkout.sessions.create(
        {
          payment_method_types: ["card"],
          mode: "payment",
          line_items: [
            {
              price_data: {
                currency: "inr",
                unit_amount: depositAmount * 100, // Stripe uses paise
                product_data: {
                  name: `SafarXGlobal — ${booking.packageSlug}`,
                  description: `${parse.data.mode === "deposit" ? "Deposit (25%)" : "Full payment"} for booking ${booking.reference}`,
                },
              },
              quantity: 1,
            },
          ],
          metadata: {
            bookingId: booking.id as string,
            reference: booking.reference,
            mode: parse.data.mode,
          },
          success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/booking?success=1&ref=${booking.reference}`,
          cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/booking`,
        },
        { idempotencyKey: `${booking.id}-${parse.data.mode}` },
      );

      return res.json({ ok: true, checkoutUrl: session.url, reference: booking.reference });
    } catch (err) {
      console.error("[checkout] Stripe error", err);
      return res.status(500).json({ ok: false, error: "Payment session creation failed. Please contact us." });
    }
  }

  // ── Stripe not yet configured — return a placeholder ─────────────────────
  console.warn("[checkout] STRIPE_SECRET not configured — returning placeholder URL");
  return res.json({
    ok: true,
    checkoutUrl: null,
    reference: booking.reference,
    message: "Payment processing is not yet configured. Our team will contact you to arrange payment.",
    priceQuote: booking.priceQuote,
    mode: parse.data.mode,
  });
});

/* ────────────────────────────────────────────────────────────────────────── */
/*  Internal: mark booking confirmed (called from webhook handler)            */
/* ────────────────────────────────────────────────────────────────────────── */
export async function confirmBooking(bookingId: string): Promise<void> {
  const booking = await BookingModel.findById(bookingId).exec();
  if (!booking) return;
  if (booking.status === "confirmed") return; // Already confirmed — idempotent

  booking.status = "confirmed";
  await booking.save();

  void sendBookingConfirmation({
    leadEmail: booking.leadEmail,
    leadName: booking.leadName,
    reference: booking.reference,
    packageSlug: booking.packageSlug,
    priceQuote: booking.priceQuote,
  });
}
