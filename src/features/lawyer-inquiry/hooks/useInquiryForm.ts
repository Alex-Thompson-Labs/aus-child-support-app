/**
 * Lawyer Inquiry Feature - Form State Management Hook
 *
 * Manages all form state, validation, and submission logic.
 */

import { useAnalytics } from '@/src/utils/analytics';
import type { SpecialCircumstance } from '@/src/utils/special-circumstances';
import {
  getSpecialCircumstanceById,
  isCourtDateReason,
} from '@/src/utils/special-circumstances';
import type { LeadSubmission } from '@/src/utils/supabase';
import { submitLead, updateLeadEnrichment } from '@/src/utils/supabase';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform, TextInput } from 'react-native';
import { ENRICHMENT_INQUIRY_TYPES } from '../config';
import type { CareDataItem, FormErrors, FormTouched } from '../types';
import {
  buildComplexityTriggers,
  formatCourtDateForReasons,
  sanitizeEmail,
  sanitizePhone,
  sanitizeString,
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
}

export function useInquiryForm(props: UseInquiryFormProps) {
  const router = useRouter();
  const analytics = useAnalytics();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');
  const [message, setMessage] = useState(props.preFillMessage);
  const [consent, setConsent] = useState(false);

  // Dynamic field state
  const [courtDate, setCourtDate] = useState<Date | null>(null);
  const [financialTags, setFinancialTags] = useState<string[]>([]);

  // Direct Mode - Manual Input State
  const [manualIncomeA, setManualIncomeA] = useState('');
  const [manualIncomeB, setManualIncomeB] = useState('');
  const [manualChildren, setManualChildren] = useState('');

  // Validation state
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({
    name: false,
    email: false,
    phone: false,
    postcode: false,
    message: false,
    consent: false,
    courtDate: false,
    financialTags: false,
    manualIncomeA: false,
    manualIncomeB: false,
    manualChildren: false,
  });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Enrichment flow state (post-submission data collection)
  const [showEnrichment, setShowEnrichment] = useState(false);
  const [showEnrichmentSuccess, setShowEnrichmentSuccess] = useState(false);
  const [currentLeadId, setCurrentLeadId] = useState<string | null>(null);
  const [selectedEnrichmentFactors, setSelectedEnrichmentFactors] = useState<
    string[]
  >([]);
  const [isUpdatingEnrichment, setIsUpdatingEnrichment] = useState(false);

  // Calculated liability from enrichment estimator
  const [enrichmentLiability, setEnrichmentLiability] = useState<number | null>(null);

  // Payer role from enrichment estimator
  const [enrichmentPayerRole, setEnrichmentPayerRole] = useState<'you' | 'other_parent' | null>(null);

  // Court date for enrichment flow
  const [enrichmentCourtDate, setEnrichmentCourtDate] = useState<Date | null>(null);

  // Refs for input focus management
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const messageRef = useRef<TextInput>(null);

  // Track if component is mounted to prevent state updates/navigation after unmount
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Capture mount timestamp for time_to_submit calculation
  const mountTimeRef = useRef<number>(Date.now());

  // Get valid Special Circumstances for display, sorted by priority
  const validCircumstances = useMemo(() => {
    const circumstances = (props.specialCircumstances || [])
      .filter((id) => !isCourtDateReason(id)) // Exclude court_date_pending placeholder
      .map((id) => {
        const reason = getSpecialCircumstanceById(id);
        if (!reason) return null;

        // Determine urgency based on priority (1-3 = URGENT, 4-10 = NORMAL)
        const urgency: 'URGENT' | 'NORMAL' =
          reason.priority <= 3 ? 'URGENT' : 'NORMAL';

        return { ...reason, urgency };
      })
      .filter(
        (
          reason
        ): reason is SpecialCircumstance & { urgency: 'URGENT' | 'NORMAL' } =>
          reason !== null
      );

    // Add dynamic court date card if date is selected
    if (courtDate && shouldShowCourtDate) {
      const formatted = courtDate.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      circumstances.push({
        id: 'court_date_dynamic',
        label: `I have an upcoming court hearing regarding child support. (${formatted})`,
        description: 'Upcoming court dates are critical events. Professional legal preparation is strongly recommended to protect your interests before your appearance.',
        category: 'urgent' as const,
        priority: 1,
        officialCodes: ['5.2.11'] as const,
        urgency: 'URGENT' as const,
      });
    }

    // Sort by priority
    return circumstances.sort((a, b) => a.priority - b.priority);
  }, [props.specialCircumstances, courtDate, shouldShowCourtDate]);

  // Determine if conditional fields should be shown
  const shouldShowCourtDate = useMemo(
    () => (props.specialCircumstances || []).some((id) => isCourtDateReason(id)),
    [props.specialCircumstances]
  );

  const shouldShowFinancialTags = useMemo(
    () =>
      props.reason === 'hidden_income' ||
      (props.specialCircumstances || []).some(
        (id) => id === 'income_resources_not_reflected'
      ),
    [props.reason, props.specialCircumstances]
  );

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (
      field: keyof FormErrors,
      value: string | boolean | Date | null
    ): string | undefined => {
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
          return validateMessage(value as string, financialTags, props.preFillMessage, props.specialCircumstances, props.reason);
        case 'consent':
          return validateConsent(value as boolean);
        case 'courtDate':
          return validateCourtDate(value as Date | null, shouldShowCourtDate);
        case 'financialTags':
          return validateFinancialTags(
            financialTags,
            props.specialCircumstances,
            props.reason
          );
        case 'manualIncomeA':
          return props.isDirectMode
            ? validateManualIncome(value as string, 'Your income')
            : undefined;
        case 'manualIncomeB':
          return props.isDirectMode
            ? validateManualIncome(value as string, "Other parent's income")
            : undefined;
        case 'manualChildren':
          return props.isDirectMode
            ? validateManualChildren(value as string)
            : undefined;
        default:
          return undefined;
      }
    },
    [
      shouldShowCourtDate,
      financialTags,
      props.specialCircumstances,
      props.isDirectMode,
      props.reason,
      props.preFillMessage,
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
      message: validateMessage(message, financialTags, props.preFillMessage, props.specialCircumstances, props.reason),
      consent: validateConsent(consent),
      courtDate: validateCourtDate(courtDate, shouldShowCourtDate),
      financialTags: validateFinancialTags(
        financialTags,
        props.specialCircumstances,
        props.reason
      ),
      // Direct Mode fields - only validate when in Direct Mode
      ...(props.isDirectMode && {
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
    props.specialCircumstances,
    props.reason,
    props.isDirectMode,
    manualIncomeA,
    manualIncomeB,
    manualChildren,
  ]);

  /**
   * Handle field blur - validate and show error
   */
  const handleBlur = useCallback(
    (field: keyof FormErrors) => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      let value: string | boolean | Date | null | string[] = '';

      switch (field) {
        case 'name':
          value = name;
          break;
        case 'email':
          value = email;
          break;
        case 'phone':
          value = phone;
          break;
        case 'postcode':
          value = postcode;
          break;
        case 'message':
          value = message;
          break;
        case 'consent':
          value = consent;
          break;
        case 'courtDate':
          value = courtDate;
          break;
        case 'financialTags':
          value = financialTags;
          break;
        case 'manualIncomeA':
          value = manualIncomeA;
          break;
        case 'manualIncomeB':
          value = manualIncomeB;
          break;
        case 'manualChildren':
          value = manualChildren;
          break;
      }

      // Pass explicit value to validateField
      // cast as any because validateField signature might not strictly match all types yet (like string[])
      const error = validateField(field, value as any);

      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [
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
      validateField,
    ]
  );

  /**
   * Handle court date change - validate and clear error
   */
  const handleCourtDateChange = useCallback(
    (date: Date | null) => {
      setCourtDate(date);

      // Mark as touched
      setTouched((prev) => ({ ...prev, courtDate: true }));

      // Validate immediately
      const error = validateCourtDate(date, shouldShowCourtDate);
      setErrors((prev) => ({ ...prev, courtDate: error }));
    },
    [shouldShowCourtDate]
  );

  /**
   * Handle text change - clear error when user starts typing
   */
  const handleTextChange = useCallback(
    (
      field: keyof FormErrors,
      value: string,
      setter: (value: string) => void
    ) => {
      // Enforce max length for message to prevent paste attacks
      if (field === 'message' && value.length > VALIDATION.MESSAGE_MAX_LENGTH) {
        value = value.slice(0, VALIDATION.MESSAGE_MAX_LENGTH);
      }

      setter(value);

      // If field already has an error, re-validate immediately
      // The error should only disappear if the new value is actually valid
      if (touched[field] && errors[field]) {
        const newError = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: newError }));
      }
    },
    [touched, errors, validateField]
  );

  /**
   * Handle consent toggle
   */
  const handleConsentToggle = useCallback(() => {
    const newValue = !consent;
    setConsent(newValue);

    // Clear error when checking
    if (newValue && errors.consent) {
      setErrors((prev) => ({ ...prev, consent: undefined }));
    }
  }, [consent, errors.consent]);

  /**
   * Navigate home helper
   */
  const navigateHome = useCallback(() => {
    try {
      if (__DEV__)
        console.log('[LawyerInquiry] Navigating home with reset trigger...');
      router.replace({
        pathname: '/',
        params: { reset: 'true' },
      });
    } catch (error) {
      console.error('[LawyerInquiry] Navigation error:', error);
      router.replace('/');
    }
  }, [router]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    // Validate all fields
    const isValid = validateAllFields();

    if (!isValid) {
      // Scroll to first error or show alert
      if (Platform.OS === 'web') {
        // On web, use browser alert for better compatibility
        alert(
          'Please fix the errors\n\nSome fields need your attention before submitting.'
        );
      } else {
        Alert.alert(
          'Please fix the errors',
          'Some fields need your attention before submitting.'
        );
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Track analytics BEFORE submission
      const timeToSubmit = Math.round(
        (Date.now() - mountTimeRef.current) / 1000
      );

      try {
        analytics.track('inquiry_form_submitted', {
          trigger_type: props.isDirectMode ? 'direct' : props.trigger || 'unknown',
          is_direct_mode: props.isDirectMode,
          direct_mode_reason: props.isDirectMode ? props.reason || 'none' : 'n/a',
          annual_liability: props.isDirectMode
            ? 0
            : props.liability
              ? Number(parseFloat(props.liability).toFixed(2))
              : 0,
          has_phone: !!sanitizePhone(phone),
          message_length: sanitizeString(message).length,
          time_to_submit: timeToSubmit,
          // Complexity tracking properties
          has_complexity_reasons: (props.specialCircumstances?.length ?? 0) > 0,
          complexity_reason_count: props.specialCircumstances?.length ?? 0,
          complexity_reason_ids: props.specialCircumstances?.join(',') ?? '',
          has_urgent_reasons: validCircumstances.some(
            (r) => r.urgency === 'URGENT'
          ),
        });
      } catch (error) {
        // Log but don't fail submission on analytics error
        console.error('[LawyerInquiry] Analytics error:', error);
      }

      // Prepare complexity reasons array: remove the static trigger flag, add the real date
      const complexityReasonsWithCourtDate = (
        props.specialCircumstances || []
      ).filter((id) => !isCourtDateReason(id));

      if (courtDate) {
        complexityReasonsWithCourtDate.push(
          formatCourtDateForReasons(courtDate)
        );
      }

      // Create lead submission for Supabase
      const leadSubmission: LeadSubmission = {
        // Parent contact
        parent_name: sanitizeString(name),
        parent_email: sanitizeEmail(email),
        parent_phone: sanitizePhone(phone) || null,
        location: postcode.trim() || null,

        // Calculation data - Use manual values in Direct Mode
        income_parent_a: props.isDirectMode
          ? parseInt(manualIncomeA.replace(/[^0-9]/g, ''), 10) || 0
          : parseFloat(props.incomeA) || 0,
        income_parent_b: props.isDirectMode
          ? parseInt(manualIncomeB.replace(/[^0-9]/g, ''), 10) || 0
          : parseFloat(props.incomeB) || 0,
        children_count: props.isDirectMode
          ? parseInt(manualChildren, 10) || 0
          : parseInt(props.children) || 0,
        annual_liability: props.isDirectMode ? 0 : parseFloat(props.liability) || 0,
        payer_role: props.isDirectMode
          ? null
          : props.payer === 'Parent A'
            ? 'you'
            : props.payer === 'Parent B'
              ? 'other_parent'
              : null,

        // Care arrangement - null in Direct Mode
        care_data: props.isDirectMode ? null : props.careData.length > 0 ? props.careData : null,

        // Complexity data - Use 'direct_inquiry' trigger in Direct Mode
        complexity_trigger: props.isDirectMode
          ? ['direct_inquiry']
          : buildComplexityTriggers(
            props.trigger,
            props.specialCircumstances,
            financialTags,
            props.careData,
            props.liability
          ),
        complexity_reasons: props.isDirectMode
          ? props.reason
            ? [props.reason]
            : []
          : complexityReasonsWithCourtDate,

        // Dynamic lead data
        financial_tags: financialTags.length > 0 ? financialTags : null,

        // Message (raw text from Additional Details field only)
        // Note: Database has NOT NULL constraint, so send empty string instead of null
        parent_message: sanitizeString(message) || '',

        // Privacy compliance
        consent_given: consent,

        // Initial status
        status: 'new',

        // Chatbot lead qualification data
        parenting_plan_status: props.hasParentingPlan || null,
        inquiry_type: props.assessmentType || null,
        referer_url: props.returnTo || null,
      };

      if (__DEV__)
        console.log('[LawyerInquiry] Submitting lead to Supabase...');

      // Submit to Supabase
      const result = await submitLead(leadSubmission);

      if (!result.success) {
        // Handle submission error
        console.error('[LawyerInquiry] Submission failed:', result.error);

        setIsSubmitting(false);

        if (Platform.OS === 'web') {
          alert(
            'Submission Failed\n\nThere was an error submitting your inquiry. Please try again or contact us directly.'
          );
        } else {
          Alert.alert(
            'Submission Failed',
            'There was an error submitting your inquiry. Please try again or contact us directly.'
          );
        }
        return;
      }

      if (__DEV__)
        console.log(
          '[LawyerInquiry] Lead submitted successfully. ID:',
          result.leadId
        );

      setIsSubmitting(false);

      // Check if this inquiry type should show enrichment flow
      const shouldShowEnrichmentFlow =
        props.reason && ENRICHMENT_INQUIRY_TYPES.includes(props.reason);

      if (shouldShowEnrichmentFlow && result.leadId) {
        // Show enrichment view instead of navigating away
        setCurrentLeadId(result.leadId);
        setShowEnrichment(true);
      } else {
        // Standard flow: show success (no auto-redirect - user will navigate manually)
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('[LawyerInquiry] Unexpected error:', error);

      setIsSubmitting(false);

      if (Platform.OS === 'web') {
        alert(
          'Unexpected Error\n\nAn unexpected error occurred. Please try again.'
        );
      } else {
        Alert.alert(
          'Unexpected Error',
          'An unexpected error occurred. Please try again.'
        );
      }
    }
  }, [
    isSubmitting,
    validateAllFields,
    name,
    email,
    phone,
    message,
    props.liability,
    props.trigger,
    props.incomeA,
    props.incomeB,
    props.children,
    router,
    analytics,
    validCircumstances,
    courtDate,
    financialTags,
    props.careData,
    props.specialCircumstances,
    postcode,
    consent,
    props.isDirectMode,
    props.reason,
    manualIncomeA,
    manualIncomeB,
    manualChildren,
  ]);

  /**
   * Toggle enrichment factor selection
   */
  const handleEnrichmentFactorToggle = useCallback((factorId: string) => {
    setSelectedEnrichmentFactors((prev) =>
      prev.includes(factorId)
        ? prev.filter((id) => id !== factorId)
        : [...prev, factorId]
    );
  }, []);

  /**
   * Handle enrichment submission (Update Case File button)
   */
  const handleEnrichmentSubmit = useCallback(async () => {
    if (!currentLeadId) {
      navigateHome();
      return;
    }

    // If no factors selected and no liability calculated, just navigate home
    if (selectedEnrichmentFactors.length === 0 && enrichmentLiability === null) {
      navigateHome();
      return;
    }

    setIsUpdatingEnrichment(true);

    // Process factors - replace enrichment_court_date with dated version if date selected
    const processedFactors = selectedEnrichmentFactors.map((factor) => {
      if (factor === 'enrichment_court_date' && enrichmentCourtDate) {
        // Format: enrichment_court_date_DD_MMM_YYYY (e.g., enrichment_court_date_12_feb_2026)
        const day = enrichmentCourtDate.getDate();
        const month = enrichmentCourtDate.toLocaleString('en-AU', { month: 'short' }).toLowerCase();
        const year = enrichmentCourtDate.getFullYear();
        return `enrichment_court_date_${day}_${month}_${year}`;
      }
      return factor;
    });

    try {
      const result = await updateLeadEnrichment(
        currentLeadId,
        processedFactors,
        enrichmentLiability ?? undefined,
        enrichmentPayerRole ?? undefined
      );

      if (!result.success) {
        console.error(
          '[LawyerInquiry] Failed to update enrichment:',
          result.error
        );
        // Still show success even if update fails (user did their part)
      } else if (__DEV__) {
        console.log('[LawyerInquiry] Enrichment updated successfully');
      }
    } catch (error) {
      console.error('[LawyerInquiry] Error updating enrichment:', error);
    }

    setIsUpdatingEnrichment(false);

    // Show success state
    setShowEnrichmentSuccess(true);

    // Navigate home after delay (matching standard success behavior)
    setTimeout(() => {
      if (!isMounted.current) return;
      navigateHome();
    }, 1500);
  }, [currentLeadId, selectedEnrichmentFactors, enrichmentCourtDate, enrichmentLiability, enrichmentPayerRole, navigateHome]);

  /**
   * Skip enrichment and close
   */
  const handleSkipEnrichment = useCallback(() => {
    navigateHome();
  }, [navigateHome]);

  return {
    // State
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
    errors,
    touched,
    isSubmitting,
    showSuccess,
    showEnrichment,
    showEnrichmentSuccess,
    currentLeadId,
    selectedEnrichmentFactors,
    isUpdatingEnrichment,
    enrichmentLiability,
    enrichmentCourtDate,
    enrichmentPayerRole,

    // Setters
    setName,
    setEmail,
    setPhone,
    setPostcode,
    setMessage,
    setFinancialTags,
    setManualIncomeA,
    setManualIncomeB,
    setManualChildren,
    setEnrichmentLiability,
    setEnrichmentCourtDate,
    setEnrichmentPayerRole,
    setErrors,

    // Refs
    emailRef,
    phoneRef,
    messageRef,

    // Computed
    validCircumstances,
    shouldShowCourtDate,
    shouldShowFinancialTags,

    // Handlers
    handleBlur,
    handleTextChange,
    handleCourtDateChange,
    handleConsentToggle,
    handleSubmit,
    handleEnrichmentFactorToggle,
    handleEnrichmentSubmit,
    handleSkipEnrichment,
  };
}
