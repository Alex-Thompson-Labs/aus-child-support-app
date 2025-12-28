import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AlertCircle, DollarSign, Users, Info } from 'lucide-react-native';
import type { ComplexityCategory } from '../utils/change-of-assessment-reasons';

interface CategoryIconProps {
  category: ComplexityCategory;
  size?: number; // Icon size (default 20)
  circleSize?: number; // Circle container size (default 32)
}

/**
 * CategoryIcon component - Displays category-specific icons in colored circles
 *
 * Icon mappings:
 * - Urgent Matters: AlertCircle in red-600
 * - Income Issues: DollarSign in amber-600
 * - Child-Related: Users in violet-600
 * - Other Factors: Info in cyan-600
 *
 * Each icon is 20px with 2px stroke width, positioned in a 32px circle
 * with 10% opacity background of the same color.
 */
export function CategoryIcon({ category, size = 20, circleSize = 32 }: CategoryIconProps) {
  // Icon mapping - ALL icons use same grey color for consistency
  const iconConfig: Record<ComplexityCategory, { Icon: React.ComponentType<any> }> = {
    urgent: { Icon: AlertCircle },
    income: { Icon: DollarSign },
    child: { Icon: Users },
    other: { Icon: Info },
  };

  const { Icon } = iconConfig[category];

  // Consistent grey color for all category icons
  const iconColor = '#718096'; // medium grey

  return (
    <View
      style={[
        styles.iconCircle,
        {
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          backgroundColor: '#f1f5f9' // light grey background
        }
      ]}
    >
      <Icon
        size={size}
        color={iconColor}
        strokeWidth={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
