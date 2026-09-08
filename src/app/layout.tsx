import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

/**
 * PP Palma — display face. Weights are declared as ranges so the utility
 * classes map onto the three cuts we ship: font-normal and font-medium
 * both resolve to Medium, which is the editorial weight this system
 * wants, and nothing accidentally lands on Heavy.
 */
const palma = localFont({
  src: [
    { path: "../fonts/PPPalma-Light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/PPPalma-Medium.woff2", weight: "400 500", style: "normal" },
    { path: "../fonts/PPPalma-Heavy.woff2", weight: "600 900", style: "normal" },
  ],
  variable: "--font-palma",
  display: "swap",
});

/**
 * PP Mori — UI and body face. Semibold covers 600 and 700 so that
 * font-bold does not fall through to a heavier cut than intended;
 * font-medium (500) resolves down to Regular.
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
    <html lang="en" className={`${palma.variable} ${mori.variable}`}>
      <body>{children}</body>
    </html>
  );
}
