import { GeminiService } from './gemini-service';
import { type Station1Output } from './station1-text-analysis';
import { type Station2Output } from './station2-conceptual-analysis';
import { type Station3Output } from './station3-network-builder';
import { type Station4Output } from './station4-efficiency-metrics';
import { type Station5Output } from './station5-dynamic-symbolic-stylistic';
import { type Station6Output } from './station6-diagnostics-treatment';
import { type Station7Output } from './station7-finalization';
export interface OrchestrationConfig {
    geminiService: GeminiService;
    outputDirectory: string;
    enableCaching?: boolean;
    enableRetry?: boolean;
    maxRetries?: number;
    retryDelay?: number;
    enableProgressTracking?: boolean;
    enableDetailedLogging?: boolean;
}
export interface StationProgress {
    stationNumber: number;
    stationName: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'retrying';
    startTime?: number;
    endTime?: number;
    duration?: number;
    attempt?: number;
    error?: string;
}
export interface OrchestrationResult {
    success: boolean;
    stationOutputs: {
        station1?: Station1Output;
        station2?: Station2Output;
        station3?: Station3Output;
        station4?: Station4Output;
        station5?: Station5Output;
        station6?: Station6Output;
        station7?: Station7Output;
    };
    metadata: {
        totalExecutionTime: number;
        stationsCompleted: number;
        stationsFailed: number;
        startedAt: string;
        finishedAt: string;
        overallScore?: number;
        overallRating?: string;
    };
    progressLog: StationProgress[];
    errors: Array<{
        station: number;
        error: string;
        timestamp: string;
    }>;
}
export declare class StationsOrchestrator {
    private readonly geminiService;
    private readonly outputDirectory;
    private readonly enableCaching;
    private readonly enableRetry;
    private readonly maxRetries;
    private readonly retryDelay;
    private readonly enableProgressTracking;
    private readonly enableDetailedLogging;
    private progressLog;
    private errors;
    constructor(config: OrchestrationConfig);
    execute(fullText: string, projectName?: string, options?: {
        startFromStation?: number;
        endAtStation?: number;
        skipStations?: number[];
    }): Promise<OrchestrationResult>;
    private executeStation;
    private createStationConfig;
    private delay;
    getProgressLog(): StationProgress[];
    getErrors(): Array<{
        station: number;
        error: string;
        timestamp: string;
    }>;
    getStationStatus(): Record<string, string>;
    clearProgressLog(): void;
}
//# sourceMappingURL=orchestrator.d.ts.map