import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { createShadow } from '../utils/shadow-styles';
import { HelpTooltip } from './HelpTooltip';

interface BreakdownStepCardProps {
  stepNumber: number | string;
  title: string;
  description?: string;
  /** Optional tooltip content shown as a help icon next to the header title */
  tooltip?: string | ReactNode;
  children: ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

export function BreakdownStepCard({
  stepNumber,
  title,
  description,
  tooltip,
  children,
  isExpanded,
  onToggle,
}: BreakdownStepCardProps) {
  const accessibilityLabel = description
    ? `Step ${stepNumber}: ${title}. ${description}. ${isExpanded ? 'Expanded' : 'Collapsed'
    }. Tap to ${isExpanded ? 'collapse' : 'expand'}.`
    : `Step ${stepNumber}: ${title}. ${isExpanded ? 'Expanded' : 'Collapsed'
    }. Tap to ${isExpanded ? 'collapse' : 'expand'}.`;

  return (
    <View style={styles.step}>
      <Pressable
        onPress={onToggle}
        style={styles.stepHeader}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: isExpanded }}
      >
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>{stepNumber}</Text>
        </View>

        <View style={styles.titleRow}>
          {/* SEO: Semantic H3 Tag */}
          <Text
            style={styles.stepTitle}
            accessibilityRole="header"
            // @ts-ignore - Web-only prop
            aria-level="3"
          >
            {title}
          </Text>
          {tooltip != null && (
            <View style={styles.headerTooltip}>
              <HelpTooltip what={tooltip} why={''} hideWhatLabel />
            </View>
          )}
        </View>

        <Text style={styles.chevron}>{isExpanded ? '▼' : '▶'}</Text>
      </Pressable>

      {isExpanded && children}
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    }),
  } as any,

  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // Blue circle number - exact styling from current implementation
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.userHighlight,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepNumberText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.surface, // white text on blue background
  },

  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTooltip: {
    marginLeft: 6,
    transform: [{ scale: 0.9 }],
  },

  // Uppercase title - exact styling from current implementation
  stepTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e3a8a', // blue-900 (Dark Brand Blue)
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  chevron: {
    fontSize: 16,
    color: theme.colors.userHighlight,
    marginLeft: 'auto',
  },
});
