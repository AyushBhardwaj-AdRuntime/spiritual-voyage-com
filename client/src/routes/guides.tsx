import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { media } from "@/data/media";
import { site } from "@/data/site";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: `Umrah Guides & Checklists — ${site.name}` },
      {
        name: "description",
        content:
          "Practical written guides for first-time and returning pilgrims — packing checklists, the best time to visit Madinah, and what to expect inside the Haram. Publishing soon.",
      },
      { property: "og:title", content: `Umrah Guides & Checklists — ${site.name}` },
      {
        property: "og:description",
        content: "Practical, unhurried guidance for first-time and returning pilgrims.",
      },
      { property: "og:url", content: "/guides" },
    ],
    links: [{ rel: "canonical", href: "/guides" }],
  }),
  component: GuidesPage,
});

/** Planned guides. Each becomes its own route once written. */
const planned = [
  {
    title: "The first-time Umrah checklist",
    blurb: "Everything to pack, prepare and memorise, in the order you will actually need it.",
  },
  {
    title: "The best time of year to visit Madinah",
    blurb: "Weather, crowds and prices month by month, with the trade-offs stated plainly.",
  },
  {
    title: "What Umrah costs, honestly",
    blurb: "Where the money goes, which savings are real and which ones cost you comfort you will miss.",
  },
  {
    title: "Performing Umrah with elderly parents",
    blurb: "Pace, wheelchair access, hotel proximity and the arrangements that make it possible.",
  },
  {
    title: "Ziyarah sites worth your time",
    blurb: "What to see in Makkah and Madinah, and what is often oversold to visitors.",
  },
  {
    title: "Ramadan Umrah: what to expect",
    blurb: "Crowd levels, timings, and how the last ten nights change everything.",
  },
];

function GuidesPage() {
  return (
    <>
      <PageHero
        eyebrow="Guides"
        title="Written guidance for the journey ahead"
        intro="We are writing these the way we would explain them to a family member — no filler, no scare tactics, no selling."
        mediaLabel="Open Qur'an in the courtyard at dawn"
        mediaSrc={media.haramDawn}
      />

      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <p className="eyebrow">Coming soon</p>
            <h2 className="mt-6 max-w-2xl text-3xl">The guides we are working on</h2>
          </Reveal>

          <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {planned.map((guide, i) => (
              <Reveal key={guide.title} delay={i * 80} className="bg-card p-8">
                <p className="text-[0.6rem] tracking-[0.22em] text-gold uppercase">In progress</p>
                <h3 className="mt-4 font-serif text-xl">{guide.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{guide.blurb}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20 border border-border bg-card p-10 text-center">
            <h2 className="text-2xl">Have a question that cannot wait for the article?</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Ask us directly. {site.responsePromise}
            </p>
            <Link to="/contact" className="btn-gold mt-8">
              Send your question
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
