import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import winston from 'winston';

// Mock winston
vi.mock('winston', () => ({
  default: {
    createLogger: vi.fn(() => ({
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
      add: vi.fn(),
    })),
    format: {
      combine: vi.fn((...args) => args),
      timestamp: vi.fn(() => 'timestamp'),
      errors: vi.fn(() => 'errors'),
      json: vi.fn(() => 'json'),
      printf: vi.fn((fn) => fn),
      colorize: vi.fn(() => 'colorize'),
      simple: vi.fn(() => 'simple'),
    },
    transports: {
      Console: vi.fn(),
      File: vi.fn(),
    },
  },
}));

vi.mock('@/config/env', () => ({
  env: {
    NODE_ENV: 'test',
  },
  isDevelopment: false,
}));

describe('Logger Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clear module cache
    delete require.cache[require.resolve('./logger')];
    delete require.cache[require.resolve('@/config/env')];
  });

  describe('Logger Creation', () => {
    it('should create a winston logger instance', () => {
      require('./logger');

      expect(winston.createLogger).toHaveBeenCalled();
    });

    it('should use info level in production', () => {
      vi.doMock('@/config/env', () => ({
        env: { NODE_ENV: 'production' },
        isDevelopment: false,
      }));

      delete require.cache[require.resolve('./logger')];
      require('./logger');

      expect(winston.createLogger).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'info',
        })
      );
    });

    it('should use debug level in development', () => {
      vi.doMock('@/config/env', () => ({
        env: { NODE_ENV: 'development' },
        isDevelopment: true,
      }));

      delete require.cache[require.resolve('./logger')];
      require('./logger');

      expect(winston.createLogger).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'debug',
        })
      );
    });

    it('should include service metadata', () => {
      require('./logger');

      expect(winston.createLogger).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultMeta: { service: 'the-copy-backend' },
        })
      );
    });
  });

  describe('Format Configuration', () => {
    it('should combine multiple formats', () => {
      require('./logger');

      expect(winston.format.combine).toHaveBeenCalled();
    });

    it('should include timestamp format', () => {
      require('./logger');

      expect(winston.format.timestamp).toHaveBeenCalled();
    });

    it('should include errors format with stack traces', () => {
      require('./logger');

      expect(winston.format.errors).toHaveBeenCalledWith({ stack: true });
    });

    it('should include JSON format', () => {
      require('./logger');

      expect(winston.format.json).toHaveBeenCalled();
    });

    it('should include custom printf format', () => {
      require('./logger');

      expect(winston.format.printf).toHaveBeenCalled();
    });
  });

  describe('Transport Configuration', () => {
    it('should include Console transport', () => {
      require('./logger');

      expect(winston.transports.Console).toHaveBeenCalled();
    });

    it('should use colored simple format in development', () => {
      vi.doMock('@/config/env', () => ({
        env: { NODE_ENV: 'development' },
        isDevelopment: true,
      }));

      delete require.cache[require.resolve('./logger')];
      require('./logger');

      expect(winston.format.colorize).toHaveBeenCalled();
      expect(winston.format.simple).toHaveBeenCalled();
    });

    it('should add file transport in production for errors', () => {
      vi.doMock('@/config/env', () => ({
        env: { NODE_ENV: 'production' },
        isDevelopment: false,
      }));

      delete require.cache[require.resolve('./logger')];
      const { logger } = require('./logger');

      expect(logger.add).toHaveBeenCalledWith(
        expect.objectContaining({
          filename: 'logs/error.log',
          level: 'error',
        })
      );
    });

    it('should add file transport in production for all logs', () => {
      vi.doMock('@/config/env', () => ({
        env: { NODE_ENV: 'production' },
        isDevelopment: false,
      }));

      delete require.cache[require.resolve('./logger')];
      const { logger } = require('./logger');

      expect(logger.add).toHaveBeenCalledWith(
        expect.objectContaining({
          filename: 'logs/combined.log',
        })
      );
    });

    it('should not add file transports in development', () => {
      vi.doMock('@/config/env', () => ({
        env: { NODE_ENV: 'development' },
        isDevelopment: true,
      }));

      delete require.cache[require.resolve('./logger')];
      const { logger } = require('./logger');

      // File transport should not be added in development
      expect(winston.transports.File).not.toHaveBeenCalled();
    });
  });

  describe('Logger Export', () => {
    it('should export logger instance', () => {
      const { logger } = require('./logger');

      expect(logger).toBeDefined();
      expect(logger.info).toBeDefined();
      expect(logger.error).toBeDefined();
      expect(logger.warn).toBeDefined();
      expect(logger.debug).toBeDefined();
    });
  });

  describe('Log Format', () => {
    it('should format logs with timestamp, level, and message', () => {
      const { logger } = require('./logger');

      // Get the printf formatter function
      const printfCall = (winston.format.printf as any).mock.calls[0][0];

      const formatted = printfCall({
        timestamp: '2024-01-01T00:00:00.000Z',
        level: 'info',
        message: 'Test message',
        service: 'test-service',
      });

      const parsed = JSON.parse(formatted);

      expect(parsed.timestamp).toBe('2024-01-01T00:00:00.000Z');
      expect(parsed.level).toBe('info');
      expect(parsed.message).toBe('Test message');
      expect(parsed.service).toBe('test-service');
    });

    it('should include additional metadata in logs', () => {
      const { logger } = require('./logger');

      const printfCall = (winston.format.printf as any).mock.calls[0][0];

      const formatted = printfCall({
        timestamp: '2024-01-01T00:00:00.000Z',
        level: 'error',
        message: 'Error message',
        userId: '123',
        requestId: 'req-456',
      });

      const parsed = JSON.parse(formatted);

      expect(parsed.userId).toBe('123');
      expect(parsed.requestId).toBe('req-456');
    });
  });

  describe('Environment-Specific Behavior', () => {
    it('should behave differently in test environment', () => {
      vi.doMock('@/config/env', () => ({
        env: { NODE_ENV: 'test' },
        isDevelopment: false,
      }));

      delete require.cache[require.resolve('./logger')];
      require('./logger');

      expect(winston.createLogger).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'info',
        })
      );
    });

    it('should handle staging environment', () => {
      vi.doMock('@/config/env', () => ({
        env: { NODE_ENV: 'staging' },
        isDevelopment: false,
      }));

      delete require.cache[require.resolve('./logger')];
      require('./logger');

      expect(winston.createLogger).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'info',
        })
      );
    });
  });
});
