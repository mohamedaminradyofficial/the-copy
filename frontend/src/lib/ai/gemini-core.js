"use strict";
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
const DELAY = {
  "gemini-2.5-flash-lite": 6000,
  "gemini-2.5-flash": 10000,
  "gemini-2.5-pro": 15000,
};
const last = {};
async function throttle(model) {
  const now = Date.now();
  const prev = last[model] ?? 0;
  const wait = Math.max(0, DELAY[model] - (now - prev));
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait));
  }
  last[model] = Date.now();
}
function toText(v) {
  if (v === null || v === undefined) {
    return "";
  }
  if (typeof v === "string") {
    return v;
  }
  if (v && typeof v === "object" && "raw" in v && typeof v.raw === "string") {
    return v.raw;
  }
  if (typeof v === "number" || typeof v === "boolean") {
    return String(v);
  }
  return "";
}
function safeSub(s, a, b) {
  const text = toText(s);
  if (!text) return "";
  return b !== undefined ? text.substring(a, b) : text.substring(a);
}
function safeSplit(s, sep) {
  const text = toText(s);
  if (!text) return [];
  return text.split(sep);
}
let genAI = null;
function initClient() {
  if (genAI) return genAI;
  const apiKey =
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error("Gemini API key not found");
  }
  genAI = new genai_1.GoogleGenAI({ apiKey });
  return genAI;
}
async function callGeminiText(opts) {
  const { model, prompt, temperature = 0.3, systemInstruction } = opts;
  await throttle(model);
  const client = initClient();
  const fullPrompt = systemInstruction
    ? `${systemInstruction}\n\n${prompt}`
    : prompt;
  const result = await client.models.generateContent({
    model,
    contents: fullPrompt,
    config: {
      temperature,
      maxOutputTokens: exports.MAX_TOKENS,
    },
  });
  const output = result?.text ?? "";
  return toText(output);
}
async function callFlashLite(prompt, opts) {
  return callGeminiText({
    model: "gemini-2.5-flash-lite",
    prompt,
    ...opts,
  });
}
async function callFlash(prompt, opts) {
  return callGeminiText({
    model: "gemini-2.5-flash",
    prompt,
    ...opts,
  });
}
async function callPro(prompt, opts) {
  return callGeminiText({
    model: "gemini-2.5-pro",
    prompt,
    ...opts,
  });
}
//# sourceMappingURL=gemini-core.js.map
