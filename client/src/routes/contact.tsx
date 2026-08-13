import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone, Instagram } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { LocationMap } from "@/components/site/LocationMap";
import { PageHero } from "@/components/site/PageHero";
import { media } from "@/data/media";
import { Reveal } from "@/components/site/Reveal";
import { packages } from "@/data/packages";
import { site } from "@/data/site";
import { api, ApiRequestError } from "@/lib/api";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Enquiry & Contact — ${site.name}` },
      {
        name: "description",
        content: `Ask us anything about Umrah and Ziyarah travel. Email ${site.email}, call ${site.phone}, or message us on WhatsApp — we reply within 24 hours.`,
      },
      { property: "og:title", content: `Enquiry & Contact — ${site.name}` },
      {
        property: "og:description",
        content: "Send an enquiry and a real person will answer, usually within a day.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const fieldClass =
  "h-12 w-full border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none";
const labelClass = "text-[0.6rem] tracking-[0.22em] text-muted-foreground uppercase";

function ContactPage() {
  const [sending, setSending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const formOpenedAt = useRef<number>(Date.now());

  return (
    <>
      <PageHero
        eyebrow="Enquiry"
        title="Ask us anything, even if you are only thinking about it"
        intro="There is no obligation in a question. Many of our pilgrims write to us months before they travel — sometimes years. Whenever you write, someone real will answer."
        mediaLabel="Our office on Mosque Road"
        mediaSrc={media.madinahDomes}
      />

      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_380px] lg:px-10">
          {/* Form */}
          <Reveal>
            <h2 className="text-3xl">Send us a note</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Tell us as much or as little as you like. Even a single line is enough to start.
            </p>
            <form
              className="mt-10 grid gap-6 sm:grid-cols-2"
              onSubmit={async (event) => {
                event.preventDefault();
                setSending(true);
                setFieldErrors({});

                const form = event.currentTarget;
                const data = new FormData(form);

                try {
                  await api.enquiry.submit({
                    name: data.get("name") as string,
                    email: data.get("email") as string,
                    message: data.get("message") as string,
                    submittedAt: formOpenedAt.current,
                    ...((data.get("phone") as string) ? { phone: data.get("phone") as string } : {}),
                    ...((data.get("country") as string) ? { country: data.get("country") as string } : {}),
                    ...((data.get("package") as string) ? { packageSlug: data.get("package") as string } : {}),
                    ...((data.get("_hp") as string) ? { honeypot: data.get("_hp") as string } : {}),
                  });

                  form.reset();
                  formOpenedAt.current = Date.now();
                  toast.success("Thank you — your enquiry has reached us. We reply within 24 hours.");
                } catch (err) {
                  if (err instanceof ApiRequestError) {
                    if (err.status === 429) {
                      toast.error("You have sent too many enquiries. Please try again in an hour.");
                    } else if (err.status === 422) {
                      setFieldErrors(err.fieldErrors);
                      toast.error(err.firstFieldError ?? "Please check the form for errors.");
                    } else {
                      toast.error("Something went wrong. Please try again or contact us directly.");
                    }
                  } else {
                    toast.error("Network error. Please check your connection and try again.");
                  }
                } finally {
                  setSending(false);
                }
              }}
            >
              {/* Honeypot — hidden from real users, bots fill it */}
              <input name="_hp" type="text" autoComplete="off" tabIndex={-1} style={{ display: "none" }} />
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className={labelClass}>
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  className={`${fieldClass}${fieldErrors["name"] ? " border-red-500" : ""}`}
                />
                {fieldErrors["name"] && <p className="text-xs text-red-500">{fieldErrors["name"][0]}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={`${fieldClass}${fieldErrors["email"] ? " border-red-500" : ""}`}
                />
                {fieldErrors["email"] && <p className="text-xs text-red-500">{fieldErrors["email"][0]}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className={labelClass}>
                  Phone / WhatsApp
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className={fieldClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="country" className={labelClass}>
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className={fieldClass}
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="package" className={labelClass}>
                  Preferred package
                </label>
                <select id="package" name="package" className={fieldClass}>
                  <option value="">Not sure yet</option>
                  {packages.map((pkg) => (
                    <option key={pkg.slug} value={pkg.slug}>
                      {pkg.name} — {pkg.duration}
                    </option>
                  ))}
                  <option value="custom">A private / custom journey</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="message" className={labelClass}>
                  Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Who is travelling, roughly when, and anything we should know."
                  className={`w-full border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none${fieldErrors["message"] ? " border-red-500" : " border-border"}`}
                />
                {fieldErrors["message"] && <p className="text-xs text-red-500">{fieldErrors["message"][0]}</p>}
              </div>
              <div className="sm:col-span-2">
                <button type="submit" disabled={sending} className="btn-gold disabled:opacity-60">
                  {sending ? "Sending…" : "Send enquiry"}
                </button>
                <p className="mt-4 text-xs text-muted-foreground">
                  We never share your details, and we do not send marketing you did not ask for.
                </p>
              </div>
            </form>
          </Reveal>

          {/* Contact details */}
          <Reveal delay={140} className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-border bg-card p-8">
              <h2 className="text-2xl">Reach us directly</h2>
              <ul className="mt-8 space-y-6 text-sm">
                <li className="flex gap-4">
                  <Mail className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                  <span className="min-w-0">
                    <span className={labelClass}>Email</span>
                    <a href={`mailto:${site.email}`} className="link-quiet mt-1 block break-all">
                      {site.email}
                    </a>
                  </span>
                </li>
                <li className="flex gap-4">
                  <Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                  <span>
                    <span className={labelClass}>Phone</span>
                    <a href={site.phoneHref} className="link-quiet mt-1 block">
                      {site.phone}
                    </a>
                  </span>
                </li>
                <li className="flex gap-4">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                  <span>
                    <span className={labelClass}>Office</span>
                    <span className="mt-1 block leading-relaxed">{site.address}</span>
                  </span>
                </li>
                <li className="flex gap-4">
                  <Instagram className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                  <span>
                    <span className={labelClass}>Instagram</span>
                    <a href={site.instagram} target="_blank" rel="noreferrer" className="link-quiet mt-1 block break-all">
                      {site.instagram}
                    </a>
                  </span>
                </li>
                <li className="flex gap-4">
                  <Clock className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                  <span>
                    <span className={labelClass}>Response time</span>
                    <span className="mt-1 block">{site.responsePromise}</span>
                  </span>
                </li>
              </ul>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn-gold mt-8 w-full"
              >
                <MessageCircle className="size-4" aria-hidden />
                Message on WhatsApp
              </a>
            </div>

            <LocationMap className="mt-6" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
