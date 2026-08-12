import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { media } from "@/data/media";
import { policyUpdated } from "@/data/legal";
import { site } from "@/data/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: `Terms & Conditions — ${site.name}` },
      {
        name: "description",
        content: `The booking terms for Umrah and Ziyarah journeys arranged by ${site.legalName} — payments, documents, visas, changes, liability and the law that applies.`,
      },
      { property: "og:title", content: `Terms & Conditions — ${site.name}` },
      {
        property: "og:description",
        content: "What we commit to, what we ask of you, and what happens if plans change.",
      },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

/* REPLACE: confirm the deposit percentage, balance deadline and any clause
   your legal adviser wants worded differently before publishing. */
const sections: { heading: string; body: string[] }[] = [
  {
    heading: "1. Who you are contracting with",
    body: [
      `These terms govern journeys arranged by ${site.legalName}, trading as ${site.name}, of ${site.address}. By confirming a booking you accept them on behalf of every traveller named on it.`,
    ],
  },
  {
    heading: "2. Enquiries, quotes and confirmation",
    body: [
      "A quote is an offer, not a reservation. Prices are held for the period stated on your quote and depend on live hotel, airline and visa costs.",
      "Your booking exists only once we have issued a written confirmation. Until then no seats, rooms or visa slots are held in your name.",
    ],
  },
  {
    heading: "3. Payments",
    body: [
      "A booking deposit is payable to confirm your place, with the balance due before the deadline stated on your confirmation. Late balance payment may release your reservation.",
      "Online card payment is not yet enabled on this website; our team will confirm the payment method with you directly. We never ask for card details over WhatsApp, SMS or email.",
      "All amounts are invoiced in Indian Rupees. Currencies shown elsewhere on this site are indicative conversions for guidance only.",
    ],
  },
  {
    heading: "4. Passports, visas and documents",
    body: [
      "You are responsible for holding a valid passport and for the accuracy of every detail you give us. A name spelled differently from your passport can invalidate a ticket or visa at your cost.",
      "We assist with the Umrah visa process but no agent can guarantee a visa. Visa decisions rest entirely with the issuing authority.",
      "Vaccination and health entry requirements change. We will tell you what we know, and you should verify with your own physician and the official channels before travel.",
    ],
  },
  {
    heading: "5. Changes by you",
    body: [
      "Ask us as early as you can. Some changes are free, others carry supplier fees that we pass on at cost with the supplier's evidence attached.",
      "Cancellations are handled under our Refund & Cancellation Policy.",
    ],
  },
  {
    heading: "6. Changes by us",
    body: [
      "Occasionally a hotel, flight time or itinerary order must change. Where that happens we substitute an equivalent or better arrangement and tell you promptly.",
      "If a change is significant and you do not accept it, you may cancel and we will refund the recoverable portion of what you paid.",
    ],
  },
  {
    heading: "7. Conduct and the sanctity of the journey",
    body: [
      "Our journeys are shared with fellow pilgrims. We ask for punctuality, courtesy and respect for local law and custom. We may end the arrangement, without refund, for conduct that endangers or seriously disturbs others.",
    ],
  },
  {
    heading: "8. Insurance",
    body: [
      "Travel insurance covering medical care, repatriation and cancellation is strongly recommended and may be required by the visa process. It is your responsibility to arrange it unless your confirmation states we have.",
    ],
  },
  {
    heading: "9. Our liability",
    body: [
      "We arrange the services described in your confirmation and take responsibility for arranging them with reasonable care and skill.",
      "We are not liable for events outside our reasonable control, including crowd restrictions in the Haram, government or airline decisions, weather, or the acts of independent suppliers.",
    ],
  },
  {
    heading: "10. Complaints",
    body: [
      "Tell your guide first so it can be fixed while you are there. Anything unresolved should be written to us within 28 days of return and we will respond in writing.",
    ],
  },
  {
    heading: "11. Governing law",
    body: [
      "These terms are governed by the laws of India, and the courts of Bengaluru, Karnataka have jurisdiction.",
    ],
  },
];

function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        intro="Plainly written, because you should be able to read them before you pay rather than after."
        mediaLabel="Arched gateway at Masjid an-Nabawi"
        mediaSrc={media.madinahGate}
      />

      <section className="bg-background py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <p className="text-[0.6rem] tracking-[0.22em] text-muted-foreground uppercase">
            Last updated {policyUpdated}
          </p>

          {sections.map((section, i) => (
            <Reveal key={section.heading} delay={i * 40} className="mt-14">
              <h2 className="text-2xl">{section.heading}</h2>
              {section.body.map((para) => (
                <p key={para.slice(0, 28)} className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {para}
                </p>
              ))}
            </Reveal>
          ))}

          <Reveal className="mt-16 flex flex-wrap gap-3">
            <Link to="/refund-policy" className="btn-gold">
              Refund &amp; Cancellation Policy
            </Link>
            <Link to="/privacy" className="btn-quiet text-foreground">
              Privacy Policy
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
