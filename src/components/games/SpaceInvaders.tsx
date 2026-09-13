"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useSoundEnabled } from "@/components/sound";

import {
  ArcadeButton,
  BoardFrame,
  GameLayout,
  OverlayCard,
  ScoreForm,
  StatGrid,
  type Control,
} from "./GameUI";
import { keyBelongsToGame, useAnimationFrame, useHiDpiCanvas } from "./hooks";
import { H, InvadersGame, W, renderInvaders, type InvadersStatus } from "./invaders-engine";
import { qualifiesFor, useScores } from "./leaderboard";
import { Sfx, invadersVoice } from "./sfx";

type Hud = { status: InvadersStatus; score: number; lives: number; wave: number };
/** Matches a freshly constructed game, so no sync is needed on mount. */
const INITIAL_HUD: Hud = { status: "ready", score: 0, lives: 3, wave: 1 };

const CONTROLS: readonly Control[] = [
  { keys: ["←", "→"], label: "Move" },
  { keys: ["Space"], label: "Fire" },
  { keys: ["P"], label: "Pause" },
  { keys: ["R"], label: "Restart" },
];

const fmt = (n: number) => n.toLocaleString("en-US");

function Lives({ count }: { count: number }) {
  if (count <= 0) return <>0</>;
  return (
    <span className="flex h-[22px] items-center gap-1.5" aria-label={`${count} ${count === 1 ? "life" : "lives"}`}>
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} width="22" height="14" viewBox="-1 -1 15 10" aria-hidden>
          <path
            d="M6 0h1v1h1v2h4v1h1v4H0V4h1V3h4V1h1z"
            fill="#4dbef7"
            stroke="#262626"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

export function SpaceInvaders() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { ref: boardRef, ctx: boardCtx } = useHiDpiCanvas(W, H);
  const gameRef = useRef<InvadersGame | null>(null);
  const sfxRef = useRef<Sfx | null>(null);
  const fontRef = useRef("system-ui, sans-serif");
  const soundOn = useSoundEnabled();
  const scores = useScores("space-invaders");
  const [hud, setHud] = useState<Hud>(INITIAL_HUD);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const sfx = new Sfx();
    const game: InvadersGame = new InvadersGame(
      (event) => invadersVoice(sfx, event),
      () => setHud({ status: game.status, score: game.score, lives: game.lives, wave: game.wave }),
    );
    sfxRef.current = sfx;
    gameRef.current = game;
    // Canvas text should use the site's face, which only the DOM knows.
    fontRef.current = getComputedStyle(document.body).fontFamily;
    return () => {
      sfx.dispose();
      sfxRef.current = null;
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (sfxRef.current) sfxRef.current.enabled = soundOn;
  }, [soundOn]);

  const start = useCallback(() => {
    const game = gameRef.current;
    if (!game) return;
    setSavedId(null);
    setSkipped(false);
    sfxRef.current?.unlock();
    game.start();
    rootRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const game = gameRef.current;
      if (!game || !keyBelongsToGame(e)) return;
      sfxRef.current?.unlock();
      const playing = game.status === "playing";
      let used = true;
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          if (playing) game.press("left", true);
          used = playing;
          break;
        case "ArrowRight":
        case "KeyD":
          if (playing) game.press("right", true);
          used = playing;
          break;
        case "Space":
          if (playing) game.press("fire", true);
          else if (game.status === "paused") game.togglePause();
          else if (!e.repeat) start();
          break;
        case "ArrowUp":
        case "KeyW":
          if (playing) game.press("fire", true);
          used = playing;
          break;
        case "KeyP":
        case "Escape":
          used = playing || game.status === "paused";
          if (used && !e.repeat) game.togglePause();
          break;
        case "KeyR":
          used = game.status === "paused" || game.status === "over";
          if (used) start();
          break;
        case "Enter":
        case "NumpadEnter":
          if (game.status === "paused") game.togglePause();
          else if (!playing) start();
          else used = false;
          break;
        default:
          used = false;
      }
      if (used) e.preventDefault();
    };
    const onUp = (e: KeyboardEvent) => {
      const game = gameRef.current;
      if (!game) return;
      if (e.code === "ArrowLeft" || e.code === "KeyA") game.press("left", false);
      else if (e.code === "ArrowRight" || e.code === "KeyD") game.press("right", false);
      else if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") game.press("fire", false);
    };
    const onBlur = () => gameRef.current?.pause();
    const onVisibility = () => {
      if (document.hidden) onBlur();
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [start]);

  useAnimationFrame((dt) => {
    const game = gameRef.current;
    if (!game) return;
    game.update(dt);
    if (boardCtx.current) renderInvaders(boardCtx.current, game, fontRef.current);
  });

  const best = scores[0]?.score ?? 0;
  const detail = `Wave ${hud.wave}`;
  const canSave = hud.status === "over" && !savedId && !skipped && qualifiesFor(scores, hud.score);

  let overlay = null;
  if (hud.status === "ready") {
    overlay = (
      <OverlayCard tone="dark" eyebrow="Space Invaders" title="Hold the line">
        <p className="m-0 mt-3 text-[14px] leading-[1.45] text-muted">
          Clear every wave before it lands. The bunkers will not last forever.
        </p>
        <ArcadeButton tone="dark" onClick={start} className="mt-5 w-full">
          Start game
        </ArcadeButton>
        <p className="m-0 mt-3 text-[12px] text-faint">or press Enter</p>
      </OverlayCard>
    );
  } else if (hud.status === "paused") {
    overlay = (
      <OverlayCard tone="dark" eyebrow="Paused" title={fmt(hud.score)}>
        <p className="m-0 mt-2 text-[13px] text-muted">{detail}</p>
        <ArcadeButton tone="dark" onClick={() => gameRef.current?.togglePause()} className="mt-5 w-full">
          Resume
        </ArcadeButton>
        <ArcadeButton tone="dark" variant="secondary" onClick={start} className="mt-2 w-full">
          Restart
        </ArcadeButton>
        <p className="m-0 mt-3 text-[12px] text-faint">P to resume, R to restart</p>
      </OverlayCard>
    );
  } else if (hud.status === "over") {
    overlay = (
      <OverlayCard tone="dark" eyebrow="Game over" title={fmt(hud.score)}>
        <p className="m-0 mt-2 text-[13px] text-muted">{detail}</p>
        {canSave && (
          <ScoreForm
            tone="dark"
            game="space-invaders"
            score={hud.score}
            detail={detail}
            onSaved={setSavedId}
            onSkip={() => setSkipped(true)}
          />
        )}
        {savedId && <p className="m-0 mt-3 text-[13px] font-semibold text-ink">Saved to the leaderboard</p>}
        <ArcadeButton tone="dark" variant={canSave ? "secondary" : "primary"} onClick={start} className="mt-4 w-full">
          Play again
        </ArcadeButton>
      </OverlayCard>
    );
  }

  return (
    <div ref={rootRef} tabIndex={-1} className="outline-none">
      <GameLayout
        tone="dark"
        ratio={W / H}
        controls={CONTROLS}
        game="space-invaders"
        highlightId={savedId}
        board={
          <BoardFrame tone="dark" overlay={overlay}>
            <canvas
              ref={boardRef}
              role="img"
              aria-label="Space Invaders playfield"
              className="block h-auto w-full"
              style={{ aspectRatio: `${W} / ${H}` }}
            />
          </BoardFrame>
        }
        side={
          <StatGrid
            tone="dark"
            stats={[
              { label: "Score", value: fmt(hud.score) },
              { label: "Best", value: fmt(Math.max(best, hud.score)) },
              { label: "Wave", value: hud.wave },
              { label: "Lives", value: <Lives count={hud.lives} /> },
            ]}
          />
        }
      />
    </div>
  );
}
