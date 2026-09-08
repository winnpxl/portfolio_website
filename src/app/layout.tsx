import type { Metadata } from "next";
import { DM_Serif_Display, Nunito_Sans } from "next/font/google";

import "./globals.css";

/**
 * new-kansas is licensed; DESIGN.md names DM Serif Display as the
 * substitute. It ships a single 400 weight, which suits a system whose
 * display face is deliberately never bolded.
 */
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif",
  display: "swap",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
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
    <html lang="en" className={`${dmSerif.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
