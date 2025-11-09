/**
 * Redis Configuration and Version Compatibility Check
 *
 * Handles Redis connection configuration and version validation for BullMQ
 */

import Redis from 'ioredis';
import { logger } from '@/utils/logger';

const BULLMQ_MIN_REDIS_VERSION = '5.0.0';

/**
 * Parse Redis URL or use individual configuration
 */
export function getRedisConfig() {
  const baseConfig = {
    maxRetriesPerRequest: null, // Required for BullMQ
    enableReadyCheck: false,
    retryStrategy(times: number) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  };

  // If REDIS_URL is provided, parse it and merge with base config
  if (process.env.REDIS_URL) {
    const url = new URL(process.env.REDIS_URL);
    return {
      ...baseConfig,
      host: url.hostname,
      port: url.port ? parseInt(url.port) : 6379,
      ...(url.password && { password: url.password }),
    };
  }

  // Otherwise use individual variables
  return {
    ...baseConfig,
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
  };
}

/**
 * Parse version string to comparable number
 * Example: "5.0.7" -> 5000007, "3.0.504" -> 3000504
 */
function parseVersion(version: string): number {
  const parts = version.split('.').map(Number);
  return (parts[0] || 0) * 1000000 + (parts[1] || 0) * 1000 + (parts[2] || 0);
}

/**
 * Check if Redis version is compatible with BullMQ
 */
export async function checkRedisVersion(): Promise<{
  compatible: boolean;
  version: string;
  minVersion: string;
  reason?: string;
}> {
  let client: Redis | null = null;

  try {
    const config = getRedisConfig();
    client = new Redis(config);

    // Wait for connection
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Redis connection timeout'));
      }, 5000);

      if (client) {
        client.once('ready', () => {
          clearTimeout(timeout);
          resolve();
        });

        client.once('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      }
    });

    // Get server info
    const info = await client.info('server');
    const versionMatch = info.match(/redis_version:(\S+)/);

    if (!versionMatch) {
      return {
        compatible: false,
        version: 'unknown',
        minVersion: BULLMQ_MIN_REDIS_VERSION,
        reason: 'Could not detect Redis version',
      };
    }

    const currentVersion = versionMatch[1] || 'unknown';
    const currentVersionNum = parseVersion(currentVersion);
    const minVersionNum = parseVersion(BULLMQ_MIN_REDIS_VERSION);

    const compatible = currentVersionNum >= minVersionNum;

    if (compatible) {
      return {
        compatible,
        version: currentVersion,
        minVersion: BULLMQ_MIN_REDIS_VERSION,
      };
    }

    return {
      compatible,
      version: currentVersion,
      minVersion: BULLMQ_MIN_REDIS_VERSION,
      reason: `BullMQ requires Redis >= ${BULLMQ_MIN_REDIS_VERSION}`,
    };
  } catch (error) {
    logger.error('Redis version check failed:', error);
    return {
      compatible: false,
      version: 'unknown',
      minVersion: BULLMQ_MIN_REDIS_VERSION,
      reason: error instanceof Error ? error.message : 'Connection failed',
    };
  } finally {
    if (client) {
      client.disconnect();
    }
  }
}

export default {
  getRedisConfig,
  checkRedisVersion,
  BULLMQ_MIN_REDIS_VERSION,
};
