import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type { ImageSlot } from "@/content/site";

/** Surface fills used across pills, cards and panels. */
export type Tone = "cream" | "butter" | "rose" | "pink" | "maroon";

const toneFill: Record<Tone, string> = {
  cream: "bg-cream",
  butter: "bg-butter",
  rose: "bg-rose",
  pink: "bg-pink text-cream",
  maroon: "bg-maroon text-cream",
};

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* --------------------------------------------------------------- Pill */

export function Pill({
  children,
  tone = "cream",
  rotate,
  className,
  shadow = true,
}: {
  children: ReactNode;
  tone?: Tone;
  /** Only selected pills are rotated; cards never are. */
  rotate?: string;
  className?: string;
  shadow?: boolean;
}) {
  return (
    <span
      className={cx(
        "inline-block rounded-full border-2 border-maroon",
        shadow && "shadow-hard-4",
        toneFill[tone],
        className,
      )}
      style={rotate ? { transform: `rotate(${rotate})` } : undefined}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------- Button */

const buttonBase =
  "inline-block rounded-full border-2 font-bold text-[16px] px-[26px] py-[14px]";

export function ButtonLink({
  href,
  children,
  tone = "maroon",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "maroon" | "cream" | "butter";
  className?: string;
}) {
  const tones = {
    maroon:
      "bg-maroon text-cream border-maroon shadow-deep-5 hover:bg-maroon-deep hover:text-cream",
    cream: "bg-cream border-maroon shadow-hard-5 hover:bg-butter",
    butter: "bg-butter border-butter shadow-deep-5 hover:bg-cream hover:border-cream",
  } as const;

  const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
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

export function Card({
  children,
  tone = "cream",
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  /** The design marks work and case-study cards up as <article>. */
  as?: "div" | "article";
}) {
  return (
    <Tag
      className={cx(
        "rounded-[24px] border-2 border-maroon p-[clamp(18px,2.4vw,26px)]",
        tone === "maroon" ? "shadow-deep-7" : "shadow-hard-7",
        toneFill[tone],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Large panel: 26px radius, 8px shadow. */
export function Panel({
  children,
  tone = "cream",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-[26px] border-2 border-maroon p-[clamp(22px,3.4vw,42px)]",
        tone === "maroon" ? "shadow-deep-8 on-maroon" : "shadow-hard-8",
        toneFill[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------- Type */

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
        "text-[13px] font-bold uppercase tracking-[.18em]",
        className,
      )}
    >
      {children}
    </div>
  );
}

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
        "font-display font-extrabold text-[clamp(28px,4.2vw,52px)] leading-none m-0",
        className,
      )}
    >
      {children}
    </h2>
  );
}

/** Pink bullet list, used on work cards and the case study. */
export function BulletList({
  items,
  size = "md",
}: {
  items: readonly string[];
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-[14px] leading-[1.4] gap-[9px]",
    md: "text-[15px] leading-[1.45] gap-[10px]",
    lg: "text-[16px] leading-[1.45] gap-[10px]",
  } as const;
  const gaps = { sm: "gap-2", md: "gap-[10px]", lg: "gap-3" } as const;

  return (
    <ul className={cx("m-0 grid list-none p-0", gaps[size])}>
      {items.map((item) => (
        <li key={item} className={cx("flex", sizes[size])}>
          <span aria-hidden className="font-extrabold text-pink">
            ●
          </span>
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
 * Bordered image frame. Renders a real image once `slot.src` is set,
 * and until then shows the frame with its placeholder note, so an
 * unfilled portfolio still lays out exactly like the design.
 */
export function ImageFrame({
  slot,
  ratio,
  radius = "14px",
  shadow,
  backing = "bg-rose",
  className,
}: {
  slot: ImageSlot;
  ratio: Ratio;
  radius?: string;
  shadow?: "hard-7" | "hard-8";
  backing?: string;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "relative overflow-hidden border-2 border-maroon",
        ratioClass[ratio],
        backing,
        shadow === "hard-8" && "shadow-hard-8",
        shadow === "hard-7" && "shadow-hard-7",
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
        <span className="absolute inset-0 grid place-items-center p-4 text-center text-[13px] font-semibold opacity-70">
          {slot.placeholder}
        </span>
      )}
    </div>
  );
}
