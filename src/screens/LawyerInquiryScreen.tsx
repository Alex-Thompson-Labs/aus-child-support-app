// Lawyer Inquiry Form Screen
// TODO: Implement this in Day 3-4 of Phase 1
//
// Form for parents to request legal help
// Sends lead brief to lawyers (email for now, API later)

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalytics } from '@/src/utils/analytics';
import { formatCoAReasonsForLead } from '@/src/utils/complexity-detection';
import type { ChangeOfAssessmentReason } from '@/src/utils/change-of-assessment-reasons';
import { getCoAReasonById, getCategoryDisplayInfo, formatOfficialCoAReasons } from '@/src/utils/change-of-assessment-reasons';
import { useResponsive, MAX_FORM_WIDTH, isWeb, webInputStyles, webClickableStyles } from '@/src/utils/responsive';
import { supabase, submitLead } from '@/src/utils/supabase';

export function LawyerInquiryScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const analytics = useAnalytics();

  // Parse route params
  const liability = params.liability as string;
  const trigger = params.trigger as string;
  const incomeA = params.incomeA as string;
  const incomeB = params.incomeB as string;
  const children = params.children as string;

  // Parse complexityTriggers - auto-detected triggers from the calculator
  const complexityTriggers: string[] = (() => {
    try {
      const rawParam = params.complexityTriggers;
      if (!rawParam) return [];

      if (typeof rawParam === 'string') {
        try {
          const parsed = JSON.parse(rawParam);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return rawParam.split(',').filter(id => id.trim());
        }
      }

      return Array.isArray(rawParam) ? rawParam : [];
    } catch (error) {
      console.warn('[LawyerInquiryScreen] Failed to parse complexityTriggers:', error);
      return [];
    }
  })();

  // Parse coaReasons - handle undefined/corrupted params gracefully
  // Note: Parameter comes from ChangeOfAssessmentPrompt as 'coaReasons'
  const selectedCoAReasons: string[] = (() => {
    try {
      const rawParam = params.coaReasons || params.selectedCoAReasons; // Support both names for backwards compat
      if (!rawParam) return [];

      // Handle array (JSON stringified) or comma-separated string
      if (typeof rawParam === 'string') {
        // Try JSON parse first
        try {
          const parsed = JSON.parse(rawParam);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          // Fallback to comma-separated
          return rawParam.split(',').filter(id => id.trim());
        }
      }

      return Array.isArray(rawParam) ? rawParam : [];
    } catch (error) {
      console.warn('[LawyerInquiryScreen] Failed to parse coaReasons:', error);
      return [];
    }
  })();

  // Combine complexity triggers with COA reasons for the final submission
  const allComplexityReasons: string[] = [...new Set([...complexityTriggers, ...selectedCoAReasons])];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Capture mount timestamp for time_to_submit calculation
  const mountTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Record the mount time when component first renders
    mountTimeRef.current = Date.now();

    // Debug: Check if analytics is available
    console.log('[LawyerInquiryScreen] Analytics hook available:', !!analytics);
    console.log('[LawyerInquiryScreen] Mounted with params:', {
      trigger,
      liability,
      complexityTriggersCount: complexityTriggers.length,
      complexityTriggers: complexityTriggers,
      coaReasonsCount: selectedCoAReasons.length,
      coaReasons: selectedCoAReasons,
      allComplexityReasonsCount: allComplexityReasons.length,
      allComplexityReasons: allComplexityReasons,
      rawCoAParam: params.coaReasons || params.selectedCoAReasons
    });

    if (allComplexityReasons.length > 0) {
      console.log('[LawyerInquiryScreen] ✅ Complexity reasons detected:', allComplexityReasons.join(', '));
    } else {
      console.log('[LawyerInquiryScreen] ℹ️ No complexity reasons');
    }
  }, []);

  // Get valid CoA reasons for display
  const validCoAReasons: ChangeOfAssessmentReason[] = selectedCoAReasons
    .map(id => getCoAReasonById(id))
    .filter((reason): reason is ChangeOfAssessmentReason => reason !== null);

  // Determine most important category (for card border styling)
  // Priority: urgent > income > child > other
  const mostImportantCategory = validCoAReasons.reduce<'urgent' | 'income' | 'child' | 'other' | null>(
    (highest, reason) => {
      if (!highest) return reason.category;
      if (reason.category === 'urgent') return 'urgent';
      if (reason.category === 'income' && highest !== 'urgent') return 'income';
      if (reason.category === 'child' && highest !== 'urgent' && highest !== 'income') return 'child';
      return highest;
    },
    null
  );

  const { isMobile, isDesktop } = useResponsive();

  // Web-specific container styles
  const webContainerStyle = isWeb ? {
    maxWidth: MAX_FORM_WIDTH,
    width: '100%' as const,
    alignSelf: 'center' as const,
  } : {};

  const handlePrivacyPolicyPress = () => {
    const privacyPolicyUrl = 'https://bespoke-gumption-e0c968.netlify.app';

    if (Platform.OS === 'web') {
      window.open(privacyPolicyUrl, '_blank');
    } else {
      Linking.openURL(privacyPolicyUrl);
    }
  };

  const handleSubmit = async () => {
    // 1. Validate fields
    if (!name.trim()) {
      if (Platform.OS === 'web') {
        alert('Missing Information\n\nPlease enter your name.');
      } else {
        Alert.alert('Missing Information', 'Please enter your name.');
      }
      return;
    }
    if (!email.trim()) {
      if (Platform.OS === 'web') {
        alert('Missing Information\n\nPlease enter your email address.');
      } else {
        Alert.alert('Missing Information', 'Please enter your email address.');
      }
      return;
    }
    if (!message.trim()) {
      if (Platform.OS === 'web') {
        alert('Missing Information\n\nPlease tell us what you need help with.');
      } else {
        Alert.alert('Missing Information', 'Please tell us what you need help with.');
      }
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (Platform.OS === 'web') {
        alert('Invalid Email\n\nPlease enter a valid email address.');
      } else {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
      }
      return;
    }

    // Check consent
    if (!consent) {
      if (Platform.OS === 'web') {
        alert('Consent Required\n\nYou must consent to sharing your information with legal practitioners.');
      } else {
        Alert.alert('Consent Required', 'You must consent to sharing your information with legal practitioners.');
      }
      return;
    }

    // 2. Calculate time_to_submit (seconds from mount to submission)
    const timeToSubmit = Math.round((Date.now() - mountTimeRef.current) / 1000);

    // 3. Prepare complexity trigger data
    const coaData = formatCoAReasonsForLead(selectedCoAReasons);
    const hasIncomeReasons = validCoAReasons.some(r => r.category === 'income');

    // 4. Track analytics event
    const analyticsProperties = {
      trigger_type: trigger || 'unknown',
      annual_liability: liability ? parseFloat(liability) : 0,
      has_phone: phone.trim().length > 0,
      has_location: location.trim().length > 0,
      message_length: message.trim().length,
      time_to_submit: timeToSubmit,
      // Track auto-detected triggers
      auto_triggers_count: complexityTriggers.length,
      auto_triggers: complexityTriggers.join(','),
      // Track COA selections
      coa_reason_count: selectedCoAReasons.length,
      coa_reason_ids: selectedCoAReasons.join(','),
      // Combined total
      has_complexity_reasons: allComplexityReasons.length > 0,
      total_complexity_count: allComplexityReasons.length,
      all_complexity_reasons: allComplexityReasons.join(', '),
      has_income_reasons: hasIncomeReasons,
      most_important_category: mostImportantCategory,
    };

    console.log('[LawyerInquiryScreen] Form submitted - tracking analytics');
    try {
      analytics.track('inquiry_form_submitted', analyticsProperties);
    } catch (error) {
      console.error('[LawyerInquiryScreen] Analytics tracking failed:', error);
    }

    // 5. Submit lead to Supabase
    setSubmitting(true);

    try {
      const leadData = {
        parent_name: name.trim(),
        parent_email: email.trim(),
        parent_phone: phone.trim() || null,
        location: location.trim() || null,
        income_parent_a: incomeA ? parseFloat(incomeA) : 0,
        income_parent_b: incomeB ? parseFloat(incomeB) : 0,
        children_count: children ? parseInt(children) : 0,
        annual_liability: liability ? parseFloat(liability) : 0,
        care_data: null, // TODO: Add care arrangement data if needed
        complexity_trigger: trigger || 'unknown',
        // Combined complexity triggers and COA reasons
        complexity_reasons: allComplexityReasons,
        coa_reasons: coaData,
        parent_message: message.trim(),
        preferred_contact: phone.trim() ? 'phone' : 'email',
        consent_given: consent,
        status: 'new' as const,
      };

      console.log('[LawyerInquiryScreen] Submitting lead to Supabase...');
      const result = await submitLead(leadData);

      if (!result.success) {
        console.error('[LawyerInquiryScreen] Lead submission failed:', result.error);
        if (Platform.OS === 'web') {
          alert(`Submission Failed\n\n${result.error || 'Unknown error occurred'}`);
        } else {
          Alert.alert('Submission Failed', result.error || 'Unknown error occurred');
        }
        return;
      }

      console.log('[LawyerInquiryScreen] Lead submitted successfully:', result.leadId);

      // 6. Show success message
      if (Platform.OS === 'web') {
        alert('Inquiry Submitted\n\nThank you! A lawyer will review your case and contact you soon.');
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/');
        }
      } else {
        Alert.alert(
          'Inquiry Submitted',
          'Thank you! A lawyer will review your case and contact you soon.',
          [
            {
              text: 'OK',
              onPress: () => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/');
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('[LawyerInquiryScreen] Unexpected error:', error);
      if (Platform.OS === 'web') {
        alert(`Error\n\n${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      } else {
        Alert.alert('Error', error instanceof Error ? error.message : 'Unknown error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
          <Text style={[styles.title, isDesktop && styles.titleDesktop]}>Request Legal Help</Text>

          {/* Complexity Triggers Card - Show only if reasons exist */}
          {validCoAReasons.length > 0 && (
            <View style={[
              styles.coaCard,
              mostImportantCategory && {
                borderColor: getCategoryDisplayInfo(mostImportantCategory).accentColor,
                borderWidth: 2,
              }
            ]}>
              <Text style={styles.coaTitle}>💭 COMPLEXITY TRIGGERS SELECTED</Text>

              {validCoAReasons.map((reason, index) => {
                const categoryInfo = getCategoryDisplayInfo(reason.category);
                return (
                  <View key={reason.id} style={[
                    styles.coaReasonContainer,
                    index < validCoAReasons.length - 1 && styles.coaReasonBorder
                  ]}>
                    <View style={styles.coaReasonHeader}>
                      <Text style={[
                        styles.coaReasonIcon,
                        { color: categoryInfo.accentColor }
                      ]}>
                        {categoryInfo.emoji}
                      </Text>
                      <Text style={styles.coaReasonLabel} numberOfLines={2}>
                        {reason.label}
                      </Text>
                    </View>
                    <Text style={styles.coaReasonDescription} numberOfLines={3}>
                      {reason.description}
                    </Text>
                    <Text style={styles.coaOfficialReasons}>
                      Official grounds: {formatOfficialCoAReasons(reason)}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Calculation Summary (read-only) */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Your Calculation Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Annual Liability:</Text>
              <Text style={styles.summaryAmount}>${liability ? parseFloat(liability).toLocaleString() : '0'}/year</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Complexity Trigger:</Text>
              <Text style={styles.summaryValue}>{trigger || 'unknown'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Parent A Income:</Text>
              <Text style={styles.summaryValue}>${incomeA ? parseFloat(incomeA).toLocaleString() : '0'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Parent B Income:</Text>
              <Text style={styles.summaryValue}>${incomeB ? parseFloat(incomeB).toLocaleString() : '0'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Number of Children:</Text>
              <Text style={styles.summaryValue}>{children || '0'}</Text>
            </View>
          </View>

          <Text style={styles.formTitle}>Your Information</Text>

          <TextInput
            style={[styles.input, isWeb && webInputStyles]}
            placeholder="Your Name"
            placeholderTextColor="#64748b"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={[styles.input, isWeb && webInputStyles]}
            placeholder="Email"
            placeholderTextColor="#64748b"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={[styles.input, isWeb && webInputStyles]}
            placeholder="Phone (optional)"
            placeholderTextColor="#64748b"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <TextInput
            style={[styles.input, isWeb && webInputStyles]}
            placeholder="Location (e.g. Sydney, NSW)"
            placeholderTextColor="#64748b"
            value={location}
            onChangeText={setLocation}
          />

          <TextInput
            style={[styles.input, styles.textArea, isWeb && webInputStyles]}
            placeholder="What do you need help with?"
            placeholderTextColor="#64748b"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />

          {/* Consent Checkbox */}
          <Pressable
            style={[styles.consentContainer, isWeb && webClickableStyles]}
            onPress={() => setConsent(!consent)}
          >
            <View style={[styles.checkbox, consent && styles.checkboxChecked]}>
              {consent && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.consentText}>
              I consent to my information being shared with legal practitioners for the purpose of consultation
            </Text>
          </Pressable>

          {/* Privacy Policy Link */}
          <Pressable
            style={[styles.privacyLinkContainer, isWeb && webClickableStyles]}
            onPress={handlePrivacyPolicyPress}
          >
            <Text style={styles.privacyLinkText}>View Privacy Policy</Text>
          </Pressable>

          <Pressable 
            style={[
              styles.button, 
              (!consent || submitting) && styles.buttonDisabled,
              isWeb && webClickableStyles, 
              isWeb && styles.buttonWeb
            ]} 
            onPress={handleSubmit}
            disabled={!consent || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Submit Inquiry</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // slate-900
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
  },
  titleDesktop: {
    fontSize: 28,
    marginBottom: 24,
  },
  // Complexity triggers card styles
  coaCard: {
    backgroundColor: '#1e293b', // slate-800
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#334155', // slate-700 (default, overridden inline by category color)
  },
  coaTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94a3b8', // slate-400
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  coaReasonContainer: {
    marginBottom: 12,
  },
  coaReasonBorder: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155', // slate-700
  },
  coaReasonHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  coaReasonIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
    // color set inline based on category
  },
  coaReasonLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 20,
  },
  coaReasonDescription: {
    fontSize: 13,
    color: '#94a3b8', // slate-400
    lineHeight: 18,
    marginLeft: 24, // Align with label (icon width + margin)
  },
  coaOfficialReasons: {
    fontSize: 11,
    color: '#64748b', // slate-500
    fontStyle: 'italic',
    marginTop: 4,
    marginLeft: 24, // Align with description
    lineHeight: 16,
  },
  summaryCard: {
    backgroundColor: '#1e293b', // slate-800
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155', // slate-700
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#94a3b8', // slate-400
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb', // blue-600
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#1e293b', // slate-800
    color: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155', // slate-700
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2563eb', // blue-600
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonWeb: {
    paddingVertical: 14,
    // Slight hover effect handled by webClickableStyles cursor
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  consentContainer: {
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
    borderColor: '#64748b',
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  consentText: {
    flex: 1,
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  privacyLinkContainer: {
    marginTop: 12,
    marginBottom: 4,
    alignItems: 'center',
  },
  privacyLinkText: {
    fontSize: 14,
    color: '#3b82f6', // blue-500
    textDecorationLine: 'underline',
  },
});

