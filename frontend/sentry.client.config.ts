// Sentry Client Configuration with Performance Monitoring
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Trace propagation targets (configured at top level)
    tracePropagationTargets: [
      'localhost',
      /^\//,
      process.env.NEXT_PUBLIC_API_URL || '',
    ],

    // Session Replay
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Debug mode
    debug: process.env.NODE_ENV === "development",

    // Integrations
    integrations: [
      // Session replay for debugging
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),

      // Browser tracing for performance monitoring
      Sentry.browserTracingIntegration({
        enableInp: true,
      }),

      // Browser profiling (for detailed performance data)
      Sentry.browserProfilingIntegration(),
    ],

    // Performance metrics
    profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Track specific errors
    beforeSend(event, hint) {
      // Filter out certain errors in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Sentry] Captured event:', event);
      }

      // Don't send cancelled requests
      if (event.exception?.values?.[0]?.value?.includes('cancelled')) {
        return null;
      }

      return event;
    },

    // Enhance context
    beforeBreadcrumb(breadcrumb, hint) {
      // Add more context to navigation breadcrumbs
      if (breadcrumb.category === 'navigation') {
        breadcrumb.data = {
          ...breadcrumb.data,
          timestamp: new Date().toISOString(),
        };
      }
      return breadcrumb;
    },

    // Track specific transactions
    tracesSampler(samplingContext) {
      // Higher sampling rate for important routes
      const pathname = samplingContext.location?.pathname || '';

      if (pathname.includes('/api/') || pathname.includes('/directors-studio')) {
        return 1.0; // 100% sampling for important routes
      }

      return process.env.NODE_ENV === "production" ? 0.1 : 1.0;
    },
  });

  console.log('[Sentry] Client initialized with performance monitoring');
} else {
  console.warn('[Sentry] DSN not configured, monitoring disabled');
}
