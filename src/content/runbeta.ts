import type { ImageSlot } from "./site";

/** RunBeta case study. Copy verbatim from the design reference. */
export const runbeta = {
  slug: "runbeta",
  navLabel: "RunBeta",

  hero: {
    pills: [
      { label: "Founding Product Designer" },
      { label: "2026 to present" },
      { label: "Two-sided marketplace" },
    ],
    headline: "RunBeta: making strangers safe to transact with",
    lead: "An on-demand services marketplace connecting Lagos customers with vetted local providers, across two distinct apps. I lead design end to end: the booking journey, escrow payments, provider verification, and the mobile design system underneath it.",
  },

  cover: {
    alt: "RunBeta customer and provider apps",
    placeholder: "Drop the RunBeta cover shot, both apps side by side works well",
  } satisfies ImageSlot,

  facts: [
    {
      label: "Role",
      body: "Founding product designer. Research, IA, interaction design, design system, prototype, engineering spec.",
    },
    {
      label: "Surfaces",
      body: "Customer app and provider app, both native mobile, dark mode first.",
    },
    { label: "Team", body: "Founder, engineering, and me on design. Remote, Lagos." },
    {
      label: "The hard part",
      body: "Neither side has a reason to trust the other, and money moves between them.",
      highlight: true,
    },
  ],

  problem: {
    eyebrow: "The problem",
    heading:
      "Booking a plumber in Lagos is a trust problem, not a search problem",
    paragraphs: [
      "Customers do not know whether the person who shows up is the person they hired, or whether paying up front means they will ever see the job finished. Providers do not know whether a booking is real, or whether they will be paid once they have travelled across the city.",
      "So the product had to hold both sides at once. Every decision below is either about proving identity, or about controlling when money moves.",
    ],
  },

  decisionsHeading: "Four decisions that shaped it",

  decisionOne: {
    pill: "01 · Escrow + PIN handshake",
    heading: "Money moves only after both people confirm",
    paragraphs: [
      "Payment is held in escrow at booking. The provider arrives and the customer reads out a short PIN; entering it confirms the right person turned up. A second confirmation at completion releases the funds.",
      "One mechanism answers both fears, the customer's \"is this really them\" and the provider's \"will I be paid\", without adding an identity check to the doorstep.",
    ],
    image: {
      alt: "PIN handshake screens",
      placeholder: "Drop the PIN handshake screens",
    } satisfies ImageSlot,
  },

  decisionTwo: {
    pill: "02 · Provider information architecture",
    heading: "17 undifferentiated rows became 9 grouped entries with live state",
    before: {
      label: "Before",
      value: "17",
      body: "flat rows, all styled the same, no state. Providers tapped in just to check whether something was still true.",
    },
    after: {
      label: "After",
      value: "9",
      body: "grouped entries, each showing its current value. The online/offline toggle, the highest-frequency action, sits at the top level.",
    },
    closing:
      "The rule I applied: if a provider opens a row only to read it, the row should have said it already.",
  },

  decisionThree: {
    pill: "03 · Verification",
    heading: "Rejections written in plain language, and IDs that know they expire",
    body: "The document flow was where providers dropped out. I split it into a segmented model, identity documents separate from proof of work, then gave every rejection a specific, plain-language reason, and attached expiry metadata to time-sensitive IDs so the app can ask before a document goes stale.",
    cards: [
      { title: "Identity", body: "Government ID, selfie match, expiry tracked" },
      { title: "Proof of work", body: "Trade certification, prior job evidence" },
      {
        title: "Rejection states",
        body: "Named reason, what to change, one tap to retry",
      },
    ],
  },

  decisionFour: {
    pill: "04 · The defect flow analysis found",
    heading: "A 0 km default service radius was silently blocking every booking",
    body: "Providers finished onboarding, went online, and received nothing, because the radius field defaulted to zero and nothing in the interface said so. Walking the flow end to end as a provider surfaced it. Fixed with a sensible default, a visible radius on the provider home, and an empty-state that explains why no jobs are arriving.",
  },

  system: {
    eyebrow: "System & prototype",
    heading: "Built to be handed over",
    bullets: [
      "Dark-mode mobile design system: colour, type, spacing, components, states",
      "Navigable multi-screen prototype with push/pop transitions",
      "Business details, availability scheduling, service radius, document verification",
      "Dirty-state save behaviour specified per form, so nothing is lost on back",
    ],
    image: {
      alt: "RunBeta design system and prototype map",
      placeholder: "Drop the design system or prototype map",
    } satisfies ImageSlot,
  },

  reflection: {
    eyebrow: "What the project taught me",
    body: "The radius default was a conversion blocker that no screen review would have caught. It only showed up when the flow was walked end to end as a provider. That walkthrough now happens before high fidelity, not after.",
  },

  next: {
    eyebrow: "Next",
    title: "See the rest of the work",
    cta: "Back to work →",
    href: "/#work",
  },
};
