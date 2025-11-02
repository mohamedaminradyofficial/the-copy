export interface StationMetadata {
  stationName: string;
  stationNumber: number;
  status: "Success" | "Partial" | "Failed";
  error?: string;
  executionTime: number;
  agentsUsed: string[];
  tokensUsed: number;
  options?: {
    constitutionalCheck?: boolean;
    uncertaintyQuantification?: boolean;
    rag?: boolean;
    temperature?: number;
    maxTokens?: number;
  };
  ragInfo?: {
    wasChunked: boolean;
    chunksCount: number;
    retrievalTime: number;
  };
}

export interface SystemMetadata {
  timestamp?: string;
  version?: string;
  model?: string;
  [key: string]: any;
}

export interface Character {
  name: string;
  role?: string;
  [key: string]: any;
}

export interface CharacterAnalysis {
  character: Character;
  analysis?: string;
  [key: string]: any;
}

export interface DialogueAnalysis {
  speaker?: string;
  text?: string;
  [key: string]: any;
}

export interface UncertaintyReport {
  confidence?: number;
  [key: string]: any;
}

export interface Relationship {
  from: string;
  to: string;
  type?: string;
  [key: string]: any;
}

export interface Conflict {
  type?: string;
  description?: string;
  [key: string]: any;
}

export interface Theme {
  name: string;
  description?: string;
  [key: string]: any;
}

export interface AudienceProfile {
  demographics?: string[];
  [key: string]: any;
}

export interface ScoreMatrix {
  scores?: Record<string, number>;
  [key: string]: any;
}

export interface Recommendation {
  text: string;
  priority?: string;
  [key: string]: any;
}

export interface DebateResult {
  conclusion?: string;
  [key: string]: any;
}

export interface ConflictNetwork {
  characters: Map<string, Character>;
  relationships: Map<string, Relationship[]>;
  conflicts?: Conflict[];
  [key: string]: any;
}
