# نظام الاتصالات الحية (Real-time Communication System)

## نظرة عامة

تم تطوير نظام اتصالات حية شامل يدعم **WebSocket** و **Server-Sent Events (SSE)** لبث التحديثات الحية للعملاء. يوفر النظام بروتوكول رسائل موحد وإدارة متقدمة للاتصالات.

---

## المكونات الرئيسية

### 1. WebSocket Service (`websocket.service.ts`)

خدمة إدارة اتصالات WebSocket باستخدام Socket.IO.

**الميزات:**
- ✅ إدارة الاتصالات والمصادقة
- ✅ نظام الغرف (Rooms) للبث المستهدف
- ✅ دعم Namespaces متعددة
- ✅ إعادة الاتصال التلقائي
- ✅ Heartbeat/Keep-alive
- ✅ معالجة الأخطاء المتقدمة

**الأحداث المدعومة:**
```typescript
- job:started       // بداية مهمة
- job:progress      // تقدم المهمة
- job:completed     // اكتمال المهمة
- job:failed        // فشل المهمة
- analysis:progress // تقدم التحليل
- system:error      // أخطاء النظام
- system:info       // معلومات النظام
```

### 2. SSE Service (`sse.service.ts`)

خدمة إدارة اتصالات Server-Sent Events.

**الميزات:**
- ✅ بث مستمر أحادي الاتجاه
- ✅ دعم Last-Event-ID لإعادة الاتصال
- ✅ Keep-alive تلقائي
- ✅ إدارة الاشتراكات في الغرف
- ✅ بث البيانات الكبيرة (Logs)

**متى تستخدم SSE:**
- بث السجلات (Logs) المستمر
- التحديثات الطويلة المدى
- الأنظمة التي لا تحتاج اتصال ثنائي الاتجاه

### 3. Unified Message Protocol

بروتوكول رسائل موحد بين WebSocket و SSE.

```typescript
interface RealtimeEvent<T> {
  event: RealtimeEventType;
  payload: T & {
    timestamp: string;
    eventType: RealtimeEventType;
    userId?: string;
  };
}
```

---

## API Endpoints

### WebSocket Connection

```
ws://localhost:3000
```

**Authentication:**
```javascript
socket.emit('authenticate', {
  userId: 'user-123',
  token: 'jwt-token'
});
```

**Subscribe to Rooms:**
```javascript
socket.emit('subscribe', { room: 'project:abc123' });
socket.emit('subscribe', { room: 'queue:ai-analysis' });
```

### SSE Endpoints

#### 1. General Events Stream
```
GET /api/realtime/events
Authorization: Bearer <token>
```

**Response:**
```
Content-Type: text/event-stream

event: connected
data: {"timestamp":"2025-11-07T00:00:00Z","message":"Connected"}

event: job:progress
data: {"jobId":"123","progress":50,"message":"Processing..."}
```

#### 2. Job-Specific Stream
```
GET /api/realtime/jobs/:jobId/stream
Authorization: Bearer <token>
```

#### 3. Analysis Stream
```
GET /api/realtime/analysis/:analysisId/stream
Authorization: Bearer <token>
```

#### 4. Real-time Stats
```
GET /api/realtime/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "websocket": {
      "totalConnections": 15,
      "authenticatedConnections": 12,
      "rooms": ["user:123", "project:abc"]
    },
    "sse": {
      "totalClients": 8,
      "authenticatedClients": 7,
      "rooms": [{"name": "job:456", "clients": 2}]
    }
  }
}
```

#### 5. Health Check
```
GET /api/realtime/health
```

#### 6. Test Event (Admin only)
```
POST /api/realtime/test
Authorization: Bearer <token>

{
  "eventType": "system:info",
  "payload": {
    "message": "Test message"
  },
  "target": "websocket" | "sse" | null
}
```

---

## Bull Board Dashboard (مع المصادقة)

**الوصول:**
```
http://localhost:3000/admin/queues
```

**المصادقة:** يتطلب تسجيل الدخول (JWT Token)

**الميزات:**
- ✅ مراقبة جميع الطوابير (Queues)
- ✅ عرض حالة المهام
- ✅ إعادة محاولة المهام الفاشلة
- ✅ تنظيف المهام القديمة
- ✅ إحصائيات مفصلة

---

## أمثلة الاستخدام

### مثال 1: استخدام WebSocket في Frontend

```javascript
import io from 'socket.io-client';

// الاتصال
const socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling'],
});

// المصادقة
socket.on('connected', () => {
  socket.emit('authenticate', {
    userId: 'user-123',
    token: localStorage.getItem('token'),
  });
});

// الاستماع للأحداث
socket.on('job:progress', (data) => {
  console.log('Progress:', data.progress);
  updateProgressBar(data.progress);
});

socket.on('job:completed', (data) => {
  console.log('Job completed:', data.result);
  showSuccessMessage();
});

socket.on('job:failed', (data) => {
  console.error('Job failed:', data.error);
  showErrorMessage(data.error);
});

// الاشتراك في غرفة
socket.emit('subscribe', { room: 'project:abc123' });

// إلغاء الاشتراك
socket.emit('unsubscribe', { room: 'project:abc123' });
```

### مثال 2: استخدام SSE في Frontend

```javascript
// الاتصال بـ SSE
const eventSource = new EventSource(
  'http://localhost:3000/api/realtime/events',
  { withCredentials: true }
);

// الاستماع للأحداث
eventSource.addEventListener('job:progress', (event) => {
  const data = JSON.parse(event.data);
  console.log('Progress:', data.progress);
  updateProgressBar(data.progress);
});

eventSource.addEventListener('analysis:progress', (event) => {
  const data = JSON.parse(event.data);
  data.logs?.forEach(log => {
    appendLogToUI(log);
  });
});

// معالجة الأخطاء
eventSource.onerror = (error) => {
  console.error('SSE Error:', error);
  // إعادة الاتصال
  eventSource.close();
  reconnect();
};

// إغلاق الاتصال
function cleanup() {
  eventSource.close();
}
```

### مثال 3: بث التحديثات من Backend

```typescript
import { websocketService } from '@/services/websocket.service';
import { sseService } from '@/services/sse.service';

// بث تقدم المهمة
export async function processJob(job: any) {
  const userId = job.data.userId;

  // إرسال حدث البداية
  websocketService.emitJobStarted({
    jobId: job.id,
    queueName: 'ai-analysis',
    jobName: job.name,
    data: job.data,
    userId,
  });

  // معالجة المهمة مع تحديثات التقدم
  for (let i = 0; i <= 100; i += 10) {
    await job.updateProgress(i);

    // بث التقدم
    websocketService.emitJobProgress({
      jobId: job.id,
      queueName: 'ai-analysis',
      progress: i,
      status: 'active',
      message: `Processing: ${i}%`,
      userId,
    });

    // عمل المهمة
    await doWork();
  }

  // إرسال حدث الاكتمال
  websocketService.emitJobCompleted({
    jobId: job.id,
    queueName: 'ai-analysis',
    result: { success: true },
    duration: Date.now() - job.timestamp,
    userId,
  });
}

// بث إلى غرفة مشروع محدد
export function notifyProjectMembers(projectId: string, message: string) {
  const event = createRealtimeEvent(RealtimeEventType.SYSTEM_INFO, {
    level: 'info',
    message,
    details: { projectId },
  });

  websocketService.toProject(projectId, event);
  sseService.sendToRoom(`project:${projectId}`, event);
}
```

---

## نظام الغرف (Rooms)

### أنواع الغرف المدعومة:

1. **غرف المستخدمين** (`user:userId`)
   - لإرسال تحديثات خاصة بمستخدم معين

2. **غرف المشاريع** (`project:projectId`)
   - لإرسال تحديثات لجميع أعضاء المشروع

3. **غرف الطوابير** (`queue:queueName`)
   - لمراقبة طابور معين

4. **غرف المهام** (`job:jobId`)
   - لمتابعة مهمة محددة

5. **غرف التحليل** (`analysis:analysisId`)
   - لبث تقدم التحليل والسجلات

### مثال الاستخدام:

```typescript
import { createRoomName, WebSocketRoom } from '@/types/realtime.types';

// إنشاء اسم الغرفة
const userRoom = createRoomName(WebSocketRoom.USER, 'user-123');
// Result: "user:user-123"

const projectRoom = createRoomName(WebSocketRoom.PROJECT, 'project-abc');
// Result: "project:project-abc"

// إرسال إلى الغرفة
websocketService.toRoom(userRoom, event);
sseService.sendToRoom(projectRoom, event);
```

---

## الأمان والمصادقة

### WebSocket Authentication

```typescript
// على العميل
socket.emit('authenticate', {
  userId: 'user-123',
  token: 'jwt-token',
});

// يتم التحقق على الخادم
// إذا فشل: يتم إرسال حدث 'unauthorized' وقطع الاتصال
// إذا نجح: يتم إرسال حدث 'authenticated'
```

### SSE Authentication

يتم المصادقة عبر Middleware:

```typescript
app.get('/api/realtime/events', authMiddleware, realtimeController.connectSSE);
```

### Bull Board Authentication

يتطلب تسجيل الدخول:

```typescript
app.use('/admin/queues', getAuthenticatedBullBoardRouter());
```

---

## الإحصائيات والمراقبة

### الحصول على إحصائيات النظام

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/realtime/stats
```

### مراقبة الاتصالات

```typescript
const wsStats = websocketService.getStats();
console.log({
  totalConnections: wsStats.totalConnections,
  authenticatedConnections: wsStats.authenticatedConnections,
  rooms: wsStats.rooms,
});

const sseStats = sseService.getStats();
console.log({
  totalClients: sseStats.totalClients,
  rooms: sseStats.rooms,
});
```

---

## معالجة الأخطاء

### WebSocket Error Handling

```javascript
socket.on('system:error', (data) => {
  console.error('Error:', data.message);
  // معالجة الخطأ
  handleError(data);
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  if (reason === 'io server disconnect') {
    // إعادة الاتصال يدوياً
    socket.connect();
  }
});
```

### SSE Error Handling

```javascript
eventSource.onerror = (error) => {
  console.error('SSE Error:', error);

  if (eventSource.readyState === EventSource.CLOSED) {
    // الاتصال مغلق، أعد الاتصال
    reconnect();
  }
};
```

---

## أفضل الممارسات

### 1. اختيار بين WebSocket و SSE

**استخدم WebSocket عندما:**
- تحتاج اتصال ثنائي الاتجاه
- تحتاج تحديثات سريعة ومتكررة
- تحتاج عدة Namespaces/Rooms

**استخدم SSE عندما:**
- تحتاج بث أحادي الاتجاه فقط
- تحتاج بث سجلات طويلة
- تريد بساطة أكثر (Native Browser Support)

### 2. إدارة الاتصالات

```typescript
// في Frontend
let socket: Socket | null = null;
let eventSource: EventSource | null = null;

function connect() {
  socket = io('http://localhost:3000');
  setupSocketListeners();
}

function disconnect() {
  socket?.disconnect();
  eventSource?.close();
}

// عند تسجيل الخروج أو مغادرة الصفحة
useEffect(() => {
  connect();
  return () => disconnect();
}, []);
```

### 3. معالجة إعادة الاتصال

```typescript
// WebSocket
socket.on('disconnect', (reason) => {
  if (reason === 'transport close' || reason === 'transport error') {
    // Socket.IO سيعيد الاتصال تلقائياً
  }
});

// SSE
eventSource.onerror = () => {
  if (eventSource.readyState === EventSource.CLOSED) {
    setTimeout(() => {
      eventSource = new EventSource(url);
    }, 5000); // أعد الاتصال بعد 5 ثوان
  }
};
```

### 4. تحسين الأداء

```typescript
// استخدم الغرف لتقليل البث العام
websocketService.toUser(userId, event); // بدلاً من broadcast

// استخدم throttle/debounce للتحديثات المتكررة
const throttledUpdate = throttle((data) => {
  websocketService.emitJobProgress(data);
}, 1000); // مرة كل ثانية
```

---

## الاختبار

### اختبار WebSocket

```bash
# استخدم wscat
npm install -g wscat
wscat -c ws://localhost:3000

# بعد الاتصال
> {"event": "authenticate", "data": {"userId": "test-user"}}
```

### اختبار SSE

```bash
# استخدم curl
curl -N -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/realtime/events
```

### اختبار من الكود

```typescript
import { testRealtimeSystem } from '@/examples/realtime-usage.example';

// اختبار النظام
testRealtimeSystem();
```

---

## استكشاف الأخطاء

### المشكلة: لا يتم استقبال الأحداث

**الحلول:**
1. تحقق من المصادقة
2. تحقق من الاشتراك في الغرفة الصحيحة
3. تحقق من CORS settings
4. راجع console logs

### المشكلة: فقدان الاتصال المستمر

**الحلول:**
1. تحقق من Firewall/Proxy settings
2. تحقق من Load Balancer configuration (sticky sessions)
3. استخدم WebSocket بدلاً من polling
4. زيادة timeout settings

### المشكلة: Bull Board لا يعمل

**الحلول:**
1. تحقق من المصادقة (JWT token)
2. تحقق من Redis connection
3. راجع logs في `/admin/queues`

---

## الخلاصة

تم تطوير نظام اتصالات حية شامل يدعم:

✅ **WebSocket** (Socket.IO) - اتصال ثنائي الاتجاه
✅ **SSE** - بث أحادي الاتجاه
✅ **بروتوكول رسائل موحد**
✅ **نظام غرف متقدم**
✅ **مصادقة آمنة**
✅ **Bull Board Dashboard** مع المصادقة
✅ **معالجة أخطاء قوية**
✅ **أمثلة عملية شاملة**

للمزيد من المعلومات، راجع:
- `backend/src/services/websocket.service.ts`
- `backend/src/services/sse.service.ts`
- `backend/src/examples/realtime-usage.example.ts`
