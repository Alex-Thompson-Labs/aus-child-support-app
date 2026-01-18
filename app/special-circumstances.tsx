import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageSEO } from '../src/components/seo/PageSEO';
import Accordion from '../src/components/ui/Accordion';
import { SpecialCircumstancesWizard } from '../src/features/conversion';
import { useAnalytics } from '../src/utils/analytics';
import {
  MAX_FORM_WIDTH,
  isWeb
} from '../src/utils/responsive';
import { createShadow } from '../src/utils/shadow-styles';
import { getHighestPriorityReason } from '../src/utils/special-circumstances';

// ============================================================================
// Special Circumstances Standalone Screen
// ============================================================================
/**
 * Standalone screen for direct-entry Special Circumstances selection.
 *
 * Purpose:
 * - Allows users from blog links to skip the calculator and go directly
 *   to the lawyer inquiry form with their special circumstances.
 *
 * Flow:
 * 1. User lands on /special-circumstances (from blog link)
 * 2. User selects applicable special circumstances using the wizard
 * 3. User clicks submit in the wizard
 * 4. Navigates to /lawyer-inquiry with URL params:
 *    - mode=direct (triggers manual income inputs)
 *    - reason=special_circumstances
 *    - specialCircumstances=<JSON array of selected IDs>
 *    - priorityCircumstance=<highest priority reason ID>
 */

export default function SpecialCircumstancesScreen() {
  const router = useRouter();
  const analytics = useAnalytics();
  const { preselect, returnTo: rawReturnTo } = useLocalSearchParams<{
    preselect?: string;
    returnTo?: string;
  }>();

  const returnTo = useMemo(() => {
    if (!rawReturnTo) return undefined;
    try {
      return decodeURIComponent(rawReturnTo);
    } catch {
      return rawReturnTo;
    }
  }, [rawReturnTo]);

  // State management
  const [selectedReasons, setSelectedReasons] = useState<string[]>(
    preselect ? [preselect] : []
  );
  const [isNavigating, setIsNavigating] = useState(false);

  // PAGE SCHEMA: FAQ for Special Circumstances
  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are special circumstances in child support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Special circumstances are situations that are too complex for the standard child support calculator. These include issues with income reporting, property settlements, high child care costs, or upcoming court hearings that may affect your assessment.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I select multiple special circumstances?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, you can select multiple circumstances that apply to your situation. The system will identify the highest priority circumstance to help match you with appropriate legal assistance.',
        },
      },
      {
        '@type': 'Question',
        name: 'What happens after I select my circumstances?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'After selecting your circumstances, you will be directed to speak with a family lawyer who can help you request adjustments to your child support assessment through Services Australia.',
        },
      },
    ],
  };

  // Handle changes from the wizard
  const handleSpecialCircumstancesChange = useCallback((reasons: string[]) => {
    setSelectedReasons(reasons);
  }, []);

  // Navigation handler - redirects to lawyer inquiry with Direct Mode params
  const handleSubmit = useCallback(() => {
    if (isNavigating || selectedReasons.length === 0) {
      return;
    }

    setIsNavigating(true);

    // Track analytics
    try {
      analytics.track('special_circumstances_continue_clicked', {
        reasons_selected: JSON.stringify(selectedReasons),
        reason_count: selectedReasons.length,
        most_important_category:
          getHighestPriorityReason(selectedReasons)?.category ?? null,
        source: 'standalone_screen',
      });
    } catch (error) {
      console.error('[SpecialCircumstances] Analytics error:', error);
    }

    // Navigate to lawyer inquiry in Direct Mode
    try {
      router.push({
        pathname: '/lawyer-inquiry',
        params: {
          // Direct Mode triggers
          mode: 'direct',
          reason: 'special_circumstances',

          // Pass returnTo
          ...(returnTo ? { returnTo } : {}),

          // Special Circumstances data
          specialCircumstances: JSON.stringify(selectedReasons),
          priorityCircumstance:
            getHighestPriorityReason(selectedReasons)?.id ?? '',
        },
      });
    } catch (error) {
      console.error('[SpecialCircumstances] Navigation failed:', error);
      setIsNavigating(false);
    }
  }, [isNavigating, selectedReasons, router, analytics, returnTo]);

  // Web-specific container styles
  const webContainerStyle = isWeb
    ? {
      maxWidth: MAX_FORM_WIDTH,
      width: '100%' as const,
      alignSelf: 'center' as const,
    }
    : {};

  return (
    <>
      <PageSEO
        title="Special Circumstances | Aus Child Support"
        description="Identify special circumstances that may affect your child support assessment. Select applicable circumstances and connect with a family lawyer for assistance."
        canonicalPath="/special-circumstances"
        schema={faqSchema}
      />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Special Circumstances</Text>
          <Pressable
            style={styles.closeButton}
            onPress={() => {
              if (returnTo) {
                if (returnTo.startsWith('http')) {
                  if (Platform.OS === 'web') {
                    (
                      globalThis as unknown as { location: { href: string } }
                    ).location.href = returnTo;
                  } else {
                    Linking.openURL(returnTo);
                  }
                } else {
                  // @ts-ignore: returnTo is string but router.push expects pathname
                  router.push(returnTo);
                }
                return;
              }

              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            }}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, webContainerStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Introduction Card */}
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>
              Do special circumstances exist?
            </Text>
            <Text style={styles.introDescription}>
              Some situations are too complex for the standard calculator. If
              any of these apply, a lawyer can help you request adjustments to
              your child support assessment.
            </Text>
          </View>

          {/* Wizard Component */}
          <View style={styles.wizardWrapper}>
            <SpecialCircumstancesWizard
              initialSelectedReasons={selectedReasons}
              onSpecialCircumstancesChange={handleSpecialCircumstancesChange}
              onSubmit={handleSubmit}
              isSubmitting={isNavigating}
              isStandalone={true}
            />
          </View>

          {/* FAQ Section */}
          <View style={styles.faqSection}>
            <Text style={styles.faqSectionTitle}>
              Frequently Asked Questions
            </Text>

            <Accordion title="What are special circumstances in child support?">
              <Text style={styles.faqText}>
                Special circumstances are situations that are too complex for
                the standard child support calculator. These include issues with
                income reporting, property settlements, high child care costs,
                or upcoming court hearings that may affect your assessment.
              </Text>
            </Accordion>

            <Accordion title="Can I select multiple special circumstances?">
              <Text style={styles.faqText}>
                Yes, you can select multiple circumstances that apply to your
                situation. The system will identify the highest priority
                circumstance to help match you with appropriate legal
                assistance.
              </Text>
            </Accordion>

            <Accordion title="What happens after I select my circumstances?">
              <Text style={styles.faqText}>
                After selecting your circumstances, you will be directed to
                speak with a family lawyer who can help you request adjustments
                to your child support assessment through Services Australia.
              </Text>
            </Accordion>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // Introduction Card
  introCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bfdbfe',
    padding: 20,
    marginBottom: 32,
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    }),
  },
  wizardWrapper: {
    minHeight: 700,
    marginBottom: 64,
    ...(isWeb && { minHeight: '80vh' as any }),
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  introDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
  },

  // FAQ Section
  faqSection: {
    marginTop: 80,
    marginBottom: 24,
  },
  faqSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  faqText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },
});
