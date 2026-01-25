import {
    CalculationResultUnion,
    CalculatorFormState,
    ComplexityTrapCalculationResult,
    deriveAgeRangeMemoized
} from './calculator';
import { convertCareToPercentage } from './care-utils';
import { getChildCost } from './child-support-calculations';
import { AssessmentYear, getYearConstants } from './child-support-constants';
import { detectComplexityTrap } from './complexity-detection';

// Import from extracted modules
import { mapCareToCostPercent, roundCarePercentage } from './care-utils';
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
    createVirtualDependentChildren
} from './income-calculator';
export type {
    IncomeCalculationInput,
    IncomeCalculationResult
} from './income-calculator';
export {
    calculateChildLiability,
    calculateChildSupportPercentage,
    shouldPayLiability
} from './liability-calculator';
export type { LiabilityInput, LiabilityResult } from './liability-calculator';
export {
    calculateNPCPayment,
    calculateTwoNPCPaymentSplit,
    determinePayerRole,
    resolvePayment
} from './payment-resolver';
export type {
    PaymentResolutionInput,
    PaymentResolutionResult
} from './payment-resolver';

export const calculateChildSupport = (
  formState: CalculatorFormState,
  selectedYear: AssessmentYear,
  overrides?: { supportA?: boolean; supportB?: boolean }
): CalculationResultUnion | null => {
  const errors = validateCalculatorForm(formState);
  if (Object.keys(errors).length > 0) {
    return null;
  }

  // =========================================================================
  // Formula 5 Check - Non-parent carer with overseas parent in non-reciprocating jurisdiction
  // =========================================================================
  if (
    formState.nonParentCarer.enabled &&
    formState.nonParentCarer.hasOverseasParent &&
    formState.nonParentCarer.overseasParentCountry
  ) {
    const jurisdictionStatus = checkJurisdictionStatus(
      formState.nonParentCarer.overseasParentCountry
    );
    
    if (shouldUseFormula5(jurisdictionStatus)) {
      // Formula 5 applies - use simplified calculation with one parent's income
      // Determine which parent is available (the one NOT overseas)
      // For now, assume Parent A is the Australian resident parent
      // TODO: Add UI to specify which parent is overseas
      
      const formula5Input: Formula5Input = {
        availableParentATI: formState.incomeA,
        availableParentCarePercentage: 0, // NPC has care, parent typically has 0%
        children: formState.children.map(c => ({ age: c.age })),
        hasMultipleCases: formState.multiCaseA.otherChildren.length > 0,
        otherCaseChildren: formState.multiCaseA.otherChildren,
        numberOfNonParentCarers: formState.nonParentCarer.hasSecondNPC ? 2 : 1,
        carer1CarePercentage: formState.nonParentCarer.hasSecondNPC ? 60 : 100, // TODO: Get from form
        carer2CarePercentage: formState.nonParentCarer.hasSecondNPC ? 40 : undefined, // TODO: Get from form
        reason: 'non-reciprocating',
        overseasParentCountry: formState.nonParentCarer.overseasParentCountry,
        selectedYear,
      };
      
      try {
        const formula5Result = calculateFormula5(formula5Input);
        // Convert Formula5Result to CalculationResults format for compatibility
        // This is a simplified conversion - full integration would require updating CalculationResults type
        return formula5Result as any; // TODO: Proper type integration
      } catch (error) {
        console.error('Formula 5 calculation error:', error);
        return null;
      }
    }
  }

  // =========================================================================
  // Lead Trap Check - bypass calculation for complex NPC scenarios (Formula 6)
  // =========================================================================
  const trapResult = detectComplexityTrap(
    formState.nonParentCarer,
    formState.multiCaseA.otherChildren.length > 0,
    formState.multiCaseB.otherChildren.length > 0
  );

  if (trapResult.isTrapped) {
    // Return trap result instead of attempting calculation
    return {
      resultType: 'COMPLEXITY_TRAP',
      trapReason: trapResult.reason!,
      displayReason: trapResult.displayReason!,
    } as ComplexityTrapCalculationResult;
  }

  // Get year-specific constants
  const { SSA, FAR, MAR, MAX_PPS } = getYearConstants(selectedYear);

  const { relDepA, relDepB } = formState;
  // Use overrides if provided, otherwise fall back to formState
  const supportA = overrides?.supportA ?? formState.supportA;
  const supportB = overrides?.supportB ?? formState.supportB;

  // Convert children to calculation format with derived age ranges
  // Use memoized version to avoid redundant calculations in loops
  const children = formState.children.map((c) => {
    const ageRange = deriveAgeRangeMemoized(c.age);
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
  // Optimize: Single pass to filter and extract care percentages
  const assessableChildResults: typeof childResults = [];
  const carePercentagesA: number[] = [];
  const carePercentagesB: number[] = [];
  const otherParentCarePercentagesA: number[] = [];
  const otherParentCarePercentagesB: number[] = [];

  for (const child of childResults) {
    if (!child.isAdultChild) {
      assessableChildResults.push(child);
      carePercentagesA.push(child.roundedCareA);
      carePercentagesB.push(child.roundedCareB);
      otherParentCarePercentagesA.push(child.roundedCareB);
      otherParentCarePercentagesB.push(child.roundedCareA);
    }
  }

  const ratesResult = applyRatesToChildren({
    childResults,
    eligibilityA: {
      ATI: ATI_A,
      SSA,
      MAX_PPS,
      receivesSupport: supportA,
      carePercentages: carePercentagesA,
      otherParentCarePercentages: otherParentCarePercentagesA,
    },
    eligibilityB: {
      ATI: ATI_B,
      SSA,
      MAX_PPS,
      receivesSupport: supportB,
      carePercentages: carePercentagesB,
      otherParentCarePercentages: otherParentCarePercentagesB,
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

  // Formula 2: If NPC exists and Rate (MAR/FAR) was applied, redirect liability to NPC
  if (hasNPC) {
    // Single pass: redirect liabilities and sum final liabilities
    finalLiabilityA = 0;
    finalLiabilityB = 0;

    for (const child of childResults) {
      if (!child.isAdultChild) {
        // Parent A redirection
        if (child.marAppliedA || child.farAppliedA) {
          child.liabilityToNPC_A = child.finalLiabilityA;
          child.finalLiabilityA = 0;
        }
        // Parent B redirection
        if (child.marAppliedB || child.farAppliedB) {
          child.liabilityToNPC_B = child.finalLiabilityB;
          child.finalLiabilityB = 0;
        }

        // Accumulate final liabilities in same pass
        finalLiabilityA += child.finalLiabilityA;
        finalLiabilityB += child.finalLiabilityB;
      }
    }
  }

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

  // Formula 2/4: Handle Two NPCs (payment split)
  let paymentToNPC1: number | undefined;
  let paymentToNPC2: number | undefined;

  if (hasNPC && formState.nonParentCarer.hasSecondNPC && paymentToNPC && paymentToNPC > 0) {
    // Calculate cost percentages for both NPCs from first child
    // (All children should have same NPC care percentages in current implementation)
    const firstChild = childResults[0];
    if (firstChild && firstChild.costPercNPC !== undefined) {
      // Get second NPC care from first child
      const childInput = formState.children[0];
      const rawCareNPC2 = childInput?.careAmountNPC2
        ? convertCareToPercentage(childInput.careAmountNPC2, childInput.carePeriod)
        : 0;
      
      const roundedCareNPC2 = roundCarePercentage(rawCareNPC2);
      const costPercNPC2 = mapCareToCostPercent(roundedCareNPC2);

      // Use the two NPC split function
      const npcSplit = calculateTwoNPCPaymentSplit(
        paymentToNPC,
        firstChild.costPercNPC,
        costPercNPC2
      );

      paymentToNPC1 = npcSplit.paymentToNPC1;
      paymentToNPC2 = npcSplit.paymentToNPC2;
    }
  }

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
    // NPC fields (Formula 2/4)
    payerRole,
    paymentToNPC,
    // Two NPC payment split (Formula 2/4)
    paymentToNPC1,
    paymentToNPC2,
  };
};
