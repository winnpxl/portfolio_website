"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cx } from "./ui";

type Toast = { id: number; project: string; leaving: boolean };

/** How long the toast stays, and how long it waits again after a hover. */
const VISIBLE_MS = 4200;
const RESUME_MS = 2000;
/** Matches the toast-out animation in globals.css. */
const EXIT_MS = 160;

/**
 * The site's toast, for projects whose case study is not written yet.
 * Anything carrying data-unavailable="Project name" raises it when clicked,
 * through one delegated listener, so the server components that render
 * thumbnails and buttons stay server components. It works the way
 * data-sound does.
 *
 * The live region is always mounted, so screen readers announce the
 * message when it appears. It pauses while hovered and Escape dismisses it.
 */
export function Toaster() {
  const [toast, setToast] = useState<Toast | null>(null);
  const hideTimer = useRef<number | undefined>(undefined);
  const exitTimer = useRef<number | undefined>(undefined);

  const dismiss = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    window.clearTimeout(exitTimer.current);
    setToast((t) => (t ? { ...t, leaving: true } : t));
    exitTimer.current = window.setTimeout(() => setToast(null), EXIT_MS);
  }, []);

  const hideAfter = useCallback(
    (ms: number) => {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(dismiss, ms);
    },
    [dismiss],
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el =
        e.target instanceof Element ? e.target.closest<HTMLElement>("[data-unavailable]") : null;
      if (!el) return;
      e.preventDefault();
      window.clearTimeout(exitTimer.current);
      // A fresh id replays the entrance, so a repeat click still reads as a response.
      setToast({ id: Date.now(), project: el.dataset.unavailable || "This project", leaving: false });
      hideAfter(VISIBLE_MS);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [hideAfter]);

  useEffect(() => {
    const hide = hideTimer;
    const exit = exitTimer;
    return () => {
      window.clearTimeout(hide.current);
      window.clearTimeout(exit.current);
    };
  }, []);

  useEffect(() => {
    if (!toast || toast.leaving) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [toast, dismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(20px,env(safe-area-inset-bottom))]"
    >
      {toast && (
        <div
          key={toast.id}
          onMouseEnter={() => window.clearTimeout(hideTimer.current)}
          onMouseLeave={() => {
            if (!toast.leaving) hideAfter(RESUME_MS);
          }}
          className={cx(
            "pointer-events-auto flex w-full max-w-[26rem] items-start gap-3 rounded-[20px] bg-ink py-3.5 pl-4 pr-3 text-canvas shadow-lift",
            toast.leaving ? "toast-out" : "toast-in",
          )}
        >
          {/* The hollow in-progress dot used on unshipped case study chapters. */}
          <span
            aria-hidden
            className="mt-[5px] inline-block h-[8px] w-[8px] shrink-0 rounded-full border-[1.5px] border-canvas/70"
          />
          <div className="min-w-0 flex-1">
            <p className="m-0 text-[14px] font-medium leading-[1.35] tracking-[-0.01em]">
              {toast.project} case study is under construction
            </p>
            <p className="m-0 mt-1 text-[13px] leading-[1.35] text-canvas/60">Check back later.</p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="-my-0.5 grid h-6 w-6 shrink-0 cursor-pointer place-items-center rounded-full text-canvas/60 transition-colors hover:bg-canvas/10 hover:text-canvas"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
