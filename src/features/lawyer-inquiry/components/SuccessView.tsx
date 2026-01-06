/**
 * Success View Component
 *
 * Displays a success message after form submission.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { successStyles } from '../styles';

export function SuccessView() {
  return (
    <SafeAreaView style={successStyles.successContainer}>
      <View style={successStyles.successContent}>
        <Text style={successStyles.successIcon}>✓</Text>
        <Text style={successStyles.successTitle}>Thank You!</Text>
        <Text style={successStyles.successMessage}>
          Your inquiry has been submitted.{'\n'}You can expect a call or email
          within the next 1-2 business days.
        </Text>
      </View>
    </SafeAreaView>
  );
}
