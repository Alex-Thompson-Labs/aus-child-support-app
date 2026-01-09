import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  isWeb,
  useResponsive,
  webClickableStyles,
  webInputStyles,
} from '../utils/responsive';
import { HelpTooltip } from './HelpTooltip';

// ============================================================================
// RelevantDependentsPopover - Compact button with popover for dependents
// ============================================================================

export interface RelevantDependentsPopoverProps {
  relDepA: { u13: number; plus13: number };
  relDepB: { u13: number; plus13: number };
  onRelDepAChange: (updates: Partial<{ u13: number; plus13: number }>) => void;
  onRelDepBChange: (updates: Partial<{ u13: number; plus13: number }>) => void;
  compact?: boolean; // For horizontal layout
}

export function RelevantDependentsPopover({
  relDepA,
  relDepB,
  onRelDepAChange,
  onRelDepBChange,
  compact = false,
}: RelevantDependentsPopoverProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useResponsive();
  const drawerRef = useRef<View>(null);
  const triggerRef = useRef<View>(null);

  const totalDeps = relDepA.u13 + relDepA.plus13 + relDepB.u13 + relDepB.plus13;
  const hasValues = totalDeps > 0;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isWeb && isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;

        // Get the actual DOM nodes from the refs
        const drawerNode = drawerRef.current as unknown as HTMLElement | null;
        const triggerNode = triggerRef.current as unknown as HTMLElement | null;

        // Check if click is inside drawer content
        if (drawerNode && drawerNode.contains(target)) {
          return;
        }

        // Check if click is on the trigger button
        if (triggerNode && triggerNode.contains(target)) {
          return;
        }

        setIsOpen(false);
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // FIXED Web/Mobile Browser Drawer
  return (
    <View
      style={[
        compact
          ? popoverStyles.drawerContainerCompact
          : popoverStyles.drawerContainer,
        isWeb && {
          display: 'flex' as any,
          flexDirection: isMobile ? ('column' as any) : ('row' as any), // Stack trigger on mobile
          alignItems: isMobile ? ('flex-start' as any) : ('center' as any),
          width: '100%',
        },
      ]}
    >
      <View
        ref={triggerRef}
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
              ? `Relevant Dependents: ${totalDeps} total`
              : 'Add relevant dependents'
          }
          accessibilityHint="Tap to add dependent children from other relationships"
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
            {hasValues ? `Dependents: ${totalDeps}` : 'Rel. Dependents'}
          </Text>
          {!hasValues && <Text style={popoverStyles.plusIcon}>+</Text>}
        </Pressable>
        <HelpTooltip
          what="Relevant dependent children are those in a parent's care from a different relationship. An allowance is deducted from the parent's Adjusted Taxable Income to recognize the costs of supporting them, effectively reducing their final child support income."
          why=""
          hideWhatLabel
          iconColor="#60a5fa" // blue-400
          iconBorderColor="#bfdbfe" // blue-200
          iconBackgroundColor="#eff6ff" // blue-50
        />
        {hasValues && (
          <Pressable
            style={[popoverStyles.drawerClearButton, webClickableStyles]}
            onPress={() => {
              onRelDepAChange({ u13: 0, plus13: 0 });
              onRelDepBChange({ u13: 0, plus13: 0 });
            }}
            accessibilityRole="button"
            accessibilityLabel="Clear all dependents"
          >
            <Text style={popoverStyles.drawerClearButtonText}>×</Text>
          </Pressable>
        )}
      </View>

      <View
        ref={drawerRef}
        style={[
          popoverStyles.drawerContent,
          isOpen && popoverStyles.drawerContentOpen,
          isWeb &&
            ({
              // Dynamic width: Full width on mobile, fixed on desktop
              width: isOpen
                ? isMobile
                  ? '100%'
                  : compact
                  ? '400px'
                  : '450px'
                : '0px',
              height: isOpen ? 'auto' : '0px', // Allow vertical expansion
              opacity: isOpen ? 1 : 0,
              overflow: 'hidden' as any,
              transition:
                'width 0.3s ease-out, opacity 0.3s ease-out, height 0.3s' as any,
              marginTop: isMobile && isOpen ? 8 : 0, // Gap when stacked
            } as any),
        ]}
      >
        <View
          style={[popoverStyles.drawerInner, isMobile && { paddingLeft: 0 }]}
        >
          <View
            style={[
              popoverStyles.drawerInputsRow,
              isMobile && { flexWrap: 'wrap', gap: 16 }, // Wrap inputs on mobile
            ]}
          >
            {/* You */}
            <View
              style={popoverStyles.drawerInputGroup}
              accessibilityRole={'group' as any} // Web-only ARIA role
              accessibilityLabel="Your Dependents"
            >
              <Text style={popoverStyles.drawerParentLabelYou}>YOU</Text>
              <View style={popoverStyles.drawerAgeInputs}>
                <View style={popoverStyles.drawerAgeGroup}>
                  <Text style={popoverStyles.drawerAgeLabel}>&lt;13</Text>
                  <TextInput
                    style={[popoverStyles.drawerInput, webInputStyles]}
                    value={relDepA.u13.toString()}
                    onChangeText={(text) =>
                      onRelDepAChange({
                        u13: parseInt(text.replace(/[^0-9]/g, '')) || 0,
                      })
                    }
                    keyboardType="numeric"
                    accessibilityLabel="Your dependents under 13"
                    accessibilityHint="Number of relevant dependent children under 13 for you"
                  />
                </View>
                <View style={popoverStyles.drawerAgeGroup}>
                  <Text style={popoverStyles.drawerAgeLabel}>13+</Text>
                  <TextInput
                    style={[popoverStyles.drawerInput, webInputStyles]}
                    value={relDepA.plus13.toString()}
                    onChangeText={(text) =>
                      onRelDepAChange({
                        plus13: parseInt(text.replace(/[^0-9]/g, '')) || 0,
                      })
                    }
                    keyboardType="numeric"
                    accessibilityLabel="Your dependents 13 and over"
                    accessibilityHint="Number of relevant dependent children 13 and over for you"
                  />
                </View>
              </View>
            </View>

            {/* Separator - Hide on mobile if wrapped */}
            {!isMobile && <View style={popoverStyles.drawerSeparator} />}

            {/* Other Parent */}
            <View
              style={popoverStyles.drawerInputGroup}
              accessibilityRole={'group' as any} // Web-only ARIA role
              accessibilityLabel="Other Parent's Dependents"
            >
              <Text style={popoverStyles.drawerParentLabelOther}>OTHER PARENT</Text>
              <View style={popoverStyles.drawerAgeInputs}>
                <View style={popoverStyles.drawerAgeGroup}>
                  <Text style={popoverStyles.drawerAgeLabel}>&lt;13</Text>
                  <TextInput
                    style={[popoverStyles.drawerInput, webInputStyles]}
                    value={relDepB.u13.toString()}
                    onChangeText={(text) =>
                      onRelDepBChange({
                        u13: parseInt(text.replace(/[^0-9]/g, '')) || 0,
                      })
                    }
                    keyboardType="numeric"
                    accessibilityLabel="Other parent's dependents under 13"
                    accessibilityHint="Number of relevant dependent children under 13 for other parent"
                  />
                </View>
                <View style={popoverStyles.drawerAgeGroup}>
                  <Text style={popoverStyles.drawerAgeLabel}>13+</Text>
                  <TextInput
                    style={[popoverStyles.drawerInput, webInputStyles]}
                    value={relDepB.plus13.toString()}
                    onChangeText={(text) =>
                      onRelDepBChange({
                        plus13: parseInt(text.replace(/[^0-9]/g, '')) || 0,
                      })
                    }
                    keyboardType="numeric"
                    accessibilityLabel="Other parent's dependents 13 and over"
                    accessibilityHint="Number of relevant dependent children 13 and over for other parent"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const popoverStyles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 100,
  },
  containerCompact: {
    position: 'relative',
    zIndex: 100,
    alignSelf: 'flex-start',
  },
  // Web drawer container - flexbox row layout
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
    backgroundColor: '#ffffff', // white - neutral state
    borderWidth: 1.5,
    borderColor: '#bfdbfe', // blue-200
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  triggerButtonHover: {
    ...(isWeb ? ({ backgroundColor: '#dbeafe' } as any) : {}), // blue-100
  },
  triggerButtonHoverInactive: {
    ...(isWeb ? ({ backgroundColor: '#f8fafc' } as any) : {}), // slate-50 - subtle neutral hover
  },
  triggerButtonCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#ffffff', // white - neutral state
    borderWidth: 1.5,
    borderColor: '#bfdbfe', // blue-200
    borderRadius: 6,
    borderStyle: 'dashed',
  },
  triggerButtonActive: {
    backgroundColor: '#eff6ff', // blue-50 - Ghost Blue
    borderColor: '#2563EB', // Brand Blue (blue-600)
    borderStyle: 'solid',
  },
  triggerText: {
    fontSize: 14,
    color: '#64748b', // slate-500 - neutral gray when inactive
    fontWeight: '600',
  },
  triggerTextCompact: {
    fontSize: 12,
    color: '#64748b', // slate-500 - neutral gray when inactive
    fontWeight: '600',
  },
  triggerTextActive: {
    color: '#2563EB', // Brand Blue (blue-600)
    fontWeight: '600',
  },
  plusIcon: {
    fontSize: 16,
    color: '#64748b', // slate-500 - neutral gray when inactive
    fontWeight: '700',
  },
  // Inline drawer content - expands to the right
  drawerContent: {
    overflow: 'hidden',
    minHeight: 40,
  },
  drawerContentOpen: {
    // Width and opacity are set dynamically via inline styles with transition
  },
  drawerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap', // Allow content to wrap internally
    paddingLeft: 12,
  },
  drawerHeader: {
    marginRight: 8,
  },
  drawerInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1, // Allow shrinking
  },
  drawerInputGroup: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  drawerParentLabelYou: {
    fontSize: 11,
    fontWeight: '700', // Increased from 600 for better visibility
    color: '#3b82f6', // blue-500 (User Highlight) - matches "YOUR INCOME"
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  drawerParentLabelOther: {
    fontSize: 11,
    fontWeight: '700', // Increased from 600 for better visibility
    color: '#475569', // slate-600 - better contrast (6.7:1)
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  drawerAgeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  drawerAgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  drawerAgeLabel: {
    fontSize: 10,
    color: '#64748b', // slate-500
    fontWeight: '600',
    minWidth: 20,
  },
  drawerInput: {
    width: 36,
    paddingHorizontal: 4,
    paddingVertical: 6,
    fontSize: 14,
    textAlign: 'center',
    color: '#1a202c', // near black
    borderWidth: 1.5,
    borderColor: '#e2e8f0', // subtle border
    borderRadius: 4,
    backgroundColor: '#ffffff', // white
  },
  drawerSeparator: {
    width: 1,
    height: 24,
    backgroundColor: '#e2e8f0', // subtle divider
    marginHorizontal: 4,
  },
  drawerClearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff', // white
    borderWidth: 1.5,
    borderColor: '#e2e8f0', // subtle border
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  drawerClearButtonText: {
    fontSize: 16,
    color: '#5a6570', // dark grey - WCAG AA compliant (7.0:1)
    lineHeight: 18,
    fontWeight: '400',
  },
});
