import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Rate-limit helper (in-memory, resets on process restart)           */
/*  For production replace with a Redis or DB-backed counter           */
/* ------------------------------------------------------------------ */

const rlStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxPerHour: number): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const entry = rlStore.get(key);

  if (!entry || now > entry.resetAt) {
    rlStore.set(key, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }

  if (entry.count >= maxPerHour) {
    return false; // blocked
  }

  entry.count += 1;
  return true; // allowed
}

/* ------------------------------------------------------------------ */
/*  Validators                                                          */
/* ------------------------------------------------------------------ */

export const enquirySchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(160),
  phone: z.string().min(7).max(20).optional().nullable(),
  country: z.string().max(60).optional().nullable(),
  packageSlug: z.string().optional().nullable(),
  message: z.string().min(10).max(2000),
  source: z.string().optional().nullable(),
  honeypot: z.string().optional().nullable(),
  submittedAt: z.number().optional().nullable(), // epoch ms, sent by client
});

export const customRequestSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(160),
  phone: z.string().min(7).max(20).optional().nullable(),
  departureCity: z.string().max(100).optional().nullable(),
  groupType: z.enum(["family", "friends", "corporate", "solo", "other"]),
  travellers: z
    .number()
    .int()
    .min(1, "At least 1 traveller required")
    .max(200, "Maximum 200 travellers"),
  dates: z.string().max(500).optional().nullable(),
  nights: z.string().max(500).optional().nullable(),
  budget: z.string().max(500).optional().nullable(),
  rooms: z.enum(["sharing", "twin", "triple", "quad", "private"]),
  needs: z.string().max(3000).optional().nullable(),
});

export const packageQuerySchema = z.object({
  type: z.string().optional(),
  nights: z.string().optional(),
  sort: z.enum(["price", "duration"]).optional(),
  page: z.string().regex(/^[0-9]+$/).optional(),
  limit: z.string().regex(/^[0-9]+$/).optional(),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1),
});

export const bookingDraftSchema = z.object({
  packageSlug: z.string().min(1),
  departureId: z.string().min(1),
  travellers: z.number().int().min(1),
  leadName: z.string().min(2),
  leadEmail: z.string().email().max(160),
  leadPhone: z.string().min(7).max(20),
  leadCountry: z.string().min(2).max(60),
  roomPreference: z.string().max(100).optional().nullable(),
  departMonth: z.string().max(100).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  idempotencyKey: z.string().optional().nullable(),
});

export const bookingTravellerSchema = z.object({
  bookingId: z.string().min(1),
  travellers: z.number().int().min(1),
  details: z.array(
    z.object({
      name: z.string().min(2),
      dob: z.string().refine((v) => !Number.isNaN(Date.parse(v)), { message: "Invalid date" }),
      gender: z.enum(["male", "female", "other"]),
      passportNumber: z.string().min(3),
      passportExpiry: z.string().refine((v) => !Number.isNaN(Date.parse(v)), { message: "Invalid date" }),
      nationality: z.string().min(2),
      mahramRelation: z.string().max(100).optional().nullable(),
    }),
  ),
});

export const bookingLookupSchema = z.object({
  reference: z.string().min(1),
  email: z.string().email(),
});

export const cancelBookingSchema = z.object({
  reference: z.string().min(1),
  email: z.string().email(),
});

export const checkoutSchema = z.object({
  bookingId: z.string().min(1),
  mode: z.enum(["deposit", "full"]),
});
