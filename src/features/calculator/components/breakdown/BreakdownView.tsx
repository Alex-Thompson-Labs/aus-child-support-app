import type { CalculationResults } from '@/src/utils/calculator';
import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { CareStep } from './CareStep';
import { CostStep } from './CostStep';
import { Formula5BreakdownView } from './Formula5BreakdownView';
import { Formula6BreakdownView } from './Formula6BreakdownView';
import { IncomeStep } from './IncomeStep';
import { LiabilityStep } from './LiabilityStep';
import { ZeroLiabilityNotice } from './ZeroLiabilityNotice';

interface BreakdownViewProps {
  results: CalculationResults;
  formState: { supportA: boolean; supportB: boolean };
  hasDeceasedParent?: boolean;
}

/**
 * Lazy-loadable breakdown view containing all calculation steps.
 * 
 * This component is designed to be loaded on-demand when the user
 * expands the breakdown view, reducing initial bundle size.
 */
export function BreakdownView({ results, formState, hasDeceasedParent = false }: BreakdownViewProps) {
  // Check if this is a Formula 5 (non-reciprocating jurisdiction) or Formula 6 (deceased parent) case
  // Both formulas use only one parent's income, so we hide the "OTHER PARENT" sections
  const isFormula5 = (results as any).formulaUsed === 5;
  const isFormula6 = (results as any).formulaUsed === 6;
  const hideOtherParent = hasDeceasedParent || isFormula5 || isFormula6;
  
  // If Formula 5, use dedicated Formula 5 breakdown
  if (isFormula5) {
    return <Formula5BreakdownView results={results} formState={formState} />;
  }
  
  // If Formula 6, use dedicated Formula 6 breakdown
  if (isFormula6) {
    return <Formula6BreakdownView results={results} formState={formState} />;
  }
  
  // Collapsible state management - 8-Step Formula
  const [expandedSteps, setExpandedSteps] = useState({
    step1: false, // Child Support Income - collapsed
    step2: false, // Combined Income - collapsed
    step3: false, // Income Percentage - collapsed
    step4: false, // Care Percentage - collapsed
    step5: false, // Cost Percentage - collapsed
    step6: false, // Child Support Percentage - collapsed
    step7: false, // Cost of Children - collapsed
    step8: true, // Annual Rate - expanded by default
  });

  const handleIncomeToggle = (step: 'step1' | 'step2' | 'step3') => {
    setExpandedSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  const handleCostToggle = (step: 'step5' | 'step6' | 'step7') => {
    setExpandedSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  return (
    <View style={styles.container}>
      {/* Steps 1-3: Income Calculation */}
      <IncomeStep
        results={results}
        expandedSteps={{
          step1: expandedSteps.step1,
          step2: expandedSteps.step2,
          step3: expandedSteps.step3,
        }}
        onToggle={handleIncomeToggle}
        hasDeceasedParent={hideOtherParent}
      />

      {/* Step 4: Care Percentage */}
      <CareStep
        results={results}
        isExpanded={expandedSteps.step4}
        onToggle={() =>
          setExpandedSteps((prev) => ({ ...prev, step4: !prev.step4 }))
        }
        hasDeceasedParent={hideOtherParent}
      />

      {/* Steps 5-7: Cost Calculation */}
      <CostStep
        results={results}
        expandedSteps={{
          step5: expandedSteps.step5,
          step6: expandedSteps.step6,
          step7: expandedSteps.step7,
        }}
        onToggle={handleCostToggle}
        hasDeceasedParent={hideOtherParent}
      />

            {/* Step 8: Annual Rate / Liability */}
      <LiabilityStep
        results={results}
        formState={formState}
        isExpanded={expandedSteps.step8}
        onToggle={() =>
          setExpandedSteps((prev) => ({ ...prev, step8: !prev.step8 }))
        }
        hasDeceasedParent={hideOtherParent}
      />

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
