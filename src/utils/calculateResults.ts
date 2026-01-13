import {
  CalculationResults,
  CalculatorFormState,
  deriveAgeRange,
} from './calculator';
import { convertCareToPercentage } from './care-utils';
import { getChildCost } from './child-support-calculations';
import { AssessmentYear, getYearConstants } from './child-support-constants';

// Import from extracted modules
import {
  applyMARFARCaps,
  applyMultiCaseCaps,
  applyRatesToChildren,
} from './engine';
import { validateCalculatorForm } from './form-validator';
import { calculateIncomes } from './income-calculator';
import { calculateChildLiability } from './liability-calculator';
import { resolvePayment } from './payment-resolver';

// Re-export for backward compatibility
export * from './engine';
export { validateCalculatorForm } from './form-validator';
export {
  calculateCSI,
  calculateIncomePercentages,
  calculateIncomes,
  createVirtualDependentChildren,
} from './income-calculator';
export type {
  IncomeCalculationInput,
  IncomeCalculationResult,
} from './income-calculator';
export {
  calculateChildLiability,
  calculateChildSupportPercentage,
  shouldPayLiability,
} from './liability-calculator';
export type { LiabilityInput, LiabilityResult } from './liability-calculator';
export {
  calculateNPCPayment,
  determinePayerRole,
  resolvePayment,
} from './payment-resolver';
export type {
  PaymentResolutionInput,
  PaymentResolutionResult,
} from './payment-resolver';

export const calculateChildSupport = (
  formState: CalculatorFormState,
  selectedYear: AssessmentYear,
  overrides?: { supportA?: boolean; supportB?: boolean }
): CalculationResults | null => {
  const errors = validateCalculatorForm(formState);
  if (Object.keys(errors).length > 0) {
    return null;
  }

  // Get year-specific constants
  const { SSA, FAR, MAR, MAX_PPS } = getYearConstants(selectedYear);

  const { relDepA, relDepB } = formState;
  // Use overrides if provided, otherwise fall back to formState
  const supportA = overrides?.supportA ?? formState.supportA;
  const supportB = overrides?.supportB ?? formState.supportB;

  // Convert children to calculation format with derived age ranges
  const children = formState.children.map((c) => {
    const ageRange = deriveAgeRange(c.age);
    return {
      age: c.age,
      ageRange,
      careA: convertCareToPercentage(c.careAmountA, c.carePeriod),
      careB: convertCareToPercentage(c.careAmountB, c.carePeriod),
    };
  });

  // Calculate all income-related values using the extracted module
  const incomeResults = calculateIncomes({
    incomeA: formState.incomeA,
    incomeB: formState.incomeB,
    relDepA,
    relDepB,
    multiCaseChildrenA: formState.multiCaseA.otherChildren,
    multiCaseChildrenB: formState.multiCaseB.otherChildren,
    currentCaseChildren: children,
    selectedYear,
  });

  const {
    ATI_A,
    ATI_B,
    relDepDeductibleA,
    relDepDeductibleB,
    preliminaryCSI_A,
    preliminaryCSI_B,
    CSI_A,
    CSI_B,
    CCSI,
    incomePercA,
    incomePercB,
    multiCaseAllowanceA,
    multiCaseAllowanceB,
  } = incomeResults;

  // Step 5: Calculate Total Cost of Children
  // Adult children (18+) are excluded from Services Australia assessment
  // They can only receive Adult Child Maintenance via court order
  const assessableChildren = children.filter((c) => c.age < 18);
  const { cost: totalCost, bracketInfo: costBracketInfo } = getChildCost(
    selectedYear,
    assessableChildren,
    CCSI
  );
  const costPerChild =
    assessableChildren.length > 0 ? totalCost / assessableChildren.length : 0;

  // Step 6–8: Calculate individual liabilities
  let totalLiabilityA = 0;
  let totalLiabilityB = 0;

  // Check if non-parent carer is enabled
  const hasNPC = formState.nonParentCarer.enabled;

  const childResults = children.map((c, childIndex) => {
    // Get NPC care from the child input (defaults to 0 if not set)
    const childInput = formState.children[childIndex];
    const rawCareNPC = hasNPC
      ? convertCareToPercentage(
          childInput?.careAmountNPC ?? 0,
          childInput?.carePeriod ?? 'fortnight'
        )
      : 0;

    // Calculate liability using the extracted module
    const liabilityResult = calculateChildLiability({
      age: c.age,
      ageRange: c.ageRange,
      careA: c.careA,
      careB: c.careB,
      careNPC: rawCareNPC,
      incomePercA,
      incomePercB,
      costPerChild,
      hasNPC,
    });

    const {
      roundedCareA,
      roundedCareB,
      roundedCareNPC,
      costPercA,
      costPercB,
      costPercNPC,
      childSupportPercA,
      childSupportPercB,
      liabilityA,
      liabilityB,
      liabilityToNPC_A,
      liabilityToNPC_B,
      isAdultChild,
      isTurning18,
    } = liabilityResult;

    // Only add liability for assessable children (not adult children)
    if (!isAdultChild) {
      totalLiabilityA += liabilityA;
      totalLiabilityB += liabilityB;
    }

    return {
      ...c,
      // Adult child flags for UI
      isAdultChild,
      isTurning18,
      // Cost per child is 0 for adult children (excluded from calculation)
      costPerChild: isAdultChild ? 0 : costPerChild,
      roundedCareA,
      roundedCareB,
      costPercA,
      costPercB,
      childSupportPercA,
      childSupportPercB,
      liabilityA,
      liabilityB,
      // Placeholder values - will be updated below
      finalLiabilityA: liabilityA,
      finalLiabilityB: liabilityB,
      farAppliedA: false,
      farAppliedB: false,
      marAppliedA: false,
      marAppliedB: false,
      // Multi-case cap fields (will be updated below)
      multiCaseCapA: undefined as number | undefined,
      multiCaseCapB: undefined as number | undefined,
      multiCaseCapAppliedA: false,
      multiCaseCapAppliedB: false,
      // NPC fields (Formula 4)
      careNPC: rawCareNPC,
      roundedCareNPC,
      costPercNPC,
      liabilityToNPC_A,
      liabilityToNPC_B,
    };
  });

  // Step 9–10: Apply Fixed Annual Rate (FAR) or Minimum Annual Rate (MAR)
  // Use the extracted rates-engine module
  const assessableChildResults = childResults.filter((c) => !c.isAdultChild);

  const ratesResult = applyRatesToChildren({
    childResults,
    eligibilityA: {
      ATI: ATI_A,
      SSA,
      MAX_PPS,
      receivesSupport: supportA,
      carePercentages: assessableChildResults.map((c) => c.roundedCareA),
      otherParentCarePercentages: assessableChildResults.map(
        (c) => c.roundedCareB
      ),
    },
    eligibilityB: {
      ATI: ATI_B,
      SSA,
      MAX_PPS,
      receivesSupport: supportB,
      carePercentages: assessableChildResults.map((c) => c.roundedCareB),
      otherParentCarePercentages: assessableChildResults.map(
        (c) => c.roundedCareA
      ),
    },
    selectedYear,
    assessableChildCount: assessableChildResults.length,
  });

  let {
    FAR_A,
    FAR_B,
    MAR_A,
    MAR_B,
    finalLiabilityA,
    finalLiabilityB,
    rateApplied,
  } = ratesResult;

  // Step 10a: Apply Multi-case Cap (Formula 3)
  // The cap limits liability for parents with children in other cases
  const hasMultiCaseA = formState.multiCaseA.otherChildren.length > 0;
  const hasMultiCaseB = formState.multiCaseB.otherChildren.length > 0;

  let multiCaseCapAppliedA = false;
  let multiCaseCapAppliedB = false;

  if (hasMultiCaseA || hasMultiCaseB) {
    // Apply multi-case caps using the extracted module
    const capsResult = applyMultiCaseCaps({
      childResults,
      hasMultiCaseA,
      hasMultiCaseB,
      preliminaryCSI_A,
      preliminaryCSI_B,
      otherChildrenA: formState.multiCaseA.otherChildren,
      otherChildrenB: formState.multiCaseB.otherChildren,
      assessableChildren,
      selectedYear,
    });

    // Update results from caps
    finalLiabilityA = capsResult.finalLiabilityA;
    finalLiabilityB = capsResult.finalLiabilityB;
    multiCaseCapAppliedA = capsResult.multiCaseCapAppliedA;
    multiCaseCapAppliedB = capsResult.multiCaseCapAppliedB;
  }

  // Step 10b: Apply MAR/FAR Multi-Case Caps (Formula 3 & 4)
  // These caps apply across ALL cases, not just per-case caps
  let marCapExplanationA: string | undefined;
  let marCapExplanationB: string | undefined;
  let farCapExplanationA: string | undefined;
  let farCapExplanationB: string | undefined;

  // Count total cases for each parent (1 current + other case children)
  const totalCasesA = 1 + formState.multiCaseA.otherChildren.length;
  const totalCasesB = 1 + formState.multiCaseB.otherChildren.length;

  // Apply MAR/FAR caps using the extracted module
  const marFarCapsResult = applyMARFARCaps({
    childResults,
    MAR_A,
    MAR_B,
    FAR_A,
    FAR_B,
    hasMultiCaseA,
    hasMultiCaseB,
    totalCasesA,
    totalCasesB,
    selectedYear,
  });

  // Update results from MAR/FAR caps
  finalLiabilityA = marFarCapsResult.finalLiabilityA;
  finalLiabilityB = marFarCapsResult.finalLiabilityB;
  MAR_A = marFarCapsResult.MAR_A;
  MAR_B = marFarCapsResult.MAR_B;
  FAR_A = marFarCapsResult.FAR_A;
  FAR_B = marFarCapsResult.FAR_B;
  marCapExplanationA = marFarCapsResult.marCapExplanationA;
  marCapExplanationB = marFarCapsResult.marCapExplanationB;
  farCapExplanationA = marFarCapsResult.farCapExplanationA;
  farCapExplanationB = marFarCapsResult.farCapExplanationB;

  // Determine rate applied string
  // (Already calculated by rates-engine, but may be updated by multi-case caps below)

  // Final Payment Calculation - use extracted payment-resolver module
  const paymentResult = resolvePayment({
    finalLiabilityA,
    finalLiabilityB,
    FAR_A,
    FAR_B,
    MAR_A,
    MAR_B,
    rateApplied,
    childResults,
    hasNPC,
  });

  const { payer, receiver, finalPaymentAmount, payerRole, paymentToNPC } =
    paymentResult;

  // Update rateApplied based on payment resolution
  let finalRateApplied = rateApplied;
  if (rateApplied.startsWith('FAR') && FAR_A > 0 && FAR_B > 0) {
    finalRateApplied = 'FAR (Both)';
  } else if (rateApplied.startsWith('MAR') && MAR_A > 0 && MAR_B > 0) {
    finalRateApplied = 'MAR (Both)';
  }

  return {
    ATI_A,
    ATI_B,
    relDepDeductibleA,
    relDepDeductibleB,
    SSA,
    FAR,
    MAR,
    MAX_PPS,
    CSI_A,
    CSI_B,
    CCSI,
    incomePercA,
    incomePercB,
    totalCost,
    costBracketInfo,
    childResults,
    totalLiabilityA,
    totalLiabilityB,
    finalLiabilityA,
    finalLiabilityB,
    FAR_A,
    FAR_B,
    MAR_A,
    MAR_B,
    rateApplied: finalRateApplied,
    payer,
    receiver,
    finalPaymentAmount,
    // Multi-case fields (Formula 3)
    multiCaseAllowanceA,
    multiCaseAllowanceB,
    multiCaseCapAppliedA,
    multiCaseCapAppliedB,
    // MAR/FAR cap explanations
    marCapExplanationA,
    marCapExplanationB,
    farCapExplanationA,
    farCapExplanationB,
    // NPC fields (Formula 4)
    payerRole,
    paymentToNPC,
  };
};
