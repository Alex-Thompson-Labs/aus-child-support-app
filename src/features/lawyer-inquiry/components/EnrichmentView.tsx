/**
 * Enrichment View Component
 *
 * Post-submission data collection screen for additional case factors.
 * Includes optional Liability Estimator for Direct Enquiry users.
 */

import {
  convertCareToPercentage,
  getChildCost,
  mapCareToCostPercent,
  type Child,
} from '@/src/utils/child-support-calculations';
import { SSA } from '@/src/utils/child-support-constants';
import { isWeb } from '@/src/utils/responsive';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COURT_DATE_ENRICHMENT, getEnrichmentFactors } from '../config';
import {
  buttonStyles,
  containerStyles,
  enrichmentStyles,
} from '../styles';
import type { EnrichmentViewProps } from '../types';

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
  enrichmentCourtDate,
  onEnrichmentCourtDateChange,
  showSuccess,
}: EnrichmentViewProps) {
  // Calculator state
  const [showCalculator, setShowCalculator] = useState(false);
  // Mobile date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  // Validation error state
  const [courtDateError, setCourtDateError] = useState(false);
  const [careDays, setCareDays] = useState('');
  const [childAges, setChildAges] = useState<('Under 13' | '13+')[]>([]);
  const [calculatedLiability, setCalculatedLiability] = useState<number | null>(null);
  const [payerLabel, setPayerLabel] = useState<string>('');

  // Initialize child ages when modal opens
  const handleOpenCalculator = () => {
    if (childrenCount > 0 && childAges.length !== childrenCount) {
      setChildAges(Array(childrenCount).fill('Under 13'));
    }
    setShowCalculator(true);
  };

  // Toggle individual child age
  const toggleChildAge = (index: number) => {
    setChildAges((prev) =>
      prev.map((age, i) => (i === index ? (age === 'Under 13' ? '13+' : 'Under 13') : age))
    );
  };

  // Calculate liability
  const handleCalculate = () => {
    if (!careDays || childAges.length === 0) return;

    const careNights = parseInt(careDays, 10) || 0;
    const carePercentA = convertCareToPercentage(careNights, 'fortnight');
    const carePercentB = 100 - carePercentA;

    // Build children array
    const children: Child[] = childAges.map((age) => ({
      age,
      careA: carePercentA,
      careB: carePercentB,
    }));

    // Calculate incomes
    const adjustedIncomeA = Math.max(0, incomes.parentA - SSA);
    const adjustedIncomeB = Math.max(0, incomes.parentB - SSA);
    const combinedIncome = adjustedIncomeA + adjustedIncomeB;

    // Get cost of children
    const { cost } = getChildCost('2026', children, combinedIncome);

    // Calculate income shares
    const incomeShareA = combinedIncome > 0 ? adjustedIncomeA / combinedIncome : 0.5;
    const incomeShareB = combinedIncome > 0 ? adjustedIncomeB / combinedIncome : 0.5;

    // Calculate cost percentages based on care
    const costPercentA = mapCareToCostPercent(carePercentA) / 100;
    const costPercentB = mapCareToCostPercent(carePercentB) / 100;

    // Calculate liability (Parent A's perspective)
    const parentALiability = (incomeShareA - costPercentA) * cost;
    const parentBLiability = (incomeShareB - costPercentB) * cost;

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

  // Format date for display (DD/MM/YYYY - Australian format)
  const formatDisplayDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Handle date change - clear error when date is entered
  const handleDateChange = (date: Date | null) => {
    onEnrichmentCourtDateChange(date);
    if (date !== null && courtDateError) {
      setCourtDateError(false);
    }
  };

  // Convert Date to YYYY-MM-DD string for HTML input
  const dateToInputValue = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle web date input change
  const handleWebDateInputChange = (event: any) => {
    const inputValue = event.target.value;
    if (!inputValue) {
      handleDateChange(null);
      return;
    }
    const date = new Date(inputValue);
    if (!isNaN(date.getTime())) {
      handleDateChange(date);
    }
  };

  // Handle native date picker change
  const handleNativeDatePickerChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'set' && selectedDate) {
      handleDateChange(selectedDate);
    } else if (event.type === 'dismissed') {
      if (Platform.OS === 'ios') {
        setShowDatePicker(false);
      }
    }
  };

  // Check if court date factor is selected
  const isCourtDateSelected = selectedFactors.includes(COURT_DATE_ENRICHMENT.id);

  // Check if user has provided any enrichment data (estimate or selected factors)
  const hasEnrichmentData = calculatedLiability !== null || selectedFactors.length > 0;

  // Check if form is valid for submission (court date requires a date to be entered)
  const canSubmit = !isCourtDateSelected || enrichmentCourtDate !== null;

  // Handle submit with validation
  const handleSubmitWithValidation = () => {
    if (!canSubmit) {
      setCourtDateError(true);
      if (Platform.OS === 'web') {
        alert('Please fix the errors\n\nSome fields need your attention before submitting.');
      } else {
        Alert.alert(
          'Please fix the errors',
          'Some fields need your attention before submitting.'
        );
      }
      return;
    }
    setCourtDateError(false);
    onSubmit();
  };

  // Success state after enrichment submission
  if (showSuccess) {
    return (
      <SafeAreaView style={containerStyles.container} edges={['top', 'bottom']}>
        <View style={enrichmentStyles.enrichmentContainer}>
          <View style={enrichmentStyles.enrichmentHeader}>
            <Text style={enrichmentStyles.enrichmentIcon}>✓</Text>
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
          <Text style={enrichmentStyles.enrichmentIcon}>✓</Text>
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
            <Text style={estimatorStyles.estimatorTitle}>💡 Want an Estimate?</Text>
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
                    ⚠️ <Text style={estimatorStyles.warningBold}>WARNING:</Text> This does NOT account for hidden income, earning capacity, or special circumstances. Your lawyer will verify this figure with you.
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

        {/* Checkboxes */}
        <ScrollView style={enrichmentStyles.enrichmentFactorsList}>
          {getEnrichmentFactors(reason).map((factor) => {
            const isSelected = selectedFactors.includes(factor.id);
            const isCourtDateFactor = factor.id === COURT_DATE_ENRICHMENT.id;
            return (
              <View key={factor.id}>
                <Pressable
                  style={enrichmentStyles.enrichmentFactorRow}
                  onPress={() => onFactorToggle(factor.id)}
                  disabled={isUpdating}
                  accessible={true}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={factor.label}
                >
                  <View
                    style={[
                      enrichmentStyles.enrichmentCheckbox,
                      isSelected && enrichmentStyles.enrichmentCheckboxChecked,
                    ]}
                  >
                    {isSelected && (
                      <Text style={enrichmentStyles.enrichmentCheckboxCheck}>
                        ✓
                      </Text>
                    )}
                  </View>
                  <Text style={enrichmentStyles.enrichmentFactorLabel}>
                    {factor.label}
                  </Text>
                </Pressable>

                {/* Court Date Picker - shown when court date factor is selected */}
                {isCourtDateFactor && isSelected && (
                  <View style={datePickerStyles.container}>
                    {isWeb ? (
                      // Web: Styled date input
                      <>
                        <input
                          type="date"
                          value={enrichmentCourtDate ? dateToInputValue(enrichmentCourtDate) : ''}
                          onChange={handleWebDateInputChange}
                          disabled={isUpdating}
                          style={{
                            backgroundColor: '#ffffff',
                            color: enrichmentCourtDate ? '#1a202c' : '#9ca3af',
                            borderRadius: '8px',
                            padding: '12px',
                            border: `1.5px solid ${courtDateError ? '#ef4444' : '#e2e8f0'}`,
                            fontSize: '16px',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                            width: '100%',
                            boxSizing: 'border-box',
                            opacity: isUpdating ? 0.6 : 1,
                            cursor: isUpdating ? 'not-allowed' : 'pointer',
                            minHeight: '48px',
                          }}
                          aria-label="Select court date"
                        />
                        {courtDateError && (
                          <Text style={datePickerStyles.errorText}>Court date is required</Text>
                        )}
                      </>
                    ) : (
                      // Mobile: Pressable that opens native picker
                      <>
                        <Pressable
                          style={[
                            datePickerStyles.input,
                            courtDateError && datePickerStyles.inputError,
                          ]}
                          onPress={() => !isUpdating && setShowDatePicker(true)}
                          disabled={isUpdating}
                        >
                          <Text
                            style={[
                              datePickerStyles.inputText,
                              !enrichmentCourtDate && datePickerStyles.inputPlaceholder,
                            ]}
                          >
                            {enrichmentCourtDate
                              ? formatDisplayDate(enrichmentCourtDate)
                              : 'Select date'}
                          </Text>
                        </Pressable>
                        {courtDateError && (
                          <Text style={datePickerStyles.errorText}>Court date is required</Text>
                        )}
                        {showDatePicker && (
                          <DateTimePicker
                            value={enrichmentCourtDate || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleNativeDatePickerChange}
                            minimumDate={new Date()}
                            maximumDate={new Date(2099, 11, 31)}
                          />
                        )}
                      </>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Buttons */}
        <View style={enrichmentStyles.enrichmentButtons}>
          {hasEnrichmentData && (
            <Pressable
              style={({ pressed }) => [
                buttonStyles.button,
                pressed && buttonStyles.buttonPressed,
                isUpdating && buttonStyles.buttonDisabled,
              ]}
              onPress={handleSubmitWithValidation}
              disabled={isUpdating}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Update Case File"
            >
              {isUpdating ? (
                <View style={buttonStyles.buttonContent}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={buttonStyles.buttonText}>Updating...</Text>
                </View>
              ) : (
                <Text style={buttonStyles.buttonText}>Update Case File</Text>
              )}
            </Pressable>
          )}

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
                <Text style={estimatorStyles.inputLabel}>
                  How many nights per fortnight do you have the children?
                </Text>
                <TextInput
                  style={estimatorStyles.textInput}
                  value={careDays}
                  onChangeText={setCareDays}
                  keyboardType="number-pad"
                  placeholder="e.g., 7"
                  placeholderTextColor="#9ca3af"
                  maxLength={2}
                />
              </View>

              <View style={estimatorStyles.inputGroup}>
                <Text style={estimatorStyles.inputLabel}>
                  Ages of children:
                </Text>
                {childAges.map((age, index) => (
                  <Pressable
                    key={index}
                    style={estimatorStyles.ageToggleRow}
                    onPress={() => toggleChildAge(index)}
                  >
                    <Text style={estimatorStyles.ageToggleLabel}>
                      Child {index + 1}:
                    </Text>
                    <View style={estimatorStyles.ageToggleButtons}>
                      <Pressable
                        style={[
                          estimatorStyles.ageButton,
                          age === 'Under 13' && estimatorStyles.ageButtonActive,
                        ]}
                        onPress={() => setChildAges((prev) =>
                          prev.map((a, i) => (i === index ? 'Under 13' : a))
                        )}
                      >
                        <Text style={[
                          estimatorStyles.ageButtonText,
                          age === 'Under 13' && estimatorStyles.ageButtonTextActive,
                        ]}>Under 13</Text>
                      </Pressable>
                      <Pressable
                        style={[
                          estimatorStyles.ageButton,
                          age === '13+' && estimatorStyles.ageButtonActive,
                        ]}
                        onPress={() => setChildAges((prev) =>
                          prev.map((a, i) => (i === index ? '13+' : a))
                        )}
                      >
                        <Text style={[
                          estimatorStyles.ageButtonText,
                          age === '13+' && estimatorStyles.ageButtonTextActive,
                        ]}>13+</Text>
                      </Pressable>
                    </View>
                  </Pressable>
                ))}
              </View>

              <View style={estimatorStyles.modalButtons}>
                <Pressable
                  style={({ pressed }) => [
                    buttonStyles.button,
                    pressed && buttonStyles.buttonPressed,
                  ]}
                  onPress={() => {
                    handleCalculate();
                    setShowCalculator(false);
                  }}
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
      </View>
    </SafeAreaView>
  );
}

// Styles for the estimator feature
const estimatorStyles = StyleSheet.create({
  estimatorCard: {
    backgroundColor: '#eff6ff', // blue-50
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe', // blue-200
  },
  estimatorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af', // blue-800
    marginBottom: 8,
  },
  estimatorDescription: {
    fontSize: 14,
    color: '#3b82f6', // blue-500
    marginBottom: 12,
    lineHeight: 20,
  },
  getEstimateButton: {
    backgroundColor: '#3b82f6', // blue-500
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
    color: '#1e40af', // blue-800
  },
  resultAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e40af', // blue-800
    marginBottom: 12,
  },
  warningBox: {
    backgroundColor: '#fef3c7', // amber-100
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fcd34d', // amber-300
  },
  warningText: {
    fontSize: 13,
    color: '#92400e', // amber-800
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
    color: '#3b82f6', // blue-500
    fontWeight: '500',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151', // grey-700
    marginBottom: 10,
    lineHeight: 22,
  },
  textInput: {
    backgroundColor: '#f9fafb', // grey-50
    borderWidth: 1,
    borderColor: '#d1d5db', // grey-300
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a202c',
  },
  ageToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  ageToggleLabel: {
    fontSize: 15,
    color: '#4b5563', // grey-600
  },
  ageToggleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  ageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6', // grey-100
    borderWidth: 1,
    borderColor: '#d1d5db', // grey-300
  },
  ageButtonActive: {
    backgroundColor: '#3b82f6', // blue-500
    borderColor: '#3b82f6',
  },
  ageButtonText: {
    fontSize: 14,
    color: '#4b5563', // grey-600
    fontWeight: '500',
  },
  ageButtonTextActive: {
    color: '#ffffff',
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
    color: '#6b7280', // grey-500
    fontWeight: '500',
  },
});

// Styles for the date picker
const datePickerStyles = StyleSheet.create({
  container: {
    marginLeft: 36, // Align with checkbox label
    marginTop: 8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    minHeight: 48,
  },
  inputError: {
    borderColor: '#ef4444', // red-500
  },
  inputText: {
    fontSize: 16,
    color: '#1a202c',
  },
  inputPlaceholder: {
    color: '#9ca3af', // grey-400 - lighter placeholder
  },
  errorText: {
    color: '#ef4444', // red-500
    fontSize: 14,
    marginTop: 4,
  },
});
