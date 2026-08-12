import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, AlertCircle } from "lucide-react";
import { useState, useId } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { CurrencyNote } from "@/components/site/CurrencyToggle";
import { PageHero } from "@/components/site/PageHero";
import { media } from "@/data/media";
import { Reveal } from "@/components/site/Reveal";
import { SecurityNote } from "@/components/site/SecurityNote";
import { packages, type TourPackage } from "@/data/packages";
import { site } from "@/data/site";
import { Price, usePrice } from "@/lib/currency";
import { api, ApiRequestError } from "@/lib/api";

const searchSchema = z.object({
  package: z.string().optional(),
  success: z.string().optional(),
  ref: z.string().optional(),
});

export const Route = createFileRoute("/booking")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: `Book a Journey — ${site.name}` },
      {
        name: "description",
        content:
          "Start your Umrah booking: choose a package, share traveller details, and we confirm availability before any payment is taken.",
      },
      { property: "og:title", content: `Book a Journey — ${site.name}` },
      {
        property: "og:description",
        content: "Choose your package and share traveller details. We confirm before any payment.",
      },
      { property: "og:url", content: "/booking" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/booking" }],
  }),
  component: BookingPage,
});

const fieldClass =
  "h-12 w-full border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none";
const labelClass = "text-[0.6rem] tracking-[0.22em] text-muted-foreground uppercase";

interface BookingResult {
  reference: string;
  packageName: string;
  priceQuote: number;
  checkoutUrl: string | null;
  message?: string;
}

function BookingPage() {
  const search = Route.useSearch();
  const fallback = packages[0] as TourPackage;
  const [slug, setSlug] = useState(search.package ?? fallback.slug);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const idKey = useId();

  const selected: TourPackage = packages.find((p) => p.slug === slug) ?? fallback;
  const price = usePrice(selected.fromPriceInr);

  // Stripe success redirect
  if (search.success === "1" && search.ref) {
    return (
      <>
        <PageHero
          eyebrow="Confirmed"
          title="Your booking is confirmed"
          intro="Thank you for your payment. We will be in touch shortly with your full travel documents."
        />
        <section className="bg-background py-24">
          <div className="mx-auto max-w-2xl px-6 text-center lg:px-10">
            <Reveal>
              <span className="mx-auto inline-flex size-14 items-center justify-center border border-gold text-gold">
                <Check className="size-6" aria-hidden />
              </span>
              <h2 className="mt-10 text-3xl">Booking {search.ref}</h2>
              <p className="mt-8 text-base leading-relaxed text-muted-foreground">
                {site.responsePromise} If it is easier to talk, message us on WhatsApp and mention
                your booking reference — we will find your request.
              </p>
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <a href={site.whatsapp} target="_blank" rel="noreferrer" className="btn-gold">
                  Message on WhatsApp
                </a>
                <Link to="/" className="btn-quiet text-foreground">
                  Return home
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </>
    );
  }

  if (result) {
    return (
      <>
        <PageHero
          eyebrow="Step 3 of 3"
          title="Your request has reached us"
          intro="Nothing has been charged. A member of our team will confirm availability and walk you through payment personally."
        />
        <section className="bg-background py-24">
          <div className="mx-auto max-w-2xl px-6 text-center lg:px-10">
            <Reveal>
              <span className="mx-auto inline-flex size-14 items-center justify-center border border-gold text-gold">
                <Check className="size-6" aria-hidden />
              </span>
              <h2 className="mt-10 text-3xl">{result.packageName}</h2>
              <p className="mt-3 text-sm text-muted-foreground">Reference: {result.reference}</p>
              {result.priceQuote > 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Total: ₹{result.priceQuote.toLocaleString("en-IN")}
                </p>
              )}

              {result.checkoutUrl ? (
                <div className="mt-10">
                  <p className="text-sm text-muted-foreground">
                    Click below to complete your deposit payment securely via Stripe.
                  </p>
                  <a href={result.checkoutUrl} className="btn-gold mt-6 inline-block">
                    Pay deposit now
                  </a>
                </div>
              ) : (
                <p className="mt-8 text-base leading-relaxed text-muted-foreground">
                  {result.message ?? site.responsePromise} If it is easier to talk, message us on WhatsApp and mention
                  your name — we will find your request.
                </p>
              )}

              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <a href={site.whatsapp} target="_blank" rel="noreferrer" className="btn-gold">
                  Message on WhatsApp
                </a>
                <Link to="/" className="btn-quiet text-foreground">
                  Return home
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="Begin your booking"
        intro="Two short steps. No payment is taken here — we confirm availability with you first."
        mediaLabel="Pilgrims arriving at the Haram"
        mediaSrc={media.haramArches}
      />

      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_360px] lg:px-10">
          <div>
            {/* Step 1 — package */}
            <Reveal>
              <p className="eyebrow">Step 1 of 3</p>
              <h2 className="mt-6 text-3xl">Choose your journey</h2>
              <div className="mt-8 space-y-4">
                {packages.map((pkg) => (
                  <label
                    key={pkg.slug}
                    className={
                      "flex cursor-pointer gap-4 border p-6 transition-colors " +
                      (slug === pkg.slug ? "border-gold bg-card" : "border-border hover:border-gold/60")
                    }
                  >
                    <input
                      type="radio"
                      name="package"
                      value={pkg.slug}
                      checked={slug === pkg.slug}
                      onChange={() => setSlug(pkg.slug)}
                      className="mt-1 size-4 accent-[var(--color-gold)]"
                    />
                    <span className="min-w-0">
                      <span className="block font-serif text-xl">{pkg.name}</span>
                      <span className="mt-1 block text-xs tracking-[0.18em] text-gold uppercase">
                        {pkg.duration} · {pkg.type}
                      </span>
                      <span className="mt-3 block text-sm leading-relaxed text-muted-foreground">
                        {pkg.shortDescription}
                      </span>
                      <span className="mt-4 block text-sm">
                        From <span className="font-serif text-xl"><Price inr={pkg.fromPriceInr} /></span> per person
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </Reveal>

            {/* Step 2 — travellers */}
            <Reveal className="mt-20">
              <p className="eyebrow">Step 2 of 3</p>
              <h2 className="mt-6 text-3xl">Traveller details</h2>

              {serverError && (
                <div className="mt-6 flex items-start gap-3 border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <p>{serverError}</p>
                </div>
              )}

              <form
                id="booking-form"
                className="mt-8 grid gap-6 sm:grid-cols-2"
                onSubmit={async (event) => {
                  event.preventDefault();
                  setSubmitting(true);
                  setServerError(null);

                  const form = event.currentTarget;
                  const data = new FormData(form);
                  const travellerCount = parseInt(data.get("travellers") as string, 10) || 1;

                  try {
                    // Step 1: create the booking draft (gets server-computed price)
                    const draft = await api.bookings.createDraft({
                      packageSlug: slug,
                      departureId: selected.slug, // In production this would be a real departure ID
                      travellers: travellerCount,
                      leadName: data.get("lead-name") as string,
                      leadEmail: data.get("lead-email") as string,
                      leadPhone: data.get("lead-phone") as string,
                      leadCountry: data.get("lead-country") as string,
                      ...((data.get("depart") as string) ? { departMonth: data.get("depart") as string } : {}),
                      ...((data.get("notes") as string) ? { notes: data.get("notes") as string } : {}),
                      idempotencyKey: `${idKey}-${slug}-${Date.now()}`,
                    });

                    // Step 2: attempt checkout (deposit)
                    let checkoutUrl: string | null = null;
                    let checkoutMessage: string | undefined;

                    try {
                      const checkout = await api.bookings.checkout({
                        bookingId: draft.bookingId,
                        mode: "deposit",
                      });
                      checkoutUrl = checkout.checkoutUrl;
                      checkoutMessage = checkout.message;

                      // If Stripe returned a URL, redirect immediately
                      if (checkoutUrl) {
                        window.location.href = checkoutUrl;
                        return;
                      }
                    } catch {
                      // Checkout failure is non-fatal — still show confirmation
                      checkoutMessage = "Our team will contact you shortly to arrange payment.";
                    }

                    setResult({
                      reference: draft.reference,
                      packageName: selected.name,
                      priceQuote: draft.priceQuote,
                      checkoutUrl,
                      ...(checkoutMessage ? { message: checkoutMessage } : {}),
                    });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } catch (err) {
                    if (err instanceof ApiRequestError) {
                      if (err.status === 409) {
                        setServerError(err.payload.error ?? "This departure is no longer available. Please choose another.");
                      } else if (err.status === 422) {
                        setServerError(err.firstFieldError ?? "Please check the form for errors.");
                      } else {
                        setServerError("Something went wrong. Please try again or contact us directly.");
                      }
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } else {
                      setServerError("Network error. Please check your connection and try again.");
                    }
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="lead-name" className={labelClass}>
                    Lead traveller name
                  </label>
                  <input id="lead-name" name="lead-name" required autoComplete="name" className={fieldClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lead-email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="lead-email"
                    name="lead-email"
                    type="email"
                    required
                    autoComplete="email"
                    className={fieldClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lead-phone" className={labelClass}>
                    Phone / WhatsApp
                  </label>
                  <input id="lead-phone" name="lead-phone" type="tel" required autoComplete="tel" className={fieldClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lead-country" className={labelClass}>
                    Departing from (city, country)
                  </label>
                  <input id="lead-country" name="lead-country" required className={fieldClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="travellers" className={labelClass}>
                    Number of travellers
                  </label>
                  <input
                    id="travellers"
                    name="travellers"
                    type="number"
                    min={1}
                    max={40}
                    defaultValue={1}
                    className={fieldClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="depart" className={labelClass}>
                    Preferred departure month
                  </label>
                  <input id="depart" name="depart" type="month" className={fieldClass} />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="notes" className={labelClass}>
                    Anything we should know
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={5}
                    placeholder="Wheelchair assistance, travelling with children, room preferences…"
                    className="w-full border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" disabled={submitting} className="btn-gold disabled:opacity-60">
                    {submitting ? "Submitting…" : "Continue to payment"}
                  </button>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Nothing is charged at this step. We confirm availability first.
                  </p>
                </div>
              </form>
            </Reveal>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-border bg-card p-8">
              <p className={labelClass}>Your selection</p>
              <h2 className="mt-4 text-2xl">{selected.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground italic">{selected.tagline}</p>
              <dl className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Duration</dt>
                  <dd className="text-right">{selected.duration}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Hotel</dt>
                  <dd className="text-right">{selected.hotelProximity}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Group</dt>
                  <dd className="text-right">{selected.groupSize}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-border pt-3">
                  <dt className="text-muted-foreground">From</dt>
                  <dd className="text-right font-serif text-xl">{price}</dd>
                </div>
              </dl>
              <CurrencyNote className="mt-4" />
              <Link
                to="/packages/$slug"
                params={{ slug: selected.slug }}
                className="link-quiet mt-8 inline-block text-[0.65rem] tracking-[0.2em] uppercase"
              >
                Read full details
              </Link>
            </div>
            <SecurityNote className="mt-6" />
            <div className="mt-6 border border-border bg-card p-6 text-xs leading-relaxed text-muted-foreground">
              By continuing you agree to our{" "}
              <Link to="/terms" className="link-quiet text-foreground">
                Terms &amp; Conditions
              </Link>
              ,{" "}
              <Link to="/privacy" className="link-quiet text-foreground">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/refund-policy" className="link-quiet text-foreground">
                Refund &amp; Cancellation Policy
              </Link>
              .
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
