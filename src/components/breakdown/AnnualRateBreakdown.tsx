import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';
import type { CalculationResults } from '../../utils/calculator';
import { formatCurrency } from '../../utils/formatters';
import {
    detectLowAssessmentTrigger,
    isFarLimitReached,
} from '../../utils/zero-payment-detection';

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
        const payingParentColor = theme.colors.textMuted;
        const totalMarAmount = results.finalPaymentAmount;

        // Use comprehensive detection for low assessment warning
        const { isLowAssessment } = detectLowAssessmentTrigger(results, formState);

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
                {isLowAssessment && (
                    <View style={styles.warningAlert}>
                        <Text style={styles.warningTitle}>
                            ⚠️ Standard Formula Limit Detected
                        </Text>
                        <Text style={styles.warningText}>
                            This result is based on a default minimum or fixed rate. If
                            the paying parent has lifestyle assets or hidden income, this
                            figure may be incorrect.
                        </Text>
                    </View>
                )}
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

        // Check if low assessment trigger applies (edge case: MAR/FAR negated by care)
        const { isLowAssessment } = detectLowAssessmentTrigger(results, formState);

        return (
            <View style={styles.perChildGapBreakdown}>
                <View style={styles.perChildGapRow}>
                    <Text style={styles.perChildGapLabel}>
                        All children -{' '}
                        <Text style={{ color: theme.colors.textMuted }}>{displayText}</Text>
                    </Text>
                    <Text style={[styles.perChildGapValue, { color: theme.colors.textMuted }]}>
                        $0
                    </Text>
                </View>
                {isLowAssessment && (
                    <View style={styles.warningAlert}>
                        <Text style={styles.warningTitle}>
                            ⚠️ Standard Formula Limit Detected
                        </Text>
                        <Text style={styles.warningText}>
                            The other parent has low income that would trigger a minimum
                            or fixed rate, but care arrangements have reduced their
                            liability to $0. Hidden income or assets may mean this
                            figure is incorrect.
                        </Text>
                    </View>
                )}
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
                                <Text style={{ color: theme.colors.textMuted }}>{displayText}</Text>
                            </Text>
                            <Text style={[styles.perChildGapValue, { color: theme.colors.textMuted }]}>
                                $0
                            </Text>
                        </View>
                    );
                }

                // Determine color and values based on who actually pays (use final liability as source of truth)
                const showForParentA = parentAOwesForChild;
                // Use user highlight color when "You" (Parent A) is the payer
                const payingParentColor = showForParentA ? theme.colors.userHighlight : theme.colors.textMuted;
                const farApplied = showForParentA
                    ? child.farAppliedA
                    : child.farAppliedB;
                const gapPercentage = showForParentA
                    ? Math.max(0, child.childSupportPercA)
                    : Math.max(0, child.childSupportPercB);
                const liability = showForParentA
                    ? child.finalLiabilityA
                    : child.finalLiabilityB;

                // Check if multi-case cap was applied
                const multiCaseCapApplied = showForParentA
                    ? child.multiCaseCapAppliedA
                    : child.multiCaseCapAppliedB;
                const multiCaseCap = showForParentA
                    ? child.multiCaseCapA
                    : child.multiCaseCapB;

                return (
                    <View key={index}>
                        <View style={styles.perChildGapRow}>
                            <Text style={[styles.perChildGapLabel, { fontWeight: '700' }, showForParentA && { color: theme.colors.userHighlight }]}>
                                {farApplied ? (
                                    <>
                                        Child {index + 1} -{' '}
                                        <Text style={{ color: payingParentColor, fontWeight: '700' }}>
                                            Fixed annual rate
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        Child {index + 1} -{' '}
                                        <Text style={{ color: payingParentColor, fontWeight: '700' }}>
                                            ({formatPercent2dp(gapPercentage)})
                                        </Text>{' '}
                                        × {formatCurrency2dp(child.costPerChild)}
                                    </>
                                )}
                            </Text>
                            <Text
                                style={[styles.perChildGapValue, { color: payingParentColor, fontWeight: '700' }]}
                            >
                                {formatCurrency2dp(liability)}
                            </Text>
                        </View>
                        {multiCaseCapApplied && multiCaseCap !== undefined && (
                            <View style={styles.multiCaseCapNote}>
                                <Text style={styles.multiCaseCapText}>
                                    Multi-case cap applied (capped at {formatCurrency2dp(multiCaseCap)})
                                </Text>
                            </View>
                        )}
                    </View>
                );
            })}

            {/* Warning for FAR/MAR when user is receiver (including edge cases) */}
            {(() => {
                // Use comprehensive detection for low assessment trigger
                const { isLowAssessment } = detectLowAssessmentTrigger(results, formState);
                if (isLowAssessment) {
                    return (
                        <View style={styles.warningAlert}>
                            <Text style={styles.warningTitle}>
                                ⚠️ Standard Formula Limit Detected
                            </Text>
                            <Text style={styles.warningText}>
                                This result is based on a default minimum or fixed rate.
                                If the paying parent has lifestyle assets or hidden
                                income, this figure may be incorrect.
                            </Text>
                        </View>
                    );
                }
                return null;
            })()}
            <View style={styles.perChildGapDivider} />

            {/* Total Annual Liability */}
            <View style={styles.perChildGapRow}>
                <Text style={[styles.perChildGapLabel, { fontWeight: '600', color: '#0f172a' }]}>
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

            {/* Non-parent Carer Payment */}
            {results.paymentToNPC !== undefined && results.paymentToNPC > 0 && (
                <>
                    <View style={styles.npcPaymentDivider} />
                    <View style={styles.npcPaymentSection}>
                        <Text style={styles.npcPaymentTitle}>
                            Non-Parent Carer Payment
                        </Text>
                        <Text style={styles.npcPaymentExplanation}>
                            Both parents owe child support to the non-parent carer based on their care percentage.
                        </Text>
                        <View style={styles.perChildGapRow}>
                            <Text style={styles.npcPaymentLabel}>
                                Total to non-parent carer
                            </Text>
                            <Text style={styles.npcPaymentValue}>
                                {formatCurrency2dp(results.paymentToNPC)}
                            </Text>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    perChildGapBreakdown: {
        backgroundColor: theme.colors.surfaceSubtle,
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    perChildGapRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    perChildGapLabel: {
        fontSize: 13,
        color: theme.colors.textMuted,
    },
    perChildGapValue: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    perChildGapDivider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginTop: 4,
    },
    warningAlert: {
        backgroundColor: '#fef3c7', // Amber-100
        borderWidth: 1,
        borderColor: '#fbbf24', // Amber-400 (softer golden yellow)
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    warningTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#92400e', // Amber-800
        marginBottom: 4,
    },
    warningText: {
        fontSize: 12,
        color: '#78350f', // Amber-900
        lineHeight: 18,
    },
    multiCaseCapNote: {
        marginTop: 4,
        marginLeft: 8,
        paddingLeft: 8,
        borderLeftWidth: 2,
        borderLeftColor: '#a78bfa', // Violet-400
    },
    multiCaseCapText: {
        fontSize: 11,
        color: '#7c3aed', // Violet-600
        fontStyle: 'italic',
    },
    npcPaymentDivider: {
        height: 1,
        backgroundColor: '#c4b5fd', // Violet-300
        marginTop: 12,
        marginBottom: 8,
    },
    npcPaymentSection: {
        backgroundColor: '#f5f3ff', // Violet-50
        borderRadius: 6,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd6fe', // Violet-200
    },
    npcPaymentTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#5b21b6', // Violet-800
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    npcPaymentExplanation: {
        fontSize: 11,
        color: '#6d28d9', // Violet-700
        marginBottom: 8,
        lineHeight: 16,
    },
    npcPaymentLabel: {
        fontSize: 13,
        color: '#5b21b6', // Violet-800
        fontWeight: '500',
    },
    npcPaymentValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#5b21b6', // Violet-800
    },
});

