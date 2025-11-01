### Migration and Integration TODOs for agent execution

مهمة الوكيل: دمج تطبيق actorai-arabic/cineai-app كـ sub-app مستقل تحت المسار الموحد frontend/src/app/(main)/cinematography-studio/actorai-arabic بحيث يتوافق تماماً مع بنية، أنماط، روتين، و Tokens المشروع القائم. كل خطوة صالحة للتنفيذ الآلي ويجب أن تكون قابلة للاختبار والتراجع.

---

### 1. التحضير والنسخ الأولي
1. استنساخ الشجرة المصدرية للتطبيق الجديد إلى مكان مؤقت داخل repo الهدف  
   - أمر قابل للتنفيذ: cp -a actorai-arabic/cineai-app frontend/src/app/(main)/cinematography-studio/actorai-arabic_tmp  
   - تقدير الزمن: 5-10 دقائق.  
   - معيار القبول: وجود مجلد actorai-arabic_tmp مع نفس الملفات والمراجع.  
   - تعليمات تراجع: rm -rf frontend/src/app/(main)/cinematography-studio/actorai-arabic_tmp.

2. قراءة بنية المشروع الهدف والقواعد القياسية لاستخراج قوالب المسارات، الأسماء، Tokens، والمكتبات المشتركة  
   - تنفيذ: parse أو اظهار قائمة الملفات من frontend/src/app/(main) + تحميل ملف layout.tsx وملفات صفحة كل sub-app.  
   - زمن: 5 دقائق.  
   - قبول: توليد ملف JSON بسيط يصف البنية القياسية (folders, naming conventions, router style, shared components).  
   - تراجع: حذف الملف الناتج.

---

### 2. تحديد نوع الراوتر وتخطيط المسارات
1. كشف روتين المشروع الحالي Next App Router أو SPA Router  
   - تنفيذ: فحص وجود files مثل frontend/src/app/layout.tsx و presence of page.tsx => Next App Router  
   - زمن: 2 دقائق.  
   - قبول: متغير ENV_ROUTER = "next" أو "spa".  
   - تراجع: لا حاجة.

2. إنشاء خريطة مسارات هدفية ل actorai-arabic وفق الأسلوب المكتشف  
   - إذا Next: path => frontend/src/app/(main)/actorai-arabic/page.tsx وملفات فرعية داخل actorai-arabic/ (components, lib, styles)  
   - إذا SPA: إنشاء src/pages/actorai-arabicPage.tsx وربط في router central.  
   - زمن: 5 دقائق.

---

### 3. تحويل البنية والأسماء والتنظيم
1. تطبيع شجرة المجلدات لتتبع النمط القياسي  
   - مطلوب أن يصبح الشكل: frontend/src/app/(main)/actorai-arabic/page.tsx  
     frontend/src/app/(main)/actorai-arabic/components  
     frontend/src/app/(main)/actorai-arabic/ui  
     frontend/src/app/(main)/actorai-arabic/hooks  
     frontend/src/app/(main)/actorai-arabic/lib  
   - أوامر نسخ/نقل قابلة للتنفيذ مع إعادة تسمية ملفات إذا لزم الأمر.  
   - زمن: 10-30 دقيقة حسب حجم.  
   - قبول: كل ملف موجود في المسار القياسي، أسماء المجلدات تتبع kebab-case، مكونات React بأسماء PascalCase.  
   - تراجع: استعادة من actorai-arabic_tmp أو git checkout للملفات المتأثرة.

2. إعادة تسمية المكونات والملفات تلقائياً إن خالفت القواعد  
   - تنفيذ: سكربت Node/TS يبحث عن export default function|const <oldName> ويعيد تسمية الملف والأماكن المرجعية إلى PascalCase.  
   - زمن: 20-40 دقيقة.  
   - قبول: lint passes naming rules; no unresolved imports.  
   - تراجع: استرجاع من النسخة المؤقتة أو git.

---

### 4. توحيد الـ Styling والTokens وRTL
1. استبدال أو ربط theme و tokens بمكتبة المشروع المشتركة  
   - تنفيذ: استبدال import local tokens => import { tokens } from 'src/styles/tokens' أو المسار المعتمد.  
   - زمن: 15-30 دقيقة.  
   - قبول: components تستخدم tokens بدلاً من قيم صلبة؛ CSS vars أو tailwind tokens متطابقة.  
   - تراجع: إعادة استيراد القديم من النسخة المؤقتة.

2. تمكين RTL افتراضياً وضمان دعم اتجاه النص  
   - تنفيذ: إضافة dir="rtl" في top-level page wrapper أو استخدام project's RTL provider.  
   - زمن: 10 دقائق.  
   - قبول: صفحات actorai-arabic تعرض بشكل RTL كما بقية التطبيق؛ اختبار يدوي على صفحة رئيسية.  
   - تراجع: إزالة التعديل.

3. تبديل أي ملفات CSS/SCSS لاتباع نظام المشروع (CSS Modules, Tailwind, Styled Components)  
   - تنفيذ: تحويل classNames أو استبدال استيرادات .css إلى النظام القياسي.  
   - زمن: 30-90 دقيقة حسب التعقيد.  
   - قبول: build لا يخطئ في CSS و الانطباق البصري متناسق مع باقي الواجهات.  
   - تراجع: إعادة الملفات الأصلية من النسخة المؤقتة.

---

### 5. إعادة استخدام المكونات المشتركة وإدارة الحالة
1. استبدال المكونات المحلية بمكالمات للمكتبة المشتركة إن وجدت  
   - تنفيذ: بحث واستبدال imports لمكونات شبيهة (Palette, Export, Upload, Inspector) إلى المسار المركزي project-ui.  
   - زمن: 20-60 دقيقة.  
   - قبول: لا توجد مكونات مزدوجة تقوم بنفس الوظيفة؛ تستورد actorai من project-ui وتعمل كما متوقع.  
   - تراجع: إعادة استيراد للمكونات الأصلية مؤقتاً.

2. توحيد إدارة الحالة مع نظام المشروع (zustand, redux, recoil وغيرها)  
   - تنفيذ: إن كان التطبيق يستخدم store مركزي، إحلال أي state محلي مع selectors/actions المشتركة أو تغليف داخلي للتوافق.  
   - زمن: 30-120 دقيقة.  
   - قبول: حالات الملاحة، جلسات المستخدم، tokens مشتركة متاحة عبر store؛ لا يستخدم actorai state مستقل لا مبرر له.  
   - تراجع: إعادة الحالة المحلية أو فصلها مؤقتاً في branch.

---

### 6. الروتينغ والروتر والربط بالملاحة الرئيسية
1. إدراج صفحة التسجيل في navigation tree أو sidebar linker  
   - تنفيذ: إضافة ملف route entry في مكان تعريف الروابط، label، icon إذا مطلوب.  
   - زمن: 10 دقائق.  
   - قبول: رابط /actorai-arabic يظهر في القوائم ويؤدي إلى frontend/src/app/(main)/actorai-arabic/page.tsx.  
   - تراجع: إزالة الإدخال.

2. ضمان حماية المسارات وحقوق الوصول متطابقة مع بقية التطبيقات  
   - تنفيذ: إرفاق middleware أو HOC للحماية إذا كان موجوداً.  
   - زمن: 15-30 دقيقة.  
   - قبول: الوصول للمسار يتبع سياسات auth الحالية.  
   - تراجع: إزالة middleware المضافة.

---

### 7. التوافق مع TypeScript و ESLint و Prettier والاختبارات
1. مزامنة tsconfig و lint rules مع الجذر  
   - تنفيذ: دمج أو تحديث extends في tsconfig.json و .eslintrc بحيث يستخدم قواعد المشروع.  
   - زمن: 10-20 دقيقة.  
   - قبول: tsc --noEmit ينجح على actorai subtree؛ eslint لا يعطي أخطاء جديدة بخلاف القواعد القائمة.  
   - تراجع: استرجاع tsconfig من النسخة المؤقتة.

2. إضافة/تحديث اختبارات وحدية وواجهات end-to-end بنمط المشروع  
   - تنفيذ: إنشاء أمثلة اختبارية لـ page load و key components وفق إطار المشروع (Jest/RTL أو Playwright).  
   - زمن: 60-180 دقيقة.  
   - قبول: اختبارات وحدية أساسية تمر في CI.  
   - تراجع: إزالة الاختبارات أو فصلها عن CI مؤقتاً.

---

### 8. البنية الخادمية والتكامل مع server side
1. دمج endpoints server الموجود في cineai-app/server إلى بنية API للمشروع  
   - تنفيذ: ترجمة ملفات server/src إلى المسار المتوقع مثل frontend/src/app/api/actorai-arabic/route.ts أو نقل إلى backend monorepo حسب المعمول.  
   - زمن: 30-120 دقيقة.  
   - قبول: نفس الواجهات (URLs, payload) أو توثيق جديد متوافق؛ integration tests تمر.  
   - تراجع: إعادة endpoints إلى النسخة المؤقتة أو إيقاف التعريفات الجديدة.

2. مراجعة الأذونات وسرية المتغيرات البيئية وربطها بـ secrets manager  
   - تنفيذ: تحديث استخدام ENV_NAMES لتتطابق مع مشروع، إضافة إلى .env.example.  
   - زمن: 15-30 دقيقة.  
   - قبول: لا وجود لأي قِيَم حساسة مضمّنة في الكود؛ env keys موثقة.  
   - تراجع: إعادة المتغيرات إلى السابقة.

---

### 9. البناء والاختبار الشامل وCI
1. تعديل سكربتات package.json إن لزم لإدماج البناء في CI  
   - تنفيذ: إضافة build:actorai و test:actorai أو دمج ضمن existing build pipeline.  
   - زمن: 10-20 دقيقة.  
   - قبول: npm run build:actorai ينجح محلياً.  
   - تراجع: استرجاع package.json.

2. تشغيل full build و E2E smoke tests في بيئة CI staging  
   - تنفيذ: تشغيل pipeline محلياً أو عبر runner.  
   - زمن: 30-90 دقيقة.  
   - قبول: كل خطوات pipeline المتعلقة بالـ actorai تمر؛ صفحة actorai تصلح للنشر.  
   - تراجع: revert commit branch أو تعطيل خطوة CI.

---

### 10. مراجعة الكود وPR وقائمة التحقق قبل الدمج
1. إنشاء فرع feature/actorai-integration وفتح PR مع checklist آلية  
   - Checklist items to enforce: renamed files OK; lints pass; tsc pass; unit tests pass; visual smoke test; RTL confirmed; shared tokens used; routes added; server endpoints integrated.  
   - زمن: 10 دقائق لإعداد الشابلون.  
   - قبول: PR يحتوي على كل المعايير مفحوصة وموافق عليها من صاحب المراجعة.  
   - تراجع: إغلاق PR و revert branch.

2. تعليمات التحقق اليدوي للـ QA  
   - خطوات: فتح الصفحة، فحص RTL، تحميل مكون Upload، تجربة Export، فحص console errors، اختبار navigation.  
   - زمن: 30-60 دقيقة.  
   - قبول: QA sign-off في PR.

---

### 11. النشر والمراقبة والرجوع
1. نشر إلى staging ثم production بعد موافقة QA  
   - تنفيذ: إطلاق نسخة staging ثم مراقبة health checks و Sentry/monitoring logs.  
   - زمن: 30-60 دقيقة للنشر والتحقق.  
   - قبول: لا أخطاء حيوية خلال 30 دقيقة في staging وبيانات الاستخدام سليمة.  
   - تراجع: استخدام documented rollback script لإعادة النسخة السابقة من deployment أو إعادة توجيه route إلى القديم.

2. مراقبة الأدلة والقياسات لمدة 48 ساعة  
   - مؤشرات: error rate, latency, front-end bundle size, rendering issues on RTL locales.  
   - قبول: مؤشرات ضمن حدود SLA المحددة.  
   - تراجع: تفعيل hotfix branch بناءً على السبب.

---

### مقتطفات أوامر وملفات مفيدة جاهزة للنسخ
- إنشاء مجلد الهدف ونقل الشجرية  
  - cp -a actorai-arabic/cineai-app frontend/src/app/(main)/cinematography-studio/actorai-arabic_tmp

- إعادة تسمية ذكية للملفات (مثال Node script placeholder)  
  - node scripts/normalize-names.mjs --src=actorai-arabic_tmp --pattern=PascalCase

- دمج tokens و CSS  
  - sed -i 's|./local-tokens|src/styles/tokens|g' $(grep -rl "./local-tokens" actorai-arabic_tmp)

- تشغيل TypeScript و ESLint للتحقق  
  - pnpm -w tsc --noEmit --project frontend/tsconfig.json  
  - pnpm -w eslint frontend/src/app/(main)/actorai-arabic --fix

---

### قواعد تكميلية لإجبار الوكيل على الاتساق
- لا تُدخل مكتبات جديدة بدون ملف RFC و approval.  
- أي تغيير في API يجب أن يصاحبه ملف OpenAPI صغير أو doc/api/actorai-arabic.md.  
- كل تعديل بصري يحتاج snapshot test أو visual diff proof.  
- كل خطوة كبيرة (rename > 5 ملفات، تعديل state root) تفتح branch مستقل وتطلب مراجعة يدوية.

---
