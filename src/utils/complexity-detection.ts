// Complexity detection for lawyer lead generation
// TODO: Implement this in Day 1-2 of Phase 1
//
// This detects when calculations indicate high-value cases
// that should trigger "Get Legal Help" prompts

import type { CalculationResults } from '@/types/calculator';

export interface ComplexityFlags {
  highVariance: boolean;      // >$3k swing on 1 night change
  highValue: boolean;         // >$15k annual liability
  specialCircumstances: boolean;  // Private school, medical costs
  incomeSuspicion: boolean;   // User suspects hidden income
  courtDateUrgent: boolean;   // Court date <30 days
  sharedCareDispute: boolean; // Care 35-65% (common dispute zone)
}

export interface AlertConfig {
  title: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
  buttonText: string;
}

// TODO: Implement complexity detection
export function detectComplexity(
  results: CalculationResults,
  formData: any // Replace with proper FormData type
): ComplexityFlags {
  return {
    highVariance: false, // TODO: Calculate care variance
    highValue: results.finalPaymentAmount > 15000,
    specialCircumstances: false, // TODO: Check formData flags
    incomeSuspicion: false, // TODO: Check formData flags
    courtDateUrgent: false, // TODO: Check formData flags
    sharedCareDispute: false, // TODO: Check care percentages
  };
}

// TODO: Implement alert message generation
export function getAlertConfig(
  flags: ComplexityFlags,
  results: CalculationResults
): AlertConfig | null {
  // Priority 1: Urgent court date
  if (flags.courtDateUrgent) {
    return {
      title: "⚖️ URGENT: Court Date Soon",
      message: "You need legal advice BEFORE your court appearance.",
      urgency: 'high',
      buttonText: "Get Emergency Consultation"
    };
  }
  
  // TODO: Implement other triggers
  // See docs/MASTER_PLAN.md for complete implementation
  
  return null; // No alert needed
}
