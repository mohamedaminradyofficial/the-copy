"use strict";
"use server";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diagnoseAndRefineConflictNetwork = diagnoseAndRefineConflictNetwork;
/**
 * @fileOverview يحدد هذا الملف تدفق Genkit لتشخيص وتحسين شبكات الصراع في النصوص الدرامية.
 *
 * يأخذ التدفق شبكة صراع كمدخل، ويستخدم Gemini AI لتشخيص المشكلات المحتملة،
 * ويقترح تحسينات لتحسين الشبكة واكتشاف الصراعات المحتملة.
 *
 * - diagnoseAndRefineConflictNetwork - الدالة الرئيسية لبدء عملية التشخيص والتحسين.
 * - DiagnoseAndRefineConflictNetworkInput - نوع الإدخال لدالة diagnoseAndRefineConflictNetwork.
 * - DiagnoseAndRefineConflictNetworkOutput - نوع الإخراج لدالة diagnoseAndRefineConflictNetwork.
 */
const genkit_1 = require("@/ai/genkit");
const genkit_2 = require("genkit");
// تحديد مخطط الشخصية والعلاقة والصراع. هذه مبسطة
// نظرًا لعدم تقديم التعريفات الكاملة في الطلب، لكنها ضرورية
// لتعريف مخطط شبكة الصراع.
const CharacterSchema = genkit_2.z.object({
    id: genkit_2.z.string(),
    name: genkit_2.z.string(),
});
const RelationshipSchema = genkit_2.z.object({
    id: genkit_2.z.string(),
    source: genkit_2.z.string(),
    target: genkit_2.z.string(),
    type: genkit_2.z.string(),
});
const ConflictSchema = genkit_2.z.object({
    id: genkit_2.z.string(),
    description: genkit_2.z.string(),
    involvedCharacters: genkit_2.z.array(genkit_2.z.string()),
});
const ConflictNetworkSchema = genkit_2.z.object({
    id: genkit_2.z.string(),
    name: genkit_2.z.string(),
    characters: genkit_2.z.array(CharacterSchema),
    relationships: genkit_2.z.array(RelationshipSchema),
    conflicts: genkit_2.z.array(ConflictSchema),
    metadata: genkit_2.z.record(genkit_2.z.any()).optional(),
});
const DiagnoseAndRefineConflictNetworkInputSchema = genkit_2.z.object({
    conflictNetwork: ConflictNetworkSchema.describe("شبكة الصراع المراد تشخيصها وتحسينها."),
});
const DiagnoseAndRefineConflictNetworkOutputSchema = genkit_2.z.object({
    diagnosis: genkit_2.z
        .string()
        .describe("تشخيص شبكة الصراع، بما في ذلك المشكلات المحتملة ومجالات التحسين."),
    refinedNetwork: ConflictNetworkSchema.describe("شبكة الصراع المحسنة مع التحسينات المقترحة."),
});
async function diagnoseAndRefineConflictNetwork(input) {
    return diagnoseAndRefineConflictNetworkFlow(input);
}
const diagnoseAndRefineConflictNetworkPrompt = genkit_1.ai.definePrompt({
    name: "diagnoseAndRefineConflictNetworkPrompt",
    input: { schema: DiagnoseAndRefineConflictNetworkInputSchema },
    output: { schema: DiagnoseAndRefineConflictNetworkOutputSchema },
    prompt: `أنت خبير في تحليل النصوص الدرامية، متخصص في شبكات الصراع.
  مهمتك هي تشخيص وتحسين شبكة الصراع المقدمة لتحسين هيكلها واكتشاف الصراعات المحتملة.

  حلل شبكة الصراع التالية:
  الشخصيات: {{#each conflictNetwork.characters}}{{@index}}: {{this.name}} (المعرف: {{this.id}})
  {{/each}}
  العلاقات: {{#each conflictNetwork.relationships}}{{@index}}: المصدر: {{this.source}}، الهدف: {{this.target}}، النوع: {{this.type}}
  {{/each}}
  الصراعات: {{#each conflictNetwork.conflicts}}{{@index}}: {{this.description}} (الشخصيات المشاركة: {{this.involvedCharacters}})
  {{/each}}

  قدم تشخيصًا للشبكة، وحدد أي مشكلات محتملة مثل العلاقات المفقودة، أو الصراعات غير الواضحة، أو التناقضات.
  اقترح تحسينات على الشبكة لمعالجة هذه المشكلات وتحسين جودتها الإجمالية. يجب أن تتضمن الشبكة المحسنة البيانات الأصلية، بالإضافة إلى التغييرات المقترحة. انتبه جيدًا للصراعات المحتملة التي لم يتم ذكرها صراحة في قائمة الصراع. يجب إضافة هذه الصراعات المحتملة إلى قائمة الصراع.

  نسق الشبكة المحسنة تمامًا مثل الأصلية، بما في ذلك جميع المعرفات.

  التشخيص:
  {{diagnosis}}

  الشبكة المحسنة:
  {{refinedNetwork}}
  `,
});
const diagnoseAndRefineConflictNetworkFlow = genkit_1.ai.defineFlow({
    name: "diagnoseAndRefineConflictNetworkFlow",
    inputSchema: DiagnoseAndRefineConflictNetworkInputSchema,
    outputSchema: DiagnoseAndRefineConflictNetworkOutputSchema,
}, async (input) => {
    const { output } = await diagnoseAndRefineConflictNetworkPrompt(input);
    return output;
});
