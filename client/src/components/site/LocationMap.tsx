import { ExternalLink, MapPin, Navigation } from "lucide-react";

import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const query = encodeURIComponent(site.address);
const embedSrc = `https://www.google.com/maps?q=${query}&z=16&output=embed`;
const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
const viewHref = `https://www.google.com/maps/search/?api=1&query=${query}`;

/** Office location map with directions links. */
export function LocationMap({
  className,
  aspect = "aspect-[4/3]",
}: {
  className?: string;
  aspect?: string;
}) {
  return (
    <div className={cn("border border-border bg-card", className)}>
      <div className={cn("w-full overflow-hidden", aspect)}>
        <iframe
          title={`Map showing ${site.name} office at ${site.address}`}
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0 grayscale-[35%]"
        />
      </div>
      <div className="p-5">
        <p className="flex gap-3 text-sm leading-relaxed">
          <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
          <span>{site.address}</span>
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={directionsHref} target="_blank" rel="noreferrer" className="btn-gold">
            <Navigation className="size-4" aria-hidden />
            Get directions
          </a>
          <a href={viewHref} target="_blank" rel="noreferrer" className="btn-quiet">
            <ExternalLink className="size-4" aria-hidden />
            Open in Maps
          </a>
        </div>
      </div>
    </div>
  );
}
