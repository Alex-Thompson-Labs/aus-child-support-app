/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';
import type { PartnerConfig } from '@/src/config/partners';

/**
 * Feature flag for partner branding.
 * When false, the theme system behaves exactly as before with no partner overrides.
 * When true, partner branding colors can override the default tint color.
 */
export const PARTNER_BRANDING_ENABLED = false;

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export type ThemeColors = typeof Colors.light;

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
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
export function getThemedColors(partnerConfig: PartnerConfig | null): typeof Colors {
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
