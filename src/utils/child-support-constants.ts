// Constants for care period calculations
export const CARE_PERIOD_DAYS = {
  week: 7,
  fortnight: 14,
  year: 365,
  percent: 100,
} as const;

export type CarePeriod = keyof typeof CARE_PERIOD_DAYS;

// Child Support Constants for 2025 Calendar Year

// Fixed Annual Rate
export const FAR = 1768;

// Maximum Parenting Payment Single
export const MAX_PPS = 26195;

// Minimum Annual Rate
export const MAR = 534;

// Self-Support Amount
export const SSA = 29841;

// Assessment year type (for cost table compatibility)
export type AssessmentYear = '2025';
