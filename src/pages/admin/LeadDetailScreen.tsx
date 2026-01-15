/**
 * Admin Lead Detail Screen
 * View full lead details, generate teaser emails, manage status
 * Mobile-optimized for phone use
 */

import { Colors } from '@/constants/theme';
import { Env } from '@/src/config/env';
import { exportLeadAsPDF } from '@/src/utils/exportLeadPDF';
import { formatCurrency } from '@/src/utils/formatters';
import {
  isWeb,
  MAX_CONTENT_WIDTH,
  webClickableStyles,
  webInputStyles,
} from '@/src/utils/responsive';
import { getSupabaseClient, type LeadSubmission } from '@/src/utils/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Use brand colors from theme
const PRIMARY_COLOR = Colors.light.tint;

type LeadStatus = 'new' | 'reviewing' | 'sent' | 'converted' | 'lost';

export default function LeadDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  // const { isMobile } = useResponsive();

  const leadId = params.id as string;

  const [lead, setLead] = useState<LeadSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('system');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  useEffect(() => {
    const checkAuthAndLoadLead = async () => {
      // Lazy-load Supabase for auth check
      const supabase = await getSupabaseClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (
        !session ||
        session.user.email?.toLowerCase() !== Env.ADMIN_EMAIL.toLowerCase()
      ) {
        router.replace('/admin/login');
        return;
      }

      setUserEmail(session.user.email);

      await loadLead();
    };

    const loadLead = async () => {
      try {
        setLoading(true);

        // Lazy-load Supabase for data fetching
        const supabase = await getSupabaseClient();

        // Use leads_decrypted view for automatic PII decryption
        const { data, error } = await supabase
          .from('leads_decrypted')
          .select('*')
          .eq('id', leadId)
          .single();

        if (error) {
          console.error('[LeadDetail] Error loading lead:', error);
          if (Platform.OS === 'web') {
            alert(`Error Loading Lead\n\n${error.message}`);
          } else {
            Alert.alert('Error Loading Lead', error.message);
          }
          router.back();
          return;
        }

        console.log('[LeadDetail] Loaded lead:', data.id);
        setLead(data);
        setNotes(data.notes || '');
      } catch (error) {
        console.error('[LeadDetail] Unexpected error:', error);
        router.back();
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadLead();
  }, [leadId, router]);

  const generateTeaserEmail = () => {
    if (!lead) return;

    // Determine the primary issue/trigger
    const primaryReason =
      lead.complexity_reasons?.[0] || lead.complexity_trigger || 'Complex case';

    // Calculate combined parental income
    const combinedIncome = lead.income_parent_a + lead.income_parent_b;

    // Determine who pays (higher income parent pays)
    const payingParent =
      lead.income_parent_a > lead.income_parent_b ? 'A' : 'B';

    // Format care percentages for children
    let careInfo = 'Not specified';
    if (lead.care_data && lead.care_data.length > 0) {
      const careStrings = lead.care_data.map(
        (child, idx) =>
          `Child ${idx + 1}: A=${child.careA.toFixed(
            0
          )}%, B=${child.careB.toFixed(0)}%`
      );
      careInfo = careStrings.join(' | ');
    } else if (lead.children_count > 0) {
      // If no detailed care data, show count only
      careInfo = `${lead.children_count} child${lead.children_count > 1 ? 'ren' : ''
        } (care % not specified)`;
    }

    // Add additional complexity triggers if present
    const additionalTriggers =
      lead.complexity_reasons && lead.complexity_reasons.length > 1
        ? `\nAdditional Issues: ${lead.complexity_reasons.slice(1).join(', ')}`
        : '';

    const teaserEmail = `Subject: New Qualified Lead - ${primaryReason}

Details:
Issue: ${primaryReason}
Children: ${careInfo}
Combined Income: ${formatCurrency(combinedIncome)}/year
Est. Child Support: ${formatCurrency(lead.annual_liability)}/year (Parent ${payingParent} pays)
Location: ${lead.location || 'Not specified'}${additionalTriggers}

Interested? Reply YES to purchase this lead for $50.
Lead ID: #${lead.id?.slice(0, 8)}

---
Australian Child Support Calculator
auschildsupport.com`;

    if (Platform.OS === 'web') {
      // Web: Use Clipboard API
      navigator.clipboard
        .writeText(teaserEmail)
        .then(() => {
          alert(
            'Teaser Email Copied!\n\nThe email template has been copied to your clipboard. Paste it into Gmail and send to the lawyer.'
          );
        })
        .catch((err) => {
          console.error('Failed to copy:', err);
          alert('Copy Failed\n\nPlease copy the text manually.');
        });
    } else {
      // Mobile: Use React Native Clipboard
      Clipboard.setString(teaserEmail);
      Alert.alert(
        'Teaser Email Copied!',
        'The email template has been copied to your clipboard. Paste it into Gmail and send to the lawyer.'
      );
    }
  };

  const updateStatus = async (newStatus: LeadStatus) => {
    if (!lead) return;

    try {
      setUpdatingStatus(true);

      const updates: Partial<LeadSubmission> = {
        status: newStatus,
      };

      // Set sent_at when marking as sent
      if (newStatus === 'sent' && !lead.sent_at) {
        updates.sent_at = new Date().toISOString();
      }

      const supabase = await getSupabaseClient();
      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', leadId);

      if (error) {
        console.error('[LeadDetail] Error updating status:', error);
        if (Platform.OS === 'web') {
          alert(`Error\n\n${error.message}`);
        } else {
          Alert.alert('Error', error.message);
        }
        return;
      }

      // Update local state
      setLead({ ...lead, ...updates });

      if (Platform.OS === 'web') {
        alert(`Status Updated\n\nLead status changed to "${newStatus}"`);
      } else {
        Alert.alert('Status Updated', `Lead status changed to "${newStatus}"`);
      }
    } catch (error) {
      console.error('[LeadDetail] Unexpected error:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const saveNotes = async () => {
    if (!lead) return;

    try {
      setSavingNotes(true);

      const supabase = await getSupabaseClient();
      const { error } = await supabase
        .from('leads')
        .update({ notes: notes.trim() || null })
        .eq('id', leadId);

      if (error) {
        console.error('[LeadDetail] Error saving notes:', error);
        if (Platform.OS === 'web') {
          alert(`Error\n\n${error.message}`);
        } else {
          Alert.alert('Error', error.message);
        }
        return;
      }

      setLead({ ...lead, notes: notes.trim() || null });

      if (Platform.OS === 'web') {
        alert('Notes Saved!\n\nYour notes have been saved.');
      } else {
        Alert.alert('Notes Saved', 'Your notes have been saved.');
      }
    } catch (error) {
      console.error('[LeadDetail] Unexpected error:', error);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleExportPDF = async () => {
    if (!lead) return;

    try {
      setExportingPDF(true);
      await exportLeadAsPDF(lead, userEmail);

      // Show success message
      if (Platform.OS === 'web') {
        alert(
          'Print Dialog Opened!\n\nUse the print dialog to save as PDF or print the lead report.'
        );
      } else {
        Alert.alert(
          'PDF Exported',
          'The lead report has been generated successfully.'
        );
      }
    } catch (error) {
      console.error('[LeadDetail] Error exporting PDF:', error);
      if (Platform.OS === 'web') {
        alert(
          `Export Failed\n\n${error instanceof Error ? error.message : 'Unknown error occurred'
          }`
        );
      } else {
        Alert.alert(
          'Export Failed',
          error instanceof Error ? error.message : 'Unknown error occurred'
        );
      }
    } finally {
      setExportingPDF(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'email' | 'phone') => {
    try {
      if (Platform.OS === 'web' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        Clipboard.setString(text);
      }

      // Show visual feedback
      if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      }
    } catch (error) {
      console.error('[LeadDetail] Error copying to clipboard:', error);
      if (Platform.OS === 'web') {
        alert('Failed to copy to clipboard');
      } else {
        Alert.alert('Error', 'Failed to copy to clipboard');
      }
    }
  };

  const deleteLead = () => {
    if (!lead) return;

    const confirmDelete = () => {
      Alert.alert(
        'Delete Lead',
        'Are you sure you want to delete this lead? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                const supabase = await getSupabaseClient();
                const { error } = await supabase
                  .from('leads')
                  .update({ deleted_at: new Date().toISOString() })
                  .eq('id', leadId);

                if (error) {
                  console.error('[LeadDetail] Error deleting lead:', error);
                  Alert.alert('Error', error.message);
                  return;
                }

                Alert.alert('Lead Deleted', 'The lead has been deleted.', [
                  { text: 'OK', onPress: () => router.back() },
                ]);
              } catch (error) {
                console.error('[LeadDetail] Unexpected error:', error);
              }
            },
          },
        ]
      );
    };

    if (Platform.OS === 'web') {
      if (
        confirm(
          'Are you sure you want to delete this lead? This action cannot be undone.'
        )
      ) {
        getSupabaseClient()
          .then((supabase) =>
            supabase
              .from('leads')
              .update({ deleted_at: new Date().toISOString() })
              .eq('id', leadId)
          )
          .then(({ error }) => {
            if (error) {
              alert(`Error\n\n${error.message}`);
            } else {
              alert('Lead deleted successfully');
              router.back();
            }
          });
      }
    } else {
      confirmDelete();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading lead...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!lead) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Lead not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Web container style for constrained width on desktop
  const webContainerStyle = isWeb ? {
    maxWidth: MAX_CONTENT_WIDTH,
    width: '100%' as const,
    alignSelf: 'center' as const,
  } : {};

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={[styles.contentWrapper, webContainerStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={[styles.backButton, isWeb && webClickableStyles]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Lead #{lead.id?.slice(0, 8)}</Text>
          <View style={[styles.statusBadge, getStatusBadgeStyle(lead.status)]}>
            <Text style={styles.statusBadgeText}>{lead.status || 'new'}</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Parent Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Parent Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{lead.parent_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <View style={styles.infoValueWithButton}>
                <Text style={[styles.infoValue, styles.infoValueEmail]}>
                  {lead.parent_email}
                </Text>
                <Pressable
                  style={[styles.copyButton, isWeb && webClickableStyles]}
                  onPress={() => copyToClipboard(lead.parent_email, 'email')}
                >
                  <Text style={styles.copyIcon}>
                    {copiedEmail ? '✓' : '📋'}
                  </Text>
                </Pressable>
              </View>
            </View>
            {lead.parent_phone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <View style={styles.infoValueWithButton}>
                  <Text style={styles.infoValue}>{lead.parent_phone}</Text>
                  <Pressable
                    style={[styles.copyButton, isWeb && webClickableStyles]}
                    onPress={() => copyToClipboard(lead.parent_phone!, 'phone')}
                  >
                    <Text style={styles.copyIcon}>
                      {copiedPhone ? '✓' : '📋'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
            {lead.location && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Location:</Text>
                <Text style={styles.infoValue}>{lead.location}</Text>
              </View>
            )}
          </View>

          {/* Case Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Case Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Annual Liability:</Text>
              <Text style={styles.infoValueHighlight}>
                {formatCurrency(lead.annual_liability)}/year
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Parent A Income:</Text>
              <Text style={styles.infoValue}>
                {formatCurrency(lead.income_parent_a)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Parent B Income:</Text>
              <Text style={styles.infoValue}>
                {formatCurrency(lead.income_parent_b)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Children:</Text>
              <Text style={styles.infoValue}>{lead.children_count}</Text>
            </View>
          </View>

          {/* Complexity Triggers */}
          {lead.complexity_reasons && lead.complexity_reasons.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Complexity Triggers</Text>
              {lead.complexity_reasons.map((reason, index) => (
                <View key={index} style={styles.complexityItem}>
                  <Text style={styles.complexityBullet}>•</Text>
                  <Text style={styles.complexityText}>{reason}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Parent's Message */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Parent&apos;s Message</Text>
            <Text style={styles.messageText}>{lead.parent_message}</Text>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Admin Notes</Text>
            <TextInput
              style={[styles.notesInput, isWeb && webInputStyles]}
              placeholder="Add notes about this lead..."
              placeholderTextColor="#64748b"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
            <Pressable
              style={[
                styles.actionButton,
                styles.actionButtonSecondary,
                isWeb && webClickableStyles,
              ]}
              onPress={saveNotes}
              disabled={savingNotes}
            >
              {savingNotes ? (
                <ActivityIndicator color="#2563eb" size="small" />
              ) : (
                <Text style={styles.actionButtonTextSecondary}>Save Notes</Text>
              )}
            </Pressable>
          </View>

          {/* Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions</Text>

            <Pressable
              style={[
                styles.actionButton,
                styles.actionButtonPrimary,
                isWeb && webClickableStyles,
              ]}
              onPress={generateTeaserEmail}
            >
              <Text style={styles.actionButtonText}>
                📋 Generate Teaser Email
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.actionButton,
                styles.actionButtonPrimary,
                isWeb && webClickableStyles,
              ]}
              onPress={handleExportPDF}
              disabled={exportingPDF}
            >
              {exportingPDF ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.actionButtonText}>📄 Export Lead as PDF</Text>
              )}
            </Pressable>

            <View style={styles.statusActions}>
              <Pressable
                style={[
                  styles.statusButton,
                  lead.status === 'reviewing' && styles.statusButtonActive,
                  isWeb && webClickableStyles,
                ]}
                onPress={() => updateStatus('reviewing')}
                disabled={updatingStatus}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    lead.status === 'reviewing' && styles.statusButtonTextActive,
                  ]}
                >
                  Reviewing
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.statusButton,
                  lead.status === 'sent' && styles.statusButtonActive,
                  isWeb && webClickableStyles,
                ]}
                onPress={() => updateStatus('sent')}
                disabled={updatingStatus}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    lead.status === 'sent' && styles.statusButtonTextActive,
                  ]}
                >
                  Mark Sent
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.statusButton,
                  lead.status === 'converted' && styles.statusButtonActive,
                  isWeb && webClickableStyles,
                ]}
                onPress={() => updateStatus('converted')}
                disabled={updatingStatus}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    lead.status === 'converted' && styles.statusButtonTextActive,
                  ]}
                >
                  Converted
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.statusButton,
                  lead.status === 'lost' && styles.statusButtonActive,
                  isWeb && webClickableStyles,
                ]}
                onPress={() => updateStatus('lost')}
                disabled={updatingStatus}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    lead.status === 'lost' && styles.statusButtonTextActive,
                  ]}
                >
                  Lost
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Danger Zone */}
          <View style={[styles.section, styles.dangerSection]}>
            <Text style={[styles.sectionTitle, styles.dangerTitle]}>
              Danger Zone
            </Text>
            <Pressable
              style={[
                styles.actionButton,
                styles.actionButtonDanger,
                isWeb && webClickableStyles,
              ]}
              onPress={deleteLead}
            >
              <Text style={styles.actionButtonText}>🗑️ Delete Lead</Text>
            </Pressable>
          </View>

          {/* Metadata */}
          <View style={styles.metadata}>
            <Text style={styles.metadataText}>
              Created: {new Date(lead.created_at!).toLocaleString('en-AU')}
            </Text>
            {lead.sent_at && (
              <Text style={styles.metadataText}>
                Sent: {new Date(lead.sent_at).toLocaleString('en-AU')}
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Helper function
function getStatusBadgeStyle(status?: string) {
  switch (status) {
    case 'new':
      return { backgroundColor: '#3b82f6' }; // blue
    case 'reviewing':
      return { backgroundColor: '#f59e0b' }; // amber
    case 'sent':
      return { backgroundColor: '#8b5cf6' }; // purple
    case 'converted':
      return { backgroundColor: '#10b981' }; // green
    case 'lost':
      return { backgroundColor: '#64748b' }; // slate
    default:
      return { backgroundColor: '#3b82f6' }; // blue
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, // White background
  },
  contentWrapper: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0', // Light border
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: PRIMARY_COLOR, // Brand primary
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    color: '#64748b',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    flex: 1,
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    flex: 0,
    minWidth: 120,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  infoValueEmail: {
    fontSize: 13,
  },
  infoValueHighlight: {
    fontSize: 16,
    color: PRIMARY_COLOR,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  infoValueWithButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  copyButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  copyIcon: {
    fontSize: 16,
  },
  complexityItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  complexityBullet: {
    fontSize: 16,
    color: '#f59e0b',
    marginRight: 8,
    fontWeight: '700',
  },
  complexityText: {
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
  },
  coaReasonCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  coaReasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  coaReasonDescription: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 6,
  },
  coaReasonCategory: {
    fontSize: 11,
    color: '#64748b',
    fontStyle: 'italic',
  },
  messageText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  notesInput: {
    backgroundColor: '#f8fafc',
    color: Colors.light.text,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonPrimary: {
    backgroundColor: PRIMARY_COLOR,
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  actionButtonDanger: {
    backgroundColor: '#dc2626',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: PRIMARY_COLOR,
    fontSize: 15,
    fontWeight: '600',
  },
  statusActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  statusButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusButtonActive: {
    backgroundColor: '#e2e8f0',
    borderColor: '#cbd5e1',
  },
  statusButtonText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  statusButtonTextActive: {
    color: Colors.light.text,
  },
  dangerSection: {
    borderColor: '#dc2626',
  },
  dangerTitle: {
    color: '#dc2626',
  },
  metadata: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  metadataText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
});
