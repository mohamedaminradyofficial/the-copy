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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var genai_1 = require("@google/genai");
exports.MAX_TOKENS = 48192;
// =====================================================
// Configuration
// =====================================================
var DELAY = {
    "gemini-2.5-flash-lite": 6000, // 6 seconds
    "gemini-2.5-flash": 10000, // 10 seconds
    "gemini-2.5-pro": 15000, // 15 seconds
};
// Track last call time per model for throttling
var last = {};
// =====================================================
// Throttling
// =====================================================
/**
 * Enforces throttling delay before API call
 */
function throttle(model) {
    return __awaiter(this, void 0, void 0, function () {
        var now, prev, wait;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    now = Date.now();
                    prev = (_a = last[model]) !== null && _a !== void 0 ? _a : 0;
                    wait = Math.max(0, DELAY[model] - (now - prev));
                    if (!(wait > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, wait); })];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    last[model] = Date.now();
                    return [2 /*return*/];
            }
        });
    });
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
    var text = toText(s);
    if (!text)
        return "";
    return b !== undefined ? text.substring(a, b) : text.substring(a);
}
/**
 * Safe split - only works on strings
 */
function safeSplit(s, sep) {
    var text = toText(s);
    if (!text)
        return [];
    return text.split(sep);
}
// =====================================================
// Core API - Text Only
// =====================================================
var genAI = null;
/**
 * Initialize Google Generative AI client
 */
function initClient() {
    if (genAI)
        return genAI;
    var apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
        throw new Error("Gemini API key not found");
    }
    genAI = new genai_1.GoogleGenAI({ apiKey: apiKey });
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
function callGeminiText(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var client, fullPrompt, result, output;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                // Enforce throttling
                return [4 /*yield*/, throttle(opts.model)];
                case 1:
                    // Enforce throttling
                    _c.sent();
                    client = initClient();
                    fullPrompt = opts.systemInstruction
                        ? "".concat(opts.systemInstruction, "\n\n").concat(opts.prompt)
                        : opts.prompt;
                    return [4 /*yield*/, client.models.generateContent({
                            model: opts.model,
                            contents: fullPrompt,
                            config: {
                                temperature: (_a = opts.temperature) !== null && _a !== void 0 ? _a : 0.3,
                                maxOutputTokens: exports.MAX_TOKENS,
                            },
                        })];
                case 2:
                    result = _c.sent();
                    output = (_b = result === null || result === void 0 ? void 0 : result.text) !== null && _b !== void 0 ? _b : "";
                    // Convert to safe text and return
                    return [2 /*return*/, toText(output)];
            }
        });
    });
}
// =====================================================
// Convenience Functions
// =====================================================
/**
 * Call Flash-Lite (6s throttle)
 */
function callFlashLite(prompt, opts) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, callGeminiText(__assign({ model: "gemini-2.5-flash-lite", prompt: prompt }, opts))];
        });
    });
}
/**
 * Call Flash (10s throttle)
 */
function callFlash(prompt, opts) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, callGeminiText(__assign({ model: "gemini-2.5-flash", prompt: prompt }, opts))];
        });
    });
}
/**
 * Call Pro (15s throttle)
 */
function callPro(prompt, opts) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, callGeminiText(__assign({ model: "gemini-2.5-pro", prompt: prompt }, opts))];
        });
    });
}
