"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = void 0;
class Logger {
    constructor() {
        this.logLevel = "INFO";
    }
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
exports.Logger = Logger;
exports.logger = new Logger();
