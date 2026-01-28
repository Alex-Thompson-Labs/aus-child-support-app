import { useAppTheme } from '@/src/theme';
import type { CalculationResults } from '@/src/utils/calculator';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BreakdownStepCard } from './BreakdownStepCard';
import { PercentageBar } from './PercentageBar';

// Helper to format percentage with 2 decimal places
const formatPercent2dp = (num: number): string => {
    return `${num.toFixed(2)}%`;
};

// Helper to group children by identical care percentages
const groupChildrenByCare = (childResults: CalculationResults['childResults']) => {
    const groups: {
        indices: number[];
        careA: number;
        careB: number;
    }[] = [];

    childResults.forEach((child, index) => {
        const existingGroup = groups.find(
            g => g.careA === child.roundedCareA && g.careB === child.roundedCareB
        );
        
        if (existingGroup) {
            existingGroup.indices.push(index);
        } else {
            groups.push({
                indices: [index],
                careA: child.roundedCareA,
                careB: child.roundedCareB,
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

interface CareStepProps {
    results: CalculationResults;
    isExpanded: boolean;
    onToggle: () => void;
    hasDeceasedParent?: boolean;
}

/**
 * Care percentage breakdown - Step 4
 * 
 * Shows the care percentage for each child, comparing Parent A vs Parent B.
 * Groups children with identical care percentages together.
 */
export function CareStep({ results, isExpanded, onToggle, hasDeceasedParent = false }: CareStepProps) {
    const { colors } = useAppTheme();

    const dynamicStyles = useMemo(() => ({
        stepExplanation: { color: colors.textMuted },
        careHeaderLabel: { color: colors.textMuted },
        userHighlight: { color: colors.userHighlight },
        textMuted: { color: colors.textMuted },
    }), [colors]);

    const careGroups = useMemo(() => groupChildrenByCare(results.childResults), [results.childResults]);

    return (
        <>
            {careGroups.map((group, groupIndex) => {
                const child = results.childResults[group.indices[0]];
                const isMultiChild = results.childResults.length > 1;
                const hasMultipleGroups = careGroups.length > 1;
                
                return (
                    <BreakdownStepCard
                        key={groupIndex}
                        stepNumber={`4${hasMultipleGroups
                            ? String.fromCharCode(97 + groupIndex)
                            : ''
                            }`}
                        title={`CARE PERCENTAGE${isMultiChild ? ` - ${formatChildIndices(group.indices)}` : ''
                            }`}
                        description={
                            isMultiChild && group.indices.length > 1
                                ? `for ${formatChildIndices(group.indices)}`
                                : isMultiChild
                                    ? `for Child ${group.indices[0] + 1}`
                                    : undefined
                        }
                        tooltip={
                            groupIndex === 0
                                ? 'Special rounding rules apply. Regardless of the decimal value, percentages below 50% are rounded down to the nearest whole number with ones above being always rounded up.'
                                : undefined
                        }
                        isExpanded={isExpanded}
                        onToggle={onToggle}
                    >
                        <>
                            {groupIndex === 0 && (
                                <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation, { lineHeight: 22 }]}>
                                    The number of nights each parent cares for the child over a year
                                    is converted into a care percentage.
                                </Text>
                            )}

                            {!hasDeceasedParent ? (
                                <View style={styles.careComparison}>
                                    <Text style={[styles.careHeaderLabel, dynamicStyles.careHeaderLabel]}>
                                        <Text style={[dynamicStyles.userHighlight, { fontWeight: '700' }]}>YOU</Text> -{' '}
                                        <Text style={[dynamicStyles.userHighlight, { fontWeight: '700' }]}>
                                            {formatPercent2dp(child.roundedCareA)}
                                        </Text>
                                    </Text>

                                    <PercentageBar
                                        percentA={child.roundedCareA}
                                        percentB={child.roundedCareB}
                                    />

                                    <Text style={[styles.careHeaderLabel, dynamicStyles.careHeaderLabel, { textAlign: 'right' }]}>
                                        <Text style={[dynamicStyles.textMuted, { fontWeight: '700' }]}>OTHER PARENT</Text> -{' '}
                                        <Text style={[dynamicStyles.textMuted, { fontWeight: '700' }]}>
                                            {formatPercent2dp(child.roundedCareB)}
                                        </Text>
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.careComparison}>
                                    <Text style={[styles.careHeaderLabel, dynamicStyles.careHeaderLabel]}>
                                        <Text style={[dynamicStyles.userHighlight, { fontWeight: '700' }]}>YOU</Text> -{' '}
                                        <Text style={[dynamicStyles.userHighlight, { fontWeight: '700' }]}>
                                            {formatPercent2dp(child.roundedCareA)}
                                        </Text>
                                    </Text>
                                </View>
                            )}
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

    // Care comparison
    careComparison: {
        gap: 10,
    },
    careHeaderLabel: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
});
