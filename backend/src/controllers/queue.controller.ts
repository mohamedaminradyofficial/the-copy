/**
 * Queue Controller
 *
 * API endpoints for job queue management and monitoring
 */

import { Request, Response } from 'express';
import { queueManager, QueueName } from '../queues/queue.config';
import { queueAIAnalysis } from '../queues/jobs/ai-analysis.job';
import { queueDocumentProcessing } from '../queues/jobs/document-processing.job';

/**
 * Get queue statistics
 */
export async function getQueueStats(req: Request, res: Response): Promise<void> {
  try {
    const stats = await queueManager.getAllStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('[QueueController] Error getting stats:', error);
    res.status(500).json({ success: false, error: 'Failed to get queue stats' });
  }
}

/**
 * Get specific queue statistics
 */
export async function getQueueStatsById(req: Request, res: Response): Promise<void> {
  try {
    const { queueName } = req.params;

    if (!Object.values(QueueName).includes(queueName as QueueName)) {
      res.status(400).json({ success: false, error: 'Invalid queue name' });
      return;
    }

    const stats = await queueManager.getQueueStats(queueName as QueueName);
    res.json({ success: true, stats });
  } catch (error) {
    console.error('[QueueController] Error getting queue stats:', error);
    res.status(500).json({ success: false, error: 'Failed to get queue stats' });
  }
}

/**
 * Get job status
 */
export async function getJobStatus(req: Request, res: Response): Promise<void> {
  try {
    const { queueName, jobId } = req.params;

    if (!Object.values(QueueName).includes(queueName as QueueName)) {
      res.status(400).json({ success: false, error: 'Invalid queue name' });
      return;
    }

    const queue = queueManager.getQueue(queueName as QueueName);
    const job = await queue.getJob(jobId);

    if (!job) {
      res.status(404).json({ success: false, error: 'Job not found' });
      return;
    }

    const state = await job.getState();
    const progress = job.progress;
    const returnValue = job.returnvalue;
    const failedReason = job.failedReason;

    res.json({
      success: true,
      job: {
        id: job.id,
        name: job.name,
        data: job.data,
        state,
        progress,
        result: returnValue,
        error: failedReason,
        timestamp: job.timestamp,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
        attemptsMade: job.attemptsMade,
      },
    });
  } catch (error) {
    console.error('[QueueController] Error getting job status:', error);
    res.status(500).json({ success: false, error: 'Failed to get job status' });
  }
}

/**
 * Queue AI analysis job
 */
export async function createAIAnalysisJob(req: Request, res: Response): Promise<void> {
  try {
    const { type, entityId, analysisType, options } = req.body;
    const userId = req.user?.id || 'system';

    if (!type || !entityId) {
      res.status(400).json({ success: false, error: 'Missing required fields' });
      return;
    }

    const jobId = await queueAIAnalysis({
      type,
      entityId,
      userId,
      analysisType: analysisType || 'full',
      options,
    });

    res.status(202).json({
      success: true,
      message: 'Job queued successfully',
      jobId,
      queue: QueueName.AI_ANALYSIS,
      statusUrl: `/api/queue/${QueueName.AI_ANALYSIS}/jobs/${jobId}`,
    });
  } catch (error) {
    console.error('[QueueController] Error creating AI analysis job:', error);
    res.status(500).json({ success: false, error: 'Failed to queue job' });
  }
}

/**
 * Queue document processing job
 */
export async function createDocumentProcessingJob(req: Request, res: Response): Promise<void> {
  try {
    const { documentId, filePath, fileType, projectId, options } = req.body;
    const userId = req.user?.id || 'system';

    if (!documentId || !filePath || !fileType) {
      res.status(400).json({ success: false, error: 'Missing required fields' });
      return;
    }

    const jobId = await queueDocumentProcessing({
      documentId,
      filePath,
      fileType,
      userId,
      projectId,
      options,
    });

    res.status(202).json({
      success: true,
      message: 'Job queued successfully',
      jobId,
      queue: QueueName.DOCUMENT_PROCESSING,
      statusUrl: `/api/queue/${QueueName.DOCUMENT_PROCESSING}/jobs/${jobId}`,
    });
  } catch (error) {
    console.error('[QueueController] Error creating document processing job:', error);
    res.status(500).json({ success: false, error: 'Failed to queue job' });
  }
}

/**
 * Pause a queue
 */
export async function pauseQueue(req: Request, res: Response): Promise<void> {
  try {
    const { queueName } = req.params;

    if (!Object.values(QueueName).includes(queueName as QueueName)) {
      res.status(400).json({ success: false, error: 'Invalid queue name' });
      return;
    }

    await queueManager.pauseQueue(queueName as QueueName);
    res.json({ success: true, message: `Queue ${queueName} paused` });
  } catch (error) {
    console.error('[QueueController] Error pausing queue:', error);
    res.status(500).json({ success: false, error: 'Failed to pause queue' });
  }
}

/**
 * Resume a queue
 */
export async function resumeQueue(req: Request, res: Response): Promise<void> {
  try {
    const { queueName } = req.params;

    if (!Object.values(QueueName).includes(queueName as QueueName)) {
      res.status(400).json({ success: false, error: 'Invalid queue name' });
      return;
    }

    await queueManager.resumeQueue(queueName as QueueName);
    res.json({ success: true, message: `Queue ${queueName} resumed` });
  } catch (error) {
    console.error('[QueueController] Error resuming queue:', error);
    res.status(500).json({ success: false, error: 'Failed to resume queue' });
  }
}

/**
 * Clean old jobs from queue
 */
export async function cleanQueue(req: Request, res: Response): Promise<void> {
  try {
    const { queueName } = req.params;
    const { grace = 24 * 3600 * 1000 } = req.body; // Default 24 hours

    if (!Object.values(QueueName).includes(queueName as QueueName)) {
      res.status(400).json({ success: false, error: 'Invalid queue name' });
      return;
    }

    await queueManager.cleanQueue(queueName as QueueName, grace);
    res.json({ success: true, message: `Queue ${queueName} cleaned` });
  } catch (error) {
    console.error('[QueueController] Error cleaning queue:', error);
    res.status(500).json({ success: false, error: 'Failed to clean queue' });
  }
}

export default {
  getQueueStats,
  getQueueStatsById,
  getJobStatus,
  createAIAnalysisJob,
  createDocumentProcessingJob,
  pauseQueue,
  resumeQueue,
  cleanQueue,
};
