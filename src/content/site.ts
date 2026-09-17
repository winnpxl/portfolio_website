/**
 * All home-page and shared content. The prototype repeated every card
 * literally; here each repeated block is an array the page maps over.
 *
 * Copy is taken verbatim from the design reference and was already
 * reviewed. Do not rewrite it. Em dashes are deliberately absent.
 */

export type ImageSlot = {
  /** Path under /public once the real asset exists. */
  src?: string;
  alt: string;
  /** Shown in the empty frame while the asset is missing. */
  placeholder: string;
};

/** Where the site lives, used for canonical links, cards and the sitemap. */
export const site = {
  url: "https://www.canvasofsam.pro",
} as const;

export const profile = {
  name: "Samuel Winner",
  title: "Design Engineer",
  role: "Product designer & design engineer",
  location: "Lagos, Nigeria",
  timeZone: "Africa/Lagos",
  footer: "Samuel Winner · Product designer & design engineer · Lagos, Nigeria",
  copyright: "© 2026",
} as const;

export const hero = {
  pills: [
    { label: "Samuel Winner, Design Engineer" },
    { label: "Lagos, Nigeria · remote" },
  ],
  headline: "5+ years turning unformed briefs into shipped products.",
  lead: "I simplify complex, trust-dependent products across marketplaces, fintech and consumer mobile, while building the frontend that ships them. I build sites that convert, and mobile apps users can come back to on a daily basis.",
} as const;

export const stats = [
  { value: "7+", label: "years in the design industry" },
  { value: "3", label: "design teams led and mentored" },
  { value: "4", label: "countries of distributed teams: NG, UK, PT, US" },
  {
    value: "0→1",
    label: "founding designer on three early-stage products",
  },
];

/**
 * Every project on the work grid, in display order. A tile shows only the
 * title, the year and the one-line tagline; role, summary and bullets are
 * the fuller record that case study pages draw on. A project with an
 * `href` has a case study, and its tile links there.
 */
export const work = [
  {
    // Jaye everywhere on the site; GoJaye, the official name, only on its thumbnail.
    slug: "gojaye",
    title: "Jaye",
    cardTitle: "GoJaye",
    href: "/work/gojaye",
    role: "Senior Product Designer · Sole Designer",
    year: "2026",
    tagline:
      "A mobility platform designed to make moving around easier for customers while creating a better earning opportunity for drivers.",
    summary:
      "Jaye is a mobility platform designed to make moving around easier for customers while creating a better earning opportunity for drivers.",
    bullets: [],
    image: {
      src: "/images/work/gojaye/thumbnail.png",
      alt: "The Jaye logo above driver, map, wallet and subscription screens",
      placeholder: "Drop a GoJaye screen",
    },
  },
  {
    slug: "runbeta",
    title: "RunBeta",
    href: "/work/runbeta",
    role: "Founding Product Designer",
    year: "2026",
    tagline: "An on-demand services marketplace for Lagos.",
    summary:
      "An on-demand services marketplace for Lagos. Two apps, escrow-held payments, and a PIN handshake that confirms who turned up and that the job is done before money moves.",
    bullets: [
      "Provider home restructured from 17 undifferentiated rows into 9 grouped entries with live state",
      "Found a 0 km default service radius silently blocking every booking",
      "Dark-mode mobile design system and a navigable multi-screen prototype",
    ],
    image: {
      src: "/images/work/runbeta/thumbnail.png",
      alt: "The RunBeta app icon and wordmark on a deep blue background",
      placeholder: "Drop a RunBeta screen or hero shot",
    },
  },
  {
    slug: "governance-clout",
    title: "Governance Clout",
    role: "Founding Product Designer",
    year: "2025",
    tagline:
      "A governance platform connecting citizens with their elected representatives, on mobile and web.",
    summary:
      "A governance platform connecting citizens with their elected representatives, on mobile and web. Unformed brief to shipped product.",
    bullets: [
      "Led a team of 3 designers; set the pattern library and delivery plan",
      "Original research from raw public data in a category with no design precedent",
    ],
    image: {
      src: "/images/work/governance-clout/thumbnail.png",
      alt: "The Governance Clout logo and wordmark on a blue gradient",
      placeholder: "Drop a GClout screen",
    },
  },
  {
    slug: "visio",
    title: "Visio",
    role: "Lead Product Designer",
    year: "2026",
    tagline:
      "A managed talent marketplace connecting vetted Nigerian professionals with clients in Nigeria, the UK and the US.",
    summary:
      "A managed talent marketplace connecting vetted Nigerian professionals with clients in Nigeria, the UK and the US. Brief to full design specification.",
    bullets: [
      "Owned the brand and design language: colour, three-tier type, 8pt grid, motion, voice",
      "Four surfaces mapped: public site, talent portal, client portal, admin",
    ],
    image: {
      src: "/images/work/visio/thumbnail.png",
      alt: "The Visio logo above its talent dashboard, showing an approved and verified application",
      placeholder: "Drop a Visio screen",
    },
  },
  {
    slug: "penaid",
    title: "Penaid SLA & PLA",
    role: "UI/UX Designer",
    year: "2023 – 2025",
    tagline:
      "Loan disbursement and collection for underserved borrowers, including student and pensioner loan products.",
    summary:
      "Loan disbursement and collection for underserved borrowers, including student and pensioner loan products.",
    bullets: [
      "Desktop-first screens converted to mobile-first without losing parity",
      "Usability testing with users of low digital-financial literacy",
    ],
    image: {
      src: "/images/work/penaid/thumbnail.png",
      alt: "The Penaid logo above its loan landing page, with a smiling customer on the phone",
      placeholder: "Drop a Penaid screen",
    },
  },
] satisfies Array<{
  slug: string;
  title: string;
  /** Shown on the thumbnail in place of `title`, where the card needs another name. */
  cardTitle?: string;
  href?: string;
  role: string;
  year: string;
  /** One sentence, shown under the tile. */
  tagline: string;
  summary: string;
  bullets: string[];
  image: ImageSlot;
}>;

export const process = {
  heading: "How I work",
  lead: "Five moves, in order. Most of my projects start before there is a PRD, so step one is usually the whole job.",
  steps: [
    {
      number: "01",
      title: "Frame the brief",
      body: "Client calls and stakeholder sessions turned into scope, constraints and a delivery plan.",
    },
    {
      number: "02",
      title: "Research and map",
      body: "Competitor teardowns to see what already works, then information architecture and journeys for each type of user.",
    },
    {
      number: "03",
      title: "Design the system",
      body: "Desktop first, to capture every piece of information and set the visual style, then stripped down for mobile. All on a documented component library, not one-off screens.",
    },
    {
      number: "04",
      title: "Specify for engineering",
      body: "States, permission matrices, notification triggers, per-screen data needs, edge cases.",
    },
    {
      number: "05",
      title: "QA the build",
      body: "Implementation review, user tests during build, changes driven back into the PRD.",
    },
  ],
};

export const about = {
  heading: "About",
  /** The big name at the top of /about. */
  title: "Samuel",
  /** Two short lines under the title: where, then what. */
  intro: [
    "Based in Lagos, working with distributed teams across Nigeria, the UK, Portugal and the US.",
    "I simplify complex, trust-dependent products across marketplaces, fintech and consumer mobile.",
  ],
  /** Large photos on /about. */
  photos: {
    feature: {
      src: "/images/my_photo.JPG",
      alt: "Samuel Winner in sunglasses, in front of a pink and orange wall",
      placeholder: "Photo coming soon",
    },
    wide: {
      src: "/images/wide_photo.jpg",
      alt: "A laptop showing app screens on a desk at night, beside a plant and a keyboard",
      placeholder: "Photo coming soon",
    },
  } satisfies Record<string, ImageSlot>,
  services: [
    "Product design",
    "UX research",
    "Information architecture",
    "Interaction design",
    "Design systems",
    "Front-end development",
  ],
  industries: ["Marketplaces", "Fintech", "Mobility", "Civic tech", "Consumer mobile"],
  paragraphs: [
    "I am a product designer and design engineer with 5+ years across UI/UX, product strategy and front-end development, specialising in taking early-stage products from 0 to 1.",
    "I have led design on two-sided marketplaces, fintech platforms and consumer mobile apps, owning research, information architecture, user journeys, interaction design and the design systems that hold them together. The work I like most sits in complex, trust-dependent workflows: verification, matching, escrow, messaging, trust and safety.",
    "I build front end in React and Next.js, which means my handoffs are written in terms engineers can implement without guesswork. Mathematics degree from the University of Ilorin. Based in Lagos, working with distributed teams across Nigeria, the UK, Portugal and the US.",
  ],
  portrait: {
    src: "/images/my-portrait.jpg",
    alt: "Samuel Winner",
    placeholder: "Drop a portrait",
  } satisfies ImageSlot,
  toolkit: [
    "Figma",
    "FigJam",
    "React",
    "Next.js",
    "React Native",
    "Framer",
    "Webflow",
    "Bubble.io",
    "Maze",
    "Miro",
    "Whimsical",
    "Jira",
    "Git",
  ],
};

export const sideProjects = [
  {
    pill: "No-code components · 2025",
    title: "Framer Marketplace",
    body: "PuzzleFX and Mahjong Preloader: distributed components published for other designers to drop into Framer sites.",
  },
  {
    pill: "Open source",
    title: "Stellar / Soroban",
    body: "Contributor through the Stellar Wave Program: Talenttrust contracts and backend, StellarSplit, mobile-money, ancore. Feature branches, CI fixes, code review.",
    link: { label: "github.com/winnpxl", href: "https://github.com/winnpxl" },
  },
  {
    pill: "Earlier explorations",
    title: "Banking studies",
    body: "Excellent Bank mobile app and a UBA remodel. Self-directed UX problem-solving on financial accessibility for underserved users.",
  },
];

export const galleryBanner = {
  eyebrow: "Gallery",
  title: "Screens, components and visual studies",
  cta: "Open the gallery →",
};

/**
 * Writing and testimonials render only when there is something to show.
 * Empty arrays drop the section, which replaces the prototype's
 * showWriting / showTestimonials booleans.
 */
export const writing: Array<{ title: string; blurb: string; href: string }> = [];

export const testimonials: Array<{
  quote: string;
  attribution: string;
}> = [];

export const contact = {
  badge: "Available now",
  headline: "Let's build the version that actually ships.",
  availabilityNote:
    "Open to senior and staff product design or design engineering roles, full-time or contract. Fastest reply by email; I usually answer within a day.",
  tiles: [
    {
      label: "Email",
      value: "samwinner08@gmail.com",
      href: "mailto:samwinner08@gmail.com",
    },
    { label: "Phone", value: "+234 814 795 6593", href: "tel:+2348147956593" },
    { label: "GitHub", value: "winnpxl", href: "https://github.com/winnpxl" },
    {
      label: "LinkedIn",
      value: "samwinner",
      href: "https://www.linkedin.com/in/samwinner/",
    },
  ],
};
