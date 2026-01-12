import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { CalculationResults } from '../../utils/calculator';
import { BreakdownStepCard } from '../BreakdownStepCard';
import { AnnualRateBreakdown } from './AnnualRateBreakdown';
import { SpecialRateGlossary } from './SpecialRateGlossary';
import { ZeroPaymentScenario } from './ZeroPaymentScenario';

interface LiabilityStepProps {
    results: CalculationResults;
    formState: { supportA: boolean; supportB: boolean };
    isExpanded: boolean;
    onToggle: () => void;
}

/**
 * Liability calculation breakdown - Step 8
 * 
 * Shows the final annual rate calculation by combining
 * Child Support Percentage (Step 6) with Cost of Children (Step 7).
 * Includes per-child payment breakdown, zero payment explanations,
 * and special rates notices.
 */
export function LiabilityStep({
    results,
    formState,
    isExpanded,
    onToggle,
}: LiabilityStepProps) {
    return (
        <BreakdownStepCard
            stepNumber={8}
            title="ANNUAL RATE"
            isExpanded={isExpanded}
            onToggle={onToggle}
        >
            <>
                <Text style={styles.stepExplanation}>
                    The final annual liability is calculated by multiplying the Child
                    Support Percentage (
                    <Text style={{ fontWeight: '600' }}>STEP 6</Text>) by the total Cost
                    of the Child (<Text style={{ fontWeight: '600' }}>STEP 7</Text>).
                </Text>

                {/* Per-child payment breakdown */}
                <AnnualRateBreakdown results={results} formState={formState} />

                {/* No payment explanation - shown when any child has no payment */}
                <ZeroPaymentScenario results={results} formState={formState} />

                {/* Optional: Special rates notice */}
                <SpecialRateGlossary rateApplied={results.rateApplied} />
            </>
        </BreakdownStepCard>
    );
}

const styles = StyleSheet.create({
    stepExplanation: {
        fontSize: 14,
        color: '#64748b', // Slate 500
        lineHeight: 20,
        marginBottom: 12,
    },
});
