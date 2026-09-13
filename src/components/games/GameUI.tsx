"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";

import { cx } from "@/components/ui";

import { addScore, clearScores, getSavedName, useScores, type GameId } from "./leaderboard";

/** Light for Tetris, dark for Space Invaders. */
export type Tone = "light" | "dark";

export type Control = { keys: readonly string[]; label: string };

const panel: Record<Tone, string> = {
  light: "border-arcade-ink bg-surface",
  dark: "border-space-line bg-space-panel",
};

export function ArcadePanel({
  tone,
  className,
  children,
}: {
  tone: Tone;
  className?: string;
  children: ReactNode;
}) {
  return <div className={cx("rounded-[20px] border-[3px]", panel[tone], className)}>{children}</div>;
}

export function PanelLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("text-[11px] font-semibold uppercase tracking-[0.14em] text-muted", className)}>
      {children}
    </div>
  );
}

/** Chunky button with a pressed-in bottom edge, in the arcade style. */
export function ArcadeButton({
  children,
  onClick,
  tone,
  variant = "primary",
  type = "button",
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone: Tone;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  className?: string;
}) {
  const look =
    variant === "primary"
      ? "border-arcade-ink bg-arcade-yellow text-arcade-ink hover:bg-arcade-yellow-soft"
      : tone === "light"
        ? "border-arcade-ink bg-surface text-arcade-ink hover:bg-canvas"
        : "border-space-line bg-space text-ink hover:bg-space-panel";
  return (
    <button
      type={type}
      onClick={onClick}
      data-sound
      className={cx(
        "inline-flex items-center justify-center rounded-[14px] border-[3px] px-5 py-2.5 text-[15px] font-semibold",
        "shadow-[inset_0_-4px_0_rgb(0_0_0/0.14)] transition-transform active:translate-y-px active:shadow-[inset_0_-2px_0_rgb(0_0_0/0.14)]",
        look,
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Key({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <kbd
      className={cx(
        "inline-flex h-7 min-w-7 items-center justify-center rounded-[8px] border-2 px-1.5 font-sans text-[12px] font-semibold leading-none",
        tone === "light"
          ? "border-arcade-ink bg-surface text-arcade-ink shadow-[inset_0_-3px_0_var(--color-line)]"
          : "border-space-line bg-space text-ink shadow-[inset_0_-3px_0_var(--color-space-line)]",
      )}
    >
      {children}
    </kbd>
  );
}

/** The canvas frame, with an optional overlay card laid over the board. */
export function BoardFrame({
  tone,
  overlay,
  children,
}: {
  tone: Tone;
  overlay?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <div
        className={cx(
          "overflow-hidden rounded-[22px] border-[3px] p-1.5",
          tone === "light" ? "border-arcade-ink bg-white" : "border-space-line bg-space",
        )}
      >
        {children}
      </div>
      {overlay && (
        <div
          className={cx(
            "absolute inset-0 z-10 grid place-items-center rounded-[22px] p-4 backdrop-blur-[2px]",
            tone === "light" ? "bg-white/55" : "bg-space/60",
          )}
        >
          {overlay}
        </div>
      )}
    </div>
  );
}

export function OverlayCard({
  tone,
  eyebrow,
  title,
  children,
}: {
  tone: Tone;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div aria-live="polite" className={cx("w-full max-w-[290px] rounded-[18px] border-[3px] p-5 text-center", panel[tone])}>
      <PanelLabel>{eyebrow}</PanelLabel>
      <div className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.02em] tabular-nums">{title}</div>
      {children}
    </div>
  );
}

export function StatGrid({ tone, stats }: { tone: Tone; stats: { label: string; value: ReactNode }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <ArcadePanel key={stat.label} tone={tone} className="px-4 py-3">
          <PanelLabel>{stat.label}</PanelLabel>
          <div className="mt-1.5 text-[22px] font-semibold leading-none tracking-[-0.02em] tabular-nums">
            {stat.value}
          </div>
        </ArcadePanel>
      ))}
    </div>
  );
}

export function Controls({ tone, items }: { tone: Tone; items: readonly Control[] }) {
  return (
    <ArcadePanel tone={tone} className="p-5">
      <PanelLabel>How to play</PanelLabel>
      <ul className="m-0 mt-4 grid list-none gap-2.5 p-0">
        {items.map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-4 text-[14px]">
            <span className="text-ink-soft">{item.label}</span>
            <span className="flex gap-1">
              {item.keys.map((key) => (
                <Key key={key} tone={tone}>
                  {key}
                </Key>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </ArcadePanel>
  );
}

const rankFill = ["bg-arcade-yellow", "bg-arcade-blue", "bg-arcade-orange"];

export function Leaderboard({
  tone,
  game,
  highlightId,
}: {
  tone: Tone;
  game: GameId;
  highlightId?: string | null;
}) {
  const scores = useScores(game);
  const [confirming, setConfirming] = useState(false);

  return (
    <ArcadePanel tone={tone} className="p-5">
      <div className="flex items-baseline justify-between gap-3">
        <PanelLabel>Leaderboard</PanelLabel>
        <span className="text-[12px] text-faint">Saved in this browser</span>
      </div>

      {scores.length === 0 ? (
        <p className="m-0 mt-4 rounded-[14px] border-2 border-dashed border-line px-4 py-6 text-center text-[14px] text-muted">
          No scores yet. Set the first one.
        </p>
      ) : (
        <ol className="m-0 mt-3 list-none p-0">
          {scores.map((entry, i) => (
            <li
              key={entry.id}
              className={cx(
                "grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-3 rounded-[12px] px-2 py-2",
                entry.id === highlightId && (tone === "light" ? "bg-arcade-yellow/30" : "bg-arcade-yellow/15"),
              )}
            >
              <span
                className={cx(
                  "grid size-7 place-items-center rounded-[8px] border-2 text-[12px] font-semibold tabular-nums",
                  i < 3
                    ? cx(rankFill[i], "border-arcade-ink text-arcade-ink")
                    : tone === "light"
                      ? "border-line text-muted"
                      : "border-space-line text-muted",
                )}
              >
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-semibold">{entry.name}</span>
                <span className="block truncate text-[12px] text-muted">{entry.detail}</span>
              </span>
              <span className="text-[15px] font-semibold tabular-nums">{entry.score.toLocaleString("en-US")}</span>
            </li>
          ))}
        </ol>
      )}

      {scores.length > 0 && (
        <div className="mt-3 flex justify-end gap-3 text-[12px]">
          {confirming ? (
            <>
              <button type="button" onClick={() => setConfirming(false)} className="text-muted hover:text-ink">
                Keep them
              </button>
              <button
                type="button"
                onClick={() => {
                  clearScores(game);
                  setConfirming(false);
                }}
                className="font-semibold text-arcade-red"
              >
                Clear all scores
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="text-muted hover:text-ink">
              Clear
            </button>
          )}
        </div>
      )}
    </ArcadePanel>
  );
}

/** Name entry for a score that makes the board. */
export function ScoreForm({
  tone,
  game,
  score,
  detail,
  onSaved,
  onSkip,
}: {
  tone: Tone;
  game: GameId;
  score: number;
  detail: string;
  onSaved: (id: string) => void;
  onSkip: () => void;
}) {
  const id = useId();
  // Only ever mounted after a game ends, so reading storage here is safe.
  const [name, setName] = useState(getSavedName);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSaved(addScore(game, name, score, detail));
  };

  return (
    <form onSubmit={submit} className="mt-4 text-left">
      <label htmlFor={id} className="block text-[12px] font-semibold text-ink-soft">
        You made the leaderboard
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id={id}
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={16}
          placeholder="Your name"
          autoComplete="nickname"
          spellCheck={false}
          className={cx(
            "min-w-0 flex-1 rounded-[12px] border-2 px-3 py-2 text-[15px] font-medium",
            tone === "light"
              ? "border-arcade-ink bg-surface text-arcade-ink placeholder:text-faint"
              : "border-space-line bg-space text-ink placeholder:text-faint",
          )}
        />
        <ArcadeButton tone={tone} type="submit" className="px-4">
          Save
        </ArcadeButton>
      </div>
      <button type="button" onClick={onSkip} className="mt-2 text-[12px] text-muted hover:text-ink">
        Skip
      </button>
    </form>
  );
}

/**
 * Board and live stats side by side, then how to play and the scores.
 *
 * On a touch device the tall stats column and the key legend give way to
 * a compact score strip above the board and a touch pad below it, sized
 * so all three fit on screen together once play starts.
 */
export function GameLayout({
  tone,
  ratio,
  board,
  side,
  mini,
  pad,
  controls,
  game,
  highlightId,
}: {
  tone: Tone;
  ratio: number;
  board: ReactNode;
  side: ReactNode;
  mini: ReactNode;
  pad: ReactNode;
  controls: readonly Control[];
  game: GameId;
  highlightId?: string | null;
}) {
  return (
    <div className="grid gap-5 [--board-min:260px] pointer-coarse:[--board-min:200px]">
      <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_280px] pointer-coarse:md:grid-cols-1">
        <div className="grid gap-3">
          <div className="hidden pointer-coarse:block">{mini}</div>
          {/* 13rem is the nav and title on a desktop, or the score strip and
              pad on a phone once the game has scrolled into view. */}
          <div
            className="mx-auto w-full"
            style={{ maxWidth: `max(var(--board-min), calc((100svh - 13rem) * ${ratio}))` }}
          >
            {board}
          </div>
          <div className="hidden pointer-coarse:block">{pad}</div>
        </div>
        <div className="grid content-start gap-4 pointer-coarse:hidden">{side}</div>
      </div>
      <div className="grid items-start gap-5 md:grid-cols-2 pointer-coarse:md:grid-cols-1">
        <div className="pointer-coarse:hidden">
          <Controls tone={tone} items={controls} />
        </div>
        <Leaderboard tone={tone} game={game} highlightId={highlightId} />
      </div>
    </div>
  );
}

/** The phone-sized stand-in for the stats column. */
export function MiniHud({
  tone,
  score,
  detail,
  children,
}: {
  tone: Tone;
  score: ReactNode;
  detail: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className={cx("flex items-center justify-between gap-3 rounded-[16px] border-[3px] px-3 py-2", panel[tone])}>
      <div className="min-w-0">
        <div className="text-[20px] font-semibold leading-none tracking-[-0.02em] tabular-nums">{score}</div>
        <div className="mt-1 truncate text-[12px] text-muted">{detail}</div>
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  );
}

export function MiniSlot({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid justify-items-center gap-0.5">
      <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
      {children}
    </div>
  );
}

/**
 * Wrapper for on-screen controls. Touching it never scrolls, zooms,
 * selects text or opens the long-press menu, and the first touch unlocks
 * audio, which browsers only allow from a gesture.
 */
export function TouchPad({ onGesture, children }: { onGesture?: () => void; children: ReactNode }) {
  return (
    <div
      role="group"
      aria-label="Touch controls"
      onPointerDownCapture={onGesture}
      className="grid select-none gap-2 [-webkit-touch-callout:none] [touch-action:none]"
    >
      {children}
    </div>
  );
}

/**
 * One arcade button on the touch pad. It fires on touch-down rather than
 * on click, so there is no delay, and reports release too, so holding a
 * direction or fire keeps it going exactly like holding a key.
 */
export function PadButton({
  tone,
  label,
  look = "plain",
  size = "lg",
  onPress,
  onRelease,
  className,
  children,
}: {
  tone: Tone;
  label: string;
  look?: "plain" | "accent" | "primary";
  size?: "lg" | "sm";
  onPress: () => void;
  onRelease?: () => void;
  className?: string;
  children: ReactNode;
}) {
  const [held, setHeld] = useState(false);
  const release = () => {
    setHeld(false);
    onRelease?.();
  };
  const looks = {
    plain: tone === "light" ? "border-arcade-ink bg-surface text-arcade-ink" : "border-space-line bg-space-panel text-ink",
    accent: "border-arcade-ink bg-arcade-blue text-arcade-ink",
    primary: "border-arcade-ink bg-arcade-yellow text-arcade-ink",
  } as const;

  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(e) => {
        e.preventDefault();
        // Keep receiving the release even if the finger slides off.
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // The pointer is already gone; the release handlers still run.
        }
        setHeld(true);
        onPress();
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
      // Assistive tech activates with a click and no pointer: a quick tap.
      onClick={(e) => {
        if (e.detail === 0) {
          onPress();
          onRelease?.();
        }
      }}
      onContextMenu={(e) => e.preventDefault()}
      className={cx(
        "grid shrink-0 place-items-center border-[3px] font-semibold [touch-action:none]",
        size === "lg" ? "h-13 min-w-13 rounded-[16px] px-3 text-[15px]" : "h-9 min-w-9 rounded-[12px] px-3 text-[13px]",
        held ? "translate-y-[2px] shadow-[inset_0_-1px_0_rgb(0_0_0/0.14)]" : "shadow-[inset_0_-4px_0_rgb(0_0_0/0.14)]",
        looks[look],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function PadIcon({ name }: { name: "left" | "right" | "down" | "rotate" | "pause" }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  } as const;
  if (name === "left") return <svg {...common}><path d="M15 5 8 12l7 7" /></svg>;
  if (name === "right") return <svg {...common}><path d="m9 5 7 7-7 7" /></svg>;
  if (name === "down") return <svg {...common}><path d="m5 9 7 7 7-7" /></svg>;
  if (name === "rotate") {
    return (
      <svg {...common}>
        <path d="M20 11a8 8 0 1 1-2.3-5.6" />
        <path d="M20 4v5h-5" />
      </svg>
    );
  }
  return <svg {...common}><path d="M9 6v12M15 6v12" /></svg>;
}

/** The top score on a game card, read from this browser. */
export function BestScore({ game }: { game: GameId }) {
  const top = useScores(game)[0];
  return <span>{top ? `Best ${top.score.toLocaleString("en-US")} by ${top.name}` : "No score yet"}</span>;
}
