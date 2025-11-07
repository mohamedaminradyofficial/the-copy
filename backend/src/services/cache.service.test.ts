// File: backend/src/services/cache.service.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CacheService } from './cache.service';
import Redis from 'ioredis';

// Mock Redis
vi.mock('ioredis', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      status: 'ready',
      connect: vi.fn().mockResolvedValue(undefined),
      get: vi.fn(),
      setex: vi.fn(),
      del: vi.fn(),
      keys: vi.fn(),
      flushdb: vi.fn(),
      quit: vi.fn(),
      on: vi.fn(),
    })),
  };
});

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock Sentry
vi.mock('@sentry/node', () => ({
  startTransaction: vi.fn(() => ({
    setTag: vi.fn(),
    setData: vi.fn(),
    setStatus: vi.fn(),
    finish: vi.fn(),
  })),
  captureException: vi.fn(),
}));

describe('CacheService', () => {
  let cacheService: CacheService;
  let mockRedis: any;

  beforeEach(() => {
    // Reset environment
    process.env.REDIS_URL = undefined;
    process.env.REDIS_HOST = 'localhost';
    process.env.REDIS_PORT = '6379';
    
    // Create new instance
    cacheService = new CacheService();
    
    // Get mock Redis instance
    mockRedis = (cacheService as any).redis;
  });

  afterEach(async () => {
    await cacheService.disconnect();
    vi.clearAllMocks();
  });

  describe('L1/L2 Caching', () => {
    it('should get value from L1 cache when available', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };
      const ttl = 3600;

      // Set in L1 cache directly
      await cacheService.set(key, value, ttl);

      // Get should return from L1
      const result = await cacheService.get(key);
      expect(result).toEqual(value);

      // Verify Redis was not called
      expect(mockRedis?.get).not.toHaveBeenCalled();

      // Verify metrics
      const stats = cacheService.getStats();
      expect(stats.metrics.hits.l1).toBe(1);
      expect(stats.metrics.hits.total).toBe(1);
      expect(stats.metrics.misses).toBe(0);
    });

    it('should get value from L2 cache when L1 misses', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };
      const serializedValue = JSON.stringify(value);

      // Mock Redis get to return value
      mockRedis.get.mockResolvedValue(serializedValue);

      // Get should fetch from L2 and populate L1
      const result = await cacheService.get(key);
      expect(result).toEqual(value);

      // Verify Redis was called
      expect(mockRedis.get).toHaveBeenCalledWith(key);

      // Verify L1 was populated
      const l1Result = await cacheService.get(key);
      expect(l1Result).toEqual(value);

      // Verify metrics
      const stats = cacheService.getStats();
      expect(stats.metrics.hits.l2).toBe(1);
      expect(stats.metrics.hits.total).toBe(2); // L2 hit + L1 hit
      expect(stats.metrics.misses).toBe(0);
    });

    it('should return null on cache miss', async () => {
      const key = 'non-existent-key';

      // Mock Redis get to return null
      mockRedis.get.mockResolvedValue(null);

      const result = await cacheService.get(key);
      expect(result).toBeNull();

      // Verify metrics
      const stats = cacheService.getStats();
      expect(stats.metrics.misses).toBe(1);
      expect(stats.metrics.hits.total).toBe(0);
    });

    it('should set value in both L1 and L2 cache', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };
      const ttl = 3600;

      await cacheService.set(key, value, ttl);

      // Verify L1 has the value
      const l1Result = await cacheService.get(key);
      expect(l1Result).toEqual(value);

      // Verify Redis was called
      expect(mockRedis.setex).toHaveBeenCalledWith(
        key,
        ttl,
        JSON.stringify(value)
      );

      // Verify metrics
      const stats = cacheService.getStats();
      expect(stats.metrics.sets).toBe(1);
    });

    it('should handle expired L1 cache entries', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };
      const shortTtl = 1; // 1 second

      // Set with short TTL
      await cacheService.set(key, value, shortTtl);

      // Verify it's in L1
      const immediateResult = await cacheService.get(key);
      expect(immediateResult).toEqual(value);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Mock Redis to return null (expired)
      mockRedis.get.mockResolvedValue(null);

      // Should miss after expiration
      const expiredResult = await cacheService.get(key);
      expect(expiredResult).toBeNull();

      // Verify metrics
      const stats = cacheService.getStats();
      expect(stats.metrics.misses).toBe(1);
    });
  });

  describe('Fallback Behavior', () => {
    it('should fallback to L1 when Redis is unavailable', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      // Set Redis status to disconnected
      mockRedis.status = 'disconnected';

      // Set should still work (L1 only)
      await cacheService.set(key, value);

      // Get should work from L1
      const result = await cacheService.get(key);
      expect(result).toEqual(value);

      // Verify Redis was not called
      expect(mockRedis.setex).not.toHaveBeenCalled();
      expect(mockRedis.get).not.toHaveBeenCalled();
    });

    it('should fallback to L1 when Redis connection fails', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      // Set Redis to throw error
      mockRedis.status = 'ready';
      mockRedis.setex.mockRejectedValue(new Error('Redis connection failed'));

      // Set should still work (L1 only)
      await cacheService.set(key, value);

      // Get should work from L1
      const result = await cacheService.get(key);
      expect(result).toEqual(value);

      // Verify metrics show error
      const stats = cacheService.getStats();
      expect(stats.metrics.errors).toBeGreaterThan(0);
    });

    it('should handle Redis get errors gracefully', async () => {
      const key = 'test-key';

      // Mock Redis to throw error
      mockRedis.status = 'ready';
      mockRedis.get.mockRejectedValue(new Error('Redis get failed'));

      // Get should return null without throwing
      const result = await cacheService.get(key);
      expect(result).toBeNull();

      // Verify metrics
      const stats = cacheService.getStats();
      expect(stats.metrics.errors).toBeGreaterThan(0);
      expect(stats.metrics.misses).toBe(1);
    });

    it('should track Redis connection health', async () => {
      // Initially disconnected
      mockRedis.status = 'disconnected';
      
      const stats1 = cacheService.getStats();
      expect(stats1.metrics.redisConnectionHealth.status).toBe('disconnected');

      // Simulate connection
      mockRedis.status = 'ready';
      (cacheService as any).updateRedisHealth('connected');

      const stats2 = cacheService.getStats();
      expect(stats2.metrics.redisConnectionHealth.status).toBe('connected');
      expect(stats2.metrics.redisConnectionHealth.consecutiveFailures).toBe(0);
    });
  });

  describe('Validation', () => {
    it('should validate TTL and use default for invalid values', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      // Test negative TTL
      await cacheService.set(key, value, -1);
      const stats = cacheService.getStats();
      expect(stats.metrics.sets).toBe(1);

      // Test TTL exceeding MAX_TTL
      await cacheService.set('key2', value, 100000);
      const stats2 = cacheService.getStats();
      expect(stats2.metrics.sets).toBe(2);
    });

    it('should reject values exceeding MAX_VALUE_SIZE', async () => {
      const key = 'test-key';
      // Create a value larger than 1MB
      const largeValue = { data: 'x'.repeat(1024 * 1024 + 1) };

      await cacheService.set(key, largeValue);

      // Value should not be cached
      const result = await cacheService.get(key);
      expect(result).toBeNull();

      // Verify Redis was not called
      expect(mockRedis.setex).not.toHaveBeenCalled();
    });

    it('should validate cache key format', () => {
      const prefix = 'test';
      const data = { id: 123, name: 'test' };

      const key = cacheService.generateKey(prefix, data);
      expect(key).toMatch(/^test:[a-f0-9]{16}$/);
    });

    it('should generate consistent keys for same data', () => {
      const prefix = 'test';
      const data = { id: 123, name: 'test' };

      const key1 = cacheService.generateKey(prefix, data);
      const key2 = cacheService.generateKey(prefix, data);

      expect(key1).toBe(key2);
    });

    it('should generate different keys for different data', () => {
      const prefix = 'test';
      const data1 = { id: 123 };
      const data2 = { id: 456 };

      const key1 = cacheService.generateKey(prefix, data1);
      const key2 = cacheService.generateKey(prefix, data2);

      expect(key1).not.toBe(key2);
    });
  });

  describe('Cache Operations', () => {
    it('should delete from both L1 and L2', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      // Set value
      await cacheService.set(key, value);

      // Verify it exists
      expect(await cacheService.get(key)).toEqual(value);

      // Delete
      await cacheService.delete(key);

      // Verify it's gone
      expect(await cacheService.get(key)).toBeNull();

      // Verify Redis del was called
      expect(mockRedis.del).toHaveBeenCalledWith(key);

      // Verify metrics
      const stats = cacheService.getStats();
      expect(stats.metrics.deletes).toBe(1);
    });

    it('should clear all cache', async () => {
      // Set multiple values
      await cacheService.set('key1', { data: 'value1' });
      await cacheService.set('key2', { data: 'value2' });

      // Clear all
      await cacheService.clear();

      // Verify all are gone
      expect(await cacheService.get('key1')).toBeNull();
      expect(await cacheService.get('key2')).toBeNull();

      // Verify Redis flushdb was called
      expect(mockRedis.flushdb).toHaveBeenCalled();
    });

    it('should clear cache by pattern', async () => {
      // Set values with different prefixes
      await cacheService.set('prefix1:key1', { data: 'value1' });
      await cacheService.set('prefix1:key2', { data: 'value2' });
      await cacheService.set('prefix2:key1', { data: 'value3' });

      // Clear only prefix1
      await cacheService.clear('prefix1:');

      // Verify prefix1 keys are gone
      expect(await cacheService.get('prefix1:key1')).toBeNull();
      expect(await cacheService.get('prefix1:key2')).toBeNull();

      // Verify prefix2 key still exists
      expect(await cacheService.get('prefix2:key1')).toEqual({ data: 'value3' });
    });
  });

  describe('LRU Eviction', () => {
    it('should evict oldest entry when cache is full', async () => {
      const MAX_SIZE = 100;

      // Fill cache to max size
      for (let i = 0; i < MAX_SIZE; i++) {
        await cacheService.set(`key-${i}`, { data: `value-${i}` });
      }

      // Verify cache is at max size
      const stats1 = cacheService.getStats();
      expect(stats1.memorySize).toBe(MAX_SIZE);

      // Add one more entry
      await cacheService.set('new-key', { data: 'new-value' });

      // Verify cache size is still MAX_SIZE (oldest evicted)
      const stats2 = cacheService.getStats();
      expect(stats2.memorySize).toBe(MAX_SIZE);

      // Verify oldest entry is gone
      expect(await cacheService.get('key-0')).toBeNull();

      // Verify new entry exists
      expect(await cacheService.get('new-key')).toEqual({ data: 'new-value' });
    });
  });

  describe('Metrics', () => {
    it('should track cache hit rates', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      // Set and get multiple times
      await cacheService.set(key, value);
      await cacheService.get(key); // Hit
      await cacheService.get(key); // Hit
      await cacheService.get('miss-key'); // Miss

      const stats = cacheService.getStats();
      expect(stats.hitRate).toBe(66.67); // 2 hits / 3 requests = 66.67%
      expect(stats.metrics.hits.total).toBe(2);
      expect(stats.metrics.misses).toBe(1);
    });

    it('should reset metrics', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      // Generate some metrics
      await cacheService.set(key, value);
      await cacheService.get(key);
      await cacheService.get('miss');

      const statsBefore = cacheService.getStats();
      expect(statsBefore.metrics.hits.total).toBeGreaterThan(0);

      // Reset metrics
      cacheService.resetMetrics();

      const statsAfter = cacheService.getStats();
      expect(statsAfter.metrics.hits.total).toBe(0);
      expect(statsAfter.metrics.misses).toBe(0);
      expect(statsAfter.metrics.sets).toBe(0);
    });

    it('should track Redis connection health', async () => {
      const stats = cacheService.getStats();
      
      expect(stats.metrics.redisConnectionHealth).toBeDefined();
      expect(stats.metrics.redisConnectionHealth.status).toBeDefined();
      expect(stats.metrics.redisConnectionHealth.lastCheck).toBeDefined();
      expect(stats.metrics.redisConnectionHealth.consecutiveFailures).toBeDefined();
    });
  });

  describe('Type Safety', () => {
    it('should preserve type information with generics', async () => {
      interface TestType {
        id: number;
        name: string;
      }

      const key = 'typed-key';
      const value: TestType = { id: 1, name: 'test' };

      await cacheService.set<TestType>(key, value);
      const result = await cacheService.get<TestType>(key);

      expect(result).toEqual(value);
      if (result) {
        // TypeScript should infer the type
        expect(typeof result.id).toBe('number');
        expect(typeof result.name).toBe('string');
      }
    });

    it('should handle different value types', async () => {
      // String
      await cacheService.set('string-key', 'string-value');
      expect(await cacheService.get<string>('string-key')).toBe('string-value');

      // Number
      await cacheService.set('number-key', 42);
      expect(await cacheService.get<number>('number-key')).toBe(42);

      // Array
      await cacheService.set('array-key', [1, 2, 3]);
      expect(await cacheService.get<number[]>('array-key')).toEqual([1, 2, 3]);

      // Object
      await cacheService.set('object-key', { nested: { value: 'test' } });
      expect(await cacheService.get<{ nested: { value: string } }>('object-key')).toEqual({
        nested: { value: 'test' },
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle JSON parse errors gracefully', async () => {
      const key = 'test-key';
      const invalidJson = 'invalid-json';

      // Mock Redis to return invalid JSON
      mockRedis.get.mockResolvedValue(invalidJson);

      // Should handle error gracefully
      const result = await cacheService.get(key);
      // Result depends on implementation, but should not throw
      expect(result).toBeDefined();
    });

    it('should handle Redis connection errors', async () => {
      // Simulate Redis initialization failure
      const originalRedis = (cacheService as any).redis;
      (cacheService as any).redis = null;

      // Operations should still work with L1 only
      await cacheService.set('test-key', { data: 'value' });
      const result = await cacheService.get('test-key');
      expect(result).toEqual({ data: 'value' });

      // Restore Redis
      (cacheService as any).redis = originalRedis;
    });
  });
});


