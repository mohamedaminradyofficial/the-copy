/**
 * Text-Based Key-Value Protocol Utilities
 *
 * Provides encoding and decoding functions for structured data transmission
 * using a line-oriented text format instead of binary or structured formats.
 *
 * Protocol Format:
 * - Each record is represented as lines of key=value pairs
 * - Special characters within values are escaped:
 *   - Newlines → \\n
 *   - Equals signs → \\=
 *   - Backslashes → \\\\
 * - Empty lines separate multiple records (if needed)
 *
 * Example:
 * ```
 * name=John Doe
 * message=Hello\\nWorld
 * status=active
 * ```
 */

/**
 * Encodes a record object into text-based key=value format
 * @param obj - The record to encode
 * @returns Text representation of the record
 */
export function encodeRecord(obj: Record<string, unknown>): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    // Convert value to string
    let valueStr = "";

    if (value === null || value === undefined) {
      valueStr = "";
    } else if (typeof value === "object") {
      // For nested objects, serialize them as text first
      valueStr = encodeRecord(value as Record<string, unknown>);
    } else {
      valueStr = String(value);
    }

    // Escape special characters
    const escapedValue = valueStr
      .replace(/\\/g, "\\\\") // Escape backslashes first
      .replace(/\n/g, "\\n") // Escape newlines
      .replace(/\r/g, "\\r") // Escape carriage returns
      .replace(/=/g, "\\="); // Escape equals signs

    lines.push(`${key}=${escapedValue}`);
  }

  return lines.join("\n");
}

/**
 * Decodes text-based key=value format into a record object
 * @param text - The text to decode
 * @returns Decoded record object
 */
export function decodeRecord(text: string): Record<string, string> {
  const record: Record<string, string> = {};

  if (!text || text.trim() === "") {
    return record;
  }

  const lines = text.split("\n");

  for (const line of lines) {
    if (line.trim() === "") continue;

    // Find the first unescaped equals sign
    let equalsIndex = -1;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === "=" && (i === 0 || line[i - 1] !== "\\")) {
        equalsIndex = i;
        break;
      }
    }

    if (equalsIndex === -1) continue;

    const key = line.substring(0, equalsIndex);
    const escapedValue = line.substring(equalsIndex + 1);

    // Unescape special characters
    const value = escapedValue
      .replace(/\\=/g, "=") // Unescape equals signs
      .replace(/\\r/g, "\r") // Unescape carriage returns
      .replace(/\\n/g, "\n") // Unescape newlines
      .replace(/\\\\/g, "\\"); // Unescape backslashes last

    record[key] = value;
  }

  return record;
}

/**
 * Converts a record to a text payload for transmission
 * @param obj - The record to convert
 * @returns Text payload string
 */
export function toTextPayload(obj: Record<string, unknown>): string {
  return encodeRecord(obj);
}

/**
 * Converts a text payload back to a record object
 * @param text - The text payload
 * @returns Decoded record object
 */
export function fromTextPayload(text: string): Record<string, string> {
  return decodeRecord(text);
}

/**
 * Text Sectioning Helpers (NO JSON ZONE)
 * =======================================
 * These functions help organize plain text into sections without using JSON.
 */

/**
 * Creates a section header
 * @param title - Section title
 * @param level - Header level (1=main, 2=subsection)
 * @returns Formatted section header
 */
export function createSectionHeader(title: string, level: 1 | 2 = 1): string {
  const marker = level === 1 ? "===" : "---";
  return `\n${marker} ${title} ${marker}\n`;
}

/**
 * Creates a key-value line
 * @param key - The key
 * @param value - The value
 * @returns Formatted key-value line
 */
export function createKeyValue(key: string, value: string | number): string {
  return `${key}: ${value}`;
}

/**
 * Creates a bulleted list item
 * @param text - Item text
 * @returns Formatted list item
 */
export function createListItem(text: string): string {
  return `• ${text}`;
}

/**
 * Creates a numbered list item
 * @param number - Item number
 * @param text - Item text
 * @returns Formatted numbered item
 */
export function createNumberedItem(number: number, text: string): string {
  return `${number}. ${text}`;
}

/**
 * Combines text sections into a full report
 * @param sections - Array of text sections
 * @returns Combined text report
 */
export function combineSections(...sections: string[]): string {
  return sections.filter((s) => s && s.trim()).join("\n\n");
}

/**
 * Extracts a section from text by header
 * @param text - The full text
 * @param sectionTitle - The section title to find
 * @returns The section content or empty string
 */
export function extractSection(text: string, sectionTitle: string): string {
  const headerPattern = new RegExp(`===\\s*${sectionTitle}\\s*===`, "i");
  const match = text.match(headerPattern);

  if (!match || !match.index) {
    return "";
  }

  const startIndex = match.index + match[0].length;
  const nextHeaderIndex = text.indexOf("===", startIndex);

  if (nextHeaderIndex === -1) {
    return text.substring(startIndex).trim();
  }

  return text.substring(startIndex, nextHeaderIndex).trim();
}

/**
 * Parses key-value pairs from a text section
 * @param text - Text containing key-value pairs
 * @returns Map of key-value pairs
 */
export function parseKeyValues(text: string): Map<string, string> {
  const result = new Map<string, string>();
  const lines = text.split("\n");

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();

    if (key && value) {
      result.set(key, value);
    }
  }

  return result;
}

/**
 * Parses list items from text
 * @param text - Text containing list items
 * @returns Array of list items
 */
export function parseListItems(text: string): string[] {
  const items: string[] = [];
  const lines = text.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    // Match bullet points
    if (trimmed.startsWith("•")) {
      items.push(trimmed.substring(1).trim());
    }
    // Match numbered items
    else if (/^\d+\./.test(trimmed)) {
      const dotIndex = trimmed.indexOf(".");
      items.push(trimmed.substring(dotIndex + 1).trim());
    }
  }

  return items;
}

/**
 * Formats a text report with consistent structure
 * @param title - Report title
 * @param sections - Object with section titles as keys and content as values
 * @returns Formatted text report
 */
export function formatTextReport(
  title: string,
  sections: Record<string, string>
): string {
  const parts: string[] = [createSectionHeader(title, 1)];

  for (const [sectionTitle, content] of Object.entries(sections)) {
    if (content && content.trim()) {
      parts.push(createSectionHeader(sectionTitle, 2));
      parts.push(content.trim());
    }
  }

  return parts.join("\n\n");
}
