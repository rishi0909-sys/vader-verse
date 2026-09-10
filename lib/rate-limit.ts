import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

// Cache for rate limits to prevent redundant DB calls per route
const cache = new Map();

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

/**
 * Creates a generic rate limiter.
 * @param requests Number of requests allowed
 * @param window Time window (e.g., "10 s", "1 m")
 */
export function createRateLimiter(requests: number, window: any) {
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    console.warn("UPSTASH_REDIS_REST_URL not configured. Rate limiting is disabled.");
    // Return a mock limiter that always passes
    return {
      limit: async () => ({ success: true, pending: Promise.resolve(), limit: requests, remaining: requests, reset: 0 }),
    };
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    ephemeralCache: cache,
  });
}

// Preset limits
export const aiRateLimiter = createRateLimiter(5, "1 m");
export const authRateLimiter = createRateLimiter(10, "15 m");
export const standardRateLimiter = createRateLimiter(60, "1 m");

/**
 * Helper to extract identity for rate limiting
 * Returns User ID if authenticated, or IP address if unauthenticated.
 */
export function getRateLimitIdentity(req: NextRequest, authenticatedUserId?: string): string {
  if (authenticatedUserId) return `user_${authenticatedUserId}`;
  
  // Fallback to IP address
  const ip = req.headers.get("x-forwarded-for") ?? 
             req.headers.get("x-real-ip") ?? 
             "127.0.0.1";
             
  return `ip_${ip}`;
}
