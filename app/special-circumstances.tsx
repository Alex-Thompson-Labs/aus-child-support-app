import { PageSEO } from '@/src/components/seo/PageSEO';
import Accordion from '@/src/components/ui/Accordion';
import { HelpTooltip } from '@/src/features/calculator';
import { useAnalytics } from '@/src/utils/analytics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Linking,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    MAX_FORM_WIDTH,
    isWeb,
    webClickableStyles,
} from '../src/utils/responsive';
import { createShadow } from '../src/utils/shadow-styles';
import {
    SPECIAL_CIRCUMSTANCES,
    getHighestPriorityReason,
    isCourtDateReason,
    isValidSpecialCircumstanceId,
    type SpecialCircumstance,
} from '../src/utils/special-circumstances';

// ============================================================================
// Special Circumstances Standalone Screen
// ============================================================================
/**
 * Standalone screen for direct-entry Special Circumstances selection.
 *
 * Purpose:
 * - Allows users from blog links to skip the calculator and go directly
 *   to the lawyer inquiry form with their special circumstances.
 *
 * Flow:
 * 1. User lands on /special-circumstances (from blog link)
 * 2. User selects applicable special circumstances
 * 3. User clicks "Continue" button
 * 4. Navigates to /lawyer-inquiry with URL params:
 *    - mode=direct (triggers manual income inputs)
 *    - reason=special_circumstances
 *    - specialCircumstances=<JSON array of selected IDs>
 *    - priorityCircumstance=<highest priority reason ID>
 */

export default function SpecialCircumstancesScreen() {
  const router = useRouter();
  const analytics = useAnalytics();
  const { preselect, returnTo: rawReturnTo } = useLocalSearchParams<{
    preselect?: string;
    returnTo?: string;
  }>();

  const returnTo = useMemo(() => {
    if (!rawReturnTo) return undefined;
    try {
      return decodeURIComponent(rawReturnTo);
    } catch {
      return rawReturnTo;
    }
  }, [rawReturnTo]);

  // State management
  const [selectedReasons, setSelectedReasons] = useState<Set<string>>(
    new Set()
  );
  const [isNavigating, setIsNavigating] = useState(false);
  const [hasPropertySettlement, setHasPropertySettlement] = useState(false);

  // PAGE SCHEMA: FAQ for Special Circumstances
  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are special circumstances in child support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Special circumstances are situations that are too complex for the standard child support calculator. These include issues with income reporting, property settlements, high child care costs, or upcoming court hearings that may affect your assessment.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I select multiple special circumstances?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, you can select multiple circumstances that apply to your situation. The system will identify the highest priority circumstance to help match you with appropriate legal assistance.',
        },
      },
      {
        '@type': 'Question',
        name: 'What happens after I select my circumstances?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'After selecting your circumstances, you will be directed to speak with a family lawyer who can help you request adjustments to your child support assessment through Services Australia.',
        },
      },
    ],
  };

  // Handle preselect URL parameter (from CoA reason pages)
  useEffect(() => {
    if (preselect && isValidSpecialCircumstanceId(preselect)) {
      setSelectedReasons(new Set([preselect]));
      // Also set property settlement state if that's what's preselected
      if (preselect === 'property_settlement') {
        setHasPropertySettlement(true);
      }
    }
  }, [preselect]);

  // Group reasons by category
  const incomeReasons = SPECIAL_CIRCUMSTANCES.filter(
    (r) => r.category === 'income' && r.id !== 'hiding_income'
  );
  const childReasons = SPECIAL_CIRCUMSTANCES.filter(
    (r) => r.category === 'child'
  );
  const otherReasons = SPECIAL_CIRCUMSTANCES.filter(
    (r) => r.category === 'other' && r.id !== 'property_settlement'
  );

  // Determine button state
  const buttonDisabled = selectedReasons.size === 0 || isNavigating;

  // Checkbox toggle handler
  const handleCheckboxToggle = useCallback(
    (reasonId: string) => {
      setSelectedReasons((prev) => {
        const next = new Set(prev);
        const wasChecked = next.has(reasonId);

        if (wasChecked) {
          next.delete(reasonId);
        } else {
          next.add(reasonId);
        }

        // Track analytics
        setTimeout(() => {
          try {
            analytics.track('special_circumstances_reason_toggled', {
              reason_id: reasonId,
              is_checked: !wasChecked,
              total_selected: next.size,
              source: 'standalone_screen',
            });
          } catch (error) {
            console.error('[SpecialCircumstances] Analytics error:', error);
          }
        }, 100);

        return next;
      });
    },
    [analytics]
  );

  // Navigation handler - redirects to lawyer inquiry with Direct Mode params
  const handleContinue = useCallback(() => {
    if (isNavigating || selectedReasons.size === 0) {
      return;
    }

    setIsNavigating(true);

    // Track analytics
    try {
      analytics.track('special_circumstances_continue_clicked', {
        reasons_selected: JSON.stringify(Array.from(selectedReasons)),
        reason_count: selectedReasons.size,
        most_important_category:
          getHighestPriorityReason(Array.from(selectedReasons))?.category ??
          null,
        source: 'standalone_screen',
      });
    } catch (error) {
      console.error('[SpecialCircumstances] Analytics error:', error);
    }

    // Navigate to lawyer inquiry in Direct Mode
    try {
      router.push({
        pathname: '/lawyer-inquiry',
        params: {
          // Direct Mode triggers
          mode: 'direct',
          reason: 'special_circumstances',

          // Pass returnTo
          ...(returnTo ? { returnTo } : {}),

          // Special Circumstances data
          specialCircumstances: JSON.stringify(Array.from(selectedReasons)),
          priorityCircumstance:
            getHighestPriorityReason(Array.from(selectedReasons))?.id ?? '',
        },
      });
    } catch (error) {
      console.error('[SpecialCircumstances] Navigation failed:', error);
      setIsNavigating(false);
    }
  }, [isNavigating, selectedReasons, router, analytics]);

  // Render checkbox for a reason
  const renderCheckbox = (reason: SpecialCircumstance) => {
    const isChecked = selectedReasons.has(reason.id);

    return (
      <Pressable
        key={reason.id}
        style={[styles.checkboxRow, isWeb && webClickableStyles]}
        onPress={() => handleCheckboxToggle(reason.id)}
        accessible={true}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isChecked }}
        accessibilityLabel={reason.label}
        accessibilityHint={`Double tap to ${isChecked ? 'uncheck' : 'check'}`}
      >
        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
          {isChecked && <Text style={styles.checkboxCheck}>✓</Text>}
        </View>
        <View style={styles.checkboxLabelContainer}>
          <Text style={styles.checkboxLabel}>{reason.label}</Text>
          <HelpTooltip what={reason.description} why="" hideWhatLabel />
        </View>
      </Pressable>
    );
  };

  // Web-specific container styles
  const webContainerStyle = isWeb
    ? {
      maxWidth: MAX_FORM_WIDTH,
      width: '100%' as const,
      alignSelf: 'center' as const,
    }
    : {};

  return (
    <>
      <PageSEO
        title="Special Circumstances - Child Support Calculator Australia"
        description="Identify special circumstances that may affect your child support assessment. Select applicable circumstances and connect with a family lawyer for assistance."
        canonicalPath="/special-circumstances"
        schema={faqSchema}
      />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Special Circumstances</Text>
          <Pressable
            style={styles.closeButton}
            onPress={() => {
              if (returnTo) {
                if (returnTo.startsWith('http')) {
                  if (Platform.OS === 'web') {
                    window.location.href = returnTo;
                  } else {
                    Linking.openURL(returnTo);
                  }
                } else {
                  // @ts-ignore
                  router.push(returnTo);
                }
                return;
              }

              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, webContainerStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Introduction Card */}
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>Do special circumstances exist?</Text>
            <Text style={styles.introDescription}>
              Some situations are too complex for the standard calculator. If any
              of these apply, a lawyer can help you request adjustments to your
              child support assessment.
            </Text>
          </View>

          {/* Category Sections */}
          <View style={styles.categorySections}>
            {/* Legal Section */}
            <View style={styles.reasonGroup}>
              <View style={styles.groupHeader}>
                <Text style={[styles.groupTitle, { color: '#1e3a8a' }]}>
                  Legal
                </Text>
              </View>
              <View style={styles.checkboxList}>
                {/* Court Date Checkbox */}
                <Pressable
                  style={[styles.checkboxRow, isWeb && webClickableStyles]}
                  onPress={() => {
                    const hasCourtDate = Array.from(selectedReasons).some((id) =>
                      isCourtDateReason(id)
                    );

                    if (hasCourtDate) {
                      setSelectedReasons((prev) => {
                        const next = new Set(prev);
                        Array.from(next).forEach((id) => {
                          if (isCourtDateReason(id)) {
                            next.delete(id);
                          }
                        });
                        return next;
                      });
                    } else {
                      setSelectedReasons((prev) => {
                        const next = new Set(prev);
                        next.add('court_date_pending');
                        return next;
                      });
                    }
                  }}
                  accessible={true}
                  accessibilityRole="checkbox"
                  accessibilityState={{
                    checked: Array.from(selectedReasons).some((id) =>
                      isCourtDateReason(id)
                    ),
                  }}
                  accessibilityLabel="I have an upcoming court hearing regarding child support."
                >
                  <View
                    style={[
                      styles.checkbox,
                      Array.from(selectedReasons).some((id) =>
                        isCourtDateReason(id)
                      ) && styles.checkboxChecked,
                    ]}
                  >
                    {Array.from(selectedReasons).some((id) =>
                      isCourtDateReason(id)
                    ) && <Text style={styles.checkboxCheck}>✓</Text>}
                  </View>
                  <View style={styles.checkboxLabelContainer}>
                    <Text style={styles.checkboxLabel}>
                      I have an upcoming court hearing regarding child support.
                    </Text>
                    <HelpTooltip
                      what="Upcoming court dates are critical events. Professional legal preparation is strongly recommended."
                      why=""
                      hideWhatLabel
                    />
                  </View>
                </Pressable>

                {/* Property Settlement Checkbox */}
                <Pressable
                  style={[styles.checkboxRow, isWeb && webClickableStyles]}
                  onPress={() => {
                    setHasPropertySettlement(!hasPropertySettlement);
                    handleCheckboxToggle('property_settlement');
                  }}
                  accessible={true}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: hasPropertySettlement }}
                >
                  <View
                    style={[
                      styles.checkbox,
                      hasPropertySettlement && styles.checkboxChecked,
                    ]}
                  >
                    {hasPropertySettlement && (
                      <Text style={styles.checkboxCheck}>✓</Text>
                    )}
                  </View>
                  <View style={styles.checkboxLabelContainer}>
                    <Text style={styles.checkboxLabel}>
                      I have a property settlement pending.
                    </Text>
                    <HelpTooltip
                      what="Pending property settlements can significantly affect child support obligations."
                      why=""
                      hideWhatLabel
                    />
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Section Divider */}
            <View style={styles.sectionDivider} />

            {/* Income Issues Group */}
            <View style={styles.reasonGroup}>
              <View style={styles.groupHeader}>
                <Text style={[styles.groupTitle, { color: '#1e3a8a' }]}>
                  The Other Parent&apos;s Financials
                </Text>
              </View>
              <View style={styles.checkboxList}>
                {incomeReasons.map(renderCheckbox)}
              </View>
            </View>

            {/* Costs & Other Factors Group */}
            {(childReasons.length > 0 || otherReasons.length > 0) && (
              <>
                <View style={styles.sectionDivider} />

                <View style={styles.reasonGroup}>
                  <View style={styles.groupHeader}>
                    <Text style={[styles.groupTitle, { color: '#1e3a8a' }]}>
                      Costs & Other Factors
                    </Text>
                  </View>
                  <View style={styles.checkboxList}>
                    {childReasons.map(renderCheckbox)}
                    {otherReasons.map(renderCheckbox)}
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Continue Button */}
          <View style={styles.footer}>
            <Pressable
              style={[
                styles.continueButton,
                buttonDisabled && styles.continueButtonDisabled,
                isWeb && !buttonDisabled && webClickableStyles,
              ]}
              onPress={handleContinue}
              disabled={buttonDisabled}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Continue to speak with a lawyer"
              accessibilityState={{ disabled: buttonDisabled }}
            >
              {isNavigating ? (
                <Text style={styles.continueButtonText}>Loading...</Text>
              ) : (
                <Text style={styles.continueButtonText}>
                  Continue to Speak with a Lawyer
                </Text>
              )}
            </Pressable>
            {selectedReasons.size > 0 && (
              <Text style={styles.selectedCount}>
                {selectedReasons.size} reason
                {selectedReasons.size === 1 ? '' : 's'} selected
              </Text>
            )}
          </View>

          {/* FAQ Section */}
          <View style={styles.faqSection}>
            <Text style={styles.faqSectionTitle}>Frequently Asked Questions</Text>

            <Accordion title="What are special circumstances in child support?">
              <Text style={styles.faqText}>
                Special circumstances are situations that are too complex for the standard
                child support calculator. These include issues with income reporting,
                property settlements, high child care costs, or upcoming court hearings
                that may affect your assessment.
              </Text>
            </Accordion>

            <Accordion title="Can I select multiple special circumstances?">
              <Text style={styles.faqText}>
                Yes, you can select multiple circumstances that apply to your situation.
                The system will identify the highest priority circumstance to help match
                you with appropriate legal assistance.
              </Text>
            </Accordion>

            <Accordion title="What happens after I select my circumstances?">
              <Text style={styles.faqText}>
                After selecting your circumstances, you will be directed to speak with
                a family lawyer who can help you request adjustments to your child support
                assessment through Services Australia.
              </Text>
            </Accordion>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // Introduction Card
  introCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bfdbfe',
    padding: 20,
    marginBottom: 24,
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    }),
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  introDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
  },

  // FAQ Section
  faqSection: {
    marginTop: 32,
    marginBottom: 24,
  },
  faqSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  faqText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },

  // Category sections
  categorySections: {
    gap: 16,
  },

  // Groups
  reasonGroup: {
    marginBottom: 0,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Checkbox list
  checkboxList: {
    gap: 8,
  },

  // Section Divider
  sectionDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 6,
  },

  // Checkboxes
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkboxCheck: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxLabelContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#64748b', // Slate 500 - matches step explanation text
    lineHeight: 20,
    flex: 1,
  },

  // Footer with button
  footer: {
    marginTop: 32,
    gap: 12,
  },
  continueButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    ...createShadow({
      shadowColor: '#2563EB',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  continueButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedCount: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
