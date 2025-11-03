"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toText = toText;
exports.safeSub = safeSub;
function toText(content) {
    if (typeof content === "string") {
        return content.trim();
    }
    if (content && typeof content === "object" && "raw" in content) {
        return String(content.raw || "").trim();
    }
    return "";
}
function safeSub(text, start, end) {
    if (!text || typeof text !== "string") {
        return "";
    }
    return text.substring(start, Math.min(end, text.length));
}
