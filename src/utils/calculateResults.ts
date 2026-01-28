import {
    CalculationResults,
    CalculationResultUnion,
    CalculatorFormState,
    ComplexityTrapCalculationResult,
    deriveAgeRangeMemoized
} from './calculator';
import { convertCareToPercentage } from './care-utils';
import { getChildCost } from './child-support-calculations';
import { AssessmentYear, getYearConstants } from './child-support-constants';
import { detectComplexityTrap } from './complexity-detection';
import { calculateFormula5, type Formula5Input } from './formula-5-calculator';
import { calculateFormula6, type Formula6Input } from './formula-6-calculator';
import { checkJurisdictionStatus } from './jurisdiction-checker';

// Import from extracted modules
import { roundCarePercentage } from './care-utils';
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
    determinePayerRole,
    resolvePayment
} from './payment-resolver';
export type {
    PaymentResolutionInput,
    PaymentResolutionResult
} from './payment-resolver';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Determines if Formula 5 should be used based on jurisdiction status.
 * Formula 5 applies when parent is in non-reciprocating jurisdiction.
 */
function shouldUseFormula5(status: 'reciprocating' | 'non-reciprocating' | 'excluded'): boolean {
  return status === 'non-reciprocating';
}

// ============================================================================
// Main Calculation Function
// ============================================================================

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
  // Formula 6 Check - Non-parent carer with deceased parent
  // =========================================================================
  if (
    formState.nonParentCarer.enabled &&
    formState.nonParentCarer.hasDeceasedParent
  ) {
    // Formula 6 applies - use single parent income (deceased parent has no capacity)
    // Parent A is the surviving parent, calculate their actual care percentage
    
    // Calculate Parent A's average care percentage across all children
    const parentACarePercentages = formState.children.map(child => 
      convertCareToPercentage(child.careAmountA, child.carePeriod)
    );
    const avgParentACare = parentACarePercentages.reduce((sum, pct) => sum + pct, 0) / parentACarePercentages.length;
    
    const formula6Input: Formula6Input = {
      survivingParentATI: formState.incomeA,
      survivingParentCarePercentage: avgParentACare, // Use actual care percentage from form
      children: formState.children.map(c => ({ 
        age: c.age,
        careA: convertCareToPercentage(c.careAmountA, c.carePeriod),
        careB: convertCareToPercentage(c.careAmountB, c.carePeriod),
      })),
      hasMultipleCases: formState.multiCaseA.otherChildren.length > 0,
      otherCaseChildren: formState.multiCaseA.otherChildren,
      numberOfNonParentCarers: formState.nonParentCarer.hasSecondNPC ? 2 : 1,
      carer1CarePercentage: formState.nonParentCarer.hasSecondNPC ? 60 : 100, // TODO: Get from form
      carer2CarePercentage: formState.nonParentCarer.hasSecondNPC ? 40 : undefined, // TODO: Get from form
      selectedYear,
    };
    
    try {
      const formula6Result = calculateFormula6(formula6Input);
      
      // Calculate cost bracket info for Step 7 display
      // Formula 6 does NOT double income, so use survivingParentCSI
      const { cost: totalCost, bracketInfo: costBracketInfo } = getChildCost(
        selectedYear,
        formula6Input.children.map(c => ({ age: c.age, careA: 0, careB: 0 })),
        formula6Result.survivingParentCSI
      );
      
      // Map Formula 6 result to standard CalculationResults structure
      const mappedResult: CalculationResults = {
        formulaUsed: 6, // Add formula identifier
        ATI_A: formula6Result.survivingParentATI,
        ATI_B: 0, // Deceased parent
        relDepDeductibleA: 0, // TODO: Add if needed
        relDepDeductibleB: 0,
        SSA: getYearConstants(selectedYear).SSA,
        FAR: getYearConstants(selectedYear).FAR,
        MAR: getYearConstants(selectedYear).MAR,
        MAX_PPS: getYearConstants(selectedYear).MAX_PPS,
        CSI_A: formula6Result.survivingParentCSI,
        CSI_B: 0, // Deceased parent
        CCSI: formula6Result.survivingParentCSI,
        incomePercA: 100, // Surviving parent has 100% of income
        incomePercB: 0,
        totalCost: formula6Result.cotc,
        costBracketInfo, // Add bracket info for Step 7 display
        childResults: formula6Result.childResults.map(child => ({
          age: child.age,
          ageRange: child.ageRange,
          isAdultChild: child.isAdultChild,
          isTurning18: child.age === 17,
          careA: formula6Result.parentCarePercentage,
          careB: 0,
          costPerChild: child.costPerChild,
          roundedCareA: formula6Result.parentCarePercentage,
          roundedCareB: 0,
          costPercA: formula6Result.parentCostPercentage,
          costPercB: 0,
          childSupportPercA: Math.max(0, 100 - formula6Result.parentCostPercentage), // Income% - Cost% = CS% (no halving in Formula 6)
          childSupportPercB: 0,
          liabilityA: formula6Result.annualRate,
          liabilityB: 0,
          finalLiabilityA: formula6Result.annualRate,
          finalLiabilityB: 0,
          farAppliedA: false,
          farAppliedB: false,
          marAppliedA: false,
          marAppliedB: false,
          multiCaseCapAppliedA: formula6Result.multiCaseCapApplied,
          multiCaseCapAppliedB: false,
        })),
        totalLiabilityA: formula6Result.annualRate,
        totalLiabilityB: 0,
        finalLiabilityA: formula6Result.annualRate,
        finalLiabilityB: 0,
        FAR_A: 0,
        FAR_B: 0,
        MAR_A: 0,
        MAR_B: 0,
        rateApplied: 'None', // Formula 6 doesn't use MAR/FAR
        payer: 'Parent A', // Surviving parent pays to NPC
        receiver: 'Non-Parent Carer',
        finalPaymentAmount: formula6Result.annualRate,
        multiCaseAllowanceA: formula6Result.multiCaseAllowance,
        multiCaseAllowanceB: 0,
        multiCaseCapA: formula6Result.multiCaseCap,
        multiCaseCapB: undefined,
        multiCaseCapAppliedA: formula6Result.multiCaseCapApplied,
        multiCaseCapAppliedB: false,
        multiCaseCapBracketInfoA: formula6Result.multiCaseCapBracketInfo,
        multiCaseCapBracketInfoB: undefined,
        totalChildrenAllCasesA: formula6Result.totalChildrenAllCases,
        payerRole: 'paying_parent',
        paymentToNPC: formula6Result.annualRate,
      } as any; // Type assertion needed for formulaUsed property
      
      return mappedResult;
    } catch (error) {
      console.error('Formula 6 calculation error:', error);
      return null;
    }
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
      
      // Calculate Parent A's average care percentage across all children
      const parentACarePercentages = formState.children.map(child => 
        convertCareToPercentage(child.careAmountA, child.carePeriod)
      );
      const avgParentACare = parentACarePercentages.reduce((sum, pct) => sum + pct, 0) / parentACarePercentages.length;
      
      // Calculate NPC's average care percentage across all children
      const npcCarePercentages = formState.children.map(child => 
        convertCareToPercentage(child.careAmountNPC ?? 0, child.carePeriod)
      );
      const avgNPCCare = npcCarePercentages.reduce((sum, pct) => sum + pct, 0) / npcCarePercentages.length;
      
      // Calculate NPC2's average care percentage if applicable
      let avgNPC2Care = 0;
      if (formState.nonParentCarer.hasSecondNPC) {
        const npc2CarePercentages = formState.children.map(child => 
          convertCareToPercentage(child.careAmountNPC2 ?? 0, child.carePeriod)
        );
        avgNPC2Care = npc2CarePercentages.reduce((sum, pct) => sum + pct, 0) / npc2CarePercentages.length;
      }
      
      const formula5Input: Formula5Input = {
        availableParentATI: formState.incomeA,
        availableParentCarePercentage: avgParentACare,
        children: formState.children.map(c => ({ 
          age: c.age,
          careA: convertCareToPercentage(c.careAmountA, c.carePeriod),
          careB: convertCareToPercentage(c.careAmountB, c.carePeriod),
        })),
        hasMultipleCases: formState.multiCaseA.otherChildren.length > 0,
        otherCaseChildren: formState.multiCaseA.otherChildren,
        numberOfNonParentCarers: formState.nonParentCarer.hasSecondNPC ? 2 : 1,
        carer1CarePercentage: avgNPCCare,
        carer2CarePercentage: formState.nonParentCarer.hasSecondNPC ? avgNPC2Care : undefined,
        reason: 'non-reciprocating',
        overseasParentCountry: formState.nonParentCarer.overseasParentCountry,
        selectedYear,
      };
      
      try {
        const formula5Result = calculateFormula5(formula5Input);
        
        // Use bracket info from Formula 5 result (already calculated with doubled income)
        const costBracketInfo = formula5Result.costBracketInfo;
        
        // Map Formula 5 result to standard CalculationResults structure
        const mappedResult: CalculationResults = {
          formulaUsed: 5, // Add formula identifier
          ATI_A: formula5Result.availableParentATI,
          ATI_B: 0, // Overseas parent in non-reciprocating jurisdiction
          relDepDeductibleA: 0, // TODO: Add if needed
          relDepDeductibleB: 0,
          SSA: getYearConstants(selectedYear).SSA,
          FAR: getYearConstants(selectedYear).FAR,
          MAR: getYearConstants(selectedYear).MAR,
          MAX_PPS: getYearConstants(selectedYear).MAX_PPS,
          CSI_A: formula5Result.availableParentCSI,
          CSI_B: 0, // Overseas parent
          CCSI: formula5Result.doubledIncome, // Use doubled income for CCSI display
          incomePercA: 100, // Available parent has 100% of income
          incomePercB: 0,
          totalCost: formula5Result.cotc,
          costBracketInfo, // Use bracket info from Formula 5 result
          childResults: formula5Result.childResults.map(child => ({
            age: child.age,
            ageRange: child.ageRange,
            isAdultChild: child.isAdultChild,
            isTurning18: child.age === 17,
            careA: formula5Result.parentCarePercentage,
            careB: 0,
            costPerChild: child.costPerChild,
            roundedCareA: formula5Result.parentCarePercentage,
            roundedCareB: 0,
            costPercA: formula5Result.parentCostPercentage,
            costPercB: 0,
            childSupportPercA: Math.max(0, 100 - formula5Result.parentCostPercentage), // Income% - Cost% = CS%
            childSupportPercB: 0,
            liabilityA: formula5Result.annualRate,
            liabilityB: 0,
            finalLiabilityA: formula5Result.annualRate,
            finalLiabilityB: 0,
            farAppliedA: false,
            farAppliedB: false,
            marAppliedA: false,
            marAppliedB: false,
            multiCaseCapAppliedA: formula5Result.multiCaseCapApplied,
            multiCaseCapAppliedB: false,
          })),
          totalLiabilityA: formula5Result.annualRate,
          totalLiabilityB: 0,
          finalLiabilityA: formula5Result.annualRate,
          finalLiabilityB: 0,
          FAR_A: 0,
          FAR_B: 0,
          MAR_A: 0,
          MAR_B: 0,
          rateApplied: 'None', // Formula 5 doesn't use MAR/FAR
          payer: 'Parent A', // Available parent pays to NPC
          receiver: 'Non-Parent Carer',
          finalPaymentAmount: formula5Result.annualRate,
          multiCaseAllowanceA: formula5Result.multiCaseAllowance,
          multiCaseAllowanceB: 0,
          multiCaseCapA: formula5Result.multiCaseCap,
          multiCaseCapB: undefined,
          multiCaseCapAppliedA: formula5Result.multiCaseCapApplied,
          multiCaseCapAppliedB: false,
          multiCaseCapBracketInfoA: formula5Result.multiCaseCapBracketInfo,
          multiCaseCapBracketInfoB: undefined,
          totalChildrenAllCasesA: formula5Result.totalChildrenAllCases,
          payerRole: 'paying_parent',
          paymentToNPC: formula5Result.annualRate,
        } as any; // Type assertion needed for formulaUsed property
        
        return mappedResult;
      } catch (error) {
        console.error('Formula 5 calculation error:', error);
        return null;
      }
    }
  }

  // =========================================================================
  // Lead Trap Check - bypass calculation for complex NPC scenarios (DEPRECATED)
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

  // Step 7: Calculate Cost of Children (COTC)
  // Uses the "Same Age" rule: For each child, calculate the cost assuming
  // ALL children are the same age as that child, then divide by number of children.
  // This is the same approach used for multi-case allowance in Step 1.
  // Adult children (18+) are excluded from Services Australia assessment
  const assessableChildren = children.filter((c) => c.age < 18);
  
  // Calculate cost per child using the "Same Age" rule
  // Store both the cost and bracket info for each child for detailed display
  const childCosts: { cost: number; bracketInfo: any; totalCostAtAge: number }[] = [];
  let totalCost = 0;
  
  for (const child of assessableChildren) {
    // Create virtual children all of same age as this child
    const ageRange = deriveAgeRangeMemoized(child.age);
    const virtualChildren = [];
    for (let i = 0; i < assessableChildren.length; i++) {
      virtualChildren.push({
        age: child.age,
        ageRange: ageRange,
        careA: 0,
        careB: 0,
      });
    }
    
    // Calculate cost using CCSI
    const { cost: childTotalCost, bracketInfo } = getChildCost(
      selectedYear,
      virtualChildren,
      CCSI
    );
    
    // This child's share
    const childCost = childTotalCost / assessableChildren.length;
    childCosts.push({ 
      cost: childCost, 
      bracketInfo,
      totalCostAtAge: childTotalCost 
    });
    totalCost += childCost;
  }
  
  // Use the first child's bracket info for display (representative)
  const costBracketInfo = childCosts.length > 0 ? childCosts[0].bracketInfo : undefined;

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

    // Get the cost for this specific child (using "Same Age" rule)
    // Adult children have zero cost
    const childCostData = c.age >= 18 ? null : (childCosts[childIndex] ?? null);
    const childCostPerChild = childCostData?.cost ?? 0;

    // Calculate liability using the extracted module
    const liabilityResult = calculateChildLiability({
      age: c.age,
      ageRange: c.ageRange,
      careA: c.careA,
      careB: c.careB,
      careNPC: rawCareNPC,
      incomePercA,
      incomePercB,
      costPerChild: childCostPerChild,
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
      costPerChild: childCostPerChild,
      // Store bracket info and total cost at this age for Step 7 display
      costBracketInfo: childCostData?.bracketInfo,
      totalCostAtAge: childCostData?.totalCostAtAge ?? 0,
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
    // Calculate care percentages for both NPCs from first child
    // (All children should have same NPC care percentages in current implementation)
    const firstChild = childResults[0];
    if (firstChild && firstChild.roundedCareNPC !== undefined) {
      // Get second NPC care from first child
      const childInput = formState.children[0];
      const rawCareNPC2 = childInput?.careAmountNPC2
        ? convertCareToPercentage(childInput.careAmountNPC2, childInput.carePeriod)
        : 0;
      
      const roundedCareNPC2 = roundCarePercentage(rawCareNPC2);

      // Calculate split based on care percentages (not cost percentages)
      const totalCarePerc = firstChild.roundedCareNPC + roundedCareNPC2;
      if (totalCarePerc > 0) {
        paymentToNPC1 = (paymentToNPC * firstChild.roundedCareNPC) / totalCarePerc;
        paymentToNPC2 = (paymentToNPC * roundedCareNPC2) / totalCarePerc;
      }
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
    multiCaseBreakdownA: incomeResults.multiCaseBreakdownA,
    multiCaseGroupedBreakdownA: incomeResults.multiCaseGroupedBreakdownA,
    multiCaseBreakdownB: incomeResults.multiCaseBreakdownB,
    multiCaseGroupedBreakdownB: incomeResults.multiCaseGroupedBreakdownB,
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
