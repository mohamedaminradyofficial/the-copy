/**
 * Redis Client Configuration
 *
 * Provides caching capabilities for API responses and data
 */

import { createClient, RedisClientType } from 'redis';

let redis: RedisClientType | null = null;

// Redis configuration with fallback
// Supports both REDIS_URL and individual REDIS_HOST/PORT/PASSWORD
function getRedisConfig() {
  // If REDIS_URL is provided, use it directly
  if (process.env.REDIS_URL) {
    return {
      url: process.env.REDIS_URL,
    };
  }

  // Otherwise use individual variables
  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    retry_strategy: (options: any) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        console.error('Redis connection refused');
        return new Error('Redis Server Connection Error');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        console.error('Redis retry time exhausted');
        return new Error('Retry time exhausted');
      }
      if (options.attempt > 10) {
        return undefined;
      }
      // reconnect after
      return Math.min(options.attempt * 100, 3000);
    },
  };
}

const REDIS_CONFIG = getRedisConfig();

/**
 * Get or create Redis client instance
 */
export function getRedisClient(): RedisClientType | null {
  // In development, allow graceful degradation if Redis is not available
  if (process.env.NODE_ENV === 'development' && !process.env.REDIS_HOST && !process.env.REDIS_URL) {
    console.warn('[Redis] Not configured, caching disabled');
    return null;
  }

  if (!redis) {
    try {
      redis = createClient(REDIS_CONFIG);

      redis.on('error', (err) => {
        console.error('[Redis] Connection error:', err);
      });

      redis.on('connect', () => {
        console.log('[Redis] Connected successfully');
      });

      redis.on('ready', () => {
        console.log('[Redis] Ready to accept commands');
      });

      redis.on('end', () => {
        console.log('[Redis] Connection closed');
      });

      // Connect to Redis
      redis.connect().catch((error) => {
        console.error('[Redis] Failed to connect:', error);
        redis = null;
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
    await client.setEx(key, ttl, JSON.stringify(data));

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
      await client.del(keys);
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
    await redis.disconnect();
    redis = null;
  }
}

export default {
  getRedisClient,
  getCached,
  invalidateCache,
  closeRedis,
};
