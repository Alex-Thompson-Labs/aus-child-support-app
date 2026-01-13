import { useAppTheme } from '@/src/theme';
import type { CalculationResults } from '@/src/utils/calculator';
import { detectZeroPaymentScenario } from '@/src/utils/zero-payment-detection';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ZeroPaymentScenarioProps {
    results: CalculationResults;
    formState: { supportA: boolean; supportB: boolean };
}

/**
 * Displays an explanation when a child has a $0 payment result.
 * Only renders when any child has both parents with zero final liability.
 */
export function ZeroPaymentScenario({
    results,
    formState,
}: ZeroPaymentScenarioProps) {
    const { colors } = useAppTheme();

    const dynamicStyles = useMemo(() => ({
        text: { color: colors.textMuted },
    }), [colors]);

    // Check if any child has zero payment from both parents
    const hasZeroPaymentChild = results.childResults.some(
        (child) => child.finalLiabilityA === 0 && child.finalLiabilityB === 0
    );

    if (!hasZeroPaymentChild) {
        return null;
    }

    const scenario = detectZeroPaymentScenario(results, formState);

    if (scenario.type === 'none') {
        return null;
    }

    return (
        <View style={[styles.specialNotice, { borderLeftColor: colors.textMuted }]}>
            <Text style={[styles.specialNoticeTitle, { color: colors.textMuted }]}>
                ℹ️ {scenario.title}
            </Text>
            <View style={styles.specialNoticeContent}>
                <Text style={[styles.specialNoticeText, dynamicStyles.text]}>{scenario.explanation}</Text>
                {scenario.details?.parentADetails && (
                    <Text style={[styles.specialNoticeText, dynamicStyles.text, { marginTop: 8 }]}>
                        • Parent A: {scenario.details.parentADetails}
                    </Text>
                )}
                {scenario.details?.parentBDetails && (
                    <Text style={[styles.specialNoticeText, dynamicStyles.text, { marginTop: 4 }]}>
                        • Parent B: {scenario.details.parentBDetails}
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    specialNotice: {
        backgroundColor: '#f0f9ff',
        borderRadius: 8,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#0ea5e9',
        borderWidth: 1,
        borderColor: '#bae6fd',
    },
    specialNoticeContent: {
        marginTop: 12,
    },
    specialNoticeTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0369a1',
        flex: 1,
    },
    specialNoticeText: {
        fontSize: 13,
        lineHeight: 18,
    },
});
