import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Instagram } from "lucide-react";
import { useEffect, useState } from "react";

import logoAsset from "@/assets/logo.png";
import { CurrencyToggle } from "@/components/site/CurrencyToggle";
import { ThemeToggle } from "@/components/site/ThemeToggle";

import { navLinks, site } from "@/data/site";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = scrolled || !overHero;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-700",
        solid ? "border-b border-cream/10 bg-navy/95 backdrop-blur-sm" : "bg-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 lg:px-10"
      >
        <Link to="/" className="flex min-w-0 items-center">
          <img
            src={logoAsset}
            alt={`${site.name} logo`}
            className="h-14 w-auto object-contain"
          />
        </Link>

        <ul className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                className="link-quiet text-[0.7rem] tracking-[0.2em] text-cream/80 uppercase transition-colors hover:text-cream"
                activeProps={{ className: "text-gold" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-3">
          <ThemeToggle className="hidden md:flex" />
          <CurrencyToggle className="hidden sm:flex" />
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="inline-flex size-9 items-center justify-center border border-cream/20 text-cream/70 transition-colors hover:border-gold hover:text-gold"
          >
            <Instagram className="size-4" aria-hidden />
          </a>
          <Link to="/booking" className="btn-gold hidden lg:inline-flex">
            Book Now
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center border border-cream/25 text-cream lg:hidden"
          >
            {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-nav" className="fixed inset-0 z-60 flex flex-col bg-navy px-6 pt-6 lg:hidden">
          <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={logoAsset}
              alt={`${site.name} logo`}
              className="h-12 w-auto object-contain"
            />
          </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex size-10 items-center justify-center border border-cream/25 text-cream"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <ul className="mt-16 flex flex-col gap-8">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  className="font-serif text-3xl text-cream"
                  activeProps={{ className: "text-gold" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/booking" className="btn-gold mt-12 w-full">
            Book Now
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex size-9 items-center justify-center border border-cream/20 text-cream/70 transition-colors hover:border-gold hover:text-gold"
            >
              <Instagram className="size-4" aria-hidden />
            </a>
            <CurrencyToggle className="sm:hidden" />
            <ThemeToggle className="md:hidden" />
          </div>
          <div className="mt-6 flex items-center gap-3">
            <CurrencyToggle className="sm:hidden" />
            <ThemeToggle className="md:hidden" />
          </div>

        </div>
      )}
    </header>
  );
}
