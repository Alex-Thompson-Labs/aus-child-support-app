-- Add enrichment columns to leads table
-- These store additional data collected after initial lead submission

-- Add enrichment_annual_liability column (stores calculated liability from enrichment estimator)
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS enrichment_annual_liability NUMERIC;

-- Add enrichment_payer_role column (stores who pays from enrichment estimator)
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS enrichment_payer_role TEXT CHECK (enrichment_payer_role IN ('you', 'other_parent'));

-- Add comments for documentation
COMMENT ON COLUMN leads.enrichment_annual_liability IS 'Annual child support liability calculated during enrichment flow (post-submission)';
COMMENT ON COLUMN leads.enrichment_payer_role IS 'Who pays child support: you (parent submitting) or other_parent (calculated during enrichment flow)';
