"use strict";
"use server";
Object.defineProperty(exports, "__esModule", { value: true });
exports.measureTextEfficiencyAndEffectiveness = measureTextEfficiencyAndEffectiveness;
/**
 * @fileOverview يقيس كفاءة وفعالية النص الدرامي.
 *
 * - measureTextEfficiencyAndEffectiveness - دالة تحلل النص الدرامي وتعيد مقاييس الكفاءة والفعالية.
 * - MeasureTextEfficiencyAndEffectivenessInput - نوع الإدخال لدالة measureTextEfficiencyAndEffectiveness.
 * - MeasureTextEfficiencyAndEffectivenessOutput - نوع الإخراج لدالة measureTextEfficiencyAndEffectiveness.
 */
const genkit_1 = require("@/ai/genkit");
const genkit_2 = require("genkit");
const MeasureTextEfficiencyAndEffectivenessInputSchema = genkit_2.z
    .string()
    .describe("النص الدرامي المراد تحليله.");
const MeasureTextEfficiencyAndEffectivenessOutputSchema = genkit_2.z.object({
    efficiencyScore: genkit_2.z.number().describe("درجة تمثل كفاءة النص."),
    effectivenessAnalysis: genkit_2.z
        .string()
        .describe("تحليل لفعالية النص في تحقيق أهدافه."),
});
async function measureTextEfficiencyAndEffectiveness(input) {
    return measureTextEfficiencyAndEffectivenessFlow(input);
}
const prompt = genkit_1.ai.definePrompt({
    name: "measureTextEfficiencyAndEffectivenessPrompt",
    input: { schema: MeasureTextEfficiencyAndEffectivenessInputSchema },
    output: { schema: MeasureTextEfficiencyAndEffectivenessOutputSchema },
    prompt: `أنت خبير في تحليل النصوص الدرامية. حلل النص التالي وقدم درجة كفاءة وتحليل فعالية.

النص: {{{$input}}}

درجة الكفاءة (0-100): قدم درجة تمثل مدى كفاءة النص في نقل رسالته. تشير الدرجات الأعلى إلى كفاءة أفضل.
تحليل الفعالية: حلل مدى فعالية النص في تحقيق أهدافه المقصودة، مع مراعاة عوامل مثل الوضوح والتأثير ومشاركة الجمهور.

تأكد من أن الناتج هو كائن JSON يحتوي على حقلي 'efficiencyScore' (رقم بين 0 و 100) و 'effectivenessAnalysis' (سلسلة نصية)، حيث يقدم 'effectivenessAnalysis' تقييمًا مفصلاً. التزم بأوصاف المخطط لإنشاء كائن JSON هذا. لا تقم بتضمين أي نص محيط. قدم فقط كائن JSON.
`,
});
const measureTextEfficiencyAndEffectivenessFlow = genkit_1.ai.defineFlow({
    name: "measureTextEfficiencyAndEffectivenessFlow",
    inputSchema: MeasureTextEfficiencyAndEffectivenessInputSchema,
    outputSchema: MeasureTextEfficiencyAndEffectivenessOutputSchema,
}, async (input) => {
    const { output } = await prompt(input);
    return output;
});
