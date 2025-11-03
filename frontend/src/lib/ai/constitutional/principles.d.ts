import { GeminiService } from '../stations/gemini-service';
export interface ConstitutionalCheckResult {
    compliant: boolean;
    violations: Array<{
        principle: string;
        description: string;
    }>;
    improvementScore: number;
    correctedAnalysis?: string;
}
export declare function checkConstitutionalCompliance(text: string, originalText: string, geminiService: GeminiService): Promise<ConstitutionalCheckResult>;
//# sourceMappingURL=principles.d.ts.map