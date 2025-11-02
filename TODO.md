# أمر توجيهي حاسم لوكيل الترميز — تنفيذ «المتبقّي» من تقرير التشغيل الآن

> نفّذ البنود المتبقية الموضّحة في تقرير التشغيل المرفق ثم قدِّم أدلة تنفيذية محدثة. (المرجع: تقرير

frontend/RUN_REPORT_2025-11-02.md

## [الدور]

أنت مسؤول عن: إظهار **كل الصفحات** على الصفحة الرئيسية، إصلاح **أخطاء إنتاج** (Production build)، إضافة **اختبارات تفاعلية + لقطات شاشة**، وتحديث التقرير بالأدلة.

## [نطاق التنفيذ]

* الجذع: `frontend/`
* المنافذ/المسارات الحرجة: جميع صفحات `(main)` بما فيها:

  * `editor`, `analysis`, `development`, `brainstorm`, `breakdown`, `new`, `ui`,
  * `actorai-arabic`, `arabic-creative-writing-studio`, `arabic-prompt-engineering-studio`, `cinematography-studio`, `directors-studio`.
* مخرجات إلزامية:

  1. نجاح `pnpm build` بلا أخطاء.
  2. الصفحة الرئيسية تعرض **كل 11 صفحة** كرابط فعّال.
  3. Playwright E2E تُثبت فتح كل صفحة + حفظ لقطات شاشة.
  4. تحديث مجلد الأدلة والتقرير النهائي.

---

## [خطة التنفيذ الفورية — خطوات مرتّبة]

### 1) تحديث الصفحة الرئيسية لإظهار جميع الصفحات

1. أنشئ «مانيفست» للصفحات تلقائيًا:

   * سكربت Node: `scripts/generate-pages-manifest.ts` يقوم بمسح `src/app/(main)/*/page.tsx`، ويبني ملف `src/config/pages.manifest.json` يحوي `{ slug, path, title }` لكل صفحة.
   * أضِف سكربت إلى `package.json`:

     ```json
     { "scripts": { "prebuild": "ts-node --transpile-only scripts/generate-pages-manifest.ts" } }
     ```
2. عدّل `src/app/page.tsx` (Server Component) لقراءة `pages.manifest.json` وعرض **بطاقات/روابط** لكل عنصر.
3. **معيار قبول:** عند زيارة `/` تظهر الروابط الفعّالة لكل الصفحات الـ 11.

### 2) إصلاح أخطاء Production Build (لا تخفّف TypeScript)

1. **الاستيرادات/التبعيات:**

   * ثبّت/عدّل:

     ```bash
     pnpm -C frontend add sonner @tanstack/react-query drizzle-orm drizzle-zod framer-motion
     ```
   * صحّح كل استيراد خاطئ من `motion/react` إلى `framer-motion`.
   * ثبّت مسارات alias في `tsconfig.json` (`@/*`, `@/components/ui/*` → `src/...`)، وعدّل أي استيراد نسبي مكسور.
2. **exactOptionalPropertyTypes:** أصلِح الأنواع بدل تعديل `tsconfig`:

   * كل prop/حقل اختياري يجب أن يُعرّف `prop?: T | undefined` ويُفحص قبل الاستخدام.
3. **directors-studio & ui/components:**

   * أزل أي استيراد غير مستخدم يكسِر البناء.
   * إن كان `react-query` مطلوبًا: أنشئ `src/components/providers/query-provider.tsx` (Client) ولفِّ صفحات الاستوديو التي تستخدمه به فقط (لا تضعه في `layout` العام إن لم يكن ضروريًا).
4. شغّل البناء:

   ```bash
   pnpm -C frontend build
   ```

   **معيار قبول:** نجاح البناء دون أخطاء.

### 3) اختبارات E2E + لقطات شاشة لكل صفحة

1. أضِف Playwright (إن لم يكن مضافًا) وأعد تهيئته لتسجيل HAR ولقطات:

   ```bash
   pnpm -C frontend dlx playwright install
   ```
2. أنشئ ملف `frontend/tests/e2e/pages.spec.ts`:

   * افتح `/` وتحقّق من وجود 11 رابطًا.
   * زر كل مسار من القائمة أعلاه.
   * التقط لقطة شاشة لكل صفحة إلى:
     `frontend/evidence/<DATE>/screens/<slug>.png`
   * سجّل HAR:
     `frontend/evidence/<DATE>/network/<slug>.har`
3. شغّل الخادم محليًا (إن لزم على 5000 كما في التقرير) ثم:

   ```bash
   pnpm -C frontend dev --port 5000 &
   pnpm -C frontend e2e
   ```
4. **معيار قبول:** جميع الصفحات تُفتح بنجاح وتُحفظ لقطات شاشة وملفات HAR.

### 4) تحديث الأدلة والتقرير

1. أكمل بنية الأدلة:

   ```
   frontend/evidence/<YYYY-MM-DD>/
     logs/health.json
     logs/pages-discovered.json
     screens/*.png
     network/*.har
   ```
2. أنشئ/حدّث:
   `frontend/RUN_REPORT_<YYYY-MM-DD>.md`

   * حدّث الجداول: كل صفحة = ✅ مع روابط الأدلة (screens/*, network/*).
   * أدرج ملخص البناء: نجاح `pnpm build`.
   * أدرج ملاحظات مختصرة حول أي تعديلات أنماط/أنواع.

---

## [تعريف الاكتمال (DoD)]

* ✅ الصفحة الرئيسية تعرض **كل الصفحات الـ 11** كرابط فعّال.
* ✅ `pnpm build` ينجح دون أخطاء.
* ✅ Playwright يمرّ على كل صفحة ويولّد لقطات شاشة وHAR.
* ✅ `RUN_REPORT_<DATE>.md` محدّث ويحتوي أدلة لكل صفحة.
* ✅ لا تغييرات على صرامة TypeScript؛ تم إصلاح الأنواع بدل تخفيف القواعد.

---

## [تسليم ودمج]

1. ادفع التعديلات على نفس الفرع الحالي:

   ```bash
   git add -A
   git commit -m "feat(frontend): expose all pages on Home, fix prod build, add E2E screenshots & HAR, update RUN_REPORT"
   git push
   ```
2. علّق في الـ PR بملخص:

   * عدد الصفحات المعروضة: 11/11
   * نجاح البناء: ✅
   * موقع الأدلة: `frontend/evidence/<DATE>/`
   * رابط التقرير المحدّث.

**نفّذ الآن.**
