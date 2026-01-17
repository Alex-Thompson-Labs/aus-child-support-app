import DatePickerField from '@/src/components/ui/DatePickerField';
import { HelpTooltip } from '@/src/features/calculator/components/HelpTooltip';
import { formatCourtDateForReasons } from '@/src/features/lawyer-inquiry/validators';
import { searchCountries } from '@/src/utils/all-countries';
import {
  isWeb,
  webClickableStyles as webClickableStylesRaw,
  webOnlyStyles as webOnlyStylesRaw,
} from '@/src/utils/responsive';
import {
  SPECIAL_CIRCUMSTANCES,
  isCourtDateReason,
  type SpecialCircumstance,
} from '@/src/utils/special-circumstances';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const webClickableStyles = webClickableStylesRaw as any;
const webOnlyStyles = webOnlyStylesRaw as any;

// Types
interface SpecialCircumstancesWizardProps {
  initialSelectedReasons?: string[];
  onSpecialCircumstancesChange?: (reasons: string[]) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isStandalone?: boolean;
  onCountryChange?: (country: string) => void;
}

interface StepProps {
  selectedReasons: Set<string>;
  onToggle: (reasonId: string) => void;
  courtDate?: Date | null;
  onCourtDateChange?: (date: Date | null) => void;
  otherParentCountry?: string;
  onOtherParentCountryChange?: (country: string) => void;
}

type WizardStep = 'legal' | 'income' | 'costs' | 'summary';

const STEPS: WizardStep[] = ['legal', 'income', 'costs', 'summary'];

const STEP_TITLES: Record<WizardStep, string> = {
  legal: 'Legal Matters',
  income: 'Income & Financial Capacity',
  costs: 'Costs & Other Factors',
  summary: 'Review & Submit',
};

// Animated Conditional Field Component
interface AnimatedConditionalFieldProps {
  show: boolean;
  children: React.ReactNode;
}

const AnimatedConditionalField = memo(function AnimatedConditionalField({
  show,
  children,
}: AnimatedConditionalFieldProps) {
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
    // Use CSS Grid transition on web - always render to enable smooth transitions
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
          {children}
        </div>
      </div>
    );
  }

  // Use Animated.View on mobile - only render when needed
  if (!shouldRender) {
    return null;
  }

  return (
    <Animated.View style={{ opacity }}>
      {children}
    </Animated.View>
  );
});

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
  const handlePress = useCallback(
    () => onToggle(reason.id),
    [onToggle, reason.id]
  );

  return (
    <Pressable
      style={[styles.checkboxRow, isWeb && webClickableStyles]}
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
      <Text style={styles.progressText}>
        Step {currentStep} of {totalSteps}
      </Text>
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
const LegalStep = memo(function LegalStep({
  selectedReasons,
  onToggle,
  courtDate,
  onCourtDateChange,
  otherParentCountry,
  onOtherParentCountryChange,
}: StepProps) {
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const hasCourtDate = useMemo(
    () => Array.from(selectedReasons).some((id) => isCourtDateReason(id)),
    [selectedReasons]
  );
  const hasPropertySettlement = selectedReasons.has('property_settlement');
  const hasInternationalJurisdiction = selectedReasons.has(
    'international_jurisdiction'
  );

  const filteredCountries = useMemo(() => {
    return searchCountries(countrySearch).slice(0, 10);
  }, [countrySearch]);

  const handleCourtDateToggle = useCallback(() => {
    if (hasCourtDate) {
      Array.from(selectedReasons).forEach((id) => {
        if (isCourtDateReason(id)) onToggle(id);
      });
    } else {
      onToggle('court_date_pending');
    }
  }, [hasCourtDate, selectedReasons, onToggle]);

  const internationalJurisdictionReason = useMemo(
    () =>
      SPECIAL_CIRCUMSTANCES.find((r) => r.id === 'international_jurisdiction'),
    []
  );

  return (
    <View style={styles.stepContent}>
      <Text
        style={styles.stepDescription}
        nativeID="legal-step-heading"
      >
        Do you have any urgent legal matters that require immediate attention?
      </Text>
      <View
        style={styles.checkboxList}
        role="group"
        aria-labelledby="legal-step-heading"
      >
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

        <AnimatedConditionalField show={hasCourtDate && !!onCourtDateChange}>
          <View style={styles.datePickerContainer}>
            {onCourtDateChange && (
              <DatePickerField
                label="When is your court date? *"
                value={courtDate}
                onChange={onCourtDateChange}
                minDate={new Date()}
              />
            )}
          </View>
        </AnimatedConditionalField>

        <Pressable
          style={[styles.checkboxRow, isWeb && webClickableStyles]}
          onPress={() => onToggle('property_settlement')}
          accessible
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
          <View style={styles.checkboxContent}>
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
          </View>
        </Pressable>

        {internationalJurisdictionReason && (
          <Pressable
            style={[styles.checkboxRow, isWeb && webClickableStyles]}
            onPress={() => onToggle('international_jurisdiction')}
            accessible
            accessibilityRole="checkbox"
            accessibilityState={{ checked: hasInternationalJurisdiction }}
          >
            <View
              style={[
                styles.checkbox,
                hasInternationalJurisdiction && styles.checkboxChecked,
              ]}
            >
              {hasInternationalJurisdiction && (
                <Text style={styles.checkboxCheck}>✓</Text>
              )}
            </View>
            <View style={styles.checkboxContent}>
              <View style={styles.checkboxLabelContainer}>
                <Text style={styles.checkboxLabel}>
                  {internationalJurisdictionReason.label}
                </Text>
                <HelpTooltip
                  what={internationalJurisdictionReason.description}
                  why=""
                  hideWhatLabel
                />
              </View>
            </View>
          </Pressable>
        )}

        <AnimatedConditionalField show={hasInternationalJurisdiction && !!onOtherParentCountryChange}>
          <View style={styles.countryFieldContainer}>
            <Text style={styles.countryLabel}>
              Other parent&apos;s country of habitual residence
            </Text>
            <TextInput
              style={styles.countryInput}
              placeholder="Search for a country..."
              placeholderTextColor="#94a3b8"
              value={otherParentCountry || countrySearch}
              onChangeText={(text) => {
                setCountrySearch(text);
                if (otherParentCountry && onOtherParentCountryChange) {
                  onOtherParentCountryChange('');
                }
                setShowCountryDropdown(true);
              }}
              onFocus={() => setShowCountryDropdown(true)}
            />

            {showCountryDropdown &&
              countrySearch.length > 0 &&
              !otherParentCountry && (
                <View style={styles.countryDropdown}>
                  <ScrollView
                    style={styles.countryDropdownScroll}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                  >
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <Pressable
                          key={country}
                          style={styles.countryOption}
                          onPress={() => {
                            if (onOtherParentCountryChange) {
                              onOtherParentCountryChange(country);
                            }
                            setCountrySearch('');
                            setShowCountryDropdown(false);
                          }}
                        >
                          <Text style={styles.countryOptionText}>
                            {country}
                          </Text>
                        </Pressable>
                      ))
                    ) : (
                      <Text style={styles.noResultsText}>
                        No countries found
                      </Text>
                    )}
                  </ScrollView>
                </View>
              )}
          </View>
        </AnimatedConditionalField>
      </View>
    </View>
  );
});

// Step: Income
const IncomeStep = memo(function IncomeStep({
  selectedReasons,
  onToggle,
}: StepProps) {
  const incomeReasons = useMemo(
    () =>
      SPECIAL_CIRCUMSTANCES.filter(
        (r: SpecialCircumstance) =>
          r.category === 'income' && r.id !== 'hiding_income'
      ),
    []
  );

  return (
    <View style={styles.stepContent}>
      <Text
        style={styles.stepDescription}
        nativeID="income-step-heading"
      >
        Are there concerns about the other parent&apos;s financial situation?
      </Text>
      <View
        style={styles.checkboxList}
        role="group"
        aria-labelledby="income-step-heading"
      >
        {incomeReasons.map((reason: SpecialCircumstance) => (
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
const CostsStep = memo(function CostsStep({
  selectedReasons,
  onToggle,
}: StepProps) {
  const allReasons = useMemo(() => {
    const child = SPECIAL_CIRCUMSTANCES.filter(
      (r: SpecialCircumstance) => r.category === 'child'
    );
    const other = SPECIAL_CIRCUMSTANCES.filter(
      (r: SpecialCircumstance) =>
        r.category === 'other' &&
        r.id !== 'property_settlement' &&
        r.id !== 'international_jurisdiction'
    );
    return [...child, ...other];
  }, []);

  return (
    <View style={styles.stepContent}>
      <Text
        style={styles.stepDescription}
        nativeID="costs-step-heading"
      >
        Are there any special costs or circumstances affecting your situation?
      </Text>
      <View
        style={styles.checkboxList}
        role="group"
        aria-labelledby="costs-step-heading"
      >
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
          icon: '',
          description: '',
          category: 'urgent',
          priority: 1,
          officialCodes: [],
        });
      } else {
        const found = SPECIAL_CIRCUMSTANCES.find(
          (r: SpecialCircumstance) => r.id === id
        );
        if (found) {
          reasons.push(found);
        }
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
            <View style={styles.summaryCheckmark}>
              <Text style={styles.summaryCheckmarkText}>✓</Text>
            </View>
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
        <Text style={styles.submitButtonText}>
          Talk to a Lawyer About This
        </Text>
      </Pressable>
    </View>
  );
});

// Main Wizard Component
export function SpecialCircumstancesWizard({
  initialSelectedReasons = [],
  onSpecialCircumstancesChange,
  onSubmit,
  isSubmitting,
  isStandalone = false,
  onCountryChange,
}: SpecialCircumstancesWizardProps) {
  const [selectedReasons, setSelectedReasons] = useState<Set<string>>(
    () => new Set(initialSelectedReasons)
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [courtDate, setCourtDate] = useState<Date | null>(null);
  const [otherParentCountry, setOtherParentCountry] = useState<string>('');

  useEffect(() => {
    setSelectedReasons(new Set(initialSelectedReasons));
  }, [initialSelectedReasons]);

  const currentStep = STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const handleToggle = useCallback(
    (reasonId: string) => {
      setSelectedReasons((prev) => {
        const next = new Set(prev);
        if (next.has(reasonId)) {
          next.delete(reasonId);
          // If unchecking a court date reason, clear the date
          if (isCourtDateReason(reasonId)) {
            setCourtDate(null);
          }
        } else {
          next.add(reasonId);
        }

        // Build reasons array with formatted court date if applicable
        const hasCourtDateReason = Array.from(next).some(isCourtDateReason);
        let reasonsArray = Array.from(next).filter(id => !isCourtDateReason(id));

        // Add formatted court date if a court date reason is selected and date is set
        if (hasCourtDateReason && courtDate) {
          reasonsArray.push(formatCourtDateForReasons(courtDate));
        } else if (hasCourtDateReason) {
          // Keep the generic court_date_pending if no date is set yet
          reasonsArray.push('court_date_pending');
        }

        onSpecialCircumstancesChange?.(reasonsArray);

        return next;
      });
    },
    [onSpecialCircumstancesChange, courtDate]
  );

  const handleCourtDateChange = useCallback(
    (date: Date | null) => {
      setCourtDate(date);

      // Update the reasons array with the new date
      const hasCourtDateReason = Array.from(selectedReasons).some(isCourtDateReason);
      if (hasCourtDateReason) {
        let reasonsArray = Array.from(selectedReasons).filter(id => !isCourtDateReason(id));

        if (date) {
          reasonsArray.push(formatCourtDateForReasons(date));
        } else {
          reasonsArray.push('court_date_pending');
        }

        onSpecialCircumstancesChange?.(reasonsArray);
      }
    },
    [selectedReasons, onSpecialCircumstancesChange]
  );

  const handleOtherParentCountryChange = useCallback(
    (country: string) => {
      setOtherParentCountry(country);
      onCountryChange?.(country);
    },
    [onCountryChange]
  );

  const handleNext = useCallback(() => {
    if (!isLastStep) setCurrentStepIndex((p) => p + 1);
  }, [isLastStep]);

  const handleBack = useCallback(() => {
    if (!isFirstStep) setCurrentStepIndex((p) => p - 1);
  }, [isFirstStep]);

  const renderStepContent = () => {
    const stepProps: StepProps = {
      selectedReasons,
      onToggle: handleToggle,
      courtDate,
      onCourtDateChange: handleCourtDateChange,
      otherParentCountry,
      onOtherParentCountryChange: handleOtherParentCountryChange,
    };
    switch (currentStep) {
      case 'legal':
        return <LegalStep {...stepProps} />;
      case 'income':
        return <IncomeStep {...stepProps} />;
      case 'costs':
        return <CostsStep {...stepProps} />;
      case 'summary':
        return (
          <SummaryStep
            {...stepProps}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
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
          accessible
          accessibilityRole="button"
          accessibilityLabel="Go to previous step"
        >
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        {!isLastStep ? (
          <Pressable
            style={[
              styles.navButton,
              styles.nextButton,
              isWeb && webClickableStyles,
            ]}
            onPress={handleNext}
            accessible
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
  );
}

// Styles
const styles = StyleSheet.create({
  wizardContainer: { marginTop: 0 },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 12,
  },
  progressBar: { flexDirection: 'row', gap: 8 },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cbd5e1',
  },
  progressDotActive: { backgroundColor: '#93c5fd' },
  progressDotCurrent: { backgroundColor: '#2563eb', width: 24 },
  stepContent: { minHeight: 200 },
  stepDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
    marginBottom: 16,
  },
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
    paddingRight: 4,
  },
  datePickerContainer: {
    marginLeft: 32,
    marginTop: 12,
    marginBottom: 12,
  },
  countryFieldContainer: {
    marginLeft: 32,
    marginTop: 12,
    marginBottom: 12,
  },
  countryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  countryInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    fontSize: 16,
    color: '#1a202c',
  },
  countryDropdown: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  countryDropdownScroll: {
    maxHeight: 200,
  },
  countryOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  countryOptionText: {
    fontSize: 14,
    color: '#475569',
  },
  noResultsText: {
    padding: 16,
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  summaryList: {
    padding: 16,
    marginBottom: 20,
    gap: 16,
    ...(isWeb &&
      ({
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20,
      } as any)),
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    ...(isWeb &&
      ({
        paddingVertical: 4,
      } as any)),
  },
  summaryCheckmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  summaryCheckmarkText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryText: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
    lineHeight: 20,
  },
  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyStateText: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateHint: { fontSize: 13, color: '#94a3b8', textAlign: 'center' },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonHidden: { opacity: 0 },
  navButtonSpacer: { flex: 1 },
  backButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
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
