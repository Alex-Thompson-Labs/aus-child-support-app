/**
 * Calculator Feature
 *
 * Public API for the calculator feature module.
 * Contains form, results, breakdown, and summary components.
 * 
 * NOTE: Heavy components should be lazy-loaded via dynamic imports
 * to reduce initial bundle size. Only lightweight components are
 * exported directly here.
 */

// Lightweight components - safe to import directly
export { CalculatorHeader } from './components/CalculatorHeader';
export { HelpTooltip } from './components/HelpTooltip';
export { PeriodPicker } from './components/PeriodPicker';
export { YearSelector } from './components/YearSelector';

// Re-export types only (no runtime cost)
export type { AnnualRateBreakdownProps } from './components/breakdown/AnnualRateBreakdown';
export type { CostPercentageRow } from './components/breakdown/constants';

// Heavy components - prefer lazy loading via:
// const CalculatorForm = lazy(() => import('@/src/features/calculator/components/CalculatorForm').then(m => ({ default: m.CalculatorForm })))
// 
// Direct exports kept for backward compatibility:
export { CalculationSummaryCard } from './components/CalculationSummaryCard';
export { CalculatorFAQ } from './components/CalculatorFAQ';
export { CalculatorForm } from './components/CalculatorForm';
export { CalculatorResults, OPEN_BREAKDOWN_EVENT, triggerOpenBreakdown } from './components/CalculatorResults';
export { ChildRow } from './components/ChildRow';
export { IncomeSupportModal } from './components/IncomeSupportModal';
export { NonParentCarerSection } from './components/NonParentCarerSection';
export { OtherCasesPopover } from './components/OtherCasesPopover';
export { RelevantDependentsPopover } from './components/RelevantDependentsPopover';
export { ResultsSimpleExplanation } from './components/ResultsSimpleExplanation';

// Results sub-components
export { FtbImpactCard } from './components/FtbImpactCard';
export { AdultChildMaintenanceCard } from './components/results/AdultChildMaintenanceCard';
export { PDFExportButton } from './components/results/PDFExportButton';
export { ResultsHero, getPayerText } from './components/results/ResultsHero';
export { Turning18Banner } from './components/results/Turning18Banner';

// Breakdown components
export { AnnualRateBreakdown } from './components/breakdown/AnnualRateBreakdown';
export { BreakdownStepCard } from './components/breakdown/BreakdownStepCard';
export { CareStep } from './components/breakdown/CareStep';
export { COST_PERCENTAGE_TABLE } from './components/breakdown/constants';
export { CostStep } from './components/breakdown/CostStep';
export { GapAnalysisCard } from './components/breakdown/GapAnalysisCard';
export { IncomeStep } from './components/breakdown/IncomeStep';
export { LiabilityStep } from './components/breakdown/LiabilityStep';
export { ParentComparisonCard } from './components/breakdown/ParentComparisonCard';
export { PercentageBar } from './components/breakdown/PercentageBar';
export { SpecialRateGlossary } from './components/breakdown/SpecialRateGlossary';
export { ZeroLiabilityNotice } from './components/breakdown/ZeroLiabilityNotice';

