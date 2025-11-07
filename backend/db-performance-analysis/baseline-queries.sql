-- ===============================================
-- Database Performance Analysis - Baseline Queries
-- ===============================================
-- This file contains EXPLAIN ANALYZE queries for critical operations
-- Run this before implementing optimizations to establish baseline metrics
-- ===============================================

-- ===============================================
-- 1. PROJECTS QUERIES
-- ===============================================

-- Query 1.1: Get all projects for a user (ordered by updatedAt)
-- Usage: ProjectsController.getProjects
-- Expected frequency: High (every time user visits projects page)
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT * FROM projects
WHERE user_id = 'sample-user-id'
ORDER BY updated_at DESC;

-- Query 1.2: Get single project with user verification
-- Usage: ProjectsController.getProject, updateProject, deleteProject
-- Expected frequency: High (project detail views, updates, deletes)
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT * FROM projects
WHERE id = 'sample-project-id' AND user_id = 'sample-user-id';

-- ===============================================
-- 2. SCENES QUERIES
-- ===============================================

-- Query 2.1: Verify project ownership (used before scenes operations)
-- Usage: ScenesController - all methods
-- Expected frequency: Very High (every scene operation)
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT * FROM projects
WHERE id = 'sample-project-id' AND user_id = 'sample-user-id';

-- Query 2.2: Get all scenes for a project (ordered by scene_number)
-- Usage: ScenesController.getScenes
-- Expected frequency: High (every time user views project scenes)
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT * FROM scenes
WHERE project_id = 'sample-project-id'
ORDER BY scene_number;

-- Query 2.3: Get single scene by ID
-- Usage: ScenesController.getScene
-- Expected frequency: Medium (scene detail views)
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT * FROM scenes
WHERE id = 'sample-scene-id';

-- Query 2.4: Verify scene belongs to user's project (2-step verification)
-- Usage: ScenesController.getScene, updateScene, deleteScene
-- Expected frequency: High
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT s.*, p.user_id
FROM scenes s
INNER JOIN projects p ON s.project_id = p.id
WHERE s.id = 'sample-scene-id' AND p.user_id = 'sample-user-id';

-- ===============================================
-- 3. CHARACTERS QUERIES
-- ===============================================

-- Query 3.1: Get all characters for a project
-- Usage: CharactersController.getCharacters
-- Expected frequency: Medium (character list views)
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT * FROM characters
WHERE project_id = 'sample-project-id';

-- Query 3.2: Get single character by ID
-- Usage: CharactersController.getCharacter
-- Expected frequency: Medium
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT * FROM characters
WHERE id = 'sample-character-id';

-- Query 3.3: Verify character belongs to user's project (2-step verification)
-- Usage: CharactersController - all modification operations
-- Expected frequency: Medium
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT c.*, p.user_id
FROM characters c
INNER JOIN projects p ON c.project_id = p.id
WHERE c.id = 'sample-character-id' AND p.user_id = 'sample-user-id';

-- ===============================================
-- 4. SHOTS QUERIES
-- ===============================================

-- Query 4.1: Get scene by ID (first verification step)
-- Usage: ShotsController - all methods
-- Expected frequency: High
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT * FROM scenes
WHERE id = 'sample-scene-id';

-- Query 4.2: Verify project ownership (second verification step)
-- Usage: ShotsController - all methods
-- Expected frequency: High
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT * FROM projects
WHERE id = 'sample-project-id' AND user_id = 'sample-user-id';

-- Query 4.3: Get all shots for a scene (ordered by shot_number)
-- Usage: ShotsController.getShots
-- Expected frequency: High (shot list views)
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT * FROM shots
WHERE scene_id = 'sample-scene-id'
ORDER BY shot_number;

-- Query 4.4: Get single shot by ID
-- Usage: ShotsController.getShot
-- Expected frequency: Medium
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT * FROM shots
WHERE id = 'sample-shot-id';

-- Query 4.5: Complete shot verification (3-step join - PERFORMANCE CRITICAL!)
-- Usage: ShotsController - all modification operations
-- Expected frequency: High
-- ISSUE: This requires 3 separate queries in current implementation
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT sh.*, s.project_id, p.user_id
FROM shots sh
INNER JOIN scenes s ON sh.scene_id = s.id
INNER JOIN projects p ON s.project_id = p.id
WHERE sh.id = 'sample-shot-id' AND p.user_id = 'sample-user-id';

-- ===============================================
-- 5. USERS QUERIES
-- ===============================================

-- Query 5.1: Get user by email (authentication)
-- Usage: AuthService.login
-- Expected frequency: High (every login)
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT * FROM users
WHERE email = 'user@example.com';

-- Query 5.2: Get user by ID
-- Usage: Authentication middleware
-- Expected frequency: Very High (every authenticated request)
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT * FROM users
WHERE id = 'sample-user-id';

-- ===============================================
-- 6. COMPLEX ANALYTICAL QUERIES
-- ===============================================

-- Query 6.1: Get project with all related data (for project dashboard)
-- Expected frequency: Medium
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT
  p.*,
  COUNT(DISTINCT s.id) as scene_count,
  COUNT(DISTINCT c.id) as character_count,
  COUNT(DISTINCT sh.id) as total_shots
FROM projects p
LEFT JOIN scenes s ON p.id = s.project_id
LEFT JOIN characters c ON p.id = c.project_id
LEFT JOIN shots sh ON s.id = sh.scene_id
WHERE p.id = 'sample-project-id' AND p.user_id = 'sample-user-id'
GROUP BY p.id;

-- Query 6.2: Get all projects with counts (for projects list page)
-- Expected frequency: High
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, COSTS)
SELECT
  p.*,
  COUNT(DISTINCT s.id) as scene_count,
  COUNT(DISTINCT c.id) as character_count
FROM projects p
LEFT JOIN scenes s ON p.id = s.project_id
LEFT JOIN characters c ON p.id = c.project_id
WHERE p.user_id = 'sample-user-id'
GROUP BY p.id
ORDER BY p.updated_at DESC;

-- ===============================================
-- 7. INDEX USAGE ANALYSIS
-- ===============================================

-- Check current indexes
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check index sizes
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;

-- Check index usage statistics
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Find unused indexes
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND idx_scan = 0
  AND indexrelname NOT LIKE '%pkey%';

-- ===============================================
-- 8. TABLE STATISTICS
-- ===============================================

-- Get table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Get row counts and statistics
SELECT
  schemaname,
  tablename,
  n_live_tup as row_count,
  n_dead_tup as dead_rows,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;

-- ===============================================
-- INSTRUCTIONS FOR RUNNING THIS ANALYSIS
-- ===============================================

/*
1. Replace 'sample-user-id', 'sample-project-id', etc. with actual IDs from your database
2. Run each EXPLAIN ANALYZE query separately
3. Record the following metrics for each query:
   - Planning Time
   - Execution Time
   - Total Cost
   - Rows returned
   - Index usage (Sequential Scan vs Index Scan)
   - Buffer usage (shared hits, reads)

4. Document results in baseline-results.md

5. Pay special attention to:
   - Queries with Sequential Scans (should use indexes instead)
   - Queries with high execution time (> 50ms)
   - Queries with high buffer reads (disk I/O)
   - Nested Loop joins that could benefit from better indexes
*/
