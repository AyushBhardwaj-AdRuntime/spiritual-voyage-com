import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { PageLoader } from "../components/site/PageLoader";
import { SiteFooter } from "../components/site/SiteFooter";
import { SiteNav } from "../components/site/SiteNav";
import { Toaster } from "../components/ui/sonner";
import { site } from "../data/site";
import appCss from "../styles.css?url";
import { CurrencyProvider } from "../lib/currency";
import { ThemeProvider } from "../lib/theme";
import { WhatsAppFab } from "../components/site/WhatsAppFab";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4 text-cream">
      <div className="max-w-md text-center">
        <p className="eyebrow">Page not found</p>
        <h1 className="mt-6 font-serif text-4xl">This path has moved</h1>
        <p className="mt-4 text-sm text-cream/70">
          The page you're looking for isn't here. Let us take you back to the beginning.
        </p>
        <div className="mt-10">
          <Link to="/" className="btn-gold">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4 text-cream">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl">This page didn't load</h1>
        <p className="mt-4 text-sm text-cream/70">
          Something went wrong on our end. Please try again, or head back home.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-gold"
          >
            Try again
          </button>
          <a href="/" className="btn-quiet text-cream">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${site.name} — Guided Umrah & Ziyarah Journeys` },
      { name: "description", content: site.mission },
      { name: "author", content: site.legalName },
      { property: "og:site_name", content: site.name },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0F1B2B" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],

    scripts: [
      /**
       * Plausible analytics. Set VITE_PLAUSIBLE_DOMAIN to your live domain
       * (e.g. safarxglobal.com) and the script loads automatically.
       */
      ...(import.meta.env['VITE_PLAUSIBLE_DOMAIN']
        ? [
            {
              src: "https://plausible.io/js/script.js",
              defer: true,
              "data-domain": import.meta.env['VITE_PLAUSIBLE_DOMAIN'] as string,
            },
          ]
        : []),
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          name: site.name,
          legalName: site.legalName,
          email: site.email,
          telephone: site.phone,
              sameAs: [site.instagram],
          address: {
            "@type": "PostalAddress",
            streetAddress: "145, Mosque Rd, Fraser Town",
            addressLocality: "Bengaluru",
            addressRegion: "Karnataka",
            postalCode: "560005",
            addressCountry: "IN",
          },
        }),
      },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <CurrencyProvider>
        <PageLoader />
        <SiteNav />
        <main id="main">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
        <WhatsAppFab />
        <Toaster />
      </CurrencyProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

