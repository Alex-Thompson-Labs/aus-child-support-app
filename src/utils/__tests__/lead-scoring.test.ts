/**
 * Lead Scoring Tests
 *
 * Tests for the refactored lead scoring system with configurable weights.
 */

import { calculateLeadScore, LeadScoringInput } from '../lead-scoring';
import {
    DEFAULT_SCORING_CONFIG,
    VALUE_FOCUSED_CONFIG,
    URGENCY_FOCUSED_CONFIG,
    COMPLEXITY_FOCUSED_CONFIG,
    ScoringConfig,
} from '@/src/config/scoring-config';

describe('calculateLeadScore', () => {
    const baseInput: LeadScoringInput = {
        liability: 10000,
        specialCircumstances: [],
        financialTags: [],
        courtDate: null,
        careData: [],
        bindingAgreement: false,
    };

    describe('with default configuration', () => {
        it('should calculate score with default config when no config provided', () => {
            const result = calculateLeadScore(baseInput);
            expect(result).toHaveProperty('score');
            expect(result).toHaveProperty('category');
            expect(result).toHaveProperty('factors');
        });

        it('should score court date urgency (10 points)', () => {
            const urgentDate = new Date();
            urgentDate.setDate(urgentDate.getDate() + 15); // 15 days from now

            const result = calculateLeadScore({
                ...baseInput,
                courtDate: urgentDate,
            });

            expect(result.score).toBe(10);
            expect(result.factors).toContain('court_date_urgent');
            expect(result.category).toBe('Premium');
        });

        it('should score high-value case (6 points)', () => {
            const result = calculateLeadScore({
                ...baseInput,
                liability: 20000, // Above 15k threshold
            });

            expect(result.score).toBe(6);
            expect(result.factors).toContain('high_value_case');
            expect(result.category).toBe('Standard');
        });

        it('should score property settlement (8 points)', () => {
            const result = calculateLeadScore({
                ...baseInput,
                specialCircumstances: ['property_settlement_pending'],
            });

            expect(result.score).toBe(8);
            expect(result.factors).toContain('property_settlement');
            expect(result.category).toBe('High-Value');
        });

        it('should score international jurisdiction (8 points)', () => {
            const result = calculateLeadScore({
                ...baseInput,
                specialCircumstances: ['international_jurisdiction'],
            });

            // 8 for international + 4 for the special circumstance itself
            expect(result.score).toBe(12);
            expect(result.factors).toContain('international_jurisdiction');
            expect(result.factors).toContain('special_circumstances');
            expect(result.category).toBe('Premium');
        });

        it('should score post-separation income (5 points)', () => {
            const result = calculateLeadScore({
                ...baseInput,
                specialCircumstances: ['post_separation_income'],
            });

            // 5 for PSI + 4 for the special circumstance itself
            expect(result.score).toBe(9);
            expect(result.factors).toContain('post_separation_income');
            expect(result.factors).toContain('special_circumstances');
            expect(result.category).toBe('High-Value');
        });

        it('should score income issues (7 points)', () => {
            const result = calculateLeadScore({
                ...baseInput,
                financialTags: ['Hidden Assets'],
            });

            expect(result.score).toBe(7);
            expect(result.factors).toContain('income_issues');
            expect(result.category).toBe('High-Value');
        });

        it('should score multiple complexity (5 points + 4 per circumstance)', () => {
            const result = calculateLeadScore({
                ...baseInput,
                specialCircumstances: ['reason1', 'reason2', 'reason3'],
            });

            // 5 for multiple complexity + 4*3 for each circumstance
            expect(result.score).toBe(17);
            expect(result.factors).toContain('multiple_complexity');
            expect(result.factors).toContain('special_circumstances');
            expect(result.category).toBe('Premium');
        });

        it('should score shared care dispute (3 points)', () => {
            const result = calculateLeadScore({
                ...baseInput,
                careData: [{ careA: 40, careB: 60 }], // Shared care
            });

            expect(result.score).toBe(3);
            expect(result.factors).toContain('shared_care_dispute');
            expect(result.category).toBe('Low-Value');
        });

        it('should score binding agreement (2 points)', () => {
            const result = calculateLeadScore({
                ...baseInput,
                bindingAgreement: true,
            });

            expect(result.score).toBe(2);
            expect(result.factors).toContain('binding_agreement');
            expect(result.category).toBe('Low-Value');
        });

        it('should combine multiple factors correctly', () => {
            const urgentDate = new Date();
            urgentDate.setDate(urgentDate.getDate() + 10);

            const result = calculateLeadScore({
                liability: 20000,
                specialCircumstances: ['property_settlement_pending', 'post_separation_income'],
                financialTags: ['Cash Business'],
                courtDate: urgentDate,
                careData: [{ careA: 45, careB: 55 }],
                bindingAgreement: true,
            });

            // 10 (urgent) + 8 (property) + 5 (PSI) + 7 (income) + 6 (high value) + 3 (care) + 2 (binding)
            // + 4 (PSI as other special circumstance, property_settlement_pending is excluded from "other")
            expect(result.score).toBe(45);
            expect(result.category).toBe('Premium');
        });
    });

    describe('with custom configuration', () => {
        it('should use custom scoring points from VALUE_FOCUSED_CONFIG', () => {
            const result = calculateLeadScore(
                {
                    ...baseInput,
                    liability: 20000,
                },
                VALUE_FOCUSED_CONFIG
            );

            // VALUE_FOCUSED_CONFIG has HIGH_VALUE_CASE = 10 (instead of 6)
            expect(result.score).toBe(10);
            expect(result.category).toBe('Premium');
        });

        it('should use custom thresholds from VALUE_FOCUSED_CONFIG', () => {
            const result = calculateLeadScore(
                {
                    ...baseInput,
                    liability: 13000, // Above 12k threshold in VALUE_FOCUSED_CONFIG
                },
                VALUE_FOCUSED_CONFIG
            );

            // Should be high value with lower threshold
            expect(result.factors).toContain('high_value_case');
            expect(result.score).toBe(10);
        });

        it('should use custom scoring points from URGENCY_FOCUSED_CONFIG', () => {
            const urgentDate = new Date();
            urgentDate.setDate(urgentDate.getDate() + 15);

            const result = calculateLeadScore(
                {
                    ...baseInput,
                    courtDate: urgentDate,
                },
                URGENCY_FOCUSED_CONFIG
            );

            // URGENCY_FOCUSED_CONFIG has COURT_DATE_URGENT = 15 (instead of 10)
            expect(result.score).toBe(15);
            expect(result.category).toBe('Premium');
        });

        it('should use custom urgency window from URGENCY_FOCUSED_CONFIG', () => {
            const date40DaysAway = new Date();
            date40DaysAway.setDate(date40DaysAway.getDate() + 40);

            // Should NOT be urgent with default config (30 day window)
            const defaultResult = calculateLeadScore({
                ...baseInput,
                courtDate: date40DaysAway,
            });
            expect(defaultResult.factors).not.toContain('court_date_urgent');

            // SHOULD be urgent with URGENCY_FOCUSED_CONFIG (45 day window)
            const urgencyResult = calculateLeadScore(
                {
                    ...baseInput,
                    courtDate: date40DaysAway,
                },
                URGENCY_FOCUSED_CONFIG
            );
            expect(urgencyResult.factors).toContain('court_date_urgent');
        });

        it('should use custom scoring points from COMPLEXITY_FOCUSED_CONFIG', () => {
            const result = calculateLeadScore(
                {
                    ...baseInput,
                    specialCircumstances: ['reason1', 'reason2', 'reason3'],
                },
                COMPLEXITY_FOCUSED_CONFIG
            );

            // COMPLEXITY_FOCUSED_CONFIG has MULTIPLE_COMPLEXITY = 8 and SPECIAL_CIRCUMSTANCE = 6
            // 8 (multiple) + 6*3 (each circumstance) = 26
            expect(result.score).toBe(26);
            expect(result.category).toBe('Premium');
        });
    });

    describe('score categories', () => {
        it('should categorize as Premium (10+ points)', () => {
            const result = calculateLeadScore({
                ...baseInput,
                liability: 20000,
                financialTags: ['Hidden Assets'],
            });
            expect(result.score).toBeGreaterThanOrEqual(10);
            expect(result.category).toBe('Premium');
        });

        it('should categorize as High-Value (7-9 points)', () => {
            const result = calculateLeadScore({
                ...baseInput,
                specialCircumstances: ['property_settlement_pending'],
            });
            expect(result.score).toBeGreaterThanOrEqual(7);
            expect(result.score).toBeLessThan(10);
            expect(result.category).toBe('High-Value');
        });

        it('should categorize as Standard (4-6 points)', () => {
            const result = calculateLeadScore({
                ...baseInput,
                liability: 20000,
            });
            expect(result.score).toBeGreaterThanOrEqual(4);
            expect(result.score).toBeLessThan(7);
            expect(result.category).toBe('Standard');
        });

        it('should categorize as Low-Value (2-3 points)', () => {
            const result = calculateLeadScore({
                ...baseInput,
                bindingAgreement: true,
            });
            expect(result.score).toBeGreaterThanOrEqual(2);
            expect(result.score).toBeLessThan(4);
            expect(result.category).toBe('Low-Value');
        });

        it('should categorize as Unscored (0-1 points)', () => {
            const result = calculateLeadScore(baseInput);
            expect(result.score).toBeLessThan(2);
            expect(result.category).toBe('Unscored');
        });
    });

    describe('edge cases', () => {
        it('should handle empty input gracefully', () => {
            const result = calculateLeadScore({
                liability: 0,
            });
            expect(result.score).toBe(0);
            expect(result.factors).toHaveLength(0);
            expect(result.category).toBe('Unscored');
        });

        it('should not score court date in the past', () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 10);

            const result = calculateLeadScore({
                ...baseInput,
                courtDate: pastDate,
            });
            expect(result.factors).not.toContain('court_date_urgent');
        });

        it('should not score court date beyond urgency window', () => {
            const farFutureDate = new Date();
            farFutureDate.setDate(farFutureDate.getDate() + 100);

            const result = calculateLeadScore({
                ...baseInput,
                courtDate: farFutureDate,
            });
            expect(result.factors).not.toContain('court_date_urgent');
        });

        it('should handle undefined optional fields', () => {
            const result = calculateLeadScore({
                liability: 5000,
                specialCircumstances: undefined,
                financialTags: undefined,
                courtDate: undefined,
                careData: undefined,
            });
            expect(result).toHaveProperty('score');
            expect(result).toHaveProperty('category');
        });
    });
});
