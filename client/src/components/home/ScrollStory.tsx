import { useEffect, useRef, useState } from "react";

import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import { media } from "@/data/media";

/**
 * Scroll-pinned storytelling sequence.
 * The visual stays fixed while frames cross-fade and captions rise, driven by
 * how far the tall outer section has been scrolled.
 *
 * REPLACE: swap each frame's placeholder for your own photo or short clip.
 */
const frames = [
  {
    media: "Kaaba at first light",
    src: media.kabah,
    caption: "The first sight of it. Nothing prepares you, and nothing needs to.",
  },
  {
    media: "Crowds in prayer at the Haram",
    src: media.haramArches,
    caption: "Thousands of languages, one direction, one silence between the lines.",
  },
  {
    media: "The green dome of Masjid an-Nabawi",
    src: media.madinahDomes,
    caption: "Madinah receives you differently — slower, softer, like coming home.",
  },
  {
    media: "Madinah street at dusk",
    src: media.madinahGate,
    caption: "Evenings spent walking streets that have held these footsteps for centuries.",
  },
  {
    media: "Pilgrims leaving after Fajr",
    src: media.haramDawn,
    caption: "And when you leave, part of you stays. That part is why people return.",
  },
];

export function ScrollStory() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const node = sectionRef.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        if (scrollable <= 0) return;
        const progress = Math.min(Math.max(-rect.top / scrollable, 0), 0.999);
        setActive(Math.floor(progress * frames.length));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="The experience"
      className="relative bg-navy"
      style={{ height: `${(frames.length + 1) * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {frames.map((frame, i) => (
          <div
            key={frame.media}
            aria-hidden={i !== active}
            className="absolute inset-0 transition-opacity duration-1200 ease-out"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            <MediaPlaceholder label={frame.media} src={frame.src} aspect="" className="h-full w-full" />
          </div>
        ))}

        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-navy via-navy/60 to-navy/30"
        />

        <div className="relative mx-auto w-full max-w-4xl px-6 text-center lg:px-10">
          <p className="eyebrow">The experience</p>
          {frames.map((frame, i) => (
            <p
              key={frame.caption}
              className="mt-10 font-serif text-2xl leading-[1.35] text-cream transition-all duration-1000 ease-out sm:text-3xl lg:text-4xl"
              style={{
                opacity: i === active ? 1 : 0,
                transform: i === active ? "none" : "translateY(20px)",
                position: i === active ? "relative" : "absolute",
                left: i === active ? undefined : "-9999px",
              }}
            >
              {frame.caption}
            </p>
          ))}
          <div className="mt-14 flex items-center justify-center gap-2" aria-hidden>
            {frames.map((frame, i) => (
              <span
                key={frame.media}
                className="h-px w-8 transition-colors duration-700"
                style={{
                  backgroundColor:
                    i === active ? "var(--color-gold)" : "color-mix(in oklab, var(--color-cream) 25%, transparent)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
