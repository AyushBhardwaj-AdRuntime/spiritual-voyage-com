import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import { PageHero } from "@/components/site/PageHero";
import { GalleryGridSkeleton } from "@/components/site/Skeletons";
import { media } from "@/data/media";
import { Reveal } from "@/components/site/Reveal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { site } from "@/data/site";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: `Gallery — Makkah & Madinah Journeys | ${site.name}` },
      {
        name: "description",
        content:
          "Photographs and short films from our Umrah and Ziyarah journeys — Makkah, Madinah, our groups and the hotels we use.",
      },
      { property: "og:title", content: `Gallery — ${site.name}` },
      {
        property: "og:description",
        content: "Photographs and short films from our Umrah and Ziyarah journeys.",
      },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  pendingComponent: () => (
    <div className="mx-auto max-w-7xl px-6 py-40 lg:px-10">
      <GalleryGridSkeleton />
    </div>
  ),
  component: GalleryPage,
});

type Item = { label: string; category: string; kind: "image" | "video"; src: string; tall?: boolean };

/* Client-supplied photography. Add new entries here as more photos arrive. */
const items: Item[] = [
  {
    label: "Qur'ans open on the Haram courtyard at first light",
    category: "Makkah",
    kind: "image",
    src: media.haramDawn,
    tall: true,
  },
  {
    label: "Sunlight through the Haram arches",
    category: "Makkah",
    kind: "image",
    src: media.haramArches,
  },
  {
    label: "The Ka'bah beneath the Makkah Clock Tower",
    category: "Makkah",
    kind: "image",
    src: media.kabah,
    tall: true,
  },
  {
    label: "Entering Masjid an-Nabawi through the golden gate",
    category: "Madinah",
    kind: "image",
    src: media.madinahGate,
    tall: true,
  },
  {
    label: "The green dome and minarets of Masjid an-Nabawi",
    category: "Madinah",
    kind: "image",
    src: media.madinahDomes,
  },
];

const categories = ["All", "Makkah", "Madinah"] as const;

function GalleryPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [open, setOpen] = useState<Item | null>(null);

  const visible = category === "All" ? items : items.filter((i) => i.category === category);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments from the journey"
        intro="Real frames from recent departures. No stock photography, no borrowed images — only what our pilgrims and guides brought home."
        mediaLabel="Panorama of Masjid al-Haram"
        mediaSrc={media.haramDawn}
      />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="flex flex-wrap gap-3" as="div">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={
                  "border px-5 py-2.5 text-[0.65rem] tracking-[0.2em] uppercase transition-colors " +
                  (category === c
                    ? "border-gold bg-gold text-navy"
                    : "border-border text-muted-foreground hover:border-gold hover:text-foreground")
                }
              >
                {c}
              </button>
            ))}
          </Reveal>

          <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {visible.map((item, i) => (
              <Reveal key={item.label} delay={(i % 6) * 80} className="break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setOpen(item)}
                  className="group block w-full overflow-hidden text-left"
                  aria-label={`Open ${item.label}`}
                >
                  <MediaPlaceholder
                    label={item.label}
                    kind={item.kind}
                    src={item.src}
                    aspect={item.tall ? "aspect-[3/4]" : "aspect-[4/3]"}
                    className="transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  <span className="mt-3 block text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
                    {item.category}
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-4xl rounded-none border-cream/15 bg-navy p-4 text-cream">
          <DialogTitle className="px-2 pt-2 font-serif text-xl">{open?.label}</DialogTitle>
          {open && (
            /* REPLACE: full-size image, or a <video controls> for video items */
            <MediaPlaceholder
              label={open.label}
              kind={open.kind}
              src={open.src}
              aspect="aspect-video"
              className="w-full"
            />
          )}
          <p className="px-2 pb-2 text-[0.65rem] tracking-[0.2em] text-cream/60 uppercase">
            {open?.category}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
