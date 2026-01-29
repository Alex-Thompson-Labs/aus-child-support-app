import { useAppTheme } from '@/src/theme';
import type { CalculationResults } from '@/src/utils/calculator';
import { formatCurrency } from '@/src/utils/formatters';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { BreakdownStepCard } from './BreakdownStepCard';
import { CostOfChildrenStep } from './CostOfChildrenStep';

interface Formula4LiabilityStepProps {
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
 * Formula 4 Liability Step Component
 * 
 * Handles Steps 7-10 and 12 for Formula 4 (multi-case with NPC):
 * - Step 7: Cost of the children (COTC)
 * - Step 8: Child support payable per child (before multi-case cap)
 * - Step 9: Multi-case cap application
 * - Step 10: NPC payment distribution rules
 * - Step 12: Final child support payable
 */
export function Formula4LiabilityStep({
  results,
  formState,
  expandedSteps,
  onToggle,
}: Formula4LiabilityStepProps) {
  const { colors } = useAppTheme();

  const dynamicStyles = useMemo(() => ({
    stepExplanation: { color: colors.textMuted },
    childCard: {
      backgroundColor: colors.surfaceSubtle,
      borderColor: colors.border,
    },
    childLabel: { color: colors.textMuted },
    childValue: { color: colors.textPrimary },
    parentLabel: { color: colors.textPrimary },
    divider: { backgroundColor: colors.border },
    userHighlight: { color: colors.userHighlight },
    textMuted: { color: colors.textMuted },
    totalLabel: { color: colors.textPrimary },
    totalValue: { color: colors.textPrimary },
  }), [colors]);

  const hasMultiCaseA = results.multiCaseAllowanceA !== undefined && results.multiCaseAllowanceA > 0;
  const hasMultiCaseB = results.multiCaseAllowanceB !== undefined && results.multiCaseAllowanceB > 0;
  
  // Check if any multi-case caps were applied
  const hasMultiCaseCapA = results.childResults?.some(
    (child) => child.multiCaseCapAppliedA === true
  );
  const hasMultiCaseCapB = results.childResults?.some(
    (child) => child.multiCaseCapAppliedB === true
  );

  // Determine payment direction
  const isParentAPayer = results.finalLiabilityA > results.finalLiabilityB;

  return (
    <>
      {/* Step 7: Cost of the children (COTC) */}
      <CostOfChildrenStep
        results={results}
        isExpanded={expandedSteps.step7}
        onToggle={() => onToggle('step7')}
      />

      {/* Step 8: Child support payable per child (before multi-case cap) */}
      <BreakdownStepCard
        stepNumber={8}
        title="CHILD SUPPORT PAYABLE"
        isExpanded={expandedSteps.step8}
        onToggle={() => onToggle('step8')}
      >
        <>
          <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
            Work out how much child support is payable for each child by multiplying the child support percentage (Step 6) by the cost per child (Step 7).
          </Text>

          {results.childResults?.map((child, index) => {
            // Calculate the correct values using the formula
            const costPerChild = child.costPerChild ?? 0;
            const csPercA = child.childSupportPercA ?? 0;
            const csPercB = child.childSupportPercB ?? 0;
            
            const calculatedLiabilityA = csPercA > 0 ? Math.round(costPerChild * (csPercA / 100)) : 0;
            const calculatedLiabilityB = csPercB > 0 ? Math.round(costPerChild * (csPercB / 100)) : 0;
            
            return (
              <View key={index} style={[styles.childCard, dynamicStyles.childCard]}>
                {results.childResults.length > 1 && (
                  <Text style={[styles.childTitle, dynamicStyles.parentLabel]}>
                    Child {index + 1}
                  </Text>
                )}
                
                {/* Only show You if you have positive CS% */}
                {csPercA > 0 && (
                  <>
                    <View style={styles.parentRow}>
                      <Text style={[styles.parentLabel, dynamicStyles.userHighlight]}>
                        YOU
                      </Text>
                    </View>
                    <View style={styles.calculationRow}>
                      <Text style={[styles.formula, dynamicStyles.childLabel]}>
                        {formatCurrency(costPerChild)} × {csPercA.toFixed(2)}%
                      </Text>
                      <Text style={[styles.result, dynamicStyles.userHighlight]}>
                        {formatCurrency(calculatedLiabilityA)}
                      </Text>
                    </View>
                  </>
                )}
                
                {/* Divider between parents if both have positive CS% */}
                {csPercA > 0 && csPercB > 0 && (
                  <View style={[styles.divider, dynamicStyles.divider]} />
                )}
                
                {/* Only show Other Parent if they have positive CS% */}
                {csPercB > 0 && (
                  <>
                    <View style={styles.parentRow}>
                      <Text style={[styles.parentLabel, dynamicStyles.textMuted]}>
                        OTHER PARENT
                      </Text>
                    </View>
                    <View style={styles.calculationRow}>
                      <Text style={[styles.formula, dynamicStyles.childLabel]}>
                        {formatCurrency(costPerChild)} × {csPercB.toFixed(2)}%
                      </Text>
                      <Text style={[styles.result, dynamicStyles.textMuted]}>
                        {formatCurrency(calculatedLiabilityB)}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            );
          })}
        </>
      </BreakdownStepCard>

      {/* Step 9: Multi-case cap application */}
      {(hasMultiCaseA || hasMultiCaseB) && (
        <BreakdownStepCard
          stepNumber={9}
          title="MULTI-CASE CAP"
          isExpanded={expandedSteps.step9}
          onToggle={() => onToggle('step9')}
        >
          <>
            <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
              When a parent has children in multiple child support cases, their liability for each
              child is capped to prevent excessive payments. The cap is calculated as the cost of
              that child alone (using the parent&apos;s preliminary income) multiplied by their payment
              responsibility percentage.
            </Text>

            {results.childResults?.map((child, index) => {
              // Determine who is the paying parent
              const isParentAPayer = results.finalLiabilityA > results.finalLiabilityB;
              const isParentBPayer = results.finalLiabilityB > results.finalLiabilityA;
              
              // Get multi-case cost from Step 1
              const multiCaseCostA = results.multiCaseBreakdownA?.find(
                breakdown => breakdown.isCurrentCase && breakdown.childAge === child.age
              )?.costPerChild || 0;
              
              const multiCaseCostB = results.multiCaseBreakdownB?.find(
                breakdown => breakdown.isCurrentCase && breakdown.childAge === child.age
              )?.costPerChild || 0;
              
              // Get cost percentages from Step 5
              const costPercA = child.costPercA;
              const costPercB = child.costPercB;
              
              // Calculate caps: multi-case cost × (100% - cost percentage)
              const capA = Math.round(multiCaseCostA * ((100 - costPercA) / 100));
              const capB = Math.round(multiCaseCostB * ((100 - costPercB) / 100));
              
              return (
                <View key={index} style={[styles.childCard, dynamicStyles.childCard]}>
                  {results.childResults.length > 1 && (
                    <Text style={[styles.childTitle, dynamicStyles.parentLabel]}>
                      Child {index + 1} (Age {child.age})
                    </Text>
                  )}

                  {/* Parent A Multi-case Cap - only show if Parent A is the payer */}
                  {hasMultiCaseA && multiCaseCostA > 0 && isParentAPayer && (
                    <View style={styles.capSection}>
                      <Text style={[styles.parentLabel, dynamicStyles.userHighlight]}>
                        YOU - Multi-case Cap:
                      </Text>
                      <Text style={[styles.capCalculation, dynamicStyles.childLabel]}>
                        {formatCurrency(multiCaseCostA)} × (100 - {costPercA.toFixed(2)})% = {formatCurrency(capA)}
                      </Text>
                    </View>
                  )}

                  {/* Parent B Multi-case Cap - only show if Parent B is the payer */}
                  {hasMultiCaseB && multiCaseCostB > 0 && isParentBPayer && (
                    <View style={styles.capSection}>
                      <Text style={[styles.parentLabel, dynamicStyles.textMuted]}>
                        OTHER PARENT - Multi-case Cap:
                      </Text>
                      <Text style={[styles.capCalculation, dynamicStyles.childLabel]}>
                        {formatCurrency(multiCaseCostB)} × (100 - {costPercB.toFixed(2)})% = {formatCurrency(capB)}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </>
        </BreakdownStepCard>
      )}

      {/* Step 10: Final child support payable */}
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

          {(() => {
            let totalPayment = 0;
            
            const childPayments = results.childResults?.map((child, index) => {
              // Calculate Step 8 values (before cap)
              const costPerChild = child.costPerChild ?? 0;
              const csPercB = child.childSupportPercB ?? 0;
              const step8LiabilityB = csPercB > 0 ? Math.round(costPerChild * (csPercB / 100)) : 0;
              
              // Calculate Step 9 cap
              const multiCaseCostB = results.multiCaseBreakdownB?.find(
                breakdown => breakdown.isCurrentCase && breakdown.childAge === child.age
              )?.costPerChild || 0;
              const costPercB = child.costPercB ?? 0;
              const capB = Math.round(multiCaseCostB * ((100 - costPercB) / 100));
              
              // Apply the lower amount (Step 8 vs Step 9 cap)
              const finalLiability = step8LiabilityB > 0 && capB > 0 
                ? Math.min(step8LiabilityB, capB)
                : step8LiabilityB;
              
              const capApplied = finalLiability === capB && capB < step8LiabilityB;
              
              // Check if there's an NPC for this child
              const hasNPC = (child.liabilityToNPC_B ?? 0) > 0 || (child.liabilityToNPC_A ?? 0) > 0;
              
              // If there's an NPC, split the payment equally
              let paymentToYou = 0;
              let paymentToNPC = 0;
              
              if (hasNPC && finalLiability > 0) {
                // Split equally between parent and NPC
                paymentToYou = Math.round(finalLiability / 2);
                paymentToNPC = Math.round(finalLiability / 2);
              } else if (finalLiability > 0) {
                // No NPC, all goes to parent
                paymentToYou = finalLiability;
              }
              
              totalPayment += finalLiability;
              
              return (
                <View key={index} style={[styles.childCard, dynamicStyles.childCard]}>
                  <Text style={[styles.childPaymentTitle, dynamicStyles.parentLabel]}>
                    Child {index + 1}{capApplied ? ' - Cap applied' : ''}
                  </Text>
                  
                  {/* Other Parent pays */}
                  {paymentToYou > 0 && (
                    <View style={styles.paymentRow}>
                      <Text style={[styles.paymentLabel, dynamicStyles.childLabel]}>Other Parent pays</Text>
                      <Text style={[styles.paymentValue, dynamicStyles.childValue]}>{formatCurrency(paymentToYou)}</Text>
                    </View>
                  )}
                  
                  {/* Other Parent pays NPC */}
                  {paymentToNPC > 0 && (
                    <View style={styles.paymentRow}>
                      <Text style={[styles.paymentLabel, dynamicStyles.childLabel]}>Other Parent pays NPC</Text>
                      <Text style={[styles.paymentValue, dynamicStyles.childValue]}>{formatCurrency(paymentToNPC)}</Text>
                    </View>
                  )}
                </View>
              );
            });
            
            return (
              <>
                {childPayments}
                <View style={styles.totalSection}>
                  <Text style={[styles.totalSectionLabel, dynamicStyles.totalLabel]}>OTHER PARENT PAYS</Text>
                  <Text style={[styles.totalSectionValue, dynamicStyles.totalValue]}>{formatCurrency(totalPayment)}/year</Text>
                </View>
              </>
            );
          })()}
        </>
      </BreakdownStepCard>
    </>
  );
}

const styles = StyleSheet.create({
  stepExplanation: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  childCard: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  childTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  parentRow: {
    marginBottom: 4,
  },
  parentLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  } as ViewStyle,
  formula: {
    fontSize: 13,
  },
  result: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  capSection: {
    marginTop: 8,
  },
  capCalculation: {
    fontSize: 13,
    marginTop: 4,
  },
  childPaymentTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  } as ViewStyle,
  paymentLabel: {
    fontSize: 13,
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#cbd5e1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  totalSectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalSectionValue: {
    fontSize: 18,
    fontWeight: '700',
  },
});
