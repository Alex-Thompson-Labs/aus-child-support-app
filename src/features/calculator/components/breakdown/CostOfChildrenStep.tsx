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
    stepNumber?: number; // Optional: defaults to 7 for Formula 3/4
}

/**
 * Step 7: Cost of the Child (COTC)
 * 
 * Shows the cost calculation for each child using the "Same Age" rule.
 * For each child, we calculate the cost assuming ALL children are the same age
 * as that child, then divide by the number of children.
 */
export function CostOfChildrenStep({
    results,
    isExpanded,
    onToggle,
    stepNumber = 7, // Default to 7 for Formula 3/4
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
        ageGroupSection: {
            marginTop: 16,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        ageGroupTitle: {
            fontSize: 14,
            fontWeight: '600' as const,
            color: colors.textPrimary,
            marginBottom: 8,
        },
    }), [colors]);

    // Count assessable children (exclude adult children)
    const assessableChildren = results.childResults.filter(c => !c.isAdultChild);
    
    // Group children by age bracket for display
    const under13Children = assessableChildren.filter(c => c.age < 13);
    const over13Children = assessableChildren.filter(c => c.age >= 13);

    return (
        <BreakdownStepCard
            stepNumber={stepNumber}
            title="COST OF CHILDREN (COTC)"
            isExpanded={isExpanded}
            onToggle={onToggle}
        >
            <>
                <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
                    Calculate the costs for the child (or other and younger children separately) for the day, 
                    calculating the costs for other and younger children separately (section 55HA). This uses 
                    income brackets set by the Department of Social Services.
                </Text>

                <View style={[styles.calculationBox, dynamicStyles.calculationBox]}>
                    {/* Children 13 and under */}
                    {under13Children.length > 0 && under13Children[0].costBracketInfo && (
                        <>
                            <Text style={dynamicStyles.ageGroupTitle}>
                                Children 13 and under
                            </Text>
                            
                            <View style={styles.row}>
                                <Text style={[styles.label, dynamicStyles.label]}>
                                    Combined CS income
                                </Text>
                                <Text style={[styles.value, dynamicStyles.value]}>
                                    {formatCurrency(results.CCSI)}
                                </Text>
                            </View>
                            
                            <View style={styles.row}>
                                <Text style={[styles.label, dynamicStyles.label]}>
                                    Income bracket: {formatCurrency(under13Children[0].costBracketInfo.minIncome)} – {
                                        under13Children[0].costBracketInfo.maxIncome 
                                            ? formatCurrency(under13Children[0].costBracketInfo.maxIncome) 
                                            : 'unlimited'
                                    }
                                </Text>
                            </View>
                            
                            <View style={styles.row}>
                                <Text style={[styles.label, dynamicStyles.label]}>
                                    Base amount
                                </Text>
                                <Text style={[styles.value, dynamicStyles.value]}>
                                    {formatCurrency(under13Children[0].costBracketInfo.fixed)}
                                </Text>
                            </View>
                            
                            {under13Children[0].costBracketInfo.rate > 0 && (
                                <View style={styles.row}>
                                    <Text style={[styles.label, dynamicStyles.label]}>
                                        + {(under13Children[0].costBracketInfo.rate * 100).toFixed(2)}% × {formatCurrency(under13Children[0].costBracketInfo.incomeInBracket)}
                                    </Text>
                                    <Text style={[styles.value, dynamicStyles.value]}>
                                        +{formatCurrency(under13Children[0].costBracketInfo.rate * under13Children[0].costBracketInfo.incomeInBracket)}
                                    </Text>
                                </View>
                            )}
                            
                            <View style={[styles.row, { marginTop: 8 }]}>
                                <Text style={[styles.label, dynamicStyles.label]}>
                                    COTC for all children at this age
                                </Text>
                                <Text style={[styles.value, dynamicStyles.value]}>
                                    {formatCurrency(under13Children[0].totalCostAtAge || 0)}
                                </Text>
                            </View>
                            
                            <View style={styles.row}>
                                <Text style={[styles.label, dynamicStyles.label]}>
                                    • {formatCurrency(under13Children[0].totalCostAtAge || 0)} ÷ {assessableChildren.length}
                                </Text>
                            </View>
                            
                            <View style={styles.row}>
                                <Text style={[styles.totalLabel, dynamicStyles.totalLabel]}>
                                    Cost of the Child
                                </Text>
                                <Text style={[styles.totalValue, dynamicStyles.totalValue]}>
                                    {formatCurrency(under13Children[0].costPerChild)}
                                </Text>
                            </View>
                        </>
                    )}

                    {/* Children over 13 */}
                    {over13Children.length > 0 && over13Children[0].costBracketInfo && (
                        <View style={dynamicStyles.ageGroupSection}>
                            <Text style={dynamicStyles.ageGroupTitle}>
                                Children over 13
                            </Text>
                            
                            <View style={styles.row}>
                                <Text style={[styles.label, dynamicStyles.label]}>
                                    Child support income
                                </Text>
                                <Text style={[styles.value, dynamicStyles.value]}>
                                    {formatCurrency(results.CCSI)}
                                </Text>
                            </View>
                            
                            <View style={styles.row}>
                                <Text style={[styles.label, dynamicStyles.label]}>
                                    Income bracket: {formatCurrency(over13Children[0].costBracketInfo.minIncome)} – {
                                        over13Children[0].costBracketInfo.maxIncome 
                                            ? formatCurrency(over13Children[0].costBracketInfo.maxIncome) 
                                            : 'unlimited'
                                    }
                                </Text>
                            </View>
                            
                            <View style={styles.row}>
                                <Text style={[styles.label, dynamicStyles.label]}>
                                    Base amount
                                </Text>
                                <Text style={[styles.value, dynamicStyles.value]}>
                                    {formatCurrency(over13Children[0].costBracketInfo.fixed)}
                                </Text>
                            </View>
                            
                            {over13Children[0].costBracketInfo.rate > 0 && (
                                <View style={styles.row}>
                                    <Text style={[styles.label, dynamicStyles.label]}>
                                        + {(over13Children[0].costBracketInfo.rate * 100).toFixed(2)}% × {formatCurrency(over13Children[0].costBracketInfo.incomeInBracket)}
                                    </Text>
                                    <Text style={[styles.value, dynamicStyles.value]}>
                                        +{formatCurrency(over13Children[0].costBracketInfo.rate * over13Children[0].costBracketInfo.incomeInBracket)}
                                    </Text>
                                </View>
                            )}
                            
                            <View style={[styles.row, { marginTop: 8 }]}>
                                <Text style={[styles.label, dynamicStyles.label]}>
                                    COTC for all children at this age
                                </Text>
                                <Text style={[styles.value, dynamicStyles.value]}>
                                    {formatCurrency(over13Children[0].totalCostAtAge || 0)}
                                </Text>
                            </View>
                            
                            <View style={styles.row}>
                                <Text style={[styles.label, dynamicStyles.label]}>
                                    • {formatCurrency(over13Children[0].totalCostAtAge || 0)} ÷ {assessableChildren.length}
                                </Text>
                            </View>
                            
                            <View style={styles.row}>
                                <Text style={[styles.totalLabel, dynamicStyles.totalLabel]}>
                                    Cost of the Child
                                </Text>
                                <Text style={[styles.totalValue, dynamicStyles.totalValue]}>
                                    {formatCurrency(over13Children[0].costPerChild)}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Final per-child costs - only show when multiple children */}
                    {assessableChildren.length > 1 && (
                        <View style={dynamicStyles.ageGroupSection}>
                            {assessableChildren.map((child, index) => (
                                <View key={index} style={[styles.row, { marginTop: index > 0 ? 4 : 0 }]}>
                                    <Text style={[styles.label, dynamicStyles.label]}>
                                        Costs for child {index + 1}
                                    </Text>
                                    <Text style={[styles.value, dynamicStyles.value]}>
                                        {formatCurrency(child.costPerChild)}
                                    </Text>
                                </View>
                            ))}
                            
                            {/* Total costs */}
                            <View style={[styles.divider, dynamicStyles.divider, { marginTop: 12, marginBottom: 8 }]} />
                            <View style={styles.row}>
                                <Text style={[styles.totalLabel, dynamicStyles.totalLabel]}>
                                    Total Cost of Children
                                </Text>
                                <Text style={[styles.totalValue, dynamicStyles.totalValue]}>
                                    {formatCurrency(
                                        assessableChildren.reduce((sum, child) => sum + child.costPerChild, 0)
                                    )}
                                </Text>
                            </View>
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
