/**
 * Queue System Entry Point
 *
 * Initializes all workers and exports queue utilities
 */

import { registerAIAnalysisWorker } from './jobs/ai-analysis.job';
import { registerDocumentProcessingWorker } from './jobs/document-processing.job';
import { registerCacheWarmingWorker } from './jobs/cache-warming.job';
import { queueManager } from './queue.config';

/**
 * Initialize all workers
 */
export function initializeWorkers(): void {
  console.log('[QueueSystem] Initializing workers...');

  // Register all job processors
  registerAIAnalysisWorker();
  registerDocumentProcessingWorker();
  registerCacheWarmingWorker();

  console.log('[QueueSystem] All workers initialized');
}

/**
 * Shutdown all workers and queues
 */
export async function shutdownQueues(): Promise<void> {
  console.log('[QueueSystem] Shutting down...');
  await queueManager.close();
  console.log('[QueueSystem] Shutdown complete');
}

// Export queue manager and job functions
export { queueManager, QueueName } from './queue.config';
export { queueAIAnalysis } from './jobs/ai-analysis.job';
export { queueDocumentProcessing } from './jobs/document-processing.job';
export { queueCacheWarming } from './jobs/cache-warming.job';

export default {
  initializeWorkers,
  shutdownQueues,
  queueManager,
};
