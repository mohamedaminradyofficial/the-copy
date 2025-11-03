import { BaseStation, type StationConfig } from "../core/pipeline/base-station";
import { GeminiService } from "./gemini-service";
import { Station3Output } from "./station3-network-builder";
export interface Station4Input {
    station3Output: Station3Output;
    originalText: string;
    options?: {
        enableConstitutionalAI?: boolean;
        enableUncertaintyQuantification?: boolean;
        temperature?: number;
    };
}
export interface EfficiencyMetrics {
    overallEfficiencyScore: number;
    overallRating: "Excellent" | "Good" | "Fair" | "Poor" | "Critical";
    conflictCohesion: number;
    dramaticBalance: {
        balanceScore: number;
        characterInvolvementGini: number;
    };
    narrativeEfficiency: {
        characterEfficiency: number;
        relationshipEfficiency: number;
        conflictEfficiency: number;
    };
    narrativeDensity: number;
    redundancyMetrics: {
        characterRedundancy: number;
        relationshipRedundancy: number;
        conflictRedundancy: number;
    };
}
export interface QualityAssessment {
    literary: number;
    technical: number;
    commercial: number;
    overall: number;
}
export interface ProducibilityAnalysis {
    technicalFeasibility: number;
    budgetEstimate: "low" | "medium" | "high" | "very_high";
    productionChallenges: Array<{
        type: string;
        description: string;
        severity: "low" | "medium" | "high";
    }>;
    locationRequirements: string[];
    specialEffectsNeeded: boolean;
    castSize: number;
}
export interface RhythmAnalysis {
    overallPace: "very_slow" | "slow" | "medium" | "fast" | "very_fast";
    paceVariation: number;
    sceneLengths: number[];
    actBreakdown: Array<{
        act: number;
        averagePace: string;
        tensionProgression: number[];
    }>;
    recommendations: string[];
}
export interface Recommendation {
    type: "character" | "relationship" | "conflict" | "structure" | "dialogue";
    priority: "high" | "medium" | "low";
    description: string;
    impact: number;
    implementationComplexity: "low" | "medium" | "high";
}
export interface UncertaintyReport {
    overallConfidence: number;
    uncertainties: Array<{
        type: "epistemic" | "aleatoric";
        aspect: string;
        note: string;
    }>;
}
export interface Station4Output {
    efficiencyMetrics: EfficiencyMetrics;
    qualityAssessment: QualityAssessment;
    producibilityAnalysis: ProducibilityAnalysis;
    rhythmAnalysis: RhythmAnalysis;
    recommendations: {
        priorityActions: string[];
        quickFixes: string[];
        structuralRevisions: string[];
    };
    uncertaintyReport: UncertaintyReport;
    metadata: {
        analysisTimestamp: Date;
        status: "Success" | "Partial" | "Failed";
        analysisTime: number;
        agentsUsed: string[];
        tokensUsed: number;
    };
}
export declare class Station4EfficiencyMetrics extends BaseStation<Station4Input, Station4Output> {
    private literaryQualityAnalyzer;
    private producibilityAnalyzer;
    private rhythmMappingAgent;
    private recommendationsGenerator;
    constructor(config: StationConfig<Station4Input, Station4Output>, geminiService: GeminiService);
    protected process(input: Station4Input): Promise<Station4Output>;
    private calculateEfficiencyMetrics;
    private calculateGiniCoefficient;
    private calculateCommercialPotential;
    private checkConstitutionalCompliance;
    private quantifyUncertainty;
    protected extractRequiredData(input: Station4Input): Record<string, unknown>;
    protected getErrorFallback(): Station4Output;
}
//# sourceMappingURL=station4-efficiency-metrics.d.ts.map