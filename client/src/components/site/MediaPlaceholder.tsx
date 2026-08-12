import { Camera, Play } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Media slot. When `src` is provided it renders the real photo; otherwise a
 * neutral branded placeholder stands in and `label` describes the shot we
 * recommend for that slot.
 */
export function MediaPlaceholder({
  label,
  kind = "image",
  className,
  aspect = "aspect-[4/3]",
  src,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  label: string;
  kind?: "image" | "video";
  className?: string;
  aspect?: string;
  src?: string | undefined;
  /** Set on the first above-the-fold image of a page so it loads eagerly. */
  priority?: boolean;
  sizes?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-navy", aspect, className)}>
        <img
          src={src}
          alt={label}
          loading={priority ? "eager" : "lazy"}
          {...(priority ? { fetchPriority: "high" as const } : {})}
          decoding="async"
          sizes={sizes}
          width={1600}
          height={1200}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-navy",
        aspect,
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--color-gold) 0 1px, transparent 1px 14px)",
        }}
      />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center">
        {kind === "video" ? (
          <Play className="size-5 text-gold" aria-hidden />
        ) : (
          <Camera className="size-5 text-gold" aria-hidden />
        )}
        <span className="text-[0.65rem] uppercase tracking-[0.22em] text-cream/70">{label}</span>
      </div>
    </div>
  );
}
