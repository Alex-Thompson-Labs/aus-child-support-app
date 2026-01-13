/**
 * Income Calculator Module
 *
 * Handles all income-related calculations for child support:
 * - Child Support Income (CSI) calculation
 * - Relevant dependent deductibles
 * - Multi-case allowances
 * - Income percentages
 *
 * @module income-calculator
 */

import { AgeRange, RelevantDependents } from './calculator';
import { calculateMultiCaseAllowance, getChildCost } from './child-support-calculations';
import { AssessmentYear, getYearConstants } from './child-support-constants';

// ============================================================================
// Interfaces
// ============================================================================

/**
 * Input for income calculations.
 */
export interface IncomeCalculationInput {
  /** Parent A's Adjusted Taxable Income */
  incomeA: number;
  /** Parent B's Adjusted Taxable Income */
  incomeB: number;
  /** Parent A's relevant dependents */
  relDepA: RelevantDependents;
  /** Parent B's relevant dependents */
  relDepB: RelevantDependents;
  /** Parent A's children in other child support cases */
  multiCaseChildrenA: { age: number }[];
  /** Parent B's children in other child support cases */
  multiCaseChildrenB: { age: number }[];
  /** Children in the current case */
  currentCaseChildren: { age: number }[];
  /** Assessment year for constants lookup */
  selectedYear: AssessmentYear;
}

/**
 * Result of income calculations.
 */
export interface IncomeCalculationResult {
  /** Parent A's Adjusted Taxable Income */
  ATI_A: number;
  /** Parent B's Adjusted Taxable Income */
  ATI_B: number;
  /** Parent A's relevant dependent deductible */
  relDepDeductibleA: number;
  /** Parent B's relevant dependent deductible */
  relDepDeductibleB: number;
  /** Parent A's preliminary CSI (before multi-case allowance) */
  preliminaryCSI_A: number;
  /** Parent B's preliminary CSI (before multi-case allowance) */
  preliminaryCSI_B: number;
  /** Parent A's Child Support Income */
  CSI_A: number;
  /** Parent B's Child Support Income */
  CSI_B: number;
  /** Combined Child Support Income */
  CCSI: number;
  /** Parent A's income percentage */
  incomePercA: number;
  /** Parent B's income percentage */
  incomePercB: number;
  /** Parent A's multi-case allowance */
  multiCaseAllowanceA: number;
  /** Parent B's multi-case allowance */
  multiCaseAllowanceB: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Creates virtual children for relevant dependents calculation.
 *
 * Virtual children have 0% care since they're only used for cost calculation.
 * Uses representative ages: 6 for under 13, 14 for 13+.
 *
 * @param relDep - Relevant dependents counts
 * @returns Array of virtual children with age ranges and zero care
 */
export function createVirtualDependentChildren(
  relDep: RelevantDependents
): { age: number; ageRange: AgeRange; careA: number; careB: number }[] {
  const children: { age: number; ageRange: AgeRange; careA: number; careB: number }[] = [];

  // Add under-13 virtual children (representative age: 6)
  for (let i = 0; i < relDep.u13; i++) {
    children.push({
      age: 6,
      ageRange: 'Under 13' as AgeRange,
      careA: 0,
      careB: 0,
    });
  }

  // Add 13+ virtual children (representative age: 14)
  for (let i = 0; i < relDep.plus13; i++) {
    children.push({
      age: 14,
      ageRange: '13+' as AgeRange,
      careA: 0,
      careB: 0,
    });
  }

  return children;
}

/**
 * Calculates Child Support Income (CSI) for a parent.
 *
 * Formula: CSI = max(0, ATI - SSA - relDepDeductible - multiCaseAllowance)
 *
 * @param ATI - Adjusted Taxable Income
 * @param SSA - Self-Support Amount
 * @param relDepDeductible - Relevant dependent deductible
 * @param multiCaseAllowance - Multi-case allowance (Formula 3)
 * @returns Child Support Income (minimum 0)
 */
export function calculateCSI(
  ATI: number,
  SSA: number,
  relDepDeductible: number,
  multiCaseAllowance: number
): number {
  return Math.max(0, ATI - SSA - relDepDeductible - multiCaseAllowance);
}

/**
 * Calculates income percentages from CSI values.
 *
 * Each parent's income percentage is their share of the Combined CSI.
 * If CCSI is 0, both percentages are 0.
 *
 * @param CSI_A - Parent A's Child Support Income
 * @param CSI_B - Parent B's Child Support Income
 * @returns Object with income percentages for both parents
 */
export function calculateIncomePercentages(
  CSI_A: number,
  CSI_B: number
): { incomePercA: number; incomePercB: number } {
  const CCSI = CSI_A + CSI_B;

  if (CCSI <= 0) {
    return { incomePercA: 0, incomePercB: 0 };
  }

  return {
    incomePercA: (CSI_A / CCSI) * 100,
    incomePercB: (CSI_B / CCSI) * 100,
  };
}

// ============================================================================
// Main Function
// ============================================================================

/**
 * Calculates all income-related values for child support assessment.
 *
 * This function performs the following steps:
 * 1. Creates virtual children for relevant dependents
 * 2. Calculates relevant dependent deductibles
 * 3. Calculates multi-case allowances (Formula 3)
 * 4. Calculates preliminary CSI (before multi-case allowance)
 * 5. Calculates final CSI
 * 6. Calculates Combined CSI (CCSI)
 * 7. Calculates income percentages
 *
 * @param input - Income calculation input parameters
 * @returns Complete income calculation results
 */
export function calculateIncomes(input: IncomeCalculationInput): IncomeCalculationResult {
  const {
    incomeA,
    incomeB,
    relDepA,
    relDepB,
    multiCaseChildrenA,
    multiCaseChildrenB,
    currentCaseChildren,
    selectedYear,
  } = input;

  // Get year-specific constants
  const { SSA } = getYearConstants(selectedYear);

  // ATI values
  const ATI_A = incomeA;
  const ATI_B = incomeB;

  // Step 1: Create virtual children for relevant dependents
  const relDepChildrenA = createVirtualDependentChildren(relDepA);
  const relDepChildrenB = createVirtualDependentChildren(relDepB);

  // Step 2: Calculate relevant dependent deductibles
  // Uses the cost of children formula with parent's income minus SSA
  const relDepDeductibleA = getChildCost(
    selectedYear,
    relDepChildrenA,
    Math.max(0, ATI_A - SSA)
  ).cost;

  const relDepDeductibleB = getChildCost(
    selectedYear,
    relDepChildrenB,
    Math.max(0, ATI_B - SSA)
  ).cost;

  // Step 2a: Calculate raw CSI for multi-case allowance calculation
  const rawCSI_A = Math.max(0, ATI_A - SSA);
  const rawCSI_B = Math.max(0, ATI_B - SSA);

  // Step 3: Calculate multi-case allowances (Formula 3)
  const multiCaseAllowanceA = calculateMultiCaseAllowance(
    selectedYear,
    rawCSI_A,
    currentCaseChildren,
    multiCaseChildrenA.map((c) => ({ id: `mc-a-${c.age}`, age: c.age }))
  );

  const multiCaseAllowanceB = calculateMultiCaseAllowance(
    selectedYear,
    rawCSI_B,
    currentCaseChildren,
    multiCaseChildrenB.map((c) => ({ id: `mc-b-${c.age}`, age: c.age }))
  );

  // Step 4: Calculate preliminary CSI (before multi-case allowance)
  // Used for Solo Cost calculation in Multi-Case Cap
  const preliminaryCSI_A = Math.max(0, ATI_A - SSA - relDepDeductibleA);
  const preliminaryCSI_B = Math.max(0, ATI_B - SSA - relDepDeductibleB);

  // Step 5: Calculate final CSI
  // CSI = ATI - SSA - relDepDeductible - multiCaseAllowance
  const CSI_A = calculateCSI(ATI_A, SSA, relDepDeductibleA, multiCaseAllowanceA);
  const CSI_B = calculateCSI(ATI_B, SSA, relDepDeductibleB, multiCaseAllowanceB);

  // Step 6: Calculate Combined CSI
  const CCSI = CSI_A + CSI_B;

  // Step 7: Calculate income percentages
  const { incomePercA, incomePercB } = calculateIncomePercentages(CSI_A, CSI_B);

  return {
    ATI_A,
    ATI_B,
    relDepDeductibleA,
    relDepDeductibleB,
    preliminaryCSI_A,
    preliminaryCSI_B,
    CSI_A,
    CSI_B,
    CCSI,
    incomePercA,
    incomePercB,
    multiCaseAllowanceA,
    multiCaseAllowanceB,
  };
}
