# Redis and Sentry Setup Guide

This guide will help you configure Redis for caching and job queues, and set up Sentry for error tracking and performance monitoring.

## Table of Contents

1. [Redis Setup](#redis-setup)
2. [Sentry Setup](#sentry-setup)
3. [Environment Variables](#environment-variables)
4. [Verification](#verification)
5. [Troubleshooting](#troubleshooting)

---

## Redis Setup

### Local Development

#### Option 1: Docker (Recommended)

The easiest way to run Redis locally is using Docker:

```bash
# Start Redis container
docker run -d \
  --name redis-dev \
  -p 6379:6379 \
  redis:7-alpine

# Or use docker-compose (if you have docker-compose.yml)
docker-compose up -d redis
```

#### Option 2: Install Redis Locally

**macOS (using Homebrew):**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**Windows:**
Download and install from: https://github.com/microsoftarchive/redis/releases

### Production

For production, use a managed Redis service:

- **Redis Cloud**: https://redis.com/cloud/
- **AWS ElastiCache**: https://aws.amazon.com/elasticache/
- **Azure Cache for Redis**: https://azure.microsoft.com/services/cache/
- **Google Cloud Memorystore**: https://cloud.google.com/memorystore

### Configuration

Redis is used for two purposes:

1. **Caching**: Multi-tier caching system (L1: Memory, L2: Redis)
2. **Job Queues**: BullMQ background job processing

The application will gracefully degrade if Redis is unavailable:
- Caching will fall back to in-memory cache only
- Job queues will not function (but API endpoints will still work)

---

## Sentry Setup

### Step 1: Create Sentry Account

1. Go to https://sentry.io/signup/
2. Sign up for a free account (or log in if you already have one)
3. Create a new project or select an existing one

### Step 2: Get Your DSN

1. Navigate to **Settings** → **Projects** → **[Your Project]**
2. Go to **Client Keys (DSN)**
3. Copy your DSN (it looks like: `https://xxxxx@o0.ingest.sentry.io/xxxxx`)

### Step 3: Get Auth Token (for Source Maps)

1. Go to **Settings** → **Account** → **Auth Tokens**
2. Click **Create New Token**
3. Select scopes:
   - `project:read`
   - `project:releases`
   - `org:read`
4. Copy the token (you'll only see it once!)

### Step 4: Configure Environment Variables

Add the following to your `.env` files:

**Backend `.env`:**
```bash
# Sentry is optional - backend doesn't use it directly
# But you can add it if you want backend error tracking
```

**Frontend `.env.local`:**
```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-sentry-org-slug
SENTRY_PROJECT=your-project-name
SENTRY_AUTH_TOKEN=your-auth-token
```

**Root `.env` (if using monorepo setup):**
```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-sentry-org-slug
SENTRY_PROJECT=your-project-name
SENTRY_AUTH_TOKEN=your-auth-token
```

### Step 5: Verify Sentry Integration

After setting up environment variables:

1. Restart your development server
2. Check browser console for: `[Sentry] Client initialized with performance monitoring`
3. Test error tracking:
   ```typescript
   // In browser console or code
   import * as Sentry from '@sentry/nextjs';
   Sentry.captureMessage('Test message from The Copy');
   ```
4. Check your Sentry dashboard - you should see the test message

### Step 6: Upload Source Maps (Production Only)

Source maps help Sentry show readable stack traces. Upload them during build:

```bash
cd frontend
npm run sentry:sourcemaps
```

Or it's automatically done in CI/CD if configured (see `.github/workflows/ci-cd.yml`).

---

## Environment Variables

### Complete Redis Configuration

**Backend `.env`:**
```bash
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password_if_set

# OR use full URL (overrides above)
REDIS_URL=redis://localhost:6379
# REDIS_URL=redis://:password@localhost:6379
```

**Frontend `.env.local`:**
```bash
# Redis Configuration (for frontend caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password_if_set
```

### Complete Sentry Configuration

**Frontend `.env.local`:**
```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-sentry-org-slug
SENTRY_PROJECT=your-project-name
SENTRY_AUTH_TOKEN=your-auth-token
```

**Note**: `NEXT_PUBLIC_*` variables are exposed to the browser. Only use `NEXT_PUBLIC_SENTRY_DSN` for client-side tracking. Server-side Sentry uses `SENTRY_DSN` (without `NEXT_PUBLIC_`).

---

## Verification

### Verify Redis Connection

**Backend:**
```bash
cd backend
npm run dev
# Look for: "Redis cache connected successfully"
```

**Frontend:**
```bash
cd frontend
npm run dev
# Check browser console for: "[Redis] Connected successfully"
```

**Manual Test:**
```bash
# Using redis-cli
redis-cli ping
# Should return: PONG

# Or test with password
redis-cli -a your_password ping
```

### Verify Queue Workers

Check backend logs for:
```
[QueueSystem] Initializing workers...
[QueueSystem] All workers initialized
[Worker:ai-analysis] Worker registered
[Worker:document-processing] Worker registered
```

### Verify Sentry

1. **Check initialization logs:**
   - Browser console: `[Sentry] Client initialized with performance monitoring`
   - Server logs: `[Sentry] Server initialized with performance monitoring`

2. **Test error tracking:**
   ```typescript
   // In browser console
   import * as Sentry from '@sentry/nextjs';
   Sentry.captureException(new Error('Test error'));
   ```

3. **Check Sentry dashboard:**
   - Go to https://sentry.io
   - Navigate to your project
   - You should see the test error/message

---

## Troubleshooting

### Redis Issues

**Problem: Redis connection fails**

**Solutions:**
1. Check if Redis is running: `redis-cli ping`
2. Verify environment variables are set correctly
3. Check firewall/network settings
4. For Docker: Ensure container is running: `docker ps | grep redis`
5. Check Redis logs: `docker logs redis-dev` (if using Docker)

**Problem: "Redis connection error, falling back to memory cache"**

**Solutions:**
- This is expected if Redis is not configured
- The app will work with in-memory cache only
- To enable Redis, ensure Redis is running and environment variables are set

**Problem: Queue workers not starting**

**Solutions:**
1. Check Redis connection (workers require Redis)
2. Verify `REDIS_HOST`, `REDIS_PORT` are correct
3. Check backend logs for Redis connection errors
4. Ensure Redis is accessible from backend server

### Sentry Issues

**Problem: "DSN not configured, monitoring disabled"**

**Solutions:**
1. Verify `NEXT_PUBLIC_SENTRY_DSN` is set in `.env.local`
2. Restart development server after adding env vars
3. Check that DSN format is correct: `https://xxx@o0.ingest.sentry.io/xxx`

**Problem: Source maps not uploading**

**Solutions:**
1. Verify `SENTRY_AUTH_TOKEN` is set
2. Check `SENTRY_ORG` and `SENTRY_PROJECT` are correct
3. Ensure token has correct scopes (`project:releases`, `org:read`)
4. Run manually: `npm run sentry:sourcemaps`

**Problem: Errors not appearing in Sentry**

**Solutions:**
1. Check browser console for Sentry initialization
2. Verify DSN is correct
3. Check Sentry project settings → Inbound Filters (might be filtering)
4. Ensure you're looking at the correct environment in Sentry

---

## Next Steps

1. **Monitor Performance**: Check Sentry Performance tab for slow transactions
2. **Set Up Alerts**: Configure Sentry alerts for critical errors
3. **Cache Monitoring**: Monitor cache hit rates in your application logs
4. **Queue Monitoring**: Use `/api/queue/stats` endpoint to monitor job queues

---

## Additional Resources

- [Redis Documentation](https://redis.io/docs/)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [Sentry Documentation](https://docs.sentry.io/)
- [Performance Optimization Guide](./PERFORMANCE_OPTIMIZATION_GUIDE.md)

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review application logs
3. Check Redis/Sentry service status
4. Verify environment variables are set correctly
5. Consult the [Performance Optimization Guide](./PERFORMANCE_OPTIMIZATION_GUIDE.md) for detailed usage
