// lib/ai/core/base-station.ts

import { getGeminiService } from "../gemini-service";
import {
  checkConstitutionalCompliance,
  ConstitutionalCheckResult,
} from "../constitutional/principles";
import {
  getUncertaintyQuantificationEngine,
  UncertaintyMetrics,
} from "../constitutional/uncertainty-quantification";
import { SystemMetadata } from "./models/base-entities";
import {
  CharacterContext,
  NarrativeContext,
  AnalysisContext,
} from "./contexts";

// تعريف واجهة للخيارات المشتركة
export interface SystemOptions {
  // خيارات Constitutional AI
  enableConstitutionalCheck?: boolean;

  // خيارات Uncertainty Quantification
  enableUncertaintyQuantification?: boolean;

  // خيارات RAG
  enableRAG?: boolean;

  // خيارات عامة
  temperature?: number;
  maxTokens?: number;
}

export interface SystemInput {
  text: string;
  projectName?: string;
  options?: SystemOptions;
  // يمكن إضافة المزيد من المدخلات حسب الحاجة
  previousResults?: any;
  chunks?: any[];
  contextMap?: any;
  context?: AnalysisContext; // استخدام السياق المشترك
}

export interface SystemOutput {
  // النتيجة الأساسية من النظام
  result: any;

  // البيانات الوصفية المحسنة
  metadata: SystemMetadata & {
    // نتائج Constitutional AI
    constitutionalCheck?: {
      checked: boolean;
      compliant: boolean;
      violations: string[];
      improvementScore: number;
      correctedAnalysis?: string;
    };

    // نتائج Uncertainty Quantification
    uncertaintyQuantification?: {
      quantified: boolean;
      overallConfidence: number;
      uncertaintyType: "epistemic" | "aleatoric";
      sources: Array<{
        aspect: string;
        reason: string;
        reducible: boolean;
      }>;
    };

    // معلومات RAG
    ragInfo?: {
      wasChunked: boolean;
      chunksCount: number;
      retrievalTime: number;
    };
  };
}

export abstract class BaseSystem {
  protected geminiService: GeminiService;
  protected systemName: string;
  protected systemType: string;

  constructor(systemName: string, systemType: string) {
    this.systemName = systemName;
    this.systemType = systemType;
    this.geminiService = getGeminiService();
  }

  /**
   * نقطة الدخول الرئيسية لتشغيل النظام
   */
  async run(input: SystemInput): Promise<SystemOutput> {
    const startTime = Date.now();
    const options = this.mergeWithDefaultOptions(input.options);

    try {
      // 1. تنفيذ منطق النظام الأساسي
      let result = await this.execute(input, options);

      // 2. تطبيق Constitutional AI إذا كان مفعلاً
      if (options.enableConstitutionalCheck) {
        result = await this.applyConstitutionalCheck(result, input.text);
      }

      // 3. تطبيق Uncertainty Quantification إذا كان مفعلاً
      if (options.enableUncertaintyQuantification) {
        result = await this.applyUncertaintyQuantification(result, input);
      }

      // 4. إنشاء البيانات الوصفية النهائية
      const metadata = await this.createMetadata(startTime, options, input);

      return {
        result,
        metadata,
      };
    } catch (error) {
      console.error(`Error in ${this.systemName}:`, error);

      // إرجاع نتيجة خطأ مع البيانات الوصفية المناسبة
      return {
        result: null,
        metadata: {
          systemName: this.systemName,
          systemType: this.systemType,
          status: "Failed",
          error: (error as Error).message,
          executionTime: Date.now() - startTime,
          agentsUsed: [],
          tokensUsed: 0,
        },
      };
    }
  }

  /**
   * دالة مجردة يجب على كل نظام تطبيقها
   */
  protected abstract execute(
    input: SystemInput,
    options: SystemOptions
  ): Promise<any>;

  /**
   * دمج الخيارات المدخلة مع الخيارات الافتراضية
   */
  private mergeWithDefaultOptions(options?: SystemOptions): SystemOptions {
    return {
      enableConstitutionalCheck: true,
      enableUncertaintyQuantification: true,
      enableRAG: false, // يتم تفعيله عادةً في المنسق
      temperature: 0.4,
      maxTokens: 4096,
      ...options,
    };
  }

  /**
   * تطبيق فحص التوافق مع المبادئ الدستورية
   */
  private async applyConstitutionalCheck(
    result: any,
    originalText: string
  ): Promise<any> {
    try {
      // استخراج النصوص التي تحتاج إلى فحص
      const textsToCheck = this.extractTextsForConstitutionalCheck(result);

      const constitutionalResults = [];
      let hasViolations = false;
      let overallImprovementScore = 1.0;

      for (const text of textsToCheck) {
        const checkResult = await checkConstitutionalCompliance(
          text,
          originalText,
          this.geminiService
        );

        constitutionalResults.push(checkResult);

        if (!checkResult.compliant) {
          hasViolations = true;
          overallImprovementScore = Math.min(
            overallImprovementScore,
            checkResult.improvementScore
          );

          // استبدال النص بالنسخة المصححة
          result = this.replaceTextInResult(
            result,
            text,
            checkResult.correctedAnalysis || text
          );
        }
      }

      // إضافة نتائج الفحص الدستوري إلى النتيجة
      result.constitutionalCheck = {
        checked: true,
        compliant: !hasViolations,
        violations: constitutionalResults.flatMap((r) =>
          r.violations.map((v) => `${v.principle}: ${v.description}`)
        ),
        improvementScore: overallImprovementScore,
      };

      return result;
    } catch (error) {
      console.error("Constitutional check failed:", error);

      // إضافة معلومات الفشل إلى النتيجة
      result.constitutionalCheck = {
        checked: false,
        compliant: false,
        violations: [`فشل الفحص: ${(error as Error).message}`],
        improvementScore: 0,
      };

      return result;
    }
  }

  /**
   * تطبيق قياس عدم اليقين
   */
  private async applyUncertaintyQuantification(
    result: any,
    input: SystemInput
  ): Promise<any> {
    try {
      const uncertaintyEngine = getUncertaintyQuantificationEngine(
        this.geminiService
      );

      // استخراج النصوص التي تحتاج إلى قياس عدم اليقين
      const textsToQuantify =
        this.extractTextsForUncertaintyQuantification(result);

      const uncertaintyResults = [];
      let overallConfidence = 0;
      let uncertaintyType: "epistemic" | "aleatoric" = "epistemic";
      const allSources = [];

      for (const text of textsToQuantify) {
        const metrics = await uncertaintyEngine.quantify(text, {
          originalText: input.text,
          analysisType: this.systemName,
          previousResults: input.previousResults,
        });

        uncertaintyResults.push(metrics);
        overallConfidence += metrics.confidence;
        uncertaintyType = metrics.type;
        allSources.push(...metrics.sources);
      }

      // حساب متوسط درجات عدم اليقين
      overallConfidence =
        overallConfidence / Math.max(uncertaintyResults.length, 1);

      // إضافة نتائج قياس عدم اليقين إلى النتيجة
      result.uncertaintyQuantification = {
        quantified: true,
        overallConfidence,
        uncertaintyType,
        sources: allSources.slice(0, 5), // أهم 5 مصادر
      };

      return result;
    } catch (error) {
      console.error("Uncertainty quantification failed:", error);

      // إضافة معلومات الفشل إلى النتيجة
      result.uncertaintyQuantification = {
        quantified: false,
        overallConfidence: 0.5,
        uncertaintyType: "epistemic",
        sources: [
          {
            aspect: "فشل التحليل",
            reason: (error as Error).message,
            reducible: false,
          },
        ],
      };

      return result;
    }
  }

  /**
   * إنشاء البيانات الوصفية النهائية
   */
  private async createMetadata(
    startTime: number,
    options: SystemOptions,
    input: SystemInput
  ): Promise<SystemMetadata> {
    const executionTime = Date.now() - startTime;

    return {
      systemName: this.systemName,
      systemType: this.systemType,
      status: "Success",
      executionTime,
      agentsUsed: this.getAgentsUsed(),
      tokensUsed: this.estimateTokensUsed(input.text),
      options: {
        constitutionalCheck: options.enableConstitutionalCheck,
        uncertaintyQuantification: options.enableUncertaintyQuantification,
        rag: options.enableRAG,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
      },
      ragInfo:
        options.enableRAG && input.chunks
          ? {
              wasChunked: true,
              chunksCount: input.chunks.length,
              retrievalTime: 0, // سيتم حسابه في المنسق
            }
          : {
              wasChunked: false,
              chunksCount: 0,
              retrievalTime: 0,
            },
    };
  }

  /**
   * استخراج النصوص التي تحتاج إلى فحص دستوري (يمكن تجاوزه في الأنظمة الفرعية)
   */
  protected extractTextsForConstitutionalCheck(result: any): string[] {
    const texts = [];

    // استخراج النصوص الرئيسية من نتيجة النظام
    if (result.logline) texts.push(result.logline);
    if (result.storyStatement) texts.push(result.storyStatement);
    if (result.elevatorPitch) texts.push(result.elevatorPitch);
    if (result.executiveSummary) texts.push(result.executiveSummary);

    // استخراج النصوص من التحليلات الفرعية
    if (result.characterAnalysis) {
      for (const [character, analysis] of Object.entries(
        result.characterAnalysis as any
      )) {
        if (typeof analysis === "string") texts.push(analysis);
      }
    }

    if (result.themes) {
      for (const theme of result.themes.primary || []) {
        if (theme.description) texts.push(theme.description);
      }
    }

    return texts;
  }

  /**
   * استخراج النصوص التي تحتاج إلى قياس عدم اليقين (يمكن تجاوزه في الأنظمة الفرعية)
   */
  protected extractTextsForUncertaintyQuantification(result: any): string[] {
    // للتبسيط، نستخدم نفس النصوص المستخدمة في الفحص الدستوري
    return this.extractTextsForConstitutionalCheck(result);
  }

  /**
   * استبدال نص في نتيجة النظام
   */
  protected replaceTextInResult(
    result: any,
    oldText: string,
    newText: string
  ): any {
    // نسخة عميقة من النتيجة لتجنب التعديل المباشر
    const newResult = JSON.parse(JSON.stringify(result));

    // دالة تعاودية للبحث والاستبدال
    function replaceInObject(obj: any): void {
      for (const key in obj) {
        if (typeof obj[key] === "string" && obj[key] === oldText) {
          obj[key] = newText;
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          replaceInObject(obj[key]);
        }
      }
    }

    replaceInObject(newResult);
    return newResult;
  }

  /**
   * الحصول على قائمة الوكلاء المستخدمين في هذا النظام (يجب تجاوزه)
   */
  protected abstract getAgentsUsed(): string[];

  /**
   * تقدير عدد التوكنز المستخدمة
   */
  protected estimateTokensUsed(text: string): number {
    // تقدير بسيط: 1 توكن ≈ 4 أحرف
    return Math.ceil(text.length / 4);
  }
}
