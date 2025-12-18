/**
 * Date utility functions for Australian date format (dd/mm/yyyy)
 */

/**
 * Parse Australian date format (dd/mm/yyyy) to Date object
 * @param dateStr - Date string in dd/mm/yyyy format
 * @returns Date object or null if invalid
 */
export function parseAustralianDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === '') {
    return null;
  }

  // Match dd/mm/yyyy format
  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = dateStr.trim().match(regex);

  if (!match) {
    return null;
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  // Validate ranges
  if (month < 1 || month > 12) {
    return null;
  }

  if (day < 1 || day > 31) {
    return null;
  }

  // Create date (month is 0-indexed in JavaScript)
  const date = new Date(year, month - 1, day);

  // Check if date is valid (handles invalid dates like 31/02/2024)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

/**
 * Check if a date string is within the next N days
 * @param dateStr - Date string in dd/mm/yyyy format
 * @param days - Number of days to check (default: 30)
 * @returns true if date is within the specified days, false otherwise
 */
export function isWithinDays(dateStr: string, days: number = 30): boolean {
  const date = parseAustralianDate(dateStr);
  
  if (!date) {
    return false;
  }

  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);

  return date >= now && date <= futureDate;
}

/**
 * Validate Australian date format
 * @param dateStr - Date string to validate
 * @returns true if valid dd/mm/yyyy format, false otherwise
 */
export function isValidAustralianDate(dateStr: string): boolean {
  return parseAustralianDate(dateStr) !== null;
}
