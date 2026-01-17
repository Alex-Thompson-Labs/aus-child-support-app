/**
 * Success View Component
 *
 * Displays a success message after form submission with manual navigation buttons.
 * Matches the visual hierarchy of Calculator and Assessment Breakdown screens.
 */

import { StepProgressIndicator } from '@/src/components/ui/StepProgressIndicator';
import { isWeb, MAX_CALCULATOR_WIDTH } from '@/src/utils/responsive';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInquiryStyles } from '../useInquiryStyles';

interface SuccessViewProps {
  returnTo?: string;
  partnerName?: string; // e.g., "Sage Family Lawyers" - triggers partner-specific messaging
}

const BRAND_NAVY = '#1e3a8a';

export function SuccessView({ returnTo, partnerName }: SuccessViewProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { successStyles, colors } = useInquiryStyles();

  const handleReturnToCalculator = useCallback(() => {
    try {
      router.replace({
        pathname: '/',
        params: { reset: 'true' },
      });
    } catch (_error) {
      // Fallback to simple replace
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
      Linking.openURL(returnTo).catch((_error) => {
        // Silently fail
      });
    }
  }, [returnTo]);

  const webContainerStyle = isWeb
    ? {
        maxWidth: MAX_CALCULATOR_WIDTH,
        width: '100%' as const,
        alignSelf: 'center' as const,
      }
    : {};

  return (
    <View style={[styles.outerContainer, { paddingTop: insets.top }]}>
      {/* 1. Top Header Bar - First element in DOM */}
      <View style={styles.expandedHeader}>
        <View style={[styles.expandedHeaderContent, webContainerStyle]}>
          <Text style={styles.expandedHeaderTitle}>Request Legal Help</Text>
          <View style={styles.headerActions}>
            <Pressable
              onPress={handleReturnToCalculator}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close and return to calculator"
            >
              <Text style={styles.closeIcon}>✕</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* 2. Progress Indicator - Step 3: Next Steps */}
      <View style={[styles.progressWrapper, webContainerStyle]}>
        <StepProgressIndicator currentStep={3} compact />
      </View>

      {/* 3. Content Card - Inside ScrollView */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.scrollContentContainer,
          { paddingBottom: insets.bottom + 20 },
          webContainerStyle,
        ]}
      >
        <View style={[styles.successCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Success Icon */}
          <Text style={successStyles.successIcon}>✓</Text>
          
          {/* Success Title */}
          <Text style={successStyles.successTitle}>Thank You!</Text>
          
          {/* Success Message */}
          {partnerName ? (
            <>
              <Text style={successStyles.successMessage}>
                Your details have been securely transmitted to{' '}
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

          {/* Action Buttons */}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Outer container - matches Modal structure from CalculatorResults
  outerContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // Header bar - matches expandedHeader from CalculatorResults
  expandedHeader: {
    padding: 4,
    paddingBottom: 4,
    paddingLeft: 24,
    paddingRight: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 0,
  },
  expandedHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expandedHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND_NAVY,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 22,
    color: BRAND_NAVY,
  },
  // Progress wrapper - matches structure from CalculatorResults
  progressWrapper: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  // Scroll container
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
  },
  // Success card - the white content card
  successCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 40,
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.08)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
});
