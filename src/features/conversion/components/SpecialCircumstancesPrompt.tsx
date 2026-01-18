import { useAnalytics } from '@/src/utils/analytics';
import type { CalculationResults } from '@/src/utils/calculator';
import type { ComplexityFormData } from '@/src/utils/complexity-detection';
import { isWeb, webClickableStyles } from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import { getHighestPriorityReason } from '@/src/utils/special-circumstances';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SpecialCircumstancesWizard } from './SpecialCircumstancesWizard';

// Types
interface SpecialCircumstancesPromptProps {
  results: CalculationResults;
  formData?: ComplexityFormData;
  onNavigate: () => void;
  onRequestInquiry?: () => void;
  onSpecialCircumstancesChange?: (reasons: string[]) => void;
  calculatorStartTime?: number;
  specialCircumstances?: boolean;
  sharedCareDispute?: boolean;
}

// Main Prompt Component (Collapsible wrapper for the wizard)
export function SpecialCircumstancesPrompt({
  results,
  formData,
  onNavigate,
  onRequestInquiry,
  onSpecialCircumstancesChange,
  calculatorStartTime,
  specialCircumstances = false,
  sharedCareDispute = false,
}: SpecialCircumstancesPromptProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>(
    formData?.selectedCircumstances ?? []
  );
  // Auto-expand if any complexity flag is true
  const [isExpanded, setIsExpanded] = useState(
    specialCircumstances || sharedCareDispute
  );
  const [isNavigating, setIsNavigating] = useState(false);

  const router = useRouter();
  const analytics = useAnalytics();

  React.useEffect(() => {
    setSelectedReasons(formData?.selectedCircumstances ?? []);
  }, [formData?.selectedCircumstances]);

  const handleSpecialCircumstancesChange = useCallback(
    (reasons: string[]) => {
      setSelectedReasons(reasons);
      onSpecialCircumstancesChange?.(reasons);
    },
    [onSpecialCircumstancesChange]
  );

  const handleSubmit = useCallback(() => {
    if (isNavigating || selectedReasons.length === 0) return;
    setIsNavigating(true);

    try {
      // Track inquiry_opened for funnel analytics
      analytics.track('inquiry_opened', {
        source: 'special_circumstances',
        reason_count: selectedReasons.length,
        most_important_category:
          getHighestPriorityReason(selectedReasons)?.category ?? null,
        total_liability: results.finalPaymentAmount,
      });
      // Legacy event
      analytics.track('coa_button_clicked', {
        reasons_selected: JSON.stringify(selectedReasons),
        reason_count: selectedReasons.length,
        most_important_category:
          getHighestPriorityReason(selectedReasons)?.category ?? null,
        annual_liability: results.finalPaymentAmount,
      });
    } catch {
      // Ignore analytics errors
    }

    if (onRequestInquiry) {
      onRequestInquiry();
      setTimeout(() => setIsNavigating(false), 500);
      return;
    }

    onNavigate();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          const careData = (formData?.children ?? []).map(
            (_child: any, index: number) => ({
              index,
              careA: results.childResults[index]?.roundedCareA ?? 0,
              careB: results.childResults[index]?.roundedCareB ?? 0,
            })
          );

          router.push({
            pathname: '/lawyer-inquiry',
            params: {
              liability: results.finalPaymentAmount.toString(),
              trigger: 'change_of_assessment',
              incomeA: results.ATI_A.toString(),
              incomeB: results.ATI_B.toString(),
              children: (formData?.children?.length ?? 0).toString(),
              careData: JSON.stringify(careData),
              payer: results.payer,
              specialCircumstances: JSON.stringify(selectedReasons),
              priorityCircumstance:
                getHighestPriorityReason(selectedReasons)?.id ?? '',
              fromBreakdown: 'true',
              ...(calculatorStartTime && {
                calculatorStartTime: calculatorStartTime.toString(),
              }),
            },
          });
        } catch {
          if (Platform.OS === 'web') {
            alert(
              'Navigation Error\n\nUnable to open inquiry form. Please try again.'
            );
          } else {
            Alert.alert(
              'Navigation Error',
              'Unable to open inquiry form. Please try again.'
            );
          }
        } finally {
          setTimeout(() => setIsNavigating(false), 500);
        }
      });
    });
  }, [
    isNavigating,
    selectedReasons,
    onNavigate,
    onRequestInquiry,
    router,
    results,
    formData,
    analytics,
    calculatorStartTime,
  ]);

  return (
    <View style={styles.coaContainer}>
      <Pressable
        style={[styles.coaHeader, isWeb && webClickableStyles]}
        onPress={() => setIsExpanded((p) => !p)}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Do special circumstances exist? ${isExpanded ? 'Collapse' : 'Expand'
          }`}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.coaTitle}>Do special circumstances exist?</Text>
            <View style={styles.headerRight}>
              {!isExpanded && selectedReasons.length > 0 && (
                <View style={styles.selectionBadge}>
                  <Text style={styles.selectionBadgeText}>
                    {selectedReasons.length} selected
                  </Text>
                </View>
              )}
              <Text
                style={[styles.chevron, isExpanded && styles.chevronExpanded]}
              >
                ›
              </Text>
            </View>
          </View>
          <Text style={styles.coaDescription}>
            Some situations are too complex for the standard calculator. If any
            of these apply, a lawyer can help you request adjustments.
          </Text>
        </View>
      </Pressable>

      {isExpanded && (
        <View style={styles.wizardWrapper}>
          <SpecialCircumstancesWizard
            initialSelectedReasons={selectedReasons}
            onSpecialCircumstancesChange={handleSpecialCircumstancesChange}
            onSubmit={handleSubmit}
            isSubmitting={isNavigating}
          />
        </View>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  coaContainer: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bfdbfe',
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 24,
    marginBottom: 16,
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    }),
  },
  coaHeader: { marginBottom: 0 },
  headerContent: { width: '100%' },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  coaTitle: { fontSize: 18, fontWeight: '600', color: '#1e3a8a', flex: 1 },
  coaDescription: { fontSize: 14, color: '#475569', lineHeight: 21 },
  chevron: {
    fontSize: 24,
    color: '#2563eb',
    fontWeight: '600',
    transform: [{ rotate: '90deg' }],
    marginLeft: 4,
  },
  chevronExpanded: { transform: [{ rotate: '270deg' }] },
  selectionBadge: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  selectionBadgeText: { fontSize: 12, color: '#1e40af', fontWeight: '600' },
  wizardWrapper: { marginTop: 32, paddingBottom: 16 },
});
