import { BrandSwitch } from '@/src/components/ui/BrandSwitch';
import type { NonParentCarerInfo } from '@/src/utils/calculator';
import { isWeb, webClickableStyles } from '@/src/utils/responsive';
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { HelpTooltip } from './HelpTooltip';

// ============================================================================
// NonParentCarerSection - Toggle for Formula 2/4 (NPC eligibility derived from
// per-child care amounts in ChildRow) + status flags for Lead Trap detection
// ============================================================================

export interface NonParentCarerSectionProps {
  nonParentCarer: NonParentCarerInfo;
  onNonParentCarerChange: (info: NonParentCarerInfo) => void;
}

export function NonParentCarerSection({
  nonParentCarer,
  onNonParentCarerChange,
}: NonParentCarerSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (enabled: boolean) => {
    onNonParentCarerChange({
      ...nonParentCarer,
      enabled,
      // Reset flags when disabling NPC
      hasDeceasedParent: enabled ? (nonParentCarer.hasDeceasedParent ?? false) : undefined,
      hasOverseasParent: enabled ? (nonParentCarer.hasOverseasParent ?? false) : undefined,
    });
  };

  const handleDeceasedChange = (value: boolean) => {
    onNonParentCarerChange({
      ...nonParentCarer,
      hasDeceasedParent: value,
    });
  };

  const handleOverseasChange = (value: boolean) => {
    onNonParentCarerChange({
      ...nonParentCarer,
      hasOverseasParent: value,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.toggleRow}>
          <BrandSwitch
            value={nonParentCarer.enabled}
            onValueChange={handleToggle}
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
              Non-parent carer (NPC)
            </Text>
          </Pressable>
          <HelpTooltip
            what="A non-parent carer (like a grandparent) can receive child support payments. Enter their care nights for each child above. To be eligible, they must have at least 35% care (128 nights/year) of at least one child."
            why=""
            hideWhatLabel
            iconColor="#60a5fa"
            iconBorderColor="#bfdbfe"
            iconBackgroundColor="#eff6ff"
          />
        </View>
      </View>

      {/* Parent Status Section - only visible when NPC is enabled */}
      {nonParentCarer.enabled && (
        <View style={styles.statusSection}>
          <Pressable
            onPress={() => setIsExpanded(!isExpanded)}
            style={[styles.expandButton, webClickableStyles]}
            accessibilityRole="button"
            accessibilityLabel={isExpanded ? "Collapse parent status options" : "Expand parent status options"}
          >
            <Text style={styles.expandButtonText}>
              Parent Status {isExpanded ? '▼' : '▶'}
            </Text>
            <HelpTooltip
              what="If either parent is living overseas or deceased, special assessment rules apply that require manual review."
              why=""
              hideWhatLabel
              iconColor="#60a5fa"
              iconBorderColor="#bfdbfe"
              iconBackgroundColor="#eff6ff"
            />
          </Pressable>

          {isExpanded && (
            <View style={styles.statusList}>
              {/* Deceased Toggle */}
              <View style={styles.statusRow}>
                <BrandSwitch
                  value={nonParentCarer.hasDeceasedParent ?? false}
                  onValueChange={handleDeceasedChange}
                  accessibilityLabel="Either parent is deceased"
                />
                <Text style={styles.statusLabel}>Is either parent deceased?</Text>
              </View>

              {/* Overseas Toggle */}
              <View style={styles.statusRow}>
                <BrandSwitch
                  value={nonParentCarer.hasOverseasParent ?? false}
                  onValueChange={handleOverseasChange}
                  accessibilityLabel="Either parent is living overseas"
                />
                <Text style={styles.statusLabel}>Is either parent living overseas?</Text>
              </View>
            </View>
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
  // Parent Status Section styles
  statusSection: {
    marginTop: 12,
    paddingLeft: 48, // Align with toggle content
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  expandButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  statusList: {
    gap: 12,
    marginTop: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusLabel: {
    fontSize: 14,
    color: '#475569',
  },
});
