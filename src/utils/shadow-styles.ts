/**
 * Shadow Style Utilities
 * 
 * Provides cross-platform shadow styles that work on both native and web.
 * On web, consolidates shadow properties into boxShadow to avoid deprecation warnings.
 */

import { Platform, ViewStyle } from 'react-native';

export interface ShadowConfig {
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
}

/**
 * Create cross-platform shadow styles
 * - Native: Uses shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation
 * - Web: Uses boxShadow CSS property
 */
export function createShadow(config: ShadowConfig): ViewStyle {
  const {
    shadowColor = '#000',
    shadowOffset = { width: 0, height: 2 },
    shadowOpacity = 0.1,
    shadowRadius = 4,
    elevation = 2,
  } = config;

  if (Platform.OS === 'web') {
    // Convert to CSS box-shadow format: offsetX offsetY blurRadius spreadRadius color
    const { width: offsetX, height: offsetY } = shadowOffset;
    const alpha = shadowOpacity;
    const blur = shadowRadius;
    
    // Convert hex color to rgba
    const color = shadowColor === '#000' || shadowColor === '#000000'
      ? `rgba(0, 0, 0, ${alpha})`
      : `${shadowColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;

    return {
      // @ts-ignore - boxShadow is valid on web
      boxShadow: `${offsetX}px ${offsetY}px ${blur}px 0px ${color}`,
    };
  }

  // Native platforms use standard shadow properties
  return {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation, // Android
  };
}

/**
 * Pre-defined shadow presets for common use cases
 */
export const shadowPresets = {
  small: createShadow({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  }),
  medium: createShadow({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  }),
  large: createShadow({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  }),
  card: createShadow({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }),
  elevated: createShadow({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  }),
  modal: createShadow({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  }),
};
