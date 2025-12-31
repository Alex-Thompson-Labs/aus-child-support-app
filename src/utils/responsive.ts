/**
 * Responsive design utilities for web
 * Provides breakpoints, responsive hooks, and platform-aware styling
 */

import { Platform, useWindowDimensions } from 'react-native';

// Breakpoints (inspired by Tailwind CSS)
export const BREAKPOINTS = {
  sm: 640, // Small phones
  md: 768, // Tablets
  lg: 1024, // Small laptops
  xl: 1280, // Desktops
  '2xl': 1536, // Large screens
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// Max content width for readability
export const MAX_CONTENT_WIDTH = 680;
export const MAX_FORM_WIDTH = 560;
export const MAX_MODAL_WIDTH = 750; // Match calculator form desktopConstraint

// Desktop two-column layout constants
export const MAX_TWO_COLUMN_WIDTH = 1400; // Max container width for desktop
export const FORM_COLUMN_WIDTH = 480; // Left column fixed width
export const COLUMN_GAP = 32; // Gap between columns

/**
 * Check if we're on web platform
 */
export const isWeb = Platform.OS === 'web';

/**
 * Hook that returns responsive information
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const breakpoint = getBreakpoint(width);
  const isMobile = width < BREAKPOINTS.md;
  const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
  const isDesktop = width >= BREAKPOINTS.lg;
  const isDesktopWeb = isWeb && width >= BREAKPOINTS.lg; // Original two-column layout threshold
  const isTabletOrDesktop = isWeb && width >= BREAKPOINTS.md; // New horizontal layout threshold (≥768px)

  // Calculate content container style
  const containerStyle = {
    width: '100%' as const,
    maxWidth: isWeb ? MAX_CONTENT_WIDTH : undefined,
    alignSelf: 'center' as const,
    paddingHorizontal: isDesktop ? 24 : isMobile ? 16 : 20,
  };

  // Calculate form container style (narrower for focused forms)
  const formContainerStyle = {
    width: '100%' as const,
    maxWidth: isWeb ? MAX_FORM_WIDTH : undefined,
    alignSelf: 'center' as const,
  };

  return {
    width,
    height,
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isDesktopWeb,
    isTabletOrDesktop,
    isWeb,
    containerStyle,
    formContainerStyle,
  };
}

/**
 * Get current breakpoint name based on width
 */
function getBreakpoint(width: number): Breakpoint | 'xs' {
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

/**
 * Create responsive value that changes based on breakpoint
 * Usage: responsiveValue({ xs: 16, md: 20, lg: 24 }, width)
 */
export function responsiveValue<T>(
  values: Partial<Record<Breakpoint | 'xs', T>>,
  width: number
): T | undefined {
  const breakpoint = getBreakpoint(width);
  const breakpointOrder: (Breakpoint | 'xs')[] = [
    '2xl',
    'xl',
    'lg',
    'md',
    'sm',
    'xs',
  ];

  // Find the first defined value at or below current breakpoint
  const currentIndex = breakpointOrder.indexOf(breakpoint);
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }

  return undefined;
}

/**
 * Get responsive spacing value
 */
export function getSpacing(base: number, width: number): number {
  if (width >= BREAKPOINTS.lg) return base * 1.25;
  if (width >= BREAKPOINTS.md) return base * 1.1;
  return base;
}

/**
 * Get responsive font size
 */
export function getFontSize(base: number, width: number): number {
  // Slightly larger fonts on desktop for readability
  if (width >= BREAKPOINTS.lg) return base * 1.05;
  return base;
}

/**
 * Web-specific styles that should only apply on web platform
 */
export const webOnlyStyles = isWeb
  ? {
    // Improve text rendering on web
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const,

    // Better cursor for interactive elements
    cursor: 'default' as const,

    // Disable text selection on UI elements
    userSelect: 'none' as const,
  }
  : {};

/**
 * Clickable element styles for web (pointer cursor, etc.)
 */
export const webClickableStyles = isWeb
  ? {
    cursor: 'pointer' as const,
  }
  : {};

/**
 * Input-specific web styles
 * Note: These are web-only CSS properties, cast to any to avoid TS errors
 */
export const webInputStyles: any = isWeb
  ? {
    outlineStyle: 'none',
    // Allow text selection in inputs
    userSelect: 'text',
    // Add smooth transitions for focus states
    transition:
      'border-color 150ms ease-in-out, box-shadow 150ms ease-in-out',
    // Hide spinner arrows on numeric inputs for cleaner UI
    // WebKit browsers (Chrome, Safari, Edge)
    '::-webkit-outer-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    '::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    // Firefox
    MozAppearance: 'textfield',
  }
  : {};

/**
 * Transition styles for interactive elements (web only)
 * Apply to buttons, cards, and other clickable elements for smooth state changes
 */
export const webTransitionStyles: any = isWeb
  ? {
    transition: 'all 150ms ease-in-out',
  }
  : {};

/**
 * Focus ring styles for accessibility (web only)
 * Provides visible focus indicator for keyboard navigation
 */
export const webFocusStyles: any = isWeb
  ? {
    ':focus': {
      outlineWidth: '3px',
      outlineStyle: 'solid',
      outlineColor: 'rgba(59, 130, 246, 0.5)', // blue-500 with opacity
      outlineOffset: '2px',
    },
    ':focus-visible': {
      outlineWidth: '3px',
      outlineStyle: 'solid',
      outlineColor: 'rgba(59, 130, 246, 0.5)',
      outlineOffset: '2px',
    },
  }
  : {};

/**
 * Hover styles for buttons and interactive cards (web only)
 */
export const webHoverButtonStyles: any = isWeb
  ? {
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
  }
  : {};

export const webHoverCardStyles: any = isWeb
  ? {
    ':hover': {
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    },
  }
  : {};

