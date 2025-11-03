"use strict";
// frontend/src/lib/ai/stations/base-station.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStation = void 0;
const principles_1 = require("../constitutional/principles");
const uncertainty_quantification_1 = require("../constitutional/uncertainty-quantification");
class BaseStation {
    constructor(geminiService, stationName, stationNumber) {
        this.geminiService = geminiService;
        this.stationName = stationName;
        this.stationNumber = stationNumber;
    }
    /**
     * نقطة الدخول الرئيسية لتشغيل المحطة
     */
    async run(input) {
        const startTime = Date.now();
        const options = this.mergeWithDefaultOptions(input.options);
        try {
            // 1. تنفيذ منطق المحطة الأساسي
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
        }
        catch (error) {
            console.error(`Error in ${this.stationName}:`, error);
            // إرجاع نتيجة خطأ مع البيانات الوصفية المناسبة
            return {
                result: null,
                metadata: {
                    stationName: this.stationName,
                    stationNumber: this.stationNumber,
                    status: "Failed",
                    error: error.message,
                    executionTime: Date.now() - startTime,
                    agentsUsed: [],
                    tokensUsed: 0,
                },
            };
        }
    }
    /**
     * دمج الخيارات المدخلة مع الخيارات الافتراضية
     */
    mergeWithDefaultOptions(options) {
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
    async applyConstitutionalCheck(result, originalText) {
        try {
            // استخراج النصوص التي تحتاج إلى فحص
            const textsToCheck = this.extractTextsForConstitutionalCheck(result);
            const constitutionalResults = [];
            let hasViolations = false;
            let overallImprovementScore = 1.0;
            for (const text of textsToCheck) {
                const checkResult = await (0, principles_1.checkConstitutionalCompliance)(text, originalText, this.geminiService);
                constitutionalResults.push(checkResult);
                if (!checkResult.compliant) {
                    hasViolations = true;
                    overallImprovementScore = Math.min(overallImprovementScore, checkResult.improvementScore);
                    // استبدال النص بالنسخة المصححة
                    result = this.replaceTextInResult(result, text, checkResult.correctedAnalysis || text);
                }
            }
            // إضافة نتائج الفحص الدستوري إلى النتيجة
            const resultObj = result;
            resultObj.constitutionalCheck = {
                checked: true,
                compliant: !hasViolations,
                violations: constitutionalResults.flatMap((r) => r.violations.map((v) => `${v.principle}: ${v.description}`)),
                improvementScore: overallImprovementScore,
            };
            return result;
        }
        catch (error) {
            console.error("Constitutional check failed:", error);
            // إضافة معلومات الفشل إلى النتيجة
            const resultObj = result;
            resultObj.constitutionalCheck = {
                checked: false,
                compliant: false,
                violations: [`فشل الفحص: ${error.message}`],
                improvementScore: 0,
            };
            return result;
        }
    }
    /**
     * تطبيق قياس عدم اليقين
     */
    async applyUncertaintyQuantification(result, input) {
        try {
            const uncertaintyEngine = (0, uncertainty_quantification_1.getUncertaintyQuantificationEngine)(this.geminiService);
            // استخراج النصوص التي تحتاج إلى قياس عدم اليقين
            const textsToQuantify = this.extractTextsForUncertaintyQuantification(result);
            const uncertaintyResults = [];
            let overallConfidence = 0;
            let uncertaintyType = "epistemic";
            const allSources = [];
            for (const text of textsToQuantify) {
                const metrics = await uncertaintyEngine.quantify(text, {
                    originalText: input.text,
                    analysisType: this.stationName,
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
            const resultObj = result;
            resultObj.uncertaintyQuantification = {
                quantified: true,
                overallConfidence,
                uncertaintyType,
                sources: allSources.slice(0, 5), // أهم 5 مصادر
            };
            return result;
        }
        catch (error) {
            console.error("Uncertainty quantification failed:", error);
            // إضافة معلومات الفشل إلى النتيجة
            const resultObj = result;
            resultObj.uncertaintyQuantification = {
                quantified: false,
                overallConfidence: 0.5,
                uncertaintyType: "epistemic",
                sources: [
                    {
                        aspect: "فشل التحليل",
                        reason: error.message,
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
    async createMetadata(startTime, options, input) {
        const executionTime = Date.now() - startTime;
        return {
            stationName: this.stationName,
            stationNumber: this.stationNumber,
            status: "Success",
            executionTime,
            agentsUsed: this.getAgentsUsed(),
            tokensUsed: this.estimateTokensUsed(input.text),
            options: {
                ...(options.enableConstitutionalCheck !== undefined && { constitutionalCheck: options.enableConstitutionalCheck }),
                ...(options.enableUncertaintyQuantification !== undefined && { uncertaintyQuantification: options.enableUncertaintyQuantification }),
                ...(options.enableRAG !== undefined && { rag: options.enableRAG }),
                ...(options.temperature !== undefined && { temperature: options.temperature }),
                ...(options.maxTokens !== undefined && { maxTokens: options.maxTokens }),
            },
            ragInfo: options.enableRAG && input.chunks
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
     * استخراج النصوص التي تحتاج إلى فحص دستوري (يمكن تجاوزه في المحطات الفرعية)
     */
    extractTextsForConstitutionalCheck(result) {
        const texts = [];
        // استخراج النصوص الرئيسية من نتيجة المحطة
        if (typeof result === "object" &&
            result !== null) {
            const resultObj = result;
            if (typeof resultObj.logline === "string")
                texts.push(resultObj.logline);
            if (typeof resultObj.storyStatement === "string")
                texts.push(resultObj.storyStatement);
            if (typeof resultObj.elevatorPitch === "string")
                texts.push(resultObj.elevatorPitch);
            if (typeof resultObj.executiveSummary === "string")
                texts.push(resultObj.executiveSummary);
        }
        // استخراج النصوص من التحليلات الفرعية
        if (typeof result === "object" &&
            result !== null &&
            "characterAnalysis" in result) {
            const characterAnalysis = result.characterAnalysis;
            if (typeof characterAnalysis === "object" && characterAnalysis !== null) {
                for (const [character, analysis] of Object.entries(characterAnalysis)) {
                    if (typeof analysis === "string")
                        texts.push(analysis);
                }
            }
        }
        if (typeof result === "object" &&
            result !== null &&
            "themes" in result) {
            const themes = result.themes;
            if (typeof themes === "object" && themes !== null && "primary" in themes) {
                const primaryThemes = themes.primary;
                if (Array.isArray(primaryThemes)) {
                    for (const theme of primaryThemes) {
                        if (theme && typeof theme === "object" && "description" in theme && typeof theme.description === "string") {
                            texts.push(theme.description);
                        }
                    }
                }
            }
        }
        return texts;
    }
    /**
     * استخراج النصوص التي تحتاج إلى قياس عدم اليقين (يمكن تجاوزه في المحطات الفرعية)
     */
    extractTextsForUncertaintyQuantification(result) {
        // للتبسيط، نستخدم نفس النصوص المستخدمة في الفحص الدستوري
        return this.extractTextsForConstitutionalCheck(result);
    }
    /**
     * استبدال نص في نتيجة المحطة
     */
    replaceTextInResult(result, oldText, newText) {
        // نسخة عميقة من النتيجة لتجنب التعديل المباشر
        const newResult = JSON.parse(JSON.stringify(result));
        // دالة تعاودية للبحث والاستبدال
        function replaceInObject(obj) {
            if (typeof obj !== "object" || obj === null) {
                return;
            }
            for (const key in obj) {
                const value = obj[key];
                if (typeof value === "string" && value === oldText) {
                    obj[key] = newText;
                }
                else if (typeof value === "object" && value !== null) {
                    replaceInObject(value);
                }
            }
        }
        replaceInObject(newResult);
        return newResult;
    }
    /**
     * تقدير عدد التوكنز المستخدمة
     */
    estimateTokensUsed(text) {
        // تقدير بسيط: 1 توكن ≈ 4 أحرف
        return Math.ceil(text.length / 4);
    }
}
exports.BaseStation = BaseStation;
