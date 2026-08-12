/**
 * Trust credentials and legal content.
 *
 * IMPORTANT: every value here is shown publicly. Leave a field as an empty
 * string and it is hidden from the site automatically — never invent a
 * licence number, rating or certification.
 */

export type Credential = {
  label: string;
  /** Leave empty ("") until you have the real value — the badge stays hidden. */
  value: string;
  note?: string;
  href?: string;
};

/** REPLACE: fill in the real values from your licence documents. */
export const credentials: Credential[] = [
  { label: "IATA / travel licence no.", value: "", note: "As printed on your licence" },
  { label: "Ministry of Hajj & Umrah authorisation", value: "" },
  { label: "Registered trade licence", value: "AL HASAN TRAVEL & TOURS" },
  { label: "Years arranging journeys", value: "" },
  {
    label: "Google reviews",
    value: "",
    href: "",
    note: "Paste your Google Business profile link",
  },
  { label: "Trustpilot", value: "", href: "" },
];

export const visibleCredentials = () => credentials.filter((c) => c.value.trim().length > 0);

/** Shown next to the (not yet wired) payment step. */
export const paymentSecurity = {
  processorNote: "Card payments will be handled by a certified payment provider.",
  encryptionNote: "256-bit TLS encryption on every page.",
  storageNote: "We never see or store your full card details.",
  status: "Online payment is not yet enabled — bookings are confirmed by our team first.",
} as const;

export const policyUpdated = "9 August 2026";

/**
 * REPLACE: these are conservative placeholder terms. Confirm the real
 * deposit amount, cut-off windows and non-refundable items with your team
 * (and ideally a lawyer) before publishing.
 */
export const refundTiers: { window: string; outcome: string }[] = [
  { window: "More than 45 days before departure", outcome: "Full refund less the booking deposit and any non-refundable third-party costs already incurred." },
  { window: "45 to 21 days before departure", outcome: "Partial refund — recoverable hotel and transport costs are returned; issued visa, air and processing fees are not." },
  { window: "20 to 8 days before departure", outcome: "Limited refund — only costs our suppliers agree to release can be returned." },
  { window: "7 days or fewer, or no-show", outcome: "No refund, as the full journey cost has been committed to hotels, transport and airlines." },
];

export const nonRefundable: string[] = [
  "Visa application and processing fees once submitted",
  "Issued or ticketed airfare, subject to the airline's own rules",
  "Bank, card and currency conversion charges",
  "Any service already delivered",
];
