/**
 * Child Results Calculation Module
 *
 * Pure calculation functions for per-child liability calculations.
 * Extracted from useCalculator.ts to improve maintainability and testability.
 */

import type {
    AgeRange,
    ChildResult
} from './calculator';
import { deriveAgeRange } from './calculator';
import {
    convertCareToPercentage,
    mapCareToCostPercent,
    roundCarePercentage
} from './care-utils';
import type { AssessmentYear, CarePeriod } from './child-support-constants';

// ============================================================================
// Types
// ============================================================================

/**
 * Input for a child in the calculation.
 */
export interface ChildCalcInput {
    age: number;
    careAmountA: number;
    careAmountB: number;
    carePeriod: CarePeriod;
    careAmountNPC?: number;
}

/**
 * Intermediate child data with derived values.
 */
export interface DerivedChild {
    age: number;
    ageRange: AgeRange;
    careA: number;
    careB: number;
}

/**
 * Input for child results calculation.
 */
export interface ChildResultsInput {
    selectedYear: AssessmentYear;
    children: ChildCalcInput[];
    incomePercA: number;
    incomePercB: number;
    costPerChild: number;
    hasNPC: boolean;
}

/**
 * Output from child results calculation (before FAR/MAR).
 */
export interface ChildResultsOutput {
    childResults: ChildResult[];
    totalLiabilityA: number;
    totalLiabilityB: number;
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Converts children from form input format to calculation format with derived values.
 */
export function deriveChildren(children: ChildCalcInput[]): DerivedChild[] {
    return children.map((c) => ({
        age: c.age,
        ageRange: deriveAgeRange(c.age),
        careA: convertCareToPercentage(c.careAmountA, c.carePeriod),
        careB: convertCareToPercentage(c.careAmountB, c.carePeriod),
    }));
}

/**
 * Calculates per-child liabilities based on income percentages and care arrangements.
 *
 * Steps performed:
 * 1. Determine adult child status (18+ excluded, 17 gets warning)
 * 2. Round care percentages according to legislation rules
 * 3. Map care percentages to cost percentages
 * 4. Calculate child support percentages (income % - cost %)
 * 5. Determine liability based on positive percentages and care thresholds
 * 6. Calculate NPC liabilities if applicable
 */
export function calculateChildResults(input: ChildResultsInput): ChildResultsOutput {
    const { children, incomePercA, incomePercB, costPerChild, hasNPC } = input;

    let totalLiabilityA = 0;
    let totalLiabilityB = 0;

    const childResults: ChildResult[] = children.map((childInput, childIndex) => {
        const c = {
            age: childInput.age,
            ageRange: deriveAgeRange(childInput.age),
            careA: convertCareToPercentage(childInput.careAmountA, childInput.carePeriod),
            careB: convertCareToPercentage(childInput.careAmountB, childInput.carePeriod),
        };

        // Determine adult child status
        const isAdultChild = c.age >= 18;
        const isTurning18 = c.age === 17;

        const roundedCareA = roundCarePercentage(c.careA);
        const roundedCareB = roundCarePercentage(c.careB);

        // Handle NPC care (Formula 4)
        const rawCareNPC = hasNPC
            ? convertCareToPercentage(
                childInput.careAmountNPC ?? 0,
                childInput.carePeriod ?? 'fortnight'
            )
            : 0;
        const roundedCareNPC = roundCarePercentage(rawCareNPC);
        const costPercNPC = mapCareToCostPercent(roundedCareNPC);

        const costPercA = mapCareToCostPercent(roundedCareA);
        const costPercB = mapCareToCostPercent(roundedCareB);

        // Child Support Percentage = Income % - Cost %
        const childSupportPercA = incomePercA - costPercA;
        const childSupportPercB = incomePercB - costPercB;

        // Adult children (18+) are excluded from standard child support calculation
        let liabilityA = 0;
        let liabilityB = 0;

        if (!isAdultChild) {
            const positivePercA = Math.max(0, childSupportPercA);
            const positivePercB = Math.max(0, childSupportPercB);

            if (positivePercA > positivePercB) {
                if (roundedCareB >= 35 || (hasNPC && roundedCareNPC >= 35)) {
                    liabilityA = (positivePercA / 100) * costPerChild;
                }
            } else if (positivePercB > positivePercA) {
                if (roundedCareA >= 35 || (hasNPC && roundedCareNPC >= 35)) {
                    liabilityB = (positivePercB / 100) * costPerChild;
                }
            }
        }

        // Calculate liability to NPC (Formula 4) - also skip for adult children
        let liabilityToNPC_A = 0;
        let liabilityToNPC_B = 0;
        if (!isAdultChild && hasNPC && roundedCareNPC >= 35) {
            if (childSupportPercA > 0) {
                liabilityToNPC_A =
                    (childSupportPercA / 100) * costPerChild * (costPercNPC / 100);
            }
            if (childSupportPercB > 0) {
                liabilityToNPC_B =
                    (childSupportPercB / 100) * costPerChild * (costPercNPC / 100);
            }
        }

        // Only add liability for assessable children (not adult children)
        if (!isAdultChild) {
            totalLiabilityA += liabilityA;
            totalLiabilityB += liabilityB;
        }

        return {
            age: c.age,
            ageRange: c.ageRange,
            careA: c.careA,
            careB: c.careB,
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
            // Placeholder values - will be updated by FAR/MAR logic
            finalLiabilityA: liabilityA,
            finalLiabilityB: liabilityB,
            farAppliedA: false,
            farAppliedB: false,
            marAppliedA: false,
            marAppliedB: false,
            // Multi-case cap fields (will be updated below)
            multiCaseCapA: undefined,
            multiCaseCapB: undefined,
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

    return {
        childResults,
        totalLiabilityA,
        totalLiabilityB,
    };
}
