import { GeminiService } from '../stations/gemini-service';
export interface UncertaintyMetrics {
    confidence: number;
    type: 'epistemic' | 'aleatoric';
    sources: Array<{
        aspect: string;
        reason: string;
        reducible: boolean;
    }>;
}
export interface UncertaintyQuantificationEngine {
    quantify(text: string, context: any): Promise<UncertaintyMetrics>;
}
export declare function getUncertaintyQuantificationEngine(geminiService: GeminiService): UncertaintyQuantificationEngine;
//# sourceMappingURL=uncertainty-quantification.d.ts.map