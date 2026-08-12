import { Router } from "express";
import { enquirySchema, checkRateLimit } from "../lib/validators";
import { sendEnquiryAck, sendEnquiryNotification } from "../lib/email";
import { EnquiryModel, PackageModel } from "../models";

export const enquiryRouter = Router();

/** Disposable/temp email domain list (extend as needed) */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "throwam.com",
  "yopmail.com",
  "fakeinbox.com",
  "sharklasers.com",
  "guerrillamailblock.com",
]);

function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
}

enquiryRouter.post("/", async (req, res) => {
  const parse = enquirySchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(422).json({ ok: false, errors: parse.error.flatten().fieldErrors });
  }

  const enquiry = parse.data;

  // ── Honeypot: silently return ok so bots don't learn ─────────────────────
  if (enquiry.honeypot) {
    return res.status(200).json({ ok: true, enquiryId: "honeypot" });
  }

  // ── Minimum time-on-form (3 seconds) ─────────────────────────────────────
  if (enquiry.submittedAt) {
    const elapsed = Date.now() - enquiry.submittedAt;
    if (elapsed < 3_000) {
      // Silent accept — bots shouldn't know they failed
      return res.status(200).json({ ok: true, enquiryId: "too-fast" });
    }
  }

  // ── IP rate limit: 5/hour per IP ─────────────────────────────────────────
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
  if (!checkRateLimit(`enquiry:ip:${ip}`, 5)) {
    return res.status(429).json({ ok: false, error: "Too many requests. Please try again later." });
  }

  // ── Email rate limit: 3/hour per email ───────────────────────────────────
  const emailKey = enquiry.email.toLowerCase();
  if (!checkRateLimit(`enquiry:email:${emailKey}`, 3)) {
    return res.status(429).json({ ok: false, error: "Too many requests from this email. Please try again later." });
  }

  // ── Duplicate detection: same email + message within 10 minutes ──────────
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const duplicate = await EnquiryModel.findOne({
    email: enquiry.email,
    message: enquiry.message,
    createdAt: { $gte: tenMinutesAgo },
  })
    .sort({ createdAt: -1 })
    .exec();

  if (duplicate) {
    return res.status(200).json({ ok: true, enquiryId: duplicate.id });
  }

  // ── Validate packageSlug exists (null it if not) ─────────────────────────
  const pkg = enquiry.packageSlug
    ? await PackageModel.findOne({ slug: enquiry.packageSlug, published: true }).exec()
    : null;

  // ── Disposable email check ────────────────────────────────────────────────
  const suspicious = isDisposableEmail(enquiry.email);

  // ── Derive source server-side (never trust client source) ────────────────
  const source = req.headers["referer"] || req.headers["referrer"] || null;

  // ── Persist ───────────────────────────────────────────────────────────────
  const created = await EnquiryModel.create({
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone ?? undefined,
    country: enquiry.country ?? undefined,
    packageSlug: pkg ? enquiry.packageSlug : null,
    message: enquiry.message,
    source: typeof source === "string" ? source : null,
    suspicious,
    notifyStatus: "pending",
  });

  // ── Fire-and-forget emails (failures must not block) ─────────────────────
  const emailPayload = {
    name: created.name,
    email: created.email,
    phone: created.phone,
    country: created.country,
    packageSlug: created.packageSlug ?? undefined,
    message: created.message,
    enquiryId: created.id as string,
  };

  void sendEnquiryAck(emailPayload);
  void sendEnquiryNotification(emailPayload);

  // Update notifyStatus asynchronously
  setImmediate(async () => {
    try {
      await EnquiryModel.findByIdAndUpdate(created.id, { notifyStatus: "sent" }).exec();
    } catch {
      // cron will retry
    }
  });

  return res.json({ ok: true, enquiryId: created.id });
});
