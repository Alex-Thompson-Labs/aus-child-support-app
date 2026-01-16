/**
 * Enrichment View Component
 *
 * Post-submission data collection screen for additional case factors.
 * Includes optional Liability Estimator for Direct Enquiry users.
 * Uses SpecialCircumstancesWizard for better UX.
 */

import { IncomeSupportModal } from '@/src/features/calculator';
import { SpecialCircumstancesWizard } from '@/src/features/conversion';
import {
    convertCareToPercentage,
    mapCareToCostPercent,
} from '@/src/utils/care-utils';
import {
    getChildCost,
    type Child,
} from '@/src/utils/child-support-calculations';
import { MAR, MAX_PPS, SSA } from '@/src/utils/child-support-constants';
import { isWeb } from '@/src/utils/responsive';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { EnrichmentViewProps } from '../types';
import { useInquiryStyles } from '../useInquiryStyles';

export function EnrichmentView({
  reason,
  onSubmit,
  onSkip,
  isUpdating,
  selectedFactors,
  onFactorToggle,
  incomes,
  childrenCount,
  onLiabilityCalculated,
  onPayerRoleCalculated,
  showSuccess,
}: EnrichmentViewProps) {
  const { containerStyles, enrichmentStyles, buttonStyles, colors, isDark } = useInquiryStyles();

  // Dynamic styles for estimator
  const estimatorStyles = React.useMemo(() => StyleSheet.create({
    estimatorCard: {
      backgroundColor: isDark ? '#1e3a5f' : '#eff6ff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: isDark ? '#3b82f6' : '#bfdbfe',
    },
    estimatorTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#93c5fd' : '#1e40af',
      marginBottom: 8,
    },
    estimatorDescription: {
      fontSize: 14,
      color: isDark ? '#60a5fa' : '#3b82f6',
      marginBottom: 12,
      lineHeight: 20,
    },
    getEstimateButton: {
      backgroundColor: '#3b82f6',
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
    },
    getEstimateText: {
      color: '#ffffff',
      fontSize: 15,
      fontWeight: '600',
    },
    resultContainer: {
      alignItems: 'center',
    },
    payerLabel: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
      color: isDark ? '#93c5fd' : '#1e40af',
    },
    resultAmount: {
      fontSize: 28,
      fontWeight: '700',
      color: isDark ? '#93c5fd' : '#1e40af',
      marginBottom: 12,
    },
    warningBox: {
      backgroundColor: isDark ? '#422006' : '#fef3c7',
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#a16207' : '#fcd34d',
    },
    warningText: {
      fontSize: 13,
      color: isDark ? '#fcd34d' : '#92400e',
      lineHeight: 18,
    },
    warningBold: {
      fontWeight: '700',
    },
    recalculateButton: {
      paddingVertical: 8,
    },
    recalculateText: {
      fontSize: 14,
      color: '#3b82f6',
      fontWeight: '500',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textSecondary,
      marginBottom: 20,
      textAlign: 'center',
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textSecondary,
      marginBottom: 10,
      lineHeight: 22,
    },
    textInput: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.inputText,
    },
    ageToggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    ageToggleLabel: {
      fontSize: 15,
      color: colors.textMuted,
    },
    ageToggleButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    ageButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
      backgroundColor: colors.surfaceSubtle,
      borderWidth: 1,
      borderColor: colors.border,
    },
    ageButtonActive: {
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
    },
    ageButtonText: {
      fontSize: 14,
      color: colors.textMuted,
      fontWeight: '500',
    },
    ageButtonTextActive: {
      color: '#ffffff',
    },
    ageInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    ageInput: {
      width: 50,
      paddingHorizontal: 8,
      paddingVertical: 8,
      fontSize: 16,
      textAlign: 'center',
      color: colors.inputText,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 6,
      backgroundColor: colors.inputBackground,
    },
    ageRangeHint: {
      fontSize: 12,
      color: colors.textMuted,
      fontWeight: '500',
    },
    childRow: {
      marginTop: 12,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderSubtle,
    },
    childLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 8,
    },
    nightsInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    nightsLabel: {
      fontSize: 15,
      color: colors.textMuted,
    },
    nightsInput: {
      width: 70,
      height: 40,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 6,
      paddingHorizontal: 12,
      fontSize: 16,
      textAlign: 'center',
      color: colors.inputText,
    },
    modalButtons: {
      gap: 12,
      marginTop: 8,
    },
    cancelButton: {
      paddingVertical: 14,
      alignItems: 'center',
    },
    cancelButtonText: {
      fontSize: 15,
      color: colors.textMuted,
      fontWeight: '500',
    },
  }), [colors, isDark]);

  // Calculator state
  const [showCalculator, setShowCalculator] = useState(false);

  // Per-child data for the liability estimator
  interface ChildData {
    id: number;
    /** Specific age of the child (0-25) */
    age: number;
    nights: string; // String for TextInput compatibility
  }
  const [children, setChildren] = useState<ChildData[]>([]);
  const [calculatedLiability, setCalculatedLiability] = useState<number | null>(null);
  const [payerLabel, setPayerLabel] = useState<string>('');

  // Income Support Modal Logic
  const [incomeSupportModalVisible, setIncomeSupportModalVisible] = useState(false);
  const [askParentA, setAskParentA] = useState(false);
  const [askParentB, setAskParentB] = useState(false);

  // Initialize children data when modal opens
  const handleOpenCalculator = () => {
    if (childrenCount > 0 && children.length !== childrenCount) {
      setChildren(
        Array.from({ length: childrenCount }, (_, i) => ({
          id: i + 1,
          age: 5, // Default to age 5 (Under 13)
          nights: '7', // Default to 7 nights (equal care)
        }))
      );
    }
    setShowCalculator(true);
  };

  // Update a specific child's data
  const updateChild = (index: number, updates: Partial<ChildData>) => {
    setChildren((prev) =>
      prev.map((child, i) => (i === index ? { ...child, ...updates } : child))
    );
  };

  /**
   * Helper to determine if a parent needs the income support prompt.
   * Uses the same rules as the main calculator.
   */
  const needsIncomeSupportPrompt = (
    income: number,
    careKey: 'careA' | 'careB',
    childrenForCalc: Child[]
  ): boolean => {
    // Check if parent has < 14% care for at least one child
    const hasLessThan14Care = childrenForCalc.some(child => child[careKey] < 14);

    // Check if parent has < 35% care for at least one child
    const hasLessThan35Care = childrenForCalc.some(child => child[careKey] < 35);

    // Rule 1: Income < SSA AND less than 14% care of at least one child
    const rule1 = income < SSA && hasLessThan14Care;

    // Rule 2: Income < MAX_PPS AND less than 35% care of at least one child
    const rule2 = income < MAX_PPS && hasLessThan35Care;

    return rule1 || rule2;
  };

  /**
   * Calculate liability with per-child care percentages.
   * Checks for Income Support prompting before running calculation.
   */
  const handleCalculate = () => {
    if (children.length === 0 || children.some((c) => !c.nights)) return;

    // Build children array with individual care percentages
    const childrenForCalc: Child[] = children.map((child) => {
      const careNights = parseInt(child.nights, 10) || 0;
      const carePercentA = convertCareToPercentage(careNights, 'fortnight');
      const carePercentB = 100 - carePercentA;

      return {
        age: child.age,
        careA: carePercentA,
        careB: carePercentB,
      };
    });

    // Check if either parent needs Income Support prompting
    const promptA = needsIncomeSupportPrompt(incomes.parentA, 'careA', childrenForCalc);
    const promptB = needsIncomeSupportPrompt(incomes.parentB, 'careB', childrenForCalc);

    if (promptA || promptB) {
      // Show modal with both parents (if needed)
      setAskParentA(promptA);
      setAskParentB(promptB);
      setIncomeSupportModalVisible(true);
    } else {
      // Neither parent needs prompting - proceed with calculation
      runCalculation(false, false);
    }
  };

  /**
   * Actually runs the calculation with the determined support flags.
   * Includes MAR (Minimum Annual Rate) logic.
   */
  const runCalculation = (supportA: boolean, supportB: boolean) => {
    // Build children array with individual care percentages
    const childrenForCalc: Child[] = children.map((child) => {
      const careNights = parseInt(child.nights, 10) || 0;
      const carePercentA = convertCareToPercentage(careNights, 'fortnight');
      const carePercentB = 100 - carePercentA;

      return {
        age: child.age,
        careA: carePercentA,
        careB: carePercentB,
      };
    });

    // Calculate incomes
    const adjustedIncomeA = Math.max(0, incomes.parentA - SSA);
    const adjustedIncomeB = Math.max(0, incomes.parentB - SSA);
    const combinedIncome = adjustedIncomeA + adjustedIncomeB;

    // Get cost of children (utility handles mixed ages)
    const { cost } = getChildCost('2026', childrenForCalc, combinedIncome);

    // Calculate income shares
    const incomeShareA = combinedIncome > 0 ? adjustedIncomeA / combinedIncome : 0.5;
    const incomeShareB = combinedIncome > 0 ? adjustedIncomeB / combinedIncome : 0.5;

    // Calculate weighted average cost percentages based on individual care
    const totalChildren = childrenForCalc.length;
    const avgCostPercentA =
      childrenForCalc.reduce((sum, c) => sum + mapCareToCostPercent(c.careA), 0) /
      totalChildren /
      100;
    const avgCostPercentB =
      childrenForCalc.reduce((sum, c) => sum + mapCareToCostPercent(c.careB), 0) /
      totalChildren /
      100;

    // Check MAR (Minimum Annual Rate) eligibility
    // MAR applies if: Income < SSA AND on income support AND < 14% care of ALL children
    const marAppliesA =
      incomes.parentA < SSA && supportA && childrenForCalc.every((c) => c.careA < 14);
    const marAppliesB =
      incomes.parentB < SSA && supportB && childrenForCalc.every((c) => c.careB < 14);

    // Calculate liability (Parent A's perspective)
    let parentALiability = (incomeShareA - avgCostPercentA) * cost;
    let parentBLiability = (incomeShareB - avgCostPercentB) * cost;

    // Apply MAR caps if applicable
    if (marAppliesA && parentALiability > MAR) {
      parentALiability = MAR;
    }
    if (marAppliesB && parentBLiability > MAR) {
      parentBLiability = MAR;
    }

    // Determine who pays whom
    let liability: number;
    if (parentALiability > 0) {
      liability = Math.round(parentALiability);
      setPayerLabel('You pay');
      onPayerRoleCalculated('you');
    } else if (parentALiability < 0) {
      liability = -Math.round(parentBLiability);
      setPayerLabel('Other Parent pays');
      onPayerRoleCalculated('other_parent');
    } else {
      liability = 0;
      setPayerLabel('No payment required');
      onPayerRoleCalculated(null);
    }

    setCalculatedLiability(Math.abs(liability));
    onLiabilityCalculated(Math.abs(liability));
    setShowCalculator(false);
  };

  /**
   * Handle Continue from the income support modal.
   */
  const handleIncomeSupportContinue = (supportA: boolean, supportB: boolean) => {
    setIncomeSupportModalVisible(false);
    runCalculation(supportA, supportB);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle special circumstances change from wizard
  const handleSpecialCircumstancesChange = (reasons: string[]) => {
    // Sync wizard selections with parent component's selectedFactors
    // The wizard returns reason IDs without the 'enrichment_' prefix
    const enrichmentFactorIds = reasons.map(id => 
      id.startsWith('enrichment_') ? id : `enrichment_${id}`
    );
    
    // Update selected factors to match wizard state
    selectedFactors.forEach(factor => {
      if (!enrichmentFactorIds.includes(factor)) {
        onFactorToggle(factor);
      }
    });
    
    enrichmentFactorIds.forEach(factor => {
      if (!selectedFactors.includes(factor)) {
        onFactorToggle(factor);
      }
    });
  };

  // Handle wizard submit - triggers the enrichment submission
  const handleWizardSubmit = () => {
    onSubmit();
  };

  // Success state after enrichment submission
  if (showSuccess) {
    return (
      <SafeAreaView style={containerStyles.container} edges={['top', 'bottom']}>
        <View style={enrichmentStyles.enrichmentContainer}>
          <View style={enrichmentStyles.enrichmentHeader}>
            <Text style={enrichmentStyles.enrichmentTitle}>Case Updated!</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyles.container} edges={['top', 'bottom']}>
      <View style={enrichmentStyles.enrichmentContainer}>
        {/* Header */}
        <View style={enrichmentStyles.enrichmentHeader}>
          <Text style={enrichmentStyles.enrichmentTitle}>Enquiry Sent!</Text>
        </View>

        {/* Subtitle */}
        <Text style={enrichmentStyles.enrichmentSubtitle}>
          (Optional) Help the lawyer prepare by selecting any other factors that
          apply:
        </Text>

        {/* Liability Estimator Card */}
        {childrenCount > 0 && (
          <View style={estimatorStyles.estimatorCard}>
            <Text style={estimatorStyles.estimatorTitle}>Want an Estimate?</Text>
            <Text style={estimatorStyles.estimatorDescription}>
              Get a quick estimate of your child support while you wait for the lawyer.
            </Text>
            {calculatedLiability !== null ? (
              <View style={estimatorStyles.resultContainer}>
                <Text style={estimatorStyles.payerLabel}>
                  {payerLabel}
                </Text>
                <Text style={estimatorStyles.resultAmount}>
                  {formatCurrency(calculatedLiability)}/yr
                </Text>
                <View style={estimatorStyles.warningBox}>
                  <Text style={estimatorStyles.warningText}>
                    <Text style={estimatorStyles.warningBold}>WARNING:</Text> This estimate is a baseline formula. Your lawyer will help you identify legal grounds to adjust this figure based on your specific family circumstances.
                  </Text>
                </View>
                <Pressable
                  style={estimatorStyles.recalculateButton}
                  onPress={handleOpenCalculator}
                >
                  <Text style={estimatorStyles.recalculateText}>Recalculate</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={estimatorStyles.getEstimateButton}
                onPress={handleOpenCalculator}
              >
                <Text style={estimatorStyles.getEstimateText}>Get a Free Estimate</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Special Circumstances Wizard */}
        <View style={{ flex: 1 }}>
          <SpecialCircumstancesWizard
            initialSelectedReasons={selectedFactors.map(id => 
              id.startsWith('enrichment_') ? id.replace('enrichment_', '') : id
            )}
            onSpecialCircumstancesChange={handleSpecialCircumstancesChange}
            onSubmit={handleWizardSubmit}
            isSubmitting={isUpdating}
            isStandalone={false}
          />
        </View>

        {/* Skip Button */}
        <View style={enrichmentStyles.enrichmentButtons}>
          <Pressable
            style={enrichmentStyles.enrichmentSkipButton}
            onPress={onSkip}
            disabled={isUpdating}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Skip and Close"
          >
            <Text style={enrichmentStyles.enrichmentSkipButtonText}>
              Skip & Close
            </Text>
          </Pressable>
        </View>

        {/* Calculator Modal */}
        <Modal
          visible={showCalculator}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCalculator(false)}
        >
          <View style={estimatorStyles.modalOverlay}>
            <View style={estimatorStyles.modalContent}>
              <Text style={estimatorStyles.modalTitle}>Estimate Your Liability</Text>

              <View style={estimatorStyles.inputGroup}>
                <Text style={estimatorStyles.inputLabel}>Care details:</Text>
                {children.map((child, index) => (
                  <View key={child.id} style={estimatorStyles.childRow}>
                    <Text style={estimatorStyles.childLabel}>Child {child.id}</Text>

                    {/* Age Input */}
                    <View style={estimatorStyles.ageToggleRow}>
                      <Text style={estimatorStyles.ageToggleLabel}>Age:</Text>
                      <View style={estimatorStyles.ageInputContainer}>
                        <TextInput
                          style={estimatorStyles.ageInput}
                          value={child.age.toString()}
                          onChangeText={(text) => {
                            const age = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                            updateChild(index, { age: Math.min(25, Math.max(0, age)) });
                          }}
                          keyboardType="number-pad"
                          maxLength={2}
                          accessibilityLabel={`Age of child ${child.id}`}
                        />
                        <Text style={estimatorStyles.ageRangeHint}>
                          {child.age >= 18 ? '(18+)' : child.age >= 13 ? '(13-17)' : '(0-12)'}
                        </Text>
                      </View>
                    </View>

                    {/* Nights Per Fortnight Input */}
                    <View style={estimatorStyles.nightsInputRow}>
                      <Text style={estimatorStyles.nightsLabel}>
                        Your nights per fortnight:
                      </Text>
                      <TextInput
                        style={estimatorStyles.nightsInput}
                        value={child.nights}
                        onChangeText={(text) => updateChild(index, { nights: text })}
                        onFocus={(e) => {
                          // Select all text on focus so typing replaces the value
                          if (isWeb && e.target) {
                            (e.target as unknown as HTMLInputElement).select?.();
                          }
                        }}
                        selectTextOnFocus={true}
                        keyboardType="number-pad"
                        placeholder="0-14"
                        placeholderTextColor="#9ca3af"
                        maxLength={2}
                      />
                    </View>
                  </View>
                ))}
              </View>

              <View style={estimatorStyles.modalButtons}>
                <Pressable
                  style={({ pressed }) => [
                    buttonStyles.button,
                    pressed && buttonStyles.buttonPressed,
                  ]}
                  onPress={handleCalculate}
                >
                  <Text style={buttonStyles.buttonText}>Calculate</Text>
                </Pressable>
                <Pressable
                  style={estimatorStyles.cancelButton}
                  onPress={() => setShowCalculator(false)}
                >
                  <Text style={estimatorStyles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Income Support Modal */}
        <IncomeSupportModal
          visible={incomeSupportModalVisible}
          askParentA={askParentA}
          askParentB={askParentB}
          onContinue={handleIncomeSupportContinue}
          onCancel={() => setIncomeSupportModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}
