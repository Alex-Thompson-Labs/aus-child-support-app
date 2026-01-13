/**
 * Financial Section Component
 *
 * Displays calculation summary (standard mode) or manual inputs (direct mode),
 * plus financial tags and court date picker when applicable.
 */

import DatePickerField from '@/src/components/ui/DatePickerField';
import { searchCountries } from '@/src/utils/all-countries';
import { isWeb } from '@/src/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
    LayoutAnimation,
    Platform,
    Pressable,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import { FINANCIAL_TAG_OPTIONS } from '../config';
import type { FinancialSectionProps } from '../types';
import { useInquiryStyles } from '../useInquiryStyles';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Format currency for display
 */
function formatCurrencyDisplay(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return '$0';
  return `$${Math.round(num).toLocaleString()}`;
}

export function FinancialSection({
  isDirectMode,
  liability,
  payer,
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
  // PSI props
  shouldShowPsiFields,
  separationDate,
  onSeparationDateChange,
  cohabited6Months,
  onCohabited6MonthsChange,
  showPsiWarning,
  // International props
  shouldShowInternationalFields,
  otherParentCountry,
  onOtherParentCountryChange,
  internationalWarning,
  // Refs for keyboard navigation (direct mode only)
  manualIncomeARef,
  manualIncomeBRef,
  manualChildrenRef,
  // Common
  errors,
  touched,
  isSubmitting,
  onTextChange,
  onBlur,
}: FinancialSectionProps) {
  const { financialStyles, formStyles, colors } = useInquiryStyles();
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    return searchCountries(countrySearch).slice(0, 10); // Limit to 10 results
  }, [countrySearch]);

  const toggleSummary = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSummaryOpen(!isSummaryOpen);
  };

  return (
    <>
      {/* Section Header - Collapsible */}
      <TouchableOpacity
        onPress={toggleSummary}
        style={financialStyles.financialSectionHeader}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded: isSummaryOpen }}
        accessibilityLabel="Case Eligibility Check section, tap to expand or collapse"
      >
        <View style={financialStyles.secureBadge}>
          <Text style={financialStyles.secureBadgeText}>SECURE</Text>
        </View>
        <Text style={financialStyles.financialSectionHeaderText}>
          Case Eligibility Check
        </Text>
        <Ionicons
          name={isSummaryOpen ? 'chevron-down' : 'chevron-forward'}
          size={16}
          color={colors.primaryDark}
          style={{ marginLeft: 'auto' }}
        />
      </TouchableOpacity>

      {/* Calculation Summary OR Direct Mode Manual Inputs - Collapsible */}
      {isSummaryOpen && (!isDirectMode ? (
        // Standard Mode: Show read-only Calculation Summary
        <View
          style={financialStyles.summaryCard}
          accessibilityRole={'group' as any}
          accessibilityLabel="Calculation Summary"
        >
          <Text style={financialStyles.summaryTitle}>
            Your Calculation Summary
          </Text>
          <View style={financialStyles.summaryRow}>
            <Text style={financialStyles.summaryLabelBold}>
              {payer === 'Parent A' ? 'You Pay:' : payer === 'Parent B' ? 'You Receive:' : 'Annual Liability:'}
            </Text>
            <Text style={financialStyles.summaryAmount}>
              {formatCurrencyDisplay(liability)}/year
            </Text>
          </View>
          <View style={financialStyles.summaryRow}>
            <Text style={financialStyles.summaryLabel}>Your Income:</Text>
            <Text style={financialStyles.summaryValue}>
              {formatCurrencyDisplay(incomeA)}
            </Text>
          </View>
          <View style={financialStyles.summaryRow}>
            <Text style={financialStyles.summaryLabel}>
              Other Parent&apos;s Income:
            </Text>
            <Text style={financialStyles.summaryValue}>
              {formatCurrencyDisplay(incomeB)}
            </Text>
          </View>

          {/* Care Arrangement */}
          {careData.length > 0 && (() => {
            // Group children by identical care percentages
            const groupedCare: { careA: number; careB: number; childIndices: number[] }[] = [];
            careData.forEach((child, idx) => {
              const existingGroup = groupedCare.find(
                (g) => g.careA === child.careA && g.careB === child.careB
              );
              if (existingGroup) {
                existingGroup.childIndices.push(idx + 1);
              } else {
                groupedCare.push({
                  careA: child.careA,
                  careB: child.careB,
                  childIndices: [idx + 1],
                });
              }
            });

            const totalChildren = careData.length;
            const childCountLabel = totalChildren === 1 ? '1 child' : `${totalChildren} children`;

            // Format child label based on grouping
            const formatChildLabel = (indices: number[]): string | null => {
              // Single child total - no label needed
              if (totalChildren === 1) {
                return null;
              }
              // All children have same care
              if (indices.length === totalChildren) {
                return 'All children:';
              }
              // Subset of children
              if (indices.length === 1) {
                return `Child ${indices[0]}:`;
              }
              return `Children ${indices.join(', ')}:`;
            };

            return (
              <>
                <View style={financialStyles.summarySeparator} />
                <Text style={financialStyles.summarySubtitle}>
                  Care Arrangement – {childCountLabel}
                </Text>
                {groupedCare.map((group, idx) => {
                  const label = formatChildLabel(group.childIndices);
                  return (
                    <View key={idx} style={financialStyles.careRow}>
                      {label && (
                        <Text style={financialStyles.careChildLabel}>
                          {label}
                        </Text>
                      )}
                      <View style={financialStyles.carePercentages}>
                        <Text style={financialStyles.careValue}>
                          You: {group.careA.toFixed(0)}%
                        </Text>
                        <Text style={financialStyles.careSeparator}>•</Text>
                        <Text style={financialStyles.careValue}>
                          Other Parent: {group.careB.toFixed(0)}%
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </>
            );
          })()}
        </View>
      ) : (
        // Direct Mode: Show manual income inputs
        <View
          style={financialStyles.directModeCard}
          accessibilityRole={'group' as any}
          accessibilityLabel="Financial Information"
        >
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
              ref={manualIncomeARef}
              style={[
                formStyles.input,
                touched.manualIncomeA &&
                errors.manualIncomeA &&
                formStyles.inputError,
              ]}
              placeholder="e.g. 75000"
              placeholderTextColor={colors.textMuted}
              value={manualIncomeA}
              onChangeText={(text) => {
                const val = text.replace(/[^0-9]/g, '');
                onTextChange('manualIncomeA', val, setManualIncomeA);
              }}
              onBlur={() => onBlur('manualIncomeA')}
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => manualIncomeBRef?.current?.focus()}
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
              ref={manualIncomeBRef}
              style={[
                formStyles.input,
                touched.manualIncomeB &&
                errors.manualIncomeB &&
                formStyles.inputError,
              ]}
              placeholder="e.g. 60000"
              placeholderTextColor={colors.textMuted}
              value={manualIncomeB}
              onChangeText={(text) => {
                const val = text.replace(/[^0-9]/g, '');
                onTextChange('manualIncomeB', val, setManualIncomeB);
              }}
              onBlur={() => onBlur('manualIncomeB')}
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => manualChildrenRef?.current?.focus()}
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
              ref={manualChildrenRef}
              style={[
                formStyles.input,
                touched.manualChildren &&
                errors.manualChildren &&
                formStyles.inputError,
              ]}
              placeholder="e.g. 2"
              placeholderTextColor={colors.textMuted}
              value={manualChildren}
              onChangeText={(text) => {
                const val = text.replace(/[^0-9]/g, '');
                onTextChange('manualChildren', val, setManualChildren);
              }}
              onBlur={() => onBlur('manualChildren')}
              keyboardType="numeric"
              returnKeyType="done"
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
      ))}

      {/* Financial Tags - Conditional */}
      {shouldShowFinancialTags && (
        <View
          style={financialStyles.financialSection}
          accessibilityRole={'group' as any}
          accessibilityLabel="Financial Issue Tags"
        >
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

      {/* PSI (Post-Separation Income) Fields - Conditional */}
      {shouldShowPsiFields && (
        <View
          style={financialStyles.financialSection}
          accessibilityRole={'group' as any}
          accessibilityLabel="Post-Separation Income Details"
        >
          <DatePickerField
            label="Date of last separation *"
            value={separationDate}
            onChange={onSeparationDateChange}
            error={touched.separationDate ? errors.separationDate : undefined}
            disabled={isSubmitting}
            pickMonthYear
          />

          <View style={financialStyles.switchRow}>
            <Text style={financialStyles.switchLabel}>
              Did you live together for at least 6 months before separating?
            </Text>
            <Switch
              value={cohabited6Months}
              onValueChange={onCohabited6MonthsChange}
              disabled={isSubmitting}
              trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
              thumbColor={cohabited6Months ? '#2563eb' : '#94a3b8'}
              accessibilityLabel="Lived together for 6 months"
            />
          </View>

          {/* Amber Warning for >3 years */}
          {showPsiWarning && (
            <View style={financialStyles.warningBox}>
              <Ionicons name="alert-circle" size={20} color="#d97706" />
              <Text style={financialStyles.warningText}>
                Note: Income exclusion is typically granted for the first 3
                years after separation. Cases beyond this are harder to prove
                but a lawyer can review your specific circumstances.
              </Text>
            </View>
          )}
        </View>
      )}

      {/* International Jurisdiction Fields - Conditional */}
      {shouldShowInternationalFields && (
        <View
          style={financialStyles.financialSection}
          accessibilityRole={'group' as any}
          accessibilityLabel="International Jurisdiction Details"
        >
          <Text style={formStyles.fieldLabel}>
            Other parent's country of habitual residence *
          </Text>

          {/* Country Search Input */}
          <TextInput
            style={[
              formStyles.input,
              touched.otherParentCountry &&
              errors.otherParentCountry &&
              formStyles.inputError,
            ]}
            placeholder="Search for a country..."
            placeholderTextColor={colors.textMuted}
            value={otherParentCountry || countrySearch}
            onChangeText={(text) => {
              setCountrySearch(text);
              if (otherParentCountry) {
                onOtherParentCountryChange('');
              }
              setShowCountryDropdown(true);
            }}
            onFocus={() => setShowCountryDropdown(true)}
            editable={!isSubmitting}
            accessibilityLabel="Country search"
            accessibilityHint="Type to search for a country"
          />

          {/* Country Dropdown */}
          {showCountryDropdown && countrySearch.length > 0 && !otherParentCountry && (
            <View style={financialStyles.countryDropdown}>
              <ScrollView
                style={financialStyles.countryDropdownScroll}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
              >
                {filteredCountries.map((country) => (
                  <Pressable
                    key={country}
                    style={financialStyles.countryOption}
                    onPress={() => {
                      onOtherParentCountryChange(country);
                      setCountrySearch('');
                      setShowCountryDropdown(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${country}`}
                  >
                    <Text style={financialStyles.countryOptionText}>
                      {country}
                    </Text>
                  </Pressable>
                ))}
                {filteredCountries.length === 0 && (
                  <Text style={financialStyles.noResultsText}>
                    No countries found
                  </Text>
                )}
              </ScrollView>
            </View>
          )}

          {touched.otherParentCountry && errors.otherParentCountry && (
            <Text style={formStyles.errorText}>{errors.otherParentCountry}</Text>
          )}

          {/* Excluded Jurisdiction Warning (Red) */}
          {internationalWarning === 'excluded' && (
            <View style={financialStyles.errorBox}>
              <Ionicons name="warning" size={20} color="#dc2626" />
              <Text style={financialStyles.errorBoxText}>
                Note: This is an Excluded Jurisdiction. An administrative
                assessment is not possible, but you may be able to obtain an
                Australian court order.
              </Text>
            </View>
          )}

          {/* Non-Reciprocating Warning (Amber) */}
          {internationalWarning === 'non_reciprocating' && (
            <View style={financialStyles.warningBox}>
              <Ionicons name="alert-circle" size={20} color="#d97706" />
              <Text style={financialStyles.warningText}>
                Note: This appears to be a Non-Reciprocating Jurisdiction.
                Australian child support assessments and court orders are
                generally not enforceable in this country.
              </Text>
            </View>
          )}
        </View>
      )}
    </>
  );
}
