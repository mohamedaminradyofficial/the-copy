/**
 * Redis Client Configuration
 *
 * Provides caching capabilities for API responses and data
 */

import Redis from 'ioredis';

let redis: Redis | null = null;

// Redis configuration with fallback
const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
};

/**
 * Get or create Redis client instance
 */
export function getRedisClient(): Redis | null {
  // In development, allow graceful degradation if Redis is not available
  if (process.env.NODE_ENV === 'development' && !process.env.REDIS_HOST) {
    console.warn('[Redis] Not configured, caching disabled');
    return null;
  }

  if (!redis) {
    try {
      redis = new Redis(REDIS_CONFIG);

      redis.on('error', (err) => {
        console.error('[Redis] Connection error:', err);
      });

      redis.on('connect', () => {
        console.log('[Redis] Connected successfully');
      });

      redis.on('ready', () => {
        console.log('[Redis] Ready to accept commands');
      });

      redis.on('close', () => {
        console.log('[Redis] Connection closed');
      });

    } catch (error) {
      console.error('[Redis] Failed to initialize:', error);
      return null;
    }
  }

  return redis;
}

/**
 * Cache wrapper with TTL (Time To Live)
 */
export async function getCached<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 3600 // 1 hour default
): Promise<T> {
  const client = getRedisClient();

  // If Redis is not available, fetch directly
  if (!client) {
    return fetchFn();
  }

  try {
    // Check if data exists in cache
    const cached = await client.get(key);

    if (cached) {
      console.log(`[Redis] Cache hit: ${key}`);
      return JSON.parse(cached) as T;
    }

    console.log(`[Redis] Cache miss: ${key}`);

    // Fetch fresh data
    const data = await fetchFn();

    // Store in cache with TTL
    await client.setex(key, ttl, JSON.stringify(data));

    return data;
  } catch (error) {
    console.error('[Redis] Cache operation failed:', error);
    // Fallback to direct fetch
    return fetchFn();
  }
}

/**
 * Invalidate cache by key pattern
 */
export async function invalidateCache(pattern: string): Promise<void> {
  const client = getRedisClient();

  if (!client) return;

  try {
    const keys = await client.keys(pattern);

    if (keys.length > 0) {
      await client.del(...keys);
      console.log(`[Redis] Invalidated ${keys.length} keys matching: ${pattern}`);
    }
  } catch (error) {
    console.error('[Redis] Cache invalidation failed:', error);
  }
}

/**
 * Close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

export default {
  getRedisClient,
  getCached,
  invalidateCache,
  closeRedis,
};
