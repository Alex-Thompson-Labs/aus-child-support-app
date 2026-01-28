import { useAppTheme } from '@/src/theme';
import type { CalculationResults } from '@/src/utils/calculator';
import React, { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { AnnualRateBreakdown } from './AnnualRateBreakdown';
import { BreakdownStepCard } from './BreakdownStepCard';
import { SpecialRateGlossary } from './SpecialRateGlossary';

interface LiabilityStepProps {
    results: CalculationResults;
    formState: { supportA: boolean; supportB: boolean };
    expandedSteps: {
        step1A: boolean;
        step1B: boolean;
        step2Multi: boolean;
        step3Final: boolean;
    };
    onToggle: (step: 'step1A' | 'step1B' | 'step2Multi' | 'step3Final') => void;
    hasDeceasedParent?: boolean;
}

/**
 * Liability calculation breakdown - Step 8 (Formula 1)
 * 
 * Shows the final annual rate calculation by combining
 * Child Support Percentage (Step 6) with Cost of Children (Step 7).
 * Includes per-child payment breakdown, zero payment explanations,
 * and special rates notices.
 */
export function LiabilityStep({
    results,
    formState,
    expandedSteps,
    onToggle,
    hasDeceasedParent = false,
}: LiabilityStepProps) {
    const { colors } = useAppTheme();

    const dynamicStyles = useMemo(() => ({
        stepExplanation: { color: colors.textMuted },
    }), [colors]);

    return (
        <BreakdownStepCard
            stepNumber={8}
            title="ANNUAL RATE"
            isExpanded={expandedSteps.step3Final}
            onToggle={() => onToggle('step3Final')}
        >
            <>
                <Text style={[styles.stepExplanation, dynamicStyles.stepExplanation]}>
                    The final annual liability is calculated by multiplying the Child
                    Support Percentage (<Text style={{ fontWeight: '600' }}>STEP 6</Text>) by the total Cost
                    of the Child (<Text style={{ fontWeight: '600' }}>STEP 7</Text>).
                </Text>

                {/* Per-child payment breakdown */}
                <AnnualRateBreakdown results={results} formState={formState} hasDeceasedParent={hasDeceasedParent} />

                {/* Optional: Special rates notice */}
                <SpecialRateGlossary rateApplied={results.rateApplied} />
            </>
        </BreakdownStepCard>
    );
}

const styles = StyleSheet.create({
    stepExplanation: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
});
