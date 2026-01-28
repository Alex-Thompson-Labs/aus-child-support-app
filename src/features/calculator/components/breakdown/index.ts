/**
 * Breakdown components barrel file
 * 
 * Exports all breakdown-related components for easier imports.
 * Individual step components can be imported directly or lazily loaded
 * through the BreakdownView component.
 */

// Main breakdown view (lazy-loadable)
export { BreakdownView } from './BreakdownView';
export { Formula3BreakdownView } from './Formula3BreakdownView';
export { Formula5BreakdownView } from './Formula5BreakdownView';
export { Formula6BreakdownView } from './Formula6BreakdownView';

// Loading fallback for Suspense
export { BreakdownLoadingFallback } from './BreakdownLoadingFallback';

// Individual step components
export { CareStep } from './CareStep';
export { CostStep } from './CostStep';
export { IncomeStep } from './IncomeStep';
export { LiabilityStep } from './LiabilityStep';

// Supporting components
export { AnnualRateBreakdown } from './AnnualRateBreakdown';
export { BreakdownStepCard } from './BreakdownStepCard';
export { GapAnalysisCard } from './GapAnalysisCard';
export { ParentComparisonCard } from './ParentComparisonCard';
export { PercentageBar } from './PercentageBar';
export { SpecialRateGlossary } from './SpecialRateGlossary';
export { ZeroLiabilityNotice } from './ZeroLiabilityNotice';

// Constants
export * from './constants';
