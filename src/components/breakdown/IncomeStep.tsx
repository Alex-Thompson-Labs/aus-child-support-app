import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';
import type { CalculationResults } from '../../utils/calculator';
import { formatCurrency } from '../../utils/formatters';
import { BreakdownStepCard } from '../BreakdownStepCard';
import { ParentComparisonCard } from './ParentComparisonCard';
import { PercentageBar } from './PercentageBar';

// Helper to format percentage with 2 decimal places
const formatPercent2dp = (num: number): string => {
    return `${num.toFixed(2)}%`;
};

interface IncomeStepProps {
    results: CalculationResults;
    expandedSteps: { step1: boolean; step2: boolean; step3: boolean };
    onToggle: (step: 'step1' | 'step2' | 'step3') => void;
}

/**
 * Income calculation breakdown - Steps 1-3
 * 
 * Step 1: Child Support Income (CSI) for each parent
 * Step 2: Combined Child Support Income (CCSI)
 * Step 3: Income Percentage for each parent
 */
export function IncomeStep({ results, expandedSteps, onToggle }: IncomeStepProps) {
    return (
        <>
            {/* Step 1: Child Support Income */}
            <BreakdownStepCard
                stepNumber={1}
                title="CHILD SUPPORT INCOME"
                isExpanded={expandedSteps.step1}
                onToggle={() => onToggle('step1')}
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
                            <View style={[styles.deductionRow, { marginBottom: 4 }]}>
                                <Text style={styles.deductionLabel}>
                                    Adjusted taxable income
                                </Text>
                                <Text
                                    style={[
                                        styles.deductionLabel,
                                    ]}
                                >
                                    {formatCurrency(results.ATI_A)}
                                </Text>
                            </View>
                            <View style={styles.deductionRow}>
                                <Text style={styles.deductionLabel}>Self-support amount</Text>
                                <Text style={styles.deductionLabel}>
                                    ({formatCurrency(results.SSA)})
                                </Text>
                            </View>
                            {results.relDepDeductibleA > 0 && (
                                <View style={styles.deductionRow}>
                                    <Text style={styles.deductionLabel}>Rel dep allowance</Text>
                                    <Text style={styles.deductionLabel}>
                                        ({formatCurrency(results.relDepDeductibleA)})
                                    </Text>
                                </View>
                            )}
                            {results.multiCaseAllowanceA !== undefined && results.multiCaseAllowanceA > 0 && (
                                <View style={styles.deductionRow}>
                                    <Text style={styles.deductionLabel}>Multi-case allowance</Text>
                                    <Text style={styles.deductionLabel}>
                                        ({formatCurrency(results.multiCaseAllowanceA)})
                                    </Text>
                                </View>
                            )}
                            <View style={styles.deductionDivider} />
                            <View style={styles.deductionRow}>
                                <Text
                                    style={[
                                        styles.deductionTotalLabel,
                                        { color: theme.colors.userHighlight },
                                    ]}
                                >
                                    Child Support Income
                                </Text>
                                <Text
                                    style={[
                                        styles.deductionTotalValue,
                                        { color: theme.colors.userHighlight },
                                    ]}
                                >
                                    {formatCurrency(Math.max(0, results.CSI_A))}
                                </Text>
                            </View>
                        </ParentComparisonCard>

                        {/* Parent B - Using Wrapper Pattern */}
                        <ParentComparisonCard title="OTHER PARENT">
                            <View style={[styles.deductionRow, { marginBottom: 4 }]}>
                                <Text style={styles.deductionLabel}>
                                    Adjusted taxable income
                                </Text>
                                <Text
                                    style={[
                                        styles.deductionValue,
                                        { color: theme.colors.textMuted },
                                    ]}
                                >
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
                            {results.multiCaseAllowanceB !== undefined && results.multiCaseAllowanceB > 0 && (
                                <View style={styles.deductionRow}>
                                    <Text style={styles.deductionLabel}>Multi-case allowance</Text>
                                    <Text style={styles.deductionValueNegative}>
                                        ({formatCurrency(results.multiCaseAllowanceB)})
                                    </Text>
                                </View>
                            )}
                            <View style={styles.deductionDivider} />
                            <View style={styles.deductionRow}>
                                <Text style={[styles.deductionTotalLabel, { color: theme.colors.textMuted }]}>Child Support Income</Text>
                                <Text style={[styles.deductionTotalValue, { color: theme.colors.textMuted }]}>
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
                onToggle={() => onToggle('step2')}
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
                            <Text
                                style={[
                                    styles.combinedIncomeLabel,
                                    { color: theme.colors.userHighlight, fontWeight: '700' },
                                ]}
                            >
                                Your CS Income
                            </Text>
                            <Text
                                style={[
                                    styles.combinedIncomeValue,
                                    { color: theme.colors.userHighlight, fontWeight: '700' },
                                ]}
                            >
                                {formatCurrency(Math.max(0, results.CSI_A))}
                            </Text>
                        </View>
                        <View style={styles.combinedIncomeRow}>
                            <Text style={[styles.combinedIncomeLabel, { color: theme.colors.textMuted, fontWeight: '700' }]}>
                                Other Parent&apos;s CS Income
                            </Text>
                            <Text style={[styles.combinedIncomeValue, { color: theme.colors.textMuted, fontWeight: '700' }]}>
                                {formatCurrency(Math.max(0, results.CSI_B))}
                            </Text>
                        </View>
                        <View style={styles.combinedIncomeDivider} />
                        <View style={[styles.combinedIncomeRow, { paddingTop: 2, paddingBottom: 0 }]}>
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
                onToggle={() => onToggle('step3')}
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
                            <Text style={{ color: theme.colors.userHighlight, fontWeight: '700' }}>YOU</Text> -{' '}
                            <Text style={{ color: theme.colors.userHighlight, fontWeight: '700' }}>
                                {formatPercent2dp(results.incomePercA)}
                            </Text>
                        </Text>

                        <PercentageBar
                            percentA={results.incomePercA}
                            percentB={results.incomePercB}
                        />

                        <Text style={[styles.careHeaderLabel, { textAlign: 'right' }]}>
                            <Text style={{ color: theme.colors.textMuted, fontWeight: '700' }}>OTHER PARENT</Text> -{' '}
                            <Text style={{ color: theme.colors.textMuted, fontWeight: '700' }}>
                                {formatPercent2dp(results.incomePercB)}
                            </Text>
                        </Text>
                    </View>
                </>
            </BreakdownStepCard>
        </>
    );
}

const styles = StyleSheet.create({
    stepExplanation: {
        fontSize: 14,
        color: '#64748b', // Slate 500
        lineHeight: 20,
        marginBottom: 12,
    },

    // Deduction breakdown cards
    deductionCards: {
        gap: 10,
        marginBottom: 8,
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
        marginVertical: 4,
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

    // Income comparison
    incomeComparison: {
        gap: 10,
    },

    // Care header label (reused for income comparison)
    careHeaderLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b', // Slate 500
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
});
