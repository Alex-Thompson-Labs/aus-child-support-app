import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';

export interface GapAnalysisCardProps {
    /** Label for the card ("PARENT A" or "PARENT B") */
    label: string;
    /** Parent's income percentage */
    incomePercent: number;
    /** Parent's cost percentage for this child */
    costPercent: number;
    /** Parent's child support percentage */
    csPercent: number;
    /** Whether Fixed Annual Rate is applied to this parent */
    isFarApplied: boolean;
    /** Whether Minimum Annual Rate is applied to this parent */
    isMarApplied: boolean;
    /** Whether the OTHER parent has FAR/MAR (affects display of CS %) */
    otherParentHasFixedRate: boolean;
    /** The FAR or MAR amount to display when fixed rate is applied */
    fixedRateAmount: number;
    /** Format function for percentages */
    formatPercent: (num: number) => string;
    /** Format function for currency */
    formatCurrency: (num: number) => string;
    /** Apply user highlight color (for "You" elements) */
    isUserHighlighted?: boolean;
}

export function GapAnalysisCard({
    label,
    incomePercent,
    costPercent,
    csPercent,
    isFarApplied,
    isMarApplied,
    otherParentHasFixedRate,
    fixedRateAmount,
    formatPercent,
    formatCurrency,
    isUserHighlighted = false,
}: GapAnalysisCardProps) {
    const hasFixedRate = isFarApplied || isMarApplied;
    const highlightColor = isUserHighlighted ? theme.colors.userHighlight : undefined;

    if (hasFixedRate) {
        // Fixed rate view (FAR or MAR)
        return (
            <View style={styles.gapCard}>
                <Text style={[styles.gapCardTitle, highlightColor && { color: highlightColor }]}>{label}</Text>
                <View style={styles.gapCardSpecialRate}>
                    <Text style={styles.gapCardSpecialRateText}>
                        {isFarApplied
                            ? 'Fixed annual rate to apply - see below for details'
                            : 'Minimum annual rate applied'}
                    </Text>
                    <Text
                        style={[
                            styles.gapCardValue,
                            styles.gapCardValueHighlight,
                            { marginTop: 8 },
                            highlightColor && { color: highlightColor },
                        ]}
                    >
                        {formatCurrency(fixedRateAmount)}
                    </Text>
                </View>
            </View>
        );
    }

    // Standard calculation view
    return (
        <View style={styles.gapCard}>
            <Text style={[styles.gapCardTitle, highlightColor && { color: highlightColor }]}>{label}</Text>
            <View style={styles.gapCardRow}>
                <Text style={styles.gapCardLabel}>Income %</Text>
                <Text style={styles.gapCardValue}>{formatPercent(incomePercent)}</Text>
            </View>
            <View style={styles.gapCardRow}>
                <Text style={styles.gapCardLabel}>Cost %</Text>
                <Text style={[styles.gapCardValue, { color: '#dc2626' }]}>
                    ({formatPercent(costPercent)})
                </Text>
            </View>
            <View style={styles.gapCardDivider} />
            <View style={styles.gapCardRow}>
                <Text style={[styles.gapCardLabel, styles.gapCardLabelBold, highlightColor && { color: highlightColor }]}>CS %</Text>
                <Text
                    style={[
                        styles.gapCardValue,
                        csPercent > 0 && !otherParentHasFixedRate && styles.gapCardValueHighlight,
                        highlightColor && { color: highlightColor },
                    ]}
                >
                    {otherParentHasFixedRate
                        ? '—'
                        : csPercent > 0
                            ? formatPercent(csPercent)
                            : '—'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    gapCard: {
        flex: 1,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    gapCardTitle: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 10,
        color: '#4a5568',
    },
    gapCardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    gapCardLabel: {
        fontSize: 12,
        color: '#64748b',
        flex: 1,
        paddingRight: 4,
    },
    gapCardLabelBold: {
        fontWeight: '600',
        color: '#0f172a',
    },
    gapCardValue: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
        textAlign: 'right',
    },
    gapCardValueHighlight: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3b82f6',
    },
    gapCardDivider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 6,
    },
    gapCardSpecialRate: {
        gap: 4,
    },
    gapCardSpecialRateText: {
        fontSize: 11,
        color: '#6b7280',
        lineHeight: 15,
    },
});
