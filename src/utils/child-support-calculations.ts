import type { CostBracketInfo } from './calculator';
import {
  AssessmentYear,
  CARE_PERIOD_DAYS,
  CarePeriod,
} from './child-support-constants';
import { COTCBandValues, YEARLY_CONFIG } from './year-config';

export interface Child {
  age: 'Under 13' | '13+';
  careA: number;
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

  // Determine age group
  const hasYounger = children.some((c) => c.age === 'Under 13');
  const hasOlder = children.some((c) => c.age === '13+');

  let ageGroup: '0-12' | '13+' | 'mixed';
  if (hasYounger && hasOlder) {
    ageGroup = 'mixed';
  } else if (hasYounger) {
    ageGroup = '0-12';
  } else {
    ageGroup = '13+';
  }

  // Determine child count key (cap at 3)
  const childCount = Math.min(numChildren, 3) as 1 | 2 | 3;

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
