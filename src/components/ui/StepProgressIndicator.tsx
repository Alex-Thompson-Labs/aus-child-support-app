/**
 * StepProgressIndicator Component
 *
 * A reusable progress indicator for multi-step flows.
 * Shows the current step in the user journey: Calculator → Results → Get Help
 *
 * Usage:
 * <StepProgressIndicator currentStep={1} /> // Calculator step
 * <StepProgressIndicator currentStep={2} /> // Results step
 * <StepProgressIndicator currentStep={3} /> // Get Help step
 */

import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useAppTheme } from '../../theme';


export interface StepProgressIndicatorProps {
    /**
     * Current step (1-3)
     * 1 = Calculator, 2 = Results, 3 = Get Help
     */
    currentStep: 1 | 2 | 3;
    /**
     * Whether to show step labels below the progress bar
     * @default true
     */
    showLabels?: boolean;
    /**
     * Compact mode for smaller screens or embedded contexts
     * @default false
     */
    compact?: boolean;
    /**
     * Progress percentage for step 1 (0-100)
     * Allows granular filling of the line between step 1 and 2
     */
    step1Progress?: number;
    /**
     * Progress percentage for step 2 (0-100)
     * Allows granular filling of the line between step 2 and 3
     */
    step2Progress?: number;
}

interface Step {
    number: number;
    label: string;
    shortLabel: string;
}

const STEPS: Step[] = [
    { number: 1, label: 'Inputs', shortLabel: 'Inputs' },
    { number: 2, label: 'Estimate', shortLabel: 'Estimate' },
    { number: 3, label: 'Next Steps', shortLabel: 'Next Steps' },
];

export function StepProgressIndicator({
    currentStep,
    showLabels = true,
    compact = false,
    step1Progress = 0,
    step2Progress = 0,
}: StepProgressIndicatorProps) {
    const { colors } = useAppTheme();

    const getStepStatus = (stepNumber: number): 'completed' | 'current' | 'upcoming' => {
        if (stepNumber < currentStep) return 'completed';
        if (stepNumber === currentStep) return 'current';
        return 'upcoming';
    };

    const getStepCircleStyle = (status: 'completed' | 'current' | 'upcoming') => {
        const baseSize = compact ? 28 : 32;
        const baseStyle = {
            width: baseSize,
            height: baseSize,
            borderRadius: baseSize / 2,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
        };

        switch (status) {
            case 'completed':
                return {
                    ...baseStyle,
                    backgroundColor: colors.primary,
                    borderWidth: 0,
                };
            case 'current':
                return {
                    ...baseStyle,
                    backgroundColor: colors.primary,
                    borderWidth: 3,
                    borderColor: '#93c5fd', // Light blue border instead of dark navy
                    // Add subtle glow effect for current step
                    ...Platform.select({
                        web: {
                            boxShadow: `0 0 12px ${colors.primary}50`,
                        },
                        default: {},
                    }),
                };
            case 'upcoming':
                return {
                    ...baseStyle,
                    backgroundColor: colors.surface,
                    borderWidth: 2,
                    borderColor: colors.border,
                };
        }
    };

    const renderConnector = (stepNumber: number) => {
        // Connector connects stepNumber and stepNumber + 1
        const containerStyle = {
            flex: 1,
            height: 3,
            backgroundColor: colors.border,
            marginHorizontal: compact ? 4 : 8,
            borderRadius: 2,
            overflow: 'hidden' as const,
        };

        let fillPercent = 0;
        if (currentStep > stepNumber) {
            fillPercent = 100;
        } else if (currentStep === stepNumber) {
            if (stepNumber === 1) {
                fillPercent = Math.min(100, Math.max(0, step1Progress));
            } else if (stepNumber === 2) {
                fillPercent = Math.min(100, Math.max(0, step2Progress));
            }
        }

        return (
            <View style={containerStyle}>
                <View style={{
                    width: `${fillPercent}%`,
                    height: '100%',
                    backgroundColor: colors.primary,
                }} />
            </View>
        );
    };

    const renderCheckmark = () => (
        <Text style={[styles.checkmark, { color: colors.textInverse }]}>✓</Text>
    );

    const renderStepNumber = (number: number, status: 'completed' | 'current' | 'upcoming') => {
        const textColor = status === 'upcoming' ? colors.textMuted : colors.textInverse;
        return (
            <Text
                style={[
                    styles.stepNumber,
                    compact && styles.stepNumberCompact,
                    { color: textColor },
                ]}
            >
                {number}
            </Text>
        );
    };

    return (
        <View
            style={[
                styles.container,
                compact && styles.containerCompact,
            ]}
            accessibilityRole="progressbar"
            accessibilityLabel={`Step ${currentStep} of 3: ${STEPS[currentStep - 1].label}`}
            accessibilityValue={{ min: 1, max: 3, now: currentStep }}
        >
            {/* Progress Track */}
            <View style={styles.trackContainer}>
                {STEPS.map((step, index) => {
                    const status = getStepStatus(step.number);
                    const isLast = index === STEPS.length - 1;

                    return (
                        <React.Fragment key={step.number}>
                            {/* Step Circle */}
                            <View
                                style={[
                                    styles.stepCircle,
                                    getStepCircleStyle(status),
                                ]}
                                accessibilityLabel={`Step ${step.number}: ${step.label}. ${status === 'completed'
                                    ? 'Completed'
                                    : status === 'current'
                                        ? 'Current step'
                                        : 'Not yet started'
                                    }`}
                            >
                                {status === 'completed'
                                    ? renderCheckmark()
                                    : renderStepNumber(step.number, status)}
                            </View>

                            {/* Connector line */}
                            {!isLast && renderConnector(step.number)}
                        </React.Fragment>
                    );
                })}
            </View>

            {/* Labels */}
            {showLabels && (
                <View style={styles.labelsContainer}>
                    {STEPS.map((step) => {
                        const status = getStepStatus(step.number);
                        return (
                            <View key={step.number} style={styles.labelWrapper}>
                                <Text
                                    style={[
                                        styles.label,
                                        compact && styles.labelCompact,
                                        {
                                            color:
                                                status === 'current'
                                                    ? colors.primary
                                                    : status === 'completed'
                                                        ? colors.textSecondary
                                                        : colors.textMuted,
                                            fontWeight: status === 'current' ? '600' : '400',
                                        },
                                    ]}
                                    numberOfLines={1}
                                >
                                    {compact ? step.shortLabel : step.label}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        width: '100%',
    },
    containerCompact: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    trackContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    stepCircle: {
        // Base styles are applied dynamically via getStepCircleStyle
    },
    checkmark: {
        fontSize: 16,
        fontWeight: '700',
    },
    stepNumber: {
        fontSize: 14,
        fontWeight: '600',
    },
    stepNumberCompact: {
        fontSize: 12,
    },
    labelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingHorizontal: 0,
    },
    labelWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    label: {
        fontSize: 13,
        textAlign: 'center',
    },
    labelCompact: {
        fontSize: 11,
    },
});
