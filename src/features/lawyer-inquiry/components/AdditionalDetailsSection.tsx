/**
 * Additional Details Section Component
 *
 * Message textarea for additional user notes.
 */

import { FormField } from '@/src/components/ui/FormField';
import React from 'react';
import type { AdditionalDetailsSectionProps } from '../types';
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
  const isRequired = financialTags.includes('Other');

  return (
    <FormField
      ref={messageRef}
      label={`Additional Details${isRequired ? '' : ' (Optional)'}`}
      required={isRequired}
      error={errors.message}
      showError={touched.message && !!errors.message}
      charCount={`${message.length}/${VALIDATION.MESSAGE_MAX_LENGTH}`}
      placeholder="Is there anything specific you want the lawyer to know?..."
      value={message}
      onChangeText={(value: string) => onTextChange('message', value, setMessage)}
      onBlur={() => onBlur('message')}
      multiline
      numberOfLines={4}
      maxLength={VALIDATION.MESSAGE_MAX_LENGTH}
      editable={!isSubmitting}
      accessibilityLabel="Additional details"
      accessibilityHint="Enter any additional information you want to share"
    />
  );
}
