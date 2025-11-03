Tags

Create Jira ticket
All issues
499

Code patterns
Enforce Headings Surrounded by Blank Lines
76

Enforce Lists Surrounded by Blank Lines
69

Enforce Medium Number of Lines of Code (NLOC) Limit
61

Enforce Medium Cyclomatic Complexity Threshold
57

Avoid Unnecessary Blocks
36

Enforce Alpha-Value Notation
29

Enforce color-function notation style
28

Enforce Medium File Length Limit Based on Number of Lines of Code
26

Avoid Using Emphasis Instead of Headings
16

Disallow Inline HTML in Markdown
12

Avoid Assignment In Operand
9

Enforce Providing Base with parseInt
6

Detect Python Source Code Errors with Pyflakes
6

Avoid Using Write-Host
5

Enforce notation style for degree hues
5

Enforce Ordered List Item Prefix Consistency
4

Avoid Unused Variables
4

Enforce Valid Link Fragments in Markdown
4

Avoid Trailing Punctuation in Headings
3

Consider security implications of importing subprocess module
3

Enforce Angle Brackets Around Bare URLs
3

Disallow Specified SCSS Functions
3

Enforce font-family name quotes
3

Check subprocess usage without shell=True
2

Enforce Consistent Unordered List Style
2

Enforce Pinning of Third-Party GitHub Actions to Full Commit SHA
2

Audit urllib urlopen for permitted schemes
2

Disallow Multiple Consecutive Blank Lines
2

Enforce PEP8 Style Guide Compliance
2

Enforce Medium Parameter Count Limit
2

Avoid Bare Except Clauses
2

Require or Disallow Empty Line Before Comments
2

Avoid Multiple Headings with the Same Content
2

Avoid pass in except block
2

Others
9

MINOR
Code style

Unexpected quotes around "Amiri" (font-family-name-quotes)

frontend/src/app/
globals.css

11
font-family: "Amiri";
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

5
--color-cream-50: rgba(252, 252, 249, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

22
--color-red-500: rgba(192, 21, 47, 1);
MINOR
Code style

--color-bg-1: rgba(59, 130, 246, 0.08); /_Light blue _/
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

4
--color-black: rgba(0, 0, 0, 1);
MINOR
Code style

--color-bg-2: rgba(245, 158, 11, 0.08); /_Light yellow _/
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

6
--color-cream-100: rgba(255, 255, 253, 1);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

13
--color-charcoal-800: rgba(38, 40, 40, 1);
MINOR
Best practice

Emphasis used instead of a heading

backend/
README.md

10
**واجهة برمجة تطبيقات قوية لمنصة تحليل النصوص الدرامية بالذكاء الاصطناعي**
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

3
--color-white: rgba(255, 255, 255, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

10
--color-slate-500: rgba(98, 108, 113, 1);
MEDIUM
Code complexity

Method main has 72 lines of code (limit is 50)

scripts/
create_test_issues.py

247
def main():
MINOR
Code style

Unexpected quotes around "Cairo" (font-family-name-quotes)

frontend/src/app/
globals.css

26
font-family: "Cairo";
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

11
--color-brown-600: rgba(94, 82, 64, 1);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

19
--color-teal-700: rgba(26, 104, 115, 1);
HIGH
Security

Insecure Modules Libraries

An action sourced from a third-party repository on GitHub is not pinned to a full length commit SHA. Pinning an action to a full length commit SHA is currently the only way to use an action as an immutable release.

.github/workflows/
codeguru-reviewer.yml

33
uses: aws-actions/configure-aws-credentials@v4
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

12
--color-charcoal-700: rgba(31, 33, 33, 1);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

21
--color-red-400: rgba(255, 84, 89, 1);
MINOR
Code style

Expected "227.392" to be "227.392deg" (hue-degree-notation)

frontend/src/app/
globals.css

156
--chart-3: oklch(0.398 0.07 227.392);
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_SUMMARY.md

137

- ✅ All Markdown files following consistent formatting
  137

138

- ✅ All Markdown files following consistent formatting
  MINOR
  Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

7
--color-gray-200: rgba(245, 245, 245, 1);
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_PROCESS.md

28

### 2. تحويل إلى Issues

28

### 2. تحويل إلى Issues

MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

12
--color-charcoal-700: rgba(31, 33, 33, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

21
--color-red-400: rgba(255, 84, 89, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

9
--color-gray-400: rgba(119, 124, 124, 1);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

22
--color-red-500: rgba(192, 21, 47, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

23
--color-orange-400: rgba(230, 129, 97, 1);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

6
--color-cream-100: rgba(255, 255, 253, 1);
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

169

### Outcome

169

### Outcome

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

95

### Manual Fix Checklist

95

### Manual Fix Checklist

MINOR
Code style

Expected "84.429" to be "84.429deg" (hue-degree-notation)

frontend/src/app/
globals.css

157
--chart-4: oklch(0.828 0.189 84.429);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

19
--color-teal-700: rgba(26, 104, 115, 1);
MINOR
Code style

Expected "184.704" to be "184.704deg" (hue-degree-notation)

frontend/src/app/
globals.css

155
--chart-2: oklch(0.6 0.118 184.704);
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_PROCESS.md

98

### Testing

98

### Testing

MEDIUM
Code complexity

Method parse_report has a cyclomatic complexity of 43 (limit is 8)

scripts/
parse_create_issues.py

88
def parse_report() -> List[Dict[str, str]]:
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/
globals.css

148
--input: rgba(230, 234, 242, 0.1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

16
--color-teal-400: rgba(45, 166, 178, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

13
--color-charcoal-800: rgba(38, 40, 40, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/
slider.css

36
border: 2px solid rgba(255, 255, 255, 0.25);
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

scripts/
README.md

125

- Creates GitHub Project (v2) if it doesn't exist
  125

126

- Creates GitHub Project (v2) if it doesn't exist
  MEDIUM
  Code complexity

Method parse_report has a cyclomatic complexity of 15 (limit is 8)

scripts/
create_security_issues_direct.py

100
def parse_report() -> List[Dict[str, str]]:
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

17
--color-teal-500: rgba(33, 128, 141, 1);
MEDIUM
Code complexity

Method main has a cyclomatic complexity of 19 (limit is 8)

scripts/
create_security_issues_direct.py

256
def main():
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

10
--color-slate-500: rgba(98, 108, 113, 1);
MEDIUM
Code complexity

Method parse_report has 88 lines of code (limit is 50)

scripts/
parse_create_issues.py

88
def parse_report() -> List[Dict[str, str]]:
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

16
--color-teal-400: rgba(45, 166, 178, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

37
--color-bg-1: rgba(59, 130, 246, 0.08); /_ Light blue _/
MINOR
Code style

Expected "0.25" to be "25%" (alpha-value-notation)

frontend/src/app/
slider.css

36
border: 2px solid rgba(255, 255, 255, 0.25);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/
globals.css

166
--sidebar-border: rgba(230, 234, 242, 0.1);
MEDIUM
Code complexity

Method main has 66 lines of code (limit is 50)

scripts/
parse_create_issues.py

311
def main():
MEDIUM
Security

Insecure Modules Libraries

Insecure dependency npm/esbuild@0.18.20 (GHSA-67mh-4wv8-2f99: esbuild enables any website to send any requests to the development server and read the response) (update to 0.25.0)

backend/
package-lock.json

480
"node_modules/@esbuild-kit/core-utils/node_modules/esbuild": {
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

9
--color-gray-400: rgba(119, 124, 124, 1);
MEDIUM
Code complexity

Method main has 71 lines of code (limit is 50)

scripts/
create_security_issues_direct.py

256
def main():
MEDIUM
Best practice

Unknown rule scss_function-disallowed-list. Did you mean function-disallowed-list?

frontend/src/app/
slider.css

1
/_Global reset _/
MEDIUM
Code complexity

Method parse_report has a cyclomatic complexity of 15 (limit is 8)

scripts/
create_test_issues.py

104
def parse_report() -> List[Dict[str, str]]:
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

7
--color-gray-200: rgba(245, 245, 245, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

14
--color-slate-900: rgba(19, 52, 59, 1);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

23
--color-orange-400: rgba(230, 129, 97, 1);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

5
--color-cream-50: rgba(252, 252, 249, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

18
--color-teal-600: rgba(29, 116, 128, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

15
--color-teal-300: rgba(50, 184, 198, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

8
--color-gray-300: rgba(167, 169, 169, 1);
MINOR
Code style

--color-bg-3: rgba(34, 197, 94, 0.08); /_Light green _/
MINOR
Code style

Expected "0.1" to be "10%" (alpha-value-notation)

frontend/src/app/
globals.css

148
--input: rgba(230, 234, 242, 0.1);
MEDIUM
Code complexity

Method parse_report_alternative has a cyclomatic complexity of 13 (limit is 8)

scripts/
parse_create_issues.py

205
def parse_report_alternative(content: str) -> List[Dict[str, str]]:
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

20
--color-teal-800: rgba(41, 150, 161, 1);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

14
--color-slate-900: rgba(19, 52, 59, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/
globals.css

147
--border: rgba(230, 234, 242, 0.1);
MEDIUM
Code complexity

Method parse_report has 60 lines of code (limit is 50)

scripts/
create_security_issues_direct.py

100
def parse_report() -> List[Dict[str, str]]:
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
BACKEND_DOCUMENTATION.md

519

### إعداد الإنتاج

519

### إعداد الإنتاج

MINOR
Code style

Expected "70.08" to be "70.08deg" (hue-degree-notation)

frontend/src/app/
globals.css

158
--chart-5: oklch(0.769 0.188 70.08);
MINOR
Code style

Expected "#ffffff" to be "#fff" (color-hex-length)

frontend/src/app/
globals.css

146
--destructive-foreground: #ffffff;
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

4
--color-black: rgba(0, 0, 0, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

3
--color-white: rgba(255, 255, 255, 1);
MEDIUM
Code complexity

Method main has a cyclomatic complexity of 16 (limit is 8)

scripts/
create_test_issues.py

247
def main():
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

scripts/
README.md

60

- Parses `SECURITY_SCAN_REPORT.md` automatically
  60

61

- Parses `SECURITY_SCAN_REPORT.md` automatically
  MINOR
  Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_PROCESS.md

30

- `security-critical` - لثغرات حرجة (XSS, SQL Injection, RCE, Path Traversal)
  30

31

- `security-critical` - لثغرات حرجة (XSS, SQL Injection, RCE, Path Traversal)
  MINOR
  Code style

Quick fix

Expected: 1; Actual: 0; Below

frontend/src/app/(main)/directors-studio/
README.md

21

### 🎞️ Rough Cut Visualization - المونتاج المبدئي

21

### 🎞️ Rough Cut Visualization - المونتاج المبدئي

MINOR
Code style

Expected "41.116" to be "41.116deg" (hue-degree-notation)

frontend/src/app/
globals.css

154
--chart-1: oklch(0.646 0.222 41.116);
MINOR
Code style

Expected "0.1" to be "10%" (alpha-value-notation)

frontend/src/app/
globals.css

147
--border: rgba(230, 234, 242, 0.1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

24
--color-orange-500: rgba(168, 75, 47, 1);
MINOR
Code style

Expected empty line before comment (comment-empty-line-before)

frontend/src/app/
globals.css

2
/_Fonts are loaded locally to comply with CSP headers_/
MINOR
Code style

Expected empty line before comment (comment-empty-line-before)

frontend/src/app/
globals.css

3
/_Use the fontOptimizer service to generate font-face declarations_/
MEDIUM
Best practice

Unknown rule scss_function-disallowed-list. Did you mean function-disallowed-list?

frontend/src/app/
globals.css

1
/_Production-optimized font loading - CSP compliant_/
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

18
--color-teal-600: rgba(29, 116, 128, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

20
--color-teal-800: rgba(41, 150, 161, 1);
MINOR
Code style

Expected "0.1" to be "10%" (alpha-value-notation)

frontend/src/app/
globals.css

166
--sidebar-border: rgba(230, 234, 242, 0.1);
MINOR
Code style

Expected "0.08" to be "8%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

38
--color-bg-2: rgba(245, 158, 11, 0.08); /_ Light yellow _/
MEDIUM
Code complexity

Method parse_report has 62 lines of code (limit is 50)

scripts/
create_test_issues.py

104
def parse_report() -> List[Dict[str, str]]:
MEDIUM
Best practice

Unknown rule scss_function-disallowed-list. Did you mean function-disallowed-list?

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

1
:root {
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

8
--color-gray-300: rgba(167, 169, 169, 1);
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

frontend/src/app/(main)/cinematography-studio/
README.md

126

### Validate Shot

126

### Validate Shot

MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

17
--color-teal-500: rgba(33, 128, 141, 1);
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_PROCESS.md

3

## النطاق

3

## النطاق

MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

15
--color-teal-300: rgba(50, 184, 198, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

11
--color-brown-600: rgba(94, 82, 64, 1);
HIGH
Security

Insecure Modules Libraries

An action sourced from a third-party repository on GitHub is not pinned to a full length commit SHA. Pinning an action to a full length commit SHA is currently the only way to use an action as an immutable release.

.github/workflows/
codeguru-reviewer.yml

39
uses: aws-actions/codeguru-reviewer@v1.1
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

24
--color-orange-500: rgba(168, 75, 47, 1);
MEDIUM
Code complexity

Method main has a cyclomatic complexity of 16 (limit is 8)

scripts/
parse_create_issues.py

311
def main():
MINOR
Code style

Unexpected quotes around "Literata" (font-family-name-quotes)

frontend/src/app/
globals.css

41
font-family: "Literata";
MEDIUM
Error prone

Link fragments should be valid

backend/
README.md

12
[🚀 البدء السريع](#-البدء-السريع) • [📖 API التوثيق](#-api-التوثيق) • [🧪 الاختبارات](#-الاختبارات) • [🚀 النشر](#-النشر)
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
BACKEND_DOCUMENTATION.md

82

### إعدادات البيئة (config/env.ts)

82

### إعدادات البيئة (config/env.ts)

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_PROCESS.md

20

1. يُحدّث التقرير الأمني المرجعي `SECURITY_SCAN_REPORT.md` (أتمتة أو يدويًا).
   20

21

1. يُحدّث التقرير الأمني المرجعي `SECURITY_SCAN_REPORT.md` (أتمتة أو يدويًا).
   MINOR
   Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
MCP_SERVER_README.md

26

### Production Mode

26

### Production Mode

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY.md

1

# Security Policy

1

# Security Policy

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

frontend/src/app/(main)/cinematography-studio/
README.md

133

### Color Grading Suggestions

133

### Color Grading Suggestions

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_PROCESS.md

105

- Security scan results: [attached]
  105
- Security scan results: [attached]
  MEDIUM
  Error prone

Link fragments should be valid

SECURITY_SCAN_REPORT.md

147
| SEC-MED-005 | MEDIUM | Link fragments should be valid | `frontend/README.md` | 12 | [🚀 البدء السريع](#-البدء-السريع) • [📖 التوثيق](#-التوثيق) • [🧪 الاختبارات](#-الاختبارات) • [🚀 النشر](#-النشر) | Open |
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
BACKEND_DOCUMENTATION.md

102

### إعداد Winston Logger

102

### إعداد Winston Logger

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

136

### Final State Achieved

136

### Final State Achieved

MINOR
Best practice

Emphasis used instead of a heading

.github/agents/
my-agent.md

250
**Security**
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_FIXES.md

164

- ✅ auth.service.test.ts - 7 replacements
  164

165

- ✅ auth.service.test.ts - 7 replacements
  MINOR
  Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_PROCESS.md

7

- **Security Owner**: يقوم بالـ triage ويعين المالكين ويضبط الأولويات.
  7

8

- **Security Owner**: يقوم بالـ triage ويعين المالكين ويضبط الأولويات.
  MINOR
  Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_SUMMARY.md

81

- Patch file had non-standard format with multiple hunks per file
  81

82

- Patch file had non-standard format with multiple hunks per file
  MINOR
  Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
MCP_SERVER_README.md

43

### 1. MCP Inspector

43

### 1. MCP Inspector

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_PROCESS.md

99

- ✅ Unit tests added: `chart.test.tsx`
  99

100

- ✅ Unit tests added: `chart.test.tsx`
  MINOR
  Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
BACKEND_DOCUMENTATION.md

581

### مشاكل شائعة

581

### مشاكل شائعة

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
BACKEND_DOCUMENTATION.md

320

### وسطاء الأمان والتحقق

320

### وسطاء الأمان والتحقق

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

frontend/src/app/(main)/cinematography-studio/
README.md

173

### Adding New Tools

173

### Adding New Tools

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_PROCESS.md

3

## النطاق

3

## النطاق

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

frontend/src/app/(main)/directors-studio/
README.md

18

### 📅 Shooting Schedule - جدولة التصوير

18

### 📅 Shooting Schedule - جدولة التصوير

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

frontend/src/app/(main)/directors-studio/
README.md

9

### 📝 Script Analysis - تحليل السيناريو

9

### 📝 Script Analysis - تحليل السيناريو

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_PROCESS.md

39

### 3. ربط بلوحة المشروع

39

### 3. ربط بلوحة المشروع

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

12

### Phase 1: Automatic Patch Application (7 files)

12

### Phase 1: Automatic Patch Application (7 files)

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_PROCESS.md

104

- Screenshot: [before] vs [after]
  104

105

- Screenshot: [before] vs [after]
  MINOR
  Code style

Quick fix

Lists should be surrounded by blank lines

backend/
MCP_SERVER_README.md

103

- Session management
  103

104

- Session management
  MINOR
  Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_SUMMARY.md

44

- Trailing whitespace changes (non-functional)
  44

45

- Trailing whitespace changes (non-functional)
  MINOR
  Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

95

### Manual Fix Checklist

95

### Manual Fix Checklist

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

backend/
BACKEND_DOCUMENTATION.md

582

1. **خطأ اتصال Gemini API**: تحقق من مفتاح API
   582

583

1. **خطأ اتصال Gemini API**: تحقق من مفتاح API
   MINOR
   Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

159

### Total Changes Applied

159

### Total Changes Applied

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

frontend/src/app/(main)/cinematography-studio/
README.md

152

- React Router (SPA) → Migrated to Next.js App Router
  152

153

- React Router (SPA) → Migrated to Next.js App Router
  MINOR
  Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_FIXES.md

292

### Security Library Created

292

### Security Library Created

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_PROCESS.md

178

### صيغة الإدخال في SECURITY_FIXES.md

178

### صيغة الإدخال في SECURITY_FIXES.md

MINOR
Best practice

Emphasis used instead of a heading

.github/agents/
my-agent.md

226
**Type Safety**
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_SUMMARY.md

105

1. Open the file in an editor
   105

106

1. Open the file in an editor
   MINOR
   Best practice

Emphasis used instead of a heading

frontend/
README.md

461
**صُنع بـ ❤️ باستخدام Next.js و Google AI**
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_FIXES.md

24

### Fix Applied

24

### Fix Applied

MINOR
Best practice

Emphasis used instead of a heading

AGENTS.md

244
**Performance**
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_PROCESS.md

19

### 1. اكتشاف وتوثيق

19

### 1. اكتشاف وتوثيق

MINOR
Best practice

Emphasis used instead of a heading

AGENTS.md

250
**Security**
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
MCP_SERVER_README.md

59

### 4. Cursor

59

### 4. Cursor

MINOR
Best practice

Emphasis used instead of a heading

backend/
README.md

382
**صُنع بـ ❤️ باستخدام Express.js و Google AI**
MINOR
Code style

Expected: 1; Actual: 2

TODO.md

28
| 10 | PowerShell readonly variable misuse | تعديل المتغير `$pid` |
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
MCP_SERVER_README.md

20

### Development Mode (with auto-reload)

20

### Development Mode (with auto-reload)

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

165

### Commits

165

### Commits

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_PROCESS.md

28

### 2. تحويل إلى Issues

28

### 2. تحويل إلى Issues

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

backend/
MCP_SERVER_README.md

65

1. Ask the AI agent to add two numbers using the `add` tool
   65

66

1. Ask the AI agent to add two numbers using the `add` tool
   MINOR
   Code style

Expected: asterisk; Actual: dash

.github/agents/
my-agent.md

## 378

MINOR
Best practice

Element: div

frontend/
README.md

3

<div align="center">
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

.idx/
README.md

50

1. عدّل `dev.nix` لإضافة أدوات أو إضافات جديدة
   50

51

1. عدّل `dev.nix` لإضافة أدوات أو إضافات جديدة
   MINOR
   Best practice

Quick fix

Bare URL used

SECURITY_PROCESS.md

219

- **Repository**: <https://github.com/mohamedaminradyofficial/the-copy-monorepo>
  219
- **Repository**: <https://github.com/mohamedaminradyofficial/the-copy-monorepo>
  MINOR
  Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_PROCESS.md

201

1. استخدم GitHub Security → Report a vulnerability
   201

202

1. استخدم GitHub Security → Report a vulnerability
   MINOR
   Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_SUMMARY.md

89

1. ✅ Commit successfully applied changes (Phase 1)
   89

90

1. ✅ Commit successfully applied changes (Phase 1)
   MINOR
   Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

88

### Completed Actions

88

### Completed Actions

MINOR
Best practice

Emphasis used instead of a heading

SECURITY_FIXES.md

315
**TOTAL CRITICAL FIXES: 63**
MINOR
Best practice

Element: div

frontend/src/app/(main)/ui/
README.md

81

<div className="bg-state-alt">بديل</div>
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

36

### Phase 2 Commit

36

### Phase 2 Commit

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
BACKEND_DOCUMENTATION.md

134

### خدمة Gemini (services/gemini.service.ts)

134

### خدمة Gemini (services/gemini.service.ts)

MINOR
Best practice

Element: div

frontend/src/app/(main)/ui/
README.md

70

<div className="bg-bg text-text">
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_SUMMARY.md

129

- 8 files total modified (7 automatic + 1 manual)
  129

130

- 8 files total modified (7 automatic + 1 manual)
  MINOR
  Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_PROCESS.md

54

### 4. تنفيذ الإصلاحات

54

### 4. تنفيذ الإصلاحات

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
BACKEND_DOCUMENTATION.md

423

### مخططات Zod

423

### مخططات Zod

MINOR
Best practice

Emphasis used instead of a heading

.github/agents/
my-agent.md

232
**Error Handling**
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_PROCESS.md

171

- Code review مع focus على security hotspots
  171

172

- Code review مع focus على security hotspots
  MINOR
  Best practice

Element: div

backend/
README.md

3

<div align="center">
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

172

## References

172

## References

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
BACKEND_DOCUMENTATION.md

557

### مقاييس الأداء

557

### مقاييس الأداء

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

80

### Issues Encountered

80

### Issues Encountered

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
MCP_SERVER_README.md

49

### 2. Claude Code

49

### 2. Claude Code

MINOR
Best practice

Element: span

frontend/src/app/(main)/ui/
README.md

72
<span className="text-muted-text">نص مكتوم</span>
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

frontend/src/app/(main)/cinematography-studio/
README.md

206

- ✅ Uses shared UI components
  206

207

- ✅ Uses shared UI components
  MINOR
  Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
BACKEND_DOCUMENTATION.md

543

### أوامر النشر

543

### أوامر النشر

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_PROCESS.md

6

## الأدوار

6

## الأدوار

MEDIUM
Best practice

Multiple headings with the same content

SECURITY_FIXES.md

141

### Fix Applied

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_PROCESS.md

12

- **CRITICAL**: ظرف 48 ساعة كحد أقصى من وقت الاكتشاف.
  12

13

- **CRITICAL**: ظرف 48 ساعة كحد أقصى من وقت الاكتشاف.
  MINOR
  Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_FIXES.md

296

- `escapeHtml()` - Escapes HTML entities
  296

297

- `escapeHtml()` - Escapes HTML entities
  MINOR
  Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_SUMMARY.md

124

- Inconsistent Markdown list indentation across project
  124

125

- Inconsistent Markdown list indentation across project
  MINOR
  Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_SUMMARY.md

96

- [x] Review SECURITY_PROCESS.md for trailing whitespace - **No action needed (cosmetic)**
      96

97

- [x] Review SECURITY_PROCESS.md for trailing whitespace - **No action needed (cosmetic)**
      MINOR
      Code style

Expected: 1; Actual: 8; Style: 1/1/1

CODACY_FIX_SUMMARY.md

34 8. `frontend/TEXT_ONLY_PIPELINE.md` - Removed trailing colons from 12 level-4 headers
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
BACKEND_DOCUMENTATION.md

231

### متحكم التحليل (controllers/analysis.controller.ts)

231

### متحكم التحليل (controllers/analysis.controller.ts)

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

backend/
README.md

158

- `file`: ملف النص (PDF, DOCX, TXT)
  158

159

- `file`: ملف النص (PDF, DOCX, TXT)
  MINOR
  Best practice

Emphasis used instead of a heading

AGENTS.md

238
**Testing**
MINOR
Best practice

Emphasis used instead of a heading

.github/agents/
my-agent.md

238
**Testing**
MINOR
Best practice

Emphasis used instead of a heading

.github/agents/
my-agent.md

244
**Performance**
MEDIUM
Error prone

Link fragments should be valid

SECURITY_SCAN_REPORT.md

146
| SEC-MED-004 | MEDIUM | Link fragments should be valid | `backend/README.md` | 12 | [🚀 البدء السريع](#-البدء-السريع) • [📖 API التوثيق](#-api-التوثيق) • [🧪 الاختبارات](#-الاختبارات) • [🚀 النشر](#-النشر) | Open |
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_PROCESS.md

170

### Manual Reviews

170

### Manual Reviews

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

123

### Before Patch

123

### Before Patch

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
BACKEND_DOCUMENTATION.md

451

### إعدادات الأمان

451

### إعدادات الأمان

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_SUMMARY.md

13

1. `.idx/README.md` - List indentation fixes
   13

14

1. `.idx/README.md` - List indentation fixes
   MINOR
   Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_FIXES.md

71

- `escapeRegExp()` - Escapes special characters
  71

72

- `escapeRegExp()` - Escapes special characters
  MINOR
  Code style

Expected: asterisk; Actual: dash

AGENTS.md

## 378

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_SUMMARY.md

37

- **Commit Hash**: 483b8f6
  37

38

- **Commit Hash**: 483b8f6
  MINOR
  Best practice

Element: html

frontend/src/app/(main)/ui/
README.md

96

<html className="dark">
MINOR
Best practice

Emphasis used instead of a heading

frontend/
README.md

10
**منصة شاملة لتطوير تطبيقات الويب الإنتاجية مع قدرات الذكاء الاصطناعي وأدوات تحليل الدراما**
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

frontend/src/app/(main)/cinematography-studio/
README.md

180

1. Add API keys to `.env.local`
   180

181

1. Add API keys to `.env.local`
   MINOR
   Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
BACKEND_DOCUMENTATION.md

57

### الخادم الرئيسي (server.ts)

57

### الخادم الرئيسي (server.ts)

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

frontend/src/app/(main)/cinematography-studio/
README.md

178

### AI Integration

178

### AI Integration

MINOR
Best practice

Emphasis used instead of a heading

AGENTS.md

232
**Error Handling**
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_SUMMARY.md

22

- **Total Changes**: 19 insertions(+), 19 deletions(-)
  22

23

- **Total Changes**: 19 insertions(+), 19 deletions(-)
  MINOR
  Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_PROCESS.md

56

1. يُشير إلى Issue محدد باستخدام `Fixes #<issue-number>` أو `Closes #<issue-number>`
   56

57

1. يُشير إلى Issue محدد باستخدام `Fixes #<issue-number>` أو `Closes #<issue-number>`
   MINOR
   Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

21

### Changes Summary

21

### Changes Summary

MINOR
Best practice

Element: button

frontend/src/app/(main)/ui/
README.md

73
<button className="bg-accent-color text-bg">زر</button>
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_SUMMARY.md

160

- **Files Modified**: 8
  160

161

- **Files Modified**: 8
  MEDIUM
  Error prone

The Variable 'pid' cannot be assigned since it is a readonly automatic variable that is built into PowerShell, please use a different name.

kill-dev.ps1

12
foreach ($pid in $pids) {
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_PROCESS.md

103

### Evidence

103

### Evidence

MEDIUM
Best practice

File 'kill-dev.ps1' uses Write-Host. Avoid using Write-Host because it might not work in all hosts, does not work when there is no host, and (prior to PS 5.0) cannot be suppressed, captured, or redirected. Instead, use Write-Output, Write-Verbose, or Write-Information.

kill-dev.ps1

22
Write-Host "Done." -ForegroundColor Green
MINOR
Code style

Unexpected quotes around "Cairo" (font-family-name-quotes)

frontend/src/app/
globals.css

26
font-family: "Cairo";
MEDIUM
Security

Input Validation

subprocess call - check for execution of untrusted input.

scripts/
create_test_issues.py

232
result = subprocess.run(
MINOR
Code style

Expected "0.1" to be "10%" (alpha-value-notation)

frontend/src/app/
globals.css

147
--border: rgba(230, 234, 242, 0.1);
MINOR
Code style

Expected "#ffffff" to be "#fff" (color-hex-length)

frontend/src/app/
globals.css

146
--destructive-foreground: #ffffff;
MINOR
Code style

Expected "70.08" to be "70.08deg" (hue-degree-notation)

frontend/src/app/
globals.css

158
--chart-5: oklch(0.769 0.188 70.08);
MEDIUM
Security

Unexpected Behaviour

Try, Except, Pass detected.

scripts/
create_security_issues_direct.py

251
except:
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_SUMMARY.md

29

- **Commit Hash**: b010270
  29

30

- **Commit Hash**: b010270
  MINOR
  Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

13
--color-charcoal-800: rgba(38, 40, 40, 1);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

21
--color-red-400: rgba(255, 84, 89, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

13
--color-charcoal-800: rgba(38, 40, 40, 1);
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

frontend/src/app/(main)/cinematography-studio/
README.md

174

1. Create tool component in `components/tools/`
   174

175

1. Create tool component in `components/tools/`
   MINOR
   Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_SUMMARY.md

173

- Original patch: `codacy-fix.patch` (520 lines)
  173

174

- Original patch: `codacy-fix.patch` (520 lines)
  MINOR
  Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

6
--color-cream-100: rgba(255, 255, 253, 1);
MEDIUM
Best practice

File 'start-dev.ps1' uses Write-Host. Avoid using Write-Host because it might not work in all hosts, does not work when there is no host, and (prior to PS 5.0) cannot be suppressed, captured, or redirected. Instead, use Write-Output, Write-Verbose, or Write-Information.

start-dev.ps1

22
Write-Host "Backend starting from port $BackendPort; Frontend starting from port $FrontendPort" -ForegroundColor Green
HIGH
Security

Command Injection

subprocess call with shell=True identified, security issue.

scripts/
parse_create_issues.py

30
cmd, shell=True, capture_output=True, text=True, encoding="utf-8"
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

10
--color-slate-500: rgba(98, 108, 113, 1);
MINOR
Best practice

Element: div

frontend/src/app/(main)/ui/
README.md

79

<div className="bg-state-draft">مسودة</div>
MINOR
Code style

Expected "84.429" to be "84.429deg" (hue-degree-notation)

frontend/src/app/
globals.css

157
--chart-4: oklch(0.828 0.189 84.429);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/
globals.css

166
--sidebar-border: rgba(230, 234, 242, 0.1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

5
--color-cream-50: rgba(252, 252, 249, 1);
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_PROCESS.md

11

## SLA (Service Level Agreement)

11

## SLA (Service Level Agreement)

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

frontend/src/app/(main)/directors-studio/
README.md

24

### 🎯 Director's Vision Board - رؤية المخرج

24

### 🎯 Director's Vision Board - رؤية المخرج

MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

5
--color-cream-50: rgba(252, 252, 249, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

22
--color-red-500: rgba(192, 21, 47, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

19
--color-teal-700: rgba(26, 104, 115, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

23
--color-orange-400: rgba(230, 129, 97, 1);
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
MCP_SERVER_README.md

54

### 3. VS Code

54

### 3. VS Code

MEDIUM
Security

Unexpected Behaviour

Try, Except, Pass detected.

scripts/
create_test_issues.py

242
except:
MEDIUM
Best practice

Multiple headings with the same content

SECURITY_FIXES.md

60

### Vulnerability

MINOR
Best practice

Element: div

frontend/src/app/(main)/ui/
README.md

82

<div className="bg-state-flagged">مُعلّم</div>
MINOR
Security

Command Injection

Consider possible security implications associated with the subprocess module.

scripts/
create_security_issues_direct.py

236
import subprocess
MEDIUM
Error prone

Link fragments should be valid

frontend/
README.md

12
[🚀 البدء السريع](#-البدء-السريع) • [📖 التوثيق](#-التوثيق) • [🧪 الاختبارات](#-الاختبارات) • [🚀 النشر](#-النشر)
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

frontend/src/app/(main)/directors-studio/
README.md

12

### 🎭 Actor Management - إدارة الممثلين

12

### 🎭 Actor Management - إدارة الممثلين

MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

16
--color-teal-400: rgba(45, 166, 178, 1);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

20
--color-teal-800: rgba(41, 150, 161, 1);
MINOR
Best practice

Element: html

frontend/src/app/(main)/ui/
README.md

116

<html lang="ar" dir="rtl">
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

7
--color-gray-200: rgba(245, 245, 245, 1);
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

151

## Related Documentation

151

## Related Documentation

MEDIUM
Security

Input Validation

subprocess call - check for execution of untrusted input.

scripts/
create_security_issues_direct.py

238
result = subprocess.run(
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

14
--color-slate-900: rgba(19, 52, 59, 1);
MINOR
Code style

Expected "184.704" to be "184.704deg" (hue-degree-notation)

frontend/src/app/
globals.css

155
--chart-2: oklch(0.6 0.118 184.704);
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
BACKEND_DOCUMENTATION.md

482

### إعداد الاختبارات

482

### إعداد الاختبارات

MINOR
Code style

Expected: 1; Actual: 2

TODO.md

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_SUMMARY.md

166

1. **b010270** - Phase 1: Automatic patch application (7 files)
   166

167

1. **b010270** - Phase 1: Automatic patch application (7 files)
   MINOR
   Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

103

### Recommended Approach for Manual Fixes

103

### Recommended Approach for Manual Fixes

MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

3
--color-white: rgba(255, 255, 255, 1);
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
BACKEND_DOCUMENTATION.md

376

### تحميل ومعالجة الملفات

376

### تحميل ومعالجة الملفات

MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

16
--color-teal-400: rgba(45, 166, 178, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

12
--color-charcoal-700: rgba(31, 33, 33, 1);
MINOR
Best practice

Element: div

frontend/src/app/(main)/ui/
README.md

80

<div className="bg-state-final">نهائي</div>
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
BACKEND_DOCUMENTATION.md

300

### إعداد المسارات

300

### إعداد المسارات

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_SUMMARY.md

152

- `.github/ISSUE_TEMPLATE/security-finding.yml` - Security issue template
  152

153

- `.github/ISSUE_TEMPLATE/security-finding.yml` - Security issue template
  MINOR
  Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

28

### Phase 1 Commit

28

### Phase 1 Commit

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

.idx/
README.md

42

1. تشغيل سكريبت الإعداد
   42

43

1. تشغيل سكريبت الإعداد
   MINOR
   Code style

Expected "0.1" to be "10%" (alpha-value-notation)

frontend/src/app/
globals.css

166
--sidebar-border: rgba(230, 234, 242, 0.1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

37
--color-bg-1: rgba(59, 130, 246, 0.08); /_ Light blue _/
MEDIUM
Best practice

Empty catch block is used. Please use Write-Error or throw statements in catch blocks.

kill-dev.ps1

16
} catch {}
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_PROCESS.md

43

- **Critical Fixes** - ثغرات حرجة تمنع الدمج
  43

44

- **Critical Fixes** - ثغرات حرجة تمنع الدمج
  MEDIUM
  Best practice

File 'kill-dev.ps1' uses Write-Host. Avoid using Write-Host because it might not work in all hosts, does not work when there is no host, and (prior to PS 5.0) cannot be suppressed, captured, or redirected. Instead, use Write-Output, Write-Verbose, or Write-Information.

kill-dev.ps1

5
Write-Host "Killing listeners on ports: $($Ports -join ', ')" -ForegroundColor Yellow
MEDIUM
Best practice

Unknown rule scss_function-disallowed-list. Did you mean function-disallowed-list?

frontend/src/app/
globals.css

1
/_ Production-optimized font loading - CSP compliant _/
MINOR
Security

Command Injection

Consider possible security implications associated with the subprocess module.

scripts/
create_test_issues.py

230
import subprocess
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

14
--color-slate-900: rgba(19, 52, 59, 1);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

24
--color-orange-500: rgba(168, 75, 47, 1);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

7
--color-gray-200: rgba(245, 245, 245, 1);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

8
--color-gray-300: rgba(167, 169, 169, 1);
MINOR
Best practice

Emphasis used instead of a heading

SECURITY_SCAN_REPORT.md

3
_Generated on 2025-11-03 11:11:03 UTC_
MEDIUM
Security

File Access

Audit url open for permitted schemes. Allowing use of file:/ or custom schemes is often unexpected.

scripts/
create_test_issues.py

58
with request.urlopen(req) as response:
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/
globals.css

148
--input: rgba(230, 234, 242, 0.1);
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

frontend/src/app/(main)/directors-studio/
README.md

15

### 🎨 Storyboard Creator - لوحة القصة

15

### 🎨 Storyboard Creator - لوحة القصة

MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

24
--color-orange-500: rgba(168, 75, 47, 1);
MINOR
Code style

Expected "0.08" to be "8%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

39
--color-bg-3: rgba(34, 197, 94, 0.08); /_ Light green _/
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

19
--color-teal-700: rgba(26, 104, 115, 1);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

3
--color-white: rgba(255, 255, 255, 1);
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

128

### After Patch (Complete)

128

### After Patch (Complete)

MEDIUM
Best practice

File 'kill-dev.ps1' uses Write-Host. Avoid using Write-Host because it might not work in all hosts, does not work when there is no host, and (prior to PS 5.0) cannot be suppressed, captured, or redirected. Instead, use Write-Output, Write-Verbose, or Write-Information.

kill-dev.ps1

14
Write-Host "Stopping PID $pid (port $p)" -ForegroundColor Cyan
MINOR
Code style

Expected "0.1" to be "10%" (alpha-value-notation)

frontend/src/app/
globals.css

148
--input: rgba(230, 234, 242, 0.1);
MINOR
Code style

Expected "41.116" to be "41.116deg" (hue-degree-notation)

frontend/src/app/
globals.css

154
--chart-1: oklch(0.646 0.222 41.116);
MINOR
Best practice

Emphasis used instead of a heading

AGENTS.md

226
**Type Safety**
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

6
--color-cream-100: rgba(255, 255, 253, 1);
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_SUMMARY.md

7

## Overview

7

## Overview

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

backend/
BACKEND_DOCUMENTATION.md

165

### خدمة التحليل (services/analysis.service.ts)

165

### خدمة التحليل (services/analysis.service.ts)

MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

17
--color-teal-500: rgba(33, 128, 141, 1);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

18
--color-teal-600: rgba(29, 116, 128, 1);
MINOR
Best practice

Element: div

frontend/src/app/(main)/ui/
README.md

71

  <div className="bg-panel border border-surface">
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/
globals.css

147
--border: rgba(230, 234, 242, 0.1);
MINOR
Security

Command Injection

Consider possible security implications associated with the subprocess module.

scripts/
parse_create_issues.py

13
import subprocess
MEDIUM
Security

File Access

Audit url open for permitted schemes. Allowing use of file:/ or custom schemes is often unexpected.

scripts/
create_security_issues_direct.py

59
with request.urlopen(req) as response:
MEDIUM
Best practice

File 'start-dev.ps1' uses Write-Host. Avoid using Write-Host because it might not work in all hosts, does not work when there is no host, and (prior to PS 5.0) cannot be suppressed, captured, or redirected. Instead, use Write-Output, Write-Verbose, or Write-Information.

start-dev.ps1

8
Write-Host "Launching Backend and Frontend in separate PowerShell windows..." -ForegroundColor Yellow
MEDIUM
Security

Insecure Modules Libraries

Insecure dependency npm/esbuild@0.18.20 (GHSA-67mh-4wv8-2f99: esbuild enables any website to send any requests to the development server and read the response) (update to 0.25.0)

backend/
package-lock.json

480
"node_modules/@esbuild-kit/core-utils/node_modules/esbuild": {
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

backend/
MCP_SERVER_README.md

97

1. Add more tools in `mcp-server.ts` using `server.registerTool()`
   97

98

1. Add more tools in `mcp-server.ts` using `server.registerTool()`
   MINOR
   Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

17
--color-teal-500: rgba(33, 128, 141, 1);
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

frontend/src/app/(main)/cinematography-studio/
README.md

119

### Generate Shot List

119

### Generate Shot List

MEDIUM
Best practice

Unknown rule scss_function-disallowed-list. Did you mean function-disallowed-list?

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

1
:root {
MINOR
Code style

Expected empty line before comment (comment-empty-line-before)

frontend/src/app/
globals.css

2
/_ Fonts are loaded locally to comply with CSP headers _/
MINOR
Code style

Expected "227.392" to be "227.392deg" (hue-degree-notation)

frontend/src/app/
globals.css

156
--chart-3: oklch(0.398 0.07 227.392);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

15
--color-teal-300: rgba(50, 184, 198, 1);
MINOR
Code style

Expected "0.25" to be "25%" (alpha-value-notation)

frontend/src/app/
slider.css

36
border: 2px solid rgba(255, 255, 255, 0.25);
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/
slider.css

36
border: 2px solid rgba(255, 255, 255, 0.25);
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

scripts/
README.md

125

- Creates GitHub Project (v2) if it doesn't exist
  125

126

- Creates GitHub Project (v2) if it doesn't exist
  MINOR
  Code style

Quick fix

Lists should be surrounded by blank lines

scripts/
README.md

232

1. Exists in repository root
   232

233

1. Exists in repository root
   MINOR
   Code style

Expected "0.08" to be "8%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

38
--color-bg-2: rgba(245, 158, 11, 0.08); /_ Light yellow _/
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

22
--color-red-500: rgba(192, 21, 47, 1);
HIGH
Security

Insecure Modules Libraries

An action sourced from a third-party repository on GitHub is not pinned to a full length commit SHA. Pinning an action to a full length commit SHA is currently the only way to use an action as an immutable release.

.github/workflows/
codeguru-reviewer.yml

33
uses: aws-actions/configure-aws-credentials@v4
MINOR
Code style

Unexpected quotes around "Literata" (font-family-name-quotes)

frontend/src/app/
globals.css

41
font-family: "Literata";
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

10
--color-slate-500: rgba(98, 108, 113, 1);
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_COMPLETED.md

45

- `frontend/TEXT_ONLY_PIPELINE.md` (12 header formatting fixes)
  45

46

- `frontend/TEXT_ONLY_PIPELINE.md` (12 header formatting fixes)
  MINOR
  Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_BEST_PRACTICES.md

356

### 5. Unvalidated Redirects

356

### 5. Unvalidated Redirects

MEDIUM
Code complexity

Method buildPrompt has a cyclomatic complexity of 13 (limit is 8)

frontend/src/lib/drama-analyst/agents/dialogueForensics/
DialogueForensicsAgent.ts

37
protected buildPrompt(input: StandardAgentInput): string {
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

scripts/
README.md

72

- Python 3.7+ (standard library only, no external dependencies)
  72

73

- Python 3.7+ (standard library only, no external dependencies)
  MEDIUM
  Code complexity

Method CharacterFormDialog has a cyclomatic complexity of 11 (limit is 8)

frontend/src/app/(main)/directors-studio/components/
CharacterFormDialog.tsx

21
export default function CharacterFormDialog({
MINOR
Best practice

Emphasis used instead of a heading

CODACY_FIX_COMPLETED.md

23
**Total: 13 files modified, 37 lines changed, 5 commits**
MEDIUM
Code complexity

Method exportToTextFile has 67 lines of code (limit is 50)

frontend/src/components/
agent-report-viewer.tsx

45
function exportToTextFile(content: string, filename: string): void {
MINOR
Code style

Expected: 4; Actual: 3; Style: 1/2/3

CODACY_FIX_COMPLETED.md

67 3. **Line Endings**
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_COMPLETED.md

94

- `CODACY_FIX_SUMMARY.md` - Comprehensive analysis and documentation for first patch
  94

95

- `CODACY_FIX_SUMMARY.md` - Comprehensive analysis and documentation for first patch
  MINOR
  Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

8
--color-gray-300: rgba(167, 169, 169, 1);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

11
--color-brown-600: rgba(94, 82, 64, 1);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

9
--color-gray-400: rgba(119, 124, 124, 1);
MEDIUM
Code complexity

Method updateScene has 60 lines of code (limit is 50)

backend/src/controllers/
scenes.controller.ts

190
async updateScene(req: AuthRequest, res: Response): Promise<void> {
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

scripts/
README.md

98

- No external dependencies (uses Python standard library)
  98

99

- No external dependencies (uses Python standard library)
  MEDIUM
  Code complexity

Method decodeRecord has a cyclomatic complexity of 10 (limit is 8)

frontend/src/lib/utils/
text-protocol.ts

62
export function decodeRecord(text: string): Record<string, string> {
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_BEST_PRACTICES.md

322

### 2. Cross-Site Scripting (XSS)

322

### 2. Cross-Site Scripting (XSS)

MEDIUM
Code complexity

Method postProcessFormatting has a cyclomatic complexity of 20 (limit is 8)

frontend/src/app/(main)/editor/
screenplay-editor.tsx

1065
const postProcessFormatting = (htmlResult: string): string => {
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

scripts/
README.md

94

- `GITHUB_TOKEN` - GitHub Personal Access Token
  94

95

- `GITHUB_TOKEN` - GitHub Personal Access Token
  MINOR
  Code style

Expected: 1; Actual: 2; Style: 1/1/1

frontend/src/app/(main)/arabic-creative-writing-studio/
README.md

73 2. Set up environment variables:
MEDIUM
Code complexity

Method validateEnvironment has 55 lines of code (limit is 50)

frontend/src/
env.ts

43
function validateEnvironment() {
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

scripts/
README.md

108

- GitHub CLI (`gh`) installed and authenticated
  108

109

- GitHub CLI (`gh`) installed and authenticated
  MEDIUM
  Code complexity

Method processFile has a cyclomatic complexity of 13 (limit is 8)

frontend/src/lib/drama-analyst/services/
fileReaderService.ts

53
async function processFile(file: File): Promise<ProcessedFile | null> {
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

frontend/src/app/(main)/arabic-creative-writing-studio/
README.md

94

#### Unit Tests (Vitest)

94

#### Unit Tests (Vitest)

MEDIUM
Code complexity

Method _global_ has 174 lines of code (limit is 50)

frontend/src/components/
stations-pipeline.tsx

1
"use client";
MEDIUM
Best practice

Unknown rule scss_function-disallowed-list. Did you mean function-disallowed-list?

frontend/src/app/
slider.css

1
/_ Global reset _/
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

4
--color-black: rgba(0, 0, 0, 1);
MINOR
Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

4
--color-black: rgba(0, 0, 0, 1);
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

scripts/
README.md

307

1. Follow existing naming conventions
   307

308

1. Follow existing naming conventions
   MINOR
   Code style

Expected empty line before comment (comment-empty-line-before)

frontend/src/app/
globals.css

3
/_ Use the fontOptimizer service to generate font-face declarations _/
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

9
--color-gray-400: rgba(119, 124, 124, 1);
MINOR
Code style

Expected: 1; Actual: 2; Style: 1/1/1

frontend/src/app/(main)/actorai-arabic/
README.md

122 2. Using Tailwind's RTL utilities (e.g., `space-x-reverse`)
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

frontend/src/app/(main)/arabic-creative-writing-studio/
README.md

99

#### E2E Tests (Playwright)

99

#### E2E Tests (Playwright)

MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

15
--color-teal-300: rgba(50, 184, 198, 1);
MEDIUM
Code complexity

Method (anonymous) has 65 lines of code (limit is 50)

frontend/src/lib/drama-analyst/agents/rhythmMapping/
RhythmMappingAgent.test.ts

46
it("should execute rhythm mapping task successfully", async () => {
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

frontend/src/app/(main)/arabic-creative-writing-studio/
README.md

115

- **URL**: `/arabic-creative-writing-studio`
  115

116

- **URL**: `/arabic-creative-writing-studio`
  MINOR
  Code style

Quick fix

Lists should be surrounded by blank lines

frontend/src/app/(main)/arabic-creative-writing-studio/
README.md

79 3. Run development server:
79 3. Run development server:
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_COMPLETED.md

47

### Second Patch Fixes (5 files)

47

### Second Patch Fixes (5 files)

MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

11
--color-brown-600: rgba(94, 82, 64, 1);
MEDIUM
Code complexity

Method postProcessFormatting has 60 lines of code (limit is 50)

frontend/src/app/(main)/editor/
screenplay-editor.tsx

1065
const postProcessFormatting = (htmlResult: string): string => {
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_COMPLETED.md

12

- ✅ **8 files** modified
  12

13

- ✅ **8 files** modified
  MINOR
  Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

12
--color-charcoal-700: rgba(31, 33, 33, 1);
MINOR
Code style

Expected: 1; Actual: 3; Style: 1/1/1

frontend/src/app/(main)/arabic-creative-writing-studio/
README.md

79 3. Run development server:
MINOR
Code style

Quick fix

Punctuation: ':'

SECURITY_BEST_PRACTICES.md

68

### Immediate Actions (within 5 minutes):

68

### Immediate Actions (within 5 minutes)

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_BEST_PRACTICES.md

412

- [ ] Run `npm audit` and fix vulnerabilities
      412

413

- [ ] Run `npm audit` and fix vulnerabilities
      MINOR
      Code style

Quick fix

Lists should be surrounded by blank lines

frontend/src/app/(main)/arabic-creative-writing-studio/
README.md

129

- `react` ^18.2.0
  129

130

- `react` ^18.2.0
  MINOR
  Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_BEST_PRACTICES.md

338

### 4. Insecure Direct Object References

338

### 4. Insecure Direct Object References

MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_BEST_PRACTICES.md

313

### 1. SQL Injection

313

### 1. SQL Injection

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_BEST_PRACTICES.md

407

- [ ] Review Dependabot alerts
      407

408

- [ ] Review Dependabot alerts
      MEDIUM
      Code complexity

Method renderDashboard has 89 lines of code (limit is 50)

frontend/src/app/(main)/actorai-arabic/components/
ActorAiArabicStudio.tsx

301
);
MINOR
Code style

Expected "0.08" to be "8%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

37
--color-bg-1: rgba(59, 130, 246, 0.08); /_ Light blue _/
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_COMPLETED.md

35

### Automatic Fixes (7 files)

35

### Automatic Fixes (7 files)

MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

38
--color-bg-2: rgba(245, 158, 11, 0.08); /_ Light yellow _/
MINOR
Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_BEST_PRACTICES.md

417

### Quarterly

417

### Quarterly

MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

18
--color-teal-600: rgba(29, 116, 128, 1);
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

frontend/src/app/(main)/arabic-creative-writing-studio/
README.md

73 2. Set up environment variables:
73 2. Set up environment variables:
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_COMPLETED.md

48

- `SECURITY_BEST_PRACTICES.md` (header colon removal)
  48

49

- `SECURITY_BEST_PRACTICES.md` (header colon removal)
  MINOR
  Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_BEST_PRACTICES.md

411

### Monthly

411

### Monthly

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_BEST_PRACTICES.md

418

- [ ] Full security audit with external tools
      418

419

- [ ] Full security audit with external tools
      MINOR
      Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_COMPLETED.md

36

- `.idx/README.md`
  36

37

- `.idx/README.md`
  MINOR
  Best practice

Quick fix

Bare URL used

SECURITY_BEST_PRACTICES.md

87

- GitHub tokens: https://github.com/settings/tokens
  87
- GitHub tokens: <https://github.com/settings/tokens>
  MINOR
  Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

21
--color-red-400: rgba(255, 84, 89, 1);
MINOR
Code style

Expected: 1; Actual: 4; Style: 1/1/1

frontend/src/app/(main)/arabic-creative-writing-studio/
README.md

84 4. Access the page at: `http://localhost:3000/arabic-creative-writing-studio`
MEDIUM
Code complexity

Method animate has 147 lines of code (limit is 50)

frontend/src/components/
particle-background.tsx

713
const animate = () => {
MINOR
Code style

Unexpected quotes around "Amiri" (font-family-name-quotes)

frontend/src/app/
globals.css

11
font-family: "Amiri";
MEDIUM
Code complexity

Method categorizeError has a cyclomatic complexity of 14 (limit is 8)

frontend/src/lib/drama-analyst/services/
errorHandler.ts

260
private categorizeError(error: Error | unknown): ErrorType {
HIGH
Security

Insecure Modules Libraries

An action sourced from a third-party repository on GitHub is not pinned to a full length commit SHA. Pinning an action to a full length commit SHA is currently the only way to use an action as an immutable release.

.github/workflows/
codeguru-reviewer.yml

39
uses: aws-actions/codeguru-reviewer@v1.1
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_BEST_PRACTICES.md

100

- GitHub Personal Access Tokens
  100

101

- GitHub Personal Access Tokens
  MEDIUM
  Code complexity

Method getShot has 55 lines of code (limit is 50)

backend/src/controllers/
shots.controller.ts

89
async getShot(req: AuthRequest, res: Response): Promise<void> {
MEDIUM
Code complexity

File frontend/src/lib/ai/stations/station5-dynamic-symbolic-stylistic.ts has 1316 non-comment lines of code

frontend/src/lib/ai/stations/
station5-dynamic-symbolic-stylistic.ts

1
import { BaseStation, type StationConfig } from "../core/pipeline/base-station";
MINOR
Code style

Expected modern color-function notation (color-function-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

20
--color-teal-800: rgba(41, 150, 161, 1);
MEDIUM
Code complexity

Method buildPrompt has a cyclomatic complexity of 15 (limit is 8)

frontend/src/lib/drama-analyst/agents/characterNetwork/
CharacterNetworkAgent.ts

38
protected buildPrompt(input: StandardAgentInput): string {
MEDIUM
Code complexity

Method (anonymous) has a cyclomatic complexity of 10 (limit is 8)

frontend/src/lib/drama-analyst/orchestration/
orchestration.ts

419
configuredAgents.forEach((agentId) => {
MEDIUM
Code complexity

Method generateText has a cyclomatic complexity of 10 (limit is 8)

frontend/src/lib/ai/interfaces/
gemini-service-boundary.ts

88
async generateText(prompt, options = {}) {
MEDIUM
Code complexity

Method loadAgentConfig has 82 lines of code (limit is 50)

frontend/src/lib/drama-analyst/agents/
index.ts

5
export const loadAgentConfig = async (taskType: TaskType) => {
MINOR
Code style

Quick fix

Punctuation: ':'

SECURITY_BEST_PRACTICES.md

25

### ✅ What to do instead:

25

### ✅ What to do instead

MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_COMPLETED.md

18

- ✅ **5 additional files** modified
  18

19

- ✅ **5 additional files** modified
  MINOR
  Code style

Expected "1" to be "100%" (alpha-value-notation)

frontend/src/app/(main)/actorai-arabic/static-source/
style.css

23
--color-orange-400: rgba(230, 129, 97, 1);
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

frontend/src/app/(main)/arabic-creative-writing-studio/
README.md

67

1. Install dependencies:
   67
1. Install dependencies:
   MEDIUM
   Code complexity

Method buildPrompt has a cyclomatic complexity of 11 (limit is 8)

frontend/src/lib/drama-analyst/agents/adaptiveRewriting/
AdaptiveRewritingAgent.ts

39
protected buildPrompt(input: StandardAgentInput): string {
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_BEST_PRACTICES.md

380

1. GitHub Security → Report a vulnerability
   380

381

1. GitHub Security → Report a vulnerability
   MINOR
   Code style

Quick fix

Lists should be surrounded by blank lines

frontend/src/app/(main)/arabic-creative-writing-studio/
README.md

107

- **Tailwind CSS**: Utility-first CSS framework
  107

108

- **Tailwind CSS**: Utility-first CSS framework
  MINOR
  Code style

Quick fix

Expected: 1; Actual: 0; Below

CODACY_FIX_COMPLETED.md

44

### Manual Fixes (1 file)

44

### Manual Fixes (1 file)

MEDIUM
Code complexity

Method initializeRules has 77 lines of code (limit is 50)

frontend/src/lib/drama-analyst/orchestration/
constitutionalAI.ts

23
private initializeRules(): ConstitutionalRule[] {
MEDIUM
Code complexity

Method parseConflictsFromText has a cyclomatic complexity of 32 (limit is 8)

frontend/src/lib/ai/stations/
station3-network-builder.ts

590
private parseConflictsFromText(
MINOR
Code style

Quick fix

Lists should be surrounded by blank lines

CODACY_FIX_COMPLETED.md

73

- `SECURITY_PROCESS.md` - Cosmetic trailing whitespace only
  73

74

- `SECURITY_PROCESS.md` - Cosmetic trailing whitespace only
  MINOR
  Code style

Quick fix

Lists should be surrounded by blank lines

SECURITY_BEST_PRACTICES.md

288

- Automatically scans commits for secrets
  288

289

- Automatically scans commits for secrets
  MINOR
  Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_BEST_PRACTICES.md

406

### Weekly

406

### Weekly

MINOR
Best practice

Quick fix

Bare URL used

SECURITY_BEST_PRACTICES.md

387

- **Repository**: https://github.com/mohamedaminradyofficial/the-copy
  387
- **Repository**: <https://github.com/mohamedaminradyofficial/the-copy>
  MINOR
  Code style

Quick fix

Expected: 1; Actual: 0; Below

SECURITY_BEST_PRACTICES.md

331

### 3. Cross-Site Request Forgery (CSRF)

331

### 3. Cross-Site Request Forgery (CSRF)

MEDIUM
Code complexity

Method (anonymous) has 73 lines of code (limit is 50)

frontend/src/app/(main)/actorai-arabic/components/
ActorAiArabicStudio.tsx

90
size="lg"
MINOR
Code style

do not use bare 'except' (E722)

scripts/
create_test_issues.py

66
except:
MEDIUM
Code complexity

Method SceneCard has 11 parameters (limit is 8)

frontend/src/app/(main)/ui/components/
SceneCard.tsx

33
export function SceneCard({
MEDIUM
Code complexity

Method _global_ has a cyclomatic complexity of 10 (limit is 8)

frontend/src/components/
agent-report-viewer.tsx

1
"use client";
MEDIUM
Code complexity

File frontend/src/lib/ai/stations/station6-diagnostics-treatment.ts has 935 non-comment lines of code

frontend/src/lib/ai/stations/
station6-diagnostics-treatment.ts

1
import { GeminiService } from "./gemini-service";
HIGH
Error prone

local variable 'summary_col' is assigned to but never used (F841)

scripts/
parse_create_issues.py

139
summary_col = None
MEDIUM
Code complexity

File frontend/src/lib/ai/stations/station7-finalization.ts has 1141 non-comment lines of code

frontend/src/lib/ai/stations/
station7-finalization.ts

1
import { BaseStation, type StationConfig } from "../core/pipeline/base-station";
HIGH
Error prone

f-string is missing placeholders (F541)

scripts/
create_test_issues.py

323
print(f"Creating issues...")
MEDIUM
Code complexity

File frontend/src/lib/ai/stations/station1-text-analysis.ts has 898 non-comment lines of code

frontend/src/lib/ai/stations/
station1-text-analysis.ts

1
import { BaseStation, StationInput, StationOptions } from "./base-station";
MEDIUM
Code complexity

Method ? has 106 lines of code (limit is 50)

frontend/src/app/(main)/ui/pages/
BrainstormPage.tsx

MEDIUM
Code complexity

Method loadAgentConfig has a cyclomatic complexity of 28 (limit is 8)

frontend/src/lib/drama-analyst/agents/
index.ts

5
export const loadAgentConfig = async (taskType: TaskType) => {
MEDIUM
Code complexity

Method DirectorsStudio has 79 lines of code (limit is 50)

frontend/src/app/(main)/directors-studio/components/
DirectorsStudio.tsx

8
export const DirectorsStudio: React.FC = () => {
MEDIUM
Code complexity

File frontend/src/lib/drama-analyst/agents/shared/standardAgentPattern.ts has 532 non-comment lines of code

frontend/src/lib/drama-analyst/agents/shared/
standardAgentPattern.ts

1
/\*\*
MEDIUM
Code complexity

Method handleKeyDown has a cyclomatic complexity of 32 (limit is 8)

frontend/src/app/(main)/editor/
screenplay-editor.tsx

978
const handleKeyDown = (e: React.KeyboardEvent) => {
MEDIUM
Code complexity

Method (anonymous) has a cyclomatic complexity of 14 (limit is 8)

frontend/src/lib/drama-analyst/services/
webVitalsService.ts

715
metrics.forEach((metric) => {
MEDIUM
Code complexity

Method return has 51 lines of code (limit is 50)

frontend/src/components/
ErrorBoundary.tsx

65
return (
MEDIUM
Code complexity

Method createShot has 62 lines of code (limit is 50)

backend/src/controllers/
shots.controller.ts

155
async createShot(req: AuthRequest, res: Response): Promise<void> {
MEDIUM
Code complexity

Method constructor has a cyclomatic complexity of 31 (limit is 8)

frontend/src/lib/ai/stations/
run-all-stations.ts

64
constructor(config: AnalysisPipelineConfig) {
MEDIUM
Code complexity

Method (anonymous) has a cyclomatic complexity of 9 (limit is 8)

frontend/src/lib/drama-analyst/orchestration/
orchestration.ts

455
agents.forEach((agent, agentId) => {
MEDIUM
Code complexity

Method CinematographyStudio has 73 lines of code (limit is 50)

frontend/src/app/(main)/cinematography-studio/components/
CinematographyStudio.tsx

8
export const CinematographyStudio: React.FC = () => {
MEDIUM
Code complexity

Method cleanedText.replace has 51 lines of code (limit is 50)

frontend/src/lib/drama-analyst/agents/plotPredictor/
PlotPredictorAgent.ts

98
cleanedText = cleanedText.replace(/\{[\s\S]_?"[^"]_"\s*:[\s\S]*?\}/g, "");
MEDIUM
Code complexity

Method isLikelyAction has a cyclomatic complexity of 22 (limit is 8)

frontend/src/app/(main)/editor/
screenplay-editor.tsx

254
static isLikelyAction(line: string): boolean {
MEDIUM
Code complexity

Method (anonymous) has 58 lines of code (limit is 50)

frontend/src/lib/drama-analyst/orchestration/
agentFactory.test.ts

5
vi.mock("@agents/index", () => ({
MEDIUM
Code complexity

Method constructor has a cyclomatic complexity of 13 (limit is 8)

frontend/src/lib/ai/stations/
orchestrator.ts

97
constructor(config: OrchestrationConfig) {
MEDIUM
Code complexity

File frontend/src/lib/ai/stations/network-diagnostics.ts has 525 non-comment lines of code

frontend/src/lib/ai/stations/
network-diagnostics.ts

1
import {
MEDIUM
Code complexity

Method buildPrompt has a cyclomatic complexity of 15 (limit is 8)

frontend/src/lib/drama-analyst/agents/rhythmMapping/
RhythmMappingAgent.ts

38
protected buildPrompt(input: StandardAgentInput): string {
MEDIUM
Code complexity

Method sanitizeFileName has 174 lines of code (limit is 50)

frontend/src/lib/drama-analyst/services/
sanitizationService.ts

52
\*/
MEDIUM
Code complexity

Method _global_ has a cyclomatic complexity of 21 (limit is 8)

frontend/src/components/
station-card.tsx

1
"use client";
MEDIUM
Code complexity

File frontend/src/components/particle-background.tsx has 807 non-comment lines of code

frontend/src/components/
particle-background.tsx

1
"use client";
MEDIUM
Code complexity

Method executeStandardAgentPattern has a cyclomatic complexity of 9 (limit is 8)

frontend/src/lib/drama-analyst/agents/shared/
standardAgentPattern.ts

491
export async function executeStandardAgentPattern(
MEDIUM
Code complexity

Method DebateView has 51 lines of code (limit is 50)

frontend/src/app/(main)/ui/components/
DebateView.tsx

51
export function DebateView({
MEDIUM
Code complexity

Method (anonymous) has 67 lines of code (limit is 50)

frontend/src/lib/drama-analyst/agents/tensionOptimizer/
TensionOptimizerAgent.test.ts

46
it("should execute tension optimization task successfully", async () => {
MEDIUM
Code complexity

Method handlePaste has a cyclomatic complexity of 25 (limit is 8)

frontend/src/app/(main)/editor/
screenplay-editor.tsx

1153
const handlePaste = (e: React.ClipboardEvent) => {
MEDIUM
Code complexity

File frontend/src/lib/drama-analyst/services/webVitalsService.ts has 638 non-comment lines of code

frontend/src/lib/drama-analyst/services/
webVitalsService.ts

1
// Web Vitals Service for Drama Analyst
MEDIUM
Code complexity

Method buildPrompt has a cyclomatic complexity of 15 (limit is 8)

frontend/src/lib/drama-analyst/agents/tensionOptimizer/
TensionOptimizerAgent.ts

38
protected buildPrompt(input: StandardAgentInput): string {
MINOR
Code style

do not use bare 'except' (E722)

scripts/
create_security_issues_direct.py

251
except:
HIGH
Error prone

local variable 'current_section' is assigned to but never used (F841)

scripts/
parse_create_issues.py

109
current_section = "MEDIUM"
MEDIUM
Code complexity

Method getFormatStyles has 60 lines of code (limit is 50)

frontend/src/app/(main)/editor/
screenplay-editor.tsx

789
const getFormatStyles = (formatType: string): React.CSSProperties => {
MEDIUM
Code complexity

Method _global_ has a cyclomatic complexity of 10 (limit is 8)

frontend/src/components/
stations-pipeline.tsx

1
"use client";
MEDIUM
Code complexity

Method EditorPage has 68 lines of code (limit is 50)

frontend/src/app/(main)/ui/pages/
EditorPage.tsx

25
export function EditorPage() {
MEDIUM
Code complexity

Method renderMainContent has 93 lines of code (limit is 50)

frontend/src/app/(main)/arabic-creative-writing-studio/components/
CreativeWritingStudio.tsx

MEDIUM
Code complexity

Method handlePaste has 150 lines of code (limit is 50)

frontend/src/app/(main)/editor/
screenplay-editor.tsx

1153
const handlePaste = (e: React.ClipboardEvent) => {
MEDIUM
Code complexity

Method safeSub has a cyclomatic complexity of 9 (limit is 8)

frontend/src/lib/ai/stations/
station5-dynamic-symbolic-stylistic.ts

802
context: safeSub(fullText, 0, 30000),
MEDIUM
Code complexity

Method handleSubmit has a cyclomatic complexity of 9 (limit is 8)

frontend/src/app/(main)/directors-studio/components/
CharacterFormDialog.tsx

59
const handleSubmit = async (e: React.FormEvent) => {
MEDIUM
Code complexity

File frontend/src/app/(main)/development/creative-development.tsx has 892 non-comment lines of code

frontend/src/app/(main)/development/
creative-development.tsx

1
"use client";
MEDIUM
Code complexity

Method text.match has 68 lines of code (limit is 50)

frontend/src/lib/drama-analyst/agents/styleFingerprint/
StyleFingerprintAgent.ts

269
const exampleMarkers = text.match(/مثال|مثل:|على سبيل المثال|كما في|["«]/g);
MEDIUM
Code complexity

Method handleExport has 57 lines of code (limit is 50)

frontend/src/components/
agent-reports-exporter.tsx

21
const handleExport = (format: "txt" | "json") => {
MEDIUM
Code complexity

Method _global_ has a cyclomatic complexity of 16 (limit is 8)

frontend/src/app/(main)/directors-studio/
page.tsx

1
"use client";
MEDIUM
Code complexity

Method buildPrompt has a cyclomatic complexity of 9 (limit is 8)

frontend/src/lib/drama-analyst/agents/characterVoice/
CharacterVoiceAgent.ts

40
protected buildPrompt(input: StandardAgentInput): string {
HIGH
Error prone

'urllib.parse' imported but unused (F401)

scripts/
create_security_issues_direct.py

21
from urllib import request, parse, error
MEDIUM
Code complexity

Method && has 11 parameters (limit is 8)

frontend/src/app/(main)/ui/components/
KeyboardShortcuts.tsx

45
{isOpen && (
MEDIUM
Code complexity

Method (anonymous) has 69 lines of code (limit is 50)

frontend/src/lib/drama-analyst/agents/adaptiveRewriting/
AdaptiveRewritingAgent.test.ts

46
it("should execute adaptive rewriting task successfully", async () => {
MEDIUM
Code complexity

Method && has 62 lines of code (limit is 50)

frontend/src/app/(main)/ui/components/
KeyboardShortcuts.tsx

45
{isOpen && (
MEDIUM
Code complexity

Method _global_ has 134 lines of code (limit is 50)

frontend/src/app/(main)/brainstorm/
page.tsx

1
"use client";
HIGH
Error prone

undefined name 'c' (F821)

scripts/
parse_create_issues.py

148
c in part_lower
MEDIUM
Code complexity

Method buildPrompt has a cyclomatic complexity of 13 (limit is 8)

frontend/src/lib/drama-analyst/agents/conflictDynamics/
ConflictDynamicsAgent.ts

37
protected buildPrompt(input: StandardAgentInput): string {
MEDIUM
Code complexity

Method (anonymous) has 90 lines of code (limit is 50)

frontend/src/components/
particle-background.tsx

584
useEffect(() => {
MEDIUM
Code complexity

Method (anonymous) has 62 lines of code (limit is 50)

frontend/src/lib/drama-analyst/agents/characterNetwork/
CharacterNetworkAgent.test.ts

46
it("should execute character network analysis task successfully", async () => {
MEDIUM
Code complexity

Method updateShot has 71 lines of code (limit is 50)

backend/src/controllers/
shots.controller.ts

231
async updateShot(req: AuthRequest, res: Response): Promise<void> {
MEDIUM
Code complexity

Method updateCharacter has 60 lines of code (limit is 50)

backend/src/controllers/
characters.controller.ts

183
async updateCharacter(req: AuthRequest, res: Response): Promise<void> {
HIGH
Error prone

f-string is missing placeholders (F541)

scripts/
create_security_issues_direct.py

330
print(f"Creating issues...")
MEDIUM
Code complexity

Method isCharacterLine has a cyclomatic complexity of 20 (limit is 8)

frontend/src/app/(main)/editor/
screenplay-editor.tsx

181
static isCharacterLine(
MEDIUM
Code complexity

File frontend/src/lib/ai/stations/station3-network-builder.ts has 1331 non-comment lines of code

frontend/src/lib/ai/stations/
station3-network-builder.ts

1
import { BaseStation, StationInput } from "./base-station";
MEDIUM
Code complexity

Method getTaskIcon has a cyclomatic complexity of 19 (limit is 8)

frontend/src/app/(main)/development/
creative-development.tsx

362
const getTaskIcon = (taskType: TaskType) => {
MEDIUM
Code complexity

Method SceneFormDialog has a cyclomatic complexity of 13 (limit is 8)

frontend/src/app/(main)/directors-studio/components/
SceneFormDialog.tsx

22
export default function SceneFormDialog({
MEDIUM
Code complexity

Method validateEnvironment has a cyclomatic complexity of 12 (limit is 8)

frontend/src/
env.ts

43
function validateEnvironment() {
MEDIUM
Code complexity

Method animate has a cyclomatic complexity of 34 (limit is 8)

frontend/src/components/
particle-background.tsx

713
const animate = () => {
MEDIUM
Code complexity

Method (anonymous) has 66 lines of code (limit is 50)

frontend/src/lib/drama-analyst/agents/plotPredictor/
PlotPredictorAgent.test.ts

46
it("should execute plot prediction task successfully", async () => {
MEDIUM
Code complexity

Method BrainstormPage has 68 lines of code (limit is 50)

frontend/src/app/(main)/brainstorm/
page.tsx

51
export default function BrainstormPage() {
MEDIUM
Code complexity

Method (anonymous) has a cyclomatic complexity of 13 (limit is 8)

frontend/src/app/(main)/development/
creative-development.tsx

159
useEffect(() => {
MEDIUM
Code complexity

File frontend/src/lib/drama-analyst/agents/sceneGenerator/SceneGeneratorAgent.ts has 502 non-comment lines of code

frontend/src/lib/drama-analyst/agents/sceneGenerator/
SceneGeneratorAgent.ts

1
import { TaskType } from "@core/enums";
MEDIUM
Code complexity

Method DevelopmentPage has 85 lines of code (limit is 50)

frontend/src/app/(main)/ui/pages/
DevelopmentPage.tsx

31
export function DevelopmentPage({
MEDIUM
Code complexity

Method SceneHeaderAgent has a cyclomatic complexity of 11 (limit is 8)

frontend/src/app/(main)/editor/
screenplay-editor.tsx

2161
) => {
MEDIUM
Code complexity

Method getPayloadConfigFromPayload has a cyclomatic complexity of 12 (limit is 8)

frontend/src/components/ui/
chart.tsx

329
function getPayloadConfigFromPayload(
MEDIUM
Code complexity

Method _global_ has 77 lines of code (limit is 50)

frontend/src/app/(main)/directors-studio/
page.tsx

1
"use client";
MEDIUM
Code complexity

Method buildPrompt has a cyclomatic complexity of 10 (limit is 8)

frontend/src/lib/drama-analyst/agents/sceneGenerator/
SceneGeneratorAgent.ts

30
protected buildPrompt(input: StandardAgentInput): string {
MEDIUM
Code complexity

Method _global_ has 69 lines of code (limit is 50)

frontend/src/components/
agent-report-viewer.tsx

1
"use client";
MEDIUM
Code complexity

Method isLikelyAction has 461 lines of code (limit is 50)

frontend/src/app/(main)/editor/
screenplay-editor.tsx

254
static isLikelyAction(line: string): boolean {
MEDIUM
Code complexity

File frontend/src/app/(main)/editor/screenplay-editor.tsx has 2017 non-comment lines of code

frontend/src/app/(main)/editor/
screenplay-editor.tsx

1
import \* as React from "react";
MEDIUM
Code complexity

Method (anonymous) has 81 lines of code (limit is 50)

frontend/src/components/ui/
analytics-dashboard.tsx

106
</div>
MEDIUM
Code complexity

Method toText has a cyclomatic complexity of 10 (limit is 8)

frontend/src/lib/ai/
gemini-core.ts

68
export function toText(v: unknown): string {
MEDIUM
Code complexity

Method handleExport has 69 lines of code (limit is 50)

frontend/src/components/
seven-stations-interface.tsx

153
const handleExport = (format: "txt" | "pdf" | "docx") => {
MEDIUM
Code complexity

Method (anonymous) has 86 lines of code (limit is 50)

frontend/src/app/(main)/actorai-arabic/components/
ActorAiArabicStudio.tsx

210
<Button
MEDIUM
Code complexity

Method ? has a cyclomatic complexity of 10 (limit is 8)

frontend/src/components/ui/
chart.tsx

210
{formatter && item?.value !== undefined && item.name ? (
MEDIUM
Code complexity

Method SceneHeaderAgent has 97 lines of code (limit is 50)

frontend/src/app/(main)/editor/
screenplay-editor.tsx

2161
) => {
MEDIUM
Code complexity

Method dist_seen has 81 lines of code (limit is 50)

frontend/src/components/
particle-background.tsx

410
const dist_seen = (px: number, py: number): number => {
MEDIUM
Code complexity

Method getCreativeTaskIcon has a cyclomatic complexity of 15 (limit is 8)

frontend/src/app/(main)/development/
creative-development.tsx

327
const getCreativeTaskIcon = (taskType: TaskType) => {
MEDIUM
Code complexity

Method AIAssistantPage has 80 lines of code (limit is 50)

frontend/src/app/(main)/directors-studio/ai-assistant/
page.tsx

7
export default function AIAssistantPage() {
MEDIUM
Code complexity

File frontend/src/lib/ai/stations/station2-conceptual-analysis.ts has 1060 non-comment lines of code

frontend/src/lib/ai/stations/
station2-conceptual-analysis.ts

1
import { BaseStation, StationInput, StationOptions } from "./base-station";
MEDIUM
Code complexity

File frontend/src/lib/ai/core/models/station-types.ts has 543 non-comment lines of code

frontend/src/lib/ai/core/models/
station-types.ts

1
// frontend/src/lib/ai/core/models/station-types.ts
MEDIUM
Code complexity

File frontend/src/lib/ai/stations/station4-efficiency-metrics.ts has 681 non-comment lines of code

frontend/src/lib/ai/stations/
station4-efficiency-metrics.ts

1
import { BaseStation, type StationConfig } from "../core/pipeline/base-station";
MEDIUM
Code complexity

Method escapeHtml has 54 lines of code (limit is 50)

frontend/src/lib/security/
sanitize-html.ts

87
\*/
MEDIUM
Code complexity

Method (anonymous) has 65 lines of code (limit is 50)

frontend/src/lib/drama-analyst/agents/worldBuilder/
WorldBuilderAgent.test.ts

46
it("should execute world building task successfully", async () => {
MEDIUM
Code complexity

Method handleKeyDown has 85 lines of code (limit is 50)

frontend/src/app/(main)/editor/
screenplay-editor.tsx

978
const handleKeyDown = (e: React.KeyboardEvent) => {
MEDIUM
Code complexity

Method (anonymous) has 51 lines of code (limit is 50)

frontend/src/components/
agent-report-viewer.tsx

293
<Button variant="outline" onClick={() => setOpen(false)}>
MEDIUM
Code complexity

Method _global_ has 124 lines of code (limit is 50)

frontend/src/components/
station-card.tsx

1
"use client";
MEDIUM
Code complexity

Method buildPrompt has a cyclomatic complexity of 12 (limit is 8)

frontend/src/lib/drama-analyst/agents/thematicMining/
ThematicMiningAgent.ts

38
protected buildPrompt(input: StandardAgentInput): string {
MEDIUM
Code complexity

parse_report is too complex (19) (MC0001)

scripts/
parse_create_issues.py

88
def parse_report() -> List[Dict[str, str]]:
MEDIUM
Code complexity

Method (anonymous) has a cyclomatic complexity of 9 (limit is 8)

frontend/src/lib/ai/stations/
station3-network-builder.ts

497
).map(([name, profile]: [string, any]) => ({
MEDIUM
Code complexity

Method V0ParticleAnimation has 109 lines of code (limit is 50)

frontend/src/components/
particle-background.tsx
