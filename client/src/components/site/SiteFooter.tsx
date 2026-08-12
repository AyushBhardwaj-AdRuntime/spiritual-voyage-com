import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import logoAsset from "@/assets/logo.png";
import { TrustBadges } from "@/components/site/TrustBadges";
import { legalLinks, navLinks, site } from "@/data/site";


export function SiteFooter() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-navy text-cream">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-4 lg:px-10">
        <div className="lg:col-span-1">
          <img
            src={logoAsset}
            alt={`${site.name} logo`}
            className="h-28 w-auto object-contain"
          />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/70">{site.mission}</p>
          <div className="mt-8 flex items-center gap-4">
            {[
              { Icon: Instagram, label: "Instagram" },
              { Icon: Facebook, label: "Facebook" },
              { Icon: Youtube, label: "YouTube" },
            ].map(({ Icon, label }) => (
              /* REPLACE: point these at your real social profiles */
              <a
                key={label}
                href="#"
                aria-label={label}
                className="inline-flex size-9 items-center justify-center border border-cream/20 text-cream/70 transition-colors hover:border-gold hover:text-gold"
              >
                <Icon className="size-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[0.65rem] tracking-[0.24em] text-gold uppercase">Explore</h2>
          <ul className="mt-6 space-y-3 text-sm text-cream/75">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="link-quiet transition-colors hover:text-cream">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/custom-package" className="link-quiet transition-colors hover:text-cream">
                Custom &amp; Group
              </Link>
            </li>
            <li>
              <Link to="/faq" className="link-quiet transition-colors hover:text-cream">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/guides" className="link-quiet transition-colors hover:text-cream">
                Guides
              </Link>
            </li>

            <li>
              <Link to="/booking" className="link-quiet transition-colors hover:text-cream">
                Booking
              </Link>
            </li>
          </ul>

          <h2 className="mt-10 text-[0.65rem] tracking-[0.24em] text-gold uppercase">Legal</h2>
          <ul className="mt-6 space-y-3 text-sm text-cream/75">
            {legalLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="link-quiet transition-colors hover:text-cream">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>


        <div>
          <h2 className="text-[0.65rem] tracking-[0.24em] text-gold uppercase">Reach us</h2>
          <ul className="mt-6 space-y-4 text-sm text-cream/75">
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <a href={`mailto:${site.email}`} className="link-quiet break-all">
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <a href={site.phoneHref} className="link-quiet">
                {site.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <span>{site.address}</span>
            </li>
          </ul>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="btn-quiet mt-8 w-full text-cream"
          >
            <MessageCircle className="size-4" aria-hidden />
            WhatsApp us
          </a>
        </div>

        <div>
          <h2 className="text-[0.65rem] tracking-[0.24em] text-gold uppercase">
            Journey updates
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-cream/70">
            Occasional notes on upcoming group departures and travel guidance. No noise.
          </p>
          <form
            className="mt-6 flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              toast.success("Thank you — we'll be in touch with our next departures.");
              setEmail("");
            }}
          >
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="h-11 border border-cream/25 bg-transparent px-4 text-sm text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
            />
            <button type="submit" className="btn-quiet text-cream">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <TrustBadges tone="dark" />
      </div>


      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-[0.7rem] text-cream/50 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p>Umrah &amp; Ziyarah journeys to Makkah and Madinah.</p>
        </div>
      </div>
    </footer>
  );
}
