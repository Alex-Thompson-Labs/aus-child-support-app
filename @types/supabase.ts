/**
 * Supabase Database Types
 *
 * Type definitions for database tables and records.
 * Separated from client logic for clean imports.
 */

// ============================================================================
// Lead Types
// ============================================================================

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
  consent_timestamp?: string | null;
  consent_ip_address?: string | null;

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

// ============================================================================
// Partnership Proposal Types
// ============================================================================

/**
 * Partnership proposal record
 * Represents a proposal document sent to potential partner firms
 */
export interface PartnershipProposal {
  id: string;
  firm_name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
}

/**
 * Proposal view tracking record
 * Tracks individual view sessions with heartbeat-based duration
 */
export interface ProposalView {
  id: string;
  proposal_id: string;
  viewed_at: string;
  last_heartbeat_at: string;
  device_info: string | null;
}
