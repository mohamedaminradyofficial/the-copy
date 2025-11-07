# Redis and Sentry Setup Guide

This guide will help you configure Redis for caching and job queues, and set up Sentry for error tracking and performance monitoring.

## Table of Contents

1. [Redis Setup](#redis-setup)
2. [Sentry Setup](#sentry-setup)
3. [Verification](#verification)
4. [Bundle Analysis](#bundle-analysis)

---

## Redis Setup

### Overview

Redis is used for:
- **Caching**: Multi-tier caching system (L1: Memory, L2: Redis)
- **Job Queues**: BullMQ for background job processing (AI analysis, document processing)

### Option 1: Using Docker (Recommended for Development)

The project includes a Docker Compose configuration with Redis:

```bash
cd backend
docker-compose up -d redis
```

This will start Redis on `localhost:6379` with password protection (if configured).

### Option 2: Local Installation

#### macOS (Homebrew)
```bash
brew install redis
brew services start redis
```

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

#### Windows
Download from: https://github.com/microsoftarchive/redis/releases

### Configuration

Redis can be configured using either:

**Option A: Individual variables** (recommended for Docker/local)
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password  # Optional, leave empty if no password
```

**Option B: Redis URL** (recommended for cloud providers)
```bash
REDIS_URL=redis://:password@host:6379
# Or without password:
REDIS_URL=redis://localhost:6379
```

### Environment Variables

Add to your `.env` files:

**Root `.env`:**
```bash
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
# OR use REDIS_URL instead:
# REDIS_URL=redis://localhost:6379
```

**Backend `.env`:**
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

**Frontend `.env.local`:**
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

### Testing Redis Connection

```bash
# Using redis-cli
redis-cli ping
# Should return: PONG

# With password
redis-cli -a your_password ping

# Test from Node.js
node -e "const Redis = require('ioredis'); const r = new Redis({host: 'localhost', port: 6379}); r.ping().then(console.log).then(() => r.quit());"
```

### Redis Features

#### Caching
- **L1 Cache**: In-memory LRU cache (100 items max, 60s TTL)
- **L2 Cache**: Redis distributed cache (configurable TTL)
- **Automatic Fallback**: Falls back to memory-only if Redis unavailable

#### Job Queues
- **AI Analysis Queue**: Processes AI-powered analysis tasks
- **Document Processing Queue**: Handles document parsing
- **Automatic Retries**: 3 attempts with exponential backoff
- **Job Retention**: 24h completed, 7d failed

### Monitoring

Check queue statistics:
```bash
curl http://localhost:3001/api/queue/stats
```

---

## Sentry Setup

### Overview

Sentry provides:
- **Error Tracking**: Capture and track errors across the application
- **Performance Monitoring**: Track transaction times and identify bottlenecks
- **Session Replay**: Record user sessions for debugging
- **Profiling**: Detailed performance profiling for client and server

### Step 1: Create Sentry Account

1. Go to https://sentry.io/signup/
2. Create a free account (or sign in if you have one)
3. Create a new project:
   - Select **Next.js** as the platform
   - Choose your organization
   - Name your project (e.g., "the-copy")

### Step 2: Get Your DSN

After creating the project, Sentry will show you a **DSN** (Data Source Name). It looks like:
```
https://abc123def456@o1234567.ingest.sentry.io/1234567
```

Copy this DSN - you'll need it for configuration.

### Step 3: Get Auth Token (for Source Maps)

1. Go to https://sentry.io/settings/account/api/auth-tokens/
2. Click **Create New Token**
3. Select scopes:
   - `project:read`
   - `project:releases`
   - `project:write`
4. Copy the token (you won't see it again!)

### Step 4: Configure Environment Variables

Add to your `.env` files:

**Root `.env`:**
```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-sentry-org-slug
SENTRY_PROJECT=your-sentry-project-name
SENTRY_AUTH_TOKEN=your-auth-token
```

**Frontend `.env.local`:**
```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-sentry-org-slug
SENTRY_PROJECT=your-sentry-project-name
SENTRY_AUTH_TOKEN=your-auth-token
```

**Backend `.env`:**
```bash
# Sentry Configuration (if using Sentry SDK in backend)
SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### Step 5: Verify Configuration

The Sentry configuration files are already set up:
- `frontend/sentry.client.config.ts` - Client-side tracking
- `frontend/sentry.server.config.ts` - Server-side tracking
- `frontend/sentry.edge.config.ts` - Edge runtime tracking

Sentry will automatically initialize when `NEXT_PUBLIC_SENTRY_DSN` is set.

### Step 6: Upload Source Maps (Production)

For production builds, upload source maps to Sentry:

```bash
cd frontend
npm run sentry:sourcemaps
```

Or manually:
```bash
npx @sentry/cli sourcemaps inject --org $SENTRY_ORG --project $SENTRY_PROJECT .next
npx @sentry/cli sourcemaps upload --org $SENTRY_ORG --project $SENTRY_PROJECT .next
```

### Sentry Features

#### Client-Side
- **Traces Sample Rate**: 10% production, 100% development
- **Replay Sample Rate**: 10% production, 100% development
- **Profiling**: Enabled with 10% sampling
- **Important Routes**: 100% sampling for `/api/*` and `/directors-studio`

#### Server-Side
- **Traces Sample Rate**: 20% production, 100% development
- **Profiling**: Enabled with 20% sampling
- **Always Sampled**: API routes and Genkit operations

### Testing Sentry

Test error tracking:
```typescript
import * as Sentry from '@sentry/nextjs';

// Test error capture
Sentry.captureMessage('Test message from The Copy', 'info');

// Test exception capture
try {
  throw new Error('Test error');
} catch (error) {
  Sentry.captureException(error);
}
```

Check your Sentry dashboard to see the events.

---

## Verification

### Verify Redis Setup

Run the verification script:
```bash
node scripts/verify-redis-sentry.js
```

Or manually check:

**Backend:**
```bash
cd backend
npm run dev
# Look for: "[Redis] Connected successfully" or "[Redis] Ready to accept commands"
```

**Frontend:**
```bash
cd frontend
npm run dev
# Check console for Redis connection messages
```

**Test Cache Service:**
```bash
curl http://localhost:3001/api/health
# Check logs for cache service initialization
```

### Verify Sentry Setup

1. **Check Console Logs:**
   - Development: Should see `[Sentry] Client initialized with performance monitoring`
   - If DSN missing: `[Sentry] DSN not configured, monitoring disabled`

2. **Test Error Capture:**
   - Add a test error in your code
   - Check Sentry dashboard for the error

3. **Check Build:**
   ```bash
   cd frontend
   npm run build
   # Should see Sentry webpack plugin output if configured
   ```

---

## Bundle Analysis

### Run Bundle Analyzer

Visualize your bundle sizes:

```bash
cd frontend
npm run analyze
```

This will:
1. Build the application with bundle analysis enabled
2. Generate an interactive HTML report
3. Open it in your browser automatically

### Understanding the Report

The bundle analyzer shows:
- **Framework Bundle**: React, Next.js (~500KB target)
- **Vendor Bundles**: Third-party libraries (~300KB each target)
- **Page Chunks**: Individual route bundles (~50-100KB each target)
- **Total Bundle Size**: Should be optimized for performance

### Optimization Tips

Based on the report:
1. **Large Dependencies**: Consider code splitting or alternatives
2. **Duplicate Code**: Check for duplicate dependencies
3. **Unused Code**: Remove unused imports and dependencies
4. **Dynamic Imports**: Use dynamic imports for heavy components

### Performance Budgets

Target bundle sizes:
- **Initial Load**: < 200KB gzipped
- **Framework**: ~500KB
- **Vendor Bundles**: ~300KB each
- **Page Chunks**: ~50-100KB each

---

## Troubleshooting

### Redis Issues

**Connection Refused:**
```bash
# Check if Redis is running
redis-cli ping

# Check Docker container
docker ps | grep redis

# Check logs
docker logs the-copy-redis
```

**Authentication Failed:**
- Verify `REDIS_PASSWORD` matches Redis server password
- Check if Redis requires password: `redis-cli CONFIG GET requirepass`

**Fallback to Memory Cache:**
- This is expected if Redis is unavailable
- Check logs for connection errors
- Verify environment variables are set correctly

### Sentry Issues

**DSN Not Configured:**
- Verify `NEXT_PUBLIC_SENTRY_DSN` is set in `.env.local`
- Restart dev server after adding environment variables
- Check that DSN format is correct

**Source Maps Not Uploading:**
- Verify `SENTRY_AUTH_TOKEN` has correct permissions
- Check `SENTRY_ORG` and `SENTRY_PROJECT` match your Sentry account
- Ensure you're running the command from `frontend/` directory

**No Events in Dashboard:**
- Check browser console for Sentry initialization logs
- Verify DSN is correct
- Test with `Sentry.captureMessage('test')`
- Check Sentry project settings for data scrubbing rules

---

## Next Steps

1. ✅ Configure Redis environment variables
2. ✅ Set up Sentry account and add DSN
3. ✅ Run bundle analyzer: `npm run analyze`
4. ✅ Verify Redis connection
5. ✅ Test Sentry error tracking
6. ✅ Monitor performance metrics

For more details, see:
- [PERFORMANCE_OPTIMIZATION_GUIDE.md](./PERFORMANCE_OPTIMIZATION_GUIDE.md)
- [Backend Documentation](./backend/README.md)
- [Frontend README](./frontend/README.md)
