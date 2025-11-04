import { BaseStation, type StationConfig } from '../core/pipeline/base-station';
import { ConflictNetwork } from '../core/models/base-entities';
import { GeminiService } from './gemini-service';
import { Station6Output } from './station6-diagnostics-treatment';
export interface Station7Input {
    conflictNetwork: ConflictNetwork;
    station6Output: Station6Output;
    allPreviousStationsData: Map<number, unknown>;
}
export interface AudienceResonance {
    emotionalImpact: number;
    intellectualEngagement: number;
    relatability: number;
    memorability: number;
    viralPotential: number;
    primaryResponse: string;
    secondaryResponses: string[];
    controversialElements: string[];
}
export interface RewritingSuggestion {
    location: string;
    currentIssue: string;
    suggestedRewrite: string;
    reasoning: string;
    impact: number;
    priority: 'must' | 'should' | 'could';
}
export interface ScoreMatrix {
    foundation: number;
    conceptual: number;
    conflictNetwork: number;
    efficiency: number;
    dynamicSymbolic: number;
    diagnostics: number;
    overall: number;
}
export interface Station7Output {
    finalReport: {
        executiveSummary: string;
        overallAssessment: {
            narrativeQualityScore: number;
            structuralIntegrityScore: number;
            characterDevelopmentScore: number;
            conflictEffectivenessScore: number;
            thematicDepthScore: number;
            overallScore: number;
            rating: 'Masterpiece' | 'Excellent' | 'Good' | 'Fair' | 'Needs Work';
        };
        strengthsAnalysis: string[];
        weaknessesIdentified: string[];
        opportunitiesForImprovement: string[];
        threatsToCoherence: string[];
        finalRecommendations: {
            mustDo: string[];
            shouldDo: string[];
            couldDo: string[];
        };
        audienceResonance: AudienceResonance;
        rewritingSuggestions: RewritingSuggestion[];
    };
    scoreMatrix: ScoreMatrix;
    finalConfidence: {
        overallConfidence: number;
        stationConfidences: Map<string, number>;
        uncertaintyAggregation: {
            epistemicUncertainties: string[];
            aleatoricUncertainties: string[];
            resolvableIssues: string[];
        };
    };
    metadata: {
        analysisTimestamp: Date;
        totalExecutionTime: number;
        stationsCompleted: number;
        agentsUsed: string[];
        tokensUsed: number;
        modelUsed: string;
        status: 'Complete' | 'Partial' | 'Failed';
    };
}
export declare class Station7Finalization extends BaseStation<Station7Input, Station7Output> {
    private outputDir;
    constructor(config: StationConfig<Station7Input, Station7Output>, geminiService: GeminiService, outputDir?: string);
    protected process(input: Station7Input): Promise<Station7Output>;
    private calculateScoreMatrix;
    private calculateStationScore;
    private calculateStation5Score;
    private generateExecutiveSummary;
    private generateOverallAssessment;
    private calculateCharacterScore;
    private calculateConflictScore;
    private determineRating;
    private generateSWOTAnalysis;
    private analyzeAudienceResonance;
    private generateRewritingSuggestions;
    private calculateFinalConfidence;
    private extractAgentsUsed;
    private calculateTotalTokens;
    private saveReports;
    private generateHumanReadableReport;
    private generateMarkdownReport;
    private extractText;
    private parseStructuredText;
    private parseAudienceResonance;
    private parseRewritingSuggestions;
    protected extractRequiredData(input: Station7Input): Record<string, unknown>;
    protected getErrorFallback(): Station7Output;
}
//# sourceMappingURL=station7-finalization.d.ts.map