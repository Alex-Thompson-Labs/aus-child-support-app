/**
 * Haptic Feedback Utilities
 *
 * Provides platform-aware haptic feedback for mobile devices.
 * Gracefully handles web and unsupported platforms.
 */
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Check if the current platform supports haptic feedback
 */
const supportsHaptics = (): boolean => {
    // Only iOS and Android support haptics, not web
    return Platform.OS !== 'web';
};

/**
 * Trigger a success haptic feedback pattern.
 * Used for positive confirmations like successful calculations.
 *
 * Uses NotificationFeedbackType.Success which provides a distinct
 * "success" feel on supported devices.
 */
export const triggerSuccessHaptic = async (): Promise<void> => {
    if (!supportsHaptics()) {
        return;
    }

    try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
        // Silently fail - haptics are a nice-to-have, not critical
        console.debug('Haptic feedback failed:', error);
    }
};

/**
 * Trigger a light impact haptic feedback.
 * Used for subtle interactions like button presses.
 */
export const triggerLightHaptic = async (): Promise<void> => {
    if (!supportsHaptics()) {
        return;
    }

    try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
        console.debug('Haptic feedback failed:', error);
    }
};

/**
 * Trigger a medium impact haptic feedback.
 * Used for more noticeable interactions.
 */
export const triggerMediumHaptic = async (): Promise<void> => {
    if (!supportsHaptics()) {
        return;
    }

    try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
        console.debug('Haptic feedback failed:', error);
    }
};

/**
 * Trigger an error haptic feedback pattern.
 * Used for validation errors or failed operations.
 */
export const triggerErrorHaptic = async (): Promise<void> => {
    if (!supportsHaptics()) {
        return;
    }

    try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
        console.debug('Haptic feedback failed:', error);
    }
};

/**
 * Trigger a warning haptic feedback pattern.
 * Used for cautionary notifications.
 */
export const triggerWarningHaptic = async (): Promise<void> => {
    if (!supportsHaptics()) {
        return;
    }

    try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
        console.debug('Haptic feedback failed:', error);
    }
};

/**
 * Trigger a selection change haptic.
 * Used for picker/selection interactions.
 */
export const triggerSelectionHaptic = async (): Promise<void> => {
    if (!supportsHaptics()) {
        return;
    }

    try {
        await Haptics.selectionAsync();
    } catch (error) {
        console.debug('Haptic feedback failed:', error);
    }
};
