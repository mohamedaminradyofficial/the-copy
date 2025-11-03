🟥 المهام المطلوبة (TODO LIST) — ترتيب تنفيذي إلزامي
────────────────────────

1️⃣ تثبيت التبعيات الناقصة (cross-env، lucide-react، zod، drizzle، generative-ai …)
✅ النجاح = لا يظهر أي missing dependency أثناء build أو typecheck.

2️⃣ تصفير كل أخطاء TypeScript (حاليًا 200+ خطأ)
✅ النجاح = `pnpm -r run typecheck` يمرّ بلا أخطاء.

3️⃣ إصلاح أخطاء الملفات المحددة:
   - stations/network-diagnostics.ts
   - stations/orchestrator.ts
   - stations/run-all-stations.ts
   - drama-analyst/agents/*.ts
✅ النجاح = لا تبقى أي أخطاء signature / schema / missing export.

4️⃣ بناء المشروع بنجاح
✅ النجاح = `pnpm -r run build` يمرّ بدون TS errors أو dependency failures.

5️⃣ تشغيل اختبار الوحدة الخاص بصفحة Home
✅ النجاح = `npm run test -- src/app/page.test.tsx` يمرّ بدون فشل وبدون map errors.

6️⃣ تشغيل Playwright وإنتاج Evidence:
   - 11 Screenshot
   - 11 HAR
   - logs: health.json + pages-discovered.json
✅ يتم الحفظ تحت: `/frontend/evidence/<YYYY-MM-DD>/`

7️⃣ تشغيل CI محليًا
✅ النجاح = `npm run ci` يمرّ بلا أخطاء + تفعيل pre-push hook يمنع الدفع عند الفشل.

8️⃣ تحديث RUN_REPORT_CURRENT.md
✅ يحتوي على:
   - نتائج Build / Unit / E2E / CI
   - روابط الأدلة (screens, HAR, logs)
   - ملخص ما تم إصلاحه
