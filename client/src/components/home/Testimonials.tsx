import { Quote } from "lucide-react";

import { MediaPlaceholder } from "@/components/site/MediaPlaceholder";
import { Reveal } from "@/components/site/Reveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

/* REPLACE: placeholder testimonials — swap for your own with real photos */
const testimonials = [
  {
    quote:
      "I travelled with my mother, who uses a wheelchair. Not once did we feel like a complication. Someone was always a step ahead of us.",
    name: "Aisha R.",
    place: "London, United Kingdom",
  },
  {
    quote:
      "As a convert travelling alone, I was nervous about doing something wrong. My guide explained everything quietly, without ever making me feel new.",
    name: "Daniel H.",
    place: "Toronto, Canada",
  },
  {
    quote:
      "The hotel was genuinely where they said it was — two minutes from the gate. After ten days of five prayers, that mattered more than I expected.",
    name: "Mohammed F.",
    place: "Hyderabad, India",
  },
  {
    quote:
      "They answered my questions for four months before I booked anything. No pressure, not once. That is why I trusted them with my family.",
    name: "Fatima A.",
    place: "Dubai, UAE",
  },
];

export function Testimonials() {
  return (
    <section className="bg-background py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">In their words</p>
          <h2 className="mt-6 text-3xl sm:text-4xl">Pilgrims who travelled with us</h2>
        </Reveal>

        <Reveal className="mt-14">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent>
              {testimonials.map((t) => (
                <CarouselItem key={t.name} className="md:basis-1/2 lg:basis-1/3">
                  <figure className="flex h-full flex-col border border-border bg-card p-9">
                    <Quote className="size-5 text-gold" aria-hidden />
                    <blockquote className="mt-6 flex-1 font-serif text-xl leading-[1.45]">
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-8 flex items-center gap-4">
                      {/* REPLACE: pilgrim photo */}
                      <MediaPlaceholder
                        label="Photo"
                        aspect="aspect-square"
                        className="size-12 shrink-0 rounded-full"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm text-foreground">{t.name}</span>
                        <span className="block text-xs text-muted-foreground">{t.place}</span>
                      </span>
                    </figcaption>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-10 flex gap-3">
              <CarouselPrevious className="static translate-y-0 rounded-none border-border" />
              <CarouselNext className="static translate-y-0 rounded-none border-border" />
            </div>
          </Carousel>
        </Reveal>
      </div>
    </section>
  );
}
