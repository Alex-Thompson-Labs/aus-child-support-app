import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';

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
    const highlightColor = isUserHighlighted ? theme.colors.userHighlight : undefined;
    // If children are provided, render those instead of the simple label/value pattern
    if (children) {
        return (
            <View style={styles.incomePercentageCard}>
                <Text style={[styles.incomePercentageCardTitle, highlightColor && { color: highlightColor }]}>{title}</Text>
                {children}
            </View>
        );
    }

    // Render formula if provided (Step 3 pattern)
    if (formula) {
        return (
            <View style={styles.incomePercentageCard}>
                <Text style={[styles.incomePercentageCardTitle, highlightColor && { color: highlightColor }]}>{title}</Text>
                <Text style={[styles.incomePercentageFormula, highlightColor && { color: highlightColor }]}>{formula}</Text>
            </View>
        );
    }

    // Render care→cost conversion pattern (Step 5)
    if (careValue && costValue) {
        return (
            <View style={styles.conversionCard}>
                <Text style={[styles.conversionCardLabel, { fontSize: 12 }, highlightColor && { color: highlightColor }]}>
                    {title}
                </Text>
                <View style={styles.conversionRow}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.conversionValue, highlightColor && { color: highlightColor }]}>{careValue}</Text>
                        <Text style={styles.conversionSubLabel}>care</Text>
                    </View>
                    <Text style={styles.conversionArrow}>→</Text>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.conversionResult, highlightColor && { color: highlightColor }]}>{costValue}</Text>
                        <Text style={styles.conversionSubLabel}>cost</Text>
                    </View>
                </View>
            </View>
        );
    }

    // Simple label/value pattern
    return (
        <View style={styles.deductionCard}>
            <Text style={[styles.deductionCardTitle, highlightColor && { color: highlightColor }]}>{title}</Text>
            {label && value && (
                <View style={styles.deductionRow}>
                    <Text style={styles.deductionLabel}>{label}</Text>
                    <Text
                        style={[
                            isNegative ? styles.deductionValueNegative : styles.deductionValue,
                            highlightColor && { color: highlightColor },
                        ]}
                    >
                        {isNegative ? `(${value})` : value}
                    </Text>
                </View>
            )}
            {subLabel && <Text style={styles.conversionSubLabel}>{subLabel}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    // Income percentage card styles
    incomePercentageCard: {
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    incomePercentageCardTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4a5568',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    incomePercentageFormula: {
        fontSize: 13,
        color: '#0f172a',
        fontWeight: '500',
        textAlign: 'center',
    },

    // Deduction card styles
    deductionCard: {
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        padding: 10,
        gap: 6,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    deductionCardTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4a5568',
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
        color: '#64748b',
    },
    deductionValue: {
        fontSize: 13,
        fontWeight: '500',
        color: '#0f172a',
    },
    deductionValueNegative: {
        fontSize: 13,
        fontWeight: '500',
        color: '#dc2626',
    },

    // Conversion card styles (care→cost)
    conversionCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 6,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    conversionCardLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#4a5568',
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
        color: '#374151',
    },
    conversionArrow: {
        fontSize: 14,
        color: '#6b7280',
    },
    conversionResult: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3b82f6',
    },
    conversionSubLabel: {
        fontSize: 9,
        color: '#6b7280',
        textTransform: 'uppercase',
    },
});
