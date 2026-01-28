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

                    {/* Group children by age bracket */}
                    {(() => {
                        const assessableChildren = results.childResults.filter(c => !c.isAdultChild);
                        const under13Children = assessableChildren.filter(c => c.age < 13);
                        const over13Children = assessableChildren.filter(c => c.age >= 13);

                        return (
                            <View style={[styles.bracketCalculation, dynamicStyles.bracketCalculation]}>
                                {/* Children 13 and under */}
                                {under13Children.length > 0 && under13Children[0].costBracketInfo && (
                                    <>
                                        <Text style={[styles.bracketTotalLabel, dynamicStyles.bracketTotalLabel, { marginBottom: 8 }]}>
                                            Children 13 and under
                                        </Text>
                                        
                                        <View style={styles.bracketRow}>
                                            <Text style={[styles.bracketLabel, dynamicStyles.bracketLabel]}>
                                                Combined CS income
                                            </Text>
                                            <Text style={[styles.bracketValue, dynamicStyles.bracketValue]}>
                                                {formatCurrency(results.CCSI)}
                                            </Text>
                                        </View>
                                        
                                        <Text style={[styles.bracketTitle, dynamicStyles.bracketTitle, { marginTop: 4 }]}>
                                            Income bracket:{' '}
                                            {formatCurrency(under13Children[0].costBracketInfo.minIncome)} –{' '}
                                            {under13Children[0].costBracketInfo.maxIncome
                                                ? formatCurrency(under13Children[0].costBracketInfo.maxIncome)
                                                : 'unlimited'}
                                        </Text>

                                        <View style={styles.bracketFormula}>
                                            <View style={styles.bracketRow}>
                                                <Text style={[styles.bracketTitle, dynamicStyles.bracketTitle]}>Base amount</Text>
                                                <Text style={[styles.bracketTitle, dynamicStyles.bracketTitle]}>
                                                    {formatCurrency(under13Children[0].costBracketInfo.fixed)}
                                                </Text>
                                            </View>
                                            {under13Children[0].costBracketInfo.rate > 0 && (
                                                <View style={styles.bracketRow}>
                                                    <Text style={[styles.bracketLabel, dynamicStyles.bracketLabel]}>
                                                        + {(under13Children[0].costBracketInfo.rate * 100).toFixed(2)}% ×{' '}
                                                        {formatCurrency(under13Children[0].costBracketInfo.incomeInBracket)}
                                                    </Text>
                                                    <Text style={[styles.bracketValue, dynamicStyles.bracketValue]}>
                                                        +{formatCurrency(under13Children[0].costBracketInfo.rate * under13Children[0].costBracketInfo.incomeInBracket)}
                                                    </Text>
                                                </View>
                                            )}
                                            <View style={styles.bracketRow}>
                                                <Text style={[styles.bracketLabel, dynamicStyles.bracketLabel]}>
                                                    COTC for all children at this age
                                                </Text>
                                                <Text style={[styles.bracketValue, dynamicStyles.bracketValue]}>
                                                    {formatCurrency(under13Children[0].totalCostAtAge || 0)}
                                                </Text>
                                            </View>
                                            <View style={styles.bracketRow}>
                                                <Text style={[styles.bracketLabel, dynamicStyles.bracketLabel]}>
                                                    • {formatCurrency(under13Children[0].totalCostAtAge || 0)} ÷ {assessableChildren.length}
                                                </Text>
                                            </View>
                                            <View style={styles.bracketRow}>
                                                <Text style={[styles.bracketTotalLabel, dynamicStyles.bracketTotalLabel]}>
                                                    Cost of the Child
                                                </Text>
                                                <Text style={[styles.bracketTotalValue, dynamicStyles.bracketTotalValue]}>
                                                    {formatCurrency(under13Children[0].costPerChild)}
                                                </Text>
                                            </View>
                                        </View>
                                    </>
                                )}

                                {/* Children over 13 */}
                                {over13Children.length > 0 && over13Children[0].costBracketInfo && (
                                    <>
                                        {under13Children.length > 0 && <View style={[styles.bracketDivider, dynamicStyles.bracketDivider, { marginVertical: 12 }]} />}
                                        
                                        <Text style={[styles.bracketTotalLabel, dynamicStyles.bracketTotalLabel, { marginBottom: 8 }]}>
                                            Children over 13
                                        </Text>
                                        
                                        <View style={styles.bracketRow}>
                                            <Text style={[styles.bracketLabel, dynamicStyles.bracketLabel]}>
                                                Child support income
                                            </Text>
                                            <Text style={[styles.bracketValue, dynamicStyles.bracketValue]}>
                                                {formatCurrency(results.CCSI)}
                                            </Text>
                                        </View>
                                        
                                        <Text style={[styles.bracketTitle, dynamicStyles.bracketTitle, { marginTop: 4 }]}>
                                            Income bracket:{' '}
                                            {formatCurrency(over13Children[0].costBracketInfo.minIncome)} –{' '}
                                            {over13Children[0].costBracketInfo.maxIncome
                                                ? formatCurrency(over13Children[0].costBracketInfo.maxIncome)
                                                : 'unlimited'}
                                        </Text>

                                        <View style={styles.bracketFormula}>
                                            <View style={styles.bracketRow}>
                                                <Text style={[styles.bracketTitle, dynamicStyles.bracketTitle]}>Base amount</Text>
                                                <Text style={[styles.bracketTitle, dynamicStyles.bracketTitle]}>
                                                    {formatCurrency(over13Children[0].costBracketInfo.fixed)}
                                                </Text>
                                            </View>
                                            {over13Children[0].costBracketInfo.rate > 0 && (
                                                <View style={styles.bracketRow}>
                                                    <Text style={[styles.bracketLabel, dynamicStyles.bracketLabel]}>
                                                        + {(over13Children[0].costBracketInfo.rate * 100).toFixed(2)}% ×{' '}
                                                        {formatCurrency(over13Children[0].costBracketInfo.incomeInBracket)}
                                                    </Text>
                                                    <Text style={[styles.bracketValue, dynamicStyles.bracketValue]}>
                                                        +{formatCurrency(over13Children[0].costBracketInfo.rate * over13Children[0].costBracketInfo.incomeInBracket)}
                                                    </Text>
                                                </View>
                                            )}
                                            <View style={styles.bracketRow}>
                                                <Text style={[styles.bracketLabel, dynamicStyles.bracketLabel]}>
                                                    COTC for all children at this age
                                                </Text>
                                                <Text style={[styles.bracketValue, dynamicStyles.bracketValue]}>
                                                    {formatCurrency(over13Children[0].totalCostAtAge || 0)}
                                                </Text>
                                            </View>
                                            <View style={styles.bracketRow}>
                                                <Text style={[styles.bracketLabel, dynamicStyles.bracketLabel]}>
                                                    • {formatCurrency(over13Children[0].totalCostAtAge || 0)} ÷ {assessableChildren.length}
                                                </Text>
                                            </View>
                                            <View style={styles.bracketRow}>
                                                <Text style={[styles.bracketTotalLabel, dynamicStyles.bracketTotalLabel]}>
                                                    Cost of the Child
                                                </Text>
                                                <Text style={[styles.bracketTotalValue, dynamicStyles.bracketTotalValue]}>
                                                    {formatCurrency(over13Children[0].costPerChild)}
                                                </Text>
                                            </View>
                                        </View>
                                    </>
                                )}

                                {/* Final per-child costs */}
                                {assessableChildren.length > 0 && (
                                    <>
                                        <View style={[styles.bracketDivider, dynamicStyles.bracketDivider, { marginVertical: 12 }]} />
                                        {assessableChildren.map((child, index) => (
                                            <View key={index} style={[styles.bracketRow, { marginTop: index > 0 ? 4 : 0 }]}>
                                                <Text style={[styles.bracketLabel, dynamicStyles.bracketLabel]}>
                                                    Costs for child {index + 1}
                                                </Text>
                                                <Text style={[styles.bracketValue, dynamicStyles.bracketValue]}>
                                                    {formatCurrency(child.costPerChild)}
                                                </Text>
                                            </View>
                                        ))}
                                    </>
                                )}
                            </View>
                        );
                    })()}
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
                        // Calculate correct values
                        const costPerChild = child.costPerChild ?? 0;
                        const csPercA = child.childSupportPercA ?? 0;
                        const csPercB = child.childSupportPercB ?? 0;
                        
                        const calculatedLiabilityA = csPercA > 0 ? Math.round(costPerChild * (csPercA / 100)) : 0;
                        const calculatedLiabilityB = csPercB > 0 ? Math.round(costPerChild * (csPercB / 100)) : 0;
                        
                        // Store for total calculation
                        (child as any)._calculatedLiabilityA = calculatedLiabilityA;
                        (child as any)._calculatedLiabilityB = calculatedLiabilityB;
                        
                        // Only show calculation for parent(s) with positive CS%
                        const showParentA = csPercA > 0;
                        const showParentB = csPercB > 0;
                        
                        return (
                            <View key={index} style={[styles.childCard, dynamicStyles.childCard]}>
                                {results.childResults.length > 1 && (
                                    <Text style={[styles.childLabel, dynamicStyles.childLabel, { marginBottom: 8, fontWeight: '600' }]}>
                                        Child {index + 1}
                                    </Text>
                                )}
                                
                                {/* Parent A calculation - only if positive CS% */}
                                {showParentA && (
                                    <>
                                        <View style={styles.childRow}>
                                            <Text style={[styles.childLabel, dynamicStyles.userHighlight, { fontWeight: '600' }]}>
                                                YOU
                                            </Text>
                                        </View>
                                        <View style={styles.childRow}>
                                            <Text style={[styles.childLabel, dynamicStyles.childLabel]}>
                                                {formatCurrency(costPerChild)} × {csPercA.toFixed(2)}%
                                            </Text>
                                            <Text style={[styles.childValue, dynamicStyles.userHighlight, { fontWeight: '600' }]}>
                                                {formatCurrency(calculatedLiabilityA)}
                                            </Text>
                                        </View>
                                    </>
                                )}

                                {/* Divider between parents - only if both have positive CS% */}
                                {showParentA && showParentB && (
                                    <View style={[styles.bracketDivider, dynamicStyles.bracketDivider, { marginVertical: 8 }]} />
                                )}
                                
                                {/* Parent B calculation - only if positive CS% */}
                                {showParentB && (
                                    <>
                                        <View style={styles.childRow}>
                                            <Text style={[styles.childLabel, dynamicStyles.textMuted, { fontWeight: '600' }]}>
                                                OTHER PARENT
                                            </Text>
                                        </View>
                                        <View style={styles.childRow}>
                                            <Text style={[styles.childLabel, dynamicStyles.childLabel]}>
                                                {formatCurrency(costPerChild)} × {csPercB.toFixed(2)}%
                                            </Text>
                                            <Text style={[styles.childValue, dynamicStyles.textMuted, { fontWeight: '600' }]}>
                                                {formatCurrency(calculatedLiabilityB)}
                                            </Text>
                                        </View>
                                    </>
                                )}
                            </View>
                        );
                    })}
                    
                    {/* Total row - show if multiple children AND no multi-case (if multi-case, final total is in Step 10) */}
                    {results.childResults.length > 1 && !showMultiCaseSteps && (() => {
                        // Calculate totals from corrected values
                        const totalLiabilityA = results.childResults.reduce((sum, child) => 
                            sum + ((child as any)._calculatedLiabilityA || 0), 0);
                        const totalLiabilityB = results.childResults.reduce((sum, child) => 
                            sum + ((child as any)._calculatedLiabilityB || 0), 0);
                        
                        const isParentAPayer = totalLiabilityA > totalLiabilityB;
                        const isParentBPayer = totalLiabilityB > totalLiabilityA;
                        
                        return (
                            <View style={{ marginTop: 16 }}>
                                {/* Show only the net payment - the payer and the net amount */}
                                {isParentAPayer ? (
                                    <View style={[styles.childRow, { marginBottom: 4 }]}>
                                        <Text style={[styles.bracketTotalLabel, dynamicStyles.userHighlight]}>
                                            YOU PAY
                                        </Text>
                                        <Text style={[styles.bracketTotalValue, dynamicStyles.userHighlight]}>
                                            {formatCurrency(totalLiabilityA - totalLiabilityB)}/year
                                        </Text>
                                    </View>
                                ) : isParentBPayer ? (
                                    <View style={[styles.childRow, { marginBottom: 4 }]}>
                                        <Text style={[styles.bracketTotalLabel, dynamicStyles.textMuted]}>
                                            OTHER PARENT PAYS
                                        </Text>
                                        <Text style={[styles.bracketTotalValue, dynamicStyles.textMuted]}>
                                            {formatCurrency(totalLiabilityB - totalLiabilityA)}/year
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={[styles.childRow, { marginBottom: 4 }]}>
                                        <Text style={[styles.bracketTotalLabel, dynamicStyles.textMuted]}>
                                            NET PAYMENT
                                        </Text>
                                        <Text style={[styles.bracketTotalValue, dynamicStyles.textMuted]}>
                                            {formatCurrency(0)}/year
                                        </Text>
                                    </View>
                                )}
                            </View>
                        );
                    })()}
                </>
            </BreakdownStepCard>

            {/* Step 9: Multi-case cap (only if paying parent has multi-case) */}
            {showMultiCaseSteps && (
                <BreakdownStepCard
                    stepNumber={9}
                    title="MULTI-CASE CAP"
                    tooltip={
                        <>
                            <Text style={{ fontSize: 14, lineHeight: 20, color: '#374151', marginBottom: 8 }}>
                                The multi-case cap ensures you don't pay more child support across multiple cases than you would if all your children lived together in one household.
                            </Text>
                            <Text style={{ fontSize: 14, lineHeight: 20, color: '#374151', marginBottom: 8 }}>
                                <Text style={{ fontWeight: '600' }}>Example:</Text> If you have 2 children in this case and 1 child in another case, the calculator works out what you'd pay if all 3 children were in one case, then caps your payment at that amount.
                            </Text>
                            <Text style={{ fontSize: 14, lineHeight: 20, color: '#374151' }}>
                                This protects you from paying more than your fair share when you have children in different relationships.
                            </Text>
                        </>
                    }
                    isExpanded={expandedSteps.step9}
                    onToggle={() => onToggle('step9')}
                >
                    <>
                        <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
                            Work out the multi-case cap (multi-case costs × (100% – cost percentage)). 
                            This ensures parents with multiple child support cases don&apos;t pay more than 
                            their fair share across all cases.
                        </Text>

                        {/* Show calculation for YOU - only if YOU are the payer */}
                        {isParentAPayer && results.multiCaseAllowanceA !== undefined && results.multiCaseAllowanceA > 0 && (
                            <View style={[styles.childCard, dynamicStyles.childCard, { marginBottom: 12 }]}>
                                <Text style={[styles.childLabel, dynamicStyles.userHighlight, { fontWeight: '700', marginBottom: 8 }]}>
                                    YOU
                                </Text>
                                {results.childResults.map((child, idx) => {
                                    // Get multi-case cost from Step 1
                                    const multiCaseCost = results.multiCaseBreakdownA?.find(
                                        breakdown => breakdown.isCurrentCase && breakdown.childAge === child.age
                                    )?.costPerChild || 0;
                                    
                                    // Get cost percentage from Step 5
                                    const costPerc = child.costPercA;
                                    
                                    // Calculate cap: multi-case cost × (100% - cost percentage)
                                    const cap = Math.round(multiCaseCost * ((100 - costPerc) / 100));
                                    
                                    return (
                                        <View key={idx} style={{ marginBottom: 8 }}>
                                            {results.childResults.length > 1 && (
                                                <Text style={[styles.childLabel, dynamicStyles.textMuted, { fontSize: 12, marginBottom: 4 }]}>
                                                    Child {idx + 1} (aged {child.age})
                                                </Text>
                                            )}
                                            <Text style={[styles.childLabel, dynamicStyles.textMuted, { fontSize: 13 }]}>
                                                {formatCurrency(multiCaseCost)} × (100 - {costPerc.toFixed(2)})% = {formatCurrency(cap)}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                        
                        {/* Show calculation for OTHER PARENT - only if OTHER PARENT is the payer */}
                        {isParentBPayer && results.multiCaseAllowanceB !== undefined && results.multiCaseAllowanceB > 0 && (
                            <View style={[styles.childCard, dynamicStyles.childCard]}>
                                <Text style={[styles.childLabel, dynamicStyles.textMuted, { fontWeight: '700', marginBottom: 8 }]}>
                                    OTHER PARENT
                                </Text>
                                {results.childResults.map((child, idx) => {
                                    // Get multi-case cost from Step 1
                                    const multiCaseCost = results.multiCaseBreakdownB?.find(
                                        breakdown => breakdown.isCurrentCase && breakdown.childAge === child.age
                                    )?.costPerChild || 0;
                                    
                                    // Get cost percentage from Step 5
                                    const costPerc = child.costPercB;
                                    
                                    // Calculate cap: multi-case cost × (100% - cost percentage)
                                    const cap = Math.round(multiCaseCost * ((100 - costPerc) / 100));
                                    
                                    return (
                                        <View key={idx} style={{ marginBottom: 8 }}>
                                            {results.childResults.length > 1 && (
                                                <Text style={[styles.childLabel, dynamicStyles.textMuted, { fontSize: 12, marginBottom: 4 }]}>
                                                    Child {idx + 1} (aged {child.age})
                                                </Text>
                                            )}
                                            <Text style={[styles.childLabel, dynamicStyles.textMuted, { fontSize: 13 }]}>
                                                {formatCurrency(multiCaseCost)} × (100 - {costPerc.toFixed(2)})% = {formatCurrency(cap)}
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

                                <View style={[styles.bracketDivider, dynamicStyles.bracketDivider, { marginVertical: 12 }]} />
                                
                                <View style={styles.childRow}>
                                    <Text style={[styles.childLabel, dynamicStyles.textMuted, { fontWeight: '700', fontSize: 15 }]}>
                                        OTHER PARENT PAYS
                                    </Text>
                                    <Text style={[styles.childValue, dynamicStyles.textMuted, { fontWeight: '700', fontSize: 16 }]}>
                                        {formatCurrency(results.finalLiabilityB || 0)}/year
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
