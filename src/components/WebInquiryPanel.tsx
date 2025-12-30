import React, { useState, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAnalytics } from '../utils/analytics';
import { getCoAReasonById } from '../utils/change-of-assessment-reasons';
import type { ChangeOfAssessmentReason } from '../utils/change-of-assessment-reasons';
import { formatCurrency } from '../utils/formatters';
import {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  validateName,
  validateEmail,
  validatePhone,
  validateMessage,
  validateConsent,
} from '../utils/form-validation';
import { submitLead } from '../utils/supabase';
import type { LeadSubmission } from '../utils/supabase';
import { isWeb, webInputStyles, webClickableStyles } from '../utils/responsive';
import { createShadow } from '../utils/shadow-styles';
import { ConsentCheckbox } from './ConsentCheckbox';
import { PrivacyPolicyLink } from './PrivacyPolicyLink';
import { CalculationSummaryCard } from './CalculationSummaryCard';

// ============================================================================
// Types
// ============================================================================

interface WebInquiryPanelProps {
  liability: string;
  trigger: string;
  complexityTriggers?: string[];  // All auto-detected triggers as array
  incomeA: string;
  incomeB: string;
  children: string;
  careData: Array<{ index: number; careA: number; careB: number }>;
  coaReasons: string[] | null;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  consent?: string;
}


// ============================================================================
// Component
// ============================================================================

export function WebInquiryPanel({
  liability,
  trigger,
  complexityTriggers = [],
  incomeA,
  incomeB,
  children,
  careData,
  coaReasons,
  onClose,
  onSuccess,
}: WebInquiryPanelProps) {
  const analytics = useAnalytics();
  const mountTimeRef = useRef<number>(Date.now());

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Parse COA reasons
  const validCoAReasons: Array<ChangeOfAssessmentReason & { urgency: 'URGENT' | 'NORMAL' }> =
    (coaReasons || [])
      .map(id => {
        const reason = getCoAReasonById(id);
        if (!reason) return null;
        const urgency: 'URGENT' | 'NORMAL' = reason.priority <= 3 ? 'URGENT' : 'NORMAL';
        return { ...reason, urgency };
      })
      .filter((reason): reason is ChangeOfAssessmentReason & { urgency: 'URGENT' | 'NORMAL' } => reason !== null);

  // Validate all fields
  const validateAll = useCallback(() => {
    const newErrors: FormErrors = {
      name: validateName(name),
      email: validateEmail(email),
      phone: validatePhone(phone),
      message: validateMessage(message),
      consent: validateConsent(consent),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  }, [name, email, phone, message, consent]);

  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (!validateAll()) return;

    setIsSubmitting(true);

    try {
      const timeToSubmit = Math.round((Date.now() - mountTimeRef.current) / 1000);

      // Combine auto-detected triggers with COA selections (deduplicated)
      const allComplexityReasons = [...new Set([...complexityTriggers, ...(coaReasons || [])])];

      // Track analytics
      analytics.track('inquiry_form_submitted', {
        trigger_type: trigger || 'unknown',
        annual_liability: parseFloat(liability) || 0,
        has_location: location.trim().length > 0,
        // Track auto-detected triggers
        auto_triggers_count: complexityTriggers.length,
        auto_triggers: complexityTriggers.join(','),
        // Track COA selections
        coa_reason_count: coaReasons?.length || 0,
        coa_reason_ids: coaReasons?.join(',') || '',
        // Combined total
        has_complexity_reasons: allComplexityReasons.length > 0,
        total_complexity_count: allComplexityReasons.length,
        all_complexity_reasons: allComplexityReasons.join(', '),
        time_to_submit_seconds: timeToSubmit,
        form_source: 'web_inline_panel',
      });

      // Format COA reasons for submission
      const coaReasonsData = validCoAReasons.length > 0 ? {
        count: validCoAReasons.length,
        reasons: validCoAReasons.map(r => ({
          label: r.label,
          description: r.description,
          category: r.category as string,
          urgency: (r.urgency === 'URGENT' ? 'URGENT' : 'Normal') as 'URGENT' | 'Normal',
          officialCoAReasons: r.officialCoAReasons?.join(', ') || '',
        })),
      } : null;

      const leadSubmission: LeadSubmission = {
        parent_name: sanitizeString(name),
        parent_email: sanitizeEmail(email),
        parent_phone: sanitizePhone(phone) || null,
        location: location.trim() || null,
        income_parent_a: parseFloat(incomeA) || 0,
        income_parent_b: parseFloat(incomeB) || 0,
        children_count: parseInt(children) || 0,
        annual_liability: parseFloat(liability) || 0,
        care_data: careData.length > 0 ? careData : null,
        complexity_trigger: trigger || 'unknown',
        // Combined complexity triggers and COA reasons
        complexity_reasons: allComplexityReasons,
        coa_reasons: coaReasonsData,
        parent_message: sanitizeString(message),
        preferred_contact: null,
        consent_given: consent,
        status: 'new',
      };

      await submitLead(leadSubmission);
      setIsSuccess(true);
      onSuccess?.();

    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      setErrors({ ...errors, consent: 'Failed to submit. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [validateAll, analytics, trigger, complexityTriggers, liability, coaReasons, validCoAReasons, name, email, phone, message, consent, incomeA, incomeB, children, careData, onSuccess, errors]);

  // Success state
  if (isSuccess) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Request Submitted</Text>
          <Pressable onPress={onClose} style={[styles.closeButton, webClickableStyles]}>
            <Text style={styles.closeButtonText}>×</Text>
          </Pressable>
        </View>
        <View style={styles.successContent}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Thank You!</Text>
          <Text style={styles.successText}>
            Your inquiry has been submitted. A lawyer will contact you within 24 hours.
          </Text>
          <Pressable onPress={onClose} style={[styles.doneButton, webClickableStyles]}>
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Request Legal Help</Text>
        <Pressable onPress={onClose} style={[styles.closeButton, webClickableStyles]}>
          <Text style={styles.closeButtonText}>×</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        {/* COA Reasons Card */}
        {validCoAReasons.length > 0 && (
          <View style={styles.coaSection}>
            <Text style={styles.coaSectionTitle}>CHANGE OF ASSESSMENT GROUNDS SELECTED</Text>
            {validCoAReasons.map((reason, index) => (
              <View key={reason.id || index} style={styles.coaReasonCard}>
                <View style={styles.coaReasonHeader}>
                  <Text style={styles.coaReasonIcon}>⚠</Text>
                  <View style={styles.coaReasonTextContainer}>
                    <Text style={styles.coaReasonTitle}>{reason.label}</Text>
                    <Text style={styles.coaReasonDescription}>{reason.description}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Two-column form layout */}
        <View style={styles.formColumns}>
          {/* Left: Form fields */}
          <View style={styles.formColumn}>
            <Text style={styles.sectionTitle}>YOUR INFORMATION</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError, webInputStyles]}
                value={name}
                onChangeText={setName}
                placeholder="Your full name"
                placeholderTextColor="#64748b"
                autoCapitalize="words"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError, webInputStyles]}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor="#64748b"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError, webInputStyles]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Your phone number"
                placeholderTextColor="#64748b"
                keyboardType="phone-pad"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Postcode *</Text>
              <TextInput
                style={[styles.input, webInputStyles]}
                value={location}
                onChangeText={setLocation}
                placeholder="e.g. 2000"
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Message *</Text>
                <Text style={styles.charCount}>{message.length}/500</Text>
              </View>
              <TextInput
                style={[styles.textArea, errors.message && styles.inputError, webInputStyles]}
                value={message}
                onChangeText={setMessage}
                placeholder="Describe your situation..."
                placeholderTextColor="#64748b"
                multiline
                numberOfLines={4}
                maxLength={500}
              />
              {errors.message && <Text style={styles.errorText}>{errors.message}</Text>}
            </View>
          </View>

          {/* Right: Summary + Submit */}
          <View style={styles.summaryColumn}>
            <CalculationSummaryCard
              liability={liability}
              incomeA={incomeA}
              incomeB={incomeB}
              children={children}
              variant="compact"
            />

            {/* Consent */}
            <ConsentCheckbox
              checked={consent}
              onCheckedChange={setConsent}
              error={errors.consent}
            />

            {/* Privacy link */}
            <PrivacyPolicyLink />

            {/* Submit button */}
            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled, webClickableStyles]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Request</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff', // white
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0', // subtle border
    overflow: 'hidden',
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c', // near black
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f7fafc', // very light grey
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#4a5568', // dark grey
    fontSize: 20,
    fontWeight: '500',
  },
  scrollContent: {
    maxHeight: 600,
  },
  scrollContentContainer: {
    padding: 16,
    gap: 16,
  },
  coaSection: {
    marginBottom: 16,
  },
  coaSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4a5568', // dark grey
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  coaReasonCard: {
    backgroundColor: '#eff6ff', // Blue-50 - very light blue
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: '#3b82f6', // Blue-500 - left accent border
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  coaReasonHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  coaReasonIcon: {
    fontSize: 16,
    color: '#3b82f6', // Blue-500
    marginTop: 2,
  },
  coaReasonTextContainer: {
    flex: 1,
    gap: 4,
  },
  coaReasonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af', // Blue-800 - dark blue
    lineHeight: 18,
  },
  coaReasonDescription: {
    fontSize: 13,
    color: '#475569', // Slate-600 - medium grey
    lineHeight: 18,
  },
  formColumns: {
    flexDirection: 'row',
    gap: 20,
  },
  formColumn: {
    flex: 1,
    gap: 12,
  },
  summaryColumn: {
    flex: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4a5568', // dark grey
    letterSpacing: 0.5,
  },
  field: {
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    color: '#4a5568', // dark grey
  },
  charCount: {
    fontSize: 11,
    color: '#718096', // medium grey
  },
  input: {
    backgroundColor: '#ffffff', // white
    borderWidth: 1.5,
    borderColor: '#e2e8f0', // subtle border
    borderRadius: 6,
    padding: 10,
    color: '#1a202c', // near black
    fontSize: 14,
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 10,
    color: '#1a202c',
    fontSize: 14,
    minHeight: 160,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ef4444', // red-500
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444', // red-500 for better contrast
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  // Success state
  successContent: {
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  successIcon: {
    fontSize: 48,
    color: '#10b981', // emerald-500
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a202c', // near black
  },
  successText: {
    fontSize: 14,
    color: '#718096', // medium grey
    textAlign: 'center',
    lineHeight: 20,
  },
  doneButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 8,
  },
  doneButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
