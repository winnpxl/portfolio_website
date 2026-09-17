"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useSoundEnabled } from "@/components/sound";
import { useThemeColors } from "@/components/theme";

import {
  Btn,
  Card,
  GameShell,
  Kbd,
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
import { qualifiesFor, useScores } from "./leaderboard";
import { Sfx, tetrisVoice } from "./sfx";
import {
  BOARD_H,
  BOARD_W,
  HOLD_H,
  HOLD_W,
  TetrisGame,
  renderHold,
  renderTetris,
  type Status,
} from "./tetris-engine";

type Hud = { status: Status; score: number; level: number; lines: number; held: boolean };
/** Matches a freshly constructed game, so no sync is needed on mount. */
const INITIAL_HUD: Hud = { status: "ready", score: 0, level: 1, lines: 0, held: false };

/** The three keys shown on the ready card. */
const READY_KEYS: readonly Control[] = [
  { keys: ["←", "→"], label: "Move" },
  { keys: ["↑"], label: "Rotate" },
  { keys: ["Space"], label: "Drop" },
];

const slotCanvas = "absolute inset-0 block h-full w-full object-contain";

const CONTROLS: readonly Control[] = [
  { keys: ["←", "→"], label: "Move" },
  { keys: ["↑", "X"], label: "Rotate" },
  { keys: ["Z"], label: "Rotate back" },
  { keys: ["↓"], label: "Soft drop" },
  { keys: ["Space"], label: "Hard drop" },
  { keys: ["C"], label: "Hold" },
  { keys: ["P"], label: "Pause" },
];

const fmt = (n: number) => n.toLocaleString("en-US");

export function Tetris({ title, blurb }: { title: string; blurb: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { ref: boardRef, ctx: boardCtx } = useHiDpiCanvas(BOARD_W, BOARD_H);
  const { ref: holdRef, ctx: holdCtx } = useHiDpiCanvas(HOLD_W, HOLD_H);
  const { ref: next0Ref, ctx: next0Ctx } = useHiDpiCanvas(HOLD_W, HOLD_H);
  const { ref: next1Ref, ctx: next1Ctx } = useHiDpiCanvas(HOLD_W, HOLD_H);
  const { ref: next2Ref, ctx: next2Ctx } = useHiDpiCanvas(HOLD_W, HOLD_H);
  const gameRef = useRef<TetrisGame | null>(null);
  const sfxRef = useRef<Sfx | null>(null);
  const soundOn = useSoundEnabled();
  // The well is painted on a canvas, so it reads the tokens itself.
  const boardColors = useThemeColors({ well: "--color-surface", dot: "--color-line" });
  const scores = useScores("tetris");
  // Qualifying means making the board on show: everyone's, or this browser's.
  const board = useBoard("tetris");
  const [hud, setHud] = useState<Hud>(INITIAL_HUD);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const sfx = new Sfx();
    const game: TetrisGame = new TetrisGame(
      (event) => tetrisVoice(sfx, event),
      () =>
        setHud({
          status: game.status,
          score: game.score,
          level: game.level,
          lines: game.lines,
          held: game.hold !== null,
        }),
    );
    sfxRef.current = sfx;
    gameRef.current = game;
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
    // Take focus off whichever button started it, so Space drops pieces.
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
          if (playing && !e.repeat) game.press("left", true);
          used = playing;
          break;
        case "ArrowRight":
          if (playing && !e.repeat) game.press("right", true);
          used = playing;
          break;
        case "ArrowDown":
          if (playing) game.press("down", true);
          used = playing;
          break;
        case "ArrowUp":
        case "KeyX":
          if (playing && !e.repeat) game.rotate(1);
          used = playing;
          break;
        case "KeyZ":
          if (playing && !e.repeat) game.rotate(-1);
          used = playing;
          break;
        case "KeyC":
        case "ShiftLeft":
        case "ShiftRight":
          if (playing && !e.repeat) game.holdPiece();
          used = playing;
          break;
        case "Space":
          if (playing) {
            if (!e.repeat) game.hardDrop();
          } else if (game.status === "paused") game.togglePause();
          else if (!e.repeat) start();
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
      // Only swallow keys the game used, so the page still scrolls otherwise.
      if (used) e.preventDefault();
    };
    const onUp = (e: KeyboardEvent) => {
      const game = gameRef.current;
      if (!game) return;
      if (e.code === "ArrowLeft") game.press("left", false);
      else if (e.code === "ArrowRight") game.press("right", false);
      else if (e.code === "ArrowDown") game.press("down", false);
    };
    // A lost keyup would leave a piece sliding, so leaving the tab pauses.
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
    if (boardCtx.current) renderTetris(boardCtx.current, game, boardColors.current);
    if (holdCtx.current) renderHold(holdCtx.current, game.hold, game.canHold);
    [next0Ctx, next1Ctx, next2Ctx].forEach((ctx, i) => {
      if (ctx.current) renderHold(ctx.current, game.queue[i] ?? null, true);
    });
  });

  /** Touch pad input for the held directions. */
  const press = (key: "left" | "right" | "down", down: boolean) => gameRef.current?.press(key, down);

  const best = scores[0]?.score ?? 0;
  const detail = `Level ${hud.level} · ${hud.lines} ${hud.lines === 1 ? "line" : "lines"}`;
  const canSave = hud.status === "over" && !savedId && !skipped && qualifiesFor(board.scores, hud.score);

  let overlay = null;
  if (hud.status === "ready") {
    overlay = (
      <OverlayCard label="Tetrix" title="Ready?">
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
            game="tetris"
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

  const intoLevel = hud.lines % 10;
  const toNext = 10 - intoLevel;

  return (
    <div ref={rootRef} tabIndex={-1} className="scroll-mt-3 outline-none">
      <GameShell
        title={title}
        blurb={blurb}
        ratio={BOARD_W / BOARD_H}
        game="tetris"
        highlightId={savedId}
        controls={CONTROLS}
        first={
          <Card
            label="Hold"
            meta={
              <span className="pointer-coarse:hidden">
                <Kbd>C</Kbd>
              </span>
            }
          >
            <Slot className="flex-1">
              <canvas ref={holdRef} aria-hidden className={slotCanvas} />
              {!hud.held && (
                <span className="absolute inset-0 grid place-items-center text-[13px] text-faint">Empty</span>
              )}
            </Slot>
          </Card>
        }
        second={
          <Card label="Next">
            <div className="grid min-h-0 flex-1 grid-cols-[1.35fr_1fr] grid-rows-2 gap-2 max-md:grid-cols-[1.3fr_1fr_1fr] max-md:grid-rows-1">
              <Slot className="row-span-2 max-md:row-span-1">
                <canvas ref={next0Ref} aria-hidden className={slotCanvas} />
              </Slot>
              <Slot>
                <canvas ref={next1Ref} aria-hidden className={slotCanvas} />
              </Slot>
              <Slot>
                <canvas ref={next2Ref} aria-hidden className={slotCanvas} />
              </Slot>
            </div>
          </Card>
        }
        stats={
          <StatsCard
            score={hud.score}
            items={[
              { label: "Best", value: fmt(Math.max(best, hud.score)) },
              { label: "Level", value: hud.level },
              { label: "Lines", value: hud.lines },
            ]}
            progress={{
              text: `Level ${hud.level + 1} in ${toNext} ${toNext === 1 ? "line" : "lines"}`,
              done: intoLevel,
              total: 10,
            }}
          />
        }
        board={
          <Stage ratio={BOARD_W / BOARD_H} overlay={overlay}>
            <canvas ref={boardRef} role="img" aria-label="Tetrix well" />
          </Stage>
        }
        pad={
          <TouchPad onGesture={() => sfxRef.current?.unlock()}>
            <PadButton label="Move left" onPress={() => press("left", true)} onRelease={() => press("left", false)}>
              <PadIcon name="left" />
            </PadButton>
            <PadButton label="Soft drop" onPress={() => press("down", true)} onRelease={() => press("down", false)}>
              <PadIcon name="down" />
            </PadButton>
            <PadButton label="Move right" onPress={() => press("right", true)} onRelease={() => press("right", false)}>
              <PadIcon name="right" />
            </PadButton>
            <PadButton label="Rotate" onPress={() => gameRef.current?.rotate(1)}>
              <PadIcon name="rotate" />
            </PadButton>
            <PadButton label="Hold piece" onPress={() => gameRef.current?.holdPiece()}>
              Hold
            </PadButton>
            <PadButton label="Hard drop" primary span={2} onPress={() => gameRef.current?.hardDrop()}>
              Drop
            </PadButton>
            <PadButton label={hud.status === "paused" ? "Resume" : "Pause"} onPress={() => gameRef.current?.togglePause()}>
              {hud.status === "paused" ? "Resume" : "Pause"}
            </PadButton>
          </TouchPad>
        }
      />
    </div>
  );
}
