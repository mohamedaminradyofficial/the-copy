import { GeminiService } from '../../stations/gemini-service';
export interface StationConfig<TInput, TOutput> {
    stationId: string;
    name: string;
    description: string;
    cacheEnabled?: boolean;
    performanceTracking?: boolean;
    inputValidation?: (input: TInput) => boolean;
    outputValidation?: (output: TOutput) => boolean;
}
export declare abstract class BaseStation<TInput, TOutput> {
    protected config: StationConfig<TInput, TOutput>;
    protected geminiService: GeminiService;
    constructor(config: StationConfig<TInput, TOutput>, geminiService: GeminiService);
    execute(input: TInput): Promise<{
        output: TOutput;
        executionTime: number;
    }>;
    protected abstract process(input: TInput): Promise<TOutput>;
    protected abstract extractRequiredData(input: TInput): Record<string, unknown>;
    protected abstract getErrorFallback(): TOutput;
}
//# sourceMappingURL=base-station.d.ts.map