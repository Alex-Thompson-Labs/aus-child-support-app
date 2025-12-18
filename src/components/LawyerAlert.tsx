// Lawyer Alert Component
// Displays complexity alerts with "Get Legal Help" buttons

import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Analytics } from '../utils/analytics';

interface LawyerAlertProps {
  title: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
  buttonText: string;
  onPress: () => void;
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
  onPress
}: LawyerAlertProps) {
  // Prevent double-taps with loading state
  const [isPressed, setIsPressed] = useState(false);

  // Handle edge cases - use defaults for empty strings
  const displayTitle = title?.trim() || DEFAULT_TITLE;
  const displayMessage = message?.trim() || DEFAULT_MESSAGE;
  const displayButtonText = buttonText?.trim() || DEFAULT_BUTTON_TEXT;

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
      Analytics.track('lawyer_button_clicked', {
        alert_title: displayTitle,
        urgency,
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
  }, [isPressed, onPress, displayTitle, urgency, displayButtonText]);

  const isHighUrgency = urgency === 'high';
  const borderColor = isHighUrgency ? '#ef4444' : '#334155';
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
