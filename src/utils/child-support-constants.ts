// Constants for care period calculations
export const CARE_PERIOD_DAYS = {
  week: 7,
  fortnight: 14,
  year: 365,
  percent: 100,
} as const;

export type CarePeriod = keyof typeof CARE_PERIOD_DAYS;

// Re-export year configuration types and utilities
export {
  AssessmentYear, getYearConfig,
  getYearConstants, YEARLY_CONFIG
} from './year-config';

// =============================================================================
// Default constants (2026) for backward compatibility
// =============================================================================
// These exports use 2026 as the current assessment year default.
// For year-specific calculations, use getYearConstants(year) instead.

import { YEARLY_CONFIG } from './year-config';

const DEFAULT_YEAR = '2026' as const;
const defaultConfig = YEARLY_CONFIG[DEFAULT_YEAR];

/** Fixed Annual Rate (default: 2026) */
export const FAR = defaultConfig.FIXED_ANNUAL_RATE;

/** Maximum Parenting Payment Single (default: 2026) */
export const MAX_PPS = defaultConfig.PPS_MAX;

/** Minimum Annual Rate (default: 2026) */
export const MAR = defaultConfig.MIN_ANNUAL_RATE;

/** Self-Support Amount (default: 2026) */
export const SSA = defaultConfig.SELF_SUPPORT;

/** MTAWE Income Cap (default: 2026) */
export const MTAWE_CAP = defaultConfig.MTAWE_CAP;
