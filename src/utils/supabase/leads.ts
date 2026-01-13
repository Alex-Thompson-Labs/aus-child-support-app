import { getSupabaseClient } from './client';

/**
 * Generates a UUID v4 string.
 * Uses crypto.getRandomValues if available (web/modern runtimes),
 * otherwise falls back to a Math.random implementation.
 * This ensures compatibility with Expo Go and older Android/iOS runtimes
 * where crypto.randomUUID might not be polyfilled.
 */
function generateUUID(): string {
    // Check for modern crypto API (web/node)
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    // Check for getRandomValues (some RN environments)
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
        // @ts-ignore - TS might complain about Uint8Array in some incomplete env definitions
        const buffer = new Uint8Array(16);
        crypto.getRandomValues(buffer);

        // Set version (4) and variant (RFC4122)
        buffer[6] = (buffer[6] & 0x0f) | 0x40;
        buffer[8] = (buffer[8] & 0x3f) | 0x80;

        const hex = Array.from(buffer)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }

    // Fallback for older environments
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

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

    // Time tracking (seconds from calculator mount to lead submission)
    time_to_complete?: number;
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

        // Generate ID client-side to avoid needing SELECT permission on the table
        // This is necessary because anon users can INSERT but NOT SELECT (to prevent scraping)
        const leadId = generateUUID();

        // Sanitize payload: explicitly list ONLY columns that exist in the database
        // This prevents errors from removed fields (e.g., preferred_contact)
        const sanitizedPayload = {
            id: leadId,
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

            // Time tracking
            time_to_complete: lead.time_to_complete,
        };

        // Insert lead into database
        // We do NOT use .select() because RLS prevents anon users from reading
        const { error } = await supabaseClient
            .from('leads')
            .insert([sanitizedPayload]);

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

        console.log('[Supabase] Lead submitted successfully. ID:', leadId);

        return {
            success: true,
            leadId: leadId,
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

        // Use RPC to append to array AND update fields (avoids needing UPDATE permission)
        // This calls a Postgres function that handles the data update securely
        const { error: updateError } = await supabaseClient.rpc(
            'append_complexity_reasons',
            {
                lead_id: leadId,
                new_reasons: enrichmentFactors,
                annual_liability: annualLiability,
                payer_role: payerRole,
            }
        );

        if (updateError) {
            console.error('[Supabase] RPC error:', updateError);
            return {
                success: false,
                error: updateError.message || 'Failed to update lead enrichment',
            };
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
