/**
 * Sentry Middleware for Express
 * 
 * Captures errors and performance data
 */

import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';

/**
 * Sentry request handler - must be first middleware
 */
export const sentryRequestHandler = Sentry.Handlers.requestHandler();

/**
 * Sentry tracing handler for performance monitoring
 */
export const sentryTracingHandler = Sentry.Handlers.tracingHandler();

/**
 * Sentry error handler - must be before other error handlers
 */
export const sentryErrorHandler = Sentry.Handlers.errorHandler({
  shouldHandleError(error) {
    // Capture all errors with status >= 500
    return true;
  },
});

/**
 * Custom error tracking middleware
 */
export function trackError(req: Request, res: Response, next: NextFunction) {
  const originalSend = res.send;

  res.send = function (data: any) {
    if (res.statusCode >= 400) {
      Sentry.addBreadcrumb({
        message: `HTTP ${res.statusCode} on ${req.method} ${req.path}`,
        level: res.statusCode >= 500 ? 'error' : 'warning',
        data: {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          userId: (req as any).user?.id,
        },
      });
    }

    return originalSend.call(this, data);
  };

  next();
}

/**
 * Performance tracking middleware
 */
export function trackPerformance(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    // Track slow requests (> 1s)
    if (duration > 1000) {
      Sentry.addBreadcrumb({
        message: `Slow request: ${req.method} ${req.path}`,
        level: 'warning',
        data: {
          duration,
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
        },
      });
    }

    // Track metrics
    Sentry.metrics.distribution('http.request.duration', duration, {
      tags: {
        method: req.method,
        route: req.route?.path || req.path,
        status: res.statusCode.toString(),
      },
      unit: 'millisecond',
    });
  });

  next();
}

