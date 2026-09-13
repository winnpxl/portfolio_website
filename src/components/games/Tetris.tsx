"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useSoundEnabled } from "@/components/sound";

import {
  ArcadeButton,
  ArcadePanel,
  BoardFrame,
  GameLayout,
  OverlayCard,
  PanelLabel,
  ScoreForm,
  StatGrid,
  type Control,
} from "./GameUI";
import { keyBelongsToGame, useAnimationFrame, useHiDpiCanvas } from "./hooks";
import { qualifiesFor, useScores } from "./leaderboard";
import { Sfx, tetrisVoice } from "./sfx";
import {
  BOARD_H,
  BOARD_W,
  HOLD_H,
  HOLD_W,
  NEXT_H,
  NEXT_W,
  TetrisGame,
  renderHold,
  renderNext,
  renderTetris,
  type Status,
} from "./tetris-engine";

type Hud = { status: Status; score: number; level: number; lines: number };
/** Matches a freshly constructed game, so no sync is needed on mount. */
const INITIAL_HUD: Hud = { status: "ready", score: 0, level: 1, lines: 0 };

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

export function Tetris() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { ref: boardRef, ctx: boardCtx } = useHiDpiCanvas(BOARD_W, BOARD_H);
  const { ref: nextRef, ctx: nextCtx } = useHiDpiCanvas(NEXT_W, NEXT_H);
  const { ref: holdRef, ctx: holdCtx } = useHiDpiCanvas(HOLD_W, HOLD_H);
  const gameRef = useRef<TetrisGame | null>(null);
  const sfxRef = useRef<Sfx | null>(null);
  const soundOn = useSoundEnabled();
  const scores = useScores("tetris");
  const [hud, setHud] = useState<Hud>(INITIAL_HUD);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const sfx = new Sfx();
    const game: TetrisGame = new TetrisGame(
      (event) => tetrisVoice(sfx, event),
      () => setHud({ status: game.status, score: game.score, level: game.level, lines: game.lines }),
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
    if (boardCtx.current) renderTetris(boardCtx.current, game);
    if (nextCtx.current) renderNext(nextCtx.current, game.queue);
    if (holdCtx.current) renderHold(holdCtx.current, game.hold, game.canHold);
  });

  const best = scores[0]?.score ?? 0;
  const detail = `Level ${hud.level} · ${hud.lines} ${hud.lines === 1 ? "line" : "lines"}`;
  const canSave = hud.status === "over" && !savedId && !skipped && qualifiesFor(scores, hud.score);

  let overlay = null;
  if (hud.status === "ready") {
    overlay = (
      <OverlayCard tone="light" eyebrow="Tetris" title="Stack it up">
        <p className="m-0 mt-3 text-[14px] leading-[1.45] text-muted">
          Fill a row to clear it. Clear four at once for a Tetris.
        </p>
        <ArcadeButton tone="light" onClick={start} className="mt-5 w-full">
          Start game
        </ArcadeButton>
        <p className="m-0 mt-3 text-[12px] text-faint">or press Enter</p>
      </OverlayCard>
    );
  } else if (hud.status === "paused") {
    overlay = (
      <OverlayCard tone="light" eyebrow="Paused" title={fmt(hud.score)}>
        <p className="m-0 mt-2 text-[13px] text-muted">{detail}</p>
        <ArcadeButton tone="light" onClick={() => gameRef.current?.togglePause()} className="mt-5 w-full">
          Resume
        </ArcadeButton>
        <ArcadeButton tone="light" variant="secondary" onClick={start} className="mt-2 w-full">
          Restart
        </ArcadeButton>
        <p className="m-0 mt-3 text-[12px] text-faint">P to resume, R to restart</p>
      </OverlayCard>
    );
  } else if (hud.status === "over") {
    overlay = (
      <OverlayCard tone="light" eyebrow="Game over" title={fmt(hud.score)}>
        <p className="m-0 mt-2 text-[13px] text-muted">{detail}</p>
        {canSave && (
          <ScoreForm
            tone="light"
            game="tetris"
            score={hud.score}
            detail={detail}
            onSaved={setSavedId}
            onSkip={() => setSkipped(true)}
          />
        )}
        {savedId && <p className="m-0 mt-3 text-[13px] font-semibold text-ink">Saved to the leaderboard</p>}
        <ArcadeButton
          tone="light"
          variant={canSave ? "secondary" : "primary"}
          onClick={start}
          className="mt-4 w-full"
        >
          Play again
        </ArcadeButton>
      </OverlayCard>
    );
  }

  return (
    <div ref={rootRef} tabIndex={-1} className="outline-none">
      <GameLayout
        tone="light"
        ratio={BOARD_W / BOARD_H}
        controls={CONTROLS}
        game="tetris"
        highlightId={savedId}
        board={
          <BoardFrame tone="light" overlay={overlay}>
            <canvas
              ref={boardRef}
              role="img"
              aria-label="Tetris board"
              className="block h-auto w-full"
              style={{ aspectRatio: `${BOARD_W} / ${BOARD_H}` }}
            />
          </BoardFrame>
        }
        side={
          <>
            <StatGrid
              tone="light"
              stats={[
                { label: "Score", value: fmt(hud.score) },
                { label: "Best", value: fmt(Math.max(best, hud.score)) },
                { label: "Level", value: hud.level },
                { label: "Lines", value: hud.lines },
              ]}
            />
            <ArcadePanel tone="light" className="grid grid-cols-2 gap-3 p-4">
              <div>
                <PanelLabel>Hold</PanelLabel>
                <canvas
                  ref={holdRef}
                  aria-hidden
                  className="mt-2 block h-auto w-full"
                  style={{ aspectRatio: `${HOLD_W} / ${HOLD_H}` }}
                />
              </div>
              <div>
                <PanelLabel>Next</PanelLabel>
                <canvas
                  ref={nextRef}
                  aria-hidden
                  className="mt-2 block h-auto w-full"
                  style={{ aspectRatio: `${NEXT_W} / ${NEXT_H}` }}
                />
              </div>
            </ArcadePanel>
          </>
        }
      />
    </div>
  );
}
