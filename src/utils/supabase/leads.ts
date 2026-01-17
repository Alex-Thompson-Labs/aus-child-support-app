import * as Crypto from 'expo-crypto';
import { getSupabaseClient } from './client';

/**
 * Generates a cryptographically secure UUID v4 string.
 * 
 * Security: Uses expo-crypto.randomUUID() as the primary method, which provides
 * cryptographically secure UUID generation on all platforms (iOS, Android, Web).
 * This ensures that lead IDs cannot be predicted or guessed, which is critical for
 * security as lead IDs are used to access sensitive personal information.
 * 
 * Fallback strategy:
 * 1. expo-crypto.randomUUID() (PRIMARY - secure on all platforms)
 * 2. crypto.randomUUID() (Web fallback for modern browsers)
 * 3. HARD ERROR - No insecure fallbacks allowed
 * 
 * @throws {Error} If no secure UUID generator is available (fail-safe design)
 * @returns {string} A cryptographically secure UUID v4 string
 */
function generateUUID(): string {
    // Method 1: expo-crypto.randomUUID() (PRIMARY - works on iOS, Android, Web)
    try {
        const uuid = Crypto.randomUUID();
        if (uuid && typeof uuid === 'string' && uuid.length === 36) {
            return uuid;
        }
    } catch (error) {
        // Fallback to web crypto API
    }

    // Method 2: Web Crypto API fallback (modern browsers, Node.js 15.6+)
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        try {
            const uuid = crypto.randomUUID();
            if (uuid && typeof uuid === 'string' && uuid.length === 36) {
                return uuid;
            }
        } catch (error) {
            // No secure UUID generator available
        }
    }

    // HARD ERROR - No insecure fallbacks
    // If we reach here, no secure UUID generator is available
    // TODO: Replace with proper error reporting service
    throw new Error(
        'SECURITY ERROR: Unable to generate secure UUID. ' +
        'No cryptographically secure UUID generator is available in this environment. ' +
        'Lead submission cannot proceed without secure ID generation to protect user data. ' +
        'This is a critical security issue that must be resolved before production use.'
    );
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
    score_breakdown?: {
        factor: string;
        points: number;
        label: string;
    }[];

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

            // Partner attribution
            partner_id: (lead as any).partner_id || null,

            // Lead scoring data
            lead_score: lead.lead_score,
            score_category: lead.score_category,
            scoring_factors: lead.scoring_factors,
            score_breakdown: lead.score_breakdown,

            // Special circumstances additional data (PSI, international)
            special_circumstances_data: lead.special_circumstances_data,

            // Time tracking
            time_to_complete: lead.time_to_complete,
        };

        // DEBUG: Log what we're about to send
        console.log('[submitLead] Submitting lead:', {
            id: leadId,
            parent_name: sanitizedPayload.parent_name,
            parent_email: sanitizedPayload.parent_email,
            parent_phone: sanitizedPayload.parent_phone,
        });

        // Insert lead into database
        // We do NOT use .select() because RLS prevents anon users from reading
        const { error } = await supabaseClient
            .from('leads')
            .insert([sanitizedPayload]);

        if (error) {
            // TODO: Replace with proper error reporting service
            return {
                success: false,
                error: error.message || 'Failed to submit lead',
            };
        }

        return {
            success: true,
            leadId: leadId,
        };
    } catch (error) {
        // TODO: Replace with proper error reporting service
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
    payerRole?: 'you' | 'other_parent' | null,
    otherParentCountry?: string
): Promise<{ success: boolean; error?: string }> {
    try {
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
                other_parent_country: otherParentCountry || null,
            }
        );

        if (updateError) {
            // TODO: Replace with proper error reporting service
            return {
                success: false,
                error: updateError.message || 'Failed to update lead enrichment',
            };
        }

        return { success: true };
    } catch (error) {
        // TODO: Replace with proper error reporting service
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}

/**
 * Fetch paginated leads from the database
 * 
 * Implements server-side pagination to prevent loading all PII into client memory.
 * Uses Supabase .range() to limit data transfer and improve performance.
 * 
 * @param page - Page number (0-indexed)
 * @param limit - Number of leads per page (default: 20)
 * @param options - Optional filtering and sorting options
 * @returns Paginated leads data with total count
 */
export async function fetchPaginatedLeads(
    page: number = 0,
    limit: number = 20,
    options?: {
        statusFilter?: 'all' | 'new' | 'reviewing' | 'sent' | 'converted' | 'lost';
        sortBy?: 'date' | 'liability' | 'income';
        sortOrder?: 'asc' | 'desc';
    }
): Promise<{
    success: boolean;
    leads?: LeadSubmission[];
    totalCount?: number;
    error?: string;
}> {
    try {
        // Lazy-load Supabase client
        const supabaseClient = await getSupabaseClient();

        // Calculate range for pagination
        const startIndex = page * limit;
        const endIndex = startIndex + limit - 1;

        // Build query - use leads table directly (encryption not yet implemented)
        let query = supabaseClient
            .from('leads')
            .select('*', { count: 'exact' })
            .is('deleted_at', null); // Exclude soft-deleted leads

        // Apply status filter
        if (options?.statusFilter && options.statusFilter !== 'all') {
            query = query.eq('status', options.statusFilter);
        }

        // Apply sorting
        const sortBy = options?.sortBy || 'date';
        const sortOrder = options?.sortOrder || 'desc';
        
        if (sortBy === 'date') {
            query = query.order('created_at', { ascending: sortOrder === 'asc' });
        } else if (sortBy === 'liability') {
            query = query.order('annual_liability', { ascending: sortOrder === 'asc' });
        } else if (sortBy === 'income') {
            // For income sorting, we need to sort by a calculated field
            // This requires a database view or function, for now we'll fetch and sort client-side
            query = query.order('created_at', { ascending: false });
        }

        // Apply pagination using range
        query = query.range(startIndex, endIndex);

        const { data, error, count } = await query;

        if (error) {
            // TODO: Replace with proper error reporting service
            return {
                success: false,
                error: error.message || 'Failed to fetch leads',
            };
        }

        // If sorting by income, do it client-side for this page
        let sortedData = data || [];
        if (sortBy === 'income' && sortedData.length > 0) {
            sortedData = [...sortedData].sort((a, b) => {
                const incA = (a.income_parent_a || 0) + (a.income_parent_b || 0);
                const incB = (b.income_parent_a || 0) + (b.income_parent_b || 0);
                return sortOrder === 'asc' ? incA - incB : incB - incA;
            });
        }

        return {
            success: true,
            leads: sortedData,
            totalCount: count || 0,
        };
    } catch (error) {
        // TODO: Replace with proper error reporting service
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}
