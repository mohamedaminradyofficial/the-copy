# Sentry Setup Guide

This guide explains how to configure Sentry for error tracking and performance monitoring in The Copy project.

## Overview

Sentry provides:
- **Error Tracking**: Capture and track errors across client, server, and edge runtimes
- **Performance Monitoring**: Track transaction times and identify bottlenecks
- **Session Replay**: Record user sessions for debugging
- **Profiling**: Detailed performance profiling for both client and server

## Quick Start

### 1. Create Sentry Account

1. Go to https://sentry.io/signup/
2. Create a free account or sign in
3. Create a new project (choose Next.js)
4. Copy your DSN (Data Source Name)

### 2. Get Configuration Values

From your Sentry project settings, you'll need:

- **DSN**: `https://xxxxx@o0.ingest.sentry.io/xxxxx`
- **Organization Slug**: Found in URL: `https://sentry.io/organizations/{org-slug}/`
- **Project Name**: Your project name
- **Auth Token**: Settings → Auth Tokens → Create New Token (with `project:releases` scope)

### 3. Configure Environment Variables

#### Frontend Configuration

Add to `frontend/.env.local`:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-public-key@o0.ingest.sentry.io/project-id
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-name
SENTRY_AUTH_TOKEN=your-auth-token
```

#### Backend Configuration

Add to `backend/.env`:

```bash
# Sentry Configuration
SENTRY_DSN=https://your-server-key@o0.ingest.sentry.io/project-id
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-name
SENTRY_AUTH_TOKEN=your-auth-token
```

**Note**: Use different DSNs for frontend (`NEXT_PUBLIC_SENTRY_DSN`) and backend (`SENTRY_DSN`) if you want separate projects, or the same DSN if using one project.

### 4. Verify Configuration

Restart your development server and check console logs:

```
[Sentry] Client initialized with performance monitoring
[Sentry] Server initialized with performance monitoring
```

If you see warnings about DSN not configured, check your environment variables.

## Configuration Details

### Client-Side (Browser)

Located in `frontend/sentry.client.config.ts`:

- **Traces Sample Rate**: 10% in production, 100% in development
- **Replay Sample Rate**: 10% in production, 100% in development
- **Profiling**: Enabled with 10% sampling
- **Important Routes**: 100% sampling for `/api/*` and `/directors-studio`

### Server-Side (Node.js)

Located in `frontend/sentry.server.config.ts`:

- **Traces Sample Rate**: 20% in production, 100% in development
- **Profiling**: Enabled with 20% sampling
- **HTTP Integration**: Tracks outgoing requests
- **Always Sampled**: API routes and Genkit operations

### Edge Runtime

Located in `frontend/sentry.edge.config.ts`:

- Configured for Next.js Edge runtime
- Minimal configuration for edge functions

## Usage

### Manual Error Reporting

```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // Your code
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'ai-analysis',
    },
    contexts: {
      analysis: {
        projectId: 'project-123',
        type: 'scene',
      },
    },
  });
}
```

### Performance Tracking

```typescript
import * as Sentry from '@sentry/nextjs';

const transaction = Sentry.startTransaction({
  op: 'ai-analysis',
  name: 'Analyze Scene',
});

try {
  const result = await analyzeScene();
  transaction.setStatus('ok');
} catch (error) {
  transaction.setStatus('internal_error');
  throw error;
} finally {
  transaction.finish();
}
```

### Custom Breadcrumbs

```typescript
Sentry.addBreadcrumb({
  category: 'user-action',
  message: 'User started scene analysis',
  level: 'info',
  data: {
    sceneId: 'scene-123',
    timestamp: new Date().toISOString(),
  },
});
```

### Set User Context

```typescript
Sentry.setUser({
  id: 'user-123',
  email: 'user@example.com',
  username: 'johndoe',
});
```

## Source Maps (Production)

To get readable stack traces in production, upload source maps:

### Automatic Upload (CI/CD)

The project includes GitHub Actions workflow that automatically uploads source maps on build.

### Manual Upload

```bash
cd frontend
npm run sentry:sourcemaps
```

Or manually:

```bash
npx @sentry/cli sourcemaps inject .next
npx @sentry/cli sourcemaps upload \
  --org $SENTRY_ORG \
  --project $SENTRY_PROJECT \
  .next
```

## Monitoring Dashboard

### Access Your Dashboard

1. Go to https://sentry.io/
2. Select your organization
3. Select your project
4. View:
   - **Issues**: All errors and exceptions
   - **Performance**: Transaction performance metrics
   - **Releases**: Release tracking and source maps
   - **Replays**: Session replays for debugging

### Key Metrics to Monitor

1. **Error Rate**: Target < 0.1% for client, < 0.01% for server
2. **Transaction Times**: Track P95/P99 percentiles
3. **Apdex Score**: Application performance index
4. **Throughput**: Requests per minute

## Alerts

### Set Up Alerts

1. Go to Alerts → Create Alert Rule
2. Configure:
   - **Trigger**: Error count > threshold
   - **Conditions**: Error rate, transaction duration
   - **Actions**: Email, Slack, PagerDuty

### Recommended Alerts

- **Critical Errors**: Any error with level "fatal"
- **High Error Rate**: > 1% error rate
- **Slow Transactions**: P95 > 3 seconds
- **New Issues**: New error types

## Best Practices

### 1. Error Filtering

Filter out noise in `beforeSend`:

```typescript
beforeSend(event, hint) {
  // Don't send cancelled requests
  if (event.exception?.values?.[0]?.value?.includes('cancelled')) {
    return null;
  }
  
  // Don't send 404s
  if (event.request?.url?.includes('404')) {
    return null;
  }
  
  return event;
}
```

### 2. Sampling Rates

Adjust sampling rates based on traffic:
- **High traffic**: Lower sampling (5-10%)
- **Low traffic**: Higher sampling (50-100%)
- **Critical routes**: 100% sampling

### 3. Release Tracking

Tag releases with version:

```typescript
Sentry.setTag('release', process.env.NEXT_PUBLIC_APP_VERSION);
```

### 4. Environment Tagging

Automatically tag by environment:

```typescript
Sentry.setTag('environment', process.env.NODE_ENV);
```

### 5. User Privacy

Be mindful of PII (Personally Identifiable Information):

```typescript
// Don't send sensitive data
Sentry.setUser({
  id: 'user-123', // OK
  // email: user.email, // Only if necessary
  // username: user.name, // Only if necessary
});
```

## Troubleshooting

### Sentry Not Initializing

1. **Check DSN is set**:
   ```bash
   echo $NEXT_PUBLIC_SENTRY_DSN
   ```

2. **Check browser console** for initialization logs

3. **Test manually**:
   ```typescript
   Sentry.captureMessage('Test message');
   ```

### Source Maps Not Working

1. **Verify source maps are uploaded**:
   - Check Sentry → Releases → Source Maps

2. **Check build includes source maps**:
   ```bash
   ls .next/static/chunks/*.map
   ```

3. **Verify release version matches**:
   - Check Sentry release version matches your deployment

### Performance Data Missing

1. **Check sampling rates** are not 0
2. **Verify transactions are being created**:
   ```typescript
   const transaction = Sentry.startTransaction({...});
   ```
3. **Check Sentry dashboard** → Performance tab

### High Volume/Quota Issues

1. **Reduce sampling rates**:
   ```typescript
   tracesSampleRate: 0.05, // 5% instead of 10%
   ```

2. **Filter out non-critical routes**:
   ```typescript
   tracesSampler(samplingContext) {
     if (samplingContext.location?.pathname?.includes('/_next')) {
       return 0; // Don't sample Next.js internals
     }
     return 0.1;
   }
   ```

## Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [Next.js Sentry Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)

## Support

For issues:
1. Check Sentry dashboard for error details
2. Review this guide's troubleshooting section
3. Check Sentry documentation
4. Contact Sentry support if needed
