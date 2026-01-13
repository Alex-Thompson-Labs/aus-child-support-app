/**
 * Special Circumstances Section Component
 *
 * Displays selected special circumstances as cards.
 */

import React from 'react';
import { Text, View } from 'react-native';
import type { SpecialCircumstancesSectionProps } from '../types';
import { useInquiryStyles } from '../useInquiryStyles';

export function SpecialCircumstancesSection({
  circumstances,
}: SpecialCircumstancesSectionProps) {
  const { circumstancesStyles } = useInquiryStyles();

  if (circumstances.length === 0) {
    return null;
  }

  return (
    <View
      style={circumstancesStyles.specialCircumstancesSection}
      accessibilityRole={'group' as any}
      accessibilityLabel="Special Circumstances"
    >
      {circumstances.map((circumstance) => (
        <View
          key={circumstance.id}
          style={circumstancesStyles.specialCircumstanceCard}
        >
          <View style={circumstancesStyles.specialCircumstanceHeader}>
            <Text style={circumstancesStyles.specialCircumstanceIcon}>⚠</Text>
            <View style={circumstancesStyles.specialCircumstanceTextContainer}>
              <Text style={circumstancesStyles.specialCircumstanceTitle}>
                {circumstance.label}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
