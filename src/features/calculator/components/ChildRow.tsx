import type { ChildInput } from '@/src/utils/calculator';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CARE_PERIOD_DAYS } from '@/src/utils/child-support-constants';
import {
  isWeb,
  useResponsive,
  webClickableStyles,
  webInputStyles,
} from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import { PeriodPicker } from './PeriodPicker';


interface ChildRowProps {
  child: ChildInput;
  onUpdate: (updates: Partial<ChildInput>) => void;
  onRemove: () => void;
  childIndex?: number;
  totalChildren?: number;
  /** Show NPC (non-parent carer) care input when enabled */
  showNPCInput?: boolean;
  /** Show second NPC care input when enabled */
  showNPC2Input?: boolean;
  /** Validation error message for this child */
  error?: string;
}

export function ChildRow({
  child,
  onUpdate,
  onRemove,
  childIndex,
  totalChildren,
  showNPCInput = false,
  showNPC2Input = false,
  error,
}: ChildRowProps) {
  const { isMobile } = useResponsive();

  // Local state for input values while editing
  const [editingField, setEditingField] = useState<
    'A' | 'B' | 'NPC' | 'NPC2' | 'Age' | null
  >(null);
  const [localValue, setLocalValue] = useState('');



  const maxValue =
    child.carePeriod === 'week'
      ? 7
      : child.carePeriod === 'fortnight'
        ? 14
        : child.carePeriod === 'year'
          ? 365
          : 100; // percent

  // Calculate if total exceeds maximum (including NPC if enabled)
  const npcAmount = showNPCInput ? child.careAmountNPC ?? 0 : 0;
  const npc2Amount = showNPC2Input ? child.careAmountNPC2 ?? 0 : 0;
  const totalCare = child.careAmountA + child.careAmountB + npcAmount + npc2Amount;
  const isOverLimit = totalCare > maxValue;
  const periodLabel = child.carePeriod === 'percent' ? '%' : ' nights';

  // Focus handlers - clear local value to allow fresh typing
  const handleFocusA = () => {
    setEditingField('A');
    setLocalValue('');
  };

  const handleFocusB = () => {
    setEditingField('B');
    setLocalValue('');
  };

  // Change handlers - update local state and auto-adjust other field
  const handleChangeA = (text: string) => {
    const cleanedText = text.replace(/[^0-9.]/g, '');
    setLocalValue(cleanedText);
    const newAmountA = parseFloat(cleanedText) || 0;

    // Only auto-adjust other parent if NPC is NOT enabled
    if (!showNPCInput) {
      const newAmountB = Math.max(0, maxValue - newAmountA);
      onUpdate({ careAmountA: newAmountA, careAmountB: newAmountB });
    } else {
      onUpdate({ careAmountA: newAmountA });
    }
  };

  const handleChangeB = (text: string) => {
    const cleanedText = text.replace(/[^0-9.]/g, '');
    setLocalValue(cleanedText);
    const newAmountB = parseFloat(cleanedText) || 0;

    // Only auto-adjust other parent if NPC is NOT enabled
    if (!showNPCInput) {
      const newAmountA = Math.max(0, maxValue - newAmountB);
      onUpdate({ careAmountA: newAmountA, careAmountB: newAmountB });
    } else {
      onUpdate({ careAmountB: newAmountB });
    }
  };

  // Blur handlers - commit value and auto-adjust the other field
  const handleBlurA = () => {
    const newAmountA = parseFloat(localValue) || 0;

    if (!showNPCInput) {
      const newAmountB = Math.max(0, maxValue - newAmountA);
      onUpdate({ careAmountA: newAmountA, careAmountB: newAmountB });
    } else {
      onUpdate({ careAmountA: newAmountA });
    }

    setEditingField(null);
    setLocalValue('');
  };

  const handleBlurB = () => {
    const newAmountB = parseFloat(localValue) || 0;

    if (!showNPCInput) {
      const newAmountA = Math.max(0, maxValue - newAmountB);
      onUpdate({ careAmountA: newAmountA, careAmountB: newAmountB });
    } else {
      onUpdate({ careAmountB: newAmountB });
    }

    setEditingField(null);
    setLocalValue('');
  };

  // NPC (Non-Parent Carer) handlers
  const handleFocusNPC = () => {
    setEditingField('NPC');
    setLocalValue('');
  };

  const handleChangeNPC = (text: string) => {
    const cleanedText = text.replace(/[^0-9.]/g, '');
    setLocalValue(cleanedText);
    const newAmountNPC = parseFloat(cleanedText) || 0;
    onUpdate({ careAmountNPC: newAmountNPC });
  };

  const handleBlurNPC = () => {
    const newAmountNPC = parseFloat(localValue) || 0;
    onUpdate({ careAmountNPC: newAmountNPC });
    setEditingField(null);
    setLocalValue('');
  };

  // NPC2 (Second Non-Parent Carer) handlers
  const handleFocusNPC2 = () => {
    setEditingField('NPC2');
    setLocalValue('');
  };

  const handleChangeNPC2 = (text: string) => {
    const cleanedText = text.replace(/[^0-9.]/g, '');
    setLocalValue(cleanedText);
    const newAmountNPC2 = parseFloat(cleanedText) || 0;
    onUpdate({ careAmountNPC2: newAmountNPC2 });
  };

  const handleBlurNPC2 = () => {
    const newAmountNPC2 = parseFloat(localValue) || 0;
    onUpdate({ careAmountNPC2: newAmountNPC2 });
    setEditingField(null);
    setLocalValue('');
  };

  // Get display value for inputs
  const getDisplayValueA = () => {
    if (editingField === 'A') return localValue;
    return child.careAmountA === 0 ? '' : child.careAmountA.toString();
  };

  const getDisplayValueB = () => {
    if (editingField === 'B') return localValue;
    return child.careAmountB === 0 ? '' : child.careAmountB.toString();
  };

  const getDisplayValueNPC = () => {
    if (editingField === 'NPC') return localValue;
    const amount = child.careAmountNPC ?? 0;
    return amount === 0 ? '' : amount.toString();
  };

  const getDisplayValueNPC2 = () => {
    if (editingField === 'NPC2') return localValue;
    const amount = child.careAmountNPC2 ?? 0;
    return amount === 0 ? '' : amount.toString();
  };

  // Age input handlers
  const handleFocusAge = () => {
    setEditingField('Age');
    setLocalValue('');
  };

  const handleChangeAge = (text: string) => {
    const cleanedText = text.replace(/[^0-9]/g, '').slice(0, 2);
    setLocalValue(cleanedText);
    const newAge = parseInt(cleanedText, 10) || 0;
    onUpdate({ age: newAge });
  };

  const handleBlurAge = () => {
    const newAge = parseInt(localValue, 10) || 0;
    onUpdate({ age: newAge });
    setEditingField(null);
    setLocalValue('');
  };

  const getDisplayValueAge = () => {
    if (editingField === 'Age') return localValue;
    return child.age === 0 ? '' : child.age.toString();
  };

  const handlePeriodChange = (
    period: 'week' | 'fortnight' | 'year' | 'percent'
  ) => {
    const maxNights = CARE_PERIOD_DAYS[period] || 14;
    // For percentage, use default 57/43 split
    const defaultA = period === 'percent' ? 57 : Math.round(maxNights * 0.57);
    const defaultB = period === 'percent' ? 43 : Math.round(maxNights * 0.43);
    onUpdate({
      carePeriod: period,
      careAmountA: defaultA,
      careAmountB: defaultB,
    });
  };

  // Single horizontal row layout (responsive)
  return (
    <View
      style={[
        styles.container,
        !isMobile && styles.containerDesktop,
        isOverLimit && styles.containerError,
      ]}
      accessible={true}
      accessibilityLabel={`Child ${childIndex} of ${totalChildren}. Care arrangement: Parent A ${child.careAmountA} nights, Parent B ${child.careAmountB} nights per ${child.carePeriod}`}
    >
      {/* Child count indicator */}
      {childIndex !== undefined && totalChildren !== undefined && (
        <Text style={styles.childCountText}>
          Child {childIndex} of {totalChildren}
        </Text>
      )}

      {/* Remove button - top right with better visibility */}
      <Pressable
        onPress={onRemove}
        style={[styles.removeButton, isWeb && webClickableStyles]}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel="Remove child"
        accessibilityHint="Removes this child from the calculation"
      >
        <Text style={styles.removeButtonText}>×</Text>
      </Pressable>

      {/* Care arrangement inputs - 2x2 grid on mobile */}
      <View style={styles.horizontalRow}>
        {/* Row 1: Parent A and Parent B - forced side-by-side */}
        <View style={[styles.parentsRow, isMobile && styles.parentsRowMobile]}>
          {/* Parent A */}
          <View
            style={[styles.itemWrapper, isMobile && styles.parentItemMobile]}
          >
            <Text style={styles.headerLabelA}>YOU</Text>
            <TextInput
              style={[
                styles.careInput,
                styles.compactInput,
                isWeb && webInputStyles,
              ]}
              value={getDisplayValueA()}
              onChangeText={handleChangeA}
              onFocus={handleFocusA}
              onBlur={handleBlurA}
              placeholder="0"
              keyboardType="number-pad"
              maxLength={5}
              placeholderTextColor="#64748b"
              accessibilityLabel="Your nights of care"
              accessibilityHint="Enter number of nights child stays with you"
              {...(isWeb && { inputMode: 'numeric' as any })}
            />
          </View>

          {/* Parent B */}
          <View
            style={[styles.itemWrapper, isMobile && styles.parentItemMobile]}
          >
            <Text style={styles.headerLabelB}>OTHER</Text>
            <TextInput
              style={[
                styles.careInput,
                styles.compactInput,
                isWeb && webInputStyles,
              ]}
              value={getDisplayValueB()}
              onChangeText={handleChangeB}
              onFocus={handleFocusB}
              onBlur={handleBlurB}
              placeholder="0"
              keyboardType="number-pad"
              maxLength={5}
              placeholderTextColor="#64748b"
              accessibilityLabel="Other parent's nights of care"
              accessibilityHint="Enter number of nights child stays with other parent"
              {...(isWeb && { inputMode: 'numeric' as any })}
            />
          </View>

          {/* Non-Parent Carer (Formula 2/4) */}
          {showNPCInput && (
            <View
              style={[styles.itemWrapper, isMobile && styles.parentItemMobile]}
            >
              <Text style={styles.headerLabelNPC}>NPC</Text>
              <TextInput
                style={[
                  styles.careInput,
                  styles.compactInput,
                  isWeb && webInputStyles,
                ]}
                value={getDisplayValueNPC()}
                onChangeText={handleChangeNPC}
                onFocus={handleFocusNPC}
                onBlur={handleBlurNPC}
                placeholder="0"
                keyboardType="number-pad"
                maxLength={5}
                placeholderTextColor="#64748b"
                accessibilityLabel="Non-parent carer's nights of care"
                accessibilityHint="Enter number of nights child stays with non-parent carer"
                {...(isWeb && { inputMode: 'numeric' as never })}
              />
            </View>
          )}

          {/* Second Non-Parent Carer (Formula 2/4 two NPC split) */}
          {showNPC2Input && (
            <View
              style={[styles.itemWrapper, isMobile && styles.parentItemMobile]}
            >
              <Text style={styles.headerLabelNPC2}>NPC 2</Text>
              <TextInput
                style={[
                  styles.careInput,
                  styles.compactInput,
                  isWeb && webInputStyles,
                ]}
                value={getDisplayValueNPC2()}
                onChangeText={handleChangeNPC2}
                onFocus={handleFocusNPC2}
                onBlur={handleBlurNPC2}
                placeholder="0"
                keyboardType="number-pad"
                maxLength={5}
                placeholderTextColor="#64748b"
                accessibilityLabel="Second non-parent carer's nights of care"
                accessibilityHint="Enter number of nights child stays with second non-parent carer"
                {...(isWeb && { inputMode: 'numeric' as never })}
              />
            </View>
          )}
        </View>

        {/* Row 2: Period and Age Range - on desktop inline, on mobile second row */}
        <View style={[styles.optionsRow, isMobile && styles.optionsRowMobile]}>
          {/* Period Picker */}
          <View style={isMobile && styles.optionItemMobile}>
            <PeriodPicker
              value={child.carePeriod}
              onChange={handlePeriodChange}
            />
          </View>

          {/* Age Input */}
          <View
            style={[
              styles.toggleWithLabel,
              isMobile && styles.optionItemMobile,
            ]}
          >
            <Text style={styles.toggleLabel}>Age</Text>
            <TextInput
              style={[
                styles.careInput,
                styles.ageInput,
                isWeb && webInputStyles,
              ]}
              value={getDisplayValueAge()}
              onChangeText={handleChangeAge}
              onFocus={handleFocusAge}
              onBlur={handleBlurAge}
              placeholder="0"
              keyboardType="number-pad"
              maxLength={2}
              placeholderTextColor="#64748b"
              accessibilityLabel="Child's age"
              accessibilityHint="Enter child's age in years"
              {...(isWeb && { inputMode: 'numeric' as any })}
            />

          </View>
        </View>
      </View>

      {/* Warning when total exceeds maximum */}
      {isOverLimit && (
        <Text style={styles.warning}>
          Total ({totalCare}
          {periodLabel}) exceeds max ({maxValue})
        </Text>
      )}

      {/* Validation Error */}
      {!!error && (
        <Text style={styles.warning}>
          {error}
        </Text>
      )}

      {/* Advisory when child is 17 */}
      {child.age === 17 && (
        <Text style={styles.advisory}>
          Child is 17. Adult children (18+) are excluded from standard assessment.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20, // Extra top padding to accommodate larger remove button
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0', // slate-200 - subtle border
    backgroundColor: '#ffffff', // white background
    marginBottom: 8,
    position: 'relative',
    overflow: 'visible', // Allow remove button to extend beyond container
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    }),
    ...(isWeb
      ? {
        scrollSnapAlign: 'start',
      }
      : {}),
  } as any,
  containerDesktop: {
    padding: 16,
  },
  childCountText: {
    fontSize: 11,
    fontWeight: '700', // Increased from 600 for better visibility
    color: '#475569', // slate-600 - better contrast (6.7:1)
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  containerError: {
    borderColor: '#ef4444', // red-500
    backgroundColor: '#fef2f2', // red-50 - very light red bg
  },
  // Single horizontal row layout
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    backgroundColor: '#f9fafb', // gray-50 - very light gray
    padding: 12,
    borderRadius: 8,
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: '#e5e7eb', // gray-200
  },
  itemWrapper: {
    alignItems: 'center',
    gap: 6,
  },
  // Styles for 2x2 grid layout on mobile
  parentsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  parentsRowMobile: {
    width: '100%',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  parentItemMobile: {
    flex: 1,
    minWidth: 0,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  optionsRowMobile: {
    width: '100%',
    justifyContent: 'space-between',
    gap: 8,
  },
  optionItemMobile: {
    flex: 1,
    alignItems: 'center',
  },
  compactInput: {
    width: 70,
  },
  ageInput: {
    width: 56,
    height: 32,
    fontSize: 13,
    paddingVertical: 0,
    borderRadius: 6,
  },
  headerLabelA: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6', // blue-500 (User Highlight) - matches breakdown "YOU"
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerLabelB: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a5568', // dark grey - consistent
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerLabelNPC: {
    fontSize: 12, // Same size as other header labels
    fontWeight: '600',
    color: '#1e3a8a', // blue-900 (Dark Brand Blue) - matches "CARE" header
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerLabelNPC2: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7c3aed', // violet-600 - distinct from NPC1 but still professional
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  careInput: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 18,
    textAlign: 'center',
    color: '#0f172a', // slate-900 - dark text
    borderWidth: 1,
    borderColor: '#cbd5e1', // slate-300
    borderRadius: 8,
    backgroundColor: '#ffffff', // white input
  },
  toggleWithLabel: {
    alignItems: 'center',
    gap: 4,
    position: 'relative',
    zIndex: 10,
  },
  toggleLabel: {
    fontSize: 10,
    fontWeight: '700', // Increased from 600 for better visibility
    color: '#475569', // slate-600 - better contrast (6.7:1)
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  toggleGroup: {
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
    height: 32, // Match PeriodPicker dropdown height
  },
  toggleButton: {
    width: 40,
    height: 32, // Match PeriodPicker dropdown height
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9', // slate-100 - light inactive
    borderWidth: 1,
    borderColor: '#cbd5e1', // slate-300
  },
  toggleButtonLeft: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  toggleButtonRight: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#2563EB', // Brand Blue (blue-600)
    borderColor: '#2563EB',
  },
  toggleButtonActive13Plus: {
    backgroundColor: '#2563EB', // Brand Blue (blue-600) - matching <13
    borderColor: '#2563EB',
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b', // slate-500
  },
  toggleButtonTextActive: {
    color: '#ffffff', // white on blue
  },

  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB', // Brand Blue (blue-600)
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // Ensure button stays on top
    ...(isWeb
      ? {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }
      : {}),
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 4,
    }),
  } as any,
  removeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 16,
    marginTop: -1,
  },
  warning: {
    marginTop: 8,
    fontSize: 11,
    color: '#dc2626', // red-600 - darker for readability
    fontWeight: '500',
  },
  advisory: {
    marginTop: 8,
    fontSize: 11,
    color: '#ea580c', // orange-600
    fontWeight: '500',
  },
});
