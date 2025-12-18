// Lawyer Inquiry Form Screen
// TODO: Implement this in Day 3-4 of Phase 1
//
// Form for parents to request legal help
// Sends lead brief to lawyers (email for now, API later)

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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

export function LawyerInquiryScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

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

  const handleSubmit = () => {
    // TODO: Implement form submission
    // 1. Validate fields
    // 2. Generate lead brief with calculation data
    // 3. Send email to yourself (Phase 1)
    // 4. Track analytics: inquiry_form_submitted
    // 5. Show success message
    console.log('Form submitted:', { name, email, phone, message, liability, trigger });
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

