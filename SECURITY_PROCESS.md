# سياسة وإجراءات الأمان (Security Process)

## النطاق
يعالج هذا الملف كيفية التعامل مع نتائج فحوصات الأمان (مثل Semgrep) وتحويلها إلى مهام قابلة للتنفيذ ومُنظّمة بالأولوية.

## الأدوار
- **Security Owner**: يقوم بالـ triage ويعين المالكين ويضبط الأولويات.
- **Maintainers**: ينفذون الإصلاحات، يضيفون اختبارات، ويحدثون السجلات.
- **Reviewers**: يراجعون PRs الأمنية ويتحققون من صحة الإصلاحات.

## SLA (Service Level Agreement)
- **CRITICAL**: ظرف 48 ساعة كحد أقصى من وقت الاكتشاف.
- **HIGH**: ظرف 5 أيام عمل.
- **MEDIUM**: ظرف 10 أيام عمل.
- **LOW**: يتم التعامل معها في دورات التطوير العادية.

## التدفق (Workflow)

### 1. اكتشاف وتوثيق
1. يُحدّث التقرير الأمني المرجعي `SECURITY_SCAN_REPORT.md` (أتمتة أو يدويًا).
2. يتم توليد التقرير من أدوات الفحص الأمني:
   - Semgrep (SAST)
   - npm audit / pnpm audit
   - GitHub Dependabot
   - CodeQL
   - Manual security reviews

### 2. تحويل إلى Issues
تحويل كل finding إلى Issue باستخدام القالب `security-finding.yml` مع الليبل المناسب:
- `security-critical` - لثغرات حرجة (XSS, SQL Injection, RCE, Path Traversal)
- `security-high` - لثغرات عالية (Insecure dependencies, hardcoded secrets)
- `security-medium` - لثغرات متوسطة (Code quality issues with security implications)

**استخدام السكربت الآلي:**
```bash
python3 scripts/parse_create_issues.py
```

### 3. ربط بلوحة المشروع
ربط جميع الـ Issues بلوحة Project (Classic أو v2):

**الأعمدة المطلوبة:**
- **Critical Fixes** - ثغرات حرجة تمنع الدمج
- **High** - ثغرات عالية الأولوية
- **Medium** - ثغرات متوسطة الأولوية
- **To Verify** - إصلاحات تنتظر التحقق
- **Done** - إصلاحات مكتملة ومُحققة

**استخدام السكربت الآلي:**
```bash
bash scripts/link_issues_to_project.sh "Security Findings (classic)"
```

### 4. تنفيذ الإصلاحات
أي PR يجب أن:
1. يُشير إلى Issue محدد باستخدام `Fixes #<issue-number>` أو `Closes #<issue-number>`
2. يحتوي على:
   - **شرح الإصلاح**: وصف تفصيلي للثغرة والحل
   - **اختبارات**: Unit tests / Integration tests تثبت الإصلاح
   - **دليل قبل/بعد**: screenshots, code snippets, security test results
3. يمر بمراجعة أمنية إذا كان critical أو high
4. يحدث `SECURITY_FIXES.md` بإدخال موثق

**مثال PR description:**
```markdown
## Security Fix: XSS Prevention in Chart Component

Fixes #42

### Vulnerability
- **Severity**: CRITICAL
- **Type**: Cross-Site Scripting (XSS)
- **File**: `frontend/src/components/ui/chart.tsx`
- **Line**: 81

### Root Cause
Use of `dangerouslySetInnerHTML` for dynamic CSS injection allowed arbitrary script execution.

### Fix Applied
Replaced `dangerouslySetInnerHTML` with safe `textContent` assignment in useEffect hook.

**Before:**
```typescript
<style dangerouslySetInnerHTML={{ __html: cssRules }} />
```

**After:**
```typescript
const styleRef = useRef<HTMLStyleElement>(null);
useEffect(() => {
  if (styleRef.current) {
    styleRef.current.textContent = cssRules;
  }
}, [cssRules]);
<style ref={styleRef} />
```

### Testing
- ✅ Unit tests added: `chart.test.tsx`
- ✅ Manual XSS payload testing
- ✅ No regression in visual rendering

### Evidence
- Screenshot: [before] vs [after]
- Security scan results: [attached]
```

### 5. CI/CD Security Gate
**Workflow: `security-gate.yml`** يمنع الدمج إذا:
- كانت هناك `security-critical` مفتوحة
- فشلت فحوصات الأمان الآلية
- لم تمر الـ PR بالمراجعة الأمنية المطلوبة

**تكوين حماية الفرع (Branch Protection):**
1. انتقل إلى: Settings → Branches → Add rule
2. اختر الفروع: `main`, `develop`
3. فعّل:
   - ✅ Require status checks to pass before merging
   - ✅ Security Gate - Block merges if open critical issues
   - ✅ Require approvals (1+ للـ HIGH/CRITICAL)
   - ✅ Require conversation resolution before merging

### 6. التحقق والإغلاق
بعد الدمج:
1. نقل الـ Issue إلى عمود **To Verify**
2. تشغيل فحوصات أمنية للتحقق من الإصلاح
3. تحديث `SECURITY_FIXES.md` بالإدخال الموثق
4. تحديث `SECURITY_SCAN_REPORT.md` بتغيير الحالة من **Open** إلى **Fixed**
5. نقل الـ Issue إلى عمود **Done** وإغلاقه

## ملاحظات تنفيذية حرجة

### ❌ ممنوعات صارمة
1. **لا دمج على `main/develop` بوجود ثغرات حرجة مفتوحة** - يمنعها `security-gate.yml`
2. **يُمنع استخدام GitHub Actions غير مثبتة على full commit SHA**
   - ❌ `uses: actions/checkout@v4`
   - ✅ `uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11`
3. **يُمنع تجاهل XSS أو Path Traversal لأي سبب** - هذه critical دائمًا
4. **يُمنع استخدام `dangerouslySetInnerHTML` بدون sanitization**
5. **يُمنع hardcoded secrets في أي ملف** - استخدم environment variables
6. **يُمنع تعطيل ESLint security rules** بدون موافقة Security Owner

### ✅ أفضل الممارسات
1. استخدم `DOMPurify` لتنظيف HTML قبل الإدراج
2. استخدم parameterized queries لمنع SQL Injection
3. استخدم `path.resolve()` + validation لمنع Path Traversal
4. استخدم Content Security Policy (CSP) headers
5. استخدم rate limiting لحماية APIs
6. استخدم helmet.js للـ security headers
7. راجع dependencies بانتظام وحدّثها

## أدوات الفحص الأمني

### Automated Scans
```bash
# SAST with Semgrep
semgrep --config auto .

# Dependency audit
pnpm audit --audit-level=high
npm audit --audit-level=high

# TypeScript security checks
pnpm tsc --noEmit

# ESLint security rules
pnpm eslint . --ext .ts,.tsx,.js,.jsx
```

### Manual Reviews
- Code review مع focus على security hotspots
- فحص authentication/authorization logic
- فحص input validation ومعالجة البيانات
- فحص error handling وتسريب المعلومات

## توثيق الإصلاحات

### صيغة الإدخال في SECURITY_FIXES.md
```markdown
### [SEVERITY] Issue #XX - Brief Title

- **Issue**: #XX
- **PR**: #YY
- **Owner**: @username
- **Severity**: critical/high/medium
- **Type**: XSS / Path Traversal / etc.
- **Description**: ما هي الثغرة وكيف تم استغلالها
- **Fix**: ما هو الإصلاح المطبق
- **Evidence**: 
  - Before: [link/screenshot]
  - After: [link/screenshot]
  - Tests: [link to test file]
- **Date Opened**: YYYY-MM-DD
- **Date Fixed**: YYYY-MM-DD
- **Verified By**: @reviewer-username
```

## الإبلاغ عن ثغرات جديدة

اتبع `SECURITY.md` للإبلاغ عن ثغرات:
1. استخدم GitHub Security → Report a vulnerability
2. **لا تفتح Issues عامة** للثغرات الأمنية
3. وفر:
   - وصف الثغرة
   - خطوات إعادة الإنتاج
   - Proof of Concept (PoC)
   - التأثير المحتمل
   - اقتراحات للإصلاح

## المراجعات والتحديثات

- **مراجعة شهرية**: فحص SECURITY_SCAN_REPORT.md والتأكد من معالجة جميع الثغرات
- **تحديث ربع سنوي**: مراجعة SECURITY_PROCESS.md وتحديثه حسب الحاجة
- **تدريب سنوي**: تدريب الفريق على أفضل ممارسات الأمان

## جهات الاتصال

- **Security Owner**: mohamedaminradyofficial
- **Repository**: https://github.com/mohamedaminradyofficial/the-copy-monorepo
- **Security Policy**: SECURITY.md
- **Security Fixes Log**: SECURITY_FIXES.md

---

**آخر تحديث**: 2025-11-03
**الإصدار**: 1.0