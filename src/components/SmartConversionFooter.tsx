import { useRouter } from 'expo-router';
import React from 'react';
import ReactGA from 'react-ga4';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CalculationResults } from '../utils/calculator';
import type { ComplexityFormData } from '../utils/complexity-detection';
import { useResponsive } from '../utils/responsive';
import { shadowPresets } from '../utils/shadow-styles';
import { detectLowAssessmentTrigger } from '../utils/zero-payment-detection';

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
 * Configuration for each card variant
 */
interface CardConfig {
  variant: ConversionCardVariant;
  backgroundColor: string;
  headline: string;
  body: string;
  buttonText: string;
  complexityTrigger: string;
  preFillMessage: string;
}

/**
 * Card configurations for each variant
 */
const CARD_CONFIGS: Record<ConversionCardVariant, CardConfig> = {
  low_assessment: {
    variant: 'low_assessment',
    backgroundColor: '#eff6ff', // Blue-50 (Brand Blue)
    headline: 'Is this amount too low?',
    body: "A Fixed or Minimum Rate often means the other parent's real income isn't being assessed. You may be able to force a 'Change of Assessment'.",
    buttonText: 'Check Hidden Income Eligibility',
    complexityTrigger: 'low_assessment',
    preFillMessage: 'I believe the other parent has hidden income or assets that should be assessed.',
  },
  payer_reversal: {
    variant: 'payer_reversal',
    backgroundColor: '#eff6ff', // Blue-50 (Brand Blue)
    headline: 'Should the other parent be the payer?',
    body: "Both you and the other parent have triggered fixed rate limits for different children. If the other parent has unreported income, they may owe you more than this assessment shows.",
    buttonText: 'Check Hidden Income Eligibility',
    complexityTrigger: 'payer_reversal',
    preFillMessage: 'I am being asked to pay, but I believe the other parent has hidden income that would reverse this outcome.',
  },
  dispute_risk: {
    variant: 'dispute_risk',
    backgroundColor: '#eff6ff', // Blue-50 (Brand Blue)
    headline: 'Protect Your Care Percentage',
    body: 'You are in a high-risk zone for care disputes (35-65%). A small shift in nights can drastically change this assessment. Secure your arrangement now.',
    buttonText: 'Secure My Arrangement',
    complexityTrigger: 'shared_care_dispute',
    preFillMessage: 'I am concerned about my care percentage changing.',
  },
  high_value: {
    variant: 'high_value',
    backgroundColor: '#eff6ff', // Very light blue tint (blue-50)
    headline: 'Verify Your Assessment',
    body: 'Liability over $15,000 is considered high. Small errors in income data can cost you thousands. A legal review is recommended.',
    buttonText: 'Request Review',
    complexityTrigger: 'high_value_case',
    preFillMessage: 'I want to review my assessment liability.',
  },
  binding_agreement: {
    variant: 'binding_agreement',
    backgroundColor: '#eff6ff', // Blue-50 (Brand Blue)
    headline: 'Want Certainty?',
    body: 'Lock in this amount with a Binding Child Support Agreement to prevent future surprises or changes by the other parent.',
    buttonText: 'Discuss Agreements',
    complexityTrigger: 'binding_agreement',
    preFillMessage: 'I am interested in a Binding Child Support Agreement.',
  },
};

/**
 * Determines which card variant to show based on priority logic (waterfall)
 *
 * Priority 1: Low Assessment - User is Receiver AND (result is MAR/FAR OR would be but negated by care)
 * Priority 2: Dispute Risk - If care percentage is between 35% and 65%
 * Priority 3: High Value - If annual liability > $15,000
 * Priority 4: Binding Agreement - Default fallback
 */
export function determineCardVariant(
  results: CalculationResults,
  carePercentages: number[],
  formState?: { supportA: boolean; supportB: boolean }
): ConversionCardVariant {
  // Priority 0.5: Check for FAR reversal FIRST - User is PAYER due to both parents having FAR
  // This must come before low_assessment check to avoid false positives
  // When both parents have FAR applied and user ends up paying, show payer_reversal variant
  const userIsPayer = results.payer === 'Parent A';
  const bothHaveFar = results.FAR_A > 0 && results.FAR_B > 0;
  const isFarBoth = results.rateApplied.includes('FAR') && results.rateApplied.includes('Both');

  if (userIsPayer && (bothHaveFar || isFarBoth)) {
    return 'payer_reversal';
  }

  // Priority 1: Check for Low Assessment trigger using comprehensive detection
  // This covers edge cases where MAR/FAR is negated by care arrangements
  if (formState) {
    const { isLowAssessment } = detectLowAssessmentTrigger(results, formState);
    if (isLowAssessment) {
      return 'low_assessment';
    }
  } else {
    // Fallback to simple check if formState not provided
    const userIsReceiver = results.payer === 'Parent B';
    const isFarOrMar =
      results.rateApplied.includes('FAR') || results.rateApplied.includes('MAR');
    if (userIsReceiver && isFarOrMar) {
      return 'low_assessment';
    }
  }

  // Priority 2: Check for shared care dispute (35-65% care for any child)
  const hasSharedCareDispute = carePercentages.some(
    (percentage) => percentage >= 35 && percentage <= 65
  );

  if (hasSharedCareDispute) {
    return 'dispute_risk';
  }

  // Priority 3: Check for high value case (annual liability > $15,000)
  if (results.finalPaymentAmount > 15000) {
    return 'high_value';
  }

  // Priority 4: Default to binding agreement
  return 'binding_agreement';
}

/**
 * Props for SmartConversionFooter component
 */
interface SmartConversionFooterProps {
  results: CalculationResults;
  carePercentages: number[];
  formData?: ComplexityFormData;
  onBeforeNavigate?: () => void; // Callback to close modal before navigation
}

/**
 * Smart Conversion Footer Component
 *
 * Displays a single conversion card at the bottom of calculation results
 * based on priority logic. Drives leads to the lawyer inquiry form with
 * pre-filled complexity_trigger and message.
 */
export function SmartConversionFooter({
  results,
  carePercentages,
  formData,
  onBeforeNavigate,
}: SmartConversionFooterProps) {
  const router = useRouter();
  const { isWeb } = useResponsive();
  const [isNavigating, setIsNavigating] = React.useState(false);

  // Determine which card to show, passing formState for comprehensive edge case detection
  const formState = formData
    ? { supportA: formData.supportA ?? false, supportB: formData.supportB ?? false }
    : undefined;
  const cardVariant = determineCardVariant(results, carePercentages, formState);
  const cardConfig = CARD_CONFIGS[cardVariant];

  /**
   * Handle card button click - navigate to inquiry form with pre-filled data
   */
  const handleCardClick = React.useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);

    // Close the modal immediately before navigation (if callback provided)
    if (onBeforeNavigate) {
      onBeforeNavigate();
    }

    // Track conversion event
    if (isWeb) {
      ReactGA.event({
        category: 'Conversion',
        action: 'Smart_Footer_Click',
        label: cardVariant,
      });
    }

    requestAnimationFrame(() => {
      // Prepare care data for the inquiry form
      const careData = (formData?.children ?? []).map((child, index) => ({
        index,
        careA: results.childResults[index]?.roundedCareA ?? 0,
        careB: results.childResults[index]?.roundedCareB ?? 0,
      }));

      router.push({
        pathname: '/lawyer-inquiry',
        params: {
          liability: results.finalPaymentAmount.toString(),
          trigger: cardConfig.complexityTrigger,
          complexityTriggers: JSON.stringify([cardConfig.complexityTrigger]),
          incomeA: results.ATI_A.toString(),
          incomeB: results.ATI_B.toString(),
          children: (formData?.children?.length ?? 0).toString(),
          careData: JSON.stringify(careData),
          preFillMessage: cardConfig.preFillMessage,
          payer: results.payer,
          specialCircumstances: JSON.stringify(formData?.selectedCircumstances ?? []),
          fromBreakdown: 'true', // Track that user came from breakdown modal
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
    cardConfig,
    isWeb,
    onBeforeNavigate,
  ]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleCardClick}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: cardConfig.backgroundColor },
          pressed && styles.cardPressed,
        ]}
        disabled={isNavigating}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${cardConfig.headline}. ${cardConfig.buttonText}`}
      >
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            {/* @ts-ignore - Web-only ARIA attributes */}
            <Text
              style={styles.headline}
              accessibilityRole="header"
              aria-level="2"
            >
              {cardConfig.headline}
            </Text>
            <Text style={styles.body}>
              {cardConfig.body}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>
              {cardConfig.buttonText}
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
    borderColor: '#3b82f6', // Blue-500 (Brand Blue border)
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
    color: '#1e3a8a', // Blue-900 (Brand Blue headline)
    marginBottom: 8,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    color: '#374151', // Gray-700 (readable body text)
    lineHeight: 20,
  },
  buttonContainer: {
    alignItems: 'stretch',
  },
  button: {
    backgroundColor: '#2563eb', // Blue-600 (Brand Blue button)
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2563eb', // Blue-600
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
