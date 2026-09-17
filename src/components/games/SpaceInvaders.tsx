"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useSoundEnabled } from "@/components/sound";

import {
  Btn,
  Card,
  GameShell,
  OverlayCard,
  OverlayHint,
  OverlayKeys,
  PadButton,
  PadIcon,
  ScoreForm,
  Slot,
  Stage,
  StatsCard,
  TouchPad,
  type Control,
} from "./GameUI";
import { useBoard } from "./globalScores";
import { keyBelongsToGame, useAnimationFrame, useHiDpiCanvas } from "./hooks";
import { H, InvadersGame, W, renderInvaders, type InvadersStatus } from "./invaders-engine";
import { qualifiesFor, useScores } from "./leaderboard";
import { Sfx, invadersVoice } from "./sfx";

type Hud = { status: InvadersStatus; score: number; lives: number; wave: number; formation: string[] };
const FULL_ROW = "1".repeat(11);
/** Matches a freshly constructed game, so no sync is needed on mount. */
const INITIAL_HUD: Hud = {
  status: "ready",
  score: 0,
  lives: 3,
  wave: 1,
  formation: Array.from({ length: 5 }, () => FULL_ROW),
};

const READY_KEYS: readonly Control[] = [
  { keys: ["←", "→"], label: "Move" },
  { keys: ["Space"], label: "Fire" },
  { keys: ["P"], label: "Pause" },
];

const CONTROLS: readonly Control[] = [
  { keys: ["←", "→"], label: "Move" },
  { keys: ["Space"], label: "Fire" },
  { keys: ["P"], label: "Pause" },
  { keys: ["R"], label: "Restart" },
];

const fmt = (n: number) => n.toLocaleString("en-US");

/** One ship per life left, drawn like the player's cannon. */
function Lives({ count }: { count: number }) {
  if (count <= 0) return <span className="text-[13px] text-faint">None left</span>;
  return (
    <span className="flex flex-wrap items-center justify-center gap-2.5 max-md:gap-1.5" aria-label={`${count} ${count === 1 ? "life" : "lives"}`}>
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} viewBox="-1 -1 15 10" aria-hidden className="h-auto w-9 max-md:w-5">
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

/** The marching formation in miniature: a dot per invader still standing. */
function Formation({ rows }: { rows: string[] }) {
  const left = rows.join("").split("").filter((c) => c === "1").length;
  return (
    <div
      role="img"
      aria-label={`${left} invaders left in this wave`}
      className="grid h-full content-center justify-center gap-[5px]"
    >
      {rows.map((row, r) => (
        <div key={r} className="flex gap-[5px]">
          {row.split("").map((cell, c) => (
            <span
              key={c}
              className={
                cell === "1"
                  ? "size-[7px] rounded-[2px] bg-ink/80 transition-opacity duration-200"
                  : "size-[7px] rounded-[2px] bg-ink/10 transition-opacity duration-200"
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SpaceInvaders({ title, blurb }: { title: string; blurb: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { ref: boardRef, ctx: boardCtx } = useHiDpiCanvas(W, H);
  const gameRef = useRef<InvadersGame | null>(null);
  const sfxRef = useRef<Sfx | null>(null);
  const fontRef = useRef("system-ui, sans-serif");
  const soundOn = useSoundEnabled();
  const scores = useScores("space-invaders");
  // Qualifying means making the board on show: everyone's, or this browser's.
  const board = useBoard("space-invaders");
  const [hud, setHud] = useState<Hud>(INITIAL_HUD);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const sfx = new Sfx();
    const game: InvadersGame = new InvadersGame(
      (event) => invadersVoice(sfx, event),
      () =>
        setHud({
          status: game.status,
          score: game.score,
          lives: game.lives,
          wave: game.wave,
          formation: game.formation(),
        }),
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
    // On a phone, bring the score strip, board and pad into view together.
    if (window.matchMedia("(pointer: coarse)").matches) {
      rootRef.current?.querySelector(".game-stats")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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

  /** Touch pad input for the held controls. */
  const press = (key: "left" | "right" | "fire", down: boolean) => gameRef.current?.press(key, down);

  const best = scores[0]?.score ?? 0;
  const detail = `Wave ${hud.wave}`;
  const canSave = hud.status === "over" && !savedId && !skipped && qualifiesFor(board.scores, hud.score);

  let overlay = null;
  if (hud.status === "ready") {
    overlay = (
      <OverlayCard label="Space Invaders" title="Ready?">
        <OverlayKeys items={READY_KEYS} />
        <p className="m-0 hidden text-[13px] text-muted pointer-coarse:block">Use the buttons under the board.</p>
        <Btn onClick={start} className="w-full">
          Start game
        </Btn>
        <OverlayHint>or press Enter</OverlayHint>
      </OverlayCard>
    );
  } else if (hud.status === "paused") {
    overlay = (
      <OverlayCard label="Paused" title={fmt(hud.score)} sub={detail}>
        <Btn onClick={() => gameRef.current?.togglePause()} className="w-full">
          Resume
        </Btn>
        <Btn variant="secondary" onClick={start} className="w-full">
          Restart
        </Btn>
        <OverlayHint>P to resume, R to restart</OverlayHint>
      </OverlayCard>
    );
  } else if (hud.status === "over") {
    overlay = (
      <OverlayCard label="Game over" title={fmt(hud.score)} sub={detail}>
        {canSave && (
          <ScoreForm
            game="space-invaders"
            score={hud.score}
            detail={detail}
            shared={board.shared}
            onSaved={setSavedId}
            onSkip={() => setSkipped(true)}
          />
        )}
        {savedId && (
          <p className="m-0 text-[13px] text-muted">
            {board.shared ? "Saved to the leaderboard." : "Saved on this device."}
          </p>
        )}
        <Btn variant={canSave ? "secondary" : "primary"} onClick={start} className="w-full">
          Play again
        </Btn>
      </OverlayCard>
    );
  }

  const total = hud.formation.join("").length;
  const cleared = hud.formation.join("").split("").filter((c) => c === "0").length;
  const left = total - cleared;

  return (
    <div ref={rootRef} tabIndex={-1} className="scroll-mt-3 outline-none">
      <GameShell
        title={title}
        blurb={blurb}
        ratio={W / H}
        game="space-invaders"
        highlightId={savedId}
        controls={CONTROLS}
        first={
          <Card label="Lives">
            <Slot className="grid flex-1 place-items-center overflow-hidden px-2">
              <Lives count={hud.lives} />
            </Slot>
          </Card>
        }
        second={
          <Card label="Formation" meta={`${left} left`}>
            <Slot className="flex-1 overflow-hidden">
              <Formation rows={hud.formation} />
            </Slot>
          </Card>
        }
        stats={
          <StatsCard
            score={hud.score}
            items={[
              { label: "Best", value: fmt(Math.max(best, hud.score)) },
              { label: "Wave", value: hud.wave },
              { label: "Lives", value: hud.lives },
            ]}
            progress={{
              text: `Wave ${hud.wave + 1} in ${left} ${left === 1 ? "invader" : "invaders"}`,
              done: cleared,
              total,
            }}
          />
        }
        board={
          <Stage ratio={W / H} overlay={overlay}>
            <canvas ref={boardRef} role="img" aria-label="Space Invaders playfield" />
          </Stage>
        }
        pad={
          <TouchPad onGesture={() => sfxRef.current?.unlock()}>
            <PadButton label="Move left" onPress={() => press("left", true)} onRelease={() => press("left", false)}>
              <PadIcon name="left" />
            </PadButton>
            <PadButton label="Move right" onPress={() => press("right", true)} onRelease={() => press("right", false)}>
              <PadIcon name="right" />
            </PadButton>
            <PadButton label={hud.status === "paused" ? "Resume" : "Pause"} span={2} onPress={() => gameRef.current?.togglePause()}>
              {hud.status === "paused" ? "Resume" : "Pause"}
            </PadButton>
            <PadButton label="Fire" primary span={4} onPress={() => press("fire", true)} onRelease={() => press("fire", false)}>
              Fire
            </PadButton>
          </TouchPad>
        }
      />
    </div>
  );
}
