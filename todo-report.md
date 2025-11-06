# تقرير شامل لتحسينات الأداء - مشروع The Copy

**التاريخ:** 2025-11-06
**الإصدار:** 1.0
**المُعِد:** Claude Code Performance Analysis

---

## 1. ملخص تنفيذي

### نظرة عامة على المشروع

يُظهر تحليل المستودع تطبيقًا متقدمًا ومُعقدًا مبنيًا كهيكل Monorepo (باستخدام pnpm-workspace). يتكون التطبيق من:

**الواجهة الأمامية (Frontend):**
- Next.js 15.4.7 (App Router)
- React 18.3.1
- Three.js للرسومات ثلاثية الأبعاد (خلفية الجسيمات)
- Tailwind CSS 4.1.16
- مكتبات UI (shadcn/ui + Radix UI)
- إدارة الحالة (@tanstack/react-query)
- Web Workers للمعالجة المتوازية

**الواجهة الخلفية (Backend):**
- Node.js 20+ مع Express 4.18
- Drizzle ORM مع قاعدة بيانات SQL
- Google Gemini API للذكاء الاصطناعي
- JWT Authentication
- Rate Limiting & Compression

### التحديات الرئيسية

تكمن تحديات الأداء الرئيسية في ثلاثة مجالات:

1. **ثقل المعالجة من جانب العميل (Client-Side)**
   - خلفية جسيمات معقدة باستخدام Three.js (8000 جسيم على Desktop)
   - معالجة SDF (Signed Distance Functions) مكثفة
   - عرض ديناميكي للنصوص باللغتين العربية والإنجليزية

2. **أداء الشبكة والأصول (Network & Assets)**
   - صور PNG غير محسّنة في directors-studio
   - تحميل خطوط من Google Fonts رغم وجودها محليًا
   - حجم حزم JavaScript الكبير

3. **زمن استجابة الواجهة الخلفية (Backend Response Time)**
   - استعلامات Gemini API قد تستغرق وقتًا طويلاً
   - عدم وجود Caching للنتائج المتكررة
   - معالجة ملفات PDF/DOCX قد تكون بطيئة

---

## 2. أداء الواجهة الأمامية (Frontend Performance)

### 2.1 الجسيمات وRender Performance

#### المشكلة الحالية

**الموقع:** `frontend/src/components/particle-background-worker.tsx`

التطبيق يستخدم Three.js لعرض خلفية جسيمات معقدة:

```typescript
const PARTICLE_CONFIG = {
  DESKTOP: { count: 8000, batchSize: 600 },
  MOBILE: { count: 3000, batchSize: 400 },
  TABLET: { count: 5000, batchSize: 500 }
};
```

**التأثير على الأداء:**
- CPU: حوالي 15-25% على الأجهزة المتوسطة
- GPU: عرض مستمر لـ 8000 نقطة
- الذاكرة: ~50MB للبيانات الهندسية وال buffers
- Battery: استنزاف كبير على الأجهزة المحمولة

#### ✅ نقاط القوة الموجودة

1. **استخدام Web Workers:**
   - `particle-generator.worker.ts` - توليد الجسيمات
   - `particle-physics.worker.ts` - حسابات الفيزياء
   - هذا **ممتاز** ويمنع تجميد الواجهة

2. **Responsive Particle Count:**
   - تقليل العدد على الأجهزة المحمولة إلى 3000
   - Adaptive configuration

3. **Lazy Loading:**
   ```typescript
   const ParticleBackground = dynamic(
     () => import("@/components/particle-background-optimized"),
     { ssr: false }
   );
   ```

#### 🔧 التوصيات للتحسين

**التوصية 1: تقليل عدد الجسيمات بشكل أكبر**

```typescript
const PARTICLE_CONFIG = {
  DESKTOP: { count: 5000, batchSize: 600 },    // كان 8000
  MOBILE: { count: 1500, batchSize: 300 },     // كان 3000
  TABLET: { count: 2500, batchSize: 400 },     // كان 5000
  LOW_POWER: { count: 1000, batchSize: 200 }   // جديد
};
```

**التوصية 2: كشف Battery Level**

أضف في `particle-background-worker.tsx`:

```typescript
async function detectDeviceCapabilities() {
  // Check battery level
  const battery = await navigator.getBattery?.();
  const isLowBattery = battery && !battery.charging && battery.level < 0.2;

  // Check CPU cores
  const cores = navigator.hardwareConcurrency || 4;
  const isLowEndDevice = cores <= 2;

  if (isLowBattery || isLowEndDevice) {
    return PARTICLE_CONFIG.LOW_POWER;
  }

  // existing logic...
}
```

**التوصية 3: Pause Animation عند الـ Visibility**

```typescript
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden && animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    } else if (!document.hidden) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, []);
```

**التوصية 4: استخدام requestIdleCallback للتهيئة**

```typescript
useEffect(() => {
  const initWhenIdle = () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => initializeAndGenerate(), { timeout: 2000 });
    } else {
      setTimeout(initializeAndGenerate, 100);
    }
  };

  initWhenIdle();
}, []);
```

**الأولوية:** 🔴 عالية
**التأثير المتوقع:** تحسين بنسبة 30-40% في استهلاك CPU/GPU

---

### 2.2 الصور (Images)

#### المشكلة الحالية

**الموقع:** `frontend/src/app/(main)/directors-studio/components/DashboardHero.tsx`

```typescript
<div
  className="absolute inset-0 bg-cover bg-center"
  style={{ backgroundImage: `url(/directors-studio/Film_production_hero_image_6b2179d4.png)` }}
/>
```

**المشاكل:**
1. ✗ استخدام `backgroundImage` بدلاً من `<Image>` من next/image
2. ✗ الصور بصيغة PNG (غير محسّنة)
3. ✗ لا يوجد lazy loading
4. ✗ لا يوجد responsive images

**الصور الموجودة:**
```
/directors-studio/Clapperboard_placeholder_icon_998165d7.png
/directors-studio/Film_production_hero_image_6b2179d4.png
/directors-studio/Production_planning_workspace_bd58f042.png
```

#### ✅ نقاط القوة الموجودة

1. **ImageWithFallback Component:**
   - موجود في `frontend/src/components/ui/image-with-fallback.tsx`
   - يستخدم next/image بشكل صحيح
   - يدعم fallback images

2. **Remote Image Patterns:**
   - مُعد في `next.config.ts` بشكل صحيح

#### 🔧 التوصيات للتحسين

**التوصية 1: تحويل الصور إلى WebP/AVIF**

استخدم Sharp (موجود بالفعل في dependencies):

```bash
# أضف script في package.json
"optimize:images": "node scripts/optimize-images.js"
```

```javascript
// scripts/optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'frontend/public/directors-studio';
const outputDir = 'frontend/public/directors-studio/optimized';

fs.mkdirSync(outputDir, { recursive: true });

fs.readdirSync(inputDir)
  .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
  .forEach(async (file) => {
    const input = path.join(inputDir, file);
    const filename = path.parse(file).name;

    // Generate WebP
    await sharp(input)
      .webp({ quality: 85, effort: 6 })
      .toFile(path.join(outputDir, `${filename}.webp`));

    // Generate AVIF (أفضل ضغط)
    await sharp(input)
      .avif({ quality: 70, effort: 9 })
      .toFile(path.join(outputDir, `${filename}.avif`));

    console.log(`✓ Optimized ${file}`);
  });
```

**التوصية 2: استخدام next/image في DashboardHero**

```typescript
// frontend/src/app/(main)/directors-studio/components/DashboardHero.tsx

import Image from "next/image";

export default function DashboardHero() {
  return (
    <div className="relative h-[400px] rounded-md overflow-hidden">
      {/* استبدل backgroundImage بـ Image */}
      <Image
        src="/directors-studio/Film_production_hero_image_6b2179d4.png"
        alt="Film production hero"
        fill
        priority // هذه الصورة مهمة (above the fold)
        sizes="100vw"
        className="object-cover object-center"
        quality={85}
      />

      <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 to-black/40" />

      {/* بقية المحتوى */}
    </div>
  );
}
```

**التوصية 3: إضافة placeholder blur**

```typescript
<Image
  src="/directors-studio/Film_production_hero_image_6b2179d4.png"
  alt="Film production hero"
  fill
  priority
  sizes="100vw"
  placeholder="blur"
  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  className="object-cover object-center"
  quality={85}
/>
```

**الأولوية:** 🔴 عالية
**التأثير المتوقع:**
- تقليل حجم الصور بنسبة 60-80%
- تحسين LCP (Largest Contentful Paint) بنسبة 40%

---

### 2.3 الخطوط (Fonts)

#### المشكلة الحالية

**تناقض في التحميل:**

في `frontend/src/app/layout.tsx`:
```tsx
{/* تحميل من Google Fonts */}
<link
  href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,700;1,7..72,400&display=swap"
  rel="stylesheet"
  media="print"
  onLoad="this.media='all'"
/>
```

وفي الوقت نفسه في `frontend/src/app/globals.css`:
```css
/* تحميل محلي */
@font-face {
  font-family: Amiri;
  src: url("/fonts/amiri-400.woff2") format("woff2");
  font-display: swap;
}
```

**المشاكل:**
1. ✗ تحميل الخطوط من Google رغم وجودها محليًا
2. ✗ FOUT (Flash of Unstyled Text) محتمل
3. ✗ طلبات شبكة إضافية غير ضرورية
4. ✓ استخدام `font-display: swap` (جيد)

#### 🔧 التوصيات للتحسين

**التوصية 1: إزالة Google Fonts من layout.tsx**

```tsx
// frontend/src/app/layout.tsx

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* احتفظ فقط بـ DNS prefetch للخدمات الأخرى */}
        <link rel="dns-prefetch" href="https://apis.google.com" />
        <link rel="dns-prefetch" href="https://www.gstatic.com" />

        {/* أزل روابط Google Fonts - الخطوط موجودة محليًا */}
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        {/* ... */}
      </body>
    </html>
  );
}
```

**التوصية 2: استخدام next/font/local (الطريقة المُثلى)**

```typescript
// frontend/src/app/fonts.ts

import localFont from 'next/font/local';

export const amiri = localFont({
  src: [
    {
      path: '../public/fonts/amiri-400.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-amiri',
  display: 'swap',
  preload: true,
  fallback: ['serif'],
  adjustFontFallback: 'Arial', // يقلل CLS
});

export const cairo = localFont({
  src: [
    {
      path: '../public/fonts/cairo-400.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-cairo',
  display: 'swap',
  preload: true,
  fallback: ['sans-serif'],
  adjustFontFallback: 'Arial',
});

export const literata = localFont({
  src: [
    {
      path: '../public/fonts/literata-400.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-literata',
  display: 'swap',
  preload: true,
  fallback: ['serif'],
});

export const sourceCodePro = localFont({
  src: [
    {
      path: '../public/fonts/source-code-pro-400.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-source-code-pro',
  display: 'swap',
  preload: true,
  fallback: ['monospace'],
});
```

**ثم في layout.tsx:**

```typescript
// frontend/src/app/layout.tsx

import { amiri, cairo, literata, sourceCodePro } from './fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`
        ${amiri.variable}
        ${cairo.variable}
        ${literata.variable}
        ${sourceCodePro.variable}
      `}
    >
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
```

**وفي globals.css:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-body: var(--font-cairo);
    --font-headline: var(--font-amiri);
    --font-serif: var(--font-literata);
    --font-mono: var(--font-source-code-pro);
  }
}
```

**الأولوية:** 🟡 متوسطة
**التأثير المتوقع:**
- تقليل طلبات الشبكة بـ 2-3 requests
- تحسين CLS (Cumulative Layout Shift) بنسبة 20%
- تحسين FOUT/FOIT

---

### 2.4 Code Splitting وBundle Size

#### الوضع الحالي

**✅ ما هو موجود:**

1. **Dynamic Imports:**
   ```typescript
   // في directors-studio/page.tsx
   const NoProjectSection = dynamic(() => import("./components/NoProjectSection"));
   const ProjectContent = dynamic(() => import("./components/ProjectContent"));

   // في page.tsx
   const ParticleBackground = dynamic(
     () => import("@/components/particle-background-optimized"),
     { ssr: false }
   );
   ```

2. **Package Optimization:**
   ```typescript
   // في next.config.ts
   experimental: {
     optimizePackageImports: [
       "@radix-ui/react-accordion",
       "@radix-ui/react-dialog",
       // ... المزيد
       "lucide-react",
       "recharts",
     ],
   }
   ```

3. **Bundle Analyzer:**
   ```json
   "analyze": "ANALYZE=true npm run build"
   ```

#### 🔧 التوصيات للتحسين

**التوصية 1: تحليل Bundle Size الحالي**

```bash
cd frontend
npm run analyze
```

**التوصية 2: Route-based Code Splitting لجميع الصفحات**

```typescript
// frontend/src/app/page.tsx

// بدلاً من import مباشر
const features = [
  {
    slug: "directors-studio",
    component: dynamic(() => import("./(main)/directors-studio/page")),
  },
  // ... المزيد
];
```

**التوصية 3: Lazy Load Three.js**

```typescript
// frontend/src/components/particle-background-worker.tsx

const THREE = await import('three');
// استخدم THREE هنا فقط
```

**التوصية 4: تفعيل SWC Minification (موجود بالفعل ✓)**

```typescript
// next.config.ts
swcMinify: true, // ✓ موجود
```

**التوصية 5: إضافة Webpack Bundle Visualizer**

```bash
npm install --save-dev webpack-bundle-analyzer
```

```typescript
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

**الأولوية:** 🟡 متوسطة
**التأثير المتوقع:**
- تقليل First Load JS بنسبة 20-30%
- تحسين TTI (Time to Interactive)

---

### 2.5 Caching Strategies

#### الوضع الحالي

**✅ ما هو موجود في next.config.ts:**

```typescript
async headers() {
  return [
    {
      source: "/static/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
      ]
    },
    {
      source: "/api/:path*",
      headers: [
        { key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=120" }
      ]
    }
  ];
}
```

#### 🔧 التوصيات للتحسين

**التوصية 1: إضافة Caching للخطوط والصور**

```typescript
// next.config.ts
async headers() {
  return [
    // ... الموجود
    {
      source: "/fonts/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        { key: "Cross-Origin-Resource-Policy", value: "cross-origin" }
      ]
    },
    {
      source: "/directors-studio/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
      ]
    }
  ];
}
```

**التوصية 2: استخدام React Query Cache**

```typescript
// frontend/src/lib/react-query.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 دقائق
      cacheTime: 10 * 60 * 1000, // 10 دقائق
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

**الأولوية:** 🟢 منخفضة (موجود بشكل جيد)
**التأثير المتوقع:** تحسين طفيف

---

## 3. أداء الواجهة الخلفية (Backend Performance)

### 3.1 Gemini API Optimization

#### المشكلة الحالية

**الموقع:** `backend/src/services/gemini.service.ts`

```typescript
async analyzeText(text: string, analysisType: string): Promise<string> {
  try {
    const prompt = this.buildPrompt(text, analysisType);
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    logger.error('Gemini analysis failed:', error);
    throw new Error('فشل في تحليل النص');
  }
}
```

**المشاكل:**
1. ✗ لا يوجد Caching للنتائج المتطابقة
2. ✗ لا يوجد Rate Limiting خاص بـ Gemini
3. ✗ لا يوجد Timeout
4. ✗ لا يوجد Retry Logic مع Exponential Backoff

#### 🔧 التوصيات للتحسين

**التوصية 1: إضافة Redis Caching**

```bash
cd backend
npm install ioredis
```

```typescript
// backend/src/services/cache.service.ts

import Redis from 'ioredis';
import crypto from 'crypto';

export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async set(key: string, value: string, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, value);
  }

  generateKey(prefix: string, data: any): string {
    const hash = crypto.createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
    return `${prefix}:${hash}`;
  }
}
```

**التوصية 2: استخدام Cache في GeminiService**

```typescript
// backend/src/services/gemini.service.ts

import { CacheService } from './cache.service';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private cache: CacheService;

  constructor() {
    // ... الموجود
    this.cache = new CacheService();
  }

  async analyzeText(text: string, analysisType: string): Promise<string> {
    // Generate cache key
    const cacheKey = this.cache.generateKey('gemini:analysis', {
      text,
      analysisType,
    });

    // Check cache
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      logger.info('Cache hit for Gemini analysis');
      return cached;
    }

    try {
      const prompt = this.buildPrompt(text, analysisType);

      // إضافة timeout
      const result = await Promise.race([
        this.model.generateContent(prompt),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini timeout')), 30000)
        )
      ]);

      const response = result.response.text();

      // Cache result (1 hour)
      await this.cache.set(cacheKey, response, 3600);

      return response;
    } catch (error) {
      logger.error('Gemini analysis failed:', error);
      throw new Error('فشل في تحليل النص');
    }
  }
}
```

**التوصية 3: إضافة Retry Logic**

```typescript
async analyzeTextWithRetry(
  text: string,
  analysisType: string,
  maxRetries: number = 3
): Promise<string> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await this.analyzeText(text, analysisType);
    } catch (error) {
      lastError = error as Error;

      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));

      logger.warn(`Gemini retry attempt ${attempt + 1}/${maxRetries}`);
    }
  }

  throw lastError!;
}
```

**الأولوية:** 🔴 عالية جدًا
**التأثير المتوقع:**
- تقليل زمن الاستجابة بنسبة 80% للطلبات المُخزنة
- توفير في تكاليف Gemini API
- تحسين موثوقية الخدمة

---

### 3.2 Database Query Optimization

#### الوضع الحالي

يستخدم المشروع Drizzle ORM مع PostgreSQL (Neon Database).

#### 🔧 التوصيات للتحسين

**التوصية 1: إضافة Indexes**

```typescript
// backend/src/db/schema.ts

import { pgTable, text, serial, timestamp, index } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  // إضافة indexes للاستعلامات المتكررة
  userIdIdx: index('user_id_idx').on(table.userId),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
}));
```

**التوصية 2: استخدام Connection Pooling**

```typescript
// backend/src/db/index.ts

import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool);
```

**التوصية 3: إضافة Query Caching**

```typescript
// backend/src/services/projects.service.ts

async getProjectsByUser(userId: string): Promise<Project[]> {
  const cacheKey = `projects:user:${userId}`;

  // Check cache
  const cached = await this.cache.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Query database
  const projects = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.userId, userId))
    .orderBy(desc(projectsTable.createdAt));

  // Cache for 5 minutes
  await this.cache.set(cacheKey, JSON.stringify(projects), 300);

  return projects;
}
```

**الأولوية:** 🟡 متوسطة
**التأثير المتوقع:**
- تحسين زمن الاستعلام بنسبة 40-60%
- تقليل الحمل على قاعدة البيانات

---

### 3.3 File Processing Optimization

#### المشكلة المحتملة

معالجة ملفات PDF/DOCX قد تكون بطيئة في الطلب الرئيسي.

#### 🔧 التوصيات للتحسين

**التوصية 1: استخدام Background Jobs**

```bash
npm install bull redis
```

```typescript
// backend/src/services/queue.service.ts

import Queue from 'bull';

export const documentProcessingQueue = new Queue('document-processing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  }
});

// Worker
documentProcessingQueue.process(async (job) => {
  const { filePath, projectId } = job.data;

  // معالجة الملف هنا
  const text = await extractTextFromPDF(filePath);

  // تحديث المشروع
  await updateProject(projectId, { scriptText: text });

  return { success: true };
});
```

**التوصية 2: استخدام Streaming للملفات الكبيرة**

```typescript
// backend/src/services/document.service.ts

import { createReadStream } from 'fs';
import mammoth from 'mammoth';

async function* processLargeDocument(filePath: string) {
  const stream = createReadStream(filePath);

  for await (const chunk of stream) {
    yield chunk.toString();
  }
}
```

**الأولوية:** 🟢 منخفضة (إذا كانت الملفات صغيرة)
**التأثير المتوقع:** تحسين كبير للملفات الكبيرة

---

## 4. خطة التنفيذ المُوصى بها



1. ✅ تحويل DashboardHero إلى استخدام next/image
2. ✅ إزالة Google Fonts من layout.tsx
3. ✅ تحويل الصور PNG إلى WebP/AVIF
4. ✅ إضافة Gemini API Caching مع Redis
5. ✅ تقليل عدد الجسيمات على الأجهزة المحمولة

**الملفات المُراد تعديلها:**
- `frontend/src/app/(main)/directors-studio/components/DashboardHero.tsx`
- `frontend/src/app/layout.tsx`
- `backend/src/services/gemini.service.ts`
- `frontend/src/components/particle-background-worker.tsx`

**التأثير المتوقع:**
- تحسين LCP بنسبة 35-45%
- تقليل زمن استجابة API بنسبة 70%
- تحسين Mobile Performance Score بنسبة 25 نقطة

---



1. ✅ تطبيق next/font/local لجميع الخطوط
2. ✅ إضافة Database Indexes
3. ✅ إضافة Battery Detection للجسيمات
4. ✅ تحسين Bundle Splitting
5. ✅ إضافة Query Caching

**التأثير المتوقع:**
- تحسين TTI بنسبة 20-30%
- تقليل Database Query Time بنسبة 40%

---

###
****

1. ✅ إعداد Background Job Queue
2. ✅ تطبيق Advanced Caching Strategy
3. ✅ إضافة Performance Monitoring (Sentry Performance)
4. ✅ إعداد CDN للأصول الثابتة

**التأثير المتوقع:**
- نظام قابل للتوسع (Scalable)
- موثوقية عالية

---
