/**
 * Supabase Client Configuration
 *
 * LAZY-LOADED for optimal LCP performance.
 * Supabase client is only initialized when actually needed (user action).
 *
 * Used for storing lead submissions from the lawyer inquiry form.
 *
 * Security:
 * - Uses anon key (safe for client-side)
 * - Row Level Security (RLS) policies control access
 * - Anonymous users can only INSERT leads
 * - Admin access requires authentication
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Cache the client instance once initialized
let supabaseInstance: SupabaseClient | null = null;

/**
 * Get Supabase credentials from environment variables
 */
function getSupabaseCredentials() {
  const supabaseUrl =
    Constants.expoConfig?.extra?.supabaseUrl ||
    process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    Constants.expoConfig?.extra?.supabaseAnonKey ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  return { supabaseUrl, supabaseAnonKey };
}

/**
 * Lazily initialize Supabase client only when needed
 * This prevents @supabase libraries from being loaded on initial page load
 */
async function getSupabaseClient(): Promise<SupabaseClient> {
  // Return cached instance if already initialized
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Dynamically import Supabase only when needed
  const { createClient } = await import('@supabase/supabase-js');
  const { supabaseUrl, supabaseAnonKey } = getSupabaseCredentials();

  // Validate credentials
  if (!supabaseUrl) {
    console.error(
      '[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL environment variable'
    );
  }

  if (!supabaseAnonKey) {
    console.error(
      '[Supabase] Missing EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable'
    );
  }

  // Create and cache Supabase client
  supabaseInstance = createClient(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
      // Enable auth for admin panel
      // Anonymous form submissions don't require auth
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  console.log('[Supabase] Client initialized (lazy) with:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
  });

  return supabaseInstance;
}

/**
 * Get the Supabase client instance (for compatibility with existing code)
 * WARNING: This will dynamically load Supabase libraries. Use sparingly.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get: function (_target, prop) {
    throw new Error(
      `[Supabase] Direct access to 'supabase.${String(prop)}' is not allowed. ` +
        `Use getSupabaseClient() instead for lazy loading.`
    );
  },
});

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

  // Message
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
    if (!lead.parent_name || !lead.parent_email || !lead.parent_message) {
      return {
        success: false,
        error: 'Missing required fields: name, email, or message',
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
      message_length: lead.parent_message.length,
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
    };

    // Insert lead into database (fire and forget - no select needed)
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

    console.log('[Supabase] Lead submitted successfully');

    return {
      success: true,
      leadId: undefined, // ID not returned since we don't select
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
 * Check if Supabase is configured and accessible
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseCredentials();

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase] Client not configured - missing credentials');
    return false;
  }

  try {
    // Lazy-load Supabase client for connection test
    const supabaseClient = await getSupabaseClient();

    // Try a simple query to test connection
    const { error } = await supabaseClient.from('leads').select('id').limit(1);

    if (error) {
      console.error('[Supabase] Connection test failed:', error);
      return false;
    }

    console.log('[Supabase] Connection test passed');
    return true;
  } catch (error) {
    console.error('[Supabase] Connection test error:', error);
    return false;
  }
}

/**
 * Export getSupabaseClient for use in admin pages and other components
 */
export { getSupabaseClient };
