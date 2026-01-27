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
 * Renders one step card per child for multi-child scenarios.
 */
export function CareStep({ results, isExpanded, onToggle, hasDeceasedParent = false }: CareStepProps) {
    const { colors } = useAppTheme();

    const dynamicStyles = useMemo(() => ({
        stepExplanation: { color: colors.textMuted },
        careHeaderLabel: { color: colors.textMuted },
        userHighlight: { color: colors.userHighlight },
        textMuted: { color: colors.textMuted },
    }), [colors]);

    return (
        <>
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
                    tooltip={
                        index === 0
                            ? 'Special rounding rules apply. Regardless of the decimal value, percentages below 50% are rounded down to the nearest whole number with ones above being always rounded up.'
                            : undefined
                    }
                    isExpanded={isExpanded}
                    onToggle={onToggle}
                >
                    <>
                        {index === 0 && (
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
            ))}
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
