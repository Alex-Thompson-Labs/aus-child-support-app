// Complexity detection for lawyer lead generation
// TODO: Implement this in Day 1-2 of Phase 1
//
// This detects when calculations indicate high-value cases
// that should trigger "Get Legal Help" prompts

import type { CalculationResults, ChildInput } from '../types/calculator';
import { convertCareToPercentage } from './child-support-calculations';
import { getHighestPriorityReason, getCoAReasonById, formatOfficialCoAReasons } from './change-of-assessment-reasons';

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

  /**
   * Optional educational tip/note displayed below main message
   * Used for value-add information like forensic accountant recommendations
   */
  tip?: string;
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
/**
 * Partial form data type for complexity detection
 * Only includes fields needed for detection, making it more flexible
 */
export interface ComplexityFormData {
  children?: ChildInput[];
  /**
   * Array of selected complexity trigger reason IDs
   * Used to detect situations requiring legal review
   */
  selectedCoAReasons?: string[];
}

export function detectComplexity(
  results: CalculationResults,
  formData: ComplexityFormData
): ComplexityFlags {
  // Check for high-value cases (annual payment > $15k)
  const isHighValue = results.finalPaymentAmount > 15000;

  // Debug logging (only in dev)
  if (__DEV__) {
    console.log('[detectComplexity] Payment amount:', results.finalPaymentAmount);
    console.log('[detectComplexity] Is high value (>15000):', isHighValue);
  }

  // Check for shared care dispute (care percentage between 35-65% for any child)
  const hasSharedCareDispute = formData.children?.some((child: ChildInput) => {
    const carePercA = convertCareToPercentage(child.careAmountA, child.carePeriod);
    const carePercB = convertCareToPercentage(child.careAmountB, child.carePeriod);

    return (carePercA >= 35 && carePercA <= 65) ||
      (carePercB >= 35 && carePercB <= 65);
  }) ?? false;

  // Check for selected CoA reasons
  const selectedReasons = formData.selectedCoAReasons ?? [];

  // Check for urgent court date (via checkbox selection)
  const hasCourtDateUrgent = selectedReasons.includes('court_date_upcoming');

  if (__DEV__) {
    console.log('[detectComplexity] Court date checkbox selected:', hasCourtDateUrgent);
  }

  // Check for special circumstances via selected CoA reasons
  const hasSpecialCircumstances = selectedReasons.length > 0;

  if (__DEV__) {
    console.log('[detectComplexity] Selected CoA reasons:', selectedReasons);
    console.log('[detectComplexity] Has special circumstances:', hasSpecialCircumstances);
  }

  return {
    highVariance: false, // TODO: Calculate care variance
    highValue: isHighValue,
    specialCircumstances: hasSpecialCircumstances,
    incomeSuspicion: false, // TODO: Check formData flags
    courtDateUrgent: hasCourtDateUrgent,
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
 * @param formData - The form data used for complexity detection (needed for CoA reason details)
 * @returns AlertConfig for the highest-priority issue, or null if no alert needed
 */
export function getAlertConfig(
  flags: ComplexityFlags,
  results: CalculationResults,
  formData?: ComplexityFormData
): AlertConfig | null {
  // Priority 1: Urgent court date
  if (flags.courtDateUrgent) {
    return {
      title: "URGENT: Court Date Soon",
      message: "You need legal advice BEFORE your court appearance.",
      urgency: 'high',
      buttonText: "Get Emergency Consultation"
    };
  }

  // Priority 2: Complexity triggers (special circumstances)
  if (flags.specialCircumstances) {
    // Safely get selected reasons, handle undefined/null
    const selectedIds = formData?.selectedCoAReasons ?? [];

    // Get the most important reason (based on priority)
    const mostImportantReason = getHighestPriorityReason(selectedIds);

    if (__DEV__) {
      console.log('[getAlertConfig] Selected complexity reason IDs:', selectedIds);
      console.log('[getAlertConfig] Most important reason:', mostImportantReason);
    }

    // Handle edge case: flag is true but no valid reasons found
    if (!mostImportantReason) {
      if (__DEV__) {
        console.warn('[getAlertConfig] specialCircumstances flag is true but no valid reasons found');
      }
      // Fallback to generic message
      return {
        title: "📋 Special Circumstances Detected",
        message: "Your case has factors that may benefit from legal review.",
        urgency: 'medium',
        buttonText: "Talk to a Lawyer"
      };
    }

    // Determine importance based on priority
    // Priority 1-3: URGENT (affects calculation directly or critical issues)
    // Priority 4-10: Normal (still important but less critical)
    const isHighPriority = mostImportantReason.priority <= 3;

    // Handle multiple reasons vs single reason
    const reasonCount = selectedIds.filter(id => getCoAReasonById(id) !== null).length;

    if (reasonCount > 1) {
      // Multiple reasons selected
      // Check if any selected reason is Reason 8A (income suspicion)
      const hasReason8A = selectedIds.some(id => {
        const reason = getCoAReasonById(id);
        return reason?.officialCoAReasons.includes('5.2.8');
      });

      const forensicAccountantTip = hasReason8A
        ? "Tip: Family lawyers who specialize in complex income cases may recommend a forensic accountant to investigate. These typically cost $5,000-$15,000 but can uncover hidden income worth 10-50x their fee. Your lawyer will advise if this is appropriate for your case."
        : undefined;

      return {
        title: isHighPriority
          ? `💰 ${reasonCount} Issues Affecting Fairness Detected`
          : `📋 ${reasonCount} Factors Affecting Fairness`,
        message: isHighPriority
          ? "The income situation looks complicated—a lawyer can help you request an adjustment. This often increases support by $5,000+/year."
          : "Multiple complexity factors apply to your case. A lawyer can help ensure fair assessment.",
        urgency: isHighPriority ? 'high' : 'medium',
        buttonText: "Talk to a Lawyer About This",
        tip: forensicAccountantTip
      };
    } else {
      // Single reason - use reason-specific message
      // Sanitize the label to prevent any potential issues
      const sanitizedLabel = mostImportantReason.label.replace(/[<>]/g, '');
      const categoryEmoji = mostImportantReason.category === 'income' ? '💰' :
                            mostImportantReason.category === 'child' ? '👶' : '🏡';

      // Check if this is a Reason 8A income suspicion case (hidden income)
      const isReason8A = mostImportantReason.officialCoAReasons.includes('5.2.8');
      const forensicAccountantTip = isReason8A
        ? "Tip: Family lawyers who specialize in complex income cases may recommend a forensic accountant to investigate. These typically cost $5,000-$15,000 but can uncover hidden income worth 10-50x their fee. Your lawyer will advise if this is appropriate for your case."
        : undefined;

      if (isHighPriority) {
        return {
          title: `${categoryEmoji} URGENT: ${sanitizedLabel}`,
          message: "The income situation looks complicated—a lawyer can help you request an adjustment to make it fair. This often makes a $5,000+ difference in annual support.",
          urgency: 'high',
          buttonText: "Talk to a Lawyer",
          tip: forensicAccountantTip
        };
      } else {
        return {
          title: `${categoryEmoji} Change of Assessment: ${sanitizedLabel}`,
          message: "This situation can be complex—a lawyer knows how to navigate the assessment process to ensure fairness.",
          urgency: 'medium',
          buttonText: "Get Legal Help",
          tip: forensicAccountantTip
        };
      }
    }
  }

  // Priority 3: Shared care dispute
  if (flags.sharedCareDispute) {
    return {
      title: "Care Arrangement in Dispute Zone",
      message: "Shared care between 35-65% is often contested. Consider professional advice.",
      urgency: 'medium',
      buttonText: "Get Guidance"
    };
  }

  // Priority 4: High value cases
  if (flags.highValue) {
    return {
      title: "💰 High-Value Case",
      message: `Your liability is $${Math.round(results.finalPaymentAmount).toLocaleString()}/year. Cases over $15k benefit from verification.`,
      urgency: 'medium',
      buttonText: "Request Review"
    };
  }

  // TODO: Implement other triggers
  // See docs/MASTER_PLAN.md for complete implementation

  return null; // No alert needed
}

/**
 * Formats complexity trigger reasons for lawyer lead data
 *
 * Creates a structured representation of selected complexity reasons with their
 * labels, descriptions, official CoA codes, and category for lawyer referral emails.
 *
 * @param selectedIds - Array of selected complexity reason IDs from form data
 * @returns Formatted object containing reason details, or null if no valid reasons
 */
export interface CoALeadData {
  /** Number of valid reasons selected */
  count: number;
  /** Array of reason details for lawyer review */
  reasons: Array<{
    label: string;
    description: string;
    category: string;
    urgency: 'URGENT' | 'Normal';
    officialCoAReasons: string;
  }>;
  /** Pre-formatted text block for email templates */
  formattedText: string;
}

export function formatCoAReasonsForLead(
  selectedIds: string[] | undefined | null
): CoALeadData | null {
  // Handle undefined/null/empty gracefully
  if (!selectedIds || !Array.isArray(selectedIds) || selectedIds.length === 0) {
    return null;
  }

  // Get all valid reasons, filter out invalid IDs
  const validReasons = selectedIds
    .map(id => getCoAReasonById(id))
    .filter((reason): reason is NonNullable<typeof reason> => reason !== null);

  if (validReasons.length === 0) {
    if (__DEV__) {
      console.warn('[formatCoAReasonsForLead] No valid reasons found from IDs:', selectedIds);
    }
    return null;
  }

  // Sort by priority (most urgent first: 1, 2, 3, ... 10)
  const sortedReasons = [...validReasons].sort((a, b) => a.priority - b.priority);

  // Format each reason with sanitized data and urgency
  const reasons = sortedReasons.map(reason => ({
    label: reason.label.replace(/[<>]/g, ''), // Sanitize for safety
    description: reason.description.replace(/[<>]/g, ''),
    category: reason.category,
    urgency: (reason.priority <= 3 ? 'URGENT' : 'Normal') as 'URGENT' | 'Normal',
    officialCoAReasons: formatOfficialCoAReasons(reason)
  }));

  // Create formatted text block for email templates
  const formattedLines = reasons.map((reason, index) => {
    return `${index + 1}. ${reason.label} (priority: ${reason.urgency})\n   → ${reason.description}\n   → Official grounds: ${reason.officialCoAReasons}`;
  });

  const formattedText = `CHANGE OF ASSESSMENT GROUNDS:\n${formattedLines.join('\n\n')}`;

  return {
    count: reasons.length,
    reasons,
    formattedText
  };
}

/*
// TEST CASE 1: High Value
const testResults1: CalculationResults = {
  year: '2024',
  ATI_A: 120000,
  ATI_B: 60000,
  relDepDeductibleA: 0,
  relDepDeductibleB: 0,
  SSA: 35168,
  FAR: 90000,
  MAR: 45000,
  MAX_PPS: 18000,
  CSI_A: 120000,
  CSI_B: 60000,
  CCSI: 180000,
  incomePercA: 66.67,
  incomePercB: 33.33,
  totalCost: 25000,
  childResults: [],
  totalLiabilityA: 18000,
  totalLiabilityB: 0,
  finalLiabilityA: 18000,
  finalLiabilityB: 0,
  FAR_A: 90000,
  FAR_B: 45000,
  MAR_A: 45000,
  MAR_B: 22500,
  rateApplied: 'standard',
  payer: 'Parent A',
  receiver: 'Parent B',
  finalPaymentAmount: 18000,
};
const testFlags1 = detectComplexity(testResults1, { children: [] });
console.log('Test 1 - High Value:', testFlags1.highValue); // Should be true

const alert1 = getAlertConfig(testFlags1, testResults1);
console.log('Alert 1:', alert1?.title); // Should show "💰 High-Value Case"

// TEST CASE 2: Normal Value
const testResults2: CalculationResults = {
  year: '2024',
  ATI_A: 60000,
  ATI_B: 40000,
  relDepDeductibleA: 0,
  relDepDeductibleB: 0,
  SSA: 35168,
  FAR: 90000,
  MAR: 45000,
  MAX_PPS: 18000,
  CSI_A: 60000,
  CSI_B: 40000,
  CCSI: 100000,
  incomePercA: 60,
  incomePercB: 40,
  totalCost: 12000,
  childResults: [],
  totalLiabilityA: 8000,
  totalLiabilityB: 0,
  finalLiabilityA: 8000,
  finalLiabilityB: 0,
  FAR_A: 90000,
  FAR_B: 45000,
  MAR_A: 45000,
  MAR_B: 22500,
  rateApplied: 'standard',
  payer: 'Parent A',
  receiver: 'Parent B',
  finalPaymentAmount: 8000,
};
const testFlags2 = detectComplexity(testResults2, { children: [] });
console.log('Test 2 - Normal:', testFlags2.highValue); // Should be false

const alert2 = getAlertConfig(testFlags2, testResults2);
console.log('Alert 2:', alert2); // Should be null

// TEST CASE 3: Shared Care Dispute
const testResults3: CalculationResults = {
  year: '2024',
  ATI_A: 80000,
  ATI_B: 70000,
  relDepDeductibleA: 0,
  relDepDeductibleB: 0,
  SSA: 35168,
  FAR: 90000,
  MAR: 45000,
  MAX_PPS: 18000,
  CSI_A: 80000,
  CSI_B: 70000,
  CCSI: 150000,
  incomePercA: 53.33,
  incomePercB: 46.67,
  totalCost: 15000,
  childResults: [],
  totalLiabilityA: 7000,
  totalLiabilityB: 0,
  finalLiabilityA: 7000,
  finalLiabilityB: 0,
  FAR_A: 90000,
  FAR_B: 45000,
  MAR_A: 45000,
  MAR_B: 22500,
  rateApplied: 'standard',
  payer: 'Parent A',
  receiver: 'Parent B',
  finalPaymentAmount: 7000,
};
const testFormData3 = {
  children: [
    { id: '1', age: 'Under 13', careAmountA: 3, careAmountB: 4, carePeriod: 'week' }
    // 3 nights/week = 42.86% care for Parent A (in dispute zone 35-65%)
  ]
};
const testFlags3 = detectComplexity(testResults3, testFormData3);
console.log('Test 3 - Shared Care:', testFlags3.sharedCareDispute); // Should be true

const alert3 = getAlertConfig(testFlags3, testResults3);
console.log('Alert 3:', alert3?.title); // Should show "⚖️ Care Arrangement in Dispute Zone"
*/