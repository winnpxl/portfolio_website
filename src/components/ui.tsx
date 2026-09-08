import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type { ImageSlot } from "@/content/site";

/**
 * Surface fills. The neutrals carry structure; the rainbow set is
 * punctuation, used as card fills in rotation, never as a single
 * dominant brand colour.
 */
export type Tone =
  | "paper"
  | "linen"
  | "parchment"
  | "twilight"
  | "violet"
  | "pink"
  | "tangerine"
  | "aqua"
  | "sky"
  | "yellow"
  | "mint"
  | "lilac";

const toneFill: Record<Tone, string> = {
  paper: "bg-paper-white",
  linen: "bg-linen-beige",
  parchment: "bg-parchment-cream",
  twilight: "bg-twilight-indigo text-parchment-cream on-twilight",
  violet: "bg-electric-violet",
  pink: "bg-bubblegum-pink",
  tangerine: "bg-tangerine",
  aqua: "bg-aqua-teal",
  sky: "bg-sky-blue",
  yellow: "bg-sunshine-yellow",
  mint: "bg-mint-green",
  lilac: "bg-lilac-mist",
};

/** Accent rotation for feature grids, in the order DESIGN.md lists. */
export const accentRotation: Tone[] = [
  "violet",
  "pink",
  "tangerine",
  "aqua",
  "sky",
  "yellow",
  "mint",
];

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* --------------------------------------------------------------- Pill */

/** Full pill, reserved for tags and chips. Never for buttons. */
export function Pill({
  children,
  tone = "paper",
  className,
  bordered = true,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  bordered?: boolean;
}) {
  return (
    <span
      className={cx(
        "inline-block rounded-full px-[10px] py-[4px] text-[12px] font-medium",
        bordered && "border border-sand-gray",
        toneFill[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------- Button */

const buttonBase =
  "inline-block rounded-[12px] px-5 py-[10px] text-[14px] font-semibold tracking-[-0.011em]";

/**
 * DESIGN.md is explicit that primary actions stay neutral: filled white
 * or ink, with chromatic colour reserved for decoration. So there is no
 * solid-violet CTA here on purpose.
 */
export function ButtonLink({
  href,
  children,
  tone = "ink",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "ink" | "paper" | "ghost" | "outlined";
  className?: string;
}) {
  const tones = {
    ink: "bg-ink-black text-parchment-cream hover:bg-charcoal-stone",
    paper: "bg-paper-white text-ink-black shadow-raised hover:bg-linen-beige",
    ghost:
      "bg-transparent text-parchment-cream border border-parchment-cream/30 hover:bg-parchment-cream/10",
    outlined:
      "bg-lilac-mist text-ink-black border border-pale-violet hover:bg-pale-violet/30",
  } as const;

  const external =
    href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  const cls = cx(buttonBase, tones[tone], className);

  if (external) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/* --------------------------------------------------------------- Card */

/** Standard content card: 12px radius, hairline ring, warm layered shadow. */
export function Card({
  children,
  tone = "paper",
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  as?: "div" | "article";
}) {
  const chromatic = !["paper", "linen", "parchment", "twilight"].includes(tone);
  return (
    <Tag
      className={cx(
        "rounded-[12px] p-5",
        // Accent fills carry their own colour and need no ring.
        chromatic ? "" : "shadow-card",
        toneFill[tone],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Large panel: 16px radius. */
export function Panel({
  children,
  tone = "paper",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const chromatic = !["paper", "linen", "parchment", "twilight"].includes(tone);
  return (
    <div
      className={cx(
        "rounded-[16px] p-6 sm:p-8",
        chromatic || tone === "twilight" ? "" : "shadow-card",
        toneFill[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}

/* --------------------------------------------------------------- Type */

/** Small uppercase label. Sans only; the serif never comes below 28px. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "text-[12px] font-semibold uppercase tracking-[.12em] text-ash-gray",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Section heading. Serif at weight 400 is the signature of this system,
 * so it is never bolded.
 */
export function SectionHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cx(
        "m-0 font-display text-[clamp(32px,5vw,48px)] font-normal leading-[1.2] tracking-[-0.013em]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

/** Bullet list with a small violet marker. */
export function BulletList({
  items,
  size = "md",
  markerClass = "bg-electric-violet",
}: {
  items: readonly string[];
  size?: "sm" | "md" | "lg";
  markerClass?: string;
}) {
  const sizes = {
    sm: "text-[14px] leading-[1.43]",
    md: "text-[15px] leading-[1.47]",
    lg: "text-[16px] leading-[1.5]",
  } as const;

  return (
    <ul className="m-0 grid list-none gap-2 p-0">
      {items.map((item) => (
        <li key={item} className={cx("flex gap-3", sizes[size])}>
          <span
            aria-hidden
            className={cx("mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full", markerClass)}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------- Image frame */

const ratioClass = {
  "16/9": "aspect-[16/9]",
  "16/10": "aspect-[16/10]",
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  "1/1": "aspect-square",
} as const;

export type Ratio = keyof typeof ratioClass;

/**
 * Bordered image frame. Renders a real image once `slot.src` is set, and
 * until then shows the frame with its placeholder note, so an unfilled
 * portfolio still lays out exactly like the design.
 */
export function ImageFrame({
  slot,
  ratio,
  radius = "12px",
  backing = "bg-linen-beige",
  className,
}: {
  slot: ImageSlot;
  ratio: Ratio;
  radius?: string;
  backing?: string;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "relative overflow-hidden ring-1 ring-sand-gray",
        ratioClass[ratio],
        backing,
        className,
      )}
      style={{ borderRadius: radius }}
    >
      {slot.src ? (
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <span className="absolute inset-0 grid place-items-center p-4 text-center text-[12px] font-medium text-ash-gray">
          {slot.placeholder}
        </span>
      )}
    </div>
  );
}
