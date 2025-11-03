"use strict";
"use server";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateConflictNetwork = generateConflictNetwork;
/**
 * @fileOverview يحدد هذا الملف تدفق Genkit لتوليد شبكة صراع من نص تم تحليله.
 *
 * يتضمن تعريف التدفق، ومخططات الإدخال والإخراج، ودالة مجمعة لاستدعاء التدفق.
 *
 * - generateConflictNetwork - دالة تولد شبكة صراع من نص تم تحليله.
 * - GenerateConflictNetworkInput - نوع الإدخال لدالة generateConflictNetwork.
 * - GenerateConflictNetworkOutput - نوع الإخراج لدالة generateConflictNetwork.
 */
const genkit_1 = require("@/ai/genkit");
const genkit_2 = require("genkit");
const GenerateConflictNetworkInputSchema = genkit_2.z.object({
    analyzedText: genkit_2.z
        .string()
        .describe("النص الدرامي الذي تم تحليله لتوليد شبكة الصراع منه."),
});
const GenerateConflictNetworkOutputSchema = genkit_2.z.object({
    conflictNetworkJson: genkit_2.z
        .string()
        .describe("سلسلة JSON تمثل شبكة الصراع، بما في ذلك الشخصيات والعلاقات والصراعات."),
});
async function generateConflictNetwork(input) {
    return generateConflictNetworkFlow(input);
}
const prompt = genkit_1.ai.definePrompt({
    name: "generateConflictNetworkPrompt",
    input: { schema: GenerateConflictNetworkInputSchema },
    output: { schema: GenerateConflictNetworkOutputSchema },
    prompt: `أنت خبير في تحليل النصوص الدرامية، متخصص في توليد شبكات الصراع.

  بناءً على النص المحلل المقدم، قم بإنشاء شبكة صراع تشمل الشخصيات والعلاقات والصراعات.
  أرجع شبكة الصراع كسلسلة JSON.

  النص المحلل: {{{analyzedText}}}
  \n  تأكد من أن JSON قابل للتحليل ويلتزم بتنسيق قياسي لتمثيل بيانات الرسم البياني، بما في ذلك العقد (الشخصيات) والحواف (العلاقات والصراعات).`,
});
const generateConflictNetworkFlow = genkit_1.ai.defineFlow({
    name: "generateConflictNetworkFlow",
    inputSchema: GenerateConflictNetworkInputSchema,
    outputSchema: GenerateConflictNetworkOutputSchema,
}, async (input) => {
    const { output } = await prompt(input);
    return output;
});
