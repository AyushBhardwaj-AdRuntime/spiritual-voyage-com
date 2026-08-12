import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { CurrencyNote } from "@/components/site/CurrencyToggle";
import { media } from "@/data/media";
import { packages } from "@/data/packages";
import { site, whatsappLink } from "@/data/site";
import { Price } from "@/lib/currency";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: `Compare Umrah Packages — ${site.name}` },
      {
        name: "description",
        content:
          "See our Umrah and Ziyarah packages side by side — duration, hotel distance, group size, inclusions and starting price — and choose the journey that fits your family.",
      },
      { property: "og:title", content: `Compare Umrah Packages — ${site.name}` },
      {
        property: "og:description",
        content: "Duration, hotels, inclusions and prices for every package, in one view.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/compare" },
    ],
    links: [{ rel: "canonical", href: "/compare" }],
  }),
  component: ComparePage,
});


const rowLabel = "text-[0.6rem] tracking-[0.22em] text-muted-foreground uppercase";

function ComparePage() {
  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="Three journeys, side by side"
        intro="The differences between our packages are mostly about distance, pace and room comfort — never about the care you receive. Read them together and pick what suits your family."
        mediaLabel="Pilgrims at the Haram"
        mediaSrc={media.kabah}
      />

      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="w-48 border-b border-border p-4 text-left align-bottom">
                      <span className={rowLabel}>Package</span>
                    </th>
                    {packages.map((pkg) => (
                      <th key={pkg.slug} className="border-b border-border p-4 text-left align-bottom">
                        <span className="block font-serif text-2xl font-normal">{pkg.name}</span>
                        <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
                          {pkg.tagline}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className={`border-b border-border p-4 text-left ${rowLabel}`}>
                      From (per person)
                    </th>
                    {packages.map((pkg) => (
                      <td key={pkg.slug} className="border-b border-border p-4">
                        <span className="font-serif text-2xl text-gold">
                          <Price inr={pkg.fromPriceInr} />
                        </span>
                      </td>
                    ))}
                  </tr>
                  {(
                    [
                      ["Duration", (p: (typeof packages)[number]) => p.duration],
                      ["Journey type", (p: (typeof packages)[number]) => p.type],
                      ["Hotel", (p: (typeof packages)[number]) => p.hotelProximity],
                      ["Group size", (p: (typeof packages)[number]) => p.groupSize],
                    ] as const
                  ).map(([label, get]) => (
                    <tr key={label}>
                      <th scope="row" className={`border-b border-border p-4 text-left ${rowLabel}`}>
                        {label}
                      </th>
                      {packages.map((pkg) => (
                        <td key={pkg.slug} className="border-b border-border p-4 leading-relaxed">
                          {get(pkg)}
                        </td>
                      ))}
                    </tr>
                  ))}

                  <tr>
                    <th scope="row" className={`border-b border-border p-4 text-left align-top ${rowLabel}`}>
                      What's included
                    </th>
                    {packages.map((pkg) => (
                      <td key={pkg.slug} className="border-b border-border p-4 align-top">
                        <ul className="space-y-2.5">
                          {pkg.included.map((item) => (
                            <li key={item} className="flex gap-2.5 text-xs leading-relaxed">
                              <Check className="mt-0.5 size-3.5 shrink-0 text-gold" aria-hidden />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <th scope="row" className={`border-b border-border p-4 text-left align-top ${rowLabel}`}>
                      Not included
                    </th>
                    {packages.map((pkg) => (
                      <td key={pkg.slug} className="border-b border-border p-4 align-top">
                        <ul className="space-y-2.5">
                          {pkg.notIncluded.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground"
                            >
                              <Minus className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>


                  <tr>
                    <th scope="row" className="p-4" />
                    {packages.map((pkg) => (
                      <td key={pkg.slug} className="p-4">
                        <div className="flex flex-col gap-3">
                          <Link to="/packages/$slug" params={{ slug: pkg.slug }} className="btn-gold">
                            View details
                          </Link>
                          <a
                            href={whatsappLink(
                              `Assalamu alaikum — I'd like to ask about the ${pkg.name} package.`,
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-quiet"
                          >
                            Ask on WhatsApp
                          </a>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <CurrencyNote className="mt-6" />
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Still unsure? Tell us who is travelling and we will suggest the closest fit —{" "}
              <Link to="/custom-package" className="link-quiet text-gold">
                request a custom journey
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
