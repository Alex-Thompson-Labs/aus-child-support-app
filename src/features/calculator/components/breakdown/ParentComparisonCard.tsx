import { useAppTheme } from '@/src/theme';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface ParentComparisonCardProps {
    title: string;
    label?: string;
    value?: string;
    isNegative?: boolean;
    subLabel?: string;
    formula?: string;
    // For Step 5 conversion pattern
    careValue?: string;
    costValue?: string;
    children?: React.ReactNode;
    /** Apply user highlight color (for "You" elements) */
    isUserHighlighted?: boolean;
}

export function ParentComparisonCard({
    title,
    label,
    value,
    isNegative = false,
    subLabel,
    formula,
    careValue,
    costValue,
    children,
    isUserHighlighted = false,
}: ParentComparisonCardProps) {
    const { colors } = useAppTheme();
    
    // Use userHighlight for "You" elements, textMuted for "Other Parent" elements
    const highlightColor = isUserHighlighted ? colors.userHighlight : colors.textMuted;

    const dynamicStyles = useMemo(() => ({
        card: {
            backgroundColor: colors.surfaceSubtle,
            borderColor: colors.border,
        },
        title: { color: highlightColor },
        formula: { color: highlightColor },
        deductionLabel: { color: colors.textMuted },
        deductionValue: { color: colors.textPrimary },
        deductionValueNegative: { color: colors.error },
        conversionSubLabel: { color: colors.textMuted },
        conversionArrow: { color: colors.textMuted },
        conversionValue: { color: colors.textSecondary },
        conversionResult: { color: colors.textPrimary },
        surface: { backgroundColor: colors.surface, borderColor: colors.border },
    }), [colors, highlightColor]);

    // If children are provided, render those instead of the simple label/value pattern
    if (children) {
        return (
            <View style={[styles.incomePercentageCard, dynamicStyles.card]}>
                <Text style={[styles.incomePercentageCardTitle, dynamicStyles.title]}>{title}</Text>
                {children}
            </View>
        );
    }

    // Render formula if provided (Step 3 pattern)
    if (formula) {
        return (
            <View style={[styles.incomePercentageCard, dynamicStyles.card]}>
                <Text style={[styles.incomePercentageCardTitle, dynamicStyles.title]}>{title}</Text>
                <Text style={[styles.incomePercentageFormula, dynamicStyles.formula]}>{formula}</Text>
            </View>
        );
    }

    // Render care→cost conversion pattern (Step 5)
    if (careValue && costValue) {
        return (
            <View style={[styles.conversionCard, dynamicStyles.surface]}>
                <Text style={[styles.conversionCardLabel, { fontSize: 12 }, dynamicStyles.title]}>
                    {title}
                </Text>
                <View style={styles.conversionRow}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.conversionValue, dynamicStyles.title]}>{careValue}</Text>
                        <Text style={[styles.conversionSubLabel, dynamicStyles.conversionSubLabel]}>care</Text>
                    </View>
                    <Text style={[styles.conversionArrow, dynamicStyles.conversionArrow]}>→</Text>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.conversionResult, dynamicStyles.title]}>{costValue}</Text>
                        <Text style={[styles.conversionSubLabel, dynamicStyles.conversionSubLabel]}>cost</Text>
                    </View>
                </View>
            </View>
        );
    }

    // Simple label/value pattern
    return (
        <View style={[styles.deductionCard, dynamicStyles.card]}>
            <Text style={[styles.deductionCardTitle, dynamicStyles.title]}>{title}</Text>
            {label && value && (
                <View style={styles.deductionRow}>
                    <Text style={[styles.deductionLabel, dynamicStyles.deductionLabel]}>{label}</Text>
                    <Text
                        style={[
                            isNegative ? styles.deductionValueNegative : styles.deductionValue,
                            isNegative ? dynamicStyles.deductionValueNegative : dynamicStyles.title,
                        ]}
                    >
                        {isNegative ? `(${value})` : value}
                    </Text>
                </View>
            )}
            {subLabel && <Text style={[styles.conversionSubLabel, dynamicStyles.conversionSubLabel]}>{subLabel}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    // Income percentage card styles
    incomePercentageCard: {
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
    },
    incomePercentageCardTitle: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    incomePercentageFormula: {
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'center',
    },

    // Deduction card styles
    deductionCard: {
        borderRadius: 8,
        padding: 10,
        gap: 6,
        borderWidth: 1,
    },
    deductionCardTitle: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    deductionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    deductionLabel: {
        fontSize: 13,
    },
    deductionValue: {
        fontSize: 13,
        fontWeight: '500',
    },
    deductionValueNegative: {
        fontSize: 13,
        fontWeight: '500',
    },

    // Conversion card styles (care→cost)
    conversionCard: {
        flex: 1,
        borderRadius: 6,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
    },
    conversionCardLabel: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    conversionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    conversionValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    conversionArrow: {
        fontSize: 14,
    },
    conversionResult: {
        fontSize: 16,
        fontWeight: '700',
    },
    conversionSubLabel: {
        fontSize: 9,
        textTransform: 'uppercase',
    },
});
