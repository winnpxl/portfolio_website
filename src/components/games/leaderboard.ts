import { useSyncExternalStore } from "react";

import { BOARD_SIZE, cleanName, type GameId, type ScoreEntry } from "@/lib/scores";

/**
 * Per-game history, kept only in this browser's localStorage, which is
 * where a player's own best comes from. The shared board that everyone
 * sees lives in globalScores.ts.
 *
 * Exposed through useSyncExternalStore: the server renders an empty
 * board, the client swaps in the stored one without a hydration
 * mismatch, and other tabs stay in step through the storage event.
 */
export type { GameId, ScoreEntry };
export { BOARD_SIZE, cleanName };

const PREFIX = "sw:games:";
const NAME_KEY = `${PREFIX}name`;
const scoresKey = (game: GameId) => `${PREFIX}${game}:scores`;

const EMPTY: readonly ScoreEntry[] = Object.freeze([]);
/** Snapshots must be referentially stable between changes. */
const cache = new Map<GameId, readonly ScoreEntry[]>();
const listeners = new Set<() => void>();

function isEntry(value: unknown): value is ScoreEntry {
  if (!value || typeof value !== "object") return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.name === "string" &&
    typeof e.detail === "string" &&
    typeof e.score === "number" &&
    Number.isFinite(e.score) &&
    typeof e.at === "number"
  );
}

/** Highest first; on a tie the earlier score keeps its place. */
function ranked(list: ScoreEntry[]) {
  return list.sort((a, b) => b.score - a.score || a.at - b.at).slice(0, BOARD_SIZE);
}

function read(game: GameId): readonly ScoreEntry[] {
  try {
    const raw = window.localStorage.getItem(scoresKey(game));
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    // Storage is user-editable, so re-validate and re-clean on the way in.
    const list = parsed
      .filter(isEntry)
      .map((e) => ({ ...e, name: cleanName(e.name) || "Player" }));
    return list.length ? ranked(list) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

function onStorage(e: StorageEvent) {
  if (e.key === null || e.key.startsWith(PREFIX)) {
    cache.clear();
    notify();
  }
}

export function subscribeScores(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function getScores(game: GameId) {
  let list = cache.get(game);
  if (!list) {
    list = read(game);
    cache.set(game, list);
  }
  return list;
}

const getServerScores = () => EMPTY;

export function useScores(game: GameId) {
  return useSyncExternalStore(subscribeScores, () => getScores(game), getServerScores);
}

export function qualifiesFor(scores: readonly ScoreEntry[], score: number) {
  return score > 0 && (scores.length < BOARD_SIZE || score > scores[scores.length - 1].score);
}

/** Saves a score and returns its id, so the board can highlight it. */
export function addScore(game: GameId, name: string, score: number, detail: string) {
  const at = Date.now();
  const entry: ScoreEntry = {
    id: `${at.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: cleanName(name) || "Player",
    score: Math.max(0, Math.floor(score)),
    detail,
    at,
  };
  const next = ranked([...getScores(game), entry]);
  cache.set(game, next);
  try {
    window.localStorage.setItem(scoresKey(game), JSON.stringify(next));
    window.localStorage.setItem(NAME_KEY, entry.name);
  } catch {
    // Storage unavailable (private mode, quota): the score still shows
    // for this session, it just will not persist.
  }
  notify();
  return entry.id;
}

export function clearScores(game: GameId) {
  cache.set(game, EMPTY);
  try {
    window.localStorage.removeItem(scoresKey(game));
  } catch {
    // Nothing stored to remove.
  }
  notify();
}

/** The last name entered, so repeat players do not retype it. */
export function getSavedName() {
  try {
    return cleanName(window.localStorage.getItem(NAME_KEY) ?? "");
  } catch {
    return "";
  }
}
