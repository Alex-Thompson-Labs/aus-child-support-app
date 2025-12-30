/**
 * Formatting Utilities
 * 
 * Shared formatting functions for consistent display across the application.
 */

/**
 * Format a number as currency (Australian Dollar)
 * 
 * @param value - The numeric value to format (can be number, undefined, or null)
 * @returns Formatted currency string (e.g., "$1,234" or "$0" for invalid values)
 * 
 * @example
 * formatCurrency(1234.56) // "$1,235"
 * formatCurrency(null) // "$0"
 * formatCurrency(undefined) // "$0"
 */
export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "$0";
  }
  return `$${Math.round(value).toLocaleString()}`;
}
