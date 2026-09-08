import type { ReactNode } from "react";

import { cx } from "./ui";

/** Parchment canvas. The warm tint replaces pure white on purpose. */
export function PageShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-parchment-cream">{children}</div>;
}

/**
 * Centred content column at the 1200px page max-width, with the page
 * gutter. Sections that need a full-bleed background render their own
 * wrapper and nest this inside it.
 */
export function Section({
  children,
  id,
  width = 1200,
  className,
}: {
  children: ReactNode;
  id?: string;
  width?: 1200 | 900;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cx(
        "mx-auto px-[clamp(16px,4vw,32px)]",
        width === 1200 ? "max-w-[1200px]" : "max-w-[900px]",
        className,
      )}
      style={{ scrollMarginTop: "96px" }}
    >
      {children}
    </section>
  );
}

/** Full-bleed twilight band. Used by the hero and the contact close. */
export function TwilightBand({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("twilight-sky on-twilight text-parchment-cream", className)}>
      {children}
    </div>
  );
}
