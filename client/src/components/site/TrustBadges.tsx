import { BadgeCheck, ShieldCheck, Star } from "lucide-react";

import { visibleCredentials } from "@/data/legal";
import { cn } from "@/lib/utils";

/**
 * Only shows credentials that have a real value in src/data/legal.ts.
 * Nothing is invented here — an empty field simply does not render.
 */
export function TrustBadges({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const items = visibleCredentials();
  if (items.length === 0) return null;

  return (
    <ul
      className={cn(
        "grid gap-px border sm:grid-cols-2 lg:grid-cols-3",
        tone === "dark" ? "border-cream/15 bg-cream/15" : "border-border bg-border",
        className,
      )}
    >
      {items.map((item) => {
        const Icon = item.href ? Star : item.label.toLowerCase().includes("licence") ? BadgeCheck : ShieldCheck;
        const body = (
          <>
            <Icon className="size-4 shrink-0 text-gold" aria-hidden />
            <span className="min-w-0">
              <span className="block text-[0.6rem] tracking-[0.22em] uppercase opacity-70">
                {item.label}
              </span>
              <span className="mt-1 block font-serif text-lg break-words">{item.value}</span>
            </span>
          </>
        );
        return (
          <li key={item.label} className={cn("p-6", tone === "dark" ? "bg-navy" : "bg-card")}>
            {item.href ? (
              <a href={item.href} target="_blank" rel="noreferrer" className="flex gap-4 link-quiet">
                {body}
              </a>
            ) : (
              <span className="flex gap-4">{body}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
