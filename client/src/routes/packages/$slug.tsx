import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Download, MessageCircle, X } from "lucide-react";

import { CurrencyNote } from "@/components/site/CurrencyToggle";
import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import { photoAt } from "@/data/media";
import { Reveal } from "@/components/site/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getPackage, type TourPackage } from "@/data/packages";
import { site, whatsappLink } from "@/data/site";
import { usePrice } from "@/lib/currency";


export const Route = createFileRoute("/packages/$slug")({
  loader: ({ params }) => {
    const pkg = getPackage(params.slug);
    if (!pkg) throw notFound();
    return { pkg };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: `Package unavailable — ${site.name}` }, { name: "robots", content: "noindex" }],
      };
    }
    const { pkg } = loaderData;
    return {
      meta: [
        { title: `${pkg.name} — ${pkg.duration} Umrah Journey | ${site.name}` },
        { name: "description", content: pkg.shortDescription },
        { property: "og:title", content: `${pkg.name} — ${site.name}` },
        { property: "og:description", content: pkg.shortDescription },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/packages/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/packages/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: pkg.name,
            description: pkg.shortDescription,
            brand: { "@type": "Organization", name: site.name },
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: pkg.fromPriceInr,
              availability: "https://schema.org/InStock",
              url: `/packages/${params.slug}`,
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: pkg.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        },
      ],
    };
  },

  component: PackageDetail,
});

function PackageDetail() {
  const { pkg } = Route.useLoaderData() as { pkg: TourPackage };
  const price = usePrice(pkg.fromPriceInr);


  return (
    <>
      {/* Banner */}
      <section className="relative isolate flex min-h-[70vh] items-end overflow-hidden bg-navy">
        <div className="absolute inset-0">
          {/* REPLACE: banner image for {pkg.name} */}
          <MediaPlaceholder
            label={`${pkg.name} banner`}
            src={photoAt(pkg.slug.length)}
            aspect=""
            className="h-full w-full opacity-25"
          />
        </div>
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-navy via-navy/70 to-navy/30" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pt-40 pb-20 lg:px-10">
          <Link
            to="/packages"
            className="link-quiet text-[0.65rem] tracking-[0.22em] text-cream/70 uppercase"
          >
            All journeys
          </Link>
          <p className="eyebrow mt-8">{pkg.type}</p>
          <h1 className="mt-6 max-w-3xl text-4xl text-cream sm:text-5xl lg:text-6xl">{pkg.name}</h1>
          <p className="mt-6 max-w-xl text-base text-cream/75 italic">{pkg.tagline}</p>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_360px] lg:px-10">
          <div>
            {/* Story */}
            <Reveal>
              <p className="eyebrow">The journey</p>
              <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
                {pkg.story.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
            </Reveal>

            {/* Highlights */}
            <Reveal className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {pkg.highlights.map((h) => (
                <div key={h.label} className="bg-card p-6">
                  <p className="text-[0.6rem] tracking-[0.22em] text-muted-foreground uppercase">
                    {h.label}
                  </p>
                  <p className="mt-3 font-serif text-lg">{h.value}</p>
                </div>
              ))}
            </Reveal>

            {/* Itinerary */}
            <Reveal className="mt-20">
              <h2 className="text-3xl">Day by day</h2>
              <Accordion type="single" collapsible className="mt-8 border-t border-border">
                {pkg.itinerary.map((day) => (
                  <AccordionItem key={day.day} value={day.day} className="border-b border-border">
                    <AccordionTrigger className="py-6 text-left hover:no-underline">
                      <span className="flex flex-col gap-1 pr-4 sm:flex-row sm:items-baseline sm:gap-6">
                        <span className="text-[0.6rem] tracking-[0.22em] text-gold uppercase">
                          {day.day}
                        </span>
                        <span className="font-serif text-xl">{day.title}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground">
                      {day.body}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>

            {/* Included / not included */}
            <Reveal className="mt-20 grid gap-12 sm:grid-cols-2">
              <div>
                <h2 className="text-2xl">What's included</h2>
                <ul className="mt-6 space-y-3 text-sm">
                  {pkg.included.map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl">Not included</h2>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {pkg.notIncluded.map((item) => (
                    <li key={item} className="flex gap-3">
                      <X className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Package gallery */}
            <Reveal className="mt-20">
              <h2 className="text-2xl">From this journey</h2>
              <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {pkg.galleryCaptions.map((caption, gi) => (
                  <div key={caption} className="overflow-hidden">
                    <MediaPlaceholder
                      label={caption}
                      src={photoAt(gi)}
                      aspect="aspect-square"
                      className="transition-transform duration-1000 ease-out hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </Reveal>

            {/* FAQ */}
            <Reveal className="mt-20">
              <h2 className="text-3xl">Questions pilgrims ask</h2>
              <Accordion type="single" collapsible className="mt-8 border-t border-border">
                {pkg.faqs.map((faq) => (
                  <AccordionItem
                    key={faq.question}
                    value={faq.question}
                    className="border-b border-border"
                  >
                    <AccordionTrigger className="py-6 text-left font-serif text-lg hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Link
                to="/faq"
                className="link-quiet mt-8 inline-block text-[0.65rem] tracking-[0.2em] uppercase"
              >
                Read all questions and answers
              </Link>
            </Reveal>

          </div>

          {/* Sticky pricing box */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-border bg-card p-8">
              <p className="text-[0.6rem] tracking-[0.22em] text-muted-foreground uppercase">
                Starting from
              </p>
              <p className="mt-3 font-serif text-4xl">{price}</p>
              <p className="mt-1 text-xs text-muted-foreground">per person, sharing</p>
              <CurrencyNote className="mt-3" />
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
              <Link
                to="/booking"
                search={{ package: pkg.slug }}
                className="btn-gold mt-8 w-full"
              >
                Book this package
              </Link>
              <a
                href={whatsappLink(
                  `Assalamu alaikum — I'd like to ask about the ${pkg.name} package (${pkg.duration}).`,
                )}
                target="_blank"
                rel="noreferrer"
                className="btn-quiet mt-3 w-full text-foreground"
              >
                <MessageCircle className="size-4" aria-hidden />
                Ask about this package
              </a>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-quiet mt-3 w-full text-foreground print:hidden"
              >
                <Download className="size-4" aria-hidden />
                Download itinerary (PDF)
              </button>
              <p className="mt-6 text-center text-xs text-muted-foreground">
                {site.responsePromise}
              </p>
            </div>

          </aside>
        </div>
      </section>
    </>
  );
}
