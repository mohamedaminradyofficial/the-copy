// Sentry Server Configuration with Performance Monitoring
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

    // Integrations
    integrations: [
      // HTTP integration for tracking outgoing requests
      Sentry.httpIntegration({
        tracing: {
          // Track these hosts
          targets: [
            'localhost',
            process.env.BACKEND_URL || '',
            'googleapis.com',
          ],
        },
      }),

      // Node profiling for detailed performance data
      Sentry.nodeProfilingIntegration(),
    ],

    // Profiling
    profilesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,

    // Track database queries and external calls
    beforeSend(event, hint) {
      // Add server context
      if (event.request) {
        event.request.headers = {
          ...event.request.headers,
          'x-server-time': new Date().toISOString(),
        };
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[Sentry Server] Captured event:', event);
      }

      return event;
    },

    // Custom transaction naming
    beforeSendTransaction(event) {
      // Group similar API routes together
      if (event.transaction?.startsWith('/api/')) {
        // Normalize IDs in transaction names
        event.transaction = event.transaction.replace(/\/[0-9a-f-]{36}/g, '/:id');
      }

      return event;
    },

    // Higher sampling for slow transactions
    tracesSampler(samplingContext) {
      const pathname = samplingContext.name || '';

      // Always sample API routes and AI operations
      if (pathname.includes('/api/') || pathname.includes('/genkit/')) {
        return 1.0;
      }

      return process.env.NODE_ENV === "production" ? 0.2 : 1.0;
    },
  });

  console.log('[Sentry] Server initialized with performance monitoring');
} else {
  console.warn('[Sentry] DSN not configured, monitoring disabled');
}
