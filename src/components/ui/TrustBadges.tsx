/**
 * TrustBadges Component
 *
 * Reusable trust badge component with multiple variants:
 * - "banner": Full-width banner (like lawyer inquiry form)
 * - "inline": Compact inline badge (for cards/sections)
 * - "secure": Dark secure badge (like admin portal)
 */

import { useAppTheme } from '@/src/theme';
import { MAX_CALCULATOR_WIDTH } from '@/src/utils/responsive';
import React from 'react';
import { Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';

export type TrustBadgeVariant = 'banner' | 'inline' | 'secure';

interface TrustBadgesProps {
  /** Visual variant of the badge */
  variant?: TrustBadgeVariant;
  /** Custom text to display (defaults based on variant) */
  text?: string;
  /** Custom icon (emoji or text) */
  icon?: string;
  /** Additional container styles */
  style?: ViewStyle;
}

export function TrustBadges({
  variant = 'banner',
  text,
  icon,
  style,
}: TrustBadgesProps) {
  const { colors, isDark } = useAppTheme();

  // Default text based on variant
  const displayText =
    text ??
    (variant === 'secure'
      ? 'SECURE'
      : variant === 'inline'
        ? 'Verified Network'
        : 'Verified Australian Family Law Network');

  // Default icon based on variant
  const displayIcon = icon ?? (variant === 'secure' ? '🔒' : '✓');

  if (variant === 'secure') {
    return (
      <View style={[styles.secureBadge, { backgroundColor: colors.primaryDark }, style]}>
        <Text style={[styles.secureBadgeText, { color: colors.textInverse }]}>
          {displayIcon} {displayText}
        </Text>
      </View>
    );
  }

  if (variant === 'inline') {
    return (
      <View
        style={[
          styles.inlineBadge,
          {
            backgroundColor: isDark ? '#052e16' : '#f0fdf4',
            borderColor: isDark ? '#166534' : '#bbf7d0',
          },
          style,
        ]}
      >
        <Text style={[styles.inlineIcon, { color: isDark ? '#4ade80' : '#16a34a' }]}>
          {displayIcon}
        </Text>
        <Text style={[styles.inlineText, { color: isDark ? '#86efac' : '#166534' }]}>
          {displayText}
        </Text>
      </View>
    );
  }

  // Banner variant (default)
  return (
    <View
      style={[
        styles.bannerWrapper,
        {
          backgroundColor: isDark ? '#052e16' : '#f0fdf4',
          borderBottomColor: isDark ? '#166534' : '#bbf7d0',
        },
        style,
      ]}
    >
      <View style={styles.bannerContent}>
        <Text style={[styles.bannerIcon, { color: isDark ? '#4ade80' : '#16a34a' }]}>
          {displayIcon}
        </Text>
        <Text style={[styles.bannerText, { color: isDark ? '#86efac' : '#166534' }]}>
          {displayText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Banner variant styles
  bannerWrapper: {
    borderBottomWidth: 1,
    alignItems: 'center',
    ...Platform.select({
      web: {
        maxWidth: MAX_CALCULATOR_WIDTH,
        width: '100%',
        alignSelf: 'center',
      },
      default: {},
    }),
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
    ...Platform.select({
      web: {
        maxWidth: MAX_CALCULATOR_WIDTH,
        width: '100%',
      },
      default: {},
    }),
  },
  bannerIcon: {
    fontSize: 14,
  },
  bannerText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Inline variant styles
  inlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  inlineIcon: {
    fontSize: 12,
  },
  inlineText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Secure variant styles
  secureBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  secureBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
