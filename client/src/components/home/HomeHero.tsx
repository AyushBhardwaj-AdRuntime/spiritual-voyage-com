import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { media } from "@/data/media";

/**
 * Full-viewport hero. Desktop plays the looping film; mobile shows a still
 * frame from it (video backgrounds are heavy on mobile data).
 */
const VIDEO_SRC = media.heroVideo;

export function HomeHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true); // Default to true to render video element, we'll hide it via css or just let it play. Actually, let's just use CSS media queries or let it play everywhere.
  /** Held back until the browser is idle so the poster wins the first paint. */
  const [videoReady, setVideoReady] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);

  useEffect(() => {
    // Relaxed check: we want the video to play if they have a decent screen size. 
    // Removing connection.saveData checks as they aggressively block video for many users.
    const query = window.matchMedia("(min-width: 640px)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const start = () => setVideoReady(true);
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number })
      .requestIdleCallback;
    if (idle) {
      idle(start);
      return;
    }
    const timer = window.setTimeout(start, 500); // reduced delay
    return () => window.clearTimeout(timer);
  }, [isDesktop]);

  const showVideo = isDesktop && videoReady && VIDEO_SRC !== "";

  return (
    <section className="relative isolate flex min-h-screen items-end overflow-hidden bg-navy">
      <div className="absolute inset-0">
        {/* Poster is the LCP element: always present, always eager. */}
        <img
          src={media.heroPoster}
          alt="The Haram in Makkah at first light"
          width={1280}
          height={1600}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
        />
        {showVideo && (
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            poster={media.heroPoster}
            autoPlay
            loop
            muted={muted}
            playsInline
            preload="auto"
            onPlaying={() => setVideoVisible(true)}
            aria-label="Looping footage of the Haram in Makkah"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              videoVisible ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-navy via-navy/70 to-navy/40"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-40 pb-24 lg:px-10">
        <p
          className="eyebrow"
          style={{ animation: "soft-fade-in 1400ms ease-out 300ms both" }}
        >
          Makkah &amp; Madinah
        </p>
        <h1
          className="mt-8 max-w-3xl text-4xl leading-[1.1] text-cream sm:text-5xl lg:text-6xl"
          style={{ animation: "soft-fade-in 1600ms ease-out 500ms both" }}
        >
          Some journeys are not travelled. They are answered.
        </h1>
        <p
          className="mt-8 max-w-xl text-base leading-relaxed text-cream/75"
          style={{ animation: "soft-fade-in 1600ms ease-out 800ms both" }}
        >
          Guided Umrah and Ziyarah for pilgrims from every corner of the world, arranged so that
          nothing stands between you and the moment you arrive.
        </p>
        <div
          className="mt-12 flex flex-wrap items-center gap-6"
          style={{ animation: "soft-fade-in 1600ms ease-out 1100ms both" }}
        >
          <a href="#promise" className="btn-gold">
            Begin your journey
          </a>
          {showVideo && (
            <button
              type="button"
              onClick={() => setMuted((v) => !v)}
              aria-label={muted ? "Unmute background video" : "Mute background video"}
              className="inline-flex size-11 items-center justify-center border border-cream/30 text-cream transition-colors hover:border-gold hover:text-gold"
            >
              {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
