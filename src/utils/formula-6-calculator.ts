/**
 * Formula 6 Calculator: Non-Parent Carer with One Parent Deceased
 * 
 * Applied when:
 * - Non-parent carer applies for assessment
 * - One parent is deceased (Section 40 of Child Support Assessment Act 1989)
 * 
 * Key principle: Uses only surviving parent's income (deceased parent has no capacity).
 * Similar to Formula 5 but WITHOUT income doubling/halving.
 * 
 * Calculation method:
 * 1. Calculate surviving parent's CSI (ATI - SSA - multi-case allowance)
 * 2. Use single income (NOT doubled) to calculate costs
 * 3. Apply care percentages to determine parent's cost share
 * 4. Calculate annual rate (NOT halved)
 * 5. Apply multi-case cap if applicable
 * 6. Distribute payment to carers if multiple
 * 
 * Source: Child Support Guide 2.2.7
 * https://guides.dss.gov.au/child-support-guide/2/2/7
 */

import type { AgeRange, OtherCaseChild } from './calculator';
import { deriveAgeRangeMemoized } from './calculator';
import { mapCareToCostPercent, roundCarePercentage } from './care-utils';
import {
    calculateMultiCaseAllowance,
    calculateMultiCaseCap,
    getChildCost,
} from './child-support-calculations';
import type { AssessmentYear } from './child-support-constants';
import { getYearConstants } from './child-support-constants';

// ============================================================================
// Types
// ============================================================================

export interface Formula6Input {
  /** Surviving parent's Adjusted Taxable Income */
  survivingParentATI: number;
  /** Surviving parent's care percentage (0-100) */
  survivingParentCarePercentage: number;
  /** Children in this case (with specific ages) */
  children: { age: number }[];
  /** Whether surviving parent has children in other cases */
  hasMultipleCases: boolean;
  /** Children in other cases (for multi-case allowance) */
  otherCaseChildren?: OtherCaseChild[];
  /** Number of non-parent carers (1 or 2) */
  numberOfNonParentCarers: 1 | 2;
  /** First carer's care percentage (if 2 carers) */
  carer1CarePercentage?: number;
  /** Second carer's care percentage (if 2 carers) */
  carer2CarePercentage?: number;
  /** Assessment year */
  selectedYear: AssessmentYear;
}

export interface Formula6Result {
  formulaUsed: 6;
  
  // Income calculations
  survivingParentATI: number;
  survivingParentCSI: number;
  
  // Multi-case adjustments
  multiCaseAllowance: number;
  adjustedCSI: number;
  
  // Cost calculations
  cotc: number;
  parentCarePercentage: number;
  parentCostPercentage: number;
  parentCostShare: number;
  
  // Rate calculations (NO doubling/halving for Formula 6)
  annualRate: number;
  monthlyRate: number;
  fortnightlyRate: number;
  
  // Multi-case cap
  multiCaseCap?: number;
  multiCaseCapApplied: boolean;
  
  // Payment distribution (if 2 carers)
  paymentToCarer1?: number;
  paymentToCarer2?: number;
  
  // Child-level breakdown
  childResults: Formula6ChildResult[];
}

export interface Formula6ChildResult {
  age: number;
  ageRange: AgeRange;
  costPerChild: number;
  isAdultChild: boolean;
}

// ============================================================================
// Validation
// ============================================================================

export interface Formula6ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFormula6Input(data: Formula6Input): Formula6ValidationResult {
  if (data.survivingParentATI < 0) {
    return { valid: false, error: 'Income cannot be negative' };
  }
  
  if (data.survivingParentCarePercentage < 0 || data.survivingParentCarePercentage > 100) {
    return { valid: false, error: 'Care percentage must be between 0 and 100' };
  }
  
  if (data.children.length === 0) {
    return { valid: false, error: 'At least one child is required' };
  }
  
  if (data.numberOfNonParentCarers === 2) {
    const total = (data.carer1CarePercentage || 0) + (data.carer2CarePercentage || 0);
    if (Math.abs(total - 100) > 0.01) {
      return { valid: false, error: 'Care percentages must total 100% for two carers' };
    }
  }
  
  return { valid: true };
}

// ============================================================================
// Main Calculation Function
// ============================================================================

/**
 * Calculates Formula 6 child support assessment.
 * 
 * Steps:
 * 1. Calculate surviving parent's CSI (ATI - SSA - multi-case allowance)
 * 2. Use single income (NOT doubled) to calculate costs
 * 3. Apply care percentages to determine parent's cost share
 * 4. Calculate annual rate (NOT halved)
 * 5. Apply multi-case cap if applicable
 * 6. Distribute payment to carers if multiple
 * 
 * Key differences from Formula 5:
 * - NO income doubling (deceased parent has no capacity)
 * - NO halving of final rate
 * - Same multi-case and two-NPC logic
 * 
 * @param input Formula 6 calculation inputs
 * @returns Complete Formula 6 calculation results
 */
export function calculateFormula6(input: Formula6Input): Formula6Result {
  // Validate input
  const validation = validateFormula6Input(input);
  if (!validation.valid) {
    throw new Error(`Formula 6 validation failed: ${validation.error}`);
  }
  
  const { SSA } = getYearConstants(input.selectedYear);
  
  // Step 1: Calculate surviving parent's Child Support Income
  const preliminaryCSI = Math.max(0, input.survivingParentATI - SSA);
  
  // Step 1a: Calculate multi-case allowance if applicable
  let multiCaseAllowance = 0;
  if (input.hasMultipleCases && input.otherCaseChildren && input.otherCaseChildren.length > 0) {
    multiCaseAllowance = calculateMultiCaseAllowance(
      input.selectedYear,
      preliminaryCSI,
      input.children,
      input.otherCaseChildren
    );
  }
  
  // Adjusted CSI after multi-case allowance
  const survivingParentCSI = Math.max(0, preliminaryCSI - multiCaseAllowance);
  
  // Step 2: Determine parent's care and cost percentages
  const roundedCarePercentage = roundCarePercentage(input.survivingParentCarePercentage);
  const costPercentage = mapCareToCostPercent(roundedCarePercentage);
  
  // Step 3: Calculate costs of children using SINGLE income (NOT doubled)
  // Filter out adult children (18+) - they're excluded from standard assessment
  const assessableChildren = input.children
    .filter(c => c.age < 18)
    .map(c => ({
      age: c.age,
      ageRange: deriveAgeRangeMemoized(c.age),
      careA: 0, // Not used in Formula 6
      careB: 0, // Not used in Formula 6
    }));
  
  const { cost: cotc } = getChildCost(
    input.selectedYear,
    assessableChildren,
    survivingParentCSI // Use single income (NOT doubled)
  );
  
  const costPerChild = assessableChildren.length > 0 ? cotc / assessableChildren.length : 0;
  
  // Step 4: Calculate parent's cost share
  const parentCostShare = (costPercentage / 100) * cotc;
  
  // Step 5: Calculate annual rate (NOT halved)
  const annualRate = cotc - parentCostShare;
  
  // Step 6: Apply multi-case cap if applicable
  let finalAnnualRate = annualRate;
  let multiCaseCap: number | undefined;
  let multiCaseCapApplied = false;
  
  if (input.hasMultipleCases && assessableChildren.length > 0) {
    // Calculate solo child cost for cap
    // Use first child as representative (all same age in solo calculation)
    const soloChild = assessableChildren[0];
    const { cost: soloCost } = getChildCost(
      input.selectedYear,
      [soloChild],
      survivingParentCSI // Use single income for solo cost
    );
    
    // Cap = solo cost × (100% - parent's cost percentage)
    multiCaseCap = calculateMultiCaseCap(soloCost, costPercentage);
    
    if (annualRate > multiCaseCap) {
      finalAnnualRate = multiCaseCap;
      multiCaseCapApplied = true;
    }
  }
  
  // Step 7: Calculate periodic rates
  const monthlyRate = finalAnnualRate / 12;
  const fortnightlyRate = finalAnnualRate / 26;
  
  // Step 8: Distribute to carers if multiple
  let paymentToCarer1: number | undefined;
  let paymentToCarer2: number | undefined;
  
  if (input.numberOfNonParentCarers === 2) {
    const totalCarePercentage = 
      (input.carer1CarePercentage || 0) + (input.carer2CarePercentage || 0);
    
    if (totalCarePercentage > 0) {
      paymentToCarer1 = finalAnnualRate * ((input.carer1CarePercentage || 0) / totalCarePercentage);
      paymentToCarer2 = finalAnnualRate * ((input.carer2CarePercentage || 0) / totalCarePercentage);
    }
  }
  
  // Build child results for breakdown display
  const childResults: Formula6ChildResult[] = input.children.map(child => ({
    age: child.age,
    ageRange: deriveAgeRangeMemoized(child.age),
    costPerChild: child.age < 18 ? costPerChild : 0,
    isAdultChild: child.age >= 18,
  }));
  
  return {
    formulaUsed: 6,
    
    // Income calculations
    survivingParentATI: input.survivingParentATI,
    survivingParentCSI,
    
    // Multi-case adjustments
    multiCaseAllowance,
    adjustedCSI: survivingParentCSI,
    
    // Cost calculations
    cotc,
    parentCarePercentage: roundedCarePercentage,
    parentCostPercentage: costPercentage,
    parentCostShare,
    
    // Final rates (NO halving)
    annualRate: finalAnnualRate,
    monthlyRate,
    fortnightlyRate,
    
    // Multi-case cap
    multiCaseCap,
    multiCaseCapApplied,
    
    // Payment distribution
    paymentToCarer1,
    paymentToCarer2,
    
    // Child breakdown
    childResults,
  };
}
