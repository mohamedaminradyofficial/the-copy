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

import type {
  Character,
  CharacterAnalysis,
  Relationship,
  Conflict,
  Theme,
  DialogueAnalysis,
  UncertaintyReport,
  AudienceProfile,
  ScoreMatrix,
  Recommendation,
  DebateResult,
  ConflictNetwork,
} from "../../interfaces/response-types";

// Re-export types from response-types for backward compatibility
export type {
  Character,
  CharacterAnalysis,
  Relationship,
  Conflict,
  Theme,
  DialogueAnalysis,
  UncertaintyReport,
  AudienceProfile,
  ScoreMatrix,
  Recommendation,
  DebateResult,
  ConflictNetwork,
};

export interface SystemMetadata {
  timestamp?: string | undefined;
  version?: string | undefined;
  model?: string | undefined;
  [key: string]: unknown;
}
