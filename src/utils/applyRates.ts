/**
 * FAR/MAR Rate Application Module
 *
 * Pure calculation functions for applying Fixed Annual Rate (FAR) and
 * Minimum Annual Rate (MAR) to child support liabilities.
 * Extracted from useCalculator.ts to improve maintainability and testability.
 */

import type { ChildResult } from './calculator';
import { getYearConstants, type AssessmentYear } from './child-support-constants';

// ============================================================================
// Types
// ============================================================================

/**
 * Input for FAR/MAR rate application.
 */
export interface RateApplicationInput {
    selectedYear: AssessmentYear;
    childResults: ChildResult[];
    ATI_A: number;
    ATI_B: number;
    supportA: boolean;
    supportB: boolean;
}

/**
 * Output from FAR/MAR rate application.
 */
export interface RateApplicationOutput {
    childResults: ChildResult[];
    finalLiabilityA: number;
    finalLiabilityB: number;
    FAR_A: number;
    FAR_B: number;
    MAR_A: number;
    MAR_B: number;
    appliedRates: string[];
    marAppliesA: boolean;
    marAppliesB: boolean;
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Applies FAR/MAR rates to child results based on income and care thresholds.
 *
 * MAR criteria (applied once per case):
 * 1. Parent received income support payment
 * 2. Parent has less than 14% care of ALL assessable children
 * 3. Parent's ATI is below the self-support amount
 *
 * FAR criteria (applied per child, up to 3 children):
 * 1. Parent's ATI is below MAX_PPS
 * 2. Parent is NOT receiving income support
 * 3. Other parent has at least 66% care of the child
 */
export function applyFARMAR(input: RateApplicationInput): RateApplicationOutput {
    const { selectedYear, ATI_A, ATI_B, supportA, supportB } = input;
    const { SSA, FAR, MAR, MAX_PPS } = getYearConstants(selectedYear);

    // Clone child results to avoid mutation
    const childResults = input.childResults.map((c) => ({ ...c }));

    let FAR_A = 0;
    let FAR_B = 0;
    let MAR_A = 0;
    let MAR_B = 0;
    let finalLiabilityA = 0;
    let finalLiabilityB = 0;
    const appliedRates: string[] = [];

    // Filter out adult children for MAR check
    const assessableChildResults = childResults.filter((c) => !c.isAdultChild);

    // Check if MAR applies at case level (once per case, not per child)
    const marAppliesA =
        ATI_A < SSA &&
        supportA &&
        assessableChildResults.length > 0 &&
        assessableChildResults.every((c) => c.roundedCareA < 14);
    const marAppliesB =
        ATI_B < SSA &&
        supportB &&
        assessableChildResults.length > 0 &&
        assessableChildResults.every((c) => c.roundedCareB < 14);

    if (marAppliesA) {
        MAR_A = MAR;
        appliedRates.push('MAR (Parent A)');
    }
    if (marAppliesB) {
        MAR_B = MAR;
        appliedRates.push('MAR (Parent B)');
    }

    childResults.forEach((child, index) => {
        // Skip adult children - they're excluded from FAR/MAR
        if (child.isAdultChild) {
            return;
        }

        const roundedCareA = child.roundedCareA;
        const roundedCareB = child.roundedCareB;

        let liabilityA = child.liabilityA;
        let appliedRateA: string | null = null;
        let farAppliedA = false;
        let marAppliedA = false;

        // Check if MAR applies for this parent (already determined at case level)
        if (marAppliesA) {
            // MAR is paid once per case, so divide by total assessable children
            liabilityA = MAR / assessableChildResults.length;
            marAppliedA = true;
        } else if (ATI_A < MAX_PPS && !supportA && roundedCareB >= 66) {
            // FAR is paid per child (up to 3 children)
            if (FAR_A / FAR < 3) {
                FAR_A += FAR;
                liabilityA = FAR;
                appliedRateA = `FAR (Parent A, Child ${index + 1})`;
                farAppliedA = true;
            }
        }

        if (appliedRateA) {
            appliedRates.push(appliedRateA);
        }
        finalLiabilityA += liabilityA;

        let liabilityB = child.liabilityB;
        let appliedRateB: string | null = null;
        let farAppliedB = false;
        let marAppliedB = false;

        // Check if MAR applies for this parent (already determined at case level)
        if (marAppliesB) {
            liabilityB = MAR / assessableChildResults.length;
            marAppliedB = true;
        } else if (ATI_B < MAX_PPS && !supportB && roundedCareA >= 66) {
            // FAR is paid per child (up to 3 children)
            if (FAR_B / FAR < 3) {
                FAR_B += FAR;
                liabilityB = FAR;
                appliedRateB = `FAR (Parent B, Child ${index + 1})`;
                farAppliedB = true;
            }
        }

        if (appliedRateB) {
            appliedRates.push(appliedRateB);
        }
        finalLiabilityB += liabilityB;

        // Update child result with final liability and rate flags
        child.finalLiabilityA = liabilityA;
        child.finalLiabilityB = liabilityB;
        child.farAppliedA = farAppliedA;
        child.farAppliedB = farAppliedB;
        child.marAppliedA = marAppliedA;
        child.marAppliedB = marAppliedB;
    });

    return {
        childResults,
        finalLiabilityA,
        finalLiabilityB,
        FAR_A,
        FAR_B,
        MAR_A,
        MAR_B,
        appliedRates,
        marAppliesA,
        marAppliesB,
    };
}

/**
 * Determines the human-readable rate applied string for display.
 */
export function determineRateApplied(appliedRates: string[]): string {
    if (appliedRates.length === 0) {
        return 'None';
    }

    const farA = appliedRates.filter((r) => r.startsWith('FAR (Parent A')).length;
    const farB = appliedRates.filter((r) => r.startsWith('FAR (Parent B')).length;
    const hasMarA = appliedRates.some((r) => r.startsWith('MAR (Parent A'));
    const hasMarB = appliedRates.some((r) => r.startsWith('MAR (Parent B'));

    if (farA > 0 && farB > 0) {
        return 'FAR (Both Parents)';
    } else if (farA > 0) {
        return `FAR (Parent A, ${farA} child${farA > 1 ? 'ren' : ''})`;
    } else if (farB > 0) {
        return `FAR (Parent B, ${farB} child${farB > 1 ? 'ren' : ''})`;
    } else if (hasMarA && hasMarB) {
        return 'MAR (Both Parents)';
    } else if (hasMarA) {
        return 'MAR (Parent A)';
    } else if (hasMarB) {
        return 'MAR (Parent B)';
    }

    return 'None';
}
