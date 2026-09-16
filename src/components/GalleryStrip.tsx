"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { GalleryTile } from "@/content/gallery";
import { cx } from "./ui";

/**
 * A full-width strip of shots that loops without end and moves sideways
 * on wheel, trackpad, drag, swipe or arrow keys. While it is moving the
 * tiles lean into the direction of travel and settle when it stops.
 *
 * The strip holds three copies of the row; the track is kept within one
 * copy's width, so wrapping is invisible. Motion runs outside React state:
 * position, velocity and lean live in refs and are written straight to the
 * track's style each frame. Only the cursor label is React state.
 */

/** Copies of the row on the track; three covers any viewport twice over. */
const COPIES = 3;
/** Wheel deltas are scaled to velocity in px per frame. */
const WHEEL_GAIN = 0.32;
/** Fraction of velocity kept each frame after release; the glide. */
const FRICTION = 0.93;
/** Arrow keys nudge by this many px per frame of velocity. */
const KEY_KICK = 26;
/** Lean is velocity times this, in degrees, clamped to LEAN_MAX. */
const LEAN_GAIN = 0.55;
const LEAN_MAX = 14;
/** Fraction of the way to the target lean covered each frame. */
const LEAN_EASE = 0.14;

type Label = { text: string; x: number; y: number } | null;

export function GalleryStrip({ tiles }: { tiles: GalleryTile[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  const pos = useRef(0);
  const vel = useRef(0);
  const lean = useRef(0);
  const setWidth = useRef(0);
  const raf = useRef<number | null>(null);
  /** The frame function, reached through a ref so it can reschedule itself. */
  const frame = useRef<() => void>(() => {});
  const drag = useRef<{ id: number; x: number; t: number; v: number; moved: boolean } | null>(null);
  const reduceMotion = useRef(false);

  const [label, setLabel] = useState<Label>(null);
  const [dragging, setDragging] = useState(false);

  const paint = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const w = setWidth.current;
    // Keep the position inside one copy so the loop never runs out of tiles.
    if (w > 0) {
      if (pos.current <= -w) pos.current += w;
      if (pos.current > 0) pos.current -= w;
    }
    track.style.transform = `translate3d(${pos.current}px, 0, 0)`;
    track.style.setProperty("--lean", `${lean.current.toFixed(3)}deg`);
  }, []);

  /** Runs the glide and the lean until both have settled. */
  const tick = useCallback(() => {
    raf.current = null;
    const dragging = !!drag.current;
    if (!dragging) {
      pos.current += vel.current;
      vel.current *= FRICTION;
      if (Math.abs(vel.current) < 0.05) vel.current = 0;
    }
    const target = reduceMotion.current
      ? 0
      : Math.max(-LEAN_MAX, Math.min(LEAN_MAX, -(dragging ? drag.current!.v : vel.current) * LEAN_GAIN));
    lean.current += (target - lean.current) * LEAN_EASE;
    if (Math.abs(lean.current) < 0.02) lean.current = 0;
    paint();
    if (dragging || vel.current !== 0 || lean.current !== 0) {
      raf.current = requestAnimationFrame(() => frame.current());
    }
  }, [paint]);

  useEffect(() => {
    frame.current = tick;
  }, [tick]);

  const wake = useCallback(() => {
    if (raf.current === null) raf.current = requestAnimationFrame(() => frame.current());
  }, []);

  const measure = useCallback(() => {
    const set = setRef.current;
    if (!set) return;
    const gap = parseFloat(getComputedStyle(set).columnGap || "0");
    setWidth.current = set.offsetWidth + gap;
    paint();
  }, [paint]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reduceMotion.current = mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (setRef.current) ro.observe(setRef.current);
    return () => {
      ro.disconnect();
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [measure]);

  // Wheel needs a non-passive listener: the page has nowhere to scroll, and
  // an unhandled sideways swipe on a trackpad would trigger browser back.
  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (reduceMotion.current) {
        pos.current -= delta;
        paint();
        return;
      }
      vel.current = Math.max(-90, Math.min(90, vel.current - delta * WHEEL_GAIN));
      wake();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [paint, wake]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // The pointer is already gone; the move and up handlers still run.
    }
    drag.current = { id: e.pointerId, x: e.clientX, t: performance.now(), v: 0, moved: false };
    vel.current = 0;
    setDragging(true);
    wake();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") {
      const tile = (e.target as Element).closest<HTMLElement>("[data-tile]");
      setLabel(tile ? { text: tile.dataset.tile ?? "", x: e.clientX, y: e.clientY } : null);
    }
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const now = performance.now();
    const dx = e.clientX - d.x;
    const dt = Math.max(1, now - d.t);
    // Velocity in px per frame, from the last movement, so release glides.
    d.v = (dx / dt) * 16.7;
    d.x = e.clientX;
    d.t = now;
    if (Math.abs(dx) > 2) d.moved = true;
    pos.current += dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    vel.current = Math.max(-90, Math.min(90, d.v));
    drag.current = null;
    setDragging(false);
    wake();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? -1 : 1;
      if (reduceMotion.current) {
        pos.current += dir * 160;
        paint();
      } else {
        vel.current = Math.max(-90, Math.min(90, vel.current + dir * KEY_KICK));
        wake();
      }
    }
  };

  const total = tiles.length;

  return (
    <div
      ref={regionRef}
      role="region"
      aria-label="Gallery. Scroll sideways, drag, or use the arrow keys."
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      onPointerLeave={() => setLabel(null)}
      onKeyDown={onKeyDown}
      className={cx(
        "gallery-strip relative w-full select-none overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ink/40",
        dragging ? "cursor-grabbing" : "cursor-grab",
      )}
      style={{ touchAction: "pan-y" }}
    >
      <div ref={trackRef} className="flex w-max items-start gap-[clamp(12px,1.6vw,22px)] will-change-transform">
        {Array.from({ length: COPIES }, (_, copy) => (
          <div
            key={copy}
            ref={copy === 0 ? setRef : undefined}
            aria-hidden={copy > 0 || undefined}
            className="flex shrink-0 items-start gap-[clamp(12px,1.6vw,22px)]"
          >
            {tiles.map((tile, i) => (
              <figure
                key={`${copy}-${tile.id}`}
                data-tile={`${tile.caption}, ${i + 1} of ${total}`}
                className="m-0 shrink-0"
              >
                <div
                  className="gallery-tile relative overflow-hidden rounded-[18px] bg-tile"
                  style={{ height: "var(--tile-h)", aspectRatio: tile.ratio.replace("/", " / ") }}
                >
                  {tile.image.src ? (
                    <Image
                      src={tile.image.src}
                      alt={copy === 0 ? tile.image.alt : ""}
                      fill
                      draggable={false}
                      priority={copy === 0 && i < 4}
                      unoptimized={tile.image.src.endsWith(".gif")}
                      sizes="(max-width: 768px) 70vw, 45vw"
                      className="pointer-events-none object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center p-4 text-center text-[12px] text-faint">
                      {tile.image.placeholder}
                    </span>
                  )}
                </div>
                <figcaption className="mt-3 px-1 text-[13px] leading-[1.4]">
                  <div className="font-medium tracking-[-0.01em] text-ink">{tile.caption}</div>
                  <div className="text-muted">{tile.meta}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>

      {label && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-40 -translate-x-1/2 -translate-y-[calc(100%+14px)] whitespace-nowrap rounded-full bg-ink px-3 py-[6px] text-[12px] font-medium leading-none text-canvas shadow-lift"
          style={{ left: label.x, top: label.y }}
        >
          {label.text}
        </div>
      )}
    </div>
  );
}
