// أنواع البيانات المشتركة لنظام المحطات السبع
export type StationInput = {
  text: string;
  prev?: unknown;
};

export type StationOutput = {
  summary: string;
  confidence: number;
  uncertainties?: {
    type: "epistemic" | "aleatoric";
    note: string;
  }[];
  alternates?: {
    hypothesis: string;
    confidence: number;
  }[];
  meta?: Record<string, unknown>;
};

export interface Station {
  id: `S${1 | 2 | 3 | 4 | 5 | 6 | 7}`;
  run(input: StationInput): Promise<StationOutput>;
}

export type OrchestrationResult = {
  stations: Record<string, StationOutput>;
  finalReport: string;
  totalConfidence: number;
  executionTime: number;
};
