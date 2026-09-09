import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type { ImageSlot } from "@/content/site";

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* --------------------------------------------------------------- Pill */

/** Small bordered chip for roles, years and tags. */
export function Pill({
  children,
  className,
  tone = "line",
}: {
  children: ReactNode;
  className?: string;
  tone?: "line" | "solid" | "ghost";
}) {
  const tones = {
    line: "border border-line bg-surface text-ink-soft",
    solid: "bg-ink text-canvas",
    ghost: "bg-ink/5 text-ink-soft",
  } as const;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-[11px] py-[5px] text-[12px] font-medium leading-none tracking-[-0.005em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** The green "available" dot, used in the hero button and the contact badge. */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cx("inline-block h-[7px] w-[7px] rounded-full bg-live", className)}
    />
  );
}

/* ------------------------------------------------------------- Button */

const buttonBase =
  "inline-flex items-center gap-2 rounded-full px-[22px] py-[13px] text-[15px] font-medium leading-none tracking-[-0.01em] transition-colors";

/** Primary is the black pill from the references; ghost is its quiet sibling. */
export function ButtonLink({
  href,
  children,
  tone = "solid",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "solid" | "ghost" | "light";
  className?: string;
}) {
  const tones = {
    solid: "bg-ink text-canvas hover:bg-ink-soft",
    ghost: "border border-line bg-transparent text-ink hover:bg-ink/5",
    light: "bg-canvas text-ink hover:bg-surface",
  } as const;

  const external =
    href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  const cls = cx(buttonBase, tones[tone], className);

  if (external) {
    return (
      <a href={href} className={cls} data-sound>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} data-sound>
      {children}
    </Link>
  );
}

/* --------------------------------------------------------------- Type */

/** Small muted label: section counts, row labels, eyebrows. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("text-[13px] font-medium tracking-[-0.005em] text-muted", className)}>
      {children}
    </div>
  );
}

/** Section heading. Quiet by design; the tiles do the talking. */
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
        "m-0 text-[clamp(26px,3.2vw,36px)] font-semibold leading-[1.15] tracking-[-0.015em]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

/** Section header row: heading left, muted count or note right. */
export function SectionHeader({
  title,
  aside,
  className,
}: {
  title: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("mb-8 flex flex-wrap items-baseline justify-between gap-3", className)}>
      <SectionHeading>{title}</SectionHeading>
      {aside && <Eyebrow>{aside}</Eyebrow>}
    </div>
  );
}

/** Compact bullet list with a small ink marker. */
export function BulletList({
  items,
  size = "md",
  className,
}: {
  items: readonly string[];
  size?: "sm" | "md";
  className?: string;
}) {
  const sizes = {
    sm: "text-[14px] leading-[1.5]",
    md: "text-[15px] leading-[1.55]",
  } as const;
  return (
    <ul className={cx("m-0 grid list-none gap-2 p-0 text-ink-soft", className)}>
      {items.map((item) => (
        <li key={item} className={cx("flex gap-3", sizes[size])}>
          <span aria-hidden className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-ink" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------- Row */

/**
 * Hairline information row. Label left, content right; stacks below sm.
 * This is how everything that is not an image is laid out here.
 */
export function Row({
  label,
  children,
  className,
  first,
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
  first?: boolean;
}) {
  return (
    <div
      className={cx(
        "grid gap-x-8 gap-y-2 border-line py-6 sm:grid-cols-[minmax(0,12rem)_1fr]",
        first ? "border-t" : "border-t",
        className,
      )}
    >
      <div className="text-[13px] font-medium text-muted">{label}</div>
      <div>{children}</div>
    </div>
  );
}

/* -------------------------------------------------------- Image frame */

const ratioClass = {
  "16/9": "aspect-[16/9]",
  "16/10": "aspect-[16/10]",
  "4/3": "aspect-[4/3]",
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
  "1/1": "aspect-square",
} as const;

export type Ratio = keyof typeof ratioClass;

export type Fill = "tile" | "deep" | "dark" | "surface";

const fillClass: Record<Fill, string> = {
  tile: "bg-tile",
  deep: "bg-tile-deep",
  dark: "bg-tile-dark on-dark",
  surface: "bg-surface",
};

/** Rotation for a grid of tiles, so neighbours never share a fill. */
export const tileRotation: Fill[] = ["tile", "surface", "deep", "tile"];

/**
 * Image tile. The image is the card: no inner border, no padding, a
 * neutral fill behind it. Renders the real image once `slot.src` is set;
 * until then the fill and a faint note hold the exact space.
 */
export function ImageFrame({
  slot,
  ratio,
  fill = "tile",
  radius = 24,
  ring = false,
  sound = false,
  priority,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
}: {
  slot: ImageSlot;
  ratio: Ratio;
  fill?: Fill;
  radius?: number;
  ring?: boolean;
  /** Opt in to the hover sound. Work and gallery tiles do; the portrait does not. */
  sound?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const dark = fill === "dark";
  return (
    <div
      data-sound={sound || undefined}
      className={cx(
        "relative overflow-hidden",
        ratioClass[ratio],
        fillClass[fill],
        ring && "shadow-tile",
        className,
      )}
      style={{ borderRadius: radius }}
    >
      {slot.src ? (
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          priority={priority}
          className="object-cover"
          sizes={sizes}
        />
      ) : (
        <span
          className={cx(
            "absolute inset-0 grid place-items-center p-6 text-center text-[13px] font-medium",
            dark ? "text-canvas/40" : "text-faint",
          )}
        >
          {slot.placeholder}
        </span>
      )}
    </div>
  );
}
