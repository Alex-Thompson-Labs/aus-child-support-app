/**
 * Unified Theme System
 * 
 * Single source of truth for all colors in light and dark modes.
 * Components should use the useAppTheme() hook from src/theme.ts to access these colors.
 */

import type { PartnerConfig } from '@/src/config/partners';
import { Platform } from 'react-native';

/**
 * Feature flag for partner branding.
 * When false, the theme system behaves exactly as before with no partner overrides.
 * When true, partner branding colors can override the default tint color.
 */
export const PARTNER_BRANDING_ENABLED = false;

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

/**
 * Semantic color tokens for the application.
 * These provide consistent naming across light/dark modes.
 */
export const SemanticColors = {
  light: {
    // Core UI colors
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,

    // Text hierarchy (Slate palette)
    textPrimary: '#0f172a',      // Slate 900 - main headings and key values
    textSecondary: '#334155',    // Slate 700 - labels and secondary text
    textMuted: '#64748b',        // Slate 500 - captions, hints, muted content
    textInverse: '#ffffff',      // White text on dark backgrounds

    // Surfaces and backgrounds
    surface: '#ffffff',          // Pure white for main card surfaces
    surfaceSubtle: '#f8fafc',    // Slate 50 - subtle backgrounds for inner cards
    backgroundNeutral: '#f8fafc', // Slate 50 - alias for surfaceSubtle

    // Borders and dividers
    border: '#e2e8f0',           // Slate 200 - borders and dividers
    borderSubtle: '#f1f5f9',     // Slate 100 - very subtle borders

    // Brand colors
    primary: '#2563EB',          // Blue 600 - primary brand color
    primaryDark: '#1e3a8a',      // Blue 900 - dark brand blue
    primaryLight: '#eff6ff',     // Blue 50 - ghost blue background
    primaryBorder: '#bfdbfe',    // Blue 200 - light blue border

    // User highlight (for "You" elements)
    userHighlight: '#3b82f6',    // Blue 500 - bright blue for current user

    // Semantic colors
    error: '#dc2626',            // Red 600 - errors and negative values
    errorLight: 'rgba(239, 68, 68, 0.1)', // Red with opacity for error backgrounds
    errorBorder: '#ef4444',      // Red 500 - error borders

    // Input colors
    inputBackground: '#ffffff',
    inputBorder: '#e2e8f0',
    inputText: '#1a202c',
    placeholder: '#64748b',

    // Button colors
    buttonPrimary: '#0056b3',    // Royal Blue - primary button
    buttonPrimaryText: '#ffffff',
    buttonSecondary: '#ffffff',
    buttonSecondaryText: '#4a5568',
    buttonSecondaryBorder: '#e2e8f0',

    // Card colors
    cardBackground: '#ffffff',
    cardBorder: '#e2e8f0',

    // Shadow color (for createShadow utility)
    shadow: '#000',
  },
  dark: {
    // Core UI colors
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    // Text hierarchy
    textPrimary: '#f1f5f9',      // Slate 100 - main headings and key values
    textSecondary: '#cbd5e1',    // Slate 300 - labels and secondary text
    textMuted: '#94a3b8',        // Slate 400 - captions, hints, muted content
    textInverse: '#0f172a',      // Dark text on light backgrounds

    // Surfaces and backgrounds
    surface: '#1e293b',          // Slate 800 - main card surfaces
    surfaceSubtle: '#0f172a',    // Slate 900 - subtle backgrounds
    backgroundNeutral: '#0f172a', // Slate 900 - alias for surfaceSubtle

    // Borders and dividers
    border: '#334155',           // Slate 700 - borders and dividers
    borderSubtle: '#1e293b',     // Slate 800 - very subtle borders

    // Brand colors
    primary: '#3b82f6',          // Blue 500 - primary brand color (brighter for dark mode)
    primaryDark: '#60a5fa',      // Blue 400 - lighter for dark mode headings
    primaryLight: '#1e3a5f',     // Dark blue background
    primaryBorder: '#1e40af',    // Blue 800 - dark blue border

    // User highlight (for "You" elements)
    userHighlight: '#60a5fa',    // Blue 400 - brighter for dark mode

    // Semantic colors
    error: '#f87171',            // Red 400 - errors (brighter for dark mode)
    errorLight: 'rgba(239, 68, 68, 0.2)', // Red with opacity for error backgrounds
    errorBorder: '#ef4444',      // Red 500 - error borders

    // Input colors
    inputBackground: '#1e293b',  // Slate 800
    inputBorder: '#334155',      // Slate 700
    inputText: '#f1f5f9',        // Slate 100
    placeholder: '#64748b',      // Slate 500

    // Button colors
    buttonPrimary: '#3b82f6',    // Blue 500 - primary button
    buttonPrimaryText: '#ffffff',
    buttonSecondary: '#1e293b',  // Slate 800
    buttonSecondaryText: '#cbd5e1', // Slate 300
    buttonSecondaryBorder: '#334155', // Slate 700

    // Card colors
    cardBackground: '#1e293b',   // Slate 800
    cardBorder: '#334155',       // Slate 700

    // Shadow color
    shadow: '#000',
  },
} as const;

export type SemanticColorScheme = typeof SemanticColors.light;

// Interface for legacy Colors (used by useThemeColor hook)
export interface LegacyThemeColors {
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

// Legacy Colors export for backward compatibility
export type ThemeColors = LegacyThemeColors;

export const Colors: { light: LegacyThemeColors; dark: LegacyThemeColors } = {
  light: {
    text: SemanticColors.light.text,
    background: SemanticColors.light.background,
    tint: SemanticColors.light.tint,
    icon: SemanticColors.light.icon,
    tabIconDefault: SemanticColors.light.tabIconDefault,
    tabIconSelected: SemanticColors.light.tabIconSelected,
  },
  dark: {
    text: SemanticColors.dark.text,
    background: SemanticColors.dark.background,
    tint: SemanticColors.dark.tint,
    icon: SemanticColors.dark.icon,
    tabIconDefault: SemanticColors.dark.tabIconDefault,
    tabIconSelected: SemanticColors.dark.tabIconSelected,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

/**
 * Get themed colors with optional partner branding overrides.
 * If PARTNER_BRANDING_ENABLED is false, returns default Colors regardless of partner.
 * If enabled and a partner is provided, overrides tint colors with partner's primary color.
 */
export function getThemedColors(partnerConfig: PartnerConfig | null): { light: ThemeColors; dark: ThemeColors } {
  if (!PARTNER_BRANDING_ENABLED || !partnerConfig) {
    return Colors;
  }

  const partnerTint = partnerConfig.branding.primary;

  return {
    light: {
      ...Colors.light,
      tint: partnerTint,
      tabIconSelected: partnerTint,
    },
    dark: {
      ...Colors.dark,
      // Keep dark mode tint as-is (white) for contrast
    },
  };
}
