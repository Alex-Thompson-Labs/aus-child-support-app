/**
 * Additional Details Section Component
 *
 * Message textarea for additional user notes.
 */

import React from 'react';
import { Text, TextInput, View } from 'react-native';
import type { AdditionalDetailsSectionProps } from '../types';
import { useInquiryStyles } from '../useInquiryStyles';
import { VALIDATION } from '../validators';

export function AdditionalDetailsSection({
  message,
  setMessage,
  financialTags,
  errors,
  touched,
  isSubmitting,
  onTextChange,
  onBlur,
  messageRef,
}: AdditionalDetailsSectionProps) {
  const { formStyles, colors } = useInquiryStyles();
  const isRequired = financialTags.includes('Other');

  return (
    <View style={formStyles.inputContainer}>
      <Text style={formStyles.fieldLabel}>
        Additional Details {isRequired ? '*' : '(Optional)'}
      </Text>
      <TextInput
        ref={messageRef}
        style={[
          formStyles.input,
          formStyles.textArea,
          touched.message && errors.message && formStyles.inputError,
        ]}
        placeholder="Is there anything specific you want the lawyer to know?..."
        placeholderTextColor={colors.textMuted}
        value={message}
        onChangeText={(value) => onTextChange('message', value, setMessage)}
        onBlur={() => onBlur('message')}
        multiline
        numberOfLines={4}
        maxLength={VALIDATION.MESSAGE_MAX_LENGTH}
        editable={!isSubmitting}
        accessibilityLabel="Additional details"
        accessibilityHint="Enter any additional information you want to share"
      />
      <Text style={formStyles.charCount}>
        {message.length}/{VALIDATION.MESSAGE_MAX_LENGTH}
      </Text>
      {touched.message && errors.message && (
        <Text style={formStyles.errorText}>{errors.message}</Text>
      )}
    </View>
  );
}
