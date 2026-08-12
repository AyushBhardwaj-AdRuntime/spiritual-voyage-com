/**
 * FAQ content for /faq (and reusable on package detail pages).
 *
 * HOW TO EDIT
 * -----------
 * Each item is either:
 *   { question, answer }            -> published, shown in full, included in Google's FAQ schema
 *   { question, pending: "..." }    -> not yet confirmed. The page shows an honest
 *                                     "ask us directly" note instead of a made-up answer,
 *                                     and the item is EXCLUDED from the FAQ schema.
 *
 * Replace each `pending` entry with a real `answer` as you confirm it. The `pending`
 * text is the internal note describing exactly what needs confirming.
 */

export interface FaqItem {
  question: string;
  /** Published answer. */
  answer?: string;
  /** Internal note: what still needs confirming before this can be published. */
  pending?: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  intro?: string;
  items: FaqItem[];
}

export const faqGroups: FaqGroup[] = [
  {
    id: "flights",
    title: "Flights",
    intro:
      "Airlines and routings are confirmed per departure date, so we quote them on your itinerary rather than promising them here.",
    items: [
      {
        question: "Which airline do you fly?",
        pending:
          "State the actual airline for each package, e.g. Saudia from Bengaluru. Can change by departure date.",
      },
      {
        question: "Is it a direct flight?",
        pending: "Confirm whether Bengaluru–Jeddah/Madinah is direct or connecting, both onward and return.",
      },
      {
        question: "What is the baggage allowance?",
        pending: "Confirm check-in kg and cabin allowance, and whether it is included in the package price.",
      },
      {
        question: "Can I change my flight or airline?",
        pending: "Confirm your real change policy and whether a fee applies, subject to airline availability.",
      },
      {
        question: "What happens if my flight is delayed or cancelled?",
        pending:
          "Confirm how you monitor flights and adjust transfers, and that airline delay compensation follows the airline's own policy.",
      },
    ],
  },
  {
    id: "hotels",
    title: "Hotels",
    items: [
      {
        question: "Can hotel names change after I book?",
        answer:
          "Hotel allocation can vary with your specific travel dates and availability. We confirm exact hotel names in writing before you make final payment, and if anything changes after that we tell you directly rather than letting you discover it on arrival.",
      },
      {
        question: "Which hotels will I stay in, and how far are they from the Haram?",
        pending:
          "Confirm current hotels per package before publishing, e.g. Makkah Towers approx 300m, Sanabil Al Madina approx 200m. Distances already appear on each package page.",
      },
      {
        question: "What room-sharing options are available, and what is the price difference?",
        pending:
          "Quad (4), triple (3) and twin (2) sharing exist — confirm the actual price for each on the current packages before publishing figures.",
      },
    ],
  },
  {
    id: "family",
    title: "Room sharing & family travel",
    items: [
      {
        question: "Can my family stay together in one room?",
        pending: "Confirm whether families can be grouped together on request at time of booking.",
      },
      {
        question: "Do you offer private or family rooms outside the quad, triple and twin structure?",
        pending: "Confirm. If you do not offer this, say so plainly rather than leaving it unanswered.",
      },
      {
        question: "Can elderly family members be roomed with the rest of the family?",
        pending: "Confirm.",
      },
    ],
  },
  {
    id: "included",
    title: "What is included",
    intro:
      "The precise inclusions and exclusions for each journey are listed on that package's own page, and repeated on your written quote.",
    items: [
      {
        question: "What is included in the package price?",
        pending:
          "Confirm per package. Typically: return flights, hotels in Makkah and Madinah, airport and intercity transfers, guided Ziyarat, SIM card, Zamzam water, travel kit, travel insurance and 24x7 support.",
      },
      {
        question: "What is not included?",
        pending:
          "Most important answer on the page — list exclusions explicitly: meals, personal expenses, laundry, optional excursions, tips, separately charged visa fees, excess baggage.",
      },
    ],
  },
  {
    id: "visa",
    title: "Visa",
    intro: "The full process, documents and timelines are set out on our visa assistance page.",
    items: [
      {
        question: "Can you guarantee my visa will be approved?",
        answer:
          "No, and nobody honestly can. The decision belongs entirely to the issuing authority. What we can do is make sure your file gives them no reason to refuse it, and tell you in advance if we see a real risk.",
      },
      {
        question: "What if my visa is refused?",
        answer:
          "A refusal is not a cancellation by you. We refund everything our suppliers release and we do not keep a service charge for a journey you were never able to take. The visa authority's own fees, once submitted, cannot be recovered. The full terms are on our refund and cancellation policy page.",
      },
      {
        question: "Do you arrange my visa for me?",
        pending:
          "Confirm whether the Umrah visa application is handled by you as part of the package, or the traveller applies separately.",
      },
      {
        question: "What documents do I need to provide, and by when?",
        pending:
          "Confirm passport validity requirement, photo specification and the deadline before departure. A general list is on the visa assistance page.",
      },
    ],
  },
  {
    id: "transport",
    title: "Transport in Saudi Arabia",
    items: [
      {
        question: "Is transport between the airport, Makkah and Madinah included?",
        pending:
          "Confirm that it covers airport transfers, Makkah–Madinah travel and Ziyarat trips specifically.",
      },
      {
        question: "Is transport private or shared?",
        pending: "Confirm plainly — shared group transport per the package listings — so there is no surprise.",
      },
    ],
  },
  {
    id: "ziyarat",
    title: "Ziyarat",
    items: [
      {
        question: "Which sites are included in the guided Ziyarat?",
        pending:
          "Confirm the actual itinerary per package. Do not list a site unless it is genuinely included.",
      },
      {
        question: "Is Ziyarat guided by someone who knows the history of each site?",
        pending: "Confirm and describe your guide's role.",
      },
    ],
  },
  {
    id: "extras",
    title: "SIM card, Zamzam & travel kit",
    items: [
      {
        question: "What SIM card do I get, and how much data?",
        pending: "Confirm operator, data allowance, validity and whether calls are included.",
      },
      {
        question: "How and when do I receive my Zamzam water?",
        pending: "Confirm whether it is collected at the Saudi airport, within baggage allowance, or arranged separately.",
      },
      {
        question: "What is in the travel kit?",
        pending: "Confirm the actual contents. Precision here is a small but real trust signal.",
      },
    ],
  },
  {
    id: "insurance",
    title: "Insurance",
    items: [
      {
        question: "What does the travel insurance cover?",
        pending:
          "Confirm insurer, coverage amount, medical and evacuation cover, baggage cover, and specifically whether elderly travellers are covered.",
      },
    ],
  },
  {
    id: "support",
    title: "Guidance & support",
    items: [
      {
        question: "Is this suitable for first-time pilgrims?",
        pending:
          "Confirm any pre-departure briefing you offer in Bengaluru — Ihram, Tawaf and Sa'i guidance. Strong selling point if you offer it.",
      },
      { question: "Will there be a group leader with us throughout?", pending: "Confirm." },
      {
        question: "Is support available if something goes wrong during the trip?",
        pending:
          "24x7 support is listed as included — confirm exactly how travellers reach it inside Saudi Arabia (WhatsApp number, local contact).",
      },
    ],
  },
  {
    id: "women-elderly",
    title: "Women & elderly travellers",
    items: [
      {
        question: "Do you provide a female group coordinator?",
        pending: "Confirm. If not currently offered, say so before advertising family packages heavily.",
      },
      { question: "Do you offer wheelchair or mobility assistance?", pending: "Confirm." },
    ],
  },
  {
    id: "payment",
    title: "Payment",
    items: [
      {
        question: "How do I pay, and is it secure?",
        answer:
          "Online card payment is not enabled on this website yet, so nothing sensitive is collected here. Today, bookings are confirmed with us directly and paid through the channel we set out on your written quote. When online payment goes live it will run through a certified gateway over an encrypted connection, and we will never store your card details ourselves.",
      },
      {
        question: "Do I need to pay the full amount upfront?",
        pending: "Confirm deposit amount versus full payment, and the payment schedule and deadline.",
      },
      {
        question: "What if I need to cancel after paying?",
        answer:
          "What you get back depends on how close to departure you cancel. The exact windows, and the costs that can never be recovered, are set out in full on our refund and cancellation policy page.",
      },
    ],
  },
];

/** Only confirmed answers belong in structured data. */
export const answeredFaqs = faqGroups.flatMap((group) =>
  group.items.filter((item): item is FaqItem & { answer: string } => Boolean(item.answer)),
);
