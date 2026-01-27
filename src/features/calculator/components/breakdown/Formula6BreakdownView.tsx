import { useAppTheme } from '@/src/theme';
import type { CalculationResults } from '@/src/utils/calculator';
import { formatCurrency } from '@/src/utils/formatters';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { BreakdownStepCard } from './BreakdownStepCard';
import { ParentComparisonCard } from './ParentComparisonCard';
import { ZeroLiabilityNotice } from './ZeroLiabilityNotice';

interface Formula6BreakdownViewProps {
  results: CalculationResults;
  formState: { supportA: boolean; supportB: boolean };
}

// Helper to format percentage with 2 decimal places
const formatPercent2dp = (num: number): string => {
    return `${num.toFixed(2)}%`;
};

/**
 * Formula 6 Breakdown View
 * 
 * Displays the 9-step Formula 6 calculation as per CS Guide 2.2.7
 * Used when one parent is deceased (non-parent carer assessment)
 */
export function Formula6BreakdownView({ results, formState }: Formula6BreakdownViewProps) {
  const { colors } = useAppTheme();

  const [expandedSteps, setExpandedSteps] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: true, // Expanded by default - shows the calculation (no halving)
    step6: false,
    step7: false,
    step8: true, // Expanded by default - final result
    step9: false,
  });

  const dynamicStyles = useMemo(() => ({
    stepExplanation: { color: colors.textMuted },
    deductionLabel: { color: colors.textMuted },
    deductionValue: { color: colors.textPrimary },
    deductionDivider: { backgroundColor: colors.border },
    userHighlight: { color: colors.userHighlight },
    textMuted: { color: colors.textMuted },
    textPrimary: { color: colors.textPrimary },
    calculationBox: {
      backgroundColor: colors.surfaceSubtle,
      borderColor: colors.border,
    },
  }), [colors]);

  const handleToggle = (step: keyof typeof expandedSteps) => {
    setExpandedSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  // Extract first child for display (all children have same percentages in Formula 6)
  const firstChild = results.childResults[0];
  if (!firstChild) {
    return (
      <View style={styles.container}>
        <Text style={[styles.stepExplanation, { color: colors.textMuted }]}>
          No child data available for Formula 6 calculation.
        </Text>
      </View>
    );
  }

  // Safety checks for required values
  const roundedCareA = firstChild.roundedCareA ?? 0;
  const costPercA = firstChild.costPercA ?? 0;
  const costPerChild = firstChild.costPerChild ?? 0;

  return (
    <View style={styles.container}>
      {/* Step 1: Child Support Income (NOT Doubled) */}
      <BreakdownStepCard
        stepNumber={1}
        title="CHILD SUPPORT INCOME"
        isExpanded={expandedSteps.step1}
        onToggle={() => handleToggle('step1')}
      >
        <>
          <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
            Work out the parent&apos;s child support income.
          </Text>

          <ParentComparisonCard title="YOU" isUserHighlighted>
            <View style={[styles.deductionRow, { marginBottom: 4 }]}>
              <Text style={[styles.deductionLabel, dynamicStyles.deductionLabel]}>
                Adjusted taxable income
              </Text>
              <Text style={[styles.deductionLabel, dynamicStyles.deductionLabel]}>
                {formatCurrency(results.ATI_A)}
              </Text>
            </View>
            <View style={styles.deductionRow}>
              <Text style={[styles.deductionLabel, dynamicStyles.deductionLabel]}>Self-support amount</Text>
              <Text style={[styles.deductionLabel, dynamicStyles.deductionLabel]}>
                ({formatCurrency(results.SSA)})
              </Text>
            </View>
            {results.multiCaseAllowanceA !== undefined && results.multiCaseAllowanceA > 0 && (
              <View style={styles.deductionRow}>
                <Text style={[styles.deductionLabel, dynamicStyles.deductionLabel]}>Multi-case allowance</Text>
                <Text style={[styles.deductionLabel, dynamicStyles.deductionLabel]}>
                  ({formatCurrency(results.multiCaseAllowanceA)})
                </Text>
              </View>
            )}
            <View style={[styles.deductionDivider, dynamicStyles.deductionDivider]} />
            <View style={styles.deductionRow}>
              <Text style={[styles.deductionTotalLabel, dynamicStyles.userHighlight]}>
                Child Support Income
              </Text>
              <Text style={[styles.deductionTotalValue, dynamicStyles.userHighlight]}>
                {formatCurrency(Math.max(0, results.CSI_A))}
              </Text>
            </View>
          </ParentComparisonCard>
        </>
      </BreakdownStepCard>

      {/* Step 2: Care Percentage */}
      <BreakdownStepCard
        stepNumber={2}
        title="CARE PERCENTAGE"
        isExpanded={expandedSteps.step2}
        onToggle={() => handleToggle('step2')}
      >
        <>
          <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
            Work out the parent&apos;s percentage of care for the child.
          </Text>
          <ParentComparisonCard title="YOU" isUserHighlighted>
            <View style={styles.deductionRow}>
              <Text style={[styles.deductionLabel, dynamicStyles.userHighlight]}>Care percentage</Text>
              <Text style={[styles.deductionValue, dynamicStyles.userHighlight]}>
                {formatPercent2dp(roundedCareA)}
              </Text>
            </View>
          </ParentComparisonCard>
        </>
      </BreakdownStepCard>

      {/* Step 3: Cost Percentage */}
      <BreakdownStepCard
        stepNumber={3}
        title="COST PERCENTAGE"
        isExpanded={expandedSteps.step3}
        onToggle={() => handleToggle('step3')}
      >
        <>
          <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
            Work out the parent&apos;s cost percentage for the child.
          </Text>
          <ParentComparisonCard title="YOU" isUserHighlighted>
            <View style={styles.deductionRow}>
              <Text style={[styles.deductionLabel, dynamicStyles.userHighlight]}>
                {formatPercent2dp(roundedCareA)} care → Cost percentage
              </Text>
              <Text style={[styles.deductionValue, dynamicStyles.userHighlight]}>
                {formatPercent2dp(costPercA)}
              </Text>
            </View>
          </ParentComparisonCard>
        </>
      </BreakdownStepCard>

      {/* Step 4: Cost of Children (COTC) */}
      <BreakdownStepCard
        stepNumber={4}
        title="COSTS OF THE CHILD"
        isExpanded={expandedSteps.step4}
        onToggle={() => handleToggle('step4')}
      >
        <>
          <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
            Work out the COTC using the income from Step 1, by using either: Formula 1 (2.2.2), or Formula 4 (2.2.5) - if the parent has more than one child support case.
          </Text>

          <View style={[styles.calculationBox, dynamicStyles.calculationBox]}>
            <View style={styles.deductionRow}>
              <Text style={[styles.deductionLabel, dynamicStyles.textMuted]}>
                Child Support Income
              </Text>
              <Text style={[styles.deductionValue, dynamicStyles.textPrimary]}>
                {formatCurrency(results.CSI_A)}
              </Text>
            </View>
            {results.costBracketInfo && (
              <>
                <View style={[styles.deductionRow, { marginTop: 8 }]}>
                  <Text style={[styles.deductionLabel, dynamicStyles.textMuted]}>
                    Your bracket: {formatCurrency(results.costBracketInfo.minIncome)} – {results.costBracketInfo.maxIncome ? formatCurrency(results.costBracketInfo.maxIncome) : 'unlimited'}
                  </Text>
                </View>
                <View style={styles.deductionRow}>
                  <Text style={[styles.deductionLabel, dynamicStyles.textMuted]}>Base amount</Text>
                  <Text style={[styles.deductionValue, dynamicStyles.textPrimary]}>
                    {formatCurrency(results.costBracketInfo.fixed)}
                  </Text>
                </View>
                {results.costBracketInfo.rate > 0 && (
                  <View style={styles.deductionRow}>
                    <Text style={[styles.deductionLabel, dynamicStyles.textMuted]}>
                      + {(results.costBracketInfo.rate * 100).toFixed(2)}% × {formatCurrency(results.costBracketInfo.incomeInBracket)}
                    </Text>
                    <Text style={[styles.deductionValue, dynamicStyles.textPrimary]}>
                      +{formatCurrency(results.costBracketInfo.rate * results.costBracketInfo.incomeInBracket)}
                    </Text>
                  </View>
                )}
              </>
            )}
            <View style={[styles.deductionDivider, dynamicStyles.deductionDivider, { marginVertical: 8 }]} />
            <View style={styles.deductionRow}>
              <Text style={[styles.deductionTotalLabel, dynamicStyles.textPrimary]}>
                Total cost of children
              </Text>
              <Text style={[styles.deductionTotalValue, dynamicStyles.textPrimary]}>
                {formatCurrency(results.totalCost)}
              </Text>
            </View>
            <View style={styles.deductionRow}>
              <Text style={[styles.deductionLabel, dynamicStyles.textMuted]}>
                Cost per child ({results.childResults.filter(c => !c.isAdultChild).length})
              </Text>
              <Text style={[styles.deductionValue, dynamicStyles.textMuted]}>
                {formatCurrency(costPerChild)}
              </Text>
            </View>
          </View>
        </>
      </BreakdownStepCard>

      {/* Step 5: Calculate Rate (NO halving) */}
      <BreakdownStepCard
        stepNumber={5}
        title="CALCULATE RATE"
        isExpanded={expandedSteps.step5}
        onToggle={() => handleToggle('step5')}
      >
        <>
          <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
            Work out the following rate: COTC − (parent&apos;s cost percentage × COTC)
          </Text>

          <View style={[styles.calculationBox, dynamicStyles.calculationBox]}>
            <View style={styles.deductionRow}>
              <Text style={[styles.deductionLabel, dynamicStyles.textMuted]}>
                Total cost of children
              </Text>
              <Text style={[styles.deductionValue, dynamicStyles.textPrimary]}>
                {formatCurrency(results.totalCost)}
              </Text>
            </View>
            <View style={styles.deductionRow}>
              <Text style={[styles.deductionLabel, dynamicStyles.textMuted]}>
                Parent&apos;s cost share ({formatPercent2dp(costPercA)} × {formatCurrency(results.totalCost)})
              </Text>
              <Text style={[styles.deductionValue, dynamicStyles.textPrimary]}>
                ({formatCurrency((costPercA / 100) * results.totalCost)})
              </Text>
            </View>
            <View style={[styles.deductionDivider, dynamicStyles.deductionDivider, { marginVertical: 8 }]} />
            <View style={styles.deductionRow}>
              <Text style={[styles.deductionTotalLabel, dynamicStyles.userHighlight]}>
                Annual rate
              </Text>
              <Text style={[styles.deductionTotalValue, dynamicStyles.userHighlight]}>
                {formatCurrency(results.finalLiabilityA)}
              </Text>
            </View>
          </View>
        </>
      </BreakdownStepCard>

      {/* Step 7: Multi-case Cap - Only show if multi-case applies */}
      {results.multiCaseCapAppliedA && (
        <BreakdownStepCard
          stepNumber={7}
          title="MULTI-CASE CAP"
          isExpanded={expandedSteps.step7}
          onToggle={() => handleToggle('step7')}
        >
          <>
            <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
              If the parent is assessed to pay child support for a child who is in another child support case, work out the parent&apos;s multi-case cap.
            </Text>
            <View style={[styles.calculationBox, dynamicStyles.calculationBox]}>
              <View style={styles.deductionRow}>
                <Text style={[styles.deductionLabel, dynamicStyles.textMuted]}>
                  Multi-case cap applied
                </Text>
                <Text style={[styles.deductionValue, dynamicStyles.textPrimary]}>
                  Yes
                </Text>
              </View>
              <View style={[styles.deductionRow, { marginTop: 4 }]}>
                <Text style={[styles.deductionLabel, dynamicStyles.textMuted]}>
                  Liability capped at
                </Text>
                <Text style={[styles.deductionValue, dynamicStyles.textPrimary]}>
                  {formatCurrency(results.finalLiabilityA)}
                </Text>
              </View>
            </View>
          </>
        </BreakdownStepCard>
      )}

      {/* Step 8: Annual Rate - Only show if multi-case applies */}
      {results.multiCaseCapAppliedA && (
        <BreakdownStepCard
          stepNumber={8}
          title="ANNUAL RATE"
          isExpanded={expandedSteps.step8}
          onToggle={() => handleToggle('step8')}
        >
          <>
            <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
              The annual rate of child support payable for the child is the lower of the annual rate calculated at Step 5, or the multi-case cap calculated at Step 7.
            </Text>

            <View style={[styles.calculationBox, dynamicStyles.calculationBox]}>
              <View style={styles.deductionRow}>
                <Text style={[styles.deductionTotalLabel, dynamicStyles.userHighlight]}>
                  Annual rate
                </Text>
                <Text style={[styles.deductionTotalValue, dynamicStyles.userHighlight]}>
                  {formatCurrency(results.finalLiabilityA)}
                </Text>
              </View>
              <View style={[styles.deductionRow, { marginTop: 8 }]}>
                <Text style={[styles.deductionLabel, dynamicStyles.textMuted]}>
                  Monthly rate
                </Text>
                <Text style={[styles.deductionValue, dynamicStyles.textMuted]}>
                  {formatCurrency(results.finalLiabilityA / 12)}
                </Text>
              </View>
              <View style={styles.deductionRow}>
                <Text style={[styles.deductionLabel, dynamicStyles.textMuted]}>
                  Fortnightly rate
                </Text>
                <Text style={[styles.deductionValue, dynamicStyles.textMuted]}>
                  {formatCurrency(results.finalLiabilityA / 26)}
                </Text>
              </View>
            </View>
          </>
        </BreakdownStepCard>
      )}

      {/* Step 9: Payment to Non-Parent Carer */}
      <BreakdownStepCard
        stepNumber={9}
        title="NON-PARENT CARER PAYMENT"
        isExpanded={expandedSteps.step9}
        onToggle={() => handleToggle('step9')}
      >
        <>
          <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
            If there is only one non-parent carer, the parent must pay the annual rate of child support that is payable for the child to the non-parent carer.
          </Text>
          <View style={[styles.calculationBox, dynamicStyles.calculationBox]}>
            <View style={styles.deductionRow}>
              <Text style={[styles.deductionLabel, dynamicStyles.textMuted]}>
                You owe child support to the non-parent carer based on your care percentage.
              </Text>
            </View>
            <View style={[styles.deductionRow, { marginTop: 8 }]}>
              <Text style={[styles.deductionTotalLabel, dynamicStyles.textPrimary]}>
                Total to non-parent carer
              </Text>
              <Text style={[styles.deductionTotalValue, dynamicStyles.textPrimary]}>
                {formatCurrency(results.paymentToNPC ?? results.finalLiabilityA)}
              </Text>
            </View>
          </View>
        </>
      </BreakdownStepCard>

      {/* Zero liability notice at the end */}
      <ZeroLiabilityNotice results={results} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  } as ViewStyle,
  stepExplanation: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  deductionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deductionLabel: {
    fontSize: 13,
  },
  deductionValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  deductionDivider: {
    height: 1,
    marginVertical: 4,
  },
  deductionTotalLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  deductionTotalValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  calculationBox: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    marginTop: 4,
  },
});
