/**
 * Redis Configuration and Version Compatibility Check
 *
 * Handles Redis connection configuration and version validation for BullMQ
 */

import { createClient, RedisClientType } from 'redis';
import { logger } from '@/utils/logger';

const BULLMQ_MIN_REDIS_VERSION = '5.0.0';

/**
 * Parse Redis URL or use individual configuration
 */
export function getRedisConfig() {
  // If REDIS_URL is provided, use it directly
  if (process.env.REDIS_URL) {
    return {
      url: process.env.REDIS_URL,
    };
  }

  // Otherwise use individual variables
  return {
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      reconnectStrategy: (retries: number) => {
        if (retries > 10) {
          logger.error('Redis retry attempts exhausted');
          return false;
        }
        return Math.min(retries * 100, 3000);
      },
    },
    password: process.env.REDIS_PASSWORD || undefined,
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
  let client: RedisClientType | null = null;

  try {
    const config = getRedisConfig();
    client = createClient(config);

    // Wait for connection
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Redis connection timeout'));
      }, 5000);

      if (client) {
        client.on('ready', () => {
          clearTimeout(timeout);
          resolve();
        });

        client.on('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      }
    });

    // Connect to Redis
    await client.connect();

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
      await client.disconnect();
    }
  }
}

export default {
  getRedisConfig,
  checkRedisVersion,
  BULLMQ_MIN_REDIS_VERSION,
};
