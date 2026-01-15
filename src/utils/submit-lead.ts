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

import { getSupabaseClient } from './supabase/client';
import type { LeadSubmission } from './supabase';
import type { PartnerKey } from '@/src/config/partners';

export interface SubmitLeadPayload extends LeadSubmission {
  partner_id?: PartnerKey | null;
}

export interface SubmitLeadResult {
  success: boolean;
  leadId?: string;
  error?: string;
}

/**
 * Submit a lead via Supabase Edge Function with partner attribution.
 *
 * Uses the official Supabase SDK's functions.invoke() method for secure
 * communication with edge functions. The SDK handles proper URL construction,
 * authentication headers, and error handling automatically.
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

    const payload: SubmitLeadPayload = {
      ...lead,
      partner_id: partnerId ?? null,
    };

    console.log('[submit-lead] Submitting lead to edge function:', {
      partner_id: partnerId ?? null,
      has_phone: !!lead.parent_phone,
      children_count: lead.children_count,
      annual_liability: lead.annual_liability,
    });

    // Use official Supabase SDK method for edge function invocation
    const { data, error } = await supabase.functions.invoke('submit-lead', {
      body: payload,
    });

    if (error) {
      console.error('[submit-lead] Edge function error:', {
        message: error.message,
        context: error.context,
      });
      return {
        success: false,
        error: error.message || 'Submission failed',
      };
    }

    // Check for application-level errors in response data
    if (data?.error) {
      console.error('[submit-lead] Edge function returned error:', data.error);
      return {
        success: false,
        error: data.error,
      };
    }

    console.log('[submit-lead] Lead submitted successfully:', {
      leadId: data?.leadId ?? data?.id,
      partnerId: partnerId ?? null,
    });

    return {
      success: true,
      leadId: data?.leadId ?? data?.id,
    };
  } catch (error) {
    console.error('[submit-lead] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
