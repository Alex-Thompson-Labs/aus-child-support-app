import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculator } from '../hooks/useCalculator';
import { convertCareToPercentage } from '../utils/care-utils';
import { getYearConstants } from '../utils/child-support-constants';
import { MAX_CALCULATOR_WIDTH, useResponsive } from '../utils/responsive';

// ✅ STANDARD IMPORTS (Reliable)
import { CalculatorFAQ, CalculatorForm, CalculatorHeader, CalculatorResults, IncomeSupportModal } from '@/src/features/calculator';
import { PrivacyPolicyLink } from '../components/PrivacyPolicyLink';
import { StepProgressIndicator } from '../components/ui/StepProgressIndicator';

export function CalculatorScreen() {
  const {
    formState,
    setFormState,
    selectedYear,
    setSelectedYear,
    errors,
    results,
    isStale,
    setIsStale,
    addChild,
    removeChild,
    updateChild,
    updateMultiCaseA,
    updateMultiCaseB,
    updateNonParentCarer,

    calculate,
    reset,
    resetTimestamp,
  } = useCalculator();

  // Capture calculator mount time for time_to_complete tracking
  const calculatorStartTime = React.useRef<number>(Date.now()).current;

  const { isDesktop } = useResponsive();
  const params = useLocalSearchParams();
  const router = useRouter();

  // Reset calculator when navigating back with reset=true
  React.useEffect(() => {
    if (params.reset === 'true') {
      reset();
      router.setParams({ reset: undefined });
    }
  }, [params.reset, reset, router]);

  // Handlers
  const handleIncomeAChange = (value: number) => {
    setFormState((prev) => ({ ...prev, incomeA: value }));
    setIsStale(true);
  };
  const handleIncomeBChange = (value: number) => {
    setFormState((prev) => ({ ...prev, incomeB: value }));
    setIsStale(true);
  };

  const handleRelDepAChange = (
    updates: Partial<{ u13: number; plus13: number }>
  ) => {
    setFormState((prev) => ({
      ...prev,
      relDepA: { ...prev.relDepA, ...updates },
    }));
    setIsStale(true);
  };

  const handleRelDepBChange = (
    updates: Partial<{ u13: number; plus13: number }>
  ) => {
    setFormState((prev) => ({
      ...prev,
      relDepB: { ...prev.relDepB, ...updates },
    }));
    setIsStale(true);
  };

  const handleYearChange = (year: typeof selectedYear) => {
    setSelectedYear(year);
    setIsStale(true);
  };

  // =========================================================================
  // Income Support Modal Logic
  // =========================================================================
  const [incomeSupportModalVisible, setIncomeSupportModalVisible] =
    useState(false);
  const [pendingParent, setPendingParent] = useState<'A' | 'B' | null>(null);
  // Track which parents need to be asked (for sequential prompting)
  const [needsPromptB, setNeedsPromptB] = useState(false);
  // Use a ref to store Parent A's response immediately (not subject to async state updates)
  const tempParentAResponseRef = React.useRef(false);

  /**
   * handleCalculate intercepts the calculate button press.
   * If either parent's income is below the SSA threshold, shows
   * the income support modal instead of calculating immediately.
   */
  const handleCalculate = () => {
    const { SSA, MAX_PPS } = getYearConstants(selectedYear);
    const incomeA = formState.incomeA;
    const incomeB = formState.incomeB;

    // Helper to determine if a parent needs the income support prompt
    const needsIncomeSupportPrompt = (
      income: number,
      careKey: 'careAmountA' | 'careAmountB'
    ): boolean => {
      // Check if parent has < 14% care for at least one child
      const hasLessThan14Care = formState.children.some((child) => {
        const carePercent = convertCareToPercentage(
          child[careKey],
          child.carePeriod
        );
        return carePercent < 14;
      });

      // Check if parent has < 35% care for at least one child
      const hasLessThan35Care = formState.children.some((child) => {
        const carePercent = convertCareToPercentage(
          child[careKey],
          child.carePeriod
        );
        return carePercent < 35;
      });

      // Rule 1: Income < SSA AND less than 14% care of at least one child
      const rule1 = income < SSA && hasLessThan14Care;

      // Rule 2: Income < MAX_PPS AND less than 35% care of at least one child
      const rule2 = income < MAX_PPS && hasLessThan35Care;

      return rule1 || rule2;
    };

    const promptA = needsIncomeSupportPrompt(incomeA, 'careAmountA');
    const promptB = needsIncomeSupportPrompt(incomeB, 'careAmountB');

    if (promptA) {
      // Need to ask about Parent A first
      setPendingParent('A');
      setNeedsPromptB(promptB); // Remember if we need to ask about B next
      setIncomeSupportModalVisible(true);
    } else if (promptB) {
      // Only Parent B needs prompting
      setPendingParent('B');
      setNeedsPromptB(false);
      setIncomeSupportModalVisible(true);
    } else {
      // Neither parent needs prompting - proceed with calculation
      runCalculation(false, false);
    }
  };

  /**
   * Actually runs the calculation with the determined support flags.
   */
  const runCalculation = (supportA: boolean, supportB: boolean) => {
    // Update state with support flags
    setFormState((prev) => ({ ...prev, supportA, supportB }));
    // Pass values directly to avoid stale closure issue
    calculate({ supportA, supportB });
  };

  /**
   * Handle "Yes" response from the income support modal.
   */
  const handleIncomeSupportYes = () => {
    if (pendingParent === 'A') {
      if (needsPromptB) {
        // Store Parent A's response in ref (immediate, not async) and ask about Parent B
        tempParentAResponseRef.current = true;
        setNeedsPromptB(false);
        setPendingParent('B');
      } else {
        // Done prompting, run calculation
        // Parent B was not asked, so they don't receive income support
        setIncomeSupportModalVisible(false);
        // Delay clearing pendingParent to prevent flash during modal close animation
        setTimeout(() => setPendingParent(null), 200);
        runCalculation(true, false);
      }
    } else if (pendingParent === 'B') {
      setIncomeSupportModalVisible(false);
      // Delay clearing pendingParent to prevent flash during modal close animation
      setTimeout(() => setPendingParent(null), 200);
      // Use Parent A's stored response from ref, Parent B said Yes
      runCalculation(tempParentAResponseRef.current, true);
    }
  };

  /**
   * Handle "No" response from the income support modal.
   */
  const handleIncomeSupportNo = () => {
    if (pendingParent === 'A') {
      if (needsPromptB) {
        // Store Parent A's response in ref (immediate, not async) and ask about Parent B
        tempParentAResponseRef.current = false;
        setNeedsPromptB(false);
        setPendingParent('B');
      } else {
        // Done prompting, run calculation
        // Parent B was not asked, so they don't receive income support
        setIncomeSupportModalVisible(false);
        // Delay clearing pendingParent to prevent flash during modal close animation
        setTimeout(() => setPendingParent(null), 200);
        runCalculation(false, false);
      }
    } else if (pendingParent === 'B') {
      setIncomeSupportModalVisible(false);
      // Delay clearing pendingParent to prevent flash during modal close animation
      setTimeout(() => setPendingParent(null), 200);
      // Use Parent A's stored response from ref, Parent B said No
      runCalculation(tempParentAResponseRef.current, false);
    }
  };

  const formProps = {
    incomeA: formState.incomeA,
    incomeB: formState.incomeB,
    childrenData: formState.children,
    relDepA: formState.relDepA,
    relDepB: formState.relDepB,
    errors: errors,
    incomePercA: results?.incomePercA,
    incomePercB: results?.incomePercB,
    csiA: results?.CSI_A,
    csiB: results?.CSI_B,
    selectedYear: selectedYear,
    onYearChange: handleYearChange,
    onIncomeAChange: handleIncomeAChange,
    onIncomeBChange: handleIncomeBChange,
    onAddChild: addChild,
    onRemoveChild: removeChild,
    onUpdateChild: updateChild,
    onRelDepAChange: handleRelDepAChange,
    onRelDepBChange: handleRelDepBChange,
    onCalculate: handleCalculate,
    onReset: reset,
    // Multi-case support (Formula 3)
    multiCaseA: formState.multiCaseA,
    multiCaseB: formState.multiCaseB,
    onMultiCaseAChange: updateMultiCaseA,
    onMultiCaseBChange: updateMultiCaseB,
    // Non-parent carer support (Formula 4)
    nonParentCarer: formState.nonParentCarer,
    onNonParentCarerChange: updateNonParentCarer,
    // Care Dispute

    // AI Banner
    aiCourtOrderBanner: (
      <Pressable
        style={({ pressed }) => [
          styles.aiCard,
          pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] }
        ]}
        onPress={() => router.push('/court-order-tool')}
      >
        <View style={styles.aiCardContent}>
          <View style={styles.aiIconContainer}>
            <Feather name="file-text" size={24} color="white" />
          </View>
          <View style={styles.aiTextContainer}>
            <Text style={styles.aiTitle}>Court Order Scanner</Text>
            <Text style={styles.aiDescription}>Upload your court orders to automatically calculate care nights.</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#334155" />
        </View>
      </Pressable>
    ),
  };

  // Calculate progress for children step
  // Only show progress if user has modified the default child or added more children
  const childrenProgress = React.useMemo(() => {
    if (formState.children.length === 0) return 0;
    if (formState.children.length > 1) return 50;

    // Check if the single child is still in default state
    const child = formState.children[0];
    const isDefault =
      child.age === 5 &&
      child.careAmountA === 8 &&
      child.careAmountB === 6 &&
      child.carePeriod === 'fortnight';

    // If exact default values, assume no user interaction yet
    return isDefault ? 0 : 50;
  }, [formState.children]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <CalculatorHeader maxWidth={MAX_CALCULATOR_WIDTH} />


        {/* Progress Indicator */}
        <View style={isDesktop ? styles.progressContainer : styles.progressContainerMobile}>
          <StepProgressIndicator
            currentStep={1}
            compact={!isDesktop}
            step1Progress={
              (formState.incomeA > 0 ? 25 : 0) +
              (formState.incomeB > 0 ? 25 : 0) +
              childrenProgress
            }
          />
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          // Cast to 'any' allows web-only roles without TS errors
          accessibilityRole={'main' as any}
        >
          <View style={isDesktop ? styles.bodyContainer : styles.fullWidth}>
            {/* ✅ FORM RESTORED (No Suspense) */}
            <CalculatorForm {...formProps} isDesktopWeb={isDesktop} />

            {/* FAQ Section */}
            <CalculatorFAQ />

            {/* Privacy Footer */}
            {/* @ts-ignore - Web-only ARIA role */}
            <View style={styles.privacyFooter} accessibilityRole="footer">
              <PrivacyPolicyLink
                linkText="Privacy Policy"
                textStyle={styles.privacyFooterText}
              />
            </View>

            {/* Bottom Padding */}
            <View style={{ height: 140 }} />
          </View>
        </ScrollView>

        {/* Results Overlay - Hide entirely when inputs change (isStale) */}
        {results && !isStale && (
          <View style={styles.resultsOverlay}>
            <View style={isDesktop ? styles.bodyContainer : styles.fullWidth}>
              <CalculatorResults
                results={results}
                formData={formState}
                displayMode="modal"
                resetTimestamp={resetTimestamp}
                calculatorStartTime={calculatorStartTime}
              />
            </View>
          </View>
        )}

        {/* Income Support Modal */}
        <IncomeSupportModal
          visible={incomeSupportModalVisible}
          parentName={pendingParent === 'A' ? 'You' : 'Other Parent'}
          onYes={handleIncomeSupportYes}
          onNo={handleIncomeSupportNo}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardView: {
    flex: 1,
  },
  // SEO: Screen reader only - visually hidden but accessible
  visuallyHidden: {
    position: 'absolute',
    left: -9999,
    width: 1,
    height: 1,
    overflow: 'hidden',
  },
  bodyContainer: {
    width: '100%',
    maxWidth: 850,
    flexDirection: 'column',
    alignItems: 'stretch',
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  resultsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  fullWidth: {
    width: '100%',
  },
  privacyFooter: {
    marginTop: 32,
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 12,
  },
  privacyFooterText: {
    fontSize: 12,
    color: '#64748b', // grey-500
  },
  progressContainer: {
    width: '100%',
    maxWidth: 850,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  progressContainerMobile: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  aiCard: {
    backgroundColor: '#eff6ff', // blue-50
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe', // blue-200
    marginBottom: 16,
    overflow: 'hidden',
  },
  aiCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  aiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563eb', // blue-600
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a', // blue-900
    marginBottom: 4,
  },
  aiDescription: {
    fontSize: 13,
    color: '#334155', // slate-700
    lineHeight: 18,
  },
});
