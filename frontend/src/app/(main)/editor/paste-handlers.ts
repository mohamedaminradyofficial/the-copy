/**
 * Paste handler utilities for screenplay editor
 * Extracted to reduce handlePaste complexity
 */

export interface LineProcessingContext {
  lastFormat: string;
  isInDialogueBlock: boolean;
  pendingCharacterLine: boolean;
}

export interface LineProcessingResult {
  html: string;
  currentCharacter?: string;
  updateContext?: Partial<LineProcessingContext>;
}

/**
 * Process blank line
 */
export function processBlankLine(): LineProcessingResult {
  return {
    html: '<div class="action" style="direction: rtl; text-align: right; margin: 12px 0;"></div>',
    currentCharacter: "",
    updateContext: {
      isInDialogueBlock: false,
      lastFormat: "action",
    },
  };
}

/**
 * Process basmala line
 */
export function processBasmalaLine(line: string): LineProcessingResult {
  return {
    html: `<div class="basmala" style="direction: rtl; text-align: left; margin: 0;">${line}</div>`,
    updateContext: {
      lastFormat: "basmala",
      isInDialogueBlock: false,
    },
  };
}

/**
 * Process transition line
 */
export function processTransitionLine(line: string): LineProcessingResult {
  return {
    html: `<div class="transition" style="direction: rtl; text-align: center; font-weight: bold; text-transform: uppercase; margin: 1rem 0;">${line}</div>`,
    updateContext: {
      lastFormat: "transition",
      isInDialogueBlock: false,
      pendingCharacterLine: false,
    },
  };
}

/**
 * Process character line
 */
export function processCharacterLine(line: string): LineProcessingResult {
  const cleanedCharacter = line.trim().replace(":", "");
  return {
    html: `<div class="character" style="direction: rtl; text-align: center; font-weight: bold; text-transform: uppercase; width: 2.5in; margin: 12px auto 0 auto;">${line}</div>`,
    currentCharacter: cleanedCharacter,
    updateContext: {
      lastFormat: "character",
      isInDialogueBlock: true,
      pendingCharacterLine: false,
    },
  };
}

/**
 * Process parenthetical line
 */
export function processParentheticalLine(line: string): LineProcessingResult {
  return {
    html: `<div class="parenthetical" style="direction: rtl; text-align: center; font-style: italic; width: 2.0in; margin: 6px auto;">${line}</div>`,
    updateContext: {
      lastFormat: "parenthetical",
      pendingCharacterLine: false,
    },
  };
}

/**
 * Process action line
 */
export function processActionLine(line: string): LineProcessingResult {
  const cleanedLine = line.replace(/^\s*[-–—]\s*/, "");
  return {
    html: `<div class="action" style="direction: rtl; text-align: right; margin: 12px 0;">${cleanedLine}</div>`,
    currentCharacter: undefined,
    updateContext: {
      lastFormat: "action",
      isInDialogueBlock: false,
      pendingCharacterLine: false,
    },
  };
}

/**
 * Process dialogue line
 */
export function processDialogueLine(line: string): LineProcessingResult {
  return {
    html: `<div class="dialogue" style="direction: rtl; text-align: center; width: 2.5in; line-height: 1.2; margin: 0 auto 12px auto;">${line}</div>`,
    updateContext: {
      lastFormat: "dialogue",
      pendingCharacterLine: false,
    },
  };
}

/**
 * Check if line is action description
 */
export function isActionDescription(line: string): boolean {
  const actionDescriptionPatterns = [
    /^\s*[-–—]\s*(?:نرى|ننظر|نسمع|نلاحظ|يبدو|يظهر|يبدأ|ينتهي|يستمر|يتوقف|يتحرك|يحدث|يكون|يوجد|توجد|تظهر)/,
    /^\s*[-–—]\s*[ي|ت][\u0600-\u06FF]+/,
    /^\s*(?:نرى|ننظر|نسمع|نلاحظ|يبدو|يظهر|يبدأ|ينتهي|يستمر|يتوقف|يتحرك|يحدث|يكون|يوجد|توجد|تظهر)/,
  ];

  return actionDescriptionPatterns.some((pattern) => pattern.test(line));
}

/**
 * Process scene header line
 */
export function processSceneHeaderLine(
  line: string,
  ctx: { inDialogue: boolean },
  sceneHeaderResult: { html: string; processed: boolean } | null
): LineProcessingResult | null {
  if (!sceneHeaderResult?.processed) {
    return null;
  }

  return {
    html: sceneHeaderResult.html,
    updateContext: {
      lastFormat: "scene-header",
      isInDialogueBlock: false,
      pendingCharacterLine: false,
    },
  };
}

/**
 * Apply context updates
 */
export function applyContextUpdates(
  context: LineProcessingContext,
  updates?: Partial<LineProcessingContext>
): LineProcessingContext {
  if (!updates) return context;

  return {
    ...context,
    ...updates,
  };
}
