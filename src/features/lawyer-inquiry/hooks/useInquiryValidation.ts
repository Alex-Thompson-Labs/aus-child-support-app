/**
 * Lawyer Inquiry Feature - Validation Hook
 *
 * Handles Zod schema and field validation logic.
 */

import { useCallback, useMemo } from 'react';
import type { FormErrors, FormTouched } from '../types';
import {
    validateConsent,
    validateCourtDate,
    validateEmail,
    validateFinancialTags,
    validateManualChildren,
    validateManualIncome,
    validateMessage,
    validateName,
    validatePhone,
    validatePostcode,
    VALIDATION,
} from '../validators';
import type { LeadFormValue } from './useInquiryForm';

/**
 * Debounce utility for validation
 */
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export interface UseInquiryValidationProps {
  // Form values
  name: string;
  email: string;
  phone: string;
  postcode: string;
  message: string;
  consent: boolean;
  courtDate: Date | null;
  financialTags: string[];
  manualIncomeA: string;
  manualIncomeB: string;
  manualChildren: string;

  // Context
  shouldShowCourtDate: boolean;
  specialCircumstances: string[] | null;
  reason: string | undefined;
  isDirectMode: boolean;
  preFillMessage: string;

  // State setters
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  setTouched: React.Dispatch<React.SetStateAction<FormTouched>>;
}

export function useInquiryValidation(props: UseInquiryValidationProps) {
  const {
    name,
    email,
    phone,
    postcode,
    message,
    consent,
    courtDate,
    financialTags,
    manualIncomeA,
    manualIncomeB,
    manualChildren,
    shouldShowCourtDate,
    specialCircumstances,
    reason,
    isDirectMode,
    preFillMessage,
    setErrors,
    setTouched,
  } = props;

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (field: keyof FormErrors, value: LeadFormValue): string | undefined => {
      switch (field) {
        case 'name':
          return validateName(value as string);
        case 'email':
          return validateEmail(value as string);
        case 'phone':
          return validatePhone(value as string);
        case 'postcode':
          return validatePostcode(value as string);
        case 'message':
          return validateMessage(
            value as string,
            financialTags,
            preFillMessage,
            specialCircumstances,
            reason
          );
        case 'consent':
          return validateConsent(value as boolean);
        case 'courtDate':
          return validateCourtDate(value as Date | null, shouldShowCourtDate);
        case 'financialTags':
          return validateFinancialTags(
            value as string[],
            specialCircumstances,
            reason
          );
        case 'manualIncomeA':
          return isDirectMode
            ? validateManualIncome(value as string, 'Your income')
            : undefined;
        case 'manualIncomeB':
          return isDirectMode
            ? validateManualIncome(value as string, "Other parent's income")
            : undefined;
        case 'manualChildren':
          return isDirectMode
            ? validateManualChildren(value as string)
            : undefined;
        default:
          return undefined;
      }
    },
    [
      shouldShowCourtDate,
      financialTags,
      specialCircumstances,
      isDirectMode,
      reason,
      preFillMessage,
    ]
  );

  /**
   * Validate all fields and return true if form is valid
   */
  const validateAllFields = useCallback((): boolean => {
    const newErrors: FormErrors = {
      name: validateName(name),
      email: validateEmail(email),
      phone: validatePhone(phone),
      postcode: validatePostcode(postcode),
      message: validateMessage(
        message,
        financialTags,
        preFillMessage,
        specialCircumstances,
        reason
      ),
      consent: validateConsent(consent),
      courtDate: validateCourtDate(courtDate, shouldShowCourtDate),
      financialTags: validateFinancialTags(
        financialTags,
        specialCircumstances,
        reason
      ),
      // Direct Mode fields - only validate when in Direct Mode
      ...(isDirectMode && {
        manualIncomeA: validateManualIncome(manualIncomeA, 'Your income'),
        manualIncomeB: validateManualIncome(
          manualIncomeB,
          "Other parent's income"
        ),
        manualChildren: validateManualChildren(manualChildren),
      }),
    };

    setErrors(newErrors);

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      postcode: true,
      message: true,
      consent: true,
      courtDate: true,
      financialTags: true,
      manualIncomeA: true,
      manualIncomeB: true,
      manualChildren: true,
      separationDate: true,
      cohabited6Months: true,
      otherParentCountry: true,
    });

    // Check if any errors exist
    return !Object.values(newErrors).some((error) => error !== undefined);
  }, [
    name,
    email,
    phone,
    postcode,
    message,
    consent,
    courtDate,
    shouldShowCourtDate,
    financialTags,
    specialCircumstances,
    reason,
    isDirectMode,
    preFillMessage,
    manualIncomeA,
    manualIncomeB,
    manualChildren,
    setErrors,
    setTouched,
  ]);

  /**
   * Debounced validation for text fields
   * Validates after user stops typing for 400ms
   */
  const debouncedValidate = useMemo(
    () =>
      debounce((field: keyof FormErrors, value: string) => {
        const newError = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: newError }));
      }, 400),
    [validateField, setErrors]
  );

  return {
    validateField,
    validateAllFields,
    debouncedValidate,
    VALIDATION,
  };
}
