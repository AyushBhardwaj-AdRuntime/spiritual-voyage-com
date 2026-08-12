import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Phone } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { answeredFaqs, faqGroups } from "@/data/faq";
import { media } from "@/data/media";
import { site, whatsappLink } from "@/data/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: `Umrah Package FAQ — Flights, Hotels, Visa & Payment | ${site.name}` },
      {
        name: "description",
        content:
          "Straight answers on flights, hotels, room sharing, what is included, the Umrah visa, Ziyarat, insurance, support and payment — and an honest note wherever a detail is confirmed per departure.",
      },
      { property: "og:title", content: `Umrah Package FAQ — ${site.name}` },
      {
        property: "og:description",
        content:
          "The questions pilgrims actually ask before booking, answered plainly. Nothing promised that we cannot confirm.",
      },
      { property: "og:url", content: "/faq" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: answeredFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Questions"
        title="The questions pilgrims ask before they commit"
        intro="These are the real questions people put to us on WhatsApp and on the phone. Where a detail changes with your departure date — airline, hotel, room price — we say so instead of publishing a number that might not be true for you."
        mediaLabel="Pilgrims in the courtyard"
        mediaSrc={media.haramArches}
      />

      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[220px_1fr] lg:px-10">
          {/* Section index */}
          <nav aria-label="FAQ sections" className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[0.6rem] tracking-[0.22em] text-muted-foreground uppercase">
              On this page
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {faqGroups.map((group) => (
                <li key={group.id}>
                  <a href={`#${group.id}`} className="link-quiet text-muted-foreground">
                    {group.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            {faqGroups.map((group, gi) => (
              <Reveal
                key={group.id}
                delay={gi === 0 ? 0 : 60}
                className={gi === 0 ? "scroll-mt-28" : "mt-20 scroll-mt-28"}
              >
                <div id={group.id} className="scroll-mt-28">
                  <h2 className="text-3xl">{group.title}</h2>
                  {group.intro ? (
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {group.intro}
                    </p>
                  ) : null}
                  <Accordion type="single" collapsible className="mt-8 border-t border-border">
                    {group.items.map((item) => (
                      <AccordionItem
                        key={item.question}
                        value={item.question}
                        className="border-b border-border"
                      >
                        <AccordionTrigger className="py-6 text-left font-serif text-lg hover:no-underline">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground">
                          {item.answer ? (
                            item.answer
                          ) : (
                            <>
                              This one depends on your departure, so we would rather confirm it for you
                              than publish something that may not hold. Ask us and you will have an exact
                              answer in writing.{" "}
                              <a
                                href={whatsappLink(`Assalamu alaikum — a question: ${item.question}`)}
                                target="_blank"
                                rel="noreferrer"
                                className="link-quiet text-foreground"
                              >
                                Ask on WhatsApp
                              </a>
                            </>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </Reveal>
            ))}

            <Reveal className="mt-20 border border-border bg-card p-10">
              <h2 className="text-2xl">Still unanswered?</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Ask us anything, even if you are only thinking about travelling. There is no
                obligation in a question, and a real person will answer. {site.responsePromise}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={whatsappLink("Assalamu alaikum — I have a question about your Umrah packages.")}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gold"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Ask on WhatsApp
                </a>
                <a href={site.phoneHref} className="btn-quiet text-foreground">
                  <Phone className="size-4" aria-hidden />
                  Call {site.phone}
                </a>
                <Link to="/contact" className="btn-quiet text-foreground">
                  Send an enquiry
                </Link>
              </div>
              <p className="mt-8 text-xs text-muted-foreground">
                Cancellation terms are on our{" "}
                <Link to="/refund-policy" className="link-quiet text-foreground">
                  refund &amp; cancellation policy
                </Link>{" "}
                page, and the visa process is explained on{" "}
                <Link to="/visa-assistance" className="link-quiet text-foreground">
                  visa assistance
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
