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
  headline: "Seven years turning unformed briefs into shipped products.",
  capabilities: [
    { label: "0 → 1 product design" },
    { label: "Design systems" },
    { label: "React & Next.js front end" },
  ],
  lead: "I design complex, trust-dependent products across marketplaces, fintech and consumer mobile, and I build the front end that ships them. Onboarding, identity verification, matching, escrow, messaging, trust and safety. Mobile-first, specified so engineers never have to guess.",
} as const;

export const stats = [
  { value: "7+", label: "years across UI/UX, product strategy and front end" },
  { value: "3", label: "design teams led and mentored" },
  { value: "4", label: "countries of distributed teams: NG, UK, PT, US" },
  {
    value: "0→1",
    label: "founding designer on three early-stage products",
  },
];

export const featuredWork = {
  slug: "runbeta",
  href: "/work/runbeta",
  title: "RunBeta",
  pills: [
    { label: "Featured case study" },
    { label: "Founding Product Designer · 2026" },
  ],
  summary:
    "An on-demand services marketplace for Lagos. Two apps, escrow-held payments, and a PIN handshake that confirms who turned up and that the job is done before money moves.",
  bullets: [
    "Provider home restructured from 17 undifferentiated rows into 9 grouped entries with live state",
    "Found a 0 km default service radius silently blocking every booking",
    "Dark-mode mobile design system and a navigable multi-screen prototype",
  ],
  cta: "Read the case study →",
  image: {
    alt: "RunBeta hero shot",
    placeholder: "Drop a RunBeta screen or hero shot",
  } satisfies ImageSlot,
};

export const work = [
  {
    slug: "visio",
    title: "Visio",
    pill: "Lead Product Designer · 2026",
    summary:
      "A managed talent marketplace connecting vetted Nigerian professionals with clients in Nigeria, the UK and the US. Brief to full design specification.",
    bullets: [
      "Owned the brand and design language: colour, three-tier type, 8pt grid, motion, voice",
      "Four surfaces mapped: public site, talent portal, client portal, admin",
    ],
    status: "Case study in progress",
    image: { alt: "Visio screen", placeholder: "Drop a Visio screen" },
  },
  {
    slug: "governance-clout",
    title: "Governance Clout",
    pill: "Founding Product Designer · 2025",
    summary:
      "A governance platform connecting citizens with their elected representatives, on mobile and web. Unformed brief to shipped product.",
    bullets: [
      "Led a team of 3 designers; set the pattern library and delivery plan",
      "Original research from raw public data in a category with no design precedent",
    ],
    status: "Case study in progress",
    image: { alt: "Governance Clout screen", placeholder: "Drop a GClout screen" },
  },
  {
    slug: "penaid",
    title: "Penaid SLA & PLA",
    pill: "UI/UX Designer · 2024",
    summary:
      "Loan disbursement and collection for underserved borrowers, including student and pensioner loan products.",
    bullets: [
      "Desktop-first screens converted to mobile-first without losing parity",
      "Usability testing with users of low digital-financial literacy",
    ],
    status: "Case study in progress",
    image: { alt: "Penaid screen", placeholder: "Drop a Penaid screen" },
  },
  {
    slug: "paying-friends",
    title: "Paying Friends",
    pill: "UI/UX Designer · 2023",
    summary:
      "A full revamp of a European peer-to-peer product rental marketplace, modernising an outdated platform from Lisbon.",
    bullets: [
      "Directed the design team through the rebuild",
      "Wrote and tested UX copy that lifted conversion and engagement",
    ],
    status: "Case study in progress",
    image: {
      alt: "Paying Friends screen",
      placeholder: "Drop a Paying Friends screen",
    },
  },
] satisfies Array<{
  slug: string;
  title: string;
  pill: string;
  summary: string;
  bullets: string[];
  status: string;
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
      body: "Interviews, public data, competitor teardowns; then information architecture and journeys per user type.",
    },
    {
      number: "03",
      title: "Design the system",
      body: "Mobile-first flows on a documented component library, not one-off screens.",
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
  paragraphs: [
    "I am a product designer and design engineer with seven years across UI/UX, product strategy and front-end development, specialising in taking early-stage products from 0 to 1.",
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
