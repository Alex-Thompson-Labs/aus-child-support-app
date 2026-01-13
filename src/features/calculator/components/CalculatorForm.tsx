import { useAppTheme } from '@/src/theme';
import type {
    ChildInput,
    FormErrors,
    MultiCaseInfo,
    NonParentCarerInfo,
    OtherCaseChild,
} from '@/src/utils/calculator';
import type { AssessmentYear } from '@/src/utils/child-support-constants';
import {
    MAX_CONTENT_WIDTH,
    isWeb,
    useResponsive,
    webClickableStyles,
    webInputStyles,
} from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ChildRow } from './ChildRow';
import { HelpTooltip } from './HelpTooltip';
import { NonParentCarerSection } from './NonParentCarerSection';
import { OtherCasesPopover } from './OtherCasesPopover';
import { RelevantDependentsPopover } from './RelevantDependentsPopover';
import { YearSelector } from './YearSelector';

// ============================================================================
// Component Documentation
// ============================================================================
/**
 * CalculatorForm Component
 *
 * Main form component for child support calculator input fields.
 * Handles income inputs, care arrangements, relevant dependents, and form actions.
 *
 * Updates [2026-01-01]:
 * - Added Semantic HTML mapping (H2 tags) for SEO.
 * - Improved accessibility grouping for screen readers.
 */

interface CalculatorFormProps {
  incomeA: number;
  incomeB: number;
  childrenData: ChildInput[];
  relDepA: { u13: number; plus13: number };
  relDepB: { u13: number; plus13: number };
  errors: FormErrors;
  incomePercA?: number;
  incomePercB?: number;
  csiA?: number;
  csiB?: number;
  selectedYear: AssessmentYear;
  onYearChange: (year: AssessmentYear) => void;
  onIncomeAChange: (value: number) => void;
  onIncomeBChange: (value: number) => void;
  onAddChild: () => void;
  onRemoveChild: (childId: string) => void;
  onUpdateChild: (childId: string, updates: Partial<ChildInput>) => void;
  onRelDepAChange: (updates: Partial<{ u13: number; plus13: number }>) => void;
  onRelDepBChange: (updates: Partial<{ u13: number; plus13: number }>) => void;
  onCalculate: () => void;
  onReset: () => void;
  isDesktopWeb?: boolean;
  // Multi-case support (Formula 3)
  multiCaseA: MultiCaseInfo;
  multiCaseB: MultiCaseInfo;
  onMultiCaseAChange: (otherChildren: OtherCaseChild[]) => void;
  onMultiCaseBChange: (otherChildren: OtherCaseChild[]) => void;
  // Non-parent carer support (Formula 4)
  nonParentCarer: NonParentCarerInfo;
  onNonParentCarerChange: (info: NonParentCarerInfo) => void;
}

export function CalculatorForm({
  incomeA,
  incomeB,
  childrenData,
  relDepA,
  relDepB,
  errors,
  incomePercA,
  incomePercB,
  csiA,
  csiB,
  selectedYear,
  onYearChange,
  onIncomeAChange,
  onIncomeBChange,
  onAddChild,
  onRemoveChild,
  onUpdateChild,
  onRelDepAChange,
  onRelDepBChange,
  onCalculate,
  onReset,
  isDesktopWeb = false,
  // Multi-case support (Formula 3)
  multiCaseA,
  multiCaseB,
  onMultiCaseAChange,
  onMultiCaseBChange,
  // Non-parent carer support (Formula 4)
  nonParentCarer,
  onNonParentCarerChange,
}: CalculatorFormProps) {
  const { isMobile, isDesktop } = useResponsive();
  const { colors } = useAppTheme();

  // Memoized dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    card: {
      backgroundColor: colors.cardBackground,
      borderColor: colors.cardBorder,
    },
    stepBadge: {
      backgroundColor: colors.primary,
    },
    stepBadgeText: {
      color: colors.textInverse,
    },
    sectionHeading: {
      color: colors.primaryDark,
    },
    parentTitleA: {
      color: colors.userHighlight,
    },
    parentTitleB: {
      color: colors.textSecondary,
    },
    label: {
      color: colors.textSecondary,
    },
    currencySymbol: {
      color: colors.textMuted,
    },
    currencyInput: {
      color: colors.inputText,
      borderColor: colors.inputBorder,
      backgroundColor: colors.inputBackground,
    },
    inputError: {
      borderColor: colors.errorBorder,
      backgroundColor: colors.errorLight,
    },
    errorText: {
      color: colors.error,
    },
    addChildButton: {
      borderColor: colors.primaryBorder,
      backgroundColor: colors.primaryLight,
    },
    addChildButtonText: {
      color: colors.buttonPrimary,
    },
    calculateButton: {
      backgroundColor: colors.buttonPrimary,
    },
    calculateButtonText: {
      color: colors.buttonPrimaryText,
    },
    resetButton: {
      backgroundColor: colors.buttonSecondary,
      borderColor: colors.buttonSecondaryBorder,
    },
    resetButtonText: {
      color: colors.buttonSecondaryText,
    },
  }), [colors]);

  // Web-specific container styles (only apply max-width when NOT in two-column mode)
  const webContainerStyle =
    isWeb && !isDesktopWeb
      ? {
        maxWidth: MAX_CONTENT_WIDTH,
        width: '100%' as const,
        alignSelf: 'center' as const,
      }
      : {};

  // Adjust bottom padding
  const contentPaddingBottom = isDesktopWeb ? 40 : 250;

  // Responsive input width
  const inputWidth = isMobile ? 160 : isDesktop ? 200 : 180;

  return (
    <View
      style={[
        styles.container,
        styles.contentContainer,
        { paddingBottom: contentPaddingBottom },
        webContainerStyle,
      ]}
    >
      {/* Combined Parents Card */}
      <View style={[styles.card, dynamicStyles.card]}>
        <View style={styles.sectionHeaderRow}>
          <View style={[styles.stepBadge, dynamicStyles.stepBadge]}>
            <Text style={[styles.stepBadgeText, dynamicStyles.stepBadgeText]}>1</Text>
          </View>
          {/* SEO: Semantic H2 Tag */}
          <Text
            style={[styles.sectionHeading, dynamicStyles.sectionHeading]}
            accessibilityRole="header"
            // @ts-ignore - Web-only prop
            aria-level="2"
          >
            INCOME
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
          {/* Year Selector with Tooltip */}
          <View style={styles.yearSelectorContainer}>
            <YearSelector value={selectedYear} onChange={onYearChange} />
            <HelpTooltip
              what="Select 2025 to check existing assessments or compare liability changes for the current period."
              why=""
              hideWhatLabel
            />
          </View>
        </View>

        {/* Parent A */}
        <View
          style={styles.inputGroup}
          accessibilityRole={'group' as any} // Web-only ARIA role
          accessibilityLabel="Parent A Income and Support Details"
        >
          <View style={[styles.labelRow, { gap: 8 }]}>
            <Text style={[styles.label, dynamicStyles.label]}>
              <Text style={[styles.parentTitleA, dynamicStyles.parentTitleA]}>Your Income</Text>
            </Text>
          </View>
          <View style={styles.inputRow}>
            <View
              style={[
                styles.currencyInputContainer,
                { width: inputWidth, minWidth: inputWidth },
              ]}
            >
              <Text style={[styles.currencySymbol, dynamicStyles.currencySymbol]}>$</Text>
              <TextInput
                style={[
                  styles.currencyInput,
                  dynamicStyles.currencyInput,
                  { width: inputWidth, minWidth: inputWidth },
                  errors.incomeA && dynamicStyles.inputError,
                  isWeb && webInputStyles,
                ]}
                value={incomeA ? incomeA.toString() : ''}
                onChangeText={(text) => {
                  const val = text.replace(/[^0-9]/g, '');
                  onIncomeAChange(parseInt(val) || 0);
                }}
                onFocus={(e) => {
                  // Select all text on focus so typing replaces the value
                  if (isWeb && e.target) {
                    const target = e.target as unknown as HTMLInputElement;
                    // Small timeout ensures selection persists after focus event settles
                    setTimeout(() => target.select?.(), 50);
                  }
                }}
                selectTextOnFocus={true}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.placeholder}
                accessibilityLabel="Parent A adjusted taxable income"
                accessibilityHint="Enter your annual gross income including super, fringe benefits, and investment losses"
              />
            </View>
          </View>
          {errors.incomeA && (
            <Text style={[styles.errorText, dynamicStyles.errorText]}>{errors.incomeA}</Text>
          )}
        </View>

        {/* Parent B */}
        <View
          style={[styles.inputGroup, { marginTop: 16 }]}
          accessibilityRole={'group' as any} // Web-only ARIA role
          accessibilityLabel="Parent B Income and Support Details"
        >
          <View style={styles.labelRow}>
            <Text style={[styles.label, dynamicStyles.label]}>
              <Text style={[styles.parentTitleB, dynamicStyles.parentTitleB]}>
                Other Parent&apos;s Income
              </Text>
            </Text>
          </View>
          <View style={styles.inputRow}>
            <View
              style={[
                styles.currencyInputContainer,
                { width: inputWidth, minWidth: inputWidth },
              ]}
            >
              <Text style={[styles.currencySymbol, dynamicStyles.currencySymbol]}>$</Text>
              <TextInput
                style={[
                  styles.currencyInput,
                  dynamicStyles.currencyInput,
                  { width: inputWidth, minWidth: inputWidth },
                  errors.incomeB && dynamicStyles.inputError,
                  isWeb && webInputStyles,
                ]}
                value={incomeB ? incomeB.toString() : ''}
                onChangeText={(text) => {
                  const val = text.replace(/[^0-9]/g, '');
                  onIncomeBChange(parseInt(val) || 0);
                }}
                onFocus={(e) => {
                  // Select all text on focus so typing replaces the value
                  if (isWeb && e.target) {
                    const target = e.target as unknown as HTMLInputElement;
                    // Small timeout ensures selection persists after focus event settles
                    setTimeout(() => target.select?.(), 50);
                  }
                }}
                selectTextOnFocus={true}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.placeholder}
                accessibilityLabel="Parent B adjusted taxable income"
                accessibilityHint="Enter the other parent's annual gross income including super, fringe benefits, and investment losses"
              />
            </View>
          </View>
          {errors.incomeB && (
            <Text style={[styles.errorText, dynamicStyles.errorText]}>{errors.incomeB}</Text>
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

        {/* Other Cases - Multi-case support (Formula 3) */}
        <View style={[styles.inputGroup, { marginTop: 12 }]}>
          <OtherCasesPopover
            multiCaseA={multiCaseA}
            multiCaseB={multiCaseB}
            onMultiCaseAChange={onMultiCaseAChange}
            onMultiCaseBChange={onMultiCaseBChange}
          />
        </View>

        {/* Non-Parent Carer (Formula 4) */}
        <NonParentCarerSection
          nonParentCarer={nonParentCarer}
          onNonParentCarerChange={onNonParentCarerChange}
        />
      </View>

      {/* Children Card */}
      <View style={[styles.card, dynamicStyles.card]}>
        <View style={styles.sectionHeaderRow}>
          <View style={[styles.stepBadge, dynamicStyles.stepBadge]}>
            <Text style={[styles.stepBadgeText, dynamicStyles.stepBadgeText]}>2</Text>
          </View>
          {/* SEO: Semantic H2 Tag */}
          <Text
            style={[styles.sectionHeading, dynamicStyles.sectionHeading]}
            accessibilityRole="header"
            // @ts-ignore - Web-only prop
            aria-level="2"
          >
            CARE
          </Text>
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
              showNPCInput={nonParentCarer.enabled}
            />
          ))}
        </View>

        {errors.children && (
          <Text style={[styles.errorText, dynamicStyles.errorText]}>{errors.children}</Text>
        )}

        <Pressable
          onPress={onAddChild}
          style={[styles.addChildButton, dynamicStyles.addChildButton, isWeb && webClickableStyles]}
          accessibilityRole="button"
          accessibilityLabel="Add another child to the calculation"
        >
          <Text style={[styles.addChildButtonText, dynamicStyles.addChildButtonText]}>+ Add Child</Text>
        </Pressable>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Pressable
          onPress={onCalculate}
          style={[styles.calculateButton, dynamicStyles.calculateButton, isWeb && webClickableStyles]}
          accessibilityRole="button"
          accessibilityLabel="Calculate child support"
        >
          <Text style={[styles.calculateButtonText, dynamicStyles.calculateButtonText]}>Calculate</Text>
        </Pressable>
        <Pressable
          onPress={onReset}
          style={[styles.resetButton, dynamicStyles.resetButton, isWeb && webClickableStyles]}
          accessibilityRole="button"
          accessibilityLabel="Reset form to default values"
        >
          <Text style={[styles.resetButtonText, dynamicStyles.resetButtonText]}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  contentContainer: {
    padding: 16,
    // paddingBottom is set dynamically based on isDesktopWeb
    gap: 16,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    // Colors set via dynamicStyles
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    zIndex: 1000,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  yearSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 'auto',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  parentsGrid: {
    flexDirection: 'row',
    gap: 24,
    flexWrap: 'wrap',
  },
  parentSection: {
    flex: 1,
    minWidth: 200,
    gap: 12,
  },
  parentTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  parentTitleA: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  parentTitleB: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputGroup: {
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'nowrap',
  },
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    flex: 0,
    flexShrink: 0,
    zIndex: 2,
  },
  currencySymbol: {
    position: 'absolute',
    left: 12,
    fontSize: 18,
    fontWeight: '500',
    zIndex: 1,
  },
  currencyInput: {
    paddingLeft: 32,
    paddingRight: 12,
    paddingVertical: 10,
    fontSize: 18,
    borderWidth: 1.5,
    borderRadius: 8,
  },
  inputError: {
    // Colors set via dynamicStyles
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  incomeBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  incomeBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  incomeBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  incomePercText: {
    fontSize: 14,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  csiText: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  smallSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  switchLabelSmall: {
    fontSize: 13,
    fontWeight: '500',
  },
  switchLabel: {
    fontSize: 14,
  },
  childrenList: {
    gap: 12,
  },
  addChildButton: {
    marginTop: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addChildButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  calculateButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
