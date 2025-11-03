"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LOG_LEVELS = {
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  DEBUG: "debug",
};
class Logger {
  logLevel = "INFO";
  setLevel(level) {
    this.logLevel = level;
  }
  shouldLog(level) {
    const levels = ["DEBUG", "INFO", "WARN", "ERROR"];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }
  formatMessage(level, message, meta) {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
  }
  error(message, meta) {
    if (this.shouldLog("ERROR")) {
      console.error(this.formatMessage("error", message, meta));
    }
  }
  warn(message, meta) {
    if (this.shouldLog("WARN")) {
      console.warn(this.formatMessage("warn", message, meta));
    }
  }
  info(message, meta) {
    if (this.shouldLog("INFO")) {
      console.info(this.formatMessage("info", message, meta));
    }
  }
  debug(message, meta) {
    if (this.shouldLog("DEBUG")) {
      console.debug(this.formatMessage("debug", message, meta));
    }
  }
}
const logger = new Logger();
exports.default = logger;
//# sourceMappingURL=logger.js.map
