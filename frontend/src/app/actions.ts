/**
 * @deprecated This file has been moved to src/lib/actions/
 * Please import from "@/lib/actions/analysis" instead
 *
 * This file is kept for backward compatibility but will be removed in the future
 */

// Re-export from new location for backward compatibility
export {
  runFullPipeline,
  runTextPipeline,
  type PipelineInput,
  type PipelineRunResult,
  type PipelineResult,
  type StationCtx,
} from '@/lib/actions/analysis';
