/**
 * View Lead Screen (Magic Link Access)
 * FOR SCREENSHOT ONLY - UPDATED HEARING DATE
 */

import { TrustBadges } from '@/src/components/ui/TrustBadges';
import { exportLeadAsPDF } from '@/src/utils/exportLeadPDF';
import { formatCurrency } from '@/src/utils/formatters';
import { isWeb, webClickableStyles } from '@/src/utils/responsive';
import { LeadSubmission } from '@/src/utils/supabase';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TEST_LEAD: LeadSubmission = {
  id: '8921-test-case',
  created_at: '2026-01-10T00:00:00.000Z',
  parent_name: 'Sarah Jenkins',
  parent_email: 'sarah.jenkins@example.com',
  parent_phone: '0491 570 001',
  location: 'South Yarra 3141',
  income_parent_a: 78599,
  income_parent_b: 52000,
  children_count: 2,
  annual_liability: 1365,
  care_data: [
    { index: 0, careA: 58, careB: 42 },
    { index: 1, careA: 58, careB: 42 },
  ],
  complexity_reasons: [
    'Court Hearing: 19 Feb 2026', // <--- UPDATED DATE HERE
    'Cash Business',
    'Hidden Assets',
  ],
  parent_message:
    "My ex is a self-employed electrician. He declares $52,000/yr to the ATO but works 6 days a week and takes cash for weekend jobs. He just bought a $90k Ford Ranger and is paying $850/wk rent. The assessment definitely doesn't reflect his real capacity to pay.",
  consent_given: true,
  status: 'new',
  complexity_trigger: ['cash_business'],
};

export default function ViewLeadScreen() {
  const [lead] = useState<LeadSubmission>(TEST_LEAD);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setIsExporting(true);
      await exportLeadAsPDF(lead);
    } catch (error) {
      // TODO: Replace with proper error reporting service
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.columnWrapper}>
          {/* Header */}
          <View style={styles.headerBox}>
            <View style={styles.headerTopRow}>
              <Text style={styles.headerTitle}>Client File</Text>
              <TrustBadges variant="secure" text="SECURE PARTNER PORTAL" />
            </View>
            <Text style={styles.headerSubtitle}>
              <Text style={styles.headerRefBold}>Ref: #8921</Text> • Submitted
              10 Jan 2026
            </Text>
          </View>

          {/* Client Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Client Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{lead.parent_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{lead.parent_email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{lead.parent_phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{lead.location}</Text>
            </View>
          </View>

          {/* Assessment Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assessment Summary</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Est. Liability (Client Payer)
              </Text>
              <Text style={styles.infoValueHighlight}>
                {formatCurrency(lead.annual_liability)}/yr
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Client Income</Text>
              <Text style={styles.infoValue}>
                {formatCurrency(lead.income_parent_a)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Other Parent Income</Text>
              <Text style={styles.infoValue}>
                {formatCurrency(lead.income_parent_b)}
              </Text>
            </View>
          </View>

          {/* Care Arrangements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Care Arrangements</Text>
            {lead.care_data?.map((child, index) => (
              <View key={index} style={styles.careRow}>
                <Text style={styles.careLabel}>Child {index + 1}</Text>
                <View style={styles.careValuesContainer}>
                  <Text style={styles.careValue}>
                    <Text style={{ color: '#64748b' }}>Client:</Text>{' '}
                    {child.careA}%
                  </Text>
                  <Text style={styles.careDivider}>|</Text>
                  <Text style={styles.careValue}>
                    <Text style={{ color: '#64748b' }}>Other Parent:</Text>{' '}
                    {child.careB}%
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Complexity Profile */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Complexity Profile</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {lead.complexity_reasons?.map((reason, i) => (
                <View
                  key={i}
                  style={[
                    styles.complexityItem,
                    i === 0 ? styles.complexityDark : styles.complexityLight,
                  ]}
                >
                  <Text
                    style={[
                      styles.complexityText,
                      i === 0
                        ? styles.complexityTextWhite
                        : styles.complexityTextBlue,
                    ]}
                  >
                    {reason}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Client Statement */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Client Statement</Text>
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>
                &ldquo;{lead.parent_message}&rdquo;
              </Text>
            </View>
          </View>

          <View style={styles.downloadSection}>
            <Pressable
              style={[
                styles.downloadButton,
                isExporting && styles.downloadButtonDisabled,
                isWeb && webClickableStyles,
              ]}
              onPress={handleDownloadPDF}
              disabled={isExporting}
            >
              <Text style={styles.downloadIcon}>📄</Text>
              <Text style={styles.downloadButtonText}>
                {isExporting
                  ? 'Exporting...'
                  : 'Download Full Legal Brief (PDF)'}
              </Text>
            </Pressable>
            <Text style={styles.downloadHint}>
              Includes full financial breakdown and case analysis.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  scrollView: { flex: 1 },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
  },
  columnWrapper: {
    width: '100%',
    maxWidth: 600,
  },
  headerBox: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderTopWidth: 4,
    borderTopColor: '#0f172a',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  headerSubtitle: { fontSize: 12, color: '#64748b' },
  headerRefBold: {
    fontWeight: '800',
    color: '#334155',
  },
  section: {
    backgroundColor: '#ffffff',
    marginBottom: 10,
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: { fontSize: 13, color: '#64748b' },
  infoValue: { fontSize: 13, fontWeight: '600', color: '#0f172a' },
  infoValueHighlight: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  careRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  careLabel: { fontSize: 13, color: '#64748b' },
  careValue: { fontSize: 13, fontWeight: '600' },
  messageBox: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#cbd5e1',
  },
  messageText: {
    fontSize: 13,
    color: '#334155',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  downloadSection: { marginTop: 8, marginBottom: 20, alignItems: 'center' },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a7ea4', // Primary brand color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  downloadButtonDisabled: {
    backgroundColor: '#94a3b8',
    opacity: 0.7,
  },
  downloadButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  downloadIcon: { fontSize: 16, marginRight: 8 },
  downloadHint: { marginTop: 8, fontSize: 11, color: '#64748b' },
  complexityItem: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4 },
  complexityText: { fontSize: 11, fontWeight: '600' },
  complexityDark: { backgroundColor: '#1e3a8a' },
  complexityLight: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  complexityTextWhite: { color: '#ffffff' },
  complexityTextBlue: { color: '#1d4ed8' },
  careValuesContainer: { flexDirection: 'row', alignItems: 'center' },
  careDivider: { marginHorizontal: 6, color: '#cbd5e1' },
});
