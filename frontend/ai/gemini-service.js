"use strict";
// lib/ai/gemini-service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = exports.GeminiModel = void 0;
exports.getGeminiService = getGeminiService;
const genai_1 = require("@google/genai");
var GeminiModel;
(function (GeminiModel) {
    GeminiModel["PRO"] = "gemini-2.0-flash-exp";
    GeminiModel["FLASH"] = "gemini-2.0-flash-exp";
})(GeminiModel || (exports.GeminiModel = GeminiModel = {}));
class GeminiService {
    constructor(config) {
        this.config = config;
        this.genAI = new genai_1.GoogleGenAI({ apiKey: config.apiKey });
    }
    async generate(request) {
        const primaryModel = request.model ?? this.config.defaultModel;
        try {
            return await this.performRequest({ ...request, model: primaryModel });
        }
        catch (primaryError) {
            if (this.config.fallbackModel &&
                this.config.fallbackModel !== primaryModel) {
                console.warn("Primary Gemini model failed. Falling back to secondary model.");
                return this.performRequest({
                    ...request,
                    model: this.config.fallbackModel,
                });
            }
            throw primaryError;
        }
    }
    async performRequest(request) {
        const startTime = Date.now();
        const modelName = request.model ?? this.config.defaultModel;
        const fullPrompt = `${request.systemInstruction || ""}\n\nContext: ${request.context || "N/A"}\n\nPrompt: ${request.prompt}`;
        const finalConfig = {
            temperature: request.temperature ?? 0.9,
            maxOutputTokens: request.maxTokens ?? 48192,
        };
        console.log("[Gemini Service] Generating content with model", modelName, {
            tokenLimit: finalConfig.maxOutputTokens,
            temperature: finalConfig.temperature,
        });
        const result = await this.genAI.models.generateContent({
            model: modelName,
            contents: fullPrompt,
            config: finalConfig,
        });
        const text = result.text || "";
        const usage = {
            promptTokens: Math.ceil(fullPrompt.length / 4),
            completionTokens: Math.ceil(text.length / 4),
            totalTokens: Math.ceil((fullPrompt.length + text.length) / 4),
        };
        return {
            model: modelName,
            content: this.parseResponse(text),
            usage,
            metadata: {
                timestamp: new Date(),
                latency: Date.now() - startTime,
            },
        };
    }
    parseResponse(responseText) {
        console.log("[AI] text generated");
        return { raw: responseText };
    }
    /**
     * دالة جديدة لتبسيط الاستخدام في BaseStation والأنظمة الأخرى
     * هذه الدالة تغلف وظيفة generate الأكثر تعقيداً
     */
    async generateContent(prompt, options = {}) {
        try {
            const requestParams = {
                prompt,
                temperature: options.temperature ?? 0.4,
                maxTokens: options.maxTokens ?? 4096,
            };
            if (options.systemInstruction !== undefined) {
                requestParams.systemInstruction = options.systemInstruction;
            }
            const response = await this.generate(requestParams);
            // إذا كان المحتوى كائناً به خاصية raw، نستخرجها
            if (typeof response.content === "object" &&
                response.content !== null &&
                "raw" in response.content) {
                return response.content.raw;
            }
            // خلاف ذلك، نحاول تحويله إلى نص
            return String(response.content);
        }
        catch (error) {
            console.error("Error in generateContent:", error);
            throw error;
        }
    }
}
exports.GeminiService = GeminiService;
// Export singleton instance
let geminiServiceInstance = null;
function getGeminiService(config) {
    if (!geminiServiceInstance) {
        if (!config) {
            throw new Error("GeminiService requires a config object on first instantiation");
        }
        geminiServiceInstance = new GeminiService(config);
    }
    return geminiServiceInstance;
}
