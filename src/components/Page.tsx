import { ViewTransition, type ReactNode } from "react";

import { cx } from "./ui";

/**
 * Soft grey canvas, edge to edge. Every page renders one, so it also
 * carries the page transition: on any navigation the old page fades out
 * and the new one eases up into place (see `.page` in globals.css).
 * It lives here rather than in the layout because layouts persist
 * across navigations, so enter and exit would never fire there.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <div className="min-h-screen bg-canvas">{children}</div>
    </ViewTransition>
  );
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
