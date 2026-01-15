/**
 * FTB Impact Card Component
 *
 * Displays targeted messaging about how Child Support affects
 * Family Tax Benefit (FTB) payments. Shows different cards based
 * on whether user is a receiver (payee) or payer.
 *
 * Designed to drive lawyer inquiry conversions for structuring advice.
 */

import type { CalculationResults } from '@/src/utils/calculator';
import { formatCurrency } from '@/src/utils/formatters';
import {
    calculatePartAReduction,
    checkPartBEligibility,
    isCloseToPartBEligibility,
} from '@/src/utils/ftb-logic';
import { shadowPresets } from '@/src/utils/shadow-styles';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// ============================================================================
// Types
// ============================================================================

interface FtbImpactCardProps {
  /** Calculation results with payment direction and amounts */
  results: CalculationResults;
  /** User's income (ATI) */
  userIncome: number;
  /** Number of children in assessment */
  childCount: number;
  /** Financial year for FTB rate lookup (defaults to 2025) */
  year?: number;
  /** Callback when CTA is pressed */
  onCtaPress?: () => void;
}

// ============================================================================
// Component
// ============================================================================

/**
 * FTB Impact Card
 *
 * Shows context-aware messages about FTB impact:
 * - Receivers: Warning about Part A reduction
 * - Payers: Opportunity for Part B via deduction
 * - Payers (near eligible): Educational info
 */
export function FtbImpactCard({
  results,
  userIncome,
  childCount,
  year = 2025,
  onCtaPress,
}: FtbImpactCardProps): React.ReactElement | null {
  const isReceiver = results.payer === 'Parent B'; // User is Parent A, receives from B
  const isPayer = results.payer === 'Parent A'; // User is Parent A, pays to B
  const childSupportAmount = results.finalPaymentAmount;

  // Don't show card if no payment
  if (results.payer === 'Neither' || childSupportAmount <= 0) {
    return null;
  }

  // ========================================================================
  // State A: User is Receiver (Payee) - Check Part A Reduction
  // ========================================================================
  if (isReceiver) {
    const partAReduction = calculatePartAReduction(
      childSupportAmount,
      childCount,
      userIncome,
      year
    );

    if (partAReduction > 0) {
      return (
        <View style={[styles.card, styles.warningCard]}>
          <Text style={styles.warningTitle}>
            ⚠️ Impact on Centrelink Payments
          </Text>
          <Text style={styles.bodyText}>
            Because you receive{' '}
            <Text style={styles.bold}>
              {formatCurrency(childSupportAmount)}
            </Text>{' '}
            in Child Support, your Family Tax Benefit Part A may be reduced by
            approx.{' '}
            <Text style={styles.bold}>{formatCurrency(partAReduction)}</Text>{' '}
            per year due to the Maintenance Income Test.
          </Text>
          <Text style={styles.ctaText}>
            A Binding Child Support Agreement can help structure this better.
            Speak to a lawyer.
          </Text>
          {onCtaPress && (
            <Pressable
              style={styles.ctaButton}
              onPress={onCtaPress}
              accessibilityRole="button"
              accessibilityLabel="Learn about structuring child support"
            >
              <Text style={styles.ctaButtonText}>
                Ask About FTB Structuring
              </Text>
            </Pressable>
          )}
        </View>
      );
    }
  }

  // ========================================================================
  // State B: User is Payer - Check Part B Eligibility
  // ========================================================================
  if (isPayer) {
    const eligibility = checkPartBEligibility(childSupportAmount, userIncome, year);

    // "Green Light" scenario - deduction makes them eligible
    if (eligibility === 'ELIGIBLE_VIA_DEDUCTION') {
      return (
        <View style={[styles.card, styles.opportunityCard]}>
          <Text style={styles.opportunityTitle}>
            💡 Opportunity: Pay School Fees Instead of Cash?
          </Text>
          <Text style={styles.bodyText}>
            Because you are eligible for the FTB Part B tax break, you may be
            able to structure your Child Support to pay{' '}
            <Text style={styles.bold}>School Fees directly</Text> instead of
            cash transfers, while keeping your tax advantage.
          </Text>
          {onCtaPress && (
            <Pressable
              style={styles.opportunityButton}
              onPress={onCtaPress}
              accessibilityRole="button"
              accessibilityLabel="Ask a lawyer about school fees substitution"
            >
              <Text style={styles.opportunityButtonText}>
                Ask a Lawyer about a School Fees Substitution Agreement
              </Text>
            </Pressable>
          )}
        </View>
      );
    }

    // "Close to eligible" scenario - educational message
    if (
      eligibility === 'INELIGIBLE' &&
      isCloseToPartBEligibility(userIncome, childSupportAmount, year)
    ) {
      return (
        <View style={[styles.card, styles.infoCard]}>
          <Text style={styles.infoTitle}>💼 Tax Tip</Text>
          <Text style={styles.bodyText}>
            Did you know Child Support paid is tax-deductible for the FTB income
            test? It reduces your assessable income, which can help you qualify
            for benefits.
          </Text>
        </View>
      );
    }
  }

  // No card to show
  return null;
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    ...shadowPresets.card,
  },

  // Warning Card (Amber/Orange) - Receiver Part A
  warningCard: {
    backgroundColor: '#fef3c7', // amber-100
    borderWidth: 1,
    borderColor: '#f59e0b', // amber-500
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e', // amber-800
    marginBottom: 8,
  },

  // Opportunity Card (Teal/Blue) - Payer Part B
  opportunityCard: {
    backgroundColor: '#e0f2f1', // teal-50
    borderWidth: 1,
    borderColor: '#14b8a6', // teal-500
  },
  opportunityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f766e', // teal-700
    marginBottom: 8,
  },
  opportunityButton: {
    backgroundColor: '#0d9488', // teal-600
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  opportunityButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Info Card (Gray/Blue) - Close to eligible
  infoCard: {
    backgroundColor: '#f1f5f9', // slate-100
    borderWidth: 1,
    borderColor: '#94a3b8', // slate-400
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569', // slate-600
    marginBottom: 8,
  },

  // Shared styles
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151', // gray-700
  },
  bold: {
    fontWeight: '700',
  },
  ctaText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#92400e', // amber-800
    marginTop: 10,
  },
  ctaButton: {
    backgroundColor: '#f59e0b', // amber-500
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
