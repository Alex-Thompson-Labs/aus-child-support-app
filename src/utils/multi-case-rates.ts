/**
 * Multi-Case MAR/FAR Rate Capping and Distribution Logic
 *
 * Implements the Child Support Guide rules for:
 * - MAR 3-case cap and proportional sharing
 * - MAR 14% care negation
 * - FAR 3-child cap and proportional sharing
 * - Carer distribution for Formula 4 scenarios
 * - FAR offsetting
 *
 * Created: 2026-01-11
 */

import type { AssessmentYear } from './child-support-constants';
import { getYearConstants } from './child-support-constants';
import { formatCurrency } from './formatters';

// ============================================================================
// Types
// ============================================================================

/**
 * Type of rate cap that was applied.
 */
export type CapType =
    | 'mar_3_case'
    | 'mar_care_negation'
    | 'far_3_child'
    | 'far_offset'
    | 'none';

/**
 * Result of applying multi-case caps to MAR or FAR.
 */
export interface MultiCaseResult {
    /** The capped/adjusted amount */
    cappedAmount: number;
    /** The original amount before capping */
    originalAmount: number;
    /** Whether a cap was applied */
    capApplied: boolean;
    /** Type of cap that was applied */
    capType: CapType;
    /** Human-readable explanation of why the cap was applied */
    explanation: string;
}

/**
 * Represents a carer's share of a distributed payment.
 * Used for Formula 4 multi-carer scenarios.
 */
export interface CarerDistribution {
    /** Identifier for the carer (e.g., 'parent_a', 'parent_b', 'npc') */
    carerId: string;
    /** The carer's care percentage */
    carePercentage: number;
    /** The carer's cost percentage (derived from care %) */
    costPercentage: number;
    /** The amount allocated to this carer */
    amount: number;
}

/**
 * Input for care information used in MAR negation checks.
 */
export interface CareInfo {
    /** Care percentage for each child */
    carePercentages: number[];
}

// ============================================================================
// MAR Logic
// ============================================================================

/**
 * Apply the MAR 3-case cap.
 *
 * If a parent is involved in more than 3 child support cases, their total
 * MAR liability is capped at 3 × the yearly MAR, then proportionally shared.
 *
 * @param year - Assessment year for MAR value
 * @param totalCases - Total number of cases the parent is involved in
 * @returns MultiCaseResult with capped amount and explanation
 */
export function applyMARMultiCaseCap(
    year: AssessmentYear,
    totalCases: number
): MultiCaseResult {
    const { MAR } = getYearConstants(year);
    const originalAmount = MAR;

    if (totalCases <= 3) {
        return {
            cappedAmount: MAR,
            originalAmount,
            capApplied: false,
            capType: 'none',
            explanation: '',
        };
    }

    // Cap at 3 × MAR, then divide by total cases
    const cappedAmount = Math.round((MAR * 3) / totalCases);

    return {
        cappedAmount,
        originalAmount,
        capApplied: true,
        capType: 'mar_3_case',
        explanation: `Liability capped due to 3-case limit: (3 × ${formatCurrency(MAR)}) ÷ ${totalCases} cases = ${formatCurrency(cappedAmount)} per case`,
    };
}

/**
 * Calculate proportional MAR share for a specific case.
 *
 * @param year - Assessment year for MAR value
 * @param totalCases - Total number of cases
 * @returns The proportional share for one case (rounded to nearest dollar)
 */
export function calculateMARProportionalShare(
    year: AssessmentYear,
    totalCases: number
): number {
    const { MAR } = getYearConstants(year);

    if (totalCases <= 0) return 0;
    if (totalCases <= 3) return MAR;

    return Math.round((MAR * 3) / totalCases);
}

/**
 * Check if MAR liability should be negated due to care threshold.
 *
 * The MAR is entirely negated ($0) if the parent provides at least 14% care
 * for ANY child in the assessment.
 *
 * @param careInfo - Care percentages for each child in the case
 * @returns MultiCaseResult indicating if MAR was negated
 */
export function checkMARCareNegation(careInfo: CareInfo): MultiCaseResult {
    const hasAtLeast14PercentCare = careInfo.carePercentages.some(
        (care) => care >= 14
    );

    if (hasAtLeast14PercentCare) {
        return {
            cappedAmount: 0,
            originalAmount: 0, // Will be set by caller
            capApplied: true,
            capType: 'mar_care_negation',
            explanation:
                'MAR liability negated: parent has at least 14% care of a child in this assessment',
        };
    }

    return {
        cappedAmount: 0,
        originalAmount: 0,
        capApplied: false,
        capType: 'none',
        explanation: '',
    };
}

/**
 * Distribute MAR payment to multiple carers (Formula 4).
 *
 * Rules:
 * - The carer with the highest care percentage receives the full amount
 * - If care is exactly equal, the amount is split evenly
 *
 * @param amount - Total MAR amount to distribute
 * @param carers - Array of carers with their care percentages
 * @returns Array of CarerDistribution objects
 */
export function distributeMARToCarers(
    amount: number,
    carers: { carerId: string; carePercentage: number; costPercentage: number }[]
): CarerDistribution[] {
    if (carers.length === 0 || amount <= 0) {
        return [];
    }

    // Find maximum care percentage
    const maxCare = Math.max(...carers.map((c) => c.carePercentage));

    // Find all carers with maximum care
    const maxCareCarers = carers.filter((c) => c.carePercentage === maxCare);

    if (maxCareCarers.length === 1) {
        // Single carer with highest care gets full amount
        return carers.map((c) => ({
            ...c,
            amount: c.carePercentage === maxCare ? Math.round(amount) : 0,
        }));
    } else {
        // Multiple carers with equal highest care - split evenly
        const splitAmount = Math.round(amount / maxCareCarers.length);
        return carers.map((c) => ({
            ...c,
            amount: c.carePercentage === maxCare ? splitAmount : 0,
        }));
    }
}

// ============================================================================
// FAR Logic
// ============================================================================

/**
 * Apply the FAR 3-child cap.
 *
 * If a parent is liable to pay FAR for more than 3 children across all cases,
 * the total liability is capped at 3 × the yearly FAR, then proportionally shared.
 *
 * @param year - Assessment year for FAR value
 * @param totalChildren - Total number of children FAR applies to
 * @returns MultiCaseResult with capped amount and explanation
 */
export function applyFARMultiChildCap(
    year: AssessmentYear,
    totalChildren: number
): MultiCaseResult {
    const { FAR } = getYearConstants(year);
    const originalAmount = FAR * Math.min(totalChildren, 3);

    if (totalChildren <= 3) {
        return {
            cappedAmount: FAR * totalChildren,
            originalAmount: FAR * totalChildren,
            capApplied: false,
            capType: 'none',
            explanation: '',
        };
    }

    // Cap at 3 × FAR, then divide by total children
    const cappedPerChild = Math.round((FAR * 3) / totalChildren);
    const cappedTotal = cappedPerChild * totalChildren;

    return {
        cappedAmount: cappedPerChild,
        originalAmount: FAR,
        capApplied: true,
        capType: 'far_3_child',
        explanation: `Liability capped due to 3-child limit: (3 × ${formatCurrency(FAR)}) ÷ ${totalChildren} children = ${formatCurrency(cappedPerChild)} per child`,
    };
}

/**
 * Calculate proportional FAR share for each child.
 *
 * @param year - Assessment year for FAR value
 * @param totalChildren - Total number of children FAR applies to
 * @returns The proportional share per child (rounded to nearest dollar)
 */
export function calculateFARProportionalShare(
    year: AssessmentYear,
    totalChildren: number
): number {
    const { FAR } = getYearConstants(year);

    if (totalChildren <= 0) return 0;
    if (totalChildren <= 3) return FAR;

    return Math.round((FAR * 3) / totalChildren);
}

/**
 * Distribute FAR payment to carers based on cost percentage (Formula 4).
 *
 * When care is shared between parent and non-parent carers, the FAR is
 * distributed according to each carer's cost percentage.
 *
 * @param amount - Total FAR amount to distribute
 * @param carers - Array of carers with their cost percentages
 * @returns Array of CarerDistribution objects
 */
export function distributeFARToCarers(
    amount: number,
    carers: { carerId: string; carePercentage: number; costPercentage: number }[]
): CarerDistribution[] {
    if (carers.length === 0 || amount <= 0) {
        return [];
    }

    // Calculate total cost percentage for eligible carers (those with cost % > 0)
    const totalCostPercent = carers.reduce((sum, c) => sum + c.costPercentage, 0);

    if (totalCostPercent <= 0) {
        // No eligible carers, give full amount to first carer
        return carers.map((c, i) => ({
            ...c,
            amount: i === 0 ? Math.round(amount) : 0,
        }));
    }

    // Distribute proportionally by cost percentage
    return carers.map((c) => ({
        ...c,
        amount: Math.round((c.costPercentage / totalCostPercent) * amount),
    }));
}

/**
 * Calculate FAR offset when parent is both payer and receiver.
 *
 * If a parent is assessed to pay FAR but is also entitled to receive support
 * in the same case, the amounts are offset to reach a single net annual rate.
 *
 * @param amountPayable - FAR amount the parent must pay
 * @param amountReceivable - Support amount the parent is entitled to receive
 * @returns MultiCaseResult with net amount and explanation
 */
export function calculateFAROffset(
    amountPayable: number,
    amountReceivable: number
): MultiCaseResult {
    const netAmount = amountPayable - amountReceivable;

    if (amountPayable > 0 && amountReceivable > 0) {
        return {
            cappedAmount: Math.max(0, netAmount),
            originalAmount: amountPayable,
            capApplied: true,
            capType: 'far_offset',
            explanation: `FAR offset applied: ${formatCurrency(amountPayable)} payable - ${formatCurrency(amountReceivable)} receivable = ${formatCurrency(Math.max(0, netAmount))} net`,
        };
    }

    return {
        cappedAmount: amountPayable,
        originalAmount: amountPayable,
        capApplied: false,
        capType: 'none',
        explanation: '',
    };
}

// ============================================================================
// Explanation Helper
// ============================================================================

/**
 * Get a human-readable explanation for why a cap was applied.
 *
 * @param capType - The type of cap that was applied
 * @param details - Optional details to include in the explanation
 * @returns A user-friendly explanation string
 */
export function getCapExplanation(
    capType: CapType,
    details?: { cases?: number; children?: number; amount?: number }
): string {
    switch (capType) {
        case 'mar_3_case':
            return details?.cases
                ? `Your Minimum Annual Rate liability has been capped because you have ${details.cases} child support cases (more than 3). The maximum liability is 3 × the yearly MAR, shared proportionally across all cases.`
                : 'Your Minimum Annual Rate liability has been capped due to the 3-case limit.';

        case 'mar_care_negation':
            return 'Your Minimum Annual Rate liability is $0 because you provide at least 14% care for a child in this assessment.';

        case 'far_3_child':
            return details?.children
                ? `Your Fixed Annual Rate liability has been capped because you are liable for ${details.children} children (more than 3). The maximum liability is 3 × the yearly FAR, shared proportionally across all children.`
                : 'Your Fixed Annual Rate liability has been capped due to the 3-child limit.';

        case 'far_offset':
            return details?.amount !== undefined
                ? `Your Fixed Annual Rate has been offset against support you are entitled to receive, resulting in a net amount of ${formatCurrency(details.amount)}.`
                : 'Your Fixed Annual Rate has been offset against support you are entitled to receive.';

        case 'none':
        default:
            return '';
    }
}
