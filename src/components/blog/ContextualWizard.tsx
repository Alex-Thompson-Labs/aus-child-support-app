/**
 * Contextual Special Circumstances Wizard for Blog Posts
 * 
 * Purpose: Inline wizard that pre-selects relevant special circumstances
 * based on blog post topic, allowing users to add more factors and submit
 * directly to inquiry form with enriched data.
 * 
 * Usage:
 * <ContextualWizard
 *   preselectedFactors={['income_resources_not_reflected']}
 *   blogTopic="hidden_income"
 *   ctaText="Get Help Uncovering Hidden Income"
 *   analyticsSource="blog_self_employed"
 * />
 */

import DatePickerField from '@/src/components/ui/DatePickerField';
import { HelpTooltip } from '@/src/features/calculator/components/HelpTooltip';
import { useAnalytics } from '@/src/utils/analytics';
import {
    isWeb,
    webClickableStyles as webClickableStylesRaw,
} from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import {
    SPECIAL_CIRCUMSTANCES,
    createCourtDateReasonId,
    isCourtDateReason,
    type SpecialCircumstance,
} from '@/src/utils/special-circumstances';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Animated,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

const webClickableStyles = webClickableStylesRaw as any;

// ============================================================================
// TYPES
// ============================================================================

interface ContextualWizardProps {
  /** Pre-selected factors based on blog topic */
  preselectedFactors: string[];
  
  /** Blog topic identifier for analytics */
  blogTopic: string;
  
  /** Custom CTA button text */
  ctaText: string;
  
  /** Analytics source identifier */
  analyticsSource: string;
  
  /** Optional: Highlighted factors to show at top */
  highlightedFactors?: string[];
  
  /** Optional: Custom title */
  title?: string;
  
  /** Optional: Custom description */
  description?: string;
  
  /** Optional: Form reason parameter */
  formReason?: string;
}

// ============================================================================
// ANIMATED CHECKBOX COMPONENT
// ============================================================================

interface CheckboxItemProps {
  reason: SpecialCircumstance;
  isChecked: boolean;
  onToggle: (id: string) => void;
  isHighlighted?: boolean;
}

const CheckboxItem = React.memo(function CheckboxItem({
  reason,
  isChecked,
  onToggle,
  isHighlighted = false,
}: CheckboxItemProps) {
  const handlePress = useCallback(
    () => onToggle(reason.id),
    [onToggle, reason.id]
  );

  return (
    <Pressable
      style={[
        styles.checkboxRow,
        isHighlighted && styles.checkboxRowHighlighted,
        isWeb && webClickableStyles,
      ]}
      onPress={handlePress}
      accessible
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked }}
      accessibilityLabel={reason.label}
    >
      <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
        {isChecked && <Text style={styles.checkboxCheck}>✓</Text>}
      </View>
      <View style={styles.checkboxContent}>
        <View style={styles.checkboxLabelContainer}>
          <Text style={styles.checkboxLabel}>{reason.label}</Text>
          <HelpTooltip what={reason.description} why="" hideWhatLabel />
        </View>
      </View>
    </Pressable>
  );
});

// ============================================================================
// COURT DATE FIELD COMPONENT
// ============================================================================

interface CourtDateFieldProps {
  show: boolean;
  courtDate: Date | null;
  onCourtDateChange: (date: Date | null) => void;
}

const CourtDateField = React.memo(function CourtDateField({
  show,
  courtDate,
  onCourtDateChange,
}: CourtDateFieldProps) {
  const [opacity] = useState(() => new Animated.Value(show ? 1 : 0));
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false);
      });
    }
  }, [show, opacity]);

  if (isWeb) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateRows: show ? '1fr' : '0fr',
          transition: 'grid-template-rows 300ms ease, opacity 300ms ease',
          opacity: show ? 1 : 0,
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <View style={styles.datePickerContainer}>
            <DatePickerField
              label="When is your court date? *"
              value={courtDate ?? null}
              onChange={onCourtDateChange}
              minDate={new Date()}
            />
          </View>
        </div>
      </div>
    );
  }

  if (!shouldRender) {
    return null;
  }

  return (
    <Animated.View style={{ opacity }}>
      <View style={styles.datePickerContainer}>
        <DatePickerField
          label="When is your court date? *"
          value={courtDate ?? null}
          onChange={onCourtDateChange}
          minDate={new Date()}
        />
      </View>
    </Animated.View>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ContextualWizard({
  preselectedFactors,
  blogTopic,
  ctaText,
  analyticsSource,
  highlightedFactors = [],
  title = 'Does This Apply to Your Situation?',
  description = 'Select any factors that apply. This helps us match you with the right specialist.',
  formReason,
}: ContextualWizardProps) {
  const router = useRouter();
  const analytics = useAnalytics();

  // State
  const [selectedReasons, setSelectedReasons] = useState<Set<string>>(
    () => new Set(preselectedFactors)
  );
  const [courtDate, setCourtDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Track wizard view
  useEffect(() => {
    analytics.track('blog_wizard_viewed', {
      blog_topic: blogTopic,
      analytics_source: analyticsSource,
      preselected_count: preselectedFactors.length,
    });
  }, [analytics, blogTopic, analyticsSource, preselectedFactors.length]);

  // Check if court date is selected
  const hasCourtDate = useMemo(
    () => Array.from(selectedReasons).some((id) => isCourtDateReason(id)),
    [selectedReasons]
  );

  // Organize factors by category
  const { highlighted, other } = useMemo(() => {
    const highlightedList: SpecialCircumstance[] = [];
    const otherList: SpecialCircumstance[] = [];

    SPECIAL_CIRCUMSTANCES.forEach((circumstance) => {
      if (highlightedFactors.includes(circumstance.id)) {
        highlightedList.push(circumstance);
      } else if (!preselectedFactors.includes(circumstance.id)) {
        otherList.push(circumstance);
      }
    });

    return { highlighted: highlightedList, other: otherList };
  }, [highlightedFactors, preselectedFactors]);

  // Handle checkbox toggle
  const handleToggle = useCallback(
    (reasonId: string) => {
      setSelectedReasons((prev) => {
        const next = new Set(prev);
        if (next.has(reasonId)) {
          next.delete(reasonId);
          if (isCourtDateReason(reasonId)) {
            setCourtDate(null);
          }
        } else {
          next.add(reasonId);
        }

        // Track factor change
        analytics.track('blog_wizard_factor_toggled', {
          blog_topic: blogTopic,
          factor_id: reasonId,
          action: next.has(reasonId) ? 'added' : 'removed',
          total_selected: next.size,
        });

        return next;
      });
    },
    [analytics, blogTopic]
  );

  // Handle court date toggle
  const handleCourtDateToggle = useCallback(() => {
    if (hasCourtDate) {
      Array.from(selectedReasons).forEach((id) => {
        if (isCourtDateReason(id)) handleToggle(id);
      });
    } else {
      handleToggle('court_date_pending');
    }
  }, [hasCourtDate, selectedReasons, handleToggle]);

  // Handle court date change
  const handleCourtDateChange = useCallback(
    (date: Date | null) => {
      setCourtDate(date);
    },
    []
  );

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (isSubmitting || selectedReasons.size === 0) {
      return;
    }

    setIsSubmitting(true);

    // Build reasons array with formatted court date
    const hasCourtDateReason = Array.from(selectedReasons).some(isCourtDateReason);
    let reasonsArray = Array.from(selectedReasons).filter(
      (id) => !isCourtDateReason(id)
    );

    if (hasCourtDateReason && courtDate) {
      reasonsArray.push(createCourtDateReasonId(courtDate));
    } else if (hasCourtDateReason) {
      reasonsArray.push('court_date_pending');
    }

    // Track submission
    analytics.track('blog_wizard_submitted', {
      blog_topic: blogTopic,
      analytics_source: analyticsSource,
      total_factors: reasonsArray.length,
      has_court_date: hasCourtDateReason,
    });

    // Navigate to inquiry form
    try {
      const returnTo = encodeURIComponent(
        typeof window !== 'undefined' ? window.location.href : ''
      );

      router.push({
        pathname: '/lawyer-inquiry',
        params: {
          mode: 'direct',
          reason: formReason || 'special_circumstances',
          specialCircumstances: JSON.stringify(reasonsArray),
          source: analyticsSource,
          returnTo,
        },
      });
    } catch (error) {
      console.error('[ContextualWizard] Navigation failed:', error);
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    selectedReasons,
    courtDate,
    analytics,
    blogTopic,
    analyticsSource,
    formReason,
    router,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {/* Pre-selected factors (always visible) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected for you:</Text>
          {preselectedFactors.map((factorId) => {
            const factor = SPECIAL_CIRCUMSTANCES.find((c) => c.id === factorId);
            if (!factor) return null;
            return (
              <CheckboxItem
                key={factor.id}
                reason={factor}
                isChecked={selectedReasons.has(factor.id)}
                onToggle={handleToggle}
                isHighlighted
              />
            );
          })}
        </View>

        {/* Court date option */}
        <View style={styles.section}>
          <Pressable
            style={[styles.checkboxRow, isWeb && webClickableStyles]}
            onPress={handleCourtDateToggle}
            accessible
            accessibilityRole="checkbox"
            accessibilityState={{ checked: hasCourtDate }}
          >
            <View
              style={[styles.checkbox, hasCourtDate && styles.checkboxChecked]}
            >
              {hasCourtDate && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <View style={styles.checkboxContent}>
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
            </View>
          </Pressable>

          <CourtDateField
            show={hasCourtDate}
            courtDate={courtDate}
            onCourtDateChange={handleCourtDateChange}
          />
        </View>

        {/* Expandable: Other factors */}
        {(highlighted.length > 0 || other.length > 0) && (
          <View style={styles.section}>
            <Pressable
              style={[styles.expandButton, isWeb && webClickableStyles]}
              onPress={() => {
                setIsExpanded(!isExpanded);
                analytics.track('blog_wizard_expanded', {
                  blog_topic: blogTopic,
                  expanded: !isExpanded,
                });
              }}
              accessible
              accessibilityRole="button"
            >
              <Text style={styles.expandButtonText}>
                {isExpanded ? '− ' : '+ '}
                Add other factors that apply
              </Text>
            </Pressable>

            {isExpanded && (
              <View style={styles.expandedContent}>
                {highlighted.length > 0 && (
                  <View style={styles.subsection}>
                    <Text style={styles.subsectionTitle}>Common factors:</Text>
                    {highlighted.map((factor) => (
                      <CheckboxItem
                        key={factor.id}
                        reason={factor}
                        isChecked={selectedReasons.has(factor.id)}
                        onToggle={handleToggle}
                      />
                    ))}
                  </View>
                )}

                {other.length > 0 && (
                  <View style={styles.subsection}>
                    <Text style={styles.subsectionTitle}>Other factors:</Text>
                    <ScrollView
                      style={styles.scrollableList}
                      nestedScrollEnabled
                    >
                      {other.map((factor) => (
                        <CheckboxItem
                          key={factor.id}
                          reason={factor}
                          isChecked={selectedReasons.has(factor.id)}
                          onToggle={handleToggle}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Submit button */}
        <Pressable
          style={[
            styles.submitButton,
            selectedReasons.size === 0 && styles.submitButtonDisabled,
            isSubmitting && styles.submitButtonDisabled,
            isWeb && selectedReasons.size > 0 && !isSubmitting && webClickableStyles,
          ]}
          onPress={handleSubmit}
          disabled={selectedReasons.size === 0 || isSubmitting}
          accessible
          accessibilityRole="button"
          accessibilityLabel={ctaText}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Loading...' : ctaText}
          </Text>
        </Pressable>

        {/* Trust signals */}
        <View style={styles.trustSignals}>
          <Text style={styles.trustItem}>✓ Free initial consultation</Text>
          <Text style={styles.trustItem}>✓ No obligation to proceed</Text>
          <Text style={styles.trustItem}>✓ Your information is confidential</Text>
        </View>
      </View>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginVertical: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  header: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 12,
  },
  subsection: {
    marginTop: 16,
  },
  subsectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkboxRowHighlighted: {
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: -12,
    paddingHorizontal: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkboxCheck: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  checkboxContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxLabelContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    flex: 1,
  },
  datePickerContainer: {
    marginLeft: 36,
    marginTop: 8,
    marginBottom: 8,
  },
  expandButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3a8a',
    textAlign: 'center',
  },
  expandedContent: {
    marginTop: 16,
  },
  scrollableList: {
    maxHeight: 300,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5fd',
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  trustSignals: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 8,
  },
  trustItem: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
});
