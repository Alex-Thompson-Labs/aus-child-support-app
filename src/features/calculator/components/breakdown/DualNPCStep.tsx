import { useAppTheme } from '@/src/theme';
import type { CalculationResults } from '@/src/utils/calculator';
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
    }), [colors]);

    // Extract dual NPC payment data
    const paymentToNPC1 = results.paymentToNPC1 ?? 0;
    const paymentToNPC2 = results.paymentToNPC2 ?? 0;
    const totalPayment = paymentToNPC1 + paymentToNPC2;

    // Calculate care percentage shares (for display purposes)
    const npc1Share = totalPayment > 0 ? (paymentToNPC1 / totalPayment) * 100 : 0;
    const npc2Share = totalPayment > 0 ? (paymentToNPC2 / totalPayment) * 100 : 0;

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
                    the amount to be paid by the parent/s is shared in accordance with each carer's
                    share of care percentages.
                </Text>

                {/* Payment Split Breakdown */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                        Payment Split
                    </Text>

                    <View style={styles.row}>
                        <Text style={[styles.label, dynamicStyles.label]}>
                            Non-Parent Carer 1 ({npc1Share.toFixed(0)}% share)
                        </Text>
                        <Text style={[styles.value, dynamicStyles.value]}>
                            {formatCurrency(paymentToNPC1)}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.label, dynamicStyles.label]}>
                            Non-Parent Carer 2 ({npc2Share.toFixed(0)}% share)
                        </Text>
                        <Text style={[styles.value, dynamicStyles.value]}>
                            {formatCurrency(paymentToNPC2)}
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
        paddingVertical: 8,
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
});
