/**
 * View Lead Screen (Magic Link Access)
 * Public page that displays lead details via secure token verification.
 * Light theme optimized for printing.
 */

import {
  isWeb,
  webClickableStyles,
} from '@/src/utils/responsive';
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
import Constants from 'expo-constants';

interface PublicLeadData {
  id: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string | null;
  location: string | null;
  income_parent_a: number;
  income_parent_b: number;
  children_count: number;
  annual_liability: number;
  care_data: { index: number; careA: number; careB: number }[] | null;
  complexity_reasons: string[];
  parent_message: string;
  created_at: string;
}

type ViewState =
  | { status: 'loading' }
  | { status: 'valid'; lead: PublicLeadData }
  | { status: 'expired' }
  | { status: 'invalid'; message: string };

export default function ViewLeadScreen() {
  const params = useLocalSearchParams();
  const token = params.token as string;

  const [viewState, setViewState] = useState<ViewState>({ status: 'loading' });

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

  // Inject print styles on web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.id = 'view-lead-print-styles';
      style.textContent = `
        @media print {
          .action-buttons-container { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `;
      document.head.appendChild(style);
      return () => {
        const existing = document.getElementById('view-lead-print-styles');
        if (existing) {
          document.head.removeChild(existing);
        }
      };
    }
  }, []);

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

  // Loading state
  if (viewState.status === 'loading') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Verifying access...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Expired token state
  if (viewState.status === 'expired') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>&#x23F0;</Text>
          </View>
          <Text style={styles.errorTitle}>Access Expired</Text>
          <Text style={styles.errorMessage}>
            This link has expired. Magic links are valid for 7 days after
            creation.
          </Text>
          <Text style={styles.errorHint}>
            Please contact the sender to request a new link.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Invalid token state
  if (viewState.status === 'invalid') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>&#x1F512;</Text>
          </View>
          <Text style={styles.errorTitle}>Invalid Link</Text>
          <Text style={styles.errorMessage}>
            This link is not valid. It may have been modified or corrupted.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Valid state - show lead details
  const { lead } = viewState;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lead Details</Text>
        <Text style={styles.headerSubtitle}>
          Submitted {new Date(lead.created_at).toLocaleDateString('en-AU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
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
          {lead.location && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{lead.location}</Text>
            </View>
          )}
        </View>

        {/* Case Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Case Summary</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estimated Annual Liability</Text>
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
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Number of Children</Text>
            <Text style={styles.infoValue}>{lead.children_count}</Text>
          </View>
        </View>

        {/* Care Arrangements */}
        {lead.care_data && lead.care_data.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Care Arrangements</Text>
            {lead.care_data.map((child, index) => (
              <View key={index} style={styles.careRow}>
                <Text style={styles.careLabel}>
                  Child {child.index + 1}
                </Text>
                <Text style={styles.careValue}>
                  Parent A: {child.careA.toFixed(0)}% | Parent B:{' '}
                  {child.careB.toFixed(0)}%
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Complexity Factors */}
        {lead.complexity_reasons && lead.complexity_reasons.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Complexity Factors</Text>
            {lead.complexity_reasons.map((reason, index) => (
              <View key={index} style={styles.complexityItem}>
                <Text style={styles.complexityBullet}>&#x2022;</Text>
                <Text style={styles.complexityText}>{reason}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Parent's Message */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client&apos;s Message</Text>
          <Text style={styles.messageText}>{lead.parent_message}</Text>
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Lead ID: {lead.id.slice(0, 8)}
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons - Fixed at bottom */}
      <View
        style={styles.actionButtonsContainer}
        // @ts-ignore - web className for print hiding
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
    backgroundColor: '#ffffff',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 36,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
    marginBottom: 16,
  },
  errorHint: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#f8fafc',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    ...Platform.select({
      web: {
        maxWidth: 680,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      default: {},
    }),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    ...Platform.select({
      web: {
        maxWidth: 680,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      default: {},
    }),
  },
  section: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    flex: 1,
    textAlign: 'right',
  },
  infoValueEmail: {
    fontSize: 13,
  },
  infoValueHighlight: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
    flex: 1,
    textAlign: 'right',
  },
  careRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  careLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  careValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
  complexityItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 4,
  },
  complexityBullet: {
    fontSize: 16,
    color: '#f59e0b',
    marginRight: 10,
    fontWeight: '700',
  },
  complexityText: {
    fontSize: 14,
    color: '#0f172a',
    flex: 1,
    lineHeight: 20,
  },
  messageText: {
    fontSize: 14,
    color: '#0f172a',
    lineHeight: 22,
  },
  footer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    ...Platform.select({
      web: {
        maxWidth: 680,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      default: {},
    }),
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButton: {
    backgroundColor: '#16a34a',
  },
  emailButton: {
    backgroundColor: '#2563eb',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
