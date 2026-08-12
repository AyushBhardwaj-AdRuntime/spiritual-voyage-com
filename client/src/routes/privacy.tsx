import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { media } from "@/data/media";
import { policyUpdated } from "@/data/legal";
import { site } from "@/data/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy Policy — ${site.name}` },
      {
        name: "description",
        content: `How ${site.legalName} collects, uses and protects the personal and passport information you share when enquiring about or booking an Umrah journey.`,
      },
      { property: "og:title", content: `Privacy Policy — ${site.name}` },
      {
        property: "og:description",
        content: "What we collect, why we collect it, who we share it with, and how to have it removed.",
      },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

const sections: { heading: string; body: string[]; list?: string[] }[] = [
  {
    heading: "What we collect",
    body: [
      "We only ask for what a journey actually requires. When you send an enquiry we collect your name, email address, phone or WhatsApp number, country and whatever you choose to tell us in your message.",
      "When you proceed to a booking we additionally need traveller details required by hotels, airlines and the visa process.",
    ],
    list: [
      "Full name as printed on your passport",
      "Passport number, issue and expiry dates, and a passport scan",
      "Date of birth, gender and nationality",
      "Photograph meeting visa requirements",
      "Emergency contact and any medical or mobility needs you tell us about",
    ],
  },
  {
    heading: "Why we collect it",
    body: [
      "To answer your enquiry, to quote accurately, to reserve hotels and transport, to submit visa applications on your behalf, and to reach you before and during travel.",
      "We do not sell your data. We do not send marketing you did not ask for, and every update email has an unsubscribe link.",
    ],
  },
  {
    heading: "Who we share it with",
    body: [
      "Only the parties needed to deliver your journey: the visa authority and its authorised processing agents, airlines, hotels in Makkah and Madinah, ground transport operators, and — once online payment is enabled — a certified payment provider.",
      "Each receives the minimum needed for their part of the arrangement.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "Enquiry correspondence is kept while it is useful to you and then removed. Booking and visa records are retained for as long as tax, audit and immigration rules require, after which they are deleted or anonymised.",
    ],
  },
  {
    heading: "How we protect it",
    body: [
      "This website is served over encrypted HTTPS. Passport scans and traveller documents are handled by named staff only and are never posted in group chats or shared with anyone outside your booking.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You may ask us at any time for a copy of what we hold about you, ask us to correct it, or ask us to delete it where we are not legally required to keep it. Write to us and we will confirm within 30 days.",
    ],
  },
  {
    heading: "Cookies and analytics",
    body: [
      "We use a privacy-friendly analytics tool to count page visits and understand which pages help people. It does not use advertising cookies, does not follow you across other websites, and does not build a profile of you.",
    ],
  },
];

function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        intro="Umrah travel means trusting a company with your passport, your family's details and your money. Here is exactly what we do with them."
        mediaLabel="Quiet corner of the Haram at dawn"
        mediaSrc={media.haramArches}
      />

      <section className="bg-background py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <p className="text-[0.6rem] tracking-[0.22em] text-muted-foreground uppercase">
            Last updated {policyUpdated}
          </p>

          {sections.map((section, i) => (
            <Reveal key={section.heading} delay={i * 60} className="mt-14">
              <h2 className="text-2xl">{section.heading}</h2>
              {section.body.map((para) => (
                <p key={para.slice(0, 28)} className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {para}
                </p>
              ))}
              {section.list ? (
                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  {section.list.map((item) => (
                    <li key={item} className="border-l border-gold/40 pl-4">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          ))}

          <Reveal className="mt-16 border border-border bg-card p-8">
            <h2 className="text-xl">Contact us about your data</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Write to{" "}
              <a href={`mailto:${site.email}`} className="link-quiet">
                {site.email}
              </a>{" "}
              or visit us at {site.address}.
            </p>
            <Link to="/terms" className="btn-quiet mt-8 text-foreground">
              Read our Terms &amp; Conditions
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
