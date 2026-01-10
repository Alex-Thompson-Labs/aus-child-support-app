/**
 * View Lead Screen (Magic Link Access)
 * Public page that displays lead details via secure token verification.
 * Light theme optimized for printing.
 */

import { exportLeadAsPDF } from '@/src/utils/exportLeadPDF';
import { isWeb, webClickableStyles } from '@/src/utils/responsive';
import { LeadSubmission } from '@/src/utils/supabase';
import Constants from 'expo-constants';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Reusing your types
type PublicLeadData = LeadSubmission;
type ViewState =
  | { status: 'loading' }
  | { status: 'valid'; lead: PublicLeadData }
  | { status: 'expired' }
  | { status: 'invalid'; message: string };

export default function ViewLeadScreen() {
  const params = useLocalSearchParams();
  const token = params.token as string;

  const [viewState, setViewState] = useState<ViewState>({ status: 'loading' });
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const verifyAndLoadLead = async () => {
      try {
        const supabaseUrl =
          Constants.expoConfig?.extra?.supabaseUrl ||
          process.env.EXPO_PUBLIC_SUPABASE_URL;

        const response = await fetch(
          `${supabaseUrl}/functions/v1/verify-lead-token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (data.code === 'TOKEN_EXPIRED') {
            setViewState({ status: 'expired' });
          } else {
            setViewState({
              status: 'invalid',
              message: data.error || 'Invalid link',
            });
          }
          return;
        }

        if (data.success && data.lead) {
          setViewState({ status: 'valid', lead: data.lead });
        } else {
          setViewState({ status: 'invalid', message: 'Failed to load lead' });
        }
      } catch (error) {
        console.error('[ViewLead] Error verifying token:', error);
        setViewState({
          status: 'invalid',
          message: 'Unable to connect to server',
        });
      }
    };

    if (token) {
      verifyAndLoadLead();
    } else {
      setViewState({ status: 'invalid', message: 'No token provided' });
    }
  }, [token]);

  // Handle PDF Download
  const handleDownloadPDF = async (lead: PublicLeadData) => {
    try {
      setIsExporting(true);
      await exportLeadAsPDF(lead);
      if (Platform.OS === 'web') {
        alert('Downloading Brief...\n\nThe PDF is being generated.');
      }
    } catch (error) {
      console.error(error);
      alert('Error generating PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCall = (phone: string) => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const telUrl = `tel:${cleanPhone}`;
    if (Platform.OS === 'web') {
      window.open(telUrl, '_self');
    } else {
      Linking.openURL(telUrl);
    }
  };

  const handleEmail = (lead: PublicLeadData) => {
    const subject = encodeURIComponent('Regarding your child support inquiry');
    const body = encodeURIComponent(
      `Dear ${lead.parent_name},\n\n` +
        `Thank you for your inquiry through the Child Support Calculator.\n\n` +
        `I would like to discuss your case further.\n\n` +
        `Best regards,`
    );
    const mailtoUrl = `mailto:${lead.parent_email}?subject=${subject}&body=${body}`;
    if (Platform.OS === 'web') {
      window.open(mailtoUrl, '_self');
    } else {
      Linking.openURL(mailtoUrl);
    }
  };

  // Loading / Error States
  if (viewState.status === 'loading') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Verifying secure access...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (viewState.status !== 'valid') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <Text style={styles.errorTitle}>Access Denied</Text>
          <Text style={styles.errorMessage}>
            {viewState.status === 'expired'
              ? 'This secure link has expired.'
              : 'Invalid link.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const { lead } = viewState;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Secure Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>Client File</Text>
          <View style={styles.secureBadge}>
            <Text style={styles.secureBadgeIcon}>🔒</Text>
            <Text style={styles.secureBadgeText}>End-to-End Encrypted</Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>
          Ref: #{lead.id?.slice(0, 8) || 'N/A'} • Submitted{' '}
          {lead.created_at
            ? new Date(lead.created_at).toLocaleDateString('en-AU')
            : 'N/A'}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ACTION: Download PDF (Prominent) */}
        <View style={styles.downloadSection}>
          <Pressable
            style={[
              styles.downloadButton,
              isWeb && webClickableStyles,
              isExporting && { opacity: 0.7 },
            ]}
            onPress={() => handleDownloadPDF(lead)}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator color="white" style={{ marginRight: 8 }} />
            ) : (
              <Text style={styles.downloadIcon}>📄</Text>
            )}
            <Text style={styles.downloadButtonText}>
              {isExporting
                ? 'Generating...'
                : 'Download Full Legal Brief (PDF)'}
            </Text>
          </Pressable>
          <Text style={styles.downloadHint}>
            Includes full financial breakdown, complexity analysis, and care
            calculations.
          </Text>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{lead.parent_name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={[styles.infoValue, styles.infoValueEmail]}>
              {lead.parent_email}
            </Text>
          </View>
          {lead.parent_phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{lead.parent_phone}</Text>
            </View>
          )}
        </View>

        {/* Case Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assessment Summary</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Est. Liability</Text>
            <Text style={styles.infoValueHighlight}>
              ${lead.annual_liability.toLocaleString('en-AU')}/year
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Parent A Income</Text>
            <Text style={styles.infoValue}>
              ${lead.income_parent_a.toLocaleString('en-AU')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Parent B Income</Text>
            <Text style={styles.infoValue}>
              ${lead.income_parent_b.toLocaleString('en-AU')}
            </Text>
          </View>
        </View>

        {/* Complexity Factors */}
        {lead.complexity_reasons && lead.complexity_reasons.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Complexity Flags</Text>
            {lead.complexity_reasons.map((reason, index) => (
              <View key={index} style={styles.complexityItem}>
                <Text style={styles.complexityBullet}>•</Text>
                <Text style={styles.complexityText}>{reason}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Footer Actions */}
      <View
        style={styles.actionButtonsContainer}
        // @ts-ignore
        className="action-buttons-container"
      >
        {lead.parent_phone && (
          <Pressable
            style={[
              styles.actionButton,
              styles.callButton,
              isWeb && webClickableStyles,
            ]}
            onPress={() => handleCall(lead.parent_phone!)}
          >
            <Text style={styles.actionButtonText}>Call Client</Text>
          </Pressable>
        )}
        <Pressable
          style={[
            styles.actionButton,
            styles.emailButton,
            isWeb && webClickableStyles,
          ]}
          onPress={() => handleEmail(lead)}
        >
          <Text style={styles.actionButtonText}>Email Client</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // Light grey background for professional feel
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: { marginTop: 16, color: '#64748b' },
  errorTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  errorMessage: { color: '#64748b' },

  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    ...Platform.select({
      web: {
        maxWidth: 800,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      default: {},
    }),
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5', // Light green
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#059669',
  },
  secureBadgeIcon: { fontSize: 12, marginRight: 6 },
  secureBadgeText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },

  scrollView: { flex: 1 },
  scrollContent: {
    padding: 24,
    ...Platform.select({
      web: {
        maxWidth: 800,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      default: {},
    }),
  },

  /* Download Section */
  downloadSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a', // Dark "Legal" Blue/Black
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  downloadIcon: { fontSize: 20, marginRight: 10 },
  downloadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  downloadHint: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },

  section: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  infoLabel: { fontSize: 15, color: '#64748b' },
  infoValue: { fontSize: 15, fontWeight: '500', color: '#0f172a' },
  infoValueEmail: { color: '#2563eb' },
  infoValueHighlight: { fontSize: 18, fontWeight: '700', color: '#0f172a' },

  complexityItem: {
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: '#fff7ed', // Light Orange
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fdba74',
  },
  complexityBullet: {
    fontSize: 16,
    color: '#ea580c',
    marginRight: 10,
    fontWeight: 'bold',
  },
  complexityText: {
    fontSize: 14,
    color: '#9a3412',
    fontWeight: '500',
    flex: 1,
  },

  /* Footer */
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
    padding: 24,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    ...Platform.select({
      web: {
        maxWidth: 800,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      default: {},
    }),
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  callButton: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
  },
  emailButton: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
  },
  actionButtonText: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '600',
  },
});
