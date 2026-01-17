/**
 * Lead Scoring System
 *
 * Calculates priority scores for lawyer inquiry leads based on:
 * - Urgency (court dates)
 * - Complexity (special circumstances)
 * - Value (liability amount)
 *
 * Scoring ranges (default):
 * - 10+ points: Premium lead
 * - 7-9 points: High-value lead
 * - 4-6 points: Standard qualified lead
 * - 2-3 points: Low-value lead
 *
 * Configuration can be overridden for A/B testing different scoring strategies.
 */

import {
    DEFAULT_SCORING_CONFIG,
    ScoringConfig,
} from '@/src/config/scoring-config';

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
    breakdown?: ScoreBreakdownItem[]; // Detailed breakdown of each factor's contribution
}

export interface ScoreBreakdownItem {
    factor: string;
    points: number;
    label: string;
}

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Check if court date is within urgency window
 */
function isCourtDateUrgent(
    courtDate: Date | null | undefined,
    config: ScoringConfig
): boolean {
    if (!courtDate) return false;

    const now = new Date();
    const daysUntilCourt = Math.ceil(
        (courtDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysUntilCourt > 0 && daysUntilCourt <= config.thresholds.COURT_DATE_URGENCY_DAYS;
}

/**
 * Check if court date exists but is beyond urgency window
 */
function hasCourtDateFuture(
    courtDate: Date | null | undefined,
    config: ScoringConfig
): boolean {
    if (!courtDate) return false;

    const now = new Date();
    const daysUntilCourt = Math.ceil(
        (courtDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysUntilCourt > config.thresholds.COURT_DATE_URGENCY_DAYS;
}

/**
 * Check if case has property settlement
 */
function hasPropertySettlement(
    specialCircumstances: string[] = [],
    config: ScoringConfig
): boolean {
    return specialCircumstances.includes(config.propertySettlementCircumstance);
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
function hasIncomeIssues(
    financialTags: string[] = [],
    config: ScoringConfig
): boolean {
    return financialTags.some(tag => config.incomeIssueTags.includes(tag));
}

/**
 * Check if case is high-value based on configured threshold
 */
function isHighValue(liability: number, config: ScoringConfig): boolean {
    return liability > config.thresholds.HIGH_VALUE_THRESHOLD;
}

/**
 * Check if case has multiple complexity factors
 */
function hasMultipleComplexity(
    specialCircumstances: string[] = [],
    config: ScoringConfig
): boolean {
    return specialCircumstances.length >= config.thresholds.MULTIPLE_COMPLEXITY_THRESHOLD;
}

/**
 * Check if case has shared care dispute (any child with care % in configured range)
 */
function hasSharedCareDispute(
    careData: { careA: number; careB: number }[] = [],
    config: ScoringConfig
): boolean {
    return careData.some(child => {
        const careAPercent = child.careA;
        const careBPercent = child.careB;

        return (
            (careAPercent >= config.thresholds.SHARED_CARE_MIN && 
             careAPercent <= config.thresholds.SHARED_CARE_MAX) ||
            (careBPercent >= config.thresholds.SHARED_CARE_MIN && 
             careBPercent <= config.thresholds.SHARED_CARE_MAX)
        );
    });
}

/**
 * Count special circumstances that should receive generic +4 points
 * Excludes high-value circumstances that have their own specific point values:
 * - Property Settlement (+8)
 * - International Jurisdiction (+8)
 * - Post Separation Income (+5)
 */
function countGenericSpecialCircumstances(
    specialCircumstances: string[] = [],
    config: ScoringConfig
): number {
    return specialCircumstances.filter(
        sc => !config.highValueCircumstances.includes(sc)
    ).length;
}

/**
 * Determine score category based on total points and configured thresholds
 */
function getScoreCategory(
    score: number,
    config: ScoringConfig
): LeadScoreResult['category'] {
    if (score >= config.categoryThresholds.PREMIUM) return 'Premium';
    if (score >= config.categoryThresholds.HIGH_VALUE) return 'High-Value';
    if (score >= config.categoryThresholds.STANDARD) return 'Standard';
    if (score >= config.categoryThresholds.LOW_VALUE) return 'Low-Value';
    return 'Unscored';
}

// ============================================================================
// Main Calculation Function
// ============================================================================

/**
 * Calculate lead score based on multiple factors
 *
 * @param input Lead data including special circumstances, court date, liability, etc.
 * @param config Optional scoring configuration. Defaults to DEFAULT_SCORING_CONFIG.
 *               Pass a custom config for A/B testing different scoring strategies.
 * @returns Score result with total points, category, and contributing factors
 *
 * @example
 * // Use default scoring
 * const result = calculateLeadScore(leadData);
 *
 * @example
 * // Use custom scoring for A/B test
 * import { VALUE_FOCUSED_CONFIG } from '@/src/config/scoring-config';
 * const result = calculateLeadScore(leadData, VALUE_FOCUSED_CONFIG);
 */
export function calculateLeadScore(
    input: LeadScoringInput,
    config: ScoringConfig = DEFAULT_SCORING_CONFIG
): LeadScoreResult {
    let score = 0;
    const factors: string[] = [];
    const breakdown: ScoreBreakdownItem[] = [];

    // Court Date Urgent
    if (isCourtDateUrgent(input.courtDate, config)) {
        const points = config.points.COURT_DATE_URGENT;
        score += points;
        factors.push('court_date_urgent');
        breakdown.push({
            factor: 'court_date_urgent',
            points,
            label: 'Court Date (Urgent - within 30 days)',
        });
    } else if (hasCourtDateFuture(input.courtDate, config)) {
        // Court date beyond urgency window still indicates legal proceedings
        const points = config.points.COURT_DATE_FUTURE;
        score += points;
        factors.push('court_date_future');
        breakdown.push({
            factor: 'court_date_future',
            points,
            label: 'Court Date (Future)',
        });
    }

    // International Jurisdiction
    if (hasInternationalJurisdiction(input.specialCircumstances)) {
        const points = config.points.INTERNATIONAL_JURISDICTION;
        score += points;
        factors.push('international_jurisdiction');
        breakdown.push({
            factor: 'international_jurisdiction',
            points,
            label: 'International Jurisdiction',
        });
    }

    // Property Settlement
    if (hasPropertySettlement(input.specialCircumstances, config)) {
        const points = config.points.PROPERTY_SETTLEMENT;
        score += points;
        factors.push('property_settlement');
        breakdown.push({
            factor: 'property_settlement',
            points,
            label: 'Property Settlement Pending',
        });
    }

    // Post-Separation Income
    if (hasPostSeparationIncome(input.specialCircumstances)) {
        const points = config.points.POST_SEPARATION_INCOME;
        score += points;
        factors.push('post_separation_income');
        breakdown.push({
            factor: 'post_separation_income',
            points,
            label: 'Post-Separation Income',
        });
    }

    // Income Issues
    if (hasIncomeIssues(input.financialTags, config)) {
        const points = config.points.INCOME_ISSUES;
        score += points;
        factors.push('income_issues');
        breakdown.push({
            factor: 'income_issues',
            points,
            label: 'Income Issues (Hidden Assets/Cash Business)',
        });
    }

    // High-Value Case
    if (isHighValue(input.liability, config)) {
        const points = config.points.HIGH_VALUE_CASE;
        score += points;
        factors.push('high_value_case');
        breakdown.push({
            factor: 'high_value_case',
            points,
            label: `High-Value Case (>${config.thresholds.HIGH_VALUE_THRESHOLD.toLocaleString()})`,
        });
    }

    // Multiple Complexity Factors
    if (hasMultipleComplexity(input.specialCircumstances, config)) {
        const points = config.points.MULTIPLE_COMPLEXITY;
        score += points;
        factors.push('multiple_complexity');
        breakdown.push({
            factor: 'multiple_complexity',
            points,
            label: `Multiple Complexity Factors (${input.specialCircumstances?.length || 0}+ circumstances)`,
        });
    }

    // Other Special Circumstances (generic +4 points each)
    // Excludes high-value circumstances with specific point values
    const genericCircumstances = countGenericSpecialCircumstances(
        input.specialCircumstances,
        config
    );
    if (genericCircumstances > 0) {
        const points = config.points.SPECIAL_CIRCUMSTANCE * genericCircumstances;
        score += points;
        factors.push('special_circumstances');
        breakdown.push({
            factor: 'special_circumstances',
            points,
            label: `Other Special Circumstances (${genericCircumstances} × ${config.points.SPECIAL_CIRCUMSTANCE} pts)`,
        });
    }

    // Shared Care Dispute
    if (hasSharedCareDispute(input.careData, config)) {
        const points = config.points.SHARED_CARE_DISPUTE;
        score += points;
        factors.push('shared_care_dispute');
        breakdown.push({
            factor: 'shared_care_dispute',
            points,
            label: 'Shared Care Dispute (35-65% range)',
        });
    }

    // Binding Agreement
    if (input.bindingAgreement === true) {
        const points = config.points.BINDING_AGREEMENT;
        score += points;
        factors.push('binding_agreement');
        breakdown.push({
            factor: 'binding_agreement',
            points,
            label: 'Interested in Binding Agreement',
        });
    }

    return {
        score,
        category: getScoreCategory(score, config),
        factors,
        breakdown,
    };
}
