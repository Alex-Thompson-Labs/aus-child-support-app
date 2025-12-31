import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';

export interface ConsentCheckboxProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Callback when checkbox state changes */
  onCheckedChange: (checked: boolean) => void;
  /** Optional consent text override */
  consentText?: string;
  /** Optional error message to display */
  error?: string;
  /** Optional additional styles for the container */
  containerStyle?: object;
  /** Optional additional styles for the checkbox */
  checkboxStyle?: object;
  /** Optional additional styles for the text */
  textStyle?: object;
}

/**
 * ConsentCheckbox - Reusable consent checkbox component
 *
 * Displays a checkbox with consent text for legal information sharing.
 * Used in lawyer inquiry forms across the application.
 */
export function ConsentCheckbox({
  checked,
  onCheckedChange,
  consentText = 'I consent to my information being shared with legal practitioners for the purpose of providing me with legal advice.',
  error,
  containerStyle,
  checkboxStyle,
  textStyle,
}: ConsentCheckboxProps) {
  const isWeb = Platform.OS === 'web';

  const webClickableStyles = isWeb
    ? {
        cursor: 'pointer' as const,
        userSelect: 'none' as const,
      }
    : {};

  return (
    <View>
      <Pressable
        onPress={() => onCheckedChange(!checked)}
        style={[styles.container, containerStyle, webClickableStyles]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={consentText}
      >
        <View
          style={[
            styles.checkbox,
            checked && styles.checkboxChecked,
            checkboxStyle,
          ]}
        >
          {checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.consentText, textStyle]}>{consentText}</Text>
      </Pressable>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#6b7280', // grey-500 - WCAG AA compliant (4.5:1)
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginTop: 2,
    // Larger hit area for better accessibility
    minWidth: 44,
    minHeight: 44,
    padding: 10,
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6', // blue-500
    borderColor: '#3b82f6',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  consentText: {
    flex: 1,
    fontSize: 13,
    color: '#4b5563', // grey-600
    lineHeight: 19,
    paddingTop: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444', // red-500
    marginTop: 4,
    marginLeft: 34, // Align with text
  },
});
