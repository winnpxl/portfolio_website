import type { ReactNode } from "react";

import { cx } from "./ui";

/** Soft grey canvas, edge to edge. */
export function PageShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-canvas">{children}</div>;
}

/**
 * Centred content column with the generous side gutters the references
 * use. 1280 for the home and gallery grids, 880 for reading pages.
 */
export function Section({
  children,
  id,
  width = 1280,
  className,
}: {
  children: ReactNode;
  id?: string;
  width?: 1280 | 880;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cx(
        "mx-auto px-[clamp(20px,5vw,72px)]",
        width === 1280 ? "max-w-[1280px]" : "max-w-[880px]",
        className,
      )}
      style={{ scrollMarginTop: "32px" }}
    >
      {children}
    </section>
  );
}
