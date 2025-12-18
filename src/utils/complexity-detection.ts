// Complexity detection for lawyer lead generation
// TODO: Implement this in Day 1-2 of Phase 1
//
// This detects when calculations indicate high-value cases
// that should trigger "Get Legal Help" prompts

import type { CalculationResults } from '@/types/calculator';
import { convertCareToPercentage } from './child-support-calculations';

/**
 * Flags indicating different types of complexity detected in child support calculations
 */
export interface ComplexityFlags {
  /**
   * Indicates high variance in payment amounts based on small changes
   * Triggers when payment amount swings more than $3k with 1 night care change
   */
  highVariance: boolean;

  /**
   * Indicates high annual child support liability
   * Triggers when annual payment amount exceeds $15k
   */
  highValue: boolean;

  /**
   * Indicates special circumstances affecting calculations
   * Triggers when private school costs, medical expenses, or other special costs are involved
   */
  specialCircumstances: boolean;

  /**
   * Indicates user suspects hidden or unreported income
   * Triggers when user flags potential income discrepancies
   */
  incomeSuspicion: boolean;

  /**
   * Indicates urgent court date approaching
   * Triggers when court appearance is scheduled within 30 days
   */
  courtDateUrgent: boolean;

  /**
   * Indicates shared care arrangement in common dispute zone
   * Triggers when care percentage is between 35-65% (typical dispute range)
   */
  sharedCareDispute: boolean;
}

/**
 * Configuration for complexity alert messages shown to users
 */
export interface AlertConfig {
  /**
   * Alert title displayed prominently to user
   */
  title: string;

  /**
   * Detailed message explaining the complexity and why legal help may be needed
   */
  message: string;

  /**
   * Urgency level determining alert styling and priority
   * - 'low': Informational, suggests consideration
   * - 'medium': Important, recommends action
   * - 'high': Critical, requires immediate attention
   */
  urgency: 'low' | 'medium' | 'high';

  /**
   * Text for the call-to-action button (e.g., "Get Legal Help")
   */
  buttonText: string;
}

/**
 * Analyzes calculation results and form data to detect complexity indicators
 *
 * Currently implements:
 * - highValue: Detects annual payments exceeding $15,000
 *
 * TODO: Implement remaining complexity detection logic
 *
 * @param results - The child support calculation results
 * @param formData - User input form data (Replace with proper FormData type)
 * @returns ComplexityFlags object indicating all detected complexities
 *
 * @example
 * // Test case 1: High value case (triggers highValue flag)
 * const highValueResults = { finalPaymentAmount: 18500 };
 * const flags1 = detectComplexity(highValueResults, {});
 * // Expected: flags1.highValue === true
 * // Reason: 18500 > 15000 threshold
 *
 * @example
 * // Test case 2: Low value case (no highValue flag)
 * const lowValueResults = { finalPaymentAmount: 8200 };
 * const flags2 = detectComplexity(lowValueResults, {});
 * // Expected: flags2.highValue === false
 * // Reason: 8200 < 15000 threshold
 *
 * @example
 * // Test case 3: Edge case at threshold
 * const edgeResults = { finalPaymentAmount: 15000 };
 * const flags3 = detectComplexity(edgeResults, {});
 * // Expected: flags3.highValue === false
 * // Reason: 15000 is NOT > 15000 (must exceed threshold)
 */
export function detectComplexity(
  results: CalculationResults,
  formData: any // Replace with proper FormData type
): ComplexityFlags {
  // Check for high-value cases (annual payment > $15k)
  const isHighValue = results.finalPaymentAmount > 15000;

  // Check for shared care dispute (care percentage between 35-65% for any child)
  const hasSharedCareDispute = formData.children?.some((child: any) => {
    const carePercA = convertCareToPercentage(child.careAmountA, child.carePeriod);
    const carePercB = convertCareToPercentage(child.careAmountB, child.carePeriod);

    return (carePercA >= 35 && carePercA <= 65) ||
           (carePercB >= 35 && carePercB <= 65);
  }) || false;

  return {
    highVariance: false, // TODO: Calculate care variance
    highValue: isHighValue,
    specialCircumstances: false, // TODO: Check if formData has private school costs, medical expenses, etc.
    incomeSuspicion: false, // TODO: Check formData flags
    courtDateUrgent: false, // TODO: Check if formData.courtDate is within 30 days
    sharedCareDispute: hasSharedCareDispute,
  };
}

/**
 * Generates appropriate alert configuration based on detected complexity flags
 *
 * Evaluates flags in priority order and returns the highest-priority alert.
 * Returns null if no alert should be shown.
 *
 * TODO: Implement all alert triggers (see docs/MASTER_PLAN.md for complete implementation)
 *
 * @param flags - The complexity flags detected from calculation
 * @param results - The calculation results for context in alert messages
 * @returns AlertConfig for the highest-priority issue, or null if no alert needed
 */
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

  // Priority 2: Special circumstances
  if (flags.specialCircumstances) {
    return {
      title: "📋 Special Circumstances Detected",
      message: "Cases with additional costs often benefit from legal review.",
      urgency: 'medium',
      buttonText: "Request Review"
    };
  }

  // Priority 3: Shared care dispute
  if (flags.sharedCareDispute) {
    return {
      title: "⚖️ Care Arrangement in Dispute Zone",
      message: "Shared care between 35-65% is often contested. Consider professional advice.",
      urgency: 'medium',
      buttonText: "Get Guidance"
    };
  }

  // Priority 4: High value cases
  if (flags.highValue) {
    return {
      title: "💰 High-Value Case",
      message: `Your liability is $${results.finalPaymentAmount.toLocaleString()}/year. Cases over $15k benefit from verification.`,
      urgency: 'medium',
      buttonText: "Request Review"
    };
  }

  // TODO: Implement other triggers
  // See docs/MASTER_PLAN.md for complete implementation

  return null; // No alert needed
}
