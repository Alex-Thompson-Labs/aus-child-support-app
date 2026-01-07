import React, { useState } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { theme } from '../theme';
import type { CalculationResults } from '../utils/calculator';
import { formatCurrency } from '../utils/formatters';
import { AnnualRateBreakdown } from './breakdown/AnnualRateBreakdown';
import { COST_PERCENTAGE_TABLE } from './breakdown/constants';
import { GapAnalysisCard } from './breakdown/GapAnalysisCard';
import { ParentComparisonCard } from './breakdown/ParentComparisonCard';
import { PercentageBar } from './breakdown/PercentageBar';
import { SpecialRateGlossary } from './breakdown/SpecialRateGlossary';
import { ZeroLiabilityNotice } from './breakdown/ZeroLiabilityNotice';
import { ZeroPaymentScenario } from './breakdown/ZeroPaymentScenario';
import { BreakdownStepCard } from './BreakdownStepCard';

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


export function ResultsSimpleExplanation({
  results,
  formState,
}: ResultsSimpleExplanationProps) {
  // Collapsible state management - 8-Step Formula
  const [expandedSteps, setExpandedSteps] = useState({
    step1: false, // Child Support Income - collapsed
    step2: false, // Combined Income - collapsed
    step3: false, // Income Percentage - collapsed
    step4: false, // Care Percentage - collapsed
    step5: false, // Cost Percentage - collapsed
    step6: false, // Child Support Percentage - collapsed
    step7: false, // Cost of Children - collapsed
    step8: false, // Annual Rate - collapsed
  });


  return (
    <View style={styles.container}>
      {/* Step 1: Child Support Income */}
      <BreakdownStepCard
        stepNumber={1}
        title="CHILD SUPPORT INCOME"
        isExpanded={expandedSteps.step1}
        onToggle={() =>
          setExpandedSteps((prev) => ({ ...prev, step1: !prev.step1 }))
        }
      >
        <>
          <Text style={styles.stepExplanation}>
            Child support income is a parent&apos;s income after deducting an
            amount for their own living costs and for any other children they
            support outside the child support case.
          </Text>

          <View style={styles.deductionCards}>
            {/* Parent A - Using Wrapper Pattern */}
            <ParentComparisonCard title="YOU" isUserHighlighted>
              <View style={styles.deductionRow}>
                <Text style={styles.deductionLabel}>
                  Adjusted taxable income
                </Text>
                <Text style={styles.deductionValue}>
                  {formatCurrency(results.ATI_A)}
                </Text>
              </View>
              <View style={styles.deductionRow}>
                <Text style={styles.deductionLabel}>Self-support amount</Text>
                <Text style={styles.deductionValueNegative}>
                  ({formatCurrency(results.SSA)})
                </Text>
              </View>
              {results.relDepDeductibleA > 0 && (
                <View style={styles.deductionRow}>
                  <Text style={styles.deductionLabel}>Rel dep allowance</Text>
                  <Text style={styles.deductionValueNegative}>
                    ({formatCurrency(results.relDepDeductibleA)})
                  </Text>
                </View>
              )}
              <View style={styles.deductionDivider} />
              <View style={styles.deductionRow}>
                <Text style={[styles.deductionTotalLabel, { color: theme.colors.userHighlight }]}>
                  Child Support Income
                </Text>
                <Text style={[styles.deductionTotalValue, { color: theme.colors.userHighlight }]}>
                  {formatCurrency(Math.max(0, results.CSI_A))}
                </Text>
              </View>
            </ParentComparisonCard>

            {/* Parent B - Using Wrapper Pattern */}
            <ParentComparisonCard title="OTHER PARENT">
              <View style={styles.deductionRow}>
                <Text style={styles.deductionLabel}>
                  Adjusted taxable income
                </Text>
                <Text style={styles.deductionValue}>
                  {formatCurrency(results.ATI_B)}
                </Text>
              </View>
              <View style={styles.deductionRow}>
                <Text style={styles.deductionLabel}>Self-support amount</Text>
                <Text style={styles.deductionValueNegative}>
                  ({formatCurrency(results.SSA)})
                </Text>
              </View>
              {results.relDepDeductibleB > 0 && (
                <View style={styles.deductionRow}>
                  <Text style={styles.deductionLabel}>Rel dep allowance</Text>
                  <Text style={styles.deductionValueNegative}>
                    ({formatCurrency(results.relDepDeductibleB)})
                  </Text>
                </View>
              )}
              <View style={styles.deductionDivider} />
              <View style={styles.deductionRow}>
                <Text style={styles.deductionTotalLabel}>
                  Child Support Income
                </Text>
                <Text style={styles.deductionTotalValue}>
                  {formatCurrency(Math.max(0, results.CSI_B))}
                </Text>
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
        onToggle={() =>
          setExpandedSteps((prev) => ({ ...prev, step2: !prev.step2 }))
        }
      >
        <>
          <Text style={styles.stepExplanation}>
            The combined child support income is the total of both parents&apos;
            child support incomes. This combined figure is used to calculate
            each parent&apos;s income percentage and to determine the cost of
            the children.
          </Text>

          <View style={styles.combinedIncomeCalculation}>
            <View style={styles.combinedIncomeRow}>
              <Text style={[styles.combinedIncomeLabel, { color: theme.colors.userHighlight }]}>Your CS Income</Text>
              <Text style={[styles.combinedIncomeValue, { color: theme.colors.userHighlight }]}>
                {formatCurrency(Math.max(0, results.CSI_A))}
              </Text>
            </View>
            <View style={styles.combinedIncomeRow}>
              <Text style={styles.combinedIncomeLabel}>Other Parent's CS Income</Text>
              <Text style={styles.combinedIncomeValue}>
                {formatCurrency(Math.max(0, results.CSI_B))}
              </Text>
            </View>
            <View style={styles.combinedIncomeDivider} />
            <View style={styles.combinedIncomeRow}>
              <Text style={styles.combinedIncomeTotalLabel}>
                Combined CS Income
              </Text>
              <Text style={styles.combinedIncomeTotalValue}>
                {formatCurrency(results.CCSI)}
              </Text>
            </View>
          </View>
        </>
      </BreakdownStepCard>

      {/* Step 3: Income Percentage */}
      <BreakdownStepCard
        stepNumber={3}
        title="INCOME PERCENTAGE"
        isExpanded={expandedSteps.step3}
        onToggle={() =>
          setExpandedSteps((prev) => ({ ...prev, step3: !prev.step3 }))
        }
      >
        <>
          <Text style={styles.stepExplanation}>
            Each parent&apos;s child support income is shown as a percentage of
            the combined total. This percentage represents each parent&apos;s
            share of the total income available for child support.
          </Text>

          <View style={styles.incomePercentageCalculation}>
            <ParentComparisonCard
              title="YOU"
              isUserHighlighted
              formula={`${formatCurrency(
                Math.max(0, results.CSI_A)
              )} ÷ ${formatCurrency(results.CCSI)} = ${formatPercent2dp(
                results.incomePercA
              )}`}
            />
            <ParentComparisonCard
              title="OTHER PARENT"
              formula={`${formatCurrency(
                Math.max(0, results.CSI_B)
              )} ÷ ${formatCurrency(results.CCSI)} = ${formatPercent2dp(
                results.incomePercB
              )}`}
            />
          </View>

          <View style={styles.incomeComparison}>
            <Text style={styles.careHeaderLabel}>
              <Text style={{ color: theme.colors.userHighlight }}>YOU</Text> -{' '}
              <Text style={{ color: theme.colors.userHighlight }}>
                {formatPercent2dp(results.incomePercA)}
              </Text>
            </Text>

            <PercentageBar
              percentA={results.incomePercA}
              percentB={results.incomePercB}
            />

            <Text style={[styles.careHeaderLabel, { textAlign: 'right' }]}>
              <Text style={{ color: '#334155' }}>OTHER PARENT</Text> -{' '}
              <Text style={{ color: '#334155' }}>
                {formatPercent2dp(results.incomePercB)}
              </Text>
            </Text>
          </View>
        </>
      </BreakdownStepCard>

      {/* Step 4: Care Percentage - Per Child */}
      {results.childResults.map((child, index) => (
        <BreakdownStepCard
          key={index}
          stepNumber={`4${results.childResults.length > 1
            ? String.fromCharCode(97 + index)
            : ''
            }`}
          title={`CARE PERCENTAGE${results.childResults.length > 1 ? ` - CHILD ${index + 1}` : ''
            }`}
          description={
            results.childResults.length > 1
              ? `for Child ${index + 1}`
              : undefined
          }
          tooltip={index === 0 ? "Special rounding rules apply. Regardless of the decimal value, percentages below 50% are rounded down to the nearest whole number with ones above being always rounded up." : undefined}
          isExpanded={expandedSteps.step4}
          onToggle={() =>
            setExpandedSteps((prev) => ({ ...prev, step4: !prev.step4 }))
          }
        >
          <>
            {index === 0 && (
              <Text style={[styles.stepExplanation, { lineHeight: 22 }]}>
                The number of nights each parent cares for the child over a year
                is converted into a care percentage.
              </Text>
            )}

            <View style={styles.careComparison}>
              <Text style={styles.careHeaderLabel}>
                <Text style={{ color: theme.colors.userHighlight }}>YOU</Text> -{' '}
                <Text style={{ color: theme.colors.userHighlight }}>
                  {formatPercent2dp(child.roundedCareA)}
                </Text>
              </Text>

              <PercentageBar
                percentA={child.roundedCareA}
                percentB={child.roundedCareB}
              />

              <Text style={[styles.careHeaderLabel, { textAlign: 'right' }]}>
                <Text style={{ color: '#334155' }}>OTHER PARENT</Text> -{' '}
                <Text style={{ color: '#334155' }}>
                  {formatPercent2dp(child.roundedCareB)}
                </Text>
              </Text>

              {/* Divider line for additional children */}
              {index > 0 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: '#334155',
                    marginTop: 16,
                  }}
                />
              )}
            </View>
          </>
        </BreakdownStepCard>
      ))}

      {/* Step 5: Cost Percentage - Per Child */}
      {results.childResults.map((child, index) => (
        <BreakdownStepCard
          key={index}
          stepNumber={`5${results.childResults.length > 1
            ? String.fromCharCode(97 + index)
            : ''
            }`}
          title={`COST PERCENTAGE${results.childResults.length > 1 ? ` - CHILD ${index + 1}` : ''
            }`}
          description={
            results.childResults.length > 1
              ? `for Child ${index + 1}`
              : undefined
          }
          tooltip={index === 0 ? (
            <View style={{ paddingVertical: 8 }}>
              <Text
                style={{
                  color: '#0f172a', // Slate 900
                  fontSize: 13,
                  fontWeight: '600',
                  marginBottom: 12,
                  textAlign: 'center',
                }}
              >
                Care Percentage → Cost Percentage
              </Text>

              <View style={{ gap: 10 }}>
                {COST_PERCENTAGE_TABLE.map((row, idx) => (
                  <View
                    key={idx}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 6,
                      borderBottomWidth: 1,
                      borderBottomColor: '#334155',
                    }}
                  >
                    <Text style={{ color: '#0f172a', fontSize: 13, flex: 1 }}>
                      {row.careRange}
                    </Text>
                    <Text
                      style={{
                        color: '#3b82f6',
                        fontSize: 13,
                        fontWeight: '600',
                        flex: 1,
                        textAlign: 'right',
                      }}
                    >
                      {row.costResult}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : undefined}
          isExpanded={expandedSteps.step5}
          onToggle={() =>
            setExpandedSteps((prev) => ({ ...prev, step5: !prev.step5 }))
          }
        >
          <>
            {index === 0 && (
              <Text style={[styles.stepExplanation, { lineHeight: 22 }]}>
                The care percentage is converted via a formula into a cost
                percentage. This figure reflects the share of the childs living
                costs that the parent covers directly while providing care.
              </Text>
            )}

            {/* Care to Cost conversion */}
            <View
              style={[
                styles.careConversion,
                { marginTop: index === 0 ? 12 : 16, padding: 12 },
              ]}
            >
              <View style={styles.conversionCards}>
                <ParentComparisonCard
                  title="YOU"
                  isUserHighlighted
                  careValue={formatPercent2dp(child.roundedCareA)}
                  costValue={formatPercent2dp(child.costPercA)}
                />
                <ParentComparisonCard
                  title="OTHER PARENT"
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
          stepNumber={`6${results.childResults.length > 1
            ? String.fromCharCode(97 + index)
            : ''
            }`}
          title={`Child Support Percentage${results.childResults.length > 1 ? ` - CHILD ${index + 1}` : ''
            }`}
          description={
            results.childResults.length > 1
              ? `for Child ${index + 1}`
              : undefined
          }
          isExpanded={expandedSteps.step6}
          onToggle={() =>
            setExpandedSteps((prev) => ({ ...prev, step6: !prev.step6 }))
          }
        >
          <>
            {index === 0 && (
              <Text style={styles.stepExplanation}>
                A parent must pay child support when their share of income is
                higher than their share of costs. The difference between these
                two shares is called the child support percentage, which is then
                used in the formula to calculate the child support amount.
              </Text>
            )}

            <View style={styles.gapCalculation}>
              <View style={styles.gapCards}>
                <GapAnalysisCard
                  label="YOU"
                  isUserHighlighted
                  incomePercent={results.incomePercA}
                  costPercent={child.costPercA}
                  csPercent={child.childSupportPercA}
                  isFarApplied={child.farAppliedA}
                  isMarApplied={child.marAppliedA}
                  otherParentHasFixedRate={child.farAppliedB || child.marAppliedB}
                  fixedRateAmount={child.farAppliedA ? results.FAR : results.MAR}
                  formatPercent={formatPercent2dp}
                  formatCurrency={formatCurrency}
                />
                <GapAnalysisCard
                  label="OTHER PARENT"
                  incomePercent={results.incomePercB}
                  costPercent={child.costPercB}
                  csPercent={child.childSupportPercB}
                  isFarApplied={child.farAppliedB}
                  isMarApplied={child.marAppliedB}
                  otherParentHasFixedRate={child.farAppliedA || child.marAppliedA}
                  fixedRateAmount={child.farAppliedB ? results.FAR : results.MAR}
                  formatPercent={formatPercent2dp}
                  formatCurrency={formatCurrency}
                />
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
        onToggle={() =>
          setExpandedSteps((prev) => ({ ...prev, step7: !prev.step7 }))
        }
      >
        <>
          <Text style={styles.stepExplanation}>
            The total cost of children for an assessment is calculated using
            income brackets set by the Department of Social Services. Each
            bracket has a base cost plus a percentage applied to income within
            that bracket.
          </Text>

          {/* Bracket calculation */}
          {results.costBracketInfo && (
            <View style={styles.bracketCalculation}>
              {/* Combined income - moved inside box */}
              <Text
                style={[
                  styles.combinedCSIncomeLabel,
                  { marginBottom: 12, fontSize: 12, textAlign: 'left' },
                ]}
              >
                COMBINED CS INCOME - {formatCurrency(results.CCSI)}
              </Text>

              <Text style={styles.bracketTitle}>
                Your bracket:{' '}
                {formatCurrency(results.costBracketInfo.minIncome)} –{' '}
                {results.costBracketInfo.maxIncome
                  ? formatCurrency(results.costBracketInfo.maxIncome)
                  : 'unlimited'}
              </Text>

              <View style={styles.bracketFormula}>
                <View style={styles.bracketRow}>
                  <Text style={styles.bracketLabel}>Base amount</Text>
                  <Text style={styles.bracketValue}>
                    {formatCurrency(results.costBracketInfo.fixed)}
                  </Text>
                </View>
                {results.costBracketInfo.rate > 0 && (
                  <View style={styles.bracketRow}>
                    <Text style={styles.bracketLabel}>
                      + {(results.costBracketInfo.rate * 100).toFixed(2)}% ×{' '}
                      {formatCurrency(results.costBracketInfo.incomeInBracket)}
                    </Text>
                    <Text style={styles.bracketValue}>
                      +
                      {formatCurrency2dp(
                        results.costBracketInfo.rate *
                        results.costBracketInfo.incomeInBracket
                      )}
                    </Text>
                  </View>
                )}
                <View style={styles.bracketDivider} />
                <View style={styles.bracketRow}>
                  <Text style={styles.bracketTotalLabel}>
                    Total cost of children
                  </Text>
                  <Text style={styles.bracketTotalValue}>
                    {formatCurrency2dp(results.totalCost)}
                  </Text>
                </View>
                {results.childResults.length > 0 && (
                  <View style={styles.bracketRow}>
                    <Text style={styles.bracketLabel}>
                      Cost per child ({results.childResults.length})
                    </Text>
                    <Text style={styles.bracketValue}>
                      {formatCurrency2dp(
                        results.totalCost / results.childResults.length
                      )}
                    </Text>
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
        onToggle={() =>
          setExpandedSteps((prev) => ({ ...prev, step8: !prev.step8 }))
        }
      >
        <>
          <Text style={styles.stepExplanation}>
            The final annual liability is calculated by multiplying the Child
            Support Percentage <Text style={{ color: '#3b82f6' }}>(</Text>
            <Text style={{ fontWeight: '600', color: '#3b82f6' }}>STEP 6</Text>
            <Text style={{ color: '#3b82f6' }}>)</Text> by the total Cost of the
            Child <Text style={{ color: '#3b82f6' }}>(</Text>
            <Text style={{ fontWeight: '600', color: '#3b82f6' }}>STEP 7</Text>
            <Text style={{ color: '#3b82f6' }}>)</Text>.
          </Text>

          {/* Per-child payment breakdown */}
          <AnnualRateBreakdown results={results} formState={formState} />

          {/* No payment explanation - shown when any child has no payment */}
          <ZeroPaymentScenario results={results} formState={formState} />

          {/* Optional: Special rates notice */}
          <SpecialRateGlossary rateApplied={results.rateApplied} />
        </>
      </BreakdownStepCard>

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
    color: '#64748b', // Slate 500
    lineHeight: 20,
    marginBottom: 12,
  },

  // Deduction breakdown cards
  deductionCards: {
    gap: 10,
    marginBottom: 16,
  },
  deductionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deductionLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  deductionValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0f172a',
  },
  deductionValueNegative: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
  },
  deductionDivider: {
    height: 1,
    backgroundColor: '#e2e8f0', // Slate 200
    marginVertical: 4,
  },
  deductionTotalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  deductionTotalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },

  // Step 2: Combined Income Calculation
  combinedIncomeCalculation: {
    backgroundColor: '#f8fafc', // Slate 50
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0', // Slate 200
    marginTop: 4,
  },
  combinedIncomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  combinedIncomeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  combinedIncomeValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0f172a',
  },
  combinedIncomeDivider: {
    height: 1,
    backgroundColor: '#e2e8f0', // Slate 200
    marginVertical: 6,
  },
  combinedIncomeTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  combinedIncomeTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },

  // Step 3: Income Percentage Calculation
  incomePercentageCalculation: {
    gap: 10,
    marginTop: 4,
    marginBottom: 12,
  },
  // Combined CS Income label
  combinedCSIncomeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Income comparison
  incomeComparison: {
    gap: 10,
  },


  // Care comparison
  careComparison: {
    gap: 10,
  },
  careHeaderLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b', // Slate 500
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Care to Cost conversion
  careConversion: {
    marginTop: 8,
    backgroundColor: '#f8fafc', // Slate 50
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0', // Slate 200
  },
  conversionCards: {
    flexDirection: 'row',
    gap: 10,
  },

  // Gap calculation (THE KEY INSIGHT)
  gapCalculation: {
    backgroundColor: '#f8fafc', // Slate 50
    borderRadius: 8,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0', // Slate 200
  },
  gapCards: {
    flexDirection: 'row',
    gap: 10,
  },

  // Bracket calculation
  bracketCalculation: {
    backgroundColor: '#f8fafc', // Slate 50
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0', // Slate 200
  },
  bracketTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b', // Slate 500
    marginBottom: 12,
  },
  bracketFormula: {
    gap: 8,
  },
  bracketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bracketLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  bracketValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0f172a', // Slate 900
  },
  bracketDivider: {
    height: 1,
    backgroundColor: '#e2e8f0', // Slate 200
    marginVertical: 4,
  },
  bracketTotalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  bracketTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
});
