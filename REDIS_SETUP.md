# Redis Setup Guide

This guide explains how to configure Redis for caching and job queues in The Copy project.

## Overview

Redis is used for two main purposes:
1. **Caching**: Multi-tier caching system (L1: Memory, L2: Redis)
2. **Job Queues**: BullMQ job queue system for background processing

## Quick Start

### Option 1: Docker Compose (Recommended)

The backend includes a Redis service in `docker-compose.yml`:

```bash
cd backend
docker-compose up -d redis
```

This starts Redis on port 6379 with persistence enabled.

### Option 2: Local Installation

#### macOS
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

Or use WSL:
```bash
wsl
sudo apt-get install redis-server
sudo service redis-server start
```

## Configuration

### Backend Configuration

Add these environment variables to `backend/.env`:

```bash
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password  # Optional, leave empty if no password

# Alternative: Use full Redis URL
# REDIS_URL=redis://localhost:6379
# REDIS_URL=redis://:password@localhost:6379
```

### Frontend Configuration

Add these environment variables to `frontend/.env.local`:

```bash
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password  # Optional
```

## Verification

### Test Redis Connection

```bash
# Using redis-cli
redis-cli ping
# Should return: PONG

# With password
redis-cli -a your_password ping
```

### Test from Backend

The backend will automatically connect to Redis on startup. Check logs for:
```
[Redis] Connected successfully
[Redis] Ready to accept commands
```

If Redis is unavailable, the system will gracefully fall back to memory-only caching.

## Usage

### Caching

The cache service automatically uses Redis when available:

```typescript
import { cacheService } from '@/services/cache.service';

// Get cached value
const data = await cacheService.get('my-key');

// Set cached value with TTL (30 minutes default)
await cacheService.set('my-key', data, 1800);

// Delete cached value
await cacheService.delete('my-key');

// Clear cache by pattern
await cacheService.clear('prefix:*');
```

### Job Queues

BullMQ queues automatically use Redis:

```typescript
import { queueManager, QueueName } from '@/queues/queue.config';

// Get queue
const queue = queueManager.getQueue(QueueName.AI_ANALYSIS);

// Add job
await queue.add('process-analysis', {
  entityId: 'scene-123',
  userId: 'user-456',
});

// Get queue stats
const stats = await queueManager.getQueueStats(QueueName.AI_ANALYSIS);
```

## Production Setup

### Redis Cloud (Recommended for Production)

1. Sign up at https://redis.com/cloud/
2. Create a database
3. Get connection details
4. Update environment variables:

```bash
REDIS_URL=rediss://:password@host:port
# or
REDIS_HOST=your-redis-host
REDIS_PORT=12345
REDIS_PASSWORD=your-secure-password
```

### Self-Hosted Redis

For production, ensure:
- Redis is password-protected
- SSL/TLS is enabled (rediss://)
- Persistence is configured (AOF or RDB)
- Memory limits are set
- Monitoring is enabled

Example production configuration:

```bash
# redis.conf
requirepass your_secure_password
appendonly yes
maxmemory 2gb
maxmemory-policy allkeys-lru
```

## Monitoring

### Queue Statistics

```bash
# Via API
curl http://localhost:3001/api/queue/stats

# Via code
const stats = await queueManager.getAllStats();
console.log(stats);
```

### Cache Statistics

```typescript
const stats = cacheService.getStats();
console.log(stats);
// { memorySize: 45, redisStatus: 'ready' }
```

## Troubleshooting

### Connection Issues

1. **Check Redis is running**:
   ```bash
   redis-cli ping
   ```

2. **Check port is accessible**:
   ```bash
   telnet localhost 6379
   ```

3. **Check firewall rules**:
   ```bash
   sudo ufw status
   ```

4. **Check Redis logs**:
   ```bash
   # Docker
   docker logs the-copy-redis
   
   # Systemd
   sudo journalctl -u redis-server
   ```

### Performance Issues

1. **Monitor memory usage**:
   ```bash
   redis-cli info memory
   ```

2. **Check slow queries**:
   ```bash
   redis-cli slowlog get 10
   ```

3. **Monitor connections**:
   ```bash
   redis-cli info clients
   ```

### Common Errors

- **"Connection refused"**: Redis not running or wrong port
- **"NOAUTH Authentication required"**: Password required but not provided
- **"ERR max number of clients reached"**: Too many connections, increase `maxclients` in redis.conf

## Security Best Practices

1. **Always use passwords in production**
2. **Use SSL/TLS (rediss://) for remote connections**
3. **Restrict network access** (firewall rules)
4. **Regularly update Redis**
5. **Monitor for suspicious activity**
6. **Use separate Redis instances** for different purposes (caching vs queues)

## Resources

- [Redis Documentation](https://redis.io/docs/)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [ioredis Documentation](https://github.com/redis/ioredis)
- [Redis Cloud](https://redis.com/cloud/)
