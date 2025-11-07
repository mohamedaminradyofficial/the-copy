الخطوة  1: قياسات الأساس (Baseline) -    
1.1 إعداد بيئة الاختبار وقياس الأداء الحالي
1.2 تحديث ملف baseline-queries.sql بالمعرفات الحقيقية
1.3 تشغيل EXPLAIN ANALYZE وتسجيل النتائج الأساسية
1.4 توثيق النتائج في baseline-results.md
الخطوة  2: فهارس قاعدة البيانات -    
2.1 التحقق من وجود الفهارس الجديدة في schema.ts
2.2 توليد وتطبيق migrations باستخدام pnpm db:push
2.3 التحقق من إنشاء الفهارس في قاعدة البيانات
2.4 إعادة قياس الأداء بعد الفهارس وتوثيق التحسن
الخطوة  3: الأمان والمراقبة -    
3.1 التحقق من CORS configuration وتعزيزه
3.2 إضافة UUID validation لجميع المسارات الحرجة
3.3 تعزيز Security logging وإنشاء نظام التنبيهات
3.4 تفعيل Sentry Web Vitals reporting في Frontend
3.5 إجراء اختبارات أمان شاملة (SQL Injection, XSS, Rate Limiting)
الخطوة  4: Redis والتخزين المؤقت -    
4.1 إنشاء واختبار Redis connection configuration
4.2 تطبيق Gemini cache strategy مع TTLs مناسبة
4.3 دمج الكاش في controllers (Projects, Scenes, Characters)
4.4 إضافة cache metrics endpoint ومراقبة الأداء
الخطوة  5: نظام الطوابير (BullMQ) -    
5.1 التحقق من Queue configuration وRedis connection
5.2 التحقق من Workers registration واختبارها
5.3 تحديث Analysis Controller لاستخدام Queue بدلاً من التنفيذ المباشر
5.4 التحقق من Bull Board Dashboard وإمكانية الوصول
الخطوة  6: القنوات الحية (Real-time) -    
6.1 اختبار WebSocket service والاتصال
6.2 اختبار SSE service واستقبال الأحداث
6.3 توحيد بروتوكول الرسائل بين WebSocket وSSE
6.4 إنشاء unified realtime types واختبارها
الخطوة  7: تحسينات الواجهة الأمامية -    
7.1 استبدال جميع <img> بـ <Image> من next/image مع optimization
7.2 تكوين CDN loader للصور إن توفر
7.3 تطبيق Particles LOD (Level of Detail) حسب قدرة الجهاز
7.4 Lazy loading للمكونات الثقيلة باستخدام dynamic imports
الخطوة  8: تحليل الحزمة -    
8.1 إعداد Bundle Analyzer وتشغيل التحليل
8.2 تحليل النتائج وتحديد المكتبات الكبيرة والمكررة
8.3 تطبيق Code Splitting وDynamic imports للتقليل من حجم الحزمة
الخطوة  9: ميزانية الأداء -    
9.1 إضافة Performance Budget إلى next.config.ts
9.2 تحديث ملف performance-budget.json بالحدود المناسبة
9.3 إعداد CI/CD integration لفحص حجم الحزمة تلقائياً
الخطوة  10: لوحة تحكم المقاييس -    
10.1 التحقق من جميع Backend metrics endpoints
10.2 إنشاء Frontend Dashboard UI لعرض المقاييس
10.3 إضافة مميزات التحديث التلقائي والرسوم البيانية
10.4 دمج Prometheus metrics (اختيار
المهام النهائية والاختبارات
تشغيل جميع الاختبارات ومراجعة logs الأخطاء
اختبار smoke test للميزات الأساسية
توثيق جميع التغييرات والنتائج
إنشاء PR مع تقرير المقارنة قبل/بعد
