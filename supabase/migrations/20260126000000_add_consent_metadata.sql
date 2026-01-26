-- Add consent metadata columns to leads table
-- These columns support Privacy Act 1988 compliance by creating an audit trail
-- of when and how consent was obtained

-- Add consent_timestamp column (when user ticked the checkbox)
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMPTZ;

-- Add consent_ip_address column (for verification purposes)
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS consent_ip_address TEXT;

-- Add comment explaining the purpose
COMMENT ON COLUMN leads.consent_timestamp IS 'Timestamp when user provided consent (ticked checkbox). Used for audit trail and Privacy Act compliance.';
COMMENT ON COLUMN leads.consent_ip_address IS 'IP address of user when consent was given. Used for verification and fraud prevention.';

-- Note: consent_given column already exists as a boolean
-- This migration adds the metadata fields to support the audit trail
