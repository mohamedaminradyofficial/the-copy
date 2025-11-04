# الواجهة

## وصف المجلد
يحتوي هذا المجلد على تعريفات الواجهات والرسائل المستخدمة في طبقة الذكاء الاصطناعي. يتم استخدام Zod للتصديق على البيانات وتحديد الاتحادات التمييزية للنجاح/الفشل.

## قائمة الملفات ووظائفها
- `response-types.js`: يحتوي على تعريفات Zod للرسائل المستخدمة في طبقة الذكاء الاصطناعي، بما في ذلك:
  - `BaseResponseSchema`: نموذج أساسي للرسائل مع اتحاد تمييزي للنجاح/الفشل.
  - `CharacterSchema`: نموذج للشخصيات.
  - `CharacterAnalysisSchema`: نموذج لتحليل الشخصيات.
  - `RelationshipSchema`: نموذج للعلاقات بين الشخصيات.
  - `ConflictSchema`: نموذج للصراعات.
  - `ThemeSchema`: نموذج للمواضيع.
  - `DialogueAnalysisSchema`: نموذج لتحليل الحوار.
  - `UncertaintyReportSchema`: نموذج لتقرير عدم اليقين.
  - `AudienceProfileSchema`: نموذج لملف تعريف الجمهور.
  - `ScoreMatrixSchema`: نموذج لمصفوفة التقييمات.
  - `RecommendationSchema`: نموذج للتوصيات.
  - `DebateResultSchema`: نموذج لنتيجة المناظرة.
  - `ConflictNetworkSchema`: نموذج لشبكة الصراعات.
  - `CharacterContextSchema`: نموذج لسياق الشخصية.
  - `NarrativeContextSchema`: نموذج لسياق القصة.
  - `AnalysisContextSchema`: نموذج لسياق التحليل.
  - `StationResultSchema`: نموذج لنتيجة المحطة.
  - `PreviousResultsSchema`: نموذج للنتائج السابقة.
  - `TextChunkSchema`: نموذج لأجزاء النص.
  - `ContextMapSchema`: نموذج لخريطة السياق.
  - `validateResponse`: دالة لتصديق الرسائل.
  - `safeValidateResponse`: دالة لتصديق الرسائل بشكل آمن.

## ملاحظات خاصة
- يتم استخدام Zod للتصديق على البيانات وتحديد الاتحادات التمييزية للنجاح/الفشل.
- يتم استخدام نماذج البيانات المختلفة لتحليل الشخصيات والصراعات والمواضيع والحوار.
- يتم استخدام دالات التصديق للتحقق من صحة البيانات قبل استخدامها في طبقة الذكاء الاصطناعي.