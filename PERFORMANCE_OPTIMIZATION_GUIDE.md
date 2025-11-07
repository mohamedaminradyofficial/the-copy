# Performance Optimization Guide

This guide covers all the performance optimizations implemented in The Copy project, including bundle splitting, caching strategies, background job processing, monitoring, and benchmarking.

## Table of Contents

1. [Bundle Splitting Optimization](#bundle-splitting-optimization)
2. [Advanced Query Caching](#advanced-query-caching)
3. [Background Job Queue (BullMQ)](#background-job-queue-bullmq)
4. [Sentry Performance Monitoring](#sentry-performance-monitoring)
5. [Lighthouse CI Benchmarks](#lighthouse-ci-benchmarks)

---

## Bundle Splitting Optimization

### Overview
Implemented advanced webpack bundle splitting to optimize loading times and enable better browser caching.

### Configuration
The bundle splitting is configured in `frontend/next.config.ts` with the following cache groups:

- **Framework**: React, React-DOM, Next.js, Scheduler (Priority: 40)
- **Radix UI**: All @radix-ui components (Priority: 35)
- **AI Libraries**: Genkit, Google Generative AI, Firebase (Priority: 30)
- **Charts**: Recharts and D3 libraries (Priority: 25)
- **Graphics**: Three.js, Framer Motion (Priority: 25)
- **Forms**: React Hook Form, Zod (Priority: 20)
- **Database**: Drizzle ORM, ioredis (Priority: 20)
- **Vendor**: Other node_modules (Priority: 10)
- **Common**: Shared code across routes (Priority: 5)

### Benefits
- **Better caching**: Framework and vendor bundles change less frequently
- **Parallel downloads**: Browser can download multiple chunks simultaneously
- **Reduced initial bundle size**: Code splitting reduces the main bundle
- **Faster updates**: Only changed bundles need to be re-downloaded

### Usage
The bundle splitting is automatic. To analyze your bundles:

```bash
cd frontend
npm run analyze
```

This will generate a visual report of your bundle sizes.

---

## Advanced Query Caching

### Overview
Multi-tier caching system with Stale-While-Revalidate (SWR) strategy.

### Architecture

```
Request → Memory Cache (L1) → Redis Cache (L2) → Database (L3)
          (60s TTL)             (3600s TTL)        (Source)
```

### Features
- **Memory Cache (L1)**: Fast in-memory cache with LRU eviction
- **Redis Cache (L2)**: Distributed cache for server-side caching
- **Stale-While-Revalidate**: Returns stale data immediately while fetching fresh data in background
- **Cache Tags**: Invalidate multiple related queries at once
- **React Query Integration**: Seamless integration with @tanstack/react-query

### Files
- `frontend/src/lib/query-cache.ts`: Core caching logic
- `frontend/src/lib/react-query-config.ts`: React Query configuration
- `frontend/src/lib/redis.ts`: Redis client configuration
- `frontend/src/lib/cache-middleware.ts`: API route caching

### Usage

#### Basic Query Caching

```typescript
import { queryCache, CACHE_STRATEGIES } from '@/lib/query-cache';

const data = await queryCache(
  async () => {
    // Your data fetching logic
    return await fetchData();
  },
  {
    key: 'projects:list',
    tags: ['projects'],
    ...CACHE_STRATEGIES.DYNAMIC,
  }
);
```

#### Cache Strategies

```typescript
// For frequently accessed, rarely changed data
CACHE_STRATEGIES.STATIC // 5 min memory, 1 day Redis

// For dynamic data that changes often
CACHE_STRATEGIES.DYNAMIC // 30 sec memory, 5 min Redis

// For real-time data
CACHE_STRATEGIES.REALTIME // 5 sec memory, 1 min Redis

// For expensive computations
CACHE_STRATEGIES.EXPENSIVE // 10 min memory, 1 hour Redis
```

#### Cache Invalidation

```typescript
import { invalidateQuery, invalidateByTag } from '@/lib/query-cache';

// Invalidate specific query
await invalidateQuery('projects:list');

// Invalidate all queries with a tag
await invalidateByTag('projects');
```

#### React Query Usage

```typescript
import { useQuery } from '@tanstack/react-query';
import { queryKeys, createQueryMeta } from '@/lib/react-query-config';

function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.projects.list({ status: 'active' }),
    queryFn: () => fetchProjects({ status: 'active' }),
    meta: createQueryMeta('DYNAMIC', ['projects']),
  });
}
```

### Environment Variables

```bash
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
```

---

## Background Job Queue (BullMQ)

### Overview
BullMQ-based job queue system for processing long-running tasks asynchronously.

### Queue Types

1. **AI Analysis Queue**: Process AI-powered analysis tasks
2. **Document Processing Queue**: Handle document parsing and extraction
3. **Notifications Queue**: Send notifications (future)
4. **Export Queue**: Generate and export reports (future)
5. **Cache Warming Queue**: Pre-warm caches (future)

### Files
- `backend/src/queues/queue.config.ts`: Queue configuration
- `backend/src/queues/jobs/ai-analysis.job.ts`: AI analysis job processor
- `backend/src/queues/jobs/document-processing.job.ts`: Document processing job processor
- `backend/src/queues/index.ts`: Queue system entry point
- `backend/src/controllers/queue.controller.ts`: API endpoints for queue management

### Setup

1. **Install BullMQ** (already done):
```bash
cd backend
pnpm add bullmq
```

2. **Initialize Workers** in your server startup:
```typescript
import { initializeWorkers } from './queues';

// In your server.ts
initializeWorkers();
```

3. **Configure Redis**:
```bash
# Environment variables
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
```

### Usage

#### Queue AI Analysis

```typescript
import { queueAIAnalysis } from './queues/jobs/ai-analysis.job';

const jobId = await queueAIAnalysis({
  type: 'scene',
  entityId: 'scene-123',
  userId: 'user-456',
  analysisType: 'full',
  options: {
    includeCharacterAnalysis: true,
  },
});

console.log(`Job queued with ID: ${jobId}`);
```

#### Queue Document Processing

```typescript
import { queueDocumentProcessing } from './queues/jobs/document-processing.job';

const jobId = await queueDocumentProcessing({
  documentId: 'doc-123',
  filePath: '/uploads/script.pdf',
  fileType: 'pdf',
  userId: 'user-456',
  options: {
    extractScenes: true,
    extractCharacters: true,
    generateSummary: true,
  },
});
```

#### API Endpoints

```bash
# Get queue statistics
GET /api/queue/stats

# Get specific queue stats
GET /api/queue/:queueName/stats

# Get job status
GET /api/queue/:queueName/jobs/:jobId

# Create AI analysis job
POST /api/queue/ai-analysis
{
  "type": "scene",
  "entityId": "scene-123",
  "analysisType": "full"
}

# Pause/Resume queue
POST /api/queue/:queueName/pause
POST /api/queue/:queueName/resume
```

### Monitoring

BullMQ provides excellent monitoring capabilities. You can:
- Track job progress
- View failed jobs
- Retry failed jobs
- Monitor queue health

### Benefits
- **Non-blocking**: Long-running tasks don't block API responses
- **Resilient**: Automatic retries with exponential backoff
- **Scalable**: Can add more workers to process jobs faster
- **Observable**: Built-in monitoring and metrics

---

## Sentry Performance Monitoring

### Overview
Sentry integration for error tracking and performance monitoring across client, server, and edge runtimes.

### Features
- **Error Tracking**: Capture and track errors across the application
- **Performance Monitoring**: Track transaction times and identify bottlenecks
- **Session Replay**: Record user sessions for debugging
- **Profiling**: Detailed performance profiling for both client and server
- **Custom Transaction Sampling**: Higher sampling rates for important routes

### Files
- `frontend/sentry.client.config.ts`: Client-side configuration
- `frontend/sentry.server.config.ts`: Server-side configuration
- `frontend/sentry.edge.config.ts`: Edge runtime configuration
- `frontend/next.config.ts`: Sentry webpack plugin configuration

### Setup

1. **Set Environment Variables**:
```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-auth-token
```

2. **Enable Sentry**: Already enabled! Just set the environment variables.

3. **Upload Source Maps** (for production):
```bash
cd frontend
npm run sentry:sourcemaps
```

### Configuration

#### Client-Side
- **Traces Sample Rate**: 10% in production, 100% in development
- **Replay Sample Rate**: 10% in production, 100% in development
- **Profiling**: Enabled with 10% sampling
- **Important Routes**: 100% sampling for `/api/*` and `/directors-studio`

#### Server-Side
- **Traces Sample Rate**: 20% in production, 100% in development
- **Profiling**: Enabled with 20% sampling
- **HTTP Integration**: Tracks outgoing requests
- **Always Sampled**: API routes and Genkit operations

### Usage

#### Manual Error Reporting
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

#### Performance Tracking
```typescript
import * as Sentry from '@sentry/nextjs';

const transaction = Sentry.startTransaction({
  op: 'ai-analysis',
  name: 'Analyze Scene',
});

try {
  // Your long-running operation
  const result = await analyzeScene();
  transaction.setStatus('ok');
} catch (error) {
  transaction.setStatus('internal_error');
  throw error;
} finally {
  transaction.finish();
}
```

#### Custom Breadcrumbs
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

### Benefits
- **Real-time Error Tracking**: Get notified of errors as they happen
- **Performance Insights**: Identify slow transactions and bottlenecks
- **User Context**: See exactly what users experienced before an error
- **Release Tracking**: Track errors by release version
- **Custom Alerts**: Set up alerts for critical errors

---

## Lighthouse CI Benchmarks

### Overview
Automated performance benchmarking using Google Lighthouse, integrated into CI/CD pipeline.

### Features
- **Automated Testing**: Runs on every PR and push to main
- **Multiple URLs**: Tests homepage, directors-studio, and other key pages
- **Performance Budgets**: Enforces minimum scores for performance, accessibility, SEO, and best practices
- **PR Comments**: Automatically posts results to pull requests
- **Artifact Storage**: Keeps detailed reports for 30 days

### Files
- `frontend/lighthouserc.json`: Lighthouse CI configuration
- `.github/workflows/lighthouse-ci.yml`: GitHub Actions workflow

### Configuration

#### Performance Budgets
```json
{
  "categories:performance": ["error", {"minScore": 0.8}],
  "categories:accessibility": ["error", {"minScore": 0.9}],
  "categories:best-practices": ["error", {"minScore": 0.9}],
  "categories:seo": ["error", {"minScore": 0.9}]
}
```

#### Metrics Thresholds
- **First Contentful Paint**: < 2000ms
- **Largest Contentful Paint**: < 3000ms
- **Cumulative Layout Shift**: < 0.1
- **Total Blocking Time**: < 300ms
- **Speed Index**: < 4000ms
- **Time to Interactive**: < 4000ms

### Usage

#### Local Testing
```bash
cd frontend

# Build the app first
npm run build

# Run Lighthouse CI
npm run lighthouse

# Or run individual steps
npm run lighthouse:collect  # Collect metrics
npm run lighthouse:assert   # Check against budgets
npm run lighthouse:upload   # Upload results
```

#### CI/CD Integration
Lighthouse CI automatically runs on:
- Pull requests to main/master branches
- Pushes to main/master branches
- Manual workflow dispatch

### Results

Lighthouse CI will:
1. **Run Tests**: Execute Lighthouse on configured URLs (3 runs per URL)
2. **Calculate Averages**: Compute average scores across runs
3. **Check Budgets**: Validate against performance budgets
4. **Upload Results**: Store detailed reports as artifacts
5. **Comment on PR**: Post a summary table with scores

#### Example PR Comment
```markdown
## 🔦 Lighthouse CI Results

| Category | Score |
|----------|-------|
| ⚡ Performance | 92/100 |
| ♿ Accessibility | 95/100 |
| ✅ Best Practices | 93/100 |
| 🔍 SEO | 97/100 |

✅ Performance is excellent!
```

### Viewing Detailed Reports

1. Go to GitHub Actions tab
2. Select the Lighthouse CI workflow run
3. Download the `lighthouse-results` artifact
4. Open the HTML reports in your browser

### Improving Scores

Common optimizations:
- **Performance**: Reduce bundle sizes, optimize images, enable CDN
- **Accessibility**: Add alt text, improve color contrast, keyboard navigation
- **Best Practices**: Use HTTPS, avoid deprecated APIs, fix console errors
- **SEO**: Add meta tags, improve mobile responsiveness, create sitemap

---

## Environment Variables

Complete list of environment variables for all optimizations:

```bash
# Redis (Required for caching and job queues)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Sentry (Optional but recommended for production)
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-sentry-project
SENTRY_AUTH_TOKEN=your-auth-token

# Lighthouse CI (Optional, for GitHub integration)
LHCI_GITHUB_APP_TOKEN=your-github-token

# Backend API URL (for Sentry tracing)
NEXT_PUBLIC_API_URL=http://localhost:3000
BACKEND_URL=http://localhost:3000
```

---

## Monitoring Dashboard

### Metrics to Track

1. **Bundle Sizes** (Next.js Bundle Analyzer)
   - Framework bundle: ~500KB
   - Vendor bundles: ~300KB each
   - Page chunks: ~50-100KB each

2. **Cache Hit Rates** (Redis)
   - L1 (Memory): Target > 80%
   - L2 (Redis): Target > 60%

3. **Queue Health** (BullMQ)
   - Active jobs: Monitor count
   - Failed jobs: Should be < 1%
   - Processing time: Track averages

4. **Performance Scores** (Lighthouse)
   - Performance: Target > 90
   - Accessibility: Target > 95
   - Best Practices: Target > 95
   - SEO: Target > 95

5. **Error Rates** (Sentry)
   - Client errors: Target < 0.1%
   - Server errors: Target < 0.01%
   - Transaction times: Track P95/P99

---

## Troubleshooting

### Bundle Splitting Issues
- Run `npm run analyze` to visualize bundles
- Check webpack config in next.config.ts
- Verify dynamic imports are working

### Caching Issues
- Check Redis connection: `redis-cli ping`
- Verify environment variables
- Check cache TTL settings
- Monitor cache hit rates

### Queue Issues
- Check Redis connection
- Verify workers are running: Check logs for "Worker registered"
- Monitor queue stats: GET /api/queue/stats
- Check failed jobs and error messages

### Sentry Issues
- Verify DSN is correct
- Check browser console for Sentry initialization logs
- Test manually: `Sentry.captureMessage('test')`
- Verify source maps are uploaded

### Lighthouse CI Issues
- Ensure app builds successfully
- Check if server starts correctly
- Verify URLs are accessible
- Review lighthouse assertions in lighthouserc.json

---

## Best Practices

1. **Bundle Splitting**
   - Use dynamic imports for large components
   - Keep critical path bundles < 200KB
   - Monitor bundle sizes regularly

2. **Caching**
   - Use appropriate cache strategies for different data types
   - Implement cache warming for frequently accessed data
   - Regularly invalidate stale data

3. **Background Jobs**
   - Queue long-running operations (> 2s)
   - Implement proper error handling and retries
   - Monitor queue health and processing times

4. **Performance Monitoring**
   - Set up alerts for critical errors
   - Monitor transaction times
   - Track performance budgets

5. **Lighthouse CI**
   - Run locally before pushing
   - Fix regressions immediately
   - Keep performance budgets updated

---

## Resources

- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [Sentry Documentation](https://docs.sentry.io/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [React Query Documentation](https://tanstack.com/query/latest)

---

## Contributing

When adding new features:
1. Consider bundle size impact (run bundle analyzer)
2. Implement appropriate caching strategy
3. Queue long-running operations
4. Add Sentry error tracking
5. Test with Lighthouse CI
6. Update this documentation

---

## Support

For issues or questions:
- Check troubleshooting section above
- Review relevant documentation
- Check logs for error messages
- Contact the development team
