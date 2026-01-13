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

  if (!isAdultChild) {
    // Only positive child support percentages result in liability
    const positivePercA = Math.max(0, childSupportPercA);
    const positivePercB = Math.max(0, childSupportPercB);

    // Determine who pays based on who has higher child support percentage
    if (positivePercA > positivePercB) {
      // Parent A pays to Parent B (or NPC)
      if (shouldPayLiability(roundedCareB, roundedCareNPC, hasNPC)) {
        liabilityA = (positivePercA / 100) * costPerChild;
      }
    } else if (positivePercB > positivePercA) {
      // Parent B pays to Parent A (or NPC)
      if (shouldPayLiability(roundedCareA, roundedCareNPC, hasNPC)) {
        liabilityB = (positivePercB / 100) * costPerChild;
      }
    }
  }

  // Calculate liability to NPC (Formula 4) - also skip for adult children
  let liabilityToNPC_A = 0;
  let liabilityToNPC_B = 0;
  if (!isAdultChild && hasNPC && roundedCareNPC >= 35) {
    // Each parent's liability to NPC = their child support % × child cost × NPC cost %
    if (childSupportPercA > 0) {
      liabilityToNPC_A =
        (childSupportPercA / 100) * costPerChild * (costPercNPC / 100);
    }
    if (childSupportPercB > 0) {
      liabilityToNPC_B =
        (childSupportPercB / 100) * costPerChild * (costPercNPC / 100);
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
