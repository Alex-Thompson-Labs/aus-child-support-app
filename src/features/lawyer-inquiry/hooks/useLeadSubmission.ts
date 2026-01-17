/**
 * Lawyer Inquiry Feature - Lead Submission Hook
 *
 * Handles Supabase submission logic and enrichment flow.
 */

import type { PartnerKey } from '@/src/config/partners';
import { useAnalytics } from '@/src/utils/analytics';
import { calculateLeadScore } from '@/src/utils/lead-scoring';
import { isCourtDateReason } from '@/src/utils/special-circumstances';
import { submitLeadWithPartner } from '@/src/utils/submit-lead';
import type { LeadSubmission } from '@/src/utils/supabase';
import { updateLeadEnrichment } from '@/src/utils/supabase';
import { useCallback, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { ENRICHMENT_INQUIRY_TYPES } from '../config';
import type { CareDataItem } from '../types';
import {
  buildComplexityTriggers,
  formatCourtDateForReasons,
  sanitizeEmail,
  sanitizePhone,
  sanitizeString,
} from '../validators';

export interface UseLeadSubmissionProps {
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
  separationDate: Date | null;
  cohabited6Months: boolean;
  otherParentCountry: string;

  // Calculator context
  liability: string;
  trigger: string;
  incomeA: string;
  incomeB: string;
  children: string;
  payer: string;
  careData: CareDataItem[];
  specialCircumstances: string[] | null;
  isDirectMode: boolean;
  reason: string | undefined;

  // Chatbot data
  hasParentingPlan: string | undefined;
  assessmentType: string | undefined;
  returnTo: string | undefined;
  partner: string | undefined;
  calculatorStartTime: number | undefined;

  // Conditional fields
  shouldShowPsiFields: boolean;
  shouldShowInternationalFields: boolean;

  // Validation
  validateAllFields: () => boolean;

  // Computed
  validCircumstances: Array<{ urgency: 'URGENT' | 'NORMAL' }>;

  // Navigation
  navigateHome: () => void;
}

export function useLeadSubmission(props: UseLeadSubmissionProps) {
  const analytics = useAnalytics();

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Enrichment flow state
  const [showEnrichment, setShowEnrichment] = useState(false);
  const [showEnrichmentSuccess, setShowEnrichmentSuccess] = useState(false);
  const [currentLeadId, setCurrentLeadId] = useState<string | null>(null);
  const [selectedEnrichmentFactors, setSelectedEnrichmentFactors] = useState<
    string[]
  >([]);
  const [isUpdatingEnrichment, setIsUpdatingEnrichment] = useState(false);
  const [enrichmentLiability, setEnrichmentLiability] = useState<number | null>(
    null
  );
  const [enrichmentPayerRole, setEnrichmentPayerRole] = useState<
    'you' | 'other_parent' | null
  >(null);

  // Track mount time for time_to_submit calculation
  const mountTimeRef = useRef<number>(Date.now());

  // Track if component is mounted
  const isMounted = useRef(true);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    // Validate all fields
    const isValid = props.validateAllFields();

    if (!isValid) {
      if (Platform.OS === 'web') {
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
          trigger_type: props.isDirectMode
            ? 'direct'
            : props.trigger || 'unknown',
          is_direct_mode: props.isDirectMode,
          direct_mode_reason: props.isDirectMode
            ? props.reason || 'none'
            : 'n/a',
          annual_liability: props.isDirectMode
            ? 0
            : props.liability
              ? Number(parseFloat(props.liability).toFixed(2))
              : 0,
          has_phone: !!sanitizePhone(props.phone),
          message_length: sanitizeString(props.message).length,
          time_to_submit: timeToSubmit,
          has_complexity_reasons:
            (props.specialCircumstances?.length ?? 0) > 0,
          complexity_reason_count: props.specialCircumstances?.length ?? 0,
          complexity_reason_ids: props.specialCircumstances?.join(',') ?? '',
          has_urgent_reasons: props.validCircumstances.some(
            (r) => r.urgency === 'URGENT'
          ),
        });
      } catch (error) {
        // Don't fail submission on analytics error
      }

      // Prepare complexity reasons array
      const complexityReasonsWithCourtDate = (
        props.specialCircumstances || []
      ).filter((id) => !isCourtDateReason(id));

      if (props.courtDate) {
        complexityReasonsWithCourtDate.push(
          formatCourtDateForReasons(props.courtDate)
        );
      }

      // Calculate lead score
      const scoreResult = calculateLeadScore({
        specialCircumstances: complexityReasonsWithCourtDate,
        financialTags: props.financialTags,
        courtDate: props.courtDate,
        liability: props.isDirectMode ? 0 : parseFloat(props.liability) || 0,
        careData: props.isDirectMode ? undefined : props.careData,
        bindingAgreement: false,
      });

      // Create lead submission
      const leadSubmission: LeadSubmission = {
        // Parent contact
        parent_name: sanitizeString(props.name),
        parent_email: sanitizeEmail(props.email),
        parent_phone: sanitizePhone(props.phone) || null,
        location: props.postcode.trim() || null,

        // Calculation data
        income_parent_a: props.isDirectMode
          ? parseInt(props.manualIncomeA.replace(/[^0-9]/g, ''), 10) || 0
          : parseFloat(props.incomeA) || 0,
        income_parent_b: props.isDirectMode
          ? parseInt(props.manualIncomeB.replace(/[^0-9]/g, ''), 10) || 0
          : parseFloat(props.incomeB) || 0,
        children_count: props.isDirectMode
          ? parseInt(props.manualChildren, 10) || 0
          : parseInt(props.children) || 0,
        annual_liability: props.isDirectMode
          ? 0
          : parseFloat(props.liability) || 0,
        payer_role: props.isDirectMode
          ? null
          : props.payer === 'Parent A'
            ? 'you'
            : props.payer === 'Parent B'
              ? 'other_parent'
              : null,

        // Care arrangement
        care_data: props.isDirectMode
          ? null
          : props.careData.length > 0
            ? props.careData
            : null,

        // Complexity data
        complexity_trigger: props.isDirectMode
          ? ['direct_inquiry']
          : buildComplexityTriggers(
              props.trigger,
              props.specialCircumstances,
              props.financialTags,
              props.careData,
              props.liability
            ),
        complexity_reasons: props.isDirectMode
          ? props.reason
            ? [props.reason]
            : []
          : complexityReasonsWithCourtDate,

        // Dynamic lead data
        financial_tags:
          props.financialTags.length > 0 ? props.financialTags : null,

        // Message
        parent_message: sanitizeString(props.message) || '',

        // Privacy compliance
        consent_given: props.consent,

        // Initial status
        status: 'new',

        // Chatbot data
        parenting_plan_status: props.hasParentingPlan || null,
        inquiry_type: props.assessmentType || null,
        referer_url: props.returnTo || null,

        // Lead scoring
        lead_score: scoreResult.score,
        score_category: scoreResult.category,
        scoring_factors: scoreResult.factors,
        score_breakdown: scoreResult.breakdown,

        // Special circumstances additional data
        special_circumstances_data:
          props.shouldShowPsiFields || props.shouldShowInternationalFields
            ? {
                ...(props.shouldShowPsiFields && props.separationDate
                  ? { separation_date: props.separationDate.toISOString() }
                  : {}),
                ...(props.shouldShowPsiFields
                  ? { cohabited_6_months: props.cohabited6Months }
                  : {}),
                ...(props.shouldShowInternationalFields &&
                props.otherParentCountry
                  ? { other_parent_country: props.otherParentCountry }
                  : {}),
              }
            : null,

        // Time tracking
        time_to_complete: props.calculatorStartTime
          ? Math.round((Date.now() - props.calculatorStartTime) / 1000)
          : timeToSubmit,
      };

      // Submit to Supabase
      const partnerId = props.partner as PartnerKey | undefined;
      const result = await submitLeadWithPartner(
        leadSubmission,
        partnerId ?? null
      );

      if (!result.success) {
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

      // Track lead_submitted
      try {
        analytics.track('lead_submitted', {
          lead_id: result.leadId ?? null,
          trigger_type: props.isDirectMode
            ? 'direct'
            : props.trigger || 'unknown',
          is_direct_mode: props.isDirectMode,
          total_liability: props.isDirectMode
            ? 0
            : parseFloat(props.liability) || 0,
          complexity_reason_count: props.specialCircumstances?.length ?? 0,
          time_to_submit: timeToSubmit,
          partner_id: props.partner ?? null,
        });
      } catch (error) {
        // Don't fail submission on analytics error
      }

      setIsSubmitting(false);

      // Check if should show enrichment flow
      const shouldShowEnrichmentFlow =
        props.reason && ENRICHMENT_INQUIRY_TYPES.includes(props.reason);

      if (shouldShowEnrichmentFlow && result.leadId) {
        setCurrentLeadId(result.leadId);
        setShowEnrichment(true);
      } else {
        setShowSuccess(true);
      }
    } catch (error) {
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
    props,
    analytics,
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
   * Handle enrichment submission
   */
  const handleEnrichmentSubmit = useCallback(async () => {
    if (!currentLeadId) {
      props.navigateHome();
      return;
    }

    if (
      selectedEnrichmentFactors.length === 0 &&
      enrichmentLiability === null
    ) {
      props.navigateHome();
      return;
    }

    setIsUpdatingEnrichment(true);

    try {
      await updateLeadEnrichment(
        currentLeadId,
        selectedEnrichmentFactors,
        enrichmentLiability ?? undefined,
        enrichmentPayerRole ?? undefined
      );
    } catch (error) {
      // Continue even if update fails
    }

    setIsUpdatingEnrichment(false);
    setShowEnrichmentSuccess(true);

    setTimeout(() => {
      if (!isMounted.current) return;
      props.navigateHome();
    }, 1500);
  }, [
    currentLeadId,
    selectedEnrichmentFactors,
    enrichmentLiability,
    enrichmentPayerRole,
    props,
  ]);

  /**
   * Skip enrichment
   */
  const handleSkipEnrichment = useCallback(() => {
    props.navigateHome();
  }, [props]);

  return {
    // State
    isSubmitting,
    showSuccess,
    showEnrichment,
    showEnrichmentSuccess,
    currentLeadId,
    selectedEnrichmentFactors,
    isUpdatingEnrichment,
    enrichmentLiability,
    enrichmentPayerRole,

    // Setters
    setEnrichmentLiability,
    setEnrichmentPayerRole,

    // Handlers
    handleSubmit,
    handleEnrichmentFactorToggle,
    handleEnrichmentSubmit,
    handleSkipEnrichment,

    // Refs
    isMounted,
  };
}
