import type { OtherCaseChild } from '@/src/utils/calculator';
import { deriveAgeRange } from '@/src/utils/calculator';
import {
    isWeb,
    useResponsive,
    webClickableStyles,
    webInputStyles,
} from '@/src/utils/responsive';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { HelpTooltip } from './HelpTooltip';

// ============================================================================
// OtherCasesPopover - Compact button with popover for multi-case children
// ============================================================================

export interface OtherCasesPopoverProps {
  multiCaseA: { otherChildren: OtherCaseChild[] };
  multiCaseB: { otherChildren: OtherCaseChild[] };
  onMultiCaseAChange: (otherChildren: OtherCaseChild[]) => void;
  onMultiCaseBChange: (otherChildren: OtherCaseChild[]) => void;
  compact?: boolean;
}

/**
 * Helper to convert count-based input to OtherCaseChild array
 * Uses representative ages: 6 for under 13, 14 for 13+
 */
function createOtherChildren(
  u13Count: number,
  plus13Count: number
): OtherCaseChild[] {
  const children: OtherCaseChild[] = [];
  for (let i = 0; i < u13Count; i++) {
    children.push({
      id: `other-u13-${i}-${Date.now()}`,
      age: 6, // Representative age for "Under 13"
    });
  }
  for (let i = 0; i < plus13Count; i++) {
    children.push({
      id: `other-13plus-${i}-${Date.now()}`,
      age: 14, // Representative age for "13+"
    });
  }
  return children;
}

/**
 * Helper to count children by age range from OtherCaseChild array
 */
function countByAge(children: OtherCaseChild[]): {
  u13: number;
  plus13: number;
} {
  return {
    u13: children.filter((c) => deriveAgeRange(c.age) === 'Under 13').length,
    plus13: children.filter((c) => {
      const range = deriveAgeRange(c.age);
      return range === '13+' || range === '18+';
    }).length,
  };
}

export function OtherCasesPopover({
  multiCaseA,
  multiCaseB,
  onMultiCaseAChange,
  onMultiCaseBChange,
  compact = false,
}: OtherCasesPopoverProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useResponsive();

  const countsA = countByAge(multiCaseA.otherChildren);
  const countsB = countByAge(multiCaseB.otherChildren);
  const totalOtherChildren =
    countsA.u13 + countsA.plus13 + countsB.u13 + countsB.plus13;
  const hasValues = totalOtherChildren > 0;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCountChange = (
    parent: 'A' | 'B',
    ageGroup: 'u13' | 'plus13',
    value: string
  ) => {
    const count = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    const onChange = parent === 'A' ? onMultiCaseAChange : onMultiCaseBChange;
    const currentCounts = parent === 'A' ? countsA : countsB;

    const newCounts = {
      ...currentCounts,
      [ageGroup]: count,
    };

    onChange(createOtherChildren(newCounts.u13, newCounts.plus13));
  };


  return (
    <View
      style={[
        compact
          ? popoverStyles.drawerContainerCompact
          : popoverStyles.drawerContainer,
        isWeb && {
          display: 'flex' as never,
          flexDirection: isMobile ? ('column' as never) : ('row' as never),
          alignItems: isMobile ? ('flex-start' as never) : ('center' as never),
          alignSelf: 'flex-start' as never, // Prevent stretching to full width
          flexWrap: 'wrap' as never,
        },
      ]}
    >
      <View
        style={{
          flexShrink: 0,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Pressable
          onPress={handleToggle}
          onHoverIn={() => setIsHovered(true)}
          onHoverOut={() => setIsHovered(false)}
          style={[
            compact
              ? popoverStyles.triggerButtonCompact
              : popoverStyles.triggerButton,
            hasValues && popoverStyles.triggerButtonActive,
            isHovered && hasValues && popoverStyles.triggerButtonHover,
            isHovered && !hasValues && popoverStyles.triggerButtonHoverInactive,
            webClickableStyles,
          ]}
          accessibilityRole="button"
          accessibilityLabel={
            hasValues
              ? `Other Cases: ${totalOtherChildren} children`
              : 'Add other cases'
          }
          accessibilityHint="Tap to add children from other child support cases"
          // @ts-ignore - Web-only accessibility
          aria-expanded={isOpen}
        >
          <Text
            style={[
              compact
                ? popoverStyles.triggerTextCompact
                : popoverStyles.triggerText,
              hasValues && popoverStyles.triggerTextActive,
            ]}
          >
            {hasValues ? `Other Cases: ${totalOtherChildren}` : 'Other Cases'}
          </Text>
          {!hasValues && <Text style={popoverStyles.plusIcon}>+</Text>}
        </Pressable>
        <HelpTooltip
          what="If you or the other parent have children from other child support cases, an allowance is calculated to recognise those costs. This may reduce the amount payable in this case."
          why=""
          hideWhatLabel
          iconColor="#60a5fa"
          iconBorderColor="#bfdbfe"
          iconBackgroundColor="#eff6ff"
        />
      </View>

      <View
        style={[
          popoverStyles.drawerContent,
          isOpen && popoverStyles.drawerContentOpen,
          isWeb &&
          ({
            width: isOpen
              ? isMobile
                ? '100%'
                : compact
                  ? '400px'
                  : '450px'
              : '0px',
            height: isOpen ? 'auto' : '0px',
            opacity: isOpen ? 1 : 0,
            overflow: 'hidden' as never,
            transition:
              'width 0.3s ease-out, opacity 0.3s ease-out, height 0.3s' as never,
            marginTop: isMobile && isOpen ? 8 : 0,
          } as never),
        ]}
      >
        <View
          style={[popoverStyles.drawerInner, isMobile && { paddingLeft: 0 }]}
        >
          {/* Visually hidden description for screen readers */}
          <Text
            // @ts-ignore - Web-only nativeID for aria-describedby
            nativeID="other-cases-description"
            style={popoverStyles.srOnly}
            accessibilityRole="text"
          >
            Enter the number of children from other child support cases for each parent.
            Split by age group: under 13 and 13 or older. This calculates multi-case allowances.
          </Text>
          <View
            style={[
              popoverStyles.drawerInputsRow,
              isMobile && { flexWrap: 'wrap', gap: 16 },
            ]}
            // @ts-ignore - Web-only aria attribute
            aria-describedby="other-cases-description"
          >
            {/* You */}
            <View
              style={popoverStyles.drawerInputGroup}
              accessibilityRole={'group' as never}
              accessibilityLabel="Your children in other cases"
            >
              <View style={popoverStyles.drawerAgeInputs}>
                <Text style={[popoverStyles.drawerAgeLabel, { marginBottom: 10 }]}>&lt;13</Text>
                <View style={popoverStyles.drawerLabeledAgeGroup}>
                  <Text style={popoverStyles.drawerParentLabelYou}>YOU</Text>
                  <View style={popoverStyles.drawerInputRow}>
                    <TextInput
                      style={[popoverStyles.drawerInput, webInputStyles]}
                      value={countsA.u13.toString()}
                      onChangeText={(text) => handleCountChange('A', 'u13', text)}
                      keyboardType="numeric"
                      accessibilityLabel="Your children under 13 in other cases"
                      accessibilityHint="Number of children under 13 from your other child support cases"
                    />
                    <Text style={popoverStyles.drawerAgeLabel}>13+</Text>
                    <TextInput
                      style={[popoverStyles.drawerInput, webInputStyles]}
                      value={countsA.plus13.toString()}
                      onChangeText={(text) =>
                        handleCountChange('A', 'plus13', text)
                      }
                      keyboardType="numeric"
                      accessibilityLabel="Your children 13 and over in other cases"
                      accessibilityHint="Number of children 13 and over from your other child support cases"
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Separator */}
            {!isMobile && <View style={popoverStyles.drawerSeparator} />}

            {/* Other Parent */}
            <View
              style={popoverStyles.drawerInputGroup}
              accessibilityRole={'group' as never}
              accessibilityLabel="Other parent's children in other cases"
            >
              <View style={popoverStyles.drawerAgeInputs}>
                <Text style={[popoverStyles.drawerAgeLabel, { marginBottom: 10 }]}>&lt;13</Text>
                <View style={popoverStyles.drawerLabeledAgeGroup}>
                  <Text style={popoverStyles.drawerParentLabelOther}>OTHER PARENT</Text>
                  <View style={popoverStyles.drawerInputRow}>
                    <TextInput
                      style={[popoverStyles.drawerInput, webInputStyles]}
                      value={countsB.u13.toString()}
                      onChangeText={(text) => handleCountChange('B', 'u13', text)}
                      keyboardType="numeric"
                      accessibilityLabel="Other parent's children under 13 in other cases"
                      accessibilityHint="Number of children under 13 from other parent's other child support cases"
                    />
                    <Text style={popoverStyles.drawerAgeLabel}>13+</Text>
                    <TextInput
                      style={[popoverStyles.drawerInput, webInputStyles]}
                      value={countsB.plus13.toString()}
                      onChangeText={(text) =>
                        handleCountChange('B', 'plus13', text)
                      }
                      keyboardType="numeric"
                      accessibilityLabel="Other parent's children 13 and over in other cases"
                      accessibilityHint="Number of children 13 and over from other parent's other child support cases"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {hasValues && (
        <Pressable
          style={[popoverStyles.drawerClearButton, webClickableStyles]}
          onPress={() => {
            onMultiCaseAChange([]);
            onMultiCaseBChange([]);
          }}
          accessibilityRole="button"
          accessibilityLabel="Clear all other cases"
        >
          <Text style={popoverStyles.drawerClearButtonText}>×</Text>
        </Pressable>
      )}
    </View>
  );
}

const popoverStyles = StyleSheet.create({
  // Visually hidden but accessible to screen readers
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    // @ts-ignore - Web-only clip property
    clip: 'rect(0, 0, 0, 0)',
    // @ts-ignore - Web-only whiteSpace property
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
  drawerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerContainerCompact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  triggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    borderStyle: 'dashed',
    minWidth: 170, // Match Rel. Dependents button width
  },
  triggerButtonHover: {
    ...(isWeb ? ({ backgroundColor: '#dbeafe' } as never) : {}),
  },
  triggerButtonHoverInactive: {
    ...(isWeb ? ({ backgroundColor: '#f8fafc' } as never) : {}),
  },
  triggerButtonCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    borderRadius: 6,
    borderStyle: 'dashed',
    minWidth: 140, // Match Rel. Dependents button width
  },
  triggerButtonActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563EB',
    borderStyle: 'solid',
  },
  triggerText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  triggerTextCompact: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  triggerTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  plusIcon: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '700',
  },
  drawerContent: {
    overflow: 'hidden',
  },
  drawerContentOpen: {},
  drawerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingLeft: 12,
  },
  drawerInputsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Align to bottom so separator aligns with inputs
    gap: 12,
    flexShrink: 1,
  },
  drawerInputGroup: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  drawerParentLabelYou: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3b82f6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  drawerParentLabelOther: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  drawerAgeInputs: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Align to bottom so labels don't affect input alignment
    gap: 6,
  },
  drawerLabeledAgeGroup: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  drawerInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  drawerAgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  drawerAgeLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    minWidth: 20,
  },
  drawerInput: {
    width: 36,
    paddingHorizontal: 4,
    paddingVertical: 6,
    fontSize: 14,
    textAlign: 'center',
    color: '#1a202c',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  drawerSeparator: {
    width: 1,
    height: 24,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 4,
    marginBottom: 4, // Align with input row center
  },
  drawerClearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  drawerClearButtonText: {
    fontSize: 16,
    color: '#5a6570',
    lineHeight: 18,
    fontWeight: '400',
  },
});
