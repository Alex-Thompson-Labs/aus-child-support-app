/**
 * Calculator Feature
 *
 * Public API for the calculator feature module.
 * Contains form, results, breakdown, and summary components.
 */

// Main components
export { CalculationSummaryCard } from './components/CalculationSummaryCard';
export { CalculatorForm } from './components/CalculatorForm';
export { CalculatorResults, OPEN_BREAKDOWN_EVENT, triggerOpenBreakdown } from './components/CalculatorResults';
export { ResultsSimpleExplanation } from './components/ResultsSimpleExplanation';

// Form sub-components
export { CalculatorFAQ } from './components/CalculatorFAQ';
export { ChildRow } from './components/ChildRow';
export { HelpTooltip } from './components/HelpTooltip';
export { IncomeSupportModal } from './components/IncomeSupportModal';
export { NonParentCarerSection } from './components/NonParentCarerSection';
export { OtherCasesPopover } from './components/OtherCasesPopover';
export { PeriodPicker } from './components/PeriodPicker';
export { RelevantDependentsPopover } from './components/RelevantDependentsPopover';
export { YearSelector } from './components/YearSelector';

// Results sub-components
export { FtbImpactCard } from './components/FtbImpactCard';
export { AdultChildMaintenanceCard } from './components/results/AdultChildMaintenanceCard';
export { PDFExportButton } from './components/results/PDFExportButton';
export { ResultsHero, getPayerText } from './components/results/ResultsHero';
export { Turning18Banner } from './components/results/Turning18Banner';

// Breakdown components
export { AnnualRateBreakdown } from './components/breakdown/AnnualRateBreakdown';
export type { AnnualRateBreakdownProps } from './components/breakdown/AnnualRateBreakdown';
export { BreakdownStepCard } from './components/breakdown/BreakdownStepCard';
export { CareStep } from './components/breakdown/CareStep';
export { COST_PERCENTAGE_TABLE } from './components/breakdown/constants';
export type { CostPercentageRow } from './components/breakdown/constants';
export { CostStep } from './components/breakdown/CostStep';
export { GapAnalysisCard } from './components/breakdown/GapAnalysisCard';
export { IncomeStep } from './components/breakdown/IncomeStep';
export { LiabilityStep } from './components/breakdown/LiabilityStep';
export { ParentComparisonCard } from './components/breakdown/ParentComparisonCard';
export { PercentageBar } from './components/breakdown/PercentageBar';
export { SpecialRateGlossary } from './components/breakdown/SpecialRateGlossary';
export { ZeroLiabilityNotice } from './components/breakdown/ZeroLiabilityNotice';
export { ZeroPaymentScenario } from './components/breakdown/ZeroPaymentScenario';

