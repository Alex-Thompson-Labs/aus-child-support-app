/**
 * Financial Section Component
 *
 * Displays calculation summary (standard mode) or manual inputs (direct mode),
 * plus financial tags and court date picker when applicable.
 */

import DatePickerField from '@/src/components/ui/DatePickerField';
import { isWeb } from '@/src/utils/responsive';
import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { FINANCIAL_TAG_OPTIONS } from '../config';
import { financialStyles, formStyles } from '../styles';
import type { FinancialSectionProps } from '../types';

/**
 * Format currency for display
 */
function formatCurrency(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return '$0';
  return `$${Math.round(num).toLocaleString()}`;
}

export function FinancialSection({
  isDirectMode,
  liability,
  incomeA,
  incomeB,
  children,
  careData,
  manualIncomeA,
  manualIncomeB,
  manualChildren,
  setManualIncomeA,
  setManualIncomeB,
  setManualChildren,
  shouldShowFinancialTags,
  financialTags,
  setFinancialTags,
  specialCircumstances,
  shouldShowCourtDate,
  courtDate,
  onCourtDateChange,
  errors,
  touched,
  isSubmitting,
  onTextChange,
  onBlur,
}: FinancialSectionProps) {
  return (
    <>
      {/* Section Header */}
      <View style={financialStyles.financialSectionHeader}>
        <Text style={financialStyles.lockIcon}>🔒</Text>
        <Text style={financialStyles.financialSectionHeaderText}>
          Case Eligibility Check (Confidential)
        </Text>
      </View>

      {/* Calculation Summary OR Direct Mode Manual Inputs */}
      {!isDirectMode ? (
        // Standard Mode: Show read-only Calculation Summary
        <View style={financialStyles.summaryCard}>
          <Text style={financialStyles.summaryTitle}>
            Your Calculation Summary
          </Text>
          <View style={financialStyles.summaryRow}>
            <Text style={financialStyles.summaryLabel}>Annual Liability:</Text>
            <Text style={financialStyles.summaryAmount}>
              {formatCurrency(liability)}/year
            </Text>
          </View>
          <View style={financialStyles.summaryRow}>
            <Text style={financialStyles.summaryLabel}>Your Income:</Text>
            <Text style={financialStyles.summaryValue}>
              {formatCurrency(incomeA)}
            </Text>
          </View>
          <View style={financialStyles.summaryRow}>
            <Text style={financialStyles.summaryLabel}>
              Other Parent&apos;s Income:
            </Text>
            <Text style={financialStyles.summaryValue}>
              {formatCurrency(incomeB)}
            </Text>
          </View>
          <View style={financialStyles.summaryRow}>
            <Text style={financialStyles.summaryLabel}>
              Number of Children:
            </Text>
            <Text style={financialStyles.summaryValue}>{children}</Text>
          </View>

          {/* Care Arrangement */}
          {careData.length > 0 && (
            <>
              <View style={financialStyles.summarySeparator} />
              <Text style={financialStyles.summarySubtitle}>
                Care Arrangement
              </Text>
              {careData.map((child, idx) => (
                <View key={idx} style={financialStyles.careRow}>
                  <Text style={financialStyles.careChildLabel}>
                    Child {idx + 1}:
                  </Text>
                  <View style={financialStyles.carePercentages}>
                    <Text style={financialStyles.careValue}>
                      You: {child.careA.toFixed(0)}%
                    </Text>
                    <Text style={financialStyles.careSeparator}>•</Text>
                    <Text style={financialStyles.careValue}>
                      Other Parent: {child.careB.toFixed(0)}%
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      ) : (
        // Direct Mode: Show manual income inputs
        <View style={financialStyles.directModeCard}>
          <Text style={financialStyles.summaryTitle}>
            Your Financial Information
          </Text>
          <Text style={financialStyles.directModeSubtitle}>
            Please provide approximate income details to help the lawyer
            understand your situation.
          </Text>

          {/* Your Income Input */}
          <View style={formStyles.inputContainer}>
            <Text style={formStyles.fieldLabel}>
              Your Approximate Annual Income *
            </Text>
            <TextInput
              style={[
                formStyles.input,
                touched.manualIncomeA &&
                  errors.manualIncomeA &&
                  formStyles.inputError,
              ]}
              placeholder="e.g. 75000"
              placeholderTextColor="#64748b"
              value={manualIncomeA}
              onChangeText={(text) => {
                const val = text.replace(/[^0-9]/g, '');
                onTextChange('manualIncomeA', val, setManualIncomeA);
              }}
              onBlur={() => onBlur('manualIncomeA')}
              keyboardType="numeric"
              returnKeyType="next"
              editable={!isSubmitting}
              accessibilityLabel="Your approximate annual income"
              accessibilityHint="Enter your annual income before tax"
              {...(isWeb && { inputMode: 'numeric' as any })}
            />
            {touched.manualIncomeA && errors.manualIncomeA && (
              <Text style={formStyles.errorText}>{errors.manualIncomeA}</Text>
            )}
          </View>

          {/* Other Parent's Income Input */}
          <View style={formStyles.inputContainer}>
            <Text style={formStyles.fieldLabel}>
              Other Parent&apos;s Approximate Income *
            </Text>
            <TextInput
              style={[
                formStyles.input,
                touched.manualIncomeB &&
                  errors.manualIncomeB &&
                  formStyles.inputError,
              ]}
              placeholder="e.g. 60000"
              placeholderTextColor="#64748b"
              value={manualIncomeB}
              onChangeText={(text) => {
                const val = text.replace(/[^0-9]/g, '');
                onTextChange('manualIncomeB', val, setManualIncomeB);
              }}
              onBlur={() => onBlur('manualIncomeB')}
              keyboardType="numeric"
              returnKeyType="next"
              editable={!isSubmitting}
              accessibilityLabel="Other parent's approximate annual income"
              accessibilityHint="Enter the other parent's estimated annual income"
              {...(isWeb && { inputMode: 'numeric' as any })}
            />
            {touched.manualIncomeB && errors.manualIncomeB && (
              <Text style={formStyles.errorText}>{errors.manualIncomeB}</Text>
            )}
          </View>

          {/* Number of Children Input */}
          <View style={formStyles.inputContainer}>
            <Text style={formStyles.fieldLabel}>Number of Children *</Text>
            <TextInput
              style={[
                formStyles.input,
                touched.manualChildren &&
                  errors.manualChildren &&
                  formStyles.inputError,
              ]}
              placeholder="e.g. 2"
              placeholderTextColor="#64748b"
              value={manualChildren}
              onChangeText={(text) => {
                const val = text.replace(/[^0-9]/g, '');
                onTextChange('manualChildren', val, setManualChildren);
              }}
              onBlur={() => onBlur('manualChildren')}
              keyboardType="numeric"
              returnKeyType="next"
              maxLength={2}
              editable={!isSubmitting}
              accessibilityLabel="Number of children"
              accessibilityHint="Enter the number of children involved"
              {...(isWeb && { inputMode: 'numeric' as any })}
            />
            {touched.manualChildren && errors.manualChildren && (
              <Text style={formStyles.errorText}>{errors.manualChildren}</Text>
            )}
          </View>
        </View>
      )}

      {/* Financial Tags - Conditional */}
      {shouldShowFinancialTags && (
        <View style={financialStyles.financialSection}>
          <Text style={formStyles.fieldLabel}>
            What type of financial issue? (Select all that apply){' '}
            {specialCircumstances?.includes('income_resources_not_reflected') &&
              '*'}
          </Text>
          <View style={financialStyles.chipsContainer}>
            {FINANCIAL_TAG_OPTIONS.map((tag) => {
              const isSelected = financialTags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  style={[
                    financialStyles.chip,
                    isSelected && financialStyles.chipActive,
                    touched.financialTags &&
                      errors.financialTags &&
                      !isSelected &&
                      financialStyles.chipError,
                  ]}
                  onPress={() => {
                    let newTags;
                    if (isSelected) {
                      newTags = financialTags.filter((t) => t !== tag);
                    } else {
                      newTags = [...financialTags, tag];
                    }
                    setFinancialTags(newTags);
                  }}
                  disabled={isSubmitting}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${tag} financial issue`}
                >
                  <Text
                    style={[
                      financialStyles.chipText,
                      isSelected && financialStyles.chipTextActive,
                    ]}
                  >
                    {tag}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {touched.financialTags && errors.financialTags && (
            <Text style={formStyles.errorText}>{errors.financialTags}</Text>
          )}
        </View>
      )}

      {/* Court Date Input - Conditional */}
      {shouldShowCourtDate && (
        <DatePickerField
          label="When is your court date? *"
          value={courtDate}
          onChange={onCourtDateChange}
          error={touched.courtDate ? errors.courtDate : undefined}
          disabled={isSubmitting}
        />
      )}
    </>
  );
}
