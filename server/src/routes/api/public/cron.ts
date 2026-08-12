import { Router } from "express";
import { BookingModel, EnquiryModel, ExchangeRateModel } from "../../../models";

export const cronRouter = Router();

const HOLD_WINDOW_MS = 20 * 60 * 1000;

/** Constant-time string comparison to prevent timing attacks */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function requireCronSecret(req: import("express").Request, res: import("express").Response): boolean {
  const secret = req.header("x-cron-secret") || "";
  const expected = process.env.CRON_SECRET || "";
  if (!expected || !safeCompare(secret, expected)) {
    res.status(401).json({ ok: false, error: "Unauthorized" });
    return false;
  }
  return true;
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  POST /api/public/cron/release-expired-holds                               */
/*  Frees seats held by abandoned draft bookings older than 20 minutes        */
/* ────────────────────────────────────────────────────────────────────────── */
cronRouter.post("/release-expired-holds", async (req, res) => {
  if (!requireCronSecret(req, res)) return;

  const cutoff = new Date(Date.now() - HOLD_WINDOW_MS);

  try {
    // Find and cancel expired drafts
    const result = await BookingModel.updateMany(
      { status: "draft", createdAt: { $lt: cutoff } },
      { $set: { status: "cancelled" } },
    );

    const released = result.modifiedCount;
    console.log(`[cron/release-expired-holds] Released ${released} expired holds`);

    return res.json({
      ok: true,
      released,
      message: `Released ${released} expired draft holds`,
    });
  } catch (err) {
    console.error("[cron/release-expired-holds] Error", err);
    return res.status(500).json({ ok: false, error: "Failed to release expired holds" });
  }
});

/* ────────────────────────────────────────────────────────────────────────── */
/*  POST /api/public/cron/retry-notifications                                 */
/*  Resends pending notification emails for enquiries                          */
/* ────────────────────────────────────────────────────────────────────────── */
cronRouter.post("/retry-notifications", async (req, res) => {
  if (!requireCronSecret(req, res)) return;

  try {
    const pending = await EnquiryModel.find({ notifyStatus: "pending" }).limit(50).exec();
    let retried = 0;
    let failed = 0;

    for (const enquiry of pending) {
      try {
        // Re-import here to avoid circular dependencies
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { sendEnquiryAck, sendEnquiryNotification } = require("../../../lib/email") as typeof import("../../../lib/email");
        await sendEnquiryAck({
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          country: enquiry.country,
          packageSlug: enquiry.packageSlug ?? undefined,
          message: enquiry.message,
          enquiryId: enquiry.id as string,
        });
        await sendEnquiryNotification({
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          country: enquiry.country,
          packageSlug: enquiry.packageSlug ?? undefined,
          message: enquiry.message,
          enquiryId: enquiry.id as string,
        });
        await EnquiryModel.findByIdAndUpdate(enquiry.id, { notifyStatus: "sent" }).exec();
        retried++;
      } catch (err) {
        console.error(`[cron/retry-notifications] Failed for enquiry ${enquiry.id}`, err);
        await EnquiryModel.findByIdAndUpdate(enquiry.id, { notifyStatus: "failed" }).exec();
        failed++;
      }
    }

    console.log(`[cron/retry-notifications] Retried ${retried}, failed ${failed}`);
    return res.json({ ok: true, retried, failed });
  } catch (err) {
    console.error("[cron/retry-notifications] Error", err);
    return res.status(500).json({ ok: false, error: "Failed to retry notifications" });
  }
});

/* ────────────────────────────────────────────────────────────────────────── */
/*  POST /api/public/cron/refresh-exchange-rates                              */
/*  Fetches live mid-market rates from frankfurter.app and caches them        */
/* ────────────────────────────────────────────────────────────────────────── */
cronRouter.post("/refresh-exchange-rates", async (req, res) => {
  if (!requireCronSecret(req, res)) return;

  const FALLBACK_RATES: Record<string, number> = {
    INR: 1,
    USD: 0.0115,
    GBP: 0.009,
    SAR: 0.043,
  };

  try {
    // Fetch from Frankfurter (free, no API key required)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);

    let liveRates: Record<string, number> | null = null;

    try {
      const response = await fetch(
        "https://api.frankfurter.app/latest?from=INR&to=USD,GBP,SAR",
        { signal: controller.signal },
      );
      clearTimeout(timeout);

      if (response.ok) {
        const data = (await response.json()) as {
          rates: { USD: number; GBP: number; SAR: number };
        };
        liveRates = {
          INR: 1,
          USD: data.rates.USD,
          GBP: data.rates.GBP,
          SAR: data.rates.SAR,
        };
      }
    } catch (fetchErr) {
      clearTimeout(timeout);
      console.warn("[cron/refresh-exchange-rates] Provider fetch failed, using fallback", fetchErr);
    }

    const rates = liveRates ?? FALLBACK_RATES;
    const stale = liveRates === null;

    // Upsert — keep only the latest entry (delete old, insert new)
    await ExchangeRateModel.deleteMany({});
    await ExchangeRateModel.create({ rates, fetchedAt: new Date(), stale });

    console.log(`[cron/refresh-exchange-rates] Saved rates (stale=${stale}):`, rates);
    return res.json({ ok: true, rates, stale, fetchedAt: new Date() });
  } catch (err) {
    console.error("[cron/refresh-exchange-rates] Error", err);
    return res.status(500).json({ ok: false, error: "Failed to refresh exchange rates" });
  }
});
