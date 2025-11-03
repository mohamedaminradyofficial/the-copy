✅ المرحلة 1 — الإصلاحات الحرجة (Blockers – ممنوع المتابعة قبل إتمامها)

| رقم | نوع الثغرة                                   | عدد الحالات | الملفات المصابة                       | المطلوب                                                              |
| --- | -------------------------------------------- | ----------- | ------------------------------------- | -------------------------------------------------------------------- |
| 1   | Dynamic file paths (Path Traversal)          | 30+         | `frontend/scripts/*.js`               | ✅ استبدال input-based `path.join` بـ safe wrapper + validate baseDir |
| 2   | XSS: `dangerouslySetInnerHTML` / `innerHTML` | 6           | `screenplay-editor.tsx` + `chart.tsx` | ✅ استبدال الـ unsafe render بــ DOMPurify أو sanitizer محلي          |
| 3   | Regex DoS (dynamic `new RegExp`)             | 25+         | كل Agents في `drama-analyst`          | ✅ استخدام SafeRegex أو boundary + limit length                       |
| 4   | Hardcoded Passwords                          | 3           | `auth.service.test.ts`                | ✅ استبدال بقيم test env + `.env.test.local`                          |
| 5   | Insecure GitHub Actions (unpinned SHA)       | 3           | `.github/workflows/*.yml`             | ✅ تثبيت كل `uses:` على commit SHA بدل tag                            |


✅ المرحلة 2 — إصلاحات High Priority

| رقم | نوع                                     | المطلوب                                                   |
| --- | --------------------------------------- | --------------------------------------------------------- |
| 6   | Insecure dependency (`next@15.3.3`)     | ترقية إلى `15.4.7` أو `16.x`                              |
| 7   | Prototype Pollution risk                | مراجعة `kv-utils.ts` + تطبيق structuredClone بدل mutation |
| 8   | Weak random generator (`Math.random()`) | استبدال بـ `crypto.randomUUID()`                          |


✅ المرحلة 3 — إصلاحات تنظيمية

| رقم | نوع                                 | المطلوب              |
| --- | ----------------------------------- | -------------------- |
| 9   | Missing link anchors in README      | إصلاح fragments      |
| 10  | PowerShell readonly variable misuse | تعديل المتغير `$pid` |

