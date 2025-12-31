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

// Helper to format percentage with 2 decimal places
const formatPercent2dp = (num: number): string => {
  return `${num.toFixed(2)}%`;
};

// Helper to format currency with 2 decimal places
const formatCurrency2dp = (num: number): string => {
  return `$${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

// Cost Percentage Table data for Step 5 tooltip
const COST_PERCENTAGE_TABLE = [
  { careRange: '0% - 13%', costResult: 'Nil' },
  { careRange: '14% - 34%', costResult: '24%' },
  { careRange: '35% - 47%', costResult: '25% + 2% per point over 35%' },
  { careRange: '48% - 52%', costResult: '50%' },
  { careRange: '53% - 65%', costResult: '51% + 2% per point over 53%' },
];


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

  // Helper function for Step 8 Annual Rate breakdown rendering
  const renderAnnualRateBreakdown = () => {
    if (results.childResults.length === 0) return null;

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
  };

  return (
    <View style={styles.container}>
      {/* Step 1: Child Support Income */}
      <BreakdownStepCard
        stepNumber={1}
        title="CHILD SUPPORT INCOME"
        isExpanded={expandedSteps.step1}
        onToggle={() => setExpandedSteps(prev => ({ ...prev, step1: !prev.step1 }))}
      >
        <>
          <Text style={styles.stepExplanation}>
            Child support income is a parent&apos;s income after deducting an amount for their own living costs and for any other children they support outside the child support case.
          </Text>

          <View style={styles.deductionCards}>
            {/* Parent A - Using Wrapper Pattern */}
            <ParentComparisonCard title="PARENT A">
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
            </ParentComparisonCard>

            {/* Parent B - Using Wrapper Pattern */}
            <ParentComparisonCard title="PARENT B">
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
            </ParentComparisonCard>
          </View>
        </>
      </BreakdownStepCard>

      {/* Step 2: Combined Income */}
      <BreakdownStepCard
        stepNumber={2}
        title="COMBINED CHILD SUPPORT INCOME"
        isExpanded={expandedSteps.step2}
        onToggle={() => setExpandedSteps(prev => ({ ...prev, step2: !prev.step2 }))}
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
        onToggle={() => setExpandedSteps(prev => ({ ...prev, step3: !prev.step3 }))}
      >
        <>
          <Text style={styles.stepExplanation}>
            Each parent&apos;s child support income is shown as a percentage of the combined total. This percentage represents each parent&apos;s share of the total income available for child support.
          </Text>

          <View style={styles.incomePercentageCalculation}>
            <ParentComparisonCard
              title="PARENT A"
              formula={`${formatCurrency(Math.max(0, results.CSI_A))} ÷ ${formatCurrency(results.CCSI)} = ${formatPercent2dp(results.incomePercA)}`}
            />
            <ParentComparisonCard
              title="PARENT B"
              formula={`${formatCurrency(Math.max(0, results.CSI_B))} ÷ ${formatCurrency(results.CCSI)} = ${formatPercent2dp(results.incomePercB)}`}
            />
          </View>

          <View style={styles.incomeComparison}>
            <Text style={styles.careHeaderLabel}>
              <Text style={{ color: '#4a5568' }}>PARENT A</Text> - <Text style={{ color: '#4a5568' }}>{formatPercent2dp(results.incomePercA)}</Text>
            </Text>

            <PercentageBar percentA={results.incomePercA} percentB={results.incomePercB} />

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
          onToggle={() => setExpandedSteps(prev => ({ ...prev, step4: !prev.step4 }))}
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

              <PercentageBar percentA={child.roundedCareA} percentB={child.roundedCareB} />

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
                {COST_PERCENTAGE_TABLE.map((row, idx) => (
                  <View
                    key={idx}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#334155' }}
                  >
                    <Text style={{ color: '#1a202c', fontSize: 13, flex: 1 }}>{row.careRange}</Text>
                    <Text style={{ color: '#3b82f6', fontSize: 13, fontWeight: '600', flex: 1, textAlign: 'right' }}>{row.costResult}</Text>
                  </View>
                ))}
              </View>
            </View>
          }
          isExpanded={expandedSteps.step5}
          onToggle={() => setExpandedSteps(prev => ({ ...prev, step5: !prev.step5 }))}
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
                <ParentComparisonCard
                  title="PARENT A"
                  careValue={formatPercent2dp(child.roundedCareA)}
                  costValue={formatPercent2dp(child.costPercA)}
                />
                <ParentComparisonCard
                  title="PARENT B"
                  careValue={formatPercent2dp(child.roundedCareB)}
                  costValue={formatPercent2dp(child.costPercB)}
                />
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
          onToggle={() => setExpandedSteps(prev => ({ ...prev, step6: !prev.step6 }))}
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
        onToggle={() => setExpandedSteps(prev => ({ ...prev, step7: !prev.step7 }))}
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
        onToggle={() => setExpandedSteps(prev => ({ ...prev, step8: !prev.step8 }))}
      >
        <>
          <Text style={styles.stepExplanation}>
            The final annual liability is calculated by multiplying the Child Support Percentage <Text style={{ color: '#3b82f6' }}>(</Text><Text style={{ fontWeight: '600', color: '#3b82f6' }}>STEP 6</Text><Text style={{ color: '#3b82f6' }}>)</Text> by the total Cost of the Child <Text style={{ color: '#3b82f6' }}>(</Text><Text style={{ fontWeight: '600', color: '#3b82f6' }}>STEP 7</Text><Text style={{ color: '#3b82f6' }}>)</Text>.
          </Text>

          {/* Per-child payment breakdown */}
          {renderAnnualRateBreakdown()}

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
                onPress={() => setExpandedSteps(prev => ({ ...prev, specialRate: !prev.specialRate }))}
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

// --- Reusable Sub-Component: ParentComparisonCard ---
interface ParentComparisonCardProps {
  title: string;
  label?: string;
  value?: string;
  isNegative?: boolean;
  subLabel?: string;
  formula?: string;
  // For Step 5 conversion pattern
  careValue?: string;
  costValue?: string;
  children?: React.ReactNode;
}

function ParentComparisonCard({ title, label, value, isNegative = false, subLabel, formula, careValue, costValue, children }: ParentComparisonCardProps) {
  // If children are provided, render those instead of the simple label/value pattern
  if (children) {
    return (
      <View style={styles.incomePercentageCard}>
        <Text style={styles.incomePercentageCardTitle}>{title}</Text>
        {children}
      </View>
    );
  }

  // Render formula if provided (Step 3 pattern)
  if (formula) {
    return (
      <View style={styles.incomePercentageCard}>
        <Text style={styles.incomePercentageCardTitle}>{title}</Text>
        <Text style={styles.incomePercentageFormula}>{formula}</Text>
      </View>
    );
  }

  // Render care→cost conversion pattern (Step 5)
  if (careValue && costValue) {
    return (
      <View style={styles.conversionCard}>
        <Text style={[styles.conversionCardLabel, { fontSize: 12 }]}>{title}</Text>
        <View style={styles.conversionRow}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.conversionValue}>{careValue}</Text>
            <Text style={styles.conversionSubLabel}>care</Text>
          </View>
          <Text style={styles.conversionArrow}>→</Text>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.conversionResult}>{costValue}</Text>
            <Text style={styles.conversionSubLabel}>cost</Text>
          </View>
        </View>
      </View>
    );
  }

  // Simple label/value pattern
  return (
    <View style={styles.deductionCard}>
      <Text style={styles.deductionCardTitle}>{title}</Text>
      {label && value && (
        <View style={styles.deductionRow}>
          <Text style={styles.deductionLabel}>{label}</Text>
          <Text style={isNegative ? styles.deductionValueNegative : styles.deductionValue}>
            {isNegative ? `(${value})` : value}
          </Text>
        </View>
      )}
      {subLabel && (
        <Text style={styles.conversionSubLabel}>{subLabel}</Text>
      )}
    </View>
  );
}

// --- Reusable Sub-Component: PercentageBar ---
interface PercentageBarProps {
  percentA: number;
  percentB: number;
}

function PercentageBar({ percentA, percentB }: PercentageBarProps) {
  return (
    <View style={styles.visualBar}>
      <View style={[styles.barSegmentA, { flex: percentA }]} />
      <View style={[styles.barSegmentB, { flex: percentB }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },

  // Step styles (used by BreakdownStepCard content)
  step: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    ...createShadow({
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    }),
  } as any,
  stepExplanation: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 12,
  },

  // Deduction breakdown cards
  deductionCards: {
    gap: 10,
    marginBottom: 16,
  },
  deductionCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  deductionCardTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4a5568",
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
    color: "#64748b",
  },
  deductionValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#0f172a",
  },
  deductionValueNegative: {
    fontSize: 13,
    fontWeight: "500",
    color: "#dc2626",
  },
  deductionDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 4,
  },
  deductionTotalLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f172a",
  },
  deductionTotalValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3b82f6",
  },

  // Step 2: Combined Income Calculation
  combinedIncomeCalculation: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
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
    color: "#64748b",
  },
  combinedIncomeValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#0f172a",
  },
  combinedIncomeDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 6,
  },
  combinedIncomeTotalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },
  combinedIncomeTotalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3b82f6",
  },

  // Step 3: Income Percentage Calculation
  incomePercentageCalculation: {
    gap: 10,
    marginTop: 4,
    marginBottom: 12,
  },
  incomePercentageCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  incomePercentageCardTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4a5568",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  incomePercentageFormula: {
    fontSize: 13,
    color: "#0f172a",
    fontWeight: "500",
    textAlign: "center",
  },

  // Combined CS Income label
  combinedCSIncomeLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3b82f6",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // Income comparison
  incomeComparison: {
    gap: 10,
  },

  // Visual bar
  visualBar: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
  },
  barSegmentA: {
    backgroundColor: "#3b82f6",
  },
  barSegmentB: {
    backgroundColor: "#e5e7eb",
  },

  // Care comparison
  careComparison: {
    gap: 10,
  },
  careHeaderLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // Care to Cost conversion
  careConversion: {
    marginTop: 8,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  conversionCards: {
    flexDirection: "row",
    gap: 10,
  },
  conversionCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  conversionCardLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4a5568",
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
    color: "#374151",
  },
  conversionArrow: {
    fontSize: 14,
    color: "#6b7280",
  },
  conversionResult: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3b82f6",
  },
  conversionSubLabel: {
    fontSize: 9,
    color: "#6b7280",
    textTransform: "uppercase",
  },

  // Gap calculation (THE KEY INSIGHT)
  gapCalculation: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  gapCards: {
    flexDirection: "row",
    gap: 10,
  },
  gapCard: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  gapCardTitle: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
    color: "#4a5568",
  },
  gapCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  gapCardLabel: {
    fontSize: 12,
    color: "#64748b",
    flex: 1,
    paddingRight: 4,
  },
  gapCardLabelBold: {
    fontWeight: "600",
    color: "#0f172a",
  },
  gapCardValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    textAlign: "right",
  },
  gapCardValueHighlight: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3b82f6",
  },
  gapCardDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 6,
  },
  gapCardSpecialRate: {
    gap: 4,
  },
  gapCardSpecialRateText: {
    fontSize: 11,
    color: "#6b7280",
    lineHeight: 15,
  },

  // Bracket calculation
  bracketCalculation: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  bracketTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
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
    color: "#64748b",
  },
  bracketValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1a202c",
  },
  bracketDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 4,
  },
  bracketTotalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
  },
  bracketTotalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3b82f6",
  },

  // Per-child gap breakdown
  perChildGapBreakdown: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  perChildGapRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  perChildGapLabel: {
    fontSize: 13,
    color: "#64748b",
  },
  perChildGapValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  perChildGapDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginTop: 4,
  },

  // Special notice
  specialNotice: {
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#0ea5e9",
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  specialNoticeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  specialNoticeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0369a1",
    flex: 1,
  },
  specialNoticeChevron: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 8,
  },
  specialNoticeContent: {
    marginTop: 12,
  },
  specialNoticeText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
});
