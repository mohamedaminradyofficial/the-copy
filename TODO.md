# TODO.md — خطة تصحيح بنية Next.js للوصول إلى الامتثال الكامل لأفضل الممارسات

> ملف موجّه لوكيل ترميز Next.js للتنفيذ الفوري في مجلد `frontend/`.
> الهدف: جعل البنية تقول بثقة: **"The current structure is CORRECT and follows Next.js best practices!"**

---

## 0) التحضير والتنفيذ الآمن

* [ ] إنشاء فرع عمل:

  ```bash
  cd frontend
  git checkout -b chore/next-structure-hardening
  pnpm install
  ```
* [ ] خط أساس سريع:

  ```bash
  pnpm lint || true
  pnpm typecheck || true   # لو موجود سكريبت typecheck
  pnpm test -w || true
  pnpm build || true
  ```

---

## 1) تقليل مكوّنات العميل وتحويل الصفحات إلى Server Components

* [ ] حصر الصفحات التي تستخدم `"use client"`:

  ```bash
  rg -n --hidden --glob "src/app/**/page.tsx" --glob "src/app/**/*.tsx" '["'\'']use client["'\'']' || true
  ```
* [ ] لكل صفحة غير تفاعلية (لا تستخدم `useState/useEffect/useRef/useRouter` أو DOM):

  * [ ] إزالة `"use client"` وجعلها Server Component.
* [ ] عند الحاجة الحقيقيّة إلى عميل:

  * [ ] إبقاء `page.tsx` Server، واستخراج منطق التفاعل إلى مكوّن عميل ملفوف مثل:

    ```
    src/components/features/<feature>/ClientWidget.tsx  // 'use client'
    ```
  * [ ] تمرير بيانات الخادم كمُدخلات للمكوّن العميل.
* [ ] **معيار قبول:** لا تبقى أي صفحة عليا كـ Client إلا لضرورة واضحة (تعامل مباشر مع DOM/Events كثيفة).

---

## 2) إضافة معالج أخطاء قياسي `app/error.tsx`

* [ ] إنشاء الملف:

  ```
  src/app/error.tsx
  ```

  بالمحتوى التالي (قابل للتشغيل فورًا):

  ```tsx
  'use client'
  import { useEffect } from 'react'

  export default function Error({
    error,
    reset,
  }: {
    error: Error & { digest?: string }
    reset: () => void
  }) {
    useEffect(() => {
      // أرسل إلى Sentry إن كان معدًّا، أو على الأقل سجّل للكونسول
      console.error(error)
    }, [error])

    return (
      <main className="mx-auto max-w-xl p-6">
        <h2 className="mb-3 text-xl font-semibold">حدث خطأ غير متوقع</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          حاول إعادة المحاولة. إن استمر الخطأ، راجع السجلات.
        </p>
        <button
          onClick={reset}
          className="rounded-lg border px-4 py-2 hover:bg-accent"
        >
          إعادة المحاولة
        </button>
      </main>
    )
  }
  ```
* [ ] **معيار قبول:** ظهور هذا العرض عند رمي استثناء داخل أي صفحة/مكوّن خادم.

---

## 3) نقل Server Actions إلى مسار موحّد `src/lib/actions/*`

* [ ] تحديد جميع الأفعال المعلّمة بـ`'use server'`:

  ```bash
  rg -n --glob "src/**/*.ts" --glob "src/**/*.tsx" "['\"]use server['\"]" || true
  ```
* [ ] إنشاء هيكل:

  ```
  src/lib/actions/
    analysis.ts
    projects.ts
    users.ts
  ```
* [ ] نقل كل دالة فعل إلى الملف الأنسب وظيفيًّا (مع الحفاظ على التوقيعات)، وأبقِ الصفحات تستورد من `src/lib/actions/*`.
* [ ] تحديث جميع الاستيرادات.
* [ ] **معيار قبول:** لا توجد Server Actions داخل `src/app/**` عدا حالات صغيرة جدًا وضرورية.

---

## 4) فرض التصدير الاسمي ومنع `default export` خارج الصفحات

* [ ] تثبيت الإضافة:

  ```bash
  pnpm add -D eslint-plugin-import
  ```
* [ ] تحديث `eslint` (مثال `eslint.config.js` أو `.eslintrc.*`) لإضافة قاعدة منع `default export` في المكوّنات، مع استثناء صفحات/تخطيطات App Router:

  ```js
  // مثال لملف eslint.config.js
  import pluginImport from 'eslint-plugin-import'

  export default [
    // إعدادات Next/TS الحالية...
    {
      plugins: { import: pluginImport },
      rules: {},
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      ignores: [],
    },
    // منع default خارج صفحات App Router
    {
      plugins: { import: pluginImport },
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      rules: {
        'import/no-default-export': 'error',
      },
      ignores: [
        'src/app/**/page.tsx',
        'src/app/**/layout.tsx',
        'src/app/**/error.tsx',
        'src/app/**/loading.tsx',
        'src/app/**/not-found.tsx',
      ],
    },
  ]
  ```
* [ ] تشغيل إصلاح تلقائي ثم معالجة الباقي يدويًّا:

  ```bash
  pnpm lint --fix || true
  rg -n "export default" src | grep -v "src/app/" || true
  ```
* [ ] **معيار قبول:** لا توجد `export default` في أي مكوّن/وحدة خارج مسارات App Router المعفاة أعلاه.

---

## 5) إضافة ملف بيئة نموذجي `.env.example`

* [ ] إنشاء الملف في `frontend/.env.example` يتضمن **كل** المفاتيح المستخدمة في التهيئة/الشفرة (استنادًا إلى تحقق Zod لديك). مثال مبدئي:

  ```
  # Runtime
  NODE_ENV=development
  NEXT_PUBLIC_APP_ENV=local

  # Observability / Sentry
  SENTRY_DSN=
  SENTRY_ORG=
  SENTRY_PROJECT=
  SENTRY_AUTH_TOKEN=

  # AI Keys
  GEMINI_API_KEY_STAGING=
  GEMINI_API_KEY_PROD=

  # أي مفاتيح أخرى مذكورة في src/env.ts
  ```
* [ ] **معيار قبول:** تشغيل المشروع بعد نسخ `.env.example` إلى `.env.local` دون أخطاء مفقودات بيئة.

---

## 6) تنظيم المجلدات وفق المرجع المعماري المقترح

* [ ] إنشاء المسارات (إن لم تكن موجودة) ونقل الملفات وفق الوظيفة:

  ```
  src/components/features/      # مكوّنات مرتبطة بميزات
  src/components/layouts/       # هياكل تخطيطية
  src/config/                   # ثوابت/إعدادات على مستوى التطبيق
  src/types/                    # أنواع مشتركة (إن كبرت عن lib/types)
  ```
* [ ] تعديل الاستيرادات، وتحديث `tsconfig.json` لمسارات `paths` عند الحاجة.
* [ ] **معيار قبول:** الفصل واضح بين `ui` (بدائيات) و`features` (مكوّنات خاصّة بالميزات).

---

## 7) CSS Modules للمكوّنات المعقّدة بصريًّا

* [ ] رصد المكوّنات التي:

  * يتجاوز حجمها ~200 سطر، أو
  * تحتوي على أنماط/Animations مخصّصة ومعقّدة.
* [ ] إنشاء ملفات `*.module.css` لصقل التفاصيل البصرية بدل إرهاق Tailwind بحالات كثيرة.
* [ ] **معيار قبول:** وجود 1–3 أمثلة واضحة لمكوّنات ثقيلة تستخدم CSS Modules حيث يُحسّن القابلية للصيانة.

---

## 8) `generateMetadata` للصفحات الديناميكية

* [ ] لكل صفحة تعرض كيانًا/سجلًا ديناميكيًّا (مثل `/analysis/[id]` أو ما يماثله):

  * [ ] إضافة:

    ```ts
    import type { Metadata } from 'next'
    export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
      // اجلب بيانات العنوان/الوصف حسب الكيان
      return {
        title: `العنصر ${params.id} — اسم التطبيق`,
        description: 'وصف موجز للصفحة الديناميكية',
      }
    }
    ```
* [ ] **معيار قبول:** عناوين ووصف ديناميكيّة تظهر في عرض الصفحة.

---

## 9) (شرطي) إعداد React Query لو وُجدت جلبات عميل متقدّمة

* [ ] في حال وجود جلبات على العميل متعددة الحالات وتتطلب Caching/Retry/Invalidation:

  ```bash
  pnpm add @tanstack/react-query
  ```

  * [ ] إضافة Provider على مستوى `src/app/layout.tsx` (داخل مكوّن عميل فرعي مثل `QueryProvider`).
* [ ] **معيار قبول:** لا يُضاف إلا عند الحاجة الفعلية.

---

## 10) تحديث الاختبارات والضمانات

* [ ] **وحدات (Vitest):** إضافة اختبارات لـ Server Actions بعد نقلها إلى `src/lib/actions/*`.
* [ ] **تكامل (MSW إن لزم):** محاكاة استدعاءات الشبكة في طبقات العميل فقط.
* [ ] **E2E (Playwright):** سيناريو:

  * [ ] يفتعل خطأ داخل صفحة ليتحقق من عمل `app/error.tsx`.
  * [ ] يمرّ عبر صفحة أصبحت Server Component بعد التحويل.
* [ ] **معيار قبول:** نجاح `pnpm test -w` و`pnpm e2e` (أو ما يعادلها) محليًّا.

---

## 11) CI/CD وLinting صارم

* [ ] تحديث سكريبتات `package.json` (إن لزم):

  ```json
  {
    "scripts": {
      "lint": "next lint",
      "typecheck": "tsc -p tsconfig.json --noEmit",
      "test": "vitest run",
      "e2e": "playwright test",
      "build": "next build",
      "prepush": "pnpm lint && pnpm typecheck && pnpm test"
    }
  }
  ```
* [ ] تفعيل قاعدة `import/no-default-export` في CI وعدم السماح بتخطّيها.
* [ ] **معيار قبول:** يفشل الـ CI عند أي خرق للقواعد/الاختبارات.

---

## 12) توثيق موجز للبنية

* [ ] تحديث `README.md` و/أو `ARCHITECTURE.md`:

  * [ ] شرح موجز لـ:

    * RSC أولًا.
    * مكان Server Actions الجديد.
    * قواعد ESLint للمصادِر.
    * مواقع `features/layouts`.
    * وجود `error.tsx` و`generateMetadata`.
    * `.env.example` وكيفية النسخ.
* [ ] **معيار قبول:** مطوّر جديد يستطيع تشغيل وبناء المشروع خلال 10 دقائق من القراءة.

---

## 13) فحوصات القبول النهائية (Definition of Done)

* [ ] لا توجد صفحات عليا عميلة بلا مبرّر.
* [ ] `app/error.tsx` يعمل في سيناريو خطأ E2E.
* [ ] جميع Server Actions داخل `src/lib/actions/*`.
* [ ] لا توجد `export default` خارج صفحات App Router.
* [ ] `.env.example` شامل ومحدّث.
* [ ] وجود أمثلة CSS Modules للمكوّنات المعقّدة.
* [ ] `generateMetadata` مضاف للصفحات الديناميكية.
* [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` تنجح محليًّا.
* [ ] تحديث الوثائق.

---

## 14) التزام تغييرات (Commits) واقتراح رسالة PR

* [ ] اقتراح تقسيم الكومِتات:

  1. `feat(app): add global error boundary at app/error.tsx`
  2. `refactor(actions): move server actions to src/lib/actions/*`
  3. `chore(eslint): enforce named exports, disallow default outside app`
  4. `refactor(app): convert non-interactive pages to server components`
  5. `feat(env): add .env.example and env docs`
  6. `style(ui): introduce CSS Modules for complex components`
  7. `feat(seo): add generateMetadata to dynamic routes`
  8. `test(e2e): cover error boundary and server pages`
* [ ] رسالة PR:

  ```
  chore(next-structure): harden structure to best practices

  - Add app/error.tsx (global error boundary)
  - Move server actions to src/lib/actions/*
  - Enforce named exports via ESLint (no default exports outside app)
  - Convert non-interactive pages to Server Components
  - Add .env.example and update docs
  - Introduce CSS Modules for complex UI components
  - Add generateMetadata for dynamic pages
  - Update tests (unit/e2e) and CI gates

  Definition of Done satisfied; build/lint/tests pass locally.
  ```

---

### أوامر ختام التحقق

* [ ] تشغيل:

  ```bash
  pnpm lint && pnpm typecheck && pnpm test -w && pnpm build
  ```
* [ ] فتح PR إلى `main` بعنوان:

  ```
  chore(next-structure): finalize best-practice compliance
  ```

> عند إتمام جميع البنود أعلاه، يصبح المشروع ممتثلًا بالكامل لأفضل ممارسات Next.js وفق الدليل التنفيذي المحدّد.
