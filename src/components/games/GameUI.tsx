"use client";

import { useId, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";

import { cx } from "@/components/ui";

import { useBoard } from "./globalScores";
import { submitScore } from "./globalScores";
import { addScore, clearScores, getSavedName, useScores, type GameId } from "./leaderboard";

/*
 * The game page kit. Quiet white cards with hairline borders carry the
 * information; only the board, its overlay cards and the buttons keep the
 * arcade edge (a dark outline with a hard drop shadow). The grid itself
 * lives in globals.css under `.game-grid`, because its areas rearrange
 * at three widths and on touch devices.
 */

export type Control = { keys: readonly string[]; label: string };

const fmt = (n: number) => n.toLocaleString("en-US");

/* ------------------------------------------------------------- Pieces */

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "m-0 block text-[11px] font-semibold uppercase leading-none tracking-[0.12em] text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A plain information card: label row, then content. */
export function Card({
  label,
  meta,
  className,
  children,
  ...rest
}: {
  label?: string;
  meta?: ReactNode;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  return (
    <section
      {...rest}
      className={cx("flex min-w-0 flex-col rounded-[14px] border border-line bg-surface px-4 pb-4 pt-3.5", className)}
    >
      {(label || meta) && (
        <div className="mb-2.5 flex min-h-[22px] items-center justify-between gap-2">
          {label && <h2 className="m-0"><Label>{label}</Label></h2>}
          {meta && <span className="text-[12px] text-faint">{meta}</span>}
        </div>
      )}
      {children}
    </section>
  );
}

/** A recessed well for previews inside a card. */
export function Slot({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("relative min-h-0 rounded-[10px] bg-canvas", className)}>{children}</div>;
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-grid h-[22px] min-w-[22px] place-items-center rounded-[6px] border border-b-2 border-line bg-surface px-1.5 font-sans text-[11px] font-semibold leading-none text-ink">
      {children}
    </kbd>
  );
}

/** Chunky button with a hard bottom edge that presses in. */
export function Btn({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      data-sound
      className={cx(
        "game-btn inline-flex h-11 items-center justify-center rounded-[12px] border-2 px-[18px] text-[15px] font-semibold leading-none",
        variant === "primary" ? "game-btn-primary" : "bg-surface text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------- Board */

/** The board's frame, with an optional card laid over a dimmed board. */
export function Stage({
  ratio,
  overlay,
  children,
}: {
  /** Board width over height. */
  ratio: number;
  overlay?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={cx("game-stage relative rounded-[18px] border-2 bg-surface p-2.5", overlay ? "is-dim" : false)}
      style={{ "--ratio": ratio } as CSSProperties}
    >
      {children}
      {overlay && <div className="absolute inset-2.5 z-10 grid place-items-center p-3">{overlay}</div>}
    </div>
  );
}

export function OverlayCard({
  label,
  title,
  sub,
  children,
}: {
  label: string;
  /** A headline, or the score in large figures. */
  title: ReactNode;
  sub?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      aria-live="polite"
      className="game-card-edge grid w-full max-w-[260px] gap-3 rounded-[16px] border-2 bg-surface px-4 pb-4 pt-[18px] text-center"
    >
      <Label>{label}</Label>
      <p className="m-0 text-[34px] font-semibold leading-none tracking-[-0.03em] tabular-nums">{title}</p>
      {sub && <p className="m-0 -mt-1 text-[13px] leading-[1.45] text-muted">{sub}</p>}
      {children}
    </div>
  );
}

/** Keys shown on the ready card; hidden on touch devices. */
export function OverlayKeys({ items }: { items: readonly Control[] }) {
  return (
    <ul className="m-0 grid list-none gap-2 border-y border-line px-0 py-2.5 text-left text-[13px] text-muted pointer-coarse:hidden">
      {items.map((item) => (
        <li key={item.label} className="flex items-center justify-between gap-2">
          {item.label}
          <span className="inline-flex gap-1">
            {item.keys.map((k) => (
              <Kbd key={k}>{k}</Kbd>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function OverlayHint({ children }: { children: ReactNode }) {
  return <p className="m-0 -mt-1 text-[12px] text-faint pointer-coarse:hidden">{children}</p>;
}

/* ------------------------------------------------------------- Panels */

/**
 * Score first and large, then three smaller figures, then progress
 * toward the next milestone. On phones it folds into one row of four.
 */
export function StatsCard({
  score,
  items,
  progress,
}: {
  score: number;
  items: { label: string; value: ReactNode }[];
  progress?: { text: string; done: number; total: number };
}) {
  return (
    <Card aria-label="Score" className="game-stats">
      <div className="game-score">
        <Label>Score</Label>
        <output className="mt-2.5 block text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] tabular-nums">
          {fmt(score)}
        </output>
      </div>
      <dl className="game-trio m-0 mt-4 grid grid-cols-3 gap-3 border-t border-line pt-3.5">
        {items.map((item) => (
          <div key={item.label} className="min-w-0">
            <dt>
              <Label>{item.label}</Label>
            </dt>
            <dd className="m-0 mt-2 text-[20px] font-semibold leading-[1.1] tabular-nums">{item.value}</dd>
          </div>
        ))}
      </dl>
      {progress && (
        <div className="game-progress mt-auto pt-[18px]">
          <p className="m-0 mb-2 flex justify-between gap-2 text-[13px] text-muted tabular-nums">
            <span>{progress.text}</span>
            <span>
              {progress.done}/{progress.total}
            </span>
          </p>
          <div
            role="progressbar"
            aria-label={progress.text}
            aria-valuemin={0}
            aria-valuemax={progress.total}
            aria-valuenow={progress.done}
            className="h-2 overflow-hidden rounded-full bg-line"
          >
            <i
              className="block h-full rounded-full bg-arcade-yellow transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${(progress.done / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

export function KeysCard({ items }: { items: readonly Control[] }) {
  return (
    <section aria-label="Keyboard controls" className="game-keys">
      <h2 className="m-0 mb-2.5">
        <Label>Controls</Label>
      </h2>
      <ul className="game-key-list m-0 grid list-none grid-cols-2 gap-x-3 gap-y-2.5 p-0">
        {items.map((item) => (
          <li key={item.label} className="flex min-w-0 items-center gap-2 whitespace-nowrap text-[13px] text-muted">
            <span className="inline-flex gap-1">
              {item.keys.map((k) => (
                <Kbd key={k}>{k}</Kbd>
              ))}
            </span>
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LeaderboardCard({ game, highlightId }: { game: GameId; highlightId?: string | null }) {
  const { scores, shared } = useBoard(game);
  const mine = useScores(game);
  const [confirming, setConfirming] = useState(false);

  return (
    <Card label="Leaderboard" meta={shared ? "Everyone" : "This browser"} className="game-lead">
      <div className="game-board-wrap relative min-h-[150px] flex-1">
        {scores.length === 0 ? (
          <div className="absolute inset-0 grid place-content-center gap-1 rounded-[10px] border-[1.5px] border-dashed border-line p-4 text-center text-[14px] text-muted">
            <span>No scores yet.</span>
            <small className="text-[12px] text-faint">Finish a game to set the first one.</small>
          </div>
        ) : (
          <ol className="game-board-list absolute inset-0 m-0 list-none overflow-auto p-0">
            {scores.map((entry, i) => (
              <li
                key={entry.id}
                className={cx(
                  "grid grid-cols-[20px_minmax(0,1fr)_auto_auto] items-baseline gap-2.5 rounded-[8px] p-2 text-[14px] [&+&]:mt-0.5",
                  entry.id === highlightId && "bg-arcade-yellow/25",
                )}
              >
                <span className="text-[12px] font-semibold tabular-nums text-faint">{i + 1}</span>
                <span className="truncate font-medium">{entry.name}</span>
                <span className="game-detail truncate text-[12px] text-faint tabular-nums">{entry.detail}</span>
                <span className="text-right font-semibold tabular-nums">{fmt(entry.score)}</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-line pt-3 text-[13px]">
        <span className="text-muted">
          Your best <span className="font-semibold tabular-nums text-ink">{fmt(mine[0]?.score ?? 0)}</span>
        </span>
        {mine.length > 0 && (
          <span className="flex gap-3 text-[12px]">
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
                  Clear mine
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setConfirming(true)} className="text-muted hover:text-ink">
                Clear mine
              </button>
            )}
          </span>
        )}
      </div>
    </Card>
  );
}

/** Name entry for a score that makes the top ten. */
export function ScoreForm({
  game,
  score,
  detail,
  shared,
  onSaved,
  onSkip,
}: {
  game: GameId;
  score: number;
  detail: string;
  /** Whether the score goes to the board everyone sees. */
  shared: boolean;
  onSaved: (id: string) => void;
  onSkip: () => void;
}) {
  const id = useId();
  // Only ever mounted after a game ends, so reading storage here is safe.
  const [name, setName] = useState(getSavedName);
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    // The browser's own history always keeps it; the shared board may not.
    const localId = addScore(game, name, score, detail);
    const sharedId = shared ? await submitScore(game, name, score, detail) : null;
    onSaved(sharedId ?? localId);
  };

  return (
    <form onSubmit={submit} className="grid gap-2 border-t border-line pt-3 text-left">
      <label htmlFor={id} className="text-[13px] font-semibold">
        You made the top 10
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          id={id}
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              onSkip();
            }
          }}
          maxLength={16}
          placeholder="Your name"
          autoComplete="nickname"
          spellCheck={false}
          className="h-11 min-w-0 flex-[1_1_90px] rounded-[12px] border-2 border-line bg-canvas px-3 text-[15px] font-medium text-ink placeholder:text-faint focus:border-ink focus:outline-none"
        />
        <Btn type="submit" className="flex-none px-3.5">
          {saving ? "Saving" : "Save"}
        </Btn>
      </div>
      <button type="button" onClick={onSkip} className="justify-self-start text-[12px] text-muted hover:text-ink">
        Skip
      </button>
    </form>
  );
}

/* -------------------------------------------------------------- Touch */

/**
 * Wrapper for on-screen controls. Touching it never scrolls, zooms,
 * selects text or opens the long-press menu, and the first touch unlocks
 * audio, which browsers only allow from a gesture.
 */
export function TouchPad({ onGesture, children }: { onGesture?: () => void; children: ReactNode }) {
  return (
    <div
      role="group"
      aria-label="Game controls"
      onPointerDownCapture={onGesture}
      className="game-pad grid w-full max-w-[420px] select-none grid-cols-4 gap-2 justify-self-center [-webkit-touch-callout:none] [touch-action:none]"
    >
      {children}
    </div>
  );
}

/**
 * One button on the touch pad. It fires on touch-down rather than on
 * click, so there is no delay, and reports release too, so holding a
 * direction or fire keeps it going exactly like holding a key.
 */
export function PadButton({
  label,
  primary = false,
  span = 1,
  onPress,
  onRelease,
  children,
}: {
  label: string;
  primary?: boolean;
  span?: 1 | 2 | 3 | 4;
  onPress: () => void;
  onRelease?: () => void;
  children: ReactNode;
}) {
  const [held, setHeld] = useState(false);
  const release = () => {
    setHeld(false);
    onRelease?.();
  };
  const spans = { 1: "", 2: "col-span-2", 3: "col-span-3", 4: "col-span-4" } as const;

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
        "game-btn grid h-[52px] place-items-center rounded-[12px] border-2 p-0 text-[14px] font-semibold [touch-action:none] [-webkit-tap-highlight-color:transparent]",
        primary ? "game-btn-primary" : "bg-surface text-ink",
        held && "is-down",
        spans[span],
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
    strokeWidth: 2.2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  } as const;
  if (name === "left") return <svg {...common}><path d="M15 6l-6 6 6 6" /></svg>;
  if (name === "right") return <svg {...common}><path d="M9 6l6 6-6 6" /></svg>;
  if (name === "down") return <svg {...common}><path d="M6 9l6 6 6-6" /></svg>;
  if (name === "rotate") {
    return (
      <svg {...common}>
        <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
        <path d="M19.5 4v4h-4" />
      </svg>
    );
  }
  return <svg {...common}><path d="M9 6v12M15 6v12" /></svg>;
}

/* ------------------------------------------------------------- Layout */

/**
 * The whole game page below the nav: title and blurb, two small panels
 * over the score and controls on one side and the leaderboard on the
 * other, with the board between them. `.game-grid` in globals.css moves
 * the pieces around at tablet and phone widths.
 */
export function GameShell({
  title,
  blurb,
  first,
  second,
  stats,
  controls,
  board,
  pad,
  ratio,
  game,
  highlightId,
}: {
  title: string;
  blurb: string;
  /** Board width over height, which sizes the board on phones. */
  ratio: number;
  /** The small panel above the score (Tetrix: Hold). */
  first: ReactNode;
  /** The small panel above the leaderboard (Tetrix: Next). */
  second: ReactNode;
  stats: ReactNode;
  controls: readonly Control[];
  board: ReactNode;
  pad: ReactNode;
  game: GameId;
  highlightId?: string | null;
}) {
  return (
    <div className="game-grid" style={{ "--board-ratio": ratio } as CSSProperties}>
      <header className="game-head">
        <h1 className="m-0 text-[clamp(34px,4vw,44px)] font-semibold leading-none tracking-[-0.035em]">
          {title}
        </h1>
      </header>
      <p className="game-desc m-0 max-w-[40ch] text-[15px] leading-[1.5] text-muted">{blurb}</p>

      <div className="game-first">{first}</div>
      <div className="game-second">{second}</div>
      <div className="game-board">{board}</div>
      {stats}
      <div className="game-pad-area">{pad}</div>
      <KeysCard items={controls} />
      <LeaderboardCard game={game} highlightId={highlightId} />
    </div>
  );
}

/** The top score on a game card, read from this browser. */
export function BestScore({ game }: { game: GameId }) {
  const top = useScores(game)[0];
  return <span>{top ? `Best ${fmt(top.score)} by ${top.name}` : "No score yet"}</span>;
}
