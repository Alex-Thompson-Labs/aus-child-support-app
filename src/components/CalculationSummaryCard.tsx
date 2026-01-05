import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { formatCurrency } from '../utils/formatters';
import { createShadow } from '../utils/shadow-styles';

export interface CalculationSummaryCardProps {
  /** Annual liability amount as a string */
  liability: string;
  /** Parent A income as a string */
  incomeA: string;
  /** Parent B income as a string */
  incomeB: string;
  /** Number of children as a string */
  children: string;
  /** Optional complexity trigger to display */
  trigger?: string;
  /** Optional title for the card */
  title?: string;
  /** Show the title (default: true) */
  showTitle?: boolean;
  /** Display variant - 'compact' for inline forms, 'detailed' for full screens */
  variant?: 'compact' | 'detailed';
  /** Optional additional styles for the container */
  containerStyle?: ViewStyle;
}

/**
 * CalculationSummaryCard - Reusable calculation summary display
 *
 * Displays a summary of child support calculation inputs including:
 * - Annual liability
 * - Parent A & B incomes
 * - Number of children
 * - Optional complexity trigger
 *
 * Used in lawyer inquiry forms across the application.
 */
export function CalculationSummaryCard({
  liability,
  incomeA,
  incomeB,
  children,
  trigger,
  title = 'CALCULATION SUMMARY',
  showTitle = true,
  variant = 'compact',
  containerStyle,
}: CalculationSummaryCardProps) {
  const isDetailed = variant === 'detailed';

  // Parse values for display
  const liabilityValue = liability ? parseFloat(liability) : null;
  const incomeAValue = incomeA ? parseFloat(incomeA) : null;
  const incomeBValue = incomeB ? parseFloat(incomeB) : null;
  const childrenValue = children || '0';

  return (
    <View>
      {showTitle && (
        <Text style={[isDetailed ? styles.titleDetailed : styles.titleCompact]}>
          {title}
        </Text>
      )}

      <View
        style={[
          isDetailed ? styles.cardDetailed : styles.cardCompact,
          containerStyle,
        ]}
      >
        {/* Annual Liability - Always first and prominent */}
        <View style={styles.row}>
          <Text style={isDetailed ? styles.labelDetailed : styles.labelCompact}>
            {isDetailed ? 'Annual Liability:' : 'Annual Liability'}
          </Text>
          <Text
            style={
              isDetailed
                ? styles.valueAmountDetailed
                : styles.valueAmountCompact
            }
          >
            {formatCurrency(liabilityValue)}
            {isDetailed ? '/year' : ''}
          </Text>
        </View>

        {/* Complexity Trigger - Only shown in detailed variant if provided */}
        {isDetailed && trigger && (
          <View style={styles.row}>
            <Text style={styles.labelDetailed}>Complexity Trigger:</Text>
            <Text style={styles.valueDetailed}>{trigger}</Text>
          </View>
        )}

        {/* Your Income */}
        <View style={styles.row}>
          <Text style={isDetailed ? styles.labelDetailed : styles.labelCompact}>
            {isDetailed ? 'Your Income:' : 'Your Income'}
          </Text>
          <Text style={isDetailed ? styles.valueDetailed : styles.valueCompact}>
            {formatCurrency(incomeAValue)}
          </Text>
        </View>

        {/* Other Parent's Income */}
        <View style={styles.row}>
          <Text style={isDetailed ? styles.labelDetailed : styles.labelCompact}>
            {isDetailed ? "Other Parent's Income:" : "Other Parent's Income"}
          </Text>
          <Text style={isDetailed ? styles.valueDetailed : styles.valueCompact}>
            {formatCurrency(incomeBValue)}
          </Text>
        </View>

        {/* Number of Children */}
        <View style={styles.row}>
          <Text style={isDetailed ? styles.labelDetailed : styles.labelCompact}>
            {isDetailed ? 'Number of Children:' : 'Children'}
          </Text>
          <Text style={isDetailed ? styles.valueDetailed : styles.valueCompact}>
            {childrenValue}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Common
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Compact variant (WebInquiryPanel)
  titleCompact: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4a5568', // dark grey
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  cardCompact: {
    backgroundColor: '#f7fafc', // very light grey
    borderRadius: 8,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  labelCompact: {
    fontSize: 13,
    color: '#5a6570', // dark grey - WCAG AA compliant (7.0:1)
  },
  valueCompact: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a202c', // near black
  },
  valueAmountCompact: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a202c', // near black
  },

  // Detailed variant (LawyerInquiryScreen)
  titleDetailed: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4a5568', // dark grey
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardDetailed: {
    backgroundColor: '#f9fafb', // very light grey
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb', // light grey
    gap: 12,
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  labelDetailed: {
    fontSize: 14,
    color: '#6b7280', // grey-500
  },
  valueDetailed: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a202c', // near black
  },
  valueAmountDetailed: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6', // blue-500
  },
});
