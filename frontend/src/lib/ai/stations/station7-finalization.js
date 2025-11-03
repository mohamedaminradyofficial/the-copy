"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Station7Finalization = void 0;
const base_station_1 = require("../core/pipeline/base-station");
const saveText_1 = require("../utils/saveText");
const logger_1 = __importDefault(require("../utils/logger"));
class Station7Finalization extends base_station_1.BaseStation {
  outputDir;
  constructor(config, geminiService, outputDir = "analysis_output") {
    super(config, geminiService);
    this.outputDir = outputDir;
  }
  async process(input) {
    const startTime = Date.now();
    logger_1.default.info(
      "[S7] Starting comprehensive final report generation..."
    );
    try {
      const station1 = input.allPreviousStationsData.get(1);
      const station2 = input.allPreviousStationsData.get(2);
      const station3 = input.allPreviousStationsData.get(3);
      const station4 = input.allPreviousStationsData.get(4);
      const station5 = input.allPreviousStationsData.get(5);
      const station6 = input.station6Output;
      const scoreMatrix = this.calculateScoreMatrix(
        station1,
        station2,
        station3,
        station4,
        station5,
        station6
      );
      const [
        executiveSummary,
        overallAssessment,
        swotAnalysis,
        audienceResonance,
        rewritingSuggestions,
        finalConfidence,
      ] = await Promise.all([
        this.generateExecutiveSummary(
          station1,
          station2,
          station3,
          station4,
          station5,
          station6,
          scoreMatrix
        ),
        this.generateOverallAssessment(
          scoreMatrix,
          station1,
          station2,
          station3,
          station4,
          station5,
          station6
        ),
        this.generateSWOTAnalysis(
          station1,
          station2,
          station3,
          station4,
          station5,
          station6
        ),
        this.analyzeAudienceResonance(
          station1,
          station2,
          station3,
          station4,
          station5,
          station6
        ),
        this.generateRewritingSuggestions(station6, station4, station5),
        this.calculateFinalConfidence(
          station1,
          station2,
          station3,
          station4,
          station5,
          station6
        ),
      ]);
      const finalReport = {
        executiveSummary,
        overallAssessment,
        strengthsAnalysis: swotAnalysis.strengths,
        weaknessesIdentified: swotAnalysis.weaknesses,
        opportunitiesForImprovement: swotAnalysis.opportunities,
        threatsToCoherence: swotAnalysis.threats,
        finalRecommendations: {
          mustDo: rewritingSuggestions
            .filter((s) => s.priority === "must")
            .map((s) => s.suggestedRewrite),
          shouldDo: rewritingSuggestions
            .filter((s) => s.priority === "should")
            .map((s) => s.suggestedRewrite),
          couldDo: rewritingSuggestions
            .filter((s) => s.priority === "could")
            .map((s) => s.suggestedRewrite),
        },
        audienceResonance,
        rewritingSuggestions,
      };
      const totalExecutionTime = Date.now() - startTime;
      const agentsUsed = this.extractAgentsUsed(
        station1,
        station2,
        station3,
        station4,
        station5,
        station6
      );
      const tokensUsed = this.calculateTotalTokens(
        station1,
        station2,
        station3,
        station4,
        station5,
        station6
      );
      const output = {
        finalReport,
        scoreMatrix,
        finalConfidence,
        metadata: {
          analysisTimestamp: new Date(),
          totalExecutionTime,
          stationsCompleted: 7,
          agentsUsed,
          tokensUsed,
          modelUsed: "gemini-2.5-pro",
          status: "Complete",
        },
      };
      await this.saveReports(output);
      logger_1.default.info(
        "[S7] Final report generation completed successfully"
      );
      return output;
    } catch (error) {
      logger_1.default.error("[S7] Error generating final report:", error);
      throw error;
    }
  }
  calculateScoreMatrix(s1, s2, s3, s4, s5, s6) {
    const foundation = this.calculateStationScore(s1);
    const conceptual = this.calculateStationScore(s2);
    const conflictNetwork = this.calculateStationScore(s3);
    const efficiency = s4?.efficiencyMetrics?.overallEfficiencyScore ?? 0;
    const dynamicSymbolic = this.calculateStation5Score(s5);
    const diagnostics = s6?.diagnosticsReport?.overallHealthScore ?? 0;
    const weights = {
      foundation: 0.15,
      conceptual: 0.15,
      conflictNetwork: 0.2,
      efficiency: 0.2,
      dynamicSymbolic: 0.15,
      diagnostics: 0.15,
    };
    const overall =
      foundation * weights.foundation +
      conceptual * weights.conceptual +
      conflictNetwork * weights.conflictNetwork +
      efficiency * weights.efficiency +
      dynamicSymbolic * weights.dynamicSymbolic +
      diagnostics * weights.diagnostics;
    return {
      foundation,
      conceptual,
      conflictNetwork,
      efficiency,
      dynamicSymbolic,
      diagnostics,
      overall: Math.round(overall * 100) / 100,
    };
  }
  calculateStationScore(station) {
    if (!station) return 0;
    const scores = [];
    if (typeof station.confidence === "number") scores.push(station.confidence);
    if (typeof station.qualityScore === "number")
      scores.push(station.qualityScore);
    if (typeof station.overallScore === "number")
      scores.push(station.overallScore);
    return scores.length > 0
      ? scores.reduce((a, b) => a + b) / scores.length
      : 50;
  }
  calculateStation5Score(s5) {
    if (!s5) return 0;
    const scores = [];
    if (s5.symbolicAnalysisResults?.depthScore)
      scores.push(s5.symbolicAnalysisResults.depthScore * 10);
    if (s5.symbolicAnalysisResults?.consistencyScore)
      scores.push(s5.symbolicAnalysisResults.consistencyScore * 10);
    if (s5.stylisticAnalysisResults?.overallToneAssessment?.toneConsistency) {
      scores.push(
        s5.stylisticAnalysisResults.overallToneAssessment.toneConsistency * 10
      );
    }
    return scores.length > 0
      ? scores.reduce((a, b) => a + b) / scores.length
      : 50;
  }
  async generateExecutiveSummary(s1, s2, s3, s4, s5, s6, scoreMatrix) {
    const prompt = `
بناءً على التحليل الشامل للنص الدرامي عبر 7 محطات متخصصة، قم بكتابة ملخص تنفيذي شامل (200-300 كلمة) يتضمن:

1. الطبيعة الأساسية للعمل والنوع الدرامي
2. أبرز نقاط القوة الإبداعية
3. التحديات الرئيسية المكتشفة
4. التقييم العام (النتيجة: ${scoreMatrix?.overall || 0}/100)
5. التوصية النهائية

معلومات أساسية:
- عدد الشخصيات: ${s3?.networkSummary?.charactersCount || 0}
- عدد الصراعات: ${s3?.networkSummary?.conflictsCount || 0}
- نتيجة الكفاءة: ${s4?.efficiencyMetrics?.overallEfficiencyScore || 0}/100
- نتيجة الصحة العامة: ${s6?.diagnosticsReport?.overallHealthScore || 0}/100
- المشاكل الحرجة: ${s6?.diagnosticsReport?.criticalIssues?.length || 0}

اكتب بأسلوب احترافي وموضوعي، مع التركيز على القيمة الإبداعية والإمكانات الإنتاجية.
`;
    const response = await this.geminiService.generate({
      prompt,
      model: "gemini-2.5-pro",
      temperature: 0.3,
      maxTokens: 1024,
      systemInstruction:
        "أنت محلل دراما محترف متخصص في كتابة ملخصات تنفيذية دقيقة وشاملة.",
    });
    return this.extractText(response.content);
  }
  async generateOverallAssessment(scoreMatrix, s1, s2, s3, s4, s5, s6) {
    const narrativeQualityScore =
      (scoreMatrix.foundation + scoreMatrix.conceptual) / 2;
    const structuralIntegrityScore = scoreMatrix.conflictNetwork;
    const characterDevelopmentScore = this.calculateCharacterScore(s3);
    const conflictEffectivenessScore = this.calculateConflictScore(s3, s4);
    const thematicDepthScore = scoreMatrix.dynamicSymbolic;
    const overallScore = scoreMatrix.overall;
    const rating = this.determineRating(overallScore);
    return {
      narrativeQualityScore: Math.round(narrativeQualityScore),
      structuralIntegrityScore: Math.round(structuralIntegrityScore),
      characterDevelopmentScore: Math.round(characterDevelopmentScore),
      conflictEffectivenessScore: Math.round(conflictEffectivenessScore),
      thematicDepthScore: Math.round(thematicDepthScore),
      overallScore: Math.round(overallScore),
      rating,
    };
  }
  calculateCharacterScore(s3) {
    if (!s3?.networkAnalysisResults) return 50;
    const scores = [];
    if (s3.networkAnalysisResults.characterDevelopmentQuality) {
      scores.push(s3.networkAnalysisResults.characterDevelopmentQuality * 10);
    }
    if (s3.networkAnalysisResults.characterComplexity) {
      scores.push(s3.networkAnalysisResults.characterComplexity * 10);
    }
    return scores.length > 0
      ? scores.reduce((a, b) => a + b) / scores.length
      : 50;
  }
  calculateConflictScore(s3, s4) {
    if (!s3 && !s4) return 50;
    const scores = [];
    if (s4?.efficiencyMetrics?.conflictCohesion) {
      scores.push(s4.efficiencyMetrics.conflictCohesion * 10);
    }
    if (s3?.networkAnalysisResults?.conflictIntensity) {
      scores.push(s3.networkAnalysisResults.conflictIntensity * 10);
    }
    return scores.length > 0
      ? scores.reduce((a, b) => a + b) / scores.length
      : 50;
  }
  determineRating(score) {
    if (score >= 90) return "Masterpiece";
    if (score >= 80) return "Excellent";
    if (score >= 65) return "Good";
    if (score >= 50) return "Fair";
    return "Needs Work";
  }
  async generateSWOTAnalysis(s1, s2, s3, s4, s5, s6) {
    const prompt = `
بناءً على التحليل الشامل للنص، حدد:

1. نقاط القوة (Strengths): 5 نقاط رئيسية تميز العمل
2. نقاط الضعف (Weaknesses): 5 نقاط تحتاج معالجة
3. الفرص (Opportunities): 5 فرص للتحسين والتطوير
4. التهديدات (Threats): 5 تهديدات محتملة للتماسك السردي

المعلومات المتاحة:
- المشاكل الحرجة من المحطة 6: ${s6?.diagnosticsReport?.criticalIssues?.map((i) => i.description).join("; ") || "لا يوجد"}
- التحذيرات: ${s6?.diagnosticsReport?.warnings?.map((w) => w.description).join("; ") || "لا يوجد"}
- نتيجة الكفاءة: ${s4?.efficiencyMetrics?.overallEfficiencyScore || 0}/100

قدم كل نقطة في جملة واحدة واضحة ومحددة. استخدم تنسيق نصي منظم بالشكل التالي:

نقاط القوة:
- نقطة 1
- نقطة 2
...

نقاط الضعف:
- نقطة 1
- نقطة 2
...

الفرص:
- نقطة 1
- نقطة 2
...

التهديدات:
- نقطة 1
- نقطة 2
...
`;
    const response = await this.geminiService.generate({
      prompt,
      model: "gemini-2.5-pro",
      temperature: 0.4,
      maxTokens: 2048,
      systemInstruction:
        "أنت محلل استراتيجي متخصص في تحليل SWOT للأعمال الدرامية. قدم ردك بصيغة نصية منظمة فقط.",
    });
    try {
      const text = this.extractText(response.content);
      const parsed = this.parseStructuredText(text);
      return {
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        opportunities: parsed.opportunities || [],
        threats: parsed.threats || [],
      };
    } catch {
      return {
        strengths: ["تحليل SWOT غير متاح"],
        weaknesses: ["تحليل SWOT غير متاح"],
        opportunities: ["تحليل SWOT غير متاح"],
        threats: ["تحليل SWOT غير متاح"],
      };
    }
  }
  async analyzeAudienceResonance(s1, s2, s3, s4, s5, s6) {
    const prompt = `
قم بتحليل مدى صدى العمل الدرامي مع الجمهور وتوقع استجابتهم:

معلومات العمل:
- النوع: ${s2?.hybridGenre?.genre || "غير محدد"}
- الجمهور المستهدف: ${s2?.targetAudience?.primaryAudience?.ageGroup || "غير محدد"}
- القوة الرمزية: ${s5?.symbolicAnalysisResults?.depthScore || 0}/10
- التناسق الأسلوبي: ${s5?.stylisticAnalysisResults?.overallToneAssessment?.toneConsistency || 0}/10

قدم تقييماً بصيغة نصية منظمة:

التأثير العاطفي: [0-10]
التفاعل الفكري: [0-10]
القابلية للارتباط: [0-10]
قابلية التذكر: [0-10]
الإمكانات الفيروسية: [0-10]

الاستجابة الأولية:
[وصف الاستجابة الأولية المتوقعة]

الاستجابات الثانوية:
- استجابة 1
- استجابة 2

العناصر المثيرة للجدل:
- عنصر 1
- عنصر 2
`;
    const response = await this.geminiService.generate({
      prompt,
      model: "gemini-2.5-pro",
      temperature: 0.5,
      maxTokens: 1024,
      systemInstruction:
        "أنت محلل جمهور متخصص في توقع استجابات الجمهور للأعمال الدرامية. قدم تقييماً نصياً منظماً فقط.",
    });
    try {
      const text = this.extractText(response.content);
      const parsed = this.parseAudienceResonance(text);
      return {
        emotionalImpact: parsed.emotionalImpact || 5,
        intellectualEngagement: parsed.intellectualEngagement || 5,
        relatability: parsed.relatability || 5,
        memorability: parsed.memorability || 5,
        viralPotential: parsed.viralPotential || 5,
        primaryResponse: parsed.primaryResponse || "غير متاح",
        secondaryResponses: parsed.secondaryResponses || [],
        controversialElements: parsed.controversialElements || [],
      };
    } catch {
      return {
        emotionalImpact: 5,
        intellectualEngagement: 5,
        relatability: 5,
        memorability: 5,
        viralPotential: 5,
        primaryResponse: "تحليل الجمهور غير متاح",
        secondaryResponses: [],
        controversialElements: [],
      };
    }
  }
  async generateRewritingSuggestions(s6, s4, s5) {
    if (!s6?.diagnosticsReport) return [];
    const criticalIssues = s6.diagnosticsReport.criticalIssues || [];
    const warnings = s6.diagnosticsReport.warnings || [];
    const allIssues = [...criticalIssues, ...warnings].slice(0, 10);
    if (allIssues.length === 0) return [];
    const prompt = `
بناءً على المشاكل المكتشفة، قدم اقتراحات محددة لإعادة الكتابة:

المشاكل:
${allIssues.map((issue, i) => `${i + 1}. ${issue.description} (نوع: ${issue.type}, خطورة: ${issue.severity})`).join("\n")}

لكل مشكلة، قدم:
- الموقع المحدد
- المشكلة الحالية
- الاقتراح المحدد لإعادة الكتابة
- التبرير
- التأثير المتوقع (0-10)
- الأولوية: must/should/could

قدم قائمة منظمة بالشكل التالي لكل اقتراح:

الاقتراح [رقم]:
الموقع: [موقع المشكلة]
المشكلة الحالية: [المشكلة]
الاقتراح: [الاقتراح]
التبرير: [التبرير]
التأثير: [0-10]
الأولوية: [must/should/could]

---
`;
    const response = await this.geminiService.generate({
      prompt,
      model: "gemini-2.5-pro",
      temperature: 0.4,
      maxTokens: 4096,
      systemInstruction:
        "أنت مستشار كتابة إبداعية متخصص. قدم اقتراحات محددة وقابلة للتنفيذ بصيغة نصية منظمة.",
    });
    try {
      const text = this.extractText(response.content);
      return this.parseRewritingSuggestions(text);
    } catch {
      return [];
    }
  }
  async calculateFinalConfidence(s1, s2, s3, s4, s5, s6) {
    const stationConfidences = new Map();
    if (s1?.uncertaintyReport?.confidenceScore)
      stationConfidences.set("station1", s1.uncertaintyReport.confidenceScore);
    if (s2?.uncertaintyReport?.confidenceScore)
      stationConfidences.set("station2", s2.uncertaintyReport.confidenceScore);
    if (s3?.uncertaintyReport?.confidenceScore)
      stationConfidences.set("station3", s3.uncertaintyReport.confidenceScore);
    if (s4?.uncertaintyReport?.confidenceScore)
      stationConfidences.set("station4", s4.uncertaintyReport.confidenceScore);
    if (s5?.uncertaintyReport?.confidenceScore)
      stationConfidences.set("station5", s5.uncertaintyReport.confidenceScore);
    if (s6?.uncertaintyReport?.confidenceScore)
      stationConfidences.set("station6", s6.uncertaintyReport.confidenceScore);
    const confidenceValues = Array.from(stationConfidences.values());
    const overallConfidence =
      confidenceValues.length > 0
        ? confidenceValues.reduce((a, b) => a + b) / confidenceValues.length
        : 0.7;
    const epistemicUncertainties = [];
    const aleatoricUncertainties = [];
    const resolvableIssues = [];
    [s1, s2, s3, s4, s5, s6].forEach((station, index) => {
      if (station?.uncertaintyReport?.epistemicUncertainty) {
        epistemicUncertainties.push(
          ...station.uncertaintyReport.epistemicUncertainty
        );
      }
      if (station?.uncertaintyReport?.aleatoricUncertainty) {
        aleatoricUncertainties.push(
          ...station.uncertaintyReport.aleatoricUncertainty
        );
      }
      if (station?.uncertaintyReport?.resolvableIssues) {
        resolvableIssues.push(...station.uncertaintyReport.resolvableIssues);
      }
    });
    return {
      overallConfidence: Math.round(overallConfidence * 100) / 100,
      stationConfidences,
      uncertaintyAggregation: {
        epistemicUncertainties: [...new Set(epistemicUncertainties)],
        aleatoricUncertainties: [...new Set(aleatoricUncertainties)],
        resolvableIssues: [...new Set(resolvableIssues)],
      },
    };
  }
  extractAgentsUsed(s1, s2, s3, s4, s5, s6) {
    const agents = new Set();
    [s1, s2, s3, s4, s5, s6].forEach((station, index) => {
      if (station?.agentsUsed && Array.isArray(station.agentsUsed)) {
        station.agentsUsed.forEach((agent) => agents.add(agent));
      }
    });
    return Array.from(agents);
  }
  calculateTotalTokens(s1, s2, s3, s4, s5, s6) {
    let total = 0;
    [s1, s2, s3, s4, s5, s6].forEach((station) => {
      if (station?.tokensUsed && typeof station.tokensUsed === "number") {
        total += station.tokensUsed;
      }
    });
    return total;
  }
  async saveReports(output) {
    try {
      const humanReadableReport = this.generateHumanReadableReport(output);
      await (0, saveText_1.saveText)(
        `${this.outputDir}/final-report.txt`,
        humanReadableReport
      );
      const markdownReport = this.generateMarkdownReport(output);
      await (0, saveText_1.saveText)(
        `${this.outputDir}/final-report.md`,
        markdownReport
      );
      logger_1.default.info("[S7] All text report formats saved successfully");
    } catch (error) {
      logger_1.default.error("[S7] Error saving reports:", error);
    }
  }
  generateHumanReadableReport(output) {
    const { finalReport, scoreMatrix, metadata } = output;
    return `
تقرير التحليل الدرامي الشامل
=====================================

تاريخ التحليل: ${metadata.analysisTimestamp.toISOString()}
وقت التنفيذ: ${(metadata.totalExecutionTime / 1000).toFixed(2)} ثانية
المحطات المكتملة: ${metadata.stationsCompleted}
النموذج المستخدم: ${metadata.modelUsed}
إجمالي التوكنات: ${metadata.tokensUsed.toLocaleString()}

=====================================
الملخص التنفيذي
=====================================
${finalReport.executiveSummary}

=====================================
التقييم الشامل
=====================================
النتيجة الإجمالية: ${finalReport.overallAssessment.overallScore}/100
التصنيف: ${finalReport.overallAssessment.rating}

جودة السرد: ${finalReport.overallAssessment.narrativeQualityScore}/100
سلامة البنية: ${finalReport.overallAssessment.structuralIntegrityScore}/100
تطوير الشخصيات: ${finalReport.overallAssessment.characterDevelopmentScore}/100
فعالية الصراع: ${finalReport.overallAssessment.conflictEffectivenessScore}/100
العمق الموضوعي: ${finalReport.overallAssessment.thematicDepthScore}/100

=====================================
مصفوفة النتائج
=====================================
المحطة 1 (التأسيس): ${scoreMatrix.foundation.toFixed(2)}
المحطة 2 (المفاهيم): ${scoreMatrix.conceptual.toFixed(2)}
المحطة 3 (شبكة الصراعات): ${scoreMatrix.conflictNetwork.toFixed(2)}
المحطة 4 (الكفاءة): ${scoreMatrix.efficiency.toFixed(2)}
المحطة 5 (الديناميكية والرمزية): ${scoreMatrix.dynamicSymbolic.toFixed(2)}
المحطة 6 (التشخيص): ${scoreMatrix.diagnostics.toFixed(2)}
النتيجة الإجمالية: ${scoreMatrix.overall.toFixed(2)}

=====================================
نقاط القوة
=====================================
${finalReport.strengthsAnalysis.map((s, i) => `${i + 1}. ${s}`).join("\n")}

=====================================
نقاط الضعف
=====================================
${finalReport.weaknessesIdentified.map((w, i) => `${i + 1}. ${w}`).join("\n")}

=====================================
فرص التحسين
=====================================
${finalReport.opportunitiesForImprovement.map((o, i) => `${i + 1}. ${o}`).join("\n")}

=====================================
التهديدات للتماسك
=====================================
${finalReport.threatsToCoherence.map((t, i) => `${i + 1}. ${t}`).join("\n")}

=====================================
صدى الجمهور المتوقع
=====================================
التأثير العاطفي: ${finalReport.audienceResonance.emotionalImpact}/10
التفاعل الفكري: ${finalReport.audienceResonance.intellectualEngagement}/10
القابلية للارتباط: ${finalReport.audienceResonance.relatability}/10
قابلية التذكر: ${finalReport.audienceResonance.memorability}/10
الإمكانات الفيروسية: ${finalReport.audienceResonance.viralPotential}/10

الاستجابة الأولية المتوقعة:
${finalReport.audienceResonance.primaryResponse}

=====================================
التوصيات النهائية
=====================================

يجب عمله (Must Do):
${finalReport.finalRecommendations.mustDo.map((r, i) => `${i + 1}. ${r}`).join("\n")}

ينبغي عمله (Should Do):
${finalReport.finalRecommendations.shouldDo.map((r, i) => `${i + 1}. ${r}`).join("\n")}

يمكن عمله (Could Do):
${finalReport.finalRecommendations.couldDo.map((r, i) => `${i + 1}. ${r}`).join("\n")}

=====================================
اقتراحات إعادة الكتابة (أعلى ${Math.min(5, finalReport.rewritingSuggestions.length)} اقتراحات)
=====================================
${finalReport.rewritingSuggestions
  .slice(0, 5)
  .map(
    (s, i) => `
${i + 1}. ${s.location}
   المشكلة: ${s.currentIssue}
   الاقتراح: ${s.suggestedRewrite}
   التبرير: ${s.reasoning}
   التأثير: ${s.impact}/10
   الأولوية: ${s.priority}
`
  )
  .join("\n")}

=====================================
تقرير الثقة النهائي
=====================================
الثقة الإجمالية: ${(output.finalConfidence.overallConfidence * 100).toFixed(1)}%

الوكلاء المستخدمون: ${metadata.agentsUsed.join(", ") || "لا يوجد"}

=====================================
نهاية التقرير
=====================================
`.trim();
  }
  generateMarkdownReport(output) {
    const { finalReport, scoreMatrix, metadata } = output;
    return `
# تقرير التحليل الدرامي الشامل

**تاريخ التحليل:** ${metadata.analysisTimestamp.toISOString()}  
**وقت التنفيذ:** ${(metadata.totalExecutionTime / 1000).toFixed(2)} ثانية  
**المحطات المكتملة:** ${metadata.stationsCompleted}  
**النموذج المستخدم:** ${metadata.modelUsed}  
**إجمالي التوكنات:** ${metadata.tokensUsed.toLocaleString()}

---

## الملخص التنفيذي

${finalReport.executiveSummary}

---

## التقييم الشامل

### النتيجة الإجمالية
**${finalReport.overallAssessment.overallScore}/100** - **${finalReport.overallAssessment.rating}**

| المعيار | النتيجة |
|---------|---------|
| جودة السرد | ${finalReport.overallAssessment.narrativeQualityScore}/100 |
| سلامة البنية | ${finalReport.overallAssessment.structuralIntegrityScore}/100 |
| تطوير الشخصيات | ${finalReport.overallAssessment.characterDevelopmentScore}/100 |
| فعالية الصراع | ${finalReport.overallAssessment.conflictEffectivenessScore}/100 |
| العمق الموضوعي | ${finalReport.overallAssessment.thematicDepthScore}/100 |

---

## مصفوفة النتائج

| المحطة | النتيجة |
|--------|---------|
| المحطة 1: التأسيس | ${scoreMatrix.foundation.toFixed(2)} |
| المحطة 2: المفاهيم | ${scoreMatrix.conceptual.toFixed(2)} |
| المحطة 3: شبكة الصراعات | ${scoreMatrix.conflictNetwork.toFixed(2)} |
| المحطة 4: الكفاءة | ${scoreMatrix.efficiency.toFixed(2)} |
| المحطة 5: الديناميكية والرمزية | ${scoreMatrix.dynamicSymbolic.toFixed(2)} |
| المحطة 6: التشخيص | ${scoreMatrix.diagnostics.toFixed(2)} |
| **النتيجة الإجمالية** | **${scoreMatrix.overall.toFixed(2)}** |

---

## تحليل SWOT

### نقاط القوة (Strengths)
${finalReport.strengthsAnalysis.map((s, i) => `${i + 1}. ${s}`).join("\n")}

### نقاط الضعف (Weaknesses)
${finalReport.weaknessesIdentified.map((w, i) => `${i + 1}. ${w}`).join("\n")}

### فرص التحسين (Opportunities)
${finalReport.opportunitiesForImprovement.map((o, i) => `${i + 1}. ${o}`).join("\n")}

### التهديدات للتماسك (Threats)
${finalReport.threatsToCoherence.map((t, i) => `${i + 1}. ${t}`).join("\n")}

---

## صدى الجمهور المتوقع

| المعيار | النتيجة |
|---------|---------|
| التأثير العاطفي | ${finalReport.audienceResonance.emotionalImpact}/10 |
| التفاعل الفكري | ${finalReport.audienceResonance.intellectualEngagement}/10 |
| القابلية للارتباط | ${finalReport.audienceResonance.relatability}/10 |
| قابلية التذكر | ${finalReport.audienceResonance.memorability}/10 |
| الإمكانات الفيروسية | ${finalReport.audienceResonance.viralPotential}/10 |

**الاستجابة الأولية المتوقعة:**  
${finalReport.audienceResonance.primaryResponse}

---

## التوصيات النهائية

### يجب عمله (Must Do)
${finalReport.finalRecommendations.mustDo.map((r, i) => `${i + 1}. ${r}`).join("\n")}

### ينبغي عمله (Should Do)
${finalReport.finalRecommendations.shouldDo.map((r, i) => `${i + 1}. ${r}`).join("\n")}

### يمكن عمله (Could Do)
${finalReport.finalRecommendations.couldDo.map((r, i) => `${i + 1}. ${r}`).join("\n")}

---

## اقتراحات إعادة الكتابة (أعلى اقتراحات)

${finalReport.rewritingSuggestions
  .slice(0, 5)
  .map(
    (s, i) => `
### ${i + 1}. ${s.location}

- **المشكلة:** ${s.currentIssue}
- **الاقتراح:** ${s.suggestedRewrite}
- **التبرير:** ${s.reasoning}
- **التأثير:** ${s.impact}/10
- **الأولوية:** ${s.priority}
`
  )
  .join("\n")}

---

## تقرير الثقة النهائي

**الثقة الإجمالية:** ${(output.finalConfidence.overallConfidence * 100).toFixed(1)}%

**الوكلاء المستخدمون:** ${metadata.agentsUsed.join(", ") || "لا يوجد"}

---

*تم إنشاء هذا التقرير بواسطة نظام المحطات السبع للتحليل الدرامي*
`.trim();
  }
  extractText(content) {
    if (typeof content === "string") return content;
    if (content && typeof content === "object") {
      if (content.raw) return content.raw;
      if (content.text) return content.text;
      if (content.report) return content.report;
      return String(content);
    }
    return String(content || "");
  }
  parseStructuredText(text) {
    const result = {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
    };
    const sections = {
      "نقاط القوة": "strengths",
      "نقاط الضعف": "weaknesses",
      الفرص: "opportunities",
      التهديدات: "threats",
    };
    let currentSection = null;
    const lines = text.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      for (const [arabicName, englishKey] of Object.entries(sections)) {
        if (trimmed.includes(arabicName)) {
          currentSection = englishKey;
          break;
        }
      }
      if (currentSection && trimmed.startsWith("-")) {
        const item = trimmed.substring(1).trim();
        if (item) {
          result[currentSection].push(item);
        }
      }
    }
    return result;
  }
  parseAudienceResonance(text) {
    const result = {
      secondaryResponses: [],
      controversialElements: [],
    };
    const lines = text.split("\n");
    let currentSection = "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes("التأثير العاطفي")) {
        const match = trimmed.match(/(\d+)/);
        if (match) result.emotionalImpact = parseInt(match[1], 10);
      } else if (trimmed.includes("التفاعل الفكري")) {
        const match = trimmed.match(/(\d+)/);
        if (match) result.intellectualEngagement = parseInt(match[1], 10);
      } else if (trimmed.includes("القابلية للارتباط")) {
        const match = trimmed.match(/(\d+)/);
        if (match) result.relatability = parseInt(match[1], 10);
      } else if (trimmed.includes("قابلية التذكر")) {
        const match = trimmed.match(/(\d+)/);
        if (match) result.memorability = parseInt(match[1], 10);
      } else if (trimmed.includes("الإمكانات الفيروسية")) {
        const match = trimmed.match(/(\d+)/);
        if (match) result.viralPotential = parseInt(match[1], 10);
      } else if (trimmed.includes("الاستجابة الأولية")) {
        currentSection = "primary";
      } else if (trimmed.includes("الاستجابات الثانوية")) {
        currentSection = "secondary";
      } else if (trimmed.includes("العناصر المثيرة للجدل")) {
        currentSection = "controversial";
      } else if (trimmed.startsWith("-")) {
        const item = trimmed.substring(1).trim();
        if (currentSection === "secondary" && item) {
          result.secondaryResponses.push(item);
        } else if (currentSection === "controversial" && item) {
          result.controversialElements.push(item);
        }
      } else if (
        currentSection === "primary" &&
        trimmed &&
        !trimmed.includes(":")
      ) {
        result.primaryResponse = trimmed;
      }
    }
    return result;
  }
  parseRewritingSuggestions(text) {
    const suggestions = [];
    const blocks = text.split("---").filter((b) => b.trim());
    for (const block of blocks) {
      const lines = block
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l);
      const suggestion = {};
      for (const line of lines) {
        if (line.includes("الموقع:")) {
          suggestion.location = line.split("الموقع:")[1].trim();
        } else if (line.includes("المشكلة الحالية:")) {
          suggestion.currentIssue = line.split("المشكلة الحالية:")[1].trim();
        } else if (line.includes("الاقتراح:")) {
          suggestion.suggestedRewrite = line.split("الاقتراح:")[1].trim();
        } else if (line.includes("التبرير:")) {
          suggestion.reasoning = line.split("التبرير:")[1].trim();
        } else if (line.includes("التأثير:")) {
          const match = line.match(/(\d+)/);
          if (match) suggestion.impact = parseInt(match[1], 10);
        } else if (line.includes("الأولوية:")) {
          const priority = line.split("الأولوية:")[1].trim().toLowerCase();
          if (priority.includes("must")) suggestion.priority = "must";
          else if (priority.includes("should")) suggestion.priority = "should";
          else suggestion.priority = "could";
        }
      }
      if (
        suggestion.location &&
        suggestion.currentIssue &&
        suggestion.suggestedRewrite
      ) {
        suggestions.push(suggestion);
      }
    }
    return suggestions;
  }
  extractRequiredData(input) {
    return {
      charactersCount: input.conflictNetwork.characters.size,
      conflictsCount: input.conflictNetwork.conflicts.size,
      station6Issues:
        input.station6Output.diagnosticsReport.criticalIssues.length,
      stationsTracked: input.allPreviousStationsData.size,
    };
  }
  getErrorFallback() {
    return {
      finalReport: {
        executiveSummary: "فشل في توليد التقرير النهائي",
        overallAssessment: {
          narrativeQualityScore: 0,
          structuralIntegrityScore: 0,
          characterDevelopmentScore: 0,
          conflictEffectivenessScore: 0,
          thematicDepthScore: 0,
          overallScore: 0,
          rating: "Needs Work",
        },
        strengthsAnalysis: [],
        weaknessesIdentified: [],
        opportunitiesForImprovement: [],
        threatsToCoherence: [],
        finalRecommendations: {
          mustDo: [],
          shouldDo: [],
          couldDo: [],
        },
        audienceResonance: {
          emotionalImpact: 0,
          intellectualEngagement: 0,
          relatability: 0,
          memorability: 0,
          viralPotential: 0,
          primaryResponse: "",
          secondaryResponses: [],
          controversialElements: [],
        },
        rewritingSuggestions: [],
      },
      scoreMatrix: {
        foundation: 0,
        conceptual: 0,
        conflictNetwork: 0,
        efficiency: 0,
        dynamicSymbolic: 0,
        diagnostics: 0,
        overall: 0,
      },
      finalConfidence: {
        overallConfidence: 0,
        stationConfidences: new Map(),
        uncertaintyAggregation: {
          epistemicUncertainties: [],
          aleatoricUncertainties: [],
          resolvableIssues: [],
        },
      },
      metadata: {
        analysisTimestamp: new Date(),
        totalExecutionTime: 0,
        stationsCompleted: 0,
        agentsUsed: [],
        tokensUsed: 0,
        modelUsed: "gemini-2.5-pro",
        status: "Failed",
      },
    };
  }
}
exports.Station7Finalization = Station7Finalization;
//# sourceMappingURL=station7-finalization.js.map
