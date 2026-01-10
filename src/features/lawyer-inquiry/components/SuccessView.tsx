/**
 * Success View Component
 *
 * Displays a success message after form submission with manual navigation buttons.
 */

import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Linking, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { successStyles } from '../styles';

interface SuccessViewProps {
  returnTo?: string;
  partnerName?: string; // e.g., "Sage Family Lawyers" - triggers partner-specific messaging
}

export function SuccessView({ returnTo, partnerName }: SuccessViewProps) {
  const router = useRouter();

  const handleReturnToCalculator = useCallback(() => {
    try {
      router.replace({
        pathname: '/',
        params: { reset: 'true' },
      });
    } catch (error) {
      console.error('[SuccessView] Navigation error:', error);
      router.replace('/');
    }
  }, [router]);

  const handleReturnToBlog = useCallback(() => {
    if (!returnTo) return;

    if (Platform.OS === 'web') {
      // On web, use window.location for external URLs
      window.location.href = returnTo;
    } else {
      // On native, use Linking for external URLs
      Linking.openURL(returnTo).catch((error) => {
        console.error('[SuccessView] Failed to open URL:', error);
      });
    }
  }, [returnTo]);

  return (
    <SafeAreaView style={successStyles.successContainer}>
      <View style={successStyles.successContent}>
        <Text style={successStyles.successIcon}>✓</Text>
        <Text style={successStyles.successTitle}>Thank You!</Text>
        {partnerName ? (
          <>
            <Text style={successStyles.successMessage}>
              Your details have been securely encrypted and sent to{' '}
              {partnerName} via our protected portal. They will contact you
              within 24 hours.
            </Text>
            <View style={successStyles.partnerBadge}>
              <Text style={successStyles.partnerBadgeText}>
                Secured by AusChildSupport
              </Text>
            </View>
          </>
        ) : (
          <Text style={successStyles.successMessage}>
            Your inquiry has been submitted.{'\n'}You can expect a call or email
            within the next 1-2 business days.
          </Text>
        )}

        <View style={successStyles.successButtonsContainer}>
          <Pressable
            style={({ pressed }) => [
              successStyles.successButton,
              pressed && successStyles.successButtonPressed,
            ]}
            onPress={handleReturnToCalculator}
          >
            <Text style={successStyles.successButtonText}>
              Return to Calculator
            </Text>
          </Pressable>

          {returnTo && (
            <Pressable
              style={({ pressed }) => [
                successStyles.successButtonSecondary,
                pressed && successStyles.successButtonSecondaryPressed,
              ]}
              onPress={handleReturnToBlog}
            >
              <Text style={successStyles.successButtonSecondaryText}>
                Return to Blog
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
