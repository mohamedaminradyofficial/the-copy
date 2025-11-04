import { env } from '../config/env';
import * as schema from './schema';

// Mock database for development
const mockDb = {
  select: () => ({
    from: () => ({
      where: () => ({
        limit: () => Promise.resolve([]),
        orderBy: () => Promise.resolve([]),
      }),
      orderBy: () => Promise.resolve([]),
      limit: () => Promise.resolve([]),
    }),
  }),
  insert: () => ({
    values: () => ({
      returning: () => Promise.resolve([{ id: 'mock-id', createdAt: new Date() }]),
    }),
  }),
  update: () => ({
    set: () => ({
      where: () => ({
        returning: () => Promise.resolve([{ id: 'mock-id', updatedAt: new Date() }]),
      }),
    }),
  }),
  delete: () => ({
    where: () => Promise.resolve(),
  }),
};

// Export mock database for now
export const db = mockDb as any;
export const pool = null;
