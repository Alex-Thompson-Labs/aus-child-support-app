import { useAppTheme } from '@/src/theme';
import type { CalculationResults } from '@/src/utils/calculator';
import { formatCurrency } from '@/src/utils/formatters';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BreakdownStepCard } from './BreakdownStepCard';

interface CostOfChildrenStepProps {
    results: CalculationResults;
    isExpanded: boolean;
    onToggle: () => void;
}

/**
 * Step 7: Cost of the Child (COTC)
 * 
 * Shows the total cost of children calculation based on combined income
 * and the cost per child used in the annual rate calculation.
 */
export function CostOfChildrenStep({
    results,
    isExpanded,
    onToggle,
}: CostOfChildrenStepProps) {
    const { colors } = useAppTheme();

    const dynamicStyles = useMemo(() => ({
        stepExplanation: { color: colors.textMuted },
        calculationBox: {
            backgroundColor: colors.surfaceSubtle,
            borderColor: colors.border,
        },
        label: { color: colors.textMuted },
        value: { color: colors.textPrimary },
        divider: { backgroundColor: colors.border },
        totalLabel: { color: colors.textPrimary },
        totalValue: { color: colors.textPrimary },
    }), [colors]);

    // Count assessable children (exclude adult children)
    const assessableChildren = results.childResults.filter(c => !c.isAdultChild);
    const costPerChild = assessableChildren.length > 0 
        ? results.totalCost / assessableChildren.length 
        : 0;

    return (
        <BreakdownStepCard
            stepNumber={7}
            title="COST OF THE CHILD"
            isExpanded={isExpanded}
            onToggle={onToggle}
        >
            <>
                <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
                    The cost of the child is calculated using the Costs of the Children Table,
                    which is based on the combined child support income and the number and ages
                    of the children.
                </Text>

                <View style={[styles.calculationBox, dynamicStyles.calculationBox]}>
                    {/* Income used for calculation */}
                    <View style={styles.row}>
                        <Text style={[styles.label, dynamicStyles.label]}>
                            Combined Child Support Income
                        </Text>
                        <Text style={[styles.value, dynamicStyles.value]}>
                            {formatCurrency(results.CCSI)}
                        </Text>
                    </View>

                    {/* Bracket information if available */}
                    {results.costBracketInfo && (
                        <>
                            <View style={[styles.row, { marginTop: 8 }]}>
                                <Text style={[styles.label, dynamicStyles.label]}>
                                    Income bracket: {formatCurrency(results.costBracketInfo.minIncome)} – {
                                        results.costBracketInfo.maxIncome 
                                            ? formatCurrency(results.costBracketInfo.maxIncome) 
                                            : 'unlimited'
                                    }
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.label, dynamicStyles.label]}>
                                    Base amount
                                </Text>
                                <Text style={[styles.value, dynamicStyles.value]}>
                                    {formatCurrency(results.costBracketInfo.fixed)}
                                </Text>
                            </View>
                            {results.costBracketInfo.rate > 0 && (
                                <View style={styles.row}>
                                    <Text style={[styles.label, dynamicStyles.label]}>
                                        + {(results.costBracketInfo.rate * 100).toFixed(2)}% × {formatCurrency(results.costBracketInfo.incomeInBracket)}
                                    </Text>
                                    <Text style={[styles.value, dynamicStyles.value]}>
                                        +{formatCurrency(results.costBracketInfo.rate * results.costBracketInfo.incomeInBracket)}
                                    </Text>
                                </View>
                            )}
                        </>
                    )}

                    <View style={[styles.divider, dynamicStyles.divider]} />

                    {/* Total cost */}
                    <View style={styles.row}>
                        <Text style={[styles.totalLabel, dynamicStyles.totalLabel]}>
                            Total cost of children
                        </Text>
                        <Text style={[styles.totalValue, dynamicStyles.totalValue]}>
                            {formatCurrency(results.totalCost)}
                        </Text>
                    </View>

                    {/* Cost per child */}
                    {assessableChildren.length > 1 && (
                        <View style={[styles.row, { marginTop: 4 }]}>
                            <Text style={[styles.label, dynamicStyles.label]}>
                                Cost per child ({assessableChildren.length} children)
                            </Text>
                            <Text style={[styles.value, dynamicStyles.value]}>
                                {formatCurrency(costPerChild)}
                            </Text>
                        </View>
                    )}
                </View>
            </>
        </BreakdownStepCard>
    );
}

const styles = StyleSheet.create({
    stepExplanation: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    calculationBox: {
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        marginTop: 4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    label: {
        fontSize: 13,
        flex: 1,
    },
    value: {
        fontSize: 13,
        fontWeight: '500',
        marginLeft: 12,
    },
    divider: {
        height: 1,
        marginVertical: 8,
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: '700',
    },
    totalValue: {
        fontSize: 14,
        fontWeight: '700',
    },
});
