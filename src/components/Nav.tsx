"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

import type { NavItem } from "./navItems";
import { cx } from "./ui";

/** Gap between inline nav items, shared by the bar and the desktop group. */
const inlineGap = "gap-[clamp(8px,2vw,22px)]";

function Item({
  item,
  stacked,
  onNavigate,
}: {
  item: NavItem;
  /** Stacked items sit in the mobile panel and get larger tap targets. */
  stacked?: boolean;
  onNavigate?: () => void;
}) {
  if (item.kind === "brand") {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className="font-display text-[17px] font-extrabold leading-none tracking-[-.01em]"
      >
        SW<span className="text-pink">⚡</span>
      </Link>
    );
  }

  if (item.kind === "current") {
    return (
      <span
        aria-current="page"
        className={cx(
          "font-semibold opacity-60",
          stacked ? "py-[10px] text-[16px]" : "text-[14px]",
        )}
      >
        {item.label}
      </span>
    );
  }

  if (item.kind === "cta") {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cx(
          "rounded-full bg-maroon font-semibold text-cream hover:bg-maroon-deep hover:text-cream",
          stacked ? "px-5 py-[10px] text-[16px]" : "px-4 py-[7px] text-[14px]",
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cx(
        item.strong ? "font-bold" : "font-semibold",
        // Stacked links carry vertical padding to reach a 44px touch target.
        stacked ? "py-[10px] text-[16px]" : "text-[14px]",
      )}
    >
      {item.label}
    </Link>
  );
}

/**
 * Sticky pill nav.
 *
 * Below md the bar keeps only the lead item (the monogram, or the back link
 * on inner pages) plus a Menu / Close toggle; everything else moves into a
 * panel underneath. Above md every item sits inline, as designed. The
 * prototype simply let seven items wrap, which stacked into four rows at
 * 375px.
 */
export function Nav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const [lead, ...rest] = items;

  // Escape closes the panel, matching the button's own affordance.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="sticky top-4 z-40 flex justify-center pt-4">
      <nav
        className={cx(
          "flex w-full max-w-full flex-wrap items-center border-2 border-maroon bg-cream px-[clamp(14px,2vw,22px)] py-[10px] shadow-hard-5 md:w-auto",
          inlineGap,
          // A tall pill would read as a lozenge, so the radius relaxes while open.
          open ? "rounded-[28px] md:rounded-full" : "rounded-full",
        )}
      >
        {/* Bar: lead item + toggle on mobile; both flatten into the row at md. */}
        <div className="flex w-full items-center justify-between gap-3 md:contents">
          <Item item={lead} onNavigate={close} />
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
            className="rounded-full border-2 border-maroon bg-cream px-[18px] py-[6px] text-[14px] font-bold shadow-hard-4 hover:bg-butter md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        {/* Inline items, md and up. */}
        <div className={cx("hidden items-center md:flex", inlineGap)}>
          {rest.map((item, i) => (
            <Item key={i} item={item} />
          ))}
        </div>

        {/* Panel, below md. */}
        {open && (
          <div
            id={panelId}
            className="mt-3 flex w-full flex-col items-start gap-1 border-t-2 border-maroon pt-3 md:hidden"
          >
            {rest.map((item, i) => (
              <Item key={i} item={item} stacked onNavigate={close} />
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}
