"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

import { SoundToggle } from "./sound";
import type { NavItem, Social } from "./navItems";
import { cx } from "./ui";

function Icon({ name }: { name: Social["icon"] }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  } as const;
  if (name === "github") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
      </svg>
    );
  }
  if (name === "linkedin") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
      </svg>
    );
  }
  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function Item({
  item,
  stacked,
  onNavigate,
}: {
  item: NavItem;
  stacked?: boolean;
  onNavigate?: () => void;
}) {
  const size = stacked ? "py-[10px] text-[17px]" : "text-[15px]";
  if (item.kind === "current") {
    return (
      <span aria-current="page" className={cx("text-ink", size)}>
        {item.label}
      </span>
    );
  }
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cx(
        "tracking-[-0.01em] transition-colors hover:text-ink",
        item.active ? "text-ink" : "text-muted",
        item.strong && "text-ink",
        size,
      )}
    >
      {item.label}
    </Link>
  );
}

/**
 * Plain top bar in the manner of the references: text links on the left,
 * social icons on the right, no container. Below md the links collapse
 * behind a Menu / Close toggle.
 */
export function Nav({ items, socials = [] }: { items: NavItem[]; socials?: Social[] }) {
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
    <div className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,72px)] pt-[clamp(20px,3vw,32px)]">
      <nav className="flex flex-wrap items-center gap-x-7 gap-y-3">
        <div className="flex w-full items-center justify-between md:contents">
          <Item item={lead} onNavigate={close} />
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
            className="rounded-full border border-line bg-surface px-4 py-[7px] text-[14px] font-medium md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        <div className="hidden items-center gap-7 md:flex">
          {rest.map((item, i) => (
            <Item key={i} item={item} />
          ))}
        </div>

        <div className="ml-auto hidden items-center gap-5 md:flex">
          {socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              aria-label={s.label}
              className="text-ink-soft transition-colors hover:text-ink"
            >
              <Icon name={s.icon} />
            </a>
          ))}
          <SoundToggle />
        </div>

        {open && (
          <div
            id={panelId}
            className="flex w-full flex-col items-start border-t border-line pt-3 md:hidden"
          >
            {rest.map((item, i) => (
              <Item key={i} item={item} stacked onNavigate={close} />
            ))}
            <div className="mt-3 flex items-center gap-5 text-ink-soft">
              {socials.map((s) => (
                <a key={s.href} href={s.href} aria-label={s.label}>
                  <Icon name={s.icon} />
                </a>
              ))}
              <SoundToggle />
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
