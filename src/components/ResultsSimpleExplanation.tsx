import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { CalculationResults } from "../types/calculator";
import { formatCurrency } from "../utils/formatters";
import { createShadow } from "../utils/shadow-styles";
import { detectZeroPaymentScenario, isFarLimitReached } from "../utils/zero-payment-detection";
import { BreakdownStepCard } from "./BreakdownStepCard";

interface ResultsSimpleExplanationProps {
  results: CalculationResults;
  formState: { supportA: boolean; supportB: boolean };
}

// Helper to format percentage (currently unused but kept for future use)
// const formatPercent = (num: number): string => {
//   return `${Math.round(num)}%`;
// };

// Helper to format percentage with 2 decimal places
const formatPercent2dp = (num: number): string => {
  return `${num.toFixed(2)}%`;
};

// Helper to format currency with 2 decimal places
const formatCurrency2dp = (num: number): string => {
  return `$${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

// Minimal Color System - Professional Legal/Financial Calculator (currently unused)
// const COLORS = {
//   // Backgrounds
//   bg: {
//     primary: '#ffffff',      // Main background
//     card: '#ffffff',         // Card backgrounds
//     input: '#ffffff',        // Input fields
//     subtle: '#f8f9fa',       // Subtle backgrounds for sections
//   },

//   // Borders
//   border: {
//     default: '#e2e8f0',      // Default borders
//     focus: '#3b82f6',        // Focus state
//     subtle: '#f1f5f9',       // Very subtle dividers
//   },
//
//   // Text
//   text: {
//     primary: '#1a202c',      // Main text, headings - near black
//     secondary: '#4a5568',    // Subheadings, labels - dark grey
//     tertiary: '#718096',     // Helper text - medium grey
//     disabled: '#a0aec0',     // Disabled text - light grey
//   },
//
//   // Accent Colors - ONLY use where specified
//   accent: {
//     primary: '#3b82f6',      // Primary actions, links - blue
//     warning: '#d97706',      // Warnings only - amber
//     danger: '#dc2626',       // Errors, destructive actions - red
//     success: '#059669',      // Success states - green
//   },
//
//   // Results Display
//   result: {
//     amount: '#1a202c',       // The dollar amount - highest contrast
//     label: '#718096',        // "Parent B pays" label
//     breakdown: '#4a5568',    // Monthly/fortnightly amounts
//   },
// };

export function ResultsSimpleExplanation({ results, formState }: ResultsSimpleExplanationProps) {
  // Collapsible state management - 8-Step Formula
  const [expandedSteps, setExpandedSteps] = useState({
    step1: false,  // Child Support Income - collapsed
    step2: false,  // Combined Income - collapsed
    step3: false,  // Income Percentage - collapsed
    step4: false,  // Care Percentage - collapsed
    step5: false,  // Cost Percentage - collapsed
    step6: false,  // Child Support Percentage - collapsed
    step7: false,  // Cost of Children - collapsed
    step8: false,  // Annual Rate - collapsed
    specialRate: false, // Special Rate notice - collapsed
  });

  // Calculate payment periods (currently unused but kept for potential display)
  // const monthlyAmount = results.finalPaymentAmount / 12;
  // const fortnightlyAmount = results.finalPaymentAmount / 26;
  const dailyAmount = results.finalPaymentAmount / 365;

  // Determine who pays based on final liabilities (not gap calculation)
  const parentAPays = results.payer === "Parent A";
  const parentBPays = results.payer === "Parent B";

  return (
    <View style={styles.container}>
      {/* Step 1: Child Support Income */}
      <BreakdownStepCard
        stepNumber={1}
        title="CHILD SUPPORT INCOME"
        isExpanded={expandedSteps.step1}
        onToggle={() => setExpandedSteps(prev => ({...prev, step1: !prev.step1}))}
      >
        <>
          <Text style={styles.stepExplanation}>
            Child support income is a parent&apos;s income after deducting an amount for their own living costs and for any other children they support outside the child support case.
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
        </>
      </BreakdownStepCard>

      {/* Step 2: Combined Income */}
      <BreakdownStepCard
        stepNumber={2}
        title="COMBINED CHILD SUPPORT INCOME"
        isExpanded={expandedSteps.step2}
        onToggle={() => setExpandedSteps(prev => ({...prev, step2: !prev.step2}))}
      >
        <>
          <Text style={styles.stepExplanation}>
            The combined child support income is the total of both parents&apos; child support incomes. This combined figure is used to calculate each parent&apos;s income percentage and to determine the cost of the children.
          </Text>

          <View style={styles.combinedIncomeCalculation}>
            <View style={styles.combinedIncomeRow}>
              <Text style={styles.combinedIncomeLabel}>Parent A CS Income</Text>
              <Text style={styles.combinedIncomeValue}>{formatCurrency(Math.max(0, results.CSI_A))}</Text>
            </View>
            <View style={styles.combinedIncomeRow}>
              <Text style={styles.combinedIncomeLabel}>Parent B CS Income</Text>
              <Text style={styles.combinedIncomeValue}>{formatCurrency(Math.max(0, results.CSI_B))}</Text>
            </View>
            <View style={styles.combinedIncomeDivider} />
            <View style={styles.combinedIncomeRow}>
              <Text style={styles.combinedIncomeTotalLabel}>Combined CS Income</Text>
              <Text style={styles.combinedIncomeTotalValue}>{formatCurrency(results.CCSI)}</Text>
            </View>
          </View>
        </>
      </BreakdownStepCard>

      {/* Step 3: Income Percentage */}
      <BreakdownStepCard
        stepNumber={3}
        title="INCOME PERCENTAGE"
        isExpanded={expandedSteps.step3}
        onToggle={() => setExpandedSteps(prev => ({...prev, step3: !prev.step3}))}
      >
        <>
          <Text style={styles.stepExplanation}>
            Each parent&apos;s child support income is shown as a percentage of the combined total. This percentage represents each parent&apos;s share of the total income available for child support.
          </Text>

          <View style={styles.incomePercentageCalculation}>
            <View style={styles.incomePercentageCard}>
              <Text style={styles.incomePercentageCardTitle}>PARENT A</Text>
              <Text style={styles.incomePercentageFormula}>
                {formatCurrency(Math.max(0, results.CSI_A))} ÷ {formatCurrency(results.CCSI)} = {formatPercent2dp(results.incomePercA)}
              </Text>
            </View>
            <View style={styles.incomePercentageCard}>
              <Text style={styles.incomePercentageCardTitle}>PARENT B</Text>
              <Text style={styles.incomePercentageFormula}>
                {formatCurrency(Math.max(0, results.CSI_B))} ÷ {formatCurrency(results.CCSI)} = {formatPercent2dp(results.incomePercB)}
              </Text>
            </View>
          </View>

          <View style={styles.incomeComparison}>
            <Text style={styles.careHeaderLabel}>
              <Text style={{ color: '#4a5568' }}>PARENT A</Text> - <Text style={{ color: '#4a5568' }}>{formatPercent2dp(results.incomePercA)}</Text>
            </Text>

            {/* Visual bar */}
            <View style={styles.visualBar}>
              <View style={[styles.barSegmentA, { flex: results.incomePercA }]} />
              <View style={[styles.barSegmentB, { flex: results.incomePercB }]} />
            </View>

            <Text style={[styles.careHeaderLabel, { textAlign: 'right' }]}>
              <Text style={{ color: '#4a5568' }}>PARENT B</Text> - <Text style={{ color: '#4a5568' }}>{formatPercent2dp(results.incomePercB)}</Text>
            </Text>
          </View>
        </>
      </BreakdownStepCard>

      {/* Step 4: Care Percentage - Per Child */}
      {results.childResults.map((child, index) => (
        <BreakdownStepCard
          key={index}
          stepNumber={`4${results.childResults.length > 1 ? String.fromCharCode(97 + index) : ''}`}
          title={`CARE PERCENTAGE${results.childResults.length > 1 ? ` - CHILD ${index + 1}` : ''}`}
          description={results.childResults.length > 1 ? `for Child ${index + 1}` : undefined}
          tooltip="Special rounding rules apply. Regardless of the decimal value, percentages below 50% are rounded down to the nearest whole number with ones above being always rounded up."
          isExpanded={expandedSteps.step4}
          onToggle={() => setExpandedSteps(prev => ({...prev, step4: !prev.step4}))}
        >
          <>
            {index === 0 && (
              <Text style={[styles.stepExplanation, { lineHeight: 22 }]}>
                The number of nights each parent cares for the child over a year is converted into a care percentage.
              </Text>
            )}

            <View style={styles.careComparison}>
              <Text style={styles.careHeaderLabel}>
                <Text style={{ color: '#4a5568' }}>PARENT A</Text> - <Text style={{ color: '#4a5568' }}>{formatPercent2dp(child.roundedCareA)}</Text>
              </Text>

              {/* Visual bar for care */}
              <View style={styles.visualBar}>
                <View style={[styles.barSegmentA, { flex: child.roundedCareA }]} />
                <View style={[styles.barSegmentB, { flex: child.roundedCareB }]} />
              </View>

              <Text style={[styles.careHeaderLabel, { textAlign: 'right' }]}>
                <Text style={{ color: '#4a5568' }}>PARENT B</Text> - <Text style={{ color: '#4a5568' }}>{formatPercent2dp(child.roundedCareB)}</Text>
              </Text>

              {/* Divider line for additional children */}
              {index > 0 && (
                <View style={{ height: 1, backgroundColor: '#334155', marginTop: 16 }} />
              )}
            </View>
          </>
        </BreakdownStepCard>
      ))}

      {/* Step 5: Cost Percentage - Per Child */}
      {results.childResults.map((child, index) => (
        <BreakdownStepCard
          key={index}
          stepNumber={`5${results.childResults.length > 1 ? String.fromCharCode(97 + index) : ''}`}
          title={`COST PERCENTAGE${results.childResults.length > 1 ? ` - CHILD ${index + 1}` : ''}`}
          description={results.childResults.length > 1 ? `for Child ${index + 1}` : undefined}
          tooltip={
            <View style={{ paddingVertical: 8 }}>
              <Text style={{ color: '#1a202c', fontSize: 13, fontWeight: '600', marginBottom: 12, textAlign: 'center' }}>
                Care Percentage → Cost Percentage
              </Text>

              <View style={{ gap: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#334155' }}>
                  <Text style={{ color: '#1a202c', fontSize: 13, flex: 1 }}>0% - 13%</Text>
                  <Text style={{ color: '#3b82f6', fontSize: 13, fontWeight: '600', flex: 1, textAlign: 'right' }}>Nil</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#334155' }}>
                  <Text style={{ color: '#1a202c', fontSize: 13, flex: 1 }}>14% - 34%</Text>
                  <Text style={{ color: '#3b82f6', fontSize: 13, fontWeight: '600', flex: 1, textAlign: 'right' }}>24%</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#334155' }}>
                  <Text style={{ color: '#1a202c', fontSize: 13, flex: 1 }}>35% - 47%</Text>
                  <Text style={{ color: '#3b82f6', fontSize: 13, fontWeight: '600', flex: 1, textAlign: 'right' }}>25% + 2% per point over 35%</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#334155' }}>
                  <Text style={{ color: '#1a202c', fontSize: 13, flex: 1 }}>48% - 52%</Text>
                  <Text style={{ color: '#3b82f6', fontSize: 13, fontWeight: '600', flex: 1, textAlign: 'right' }}>50%</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#334155' }}>
                  <Text style={{ color: '#1a202c', fontSize: 13, flex: 1 }}>53% - 65%</Text>
                  <Text style={{ color: '#3b82f6', fontSize: 13, fontWeight: '600', flex: 1, textAlign: 'right' }}>51% + 2% per point over 53%</Text>
                </View>
              </View>
            </View>
          }
          isExpanded={expandedSteps.step5}
          onToggle={() => setExpandedSteps(prev => ({...prev, step5: !prev.step5}))}
        >
          <>
            {index === 0 && (
              <Text style={[styles.stepExplanation, { lineHeight: 22 }]}>
                The care percentage is converted via a formula into a cost percentage. This figure reflects the share of the child's living costs that the parent covers directly while providing care.
              </Text>
            )}

            {/* Care to Cost conversion */}
            <View style={[styles.careConversion, { marginTop: index === 0 ? 12 : 16, padding: 12 }]}>
              <View style={styles.conversionCards}>
                <View style={styles.conversionCard}>
                  <Text style={[styles.conversionCardLabel, { fontSize: 12 }]}>PARENT A</Text>
                  <View style={styles.conversionRow}>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.conversionValue}>{formatPercent2dp(child.roundedCareA)}</Text>
                      <Text style={styles.conversionSubLabel}>care</Text>
                    </View>
                    <Text style={styles.conversionArrow}>→</Text>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.conversionResult}>{formatPercent2dp(child.costPercA)}</Text>
                      <Text style={styles.conversionSubLabel}>cost</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.conversionCard}>
                  <Text style={[styles.conversionCardLabel, { fontSize: 12 }]}>PARENT B</Text>
                  <View style={styles.conversionRow}>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.conversionValue}>{formatPercent2dp(child.roundedCareB)}</Text>
                      <Text style={styles.conversionSubLabel}>care</Text>
                    </View>
                    <Text style={styles.conversionArrow}>→</Text>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.conversionResult}>{formatPercent2dp(child.costPercB)}</Text>
                      <Text style={styles.conversionSubLabel}>cost</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </>
        </BreakdownStepCard>
      ))}

      {/* Step 6: Child Support Percentage - Per Child */}
      {results.childResults.map((child, index) => (
        <BreakdownStepCard
          key={index}
          stepNumber={`6${results.childResults.length > 1 ? String.fromCharCode(97 + index) : ''}`}
          title={`Child Support Percentage${results.childResults.length > 1 ? ` - CHILD ${index + 1}` : ''}`}
          description={results.childResults.length > 1 ? `for Child ${index + 1}` : undefined}
          isExpanded={expandedSteps.step6}
          onToggle={() => setExpandedSteps(prev => ({...prev, step6: !prev.step6}))}
        >
          <>
            {index === 0 && (
              <Text style={styles.stepExplanation}>
                A parent must pay child support when their share of income is higher than their share of costs. The difference between these two shares is called the child support percentage, which is then used in the formula to calculate the child support amount.
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
                      <Text style={styles.gapCardValue}>{formatPercent2dp(results.incomePercA)}</Text>
                    </View>
                    <View style={styles.gapCardRow}>
                      <Text style={styles.gapCardLabel}>Cost %</Text>
                      <Text style={[styles.gapCardValue, { color: '#dc2626' }]}>({formatPercent2dp(child.costPercA)})</Text>
                    </View>
                    <View style={styles.gapCardDivider} />
                    <View style={styles.gapCardRow}>
                      <Text style={[styles.gapCardLabel, styles.gapCardLabelBold]}>CS %</Text>
                      <Text style={[
                        styles.gapCardValue,
                        child.childSupportPercA > 0 && !child.farAppliedB && !child.marAppliedB && styles.gapCardValueHighlight
                      ]}>
                        {(child.farAppliedB || child.marAppliedB) ? '—' : (child.childSupportPercA > 0 ? formatPercent2dp(child.childSupportPercA) : '—')}
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
                      <Text style={styles.gapCardValue}>{formatPercent2dp(results.incomePercB)}</Text>
                    </View>
                    <View style={styles.gapCardRow}>
                      <Text style={styles.gapCardLabel}>Cost %</Text>
                      <Text style={[styles.gapCardValue, { color: '#dc2626' }]}>({formatPercent2dp(child.costPercB)})</Text>
                    </View>
                    <View style={styles.gapCardDivider} />
                    <View style={styles.gapCardRow}>
                      <Text style={[styles.gapCardLabel, styles.gapCardLabelBold]}>CS %</Text>
                      <Text style={[
                        styles.gapCardValue,
                        child.childSupportPercB > 0 && !child.farAppliedA && !child.marAppliedA && styles.gapCardValueHighlight
                      ]}>
                        {(child.farAppliedA || child.marAppliedA) ? '—' : (child.childSupportPercB > 0 ? formatPercent2dp(child.childSupportPercB) : '—')}
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
        </BreakdownStepCard>
      ))}

      {/* Step 7: Cost of Children */}
      <BreakdownStepCard
        stepNumber={7}
        title="COST OF CHILDREN"
        isExpanded={expandedSteps.step7}
        onToggle={() => setExpandedSteps(prev => ({...prev, step7: !prev.step7}))}
      >
        <>
          <Text style={styles.stepExplanation}>
          The total cost of children for an assessment is calculated using income brackets set by the Department of Social Services. Each bracket has a base cost plus a percentage applied to income within that bracket.
        </Text>

        {/* Bracket calculation */}
        {results.costBracketInfo && (
          <View style={styles.bracketCalculation}>
            {/* Combined income - moved inside box */}
            <Text style={[styles.combinedCSIncomeLabel, { marginBottom: 12, fontSize: 12, textAlign: 'left' }]}>
              COMBINED CS INCOME - {formatCurrency(results.CCSI)}
            </Text>
            
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
                  <Text style={styles.bracketLabel}>+ {(results.costBracketInfo.rate * 100).toFixed(2)}% × {formatCurrency(results.costBracketInfo.incomeInBracket)}</Text>
                  <Text style={styles.bracketValue}>+{formatCurrency2dp(results.costBracketInfo.rate * results.costBracketInfo.incomeInBracket)}</Text>
                </View>
              )}
              <View style={styles.bracketDivider} />
              <View style={styles.bracketRow}>
                <Text style={styles.bracketTotalLabel}>Total cost of children</Text>
                <Text style={styles.bracketTotalValue}>{formatCurrency2dp(results.totalCost)}</Text>
              </View>
              {results.childResults.length > 0 && (
                <View style={styles.bracketRow}>
                  <Text style={styles.bracketLabel}>Cost per child ({results.childResults.length})</Text>
                  <Text style={styles.bracketValue}>{formatCurrency2dp(results.totalCost / results.childResults.length)}</Text>
                </View>
              )}
            </View>
          </View>
        )}
        </>
      </BreakdownStepCard>

      {/* Step 8: Annual Rate */}
      <BreakdownStepCard
        stepNumber={8}
        title="ANNUAL RATE"
        isExpanded={expandedSteps.step8}
        onToggle={() => setExpandedSteps(prev => ({...prev, step8: !prev.step8}))}
      >
        <>
          <Text style={styles.stepExplanation}>
            The final annual liability is calculated by multiplying the Child Support Percentage <Text style={{ color: '#3b82f6' }}>(</Text><Text style={{ fontWeight: '600', color: '#3b82f6' }}>STEP 6</Text><Text style={{ color: '#3b82f6' }}>)</Text> by the total Cost of the Child <Text style={{ color: '#3b82f6' }}>(</Text><Text style={{ fontWeight: '600', color: '#3b82f6' }}>STEP 7</Text><Text style={{ color: '#3b82f6' }}>)</Text>.
          </Text>

        {/* Per-child payment breakdown */}
        {results.childResults.length > 0 && (() => {
          // Check if MAR is applied to any child
          const hasMarA = results.childResults.some(c => c.marAppliedA);
          const hasMarB = results.childResults.some(c => c.marAppliedB);
          const hasAnyMar = hasMarA || hasMarB;

          // If MAR is applied, show a single consolidated line
          if (hasAnyMar) {
            const payingParentColor = '#475569'; // slate-600 - neutral for all parents
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

          // Check if all children have no payment required
          const allChildrenNoPayment = results.childResults.every(child => 
            child.finalLiabilityA === 0 && child.finalLiabilityB === 0
          );

          // If all children have no payment, show consolidated line
          if (allChildrenNoPayment) {
            // Check if any child is due to FAR limit being reached
            const hasFarLimit = results.childResults.some((child, index) => 
              isFarLimitReached(index, results, formState)
            );
            const displayText = hasFarLimit ? 'FAR limit reached' : 'No payment required';

            return (
              <View style={styles.perChildGapBreakdown}>
                <View style={styles.perChildGapRow}>
                  <Text style={styles.perChildGapLabel}>
                    All children - <Text style={{ color: '#64748b' }}>{displayText}</Text>
                  </Text>
                  <Text style={[styles.perChildGapValue, { color: '#64748b' }]}>
                    $0
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
                const payingParentColor = '#475569'; // slate-600 - neutral for all parents
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
                          Child {index + 1} - <Text style={{ color: payingParentColor }}>({formatPercent2dp(gapPercentage)})</Text> × {formatCurrency2dp(child.costPerChild)}
                        </>
                      )}
                    </Text>
                    <Text style={[styles.perChildGapValue, { color: payingParentColor }]}>
                      {formatCurrency2dp(liability)}
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
                  {formatCurrency2dp(results.finalPaymentAmount)}
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
              <Text style={[styles.specialNoticeTitle, { color: '#64748b' }]}>
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
                      The FAR is for low-income parents whose income doesn&apos;t reflect their capacity to pay. It is a way to prevent parents from reducing their payments by minimising their income. It is a rate paid per child (maximum 3) and requires three eligibility criteria be met:
                    </Text>
                    <Text style={styles.specialNoticeText}>
                      {'\n'}1. The parent must have less than 35% care of the child.
                      {'\n\n'}2. The income used in the assessment must be less than the pension Parenting Payment (single) maximum basic amount - $26,195 (2025)
                      {'\n\n'}3. The parent did not receive an income support payment in the ATI.
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.specialNoticeText}>
                      The MAR is paid per case and is put in place for parents who wouldn&apos;t be able to afford a higher amount. It requires three eligibility criteria be met:
                    </Text>
                    <Text style={styles.specialNoticeText}>
                      {'\n'}1. The parent must have received at least one income support payment in their ATI.
                      {'\n\n'}2. The parent has less than 14% care of all children.
                      {'\n\n'}3. The parent&apos;s ATI must be below the self-support amount.
                    </Text>
                  </>
                )}
              </View>
            )}
          </View>
        )}
        </>
      </BreakdownStepCard>

      {/* Notice for $0 payment when low income but has care */}
      {results.finalPaymentAmount === 0 && results.rateApplied === "None" && (() => {
        // Calculate average care for the notice messages
        const avgCareA = results.childResults.length > 0
          ? results.childResults.reduce((sum, child) => sum + child.roundedCareA, 0) / results.childResults.length
          : 0;
        const avgCareB = results.childResults.length > 0
          ? results.childResults.reduce((sum, child) => sum + child.roundedCareB, 0) / results.childResults.length
          : 0;

        const parentABelowSSA = results.ATI_A < results.SSA && avgCareA >= 14;
        const parentBBelowSSA = results.ATI_B < results.SSA && avgCareB >= 14;

        return (
          <>
            {parentABelowSSA && parentBBelowSSA ? (
              <View style={styles.specialNotice}>
                <Text style={styles.specialNoticeTitle}>ℹ️ No Payment Required</Text>
                <Text style={styles.specialNoticeText}>
                  Both parents&apos; income is below the self-support amount ({formatCurrency(results.SSA)}), so neither has an income-based obligation. Their care time (Parent A: {formatPercent2dp(avgCareA)}, Parent B: {formatPercent2dp(avgCareB)}) means they&apos;re already contributing by covering costs directly during care.
                </Text>
              </View>
            ) : (
              <>
                {parentABelowSSA && (
                  <View style={styles.specialNotice}>
                    <Text style={styles.specialNoticeTitle}>ℹ️ No Payment Required</Text>
                    <Text style={styles.specialNoticeText}>
                      Parent A&apos;s income ({formatCurrency(results.ATI_A)}) is below the self-support amount ({formatCurrency(results.SSA)}), so they have no income-based obligation. Their care time ({formatPercent2dp(avgCareA)}) means they&apos;re already contributing by covering costs directly during care.
                    </Text>
                  </View>
                )}
                {parentBBelowSSA && (
                  <View style={styles.specialNotice}>
                    <Text style={styles.specialNoticeTitle}>ℹ️ No Payment Required</Text>
                    <Text style={styles.specialNoticeText}>
                      Parent B&apos;s income ({formatCurrency(results.ATI_B)}) is below the self-support amount ({formatCurrency(results.SSA)}), so they have no income-based obligation. Their care time ({formatPercent2dp(avgCareB)}) means they&apos;re already contributing by covering costs directly during care.
                    </Text>
                  </View>
                )}
              </>
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
    ...createShadow({
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
    color: "#6b7280", // gray-500 - WCAG AA compliant (4.5:1)
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
    fontWeight: "700",
    color: "#0f172a", // slate-900
  },
  deductionTotalValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3b82f6", // accent.primary - important calculated value
  },

  // Step 2: Combined Income Calculation
  combinedIncomeCalculation: {
    backgroundColor: "#f9fafb", // gray-50
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
    marginTop: 4,
  },
  combinedIncomeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  combinedIncomeLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b", // slate-500
  },
  combinedIncomeValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#0f172a", // slate-900
  },
  combinedIncomeDivider: {
    height: 1,
    backgroundColor: "#e5e7eb", // gray-200
    marginVertical: 6,
  },
  combinedIncomeTotalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a", // slate-900
  },
  combinedIncomeTotalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3b82f6", // accent.primary
  },

  // Step 3: Income Percentage Calculation
  incomePercentageCalculation: {
    gap: 10,
    marginTop: 4,
    marginBottom: 12,
  },
  incomePercentageCard: {
    backgroundColor: "#f9fafb", // gray-50
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
  },
  incomePercentageCardTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4a5568", // text.secondary
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  incomePercentageFormula: {
    fontSize: 13,
    color: "#0f172a", // slate-900
    fontWeight: "500",
    textAlign: "center",
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
    fontWeight: "700",
    color: "#3b82f6", // accent.primary - matches Child Support Income blue
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
    color: "#6b7280", // gray-500 - WCAG AA compliant (4.5:1)
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
    ...createShadow({
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

});
