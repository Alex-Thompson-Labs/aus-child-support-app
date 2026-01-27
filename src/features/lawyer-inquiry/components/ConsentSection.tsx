/**
 * Consent Section Component
 *
 * Consent checkbox, privacy policy link, and submit button.
 */

import { PrivacyPolicyLink } from '@/src/components/PrivacyPolicyLink';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { ConsentSectionProps } from '../types';
import { useInquiryStyles } from '../useInquiryStyles';

export function ConsentSection({
  consent,
  onConsentToggle,
  errors,
  touched,
  isSubmitting,
  buttonText,
  onSubmit,
}: ConsentSectionProps) {
  const { checkboxStyles, buttonStyles, formStyles, colors } = useInquiryStyles();

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
            I agree to the{' '}
            <Text
              style={checkboxStyles.checkboxLink}
              onPress={() => {
                if (typeof window !== 'undefined') {
                  window.open('/terms-of-service', '_blank');
                }
              }}
              accessibilityRole="link"
            >
              Terms of Service
            </Text>
            {' '}and consent to Australian Child Support Calculator sharing my contact 
            details and case information with independent family law practitioners for the 
            purpose of arranging a legal consultation. I understand that lawyers are 
            independent contractors who pay to receive my information and that I may be 
            contacted directly by lawyers who are interested in my case. *
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
            <ActivityIndicator color={colors.textInverse} size="small" />
            <Text style={buttonStyles.buttonText}>Submitting...</Text>
          </View>
        ) : (
          <Text style={buttonStyles.buttonText}>{buttonText}</Text>
        )}
      </Pressable>

      {/* Confidentiality Disclaimer */}
      <Text style={buttonStyles.disclaimer}>
        Your information is securely transmitted, strictly confidential, and used solely to
        connect you with legal assistance.
      </Text>
    </>
  );
}
