"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";

import { cx } from "./ui";

type Kind = "hover" | "click";

type SoundApi = {
  enabled: boolean;
  toggle: () => void;
  /** False during SSR and the hydration render, true once the real
   *  preference is known. */
  ready: boolean;
};

const SoundContext = createContext<SoundApi | null>(null);

const STORAGE_KEY = "sw:sound";

/**
 * Two short, quiet voices, synthesised rather than loaded: hover is a
 * light tick, click a slightly fuller one. Gains are deliberately low;
 * this should sit under the interface, not announce itself.
 */
const VOICES: Record<
  Kind,
  { from: number; to: number; dur: number; gain: number; type: OscillatorType }
> = {
  hover: { from: 1180, to: 880, dur: 0.05, gain: 0.03, type: "sine" },
  click: { from: 660, to: 330, dur: 0.1, gain: 0.055, type: "triangle" },
};

/** Ignore repeat hovers closer together than this, in milliseconds. */
const MIN_GAP = 55;

/* ------------------------------------------------------------------ */
/* Preference store.                                                   */
/*                                                                     */
/* The preference lives in localStorage, which does not exist on the   */
/* server. useSyncExternalStore is the sanctioned way to bridge that:  */
/* the server snapshot renders first, then React swaps in the client   */
/* one, with no hydration mismatch and no setState in an effect.       */
/* ------------------------------------------------------------------ */

type State = { enabled: boolean; ready: boolean };

const SERVER_STATE: State = { enabled: true, ready: false };
let state: State = SERVER_STATE;
let initialised = false;
const listeners = new Set<() => void>();

function readPreference(): boolean {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === "on";
    // Reduced-motion is the closest signal the platform offers for "keep
    // the interface quiet", so it sets the default when the visitor has
    // expressed no preference of their own.
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    // Private mode can throw on access; sound stays on.
    return true;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Must return a stable reference between changes or React will loop. */
function getSnapshot(): State {
  if (!initialised) {
    initialised = true;
    state = { enabled: readPreference(), ready: true };
  }
  return state;
}

function getServerSnapshot(): State {
  return SERVER_STATE;
}

function setEnabled(next: boolean) {
  state = { enabled: next, ready: true };
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    // Nothing to do; the preference just will not persist.
  }
  listeners.forEach((l) => l());
}

/* ------------------------------------------------------------------ */

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const { enabled, ready } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const lastElRef = useRef<Element | null>(null);
  const lastAtRef = useRef(0);

  /**
   * Browsers refuse to start an AudioContext before a user gesture, so
   * this is called from the first pointerdown or keydown as well as from
   * playback itself.
   */
  const ensureCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 1;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (kind: Kind) => {
      if (!enabled) return;
      const ctx = ensureCtx();
      const master = masterRef.current;
      // Still suspended means no gesture yet; staying silent is correct.
      if (!ctx || !master || ctx.state !== "running") return;

      const v = VOICES[kind];
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lp = ctx.createBiquadFilter();

      lp.type = "lowpass";
      lp.frequency.value = 5200;
      osc.type = v.type;
      osc.frequency.setValueAtTime(v.from, t);
      osc.frequency.exponentialRampToValueAtTime(v.to, t + v.dur);
      // Exponential ramps cannot touch zero, hence the small floor.
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(v.gain, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + v.dur);

      osc.connect(lp);
      lp.connect(gain);
      gain.connect(master);
      osc.start(t);
      osc.stop(t + v.dur + 0.02);
      osc.onended = () => {
        osc.disconnect();
        lp.disconnect();
        gain.disconnect();
      };
    },
    [enabled, ensureCtx],
  );

  /**
   * One delegated listener rather than handlers on every element, so no
   * server component has to become a client one to make a sound. Anything
   * carrying data-sound participates.
   */
  useEffect(() => {
    if (!ready) return;

    const target = (node: EventTarget | null) =>
      node instanceof Element ? node.closest("[data-sound]") : null;

    const onGesture = () => {
      if (enabled) ensureCtx();
    };

    const onOver = (e: PointerEvent) => {
      // Touch fires pointerover on tap, which would double up with click.
      if (!window.matchMedia("(pointer: fine)").matches) return;
      const el = target(e.target);
      if (!el || el === lastElRef.current) return;
      lastElRef.current = el;
      const now = performance.now();
      if (now - lastAtRef.current < MIN_GAP) return;
      lastAtRef.current = now;
      play("hover");
    };

    const onOut = (e: PointerEvent) => {
      const from = target(e.target);
      const to = target(e.relatedTarget);
      // Only forget the element when the pointer truly leaves it, so
      // moving across its own children does not retrigger.
      if (from && from !== to) lastElRef.current = null;
    };

    const onClick = (e: MouseEvent) => {
      if (target(e.target)) play("click");
    };

    document.addEventListener("pointerdown", onGesture, { passive: true });
    document.addEventListener("keydown", onGesture);
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerdown", onGesture);
      document.removeEventListener("keydown", onGesture);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("click", onClick);
    };
  }, [ready, enabled, play, ensureCtx]);

  const api = useMemo<SoundApi>(
    () => ({ enabled, ready, toggle: () => setEnabled(!enabled) }),
    [enabled, ready],
  );

  return <SoundContext.Provider value={api}>{children}</SoundContext.Provider>;
}

/** Speaker, with waves when on and a cross when off. */
function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6.5 9H3v6h3.5L11 19z" />
      {on ? (
        <>
          <path d="M15.4 9.2a4 4 0 0 1 0 5.6" />
          <path d="M18.2 6.4a8 8 0 0 1 0 11.2" />
        </>
      ) : (
        <path d="m16 10 5 4m0-4-5 4" />
      )}
    </svg>
  );
}

export function SoundToggle({ className }: { className?: string }) {
  const api = useContext(SoundContext);
  if (!api) return null;
  const { enabled, ready } = api;
  const label = enabled ? "Turn interface sound off" : "Turn interface sound on";
  return (
    <button
      type="button"
      onClick={api.toggle}
      aria-pressed={ready ? enabled : undefined}
      aria-label={label}
      title={label}
      className={cx(
        "transition-colors hover:text-ink",
        enabled ? "text-ink-soft" : "text-faint",
        className,
      )}
    >
      <SpeakerIcon on={enabled} />
    </button>
  );
}
