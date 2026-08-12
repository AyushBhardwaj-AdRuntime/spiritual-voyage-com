import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SecurityNote } from "@/components/site/SecurityNote";
import { media } from "@/data/media";
import { nonRefundable, policyUpdated, refundTiers } from "@/data/legal";
import { site } from "@/data/site";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: `Refund & Cancellation Policy — ${site.name}` },
      {
        name: "description",
        content:
          "Exactly what happens if you need to cancel or postpone your Umrah journey — refund windows, non-refundable costs, visa refusals and how long a refund takes.",
      },
      { property: "og:title", content: `Refund & Cancellation Policy — ${site.name}` },
      {
        property: "og:description",
        content: "Clear refund windows, honest non-refundable costs, and what happens if a visa is refused.",
      },
      { property: "og:url", content: "/refund-policy" },
    ],
    links: [{ rel: "canonical", href: "/refund-policy" }],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Refund & Cancellation Policy"
        intro="Plans change — illness, work, family. This page tells you what you get back and what you do not, before you commit a single rupee."
        mediaLabel="Pilgrims in the courtyard"
        mediaSrc={media.haramDawn}
      />

      <section className="bg-background py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <p className="text-[0.6rem] tracking-[0.22em] text-muted-foreground uppercase">
            Last updated {policyUpdated}
          </p>

          <Reveal className="mt-14">
            <h2 className="text-2xl">How to cancel</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Write to{" "}
              <a href={`mailto:${site.email}`} className="link-quiet">
                {site.email}
              </a>{" "}
              or message us on WhatsApp. Your cancellation takes effect from the moment we
              acknowledge it in writing, and the refund window below is measured from that date.
            </p>
          </Reveal>

          <Reveal className="mt-14">
            <h2 className="text-2xl">Refund windows</h2>
            <div className="mt-8 border border-border">
              {refundTiers.map((tier) => (
                <div
                  key={tier.window}
                  className="grid gap-3 border-b border-border p-6 last:border-b-0 sm:grid-cols-[220px_1fr] sm:gap-8"
                >
                  <p className="font-serif text-lg">{tier.window}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{tier.outcome}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-14">
            <h2 className="text-2xl">Always non-refundable</h2>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {nonRefundable.map((item) => (
                <li key={item} className="flex gap-3">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-14 grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-2xl">If your visa is refused</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                A refusal is not a cancellation by you. We refund everything our suppliers release,
                and we do not keep a service charge for a journey you were never able to take. The
                visa authority's own fees, once submitted, cannot be recovered.
              </p>
            </div>
            <div>
              <h2 className="text-2xl">If we cancel</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                If we cannot operate a departure, you choose: move to another date at no extra
                service cost, or take a full refund of everything you have paid us.
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-14">
            <h2 className="text-2xl">How long a refund takes</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              We approve refunds within 7 working days of agreeing the amount and return them by the
              same route the money arrived. Bank and card networks may add a further 5 to 10 working
              days at their end.
            </p>
          </Reveal>

          <Reveal className="mt-14">
            <SecurityNote />
          </Reveal>

          <Reveal className="mt-14 flex flex-wrap gap-3">
            <Link to="/contact" className="btn-gold">
              Ask us about a specific case
            </Link>
            <Link to="/terms" className="btn-quiet text-foreground">
              Full Terms &amp; Conditions
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
