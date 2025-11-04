"use strict";
"use server";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyThemesAndGenres = identifyThemesAndGenres;
/**
 * @fileOverview يحدد المواضيع والأنواع الموجودة في نص درامي.
 *
 * - identifyThemesAndGenres - دالة تعالج تحديد المواضيع والأنواع.
 * - IdentifyThemesAndGenresInput - نوع الإدخال لدالة identifyThemesAndGenres.
 * - IdentifyThemesAndGenresOutput - نوع الإخراج لدالة identifyThemesAndGenres.
 */
const genkit_1 = require("@/ai/genkit");
const genkit_2 = require("genkit");
const IdentifyThemesAndGenresInputSchema = genkit_2.z.object({
    text: genkit_2.z.string().describe("النص الدرامي المراد تحليله."),
});
const IdentifyThemesAndGenresOutputSchema = genkit_2.z.object({
    themes: genkit_2.z.array(genkit_2.z.string()).describe("المواضيع الموجودة في النص."),
    genres: genkit_2.z.array(genkit_2.z.string()).describe("أنواع النص."),
});
async function identifyThemesAndGenres(input) {
    return identifyThemesAndGenresFlow(input);
}
const prompt = genkit_1.ai.definePrompt({
    name: "identifyThemesAndGenresPrompt",
    input: { schema: IdentifyThemesAndGenresInputSchema },
    output: { schema: IdentifyThemesAndGenresOutputSchema },
    prompt: `أنت خبير في تحليل النصوص الدرامية.
  مهمتك هي تحديد المواضيع والأنواع الموجودة في النص المحدد.
  أرجع المواضيع والأنواع كمصفوفات من السلاسل النصية.

  النص: {{{text}}}
  المواضيع:
  الأنواع:`,
    config: {
        model: "googleai/gemini-1.5-pro-latest",
    },
});
const identifyThemesAndGenresFlow = genkit_1.ai.defineFlow({
    name: "identifyThemesAndGenresFlow",
    inputSchema: IdentifyThemesAndGenresInputSchema,
    outputSchema: IdentifyThemesAndGenresOutputSchema,
}, async (input) => {
    const { output } = await prompt(input);
    return output;
});
