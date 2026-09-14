import type { ImageSlot } from "./site";

/**
 * The shape every case study renders from. Copy lives in one content file
 * per project and src/components/CaseStudy.tsx turns it into the page, so
 * every case study reads and looks the same.
 *
 * Blocks say what a piece of copy is, never how it looks. Inline
 * **double asterisks** mark bold, exactly as in the source documents.
 */

/** A visual moment. The kind says what the image shows, and so its shape. */
export type Visual =
  | {
      /**
       * showcase: one horizontal product composition, for the opening and close.
       * flow: a sequence of screens. feature: the largest moment in the study.
       * timeline: a lifecycle laid out horizontally.
       */
      kind: "showcase" | "flow" | "feature" | "timeline";
      image: ImageSlot;
      caption?: string;
    }
  | {
      /** The same idea on more than one device, side by side. */
      kind: "devices";
      items: { label: string; image: ImageSlot }[];
      caption?: string;
    };

/** A set-apart aside: a short run of lines, a list, or both. */
export type Callout = {
  label: string;
  lines?: string[];
  items?: string[];
};

export type Block =
  | { type: "text"; body: string }
  /** A line that carries the argument, set apart from the paragraphs. */
  | { type: "emphasis"; body: string }
  | { type: "chips"; label?: string; items: string[] }
  | { type: "cards"; items: { title: string; body: string }[] }
  /** Quoted speech. With `contrast`, the first quote is the way of thinking being replaced. */
  | { type: "quotes"; label?: string; items: { lead: string; body: string }[]; contrast?: boolean }
  /** An ordered sequence; the last step is the outcome. */
  | { type: "steps"; label: string; items: string[]; aside?: Callout }
  | { type: "callout"; callout: Callout }
  /** Cause and consequence, one per line. */
  | { type: "chain"; items: string[] }
  | { type: "takeaway"; body: string }
  /** The study's last word, larger than a takeaway. */
  | { type: "closing"; body: string }
  /** A small status line, such as what has not shipped yet. */
  | { type: "note"; body: string }
  | { type: "visual"; visual: Visual };

export type Chapter = {
  /** Anchor id for the section. */
  id: string;
  label: string;
  /** The chapter headline. Without one, the label names the chapter on its own. */
  title?: string;
  /** Designed but not yet shipped. Marked on the chapter and on its visuals. */
  inProgress?: boolean;
  blocks: Block[];
};

export type CaseStudy = {
  slug: string;
  /** Short name, used in the nav and page title. */
  name: string;
  title: string;
  intro: string[];
  /** An optional line that closes the intro, set apart from the paragraphs. */
  statement?: string;
  meta: { label: string; value: string; live?: boolean }[];
  hero: Visual;
  chapters: Chapter[];
};
