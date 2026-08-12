import { Router } from "express";
import { FAQModel } from "./faq";
import { ExchangeRateModel } from "../../models";

export const publicRouter = Router();

/** Hardcoded fallback rates (display-only, INR is always the billing currency) */
const FALLBACK_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.0115,
  GBP: 0.009,
  SAR: 0.043,
};

publicRouter.get("/faqs", async (req, res) => {
  const faqs = await FAQModel.find({}).lean().exec();

  // Mask pending items: replace answer with null so the UI shows the "confirm for you" note
  // Pending items are NOT included in FAQPage JSON-LD (handled on the frontend)
  const result = faqs.map((faq) => ({
    _id: faq._id,
    question: faq.question,
    answer: faq.pending ? null : faq.answer,
    pending: faq.pending ?? false,
  }));

  return res.json({ ok: true, data: result });
});

publicRouter.get("/exchange-rates", async (req, res) => {
  try {
    const rates = await ExchangeRateModel.findOne({}).sort({ fetchedAt: -1 }).lean().exec();

    if (!rates) {
      // No DB entry — return hardcoded fallback + stale flag
      return res.json({
        ok: true,
        data: {
          rates: FALLBACK_RATES,
          stale: true,
          fetchedAt: null,
          source: "fallback",
        },
      });
    }

    // Check staleness (> 12 hours)
    const ageMs = Date.now() - new Date(rates.fetchedAt).getTime();
    const stale = ageMs > 12 * 60 * 60 * 1000;

    return res.json({
      ok: true,
      data: {
        rates: rates.rates,
        stale: stale || rates.stale,
        fetchedAt: rates.fetchedAt,
        source: "db",
      },
    });
  } catch (err) {
    console.error("[exchange-rates] DB error, falling back to hardcoded rates", err);
    return res.json({
      ok: true,
      data: {
        rates: FALLBACK_RATES,
        stale: true,
        fetchedAt: null,
        source: "fallback",
      },
    });
  }
});
