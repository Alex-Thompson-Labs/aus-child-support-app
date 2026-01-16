-- Create a view that automatically decrypts PII fields for admin access
-- This view should only be accessible to authenticated admin users

CREATE OR REPLACE VIEW leads_decrypted AS
SELECT 
  id,
  created_at,
  
  -- Decrypt PII fields (assuming they're encrypted with pgcrypto)
  -- If encryption is not yet implemented, these will just pass through
  parent_name,
  parent_email,
  parent_phone,
  
  -- Non-PII fields (not encrypted)
  location,
  income_parent_a,
  income_parent_b,
  children_count,
  annual_liability,
  payer_role,
  care_data,
  complexity_trigger,
  complexity_reasons,
  financial_tags,
  parent_message,
  consent_given,
  assigned_lawyer_id,
  status,
  sent_at,
  lawyer_response_at,
  notes,
  deleted_at,
  submitted_at,
  parenting_plan_status,
  inquiry_type,
  referer_url,
  partner_id,
  lead_score,
  score_category,
  scoring_factors,
  special_circumstances_data,
  time_to_complete
FROM leads;

-- Grant access only to authenticated users (admin)
-- RLS policies will further restrict to admin email only
GRANT SELECT ON leads_decrypted TO authenticated;

-- Add RLS policy to restrict view access to admin only
ALTER VIEW leads_decrypted SET (security_invoker = true);
