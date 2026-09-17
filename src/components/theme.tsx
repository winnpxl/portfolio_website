"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

import { cx } from "./ui";

/*
 * Light and dark. The palette in globals.css follows the device unless
 * `data-theme` says otherwise, so the only state kept here is the
 * visitor's explicit choice: "light", "dark", or nothing at all.
 */

const KEY = "sw:theme";

/**
 * Applies a stored choice before the first paint, so a visitor who picked
 * the theme opposite to their device never sees the wrong one flash.
 * Rendered as a plain script in the document head.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("${KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;}catch(e){}})();`;

/** What the page is actually showing, choice or device. */
function current(): "light" | "dark" {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Flips between light and dark. Before anything is chosen it shows the
 * device's theme and offers the other one; a choice sticks in this
 * browser until the visitor flips it back.
 */
export function ThemeToggle({ className }: { className?: string }) {
  // Watches both sources the palette follows: the device preference, and
  // the data-theme attribute the toggle writes.
  const subscribe = useCallback((onChange: () => void) => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    query.addEventListener("change", onChange);
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      query.removeEventListener("change", onChange);
      observer.disconnect();
    };
  }, []);

  // The server cannot know the device's theme; the client corrects it on
  // hydration, before anyone can click.
  const theme = useSyncExternalStore(subscribe, current, () => "light" as const);

  const toggle = () => {
    const next = current() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // Storage unavailable: the choice still holds for this page.
    }
  };

  const label = theme === "dark" ? "Switch to the light theme" : "Switch to the dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      data-sound
      aria-label={label}
      title={label}
      className={cx("text-ink-soft transition-colors hover:text-ink", className)}
    >
      <ThemeIcon dark={theme === "dark"} />
    </button>
  );
}

/**
 * Sun and moon in the nav's icon system: one 18px box, the glyph sized
 * by eye so it reads the same weight as the social icons beside it.
 */
function ThemeIcon({ dark }: { dark: boolean }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  } as const;

  if (dark) {
    return (
      <svg {...common} viewBox="-1 -1 26 26" fill="currentColor">
        <path d="M21.4 13.6A9.5 9.5 0 1 1 10.4 2.6a7.7 7.7 0 0 0 11 11z" />
      </svg>
    );
  }
  return (
    <svg {...common} viewBox="-1.5 -1.5 27 27" fill="currentColor">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 0.6a1.1 1.1 0 0 1 1.1 1.1v2a1.1 1.1 0 0 1-2.2 0v-2A1.1 1.1 0 0 1 12 .6zm0 18.6a1.1 1.1 0 0 1 1.1 1.1v2a1.1 1.1 0 0 1-2.2 0v-2a1.1 1.1 0 0 1 1.1-1.1zM23.4 12a1.1 1.1 0 0 1-1.1 1.1h-2a1.1 1.1 0 0 1 0-2.2h2a1.1 1.1 0 0 1 1.1 1.1zM4.8 12a1.1 1.1 0 0 1-1.1 1.1h-2a1.1 1.1 0 1 1 0-2.2h2A1.1 1.1 0 0 1 4.8 12zM20.06 3.94a1.1 1.1 0 0 1 0 1.56l-1.42 1.42a1.1 1.1 0 0 1-1.56-1.56l1.42-1.42a1.1 1.1 0 0 1 1.56 0zM6.92 17.08a1.1 1.1 0 0 1 0 1.56L5.5 20.06a1.1 1.1 0 0 1-1.56-1.56l1.42-1.42a1.1 1.1 0 0 1 1.56 0zm13.14 1.56a1.1 1.1 0 0 1-1.56 1.42l-1.42-1.42a1.1 1.1 0 0 1 1.56-1.56l1.42 1.56zM6.92 6.92A1.1 1.1 0 0 1 5.36 8.34L3.94 6.92A1.1 1.1 0 0 1 5.5 5.36l1.42 1.56z" />
    </svg>
  );
}

/**
 * Live values of colour tokens, for canvases that cannot use CSS. The
 * ref is filled on mount and refreshed whenever the theme changes, so a
 * drawing loop can read it every frame for nothing.
 */
export function useThemeColors<T extends Record<string, string>>(tokens: T) {
  const colors = useRef<Record<keyof T, string>>({ ...tokens });

  useEffect(() => {
    const read = () => {
      const style = getComputedStyle(document.documentElement);
      for (const name of Object.keys(tokens) as (keyof T)[]) {
        const value = style.getPropertyValue(tokens[name]).trim();
        if (value) colors.current[name] = value;
      }
    };
    read();

    const query = window.matchMedia("(prefers-color-scheme: dark)");
    query.addEventListener("change", read);
    // The toggle writes data-theme, which no media query reports.
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      query.removeEventListener("change", read);
      observer.disconnect();
    };
    // The token map is a literal at every call site, so it never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return colors;
}
