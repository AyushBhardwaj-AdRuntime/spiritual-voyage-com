# Sacred Path Navigator

Premium Umrah & Ziyarah travel website

This repository contains a frontend built with TanStack Start and a backend built with Node, Express, and MongoDB.

PROJECT OVERVIEW

Build a premium, emotionally immersive website for a travel company that takes people on guided tours/Umrah packages to Makkah and Madinah. The audience is global and mixed (South Asian, Arab, Western Muslim converts, everyone) — copy should be warm, respectful, and universally welcoming, not region-specific slang.

The site should NOT feel like a typical travel-agency booking site (loud yellow CTAs, countdown timers, cluttered banners). It should feel like a premium spiritual experience brand — closer to a high-end hospitality or documentary film site than a discount travel site. Think calm confidence, not hard-sell urgency.

BRAND & VISUAL SYSTEM

Logo: I will upload a JPG logo — place it top-left in the nav, and use a simplified/icon version as a favicon and in the page loader.

Color palette: deep navy/charcoal (#0F1B2B or similar) and warm off-white/cream (#F7F3EC) as base, with a muted gold/sand accent (#C9A15C or similar) used sparingly for highlights, buttons, and dividers. Avoid bright/loud colors entirely.

Typography: an elegant serif (like Playfair Display or Cormorant) for headlines to convey dignity and timelessness, paired with a clean modern sans-serif (like Inter or Manrope) for body text and UI elements.

Overall mood: reverent, cinematic, spacious. Generous whitespace/negative space. Slow, deliberate animations — never bouncy, playful, or "techy."

GLOBAL ELEMENTS (apply site-wide)

Page loader: on first load, show a minimal elegant loader — logo icon fading in/out or a thin gold line drawing itself, on a navy background, for 1.5–2.5 seconds before revealing the page with a smooth fade/slide transition. Should feel premium, not like a spinner.

Background video hero: on the homepage, use a full-viewport looping background video (I'll provide the video file) of the Kaaba/Haram, muted and autoplaying, with a subtle dark gradient overlay so text stays readable. Include a small mute/unmute icon. On mobile, fall back to a static hero image (video backgrounds are heavy on mobile).

Scroll storytelling / pinned sections: on the homepage "Experience" section, implement a scroll-pinned sequence — the section stays fixed/pinned in the viewport while a sequence of photos/video clips cross-fades or transitions as the user scrolls, each paired with a short caption that fades in. (Similar to Apple product pages or Awwwards-style storytelling sites.) Use scroll-triggered fade/slide-up animations throughout the rest of the site as well — content should gently reveal as it enters the viewport, not just appear statically.

Navigation: fixed/sticky, transparent over the hero video, transitioning to solid navy or cream background on scroll. Logo left, nav links center or right: Home, Packages, Gallery, Why Choose Us, Enquiry/Contact. Include a subtle gold "Book Now" button on the right.

Footer: dark navy background, logo, short mission line, quick links, contact info, social icons, WhatsApp contact button (important for this audience), and a newsletter/enquiry mini-form.

Micro-interactions: buttons with subtle hover states (gentle scale or underline animation, no jarring color flashes), smooth page transitions between routes, image hover zooms on gallery/package cards.

PAGES

1. Home

Full-screen video hero with a short emotional headline (not a sales headline) + one-line subtext + a soft CTA ("Begin Your Journey") that scrolls to the next section.

"The Promise" section — 2–3 short lines about why this journey matters, addressed warmly to a global audience.

Pinned scroll storytelling section using real photos/video clips (Kaaba, Rawdah, Madinah streets, sunset, crowds in prayer) with short captions.

"Why Choose Us" preview — 3–4 short trust points with icons (Years of experience, Licensed & certified, Pilgrims served, Dedicated support) linking to the full Why Choose Us page.

Featured Packages preview — 3 package cards (image, name, short description, starting price, "View Details" button) linking to Packages page.

Testimonials section — carousel of quotes with names/photos (placeholder content for now).

Gallery preview strip — a horizontal scroll or grid of 6–8 images linking to full Gallery page.

Final CTA section before footer — reassuring closing line + "Explore Packages" button.

2. Packages (listing page)

Grid of package cards: image, name (e.g. "Essential Umrah," "Comfort Package," "Premium Family Package"), short description, key highlights (duration, hotel proximity, group size), starting price, "View Details" button.

Optional filter/sort bar (by duration, price range, package type) — can be simple dropdowns for now, no functionality needed yet.

3. Package Detail (dynamic page per package)

Hero image/banner of that package.

Full description written like a short story of the experience, not just bullet specs.

Itinerary/day-by-day breakdown (accordion or timeline component).

What's included / not included (two-column checklist).

Photo gallery specific to this package.

Pricing box (sticky on scroll on desktop) with a prominent "Book This Package" button — link to a Booking page (payment integration comes later on backend).

FAQ accordion specific to this package (visa, what to bring, etc.)

4. Gallery

Masonry or grid layout mixing photos and video thumbnails from Makkah and Madinah.

Clicking an item opens a lightbox/modal with larger view and video playback.

Optional category tabs: Makkah, Madinah, Our Groups, Hotels.

5. Why Choose Us / About

Our story — short narrative about the company's mission and experience.

Trust indicators — years active, number of pilgrims served, licenses/certifications (placeholder badges), partner hotels/airlines logos row.

Team or guide introduction (optional, can be placeholder).

Real testimonial highlights (video testimonial placeholders + text quotes).

6. Enquiry / Contact

Clean form: Name, Email, Phone/WhatsApp, Country, Preferred Package (dropdown), Message.

Contact info block: email, phone, WhatsApp button, office address, response-time promise ("We reply within 24 hours").

Optionally embed a map placeholder.

Warm, reassuring copy — this page should feel like "someone real will respond," reducing hesitation before booking.

7. Booking (stub for now)

Simple placeholder flow: package summary → traveler details form → "Continue to Payment" button (payment logic will be wired up separately on the backend later — just build the UI/flow for now with a placeholder final screen).

TECHNICAL NOTES

Fully responsive — mobile is likely a huge share of traffic (people researching Umrah on their phones).

Lazy-load images and videos below the fold for performance.

Keep all animation libraries lightweight (Framer Motion is fine).

Use placeholder images/videos with clear labeled comments where I'll swap in my real assets and logo.

Accessible: proper alt text placeholders, sufficient color contrast despite the dark palette, keyboard-navigable nav and forms.

TONE OF ALL COPY

Warm, sincere, welcoming to a global audience, dignified — never pushy, never using artificial urgency ("only 2 seats left!"). Confidence comes from trust signals and storytelling, not pressure tactics.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4171f7fd-dace-43b5-95ea-da5cc1ac1a74).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
