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
  // Icon and color mapping
  const iconConfig: Record<ComplexityCategory, { Icon: React.ComponentType<any>; color: string }> = {
    urgent: { Icon: AlertCircle, color: '#dc2626' }, // red-600
    income: { Icon: DollarSign, color: '#d97706' }, // amber-600
    child: { Icon: Users, color: '#7c3aed' }, // violet-600
    other: { Icon: Info, color: '#0891b2' }, // cyan-600
  };

  const { Icon, color } = iconConfig[category];

  // Convert hex to rgba with 10% opacity for background
  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <View
      style={[
        styles.iconCircle,
        {
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          backgroundColor: hexToRgba(color, 0.1) // 10% opacity
        }
      ]}
    >
      <Icon
        size={size}
        color={color}
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
