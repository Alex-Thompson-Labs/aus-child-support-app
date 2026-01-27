import { ArrowRight } from '@/src/components/icons';
import type { CalculationResults } from '@/src/utils/calculator';
import type { ComplexityFormData } from '@/src/utils/complexity-detection';
import { useResponsive } from '@/src/utils/responsive';
import { shadowPresets } from '@/src/utils/shadow-styles';
import { detectLowAssessmentTrigger } from '@/src/utils/zero-payment-detection';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * Card variant types for the Smart Conversion Footer
 */
export type ConversionCardVariant =
  | 'low_assessment'
  | 'payer_reversal'
  | 'dispute_risk'
  | 'high_value'
  | 'binding_agreement';

/**
 * Configuration for each card variant (legacy/logic-based)
 */
interface CardConfig {
  variant: ConversionCardVariant;
  backgroundColor: string;
  complexityTrigger: string;
  preFillMessage: string;
}

/**
 * Card configurations for each variant
 */
const CARD_CONFIGS: Record<ConversionCardVariant, CardConfig> = {
  low_assessment: {
    variant: 'low_assessment',
    backgroundColor: '#eff6ff', // Blue-50
    complexityTrigger: 'low_assessment',
    preFillMessage: 'I believe the other parent has hidden income or assets that should be assessed.',
  },
  payer_reversal: {
    variant: 'payer_reversal',
    backgroundColor: '#eff6ff',
    complexityTrigger: 'payer_reversal',
    preFillMessage: 'I am being asked to pay, but I believe the other parent has hidden income that would reverse this outcome.',
  },
  dispute_risk: {
    variant: 'dispute_risk',
    backgroundColor: '#eff6ff',
    complexityTrigger: 'shared_care_dispute',
    preFillMessage: 'I am concerned about my care percentage changing.',
  },
  high_value: {
    variant: 'high_value',
    backgroundColor: '#eff6ff',
    complexityTrigger: 'high_value_case',
    preFillMessage: 'I want to review my assessment liability.',
  },
  binding_agreement: {
    variant: 'binding_agreement',
    backgroundColor: '#eff6ff',
    complexityTrigger: 'binding_agreement',
    preFillMessage: 'I am interested in a Binding Child Support Agreement.',
  },
};

/**
 * Trigger-specific copy configuration
 */
interface TriggerCopy {
  headline: string;
  body: string;
  buttonText: string;
}

/**
 * Urgent, trigger-specific messaging
 */
const TRIGGER_COPY: Record<string, TriggerCopy> = {
  low_assessment: {
    headline: 'Hidden Income Detected?',
    body: 'If the other parent has undeclared income or assets, you may be entitled to more support.',
    buttonText: 'Check Now',
  },
  shared_care_dispute: {
    headline: 'Protect Your Care Percentage',
    body: 'Small changes in care arrangements can significantly impact your assessment. Ensure your nights are accurately recorded.',
    buttonText: 'Check Now',
  },
  payer_reversal: {
    headline: 'Assessment Reversal Likely',
    body: 'You may be paying when you should be receiving. Hidden income in the other parent\'s assessment could reverse this outcome.',
    buttonText: 'Check Now',
  },
  high_value_case: {
    headline: 'Get Professional Review',
    body: 'High-value assessments require expert review to ensure accuracy and fairness.',
    buttonText: 'Review Now',
  },
  binding_agreement: {
    headline: 'Get Professional Review',
    body: 'Consider a Binding Child Support Agreement for certainty and control over your arrangement.',
    buttonText: 'Review Now',
  },
};

/**
 * Determines which card variant to show based on priority logic (waterfall)
 */
export function determineCardVariant(
  results: CalculationResults,
  carePercentages: number[],
  formState?: { supportA: boolean; supportB: boolean }
): ConversionCardVariant {
  const userIsPayer = results.payer === 'Parent A';
  const bothHaveFar = results.FAR_A > 0 && results.FAR_B > 0;
  const isFarBoth = results.rateApplied?.includes('FAR') && results.rateApplied?.includes('Both');

  if (userIsPayer && (bothHaveFar || isFarBoth)) {
    return 'payer_reversal';
  }

  if (formState) {
    const { isLowAssessment } = detectLowAssessmentTrigger(results, formState);
    if (isLowAssessment) {
      return 'low_assessment';
    }
  } else {
    const userIsReceiver = results.payer === 'Parent B';
    const isFarOrMar = results.rateApplied?.includes('FAR') || results.rateApplied?.includes('MAR');
    if (userIsReceiver && isFarOrMar) {
      return 'low_assessment';
    }
  }

  const hasSharedCareDispute = carePercentages.some(
    (percentage) => percentage >= 35 && percentage <= 65
  );

  if (hasSharedCareDispute) {
    return 'dispute_risk';
  }

  if (results.finalPaymentAmount > 15000) {
    return 'high_value';
  }

  return 'binding_agreement';
}

interface SmartConversionFooterProps {
  results: CalculationResults;
  carePercentages: number[];
  formData?: ComplexityFormData;
  onBeforeNavigate?: () => void;
  onCtaPress?: (trigger: string) => void;
  calculatorStartTime?: number;
}

// ... (existing imports)

export function SmartConversionFooter({
  results,
  carePercentages,
  formData,
  onBeforeNavigate,
  onCtaPress,
  calculatorStartTime,
}: SmartConversionFooterProps) {
  const router = useRouter();
  const { isWeb } = useResponsive();
  const [isNavigating, setIsNavigating] = React.useState(false);

  // Determine logic-based trigger/config
  const formState = useMemo(() => (formData
    ? {
      supportA: formData.supportA ?? false,
      supportB: formData.supportB ?? false,
    }
    : undefined), [formData]);

  const cardVariant = useMemo(() => {
    return determineCardVariant(results, carePercentages, formState);
  }, [results, carePercentages, formState]);

  const logicConfig = CARD_CONFIGS[cardVariant];

  // Get trigger-specific copy
  const copyConfig = TRIGGER_COPY[logicConfig.complexityTrigger] || TRIGGER_COPY.high_value_case;

  const handleCardClick = React.useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);

    if (onBeforeNavigate) {
      onBeforeNavigate();
    }

    if (onCtaPress) {
      onCtaPress(logicConfig.complexityTrigger);
    }

    // Track analytics on web only
    if (Platform.OS === 'web') {
      // Lazy load react-ga4 for analytics tracking
      import('react-ga4').then((ReactGA) => {
        // Track inquiry_opened for funnel analytics
        ReactGA.default.event('inquiry_opened', {
          source: 'smart_footer',
          card_variant: cardVariant,
          complexity_trigger: logicConfig.complexityTrigger,
          total_liability: results.finalPaymentAmount,
        });
        // Legacy event for backwards compatibility
        ReactGA.default.event({
          category: 'Conversion',
          action: 'Smart_Footer_Click',
          label: `${cardVariant}_${logicConfig.complexityTrigger}`,
        });
      }).catch(() => {
        // Analytics failed to load - fail silently
      });
    }

    requestAnimationFrame(() => {
      const careData = (formData?.children ?? []).map((child, index) => ({
        index,
        careA: results.childResults[index]?.roundedCareA ?? 0,
        careB: results.childResults[index]?.roundedCareB ?? 0,
      }));

      // Combine A/B copy with logic-based triggers
      router.push({
        pathname: '/lawyer-inquiry',
        params: {
          liability: results.finalPaymentAmount.toString(),
          trigger: logicConfig.complexityTrigger,
          complexityTriggers: JSON.stringify([logicConfig.complexityTrigger]),
          incomeA: results.ATI_A.toString(),
          incomeB: results.ATI_B.toString(),
          children: (formData?.children?.length ?? 0).toString(),
          careData: JSON.stringify(careData),
          preFillMessage: logicConfig.preFillMessage,
          payer: results.payer,
          specialCircumstances: JSON.stringify(formData?.selectedCircumstances ?? []),
          fromBreakdown: 'true',
          ...(calculatorStartTime && { calculatorStartTime: calculatorStartTime.toString() }),
        },
      });

      setTimeout(() => setIsNavigating(false), 500);
    });
  }, [
    isNavigating,
    router,
    results,
    formData,
    cardVariant,
    logicConfig,
    isWeb,
    onBeforeNavigate,
    onCtaPress,
    calculatorStartTime,
    copyConfig,
  ]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleCardClick}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: logicConfig.backgroundColor },
          pressed && styles.cardPressed,
        ]}
        disabled={isNavigating}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${copyConfig.headline}. ${copyConfig.buttonText}`}
      >
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            {/* @ts-ignore - Web-only ARIA attributes */}
            <Text
              style={styles.headline}
              accessibilityRole="header"
              aria-level="2"
            >
              {copyConfig.headline}
            </Text>
            <Text style={styles.body}>
              {copyConfig.body}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>
              {copyConfig.buttonText}
            </Text>
            <ArrowRight size={20} color="#ffffff" accessible={false} />
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#3b82f6', // Blue-500
    ...shadowPresets.medium,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
  },
  headline: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e3a8a', // Blue-900
    marginBottom: 8,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    color: '#374151', // Gray-700
    lineHeight: 20,
  },
  buttonContainer: {
    alignItems: 'stretch',
  },
  button: {
    backgroundColor: '#2563eb', // Blue-600
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },

});
