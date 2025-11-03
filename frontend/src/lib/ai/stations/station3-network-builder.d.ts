import { BaseStation, StationInput } from "./base-station";
import { GeminiService } from "./gemini-service";
import { Station1Output } from "./station1-text-analysis";
import { Station2Output } from "./station2-conceptual-analysis";
export declare enum RelationshipType {
    FAMILY = "family",
    FRIENDSHIP = "friendship",
    ROMANTIC = "romantic",
    PROFESSIONAL = "professional",
    ANTAGONISTIC = "antagonistic",
    MENTORSHIP = "mentorship",
    OTHER = "other"
}
export declare enum RelationshipNature {
    POSITIVE = "positive",
    NEGATIVE = "negative",
    NEUTRAL = "neutral",
    VOLATILE = "volatile"
}
export declare enum RelationshipDirection {
    UNIDIRECTIONAL = "unidirectional",
    BIDIRECTIONAL = "bidirectional"
}
export declare enum ConflictSubject {
    RELATIONSHIP = "relationship",
    POWER = "power",
    IDEOLOGY = "ideology",
    RESOURCES = "resources",
    INFORMATION = "information",
    TERRITORY = "territory",
    HONOR = "honor",
    OTHER = "other"
}
export declare enum ConflictScope {
    PERSONAL = "personal",
    GROUP = "group",
    SOCIETAL = "societal"
}
export declare enum ConflictPhase {
    EMERGING = "emerging",
    ESCALATING = "escalating",
    PEAK = "peak",
    RESOLVING = "resolving",
    RESOLVED = "resolved"
}
export interface Character {
    id: string;
    name: string;
    description: string;
    profile?: {
        personalityTraits: string;
        motivationsGoals: string;
        potentialArc: string;
    };
    metadata: {
        source: string;
        analysisTimestamp: string;
    };
}
export interface Relationship {
    id: string;
    source: string;
    target: string;
    type: RelationshipType;
    nature: RelationshipNature;
    direction: RelationshipDirection;
    strength: number;
    description: string;
    triggers: string[];
    metadata: {
        source: string;
        inferenceTimestamp: string;
    };
}
export interface Conflict {
    id: string;
    name: string;
    description: string;
    involvedCharacters: string[];
    subject: ConflictSubject;
    scope: ConflictScope;
    phase: ConflictPhase;
    strength: number;
    relatedRelationships: string[];
    pivotPoints: any[];
    timestamps: Date[];
    metadata: {
        source: string;
        inferenceTimestamp: string;
    };
}
export interface CharacterArc {
    characterId: string;
    characterName: string;
    arcType: 'positive' | 'negative' | 'flat' | 'transformational' | 'fall';
    arcDescription: string;
    keyMoments: Array<{
        timestamp: Date;
        description: string;
        impact: number;
    }>;
    transformation: string;
    confidence: number;
}
export interface ConflictNetwork {
    id: string;
    name: string;
    characters: Map<string, Character>;
    relationships: Map<string, Relationship>;
    conflicts: Map<string, Conflict>;
    addCharacter(character: Character): void;
    addRelationship(relationship: Relationship): void;
    addConflict(conflict: Conflict): void;
    createSnapshot(description: string): void;
}
export declare class ConflictNetworkImpl implements ConflictNetwork {
    id: string;
    name: string;
    characters: Map<string, Character>;
    relationships: Map<string, Relationship>;
    conflicts: Map<string, Conflict>;
    constructor(id: string, name: string);
    addCharacter(character: Character): void;
    addRelationship(relationship: Relationship): void;
    addConflict(conflict: Conflict): void;
    createSnapshot(description: string): void;
}
export interface DiagnosticReport {
    overallHealthScore: number;
    criticalityLevel: 'low' | 'medium' | 'high' | 'critical';
    structuralIssues: string[];
    isolatedCharacters: {
        totalIsolated: number;
        characters: string[];
    };
    abandonedConflicts: {
        totalAbandoned: number;
        conflicts: string[];
    };
    overloadedCharacters: {
        totalOverloaded: number;
        characters: string[];
    };
    weakConnections: {
        totalWeak: number;
        connections: string[];
    };
    redundancies: {
        totalRedundant: number;
        items: string[];
    };
}
export declare class NetworkDiagnostics {
    private network;
    constructor(network: ConflictNetwork);
    runAllDiagnostics(): DiagnosticReport;
}
export interface Station3Context {
    majorCharacters: string[];
    characterProfiles?: Map<string, any>;
    relationshipData?: any[];
    fullText: string;
}
export interface Station3Input extends StationInput {
    station1Output: Station1Output;
    station2Output: Station2Output;
}
export interface Station3Output {
    conflictNetwork: ConflictNetwork;
    networkAnalysis: {
        density: number;
        complexity: number;
        balance: number;
        dynamicRange: number;
    };
    conflictAnalysis: {
        mainConflict: Conflict;
        subConflicts: Conflict[];
        conflictTypes: Map<string, number>;
        intensityProgression: number[];
    };
    characterArcs: Map<string, CharacterArc>;
    pivotPoints: Array<{
        timestamp: string;
        description: string;
        impact: number;
        affectedElements: string[];
    }>;
    diagnosticsReport: DiagnosticReport;
    uncertaintyReport: {
        confidence: number;
        uncertainties: Array<{
            type: 'epistemic' | 'aleatoric';
            aspect: string;
            note: string;
        }>;
    };
    metadata: {
        analysisTimestamp: Date;
        status: "Success" | "Partial" | "Failed";
        buildTime: number;
        agentsUsed: string[];
    };
}
export declare class Station3NetworkBuilder extends BaseStation {
    private relationshipEngine;
    private conflictEngine;
    private networkAnalyzer;
    private networkDiagnostics;
    constructor(geminiService: GeminiService);
    protected execute(input: StationInput, options: any): Promise<Station3Output>;
    private calculateUncertainty;
    private buildContext;
    private createCharactersFromStation1;
    protected extractRequiredData(input: Station3Input): Record<string, unknown>;
    protected getErrorFallback(): Station3Output;
    protected getAgentsUsed(): string[];
}
//# sourceMappingURL=station3-network-builder.d.ts.map