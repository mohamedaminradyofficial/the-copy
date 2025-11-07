# 📊 دليل استخدام نظام المقاييس - Metrics Dashboard

## 🚀 البدء السريع

### 1. تشغيل النظام

```bash
# Backend
cd backend
pnpm install
pnpm dev

# Frontend
cd frontend
pnpm install
pnpm dev
```

### 2. الوصول إلى Dashboard

افتح المتصفح على:
```
http://localhost:3000/metrics-dashboard
```

**ملاحظة:** يجب تسجيل الدخول أولاً للوصول إلى Dashboard

---

## 📡 API Endpoints

### الحصول على ملخص Dashboard

```bash
curl -X GET http://localhost:5000/api/metrics/dashboard \
  -H "Cookie: your-session-cookie"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2025-01-07T10:30:00.000Z",
    "overview": {
      "totalRequests": 1523,
      "avgResponseTime": 145.5,
      "errorRate": 0.02,
      "activeJobs": 3,
      "cacheHitRatio": 0.78
    },
    "database": {
      "totalQueries": 2341,
      "avgDuration": 23.4,
      "slowQueries": 5
    },
    "redis": {
      "hitRatio": 0.78,
      "hits": 1823,
      "misses": 512,
      "memoryUsage": 15728640
    },
    "queue": {
      "total": 150,
      "active": 3,
      "completed": 142,
      "failed": 5
    },
    "resources": {
      "cpu": { "usage": 45.3, "status": "ok" },
      "memory": {
        "used": 2147483648,
        "total": 8589934592,
        "percent": 25.0,
        "status": "ok"
      },
      "concurrentRequests": 12
    },
    "gemini": {
      "totalRequests": 234,
      "avgDuration": 2340.5,
      "cacheHitRatio": 0.65,
      "errorRate": 0.01
    }
  }
}
```

### الحصول على تقرير الأداء

```bash
curl -X GET "http://localhost:5000/api/metrics/report?start=2025-01-07T00:00:00Z&end=2025-01-07T23:59:59Z" \
  -H "Cookie: your-session-cookie"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-01-07T00:00:00.000Z",
      "end": "2025-01-07T23:59:59.000Z",
      "durationSeconds": 86400
    },
    "summary": {
      "totalRequests": 15234,
      "avgResponseTime": 156.7,
      "errorRate": 0.018,
      "cacheHitRatio": 0.79,
      "queueThroughput": 12.5,
      "systemHealth": "healthy"
    },
    "recommendations": [
      "Consider increasing cache TTL or optimizing cache keys to improve hit ratio"
    ],
    "alerts": [
      {
        "severity": "warning",
        "message": "Low cache hit ratio detected",
        "metric": "redis.hitRatio",
        "value": 0.79,
        "threshold": 0.8
      }
    ]
  }
}
```

### الحصول على حالة صحة النظام

```bash
curl -X GET http://localhost:5000/api/metrics/health \
  -H "Cookie: your-session-cookie"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "isUnderPressure": false,
    "timestamp": "2025-01-07T10:30:00.000Z",
    "resources": {
      "cpu": { "usage": 45.3, "status": "ok" },
      "memory": {
        "used": 2147483648,
        "total": 8589934592,
        "percent": 25.0,
        "status": "ok"
      },
      "eventLoop": { "lag": 15, "status": "ok" },
      "connections": 0,
      "concurrentRequests": 12,
      "backpressureEvents": 0
    },
    "metrics": {
      "errorRate": 0.02,
      "avgResponseTime": 145.5,
      "cacheHitRatio": 0.78,
      "activeJobs": 3
    }
  }
}
```

---

## 📈 Prometheus Metrics

### الوصول إلى Prometheus Endpoint

```bash
curl http://localhost:5000/metrics
```

**Output (sample):**
```prometheus
# HELP the_copy_http_requests_total Total number of HTTP requests
# TYPE the_copy_http_requests_total counter
the_copy_http_requests_total{method="GET",route="/api/projects",status_code="200"} 1234

# HELP the_copy_http_request_duration_ms Duration of HTTP requests in milliseconds
# TYPE the_copy_http_request_duration_ms histogram
the_copy_http_request_duration_ms_bucket{method="GET",route="/api/projects",status_code="200",le="10"} 523
the_copy_http_request_duration_ms_bucket{method="GET",route="/api/projects",status_code="200",le="50"} 892
the_copy_http_request_duration_ms_bucket{method="GET",route="/api/projects",status_code="200",le="100"} 1156
...

# HELP the_copy_redis_cache_hits_total Total number of Redis cache hits
# TYPE the_copy_redis_cache_hits_total counter
the_copy_redis_cache_hits_total{cache_key_prefix="gemini"} 1823

# HELP the_copy_db_query_duration_ms Duration of database queries in milliseconds
# TYPE the_copy_db_query_duration_ms histogram
the_copy_db_query_duration_ms_sum{operation="select",table="projects"} 45678.9
the_copy_db_query_duration_ms_count{operation="select",table="projects"} 1234
```

---

## 🔧 التكامل مع Backend Code

### تتبع Redis Operations

```typescript
import { RedisMetricsService } from '@/services/redis-metrics.service';
import Redis from 'ioredis';

const redis = new Redis();
const redisMetrics = new RedisMetricsService(redis);

// بدء المراقبة
redisMetrics.startMetricsCollection(30000); // كل 30 ثانية

// تتبع عملية GET
async function getFromCache(key: string) {
  const value = await redisMetrics.trackOperation('get', async () => {
    return await redis.get(key);
  });

  // تسجيل Hit/Miss
  if (value) {
    redisMetrics.trackCacheHit('user');
  } else {
    redisMetrics.trackCacheMiss('user');
  }

  return value;
}
```

### تتبع Database Queries

```typescript
import { trackDbQuery } from '@/middleware/metrics.middleware';

async function getUserById(id: string) {
  const startTime = Date.now();

  try {
    const user = await db.select().from(users).where(eq(users.id, id));

    const duration = Date.now() - startTime;
    trackDbQuery('select', 'users', duration);

    return user;
  } catch (error) {
    const duration = Date.now() - startTime;
    trackDbQuery('select', 'users', duration);
    throw error;
  }
}
```

### تتبع Queue Jobs

```typescript
import { trackQueueJob } from '@/middleware/metrics.middleware';

worker.on('completed', (job) => {
  const duration = Date.now() - job.timestamp;
  trackQueueJob(QueueName.AI_ANALYSIS, 'completed', duration);
});

worker.on('failed', (job, error) => {
  const duration = Date.now() - job.timestamp;
  trackQueueJob(QueueName.AI_ANALYSIS, 'failed', duration);
});
```

### مراقبة الموارد

```typescript
import { resourceMonitor } from '@/services/resource-monitor.service';

// بدء المراقبة
resourceMonitor.startMonitoring(5000); // كل 5 ثوانٍ

// تتبع Concurrent Requests (في Middleware)
app.use((req, res, next) => {
  resourceMonitor.incrementConcurrentRequests();

  res.on('finish', () => {
    resourceMonitor.decrementConcurrentRequests();
  });

  next();
});

// التحقق من Pressure
if (resourceMonitor.isUnderPressure()) {
  // رفض الطلبات الجديدة أو تأخيرها
  return res.status(503).json({ error: 'System under pressure' });
}
```

---

## 🎨 تخصيص Dashboard

### إضافة مقياس جديد

#### 1. في Backend - Metrics Service

```typescript
// backend/src/middleware/metrics.middleware.ts

export const customMetricCounter = new Counter({
  name: 'the_copy_custom_metric_total',
  help: 'Description of your custom metric',
  labelNames: ['label1', 'label2'],
  registers: [register],
});

export function trackCustomMetric(label1: string, label2: string) {
  customMetricCounter.inc({ label1, label2 });
}
```

#### 2. في Backend - Aggregator

```typescript
// backend/src/services/metrics-aggregator.service.ts

private async aggregateCustomMetrics(parsed: any): Promise<any> {
  const customMetric = parsed['the_copy_custom_metric_total'];
  // معالجة البيانات
  return {
    // البيانات المُعالجة
  };
}
```

#### 3. في Frontend - Dashboard

```tsx
// frontend/src/app/(main)/metrics-dashboard/page.tsx

<TabsContent value="custom">
  <Card>
    <CardHeader>
      <CardTitle>المقياس المخصص</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {metrics.custom.value}
      </div>
    </CardContent>
  </Card>
</TabsContent>
```

---

## 🔔 التنبيهات (Alerts)

### إعداد التنبيهات في Prometheus

```yaml
# prometheus/alerts.yml
groups:
  - name: the-copy-alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(the_copy_http_requests_total{status_code=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} requests/sec"

      - alert: HighAPILatency
        expr: histogram_quantile(0.95, rate(the_copy_http_request_duration_ms_bucket[5m])) > 500
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High API latency"
          description: "95th percentile latency is {{ $value }}ms"

      - alert: LowCacheHitRatio
        expr: |
          the_copy_redis_cache_hits_total /
          (the_copy_redis_cache_hits_total + the_copy_redis_cache_misses_total) < 0.7
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Low cache hit ratio"

      - alert: HighCPUUsage
        expr: the_copy_system_cpu_usage_percent > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage"

      - alert: HighMemoryUsage
        expr: |
          (the_copy_system_memory_usage_bytes{type="used"} /
           the_copy_system_memory_usage_bytes{type="total"}) * 100 > 85
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High memory usage"
```

---

## 📊 Grafana Dashboard

### استيراد Dashboard JSON

```json
{
  "dashboard": {
    "title": "The Copy - System Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(the_copy_http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "API Latency (P95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(the_copy_http_request_duration_ms_bucket[5m]))"
          }
        ]
      },
      {
        "title": "Cache Hit Ratio",
        "targets": [
          {
            "expr": "rate(the_copy_redis_cache_hits_total[5m]) / (rate(the_copy_redis_cache_hits_total[5m]) + rate(the_copy_redis_cache_misses_total[5m]))"
          }
        ]
      }
    ]
  }
}
```

---

## 🐛 استكشاف الأخطاء

### Dashboard لا يظهر البيانات

**المشكلة:** لا توجد بيانات في Dashboard

**الحلول:**
```bash
# 1. تحقق من أن Backend يعمل
curl http://localhost:5000/api/health

# 2. تحقق من Prometheus endpoint
curl http://localhost:5000/metrics

# 3. تحقق من Metrics Dashboard endpoint
curl http://localhost:5000/api/metrics/dashboard \
  -H "Cookie: your-session-cookie"

# 4. تحقق من Console في المتصفح
# افتح DevTools > Console
# ابحث عن أخطاء JavaScript
```

### High Memory Usage Warning

**المشكلة:** تحذير استخدام ذاكرة مرتفع

**الحلول:**
```bash
# 1. تحقق من استخدام Redis
redis-cli INFO memory

# 2. نظف المفاتيح القديمة
redis-cli --scan --pattern "gemini:*" | xargs redis-cli del

# 3. قلل حجم Snapshots المحفوظة
# في metrics-aggregator.service.ts
private maxSnapshots = 500; // بدلاً من 1000
```

---

## 🎓 أفضل الممارسات

### 1. مراقبة دورية

```bash
# قم بمراجعة المقاييس يومياً
# ابحث عن:
- Unusual spikes
- Error rate increases
- Slow queries
- Cache hit ratio drops
```

### 2. تحديد العتبات

```typescript
// قم بتحديث العتبات بناءً على بيانات الإنتاج
const thresholds = {
  cpu: {
    warning: 70,  // قد تحتاج لتعديلها
    critical: 90,
  },
  memory: {
    warning: 80,
    critical: 95,
  },
};
```

### 3. التوثيق

```markdown
# وثّق كل حادثة
- التاريخ والوقت
- المشكلة
- السبب الجذري
- الحل المُطبق
- الوقت المستغرق للحل
```

---

## 📞 الدعم

**للأسئلة أو المساعدة:**
- راجع `METRICS_ANALYSIS_REPORT.md`
- تحقق من Logs: `backend/logs/`
- افتح Issue في GitHub

---

**آخر تحديث:** 2025-01-07
**الإصدار:** 1.0
