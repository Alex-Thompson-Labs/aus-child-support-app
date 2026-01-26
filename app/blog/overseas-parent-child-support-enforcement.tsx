import { ContextualWizard } from '@/src/components/blog/ContextualWizard';
import { PageSEO } from '@/src/components/seo/PageSEO';
import { MAX_CALCULATOR_WIDTH, isWeb, webClickableStyles } from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
        text: 'International enforcement typically takes 6-18 months, depending on the country and complexity of the case. The process involves coordination between Australian and overseas authorities, which can be time-consuming. Cases in reciprocating jurisdictions are generally faster than non-reciprocating countries.',
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

  const handleCalculatorPress = () => {
    router.push('/');
  };

  const handleInquiryPress = () => {
    router.push('/lawyer-inquiry?mode=direct');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <PageSEO
        title="Overseas Parent Child Support Enforcement | International Recovery Australia"
        description="Complete guide to enforcing child support when a parent lives overseas. Learn about reciprocating jurisdictions, international treaties, enforcement mechanisms, and legal options."
        canonicalPath="/blog/overseas-parent-child-support-enforcement"
        schema={[faqSchema, articleSchema]}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.breadcrumb}>
            <Pressable onPress={() => router.push('/')} {...webClickableStyles}>
              <Text style={styles.breadcrumbLink}>Home</Text>
            </Pressable>
            <Text style={styles.breadcrumbSeparator}> / </Text>
            <Pressable onPress={() => router.push('/blog')} {...webClickableStyles}>
              <Text style={styles.breadcrumbLink}>Blog</Text>
            </Pressable>
            <Text style={styles.breadcrumbSeparator}> / </Text>
            <Text style={styles.breadcrumbCurrent}>Overseas Parent Enforcement</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>
              Overseas Parent Child Support Enforcement: Complete Guide for Australia
            </Text>

            <Text style={styles.meta}>Last updated: January 24, 2026 • 9 min read</Text>

            <Text style={styles.paragraph}>
              When a parent moves overseas, enforcing child support becomes significantly more complex. However, Australia has international agreements with many countries that allow child support to be established and enforced across borders. Understanding these mechanisms is crucial for parents seeking to secure financial support for their children.
            </Text>

            <Text style={styles.paragraph}>
              This comprehensive guide explains everything you need to know about international child support enforcement, including reciprocating jurisdictions, the enforcement process, your legal options, and what to do when the other parent lives in a non-reciprocating country.
            </Text>

            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={handleCalculatorPress}
              {...webClickableStyles}
            >
              <Text style={styles.ctaButtonText}>Calculate Your Child Support</Text>
            </Pressable>

            <Text style={styles.heading2}>Understanding International Child Support</Text>

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
              <Text style={styles.infoBoxTitle}>Key Concept: Reciprocating Jurisdictions</Text>
              <Text style={styles.infoBoxText}>
                A reciprocating jurisdiction is a country that has a formal agreement with Australia to enforce child support obligations. These agreements allow Australian child support assessments to be recognized and enforced overseas, and vice versa.
              </Text>
            </View>

            <Text style={styles.heading2}>Reciprocating Jurisdictions</Text>

            <Text style={styles.paragraph}>
              Australia has child support agreements with numerous countries, primarily through:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • The Hague Convention on International Recovery of Child Support (2007)
              </Text>
              <Text style={styles.bulletItem}>
                • Bilateral agreements with specific countries
              </Text>
              <Text style={styles.bulletItem}>
                • Commonwealth reciprocal enforcement arrangements
              </Text>
            </View>

            <Text style={styles.heading3}>Major Reciprocating Jurisdictions</Text>

            <Text style={styles.paragraph}>
              Countries with strong enforcement mechanisms include:
            </Text>

            <View style={styles.bulletList}>
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
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.warningBoxTitle}>⚠️ Check Current Status</Text>
              <Text style={styles.warningBoxText}>
                Reciprocating jurisdiction status can change. Always verify current agreements with Services Australia before proceeding with international enforcement.
              </Text>
            </View>

            <Text style={styles.heading2}>How International Enforcement Works</Text>

            <Text style={styles.heading3}>Step 1: Establish Australian Assessment</Text>

            <Text style={styles.paragraph}>
              First, you need an Australian child support assessment. This can be:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • An administrative assessment from Services Australia
              </Text>
              <Text style={styles.bulletItem}>
                • A court order for child support
              </Text>
              <Text style={styles.bulletItem}>
                • A registered Binding Child Support Agreement
              </Text>
            </View>

            <Text style={styles.paragraph}>
              If you don't already have an assessment, apply through Services Australia even if the other parent is overseas.
            </Text>

            <Text style={styles.heading3}>Step 2: Register for International Enforcement</Text>

            <Text style={styles.paragraph}>
              Contact Services Australia's International Child Support team to:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Confirm the overseas country is a reciprocating jurisdiction
              </Text>
              <Text style={styles.bulletItem}>
                • Complete international enforcement application forms
              </Text>
              <Text style={styles.bulletItem}>
                • Provide details of the overseas parent's location and employment
              </Text>
              <Text style={styles.bulletItem}>
                • Submit supporting documentation
              </Text>
            </View>

            <Text style={styles.heading3}>Step 3: Transmission to Overseas Authority</Text>

            <Text style={styles.paragraph}>
              Services Australia transmits your case to the relevant overseas authority, which may be:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • A government child support agency
              </Text>
              <Text style={styles.bulletItem}>
                • A designated central authority under the Hague Convention
              </Text>
              <Text style={styles.bulletItem}>
                • A court system in some jurisdictions
              </Text>
            </View>

            <Text style={styles.heading3}>Step 4: Overseas Recognition and Enforcement</Text>

            <Text style={styles.paragraph}>
              The overseas authority will:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Review and recognize the Australian assessment
              </Text>
              <Text style={styles.bulletItem}>
                • Locate the paying parent
              </Text>
              <Text style={styles.bulletItem}>
                • Determine their income under local laws
              </Text>
              <Text style={styles.bulletItem}>
                • Implement enforcement mechanisms
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={handleInquiryPress}
              {...webClickableStyles}
            >
              <Text style={styles.ctaButtonText}>Get Legal Help With International Enforcement</Text>
            </Pressable>

            <View style={styles.trustBox}>
              <Text style={styles.trustBoxTitle}>What to Expect:</Text>
              <Text style={styles.trustBoxItem}>• Most lawyers respond within 24 hours</Text>
              <Text style={styles.trustBoxItem}>• Initial consultations often free or low-cost</Text>
              <Text style={styles.trustBoxItem}>• No obligation to proceed after consultation</Text>
              <Text style={styles.trustBoxItem}>• Your information remains confidential</Text>
            </View>

            <Text style={styles.heading2}>Enforcement Mechanisms</Text>

            <Text style={styles.paragraph}>
              Overseas authorities can use various enforcement tools, depending on local laws:
            </Text>

            <Text style={styles.heading3}>Income Withholding</Text>

            <Text style={styles.paragraph}>
              The most common method - child support is deducted directly from the paying parent's wages or salary. This is similar to employer withholding in Australia.
            </Text>

            <Text style={styles.heading3}>Asset Seizure</Text>

            <Text style={styles.paragraph}>
              In some jurisdictions, authorities can seize bank accounts, property, or other assets to satisfy child support debts.
            </Text>

            <Text style={styles.heading3}>License Suspension</Text>

            <Text style={styles.paragraph}>
              Some countries can suspend driver's licenses, professional licenses, or passports for non-payment of child support.
            </Text>

            <Text style={styles.heading3}>Court Proceedings</Text>

            <Text style={styles.paragraph}>
              Overseas authorities may initiate court proceedings to enforce the child support obligation, potentially leading to contempt charges or other penalties.
            </Text>

            <Text style={styles.heading2}>Challenges in International Enforcement</Text>

            <Text style={styles.heading3}>Time Delays</Text>

            <Text style={styles.paragraph}>
              International enforcement typically takes 6-18 months or longer. Factors affecting timing include:
            </Text>

            <View style={styles.bulletList}>
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
            </View>

            <Text style={styles.heading3}>Currency Conversion</Text>

            <Text style={styles.paragraph}>
              Child support assessed in Australian dollars must be converted to local currency. Exchange rate fluctuations can affect the amount received.
            </Text>

            <Text style={styles.heading3}>Different Legal Standards</Text>

            <Text style={styles.paragraph}>
              Some countries may:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Calculate child support differently than Australia
              </Text>
              <Text style={styles.bulletItem}>
                • Have different income definitions
              </Text>
              <Text style={styles.bulletItem}>
                • Apply different enforcement priorities
              </Text>
              <Text style={styles.bulletItem}>
                • Require additional documentation or court proceedings
              </Text>
            </View>

            <Text style={styles.heading3}>Limited Information</Text>

            <Text style={styles.paragraph}>
              You may have limited visibility into the enforcement process once your case is overseas. Communication typically flows through Services Australia rather than directly with overseas authorities.
            </Text>

            <Text style={styles.heading2}>Non-Reciprocating Jurisdictions</Text>

            <Text style={styles.paragraph}>
              If the other parent lives in a country without a child support agreement with Australia, enforcement becomes extremely difficult.
            </Text>

            <Text style={styles.heading3}>Your Options</Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Limited Enforcement Options</Text>
              <Text style={styles.infoBoxText}>
                1. Wait for the parent to return to Australia or a reciprocating jurisdiction{'\n\n'}
                2. Pursue private legal action in the overseas country (expensive and uncertain){'\n\n'}
                3. Negotiate a private agreement directly with the other parent{'\n\n'}
                4. Seek enforcement if the parent has assets in Australia or reciprocating jurisdictions
              </Text>
            </View>

            <Text style={styles.heading3}>Private Legal Action</Text>

            <Text style={styles.paragraph}>
              You can hire a lawyer in the overseas country to:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Establish a child support order under local laws
              </Text>
              <Text style={styles.bulletItem}>
                • Enforce the Australian assessment if possible
              </Text>
              <Text style={styles.bulletItem}>
                • Pursue other legal remedies
              </Text>
            </View>

            <Text style={styles.paragraph}>
              This approach is expensive, time-consuming, and success is not guaranteed. Legal costs can easily exceed the child support owed.
            </Text>

            <Text style={styles.heading2}>Special Situations</Text>

            <Text style={styles.heading3}>Parent Moves Between Countries</Text>

            <Text style={styles.paragraph}>
              If the paying parent moves from one country to another:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Notify Services Australia immediately
              </Text>
              <Text style={styles.bulletItem}>
                • Enforcement may need to be re-established in the new country
              </Text>
              <Text style={styles.bulletItem}>
                • Check if the new country is a reciprocating jurisdiction
              </Text>
            </View>

            <Text style={styles.heading3}>Parent Returns to Australia</Text>

            <Text style={styles.paragraph}>
              If the paying parent returns to Australia:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Notify Services Australia
              </Text>
              <Text style={styles.bulletItem}>
                • Enforcement reverts to Australian mechanisms
              </Text>
              <Text style={styles.bulletItem}>
                • Arrears accumulated overseas remain enforceable
              </Text>
              <Text style={styles.bulletItem}>
                • Departure prohibition orders may prevent future overseas moves
              </Text>
            </View>

            <Text style={styles.heading3}>Dual Citizenship</Text>

            <Text style={styles.paragraph}>
              If the paying parent has dual citizenship, this may provide additional enforcement options or complications depending on the countries involved.
            </Text>

            <Text style={styles.heading2}>Documenting the Overseas Parent's Location</Text>

            <Text style={styles.paragraph}>
              Successful international enforcement requires knowing where the other parent lives and works. Gather as much information as possible:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Full name and any aliases
              </Text>
              <Text style={styles.bulletItem}>
                • Overseas address (residential and work)
              </Text>
              <Text style={styles.bulletItem}>
                • Employer name and contact details
              </Text>
              <Text style={styles.bulletItem}>
                • Phone numbers and email addresses
              </Text>
              <Text style={styles.bulletItem}>
                • Social media profiles
              </Text>
              <Text style={styles.bulletItem}>
                • Bank account information (if known)
              </Text>
              <Text style={styles.bulletItem}>
                • Passport details
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={handleInquiryPress}
              {...webClickableStyles}
            >
              <Text style={styles.ctaButtonText}>Get Legal Advice on Your Case</Text>
            </Pressable>

            <Text style={styles.heading2}>Costs and Fees</Text>

            <Text style={styles.paragraph}>
              Services Australia does not charge fees for international enforcement through reciprocating jurisdiction agreements. However, you may incur costs for:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Document translation and certification
              </Text>
              <Text style={styles.bulletItem}>
                • Legal advice in Australia
              </Text>
              <Text style={styles.bulletItem}>
                • Private legal action in non-reciprocating countries
              </Text>
              <Text style={styles.bulletItem}>
                • Travel costs if court appearances are required
              </Text>
            </View>

            <Text style={styles.heading2}>Preventing Overseas Evasion</Text>

            <Text style={styles.paragraph}>
              If you suspect the other parent may move overseas to avoid child support:
            </Text>

            <Text style={styles.heading3}>Departure Prohibition Orders</Text>

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

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Child support debt of at least $2,500
              </Text>
              <Text style={styles.bulletItem}>
                • Persistent non-payment
              </Text>
              <Text style={styles.bulletItem}>
                • Evidence the parent may leave Australia
              </Text>
            </View>

            <Text style={styles.heading3}>Early Action</Text>

            <Text style={styles.paragraph}>
              If you know the other parent plans to move overseas:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Ensure you have a child support assessment in place
              </Text>
              <Text style={styles.bulletItem}>
                • Gather information about their overseas destination
              </Text>
              <Text style={styles.bulletItem}>
                • Contact Services Australia immediately
              </Text>
              <Text style={styles.bulletItem}>
                • Consider seeking legal advice about your options
              </Text>
            </View>

            <Text style={styles.heading2}>Communication and Updates</Text>

            <Text style={styles.paragraph}>
              During international enforcement:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Services Australia is your primary contact point
              </Text>
              <Text style={styles.bulletItem}>
                • Updates may be infrequent due to the international nature of the case
              </Text>
              <Text style={styles.bulletItem}>
                • You can request status updates from Services Australia
              </Text>
              <Text style={styles.bulletItem}>
                • Keep your contact details current with Services Australia
              </Text>
              <Text style={styles.bulletItem}>
                • Notify Services Australia of any new information about the overseas parent
              </Text>
            </View>

            <Text style={styles.heading2}>When to Seek Legal Advice</Text>

            <Text style={styles.paragraph}>
              Consider consulting a family lawyer if:
            </Text>

            <View style={styles.bulletList}>
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
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.warningBoxTitle}>⚠️ Complex International Cases</Text>
              <Text style={styles.warningBoxText}>
                International child support enforcement involves multiple legal systems and can be highly complex. Professional legal advice helps you understand your options and navigate the process effectively.
              </Text>
            </View>

            {/* Contextual Wizard */}
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

            <Text style={styles.heading2}>Frequently Asked Questions</Text>

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
              answer="International enforcement typically takes 6-18 months, depending on the country and complexity of the case. The process involves coordination between Australian and overseas authorities, which can be time-consuming. Cases in reciprocating jurisdictions are generally faster than non-reciprocating countries."
            />

            <Text style={styles.heading2}>Next Steps</Text>

            <Text style={styles.paragraph}>
              If you need to enforce child support against an overseas parent:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Contact Services Australia's International Child Support team
              </Text>
              <Text style={styles.bulletItem}>
                • Verify the overseas country is a reciprocating jurisdiction
              </Text>
              <Text style={styles.bulletItem}>
                • Gather all available information about the overseas parent's location
              </Text>
              <Text style={styles.bulletItem}>
                • Ensure you have an Australian child support assessment
              </Text>
              <Text style={styles.bulletItem}>
                • Consider legal advice for complex cases
              </Text>
              <Text style={styles.bulletItem}>
                • Be prepared for a lengthy process
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={handleInquiryPress}
              {...webClickableStyles}
            >
              <Text style={styles.ctaButtonText}>Speak With a Family Lawyer</Text>
            </Pressable>

            <View style={styles.finalCTA}>
              <Text style={styles.finalCTATitle}>Need Help With International Child Support?</Text>
              <Text style={styles.finalCTAText}>
                International child support enforcement is complex and often requires professional legal guidance. Get expert advice on your specific situation.
              </Text>
              <View style={styles.trustSignals}>
                <Text style={styles.trustSignalItem}>✓ Specialists in international cases</Text>
                <Text style={styles.trustSignalItem}>✓ Experience with reciprocating jurisdictions</Text>
                <Text style={styles.trustSignalItem}>✓ Free case assessment available</Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.finalCTAButton,
                  pressed && styles.finalCTAButtonPressed,
                ]}
                onPress={handleInquiryPress}
                {...webClickableStyles}
              >
                <Text style={styles.finalCTAButtonText}>Get Legal Advice</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: MAX_CALCULATOR_WIDTH,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexWrap: 'wrap',
  },
  breadcrumbLink: {
    color: '#2563EB',
    fontSize: 14,
    ...(isWeb && { cursor: 'pointer' }),
  },
  breadcrumbSeparator: {
    color: '#64748b',
    fontSize: 14,
    marginHorizontal: 4,
  },
  breadcrumbCurrent: {
    color: '#64748b',
    fontSize: 14,
  },
  content: {
    width: '100%',
    maxWidth: MAX_CALCULATOR_WIDTH,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    lineHeight: 40,
  },
  meta: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    color: '#334155',
    marginBottom: 16,
  },
  heading2: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 32,
    marginBottom: 16,
    lineHeight: 34,
  },
  heading3: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 24,
    marginBottom: 12,
    lineHeight: 28,
  },
  bulletList: {
    marginBottom: 16,
    paddingLeft: 8,
  },
  bulletItem: {
    fontSize: 16,
    lineHeight: 26,
    color: '#334155',
    marginBottom: 8,
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    padding: 16,
    marginVertical: 20,
    borderRadius: 8,
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  infoBoxText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#1e40af',
  },
  warningBox: {
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    padding: 16,
    marginVertical: 20,
    borderRadius: 8,
  },
  warningBoxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  warningBoxText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#92400e',
  },
  ctaButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 24,
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
    ...(isWeb && { cursor: 'pointer' }),
  },
  ctaButtonPressed: {
    backgroundColor: '#1e40af',
    transform: [{ scale: 0.98 }],
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  faqItem: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  faqQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    lineHeight: 26,
  },
  faqAnswer: {
    fontSize: 16,
    lineHeight: 26,
    color: '#334155',
  },
  finalCTA: {
    backgroundColor: '#1e3a8a',
    padding: 32,
    borderRadius: 12,
    marginTop: 40,
    alignItems: 'center',
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    }),
  },
  finalCTATitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  finalCTAText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#e0e7ff',
    marginBottom: 20,
    textAlign: 'center',
  },
  finalCTAButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    ...(isWeb && { cursor: 'pointer' }),
  },
  finalCTAButtonPressed: {
    backgroundColor: '#f1f5f9',
    transform: [{ scale: 0.98 }],
  },
  finalCTAButtonText: {
    color: '#1e3a8a',
    fontSize: 16,
    fontWeight: '600',
  },
  inlineLink: {
    color: '#2563EB',
    textDecorationLine: isWeb ? 'underline' : 'none',
    fontWeight: '600',
  },
  trustBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  trustBoxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 12,
  },
  trustBoxItem: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 6,
  },
  trustSignals: {
    marginBottom: 16,
    alignItems: 'center',
  },
  trustSignalItem: {
    fontSize: 14,
    color: '#e0e7ff',
    marginBottom: 4,
  },
});
