/**
 * Consent Section Component
 *
 * Consent checkbox, privacy policy link, and submit button.
 */

import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { PrivacyPolicyLink } from '@/src/components/PrivacyPolicyLink';
import { checkboxStyles, buttonStyles, formStyles } from '../styles';
import type { ConsentSectionProps } from '../types';

export function ConsentSection({
  consent,
  onConsentToggle,
  errors,
  touched,
  isSubmitting,
  buttonText,
  onSubmit,
}: ConsentSectionProps) {
  return (
    <>
      {/* Consent Checkbox */}
      <Pressable
        style={checkboxStyles.checkboxContainer}
        onPress={onConsentToggle}
        disabled={isSubmitting}
        accessible={true}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: consent }}
        accessibilityLabel="Consent to share information with legal practitioners"
      >
        <View
          style={[
            checkboxStyles.checkbox,
            consent && checkboxStyles.checkboxChecked,
            touched.consent && errors.consent && checkboxStyles.checkboxError,
          ]}
        >
          {consent && <Text style={checkboxStyles.checkboxCheck}>✓</Text>}
        </View>
        <View style={checkboxStyles.checkboxTextContainer}>
          <Text style={checkboxStyles.checkboxLabel}>
            I consent to my information being shared with legal practitioners
            for the purpose of consultation. *
          </Text>
        </View>
      </Pressable>
      {touched.consent && errors.consent && (
        <Text style={[formStyles.errorText, checkboxStyles.checkboxErrorText]}>
          {errors.consent}
        </Text>
      )}

      {/* Privacy Policy Link */}
      <PrivacyPolicyLink
        containerStyle={checkboxStyles.privacyLinkContainer}
        textStyle={checkboxStyles.privacyLink}
      />

      {/* Submit Button with Dynamic Text */}
      <Pressable
        style={({ pressed }) => [
          buttonStyles.button,
          pressed && buttonStyles.buttonPressed,
          isSubmitting && buttonStyles.buttonDisabled,
        ]}
        onPress={onSubmit}
        disabled={isSubmitting}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={isSubmitting ? 'Submitting inquiry' : buttonText}
        accessibilityState={{ disabled: isSubmitting }}
      >
        {isSubmitting ? (
          <View style={buttonStyles.buttonContent}>
            <ActivityIndicator color="#ffffff" size="small" />
            <Text style={buttonStyles.buttonText}>Submitting...</Text>
          </View>
        ) : (
          <Text style={buttonStyles.buttonText}>{buttonText}</Text>
        )}
      </Pressable>

      {/* Confidentiality Disclaimer */}
      <Text style={buttonStyles.disclaimer}>
        Your financial data is strictly confidential and used only for conflict
        checks.
      </Text>
    </>
  );
}
