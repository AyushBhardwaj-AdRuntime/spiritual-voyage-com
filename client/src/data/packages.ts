export type PackageHighlight = {
  label: string;
  value: string;
};

export type ItineraryDay = {
  day: string;
  title: string;
  body: string;
};

export type TourPackage = {
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  story: string[];
  fromPrice: string;
  /** Numeric base for the currency toggle (INR, per person, sharing). */
  fromPriceInr: number;
  duration: string;
  durationNights: number;
  hotelProximity: string;
  groupSize: string;
  type: "Umrah" | "Umrah + Ziyarah" | "Family";
  highlights: PackageHighlight[];
  itinerary: ItineraryDay[];
  included: string[];
  notIncluded: string[];
  faqs: { question: string; answer: string }[];
  /* REPLACE: swap these labels for your own package photography */
  galleryCaptions: string[];
};

export const packages: TourPackage[] = [
  {
    slug: "essential-umrah",
    name: "Essential Umrah",
    tagline: "Everything you need, nothing you don't",
    shortDescription:
      "A carefully kept, uncomplicated journey for pilgrims who want their attention on worship rather than logistics.",
    story: [
      "This is the journey we designed for the traveller who wants to arrive, settle quickly, and spend their days in the Haram. Nothing is ornamental. Every arrangement exists to remove a decision from your shoulders.",
      "You are met at the airport, moved without waiting, and shown to a room within a short walk of the Masjid. Your guide walks the route with you before your first Umrah, so that when the moment comes it is familiar rather than overwhelming.",
      "The pace is unhurried. Mornings are yours. Evenings are yours. We stay close, quietly, for the questions that come up in between.",
    ],
    fromPrice: "₹92,000",
    fromPriceInr: 92000,
    duration: "10 days",
    durationNights: 10,
    hotelProximity: "700m from Masjid al-Haram",
    groupSize: "Small group — up to 20",
    type: "Umrah",
    highlights: [
      { label: "Duration", value: "10 days / 9 nights" },
      { label: "Hotel", value: "700m from the Haram" },
      { label: "Group", value: "Up to 20 pilgrims" },
      { label: "Guide", value: "Arabic & English speaking" },
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Jeddah, transfer to Makkah",
        body: "Met at the airport, assisted through immigration, and driven to your hotel. A light orientation and rest before your first visit to the Haram.",
      },
      {
        day: "Day 2",
        title: "Umrah with your guide",
        body: "A calm, step-by-step Umrah accompanied by your guide, timed to avoid the heaviest crowds.",
      },
      {
        day: "Days 3–5",
        title: "Days in Makkah",
        body: "Open days for worship, with optional guided visits to the historical sites around the city.",
      },
      {
        day: "Day 6",
        title: "Travel to Madinah",
        body: "A comfortable transfer to Madinah, arriving in time for evening prayer.",
      },
      {
        day: "Days 7–9",
        title: "Days in Madinah",
        body: "Time at Masjid an-Nabawi, assisted Rawdah booking, and a guided Ziyarah of the city.",
      },
      {
        day: "Day 10",
        title: "Departure",
        body: "Transfer to the airport with time to spare, and a farewell from your guide.",
      },
    ],
    included: [
      "Return flights (economy)",
      "Umrah visa processing",
      "Hotel accommodation in Makkah and Madinah",
      "All ground transfers, including Makkah–Madinah",
      "Guided Umrah and city Ziyarah",
      "Daily breakfast",
      "Assistance with Rawdah permits",
      "24/7 on-ground support",
    ],
    notIncluded: [
      "Travel insurance",
      "Lunch and dinner",
      "Personal shopping and gifts",
      "Ihram clothing",
      "Optional excursions",
      "Passport fees",
    ],
    faqs: [
      {
        question: "What documents do I need?",
        answer:
          "A passport valid for at least six months, recent photographs, and your vaccination record. We handle the visa application and tell you exactly what to send.",
      },
      {
        question: "What should I pack?",
        answer:
          "Ihram, comfortable footwear you can walk long distances in, modest everyday clothing, unscented toiletries, and any regular medication. We send a full checklist once you book.",
      },
      {
        question: "Is this suitable for a first-time pilgrim?",
        answer:
          "Yes. This package is the one we most often recommend for a first journey, because the guidance is close and the schedule is gentle.",
      },
    ],
    galleryCaptions: [
      "Hotel exterior",
      "Room interior",
      "Walk to the Haram",
      "Group at Masjid an-Nabawi",
    ],
  },
  {
    slug: "comfort-package",
    name: "Comfort Package",
    tagline: "Closer, calmer, with more room to breathe",
    shortDescription:
      "Shorter walks, quieter rooms, and fewer travellers in the group — for those who would rather conserve their energy for worship.",
    story: [
      "Distance matters more than most brochures admit. Two hundred metres, five times a day, over ten days, is the difference between arriving at prayer settled or arriving out of breath.",
      "So this journey moves you closer. Rooms are quieter and larger, the group is smaller, and transfers are private. There is space in the schedule for rest without guilt.",
      "The guidance is the same as our Essential journey — the same people, the same care — simply with more comfort held around it.",
    ],
    fromPrice: "₹1,45,000",
    fromPriceInr: 145000,
    duration: "12 days",
    durationNights: 12,
    hotelProximity: "250m from Masjid al-Haram",
    groupSize: "Intimate group — up to 12",
    type: "Umrah + Ziyarah",
    highlights: [
      { label: "Duration", value: "12 days / 11 nights" },
      { label: "Hotel", value: "250m from the Haram" },
      { label: "Group", value: "Up to 12 pilgrims" },
      { label: "Transfers", value: "Private vehicles" },
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival and private transfer",
        body: "Private meet-and-greet in Jeddah and a direct transfer to your hotel beside the Haram.",
      },
      {
        day: "Day 2",
        title: "Guided Umrah",
        body: "Your Umrah at a time chosen for calm, with your guide beside you throughout.",
      },
      {
        day: "Days 3–6",
        title: "Makkah, unhurried",
        body: "Open worship days, plus guided visits to Jabal al-Nour, Mina, and Arafat for those who wish.",
      },
      {
        day: "Day 7",
        title: "Journey to Madinah",
        body: "A private transfer to Madinah with a rest stop, arriving before Maghrib.",
      },
      {
        day: "Days 8–11",
        title: "Madinah days",
        body: "Extended time near Masjid an-Nabawi, assisted Rawdah visits, and an unrushed Ziyarah of the city's historical sites.",
      },
      {
        day: "Day 12",
        title: "Departure",
        body: "A final morning in the Masjid, then a private transfer to the airport.",
      },
    ],
    included: [
      "Return flights (economy, preferred carriers)",
      "Umrah visa processing",
      "Four-star hotels within 250m of the Haram",
      "Private airport and intercity transfers",
      "Guided Umrah and full Ziyarah programme",
      "Breakfast and dinner daily",
      "Priority assistance with Rawdah permits",
      "Dedicated group leader throughout",
    ],
    notIncluded: [
      "Travel insurance",
      "Lunch",
      "Personal expenses",
      "Ihram clothing",
      "Room upgrades on request",
      "Passport fees",
    ],
    faqs: [
      {
        question: "How close is the hotel, really?",
        answer:
          "Roughly a three to four minute walk to the nearest gate of Masjid al-Haram. We name the exact hotel in your confirmation, never a vague category.",
      },
      {
        question: "Can I travel alone on this package?",
        answer:
          "Yes. Solo travellers are common. You can choose a private room, or we can pair you with a fellow pilgrim of the same gender at a lower cost.",
      },
      {
        question: "Do you help with the visa?",
        answer:
          "We process the Umrah visa on your behalf. You send documents once; we take it from there and keep you updated at each stage.",
      },
    ],
    galleryCaptions: [
      "Hotel lobby",
      "Haram view from the room",
      "Guided Ziyarah",
      "Evening in Madinah",
    ],
  },
  {
    slug: "premium-family-package",
    name: "Premium Family Package",
    tagline: "For journeys taken together",
    shortDescription:
      "Built around families travelling with elders and children: connecting rooms, wheelchair support, flexible days, and a guide who knows everyone's name.",
    story: [
      "Travelling as a family changes the shape of the journey. There are prams and wheelchairs, nap times and different walking speeds, and a grandparent who has waited a lifetime for this.",
      "We plan around all of it. Connecting or adjoining rooms, meals that suit children, wheelchair assistance from the aircraft door to the Haram gate, and a schedule that can slow down without anyone feeling they have fallen behind.",
      "Your guide stays with your family, not with a crowd. Someone always knows where everyone is — which is, for most parents, the real luxury.",
    ],
    fromPrice: "₹2,10,000",
    fromPriceInr: 210000,
    duration: "14 days",
    durationNights: 14,
    hotelProximity: "150m from Masjid al-Haram",
    groupSize: "Private family group",
    type: "Family",
    highlights: [
      { label: "Duration", value: "14 days / 13 nights" },
      { label: "Hotel", value: "150m from the Haram" },
      { label: "Group", value: "Your family only" },
      { label: "Support", value: "Wheelchair & child care" },
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival with full assistance",
        body: "Wheelchair and family assistance from the aircraft, expedited immigration where available, and a private transfer to Makkah.",
      },
      {
        day: "Day 2",
        title: "Umrah at your family's pace",
        body: "Your guide plans the timing around your elders and children, with rest points arranged in advance.",
      },
      {
        day: "Days 3–7",
        title: "Makkah together",
        body: "Flexible days, family-friendly meals, and optional guided visits that children can join.",
      },
      {
        day: "Day 8",
        title: "Transfer to Madinah",
        body: "A private, comfortable coach with space for the whole family and their luggage.",
      },
      {
        day: "Days 9–13",
        title: "Madinah days",
        body: "Extended stay near Masjid an-Nabawi, assisted Rawdah visits for each family member, and a gentle Ziyarah programme.",
      },
      {
        day: "Day 14",
        title: "Departure",
        body: "Late checkout where possible, then a private transfer and assisted departure.",
      },
    ],
    included: [
      "Return flights (economy, upgrades available)",
      "Umrah visas for the whole family",
      "Five-star hotels with connecting rooms",
      "Private transfers throughout",
      "Wheelchair and elder assistance",
      "Full board — breakfast, lunch and dinner",
      "Dedicated family guide",
      "Rawdah permit assistance for each traveller",
    ],
    notIncluded: [
      "Travel insurance",
      "Business class upgrades",
      "Personal shopping",
      "Ihram clothing",
      "Optional day excursions",
      "Passport fees",
    ],
    faqs: [
      {
        question: "Is there support for elderly travellers?",
        answer:
          "Yes. Wheelchair assistance is arranged at every airport and within the Haram, and our guides are trained to plan routes and rest points around mobility needs.",
      },
      {
        question: "What about young children?",
        answer:
          "Rooms are arranged to keep families together, meals account for children, and the schedule is built to allow naps and quieter afternoons.",
      },
      {
        question: "Can we customise the dates or length?",
        answer:
          "This package is private to your family, so dates, duration, and hotel choices can be adjusted. Tell us what you need in an enquiry.",
      },
    ],
    galleryCaptions: [
      "Family suite",
      "Wheelchair assistance",
      "Children at Ziyarah",
      "Family dinner",
    ],
  },
];

export function getPackage(slug: string) {
  return packages.find((p) => p.slug === slug);
}
