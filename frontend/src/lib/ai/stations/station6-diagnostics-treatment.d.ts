import { GeminiService } from "./gemini-service";
import { Station5Output, StationMetadata, UncertaintyReport } from "./station-types";
import { DebateResult } from "../constitutional/multi-agent-debate";
export interface DiagnosticIssue {
    type: "critical" | "major" | "minor";
    category: "character" | "plot" | "dialogue" | "structure" | "theme" | "pacing" | "continuity";
    description: string;
    location: string;
    impact: number;
    suggestion: string;
    affectedElements: string[];
    priority: number;
}
export interface IsolatedCharacter {
    name: string;
    isolationScore: number;
    currentConnections: string[];
    missedOpportunities: string[];
    integrationSuggestions: Array<{
        type: "conflict" | "relationship" | "subplot";
        description: string;
        expectedImpact: number;
    }>;
}
export interface AbandonedConflict {
    id: string;
    description: string;
    involvedCharacters: string[];
    introducedAt: string;
    abandonedAt: string;
    setupInvestment: number;
    resolutionStrategies: Array<{
        approach: string;
        complexity: "low" | "medium" | "high";
        narrativePayoff: number;
        implementation: string;
    }>;
}
export interface StructuralIssue {
    type: "pacing" | "continuity" | "logic" | "coherence" | "causality" | "timing";
    description: string;
    location: string;
    severity: number;
    cascadingEffects: string[];
    fixStrategy: {
        approach: string;
        effort: "minimal" | "moderate" | "substantial";
        riskLevel: "low" | "medium" | "high";
        implementation: string;
    };
}
export interface Recommendation {
    priority: "immediate" | "short_term" | "long_term" | "optional";
    category: "character" | "plot" | "structure" | "dialogue" | "theme" | "pacing";
    title: string;
    description: string;
    rationale: string;
    impact: number;
    effort: number;
    riskLevel: "low" | "medium" | "high";
    prerequisites: string[];
    implementation: {
        steps: string[];
        estimatedTime: string;
        potentialChallenges: string[];
    };
    expectedOutcome: string;
}
export interface PlotDevelopment {
    description: string;
    probability: number;
    confidence: number;
    contributingFactors: Array<{
        factor: string;
        weight: number;
    }>;
    potentialIssues: Array<{
        issue: string;
        severity: number;
        mitigation: string;
    }>;
    narrativePayoff: number;
}
export interface PlotPath {
    name: string;
    description: string;
    probability: number;
    divergencePoint: string;
    advantages: Array<{
        aspect: string;
        benefit: string;
        impact: number;
    }>;
    disadvantages: Array<{
        aspect: string;
        drawback: string;
        severity: number;
    }>;
    keyMoments: Array<{
        moment: string;
        significance: string;
        timing: string;
    }>;
    requiredSetup: string[];
    compatibilityScore: number;
}
export interface RiskArea {
    description: string;
    probability: number;
    impact: number;
    category: "narrative" | "character" | "theme" | "audience" | "execution";
    indicators: string[];
    mitigation: {
        strategy: string;
        effort: "low" | "medium" | "high";
        effectiveness: number;
    };
}
export interface Opportunity {
    description: string;
    potential: number;
    category: "character" | "plot" | "theme" | "emotional" | "commercial";
    currentState: string;
    exploitation: {
        approach: string;
        effort: "minimal" | "moderate" | "substantial";
        timeline: string;
    };
    expectedBenefit: string;
}
export interface PlotPoint {
    timestamp: string;
    description: string;
    importance: number;
    confidence: number;
}
export interface DiagnosticsReport {
    overallHealthScore: number;
    healthBreakdown: {
        characterDevelopment: number;
        plotCoherence: number;
        structuralIntegrity: number;
        dialogueQuality: number;
        thematicDepth: number;
    };
    criticalIssues: DiagnosticIssue[];
    warnings: DiagnosticIssue[];
    suggestions: DiagnosticIssue[];
    isolatedCharacters: IsolatedCharacter[];
    abandonedConflicts: AbandonedConflict[];
    structuralIssues: StructuralIssue[];
    riskAreas: RiskArea[];
    opportunities: Opportunity[];
    summary: string;
}
export interface TreatmentPlan {
    prioritizedRecommendations: Recommendation[];
    implementationRoadmap: {
        phase1: {
            title: string;
            tasks: string[];
            estimatedTime: string;
            expectedImpact: number;
        };
        phase2: {
            title: string;
            tasks: string[];
            estimatedTime: string;
            expectedImpact: number;
        };
        phase3: {
            title: string;
            tasks: string[];
            estimatedTime: string;
            expectedImpact: number;
        };
    };
    estimatedImprovementScore: number;
    implementationComplexity: "low" | "medium" | "high";
    totalTimeEstimate: string;
    riskAssessment: {
        overallRisk: "low" | "medium" | "high";
        specificRisks: Array<{
            risk: string;
            probability: number;
            impact: number;
            mitigation: string;
        }>;
    };
    successMetrics: Array<{
        metric: string;
        currentValue: number;
        targetValue: number;
        measurementMethod: string;
    }>;
}
export interface PlotPredictions {
    currentTrajectory: PlotPoint[];
    trajectoryConfidence: number;
    likelyDevelopments: PlotDevelopment[];
    alternativePaths: PlotPath[];
    criticalDecisionPoints: Array<{
        point: string;
        importance: number;
        options: string[];
        implications: string;
    }>;
    narrativeMomentum: number;
    predictabilityScore: number;
}
export interface Station6Output {
    diagnosticsReport: DiagnosticsReport;
    debateResults: DebateResult;
    treatmentPlan: TreatmentPlan;
    plotPredictions: PlotPredictions;
    uncertaintyReport: UncertaintyReport;
    metadata: StationMetadata;
}
export declare class Station6Diagnostics {
    private geminiService;
    private debateSystem;
    private uncertaintyEngine;
    constructor(geminiService: GeminiService);
    execute(text: string, previousStationsOutput: {
        station1: any;
        station2: any;
        station3: any;
        station4: any;
        station5: Station5Output;
    }): Promise<Station6Output>;
    private generateComprehensiveDiagnostics;
    private validateAndEnrichDiagnostics;
    private generateFallbackDiagnostics;
    private conductValidationDebate;
    private generateDetailedTreatmentPlan;
    private validateAndEnrichTreatmentPlan;
    private generateFallbackTreatmentPlan;
    private predictPlotTrajectoryWithAlternatives;
    private validateAndEnrichPlotPredictions;
    private generateFallbackPlotPredictions;
    private quantifyComprehensiveUncertainty;
    private createStructuredAnalysisSummary;
}
//# sourceMappingURL=station6-diagnostics-treatment.d.ts.map