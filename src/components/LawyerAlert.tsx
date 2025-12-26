// Lawyer Alert Component
// Displays complexity alerts with "Get Legal Help" buttons

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAnalytics } from '../utils/analytics';

interface LawyerAlertProps {
  title: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
  buttonText: string;
  onPress: () => void;
  triggerType?: string;
  annualLiability?: number;
  /**
   * Optional educational tip/note displayed below main message
   * Rendered in lighter color with smaller font
   */
  tip?: string;
}

// Default values for edge case handling
const DEFAULT_TITLE = 'Important Information';
const DEFAULT_MESSAGE = 'You may benefit from professional legal advice.';
const DEFAULT_BUTTON_TEXT = 'Get Help';

export function LawyerAlert({
  title,
  message,
  urgency,
  buttonText,
  onPress,
  triggerType,
  annualLiability,
  tip
}: LawyerAlertProps) {
  // Prevent double-taps with loading state
  const [isPressed, setIsPressed] = useState(false);

  // Track if analytics event has been fired
  const hasTrackedShown = useRef(false);

  // Analytics hook
  const analytics = useAnalytics();

  // Handle edge cases - use defaults for empty strings
  const displayTitle = title?.trim() || DEFAULT_TITLE;
  const displayMessage = message?.trim() || DEFAULT_MESSAGE;
  const displayButtonText = buttonText?.trim() || DEFAULT_BUTTON_TEXT;

  // Track when alert is shown - fires once on mount
  useEffect(() => {
    // Only fire once
    if (hasTrackedShown.current) {
      return;
    }

    hasTrackedShown.current = true;

    if (__DEV__) {
      console.log('[LawyerAlert] Alert shown - tracking analytics', {
        trigger_type: triggerType,
        urgency,
        annual_liability: annualLiability,
      });
    }

    // Track analytics event
    try {
      analytics.track('complexity_alert_shown', {
        trigger_type: triggerType,
        urgency,
        annual_liability: annualLiability,
      });
    } catch (error) {
      console.error('[LawyerAlert] Failed to track alert shown:', error);
    }
  }, [analytics, triggerType, urgency, annualLiability]); // Include dependencies

  const handlePress = useCallback(() => {
    // Prevent double-taps
    if (isPressed) {
      return;
    }

    // Guard against undefined onPress
    if (typeof onPress !== 'function') {
      console.error('[LawyerAlert] onPress is not a function');
      return;
    }

    setIsPressed(true);

    if (__DEV__) {
      console.log('[LawyerAlert] Button pressed');
    }

    // Track analytics - wrapped in try/catch for safety
    try {
      analytics.track('lawyer_button_clicked', {
        trigger_type: triggerType,
        urgency,
        annual_liability: annualLiability,
        alert_title: displayTitle,
        button_text: displayButtonText,
      });
    } catch (error) {
      console.error('[LawyerAlert] Analytics tracking failed:', error);
    }

    // Execute onPress callback
    try {
      onPress();
    } catch (error) {
      console.error('[LawyerAlert] onPress callback failed:', error);
    }

    // Re-enable button after a short delay
    setTimeout(() => setIsPressed(false), 1000);
  }, [isPressed, onPress, displayTitle, urgency, displayButtonText, analytics, triggerType, annualLiability]);

  const isHighUrgency = urgency === 'high';
  const borderColor = isHighUrgency ? '#ef4444' : '#f59e0b';
  const buttonColor = isHighUrgency ? '#ef4444' : '#2563eb';

  // Accessibility: Announce urgency level
  const urgencyLabel = isHighUrgency ? 'Urgent alert' : 'Alert';

  return (
    <View
      style={[styles.container, { borderColor }]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={`${urgencyLabel}: ${displayTitle}. ${displayMessage}`}
    >
      <Text
        style={styles.title}
        accessibilityRole="header"
      >
        {displayTitle}
      </Text>
      <Text style={styles.message}>{displayMessage}</Text>
      {tip && tip.trim() && (
        <Text style={styles.tip}>{tip.trim()}</Text>
      )}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: buttonColor },
          pressed && styles.buttonPressed,
          isPressed && styles.buttonDisabled
        ]}
        onPress={handlePress}
        disabled={isPressed}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={displayButtonText}
        accessibilityHint="Navigates to lawyer inquiry form"
        accessibilityState={{ disabled: isPressed }}
      >
        <Text style={styles.buttonText}>{displayButtonText}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    borderWidth: 1,
    // borderColor is dynamic based on urgency
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 16,
  },
  tip: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    // backgroundColor is dynamic based on urgency
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
