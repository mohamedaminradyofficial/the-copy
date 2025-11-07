# Redis & Sentry Setup Guide

This guide will help you configure Redis for caching and job queues, and set up Sentry for error tracking and performance monitoring.

## Table of Contents

1. [Redis Configuration](#redis-configuration)
2. [Sentry Configuration](#sentry-configuration)
3. [Verification Steps](#verification-steps)
4. [Bundle Analysis](#bundle-analysis)
5. [Troubleshooting](#troubleshooting)

---

## Redis Configuration

### Overview

Redis is used for:
- **Caching**: Multi-tier caching system (L1: Memory, L2: Redis)
- **Job Queues**: BullMQ for background job processing (AI analysis, document processing)

### Option 1: Using Docker Compose (Recommended for Development)

The project includes a Redis service in `backend/docker-compose.yml`.

1. **Start Redis**:
   ```bash
   cd backend
   docker-compose up -d redis
   ```

2. **Verify Redis is running**:
   ```bash
   docker ps | grep redis
   # Should show: the-copy-redis
   ```

3. **Test Redis connection**:
   ```bash
   docker exec -it the-copy-redis redis-cli ping
   # Should return: PONG
   ```

### Option 2: Local Redis Installation

1. **Install Redis** (macOS):
   ```bash
   brew install redis
   brew services start redis
   ```

2. **Install Redis** (Ubuntu/Debian):
   ```bash
   sudo apt-get update
   sudo apt-get install redis-server
   sudo systemctl start redis-server
   sudo systemctl enable redis-server
   ```

3. **Install Redis** (Windows):
   - Download from: https://github.com/microsoftarchive/redis/releases
   - Or use WSL2 with Ubuntu installation above

### Option 3: Standalone Docker Container

```bash
# Start Redis container
docker run -d \
  --name redis-dev \
  -p 6379:6379 \
  redis:7-alpine
```

### Production

For production, use a managed Redis service:

- **Redis Cloud**: https://redis.com/cloud/
- **AWS ElastiCache**: https://aws.amazon.com/elasticache/
- **Azure Cache for Redis**: https://azure.microsoft.com/services/cache/
- **Google Cloud Memorystore**: https://cloud.google.com/memorystore

### Configuration

The application will gracefully degrade if Redis is unavailable:
- Caching will fall back to in-memory cache only
- Job queues will not function (but API endpoints will still work)

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

Add these to your `.env` file (root directory) or `backend/.env`:

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

**Note**: The backend supports both formats:
- `REDIS_HOST` + `REDIS_PORT` + `REDIS_PASSWORD` (used by BullMQ queues)
- `REDIS_URL` (used by cache service, can also be constructed from individual variables)

### Setting a Redis Password (Optional but Recommended)

If using Docker Compose, set the password in your `.env`:

```bash
REDIS_PASSWORD=your_secure_password_here
```

The docker-compose.yml will automatically configure Redis with this password.

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

## Sentry Configuration

### Step 1: Create a Sentry Account

1. **Sign up for Sentry**:
   - Go to: https://sentry.io/signup/
   - Choose the free plan (Developer plan) or upgrade as needed
   - Complete the signup process

2. **Create a New Project**:
   - After logging in, click "Create Project"
   - Select **Next.js** as your platform
   - Choose a project name (e.g., "the-copy-frontend")
   - Select your organization

3. **Get Your DSN**:
   - After creating the project, Sentry will show you a DSN
   - It looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`
   - Copy this DSN - you'll need it for configuration

### Step 2: Get Sentry Auth Token

1. **Navigate to Auth Tokens**:
   - Go to: https://sentry.io/settings/account/api/auth-tokens/
   - Click "Create New Token"

2. **Configure Token**:
   - **Name**: `the-copy-sourcemaps` (or any descriptive name)
   - **Scopes**: Select:
     - `project:read`
     - `project:releases`
     - `project:write`
   - Click "Create Token"

3. **Copy the Token**:
   - ⚠️ **Important**: Copy the token immediately - you won't be able to see it again!
   - Save it securely

### Step 3: Get Organization and Project Names

1. **Organization Slug**:
   - Go to: https://sentry.io/settings/
   - Your organization slug is shown in the URL or settings page
   - Example: If URL is `https://sentry.io/settings/your-org/`, slug is `your-org`

2. **Project Name**:
   - Go to your project settings: https://sentry.io/settings/your-org/projects/your-project/
   - The project name (slug) is shown in the URL
   - Example: If URL ends with `/projects/your-project/`, slug is `your-project`

### Step 4: Configure Environment Variables

Add these to your `.env` file (root directory) or `frontend/.env.local`:

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

**Note**: `NEXT_PUBLIC_*` variables are exposed to the browser. Only use `NEXT_PUBLIC_SENTRY_DSN` for client-side tracking. Server-side Sentry uses `SENTRY_DSN` (without `NEXT_PUBLIC_`).

### Step 5: Verify Configuration

The Sentry configuration files are already set up:
- `frontend/sentry.client.config.ts` - Client-side tracking
- `frontend/sentry.server.config.ts` - Server-side tracking
- `frontend/sentry.edge.config.ts` - Edge runtime tracking

Sentry will automatically initialize when `NEXT_PUBLIC_SENTRY_DSN` is set.

### Step 6: Upload Source Maps (Production Only)

Source maps help Sentry show you the original source code instead of minified code.

**Important**: Only upload source maps for production builds!

```bash
cd frontend
npm run sentry:sourcemaps
```

Or manually:
```bash
npx @sentry/cli sourcemaps inject --org $SENTRY_ORG --project $SENTRY_PROJECT .next
npx @sentry/cli sourcemaps upload --org $SENTRY_ORG --project $SENTRY_PROJECT .next
```

This command:
1. Injects source maps into the build
2. Uploads them to Sentry
3. Associates them with your release

Or it's automatically done in CI/CD if configured (see `.github/workflows/ci-cd.yml`).

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

## Verification Steps

### Redis Verification

Run the verification script:
```bash
node scripts/verify-redis-sentry.js
```

Or manually check:

1. **Check Redis connection**:
   ```bash
   # Using redis-cli
   redis-cli ping
   # Should return: PONG
   
   # Or with password
   redis-cli -a your_password ping
   ```

2. **Check backend logs**:
   ```bash
   cd backend
   npm run dev
   # Look for: "[Redis] Connected successfully" or "[Redis] Ready to accept commands"
   ```

3. **Test cache service**:
   ```bash
   curl http://localhost:3001/api/health
   # Check logs for cache service initialization
   ```

4. **Verify Queue Workers**:
   Check backend logs for:
   ```
   [QueueSystem] Initializing workers...
   [QueueSystem] All workers initialized
   [Worker:ai-analysis] Worker registered
   [Worker:document-processing] Worker registered
   ```

### Sentry Verification

1. **Check Console Logs**:
   - Development: Should see `[Sentry] Client initialized with performance monitoring`
   - If DSN missing: `[Sentry] DSN not configured, monitoring disabled`

2. **Test Error Capture**:
   - Add a test error in your code
   - Check Sentry dashboard for the error

3. **Check Build**:
   ```bash
   cd frontend
   npm run build
   # Should see Sentry webpack plugin output if configured
   ```

4. **Send test event**:
   ```javascript
   // In browser console
   Sentry.captureMessage('Test from setup guide');
   ```

5. **Check Sentry dashboard**:
   - Go to: https://sentry.io/
   - Navigate to your project
   - You should see the test message in "Issues" or "Performance"

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

**Problem**: Redis connection fails

**Solutions**:
1. Check Redis is running:
   ```bash
   redis-cli ping
   ```

2. Verify environment variables are set correctly

3. Check Redis password (if set):
   ```bash
   redis-cli -a your_password ping
   ```

4. Check Redis logs:
   ```bash
   # Docker
   docker logs the-copy-redis
   
   # Local
   tail -f /var/log/redis/redis-server.log
   ```

5. Verify port is not blocked:
   ```bash
   netstat -an | grep 6379
   # or
   lsof -i :6379
   ```

6. For Docker: Ensure container is running:
   ```bash
   docker ps | grep redis
   ```

**Problem**: Cache service falls back to memory-only

**Solutions**:
- Check backend logs for Redis connection errors
- Verify `REDIS_URL` or `REDIS_HOST`/`REDIS_PORT` are set
- Ensure Redis is accessible from backend container/host
- This is expected if Redis is not configured - the app will work with in-memory cache only

**Problem**: Queue workers not starting

**Solutions**:
1. Check Redis connection (workers require Redis)
2. Verify `REDIS_HOST`, `REDIS_PORT` are correct
3. Check backend logs for Redis connection errors
4. Ensure Redis is accessible from backend server

### Sentry Issues

**Problem**: "DSN not configured" warning

**Solutions**:
1. Verify `NEXT_PUBLIC_SENTRY_DSN` is set in `.env.local`
2. Restart the dev server after adding env vars
3. Check the DSN format is correct (starts with `https://`)

**Problem**: Source maps upload fails

**Solutions**:
1. Verify `SENTRY_AUTH_TOKEN` has correct scopes
2. Check `SENTRY_ORG` and `SENTRY_PROJECT` are correct
3. Ensure you've built the app first: `npm run build`
4. Check token hasn't expired (create a new one if needed)
5. Run manually: `npm run sentry:sourcemaps`

**Problem**: No events appearing in Sentry

**Solutions**:
1. Check browser console for Sentry errors
2. Verify DSN is correct
3. Check Sentry project settings → Client Keys (DSN)
4. Ensure you're looking at the correct project in Sentry dashboard
5. Check if there are any ad blockers interfering
6. Check Sentry project settings → Inbound Filters (might be filtering)

**Problem**: Performance monitoring not working

**Solutions**:
1. Verify `tracesSampleRate` is > 0 in sentry config files
2. Check Sentry → Performance tab (not just Issues)
3. Ensure you're navigating through the app (transactions are created on navigation)

---

## Next Steps

After completing setup:

1. ✅ Configure Redis environment variables
2. ✅ Set up Sentry account and add DSN
3. ✅ Run bundle analyzer: `npm run analyze`
4. ✅ Verify Redis connection
5. ✅ Test Sentry error tracking
6. ✅ Monitor performance metrics

**Monitor Redis**:
- Check cache hit rates
- Monitor queue health
- Review Redis memory usage

**Monitor Sentry**:
- Set up alerts for critical errors
- Review performance metrics
- Configure release tracking
- Monitor Performance tab for slow transactions

**Review Performance Guide**:
- See `PERFORMANCE_OPTIMIZATION_GUIDE.md` for detailed usage
- Learn about cache strategies
- Understand job queue patterns

---

## Additional Resources

- [Redis Documentation](https://redis.io/docs/)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Performance Optimization Guide](./PERFORMANCE_OPTIMIZATION_GUIDE.md)

---

## Quick Reference

### Redis Commands

```bash
# Start Redis (Docker)
docker-compose up -d redis

# Check Redis status
redis-cli ping

# Monitor Redis
redis-cli monitor

# Check Redis info
redis-cli info
```

### Sentry Commands

```bash
# Upload source maps
cd frontend
npm run sentry:sourcemaps

# Test Sentry in browser console
Sentry.captureMessage('Test');
```

### Environment Variables Checklist

- [ ] `REDIS_HOST` or `REDIS_URL`
- [ ] `REDIS_PORT` (if using HOST)
- [ ] `REDIS_PASSWORD` (if required)
- [ ] `NEXT_PUBLIC_SENTRY_DSN`
- [ ] `SENTRY_ORG`
- [ ] `SENTRY_PROJECT`
- [ ] `SENTRY_AUTH_TOKEN`
