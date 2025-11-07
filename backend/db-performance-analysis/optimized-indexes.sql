-- ===============================================
-- Database Performance Optimization - Proposed Indexes
-- ===============================================
-- This file contains index creation statements for performance optimization
-- ===============================================

-- ===============================================
-- ANALYSIS OF CURRENT INDEXES
-- ===============================================

/*
Current indexes (from schema.ts):

1. sessions table:
   - IDX_session_expire ON (expire)

2. projects table:
   - idx_projects_user_id ON (user_id)
   - idx_projects_created_at ON (created_at)
   - idx_projects_user_created ON (user_id, created_at)

3. scenes table:
   - idx_scenes_project_id ON (project_id)
   - idx_scenes_project_number ON (project_id, scene_number)

4. characters table:
   - idx_characters_project_id ON (project_id)

5. shots table:
   - idx_shots_scene_id ON (scene_id)
   - idx_shots_scene_number ON (scene_id, shot_number)

6. users table:
   - PRIMARY KEY ON (id)
   - UNIQUE ON (email)
*/

-- ===============================================
-- PROPOSED NEW INDEXES
-- ===============================================

-- -----------------------------------------------
-- 1. PROJECTS TABLE - Additional Composite Index
-- -----------------------------------------------
-- Purpose: Optimize ownership verification queries (id + user_id)
-- Used in: getProject, updateProject, deleteProject, and all child entity verifications
-- Impact: HIGH - This query pattern is used very frequently
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_id_user
ON projects(id, user_id);

-- Alternative: Cover index for common SELECT queries
-- This includes the most frequently accessed columns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_user_updated_cover
ON projects(user_id, updated_at DESC)
INCLUDE (id, title, created_at);

-- -----------------------------------------------
-- 2. SCENES TABLE - Composite Index for Verification
-- -----------------------------------------------
-- Purpose: Optimize scene ownership verification via project
-- Used in: All scene operations that need to verify user ownership
-- Impact: MEDIUM-HIGH
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_scenes_id_project
ON scenes(id, project_id);

-- Purpose: Optimize getting scenes with project info
-- Used in: Scene listings and detail views
-- Impact: MEDIUM
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_scenes_project_status
ON scenes(project_id, status);

-- -----------------------------------------------
-- 3. CHARACTERS TABLE - Additional Indexes
-- -----------------------------------------------
-- Purpose: Optimize character ownership verification
-- Used in: All character operations
-- Impact: MEDIUM
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_characters_id_project
ON characters(id, project_id);

-- Purpose: Search characters by name within a project
-- Used in: Potential search features
-- Impact: LOW-MEDIUM
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_characters_project_name
ON characters(project_id, name);

-- Purpose: Filter characters by consistency status
-- Used in: Character quality dashboards
-- Impact: LOW
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_characters_project_consistency
ON characters(project_id, consistency_status);

-- -----------------------------------------------
-- 4. SHOTS TABLE - Additional Composite Index
-- -----------------------------------------------
-- Purpose: Optimize shot ownership verification via scene
-- Used in: All shot operations
-- Impact: MEDIUM-HIGH
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_shots_id_scene
ON shots(id, scene_id);

-- Purpose: Filter shots by type within a scene
-- Used in: Shot type analysis and filtering
-- Impact: LOW-MEDIUM
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_shots_scene_type
ON shots(scene_id, shot_type);

-- -----------------------------------------------
-- 5. USERS TABLE - Additional Indexes
-- -----------------------------------------------
-- Note: email already has UNIQUE constraint which creates an index
-- id is PRIMARY KEY which has an index
-- No additional indexes needed for users table

-- -----------------------------------------------
-- 6. SESSIONS TABLE - Cleanup Index
-- -----------------------------------------------
-- Purpose: Optimize session cleanup queries
-- The existing IDX_session_expire should be sufficient
-- No additional indexes needed

-- ===============================================
-- PARTIAL INDEXES FOR SPECIFIC USE CASES
-- ===============================================

-- Purpose: Optimize queries for active/in-progress scenes
-- Used in: Active scene dashboards
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_scenes_project_active
ON scenes(project_id, scene_number)
WHERE status IN ('in-progress', 'filming');

-- Purpose: Optimize queries for characters with issues
-- Used in: Character quality monitoring
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_characters_needs_attention
ON characters(project_id)
WHERE consistency_status != 'good';

-- ===============================================
-- PERFORMANCE TESTING QUERIES
-- ===============================================
-- Run these after creating indexes to verify improvement

-- Test 1: Project ownership verification (should use idx_projects_id_user)
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM projects
WHERE id = 'sample-project-id' AND user_id = 'sample-user-id';

-- Test 2: Scene with project verification (should use idx_scenes_id_project + idx_projects_id_user)
EXPLAIN (ANALYZE, BUFFERS)
SELECT s.*, p.user_id
FROM scenes s
INNER JOIN projects p ON s.project_id = p.id
WHERE s.id = 'sample-scene-id' AND p.user_id = 'sample-user-id';

-- Test 3: Character with project verification
EXPLAIN (ANALYZE, BUFFERS)
SELECT c.*, p.user_id
FROM characters c
INNER JOIN projects p ON c.project_id = p.id
WHERE c.id = 'sample-character-id' AND p.user_id = 'sample-user-id';

-- Test 4: Shot with full verification chain
EXPLAIN (ANALYZE, BUFFERS)
SELECT sh.*, s.project_id, p.user_id
FROM shots sh
INNER JOIN scenes s ON sh.scene_id = s.id
INNER JOIN projects p ON s.project_id = p.id
WHERE sh.id = 'sample-shot-id' AND p.user_id = 'sample-user-id';

-- Test 5: User's projects with scene count
EXPLAIN (ANALYZE, BUFFERS)
SELECT p.*, COUNT(s.id) as scene_count
FROM projects p
LEFT JOIN scenes s ON p.id = s.project_id
WHERE p.user_id = 'sample-user-id'
GROUP BY p.id
ORDER BY p.updated_at DESC;

-- ===============================================
-- INDEX MAINTENANCE
-- ===============================================

-- Monitor index bloat
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;

-- Reindex if needed (during maintenance window)
-- REINDEX INDEX CONCURRENTLY idx_projects_id_user;
-- REINDEX INDEX CONCURRENTLY idx_scenes_id_project;
-- REINDEX INDEX CONCURRENTLY idx_characters_id_project;
-- REINDEX INDEX CONCURRENTLY idx_shots_id_scene;

-- ===============================================
-- ROLLBACK PLAN
-- ===============================================
-- If indexes cause issues, drop them in reverse order

/*
-- Drop new indexes
DROP INDEX CONCURRENTLY IF EXISTS idx_characters_needs_attention;
DROP INDEX CONCURRENTLY IF EXISTS idx_scenes_project_active;
DROP INDEX CONCURRENTLY IF EXISTS idx_shots_scene_type;
DROP INDEX CONCURRENTLY IF EXISTS idx_shots_id_scene;
DROP INDEX CONCURRENTLY IF EXISTS idx_characters_project_consistency;
DROP INDEX CONCURRENTLY IF EXISTS idx_characters_project_name;
DROP INDEX CONCURRENTLY IF EXISTS idx_characters_id_project;
DROP INDEX CONCURRENTLY IF EXISTS idx_scenes_project_status;
DROP INDEX CONCURRENTLY IF EXISTS idx_scenes_id_project;
DROP INDEX CONCURRENTLY IF EXISTS idx_projects_user_updated_cover;
DROP INDEX CONCURRENTLY IF EXISTS idx_projects_id_user;
*/

-- ===============================================
-- EXPECTED IMPROVEMENTS
-- ===============================================

/*
1. Project ownership verification:
   - Before: Sequential scan or index scan on user_id only
   - After: Direct index lookup on (id, user_id) - Expected 50-80% faster

2. Scene operations with ownership check:
   - Before: 2 separate queries or nested loop join
   - After: Efficient index-based join - Expected 40-60% faster

3. Character operations with ownership check:
   - Before: 2 separate queries
   - After: Efficient index-based join - Expected 40-60% faster

4. Shot operations with ownership check:
   - Before: 3 separate queries
   - After: Efficient multi-table index join - Expected 60-80% faster

5. Project list with counts:
   - Before: Sequential scans with aggregations
   - After: Index-only scans with covering index - Expected 30-50% faster

Overall expected improvement: 40-70% reduction in query execution time for critical paths
*/
