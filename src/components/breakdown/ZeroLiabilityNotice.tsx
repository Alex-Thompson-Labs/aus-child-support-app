import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { CalculationResults } from '../../utils/calculator';
import { formatCurrency } from '../../utils/formatters';

export interface ZeroLiabilityNoticeProps {
    results: CalculationResults;
}

// Helper to format percentage with 2 decimal places
const formatPercent2dp = (num: number): string => {
    return `${num.toFixed(2)}%`;
};

/**
 * Displays explanatory notices when the final payment amount is $0
 * and no special rate (FAR/MAR) was applied.
 * 
 * Shows contextual messages about why no payment is required based on
 * whether parents' income is below the self-support amount.
 */
export function ZeroLiabilityNotice({ results }: ZeroLiabilityNoticeProps) {
    // Only show if payment is $0 and no special rate applied
    if (results.finalPaymentAmount !== 0 || results.rateApplied !== 'None') {
        return null;
    }

    // Calculate average care for the notice messages
    const avgCareA =
        results.childResults.length > 0
            ? results.childResults.reduce(
                (sum, child) => sum + child.roundedCareA,
                0
            ) / results.childResults.length
            : 0;
    const avgCareB =
        results.childResults.length > 0
            ? results.childResults.reduce(
                (sum, child) => sum + child.roundedCareB,
                0
            ) / results.childResults.length
            : 0;

    const parentABelowSSA = results.ATI_A < results.SSA && avgCareA >= 14;
    const parentBBelowSSA = results.ATI_B < results.SSA && avgCareB >= 14;

    // Neither parent qualifies for the notice
    if (!parentABelowSSA && !parentBBelowSSA) {
        return null;
    }

    // Both parents below SSA
    if (parentABelowSSA && parentBBelowSSA) {
        return (
            <View style={styles.specialNotice}>
                <Text style={styles.specialNoticeTitle}>ℹ️ No Payment Required</Text>
                <Text style={styles.specialNoticeText}>
                    Both parents&apos; income is below the self-support amount (
                    {formatCurrency(results.SSA)}), so neither has an income-based
                    obligation. Their care time (Parent A: {formatPercent2dp(avgCareA)},
                    Parent B: {formatPercent2dp(avgCareB)}) means they&apos;re already
                    contributing by covering costs directly during care.
                </Text>
            </View>
        );
    }

    // Individual parent notices
    return (
        <>
            {parentABelowSSA && (
                <View style={styles.specialNotice}>
                    <Text style={styles.specialNoticeTitle}>ℹ️ No Payment Required</Text>
                    <Text style={styles.specialNoticeText}>
                        Parent A&apos;s income ({formatCurrency(results.ATI_A)}) is below
                        the self-support amount ({formatCurrency(results.SSA)}), so they
                        have no income-based obligation. Their care time (
                        {formatPercent2dp(avgCareA)}) means they&apos;re already
                        contributing by covering costs directly during care.
                    </Text>
                </View>
            )}
            {parentBBelowSSA && (
                <View style={styles.specialNotice}>
                    <Text style={styles.specialNoticeTitle}>ℹ️ No Payment Required</Text>
                    <Text style={styles.specialNoticeText}>
                        Parent B&apos;s income ({formatCurrency(results.ATI_B)}) is below
                        the self-support amount ({formatCurrency(results.SSA)}), so they
                        have no income-based obligation. Their care time (
                        {formatPercent2dp(avgCareB)}) means they&apos;re already
                        contributing by covering costs directly during care.
                    </Text>
                </View>
            )}
        </>
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
    specialNoticeTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0369a1',
        flex: 1,
    },
    specialNoticeText: {
        fontSize: 13,
        color: '#475569',
        lineHeight: 18,
        marginTop: 8,
    },
});
