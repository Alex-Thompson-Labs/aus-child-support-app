import { HelpTooltip } from '@/src/features/calculator/components/HelpTooltip';
import { useAnalytics } from '@/src/utils/analytics';
import type { CalculationResults } from '@/src/utils/calculator';
import type { ComplexityFormData } from '@/src/utils/complexity-detection';
import { isWeb, webClickableStyles } from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import {
  SPECIAL_CIRCUMSTANCES,
  getHighestPriorityReason,
  isCourtDateReason,
  type SpecialCircumstance,
} from '@/src/utils/special-circumstances';
import { useRouter } from 'expo-router';
import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Types
interface SpecialCircumstancesPromptProps {
  results: CalculationResults;
  formData?: ComplexityFormData;
  onNavigate: () => void;
  onRequestInquiry?: () => void;
  onSpecialCircumstancesChange?: (reasons: string[]) => void;
  calculatorStartTime?: number;
}

interface StepProps {
  selectedReasons: Set<string>;
  onToggle: (reasonId: string) => void;
}

type WizardStep = 'legal' | 'income' | 'costs' | 'summary';

const STEPS: WizardStep[] = ['legal', 'income', 'costs', 'summary'];

const STEP_TITLES: Record<WizardStep, string> = {
  legal: 'Legal Matters',
  income: "Other Parent's Financials",
  costs: 'Costs & Other Factors',
  summary: 'Review & Submit',
};

// Memoized Checkbox Component
interface CheckboxItemProps {
  reason: SpecialCircumstance;
  isChecked: boolean;
  onToggle: (id: string) => void;
}

const CheckboxItem = memo(function CheckboxItem({
  reason,
  isChecked,
  onToggle,
}: CheckboxItemProps) {
  const handlePress = useCallback(() => onToggle(reason.id), [onToggle, reason.id]);

  return (
    <Pressable
      style={[styles.checkboxRow, isWeb && webClickableStyles]}
      onPress={handlePress}
      accessible={true}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked }}
      accessibilityLabel={reason.label}
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
});

// Progress Indicator
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
}

const ProgressIndicator = memo(function ProgressIndicator({
  currentStep,
  totalSteps,
  stepTitle,
}: ProgressIndicatorProps) {
  return (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>Step {currentStep} of {totalSteps}</Text>
      <Text style={styles.stepTitle}>{stepTitle}</Text>
      <View style={styles.progressBar}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i < currentStep && styles.progressDotActive,
              i === currentStep - 1 && styles.progressDotCurrent,
            ]}
          />
        ))}
      </View>
    </View>
  );
});

// Step: Legal
const LegalStep = memo(function LegalStep({ selectedReasons, onToggle }: StepProps) {
  const hasCourtDate = useMemo(
    () => Array.from(selectedReasons).some((id) => isCourtDateReason(id)),
    [selectedReasons]
  );
  const hasPropertySettlement = selectedReasons.has('property_settlement');

  const handleCourtDateToggle = useCallback(() => {
    if (hasCourtDate) {
      Array.from(selectedReasons).forEach((id) => {
        if (isCourtDateReason(id)) onToggle(id);
      });
    } else {
      onToggle('court_date_pending');
    }
  }, [hasCourtDate, selectedReasons, onToggle]);

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepDescription}>
        Do you have any urgent legal matters that require immediate attention?
      </Text>
      <View style={styles.checkboxList}>
        <Pressable
          style={[styles.checkboxRow, isWeb && webClickableStyles]}
          onPress={handleCourtDateToggle}
          accessible={true}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: hasCourtDate }}
        >
          <View style={[styles.checkbox, hasCourtDate && styles.checkboxChecked]}>
            {hasCourtDate && <Text style={styles.checkboxCheck}>✓</Text>}
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

        <Pressable
          style={[styles.checkboxRow, isWeb && webClickableStyles]}
          onPress={() => onToggle('property_settlement')}
          accessible={true}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: hasPropertySettlement }}
        >
          <View style={[styles.checkbox, hasPropertySettlement && styles.checkboxChecked]}>
            {hasPropertySettlement && <Text style={styles.checkboxCheck}>✓</Text>}
          </View>
          <View style={styles.checkboxLabelContainer}>
            <Text style={styles.checkboxLabel}>I have a property settlement pending.</Text>
            <HelpTooltip
              what="Pending property settlements can significantly affect child support obligations."
              why=""
              hideWhatLabel
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
});

// Step: Income
const IncomeStep = memo(function IncomeStep({ selectedReasons, onToggle }: StepProps) {
  const incomeReasons = useMemo(
    () => SPECIAL_CIRCUMSTANCES.filter((r) => r.category === 'income' && r.id !== 'hiding_income'),
    []
  );

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepDescription}>
        Are there concerns about the other parent&apos;s financial situation?
      </Text>
      <View style={styles.checkboxList}>
        {incomeReasons.map((reason) => (
          <CheckboxItem
            key={reason.id}
            reason={reason}
            isChecked={selectedReasons.has(reason.id)}
            onToggle={onToggle}
          />
        ))}
      </View>
    </View>
  );
});

// Step: Costs
const CostsStep = memo(function CostsStep({ selectedReasons, onToggle }: StepProps) {
  const allReasons = useMemo(() => {
    const child = SPECIAL_CIRCUMSTANCES.filter((r) => r.category === 'child');
    const other = SPECIAL_CIRCUMSTANCES.filter(
      (r) => r.category === 'other' && r.id !== 'property_settlement'
    );
    return [...child, ...other];
  }, []);

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepDescription}>
        Are there any special costs or circumstances affecting your situation?
      </Text>
      <View style={styles.checkboxList}>
        {allReasons.map((reason) => (
          <CheckboxItem
            key={reason.id}
            reason={reason}
            isChecked={selectedReasons.has(reason.id)}
            onToggle={onToggle}
          />
        ))}
      </View>
    </View>
  );
});

// Step: Summary
interface SummaryStepProps extends StepProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

const SummaryStep = memo(function SummaryStep({
  selectedReasons,
  onSubmit,
  isSubmitting,
}: SummaryStepProps) {
  const selectedList = useMemo(() => {
    const reasons: SpecialCircumstance[] = [];
    selectedReasons.forEach((id) => {
      if (isCourtDateReason(id)) {
        reasons.push({
          id,
          label: 'Upcoming court hearing regarding child support',
          description: '',
          category: 'urgent',
          priority: 1,
          officialCodes: [],
        });
      } else {
        const found = SPECIAL_CIRCUMSTANCES.find((r) => r.id === id);
        if (found) reasons.push(found);
      }
    });
    return reasons;
  }, [selectedReasons]);

  if (selectedReasons.size === 0) {
    return (
      <View style={styles.stepContent}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            You haven&apos;t selected any special circumstances yet.
          </Text>
          <Text style={styles.emptyStateHint}>
            Go back to previous steps to select any factors that apply.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepDescription}>
        You&apos;ve selected {selectedReasons.size} circumstance
        {selectedReasons.size === 1 ? '' : 's'} that may warrant legal review:
      </Text>
      <View style={styles.summaryList}>
        {selectedList.map((reason) => (
          <View key={reason.id} style={styles.summaryItem}>
            <Text style={styles.summaryBullet}>•</Text>
            <Text style={styles.summaryText}>{reason.label}</Text>
          </View>
        ))}
      </View>
      <Pressable
        style={[
          styles.submitButton,
          isSubmitting && styles.submitButtonDisabled,
          isWeb && !isSubmitting && webClickableStyles,
        ]}
        onPress={onSubmit}
        disabled={isSubmitting}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Talk to a Lawyer About This"
      >
        <Text style={styles.submitButtonText}>Talk to a Lawyer About This</Text>
      </Pressable>
    </View>
  );
});


// Main Wizard Component
export function SpecialCircumstancesPrompt({
  results,
  formData,
  onNavigate,
  onRequestInquiry,
  onSpecialCircumstancesChange,
  calculatorStartTime,
}: SpecialCircumstancesPromptProps) {
  const [selectedReasons, setSelectedReasons] = useState<Set<string>>(
    () => new Set(formData?.selectedCircumstances ?? [])
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const router = useRouter();
  const analytics = useAnalytics();

  React.useEffect(() => {
    setSelectedReasons(new Set(formData?.selectedCircumstances ?? []));
  }, [formData?.selectedCircumstances]);

  const currentStep = STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const handleToggle = useCallback(
    (reasonId: string) => {
      setSelectedReasons((prev) => {
        const next = new Set(prev);
        if (next.has(reasonId)) next.delete(reasonId);
        else next.add(reasonId);

        onSpecialCircumstancesChange?.(Array.from(next));

        setTimeout(() => {
          try {
            analytics.track('coa_reason_toggled', {
              reason_id: reasonId,
              is_checked: next.has(reasonId),
              total_selected: next.size,
            });
          } catch {}
        }, 100);

        return next;
      });
    },
    [analytics, onSpecialCircumstancesChange]
  );

  const handleNext = useCallback(() => {
    if (!isLastStep) setCurrentStepIndex((p) => p + 1);
  }, [isLastStep]);

  const handleBack = useCallback(() => {
    if (!isFirstStep) setCurrentStepIndex((p) => p - 1);
  }, [isFirstStep]);

  const handleSubmit = useCallback(() => {
    if (isNavigating || selectedReasons.size === 0) return;
    setIsNavigating(true);

    try {
      // Track inquiry_opened for funnel analytics
      analytics.track('inquiry_opened', {
        source: 'special_circumstances',
        reason_count: selectedReasons.size,
        most_important_category:
          getHighestPriorityReason(Array.from(selectedReasons))?.category ?? null,
        total_liability: results.finalPaymentAmount,
      });
      // Legacy event
      analytics.track('coa_button_clicked', {
        reasons_selected: JSON.stringify(Array.from(selectedReasons)),
        reason_count: selectedReasons.size,
        most_important_category:
          getHighestPriorityReason(Array.from(selectedReasons))?.category ?? null,
        annual_liability: results.finalPaymentAmount,
      });
    } catch {}

    if (onRequestInquiry) {
      onRequestInquiry();
      setTimeout(() => setIsNavigating(false), 500);
      return;
    }

    onNavigate();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          const careData = (formData?.children ?? []).map((_child, index) => ({
            index,
            careA: results.childResults[index]?.roundedCareA ?? 0,
            careB: results.childResults[index]?.roundedCareB ?? 0,
          }));

          router.push({
            pathname: '/lawyer-inquiry',
            params: {
              liability: results.finalPaymentAmount.toString(),
              trigger: 'change_of_assessment',
              incomeA: results.ATI_A.toString(),
              incomeB: results.ATI_B.toString(),
              children: (formData?.children?.length ?? 0).toString(),
              careData: JSON.stringify(careData),
              payer: results.payer,
              specialCircumstances: JSON.stringify(Array.from(selectedReasons)),
              priorityCircumstance:
                getHighestPriorityReason(Array.from(selectedReasons))?.id ?? '',
              fromBreakdown: 'true',
              ...(calculatorStartTime && { calculatorStartTime: calculatorStartTime.toString() }),
            },
          });
        } catch (error) {
          if (Platform.OS === 'web') {
            alert('Navigation Error\n\nUnable to open inquiry form. Please try again.');
          } else {
            Alert.alert('Navigation Error', 'Unable to open inquiry form. Please try again.');
          }
        } finally {
          setTimeout(() => setIsNavigating(false), 500);
        }
      });
    });
  }, [isNavigating, selectedReasons, onNavigate, onRequestInquiry, router, results, formData, analytics, calculatorStartTime]);

  const renderStepContent = () => {
    const stepProps: StepProps = { selectedReasons, onToggle: handleToggle };
    switch (currentStep) {
      case 'legal':
        return <LegalStep {...stepProps} />;
      case 'income':
        return <IncomeStep {...stepProps} />;
      case 'costs':
        return <CostsStep {...stepProps} />;
      case 'summary':
        return <SummaryStep {...stepProps} onSubmit={handleSubmit} isSubmitting={isNavigating} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.coaContainer}>
      <Pressable
        style={[styles.coaHeader, isWeb && webClickableStyles]}
        onPress={() => setIsExpanded((p) => !p)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Do special circumstances exist? ${isExpanded ? 'Collapse' : 'Expand'}`}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.coaTitle}>Do special circumstances exist?</Text>
            <View style={styles.headerRight}>
              {!isExpanded && selectedReasons.size > 0 && (
                <View style={styles.selectionBadge}>
                  <Text style={styles.selectionBadgeText}>{selectedReasons.size} selected</Text>
                </View>
              )}
              <Text style={[styles.chevron, isExpanded && styles.chevronExpanded]}>›</Text>
            </View>
          </View>
          <Text style={styles.coaDescription}>
            Some situations are too complex for the standard calculator. If any of these apply, a
            lawyer can help you request adjustments.
          </Text>
        </View>
      </Pressable>

      {isExpanded && (
        <View style={styles.wizardContainer}>
          <ProgressIndicator
            currentStep={currentStepIndex + 1}
            totalSteps={STEPS.length}
            stepTitle={STEP_TITLES[currentStep]}
          />
          {renderStepContent()}
          <View style={styles.navigationButtons}>
            <Pressable
              style={[
                styles.navButton,
                styles.backButton,
                isFirstStep && styles.navButtonHidden,
                isWeb && !isFirstStep && webClickableStyles,
              ]}
              onPress={handleBack}
              disabled={isFirstStep}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Go to previous step"
            >
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
            {!isLastStep ? (
              <Pressable
                style={[styles.navButton, styles.nextButton, isWeb && webClickableStyles]}
                onPress={handleNext}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Go to next step"
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </Pressable>
            ) : (
              <View style={styles.navButtonSpacer} />
            )}
          </View>
        </View>
      )}
    </View>
  );
}


// Styles
const styles = StyleSheet.create({
  coaContainer: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bfdbfe',
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
  coaHeader: { marginBottom: 0 },
  headerContent: { width: '100%' },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  coaTitle: { fontSize: 18, fontWeight: '600', color: '#1e3a8a', flex: 1 },
  coaDescription: { fontSize: 14, color: '#475569', lineHeight: 21 },
  chevron: {
    fontSize: 24,
    color: '#2563eb',
    fontWeight: '600',
    transform: [{ rotate: '90deg' }],
    marginLeft: 4,
  },
  chevronExpanded: { transform: [{ rotate: '270deg' }] },
  selectionBadge: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  selectionBadgeText: { fontSize: 12, color: '#1e40af', fontWeight: '600' },
  wizardContainer: { marginTop: 20 },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  progressText: { fontSize: 12, color: '#64748b', fontWeight: '500', marginBottom: 4 },
  stepTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },
  progressBar: { flexDirection: 'row', gap: 8 },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#cbd5e1' },
  progressDotActive: { backgroundColor: '#93c5fd' },
  progressDotCurrent: { backgroundColor: '#2563eb', width: 24 },
  stepContent: { minHeight: 200 },
  stepDescription: { fontSize: 14, color: '#475569', lineHeight: 21, marginBottom: 16 },
  checkboxList: { gap: 12 },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start' },
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
    marginTop: 4,
  },
  checkboxChecked: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  checkboxCheck: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  checkboxLabelContainer: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  checkboxLabel: { fontSize: 14, color: '#475569', lineHeight: 20, flex: 1, paddingRight: 4 },
  summaryList: { backgroundColor: '#ffffff', borderRadius: 8, padding: 16, marginBottom: 20, gap: 8 },
  summaryItem: { flexDirection: 'row', alignItems: 'flex-start' },
  summaryBullet: { fontSize: 14, color: '#2563eb', marginRight: 8, fontWeight: '600' },
  summaryText: { fontSize: 14, color: '#334155', flex: 1, lineHeight: 20 },
  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyStateText: { fontSize: 15, color: '#64748b', textAlign: 'center', marginBottom: 8 },
  emptyStateHint: { fontSize: 13, color: '#94a3b8', textAlign: 'center' },
  navigationButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 },
  navButton: { flex: 1, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center' },
  navButtonHidden: { opacity: 0 },
  navButtonSpacer: { flex: 1 },
  backButton: { backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
  backButtonText: { fontSize: 15, fontWeight: '600', color: '#475569' },
  nextButton: { backgroundColor: '#2563eb' },
  nextButtonText: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonDisabled: { backgroundColor: '#93c5fd' },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
