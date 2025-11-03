"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Station4EfficiencyMetrics = void 0;
const base_station_1 = require("../core/pipeline/base-station");
const gemini_service_1 = require("./gemini-service");
const gemini_core_1 = require("@/lib/ai/gemini-core");
const constitutional_1 = require("../constitutional");
class LiteraryQualityAnalyzer {
  geminiService;
  constructor(geminiService) {
    this.geminiService = geminiService;
  }
  async assess(text, previousAnalysis) {
    const prompt = `
    قم بتقييم الجودة الأدبية للنص التالي بناءً على التحليل السابق للشبكة الدرامية.

    النص:
    ${text.substring(0, 3000)}

    تحليل الشبكة:
    ${JSON.stringify(previousAnalysis.networkSummary, null, 2)}

    قم بتقييم الجودة في المجالات التالية (من 0 إلى 100):
    1. الجودة النثرية (أسلوب الكتابة، اللغة، الوصف)
    2. جودة الهيكل (بداية، وسط، نهاية)
    3. جودة تطوير الشخصيات
    4. جودة الحوار
    5. العمق الموضوعي

    قدم النتائج بتنسيق JSON:
    {
      "overallQuality": 85,
      "proseQuality": 80,
      "structureQuality": 85,
      "characterDevelopmentQuality": 90,
      "dialogueQuality": 75,
      "thematicDepth": 85
    }
    `;
    const result = await this.geminiService.generate({
      prompt,
      model: gemini_service_1.GeminiModel.PRO,
      temperature: 0.3,
    });
    try {
      return JSON.parse((0, gemini_core_1.toText)(result.content) || "{}");
    } catch (e) {
      console.error("Failed to parse literary quality assessment:", e);
      return {
        overallQuality: 50,
        proseQuality: 50,
        structureQuality: 50,
        characterDevelopmentQuality: 50,
        dialogueQuality: 50,
        thematicDepth: 50,
      };
    }
  }
}
class ProducibilityAnalyzer {
  geminiService;
  constructor(geminiService) {
    this.geminiService = geminiService;
  }
  async evaluate(text, network) {
    const prompt = `
    قم بتقييم إمكانية إنتاج النص التالي بناءً على شبكة الصراعات والشخصيات.

    النص:
    ${text.substring(0, 3000)}

    شبكة الصراعات:
    ${JSON.stringify(network, null, 2)}

    قم بتقييم:
    1. الجدوى التقنية (0-10)
    2. تقدير الميزانية (low/medium/high/very_high)
    3. تحديات الإنتاج (حدد 3-5 تحديات رئيسية مع وصف وشدة)
    4. متطلبات المواقع (حدد المواقع المطلوبة)
    5. هل هناك حاجة لمؤثرات خاصة؟
    6. حجم الطاقم التمثيلي

    قدم النتائج بتنسيق JSON:
    {
      "technicalFeasibility": 7,
      "budgetEstimate": "medium",
      "productionChallenges": [
        {
          "type": "location",
          "description": "مواقع تاريخية صعبة الوصول",
          "severity": "medium"
        }
      ],
      "locationRequirements": ["قصر تاريخي", "مدينة قديمة"],
      "specialEffectsNeeded": true,
      "castSize": 12
    }
    `;
    const result = await this.geminiService.generate({
      prompt,
      model: gemini_service_1.GeminiModel.PRO,
      temperature: 0.3,
    });
    try {
      return JSON.parse((0, gemini_core_1.toText)(result.content) || "{}");
    } catch (e) {
      console.error("Failed to parse producibility analysis:", e);
      return {
        technicalFeasibility: 5,
        budgetEstimate: "medium",
        productionChallenges: [],
        locationRequirements: [],
        specialEffectsNeeded: false,
        castSize: 5,
      };
    }
  }
}
class RhythmMappingAgent {
  geminiService;
  constructor(geminiService) {
    this.geminiService = geminiService;
  }
  async analyze(text) {
    const prompt = `
    قم بتحليل إيقاع النص التالي وتحديد وتيرة المشاهد والتوتر.

    النص:
    ${text.substring(0, 4000)}

    قم بتحليل:
    1. الإيقاع العام (very_slow/slow/medium/fast/very_fast)
    2. تباين الإيقاع (0-10)
    3. أطوال المشاهد (قائمة بالأرقام)
    4. تحليل الأفعال (متوسط الإيقاع والتوتر لكل فعل)
    5. توصيات لتحسين الإيقاع

    قدم النتائج بتنسيق JSON:
    {
      "overallPace": "medium",
      "paceVariation": 6,
      "sceneLengths": [5, 8, 12, 6, 15],
      "actBreakdown": [
        {
          "act": 1,
          "averagePace": "medium",
          "tensionProgression": [3, 5, 7, 4]
        }
      ],
      "recommendations": ["زيادة التوتر في الفعل الثاني", "تقصير المشاهد الطويلة"]
    }
    `;
    const result = await this.geminiService.generate({
      prompt,
      model: gemini_service_1.GeminiModel.PRO,
      temperature: 0.3,
    });
    try {
      return JSON.parse((0, gemini_core_1.toText)(result.content) || "{}");
    } catch (e) {
      console.error("Failed to parse rhythm analysis:", e);
      return {
        overallPace: "medium",
        paceVariation: 5,
        sceneLengths: [],
        actBreakdown: [],
        recommendations: [],
      };
    }
  }
}
class RecommendationsGenerator {
  geminiService;
  constructor(geminiService) {
    this.geminiService = geminiService;
  }
  async generate(metrics, quality, producibility, rhythm) {
    const prompt = `
    بناءً على التحليلات التالية، قم بتوليد توصيات محددة وعملية لتحسين النص:

    مقاييس الكفاءة:
    ${JSON.stringify(metrics, null, 2)}

    تقييم الجودة:
    ${JSON.stringify(quality, null, 2)}

    تحليل الإنتاج:
    ${JSON.stringify(producibility, null, 2)}

    تحليل الإيقاع:
    ${JSON.stringify(rhythm, null, 2)}

    قدم التوصيات في ثلاث فئات:
    1. إجراءات الأولوية (إجراءات عاجلة وعالية التأثير)
    2. إصلاحات سريعة (تغييرات بسيطة وسريعة التنفيذ)
    3. مراجعات هيكلية (تغييرات أكبر قد تتطلب إعادة كتابة)

    قدم النتائج بتنسيق JSON:
    {
      "priorityActions": ["إجراء 1", "إجراء 2"],
      "quickFixes": ["إصلاح 1", "إصلاح 2"],
      "structuralRevisions": ["مراجعة 1", "مراجعة 2"]
    }
    `;
    const result = await this.geminiService.generate({
      prompt,
      model: gemini_service_1.GeminiModel.PRO,
      temperature: 0.4,
    });
    try {
      return JSON.parse((0, gemini_core_1.toText)(result.content) || "{}");
    } catch (e) {
      console.error("Failed to parse recommendations:", e);
      return {
        priorityActions: ["فشل توليد التوصيات"],
        quickFixes: [],
        structuralRevisions: [],
      };
    }
  }
}
class Station4EfficiencyMetrics extends base_station_1.BaseStation {
  literaryQualityAnalyzer;
  producibilityAnalyzer;
  rhythmMappingAgent;
  recommendationsGenerator;
  constructor(config, geminiService) {
    super(config, geminiService);
    this.literaryQualityAnalyzer = new LiteraryQualityAnalyzer(geminiService);
    this.producibilityAnalyzer = new ProducibilityAnalyzer(geminiService);
    this.rhythmMappingAgent = new RhythmMappingAgent(geminiService);
    this.recommendationsGenerator = new RecommendationsGenerator(geminiService);
  }
  async process(input) {
    const startTime = Date.now();
    const agentsUsed = [];
    let tokensUsed = 0;
    const options = {
      enableConstitutionalAI: input.options?.enableConstitutionalAI ?? true,
      enableUncertaintyQuantification:
        input.options?.enableUncertaintyQuantification ?? true,
      temperature: input.options?.temperature ?? 0.3,
    };
    try {
      const efficiencyMetrics = await this.calculateEfficiencyMetrics(
        input.station3Output.conflictNetwork
      );
      agentsUsed.push("EfficiencyMetrics");
      const literaryQuality = await this.literaryQualityAnalyzer.assess(
        input.originalText,
        input.station3Output
      );
      agentsUsed.push("LiteraryQualityAnalyzer");
      const producibilityAnalysis = await this.producibilityAnalyzer.evaluate(
        input.originalText,
        input.station3Output.conflictNetwork
      );
      agentsUsed.push("ProducibilityAnalyzer");
      const rhythmAnalysis = await this.rhythmMappingAgent.analyze(
        input.originalText
      );
      agentsUsed.push("RhythmMappingAgent");
      const qualityAssessment = {
        literary: literaryQuality.overallQuality,
        technical: producibilityAnalysis.technicalFeasibility * 10,
        commercial: this.calculateCommercialPotential(
          literaryQuality,
          producibilityAnalysis
        ),
        overall: 0,
      };
      qualityAssessment.overall =
        qualityAssessment.literary * 0.4 +
        qualityAssessment.technical * 0.3 +
        qualityAssessment.commercial * 0.3;
      const recommendations = await this.recommendationsGenerator.generate(
        efficiencyMetrics,
        qualityAssessment,
        producibilityAnalysis,
        rhythmAnalysis
      );
      agentsUsed.push("RecommendationsGenerator");
      let finalRecommendations = recommendations;
      if (options.enableConstitutionalAI) {
        const constitutionalCheck = await this.checkConstitutionalCompliance(
          JSON.stringify(recommendations),
          input.originalText
        );
        if (!constitutionalCheck.compliant) {
          finalRecommendations = JSON.parse(
            constitutionalCheck.correctedAnalysis
          );
        }
        agentsUsed.push("ConstitutionalAI");
      }
      let uncertaintyReport = {
        overallConfidence: 0.8,
        uncertainties: [],
      };
      if (options.enableUncertaintyQuantification) {
        uncertaintyReport = await this.quantifyUncertainty(
          JSON.stringify({
            efficiencyMetrics,
            qualityAssessment,
            producibilityAnalysis,
            rhythmAnalysis,
            recommendations: finalRecommendations,
          }),
          input.originalText
        );
        agentsUsed.push("UncertaintyQuantification");
      }
      const analysisTime = Date.now() - startTime;
      return {
        efficiencyMetrics,
        qualityAssessment,
        producibilityAnalysis,
        rhythmAnalysis,
        recommendations: finalRecommendations,
        uncertaintyReport,
        metadata: {
          analysisTimestamp: new Date(),
          status: "Success",
          analysisTime,
          agentsUsed,
          tokensUsed,
        },
      };
    } catch (error) {
      console.error("Error in Station 4:", error);
      return this.getErrorFallback();
    }
  }
  async calculateEfficiencyMetrics(conflictNetwork) {
    const charactersCount = conflictNetwork.characters.size;
    const relationshipsCount = conflictNetwork.relationships.size;
    const conflictsCount = conflictNetwork.conflicts.size;
    const characterEfficiency = Math.min(
      100,
      Math.max(0, 100 - (charactersCount - 7) * 5)
    );
    const relationshipEfficiency = Math.min(
      100,
      Math.max(0, 100 - (relationshipsCount - charactersCount * 1.5) * 3)
    );
    const conflictEfficiency = Math.min(
      100,
      Math.max(0, 100 - (conflictsCount - charactersCount * 0.8) * 4)
    );
    const narrativeEfficiency = {
      characterEfficiency,
      relationshipEfficiency,
      conflictEfficiency,
    };
    const overallEfficiencyScore =
      characterEfficiency * 0.3 +
      relationshipEfficiency * 0.3 +
      conflictEfficiency * 0.4;
    let overallRating;
    if (overallEfficiencyScore >= 80) overallRating = "Excellent";
    else if (overallEfficiencyScore >= 60) overallRating = "Good";
    else if (overallEfficiencyScore >= 40) overallRating = "Fair";
    else if (overallEfficiencyScore >= 20) overallRating = "Poor";
    else overallRating = "Critical";
    const conflictCohesion = Math.min(
      1,
      Math.max(0, conflictsCount / charactersCount)
    );
    const dramaticBalance = {
      balanceScore: Math.min(
        1,
        Math.max(0, 1 - Math.abs(1 - conflictsCount / charactersCount))
      ),
      characterInvolvementGini: this.calculateGiniCoefficient(conflictNetwork),
    };
    const narrativeDensity =
      (conflictsCount + relationshipsCount) / charactersCount;
    const redundancyMetrics = {
      characterRedundancy: Math.max(0, (charactersCount - 7) / charactersCount),
      relationshipRedundancy: Math.max(
        0,
        (relationshipsCount - charactersCount * 1.5) / relationshipsCount
      ),
      conflictRedundancy: Math.max(
        0,
        (conflictsCount - charactersCount * 0.8) / conflictsCount
      ),
    };
    return {
      overallEfficiencyScore,
      overallRating,
      conflictCohesion,
      dramaticBalance,
      narrativeEfficiency,
      narrativeDensity,
      redundancyMetrics,
    };
  }
  calculateGiniCoefficient(conflictNetwork) {
    const characterInvolvement = [];
    for (const [characterId, character] of conflictNetwork.characters) {
      let involvementCount = 0;
      for (const [conflictId, conflict] of conflictNetwork.conflicts) {
        if (conflict.participants.includes(characterId)) {
          involvementCount++;
        }
      }
      characterInvolvement.push(involvementCount);
    }
    characterInvolvement.sort((a, b) => a - b);
    const n = characterInvolvement.length;
    if (n === 0) return 0;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += (2 * (i + 1) - n - 1) * characterInvolvement[i];
    }
    const totalInvolvement = characterInvolvement.reduce((a, b) => a + b, 0);
    if (totalInvolvement === 0) return 0;
    return sum / (n * totalInvolvement);
  }
  calculateCommercialPotential(literaryQuality, producibility) {
    const literaryScore = literaryQuality.overallQuality;
    const technicalScore = producibility.technicalFeasibility * 10;
    let budgetScore = 50;
    if (producibility.budgetEstimate === "low") budgetScore = 40;
    else if (producibility.budgetEstimate === "medium") budgetScore = 70;
    else if (producibility.budgetEstimate === "high") budgetScore = 60;
    else if (producibility.budgetEstimate === "very_high") budgetScore = 30;
    let castScore = 50;
    if (producibility.castSize <= 5) castScore = 40;
    else if (producibility.castSize <= 10) castScore = 70;
    else if (producibility.castSize <= 15) castScore = 60;
    else castScore = 30;
    return Math.round(
      literaryScore * 0.4 +
        technicalScore * 0.2 +
        budgetScore * 0.2 +
        castScore * 0.2
    );
  }
  async checkConstitutionalCompliance(analysis, originalText) {
    try {
      return await (0, constitutional_1.constitutionalCheck)(
        analysis,
        originalText,
        this.geminiService
      );
    } catch (error) {
      console.error("Constitutional check failed:", error);
      return {
        compliant: true,
        correctedAnalysis: analysis,
        improvementScore: 1.0,
      };
    }
  }
  async quantifyUncertainty(analysis, originalText) {
    try {
      const uncertainty = await (0, constitutional_1.quantifyUncertainty)(
        analysis,
        {
          originalText,
          analysisType: "efficiency_metrics",
        },
        this.geminiService
      );
      return {
        overallConfidence: uncertainty.confidence,
        uncertainties: uncertainty.sources.map((source) => ({
          type: uncertainty.type,
          aspect: source.aspect,
          note: source.reason,
        })),
      };
    } catch (error) {
      console.error("Uncertainty quantification failed:", error);
      return {
        overallConfidence: 0.5,
        uncertainties: [
          {
            type: "epistemic",
            aspect: "general",
            note: "فشل في تقييم عدم اليقين",
          },
        ],
      };
    }
  }
  extractRequiredData(input) {
    return {
      charactersCount: input.station3Output.conflictNetwork.characters.size,
      relationshipsCount:
        input.station3Output.conflictNetwork.relationships.size,
      conflictsCount: input.station3Output.conflictNetwork.conflicts.size,
    };
  }
  getErrorFallback() {
    return {
      efficiencyMetrics: {
        overallEfficiencyScore: 0,
        overallRating: "Critical",
        conflictCohesion: 0,
        dramaticBalance: {
          balanceScore: 0,
          characterInvolvementGini: 1,
        },
        narrativeEfficiency: {
          characterEfficiency: 0,
          relationshipEfficiency: 0,
          conflictEfficiency: 0,
        },
        narrativeDensity: 0,
        redundancyMetrics: {
          characterRedundancy: 0,
          relationshipRedundancy: 0,
          conflictRedundancy: 0,
        },
      },
      qualityAssessment: {
        literary: 0,
        technical: 0,
        commercial: 0,
        overall: 0,
      },
      producibilityAnalysis: {
        technicalFeasibility: 0,
        budgetEstimate: "very_high",
        productionChallenges: [],
        locationRequirements: [],
        specialEffectsNeeded: false,
        castSize: 0,
      },
      rhythmAnalysis: {
        overallPace: "medium",
        paceVariation: 0,
        sceneLengths: [],
        actBreakdown: [],
        recommendations: [],
      },
      recommendations: {
        priorityActions: ["خطأ في التحليل"],
        quickFixes: ["خطأ في التحليل"],
        structuralRevisions: ["خطأ في التحليل"],
      },
      uncertaintyReport: {
        overallConfidence: 0,
        uncertainties: [],
      },
      metadata: {
        analysisTimestamp: new Date(),
        status: "Failed",
        analysisTime: 0,
        agentsUsed: [],
        tokensUsed: 0,
      },
    };
  }
}
exports.Station4EfficiencyMetrics = Station4EfficiencyMetrics;
//# sourceMappingURL=station4-efficiency-metrics.js.map
