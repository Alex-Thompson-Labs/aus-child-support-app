import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { CalculationResults } from '../../utils/calculator';
import { formatCurrency } from '../../utils/formatters';
import { BreakdownStepCard } from '../BreakdownStepCard';
import { COST_PERCENTAGE_TABLE } from './constants';
import { GapAnalysisCard } from './GapAnalysisCard';
import { ParentComparisonCard } from './ParentComparisonCard';

// Helper to format percentage with 2 decimal places
const formatPercent2dp = (num: number): string => {
    return `${num.toFixed(2)}%`;
};

// Helper to format currency with 2 decimal places
const formatCurrency2dp = (num: number): string => {
    return `$${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

interface CostStepProps {
    results: CalculationResults;
    expandedSteps: { step5: boolean; step6: boolean; step7: boolean };
    onToggle: (step: 'step5' | 'step6' | 'step7') => void;
}

/**
 * Cost and liability calculation breakdown - Steps 5-7
 * 
 * Step 5: Cost Percentage (conversion from care percentage)
 * Step 6: Child Support Percentage
 * Step 7: Cost of Children (bracket calculation)
 */
export function CostStep({ results, expandedSteps, onToggle }: CostStepProps) {
    return (
        <>
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
                    tooltip={
                        index === 0 ? (
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
                        ) : undefined
                    }
                    isExpanded={expandedSteps.step5}
                    onToggle={() => onToggle('step5')}
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
                                { marginTop: index === 0 ? 12 : 4, padding: 12 },
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
                    onToggle={() => onToggle('step6')}
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
                                    otherParentHasFixedRate={
                                        child.farAppliedB || child.marAppliedB
                                    }
                                    fixedRateAmount={
                                        child.farAppliedA ? results.FAR : results.MAR
                                    }
                                    formatPercent={formatPercent2dp}
                                    formatCurrency={formatCurrency}
                                    capExplanation={
                                        child.marAppliedA
                                            ? results.marCapExplanationA
                                            : child.farAppliedA
                                                ? results.farCapExplanationA
                                                : undefined
                                    }
                                />
                                <GapAnalysisCard
                                    label="OTHER PARENT"
                                    incomePercent={results.incomePercB}
                                    costPercent={child.costPercB}
                                    csPercent={child.childSupportPercB}
                                    isFarApplied={child.farAppliedB}
                                    isMarApplied={child.marAppliedB}
                                    otherParentHasFixedRate={
                                        child.farAppliedA || child.marAppliedA
                                    }
                                    fixedRateAmount={
                                        child.farAppliedB ? results.FAR : results.MAR
                                    }
                                    formatPercent={formatPercent2dp}
                                    formatCurrency={formatCurrency}
                                    capExplanation={
                                        child.marAppliedB
                                            ? results.marCapExplanationB
                                            : child.farAppliedB
                                                ? results.farCapExplanationB
                                                : undefined
                                    }
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
                onToggle={() => onToggle('step7')}
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
                                    <Text style={styles.bracketTitle}>Base amount</Text>
                                    <Text style={styles.bracketTitle}>
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
                                        <Text style={styles.bracketTitle}>
                                            Cost per child ({results.childResults.length})
                                        </Text>
                                        <Text style={styles.bracketTitle}>
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

    // Combined CS Income label
    combinedCSIncomeLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0f172a',
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
