export declare enum GeminiModel {
    PRO = "gemini-2.5-pro",
    FLASH = "gemini-2.5-flash",
    FLASH_LITE = "gemini-2.5-flash-lite"
}
export interface GeminiConfig {
    apiKey: string;
    defaultModel: GeminiModel;
    maxRetries: number;
    timeout: number;
    fallbackModel?: GeminiModel;
    enableCaching?: boolean;
    enableRateLimiting?: boolean;
    requestsPerMinute?: number;
}
export interface GeminiRequest<T> {
    prompt: string;
    model?: GeminiModel;
    context?: string;
    systemInstruction?: string;
    temperature?: number;
    maxTokens?: number;
    validator?: (value: unknown) => value is T;
    allowPartial?: boolean;
    onPartialFallback?: (value: unknown) => T;
    stopSequences?: string[];
    topP?: number;
    topK?: number;
}
export interface GeminiResponse<T> {
    model: GeminiModel;
    content: T;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    metadata: {
        timestamp: Date;
        latency: number;
        cached: boolean;
        retryCount: number;
    };
}
export declare class GeminiService {
    private ai;
    private config;
    private cache;
    private rateLimitState;
    private readonly CACHE_TTL;
    private readonly RATE_LIMIT_WINDOW;
    constructor(config: GeminiConfig);
    private validateModels;
    generate<T>(request: GeminiRequest<T>): Promise<GeminiResponse<T>>;
    private performRequest;
    private parseResponse;
    private handleError;
    private generateCacheKey;
    private getFromCache;
    private saveToCache;
    private startCacheCleanup;
    private enforceRateLimit;
    private estimateTokenUsage;
    private delay;
    clearCache(): void;
    getCacheStats(): {
        size: number;
        oldestEntry: number;
        newestEntry: number;
    };
    getRateLimitStats(): {
        requestsInWindow: number;
        limit: number;
        resetAt: number;
    };
    testConnection(): Promise<boolean>;
    getConfig(): Readonly<GeminiConfig>;
    updateConfig(updates: Partial<GeminiConfig>): void;
}
export declare function createGeminiService(config: GeminiConfig): GeminiService;
export declare function createProductionGeminiService(apiKey: string): GeminiService;
export declare function createDevelopmentGeminiService(apiKey: string): GeminiService;
//# sourceMappingURL=gemini-service.d.ts.map