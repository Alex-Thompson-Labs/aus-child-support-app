import type { CalculationResults } from '@/src/utils/calculator';
import { formatCurrency } from '@/src/utils/formatters';
import { shadowPresets } from '@/src/utils/shadow-styles';
import React from 'react';
import { Linking, Platform, StyleSheet, Text, View } from 'react-native';

// ============================================================================
// ResultsHero Component
// ============================================================================
/**
 * ResultsHero Component
 *
 * Displays the main payment amount "hero" section with primary and secondary
 * amounts (annual, monthly, fortnightly, daily).
 *
 * Props:
 * - results: CalculationResults - The calculation results containing finalPaymentAmount and payer
 * - isStale: boolean - Whether results are stale (shows strikethrough styling)
 * - variant: 'modal' | 'inline' - Display variant
 *   - 'modal': Full hero with payer label, all secondary amounts, and blog link
 *   - 'inline': Compact hero with just amount and period label
 */

export interface ResultsHeroProps {
  results: CalculationResults;
  isStale?: boolean;
  variant?: 'modal' | 'inline';
  /** Whether Parent A's calculation included income support */
  supportA?: boolean;
  /** Whether Parent B's calculation included income support */
  supportB?: boolean;
}

/**
 * Maps payer values to user-friendly text
 */
export function getPayerText(payer: string): string {
  if (payer === 'Parent A') return 'You pay';
  if (payer === 'Parent B') return 'Other parent pays';
  if (payer === 'Neither') return 'No payment required';
  return payer; // Fallback
}

export function ResultsHero({
  results,
  isStale = false,
  variant = 'modal',
  supportA = false,
  supportB = false,
}: ResultsHeroProps) {
  // Determine relevant payment amount (handle NPC-only cases)
  let heroAmount = results.finalPaymentAmount;
  let heroLabel = getPayerText(results.payer);

  // Calculate NPC liabilities for each parent
  const npcLiabilityA = results.childResults.reduce((sum, c) => sum + (c.liabilityToNPC_A ?? 0), 0);
  const npcLiabilityB = results.childResults.reduce((sum, c) => sum + (c.liabilityToNPC_B ?? 0), 0);

  // If standard transfer is $0 but there is a Non-Parent Carer payment, show that instead
  if (heroAmount === 0 && (results.paymentToNPC ?? 0) > 0) {
    heroAmount = results.paymentToNPC!;
    switch (results.payerRole) {
      case 'paying_parent':
        heroLabel = 'You pay to NPC';
        break;
      case 'receiving_parent':
        heroLabel = 'Other parent pays NPC';
        break;
      case 'both_paying':
        // Formula 2 Rule 1: Both parents pay NPC
        // We show the User's liability (Parent A) as the hero amount
        heroLabel = 'You pay to NPC';
        heroAmount = npcLiabilityA;
        break;
      default:
        heroLabel = 'Payment to non-parent carer';
    }
  }

  // Check for mixed payment (Payer pays both Parent and NPC)
  let breakdownText: string | null = null;
  // Also check for Rule 1 (Both paying NPC only) to set breakdown text
  if (results.payerRole === 'both_paying' && results.finalPaymentAmount === 0) {
    breakdownText = `(Other parent pays ${formatCurrency(npcLiabilityB)} to carer)`;
  }

  if (results.finalPaymentAmount > 0) {
    if (results.payer === 'Parent A') {
      const npcPayment = npcLiabilityA;
      if (npcPayment > 0) {
        heroAmount += npcPayment;
        breakdownText = `(${formatCurrency(results.finalPaymentAmount)} to parent, ${formatCurrency(npcPayment)} to carer)`;
      }
    } else if (results.payer === 'Parent B') {
      const npcPayment = npcLiabilityB;
      if (npcPayment > 0) {
        heroAmount += npcPayment;
        breakdownText = `(${formatCurrency(results.finalPaymentAmount)} to parent, ${formatCurrency(npcPayment)} to carer)`;
      }
    }
  }

  // Calculate payment amounts
  const monthlyAmount = heroAmount / 12;
  const fortnightlyAmount = heroAmount / 26;
  const dailyAmount = heroAmount / 365;

  const isInline = variant === 'inline';

  // Build income support indicator text
  const getIncomeSupportText = () => {
    if (supportA && supportB) {
      return 'Income support applied: You + Other Parent';
    } else if (supportA) {
      return 'Income support applied: You';
    } else if (supportB) {
      return 'Income support applied: Other Parent';
    }
    // Check if FAR is applied without income support
    const isFixedAnnualRate = results.FAR_A > 0 || results.FAR_B > 0;
    const isIncomeSupport = supportA || supportB;
    if (isFixedAnnualRate && !isIncomeSupport) {
      return 'Income support not applied: Fixed Annual Rate (FAR) assessment';
    }
    return null;
  };
  const incomeSupportText = getIncomeSupportText();

  // Inline variant: compact display
  if (isInline) {
    return (
      <View style={styles.inlineHeroSection}>
        <View
          accessibilityLiveRegion="polite"
          // @ts-ignore - Web-only ARIA attribute
          aria-live="polite"
          accessibilityLabel={`${heroLabel}: ${formatCurrency(heroAmount)} per year`}
        >
          <Text style={[styles.expandedHeroAmount, isStale && styles.staleAmount]}>
            {formatCurrency(heroAmount)}
          </Text>
          <Text style={styles.expandedHeroLabel}>per year</Text>
          {breakdownText && (
            <Text style={[styles.expandedSecondaryLabel, { color: '#6b7280', fontSize: 11, marginTop: 2 }]}>{breakdownText}</Text>
          )}
        </View>
      </View>
    );
  }

  // Modal variant: full hero with all details
  return (
    <View style={styles.expandedHeroSection}>
      <View
        accessibilityLiveRegion="polite"
        // @ts-ignore - Web-only ARIA attribute
        aria-live="polite"
        accessibilityLabel={`${heroLabel}: ${formatCurrency(heroAmount)} per year`}
        style={styles.heroAmountContainer}
      >
        <Text style={styles.expandedHeroLabel}>
          {heroLabel}
        </Text>
        <Text style={[styles.expandedHeroAmount, isStale && styles.staleAmount]}>
          {formatCurrency(heroAmount)}
        </Text>
        <Text style={styles.expandedHeroSubtext}>
          per year
          {breakdownText && (
            <Text style={{ fontSize: 13, opacity: 0.9 }}>
              {'\n'}{breakdownText}
            </Text>
          )}
        </Text>
      </View>
      {incomeSupportText && (
        <View style={styles.incomeSupportBadge}>
          <Text style={styles.incomeSupportText}>✓ {incomeSupportText}</Text>
        </View>
      )}
      <View style={styles.expandedSecondaryAmounts}>
        <View style={styles.expandedSecondaryItem}>
          <Text
            style={[
              styles.expandedSecondaryValue,
              isStale && styles.staleAmount,
            ]}
          >
            {formatCurrency(monthlyAmount)}
          </Text>
          <Text style={styles.expandedSecondaryLabel}>/month</Text>
        </View>
        <View style={styles.expandedDivider} />
        <View style={styles.expandedSecondaryItem}>
          <Text
            style={[
              styles.expandedSecondaryValue,
              isStale && styles.staleAmount,
            ]}
          >
            {formatCurrency(fortnightlyAmount)}
          </Text>
          <Text style={styles.expandedSecondaryLabel}>/fortnight</Text>
        </View>
        <View style={styles.expandedDivider} />
        <View style={styles.expandedSecondaryItem}>
          <Text
            style={[
              styles.expandedSecondaryValue,
              isStale && styles.staleAmount,
            ]}
          >
            {formatCurrency(dailyAmount)}
          </Text>
          <Text style={styles.expandedSecondaryLabel}>/day</Text>
        </View>
      </View>

      {/* SEO-friendly blog link */}
      <View style={styles.blogLinkContainer}>
        <Text style={styles.blogLinkText}>
          This estimate is based on the 8-step assessment formula used by Services Australia. To understand the rules behind these steps and how they apply to your situation, read our{' '}
          <Text
            accessibilityRole="link"
            style={styles.blogLink}
            onPress={() => {
              const url = 'https://blog.auschildsupport.com.au/child-support-formula-australia/';
              if (Platform.OS === 'web') {
                window.open(url, '_blank');
              } else {
                Linking.openURL(url);
              }
            }}
            {...(Platform.OS === 'web' && {
              // @ts-ignore - Web-only props for SEO
              href: 'https://blog.auschildsupport.com.au/child-support-formula-australia/',
              target: '_blank',
              rel: 'noopener noreferrer',
            })}
          >
            Australian Child Support Guide
          </Text>
          .
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Full hero section (modal variant)
  expandedHeroSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#3b82f6',
    borderWidth: 1,
    borderColor: '#3b82f6',
    ...shadowPresets.large,
  },
  heroAmountContainer: {
    alignItems: 'center',
  },
  expandedHeroLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  expandedHeroAmount: {
    fontSize: 56,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -1,
    marginBottom: 4,
  },
  expandedHeroSubtext: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 20,
  },
  incomeSupportBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  incomeSupportText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  expandedSecondaryAmounts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    gap: 16,
  },
  expandedSecondaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  expandedSecondaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  expandedSecondaryLabel: {
    fontSize: 12,
    color: '#ffffff',
  },
  expandedDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  staleAmount: {
    textDecorationLine: 'line-through',
    textDecorationColor: '#ef4444',
    textDecorationStyle: 'solid',
    opacity: 0.7,
  },
  blogLinkContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  blogLinkText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  blogLink: {
    color: '#ffffff',
    textDecorationLine: 'underline',
    textDecorationColor: '#ffffff',
    fontWeight: '500',
  },
  // Inline hero section (inline variant)
  inlineHeroSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
});
