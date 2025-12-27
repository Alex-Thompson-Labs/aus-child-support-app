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
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalytics } from '@/src/utils/analytics';
import { getCoAReasonById, formatCoAReasonsForLead } from '@/src/utils/complexity-detection';
import type { ChangeOfAssessmentReason } from '@/src/utils/change-of-assessment-reasons';
import { getCategoryDisplayInfo, formatOfficialCoAReasons } from '@/src/utils/change-of-assessment-reasons';
import { useResponsive, MAX_FORM_WIDTH, isWeb, webInputStyles, webClickableStyles } from '@/src/utils/responsive';

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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

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
      coaReasonsCount: selectedCoAReasons.length,
      coaReasons: selectedCoAReasons,
      rawCoAParam: params.coaReasons || params.selectedCoAReasons
    });
    
    if (selectedCoAReasons.length > 0) {
      console.log('[LawyerInquiryScreen] ✅ CoA reasons detected - card should display');
    } else {
      console.log('[LawyerInquiryScreen] ℹ️ No CoA reasons - card will not display');
    }
  }, []);

  // Get valid CoA reasons for display
  const validCoAReasons: ChangeOfAssessmentReason[] = selectedCoAReasons
    .map(id => getCoAReasonById(id))
    .filter((reason): reason is ChangeOfAssessmentReason => reason !== null);

  // Determine most important category (for card border styling)
  // Priority: income > child > other
  const mostImportantCategory = validCoAReasons.reduce<'income' | 'child' | 'other' | null>(
    (highest, reason) => {
      if (!highest) return reason.category;
      if (reason.category === 'income') return 'income';
      if (reason.category === 'child' && highest !== 'income') return 'child';
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

  // DEBUG: Test button to force-fire analytics event
  const testAnalytics = () => {
    console.log('[DEBUG] Test button clicked - firing test event');
    analytics.track('inquiry_form_submitted', {
      trigger_type: 'test',
      annual_liability: 12345,
      has_phone: true,
      message_length: 100,
      time_to_submit: 30,
    });
    console.log('[DEBUG] Test event fired');
  };

  const handleSubmit = () => {
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

    // 2. Calculate time_to_submit (seconds from mount to submission)
    const timeToSubmit = Math.round((Date.now() - mountTimeRef.current) / 1000);

    // 3. Prepare complexity trigger data
    const coaData = formatCoAReasonsForLead(selectedCoAReasons);
    const hasIncomeReasons = validCoAReasons.some(r => r.category === 'income');

    // 4. Track analytics event AFTER validation but BEFORE async operations
    const analyticsProperties = {
      trigger_type: trigger || 'unknown',
      annual_liability: liability ? parseFloat(liability) : 0,
      has_phone: phone.trim().length > 0,
      message_length: message.trim().length,
      time_to_submit: timeToSubmit,
      // Complexity trigger analytics
      has_complexity_reasons: selectedCoAReasons.length > 0,
      complexity_reason_count: selectedCoAReasons.length,
      complexity_reason_ids: selectedCoAReasons.join(','), // Convert array to string for PostHog
      has_income_reasons: hasIncomeReasons,
      most_important_category: mostImportantCategory,
    };

    console.log('[LawyerInquiryScreen] Form submitted:', {
      name,
      email,
      phone,
      message,
      ...analyticsProperties,
    });

    console.log('[LawyerInquiryScreen] About to track analytics event...');
    console.log('[LawyerInquiryScreen] Analytics object:', analytics);
    console.log('[LawyerInquiryScreen] Event properties:', analyticsProperties);

    // Track analytics with error handling
    try {
      analytics.track('inquiry_form_submitted', analyticsProperties);
      console.log('[LawyerInquiryScreen] Analytics tracking call completed');
    } catch (error) {
      console.error('[LawyerInquiryScreen] Analytics tracking failed:', error);
      // Continue with submission even if analytics fails
    }

    // 5. Generate lead brief with calculation data and CoA reasons
    const leadBrief = {
      // Contact info
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      message: message.trim(),
      
      // Calculation summary
      annualLiability: liability ? parseFloat(liability) : 0,
      triggerType: trigger || 'unknown',
      incomeA: incomeA ? parseFloat(incomeA) : 0,
      incomeB: incomeB ? parseFloat(incomeB) : 0,
      numChildren: children ? parseInt(children) : 0,
      
      // Complexity triggers data
      complexityTriggers: coaData ? {
        count: coaData.count,
        reasons: coaData.reasons,
        formattedText: coaData.formattedText,
        hasIncomeReasons: hasIncomeReasons,
        mostImportantCategory: mostImportantCategory,
      } : null,
      
      // Metadata
      submittedAt: new Date().toISOString(),
    };

    console.log('[LawyerInquiryScreen] Lead brief generated:', leadBrief);

    // 6. TODO: Send email to yourself (Phase 1)

    // 7. Show success message
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
            style={[styles.input, styles.textArea, isWeb && webInputStyles]}
            placeholder="What do you need help with?"
            placeholderTextColor="#64748b"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />

          {/* TODO: Add consent checkbox */}

          {/* DEBUG: Test analytics button - REMOVE BEFORE PRODUCTION */}
          <Pressable style={[styles.button, { backgroundColor: '#dc2626' }, isWeb && webClickableStyles]} onPress={testAnalytics}>
            <Text style={styles.buttonText}>🐛 TEST: Fire Analytics Event</Text>
          </Pressable>

          <Pressable style={[styles.button, isWeb && webClickableStyles, isWeb && styles.buttonWeb]} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit Inquiry</Text>
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
  buttonWeb: {
    paddingVertical: 14,
    // Slight hover effect handled by webClickableStyles cursor
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

