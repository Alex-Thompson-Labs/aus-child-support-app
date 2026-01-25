import type { CalculationResults, ChildInput, ComplexityTrapReason, NonParentCarerInfo } from './calculator';
import { convertCareToPercentage } from './care-utils';
import { formatCurrency } from './formatters';
import {
    getHighestPriorityReason,
    getSpecialCircumstanceById,
    isCourtDateReason,
    parseCourtDateFromReasonId,
} from './special-circumstances';

/**
 * Flags indicating different types of complexity detected in child support calculations
 */
export interface ComplexityFlags {
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
   * Indicates shared care arrangement in common dispute zone
   * Triggers when care percentage is between 35-65% (typical dispute range)
   */
  sharedCareDispute: boolean;

  /**
   * Indicates user is interested in binding child support agreement
   * Triggers when user clicks "Discuss Agreements" button
   */
  bindingAgreement: boolean;
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
 * Analyses calculation results and form data to detect complexity indicators
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
  selectedCircumstances?: string[];
  /**
   * Court date string in DD/MM/YYYY format
   */
  /**
   * Whether Parent A receives income support payments
   * Used for MAR/FAR calculations and zero payment detection
   */
  supportA?: boolean;
  /**
   * Whether Parent B receives income support payments
   * Used for MAR/FAR calculations and zero payment detection
   */
  supportB?: boolean;
  /**
   * Whether user has expressed interest in binding child support agreement
   * Set to true when user clicks "Discuss Agreements" button
   */
  wantsBindingAgreement?: boolean;
}

export function detectComplexity(
  results: CalculationResults,
  formData: ComplexityFormData
): ComplexityFlags {
  // Check for high-value cases (annual payment > $15k)
  const isHighValue = results.finalPaymentAmount > 15000;

  // Debug logging (only in dev)

  // Check for shared care dispute (care percentage between 35-65% for any child)
  const hasSharedCareDispute =
    formData.children?.some((child: ChildInput) => {
      const carePercA = convertCareToPercentage(
        child.careAmountA,
        child.carePeriod
      );
      const carePercB = convertCareToPercentage(
        child.careAmountB,
        child.carePeriod
      );

      return (
        (carePercA >= 35 && carePercA <= 65) ||
        (carePercB >= 35 && carePercB <= 65)
      );
    }) ?? false;

  // Check for selected special circumstances
  const selectedReasons = formData.selectedCircumstances ?? [];

  // Check if court date reason is selected (check for dynamic court date reasons)
  const hasCourtDateSelected = selectedReasons.some((id) =>
    isCourtDateReason(id)
  );

  if (__DEV__ && hasCourtDateSelected) {
  }

  // Check for special circumstances via selected CoA reasons
  const hasSpecialCircumstances = selectedReasons.length > 0;

  if (__DEV__) {
  }

  return {
    highValue: isHighValue,
    specialCircumstances: hasSpecialCircumstances,
    sharedCareDispute: hasSharedCareDispute,
    bindingAgreement: formData.wantsBindingAgreement ?? false,
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
  // Priority 1: Court date selected
  const courtDateReasonId = formData?.selectedCircumstances?.find((id) =>
    isCourtDateReason(id)
  );
  if (courtDateReasonId) {
    const courtDate = parseCourtDateFromReasonId(courtDateReasonId);
    const dateStr = courtDate
      ? courtDate.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      : '';

    return {
      title: dateStr
        ? `Court Date Approaching: ${dateStr}`
        : 'Court Date Approaching',
      message:
        'Professional legal preparation is strongly recommended before your court appearance.',
      urgency: 'high',
      buttonText: 'Get Legal Consultation',
    };
  }

  // Priority 2: Complexity triggers (special circumstances)
  if (flags.specialCircumstances) {
    // Safely get selected reasons, handle undefined/null
    const selectedIds = formData?.selectedCircumstances ?? [];

    // Get the most important reason (based on priority)
    const mostImportantReason = getHighestPriorityReason(selectedIds);

    // Handle edge case: flag is true but no valid reasons found
    if (!mostImportantReason) {
      // Fallback to generic message
      return {
        title: '📋 Special Circumstances Detected',
        message: 'Your case has factors that may benefit from legal review.',
        urgency: 'medium',
        buttonText: 'Talk to a Lawyer',
      };
    }

    // Determine importance based on priority
    // Priority 1-3: URGENT (affects calculation directly or critical issues)
    // Priority 4-10: Normal (still important but less critical)
    const isHighPriority = mostImportantReason.priority <= 3;

    // Handle multiple reasons vs single reason
    const reasonCount = selectedIds.filter(
      (id) => getSpecialCircumstanceById(id) !== null
    ).length;

    if (reasonCount > 1) {
      // Multiple reasons selected
      // Check if any selected reason is Reason 8A (income suspicion)
      const hasReason8A = selectedIds.some((id) => {
        const reason = getSpecialCircumstanceById(id);
        return reason?.officialCodes.includes('5.2.8');
      });

      const forensicAccountantTip = hasReason8A
        ? 'Tip: Family lawyers who specialize in complex income cases may recommend a forensic accountant to investigate. These typically cost $5,000-$15,000 but can uncover hidden income worth 10-50x their fee. Your lawyer will advise if this is appropriate for your case.'
        : undefined;

      return {
        title: isHighPriority
          ? `💰 ${reasonCount} Issues Affecting Fairness Detected`
          : `📋 ${reasonCount} Factors Affecting Fairness`,
        message: isHighPriority
          ? 'The income situation looks complicated—a lawyer can help you request an adjustment. This often increases support by $5,000+/year.'
          : 'Multiple complexity factors apply to your case. A lawyer can help ensure fair assessment.',
        urgency: isHighPriority ? 'high' : 'medium',
        buttonText: 'Talk to a Lawyer About This',
        tip: forensicAccountantTip,
      };
    } else {
      // Single reason - use reason-specific message
      // Sanitize the label to prevent any potential issues
      const sanitizedLabel = mostImportantReason.label.replace(/[<>]/g, '');
      const categoryEmoji =
        mostImportantReason.category === 'income'
          ? '💰'
          : mostImportantReason.category === 'child'
            ? '👶'
            : '🏡';

      // Check if this is a Reason 8A income suspicion case (hidden income)
      const isReason8A = mostImportantReason.officialCodes.includes('5.2.8');
      const forensicAccountantTip = isReason8A
        ? 'Tip: Family lawyers who specialize in complex income cases may recommend a forensic accountant to investigate. These typically cost $5,000-$15,000 but can uncover hidden income worth 10-50x their fee. Your lawyer will advise if this is appropriate for your case.'
        : undefined;

      if (isHighPriority) {
        return {
          title: `${categoryEmoji} URGENT: ${sanitizedLabel}`,
          message:
            'The income situation looks complicated—a lawyer can help you request an adjustment to make it fair. This often makes a $5,000+ difference in annual support.',
          urgency: 'high',
          buttonText: 'Talk to a Lawyer',
          tip: forensicAccountantTip,
        };
      } else {
        return {
          title: `${categoryEmoji} Special Circumstances: ${sanitizedLabel}`,
          message:
            'This situation can be complex—a lawyer knows how to navigate the assessment process to ensure fairness.',
          urgency: 'medium',
          buttonText: 'Get Legal Help',
          tip: forensicAccountantTip,
        };
      }
    }
  }

  // Priority 3: Shared care dispute
  if (flags.sharedCareDispute) {
    return {
      title: 'Care Arrangement in Dispute Zone',
      message:
        'Shared care between 35-65% is often contested. Consider professional advice.',
      urgency: 'medium',
      buttonText: 'Get Guidance',
    };
  }

  // Priority 4: High value cases
  if (flags.highValue) {
    return {
      title: '💰 High-Value Case',
      message: `Your liability is ${formatCurrency(results.finalPaymentAmount)}/year. Cases over $15k benefit from verification.`,
      urgency: 'medium',
      buttonText: 'Request Review',
    };
  }

  return null; // No alert needed
}

// ============================================================================
// Complexity Trap Detection (Lead Generation for Formulas 4, 5, 6)
// ============================================================================

/**
 * Result of complexity trap detection.
 * When trapped, the calculation should be bypassed and a lead CTA shown instead.
 */
export interface ComplexityTrapResult {
  /** Whether this scenario requires a trap (bypass calculation) */
  isTrapped: boolean;
  /** The specific reason for the trap */
  reason?: ComplexityTrapReason;
  /** Human-readable description for UI display */
  displayReason?: string;
}

/**
 * Display reasons for each trap type
 */
const TRAP_DISPLAY_REASONS: Record<ComplexityTrapReason, string> = {
  FORMULA_4_NPC_MULTI_CASE: 'multi-case considerations',
  FORMULA_5_OVERSEAS: 'overseas parent considerations',
  FORMULA_6_DECEASED: 'estate considerations',
};

/**
 * Detects if a scenario requires "Lead Trap" instead of calculation.
 * 
 * Trap conditions (all require NPC to be enabled):
 * - Formula 5 Trap: NPC + a parent is marked as "Living Overseas"
 * - Formula 6 Trap: NPC + a parent is marked as "Deceased"
 * 
 * Formula 4 (NPC + multi-case) is NO LONGER trapped - it calculates normally.
 * 
 * @param nonParentCarer - Non-parent carer info from form state
 * @param hasOtherChildrenA - Whether Parent A has other children (multi-case)
 * @param hasOtherChildrenB - Whether Parent B has other children (multi-case)
 * @returns ComplexityTrapResult indicating if trap applies and why
 */
export function detectComplexityTrap(
  nonParentCarer: NonParentCarerInfo,
  hasOtherChildrenA: boolean,
  hasOtherChildrenB: boolean
): ComplexityTrapResult {
  // No trap if NPC is not enabled - standard Formula 1 or 3
  if (!nonParentCarer.enabled) {
    return { isTrapped: false };
  }

  // Check for Formula 6: Deceased parent (highest priority)
  if (nonParentCarer.hasDeceasedParent) {
    return {
      isTrapped: true,
      reason: 'FORMULA_6_DECEASED',
      displayReason: TRAP_DISPLAY_REASONS.FORMULA_6_DECEASED,
    };
  }

  // Check for Formula 5: Overseas parent
  if (nonParentCarer.hasOverseasParent) {
    return {
      isTrapped: true,
      reason: 'FORMULA_5_OVERSEAS',
      displayReason: TRAP_DISPLAY_REASONS.FORMULA_5_OVERSEAS,
    };
  }

  // Formula 4 (NPC + Multi-case) is NO LONGER trapped
  // It will calculate normally using Formula 4 logic
  
  // No trap - this is Formula 2 or Formula 4 (both calculate normally)
  return { isTrapped: false };
}
