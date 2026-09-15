import type { ImageSlot } from "./site";

export type GalleryTile = {
  id: string;
  /** Frame aspect ratio, matching the prototype tile for tile. */
  ratio: "16/9" | "3/4" | "1/1" | "4/3";
  /** Tiles 1 and 6 run double width on wide viewports. */
  wide?: boolean;
  tone?: "cream" | "butter" | "rose";
  caption: string;
  meta: string;
  image: ImageSlot;
};

export const galleryHeader = {
  pills: [
    { label: "Shots & studies" },
    { label: "Updated as I ship" },
  ],
  title: "Gallery",
  lead: "Screens, components and visual studies from client work and side projects.",
};

export const galleryCta = {
  title: "Want the thinking behind any of these?",
  label: "Read the case studies →",
  href: "/#work",
};

export const tiles: GalleryTile[] = [
  {
    id: "gal-01",
    ratio: "16/9",
    wide: true,
    caption: "Crypto trading dashboard",
    meta: "FiatRouter",
    image: { src: "/images/gallery/1.png", alt: "FiatRouter's crypto dashboard on desktop and mobile, with a $14,890.50 balance, token assets and portfolio performance", placeholder: "Shot 1" },
  },
  {
    id: "gal-02",
    ratio: "3/4",
    caption: "Multi-chain wallet",
    meta: "UI shot",
    image: { src: "/images/gallery/2.png", alt: "A dark crypto wallet showing a $108,927.06 balance with Solana, Ethereum, USDC and TRON tokens", placeholder: "Shot 2" },
  },
  {
    id: "gal-03",
    ratio: "1/1",
    caption: "Email and code verification",
    meta: "UI shot",
    image: { src: "/images/gallery/3.png", alt: "Two sign-up screens: entering an email address and entering a six-digit code, each with an orange Next button", placeholder: "Shot 3" },
  },
  {
    id: "gal-04",
    ratio: "3/4",
    caption: "Token swap sheet",
    meta: "UI shot",
    image: { src: "/images/gallery/4.png", alt: "A swap sheet sending 1 SOL for 283.47 USDC, with price, network fee, price impact and slippage, and a swipe-to-swap button", placeholder: "Shot 4" },
  },
  {
    id: "gal-05",
    ratio: "4/3",
    caption: "Talent application dashboard",
    meta: "Visio",
    image: { src: "/images/gallery/5.png", alt: "Visio's talent dashboard showing an approved and verified application, profile completeness and action items", placeholder: "Shot 5" },
  },
  {
    id: "gal-06",
    ratio: "16/9",
    wide: true,
    caption: "Studio landing page",
    meta: "Nucleus Initiative",
    image: { src: "/images/gallery/6.png", alt: "The Nucleus Initiative landing page, with fanned image cards between the words Speed, Precision and Excellence", placeholder: "Shot 6" },
  },
  {
    id: "gal-07",
    ratio: "1/1",
    caption: "Prototype apps in minutes",
    meta: "Social post",
    image: { src: "/images/gallery/7.png", alt: "A dark illustration of a speedometer beside a wireframe phone, titled Prototype Apps in Minutes", placeholder: "Shot 7" },
  },
  {
    id: "gal-08",
    ratio: "3/4",
    caption: "Multi-currency banking home",
    meta: "UI shot",
    image: { src: "/images/gallery/8.png", alt: "A banking app home with a total balance across Naira and Euro accounts, quick actions and recent transactions", placeholder: "Shot 8" },
  },
  {
    id: "gal-09",
    ratio: "4/3",
    caption: "E-scooter charging and routes",
    meta: "UI shot",
    image: { src: "/images/gallery/9.png", alt: "E-scooter interface cards: trip stats, booking a spot at a charging station, an arrival timeline and a route on a map", placeholder: "Shot 9" },
  },
  {
    id: "gal-10",
    ratio: "1/1",
    caption: "Workforce platform landing page",
    meta: "Sentropy",
    image: { src: "/images/gallery/10.png", alt: "The Sentropy landing page, with a pastel sky and mountain hero above a footer card describing the workforce platform", placeholder: "Shot 10" },
  },
  {
    id: "gal-11",
    ratio: "3/4",
    caption: "Delivery tracking sheet",
    meta: "UI shot",
    image: { src: "/images/gallery/11.png", alt: "A Track your delivery sheet with a shipment number, expected delivery date, and pickup and drop-off addresses", placeholder: "Shot 11" },
  },
  {
    id: "gal-12",
    ratio: "4/3",
    caption: "Medical records dashboard",
    meta: "UI shot",
    image: { src: "/images/gallery/12.png", alt: "A medical records dashboard with patient access stats, department folders and a patient access table", placeholder: "Shot 12" },
  },
];
