# Testing Guide

## Overview

This guide provides comprehensive information about the testing infrastructure, including unit tests, integration tests, smoke tests, and E2E tests for queues, real-time channels, and the overall system.

---

## Table of Contents

1. [Test Structure](#1-test-structure)
2. [Running Tests](#2-running-tests)
3. [Test Categories](#3-test-categories)
4. [Writing Tests](#4-writing-tests)
5. [Test Coverage](#5-test-coverage)
6. [CI/CD Integration](#6-cicd-integration)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Test Structure

### Directory Structure

```
the-copy/
├── backend/
│   ├── src/
│   │   ├── queues/
│   │   │   ├── queue.config.test.ts          # Queue configuration tests
│   │   │   ├── jobs/
│   │   │   │   ├── ai-analysis.job.test.ts   # AI analysis job tests
│   │   │   │   └── document-processing.job.test.ts # Document processing tests
│   │   │   └── __tests__/
│   │   │       └── integration.test.ts        # Integration tests
│   │   └── __tests__/
│   │       └── smoke/
│   │           ├── api-endpoints.smoke.test.ts
│   │           └── queue-system.smoke.test.ts
│   └── package.json
├── frontend/
│   ├── tests/
│   │   ├── unit/                              # Unit tests
│   │   ├── e2e/                               # E2E tests
│   │   └── smoke/                             # Smoke tests
│   └── package.json
└── docs/
    └── testing/
        ├── TESTING_GUIDE.md                   # This file
        └── PERFORMANCE_IMPROVEMENTS.md         # Performance metrics
```

---

## 2. Running Tests

### Backend Tests

#### All Tests
```bash
cd backend
npm test
```

#### Queue Tests Only
```bash
npm test -- src/queues
```

#### Integration Tests
```bash
npm test -- src/queues/__tests__/integration.test.ts
```

#### Smoke Tests
```bash
npm test -- src/__tests__/smoke
```

#### Watch Mode
```bash
npm test -- --watch
```

#### Coverage Report
```bash
npm run test:coverage
```

### Frontend Tests

#### All Tests
```bash
cd frontend
npm test
```

#### Smoke Tests
```bash
npm run test:smoke
```

#### E2E Tests
```bash
npm run e2e
```

#### E2E with UI
```bash
npm run e2e:ui
```

#### E2E Debug Mode
```bash
npm run e2e:debug
```

---

## 3. Test Categories

### 3.1 Unit Tests

**Purpose**: Test individual functions and components in isolation

**Location**: `backend/src/**/*.test.ts`, `frontend/src/**/*.test.tsx`

**Examples**:
- Queue configuration tests
- Job creation tests
- Service function tests
- Component rendering tests

**Run**:
```bash
npm test
```

### 3.2 Integration Tests

**Purpose**: Test interaction between multiple components

**Location**: `backend/src/queues/__tests__/integration.test.ts`

**What's Tested**:
- Queue job lifecycle (queue → process → complete)
- Failure and retry mechanisms
- Multiple workers coordination
- Queue pause/resume operations
- Job priority handling

**Run**:
```bash
npm test -- integration.test.ts
```

**Key Features**:
- Tests realistic job workflows
- Validates retry logic with exponential backoff
- Tests concurrent processing
- Validates error handling
- Tests job events and lifecycle

### 3.3 Smoke Tests

**Purpose**: Quick validation that critical paths work

**Location**: `backend/src/__tests__/smoke/`, `frontend/tests/smoke/`

**What's Tested**:
- API endpoint availability
- Queue system connectivity
- Basic CRUD operations
- Health checks

**Run**:
```bash
# Backend
cd backend
npm test -- smoke

# Frontend
cd frontend
npm run test:smoke
```

**Characteristics**:
- Fast execution (<30 seconds)
- Tests critical functionality only
- Run before deployment
- Can run in production

### 3.4 E2E Tests

**Purpose**: Test complete user flows

**Location**: `frontend/tests/e2e/`

**What's Tested**:
- User authentication
- Project creation
- Scene analysis workflow
- Document upload and processing
- Navigation flows

**Run**:
```bash
cd frontend
npm run e2e
```

---

## 4. Writing Tests

### 4.1 Unit Test Template

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { functionToTest } from './module';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  describe('Specific Functionality', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = functionToTest(input);

      // Assert
      expect(result).toBe('expected');
    });

    it('should handle edge cases', () => {
      expect(() => functionToTest(null)).toThrow();
    });
  });
});
```

### 4.2 Integration Test Template

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { queueManager, QueueName } from '../queue.config';
import { queueJob } from '../jobs/some-job';

describe('Feature Integration Tests', () => {
  beforeAll(() => {
    // Initialize system
  });

  afterAll(async () => {
    // Cleanup
    await queueManager.close();
  });

  it('should complete full workflow', async () => {
    // 1. Queue job
    const jobId = await queueJob({ data: 'test' });

    // 2. Wait for processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Verify completion
    const queue = queueManager.getQueue(QueueName.TEST);
    const job = await queue.getJob(jobId);

    expect(job).toBeDefined();
    // Additional assertions
  }, 10000); // Increase timeout for integration tests
});
```

### 4.3 Test Best Practices

1. **Descriptive Names**: Use clear, descriptive test names
   ```typescript
   // Good
   it('should retry failed job with exponential backoff')

   // Bad
   it('test retry')
   ```

2. **Arrange-Act-Assert Pattern**:
   ```typescript
   // Arrange
   const input = setupTestData();

   // Act
   const result = functionUnderTest(input);

   // Assert
   expect(result).toMatchExpectedOutput();
   ```

3. **Isolation**: Tests should be independent
   ```typescript
   afterEach(async () => {
     // Clean up after each test
     await queue.obliterate({ force: true });
   });
   ```

4. **Async Handling**: Always await async operations
   ```typescript
   it('should process async operation', async () => {
     await asyncOperation();
     expect(result).toBeDefined();
   });
   ```

5. **Timeouts**: Set appropriate timeouts for long operations
   ```typescript
   it('should complete long operation', async () => {
     // test code
   }, 30000); // 30 second timeout
   ```

---

## 5. Test Coverage

### Current Coverage

| Component | Coverage | Target | Status |
|-----------|----------|--------|--------|
| Queue System | 90%+ | >90% | ✅ |
| Job Processors | 85%+ | >85% | ✅ |
| Integration Flows | 80%+ | >80% | ✅ |
| API Endpoints | TBD | >80% | ⚠️ |
| Services | TBD | >85% | ⚠️ |

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/index.html
```

### Coverage Goals

- **Critical Paths**: 100% (queues, auth, data integrity)
- **Core Features**: >90% (analysis, document processing)
- **Utilities**: >80% (helpers, formatters)
- **UI Components**: >75% (visual components)

---

## 6. CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    services:
      redis:
        image: redis:alpine
      postgres:
        image: postgres:14
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:coverage
      - run: npm run test -- smoke

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npm run e2e
```

### Pre-commit Hooks

```bash
# .husky/pre-commit
npm run test:smoke
npm run lint
npm run typecheck
```

### Pre-push Hooks

```bash
# .husky/pre-push
npm run test
npm run build
```

---

## 7. Troubleshooting

### Common Issues

#### 1. Redis Connection Failed

**Error**: `ECONNREFUSED 127.0.0.1:6379`

**Solution**:
```bash
# Start Redis
redis-server

# Or use Docker
docker run -d -p 6379:6379 redis:alpine
```

#### 2. Database Connection Failed

**Error**: `connection refused to database`

**Solution**:
```bash
# Check DATABASE_URL is set
echo $DATABASE_URL

# Start PostgreSQL
sudo service postgresql start

# Or use Docker
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:14
```

#### 3. Tests Timeout

**Error**: `Timeout - Async callback was not invoked`

**Solutions**:
```typescript
// Increase timeout
it('long test', async () => {
  // test code
}, 30000); // 30 seconds

// Or globally in vitest.config.ts
export default defineConfig({
  test: {
    testTimeout: 30000,
  },
});
```

#### 4. Queue Jobs Stuck

**Solution**:
```bash
# Clean all queues before tests
redis-cli FLUSHALL

# Or in test:
afterEach(async () => {
  await queue.obliterate({ force: true });
});
```

#### 5. Tests Flaky

**Common Causes**:
- Race conditions in async code
- Insufficient wait time
- Shared state between tests

**Solutions**:
```typescript
// Add proper waits
await new Promise(resolve => setTimeout(resolve, 2000));

// Use proper cleanup
afterEach(async () => {
  await cleanupAllState();
});

// Isolate tests
it('isolated test', async () => {
  const isolatedQueue = new Queue('test-' + Date.now());
  // test with isolated queue
  await isolatedQueue.close();
});
```

---

## 8. Test Maintenance

### Regular Tasks

- [ ] Run full test suite weekly
- [ ] Review coverage reports
- [ ] Update tests for new features
- [ ] Remove obsolete tests
- [ ] Update test documentation

### When to Update Tests

- ✅ Adding new features
- ✅ Fixing bugs (add regression test)
- ✅ Refactoring code
- ✅ Changing API contracts
- ✅ Updating dependencies

---

## 9. Performance Testing

### Load Testing Queues

```typescript
// Load test script
import { queueAIAnalysis } from './queues';

async function loadTest() {
  const startTime = Date.now();
  const jobCount = 1000;

  // Queue 1000 jobs
  const jobIds = [];
  for (let i = 0; i < jobCount; i++) {
    const jobId = await queueAIAnalysis({
      type: 'scene',
      entityId: `load-test-${i}`,
      userId: 'load-test',
      analysisType: 'quick',
    });
    jobIds.push(jobId);
  }

  const queueTime = Date.now() - startTime;
  console.log(`Queued ${jobCount} jobs in ${queueTime}ms`);
  console.log(`Throughput: ${(jobCount / queueTime * 1000).toFixed(2)} jobs/sec`);
}
```

---

## 10. Resources

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [BullMQ Testing Guide](https://docs.bullmq.io/guide/testing)

### Internal Documentation
- [Performance Improvements](./PERFORMANCE_IMPROVEMENTS.md)
- [Runbooks](../operations/RUNBOOKS.md)
- [Rollback Plan](../operations/ROLLBACK_PLAN.md)

---

## Document Information

- **Version**: 1.0.0
- **Last Updated**: 2025-11-07
- **Author**: Testing & Documentation Engineer (worktree-7)
- **Review Cycle**: Monthly
- **Next Review**: 2025-12-07
