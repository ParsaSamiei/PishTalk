import "server-only";

/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * This is intentionally simple: it protects a single running instance
 * against basic brute-force/spam (admin login, contact form, event
 * registration). It is NOT shared across serverless instances or multiple
 * server processes — if PishTalk is ever deployed behind multiple app
 * instances (e.g. horizontally scaled Vercel functions), replace this with
 * a shared store such as Upstash Redis (`@upstash/ratelimit`) so all
 * instances see the same counters.
 */

interface WindowEntry {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, WindowEntry>();

// Periodically drop expired entries so this Map can't grow unbounded.
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupIfNeeded(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  readonly allowed: boolean;
  /** Seconds until the caller may retry, only meaningful when `allowed` is false. */
  readonly retryAfterSeconds: number;
}

/**
 * @param key Unique bucket key, e.g. `login:${email}` or `contact:${ip}`.
 * @param limit Max allowed hits within `windowMs`.
 * @param windowMs Window length in milliseconds.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  cleanupIfNeeded(now);

  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Best-effort caller IP from standard proxy headers. Falls back to a
 * constant key when none are present (e.g. local dev), which degrades to a
 * single shared bucket rather than throwing.
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}
