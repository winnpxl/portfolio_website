/**
 * Nav data, kept out of Nav.tsx: that file is a client component, and a
 * function exported from a client module becomes a client reference a
 * server page cannot call. caseStudyNav() is called from one.
 */
export type NavItem =
  | {
      kind: "link";
      label: string;
      href: string;
      active?: boolean;
      strong?: boolean;
      /** Hidden from the desktop row, kept in the mobile panel. The
       *  deep-link sections stay reachable on a phone without crowding
       *  the top of a wide screen. */
      mobileOnly?: boolean;
    }
  | { kind: "current"; label: string };

export type Social = {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "mail";
};

export const homeNav: NavItem[] = [
  { kind: "link", label: "Home", href: "/", active: true },
  { kind: "link", label: "Work", href: "/#work" },
  { kind: "link", label: "Process", href: "/#process", mobileOnly: true },
  { kind: "link", label: "About", href: "/about" },
  { kind: "link", label: "Side projects", href: "/#side", mobileOnly: true },
  { kind: "link", label: "Gallery", href: "/gallery" },
  { kind: "link", label: "Contact", href: "/#contact" },
];

export const aboutNav: NavItem[] = [
  { kind: "link", label: "← Home", href: "/", strong: true },
  { kind: "current", label: "About" },
  { kind: "link", label: "Work", href: "/#work" },
  { kind: "link", label: "Gallery", href: "/gallery" },
  { kind: "link", label: "Contact", href: "/#contact" },
];

export const caseStudyNav = (label: string): NavItem[] => [
  { kind: "link", label: "← All work", href: "/#work", strong: true },
  { kind: "current", label },
  { kind: "link", label: "About", href: "/about" },
  { kind: "link", label: "Gallery", href: "/gallery" },
  { kind: "link", label: "Contact", href: "/#contact" },
];

export const galleryNav: NavItem[] = [
  { kind: "link", label: "← Home", href: "/", strong: true },
  { kind: "current", label: "Gallery" },
  { kind: "link", label: "Work", href: "/#work" },
  { kind: "link", label: "About", href: "/about" },
  { kind: "link", label: "Contact", href: "/#contact" },
];
