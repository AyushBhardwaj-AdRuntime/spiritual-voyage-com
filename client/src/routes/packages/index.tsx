import { createFileRoute, Link } from "@tanstack/react-router";

import { CurrencyNote } from "@/components/site/CurrencyToggle";
import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import { media, photoAt } from "@/data/media";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { PackageGridSkeleton } from "@/components/site/Skeletons";
import { packages } from "@/data/packages";
import { site } from "@/data/site";
import { usePrice } from "@/lib/currency";


export const Route = createFileRoute("/packages/")({
  head: () => ({
    meta: [
      { title: `Umrah Packages — ${site.name}` },
      {
        name: "description",
        content:
          "Compare our Essential, Comfort and Premium Family Umrah packages — durations, hotel proximity, group sizes and starting prices.",
      },
      { property: "og:title", content: `Umrah Packages — ${site.name}` },
      {
        property: "og:description",
        content:
          "Essential, Comfort and Premium Family Umrah journeys to Makkah and Madinah, with clear inclusions and honest distances.",
      },
      { property: "og:url", content: "/packages" },
    ],
    links: [{ rel: "canonical", href: "/packages" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Umrah packages — ${site.name}`,
          itemListElement: packages.map((pkg, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: pkg.name,
            url: `/packages/${pkg.slug}`,
          })),
        }),
      },
    ],
  }),
  pendingComponent: () => (
    <div className="mx-auto max-w-7xl px-6 py-40 lg:px-10">
      <PackageGridSkeleton />
    </div>
  ),
  component: PackagesPage,
});


function PackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Journeys"
        title="Choose the journey that suits how you travel"
        intro="Three packages, one standard of care. The differences are in comfort, pace and proximity — never in the attention you receive."
        mediaLabel="Wide view of the Haram courtyard"
        mediaSrc={media.haramArches}
      />

      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Filter bar — presentation only for now */}
          <Reveal className="flex flex-wrap items-end gap-4 border-b border-border pb-8">
            {[
              { label: "Duration", options: ["Any duration", "Up to 10 days", "11–13 days", "14 days +"] },
              { label: "Price range", options: ["Any price", "Under ₹1,00,000", "₹1,00,000–₹2,00,000", "₹2,00,000 +"] },
              { label: "Package type", options: ["All types", "Umrah", "Umrah + Ziyarah", "Family"] },
              { label: "Sort by", options: ["Recommended", "Price: low to high", "Duration: short to long"] },
            ].map((filter) => (
              <div key={filter.label} className="flex flex-col gap-2">
                <label
                  htmlFor={`filter-${filter.label}`}
                  className="text-[0.6rem] tracking-[0.22em] text-muted-foreground uppercase"
                >
                  {filter.label}
                </label>
                <select
                  id={`filter-${filter.label}`}
                  className="h-11 min-w-52 border border-border bg-card px-3 text-sm text-foreground focus:border-gold focus:outline-none"
                >
                  {filter.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </Reveal>

          <div className="mt-16 grid gap-12 lg:grid-cols-3">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.slug} delay={i * 140}>
                <PackageCard pkg={pkg} index={i} />
              </Reveal>
            ))}
          </div>
          <CurrencyNote className="mt-8" />

          <Reveal className="mt-20 border border-border bg-card p-10 text-center">
            <h2 className="text-2xl">Nothing here fits your dates?</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              We arrange private journeys around family schedules, school holidays and Ramadan
              travel. Tell us what you need.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/custom-package" className="btn-gold">
                Request a custom or group package
              </Link>
              <Link to="/contact" className="btn-quiet text-foreground">
                Send an enquiry
              </Link>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}

function PackageCard({ pkg, index }: { pkg: (typeof packages)[number]; index: number }) {
  const price = usePrice(pkg.fromPriceInr);

  return (
    <article className="group flex h-full flex-col border border-border bg-card">
      <div className="overflow-hidden">
        <MediaPlaceholder
          label={`${pkg.name} photo`}
          src={photoAt(index)}
          className="transition-transform duration-1000 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-8">
        <p className="text-[0.6rem] tracking-[0.22em] text-gold uppercase">{pkg.type}</p>
        <h2 className="mt-4 text-2xl">{pkg.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground italic">{pkg.tagline}</p>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{pkg.shortDescription}</p>
        <dl className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Duration</dt>
            <dd className="text-right">{pkg.duration}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Hotel</dt>
            <dd className="text-right">{pkg.hotelProximity}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Group</dt>
            <dd className="text-right">{pkg.groupSize}</dd>
          </div>
        </dl>
        <p className="mt-8 flex-1 text-sm">
          From <span className="font-serif text-2xl">{price}</span>
          <span className="text-muted-foreground"> per person</span>
        </p>
        <Link to="/packages/$slug" params={{ slug: pkg.slug }} className="btn-gold mt-8">
          View details
        </Link>
      </div>
    </article>
  );
}
