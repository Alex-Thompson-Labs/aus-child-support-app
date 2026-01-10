import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAnalytics } from '../utils/analytics';
import type { CalculationResults } from '../utils/calculator';
import type { ComplexityFormData } from '../utils/complexity-detection';
import { isWeb, webClickableStyles } from '../utils/responsive';
import { createShadow } from '../utils/shadow-styles';
import {
  SPECIAL_CIRCUMSTANCES,
  getHighestPriorityReason,
  isCourtDateReason,
  type SpecialCircumstance,
} from '../utils/special-circumstances';
import { HelpTooltip } from './HelpTooltip';

interface SpecialCircumstancesPromptProps {
  results: CalculationResults;
  formData?: ComplexityFormData;
  onNavigate: () => void; // Callback to close modal before navigation
  onRequestInquiry?: () => void; // Callback to show inline inquiry panel (web mode)
  onSpecialCircumstancesChange?: (reasons: string[]) => void; // Callback to notify parent of selected reasons
}

export function SpecialCircumstancesPrompt({
  results,
  formData,
  onNavigate,
  onRequestInquiry,
  onSpecialCircumstancesChange,
}: SpecialCircumstancesPromptProps) {
  // State management
  const [selectedReasons, setSelectedReasons] = useState<Set<string>>(() => {
    // Initialize from formData if available
    return new Set(formData?.selectedCircumstances ?? []);
  });
  const [isNavigatingFromCoA, setIsNavigatingFromCoA] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [hasPropertySettlement, setHasPropertySettlement] = useState(() => {
    // Initialize from formData
    return (
      formData?.selectedCircumstances?.includes('property_settlement') ?? false
    );
  });

  // Hooks
  const router = useRouter();
  const analytics = useAnalytics();

  // Sync state with formData prop when it changes
  React.useEffect(() => {
    const reasons = formData?.selectedCircumstances ?? [];
    setSelectedReasons(new Set(reasons));

    setHasPropertySettlement(reasons.includes('property_settlement'));
  }, [formData?.selectedCircumstances]);

  // Group reasons by category (excluding urgent and new high-priority items - now handled separately)
  const incomeReasons = SPECIAL_CIRCUMSTANCES.filter(
    (r) => r.category === 'income' && r.id !== 'hiding_income'
  );
  const childReasons = SPECIAL_CIRCUMSTANCES.filter(
    (r) => r.category === 'child'
  );
  const otherReasons = SPECIAL_CIRCUMSTANCES.filter(
    (r) => r.category === 'other' && r.id !== 'property_settlement'
  );

  // Determine button state - disabled if no reasons selected or navigating
  // Note: Court date validation now happens in the input handler, so we don't need to check it here
  const buttonDisabled = selectedReasons.size === 0 || isNavigatingFromCoA;

  // Checkbox toggle handler
  const handleCheckboxToggle = useCallback(
    (reasonId: string) => {
      // Functional setState prevents race conditions on rapid toggling
      setSelectedReasons((prev) => {
        const next = new Set(prev); // Create new Set (immutability)
        const wasChecked = next.has(reasonId);

        if (wasChecked) {
          next.delete(reasonId);
        } else {
          next.add(reasonId);
        }

        // Notify parent of change
        const reasonsArray = Array.from(next);
        onSpecialCircumstancesChange?.(reasonsArray);

        // Track analytics (debouncing handled by setTimeout)
        setTimeout(() => {
          try {
            analytics.track('coa_reason_toggled', {
              reason_id: reasonId,
              is_checked: !wasChecked,
              total_selected: next.size,
            });
          } catch (error) {
            console.error('[CoAPrompt] Analytics error:', error);
          }
        }, 100);

        return next;
      });
    },
    [analytics, onSpecialCircumstancesChange]
  );

  // Navigation handler
  const handleNavigateToCoA = useCallback(() => {
    if (isNavigatingFromCoA || selectedReasons.size === 0) {
      return;
    }

    setIsNavigatingFromCoA(true);

    // Track analytics
    try {
      analytics.track('coa_button_clicked', {
        reasons_selected: JSON.stringify(Array.from(selectedReasons)),
        reason_count: selectedReasons.size,
        most_important_category:
          getHighestPriorityReason(Array.from(selectedReasons))?.category ??
          null,
        annual_liability: results.finalPaymentAmount,
      });
    } catch (error) {
      console.error('[CoAPrompt] Analytics error:', error);
    }

    // If onRequestInquiry callback exists (web inline mode), use it instead of navigation
    if (onRequestInquiry) {
      // Call the callback to show inline inquiry panel
      onRequestInquiry();
      // Reset navigation state
      setTimeout(() => setIsNavigatingFromCoA(false), 500);
      return;
    }

    // Otherwise, use navigation (mobile mode)
    // Close modal first (via callback)
    onNavigate();

    // Navigate after modal animation completes
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          // Serialize care arrangement data for each child
          const careData = (formData?.children ?? []).map((_child, index) => ({
            index,
            careA: results.childResults[index]?.roundedCareA ?? 0,
            careB: results.childResults[index]?.roundedCareB ?? 0,
          }));

          router.push({
            pathname: '/lawyer-inquiry',
            params: {
              // Existing params
              liability: results.finalPaymentAmount.toString(),
              trigger: 'change_of_assessment',
              incomeA: results.ATI_A.toString(),
              incomeB: results.ATI_B.toString(),
              children: (formData?.children?.length ?? 0).toString(),
              careData: JSON.stringify(careData),
              payer: results.payer,

              // NEW CoA params
              specialCircumstances: JSON.stringify(Array.from(selectedReasons)),
              priorityCircumstance:
                getHighestPriorityReason(Array.from(selectedReasons))?.id ?? '',
              fromBreakdown: 'true', // Track that user came from breakdown modal
            },
          });
        } catch (error) {
          console.error('[CoAPrompt] Navigation failed:', error);
          if (Platform.OS === 'web') {
            alert(
              'Navigation Error\n\nUnable to open inquiry form. Please try again.'
            );
          } else {
            Alert.alert(
              'Navigation Error',
              'Unable to open inquiry form. Please try again.'
            );
          }
        } finally {
          setTimeout(() => setIsNavigatingFromCoA(false), 500);
        }
      });
    });
  }, [
    isNavigatingFromCoA,
    selectedReasons,
    onNavigate,
    onRequestInquiry,
    router,
    results,
    formData,
    analytics,
  ]);

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

  return (
    <View style={styles.coaContainer}>
      {/* Header - Collapsible */}
      <Pressable
        style={[styles.coaHeader, isWeb && webClickableStyles]}
        onPress={() => setIsExpanded(!isExpanded)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Do special circumstances exist? ${isExpanded ? 'Collapse' : 'Expand'} section`}
        accessibilityHint={
          selectedReasons.size > 0
            ? `${selectedReasons.size} selected`
            : undefined
        }
      >
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.coaTitle}>Do special circumstances exist?</Text>
            <View style={styles.headerRight}>
              {!isExpanded && selectedReasons.size > 0 && (
                <View style={styles.selectionBadge}>
                  <Text style={styles.selectionBadgeText}>
                    {selectedReasons.size} selected
                  </Text>
                </View>
              )}
              <Text
                style={[styles.chevron, isExpanded && styles.chevronExpanded]}
              >
                ›
              </Text>
            </View>
          </View>
          <Text style={styles.coaDescription}>
            Some situations are too complex for the standard calculator. If any
            of these apply, a lawyer can help you request adjustments.
          </Text>
        </View>
      </Pressable>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.categorySections}>
          {/* Legal Section */}
          <View style={styles.legalDeadlinesSection}>
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
                    // Remove court date reason
                    setSelectedReasons((prev) => {
                      const next = new Set(prev);
                      Array.from(next).forEach((id) => {
                        if (isCourtDateReason(id)) {
                          next.delete(id);
                        }
                      });

                      // Notify parent of change
                      const reasonsArray = Array.from(next);
                      onSpecialCircumstancesChange?.(reasonsArray);

                      return next;
                    });
                  } else {
                    // Add a placeholder court date reason (will be replaced with actual date in inquiry form)
                    setSelectedReasons((prev) => {
                      const next = new Set(prev);
                      next.add('court_date_pending');

                      // Notify parent of change
                      const reasonsArray = Array.from(next);
                      onSpecialCircumstancesChange?.(reasonsArray);

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
                accessibilityHint="Double tap to check if you have an upcoming court hearing regarding child support"
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
                    what="Upcoming court dates are critical events. Professional legal preparation is strongly recommended to protect your interests before your appearance."
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
                    what="Pending property settlements can significantly affect child support obligations. A lawyer can help ensure the settlement is properly considered in your assessment."
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
              {/* Income Reasons */}
              {incomeReasons.map(renderCheckbox)}
            </View>
          </View>

          {/* Costs & Other Factors Group */}
          {(childReasons.length > 0 || otherReasons.length > 0) && (
            <>
              {/* Section Divider */}
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
      )}

      {/* Bottom section with button - Only shown when expanded */}
      {isExpanded && (
        <View style={styles.coaFooter}>
          <Pressable
            style={[
              styles.coaButton,
              buttonDisabled && styles.coaButtonDisabled,
              isWeb && !buttonDisabled && webClickableStyles,
            ]}
            onPress={handleNavigateToCoA}
            disabled={buttonDisabled}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Talk to a Lawyer About This"
            accessibilityHint={`${selectedReasons.size} reason${selectedReasons.size === 1 ? '' : 's'
              } selected`}
            accessibilityState={{ disabled: buttonDisabled }}
          >
            <Text style={styles.coaButtonText}>
              Talk to a Lawyer About This
            </Text>
          </Pressable>
          {selectedReasons.size > 0 && (
            <Text style={styles.selectedCount}>
              {selectedReasons.size} reason
              {selectedReasons.size === 1 ? '' : 's'} selected
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Container - Blueprint / Inverse Blue Style
  coaContainer: {
    backgroundColor: '#eff6ff', // blue-50
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bfdbfe', // blue-200
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 24,
    marginBottom: 16,
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    }),
  },

  // Header
  coaHeader: {
    marginBottom: 0,
  },
  headerContent: {
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e3a8a', // blue-900 (Dark Brand Blue)
    flex: 1,
  },
  coaDescription: {
    fontSize: 14,
    color: '#475569', // slate-600 (dark blue-grey)
    lineHeight: 21, // 1.5 line height
  },
  chevron: {
    fontSize: 24,
    color: '#2563eb', // blue-600 (Brand Blue)
    fontWeight: '600',
    transform: [{ rotate: '90deg' }],
    marginLeft: 4,
  },
  chevronExpanded: {
    transform: [{ rotate: '270deg' }],
  },
  selectionBadge: {
    backgroundColor: '#dbeafe', // blue-100
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  selectionBadgeText: {
    fontSize: 12,
    color: '#1e40af', // blue-800
    fontWeight: '600',
  },

  // Category sections
  categorySections: {
    gap: 10,
    marginTop: 20,
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

  // Legal Deadlines Section
  legalDeadlinesSection: {
    marginBottom: 0,
  },

  // Section Divider
  sectionDivider: {
    height: 1,
    backgroundColor: '#e2e8f0', // slate-200 (light grey)
    marginVertical: 2, // minimal gap for tight, cohesive layout
  },

  // Checkboxes
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db', // grey-300
    backgroundColor: '#ffffff', // white
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 4, // Align top of checkbox with top of text
  },
  checkboxChecked: {
    backgroundColor: '#2563EB', // blue-600 (Brand Blue)
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
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#475569', // slate-600 - matches description text
    lineHeight: 20,
    flex: 1,
    paddingRight: 4,
  },

  // Footer
  coaFooter: {
    marginTop: 4,
    gap: 12,
  },
  coaButton: {
    backgroundColor: '#2563EB', // blue-600 (Brand Blue)
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  coaButtonDisabled: {
    backgroundColor: '#93c5fd', // blue-300
  },
  coaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedCount: {
    fontSize: 14,
    color: '#6b7280', // grey-500
    textAlign: 'center',
  },
});
