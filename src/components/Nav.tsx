import Link from "next/link";

export type NavItem =
  | { kind: "brand"; href: string }
  | { kind: "link"; label: string; href: string; strong?: boolean }
  | { kind: "current"; label: string }
  | { kind: "cta"; label: string; href: string };

/**
 * Sticky pill nav. Wraps rather than collapsing to a hamburger, which is
 * why there are no media queries anywhere in this build.
 */
export function Nav({ items }: { items: NavItem[] }) {
  return (
    <div className="sticky top-4 z-40 flex justify-center pt-4">
      <nav className="flex max-w-full flex-wrap items-center gap-[clamp(8px,2vw,22px)] rounded-full border-2 border-maroon bg-cream px-[clamp(14px,2vw,22px)] py-[10px] shadow-hard-5">
        {items.map((item, i) => {
          if (item.kind === "brand") {
            return (
              <Link
                key={i}
                href={item.href}
                className="font-display text-[17px] font-extrabold leading-none tracking-[-.01em]"
              >
                SW<span className="text-pink">⚡</span>
              </Link>
            );
          }
          if (item.kind === "current") {
            return (
              <span
                key={i}
                aria-current="page"
                className="text-[14px] font-semibold opacity-60"
              >
                {item.label}
              </span>
            );
          }
          if (item.kind === "cta") {
            return (
              <Link
                key={i}
                href={item.href}
                className="rounded-full bg-maroon px-4 py-[7px] text-[14px] font-semibold text-cream hover:bg-maroon-deep hover:text-cream"
              >
                {item.label}
              </Link>
            );
          }
          return (
            <Link
              key={i}
              href={item.href}
              className={
                item.strong
                  ? "text-[14px] font-bold"
                  : "text-[14px] font-semibold"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export const homeNav: NavItem[] = [
  { kind: "brand", href: "/" },
  { kind: "link", label: "Work", href: "/#work" },
  { kind: "link", label: "Process", href: "/#process" },
  { kind: "link", label: "About", href: "/#about" },
  { kind: "link", label: "Side projects", href: "/#side" },
  { kind: "link", label: "Gallery", href: "/gallery" },
  { kind: "cta", label: "Get in touch", href: "/#contact" },
];

export const caseStudyNav = (label: string): NavItem[] => [
  { kind: "link", label: "← All work", href: "/", strong: true },
  { kind: "current", label },
  { kind: "link", label: "Gallery", href: "/gallery" },
  { kind: "cta", label: "Get in touch", href: "/#contact" },
];

export const galleryNav: NavItem[] = [
  { kind: "link", label: "← Home", href: "/", strong: true },
  { kind: "current", label: "Gallery" },
  { kind: "link", label: "Work", href: "/#work" },
  { kind: "cta", label: "Get in touch", href: "/#contact" },
];
