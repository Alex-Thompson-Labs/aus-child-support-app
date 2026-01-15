/**
 * Formatting Utilities
 *
 * Shared formatting functions for consistent display across the application.
 */

/**
 * Format a number as currency (Australian Dollar) with 2 decimal places
 *
 * Handles negative numbers with proper formatting:
 * - Negative values display as: -$1,234.56 (standard accounting format)
 * - Ensures the negative sign is always before the currency symbol
 *
 * @param value - The numeric value to format (can be number, undefined, or null)
 * @returns Formatted currency string (e.g., "$1,234.56", "-$1,234.56", or "$0.00" for invalid values)
 *
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(-1234.56) // "-$1,234.56"
 * formatCurrency(null) // "$0.00"
 * formatCurrency(undefined) // "$0.00"
 */
export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '$0.00';
  }

  // Handle negative numbers: ensure negative sign appears before the dollar sign
  const isNegative = value < 0;
  const absoluteValue = Math.abs(value);
  const formattedAmount = absoluteValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return isNegative ? `-$${formattedAmount}` : `$${formattedAmount}`;
}
