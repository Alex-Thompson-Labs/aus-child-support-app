import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { isWeb } from '../../utils/responsive';

// ============================================================================
// Types
// ============================================================================

interface DatePickerFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
  disabled?: boolean;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format date as "DD/MM/YYYY" (Australian format, e.g., "31/12/2025")
 */
function formatDisplayDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Convert Date to YYYY-MM-DD string for HTML input
 */
function dateToInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convert YYYY-MM-DD string to Date object
 */
function inputValueToDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

// ============================================================================
// Component
// ============================================================================

export default function DatePickerField({
  label,
  value,
  onChange,
  error,
  disabled = false,
}: DatePickerFieldProps) {
  // Show/hide native picker on mobile
  const [showPicker, setShowPicker] = useState(false);

  // Handle date change from native picker (iOS/Android)
  const handleNativeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      // Android: always hide picker after selection
      setShowPicker(false);
    }

    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    } else if (event.type === 'dismissed') {
      // User cancelled
      if (Platform.OS === 'ios') {
        setShowPicker(false);
      }
    }
  };

  // Handle date change from web input
  const handleWebChange = (event: any) => {
    const inputValue = event.target.value;
    const date = inputValueToDate(inputValue);
    onChange(date);
  };

  // ========================================================================
  // Web Rendering (Hidden date input + visible DD/MM/YYYY display)
  // ========================================================================
  if (isWeb) {
    // Use lighter grey for placeholder (no value), dark for actual date
    const textColor = value ? '#1a202c' : '#9ca3af';

    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <div style={{ position: 'relative', width: '140px' }}>
          {/* Hidden native date input for picker functionality */}
          <input
            type="date"
            value={value ? dateToInputValue(value) : ''}
            onChange={handleWebChange}
            disabled={disabled}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            aria-label={label}
            aria-invalid={!!error}
            aria-describedby={error ? 'date-error' : undefined}
          />
          {/* Visible display showing DD/MM/YYYY format */}
          <div
            style={{
              backgroundColor: '#ffffff',
              color: textColor,
              borderRadius: '8px',
              padding: '12px',
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderColor: error ? '#ef4444' : '#e2e8f0',
              fontSize: '16px',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              width: '100%',
              boxSizing: 'border-box',
              pointerEvents: 'none',
              opacity: disabled ? 0.6 : 1,
              textAlign: 'center',
            }}
          >
            {value ? formatDisplayDate(value) : 'dd/mm/yyyy'}
          </div>
        </div>
        {error && (
          <Text style={styles.errorText} nativeID="date-error">
            {error}
          </Text>
        )}
      </View>
    );
  }

  // ========================================================================
  // Mobile Rendering (Pressable + Native Picker)
  // ========================================================================
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint="Tap to select a date"
        accessibilityState={{ disabled }}
      >
        <Text
          style={[
            styles.inputText,
            !value && styles.inputPlaceholder,
            disabled && styles.inputTextDisabled,
          ]}
        >
          {value ? formatDisplayDate(value) : 'Select date'}
        </Text>
      </Pressable>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Native Date Picker (iOS/Android) */}
      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleNativeChange}
          maximumDate={new Date(2099, 11, 31)} // Reasonable max date
          minimumDate={new Date(1900, 0, 1)} // Reasonable min date
        />
      )}
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    minHeight: 48, // Touch target size
  },
  inputError: {
    borderColor: '#ef4444',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    opacity: 0.6,
  },
  inputText: {
    fontSize: 16,
    color: '#1a202c',
  },
  inputPlaceholder: {
    color: '#64748b',
  },
  inputTextDisabled: {
    color: '#6b7280',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
});
