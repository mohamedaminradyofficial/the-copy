import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

// Mock dependencies
vi.mock('@neondatabase/serverless', () => ({
  Pool: vi.fn(),
  neonConfig: {
    webSocketConstructor: undefined,
  },
}));

vi.mock('drizzle-orm/neon-serverless', () => ({
  drizzle: vi.fn(),
}));

vi.mock('ws', () => ({
  default: vi.fn(),
}));

vi.mock('./schema', () => ({
  // Mock schema exports
  users: {},
  sessions: {},
}));

describe('Database Module', () => {
  const originalEnv = process.env.DATABASE_URL;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original env
    if (originalEnv) {
      process.env.DATABASE_URL = originalEnv;
    }
  });

  describe('Initialization', () => {
    it('should throw error when DATABASE_URL is not set', () => {
      // Remove DATABASE_URL temporarily
      delete process.env.DATABASE_URL;

      // Expect import to throw
      expect(() => {
        // Re-import module to trigger initialization
        delete require.cache[require.resolve('./index')];
        require('./index');
      }).toThrow('DATABASE_URL must be set');
    });

    it('should initialize Pool with DATABASE_URL', () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';

      // Clear cache and re-import
      delete require.cache[require.resolve('./index')];
      const db = require('./index');

      expect(Pool).toHaveBeenCalledWith({
        connectionString: 'postgresql://test:test@localhost:5432/testdb',
      });
    });

    it('should configure neon websocket constructor', () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';

      // Clear cache and re-import
      delete require.cache[require.resolve('./index')];
      const { neonConfig } = require('@neondatabase/serverless');

      expect(neonConfig.webSocketConstructor).toBeDefined();
    });

    it('should call drizzle with pool and schema', () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';

      // Mock pool instance
      const mockPool = { query: vi.fn() };
      (Pool as any).mockImplementation(() => mockPool);

      // Clear cache and re-import
      delete require.cache[require.resolve('./index')];
      require('./index');

      expect(drizzle).toHaveBeenCalledWith(
        expect.objectContaining({
          client: mockPool,
          schema: expect.any(Object),
        })
      );
    });
  });

  describe('Exports', () => {
    beforeEach(() => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
    });

    it('should export pool instance', () => {
      delete require.cache[require.resolve('./index')];
      const { pool } = require('./index');

      expect(pool).toBeDefined();
    });

    it('should export db instance', () => {
      delete require.cache[require.resolve('./index')];
      const { db } = require('./index');

      expect(db).toBeDefined();
    });
  });

  describe('Configuration', () => {
    it('should use correct connection string format', () => {
      const testUrl = 'postgresql://user:pass@host:5432/db?sslmode=require';
      process.env.DATABASE_URL = testUrl;

      delete require.cache[require.resolve('./index')];
      require('./index');

      expect(Pool).toHaveBeenCalledWith({
        connectionString: testUrl,
      });
    });

    it('should handle connection strings with special characters', () => {
      const complexUrl = 'postgresql://user%40name:p%40ss@host:5432/db';
      process.env.DATABASE_URL = complexUrl;

      delete require.cache[require.resolve('./index')];
      require('./index');

      expect(Pool).toHaveBeenCalledWith({
        connectionString: complexUrl,
      });
    });
  });

  describe('Error Handling', () => {
    it('should provide helpful error message for missing DATABASE_URL', () => {
      delete process.env.DATABASE_URL;

      try {
        delete require.cache[require.resolve('./index')];
        require('./index');
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('DATABASE_URL must be set');
        expect(error.message).toContain('Did you forget to provision a database?');
      }
    });

    it('should throw on empty DATABASE_URL', () => {
      process.env.DATABASE_URL = '';

      expect(() => {
        delete require.cache[require.resolve('./index')];
        require('./index');
      }).toThrow();
    });
  });
});
