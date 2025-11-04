"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStation = void 0;
const principles_1 = require("../constitutional/principles");
const uncertainty_quantification_1 = require("../constitutional/uncertainty-quantification");
class BaseStation {
  geminiService;
  stationName;
  stationNumber;
  constructor(geminiService, stationName, stationNumber) {
    this.geminiService = geminiService;
    this.stationName = stationName;
    this.stationNumber = stationNumber;
  }
  async run(input) {
    const startTime = Date.now();
    const options = this.mergeWithDefaultOptions(input.options);
    try {
      let result = await this.execute(input, options);
      if (options.enableConstitutionalCheck) {
        result = await this.applyConstitutionalCheck(result, input.text);
      }
      if (options.enableUncertaintyQuantification) {
        result = await this.applyUncertaintyQuantification(result, input);
      }
      const metadata = await this.createMetadata(startTime, options, input);
      return {
        result,
        metadata,
      };
    } catch (error) {
      console.error("Error in station:", this.stationName, error);
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
  mergeWithDefaultOptions(options) {
    return {
      enableConstitutionalCheck: true,
      enableUncertaintyQuantification: true,
      enableRAG: false,
      temperature: 0.4,
      maxTokens: 4096,
      ...options,
    };
  }
  async applyConstitutionalCheck(result, originalText) {
    try {
      const textsToCheck = this.extractTextsForConstitutionalCheck(result);
      const constitutionalResults = [];
      let hasViolations = false;
      let overallImprovementScore = 1.0;
      for (const text of textsToCheck) {
        const checkResult = await (0,
        principles_1.checkConstitutionalCompliance)(
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
          result = this.replaceTextInResult(
            result,
            text,
            checkResult.correctedAnalysis || text
          );
        }
      }
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
      result.constitutionalCheck = {
        checked: false,
        compliant: false,
        violations: [`فشل الفحص: ${error.message}`],
        improvementScore: 0,
      };
      return result;
    }
  }
  async applyUncertaintyQuantification(result, input) {
    try {
      const uncertaintyEngine = (0,
      uncertainty_quantification_1.getUncertaintyQuantificationEngine)(
        this.geminiService
      );
      const textsToQuantify =
        this.extractTextsForUncertaintyQuantification(result);
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
      overallConfidence =
        overallConfidence / Math.max(uncertaintyResults.length, 1);
      result.uncertaintyQuantification = {
        quantified: true,
        overallConfidence,
        uncertaintyType,
        sources: allSources.slice(0, 5),
      };
      return result;
    } catch (error) {
      console.error("Uncertainty quantification failed:", error);
      result.uncertaintyQuantification = {
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
              retrievalTime: 0,
            }
          : {
              wasChunked: false,
              chunksCount: 0,
              retrievalTime: 0,
            },
    };
  }
  extractTextsForConstitutionalCheck(result) {
    const texts = [];
    if (result.logline) texts.push(result.logline);
    if (result.storyStatement) texts.push(result.storyStatement);
    if (result.elevatorPitch) texts.push(result.elevatorPitch);
    if (result.executiveSummary) texts.push(result.executiveSummary);
    if (result.characterAnalysis) {
      for (const [character, analysis] of Object.entries(
        result.characterAnalysis
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
  extractTextsForUncertaintyQuantification(result) {
    return this.extractTextsForConstitutionalCheck(result);
  }
  replaceTextInResult(result, oldText, newText) {
    const newResult = JSON.parse(JSON.stringify(result));
    function replaceInObject(obj) {
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
  estimateTokensUsed(text) {
    return Math.ceil(text.length / 4);
  }
}
exports.BaseStation = BaseStation;
//# sourceMappingURL=base-station.js.map
