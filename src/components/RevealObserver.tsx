"use client";

import { useEffect } from "react";

/**
 * Marks `[data-reveal]` elements `data-revealed` as they scroll into view,
 * including ones that arrive later with a client-side navigation. Mounted
 * once in the root layout, like the sound and toast listeners.
 */
export function RevealObserver() {
  useEffect(() => {
    // Tells the CSS the observer is running, which switches off its fallback.
    document.documentElement.setAttribute("data-motion-ready", "");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const scan = () => {
      document
        .querySelectorAll("[data-reveal]:not([data-revealed]):not([data-watched])")
        .forEach((el) => {
          el.setAttribute("data-watched", "");
          io.observe(el);
        });
    };
    scan();

    // New pages mount new elements; watch for them without rescanning on every frame.
    let queued = 0;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(queued);
    };
  }, []);

  return null;
}
