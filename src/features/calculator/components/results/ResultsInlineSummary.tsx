/**
 * ResultsInlineSummary Component
 * 
 * Displays a collapsed, fixed-position summary card showing the payment amount.
 * Used in modal mode when the breakdown is not expanded.
 * Features:
 * - Drag handle for visual affordance
 * - Payment amount and payer label
 * - Income support indicator badge
 * - Tap to expand hint
 */

import type { CalculationResults } from '@/src/utils/calculator';
import { formatCurrency } from '@/src/utils/formatters';
import { shadowPresets } from '@/src/utils/shadow-styles';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getPayerText } from './ResultsHero';

/**
 * Helper to generate income support indicator text for collapsed card
 */
function getIncomeSupportText(
  supportA: boolean,
  supportB: boolean,
  farA: number = 0,
  farB: number = 0
): string | null {
  if (supportA && supportB) {
    return 'Income support applied: You + Other Parent';
  } else if (supportA) {
    return 'Income support applied: You';
  } else if (supportB) {
    return 'Income support applied: Other Parent';
  }
  // Check if FAR is applied without income support
  const isFixedAnnualRate = farA > 0 || farB > 0;
  const isIncomeSupport = supportA || supportB;
  if (isFixedAnnualRate && !isIncomeSupport) {
    return 'Income support not applied: Fixed Annual Rate (FAR) assessment';
  }
  return null;
}

export interface ResultsInlineSummaryProps {
  results: CalculationResults;
  supportA?: boolean;
  supportB?: boolean;
  isStale?: boolean;
  bottomInset: number;
  isWeb: boolean;
  isDesktop: boolean;
  triggerButtonRef: React.RefObject<any>;
  onPress: () => void;
}

export function ResultsInlineSummary({
  results,
  supportA = false,
  supportB = false,
  isStale = false,
  bottomInset,
  isWeb,
  isDesktop,
  triggerButtonRef,
  onPress,
}: ResultsInlineSummaryProps) {
  // Determine relevant payment amount (handle NPC-only cases)
  let displayAmount = results.finalPaymentAmount;
  let displayLabel = getPayerText(results.payer);

  // If standard transfer is $0 but there is a Non-Parent Carer payment, show that instead
  if (displayAmount === 0 && (results.paymentToNPC ?? 0) > 0) {
    displayAmount = results.paymentToNPC!;
    switch (results.payerRole) {
      case 'paying_parent':
        displayLabel = 'You pay to NPC';
        break;
      case 'receiving_parent':
        displayLabel = 'Other parent pays NPC';
        break;
      case 'both_paying':
        displayLabel = 'Combined payment to NPC';
        break;
      default:
        displayLabel = 'Payment to non-parent carer';
    }
  }

  const incomeSupportText = getIncomeSupportText(
    supportA,
    supportB,
    results.FAR_A,
    results.FAR_B
  );

  return (
    <Pressable
      ref={triggerButtonRef}
      onPress={onPress}
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(bottomInset, isWeb && !isDesktop ? 80 : 12) },
      ]}
      accessibilityRole="button"
      accessibilityLabel={
        `${displayLabel} ${formatCurrency(displayAmount)} per year. Tap to view full breakdown`
      }
      accessibilityHint="Opens detailed calculation breakdown"
    >
      <View style={[styles.card, { backgroundColor: '#3b82f6' }]}>
        <View style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>
        <View style={styles.collapsedContent}>
          <View
            style={styles.summaryRow}
            accessibilityLiveRegion="polite"
            // @ts-ignore - Web-only ARIA attribute
            aria-live="polite"
            accessibilityLabel={`${displayLabel} ${formatCurrency(displayAmount)} per year`}
          >
            <Text style={styles.label}>{displayLabel}</Text>
            <Text
              style={[
                styles.amountCondensed,
                isStale && styles.staleAmount,
              ]}
            >
              {formatCurrency(displayAmount)}
            </Text>
          </View>
          {incomeSupportText && (
            <View style={styles.incomeSupportBadge}>
              <Text style={styles.incomeSupportText}>
                ✓ {incomeSupportText}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.expandHint}>
          <Text style={styles.expandHintText}>Tap for breakdown ▲</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    paddingHorizontal: 12,
  },
  card: {
    width: '100%',
    maxWidth: 750,
    minHeight: 85,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginBottom: 8,
    ...shadowPresets.modal,
    alignSelf: 'center',
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  dragHandle: {
    width: 30,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  collapsedContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  amountCondensed: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  staleAmount: {
    textDecorationLine: 'line-through',
    textDecorationColor: '#ef4444',
    textDecorationStyle: 'solid',
    opacity: 0.7,
  },
  incomeSupportBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  incomeSupportText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  expandHint: {
    alignItems: 'center',
    paddingBottom: 4,
  },
  expandHintText: {
    color: '#ffffff',
    fontSize: 11,
    opacity: 0.8,
  },
});
