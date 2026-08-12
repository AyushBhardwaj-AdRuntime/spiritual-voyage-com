# SafarXGlobal — Umrah & Ziyarah Website

A premium, cinematic multi-page site for **SafarXGlobal** (AL HASAN TRAVEL & TOURS): reverent, spacious, calm — no hard-sell travel-agency patterns.

## Brand system

- Palette: deep navy `#0F1B2B`, cream `#F7F3EC`, muted gold `#C9A15C` (used sparingly). No bright colors.
- Type: Cormorant Garamond (headlines, serif) + Manrope (body/UI), loaded via a font `<link>` in the root route.
- Motion: slow, deliberate fades and slide-ups. Generous whitespace.
- Contact used site-wide: info@safarxglobal.com · 098457 91555 (also WhatsApp) · 145, Mosque Rd, Fraser Town, Bengaluru, Karnataka 560005.

## Global elements

- **Page loader**: navy screen, thin gold line drawing itself + wordmark fade, ~2s on first load only, then fade-reveal.
- **Nav**: sticky, transparent over the hero, becomes solid navy on scroll. Logo slot top-left (labeled placeholder for your JPG), links Home / Packages / Gallery / Why Choose Us / Contact, gold outline "Book Now". Mobile: full-screen navy drawer, keyboard accessible.
- **Footer**: navy, wordmark + mission line, quick links, contact block, socials, WhatsApp button, mini enquiry form.
- **Reveal-on-scroll** wrapper used across all pages; hover states are gentle (underline slide, slow image zoom).
- **Placeholders**: neutral navy/gold blocks with `{/* REPLACE: ... */}` comments at every image, video, logo, badge and testimonial photo slot.

## Pages

1. **Home** — full-viewport hero with looping background-video slot (muted, gradient overlay, mute toggle; static block on mobile), emotional headline + "Begin Your Journey" scroll CTA · The Promise · pinned scroll-storytelling sequence (sticky section, cross-fading frames with captions) · Why Choose Us preview (4 trust points) · 3 featured package cards · testimonial carousel · gallery strip · closing CTA.
2. **Packages** — card grid with duration / hotel proximity / group size highlights, starting price, non-functional filter+sort bar.
3. **Package detail** (`/packages/$slug`) — banner, story-style description, day-by-day timeline accordion, included/not-included columns, package gallery, sticky pricing box with "Book This Package", package FAQ accordion.
4. **Gallery** — masonry grid of photo + video tiles, category tabs (Makkah, Madinah, Our Groups, Hotels), lightbox modal with video playback.
5. **Why Choose Us** — story, trust stats, license/partner badge rows, guides, video + text testimonials.
6. **Contact** — enquiry form (name, email, phone/WhatsApp, country, preferred package, message) with validation and success toast, contact block, 24-hour response promise, map placeholder.
7. **Booking** (`/booking`) — package summary → traveler details form → "Continue to Payment" → placeholder confirmation screen. No payment logic.

Three packages are defined in one shared data file (Essential Umrah, Comfort, Premium Family) so cards, detail pages, dropdowns and booking stay in sync.

## Technical notes

- TanStack Router file routes; each page gets its own `head()` with unique title/description/OG tags.
- Tokens added to `src/styles.css` (`@theme inline`) — no hardcoded color classes in components.
- Animations via CSS/IntersectionObserver plus the existing Embla carousel and Radix accordion/dialog/tabs; a lightweight motion library only if needed.
- Lazy-loaded media below the fold, alt-text placeholders, contrast-checked navy/cream/gold pairings, keyboard-navigable nav, lightbox and forms.
- Forms are front-end only for now (no backend); wiring submissions to email/database can come later.
