import { BaseStation, StationInput, StationOptions } from "./base-station";
import { GeminiService } from "./gemini-service";
import { Station1Output } from "./station1-text-analysis";
export interface Station2Context {
    majorCharacters: Array<{
        name: string;
        role: string;
    }>;
    relationshipSummary: string;
    narrativeTone: string;
    fullText: string;
    logline: string;
    conflictSummary: string;
    dialogueQuality: number;
}
export interface Station2Input extends StationInput {
    station1Output: Station1Output;
}
export interface ThreeDMapResult {
    horizontalEventsAxis: Array<{
        event: string;
        sceneRef: string;
        timestamp: string;
        narrativeWeight: number;
    }>;
    verticalMeaningAxis: Array<{
        eventRef: string;
        symbolicLayer: string;
        thematicConnection: string;
        depth: number;
    }>;
    temporalDevelopmentAxis: {
        pastInfluence: string;
        presentChoices: string;
        futureExpectations: string;
        heroArcConnection: string;
        causality: string;
    };
}
export interface GenreMatrixResult {
    [genreName: string]: {
        conflictContribution: string;
        pacingContribution: string;
        visualCompositionContribution: string;
        soundMusicContribution: string;
        charactersContribution: string;
        weight: number;
    };
}
export interface DynamicToneResult {
    [stageName: string]: {
        visualAtmosphereDescribed: string;
        writtenPacing: string;
        dialogueStructure: string;
        soundIndicationsDescribed: string;
        emotionalIntensity: number;
    };
}
export interface ArtisticReferencesResult {
    visualReferences: Array<{
        work: string;
        artist?: string;
        reason: string;
        sceneApplication: string;
    }>;
    musicalMood: string;
    cinematicInfluences: Array<{
        film: string;
        director?: string;
        aspect: string;
    }>;
    literaryParallels: Array<{
        work: string;
        author?: string;
        connection: string;
    }>;
}
export interface ThemeAnalysis {
    primaryThemes: Array<{
        theme: string;
        evidence: string[];
        strength: number;
        development: string;
    }>;
    secondaryThemes: Array<{
        theme: string;
        occurrences: number;
    }>;
    thematicConsistency: number;
}
export interface Station2Output {
    storyStatement: string;
    alternativeStatements: string[];
    threeDMap: ThreeDMapResult;
    elevatorPitch: string;
    hybridGenre: string;
    genreAlternatives: string[];
    genreContributionMatrix: GenreMatrixResult;
    dynamicTone: DynamicToneResult;
    artisticReferences: ArtisticReferencesResult;
    themeAnalysis: ThemeAnalysis;
    targetAudience: {
        primaryAudience: string;
        demographics: string[];
        psychographics: string[];
    };
    marketAnalysis: {
        producibility: number;
        commercialPotential: number;
        uniqueness: number;
    };
    metadata: {
        analysisTimestamp: Date;
        status: "Success" | "Partial" | "Failed";
        processingTime: number;
        confidenceScore: number;
    };
}
export declare class Station2ConceptualAnalysis extends BaseStation {
    constructor(geminiService: GeminiService);
    protected execute(input: StationInput, options: StationOptions): Promise<Station2Output>;
    private buildContextFromStation1;
    private generateStoryStatements;
    private generate3DMap;
    private validate3DMap;
    private generateElevatorPitch;
    private generateHybridGenre;
    private generateGenreMatrix;
    private validateGenreMatrix;
    private generateDynamicTone;
    private validateDynamicTone;
    private generateArtisticReferences;
    private validateArtisticReferences;
    private analyzeThemes;
    private validateThemeAnalysis;
    private identifyTargetAudience;
    private analyzeMarketPotential;
    private calculateConfidenceScore;
    private getErrorFallback;
    private getDefault3DMap;
    private getDefaultGenreMatrix;
    private getDefaultDynamicTone;
    private getDefaultArtisticReferences;
    private getDefaultThemeAnalysis;
    protected getAgentsUsed(): string[];
}
//# sourceMappingURL=station2-conceptual-analysis.d.ts.map