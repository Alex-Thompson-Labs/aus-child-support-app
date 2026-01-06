import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
    ? `Step ${stepNumber}: ${title}. ${description}. ${
        isExpanded ? 'Expanded' : 'Collapsed'
      }. Tap to ${isExpanded ? 'collapse' : 'expand'}.`
    : `Step ${stepNumber}: ${title}. ${
        isExpanded ? 'Expanded' : 'Collapsed'
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
              <HelpTooltip
                what={tooltip}
                why={''}
                hideWhatLabel
              />
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
  // Step container - exact styling from current implementation
  step: {
    backgroundColor: '#ffffff', // white background
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb', // gray-200 - subtle border
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
    marginBottom: 10,
  },

  // Blue circle number - exact styling from current implementation
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3b82f6', // accent.primary
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepNumberText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff', // white text on blue background
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
    color: '#1a202c', // text.primary - near black
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  chevron: {
    fontSize: 16,
    color: '#2563eb', // blue-600 (Brand Blue)
    marginLeft: 'auto',
  },
});
