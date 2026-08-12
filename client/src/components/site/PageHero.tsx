import type { ReactNode } from "react";

import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import { Reveal } from "@/components/site/Reveal";

/** Shared banner for interior pages: navy, spacious, quiet. */
export function PageHero({
  eyebrow,
  title,
  intro,
  mediaLabel,
  mediaSrc,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  mediaLabel?: string;
  mediaSrc?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy pt-36 pb-24 text-cream">
      {mediaLabel && (
        <div className={mediaSrc ? "absolute inset-0 opacity-45" : "absolute inset-0 opacity-20"}>
          {/* REPLACE: banner image for this page */}
          <MediaPlaceholder
            label={mediaLabel}
            src={mediaSrc}
            className="h-full w-full"
            aspect=""
            priority
            sizes="100vw"
          />
        </div>
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-navy/70 via-navy/85 to-navy"
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">{title}</h1>
          <span className="gold-rule mt-8 block" />
          {intro && (
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-cream/75">{intro}</p>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
