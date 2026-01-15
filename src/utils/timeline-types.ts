/**
 * Timeline Types for Court Order Interpreter
 *
 * These types support the "Timeline Generation" architecture where the LLM
 * generates a complete, minute-by-minute timeline covering the entire year.
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */

/**
 * Parent code used in timeline blocks.
 * - 'M' = Mother
 * - 'F' = Father
 */
export type ParentCode = 'M' | 'F';

/**
 * Type code classifying the care period.
 * - 'base' = Regular schedule during school term
 * - 'holiday' = School holiday period
 * - 'christmas' = Christmas period (Dec 24-26)
 */
export type TypeCode = 'base' | 'holiday' | 'christmas';

/**
 * A single block in the care timeline.
 * Format: [start_iso_string, end_iso_string, parent_code, type_code]
 *
 * Example: ["2026-01-01T00:00", "2026-01-07T15:30", "M", "holiday"]
 *
 * Requirements:
 * - 1.2: Format [start_iso_string, end_iso_string, parent_code, type_code]
 * - 1.3: Parent codes are "M" for Mother and "F" for Father
 * - 1.4: Type codes are "base", "holiday", or "christmas"
 * - 1.5: ISO strings include minute-level precision
 */
export type TimelineBlock = [string, string, ParentCode, TypeCode];

/**
 * The complete timeline response from the LLM.
 *
 * Requirements:
 * - 1.1: Output JSON object containing a `timeline` array
 */
export interface TimelineResponse {
  /** Array of timeline blocks covering the entire year */
  timeline: TimelineBlock[];
  /** The year this timeline covers */
  year: number;
  /** The primary parent (default care holder when not specified) */
  primary_parent: ParentCode;
}

/**
 * Error response from the Timeline Generator.
 */
export interface TimelineError {
  error: 'INVALID_DOCUMENT_TYPE' | 'INVALID_TIMELINE_GAPS' | 'INVALID_TIMELINE_BOUNDS' | 'INVALID_BLOCK_FORMAT' | 'LLM_ERROR' | 'PARSE_ERROR';
  reason: string;
}

/**
 * Result of care calculation from timeline aggregation.
 * Matches the existing CareCalculationResult structure for backward compatibility.
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */
export interface CareCalculationResult {
  /** Total days in the calculation period */
  totalDays: number;
  /** Number of nights attributed to Mother */
  motherNights: number;
  /** Number of nights attributed to Father */
  fatherNights: number;
  /** Mother's care percentage (0-100) */
  motherPercentage: number;
  /** Father's care percentage (0-100) */
  fatherPercentage: number;
  /** Mother's nights per year (annualized) */
  motherNightsPerYear: number;
  /** Father's nights per year (annualized) */
  fatherNightsPerYear: number;
  /** The original timeline blocks for calendar display */
  timeline: TimelineBlock[];
}

/**
 * School term date range.
 */
export interface TermDate {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
}

/**
 * School term dates by year and state.
 */
export interface TermDates {
  [year: number]: {
    VIC: TermDate[];
    // Future: Add other states as needed
  };
}

/**
 * School term dates for VIC (2026-2028).
 * Source: Victorian Government Education Department
 */
export const TERM_DATES: TermDates = {
  2026: {
    VIC: [
      { start: '2026-01-27', end: '2026-04-02' },
      { start: '2026-04-20', end: '2026-06-26' },
      { start: '2026-07-13', end: '2026-09-18' },
      { start: '2026-10-05', end: '2026-12-18' }
    ]
  },
  2027: {
    VIC: [
      { start: '2027-01-28', end: '2027-03-25' },
      { start: '2027-04-12', end: '2027-06-25' },
      { start: '2027-07-12', end: '2027-09-17' },
      { start: '2027-10-04', end: '2027-12-17' }
    ]
  },
  2028: {
    VIC: [
      { start: '2028-01-28', end: '2028-03-31' },
      { start: '2028-04-18', end: '2028-06-30' },
      { start: '2028-07-17', end: '2028-09-22' },
      { start: '2028-10-09', end: '2028-12-21' }
    ]
  }
};

/**
 * Check if a year is a leap year.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get total minutes in a year.
 */
export function getTotalMinutesInYear(year: number): number {
  const days = isLeapYear(year) ? 366 : 365;
  return days * 24 * 60;
}

/**
 * Get total days in a year.
 */
export function getTotalDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}
