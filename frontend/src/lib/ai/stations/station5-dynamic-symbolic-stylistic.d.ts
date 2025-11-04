import { BaseStation, type StationConfig } from "../core/pipeline/base-station";
import { ConflictNetwork, ConflictPhase } from "../core/models/base-entities";
import { GeminiService } from "./gemini-service";
import { Station4Output } from "./station4-efficiency-metrics";
import { DebateResult } from "../constitutional";
export interface Station5Input {
    conflictNetwork: ConflictNetwork;
    station4Output: Station4Output;
    fullText: string;
    options?: {
        enableConstitutionalAI?: boolean;
        enableUncertaintyQuantification?: boolean;
        enableMultiAgentDebate?: boolean;
        temperature?: number;
    };
}
export interface Station5Output {
    dynamicAnalysis: DynamicAnalysis;
    symbolicAnalysis: SymbolicAnalysis;
    stylisticAnalysis: StylisticAnalysis;
    tensionAnalysis: TensionAnalysis;
    advancedDialogueAnalysis: AdvancedDialogueAnalysis;
    visualCinematicAnalysis: VisualCinematicAnalysis;
    uncertaintyReport: UncertaintyReport;
    metadata: StationMetadata;
}
interface DynamicAnalysis {
    eventTimeline: TimelineEvent[];
    networkEvolution: EvolutionAnalysis;
    characterDevelopment: Map<string, CharacterEvolution>;
    conflictProgression: Map<string, ConflictProgression>;
}
interface TimelineEvent {
    timestamp: Date;
    eventType: "character_introduced" | "relationship_formed" | "conflict_emerged" | "conflict_escalated" | "conflict_resolved" | "character_transformed" | "network_snapshot" | "other";
    description: string;
    involvedEntities: {
        characters?: string[];
        relationships?: string[];
        conflicts?: string[];
    };
    significance: number;
    narrativePhase: "setup" | "rising_action" | "climax" | "falling_action" | "resolution";
}
interface EvolutionAnalysis {
    overallGrowthRate: number;
    complexityProgression: number[];
    densityProgression: number[];
    criticalTransitionPoints: Array<{
        timestamp: Date;
        description: string;
        impactScore: number;
    }>;
    stabilityMetrics: {
        structuralStability: number;
        characterStability: number;
        conflictStability: number;
    };
}
interface CharacterEvolution {
    characterId: string;
    characterName: string;
    developmentStages: Array<{
        timestamp: Date;
        stage: string;
        traits: string[];
        relationships: string[];
        conflicts: string[];
    }>;
    arcType: "positive" | "negative" | "flat" | "complex";
    transformationScore: number;
    keyMoments: Array<{
        timestamp: Date;
        event: string;
        impact: string;
    }>;
}
interface ConflictProgression {
    conflictId: string;
    conflictName: string;
    phaseTransitions: Array<{
        timestamp: Date;
        fromPhase: ConflictPhase;
        toPhase: ConflictPhase;
        catalyst: string;
    }>;
    intensityProgression: number[];
    resolutionProbability: number;
    stagnationRisk: number;
}
interface SymbolicAnalysis {
    keySymbols: Symbol[];
    recurringMotifs: Motif[];
    centralThemesHintedBySymbols: string[];
    symbolicNetworks: Array<{
        primarySymbol: string;
        relatedSymbols: string[];
        thematicConnection: string;
    }>;
    depthScore: number;
    consistencyScore: number;
}
interface Symbol {
    symbol: string;
    interpretation: string;
    frequency: number;
    contextualMeanings: string[];
}
interface Motif {
    motif: string;
    occurrences: number;
    narrativeFunction: string;
}
interface StylisticAnalysis {
    toneAssessment: ToneAssessment;
    languageComplexity: LanguageMetrics;
    pacingAnalysis: PacingAnalysis;
    descriptiveRichness: DescriptiveMetrics;
}
interface ToneAssessment {
    primaryTone: string;
    secondaryTones: string[];
    toneConsistency: number;
    explanation: string;
}
interface LanguageMetrics {
    level: "simple" | "moderate" | "complex" | "highly_complex";
    readabilityScore: number;
    vocabularyRichness: number;
}
interface PacingAnalysis {
    overallPacing: "very_slow" | "slow" | "balanced" | "fast" | "very_fast";
    pacingVariation: number;
    sceneLengthDistribution: number[];
}
interface DescriptiveMetrics {
    visualDetailLevel: number;
    sensoryEngagement: number;
    atmosphericQuality: number;
}
interface TensionAnalysis {
    tensionCurve: number[];
    peaks: TensionPeak[];
    valleys: TensionValley[];
    recommendations: {
        addTension: Location[];
        reduceTension: Location[];
        redistributeTension: string[];
    };
}
interface TensionPeak {
    timestamp: Date;
    intensity: number;
    description: string;
    contributingFactors: string[];
}
interface TensionValley {
    timestamp: Date;
    intensity: number;
    description: string;
    contributingFactors: string[];
}
interface Location {
    timestamp: Date;
    description: string;
    currentIntensity: number;
    suggestedIntensity: number;
}
interface AdvancedDialogueAnalysis {
    subtext: SubtextAnalysis[];
    powerDynamics: PowerDynamic[];
    emotionalBeats: EmotionalBeat[];
    advancedMetrics: {
        subtextDepth: number;
        emotionalRange: number;
        characterVoiceConsistency: Map<string, number>;
    };
}
interface SubtextAnalysis {
    location: string;
    explicitText: string;
    impliedMeaning: string;
    confidence: number;
}
interface PowerDynamic {
    characters: string[];
    relationshipType: string;
    powerBalance: number;
    evolution: Array<{
        timestamp: Date;
        balance: number;
        catalyst: string;
    }>;
}
interface EmotionalBeat {
    timestamp: Date;
    emotion: string;
    intensity: number;
    characters: string[];
    trigger: string;
}
interface VisualCinematicAnalysis {
    visualDensity: number;
    cinematicPotential: number;
    keyVisualMoments: VisualMoment[];
    colorPalette: string[];
    visualMotifs: Motif[];
    cinematographyNotes: string[];
}
interface VisualMoment {
    timestamp: Date;
    description: string;
    visualType: "wide_shot" | "medium_shot" | "close_up" | "extreme_close_up" | "establishing";
    emotionalImpact: number;
    symbolicElements: string[];
}
interface UncertaintyReport {
    overallConfidence: number;
    uncertainties: Array<{
        type: "epistemic" | "aleatoric";
        aspect: string;
        note: string;
    }>;
}
interface StationMetadata {
    analysisTimestamp: Date;
    status: "Success" | "Partial" | "Failed";
    agentsUsed: string[];
    executionTime: number;
    constitutionalViolations?: number;
    debateResults?: DebateResult;
}
export declare class Station5DynamicSymbolicStylistic extends BaseStation<Station5Input, Station5Output> {
    private dynamicEngine;
    private symbolicEngine;
    private stylisticEngine;
    private tensionEngine;
    private dialogueEngine;
    private visualEngine;
    private debateSystem;
    constructor(config: StationConfig<Station5Input, Station5Output>, geminiService: GeminiService);
    protected process(input: Station5Input): Promise<Station5Output>;
    protected extractRequiredData(input: Station5Input): Record<string, unknown>;
    protected getErrorFallback(): Station5Output;
}
export {};
//# sourceMappingURL=station5-dynamic-symbolic-stylistic.d.ts.map