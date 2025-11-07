/**
 * Sentry Configuration for Backend
 * 
 * Error tracking and performance monitoring
 */

import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { env } from './env';

/**
 * Initialize Sentry monitoring
 */
export function initializeSentry() {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    console.warn('[Sentry] DSN not configured, monitoring disabled');
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('[Sentry] Skipping initialization in non-production environment');
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    
    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% of requests in production
    profilesSampleRate: 0.1, // 10% profiling
    
    // Integrations
    integrations: [
      // Performance profiling
      nodeProfilingIntegration(),
    ],

    // Before sending events
    beforeSend(event, hint) {
      // Filter out non-critical errors
      const error = hint.originalException;
      
      if (error instanceof Error) {
        // Don't send expected errors
        if (error.message.includes('ECONNREFUSED') || 
            error.message.includes('timeout')) {
          return null;
        }
      }

      return event;
    },

    // Before sending breadcrumbs
    beforeBreadcrumb(breadcrumb, hint) {
      // Add more context to HTTP breadcrumbs
      if (breadcrumb.category === 'http') {
        breadcrumb.data = {
          ...breadcrumb.data,
          timestamp: new Date().toISOString(),
        };
      }
      return breadcrumb;
    },
  });

  console.log('[Sentry] Backend monitoring initialized');
}

/**
 * Capture exception with context
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    if (context) {
      Sentry.withScope((scope) => {
        scope.setContext('custom', context);
        Sentry.captureException(error);
      });
    } else {
      Sentry.captureException(error);
    }
  } else {
    console.error('[Sentry] Exception:', error, context);
  }
}

/**
 * Capture message with context
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    if (context) {
      Sentry.withScope((scope) => {
        scope.setContext('custom', context);
        Sentry.captureMessage(message, level);
      });
    } else {
      Sentry.captureMessage(message, level);
    }
  } else {
    console.log(`[Sentry] ${level.toUpperCase()}: ${message}`, context);
  }
}

/**
 * Track performance metric
 */
export function trackMetric(name: string, value: number, unit: string = 'ms') {
  if (process.env.NODE_ENV === 'production') {
    Sentry.metrics.gauge(name, value, {
      unit,
    });
  } else {
    console.log(`[Metric] ${name}: ${value}${unit}`);
  }
}

export { Sentry };

