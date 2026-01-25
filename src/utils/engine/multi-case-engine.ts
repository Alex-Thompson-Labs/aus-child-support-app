/**
 * Multi-Case Engine Module
 * 
 * Handles multi-case cap logic (Formula 3) for parents with children in multiple cases.
 * This module consolidates all multi-case cap calculations and MAR/FAR cap interactions.
 */

import { AgeRange, ChildResult, deriveAgeRange, OtherCaseChild } from '../calculator';
import { getChildCost } from '../child-support-calculations';
import { AssessmentYear } from '../child-support-constants';
import {
    applyFARMultiChildCap,
    applyMARMultiCaseCap,
    checkMARCareNegation,
} from '../multi-case-rates';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Input for calculating solo cost per child
 */
export interface SoloCostInput {
  parentPreliminaryCSI: number;
  assessableChildren: { age: number; ageRange: AgeRange }[];
  otherCaseChildren: OtherCaseChild[];
  selectedYear: AssessmentYear;
}

/**
 * Input for applying multi-case caps to liabilities
 */
export interface MultiCaseCapInput {
  childResults: ChildResult[];
  hasMultiCaseA: boolean;
  hasMultiCaseB: boolean;
  preliminaryCSI_A: number;
  preliminaryCSI_B: number;
  otherChildrenA: OtherCaseChild[];
  otherChildrenB: OtherCaseChild[];
  assessableChildren: { age: number; ageRange: AgeRange }[];
  selectedYear: AssessmentYear;
}

/**
 * Result of applying multi-case caps
 */
export interface MultiCaseCapResult {
  childResults: ChildResult[];
  finalLiabilityA: number;
  finalLiabilityB: number;
  multiCaseCapAppliedA: boolean;
  multiCaseCapAppliedB: boolean;
}

/**
 * Input for applying MAR/FAR caps across multiple cases
 */
export interface MARFARCapInput {
  childResults: ChildResult[];
  MAR_A: number;
  MAR_B: number;
  FAR_A: number;
  FAR_B: number;
  hasMultiCaseA: boolean;
  hasMultiCaseB: boolean;
  totalCasesA: number;
  totalCasesB: number;
  selectedYear: AssessmentYear;
}

/**
 * Result of applying MAR/FAR caps
 */
export interface MARFARCapResult {
  childResults: ChildResult[];
  finalLiabilityA: number;
  finalLiabilityB: number;
  MAR_A: number;
  MAR_B: number;
  FAR_A: number;
  FAR_B: number;
  marCapExplanationA?: string;
  marCapExplanationB?: string;
  farCapExplanationA?: string;
  farCapExplanationB?: string;
}

// ============================================================================
// Module-Scope Helper Function (Requirement 10.1, 10.2, 10.3, 10.4)
// ============================================================================

/**
 * Calculate Solo Cost per child for Multi-Case Cap.
 * 
 * This calculates what the cost of all children (current + other cases)
 * would be if only this parent's income were considered.
 * Per legislation, the cap must be based on payer's individual income, not CCSI.
 * 
 * This function is defined at module scope (not inside any other function)
 * to avoid recreation on every function call.
 * 
 * @param input - Solo cost calculation input
 * @returns The solo cost per child (rounded to nearest dollar)
 */
export function calculateSoloCostPerChild(input: SoloCostInput): number {
  const {
    parentPreliminaryCSI,
    assessableChildren,
    otherCaseChildren,
    selectedYear,
  } = input;

  // Create a combined list of all children (current case + other cases)
  const allChildren = [
    ...assessableChildren.map((c) => ({
      age: c.age,
      ageRange: c.ageRange,
      careA: 0,
      careB: 0,
    })),
    ...otherCaseChildren.map((oc) => ({
      age: oc.age,
      ageRange: deriveAgeRange(oc.age),
      careA: 0,
      careB: 0,
    })),
  ];

  // Filter out adult children (18+)
  const eligibleChildren = allChildren.filter(
    (c) => deriveAgeRange(c.age) !== '18+'
  );

  if (eligibleChildren.length === 0) return 0;

  // Calculate cost using only this parent's income (Solo Cost)
  const { cost: totalSoloCost } = getChildCost(
    selectedYear,
    eligibleChildren,
    parentPreliminaryCSI // Use parent's solo income, not CCSI
  );

  // Return per-child cost
  return totalSoloCost / eligibleChildren.length;
}

// ============================================================================
// Multi-Case Cap Functions
// ============================================================================

/**
 * Apply multi-case caps to child liabilities.
 * 
 * The cap limits liability for parents with children in other cases.
 * Cap = Child's cost × (100% - parent's cost percentage for that child)
 * 
 * Formula 4 Enhancement: When NPC is present, the cap applies to TOTAL liability
 * (parent-to-parent + parent-to-NPC combined), then proportionally reduces both.
 * 
 * @param input - Multi-case cap input
 * @returns Multi-case cap result with updated child results and liabilities
 */
export function applyMultiCaseCaps(input: MultiCaseCapInput): MultiCaseCapResult {
  const {
    childResults,
    hasMultiCaseA,
    hasMultiCaseB,
    preliminaryCSI_A,
    preliminaryCSI_B,
    otherChildrenA,
    otherChildrenB,
    assessableChildren,
    selectedYear,
  } = input;

  let finalLiabilityA = 0;
  let finalLiabilityB = 0;
  let multiCaseCapAppliedA = false;
  let multiCaseCapAppliedB = false;

  // If no multi-case scenarios, just sum up the liabilities
  if (!hasMultiCaseA && !hasMultiCaseB) {
    childResults.forEach((child) => {
      finalLiabilityA += child.finalLiabilityA;
      finalLiabilityB += child.finalLiabilityB;
    });
    return {
      childResults,
      finalLiabilityA,
      finalLiabilityB,
      multiCaseCapAppliedA,
      multiCaseCapAppliedB,
    };
  }

  // Apply multi-case caps to each child
  childResults.forEach((child) => {
    let adjustedLiabilityA = child.finalLiabilityA;
    let adjustedLiabilityB = child.finalLiabilityB;
    let adjustedLiabilityToNPC_A = child.liabilityToNPC_A ?? 0;
    let adjustedLiabilityToNPC_B = child.liabilityToNPC_B ?? 0;

    // Apply multi-case cap for Parent A
    // Uses Solo Cost based on Parent A's Preliminary CSI (not CCSI)
    if (hasMultiCaseA) {
      // Calculate total liability (parent-to-parent + parent-to-NPC)
      const totalLiabilityA = child.finalLiabilityA + (child.liabilityToNPC_A ?? 0);
      
      if (totalLiabilityA > 0) {
        const soloCostPerChildA = calculateSoloCostPerChild({
          parentPreliminaryCSI: preliminaryCSI_A,
          assessableChildren,
          otherCaseChildren: otherChildrenA,
          selectedYear,
        });
        
        // Calculate cap: child cost × (100% - parent's cost %)
        const capA = Math.round(soloCostPerChildA * ((100 - child.costPercA) / 100));
        child.multiCaseCapA = capA;
        
        // Apply cap if total liability exceeds it (Formula 4 spec)
        if (totalLiabilityA > capA) {
          // Proportionally reduce both parent-to-parent and parent-to-NPC
          const reductionRatio = capA / totalLiabilityA;
          adjustedLiabilityA = child.finalLiabilityA * reductionRatio;
          adjustedLiabilityToNPC_A = (child.liabilityToNPC_A ?? 0) * reductionRatio;
          child.multiCaseCapAppliedA = true;
          multiCaseCapAppliedA = true;
        }
      }
    }

    // Apply multi-case cap for Parent B
    // Uses Solo Cost based on Parent B's Preliminary CSI (not CCSI)
    if (hasMultiCaseB) {
      // Calculate total liability (parent-to-parent + parent-to-NPC)
      const totalLiabilityB = child.finalLiabilityB + (child.liabilityToNPC_B ?? 0);
      
      if (totalLiabilityB > 0) {
        const soloCostPerChildB = calculateSoloCostPerChild({
          parentPreliminaryCSI: preliminaryCSI_B,
          assessableChildren,
          otherCaseChildren: otherChildrenB,
          selectedYear,
        });
        
        // Calculate cap: child cost × (100% - parent's cost %)
        const capB = Math.round(soloCostPerChildB * ((100 - child.costPercB) / 100));
        child.multiCaseCapB = capB;
        
        // Apply cap if total liability exceeds it (Formula 4 spec)
        if (totalLiabilityB > capB) {
          // Proportionally reduce both parent-to-parent and parent-to-NPC
          const reductionRatio = capB / totalLiabilityB;
          adjustedLiabilityB = child.finalLiabilityB * reductionRatio;
          adjustedLiabilityToNPC_B = (child.liabilityToNPC_B ?? 0) * reductionRatio;
          child.multiCaseCapAppliedB = true;
          multiCaseCapAppliedB = true;
        }
      }
    }

    // Update child with adjusted liabilities
    child.finalLiabilityA = adjustedLiabilityA;
    child.finalLiabilityB = adjustedLiabilityB;
    child.liabilityToNPC_A = adjustedLiabilityToNPC_A;
    child.liabilityToNPC_B = adjustedLiabilityToNPC_B;
    
    // Accumulate final liabilities
    finalLiabilityA += adjustedLiabilityA;
    finalLiabilityB += adjustedLiabilityB;
  });

  return {
    childResults,
    finalLiabilityA,
    finalLiabilityB,
    multiCaseCapAppliedA,
    multiCaseCapAppliedB,
  };
}

/**
 * Apply MAR/FAR caps across multiple cases.
 * 
 * This handles:
 * - MAR 3-case cap and care negation rules
 * - FAR 3-child cap across all cases
 * 
 * @param input - MAR/FAR cap input
 * @returns MAR/FAR cap result with updated values and explanations
 */
export function applyMARFARCaps(input: MARFARCapInput): MARFARCapResult {
  const {
    childResults,
    MAR_A: initialMAR_A,
    MAR_B: initialMAR_B,
    FAR_A: initialFAR_A,
    FAR_B: initialFAR_B,
    hasMultiCaseA,
    hasMultiCaseB,
    totalCasesA,
    totalCasesB,
    selectedYear,
  } = input;

  let MAR_A = initialMAR_A;
  let MAR_B = initialMAR_B;
  let FAR_A = initialFAR_A;
  let FAR_B = initialFAR_B;
  let finalLiabilityA = 0;
  let finalLiabilityB = 0;
  let marCapExplanationA: string | undefined;
  let marCapExplanationB: string | undefined;
  let farCapExplanationA: string | undefined;
  let farCapExplanationB: string | undefined;

  // Apply MAR 3-case cap and care negation for Parent A
  if (MAR_A > 0 && hasMultiCaseA) {
    // Check care negation first (14% care of any child negates MAR)
    const careNegationA = checkMARCareNegation({
      carePercentages: childResults.map((c) => c.roundedCareA),
    });

    if (careNegationA.capApplied) {
      // MAR negated due to care threshold
      MAR_A = 0;
      marCapExplanationA = careNegationA.explanation;
      // Update child results to reflect negated MAR
      childResults.forEach((child) => {
        if (child.marAppliedA) {
          child.finalLiabilityA = 0;
        }
      });
    } else if (totalCasesA > 3) {
      // Apply 3-case cap
      const marCapResultA = applyMARMultiCaseCap(selectedYear, totalCasesA);
      if (marCapResultA.capApplied) {
        const cappedMARPerCase = marCapResultA.cappedAmount;
        marCapExplanationA = marCapResultA.explanation;
        // Recalculate MAR liability with capped amount
        const assessableChildren = childResults.filter(c => !c.isAdultChild);
        childResults.forEach((child) => {
          if (child.marAppliedA) {
            child.finalLiabilityA = cappedMARPerCase / assessableChildren.length;
          }
        });
        MAR_A = cappedMARPerCase;
      }
    }
  }

  // Apply MAR 3-case cap and care negation for Parent B
  if (MAR_B > 0 && hasMultiCaseB) {
    const careNegationB = checkMARCareNegation({
      carePercentages: childResults.map((c) => c.roundedCareB),
    });

    if (careNegationB.capApplied) {
      MAR_B = 0;
      marCapExplanationB = careNegationB.explanation;
      childResults.forEach((child) => {
        if (child.marAppliedB) {
          child.finalLiabilityB = 0;
        }
      });
    } else if (totalCasesB > 3) {
      const marCapResultB = applyMARMultiCaseCap(selectedYear, totalCasesB);
      if (marCapResultB.capApplied) {
        const cappedMARPerCase = marCapResultB.cappedAmount;
        marCapExplanationB = marCapResultB.explanation;
        const assessableChildren = childResults.filter(c => !c.isAdultChild);
        childResults.forEach((child) => {
          if (child.marAppliedB) {
            child.finalLiabilityB = cappedMARPerCase / assessableChildren.length;
          }
        });
        MAR_B = cappedMARPerCase;
      }
    }
  }

  // Apply FAR 3-child cap for Parent A
  // Count total children FAR applies to (current case + other cases)
  const farChildCountA = childResults.filter((c) => c.farAppliedA).length +
    (hasMultiCaseA ? input.childResults.filter(c => c.farAppliedA).length : 0);

  if (FAR_A > 0 && farChildCountA > 3) {
    const farCapResultA = applyFARMultiChildCap(selectedYear, farChildCountA);
    if (farCapResultA.capApplied) {
      const cappedFARPerChild = farCapResultA.cappedAmount;
      farCapExplanationA = farCapResultA.explanation;
      // Recalculate FAR liability with capped amount
      childResults.forEach((child) => {
        if (child.farAppliedA) {
          child.finalLiabilityA = cappedFARPerChild;
        }
      });
      FAR_A = cappedFARPerChild * childResults.filter((c) => c.farAppliedA).length;
    }
  }

  // Apply FAR 3-child cap for Parent B
  const farChildCountB = childResults.filter((c) => c.farAppliedB).length +
    (hasMultiCaseB ? input.childResults.filter(c => c.farAppliedB).length : 0);

  if (FAR_B > 0 && farChildCountB > 3) {
    const farCapResultB = applyFARMultiChildCap(selectedYear, farChildCountB);
    if (farCapResultB.capApplied) {
      const cappedFARPerChild = farCapResultB.cappedAmount;
      farCapExplanationB = farCapResultB.explanation;
      childResults.forEach((child) => {
        if (child.farAppliedB) {
          child.finalLiabilityB = cappedFARPerChild;
        }
      });
      FAR_B = cappedFARPerChild * childResults.filter((c) => c.farAppliedB).length;
    }
  }

  // Calculate final liabilities after all caps
  childResults.forEach((child) => {
    finalLiabilityA += child.finalLiabilityA;
    finalLiabilityB += child.finalLiabilityB;
  });

  return {
    childResults,
    finalLiabilityA,
    finalLiabilityB,
    MAR_A,
    MAR_B,
    FAR_A,
    FAR_B,
    marCapExplanationA,
    marCapExplanationB,
    farCapExplanationA,
    farCapExplanationB,
  };
}
