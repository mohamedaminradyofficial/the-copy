import { TaskType } from "@core/enums";
import { BaseAgent } from "../shared/BaseAgent";
import {
  StandardAgentInput,
  StandardAgentOutput,
} from "../shared/standardAgentPattern";
import { CHARACTER_NETWORK_AGENT_CONFIG } from "./agent";

interface CharacterNetworkContext {
  originalText?: string;
  analysisReport?: any;
  characters?: any[];
  focusCharacters?: string[];
  relationshipTypes?: string[]; // ['family', 'romantic', 'professional', 'adversarial', 'friendship']
  analyzeEvolution?: boolean;
  trackInfluence?: boolean;
  identifyGroups?: boolean;
  mapPowerDynamics?: boolean;
}

/**
 * Character Network Agent - وكيل شبكة الشخصيات
 * يطبق النمط القياسي: RAG → Self-Critique → Constitutional → Uncertainty → Hallucination → Debate
 * إخراج نصي فقط - لا JSON
 */
export class CharacterNetworkAgent extends BaseAgent {
  constructor() {
    super(
      "SocialGraph AI",
      TaskType.CHARACTER_NETWORK,
      CHARACTER_NETWORK_AGENT_CONFIG.systemPrompt || ""
    );

    this.confidenceFloor = 0.82;
  }

  protected buildPrompt(input: StandardAgentInput): string {
    const { input: taskInput, context } = input;
    const ctx = context as CharacterNetworkContext;

    const originalText = ctx?.originalText || "";
    const characters = ctx?.characters || [];
    const focusCharacters = ctx?.focusCharacters || [];
    const relationshipTypes = ctx?.relationshipTypes || [
      "family",
      "romantic",
      "professional",
      "friendship",
      "adversarial",
    ];
    const analyzeEvolution = ctx?.analyzeEvolution ?? true;
    const trackInfluence = ctx?.trackInfluence ?? true;
    const identifyGroups = ctx?.identifyGroups ?? true;
    const mapPowerDynamics = ctx?.mapPowerDynamics ?? true;

    let prompt = `مهمة رسم وتحليل شبكة الشخصيات والعلاقات\n\n`;

    if (originalText) {
      prompt += `النص المراد تحليله:\n${originalText.substring(0, 2500)}...\n\n`;
    }

    if (characters.length > 0) {
      prompt += `الشخصيات في الشبكة:\n`;
      characters.slice(0, 8).forEach((char: any, idx: number) => {
        const charName =
          typeof char === "string" ? char : char.name || `شخصية ${idx + 1}`;
        const charRole =
          typeof char === "object" && char.role ? ` - ${char.role}` : "";
        prompt += `${idx + 1}. ${charName}${charRole}\n`;
      });
      prompt += "\n";
    }

    if (focusCharacters.length > 0) {
      prompt += `شخصيات للتركيز عليها: ${focusCharacters.join("، ")}\n\n`;
    }

    prompt += `أنواع العلاقات للتحليل: ${relationshipTypes.map(this.translateRelationType).join("، ")}\n`;
    prompt += `تحليل التطور: ${analyzeEvolution ? "نعم" : "لا"}\n`;
    prompt += `تتبع النفوذ: ${trackInfluence ? "نعم" : "لا"}\n`;
    prompt += `تحديد المجموعات: ${identifyGroups ? "نعم" : "لا"}\n`;
    prompt += `رسم ديناميكيات القوة: ${mapPowerDynamics ? "نعم" : "لا"}\n\n`;

    prompt += `المهمة المطلوبة:\n${taskInput}\n\n`;

    prompt += `التعليمات:

1. **نظرة عامة على الشبكة** (3-4 جمل):
   - عدد الشخصيات الرئيسية والثانوية
   - الطابع العام للعلاقات (متماسكة، متشابكة، معزولة)
   - المركزية والهامشية في الشبكة

2. **الشخصيات المركزية** (Hub Characters):
   - من هم الشخصيات الأكثر ارتباطاً
   - دورهم في ربط الشبكة
   - تأثيرهم على الأحداث

3. **العلاقات الثنائية الرئيسية**:
   لكل علاقة مهمة، حدد:
   - **الأطراف**: من ومن
   - **نوع العلاقة**: عائلية، رومانسية، مهنية، صداقة، عدائية
   - **طبيعة العلاقة**: متوازنة، سلطوية، متبادلة، أحادية الاتجاه
   - **قوة الرابطة**: قوية، متوسطة، ضعيفة، متقلبة
   - **الديناميكية**: ثابتة، متطورة، متدهورة، متحسنة
   - **الأدلة النصية**: مشاهد أو لحظات تبرز هذه العلاقة

${
  analyzeEvolution
    ? `4. **تطور العلاقات**:
   - كيف تتغير العلاقات الرئيسية عبر النص
   - نقاط التحول في العلاقات
   - العوامل المؤثرة في التغيير`
    : ""
}

${
  identifyGroups
    ? `5. **المجموعات والتحالفات**:
   - المجموعات أو الفصائل الموجودة
   - أساس التجمع (عائلة، طبقة، مصلحة، عقيدة)
   - العلاقات بين المجموعات`
    : ""
}

${
  mapPowerDynamics
    ? `6. **ديناميكيات القوة والنفوذ**:
   - من يملك السلطة والنفوذ
   - كيف تُمارس هذه السلطة
   - توازنات القوى والتبعيات`
    : ""
}

${
  trackInfluence
    ? `7. **خطوط التأثير**:
   - من يؤثر على من
   - آليات التأثير (إقناع، إجبار، إلهام، تلاعب)
   - سلاسل التأثير غير المباشر`
    : ""
}

8. **العزلة والاتصال**:
   - شخصيات معزولة أو منفصلة
   - شخصيات تربط بين مجموعات منفصلة (Bridges)
   - الفراغات أو الفجوات في الشبكة

9. **الوظيفة السردية**:
   - كيف تخدم هذه الشبكة الحبكة
   - ماذا تكشف عن الثيمات والرسائل
   - التعقيد والعمق الذي تضيفه

10. **الرسم البياني الوصفي**:
    - وصف نصي لبنية الشبكة (مركزية، موزعة، هرمية، دائرية)
    - المحاور الرئيسية للاتصال
    - النقاط الحرجة في الشبكة

اكتب بشكل نصي تحليلي واضح مع أسماء الشخصيات وأمثلة محددة.
استخدم أسهم نصية (→ ← ↔) لتوضيح اتجاهات التأثير عند الحاجة.
لا تستخدم JSON أو رسومات معقدة - وصف نصي مفصل فقط.`;

    return prompt;
  }

  protected async postProcess(
    output: StandardAgentOutput
  ): Promise<StandardAgentOutput> {
    let processedText = this.cleanupNetworkText(output.text);

    const networkComprehensiveness =
      await this.assessNetworkComprehensiveness(processedText);
    const relationshipDepth = await this.assessRelationshipDepth(processedText);
    const structuralInsight = await this.assessStructuralInsight(processedText);
    const evidenceQuality = await this.assessEvidenceQuality(processedText);

    const qualityScore =
      networkComprehensiveness * 0.3 +
      relationshipDepth * 0.3 +
      structuralInsight * 0.2 +
      evidenceQuality * 0.2;

    const adjustedConfidence = output.confidence * 0.5 + qualityScore * 0.5;

    return {
      ...output,
      text: processedText,
      confidence: adjustedConfidence,
      notes: this.generateNetworkNotes(
        output,
        networkComprehensiveness,
        relationshipDepth,
        structuralInsight,
        evidenceQuality
      ),
      metadata: {
        ...output.metadata,
        networkAnalysisQuality: {
          overall: qualityScore,
          networkComprehensiveness,
          relationshipDepth,
          structuralInsight,
          evidenceQuality,
        },
        charactersIdentified: this.countCharacters(processedText),
        relationshipsIdentified: this.countRelationships(processedText),
        groupsIdentified: this.countGroups(processedText),
      } as any,
    };
  }

  private cleanupNetworkText(text: string): string {
    text = text.replace(/```json[\s\S]*?```/g, "");
    text = text.replace(/```[\s\S]*?```/g, "");
    text = text.replace(/\{[\s\S]*?\}/g, (match) => {
      if (match.includes('"') && match.includes(":")) return "";
      return match;
    });

    return text.replace(/\n{3,}/g, "\n\n").trim();
  }

  private async assessNetworkComprehensiveness(text: string): Promise<number> {
    let score = 0.5;

    const networkTerms = [
      "شبكة",
      "علاقة",
      "رابط",
      "اتصال",
      "تفاعل",
      "ارتباط",
      "شخصية",
    ];
    const termCount = networkTerms.reduce(
      (count, term) => count + (text.match(new RegExp(term, "g")) || []).length,
      0
    );
    score += Math.min(0.25, termCount * 0.015);

    const aspectsTerms = [
      "مركزي",
      "هامشي",
      "مجموعة",
      "تحالف",
      "نفوذ",
      "قوة",
      "تأثير",
    ];
    const aspectsCount = aspectsTerms.reduce(
      (count, term) => count + (text.match(new RegExp(term, "g")) || []).length,
      0
    );
    score += Math.min(0.15, aspectsCount * 0.02);

    if (text.length > 1500) score += 0.1;

    return Math.min(1, score);
  }

  private async assessRelationshipDepth(text: string): Promise<number> {
    let score = 0.5;

    const relTypes = [
      "عائلية",
      "رومانسية",
      "صداقة",
      "عدائية",
      "مهنية",
      "سلطوية",
    ];
    const typesCount = relTypes.reduce(
      (count, type) => count + (text.match(new RegExp(type, "g")) || []).length,
      0
    );
    score += Math.min(0.25, typesCount * 0.04);

    const dynamicTerms = [
      "يتطور",
      "يتغير",
      "يتحسن",
      "يتدهور",
      "قوي",
      "ضعيف",
      "متوازن",
    ];
    const dynamicCount = dynamicTerms.reduce(
      (count, term) => count + (text.match(new RegExp(term, "g")) || []).length,
      0
    );
    score += Math.min(0.15, dynamicCount * 0.03);

    const hasDirectionalIndicators =
      text.includes("→") || text.includes("←") || text.includes("↔");
    if (hasDirectionalIndicators) score += 0.1;

    return Math.min(1, score);
  }

  private async assessStructuralInsight(text: string): Promise<number> {
    let score = 0.5;

    const structuralTerms = [
      "بنية",
      "هيكل",
      "نمط",
      "هرمية",
      "دائرية",
      "مركزية",
      "موزعة",
      "متشابكة",
    ];
    const structCount = structuralTerms.reduce(
      (count, term) => count + (text.match(new RegExp(term, "g")) || []).length,
      0
    );
    score += Math.min(0.25, structCount * 0.04);

    const insightTerms = [
      "يكشف",
      "يوضح",
      "يعكس",
      "الوظيفة",
      "الأهمية",
      "التأثير",
    ];
    const insightCount = insightTerms.reduce(
      (count, term) => count + (text.match(new RegExp(term, "g")) || []).length,
      0
    );
    score += Math.min(0.25, insightCount * 0.03);

    return Math.min(1, score);
  }

  private async assessEvidenceQuality(text: string): Promise<number> {
    let score = 0.6;

    const evidenceMarkers = [
      "مثل",
      "كما في",
      "نرى",
      "يظهر",
      "في المشهد",
      "عندما",
    ];
    const evidenceCount = evidenceMarkers.reduce(
      (count, marker) =>
        count + (text.match(new RegExp(marker, "g")) || []).length,
      0
    );
    score += Math.min(0.25, evidenceCount * 0.025);

    const hasExamples = (text.match(/["«]/g) || []).length >= 2;
    if (hasExamples) score += 0.15;

    return Math.min(1, score);
  }

  private countCharacters(text: string): number {
    const names = new Set<string>();
    const matches = text.match(/[أ-ي]{3,}(?:\s+[أ-ي]{3,})?/g);
    if (matches) {
      matches.forEach((name) => {
        if (name.length > 3) names.add(name);
      });
    }
    return Math.min(names.size, 15);
  }

  private countRelationships(text: string): number {
    const relMarkers = text.match(
      /علاقة|رابط|يربط|و\s*[أ-ي]{3,}|مع\s*[أ-ي]{3,}|→|←|↔/g
    );
    return relMarkers ? Math.min(relMarkers.length, 20) : 0;
  }

  private countGroups(text: string): number {
    const groupMarkers = text.match(/مجموعة|فصيل|تحالف|عائلة|طبقة|فريق/gi);
    return groupMarkers ? Math.min(groupMarkers.length, 8) : 0;
  }

  private generateNetworkNotes(
    output: StandardAgentOutput,
    comprehensiveness: number,
    depth: number,
    insight: number,
    evidence: number
  ): string {
    const notesList: string[] = [];

    const avg = (comprehensiveness + depth + insight + evidence) / 4;
    if (avg > 0.8) notesList.push("تحليل شبكي ممتاز");
    else if (avg > 0.65) notesList.push("تحليل جيد");
    else notesList.push("يحتاج عمق أكبر");

    if (comprehensiveness > 0.8) notesList.push("شمولية عالية");
    if (depth > 0.8) notesList.push("عمق علائقي قوي");
    if (insight > 0.75) notesList.push("رؤية بنيوية ثاقبة");
    if (evidence > 0.75) notesList.push("أدلة نصية جيدة");

    if (comprehensiveness < 0.6) notesList.push("يحتاج تغطية أوسع");
    if (depth < 0.5) notesList.push("يحتاج تحليل علاقات أعمق");
    if (insight < 0.6) notesList.push("يحتاج رؤية بنيوية أعمق");

    if (output.notes) notesList.push(output.notes);

    return notesList.join(" | ");
  }

  private translateRelationType(type: string): string {
    const types: Record<string, string> = {
      family: "عائلية",
      romantic: "رومانسية",
      professional: "مهنية",
      adversarial: "عدائية",
      friendship: "صداقة",
      mentor: "إرشادية",
      rivalry: "تنافسية",
      alliance: "تحالفية",
    };
    return types[type] || type;
  }

  protected async getFallbackResponse(
    input: StandardAgentInput
  ): Promise<string> {
    return `نظرة عامة على الشبكة:
النص يحتوي على عدة شخصيات مترابطة بعلاقات متنوعة تشكل شبكة اجتماعية معقدة.

الشخصيات المركزية:
[شخصية رئيسية] - تلعب دوراً محورياً في ربط الشبكة وتؤثر على معظم العلاقات الأخرى.

العلاقات الرئيسية:
1. [شخصية أ] ↔ [شخصية ب]: علاقة [نوع] تتميز بـ[خصائص عامة تحتاج تفصيل]
2. [شخصية ج] → [شخصية د]: تأثير [طبيعة] يظهر من خلال [أمثلة تحتاج تحديد]

المجموعات والتحالفات:
توجد مجموعتان رئيسيتان تربطهما علاقات متشابكة وأحياناً متوترة.

ديناميكيات القوة:
[شخصية] تمتلك النفوذ الأكبر بينما [شخصية أخرى] في موقع تبعية أو هامشية.

الوظيفة السردية:
الشبكة تخدم [الغرض الدرامي] وتعكس [الثيمات الأساسية].

البنية العامة:
الشبكة ذات طابع [مركزي/موزع/هرمي] مع [خصائص بنيوية تحتاج توضيح].

ملاحظة: يُرجى تفعيل الخيارات المتقدمة وتوفير المزيد من التفاصيل عن الشخصيات والعلاقات للحصول على رسم شبكي أكثر دقة وشمولاً مع أمثلة نصية محددة وتحليل عميق للديناميكيات.`;
  }
}

export const characterNetworkAgent = new CharacterNetworkAgent();
