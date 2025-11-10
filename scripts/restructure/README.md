# Project Restructure Scripts

سكربتات إعادة هيكلة المشروع - دليل الاستخدام الشامل

## 📋 نظرة عامة

هذه المجموعة من السكربتات تساعد على إعادة هيكلة المشروع بشكل آمن ومنظم، مع إمكانية التراجع في أي وقت.

## 🎯 الأهداف

1. ✅ حذف الملفات والمجلدات المكررة
2. ✅ توحيد بنية src/lib
3. ✅ إنشاء config/ مركزي
4. ✅ تحديث الاستيرادات
5. ✅ التحقق من صحة التغييرات

## 📝 ترتيب التنفيذ

### المرحلة 1: التحضير

```bash
# 1. نسخ احتياطي وإنشاء branches
chmod +x scripts/restructure/*.sh
./scripts/restructure/01-backup-and-prepare.sh
```

**ماذا يفعل:**
- ✅ يتحقق من نظافة git working directory
- ✅ ينشئ backup branch بالتاريخ
- ✅ ينشئ working branch للعمل
- ✅ يوثق الحالة الحالية في docs/restructure/

**المخرجات:**
- `docs/restructure/dependencies-before.txt`
- `docs/restructure/files-count-before.txt`
- `docs/restructure/directory-structure-before.txt`
- `docs/restructure/gemini-files-before.txt`

---

### المرحلة 2: التنظيف

```bash
# 2. تشغيل dry run أولاً (للمعاينة)
DRY_RUN=true ./scripts/restructure/02-cleanup-duplicates.sh

# 3. إذا كانت النتائج جيدة، نفذ فعلياً
./scripts/restructure/02-cleanup-duplicates.sh
```

**ماذا يفعل:**
- 🗑️ يحذف المجلدات المكررة:
  - `frontend/ai/`
  - `frontend/stations/`
  - `frontend/constitutional/`
  - `frontend/core/`
  - `frontend/interfaces/`

- 🗑️ يحذف ملفات .js المكررة:
  - `frontend/gemini-core.js`
  - كل ملفات .js و .d.ts في `src/lib/ai/`

- 📦 ينقل `frontend/utils/` إلى `frontend/src/lib/utils/`

**الناتج المتوقع:**
- توفير ~500-800 KB
- إزالة 22 ملف gemini مكرر
- بنية أنظف وأسهل للصيانة

---

### المرحلة 3: إعادة الهيكلة

```bash
# 4. إنشاء config/ مركزي
./scripts/restructure/03-restructure-config.sh
```

**ماذا يفعل:**
- 📁 ينشئ `frontend/src/lib/config/`
- 📄 ينشئ ملفات التهيئة:
  - `constants.ts` - ثوابت التطبيق
  - `sentry.config.ts` - تهيئة Sentry موحدة
  - `redis.config.ts` - تهيئة Redis
  - `index.ts` - exports مركزية

- 🔄 يحدث ملفات Sentry الموجودة لتستخدم التهيئة الجديدة

**الفائدة:**
- ✅ تهيئة مركزية سهلة الإدارة
- ✅ تجنب التكرار
- ✅ سهولة التحديث والصيانة

---

### المرحلة 4: فحص الاستيرادات

```bash
# 5. فحص وإصلاح الاستيرادات
./scripts/restructure/04-fix-imports.sh
```

**ماذا يفعل:**
- 🔍 يبحث عن استيرادات من مواقع محذوفة
- 🔍 يبحث عن استيرادات .js (يجب أن تكون .ts)
- 📊 يعرض تقرير بالمشاكل المحتملة
- ✅ يتحقق من وجود المجلدات الجديدة

**إذا وجد مشاكل:**
- يعرض أمثلة للإصلاحات المطلوبة
- يوجهك لاستخدام TypeScript للعثور على الأخطاء

---

### المرحلة 5: التحقق الشامل

```bash
# 6. تشغيل كل الفحوصات
./scripts/restructure/05-verify-build.sh
```

**ماذا يفعل:**
- 📦 `pnpm install` - تثبيت الاعتمادات
- 🔍 `pnpm run typecheck` - فحص الأنواع
- ✨ `pnpm run lint` - فحص الكود
- 🧪 `pnpm run test` - تشغيل الاختبارات
- 🏗️ `pnpm run build` - بناء المشروع
- 📊 يقارن الأحجام قبل وبعد
- 📋 يعرض ملخص التغييرات

**الناتج:**
- تقرير شامل بنجاح/فشل كل خطوة
- إحصائيات التغييرات
- تعليمات الخطوات التالية

---

## 🔄 السيناريوهات المختلفة

### السيناريو 1: تنفيذ كامل (موصى به)

```bash
# تنفيذ كل المراحل بالترتيب
./scripts/restructure/01-backup-and-prepare.sh
DRY_RUN=true ./scripts/restructure/02-cleanup-duplicates.sh
./scripts/restructure/02-cleanup-duplicates.sh
./scripts/restructure/03-restructure-config.sh
./scripts/restructure/04-fix-imports.sh
./scripts/restructure/05-verify-build.sh
```

**الوقت المتوقع:** 1-2 ساعة

---

### السيناريو 2: تنظيف فقط (خطوة واحدة)

```bash
./scripts/restructure/01-backup-and-prepare.sh
./scripts/restructure/02-cleanup-duplicates.sh
./scripts/restructure/05-verify-build.sh
```

**الوقت المتوقع:** 30-45 دقيقة

---

### السيناريو 3: Config فقط

```bash
./scripts/restructure/01-backup-and-prepare.sh
./scripts/restructure/03-restructure-config.sh
./scripts/restructure/05-verify-build.sh
```

**الوقت المتوقع:** 20-30 دقيقة

---

## ⚠️ التراجع (Rollback)

### إذا حدثت مشاكل:

```bash
# 1. التراجع للـ backup branch
git checkout backup/pre-restructure-YYYYMMDD-HHMMSS

# 2. أو إلغاء كل التغييرات
git reset --hard HEAD

# 3. أو التراجع عن commits معينة
git revert <commit-hash>
```

---

## 📊 معايير النجاح

### ✅ يجب أن تمر كل هذه الفحوصات:

```bash
✅ pnpm install         # بدون أخطاء
✅ pnpm run typecheck   # 0 أخطاء TypeScript
✅ pnpm run lint        # 0 أخطاء ESLint
✅ pnpm run test        # كل الاختبارات تنجح
✅ pnpm run build       # البناء ينجح
```

### 📁 البنية النهائية المتوقعة:

```
frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   │   ├── ai/                # ✅ موحد
│   │   ├── drama-analyst/     # ✅ موجود
│   │   ├── config/            # ✅ جديد
│   │   ├── utils/             # ✅ منقول من root
│   │   └── ...
│   └── ...
├── sentry.*.config.ts         # ✅ محدث
└── ...
```

---

## 🔧 استكشاف الأخطاء

### خطأ: "Not a git repository"

```bash
# الحل: تأكد أنك في مجلد المشروع
cd /path/to/the-copy
```

### خطأ: "Uncommitted changes"

```bash
# الحل: commit أو stash التغييرات
git stash
# أو
git add -A && git commit -m "WIP"
```

### خطأ: TypeScript errors بعد التنظيف

```bash
# 1. تحقق من الاستيرادات
./scripts/restructure/04-fix-imports.sh

# 2. شاهد الأخطاء بالتفصيل
pnpm run typecheck

# 3. ابحث عن استيرادات من مواقع قديمة
grep -r "from '../ai/" frontend/src
```

### خطأ: Build fails

```bash
# 1. نظف وأعد التثبيت
rm -rf node_modules frontend/node_modules
pnpm install

# 2. نظف البناء السابق
rm -rf frontend/.next

# 3. أعد المحاولة
pnpm run build
```

---

## 📝 ملاحظات مهمة

### ⚡ نصائح السرعة:

1. **DRY_RUN أولاً**: دائماً شغل مع `DRY_RUN=true` أولاً
2. **Backup مهم**: لا تتخطى خطوة الـ backup
3. **Test بعد كل مرحلة**: تحقق بعد كل سكربت

### 🔒 نصائح الأمان:

1. **لا تشتغل على main مباشرة**
2. **تأكد من push الـ backup branch**
3. **راجع التغييرات قبل commit**

### 📚 التوثيق:

1. كل سكربت يوثق ما يفعل
2. المخرجات في `docs/restructure/`
3. Git commits تحتوي على وصف مفصل

---

## 🎯 الخطوات بعد النجاح

### 1. Commit التغييرات

```bash
git add -A
git commit -m "refactor: project restructure

- Remove duplicate files and directories
- Unify src/lib structure
- Create centralized config
- Update imports
- Improve maintainability

Closes #XXX"
```

### 2. Push للـ remote

```bash
git push origin refactor/project-restructure
```

### 3. إنشاء Pull Request

- راجع التغييرات
- اطلب code review
- شغل CI/CD checks

### 4. Deploy على Staging

```bash
# Deploy للـ staging environment
# اختبر كل الوظائف الرئيسية
```

### 5. Production Deployment

```bash
# بعد موافقة الفريق
git checkout main
git merge refactor/project-restructure
git push origin main
```

---

## 📞 الدعم

إذا واجهت أي مشاكل:

1. راجع logs السكربتات
2. راجع `docs/restructure/` للتوثيق
3. استخدم `git diff` لرؤية التغييرات
4. راجع التقرير الرئيسي: `PROJECT_AUDIT_REPORT.md`

---

## ✨ تم بحمد الله

**الإصدار:** 1.0
**التاريخ:** 2025-11-07
**الحالة:** Ready for Production
