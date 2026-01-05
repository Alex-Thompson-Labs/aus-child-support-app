import React from 'react';
import { Linking, Platform, StyleSheet, Text, View } from 'react-native';
import type { CalculationResults } from '../../utils/calculator';
import { formatCurrency } from '../../utils/formatters';
import { shadowPresets } from '../../utils/shadow-styles';

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
}: ResultsHeroProps) {
  // Calculate payment amounts
  const monthlyAmount = results.finalPaymentAmount / 12;
  const fortnightlyAmount = results.finalPaymentAmount / 26;
  const dailyAmount = results.finalPaymentAmount / 365;

  const isInline = variant === 'inline';

  // Inline variant: compact display
  if (isInline) {
    return (
      <View style={styles.inlineHeroSection}>
        <Text style={[styles.expandedHeroAmount, isStale && styles.staleAmount]}>
          {formatCurrency(results.finalPaymentAmount)}
        </Text>
        <Text style={styles.expandedHeroLabel}>per year</Text>
      </View>
    );
  }

  // Modal variant: full hero with all details
  return (
    <View style={styles.expandedHeroSection}>
      <Text style={styles.expandedHeroLabel}>
        {getPayerText(results.payer)}
      </Text>
      <Text style={[styles.expandedHeroAmount, isStale && styles.staleAmount]}>
        {formatCurrency(results.finalPaymentAmount)}
      </Text>
      <Text style={styles.expandedHeroSubtext}>per year</Text>
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
              const url = 'https://blog.auschildsupport.com/child-support-formula-australia/';
              if (Platform.OS === 'web') {
                window.open(url, '_blank');
              } else {
                Linking.openURL(url);
              }
            }}
            {...(Platform.OS === 'web' && {
              // @ts-ignore - Web-only props for SEO
              href: 'https://blog.auschildsupport.com/child-support-formula-australia/',
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
    marginBottom: 24,
    backgroundColor: '#3b82f6',
    borderWidth: 1,
    borderColor: '#3b82f6',
    ...shadowPresets.large,
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
