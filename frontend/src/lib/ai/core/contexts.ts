// Context types for drama analysis system

export interface CharacterContext {
  name: string;
  role?: string;
  traits?: string[];
  relationships?: Record<string, string>;
}

export interface NarrativeContext {
  title?: string;
  genre?: string;
  theme?: string;
  plot?: string;
  structure?: string;
}

export interface AnalysisContext {
  inputText: string;
  metadata?: Record<string, any>;
  previousAnalysis?: any;
}
