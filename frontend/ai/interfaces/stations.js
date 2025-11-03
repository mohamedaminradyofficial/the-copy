"use strict";
/**
 * Text-Only Station Interfaces
 *
 * This file defines strict text-only input/output contracts for the Seven Stations pipeline.
 * NO JSON parsing/stringifying should occur in UI or report components.
 * All data exchange happens through plain text with structured sections.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEXT_SECTIONS = void 0;
/**
 * Text section marker constants for parsing structured text
 */
exports.TEXT_SECTIONS = {
    HEADER: "===",
    SUBSECTION: "---",
    LIST_ITEM: "•",
    NUMBERED_ITEM: /^\d+\./,
    KEY_VALUE: ":",
};
/**
 * NO JSON ZONE
 * =============
 * Any code importing from this file should NEVER use:
 * - JSON.parse()
 * - JSON.stringify()
 * - JSON object methods
 *
 * Use text-protocol helpers from lib/utils/text-protocol.ts instead
 */
