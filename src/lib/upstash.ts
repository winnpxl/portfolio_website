/**
 * The shared leaderboard's store: an Upstash Redis database, reached over
 * its REST API so nothing extra has to be installed or kept connected.
 *
 * Connection details come from the environment. Vercel's Upstash
 * integration sets KV_REST_API_*; the Upstash dashboard names the same
 * pair UPSTASH_REDIS_REST_*, so either works. With neither set (local
 * development, or before the database exists) `redis` returns null and
 * the game pages fall back to their per-browser boards.
 */

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const hasStore = Boolean(url && token);

type Command = (string | number)[];

/**
 * Runs one Redis command, or several in one round trip. Returns null when
 * the store is not configured or the call fails, so callers degrade to
 * "no shared scores" instead of failing the request.
 */
export async function redis<T = unknown>(command: Command): Promise<T | null>;
export async function redis<T = unknown>(commands: Command[]): Promise<T[] | null>;
export async function redis(input: Command | Command[]): Promise<unknown> {
  if (!url || !token) return null;
  const pipeline = Array.isArray(input[0]);
  try {
    const res = await fetch(pipeline ? `${url}/pipeline` : url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = await res.json();
    // A single command answers { result }; a pipeline answers an array of those.
    return pipeline
      ? (body as { result: unknown }[]).map((step) => step.result)
      : (body as { result: unknown }).result;
  } catch {
    // Network trouble or a malformed answer: treat it as no store.
    return null;
  }
}
