import { useAppTheme } from '@/src/theme';
import type { CalculationResults } from '@/src/utils/calculator';
import { formatCurrency } from '@/src/utils/formatters';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BreakdownStepCard } from './BreakdownStepCard';
import { COST_PERCENTAGE_TABLE } from './constants';
import { GapAnalysisCard } from './GapAnalysisCard';
import { ParentComparisonCard } from './ParentComparisonCard';

// Helper to format percentage with 2 decimal places
const formatPercent2dp = (num: number): string => {
    return `${num.toFixed(2)}%`;
};

// Helper to group children by identical cost percentages
const groupChildrenByCost = (childResults: CalculationResults['childResults']) => {
    const groups: {
        indices: number[];
        costPercA: number;
        costPercB: number;
    }[] = [];

    childResults.forEach((child, index) => {
        const existingGroup = groups.find(
            g => g.costPercA === child.costPercA && g.costPercB === child.costPercB
        );
        
        if (existingGroup) {
            existingGroup.indices.push(index);
        } else {
            groups.push({
                indices: [index],
                costPercA: child.costPercA,
                costPercB: child.costPercB,
            });
        }
    });

    return groups;
};

// Helper to group children by identical child support percentages
const groupChildrenByCS = (childResults: CalculationResults['childResults']) => {
    const groups: {
        indices: number[];
        csPercA: number;
        csPercB: number;
    }[] = [];

    childResults.forEach((child, index) => {
        const existingGroup = groups.find(
            g => g.csPercA === child.childSupportPercA && g.csPercB === child.childSupportPercB
        );
        
        if (existingGroup) {
            existingGroup.indices.push(index);
        } else {
            groups.push({
                indices: [index],
                csPercA: child.childSupportPercA,
                csPercB: child.childSupportPercB,
            });
        }
    });

    return groups;
};

// Helper to format child indices for display
const formatChildIndices = (indices: number[]): string => {
    if (indices.length === 1) return `CHILD ${indices[0] + 1}`;
    if (indices.length === 2) return `CHILD ${indices[0] + 1} AND ${indices[1] + 1}`;
    
    const lastIndex = indices[indices.length - 1];
    const otherIndices = indices.slice(0, -1);
    return `CHILD ${otherIndices.map(i => i + 1).join(', ')} AND ${lastIndex + 1}`;
};

interface CostStepProps {
    results: CalculationResults;
    expandedSteps: { step5: boolean; step6: boolean };
    onToggle: (step: 'step5' | 'step6') => void;
    hasDeceasedParent?: boolean;
}

/**
 * Cost and child support percentage calculation - Steps 5-6
 * 
 * Step 5: Cost Percentage (conversion from care percentage)
 * Step 6: Child Support Percentage (income % - cost %)
 */
export function CostStep({ results, expandedSteps, onToggle, hasDeceasedParent = false }: CostStepProps) {
    const { colors } = useAppTheme();

    const dynamicStyles = useMemo(() => ({
        stepExplanation: { color: colors.textMuted },
        careConversion: {
            backgroundColor: colors.surfaceSubtle,
            borderColor: colors.border,
        },
        gapCalculation: {
            backgroundColor: colors.surfaceSubtle,
            borderColor: colors.border,
        },
        bracketCalculation: {
            backgroundColor: colors.surfaceSubtle,
            borderColor: colors.border,
        },
        combinedCSIncomeLabel: { color: colors.textPrimary },
        bracketTitle: { color: colors.textMuted },
        bracketLabel: { color: colors.textMuted },
        bracketValue: { color: colors.textPrimary },
        bracketDivider: { backgroundColor: colors.border },
        bracketTotalLabel: { color: colors.textPrimary },
        bracketTotalValue: { color: colors.textPrimary },
        // Tooltip colors
        tooltipTitle: { color: colors.textPrimary },
        tooltipText: { color: colors.textPrimary },
        tooltipHighlight: { color: colors.userHighlight },
        tooltipBorder: { borderBottomColor: colors.border },
    }), [colors]);

    const costGroups = useMemo(() => groupChildrenByCost(results.childResults), [results.childResults]);
    const csGroups = useMemo(() => groupChildrenByCS(results.childResults), [results.childResults]);

    return (
        <>
            {/* Step 5: Cost Percentage - Grouped by identical values */}
            {costGroups.map((group, groupIndex) => {
                const child = results.childResults[group.indices[0]];
                const isMultiChild = results.childResults.length > 1;
                const hasMultipleGroups = costGroups.length > 1;
                
                return (
                    <BreakdownStepCard
                        key={groupIndex}
                        stepNumber={`5${hasMultipleGroups
                            ? String.fromCharCode(97 + groupIndex)
                            : ''
                            }`}
                        title={`COST PERCENTAGE${isMultiChild ? ` - ${formatChildIndices(group.indices)}` : ''
                            }`}
                        description={
                            isMultiChild && group.indices.length > 1
                                ? `for ${formatChildIndices(group.indices)}`
                                : isMultiChild
                                    ? `for Child ${group.indices[0] + 1}`
                                    : undefined
                        }
                        tooltip={
                            groupIndex === 0 ? (
                            <View style={{ paddingVertical: 8 }}>
                                <Text
                                    style={[{
                                        fontSize: 13,
                                        fontWeight: '600',
                                        marginBottom: 12,
                                        textAlign: 'center',
                                    }, dynamicStyles.tooltipTitle]}
                                >
                                    Care Percentage → Cost Percentage
                                </Text>

                                <View style={{ gap: 10 }}>
                                    {COST_PERCENTAGE_TABLE.map((row, idx) => (
                                        <View
                                            key={idx}
                                            style={[{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                paddingTop: 2,
                                                paddingBottom: 8,
                                                borderBottomWidth: 1,
                                            }, dynamicStyles.tooltipBorder]}
                                        >
                                            <Text style={[{ fontSize: 13, flex: 1, lineHeight: 16 }, dynamicStyles.tooltipText]}>
                                                {row.careRange}
                                            </Text>
                                            <Text
                                                style={[{
                                                    fontSize: 13,
                                                    fontWeight: '600',
                                                    flex: 1,
                                                    textAlign: 'right',
                                                    lineHeight: 16,
                                                }, dynamicStyles.tooltipHighlight]}
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
                            {groupIndex === 0 && (
                                <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation, { lineHeight: 22 }]}>
                                    The care percentage is converted via a formula into a cost
                                    percentage. This figure reflects the share of the childs living
                                    costs that the parent covers directly while providing care.
                                </Text>
                            )}

                            {/* Care to Cost conversion */}
                            <View
                                style={[
                                    styles.careConversion,
                                    dynamicStyles.careConversion,
                                    { marginTop: groupIndex === 0 ? 12 : 4, padding: 12 },
                                ]}
                            >
                                <View style={styles.conversionCards}>
                                    <ParentComparisonCard
                                        title="YOU"
                                        isUserHighlighted
                                        careValue={formatPercent2dp(child.roundedCareA)}
                                        costValue={formatPercent2dp(child.costPercA)}
                                    />
                                    {!hasDeceasedParent && (
                                        <ParentComparisonCard
                                            title="OTHER PARENT"
                                            careValue={formatPercent2dp(child.roundedCareB)}
                                            costValue={formatPercent2dp(child.costPercB)}
                                        />
                                    )}
                                </View>
                            </View>
                        </>
                    </BreakdownStepCard>
                );
            })}

            {/* Step 6: Child Support Percentage - Grouped by identical values */}
            {csGroups.map((group, groupIndex) => {
                const child = results.childResults[group.indices[0]];
                const isMultiChild = results.childResults.length > 1;
                const hasMultipleGroups = csGroups.length > 1;
                
                return (
                    <BreakdownStepCard
                        key={groupIndex}
                        stepNumber={`6${hasMultipleGroups
                            ? String.fromCharCode(97 + groupIndex)
                            : ''
                            }`}
                        title={`Child Support Percentage${isMultiChild ? ` - ${formatChildIndices(group.indices)}` : ''
                            }`}
                        description={
                            isMultiChild && group.indices.length > 1
                                ? `for ${formatChildIndices(group.indices)}`
                                : isMultiChild
                                    ? `for Child ${group.indices[0] + 1}`
                                    : undefined
                        }
                        isExpanded={expandedSteps.step6}
                        onToggle={() => onToggle('step6')}
                    >
                        <>
                            {groupIndex === 0 && (
                                <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
                                    A parent must pay child support when their share of income is
                                    higher than their share of costs. The difference between these
                                    two shares is called the child support percentage, which is then
                                    used in the formula to calculate the child support amount.
                                </Text>
                            )}

                            <View style={[styles.gapCalculation, dynamicStyles.gapCalculation]}>
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
                                        simplifiedView={hasDeceasedParent}
                                    />
                                    {!hasDeceasedParent && (
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
                                    )}
                                </View>
                            </View>
                        </>
                    </BreakdownStepCard>
                );
            })}
        </>
    );
}

const styles = StyleSheet.create({
    stepExplanation: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },

    // Combined CS Income label
    combinedCSIncomeLabel: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },

    // Care to Cost conversion
    careConversion: {
        marginTop: 8,
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
    },
    conversionCards: {
        flexDirection: 'row',
        gap: 10,
    },

    // Gap calculation (THE KEY INSIGHT)
    gapCalculation: {
        borderRadius: 8,
        padding: 16,
        gap: 8,
        borderWidth: 1,
    },
    gapCards: {
        flexDirection: 'row',
        gap: 10,
    },

    // Bracket calculation
    bracketCalculation: {
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
    },
    bracketTitle: {
        fontSize: 12,
        fontWeight: '600',
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
    },
    bracketValue: {
        fontSize: 13,
        fontWeight: '500',
    },
    bracketDivider: {
        height: 1,
        marginVertical: 4,
    },
    bracketTotalLabel: {
        fontSize: 13,
        fontWeight: '600',
    },
    bracketTotalValue: {
        fontSize: 16,
        fontWeight: '700',
    },
});
