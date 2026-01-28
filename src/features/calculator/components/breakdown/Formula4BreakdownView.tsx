import type { CalculationResults } from '@/src/utils/calculator';
import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { CareStep } from './CareStep';
import { CostStep } from './CostStep';
import { DualNPCStep } from './DualNPCStep';
import { Formula4LiabilityStep } from './Formula4LiabilityStep';
import { IncomeStep } from './IncomeStep';
import { ZeroLiabilityNotice } from './ZeroLiabilityNotice';

interface Formula4BreakdownViewProps {
  results: CalculationResults;
  formState: { supportA: boolean; supportB: boolean };
}

/**
 * Formula 4 Breakdown View
 * 
 * Displays the calculation breakdown for Formula 4 (multi-case with non-parent carer).
 * Formula 4 = Formula 3 + Formula 2 combined
 * 
 * Steps:
 * - Steps 1-6: Income and percentage calculations (with multi-case allowance)
 * - Steps 7-10: Liability calculations with multi-case cap and NPC payment rules
 * - Step 11: Dual NPC split (if applicable)
 * - Step 12: Final payment determination
 */
export function Formula4BreakdownView({ results, formState }: Formula4BreakdownViewProps) {
  // Determine multi-case context
  const hasMultiCaseA = results.multiCaseAllowanceA !== undefined && results.multiCaseAllowanceA > 0;
  const hasMultiCaseB = results.multiCaseAllowanceB !== undefined && results.multiCaseAllowanceB > 0;
  
  // Collapsible state management
  const [expandedSteps, setExpandedSteps] = useState({
    step1: false, // Child Support Income - collapsed
    step2: false, // Combined Income & Income Percentage - collapsed
    step3: false, // Income Percentage - collapsed
    step4: false, // Care Percentage - collapsed
    step5: false, // Cost Percentage - collapsed
    step6: false, // Child Support Percentage - collapsed
    step7: false, // COTC for the day (Step 7) - collapsed
    step8: false, // Child support payable per child (Step 8) - collapsed
    step9: false, // Multi-case cap (Step 9) - collapsed
    step10: true, // Final child support payable (Step 10) - expanded by default
    step11: false, // Dual NPC split (Step 11) - collapsed
  });

  // Check if dual NPC scenario (2 non-parent carers receiving payments)
  const hasDualNPC = 
    (results.paymentToNPC1 !== undefined && results.paymentToNPC1 > 0) &&
    (results.paymentToNPC2 !== undefined && results.paymentToNPC2 > 0);

  const handleIncomeToggle = (step: 'step1' | 'step2' | 'step3') => {
    setExpandedSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  const handleCostToggle = (step: 'step5' | 'step6') => {
    setExpandedSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  const handleLiabilityToggle = (step: 'step7' | 'step8' | 'step9' | 'step10') => {
    setExpandedSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  return (
    <View style={styles.container}>
      {/* Steps 1-3: Income Calculation (with multi-case allowance) */}
      <IncomeStep
        results={results}
        expandedSteps={{
          step1: expandedSteps.step1,
          step2: expandedSteps.step2,
          step3: expandedSteps.step3,
        }}
        onToggle={handleIncomeToggle}
        hasDeceasedParent={false}
        hideCurrentCaseMultiCostCalcs={false}
      />

      {/* Step 4: Care Percentage (includes NPC) */}
      <CareStep
        results={results}
        isExpanded={expandedSteps.step4}
        onToggle={() =>
          setExpandedSteps((prev) => ({ ...prev, step4: !prev.step4 }))
        }
        hasDeceasedParent={false}
      />

      {/* Steps 5-6: Cost Percentage & Child Support Percentage */}
      <CostStep
        results={results}
        expandedSteps={{
          step5: expandedSteps.step5,
          step6: expandedSteps.step6,
        }}
        onToggle={handleCostToggle}
        hasDeceasedParent={false}
      />

      {/* Steps 7-10: Liability Calculation (Formula 4 specific) */}
      <Formula4LiabilityStep
        results={results}
        formState={formState}
        expandedSteps={{
          step7: expandedSteps.step7,
          step8: expandedSteps.step8,
          step9: expandedSteps.step9,
          step10: expandedSteps.step10,
        }}
        onToggle={handleLiabilityToggle}
      />

      {/* Step 11: Dual NPC Payment Split (only shown when 2 NPCs receive payments) */}
      {hasDualNPC && (
        <DualNPCStep
          results={results}
          isExpanded={expandedSteps.step11}
          onToggle={() =>
            setExpandedSteps((prev) => ({ ...prev, step11: !prev.step11 }))
          }
        />
      )}

      {/* Zero liability notice at the end */}
      <ZeroLiabilityNotice results={results} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  } as ViewStyle,
});
