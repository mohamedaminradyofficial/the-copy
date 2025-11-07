import { pgTable, text, timestamp, varchar, index, jsonb, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Session storage table for Express sessions
export const sessions = pgTable(
  'sessions',
  {
    sid: varchar('sid').primaryKey(),
    sess: jsonb('sess').notNull(),
    expire: timestamp('expire').notNull(),
  },
  (table) => [index('IDX_session_expire').on(table.expire)]
);

// Users table for authentication
export const users = pgTable('users', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  profileImageUrl: varchar('profile_image_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Directors Studio - Projects table
export const projects = pgTable(
  'projects',
  {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    title: text('title').notNull(),
    scriptContent: text('script_content'),
    userId: varchar('user_id').references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    // Index for fetching user's projects
    index('idx_projects_user_id').on(table.userId),
    // Index for ordering by creation date
    index('idx_projects_created_at').on(table.createdAt),
    // Composite index for user's projects ordered by date (most common query)
    index('idx_projects_user_created').on(table.userId, table.createdAt),
  ]
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

// Directors Studio - Scenes table
export const scenes = pgTable(
  'scenes',
  {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    projectId: varchar('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    sceneNumber: integer('scene_number').notNull(),
    title: text('title').notNull(),
    location: text('location').notNull(),
    timeOfDay: text('time_of_day').notNull(),
    characters: jsonb('characters').notNull().$type<string[]>(),
    description: text('description'),
    shotCount: integer('shot_count').notNull().default(0),
    status: text('status').notNull().default('planned'),
  },
  (table) => [
    // Index for fetching project's scenes
    index('idx_scenes_project_id').on(table.projectId),
    // Composite index for project's scenes ordered by scene number
    index('idx_scenes_project_number').on(table.projectId, table.sceneNumber),
  ]
);

export type Scene = typeof scenes.$inferSelect;
export type NewScene = typeof scenes.$inferInsert;

// Directors Studio - Characters table
export const characters = pgTable(
  'characters',
  {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    projectId: varchar('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    appearances: integer('appearances').notNull().default(0),
    consistencyStatus: text('consistency_status').notNull().default('good'),
    lastSeen: text('last_seen'),
    notes: text('notes'),
  },
  (table) => [
    // Index for fetching project's characters
    index('idx_characters_project_id').on(table.projectId),
  ]
);

export type Character = typeof characters.$inferSelect;
export type NewCharacter = typeof characters.$inferInsert;

// Directors Studio - Shots table
export const shots = pgTable(
  'shots',
  {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    sceneId: varchar('scene_id').notNull().references(() => scenes.id, { onDelete: 'cascade' }),
    shotNumber: integer('shot_number').notNull(),
    shotType: text('shot_type').notNull(),
    cameraAngle: text('camera_angle').notNull(),
    cameraMovement: text('camera_movement').notNull(),
    lighting: text('lighting').notNull(),
    aiSuggestion: text('ai_suggestion'),
  },
  (table) => [
    // Index for fetching scene's shots
    index('idx_shots_scene_id').on(table.sceneId),
    // Composite index for scene's shots ordered by shot number
    index('idx_shots_scene_number').on(table.sceneId, table.shotNumber),
  ]
);

export type Shot = typeof shots.$inferSelect;
export type NewShot = typeof shots.$inferInsert;
