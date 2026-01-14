import type { CalculationResults } from '../utils/calculator';
import { MAX_PPS } from './child-support-constants';

/**
 * Checks if a child with no payment would have been eligible for FAR
 * but wasn't applied due to the 3-child limit being reached.
 *
 * @param childIndex - The index of the child to check
 * @param results - The calculation results
 * @param formState - Form state containing income support flags
 * @returns true if the child is beyond the FAR limit
 */
export function isFarLimitReached(
    childIndex: number,
    results: CalculationResults,
    formState: { supportA: boolean; supportB: boolean }
): boolean {
    const child = results.childResults[childIndex];

    // Child must have no payment
    if (child.finalLiabilityA > 0 || child.finalLiabilityB > 0) {
        return false;
    }

    // Check if Parent A would be eligible for FAR but it wasn't applied
    const parentAEligibleForFar =
        results.ATI_A < MAX_PPS && // Income below threshold
        !formState.supportA && // Not on income support
        child.roundedCareB >= 66; // Other parent has at least 66% care (Parent A has < 35%)

    // Check if Parent B would be eligible for FAR but it wasn't applied
    const parentBEligibleForFar =
        results.ATI_B < MAX_PPS && // Income below threshold
        !formState.supportB && // Not on income support
        child.roundedCareA >= 66; // Other parent has at least 66% care (Parent B has < 35%)

    // Check if FAR was applied to earlier children (counting how many have FAR applied)
    const farAppliedCountA = results.childResults
        .slice(0, childIndex)
        .filter((c) => c.farAppliedA).length;

    const farAppliedCountB = results.childResults
        .slice(0, childIndex)
        .filter((c) => c.farAppliedB).length;

    // If eligible for FAR but not applied, and 3 or more children before this one had FAR applied
    const farLimitReachedA =
        parentAEligibleForFar && !child.farAppliedA && farAppliedCountA >= 3;
    const farLimitReachedB =
        parentBEligibleForFar && !child.farAppliedB && farAppliedCountB >= 3;

    return farLimitReachedA || farLimitReachedB;
}

/**
 * Detects if the "Low Assessment" trigger should be shown for the user.
 * This covers when the other parent (Parent B) is paying a fixed/minimum rate,
 * OR when such a rate WOULD have applied but was negated by care arrangements.
 *
 * The user is the "Receiver" (collecting child support) and the other parent
 * has low income that triggered or would have triggered MAR/FAR.
 *
 * Edge cases covered:
 * 1. MAR is actually applied (Parent B pays MAR)
 * 2. FAR is actually applied (Parent B pays FAR)
 * 3. MAR would apply but is negated by ≥14% care of a child
 * 4. FAR would apply but liability is reversed or negated by care arrangements
 *
 * @param results - The calculation results
 * @param formState - Form state containing income support flags
 * @returns Object with isLowAssessment flag and reason
 */
export function detectLowAssessmentTrigger(
    results: CalculationResults,
    formState: { supportA: boolean; supportB: boolean }
): { isLowAssessment: boolean; reason: string } {
    // The user is Parent A, so we check if the OTHER PARENT (Parent B) triggers low assessment

    // Case 1: MAR is actually applied to Parent B (other parent paying minimum rate)
    const hasMarAppliedB = results.childResults.some((c) => c.marAppliedB);
    if (hasMarAppliedB && results.payer === 'Parent B') {
        return {
            isLowAssessment: true,
            reason: 'Other parent is paying the Minimum Annual Rate',
        };
    }

    // Case 2: FAR is actually applied to Parent B (other parent paying fixed rate)
    const hasFarAppliedB = results.childResults.some((c) => c.farAppliedB);
    if (hasFarAppliedB && results.payer === 'Parent B') {
        return {
            isLowAssessment: true,
            reason: 'Other parent is paying the Fixed Annual Rate',
        };
    }

    // Case 3: MAR WOULD apply to Parent B but is negated by ≥14% care
    // Criteria for MAR: ATI < SSA, on income support, and <14% care of ALL children
    // If they have ≥14% care of ANY child, MAR is prevented
    const marWouldApplyB =
        results.ATI_B < results.SSA && // Low income
        formState.supportB && // On income support
        results.childResults.some((c) => c.roundedCareB >= 14); // Has ≥14% care (preventing MAR)

    // Also check that MAR was NOT actually applied (it was prevented)
    const marPreventedByCareBCareThreshold =
        marWouldApplyB && !results.childResults.some((c) => c.marAppliedB);

    if (marPreventedByCareBCareThreshold) {
        return {
            isLowAssessment: true,
            reason:
                "Other parent's liability is $0 due to care threshold, but they have low income that would otherwise trigger a minimum rate",
        };
    }

    // Case 4: FAR conditions exist for Parent B but liability is $0 due to care reversal
    // FAR criteria: ATI < MAX_PPS, NOT on income support, and other parent (A) has ≥66% care
    // But if Parent B also has ≥65% care of another child AND Parent A is not on support,
    // then Parent A would owe FAR to Parent B, potentially reversing/negating the liability

    // Check if Parent B meets FAR eligibility criteria for any child
    const farEligibleB =
        results.ATI_B < MAX_PPS && // Low income (below MAX_PPS)
        !formState.supportB; // Not on income support

    // Check if there are children where Parent A has ≥66% care (Parent B would owe FAR)
    const childrenWhereBWouldOweFar = results.childResults.filter(
        (c) => c.roundedCareA >= 66
    );

    // Check if there are children where Parent B has ≥65% care (Parent A might owe FAR back)
    const childrenWhereAMightOweFar = results.childResults.filter(
        (c) => c.roundedCareB >= 65
    );

    // If Parent B is FAR-eligible, has children where they'd owe FAR,
    // but liability is $0 or Parent A is actually paying,
    // this suggests FAR was reversed/negated
    if (
        farEligibleB &&
        childrenWhereBWouldOweFar.length > 0 &&
        (results.finalPaymentAmount === 0 || results.payer === 'Parent A')
    ) {
        // Additional check: is there a reversal scenario?
        // Parent A must also be FAR-eligible for reversal
        const parentAFarEligible =
            results.ATI_A < MAX_PPS && !formState.supportA;

        if (parentAFarEligible && childrenWhereAMightOweFar.length > 0) {
            return {
                isLowAssessment: true,
                reason:
                    'Fixed rate liabilities have cancelled out due to care arrangements, but the other parent has low income',
            };
        }
    }

    // Case 5: Check if result uses FAR or MAR string (covers any edge case with rateApplied)
    // AND user is receiver (Parent B is payer)
    if (
        results.payer === 'Parent B' &&
        (results.rateApplied.includes('FAR') || results.rateApplied.includes('MAR'))
    ) {
        return {
            isLowAssessment: true,
            reason: 'Other parent is paying a standard formula limit rate',
        };
    }

    return { isLowAssessment: false, reason: '' };
}
