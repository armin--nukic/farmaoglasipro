import { Redis } from "ioredis";
import { config } from "../config.js";

export const redis = new Redis(config.REDIS_URL, {
  maxRetriesPerRequest: 2,
  lazyConnect: true
});

redis.on("error", (error: Error) => {
  if (config.NODE_ENV !== "test") console.warn("Redis unavailable:", error.message);
});

export async function cached<T>(key: string, ttlSeconds: number, loader: () => Promise<T>): Promise<T> {
  try {
    if (redis.status === "wait") await redis.connect();
    const existing = await redis.get(key);
    if (existing) return JSON.parse(existing) as T;
    const value = await loader();
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    return value;
  } catch {
    return loader();
  }
}

export async function invalidate(pattern: string) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(...keys);
  } catch {
    // Cache is an optimization; API correctness must not depend on it.
  }
}
