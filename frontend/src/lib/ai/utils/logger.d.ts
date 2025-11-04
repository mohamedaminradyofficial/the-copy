interface LogLevel {
    ERROR: 'error';
    WARN: 'warn';
    INFO: 'info';
    DEBUG: 'debug';
}
declare class Logger {
    private logLevel;
    setLevel(level: keyof LogLevel): void;
    private shouldLog;
    private formatMessage;
    error(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
}
declare const logger: Logger;
export default logger;
//# sourceMappingURL=logger.d.ts.map