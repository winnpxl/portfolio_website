"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

import type { NavItem } from "./navItems";
import { cx } from "./ui";

function Item({
  item,
  stacked,
  onNavigate,
}: {
  item: NavItem;
  stacked?: boolean;
  onNavigate?: () => void;
}) {
  if (item.kind === "brand") {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className="text-[15px] font-bold lowercase tracking-[-0.011em]"
      >
        samuel winner
      </Link>
    );
  }

  if (item.kind === "current") {
    return (
      <span
        aria-current="page"
        className={cx(
          "font-medium text-ash-gray",
          stacked ? "py-[10px] text-[15px]" : "text-[14px]",
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
          "rounded-[12px] bg-ink-black font-semibold text-parchment-cream hover:bg-charcoal-stone",
          stacked ? "px-5 py-[10px] text-[15px]" : "px-4 py-[8px] text-[14px]",
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
        "text-charcoal-stone hover:text-ink-black",
        item.strong ? "font-semibold" : "font-normal",
        stacked ? "py-[10px] text-[15px]" : "text-[14px]",
      )}
    >
      {item.label}
    </Link>
  );
}

/**
 * Floating top bar. Below md it keeps only the lead item plus a
 * Menu / Close toggle; the rest move into a panel underneath.
 */
export function Nav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const [lead, ...rest] = items;

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
    <div className="sticky top-3 z-40 flex justify-center px-[clamp(16px,4vw,32px)] pt-3">
      <nav
        className={cx(
          "flex w-full max-w-[1120px] flex-wrap items-center gap-6 bg-paper-white/85 px-4 py-[10px] shadow-subtle backdrop-blur-md",
          open ? "rounded-[16px]" : "rounded-[12px]",
        )}
      >
        <div className="flex w-full items-center justify-between gap-3 md:contents">
          <Item item={lead} onNavigate={close} />
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
            className="rounded-[12px] border border-sand-gray bg-paper-white px-4 py-[6px] text-[14px] font-medium hover:bg-linen-beige md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        {/* Inline items, md and up. The CTA pushes to the right. */}
        <div className="hidden items-center gap-6 md:ml-auto md:flex">
          {rest.map((item, i) => (
            <Item key={i} item={item} />
          ))}
        </div>

        {open && (
          <div
            id={panelId}
            className="mt-2 flex w-full flex-col items-start gap-1 border-t border-sand-gray pt-3 md:hidden"
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
