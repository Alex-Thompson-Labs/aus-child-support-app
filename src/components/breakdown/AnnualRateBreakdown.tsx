import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { CalculationResults } from '../../utils/calculator';
import { formatCurrency } from '../../utils/formatters';
import { isFarLimitReached } from '../../utils/zero-payment-detection';

export interface AnnualRateBreakdownProps {
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

export function AnnualRateBreakdown({
    results,
    formState,
}: AnnualRateBreakdownProps) {
    if (results.childResults.length === 0) return null;

    // Check if MAR is applied to any child
    const hasMarA = results.childResults.some((c) => c.marAppliedA);
    const hasMarB = results.childResults.some((c) => c.marAppliedB);
    const hasAnyMar = hasMarA || hasMarB;

    // If MAR is applied, show a single consolidated line
    if (hasAnyMar) {
        const payingParentColor = '#475569'; // slate-600 - neutral for all parents
        const totalMarAmount = results.finalPaymentAmount;

        return (
            <View style={styles.perChildGapBreakdown}>
                <View style={styles.perChildGapRow}>
                    <Text style={styles.perChildGapLabel}>
                        All children -{' '}
                        <Text style={{ color: payingParentColor }}>
                            Minimum annual rate
                        </Text>
                    </Text>
                    <Text
                        style={[styles.perChildGapValue, { color: payingParentColor }]}
                    >
                        {formatCurrency(totalMarAmount)}
                    </Text>
                </View>
                <View style={styles.perChildGapDivider} />
            </View>
        );
    }

    // Check if all children have no payment required
    const allChildrenNoPayment = results.childResults.every(
        (child) => child.finalLiabilityA === 0 && child.finalLiabilityB === 0
    );

    // If all children have no payment, show consolidated line
    if (allChildrenNoPayment) {
        // Check if any child is due to FAR limit being reached
        const hasFarLimit = results.childResults.some((child, index) =>
            isFarLimitReached(index, results, formState)
        );
        const displayText = hasFarLimit
            ? 'FAR limit reached'
            : 'No payment required';

        return (
            <View style={styles.perChildGapBreakdown}>
                <View style={styles.perChildGapRow}>
                    <Text style={styles.perChildGapLabel}>
                        All children -{' '}
                        <Text style={{ color: '#64748b' }}>{displayText}</Text>
                    </Text>
                    <Text style={[styles.perChildGapValue, { color: '#64748b' }]}>
                        $0
                    </Text>
                </View>
                <View style={styles.perChildGapDivider} />
            </View>
        );
    }

    // Otherwise, show per-child breakdown (original logic)
    return (
        <View style={styles.perChildGapBreakdown}>
            {results.childResults.map((child, index) => {
                // Determine which parent is paying for this child based on final liabilities
                // When FAR/MAR is applied, the liability will be non-zero for the paying parent
                const parentAOwesForChild = child.finalLiabilityA > 0;
                const parentBOwesForChild = child.finalLiabilityB > 0;

                // If neither parent owes, show "No payment" explanation
                if (!parentAOwesForChild && !parentBOwesForChild) {
                    // Check if this is due to FAR limit being reached
                    const isFarLimit = isFarLimitReached(index, results, formState);
                    const displayText = isFarLimit
                        ? 'FAR limit reached'
                        : 'No payment required';

                    return (
                        <View key={index} style={styles.perChildGapRow}>
                            <Text style={styles.perChildGapLabel}>
                                Child {index + 1} -{' '}
                                <Text style={{ color: '#64748b' }}>{displayText}</Text>
                            </Text>
                            <Text style={[styles.perChildGapValue, { color: '#64748b' }]}>
                                $0
                            </Text>
                        </View>
                    );
                }

                // Determine color and values based on who actually pays (use final liability as source of truth)
                const showForParentA = parentAOwesForChild;
                const payingParentColor = '#475569'; // slate-600 - neutral for all parents
                const farApplied = showForParentA
                    ? child.farAppliedA
                    : child.farAppliedB;
                const gapPercentage = showForParentA
                    ? Math.max(0, child.childSupportPercA)
                    : Math.max(0, child.childSupportPercB);
                const liability = showForParentA
                    ? child.finalLiabilityA
                    : child.finalLiabilityB;

                return (
                    <View key={index} style={styles.perChildGapRow}>
                        <Text style={styles.perChildGapLabel}>
                            {farApplied ? (
                                <>
                                    Child {index + 1} -{' '}
                                    <Text style={{ color: payingParentColor }}>
                                        Fixed annual rate
                                    </Text>
                                </>
                            ) : (
                                <>
                                    Child {index + 1} -{' '}
                                    <Text style={{ color: payingParentColor }}>
                                        ({formatPercent2dp(gapPercentage)})
                                    </Text>{' '}
                                    × {formatCurrency2dp(child.costPerChild)}
                                </>
                            )}
                        </Text>
                        <Text
                            style={[styles.perChildGapValue, { color: payingParentColor }]}
                        >
                            {formatCurrency2dp(liability)}
                        </Text>
                    </View>
                );
            })}
            <View style={styles.perChildGapDivider} />

            {/* Total Annual Liability */}
            <View style={styles.perChildGapRow}>
                <Text style={[styles.perChildGapLabel, { fontWeight: '700' }]}>
                    Total Annual Liability
                </Text>
                <Text
                    style={[
                        styles.perChildGapValue,
                        { fontWeight: '700', fontSize: 18 },
                    ]}
                >
                    {formatCurrency2dp(results.finalPaymentAmount)}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    perChildGapBreakdown: {
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    perChildGapRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    perChildGapLabel: {
        fontSize: 13,
        color: '#64748b',
    },
    perChildGapValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    perChildGapDivider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginTop: 4,
    },
});
