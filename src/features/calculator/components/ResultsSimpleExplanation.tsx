import type { CalculationResults } from '@/src/utils/calculator';
import React, { Suspense, lazy } from 'react';
import { BreakdownLoadingFallback } from './breakdown/BreakdownLoadingFallback';

// Lazy load the breakdown view to reduce initial bundle size
// This component tree is only loaded when the results modal is opened
const BreakdownView = lazy(() =>
  import('./breakdown/BreakdownView').then((module) => ({
    default: module.BreakdownView,
  }))
);

interface ResultsSimpleExplanationProps {
  results: CalculationResults;
  formState: { supportA: boolean; supportB: boolean };
  hasDeceasedParent?: boolean;
}

/**
 * Orchestrator component for the child support calculation breakdown.
 * 
 * Uses React.lazy and Suspense to code-split the breakdown view,
 * reducing the initial bundle size. The breakdown components are only
 * loaded when the user views the results, improving initial page load performance.
 * 
 * Composes 8 calculation steps using specialised sub-components:
 * - IncomeStep (Steps 1-3): Child Support Income, Combined Income, Income Percentage
 * - CareStep (Step 4): Care Percentage per child
 * - CostStep (Steps 5-7): Cost Percentage, Child Support Percentage, Cost of Children
 * - LiabilityStep (Step 8): Annual Rate breakdown
 */
export function ResultsSimpleExplanation({
  results,
  formState,
  hasDeceasedParent = false,
}: ResultsSimpleExplanationProps) {
  return (
    <Suspense fallback={<BreakdownLoadingFallback />}>
      <BreakdownView results={results} formState={formState} hasDeceasedParent={hasDeceasedParent} />
    </Suspense>
  );
}
