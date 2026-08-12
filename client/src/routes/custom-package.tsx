import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { TrustBadges } from "@/components/site/TrustBadges";
import { media } from "@/data/media";
import { site, whatsappLink } from "@/data/site";
import { api, ApiRequestError } from "@/lib/api";

export const Route = createFileRoute("/custom-package")({
  head: () => ({
    meta: [
      { title: `Request a Custom or Group Umrah Package — ${site.name}` },
      {
        name: "description",
        content:
          "Travelling as a family, a group of friends, a masjid jamaat or a corporate group? Tell us your dates, budget and needs and we will build the journey around them.",
      },
      { property: "og:title", content: `Custom & Group Umrah Journeys — ${site.name}` },
      {
        property: "og:description",
        content: "Tailored Umrah and Ziyarah journeys built around your dates, group size and budget.",
      },
      { property: "og:url", content: "/custom-package" },
    ],
    links: [{ rel: "canonical", href: "/custom-package" }],
  }),
  component: CustomPackagePage,
});

const fieldClass =
  "h-12 w-full border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none";
const labelClass = "text-[0.6rem] tracking-[0.22em] text-muted-foreground uppercase";

const groupTypes = [
  "Family",
  "Group of friends",
  "Masjid / jamaat group",
  "Corporate or institutional group",
  "Elderly or wheelchair-assisted travellers",
  "Honeymoon / couple",
];

function CustomPackagePage() {
  const [sending, setSending] = useState(false);
  const formOpenedAt = useRef<number>(Date.now());

  /** Map display label to API enum value */
  const groupTypeMap: Record<string, "family" | "friends" | "corporate" | "solo" | "other"> = {
    Family: "family",
    "Group of friends": "friends",
    "Masjid / jamaat group": "corporate",
    "Corporate or institutional group": "corporate",
    "Elderly or wheelchair-assisted travellers": "other",
    "Honeymoon / couple": "family",
  };

  const roomsMap: Record<string, "sharing" | "twin" | "triple" | "quad" | "private"> = {
    "Double sharing": "sharing",
    "Triple sharing": "triple",
    "Quad sharing": "quad",
    "Private rooms": "private",
  };

  return (
    <>
      <PageHero
        eyebrow="Custom & group"
        title="If none of our three packages is quite right, we build the fourth"
        intro="Most of the journeys we arrange are not off a list. They are shaped around school holidays, an elderly parent's pace, a group of thirty from one masjid, or a budget that has to be respected."
        mediaLabel="Group of pilgrims in the courtyard"
        mediaSrc={media.haramDawn}
      />

      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_360px] lg:px-10">
          <Reveal>
            <h2 className="text-3xl">Tell us what you need</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Rough answers are fine. We will come back with one or two options and a clear price,
              with no obligation to proceed.
            </p>

            <form
              className="mt-10 grid gap-6 sm:grid-cols-2"
              onSubmit={async (event) => {
                event.preventDefault();
                setSending(true);
                const form = event.currentTarget;
                const data = new FormData(form);

                const groupTypeRaw = data.get("groupType") as string;
                const roomsRaw = data.get("rooms") as string;
                const travellerCount = parseInt(data.get("travellers") as string, 10);

                const groupType = groupTypeMap[groupTypeRaw] ?? "other";
                const rooms = roomsMap[roomsRaw] ?? "sharing";

                try {
                  const result = await api.customPackage.submit({
                    name: data.get("name") as string,
                    email: data.get("email") as string,
                    groupType,
                    travellers: isNaN(travellerCount) ? 1 : travellerCount,
                    rooms,
                    ...((data.get("phone") as string) ? { phone: data.get("phone") as string } : {}),
                    ...((data.get("departure") as string) ? { departureCity: data.get("departure") as string } : {}),
                    ...((data.get("dates") as string) ? { dates: data.get("dates") as string } : {}),
                    ...((data.get("nights") as string) ? { nights: data.get("nights") as string } : {}),
                    ...((data.get("budget") as string) ? { budget: data.get("budget") as string } : {}),
                    ...((data.get("needs") as string) ? { needs: data.get("needs") as string } : {}),
                  });

                  form.reset();
                  formOpenedAt.current = Date.now();

                  if (result.largeGroup) {
                    toast.success("Received — your large group request has been flagged for priority handling. We'll reply within 24 hours.");
                  } else {
                    toast.success("Received — we'll come back with a tailored proposal within 24 hours.");
                  }
                } catch (err) {
                  if (err instanceof ApiRequestError) {
                    if (err.status === 422) {
                      const firstError = err.firstFieldError;
                      toast.error(firstError ?? "Please check the form for errors.");
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
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className={labelClass}>
                  Contact name
                </label>
                <input id="name" name="name" required autoComplete="name" className={fieldClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input id="email" name="email" type="email" required autoComplete="email" className={fieldClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className={labelClass}>
                  Phone / WhatsApp
                </label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" className={fieldClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="departure" className={labelClass}>
                  Departure city
                </label>
                <input id="departure" name="departure" className={fieldClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="groupType" className={labelClass}>
                  Group type
                </label>
                <select id="groupType" name="groupType" className={fieldClass}>
                  <option value="">Select…</option>
                  {groupTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="travellers" className={labelClass}>
                  Number of travellers
                </label>
                <input id="travellers" name="travellers" type="number" min="1" className={fieldClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="dates" className={labelClass}>
                  Preferred dates or month
                </label>
                <input id="dates" name="dates" placeholder="e.g. second half of Ramadan" className={fieldClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="nights" className={labelClass}>
                  Nights preferred
                </label>
                <input id="nights" name="nights" placeholder="e.g. 7 Makkah + 4 Madinah" className={fieldClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="budget" className={labelClass}>
                  Budget per person
                </label>
                <input id="budget" name="budget" placeholder="Any currency" className={fieldClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="rooms" className={labelClass}>
                  Room sharing
                </label>
                <select id="rooms" name="rooms" className={fieldClass}>
                  <option value="">No preference</option>
                  <option>Double sharing</option>
                  <option>Triple sharing</option>
                  <option>Quad sharing</option>
                  <option>Private rooms</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="needs" className={labelClass}>
                  Anything we should plan around
                </label>
                <textarea
                  id="needs"
                  name="needs"
                  rows={6}
                  placeholder="Mobility or wheelchair needs, children's ages, dietary requirements, Ziyarah sites you especially want, language preference for your guide."
                  className="w-full border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" disabled={sending} className="btn-gold disabled:opacity-60">
                  {sending ? "Sending…" : "Request a proposal"}
                </button>
                <p className="mt-4 text-xs text-muted-foreground">
                  No deposit, no obligation. {site.responsePromise}
                </p>
              </div>
            </form>
          </Reveal>

          <Reveal delay={140} className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-border bg-card p-8">
              <h2 className="text-2xl">Prefer to talk?</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Group planning is faster in conversation. Send us a message and we will reply with
                questions, not a brochure.
              </p>
              <a
                href={whatsappLink("Assalamu alaikum — I'd like a custom / group Umrah package.")}
                target="_blank"
                rel="noreferrer"
                className="btn-gold mt-8 w-full"
              >
                <MessageCircle className="size-4" aria-hidden />
                WhatsApp our group desk
              </a>
              <a href={site.phoneHref} className="btn-quiet mt-3 w-full text-foreground">
                Call {site.phone}
              </a>
            </div>
            <TrustBadges className="mt-6 sm:grid-cols-1 lg:grid-cols-1" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
