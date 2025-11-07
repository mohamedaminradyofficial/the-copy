// Sentry Edge Configuration with Performance Monitoring
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,

    // Debug mode
    debug: process.env.NODE_ENV === "development",

    // Edge runtime has limited integrations
    integrations: [],

    // Custom transaction naming
    beforeSendTransaction(event) {
      // Group similar middleware routes together
      if (event.transaction?.startsWith('/api/')) {
        event.transaction = event.transaction.replace(/\/[0-9a-f-]{36}/g, '/:id');
      }
      return event;
    },

    // Higher sampling for important edge routes
    tracesSampler(samplingContext) {
      const pathname = samplingContext.name || '';

      // Always sample API routes
      if (pathname.includes('/api/')) {
        return 1.0;
      }

      return process.env.NODE_ENV === "production" ? 0.2 : 1.0;
    },
  });

  console.log('[Sentry] Edge runtime initialized with performance monitoring');
} else {
  console.warn('[Sentry] DSN not configured, monitoring disabled');
}
