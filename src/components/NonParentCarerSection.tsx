import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NonParentCarerInfo } from '../utils/calculator';
import {
  isWeb,
  useResponsive,
  webClickableStyles,
  webInputStyles,
} from '../utils/responsive';
import { HelpTooltip } from './HelpTooltip';

// ============================================================================
// NonParentCarerSection - Toggle and care percentage input for Formula 4
// ============================================================================

export interface NonParentCarerSectionProps {
  nonParentCarer: NonParentCarerInfo;
  onNonParentCarerChange: (info: NonParentCarerInfo) => void;
  error?: string;
}

export function NonParentCarerSection({
  nonParentCarer,
  onNonParentCarerChange,
  error,
}: NonParentCarerSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isMobile } = useResponsive();

  const handleToggle = (enabled: boolean) => {
    onNonParentCarerChange({
      ...nonParentCarer,
      enabled,
      // Reset care percentage when disabling
      carePercentage: enabled ? nonParentCarer.carePercentage || 35 : 0,
    });
  };

  const handleCarePercentageChange = (text: string) => {
    const value = parseInt(text.replace(/[^0-9]/g, '')) || 0;
    onNonParentCarerChange({
      ...nonParentCarer,
      carePercentage: Math.min(100, value),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.toggleRow}>
          <Switch
            value={nonParentCarer.enabled}
            onValueChange={handleToggle}
            trackColor={{ false: '#e2e8f0', true: '#93c5fd' }}
            thumbColor={nonParentCarer.enabled ? '#2563EB' : '#94a3b8'}
            accessibilityLabel="Enable non-parent carer"
            accessibilityHint="Toggle if a non-parent such as a grandparent has care of the child"
          />
          <Pressable
            onPress={() => handleToggle(!nonParentCarer.enabled)}
            onHoverIn={() => setIsHovered(true)}
            onHoverOut={() => setIsHovered(false)}
            style={[styles.labelPressable, webClickableStyles]}
            accessibilityRole="button"
            accessibilityLabel="Toggle non-parent carer"
          >
            <Text
              style={[
                styles.label,
                nonParentCarer.enabled && styles.labelActive,
                isHovered && styles.labelHovered,
              ]}
            >
              Non-parent carer
            </Text>
            <Text style={styles.sublabel}>(e.g., grandparent)</Text>
          </Pressable>
        </View>
        <HelpTooltip
          what="A non-parent carer (like a grandparent) who has at least 35% care of the child. Their income is not included in the calculation, but both parents may owe child support to them based on their care percentage."
          why=""
          hideWhatLabel
          iconColor="#60a5fa"
          iconBorderColor="#bfdbfe"
          iconBackgroundColor="#eff6ff"
        />
      </View>

      {nonParentCarer.enabled && (
        <View
          style={[
            styles.careInputContainer,
            isMobile && styles.careInputContainerMobile,
          ]}
        >
          <View style={styles.careInputRow}>
            <Text style={styles.careLabel}>Care percentage:</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.careInput,
                  webInputStyles,
                  error && styles.careInputError,
                ]}
                value={nonParentCarer.carePercentage.toString()}
                onChangeText={handleCarePercentageChange}
                keyboardType="numeric"
                placeholder="35"
                placeholderTextColor="#94a3b8"
                accessibilityLabel="Non-parent carer care percentage"
                accessibilityHint="Percentage of care the non-parent carer has. Must be at least 35 percent"
              />
              <Text style={styles.percentSymbol}>%</Text>
            </View>
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {!error && nonParentCarer.carePercentage < 35 && (
            <Text style={styles.warningText}>
              Non-parent carer must have at least 35% care
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  labelPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  labelActive: {
    color: '#2563EB',
  },
  labelHovered: {
    ...(isWeb ? ({ textDecorationLine: 'underline' } as never) : {}),
  },
  sublabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '400',
  },
  careInputContainer: {
    marginTop: 12,
    marginLeft: 50, // Align with toggle content
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#e2e8f0',
  },
  careInputContainerMobile: {
    marginLeft: 0,
    paddingLeft: 0,
    borderLeftWidth: 0,
    marginTop: 16,
  },
  careInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  careLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  careInput: {
    width: 60,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 14,
    textAlign: 'center',
    color: '#1a202c',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  careInputError: {
    borderColor: '#ef4444',
  },
  percentSymbol: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
  },
  warningText: {
    fontSize: 12,
    color: '#f59e0b',
    marginTop: 6,
  },
});
