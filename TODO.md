
# قائمة TODO جديدة — «تنفيذ المتبقي» حتى الجاهزية للدمج

> موجّه لوكيل الترميز للتنفيذ الفوري داخل `frontend/`. الهدف: **Build إنتاج ناجح + E2E شاملة + أدلة كاملة + تقرير مُحدّث**.

## 1) إنهاء أخطاء Build الإنتاج (TypeScript Strict)

1. **تطبيع الأنواع في طبقة الذكاء الاصطناعي** (`src/lib/ai/**`):

   * عرّف أنواع الاستجابات (Response DTOs) لكل استدعاء خارجي مع **Zod** للتحقق (parse/refine) بدل `any`.
   * استخدم **discriminated unions** لحالات النجاح/الفشل بدل `boolean`ات فضفاضة.
   * عالج خصائص اختيارية مع `exactOptionalPropertyTypes`:
     اكتب `prop?: T | undefined` وتحقق منها قبل الاستخدام.
   * أزل/صحّح الاستيرادات المكسورة والـ **re-exports** غير الضرورية.

2. **حواجز نوعية حول الأطراف الخارجية**:

   * أنشئ وحدات *Boundary* لمزودي الذكاء الاصطناعي (مثلاً `geminiServiceBoundary.ts`) تُصدر دوالًا **مؤنطَقة Typed**؛ اجعل بقية النظام تتعامل مع **واجهات ثابتة** داخل المشروع.

3. **تشغيل البناء حتى النجاح**:

   ```bash
   pnpm -C frontend build
   ```

   **معيار قبول:** نجاح بلا أخطاء TypeScript أو تحذيرات كاسرة. (التقرير السابق سجّل فشل build) 

---

## 2) إعداد وتشغيل اختبارات E2E (Playwright) مع أدلة

1. **تهيئة Playwright** (إن لم يكن موجودًا بالكامل):

   ```bash
   pnpm -C frontend dlx playwright install
   ```

2. **اختبار تغطية الصفحات الـ 11**:

   * أضف `tests/e2e/pages.spec.ts` لزيارة `/` ثم جميع المسارات المكتشفة من `src/config/pages.manifest.json`.
   * التقط **لقطة شاشة** لكل صفحة إلى:
     `frontend/evidence/<YYYY-MM-DD>/screens/<slug>.png`
   * سجّل **HAR** لكل صفحة إلى:
     `frontend/evidence/<YYYY-MM-DD>/network/<slug>.har`

3. **سيناريوهات وظيفية قصيرة لكل صفحة** (خطوة تحقق دنيا):

   * `editor`: إنشاء/حفظ/إعادة فتح مستند قصير.
   * `analysis`: تشغيل خط الأنابيب حتى محطة 7 على نص قصير (fixture).
   * `development`: استيراد ناتج التحليل وإنشاء بطاقة تطوير.
   * `brainstorm`: توليد 3 أفكار والاحتفاظ بها.
   * `breakdown`: رفع ملف نصّي صغير واستخراج عناصر أولية.
   * `ui`: تفاعل مكوّن أساسي (زر/حوار).
   * `new`: إنشاء مشروع/مساحة جديدة وفق تدفق الصفحة.

**معيار قبول:** نجاح `pnpm -C frontend e2e`، وإنشاء جميع لقطات الشاشة وملفات HAR المطلوبة (كان التقرير السابق يفتقدها). 

---

## 3) تحديث الصفحة الرئيسية + الـ Manifest (تحقق نهائي)

* بما أن الوكيل أفاد بإظهار **11/11 صفحة**، أضف اختبارًا وحداتيًا بسيطًا يحمّل `pages.manifest.json` ويقارن العدّاد بـ 11، ويؤكد وجود الروابط على `/`.
* احفظ ملف `pages-discovered.json` المُولّد ضمن:
  `frontend/evidence/<YYYY-MM-DD>/logs/pages-discovered.json`

**معيار قبول:** `/` تعرض روابط فعّالة لجميع الصفحات، وملف السجلّ محدث. (التقرير السابق أشار إلى 4/11؛ هذا يغلق الفجوة) 

---

## 4) تقرير وأدلة — تسليم رسمي

1. **هيكل الأدلة**:

   ```
   frontend/evidence/<YYYY-MM-DD>/
     logs/
       health.json
       pages-discovered.json
     screens/
       <11 لقطة>
     network/
       <11 ملف HAR>
   ```
2. **تقرير مُحدّث**:
   أنشئ/حدّث `frontend/RUN_REPORT_<YYYY-MM-DD>.md` يتضمن:

   * حالة Health + رابط سجلّاته.
   * جدول الصفحات (11/11 ✅) مع روابط اللقطات/ملفات HAR.
   * نتيجة `pnpm build` (✅).
   * نتائج E2E والسيناريوهات المنفّذة.
   * «قرار الدمج»: **جاهز** بلا تحفظات.

**معيار قبول:** وجود اللقطات وHAR في المسارات المذكورة (التقرير السابق ذكر غيابها). 

---

## 5) دمج وتشغيل حواجز CI

* أضِف/ثبّت سكربتات `package.json` (إن لزم):

  ```json
  {
    "scripts": {
      "lint": "next lint",
      "typecheck": "tsc -p tsconfig.json --noEmit",
      "test": "vitest run",
      "e2e": "playwright test",
      "build": "next build",
      "ci": "pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm e2e"
    }
  }
  ```
* اربط pre-push (Husky) بـ `lint && typecheck && test && build`.

**معيار قبول:** فشل الـ push عند أي كسر لنوعية الكود أو البناء.

---

## 6) تسليم فرعي وقرار دمج

1. **تسليم:**

   ```bash
   git add -A
   git commit -m "feat(frontend): fix strict TS in ai layer, add E2E with screenshots+HAR, update RUN_REPORT and evidence"
   git push
   ```
2. **قرار الدمج** داخل PR:

   * Build: ✅
   * Pages @ Home: ✅ 11/11
   * E2E + أدلة: ✅
   * **القرار**: جاهز للدمج إلى `main`.

---

### ملاحظتان أخيرتان

* إن ظهرت تبعيات مذكورة في التقرير السابق (مثل `sonner`, `framer-motion`, `@tanstack/react-query`) فتثبيتها/إزالتها يجب أن تُحسَم بالنظر إلى **الاستخدام الفعلي** فقط، لتقليل سطح التعقيد. 
* تأكد أن هذا الفرع موجود وحالي على GitHub قبل فتح PR النهائي. ([GitHub][1])

**نفّذ القائمة أعلاه الآن.**

[1]: https://github.com/mohamedaminradyofficial/the-copy/tree/claude/complete-todo-items-011CUjh8vMgxjNXNnT1Ehdm8 "GitHub - mohamedaminradyofficial/the-copy at claude/complete-todo-items-011CUjh8vMgxjNXNnT1Ehdm8"
