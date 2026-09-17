import { NextResponse } from "next/server";

import { cleanName, type GameId, type ScoreEntry } from "@/lib/scores";
import { hasStore, redis } from "@/lib/upstash";

/**
 * The shared leaderboard. Every visitor reads the same top ten and can
 * add to it; a browser's own history stays in localStorage.
 *
 * One Redis sorted set per game holds the entries, scored by points. The
 * set is trimmed to KEEP so it cannot grow without bound, and a per
 * minute counter per address keeps one player from flooding it.
 *
 * Scores are counted in the player's browser, so a determined person can
 * post a made-up one. The caps below stop the obvious nonsense; anything
 * silly that gets through can be deleted from the Upstash console.
 */

export const runtime = "edge";
export const dynamic = "force-dynamic";

const TOP = 10;
/** Entries kept per game, so a score can still climb after leaving the top ten. */
const KEEP = 100;
const POSTS_PER_MINUTE = 12;

/** Roughly what a very good run reaches, with room to spare. */
const MAX_SCORE: Record<GameId, number> = {
  tetris: 2_000_000,
  "space-invaders": 500_000,
};

const key = (game: GameId) => `scores:${game}`;

function isGame(value: unknown): value is GameId {
  return value === "tetris" || value === "space-invaders";
}

/** Sorted-set members are the entry as JSON; the sort score is the points. */
function parse(member: unknown, score: unknown): ScoreEntry | null {
  if (typeof member !== "string") return null;
  try {
    const row = JSON.parse(member) as Partial<ScoreEntry>;
    if (typeof row.name !== "string") return null;
    return {
      id: typeof row.id === "string" ? row.id : member,
      name: row.name,
      score: Number(score) || 0,
      detail: typeof row.detail === "string" ? row.detail : "",
      at: typeof row.at === "number" ? row.at : 0,
    };
  } catch {
    return null;
  }
}

async function topScores(game: GameId) {
  // ZRANGE ... REV WITHSCORES answers member, score, member, score...
  const flat = await redis<string[]>(["ZRANGE", key(game), 0, TOP - 1, "REV", "WITHSCORES"]);
  if (!flat) return null;
  const rows: ScoreEntry[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    const entry = parse(flat[i], flat[i + 1]);
    if (entry) rows.push(entry);
  }
  return rows;
}

export async function GET(request: Request) {
  const game = new URL(request.url).searchParams.get("game");
  if (!isGame(game)) return NextResponse.json({ error: "Unknown game" }, { status: 400 });

  const scores = await topScores(game);
  if (!scores) return NextResponse.json({ configured: hasStore, scores: [] });
  return NextResponse.json({ configured: true, scores });
}

export async function POST(request: Request) {
  if (!hasStore) return NextResponse.json({ configured: false, scores: [] });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON" }, { status: 400 });
  }
  const { game, name, score, detail } = (body ?? {}) as Record<string, unknown>;

  if (!isGame(game)) return NextResponse.json({ error: "Unknown game" }, { status: 400 });
  const points = Math.floor(Number(score));
  if (!Number.isFinite(points) || points <= 0 || points > MAX_SCORE[game]) {
    return NextResponse.json({ error: "Score out of range" }, { status: 400 });
  }
  const player = cleanName(String(name ?? "")) || "Player";
  const note = String(detail ?? "").slice(0, 40);

  // One counter per address per minute, expiring on its own.
  const who = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const bucket = `rl:scores:${who}`;
  const used = await redis<number>(["INCR", bucket]);
  if (used === 1) await redis(["EXPIRE", bucket, 60]);
  if (used !== null && used > POSTS_PER_MINUTE) {
    return NextResponse.json({ error: "Too many scores, try again shortly" }, { status: 429 });
  }

  const at = Date.now();
  const id = `${at.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const member = JSON.stringify({ id, name: player, detail: note, at });

  const done = await redis([
    ["ZADD", key(game), points, member],
    // Ranks run low to high, so this drops everything below the top KEEP.
    ["ZREMRANGEBYRANK", key(game), 0, -(KEEP + 1)],
  ]);
  if (!done) return NextResponse.json({ error: "Could not save" }, { status: 502 });

  const scores = (await topScores(game)) ?? [];
  return NextResponse.json({ configured: true, id, scores });
}
