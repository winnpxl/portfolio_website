/**
 * Nav data, kept out of Nav.tsx: that file is a client component, and a
 * function exported from a client module becomes a client reference a
 * server page cannot call. caseStudyNav() is called from one.
 */
export type NavItem =
  | { kind: "link"; label: string; href: string; active?: boolean; strong?: boolean }
  | { kind: "current"; label: string };

export type Social = {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "mail";
};

export const homeNav: NavItem[] = [
  { kind: "link", label: "Home", href: "/", active: true },
  { kind: "link", label: "Work", href: "/#work" },
  { kind: "link", label: "Process", href: "/#process" },
  { kind: "link", label: "About", href: "/#about" },
  { kind: "link", label: "Side projects", href: "/#side" },
  { kind: "link", label: "Gallery", href: "/gallery" },
  { kind: "link", label: "Contact", href: "/#contact" },
];

export const caseStudyNav = (label: string): NavItem[] => [
  { kind: "link", label: "← All work", href: "/#work", strong: true },
  { kind: "current", label },
  { kind: "link", label: "Gallery", href: "/gallery" },
  { kind: "link", label: "Contact", href: "/#contact" },
];

export const galleryNav: NavItem[] = [
  { kind: "link", label: "← Home", href: "/", strong: true },
  { kind: "current", label: "Gallery" },
  { kind: "link", label: "Work", href: "/#work" },
  { kind: "link", label: "Contact", href: "/#contact" },
];
