### ملخص التوجيه التنفيذي

قائمة TODO
 و لوكيل ترميز تقوم بترحيل، تطبيع، ودمج التطبيق الموجود "Arabic Creative Writing Studio" كمجلد تطبيق مستقل ضمن المشروع الرئيسي مع ضمان التوافق الكامل مع أنماط، بنية، وآليات العمل السائدة في الكودبייס.

---

### 1. فحص تلقائي وتحديد طبقة المشروع والروتينغ

- كشف نوع المشروع تلقائياً: Next.js App Router أم SPA مع React Router.
- جمع قواعد المشروع الأساسية: مسارات src، بنية المجلدات components/ui/hooks/lib، نظام الـTokens، ملف theme أو design tokens.
- قراءة صفحات/مكونات مرجعية لاستخلاص:
  - نمط تصدير المكونات (default vs named).
  - نمط أسماء الملفات والمجلدات.
  - نمط إدارة الحالة (Redux / Context / Zustand / Recoil).
  - نظام CSS (CSS Modules / Tailwind / Emotion / styled-components).
  - آليات RTL وتفعيلها.

---

### 2. إنشاء شجرة المجلدات القياسية والنسخ المبدئي للملفات

- إنشاء مجلد الهدف القياسي:
  - إن كان Next.js App Router:
    - frontend/src/app/(main)/Arabic Creative Writing Studio/
      - page.tsx
      - layout.tsx إن لزم
      - components/
      - hooks/
      - lib/
      - styles/
  - إن كان SPA/React Router:
    - src/pages/Arabic-Creative-Writing-StudioPage.tsx أو src/pages/arabic-creative-writing-studio.tsx بحسب نمط الاسم في المشروع
    - src/routes/ أو src/app/ArabicCreativeWritingStudio/
- نقل الملفات الأصلية داخل المجلد:
  - CreativeWritingStudio.tsx → components/ أو page.tsx حسب الحاجة
  - PromptLibrary.tsx, WritingEditor.tsx, SettingsPanel.tsx → components/
  - dataManager.ts, geminiService.ts → lib/ أو services/
  - types.ts → types/
  - package.json، tsconfig.json → فحص وتحويل الحقول المطلوبة ودمج الإعدادات في المشروع الرئيسي بدلاً من ملف منفصل
- إعادة تسمية الملفات لتتوافق مع PascalCase للمكونات و kebab-case للمجلدات.

---

### 3. تطبيع الكود ليتوافق مع الأنماط المعمول بها

- استبدال/تحويل أنماط الستايل إلى النظام المرجعي (Tokens, Theme):
  - تحويل الألوان والهوامش والظلال لاستخدام Tokens المركزية.
  - تفعيل RTL على مستوى المكون أو الصفحة عبر سياق Theme أو className موحد.
- تطبيع استيراد المكونات المشتركة ليستخدم المكتبة الداخلية (مثال: Palette, Export, Upload, Inspector).
- توحيد hooks وstate:
  - إذا كان المشروع يستخدم Zustand/Context/Redux، حوّل أي state محلي إلى النمط نفسه أو لفّ الوظائف لتعتمد على الـstore المشترك.
- ضبط نمط التصدير والاستيراد ليطابق البقية (ESM vs CommonJS) والتأكد من استخدام المسارات المطلقة إن كانت متبعة.

---

### 4. دمج الراوت والربط في النظام الرئيسي

- إن كان Next.js App Router:
  - تأكد من وجود page.tsx ضمن المسار المحدد وأن export default Page مضبوط.
  - أضف الروابط إلى القوائم/Navigation المشتركة باستخدام نفس آلية المشروع (links, navigation config).
- إن كان SPA/React Router:
  - أضف استيراد المسار في ملف الراوتر الرئيسي Router.tsx أو App.tsx:
    - <Route path="/Arabic Creative Writing Studio" element={<ArabicCreativeWritingStudioPage/>} />
  - إن كان هناك ملف routing config مركزي، أدرج الإدخال مع metadata (title, permissions, icon).
- إضافة تسجيل Telemetry أو analytics إن كان مطلوباً حسب معيار المشروع.

---

### 5. اختبارات، تغطية، وCI

- كتابة اختبارات وحدة أساسية لـ:
  - Rendering الأساسي للصفحة والمكونات الحرجة (CreativeWritingStudio, WritingEditor).
  - تفاعلات رئيسية في WritingEditor وPromptLibrary.
- تهيئة اختبارات E2E إن وُجدت بنفس إطار العمل المستخدم (Cypress/Playwright).
- تحديث تكوين CI لإضافة مجلد التطبيق للمراحل التالية:
  - lint
  - build
  - test (مع التزام نسبة التغطية المطلوبة، مثال 95% إذا المشروع يفرض)
- إضافة hooks محلية أو git hooks حالياً قائمة في الكودبייס (husky) إذا مطلوب.

---

### 6. إدارة الحزم والاعتمادات

- دمج أي تبعيات محلية من package.json الخاص بالمجلد داخل package.json الرئيسي، مع:
  - فحص التعارضات في الإصدارات.
  - التثبيت باستخدام pnpm أو مدير الحزم المستخدم.
- إزالة package.json مستقل ما لم يكن هناك سبب لوجوده كـworkspace package — في حال workspace مطلوب، تأكد من إعداد workspace صحيح في root pnpm-workspace.yaml.

---

### 7. RTL ولوكالايزيشن

- تفعيل RTL افتراضياً على مستوى الصفحة:
  - إضافة attribute dir="rtl" أو استخدام provider للـTheme الذي يعيد تهيئة الـdirection.
- التأكد من أن كل نصوص ثابتة تستخدم آلية الترجمة المشتركة (i18n) إن وُجدت.
- اختبار واجهة المستخدم مع RTL والتأكد من انعكاس العناصر والهوامش والـicons.

---

### 8. قواعد التحقق النهائي ومعايير القبول

- البناء ينجح دون أخطاء ضمن بيئة CI للمشروع.
- جميع التحويلات تتبع بنية وأسماء المشروع القياسية.
- الصفحات قابلة للوصول عبر المسار /Arabic Creative Writing Studio وتظهر في الـNavigation إن كانت القواعد تتطلب ذلك.
- استخدام مكتبة المكونات المشتركة بدلاً من عناصر CSS مخصصة حيثما أمكن.
- RTL مفعل افتراضياً والواجهة تختبر صحياً على اتجاه متناظر.
- اختبارات وحدات وE2E تم إضافتها وتعمل مع نسبة تغطية لا تقل عن المطلوب في الكودبייס.
- لا توجد ملفات package.json أو tsconfig.json متضاربة في المجلد الفرعي ما لم يصبح تطبيق مستقل كمونو-ريبو مقصود.

---

### 9. أوامر تنفيذ سريعة وملاحظات Git

- أوامر مقترحة لوكيل الترميز عند التنفيذ:
  - git checkout -b feat/ar-creative-writing-studio
  - إنشاء المجلدات ونقل الملفات مع إعادة التسمية حسب القواعد
  - تعديل الاستيرادات ومسارات الرموز
  - pnpm install أو npm install حسب المشروع
  - pnpm build && pnpm test
  - git add . && git commit -m "chore: integrate Arabic Creative Writing Studio into app structure"
  - فتح PR مع وصف يوضح عمليات التطبيع والتحويل والتوافق مع المعايير
- إضافة في PR checklist:
  - قائمة التغييرات البنيوية
  - نقاط الاختبار المنفذة (unit/e2e)
  - تعليمات محلية لتشغيل الصفحة

---

### 10. مخرجات قابلة للتسليم لوكيل الترميز

- فرع Git جديد يحتوي كل التغييرات.
- PR مع وصف التغييرات وقائمة قبول مفصلة.
- ملف README مختصر داخل Arabic Creative Writing Studio يشرح موقع الملفات، الاعتمادات، وكيفية التشغيل محلياً.
- قائمة الاختبارات المنفذة ونتائج CI الخضراء.

---

إذا أردت، أترجم هذه القوائم إلى أمر توجيهي واحد قابل للنسخ واللصق للوكيل بصيغة نصية موحّدة مع خطوات تنفيذية مرتبة وبدون شرح إضافي. تقول أم أولدها مباشرة الآن؟