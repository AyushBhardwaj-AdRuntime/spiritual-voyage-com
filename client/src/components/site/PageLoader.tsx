import { useEffect, useState } from "react";

import { site } from "@/data/site";

/**
 * First-load loader: a thin gold line draws itself under the wordmark on navy,
 * then the whole overlay fades away. Shown once per browser session.
 *
 * REPLACE: drop your logo icon in place of the wordmark below.
 */
export function PageLoader() {
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(true);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("sxg-loader-seen") === "1";
    if (alreadySeen) return;
    setDone(false);
    setMounted(true);
    const leave = setTimeout(() => setLeaving(true), 1900);
    const finish = setTimeout(() => {
      setDone(true);
      sessionStorage.setItem("sxg-loader-seen", "1");
    }, 2800);
    return () => {
      clearTimeout(leave);
      clearTimeout(finish);
    };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-navy transition-opacity duration-900 ease-out"
      style={{ opacity: leaving ? 0 : 1, pointerEvents: leaving ? "none" : "auto" }}
    >
      <span
        className="font-serif text-2xl tracking-[0.32em] text-cream uppercase"
        style={{
          animation: mounted ? "soft-fade-in 1200ms ease-out both" : undefined,
        }}
      >
        {site.name}
      </span>
      <span
        className="mt-6 h-px w-40 origin-left bg-gold"
        style={{
          animation: mounted ? "draw-line 1700ms cubic-bezier(0.22,1,0.36,1) both" : undefined,
        }}
      />
      <span className="mt-6 text-[0.6rem] uppercase tracking-[0.3em] text-cream/50">
        {site.legalName}
      </span>
    </div>
  );
}
