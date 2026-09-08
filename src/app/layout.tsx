import type { Metadata } from "next";
import { Baloo_2, Work_Sans } from "next/font/google";

import "./globals.css";

// Self-hosted at build time by next/font, as the README asks for.
const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-work-sans",
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
    <html lang="en" className={`${baloo.variable} ${workSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
