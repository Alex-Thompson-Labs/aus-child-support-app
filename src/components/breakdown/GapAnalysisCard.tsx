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
    /** Optional explanation when MAR/FAR cap is applied (Formula 3/4) */
    capExplanation?: string;
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
    capExplanation,
}: GapAnalysisCardProps) {
    const hasFixedRate = isFarApplied || isMarApplied;
    // Use userHighlight for "You" elements, textMuted for "Other Parent" elements
    const highlightColor = isUserHighlighted ? theme.colors.userHighlight : theme.colors.textMuted;

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
                {capExplanation && (
                    <View style={styles.capNotice}>
                        <Text style={styles.capNoticeText}>ⓘ {capExplanation}</Text>
                    </View>
                )}
            </View>
        );
    }

    // Standard calculation view
    return (
        <View style={styles.gapCard}>
            <Text style={[styles.gapCardTitle, highlightColor && { color: highlightColor }]}>{label}</Text>
            <View style={styles.gapCardRow}>
                <Text style={styles.gapCardLabel}>Income %</Text>
                <Text style={[styles.gapCardValue, { color: theme.colors.textMuted }]}>{formatPercent(incomePercent)}</Text>
            </View>
            <View style={styles.gapCardRow}>
                <Text style={styles.gapCardLabel}>Cost %</Text>
                <Text style={[styles.gapCardValue, { color: theme.colors.textMuted }]}>
                    ({formatPercent(costPercent)})
                </Text>
            </View>
            <View style={styles.gapCardDivider} />
            <View style={[styles.gapCardRow, { marginBottom: 0 }]}>
                <Text style={[styles.gapCardLabel, styles.gapCardLabelBold, highlightColor && { color: highlightColor }]}>CS %</Text>
                <Text
                    style={[
                        styles.gapCardValue,
                        csPercent > 0 && !otherParentHasFixedRate && isUserHighlighted && styles.gapCardValueHighlight,
                        csPercent > 0 && !otherParentHasFixedRate && !isUserHighlighted && { fontWeight: '700', fontSize: 16 },
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
        backgroundColor: theme.colors.surfaceSubtle,
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    gapCardTitle: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 10,
        color: theme.colors.textSecondary,
    },
    gapCardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    gapCardLabel: {
        fontSize: 12,
        color: theme.colors.textMuted,
        flex: 1,
        paddingRight: 4,
    },
    gapCardLabelBold: {
        fontWeight: '700',
        color: theme.colors.textPrimary,
    },
    gapCardValue: {
        fontSize: 13,
        fontWeight: '500',
        color: theme.colors.textSecondary,
        textAlign: 'right',
    },
    gapCardValueHighlight: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.userHighlight,
    },
    gapCardDivider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: 6,
    },
    gapCardSpecialRate: {
        gap: 4,
    },
    gapCardSpecialRateText: {
        fontSize: 11,
        color: theme.colors.textMuted,
        lineHeight: 15,
    },
    capNotice: {
        marginTop: 8,
        backgroundColor: '#fef3c7', // Amber-100
        borderRadius: 4,
        padding: 6,
        borderWidth: 1,
        borderColor: '#fbbf24', // Amber-400
    },
    capNoticeText: {
        fontSize: 10,
        color: '#92400e', // Amber-800
        lineHeight: 14,
    },
});
