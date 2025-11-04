"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStation = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
class BaseStation {
  config;
  geminiService;
  constructor(config, geminiService) {
    this.config = config;
    this.geminiService = geminiService;
  }
  async execute(input) {
    const startTime = Date.now();
    try {
      if (this.config.inputValidation && !this.config.inputValidation(input)) {
        throw new Error("Invalid input data");
      }
      const output = await this.process(input);
      if (
        this.config.outputValidation &&
        !this.config.outputValidation(output)
      ) {
        throw new Error("Invalid output data");
      }
      const executionTime = Date.now() - startTime;
      if (this.config.performanceTracking) {
        logger_1.default.info(
          `Station ${this.config.name} executed in ${executionTime}ms`
        );
      }
      return { output, executionTime };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger_1.default.error(
        `Error in station ${this.config.name}: ${errorMessage}`,
        { input: this.extractRequiredData(input) }
      );
      return {
        output: this.getErrorFallback(),
        executionTime: Date.now() - startTime,
      };
    }
  }
}
exports.BaseStation = BaseStation;
//# sourceMappingURL=base-station.js.map
