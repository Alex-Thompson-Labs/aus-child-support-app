import { getSupabaseClient } from './client';

// Type definitions for database tables
export interface LeadSubmission {
    id?: string;
    created_at?: string;

    // Parent contact
    parent_name: string;
    parent_email: string;
    parent_phone: string | null;
    location: string | null;

    // Calculation data
    income_parent_a: number;
    income_parent_b: number;
    children_count: number;
    annual_liability: number;
    payer_role?: 'you' | 'other_parent' | null;

    // Care arrangement data
    care_data:
    | {
        index: number;
        careA: number;
        careB: number;
    }[]
    | null;

    // Complexity data
    complexity_trigger: string[] | null;
    complexity_reasons: string[];
    financial_tags?: string[] | null;

    // Message (required - database has NOT NULL constraint)
    parent_message: string;

    // Privacy compliance
    consent_given: boolean;

    // Lead management (set by admin)
    assigned_lawyer_id?: string | null;
    status?: 'new' | 'reviewing' | 'sent' | 'converted' | 'lost';
    sent_at?: string | null;
    lawyer_response_at?: string | null;
    notes?: string | null;
    deleted_at?: string | null;

    // Metadata
    submitted_at?: string;

    // Chatbot lead qualification data
    parenting_plan_status?: string | null;
    inquiry_type?: string | null;
    referer_url?: string | null;

    // Lead scoring data (calculated client-side)
    lead_score?: number;
    score_category?: string;
    scoring_factors?: string[];

    // Special circumstances additional data (JSONB-compatible)
    // Used for PSI and international jurisdiction fields
    special_circumstances_data?: {
        // PSI fields
        separation_date?: string; // ISO date string (sensitive - privacy)
        cohabited_6_months?: boolean;

        // International fields
        other_parent_country?: string;
    } | null;
}

/**
 * Submit a new lead to the database
 *
 * @param lead - Lead submission data
 * @returns Success status and lead ID or error
 */
export async function submitLead(lead: LeadSubmission): Promise<{
    success: boolean;
    leadId?: string;
    error?: string;
}> {
    try {
        // Validate required fields
        if (!lead.parent_name || !lead.parent_email) {
            return {
                success: false,
                error: 'Missing required fields: name or email',
            };
        }

        if (!lead.consent_given) {
            return {
                success: false,
                error: 'Consent is required to submit lead',
            };
        }

        // Log what we're about to send (for debugging)
        console.log('[Supabase] Attempting to insert lead with data:', {
            parent_name: lead.parent_name,
            parent_email: lead.parent_email,
            has_phone: !!lead.parent_phone,
            income_parent_a: lead.income_parent_a,
            income_parent_b: lead.income_parent_b,
            children_count: lead.children_count,
            annual_liability: lead.annual_liability,
            message_length: lead.parent_message?.length ?? 0,
            consent_given: lead.consent_given,
            complexity_trigger: lead.complexity_trigger,
            complexity_reasons_count: lead.complexity_reasons.length,
        });

        // Lazy-load Supabase client only when actually submitting
        const supabaseClient = await getSupabaseClient();

        // Sanitize payload: explicitly list ONLY columns that exist in the database
        // This prevents errors from removed fields (e.g., preferred_contact)
        const sanitizedPayload = {
            // Parent contact
            parent_name: lead.parent_name,
            parent_email: lead.parent_email,
            parent_phone: lead.parent_phone,
            location: lead.location,

            // Calculation data
            income_parent_a: lead.income_parent_a,
            income_parent_b: lead.income_parent_b,
            children_count: lead.children_count,
            annual_liability: lead.annual_liability,
            payer_role: lead.payer_role,

            // Care arrangement data
            care_data: lead.care_data,

            // Complexity data
            complexity_trigger: lead.complexity_trigger,
            complexity_reasons: lead.complexity_reasons,
            financial_tags: lead.financial_tags,

            // Message
            parent_message: lead.parent_message,

            // Privacy compliance
            consent_given: lead.consent_given,

            // Lead management (optional fields)
            ...(lead.assigned_lawyer_id !== undefined && {
                assigned_lawyer_id: lead.assigned_lawyer_id,
            }),
            ...(lead.status !== undefined && { status: lead.status }),
            ...(lead.sent_at !== undefined && { sent_at: lead.sent_at }),
            ...(lead.lawyer_response_at !== undefined && {
                lawyer_response_at: lead.lawyer_response_at,
            }),
            ...(lead.notes !== undefined && { notes: lead.notes }),
            ...(lead.deleted_at !== undefined && { deleted_at: lead.deleted_at }),

            // Chatbot lead qualification data
            parenting_plan_status: lead.parenting_plan_status,
            inquiry_type: lead.inquiry_type,
            referer_url: lead.referer_url,

            // Lead scoring data
            lead_score: lead.lead_score,
            score_category: lead.score_category,
            scoring_factors: lead.scoring_factors,

            // Special circumstances additional data (PSI, international)
            special_circumstances_data: lead.special_circumstances_data,
        };

        // Insert lead into database and return the ID
        const { data, error } = await supabaseClient
            .from('leads')
            .insert([sanitizedPayload])
            .select('id')
            .single();

        if (error) {
            console.error('[Supabase] Error inserting lead:', error);
            console.error('[Supabase] Error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
            });
            return {
                success: false,
                error: error.message || 'Failed to submit lead',
            };
        }

        console.log('[Supabase] Lead submitted successfully. ID:', data?.id);

        return {
            success: true,
            leadId: data?.id,
        };
    } catch (error) {
        console.error('[Supabase] Unexpected error submitting lead:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}

/**
 * Update a lead with enrichment factors (post-submission data collection)
 * Uses Postgres array concatenation to append factors without needing SELECT permission
 * Optionally saves a calculated annual liability from the enrichment estimator
 */
export async function updateLeadEnrichment(
    leadId: string,
    enrichmentFactors: string[],
    annualLiability?: number,
    payerRole?: 'you' | 'other_parent' | null
): Promise<{ success: boolean; error?: string }> {
    try {
        console.log('[Supabase] Updating lead enrichment:', { leadId, enrichmentFactors, annualLiability, payerRole });

        // Lazy-load Supabase client
        const supabaseClient = await getSupabaseClient();

        // Use RPC to append to array (avoids needing SELECT permission)
        // This calls a Postgres function that concatenates arrays
        const { error: updateError } = await supabaseClient.rpc(
            'append_complexity_reasons',
            {
                lead_id: leadId,
                new_reasons: enrichmentFactors,
            }
        );

        if (updateError) {
            console.error('[Supabase] RPC error, falling back to direct update:', updateError);

            // Fallback: Try direct update (requires UPDATE policy)
            // This overwrites rather than appends, but at least saves the enrichment data
            const { error: fallbackError } = await supabaseClient
                .from('leads')
                .update({
                    complexity_reasons: enrichmentFactors,
                    ...(annualLiability !== undefined && { enrichment_annual_liability: annualLiability }),
                    ...(payerRole !== undefined && { enrichment_payer_role: payerRole }),
                })
                .eq('id', leadId);

            if (fallbackError) {
                console.error('[Supabase] Fallback update also failed:', fallbackError);
                return {
                    success: false,
                    error: fallbackError.message || 'Failed to update lead',
                };
            }
        } else if (annualLiability !== undefined || payerRole !== undefined) {
            // RPC succeeded, but we still need to update the liability/payer separately
            const { error: liabilityError } = await supabaseClient
                .from('leads')
                .update({
                    ...(annualLiability !== undefined && { enrichment_annual_liability: annualLiability }),
                    ...(payerRole !== undefined && { enrichment_payer_role: payerRole }),
                })
                .eq('id', leadId);

            if (liabilityError) {
                console.error('[Supabase] Failed to update liability/payer:', liabilityError);
                // Don't fail the whole operation, enrichment factors were saved
            }
        }

        console.log('[Supabase] Lead enrichment updated successfully. ID:', leadId);
        return { success: true };
    } catch (error) {
        console.error('[Supabase] Unexpected error updating lead enrichment:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}
