# System Metrics Dashboard Documentation

## 📊 Overview

A comprehensive system monitoring dashboard for The Copy application, providing real-time insights into performance, resource usage, and system health.

## ✨ Features

### 1. Real-time Metrics
- **Auto-refresh**: Configurable auto-refresh every 30 seconds (default)
- **Manual refresh**: Instant data update on demand
- **Live updates**: Shows last update time

### 2. System Health Monitoring
- **Health Status**: Visual indicator (Healthy/Degraded/Critical)
- **Resource Usage**: CPU and memory monitoring
- **Active Requests**: Real-time concurrent requests tracking
- **Error Rate**: System-wide error monitoring

### 3. Performance Metrics
- **HTTP Requests**: Total requests, response time, error rate
- **Database**: Query count, average duration, slow queries
- **Redis Cache**: Hit ratio, memory usage
- **Queue System**: Active, completed, and failed jobs
- **Gemini API**: Request count, cache performance

### 4. Visualizations
- **Interactive Charts**: Using Recharts library
- **Pie Charts**: Queue status distribution
- **Progress Bars**: CPU and memory usage
- **Trend Indicators**: Performance trends

### 5. Alerts & Recommendations
- **Performance Alerts**: Critical, warning, and info alerts
- **Recommendations**: Actionable suggestions for optimization
- **Threshold Monitoring**: Automatic detection of issues

## 🏗️ Architecture

### Frontend Components

#### 1. SystemMetricsDashboard (`/frontend/src/components/ui/system-metrics-dashboard.tsx`)
- Main dashboard component
- Handles auto-refresh logic
- Renders all visualizations
- Manages state and data fetching

#### 2. Metrics Hooks (`/frontend/src/hooks/useMetrics.ts`)
- `useDashboardSummary()` - Main dashboard data
- `useHealthStatus()` - System health
- `useLatestMetrics()` - Latest snapshot
- `usePerformanceReport()` - Performance analysis
- Auto-refresh with React Query

#### 3. Type Definitions (`/frontend/src/types/metrics.ts`)
- TypeScript interfaces for all metrics
- Ensures type safety across the application

#### 4. Page Component (`/frontend/src/app/(main)/metrics-dashboard/page.tsx`)
- Next.js page wrapper
- Route: `/metrics-dashboard`

### Backend API Endpoints

All endpoints are protected with authentication middleware:

| Endpoint | Description | Refresh Rate |
|----------|-------------|--------------|
| `/api/metrics/snapshot` | Complete metrics snapshot | On-demand |
| `/api/metrics/latest` | Latest cached snapshot | 30s |
| `/api/metrics/dashboard` | Dashboard summary | 30s |
| `/api/metrics/health` | System health status | 15s |
| `/api/metrics/database` | Database metrics | 30s |
| `/api/metrics/redis` | Redis metrics | 30s |
| `/api/metrics/queue` | Queue metrics | 15s |
| `/api/metrics/api` | API metrics | 30s |
| `/api/metrics/resources` | Resource metrics | 10s |
| `/api/metrics/gemini` | Gemini API metrics | 30s |
| `/api/metrics/report` | Performance report | On-demand |
| `/api/metrics/range` | Time-range metrics | On-demand |

### Backend Services

#### 1. Metrics Controller (`/backend/src/controllers/metrics.controller.ts`)
- Handles all metrics API requests
- Aggregates data from various sources
- Implements caching for performance

#### 2. Metrics Aggregator (`/backend/src/services/metrics-aggregator.service.ts`)
- Collects metrics from all sources
- Creates periodic snapshots
- Generates performance reports
- Provides alerts and recommendations

#### 3. Metrics Middleware (`/backend/src/middleware/metrics.middleware.ts`)
- Prometheus client integration
- Automatic metrics collection
- Exposes `/metrics` endpoint for Prometheus

## 🚀 Usage

### Accessing the Dashboard

1. **Web Interface:**
   ```
   http://localhost:5000/metrics-dashboard
   ```

2. **Authentication Required:**
   - Users must be logged in to access the dashboard
   - JWT token is automatically included in requests

### Auto-refresh Configuration

```typescript
// Enable/disable auto-refresh
const [autoRefresh, setAutoRefresh] = useState({
  enabled: true,
  interval: 30000, // 30 seconds
});

// Toggle auto-refresh
const toggleAutoRefresh = () => {
  setAutoRefresh(prev => ({ ...prev, enabled: !prev.enabled }));
};
```

### Manual Refresh

```typescript
// Trigger manual refresh
const handleManualRefresh = () => {
  refetchDashboard();
  refetchHealth();
  refetchReport();
};
```

### Custom Refresh Intervals

```typescript
// Custom hook with specific refresh interval
const { data } = useDashboardSummary(15000); // 15 seconds
const { data } = useHealthStatus(10000);     // 10 seconds
```

## 📈 Metrics Collected

### HTTP Metrics
- `the_copy_http_requests_total` - Total HTTP requests
- `the_copy_http_request_duration_ms` - Request duration histogram
- `the_copy_http_active_connections` - Active connections

### Database Metrics
- `the_copy_db_queries_total` - Total queries
- `the_copy_db_query_duration_ms` - Query duration histogram
- `the_copy_db_slow_queries_total` - Slow queries count

### Redis Metrics
- `the_copy_redis_cache_hits_total` - Cache hits
- `the_copy_redis_cache_misses_total` - Cache misses
- `the_copy_redis_memory_usage_bytes` - Memory usage
- `the_copy_redis_connected_clients` - Connected clients

### Queue Metrics
- `the_copy_queue_jobs_total` - Total jobs
- `the_copy_queue_jobs_active` - Active jobs
- `the_copy_queue_jobs_completed` - Completed jobs
- `the_copy_queue_jobs_failed` - Failed jobs

### Gemini API Metrics
- `the_copy_gemini_requests_total` - Total requests
- `the_copy_gemini_request_duration_ms` - Request duration
- `the_copy_gemini_cache_hits_total` - Cache hits
- `the_copy_gemini_cache_misses_total` - Cache misses

### System Metrics
- `the_copy_process_cpu_user_seconds_total` - CPU usage
- `the_copy_process_resident_memory_bytes` - Memory usage
- `the_copy_nodejs_eventloop_lag_seconds` - Event loop lag
- `the_copy_nodejs_active_handles_total` - Active handles

## 🔗 Prometheus Integration

### Setup Prometheus

1. **Using Docker Compose:**
   ```bash
   cd monitoring
   docker-compose up -d
   ```

2. **Access Prometheus:**
   ```
   http://localhost:9090
   ```

3. **Verify Targets:**
   Navigate to Status → Targets to verify the backend is being scraped

### Prometheus Configuration

File: `/monitoring/prometheus.yml`

```yaml
scrape_configs:
  - job_name: 'the-copy-backend'
    scrape_interval: 10s
    metrics_path: '/metrics'
    static_configs:
      - targets: ['localhost:3000']
```

### Useful Prometheus Queries

**Error Rate:**
```promql
rate(the_copy_http_requests_total{status_code=~"5.."}[5m])
```

**Average Response Time:**
```promql
rate(the_copy_http_request_duration_ms_sum[5m]) /
rate(the_copy_http_request_duration_ms_count[5m])
```

**Cache Hit Ratio:**
```promql
sum(rate(the_copy_redis_cache_hits_total[5m])) /
(sum(rate(the_copy_redis_cache_hits_total[5m])) +
 sum(rate(the_copy_redis_cache_misses_total[5m])))
```

**P95 Response Time:**
```promql
histogram_quantile(0.95,
  rate(the_copy_http_request_duration_ms_bucket[5m]))
```

## 📊 Grafana Dashboard

### Setup Grafana

1. **Using Docker Compose:**
   ```bash
   cd monitoring
   docker-compose up -d
   ```

2. **Access Grafana:**
   ```
   http://localhost:3001
   Login: admin/admin
   ```

3. **Add Prometheus Data Source:**
   - Configuration → Data Sources → Add data source
   - Select Prometheus
   - URL: `http://prometheus:9090`
   - Save & Test

4. **Import Dashboard:**
   - Dashboards → Import
   - Upload `/monitoring/grafana/dashboards/the-copy-dashboard.json`

## 🎯 Performance Optimization

### Auto-refresh Best Practices

1. **Adjust Refresh Intervals:**
   - Critical metrics: 10-15 seconds
   - Standard metrics: 30 seconds
   - Historical data: 60+ seconds

2. **Disable When Not in Use:**
   - Dashboard auto-disables when not visible
   - Reduces unnecessary API calls

3. **Use Caching:**
   - Backend implements caching for expensive queries
   - Latest snapshot cached in memory

### Monitoring Tips

1. **Set Appropriate Thresholds:**
   - CPU usage > 80% = Warning
   - Memory usage > 90% = Critical
   - Error rate > 5% = Warning

2. **Regular Review:**
   - Check dashboard daily
   - Review performance reports weekly
   - Investigate alerts immediately

3. **Trend Analysis:**
   - Use Grafana for long-term trends
   - Export data for detailed analysis
   - Set up alerts for anomalies

## 🔒 Security Considerations

1. **Authentication:**
   - All metrics endpoints require authentication
   - JWT tokens validated on each request

2. **Rate Limiting:**
   - Metrics endpoints have rate limits
   - Prevents abuse and overload

3. **Data Sensitivity:**
   - No sensitive data exposed in metrics
   - User-specific data properly anonymized

4. **Access Control:**
   - Dashboard accessible only to authenticated users
   - Consider role-based access for production

## 🐛 Troubleshooting

### Dashboard Not Loading

1. **Check Backend:**
   ```bash
   curl http://localhost:3000/api/metrics/health
   ```

2. **Check Authentication:**
   - Ensure user is logged in
   - Check JWT token in cookies

3. **Check Network:**
   - Open browser dev tools
   - Check for failed API requests

### No Data Displayed

1. **Verify Backend is Running:**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Check Metrics Collection:**
   ```bash
   curl http://localhost:3000/metrics
   ```

3. **Review Logs:**
   - Check backend logs for errors
   - Look for database connection issues

### Auto-refresh Not Working

1. **Check Browser Console:**
   - Look for JavaScript errors
   - Verify React Query is functioning

2. **Verify Intervals:**
   - Ensure refresh intervals are set correctly
   - Check if auto-refresh is enabled

## 📚 Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Recharts Documentation](https://recharts.org/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [prom-client Library](https://github.com/siimon/prom-client)

## 🔄 Future Enhancements

1. **Historical Charts:**
   - Time-series line charts
   - Comparison with previous periods

2. **Custom Dashboards:**
   - User-defined metrics
   - Customizable layouts

3. **Export Functionality:**
   - Export data to CSV/JSON
   - Generate PDF reports

4. **Advanced Alerts:**
   - Email/Slack notifications
   - Custom alert rules

5. **Mobile Optimization:**
   - Responsive design improvements
   - Mobile app version

## 📝 Changelog

### Version 1.0.0 (2025-01-07)

#### Added
- System metrics dashboard with real-time updates
- Auto-refresh functionality (configurable)
- Interactive charts using Recharts
- Health status monitoring
- Performance alerts and recommendations
- Prometheus integration documentation
- Docker Compose setup for Prometheus/Grafana
- Comprehensive API endpoints for metrics
- TypeScript type definitions
- React Query integration for data fetching

#### Features
- Real-time system health monitoring
- CPU and memory usage tracking
- Database query metrics
- Redis cache performance
- Queue system monitoring
- Gemini API metrics
- Performance report generation
- Alert system with severity levels
- Optimization recommendations

---

**Developed by: Agent 6 - Metrics & Dashboard Analyst**
**Date: 2025-01-07**
**Version: 1.0.0**
