### موجز التنفيذ
القرار الافتراضي والتنفيذ المتبع: المشروع يستخدم Next.js App Router لأن هناك مسار موجود frontend/src/app/(main)؛ لذلك سأنفذ كصفحة App Router بمجلد مستقل frontend/src/app/(main)/actorai-arabic مع كل الملفات الداعمة مطابقة للمعايير الموجودة في بقية اللوحات. سأطبق تطبيع تلقائي لأي اختلاف هيكلي أو نمطي ليتطابق مع النظام الحالي. القائمة التالية هي أمر توجيهي مباشر لوكيل ترميز قابل للتنفيذ آلياً.

---

### افتراضات تشغيلية ثابتة
- بنية المشروع: Next.js App Router تحت frontend/src/app.  
- نمط التسمية: **PascalCase** للمكونات، **kebab-case** لأسماء المجلدات.  
- نظام المكونات المشترك متاح عبر import من أماكن مثل frontend/src/components أو frontend/src/components/ui.  
- ملفات الأنماط والـTokens موجودة مركزياً (مثلاً frontend/src/styles/tokens.tsx أو frontend/src/styles) ويجب إعادة استخدامها.  
- RTL مفعل افتراضيًا في layout المركزي أو theme provider.  
- إدارة الحالة تتبع الأسلوب المستخدم في المشروع (مثال: Zustand/Redux/Context) — إذا لم توجد، استخدم Context أخف وزنا وتوافقية مع بقية الصفحات.  
- أي ملفات من actorai-arabic (المصدر: /home/user/the-copy/actorai-arabic) سيتم تحويلها إلى مكونات وملفات ثابتة داخل المجلد الجديد وتهيئتها لتتوافق مع TypeScript/TSX إن كان المشروع يستخدم TSX.  

---

### قائمة TODO أولوية تنفيذية صالحة للوكيل
1. إعداد المجلد والملفات الأساسية
   - أمر تنفيذ (bash):  
     ```bash
     mkdir -p frontend/src/app/(main)/actorai-arabic
     ```
   - نسخ ملفات المصدر وتحويلها هيكليًا:  
     - مصدر: /home/user/the-copy/actorai-arabic -> هدف: frontend/src/app/(main)/actorai-arabic/static-source
     - أمر:  
       ```bash
       cp -R /home/user/the-copy/actorai-arabic frontend/src/app/(main)/actorai-arabic/static-source
       ```
   - **Time estimate:** 10–20m.  
   - **Acceptance criteria:** مجلد actorai-arabic موجود ويحتوي static-source مع app.js/index.html/style.css المنسوخة.

2. إنشاء صفحة الإدخال الرئيسية بالأسلوب المعتمد
   - ملف: frontend/src/app/(main)/actorai-arabic/page.tsx  
   - محتوى هيكلي (قابل للنسخ): React component احتضاني يعيد استخدام Layout/Containers المشتركة، import للـTokens والـUI components، تصدير default.  
   - مثال موجز قابل للنسخ (عدل حسب أنماط المشروع):  
     ```tsx
     import React from "react";
     import { MainLayout } from "@/app/(main)/layout";
     import { PageContainer } from "@/components/ui/PageContainer";
     import ActorAiArabicFeature from "./components/ActorAiArabicFeature";

     export default function ActoraiArabicPage() {
       return (
         <MainLayout>
           <PageContainer>
             <ActorAiArabicFeature />
           </PageContainer>
         </MainLayout>
       );
     }
     ```
   - **Time estimate:** 20–40m.  
   - **Acceptance criteria:** صفحة page.tsx تعرض بدون أخطاء عند تجميع المشروع، وتظهر في المسار /actorai-arabic في بيئة التطوير.

3. هيكلة المجلدات الداخلية وفق القواعد القياسية
   - إنشِئ المجلدات: components, components/ui, hooks, lib, styles, assets داخل actorai-arabic.  
   - أوامر:  
     ```bash
     mkdir -p frontend/src/app/(main)/actorai-arabic/{components,components/ui,hooks,lib,styles,assets}
     ```
   - **Time estimate:** 10m.  
   - **Acceptance criteria:** بنية المجلدات تطابق الترتيب القياسي ويمكن للوكيل وضع ملفات في أماكنها دون تحذيرات ESLint.

4. تحويل ملفات المشروع القديم إلى مكونات قابلة لإعادة الاستخدام
   - إجراءات:
     - حلل app.js -> قسّم إلى مكونات أصغر PascalCase داخل components/ (مثال: ActorHeader, ActorPlayer, ActorControls).  
     - index.html -> استخرج markup الضروري إلى مكوّن React مع إزالة الهتمل الخام.  
     - style.css -> انسخ القواعد التي لا تتعارض مع tokens، وحوّل القيم الثابتة إلى استخدام الـTokens إن وُجدت. ضع أنماط خاصة في components/*.module.css أو استخدام النظام الموجود (styled-components/Emotion/CSS modules).  
   - مثال ملف مكوّن: frontend/src/app/(main)/actorai-arabic/components/ActorAiArabicFeature.tsx  
   - **Time estimate:** 1.5–3h حسب تعقيد الواجهة الأصلية.  
   - **Acceptance criteria:** كل جزء من الواجهة القديمة موجود كمكوّن React مُستورد في page.tsx، وCSS محوّل لاستخدام Tokens/variables أو module CSS، ولا توجد أنماط متضاربة في dev build.

5. التوافق مع الـTokens والـDesign System
   - إجراءات:
     - استبدل الألوان، المسافات، الظلال بقيم import من frontend/src/styles/tokens أو المسار الفعلي.  
     - ضع أي متغيرات RTL (مثل direction: rtl) في styles أو تأكد أن الـlayout العام يطبق RTL.  
   - **Time estimate:** 30–60m.  
   - **Acceptance criteria:** المظهر يتماشى مع بقية الصفحات (مثلاً الأزرار، الحاشية، الألوان) عند مقارنة مرئية سريعة.

6. إعادة استخدام مكتبة المكونات المشتركة
   - إجراءات:
     - بحث واستبدال أي عناصر UI مكررة بمكونات داخلية مثل Button, Modal, Input, Upload, Inspector.  
     - إن كان هناك مكوّن غير موجود، اكتب Wrapper يطبق واجهة متوافقة ويستخدم المكتبات المحلية.  
   - **Time estimate:** 30–90m.  
   - **Acceptance criteria:** لا تُنشأ مكونات UI محلية مشابهة دون مبرر؛ جميع الأزرار/Inputs تستخدم مكتبة المشروع.

7. إدارة الحالة والبيانات
   - إجراءات:
     - إذا كانت الصفحة تحتاج حالة محلية بسيطة استخدم Context داخل actorai-arabic/hooks/useActorState.tsx، وإلا استدعي store المركزي (Zustand/Redux) بالطريقة المعتمدة.  
     - تنفيذ واجهات Typescript للـprops ونتائج الـAPI إن وُجدت.  
   - **Time estimate:** 30–90m.  
   - **Acceptance criteria:** الحالة قابلة للاختبار محلياً؛ لا تتعارض مع state من صفحات أخرى.

8. الربط مع نظام التنقل الرئيسي
   - إجراءات:
     - تأكد من أن الرابط يظهر في القوائم/Sidebar إن كانت الصفحات الأخرى تُسجِّل روابط في ملف مركزي (مثلاً frontend/src/app/(main)/layout.tsx أو قائمة Nav).  
     - أضف export route metadata إن تطلب Next.js app (مثل generateMetadata) إن كانت الممارسات موجودة.  
   - **Time estimate:** 15–30m.  
   - **Acceptance criteria:** رابط /actorai-arabic ظاهر في Navigation ويؤدي إلى الصفحة دون 404.

9. اختبارات قواعدية وE2E سريعة
   - إجراءات:
     - شغّل lint، typecheck، build محلي:  
       ```bash
       pnpm lint
       pnpm build
       pnpm dev
       ```
     - إن كان موجوداً، أضف اختبار وحدة بسيط للمكوّن الرئيسي أو اختبار Playwright/Cypress للتصفح إلى /actorai-arabic والتأكد من التحميل.  
   - **Time estimate:** 30–60m.  
   - **Acceptance criteria:** Lint وtypecheck خاليان من أخطاء حرجة، build لا يفشل، واختبار E2E يمر.

10. تحسين الأداء والتحميل الكسول
    - إجراءات:
      - إذا كانت الصفحة تحتوي ملفات كبيرة أو سكربتات، طبق dynamic imports وReact.lazy وcode-splitting وفق المعمول.  
      - تحميل الصور بأبعاد مناسبة وuse next/image إن كان مستخدماً.  
    - **Time estimate:** 30–90m.  
    - **Acceptance criteria:** Lighthouse basic audit لا يظهر مشكلات تحميل كبيرة للصفحة مقارنة بصفحات مماثلة.

11. الوثائق والتذليل للدمج
    - إجراءات:
      - أضف README داخل frontend/src/app/(main)/actorai-arabic/ يشرح بنية المجلد، المكونات الأساسية، hooks المستخدمة، وطرق التشغيل والاختبار.  
    - **Time estimate:** 15–30m.  
    - **Acceptance criteria:** README واضح يكفي لمطور آخر ليشغّل الصفحة محلياً.

12. تنظيف ورفع PR
    - إجراءات:
      - إنشاء فرع feature/add-actorai-arabic، تنفيذ التغييرات، تشغيل pre-commit hooks، إضافة وصف PR يشرح ما تم والتغييرات الهيكلية.  
      - Template PR: ما تم، كيفية الاختبار محلياً، نقاط الانتباه (RTL، Tokens)، fallback/rollback.  
    - **Time estimate:** 20–40m.  
    - **Acceptance criteria:** PR نظيف، CI يمر، reviewer واحد على الأقل يمكنه تشغيل الصفحة محلياً.

---

### تعليمات رد الفعل والقبول والرجوع Rollback
- **معايير القبول النهائية**
  - الصفحة تعمل على المسار /actorai-arabic بدون أخطاء في console أو server.  
  - الستايل يطابق Design Tokens والمظهر العام للتطبيق.  
  - Navigation يضم الرابط وتنتقل الصفحة دون 404.  
  - Lint وtypecheck وbuild يمرون بنجاح.  
  - README وPR مرفقان لتسهيل المراجعة.

- **خطة الرجوع السريعة**
  - إن ظهر خطأ حرج بعد الدمج: revert PR عبر git revert أو إعادة فتح فرع rollback.  
  - أوامر سريعة:  
    ```bash
    git checkout main
    git revert <merge-commit-hash>
    git push origin main
    ```
  - لنسخ احتياطية محلية قبل الدمج:  
    ```bash
    git checkout -b backup/actorai-arabic-<date>
    ```
  - **Acceptance for rollback:** المشروع يعود لوضع تشغيل سابق مع أقل تأثير على المستخدمين.

---

### ملاحظات تنفيذية وحالات الحافة المتوقعة
- إن اكتُشف أن المشروع هو SPA وليس Next.js، نفذ بدلا من ذلك: إنشاء src/pages/actorai-arabicPage.tsx وضمّه إلى الراوتر المركزي. (لكن الافتراض هنا هو Next.js بناءً على بنية app.)  
- إن وُجدت مكتبات طرف ثالث في ملفات المصدر القديم تتضارب مع سياسة المشروع، استبدلها بمواصفات محلية أو wrappers.  
- تأكد من عدم إدخال أنماط CSS global تتعارض؛ استخدم CSS modules أو scoped styles.  
- فعل الـRTL إن لم يكن مفعلًا عبر layout العام: أضف dir="rtl" في MainLayout أو body عبر provider.

---