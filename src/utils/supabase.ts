/**
 * Supabase Client Configuration
 * 
 * Initializes the Supabase client for database operations.
 * Used for storing lead submissions from the lawyer inquiry form.
 * 
 * Security:
 * - Uses anon key (safe for client-side)
 * - Row Level Security (RLS) policies control access
 * - Anonymous users can only INSERT leads
 * - Admin access requires authentication
 */

import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get Supabase credentials from environment variables
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validate credentials
if (!supabaseUrl) {
  console.error('[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  console.error('[Supabase] Missing EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      // Enable auth for admin panel
      // Anonymous form submissions don't require auth
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

console.log('[Supabase] Client initialized with:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
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
  care_data: Array<{
    index: number;
    careA: number;
    careB: number;
  }> | null;
  
  // Complexity data
  complexity_trigger: string;
  complexity_reasons: string[];
  coa_reasons: {
    count: number;
    reasons: Array<{
      label: string;
      description: string;
      category: string;
      urgency: 'URGENT' | 'Normal';
      officialCoAReasons: string;
    }>;
  } | null;
  
  // Message
  parent_message: string;
  preferred_contact: string | null;
  
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
      has_coa_reasons: !!lead.coa_reasons,
    });

    // Insert lead into database
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
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

    if (!data) {
      return {
        success: false,
        error: 'No data returned from database',
      };
    }

    console.log('[Supabase] Lead submitted successfully:', data.id);

    return {
      success: true,
      leadId: data.id,
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
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase] Client not configured - missing credentials');
    return false;
  }

  try {
    // Try a simple query to test connection
    const { error } = await supabase.from('leads').select('id').limit(1);
    
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

