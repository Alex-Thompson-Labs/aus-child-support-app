/**
 * FTB (Family Tax Benefit) Logic
 *
 * Implements calculations for how Child Support affects Centrelink FTB payments.
 * Used to drive lawyer inquiry conversions by highlighting financial impacts.
 *
 * @see https://www.servicesaustralia.gov.au/maintenance-income-test
 */

// ============================================================================
// Year-Based FTB Constants
// ============================================================================

/**
 * FTB limits and thresholds by financial year
 */
export const FTB_LIMITS: Record<number, {
    /** FTB Part A Method 1 income limit */
    ftbAMethod1Limit: number;
    /** FTB Part A Method 2 income limit */
    ftbAMethod2Limit: number;
    /** Rough upper limit where FTB Part A hits $0 */
    ftbACutoffEstimate: number;
    /** FTB Part B primary earner income limit ($120k hard cap) */
    ftbBPrimaryLimit: number;
    /** Maintenance Income Free Area - base amount for 1st child */
    mifaBase: number;
    /** Maintenance Income Free Area - additional amount per extra child */
    mifaAdditional: number;
    /** Maintenance Income Test taper rate (50c per $1 of child support) */
    mitTaper: number;
}> = {
    2025: {
        ftbAMethod1Limit: 66722,
        ftbAMethod2Limit: 118771,
        ftbACutoffEstimate: 135000,
        ftbBPrimaryLimit: 120007,
        mifaBase: 2003.85,
        mifaAdditional: 667.95,
        mitTaper: 0.50,
    },
    // TODO: Update with official 2026-27 rates when Services Australia releases them
    // Expected release: May-June 2026
    2026: {
        ftbAMethod1Limit: 66722, // Placeholder - update when available
        ftbAMethod2Limit: 118771, // Placeholder - update when available
        ftbACutoffEstimate: 135000, // Placeholder - update when available
        ftbBPrimaryLimit: 120007, // Placeholder - update when available
        mifaBase: 2003.85, // Placeholder - update when available
        mifaAdditional: 667.95, // Placeholder - update when available
        mitTaper: 0.50, // This rate is typically stable
    },
};

// ============================================================================
// Legacy Constants (Deprecated - use FTB_LIMITS instead)
// ============================================================================

/** @deprecated Use FTB_LIMITS[year].ftbAMethod1Limit */
export const FTB_A_METHOD_1_LIMIT = FTB_LIMITS[2025].ftbAMethod1Limit;

/** @deprecated Use FTB_LIMITS[year].ftbAMethod2Limit */
export const FTB_A_METHOD_2_LIMIT = FTB_LIMITS[2025].ftbAMethod2Limit;

/** @deprecated Use FTB_LIMITS[year].ftbACutoffEstimate */
export const FTB_A_CUTOFF_ESTIMATE = FTB_LIMITS[2025].ftbACutoffEstimate;

/** @deprecated Use FTB_LIMITS[year].ftbBPrimaryLimit */
export const FTB_B_PRIMARY_LIMIT = FTB_LIMITS[2025].ftbBPrimaryLimit;

/** @deprecated Use FTB_LIMITS[year].mifaBase */
export const MIFA_BASE = FTB_LIMITS[2025].mifaBase;

/** @deprecated Use FTB_LIMITS[year].mifaAdditional */
export const MIFA_ADDITIONAL = FTB_LIMITS[2025].mifaAdditional;

/** @deprecated Use FTB_LIMITS[year].mitTaper */
export const MIT_TAPER = FTB_LIMITS[2025].mitTaper;

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
 * @param year - Financial year for rate lookup (defaults to 2025)
 * @returns Annual FTB Part A reduction amount
 *
 * @example
 * // Receive $10,000 CS with 2 children and income of $60,000 in 2025
 * calculatePartAReduction(10000, 2, 60000, 2025) // Returns ~$3,665
 */
export function calculatePartAReduction(
    childSupportReceived: number,
    childCount: number,
    myIncome: number,
    year: number = 2025
): number {
    const limits = FTB_LIMITS[year];
    if (!limits) {
        throw new Error(`FTB limits not defined for year ${year}`);
    }

    // Income Filter: If income is above the cutoff estimate, user is too wealthy
    // to receive FTB Part A, so they can't lose it
    if (myIncome > limits.ftbACutoffEstimate) {
        return 0;
    }

    // Calculate the Maintenance Income Free Area threshold
    // First child gets base amount, each additional child adds mifaAdditional
    const threshold = limits.mifaBase + (limits.mifaAdditional * Math.max(0, childCount - 1));

    // Calculate the loss: 50c reduction per dollar above threshold
    const loss = (childSupportReceived - threshold) * limits.mitTaper;

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
 * @param year - Financial year for rate lookup (defaults to 2025)
 * @returns Eligibility status for FTB Part B
 *
 * @example
 * // Income of $130,000, paying $15,000 CS in 2025
 * checkPartBEligibility(15000, 130000, 2025) // Returns "ELIGIBLE_VIA_DEDUCTION"
 *
 * @example
 * // Income of $100,000, paying $5,000 CS in 2025
 * checkPartBEligibility(5000, 100000, 2025) // Returns "ELIGIBLE"
 */
export function checkPartBEligibility(
    childSupportPaid: number,
    myIncome: number,
    year: number = 2025
): PartBEligibilityResult {
    const limits = FTB_LIMITS[year];
    if (!limits) {
        throw new Error(`FTB limits not defined for year ${year}`);
    }

    // Calculate adjusted income after child support deduction
    const adjustedIncome = myIncome - childSupportPaid;

    // Check for "Green Light" scenario: was over limit, now under
    if (myIncome > limits.ftbBPrimaryLimit && adjustedIncome < limits.ftbBPrimaryLimit) {
        return 'ELIGIBLE_VIA_DEDUCTION';
    }

    // Standard eligibility: adjusted income under limit
    if (adjustedIncome < limits.ftbBPrimaryLimit) {
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
 * @param year - Financial year for rate lookup (defaults to 2025)
 * @param marginThreshold - How close to consider "near eligible" (default $15,000)
 * @returns True if close to eligibility
 */
export function isCloseToPartBEligibility(
    myIncome: number,
    childSupportPaid: number,
    year: number = 2025,
    marginThreshold: number = 15000
): boolean {
    const limits = FTB_LIMITS[year];
    if (!limits) {
        throw new Error(`FTB limits not defined for year ${year}`);
    }

    const adjustedIncome = myIncome - childSupportPaid;
    return (
        adjustedIncome >= limits.ftbBPrimaryLimit &&
        adjustedIncome < limits.ftbBPrimaryLimit + marginThreshold
    );
}
