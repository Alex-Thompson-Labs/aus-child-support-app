/**
 * Year Configuration for Child Support Calculations
 *
 * Centralized configuration containing all year-specific constants
 * and COTC (Cost of Children) tables for Australian child support assessments.
 *
 * Created: 2026-01-06
 */

// ============================================================================
// Types
// ============================================================================

export type AssessmentYear = '2025' | '2026';

export interface COTCBandValues {
    /** Rate percentages for each bracket (Band 1-5) */
    percentages: number[];
    /** Base amounts for each bracket (Band 1-5) */
    bases: number[];
    /** Maximum cost cap */
    max: number;
}

export interface COTCValuesByAge {
    1: COTCBandValues;
    2: COTCBandValues;
    3: COTCBandValues;
}

export interface COTCMixedValues {
    2: COTCBandValues;
    3: COTCBandValues;
}

export interface COTCValues {
    '0-12': COTCValuesByAge;
    '13+': COTCValuesByAge;
    mixed: COTCMixedValues;
}

export interface YearConfig {
    /** Self-Support Amount (SSA) */
    SELF_SUPPORT: number;
    /** Maximum Parenting Payment Single (MAX_PPS) */
    PPS_MAX: number;
    /** Minimum Annual Rate (MAR) */
    MIN_ANNUAL_RATE: number;
    /** Fixed Annual Rate (FAR) */
    FIXED_ANNUAL_RATE: number;
    /** MTAWE income cap */
    MTAWE_CAP: number;
    /** COTC band thresholds: 0-0.5, 0.5-1.0, 1.0-1.5, 1.5-2.0, 2.0-2.5 MTAWE */
    cotcBands: number[];
    /** COTC values by age group and child count */
    cotcValues: COTCValues;
}

// ============================================================================
// Yearly Configurations
// ============================================================================

export const YEARLY_CONFIG: Record<AssessmentYear, YearConfig> = {
    '2026': {
        // Basic Thresholds for 2026
        SELF_SUPPORT: 31046,
        PPS_MAX: 26720,
        MIN_ANNUAL_RATE: 551,
        FIXED_ANNUAL_RATE: 1825,
        MTAWE_CAP: 232843,

        // COTC band thresholds based on MTAWE of $93,137
        // Bands: 0-0.5, 0.5-1.0, 1.0-1.5, 1.5-2.0, 2.0-2.5, >2.5 MTAWE
        cotcBands: [46569, 93137, 139706, 186274, 232843],

        cotcValues: {
            '0-12': {
                1: {
                    percentages: [0.17, 0.15, 0.12, 0.1, 0.07],
                    bases: [0, 7917, 14902, 20490, 25147],
                    max: 28407,
                },
                2: {
                    percentages: [0.24, 0.23, 0.2, 0.18, 0.1],
                    bases: [0, 11177, 21888, 31202, 39584],
                    max: 44241,
                },
                3: {
                    percentages: [0.27, 0.26, 0.25, 0.24, 0.18],
                    bases: [0, 12574, 24682, 36324, 47500],
                    max: 55882,
                },
            },
            '13+': {
                1: {
                    percentages: [0.23, 0.22, 0.12, 0.1, 0.09],
                    bases: [0, 10711, 20956, 26544, 31201],
                    max: 35392,
                },
                2: {
                    percentages: [0.29, 0.28, 0.25, 0.2, 0.13],
                    bases: [0, 13505, 26544, 38186, 47500],
                    max: 53554,
                },
                3: {
                    percentages: [0.32, 0.31, 0.3, 0.29, 0.2],
                    bases: [0, 14902, 29338, 43309, 56814],
                    max: 66128,
                },
            },
            mixed: {
                2: {
                    percentages: [0.265, 0.255, 0.225, 0.19, 0.115],
                    bases: [0, 12341, 24216, 34694, 43542],
                    max: 48897,
                },
                3: {
                    percentages: [0.295, 0.285, 0.275, 0.265, 0.19],
                    bases: [0, 13738, 27010, 39816, 52157],
                    max: 61005,
                },
            },
        },
    },
    '2025': {
        // Basic Thresholds for 2025 (from existing constants)
        SELF_SUPPORT: 29841, // SSA
        PPS_MAX: 26195, // MAX_PPS
        MIN_ANNUAL_RATE: 534, // MAR
        FIXED_ANNUAL_RATE: 1768, // FAR
        MTAWE_CAP: 223808,

        // COTC band thresholds based on MTAWE of $89,523
        // Bands: 0-0.5, 0.5-1.0, 1.0-1.5, 1.5-2.0, 2.0-2.5, >2.5 MTAWE
        cotcBands: [44762, 89523, 134285, 179046, 223808],

        cotcValues: {
            '0-12': {
                1: {
                    percentages: [0.17, 0.15, 0.12, 0.1, 0.07],
                    bases: [0, 7610, 14324, 19695, 24171],
                    max: 27304,
                },
                2: {
                    percentages: [0.24, 0.23, 0.2, 0.18, 0.1],
                    bases: [0, 10743, 21038, 29990, 38047],
                    max: 42523,
                },
                3: {
                    percentages: [0.27, 0.26, 0.25, 0.24, 0.18],
                    bases: [0, 12086, 23724, 34915, 45658],
                    max: 53715,
                },
            },
            '13+': {
                1: {
                    percentages: [0.23, 0.22, 0.12, 0.1, 0.09],
                    bases: [0, 10295, 20142, 25513, 29989],
                    max: 34018,
                },
                2: {
                    percentages: [0.29, 0.28, 0.25, 0.2, 0.13],
                    bases: [0, 12981, 25514, 36705, 45657],
                    max: 51476,
                },
                3: {
                    percentages: [0.32, 0.31, 0.3, 0.29, 0.2],
                    bases: [0, 14324, 28200, 41629, 54610],
                    max: 63562,
                },
            },
            mixed: {
                2: {
                    percentages: [0.265, 0.255, 0.225, 0.19, 0.115],
                    bases: [0, 11862, 23276, 33347, 41852],
                    max: 47000,
                },
                3: {
                    percentages: [0.295, 0.285, 0.275, 0.265, 0.19],
                    bases: [0, 13205, 25962, 38272, 50134],
                    max: 58639,
                },
            },
        },
    },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the configuration for a specific year
 */
export function getYearConfig(year: AssessmentYear): YearConfig {
    return YEARLY_CONFIG[year];
}

/**
 * Get basic constants for a specific year (for backward compatibility)
 */
export function getYearConstants(year: AssessmentYear) {
    const config = YEARLY_CONFIG[year];
    return {
        SSA: config.SELF_SUPPORT,
        FAR: config.FIXED_ANNUAL_RATE,
        MAR: config.MIN_ANNUAL_RATE,
        MAX_PPS: config.PPS_MAX,
        MTAWE_CAP: config.MTAWE_CAP,
    };
}

/**
 * Calculate the cost of children using the new band-based system.
 * This function handles the interpolation across COTC bands.
 *
 * @param year - Assessment year ('2025' or '2026')
 * @param ageGroup - Age group key ('0-12', '13+', or 'mixed')
 * @param childCount - Number of children (1, 2, or 3+)
 * @param combinedIncome - Combined Child Support Income (CCSI)
 * @returns The calculated cost and bracket info
 */
export function calculateCOTCFromConfig(
    year: AssessmentYear,
    ageGroup: '0-12' | '13+' | 'mixed',
    childCount: 1 | 2 | 3,
    combinedIncome: number
): { cost: number; bandIndex: number } {
    const config = YEARLY_CONFIG[year];
    const bands = config.cotcBands;

    // Handle mixed age group for 1 child (not applicable)
    if (ageGroup === 'mixed' && childCount === 1) {
        return { cost: 0, bandIndex: 0 };
    }

    const values =
        ageGroup === 'mixed'
            ? (config.cotcValues.mixed[childCount as 2 | 3] as COTCBandValues)
            : (config.cotcValues[ageGroup][childCount] as COTCBandValues);

    // Find which band the income falls into
    let bandIndex = 0;
    for (let i = 0; i < bands.length; i++) {
        if (combinedIncome <= bands[i]) {
            bandIndex = i;
            break;
        }
        bandIndex = i + 1;
    }

    // If above the last band, return the max
    if (bandIndex >= bands.length) {
        return { cost: values.max, bandIndex: bands.length };
    }

    // Get the base and percentage for this band
    const base = values.bases[bandIndex];
    const percentage = values.percentages[bandIndex];

    // Calculate income within the band
    const bandStart = bandIndex === 0 ? 0 : bands[bandIndex - 1];
    const incomeInBand = Math.max(0, combinedIncome - bandStart);

    // Calculate cost: base + (income in band * percentage)
    const cost = Math.min(base + incomeInBand * percentage, values.max);

    return { cost, bandIndex };
}
