/**
 * Bull Board - Queue Monitoring Dashboard
 * 
 * Provides a web interface to monitor and manage BullMQ queues
 * Access: http://localhost:5000/admin/queues
 */

import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { queueManager, QueueName } from '@/queues/queue.config';

// Create Express adapter for Bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

/**
 * Initialize Bull Board with all queues
 */
export function setupBullBoard() {
  const queues = [
    QueueName.AI_ANALYSIS,
    QueueName.DOCUMENT_PROCESSING,
  ];

  const bullBoard = createBullBoard({
    queues: queues.map((queueName) => {
      const queue = queueManager.getQueue(queueName);
      return new BullMQAdapter(queue);
    }),
    serverAdapter,
  });

  console.log('[BullBoard] Dashboard initialized at /admin/queues');

  return serverAdapter;
}

export { serverAdapter };

