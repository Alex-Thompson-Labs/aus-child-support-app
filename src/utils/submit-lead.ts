/**
 * Partner-aware lead submission utility.
 *
 * This module provides lead submission via Supabase Edge Function,
 * with support for partner attribution for ROI tracking.
 *
 * This is now the primary submission method used by the lawyer inquiry form.
 * The legacy submitLead() from supabase.ts is kept for backward compatibility.
 */

import Constants from 'expo-constants';
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

function getSupabaseUrl(): string | undefined {
  return (
    Constants.expoConfig?.extra?.supabaseUrl ||
    process.env.EXPO_PUBLIC_SUPABASE_URL
  );
}

function getSupabaseAnonKey(): string | undefined {
  return (
    Constants.expoConfig?.extra?.supabaseAnonKey ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Submit a lead via Supabase Edge Function with partner attribution.
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

    const supabaseUrl = getSupabaseUrl();
    const supabaseAnonKey = getSupabaseAnonKey();

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[submit-lead] Missing Supabase credentials');
      return {
        success: false,
        error: 'Service configuration error',
      };
    }

    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/submit-lead`;

    const payload: SubmitLeadPayload = {
      ...lead,
      partner_id: partnerId ?? null,
    };

    console.log('[submit-lead] Submitting lead to edge function:', {
      url: edgeFunctionUrl,
      partner_id: partnerId ?? null,
      has_phone: !!lead.parent_phone,
      children_count: lead.children_count,
      annual_liability: lead.annual_liability,
    });

    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[submit-lead] Edge function error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      return {
        success: false,
        error: `Submission failed: ${response.statusText}`,
      };
    }

    const result = await response.json();

    if (result.error) {
      console.error('[submit-lead] Edge function returned error:', result.error);
      return {
        success: false,
        error: result.error,
      };
    }

    console.log('[submit-lead] Lead submitted successfully:', {
      leadId: result.leadId ?? result.id,
      partnerId: partnerId ?? null,
    });

    return {
      success: true,
      leadId: result.leadId ?? result.id,
    };
  } catch (error) {
    console.error('[submit-lead] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
