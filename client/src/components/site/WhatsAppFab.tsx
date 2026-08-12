import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

import { site, whatsappLink } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Floating WhatsApp button — appears after a little scrolling so it never
 * competes with the hero. Opens a chat with a gentle pre-filled message.
 */
export function WhatsAppFab() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "print:hidden fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3 transition-all duration-500",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      {open && (
        <div className="w-72 border border-border bg-card p-5 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <p className="font-serif text-xl leading-snug">How can we help?</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Message us on WhatsApp and a real person will reply — usually within a few hours.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            {[
              "Assalamu alaikum — I'd like to know about your Umrah packages.",
              "I'd like help with visa and documents for Umrah.",
              "Can you plan a custom journey for my family?",
            ].map((message) => (
              <a
                key={message}
                href={whatsappLink(message)}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="border border-border px-3 py-2 text-left text-xs leading-relaxed transition-colors hover:border-gold"
              >
                {message}
              </a>
            ))}
          </div>
          <a
            href={site.phoneHref}
            className="mt-4 block text-center text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase hover:text-gold"
          >
            Or call {site.phone}
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Chat with us on WhatsApp"
        className="flex items-center gap-3 rounded-full bg-gold px-5 py-4 text-navy shadow-lg transition-transform duration-500 hover:-translate-y-0.5"
      >
        <MessageCircle className="size-5" aria-hidden />
        <span className="hidden text-[0.65rem] tracking-[0.18em] uppercase sm:inline">
          WhatsApp us
        </span>
      </button>
    </div>
  );
}
