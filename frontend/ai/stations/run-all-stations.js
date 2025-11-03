"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisPipeline = exports.validateAndNormalizePipelineInput = exports.PipelineInputSchema = void 0;
exports.createAnalysisPipeline = createAnalysisPipeline;
exports.createQuickPipeline = createQuickPipeline;
exports.createRobustPipeline = createRobustPipeline;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const orchestrator_1 = require("./orchestrator");
const gemini_service_1 = require("./gemini-service");
const saveText_1 = require("../utils/saveText");
const logger_1 = __importDefault(require("../utils/logger"));
const types_1 = require("./types");
Object.defineProperty(exports, "PipelineInputSchema", { enumerable: true, get: function () { return types_1.PipelineInputSchema; } });
Object.defineProperty(exports, "validateAndNormalizePipelineInput", { enumerable: true, get: function () { return types_1.validateAndNormalizePipelineInput; } });
class AnalysisPipeline {
    constructor(config) {
        if (!config.apiKey) {
            logger_1.default.warn("[AnalysisPipeline] GEMINI_API_KEY not set. AI analysis will fail.");
            this.geminiService =
                config.geminiService ??
                    new gemini_service_1.GeminiService({
                        apiKey: "dummy-key-ai-disabled",
                        defaultModel: gemini_service_1.GeminiModel.FLASH,
                        fallbackModel: gemini_service_1.GeminiModel.FLASH,
                        maxRetries: 0,
                        timeout: 1000,
                    });
        }
        else {
            this.geminiService =
                config.geminiService ??
                    new gemini_service_1.GeminiService({
                        apiKey: config.apiKey,
                        defaultModel: config.geminiModel ?? gemini_service_1.GeminiModel.PRO,
                        fallbackModel: config.fallbackModel ?? gemini_service_1.GeminiModel.FLASH,
                        maxRetries: config.maxRetries ?? 3,
                        timeout: config.timeout ?? 120000,
                    });
        }
        this.outputDirectory =
            config.outputDir ?? path.join(process.cwd(), "analysis_output");
        if (!fs.existsSync(this.outputDirectory)) {
            fs.mkdirSync(this.outputDirectory, { recursive: true });
        }
        this.enableProgressTracking = config.enableProgressTracking ?? true;
        this.enableDetailedLogging = config.enableDetailedLogging ?? true;
        this.delayBetweenStations = config.delayBetweenStations ?? 6000;
        this.orchestrator = new orchestrator_1.StationsOrchestrator({
            geminiService: this.geminiService,
            outputDirectory: this.outputDirectory,
            enableCaching: config.enableCaching ?? false,
            enableRetry: config.enableRetry ?? true,
            maxRetries: config.maxRetries ?? 3,
            retryDelay: config.retryDelay ?? 5000,
            enableProgressTracking: this.enableProgressTracking,
            enableDetailedLogging: this.enableDetailedLogging,
        });
    }
    async runFullAnalysis(input) {
        const data = types_1.PipelineInputSchema.parse(input);
        logger_1.default.info("[AnalysisPipeline] Starting full analysis", {
            textLength: data.screenplayText.length,
            language: data.language,
            title: data.context?.title ?? "untitled",
        });
        const startedAt = Date.now();
        try {
            const orchestrationResult = await this.orchestrator.execute(data.screenplayText, data.context?.title ?? "untitled-project");
            const finishedAt = Date.now();
            const performanceMetrics = this.calculatePerformanceMetrics(orchestrationResult);
            await this.saveOrchestrationResult(orchestrationResult);
            const result = {
                stationOutputs: orchestrationResult.stationOutputs,
                pipelineMetadata: {
                    stationsCompleted: orchestrationResult.metadata.stationsCompleted,
                    totalExecutionTime: orchestrationResult.metadata.totalExecutionTime,
                    startedAt: orchestrationResult.metadata.startedAt,
                    finishedAt: orchestrationResult.metadata.finishedAt,
                },
                orchestrationResult,
                performanceMetrics,
            };
            logger_1.default.info("[AnalysisPipeline] Analysis completed successfully", {
                stationsCompleted: orchestrationResult.metadata.stationsCompleted,
                stationsFailed: orchestrationResult.metadata.stationsFailed,
                totalExecutionTime: orchestrationResult.metadata.totalExecutionTime,
                successRate: performanceMetrics.successRate,
            });
            return result;
        }
        catch (error) {
            logger_1.default.error("[AnalysisPipeline] Analysis failed with critical error:", error);
            throw error;
        }
    }
    async runPartialAnalysis(input, options) {
        const data = types_1.PipelineInputSchema.parse(input);
        logger_1.default.info("[AnalysisPipeline] Starting partial analysis", {
            textLength: data.screenplayText.length,
            startFromStation: options.startFromStation,
            endAtStation: options.endAtStation,
            skipStations: options.skipStations,
        });
        try {
            const orchestrationResult = await this.orchestrator.execute(data.screenplayText, data.context?.title ?? "untitled-project", options);
            const performanceMetrics = this.calculatePerformanceMetrics(orchestrationResult);
            await this.saveOrchestrationResult(orchestrationResult);
            const result = {
                stationOutputs: orchestrationResult.stationOutputs,
                pipelineMetadata: {
                    stationsCompleted: orchestrationResult.metadata.stationsCompleted,
                    totalExecutionTime: orchestrationResult.metadata.totalExecutionTime,
                    startedAt: orchestrationResult.metadata.startedAt,
                    finishedAt: orchestrationResult.metadata.finishedAt,
                },
                orchestrationResult,
                performanceMetrics,
            };
            logger_1.default.info("[AnalysisPipeline] Partial analysis completed", {
                stationsCompleted: orchestrationResult.metadata.stationsCompleted,
                stationsFailed: orchestrationResult.metadata.stationsFailed,
            });
            return result;
        }
        catch (error) {
            logger_1.default.error("[AnalysisPipeline] Partial analysis failed:", error);
            throw error;
        }
    }
    calculatePerformanceMetrics(result) {
        const completedStations = result.progressLog.filter((p) => p.status === "completed" && p.duration != null);
        if (completedStations.length === 0) {
            return {
                averageStationTime: 0,
                slowestStation: { number: 0, name: "N/A", duration: 0 },
                fastestStation: { number: 0, name: "N/A", duration: 0 },
                totalRetries: 0,
                successRate: 0,
            };
        }
        const durations = completedStations.map((s) => s.duration);
        const averageStationTime = durations.reduce((a, b) => a + b, 0) / durations.length;
        const slowest = completedStations.reduce((prev, curr) => curr.duration > prev.duration ? curr : prev);
        const fastest = completedStations.reduce((prev, curr) => curr.duration < prev.duration ? curr : prev);
        const totalRetries = result.progressLog.reduce((sum, p) => sum + (p.attempt ?? 1) - 1, 0);
        const successRate = (result.metadata.stationsCompleted /
            (result.metadata.stationsCompleted + result.metadata.stationsFailed)) *
            100;
        return {
            averageStationTime: Math.round(averageStationTime),
            slowestStation: {
                number: slowest.stationNumber,
                name: slowest.stationName,
                duration: slowest.duration,
            },
            fastestStation: {
                number: fastest.stationNumber,
                name: fastest.stationName,
                duration: fastest.duration,
            },
            totalRetries,
            successRate: Math.round(successRate * 100) / 100,
        };
    }
    async saveOrchestrationResult(result) {
        try {
            const filename = `orchestration-result-${Date.now()}.txt`;
            const filepath = path.join(this.outputDirectory, filename);
            const separator = "=====================";
            const textReport = `
تقرير نتائج التنسيق
${separator}
تاريخ البدء: ${result.metadata.startedAt}
تاريخ الانتهاء: ${result.metadata.finishedAt}
وقت التنفيذ الكلي: ${result.metadata.totalExecutionTime}ms
المحطات المكتملة: ${result.metadata.stationsCompleted}
المحطات الفاشلة: ${result.metadata.stationsFailed}
النتيجة الإجمالية: ${result.metadata.overallScore || "غير متاح"}
التصنيف الإجمالي: ${result.metadata.overallRating || "غير متاح"}
الحالة: ${result.success ? "نجح" : "فشل"}

سجل التقدم:
${result.progressLog.map((p) => `- المحطة ${p.stationNumber} (${p.stationName}): ${p.status} - المدة: ${p.duration || 0}ms`).join("\n")}

${result.errors.length > 0 ? `\nالأخطاء:\n${result.errors.map((e) => `- المحطة ${e.station}: ${e.error} (${e.timestamp})`).join("\n")}` : ""}
      `.trim();
            await (0, saveText_1.saveText)(filepath, textReport);
            logger_1.default.info("[AnalysisPipeline] Orchestration result saved as text", {
                filepath,
            });
        }
        catch (error) {
            logger_1.default.error("[AnalysisPipeline] Failed to save orchestration result:", error);
        }
    }
    getStationStatus() {
        return this.orchestrator.getStationStatus();
    }
    getProgressLog() {
        return this.orchestrator.getProgressLog();
    }
    getErrors() {
        return this.orchestrator.getErrors();
    }
    clearProgress() {
        this.orchestrator.clearProgressLog();
    }
    async healthCheck() {
        let healthy = true;
        let geminiServiceHealthy = true;
        let outputDirectoryHealthy = true;
        const details = [];
        try {
            await this.geminiService.generate({
                prompt: "test",
                temperature: 0.1,
                maxTokens: 10,
            });
        }
        catch (error) {
            geminiServiceHealthy = false;
            healthy = false;
            details.push(`Gemini service error: ${error instanceof Error ? error.message : "Unknown"}`);
        }
        try {
            if (!fs.existsSync(this.outputDirectory)) {
                fs.mkdirSync(this.outputDirectory, { recursive: true });
            }
            const testFile = path.join(this.outputDirectory, ".health-check");
            fs.writeFileSync(testFile, "test");
            fs.unlinkSync(testFile);
        }
        catch (error) {
            outputDirectoryHealthy = false;
            healthy = false;
            details.push(`Output directory error: ${error instanceof Error ? error.message : "Unknown"}`);
        }
        return {
            healthy,
            geminiService: geminiServiceHealthy,
            outputDirectory: outputDirectoryHealthy,
            details: details.join("; "),
        };
    }
    async estimateAnalysisTime(textLength) {
        const baseTimePerStation = 30000;
        const timePerCharacter = 0.5;
        const overheadTime = 42000;
        const stationTimes = {
            station1: baseTimePerStation + textLength * timePerCharacter * 0.8,
            station2: baseTimePerStation + textLength * timePerCharacter * 0.6,
            station3: baseTimePerStation + textLength * timePerCharacter * 1.2,
            station4: baseTimePerStation + textLength * timePerCharacter * 0.4,
            station5: baseTimePerStation + textLength * timePerCharacter * 1.0,
            station6: baseTimePerStation + textLength * timePerCharacter * 0.7,
            station7: baseTimePerStation + textLength * timePerCharacter * 0.5,
        };
        const totalEstimatedTime = Object.values(stationTimes).reduce((a, b) => a + b, 0) + overheadTime;
        return {
            estimatedTime: Math.round(totalEstimatedTime),
            breakdown: Object.fromEntries(Object.entries(stationTimes).map(([key, value]) => [
                key,
                Math.round(value),
            ])),
        };
    }
}
exports.AnalysisPipeline = AnalysisPipeline;
async function createAnalysisPipeline(config) {
    const pipeline = new AnalysisPipeline(config);
    const health = await pipeline.healthCheck();
    if (!health.healthy) {
        logger_1.default.warn("[AnalysisPipeline] Pipeline created with health issues:", health.details);
    }
    else {
        logger_1.default.info("[AnalysisPipeline] Pipeline created successfully and healthy");
    }
    return pipeline;
}
function createQuickPipeline(apiKey, outputDir) {
    return new AnalysisPipeline({
        apiKey,
        outputDir,
        enableCaching: false,
        enableRetry: true,
        maxRetries: 2,
        retryDelay: 3000,
        enableProgressTracking: true,
        enableDetailedLogging: false,
        delayBetweenStations: 4000,
        geminiModel: gemini_service_1.GeminiModel.FLASH,
        fallbackModel: gemini_service_1.GeminiModel.FLASH_LITE,
        timeout: 60000,
    });
}
function createRobustPipeline(apiKey, outputDir) {
    return new AnalysisPipeline({
        apiKey,
        outputDir,
        enableCaching: true,
        enableRetry: true,
        maxRetries: 5,
        retryDelay: 10000,
        enableProgressTracking: true,
        enableDetailedLogging: true,
        delayBetweenStations: 8000,
        geminiModel: gemini_service_1.GeminiModel.PRO,
        fallbackModel: gemini_service_1.GeminiModel.FLASH,
        timeout: 180000,
    });
}
