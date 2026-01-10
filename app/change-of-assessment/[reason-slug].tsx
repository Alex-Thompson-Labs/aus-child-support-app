import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageSEO } from '../../src/components/seo/PageSEO';
import { Breadcrumb } from '../../src/components/ui/Breadcrumb';
import {
  COA_REASON_PAGES,
  getCoAReasonBySlug,
  type CoAReasonPage,
} from '../../src/utils/coa-reasons';
import {
  MAX_FORM_WIDTH,
  isWeb,
  webClickableStyles,
} from '../../src/utils/responsive';
import { createShadow } from '../../src/utils/shadow-styles';

// Static params for Expo Router static generation
export async function generateStaticParams() {
  return COA_REASON_PAGES.map((reason) => ({
    'reason-slug': reason.slug,
  }));
}

export default function ChangeOfAssessmentReasonPage() {
  const { 'reason-slug': slug } = useLocalSearchParams<{
    'reason-slug': string;
  }>();
  const router = useRouter();

  const reason = getCoAReasonBySlug(slug ?? '');

  if (!reason) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Page Not Found</Text>
          <Text style={styles.errorText}>
            The requested Change of Assessment reason could not be found.
          </Text>
          <Pressable
            style={[styles.ctaButton, isWeb && webClickableStyles]}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.ctaButtonText}>Return Home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const schema = buildSchema(reason);

  const handleCTA = () => {
    if (reason.relatedCircumstanceId) {
      router.push({
        pathname: '/special-circumstances',
        params: { preselect: reason.relatedCircumstanceId },
      });
    } else {
      router.push('/special-circumstances');
    }
  };

  const handleCalculator = () => {
    router.push('/');
  };

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
        title={reason.title}
        description={reason.metaDescription}
        canonicalPath={reason.canonicalPath}
        schema={schema}
      />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={[styles.backButton, isWeb && webClickableStyles]}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backButtonText}>{'<'} Back</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, webContainerStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Breadcrumbs */}
          <Breadcrumb
            items={[
              { label: 'Home', path: '/' },
              { label: 'Change of Assessment' },
              { label: `Reason ${reason.reasonNumber}` },
            ]}
          />

          {/* Page Title */}
          <Text style={styles.pageTitle}>
            Reason {reason.reasonNumber}: {reason.shortName}
          </Text>
          <Text style={styles.subtitle}>
            Child Support Change of Assessment
          </Text>
          <Text style={styles.officialCode}>
            Services Australia Code: {reason.officialCode}
          </Text>

          {/* Plain English Explanation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What is this reason?</Text>
            <Text style={styles.explanationText}>
              {reason.plainEnglishExplanation}
            </Text>
          </View>

          {/* Example Scenario */}
          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>
              {reason.exampleScenario.title}
            </Text>
            <Text style={styles.exampleText}>
              {reason.exampleScenario.content}
            </Text>
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>
              Do you think this applies to you?
            </Text>
            <Text style={styles.ctaDescription}>
              If this reason sounds like your situation, you may be eligible for
              a Change of Assessment. Our tool can help you identify which
              grounds apply to your case.
            </Text>
            <Pressable
              style={[styles.ctaButton, isWeb && webClickableStyles]}
              onPress={handleCTA}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Check your eligibility"
            >
              <Text style={styles.ctaButtonText}>Check Your Eligibility</Text>
            </Pressable>
          </View>

          {/* Related Links */}
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Related Information</Text>
            <View style={styles.relatedLinks}>
              <Pressable
                style={[styles.relatedLink, isWeb && webClickableStyles]}
                onPress={handleCalculator}
              >
                <Text style={styles.relatedLinkText}>
                  Calculate Your Child Support
                </Text>
              </Pressable>
              <Pressable
                style={[styles.relatedLink, isWeb && webClickableStyles]}
                onPress={() => router.push('/special-circumstances')}
              >
                <Text style={styles.relatedLinkText}>
                  View All Special Circumstances
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Browse Other Reasons - Internal Linking for SEO */}
          <View style={styles.otherReasonsSection}>
            {/* @ts-ignore - Web-only ARIA attributes */}
            <Text style={styles.otherReasonsTitle} accessibilityRole="header" aria-level="2">
              Browse Other Reasons
            </Text>
            <View style={styles.otherReasonsList}>
              {COA_REASON_PAGES.filter((r) => r.slug !== slug).map((otherReason) => (
                <Pressable
                  key={otherReason.slug}
                  style={[styles.otherReasonLink, isWeb && webClickableStyles]}
                  onPress={() => router.push(`/change-of-assessment/${otherReason.slug}`)}
                  accessibilityRole="link"
                  accessibilityLabel={`Reason ${otherReason.reasonNumber}: ${otherReason.shortName}`}
                >
                  <Text style={styles.otherReasonNumber}>
                    Reason {otherReason.reasonNumber}
                  </Text>
                  <Text style={styles.otherReasonName} numberOfLines={1}>
                    {otherReason.shortName}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              This information is general in nature and not legal advice. Every
              situation is different. For advice specific to your circumstances,
              consider consulting with a family lawyer.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

/**
 * Builds schema.org structured data for the page
 */
function buildSchema(reason: CoAReasonPage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: reason.title,
    description: reason.metaDescription,
    url: `https://auschildsupport.com${reason.canonicalPath}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'AusChildSupport',
      url: 'https://auschildsupport.com',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://auschildsupport.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Change of Assessment',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `Reason ${reason.reasonNumber}: ${reason.shortName}`,
        },
      ],
    },
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  backButtonText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },

  // Breadcrumbs
  breadcrumbs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16,
  },
  breadcrumbLink: {
    fontSize: 14,
    color: '#2563EB',
  },
  breadcrumbSeparator: {
    fontSize: 14,
    color: '#94a3b8',
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#64748b',
  },
  breadcrumbCurrent: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },

  // Page Title
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
    ...(Platform.OS === 'web' ? { lineHeight: 36 } : {}),
  },
  subtitle: {
    fontSize: 18,
    color: '#475569',
    marginBottom: 8,
  },
  officialCode: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    fontStyle: 'italic',
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  explanationText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 26,
  },

  // Example Card
  exampleCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bfdbfe',
    padding: 20,
    marginBottom: 24,
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    }),
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 12,
  },
  exampleText: {
    fontSize: 15,
    color: '#1e40af',
    lineHeight: 24,
  },

  // CTA Section
  ctaSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  ctaButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    ...createShadow({
      shadowColor: '#2563EB',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Related Links
  relatedSection: {
    marginBottom: 24,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  relatedLinks: {
    gap: 8,
  },
  relatedLink: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  relatedLinkText: {
    fontSize: 15,
    color: '#2563EB',
    fontWeight: '500',
  },

  // Disclaimer
  disclaimer: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  disclaimerText: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 20,
  },

  // Browse Other Reasons - Internal Linking
  otherReasonsSection: {
    marginBottom: 24,
  },
  otherReasonsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  otherReasonsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  otherReasonLink: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  otherReasonNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  otherReasonName: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
    maxWidth: 180,
  },
});
