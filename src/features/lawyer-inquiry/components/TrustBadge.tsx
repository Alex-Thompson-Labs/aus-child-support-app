/**
 * Trust Badge Component
 *
 * Displays a verification badge at the top of the form.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { isWeb, MAX_FORM_WIDTH } from '@/src/utils/responsive';
import { headerStyles } from '../styles';

export function TrustBadge() {
  // Web container styles to match form content width
  const webContainerStyle = isWeb
    ? {
        maxWidth: MAX_FORM_WIDTH,
        width: '100%' as const,
        marginLeft: 'auto' as const,
        marginRight: 'auto' as const,
      }
    : {};

  return (
    <View style={headerStyles.trustBadgeWrapper}>
      <View style={[headerStyles.trustBadge, webContainerStyle]}>
        <Text style={headerStyles.trustBadgeIcon}>✓</Text>
        <Text style={headerStyles.trustBadgeText}>
          Verified Australian Family Law Network
        </Text>
      </View>
    </View>
  );
}
