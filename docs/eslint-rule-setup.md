# إعداد قاعدة ESLint لفحص Duplicate Exports

## نظرة عامة

تم إنشاء أداة فحص مخصصة للتحقق من الـ duplicate exports في ملفات JavaScript و TypeScript. هذه الأداة تساعد في منع المشاكل التي تنجم عن تصدير نفس المعرف مرتين في نفس الملف.

## الميزات

### ✅ الميزات المتاحة:
- **فحص شامل**: دعم ملفات `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`
- **أنواع تصدير متعددة**: 
  - Named exports
  - Default exports
  - Export objects
  - CommonJS exports (`module.exports`)
- **مخرجات متعددة**: Console و JSON
- **Git Integration**: Pre-commit hook للتحقق التلقائي
- **تقارير مفصلة**: رسائل خطأ واضحة مع مواقع التكرار

### 📋 الملفات المولدة:

```
scripts/
└── check-duplicate-exports.mjs    # أداة الفحص الرئيسية

.git/
└── hooks/
    └── pre-commit                  # Git pre-commit hook

package.json                       # Scripts محدثة

docs/
└── eslint-rule-setup.md           # هذا التوثيق
```

## طريقة الاستخدام

### 1. الفحص السريع (جميع الملفات)
```bash
npm run check:exports
# أو
pnpm check:exports
```

### 2. فحص ملفات محددة
```bash
node scripts/check-duplicate-exports.mjs src/utils.ts src/helpers.ts
```

### 3. فحص بمخرجات JSON
```bash
npm run check:exports:json
# أو
pnpm check:exports:json
```

### 4. التحقق من جميع الملفات في src
```bash
node scripts/check-duplicate-exports.mjs --pattern "src/**/*.{js,ts}"
```

### 5. عرض المساعدة
```bash
node scripts/check-duplicate-exports.mjs --help
```

## أمثلة على الأخطاء المكتشفة

### 1. Named Export مكرر
```javascript
// ❌ خطأ
export const helper = () => {};
export const helper = () => {}; // خطأ: helper مُكرر

// ✅ صحيح
export const helper = () => {};
export const anotherHelper = () => {};
```

### 2. Export Object مكرر
```javascript
// ❌ خطأ
export {
  utils,
  helpers,
  utils // خطأ: utils مُكرر
}

// ✅ صحيح
export {
  utils,
  helpers,
  components
}
```

### 3. CommonJS مكرر
```javascript
// ❌ خطأ
module.exports = {
  utils,
  helpers,
  utils // خطأ: utils مُكرر
}

// ✅ صحيح
module.exports = {
  utils,
  helpers,
  components
}
```

## Git Pre-commit Hook

### تفعيل الفحص التلقائي
تم إعداد Git pre-commit hook يقوم بفحص جميع الملفات المعدلة قبل الـ commit:

```bash
git add .
git commit -m "Your commit message"
```

إذا تم العثور على duplicate exports، ستفشل عملية الـ commit مع رسالة خطأ.

### تجاوز الفحص (غير موصى به)
```bash
git commit --no-verify -m "Commit message"
```

## Scripts المضافة في package.json

```json
{
  "scripts": {
    "check:exports": "node scripts/check-duplicate-exports.mjs",
    "check:exports:json": "node scripts/check-duplicate-exports.mjs --output json",
    "check:exports:fix": "node scripts/check-duplicate-exports.mjs --fix"
  }
}
```

## خيارات سطر الأوامر

| الخيار | الوصف | مثال |
|---------|---------|--------|
| `--help` | عرض المساعدة | `--help` |
| `--output` | نوع المخرجات (console/json) | `--output json` |
| `--pattern` | نمط الملفات للفحص | `--pattern "src/**/*.ts"` |
| `--fix` | إصلاح تلقائي (قيد التطوير) | `--fix` |

## رسائل الخطأ

### رسائل النجاح
```
✅ No duplicate exports found!
```

### رسائل الخطأ
```
❌ Duplicate Export 'functionName' found in src/utils.js
   First: src/utils.js (line 10)
   File: src/utils.js

💥 Duplicate exports detected!
```

## التحديثات المستقبلية

### الميزات المخططة:
- [ ] إصلاح تلقائي للـ duplicate exports
- [ ] دعم TypeScript AST parsing محسن
- [ ] فلاتر مخصصة للملفات
- [ ] إعدادات تخصيصية
- [ ] تقارير HTML

### التحسينات:
- [ ] تحسين الأداء للملفات الكبيرة
- [ ] دعم ESLint plugin
- [ ] Integration مع CI/CD
- [ ] Configuration file

## استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ "Command not found: node"**
   - تأكد من تثبيت Node.js
   - تأكد من وجود Node.js في PATH

2. **خطأ "Script not found"**
   - تأكد من وجود الملف `scripts/check-duplicate-exports.mjs`
   - تأكد من تشغيل الأمر من المجلد الجذر

3. **Pre-commit hook لا يعمل**
   - تأكد من وجود ملف `.git/hooks/pre-commit`
   - تأكد من أن الملف قابل للتنفيذ

### الحلول:

```bash
# فحص وجود الأداة
ls -la scripts/check-duplicate-exports.mjs

# تشغيل فحص يدوي
node scripts/check-duplicate-exports.mjs

# فحص Git hooks
ls -la .git/hooks/pre-commit
```

## المساهمة

للمساهمة في تطوير هذه الأداة:

1. Fork المشروع
2. إنشاء feature branch
3. إضافة التحسينات
4. اختبار التغييرات
5. إرسال Pull Request

## الدعم

في حالة وجود مشاكل أو اقتراحات:
- افتح Issue في المشروع
- راجع التوثيق
- تواصل مع فريق التطوير

---

**تاريخ الإنشاء**: 2025-11-05  
**الإصدار**: 1.0.0  
**المطور**: MiniMax Agent