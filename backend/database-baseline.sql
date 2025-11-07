-- ============================================
-- Database Performance Baseline Measurements
-- ============================================
-- Run these queries BEFORE and AFTER adding indexes
-- to measure performance improvements
--
-- Usage: psql $DATABASE_URL < database-baseline.sql
-- Or run each query individually in your database client
-- ============================================

-- ============================================
-- CRITICAL QUERIES FOR BASELINE MEASUREMENT
-- ============================================

-- Query 1: Get user's projects (most common query)
-- Expected usage: Dashboard, project listing
EXPLAIN ANALYZE
SELECT * FROM projects
WHERE user_id = 'sample-user-id'
ORDER BY created_at DESC
LIMIT 20;

-- Query 2: Get project with ownership verification
-- Expected usage: Project detail pages, API endpoints
EXPLAIN ANALYZE
SELECT * FROM projects
WHERE id = 'sample-project-id'
AND user_id = 'sample-user-id';

-- Query 3: Get all scenes for a project
-- Expected usage: Scene management, project overview
EXPLAIN ANALYZE
SELECT * FROM scenes
WHERE project_id = 'sample-project-id'
ORDER BY scene_number ASC;

-- Query 4: Get scenes by status within project
-- Expected usage: Filtering scenes by production status
EXPLAIN ANALYZE
SELECT * FROM scenes
WHERE project_id = 'sample-project-id'
AND status = 'in_progress'
ORDER BY scene_number ASC;

-- Query 5: Get scene with ownership verification via project
-- Expected usage: Scene detail pages with security check
EXPLAIN ANALYZE
SELECT s.*, p.user_id
FROM scenes s
JOIN projects p ON s.project_id = p.id
WHERE s.id = 'sample-scene-id'
AND p.user_id = 'sample-user-id';

-- Query 6: Get characters for a project
-- Expected usage: Character management panel
EXPLAIN ANALYZE
SELECT * FROM characters
WHERE project_id = 'sample-project-id'
ORDER BY name ASC;

-- Query 7: Search characters by name within project
-- Expected usage: Character search/autocomplete
EXPLAIN ANALYZE
SELECT * FROM characters
WHERE project_id = 'sample-project-id'
AND name ILIKE '%character-name%';

-- Query 8: Filter characters by consistency status
-- Expected usage: Finding characters needing attention
EXPLAIN ANALYZE
SELECT * FROM characters
WHERE project_id = 'sample-project-id'
AND consistency_status = 'warning'
ORDER BY appearances DESC;

-- Query 9: Get character with ownership verification
-- Expected usage: Character detail pages with security
EXPLAIN ANALYZE
SELECT c.*, p.user_id
FROM characters c
JOIN projects p ON c.project_id = p.id
WHERE c.id = 'sample-character-id'
AND p.user_id = 'sample-user-id';

-- Query 10: Get shots for a scene
-- Expected usage: Shot breakdown, scene detail
EXPLAIN ANALYZE
SELECT * FROM shots
WHERE scene_id = 'sample-scene-id'
ORDER BY shot_number ASC;

-- Query 11: Filter shots by type within scene
-- Expected usage: Finding specific shot types
EXPLAIN ANALYZE
SELECT * FROM shots
WHERE scene_id = 'sample-scene-id'
AND shot_type = 'closeup';

-- Query 12: Get shot with ownership verification (3-table join)
-- Expected usage: Shot detail pages with full security chain
EXPLAIN ANALYZE
SELECT sh.*, s.project_id, p.user_id
FROM shots sh
JOIN scenes s ON sh.scene_id = s.id
JOIN projects p ON s.project_id = p.id
WHERE sh.id = 'sample-shot-id'
AND p.user_id = 'sample-user-id';

-- Query 13: Get project summary with counts
-- Expected usage: Project dashboard, statistics
EXPLAIN ANALYZE
SELECT
  p.*,
  COUNT(DISTINCT s.id) as scene_count,
  COUNT(DISTINCT c.id) as character_count,
  COUNT(DISTINCT sh.id) as shot_count
FROM projects p
LEFT JOIN scenes s ON p.id = s.project_id
LEFT JOIN characters c ON p.id = c.project_id
LEFT JOIN shots sh ON s.id = sh.scene_id
WHERE p.id = 'sample-project-id'
AND p.user_id = 'sample-user-id'
GROUP BY p.id;

-- ============================================
-- CURRENT INDEX STATUS
-- ============================================

-- List all existing indexes
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('projects', 'scenes', 'characters', 'shots', 'users')
ORDER BY tablename, indexname;

-- ============================================
-- TABLE STATISTICS
-- ============================================

-- Get table sizes and row counts
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS indexes_size,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = schemaname AND table_name = tablename) AS column_count
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('projects', 'scenes', 'characters', 'shots', 'users')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Get row counts
SELECT
  'projects' as table_name,
  COUNT(*) as row_count
FROM projects
UNION ALL
SELECT
  'scenes' as table_name,
  COUNT(*) as row_count
FROM scenes
UNION ALL
SELECT
  'characters' as table_name,
  COUNT(*) as row_count
FROM characters
UNION ALL
SELECT
  'shots' as table_name,
  COUNT(*) as row_count
FROM shots
UNION ALL
SELECT
  'users' as table_name,
  COUNT(*) as row_count
FROM users;

-- ============================================
-- INSTRUCTIONS
-- ============================================
--
-- 1. Replace all 'sample-*-id' placeholders with real IDs from your database
-- 2. Run these queries BEFORE adding new indexes (baseline)
-- 3. Save the EXPLAIN ANALYZE output
-- 4. Add the new indexes from the migration script
-- 5. Run these queries AGAIN (comparison)
-- 6. Compare execution times and query plans
-- 7. Document improvements in docs/performance/baseline-results.md
--
-- Expected improvements:
-- - Reduced execution time (50-90% faster)
-- - Index scans instead of sequential scans
-- - Lower cost estimates in query plans
-- - Better join performance
--
-- ============================================
