import type { CaseStudy } from "./case-study";

/**
 * Jaye case study. Copy is verbatim from the final case study document,
 * except that the name is written Jaye throughout, at the author's request;
 * Jaye, the official name, appears only on the home thumbnail. Each image
 * placeholder describes the screens its frame is waiting for.
 */
export const gojaye: CaseStudy = {
  slug: "gojaye",
  name: "Jaye",
  title: "Building a mobility platform from the ground up.",
  intro: [
    "Jaye is a mobility platform designed to make moving around easier for customers while creating a better earning opportunity for drivers.",
    "I joined the project from a clean slate and owned the design from the brand and visual language through the product experience, flows, and design system.",
    "The result is a 150+ screen product spanning customer, driver, and administrative experiences.",
  ],
  statement: "One platform. Two sides of mobility. Designed from the ground up.",
  meta: [
    { label: "Role", value: "Senior Product Designer · Sole Designer" },
    { label: "Timeline", value: "July 2026 — Present" },
    { label: "Scope", value: "Brand · Product Design · UX/UI · Design System · iOS · Android" },
    { label: "Product", value: "Mobility Platform" },
  ],
  hero: {
    kind: "showcase",
    image: {
      alt: "Jaye customer onboarding, customer wallet and driver subscription screens",
      placeholder: "Opening composition: customer onboarding, customer wallet and driver subscription",
    },
  },
  chapters: [
    {
      id: "foundation",
      label: "Brand & foundation",
      title: "From a blank canvas to a real product.",
      blocks: [
        {
          type: "text",
          body: "Starting from zero meant there was no existing interface, system, or established visual language to inherit.",
        },
        {
          type: "text",
          body: "I had to define how Jaye should look, feel, and behave across the entire product — from the logo and brand guidelines to the smallest interaction in the apps.",
        },
        {
          type: "text",
          body: "As the sole designer, I carried that language across the customer and driver experiences while making sure the product could support the different needs of both sides of the platform.",
        },
        {
          type: "visual",
          visual: {
            kind: "flow",
            image: {
              alt: "Jaye brand elements beside early product screens",
              placeholder: "Brand, foundation, product and system: selected brand elements beside a few early product screens",
            },
          },
        },
      ],
    },
    {
      id: "affordability",
      label: "Affordability",
      title: "Making mobility more accessible.",
      blocks: [
        {
          type: "text",
          body: "A better ride shouldn't only be available to people with a particular budget.",
        },
        {
          type: "text",
          body: "One of the decisions I designed into Jaye was giving customers different ride categories based on what they can afford.",
        },
        {
          type: "cards",
          items: [
            { title: "Economy", body: "The most accessible option for customers who want to spend less." },
            { title: "Mid-level", body: "A balance between affordability and a more comfortable ride." },
            { title: "Elite", body: "A more premium experience for customers who are willing to spend more." },
          ],
        },
        {
          type: "text",
          body: "Instead of forcing every customer into the same experience, the ride selection becomes a decision that reflects their budget.",
        },
        {
          type: "visual",
          visual: {
            kind: "feature",
            image: {
              alt: "Jaye ride category selection from Economy to Elite",
              placeholder: "Economy, Mid-level and Elite: category selection, vehicle differences, pricing and the confirmation state",
            },
          },
        },
      ],
    },
    {
      id: "driver-quality",
      label: "Driver quality",
      title: "A good ride shouldn't depend entirely on luck.",
      blocks: [
        {
          type: "text",
          body: "Consistency in ride quality is one of the things Jaye needs to earn from its users.",
        },
        {
          type: "text",
          body: "So I designed a driver course and assessment directly into the onboarding experience.",
        },
        {
          type: "chips",
          label: "Before drivers begin operating on the platform, they can complete a one-time course covering areas such as:",
          items: [
            "Customer relationships",
            "Road safety",
            "Security",
            "Handling unexpected situations",
            "Emergency scenarios",
          ],
        },
        {
          type: "text",
          body: "Drivers receive a score after completing the assessment, and that result is reflected in the system and retained in their profile history.",
        },
        {
          type: "text",
          body: "The idea wasn't simply to tell users that Jaye cares about quality.",
        },
        { type: "text", body: "It was to design a mechanism that actively supports it." },
        {
          type: "visual",
          visual: {
            kind: "timeline",
            image: {
              alt: "The Jaye driver course, from onboarding to assessment score and profile history",
              placeholder: "Driver onboarding, course, assessment, score and profile history as one connected flow",
            },
          },
        },
      ],
    },
    {
      id: "driver-business",
      label: "Driver business",
      title: "Drivers aren't just the other side of the app.",
      blocks: [
        { type: "text", body: "They are customers of the platform too." },
        {
          type: "text",
          body: "Jaye needed to give drivers a clear path from joining the platform to actually earning through it.",
        },
        {
          type: "text",
          body: "I designed the driver experience around that journey — from onboarding and subscription to receiving rides and managing their work on the platform.",
        },
        { type: "text", body: "One of the key parts of this experience is the subscription model." },
        {
          type: "text",
          body: "Drivers get a **30-day free driving subscription offer**, and after subscription, they keep what they earn on the platform without additional charges being taken from those earnings.",
        },
        {
          type: "text",
          body: "The design needed to make this value immediately understandable without overwhelming the driver during onboarding.",
        },
        {
          type: "visual",
          visual: {
            kind: "flow",
            image: {
              alt: "Jaye driver onboarding, subscription and earning screens",
              placeholder: "Driver onboarding, subscription offer, subscription state, getting a ride and the earning experience",
            },
          },
        },
      ],
    },
    {
      id: "mobility-services",
      label: "Mobility services",
      title: "More than just getting from A to B.",
      blocks: [
        { type: "text", body: "Jaye isn't limited to one type of mobility need." },
        { type: "text", body: "The customer experience supports multiple ways of using the platform:" },
        {
          type: "cards",
          items: [
            { title: "Ride", body: "Book a vehicle and get from one location to another." },
            { title: "Courier", body: "Send a package from one place to another." },
            { title: "Professional Driver", body: "Book a professional driver to drive your own vehicle." },
          ],
        },
        {
          type: "text",
          body: "Each service introduces a different flow, but they all need to feel like part of the same product.",
        },
        {
          type: "visual",
          visual: {
            kind: "flow",
            image: {
              alt: "Jaye ride, courier and professional driver flows",
              placeholder: "Ride, Courier and Professional Driver: the strongest screens from each journey",
            },
          },
        },
      ],
    },
    {
      id: "cross-platform",
      label: "Cross-platform",
      title: "One product can't feel like two different products.",
      blocks: [
        { type: "text", body: "Jaye is designed across both iOS and Android." },
        {
          type: "text",
          body: "That introduced another layer of complexity: creating experiences that feel consistent with the Jaye design language while still working naturally across different platforms.",
        },
        { type: "text", body: "The goal wasn't to make two identical products." },
        {
          type: "text",
          body: "It was to create one coherent product system that could adapt to both platforms without losing its identity.",
        },
        {
          type: "visual",
          visual: {
            kind: "devices",
            items: [
              {
                label: "iOS",
                image: {
                  alt: "Jaye screens on iOS",
                  placeholder: "A few representative Jaye screens on iOS",
                },
              },
              {
                label: "Android",
                image: {
                  alt: "The same Jaye screens on Android",
                  placeholder: "The same or related Jaye screens on Android",
                },
              },
            ],
          },
        },
      ],
    },
    {
      id: "ai-assisted-design",
      label: "AI-assisted design",
      title: "Designing from scratch doesn't mean seeing everything from the start.",
      blocks: [
        { type: "text", body: "I also used AI as part of my design review process." },
        {
          type: "text",
          body: "For a few screens and flows, I used Claude to review the experience and help surface things I might have overlooked.",
        },
        {
          type: "text",
          body: "It became particularly useful when working through complex flows because I could move quickly while still challenging the decisions I had already made.",
        },
        { type: "text", body: "AI wasn't replacing the design process." },
        {
          type: "text",
          body: "It became another layer of review — helping me catch gaps, question assumptions, and explore flows more thoroughly.",
        },
        {
          type: "visual",
          visual: {
            kind: "flow",
            image: {
              alt: "A Jaye flow before and after an AI-assisted design review",
              placeholder: "A selected flow, a small glimpse of the review, and the refined result",
            },
          },
        },
      ],
    },
    {
      id: "launch",
      label: "Launch",
      title: "From design to launch.",
      blocks: [
        { type: "text", body: "Jaye is now approaching launch." },
        {
          type: "text",
          body: "The customer application has shipped, while the driver application is in its final stages of design and preparation.",
        },
        {
          type: "text",
          body: "A group of users has already been gathered to test the driver experience before launch, giving the team an opportunity to identify issues that may not have been visible during the design process alone.",
        },
        {
          type: "text",
          body: "The product now spans more than 150 screens across customer, driver, and administrative experiences — all built from the same foundation that started with a blank canvas.",
        },
        {
          type: "visual",
          visual: {
            kind: "flow",
            image: {
              alt: "A curated montage of final Jaye customer and driver screens",
              placeholder: "Final product montage: customer home, booking, in-ride, wallet, courier, driver home, subscription and driver ride flow",
            },
          },
        },
      ],
    },
    {
      id: "reflection",
      label: "Reflection",
      blocks: [
        {
          type: "text",
          body: "I came to understand that users will always have conditions and edge cases that we may not be able to cover in the first iteration of a design or even the first round of launch.",
        },
        { type: "text", body: "That is a challenge that's difficult to foresee." },
        {
          type: "text",
          body: "The best we can do is cover as much ground as possible before launch, build a strong foundation, and leave enough room for the product to evolve as real users begin to interact with it.",
        },
      ],
    },
    {
      id: "outcome",
      label: "Outcome",
      title: "From zero to a mobility platform.",
      blocks: [
        { type: "text", body: "Jaye started with a blank canvas." },
        {
          type: "text",
          body: "My job was to turn the vision into a product system that could actually carry it — from the brand and visual language to the experiences customers and drivers interact with every day.",
        },
        { type: "emphasis", body: "150+ screens." },
        { type: "emphasis", body: "Two core sides of the platform." },
        { type: "emphasis", body: "One design language." },
        { type: "text", body: "And we're almost ready to put it in the hands of more people." },
        {
          type: "visual",
          visual: {
            kind: "showcase",
            image: {
              alt: "The strongest full Jaye product composition",
              placeholder: "End frame: the strongest full-product composition",
            },
          },
        },
      ],
    },
  ],
};
