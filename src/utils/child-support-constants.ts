// Constants for care period calculations
export const CARE_PERIOD_DAYS = {
  week: 7,
  fortnight: 14,
  year: 365,
  percent: 100,
} as const;

export type CarePeriod = keyof typeof CARE_PERIOD_DAYS;

// Fixed Annual Rate by Year
export const FAR_BY_YEAR: Record<string, number> = {
  "2020": 1467,
  "2021": 1477,
  "2022": 1521,
  "2023": 1623,
  "2024": 1720,
  "2025": 1768,
};

// Maximum Parenting Payment Single by Year
export const MAX_PPS_BY_YEAR: Record<string, number> = {
  "2020": 20298,
  "2021": 20621,
  "2022": 22415,
  "2023": 23800,
  "2024": 25225,
  "2025": 26195,
};

// Minimum Annual Rate by Year
export const MAR_BY_YEAR: Record<string, number> = {
  "2020": 443,
  "2021": 446,
  "2022": 459,
  "2023": 473,
  "2024": 505,
  "2025": 534,
};

// Self-Support Amount by Year
export const SSA_BY_YEAR: Record<string, number> = {
  "2020": 25575,
  "2021": 26319,
  "2022": 27063,
  "2023": 27508,
  "2024": 28463,
  "2025": 29841,
};

export type AssessmentYear = "2020" | "2021" | "2022" | "2023" | "2024" | "2025";







