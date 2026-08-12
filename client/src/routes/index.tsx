import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, HeartHandshake, ShieldCheck, Users } from "lucide-react";

import { HomeHero } from "@/components/home/HomeHero";
import { ScrollStory } from "@/components/home/ScrollStory";
import { Testimonials } from "@/components/home/Testimonials";
import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import { media, photoAt } from "@/data/media";
import { Reveal } from "@/components/site/Reveal";
import { TrustBadges } from "@/components/site/TrustBadges";
import { Price } from "@/lib/currency";
import { packages } from "@/data/packages";
import { site } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${site.name} — Guided Umrah & Ziyarah Journeys to Makkah & Madinah` },
      {
        name: "description",
        content:
          "Small-group Umrah and Ziyarah journeys arranged with care — close hotels, calm guidance, and support from arrival to departure.",
      },
      { property: "og:title", content: `${site.name} — Guided Umrah & Ziyarah Journeys` },
      {
        property: "og:description",
        content:
          "Small-group Umrah and Ziyarah journeys arranged with care, so your attention can stay where it belongs.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      // Hero still is the LCP element — fetch it with the document.
      { rel: "preload", as: "image", href: media.heroPoster, fetchpriority: "high" },
    ],
  }),
  component: Home,
});

const trustPoints = [
  { Icon: BadgeCheck, title: "18 years of journeys", body: "Arranging Umrah since 2008." },
  { Icon: ShieldCheck, title: "Licensed & certified", body: "Approved Umrah service provider." },
  { Icon: Users, title: "12,000+ pilgrims served", body: "Families, groups and solo travellers." },
  { Icon: HeartHandshake, title: "Support day and night", body: "A person, not a call centre." },
];

function Home() {
  return (
    <>
      <HomeHero />

      {/* The Promise */}
      <section id="promise" className="bg-background py-28">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <Reveal>
            <p className="eyebrow">Our promise</p>
            <h2 className="mt-8 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.75rem]">
              You have waited a long time for this journey. The least we can do is carry everything
              else.
            </h2>
            <span className="gold-rule mx-auto mt-10 block" />
            <p className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Wherever you are travelling from, and whatever language you pray in, you will be met
              by someone who has walked this path many times. Hotels close to the Haram. Transfers
              that arrive before you need them. Guidance offered gently, never rushed.
            </p>
          </Reveal>
        </div>
      </section>

      <ScrollStory />

      {/* Why choose us preview */}
      <section className="bg-navy py-28 text-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Why pilgrims trust us</p>
            <h2 className="mt-6 text-3xl sm:text-4xl">Quiet competence, proven over years</h2>
          </Reveal>
          <ul className="mt-16 grid gap-px border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map(({ Icon, title, body }, i) => (
              <Reveal as="li" key={title} delay={i * 120} className="bg-navy p-9">
                <Icon className="size-5 text-gold" aria-hidden />
                <h3 className="mt-6 text-xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/65">{body}</p>
              </Reveal>
            ))}
          </ul>
          <TrustBadges tone="dark" className="mt-6" />
          <Reveal className="mt-14 flex flex-wrap gap-3">
            <Link to="/why-choose-us" className="btn-quiet text-cream">
              More about us
            </Link>
            <Link to="/visa-assistance" className="btn-quiet text-cream">
              Visa assistance
            </Link>
          </Reveal>

        </div>
      </section>

      {/* Featured packages */}
      <section className="bg-background py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Journeys</p>
            <h2 className="mt-6 text-3xl sm:text-4xl">Three ways to travel</h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Each journey differs only in comfort and pace. The care around you is the same.
            </p>
          </Reveal>
          <div className="mt-16 grid gap-10 lg:grid-cols-3">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.slug} delay={i * 140}>
                <article className="group flex h-full flex-col border border-border bg-card">
                  <div className="overflow-hidden">
                    {/* REPLACE: hero photo for {pkg.name} */}
                    <MediaPlaceholder
                      label={`${pkg.name} photo`}
                      src={photoAt(i)}
                      className="transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-8">
                    <h3 className="text-2xl">{pkg.name}</h3>
                    <p className="mt-1 text-[0.65rem] tracking-[0.2em] text-gold uppercase">
                      {pkg.duration}
                    </p>
                    <p className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {pkg.shortDescription}
                    </p>
                    <p className="mt-8 text-sm text-foreground">
                      From <span className="font-serif text-2xl"><Price inr={pkg.fromPriceInr} /></span>
                    </p>
                    <Link
                      to="/packages/$slug"
                      params={{ slug: pkg.slug }}
                      className="btn-quiet mt-8 text-foreground"
                    >
                      View details
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Gallery strip */}
      <section className="bg-background pb-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Glimpses</p>
              <h2 className="mt-6 text-3xl sm:text-4xl">From our recent journeys</h2>
            </div>
            <Link to="/gallery" className="link-quiet text-[0.7rem] tracking-[0.2em] uppercase">
              View full gallery
            </Link>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              "Kaaba at dawn",
              "Rawdah entrance",
              "Madinah street",
              "Sunset over Makkah",
              "Group in prayer",
              "Hotel terrace",
              "Dates and Zamzam",
              "Departure at the airport",
            ].map((label, i) => (
              <Reveal key={label} delay={i * 70}>
                <div className="overflow-hidden">
                  <MediaPlaceholder
                    label={label}
                    src={photoAt(i)}
                    aspect="aspect-square"
                    className="transition-transform duration-1000 ease-out hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-navy py-32 text-cream">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <Reveal>
            <h2 className="text-3xl leading-[1.25] sm:text-4xl">
              When you are ready, we will be here — patiently, and for as long as it takes.
            </h2>
            <p className="mt-8 text-base leading-relaxed text-cream/70">
              Ask us anything before you commit. There is no pressure in this conversation.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link to="/packages" className="btn-gold">
                Explore packages
              </Link>
              <Link to="/contact" className="btn-quiet text-cream">
                Speak with us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
