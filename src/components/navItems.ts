/**
 * Nav data, deliberately kept out of Nav.tsx.
 *
 * Nav.tsx is a client component, and a function exported from a client
 * module becomes a client reference that server components cannot call.
 * caseStudyNav() is called from a server page, so it lives here.
 */
export type NavItem =
  | { kind: "brand"; href: string }
  | { kind: "link"; label: string; href: string; strong?: boolean }
  | { kind: "current"; label: string }
  | { kind: "cta"; label: string; href: string };

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
