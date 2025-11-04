import { BaseStation, StationInput, StationOptions } from './base-station';
import { GeminiService } from './gemini-service';
export interface Station1Input extends StationInput {
    proseFilePath?: string;
    station1Options?: {
        enableDialogueAnalysis?: boolean;
        enableVoiceDistinction?: boolean;
        minCharacters?: number;
        maxCharacters?: number;
    };
}
export interface CharacterProfile {
    name: string;
    role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
    personalityTraits: string[];
    motivations: string[];
    goals: string[];
    obstacles: string[];
    arc: {
        type: 'positive' | 'negative' | 'flat' | 'complex';
        description: string;
        keyMoments: string[];
    };
    confidence: number;
}
export interface DialogueMetrics {
    efficiency: number;
    distinctiveness: number;
    naturalness: number;
    subtext: number;
    issues: Array<{
        type: 'redundancy' | 'inconsistency' | 'exposition_dump' | 'on_the_nose' | 'pacing';
        location: string;
        severity: 'low' | 'medium' | 'high';
        suggestion: string;
    }>;
}
export interface VoiceProfile {
    character: string;
    distinctiveness: number;
    characteristics: string[];
    sampleLines: string[];
}
export interface VoiceAnalysis {
    profiles: Map<string, VoiceProfile>;
    overlapIssues: Array<{
        character1: string;
        character2: string;
        similarity: number;
        examples: string[];
        recommendation: string;
    }>;
    overallDistinctiveness: number;
}
export interface NarrativeStyleAnalysis {
    overallTone: string;
    toneElements: string[];
    pacingAnalysis: {
        overall: 'very_slow' | 'slow' | 'moderate' | 'fast' | 'very_fast';
        variation: number;
        strengths: string[];
        weaknesses: string[];
    };
    languageStyle: {
        complexity: 'simple' | 'moderate' | 'complex' | 'highly_complex';
        vocabulary: 'limited' | 'standard' | 'rich' | 'extensive';
        sentenceStructure: string;
        literaryDevices: string[];
    };
    pointOfView: string;
    timeStructure: string;
}
export interface Station1Output {
    logline: string;
    majorCharacters: CharacterProfile[];
    characterAnalysis: Map<string, CharacterProfile>;
    dialogueAnalysis: DialogueMetrics;
    voiceAnalysis: VoiceAnalysis;
    narrativeStyleAnalysis: NarrativeStyleAnalysis;
    textStatistics: {
        totalWords: number;
        totalCharacters: number;
        avgSentenceLength: number;
        dialoguePercentage: number;
        narrativePercentage: number;
    };
    uncertaintyReport: {
        confidence: number;
        uncertainties: Array<{
            type: 'epistemic' | 'aleatoric';
            aspect: string;
            note: string;
            reducible: boolean;
        }>;
    };
    metadata: {
        analysisTimestamp: Date;
        status: 'Success' | 'Partial' | 'Failed';
        agentsUsed: string[];
        executionTime: number;
        textLength: number;
        chunksProcessed: number;
    };
}
export declare class Station1TextAnalysis extends BaseStation {
    private readonly CHUNK_SIZE;
    private readonly MAX_PARALLEL_REQUESTS;
    constructor(geminiService: GeminiService);
    protected execute(input: StationInput, options: StationOptions): Promise<Station1Output>;
    private chunkText;
    private generateLogline;
    private identifyMajorCharacters;
    private analyzeCharactersInDepth;
    private analyzeCharacter;
    private analyzeDialogue;
    private analyzeVoices;
    private analyzeNarrativeStyle;
    private calculateTextStatistics;
    private buildUncertaintyReport;
    private processInBatches;
    private parseJSON;
    private extractText;
    private normalizeRole;
    private normalizeArcType;
    private normalizeIssues;
    private normalizeIssueType;
    private normalizeSeverity;
    private normalizePacingSpeed;
    private normalizeComplexity;
    private normalizeVocabulary;
    private getDefaultDialogueMetrics;
    private getDefaultVoiceAnalysis;
    private clamp;
    protected getAgentsUsed(): string[];
}
//# sourceMappingURL=station1-text-analysis.d.ts.map