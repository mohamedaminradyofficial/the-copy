import { GeminiService } from '../services/gemini-service';
import { StationMetadata } from '../core/models/base-entities';
export interface StationOptions {
    enableConstitutionalCheck?: boolean;
    enableUncertaintyQuantification?: boolean;
    enableRAG?: boolean;
    temperature?: number;
    maxTokens?: number;
}
export interface StationInput {
    text: string;
    projectName?: string;
    options?: StationOptions;
    previousResults?: any;
    chunks?: any[];
    contextMap?: any;
}
export interface StationOutput {
    result: any;
    metadata: StationMetadata & {
        constitutionalCheck?: {
            checked: boolean;
            compliant: boolean;
            violations: string[];
            improvementScore: number;
            correctedAnalysis?: string;
        };
        uncertaintyQuantification?: {
            quantified: boolean;
            overallConfidence: number;
            uncertaintyType: 'epistemic' | 'aleatoric';
            sources: Array<{
                aspect: string;
                reason: string;
                reducible: boolean;
            }>;
        };
        ragInfo?: {
            wasChunked: boolean;
            chunksCount: number;
            retrievalTime: number;
        };
    };
}
export declare abstract class BaseStation {
    protected geminiService: GeminiService;
    protected stationName: string;
    protected stationNumber: number;
    constructor(geminiService: GeminiService, stationName: string, stationNumber: number);
    run(input: StationInput): Promise<StationOutput>;
    protected abstract execute(input: StationInput, options: StationOptions): Promise<any>;
    private mergeWithDefaultOptions;
    private applyConstitutionalCheck;
    private applyUncertaintyQuantification;
    private createMetadata;
    protected extractTextsForConstitutionalCheck(result: any): string[];
    protected extractTextsForUncertaintyQuantification(result: any): string[];
    protected replaceTextInResult(result: any, oldText: string, newText: string): any;
    protected abstract getAgentsUsed(): string[];
    protected estimateTokensUsed(text: string): number;
}
//# sourceMappingURL=base-station.d.ts.map