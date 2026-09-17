"use client";

import { useCallback, useSyncExternalStore } from "react";

import type { GameId, ScoreEntry } from "@/lib/scores";

import { useScores } from "./leaderboard";

/**
 * The shared top ten, read from /api/scores. One cache per game feeds
 * every component on the page, and a save refreshes it for all of them.
 *
 * `configured` is false when the site has no score database yet, which
 * is the case locally and before the Upstash store is connected. The
 * leaderboard then shows this browser's own scores instead.
 */

type Board = { scores: readonly ScoreEntry[]; configured: boolean; loaded: boolean };

const EMPTY: Board = { scores: [], configured: false, loaded: false };
const boards = new Map<GameId, Board>();
const listeners = new Map<GameId, Set<() => void>>();

function set(game: GameId, board: Board) {
  boards.set(game, board);
  listeners.get(game)?.forEach((fn) => fn());
}

async function load(game: GameId) {
  try {
    const res = await fetch(`/api/scores?game=${game}`, { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const body = (await res.json()) as { configured?: boolean; scores?: ScoreEntry[] };
    set(game, {
      scores: body.scores ?? [],
      configured: Boolean(body.configured),
      loaded: true,
    });
  } catch {
    // Offline or the route is unavailable: fall back to the local board.
    set(game, { scores: [], configured: false, loaded: true });
  }
}

/** The shared board for one game, fetched the first time it is shown. */
export function useGlobalScores(game: GameId) {
  const subscribe = useCallback(
    (listener: () => void) => {
      const fns = listeners.get(game) ?? new Set<() => void>();
      listeners.set(game, fns);
      fns.add(listener);
      if (!boards.get(game)?.loaded) void load(game);
      return () => {
        fns.delete(listener);
      };
    },
    [game],
  );
  // The server renders the empty board; the client swaps in the fetched one.
  return useSyncExternalStore(
    subscribe,
    () => boards.get(game) ?? EMPTY,
    () => EMPTY,
  );
}

/**
 * Sends a score to the shared board. Returns the new entry's id when it
 * was saved, so the board can highlight it, or null when there is no
 * shared board or the save failed.
 */
export async function submitScore(game: GameId, name: string, score: number, detail: string) {
  try {
    const res = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game, name, score, detail }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { configured?: boolean; id?: string; scores?: ScoreEntry[] };
    if (!body.configured) return null;
    set(game, { scores: body.scores ?? [], configured: true, loaded: true });
    return body.id ?? null;
  } catch {
    return null;
  }
}

/**
 * The board a page should show: the shared one where it exists, this
 * browser's own where it does not.
 */
export function useBoard(game: GameId) {
  const mine = useScores(game);
  const shared = useGlobalScores(game);
  return shared.configured
    ? { scores: shared.scores, shared: true as const }
    : { scores: mine, shared: false as const };
}
