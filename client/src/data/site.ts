export const site = {
  name: "SafarXGlobal",
  legalName: "AL HASAN TRAVEL & TOURS",
  mission:
    "Guided Umrah and Ziyarah journeys to Makkah and Madinah, arranged with care so your attention can stay where it belongs.",
  email: "info@safarxglobal.com",
  phone: "098457 91555",
  phoneHref: "tel:+919845791555",
  whatsapp: "https://wa.me/919845791555",
  whatsappNumber: "919845791555",
  address: "145, Mosque Rd, Fraser Town, Bengaluru, Karnataka 560005",
  instagram: "https://www.instagram.com/al_hasan_travelandtours?igsh=MXhxc3MxdTVlNmJqYw==",
  responsePromise: "We reply within 24 hours.",
} as const;

/** WhatsApp deep link with a message pre-filled. */
export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/packages", label: "Packages" },
  { to: "/compare", label: "Compare" },
  { to: "/gallery", label: "Gallery" },
  { to: "/visa-assistance", label: "Visa Help" },
  { to: "/why-choose-us", label: "Why Choose Us" },
  { to: "/contact", label: "Contact" },
] as const;

export const legalLinks = [
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/refund-policy", label: "Refund & Cancellation" },
] as const;
