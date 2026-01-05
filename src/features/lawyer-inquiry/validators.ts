/**
 * Lawyer Inquiry Feature - Validators
 *
 * Domain-specific validation functions for the lawyer inquiry form.
 * Re-exports shared validators from src/utils/form-validation.ts.
 */

// Re-export shared validators for convenience
export {
  validateName,
  validateEmail,
  validatePhone,
  validateConsent,
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  VALIDATION,
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
 * Build complexity triggers array based on accumulative logic.
 *
 * Rules (Accumulative):
 * 1. High Alert (Data-Driven): If specialCircumstances is not empty OR financialTags is not empty OR liability > 15000 -> push 'high_alert'
 * 2. Shared Care (Data-Driven): If any child has care percentage between 35% and 65% (inclusive) -> push 'shared_care'
 * 3. Binding Agreement (Button-Driven ONLY): ONLY push 'binding_agreement' if trigger === 'binding_agreement'
 *    - Do not infer from other data
 *    - If they came via "High Alert", do not add "Binding Agreement" even if they fit the criteria
 *
 * @param trigger - Navigation parameter indicating entry point
 * @param specialCircumstances - Array of complexity reason IDs
 * @param financialTags - Array of financial issue tags
 * @param careData - Array of care arrangements for each child
 * @param liability - Annual liability amount as a string
 * @returns Array of active triggers, or null if empty
 */
export function buildComplexityTriggers(
  trigger: string,
  specialCircumstances: string[] | null,
  financialTags: string[],
  careData: { index: number; careA: number; careB: number }[],
  liability: string
): string[] | null {
  const activeTriggers: string[] = [];

  // Parse liability to a number
  const liabilityAmount = parseFloat(liability) || 0;

  // Rule 1: High Alert (Data-Driven)
  // IF specialCircumstances is not empty OR financialTags is not empty OR liability > 15000 -> push 'high_alert'
  if (
    (specialCircumstances && specialCircumstances.length > 0) ||
    financialTags.length > 0 ||
    liabilityAmount > 15000
  ) {
    activeTriggers.push('high_alert');
  }

  // Rule 2: Shared Care (Data-Driven)
  // Check if any child has care percentage between 35% and 65% (inclusive)
  const hasSharedCare = careData.some((child) => {
    const careAPercent = child.careA;
    const careBPercent = child.careB;
    return (
      (careAPercent >= 35 && careAPercent <= 65) ||
      (careBPercent >= 35 && careBPercent <= 65)
    );
  });

  if (hasSharedCare) {
    activeTriggers.push('shared_care');
  }

  // Rule 3: Binding Agreement (Button-Driven ONLY)
  // ONLY push if the user explicitly entered via the agreement button
  if (trigger === 'binding_agreement') {
    activeTriggers.push('binding_agreement');
  }

  // Return null if array is empty, otherwise return the array
  return activeTriggers.length > 0 ? activeTriggers : null;
}
