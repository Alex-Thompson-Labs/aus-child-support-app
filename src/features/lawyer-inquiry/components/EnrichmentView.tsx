/**
 * Enrichment View Component
 *
 * Post-submission data collection screen for additional case factors.
 */

import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getEnrichmentFactors } from '../config';
import {
  containerStyles,
  enrichmentStyles,
  buttonStyles,
} from '../styles';
import type { EnrichmentViewProps } from '../types';

export function EnrichmentView({
  reason,
  onSubmit,
  onSkip,
  isUpdating,
  selectedFactors,
  onFactorToggle,
}: EnrichmentViewProps) {
  return (
    <SafeAreaView style={containerStyles.container} edges={['top', 'bottom']}>
      <View style={enrichmentStyles.enrichmentContainer}>
        {/* Header */}
        <View style={enrichmentStyles.enrichmentHeader}>
          <Text style={enrichmentStyles.enrichmentIcon}>✓</Text>
          <Text style={enrichmentStyles.enrichmentTitle}>Enquiry Sent!</Text>
        </View>

        {/* Subtitle */}
        <Text style={enrichmentStyles.enrichmentSubtitle}>
          (Optional) Help the lawyer prepare by selecting any other factors that
          apply:
        </Text>

        {/* Checkboxes */}
        <ScrollView style={enrichmentStyles.enrichmentFactorsList}>
          {getEnrichmentFactors(reason).map((factor) => {
            const isSelected = selectedFactors.includes(factor.id);
            return (
              <Pressable
                key={factor.id}
                style={enrichmentStyles.enrichmentFactorRow}
                onPress={() => onFactorToggle(factor.id)}
                disabled={isUpdating}
                accessible={true}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={factor.label}
              >
                <View
                  style={[
                    enrichmentStyles.enrichmentCheckbox,
                    isSelected && enrichmentStyles.enrichmentCheckboxChecked,
                  ]}
                >
                  {isSelected && (
                    <Text style={enrichmentStyles.enrichmentCheckboxCheck}>
                      ✓
                    </Text>
                  )}
                </View>
                <Text style={enrichmentStyles.enrichmentFactorLabel}>
                  {factor.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Buttons */}
        <View style={enrichmentStyles.enrichmentButtons}>
          <Pressable
            style={({ pressed }) => [
              buttonStyles.button,
              pressed && buttonStyles.buttonPressed,
              isUpdating && buttonStyles.buttonDisabled,
            ]}
            onPress={onSubmit}
            disabled={isUpdating}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Update Case File"
          >
            {isUpdating ? (
              <View style={buttonStyles.buttonContent}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={buttonStyles.buttonText}>Updating...</Text>
              </View>
            ) : (
              <Text style={buttonStyles.buttonText}>Update Case File</Text>
            )}
          </Pressable>

          <Pressable
            style={enrichmentStyles.enrichmentSkipButton}
            onPress={onSkip}
            disabled={isUpdating}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Skip and Close"
          >
            <Text style={enrichmentStyles.enrichmentSkipButtonText}>
              Skip & Close
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
