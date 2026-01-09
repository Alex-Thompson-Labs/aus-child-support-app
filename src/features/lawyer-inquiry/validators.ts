/**
 * Lawyer Inquiry Feature - Validators
 *
 * Domain-specific validation functions for the lawyer inquiry form.
 * Re-exports shared validators from src/utils/form-validation.ts.
 */

// Re-export shared validators for convenience
export {
  sanitizeEmail,
  sanitizePhone, sanitizeString, validateConsent, validateEmail, validateName, validatePhone, VALIDATION
} from '@/src/utils/form-validation';

import {
  sanitizeString,
  VALIDATION,
} from '@/src/utils/form-validation';

// ============================================================================
// Domain-Specific Validators
// ============================================================================

/**
 * Validate postcode field (Australian 4-digit)
 */
export function validatePostcode(postcode: string): string | undefined {
  const sanitized = postcode.trim();

  if (!sanitized) {
    return 'Postcode is required';
  }

  // Australian postcode validation: exactly 4 digits
  if (!/^\d{4}$/.test(sanitized)) {
    return 'Please enter a valid 4-digit Australian postcode';
  }

  return undefined;
}

/**
 * Validate court date field (required if visible)
 */
export function validateCourtDate(
  courtDate: Date | null,
  isRequired: boolean
): string | undefined {
  if (!isRequired) {
    return undefined;
  }

  if (!courtDate) {
    return 'Court date is required';
  }

  // Date is already a valid Date object from the picker
  return undefined;
}

/**
 * Validate financial tags (required if "hiding income" reason is present or inquiry type is 'hidden_income')
 */
export function validateFinancialTags(
  tags: string[],
  specialCircumstances: string[] | null,
  reason: string | undefined
): string | undefined {
  // Check if specialCircumstances includes 'income_resources_not_reflected'
  // This ID corresponds to "Is the other parent hiding any income..."
  const hasHidingIncomeReason = specialCircumstances?.includes(
    'income_resources_not_reflected'
  );

  // Also require if inquiry type is 'hidden_income'
  const isHiddenIncomeInquiry = reason === 'hidden_income';

  if ((hasHidingIncomeReason || isHiddenIncomeInquiry) && tags.length === 0) {
    return 'Please select at least one financial issue type.';
  }

  return undefined;
}

/**
 * Validate manual income field (required in Direct Mode)
 */
export function validateManualIncome(
  income: string,
  fieldName: string
): string | undefined {
  const trimmed = income.trim();

  if (!trimmed) {
    return `${fieldName} is required`;
  }

  // Strip non-digits for validation (matching calculator pattern)
  const cleaned = trimmed.replace(/[^0-9]/g, '');
  const num = parseInt(cleaned, 10);

  if (isNaN(num) || num < 0) {
    return 'Please enter a valid income amount';
  }

  return undefined;
}

/**
 * Validate manual children count (required in Direct Mode)
 */
export function validateManualChildren(children: string): string | undefined {
  const trimmed = children.trim();

  if (!trimmed) {
    return 'Number of children is required';
  }

  const num = parseInt(trimmed, 10);

  if (isNaN(num) || num < 1 || num > 20) {
    return 'Please enter a valid number (1-20)';
  }

  return undefined;
}

/**
 * Validate message field (conditionally required based on financialTags)
 */
export function validateMessage(
  message: string,
  financialTags: string[],
  preFillMessage?: string
): string | undefined {
  const sanitized = sanitizeString(message);

  // If "Other" is selected in financial tags, message becomes required
  if (financialTags.includes('Other')) {
    if (!sanitized) {
      return 'Please provide details about the "Other" financial issue';
    }
    if (sanitized.length < VALIDATION.MESSAGE_MIN_LENGTH) {
      return `Details must be at least ${VALIDATION.MESSAGE_MIN_LENGTH} characters`;
    }
    // Check if message is identical to pre-filled message
    if (preFillMessage && sanitized === sanitizeString(preFillMessage)) {
      return "Please add details explaining the 'Other' financial issue";
    }
  }

  // Check max length regardless of whether it's required
  if (sanitized.length > VALIDATION.MESSAGE_MAX_LENGTH) {
    return `Message must be less than ${VALIDATION.MESSAGE_MAX_LENGTH} characters`;
  }

  // Otherwise, message is optional - no validation needed
  return undefined;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format court date as a string for complexity_reasons array
 * Example: court_date_12_jan_2026
 */
export function formatCourtDateForReasons(courtDate: Date): string {
  const day = courtDate.getDate();
  const monthNames = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ];
  const month = monthNames[courtDate.getMonth()];
  const year = courtDate.getFullYear();

  return `court_date_${day}_${month}_${year}`;
}

/**
 * Build complexity triggers array based on button-driven logic only.
 *
 * All triggers are interaction-based - they reflect which card the user clicked,
 * not background calculation states.
 *
 * @param trigger - Navigation parameter indicating which card was clicked
 * @param specialCircumstances - Array of complexity reason IDs (unused, kept for API compatibility)
 * @param financialTags - Array of financial issue tags (unused, kept for API compatibility)
 * @param careData - Array of care arrangements for each child (unused, kept for API compatibility)
 * @param liability - Annual liability amount as a string (unused, kept for API compatibility)
 * @returns Array containing the clicked trigger, or null if empty
 */
export function buildComplexityTriggers(
  trigger: string,
  specialCircumstances: string[] | null,
  financialTags: string[],
  careData: { index: number; careA: number; careB: number }[],
  liability: string
): string[] | null {
  const activeTriggers: string[] = [];

  // All rules are button-driven only - based on which card was clicked

  if (trigger === 'binding_agreement') {
    activeTriggers.push('binding_agreement');
  }

  if (trigger === 'low_assessment') {
    activeTriggers.push('low_assessment');
  }

  if (trigger === 'payer_reversal') {
    activeTriggers.push('payer_reversal');
  }

  if (trigger === 'high_value_case') {
    activeTriggers.push('high_value_case');
  }

  if (trigger === 'shared_care_dispute') {
    activeTriggers.push('shared_care_dispute');
  }

  // Return null if array is empty, otherwise return the array
  return activeTriggers.length > 0 ? activeTriggers : null;
}
