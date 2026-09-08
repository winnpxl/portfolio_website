import type { ReactNode } from "react";

import { cx } from "./ui";

/** Pink ruled ground + page gutter, shared by all three routes. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="page-grid min-h-screen px-[clamp(16px,4vw,48px)]">
      {children}
    </div>
  );
}

/**
 * Centred content column. 1180px on home and gallery, 1040px on the
 * case study.
 */
export function Section({
  children,
  id,
  width = 1180,
  className,
}: {
  children: ReactNode;
  id?: string;
  width?: 1180 | 1040;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cx(
        "mx-auto",
        width === 1180 ? "max-w-[1180px]" : "max-w-[1040px]",
        className,
      )}
      style={{ scrollMarginTop: "88px" }}
    >
      {children}
    </section>
  );
}
