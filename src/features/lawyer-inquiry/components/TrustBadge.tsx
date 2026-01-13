/**
 * Trust Badge Component
 *
 * Displays a verification badge at the top of the form.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { useInquiryStyles } from '../useInquiryStyles';

export function TrustBadge() {
  const { headerStyles } = useInquiryStyles();

  return (
    <View style={headerStyles.trustBadgeWrapper}>
      <View style={headerStyles.trustBadge}>
        <Text style={headerStyles.trustBadgeIcon}>✓</Text>
        <Text style={headerStyles.trustBadgeText}>
          Verified Australian Family Law Network
        </Text>
      </View>
    </View>
  );
}
