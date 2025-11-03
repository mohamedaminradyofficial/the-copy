// lib/ai/gemini-service.ts

import { GoogleGenAI } from "@google/genai";
import { toText } from "./gemini-core";

export enum GeminiModel {
  PRO = "gemini-2.0-flash-exp",
  FLASH = "gemini-2.0-flash-exp",
}

export interface GeminiConfig {
  apiKey: string;
  defaultModel: GeminiModel;
  maxRetries: number;
  timeout: number;
  fallbackModel?: GeminiModel;
}

export interface GeminiRequest<T> {
  prompt: string;
  model?: GeminiModel;
  context?: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
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
  };
}

export class GeminiService {
  private genAI: GoogleGenAI;
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = config;
    this.genAI = new GoogleGenAI({ apiKey: config.apiKey });
  }

  async generate<T>(request: GeminiRequest<T>): Promise<GeminiResponse<T>> {
    const primaryModel = request.model ?? this.config.defaultModel;

    try {
      return await this.performRequest<T>({ ...request, model: primaryModel });
    } catch (primaryError) {
      if (
        this.config.fallbackModel &&
        this.config.fallbackModel !== primaryModel
      ) {
        console.warn(
          "Primary Gemini model failed. Falling back to secondary model."
        );
        return this.performRequest<T>({
          ...request,
          model: this.config.fallbackModel,
        });
      }
      throw primaryError;
    }
  }

  private async performRequest<T>(
    request: GeminiRequest<T>
  ): Promise<GeminiResponse<T>> {
    const startTime = Date.now();
    const modelName = request.model ?? this.config.defaultModel;

    const fullPrompt = `${request.systemInstruction || ""}\n\nContext: ${request.context || "N/A"}\n\nPrompt: ${request.prompt}`;

    const finalConfig = {
      temperature: request.temperature ?? 0.9,
      maxOutputTokens: request.maxTokens ?? 48192,
    };

    console.log(`[Gemini Service] Generating content with model ${modelName}`, {
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
      content: this.parseResponse<T>(text),
      usage,
      metadata: {
        timestamp: new Date(),
        latency: Date.now() - startTime,
      },
    };
  }

  private parseResponse<T>(responseText: string): T {
    console.log("[AI] text generated");
    return { raw: responseText } as T;
  }

  /**
   * دالة جديدة لتبسيط الاستخدام في BaseStation والأنظمة الأخرى
   * هذه الدالة تغلف وظيفة generate الأكثر تعقيداً
   */
  async generateContent(
    prompt: string,
    options: {
      temperature?: number;
      maxTokens?: number;
      systemInstruction?: string;
    } = {}
  ): Promise<string> {
    try {
      const requestParams: any = {
        prompt,
        temperature: options.temperature ?? 0.4,
        maxTokens: options.maxTokens ?? 4096,
      };

      if (options.systemInstruction !== undefined) {
        requestParams.systemInstruction = options.systemInstruction;
      }

      const response = await this.generate<string>(requestParams);

      // إذا كان المحتوى كائناً به خاصية raw، نستخرجها
      if (
        typeof response.content === "object" &&
        response.content !== null &&
        "raw" in response.content
      ) {
        return (response.content as any).raw as string;
      }

      // خلاف ذلك، نحاول تحويله إلى نص
      return String(response.content);
    } catch (error) {
      console.error("Error in generateContent:", error);
      throw error;
    }
  }
}

// Export singleton instance
let geminiServiceInstance: GeminiService | null = null;

export function getGeminiService(config?: GeminiConfig): GeminiService {
  if (!geminiServiceInstance) {
    if (!config) {
      throw new Error(
        "GeminiService requires a config object on first instantiation"
      );
    }
    geminiServiceInstance = new GeminiService(config);
  }
  return geminiServiceInstance;
}
