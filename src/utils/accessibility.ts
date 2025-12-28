/**
 * Accessibility Utilities for Web
 *
 * Helper functions to add ARIA attributes and improve accessibility
 * for React Native Web components
 */

import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

/**
 * Props for accessible text inputs
 */
export interface AccessibleTextInputProps {
  label: string;
  hint?: string;
  error?: string;
  errorId?: string;
}

/**
 * Get accessibility props for TextInput components
 * Includes both React Native and web-specific ARIA attributes
 */
export function getTextInputA11yProps({
  label,
  hint,
  error,
  errorId,
}: AccessibleTextInputProps) {
  const baseProps = {
    accessibilityLabel: label,
    ...(hint && { accessibilityHint: hint }),
    accessibilityRole: 'none' as const, // Prevent RN from adding role on web
  };

  const webProps = isWeb ? {
    role: 'textbox' as any,
    'aria-label': label,
    ...(hint && { 'aria-describedby': hint }),
    ...(error && {
      'aria-invalid': true,
      'aria-describedby': errorId,
    }),
  } : {};

  return { ...baseProps, ...webProps };
}

/**
 * Props for accessible buttons
 */
export interface AccessibleButtonProps {
  label: string;
  hint?: string;
  disabled?: boolean;
  pressed?: boolean;
}

/**
 * Get accessibility props for Pressable/Button components
 */
export function getButtonA11yProps({
  label,
  hint,
  disabled = false,
  pressed = false,
}: AccessibleButtonProps) {
  const baseProps = {
    accessibilityLabel: label,
    accessibilityRole: 'button' as const,
    ...(hint && { accessibilityHint: hint }),
    accessibilityState: {
      disabled,
      ...(pressed !== undefined && { pressed }),
    },
  };

  const webProps = isWeb ? {
    role: 'button' as any,
    'aria-label': label,
    'aria-disabled': disabled,
    ...(pressed !== undefined && { 'aria-pressed': pressed }),
    tabIndex: disabled ? -1 : 0,
  } : {};

  return { ...baseProps, ...webProps };
}

/**
 * Props for accessible switches/toggles
 */
export interface AccessibleSwitchProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
}

/**
 * Get accessibility props for Switch components
 */
export function getSwitchA11yProps({
  label,
  checked,
  disabled = false,
}: AccessibleSwitchProps) {
  const baseProps = {
    accessibilityLabel: label,
    accessibilityRole: 'switch' as const,
    accessibilityState: {
      checked,
      disabled,
    },
  };

  const webProps = isWeb ? {
    role: 'switch' as any,
    'aria-label': label,
    'aria-checked': checked,
    'aria-disabled': disabled,
  } : {};

  return { ...baseProps, ...webProps };
}

/**
 * Props for accessible modals/dialogs
 */
export interface AccessibleModalProps {
  titleId: string;
  descriptionId?: string;
}

/**
 * Get accessibility props for Modal components
 */
export function getModalA11yProps({
  titleId,
  descriptionId,
}: AccessibleModalProps) {
  const baseProps = {
    accessibilityViewIsModal: true,
  };

  const webProps = isWeb ? {
    role: 'dialog' as any,
    'aria-modal': true,
    'aria-labelledby': titleId,
    ...(descriptionId && { 'aria-describedby': descriptionId }),
  } : {};

  return { ...baseProps, ...webProps };
}

/**
 * Props for accessible error messages
 */
export interface AccessibleErrorProps {
  id: string;
}

/**
 * Get accessibility props for error message Text components
 */
export function getErrorA11yProps({ id }: AccessibleErrorProps) {
  const baseProps = {
    accessibilityRole: 'alert' as const,
    accessibilityLive: 'polite' as const,
  };

  const webProps = isWeb ? {
    id,
    role: 'alert' as any,
    'aria-live': 'polite',
  } : {};

  return { ...baseProps, ...webProps };
}

/**
 * Props for semantic regions/landmarks
 */
export interface SemanticRegionProps {
  role: 'main' | 'navigation' | 'form' | 'region' | 'complementary' | 'banner' | 'contentinfo';
  label?: string;
}

/**
 * Get accessibility props for semantic View containers
 */
export function getSemanticRegionProps({
  role,
  label,
}: SemanticRegionProps) {
  if (!isWeb) {
    return {};
  }

  return {
    role: role as any,
    ...(label && { 'aria-label': label }),
  };
}

/**
 * Props for expandable/collapsible elements
 */
export interface AccessibleExpandableProps {
  label: string;
  expanded: boolean;
  controlsId?: string;
}

/**
 * Get accessibility props for expandable button triggers
 */
export function getExpandableA11yProps({
  label,
  expanded,
  controlsId,
}: AccessibleExpandableProps) {
  const baseProps = {
    accessibilityLabel: label,
    accessibilityRole: 'button' as const,
    accessibilityState: { expanded },
  };

  const webProps = isWeb ? {
    role: 'button' as any,
    'aria-label': label,
    'aria-expanded': expanded,
    ...(controlsId && { 'aria-controls': controlsId }),
    tabIndex: 0,
  } : {};

  return { ...baseProps, ...webProps };
}

/**
 * Add keyboard event handlers for custom interactive elements
 */
export function getKeyboardHandlers(onActivate: () => void) {
  if (!isWeb) {
    return {};
  }

  return {
    onKeyDown: (e: any) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onActivate();
      }
    },
  };
}

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Set focus to an element by ID (web only)
   */
  focusElementById(id: string) {
    if (!isWeb) return;

    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (element) {
        element.focus();
      }
    });
  },

  /**
   * Trap focus within a container (for modals)
   */
  setupFocusTrap(containerId: string) {
    if (!isWeb) return () => {};

    const container = document.getElementById(containerId);
    if (!container) return () => {};

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Focus first element
    firstElement?.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  },
};

/**
 * Screen reader announcement utility
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (!isWeb) return;

  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';

  document.body.appendChild(announcement);

  // Small delay to ensure screen reader picks it up
  setTimeout(() => {
    announcement.textContent = message;
  }, 100);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Get visual focus styles for web
 */
export const webFocusStyles = isWeb ? {
  outlineStyle: 'solid' as any,
  outlineWidth: '2px' as any,
  outlineColor: '#3b82f6' as any, // blue-500
  outlineOffset: '2px' as any,
} : {};

/**
 * Create focus event handlers that apply visible focus ring
 */
export function getFocusRingHandlers() {
  if (!isWeb) return {};

  return {
    onFocus: (e: any) => {
      e.currentTarget.style.outline = '2px solid #3b82f6';
      e.currentTarget.style.outlineOffset = '2px';
    },
    onBlur: (e: any) => {
      e.currentTarget.style.outline = 'none';
    },
  };
}
