/**
 * Form Validation Utilities
 *
 * Shared validation and sanitization functions for form inputs.
 * Used across inquiry forms to ensure consistent data validation.
 */

// ============================================================================
// Validation Constants
// ============================================================================

import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 1000,
  EMAIL_REGEX:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
  // Simple email regex for basic validation (used in LawyerInquiryScreen)
  EMAIL_REGEX_SIMPLE: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// ============================================================================
// Sanitization Functions
// ============================================================================

/**
 * Sanitize a general string input
 * Trims whitespace and normalizes multiple spaces to single space
 *
 * @param value - The string to sanitize
 * @returns Sanitized string
 *
 * @example
 * sanitizeString('  John   Doe  ') // 'John Doe'
 */
export function sanitizeString(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

/**
 * Sanitize an email address
 * Trims whitespace and converts to lowercase
 *
 * @param email - The email to sanitize
 * @returns Sanitized email string
 *
 * @example
 * sanitizeEmail('  John@Example.COM  ') // 'john@example.com'
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Sanitize a phone number
 * Uses libphonenumber-js to parse and format to E.164 if valid.
 * Fallback to removing non-digit characters (except leading +).
 *
 * @param phone - The phone number to sanitize
 * @returns Sanitized phone number (E.164 format if valid, or cleaned string)
 *
 * @example
 * sanitizePhone('0412 345 678') // '+61412345678'
 */
export function sanitizePhone(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return '';

  try {
    const phoneNumber = parsePhoneNumber(trimmed, 'AU');
    if (phoneNumber && phoneNumber.isValid()) {
      return phoneNumber.format('E.164');
    }
  } catch {
    // Ignore parsing errors and fall back to basic sanitization
  }

  const hasPlus = trimmed.startsWith('+');
  const digitsOnly = trimmed.replace(/\D/g, '');
  return hasPlus ? `+${digitsOnly}` : digitsOnly;
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate a name field
 *
 * @param name - The name to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateName(name: string): string | undefined {
  const sanitized = sanitizeString(name);
  if (!sanitized) return 'Name is required';
  if (sanitized.length < VALIDATION.NAME_MIN_LENGTH) {
    return `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`;
  }
  if (sanitized.length > VALIDATION.NAME_MAX_LENGTH) {
    return `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`;
  }
  return undefined;
}

/**
 * Validate an email address (strict validation)
 * Uses comprehensive regex pattern
 *
 * @param email - The email to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateEmail(email: string): string | undefined {
  const sanitized = sanitizeEmail(email);
  if (!sanitized) return 'Email is required';
  if (!VALIDATION.EMAIL_REGEX.test(sanitized)) {
    return 'Please enter a valid email address';
  }
  return undefined;
}

/**
 * Validate an email address (simple validation)
 * Uses basic regex pattern for less strict validation
 *
 * @param email - The email to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateEmailSimple(email: string): string | undefined {
  const sanitized = sanitizeEmail(email);
  if (!sanitized) return 'Email is required';
  if (!VALIDATION.EMAIL_REGEX_SIMPLE.test(sanitized)) {
    return 'Please enter a valid email address';
  }
  return undefined;
}

/**
 * Validate a phone number using libphonenumber-js
 * Phone is optional, but if provided must match a valid phone number pattern.
 * Defaults to 'AU' region if country code is missing.
 *
 * @param phone - The phone number to validate
 * @returns Error message if invalid, undefined if valid or empty
 */
export function validatePhone(phone: string): string | undefined {
  const trimmed = phone.trim();
  if (!trimmed) return undefined; // Optional field

  if (!isValidPhoneNumber(trimmed, 'AU')) {
    return 'Please enter a valid phone number';
  }
  return undefined;
}

/**
 * Validate a message field
 *
 * @param message - The message to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateMessage(message: string): string | undefined {
  const sanitized = sanitizeString(message);
  if (!sanitized) return 'Message is required';
  if (sanitized.length < VALIDATION.MESSAGE_MIN_LENGTH) {
    return `Message must be at least ${VALIDATION.MESSAGE_MIN_LENGTH} characters`;
  }
  if (sanitized.length > VALIDATION.MESSAGE_MAX_LENGTH) {
    return `Message must be less than ${VALIDATION.MESSAGE_MAX_LENGTH} characters`;
  }
  return undefined;
}

/**
 * Validate consent checkbox
 *
 * @param consent - The consent boolean value
 * @returns Error message if not consented, undefined if valid
 */
export function validateConsent(consent: boolean): string | undefined {
  if (!consent) return 'You must consent to continue';
  return undefined;
}
