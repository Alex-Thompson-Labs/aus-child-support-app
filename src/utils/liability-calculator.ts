import { AgeRange } from './calculator';
import { mapCareToCostPercent, roundCarePercentage } from './care-utils';

/**
 * Input for calculating per-child liability.
 */
export interface LiabilityInput {
  age: number;
  ageRange: AgeRange;
  careA: number;
  careB: number;
  careNPC: number;
  incomePercA: number;
  incomePercB: number;
  costPerChild: number;
  hasNPC: boolean;
}

/**
 * Result of per-child liability calculation.
 */
export interface LiabilityResult {
  roundedCareA: number;
  roundedCareB: number;
  roundedCareNPC: number;
  costPercA: number;
  costPercB: number;
  costPercNPC: number;
  childSupportPercA: number;
  childSupportPercB: number;
  liabilityA: number;
  liabilityB: number;
  liabilityToNPC_A: number;
  liabilityToNPC_B: number;
  isAdultChild: boolean;
  isTurning18: boolean;
}

/**
 * Calculates child support percentage as income percentage minus cost percentage.
 *
 * @param incomePercent - Parent's income percentage
 * @param costPercent - Parent's cost percentage based on care
 * @returns Child support percentage
 */
export function calculateChildSupportPercentage(
  incomePercent: number,
  costPercent: number
): number {
  return incomePercent - costPercent;
}

/**
 * Determines if a parent should pay liability to the receiver.
 * Liability is only payable if the receiver has at least 35% care,
 * or if there's a non-parent carer with at least 35% care.
 *
 * @param receiverCare - Receiver's care percentage (rounded)
 * @param npcCare - Non-parent carer's care percentage (rounded)
 * @param hasNPC - Whether non-parent carer is enabled
 * @returns true if liability should be paid
 */
export function shouldPayLiability(
  receiverCare: number,
  npcCare: number,
  hasNPC: boolean
): boolean {
  return receiverCare >= 35 || (hasNPC && npcCare >= 35);
}

/**
 * Calculates per-child liability for both parents.
 *
 * This implements Steps 6-8 of the child support formula:
 * - Step 6: Calculate cost percentages based on care
 * - Step 7: Calculate child support percentages (income % - cost %)
 * - Step 8: Calculate liabilities
 *
 * Key rules:
 * - Adult children (18+) have zero liability (excluded from standard calculation)
 * - Liability only applies if receiver has 35%+ care (or NPC has 35%+ care)
 * - Liability = (child support percentage / 100) × cost per child
 * - NPC liability is proportional to NPC's cost percentage
 *
 * @param input - Liability calculation input
 * @returns Liability calculation result
 */
export function calculateChildLiability(
  input: LiabilityInput
): LiabilityResult {
  const {
    age,
    careA,
    careB,
    careNPC,
    incomePercA,
    incomePercB,
    costPerChild,
    hasNPC,
  } = input;

  // Determine adult child status
  const isAdultChild = age >= 18;
  const isTurning18 = age === 17;

  // Round care percentages
  const roundedCareA = roundCarePercentage(careA);
  const roundedCareB = roundCarePercentage(careB);
  const roundedCareNPC = roundCarePercentage(careNPC);

  // Map care to cost percentages
  const costPercA = mapCareToCostPercent(roundedCareA);
  const costPercB = mapCareToCostPercent(roundedCareB);
  const costPercNPC = mapCareToCostPercent(roundedCareNPC);

  // Calculate child support percentages (Step 7)
  const childSupportPercA = calculateChildSupportPercentage(
    incomePercA,
    costPercA
  );
  const childSupportPercB = calculateChildSupportPercentage(
    incomePercB,
    costPercB
  );

  // Adult children (18+) are excluded from standard child support calculation
  // They can only receive Adult Child Maintenance via court order
  let liabilityA = 0;
  let liabilityB = 0;
  let liabilityToNPC_A = 0;
  let liabilityToNPC_B = 0;

  if (!isAdultChild) {
    // Only positive child support percentages result in liability (initially)
    const csPercA = childSupportPercA;
    const csPercB = childSupportPercB;

    // Formula 2: Non-Parent Carer Case (NPC has >= 35% care)
    if (hasNPC && roundedCareNPC >= 35) {
      const isPositiveA = csPercA > 0;
      const isPositiveB = csPercB > 0;

      // Rule 1: Both parents have positive CS% -> Both pay NPC
      if (isPositiveA && isPositiveB) {
        liabilityToNPC_A = (csPercA / 100) * costPerChild;
        liabilityToNPC_B = (csPercB / 100) * costPerChild;
      }
      // Rules 2 & 3: Parent A positive, Parent B negative/zero
      else if (isPositiveA && !isPositiveB) {
        // Calculate raw liability for A (the Payer)
        const rawLiabilityA = (csPercA / 100) * costPerChild;

        if (roundedCareB >= 35) {
          // Rule 3: Parent B is negative but has shared care (>=35%)
          // Parent A pays Parent B outcome of B's negative percentage
          // Parent A pays NPC the balance
          const entitlementB_Perc = Math.abs(csPercB);
          const liabilityToParentB = (entitlementB_Perc / 100) * costPerChild;

          liabilityA = liabilityToParentB; // Parent A pays Parent B
          // Balance to NPC
          liabilityToNPC_A = Math.max(0, rawLiabilityA - liabilityToParentB);
        } else {
          // Rule 2: Parent B is negative and has < shared care
          // Parent A pays full liability to NPC
          liabilityToNPC_A = rawLiabilityA;
        }
      }
      // Rules 2 & 3: Parent B positive, Parent A negative/zero
      else if (isPositiveB && !isPositiveA) {
        const rawLiabilityB = (csPercB / 100) * costPerChild;

        if (roundedCareA >= 35) {
          // Rule 3: Parent A is negative but has shared care
          const entitlementA_Perc = Math.abs(csPercA);
          const liabilityToParentA = (entitlementA_Perc / 100) * costPerChild;

          liabilityB = liabilityToParentA; // Parent B pays Parent A
          liabilityToNPC_B = Math.max(0, rawLiabilityB - liabilityToParentA);
        } else {
          // Rule 2: Parent A is negative and < shared care
          liabilityToNPC_B = rawLiabilityB;
        }
      }
    }
    // Formula 1: Standard Case (No Eligible NPC)
    else {
      const positivePercA = Math.max(0, csPercA);
      const positivePercB = Math.max(0, csPercB);

      // Determine who pays based on who has higher child support percentage
      if (positivePercA > positivePercB) {
        // Parent A pays to Parent B
        // (Check receiver care threshold, though typically if B is receiver they have care, 
        // unlike NPC logic where "shouldPayLiability" checks thresholds)
        if (shouldPayLiability(roundedCareB, roundedCareNPC, hasNPC)) {
          liabilityA = (positivePercA / 100) * costPerChild;
        }
      } else if (positivePercB > positivePercA) {
        // Parent B pays to Parent A
        if (shouldPayLiability(roundedCareA, roundedCareNPC, hasNPC)) {
          liabilityB = (positivePercB / 100) * costPerChild;
        }
      }
    }
  }

  return {
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
  };
}
