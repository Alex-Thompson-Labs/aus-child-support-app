import { useLocalSearchParams, useRouter } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrivacyPolicyLink } from '../src/components/PrivacyPolicyLink';
import DatePickerField from '../src/components/ui/DatePickerField';
import { useAnalytics } from '../src/utils/analytics';
import { MAX_FORM_WIDTH, isWeb } from '../src/utils/responsive';
import type { SpecialCircumstance } from '../src/utils/special-circumstances';
import {
  getSpecialCircumstanceById,
  isCourtDateReason,
} from '../src/utils/special-circumstances';
import type { LeadSubmission } from '../src/utils/supabase';
import { submitLead } from '../src/utils/supabase';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  postcode?: string;
  message?: string;
  consent?: string;
  courtDate?: string;
  financialTags?: string;
  manualIncomeA?: string;
  manualIncomeB?: string;
  manualChildren?: string;
}

interface FormTouched {
  name: boolean;
  email: boolean;
  phone: boolean;
  postcode: boolean;
  message: boolean;
  consent: boolean;
  courtDate: boolean;
  financialTags: boolean;
  manualIncomeA: boolean;
  manualIncomeB: boolean;
  manualChildren: boolean;
}

// ============================================================================
// Direct Mode Reason Pre-fills
// ============================================================================

/**
 * Pre-fill messages for direct mode based on reason parameter.
 * Easy to extend: just add new key-value pairs.
 */
const REASON_PREFILLS: Record<string, string> = {
  binding_agreement: 'I am interested in a Binding Child Support Agreement.',
  hidden_income: 'I suspect the other parent is hiding income.',
};

// ============================================================================
// Validation Constants & Helpers
// ============================================================================

const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 1000,
  PHONE_REGEX: /^[\d\s\-+()]{8,20}$/,
  // Comprehensive email regex that handles most valid emails
  EMAIL_REGEX:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
} as const;

/**
 * Sanitize a string by trimming whitespace and collapsing multiple spaces
 */
function sanitizeString(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

/**
 * Sanitize email: trim, lowercase, remove extra spaces
 */
function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Sanitize phone: remove all non-digit characters except + at start
 */
function sanitizePhone(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return '';

  // Keep + at start if present, then only digits
  const hasPlus = trimmed.startsWith('+');
  const digitsOnly = trimmed.replace(/\D/g, '');
  return hasPlus ? `+${digitsOnly}` : digitsOnly;
}

/**
 * Validate name field
 */
function validateName(name: string): string | undefined {
  const sanitized = sanitizeString(name);

  if (!sanitized) {
    return 'Name is required';
  }

  if (sanitized.length < VALIDATION.NAME_MIN_LENGTH) {
    return `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`;
  }

  if (sanitized.length > VALIDATION.NAME_MAX_LENGTH) {
    return `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`;
  }

  return undefined;
}

/**
 * Validate email field
 */
function validateEmail(email: string): string | undefined {
  const sanitized = sanitizeEmail(email);

  if (!sanitized) {
    return 'Email is required';
  }

  if (!VALIDATION.EMAIL_REGEX.test(sanitized)) {
    return 'Please enter a valid email address';
  }

  return undefined;
}

/**
 * Validate phone field (optional)
 */
function validatePhone(phone: string): string | undefined {
  const sanitized = phone.trim();

  // Phone is optional
  if (!sanitized) {
    return undefined;
  }

  if (!VALIDATION.PHONE_REGEX.test(sanitized)) {
    return 'Please enter a valid phone number';
  }

  return undefined;
}

/**
 * Validate postcode field (required)
 */
function validatePostcode(postcode: string): string | undefined {
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
 * Validate message field (conditionally required based on financialTags)
 */
function validateMessage(
  message: string,
  financialTags: string[]
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
  }

  // Check max length regardless of whether it's required
  if (sanitized.length > VALIDATION.MESSAGE_MAX_LENGTH) {
    return `Message must be less than ${VALIDATION.MESSAGE_MAX_LENGTH} characters`;
  }

  // Otherwise, message is optional - no validation needed
  return undefined;
}

/**
 * Validate consent checkbox
 */
function validateConsent(consent: boolean): string | undefined {
  if (!consent) {
    return 'You must consent to be contacted';
  }
  return undefined;
}

/**
 * Validate court date field (required if visible)
 */
function validateCourtDate(
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
 * Validate financial tags (required if "hiding income" reason is present)
 */
function validateFinancialTags(
  tags: string[],
  specialCircumstances: string[] | null
): string | undefined {
  // Check if specialCircumstances includes 'income_resources_not_reflected'
  // This ID corresponds to "Is the other parent hiding any income..."
  const hasHidingIncomeReason = specialCircumstances?.includes(
    'income_resources_not_reflected'
  );

  if (hasHidingIncomeReason && tags.length === 0) {
    return 'Please select at least one financial issue type.';
  }

  return undefined;
}

/**
 * Validate manual income field (required in Direct Mode)
 */
function validateManualIncome(
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
function validateManualChildren(children: string): string | undefined {
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
 * Format court date as a string for complexity_reasons array
 * Example: court_date_12_jan_2026
 */
function formatCourtDateForReasons(courtDate: Date): string {
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
 * 1. High Alert (Data-Driven): If coaReasons is not empty OR financialTags is not empty OR liability > 15000 -> push 'high_alert'
 * 2. Shared Care (Data-Driven): If any child has care percentage between 35% and 65% (inclusive) -> push 'shared_care'
 * 3. Binding Agreement (Button-Driven ONLY): ONLY push 'binding_agreement' if trigger === 'binding_agreement'
 *    - Do not infer from other data
 *    - If they came via "High Alert", do not add "Binding Agreement" even if they fit the criteria
 *
 * @param trigger - Navigation parameter indicating entry point
 * @param coaReasons - Array of complexity reason IDs
 * @param financialTags - Array of financial issue tags
 * @param careData - Array of care arrangements for each child
 * @param liability - Annual liability amount as a string
 * @returns Array of active triggers, or null if empty
 */
function buildComplexityTriggers(
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

// ============================================================================
// Component
// ============================================================================

export default function LawyerInquiryScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const analytics = useAnalytics();

  // Parse route params with safe defaults
  const liability =
    typeof params.liability === 'string' ? params.liability : '0';
  const trigger =
    typeof params.trigger === 'string' ? params.trigger : 'unknown';
  const incomeA = typeof params.incomeA === 'string' ? params.incomeA : '0';
  const incomeB = typeof params.incomeB === 'string' ? params.incomeB : '0';
  const children = typeof params.children === 'string' ? params.children : '0';

  // Parse Direct Mode params
  const mode = typeof params.mode === 'string' ? params.mode : undefined;
  const reason = typeof params.reason === 'string' ? params.reason : undefined;

  // Detect Direct Mode: explicit mode=direct OR missing calculation data
  const isDirectMode = useMemo(() => {
    const explicitDirect = mode === 'direct';
    const noCalcData = liability === '0' && incomeA === '0' && incomeB === '0';
    return explicitDirect || noCalcData;
  }, [mode, liability, incomeA, incomeB]);

  // Parse pre-fill message from Smart Conversion Footer OR reason param
  const preFillMessage = useMemo(() => {
    // preFillMessage param takes priority
    if (typeof params.preFillMessage === 'string' && params.preFillMessage) {
      return params.preFillMessage;
    }
    // Fall back to reason-based pre-fill
    return REASON_PREFILLS[reason ?? ''] ?? '';
  }, [params.preFillMessage, reason]);

  // Parse care arrangement data (SAFELY)
  const careData = useMemo((): {
    index: number;
    careA: number;
    careB: number;
  }[] => {
    try {
      return typeof params.careData === 'string'
        ? JSON.parse(params.careData)
        : [];
    } catch (error) {
      if (__DEV__)
        console.error('[LawyerInquiry] Failed to parse careData:', error);
      return []; // Fallback to empty if parsing fails
    }
  }, [params.careData]);

  // Parse Special Circumstances data with error handling
  const specialCircumstances = useMemo((): string[] | null => {
    try {
      return typeof params.specialCircumstances === 'string'
        ? (JSON.parse(params.specialCircumstances) as string[])
        : null;
    } catch (error) {
      if (__DEV__)
        console.error(
          '[LawyerInquiry] Failed to parse specialCircumstances:',
          error
        );
      // Continue without pre-fill
      return null;
    }
  }, [params.specialCircumstances]);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');
  const [message, setMessage] = useState(preFillMessage); // Pre-fill from Smart Conversion Footer
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
    return (specialCircumstances || [])
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
      )
      .sort((a, b) => a.priority - b.priority); // Sort by priority
  }, [specialCircumstances]);

  // Determine if conditional fields should be shown
  const shouldShowCourtDate = useMemo(
    () => (specialCircumstances || []).some((id) => isCourtDateReason(id)),
    [specialCircumstances]
  );

  const shouldShowFinancialTags = useMemo(
    () =>
      (specialCircumstances || []).some(
        (id) =>
          id === 'income_resources_not_reflected' || id === 'earning_capacity'
      ),
    [specialCircumstances]
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
          return validateMessage(value as string, financialTags);
        case 'consent':
          return validateConsent(value as boolean);
        case 'courtDate':
          return validateCourtDate(value as Date | null, shouldShowCourtDate);
        case 'financialTags':
          return validateFinancialTags(financialTags, specialCircumstances);
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
    [shouldShowCourtDate, financialTags, specialCircumstances, isDirectMode]
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
      message: validateMessage(message, financialTags),
      consent: validateConsent(consent),
      courtDate: validateCourtDate(courtDate, shouldShowCourtDate),
      financialTags: validateFinancialTags(financialTags, specialCircumstances),
      // Direct Mode fields - only validate when in Direct Mode
      ...(isDirectMode && {
        manualIncomeA: validateManualIncome(manualIncomeA, 'Your income'),
        manualIncomeB: validateManualIncome(manualIncomeB, "Other parent's income"),
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
    specialCircumstances,
    isDirectMode,
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
          trigger_type: isDirectMode ? 'direct' : (trigger || 'unknown'),
          is_direct_mode: isDirectMode,
          direct_mode_reason: isDirectMode ? (reason || 'none') : 'n/a',
          annual_liability: isDirectMode
            ? 0
            : (liability ? Number(parseFloat(liability).toFixed(2)) : 0),
          has_phone: !!sanitizePhone(phone),
          message_length: sanitizeString(message).length,
          time_to_submit: timeToSubmit,
          // Complexity tracking properties
          has_complexity_reasons: (specialCircumstances?.length ?? 0) > 0,
          complexity_reason_count: specialCircumstances?.length ?? 0,
          complexity_reason_ids: specialCircumstances?.join(',') ?? '',
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
        specialCircumstances || []
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
        income_parent_a: isDirectMode
          ? parseInt(manualIncomeA.replace(/[^0-9]/g, ''), 10) || 0
          : parseFloat(incomeA) || 0,
        income_parent_b: isDirectMode
          ? parseInt(manualIncomeB.replace(/[^0-9]/g, ''), 10) || 0
          : parseFloat(incomeB) || 0,
        children_count: isDirectMode
          ? parseInt(manualChildren, 10) || 0
          : parseInt(children) || 0,
        annual_liability: isDirectMode ? 0 : parseFloat(liability) || 0,

        // Care arrangement - null in Direct Mode
        care_data: isDirectMode ? null : (careData.length > 0 ? careData : null),

        // Complexity data - Use 'direct_inquiry' trigger in Direct Mode
        complexity_trigger: isDirectMode
          ? ['direct_inquiry']
          : buildComplexityTriggers(
              trigger,
              specialCircumstances,
              financialTags,
              careData,
              liability
            ),
        complexity_reasons: isDirectMode
          ? (reason ? [reason] : [])
          : complexityReasonsWithCourtDate,

        // Dynamic lead data
        financial_tags: financialTags.length > 0 ? financialTags : null,

        // Message (compiled from Special Circumstances, financial tags, court date, and user notes)
        parent_message: (() => {
          const compiledParts: string[] = [];

          // 1. Mapped Statements: Convert Special Circumstances to first-person sentences
          if (validCircumstances.length > 0) {
            compiledParts.push('SITUATION:');
            validCircumstances.forEach((reason) => {
              compiledParts.push(`- ${reason.label}`);
            });
          }

          // 2. High-Value Data: Court Date and Financial Tags
          const highValueData: string[] = [];

          if (courtDate) {
            const formattedDate = courtDate.toLocaleDateString('en-AU', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            highValueData.push(`Court Date: ${formattedDate}`);
          }

          if (financialTags.length > 0) {
            highValueData.push(`Financial Issues: ${financialTags.join(', ')}`);
          }

          if (highValueData.length > 0) {
            if (compiledParts.length > 0) compiledParts.push('');
            compiledParts.push('KEY DETAILS:');
            highValueData.forEach((item) => compiledParts.push(`- ${item}`));
          }

          // 3. User Notes: Append manual text from Additional Details field
          const userNotes = sanitizeString(message);
          if (userNotes) {
            if (compiledParts.length > 0) compiledParts.push('');
            compiledParts.push('ADDITIONAL DETAILS:');
            compiledParts.push(userNotes);
          }

          return compiledParts.length > 0 ? compiledParts.join('\n') : '';
        })(),

        // Privacy compliance
        consent_given: consent,

        // Initial status
        status: 'new',
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

      // Show success
      setIsSubmitting(false);
      setShowSuccess(true);

      // Navigate back after delay
      setTimeout(() => {
        if (!isMounted.current) return;

        try {
          if (__DEV__)
            console.log(
              '[LawyerInquiry] Navigating home with reset trigger...'
            );
          // Force navigation to home with reset param to clear calculator state
          // We use replace() instead of back() to ensure the state is cleared
          router.replace({
            pathname: '/',
            params: { reset: 'true' },
          });
        } catch (error) {
          console.error('[LawyerInquiry] Navigation error:', error);
          // Fallback
          router.replace('/');
        }
      }, 1500);
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
    liability,
    trigger,
    incomeA,
    incomeB,
    children,
    router,
    analytics,
    validCircumstances,
    courtDate,
    financialTags,
    careData,
    specialCircumstances,
    postcode,
    consent,
    isDirectMode,
    reason,
    manualIncomeA,
    manualIncomeB,
    manualChildren,
  ]);

  /**
   * Format currency for display
   */
  const formatCurrency = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return '$0';
    return `$${Math.round(num).toLocaleString()}`;
  };

  // Web-specific container styles
  const webContainerStyle = isWeb
    ? {
      maxWidth: MAX_FORM_WIDTH,
      width: '100%' as const,
      alignSelf: 'center' as const,
    }
    : {};

  // Success overlay
  if (showSuccess) {
    return (
      <SafeAreaView style={styles.successContainer}>
        <View style={styles.successContent}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Thank You!</Text>
          <Text style={styles.successMessage}>
            Your inquiry has been submitted.{'\n'}A lawyer will contact you
            within 24 hours.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* Header with close button - matches Full Breakdown modal pattern */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Request Legal Help</Text>
          <Pressable
            style={styles.closeButton}
            onPress={() => router.back()}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Close form"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, webContainerStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Special Circumstances reasons Card - Show only if reasons exist */}
          {validCircumstances.length > 0 && (
            <View style={styles.specialCircumstancesSection}>
              {validCircumstances.map((reason, index) => (
                <View key={reason.id} style={styles.specialCircumstanceCard}>
                  <View style={styles.specialCircumstanceHeader}>
                    <Text style={styles.specialCircumstanceIcon}>⚠</Text>
                    <View style={styles.specialCircumstanceTextContainer}>
                      <Text style={styles.specialCircumstanceTitle}>
                        {reason.label}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Calculation Summary OR Direct Mode Manual Inputs */}
          {!isDirectMode ? (
            // Standard Mode: Show read-only Calculation Summary
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Your Calculation Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Annual Liability:</Text>
                <Text style={styles.summaryAmount}>
                  {formatCurrency(liability)}/year
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Parent A Income:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(incomeA)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Parent B Income:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(incomeB)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Number of Children:</Text>
                <Text style={styles.summaryValue}>{children}</Text>
              </View>

              {/* Care Arrangement */}
              {careData.length > 0 && (
                <>
                  <View style={styles.summarySeparator} />
                  <Text style={styles.summarySubtitle}>Care Arrangement</Text>
                  {careData.map((child, idx) => (
                    <View key={idx} style={styles.careRow}>
                      <Text style={styles.careChildLabel}>Child {idx + 1}:</Text>
                      <View style={styles.carePercentages}>
                        <Text style={styles.careValue}>
                          Parent A: {child.careA.toFixed(0)}%
                        </Text>
                        <Text style={styles.careSeparator}>•</Text>
                        <Text style={styles.careValue}>
                          Parent B: {child.careB.toFixed(0)}%
                        </Text>
                      </View>
                    </View>
                  ))}
                </>
              )}
            </View>
          ) : (
            // Direct Mode: Show manual income inputs
            <View style={styles.directModeCard}>
              <Text style={styles.summaryTitle}>Your Financial Information</Text>
              <Text style={styles.directModeSubtitle}>
                Please provide approximate income details to help the lawyer understand your situation.
              </Text>

              {/* Your Income Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.fieldLabel}>Your Approximate Annual Income *</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.manualIncomeA && errors.manualIncomeA && styles.inputError,
                  ]}
                  placeholder="e.g. 75000"
                  placeholderTextColor="#64748b"
                  value={manualIncomeA}
                  onChangeText={(text) => {
                    const val = text.replace(/[^0-9]/g, '');
                    handleTextChange('manualIncomeA', val, setManualIncomeA);
                  }}
                  onBlur={() => handleBlur('manualIncomeA')}
                  keyboardType="numeric"
                  returnKeyType="next"
                  editable={!isSubmitting}
                  accessibilityLabel="Your approximate annual income"
                  accessibilityHint="Enter your annual income before tax"
                  {...(isWeb && { inputMode: 'numeric' as any })}
                />
                {touched.manualIncomeA && errors.manualIncomeA && (
                  <Text style={styles.errorText}>{errors.manualIncomeA}</Text>
                )}
              </View>

              {/* Other Parent's Income Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.fieldLabel}>Other Parent's Approximate Income *</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.manualIncomeB && errors.manualIncomeB && styles.inputError,
                  ]}
                  placeholder="e.g. 60000"
                  placeholderTextColor="#64748b"
                  value={manualIncomeB}
                  onChangeText={(text) => {
                    const val = text.replace(/[^0-9]/g, '');
                    handleTextChange('manualIncomeB', val, setManualIncomeB);
                  }}
                  onBlur={() => handleBlur('manualIncomeB')}
                  keyboardType="numeric"
                  returnKeyType="next"
                  editable={!isSubmitting}
                  accessibilityLabel="Other parent's approximate annual income"
                  accessibilityHint="Enter the other parent's estimated annual income"
                  {...(isWeb && { inputMode: 'numeric' as any })}
                />
                {touched.manualIncomeB && errors.manualIncomeB && (
                  <Text style={styles.errorText}>{errors.manualIncomeB}</Text>
                )}
              </View>

              {/* Number of Children Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.fieldLabel}>Number of Children *</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.manualChildren && errors.manualChildren && styles.inputError,
                  ]}
                  placeholder="e.g. 2"
                  placeholderTextColor="#64748b"
                  value={manualChildren}
                  onChangeText={(text) => {
                    const val = text.replace(/[^0-9]/g, '');
                    handleTextChange('manualChildren', val, setManualChildren);
                  }}
                  onBlur={() => handleBlur('manualChildren')}
                  keyboardType="numeric"
                  returnKeyType="next"
                  maxLength={2}
                  editable={!isSubmitting}
                  accessibilityLabel="Number of children"
                  accessibilityHint="Enter the number of children involved"
                  {...(isWeb && { inputMode: 'numeric' as any })}
                />
                {touched.manualChildren && errors.manualChildren && (
                  <Text style={styles.errorText}>{errors.manualChildren}</Text>
                )}
              </View>
            </View>
          )}

          <Text style={styles.formTitle}>Your Information</Text>

          {/* Court Date Input - Conditional */}
          {shouldShowCourtDate && (
            <DatePickerField
              label="When is your court date? *"
              value={courtDate}
              onChange={handleCourtDateChange}
              error={touched.courtDate ? errors.courtDate : undefined}
              disabled={isSubmitting}
            />
          )}

          {/* Name Input */}

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                touched.name && errors.name && styles.inputError,
              ]}
              placeholder="Your Name *"
              placeholderTextColor="#64748b"
              value={name}
              onChangeText={(value) => handleTextChange('name', value, setName)}
              onBlur={() => handleBlur('name')}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              maxLength={VALIDATION.NAME_MAX_LENGTH}
              editable={!isSubmitting}
              accessibilityLabel="Your name"
              accessibilityHint="Enter your full name"
            />
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              ref={emailRef}
              style={[
                styles.input,
                touched.email && errors.email && styles.inputError,
              ]}
              placeholder="Email *"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={(value) =>
                handleTextChange('email', value, setEmail)
              }
              onBlur={() => handleBlur('email')}
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              editable={!isSubmitting}
              accessibilityLabel="Email address"
              accessibilityHint="Enter your email address"
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <TextInput
              ref={phoneRef}
              style={[
                styles.input,
                touched.phone && errors.phone && styles.inputError,
              ]}
              placeholder="Phone (optional)"
              placeholderTextColor="#64748b"
              value={phone}
              onChangeText={(value) =>
                handleTextChange('phone', value, setPhone)
              }
              onBlur={() => handleBlur('phone')}
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => messageRef.current?.focus()}
              autoComplete="tel"
              textContentType="telephoneNumber"
              maxLength={20}
              editable={!isSubmitting}
              accessibilityLabel="Phone number"
              accessibilityHint="Optional. Enter your phone number"
            />
            {touched.phone && errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>

          {/* Financial Tags - Conditional */}
          {shouldShowFinancialTags && (
            <View style={styles.financialSection}>
              <Text style={styles.fieldLabel}>
                What type of financial issue? (Select all that apply){' '}
                {specialCircumstances?.includes(
                  'income_resources_not_reflected'
                ) && '*'}
              </Text>
              <View style={styles.chipsContainer}>
                {[
                  'Cash Business',
                  'Refusing to Work',
                  'Hidden Assets',
                  'Family Trusts',
                  'Other',
                ].map((tag) => {
                  const isSelected = financialTags.includes(tag);
                  return (
                    <Pressable
                      key={tag}
                      style={[
                        styles.chip,
                        isSelected && styles.chipActive,
                        touched.financialTags &&
                        errors.financialTags &&
                        !isSelected &&
                        styles.chipError,
                      ]}
                      onPress={() => {
                        let newTags;
                        if (isSelected) {
                          newTags = financialTags.filter((t) => t !== tag);
                        } else {
                          newTags = [...financialTags, tag];
                        }
                        setFinancialTags(newTags);

                        // Clear error if selection made (and valid)
                        // If deselecting makes it invalid, it will be caught on submit or next validation
                        // But usually for "at least one", adding one clears error.
                        if (
                          touched.financialTags &&
                          errors.financialTags &&
                          newTags.length > 0
                        ) {
                          setErrors((prev) => ({
                            ...prev,
                            financialTags: undefined,
                          }));
                        }
                      }}
                      disabled={isSubmitting}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={`${tag} financial issue`}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {tag}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {touched.financialTags && errors.financialTags && (
                <Text style={styles.errorText}>{errors.financialTags}</Text>
              )}
            </View>
          )}

          {/* Postcode Input */}

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                touched.postcode && errors.postcode && styles.inputError,
              ]}
              placeholder="Postcode *"
              placeholderTextColor="#64748b"
              value={postcode}
              onChangeText={(value) =>
                handleTextChange('postcode', value, setPostcode)
              }
              onBlur={() => handleBlur('postcode')}
              keyboardType="number-pad"
              returnKeyType="next"
              onSubmitEditing={() => messageRef.current?.focus()}
              maxLength={4}
              editable={!isSubmitting}
              accessibilityLabel="Postcode"
              accessibilityHint="Enter your 4-digit Australian postcode"
              {...(isWeb && { inputMode: 'numeric' as any })}
            />
            {touched.postcode && errors.postcode && (
              <Text style={styles.errorText}>{errors.postcode}</Text>
            )}
          </View>

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>
              Additional Details {financialTags.includes('Other') && '*'}
              {!financialTags.includes('Other') && '(Optional)'}
            </Text>
            <TextInput
              ref={messageRef}
              style={[
                styles.input,
                styles.textArea,
                touched.message && errors.message && styles.inputError,
              ]}
              placeholder="Is there anything specific you want the lawyer to know?..."
              placeholderTextColor="#64748b"
              value={message}
              onChangeText={(value) =>
                handleTextChange('message', value, setMessage)
              }
              onBlur={() => handleBlur('message')}
              multiline
              numberOfLines={4}
              maxLength={VALIDATION.MESSAGE_MAX_LENGTH}
              editable={!isSubmitting}
              accessibilityLabel="Additional details"
              accessibilityHint="Enter any additional information you want to share"
            />
            <Text style={styles.charCount}>
              {message.length}/{VALIDATION.MESSAGE_MAX_LENGTH}
            </Text>
            {touched.message && errors.message && (
              <Text style={styles.errorText}>{errors.message}</Text>
            )}
          </View>

          {/* Consent Checkbox */}
          <Pressable
            style={styles.checkboxContainer}
            onPress={handleConsentToggle}
            disabled={isSubmitting}
            accessible={true}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: consent }}
            accessibilityLabel="Consent to share information with legal practitioners"
          >
            <View
              style={[
                styles.checkbox,
                consent && styles.checkboxChecked,
                touched.consent && errors.consent && styles.checkboxError,
              ]}
            >
              {consent && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <View style={styles.checkboxTextContainer}>
              <Text style={styles.checkboxLabel}>
                I consent to my information being shared with legal
                practitioners for the purpose of consultation. *
              </Text>
            </View>
          </Pressable>
          {touched.consent && errors.consent && (
            <Text style={[styles.errorText, styles.checkboxErrorText]}>
              {errors.consent}
            </Text>
          )}

          {/* Privacy Policy Link */}
          <PrivacyPolicyLink
            containerStyle={styles.privacyLinkContainer}
            textStyle={styles.privacyLink}
          />

          {/* Submit Button */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              isSubmitting && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={
              isSubmitting ? 'Submitting inquiry' : 'Submit inquiry'
            }
            accessibilityState={{ disabled: isSubmitting }}
          >
            {isSubmitting ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.buttonText}>Submitting...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Submit Inquiry</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================================================
// Styles
// ============================================================================

// Using 'as any' to suppress TypeScript errors for web-specific CSS properties
// (cursor, userSelect, outlineStyle, etc.) which are valid for React Native Web
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // soft warm grey background
  },
  // Header styles - matches Full Breakdown modal pattern
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff', // white
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // light grey
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a202c', // near black
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  closeButtonText: {
    color: '#6b7280', // medium grey
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 32,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  // Special Circumstances section styles
  specialCircumstancesSection: {
    marginBottom: 24,
  },
  specialCircumstanceCard: {
    backgroundColor: '#eff6ff', // Blue-50 - very light blue
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: '#3b82f6', // Blue-500 - left accent border
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  specialCircumstanceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  specialCircumstanceIcon: {
    fontSize: 16,
    color: '#3b82f6', // Blue-500
    marginTop: 2,
  },
  specialCircumstanceTextContainer: {
    flex: 1,
    gap: 4,
  },
  specialCircumstanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af', // Blue-800 - dark blue
    lineHeight: 18,
  },
  summaryCard: {
    backgroundColor: '#f9fafb', // very light grey
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb', // light grey
  },
  // Direct Mode card styles
  directModeCard: {
    backgroundColor: '#f9fafb', // very light grey - matches summaryCard
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb', // light grey
  },
  directModeSubtitle: {
    fontSize: 14,
    color: '#6b7280', // grey-500
    marginBottom: 16,
    lineHeight: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4a5568', // dark grey
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280', // grey-500
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6', // blue-500
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a202c', // near black
  },
  summarySeparator: {
    height: 1,
    backgroundColor: '#e5e7eb', // light grey
    marginVertical: 12,
  },
  summarySubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568', // dark grey
    marginBottom: 8,
  },
  careRow: {
    marginBottom: 6,
  },
  careChildLabel: {
    fontSize: 13,
    color: '#6b7280', // grey-500
    marginBottom: 4,
  },
  carePercentages: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  careValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1a202c', // near black
  },
  careSeparator: {
    fontSize: 13,
    color: '#6b7280', // grey-500 - WCAG AA compliant (4.5:1)
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4a5568', // dark grey
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#ffffff', // white
    color: '#1a202c', // near black
    borderRadius: 8,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0', // light grey
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ef4444', // red-500
  },
  textArea: {
    height: 200,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: '#6b7280', // grey-500 - WCAG AA compliant (4.5:1)
    textAlign: 'right',
    marginTop: 4,
  },
  errorText: {
    color: '#ef4444', // red-500
    fontSize: 12,
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6b7280', // grey-500 - WCAG AA compliant (4.5:1)
    backgroundColor: '#ffffff', // white
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6', // blue-500
    borderColor: '#3b82f6',
  },
  checkboxError: {
    borderColor: '#ef4444', // red-500
  },
  checkboxCheck: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#4b5563', // grey-600
    lineHeight: 20,
  },
  checkboxErrorText: {
    marginLeft: 36,
    marginTop: 0,
  },
  privacyLinkContainer: {
    marginBottom: 8,
    marginLeft: 36, // Align with checkbox label
  },
  privacyLink: {
    fontSize: 13,
    color: '#3b82f6', // blue-500
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#3b82f6', // blue-500
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonPressed: {
    backgroundColor: '#2563eb', // blue-600
  },
  buttonDisabled: {
    backgroundColor: '#6b7280', // grey-500 - WCAG AA compliant (4.5:1)
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Success screen styles
  successContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa', // soft warm grey
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContent: {
    alignItems: 'center',
    padding: 40,
  },
  successIcon: {
    fontSize: 64,
    color: '#10b981', // emerald-500
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a202c', // near black
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: '#6b7280', // grey-500
    textAlign: 'center',
    lineHeight: 24,
  },
  // Field label styles
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568', // dark grey
    marginBottom: 8,
  },
  // Financial tags section
  financialSection: {
    marginBottom: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    backgroundColor: '#f3f4f6', // grey-100
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db', // grey-300
  },
  chipActive: {
    backgroundColor: '#3b82f6', // blue-500
    borderColor: '#3b82f6',
  },
  chipError: {
    borderColor: '#ef4444', // red-500
    backgroundColor: '#fef2f2', // red-50
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563', // grey-700
  },
  chipTextActive: {
    color: '#ffffff',
  },
}) as any;
