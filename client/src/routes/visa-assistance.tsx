import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, MessageCircle } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { media } from "@/data/media";
import { site, whatsappLink } from "@/data/site";

export const Route = createFileRoute("/visa-assistance")({
  head: () => ({
    meta: [
      { title: `Umrah Visa Assistance — ${site.name}` },
      {
        name: "description",
        content:
          "We prepare and submit your Umrah visa application, check every document before it goes in, and tell you honestly where the risks are. Documents, timelines and costs explained.",
      },
      { property: "og:title", content: `Umrah Visa Assistance — ${site.name}` },
      {
        property: "og:description",
        content: "Documents, timelines, costs and honest answers on the Umrah visa process.",
      },
      { property: "og:url", content: "/visa-assistance" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/visa-assistance" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }),
      },
    ],
  }),
  component: VisaPage,
});

const documents = [
  "Passport valid for at least six months from your travel date",
  "Recent photograph with a white background, meeting visa specification",
  "Confirmed accommodation and return travel — included in your package",
  "Vaccination records where required at the time of travel",
  "Marriage or birth certificate where a family relationship must be shown",
];

const steps = [
  {
    label: "Step 1",
    title: "We check before you pay for anything",
    body: "Send us a photo of your passport page. We tell you immediately if validity, spelling or a previous refusal is likely to cause a problem.",
  },
  {
    label: "Step 2",
    title: "We prepare the file",
    body: "Photograph specification, document formats and the details that must match your passport exactly are handled by us, not left to you to guess.",
  },
  {
    label: "Step 3",
    title: "Submission and tracking",
    body: "Your application is submitted through the authorised channel and we follow its progress, updating you rather than waiting to be asked.",
  },
  {
    label: "Step 4",
    title: "Issued and briefed",
    body: "Once issued we send you the visa with a plain-language briefing on what it permits, its validity, and what to carry at immigration.",
  },
];

const faqs = [
  {
    question: "Can you guarantee my visa will be approved?",
    answer:
      "No, and nobody honestly can. The decision belongs entirely to the issuing authority. What we can do is make sure your file gives them no reason to refuse it, and tell you in advance if we see a real risk.",
  },
  {
    question: "How long does the Umrah visa take?",
    answer:
      "Processing times move with season and volume, and rise sharply close to Ramadan. We give you the current realistic window when you enquire rather than a number from last year.",
  },
  {
    question: "Is the visa cost included in my package price?",
    answer:
      "Visa handling is included in our packages; the authority's own fee is shown separately on your quote so you can see exactly what is ours and what is theirs.",
  },
  {
    question: "I have been refused before. Should I still apply?",
    answer:
      "Often yes, but tell us before you book. A previous refusal changes how the file should be presented, and we would rather advise you honestly than take a deposit.",
  },
  {
    question: "Do women need a mahram?",
    answer:
      "The rules on travelling with a mahram have changed in recent years and continue to be updated. We will tell you what applies at the time you travel, and arrange group travel for women where that is the better route.",
  },
  {
    question: "What if my passport expires soon?",
    answer:
      "Renew first. A passport short of the required validity will be refused regardless of everything else in the file, and renewal is the cheaper delay.",
  },
];

function VisaPage() {
  return (
    <>
      <PageHero
        eyebrow="Visa assistance"
        title="The paperwork is our job, not yours"
        intro="For most travellers the visa is the most stressful part of the journey. We handle it end to end, and we tell you the truth about timelines rather than what you would like to hear."
        mediaLabel="Madinah at first light"
        mediaSrc={media.madinahDomes}
      />

      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="grid gap-16 lg:grid-cols-[1fr_360px]">
            <div>
              <h2 className="text-3xl">How it works</h2>
              <div className="mt-10 border-t border-border">
                {steps.map((step) => (
                  <div
                    key={step.label}
                    className="grid gap-3 border-b border-border py-8 sm:grid-cols-[120px_1fr] sm:gap-8"
                  >
                    <p className="text-[0.6rem] tracking-[0.22em] text-gold uppercase">
                      {step.label}
                    </p>
                    <div>
                      <h3 className="font-serif text-xl">{step.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border border-border bg-card p-8">
                <p className="flex items-center gap-2 text-[0.6rem] tracking-[0.22em] text-muted-foreground uppercase">
                  <FileText className="size-3.5 text-gold" aria-hidden />
                  What to have ready
                </p>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {documents.map((doc) => (
                    <li key={doc} className="border-l border-gold/40 pl-4">
                      {doc}
                    </li>
                  ))}
                </ul>
                <a
                  href={whatsappLink("Assalamu alaikum — I have a question about the Umrah visa process.")}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gold mt-8 w-full"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Ask about the visa
                </a>
                <p className="mt-6 text-center text-xs text-muted-foreground">
                  {site.responsePromise}
                </p>
              </div>
            </aside>
          </Reveal>

          <Reveal className="mt-24 max-w-3xl">
            <h2 className="text-3xl">Honest answers</h2>
            <Accordion type="single" collapsible className="mt-8 border-t border-border">
              {faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question} className="border-b border-border">
                  <AccordionTrigger className="py-6 text-left font-serif text-lg hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>

          <Reveal className="mt-20 border border-border bg-card p-10 text-center">
            <h2 className="text-2xl">Travelling as a family or a group?</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Group files are checked together so one mismatched detail does not hold up everyone.
            </p>
            <Link to="/custom-package" className="btn-gold mt-8">
              Request a custom or group journey
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
