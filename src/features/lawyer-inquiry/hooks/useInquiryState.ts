/**
 * Lawyer Inquiry Feature - State Management Hook
 *
 * Handles form state and navigation logic.
 */

import { sanitizeCountry } from '@/src/utils/all-countries';
import {
    EXCLUDED_JURISDICTIONS,
    RECIPROCATING_JURISDICTIONS,
} from '@/src/utils/reciprocating-jurisdictions';
import type { SpecialCircumstance } from '@/src/utils/special-circumstances';
import {
    getSpecialCircumstanceById,
    isCourtDateReason,
} from '@/src/utils/special-circumstances';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Linking, Platform, TextInput } from 'react-native';
import type { FormErrors, FormTouched } from '../types';

export interface UseInquiryStateProps {
  preFillMessage: string;
  specialCircumstances: string[] | null;
  reason: string | undefined;
  returnTo: string | undefined;
}

export function useInquiryState(props: UseInquiryStateProps) {
  const router = useRouter();

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

  // PSI (Post-Separation Income) field state
  const [separationDate, setSeparationDate] = useState<Date | null>(null);
  const [cohabited6Months, setCohabited6Months] = useState(false);

  // International Jurisdiction field state
  const [otherParentCountry, setOtherParentCountry] = useState('');

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
    separationDate: false,
    cohabited6Months: false,
    otherParentCountry: false,
  });

  // Refs for input focus management
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const postcodeRef = useRef<TextInput>(null);
  const messageRef = useRef<TextInput>(null);
  const manualIncomeARef = useRef<TextInput>(null);
  const manualIncomeBRef = useRef<TextInput>(null);
  const manualChildrenRef = useRef<TextInput>(null);

  // Determine if conditional fields should be shown
  const shouldShowCourtDate = useMemo(
    () =>
      (props.specialCircumstances || []).some((id) => isCourtDateReason(id)),
    [props.specialCircumstances]
  );

  // Get valid Special Circumstances for display, sorted by priority
  const validCircumstances = useMemo(() => {
    const circumstances = (props.specialCircumstances || [])
      .filter((id) => !isCourtDateReason(id))
      .map((id) => {
        const reason = getSpecialCircumstanceById(id);
        if (!reason) return null;

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

    // Add dynamic court date card if court date field should be shown
    if (shouldShowCourtDate) {
      if (courtDate) {
        const formatted = courtDate.toLocaleDateString('en-AU', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        circumstances.push({
          id: 'court_date_dynamic',
          label: `I have an upcoming court hearing regarding child support. (${formatted})`,
          description:
            'Upcoming court dates are critical events. Professional legal preparation is strongly recommended to protect your interests before your appearance.',
          category: 'urgent' as const,
          priority: 1,
          officialCodes: ['5.2.11'] as const,
          urgency: 'URGENT' as const,
        });
      } else {
        circumstances.push({
          id: 'court_date_dynamic',
          label: 'I have an upcoming court hearing regarding child support.',
          description:
            'Upcoming court dates are critical events. Professional legal preparation is strongly recommended to protect your interests before your appearance.',
          category: 'urgent' as const,
          priority: 1,
          officialCodes: ['5.2.11'] as const,
          urgency: 'URGENT' as const,
        });
      }
    }

    return circumstances.sort((a, b) => a.priority - b.priority);
  }, [props.specialCircumstances, courtDate, shouldShowCourtDate]);

  const shouldShowFinancialTags = useMemo(
    () =>
      props.reason === 'hidden_income' ||
      (props.specialCircumstances || []).some(
        (id) => id === 'income_resources_not_reflected'
      ),
    [props.reason, props.specialCircumstances]
  );

  // PSI (Post-Separation Income) conditional fields
  const shouldShowPsiFields = useMemo(
    () =>
      (props.specialCircumstances || []).includes('post_separation_income'),
    [props.specialCircumstances]
  );

  const showPsiWarning = useMemo(() => {
    if (!separationDate || !shouldShowPsiFields) return false;

    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

    return separationDate < threeYearsAgo;
  }, [separationDate, shouldShowPsiFields]);

  // International Jurisdiction conditional fields
  const shouldShowInternationalFields = useMemo(
    () =>
      (props.specialCircumstances || []).includes('international_jurisdiction'),
    [props.specialCircumstances]
  );

  const internationalWarning = useMemo((): 'excluded' | 'non_reciprocating' | null => {
    if (!otherParentCountry || !shouldShowInternationalFields) return null;

    const sanitized = sanitizeCountry(otherParentCountry);
    if (!sanitized) return null;

    const isExcluded = EXCLUDED_JURISDICTIONS.some(
      (j) => j.toLowerCase() === sanitized.toLowerCase()
    );
    if (isExcluded) return 'excluded';

    const isReciprocating = RECIPROCATING_JURISDICTIONS.some(
      (j) => j.toLowerCase() === sanitized.toLowerCase()
    );
    if (!isReciprocating) return 'non_reciprocating';

    return null;
  }, [otherParentCountry, shouldShowInternationalFields]);

  /**
   * Navigate home helper
   */
  const navigateHome = useCallback(() => {
    if (props.returnTo) {
      if (Platform.OS === 'web') {
        window.location.href = props.returnTo;
      } else {
        Linking.openURL(props.returnTo);
      }
      return;
    }

    try {
      router.replace({
        pathname: '/',
        params: { reset: 'true' },
      });
    } catch (error) {
      router.replace('/');
    }
  }, [router, props.returnTo]);

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
    separationDate,
    cohabited6Months,
    otherParentCountry,
    errors,
    touched,

    // Setters
    setName,
    setEmail,
    setPhone,
    setPostcode,
    setMessage,
    setConsent,
    setCourtDate,
    setFinancialTags,
    setManualIncomeA,
    setManualIncomeB,
    setManualChildren,
    setSeparationDate,
    setCohabited6Months,
    setOtherParentCountry,
    setErrors,
    setTouched,

    // Refs
    emailRef,
    phoneRef,
    postcodeRef,
    messageRef,
    manualIncomeARef,
    manualIncomeBRef,
    manualChildrenRef,

    // Computed
    validCircumstances,
    shouldShowCourtDate,
    shouldShowFinancialTags,
    shouldShowPsiFields,
    showPsiWarning,
    shouldShowInternationalFields,
    internationalWarning,

    // Navigation
    navigateHome,
  };
}
