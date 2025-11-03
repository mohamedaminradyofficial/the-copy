"use strict";
/**
 * Boundary module for Gemini Service
 * Provides typed interfaces for AI provider interactions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGeminiServiceBoundary = createGeminiServiceBoundary;
/**
 * Creates a typed boundary wrapper around GeminiService
 */
function createGeminiServiceBoundary(service) {
    return {
        async generateText(prompt, options = {}) {
            const request = {
                prompt,
                temperature: options.temperature ?? 0.4,
                maxTokens: options.maxTokens ?? 4096,
            };
            if (options.systemInstruction !== undefined) {
                request.systemInstruction = options.systemInstruction;
            }
            if (options.context !== undefined) {
                request.context = options.context;
            }
            const response = await service.generate(request);
            if (typeof response.content === "object" && response.content !== null && "raw" in response.content) {
                return response.content.raw;
            }
            return String(response.content);
        },
        async generateCharacterAnalysis(prompt, options = {}) {
            const text = await this.generateText(prompt, options);
            // In a real implementation, we would parse the text as JSON or structured data
            // For now, we return a basic structure
            return {
                character: { name: "Unknown" },
                analysis: text,
            };
        },
        async generateRelationships(prompt, options = {}) {
            const text = await this.generateText(prompt, options);
            // Parse relationships from text response
            // For now, return empty array - would need proper parsing
            return [];
        },
        async generateConflicts(prompt, options = {}) {
            const text = await this.generateText(prompt, options);
            // Parse conflicts from text response
            return [];
        },
        async generateThemes(prompt, options = {}) {
            const text = await this.generateText(prompt, options);
            // Parse themes from text response
            return [];
        },
        async generateDialogueAnalysis(prompt, options = {}) {
            const text = await this.generateText(prompt, options);
            return {
                text,
            };
        },
    };
}
