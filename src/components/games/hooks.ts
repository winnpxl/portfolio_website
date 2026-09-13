import { useEffect, useRef } from "react";

/**
 * A canvas drawn in fixed logical units and backed at the device pixel
 * ratio, so blocks stay crisp on retina screens. CSS decides the display
 * size; drawing code never has to know it.
 */
export function useHiDpiCanvas(width: number, height: number) {
  const ref = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const apply = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.current = context;
    };
    apply();
    // Dragging the window to a screen with a different density.
    const query = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [width, height]);

  return { ref, ctx };
}

/** Calls tick every frame with the elapsed milliseconds, capped at 50. */
export function useAnimationFrame(tick: (dt: number) => void) {
  const tickRef = useRef(tick);
  useEffect(() => {
    tickRef.current = tick;
  });
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      // A capped step stops a backgrounded tab from teleporting pieces.
      const dt = Math.min(50, now - last);
      last = now;
      tickRef.current(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
}

/**
 * Whether a key press is the game's to handle. Typing in a field never is,
 * shortcuts with a modifier never are, and Enter or Space on a focused
 * button or link belong to that control, so the name form and overlay
 * buttons keep working while the game listens on the window.
 */
export function keyBelongsToGame(e: KeyboardEvent) {
  if (e.metaKey || e.ctrlKey || e.altKey) return false;
  const target = e.target;
  if (!(target instanceof Element)) return true;
  if (target.closest("input, textarea, select, [contenteditable='true']")) return false;
  const activates = e.code === "Enter" || e.code === "NumpadEnter" || e.code === "Space";
  if (activates && target.closest("a, button, summary, [role='button']")) return false;
  return true;
}
