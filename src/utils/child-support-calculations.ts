import { CARE_PERIOD_DAYS, CarePeriod } from './child-support-constants';
import {
  costOfChildrenByYear,
  AgeGroupKey,
  ChildCountKey,
} from './cost-of-children-tables';
import type { AssessmentYear } from './child-support-constants';
import type { CostBracketInfo } from './calculator';

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
 * Calculates the cost of children based on combined income and tables.
 * Returns both the cost and the bracket info for display purposes.
 */
export function getChildCost(
  year: AssessmentYear,
  children: Child[],
  CCSI: number
): ChildCostResult {
  const numChildren = children.length;
  if (numChildren === 0) {
    return {
      cost: 0,
      bracketInfo: {
        minIncome: 0,
        maxIncome: null,
        fixed: 0,
        rate: 0,
        incomeInBracket: 0,
      },
    };
  }

  const hasYounger = children.some((c) => c.age === 'Under 13');
  const hasOlder = children.some((c) => c.age === '13+');

  let groupKey: AgeGroupKey;
  if (hasYounger && hasOlder) {
    groupKey = 'mixedAges';
  } else if (hasYounger) {
    groupKey = 'all0_12';
  } else {
    groupKey = 'all13Plus';
  }

  // Use '3PlusChildren' for 3 or more
  const childKey: ChildCountKey =
    numChildren === 1
      ? '1Child'
      : numChildren === 2
        ? '2Children'
        : '3PlusChildren';

  // Handle cases where a specific key doesn't exist (e.g., '1Child' for 'mixedAges')
  const table = costOfChildrenByYear[year]?.[groupKey];
  if (!table || !table[childKey]) {
    console.error(`Missing cost table for: ${year}, ${groupKey}, ${childKey}`);
    return {
      cost: 0,
      bracketInfo: {
        minIncome: 0,
        maxIncome: null,
        fixed: 0,
        rate: 0,
        incomeInBracket: 0,
      },
    };
  }

  const brackets = table[childKey];
  const bracket = brackets.find(
    (b) =>
      CCSI >= b.min_income && (b.max_income === null || CCSI <= b.max_income)
  );

  if (!bracket) {
    console.error(`No matching bracket found for CCSI: ${CCSI}`);
    return {
      cost: 0,
      bracketInfo: {
        minIncome: 0,
        maxIncome: null,
        fixed: 0,
        rate: 0,
        incomeInBracket: 0,
      },
    };
  }

  // Apply the formula: Fixed amount + Rate * (Income in bracket)
  // Ensure income doesn't exceed the bracket max (if one exists)
  const incomeInBracket =
    Math.min(CCSI, bracket.max_income || CCSI) - bracket.min_income;
  const cost = bracket.fixed + incomeInBracket * bracket.rate;

  return {
    cost,
    bracketInfo: {
      minIncome: bracket.min_income,
      maxIncome: bracket.max_income,
      fixed: bracket.fixed,
      rate: bracket.rate,
      incomeInBracket,
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
