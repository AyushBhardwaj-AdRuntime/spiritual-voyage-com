# SafarXGlobal — Backend API Specification

Every endpoint the site needs, what it accepts, what it returns, and the edge
cases that must be handled. Written against the current frontend (TanStack
Start). App-internal calls should be `createServerFn`; anything an external
service calls (payment webhooks, cron) must be a server route under
`src/routes/api/public/*` with signature verification.

Legend: **SF** = server function (`createServerFn`), **PUB** = public HTTP route.

---

## 1. Enquiries & leads

### 1.1 `submitEnquiry` — SF, POST
Powers the Contact page form.

Input
| field | type | rules |
|---|---|---|
| name | string | required, 2–80 chars |
| email | string | required, valid email, ≤160 |
| phone | string | optional, E.164-ish, 7–20 chars |
| country | string | optional, ≤60 |
| packageSlug | string | optional, must exist in packages |
| message | string | required, 10–2000 chars |
| source | string | derived server-side (page path / UTM), never trusted from client |

Returns `{ ok: true, enquiryId }`.
Side effects: insert row in `enquiries`, notification email to sales inbox,
auto-acknowledgement email to the enquirer (24h promise).

Edge cases
- Duplicate submit (double-click / retry): dedupe on `email + hash(message)` within 10 minutes, return the original `enquiryId` instead of a second row.
- Spam / bots: honeypot field + minimum time-on-form + rate limit per IP (e.g. 5/hour) and per email (3/hour). Reject silently with `ok: true` for honeypot hits so bots don't learn.
- Email provider down: still persist the row, mark `notify_status = 'pending'`, retry via cron. Never fail the user's submission because email failed.
- Unicode / RTL names and Arabic message text must round-trip; do not strip non-ASCII.
- Oversized message → 422 with a field-level error, not a 500.
- `packageSlug` that no longer exists → accept the enquiry, null the reference, log a warning.
- Disposable/invalid domain: accept but flag `suspicious = true` for triage.

### 1.2 `submitCustomPackageRequest` — SF, POST
Powers `/custom-package`.

Input: name*, email*, phone, departureCity, groupType (enum: family | friends | corporate | solo | other), travellers (int 1–200), dates (free text), nights (free text), budget (free text), rooms (enum: sharing | twin | triple | quad | private), needs (≤3000).

Edge cases
- `travellers` non-numeric, 0, negative, or absurd (>200) → 422.
- Enum values outside the allowlist → 422 (never insert raw client strings).
- Free-text date/budget fields must be length-capped and HTML-escaped on render in the notification email (email HTML injection).
- Large group requests (>25) should route to a different notification queue/priority flag.

### 1.3 `subscribeNewsletter` — SF, POST (if a newsletter is added)
- Double opt-in: store `pending`, email a signed token, confirm via `GET /api/public/newsletter/confirm?token=`.
- Edge cases: already subscribed (idempotent success), previously unsubscribed (require fresh opt-in), expired token (24h), token reuse (single-use), unsubscribe link in every email.

---

## 2. Packages & content

### 2.1 `listPackages` — SF, GET
Returns published packages with price, duration, hotel distances, inclusions.
Query: `?type=`, `?nights=`, `?sort=price|duration`, `?page=`, `?limit=` (default 12, max 48).

Edge cases
- Unknown filter values → ignore, don't 500.
- `page` beyond the last page → empty array + correct `total`, not an error.
- Cache with a short TTL; must invalidate when a package is edited in admin.

### 2.2 `getPackage` — SF, GET
Input: `slug`.
Returns package detail: story, itinerary days, inclusions/exclusions, FAQs, gallery refs, `fromPriceInr`, departures.

Edge cases
- Unknown slug → `notFound()` so the route renders the 404 page (not a blank crash).
- Unpublished/draft slug → 404 for the public, visible only with an admin session.
- Renamed slug → keep a `slug_aliases` table and 301 to the current slug (protects SEO).

### 2.3 `listDepartures` — SF, GET
Input: `packageSlug`. Returns dates, seats total/remaining, price override, status.

Edge cases
- Past departures excluded by server time (UTC), never by client clock.
- Sold out → returned with `status: 'sold_out'` rather than hidden, so the UI can say so.
- Seats remaining must be computed from confirmed bookings, not a manually-edited counter.

### 2.4 `getExchangeRates` — SF, GET
Backs the currency toggle (INR/USD/GBP/SAR) with live mid-market rates.

Edge cases
- Provider timeout or 429 → return the last cached rates plus `stale: true` and `fetchedAt`; never block the page.
- Cold cache and provider down → fall back to the hard-coded rates already in `src/lib/currency.tsx`.
- Cache 6–12h; rates are indicative only — the UI must keep the "approximate" note and INR stays the billing currency.

### 2.5 `getFaqs` — SF, GET
Returns grouped FAQ items. **Rule:** items marked `pending` are returned with the "we'll confirm for you" note and must be excluded from FAQPage JSON-LD.

---

## 3. Booking flow

### 3.1 `createBookingDraft` — SF, POST
Step 1–2 of `/booking`: package/departure + lead traveller details.

Input: packageSlug*, departureId*, travellers (int ≥1), leadName*, leadEmail*, leadPhone*, leadCountry*, roomPreference, departMonth, notes.
Returns `{ bookingId, reference, status: 'draft', priceQuote }`.

Edge cases
- Price must be recalculated server-side; **never trust a client-sent amount**.
- Departure sold out or fewer seats than `travellers` → 409 with remaining seats so the UI can offer alternatives.
- Departure in the past or closed → 409.
- Hold seats for a limited window (e.g. 20 minutes) and release on expiry via cron; otherwise abandoned drafts block inventory.
- Concurrent bookings for the last seat: reserve inside a transaction with a row lock / conditional update, so two users cannot both succeed.
- Resubmitting the same draft (back button) must update the existing draft, not create duplicates — use an idempotency key.

### 3.2 `addTravellers` — SF, POST
Passport-level details per traveller (name as on passport, DOB, gender, passport number, expiry, nationality, mahram relation where relevant).

Edge cases
- Traveller count must match the booking; reject mismatch.
- Passport expiry < 6 months after return date → return a blocking validation warning (Saudi requirement).
- DOB implying a minor → require guardian linkage; women travelling under mahram rules → require relation field.
- Passport numbers are sensitive: store encrypted at rest, never log, never return in full (mask to last 4).
- Duplicate passport number inside one booking → 422.

### 3.3 `getBooking` — SF, GET
Input: `reference` + email (or authenticated user).
Edge cases: wrong reference/email pair → generic "not found" (no enumeration hints); rate limit lookups; never expose other travellers' documents.

### 3.4 `cancelBooking` — SF, POST
Applies the published refund tiers from `src/data/legal.ts`.
Edge cases
- Cancellation after departure or already-cancelled → 409, idempotent.
- Refund amount computed server-side from tier + days-to-departure using UTC dates; store the tier applied for audit.
- Non-refundable components (visa fee, air ticket) excluded from the calculation and itemised in the response.
- Partial cancellation (one traveller of four) must recompute room pricing.

---

## 4. Payments (Stripe — not yet wired)

### 4.1 `createCheckoutSession` — SF, POST
Input: `bookingId`, `mode: 'deposit' | 'full'`.
Server derives the amount from the booking. Returns Stripe Checkout URL.

Edge cases
- Booking not in a payable state (draft incomplete, cancelled, already paid) → 409.
- Currency: charge in one settlement currency (INR) and treat the toggle as display-only; if multi-currency is enabled, snapshot the rate on the session and honour it.
- Never create a session if seats are no longer available.
- Idempotency key per booking+mode so double-clicks reuse the session.

### 4.2 `POST /api/public/webhooks/stripe` — PUB
The only place a booking becomes `confirmed`.

Must handle: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`, `charge.dispute.created`.

Edge cases
- **Verify the signature over the raw body** before parsing; reject 401 otherwise.
- Replay / duplicate delivery: store `stripe_event_id` unique and no-op on repeats (Stripe retries aggressively).
- Out-of-order delivery: apply state transitions by event type, never blindly overwrite a later state.
- Payment succeeds after the seat hold expired and the seat is gone → confirm the payment, flag `needs_manual_resolution`, alert ops, and email the customer honestly (do not silently keep their money).
- Always return 2xx once persisted, even if the confirmation email fails — email retries belong to cron.
- Amount/currency mismatch vs. the booking → do not confirm; flag for review.

### 4.3 `POST /api/public/webhooks/stripe/refund` (or handle in 4.2)
Edge cases: partial refunds, refunds initiated in the Stripe dashboard (must sync back), refund on an already-cancelled booking.

---

## 5. Documents & notifications

### 5.1 `generateItineraryPdf` — SF, POST (optional upgrade over `window.print()`)
Input: packageSlug or bookingId. Returns a signed, short-lived URL.
Edge cases: unknown slug → 404; large itineraries must not time out the worker (pre-generate and cache per package version); signed URL expiry (15 min) and no directory listing.

### 5.2 `sendBookingConfirmation` / `sendEnquiryAck` — internal, queue-driven
Edge cases: hard bounce (mark email invalid, notify ops), soft bounce (retry with backoff, max 5), provider rate limit (queue), unsubscribe must never block transactional mail, template must render Arabic/RTL and long names.

### 5.3 `POST /api/public/cron/*` — PUB (pg_cron or external scheduler)
- `release-expired-holds` — frees seats from abandoned drafts.
- `retry-notifications` — resends `pending` notifications.
- `refresh-exchange-rates` — warms the rate cache.

Edge cases: require a shared secret header compared in constant time; make every job idempotent (safe to run twice); guard against overlapping runs with an advisory lock; log start/finish with counts.

---

## 6. Admin (auth required, role-gated)

Roles live in a separate `user_roles` table checked through a `has_role`
security-definer function — never a flag on the profile row.

| Endpoint | Purpose |
|---|---|
| `listEnquiries` | inbox with status filters, pagination |
| `updateEnquiryStatus` | new → contacted → won/lost, with note |
| `listBookings` | filter by status/departure |
| `updateBookingStatus` | manual confirm, mark documents received |
| `upsertPackage` / `publishPackage` | content editing, draft vs published |
| `upsertDeparture` | dates, seats, price overrides |
| `uploadGalleryImage` | media management |

Edge cases
- Every admin endpoint verifies the role server-side; a client-side check is not a control.
- Never decide admin status with a service-role client — check the role as the user first.
- Optimistic-concurrency on content edits (`updated_at` compare) so two editors don't silently overwrite.
- Audit log for status changes, refunds and content publishes (who, when, before/after).
- Deleting a package with bookings must be blocked — unpublish instead.

---

## 7. Cross-cutting rules

**Validation** — Zod on every input, at the boundary. Min/max on all strings, arrays and numbers. Enums allowlisted. Reject unknown fields.

**Authorisation** — public reads go through narrow anon-readable policies; anything user-specific requires an authenticated session; privileged writes verify role before touching a service-role client. Never call a protected server function from a public route loader (SSR has no session).

**Money** — store minor units as integers, never floats. Recompute all totals server-side. Persist the currency and the rate used.

**Time** — everything stored UTC; departure cut-offs and refund tiers computed from server time; display in the user's locale only.

**Idempotency** — every state-changing endpoint accepts an idempotency key or is naturally idempotent. Webhooks and cron must be safe to replay.

**Rate limiting** — per IP and per identifier on enquiry, booking, lookup and PDF endpoints. Note: there is no built-in limiter in the app runtime, so this needs an explicit implementation (e.g. a counter table with a time window).

**Errors** — 400/422 for validation with field-level messages, 401/403 for auth, 404 for missing, 409 for conflicts (sold out, wrong state), 429 for rate limits, 5xx only for genuine faults. Log provider details server-side; return safe messages to users.

**Privacy** — passport data and phone numbers are personal data: encrypt sensitive columns, mask in responses, exclude from logs and analytics, and honour deletion requests per the Privacy Policy. Plausible (not GA4) is the analytics layer and must receive no PII.

**Observability** — structured logs with a request id, alerts on webhook failures, `needs_manual_resolution` bookings and notification backlogs.

---

## 8. Suggested tables

`enquiries`, `custom_requests`, `packages`, `package_departures`, `package_slug_aliases`, `bookings`, `booking_travellers`, `payments`, `webhook_events`, `notifications`, `exchange_rates_cache`, `gallery_media`, `user_roles`, `audit_log`, `rate_limits`.

Every table in the public schema needs explicit grants alongside RLS —
`GRANT` for `authenticated` and `service_role`, and `anon` SELECT only where a
policy genuinely allows public reads (packages, departures, gallery, FAQs).
