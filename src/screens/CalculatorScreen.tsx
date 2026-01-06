import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculator } from '../hooks/useCalculator';
import { convertCareToPercentage } from '../utils/child-support-calculations';
import { getYearConstants } from '../utils/child-support-constants';
import { useResponsive } from '../utils/responsive';
import { shadowPresets } from '../utils/shadow-styles';

// ✅ STANDARD IMPORTS (Reliable)
import { CalculatorFAQ } from '../components/calculator/CalculatorFAQ';
import { CalculatorForm } from '../components/CalculatorForm';
import { CalculatorResults } from '../components/CalculatorResults';
import { IncomeSupportModal } from '../components/IncomeSupportModal';
import { PrivacyPolicyLink } from '../components/PrivacyPolicyLink';

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
    calculate,
    reset,
    resetTimestamp,
  } = useCalculator();

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
  const [incomeSupportModalVisible, setIncomeSupportModalVisible] = useState(false);
  const [pendingParent, setPendingParent] = useState<'A' | 'B' | null>(null);
  const [incomeSupportA, setIncomeSupportA] = useState(false);
  const [incomeSupportB, setIncomeSupportB] = useState(false);
  // Track which parents need to be asked (for sequential prompting)
  const [needsPromptB, setNeedsPromptB] = useState(false);
  // Use a ref to store Parent A's response immediately (not subject to async state updates)
  const tempParentAResponseRef = React.useRef(false);
  // Track if we should auto-calculate after support values are set
  const shouldAutoCalculateRef = useRef(false);

  // Auto-calculate when support values change (triggered by runCalculation)
  useEffect(() => {
    if (shouldAutoCalculateRef.current) {
      shouldAutoCalculateRef.current = false;
      calculate();
    }
  }, [formState.supportA, formState.supportB, calculate]);

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
      const hasLessThan14Care = formState.children.some(child => {
        const carePercent = convertCareToPercentage(child[careKey], child.carePeriod);
        return carePercent < 14;
      });

      // Check if parent has < 35% care for at least one child
      const hasLessThan35Care = formState.children.some(child => {
        const carePercent = convertCareToPercentage(child[careKey], child.carePeriod);
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
    // Set flag to trigger calculation in useEffect after state updates
    shouldAutoCalculateRef.current = true;
    // Update state - this will trigger the useEffect above
    setFormState((prev) => ({ ...prev, supportA, supportB }));
  };

  /**
   * Handle "Yes" response from the income support modal.
   */
  const handleIncomeSupportYes = () => {
    if (pendingParent === 'A') {
      setIncomeSupportA(true);
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
      setIncomeSupportB(true);
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
      setIncomeSupportA(false);
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
      setIncomeSupportB(false);
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
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        {/* @ts-ignore - Web-only ARIA role */}
        <View style={styles.header} accessibilityRole="banner">
          <View
            style={
              isDesktop ? styles.headerContainer : styles.mobileHeaderRow
            }
          >
            <Ionicons
              name="people"
              size={isDesktop ? 32 : 24}
              color="#2563eb"
            />
            <Text
              style={[styles.title, isDesktop && styles.titleDesktop]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              accessibilityRole="header"
              aria-level="1"
            >
              Child Support Calculator
            </Text>

            <Pressable
              style={styles.blogButton}
              accessibilityRole="button"
              onPress={() => Linking.openURL('https://blog.auschildsupport.com')}
            >
              <Text style={styles.blogButtonText}>Blog</Text>
            </Pressable>
          </View>
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
            <View style={styles.privacyFooter}>
              <PrivacyPolicyLink
                linkText="Privacy Policy"
                textStyle={styles.privacyFooterText}
              />
            </View>

            {/* Bottom Padding */}
            <View style={{ height: 140 }} />
          </View>
        </ScrollView>

        {/* Results Overlay */}
        {results && (
          <View style={styles.resultsOverlay}>
            <View
              style={isDesktop ? styles.bodyContainer : styles.fullWidth}
            >
              <CalculatorResults
                results={results}
                formData={formState}
                displayMode="modal"
                isStale={isStale}
                resetTimestamp={resetTimestamp}
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
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
    width: '100%',
    alignItems: 'center',
  },
  mobileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    gap: 8,
  },
  headerContainer: {
    width: '100%',
    maxWidth: 850,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 16,
  },
  bodyContainer: {
    width: '100%',
    maxWidth: 850,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
    textAlign: 'center',
  },
  titleDesktop: {
    fontSize: 28,
    letterSpacing: -0.5,
    marginLeft: 10,
  },
  blogButton: {
    backgroundColor: '#0056b3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexShrink: 0,
    ...shadowPresets.small,
  },
  blogButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
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
});
