import { CARE_PERIOD_DAYS, CarePeriod } from './child-support-constants';

/**
 * Returns the maximum number of days/percentage for a given care period.
 */
export function getMaxCareForPeriod(period: CarePeriod): number {
    return CARE_PERIOD_DAYS[period];
}

/**
 * Converts care nights/days over a period to an annual percentage.
 */
export function convertCareToPercentage(
    amount: number,
    period: CarePeriod
): number {
    // If period is 'percent', the amount is already a percentage
    if (period === 'percent') {
        return amount;
    }

    const divisor = CARE_PERIOD_DAYS[period];
    if (!divisor) return 0;
    // For 'year', we assume the amount is nights per year, so we divide by 365
    if (period === 'year') {
        return (amount / 365) * 100;
    }
    // For 'week' or 'fortnight', it's nights per period
    return (amount / divisor) * 100;
}

/**
 * Rounds the care percentage according to specific rules.
 * Below 50 is rounded down, 50 and above is rounded up.
 */
export function roundCarePercentage(care: number): number {
    if (care < 50) {
        return Math.floor(care);
    } else {
        return Math.ceil(care);
    }
}

/**
 * Maps the rounded care percentage to a "cost percentage".
 */
export function mapCareToCostPercent(care: number): number {
    if (care <= 13) return 0; // Less than regular care
    if (care <= 34) return 24; // Regular care
    if (care <= 47) return 25 + 2 * (care - 35); // Shared care (Linear)
    if (care <= 52) return 50; // Shared care
    if (care <= 65) return 51 + 2 * (care - 53); // Shared care (Linear)
    if (care <= 86) return 76; // Primary care
    return 100; // More than primary care
}


/**
 * Validates non-parent carer care percentage.
 * Non-parent carers must have at least 35% care.
 */
export function validateNonParentCarerCare(carePercentage: number): boolean {
    return carePercentage >= 35;
}

/**
 * Validates that the total care amounts convert to 365 annual nights (within tolerance).
 */
export function validateTotalCare(careA: number, careB: number, period: CarePeriod): boolean {
    const nightsA = (convertCareToPercentage(careA, period) / 100) * 365;
    const nightsB = (convertCareToPercentage(careB, period) / 100) * 365;
    const total = nightsA + nightsB;
    // Tolerance of 0.5 seems reasonable
    return Math.abs(total - 365) <= 0.5;
}
