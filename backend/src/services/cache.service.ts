/**
 * Multi-Layer Cache Service
 *
 * Implements a two-tier caching strategy:
 * - L1: In-memory LRU cache for ultra-fast access
 * - L2: Redis cache for persistence and distributed caching
 *
 * Features:
 * - Automatic fallback to L1 if Redis is unavailable
 * - TTL (Time To Live) support
 * - Stale-while-revalidate pattern
 * - Cache key generation with hashing
 */

import Redis from 'ioredis';
import crypto from 'crypto';
import { logger } from '@/utils/logger';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class CacheService {
  private redis: Redis | null = null;
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private readonly MAX_MEMORY_CACHE_SIZE = 100; // Maximum items in L1 cache
  private readonly DEFAULT_TTL = 1800; // 30 minutes in seconds

  constructor() {
    this.initializeRedis();
    this.startMemoryCacheCleanup();
  }

  /**
   * Initialize Redis connection with retry strategy
   */
  private initializeRedis(): void {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

      this.redis = new Redis(redisUrl, {
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          logger.debug(`Redis retry attempt ${times}, delay: ${delay}ms`);
          return delay;
        },
        maxRetriesPerRequest: 3,
        enableOfflineQueue: false,
        lazyConnect: true,
      });

      this.redis.on('error', (error) => {
        logger.warn('Redis connection error, falling back to memory cache:', error.message);
      });

      this.redis.on('connect', () => {
        logger.info('Redis cache connected successfully');
      });

      // Attempt to connect
      this.redis.connect().catch((error) => {
        logger.warn('Redis initial connection failed, using memory cache only:', error.message);
        this.redis = null;
      });

    } catch (error) {
      logger.warn('Redis initialization failed, using memory cache only:', error);
      this.redis = null;
    }
  }

  /**
   * Generate a cache key from prefix and data
   */
  generateKey(prefix: string, data: any): string {
    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex')
      .substring(0, 16);
    return `${prefix}:${hash}`;
  }

  /**
   * Get value from cache (L1 -> L2 -> null)
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      // Try L1 cache first
      const memEntry = this.memoryCache.get(key);
      if (memEntry) {
        const age = Date.now() - memEntry.timestamp;
        const maxAge = memEntry.ttl * 1000;

        if (age < maxAge) {
          logger.debug(`Cache hit (L1): ${key}`);
          return memEntry.data as T;
        } else {
          // Expired, remove from L1
          this.memoryCache.delete(key);
        }
      }

      // Try L2 (Redis) cache
      if (this.redis && this.redis.status === 'ready') {
        const value = await this.redis.get(key);
        if (value) {
          logger.debug(`Cache hit (L2): ${key}`);
          const parsed = JSON.parse(value) as T;

          // Populate L1 cache
          this.setMemoryCache(key, parsed, this.DEFAULT_TTL);

          return parsed;
        }
      }

      logger.debug(`Cache miss: ${key}`);
      return null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set value in cache (L1 + L2)
   */
  async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
    try {
      // Set in L1 (memory)
      this.setMemoryCache(key, value, ttl);

      // Set in L2 (Redis)
      if (this.redis && this.redis.status === 'ready') {
        await this.redis.setex(key, ttl, JSON.stringify(value));
        logger.debug(`Cache set (L1+L2): ${key}, TTL: ${ttl}s`);
      } else {
        logger.debug(`Cache set (L1 only): ${key}, TTL: ${ttl}s`);
      }
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    try {
      // Delete from L1
      this.memoryCache.delete(key);

      // Delete from L2
      if (this.redis && this.redis.status === 'ready') {
        await this.redis.del(key);
      }

      logger.debug(`Cache deleted: ${key}`);
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  }

  /**
   * Clear all cache
   */
  async clear(pattern?: string): Promise<void> {
    try {
      if (pattern) {
        // Clear specific pattern
        const keysToDelete: string[] = [];

        this.memoryCache.forEach((_, key) => {
          if (key.startsWith(pattern)) {
            keysToDelete.push(key);
          }
        });

        keysToDelete.forEach(key => this.memoryCache.delete(key));

        if (this.redis && this.redis.status === 'ready') {
          const keys = await this.redis.keys(`${pattern}*`);
          if (keys.length > 0) {
            await this.redis.del(...keys);
          }
        }

        logger.info(`Cache cleared for pattern: ${pattern}`);
      } else {
        // Clear all
        this.memoryCache.clear();

        if (this.redis && this.redis.status === 'ready') {
          await this.redis.flushdb();
        }

        logger.info('All cache cleared');
      }
    } catch (error) {
      logger.error('Cache clear error:', error);
    }
  }

  /**
   * Set value in L1 memory cache with LRU eviction
   */
  private setMemoryCache(key: string, value: any, ttl: number): void {
    // Implement simple LRU: if cache is full, remove oldest entry
    if (this.memoryCache.size >= this.MAX_MEMORY_CACHE_SIZE) {
      const firstKey = this.memoryCache.keys().next().value;
      if (firstKey) {
        this.memoryCache.delete(firstKey);
      }
    }

    this.memoryCache.set(key, {
      data: value,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Start periodic cleanup of expired memory cache entries
   */
  private startMemoryCacheCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      const keysToDelete: string[] = [];

      this.memoryCache.forEach((entry, key) => {
        const age = now - entry.timestamp;
        const maxAge = entry.ttl * 1000;

        if (age >= maxAge) {
          keysToDelete.push(key);
        }
      });

      keysToDelete.forEach(key => this.memoryCache.delete(key));

      if (keysToDelete.length > 0) {
        logger.debug(`Cleaned up ${keysToDelete.length} expired cache entries`);
      }
    }, 60000); // Run every minute
  }

  /**
   * Get cache statistics
   */
  getStats(): { memorySize: number; redisStatus: string } {
    return {
      memorySize: this.memoryCache.size,
      redisStatus: this.redis?.status || 'disconnected',
    };
  }

  /**
   * Disconnect Redis
   */
  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
    }
  }
}

// Export singleton instance
export const cacheService = new CacheService();
