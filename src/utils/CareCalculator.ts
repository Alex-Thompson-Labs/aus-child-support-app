/**
 * Court Order Care Calculator (Refactored)
 * 
 * This module has been refactored from "Rule Extraction" to "Timeline Generation" architecture.
 * The complex simulation logic has been removed in favor of simple timeline aggregation.
 * 
 * The LLM now generates a complete timeline covering the entire year, and the frontend
 * simply aggregates this data to calculate care statistics.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import {
    addDays,
    addYears,
    getYear,
    isWithinInterval,
    parseISO
} from 'date-fns';

// Re-export new timeline types and functions for backward compatibility
export {
    calculateCareFromTimeline,
    formatTimeline,
    parseTimelineString
} from './timeline-aggregator';

export {
    CareCalculationResult,
    TERM_DATES,
    TimelineBlock,
    TimelineError,
    TimelineResponse
} from './timeline-types';

// ============================================================================
// Types (kept for backward compatibility with CareCalendar and pdfGenerator)
// ============================================================================

export type CareParent = 'Mother' | 'Father';
export type AustralianState = 'VIC' | 'NSW' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

/**
 * Day assignment for calendar display.
 * Used by CareCalendar component.
 */
export interface DayAssignment {
  date: Date;
  dateStr: string;
  midnightOwner: CareParent;
  reason: string;
}

// ============================================================================
// School Terms (kept for CareCalendar holiday display)
// ============================================================================

// 2026 Terms (Source: State Government Websites)
export const SCHOOL_TERMS_2026: Record<AustralianState, { start: string; end: string }[]> = {
  VIC: [{ start: '2026-01-27', end: '2026-04-02' }, { start: '2026-04-20', end: '2026-06-26' }, { start: '2026-07-13', end: '2026-09-18' }, { start: '2026-10-05', end: '2026-12-18' }],
  NSW: [{ start: '2026-01-27', end: '2026-04-02' }, { start: '2026-04-20', end: '2026-07-03' }, { start: '2026-07-20', end: '2026-09-25' }, { start: '2026-10-12', end: '2026-12-17' }],
  QLD: [{ start: '2026-01-27', end: '2026-04-02' }, { start: '2026-04-20', end: '2026-06-26' }, { start: '2026-07-13', end: '2026-09-18' }, { start: '2026-10-06', end: '2026-12-11' }],
  WA: [{ start: '2026-02-02', end: '2026-04-02' }, { start: '2026-04-20', end: '2026-07-03' }, { start: '2026-07-20', end: '2026-09-25' }, { start: '2026-10-12', end: '2026-12-17' }],
  SA: [{ start: '2026-01-27', end: '2026-04-10' }, { start: '2026-04-27', end: '2026-07-03' }, { start: '2026-07-20', end: '2026-09-25' }, { start: '2026-10-12', end: '2026-12-11' }],
  TAS: [{ start: '2026-02-05', end: '2026-04-17' }, { start: '2026-05-04', end: '2026-07-10' }, { start: '2026-07-27', end: '2026-10-02' }, { start: '2026-10-19', end: '2026-12-18' }],
  ACT: [{ start: '2026-01-30', end: '2026-04-02' }, { start: '2026-04-21', end: '2026-07-03' }, { start: '2026-07-21', end: '2026-09-25' }, { start: '2026-10-13', end: '2026-12-18' }],
  NT: [{ start: '2026-01-28', end: '2026-04-02' }, { start: '2026-04-13', end: '2026-06-19' }, { start: '2026-07-14', end: '2026-09-18' }, { start: '2026-10-05', end: '2026-12-11' }],
};

interface DateRange {
  start: Date;
  end: Date;
  name: string;
}

/**
 * Get school holiday date ranges for a given year and state.
 * Used by CareCalendar to display holiday indicators.
 */
export function getSchoolHolidays(year: number, state: AustralianState = 'VIC'): DateRange[] {
  // Use 2026 as base and shift years
  const terms2026 = SCHOOL_TERMS_2026[state];
  const shiftYears = year - 2026;

  const shiftedTerms = terms2026.map(term => ({
    start: addYears(parseISO(term.start), shiftYears),
    end: addYears(parseISO(term.end), shiftYears)
  }));

  const holidays: DateRange[] = [];

  // Gaps between terms
  for (let i = 0; i < shiftedTerms.length - 1; i++) {
    holidays.push({
      start: addDays(shiftedTerms[i].end, 1),
      end: addDays(shiftedTerms[i + 1].start, -1),
      name: `Term ${i + 1} Holidays`
    });
  }

  // Summer Holidays (End of Term 4)
  if (shiftedTerms[3]) {
    holidays.push({
      start: addDays(shiftedTerms[3].end, 1),
      end: addDays(shiftedTerms[3].end, 42), // Approx 6 weeks
      name: 'Summer Holidays (Jan)'
    });
  }

  return holidays;
}

/**
 * Check if a date falls within a school holiday period.
 * Used by CareCalendar to display holiday indicators.
 */
export function isSchoolHoliday(date: Date, state: AustralianState = 'VIC'): { isHoliday: boolean; holidayName: string | null; range: DateRange | null } {
  const year = getYear(date);
  const holidays = getSchoolHolidays(year, state);

  for (const holiday of holidays) {
    if (isWithinInterval(date, { start: holiday.start, end: holiday.end })) {
      return { isHoliday: true, holidayName: holiday.name, range: holiday };
    }
  }
  return { isHoliday: false, holidayName: null, range: null };
}

// ============================================================================
// Legacy Types (kept for backward compatibility during transition)
// These will be removed in Task 7 when CourtOrderToolScreen is updated
// ============================================================================

export interface BasePatternEntry {
  day_number: number;
  day_name: string;
  week_number: 1 | 2;
  overnight_care_owner: CareParent;
  description?: string;
}

export interface HolidayRule {
  applies: boolean;
  rule_type: 'alternating' | 'split' | 'fixed' | 'half_half' | 'alternating_blocks' | 'none';
  details: string;
}

export interface CourtOrderJSON {
  start_date?: string;
  cycle_length_days: number;
  primary_parent: CareParent;
  base_pattern: BasePatternEntry[];
  holiday_rules: {
    christmas: HolidayRule;
    school_holidays: HolidayRule;
  };
}

/**
 * @deprecated Use calculateCareFromTimeline instead.
 * This function is kept temporarily for backward compatibility during the transition.
 * It will be removed when CourtOrderToolScreen is updated in Task 7.
 */
export function calculateCareFromOrder(
  _orderJson: CourtOrderJSON,
  _anchorDate: Date,
  _state: AustralianState = 'VIC'
): import('./timeline-types').CareCalculationResult & { assignments: DayAssignment[]; holidayAssignments: { event: string; year: number; care_with: CareParent }[] } {
  // Return a placeholder result indicating the function is deprecated
  // The actual implementation has been removed per Requirements 7.1-7.5
  // Deprecated function - use calculateCareFromTimeline instead
  
  return {
    totalDays: 0,
    motherNights: 0,
    fatherNights: 0,
    motherPercentage: 0,
    fatherPercentage: 0,
    motherNightsPerYear: 0,
    fatherNightsPerYear: 0,
    timeline: [],
    assignments: [],
    holidayAssignments: [],
  };
}

/**
 * @deprecated Dummy data for the old architecture.
 * Kept temporarily for backward compatibility.
 */
export const DUMMY_COURT_ORDER: CourtOrderJSON = {
  start_date: '2024-01-01',
  cycle_length_days: 14,
  primary_parent: 'Mother',
  base_pattern: Array.from({ length: 14 }, (_, i) => ({
    day_number: i + 1,
    day_name: 'Day ' + (i + 1),
    week_number: i < 7 ? 1 : 2,
    overnight_care_owner: (i === 5 || i === 6) ? 'Father' : 'Mother'
  })),
  holiday_rules: {
    christmas: { applies: true, rule_type: 'alternating', details: 'Father even years' },
    school_holidays: { applies: true, rule_type: 'half_half', details: 'Split half half' }
  }
};
