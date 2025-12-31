import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { ChildInput, FormErrors } from "../types/calculator";
import { MAX_CONTENT_WIDTH, isWeb, useResponsive, webClickableStyles, webInputStyles } from "../utils/responsive";
import { createShadow } from "../utils/shadow-styles";
import { ChildRow } from "./ChildRow";
import { HelpTooltip } from "./HelpTooltip";
import { BrandSwitch } from "./ui/BrandSwitch";

// ============================================================================
// Component Documentation
// ============================================================================
/**
 * CalculatorForm Component
 * 
 * Main form component for child support calculator input fields.
 * Handles income inputs, care arrangements, relevant dependents, and form actions.
 * 
 * Parent Component:
 * - src/screens/CalculatorScreen.tsx (line 148) - Main calculator screen
 *   Passes props from useCalculator() hook state and handlers
 * 
 * Props Interface (CalculatorFormProps):
 * - incomeA: number - Parent A's adjusted taxable income
 * - incomeB: number - Parent B's adjusted taxable income
 * - supportA: boolean - Whether Parent A receives income support
 * - supportB: boolean - Whether Parent B receives income support
 * - childrenData: ChildInput[] - Array of child care arrangement inputs
 * - relDepA: { u13: number; plus13: number } - Parent A relevant dependents
 * - relDepB: { u13: number; plus13: number } - Parent B relevant dependents
 * - errors: FormErrors - Validation error messages by field
 * - incomePercA?: number - Optional: Parent A's income percentage (for display)
 * - incomePercB?: number - Optional: Parent B's income percentage (for display)
 * - csiA?: number - Optional: Parent A's Child Support Income (for display)
 * - csiB?: number - Optional: Parent B's Child Support Income (for display)
 * - onIncomeAChange: (value: number) => void - Handler for Parent A income changes
 * - onIncomeBChange: (value: number) => void - Handler for Parent B income changes
 * - onSupportAChange: (checked: boolean) => void - Handler for Parent A support toggle
 * - onSupportBChange: (checked: boolean) => void - Handler for Parent B support toggle
 * - onAddChild: () => void - Handler to add new child to form
 * - onRemoveChild: (childId: string) => void - Handler to remove child by ID
 * - onUpdateChild: (childId: string, updates: Partial<ChildInput>) => void - Update child data
 * - onRelDepAChange: (updates: Partial<{u13: number; plus13: number}>) => void - Update Parent A dependents
 * - onRelDepBChange: (updates: Partial<{u13: number; plus13: number}>) => void - Update Parent B dependents
 * - onCalculate: () => void - Handler to trigger calculation
 * - onReset: () => void - Handler to reset form to initial state
 * - isDesktopWeb?: boolean - Controls two-column layout and padding (default: false)
 * 
 * Data Flow:
 * - State managed by useCalculator() hook in CalculatorScreen
 * - Form changes trigger setIsStale(true) in parent handlers
 * - Calculation results passed back via useCalculator().results
 * - Results displayed in CalculatorResults component overlay
 * 
 * Child Components:
 * - ChildRow - Individual child care arrangement input row
 * - RelevantDependentsPopover - Compact popover for relevant dependents
 * - BrandSwitch - Custom branded toggle switch component
 * - HelpTooltip - Contextual help tooltips
 * 
 * Layout Behavior:
 * - Mobile: Single column, full width, bottom padding for results overlay
 * - Desktop (isDesktopWeb=true): Two-column layout, constrained width, reduced padding
 * - Responsive input widths: 160px (mobile), 180px (tablet), 200px (desktop)
 * 
 * Form Sections:
 * 1. Income Card - Parent A/B income inputs, income support toggles, relevant dependents
 * 2. Care Card - Child care arrangement inputs (nights per period, age groups)
 * 3. Action Buttons - Calculate and Reset buttons
 * 
 * Validation:
 * - Errors passed via errors prop from useCalculator() hook
 * - Displayed inline below relevant input fields
 * - Error styling applied to inputs (red border, light red background)
 */

// ============================================================================
// RelevantDependentsPopover - Compact button with popover for dependents
// ============================================================================

interface RelevantDependentsPopoverProps {
  relDepA: { u13: number; plus13: number };
  relDepB: { u13: number; plus13: number };
  onRelDepAChange: (updates: Partial<{ u13: number; plus13: number }>) => void;
  onRelDepBChange: (updates: Partial<{ u13: number; plus13: number }>) => void;
  compact?: boolean; // For horizontal layout
}

// ... (imports remain the same)

function RelevantDependentsPopover({
  relDepA,
  relDepB,
  onRelDepAChange,
  onRelDepBChange,
  compact = false,
}: RelevantDependentsPopoverProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useResponsive(); // Use the existing hook
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
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Mobile Native App (remains the same)
  if (!isWeb) {
    /* ... keep your existing Native Modal code ... */
  }

  // FIXED Web/Mobile Browser Drawer
  return (
    <View style={[
      compact ? popoverStyles.drawerContainerCompact : popoverStyles.drawerContainer,
      isWeb && {
        display: 'flex' as any,
        flexDirection: isMobile ? 'column' as any : 'row' as any, // Stack trigger on mobile
        alignItems: isMobile ? 'flex-start' as any : 'center' as any,
        width: '100%'
      }
    ]}>
      <View ref={triggerRef} style={{ flexShrink: 0, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Pressable
          onPress={handleToggle}
          onHoverIn={() => setIsHovered(true)}
          onHoverOut={() => setIsHovered(false)}
          style={[
            compact ? popoverStyles.triggerButtonCompact : popoverStyles.triggerButton,
            hasValues && popoverStyles.triggerButtonActive,
            isHovered && popoverStyles.triggerButtonHover,
            webClickableStyles,
          ]}
          accessibilityRole="button"
          accessibilityLabel={hasValues ? `Relevant Dependents: ${totalDeps} total` : 'Add relevant dependents'}
          accessibilityHint="Tap to add dependent children from other relationships"
        >
          <Text style={[
            compact ? popoverStyles.triggerTextCompact : popoverStyles.triggerText,
            hasValues && popoverStyles.triggerTextActive,
          ]}>
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
          isWeb && {
            // Dynamic width: Full width on mobile, fixed on desktop
            width: isOpen ? (isMobile ? '100%' : (compact ? '400px' : '450px')) : '0px',
            height: isOpen ? 'auto' : '0px', // Allow vertical expansion
            opacity: isOpen ? 1 : 0,
            overflow: 'hidden' as any,
            transition: 'width 0.3s ease-out, opacity 0.3s ease-out, height 0.3s' as any,
            marginTop: isMobile && isOpen ? 8 : 0, // Gap when stacked
          } as any
        ]}
      >
        <View style={[popoverStyles.drawerInner, isMobile && { paddingLeft: 0 }]}>
          <View style={[
            popoverStyles.drawerInputsRow,
            isMobile && { flexWrap: 'wrap', gap: 16 } // Wrap inputs on mobile
          ]}>
            {/* Parent A */}
            <View style={popoverStyles.drawerInputGroup}>
              <Text style={popoverStyles.drawerParentLabel}>A</Text>
              <View style={popoverStyles.drawerAgeInputs}>
                <View style={popoverStyles.drawerAgeGroup}>
                  <Text style={popoverStyles.drawerAgeLabel}>&lt;13</Text>
                  <TextInput
                    style={[popoverStyles.drawerInput, webInputStyles]}
                    value={relDepA.u13.toString()}
                    onChangeText={(text) => onRelDepAChange({ u13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })}
                    keyboardType="numeric"
                    accessibilityLabel="Parent A dependents under 13"
                    accessibilityHint="Number of relevant dependent children under 13 for Parent A"
                  />
                </View>
                <View style={popoverStyles.drawerAgeGroup}>
                  <Text style={popoverStyles.drawerAgeLabel}>13+</Text>
                  <TextInput
                    style={[popoverStyles.drawerInput, webInputStyles]}
                    value={relDepA.plus13.toString()}
                    onChangeText={(text) => onRelDepAChange({ plus13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })}
                    keyboardType="numeric"
                    accessibilityLabel="Parent A dependents 13 and over"
                    accessibilityHint="Number of relevant dependent children 13 and over for Parent A"
                  />
                </View>
              </View>
            </View>

            {/* Separator - Hide on mobile if wrapped */}
            {!isMobile && <View style={popoverStyles.drawerSeparator} />}

            {/* Parent B */}
            <View style={popoverStyles.drawerInputGroup}>
              <Text style={popoverStyles.drawerParentLabel}>B</Text>
              <View style={popoverStyles.drawerAgeInputs}>
                <View style={popoverStyles.drawerAgeGroup}>
                  <Text style={popoverStyles.drawerAgeLabel}>&lt;13</Text>
                  <TextInput
                    style={[popoverStyles.drawerInput, webInputStyles]}
                    value={relDepB.u13.toString()}
                    onChangeText={(text) => onRelDepBChange({ u13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })}
                    keyboardType="numeric"
                    accessibilityLabel="Parent B dependents under 13"
                    accessibilityHint="Number of relevant dependent children under 13 for Parent B"
                  />
                </View>
                <View style={popoverStyles.drawerAgeGroup}>
                  <Text style={popoverStyles.drawerAgeLabel}>13+</Text>
                  <TextInput
                    style={[popoverStyles.drawerInput, webInputStyles]}
                    value={relDepB.plus13.toString()}
                    onChangeText={(text) => onRelDepBChange({ plus13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })}
                    keyboardType="numeric"
                    accessibilityLabel="Parent B dependents 13 and over"
                    accessibilityHint="Number of relevant dependent children 13 and over for Parent B"
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
    backgroundColor: '#eff6ff', // blue-50
    borderWidth: 1.5,
    borderColor: '#bfdbfe', // blue-200
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  triggerButtonHover: {
    ...(isWeb ? ({ backgroundColor: '#dbeafe' } as any) : {}), // blue-100
  },
  triggerButtonCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#eff6ff', // blue-50
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
    color: '#2563EB', // blue-600 (Brand Blue)
    fontWeight: '600',
  },
  triggerTextCompact: {
    fontSize: 12,
    color: '#2563EB', // blue-600 (Brand Blue)
    fontWeight: '600',
  },
  triggerTextActive: {
    color: '#2563EB', // Brand Blue (blue-600)
    fontWeight: '600',
  },
  plusIcon: {
    fontSize: 16,
    color: '#2563EB', // blue-600 (Brand Blue)
    fontWeight: '700',
  },
  // Inline drawer content - expands to the right
  drawerContent: {
    overflow: 'hidden',
    // height: 40, <-- REMOVE THIS so it can grow if inputs wrap
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerParentLabel: {
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
  // Mobile modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mobileContent: {
    backgroundColor: '#ffffff', // white
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0', // subtle border
    padding: 16,
    minWidth: 280,
    maxWidth: 340,
    gap: 16,
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 10,
    }),
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b', // slate-500
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  closeButton: {
    marginLeft: 'auto',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f7fafc', // very light grey
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#4a5568', // dark grey
    lineHeight: 20,
    fontWeight: '400',
  },
  parentsRow: {
    flexDirection: "row",
    gap: 24,
  },
  parentCol: {
    flexShrink: 0,
    gap: 8,
  },
  parentLabelA: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a5568', // dark grey - consistent
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  parentLabelB: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a5568', // dark grey - consistent
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  inputGroup: {
    alignItems: 'center',
    gap: 4,
  },
  ageLabel: {
    fontSize: 11,
    color: '#64748b', // slate-500
    fontWeight: '600',
  },
  input: {
    width: 50, // Slightly larger for better touch target
    paddingHorizontal: 4,
    paddingVertical: 10, // Increased vertical padding for touch
    fontSize: 16,
    textAlign: 'center',
    color: '#1a202c', // near black
    borderWidth: 1.5,
    borderColor: '#e2e8f0', // subtle border
    borderRadius: 6,
    backgroundColor: '#ffffff', // white
  },
  clearButton: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ffffff', // white
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#e2e8f0', // subtle border
  },
  clearButtonText: {
    fontSize: 12,
    color: '#5a6570', // dark grey - WCAG AA compliant (7.0:1)
    fontWeight: '500',
  },
});

interface CalculatorFormProps {
  incomeA: number;
  incomeB: number;
  supportA: boolean;
  supportB: boolean;
  childrenData: ChildInput[];
  relDepA: { u13: number; plus13: number };
  relDepB: { u13: number; plus13: number };
  errors: FormErrors;
  incomePercA?: number;
  incomePercB?: number;
  csiA?: number;
  csiB?: number;
  onIncomeAChange: (value: number) => void;
  onIncomeBChange: (value: number) => void;
  onSupportAChange: (checked: boolean) => void;
  onSupportBChange: (checked: boolean) => void;
  onAddChild: () => void;
  onRemoveChild: (childId: string) => void;
  onUpdateChild: (childId: string, updates: Partial<ChildInput>) => void;
  onRelDepAChange: (updates: Partial<{ u13: number; plus13: number }>) => void;
  onRelDepBChange: (updates: Partial<{ u13: number; plus13: number }>) => void;
  onCalculate: () => void;
  onReset: () => void;
  isDesktopWeb?: boolean;  // Controls padding and width for two-column layout
}

export function CalculatorForm({
  incomeA,
  incomeB,
  supportA,
  supportB,
  childrenData,
  relDepA,
  relDepB,
  errors,
  incomePercA,
  incomePercB,
  csiA,
  csiB,
  onIncomeAChange,
  onIncomeBChange,
  onSupportAChange,
  onSupportBChange,
  onAddChild,
  onRemoveChild,
  onUpdateChild,
  onRelDepAChange,
  onRelDepBChange,
  onCalculate,
  onReset,
  isDesktopWeb = false,
}: CalculatorFormProps) {
  const { isMobile, isDesktop, width } = useResponsive();

  // Web-specific container styles (only apply max-width when NOT in two-column mode)
  const webContainerStyle = isWeb && !isDesktopWeb ? {
    maxWidth: MAX_CONTENT_WIDTH,
    width: '100%' as const,
    alignSelf: 'center' as const,
  } : {};

  // Adjust bottom padding: larger padding on mobile to ensure buttons stay above results card
  // Increased to 250 to accommodate the blue results footer at the bottom (approx 200px height)
  const contentPaddingBottom = isDesktopWeb ? 40 : 250;

  // Responsive input width - sized for 8 digits (up to $99,999,999)
  const inputWidth = isMobile ? 160 : isDesktop ? 200 : 180;

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.contentContainer, { paddingBottom: contentPaddingBottom }, webContainerStyle]}>
      {/* Combined Parents Card */}
      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>1</Text>
          </View>
          <Text style={styles.sectionHeading}>INCOME</Text>
        </View>

        {/* Parent A */}
        <View style={styles.inputGroup}>
          <View style={[styles.labelRow, { gap: 8 }]}>
            <Text style={styles.label}>
              <Text style={styles.parentTitleA}>Parent A</Text>
              <Text> - Adjusted Taxable Income</Text>
            </Text>
            <HelpTooltip
              what="A parent's ATI includes:
- Taxable income
- Reportable fringe benefits
- Target foreign income
- Total net investment loss
- Tax-free pensions or benefits
- Reportable superannuation contributions"
              why=""
              hideWhatLabel
            />
          </View>
          <View style={styles.inputRow}>
            <View style={[styles.currencyInputContainer, { width: inputWidth, minWidth: inputWidth }]}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[styles.currencyInput, { width: inputWidth, minWidth: inputWidth }, errors.incomeA && styles.inputError, isWeb && webInputStyles]}
                value={incomeA ? incomeA.toString() : ""}
                onChangeText={(text) => {
                  const val = text.replace(/[^0-9]/g, "");
                  onIncomeAChange(parseInt(val) || 0);
                }}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#64748b"
                accessibilityLabel="Parent A adjusted taxable income"
                accessibilityHint="Enter Parent A's annual income in dollars"              
              />
            </View>
            <View style={styles.switchRow}>
              <BrandSwitch
                value={supportA}
                onValueChange={onSupportAChange}
                style={styles.smallSwitch}
                accessibilityLabel="Parent A receives income support"
                accessibilityHint="Toggle if Parent A receives income support payments"
                // @ts-ignore - Explicitly force the web attribute
                aria-checked={supportA}
              />
              <Text style={styles.switchLabelSmall}>Inc. support</Text>
              <HelpTooltip
                what="Whether or not a parent received an income support payment in their taxable income can move the assessment away from using the formula to a fixed or minimum rate under certain conditions"
                why=""
                hideWhatLabel
              />
            </View>
          </View>
          {errors.incomeA && (
            <Text style={styles.errorText}>{errors.incomeA}</Text>
          )}
        </View>

        {/* Parent B */}
        <View style={[styles.inputGroup, { marginTop: 16 }]}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>
              <Text style={styles.parentTitleB}>Parent B</Text>
              <Text> - Adjusted Taxable Income</Text>
            </Text>
          </View>
          <View style={styles.inputRow}>
            <View style={[styles.currencyInputContainer, { width: inputWidth, minWidth: inputWidth }]}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[styles.currencyInput, { width: inputWidth, minWidth: inputWidth }, errors.incomeB && styles.inputError, isWeb && webInputStyles]}
                value={incomeB ? incomeB.toString() : ""}
                onChangeText={(text) => {
                  const val = text.replace(/[^0-9]/g, "");
                  onIncomeBChange(parseInt(val) || 0);
                }}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#64748b"
                accessibilityLabel="Parent B adjusted taxable income"
                accessibilityHint="Enter Parent B's annual income in dollars"
              />
            </View>
            <View style={styles.switchRow}>
              <BrandSwitch
                value={supportB}
                onValueChange={onSupportBChange}
                style={styles.smallSwitch}
                accessibilityLabel="Parent B receives income support"
                accessibilityHint="Toggle if Parent B receives income support payments"
                // @ts-ignore - Explicitly force the web attribute
                aria-checked={supportB}
              />
              <Text style={styles.switchLabelSmall}>Inc. support</Text>
            </View>
          </View>
          {errors.incomeB && (
            <Text style={styles.errorText}>{errors.incomeB}</Text>
          )}
        </View>

        {/* Relevant Dependents - Compact Button with Popover */}
        <View style={[styles.inputGroup, { marginTop: 16 }]}>
          <RelevantDependentsPopover
            relDepA={relDepA}
            relDepB={relDepB}
            onRelDepAChange={onRelDepAChange}
            onRelDepBChange={onRelDepBChange}
          />
        </View>
      </View>

      {/* Children Card */}
      <View style={styles.card}>
        <View style={[styles.labelRow, { gap: 8, marginBottom: 8 }]}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>2</Text>
            </View>
            <Text style={[styles.sectionHeading, { marginBottom: 0 }]}>CARE</Text>
          </View>
          <HelpTooltip
            what="Enter the number of nights each parent has care of the child per week, fortnight, or year and if the child is over or under 13 years of age."
            why=""
            hideWhatLabel
          />
        </View>

        <View style={styles.childrenList}>
          {childrenData.map((child) => (
            <ChildRow
              key={child.id}
              child={child}
              onUpdate={(updates) => onUpdateChild(child.id, updates)}
              onRemove={() => onRemoveChild(child.id)}
            />
          ))}
        </View>

        {errors.children && (
          <Text style={styles.errorText}>{errors.children}</Text>
        )}

        <Pressable
          onPress={onAddChild}
          style={[styles.addChildButton, isWeb && webClickableStyles]}
          accessibilityRole="button"
          accessibilityLabel="Add another child to the calculation"
        >
          <Text style={styles.addChildButtonText}>+ Add Child</Text>
        </Pressable>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Pressable
          onPress={onCalculate}
          style={[styles.calculateButton, isWeb && webClickableStyles]}
          accessibilityRole="button"
          accessibilityLabel="Calculate child support"
        >
          <Text style={styles.calculateButtonText}>Calculate</Text>
        </Pressable>
        <Pressable
          onPress={onReset}
          style={[styles.resetButton, isWeb && webClickableStyles]}
          accessibilityRole="button"
          accessibilityLabel="Reset form to default values"
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    // paddingBottom is set dynamically based on isDesktopWeb
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff", // pure white for content
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0", // subtle but visible border
    // Cross-platform shadow for better depth perception
    ...createShadow({
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5a6570", // dark grey - WCAG AA compliant (7.0:1)
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2563EB", // Brand Blue (blue-600)
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff", // white text
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "800", // extra bold
    color: "#0f172a", // slate-900 - dark slate
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#5a6570", // dark grey - WCAG AA compliant (7.0:1)
    marginTop: 2,
  },
  parentsGrid: {
    flexDirection: "row",
    gap: 24,
    flexWrap: "wrap",
  },
  parentSection: {
    flex: 1,
    minWidth: 200,
    gap: 12,
  },
  parentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b", // slate-500 - improved contrast (4.61:1)
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  parentTitleA: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4a5568", // dark grey - consistent with Parent B
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  parentTitleB: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4a5568", // dark grey - consistent with Parent A
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputGroup: {
    gap: 4,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4a5568", // dark grey for labels
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "nowrap",
  },
  currencyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    // Width is now set dynamically via inline style
    flex: 0,
    flexShrink: 0,
    zIndex: 2,
  },
  currencySymbol: {
    position: "absolute",
    left: 12,
    color: "#5a6570", // dark grey - WCAG AA compliant (7.0:1)
    fontSize: 18,
    fontWeight: "500",
    zIndex: 1,
  },
  currencyInput: {
    // Width is set via inline style for responsive behavior
    paddingLeft: 32,
    paddingRight: 12,
    paddingVertical: 10,
    fontSize: 18,
    color: "#1a202c", // near black, high contrast
    borderWidth: 1.5,
    borderColor: "#e2e8f0", // subtle border
    borderRadius: 8,
    backgroundColor: "#ffffff", // white input background
  },
  inputError: {
    borderColor: "#ef4444", // red-500
    backgroundColor: "rgba(239, 68, 68, 0.1)", // red-500 with opacity
  },
  errorText: {
    fontSize: 14,
    color: "#f87171", // red-400
    marginTop: 4,
  },
  incomeBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  incomeBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#334155", // slate-700
    borderRadius: 4,
    overflow: "hidden",
  },
  incomeBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  incomePercText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6", // blue-500
    width: 40,
    textAlign: "right",
  },
  csiText: {
    fontSize: 12,
    color: "#64748b", // slate-500 - improved contrast (4.61:1)
    marginLeft: 8,
    fontWeight: "500", // Added weight for better visibility
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  smallSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  switchLabelSmall: {
    fontSize: 13, // Increased from 12 for better readability
    color: "#4a5568", // dark grey - better contrast (7.7:1)
    fontWeight: "500", // Added weight for better visibility
  },
  switchLabel: {
    fontSize: 14,
    color: "#4a5568", // dark grey
  },
  childrenList: {
    gap: 12,
  },
  addChildButton: {
    marginTop: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#bfdbfe", // blue-200 - solid border
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff6ff", // blue-50 - Ghost Blue background
  },
  addChildButtonText: {
    color: "#2563EB", // blue-600 - Brand Blue text
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  calculateButton: {
    flex: 2,
    backgroundColor: "#0056b3", // Darker blue for better contrast (WCAG AA compliant)
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  calculateButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#ffffff", // white background
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0", // subtle border
  },
  resetButtonText: {
    color: "#4a5568", // medium grey
    fontSize: 16,
    fontWeight: "600",
  },
});