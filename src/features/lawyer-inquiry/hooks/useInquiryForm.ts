/**
 * Lawyer Inquiry Feature - Form State Management Hook
 *
 * Composes validation, submission, and state management hooks.
 */

import { useCallback, useEffect } from 'react';
import type { CareDataItem, FormErrors } from '../types';
import { useInquiryState } from './useInquiryState';
import { useInquiryValidation } from './useInquiryValidation';
import { useLeadSubmission } from './useLeadSubmission';

export type LeadFormValue = string | boolean | Date | null | string[];

export interface UseInquiryFormProps {
  preFillMessage: string;
  liability: string;
  trigger: string;
  incomeA: string;
  incomeB: string;
  children: string;
  isDirectMode: boolean;
  reason: string | undefined;
  careData: CareDataItem[];
  specialCircumstances: string[] | null;
  payer: string; // "Parent A", "Parent B", or "Neither"

  // Chatbot lead qualification data
  hasParentingPlan: string | undefined;
  assessmentType: string | undefined;
  returnTo: string | undefined;

  // Partner attribution (for ROI tracking)
  partner: string | undefined;

  // Time tracking
  calculatorStartTime: number | undefined;
}

export function useInquiryForm(props: UseInquiryFormProps) {
  // State management hook
  const state = useInquiryState({
    preFillMessage: props.preFillMessage,
    specialCircumstances: props.specialCircumstances,
    reason: props.reason,
    returnTo: props.returnTo,
  });

  // Validation hook
  const validation = useInquiryValidation({
    name: state.name,
    email: state.email,
    phone: state.phone,
    postcode: state.postcode,
    message: state.message,
    consent: state.consent,
    courtDate: state.courtDate,
    financialTags: state.financialTags,
    manualIncomeA: state.manualIncomeA,
    manualIncomeB: state.manualIncomeB,
    manualChildren: state.manualChildren,
    shouldShowCourtDate: state.shouldShowCourtDate,
    specialCircumstances: props.specialCircumstances,
    reason: props.reason,
    isDirectMode: props.isDirectMode,
    preFillMessage: props.preFillMessage,
    setErrors: state.setErrors,
    setTouched: state.setTouched,
  });

  // Submission hook
  const submission = useLeadSubmission({
    name: state.name,
    email: state.email,
    phone: state.phone,
    postcode: state.postcode,
    message: state.message,
    consent: state.consent,
    courtDate: state.courtDate,
    financialTags: state.financialTags,
    manualIncomeA: state.manualIncomeA,
    manualIncomeB: state.manualIncomeB,
    manualChildren: state.manualChildren,
    separationDate: state.separationDate,
    cohabited6Months: state.cohabited6Months,
    otherParentCountry: state.otherParentCountry,
    liability: props.liability,
    trigger: props.trigger,
    incomeA: props.incomeA,
    incomeB: props.incomeB,
    children: props.children,
    payer: props.payer,
    careData: props.careData,
    specialCircumstances: props.specialCircumstances,
    isDirectMode: props.isDirectMode,
    reason: props.reason,
    hasParentingPlan: props.hasParentingPlan,
    assessmentType: props.assessmentType,
    returnTo: props.returnTo,
    partner: props.partner,
    calculatorStartTime: props.calculatorStartTime,
    shouldShowPsiFields: state.shouldShowPsiFields,
    shouldShowInternationalFields: state.shouldShowInternationalFields,
    validateAllFields: validation.validateAllFields,
    validCircumstances: state.validCircumstances,
    navigateHome: state.navigateHome,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      submission.isMounted.current = false;
    };
  }, [submission.isMounted]);

  /**
   * Handle field blur - validate and show error
   */
  const handleBlur = useCallback(
    (field: keyof FormErrors) => {
      state.setTouched((prev) => ({ ...prev, [field]: true }));

      let value: LeadFormValue = '';

      switch (field) {
        case 'name':
          value = state.name;
          break;
        case 'email':
          value = state.email;
          break;
        case 'phone':
          value = state.phone;
          break;
        case 'postcode':
          value = state.postcode;
          break;
        case 'message':
          value = state.message;
          break;
        case 'consent':
          value = state.consent;
          break;
        case 'courtDate':
          value = state.courtDate;
          break;
        case 'financialTags':
          value = state.financialTags;
          break;
        case 'manualIncomeA':
          value = state.manualIncomeA;
          break;
        case 'manualIncomeB':
          value = state.manualIncomeB;
          break;
        case 'manualChildren':
          value = state.manualChildren;
          break;
      }

      const error = validation.validateField(field, value);
      state.setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [state, validation]
  );

  /**
   * Handle court date change - validate and clear error
   */
  const handleCourtDateChange = useCallback(
    (date: Date | null) => {
      state.setCourtDate(date);
      state.setTouched((prev) => ({ ...prev, courtDate: true }));

      const error = validation.validateField('courtDate', date);
      state.setErrors((prev) => ({ ...prev, courtDate: error }));
    },
    [state, validation]
  );

  /**
   * Handle text change - update value immediately, validate with debounce
   */
  const handleTextChange = useCallback(
    (
      field: keyof FormErrors,
      value: string,
      setter: (value: string) => void
    ) => {
      if (field === 'message' && value.length > validation.VALIDATION.MESSAGE_MAX_LENGTH) {
        value = value.slice(0, validation.VALIDATION.MESSAGE_MAX_LENGTH);
      }

      setter(value);

      if (state.touched[field] && state.errors[field]) {
        validation.debouncedValidate(field, value);
      }
    },
    [state.touched, state.errors, validation]
  );

  /**
   * Handle consent toggle
   */
  const handleConsentToggle = useCallback(() => {
    const newValue = !state.consent;
    state.setConsent(newValue);

    if (newValue && state.errors.consent) {
      state.setErrors((prev) => ({ ...prev, consent: undefined }));
    }
  }, [state]);

  return {
    // State from useInquiryState
    name: state.name,
    email: state.email,
    phone: state.phone,
    postcode: state.postcode,
    message: state.message,
    consent: state.consent,
    courtDate: state.courtDate,
    financialTags: state.financialTags,
    manualIncomeA: state.manualIncomeA,
    manualIncomeB: state.manualIncomeB,
    manualChildren: state.manualChildren,
    separationDate: state.separationDate,
    cohabited6Months: state.cohabited6Months,
    otherParentCountry: state.otherParentCountry,
    errors: state.errors,
    touched: state.touched,

    // State from useLeadSubmission
    isSubmitting: submission.isSubmitting,
    showSuccess: submission.showSuccess,
    showEnrichment: submission.showEnrichment,
    showEnrichmentSuccess: submission.showEnrichmentSuccess,
    currentLeadId: submission.currentLeadId,
    selectedEnrichmentFactors: submission.selectedEnrichmentFactors,
    isUpdatingEnrichment: submission.isUpdatingEnrichment,
    enrichmentLiability: submission.enrichmentLiability,
    enrichmentPayerRole: submission.enrichmentPayerRole,
    enrichmentCountry: submission.enrichmentCountry,

    // Setters from useInquiryState
    setName: state.setName,
    setEmail: state.setEmail,
    setPhone: state.setPhone,
    setPostcode: state.setPostcode,
    setMessage: state.setMessage,
    setFinancialTags: state.setFinancialTags,
    setManualIncomeA: state.setManualIncomeA,
    setManualIncomeB: state.setManualIncomeB,
    setManualChildren: state.setManualChildren,
    setSeparationDate: state.setSeparationDate,
    setCohabited6Months: state.setCohabited6Months,
    setOtherParentCountry: state.setOtherParentCountry,
    setErrors: state.setErrors,

    // Setters from useLeadSubmission
    setEnrichmentLiability: submission.setEnrichmentLiability,
    setEnrichmentPayerRole: submission.setEnrichmentPayerRole,
    setEnrichmentCountry: submission.setEnrichmentCountry,

    // Refs from useInquiryState
    emailRef: state.emailRef,
    phoneRef: state.phoneRef,
    postcodeRef: state.postcodeRef,
    messageRef: state.messageRef,
    manualIncomeARef: state.manualIncomeARef,
    manualIncomeBRef: state.manualIncomeBRef,
    manualChildrenRef: state.manualChildrenRef,

    // Computed from useInquiryState
    validCircumstances: state.validCircumstances,
    shouldShowCourtDate: state.shouldShowCourtDate,
    shouldShowFinancialTags: state.shouldShowFinancialTags,
    shouldShowPsiFields: state.shouldShowPsiFields,
    showPsiWarning: state.showPsiWarning,
    shouldShowInternationalFields: state.shouldShowInternationalFields,
    internationalWarning: state.internationalWarning,

    // Handlers
    handleBlur,
    handleTextChange,
    handleCourtDateChange,
    handleConsentToggle,
    handleSubmit: submission.handleSubmit,
    handleEnrichmentFactorToggle: submission.handleEnrichmentFactorToggle,
    handleEnrichmentSubmit: submission.handleEnrichmentSubmit,
    handleSkipEnrichment: submission.handleSkipEnrichment,
  };
}
