/**
 * Court Order Care Calculator (Refactored)
 * 
 * Calculates care percentages based on parsed court order JSON.
 * 
 * CORE LOGIC:
 * 1. DETERMINISTIC ENGINE: Uses strict rules extracted by the LLM.
 * 2. HIERARCHY: Holiday Rules > Base Pattern.
 * 3. 730-DAY SIMULATION: Runs 2 years to average odd/even year schedules.
 * 4. CARRY-OVER RULE: If a day is missing, inherit from previous day's overnight owner.
 */

import {
  addDays,
  addYears,
  format,
  getYear,
  isWithinInterval,
  parseISO
} from 'date-fns';

// ============================================================================
// Types
// ============================================================================

export type CareParent = 'Mother' | 'Father';
export type AustralianState = 'VIC' | 'NSW' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

export interface BasePatternEntry {
  day_number: number; // 1-14
  day_name: string;
  week_number: 1 | 2;
  overnight_care_owner: CareParent; // The LLM determines the midnight owner
  description?: string;
}

// ============================================================================
// Day Name Normalization Helpers
// ============================================================================

const DAY_NAME_MAP: Record<string, string> = {
  'monday': 'Monday', 'mon': 'Monday', 'mo': 'Monday',
  'tuesday': 'Tuesday', 'tue': 'Tuesday', 'tues': 'Tuesday', 'tu': 'Tuesday',
  'wednesday': 'Wednesday', 'wed': 'Wednesday', 'we': 'Wednesday',
  'thursday': 'Thursday', 'thu': 'Thursday', 'thur': 'Thursday', 'thurs': 'Thursday', 'th': 'Thursday',
  'friday': 'Friday', 'fri': 'Friday', 'fr': 'Friday',
  'saturday': 'Saturday', 'sat': 'Saturday', 'sa': 'Saturday',
  'sunday': 'Sunday', 'sun': 'Sunday', 'su': 'Sunday',
};

/**
 * Normalize day name to Title Case English (e.g., "WEDNESDAY" -> "Wednesday")
 */
function normalizeDayName(day: string): string {
  if (!day) return '';
  const normalized = DAY_NAME_MAP[day.toLowerCase().trim()];
  return normalized || day; // Return original if not found
}

/**
 * Check if two day names match (case-insensitive, handles abbreviations)
 */
function dayNamesMatch(a: string, b: string): boolean {
  return normalizeDayName(a) === normalizeDayName(b);
}

export interface HolidayRule {
  applies: boolean;
  rule_type: 'alternating' | 'split' | 'fixed' | 'half_half' | 'alternating_blocks' | 'none';
  details: string; // Context for fallback
}

export interface CourtOrderJSON {
  start_date?: string; // YYYY-MM-DD
  cycle_length_days: number;
  primary_parent: CareParent;
  base_pattern: BasePatternEntry[];
  holiday_rules: {
    christmas: HolidayRule;
    school_holidays: HolidayRule;
  };
}

export interface DayAssignment {
  date: Date;
  dateStr: string;
  midnightOwner: CareParent;
  reason: string; // 'base', 'holiday:Christmas', 'holiday:SchoolHolidays', etc.
}

export interface CareCalculationResult {
  totalDays: number;
  motherNights: number;
  fatherNights: number;
  motherPercentage: number;
  fatherPercentage: number;
  motherNightsPerYear: number;
  fatherNightsPerYear: number;
  assignments: DayAssignment[];
  holidayAssignments: { event: string; year: number; care_with: CareParent }[];
}

// ============================================================================
// Constants & School Terms
// ============================================================================

const SIMULATION_DAYS = 730; // 2 years

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
// Main Calculator Class
// ============================================================================

export class CareCalculator {
  private orderJson: CourtOrderJSON;
  private anchorDate: Date;
  private state: AustralianState;

  constructor(orderJson: CourtOrderJSON, anchorDate: Date, state: AustralianState) {
    this.orderJson = orderJson;
    this.anchorDate = anchorDate;
    this.state = state;
  }

  /**
   * STEP 1: Check if date falls within any holiday rule
   */
  private checkHolidayRules(date: Date): { isHoliday: boolean; midnightOwner: CareParent | null; reason: string } {
    if (!this.orderJson.holiday_rules) {
      return { isHoliday: false, midnightOwner: null, reason: '' };
    }

    const { christmas, school_holidays } = this.orderJson.holiday_rules;
    const year = getYear(date);
    const month = date.getMonth(); // 0-11
    const day = date.getDate();

    // --- Christmas Logic ---
    if (christmas?.applies && month === 11 && day >= 24 && day <= 26) {
      if (christmas.rule_type === 'alternating') {
        // Assume standard: Even = Father, Odd = Mother unless details say otherwise
        // Use simple heuristic if details contradict, otherwise standard
        const isEven = year % 2 === 0;
        // Parse details for explicit overrides like "Father odd years"
        const detailsLower = (christmas.details || '').toLowerCase();
        let owner: CareParent = isEven ? 'Father' : 'Mother';

        if (detailsLower.includes('father') && detailsLower.includes('odd')) {
          owner = isEven ? 'Mother' : 'Father';
        }

        return { isHoliday: true, midnightOwner: owner, reason: 'holiday:Christmas' };
      }
      // Fixed rule
      if (christmas.rule_type === 'fixed') {
        const detailsLower = (christmas.details || '').toLowerCase();
        if (detailsLower.includes('father')) return { isHoliday: true, midnightOwner: 'Father', reason: 'holiday:Christmas' };
        if (detailsLower.includes('mother')) return { isHoliday: true, midnightOwner: 'Mother', reason: 'holiday:Christmas' };
      }
    }

    // --- School Holidays Logic ---
    if (school_holidays?.applies) {
      const holidayCheck = isSchoolHoliday(date, this.state);
      if (holidayCheck.isHoliday && holidayCheck.range) {
        if (school_holidays.rule_type === 'half_half') {
          // Split the specific holiday block in half
          const start = holidayCheck.range.start.getTime();
          const end = holidayCheck.range.end.getTime();
          const mid = start + (end - start) / 2;

          // First half / Second half?
          // Default: Father first half, Mother second half (or alternate annually? keeping it simple for now)
          // Ideally extract "first half to father" from details
          const isFirstHalf = date.getTime() < mid;

          // Toggle annually to be fair if unspecified
          const isEvenYear = year % 2 === 0;
          const fatherFirst = isEvenYear; // Swap every year

          if (isFirstHalf) {
            return { isHoliday: true, midnightOwner: fatherFirst ? 'Father' : 'Mother', reason: 'holiday:SchoolHolidays' };
          } else {
            return { isHoliday: true, midnightOwner: fatherFirst ? 'Mother' : 'Father', reason: 'holiday:SchoolHolidays' };
          }
        }

        // Default to alternating weeks if unknown
        const dayInHoliday = Math.floor((date.getTime() - holidayCheck.range.start.getTime()) / (1000 * 60 * 60 * 24));
        const weekNum = Math.floor(dayInHoliday / 7);
        // Start with Father or Mother? Use Primary Parent as fallback if unclear, or alternate
        const owner = weekNum % 2 === 0 ? 'Father' : 'Mother';
        return { isHoliday: true, midnightOwner: owner, reason: 'holiday:SchoolHolidays' };
      }
    }

    return { isHoliday: false, midnightOwner: null, reason: '' };
  }

  /**
   * Find entry by day_number with fallback to day_name matching
   */
  private findPatternEntry(dayNumber: number, dayName: string): BasePatternEntry | undefined {
    // Primary: match by day_number (most reliable)
    let entry = this.orderJson.base_pattern.find(p => p.day_number === dayNumber);
    if (entry) return entry;

    // Fallback: match by day_name (handles sparse data with only changeover days)
    entry = this.orderJson.base_pattern.find(p => dayNamesMatch(p.day_name, dayName));
    return entry;
  }

  /**
   * Get the previous day number in the cycle (handles week boundary wrap-around)
   * Day 1 -> Day 14 (wraps around)
   */
  private getPreviousDayNumber(dayNumber: number): number {
    const cycleLength = this.orderJson.cycle_length_days || 14;
    return dayNumber === 1 ? cycleLength : dayNumber - 1;
  }

  /**
   * Get day name for a given day number (1-14 -> weekday name based on anchor date)
   */
  private getDayNameForDayNumber(dayNumber: number): string {
    const targetDate = addDays(this.anchorDate, dayNumber - 1);
    return format(targetDate, 'EEEE'); // Full day name
  }

  /**
   * STEP 2: Base Pattern from 1-14 cycle with carry-over logic
   * 
   * CARRY-OVER RULE: If today's entry is missing, look at who had overnight care yesterday.
   * This handles sparse data where LLM only returns changeover days.
   */
  private getBasePatternMidnightOwner(date: Date): { midnightOwner: CareParent; reason: string } {
    const startOfCycle = this.anchorDate;
    const diffTime = date.getTime() - startOfCycle.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Normalize to 0-13 (assuming 14 day cycle)
    const cycleLength = this.orderJson.cycle_length_days || 14;
    const normalizedIndex = ((diffDays % cycleLength) + cycleLength) % cycleLength;
    const dayNumber = normalizedIndex + 1; // 1-14
    const dayName = format(date, 'EEEE'); // Full day name (e.g., "Wednesday")

    // Try to find entry for current day
    const entry = this.findPatternEntry(dayNumber, dayName);
    if (entry) {
      return { midnightOwner: entry.overnight_care_owner, reason: 'base:pattern' };
    }

    // CARRY-OVER LOGIC: Look back through previous days to find last known owner
    // This handles sparse data and week boundary correctly
    let lookbackDayNumber = dayNumber;
    const maxLookback = cycleLength; // Don't loop forever

    for (let i = 0; i < maxLookback; i++) {
      lookbackDayNumber = this.getPreviousDayNumber(lookbackDayNumber);
      const lookbackDayName = this.getDayNameForDayNumber(lookbackDayNumber);
      const prevEntry = this.findPatternEntry(lookbackDayNumber, lookbackDayName);

      if (prevEntry) {
        // Found previous day's owner - carry over (they still have overnight care)
        return { midnightOwner: prevEntry.overnight_care_owner, reason: 'base:carryover' };
      }
    }

    // Ultimate fallback to primary parent (should rarely hit this with dense data)
    return { midnightOwner: this.orderJson.primary_parent || 'Mother', reason: 'base:default' };
  }

  public calculate(): CareCalculationResult {
    const assignments: DayAssignment[] = [];
    const holidayAssignments: { event: string; year: number; care_with: CareParent }[] = [];

    let motherNights = 0;
    let fatherNights = 0;

    for (let i = 0; i < SIMULATION_DAYS; i++) {
      const currentDate = addDays(this.anchorDate, i);
      const dateStr = format(currentDate, 'yyyy-MM-dd');

      // Hierarchy Check
      let finalOwner: CareParent = 'Mother';
      let finalReason = '';

      const holidayCheck = this.checkHolidayRules(currentDate);
      if (holidayCheck.isHoliday && holidayCheck.midnightOwner) {
        finalOwner = holidayCheck.midnightOwner;
        finalReason = holidayCheck.reason;
      } else {
        const baseCheck = this.getBasePatternMidnightOwner(currentDate);
        finalOwner = baseCheck.midnightOwner;
        finalReason = baseCheck.reason;
      }

      assignments.push({
        date: currentDate,
        dateStr,
        midnightOwner: finalOwner,
        reason: finalReason
      });

      if (finalOwner === 'Mother') motherNights++;
      else fatherNights++;

      if (finalReason.startsWith('holiday:')) {
        const event = finalReason.replace('holiday:', '');
        const year = getYear(currentDate);
        if (!holidayAssignments.find(h => h.event === event && h.year === year)) {
          holidayAssignments.push({ event, year, care_with: finalOwner });
        }
      }
    }

    // Results
    const totalDays = SIMULATION_DAYS;
    const years = totalDays / 365;

    return {
      totalDays,
      motherNights,
      fatherNights,
      motherPercentage: Math.round((motherNights / totalDays) * 100 * 10) / 10,
      fatherPercentage: Math.round((fatherNights / totalDays) * 100 * 10) / 10,
      motherNightsPerYear: Math.round(motherNights / years),
      fatherNightsPerYear: Math.round(fatherNights / years),
      assignments,
      holidayAssignments
    };
  }
}

// Wrapper function matching previous export
export function calculateCareFromOrder(
  orderJson: CourtOrderJSON,
  anchorDate: Date,
  state: AustralianState = 'VIC'
): CareCalculationResult {
  const calculator = new CareCalculator(orderJson, anchorDate, state);
  return calculator.calculate();
}

/**
 * Dummy Data in new format for testing/previews
 */
export const DUMMY_COURT_ORDER: CourtOrderJSON = {
  start_date: '2024-01-01',
  cycle_length_days: 14,
  primary_parent: 'Mother',
  base_pattern: Array.from({ length: 14 }, (_, i) => ({
    day_number: i + 1,
    day_name: 'Day ' + (i + 1),
    week_number: i < 7 ? 1 : 2,
    overnight_care_owner: (i === 5 || i === 6) ? 'Father' : 'Mother' // Father has Sat/Sun of Week 1
  })),
  holiday_rules: {
    christmas: { applies: true, rule_type: 'alternating', details: 'Father even years' },
    school_holidays: { applies: true, rule_type: 'half_half', details: 'Split half half' }
  }
};
