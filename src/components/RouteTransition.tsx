"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";

type Phase = "idle" | "cover" | "reveal";

// Include the final slat's stagger time so the next route never peeks through
// before the curtain has completely closed.
const CLOSE_MS = 700;
const OPEN_MS = 780;
const PANEL_COUNT = 9;

/**
 * A persistent route curtain. It catches ordinary same-origin links, closes
 * over the current page, lets Next swap the route beneath it, then opens.
 * Keeping it in the root layout makes the cover continuous across routes.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const routeKey = pathname;
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const routeRef = useRef(routeKey);
  const closeTimer = useRef<number | undefined>(undefined);
  const openTimer = useRef<number | undefined>(undefined);

  const setTransitionPhase = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  useEffect(() => {
    if (phaseRef.current !== "cover") {
      // Browser back/forward does not use our curtain, but still changes the
      // baseline used to detect the next programmatic route change.
      routeRef.current = routeKey;
      return;
    }
    if (routeKey === routeRef.current) return;

    routeRef.current = routeKey;
    // Start the opening frame only after the new page has committed behind it.
    requestAnimationFrame(() => {
      setTransitionPhase("reveal");
      openTimer.current = window.setTimeout(() => setTransitionPhase("idle"), OPEN_MS);
    });
  }, [routeKey]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target || link.hasAttribute("download")) return;

      const destination = new URL(link.href, window.location.href);
      const current = new URL(window.location.href);
      const isInternal = destination.origin === current.origin &&
        (destination.protocol === "http:" || destination.protocol === "https:");
      // Query-only changes stay immediate: this curtain is for page switches,
      // while filters and other in-place URL state should remain responsive.
      const changesRoute = destination.pathname !== current.pathname;
      if (!isInternal || !changesRoute) return;

      // While the curtain is active, ignore follow-up clicks instead of
      // allowing a second route change underneath the first one.
      event.preventDefault();
      if (phaseRef.current !== "idle") return;

      setTransitionPhase("cover");
      closeTimer.current = window.setTimeout(() => {
        router.push(`${destination.pathname}${destination.search}${destination.hash}`);
      }, CLOSE_MS);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(closeTimer.current);
      window.clearTimeout(openTimer.current);
    };
  }, [router]);

  return (
    <>
      {children}
      {phase !== "idle" && (
        <div className={`route-blinds route-blinds--${phase}`} aria-hidden="true">
          {Array.from({ length: PANEL_COUNT }, (_, index) => (
            <span key={index} style={{ "--blind-index": index } as React.CSSProperties} />
          ))}
        </div>
      )}
    </>
  );
}
