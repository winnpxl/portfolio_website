import type { CaseStudy } from "./case-study";

/**
 * RunBeta case study. Copy is verbatim from the final case study document;
 * each image placeholder describes the screens its frame is waiting for.
 */
export const runbeta: CaseStudy = {
  slug: "runbeta",
  name: "RunBeta",
  title: "Rebuilding a service marketplace around the potential of the idea.",
  intro: [
    "RunBeta connects people who need things done with local providers who can do them.",
    "I redesigned both sides of the marketplace in 21 days, rebuilding the experience across 100+ screens and 14+ flows — from onboarding and service discovery to active jobs, trust, payment, and provider workflows.",
  ],
  meta: [
    { label: "Project", value: "RunBeta" },
    { label: "Role", value: "Senior Product Designer / Founding Product Designer" },
    { label: "Timeline", value: "21 days" },
    { label: "Platform", value: "Mobile" },
    { label: "Scope", value: "Customer app + Provider app" },
    { label: "Output", value: "100+ screens, 14+ flows" },
    { label: "Status", value: "Redesign shipped and currently in use", live: true },
  ],
  hero: {
    kind: "showcase",
    image: {
      src: "/images/work/runbeta/hero.png",
      alt: "A collage of RunBeta screens: a bridal makeup service, sign-up, onboarding, live navigation to a customer and a successful booking",
      placeholder:
        "Product showcase: RunBeta identity with customer and provider screens, including Book with AI or Active Booking",
    },
  },
  chapters: [
    {
      id: "onboarding",
      label: "Onboarding",
      title: "Trust shouldn't become a barrier to getting started.",
      blocks: [
        {
          type: "text",
          body: "The existing onboarding asked users to provide information, complete NIN verification and go through face scanning before they could properly enter the product.",
        },
        {
          type: "text",
          body: "The intention was understandable: RunBeta needed trust between customers and providers.",
        },
        {
          type: "text",
          body: "But asking users to solve all of that before experiencing the product created unnecessary friction.",
        },
        { type: "text", body: "So I redesigned onboarding around a simpler principle:" },
        {
          type: "emphasis",
          body: "Get users into RunBeta first. Build the rest of their profile progressively.",
        },
        {
          type: "chips",
          label: "The new flow allows users to sign up using:",
          items: ["Email", "Phone", "Google"],
        },
        {
          type: "text",
          body: "Additional profile information can then be completed from the dashboard instead of becoming a prerequisite for using the product.",
        },
        {
          type: "text",
          body: "I compared competitor approaches and tested prototype variations with users. The simpler flow was overwhelmingly preferred, with users specifically appreciating that they no longer had to search for documents to scan before getting started.",
        },
        {
          type: "takeaway",
          body: "The goal wasn't to remove trust. It was to stop trust from becoming the front door.",
        },
        {
          type: "visual",
          visual: {
            kind: "flow",
            image: {
              src: "/images/work/runbeta/onboarding.gif",
              alt: "RunBeta onboarding, alternating between the three intro screens and the sign-up and verification flow",
              placeholder:
                "Onboarding, before and after: original entry and verification, then the new sign-up, sign-in options and first screen",
            },
          },
        },
      ],
    },
    {
      id: "scheduled-vs-instant",
      label: "Scheduled vs Instant",
      title: "Sometimes the service matters. Sometimes the clock matters more.",
      blocks: [
        { type: "text", body: "RunBeta supports two ways of getting a service:" },
        {
          type: "cards",
          items: [
            { title: "Scheduled", body: "Book a provider for a planned time." },
            { title: "Instant", body: "Request a service when it needs to happen immediately." },
          ],
        },
        {
          type: "text",
          body: "Instant services cost a little more because the customer is paying for urgency.",
        },
        { type: "text", body: "This introduced an important marketplace idea:" },
        { type: "emphasis", body: "Time itself has value." },
        {
          type: "text",
          body: "Instead of treating urgency as something buried inside the booking flow, I made it part of the service experience.",
        },
        {
          type: "visual",
          visual: {
            kind: "flow",
            caption: "Scheduled when it can wait. Instant when it can't.",
            image: {
              src: "/images/work/runbeta/scheduled-vs-instant.png",
              alt: "Instant and scheduled booking side by side: the same service list and bridal makeup service page, with Book service now for instant and Schedule booking for scheduled",
              placeholder:
                "Scheduled and Instant service screens: selection, timing and the price difference",
            },
          },
        },
      ],
    },
    {
      id: "book-with-ai",
      label: "Book with AI",
      title: "People don't think in service categories. They think in problems.",
      inProgress: true,
      blocks: [
        {
          type: "text",
          body: "The traditional marketplace model asks customers to understand the catalogue before they can get something done.",
        },
        {
          type: "quotes",
          contrast: true,
          items: [
            { lead: "But people don't necessarily think:", body: "\"I need a Home Repair provider.\"" },
            { lead: "They think:", body: "\"My sink is clogged.\"" },
          ],
        },
        {
          type: "text",
          body: "So I designed **Book with AI** around the problem rather than the marketplace.",
        },
        {
          type: "text",
          body: "A customer can describe what they need in natural language and RunBeta works through the request to determine the appropriate service and provider type.",
        },
        {
          type: "steps",
          label: "The flow",
          items: [
            "Describe the problem",
            "Understand the request",
            "Identify the service",
            "Ask relevant follow-up questions",
            "Consider urgency and budget",
            "Match suitable providers",
            "Customer confirms",
            "Booking request",
          ],
          aside: {
            label: "The matching layer considers:",
            items: ["Quality", "Proof of work", "Proximity", "Pricing", "The customer's request"],
          },
        },
        { type: "text", body: "This means Book with AI isn't simply an AI search feature." },
        { type: "emphasis", body: "It's a matching layer over the marketplace." },
        {
          type: "text",
          body: "It takes some of the complexity of choosing a provider away from the customer.",
        },
        {
          type: "quotes",
          label: "Examples",
          items: [
            {
              lead: "A customer could say:",
              body: "\"My sink is clogged and my cistern isn't working. I need it fixed.\"",
            },
            {
              lead: "Or:",
              body: "\"I want makeup for an owambe and I also need my gele tied. Can I get a good MUA to do both?\"",
            },
          ],
        },
        {
          type: "text",
          body: "The user doesn't need to know exactly which category to browse or which provider type to search for.",
        },
        { type: "text", body: "They explain the problem." },
        { type: "text", body: "RunBeta helps translate that problem into a marketplace action." },
        {
          type: "visual",
          visual: {
            kind: "feature",
            image: {
              src: "/images/work/runbeta/book-with-ai.png",
              alt: "Four Book with AI screens: describing the problem, answering follow-up questions, choosing from matched providers and a confirmed booking",
              placeholder:
                "Book with AI, end to end: entry, the problem, AI response, follow-up questions, recommendation, provider details, confirmation, booking request",
            },
          },
        },
        {
          type: "takeaway",
          body: "Instead of making customers search the marketplace, let them describe what they need.",
        },
      ],
    },
    {
      id: "active-booking",
      label: "Active booking",
      title: "The booking shouldn't be the end of the experience.",
      blocks: [
        {
          type: "text",
          body: "The existing product could create a booking, but the experience after that point wasn't developed enough.",
        },
        { type: "text", body: "The redesign turned the booking into a visible job lifecycle." },
        {
          type: "text",
          body: "Once a provider accepts the work, the customer can follow what is happening through an active booking experience.",
        },
        {
          type: "steps",
          label: "The job lifecycle",
          items: [
            "Provider confirms",
            "Customer receives confirmation",
            "Provider travels to the customer",
            "Active booking begins",
            "Tasks are visible",
            "PIN confirms the start",
            "Work happens",
            "Provider submits completion",
            "Customer approves",
            "Payment is released",
          ],
        },
        {
          type: "text",
          body: "The PIN creates an explicit confirmation point before the work starts.",
        },
        {
          type: "text",
          body: "The provider then submits a completion image when the job is finished, and the customer approves the completed work before the escrowed payment is released.",
        },
        {
          type: "callout",
          callout: {
            label: "Why this matters",
            lines: [
              "The transaction is no longer:",
              "**Book → wait → hope**",
              "It becomes a visible sequence where both sides understand what state the job is in.",
            ],
          },
        },
        {
          type: "visual",
          visual: {
            kind: "timeline",
            image: {
              src: "/images/work/runbeta/active-booking.png",
              alt: "A provider's active booking: accepting the job, navigating to the customer, working through the tasks and the payment being released",
              placeholder:
                "Active booking as a timeline: confirmed, provider confirmation, active booking, tasks, PIN, completion, approval, payment release",
            },
          },
        },
        {
          type: "takeaway",
          body: "The product doesn't stop at booking. It stays involved until the job is complete.",
        },
      ],
    },
    {
      id: "live-activities",
      label: "Live Activities",
      title: "The job keeps moving even when the app isn't open.",
      inProgress: true,
      blocks: [
        {
          type: "text",
          body: "An ongoing service shouldn't require the customer or provider to keep RunBeta open just to know what's happening.",
        },
        {
          type: "text",
          body: "I designed Live Activities for both sides of the marketplace so the current job state can remain visible outside the application.",
        },
        {
          type: "cards",
          items: [
            { title: "iOS", body: "Dynamic Island" },
            { title: "Android", body: "Notification bar" },
          ],
        },
        {
          type: "text",
          body: "The states are customized according to where the customer or provider is in the job.",
        },
        { type: "text", body: "The goal is deliberately simple:" },
        {
          type: "text",
          body: "Users can leave RunBeta, respond to WhatsApp, browse TikTok, or do something else while still knowing what is happening with their service.",
        },
        {
          type: "visual",
          visual: {
            kind: "devices",
            items: [
              {
                label: "iOS · Dynamic Island",
                image: {
                  src: "/images/work/runbeta/live-activities-ios.png",
                  alt: "A RunBeta Live Activity on the iOS lock screen and in the Dynamic Island, showing the provider arriving in three minutes",
                  placeholder: "iOS Dynamic Island, two or three job states in a device mockup",
                },
              },
              {
                label: "Android · Notification bar",
                image: {
                  alt: "A RunBeta Live Activity in the Android notification bar",
                  placeholder: "Android notification, two or three job states in a device mockup",
                },
              },
            ],
          },
        },
        {
          type: "takeaway",
          body: "The job keeps moving even when the user leaves the app.",
        },
        { type: "note", body: "Live Activities are designed but are not yet fully shipped." },
      ],
    },
    {
      id: "reflection",
      label: "Reflection",
      title: "RunBeta taught me that a two-sided marketplace isn't really two products.",
      blocks: [
        { type: "text", body: "It's one system with two perspectives." },
        {
          type: "chain",
          items: [
            "A customer's booking creates a provider state.",
            "A provider's confirmation changes a customer's expectation.",
            "A completed job changes the payment state.",
          ],
        },
        { type: "text", body: "Every action on one side creates a consequence on the other." },
        { type: "text", body: "That became the central lesson of the redesign." },
        { type: "text", body: "I wasn't simply redesigning screens." },
        { type: "text", body: "I was redesigning the relationship between them." },
        {
          type: "text",
          body: "The 21-day constraint also changed how I worked. I used AI throughout the process to help surface missing screens, edge cases, alternative states and overlooked use cases while keeping the design process moving quickly.",
        },
        { type: "text", body: "AI didn't make the product decisions for me." },
        { type: "text", body: "It helped me expand the amount of product I could think through." },
        {
          type: "closing",
          body: "RunBeta had the ingredients for a scalable marketplace. I redesigned the experience so the product could finally get out of its own way.",
        },
        {
          type: "visual",
          visual: {
            kind: "showcase",
            image: {
              src: "/images/work/runbeta/closing.png",
              alt: "A thank-you slide with three RunBeta screens: easy access to professionals, requested services, and all service categories",
              placeholder: "Closing product composition: the strongest final RunBeta screens",
            },
          },
        },
      ],
    },
  ],
};
