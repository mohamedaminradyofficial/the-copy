import 'module-alias/register';
import express, { Application } from 'express';
import type { Server } from 'http';
import cookieParser from 'cookie-parser';
import { env } from '@/config/env';
import { setupMiddleware } from '@/middleware';
import { AnalysisController } from '@/controllers/analysis.controller';
import { authController } from '@/controllers/auth.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { logger } from '@/utils/logger';

const app: Application = express();
const analysisController = new AnalysisController();

// Setup middleware
setupMiddleware(app);
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// Auth endpoints (public)
app.post('/api/auth/signup', authController.signup.bind(authController));
app.post('/api/auth/login', authController.login.bind(authController));
app.post('/api/auth/logout', authController.logout.bind(authController));
app.get('/api/auth/me', authMiddleware, authController.getCurrentUser.bind(authController));

// Seven Stations Pipeline endpoints (protected)
app.post('/api/analysis/seven-stations', authMiddleware, analysisController.runSevenStationsPipeline.bind(analysisController));
app.get('/api/analysis/stations-info', analysisController.getStationDetails.bind(analysisController));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'المسار غير موجود',
  });
});

// Start server with automatic port fallback if the selected port is in use
let runningServer: Server | null = null;
const startPort = Number(process.env.PORT) || env.PORT;

function startListening(port: number): void {
  const server = app.listen(port, () => {
    runningServer = server;
    logger.info(`Server running on port ${port}`, {
      environment: env.NODE_ENV,
      port,
    });
  });

  server.on('error', (error: any) => {
    if (error && error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      logger.warn(`Port ${port} is in use. Trying ${nextPort}...`);
      startListening(nextPort);
      return;
    }
    throw error;
  });
}

startListening(startPort);

// Graceful shutdown
process.on('SIGTERM', async (): Promise<void> => {
  logger.info('SIGTERM received, shutting down gracefully');
  if (runningServer) {
    runningServer.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on('SIGINT', async (): Promise<void> => {
  logger.info('SIGINT received, shutting down gracefully');
  if (runningServer) {
    runningServer.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

export default app;