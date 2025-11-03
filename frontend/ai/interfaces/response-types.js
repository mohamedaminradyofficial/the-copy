"use strict";
/**
 * Type-safe response types for AI layer
 * Using Zod schemas for validation and discriminated unions for success/failure
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextMapSchema = exports.TextChunkSchema = exports.PreviousResultsSchema = exports.StationResultSchema = exports.AnalysisContextSchema = exports.NarrativeContextSchema = exports.CharacterContextSchema = exports.ConflictNetworkSchema = exports.DebateResultSchema = exports.RecommendationSchema = exports.ScoreMatrixSchema = exports.AudienceProfileSchema = exports.UncertaintyReportSchema = exports.DialogueAnalysisSchema = exports.ThemeSchema = exports.ConflictSchema = exports.RelationshipSchema = exports.CharacterAnalysisSchema = exports.CharacterSchema = exports.BaseResponseSchema = void 0;
exports.validateResponse = validateResponse;
exports.safeValidateResponse = safeValidateResponse;
const zod_1 = require("zod");
// =====================================================
// Base Response Schemas
// =====================================================
/**
 * Base response wrapper with discriminated union for success/failure
 */
exports.BaseResponseSchema = zod_1.z.discriminatedUnion("success", [
    zod_1.z.object({
        success: zod_1.z.literal(true),
        data: zod_1.z.unknown(),
        metadata: zod_1.z.object({
            timestamp: zod_1.z.string().optional(),
            version: zod_1.z.string().optional(),
            model: zod_1.z.string().optional(),
        }).passthrough(),
    }),
    zod_1.z.object({
        success: zod_1.z.literal(false),
        error: zod_1.z.object({
            code: zod_1.z.string(),
            message: zod_1.z.string(),
            details: zod_1.z.unknown().optional(),
        }),
        metadata: zod_1.z.object({
            timestamp: zod_1.z.string().optional(),
            version: zod_1.z.string().optional(),
            model: zod_1.z.string().optional(),
        }).passthrough().optional(),
    }),
]);
// =====================================================
// Character Schemas
// =====================================================
exports.CharacterSchema = zod_1.z.object({
    name: zod_1.z.string(),
    role: zod_1.z.string().optional(),
}).passthrough();
exports.CharacterAnalysisSchema = zod_1.z.object({
    character: exports.CharacterSchema,
    analysis: zod_1.z.string().optional(),
}).passthrough();
// =====================================================
// Relationship Schemas
// =====================================================
exports.RelationshipSchema = zod_1.z.object({
    from: zod_1.z.string(),
    to: zod_1.z.string(),
    type: zod_1.z.string().optional(),
}).passthrough();
// =====================================================
// Conflict Schemas
// =====================================================
exports.ConflictSchema = zod_1.z.object({
    type: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
}).passthrough();
// =====================================================
// Theme Schemas
// =====================================================
exports.ThemeSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
}).passthrough();
// =====================================================
// Dialogue Schemas
// =====================================================
exports.DialogueAnalysisSchema = zod_1.z.object({
    speaker: zod_1.z.string().optional(),
    text: zod_1.z.string().optional(),
}).passthrough();
// =====================================================
// Uncertainty Schemas
// =====================================================
exports.UncertaintyReportSchema = zod_1.z.object({
    confidence: zod_1.z.number().optional(),
}).passthrough();
// =====================================================
// Audience Schemas
// =====================================================
exports.AudienceProfileSchema = zod_1.z.object({
    demographics: zod_1.z.array(zod_1.z.string()).optional(),
}).passthrough();
// =====================================================
// Score Matrix Schemas
// =====================================================
exports.ScoreMatrixSchema = zod_1.z.object({
    scores: zod_1.z.record(zod_1.z.string(), zod_1.z.number()).optional(),
}).passthrough();
// =====================================================
// Recommendation Schemas
// =====================================================
exports.RecommendationSchema = zod_1.z.object({
    text: zod_1.z.string(),
    priority: zod_1.z.string().optional(),
}).passthrough();
// =====================================================
// Debate Result Schemas
// =====================================================
exports.DebateResultSchema = zod_1.z.object({
    conclusion: zod_1.z.string().optional(),
}).passthrough();
// =====================================================
// Conflict Network Schemas
// =====================================================
exports.ConflictNetworkSchema = zod_1.z.object({
    characters: zod_1.z.record(zod_1.z.string(), exports.CharacterSchema),
    relationships: zod_1.z.record(zod_1.z.string(), zod_1.z.array(exports.RelationshipSchema)),
    conflicts: zod_1.z.array(exports.ConflictSchema).optional(),
}).passthrough();
// =====================================================
// Context Schemas
// =====================================================
exports.CharacterContextSchema = zod_1.z.object({
    name: zod_1.z.string(),
    role: zod_1.z.string().optional(),
    traits: zod_1.z.array(zod_1.z.string()).optional(),
    relationships: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
});
exports.NarrativeContextSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    genre: zod_1.z.string().optional(),
    theme: zod_1.z.string().optional(),
    plot: zod_1.z.string().optional(),
    structure: zod_1.z.string().optional(),
});
exports.AnalysisContextSchema = zod_1.z.object({
    inputText: zod_1.z.string(),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    previousAnalysis: zod_1.z.unknown().optional(),
});
// =====================================================
// Station Result Schemas
// =====================================================
/**
 * Generic station result type that can be validated
 */
exports.StationResultSchema = zod_1.z.unknown();
/**
 * Previous results from stations (can be any structured data)
 */
exports.PreviousResultsSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.unknown());
/**
 * Text chunks for RAG
 */
exports.TextChunkSchema = zod_1.z.object({
    text: zod_1.z.string(),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    index: zod_1.z.number().optional(),
});
/**
 * Context map for RAG
 */
exports.ContextMapSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.unknown());
// =====================================================
// Helper Functions for Validation
// =====================================================
/**
 * Validates and parses a response using a Zod schema
 */
function validateResponse(schema, data) {
    return schema.parse(data);
}
/**
 * Safely validates a response, returning a result type
 */
function safeValidateResponse(schema, data) {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
}
