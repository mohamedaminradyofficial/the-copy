/**
 * Unified Gemini AI Core Layer - Text Only
 *
 * This module provides a unified TEXT-ONLY interface for all Gemini AI interactions.
 * NO JSON parsing. NO JSON output to UI. Pure text in, pure text out.
 *
 * Features:
 * - Unified token limit: 48192 for all models
 * - Per-model throttling: Flash-Lite (6s), Flash (10s), Pro (15s)
 * - Safe text utilities to prevent React rendering errors
 * - Text-only responses
 */

import { GoogleGenAI } from "@google/genai";

// =====================================================
// Type Definitions
// =====================================================

export type ModelId =
  | "gemini-2.5-flash-lite"
  | "gemini-2.5-flash"
  | "gemini-2.5-pro";

export const MAX_TOKENS = 48192 as const;

// =====================================================
// Configuration
// =====================================================

const DELAY: Record<ModelId, number> = {
  "gemini-2.5-flash-lite": 6000, // 6 seconds
  "gemini-2.5-flash": 10000, // 10 seconds
  "gemini-2.5-pro": 15000, // 15 seconds
};

// Track last call time per model for throttling
const last: Partial<Record<ModelId, number>> = {};

// =====================================================
// Throttling
// =====================================================

/**
 * Enforces throttling delay before API call
 */
export async function throttle(model: ModelId): Promise<void> {
  const now = Date.now();
  const prev = last[model] ?? 0;
  const wait = Math.max(0, DELAY[model] - (now - prev));

  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait));
  }

  last[model] = Date.now();
}

// =====================================================
// Safe Text Utilities
// =====================================================

/**
 * Safely converts any value to text string
 * Handles objects with 'raw' property (common in AI responses)
 * Returns empty string for null/undefined
 */
export function toText(v: unknown): string {
  if (v === null || v === undefined) {
    return "";
  }

  if (typeof v === "string") {
    return v;
  }

  // Handle objects with 'raw' property
  if (
    v &&
    typeof v === "object" &&
    "raw" in (v as any) &&
    typeof (v as any).raw === "string"
  ) {
    return (v as any).raw;
  }

  // For numbers and booleans
  if (typeof v === "number" || typeof v === "boolean") {
    return String(v);
  }

  // For arrays and other objects, return empty string
  return "";
}

/**
 * Safe substring - only works on strings
 */
export function safeSub(s: unknown, a: number, b?: number): string {
  const text = toText(s);
  if (!text) return "";
  return b !== undefined ? text.substring(a, b) : text.substring(a);
}

/**
 * Safe split - only works on strings
 */
export function safeSplit(s: unknown, sep: string | RegExp): string[] {
  const text = toText(s);
  if (!text) return [];
  return text.split(sep);
}

// =====================================================
// Core API - Text Only
// =====================================================

let genAI: GoogleGenAI | null = null;

/**
 * Initialize Google Generative AI client
 */
function initClient(): GoogleGenAI {
  if (genAI) return genAI;

  const apiKey =
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error("Gemini API key not found");
  }

  genAI = new GoogleGenAI({ apiKey });
  return genAI;
}

export type CallOpts = {
  model: ModelId;
  prompt: string;
  temperature?: number;
  systemInstruction?: string;
};

/**
 * Unified Gemini TEXT-ONLY call
 *
 * @returns Pure text string. NO JSON.
 *
 * @example
 * const text = await callGeminiText({
 *   model: 'gemini-2.5-flash',
 *   prompt: 'Analyze this...',
 *   temperature: 0.3
 * });
 */
export async function callGeminiText(opts: CallOpts): Promise<string> {
  // Enforce throttling
  await throttle(opts.model);

  // Initialize client
  const client = initClient();

  // Build full prompt
  const fullPrompt = opts.systemInstruction
    ? `${opts.systemInstruction}\n\n${opts.prompt}`
    : opts.prompt;

  // Call API
  const result = await client.models.generateContent({
    model: opts.model,
    contents: fullPrompt,
    config: {
      temperature: opts.temperature ?? 0.3,
      maxOutputTokens: MAX_TOKENS,
    },
  });

  // Extract text from result
  const output = result?.text ?? "";

  // Convert to safe text and return
  return toText(output);
}

// =====================================================
// Convenience Functions
// =====================================================

/**
 * Call Flash-Lite (6s throttle)
 */
export async function callFlashLite(
  prompt: string,
  opts?: { temperature?: number; systemInstruction?: string }
): Promise<string> {
  return callGeminiText({
    model: "gemini-2.5-flash-lite",
    prompt,
    ...opts,
  });
}

/**
 * Call Flash (10s throttle)
 */
export async function callFlash(
  prompt: string,
  opts?: { temperature?: number; systemInstruction?: string }
): Promise<string> {
  return callGeminiText({
    model: "gemini-2.5-flash",
    prompt,
    ...opts,
  });
}

/**
 * Call Pro (15s throttle)
 */
export async function callPro(
  prompt: string,
  opts?: { temperature?: number; systemInstruction?: string }
): Promise<string> {
  return callGeminiText({
    model: "gemini-2.5-pro",
    prompt,
    ...opts,
  });
}

// =====================================================
// Streaming API
// =====================================================

export type StreamCallOpts = CallOpts;

/**
 * Unified Gemini STREAMING TEXT call
 *
 * Returns an async generator that yields text chunks as they arrive.
 * Use this for real-time streaming responses in chat interfaces.
 *
 * @returns AsyncGenerator that yields text chunks
 *
 * @example
 * const stream = callGeminiStream({
 *   model: 'gemini-2.5-flash',
 *   prompt: 'Tell me a story...',
 *   temperature: 0.7
 * });
 *
 * for await (const chunk of stream) {
 *   console.log(chunk); // Display each chunk as it arrives
 * }
 */
export async function* callGeminiStream(
  opts: StreamCallOpts
): AsyncGenerator<string, void, undefined> {
  // Enforce throttling
  await throttle(opts.model);

  // Initialize client
  const client = initClient();

  // Build full prompt
  const fullPrompt = opts.systemInstruction
    ? `${opts.systemInstruction}\n\n${opts.prompt}`
    : opts.prompt;

  // Call streaming API
  const stream = await client.models.generateContentStream({
    model: opts.model,
    contents: fullPrompt,
    config: {
      temperature: opts.temperature ?? 0.3,
      maxOutputTokens: MAX_TOKENS,
    },
  });

  // Yield text chunks as they arrive
  for await (const chunk of stream) {
    const text = chunk?.text ?? "";
    if (text) {
      yield toText(text);
    }
  }
}

/**
 * Stream with Flash model (10s throttle)
 */
export async function* streamFlash(
  prompt: string,
  opts?: { temperature?: number; systemInstruction?: string }
): AsyncGenerator<string, void, undefined> {
  yield* callGeminiStream({
    model: "gemini-2.5-flash",
    prompt,
    ...opts,
  });
}

/**
 * Stream with Flash-Lite model (6s throttle)
 */
export async function* streamFlashLite(
  prompt: string,
  opts?: { temperature?: number; systemInstruction?: string }
): AsyncGenerator<string, void, undefined> {
  yield* callGeminiStream({
    model: "gemini-2.5-flash-lite",
    prompt,
    ...opts,
  });
}

/**
 * Stream with Pro model (15s throttle)
 */
export async function* streamPro(
  prompt: string,
  opts?: { temperature?: number; systemInstruction?: string }
): AsyncGenerator<string, void, undefined> {
  yield* callGeminiStream({
    model: "gemini-2.5-pro",
    prompt,
    ...opts,
  });
}
