import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SiteLoader } from "@/components/layout/SiteLoader";
import { profile, toolkit } from "@/data/profile";
import { configuredSocials } from "@/data/social";
import { getSiteUrl, hasCanonicalDomain } from "@/lib/site-url";

// Self-hosted (SIL Open Font License) — no build-time network dependency.
// Same families as the reference site: Orbitron (display) + Space Grotesk (body) + Crimson Pro (serif accent).
const orbitron = localFont({
  src: "./fonts/orbitron-var.woff2",
  variable: "--font-orbitron",
  weight: "400 900",
  display: "swap",
});
const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk-var.woff2",
  variable: "--font-space-grotesk",
  weight: "300 700",
  display: "swap",
});
const crimson = localFont({
  src: "./fonts/crimson-pro-italic.woff2",
  variable: "--font-crimson",
  weight: "400",
  style: "italic",
  display: "swap",
  preload: false,
});
const jetbrains = localFont({
  src: "./fonts/jetbrains-mono-var.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
  preload: false,
});

const siteUrl = getSiteUrl();
const title = "Gerald Baldoza | Game Developer — Unity, Unreal Engine & Three.js";
const description =
  "Explore the game development portfolio of Gerald Baldoza, featuring Unity, Unreal Engine, Three.js, 2D/3D games, multiplayer systems, and interactive experiences.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Gerald Baldoza" },
  description,
  applicationName: "Gerald Baldoza — Portfolio",
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: [
    "game developer",
    "Unity developer",
    "Unreal Engine developer",
    "Three.js developer",
    "WebGL",
    "2D games",
    "3D games",
    "multiplayer",
    "mobile games",
    "Gerald Baldoza",
  ],
  alternates: hasCanonicalDomain ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Gerald Baldoza — Game Developer",
    title,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0b12",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before paint: enables the "hidden until revealed" state only when JS
 * runs and the user hasn't asked for reduced motion. A watchdog removes it if
 * the motion system fails to start, so content can never stay invisible.
 */
const motionBoot = `(function(){try{var d=document.documentElement;d.classList.add('js');if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js-motion');setTimeout(function(){if(!d.dataset.motionReady){d.classList.remove('js-motion')}},4000);setTimeout(function(){d.querySelectorAll('[data-hero-intro]').forEach(function(e){if(getComputedStyle(e).opacity==='0'&&!e.style.opacity){e.style.opacity='1'}})},15000)}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const sameAs = configuredSocials().map((s) => s.href);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: "Game Developer",
    description: profile.identity,
    url: siteUrl,
    knowsAbout: Array.from(new Set(toolkit.flatMap((g) => g.items))),
    ...(sameAs.length ? { sameAs } : {}),
  };

  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceGrotesk.variable} ${crimson.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-screen antialiased">
        <MotionProvider>
          <SiteLoader />
          <Navbar />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </MotionProvider>
        <div aria-hidden className="noise pointer-events-none fixed inset-0 z-[60] opacity-[0.025] mix-blend-overlay" />
      </body>
    </html>
  );
}
