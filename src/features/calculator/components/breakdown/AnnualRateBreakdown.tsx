import { useAppTheme } from '@/src/theme';
import type { CalculationResults } from '@/src/utils/calculator';
import { formatCurrency } from '@/src/utils/formatters';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
    detectLowAssessmentTrigger,
    isFarLimitReached,
} from '../../../../utils/zero-payment-detection';
import { AdultChildMaintenanceCard } from '../results/AdultChildMaintenanceCard';
import { Turning18Banner } from '../results/Turning18Banner';

export interface AnnualRateBreakdownProps {
    results: CalculationResults;
    formState: { supportA: boolean; supportB: boolean };
    hasDeceasedParent?: boolean;
}

// Helper to format percentage with 2 decimal places
const formatPercent2dp = (num: number): string => {
    return `${num.toFixed(2)}%`;
};

export function AnnualRateBreakdown({
    results,
    formState,
    hasDeceasedParent = false,
}: AnnualRateBreakdownProps) {
    const { colors } = useAppTheme();

    const dynamicStyles = useMemo(() => ({
        container: {
            backgroundColor: colors.surfaceSubtle,
            borderColor: colors.border,
        },
        label: { color: colors.textMuted },
        value: { color: colors.textSecondary },
        divider: { backgroundColor: colors.border },
        userHighlight: { color: colors.userHighlight },
        textMuted: { color: colors.textMuted },
        textPrimary: { color: colors.textPrimary },
    }), [colors]);

    if (results.childResults.length === 0) return null;

    // Check if MAR is applied to any child
    const hasMarA = results.childResults.some((c) => c.marAppliedA);
    const hasMarB = results.childResults.some((c) => c.marAppliedB);
    const hasAnyMar = hasMarA || hasMarB;

    // If MAR is applied, show a single consolidated line (only if NO NPC payment involved)
    if (hasAnyMar && (results.paymentToNPC ?? 0) === 0) {
        const totalMarAmount = results.finalPaymentAmount;
        const { isLowAssessment } = detectLowAssessmentTrigger(results, formState);
        const adultChildren = results.childResults.filter((c) => c.isAdultChild);
        const childrenTurning18 = results.childResults.filter((c) => c.isTurning18);

        return (
            <View style={[styles.perChildGapBreakdown, dynamicStyles.container]}>
                {adultChildren.map((child) => {
                    const originalIndex = results.childResults.findIndex((c) => c === child);
                    return (
                        <AdultChildMaintenanceCard
                            key={`adult-${originalIndex}`}
                            childIndex={originalIndex}
                            childAge={child.age}
                        />
                    );
                })}
                <View style={styles.perChildGapRow}>
                    <Text style={[styles.perChildGapLabel, dynamicStyles.label]}>
                        All children - <Text style={dynamicStyles.textMuted}>Minimum annual rate</Text>
                    </Text>
                    <Text style={[styles.perChildGapValue, dynamicStyles.textMuted]}>
                        {formatCurrency(totalMarAmount)}
                    </Text>
                </View>
                {childrenTurning18.map((child) => {
                    const originalIndex = results.childResults.findIndex((c) => c === child);
                    return <Turning18Banner key={`turn18-${originalIndex}`} childIndex={originalIndex} />;
                })}
                {isLowAssessment && (
                    <View style={styles.warningAlert}>
                        <Text style={styles.warningTitle}>⚠️ Standard Formula Limit Detected</Text>
                        <Text style={styles.warningText}>
                            This result is based on a default minimum or fixed rate. If the paying parent has lifestyle assets or hidden income, this figure may be incorrect.
                        </Text>
                    </View>
                )}
                <View style={[styles.perChildGapDivider, dynamicStyles.divider]} />
            </View>
        );
    }

    const allChildrenNoPayment = results.childResults.every(
        (child) =>
            child.finalLiabilityA === 0 &&
            child.finalLiabilityB === 0 &&
            (child.liabilityToNPC_A ?? 0) === 0 &&
            (child.liabilityToNPC_B ?? 0) === 0
    );

    if (allChildrenNoPayment) {
        const hasFarLimit = results.childResults.some((child, index) =>
            isFarLimitReached(index, results, formState)
        );
        const displayText = hasFarLimit ? 'FAR limit reached' : 'No payment required';
        const { isLowAssessment } = detectLowAssessmentTrigger(results, formState);
        const adultChildren = results.childResults.filter((c) => c.isAdultChild);
        const childrenTurning18 = results.childResults.filter((c) => c.isTurning18);

        return (
            <View style={[styles.perChildGapBreakdown, dynamicStyles.container]}>
                {adultChildren.map((child) => {
                    const originalIndex = results.childResults.findIndex((c) => c === child);
                    return (
                        <AdultChildMaintenanceCard
                            key={`adult-${originalIndex}`}
                            childIndex={originalIndex}
                            childAge={child.age}
                        />
                    );
                })}
                <View style={styles.perChildGapRow}>
                    <Text style={[styles.perChildGapLabel, dynamicStyles.label]}>
                        All children - <Text style={dynamicStyles.textMuted}>{displayText}</Text>
                    </Text>
                    <Text style={[styles.perChildGapValue, dynamicStyles.textMuted]}>$0</Text>
                </View>
                {childrenTurning18.map((child) => {
                    const originalIndex = results.childResults.findIndex((c) => c === child);
                    return <Turning18Banner key={`turn18-${originalIndex}`} childIndex={originalIndex} />;
                })}
                {isLowAssessment && (
                    <View style={styles.warningAlert}>
                        <Text style={styles.warningTitle}>⚠️ Standard Formula Limit Detected</Text>
                        <Text style={styles.warningText}>
                            The other parent has low income that would trigger a minimum or fixed rate, but care arrangements have reduced their liability to $0. Hidden income or assets may mean this figure is incorrect.
                        </Text>
                    </View>
                )}
                <View style={[styles.perChildGapDivider, dynamicStyles.divider]} />
            </View>
        );
    }

    const isOnlyNPCPayment = results.finalPaymentAmount === 0 && (results.paymentToNPC ?? 0) > 0;

    if (isOnlyNPCPayment) {
        const adultChildren = results.childResults.filter((c) => c.isAdultChild);
        const childrenTurning18 = results.childResults.filter((c) => c.isTurning18);
        const { isLowAssessment } = detectLowAssessmentTrigger(results, formState);

        return (
            <View style={[styles.perChildGapBreakdown, dynamicStyles.container]}>
                {adultChildren.map((child) => {
                    const originalIndex = results.childResults.findIndex((c) => c === child);
                    return <AdultChildMaintenanceCard key={`adult-${originalIndex}`} childIndex={originalIndex} childAge={child.age} />;
                })}
                {childrenTurning18.map((child) => {
                    const originalIndex = results.childResults.findIndex((c) => c === child);
                    return <Turning18Banner key={`turn18-${originalIndex}`} childIndex={originalIndex} />;
                })}
                {isLowAssessment && (
                    <View style={styles.warningAlert}>
                        <Text style={styles.warningTitle}>⚠️ Standard Formula Limit Detected</Text>
                        <Text style={styles.warningText}>
                            This result is based on a default minimum or fixed rate. If the paying parent has lifestyle assets or hidden income, this figure may be incorrect.
                        </Text>
                    </View>
                )}
                <View style={[styles.npcPaymentSection, { marginTop: 0 }]}>
                    <Text style={styles.npcPaymentTitle}>Non-Parent Carer Payment</Text>
                    <Text style={styles.npcPaymentExplanation}>
                        {results.payerRole === 'both_paying'
                            ? 'Both parents owe child support to the non-parent carer based on their care percentage.'
                            : results.payerRole === 'paying_parent'
                                ? 'You owe child support to the non-parent carer based on your care percentage.'
                                : results.payerRole === 'receiving_parent'
                                    ? 'The other parent owes child support to the non-parent carer based on their care percentage.'
                                    : 'Child support is owed to the non-parent carer.'}
                    </Text>
                    {results.childResults.map((child, index) => {
                        const liabilityA = child.liabilityToNPC_A ?? 0;
                        const liabilityB = child.liabilityToNPC_B ?? 0;

                        // If no liability from either, skip
                        if ((liabilityA + liabilityB) <= 0) return null;

                        const isBothPaying = results.payerRole === 'both_paying';

                        return (
                            <View key={`npc-breakdown-${index}`} style={{ marginBottom: 4 }}>
                                {isBothPaying ? (
                                    <>
                                        <Text style={[styles.npcPaymentLabel, { marginBottom: 2 }]}>Child {index + 1}</Text>

                                        {/* Parent A Line */}
                                        <View style={[styles.perChildGapRow, { paddingLeft: 8 }]}>
                                            <Text style={[styles.npcPaymentLabel, { fontSize: 12, color: '#4b5563' }]}>
                                                Your liability {child.farAppliedA ? (
                                                    <Text style={{ fontWeight: '700' }}>(Fixed annual rate)</Text>
                                                ) : child.marAppliedA ? (
                                                    <Text style={{ fontWeight: '700' }}>(Minimum annual rate)</Text>
                                                ) : (
                                                    <>
                                                        <Text style={{ fontWeight: '700' }}>({formatPercent2dp(child.costPerChild > 0 ? (liabilityA / child.costPerChild) * 100 : 0)})</Text> × {formatCurrency(child.costPerChild)}
                                                    </>
                                                )}
                                            </Text>
                                            <Text style={[styles.npcPaymentValue, { fontSize: 13 }]}>{formatCurrency(liabilityA)}</Text>
                                        </View>

                                        {/* Parent B Line */}
                                        <View style={[styles.perChildGapRow, { paddingLeft: 8 }]}>
                                            <Text style={[styles.npcPaymentLabel, { fontSize: 12, color: '#4b5563' }]}>
                                                Other parent's liability {child.farAppliedB ? (
                                                    <Text style={{ fontWeight: '700' }}>(Fixed annual rate)</Text>
                                                ) : child.marAppliedB ? (
                                                    <Text style={{ fontWeight: '700' }}>(Minimum annual rate)</Text>
                                                ) : (
                                                    <>
                                                        <Text style={{ fontWeight: '700' }}>({formatPercent2dp(child.costPerChild > 0 ? (liabilityB / child.costPerChild) * 100 : 0)})</Text> × {formatCurrency(child.costPerChild)}
                                                    </>
                                                )}
                                            </Text>
                                            <Text style={[styles.npcPaymentValue, { fontSize: 13, color: '#6b7280' }]}>{formatCurrency(liabilityB)}</Text>
                                        </View>
                                    </>
                                ) : (
                                    <View style={styles.perChildGapRow}>
                                        <Text style={styles.npcPaymentLabel}>
                                            Child {index + 1} - <Text style={{ fontWeight: '700' }}>({formatPercent2dp(child.costPerChild > 0 ? ((liabilityA + liabilityB) / child.costPerChild) * 100 : 0)})</Text> × {formatCurrency(child.costPerChild)}
                                        </Text>
                                        <Text style={styles.npcPaymentValue}>{formatCurrency(liabilityA + liabilityB)}</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                    {results.childResults.filter(c => ((c.liabilityToNPC_A ?? 0) + (c.liabilityToNPC_B ?? 0)) > 0).length > 1 && (
                        <>
                            <View style={[styles.perChildGapDivider, { backgroundColor: '#93c5fd', marginVertical: 8 }]} />
                            {results.payerRole === 'both_paying' ? (
                                <>
                                    <View style={styles.perChildGapRow}>
                                        <Text style={styles.npcPaymentLabel}>Total you pay to carer</Text>
                                        <Text style={styles.npcPaymentValue}>{formatCurrency(results.childResults.reduce((sum, c) => sum + (c.liabilityToNPC_A ?? 0), 0))}</Text>
                                    </View>
                                    <View style={[styles.perChildGapRow, { marginTop: 4 }]}>
                                        <Text style={[styles.npcPaymentLabel, { color: '#6b7280' }]}>Total other parent pays to carer</Text>
                                        <Text style={[styles.npcPaymentValue, { color: '#6b7280' }]}>{formatCurrency(results.childResults.reduce((sum, c) => sum + (c.liabilityToNPC_B ?? 0), 0))}</Text>
                                    </View>
                                </>
                            ) : (
                                <View style={styles.perChildGapRow}>
                                    <Text style={styles.npcPaymentLabel}>Total to non-parent carer</Text>
                                    <Text style={styles.npcPaymentValue}>{formatCurrency(results.paymentToNPC ?? 0)}</Text>
                                </View>
                            )}
                        </>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.perChildGapBreakdown, dynamicStyles.container]}>
            {results.childResults.map((child, index) => {
                if (child.isAdultChild) {
                    return <AdultChildMaintenanceCard key={index} childIndex={index} childAge={child.age} />;
                }
                // Check if either parent owes money (including NPC payments)
                const parentAOwesNPC = (child.liabilityToNPC_A ?? 0) > 0;
                const parentBOwesNPC = (child.liabilityToNPC_B ?? 0) > 0;

                const parentAOwesForChild = child.finalLiabilityA > 0 || parentAOwesNPC;
                const parentBOwesForChild = child.finalLiabilityB > 0 || parentBOwesNPC;

                if (!parentAOwesForChild && !parentBOwesForChild) {
                    const isFarLimit = isFarLimitReached(index, results, formState);
                    const displayText = isFarLimit ? 'FAR limit reached' : 'No payment required';
                    return (
                        <View key={index}>
                            <View style={styles.perChildGapRow}>
                                <Text style={[styles.perChildGapLabel, dynamicStyles.label]}>
                                    Child {index + 1} - <Text style={dynamicStyles.textMuted}>{displayText}</Text>
                                </Text>
                                <Text style={[styles.perChildGapValue, dynamicStyles.textMuted]}>$0</Text>
                            </View>
                            {child.isTurning18 && <Turning18Banner childIndex={index} />}
                        </View>
                    );
                }

                const showForParentA = parentAOwesForChild;
                const payingParentColor = showForParentA ? colors.userHighlight : colors.textMuted;
                const farApplied = showForParentA ? child.farAppliedA : child.farAppliedB;

                const isMixedPayment = results.finalPaymentAmount > 0 && (results.paymentToNPC ?? 0) > 0;

                // For mixed payments (Rule 3), the main row should only show liability to other parent
                // The NPC liability is shown in the separate blue box
                const liability = showForParentA
                    ? child.finalLiabilityA + (isMixedPayment ? 0 : (child.liabilityToNPC_A ?? 0))
                    : child.finalLiabilityB + (isMixedPayment ? 0 : (child.liabilityToNPC_B ?? 0));

                const gapPercentage = child.costPerChild > 0
                    ? (liability / child.costPerChild) * 100
                    : 0;

                const multiCaseCapApplied = showForParentA ? child.multiCaseCapAppliedA : child.multiCaseCapAppliedB;
                const multiCaseCap = showForParentA ? child.multiCaseCapA : child.multiCaseCapB;

                return (
                    <View key={index}>
                        <View style={styles.perChildGapRow}>
                            <Text style={[styles.perChildGapLabel, { fontWeight: '700' }, showForParentA && dynamicStyles.userHighlight]}>
                                {farApplied ? (
                                    <>Child {index + 1} - <Text style={{ color: payingParentColor, fontWeight: '700' }}>Fixed annual rate</Text></>
                                ) : (
                                    <>Child {index + 1} - <Text style={{ color: payingParentColor, fontWeight: '700' }}>({formatPercent2dp(gapPercentage)})</Text> × {formatCurrency(child.costPerChild)}</>
                                )}
                            </Text>
                            <Text style={[styles.perChildGapValue, { color: payingParentColor, fontWeight: '700' }]}>{formatCurrency(liability)}</Text>
                        </View>
                        {multiCaseCapApplied && multiCaseCap !== undefined && (
                            <View style={styles.multiCaseCapBadge}>
                                <Text style={styles.multiCaseCapBadgeText}>Multi-case Cap</Text>
                                <Text style={styles.multiCaseCapNote}>Liability capped at {formatCurrency(multiCaseCap)} (Solo Cost method)</Text>
                            </View>
                        )}
                        {child.isTurning18 && <Turning18Banner childIndex={index} />}
                    </View>
                );
            })}
            {(() => {
                const { isLowAssessment } = detectLowAssessmentTrigger(results, formState);
                if (isLowAssessment) {
                    return (
                        <View style={styles.warningAlert}>
                            <Text style={styles.warningTitle}>⚠️ Standard Formula Limit Detected</Text>
                            <Text style={styles.warningText}>This result is based on a default minimum or fixed rate. If the paying parent has lifestyle assets or hidden income, this figure may be incorrect.</Text>
                        </View>
                    );
                }
                return null;
            })()}
            <View style={[styles.perChildGapDivider, dynamicStyles.divider]} />
            {!hasDeceasedParent && (
                <View style={styles.perChildGapRow}>
                    <Text style={[styles.perChildGapLabel, { fontWeight: '600' }, dynamicStyles.textPrimary]}>
                        {results.finalPaymentAmount > 0 && (results.paymentToNPC ?? 0) > 0
                            ? 'Liability to other parent'
                            : 'Total Annual Liability'}
                    </Text>
                    <Text style={[styles.perChildGapValue, dynamicStyles.textPrimary, { fontWeight: '700', fontSize: 18 }]}>{formatCurrency(results.finalPaymentAmount)}</Text>
                </View>
            )}
            {results.paymentToNPC !== undefined && results.paymentToNPC > 0 && (
                <>
                    <View style={styles.npcPaymentDivider} />
                    <View style={styles.npcPaymentSection}>
                        <Text style={styles.npcPaymentTitle}>Non-Parent Carer Payment</Text>
                        <Text style={styles.npcPaymentExplanation}>
                            {results.payerRole === 'both_paying'
                                ? 'Both parents owe child support to the non-parent carer based on their care percentage.'
                                : results.payerRole === 'paying_parent'
                                    ? 'You owe child support to the non-parent carer based on your care percentage.'
                                    : results.payerRole === 'receiving_parent'
                                        ? 'The other parent owes child support to the non-parent carer based on their care percentage.'
                                        : 'Child support is owed to the non-parent carer.'}
                        </Text>
                        <View style={styles.perChildGapRow}>
                            <Text style={styles.npcPaymentLabel}>Total to non-parent carer</Text>
                            <Text style={styles.npcPaymentValue}>{formatCurrency(results.paymentToNPC)}</Text>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    perChildGapBreakdown: {
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        gap: 8,
        borderWidth: 1,
    },
    perChildGapRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    perChildGapLabel: { fontSize: 13 },
    perChildGapValue: { fontSize: 14, fontWeight: '600' },
    perChildGapDivider: { height: 1, marginTop: 4 },
    warningAlert: {
        backgroundColor: '#fef3c7',
        borderWidth: 1,
        borderColor: '#fbbf24',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    warningTitle: { fontSize: 13, fontWeight: '600', color: '#92400e', marginBottom: 4 },
    warningText: { fontSize: 12, color: '#78350f', lineHeight: 18 },
    multiCaseCapBadge: {
        marginTop: 6,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
        backgroundColor: '#f5f3ff',
        borderRadius: 6,
        padding: 8,
        borderWidth: 1,
        borderColor: '#c4b5fd',
    },
    multiCaseCapBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#7c3aed',
        backgroundColor: '#ede9fe',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    multiCaseCapNote: { fontSize: 11, color: '#6d28d9', flex: 1 },
    npcPaymentDivider: { height: 1, backgroundColor: '#93c5fd', marginTop: 12, marginBottom: 8 },
    npcPaymentSection: {
        backgroundColor: '#eff6ff',
        borderRadius: 6,
        padding: 10,
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    npcPaymentTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1e40af',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    npcPaymentExplanation: { fontSize: 11, color: '#1d4ed8', marginBottom: 8, lineHeight: 16 },
    npcPaymentLabel: { fontSize: 13, color: '#1e40af', fontWeight: '500' },
    npcPaymentValue: { fontSize: 14, fontWeight: '700', color: '#1e40af' },
});
