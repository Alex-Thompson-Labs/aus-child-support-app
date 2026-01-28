import { useAppTheme } from '@/src/theme';
import type { CalculationResults } from '@/src/utils/calculator';
import { formatCurrency } from '@/src/utils/formatters';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BreakdownStepCard } from './BreakdownStepCard';
import { SpecialRateGlossary } from './SpecialRateGlossary';

interface Formula3LiabilityStepProps {
    results: CalculationResults;
    formState: { supportA: boolean; supportB: boolean };
    expandedSteps: {
        step7: boolean;
        step8: boolean;
        step9: boolean;
        step10: boolean;
    };
    onToggle: (step: 'step7' | 'step8' | 'step9' | 'step10') => void;
}

/**
 * Formula 3 Liability calculation breakdown - Steps 7, 8, 9, 10
 * 
 * Step 7: Work out COTC for the day (section 55HA)
 * Step 8: Work out child support payable for each child
 * Step 9: Work out multi-case cap
 * Step 10: Calculate final child support payable
 */
export function Formula3LiabilityStep({
    results,
    formState,
    expandedSteps,
    onToggle,
}: Formula3LiabilityStepProps) {
    const { colors } = useAppTheme();

    const dynamicStyles = useMemo(() => ({
        stepExplanation: { color: colors.textMuted },
        combinedCSIncomeLabel: { color: colors.textPrimary },
        bracketCalculation: {
            backgroundColor: colors.surfaceSubtle,
            borderColor: colors.border,
        },
        bracketTitle: { color: colors.textMuted },
        bracketLabel: { color: colors.textMuted },
        bracketValue: { color: colors.textPrimary },
        bracketDivider: { backgroundColor: colors.border },
        bracketTotalLabel: { color: colors.textPrimary },
        bracketTotalValue: { color: colors.textPrimary },
        childCard: {
            backgroundColor: colors.surfaceSubtle,
            borderColor: colors.border,
        },
        childLabel: { color: colors.textMuted },
        childValue: { color: colors.textPrimary },
        userHighlight: { color: colors.userHighlight },
        textMuted: { color: colors.textMuted },
    }), [colors]);

    // Multi-case cap only applies if the parent with multiple cases is the PAYER
    // Determine who is the payer based on final liabilities
    const isParentAPayer = results.finalLiabilityA > results.finalLiabilityB;
    const isParentBPayer = results.finalLiabilityB > results.finalLiabilityA;
    
    // Check if each parent has multi-case
    const hasMultiCaseA = results.multiCaseAllowanceA !== undefined && results.multiCaseAllowanceA > 0;
    const hasMultiCaseB = results.multiCaseAllowanceB !== undefined && results.multiCaseAllowanceB > 0;
    
    // Show multi-case cap steps (9 and 10) only if a PAYING parent has multiple cases
    // If the RECEIVING parent has multi-case, we don't show these steps
    const showMultiCaseSteps = (isParentAPayer && hasMultiCaseA) || (isParentBPayer && hasMultiCaseB);

    return (
        <>
            {/* Step 7: COTC for the day */}
            <BreakdownStepCard
                stepNumber={7}
                title="COST OF CHILDREN (COTC)"
                isExpanded={expandedSteps.step7}
                onToggle={() => onToggle('step7')}
            >
                <>
                    <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
                        Calculate the costs for the child (or other and younger children separately) 
                        for the day, calculating the costs for other and younger children separately 
                        (section 55HA). This uses income brackets set by the Department of Social Services.
                    </Text>

                    {/* Bracket calculation */}
                    {results.costBracketInfo && (
                        <View style={[styles.bracketCalculation, dynamicStyles.bracketCalculation]}>
                            {/* Combined income */}
                            <Text
                                style={[
                                    styles.combinedCSIncomeLabel,
                                    dynamicStyles.combinedCSIncomeLabel,
                                    { marginBottom: 12, fontSize: 12, textAlign: 'left' },
                                ]}
                            >
                                COMBINED CS INCOME - {formatCurrency(results.CCSI)}
                            </Text>

                            <Text style={[styles.bracketTitle, dynamicStyles.bracketTitle]}>
                                Your bracket:{' '}
                                {formatCurrency(results.costBracketInfo.minIncome)} –{' '}
                                {results.costBracketInfo.maxIncome
                                    ? formatCurrency(results.costBracketInfo.maxIncome)
                                    : 'unlimited'}
                            </Text>

                            <View style={styles.bracketFormula}>
                                <View style={styles.bracketRow}>
                                    <Text style={[styles.bracketTitle, dynamicStyles.bracketTitle]}>Base amount</Text>
                                    <Text style={[styles.bracketTitle, dynamicStyles.bracketTitle]}>
                                        {formatCurrency(results.costBracketInfo.fixed)}
                                    </Text>
                                </View>
                                {results.costBracketInfo.rate > 0 && (
                                    <View style={styles.bracketRow}>
                                        <Text style={[styles.bracketLabel, dynamicStyles.bracketLabel]}>
                                            + {(results.costBracketInfo.rate * 100).toFixed(2)}% ×{' '}
                                            {formatCurrency(results.costBracketInfo.incomeInBracket)}
                                        </Text>
                                        <Text style={[styles.bracketValue, dynamicStyles.bracketValue]}>
                                            +
                                            {formatCurrency(
                                                results.costBracketInfo.rate *
                                                results.costBracketInfo.incomeInBracket
                                            )}
                                        </Text>
                                    </View>
                                )}
                                <View style={[styles.bracketDivider, dynamicStyles.bracketDivider]} />
                                <View style={styles.bracketRow}>
                                    <Text style={[styles.bracketTotalLabel, dynamicStyles.bracketTotalLabel]}>
                                        Total cost of children
                                    </Text>
                                    <Text style={[styles.bracketTotalValue, dynamicStyles.bracketTotalValue]}>
                                        {formatCurrency(results.totalCost)}
                                    </Text>
                                </View>
                                {results.childResults.length > 0 && (
                                    <View style={styles.bracketRow}>
                                        <Text style={[styles.bracketTitle, dynamicStyles.bracketTitle]}>
                                            Cost per child ({results.childResults.length})
                                        </Text>
                                        <Text style={[styles.bracketTitle, dynamicStyles.bracketTitle]}>
                                            {formatCurrency(
                                                results.totalCost / results.childResults.length
                                            )}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                </>
            </BreakdownStepCard>

            {/* Step 8: Child support payable per child */}
            <BreakdownStepCard
                stepNumber={8}
                title="CHILD SUPPORT PAYABLE"
                isExpanded={expandedSteps.step8}
                onToggle={() => onToggle('step8')}
            >
                <>
                    <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
                        Work out how much child support is payable for each child by multiplying 
                        the child support percentage (Step 6) by the cost per child (Step 7).
                    </Text>

                    {/* Per-child breakdown */}
                    {results.childResults.map((child, index) => {
                        const costPerChild = results.totalCost / results.childResults.length;
                        
                        return (
                            <View key={index} style={[styles.childCard, dynamicStyles.childCard]}>
                                {results.childResults.length > 1 && (
                                    <Text style={[styles.childLabel, dynamicStyles.childLabel, { marginBottom: 8, fontWeight: '600' }]}>
                                        Child {index + 1}
                                    </Text>
                                )}
                                
                                {/* Parent A calculation */}
                                <View style={styles.childRow}>
                                    <Text style={[styles.childLabel, dynamicStyles.userHighlight, { fontWeight: '600' }]}>
                                        YOU
                                    </Text>
                                </View>
                                <View style={styles.childRow}>
                                    <Text style={[styles.childLabel, dynamicStyles.childLabel]}>
                                        {formatCurrency(costPerChild)} × {child.childSupportPercA.toFixed(2)}%
                                    </Text>
                                    <Text style={[styles.childValue, dynamicStyles.userHighlight, { fontWeight: '600' }]}>
                                        {child.farAppliedA || child.marAppliedA 
                                            ? formatCurrency(child.farAppliedA ? results.FAR : results.MAR)
                                            : formatCurrency(Math.max(0, child.liabilityA))
                                        }
                                    </Text>
                                </View>
                                {(child.farAppliedA || child.marAppliedA) && (
                                    <Text style={[styles.childLabel, dynamicStyles.childLabel, { fontSize: 11, marginTop: 4 }]}>
                                        {child.farAppliedA ? 'Fixed Annual Rate applied' : 'Minimum Annual Rate applied'}
                                    </Text>
                                )}

                                <>
                                    <View style={[styles.bracketDivider, dynamicStyles.bracketDivider, { marginVertical: 8 }]} />
                                    
                                    {/* Parent B calculation */}
                                    <View style={styles.childRow}>
                                        <Text style={[styles.childLabel, dynamicStyles.textMuted, { fontWeight: '600' }]}>
                                            OTHER PARENT
                                        </Text>
                                    </View>
                                    <View style={styles.childRow}>
                                        <Text style={[styles.childLabel, dynamicStyles.childLabel]}>
                                            {formatCurrency(costPerChild)} × {child.childSupportPercB.toFixed(2)}%
                                        </Text>
                                        <Text style={[styles.childValue, dynamicStyles.textMuted, { fontWeight: '600' }]}>
                                            {child.farAppliedB || child.marAppliedB 
                                                ? formatCurrency(child.farAppliedB ? results.FAR : results.MAR)
                                                : formatCurrency(Math.max(0, child.liabilityB))
                                            }
                                        </Text>
                                    </View>
                                    {(child.farAppliedB || child.marAppliedB) && (
                                        <Text style={[styles.childLabel, dynamicStyles.childLabel, { fontSize: 11, marginTop: 4 }]}>
                                            {child.farAppliedB ? 'Fixed Annual Rate applied' : 'Minimum Annual Rate applied'}
                                        </Text>
                                    )}
                                </>
                            </View>
                        );
                    })}
                </>
            </BreakdownStepCard>

            {/* Step 9: Multi-case cap (only if paying parent has multi-case) */}
            {showMultiCaseSteps && (
                <BreakdownStepCard
                    stepNumber={9}
                    title="MULTI-CASE CAP"
                    isExpanded={expandedSteps.step9}
                    onToggle={() => onToggle('step9')}
                >
                    <>
                        <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
                            Work out the multi-case cap (multi-case costs × (100% – cost percentage)). 
                            This ensures parents with multiple child support cases don&apos;t pay more than 
                            their fair share across all cases.
                        </Text>

                        {/* Show calculation for YOU */}
                        {results.multiCaseAllowanceA !== undefined && results.multiCaseAllowanceA > 0 && (
                            <View style={[styles.childCard, dynamicStyles.childCard, { marginBottom: 12 }]}>
                                <Text style={[styles.childLabel, dynamicStyles.userHighlight, { fontWeight: '700', marginBottom: 8 }]}>
                                    YOU
                                </Text>
                                {results.childResults.map((child, idx) => {
                                    // Get the child-specific multi-case cap (Solo Cost per child)
                                    const multiCaseCap = child.multiCaseCapA;
                                    
                                    // Calculate the Solo Cost from the cap: cap = soloCost × (100% - costPerc)
                                    // Therefore: soloCost = cap / (100% - costPerc)
                                    const costPerc = child.costPercA;
                                    const soloCost = multiCaseCap ? multiCaseCap / ((100 - costPerc) / 100) : 0;
                                    
                                    return (
                                        <View key={idx} style={{ marginBottom: 8 }}>
                                            {results.childResults.length > 1 && (
                                                <Text style={[styles.childLabel, dynamicStyles.textMuted, { fontSize: 12, marginBottom: 4 }]}>
                                                    Child {idx + 1} (aged {child.age})
                                                </Text>
                                            )}
                                            <Text style={[styles.childLabel, dynamicStyles.textMuted, { fontSize: 13 }]}>
                                                {formatCurrency(soloCost)} × (100 - {costPerc.toFixed(2)}) = {formatCurrency(multiCaseCap || 0)}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                        
                        {/* Show calculation for OTHER PARENT */}
                        {results.multiCaseAllowanceB !== undefined && results.multiCaseAllowanceB > 0 && (
                            <View style={[styles.childCard, dynamicStyles.childCard]}>
                                <Text style={[styles.childLabel, dynamicStyles.textMuted, { fontWeight: '700', marginBottom: 8 }]}>
                                    OTHER PARENT
                                </Text>
                                {results.childResults.map((child, idx) => {
                                    // Get the child-specific multi-case cap (Solo Cost per child)
                                    const multiCaseCap = child.multiCaseCapB;
                                    
                                    // Calculate the Solo Cost from the cap: cap = soloCost × (100% - costPerc)
                                    // Therefore: soloCost = cap / (100% - costPerc)
                                    const costPerc = child.costPercB;
                                    const soloCost = multiCaseCap ? multiCaseCap / ((100 - costPerc) / 100) : 0;
                                    
                                    return (
                                        <View key={idx} style={{ marginBottom: 8 }}>
                                            {results.childResults.length > 1 && (
                                                <Text style={[styles.childLabel, dynamicStyles.textMuted, { fontSize: 12, marginBottom: 4 }]}>
                                                    Child {idx + 1} (aged {child.age})
                                                </Text>
                                            )}
                                            <Text style={[styles.childLabel, dynamicStyles.textMuted, { fontSize: 13 }]}>
                                                {formatCurrency(soloCost)} × (100 - {costPerc.toFixed(2)}) = {formatCurrency(multiCaseCap || 0)}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                    </>
                </BreakdownStepCard>
            )}

            {/* Step 10: Final child support payable (only if paying parent has multi-case, otherwise use Step 8) */}
            {showMultiCaseSteps && (
                <BreakdownStepCard
                    stepNumber={10}
                    title="FINAL CHILD SUPPORT PAYABLE"
                    isExpanded={expandedSteps.step10}
                    onToggle={() => onToggle('step10')}
                >
                    <>
                        <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
                            Calculate child support payable by comparing Step 8 with the multi-case cap (Step 9). The lower amount applies.
                        </Text>

                    <View style={[styles.childCard, dynamicStyles.childCard]}>
                        {/* Show only the paying parent */}
                        {isParentAPayer ? (
                            <>
                                {/* Parent A is the payer */}
                                <View style={styles.childRow}>
                                    <Text style={[styles.childLabel, dynamicStyles.userHighlight, { fontWeight: '700', fontSize: 15 }]}>
                                        YOU PAY
                                    </Text>
                                    <Text style={[styles.childValue, dynamicStyles.userHighlight, { fontWeight: '700', fontSize: 16 }]}>
                                        {formatCurrency(results.finalLiabilityA || 0)}/year
                                    </Text>
                                </View>
                                <View style={styles.childRow}>
                                    <Text style={[styles.childLabel, dynamicStyles.childLabel, { fontSize: 13 }]}>
                                        Monthly
                                    </Text>
                                    <Text style={[styles.childValue, dynamicStyles.childLabel, { fontSize: 13 }]}>
                                        {formatCurrency((results.finalLiabilityA || 0) / 12)}/month
                                    </Text>
                                </View>
                            </>
                        ) : isParentBPayer ? (
                            <>
                                {/* Parent B is the payer */}
                                <View style={styles.childRow}>
                                    <Text style={[styles.childLabel, dynamicStyles.textMuted, { fontWeight: '700', fontSize: 15 }]}>
                                        OTHER PARENT PAYS
                                    </Text>
                                    <Text style={[styles.childValue, dynamicStyles.textMuted, { fontWeight: '700', fontSize: 16 }]}>
                                        {formatCurrency(results.finalLiabilityB || 0)}/year
                                    </Text>
                                </View>
                                <View style={styles.childRow}>
                                    <Text style={[styles.childLabel, dynamicStyles.childLabel, { fontSize: 13 }]}>
                                        Monthly
                                    </Text>
                                    <Text style={[styles.childValue, dynamicStyles.childLabel, { fontSize: 13 }]}>
                                        {formatCurrency((results.finalLiabilityB || 0) / 12)}/month
                                    </Text>
                                </View>
                            </>
                        ) : (
                            <>
                                {/* Both parents have equal liability or both are zero - show both */}
                                <View style={styles.childRow}>
                                    <Text style={[styles.childLabel, dynamicStyles.userHighlight, { fontWeight: '700', fontSize: 15 }]}>
                                        YOU PAY
                                    </Text>
                                    <Text style={[styles.childValue, dynamicStyles.userHighlight, { fontWeight: '700', fontSize: 16 }]}>
                                        {formatCurrency(results.finalLiabilityA || 0)}/year
                                    </Text>
                                </View>
                                <View style={styles.childRow}>
                                    <Text style={[styles.childLabel, dynamicStyles.childLabel, { fontSize: 13 }]}>
                                        Monthly
                                    </Text>
                                    <Text style={[styles.childValue, dynamicStyles.childLabel, { fontSize: 13 }]}>
                                        {formatCurrency((results.finalLiabilityA || 0) / 12)}/month
                                    </Text>
                                </View>

                                <View style={[styles.bracketDivider, dynamicStyles.bracketDivider, { marginVertical: 12 }]} />
                                
                                <View style={styles.childRow}>
                                    <Text style={[styles.childLabel, dynamicStyles.textMuted, { fontWeight: '700', fontSize: 15 }]}>
                                        OTHER PARENT PAYS
                                    </Text>
                                    <Text style={[styles.childValue, dynamicStyles.textMuted, { fontWeight: '700', fontSize: 16 }]}>
                                        {formatCurrency(results.finalLiabilityB || 0)}/year
                                    </Text>
                                </View>
                                <View style={styles.childRow}>
                                    <Text style={[styles.childLabel, dynamicStyles.childLabel, { fontSize: 13 }]}>
                                        Monthly
                                    </Text>
                                    <Text style={[styles.childValue, dynamicStyles.childLabel, { fontSize: 13 }]}>
                                        {formatCurrency((results.finalLiabilityB || 0) / 12)}/month
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>

                    {/* Optional: Special rates notice */}
                    <SpecialRateGlossary rateApplied={results.rateApplied} />
                </>
            </BreakdownStepCard>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    stepExplanation: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },

    // Combined CS Income label
    combinedCSIncomeLabel: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },

    // Bracket calculation (Step 7)
    bracketCalculation: {
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
    },
    bracketTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 12,
    },
    bracketFormula: {
        gap: 8,
    },
    bracketRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bracketLabel: {
        fontSize: 13,
    },
    bracketValue: {
        fontSize: 13,
        fontWeight: '500',
    },
    bracketDivider: {
        height: 1,
        marginVertical: 4,
    },
    bracketTotalLabel: {
        fontSize: 13,
        fontWeight: '600',
    },
    bracketTotalValue: {
        fontSize: 16,
        fontWeight: '700',
    },

    // Child cards (Step 8)
    childCard: {
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        marginTop: 8,
    },
    childRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    childLabel: {
        fontSize: 13,
    },
    childValue: {
        fontSize: 14,
        fontWeight: '600',
    },
});
