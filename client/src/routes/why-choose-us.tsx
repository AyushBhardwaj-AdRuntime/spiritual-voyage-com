import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, BadgeCheck, HeartHandshake, Quote, ShieldCheck, Users } from "lucide-react";

import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import { media } from "@/data/media";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { site } from "@/data/site";

export const Route = createFileRoute("/why-choose-us")({
  head: () => ({
    meta: [
      { title: `Why Choose Us — About ${site.name}` },
      {
        name: "description",
        content: `${site.legalName} has arranged guided Umrah and Ziyarah journeys since 2008 — licensed, experienced, and present from arrival to departure.`,
      },
      { property: "og:title", content: `Why Choose Us — ${site.name}` },
      {
        property: "og:description",
        content:
          "Our story, our licences, and the guides who travel with you. Trust built on experience, not urgency.",
      },
      { property: "og:url", content: "/why-choose-us" },
    ],
    links: [{ rel: "canonical", href: "/why-choose-us" }],
  }),
  component: WhyChooseUsPage,
});

const stats = [
  { value: "18", label: "Years arranging journeys" },
  { value: "12,000+", label: "Pilgrims served" },
  { value: "40+", label: "Group departures a year" },
  { value: "4.9/5", label: "Average pilgrim rating" },
];

const values = [
  {
    Icon: ShieldCheck,
    title: "Licensed and accountable",
    body: "Registered travel operator with approved Umrah service partners in Saudi Arabia. Documentation available on request.",
  },
  {
    Icon: HeartHandshake,
    title: "Present, not outsourced",
    body: "Our own guides travel with you. You are never handed to a local agency you have never spoken to.",
  },
  {
    Icon: BadgeCheck,
    title: "Honest about details",
    body: "We name the hotel, the distance, and what is not included — before you pay, not after.",
  },
  {
    Icon: Users,
    title: "Built for mixed groups",
    body: "Elders, children, first-time pilgrims and converts travel together comfortably in our groups.",
  },
];

function WhyChooseUsPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A small company that has quietly done this for a long time"
        intro={`${site.legalName} began in Fraser Town, Bengaluru, arranging journeys for neighbours. Today we take pilgrims from across the world — with the same standard of care we started with.`}
        mediaLabel="Our team at the office"
        mediaSrc={media.kabah}
      />

      {/* Our story */}
      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:px-10">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
              <p>
                We started in 2008 with a single group of fourteen pilgrims, most of whom lived
                within walking distance of our office on Mosque Road. There was no marketing. People
                came because someone they trusted had travelled with us.
              </p>
              <p>
                That is still how most of our pilgrims find us. It shapes everything: we would
                rather turn away a booking than promise a hotel we cannot confirm, or a walking
                distance we have not measured ourselves.
              </p>
              <p>
                Our groups now include families from South Asia, travellers from the Gulf, and
                converts from Europe and North America making the journey for the first time. The
                guidance is patient with all of them, because it was built for people making this
                journey once in a lifetime.
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            {/* REPLACE: photo of your team or a past group */}
            <MediaPlaceholder label="Our first group, 2008" src={media.madinahGate} aspect="aspect-[4/5]" />
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy py-24 text-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <dl className="grid gap-px border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 110} className="bg-navy p-10 text-center">
                <dt className="order-2 mt-4 block text-[0.6rem] tracking-[0.22em] text-cream/60 uppercase">
                  {stat.label}
                </dt>
                <dd className="order-1 block font-serif text-4xl text-gold">{stat.value}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Values */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">What you can expect</p>
            <h2 className="mt-6 text-3xl sm:text-4xl">Four commitments we do not bend</h2>
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-2">
            {values.map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 120} className="border-t border-border pt-8">
                <Icon className="size-5 text-gold" aria-hidden />
                <h3 className="mt-6 text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & partners */}
      <section className="bg-muted py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <p className="eyebrow">Licences &amp; partners</p>
            <h2 className="mt-6 text-3xl">Verified, and happy to prove it</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              "Ministry approval",
              "IATA partner",
              "Travel licence",
              "Airline partner",
              "Hotel group",
              "Transport partner",
            ].map((label, i) => (
              <Reveal key={label} delay={i * 70}>
                {/* REPLACE: certification badge or partner logo */}
                <MediaPlaceholder label={label} aspect="aspect-[3/2]" />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <p className="flex items-center gap-3 text-xs text-muted-foreground">
              <Award className="size-4 text-gold" aria-hidden />
              Certificates and licence numbers are shared with every booking confirmation.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Guides */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Your guides</p>
            <h2 className="mt-6 text-3xl sm:text-4xl">The people who travel beside you</h2>
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {[
              { name: "Guide name", role: "Group leader — Makkah", langs: "Arabic, Urdu, English" },
              { name: "Guide name", role: "Group leader — Madinah", langs: "Arabic, English" },
              { name: "Guide name", role: "Family support", langs: "Urdu, Hindi, English" },
            ].map((person, i) => (
              /* REPLACE: guide photo, name, role and languages */
              <Reveal key={person.role} delay={i * 120}>
                <MediaPlaceholder label="Guide portrait" aspect="aspect-[4/5]" />
                <h3 className="mt-6 text-xl">{person.name}</h3>
                <p className="mt-1 text-[0.65rem] tracking-[0.2em] text-gold uppercase">
                  {person.role}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{person.langs}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-navy py-24 text-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Pilgrim voices</p>
            <h2 className="mt-6 text-3xl sm:text-4xl">Told by the people who went</h2>
          </Reveal>
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {[1, 2].map((n) => (
              <Reveal key={n} delay={n * 120}>
                {/* REPLACE: video testimonial — use <video controls poster="..."> */}
                <MediaPlaceholder
                  label={`Video testimonial ${n}`}
                  kind="video"
                  aspect="aspect-video"
                />
              </Reveal>
            ))}
            <Reveal delay={360}>
              <figure className="flex h-full flex-col border border-cream/15 p-8">
                <Quote className="size-5 text-gold" aria-hidden />
                <blockquote className="mt-6 flex-1 font-serif text-xl leading-[1.45]">
                  “They called my father the week after we returned, just to ask how he was. That
                  told me everything about who they are.”
                </blockquote>
                <figcaption className="mt-6 text-sm text-cream/70">
                  Zainab K. — Bengaluru, India
                </figcaption>
              </figure>
            </Reveal>
          </div>
          <Reveal className="mt-14">
            <Link to="/contact" className="btn-gold">
              Talk to us
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
