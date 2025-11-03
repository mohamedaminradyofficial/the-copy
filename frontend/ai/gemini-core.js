"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_TOKENS = void 0;
exports.throttle = throttle;
exports.toText = toText;
exports.safeSub = safeSub;
exports.safeSplit = safeSplit;
exports.callGeminiText = callGeminiText;
exports.callFlashLite = callFlashLite;
exports.callFlash = callFlash;
exports.callPro = callPro;
const genai_1 = require("@google/genai");
exports.MAX_TOKENS = 48192;
// =====================================================
// Configuration
// =====================================================
const DELAY = {
    "gemini-2.5-flash-lite": 6000, // 6 seconds
    "gemini-2.5-flash": 10000, // 10 seconds
    "gemini-2.5-pro": 15000, // 15 seconds
};
// Track last call time per model for throttling
const last = {};
// =====================================================
// Throttling
// =====================================================
/**
 * Enforces throttling delay before API call
 */
async function throttle(model) {
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
function toText(v) {
    if (v === null || v === undefined) {
        return "";
    }
    if (typeof v === "string") {
        return v;
    }
    // Handle objects with 'raw' property
    if (v &&
        typeof v === "object" &&
        "raw" in v &&
        typeof v.raw === "string") {
        return v.raw;
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
function safeSub(s, a, b) {
    const text = toText(s);
    if (!text)
        return "";
    return b !== undefined ? text.substring(a, b) : text.substring(a);
}
/**
 * Safe split - only works on strings
 */
function safeSplit(s, sep) {
    const text = toText(s);
    if (!text)
        return [];
    return text.split(sep);
}
// =====================================================
// Core API - Text Only
// =====================================================
let genAI = null;
/**
 * Initialize Google Generative AI client
 */
function initClient() {
    if (genAI)
        return genAI;
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
        throw new Error("Gemini API key not found");
    }
    genAI = new genai_1.GoogleGenAI({ apiKey });
    return genAI;
}
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
async function callGeminiText(opts) {
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
            maxOutputTokens: exports.MAX_TOKENS,
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
async function callFlashLite(prompt, opts) {
    return callGeminiText({
        model: "gemini-2.5-flash-lite",
        prompt,
        ...opts,
    });
}
/**
 * Call Flash (10s throttle)
 */
async function callFlash(prompt, opts) {
    return callGeminiText({
        model: "gemini-2.5-flash",
        prompt,
        ...opts,
    });
}
/**
 * Call Pro (15s throttle)
 */
async function callPro(prompt, opts) {
    return callGeminiText({
        model: "gemini-2.5-pro",
        prompt,
        ...opts,
    });
}
