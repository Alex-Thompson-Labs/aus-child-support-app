import type { AgeRange, ChildInput, CostBracketInfo, OtherCaseChild } from './calculator';
import { deriveAgeRange } from './calculator';
import {
  AssessmentYear,
  CARE_PERIOD_DAYS,
  CarePeriod,
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
    console.error(`Missing configuration for year: ${year}`);
    return emptyResult;
  }

  // Derive age ranges from specific ages
  const childrenWithRanges = children.map((c) => ({
    ...c,
    ageRange: c.ageRange ?? deriveAgeRange(c.age),
  }));

  // Filter out adult children (18+) from standard calculation
  // Adult Child Maintenance is handled separately
  const eligibleChildren = childrenWithRanges.filter((c) => c.ageRange !== '18+');

  if (eligibleChildren.length === 0) {
    // All children are 18+ - return zero cost for standard calculation
    // Adult Child Maintenance logic will be implemented separately
    return emptyResult;
  }

  // Determine age group based on eligible children
  const hasYounger = eligibleChildren.some((c) => c.ageRange === 'Under 13');
  const hasOlder = eligibleChildren.some((c) => c.ageRange === '13+');

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
    console.error(
      `Missing COTC values for: ${year}, ${ageGroup}, ${childCount}`
    );
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
        fixed: values.bases[bands.length - 1] || values.max,
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

/**
 * Converts care nights/days over a period to an annual percentage.
 */
export function convertCareToPercentage(
  amount: number,
  period: CarePeriod
): number {
  // If period is 'percent', the amount is already a percentage
  if (period === 'percent') {
    return amount;
  }

  const divisor = CARE_PERIOD_DAYS[period];
  if (!divisor) return 0;
  // For 'year', we assume the amount is nights per year, so we divide by 365
  if (period === 'year') {
    return (amount / 365) * 100;
  }
  // For 'week' or 'fortnight', it's nights per period
  return (amount / divisor) * 100;
}

/**
 * Rounds the care percentage according to specific rules.
 * Below 50 is rounded down, 50 and above is rounded up.
 */
export function roundCarePercentage(care: number): number {
  if (care < 50) {
    return Math.floor(care);
  } else {
    return Math.ceil(care);
  }
}

/**
 * Maps the rounded care percentage to a "cost percentage".
 */
export function mapCareToCostPercent(care: number): number {
  if (care <= 13) return 0; // Less than regular care
  if (care <= 34) return 24; // Regular care
  if (care <= 47) return 25 + 2 * (care - 35); // Shared care (Linear)
  if (care <= 52) return 50; // Shared care
  if (care <= 65) return 51 + 2 * (care - 53); // Shared care (Linear)
  if (care <= 86) return 76; // Primary care
  return 100; // More than primary care
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
export function calculateMultiCaseAllowance(
  year: AssessmentYear,
  parentCSI: number,
  currentCaseChildren: { age: number }[],
  otherCaseChildren: OtherCaseChild[]
): number {
  if (otherCaseChildren.length === 0) return 0;
  if (parentCSI <= 0) return 0;

  const totalChildCount = currentCaseChildren.length + otherCaseChildren.length;
  let allowance = 0;

  for (const otherChild of otherCaseChildren) {
    // Create virtual children all of same age as this other-case child
    // This implements the "Same Age" rule
    const virtualChildren: Child[] = Array(totalChildCount)
      .fill(null)
      .map(() => ({
        age: otherChild.age,
        ageRange: deriveAgeRange(otherChild.age),
        careA: 0,
        careB: 0,
      }));

    // Calculate cost using parent's individual CSI
    const { cost: totalCost } = getChildCost(year, virtualChildren, parentCSI);

    // This child's share
    const childCost = totalCost / totalChildCount;
    allowance += childCost;
  }

  return Math.round(allowance);
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

/**
 * Validates non-parent carer care percentage.
 * Non-parent carers must have at least 35% care.
 */
export function validateNonParentCarerCare(carePercentage: number): boolean {
  return carePercentage >= 35;
}
