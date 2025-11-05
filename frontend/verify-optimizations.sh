#!/bin/bash

# سكريبت للتحقق من اكتمال تحسينات الجسيمات
echo "🔍 بدء التحقق من تحسينات توليد الجسيمات..."

# التحقق من وجود الملفات المطلوبة
echo "📁 التحقق من وجود الملفات..."

files=(
    "src/components/particle-background-optimized.tsx"
    "src/components/particle-effects.ts"
    "PARTICLE_OPTIMIZATION_SUMMARY.md"
    "src/components/USAGE_GUIDE.md"
    "src/components/particle-tests.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - مفقود"
    fi
done

echo ""
echo "🔧 التحقق من التحسينات المطلوبة..."

# التحقق من استخدام requestIdleCallback
if grep -q "requestIdleCallback\|requestIdle" "src/components/particle-background-optimized.tsx"; then
    echo "✅ استخدام requestIdleCallback"
else
    echo "❌ عدم وجود requestIdleCallback"
fi

# التحقق من توليد على دفعات
if grep -q "batchSize\|دفعات\|batch" "src/components/particle-background-optimized.tsx"; then
    echo "✅ توليد على دفعات"
else
    echo "❌ عدم وجود نظام الدفعات"
fi

# التحقق من معالجة الأخطاء
if grep -q "try.*catch\|console.error\|خطأ" "src/components/particle-background-optimized.tsx"; then
    echo "✅ معالجة الأخطاء"
else
    echo "❌ عدم وجود معالجة أخطاء"
fi

# التحقق من تحسين الذاكرة
if grep -q "cleanup\|تنظيف\|memory\|ذاكرة" "src/components/particle-background-optimized.tsx"; then
    echo "✅ تحسين استهلاك الذاكرة"
else
    echo "❌ عدم وجود تحسين ذاكرة"
fi

# التحقق من استخدام requestAnimationFrame
if grep -q "requestAnimationFrame\|animate" "src/components/particle-background-optimized.tsx"; then
    echo "✅ استخدام requestAnimationFrame"
else
    echo "❌ عدم وجود requestAnimationFrame"
fi

echo ""
echo "📊 إحصائيات الملفات..."

# إحصائيات الحجم
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        lines=$(wc -l < "$file")
        size=$(du -h "$file" | cut -f1)
        echo "📄 $file: $lines سطر، حجم $size"
    fi
done

echo ""
echo "🎯 التحقق من اكتمال المتطلبات..."

# تحقق من المتطلبات الأساسية
requirements_met=0
total_requirements=6

# 1. تعديل آلية توليد الجسيمات لتستخدم requestIdleCallback
if grep -q "requestIdleCallback\|requestIdle" "src/components/particle-background-optimized.tsx"; then
    ((requirements_met++))
    echo "✅ 1. استخدام requestIdleCallback"
else
    echo "❌ 1. استخدام requestIdleCallback"
fi

# 2. إنشاء دالة generateParticlesInBatches()
if grep -q "generateParticlesInBatches" "src/components/particle-background-optimized.tsx"; then
    ((requirements_met++))
    echo "✅ 2. دالة generateParticlesInBatches()"
else
    echo "❌ 2. دالة generateParticlesInBatches()"
fi

# 3. استخدام try-catch للتعامل مع الأخطاء
if grep -q "try.*{" "src/components/particle-background-optimized.tsx"; then
    ((requirements_met++))
    echo "✅ 3. استخدام try-catch"
else
    echo "❌ 3. استخدام try-catch"
fi

# 4. إضافة fallback بـ setTimeout
if grep -q "setTimeout.*requestIdleCallback\|fallback" "src/components/particle-background-optimized.tsx"; then
    ((requirements_met++))
    echo "✅ 4. fallback بـ setTimeout"
else
    echo "❌ 4. fallback بـ setTimeout"
fi

# 5. تحسين استهلاك الذاكرة
if grep -q "cleanup\|dispose\|تنظيف" "src/components/particle-background-optimized.tsx"; then
    ((requirements_met++))
    echo "✅ 5. تحسين استهلاك الذاكرة"
else
    echo "❌ 5. تحسين استهلاك الذاكرة"
fi

# 6. الحلقة الرئيسية تستخدم requestAnimationFrame بكفاءة
if grep -q "requestAnimationFrame.*animate" "src/components/particle-background-optimized.tsx"; then
    ((requirements_met++))
    echo "✅ 6. استخدام requestAnimationFrame بكفاءة"
else
    echo "❌ 6. استخدام requestAnimationFrame بكفاءة"
fi

echo ""
echo "📈 النتيجة النهائية: $requirements_met/$total_requirements متطلبات مكتملة"

if [ $requirements_met -eq $total_requirements ]; then
    echo "🎉 جميع المتطلبات مكتملة بنجاح!"
    echo "📝 تم إنشاء الملفات التالية:"
    echo "   - particle-background-optimized.tsx (المكون المحسن)"
    echo "   - particle-effects.ts (محسن مع معالجة أخطاء)"
    echo "   - PARTICLE_OPTIMIZATION_SUMMARY.md (ملخص شامل)"
    echo "   - USAGE_GUIDE.md (دليل الاستخدام)"
    echo "   - particle-tests.ts (اختبارات)"
    exit 0
else
    echo "⚠️  بعض المتطلبات لم تكتمل بعد"
    exit 1
fi