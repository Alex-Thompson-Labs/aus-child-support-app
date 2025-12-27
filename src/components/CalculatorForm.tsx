import React, { useState, useRef, useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View, Modal, Platform, Dimensions } from "react-native";
import type { ChildInput, FormErrors } from "../types/calculator";
import { ChildRow } from "./ChildRow";
import { HelpTooltip } from "./HelpTooltip";
import { useResponsive, MAX_CONTENT_WIDTH, MAX_TWO_COLUMN_WIDTH, isWeb, webInputStyles, webClickableStyles, webOnlyStyles } from "../utils/responsive";

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

function RelevantDependentsPopover({
  relDepA,
  relDepB,
  onRelDepAChange,
  onRelDepBChange,
  compact = false,
}: RelevantDependentsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate total dependents for badge
  const totalDeps = relDepA.u13 + relDepA.plus13 + relDepB.u13 + relDepB.plus13;
  const hasValues = totalDeps > 0;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Close drawer when clicking outside (for web)
  useEffect(() => {
    if (isWeb && isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-drawer-content]') && !target.closest('[data-drawer-trigger]')) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // For mobile: still use modal
  if (!isWeb) {
    return (
      <View style={compact ? popoverStyles.containerCompact : popoverStyles.container}>
        <Pressable
          onPress={handleToggle}
          style={[
            compact ? popoverStyles.triggerButtonCompact : popoverStyles.triggerButton,
            hasValues && popoverStyles.triggerButtonActive,
          ]}
        >
          <Text style={[
            compact ? popoverStyles.triggerTextCompact : popoverStyles.triggerText,
            hasValues && popoverStyles.triggerTextActive,
          ]}>
            {hasValues ? `Dependents: ${totalDeps}` : 'Rel. Dependents'}
          </Text>
          {!hasValues && (
            <Text style={popoverStyles.plusIcon}>+</Text>
          )}
        </Pressable>

        <Modal
          visible={isOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsOpen(false)}
        >
          <Pressable
            style={popoverStyles.modalOverlay}
            onPress={() => setIsOpen(false)}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={popoverStyles.mobileContent}>
                <View style={popoverStyles.mobileHeader}>
                  <Text style={popoverStyles.title}>Relevant Dependents</Text>
                  <HelpTooltip
                    header="REDUCES ASSESSABLE INCOME"
                    what="Number of children in the parents care from a different relationship and not a claimed for child in a separate case."
                    why=""
                    hideWhatLabel
                  />
                  <Pressable onPress={() => setIsOpen(false)} style={popoverStyles.closeButton}>
                    <Text style={popoverStyles.closeButtonText}>×</Text>
                  </Pressable>
                </View>

                <View style={popoverStyles.parentsRow}>
                  <View style={popoverStyles.parentCol}>
                    <Text style={popoverStyles.parentLabelA}>Parent A</Text>
                    <View style={popoverStyles.inputsRow}>
                      <View style={popoverStyles.inputGroup}>
                        <Text style={popoverStyles.ageLabel}>&lt;13</Text>
                        <TextInput
                          style={popoverStyles.input}
                          value={relDepA.u13.toString()}
                          onChangeText={(text) =>
                            onRelDepAChange({ u13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })
                          }
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={popoverStyles.inputGroup}>
                        <Text style={popoverStyles.ageLabel}>13+</Text>
                        <TextInput
                          style={popoverStyles.input}
                          value={relDepA.plus13.toString()}
                          onChangeText={(text) =>
                            onRelDepAChange({ plus13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })
                          }
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={popoverStyles.parentCol}>
                    <Text style={popoverStyles.parentLabelB}>Parent B</Text>
                    <View style={popoverStyles.inputsRow}>
                      <View style={popoverStyles.inputGroup}>
                        <Text style={popoverStyles.ageLabel}>&lt;13</Text>
                        <TextInput
                          style={popoverStyles.input}
                          value={relDepB.u13.toString()}
                          onChangeText={(text) =>
                            onRelDepBChange({ u13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })
                          }
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={popoverStyles.inputGroup}>
                        <Text style={popoverStyles.ageLabel}>13+</Text>
                        <TextInput
                          style={popoverStyles.input}
                          value={relDepB.plus13.toString()}
                          onChangeText={(text) =>
                            onRelDepBChange({ plus13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })
                          }
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  </View>
                </View>

                {hasValues && (
                  <Pressable
                    style={popoverStyles.clearButton}
                    onPress={() => {
                      onRelDepAChange({ u13: 0, plus13: 0 });
                      onRelDepBChange({ u13: 0, plus13: 0 });
                    }}
                  >
                    <Text style={popoverStyles.clearButtonText}>Clear All</Text>
                  </Pressable>
                )}
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    );
  }

  // For web: inline expanding drawer
  return (
    <View style={[
      compact ? popoverStyles.drawerContainerCompact : popoverStyles.drawerContainer,
      isWeb && { 
        display: 'flex' as any, 
        flexDirection: 'row' as any, 
        alignItems: 'center' as any 
      }
    ]}>
      {/* Trigger Button */}
      <Pressable
        onPress={handleToggle}
        style={[
          compact ? popoverStyles.triggerButtonCompact : popoverStyles.triggerButton,
          hasValues && popoverStyles.triggerButtonActive,
          webClickableStyles,
          { flexShrink: 0 }
        ]}
        {...{ 'data-drawer-trigger': true } as any}
      >
        <Text style={[
          compact ? popoverStyles.triggerTextCompact : popoverStyles.triggerText,
          hasValues && popoverStyles.triggerTextActive,
        ]}>
          {hasValues ? `Dependents: ${totalDeps}` : 'Rel. Dependents'}
        </Text>
        {!hasValues && (
          <Text style={popoverStyles.plusIcon}>+</Text>
        )}
      </Pressable>

      {/* Inline Drawer - Expands to the right */}
      <View 
        style={[
          popoverStyles.drawerContent,
          isOpen && popoverStyles.drawerContentOpen,
          isWeb && {
            width: isOpen ? (compact ? '400px' : '450px') : '0px',
            opacity: isOpen ? 1 : 0,
            overflow: 'hidden' as any,
            transition: 'width 0.3s ease-out, opacity 0.3s ease-out' as any,
          }
        ]}
        {...(isWeb ? { 'data-drawer-content': true } as any : {})}
      >
        <View style={popoverStyles.drawerInner}>
          {/* Compact header for inline drawer */}
          <View style={popoverStyles.drawerHeader}>
            <HelpTooltip
              header="REDUCES ASSESSABLE INCOME"
              what="Number of children in the parents care from a different relationship and not a claimed for child in a separate case."
              why=""
              hideWhatLabel
            />
          </View>

          {/* Input fields in horizontal layout */}
          <View style={popoverStyles.drawerInputsRow}>
            {/* Parent A inputs */}
            <View style={popoverStyles.drawerInputGroup}>
              <Text style={popoverStyles.drawerParentLabel}>A</Text>
              <View style={popoverStyles.drawerAgeInputs}>
                <View style={popoverStyles.drawerAgeGroup}>
                  <Text style={popoverStyles.drawerAgeLabel}>&lt;13</Text>
                  <TextInput
                    style={[popoverStyles.drawerInput, webInputStyles]}
                    value={relDepA.u13.toString()}
                    onChangeText={(text) =>
                      onRelDepAChange({ u13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })
                    }
                    keyboardType="numeric"
                  />
                </View>
                <View style={popoverStyles.drawerAgeGroup}>
                  <Text style={popoverStyles.drawerAgeLabel}>13+</Text>
                  <TextInput
                    style={[popoverStyles.drawerInput, webInputStyles]}
                    value={relDepA.plus13.toString()}
                    onChangeText={(text) =>
                      onRelDepAChange({ plus13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Separator */}
            <View style={popoverStyles.drawerSeparator} />

            {/* Parent B inputs */}
            <View style={popoverStyles.drawerInputGroup}>
              <Text style={popoverStyles.drawerParentLabel}>B</Text>
              <View style={popoverStyles.drawerAgeInputs}>
                <View style={popoverStyles.drawerAgeGroup}>
                  <Text style={popoverStyles.drawerAgeLabel}>&lt;13</Text>
                  <TextInput
                    style={[popoverStyles.drawerInput, webInputStyles]}
                    value={relDepB.u13.toString()}
                    onChangeText={(text) =>
                      onRelDepBChange({ u13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })
                    }
                    keyboardType="numeric"
                  />
                </View>
                <View style={popoverStyles.drawerAgeGroup}>
                  <Text style={popoverStyles.drawerAgeLabel}>13+</Text>
                  <TextInput
                    style={[popoverStyles.drawerInput, webInputStyles]}
                    value={relDepB.plus13.toString()}
                    onChangeText={(text) =>
                      onRelDepBChange({ plus13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Clear button - compact inline version */}
            {hasValues && (
              <Pressable
                style={[popoverStyles.drawerClearButton, webClickableStyles]}
                onPress={() => {
                  onRelDepAChange({ u13: 0, plus13: 0 });
                  onRelDepBChange({ u13: 0, plus13: 0 });
                }}
              >
                <Text style={popoverStyles.drawerClearButtonText}>×</Text>
              </Pressable>
            )}
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
    backgroundColor: '#334155', // slate-700
    borderWidth: 1,
    borderColor: '#475569', // slate-600
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  triggerButtonCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#334155', // slate-700
    borderWidth: 1,
    borderColor: '#475569', // slate-600
    borderRadius: 6,
    borderStyle: 'dashed',
  },
  triggerButtonActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)', // amber-500 with opacity
    borderColor: '#f59e0b', // amber-500
    borderStyle: 'solid',
  },
  triggerText: {
    fontSize: 14,
    color: '#94a3b8', // slate-400
    fontWeight: '500',
  },
  triggerTextCompact: {
    fontSize: 12,
    color: '#94a3b8', // slate-400
    fontWeight: '500',
  },
  triggerTextActive: {
    color: '#f59e0b', // amber-500
    fontWeight: '600',
  },
  plusIcon: {
    fontSize: 16,
    color: '#64748b', // slate-500
    fontWeight: '600',
  },
  // Inline drawer content - expands to the right
  drawerContent: {
    overflow: 'hidden',
    height: 40, // Match the height of income inputs
  },
  drawerContentOpen: {
    // Width and opacity are set dynamically via inline styles with transition
  },
  drawerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    paddingLeft: 12,
  },
  drawerHeader: {
    marginRight: 8,
  },
  drawerInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drawerInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerParentLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10b981', // emerald-500
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
    color: '#f59e0b', // amber-500
    fontWeight: '600',
    minWidth: 20,
  },
  drawerInput: {
    width: 36,
    paddingHorizontal: 4,
    paddingVertical: 6,
    fontSize: 14,
    textAlign: 'center',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#475569', // slate-600
    borderRadius: 4,
    backgroundColor: '#334155', // slate-700
  },
  drawerSeparator: {
    width: 1,
    height: 24,
    backgroundColor: '#475569', // slate-600
    marginHorizontal: 4,
  },
  drawerClearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#334155', // slate-700
    borderWidth: 1,
    borderColor: '#475569', // slate-600
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  drawerClearButtonText: {
    fontSize: 16,
    color: '#94a3b8', // slate-400
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
    backgroundColor: '#1e293b', // slate-800
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#475569', // slate-600
    padding: 16,
    minWidth: 280,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981', // emerald-500
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  closeButton: {
    marginLeft: 'auto',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#334155', // slate-700
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#94a3b8', // slate-400
    lineHeight: 20,
    fontWeight: '400',
  },
  parentsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  parentCol: {
    flex: 1,
    gap: 8,
  },
  parentLabelA: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6', // blue-500
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  parentLabelB: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8b5cf6', // violet-500
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
    color: '#f59e0b', // amber-500
    fontWeight: '600',
  },
  input: {
    width: 44,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    textAlign: 'center',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#475569', // slate-600
    borderRadius: 6,
    backgroundColor: '#334155', // slate-700
  },
  clearButton: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#334155', // slate-700
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#475569', // slate-600
  },
  clearButtonText: {
    fontSize: 12,
    color: '#94a3b8', // slate-400
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

  // Adjust bottom padding: smaller padding now that we have Calculate button (no floating card until results)
  const contentPaddingBottom = isDesktopWeb ? 40 : 40;

  // Responsive input width - sized for 8 digits (up to $99,999,999)
  const inputWidth = isMobile ? 160 : isDesktop ? 200 : 180;

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.contentContainer, { paddingBottom: contentPaddingBottom }, webContainerStyle]}>
      {/* Combined Parents Card */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Income</Text>
        
        {/* Parent A */}
        <View style={styles.inputGroup}>
          <View style={[styles.labelRow, { gap: 8 }]}>
            <Text style={styles.parentTitleA}>Parent A</Text>
            <Text style={styles.label}> - Adjusted Taxable Income</Text>
            <HelpTooltip
              header="What's Included in ATI?"
              what="- Taxable income
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
              />
            </View>
            <View style={styles.switchRow}>
              <Switch
                value={supportA}
                onValueChange={onSupportAChange}
                trackColor={{ false: "#475569", true: "#f59e0b" }}
                thumbColor="#ffffff"
                style={styles.smallSwitch}
              />
              <Text style={styles.switchLabelSmall}>Inc. support</Text>
              <HelpTooltip
                header="MINIMUM ANNUAL RATE / FIXED ANNUAL RATE"
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
            <Text style={styles.parentTitleB}>Parent B</Text>
            <Text style={styles.label}> - Adjusted Taxable Income</Text>
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
              />
            </View>
            <View style={styles.switchRow}>
              <Switch
                value={supportB}
                onValueChange={onSupportBChange}
                trackColor={{ false: "#475569", true: "#f59e0b" }}
                thumbColor="#ffffff"
                style={styles.smallSwitch}
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
          <Text style={[styles.sectionHeading, { marginBottom: 0 }]}>CARE</Text>
          <HelpTooltip
            header="CARE = OVERNIGHT"
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
        >
          <Text style={styles.addChildButtonText}>+ Add Child</Text>
        </Pressable>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Pressable
          onPress={onCalculate}
          style={[styles.calculateButton, isWeb && webClickableStyles]}
        >
          <Text style={styles.calculateButtonText}>Calculate</Text>
        </Pressable>
        <Pressable
          onPress={onReset}
          style={[styles.resetButton, isWeb && webClickableStyles]}
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
    backgroundColor: "#1e293b", // slate-800
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#334155", // slate-700
    // Web shadow for better depth perception
    ...(isWeb ? {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    } : {}),
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8", // slate-400
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981", // emerald-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#64748b", // slate-500
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
    color: "#94a3b8", // slate-400
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  parentTitleA: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6", // blue-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  parentTitleB: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8b5cf6", // violet-500
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
    color: "#cbd5e1", // slate-300
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
    color: "#94a3b8", // slate-400
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
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#475569", // slate-600
    borderRadius: 8,
    backgroundColor: "#334155", // slate-700
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
    color: "#94a3b8", // slate-400
    marginLeft: 8,
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
    fontSize: 12,
    color: "#94a3b8", // slate-400
  },
  switchLabel: {
    fontSize: 14,
    color: "#cbd5e1", // slate-300
  },
  childrenList: {
    gap: 12,
  },
  addChildButton: {
    marginTop: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#475569", // slate-600
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addChildButtonText: {
    color: "#94a3b8", // slate-400
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  calculateButton: {
    flex: 2,
    backgroundColor: "#3b82f6", // blue-500
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
    backgroundColor: "#334155", // slate-700
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#475569", // slate-600
  },
  resetButtonText: {
    color: "#94a3b8", // slate-400
    fontSize: 16,
    fontWeight: "600",
  },
});

// ============================================================================
// WebHorizontalForm - Horizontal layout for tablet/desktop web (≥768px)
// ============================================================================

interface WebHorizontalFormProps extends CalculatorFormProps {}

export function WebHorizontalForm({
  incomeA,
  incomeB,
  supportA,
  supportB,
  childrenData,
  relDepA,
  relDepB,
  errors,
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
}: WebHorizontalFormProps) {
  const { width } = useResponsive();

  // Compact input width for horizontal layout
  const inputWidth = 140;

  return (
    <View style={[horizontalStyles.outerContainer, { maxWidth: MAX_TWO_COLUMN_WIDTH }, webOnlyStyles as any]}>
      {/* Scrollable main content */}
      <ScrollView style={horizontalStyles.mainContent} contentContainerStyle={horizontalStyles.mainContentContainer}>
        <View style={horizontalStyles.container}>
          {/* Main horizontal row */}
          <View style={horizontalStyles.mainRow}>
            {/* Parent A Income */}
            <View style={horizontalStyles.section}>
              <Text style={horizontalStyles.sectionLabel}>Parent A Income</Text>
              <View style={horizontalStyles.incomeRow}>
                <View style={[horizontalStyles.currencyInputContainer, { width: inputWidth }]}>
                  <Text style={horizontalStyles.currencySymbol}>$</Text>
                  <TextInput
                    style={[horizontalStyles.currencyInput, { width: inputWidth }, errors.incomeA && styles.inputError, webInputStyles]}
                    value={incomeA ? incomeA.toString() : ""}
                    onChangeText={(text) => {
                      const val = text.replace(/[^0-9]/g, "");
                      onIncomeAChange(parseInt(val) || 0);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#64748b"
                  />
                </View>
                <View style={horizontalStyles.switchRow}>
                  <Switch
                    value={supportA}
                    onValueChange={onSupportAChange}
                    trackColor={{ false: "#475569", true: "#f59e0b" }}
                    thumbColor="#ffffff"
                    style={horizontalStyles.smallSwitch}
                  />
                  <Text style={horizontalStyles.switchLabel}>Inc. support</Text>
                </View>
              </View>
            </View>

            {/* Parent B Income */}
            <View style={horizontalStyles.section}>
              <Text style={horizontalStyles.sectionLabel}>Parent B Income</Text>
              <View style={horizontalStyles.incomeRow}>
                <View style={[horizontalStyles.currencyInputContainer, { width: inputWidth }]}>
                  <Text style={horizontalStyles.currencySymbol}>$</Text>
                  <TextInput
                    style={[horizontalStyles.currencyInput, { width: inputWidth }, errors.incomeB && styles.inputError, webInputStyles]}
                    value={incomeB ? incomeB.toString() : ""}
                    onChangeText={(text) => {
                      const val = text.replace(/[^0-9]/g, "");
                      onIncomeBChange(parseInt(val) || 0);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#64748b"
                  />
                </View>
                <View style={horizontalStyles.switchRow}>
                  <Switch
                    value={supportB}
                    onValueChange={onSupportBChange}
                    trackColor={{ false: "#475569", true: "#f59e0b" }}
                    thumbColor="#ffffff"
                    style={horizontalStyles.smallSwitch}
                  />
                  <Text style={horizontalStyles.switchLabel}>Inc. support</Text>
                </View>
              </View>
            </View>

            {/* Relevant Dependents - Compact Popover Button */}
            <View style={horizontalStyles.section}>
              <Text style={horizontalStyles.sectionLabel}>Other Dependents</Text>
              <RelevantDependentsPopover
                relDepA={relDepA}
                relDepB={relDepB}
                onRelDepAChange={onRelDepAChange}
                onRelDepBChange={onRelDepBChange}
                compact
              />
            </View>
          </View>

          {/* Children / Care - Horizontal scrolling Netflix-style */}
          <View style={horizontalStyles.childrenSection}>
            <Text style={horizontalStyles.sectionLabel}>
              Children (Care Nights) {childrenData.length > 0 && `- ${childrenData.length} child${childrenData.length > 1 ? 'ren' : ''}`}
            </Text>
            <View style={horizontalStyles.scrollWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                style={horizontalStyles.childrenScrollContainer}
                contentContainerStyle={horizontalStyles.childrenScrollContent}
              >
                {childrenData.map((child, index) => (
                  <View key={child.id} style={horizontalStyles.childCardWrapper}>
                    <ChildRow
                      child={child}
                      onUpdate={(updates) => onUpdateChild(child.id, updates)}
                      onRemove={() => onRemoveChild(child.id)}
                      childIndex={index + 1}
                      totalChildren={childrenData.length}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
            {errors.children && (
              <Text style={styles.errorText}>{errors.children}</Text>
            )}
            <Pressable
              onPress={onAddChild}
              style={[horizontalStyles.addButton, webClickableStyles]}
            >
              <Text style={horizontalStyles.addButtonText}>+ Add Child</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const horizontalStyles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
  },
  mainContent: {
    flex: 1,
  },
  mainContentContainer: {
    flexGrow: 1,
  },
  container: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#1e293b", // slate-800
    borderBottomWidth: 1,
    borderBottomColor: "#334155", // slate-700
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 20,
  },
  section: {
    minWidth: 160,
  },
  // Children section - full width with horizontal scrolling
  childrenSection: {
    width: "100%",
    marginTop: 16,
  },
  scrollWrapper: {
    position: "relative",
    width: "100%",
  },
  childrenScrollContainer: {
    width: "100%",
    ...(isWeb ? {
      scrollSnapType: "x mandatory",
      overflowX: "auto",
      // Enhanced scrollbar styling for web
      scrollbarWidth: "thin",
      scrollbarColor: "#f59e0b #334155",
    } : {}),
  } as any,
  childrenScrollContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingRight: 12,
    paddingBottom: 8,
  },
  scrollIndicator: {
    position: "absolute",
    bottom: -28,
    right: 20,
    backgroundColor: "rgba(15, 23, 42, 0.9)", // slate-900 with opacity
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f59e0b", // amber-500
  },
  scrollIndicatorText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#f59e0b", // amber-500
    letterSpacing: 0.5,
  },
  footerSection: {
    minWidth: 140,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#10b981", // emerald-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  incomeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  currencyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  currencySymbol: {
    position: "absolute",
    left: 10,
    color: "#94a3b8", // slate-400
    fontSize: 16,
    fontWeight: "500",
    zIndex: 1,
  },
  currencyInput: {
    paddingLeft: 28,
    paddingRight: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#475569", // slate-600
    borderRadius: 6,
    backgroundColor: "#334155", // slate-700
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  smallSwitch: {
    transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
  },
  switchLabel: {
    fontSize: 11,
    color: "#94a3b8", // slate-400
  },
  childCardWrapper: {
    flexShrink: 0,
  },
  noChildrenText: {
    fontSize: 13,
    color: "#64748b", // slate-500
    fontStyle: "italic",
    paddingVertical: 8,
  },
  addButton: {
    marginTop: 12,
    width: 105,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#f59e0b", // amber-500
    borderRadius: 6,
    borderWidth: 0,
    alignItems: "center",
    alignSelf: "flex-start",
    ...(isWeb ? {
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    } : {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    }),
  } as any,
  addButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f172a", // slate-900
  },
  buttonsSection: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  calculateButton: {
    backgroundColor: "#3b82f6", // blue-500
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  calculateButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  resetButton: {
    backgroundColor: "#334155", // slate-700
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#475569", // slate-600
  },
  resetButtonText: {
    color: "#94a3b8", // slate-400
    fontSize: 14,
    fontWeight: "600",
  },
});

