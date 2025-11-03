"use strict";
"use server";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visualizeAnalysisResults = visualizeAnalysisResults;
/**
 * @fileOverview يعرض نتائج التحليل بصريًا، مع التركيز على شبكات الصراع وعلاقات الشخصيات والعناصر الموضوعية.
 *
 * @remarks
 * يأخذ هذا التدفق نتائج التحليل ويستخدم Gemini AI لإنشاء تصور لشبكات الصراع،
 * وعلاقات الشخصيات، والعناصر الموضوعية، مما يوفر تمثيلًا مرئيًا لتسهيل التفسير.
 *
 * @interface VisualizeAnalysisResultsInput - يحدد مخطط الإدخال لدالة visualizeAnalysisResults.
 * @interface VisualizeAnalysisResultsOutput - يحدد مخطط الإخراج لدالة visualizeAnalysisResults.
 * @function visualizeAnalysisResults - ينسق عرض نتائج التحليل.
 */
const genkit_1 = require("@/ai/genkit");
const genkit_2 = require("genkit");
const VisualizeAnalysisResultsInputSchema = genkit_2.z.object({
    conflictNetwork: genkit_2.z.string().describe("سلسلة JSON لشبكة الصراع المراد عرضها."),
    characterRelationships: genkit_2.z
        .string()
        .describe("سلسلة JSON لعلاقات الشخصيات المراد عرضها."),
    thematicElements: genkit_2.z
        .string()
        .describe("سلسلة JSON للعناصر الموضوعية المراد عرضها."),
});
const VisualizeAnalysisResultsOutputSchema = genkit_2.z.object({
    visualization: genkit_2.z
        .string()
        .describe("وصف للتصور، بما في ذلك شبكات الصراع وعلاقات الشخصيات والعناصر الموضوعية."),
    mediaUrl: genkit_2.z
        .string()
        .optional()
        .describe("عنوان URI للبيانات للصورة المرئية التي تم إنشاؤها."),
});
const visualizeAnalysisResultsPrompt = genkit_1.ai.definePrompt({
    name: "visualizeAnalysisResultsPrompt",
    input: { schema: VisualizeAnalysisResultsInputSchema },
    output: { schema: VisualizeAnalysisResultsOutputSchema },
    prompt: `أنت خبير في تصور البيانات وتحليل النصوص الدرامية.

  بناءً على شبكة الصراع المقدمة وعلاقات الشخصيات والعناصر الموضوعية، قم بإنشاء وصف نصي لتصور يمثل نتائج التحليل بشكل فعال. اختياريًا، قم بإنشاء صورة لتصور الميزات الموصوفة، إن أمكن.

  شبكة الصراع: {{{conflictNetwork}}}
  علاقات الشخصيات: {{{characterRelationships}}}
  العناصر الموضوعية: {{{thematicElements}}}

  تأكد من أن التصور يركز على الصراعات والعلاقات والمواضيع الرئيسية الموجودة في النص.
  تأكد من استخراج الميزات المهمة. كن مفصلاً قدر الإمكان واستخدم أمثلة من المدخلات.
  إذا كنت قادرًا على إنشاء صورة، فاستجب بعنوان URI للبيانات للصورة.
`,
});
const visualizeAnalysisResultsFlow = genkit_1.ai.defineFlow({
    name: "visualizeAnalysisResultsFlow",
    inputSchema: VisualizeAnalysisResultsInputSchema,
    outputSchema: VisualizeAnalysisResultsOutputSchema,
}, async (input) => {
    const { output } = await visualizeAnalysisResultsPrompt(input);
    return output;
});
async function visualizeAnalysisResults(input) {
    return visualizeAnalysisResultsFlow(input);
}
