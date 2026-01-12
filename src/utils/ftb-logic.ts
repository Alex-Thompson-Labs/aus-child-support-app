/**
 * FTB (Family Tax Benefit) Logic for 2025-26 Financial Year
 *
 * Implements calculations for how Child Support affects Centrelink FTB payments.
 * Used to drive lawyer inquiry conversions by highlighting financial impacts.
 *
 * @see https://www.servicesaustralia.gov.au/maintenance-income-test
 */

// ============================================================================
// 2025-26 Financial Year Constants
// ============================================================================

/** FTB Part A Method 1 income limit */
export const FTB_A_METHOD_1_LIMIT = 66722;

/** FTB Part A Method 2 income limit */
export const FTB_A_METHOD_2_LIMIT = 118771;

/** Rough upper limit where FTB Part A hits $0 */
export const FTB_A_CUTOFF_ESTIMATE = 135000;

/** FTB Part B primary earner income limit ($120k hard cap) */
export const FTB_B_PRIMARY_LIMIT = 120007;

/** Maintenance Income Free Area - base amount for 1st child */
export const MIFA_BASE = 2003.85;

/** Maintenance Income Free Area - additional amount per extra child */
export const MIFA_ADDITIONAL = 667.95;

/** Maintenance Income Test taper rate (50c per $1 of child support) */
export const MIT_TAPER = 0.50;

// ============================================================================
// Types
// ============================================================================

/**
 * Result of Part B eligibility check
 */
export type PartBEligibilityResult =
    | 'ELIGIBLE_VIA_DEDUCTION'  // The "Green Light" - deduction drops income below limit
    | 'ELIGIBLE'                 // Standard eligibility (already under limit)
    | 'INELIGIBLE';              // Income too high even after deduction

// ============================================================================
// Calculation Functions
// ============================================================================

/**
 * Calculate how much FTB Part A a payee loses due to Child Support received.
 *
 * FTB Part A is reduced by 50 cents for each dollar of child support received
 * above the Maintenance Income Free Area (MIFA).
 *
 * @param childSupportReceived - Annual child support received
 * @param childCount - Number of children in the assessment
 * @param myIncome - The receiver's (payee's) annual income
 * @returns Annual FTB Part A reduction amount
 *
 * @example
 * // Receive $10,000 CS with 2 children and income of $60,000
 * calculatePartAReduction(10000, 2, 60000) // Returns ~$3,665
 */
export function calculatePartAReduction(
    childSupportReceived: number,
    childCount: number,
    myIncome: number
): number {
    // Income Filter: If income is above the cutoff estimate, user is too wealthy
    // to receive FTB Part A, so they can't lose it
    if (myIncome > FTB_A_CUTOFF_ESTIMATE) {
        return 0;
    }

    // Calculate the Maintenance Income Free Area threshold
    // First child gets base amount, each additional child adds MIFA_ADDITIONAL
    const threshold = MIFA_BASE + (MIFA_ADDITIONAL * Math.max(0, childCount - 1));

    // Calculate the loss: 50c reduction per dollar above threshold
    const loss = (childSupportReceived - threshold) * MIT_TAPER;

    // Return 0 if no reduction (child support below threshold)
    return Math.max(0, loss);
}

/**
 * Check if a Payer becomes eligible for FTB Part B because
 * Child Support Paid is deductible from assessable income.
 *
 * Child Support paid reduces the payer's assessable income for the
 * FTB Part B income test, potentially bringing them under the $120k limit.
 *
 * @param childSupportPaid - Annual child support paid
 * @param myIncome - The payer's annual income
 * @returns Eligibility status for FTB Part B
 *
 * @example
 * // Income of $130,000, paying $15,000 CS
 * checkPartBEligibility(15000, 130000) // Returns "ELIGIBLE_VIA_DEDUCTION"
 *
 * @example
 * // Income of $100,000, paying $5,000 CS
 * checkPartBEligibility(5000, 100000) // Returns "ELIGIBLE"
 */
export function checkPartBEligibility(
    childSupportPaid: number,
    myIncome: number
): PartBEligibilityResult {
    // Calculate adjusted income after child support deduction
    const adjustedIncome = myIncome - childSupportPaid;

    // Check for "Green Light" scenario: was over limit, now under
    if (myIncome > FTB_B_PRIMARY_LIMIT && adjustedIncome < FTB_B_PRIMARY_LIMIT) {
        return 'ELIGIBLE_VIA_DEDUCTION';
    }

    // Standard eligibility: adjusted income under limit
    if (adjustedIncome < FTB_B_PRIMARY_LIMIT) {
        return 'ELIGIBLE';
    }

    // Income still too high even after deduction
    return 'INELIGIBLE';
}

/**
 * Check if a payer is "close" to FTB Part B eligibility.
 * Used to show educational info about tax deductibility.
 *
 * @param myIncome - The payer's annual income
 * @param childSupportPaid - Annual child support paid
 * @param marginThreshold - How close to consider "near eligible" (default $15,000)
 * @returns True if close to eligibility
 */
export function isCloseToPartBEligibility(
    myIncome: number,
    childSupportPaid: number,
    marginThreshold: number = 15000
): boolean {
    const adjustedIncome = myIncome - childSupportPaid;
    return (
        adjustedIncome >= FTB_B_PRIMARY_LIMIT &&
        adjustedIncome < FTB_B_PRIMARY_LIMIT + marginThreshold
    );
}
