import type { CalculationResults } from "../types/calculator";
import { MAX_PPS } from "./child-support-constants";

/**
 * Represents a specific scenario that causes a $0 payment in child support assessments
 */
export interface ZeroPaymentScenario {
  type:
    | "care_threshold"
    | "balanced_percentages"
    | "both_low_care"
    | "mar_prevented_by_care"
    | "zero_income"
    | "none";
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
    return { type: "none", title: "", explanation: "" };
  }

  // Priority 1: Zero Combined Income
  if (results.CCSI === 0) {
    return {
      type: "zero_income",
      title: "Why No Payment?",
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
    const parent = marPreventedA ? "Parent A" : "Parent B";
    const careDetails = marPreventedA
      ? results.childResults
          .filter((c) => c.roundedCareA >= 14)
          .map((c, idx) => `Child ${idx + 1}: ${c.roundedCareA}% care`)
          .join(", ")
      : results.childResults
          .filter((c) => c.roundedCareB >= 14)
          .map((c, idx) => `Child ${idx + 1}: ${c.roundedCareB}% care`)
          .join(", ");

    return {
      type: "mar_prevented_by_care",
      title: "Why No Payment?",
      explanation: `${parent} has very low income and receives income support, but because they have 14% or more care of at least one child, the Minimum Annual Rate doesn't apply. Their care time means they're already contributing by covering costs directly during care, and their income is too low to require additional payment.`,
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
      type: "both_low_care",
      title: "Why No Payment?",
      explanation:
        "Both parents have less than 35% care of the children. To be eligible to receive child support, a parent must have at least 35% care. Since neither parent meets this threshold, no payment is required.",
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
      type: "balanced_percentages",
      title: "Why No Payment?",
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
      type: "care_threshold",
      title: "Why No Payment?",
      explanation:
        "To be eligible to receive child support, a parent must have at least 35% care of the child. When a parent has a child support percentage but the other parent has less than 35% care, no payment is required because the receiving parent doesn't meet the minimum care threshold.",
    };
  }

  // Fallback: Should not reach here, but return generic explanation
  return {
    type: "none",
    title: "Why No Payment?",
    explanation:
      "No child support payment is required based on the current income and care arrangements.",
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
    .filter(c => c.farAppliedA).length;

  const farAppliedCountB = results.childResults
    .slice(0, childIndex)
    .filter(c => c.farAppliedB).length;

  // If eligible for FAR but not applied, and 3 or more children before this one had FAR applied
  const farLimitReachedA = parentAEligibleForFar && !child.farAppliedA && farAppliedCountA >= 3;
  const farLimitReachedB = parentBEligibleForFar && !child.farAppliedB && farAppliedCountB >= 3;

  return farLimitReachedA || farLimitReachedB;
}
