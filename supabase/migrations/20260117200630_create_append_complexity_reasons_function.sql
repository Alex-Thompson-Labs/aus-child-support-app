-- Create function to append complexity reasons and update enrichment fields
-- This allows anon users to update leads without needing SELECT permission
-- Used by the enrichment flow after initial lead submission

CREATE OR REPLACE FUNCTION append_complexity_reasons(
    lead_id UUID,
    new_reasons TEXT[],
    annual_liability NUMERIC DEFAULT NULL,
    payer_role TEXT DEFAULT NULL,
    other_parent_country TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update the lead with enrichment data
    -- Concatenate new reasons to existing complexity_reasons array
    -- Update enrichment_annual_liability and enrichment_payer_role if provided
    UPDATE leads
    SET 
        complexity_reasons = COALESCE(complexity_reasons, ARRAY[]::TEXT[]) || new_reasons,
        enrichment_annual_liability = COALESCE(annual_liability, enrichment_annual_liability),
        enrichment_payer_role = COALESCE(payer_role, enrichment_payer_role),
        special_circumstances_data = CASE
            WHEN other_parent_country IS NOT NULL THEN
                COALESCE(special_circumstances_data, '{}'::JSONB) || 
                jsonb_build_object('other_parent_country', other_parent_country)
            ELSE
                special_circumstances_data
        END
    WHERE id = lead_id;
END;
$$;

-- Grant execute permission to anon users (for enrichment flow)
GRANT EXECUTE ON FUNCTION append_complexity_reasons(UUID, TEXT[], NUMERIC, TEXT, TEXT) TO anon;

-- Grant execute permission to authenticated users (for admin updates)
GRANT EXECUTE ON FUNCTION append_complexity_reasons(UUID, TEXT[], NUMERIC, TEXT, TEXT) TO authenticated;
