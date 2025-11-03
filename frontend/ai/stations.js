"use strict";
/**
 * Seven Stations Analysis - Text-Only Implementation
 *
 * This module implements the seven stations analysis using pure text input/output.
 * NO JSON parsing or stringifying in outputs.
 * Uses the new interfaces from lib/ai/interfaces/stations.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runStation1 = runStation1;
exports.runStation2 = runStation2;
exports.runStation3 = runStation3;
exports.runStation4 = runStation4;
exports.runStation5 = runStation5;
exports.runStation6 = runStation6;
exports.runStation7 = runStation7;
exports.runSevenStations = runSevenStations;
const gemini_core_1 = require("./gemini-core");
const text_protocol_1 = require("../utils/text-protocol");
// =====================================================
// Station 1: Character and Style Analysis
// =====================================================
async function runStation1(input) {
    const prompt = `قم بتحليل النص التالي وحدد:

1. الشخصيات الرئيسية (3-7 شخصيات)
2. الأسلوب السردي العام
3. نغمة النص
4. وتيرة السرد
5. أسلوب اللغة

النص:
${(0, gemini_core_1.safeSub)(input.context.fullText, 0, 30000)}

قدم تحليلاً نصياً مفصلاً بدون أي تنسيق أو رموز خاصة.
استخدم أقسام واضحة وقوائم نقطية بسيطة.`;
    try {
        const textOutput = await (0, gemini_core_1.callGeminiText)({
            model: "gemini-2.5-flash-lite",
            prompt,
            temperature: 0.3,
        });
        return {
            stationId: "station-1",
            stationName: "تحليل الشخصيات والأسلوب",
            textOutput: (0, gemini_core_1.toText)(textOutput),
            success: true,
        };
    }
    catch (error) {
        return {
            stationId: "station-1",
            stationName: "تحليل الشخصيات والأسلوب",
            textOutput: "",
            success: false,
            error: error instanceof Error ? error.message : "فشل تحليل المحطة 1",
        };
    }
}
// =====================================================
// Station 2: Story Statement and Genre
// =====================================================
async function runStation2(input) {
    const prompt = `بناءً على التحليل السابق والنص الأصلي، حدد:

1. بيان القصة الأساسي (Story Statement)
2. النوع الأدبي الهجين
3. الموضوعات الرئيسية
4. الرسالة المركزية

التحليل السابق:
${(0, gemini_core_1.safeSub)(input.previousOutput, 0, 5000)}

النص الأصلي:
${(0, gemini_core_1.safeSub)(input.context.fullText, 0, 25000)}

قدم تحليلاً مفاهيمياً عميقاً بدون أي تنسيق أو رموز خاصة.
استخدم نصاً عربياً واضحاً مع أقسام محددة.`;
    try {
        const textOutput = await (0, gemini_core_1.callGeminiText)({
            model: "gemini-2.5-flash",
            prompt,
            temperature: 0.3,
        });
        return {
            stationId: "station-2",
            stationName: "بيان القصة والنوع الأدبي",
            textOutput: (0, gemini_core_1.toText)(textOutput),
            success: true,
        };
    }
    catch (error) {
        return {
            stationId: "station-2",
            stationName: "بيان القصة والنوع الأدبي",
            textOutput: "",
            success: false,
            error: error instanceof Error ? error.message : "فشل تحليل المحطة 2",
        };
    }
}
// =====================================================
// Station 3: Conflict Network
// =====================================================
async function runStation3(input) {
    const prompt = `بناءً على التحليلات السابقة، قم ببناء شبكة الصراع:

1. رسم العلاقات بين الشخصيات
2. تحديد نقاط الصراع الرئيسية
3. تحليل ديناميكيات القوة
4. تتبع تطور الصراعات

التحليلات السابقة:
${(0, gemini_core_1.safeSub)(input.previousOutput, 0, 35000)}

قدم وصفاً تفصيلياً لشبكة الصراع بنص عربي واضح.
استخدم قوائم وأقسام بسيطة بدون أي رموز تنسيق.`;
    try {
        const textOutput = await (0, gemini_core_1.callGeminiText)({
            model: "gemini-2.5-flash-lite",
            prompt,
            temperature: 0.3,
        });
        return {
            stationId: "station-3",
            stationName: "شبكة الصراع",
            textOutput: (0, gemini_core_1.toText)(textOutput),
            success: true,
        };
    }
    catch (error) {
        return {
            stationId: "station-3",
            stationName: "شبكة الصراع",
            textOutput: "",
            success: false,
            error: error instanceof Error ? error.message : "فشل تحليل المحطة 3",
        };
    }
}
// =====================================================
// Station 4: Efficiency Assessment
// =====================================================
async function runStation4(input) {
    const prompt = `بناءً على جميع التحليلات السابقة، قيّم كفاءة النص:

1. كفاءة تطوير الشخصيات
2. كفاءة بناء الصراع
3. كفاءة الحبكة
4. توازن العناصر السردية
5. نقاط القوة والضعف
6. توصيات للتحسين

التحليلات السابقة:
${(0, gemini_core_1.safeSub)(input.previousOutput, 0, 40000)}

قدم تقييماً شاملاً للكفاءة مع توصيات عملية.
استخدم نصاً عربياً واضحاً بدون أي رموز تنسيق.`;
    try {
        const textOutput = await (0, gemini_core_1.callGeminiText)({
            model: "gemini-2.5-flash-lite",
            prompt,
            temperature: 0.3,
        });
        return {
            stationId: "station-4",
            stationName: "تقييم الكفاءة",
            textOutput: (0, gemini_core_1.toText)(textOutput),
            success: true,
        };
    }
    catch (error) {
        return {
            stationId: "station-4",
            stationName: "تقييم الكفاءة",
            textOutput: "",
            success: false,
            error: error instanceof Error ? error.message : "فشل تحليل المحطة 4",
        };
    }
}
// =====================================================
// Station 5: Dynamic Analysis
// =====================================================
async function runStation5(input) {
    const prompt = `قم بالتحليل الديناميكي للنص:

1. تتبع تطور الشخصيات عبر الأحداث
2. التحليل الرمزي والدلالي
3. الأنماط الأسلوبية المتكررة
4. التحولات الدرامية
5. الإيقاع الداخلي للنص

النص الأصلي:
${(0, gemini_core_1.safeSub)(input.context.fullText, 0, 20000)}

التحليلات السابقة:
${(0, gemini_core_1.safeSub)(input.previousOutput, 0, 25000)}

قدم تحليلاً ديناميكياً معمقاً بنص عربي واضح.
استخدم أقسام وقوائم بسيطة بدون أي رموز تنسيق.`;
    try {
        const textOutput = await (0, gemini_core_1.callGeminiText)({
            model: "gemini-2.5-flash-lite",
            prompt,
            temperature: 0.3,
        });
        return {
            stationId: "station-5",
            stationName: "التحليل الديناميكي",
            textOutput: (0, gemini_core_1.toText)(textOutput),
            success: true,
        };
    }
    catch (error) {
        return {
            stationId: "station-5",
            stationName: "التحليل الديناميكي",
            textOutput: "",
            success: false,
            error: error instanceof Error ? error.message : "فشل تحليل المحطة 5",
        };
    }
}
// =====================================================
// Station 6: Diagnostics
// =====================================================
async function runStation6(input) {
    const prompt = `قم بتشخيص صحة النص وحدد المشاكل:

1. تشخيص المشاكل البنيوية
2. تحديد الثغرات في الحبكة
3. مشاكل تطوير الشخصيات
4. قضايا الإيقاع والتوازن
5. خطة علاجية مفصلة

جميع التحليلات السابقة:
${(0, gemini_core_1.safeSub)(input.previousOutput, 0, 45000)}

قدم تشخيصاً شاملاً مع خطة علاج واضحة.
استخدم نصاً عربياً مباشراً بدون أي رموز تنسيق.`;
    try {
        const textOutput = await (0, gemini_core_1.callGeminiText)({
            model: "gemini-2.5-flash",
            prompt,
            temperature: 0.3,
        });
        return {
            stationId: "station-6",
            stationName: "التشخيص",
            textOutput: (0, gemini_core_1.toText)(textOutput),
            success: true,
        };
    }
    catch (error) {
        return {
            stationId: "station-6",
            stationName: "التشخيص",
            textOutput: "",
            success: false,
            error: error instanceof Error ? error.message : "فشل تحليل المحطة 6",
        };
    }
}
// =====================================================
// Station 7: Final Report
// =====================================================
async function runStation7(input) {
    const prompt = `قم بإعداد التقرير النهائي الشامل:

1. ملخص تنفيذي للتحليل الكامل
2. أهم النتائج من كل محطة
3. الاستنتاجات الرئيسية
4. خارطة طريق للتحسين
5. التوصيات ذات الأولوية

جميع مخرجات المحطات السابقة:
${(0, gemini_core_1.safeSub)(input.previousOutput, 0, 47000)}

قدم تقريراً نهائياً شاملاً ومنظماً بنص عربي واضح.
استخدم عناوين وأقسام واضحة بدون أي رموز تنسيق أو JSON.
يجب أن يكون التقرير جاهزاً للعرض مباشرة للمستخدم.`;
    try {
        const textOutput = await (0, gemini_core_1.callGeminiText)({
            model: "gemini-2.5-pro",
            prompt,
            temperature: 0.2,
        });
        return {
            stationId: "station-7",
            stationName: "التقرير النهائي",
            textOutput: (0, gemini_core_1.toText)(textOutput),
            success: true,
        };
    }
    catch (error) {
        return {
            stationId: "station-7",
            stationName: "التقرير النهائي",
            textOutput: "",
            success: false,
            error: error instanceof Error ? error.message : "فشل تحليل المحطة 7",
        };
    }
}
// =====================================================
// Sequential Pipeline Runner
// =====================================================
/**
 * Run all seven stations in sequence with text-only I/O
 */
async function runSevenStations(fullText, metadata) {
    const outputs = [];
    let previousOutput = "";
    const context = {
        fullText,
        ...(metadata && { metadata }),
    };
    try {
        // Station 1
        console.log("[Seven Stations] Running Station 1...");
        const s1 = await runStation1({ context });
        outputs.push(s1);
        if (!s1.success)
            throw new Error(s1.error || "Station 1 failed");
        previousOutput = s1.textOutput;
        // Station 2
        console.log("[Seven Stations] Running Station 2...");
        const s2 = await runStation2({ context, previousOutput });
        outputs.push(s2);
        if (!s2.success)
            throw new Error(s2.error || "Station 2 failed");
        previousOutput = (0, text_protocol_1.combineSections)(s1.textOutput, s2.textOutput);
        // Station 3
        console.log("[Seven Stations] Running Station 3...");
        const s3 = await runStation3({ context, previousOutput });
        outputs.push(s3);
        if (!s3.success)
            throw new Error(s3.error || "Station 3 failed");
        previousOutput = (0, text_protocol_1.combineSections)(previousOutput, s3.textOutput);
        // Station 4
        console.log("[Seven Stations] Running Station 4...");
        const s4 = await runStation4({ context, previousOutput });
        outputs.push(s4);
        if (!s4.success)
            throw new Error(s4.error || "Station 4 failed");
        previousOutput = (0, text_protocol_1.combineSections)(previousOutput, s4.textOutput);
        // Station 5
        console.log("[Seven Stations] Running Station 5...");
        const s5 = await runStation5({ context, previousOutput });
        outputs.push(s5);
        if (!s5.success)
            throw new Error(s5.error || "Station 5 failed");
        previousOutput = (0, text_protocol_1.combineSections)(previousOutput, s5.textOutput);
        // Station 6
        console.log("[Seven Stations] Running Station 6...");
        const s6 = await runStation6({ context, previousOutput });
        outputs.push(s6);
        if (!s6.success)
            throw new Error(s6.error || "Station 6 failed");
        previousOutput = (0, text_protocol_1.combineSections)(previousOutput, s6.textOutput);
        // Station 7
        console.log("[Seven Stations] Running Station 7...");
        const s7 = await runStation7({ context, previousOutput });
        outputs.push(s7);
        if (!s7.success)
            throw new Error(s7.error || "Station 7 failed");
        // Build full report
        const fullReport = buildFullReport(outputs);
        return {
            success: true,
            outputs,
            fullReport,
        };
    }
    catch (error) {
        return {
            success: false,
            outputs,
            fullReport: buildFullReport(outputs),
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
/**
 * Build full report from station outputs
 */
function buildFullReport(outputs) {
    const sections = [
        (0, text_protocol_1.createSectionHeader)("التقرير الشامل - المحطات السبع", 1),
        "",
    ];
    for (const output of outputs) {
        sections.push((0, text_protocol_1.createSectionHeader)(output.stationName, 2));
        sections.push(output.textOutput || "لا توجد بيانات");
        sections.push("");
    }
    return sections.join("\n");
}
