import { ContextualWizard } from '@/src/components/blog/ContextualWizard';
import { PageSEO } from '@/src/components/seo/PageSEO';
import { CalculatorHeader } from '@/src/features/calculator';
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
      name: 'Can child support continue after a child turns 18 if they have a disability?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. If a child has a mental or physical disability that prevents them from supporting themselves, maintenance can continue indefinitely beyond age 18. However, this requires a court order under section 66L of the Family Law Act, not a Services Australia administrative assessment. You must apply to the Federal Circuit and Family Court of Australia with medical evidence showing the child cannot support themselves due to their disability.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I apply for adult disabled child maintenance in Australia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You must apply to the Federal Circuit and Family Court of Australia for a maintenance order under section 66L of the Family Law Act. You\'ll need to provide medical evidence showing the child has a mental or physical disability that prevents them from supporting themselves. Once the court makes an order, it can be registered with Services Australia for collection.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the child support amount different for adult disabled children?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Unlike administrative child support assessments, the court determines the maintenance amount based on what is necessary to support the adult child and the financial capacity of the parents. The court has discretion to set an appropriate amount considering the adult child\'s disability-related needs, living costs, and any income they receive (such as Disability Support Pension).',
      },
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Adult Disabled Child Maintenance: Complete Guide to Child Support Beyond 18',
  description:
    'Comprehensive guide to child support for adult children with disabilities in Australia. Learn eligibility criteria, application process, assessment calculations, and how support continues indefinitely.',
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

export default function AdultDisabledChildMaintenanceScreen() {
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
        title="Adult Disabled Child Maintenance Australia 2026 | Support"
        description="Child 18+ with disability? Support doesn't stop. See eligibility criteria + application process. NDIS doesn't replace child support. Apply now."
        canonicalPath="/blog/adult-disabled-child-maintenance"
        schema={[faqSchema, articleSchema]}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Blog', path: '/blog' },
          { label: 'Adult Disabled Child Maintenance' },
        ]}
      />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <CalculatorHeader
                    title=""
                    showBackButton={true}
                    showCenterLogo={true}
                    maxWidth={MAX_CALCULATOR_WIDTH}
                />
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
          <View style={styles.articleHeader}>
            <Text style={styles.category}>Disability Support</Text>
            <Text style={styles.h1} accessibilityRole="header">
              Adult Disabled Child Maintenance: Complete Guide to Child Support Beyond 18
            </Text>
            <Text style={styles.publishDate}>Published January 24, 2026</Text>
          </View>

          <Text style={styles.intro}>
            While administrative child support assessments typically end when a child turns 18, Australian law recognizes that some children with disabilities require ongoing financial support into adulthood. If your child has a mental or physical disability that prevents them from supporting themselves, you can apply to the Federal Circuit and Family Court of Australia for a maintenance order that can continue indefinitely beyond their 18th birthday.
          </Text>

          <View style={styles.quickAnswerBox}>
            <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
            <Text style={styles.quickAnswerText}>
              Maintenance can continue indefinitely for adult children with disabilities. You must apply to the Federal Circuit and Family Court for a court order under section 66L of the Family Law Act, providing medical evidence they can't self-support.
            </Text>
            <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
              <Text style={styles.quickAnswerButtonText}>Calculate Amount →</Text>
            </Pressable>
          </View>

          <Text style={styles.paragraph}>
            This comprehensive guide explains everything you need to know about adult disabled child maintenance in Australia, including eligibility criteria, the court application process, how maintenance orders work, and what happens when circumstances change.
          </Text>

          <Text style={styles.h2} accessibilityRole="header">Can maintenance continue after a child turns 18 if they have a disability?</Text>

          <Text style={styles.paragraph}>
            Yes, maintenance can continue indefinitely after a child turns 18 if they have a mental or physical disability that prevents them from supporting themselves. However, this requires a court order from the Federal Circuit and Family Court of Australia under section 66L of the Family Law Act. The child must be unable to work or earn a living due to their disability, verified through medical evidence. The court assesses each case individually based on the child's capacity for self-support, and maintenance can continue for the lifetime of the adult child if the disability persists.
          </Text>

          <Text style={styles.h2} accessibilityRole="header">What Is Adult Disabled Child Maintenance?</Text>

          <Text style={styles.paragraph}>
            Adult disabled child maintenance is a provision in Australian family law that allows maintenance to continue beyond age 18 when a child has a disability that prevents them from being self-supporting. Unlike regular child support (which is an administrative assessment by Services Australia), adult child maintenance requires a court order.
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Key Definition</Text>
            <Text style={styles.paragraph}>
              Under section 66L of the Family Law Act 1975, a court can make a maintenance order for a child aged 18 or over if the child has a mental or physical disability that means they cannot reasonably be expected to support themselves through employment or other means. This is separate from the administrative child support assessment process.
            </Text>
          </View>

          <Text style={styles.paragraph}>
            This provision recognizes that:
          </Text>

          <Text style={styles.bulletItem}>
            • Some disabilities prevent individuals from achieving financial independence
          </Text>
          <Text style={styles.bulletItem}>
            • Parents have an ongoing obligation to support children who cannot support themselves
          </Text>
          <Text style={styles.bulletItem}>
            • The disability must be the primary reason the adult child cannot work
          </Text>
          <Text style={styles.bulletItem}>
            • Maintenance can continue for the lifetime of the adult child if the disability persists
          </Text>
          <Text style={styles.bulletItem}>
            • A court order is required - this is not an automatic administrative process
          </Text>

          <Text style={styles.h2} accessibilityRole="header">Eligibility Criteria</Text>

          <Text style={styles.h3}>1. Age Requirements</Text>

          <Text style={styles.paragraph}>
            The child must be 18 years or older. If the child is still under 18, regular child support rules apply even if they have a disability.
          </Text>

          <Text style={styles.h3}>2. Disability Requirements</Text>

          <Text style={styles.paragraph}>
            The child must have a mental or physical disability that:
          </Text>

          <Text style={styles.bulletItem}>
            • Prevents them from supporting themselves through employment
          </Text>
          <Text style={styles.bulletItem}>
            • Is expected to continue indefinitely (not temporary)
          </Text>
          <Text style={styles.bulletItem}>
            • Can be verified through medical evidence
          </Text>
          <Text style={styles.bulletItem}>
            • Existed before the child turned 18 (in most cases)
          </Text>

          <Text style={styles.h3}>3. Self-Support Test</Text>

          <Text style={styles.paragraph}>
            The court assesses whether the adult child can reasonably be expected to support themselves. Factors considered include:
          </Text>

          <Text style={styles.bulletItem}>
            • The nature and severity of the disability
          </Text>
          <Text style={styles.bulletItem}>
            • The child's capacity for employment (even part-time or supported employment)
          </Text>
          <Text style={styles.bulletItem}>
            • Whether the child receives disability support pension or other income
          </Text>
          <Text style={styles.bulletItem}>
            • The child's living arrangements and care needs
          </Text>
          <Text style={styles.bulletItem}>
            • Medical opinions about the child's functional capacity
          </Text>

          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️ Important Note</Text>
            <Text style={styles.warningText}>
              Receiving a Disability Support Pension (DSP) does not automatically qualify a child for ongoing maintenance. The court assesses each case individually based on the child's capacity for self-support and the necessity of parental financial assistance.
            </Text>
          </View>

          <Text style={styles.h2} accessibilityRole="header">How to Apply</Text>

          <View style={styles.stepCard}>
            <Text style={styles.stepNumber}>STEP 1</Text>
            <Text style={styles.stepTitle}>Gather Medical Evidence</Text>
            <Text style={styles.stepDesc}>
              Collect comprehensive medical documentation including medical reports from treating specialists, assessments from occupational therapists or psychologists, NDIS plans (if applicable), Centrelink disability assessments, and any other evidence of the disability and its impact on employment capacity.
            </Text>
          </View>

          <View style={styles.stepCard}>
            <Text style={styles.stepNumber}>STEP 2</Text>
            <Text style={styles.stepTitle}>Prepare Your Court Application</Text>
            <Text style={styles.stepDesc}>
              Apply to the Federal Circuit and Family Court of Australia for a maintenance order. Include details of both parents, the adult child's details and living arrangements, comprehensive medical evidence, information about the child's income and capacity to work, evidence of support costs, and financial capacity information.
            </Text>
          </View>

          <View style={styles.stepCard}>
            <Text style={styles.stepNumber}>STEP 3</Text>
            <Text style={styles.stepTitle}>Court Hearing and Decision</Text>
            <Text style={styles.stepDesc}>
              The court will review all medical and financial evidence, may request additional information or assessments, determine if the adult child meets the eligibility criteria under section 66L, decide on an appropriate maintenance amount if approved, and issue a maintenance order that can be registered with Services Australia for collection.
            </Text>
          </View>

          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>📚 Related Reading:</Text>
            <Pressable accessibilityRole="link" onPress={() => router.push('/blog/child-support-after-18')} {...webClickableStyles}>
              <Text style={styles.inlineLink}>
                Child Support After 18: When Does It End? →
              </Text>
            </Pressable>
          </View>

          <Text style={styles.h2} accessibilityRole="header">How Is the Maintenance Amount Determined?</Text>

          <Text style={styles.paragraph}>
            Unlike administrative child support assessments, adult disabled child maintenance amounts are determined by the court, not calculated using the standard child support formula.
          </Text>

          <Text style={styles.h3}>Court Discretion</Text>

          <Text style={styles.paragraph}>
            The court has discretion to set an appropriate maintenance amount based on:
          </Text>

          <Text style={styles.bulletItem}>
            • The nature and extent of the adult child's disability
          </Text>
          <Text style={styles.bulletItem}>
            • The adult child's capacity for self-support and employment
          </Text>
          <Text style={styles.bulletItem}>
            • The adult child's living costs and disability-related expenses
          </Text>
          <Text style={styles.bulletItem}>
            • Any income the adult child receives (e.g., Disability Support Pension, part-time wages)
          </Text>
          <Text style={styles.bulletItem}>
            • The financial capacity of both parents
          </Text>
          <Text style={styles.bulletItem}>
            • The adult child's living arrangements and care needs
          </Text>
          <Text style={styles.bulletItem}>
            • What is necessary and reasonable in the circumstances
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Important Distinctions from Administrative Assessments</Text>
            <Text style={styles.paragraph}>
              1. No automatic formula - the court determines what is necessary and appropriate{'\n\n'}
              2. No automatic end date - maintenance continues as long as the disability persists{'\n\n'}
              3. The adult child's own income is considered in determining need{'\n\n'}
              4. Disability-related costs are factored into the court's decision{'\n\n'}
              5. The order can be registered with Services Australia for collection
            </Text>
          </View>

          <Text style={styles.h2} accessibilityRole="header">Disability-Related Costs</Text>

          <Text style={styles.paragraph}>
            When applying to the court for a maintenance order, you should include evidence of all disability-related expenses:
          </Text>

          <Text style={styles.bulletItem}>
            • Medical equipment and aids
          </Text>
          <Text style={styles.bulletItem}>
            • Therapy and specialist appointments
          </Text>
          <Text style={styles.bulletItem}>
            • Medications not covered by PBS
          </Text>
          <Text style={styles.bulletItem}>
            • Home modifications for accessibility
          </Text>
          <Text style={styles.bulletItem}>
            • Transport costs for medical appointments
          </Text>
          <Text style={styles.bulletItem}>
            • Specialized care or support services
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>NDIS Funding</Text>
            <Text style={styles.paragraph}>
              If the adult child receives NDIS funding, this covers many disability-related costs. However, NDIS funding doesn't eliminate the parental maintenance obligation - it covers specific supports, not general living expenses. The court will consider NDIS funding when determining what additional maintenance is necessary from parents.
            </Text>
          </View>

          <Text style={styles.h2} accessibilityRole="header">When Circumstances Change</Text>

          <Text style={styles.h3}>Improvement in Condition</Text>

          <Text style={styles.paragraph}>
            If the adult child's condition improves to the point where they can support themselves, either parent can apply to the court to vary or discharge the maintenance order. This requires medical evidence showing the change in capacity.
          </Text>

          <Text style={styles.h3}>Changes in Income</Text>

          <Text style={styles.paragraph}>
            If either parent's financial circumstances change significantly, they can apply to the court to vary the maintenance order. The court will reassess what is appropriate based on the new circumstances.
          </Text>

          <Text style={styles.h3}>Changes in Care</Text>

          <Text style={styles.paragraph}>
            If care arrangements change (for example, the adult child moves from one parent to the other, or into supported accommodation), either parent can apply to vary the maintenance order to reflect the new arrangements.
          </Text>

          <Text style={styles.h2} accessibilityRole="header">Common Scenarios</Text>

          <View style={styles.scenarioCard}>
            <Text style={styles.scenarioTitle}>Scenario 1: Intellectual Disability</Text>
            <Text style={styles.scenarioText}>
              Sarah's 19-year-old son has an intellectual disability that prevents him from working. He lives with Sarah and receives a Disability Support Pension. Sarah applies to the court for adult disabled child maintenance. The court approves the application based on medical evidence showing her son cannot support himself. A maintenance order is made and registered with Services Australia for collection.
            </Text>
          </View>

          <View style={styles.scenarioCard}>
            <Text style={styles.scenarioTitle}>Scenario 2: Physical Disability</Text>
            <Text style={styles.scenarioText}>
              Mark's 21-year-old daughter has cerebral palsy and requires full-time care. She lives in supported accommodation funded by NDIS. Both parents contribute to her care. The court makes a maintenance order based on both parents' incomes and their respective involvement in her life.
            </Text>
          </View>

          <View style={styles.scenarioCard}>
            <Text style={styles.scenarioTitle}>Scenario 3: Mental Health Condition</Text>
            <Text style={styles.scenarioText}>
              Emma's 20-year-old son has severe schizophrenia that prevents him from maintaining employment. He lives with Emma and requires ongoing psychiatric care. The court approves ongoing maintenance based on psychiatric reports confirming he cannot support himself due to his condition.
            </Text>
          </View>

          <Text style={styles.h2} accessibilityRole="header">Interaction With Other Benefits</Text>

          <Text style={styles.h3}>Disability Support Pension</Text>

          <Text style={styles.paragraph}>
            Child support payments don't affect the adult child's eligibility for DSP. However, if the adult child lives with a parent, this may affect their DSP rate due to living arrangements.
          </Text>

          <Text style={styles.h3}>NDIS Funding</Text>

          <Text style={styles.paragraph}>
            NDIS funding is separate from child support. Child support covers general living expenses, while NDIS covers disability-specific supports and services.
          </Text>

          <Text style={styles.h3}>Carer Payment</Text>

          <Text style={styles.paragraph}>
            If a parent receives Carer Payment for caring for the adult disabled child, this doesn't affect the child support assessment. The parent may still be entitled to receive child support.
          </Text>

          <Text style={styles.h2} accessibilityRole="header">When to Seek Legal Advice</Text>

          <Text style={styles.paragraph}>
            Consider consulting a family lawyer if:
          </Text>

          <Text style={styles.bulletItem}>
            • You need to apply to the court for a maintenance order
          </Text>
          <Text style={styles.bulletItem}>
            • The other parent disputes the adult child's eligibility
          </Text>
          <Text style={styles.bulletItem}>
            • You need help gathering appropriate medical evidence
          </Text>
          <Text style={styles.bulletItem}>
            • You want to vary an existing maintenance order
          </Text>
          <Text style={styles.bulletItem}>
            • Care arrangements are complex or disputed
          </Text>
          <Text style={styles.bulletItem}>
            • You're considering a Binding Child Support Agreement
          </Text>

          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️ Complex Cases</Text>
            <Text style={styles.warningText}>
              Adult disabled child maintenance cases can be legally and medically complex. Professional advice ensures you present the strongest possible case and understand all your options.
            </Text>
          </View>

          <ContextualWizard
            preselectedFactors={[]}
            highlightedFactors={['change_circumstances', 'high_costs', 'care_arrangement_change']}
            blogTopic="adult_disabled_child"
            ctaText="Get Help With Adult Disabled Child Support"
            analyticsSource="blog_adult_disabled_child_maintenance"
            formReason="special_circumstances"
            title="Need Help With Your Adult Disabled Child Case?"
            description="Adult disabled child maintenance cases often involve Change of Assessment applications for additional disability costs. Select any factors that apply."
          />

          <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

          <FAQItem
            question="Can child support continue after a child turns 18 if they have a disability?"
            answer="Yes. If a child has a mental or physical disability that prevents them from supporting themselves, maintenance can continue indefinitely beyond age 18. However, this requires a court order under section 66L of the Family Law Act. You must apply to the Federal Circuit and Family Court of Australia with medical evidence showing the child cannot support themselves due to their disability."
          />

          <FAQItem
            question="How do I apply for adult disabled child maintenance in Australia?"
            answer="You must apply to the Federal Circuit and Family Court of Australia for a maintenance order under section 66L of the Family Law Act. You'll need to provide medical evidence showing the child has a mental or physical disability that prevents them from supporting themselves. Once the court makes an order, it can be registered with Services Australia for collection."
          />

          <FAQItem
            question="Is the child support amount different for adult disabled children?"
            answer="Yes. Unlike administrative child support assessments, the court determines the maintenance amount based on what is necessary to support the adult child and the financial capacity of the parents. The court has discretion to set an appropriate amount considering the adult child's disability-related needs, living costs, and any income they receive (such as Disability Support Pension)."
          />

          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Need Help With Your Child Support Assessment?</Text>
            <Text style={styles.ctaText}>
              Our calculator helps you understand your child support obligations, but adult disabled child maintenance cases often require professional legal advice.
            </Text>
            <Pressable
              style={[styles.ctaButton, isWeb && webClickableStyles]}
              accessibilityRole="link" onPress={() => router.push('/lawyer-inquiry?mode=direct')}
            >
              <Text style={styles.ctaButtonText}>Speak to a Specialist</Text>
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
    fontSize: 15,
    lineHeight: 24,
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
  highlightBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 16,
    marginBottom: 16,
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    }),
  },
  highlightTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  scenarioCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    }),
  },
  scenarioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  scenarioText: {
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
