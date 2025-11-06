find todo-report.md then 

# أمر تنفيذي مختصر (جاهز للنسخ لوكيل الترميز)

نفِّذ الآن خطة تحسين الأداء والبنية التالية على فرع جديد `perf/hardening-{YYYYMMDD}` مع اختبارات وقابلية قياس صارمة، ثم افتح PR واحد بعنوان **“Perf + Reliability Hardening (A/B/C)”** وفق قائمة المهام التفصيلية أدناه، ومعايير القبول والأثر المتوقع المحددين.

---

# TODO List موجه لوكيل الترميز (تنفيذ فوري)

## A) تحسينات واجهة المستخدم والأداء (LCP / Mobile)

1. تحويل `DashboardHero` إلى `next/image`

   * الملفات: `frontend/src/app/(main)/directors-studio/components/DashboardHero.tsx`
   * الخطوات: استبدال `<img>` بـ `<Image>`؛ ضبط `sizes`، `priority`، والتحكم في `placeholder="blur"` إن لزم؛ مراجعة `fill` مقابل `width/height`، وإضافة `alt` دقيق.
   * معايير القبول: عدم وجود تحذيرات Next/Image؛ تحسّن LCP بالمقارنة المرجعية ≥ 35% على صفحة Directors Studio.

2. إزالة Google Fonts من `layout.tsx`

   * الملفات: `frontend/src/app/layout.tsx`
   * الخطوات: إزالة الروابط الخارجية للخطوط؛ استخدام `next/font/local` (انظر مهمة B-1) وربط الطبقات (className) في الـ `<html>`.
   * معايير القبول: صفر طلبات خارجية للخطوط في الشبكة؛ عدم تغيّر التصميم.

3. تحويل صور PNG إلى WebP/AVIF

   * النطاق: كل صور الواجهة المتكررة الاستخدام (الأيقونات والثابتة).
   * الخطوات: سكربت تحويل (Node/Sharp) لإنتاج WebP وAVIF مع fallbacks؛ تحديث المراجع في المكوّنات/الستايلات.
   * معايير القبول: انخفاض حجم الأصول ≥ 30%؛ عدم وجود روابط صور مكسورة.

4. تقليل كثافة الجسيمات على الأجهزة المحمولة

   * الملفات: `frontend/src/components/particle-background-worker.tsx`
   * الخطوات: تطبيق حدود: Desktop=6000، Mobile=2000 (أو أقل مع كشف البطارية في B-3)؛ تعطيل التنفيذ على الخادم؛ استخدام `requestIdleCallback`/`IntersectionObserver` للتفعيل المتأخر.
   * معايير القبول: تحسّن Mobile Performance Score ≥ +25 نقطة؛ عدم تدهور FPS ملحوظ.

5. إضافة Gemini API Caching مع Redis (واجهة)

   * المكوّنات المستفيدة: أي طلبات للـ Gemini تُستدعى من الواجهة عبر الـ API.
   * الخطوات: ضمان جانب الخادم (راجع C-2) وتبنّي `stale-while-revalidate` للعرض الأول.
   * معايير القبول: عدم تكرار طلبات غير لازمة خلال جلسة المستخدم.

**أثر A المتوقع:** LCP ↑ 35–45%، Mobile Perf ↑ ≥ +25.

---

## B) بنية الخطوط والبيانات وتقسيم الحِزم

1. تطبيق `next/font/local` لجميع الخطوط

   * الملفات: `frontend/src/app/layout.tsx` + مجلد `frontend/src/fonts/*`
   * الخطوات: إضافة ملفات الخطوط محليًا (woff2 أولاً)؛ تعريف خط أساسي وثانوي؛ تمرير المتغيرات (CSS variables) إن وُجدت.
   * معايير القبول: تحميل الخط من الأصل المحلي فقط؛ عدم تغيّر القياسات.

2. إضافة فهارس قاعدة البيانات (Database Indexes)

   * الملفات: مخططات ORM (Prisma/Drizzle) + ترحيل (migrations)
   * الخطوات: تحديد أعمدة الاستعلام الكثيف (مثل: `userId`, `projectId`, `createdAt`, `slug`, `status`)؛ إنشاء فهارس مركبة حيث يلزم؛ ترحيل آمن.
   * معايير القبول: انخفاض متوسط زمن الاستعلام ≥ 40% في المسارات الأكثر استخدامًا.

3. Battery Detection للجسيمات

   * الملفات: `frontend/src/components/particle-background-worker.tsx` (أو ملف util)
   * الخطوات: استخدام `navigator.getBattery()` (مع حراسة التوافق) لتقليل `MAX_PARTICLES` عند البطارية < 30% أو وضع التوفير مفعل.
   * معايير القبول: انخفاض استهلاك المعالج/الطاقة في سيناريوهات البطارية المنخفضة.

4. تحسين Bundle Splitting

   * النطاق: صفحات/مكونات كبيرة؛ تبنّي `next/dynamic` بالمكان المناسب؛ تفكيك التبعيات الثقيلة إلى chunks منفصلة؛ التأكد من SSR حيث يلزم.
   * معايير القبول: انخفاض إجمالي JS المرسل للعميل ≥ 20%؛ عدم كسر SSR.

5. Query Caching

   * النطاق: طبقة الجلب (React Query/SWR/RSC Cache)
   * الخطوات: تعريف مفاتيح استعلامات ثابتة، TTLs، إبطال (invalidation) عند الكتابة؛ تبنّي `cache tags`/`revalidateTag` في RSC حيث مناسب.
   * معايير القبول: انخفاض زمن التفاعل الأول (TTI) 20–30% في الصفحات المستهدفة.

**أثر B المتوقع:** TTI ↑ 20–30%، DB Query Time ↓ ~40%.

---

## C) قابلية التوسع والموثوقية (الخلفية والبنية التحتية)

1. إعداد Background Job Queue

   * الملفات: `backend/src/queues/*`, `backend/src/index.ts`, `backend/.env`
   * التقنية المقترحة: BullMQ + Redis (تشارك نفس الـ Redis مع الكاش مع مساحات أسماء مختلفة).
   * الخطوات: تعريف طوابير للمهام الثقيلة (توليد/تحليل Gemini، تحويلات وسائط)؛ إعداد workers؛ إضافة واجهة مراقبة (Bull Board) محمية.
   * معايير القبول: نقل ≥ 90% من المهام الثقيلة إلى الخلفية؛ عدم بلوك لطلبات HTTP.

2. Advanced Caching Strategy (متعدد الطبقات)

   * الملفات: `backend/src/services/gemini.service.ts`، طبقة كاش مشتركة `backend/src/lib/cache.ts`
   * الخطوات: L1 Memory (LRU) + L2 Redis مع مفاتيح منظّمة: `gemini:{endpoint}:{hash(payload)}`؛ `TTL` افتراضي 10–30 دقيقة؛ `stale-if-error`؛ إبطال موجّه بالأحداث.
   * معايير القبول: زمن استجابة واجهات Gemini ↓ ~70%؛ معدل hit للكاش ≥ 70% لطلبات متكررة.

3. Performance Monitoring (Sentry Performance)

   * الملفات: إعداد Sentry للـ frontend/backend، تفعيل Traces + Profiling، ربط الـ release.
   * الخطوات: إضافة DSN عبر ENV؛ Sampling عقلاني (مثلاً 20–30% في التطوير، 5–10% في الإنتاج)؛ تسمية المعاملات الحرجة.
   * معايير القبول: ظهور معاملات الصفحات والـ API الرئيسية بلوحات Sentry مع خرائط لهب/تتبّع.

4. إعداد CDN للأصول الثابتة

   * الخطوات: تفعيل CDN (Cloudflare/CloudFront) لملفات `_next/static`, الصور, الخطوط؛ ضبط `assetPrefix`/`headers` و`Cache-Control`؛ تمكين `Image Optimization` من أقرب حافة.
   * معايير القبول: زمن تنزيل الأصول الثابتة ↓ ≥ 30% للمناطق المستهدفة؛ عدم كسر المسارات
   ت

 إضافة فهارس FK (4 فهارس أساسية)
 اختبار الأداء قبل/بعد بـ EXPLAIN ANALYZE
 توثيق التحسين المُحقق
ار

 تثبيت BullMQ + Redis
 إنشاء طابور التحليل (Queue)
 إنشاء معالج المهام (Worker)
 تحديث Controller + API
 اختبار شامل
ت

 تطبيق Cache لنتائج Gemini
 إضافة Cache Invalidation
 اختبار Cache Hit Ratio
الأدوات اللازمة:

pnpm add bullmq ioredis
pnpm add @bull-board/api @bull-board/express @bull-board/api/bullMQAdapter
 تفعيل Sentry + مراقبة الأخطاء
 إضافة WebSockets للتحديثات الفورية
 تحسين Particle System (Device Detection)
 إضافة فهارس مركّبة (3 فهارس)
 إعداد لوحة تحكم BullMQ
:

 تحليل Bundle Size
 تحسين Code Splitting الإضافي
 CDN للأصول الثابتة
 Performance Budget في CI/CD
ا
 Server-Sent Events للبث المباشر
 لوحة تحكم مقاييس الأداء
 تحسين أنماط الاستعلامات (Query Patterns)
 Level of Detail (LOD) للجسيمات
 توثيق شامل للأداء.

**أثر C المتوقع:** نظام قابل للتوسع وموثوق.

---

## أسلوب العمل والتسليم

* **الفرع:** `perf/hardening-{YYYYMMDD}`

* **الكوميتات (Conventional Commits):**

  * `feat(ui): migrate DashboardHero to next/image`
  * `chore(fonts): switch to next/font/local and remove external fonts`
  * `perf(images): convert PNG to WebP/AVIF with fallbacks`
  * `perf(particles): mobile density + battery-aware throttling`
  * `feat(cache): add Redis-backed Gemini caching with SWR`
  * `db(index): add composite indexes for hot queries + migration`
  * `perf(bundling): dynamic imports and vendor splitting`
  * `feat(queue): introduce BullMQ workers + dashboard`
  * `feat(obs): enable Sentry Performance + tracing`
  * `chore(cdn): configure CDN headers and asset prefix`

* **اختبارات وقابلية القياس:**

  1. شغّل Lighthouse CI على صفحات الهبوط/الاستوديو قبل/بعد (ميزانية واضحة).
  2. سجّل زمن استجابة `gemini.service` قبل/بعد مع 100 عيّنة.
  3. قياس استعلامات DB الأكثر تكرارًا (explain/analyze) قبل/بعد الترحيل.
  4. تحقّق من عدم وجود تحذيرات Next/Image وغياب طلبات خطوط خارجية.
  5. لقطات شاشة من Sentry تظهر معاملات رئيسية مع تتبّع كامل.

* **معايير القبول الإجمالية (Definition of Done):**

  * LCP تحسّن ≥ 35% على الأقل لصفحة Directors Studio.
  * Mobile Performance Score ↑ ≥ +25 نقطة.
  * زمن استجابة واجهات Gemini ↓ ~70% في المسارات المكررة.
  * TTI ↓ 20–30% في الصفحات المستهدفة.
  * زمن استعلامات قاعدة البيانات ↓ ~40% في التقارير.
  * جميع الاختبارات تمرّ، ولا تحذيرات حرجة في البناء، ولا كسور UI.

* **التسليم:**

  * افتح PR واحد يحوي: رابط تقارير Lighthouse قبل/بعد، جداول المقاييس (API/DB)، لقطات Sentry، ونص خطة التراجع السريع (Rollback) للخطوط/الصور/الكاش إن استلزم الأمر.

---

## ملاحظات تنفيذية سريعة

* استخدم `ENV` موحّدًا لـ Redis: `REDIS_URL`, مع مساحات أسماء للكاش والطوابير.
* التزم بـ `sizes` الصحيحة في `next/image` وبتخطيطٍ يمنع CLS.
* اجعل محوّل الصور (WebP/AVIF) قابلاً للإعادة (idempotent) ولا يمسّ الأصول الأصلية.
* اجعل الكاش “stale-while-revalidate” مع مهلة شبكة محكومة، و”stale-if-error” لاستمرارية الخدمة.
* راعِ التوافق: صفّ بطاريات غير مدعوم → إعدادات افتراضية آمنة.

تم. نفِّذ الآن وفق هذا التسلسل (A ثم B ثم C مع عناصر مستقلة بالتوازي حيث ممكن)، وثق كل خطوة في PR.
