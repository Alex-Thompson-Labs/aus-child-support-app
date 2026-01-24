import { theme } from '@/src/theme';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

interface SEOHeroSectionProps {
  onCalculatePress: () => void;
}

/**
 * SEO Hero Section - Above-the-fold content optimized for search engines
 * 
 * Contains H1, value proposition, and primary CTA to drive calculator usage.
 * Designed to satisfy search intent immediately while building trust.
 */
export function SEOHeroSection({ onCalculatePress }: SEOHeroSectionProps) {
  return (
    <View style={styles.container}>
      {/* H1 - Primary keyword target */}
      <Text 
        style={styles.h1}
        accessibilityRole="header"
        accessibilityLabel="Australian Child Support Calculator"
      >
        Australian Child Support Calculator
      </Text>

      {/* Value proposition */}
      <Text style={styles.subtitle}>
        Get an accurate estimate of your child support payments in under 5 minutes. 
        Our free calculator uses the official Services Australia 8-step formula and 
        handles complex scenarios most calculators miss.
      </Text>

      {/* Trust signals */}
      <View style={styles.trustSignals}>
        <TrustBadge text="Covers income changes, multiple children, and shared care" />
        <TrustBadge text="Explains every step of the calculation" />
        <TrustBadge text="Identifies when your assessment might be wrong" />
        <TrustBadge text="No registration required" />
      </View>

      {/* Primary CTA */}
      <Pressable
        style={({ pressed }) => [
          styles.ctaButton,
          pressed && styles.ctaButtonPressed,
        ]}
        onPress={onCalculatePress}
        accessibilityRole="button"
        accessibilityLabel="Start calculating your child support"
      >
        <Text style={styles.ctaText}>Calculate Your Child Support Now</Text>
      </Pressable>

      {/* Social proof */}
      <Text style={styles.socialProof}>
        Used by thousands of Australian parents to understand their obligations and entitlements.
      </Text>
    </View>
  );
}

function TrustBadge({ text }: { text: string }) {
  return (
    <View style={styles.trustBadge}>
      <Text style={styles.checkmark}>✓</Text>
      <Text style={styles.trustBadgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.06)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      },
    }),
  },
  h1: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: 16,
    lineHeight: 40,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  trustSignals: {
    gap: 12,
    marginBottom: 24,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkmark: {
    fontSize: 18,
    color: '#10b981', // green-500 - using hex instead of theme.colors.success
    fontWeight: '700',
  },
  trustBadgeText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  ctaButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 12px 0px rgba(37, 99, 235, 0.2)',
      },
      default: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
      },
    }),
  },
  ctaButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  socialProof: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
