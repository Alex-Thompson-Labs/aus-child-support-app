/**
 * FormField Component
 *
 * Standardized form field wrapper with label, input, and error display.
 * Reduces boilerplate for form inputs across the app.
 */

import { useAppTheme } from '@/src/theme';
import React, { forwardRef, ReactNode } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';

interface FormFieldProps extends Omit<TextInputProps, 'style'> {
  /** Field label text */
  label: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Whether to show the error (typically touched && error) */
  showError?: boolean;
  /** Helper text below the input */
  helperText?: string;
  /** Character count display (e.g., "50/500") */
  charCount?: string;
  /** Custom input styles */
  inputStyle?: TextStyle;
  /** Custom container styles */
  containerStyle?: ViewStyle;
  /** Render custom input instead of TextInput */
  children?: ReactNode;
  /** Whether this is a multiline textarea */
  multiline?: boolean;
  /** Number of lines for textarea */
  numberOfLines?: number;
}

export const FormField = forwardRef<TextInput, FormFieldProps>(
  (
    {
      label,
      required = false,
      error,
      showError = true,
      helperText,
      charCount,
      inputStyle,
      containerStyle,
      children,
      multiline = false,
      numberOfLines = 4,
      ...textInputProps
    },
    ref
  ) => {
    const { colors } = useAppTheme();

    const hasError = showError && !!error;

    return (
      <View style={[styles.container, containerStyle]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label} {required && '*'}
        </Text>

        {children ?? (
          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                color: colors.inputText,
                borderColor: hasError ? colors.errorBorder : colors.inputBorder,
              },
              multiline && styles.textArea,
              inputStyle,
            ]}
            placeholderTextColor={colors.textMuted}
            multiline={multiline}
            numberOfLines={multiline ? numberOfLines : undefined}
            textAlignVertical={multiline ? 'top' : 'center'}
            {...textInputProps}
          />
        )}

        {(charCount || helperText) && (
          <View style={styles.bottomRow}>
            {helperText && (
              <Text style={[styles.helperText, { color: colors.textMuted }]}>
                {helperText}
              </Text>
            )}
            {charCount && (
              <Text style={[styles.charCount, { color: colors.textMuted }]}>
                {charCount}
              </Text>
            )}
          </View>
        )}

        {hasError && (
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        )}
      </View>
    );
  }
);

FormField.displayName = 'FormField';

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1.5,
    fontSize: 16,
  },
  textArea: {
    height: 152,
    paddingTop: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    flex: 1,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
