/**
 * Formula 5 Calculator: Non-Parent Carer with One Parent Unavailable
 * 
 * Applied when:
 * - Non-parent carer applies for assessment
 * - One parent is in non-reciprocating jurisdiction (cannot be assessed)
 * 
 * Key principle: Doubles available parent's income to recognize child has two parents,
 * then halves final rate to compensate for the doubling.
 * 
 * Source: Child Support Guide 2.2.6
 * https://guides.dss.gov.au/child-support-guide/2/2/6
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

export interface Formula5Input {
  /** Available parent's Adjusted Taxable Income */
  availableParentATI: number;
  /** Available parent's care percentage (0-100) */
  availableParentCarePercentage: number;
  /** Children in this case (with specific ages) */
  children: { age: number }[];
  /** Whether available parent has children in other cases */
  hasMultipleCases: boolean;
  /** Children in other cases (for multi-case allowance) */
  otherCaseChildren?: OtherCaseChild[];
  /** Number of non-parent carers (1 or 2) */
  numberOfNonParentCarers: 1 | 2;
  /** First carer's care percentage (if 2 carers) */
  carer1CarePercentage?: number;
  /** Second carer's care percentage (if 2 carers) */
  carer2CarePercentage?: number;
  /** Reason for Formula 5 */
  reason: 'non-reciprocating' | 'special-circumstances';
  /** Country of overseas parent (for display) */
  overseasParentCountry?: string;
  /** Assessment year */
  selectedYear: AssessmentYear;
}

export interface Formula5Result {
  formulaUsed: 5;
  reason: 'non-reciprocating' | 'special-circumstances';
  overseasParentCountry?: string;
  
  // Income calculations
  availableParentATI: number;
  availableParentCSI: number;
  doubledIncome: number;
  
  // Multi-case adjustments
  multiCaseAllowance: number;
  adjustedCSI: number;
  
  // Cost calculations
  cotc: number;
  parentCarePercentage: number;
  parentCostPercentage: number;
  parentCostShare: number;
  
  // Rate calculations
  annualRateBeforeHalving: number;
  annualRateAfterHalving: number;
  
  // Multi-case cap
  multiCaseCap?: number;
  multiCaseCapApplied: boolean;
  
  // Final rates
  annualRate: number;
  monthlyRate: number;
  fortnightlyRate: number;
  
  // Payment distribution (if 2 carers)
  paymentToCarer1?: number;
  paymentToCarer2?: number;
  
  // Child-level breakdown
  childResults: Formula5ChildResult[];
}

export interface Formula5ChildResult {
  age: number;
  ageRange: AgeRange;
  costPerChild: number;
  isAdultChild: boolean;
}

// ============================================================================
// Validation
// ============================================================================

export interface Formula5ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFormula5Input(data: Formula5Input): Formula5ValidationResult {
  if (!data.reason) {
    return { valid: false, error: 'Please select a reason for Formula 5 assessment' };
  }
  
  if (data.availableParentATI < 0) {
    return { valid: false, error: 'Income cannot be negative' };
  }
  
  if (data.availableParentCarePercentage < 0 || data.availableParentCarePercentage > 100) {
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
 * Calculates Formula 5 child support assessment.
 * 
 * Steps:
 * 1. Calculate available parent's CSI (ATI - SSA - multi-case allowance)
 * 2. Double the CSI to recognize child has two parents
 * 3. Calculate costs of children using doubled income
 * 4. Apply care percentages to determine parent's cost share
 * 5. Calculate annual rate and halve it
 * 6. Apply multi-case cap if applicable
 * 7. Distribute payment to carers if multiple
 * 
 * @param input Formula 5 calculation inputs
 * @returns Complete Formula 5 calculation results
 */
export function calculateFormula5(input: Formula5Input): Formula5Result {
  // Validate input
  const validation = validateFormula5Input(input);
  if (!validation.valid) {
    throw new Error(`Formula 5 validation failed: ${validation.error}`);
  }
  
  const { SSA } = getYearConstants(input.selectedYear);
  
  // Step 1: Calculate available parent's Child Support Income
  const preliminaryCSI = Math.max(0, input.availableParentATI - SSA);
  
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
  const availableParentCSI = Math.max(0, preliminaryCSI - multiCaseAllowance);
  
  // Step 2: Double the income to recognize child has two parents
  const doubledIncome = availableParentCSI * 2;
  
  // Step 3: Determine parent's care and cost percentages
  const roundedCarePercentage = roundCarePercentage(input.availableParentCarePercentage);
  const costPercentage = mapCareToCostPercent(roundedCarePercentage);
  
  // Step 4: Calculate costs of children using doubled income
  // Filter out adult children (18+) - they're excluded from standard assessment
  const assessableChildren = input.children
    .filter(c => c.age < 18)
    .map(c => ({
      age: c.age,
      ageRange: deriveAgeRangeMemoized(c.age),
      careA: 0, // Not used in Formula 5
      careB: 0, // Not used in Formula 5
    }));
  
  const { cost: cotc } = getChildCost(
    input.selectedYear,
    assessableChildren,
    doubledIncome
  );
  
  const costPerChild = assessableChildren.length > 0 ? cotc / assessableChildren.length : 0;
  
  // Step 5: Calculate parent's cost share
  const parentCostShare = (costPercentage / 100) * cotc;
  
  // Step 6: Calculate annual rate before halving
  const annualRateBeforeHalving = cotc - parentCostShare;
  
  // Step 7: Halve the rate (compensates for doubling in Step 2)
  const annualRateAfterHalving = 0.5 * annualRateBeforeHalving;
  
  // Step 8: Apply multi-case cap if applicable
  let finalAnnualRate = annualRateAfterHalving;
  let multiCaseCap: number | undefined;
  let multiCaseCapApplied = false;
  
  if (input.hasMultipleCases && assessableChildren.length > 0) {
    // Calculate solo child cost for cap
    // Use first child as representative (all same age in solo calculation)
    const soloChild = assessableChildren[0];
    const { cost: soloCost } = getChildCost(
      input.selectedYear,
      [soloChild],
      availableParentCSI // Use non-doubled income for solo cost
    );
    
    // Cap = solo cost × (100% - parent's cost percentage)
    multiCaseCap = calculateMultiCaseCap(soloCost, costPercentage);
    
    if (annualRateAfterHalving > multiCaseCap) {
      finalAnnualRate = multiCaseCap;
      multiCaseCapApplied = true;
    }
  }
  
  // Step 9: Calculate periodic rates
  const monthlyRate = finalAnnualRate / 12;
  const fortnightlyRate = finalAnnualRate / 26;
  
  // Step 10: Distribute to carers if multiple
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
  const childResults: Formula5ChildResult[] = input.children.map(child => ({
    age: child.age,
    ageRange: deriveAgeRangeMemoized(child.age),
    costPerChild: child.age < 18 ? costPerChild : 0,
    isAdultChild: child.age >= 18,
  }));
  
  return {
    formulaUsed: 5,
    reason: input.reason,
    overseasParentCountry: input.overseasParentCountry,
    
    // Income calculations
    availableParentATI: input.availableParentATI,
    availableParentCSI,
    doubledIncome,
    
    // Multi-case adjustments
    multiCaseAllowance,
    adjustedCSI: availableParentCSI,
    
    // Cost calculations
    cotc,
    parentCarePercentage: roundedCarePercentage,
    parentCostPercentage: costPercentage,
    parentCostShare,
    
    // Rate calculations
    annualRateBeforeHalving,
    annualRateAfterHalving,
    
    // Multi-case cap
    multiCaseCap,
    multiCaseCapApplied,
    
    // Final rates
    annualRate: finalAnnualRate,
    monthlyRate,
    fortnightlyRate,
    
    // Payment distribution
    paymentToCarer1,
    paymentToCarer2,
    
    // Child breakdown
    childResults,
  };
}
