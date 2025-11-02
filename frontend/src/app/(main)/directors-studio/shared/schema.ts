import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// @ts-ignore - Type compatibility issue with drizzle-zod pick()
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = {
  username: string;
  password: string;
};
export type User = typeof users.$inferSelect;

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  scriptContent: text("script_content"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// @ts-ignore - Type compatibility issue with drizzle-zod
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// @ts-ignore
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export const scenes = pgTable("scenes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  sceneNumber: integer("scene_number").notNull(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  timeOfDay: text("time_of_day").notNull(),
  characters: text("characters").array().notNull(),
  description: text("description"),
  shotCount: integer("shot_count").notNull().default(0),
  status: text("status").notNull().default("planned"),
});

// @ts-ignore - Type compatibility issue with drizzle-zod
export const insertSceneSchema = createInsertSchema(scenes).omit({
  id: true,
});

// @ts-ignore
export type InsertScene = z.infer<typeof insertSceneSchema>;
export type Scene = typeof scenes.$inferSelect;

export const characters = pgTable("characters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  appearances: integer("appearances").notNull().default(0),
  consistencyStatus: text("consistency_status").notNull().default("good"),
  lastSeen: text("last_seen"),
  notes: text("notes"),
});

// @ts-ignore - Type compatibility issue with drizzle-zod
export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
});

// @ts-ignore
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof characters.$inferSelect;

export const shots = pgTable("shots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sceneId: varchar("scene_id").notNull().references(() => scenes.id, { onDelete: "cascade" }),
  shotNumber: integer("shot_number").notNull(),
  shotType: text("shot_type").notNull(),
  cameraAngle: text("camera_angle").notNull(),
  cameraMovement: text("camera_movement").notNull(),
  lighting: text("lighting").notNull(),
  aiSuggestion: text("ai_suggestion"),
});

// @ts-ignore - Type compatibility issue with drizzle-zod
export const insertShotSchema = createInsertSchema(shots).omit({
  id: true,
});

// @ts-ignore
export type InsertShot = z.infer<typeof insertShotSchema>;
export type Shot = typeof shots.$inferSelect;
