import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { CalculationResults } from "../types/calculator";
import { isWeb, webClickableStyles } from "../utils/responsive";
import { detectZeroPaymentScenario, isFarLimitReached } from "../utils/zero-payment-detection";
import { HelpTooltip } from "./HelpTooltip";

interface ResultsSimpleExplanationProps {
  results: CalculationResults;
  formState: { supportA: boolean; supportB: boolean };
}

// Helper to format currency
const formatCurrency = (num: number): string => {
  return `$${Math.round(num).toLocaleString()}`;
};

// Helper to format percentage
const formatPercent = (num: number): string => {
  return `${Math.round(num)}%`;
};

// Minimal Color System - Professional Legal/Financial Calculator
const COLORS = {
  // Backgrounds
  bg: {
    primary: '#ffffff',      // Main background
    card: '#ffffff',         // Card backgrounds
    input: '#ffffff',        // Input fields
    subtle: '#f8f9fa',       // Subtle backgrounds for sections
  },

  // Borders
  border: {
    default: '#e2e8f0',      // Default borders
    focus: '#3b82f6',        // Focus state
    subtle: '#f1f5f9',       // Very subtle dividers
  },

  // Text
  text: {
    primary: '#1a202c',      // Main text, headings - near black
    secondary: '#4a5568',    // Subheadings, labels - dark grey
    tertiary: '#718096',     // Helper text - medium grey
    disabled: '#a0aec0',     // Disabled text - light grey
  },

  // Accent Colors - ONLY use where specified
  accent: {
    primary: '#3b82f6',      // Primary actions, links - blue
    warning: '#d97706',      // Warnings only - amber
    danger: '#dc2626',       // Errors, destructive actions - red
    success: '#059669',      // Success states - green
  },

  // Results Display
  result: {
    amount: '#1a202c',       // The dollar amount - highest contrast
    label: '#718096',        // "Parent B pays" label
    breakdown: '#4a5568',    // Monthly/fortnightly amounts
  },
};

export function ResultsSimpleExplanation({ results, formState }: ResultsSimpleExplanationProps) {
  // Collapsible state management
  const [expandedSteps, setExpandedSteps] = useState({
    step1: false,  // Income Percentages - collapsed
    step2: false,  // Care/Cost Percentage - collapsed
    step3: true,   // Child Support % - EXPANDED
    step4: false,  // Cost of Children - collapsed
    step5: true,   // Assessment Result - EXPANDED
    specialRate: false, // Special Rate notice - collapsed
  });

  // Urgent matters state
  const [urgentMattersChecked, setUrgentMattersChecked] = useState(false);

  // Calculate payment periods
  const monthlyAmount = results.finalPaymentAmount / 12;
  const fortnightlyAmount = results.finalPaymentAmount / 26;
  const dailyAmount = results.finalPaymentAmount / 365;

  // Determine who pays based on final liabilities (not gap calculation)
  const parentAPays = results.payer === "Parent A";
  const parentBPays = results.payer === "Parent B";

  return (
    <View style={styles.container}>
      {/* Urgent Matters Section - Above Step 1 */}
      {!urgentMattersChecked ? (
        <Pressable
          onPress={() => setUrgentMattersChecked(true)}
          style={[styles.urgentMattersCheckbox, webClickableStyles]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: false }}
          accessibilityLabel="I have an upcoming court date for child support matters"
        >
          <View style={styles.urgentMattersHeader}>
            <View style={styles.urgentIcon}>
              <Text style={styles.urgentIconText}>!</Text>
            </View>
            <Text style={styles.urgentMattersTitle}>Urgent Matters</Text>
          </View>
          <View style={styles.urgentCheckboxRow}>
            <View style={styles.checkbox} />
            <Text style={styles.urgentCheckboxLabel}>
              I have an upcoming court date for child support matters
            </Text>
            <View style={styles.helpIconPlaceholder}>
              <Text style={styles.helpIcon}>?</Text>
            </View>
          </View>
        </Pressable>
      ) : (
        <View style={styles.urgentLegalReviewCard}>
          <View style={styles.urgentMattersHeader}>
            <View style={styles.urgentIcon}>
              <Text style={styles.urgentIconText}>!</Text>
            </View>
            <Text style={styles.urgentMattersTitle}>Urgent Matters</Text>
          </View>
          <Text style={styles.urgentLegalReviewText}>
            Court dates require immediate legal preparation. A family lawyer can review your case, prepare documents, and represent you.
          </Text>
          <Pressable style={[styles.legalReviewButton, webClickableStyles]}>
            <Text style={styles.legalReviewButtonText}>Request Urgent Legal Review</Text>
          </Pressable>
          <Pressable 
            onPress={() => setUrgentMattersChecked(false)}
            style={[styles.undoButton, webClickableStyles]}
          >
            <Text style={styles.undoButtonText}>↶ Undo</Text>
          </Pressable>
        </View>
      )}

      {/* Step 1: Income Split */}
      <View style={styles.step}>
        <Pressable
          onPress={() => setExpandedSteps(prev => ({...prev, step1: !prev.step1}))}
          style={styles.stepHeader}
          accessibilityRole="button"
          accessibilityLabel={`Step 1: Income Percentages. ${expandedSteps.step1 ? 'Expanded' : 'Collapsed'}. Tap to ${expandedSteps.step1 ? 'collapse' : 'expand'}.`}
          accessibilityState={{ expanded: expandedSteps.step1 }}
        >
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepTitle}>INCOME PERCENTAGES</Text>
          <Text style={styles.chevron}>{expandedSteps.step1 ? '▼' : '▶'}</Text>
        </Pressable>

        {expandedSteps.step1 && (
          <>
            <Text style={styles.stepExplanation}>
          By deducting income to reflect the income required to support themselves as well as any children they may care for outside of Child Support.
        </Text>

        {/* Deduction breakdown for each parent */}
        <View style={styles.deductionCards}>
          {/* Parent A breakdown */}
          <View style={styles.deductionCard}>
            <Text style={styles.deductionCardTitle}>PARENT A</Text>
            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>Adjusted taxable income</Text>
              <Text style={styles.deductionValue}>{formatCurrency(results.ATI_A)}</Text>
            </View>
            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>Self-support amount</Text>
              <Text style={styles.deductionValueNegative}>({formatCurrency(results.SSA)})</Text>
            </View>
            {results.relDepDeductibleA > 0 && (
              <View style={styles.deductionRow}>
                <Text style={styles.deductionLabel}>Rel dep allowance</Text>
                <Text style={styles.deductionValueNegative}>({formatCurrency(results.relDepDeductibleA)})</Text>
              </View>
            )}
            <View style={styles.deductionDivider} />
            <View style={styles.deductionRow}>
              <Text style={styles.deductionTotalLabel}>Child Support Income</Text>
              <Text style={styles.deductionTotalValue}>{formatCurrency(Math.max(0, results.CSI_A))}</Text>
            </View>
          </View>

          {/* Parent B breakdown */}
          <View style={styles.deductionCard}>
            <Text style={styles.deductionCardTitle}>PARENT B</Text>
            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>Adjusted taxable income</Text>
              <Text style={styles.deductionValue}>{formatCurrency(results.ATI_B)}</Text>
            </View>
            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>Self-support amount</Text>
              <Text style={styles.deductionValueNegative}>({formatCurrency(results.SSA)})</Text>
            </View>
            {results.relDepDeductibleB > 0 && (
              <View style={styles.deductionRow}>
                <Text style={styles.deductionLabel}>Rel dep allowance</Text>
                <Text style={styles.deductionValueNegative}>({formatCurrency(results.relDepDeductibleB)})</Text>
              </View>
            )}
            <View style={styles.deductionDivider} />
            <View style={styles.deductionRow}>
              <Text style={styles.deductionTotalLabel}>Child Support Income</Text>
              <Text style={styles.deductionTotalValue}>{formatCurrency(Math.max(0, results.CSI_B))}</Text>
            </View>
          </View>
        </View>

         {/* Combined child support income - text without container */}
         <Text style={[styles.combinedCSIncomeLabel, { marginTop: 2, marginBottom: 8, fontSize: 14, textAlign: 'center' }]}>
           COMBINED CS INCOME - {formatCurrency(results.CCSI)}
         </Text>

         {/* Divider line */}
         <View style={{ height: 1, backgroundColor: '#334155', marginBottom: 12 }} />

        <Text style={styles.stepExplanation}>
          Each parent's CS income is then expressed as a percentage of the combined total.
        </Text>

        <View style={styles.incomeComparison}>
          <Text style={styles.careHeaderLabel}>
            <Text style={{ color: '#4a5568' }}>PARENT A</Text> - <Text style={{ color: '#4a5568' }}>{formatPercent(results.incomePercA)}</Text>
          </Text>

          {/* Visual bar */}
          <View style={styles.visualBar}>
            <View style={[styles.barSegmentA, { flex: results.incomePercA }]} />
            <View style={[styles.barSegmentB, { flex: results.incomePercB }]} />
          </View>

          <Text style={[styles.careHeaderLabel, { textAlign: 'right' }]}>
            <Text style={{ color: '#4a5568' }}>PARENT B</Text> - <Text style={{ color: '#4a5568' }}>{formatPercent(results.incomePercB)}</Text>
          </Text>
        </View>
          </>
        )}
      </View>

      {/* Step 2: Care Split - Per Child */}
      {results.childResults.map((child, index) => (
        <View key={index} style={styles.step}>
          <Pressable
            onPress={() => setExpandedSteps(prev => ({...prev, step2: !prev.step2}))}
            style={styles.stepHeader}
            accessibilityRole="button"
            accessibilityLabel={`Step 2${results.childResults.length > 1 ? String.fromCharCode(97 + index) : ''}: Care and Cost Percentages${results.childResults.length > 1 ? ` for Child ${index + 1}` : ''}. ${expandedSteps.step2 ? 'Expanded' : 'Collapsed'}. Tap to ${expandedSteps.step2 ? 'collapse' : 'expand'}.`}
            accessibilityState={{ expanded: expandedSteps.step2 }}
          >
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>
                2{results.childResults.length > 1 ? String.fromCharCode(97 + index) : ''}
              </Text>
            </View>
            <Text style={styles.stepTitle}>
              CARE/COST PERCENTAGES{results.childResults.length > 1 ? ` - CHILD ${index + 1}` : ''}
            </Text>
            <Text style={styles.chevron}>{expandedSteps.step2 ? '▼' : '▶'}</Text>
          </Pressable>

          {expandedSteps.step2 && (
            <>
              {index === 0 && (
            <Text style={[styles.stepExplanation, { lineHeight: 22 }]}>
              Each parent's nights of care for the child is converted to a <Text style={{ fontWeight: '600', color: '#3b82f6' }}>CARE PERCENTAGE</Text>
              <View style={{ transform: [{ scale: 0.85 }, { translateY: 3 }], marginLeft: 6 }}>
                <HelpTooltip
                  header="CARE ROUNDING RULES"
                  what="Special rules apply. Regardless of the decimal value, percentages below 50% are rounded down to the nearest whole number with ones above being always rounded up."
                  why=""
                  hideWhatLabel
                />
              </View>.
            </Text>
          )}

          <View style={styles.careComparison}>
            <Text style={styles.careHeaderLabel}>
              <Text style={{ color: '#4a5568' }}>PARENT A</Text> - <Text style={{ color: '#4a5568' }}>{formatPercent(child.roundedCareA)}</Text>
            </Text>

            {/* Visual bar for care */}
            <View style={styles.visualBar}>
              <View style={[styles.barSegmentA, { flex: child.roundedCareA }]} />
              <View style={[styles.barSegmentB, { flex: child.roundedCareB }]} />
            </View>

             <Text style={[styles.careHeaderLabel, { textAlign: 'right' }]}>
               <Text style={{ color: '#4a5568' }}>PARENT B</Text> - <Text style={{ color: '#4a5568' }}>{formatPercent(child.roundedCareB)}</Text>
             </Text>

            {index === 0 && (
              <>
                <View style={{ height: 1, backgroundColor: '#334155', marginVertical: 8 }} />

                <Text style={[styles.stepExplanation, { lineHeight: 22 }]}>
                  A formula is then used to convert each parent's care percentage into what is used in the child support formula to reflect the costs of a child the parent is meeting through their own care - this is called a <Text style={{ fontWeight: '600', color: '#3b82f6' }}>COST PERCENTAGE</Text>
                  <View style={{ transform: [{ scale: 0.85 }, { translateY: 3 }], marginLeft: 6 }}>
                    <HelpTooltip
                      header="CARE TO COST CONVERSION"
                      what={
                        <Text style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 20 }}>
                          0 to less than 14%: <Text style={{ color: '#3b82f6' }}>Nil</Text>{'\n\n'}
                          14% to less than 35%: <Text style={{ color: '#3b82f6' }}>24%</Text>{'\n\n'}
                          35% to less than 48%: <Text style={{ color: '#3b82f6' }}>25% plus 2% for each percentage point over 35%</Text>{'\n\n'}
                          48% to 52%: <Text style={{ color: '#3b82f6' }}>50%</Text>{'\n\n'}
                          More than 52% to 65%: <Text style={{ color: '#3b82f6' }}>51% plus 2% for each percentage point over 53%</Text>{'\n\n'}
                          More than 65% to 86%: <Text style={{ color: '#3b82f6' }}>76%</Text>{'\n\n'}
                          More than 86% to 100%: <Text style={{ color: '#3b82f6' }}>100%</Text>
                        </Text>
                      }
                      why=""
                      hideWhatLabel
                    />
                  </View>.
                </Text>
              </>
            )}

            {/* Divider line for additional children */}
            {index > 0 && (
              <View style={{ height: 1, backgroundColor: '#334155', marginTop: 16 }} />
            )}
          </View>

          {/* Care to Cost conversion */}
          <View style={[styles.careConversion, { marginTop: index === 0 ? 3 : 16, padding: 12 }]}>
            <View style={styles.conversionCards}>
              <View style={styles.conversionCard}>
                <Text style={[styles.conversionCardLabel, { fontSize: 12 }]}>PARENT A</Text>
                <View style={styles.conversionRow}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.conversionValue}>{formatPercent(child.roundedCareA)}</Text>
                    <Text style={styles.conversionSubLabel}>care</Text>
                  </View>
                  <Text style={styles.conversionArrow}>→</Text>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.conversionResult}>{formatPercent(child.costPercA)}</Text>
                    <Text style={styles.conversionSubLabel}>cost</Text>
                  </View>
                </View>
              </View>

              <View style={styles.conversionCard}>
                <Text style={[styles.conversionCardLabel, { fontSize: 12 }]}>PARENT B</Text>
                <View style={styles.conversionRow}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.conversionValue}>{formatPercent(child.roundedCareB)}</Text>
                    <Text style={styles.conversionSubLabel}>care</Text>
                  </View>
                  <Text style={styles.conversionArrow}>→</Text>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.conversionResult}>{formatPercent(child.costPercB)}</Text>
                    <Text style={styles.conversionSubLabel}>cost</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
            </>
          )}
        </View>
      ))}

      {/* Step 3: The Gap - Per Child */}
      {results.childResults.map((child, index) => (
        <View key={index} style={styles.step}>
          <Pressable
            onPress={() => setExpandedSteps(prev => ({...prev, step3: !prev.step3}))}
            style={styles.stepHeader}
            accessibilityRole="button"
            accessibilityLabel={`Step 3${results.childResults.length > 1 ? String.fromCharCode(97 + index) : ''}: Child Support Percentages${results.childResults.length > 1 ? ` for Child ${index + 1}` : ''}. ${expandedSteps.step3 ? 'Expanded' : 'Collapsed'}. Tap to ${expandedSteps.step3 ? 'collapse' : 'expand'}.`}
            accessibilityState={{ expanded: expandedSteps.step3 }}
          >
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>
                3{results.childResults.length > 1 ? String.fromCharCode(97 + index) : ''}
              </Text>
            </View>
            <Text style={styles.stepTitle}>
              CHILD SUPPORT PERCENTAGES{results.childResults.length > 1 ? ` - CHILD ${index + 1}` : ''}
            </Text>
            <Text style={styles.chevron}>{expandedSteps.step3 ? '▼' : '▶'}</Text>
          </Pressable>

          {expandedSteps.step3 && (
            <>
              {index === 0 && (
            <Text style={styles.stepExplanation}>
              A parent is liable to pay child support when their income percentage exceeds their cost percentage. The difference between these two values is the <Text style={{ fontWeight: '600', color: '#3b82f6' }}>CHILD SUPPORT PERCENTAGE</Text>, which is the formula then uses to help determine the liability amount for the child.
            </Text>
          )}

          <View style={styles.gapCalculation}>
            <View style={styles.gapCards}>
              {/* Parent A Card */}
              <View style={styles.gapCard}>
                <Text style={styles.gapCardTitle}>PARENT A</Text>

                {!child.farAppliedA && !child.marAppliedA ? (
                  <>
                    <View style={styles.gapCardRow}>
                      <Text style={styles.gapCardLabel}>Income %</Text>
                      <Text style={styles.gapCardValue}>{formatPercent(results.incomePercA)}</Text>
                    </View>
                    <View style={styles.gapCardRow}>
                      <Text style={styles.gapCardLabel}>Cost %</Text>
                      <Text style={[styles.gapCardValue, { color: '#dc2626' }]}>({formatPercent(child.costPercA)})</Text>
                    </View>
                    <View style={styles.gapCardDivider} />
                    <View style={styles.gapCardRow}>
                      <Text style={[styles.gapCardLabel, styles.gapCardLabelBold]}>CS %</Text>
                      <Text style={[
                        styles.gapCardValue,
                        child.childSupportPercA > 0 && !child.farAppliedB && !child.marAppliedB && styles.gapCardValueHighlight
                      ]}>
                        {(child.farAppliedB || child.marAppliedB) ? '—' : (child.childSupportPercA > 0 ? formatPercent(child.childSupportPercA) : '—')}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.gapCardSpecialRate}>
                    <Text style={styles.gapCardSpecialRateText}>
                      {child.farAppliedA ? 'Fixed annual rate to apply - see below for details' : 'Minimum annual rate applied'}
                    </Text>
                    <Text style={[styles.gapCardValue, styles.gapCardValueHighlight, { marginTop: 8 }]}>
                      {formatCurrency(child.farAppliedA ? results.FAR : results.MAR)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Parent B Card */}
              <View style={styles.gapCard}>
                <Text style={styles.gapCardTitle}>PARENT B</Text>

                {!child.farAppliedB && !child.marAppliedB ? (
                  <>
                    <View style={styles.gapCardRow}>
                      <Text style={styles.gapCardLabel}>Income %</Text>
                      <Text style={styles.gapCardValue}>{formatPercent(results.incomePercB)}</Text>
                    </View>
                    <View style={styles.gapCardRow}>
                      <Text style={styles.gapCardLabel}>Cost %</Text>
                      <Text style={[styles.gapCardValue, { color: '#dc2626' }]}>({formatPercent(child.costPercB)})</Text>
                    </View>
                    <View style={styles.gapCardDivider} />
                    <View style={styles.gapCardRow}>
                      <Text style={[styles.gapCardLabel, styles.gapCardLabelBold]}>CS %</Text>
                      <Text style={[
                        styles.gapCardValue,
                        child.childSupportPercB > 0 && !child.farAppliedA && !child.marAppliedA && styles.gapCardValueHighlight
                      ]}>
                        {(child.farAppliedA || child.marAppliedA) ? '—' : (child.childSupportPercB > 0 ? formatPercent(child.childSupportPercB) : '—')}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.gapCardSpecialRate}>
                    <Text style={styles.gapCardSpecialRateText}>
                      {child.farAppliedB ? 'Fixed annual rate to apply - see below for details' : 'Minimum annual rate applied'}
                    </Text>
                    <Text style={[styles.gapCardValue, styles.gapCardValueHighlight, { marginTop: 8 }]}>
                      {formatCurrency(child.farAppliedB ? results.FAR : results.MAR)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
            </>
          )}
        </View>
      ))}

      {/* Step 4: Total Costs */}
      <View style={styles.step}>
        <Pressable
          onPress={() => setExpandedSteps(prev => ({...prev, step4: !prev.step4}))}
          style={styles.stepHeader}
          accessibilityRole="button"
          accessibilityLabel={`Step 4: Cost of Children. ${expandedSteps.step4 ? 'Expanded' : 'Collapsed'}. Tap to ${expandedSteps.step4 ? 'collapse' : 'expand'}.`}
          accessibilityState={{ expanded: expandedSteps.step4 }}
        >
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <Text style={styles.stepTitle}>COST OF CHILDREN</Text>
          <Text style={styles.chevron}>{expandedSteps.step4 ? '▼' : '▶'}</Text>
        </Pressable>

        {expandedSteps.step4 && (
          <>
            <Text style={styles.stepExplanation}>
          The total cost of children for an assessment is calculated using income brackets set by the Department of Social Services. Each bracket has a base cost plus a percentage applied to income within that bracket.
        </Text>

        {/* Combined income */}
        <Text style={[styles.combinedCSIncomeLabel, { marginTop: 12, marginBottom: 12, fontSize: 14, textAlign: 'center' }]}>
          COMBINED CS INCOME - {formatCurrency(results.CCSI)}
        </Text>

        {/* Bracket calculation */}
        {results.costBracketInfo && (
          <View style={styles.bracketCalculation}>
            <Text style={styles.bracketTitle}>
              Your bracket: {formatCurrency(results.costBracketInfo.minIncome)} – {results.costBracketInfo.maxIncome ? formatCurrency(results.costBracketInfo.maxIncome) : "unlimited"}
            </Text>

            <View style={styles.bracketFormula}>
              <View style={styles.bracketRow}>
                <Text style={styles.bracketLabel}>Base amount</Text>
                <Text style={styles.bracketValue}>{formatCurrency(results.costBracketInfo.fixed)}</Text>
              </View>
              {results.costBracketInfo.rate > 0 && (
                <View style={styles.bracketRow}>
                  <Text style={styles.bracketLabel}>+ {Math.round(results.costBracketInfo.rate * 100)}% × {formatCurrency(results.costBracketInfo.incomeInBracket)}</Text>
                  <Text style={styles.bracketValue}>+{formatCurrency(results.costBracketInfo.rate * results.costBracketInfo.incomeInBracket)}</Text>
                </View>
              )}
              <View style={styles.bracketDivider} />
              <View style={styles.bracketRow}>
                <Text style={styles.bracketTotalLabel}>Annual child cost</Text>
                <Text style={styles.bracketTotalValue}>{formatCurrency(results.totalCost)}</Text>
              </View>
              {results.childResults.length > 0 && (
                <View style={styles.bracketRow}>
                  <Text style={styles.bracketLabel}>Cost per child ({results.childResults.length})</Text>
                  <Text style={styles.bracketValue}>{formatCurrency(results.totalCost / results.childResults.length)}</Text>
                </View>
              )}
            </View>
          </View>
        )}
          </>
        )}
      </View>

      {/* Step 5: Your Payment */}
      <View style={styles.step}>
        <Pressable
          onPress={() => setExpandedSteps(prev => ({...prev, step5: !prev.step5}))}
          style={styles.stepHeader}
          accessibilityRole="button"
          accessibilityLabel={`Step 5: Assessment Result. ${expandedSteps.step5 ? 'Expanded' : 'Collapsed'}. Tap to ${expandedSteps.step5 ? 'collapse' : 'expand'}.`}
          accessibilityState={{ expanded: expandedSteps.step5 }}
        >
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>5</Text>
          </View>
          <Text style={styles.stepTitle}>ASSESSMENT RESULT</Text>
          <Text style={styles.chevron}>{expandedSteps.step5 ? '▼' : '▶'}</Text>
        </Pressable>

        {expandedSteps.step5 && (
          <>
            <Text style={styles.stepExplanation}>
          Each child's liability rate is calculated by multiplying their child support percentage <Text style={{ color: '#3b82f6' }}>(</Text><Text style={{ fontWeight: '600', color: '#3b82f6' }}>STEP 3</Text><Text style={{ color: '#3b82f6' }}>)</Text> by their cost <Text style={{ color: '#3b82f6' }}>(</Text><Text style={{ fontWeight: '600', color: '#3b82f6' }}>STEP 4</Text><Text style={{ color: '#3b82f6' }}>)</Text>.
        </Text>

        {/* Per-child payment breakdown */}
        {results.childResults.length > 0 && (() => {
          // Check if MAR is applied to any child
          const hasMarA = results.childResults.some(c => c.marAppliedA);
          const hasMarB = results.childResults.some(c => c.marAppliedB);
          const hasAnyMar = hasMarA || hasMarB;

          // If MAR is applied, show a single consolidated line
          if (hasAnyMar) {
            const payingParentColor = hasMarA ? '#3b82f6' : '#8b5cf6';
            const totalMarAmount = results.finalPaymentAmount;

            return (
              <View style={styles.perChildGapBreakdown}>
                <View style={styles.perChildGapRow}>
                  <Text style={styles.perChildGapLabel}>
                    All children - <Text style={{ color: payingParentColor }}>Minimum annual rate</Text>
                  </Text>
                  <Text style={[styles.perChildGapValue, { color: payingParentColor }]}>
                    {formatCurrency(totalMarAmount)}
                  </Text>
                </View>
                <View style={styles.perChildGapDivider} />
              </View>
            );
          }

          // Otherwise, show per-child breakdown (original logic)
          return (
            <View style={styles.perChildGapBreakdown}>
              {results.childResults.map((child, index) => {
                // Determine which parent is paying for this child based on final liabilities
                // When FAR/MAR is applied, the liability will be non-zero for the paying parent
                const parentAOwesForChild = child.finalLiabilityA > 0;
                const parentBOwesForChild = child.finalLiabilityB > 0;

                // If neither parent owes, show "No payment" explanation
                if (!parentAOwesForChild && !parentBOwesForChild) {
                  // Check if this is due to FAR limit being reached
                  const isFarLimit = isFarLimitReached(index, results, formState);
                  const displayText = isFarLimit ? 'FAR limit reached' : 'No payment required';

                  return (
                    <View key={index} style={styles.perChildGapRow}>
                      <Text style={styles.perChildGapLabel}>
                        Child {index + 1} - <Text style={{ color: '#64748b' }}>{displayText}</Text>
                      </Text>
                      <Text style={[styles.perChildGapValue, { color: '#64748b' }]}>
                        $0
                      </Text>
                    </View>
                  );
                }

                // Determine color and values based on who actually pays (use final liability as source of truth)
                const showForParentA = parentAOwesForChild;
                const payingParentColor = showForParentA ? '#3b82f6' : '#8b5cf6';
                const farApplied = showForParentA ? child.farAppliedA : child.farAppliedB;
                const gapPercentage = showForParentA
                  ? Math.max(0, child.childSupportPercA)
                  : Math.max(0, child.childSupportPercB);
                const liability = showForParentA ? child.finalLiabilityA : child.finalLiabilityB;

                return (
                  <View key={index} style={styles.perChildGapRow}>
                    <Text style={styles.perChildGapLabel}>
                      {farApplied ? (
                        <>Child {index + 1} - <Text style={{ color: payingParentColor }}>Fixed annual rate</Text></>
                      ) : (
                        <>
                          Child {index + 1} - <Text style={{ color: payingParentColor }}>({formatPercent(gapPercentage)})</Text> × {formatCurrency(child.costPerChild)}
                        </>
                      )}
                    </Text>
                    <Text style={[styles.perChildGapValue, { color: payingParentColor }]}>
                      {formatCurrency(liability)}
                    </Text>
                  </View>
                );
              })}
              <View style={styles.perChildGapDivider} />

              {/* Total Annual Liability */}
              <View style={styles.perChildGapRow}>
                <Text style={[styles.perChildGapLabel, { fontWeight: '700' }]}>
                  Total Annual Liability
                </Text>
                <Text style={[styles.perChildGapValue, { fontWeight: '700', fontSize: 18 }]}>
                  {formatCurrency(results.finalPaymentAmount)}
                </Text>
              </View>
            </View>
          );
        })()}

        {/* No payment explanation - shown when any child has no payment */}
        {results.childResults.some(child => child.finalLiabilityA === 0 && child.finalLiabilityB === 0) && (() => {
          const scenario = detectZeroPaymentScenario(results, formState);

          if (scenario.type === 'none') return null;

          return (
            <View style={[styles.specialNotice, { borderLeftColor: '#64748b' }]}>
              <Text style={[styles.specialNoticeTitle, { color: '#94a3b8' }]}>
                ℹ️ {scenario.title}
              </Text>
              <View style={styles.specialNoticeContent}>
                <Text style={styles.specialNoticeText}>
                  {scenario.explanation}
                </Text>
                {scenario.details?.parentADetails && (
                  <Text style={[styles.specialNoticeText, { marginTop: 8 }]}>
                    • Parent A: {scenario.details.parentADetails}
                  </Text>
                )}
                {scenario.details?.parentBDetails && (
                  <Text style={[styles.specialNoticeText, { marginTop: 4 }]}>
                    • Parent B: {scenario.details.parentBDetails}
                  </Text>
                )}
              </View>
            </View>
          );
        })()}

        {/* Optional: Special rates notice */}
        {results.rateApplied !== "None" && (
          <View style={styles.specialNotice}>
            <Pressable
              onPress={() => setExpandedSteps(prev => ({...prev, specialRate: !prev.specialRate}))}
              style={styles.specialNoticeHeader}
              accessibilityRole="button"
              accessibilityLabel={`${results.rateApplied.includes("FAR") ? "What is the Fixed Annual Rate?" : "What is the Minimum Annual Rate?"} ${expandedSteps.specialRate ? 'Expanded' : 'Collapsed'}. Tap to ${expandedSteps.specialRate ? 'collapse' : 'expand'}.`}
              accessibilityState={{ expanded: expandedSteps.specialRate }}
            >
              <Text style={styles.specialNoticeTitle}>
                {results.rateApplied.includes("FAR") ? "What is the Fixed Annual Rate?" : "What is the Minimum Annual Rate?"}
              </Text>
              <Text style={styles.specialNoticeChevron}>{expandedSteps.specialRate ? '▼' : '▶'}</Text>
            </Pressable>

            {expandedSteps.specialRate && (
              <View style={styles.specialNoticeContent}>
                {results.rateApplied.includes("FAR") ? (
                  <>
                    <Text style={styles.specialNoticeText}>
                      The FAR is for low-income parents whose income doesn't reflect their capacity to pay. It is a way to prevent parents from reducing their payments by minimising their income. It is a rate paid per child (maximum 3) and requires three eligibility criteria be met:
                    </Text>
                    <Text style={styles.specialNoticeText}>
                      {'\n'}1. The parent must have less than 35% care of the child.
                      {'\n\n'}2. The income used in the assessment must be less than the pension Parenting Payment (single) maximum basic amount.
                      {'\n\n'}3. The parent did not receive an income support payment in the ATI.
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.specialNoticeText}>
                      The MAR is paid per case (up to a maximum of three cases) and is put in place for low income parents who wouldn't be able to afford a higher amount. It requires three eligibility criteria be met:
                    </Text>
                    <Text style={styles.specialNoticeText}>
                      {'\n'}1. The parent must have received an income support payment in their ATI.
                      {'\n\n'}2. The parent has less than 14% care of all children.
                      {'\n\n'}3. The parent's ATI must be below the self-support amount.
                    </Text>
                  </>
                )}
              </View>
            )}
          </View>
        )}
          </>
        )}
      </View>

      {/* Notice for $0 payment when low income but has care */}
      {results.finalPaymentAmount === 0 && results.rateApplied === "None" && (() => {
        // Calculate average care for the notice messages
        const avgCareA = results.childResults.length > 0
          ? results.childResults.reduce((sum, child) => sum + child.roundedCareA, 0) / results.childResults.length
          : 0;
        const avgCareB = results.childResults.length > 0
          ? results.childResults.reduce((sum, child) => sum + child.roundedCareB, 0) / results.childResults.length
          : 0;

        return (
          <>
            {results.ATI_A < results.SSA && avgCareA >= 14 && (
              <View style={styles.specialNotice}>
                <Text style={styles.specialNoticeTitle}>ℹ️ No Payment Required</Text>
                <Text style={styles.specialNoticeText}>
                  Parent A's income ({formatCurrency(results.ATI_A)}) is below the self-support amount ({formatCurrency(results.SSA)}), so they have no income-based obligation. Their care time ({formatPercent(avgCareA)}) means they're already contributing by covering costs directly during care.
                </Text>
              </View>
            )}
            {results.ATI_B < results.SSA && avgCareB >= 14 && (
              <View style={styles.specialNotice}>
                <Text style={styles.specialNoticeTitle}>ℹ️ No Payment Required</Text>
                <Text style={styles.specialNoticeText}>
                  Parent B's income ({formatCurrency(results.ATI_B)}) is below the self-support amount ({formatCurrency(results.SSA)}), so they have no income-based obligation. Their care time ({formatPercent(avgCareB)}) means they're already contributing by covering costs directly during care.
                </Text>
              </View>
            )}
          </>
        );
      })()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  titleSection: {
    marginBottom: 8,
  },
  titleLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b", // slate-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0f172a", // slate-900
    lineHeight: 28,
  },
  
  // Step container
  step: {
    backgroundColor: "#ffffff", // white background
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200 - subtle border
    ...(isWeb ? {
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
    } : {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    }),
  } as any,
  keyInsightStep: {
    backgroundColor: "#f0f9ff", // blue-50 - very light blue tint
    borderColor: "#3b82f6", // blue-500
    borderWidth: 2,
  },
  finalStep: {
    backgroundColor: "#eff6ff", // blue-50
    borderColor: "#2563eb", // blue-600
    borderWidth: 2,
  },
  
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3b82f6", // accent.primary
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  keyStepNumber: {
    backgroundColor: "#3b82f6", // accent.primary
    borderColor: "#3b82f6",
  },
  finalStepNumber: {
    backgroundColor: "#3b82f6", // accent.primary
    borderColor: "#3b82f6",
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff", // white text on blue background
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1a202c", // text.primary - near black
    flex: 1,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chevron: {
    fontSize: 16,
    color: "#9ca3af", // gray-400
    marginLeft: "auto",
  },
  keyBadge: {
    backgroundColor: "#fbbf24", // amber-400
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  keyBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#000000",
  },
  stepExplanation: {
    fontSize: 14,
    color: "#475569", // slate-600 - readable gray
    lineHeight: 20,
    marginBottom: 12,
  },
  stepConclusion: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb", // gray-200
  },
  conclusionText: {
    fontSize: 14,
    color: "#64748b", // slate-500
    lineHeight: 20,
  },
  highlightText: {
    color: "#2563eb", // blue-600 - strong blue for emphasis
    fontWeight: "600",
  },

  // Deduction breakdown cards
  deductionCards: {
    gap: 10,
    marginBottom: 16,
  },
  deductionCard: {
    backgroundColor: "#f9fafb", // gray-50
    borderRadius: 8,
    padding: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
  },
  deductionCardTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4a5568", // text.secondary
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  deductionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deductionLabel: {
    fontSize: 13,
    color: "#64748b", // slate-500
  },
  deductionValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#0f172a", // slate-900 - dark for readability
  },
  deductionValueNegative: {
    fontSize: 13,
    fontWeight: "500",
    color: "#dc2626", // red-600
  },
  deductionDivider: {
    height: 1,
    backgroundColor: "#e5e7eb", // gray-200
    marginVertical: 4,
  },
  deductionTotalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a", // slate-900
  },
  deductionTotalValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3b82f6", // accent.primary - important calculated value
  },

  // Combined CS Income bar
  combinedCSIncomeBar: {
    height: 32,
    borderRadius: 6,
    backgroundColor: "#e0f2fe", // sky-100 - light blue
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#7dd3fc", // sky-300
  },
  combinedCSIncomeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0369a1", // sky-700 - dark for contrast
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // Income split summary
  incomeSplitSummary: {
    marginBottom: 8,
  },
  incomeSplitTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b", // slate-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Income comparison
  incomeComparison: {
    gap: 10,
  },
  incomeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  incomeLabel: {
    fontSize: 14,
    color: "#475569", // slate-600
    flex: 1,
  },
  incomeValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a", // slate-900
    minWidth: 80,
    textAlign: "right",
  },
  percentBadge: {
    backgroundColor: "#e0f2fe", // sky-100
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 56,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7dd3fc", // sky-300
  },
  percentBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0369a1", // sky-700
  },

  // Visual bar
  visualBar: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#e5e7eb", // gray-200 - unfilled portion
  },
  barSegmentA: {
    backgroundColor: "#3b82f6", // blue - Parent A portion
  },
  barSegmentB: {
    backgroundColor: "#e5e7eb", // light grey - Parent B portion (two-tone visualization)
  },

  // Care comparison
  careComparison: {
    gap: 10,
  },
  careHeaderLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569", // slate-600
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  careRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  careLabel: {
    fontSize: 14,
    color: "#64748b", // slate-500
    flex: 1,
  },
  carePercent: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a", // slate-900
    minWidth: 60,
    textAlign: "right",
  },
  careSubtext: {
    fontSize: 12,
    color: "#6b7280", // gray-500
    minWidth: 72,
  },

  // Care to Cost conversion
  careConversion: {
    marginTop: 8,
    backgroundColor: "#f9fafb", // gray-50
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
  },
  careConversionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569", // slate-600
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  careConversionExplanation: {
    fontSize: 12,
    color: "#64748b", // slate-500
    marginBottom: 12,
    lineHeight: 16,
  },
  conversionCards: {
    flexDirection: "row",
    gap: 10,
  },
  conversionCard: {
    flex: 1,
    backgroundColor: "#ffffff", // white
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
  },
  conversionCardLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4a5568", // text.secondary
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  conversionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  conversionValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151", // gray-700
  },
  conversionArrow: {
    fontSize: 14,
    color: "#9ca3af", // gray-400
  },
  conversionResult: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3b82f6", // accent.primary - important calculated value
  },
  conversionLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  conversionSubLabel: {
    fontSize: 9,
    color: "#6b7280", // gray-500
    textTransform: "uppercase",
  },

  // Gap calculation (THE KEY INSIGHT)
  gapCalculation: {
    backgroundColor: "#f9fafb", // gray-50
    borderRadius: 8,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
  },
  // Step 3: Gap calculation cards (side-by-side)
  gapCards: {
    flexDirection: "row",
    gap: 10,
  },
  gapCard: {
    flex: 1,
    backgroundColor: "#f9fafb", // gray-50
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
  },
  gapCardTitle: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
    color: "#4a5568", // text.secondary
  },
  gapCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  gapCardLabel: {
    fontSize: 12,
    color: "#64748b", // slate-500
    flex: 1,
    paddingRight: 4,
  },
  gapCardLabelBold: {
    fontWeight: "600",
    color: "#0f172a", // slate-900
  },
  gapCardValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151", // gray-700
    textAlign: "right",
  },
  gapCardValueHighlight: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3b82f6", // accent.primary - important CS %
  },
  gapCardDivider: {
    height: 1,
    backgroundColor: "#e5e7eb", // gray-200
    marginVertical: 6,
  },
  gapCardSpecialRate: {
    gap: 4,
  },
  gapCardSpecialRateText: {
    fontSize: 11,
    color: "#6b7280", // gray-500
    lineHeight: 15,
  },

  // Cost input row
  costInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  costInputLabel: {
    fontSize: 13,
    color: "#64748b", // slate-500
  },
  costInputValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a", // slate-900
  },

  // Bracket calculation
  bracketCalculation: {
    backgroundColor: "#f9fafb", // gray-50
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
  },
  bracketTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569", // slate-600
    marginBottom: 12,
  },
  bracketFormula: {
    gap: 8,
  },
  bracketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bracketLabel: {
    fontSize: 13,
    color: "#64748b", // slate-500
  },
  bracketValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1a202c", // text.primary
  },
  bracketDivider: {
    height: 1,
    backgroundColor: "#e5e7eb", // gray-200
    marginVertical: 4,
  },
  bracketTotalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a", // slate-900
  },
  bracketTotalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3b82f6", // accent.primary - important value
  },

  // Total cost box (legacy - keeping for reference)
  totalCostBox: {
    backgroundColor: "#f9fafb", // gray-50
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
  },
  totalCostLabel: {
    fontSize: 12,
    color: "#64748b", // slate-500
    marginBottom: 4,
  },
  totalCostValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a", // slate-900
  },

  // Per-child cost breakdown
  perChildCostBreakdown: {
    backgroundColor: "#f9fafb", // gray-50
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
  },
  perChildCostTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569", // slate-600
    marginBottom: 4,
  },
  perChildCostRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  perChildCostLabel: {
    fontSize: 13,
    color: "#64748b", // slate-500
  },
  perChildCostValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151", // gray-700
  },

  // Per-child gap breakdown
  perChildGapBreakdown: {
    backgroundColor: "#f9fafb", // gray-50
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
  },
  perChildGapRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  perChildGapLabel: {
    fontSize: 13,
    color: "#64748b", // slate-500
  },
  perChildGapValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151", // gray-700
  },
  perChildGapDivider: {
    height: 1,
    backgroundColor: "#e5e7eb", // gray-200
    marginTop: 4,
  },

  // Final calculation
  finalCalculation: {
    gap: 12,
  },
  finalRow: {
    alignItems: "center",
  },
  finalLabel: {
    fontSize: 16,
    color: "#475569", // slate-600
    fontWeight: "500",
  },
  finalResultGradient: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "#ffffff", // white background
    borderWidth: 2,
    borderColor: "#e5e7eb", // gray-200
    ...(isWeb ? {
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    } : {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    }),
  } as any,
  finalResultLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475569", // slate-600
    marginBottom: 8,
    textAlign: "center",
  },
  finalResultValue: {
    fontSize: 40,
    fontWeight: "700",
    color: "#f59e0b", // amber-500 - keep the accent
    textAlign: "center",
    marginBottom: 4,
  },
  finalResultPeriod: {
    fontSize: 16,
    color: "#64748b", // slate-500
    textAlign: "center",
    marginBottom: 16,
  },
  expandedSecondaryAmounts: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    gap: 16,
  },
  expandedSecondaryItem: {
    alignItems: "center",
    flex: 1,
  },
  expandedSecondaryValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f59e0b", // amber-500
    marginBottom: 4,
  },
  expandedSecondaryLabel: {
    fontSize: 12,
    color: "#e2e8f0", // slate-200 - lighter for visibility on blue background
  },
  expandedDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#e5e7eb", // gray-200
  },

  // Special notice
  specialNotice: {
    backgroundColor: "#f0f9ff", // blue-50
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#0ea5e9", // sky-500
    borderWidth: 1,
    borderColor: "#bae6fd", // sky-200
  },
  specialNoticeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  specialNoticeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0369a1", // sky-700
    flex: 1,
  },
  specialNoticeChevron: {
    fontSize: 14,
    color: "#64748b", // slate-500
    marginLeft: 8,
  },
  specialNoticeContent: {
    marginTop: 12,
  },
  specialNoticeText: {
    fontSize: 13,
    color: "#475569", // slate-600
    lineHeight: 18,
  },

  // Urgent Matters Section
  urgentMattersCheckbox: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#fbbf24", // amber-400
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  urgentMattersHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  urgentIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ef4444", // red-500
    alignItems: "center",
    justifyContent: "center",
  },
  urgentIconText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  urgentMattersTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dc2626", // red-600
  },
  urgentCheckboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#d1d5db", // grey-300
    backgroundColor: "#ffffff",
  },
  urgentCheckboxLabel: {
    flex: 1,
    fontSize: 14,
    color: "#1a202c",
    lineHeight: 20,
  },
  helpIconPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#f3f4f6", // grey-100
    alignItems: "center",
    justifyContent: "center",
  },
  helpIcon: {
    fontSize: 12,
    color: "#6b7280", // grey-500
    fontWeight: "600",
  },
  
  // Urgent Legal Review Card
  urgentLegalReviewCard: {
    backgroundColor: "#fef2f2", // red-50
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ef4444", // red-500
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  urgentLegalReviewText: {
    fontSize: 14,
    color: "#4b5563", // grey-600
    lineHeight: 21,
    marginBottom: 16,
  },
  legalReviewButton: {
    backgroundColor: "#ef4444", // red-500
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legalReviewButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  undoButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  undoButtonText: {
    fontSize: 14,
    color: "#6b7280", // grey-500
    fontWeight: "500",
  },
});
