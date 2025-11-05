import 'module-alias/register';
import express, { Application } from 'express';
import type { Server } from 'http';
import cookieParser from 'cookie-parser';
import { env } from '@/config/env';
import { setupMiddleware, errorHandler } from '@/middleware';
import { AnalysisController } from '@/controllers/analysis.controller';
import { authController } from '@/controllers/auth.controller';
import { projectsController } from '@/controllers/projects.controller';
import { scenesController } from '@/controllers/scenes.controller';
import { charactersController } from '@/controllers/characters.controller';
import { shotsController } from '@/controllers/shots.controller';
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

// Directors Studio - Projects endpoints (protected)
app.get('/api/projects', authMiddleware, projectsController.getProjects.bind(projectsController));
app.get('/api/projects/:id', authMiddleware, projectsController.getProject.bind(projectsController));
app.post('/api/projects', authMiddleware, projectsController.createProject.bind(projectsController));
app.put('/api/projects/:id', authMiddleware, projectsController.updateProject.bind(projectsController));
app.delete('/api/projects/:id', authMiddleware, projectsController.deleteProject.bind(projectsController));
app.post('/api/projects/:id/analyze', authMiddleware, projectsController.analyzeScript.bind(projectsController));

// Directors Studio - Scenes endpoints (protected)
app.get('/api/projects/:projectId/scenes', authMiddleware, scenesController.getScenes.bind(scenesController));
app.get('/api/scenes/:id', authMiddleware, scenesController.getScene.bind(scenesController));
app.post('/api/scenes', authMiddleware, scenesController.createScene.bind(scenesController));
app.put('/api/scenes/:id', authMiddleware, scenesController.updateScene.bind(scenesController));
app.delete('/api/scenes/:id', authMiddleware, scenesController.deleteScene.bind(scenesController));

// Directors Studio - Characters endpoints (protected)
app.get('/api/projects/:projectId/characters', authMiddleware, charactersController.getCharacters.bind(charactersController));
app.get('/api/characters/:id', authMiddleware, charactersController.getCharacter.bind(charactersController));
app.post('/api/characters', authMiddleware, charactersController.createCharacter.bind(charactersController));
app.put('/api/characters/:id', authMiddleware, charactersController.updateCharacter.bind(charactersController));
app.delete('/api/characters/:id', authMiddleware, charactersController.deleteCharacter.bind(charactersController));

// Directors Studio - Shots endpoints (protected)
app.get('/api/scenes/:sceneId/shots', authMiddleware, shotsController.getShots.bind(shotsController));
app.get('/api/shots/:id', authMiddleware, shotsController.getShot.bind(shotsController));
app.post('/api/shots', authMiddleware, shotsController.createShot.bind(shotsController));
app.put('/api/shots/:id', authMiddleware, shotsController.updateShot.bind(shotsController));
app.delete('/api/shots/:id', authMiddleware, shotsController.deleteShot.bind(shotsController));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'المسار غير موجود',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

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