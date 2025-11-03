export type ModelId = "gemini-2.5-flash-lite" | "gemini-2.5-flash" | "gemini-2.5-pro";
export declare const MAX_TOKENS: 48192;
export declare function throttle(model: ModelId): Promise<void>;
export declare function toText(v: unknown): string;
export declare function safeSub(s: unknown, a: number, b?: number): string;
export declare function safeSplit(s: unknown, sep: string | RegExp): string[];
export type CallOpts = {
    model: ModelId;
    prompt: string;
    temperature?: number;
    systemInstruction?: string;
};
export declare function callGeminiText(opts: CallOpts): Promise<string>;
export declare function callFlashLite(prompt: string, opts?: {
    temperature?: number;
    systemInstruction?: string;
}): Promise<string>;
export declare function callFlash(prompt: string, opts?: {
    temperature?: number;
    systemInstruction?: string;
}): Promise<string>;
export declare function callPro(prompt: string, opts?: {
    temperature?: number;
    systemInstruction?: string;
}): Promise<string>;
//# sourceMappingURL=gemini-core.d.ts.map