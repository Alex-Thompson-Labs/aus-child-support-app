import { ContextualWizard } from '@/src/components/blog/ContextualWizard';
import { PageSEO } from '@/src/components/seo/PageSEO';
import { MAX_CALCULATOR_WIDTH, isWeb, webClickableStyles } from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I enforce child support if the other parent lives overseas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, if the other parent lives in a reciprocating jurisdiction (country with a child support agreement with Australia). Services Australia can work with overseas authorities to establish and enforce child support. If the country is not a reciprocating jurisdiction, enforcement is much more difficult and may require international legal action.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which countries have child support agreements with Australia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Australia has reciprocating jurisdiction agreements with New Zealand, the United States, United Kingdom, and several other countries. These agreements allow child support to be established and enforced across borders. The full list includes countries that have signed the Hague Convention on International Recovery of Child Support.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does international child support enforcement take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'International enforcement can take considerable time, depending on the country and complexity of the case. The process involves coordination between Australian and overseas authorities, which can be time-consuming. Cases in reciprocating jurisdictions are generally faster than non-reciprocating countries.',
      },
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Overseas Parent Child Support Enforcement: Complete Guide for Australia',
  description:
    'Comprehensive guide to enforcing child support when a parent lives overseas. Learn about reciprocating jurisdictions, international treaties, enforcement mechanisms, and your legal options.',
  author: {
    '@type': 'Organization',
    name: 'Australian Child Support Calculator',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Australian Child Support Calculator',
    logo: {
      '@type': 'ImageObject',
      url: 'https://auschildsupport.com.au/main-page-logo.png',
    },
  },
  datePublished: '2026-01-24',
  dateModified: '2026-01-24',
};

export default function OverseasParentEnforcementScreen() {
  const router = useRouter();

  const webContainerStyle = isWeb
    ? {
        maxWidth: MAX_CALCULATOR_WIDTH,
        width: '100%' as const,
        alignSelf: 'center' as const,
      }
    : {};

  return (
    <>
      <PageSEO
        title="Overseas Parent Child Support Enforcement Australia 2026: International Recovery"
        description="Parent overseas? Enforcement works in 80+ countries through reciprocating jurisdictions. See Hague Convention agreements + enforcement process. Start now."
        canonicalPath="/blog/overseas-parent-child-support-enforcement"
        schema={[faqSchema, articleSchema]}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Blog', path: '/blog' },
          { label: 'Overseas Parent Enforcement' },
        ]}
      />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
          <View style={styles.articleHeader}>
            <Text style={styles.category}>International Enforcement</Text>
            <Text style={styles.h1} accessibilityRole="header">
              Overseas Parent Child Support Enforcement: Complete Guide for Australia
            </Text>
            <Text style={styles.publishDate}>Published January 24, 2026</Text>
          </View>

          <Text style={styles.intro}>
            When a parent moves overseas, enforcing child support becomes significantly more complex. However, Australia has international agreements with many countries that allow child support to be established and enforced across borders. Understanding these mechanisms is crucial for parents seeking to secure financial support for their children.
          </Text>

          <View style={styles.quickAnswerBox}>
            <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
            <Text style={styles.quickAnswerText}>
              Enforcing child support when a parent lives overseas requires reciprocating jurisdiction agreements. 
              Australia has treaties with 80+ countries. Calculate your Australian assessment below, then seek legal 
              advice for enforcement.
            </Text>
            <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
              <Text style={styles.quickAnswerButtonText}>Calculate Amount →</Text>
            </Pressable>
          </View>

          <Text style={styles.paragraph}>
            This comprehensive guide explains everything you need to know about international child support enforcement, including reciprocating jurisdictions, the enforcement process, your legal options, and what to do when the other parent lives in a non-reciprocating country.
          </Text>

          <Text style={styles.h2} accessibilityRole="header">Can I enforce child support if the other parent lives overseas?</Text>

          <Text style={styles.paragraph}>
            Yes, you can enforce child support if the other parent lives in a reciprocating jurisdiction (country with a child support agreement with Australia). Services Australia can work with overseas authorities to establish and enforce child support in over 80 countries including the UK, US, Canada, NZ, and all EU countries. If the country is not a reciprocating jurisdiction, enforcement is much more difficult and may require international legal action, but the debt still exists and can be pursued if your ex returns to Australia.
          </Text>

          <Text style={styles.h2} accessibilityRole="header">Understanding International Child Support</Text>

          <Text style={styles.paragraph}>
            International child support enforcement relies on agreements between countries to recognize and enforce each other's child support orders. Without these agreements, enforcing child support across borders is extremely difficult. If you're dealing with a parent who has moved overseas, understanding{' '}
            <Text
              style={styles.inlineLink}
              onPress={() => router.push('/blog/international-child-support-australia')}
            >
              international child support arrangements
            </Text>
            {' '}is crucial.
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Key Concept: Reciprocating Jurisdictions</Text>
            <Text style={styles.paragraph}>
              A reciprocating jurisdiction is a country that has a formal agreement with Australia to enforce child support obligations. These agreements allow Australian child support assessments to be recognized and enforced overseas, and vice versa.
            </Text>
          </View>

          <Text style={styles.h2} accessibilityRole="header">Reciprocating Jurisdictions</Text>

          <Text style={styles.paragraph}>
            Australia has child support agreements with numerous countries, primarily through:
          </Text>

          <Text style={styles.bulletItem}>
            • The Hague Convention on International Recovery of Child Support (2007)
          </Text>
          <Text style={styles.bulletItem}>
            • Bilateral agreements with specific countries
          </Text>
          <Text style={styles.bulletItem}>
            • Commonwealth reciprocal enforcement arrangements
          </Text>

          <Text style={styles.h3}>Major Reciprocating Jurisdictions</Text>

          <Text style={styles.paragraph}>
            Countries with strong enforcement mechanisms include:
          </Text>

          <Text style={styles.bulletItem}>
            • New Zealand - Closest integration with Australian system
          </Text>
          <Text style={styles.bulletItem}>
            • United States - Comprehensive enforcement through federal and state systems
          </Text>
          <Text style={styles.bulletItem}>
            • United Kingdom - Well-established reciprocal arrangements
          </Text>
          <Text style={styles.bulletItem}>
            • Canada - Provincial cooperation through federal framework
          </Text>
          <Text style={styles.bulletItem}>
            • European Union countries (most member states)
          </Text>
          <Text style={styles.bulletItem}>
            • Norway, Switzerland, and other Hague Convention signatories
          </Text>

          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️ Check Current Status</Text>
            <Text style={styles.warningText}>
              Reciprocating jurisdiction status can change. Always verify current agreements with Services Australia before proceeding with international enforcement.
            </Text>
          </View>

          <Text style={styles.h2} accessibilityRole="header">How International Enforcement Works</Text>

          <View style={styles.stepCard}>
            <Text style={styles.stepNumber}>STEP 1</Text>
            <Text style={styles.stepTitle}>Establish Australian Assessment</Text>
            <Text style={styles.stepDesc}>
              First, you need an Australian child support assessment. This can be an administrative assessment from Services Australia, a court order for child support, or a registered Binding Child Support Agreement.
            </Text>
          </View>

          <View style={styles.stepCard}>
            <Text style={styles.stepNumber}>STEP 2</Text>
            <Text style={styles.stepTitle}>Register for International Enforcement</Text>
            <Text style={styles.stepDesc}>
              Contact Services Australia's International Child Support team to confirm the overseas country is a reciprocating jurisdiction, complete application forms, and provide details of the overseas parent's location and employment.
            </Text>
          </View>

          <View style={styles.stepCard}>
            <Text style={styles.stepNumber}>STEP 3</Text>
            <Text style={styles.stepTitle}>Transmission to Overseas Authority</Text>
            <Text style={styles.stepDesc}>
              Services Australia transmits your case to the relevant overseas authority, which may be a government child support agency, a designated central authority under the Hague Convention, or a court system.
            </Text>
          </View>

          <View style={styles.stepCard}>
            <Text style={styles.stepNumber}>STEP 4</Text>
            <Text style={styles.stepTitle}>Overseas Recognition and Enforcement</Text>
            <Text style={styles.stepDesc}>
              The overseas authority will review and recognize the Australian assessment, locate the paying parent, determine their income under local laws, and implement enforcement mechanisms.
            </Text>
          </View>

          <Text style={styles.h2} accessibilityRole="header">Enforcement Mechanisms</Text>

          <Text style={styles.paragraph}>
            Overseas authorities can use various enforcement tools, depending on local laws:
          </Text>

          <Text style={styles.h3}>Income Withholding</Text>

          <Text style={styles.paragraph}>
            The most common method - child support is deducted directly from the paying parent's wages or salary. This is similar to employer withholding in Australia.
          </Text>

          <Text style={styles.h3}>Asset Seizure</Text>

          <Text style={styles.paragraph}>
            In some jurisdictions, authorities can seize bank accounts, property, or other assets to satisfy child support debts.
          </Text>

          <Text style={styles.h3}>License Suspension</Text>

          <Text style={styles.paragraph}>
            Some countries can suspend driver's licenses, professional licenses, or passports for non-payment of child support.
          </Text>

          <Text style={styles.h3}>Court Proceedings</Text>

          <Text style={styles.paragraph}>
            Overseas authorities may initiate court proceedings to enforce the child support obligation, potentially leading to contempt charges or other penalties.
          </Text>

          <Text style={styles.h2} accessibilityRole="header">Challenges in International Enforcement</Text>

          <Text style={styles.h3}>Time Delays</Text>

          <Text style={styles.paragraph}>
            International enforcement can take considerable time, often many months or longer. Factors affecting timing include:
          </Text>

          <Text style={styles.bulletItem}>
            • Communication between authorities in different countries
          </Text>
          <Text style={styles.bulletItem}>
            • Translation of documents
          </Text>
          <Text style={styles.bulletItem}>
            • Different legal systems and procedures
          </Text>
          <Text style={styles.bulletItem}>
            • Locating the overseas parent
          </Text>
          <Text style={styles.bulletItem}>
            • Workload of overseas authorities
          </Text>

          <Text style={styles.h3}>Currency Conversion</Text>

          <Text style={styles.paragraph}>
            Child support assessed in Australian dollars must be converted to local currency. Exchange rate fluctuations can affect the amount received.
          </Text>

          <Text style={styles.h3}>Different Legal Standards</Text>

          <Text style={styles.paragraph}>
            Some countries may calculate child support differently than Australia, have different income definitions, apply different enforcement priorities, or require additional documentation or court proceedings.
          </Text>

          <Text style={styles.h2} accessibilityRole="header">Non-Reciprocating Jurisdictions</Text>

          <Text style={styles.paragraph}>
            If the other parent lives in a country without a child support agreement with Australia, enforcement becomes extremely difficult.
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Limited Enforcement Options</Text>
            <Text style={styles.paragraph}>
              1. Wait for the parent to return to Australia or a reciprocating jurisdiction{'\n\n'}
              2. Pursue private legal action in the overseas country (expensive and uncertain){'\n\n'}
              3. Negotiate a private agreement directly with the other parent{'\n\n'}
              4. Seek enforcement if the parent has assets in Australia or reciprocating jurisdictions
            </Text>
          </View>

          <Text style={styles.h2} accessibilityRole="header">Preventing Overseas Evasion</Text>

          <Text style={styles.h3}>Departure Prohibition Orders</Text>

          <Text style={styles.paragraph}>
            Services Australia can apply for a Departure Prohibition Order (DPO) to prevent the paying parent from leaving Australia if they have significant child support debt. Learn more about{' '}
            <Text
              style={styles.inlineLink}
              onPress={() => router.push('/blog/child-support-arrears-australia')}
            >
              child support arrears and enforcement
            </Text>
            . Requirements include:
          </Text>

          <Text style={styles.bulletItem}>
            • Significant child support debt
          </Text>
          <Text style={styles.bulletItem}>
            • Persistent non-payment without reasonable grounds
          </Text>
          <Text style={styles.bulletItem}>
            • Registrar believes it's desirable to prevent departure
          </Text>

          <Text style={styles.h2} accessibilityRole="header">When to Seek Legal Advice</Text>

          <Text style={styles.paragraph}>
            Consider consulting a family lawyer if:
          </Text>

          <Text style={styles.bulletItem}>
            • The other parent lives in a non-reciprocating jurisdiction
          </Text>
          <Text style={styles.bulletItem}>
            • International enforcement has been unsuccessful
          </Text>
          <Text style={styles.bulletItem}>
            • You need to pursue private legal action overseas
          </Text>
          <Text style={styles.bulletItem}>
            • The case involves complex international legal issues
          </Text>
          <Text style={styles.bulletItem}>
            • You want to prevent the other parent from leaving Australia
          </Text>
          <Text style={styles.bulletItem}>
            • Significant arrears have accumulated
          </Text>

          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️ Complex International Cases</Text>
            <Text style={styles.warningText}>
              International child support enforcement involves multiple legal systems and can be highly complex. Professional legal advice helps you understand your options and navigate the process effectively.
            </Text>
          </View>

          <ContextualWizard
            preselectedFactors={['international_jurisdiction']}
            highlightedFactors={['income_resources_not_reflected']}
            blogTopic="overseas_parent"
            ctaText="Get Help With International Enforcement"
            analyticsSource="blog_overseas_parent_child_support_enforcement"
            formReason="special_circumstances"
            title="Dealing With an Overseas Parent?"
            description="International enforcement requires specialized knowledge of reciprocating jurisdictions and cross-border legal mechanisms. Select any factors that apply."
          />

          <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

          <FAQItem
            question="Can I enforce child support if the other parent lives overseas?"
            answer="Yes, if the other parent lives in a reciprocating jurisdiction (country with a child support agreement with Australia). Services Australia can work with overseas authorities to establish and enforce child support. If the country is not a reciprocating jurisdiction, enforcement is much more difficult and may require international legal action."
          />

          <FAQItem
            question="Which countries have child support agreements with Australia?"
            answer="Australia has reciprocating jurisdiction agreements with New Zealand, the United States, United Kingdom, and several other countries. These agreements allow child support to be established and enforced across borders. The full list includes countries that have signed the Hague Convention on International Recovery of Child Support."
          />

          <FAQItem
            question="How long does international child support enforcement take?"
            answer="International enforcement can take considerable time, depending on the country and complexity of the case. The process involves coordination between Australian and overseas authorities, which can be time-consuming. Cases in reciprocating jurisdictions are generally faster than non-reciprocating countries."
          />

          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Need Help With International Child Support?</Text>
            <Text style={styles.ctaText}>
              International child support enforcement is complex and often requires professional legal guidance. Get expert advice on your specific situation.
            </Text>
            <Pressable
              style={[styles.ctaButton, isWeb && webClickableStyles]}
              onPress={() => router.push('/lawyer-inquiry?mode=direct')}
              accessibilityRole="button"
            >
              <Text style={styles.ctaButtonText}>Get Legal Advice</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <View style={styles.faqItem}>
      <Text style={styles.faqQuestion}>{question}</Text>
      <Text style={styles.faqAnswer}>{answer}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  articleHeader: {
    marginBottom: 24,
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  h1: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 12,
    ...(Platform.OS === 'web' ? { lineHeight: 40 } : {}),
  },
  publishDate: {
    fontSize: 14,
    color: '#64748b',
  },
  intro: {
    fontSize: 18,
    lineHeight: 28,
    color: '#334155',
    marginBottom: 16,
    fontWeight: '500',
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e3a8a',
    marginTop: 32,
    marginBottom: 16,
    ...(Platform.OS === 'web' ? { lineHeight: 32 } : {}),
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e3a8a',
    marginTop: 20,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    color: '#475569',
    marginBottom: 16,
  },
  quickAnswerBox: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    ...createShadow({
      shadowColor: '#2563eb',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    }),
  },
  quickAnswerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  quickAnswerText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  quickAnswerButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  quickAnswerButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '700',
  },
  inlineLink: {
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
  bulletItem: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
    marginBottom: 8,
    paddingLeft: 8,
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  warningBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    padding: 16,
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
  },
  stepCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    }),
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
  },
  faqItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
  },
  ctaSection: {
    backgroundColor: '#1e3a8a',
    borderRadius: 12,
    padding: 24,
    marginTop: 32,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#bfdbfe',
    marginBottom: 20,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#1e3a8a',
    fontSize: 16,
    fontWeight: '600',
  },
});
