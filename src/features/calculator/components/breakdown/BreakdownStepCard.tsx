import { useAppTheme } from '@/src/theme';
import { createShadow } from '@/src/utils/shadow-styles';
import React, { ReactNode, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { HelpTooltip } from '../HelpTooltip';

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
  const { colors } = useAppTheme();

  const dynamicStyles = useMemo(() => ({
    step: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    stepNumber: {
      backgroundColor: colors.userHighlight,
    },
    stepNumberText: {
      color: colors.surface,
    },
    stepTitle: {
      color: colors.primaryDark,
    },
    chevron: {
      color: colors.userHighlight,
    },
  }), [colors]);

  const accessibilityLabel = description
    ? `Step ${stepNumber}: ${title}. ${description}. ${isExpanded ? 'Expanded' : 'Collapsed'
    }. Tap to ${isExpanded ? 'collapse' : 'expand'}.`
    : `Step ${stepNumber}: ${title}. ${isExpanded ? 'Expanded' : 'Collapsed'
    }. Tap to ${isExpanded ? 'collapse' : 'expand'}.`;

  return (
    <View style={[styles.step, dynamicStyles.step]}>
      <Pressable
        onPress={onToggle}
        style={styles.stepHeader}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: isExpanded }}
      >
        <View style={[styles.stepNumber, dynamicStyles.stepNumber]}>
          <Text style={[styles.stepNumberText, dynamicStyles.stepNumberText]}>{stepNumber}</Text>
        </View>

        <View style={styles.titleRow}>
          {/* SEO: Semantic H3 Tag */}
          <Text
            style={[styles.stepTitle, dynamicStyles.stepTitle]}
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

        <Text style={[styles.chevron, dynamicStyles.chevron]}>{isExpanded ? '▼' : '▶'}</Text>
      </Pressable>

      {isExpanded && children}
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
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

  // Blue circle number
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepNumberText: {
    fontSize: 16,
    fontWeight: '600',
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

  // Uppercase title
  stepTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  chevron: {
    fontSize: 16,
    marginLeft: 'auto',
  },
});
