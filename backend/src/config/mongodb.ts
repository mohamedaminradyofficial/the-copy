/**
 * MongoDB Configuration
 * 
 * MongoDB connection setup for The Copy application
 */

import { MongoClient, ServerApiVersion, Db } from 'mongodb';
import { logger } from '@/utils/logger';

const uri = process.env.MONGODB_URI || "mongodb+srv://adamasemabdelfattahmohamed_db_user:6tMLYoDWekVxcYgU@thecopy.ki81fip.mongodb.net/?appName=thecopy";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db: Db | null = null;

/**
 * Connect to MongoDB
 */
export async function connectMongoDB(): Promise<Db> {
  try {
    if (!db) {
      await client.connect();
      db = client.db("thecopy");
      
      // Test connection
      await client.db("admin").command({ ping: 1 });
      logger.info("[MongoDB] Successfully connected to MongoDB!");
    }
    
    return db;
  } catch (error) {
    logger.error("[MongoDB] Connection failed:", error);
    throw error;
  }
}

/**
 * Get MongoDB database instance
 */
export function getMongoDB(): Db {
  if (!db) {
    throw new Error("MongoDB not connected. Call connectMongoDB() first.");
  }
  return db;
}

/**
 * Close MongoDB connection
 */
export async function closeMongoDB(): Promise<void> {
  try {
    if (client) {
      await client.close();
      db = null;
      logger.info("[MongoDB] Connection closed");
    }
  } catch (error) {
    logger.error("[MongoDB] Error closing connection:", error);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeMongoDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeMongoDB();
  process.exit(0);
});