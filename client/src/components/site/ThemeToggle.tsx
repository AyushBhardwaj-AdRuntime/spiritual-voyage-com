import { Check, Palette } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { themes, useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const notes: Record<string, string> = {
  cream: "Bright, like morning light",
  sand: "Warm, softer on the eyes",
  navy: "Quiet, for reading at night",
};

/** Lets the reader choose the page background tone. Persisted per browser. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const active = themes.find((t) => t.name === theme) ?? themes[0]!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Change background tone"
        className={cn(
          "group inline-flex items-center gap-2 border border-cream/20 px-2.5 py-1.5 text-cream/80 transition-colors hover:border-gold/60 hover:text-cream focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none",
          className,
        )}
      >
        <Palette className="size-3.5 text-gold" aria-hidden />
        <span className="text-[0.62rem] tracking-[0.2em] uppercase">{active.label}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-60 rounded-none border-cream/15 bg-navy p-0 text-cream shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)]"
      >
        <DropdownMenuLabel className="border-b border-cream/10 px-4 py-3 text-[0.6rem] font-normal tracking-[0.24em] text-cream/50 uppercase">
          Reading tone
        </DropdownMenuLabel>

        <div className="p-1.5">
          {themes.map((option) => {
            const isActive = option.name === theme;
            return (
              <DropdownMenuItem
                key={option.name}
                onSelect={() => setTheme(option.name)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-none px-2.5 py-2.5 focus:bg-cream/10 focus:text-cream",
                  isActive && "bg-cream/[0.06]",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-7 shrink-0 rounded-full border",
                    isActive ? "border-gold" : "border-cream/25",
                  )}
                  style={{ backgroundColor: option.swatch }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-base leading-tight">{option.label}</span>
                  <span className="block text-[0.7rem] text-cream/50">{notes[option.name]}</span>
                </span>
                {isActive && <Check className="size-4 shrink-0 text-gold" aria-hidden />}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
