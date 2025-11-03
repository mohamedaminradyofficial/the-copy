"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.StationsOrchestrator = void 0;
const station1_text_analysis_1 = require("./station1-text-analysis");
const station2_conceptual_analysis_1 = require("./station2-conceptual-analysis");
const station3_network_builder_1 = require("./station3-network-builder");
const station4_efficiency_metrics_1 = require("./station4-efficiency-metrics");
const station5_dynamic_symbolic_stylistic_1 = require("./station5-dynamic-symbolic-stylistic");
const station6_diagnostics_treatment_1 = require("./station6-diagnostics-treatment");
const station7_finalization_1 = require("./station7-finalization");
const logger_1 = __importDefault(require("../utils/logger"));
class StationsOrchestrator {
  geminiService;
  outputDirectory;
  enableCaching;
  enableRetry;
  maxRetries;
  retryDelay;
  enableProgressTracking;
  enableDetailedLogging;
  progressLog = [];
  errors = [];
  constructor(config) {
    this.geminiService = config.geminiService;
    this.outputDirectory = config.outputDirectory;
    this.enableCaching = config.enableCaching ?? false;
    this.enableRetry = config.enableRetry ?? true;
    this.maxRetries = config.maxRetries ?? 3;
    this.retryDelay = config.retryDelay ?? 5000;
    this.enableProgressTracking = config.enableProgressTracking ?? true;
    this.enableDetailedLogging = config.enableDetailedLogging ?? true;
  }
  async execute(fullText, projectName = "untitled-project", options) {
    const startTime = Date.now();
    const startFromStation = options?.startFromStation ?? 1;
    const endAtStation = options?.endAtStation ?? 7;
    const skipStations = new Set(options?.skipStations ?? []);
    logger_1.default.info(
      "[Orchestrator] Starting comprehensive analysis pipeline",
      {
        projectName,
        textLength: fullText.length,
        startFromStation,
        endAtStation,
        skipStations: Array.from(skipStations),
      }
    );
    const stationOutputs = {};
    let stationsCompleted = 0;
    let stationsFailed = 0;
    const allPreviousStationsData = new Map();
    try {
      if (startFromStation <= 1 && endAtStation >= 1 && !skipStations.has(1)) {
        const station1Output = await this.executeStation(
          1,
          "Text Analysis",
          async () => {
            const station1 = new station1_text_analysis_1.Station1TextAnalysis(
              this.createStationConfig(1, "Text Analysis"),
              this.geminiService
            );
            const result = await station1.execute({
              fullText,
              projectName,
            });
            return result.output;
          }
        );
        if (station1Output) {
          stationOutputs.station1 = station1Output;
          allPreviousStationsData.set(1, station1Output);
          stationsCompleted++;
        } else {
          stationsFailed++;
        }
        await this.delay(6000);
      }
      if (startFromStation <= 2 && endAtStation >= 2 && !skipStations.has(2)) {
        const station2Output = await this.executeStation(
          2,
          "Conceptual Analysis",
          async () => {
            if (!stationOutputs.station1) {
              throw new Error("Station 1 output is required for Station 2");
            }
            const station2 =
              new station2_conceptual_analysis_1.Station2ConceptualAnalysis(
                this.createStationConfig(2, "Conceptual Analysis"),
                this.geminiService
              );
            const result = await station2.execute({
              station1Output: stationOutputs.station1,
              fullText,
            });
            return result.output;
          }
        );
        if (station2Output) {
          stationOutputs.station2 = station2Output;
          allPreviousStationsData.set(2, station2Output);
          stationsCompleted++;
        } else {
          stationsFailed++;
        }
        await this.delay(6000);
      }
      if (startFromStation <= 3 && endAtStation >= 3 && !skipStations.has(3)) {
        const station3Output = await this.executeStation(
          3,
          "Network Builder",
          async () => {
            if (!stationOutputs.station1 || !stationOutputs.station2) {
              throw new Error(
                "Station 1 and 2 outputs are required for Station 3"
              );
            }
            const station3 =
              new station3_network_builder_1.Station3NetworkBuilder(
                this.createStationConfig(3, "Network Builder"),
                this.geminiService
              );
            const result = await station3.execute({
              station1Output: stationOutputs.station1,
              station2Output: stationOutputs.station2,
              fullText,
            });
            return result.output;
          }
        );
        if (station3Output) {
          stationOutputs.station3 = station3Output;
          allPreviousStationsData.set(3, station3Output);
          stationsCompleted++;
        } else {
          stationsFailed++;
        }
        await this.delay(6000);
      }
      if (startFromStation <= 4 && endAtStation >= 4 && !skipStations.has(4)) {
        const station4Output = await this.executeStation(
          4,
          "Efficiency Metrics",
          async () => {
            if (!stationOutputs.station3) {
              throw new Error("Station 3 output is required for Station 4");
            }
            const station4 =
              new station4_efficiency_metrics_1.Station4EfficiencyMetrics(
                this.createStationConfig(4, "Efficiency Metrics"),
                this.geminiService
              );
            const result = await station4.execute({
              station3Output: stationOutputs.station3,
            });
            return result.output;
          }
        );
        if (station4Output) {
          stationOutputs.station4 = station4Output;
          allPreviousStationsData.set(4, station4Output);
          stationsCompleted++;
        } else {
          stationsFailed++;
        }
        await this.delay(6000);
      }
      if (startFromStation <= 5 && endAtStation >= 5 && !skipStations.has(5)) {
        const station5Output = await this.executeStation(
          5,
          "Dynamic/Symbolic/Stylistic Analysis",
          async () => {
            if (!stationOutputs.station3 || !stationOutputs.station4) {
              throw new Error(
                "Station 3 and 4 outputs are required for Station 5"
              );
            }
            const station5 =
              new station5_dynamic_symbolic_stylistic_1.Station5DynamicSymbolicStylistic(
                this.createStationConfig(
                  5,
                  "Dynamic/Symbolic/Stylistic Analysis"
                ),
                this.geminiService
              );
            const result = await station5.execute({
              conflictNetwork: stationOutputs.station3.conflictNetwork,
              station4Output: stationOutputs.station4,
              fullText,
            });
            return result.output;
          }
        );
        if (station5Output) {
          stationOutputs.station5 = station5Output;
          allPreviousStationsData.set(5, station5Output);
          stationsCompleted++;
        } else {
          stationsFailed++;
        }
        await this.delay(6000);
      }
      if (startFromStation <= 6 && endAtStation >= 6 && !skipStations.has(6)) {
        const station6Output = await this.executeStation(
          6,
          "Diagnostics & Treatment",
          async () => {
            if (!stationOutputs.station3 || !stationOutputs.station5) {
              throw new Error(
                "Station 3 and 5 outputs are required for Station 6"
              );
            }
            const station6 =
              new station6_diagnostics_treatment_1.Station6DiagnosticsAndTreatment(
                this.createStationConfig(6, "Diagnostics & Treatment"),
                this.geminiService
              );
            const result = await station6.execute({
              conflictNetwork: stationOutputs.station3.conflictNetwork,
              station5Output: stationOutputs.station5,
            });
            return result.output;
          }
        );
        if (station6Output) {
          stationOutputs.station6 = station6Output;
          allPreviousStationsData.set(6, station6Output);
          stationsCompleted++;
        } else {
          stationsFailed++;
        }
        await this.delay(6000);
      }
      if (startFromStation <= 7 && endAtStation >= 7 && !skipStations.has(7)) {
        const station7Output = await this.executeStation(
          7,
          "Finalization & Visualization",
          async () => {
            if (!stationOutputs.station3 || !stationOutputs.station6) {
              throw new Error(
                "Station 3 and 6 outputs are required for Station 7"
              );
            }
            const station7 = new station7_finalization_1.Station7Finalization(
              this.createStationConfig(7, "Finalization & Visualization"),
              this.geminiService,
              this.outputDirectory
            );
            const result = await station7.execute({
              conflictNetwork: stationOutputs.station3.conflictNetwork,
              station6Output: stationOutputs.station6,
              allPreviousStationsData,
            });
            return result.output;
          }
        );
        if (station7Output) {
          stationOutputs.station7 = station7Output;
          allPreviousStationsData.set(7, station7Output);
          stationsCompleted++;
        } else {
          stationsFailed++;
        }
      }
      const endTime = Date.now();
      const totalExecutionTime = endTime - startTime;
      const overallScore = stationOutputs.station7?.scoreMatrix?.overall;
      const overallRating =
        stationOutputs.station7?.finalReport?.overallAssessment?.rating;
      logger_1.default.info("[Orchestrator] Pipeline execution completed", {
        stationsCompleted,
        stationsFailed,
        totalExecutionTime,
        overallScore,
        overallRating,
      });
      return {
        success: stationsFailed === 0,
        stationOutputs,
        metadata: {
          totalExecutionTime,
          stationsCompleted,
          stationsFailed,
          startedAt: new Date(startTime).toISOString(),
          finishedAt: new Date(endTime).toISOString(),
          overallScore,
          overallRating,
        },
        progressLog: this.progressLog,
        errors: this.errors,
      };
    } catch (error) {
      logger_1.default.error(
        "[Orchestrator] Fatal error in pipeline execution:",
        error
      );
      const endTime = Date.now();
      return {
        success: false,
        stationOutputs,
        metadata: {
          totalExecutionTime: endTime - startTime,
          stationsCompleted,
          stationsFailed: stationsFailed + 1,
          startedAt: new Date(startTime).toISOString(),
          finishedAt: new Date(endTime).toISOString(),
        },
        progressLog: this.progressLog,
        errors: this.errors,
      };
    }
  }
  async executeStation(stationNumber, stationName, executor) {
    const progress = {
      stationNumber,
      stationName,
      status: "pending",
      attempt: 0,
    };
    this.progressLog.push(progress);
    let lastError = null;
    for (
      let attempt = 1;
      attempt <= (this.enableRetry ? this.maxRetries : 1);
      attempt++
    ) {
      try {
        progress.status = attempt > 1 ? "retrying" : "running";
        progress.attempt = attempt;
        progress.startTime = Date.now();
        if (this.enableDetailedLogging) {
          logger_1.default.info(
            `[Orchestrator] Executing Station ${stationNumber}: ${stationName}`,
            {
              attempt,
              maxAttempts: this.maxRetries,
            }
          );
        }
        const result = await executor();
        progress.endTime = Date.now();
        progress.duration = progress.endTime - progress.startTime;
        progress.status = "completed";
        if (this.enableDetailedLogging) {
          logger_1.default.info(
            `[Orchestrator] Station ${stationNumber} completed successfully`,
            {
              duration: progress.duration,
            }
          );
        }
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        progress.error = lastError.message;
        logger_1.default.error(
          `[Orchestrator] Station ${stationNumber} failed (attempt ${attempt}/${this.maxRetries})`,
          {
            error: lastError.message,
            willRetry: attempt < this.maxRetries && this.enableRetry,
          }
        );
        this.errors.push({
          station: stationNumber,
          error: lastError.message,
          timestamp: new Date().toISOString(),
        });
        if (attempt < this.maxRetries && this.enableRetry) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }
    progress.status = "failed";
    progress.endTime = Date.now();
    progress.duration = progress.endTime - (progress.startTime ?? 0);
    logger_1.default.error(
      `[Orchestrator] Station ${stationNumber} failed after ${this.maxRetries} attempts`,
      {
        lastError: lastError?.message,
      }
    );
    return null;
  }
  createStationConfig(stationNumber, stationName) {
    return {
      stationId: `station${stationNumber}`,
      name: stationName,
      description: stationName,
      cacheEnabled: this.enableCaching,
      performanceTracking: true,
      inputValidation: (input) => input !== undefined && input !== null,
      outputValidation: (output) => output !== undefined && output !== null,
    };
  }
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  getProgressLog() {
    return [...this.progressLog];
  }
  getErrors() {
    return [...this.errors];
  }
  getStationStatus() {
    const status = {};
    this.progressLog.forEach((progress) => {
      status[`station${progress.stationNumber}`] = progress.status;
    });
    return status;
  }
  clearProgressLog() {
    this.progressLog = [];
    this.errors = [];
  }
}
exports.StationsOrchestrator = StationsOrchestrator;
//# sourceMappingURL=orchestrator.js.map
