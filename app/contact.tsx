import { PageSEO } from '@/src/components/seo/PageSEO';
import { CalculatorHeader } from '@/src/features/calculator';
import {
  MAX_FORM_WIDTH,
  isWeb,
  webClickableStyles,
} from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Schema.org structured data for Contact page
const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact AusChildSupport',
  description:
    'Contact us for questions about the Australian Child Support Calculator.',
  mainEntity: {
    '@type': 'Organization',
    name: 'AusChildSupport',
    url: 'https://auschildsupport.com',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: 'English',
    },
  },
};

export default function ContactPage() {
  const router = useRouter();

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
        title="Contact | Child Support Calculator Australia"
        description="Get in touch with AusChildSupport. Connect with family law professionals or visit our blog for child support guidance in Australia."
        canonicalPath="/contact"
        schema={contactSchema}
      />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <CalculatorHeader title="Contact" showBackButton={true} maxWidth={MAX_FORM_WIDTH} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, webContainerStyle]}
        >
          {/* Page Title */}
          {/* @ts-ignore - Web-only ARIA attributes */}
          <Text
            style={styles.pageTitle}
            accessibilityRole="header"
            aria-level="1"
          >
            Contact Us
          </Text>

          {/* Intro */}
          <Text style={styles.introText}>
            Have questions about child support calculations or need professional
            advice? Here&apos;s how you can reach us.
          </Text>

          {/* Legal Help Card */}
          <View style={styles.contactCard}>
            <Text style={styles.cardIcon}>⚖️</Text>
            {/* @ts-ignore - Web-only ARIA attributes */}
            <Text
              style={styles.cardTitle}
              accessibilityRole="header"
              aria-level="2"
            >
              Need Legal Help?
            </Text>
            <Text style={styles.cardDescription}>
              Connect with independent family law professionals who can review
              your child support situation and provide tailored advice.
            </Text>
            <Pressable
              style={[styles.primaryButton, isWeb && webClickableStyles]}
              onPress={() => router.push('/lawyer-inquiry')}
              accessibilityRole="button"
              accessibilityLabel="Request legal help"
            >
              <Text style={styles.primaryButtonText}>Request Legal Help</Text>
            </Pressable>
          </View>

          {/* Blog Card */}
          <View style={styles.contactCard}>
            <Text style={styles.cardIcon}>📚</Text>
            {/* @ts-ignore - Web-only ARIA attributes */}
            <Text
              style={styles.cardTitle}
              accessibilityRole="header"
              aria-level="2"
            >
              Visit Our Blog
            </Text>
            <Text style={styles.cardDescription}>
              Read articles about child support, family law, and financial
              planning for separated parents in Australia.
            </Text>
            <Pressable
              style={[styles.secondaryButton, isWeb && webClickableStyles]}
              onPress={() =>
                Linking.openURL('https://blog.auschildsupport.com')
              }
              accessibilityRole="button"
              accessibilityLabel="Visit blog"
            >
              <Text style={styles.secondaryButtonText}>Visit Blog →</Text>
            </Pressable>
          </View>

          {/* Calculator Card */}
          <View style={styles.contactCard}>
            <Text style={styles.cardIcon}>🧮</Text>
            {/* @ts-ignore - Web-only ARIA attributes */}
            <Text
              style={styles.cardTitle}
              accessibilityRole="header"
              aria-level="2"
            >
              Use the Calculator
            </Text>
            <Text style={styles.cardDescription}>
              Estimate your child support payments using the official 2026
              Services Australia formula.
            </Text>
            <Pressable
              style={[styles.secondaryButton, isWeb && webClickableStyles]}
              onPress={() => router.push('/')}
              accessibilityRole="button"
              accessibilityLabel="Go to calculator"
            >
              <Text style={styles.secondaryButtonText}>Calculator →</Text>
            </Pressable>
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              AusChildSupport provides estimation tools only. For official child
              support assessments, contact Services Australia directly.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
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
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  introText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 24,
  },
  contactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    ...createShadow({
      shadowColor: '#2563EB',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  disclaimerText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
    textAlign: 'center',
  },
});
