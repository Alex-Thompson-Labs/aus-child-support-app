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
import { isComplexityTrap } from '../utils/calculator';
import { convertCareToPercentage } from '../utils/care-utils';
import { getYearConstants } from '../utils/child-support-constants';
import { MAX_CALCULATOR_WIDTH, useResponsive } from '../utils/responsive';

// ✅ STANDARD IMPORTS (Reliable)
import { CalculatorFAQ, CalculatorForm, CalculatorHeader, CalculatorResults, IncomeSupportModal } from '@/src/features/calculator';
import { Footer } from '../components/ui/Footer';
import { NPCCareValidationModal } from '../components/ui/NPCCareValidationModal';
import { SEOContentSection } from '../components/ui/SEOContentSection';
import { SEOHeroSection } from '../components/ui/SEOHeroSection';
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

  // Preload PDF dependencies when component mounts (non-blocking)
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      // Lazy load preload utility and execute
      import('../utils/preload').then(({ preloadPDFDependencies }) => {
        preloadPDFDependencies();
      }).catch(() => {
        // Fail silently - preloading is non-critical
      });
    }
  }, []);

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
  // Income Support Modal Logic (Blocking step)
  // =========================================================================
  const [incomeSupportModalVisible, setIncomeSupportModalVisible] =
    useState(false);
  const [askParentA, setAskParentA] = useState(false);
  const [askParentB, setAskParentB] = useState(false);

  // =========================================================================
  // NPC Care Validation Modal Logic (Blocking step)
  // =========================================================================
  const [npcCareModalVisible, setNpcCareModalVisible] = useState(false);
  const [npcCarePercentage, setNpcCarePercentage] = useState(0);

  /**
   * Helper to determine if a parent needs the income support prompt
   */
  const needsIncomeSupportPrompt = (
    income: number,
    careKey: 'careAmountA' | 'careAmountB'
  ): boolean => {
    const { SSA, MAX_PPS } = getYearConstants(selectedYear);

    // Skip prompt for Parent B if either parent is deceased (Formula 6)
    if (careKey === 'careAmountB' && formState.nonParentCarer?.hasDeceasedParent) {
      return false;
    }

    // Skip prompt for Parent B if non-reciprocating jurisdiction (Formula 5)
    if (careKey === 'careAmountB' && formState.nonParentCarer?.isNonReciprocating) {
      return false;
    }

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

  /**
   * handleCalculate checks if income support modal needs to be shown BEFORE calculating.
   * This is a BLOCKING step - results will not show until modal is completed or dismissed.
   */
  const handleCalculate = () => {
    // First, check NPC care validation if NPC is enabled
    if (formState.nonParentCarer?.enabled) {
      // Check if any child has NPC care < 35%
      const hasInvalidNPCCare = formState.children.some((child) => {
        const npcCarePercent = convertCareToPercentage(
          child.careAmountNPC || 0,
          child.carePeriod
        );
        return npcCarePercent > 0 && npcCarePercent < 35;
      });

      if (hasInvalidNPCCare) {
        // Calculate the NPC care percentage for display
        const firstInvalidChild = formState.children.find((child) => {
          const npcCarePercent = convertCareToPercentage(
            child.careAmountNPC || 0,
            child.carePeriod
          );
          return npcCarePercent > 0 && npcCarePercent < 35;
        });

        if (firstInvalidChild) {
          const carePercent = convertCareToPercentage(
            firstInvalidChild.careAmountNPC || 0,
            firstInvalidChild.carePeriod
          );
          setNpcCarePercentage(carePercent);
          setNpcCareModalVisible(true);
          return; // Block calculation
        }
      }
    }

    // Then check income support prompts
    const promptA = needsIncomeSupportPrompt(formState.incomeA, 'careAmountA');
    const promptB = needsIncomeSupportPrompt(formState.incomeB, 'careAmountB');

    if (promptA || promptB) {
      // Need to ask about income support - show modal BEFORE calculating
      setAskParentA(promptA);
      setAskParentB(promptB);
      setIncomeSupportModalVisible(true);
    } else {
      // No income support needed - calculate immediately
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
   * Handle Continue from the income support modal.
   * This proceeds to show results with the selected support flags.
   */
  const handleIncomeSupportContinue = (supportA: boolean, supportB: boolean) => {
    setIncomeSupportModalVisible(false);
    runCalculation(supportA, supportB);
  };

  /**
   * Handle Cancel/Dismiss from the income support modal.
   * This proceeds to show results without income support applied.
   */
  const handleIncomeSupportCancel = () => {
    setIncomeSupportModalVisible(false);
    runCalculation(false, false);
  };

  // For form props, only show income percentages for standard calculation results
  const standardResults = results && !isComplexityTrap(results) ? results : null;

  // Ref for scrolling to calculator form
  const calculatorFormRef = React.useRef<View>(null);

  const handleScrollToCalculator = () => {
    if (Platform.OS === 'web' && calculatorFormRef.current) {
      // @ts-ignore - Web-only scrollIntoView
      calculatorFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const formProps = {
    incomeA: formState.incomeA,
    incomeB: formState.incomeB,
    childrenData: formState.children,
    relDepA: formState.relDepA,
    relDepB: formState.relDepB,
    errors: errors,
    incomePercA: standardResults?.incomePercA,
    incomePercB: standardResults?.incomePercB,
    csiA: standardResults?.CSI_A,
    csiB: standardResults?.CSI_B,
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
          styles.aiLinkButton,
          pressed && { opacity: 0.7 }
        ]}
        onPress={() => router.push('/court-order-tool')}
        accessibilityRole="button"
        accessibilityLabel="Import care arrangements from court order"
      >
        <Feather name="file-text" size={16} color="#2563eb" />
        <Text style={styles.aiLinkText}>Import from Court Order</Text>
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
            {/* SEO Hero Section - Above the fold */}
            <SEOHeroSection onCalculatePress={handleScrollToCalculator} />

            {/* ✅ FORM RESTORED (No Suspense) */}
            <View ref={calculatorFormRef}>
              <CalculatorForm {...formProps} isDesktopWeb={isDesktop} />
            </View>

            {/* SEO Content Section - Educational content */}
            <SEOContentSection />

            {/* FAQ Section */}
            <CalculatorFAQ />

            {/* Footer */}
            <Footer />
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
                selectedYear={parseInt(selectedYear, 10)}
                hasDeceasedParent={formState.nonParentCarer?.hasDeceasedParent ?? false}
              />
            </View>
          </View>
        )}

        {/* Income Support Modal */}
        <IncomeSupportModal
          visible={incomeSupportModalVisible}
          askParentA={askParentA}
          askParentB={askParentB}
          onContinue={handleIncomeSupportContinue}
          onCancel={handleIncomeSupportCancel}
        />

        {/* NPC Care Validation Modal */}
        <NPCCareValidationModal
          visible={npcCareModalVisible}
          onClose={() => setNpcCareModalVisible(false)}
          npcCarePercentage={npcCarePercentage}
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
  progressContainer: {
    width: '100%',
    maxWidth: 850,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginHorizontal: 16,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.08)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  progressContainerMobile: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginHorizontal: 16,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.08)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  aiLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    // Provide a large touch target but keep visual footprint small
    paddingVertical: 8,
  },
  aiLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb', // blue-600
  },
});
