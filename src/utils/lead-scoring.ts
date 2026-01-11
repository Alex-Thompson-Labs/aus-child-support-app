/**
 * Lead Scoring System
 *
 * Calculates priority scores for lawyer inquiry leads based on:
 * - Urgency (court dates)
 * - Complexity (special circumstances)
 * - Value (liability amount)
 *
 * Scoring ranges:
 * - 10+ points: Premium lead
 * - 7-9 points: High-value lead
 * - 4-6 points: Standard qualified lead
 * - 2-3 points: Low-value lead
 */

// ============================================================================
// Types
// ============================================================================

export interface LeadScoringInput {
    specialCircumstances?: string[];
    financialTags?: string[];
    courtDate?: Date | null;
    liability: number;
    careData?: { careA: number; careB: number }[];
    bindingAgreement?: boolean;
}

export interface LeadScoreResult {
    score: number;
    category: 'Premium' | 'High-Value' | 'Standard' | 'Low-Value' | 'Unscored';
    factors: string[];
}

// ============================================================================
// Scoring Constants
// ============================================================================

const SCORING_POINTS = {
    COURT_DATE_URGENT: 10,       // Court date within 30 days
    INTERNATIONAL_JURISDICTION: 8, // International case - high complexity
    PROPERTY_SETTLEMENT: 8,      // Property settlement pending
    INCOME_ISSUES: 7,            // Hidden assets or cash business
    HIGH_VALUE_CASE: 6,          // Liability > $15,000
    MULTIPLE_COMPLEXITY: 5,      // 3+ special circumstances
    POST_SEPARATION_INCOME: 5,   // PSI - common, valuable case
    SPECIAL_CIRCUMSTANCE: 4,     // Other special circumstance
    SHARED_CARE_DISPUTE: 3,      // Care arrangement 35-65%
    BINDING_AGREEMENT: 2,        // Interest in binding agreement
} as const;

// Thresholds
const HIGH_VALUE_THRESHOLD = 15000;
const COURT_DATE_URGENCY_DAYS = 30;
const SHARED_CARE_MIN = 35;
const SHARED_CARE_MAX = 65;
const MULTIPLE_COMPLEXITY_THRESHOLD = 3;

// Special circumstance that indicates property settlement
const PROPERTY_SETTLEMENT_CIRCUMSTANCE = 'property_settlement_pending';

// Financial tags that indicate income issues
const INCOME_ISSUE_TAGS = ['Hidden Assets', 'Cash Business'];

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Check if court date is within urgency window (30 days from now)
 */
function isCourtDateUrgent(courtDate: Date | null | undefined): boolean {
    if (!courtDate) return false;

    const now = new Date();
    const daysUntilCourt = Math.ceil(
        (courtDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysUntilCourt > 0 && daysUntilCourt <= COURT_DATE_URGENCY_DAYS;
}

/**
 * Check if case has property settlement
 */
function hasPropertySettlement(specialCircumstances: string[] = []): boolean {
    return specialCircumstances.includes(PROPERTY_SETTLEMENT_CIRCUMSTANCE);
}

/**
 * Check if case has international jurisdiction complexity
 */
function hasInternationalJurisdiction(specialCircumstances: string[] = []): boolean {
    return specialCircumstances.includes('international_jurisdiction');
}

/**
 * Check if case has post-separation income claim
 */
function hasPostSeparationIncome(specialCircumstances: string[] = []): boolean {
    return specialCircumstances.includes('post_separation_income');
}

/**
 * Check if case has income issues
 */
function hasIncomeIssues(financialTags: string[] = []): boolean {
    return financialTags.some(tag => INCOME_ISSUE_TAGS.includes(tag));
}

/**
 * Check if case is high-value (liability > $15k)
 */
function isHighValue(liability: number): boolean {
    return liability > HIGH_VALUE_THRESHOLD;
}

/**
 * Check if case has multiple complexity factors
 */
function hasMultipleComplexity(specialCircumstances: string[] = []): boolean {
    return specialCircumstances.length >= MULTIPLE_COMPLEXITY_THRESHOLD;
}

/**
 * Check if case has shared care dispute (any child with 35-65% care)
 */
function hasSharedCareDispute(
    careData: { careA: number; careB: number }[] = []
): boolean {
    return careData.some(child => {
        const careAPercent = child.careA;
        const careBPercent = child.careB;

        return (
            (careAPercent >= SHARED_CARE_MIN && careAPercent <= SHARED_CARE_MAX) ||
            (careBPercent >= SHARED_CARE_MIN && careBPercent <= SHARED_CARE_MAX)
        );
    });
}

/**
 * Count non-property-settlement special circumstances
 */
function countOtherSpecialCircumstances(specialCircumstances: string[] = []): number {
    return specialCircumstances.filter(
        sc => sc !== PROPERTY_SETTLEMENT_CIRCUMSTANCE
    ).length;
}

/**
 * Determine score category based on total points
 */
function getScoreCategory(score: number): LeadScoreResult['category'] {
    if (score >= 10) return 'Premium';
    if (score >= 7) return 'High-Value';
    if (score >= 4) return 'Standard';
    if (score >= 2) return 'Low-Value';
    return 'Unscored';
}

// ============================================================================
// Main Calculation Function
// ============================================================================

/**
 * Calculate lead score based on multiple factors
 *
 * @param input Lead data including special circumstances, court date, liability, etc.
 * @returns Score result with total points, category, and contributing factors
 */
export function calculateLeadScore(input: LeadScoringInput): LeadScoreResult {
    let score = 0;
    const factors: string[] = [];

    // Court Date Urgent (+10)
    if (isCourtDateUrgent(input.courtDate)) {
        score += SCORING_POINTS.COURT_DATE_URGENT;
        factors.push('court_date_urgent');
    }

    // International Jurisdiction (+8)
    if (hasInternationalJurisdiction(input.specialCircumstances)) {
        score += SCORING_POINTS.INTERNATIONAL_JURISDICTION;
        factors.push('international_jurisdiction');
    }

    // Property Settlement (+8)
    if (hasPropertySettlement(input.specialCircumstances)) {
        score += SCORING_POINTS.PROPERTY_SETTLEMENT;
        factors.push('property_settlement');
    }

    // Post-Separation Income (+5)
    if (hasPostSeparationIncome(input.specialCircumstances)) {
        score += SCORING_POINTS.POST_SEPARATION_INCOME;
        factors.push('post_separation_income');
    }

    // Income Issues (+7)
    if (hasIncomeIssues(input.financialTags)) {
        score += SCORING_POINTS.INCOME_ISSUES;
        factors.push('income_issues');
    }

    // High-Value Case (+6)
    if (isHighValue(input.liability)) {
        score += SCORING_POINTS.HIGH_VALUE_CASE;
        factors.push('high_value_case');
    }

    // Multiple Complexity Factors (+5)
    if (hasMultipleComplexity(input.specialCircumstances)) {
        score += SCORING_POINTS.MULTIPLE_COMPLEXITY;
        factors.push('multiple_complexity');
    }

    // Other Special Circumstances (+4 each)
    const otherCircumstances = countOtherSpecialCircumstances(
        input.specialCircumstances
    );
    if (otherCircumstances > 0) {
        score += SCORING_POINTS.SPECIAL_CIRCUMSTANCE * otherCircumstances;
        factors.push('special_circumstances');
    }

    // Shared Care Dispute (+3)
    if (hasSharedCareDispute(input.careData)) {
        score += SCORING_POINTS.SHARED_CARE_DISPUTE;
        factors.push('shared_care_dispute');
    }

    // Binding Agreement (+2)
    if (input.bindingAgreement === true) {
        score += SCORING_POINTS.BINDING_AGREEMENT;
        factors.push('binding_agreement');
    }

    return {
        score,
        category: getScoreCategory(score),
        factors,
    };
}
