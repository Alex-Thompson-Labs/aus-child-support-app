import { useAppTheme } from '@/src/theme';
import type { CalculationResults } from '@/src/utils/calculator';
import { mapCareToCostPercent } from '@/src/utils/care-utils';
import { formatCurrency } from '@/src/utils/formatters';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BreakdownStepCard } from './BreakdownStepCard';

interface DualNPCStepProps {
    results: CalculationResults;
    isExpanded: boolean;
    onToggle: () => void;
}

/**
 * Step 9: Dual Non-Parent Carer Payment Split
 * 
 * When 2 non-parent carers are entitled to receive child support for a child,
 * the amount to be paid by the parent/s is shared in accordance with each carer's
 * share of care percentages.
 * 
 * Formula:
 * - NPC1 payment = total payable × (NPC1 care ÷ NPC combined care)
 * - NPC2 payment = total payable × (NPC2 care ÷ NPC combined care)
 * 
 * This step only appears when hasSecondNPC is true and both NPCs have 35%+ care.
 */
export function DualNPCStep({
    results,
    isExpanded,
    onToggle,
}: DualNPCStepProps) {
    const { colors } = useAppTheme();

    const dynamicStyles = useMemo(() => ({
        stepExplanation: { color: colors.textMuted },
        sectionTitle: { color: colors.text },
        label: { color: colors.textMuted },
        value: { color: colors.text },
        totalRow: { borderTopColor: colors.border },
        totalLabel: { color: colors.text },
        totalValue: { color: colors.primary },
        calculationBox: {
            backgroundColor: colors.surfaceSubtle,
            borderColor: colors.border,
        },
        divider: { backgroundColor: colors.border },
        childLabel: { color: colors.textMuted },
        childValue: { color: colors.textPrimary },
    }), [colors]);

    // Extract dual NPC payment data
    const paymentToNPC1 = results.paymentToNPC1 ?? 0;
    const paymentToNPC2 = results.paymentToNPC2 ?? 0;
    const totalPayment = paymentToNPC1 + paymentToNPC2;

    // Calculate per-child payment amounts
    const assessableChildren = results.childResults.filter(c => !c.isAdultChild);
    
    // Calculate total cost percentages across ALL children
    const totalNPC1Cost = assessableChildren.reduce((sum, child) => sum + (child.costPercNPC ?? 0), 0);
    const totalNPC2Cost = assessableChildren.reduce((sum, child) => {
        const childNPC2Care = child.roundedCareNPC2 ?? 0;
        const childNPC2Cost = childNPC2Care > 0 ? mapCareToCostPercent(childNPC2Care) : 0;
        return sum + childNPC2Cost;
    }, 0);
    const totalAllNPCCost = totalNPC1Cost + totalNPC2Cost;

    return (
        <BreakdownStepCard
            stepNumber={9}
            title="DUAL NON-PARENT CARER SPLIT"
            isExpanded={isExpanded}
            onToggle={onToggle}
        >
            <>
                <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
                    When 2 non-parent carers are entitled to receive child support for a child,
                    the amount to be paid by the parent/s is shared in accordance with each carer&apos;s
                    share of care percentages.
                </Text>

                {/* Per-Child Payment Breakdown */}
                {assessableChildren.length > 0 && (
                    <View style={[styles.calculationBox, dynamicStyles.calculationBox]}>
                        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                            Payment Breakdown by Child
                        </Text>
                        
                        <Text style={[styles.childLabel, dynamicStyles.childLabel, { marginBottom: 12 }]}>
                            Each NPC receives their proportional share based on their cost percentage for each child:
                        </Text>

                        {assessableChildren.map((child, index) => {
                            const childNPC1Care = child.roundedCareNPC ?? 0;
                            const childNPC2Care = child.roundedCareNPC2 ?? 0;
                            
                            // Get cost percentages
                            const childNPC1Cost = child.costPercNPC ?? 0;
                            const childNPC2Cost = childNPC2Care > 0 ? mapCareToCostPercent(childNPC2Care) : 0;
                            
                            // Calculate payment for this child based on their cost % relative to total
                            const childNPC1Payment = totalAllNPCCost > 0 
                                ? (totalPayment * childNPC1Cost) / totalAllNPCCost 
                                : 0;
                            const childNPC2Payment = totalAllNPCCost > 0 
                                ? (totalPayment * childNPC2Cost) / totalAllNPCCost 
                                : 0;
                            const childTotalPayment = childNPC1Payment + childNPC2Payment;
                            
                            // Count how many NPCs have care for this child
                            const npcCount = (childNPC1Care > 0 ? 1 : 0) + (childNPC2Care > 0 ? 1 : 0);
                            const showTotal = npcCount > 1; // Only show total if both NPCs have care
                            
                            return (
                                <View key={index} style={[styles.childSection, index > 0 && { marginTop: 12 }]}>
                                    <Text style={[styles.childHeader, dynamicStyles.value]}>
                                        Child {index + 1} (Age {child.age})
                                    </Text>
                                    
                                    {childNPC1Care > 0 && (
                                        <View style={[styles.row, { marginTop: 4 }]}>
                                            <Text style={[styles.childLabel, dynamicStyles.childLabel]}>
                                                • To NPC 1 ({childNPC1Cost.toFixed(1)}% cost)
                                            </Text>
                                            <Text style={[styles.childValue, dynamicStyles.childValue]}>
                                                {formatCurrency(childNPC1Payment)}
                                            </Text>
                                        </View>
                                    )}

                                    {childNPC2Care > 0 && (
                                        <View style={styles.row}>
                                            <Text style={[styles.childLabel, dynamicStyles.childLabel]}>
                                                • To NPC 2 ({childNPC2Cost.toFixed(1)}% cost)
                                            </Text>
                                            <Text style={[styles.childValue, dynamicStyles.childValue]}>
                                                {formatCurrency(childNPC2Payment)}
                                            </Text>
                                        </View>
                                    )}

                                    {showTotal && (
                                        <>
                                            <View style={[styles.divider, dynamicStyles.divider, { marginVertical: 4 }]} />

                                            <View style={styles.row}>
                                                <Text style={[styles.childLabel, dynamicStyles.childLabel]}>
                                                    Total for this child
                                                </Text>
                                                <Text style={[styles.childValue, dynamicStyles.childValue]}>
                                                    {formatCurrency(childTotalPayment)}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Total Payment Split */}
                <View style={[styles.calculationBox, dynamicStyles.calculationBox, { marginTop: 16 }]}>
                    <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                        Total Annual Payments
                    </Text>

                    <View style={styles.row}>
                        <Text style={[styles.label, dynamicStyles.label]}>
                            Non-Parent Carer 1
                        </Text>
                        <Text style={[styles.value, dynamicStyles.value]}>
                            {formatCurrency(paymentToNPC1)}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.label, dynamicStyles.label]}>
                            Non-Parent Carer 2
                        </Text>
                        <Text style={[styles.value, dynamicStyles.value]}>
                            {formatCurrency(paymentToNPC2)}
                        </Text>
                    </View>

                    <View style={[styles.divider, dynamicStyles.divider, { marginVertical: 8 }]} />

                    <View style={styles.row}>
                        <Text style={[styles.totalLabel, dynamicStyles.totalLabel]}>
                            Total to both NPCs
                        </Text>
                        <Text style={[styles.totalValue, dynamicStyles.totalValue]}>
                            {formatCurrency(totalPayment)}
                        </Text>
                    </View>
                </View>
            </>
        </BreakdownStepCard>
    );
}

const styles = StyleSheet.create({
    stepExplanation: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    label: {
        fontSize: 14,
        flex: 1,
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 12,
    },
    calculationBox: {
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
    },
    divider: {
        height: 1,
    },
    childSection: {
        paddingLeft: 8,
    },
    childHeader: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    childLabel: {
        fontSize: 13,
        flex: 1,
    },
    childValue: {
        fontSize: 13,
        fontWeight: '500',
        marginLeft: 12,
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: '700',
    },
    totalValue: {
        fontSize: 15,
        fontWeight: '700',
    },
});
