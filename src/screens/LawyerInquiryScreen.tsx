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
    console.log('[LawyerInquiryScreen] Mounted with params:', { trigger, liability });
  }, []);

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
      Alert.alert('Missing Information', 'Please enter your name.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Missing Information', 'Please enter your email address.');
      return;
    }
    if (!message.trim()) {
      Alert.alert('Missing Information', 'Please tell us what you need help with.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // 2. Calculate time_to_submit (seconds from mount to submission)
    const timeToSubmit = Math.round((Date.now() - mountTimeRef.current) / 1000);

    // 3. Track analytics event AFTER validation but BEFORE async operations
    const analyticsProperties = {
      trigger_type: trigger || 'unknown',
      annual_liability: liability ? parseFloat(liability) : 0,
      has_phone: phone.trim().length > 0,
      message_length: message.trim().length,
      time_to_submit: timeToSubmit,
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

    analytics.track('inquiry_form_submitted', analyticsProperties);

    console.log('[LawyerInquiryScreen] Analytics tracking call completed');

    // 4. TODO: Generate lead brief with calculation data
    // 5. TODO: Send email to yourself (Phase 1)

    // 6. Show success message
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
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Request Legal Help</Text>

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
            style={styles.input}
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Phone (optional)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="What do you need help with?"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />

          {/* TODO: Add consent checkbox */}

          {/* DEBUG: Test analytics button - REMOVE BEFORE PRODUCTION */}
          <Pressable style={[styles.button, { backgroundColor: '#dc2626' }]} onPress={testAnalytics}>
            <Text style={styles.buttonText}>🐛 TEST: Fire Analytics Event</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={handleSubmit}>
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
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

