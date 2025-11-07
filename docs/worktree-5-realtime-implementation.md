# Worktree 5 - Real-time Communication Implementation

## نظرة عامة

تم تطوير نظام التواصل في الوقت الفعلي (Real-time Communication) الذي يدمج كلاً من **WebSocket** و **Server-Sent Events (SSE)** لتوفير تحديثات فورية للمستخدمين حول العمليات طويلة الأمد مثل تحليل المشاريع والوظائف في الطوابير.

## المكونات الرئيسية

### 1. WebSocket Service (`websocket.service.ts`)

خدمة مبنية على Socket.IO توفر اتصال ثنائي الاتجاه في الوقت الفعلي.

**الميزات الرئيسية:**
- المصادقة التلقائية للاتصالات
- إدارة الغرف (Rooms) للبث المستهدف
- دعم النطاقات (Namespaces) المتعددة
- معالجة الأخطاء التلقائية
- إحصائيات الاتصال في الوقت الفعلي
- دعم إعادة الاتصال التلقائي

**الأحداث المدعومة:**
- أحداث الوظائف: `job:started`, `job:progress`, `job:completed`, `job:failed`
- أحداث التحليل: `analysis:started`, `analysis:progress`, `analysis:completed`
- أحداث النظام: `system:info`, `system:warning`, `system:error`
- أحداث الاتصال: `connected`, `disconnected`, `authenticated`

**مثال الاستخدام:**
```typescript
import { websocketService } from '@/services/websocket.service';

// بث حالة الوظيفة
websocketService.emitJobProgress({
  jobId: 'job-123',
  queueName: 'ai-analysis',
  progress: 75,
  status: 'active',
  userId: 'user-123'
});

// إرسال إلى مشروع محدد
websocketService.toProject('project-123', {
  event: RealtimeEventType.ANALYSIS_PROGRESS,
  payload: { ... }
});
```

### 2. SSE Service (`sse.service.ts`)

خدمة Server-Sent Events لبث الأحداث أحادية الاتجاه من الخادم إلى العميل.

**الميزات الرئيسية:**
- اتصالات HTTP طويلة الأمد
- Keep-alive تلقائي كل 30 ثانية
- دعم Last-Event-ID لإعادة الاتصال
- دعم CORS الكامل
- بث البيانات الخام للسجلات

**الأحداث المدعومة:**
- جميع أنواع الأحداث المدعومة في WebSocket
- بث السجلات والبيانات الخام

**مثال الاستخدام:**
```typescript
import { sseService } from '@/services/sse.service';

// تهيئة اتصال SSE
sseService.initializeConnection(
  clientId,
  response,
  userId,
  lastEventId
);

// الاشتراك في غرفة
sseService.subscribeToRoom(clientId, 'analysis:analysis-456');

// بث سجلات التحليل
sseService.streamData(clientId, 'Processing step 1...', 'analysis:log');
```

### 3. Unified Realtime Service (`realtime.service.ts`)

خدمة موحدة توفر واجهة واحدة للبث عبر كل من WebSocket و SSE.

**الميزات الرئيسية:**
- واجهة موحدة للبث عبر القنوات المتعددة
- اختيار مرن لقناة البث (WebSocket فقط، SSE فقط، أو كلاهما)
- دوال مساعدة للأحداث الشائعة
- إدارة مركزية للأخطاء
- إحصائيات شاملة من كلا الخدمتين

**الأنماط المدعومة:**
```typescript
export enum BroadcastTarget {
  ALL = 'all',        // البث عبر كلا القنوات
  WEBSOCKET = 'websocket',  // WebSocket فقط
  SSE = 'sse'         // SSE فقط
}
```

**مثال الاستخدام:**
```typescript
import { realtimeService, BroadcastTarget } from '@/services/realtime.service';

// بث لجميع القنوات (افتراضي)
realtimeService.emitJobProgress({
  jobId: 'job-123',
  queueName: 'ai-analysis',
  progress: 50,
  status: 'active',
  userId: 'user-123'
});

// بث عبر WebSocket فقط
realtimeService.broadcast(event, {
  target: BroadcastTarget.WEBSOCKET
});

// بث لمستخدم محدد عبر SSE فقط
realtimeService.toUser('user-456', event, {
  target: BroadcastTarget.SSE,
  eventId: 'event-789'
});
```

### 4. Realtime Controller (`realtime.controller.ts`)

وحدة تحكم Express توفر نقاط نهاية HTTP للاتصالات والإحصائيات.

**نقاط النهاية:**

#### `GET /api/realtime/events`
اتصال SSE للتحديثات في الوقت الفعلي.

**Headers:**
- `Last-Event-ID`: (اختياري) لإعادة الاتصال

**Response:**
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

#### `GET /api/realtime/stats`
الحصول على إحصائيات الخدمة.

**Response:**
```json
{
  "success": true,
  "stats": {
    "websocket": {
      "totalConnections": 15,
      "authenticatedConnections": 12,
      "rooms": ["user:1", "project:123"]
    },
    "sse": {
      "totalClients": 8,
      "authenticatedClients": 6,
      "rooms": [...]
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `GET /api/realtime/health`
فحص صحة الخدمات.

**Response:**
```json
{
  "success": true,
  "health": {
    "websocket": {
      "status": "operational",
      "initialized": true
    },
    "sse": {
      "status": "operational",
      "clients": 8
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `POST /api/realtime/test`
إرسال حدث تجريبي (للإدارة فقط).

**Request Body:**
```json
{
  "eventType": "system:info",
  "payload": {
    "message": "Test event",
    "level": "info"
  },
  "target": "all"
}
```

#### `GET /api/realtime/analysis/:analysisId/stream`
بث سجلات التحليل عبر SSE.

#### `GET /api/realtime/jobs/:jobId/stream`
بث تقدم الوظيفة عبر SSE.

### 5. Realtime Types (`realtime.types.ts`)

تعريفات TypeScript للأحداث والحمولات.

**أنواع الأحداث الرئيسية:**
```typescript
export enum RealtimeEventType {
  // Job Events
  JOB_STARTED = 'job:started',
  JOB_PROGRESS = 'job:progress',
  JOB_COMPLETED = 'job:completed',
  JOB_FAILED = 'job:failed',

  // Analysis Events
  ANALYSIS_STARTED = 'analysis:started',
  ANALYSIS_PROGRESS = 'analysis:progress',
  ANALYSIS_COMPLETED = 'analysis:completed',

  // System Events
  SYSTEM_INFO = 'system:info',
  SYSTEM_WARNING = 'system:warning',
  SYSTEM_ERROR = 'system:error',

  // Connection Events
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  AUTHENTICATED = 'authenticated'
}
```

**حمولات الأحداث:**
```typescript
export interface JobProgressPayload extends RealtimeBasePayload {
  jobId: string;
  queueName: string;
  progress: number; // 0-100
  status: 'active' | 'waiting' | 'completed' | 'failed';
  message?: string;
  currentStep?: string;
  totalSteps?: number;
}

export interface AnalysisProgressPayload extends RealtimeBasePayload {
  projectId: string;
  analysisId: string;
  currentStation: number;
  totalStations: number;
  stationName: string;
  progress: number;
  logs?: string[];
}
```

**دوال مساعدة:**
```typescript
// إنشاء اسم غرفة
createRoomName(WebSocketRoom.USER, 'user-123') // => 'user:user-123'

// إنشاء حدث
createRealtimeEvent<JobProgressPayload>(
  RealtimeEventType.JOB_PROGRESS,
  { jobId, progress, ... }
)
```

### 6. WebSocket Configuration (`websocket.config.ts`)

إعدادات Socket.IO.

**الإعدادات الرئيسية:**
```typescript
export const socketIOOptions = {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,      // 60 ثانية
  pingInterval: 25000,     // 25 ثانية
  connectTimeout: 45000,   // 45 ثانية
  transports: ['websocket', 'polling'],
  maxHttpBufferSize: 1e6   // 1MB
};
```

**الثوابت:**
```typescript
export const WEBSOCKET_CONFIG = {
  EVENTS: {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    ERROR: 'error'
  },
  TIMEOUTS: {
    AUTHENTICATION: 5000,  // 5 ثوانٍ
    HEARTBEAT: 30000       // 30 ثانية
  },
  LIMITS: {
    MAX_ROOMS_PER_SOCKET: 10
  }
};
```

## الاختبارات

تم إنشاء اختبارات شاملة لجميع المكونات:

### 1. WebSocket Service Tests (`websocket.service.test.ts`)

**التغطية:**
- ✅ تهيئة الخدمة
- ✅ معالجة الاتصالات
- ✅ المصادقة (نجاح وفشل)
- ✅ إدارة الغرف (اشتراك وإلغاء اشتراك)
- ✅ البث (للكل، لغرفة، لمستخدم)
- ✅ أحداث الوظائف
- ✅ الإحصائيات
- ✅ الإغلاق
- ✅ معالجة الأخطاء

**عدد الاختبارات:** 25+ اختبار

### 2. SSE Service Tests (`sse.service.test.ts`)

**التغطية:**
- ✅ تهيئة الاتصال
- ✅ إعداد الـ Headers
- ✅ Keep-alive
- ✅ اشتراكات الغرف
- ✅ إرسال الأحداث
- ✅ البث للغرف والمستخدمين
- ✅ بث البيانات الخام
- ✅ قطع الاتصال
- ✅ الإحصائيات
- ✅ معالجة الأخطاء

**عدد الاختبارات:** 30+ اختبار

### 3. Realtime Service Tests (`realtime.service.test.ts`)

**التغطية:**
- ✅ البث المتعدد القنوات
- ✅ الرسائل للغرف والمستخدمين
- ✅ أحداث الوظائف الكاملة
- ✅ أحداث التحليل
- ✅ أحداث النظام
- ✅ الإحصائيات الشاملة
- ✅ فحص الصحة
- ✅ ميزات SSE الخاصة
- ✅ الإغلاق
- ✅ سيناريوهات التكامل

**عدد الاختبارات:** 35+ اختبار

## أمثلة الاستخدام

### جانب الخادم

#### 1. التكامل مع BullMQ

```typescript
import { realtimeService } from '@/services/realtime.service';

export async function processAnalysisJob(job: Job) {
  const { userId, projectId, analysisId } = job.data;

  // بدء الوظيفة
  realtimeService.emitJobStarted({
    jobId: job.id as string,
    queueName: 'ai-analysis',
    jobName: job.name,
    userId
  });

  try {
    // تحديث التقدم
    for (let i = 1; i <= 7; i++) {
      await job.updateProgress((i / 7) * 100);

      realtimeService.emitAnalysisProgress({
        projectId,
        analysisId,
        currentStation: i,
        totalStations: 7,
        stationName: `Station ${i}`,
        progress: (i / 7) * 100,
        userId
      });

      // معالجة المحطة...
    }

    // اكتمال الوظيفة
    realtimeService.emitJobCompleted({
      jobId: job.id as string,
      queueName: 'ai-analysis',
      result: { success: true },
      duration: Date.now() - job.timestamp,
      userId
    });

  } catch (error) {
    // فشل الوظيفة
    realtimeService.emitJobFailed({
      jobId: job.id as string,
      queueName: 'ai-analysis',
      error: error.message,
      attemptsMade: job.attemptsMade,
      attemptsMax: job.opts.attempts || 3,
      userId
    });
  }
}
```

#### 2. التكامل مع Routes

```typescript
import express from 'express';
import { realtimeController } from '@/controllers/realtime.controller';

const router = express.Router();

// SSE connections
router.get('/events', realtimeController.connectSSE);

// Statistics
router.get('/stats', realtimeController.getStats);

// Health check
router.get('/health', realtimeController.healthCheck);

// Test event (admin only)
router.post('/test', authMiddleware, realtimeController.sendTestEvent);

// Stream analysis logs
router.get('/analysis/:analysisId/stream', realtimeController.streamAnalysisLogs);

// Stream job progress
router.get('/jobs/:jobId/stream', realtimeController.streamJobProgress);

export default router;
```

### جانب العميل

#### 1. WebSocket Client (Socket.IO)

```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling']
});

// الاتصال
socket.on('connected', (data) => {
  console.log('Connected:', data);

  // المصادقة
  socket.emit('authenticate', {
    userId: 'user-123',
    token: 'jwt-token'
  });
});

// المصادقة الناجحة
socket.on('authenticated', (data) => {
  console.log('Authenticated:', data);

  // الاشتراك في الغرف
  socket.emit('subscribe', { room: 'project:project-123' });
  socket.emit('subscribe', { room: 'queue:ai-analysis' });
});

// الاستماع لتقدم الوظيفة
socket.on('job:progress', (data) => {
  console.log('Job progress:', data.progress);
  updateProgressBar(data.progress);
});

// الاستماع لتقدم التحليل
socket.on('analysis:progress', (data) => {
  console.log(`Station ${data.currentStation}/${data.totalStations}`);
  data.logs?.forEach(log => appendLog(log));
});

// اكتمال الوظيفة
socket.on('job:completed', (data) => {
  console.log('Job completed:', data.result);
  showSuccessMessage();
});

// فشل الوظيفة
socket.on('job:failed', (data) => {
  console.error('Job failed:', data.error);
  showErrorMessage(data.error);
});
```

#### 2. SSE Client (EventSource)

```typescript
// اتصال SSE عام
const eventSource = new EventSource('/api/realtime/events', {
  withCredentials: true
});

// الاتصال
eventSource.addEventListener('connected', (event) => {
  const data = JSON.parse(event.data);
  console.log('SSE Connected:', data);
});

// تقدم الوظيفة
eventSource.addEventListener('job:progress', (event) => {
  const data = JSON.parse(event.data);
  updateProgressBar(data.progress);
});

// تقدم التحليل
eventSource.addEventListener('analysis:progress', (event) => {
  const data = JSON.parse(event.data);
  console.log(`Analysis: ${data.progress}%`);
});

// معالجة الأخطاء
eventSource.onerror = (error) => {
  console.error('SSE Error:', error);
  // إعادة الاتصال تلقائيًا
};

// بث محدد للتحليل
const analysisStream = new EventSource(
  `/api/realtime/analysis/${analysisId}/stream`,
  { withCredentials: true }
);

analysisStream.addEventListener('analysis:progress', (event) => {
  const data = JSON.parse(event.data);
  data.logs?.forEach(log => appendLog(log));
});
```

#### 3. React Hook Example

```typescript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export function useRealtimeUpdates(userId: string) {
  const [connected, setConnected] = useState(false);
  const [jobProgress, setJobProgress] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connected', () => {
      socket.emit('authenticate', { userId });
    });

    socket.on('authenticated', () => {
      setConnected(true);
      socket.emit('subscribe', { room: `user:${userId}` });
    });

    socket.on('job:progress', (data) => {
      setJobProgress(prev => new Map(prev).set(data.jobId, data.progress));
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return { connected, jobProgress };
}
```

## بروتوكول الرسائل الموحد

تم توحيد بروتوكول الرسائل بين WebSocket و SSE:

### 1. هيكل الحدث

```typescript
interface RealtimeEvent<T> {
  event: RealtimeEventType;  // نوع الحدث
  payload: T;                // البيانات
}
```

### 2. هيكل الحمولة الأساسي

```typescript
interface RealtimeBasePayload {
  timestamp: string;         // وقت الحدث (ISO 8601)
  eventType: RealtimeEventType;  // نوع الحدث
  userId?: string;           // معرف المستخدم (اختياري)
}
```

### 3. تنسيق SSE

```
id: event-id-123
event: job:progress
data: {"jobId":"job-123","progress":50,"timestamp":"..."}

```

### 4. تنسيق WebSocket

```typescript
socket.emit('job:progress', {
  jobId: 'job-123',
  progress: 50,
  timestamp: '...'
});
```

## الأداء والتحسينات

### 1. WebSocket
- **Keep-alive:** 30 ثانية
- **Ping Interval:** 25 ثانية
- **Ping Timeout:** 60 ثانية
- **Max Buffer:** 1MB
- **Compression:** مفعل للرسائل > 1KB في الإنتاج

### 2. SSE
- **Keep-alive Comments:** كل 30 ثانية
- **Auto-reconnect:** دعم Last-Event-ID
- **Buffer:** بدون تخزين مؤقت (X-Accel-Buffering: no)

### 3. معالجة الأخطاء
- إعادة الاتصال التلقائي
- مهلة المصادقة (5 ثوانٍ)
- تنظيف الموارد عند قطع الاتصال
- تسجيل شامل للأخطاء

## الأمان

### 1. المصادقة
- مهلة المصادقة الإلزامية (5 ثوانٍ)
- دعم JWT (جاهز للتطبيق)
- معرفات المستخدم الآمنة

### 2. CORS
- تكوين CORS قابل للتخصيص
- دعم Credentials
- قيود Origin

### 3. حدود الموارد
- حد أقصى للغرف لكل اتصال (10)
- حد أقصى لحجم المخزن المؤقت (1MB)
- تنظيف تلقائي للاتصالات المنتهية

## المراقبة والإحصائيات

### 1. إحصائيات WebSocket
```typescript
{
  totalConnections: 15,
  authenticatedConnections: 12,
  rooms: ['user:1', 'project:123', 'queue:analysis']
}
```

### 2. إحصائيات SSE
```typescript
{
  totalClients: 8,
  authenticatedClients: 6,
  rooms: [
    { name: 'project:123', clients: 3 },
    { name: 'queue:analysis', clients: 2 }
  ],
  users: [
    { userId: 'user-1', clients: 2 }
  ]
}
```

### 3. فحص الصحة
```typescript
{
  websocket: {
    status: 'operational',
    initialized: true
  },
  sse: {
    status: 'operational',
    clients: 8
  },
  overall: 'healthy'
}
```

## التوصيات

### 1. اختيار القناة

**استخدم WebSocket عندما:**
- تحتاج إلى اتصال ثنائي الاتجاه
- تحتاج إلى زمن انتقال منخفض جدًا
- تريد دعم إعادة الاتصال التلقائي

**استخدم SSE عندما:**
- تحتاج فقط إلى تحديثات من الخادم إلى العميل
- تريد تنفيذًا أبسط
- تحتاج إلى دعم Last-Event-ID للإعادة

**استخدم كليهما عندما:**
- تريد أقصى توافق
- تريد التكرار (Redundancy)
- لديك حالات استخدام مختلطة

### 2. أفضل الممارسات

1. **استخدم الغرف للبث المستهدف**
   ```typescript
   // بدلاً من البث لجميع المستخدمين
   realtimeService.broadcast(event);

   // استهدف غرفة محددة
   realtimeService.toProject('project-123', event);
   ```

2. **قم بتنظيف الاتصالات**
   ```typescript
   // في جانب العميل
   useEffect(() => {
     const socket = io();
     return () => socket.disconnect();
   }, []);
   ```

3. **معالجة الأخطاء**
   ```typescript
   socket.on('error', (error) => {
     console.error('Socket error:', error);
     // معالجة الخطأ
   });
   ```

4. **استخدم أنواع TypeScript**
   ```typescript
   import type { JobProgressPayload } from '@/types/realtime.types';
   ```

## الخلاصة

تم تطوير نظام Real-time Communication شامل يوفر:

✅ **خدمة WebSocket كاملة** مع دعم Socket.IO
✅ **خدمة SSE قوية** مع Keep-alive و Last-Event-ID
✅ **خدمة موحدة** للبث عبر القنوات المتعددة
✅ **بروتوكول رسائل موحد** بين WebSocket و SSE
✅ **أنواع TypeScript شاملة** لجميع الأحداث والحمولات
✅ **اختبارات شاملة** (90+ اختبار)
✅ **وثائق مفصلة** مع أمثلة واضحة
✅ **أمان وأداء محسّنان**

النظام جاهز للإنتاج ويمكن استخدامه في جميع أنحاء التطبيق لتوفير تحديثات فورية للمستخدمين.
