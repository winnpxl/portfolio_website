import type { Metadata } from "next";
import localFont from "next/font/local";

import { SoundProvider } from "@/components/sound";

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

export const metadata: Metadata = {
  title: "Samuel Winner, Design Engineer",
  description:
    "Product designer and design engineer with seven years across UI/UX, product strategy and front end. Marketplaces, fintech and consumer mobile, from 0 to 1.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={mori.variable}>
      <body>
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  );
}
