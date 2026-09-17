import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import localFont from "next/font/local";

import { RevealObserver } from "@/components/RevealObserver";
import { SoundProvider } from "@/components/sound";
import { Toaster } from "@/components/toast";
import { profile, site } from "@/content/site";

import "./globals.css";

/**
 * PP Mori — the only face. Semibold covers 600 and 700 so that font-bold
 * does not fall through to a heavier cut than intended; font-medium (500)
 * resolves down to Regular, so headings ask for 600 explicitly.
 */
const mori = localFont({
  src: [
    { path: "../fonts/PPMori-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/PPMori-Italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/PPMori-Semibold.woff2", weight: "600 700", style: "normal" },
    {
      path: "../fonts/PPMori-SemiboldItalic.woff2",
      weight: "600 700",
      style: "italic",
    },
  ],
  variable: "--font-mori",
  display: "swap",
});

const description =
  "Product designer and design engineer with 5+ years across UI/UX, product strategy and front end. Marketplaces, fintech and consumer mobile, from 0 to 1.";

export const metadata: Metadata = {
  // Every page's canonical and card links hang off this, so previews and
  // search results name the domain rather than the Vercel URL.
  metadataBase: new URL(site.url),
  title: {
    default: "Samuel Winner, Design Engineer",
    template: "%s",
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: "Samuel Winner, Design Engineer",
    description,
    url: "/",
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={mori.variable}>
      <body>
        <SoundProvider>
          {children}
          <Toaster />
          <RevealObserver />
        </SoundProvider>
        {/* Cookie-free page views, reported only from the deployed site. */}
        <Analytics />
      </body>
    </html>
  );
}
