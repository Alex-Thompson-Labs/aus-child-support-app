/**
 * Court Order Care Calculator (Refactored)
 * 
 * Calculates care percentages based on parsed court order JSON.
 * 
 * KEY RULES:
 * 1. MIDNIGHT RULE: Care is determined by who has the child at 11:59 PM.
 *    Day-only contact (9am-5pm) counts as 0 nights and does NOT change midnight owner.
 * 
 * 2. HOLIDAY SUSPENSION: Strict hierarchy - if a date falls within a holiday_block,
 *    the base_pattern is completely IGNORED. Holiday rules take precedence.
 * 
 * 3. 730-DAY SIMULATION: Runs 2 years to average odd/even year schedules.
 */

import {
    addDays,
    format,
    getDay,
    getMonth,
    getYear,
    isWithinInterval
} from 'date-fns';

// ============================================================================
// Types
// ============================================================================

export type CareParent = 'Mother' | 'Father';

export interface BasePatternEntry {
  day: string; // 'Monday', 'Tuesday', etc.
  week: 1 | 2; // Week 1 or Week 2 in the cycle
  care_with: CareParent;
  notes?: string; // e.g., "From 9:00am", "Until 5:00pm"
}

export interface SpecialOverride {
  event: string; // e.g., "Mothers Day", "Fathers Day", "Child Birthday"
  rule: string;  // e.g., "Mother has care 9am-5pm"
}

export interface HolidayBlock {
  event: string; // e.g., "Christmas", "School Holidays", "Easter"
  rule: string;  // e.g., "Even Years: Father 24-26 Dec. Odd Years: Mother."
}

export interface CourtOrderJSON {
  cycle_length_days: number;
  base_pattern: BasePatternEntry[];
  special_overrides?: SpecialOverride[];
  holiday_blocks?: HolidayBlock[];
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
// Constants
// ============================================================================

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SIMULATION_DAYS = 730; // 2 years

// ============================================================================
// Australian School Holiday Dates (Mock Data)
// Returns approximate school holiday periods for a given year
// ============================================================================

interface DateRange {
  start: Date;
  end: Date;
  name: string;
}

export function getSchoolHolidays(year: number): DateRange[] {
  return [
    // Term 1 holidays (April - ~2 weeks around Easter)
    { start: new Date(year, 3, 5), end: new Date(year, 3, 21), name: 'April Holidays' },
    // Term 2 holidays (July - ~2 weeks)
    { start: new Date(year, 6, 1), end: new Date(year, 6, 14), name: 'July Holidays' },
    // Term 3 holidays (September - ~2 weeks)
    { start: new Date(year, 8, 21), end: new Date(year, 9, 6), name: 'September Holidays' },
    // Summer holidays (Dec-Jan - ~6 weeks)
    { start: new Date(year, 11, 18), end: new Date(year + 1, 0, 28), name: 'Summer Holidays' },
    // Also include the tail end of previous year's summer holidays
    { start: new Date(year - 1, 11, 18), end: new Date(year, 0, 28), name: 'Summer Holidays' },
  ];
}

/**
 * Check if a date falls within any school holiday period
 */
export function isSchoolHoliday(date: Date): { isHoliday: boolean; holidayName: string | null } {
  const year = getYear(date);
  const holidays = getSchoolHolidays(year);
  
  for (const holiday of holidays) {
    if (isWithinInterval(date, { start: holiday.start, end: holiday.end })) {
      return { isHoliday: true, holidayName: holiday.name };
    }
  }
  return { isHoliday: false, holidayName: null };
}

// ============================================================================
// Australian Public Holidays (Mock Data)
// ============================================================================

interface PublicHoliday {
  name: string;
  getDate: (year: number) => Date;
}

const PUBLIC_HOLIDAYS: PublicHoliday[] = [
  { name: 'New Years Day', getDate: (y) => new Date(y, 0, 1) },
  { name: 'Australia Day', getDate: (y) => new Date(y, 0, 26) },
  // Easter (approximate - Good Friday through Easter Monday)
  { name: 'Good Friday', getDate: (y) => getEasterDate(y, -2) },
  { name: 'Easter Saturday', getDate: (y) => getEasterDate(y, -1) },
  { name: 'Easter Sunday', getDate: (y) => getEasterDate(y, 0) },
  { name: 'Easter Monday', getDate: (y) => getEasterDate(y, 1) },
  { name: 'Anzac Day', getDate: (y) => new Date(y, 3, 25) },
  // King's Birthday (2nd Monday of June in most states)
  { name: 'Kings Birthday', getDate: (y) => getNthWeekdayOfMonth(y, 5, 1, 2) },
  { name: 'Christmas Day', getDate: (y) => new Date(y, 11, 25) },
  { name: 'Boxing Day', getDate: (y) => new Date(y, 11, 26) },
];

/**
 * Calculate Easter Sunday date using Anonymous Gregorian algorithm
 */
function getEasterDate(year: number, offset: number = 0): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return addDays(new Date(year, month, day), offset);
}

/**
 * Get the nth weekday of a month (e.g., 2nd Monday of June)
 */
function getNthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = getDay(firstDay);
  let dayOffset = weekday - firstWeekday;
  if (dayOffset < 0) dayOffset += 7;
  const day = 1 + dayOffset + (n - 1) * 7;
  return new Date(year, month, day);
}

/**
 * Check if a date is a public holiday
 */
export function isPublicHoliday(date: Date): { isHoliday: boolean; holidayName: string | null } {
  const year = getYear(date);
  const dateStr = format(date, 'yyyy-MM-dd');
  
  for (const holiday of PUBLIC_HOLIDAYS) {
    const holidayDate = holiday.getDate(year);
    if (format(holidayDate, 'yyyy-MM-dd') === dateStr) {
      return { isHoliday: true, holidayName: holiday.name };
    }
  }
  return { isHoliday: false, holidayName: null };
}

/**
 * Check if a date is part of a long weekend (Sat-Sun-Mon with Monday being public holiday)
 */
export function isLongWeekend(date: Date): boolean {
  const dayOfWeek = getDay(date);
  
  // Check if this is a Saturday or Sunday before a Monday public holiday
  if (dayOfWeek === 6) { // Saturday
    const monday = addDays(date, 2);
    return isPublicHoliday(monday).isHoliday;
  }
  if (dayOfWeek === 0) { // Sunday
    const monday = addDays(date, 1);
    return isPublicHoliday(monday).isHoliday;
  }
  if (dayOfWeek === 1) { // Monday
    return isPublicHoliday(date).isHoliday;
  }
  return false;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getDayName(date: Date): string {
  return DAY_NAMES[getDay(date)];
}

/**
 * Determine which week (1 or 2) a date falls into based on anchor date
 */
function getWeekNumber(date: Date, anchorDate: Date, cycleLengthDays: number): 1 | 2 {
  const diffTime = date.getTime() - anchorDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const normalizedDays = ((diffDays % cycleLengthDays) + cycleLengthDays) % cycleLengthDays;
  const weekLength = cycleLengthDays / 2;
  return normalizedDays < weekLength ? 1 : 2;
}

/**
 * Check if a note indicates overnight care (has the child at midnight)
 * Returns false for day-only contact like "9am-5pm"
 */
function isOvernightCare(notes?: string): boolean {
  if (!notes) return true; // No notes = assume overnight
  
  const lower = notes.toLowerCase();
  
  // Day-only patterns (NO overnight)
  if (lower.includes('9am-5pm') || lower.includes('9:00am-5:00pm')) return false;
  if (lower.includes('9am to 5pm') || lower.includes('9:00am to 5:00pm')) return false;
  if (lower.match(/\d{1,2}(:\d{2})?\s*(am)?\s*(-|to)\s*\d{1,2}(:\d{2})?\s*pm/i)) {
    // Pattern like "10am-4pm" or "10:00am to 4:00pm" - day only
    return false;
  }
  
  // "Until X:XXpm" on the same day means they DON'T have midnight
  if (lower.includes('until') && lower.includes('pm') && !lower.includes('am')) {
    // e.g., "Until 5:00pm" - they leave before midnight
    return false;
  }
  
  // "From X:XXam" means they START that day - check if it implies overnight
  if (lower.includes('from') && !lower.includes('until')) {
    // "From 9:00am" with no end time - assume they have overnight
    return true;
  }
  
  return true; // Default to overnight if unclear
}

/**
 * Check if a note indicates the care extends to Monday on long weekends
 */
function extendsOnLongWeekend(notes?: string): boolean {
  if (!notes) return false;
  const lower = notes.toLowerCase();
  return lower.includes('long weekend') || lower.includes('public holiday');
}

// ============================================================================
// Christmas Rule Parser
// ============================================================================

interface ChristmasAssignment {
  applies: boolean;
  midnightOwner: CareParent | null;
}

function parseChristmasRule(date: Date, rule: string): ChristmasAssignment {
  const month = getMonth(date);
  const day = date.getDate();
  const year = getYear(date);
  const isEvenYear = year % 2 === 0;
  
  // Only applies to Dec 24-26
  if (month !== 11 || day < 24 || day > 26) {
    return { applies: false, midnightOwner: null };
  }
  
  const ruleLower = rule.toLowerCase();
  
  // Parse "Even Years: Father 24-26 Dec. Odd Years: Mother."
  if (ruleLower.includes('even') && ruleLower.includes('odd')) {
    if (isEvenYear) {
      // Even year - check who has it
      if (ruleLower.includes('even') && ruleLower.includes('father')) {
        return { applies: true, midnightOwner: 'Father' };
      }
      return { applies: true, midnightOwner: 'Mother' };
    } else {
      // Odd year
      if (ruleLower.includes('odd') && ruleLower.includes('mother')) {
        return { applies: true, midnightOwner: 'Mother' };
      }
      return { applies: true, midnightOwner: 'Father' };
    }
  }
  
  // Fallback: alternate by year
  return { applies: true, midnightOwner: isEvenYear ? 'Father' : 'Mother' };
}

// ============================================================================
// School Holiday Rule Parser
// ============================================================================

interface SchoolHolidayAssignment {
  applies: boolean;
  midnightOwner: CareParent | null;
}

function parseSchoolHolidayRule(
  date: Date,
  rule: string,
  holidayPeriod: DateRange
): SchoolHolidayAssignment {
  const ruleLower = rule.toLowerCase();
  
  // "Father has half of all holidays" - split the period
  if (ruleLower.includes('half')) {
    const start = holidayPeriod.start.getTime();
    const end = holidayPeriod.end.getTime();
    const midpoint = start + (end - start) / 2;
    const dateTime = date.getTime();
    
    // First half to Father, second half to Mother (or vice versa based on rule)
    if (ruleLower.includes('father')) {
      return {
        applies: true,
        midnightOwner: dateTime < midpoint ? 'Father' : 'Mother',
      };
    } else {
      return {
        applies: true,
        midnightOwner: dateTime < midpoint ? 'Mother' : 'Father',
      };
    }
  }
  
  // Default: alternate weeks
  const dayInHoliday = Math.floor((date.getTime() - holidayPeriod.start.getTime()) / (1000 * 60 * 60 * 24));
  const weekInHoliday = Math.floor(dayInHoliday / 7);
  return {
    applies: true,
    midnightOwner: weekInHoliday % 2 === 0 ? 'Father' : 'Mother',
  };
}

// ============================================================================
// Main Calculator Class
// ============================================================================

export class CareCalculator {
  private orderJson: CourtOrderJSON;
  private anchorDate: Date;
  
  constructor(orderJson: CourtOrderJSON, anchorDate: Date) {
    this.orderJson = orderJson;
    this.anchorDate = anchorDate;
  }
  
  /**
   * STEP 1: Check if date falls within any holiday block
   * If yes, return the midnight owner based on holiday rules
   * Holiday blocks COMPLETELY SUSPEND the base pattern
   */
  private checkHolidayBlocks(date: Date): { isHoliday: boolean; midnightOwner: CareParent | null; reason: string } {
    if (!this.orderJson.holiday_blocks) {
      return { isHoliday: false, midnightOwner: null, reason: '' };
    }
    
    for (const block of this.orderJson.holiday_blocks) {
      // Christmas block
      if (block.event.toLowerCase() === 'christmas') {
        const result = parseChristmasRule(date, block.rule);
        if (result.applies) {
          return { isHoliday: true, midnightOwner: result.midnightOwner, reason: 'holiday:Christmas' };
        }
      }
      
      // School Holidays block
      if (block.event.toLowerCase() === 'school holidays') {
        const schoolHolidayCheck = isSchoolHoliday(date);
        if (schoolHolidayCheck.isHoliday) {
          // Find the specific holiday period for proper splitting
          const year = getYear(date);
          const holidays = getSchoolHolidays(year);
          const currentPeriod = holidays.find(h => 
            isWithinInterval(date, { start: h.start, end: h.end })
          );
          
          if (currentPeriod) {
            const result = parseSchoolHolidayRule(date, block.rule, currentPeriod);
            return { 
              isHoliday: true, 
              midnightOwner: result.midnightOwner, 
              reason: `holiday:${schoolHolidayCheck.holidayName}` 
            };
          }
        }
      }
      
      // Easter block (if specified separately)
      if (block.event.toLowerCase() === 'easter') {
        const easterCheck = isPublicHoliday(date);
        if (easterCheck.isHoliday && easterCheck.holidayName?.includes('Easter')) {
          const year = getYear(date);
          const isEvenYear = year % 2 === 0;
          return { 
            isHoliday: true, 
            midnightOwner: isEvenYear ? 'Father' : 'Mother', 
            reason: 'holiday:Easter' 
          };
        }
      }
    }
    
    return { isHoliday: false, midnightOwner: null, reason: '' };
  }
  
  /**
   * STEP 2: Check base pattern (only if NOT in a holiday block)
   * Determines midnight owner based on Week 1/Week 2 cycle
   */
  private getBasePatternMidnightOwner(date: Date): { midnightOwner: CareParent; reason: string } {
    const dayName = getDayName(date);
    const weekNum = getWeekNumber(date, this.anchorDate, this.orderJson.cycle_length_days);
    
    // Find matching pattern entry for this day/week
    const entry = this.orderJson.base_pattern.find(
      (p) => p.day === dayName && p.week === weekNum
    );
    
    if (entry) {
      // Check if this is overnight care or just day contact
      if (isOvernightCare(entry.notes)) {
        // Check for long weekend extension
        if (dayName === 'Monday' && extendsOnLongWeekend(entry.notes)) {
          if (isLongWeekend(date)) {
            return { midnightOwner: entry.care_with, reason: 'base:longWeekend' };
          }
          // Not a long weekend, so Monday rule doesn't apply
          return { midnightOwner: 'Mother', reason: 'base:default' };
        }
        return { midnightOwner: entry.care_with, reason: 'base' };
      }
      // Day-only contact - doesn't change midnight owner
    }
    
    // Check if previous day's care extends overnight
    // e.g., Saturday "From 9:00am" implies overnight into Sunday
    const prevDayName = DAY_NAMES[(getDay(date) + 6) % 7];
    const prevEntry = this.orderJson.base_pattern.find(
      (p) => p.day === prevDayName && p.week === weekNum
    );
    
    if (prevEntry && isOvernightCare(prevEntry.notes)) {
      // Check if the current day has an "Until" time that ends the stay
      const currentEntry = this.orderJson.base_pattern.find(
        (p) => p.day === dayName && p.week === weekNum
      );
      if (currentEntry?.notes?.toLowerCase().includes('until')) {
        // They leave during the day, so they DON'T have midnight tonight
        return { midnightOwner: 'Mother', reason: 'base:default' };
      }
    }
    
    // Default: Mother has midnight (common default in Australian orders)
    return { midnightOwner: 'Mother', reason: 'base:default' };
  }
  
  /**
   * Special overrides (Mother's Day, Father's Day, Birthdays)
   * These are DAY-ONLY and do NOT change midnight ownership
   * They're tracked for display purposes but don't affect the count
   */
  private checkSpecialOverrides(date: Date): { hasOverride: boolean; event: string | null } {
    if (!this.orderJson.special_overrides) {
      return { hasOverride: false, event: null };
    }
    
    const month = getMonth(date);
    const dayOfWeek = getDay(date);
    const dayOfMonth = date.getDate();
    
    for (const override of this.orderJson.special_overrides) {
      // Mother's Day (2nd Sunday of May in Australia)
      if (override.event.toLowerCase().includes('mother') && 
          month === 4 && dayOfWeek === 0 && dayOfMonth >= 8 && dayOfMonth <= 14) {
        return { hasOverride: true, event: "Mother's Day" };
      }
      
      // Father's Day (1st Sunday of September in Australia)
      if (override.event.toLowerCase().includes('father') && 
          month === 8 && dayOfWeek === 0 && dayOfMonth >= 1 && dayOfMonth <= 7) {
        return { hasOverride: true, event: "Father's Day" };
      }
    }
    
    return { hasOverride: false, event: null };
  }
  
  /**
   * Calculate midnight owner for a single date
   * Implements strict hierarchy: Holiday > Base Pattern
   */
  private calculateMidnightOwner(date: Date): DayAssignment {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // HIERARCHY STEP 1: Check holiday blocks (suspends base pattern)
    const holidayCheck = this.checkHolidayBlocks(date);
    if (holidayCheck.isHoliday && holidayCheck.midnightOwner) {
      return {
        date,
        dateStr,
        midnightOwner: holidayCheck.midnightOwner,
        reason: holidayCheck.reason,
      };
    }
    
    // HIERARCHY STEP 2: Apply base pattern (only if not in holiday)
    const baseResult = this.getBasePatternMidnightOwner(date);
    return {
      date,
      dateStr,
      midnightOwner: baseResult.midnightOwner,
      reason: baseResult.reason,
    };
  }
  
  /**
   * Run the full 730-day simulation
   * Returns care percentages based strictly on midnight ownership
   */
  public calculate(): CareCalculationResult {
    const assignments: DayAssignment[] = [];
    const holidayAssignments: { event: string; year: number; care_with: CareParent }[] = [];
    
    let motherNights = 0;
    let fatherNights = 0;
    
    // Generate 730 days starting from anchor date
    for (let i = 0; i < SIMULATION_DAYS; i++) {
      const currentDate = addDays(this.anchorDate, i);
      const assignment = this.calculateMidnightOwner(currentDate);
      
      assignments.push(assignment);
      
      // Count nights based on midnight owner
      if (assignment.midnightOwner === 'Mother') {
        motherNights++;
      } else {
        fatherNights++;
      }
      
      // Track holiday assignments for visual verification
      if (assignment.reason.startsWith('holiday:')) {
        const event = assignment.reason.replace('holiday:', '');
        const year = getYear(currentDate);
        
        // Only add unique event/year combinations
        const existing = holidayAssignments.find(
          (h) => h.event === event && h.year === year
        );
        if (!existing) {
          holidayAssignments.push({
            event,
            year,
            care_with: assignment.midnightOwner,
          });
        }
      }
    }
    
    // Calculate percentages and annualized averages
    const motherPercentage = (motherNights / SIMULATION_DAYS) * 100;
    const fatherPercentage = (fatherNights / SIMULATION_DAYS) * 100;
    
    // Annualized (730 days = 2 years, so divide by 2)
    const motherNightsPerYear = Math.round(motherNights / 2);
    const fatherNightsPerYear = Math.round(fatherNights / 2);
    
    return {
      totalDays: SIMULATION_DAYS,
      motherNights,
      fatherNights,
      motherPercentage: Math.round(motherPercentage * 10) / 10,
      fatherPercentage: Math.round(fatherPercentage * 10) / 10,
      motherNightsPerYear,
      fatherNightsPerYear,
      assignments,
      holidayAssignments,
    };
  }
}

// ============================================================================
// Convenience Function
// ============================================================================

export function calculateCareFromOrder(
  orderJson: CourtOrderJSON,
  anchorDate: Date
): CareCalculationResult {
  const calculator = new CareCalculator(orderJson, anchorDate);
  return calculator.calculate();
}

// ============================================================================
// Updated Dummy Data (matches new schema)
// ============================================================================

export const DUMMY_COURT_ORDER: CourtOrderJSON = {
  cycle_length_days: 14,
  base_pattern: [
    // Week 1: Father has Saturday overnight, returns Sunday afternoon
    { day: 'Saturday', week: 1, care_with: 'Father', notes: 'From 9:00am' },
    { day: 'Sunday', week: 1, care_with: 'Father', notes: 'Until 5:00pm' },
    { day: 'Monday', week: 1, care_with: 'Father', notes: 'Until 5:00pm if weekend is a long weekend' },
    // Week 2: No overnight (Mother has full week)
  ],
  special_overrides: [
    { event: 'Mothers Day', rule: 'Mother has care 9am-5pm' },
    { event: 'Fathers Day', rule: 'Father has care 9am-5pm' },
  ],
  holiday_blocks: [
    { event: 'Christmas', rule: 'Even Years: Father 24-26 Dec. Odd Years: Mother.' },
    { event: 'School Holidays', rule: 'Father has half of all holidays.' },
  ],
};
