"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUncertaintyQuantificationEngine = getUncertaintyQuantificationEngine;
class SimpleUncertaintyEngine {
  geminiService;
  constructor(geminiService) {
    this.geminiService = geminiService;
  }
  async quantify(text, context) {
    return {
      confidence: 0.8,
      type: "epistemic",
      sources: [],
    };
  }
}
function getUncertaintyQuantificationEngine(geminiService) {
  return new SimpleUncertaintyEngine(geminiService);
}
//# sourceMappingURL=uncertainty-quantification.js.map
