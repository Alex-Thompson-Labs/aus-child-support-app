import type { CalculationResults } from '@/src/utils/calculator';
import type { ComplexityFormData } from '@/src/utils/complexity-detection';
import { useResponsive } from '@/src/utils/responsive';
import { shadowPresets } from '@/src/utils/shadow-styles';
import { detectLowAssessmentTrigger } from '@/src/utils/zero-payment-detection';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import ReactGA from 'react-ga4';
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
 * New A/B Testing Types
 */
type PaymentType = 'payer' | 'payee' | 'neutral';
type VariantId = 'A' | 'B';

interface VariantCopy {
  headline: string;
  body: string;
  buttonText: string;
}

/**
 * A/B Variant Configuration
 */
const VARIANT_CONFIG: Record<PaymentType, Record<VariantId, VariantCopy>> = {
  payer: {
    A: {
      headline: 'Review Assessment',
      body: 'Ensure your assessment is accurate. Small errors in income data can cost you thousands.',
      buttonText: 'Review Now',
    },
    B: {
      headline: 'Minimize Unfair Payments',
      body: 'Don\'t pay more than you should. Check if you are eligible for a reduction or reassessment.',
      buttonText: 'Check Fairness',
    },
  },
  payee: {
    A: {
      headline: 'Fair Share',
      body: 'Ensure you are receiving the full amount you are entitled to based on real income.',
      buttonText: 'Check Entitlement',
    },
    B: {
      headline: 'Maximize Entitlement',
      body: 'Don\'t miss out on financial support. Verify if the other parent is under-declaring income.',
      buttonText: 'Maximize Support',
    },
  },
  neutral: {
    A: {
      headline: 'Legal Review',
      body: 'Get a professional review of your child support situation to ensure fairness.',
      buttonText: 'Request Review',
    },
    B: {
      headline: 'Legal Review',
      body: 'Get a professional review of your child support situation to ensure fairness.',
      buttonText: 'Request Review',
    },
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
  const isFarBoth = results.rateApplied.includes('FAR') && results.rateApplied.includes('Both');

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
    const isFarOrMar = results.rateApplied.includes('FAR') || results.rateApplied.includes('MAR');
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
  paymentType?: PaymentType;
  onCtaPress?: (variantId: string) => void;
  calculatorStartTime?: number;
}

import AsyncStorage from '@react-native-async-storage/async-storage';

// ... (existing imports)

export function SmartConversionFooter({
  results,
  carePercentages,
  formData,
  onBeforeNavigate,
  paymentType,
  onCtaPress,
  calculatorStartTime,
}: SmartConversionFooterProps) {
  const router = useRouter();
  const { isWeb } = useResponsive();
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [variantId, setVariantId] = React.useState<VariantId>('A');

  // Load or assign variant ID on mount
  React.useEffect(() => {
    const STORAGE_KEY = 'csc_ab_variant_footer';

    async function loadVariant() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'A' || stored === 'B') {
          setVariantId(stored as VariantId);
        } else {
          // Assign new variant if none exists
          const newVariant = Math.random() < 0.5 ? 'A' : 'B';
          setVariantId(newVariant);
          await AsyncStorage.setItem(STORAGE_KEY, newVariant);
        }
      } catch (error) {
        console.warn('Failed to load A/B variant:', error);
      }
    }

    loadVariant();
  }, []);

  // Determine effective payment type if not provided
  const effectivePaymentType: PaymentType = useMemo(() => {
    if (paymentType) return paymentType;
    // Default logic: Assume User is Parent A. If Parent A is payer, then 'payer'.
    return results.payer === 'Parent A' ? 'payer' : 'payee';
  }, [paymentType, results.payer]);

  // Get A/B copy configuration
  const copyConfig = VARIANT_CONFIG[effectivePaymentType][variantId];

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

  const handleCardClick = React.useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);

    if (onBeforeNavigate) {
      onBeforeNavigate();
    }

    if (onCtaPress) {
      onCtaPress(variantId);
    }

    if (isWeb) {
      // Track inquiry_opened for funnel analytics
      ReactGA.event('inquiry_opened', {
        source: 'smart_footer',
        card_variant: cardVariant,
        payment_type: effectivePaymentType,
        ab_variant: variantId,
        total_liability: results.finalPaymentAmount,
      });
      // Legacy event for backwards compatibility
      ReactGA.event({
        category: 'Conversion',
        action: 'Smart_Footer_Click',
        label: `${cardVariant}_${effectivePaymentType}_${variantId}`,
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
          abVariant: variantId, // Pass variant to form
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
    variantId,
    effectivePaymentType,
    onCtaPress,
    calculatorStartTime,
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
            <Text style={styles.buttonArrow}>
              →
            </Text>
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
  buttonArrow: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
});
