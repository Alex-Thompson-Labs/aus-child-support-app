import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ChildInput } from '../utils/calculator';
import { CARE_PERIOD_DAYS } from '../utils/child-support-constants';
import {
  isWeb,
  useResponsive,
  webClickableStyles,
  webInputStyles,
} from '../utils/responsive';
import { createShadow } from '../utils/shadow-styles';
import { PeriodPicker } from './PeriodPicker';

interface ChildRowProps {
  child: ChildInput;
  onUpdate: (updates: Partial<ChildInput>) => void;
  onRemove: () => void;
  childIndex?: number;
  totalChildren?: number;
}

export function ChildRow({
  child,
  onUpdate,
  onRemove,
  childIndex,
  totalChildren,
}: ChildRowProps) {
  const { isMobile } = useResponsive();

  // Local state for input values while editing
  const [editingField, setEditingField] = useState<'A' | 'B' | null>(null);
  const [localValue, setLocalValue] = useState('');

  const maxValue =
    child.carePeriod === 'week'
      ? 7
      : child.carePeriod === 'fortnight'
      ? 14
      : child.carePeriod === 'year'
      ? 365
      : 100; // percent

  // Calculate if total exceeds maximum
  const totalCare = child.careAmountA + child.careAmountB;
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
    // Auto-adjust other field in real-time
    const newAmountA = parseFloat(cleanedText) || 0;
    const newAmountB = Math.max(0, maxValue - newAmountA);
    onUpdate({ careAmountA: newAmountA, careAmountB: newAmountB });
  };

  const handleChangeB = (text: string) => {
    const cleanedText = text.replace(/[^0-9.]/g, '');
    setLocalValue(cleanedText);
    // Auto-adjust other field in real-time
    const newAmountB = parseFloat(cleanedText) || 0;
    const newAmountA = Math.max(0, maxValue - newAmountB);
    onUpdate({ careAmountA: newAmountA, careAmountB: newAmountB });
  };

  // Blur handlers - commit value and auto-adjust the other field
  const handleBlurA = () => {
    const newAmountA = parseFloat(localValue) || 0;
    const newAmountB = Math.max(0, maxValue - newAmountA);
    onUpdate({ careAmountA: newAmountA, careAmountB: newAmountB });
    setEditingField(null);
    setLocalValue('');
  };

  const handleBlurB = () => {
    const newAmountB = parseFloat(localValue) || 0;
    const newAmountA = Math.max(0, maxValue - newAmountB);
    onUpdate({ careAmountA: newAmountA, careAmountB: newAmountB });
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
            <Text style={styles.headerLabelB}>OTHER PARENT</Text>
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

          {/* Age Range Toggle */}
          <View
            style={[
              styles.toggleWithLabel,
              isMobile && styles.optionItemMobile,
            ]}
          >
            <Text style={styles.toggleLabel}>Age Range</Text>
            <View style={styles.toggleGroup}>
              <Pressable
                onPress={() => onUpdate({ age: 'Under 13' })}
                style={[
                  styles.toggleButton,
                  styles.toggleButtonLeft,
                  child.age === 'Under 13' && styles.toggleButtonActive,
                  isWeb && webClickableStyles,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Select age under 13"
                accessibilityState={{ selected: child.age === 'Under 13' }}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    child.age === 'Under 13' && styles.toggleButtonTextActive,
                  ]}
                >
                  {'<13'}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onUpdate({ age: '13+' })}
                style={[
                  styles.toggleButton,
                  styles.toggleButtonRight,
                  child.age === '13+' && styles.toggleButtonActive13Plus,
                  isWeb && webClickableStyles,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Select age 13 and over"
                accessibilityState={{ selected: child.age === '13+' }}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    child.age === '13+' && styles.toggleButtonTextActive,
                  ]}
                >
                  13+
                </Text>
              </Pressable>
            </View>
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
});
