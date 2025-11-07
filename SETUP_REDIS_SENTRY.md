# Redis & Sentry Setup Guide

This guide will help you configure Redis for caching and job queues, and set up Sentry for error tracking and performance monitoring.

## Table of Contents

1. [Redis Configuration](#redis-configuration)
2. [Sentry Configuration](#sentry-configuration)
3. [Verification Steps](#verification-steps)
4. [Troubleshooting](#troubleshooting)

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

### Environment Variables

Add these to your `.env` file (root directory) or `backend/.env`:

```bash
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password  # Optional, leave empty if no password

# Alternative: Use REDIS_URL (if your Redis provider gives you a connection string)
# REDIS_URL=redis://:password@host:port
```

**Note**: The backend supports both formats:
- `REDIS_HOST` + `REDIS_PORT` + `REDIS_PASSWORD` (used by BullMQ queues)
- `REDIS_URL` (used by cache service)

### Setting a Redis Password (Optional but Recommended)

If using Docker Compose, set the password in your `.env`:

```bash
REDIS_PASSWORD=your_secure_password_here
```

The docker-compose.yml will automatically configure Redis with this password.

### Verify Redis Configuration

1. **Check backend logs** when starting:
   ```bash
   cd backend
   npm run dev
   ```

   Look for:
   - `✅ Redis cache connected successfully` (cache service)
   - `[QueueManager] Queue initialized` (job queues)

2. **Test cache service**:
   ```bash
   # In backend, you can check cache stats via API
   curl http://localhost:3001/api/health
   ```

3. **Test job queue**:
   ```bash
   # Check queue stats (if queue controller is set up)
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
     - `org:read`
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

```bash
# Sentry Configuration
# Get these from https://sentry.io/settings/

# Public DSN (exposed to browser - safe to expose)
NEXT_PUBLIC_SENTRY_DSN=https://your-public-key@o0.ingest.sentry.io/your-project-id

# Server-side DSN (optional, same as public DSN usually)
SENTRY_DSN=https://your-public-key@o0.ingest.sentry.io/your-project-id

# Organization slug (for sourcemaps upload)
SENTRY_ORG=your-org-slug

# Project name/slug (for sourcemaps upload)
SENTRY_PROJECT=your-project-slug

# Auth token (for uploading sourcemaps - keep secret!)
SENTRY_AUTH_TOKEN=your-auth-token-here
```

### Step 5: Verify Sentry Integration

1. **Check browser console** (when running frontend):
   ```bash
   cd frontend
   npm run dev
   ```

   Look for:
   - `[Sentry] Client initialized with performance monitoring` ✅
   - Or: `[Sentry] DSN not configured, monitoring disabled` ⚠️

2. **Test error tracking**:
   - Open browser console
   - Run: `Sentry.captureMessage('Test message from console')`
   - Check your Sentry dashboard - you should see the message appear

3. **Test in code**:
   ```typescript
   import * as Sentry from '@sentry/nextjs';
   
   // In your component or API route
   Sentry.captureException(new Error('Test error'));
   ```

### Step 6: Upload Source Maps (Production Only)

Source maps help Sentry show you the original source code instead of minified code.

**Important**: Only upload source maps for production builds!

```bash
cd frontend

# Build the application first
npm run build

# Upload source maps
npm run sentry:sourcemaps
```

This command:
1. Injects source maps into the build
2. Uploads them to Sentry
3. Associates them with your release

---

## Verification Steps

### Redis Verification

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
   # Look for: "Redis cache connected successfully"
   ```

3. **Test cache**:
   - Make an API request that uses caching
   - Check logs for cache hits/misses
   - Cache stats should show Redis status as "ready"

### Sentry Verification

1. **Check initialization**:
   - Open browser console
   - Look for Sentry initialization message
   - No errors related to Sentry

2. **Send test event**:
   ```javascript
   // In browser console
   Sentry.captureMessage('Test from setup guide');
   ```

3. **Check Sentry dashboard**:
   - Go to: https://sentry.io/
   - Navigate to your project
   - You should see the test message in "Issues" or "Performance"

4. **Verify performance monitoring**:
   - Navigate through your app
   - Check Sentry → Performance tab
   - You should see transactions being recorded

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

**Problem**: Cache service falls back to memory-only

**Solutions**:
- Check backend logs for Redis connection errors
- Verify `REDIS_URL` or `REDIS_HOST`/`REDIS_PORT` are set
- Ensure Redis is accessible from backend container/host

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

**Problem**: No events appearing in Sentry

**Solutions**:
1. Check browser console for Sentry errors
2. Verify DSN is correct
3. Check Sentry project settings → Client Keys (DSN)
4. Ensure you're looking at the correct project in Sentry dashboard
5. Check if there are any ad blockers interfering

**Problem**: Performance monitoring not working

**Solutions**:
1. Verify `tracesSampleRate` is > 0 in sentry config files
2. Check Sentry → Performance tab (not just Issues)
3. Ensure you're navigating through the app (transactions are created on navigation)

---

## Next Steps

After completing setup:

1. **Monitor Redis**:
   - Check cache hit rates
   - Monitor queue health
   - Review Redis memory usage

2. **Monitor Sentry**:
   - Set up alerts for critical errors
   - Review performance metrics
   - Configure release tracking

3. **Review Performance Guide**:
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
