import type { CalculationResults } from '../utils/calculator';
import { MAX_PPS } from './child-support-constants';

/**
 * Represents a specific scenario that causes a $0 payment in child support assessments
 */
export interface ZeroPaymentScenario {
  type:
  | 'care_threshold'
  | 'balanced_percentages'
  | 'both_low_care'
  | 'mar_prevented_by_care'
  | 'zero_income'
  | 'none';
  title: string;
  explanation: string;
  details?: {
    parentADetails?: string;
    parentBDetails?: string;
  };
}

/**
 * Detects the specific scenario causing a $0 payment and returns
 * appropriate explanation text for user education.
 *
 * Scenarios are checked in priority order from most specific to most general:
 * 1. Zero combined income (most fundamental)
 * 2. MAR prevented by care threshold (specific edge case)
 * 3. Both parents below 35% care (structural issue)
 * 4. Balanced percentages (explains mutual cancellation)
 * 5. 35% care threshold not met (most common case)
 *
 * @param results - The calculation results from the child support assessment
 * @param formState - Form state containing income support flags
 * @returns A ZeroPaymentScenario object with explanation text
 */
export function detectZeroPaymentScenario(
  results: CalculationResults,
  formState: { supportA: boolean; supportB: boolean }
): ZeroPaymentScenario {
  // Guard: If there's actually a payment, return 'none'
  if (results.finalPaymentAmount > 0) {
    return { type: 'none', title: '', explanation: '' };
  }

  // Priority 1: Zero Combined Income
  if (results.CCSI === 0) {
    return {
      type: 'zero_income',
      title: 'Why No Payment?',
      explanation:
        "Both parents have zero child support income after deductions (self-support amount and relevant dependent allowances). When there's no combined income to assess, no child support payment is required.",
    };
  }

  // Priority 2: MAR Almost Applied But Didn't
  // Check if parent has low income + on support, but has ≥14% care preventing MAR
  const marPreventedA =
    results.ATI_A < results.SSA &&
    formState.supportA &&
    results.childResults.some((c) => c.roundedCareA >= 14) &&
    !results.childResults.some((c) => c.marAppliedA);

  const marPreventedB =
    results.ATI_B < results.SSA &&
    formState.supportB &&
    results.childResults.some((c) => c.roundedCareB >= 14) &&
    !results.childResults.some((c) => c.marAppliedB);

  if (marPreventedA || marPreventedB) {
    const parent = marPreventedA ? 'Parent A' : 'Parent B';
    const careDetails = marPreventedA
      ? results.childResults
        .filter((c) => c.roundedCareA >= 14)
        .map((c, idx) => `Child ${idx + 1}: ${c.roundedCareA}% care`)
        .join(', ')
      : results.childResults
        .filter((c) => c.roundedCareB >= 14)
        .map((c, idx) => `Child ${idx + 1}: ${c.roundedCareB}% care`)
        .join(', ');

    return {
      type: 'mar_prevented_by_care',
      title: 'Why No Payment?',
      explanation: `${parent} is exempt from the Minimum Annual Rate because they provide at least 14% care for a child. As their income is below the self-support threshold, their direct care is deemed a sufficient contribution, resulting in a $0 liability.`,
      details: marPreventedA
        ? { parentADetails: careDetails }
        : { parentBDetails: careDetails },
    };
  }

  // Priority 3: Both Parents Below 35% Care
  const allChildrenBothLowCare = results.childResults.every(
    (c) => c.roundedCareA < 35 && c.roundedCareB < 35
  );

  if (allChildrenBothLowCare) {
    return {
      type: 'both_low_care',
      title: 'Why No Payment?',
      explanation:
        'Both parents have less than 35% care of the children. To be eligible to receive child support, a parent must have at least 35% care. Since neither parent meets this threshold, no payment is required.',
    };
  }

  // Priority 4: Balanced/Equal Percentages
  // Check if child support percentages are near-zero for both
  const allChildrenBalanced = results.childResults.every(
    (c) =>
      Math.abs(c.childSupportPercA) < 1 && Math.abs(c.childSupportPercB) < 1
  );

  if (allChildrenBalanced) {
    return {
      type: 'balanced_percentages',
      title: 'Why No Payment?',
      explanation:
        "Both parents' income and care contributions are balanced, resulting in equal child support percentages. When both parents have similar obligations, no payment is required from either parent.",
    };
  }

  // Priority 5: 35% Care Threshold Not Met (most common)
  const hasPayerWithLowCareReceiver = results.childResults.some((c) => {
    const aHasPositive = c.childSupportPercA > 0;
    const bHasPositive = c.childSupportPercB > 0;
    return (
      (aHasPositive && c.roundedCareB < 35) ||
      (bHasPositive && c.roundedCareA < 35)
    );
  });

  if (hasPayerWithLowCareReceiver) {
    return {
      type: 'care_threshold',
      title: 'Why No Payment?',
      explanation:
        "To be eligible to receive child support, a parent must have at least 35% care of the child. When a parent has a child support percentage but the other parent has less than 35% care, no payment is required because the receiving parent doesn't meet the minimum care threshold.",
    };
  }

  // Fallback: Should not reach here, but return generic explanation
  return {
    type: 'none',
    title: 'Why No Payment?',
    explanation:
      'No child support payment is required based on the current income and care arrangements.',
  };
}

/**
 * Checks if a child with no payment would have been eligible for FAR
 * but wasn't applied due to the 3-child limit being reached.
 *
 * @param childIndex - The index of the child to check
 * @param results - The calculation results
 * @param formState - Form state containing income support flags
 * @returns true if the child is beyond the FAR limit
 */
export function isFarLimitReached(
  childIndex: number,
  results: CalculationResults,
  formState: { supportA: boolean; supportB: boolean }
): boolean {
  const child = results.childResults[childIndex];

  // Child must have no payment
  if (child.finalLiabilityA > 0 || child.finalLiabilityB > 0) {
    return false;
  }

  // Check if Parent A would be eligible for FAR but it wasn't applied
  const parentAEligibleForFar =
    results.ATI_A < MAX_PPS && // Income below threshold
    !formState.supportA && // Not on income support
    child.roundedCareB >= 66; // Other parent has at least 66% care (Parent A has < 35%)

  // Check if Parent B would be eligible for FAR but it wasn't applied
  const parentBEligibleForFar =
    results.ATI_B < MAX_PPS && // Income below threshold
    !formState.supportB && // Not on income support
    child.roundedCareA >= 66; // Other parent has at least 66% care (Parent B has < 35%)

  // Check if FAR was applied to earlier children (counting how many have FAR applied)
  const farAppliedCountA = results.childResults
    .slice(0, childIndex)
    .filter((c) => c.farAppliedA).length;

  const farAppliedCountB = results.childResults
    .slice(0, childIndex)
    .filter((c) => c.farAppliedB).length;

  // If eligible for FAR but not applied, and 3 or more children before this one had FAR applied
  const farLimitReachedA =
    parentAEligibleForFar && !child.farAppliedA && farAppliedCountA >= 3;
  const farLimitReachedB =
    parentBEligibleForFar && !child.farAppliedB && farAppliedCountB >= 3;

  return farLimitReachedA || farLimitReachedB;
}

/**
 * Detects if the "Low Assessment" trigger should be shown for the user.
 * This covers when the other parent (Parent B) is paying a fixed/minimum rate,
 * OR when such a rate WOULD have applied but was negated by care arrangements.
 *
 * The user is the "Receiver" (collecting child support) and the other parent
 * has low income that triggered or would have triggered MAR/FAR.
 *
 * Edge cases covered:
 * 1. MAR is actually applied (Parent B pays MAR)
 * 2. FAR is actually applied (Parent B pays FAR)
 * 3. MAR would apply but is negated by ≥14% care of a child
 * 4. FAR would apply but liability is reversed or negated by care arrangements
 *
 * @param results - The calculation results
 * @param formState - Form state containing income support flags
 * @returns Object with isLowAssessment flag and reason
 */
export function detectLowAssessmentTrigger(
  results: CalculationResults,
  formState: { supportA: boolean; supportB: boolean }
): { isLowAssessment: boolean; reason: string } {
  // The user is Parent A, so we check if the OTHER PARENT (Parent B) triggers low assessment

  // Case 1: MAR is actually applied to Parent B (other parent paying minimum rate)
  const hasMarAppliedB = results.childResults.some((c) => c.marAppliedB);
  if (hasMarAppliedB && results.payer === 'Parent B') {
    return {
      isLowAssessment: true,
      reason: 'Other parent is paying the Minimum Annual Rate',
    };
  }

  // Case 2: FAR is actually applied to Parent B (other parent paying fixed rate)
  const hasFarAppliedB = results.childResults.some((c) => c.farAppliedB);
  if (hasFarAppliedB && results.payer === 'Parent B') {
    return {
      isLowAssessment: true,
      reason: 'Other parent is paying the Fixed Annual Rate',
    };
  }

  // Case 3: MAR WOULD apply to Parent B but is negated by ≥14% care
  // Criteria for MAR: ATI < SSA, on income support, and <14% care of ALL children
  // If they have ≥14% care of ANY child, MAR is prevented
  const marWouldApplyB =
    results.ATI_B < results.SSA && // Low income
    formState.supportB && // On income support
    results.childResults.some((c) => c.roundedCareB >= 14); // Has ≥14% care (preventing MAR)

  // Also check that MAR was NOT actually applied (it was prevented)
  const marPreventedByCareBCareThreshold =
    marWouldApplyB && !results.childResults.some((c) => c.marAppliedB);

  if (marPreventedByCareBCareThreshold) {
    return {
      isLowAssessment: true,
      reason:
        "Other parent's liability is $0 due to care threshold, but they have low income that would otherwise trigger a minimum rate",
    };
  }

  // Case 4: FAR conditions exist for Parent B but liability is $0 due to care reversal
  // FAR criteria: ATI < MAX_PPS, NOT on income support, and other parent (A) has ≥66% care
  // But if Parent B also has ≥65% care of another child AND Parent A is not on support,
  // then Parent A would owe FAR to Parent B, potentially reversing/negating the liability

  // Check if Parent B meets FAR eligibility criteria for any child
  const farEligibleB =
    results.ATI_B < results.MAX_PPS && // Low income (below MAX_PPS)
    !formState.supportB; // Not on income support

  // Check if there are children where Parent A has ≥66% care (Parent B would owe FAR)
  const childrenWhereBWouldOweFar = results.childResults.filter(
    (c) => c.roundedCareA >= 66
  );

  // Check if there are children where Parent B has ≥65% care (Parent A might owe FAR back)
  const childrenWhereAMightOweFar = results.childResults.filter(
    (c) => c.roundedCareB >= 65
  );

  // If Parent B is FAR-eligible, has children where they'd owe FAR,
  // but liability is $0 or Parent A is actually paying,
  // this suggests FAR was reversed/negated
  if (
    farEligibleB &&
    childrenWhereBWouldOweFar.length > 0 &&
    (results.finalPaymentAmount === 0 || results.payer === 'Parent A')
  ) {
    // Additional check: is there a reversal scenario?
    // Parent A must also be FAR-eligible for reversal
    const parentAFarEligible =
      results.ATI_A < results.MAX_PPS && !formState.supportA;

    if (parentAFarEligible && childrenWhereAMightOweFar.length > 0) {
      return {
        isLowAssessment: true,
        reason:
          'Fixed rate liabilities have cancelled out due to care arrangements, but the other parent has low income',
      };
    }
  }

  // Case 5: Check if result uses FAR or MAR string (covers any edge case with rateApplied)
  // AND user is receiver (Parent B is payer)
  if (
    results.payer === 'Parent B' &&
    (results.rateApplied.includes('FAR') || results.rateApplied.includes('MAR'))
  ) {
    return {
      isLowAssessment: true,
      reason: 'Other parent is paying a standard formula limit rate',
    };
  }

  return { isLowAssessment: false, reason: '' };
}
