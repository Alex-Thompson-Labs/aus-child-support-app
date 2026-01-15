/**
 * Breakdown components barrel file
 * 
 * Exports all breakdown-related components for easier imports.
 * Individual step components can be imported directly or lazily loaded
 * through the BreakdownView component.
 */

// Main breakdown view (lazy-loadable)
export { BreakdownView } from './BreakdownView';

// Loading fallback for Suspense
export { BreakdownLoadingFallback } from './BreakdownLoadingFallback';

// Individual step components
export { IncomeStep } from './IncomeStep';
export { CareStep } from './CareStep';
export { CostStep } from './CostStep';
export { LiabilityStep } from './LiabilityStep';

// Supporting components
export { BreakdownStepCard } from './BreakdownStepCard';
export { AnnualRateBreakdown } from './AnnualRateBreakdown';
export { ZeroLiabilityNotice } from './ZeroLiabilityNotice';
export { PercentageBar } from './PercentageBar';
export { SpecialRateGlossary } from './SpecialRateGlossary';
export { GapAnalysisCard } from './GapAnalysisCard';
export { ParentComparisonCard } from './ParentComparisonCard';

// Constants
export * from './constants';
