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
// NonParentCarerSection - Toggle for Formula 4 (NPC eligibility derived from
// per-child care amounts in ChildRow)
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

  const handleToggle = (enabled: boolean) => {
    onNonParentCarerChange({ enabled });
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
            <Text style={styles.sublabel}>(e.g., grandparent)</Text>
          </Pressable>
        </View>
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
});
