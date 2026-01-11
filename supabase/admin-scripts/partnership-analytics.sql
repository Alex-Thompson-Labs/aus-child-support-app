-- =============================================================================
-- Partnership Proposal Admin Scripts
-- Run these in Supabase SQL Editor with authenticated session
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. INSERT TEST FIRM: "Sage Family Lawyers"
-- -----------------------------------------------------------------------------
-- Generates a random 8-character slug using PostgreSQL

INSERT INTO partnership_proposals (firm_name, slug, is_active)
VALUES (
  'Sage Family Lawyers',
  lower(substr(md5(random()::text), 1, 8)),  -- Random 8-char slug
  true
)
RETURNING id, firm_name, slug, created_at;

-- Alternative: Use a specific slug for testing
-- INSERT INTO partnership_proposals (firm_name, slug, is_active)
-- VALUES ('Sage Family Lawyers', 'sage2024', true)
-- RETURNING id, firm_name, slug, created_at;


-- -----------------------------------------------------------------------------
-- 2. VIEW TOTAL TIME ANALYTICS
-- Query to show "Firm Name | Total Time Viewed (minutes)"
-- -----------------------------------------------------------------------------
-- Calculates view duration as: last_heartbeat_at - viewed_at
-- Aggregates total viewing time across all view sessions per firm

SELECT
  pp.firm_name AS "Firm Name",
  pp.slug AS "Access Code",
  COUNT(pv.id) AS "Total Views",
  COALESCE(
    ROUND(
      SUM(
        EXTRACT(EPOCH FROM (pv.last_heartbeat_at - pv.viewed_at))
      ) / 60.0,
      1
    ),
    0
  ) AS "Total Time Viewed (minutes)",
  COALESCE(
    ROUND(
      AVG(
        EXTRACT(EPOCH FROM (pv.last_heartbeat_at - pv.viewed_at))
      ) / 60.0,
      1
    ),
    0
  ) AS "Avg Session (minutes)",
  pp.is_active AS "Active",
  pp.created_at AS "Created"
FROM partnership_proposals pp
LEFT JOIN proposal_views pv ON pp.id = pv.proposal_id
GROUP BY pp.id, pp.firm_name, pp.slug, pp.is_active, pp.created_at
ORDER BY "Total Time Viewed (minutes)" DESC;


-- -----------------------------------------------------------------------------
-- 3. DETAILED VIEW SESSIONS
-- Shows individual view sessions for debugging/analysis
-- -----------------------------------------------------------------------------

SELECT
  pp.firm_name AS "Firm",
  pv.viewed_at AS "Session Start",
  pv.last_heartbeat_at AS "Last Activity",
  ROUND(
    EXTRACT(EPOCH FROM (pv.last_heartbeat_at - pv.viewed_at)) / 60.0,
    1
  ) AS "Duration (min)",
  pv.device_info AS "Device"
FROM proposal_views pv
JOIN partnership_proposals pp ON pp.id = pv.proposal_id
ORDER BY pv.viewed_at DESC
LIMIT 50;


-- -----------------------------------------------------------------------------
-- 4. ACTIVE SESSIONS (Last 5 minutes)
-- Find currently viewing users
-- -----------------------------------------------------------------------------

SELECT
  pp.firm_name AS "Firm",
  pv.device_info AS "Device",
  pv.viewed_at AS "Session Start",
  ROUND(
    EXTRACT(EPOCH FROM (now() - pv.viewed_at)) / 60.0,
    1
  ) AS "Viewing For (min)"
FROM proposal_views pv
JOIN partnership_proposals pp ON pp.id = pv.proposal_id
WHERE pv.last_heartbeat_at > now() - interval '5 minutes'
ORDER BY pv.viewed_at DESC;


-- -----------------------------------------------------------------------------
-- 5. DEACTIVATE A PROPOSAL
-- Use this to disable access to a proposal
-- -----------------------------------------------------------------------------

-- UPDATE partnership_proposals
-- SET is_active = false
-- WHERE slug = 'your-slug-here';


-- -----------------------------------------------------------------------------
-- 6. DELETE OLD VIEW RECORDS (Cleanup)
-- Remove view records older than 90 days
-- -----------------------------------------------------------------------------

-- DELETE FROM proposal_views
-- WHERE viewed_at < now() - interval '90 days';


-- -----------------------------------------------------------------------------
-- 7. LIST ALL PROPOSALS
-- Quick overview of all proposals
-- -----------------------------------------------------------------------------

SELECT
  firm_name,
  slug,
  is_active,
  created_at,
  (SELECT COUNT(*) FROM proposal_views WHERE proposal_id = pp.id) AS view_count
FROM partnership_proposals pp
ORDER BY created_at DESC;
