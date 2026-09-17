/**
 * What a score is, shared by the browser's own board
 * (components/games/leaderboard.ts) and the shared one (api/scores).
 */
export type GameId = "tetris" | "space-invaders";

export type ScoreEntry = {
  id: string;
  name: string;
  score: number;
  /** Short context shown under the name, e.g. "Level 4 · 32 lines". */
  detail: string;
  at: number;
};

export const BOARD_SIZE = 10;
const NAME_MAX = 16;

/** Strips control characters and runs of whitespace, then trims to length. */
export function cleanName(raw: string) {
  return Array.from(raw)
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0;
      return code >= 32 && !(code >= 127 && code <= 159);
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, NAME_MAX);
}
