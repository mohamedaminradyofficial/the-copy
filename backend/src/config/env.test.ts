import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';

describe('Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('env validation', () => {
    it('should parse valid environment variables', async () => {
      process.env.NODE_ENV = 'development';
      process.env.PORT = '3001';
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
      process.env.JWT_SECRET = 'secret';
      process.env.CORS_ORIGIN = 'http://localhost:5000';
      process.env.RATE_LIMIT_WINDOW_MS = '900000';
      process.env.RATE_LIMIT_MAX_REQUESTS = '100';

      const { env } = await import('./env');

      expect(env.NODE_ENV).toBe('development');
      expect(env.PORT).toBe(3001);
      expect(env.DATABASE_URL).toBe('postgresql://user:pass@localhost:5432/db');
      expect(env.JWT_SECRET).toBe('secret');
      expect(env.CORS_ORIGIN).toBe('http://localhost:5000');
      expect(env.RATE_LIMIT_WINDOW_MS).toBe(900000);
      expect(env.RATE_LIMIT_MAX_REQUESTS).toBe(100);
    });

    it('should use default values when not provided', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db';
      delete process.env.NODE_ENV;
      delete process.env.PORT;
      delete process.env.JWT_SECRET;

      const { env } = await import('./env');

      expect(env.NODE_ENV).toBe('development');
      expect(env.PORT).toBe(3001);
      expect(env.JWT_SECRET).toBe('dev-secret-change-in-production');
    });

    it('should validate NODE_ENV enum', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db';
      process.env.NODE_ENV = 'production';

      const { env } = await import('./env');

      expect(env.NODE_ENV).toBe('production');
    });

    it('should handle test environment', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db';
      process.env.NODE_ENV = 'test';

      const { env } = await import('./env');

      expect(env.NODE_ENV).toBe('test');
    });

    it('should transform string PORT to number', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db';
      process.env.PORT = '8080';

      const { env } = await import('./env');

      expect(typeof env.PORT).toBe('number');
      expect(env.PORT).toBe(8080);
    });

    it('should transform rate limit values to numbers', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db';
      process.env.RATE_LIMIT_WINDOW_MS = '600000';
      process.env.RATE_LIMIT_MAX_REQUESTS = '50';

      const { env } = await import('./env');

      expect(typeof env.RATE_LIMIT_WINDOW_MS).toBe('number');
      expect(typeof env.RATE_LIMIT_MAX_REQUESTS).toBe('number');
      expect(env.RATE_LIMIT_WINDOW_MS).toBe(600000);
      expect(env.RATE_LIMIT_MAX_REQUESTS).toBe(50);
    });
  });

  describe('isDevelopment helper', () => {
    it('should return true for development environment', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db';
      process.env.NODE_ENV = 'development';

      const { isDevelopment } = await import('./env');

      expect(isDevelopment).toBe(true);
    });

    it('should return false for production environment', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db';
      process.env.NODE_ENV = 'production';

      const { isDevelopment } = await import('./env');

      expect(isDevelopment).toBe(false);
    });

    it('should return false for test environment', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db';
      process.env.NODE_ENV = 'test';

      const { isDevelopment } = await import('./env');

      expect(isDevelopment).toBe(false);
    });
  });

  describe('optional environment variables', () => {
    it('should handle optional GOOGLE_GENAI_API_KEY', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db';
      delete process.env.GOOGLE_GENAI_API_KEY;

      const { env } = await import('./env');

      expect(env.GOOGLE_GENAI_API_KEY).toBeUndefined();
    });

    it('should handle optional GEMINI_API_KEY', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db';
      delete process.env.GEMINI_API_KEY;

      const { env } = await import('./env');

      expect(env.GEMINI_API_KEY).toBeUndefined();
    });

    it('should accept GOOGLE_GENAI_API_KEY when provided', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/db';
      process.env.GOOGLE_GENAI_API_KEY = 'test-key';

      const { env } = await import('./env');

      expect(env.GOOGLE_GENAI_API_KEY).toBe('test-key');
    });
  });
});
