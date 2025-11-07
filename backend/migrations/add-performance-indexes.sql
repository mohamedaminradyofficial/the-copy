-- ============================================
-- Performance Optimization: Database Indexes
-- ============================================
-- This migration adds optimized indexes for common query patterns
-- Run BEFORE: See database-baseline.sql for baseline measurements
-- Run AFTER: Re-run baseline queries to measure improvements
-- ============================================

BEGIN;

-- ============================================
-- Drop indexes if they exist (for idempotency)
-- ============================================

-- Note: Most indexes already exist in schema.ts
-- This script ensures they are created and adds any missing ones

-- ============================================
-- PROJECTS TABLE INDEXES
-- ============================================

-- Single-column indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Composite indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_created ON projects(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_id_user ON projects(id, user_id);

-- Additional useful index: Updated timestamp for cache invalidation
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC);

-- ============================================
-- SCENES TABLE INDEXES
-- ============================================

-- Foreign key index
CREATE INDEX IF NOT EXISTS idx_scenes_project_id ON scenes(project_id);

-- Composite indexes
CREATE INDEX IF NOT EXISTS idx_scenes_project_number ON scenes(project_id, scene_number);
CREATE INDEX IF NOT EXISTS idx_scenes_id_project ON scenes(id, project_id);
CREATE INDEX IF NOT EXISTS idx_scenes_project_status ON scenes(project_id, status);

-- Additional useful index: Scene number for ordering
CREATE INDEX IF NOT EXISTS idx_scenes_scene_number ON scenes(scene_number);

-- ============================================
-- CHARACTERS TABLE INDEXES
-- ============================================

-- Foreign key index
CREATE INDEX IF NOT EXISTS idx_characters_project_id ON characters(project_id);

-- Composite indexes
CREATE INDEX IF NOT EXISTS idx_characters_id_project ON characters(id, project_id);
CREATE INDEX IF NOT EXISTS idx_characters_project_name ON characters(project_id, name);
CREATE INDEX IF NOT EXISTS idx_characters_project_consistency ON characters(project_id, consistency_status);

-- Additional useful indexes
-- Text search on character names (using pg_trgm for fuzzy search)
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX IF NOT EXISTS idx_characters_name_trgm ON characters USING gin(name gin_trgm_ops);

-- Index for sorting by appearances
CREATE INDEX IF NOT EXISTS idx_characters_appearances ON characters(appearances DESC);

-- ============================================
-- SHOTS TABLE INDEXES
-- ============================================

-- Foreign key index
CREATE INDEX IF NOT EXISTS idx_shots_scene_id ON shots(scene_id);

-- Composite indexes
CREATE INDEX IF NOT EXISTS idx_shots_scene_number ON shots(scene_id, shot_number);
CREATE INDEX IF NOT EXISTS idx_shots_id_scene ON shots(id, scene_id);
CREATE INDEX IF NOT EXISTS idx_shots_scene_type ON shots(scene_id, shot_type);

-- Additional useful index: Shot number for ordering
CREATE INDEX IF NOT EXISTS idx_shots_shot_number ON shots(shot_number);

-- ============================================
-- USERS TABLE INDEXES
-- ============================================

-- Email is already UNIQUE which creates an index
-- but ensure it's optimized for case-insensitive search
CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users(LOWER(email));

-- Created at for user registration analytics
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- ============================================
-- SESSIONS TABLE INDEXES
-- ============================================

-- Session expiration index already exists (IDX_session_expire)
-- Ensure it's there for cleanup queries
-- Index is already created in schema.ts

-- ============================================
-- ANALYZE TABLES
-- ============================================
-- Update table statistics after index creation

ANALYZE projects;
ANALYZE scenes;
ANALYZE characters;
ANALYZE shots;
ANALYZE users;
ANALYZE sessions;

COMMIT;

-- ============================================
-- VERIFICATION
-- ============================================

-- Run this to verify all indexes were created:
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('projects', 'scenes', 'characters', 'shots', 'users', 'sessions')
ORDER BY tablename, indexname;

-- ============================================
-- NEXT STEPS
-- ============================================
--
-- 1. Run database-baseline.sql again to measure improvements
-- 2. Compare EXPLAIN ANALYZE results before/after
-- 3. Document improvements in docs/performance/
-- 4. Monitor query performance in production
-- 5. Consider adding pg_trgm extension for fuzzy search if needed
--
-- Expected improvements:
-- - User's projects query: 50-80% faster
-- - Ownership verification joins: 60-90% faster
-- - Filtered queries (status, type): 70-95% faster
-- - Scene/shot ordering: 40-60% faster
--
-- ============================================
