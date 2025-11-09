/**
 * Redis Health Check Utility
 */

import Redis from 'ioredis';
import { logger } from './logger';

let redisClient: Redis | null = null;

/**
 * Check if Redis is available
 */
export async function checkRedisHealth(): Promise<boolean> {
  try {
    if (!redisClient) {
      const config: any = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        retryStrategy: () => null,
      };
      
      if (process.env.REDIS_PASSWORD) {
        config.password = process.env.REDIS_PASSWORD;
      }
      
      redisClient = new Redis(config);
    }

    await redisClient.ping();
    logger.info('[Redis] Health check passed');
    return true;
  } catch (error) {
    logger.warn('[Redis] Health check failed:', error);
    return false;
  }
}

/**
 * Get Redis status for monitoring
 */
export async function getRedisStatus() {
  const isHealthy = await checkRedisHealth();
  
  return {
    status: isHealthy ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  };
}

/**
 * Close Redis connection
 */
export async function closeRedisConnection() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}