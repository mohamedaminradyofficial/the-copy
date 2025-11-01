import { GeminiService } from '../stations/gemini-service';
export interface DebateParticipant {
    role: 'prosecutor' | 'defender' | 'judge';
    name: string;
    perspective: string;
}
export interface DebateArgument {
    participant: string;
    argument: string;
    evidence: string[];
    strength: number;
}
export interface DebateRound {
    round: number;
    prosecutorArgument: DebateArgument;
    defenderArgument: DebateArgument;
    judgeComments: string;
}
export interface ConsensusArea {
    aspect: string;
    agreement: string;
    confidence: number;
}
export interface DisputedArea {
    aspect: string;
    prosecutorView: string;
    defenderView: string;
    judgeOpinion: string;
    resolution: string;
}
export interface FinalVerdict {
    overallAssessment: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    confidence: number;
}
export interface DebateVerdict {
    consensusAreas: ConsensusArea[];
    disputedAreas: DisputedArea[];
    finalVerdict: FinalVerdict;
}
export interface DebateDynamics {
    rounds: number;
    convergenceScore: number;
    controversialTopics: string[];
}
export interface DebateResult {
    participants: DebateParticipant[];
    rounds: DebateRound[];
    verdict: DebateVerdict;
    debateDynamics: DebateDynamics;
}
export declare class MultiAgentDebateSystem {
    private geminiService;
    constructor(geminiService: GeminiService);
    conductDebate(text: string, analysis: string, context: {
        analysisType: string;
        previousResults?: any;
    }, maxRounds?: number): Promise<DebateResult>;
    private conductDebateRound;
    private generateProsecutorArgument;
    private generateDefenderArgument;
    private generateJudgeComments;
    private generateVerdict;
    private checkConvergence;
    private identifyControversialTopics;
    private extractTopics;
    private parseDebateArgument;
}
export declare function getMultiAgentDebateSystem(geminiService: GeminiService): MultiAgentDebateSystem;
//# sourceMappingURL=multi-agent-debate.d.ts.map