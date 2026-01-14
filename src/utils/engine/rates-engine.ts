/**
 * Rates Engine Module
 *
 * Handles Fixed Annual Rate (FAR) and Minimum Annual Rate (MAR) application logic.
 * This module consolidates all rate eligibility checks and rate application to child liabilities.
 */

import { ChildResult } from '../calculator';
import { AssessmentYear, getYearConstants } from '../child-support-constants';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Input for checking rate eligibility for a parent
 */
export interface RateEligibilityInput {
  ATI: number;
  SSA: number;
  MAX_PPS: number;
  receivesSupport: boolean;
  /** Care percentages for each assessable child (not 18+) */
  carePercentages: number[];
  /** Other parent's care percentages for each assessable child */
  otherParentCarePercentages: number[];
}

/**
 * Result of rate application for a single parent
 */
export interface RateApplicationResult {
  marApplies: boolean;
  farApplies: boolean;
  marAmount: number;
  farAmount: number;
  appliedRates: string[];
  rateApplied: string;
}

/**
 * Input for applying rates to all children
 */
export interface ApplyRatesInput {
  childResults: ChildResult[];
  eligibilityA: RateEligibilityInput;
  eligibilityB: RateEligibilityInput;
  selectedYear: AssessmentYear;
  assessableChildCount: number;
}

/**
 * Result of applying rates to all children
 */
export interface ApplyRatesResult {
  childResults: ChildResult[];
  finalLiabilityA: number;
  finalLiabilityB: number;
  FAR_A: number;
  FAR_B: number;
  MAR_A: number;
  MAR_B: number;
  rateApplied: string;
  appliedRates: string[];
}

// ============================================================================
// Eligibility Check Functions
// ============================================================================

/**
 * Check if Minimum Annual Rate (MAR) applies for a parent.
 *
 * MAR criteria (all must be true):
 * 1. Parent received income support payment
 * 2. Parent has less than 14% care of ALL assessable children (not 18+)
 * 3. Parent's ATI is below the self-support amount
 *
 * @param input - Rate eligibility input
 * @returns true if MAR applies, false otherwise
 */
export function checkMARApplies(input: RateEligibilityInput): boolean {
  const { ATI, SSA, receivesSupport, carePercentages } = input;

  // Must receive income support
  if (!receivesSupport) {
    return false;
  }

  // ATI must be below SSA
  if (ATI >= SSA) {
    return false;
  }

  // Must have assessable children
  if (carePercentages.length === 0) {
    return false;
  }

  // Must have less than 14% care of ALL assessable children
  const hasLowCareForAll = carePercentages.every((care) => care < 14);

  return hasLowCareForAll;
}

/**
 * Check if Fixed Annual Rate (FAR) applies for a parent for a specific child.
 *
 * FAR criteria (all must be true):
 * 1. Parent has ATI below MAX_PPS
 * 2. Parent does not receive income support
 * 3. Other parent has 66%+ care of this child
 *
 * @param input - Rate eligibility input
 * @param childIndex - Index of the child to check
 * @returns true if FAR applies for this child, false otherwise
 */
export function checkFARApplies(
  input: RateEligibilityInput,
  childIndex: number
): boolean {
  const { ATI, MAX_PPS, receivesSupport, otherParentCarePercentages } = input;

  // ATI must be below MAX_PPS
  if (ATI >= MAX_PPS) {
    return false;
  }

  // Must NOT receive income support
  if (receivesSupport) {
    return false;
  }

  // Parent must have less than 35% care of this specific child
  // (In NPC cases, the other parent might also have 0% care, so checking other parent's care >= 66% is incorrect)
  const carePercentage = input.carePercentages[childIndex];
  if (carePercentage === undefined || carePercentage >= 35) {
    return false;
  }

  return true;
}

// ============================================================================
// Rate Application Function
// ============================================================================

/**
 * Apply FAR/MAR rates to all children and calculate final liabilities.
 *
 * This function:
 * 1. Checks MAR eligibility at case level (once per parent)
 * 2. Checks FAR eligibility per child (up to 3 children max)
 * 3. Updates child results with applied rates
 * 4. Calculates final liabilities for each parent
 *
 * @param input - Apply rates input
 * @returns Apply rates result with updated child results and liabilities
 */
export function applyRatesToChildren(input: ApplyRatesInput): ApplyRatesResult {
  const {
    childResults,
    eligibilityA,
    eligibilityB,
    selectedYear,
    assessableChildCount,
  } = input;

  const { FAR, MAR } = getYearConstants(selectedYear);

  // Initialize result values
  let FAR_A = 0;
  let FAR_B = 0;
  let MAR_A = 0;
  let MAR_B = 0;
  let finalLiabilityA = 0;
  let finalLiabilityB = 0;
  const appliedRates: string[] = [];

  // Filter to assessable children only (not 18+)
  const assessableChildResults = childResults.filter((c) => !c.isAdultChild);

  // Check MAR eligibility at case level (once per parent)
  const marAppliesA = checkMARApplies(eligibilityA);
  const marAppliesB = checkMARApplies(eligibilityB);

  if (marAppliesA) {
    MAR_A = MAR;
    appliedRates.push('MAR (Parent A)');
  }

  if (marAppliesB) {
    MAR_B = MAR;
    appliedRates.push('MAR (Parent B)');
  }

  // Apply rates to each child
  assessableChildResults.forEach((child, index) => {
    let liabilityA = child.liabilityA;
    let liabilityB = child.liabilityB;
    let farAppliedA = false;
    let farAppliedB = false;
    let marAppliedA = false;
    let marAppliedB = false;

    // Apply MAR or FAR for Parent A
    if (marAppliesA) {
      // MAR is paid once per case, divide by total assessable children for per-child breakdown
      liabilityA = MAR / assessableChildCount;
      marAppliedA = true;
    } else if (checkFARApplies(eligibilityA, index)) {
      // FAR is paid per child (up to 3 children max)
      if (FAR_A / FAR < 3) {
        FAR_A += FAR;
        liabilityA = FAR;
        appliedRates.push(`FAR (Parent A, Child ${index + 1})`);
        farAppliedA = true;
      }
    }

    // Apply MAR or FAR for Parent B
    if (marAppliesB) {
      // MAR is paid once per case, divide by total assessable children for per-child breakdown
      liabilityB = MAR / assessableChildCount;
      marAppliedB = true;
    } else if (checkFARApplies(eligibilityB, index)) {
      // FAR is paid per child (up to 3 children max)
      if (FAR_B / FAR < 3) {
        FAR_B += FAR;
        liabilityB = FAR;
        appliedRates.push(`FAR (Parent B, Child ${index + 1})`);
        farAppliedB = true;
      }
    }

    // Update child result with final liability and rate flags
    child.finalLiabilityA = liabilityA;
    child.finalLiabilityB = liabilityB;
    child.farAppliedA = farAppliedA;
    child.farAppliedB = farAppliedB;
    child.marAppliedA = marAppliedA;
    child.marAppliedB = marAppliedB;

    // Accumulate final liabilities
    finalLiabilityA += liabilityA;
    finalLiabilityB += liabilityB;
  });

  // Determine rate applied string
  let rateApplied = 'None';

  if (appliedRates.length > 0) {
    const farA = appliedRates.filter((r) =>
      r.startsWith('FAR (Parent A')
    ).length;
    const farB = appliedRates.filter((r) =>
      r.startsWith('FAR (Parent B')
    ).length;
    const hasMarA = appliedRates.some((r) => r.startsWith('MAR (Parent A'));
    const hasMarB = appliedRates.some((r) => r.startsWith('MAR (Parent B'));

    if (farA > 0 && farB > 0) {
      rateApplied = 'FAR (Both Parents)';
    } else if (farA > 0) {
      rateApplied = `FAR (Parent A, ${farA} child${farA > 1 ? 'ren' : ''})`;
    } else if (farB > 0) {
      rateApplied = `FAR (Parent B, ${farB} child${farB > 1 ? 'ren' : ''})`;
    } else if (hasMarA && hasMarB) {
      rateApplied = 'MAR (Both Parents)';
    } else if (hasMarA) {
      rateApplied = 'MAR (Parent A)';
    } else if (hasMarB) {
      rateApplied = 'MAR (Parent B)';
    }
  }

  return {
    childResults,
    finalLiabilityA,
    finalLiabilityB,
    FAR_A,
    FAR_B,
    MAR_A,
    MAR_B,
    rateApplied,
    appliedRates,
  };
}
