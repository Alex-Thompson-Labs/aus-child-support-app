/**
 * Payment Resolver Module
 *
 * Handles final payment determination, including:
 * - Net payment calculation between parents
 * - Payer/receiver determination
 * - Non-parent carer (NPC) payment totals
 * - Payer role determination for multi-case scenarios
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */

import { ChildResult, PayerRole } from './calculator';

// ============================================================================
// Type Definitions
// ============================================================================

export interface PaymentResolutionInput {
  finalLiabilityA: number;
  finalLiabilityB: number;
  FAR_A: number;
  FAR_B: number;
  MAR_A: number;
  MAR_B: number;
  rateApplied: string;
  childResults: ChildResult[];
  hasNPC: boolean;
}

export interface PaymentResolutionResult {
  payer: string;
  receiver: string;
  finalPaymentAmount: number;
  payerRole: PayerRole;
  paymentToNPC?: number;
}

// ============================================================================
// Exported Functions
// ============================================================================

/**
 * Resolves final payment amount and determines payer/receiver roles.
 *
 * Requirements:
 * - 6.1: Export function to determine final payment amount
 * - 6.2: Calculate net payment as liabilityA - liabilityB
 * - 6.3: Determine payer as parent with higher liability
 * - 6.4: Determine receiver as parent with lower liability
 * - 6.5: Set payer and receiver to "Neither" when payment is zero
 * - 6.6: Calculate NPC payment totals when enabled
 */
export function resolvePayment(
  input: PaymentResolutionInput
): PaymentResolutionResult {
  const {
    finalLiabilityA,
    finalLiabilityB,
    FAR_A,
    FAR_B,
    MAR_A,
    MAR_B,
    rateApplied,
    childResults,
    hasNPC,
  } = input;

  // Calculate net payment (Requirement 6.2)
  let finalPayment = finalLiabilityA - finalLiabilityB;
  let payer = finalPayment > 0 ? 'Parent A' : 'Parent B';
  let receiver = finalPayment > 0 ? 'Parent B' : 'Parent A';
  let finalPaymentAmount = Math.abs(finalPayment);

  // Handle special cases for FAR and MAR when both parents have rates applied
  if (rateApplied.startsWith('FAR') && FAR_A > 0 && FAR_B > 0) {
    finalPayment = FAR_A - FAR_B;
    payer = finalPayment > 0 ? 'Parent A' : 'Parent B';
    receiver = finalPayment > 0 ? 'Parent B' : 'Parent A';
    finalPaymentAmount = Math.abs(finalPayment);
  } else if (rateApplied.startsWith('MAR') && MAR_A > 0 && MAR_B > 0) {
    // When both parents are on MAR, no payment is made between them
    finalPayment = MAR_A - MAR_B;
    payer = 'N/A';
    receiver = 'N/A';
    finalPaymentAmount = 0;
  }

  // Requirement 6.5: Zero payment yields "Neither"
  if (finalPaymentAmount === 0) {
    payer = 'Neither';
    receiver = 'Neither';
  }

  // Requirement 6.6: Calculate NPC payment totals
  let paymentToNPC: number | undefined;
  if (hasNPC) {
    paymentToNPC = calculateNPCPayment(childResults);
  }

  // Determine payer role
  const payerRole = determinePayerRole(payer, hasNPC, paymentToNPC ?? 0, childResults);

  return {
    payer,
    receiver,
    finalPaymentAmount,
    payerRole,
    paymentToNPC,
  };
}

/**
 * Calculates total payment to non-parent carer (NPC) from both parents.
 *
 * Requirement 6.6: Calculate NPC payment totals when non-parent carer is enabled
 */
export function calculateNPCPayment(childResults: ChildResult[]): number {
  return childResults.reduce(
    (sum, child) =>
      sum + (child.liabilityToNPC_A ?? 0) + (child.liabilityToNPC_B ?? 0),
    0
  );
}

/**
 * Calculates payment split between two non-parent carers (Formula 2/4).
 * 
 * When two NPCs both have ≥35% care, payment is split proportionally
 * based on their cost percentages.
 * 
 * Formula: paymentToNPC1 = totalPayment × (costPercNPC1 / totalNPCCostPerc)
 * 
 * @param totalPaymentToNPCs - Total payment from both parents to all NPCs
 * @param costPercNPC1 - First NPC's cost percentage
 * @param costPercNPC2 - Second NPC's cost percentage
 * @returns Object with payment amounts for each NPC
 */
export function calculateTwoNPCPaymentSplit(
  totalPaymentToNPCs: number,
  costPercNPC1: number,
  costPercNPC2: number
): { paymentToNPC1: number; paymentToNPC2: number } {
  // Handle edge case: no payment to split
  if (totalPaymentToNPCs <= 0) {
    return { paymentToNPC1: 0, paymentToNPC2: 0 };
  }

  // Handle edge case: no cost percentages (shouldn't happen with validation)
  const totalNPCCostPerc = costPercNPC1 + costPercNPC2;
  if (totalNPCCostPerc <= 0) {
    return { paymentToNPC1: 0, paymentToNPC2: 0 };
  }

  // Split proportionally based on cost percentages
  const paymentToNPC1 = Math.round(
    totalPaymentToNPCs * (costPercNPC1 / totalNPCCostPerc)
  );
  const paymentToNPC2 = Math.round(
    totalPaymentToNPCs * (costPercNPC2 / totalNPCCostPerc)
  );

  return { paymentToNPC1, paymentToNPC2 };
}

/**
 * Determines the payer role for multi-case scenarios.
 *
 * Requirement 6.6: Determine payer role based on NPC payments and final payment
 */
export function determinePayerRole(
  payer: string,
  hasNPC: boolean,
  paymentToNPC: number,
  childResults: ChildResult[]
): PayerRole {
  // If NPC is enabled and there's payment to NPC
  if (hasNPC && paymentToNPC > 0) {
    const anyPayingA = childResults.some((c) => (c.liabilityToNPC_A ?? 0) > 0);
    const anyPayingB = childResults.some((c) => (c.liabilityToNPC_B ?? 0) > 0);

    if (anyPayingA && anyPayingB) {
      return 'both_paying';
    } else if (anyPayingA) {
      return 'paying_parent';
    } else if (anyPayingB) {
      return 'receiving_parent';
    }
  }

  // Standard payer role determination
  if (payer === 'Parent A') {
    return 'paying_parent';
  } else if (payer === 'Parent B') {
    return 'receiving_parent';
  }

  return 'neither';
}
