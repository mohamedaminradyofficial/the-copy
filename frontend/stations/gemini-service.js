"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = exports.GeminiModel = void 0;
exports.createGeminiService = createGeminiService;
exports.createProductionGeminiService = createProductionGeminiService;
exports.createDevelopmentGeminiService = createDevelopmentGeminiService;
exports.getGeminiService = getGeminiService;
const genai_1 = require("@google/genai");
const logger_1 = __importDefault(require("../utils/logger"));
var GeminiModel;
(function (GeminiModel) {
    GeminiModel["PRO"] = "gemini-2.5-pro";
    GeminiModel["FLASH"] = "gemini-2.5-flash";
    GeminiModel["FLASH_LITE"] = "gemini-2.5-flash-lite";
})(GeminiModel || (exports.GeminiModel = GeminiModel = {}));
class GeminiService {
    constructor(config) {
        this.CACHE_TTL = 3600000;
        this.RATE_LIMIT_WINDOW = 60000;
        this.config = {
            ...config,
            enableCaching: config.enableCaching ?? true,
            enableRateLimiting: config.enableRateLimiting ?? true,
            requestsPerMinute: config.requestsPerMinute ?? 60,
        };
        this.ai = new genai_1.GoogleGenAI({ apiKey: config.apiKey });
        this.cache = new Map();
        this.rateLimitState = {
            requests: [],
            lastReset: Date.now(),
        };
        this.validateModels();
        this.startCacheCleanup();
    }
    validateModels() {
        const allowedModels = Object.values(GeminiModel);
        if (!allowedModels.includes(this.config.defaultModel)) {
            throw new Error(`Invalid model: ${this.config.defaultModel}. ` +
                `Only ${allowedModels.join(", ")} are allowed.`);
        }
        if (this.config.fallbackModel &&
            !allowedModels.includes(this.config.fallbackModel)) {
            throw new Error(`Invalid fallback model: ${this.config.fallbackModel}. ` +
                `Only ${allowedModels.join(", ")} are allowed.`);
        }
    }
    async generate(request) {
        this.validateModels();
        if (this.config.enableRateLimiting) {
            await this.enforceRateLimit();
        }
        const cacheKey = this.generateCacheKey(request);
        if (this.config.enableCaching) {
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                logger_1.default.info("[GeminiService] Returning cached response", { cacheKey });
                return cached;
            }
        }
        const primaryModel = request.model ?? this.config.defaultModel;
        let retryCount = 0;
        for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
            try {
                const response = await this.performRequest({
                    ...request,
                    model: primaryModel,
                }, attempt);
                response.metadata.retryCount = retryCount;
                if (this.config.enableCaching) {
                    this.saveToCache(cacheKey, response);
                }
                return response;
            }
            catch (primaryError) {
                retryCount++;
                if (attempt === this.config.maxRetries) {
                    if (this.config.fallbackModel &&
                        this.config.fallbackModel !== primaryModel) {
                        logger_1.default.warn("[GeminiService] Primary model exhausted retries. Trying fallback model.", {
                            primaryModel,
                            fallbackModel: this.config.fallbackModel,
                            attempt,
                        });
                        try {
                            const fallbackResponse = await this.performRequest({
                                ...request,
                                model: this.config.fallbackModel,
                            }, 0);
                            fallbackResponse.metadata.retryCount = retryCount;
                            if (this.config.enableCaching) {
                                this.saveToCache(cacheKey, fallbackResponse);
                            }
                            return fallbackResponse;
                        }
                        catch (fallbackError) {
                            return this.handleError(fallbackError, {
                                ...request,
                                model: this.config.fallbackModel,
                            });
                        }
                    }
                    return this.handleError(primaryError, {
                        ...request,
                        model: primaryModel,
                    });
                }
                const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 30000);
                logger_1.default.warn(`[GeminiService] Request failed. Retrying in ${backoffDelay}ms`, {
                    attempt: attempt + 1,
                    maxRetries: this.config.maxRetries,
                    error: primaryError instanceof Error ? primaryError.message : "Unknown",
                });
                await this.delay(backoffDelay);
            }
        }
        throw new Error("Unexpected: exceeded retry loop without resolution");
    }
    async performRequest(request, attemptNumber) {
        const startTime = Date.now();
        const modelName = request.model ?? this.config.defaultModel;
        const systemPart = request.systemInstruction
            ? `System Instructions: ${request.systemInstruction}\n\n`
            : "";
        const contextPart = request.context
            ? `Context: ${request.context}\n\n`
            : "";
        const fullPrompt = `${systemPart}${contextPart}${request.prompt}`;
        const finalConfig = {
            temperature: request.temperature ?? 0.7,
            maxOutputTokens: request.maxTokens ?? 8192,
            topP: request.topP ?? 0.95,
            topK: request.topK ?? 40,
        };
        if (request.stopSequences && request.stopSequences.length > 0) {
            finalConfig.stopSequences = request.stopSequences;
        }
        logger_1.default.info(`[GeminiService] Generating content with model ${modelName}`, {
            promptLength: fullPrompt.length,
            temperature: finalConfig.temperature,
            maxTokens: finalConfig.maxOutputTokens,
            attemptNumber,
        });
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Request timeout")), this.config.timeout);
        });
        const requestPromise = this.ai.models.generateContent({
            model: modelName,
            contents: fullPrompt,
            config: finalConfig,
        });
        const result = await Promise.race([requestPromise, timeoutPromise]);
        const text = result.text || "";
        const latency = Date.now() - startTime;
        const usage = this.estimateTokenUsage(fullPrompt, text);
        logger_1.default.info("[GeminiService] Content generated successfully", {
            model: modelName,
            latency,
            outputTokens: usage.completionTokens,
            attemptNumber,
        });
        return {
            model: modelName,
            content: this.parseResponse(text, request),
            usage,
            metadata: {
                timestamp: new Date(),
                latency,
                cached: false,
                retryCount: 0,
            },
        };
    }
    parseResponse(responseText, request) {
        const { validator, allowPartial, onPartialFallback } = request;
        if (validator) {
            const rawData = { raw: responseText };
            if (validator(rawData)) {
                return rawData;
            }
            if (allowPartial && onPartialFallback) {
                const partial = onPartialFallback(rawData);
                if (partial !== undefined) {
                    logger_1.default.info("[GeminiService] Using partial fallback for response");
                    return partial;
                }
            }
            logger_1.default.error("[GeminiService] Response failed validation");
            throw new Error("Gemini response failed validation");
        }
        return { raw: responseText };
    }
    async handleError(error, request) {
        const message = error instanceof Error ? error.message : "Unknown error";
        logger_1.default.error(`[GeminiService] Failed to generate content with model ${request.model}`, {
            error: message,
        });
        throw error instanceof Error ? error : new Error(message);
    }
    generateCacheKey(request) {
        const model = request.model ?? this.config.defaultModel;
        const temp = request.temperature ?? 0.7;
        const maxTokens = request.maxTokens ?? 8192;
        const keyData = {
            model,
            prompt: request.prompt.substring(0, 500),
            context: request.context?.substring(0, 200),
            systemInstruction: request.systemInstruction?.substring(0, 200),
            temp,
            maxTokens,
        };
        return JSON.stringify(keyData);
    }
    getFromCache(cacheKey) {
        const entry = this.cache.get(cacheKey);
        if (!entry)
            return null;
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(cacheKey);
            return null;
        }
        const response = { ...entry.response };
        response.metadata = { ...response.metadata, cached: true };
        return response;
    }
    saveToCache(cacheKey, response) {
        const entry = {
            response: { ...response },
            timestamp: Date.now(),
            expiresAt: Date.now() + this.CACHE_TTL,
        };
        this.cache.set(cacheKey, entry);
    }
    startCacheCleanup() {
        setInterval(() => {
            const now = Date.now();
            let cleaned = 0;
            for (const [key, entry] of this.cache.entries()) {
                if (now > entry.expiresAt) {
                    this.cache.delete(key);
                    cleaned++;
                }
            }
            if (cleaned > 0) {
                logger_1.default.info(`[GeminiService] Cache cleanup: removed ${cleaned} expired entries`);
            }
        }, 300000);
    }
    async enforceRateLimit() {
        const now = Date.now();
        if (now - this.rateLimitState.lastReset > this.RATE_LIMIT_WINDOW) {
            this.rateLimitState.requests = [];
            this.rateLimitState.lastReset = now;
        }
        this.rateLimitState.requests = this.rateLimitState.requests.filter((timestamp) => now - timestamp < this.RATE_LIMIT_WINDOW);
        if (this.rateLimitState.requests.length >=
            (this.config.requestsPerMinute ?? 60)) {
            const oldestRequest = this.rateLimitState.requests[0];
            const waitTime = oldestRequest ? this.RATE_LIMIT_WINDOW - (now - oldestRequest) : 0;
            logger_1.default.warn(`[GeminiService] Rate limit reached. Waiting ${waitTime}ms`, {
                requestsInWindow: this.rateLimitState.requests.length,
                limit: this.config.requestsPerMinute,
            });
            await this.delay(waitTime);
            return this.enforceRateLimit();
        }
        this.rateLimitState.requests.push(now);
    }
    estimateTokenUsage(prompt, completion) {
        const promptTokens = Math.ceil(prompt.length / 4);
        const completionTokens = Math.ceil(completion.length / 4);
        return {
            promptTokens,
            completionTokens,
            totalTokens: promptTokens + completionTokens,
        };
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    clearCache() {
        this.cache.clear();
        logger_1.default.info("[GeminiService] Cache cleared");
    }
    getCacheStats() {
        if (this.cache.size === 0) {
            return { size: 0, oldestEntry: 0, newestEntry: 0 };
        }
        const timestamps = Array.from(this.cache.values()).map((e) => e.timestamp);
        return {
            size: this.cache.size,
            oldestEntry: Math.min(...timestamps),
            newestEntry: Math.max(...timestamps),
        };
    }
    getRateLimitStats() {
        const now = Date.now();
        const requestsInWindow = this.rateLimitState.requests.filter((timestamp) => now - timestamp < this.RATE_LIMIT_WINDOW).length;
        return {
            requestsInWindow,
            limit: this.config.requestsPerMinute ?? 60,
            resetAt: this.rateLimitState.lastReset + this.RATE_LIMIT_WINDOW,
        };
    }
    async testConnection() {
        try {
            await this.generate({
                prompt: 'Test connection. Reply with "OK".',
                temperature: 0.1,
                maxTokens: 10,
            });
            logger_1.default.info("[GeminiService] Connection test successful");
            return true;
        }
        catch (error) {
            logger_1.default.error("[GeminiService] Connection test failed:", error);
            return false;
        }
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(updates) {
        this.config = { ...this.config, ...updates };
        this.validateModels();
        logger_1.default.info("[GeminiService] Configuration updated", updates);
    }
}
exports.GeminiService = GeminiService;
function createGeminiService(config) {
    return new GeminiService(config);
}
function createProductionGeminiService(apiKey) {
    return new GeminiService({
        apiKey,
        defaultModel: GeminiModel.PRO,
        fallbackModel: GeminiModel.FLASH,
        maxRetries: 5,
        timeout: 180000,
        enableCaching: true,
        enableRateLimiting: true,
        requestsPerMinute: 50,
    });
}
function createDevelopmentGeminiService(apiKey) {
    return new GeminiService({
        apiKey,
        defaultModel: GeminiModel.FLASH,
        fallbackModel: GeminiModel.FLASH_LITE,
        maxRetries: 2,
        timeout: 60000,
        enableCaching: false,
        enableRateLimiting: false,
        requestsPerMinute: 100,
    });
}
// Singleton instance for use in BaseStation and other core modules
let geminiServiceSingleton = null;
/**
 * Get or create the singleton GeminiService instance
 * Uses environment variables to determine the API key and configuration
 */
function getGeminiService(config) {
    if (!geminiServiceSingleton) {
        if (config) {
            geminiServiceSingleton = new GeminiService(config);
        }
        else {
            // Try to get API key from environment (server-side only)
            let apiKey;
            try {
                // Dynamic import to avoid issues if env.ts is not available
                const { getApiKey } = require("../../env");
                apiKey = getApiKey();
            }
            catch (error) {
                // Fallback: try to get from process.env directly
                apiKey =
                    process.env.GEMINI_API_KEY_PROD ||
                        process.env.GEMINI_API_KEY_STAGING ||
                        "";
            }
            if (!apiKey) {
                throw new Error("GeminiService requires a config object or GEMINI_API_KEY environment variable");
            }
            // Determine environment and create appropriate service
            const isProduction = process.env.NODE_ENV === "production";
            if (isProduction) {
                geminiServiceSingleton = createProductionGeminiService(apiKey);
            }
            else {
                geminiServiceSingleton = createDevelopmentGeminiService(apiKey);
            }
        }
    }
    return geminiServiceSingleton;
}
