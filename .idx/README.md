# Firebase Studio Configuration

هذا المجلد يحتوي على إعدادات Firebase Studio لمنصة "النسخة" لتحليل النصوص الدرامية.

## الملفات

- `dev.nix` - التكوين الرئيسي للبيئة
- `setup-env.sh` - سكريبت إعداد البيئة التلقائي
- `template.json` - قالب المشروع للمشاركة
- `icon-info.md` - معلومات أيقونة المساحة

## المميزات المُفعلة

### الأدوات النظام

- Node.js 20
- Git, curl, wget, unzip

### الإضافات

- Google Gemini AI Companion
- TypeScript/JavaScript support
- Tailwind CSS IntelliSense
- Prettier & ESLint
- Vitest & Playwright testing
- JSON/YAML support

### المعاينات

- **Frontend**: <http://localhost:9002> (Next.js)
- **Backend**: <http://localhost:3001> (Express.js)

### المتغيرات البيئية

- `NODE_ENV=development`
- `FRONTEND_PORT=9002`
- `BACKEND_PORT=3001`

## الاستخدام

عند إنشاء مساحة عمل جديدة، سيتم تلقائياً:

1. تشغيل سكريبت الإعداد
2. تثبيت التبعيات للمشروع الجذر والفرونت إند والباك إند
3. إنشاء ملفات `.env` المطلوبة
4. بدء خوادم التطوير

## التخصيص

لتخصيص البيئة:

1. عدّل `dev.nix` لإضافة أدوات أو إضافات جديدة
2. حدّث `setup-env.sh` لإعدادات إضافية
3. أضف أيقونة مخصصة باسم `icon.png`

## المشاركة

يمكن مشاركة هذا التكوين عبر Git لضمان بيئة متسقة لجميع المطورين.
