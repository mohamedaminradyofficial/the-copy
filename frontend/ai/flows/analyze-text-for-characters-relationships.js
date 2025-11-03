"use strict";
"use server";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeTextForCharactersRelationships = analyzeTextForCharactersRelationships;
/**
 * @fileOverview يحلل نصًا دراميًا لتحديد الشخصيات الرئيسية وعلاقاتهم.
 *
 * - analyzeTextForCharactersRelationships - دالة تعالج عملية التحليل.
 * - AnalyzeTextForCharactersRelationshipsInput - نوع الإدخال لدالة analyzeTextForCharactersRelationships.
 * - AnalyzeTextForCharactersRelationshipsOutput - نوع الإرجاع لدالة analyzeTextForCharactersRelationships.
 */
const genkit_1 = require("@/ai/genkit");
const genkit_2 = require("genkit");
const AnalyzeTextForCharactersRelationshipsInputSchema = genkit_2.z.object({
    text: genkit_2.z.string().describe("النص الدرامي المراد تحليله."),
});
const AnalyzeTextForCharactersRelationshipsOutputSchema = genkit_2.z.object({
    characters: genkit_2.z
        .array(genkit_2.z.string())
        .describe("الشخصيات الرئيسية التي تم تحديدها في النص."),
    relationships: genkit_2.z.array(genkit_2.z.string()).describe("العلاقات بين الشخصيات."),
});
async function analyzeTextForCharactersRelationships(input) {
    return analyzeTextForCharactersRelationshipsFlow(input);
}
const prompt = genkit_1.ai.definePrompt({
    name: "analyzeTextForCharactersRelationshipsPrompt",
    input: { schema: AnalyzeTextForCharactersRelationshipsInputSchema },
    output: { schema: AnalyzeTextForCharactersRelationshipsOutputSchema },
    prompt: `أنت خبير في تحليل النصوص الدرامية. مهمتك هي تحديد الشخصيات الرئيسية وعلاقاتهم في النص المحدد.\n\nالنص: {{{text}}}\n\nحدد الشخصيات الرئيسية ووصف علاقاتهم. أرجع الشخصيات كقائمة من الأسماء، والعلاقات كقائمة من الأوصاف.\n\nالشخصيات:\n- [أسماء الشخصيات]\n\nالعلاقات:\n- [أوصاف العلاقات]`,
    model: "googleai/gemini-2.5-flash",
});
const analyzeTextForCharactersRelationshipsFlow = genkit_1.ai.defineFlow({
    name: "analyzeTextForCharactersRelationshipsFlow",
    inputSchema: AnalyzeTextForCharactersRelationshipsInputSchema,
    outputSchema: AnalyzeTextForCharactersRelationshipsOutputSchema,
}, async (input) => {
    const { output } = await prompt(input);
    return output;
});
