-- Lead Scoring System Database Migration
-- Adds columns to track lead priority scores

-- Add lead scoring columns to leads table
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS lead_score INTEGER,
ADD COLUMN IF NOT EXISTS score_category TEXT,
ADD COLUMN IF NOT EXISTS scoring_factors TEXT[];

-- Add comment to document the scoring categories
COMMENT ON COLUMN leads.score_category IS 'Lead priority category: Premium (10+), High-Value (7-9), Standard (4-6), Low-Value (2-3), or Unscored';

-- Add comment to document scoring factors
COMMENT ON COLUMN leads.scoring_factors IS 'Array of factor IDs that contributed to the score (e.g., court_date_urgent, high_value_case)';

-- Optional: Create index for querying by score (for future lead distribution features)
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(lead_score DESC);
