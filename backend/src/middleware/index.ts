import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

export const setupMiddleware = (app: express.Application): void => {
  // Security middleware
  app.use(helmet());
  
  // CORS configuration - Strict security with multiple origins
  const allowedOrigins = env.CORS_ORIGIN.split(',').map(origin => origin.trim());
  
  app.use(cors({
    origin: (origin, callback) => {
      // In production, only allow specified origins
      if (process.env.NODE_ENV === 'production') {
        if (origin && allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          logger.warn(`CORS blocked request from origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      } else {
        // In development, allow localhost and specified origins
        if (!origin || allowedOrigins.includes(origin) || origin.includes('localhost')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 600, // Cache preflight requests for 10 minutes
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }));

  // Compression
  app.use(compression() as any);

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Rate limiting - General API rate limit
  const generalLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS, // 15 minutes by default
    max: env.RATE_LIMIT_MAX_REQUESTS, // 100 requests per window by default
    message: {
      success: false,
      error: 'تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Strict rate limiting for authentication endpoints (prevent brute force)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    skipSuccessfulRequests: false, // Count all requests
    message: {
      success: false,
      error: 'تم تجاوز عدد محاولات تسجيل الدخول، يرجى المحاولة بعد 15 دقيقة',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Moderate rate limiting for AI-intensive endpoints
  const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 AI requests per hour
    message: {
      success: false,
      error: 'تم تجاوز الحد المسموح من طلبات التحليل بالذكاء الاصطناعي، يرجى المحاولة لاحقاً',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply general rate limiting to all API routes
  app.use('/api/', generalLimiter);

  // Apply stricter rate limiting to auth endpoints
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/signup', authLimiter);

  // Apply AI-specific rate limiting to analysis endpoints
  app.use('/api/analysis/', aiLimiter);
  app.use('/api/projects/:id/analyze', aiLimiter);

  // Request logging
  app.use((req, res, next) => {
    logger.info('Request received', {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    next();
  });
};

// Export validation utilities
export { validateBody, validateQuery, validateParams, commonSchemas, detectAttacks } from './validation.middleware';

// Error handling middleware - must be registered separately in server.ts after all routes
export const errorHandler = (
  error: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  logger.error('Unhandled error:', error);
  
  res.status(500).json({
    success: false,
    error: 'حدث خطأ داخلي في الخادم',
  });
};