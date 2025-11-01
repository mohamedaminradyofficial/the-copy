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
