import type { AgeRange, ChildInput, CostBracketInfo, OtherCaseChild } from './calculator';
import { deriveAgeRangeMemoized } from './calculator';
import {
    AssessmentYear
} from './child-support-constants';
import { COTCBandValues, YEARLY_CONFIG } from './year-config';

/**
 * Child type for calculation functions.
 * Derived from ChildInput with care amounts as percentages.
 */
export interface Child extends Pick<ChildInput, 'age'> {
  /** Derived age range for calculation engine (computed from age) */
  ageRange?: AgeRange;
  /** Care percentage for Parent A */
  careA: number;
  /** Care percentage for Parent B */
  careB: number;
}

export interface ChildCostResult {
  cost: number;
  bracketInfo: CostBracketInfo;
}

/**
 * Calculates the cost of children based on combined income and YEARLY_CONFIG tables.
 * Returns both the cost and the bracket info for display purposes.
 *
 * Updated 2026-01-06: Now uses YEARLY_CONFIG for multi-year support.
 * Updated 2026-01-11: Now accepts specific ages and derives age ranges.
 */
export function getChildCost(
  year: AssessmentYear,
  children: Child[],
  CCSI: number
): ChildCostResult {
  const numChildren = children.length;
  const emptyResult: ChildCostResult = {
    cost: 0,
    bracketInfo: {
      minIncome: 0,
      maxIncome: null,
      fixed: 0,
      rate: 0,
      incomeInBracket: 0,
    },
  };

  if (numChildren === 0) {
    return emptyResult;
  }

  const config = YEARLY_CONFIG[year];
  if (!config) {
    // TODO: Replace with proper error reporting service
    return emptyResult;
  }

  // Optimized: Single pass to derive age ranges, filter eligible children, and determine age groups
  const eligibleChildren: (Child & { ageRange: AgeRange })[] = [];
  let hasYounger = false;
  let hasOlder = false;

  for (const c of children) {
    const ageRange = c.ageRange ?? deriveAgeRangeMemoized(c.age);
    
    // Skip adult children (18+) from standard calculation
    if (ageRange !== '18+') {
      eligibleChildren.push({ ...c, ageRange });
      
      // Track age groups in same pass
      if (ageRange === 'Under 13') {
        hasYounger = true;
      } else if (ageRange === '13+') {
        hasOlder = true;
      }
    }
  }

  if (eligibleChildren.length === 0) {
    // All children are 18+ - return zero cost for standard calculation
    // Adult Child Maintenance logic will be implemented separately
    return emptyResult;
  }

  // Determine age group based on flags set during iteration
  let ageGroup: '0-12' | '13+' | 'mixed';
  if (hasYounger && hasOlder) {
    ageGroup = 'mixed';
  } else if (hasYounger) {
    ageGroup = '0-12';
  } else {
    ageGroup = '13+';
  }

  // Determine child count key (cap at 3) - use eligible children count
  const childCount = Math.min(eligibleChildren.length, 3) as 1 | 2 | 3;

  // Handle mixed age group for 1 child (not applicable - use younger rates)
  if (ageGroup === 'mixed' && childCount === 1) {
    ageGroup = '0-12';
  }

  // Get the COTC values for this configuration
  let values: COTCBandValues;
  if (ageGroup === 'mixed') {
    values = config.cotcValues.mixed[childCount as 2 | 3];
  } else {
    values = config.cotcValues[ageGroup][childCount];
  }

  if (!values) {
    // TODO: Replace with proper error reporting service
    return emptyResult;
  }

  const bands = config.cotcBands;

  // Find which band the income falls into
  let bandIndex = 0;
  for (let i = 0; i < bands.length; i++) {
    if (CCSI <= bands[i]) {
      bandIndex = i;
      break;
    }
    bandIndex = i + 1;
  }

  // If above the last band, return the max with last bracket info
  if (bandIndex >= bands.length) {
    const lastBandStart = bands[bands.length - 1];
    return {
      cost: values.max,
      bracketInfo: {
        minIncome: lastBandStart,
        maxIncome: null,
        fixed: values.max, // Use max as the base amount when income exceeds highest bracket
        rate: 0,
        incomeInBracket: CCSI - lastBandStart,
      },
    };
  }

  // Get the base and percentage for this band
  const base = values.bases[bandIndex];
  const percentage = values.percentages[bandIndex];

  // Calculate band boundaries
  const bandStart = bandIndex === 0 ? 0 : bands[bandIndex - 1];
  const bandEnd = bands[bandIndex];
  const incomeInBand = Math.max(0, CCSI - bandStart);

  // Calculate cost: base + (income in band * percentage)
  const cost = Math.min(base + incomeInBand * percentage, values.max);

  return {
    cost,
    bracketInfo: {
      minIncome: bandStart,
      maxIncome: bandEnd,
      fixed: base,
      rate: percentage,
      incomeInBracket: incomeInBand,
    },
  };
}







// ============================================================================
// Multi-case Support Functions (Formula 3 & 4)
// ============================================================================

/**
 * Calculates the Multi-case Allowance for a parent with children in other cases.
 *
 * The "Same Age" Rule: For each other-case child, we calculate the cost as if
 * ALL of the parent's children (current case + other cases) were the same age
 * as that child, then divide by total children count.
 *
 * @param year - Assessment year
 * @param parentCSI - The parent's individual Child Support Income (ATI - SSA)
 * @param currentCaseChildren - Children in the current case (with specific ages)
 * @param otherCaseChildren - Children in other child support cases (with specific ages)
 * @returns The multi-case allowance to deduct from the parent's income (rounded to nearest dollar)
 */
/**
 * Breakdown for a single other-case child in multi-case allowance calculation
 */
export interface MultiCaseChildBreakdown {
  childId: string;
  childAge: number;
  childSupportIncome: number; // Parent's CSI for this calculation
  totalCost: number; // COTC for all children at this age
  costPerChild: number; // Cost divided by total children
  totalChildren: number; // Current case + other case children
  isCurrentCase: boolean; // Whether this child is in the current case
  bracketInfo?: CostBracketInfo; // COTC bracket information for detailed display
}

/**
 * Grouped breakdown by age bracket for multi-case display
 */
export interface MultiCaseAgeBracketBreakdown {
  ageBracket: 'under13' | 'over13';
  childSupportIncome: number;
  totalCost: number;
  costPerChild: number;
  totalChildren: number;
  bracketInfo: CostBracketInfo;
  currentCaseCount: number; // Number of children in current case for this age bracket
  otherCaseCount: number; // Number of children in other cases for this age bracket
}

/**
 * Result of multi-case allowance calculation with detailed breakdown
 */
export interface MultiCaseAllowanceResult {
  totalAllowance: number;
  breakdown: MultiCaseChildBreakdown[];
  groupedBreakdown?: MultiCaseAgeBracketBreakdown[]; // Grouped by age bracket for cleaner display
}

export function calculateMultiCaseAllowance(
  year: AssessmentYear,
  parentCSI: number,
  currentCaseChildren: { age: number }[],
  otherCaseChildren: OtherCaseChild[]
): number {
  const result = calculateMultiCaseAllowanceDetailed(
    year,
    parentCSI,
    currentCaseChildren,
    otherCaseChildren
  );
  return result.totalAllowance;
}

/**
 * Calculate multi-case allowance with detailed breakdown for each other-case child.
 * This version returns intermediate calculations for display in Step 1 breakdown.
 */
export function calculateMultiCaseAllowanceDetailed(
  year: AssessmentYear,
  parentCSI: number,
  currentCaseChildren: { age: number }[],
  otherCaseChildren: OtherCaseChild[]
): MultiCaseAllowanceResult {
  if (otherCaseChildren.length === 0) {
    return { totalAllowance: 0, breakdown: [] };
  }
  
  if (parentCSI <= 0) {
    return { totalAllowance: 0, breakdown: [] };
  }

  const totalChildCount = currentCaseChildren.length + otherCaseChildren.length;
  let allowance = 0;
  const breakdown: MultiCaseChildBreakdown[] = [];

  // First, add breakdown for current case children (for display purposes)
  for (let i = 0; i < currentCaseChildren.length; i++) {
    const currentChild = currentCaseChildren[i];
    const ageRange = deriveAgeRangeMemoized(currentChild.age);
    
    // Create virtual children all of same age as this current-case child
    const virtualChildren: Child[] = [];
    for (let j = 0; j < totalChildCount; j++) {
      virtualChildren.push({
        age: currentChild.age,
        ageRange: ageRange,
        careA: 0,
        careB: 0,
      });
    }

    // Calculate cost using parent's individual CSI
    const { cost: totalCost, bracketInfo } = getChildCost(year, virtualChildren, parentCSI);

    // This child's share
    const childCost = totalCost / totalChildCount;

    // Store breakdown for this child (but don't add to allowance)
    breakdown.push({
      childId: `current-${i}`,
      childAge: currentChild.age,
      childSupportIncome: parentCSI,
      totalCost: totalCost,
      costPerChild: childCost,
      totalChildren: totalChildCount,
      bracketInfo: bracketInfo,
      isCurrentCase: true,
    });
  }

  // Then, add breakdown for other case children (these contribute to allowance)
  for (const otherChild of otherCaseChildren) {
    // Create virtual children all of same age as this other-case child
    // This implements the "Same Age" rule
    // Use memoized age range to avoid recalculating for each virtual child
    const ageRange = deriveAgeRangeMemoized(otherChild.age);
    
    // Optimized: Create array without fill().map() chain
    const virtualChildren: Child[] = [];
    for (let i = 0; i < totalChildCount; i++) {
      virtualChildren.push({
        age: otherChild.age,
        ageRange: ageRange,
        careA: 0,
        careB: 0,
      });
    }

    // Calculate cost using parent's individual CSI
    const { cost: totalCost, bracketInfo } = getChildCost(year, virtualChildren, parentCSI);

    // This child's share
    const childCost = totalCost / totalChildCount;
    allowance += childCost;

    // Store breakdown for this child
    breakdown.push({
      childId: otherChild.id,
      childAge: otherChild.age,
      childSupportIncome: parentCSI,
      totalCost: totalCost,
      costPerChild: childCost,
      totalChildren: totalChildCount,
      bracketInfo: bracketInfo,
      isCurrentCase: false,
    });
  }

  // Generate grouped breakdown by age bracket for cleaner UI display
  const groupedBreakdown: MultiCaseAgeBracketBreakdown[] = [];
  
  // Group children by age bracket
  const under13Children = breakdown.filter(c => c.childAge < 13);
  const over13Children = breakdown.filter(c => c.childAge >= 13 && c.childAge < 18);
  
  // Create grouped breakdown for under 13 if any exist
  if (under13Children.length > 0) {
    const sample = under13Children[0]; // Use first child as representative
    const currentCaseCount = under13Children.filter(c => c.isCurrentCase).length;
    const otherCaseCount = under13Children.filter(c => !c.isCurrentCase).length;
    
    groupedBreakdown.push({
      ageBracket: 'under13',
      childSupportIncome: sample.childSupportIncome,
      totalCost: sample.totalCost,
      costPerChild: sample.costPerChild,
      totalChildren: sample.totalChildren,
      bracketInfo: sample.bracketInfo!,
      currentCaseCount,
      otherCaseCount,
    });
  }
  
  // Create grouped breakdown for over 13 if any exist
  if (over13Children.length > 0) {
    const sample = over13Children[0]; // Use first child as representative
    const currentCaseCount = over13Children.filter(c => c.isCurrentCase).length;
    const otherCaseCount = over13Children.filter(c => !c.isCurrentCase).length;
    
    groupedBreakdown.push({
      ageBracket: 'over13',
      childSupportIncome: sample.childSupportIncome,
      totalCost: sample.totalCost,
      costPerChild: sample.costPerChild,
      totalChildren: sample.totalChildren,
      bracketInfo: sample.bracketInfo!,
      currentCaseCount,
      otherCaseCount,
    });
  }

  return {
    totalAllowance: Math.round(allowance),
    breakdown,
    groupedBreakdown,
  };
}

/**
 * Calculates the Multi-case Cap for a specific child.
 *
 * The cap ensures the paying parent's liability for a multi-case child
 * doesn't exceed their share of that child's cost.
 *
 * Cap = Child's cost × (100% - parent's cost percentage for that child)
 *
 * @param childCost - The cost calculated for this specific child
 * @param parentCostPercentage - The parent's cost percentage (from care %)
 * @returns The multi-case cap amount (rounded to nearest dollar)
 */
export function calculateMultiCaseCap(
  childCost: number,
  parentCostPercentage: number
): number {
  return Math.round(childCost * ((100 - parentCostPercentage) / 100));
}

/**
 * Applies multi-case cap to a child's liability.
 *
 * @param standardLiability - The liability calculated by standard formula
 * @param multiCaseCap - The calculated multi-case cap
 * @returns Object with final liability and whether cap was applied
 */
export function applyMultiCaseCap(
  standardLiability: number,
  multiCaseCap: number
): { liability: number; capApplied: boolean } {
  if (standardLiability > multiCaseCap) {
    return { liability: multiCaseCap, capApplied: true };
  }
  return { liability: standardLiability, capApplied: false };
}


