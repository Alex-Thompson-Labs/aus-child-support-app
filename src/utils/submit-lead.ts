/**
 * Partner-aware lead submission utility.
 *
 * This module provides lead submission via Supabase Edge Function,
 * with support for partner attribution for ROI tracking.
 *
 * Uses the official Supabase Client SDK's functions.invoke() method
 * for secure, managed communication with edge functions.
 *
 * This is now the primary submission method used by the lawyer inquiry form.
 * The legacy submitLead() from supabase.ts is kept for backward compatibility.
 */

import type { PartnerKey } from '@/src/config/partners';
import type { LeadSubmission } from './supabase';
import { getSupabaseClient } from './supabase/client';

export interface SubmitLeadPayload extends LeadSubmission {
  partner_id?: PartnerKey | null;
}

export interface SubmitLeadResult {
  success: boolean;
  leadId?: string;
  error?: string;
}

/**
 * Submit a lead via direct database insertion with partner attribution.
 *
 * TEMPORARY: Using direct database insertion instead of edge function
 * because edge function is returning 401 errors. This bypasses the
 * magic link generation and email notification, but allows lead submission.
 *
 * TODO: Fix edge function authentication and switch back to edge function
 *
 * @param lead - Lead submission data
 * @param partnerId - Optional partner ID for attribution
 * @returns Success status with lead ID or error message
 */
export async function submitLeadWithPartner(
  lead: LeadSubmission,
  partnerId?: PartnerKey | null
): Promise<SubmitLeadResult> {
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

    // Get Supabase client (lazy-loaded)
    const supabase = await getSupabaseClient();

    // Use direct database insertion (bypassing edge function for now)
    const { submitLead } = await import('./supabase/leads');
    
    const payload: SubmitLeadPayload = {
      ...lead,
      partner_id: partnerId ?? null,
    };

    const result = await submitLead(payload);
    
    return result;
  } catch (error) {
    // TODO: Replace with proper error reporting service
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
