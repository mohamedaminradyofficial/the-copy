import { Request, Response } from 'express';
import { db } from '../db';
import { shots, scenes, projects } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { logger } from '../utils/logger';
import { z } from 'zod';
import type { AuthRequest } from '../middleware/auth.middleware';

const createShotSchema = z.object({
  sceneId: z.string().min(1, 'معرف المشهد مطلوب'),
  shotNumber: z.number().int().positive('رقم اللقطة يجب أن يكون موجباً'),
  shotType: z.string().min(1, 'نوع اللقطة مطلوب'),
  cameraAngle: z.string().min(1, 'زاوية الكاميرا مطلوبة'),
  cameraMovement: z.string().min(1, 'حركة الكاميرا مطلوبة'),
  lighting: z.string().min(1, 'الإضاءة مطلوبة'),
  aiSuggestion: z.string().optional(),
});

const updateShotSchema = z.object({
  shotNumber: z.number().int().positive().optional(),
  shotType: z.string().min(1).optional(),
  cameraAngle: z.string().min(1).optional(),
  cameraMovement: z.string().min(1).optional(),
  lighting: z.string().min(1).optional(),
  aiSuggestion: z.string().optional(),
});

export class ShotsController {
  // Get all shots for a scene
  async getShots(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'غير مصرح',
        });
        return;
      }

      const { sceneId } = req.params;

      if (!sceneId) {
        res.status(400).json({
          success: false,
          error: 'معرف المشهد مطلوب',
        });
        return;
      }

      // Verify scene exists and belongs to user's project
      const [scene] = await db
        .select()
        .from(scenes)
        .where(eq(scenes.id, sceneId));

      if (!scene) {
        res.status(404).json({
          success: false,
          error: 'المشهد غير موجود',
        });
        return;
      }

      const [project] = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, scene.projectId), eq(projects.userId, req.user.id)));

      if (!project) {
        res.status(403).json({
          success: false,
          error: 'غير مصرح للوصول لهذا المشهد',
        });
        return;
      }

      const sceneShots = await db
        .select()
        .from(shots)
        .where(eq(shots.sceneId, sceneId))
        .orderBy(shots.shotNumber);

      res.json({
        success: true,
        data: sceneShots,
      });
    } catch (error) {
      logger.error('Get shots error:', error);
      res.status(500).json({
        success: false,
        error: 'حدث خطأ أثناء جلب اللقطات',
      });
    }
  }

  // Get a single shot by ID
  async getShot(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'غير مصرح',
        });
        return;
      }

      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'معرف اللقطة مطلوب',
        });
        return;
      }

      const [shot] = await db
        .select()
        .from(shots)
        .where(eq(shots.id, id));

      if (!shot) {
        res.status(404).json({
          success: false,
          error: 'اللقطة غير موجودة',
        });
        return;
      }

      // Verify belongs to user's project
      const [scene] = await db
        .select()
        .from(scenes)
        .where(eq(scenes.id, shot.sceneId));

      if (!scene) {
        res.status(404).json({
          success: false,
          error: 'المشهد غير موجود',
        });
        return;
      }

      const [project] = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, scene.projectId), eq(projects.userId, req.user.id)));

      if (!project) {
        res.status(403).json({
          success: false,
          error: 'غير مصرح للوصول لهذه اللقطة',
        });
        return;
      }

      res.json({
        success: true,
        data: shot,
      });
    } catch (error) {
      logger.error('Get shot error:', error);
      res.status(500).json({
        success: false,
        error: 'حدث خطأ أثناء جلب اللقطة',
      });
    }
  }

  // Create a new shot
  async createShot(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'غير مصرح',
        });
        return;
      }

      const validatedData = createShotSchema.parse(req.body);

      // Verify scene exists and belongs to user's project
      const [scene] = await db
        .select()
        .from(scenes)
        .where(eq(scenes.id, validatedData.sceneId));

      if (!scene) {
        res.status(404).json({
          success: false,
          error: 'المشهد غير موجود',
        });
        return;
      }

      const [project] = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, scene.projectId), eq(projects.userId, req.user.id)));

      if (!project) {
        res.status(403).json({
          success: false,
          error: 'غير مصرح لإنشاء لقطة في هذا المشهد',
        });
        return;
      }

      const [newShot] = await db
        .insert(shots)
        .values(validatedData)
        .returning();

      if (!newShot) {
        res.status(500).json({
          success: false,
          error: 'فشل إنشاء اللقطة',
        });
        return;
      }

      // Update shot count in scene
      await db
        .update(scenes)
        .set({ shotCount: scene.shotCount + 1 })
        .where(eq(scenes.id, validatedData.sceneId));

      res.status(201).json({
        success: true,
        message: 'تم إنشاء اللقطة بنجاح',
        data: newShot,
      });

      logger.info('Shot created successfully', { shotId: newShot.id, sceneId: validatedData.sceneId });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'بيانات غير صالحة',
          details: error.errors,
        });
        return;
      }

      logger.error('Create shot error:', error);
      res.status(500).json({
        success: false,
        error: 'حدث خطأ أثناء إنشاء اللقطة',
      });
    }
  }

  // Update a shot
  async updateShot(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'غير مصرح',
        });
        return;
      }

      const { id } = req.params;
      const validatedData = updateShotSchema.parse(req.body);

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'معرف اللقطة مطلوب',
        });
        return;
      }

      // Check if shot exists
      const [existingShot] = await db
        .select()
        .from(shots)
        .where(eq(shots.id, id));

      if (!existingShot) {
        res.status(404).json({
          success: false,
          error: 'اللقطة غير موجودة',
        });
        return;
      }

      // Verify belongs to user's project
      const [scene] = await db
        .select()
        .from(scenes)
        .where(eq(scenes.id, existingShot.sceneId));

      if (!scene) {
        res.status(404).json({
          success: false,
          error: 'المشهد غير موجود',
        });
        return;
      }

      const [project] = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, scene.projectId), eq(projects.userId, req.user.id)));

      if (!project) {
        res.status(403).json({
          success: false,
          error: 'غير مصرح لتعديل هذه اللقطة',
        });
        return;
      }

      const [updatedShot] = await db
        .update(shots)
        .set(validatedData)
        .where(eq(shots.id, id))
        .returning();

      res.json({
        success: true,
        message: 'تم تحديث اللقطة بنجاح',
        data: updatedShot,
      });

      logger.info('Shot updated successfully', { shotId: id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: 'بيانات غير صالحة',
          details: error.errors,
        });
        return;
      }

      logger.error('Update shot error:', error);
      res.status(500).json({
        success: false,
        error: 'حدث خطأ أثناء تحديث اللقطة',
      });
    }
  }

  // Delete a shot
  async deleteShot(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'غير مصرح',
        });
        return;
      }

      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'معرف اللقطة مطلوب',
        });
        return;
      }

      // Check if shot exists
      const [existingShot] = await db
        .select()
        .from(shots)
        .where(eq(shots.id, id));

      if (!existingShot) {
        res.status(404).json({
          success: false,
          error: 'اللقطة غير موجودة',
        });
        return;
      }

      // Verify belongs to user's project
      const [scene] = await db
        .select()
        .from(scenes)
        .where(eq(scenes.id, existingShot.sceneId));

      if (!scene) {
        res.status(404).json({
          success: false,
          error: 'المشهد غير موجود',
        });
        return;
      }

      const [project] = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, scene.projectId), eq(projects.userId, req.user.id)));

      if (!project) {
        res.status(403).json({
          success: false,
          error: 'غير مصرح لحذف هذه اللقطة',
        });
        return;
      }

      await db.delete(shots).where(eq(shots.id, id));

      // Update shot count in scene
      await db
        .update(scenes)
        .set({ shotCount: Math.max(0, scene.shotCount - 1) })
        .where(eq(scenes.id, existingShot.sceneId));

      res.json({
        success: true,
        message: 'تم حذف اللقطة بنجاح',
      });

      logger.info('Shot deleted successfully', { shotId: id });
    } catch (error) {
      logger.error('Delete shot error:', error);
      res.status(500).json({
        success: false,
        error: 'حدث خطأ أثناء حذف اللقطة',
      });
    }
  }
}

export const shotsController = new ShotsController();
