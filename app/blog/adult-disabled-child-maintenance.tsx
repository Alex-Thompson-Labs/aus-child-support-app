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
      name: 'Can child support continue after a child turns 18 if they have a disability?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. If a child has a mental or physical disability that prevents them from supporting themselves, child support can continue indefinitely beyond age 18. The child must be unable to work or earn a living due to their disability, and this must be verified through medical evidence.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I apply for adult disabled child maintenance in Australia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You apply through Services Australia by completing a Child Support Application form and providing medical evidence of the disability. You\'ll need documentation from medical professionals showing the child cannot support themselves due to their disability. Services Australia will assess eligibility and establish the maintenance liability.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the child support amount different for adult disabled children?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The calculation uses the same formula as regular child support, but the assessment can continue indefinitely rather than ending at age 18. The amount is based on both parents\' incomes, care arrangements, and the costs of the child. Additional disability-related expenses may be considered through a Change of Assessment application.',
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

  const handleCalculatorPress = () => {
    router.push('/');
  };

  const handleInquiryPress = () => {
    router.push('/lawyer-inquiry?mode=direct');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <PageSEO
        title="Adult Disabled Child Maintenance: Child Support Beyond 18 | Australia"
        description="Complete guide to child support for adult children with disabilities. Learn eligibility criteria, application process, assessment calculations, and how support continues indefinitely in Australia."
        canonicalPath="/blog/adult-disabled-child-maintenance"
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
            <Text style={styles.breadcrumbCurrent}>Adult Disabled Child Maintenance</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>
              Adult Disabled Child Maintenance: Complete Guide to Child Support Beyond 18
            </Text>

            <Text style={styles.meta}>Last updated: January 24, 2026 • 8 min read</Text>

            <Text style={styles.paragraph}>
              While child support typically ends when a child turns 18, Australian law recognizes that some children with disabilities require ongoing financial support into adulthood. If your child has a mental or physical disability that prevents them from supporting themselves, child support can continue indefinitely beyond their 18th birthday.
            </Text>

            <Text style={styles.paragraph}>
              This comprehensive guide explains everything you need to know about adult disabled child maintenance in Australia, including eligibility criteria, the application process, how assessments work, and what happens when circumstances change.
            </Text>

            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={handleCalculatorPress}
              {...webClickableStyles}
            >
              <Text style={styles.ctaButtonText}>Calculate Your Child Support</Text>
            </Pressable>

            <Text style={styles.heading2}>What Is Adult Disabled Child Maintenance?</Text>

            <Text style={styles.paragraph}>
              Adult disabled child maintenance is a provision in Australian child support law that allows child support to continue beyond age 18 when a child has a disability that prevents them from being self-supporting.
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Key Definition</Text>
              <Text style={styles.infoBoxText}>
                Under the Child Support (Assessment) Act 1989, a child is considered eligible for ongoing support if they have a mental or physical disability that means they cannot reasonably be expected to support themselves through employment or other means.
              </Text>
            </View>

            <Text style={styles.paragraph}>
              This provision recognizes that:
            </Text>

            <View style={styles.bulletList}>
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
                • Support can continue for the lifetime of the adult child if the disability persists
              </Text>
            </View>

            <Text style={styles.heading2}>Eligibility Criteria</Text>

            <Text style={styles.heading3}>1. Age Requirements</Text>

            <Text style={styles.paragraph}>
              The child must be 18 years or older. If the child is still under 18, regular child support rules apply even if they have a disability.
            </Text>

            <Text style={styles.heading3}>2. Disability Requirements</Text>

            <Text style={styles.paragraph}>
              The child must have a mental or physical disability that:
            </Text>

            <View style={styles.bulletList}>
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
            </View>

            <Text style={styles.heading3}>3. Self-Support Test</Text>

            <Text style={styles.paragraph}>
              Services Australia assesses whether the adult child can reasonably be expected to support themselves. Factors considered include:
            </Text>

            <View style={styles.bulletList}>
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
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.warningBoxTitle}>⚠️ Important Note</Text>
              <Text style={styles.warningBoxText}>
                Receiving a Disability Support Pension (DSP) does not automatically qualify a child for ongoing child support. Services Australia assesses each case individually based on the child's capacity for self-support.
              </Text>
            </View>

            <Text style={styles.heading2}>How to Apply</Text>

            <Text style={styles.heading3}>Step 1: Gather Medical Evidence</Text>

            <Text style={styles.paragraph}>
              Before applying, collect comprehensive medical documentation including:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Medical reports from treating specialists
              </Text>
              <Text style={styles.bulletItem}>
                • Assessments from occupational therapists or psychologists
              </Text>
              <Text style={styles.bulletItem}>
                • NDIS plans (if applicable)
              </Text>
              <Text style={styles.bulletItem}>
                • Centrelink disability assessments
              </Text>
              <Text style={styles.bulletItem}>
                • Any other evidence of the disability and its impact on employment capacity
              </Text>
            </View>

            <Text style={styles.heading3}>Step 2: Complete the Application</Text>

            <Text style={styles.paragraph}>
              Contact Services Australia and request a Child Support Application for an adult disabled child. You'll need to provide:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Details of both parents (names, addresses, income information)
              </Text>
              <Text style={styles.bulletItem}>
                • The adult child's details and living arrangements
              </Text>
              <Text style={styles.bulletItem}>
                • Medical evidence of the disability
              </Text>
              <Text style={styles.bulletItem}>
                • Information about the child's income (if any)
              </Text>
              <Text style={styles.bulletItem}>
                • Current care arrangements
              </Text>
            </View>

            <Text style={styles.heading3}>Step 3: Assessment Process</Text>

            <Text style={styles.paragraph}>
              Services Australia will:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Review all medical evidence
              </Text>
              <Text style={styles.bulletItem}>
                • May request additional information or assessments
              </Text>
              <Text style={styles.bulletItem}>
                • Determine if the child meets eligibility criteria
              </Text>
              <Text style={styles.bulletItem}>
                • Calculate the child support amount if approved
              </Text>
              <Text style={styles.bulletItem}>
                • Notify both parents of the decision
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={handleInquiryPress}
              {...webClickableStyles}
            >
              <Text style={styles.ctaButtonText}>Get Legal Help With Your Application</Text>
            </Pressable>

            <Text style={styles.heading2}>How Is the Amount Calculated?</Text>

            <Text style={styles.paragraph}>
              Adult disabled child maintenance uses the same formula as regular child support, with some important differences:
            </Text>

            <Text style={styles.heading3}>Standard Formula Applies</Text>

            <Text style={styles.paragraph}>
              The calculation follows the 8-step formula used for children under 18:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Step 1: Determine each parent's child support income
              </Text>
              <Text style={styles.bulletItem}>
                • Step 2: Calculate combined child support income
              </Text>
              <Text style={styles.bulletItem}>
                • Step 3: Determine each parent's income percentage
              </Text>
              <Text style={styles.bulletItem}>
                • Step 4: Determine each parent's care percentage
              </Text>
              <Text style={styles.bulletItem}>
                • Step 5: Determine each parent's cost percentage
              </Text>
              <Text style={styles.bulletItem}>
                • Step 6: Determine each parent's child support percentage
              </Text>
              <Text style={styles.bulletItem}>
                • Step 7: Calculate the costs of the child
              </Text>
              <Text style={styles.bulletItem}>
                • Step 8: Calculate the annual rate of child support
              </Text>
            </View>

            <Text style={styles.heading3}>Key Differences</Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Important Distinctions</Text>
              <Text style={styles.infoBoxText}>
                1. No automatic end date - support continues as long as the disability persists{'\n\n'}
                2. The adult child's own income (if any) may be considered{'\n\n'}
                3. Care arrangements may differ from typical child support cases{'\n\n'}
                4. Additional disability-related costs may be factored in through Change of Assessment
              </Text>
            </View>

            <Text style={styles.heading3}>Adult Child's Income</Text>

            <Text style={styles.paragraph}>
              If the adult child receives any income (such as Disability Support Pension or part-time wages), this may affect the assessment. However, disability pensions are generally not considered sufficient to make the child self-supporting.
            </Text>

            <Text style={styles.heading2}>Care Arrangements</Text>

            <Text style={styles.paragraph}>
              Care arrangements for adult disabled children can be complex and may differ significantly from typical child support cases.
            </Text>

            <Text style={styles.heading3}>Living Arrangements</Text>

            <Text style={styles.paragraph}>
              The adult child may:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Live with one parent full-time
              </Text>
              <Text style={styles.bulletItem}>
                • Live independently with support from both parents
              </Text>
              <Text style={styles.bulletItem}>
                • Live in supported accommodation
              </Text>
              <Text style={styles.bulletItem}>
                • Split time between both parents
              </Text>
            </View>

            <Text style={styles.heading3}>Care Percentage Determination</Text>

            <Text style={styles.paragraph}>
              Services Australia considers:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Where the adult child primarily resides
              </Text>
              <Text style={styles.bulletItem}>
                • Which parent provides day-to-day care and support
              </Text>
              <Text style={styles.bulletItem}>
                • Financial contributions from each parent
              </Text>
              <Text style={styles.bulletItem}>
                • The level of care required due to the disability
              </Text>
            </View>

            <Text style={styles.heading2}>Additional Disability Costs</Text>

            <Text style={styles.paragraph}>
              The standard child support formula may not adequately cover all disability-related expenses. Parents can apply for a Change of Assessment to include:
            </Text>

            <View style={styles.bulletList}>
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
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>NDIS Funding</Text>
              <Text style={styles.infoBoxText}>
                If the adult child receives NDIS funding, this covers many disability-related costs. However, NDIS funding doesn't eliminate the child support obligation - it covers specific supports, not general living expenses.
              </Text>
            </View>

            <Text style={styles.heading2}>When Circumstances Change</Text>

            <Text style={styles.heading3}>Improvement in Condition</Text>

            <Text style={styles.paragraph}>
              If the adult child's condition improves to the point where they can support themselves, either parent can apply to end the child support assessment. This requires medical evidence showing the change in capacity.
            </Text>

            <Text style={styles.heading3}>Changes in Income</Text>

            <Text style={styles.paragraph}>
              Like regular child support, the assessment automatically adjusts when either parent's income changes. Parents should notify Services Australia of significant income changes.
            </Text>

            <Text style={styles.heading3}>Changes in Care</Text>

            <Text style={styles.paragraph}>
              If care arrangements change (for example, the adult child moves from one parent to the other, or into supported accommodation), this affects the assessment. Report care changes to Services Australia within 28 days.
            </Text>

            <Text style={styles.heading2}>Objections and Appeals</Text>

            <Text style={styles.paragraph}>
              Either parent can object to Services Australia's decision about:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Whether the adult child qualifies for ongoing support
              </Text>
              <Text style={styles.bulletItem}>
                • The amount of child support assessed
              </Text>
              <Text style={styles.bulletItem}>
                • Care percentage determinations
              </Text>
              <Text style={styles.bulletItem}>
                • Income calculations
              </Text>
            </View>

            <Text style={styles.paragraph}>
              The objection process follows the same steps as regular child support objections:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Lodge objection within 28 days of the decision
              </Text>
              <Text style={styles.bulletItem}>
                • Services Australia reviews the decision
              </Text>
              <Text style={styles.bulletItem}>
                • If still dissatisfied, appeal to the Administrative Appeals Tribunal (AAT)
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={handleInquiryPress}
              {...webClickableStyles}
            >
              <Text style={styles.ctaButtonText}>Get Legal Advice on Your Case</Text>
            </Pressable>

            <Text style={styles.heading2}>Common Scenarios</Text>

            <Text style={styles.heading3}>Scenario 1: Intellectual Disability</Text>

            <Text style={styles.paragraph}>
              Sarah's 19-year-old son has an intellectual disability that prevents him from working. He lives with Sarah and receives a Disability Support Pension. Sarah applies for adult disabled child maintenance. Services Australia approves the application based on medical evidence showing her son cannot support himself. Child support continues based on both parents' incomes.
            </Text>

            <Text style={styles.heading3}>Scenario 2: Physical Disability</Text>

            <Text style={styles.paragraph}>
              Mark's 21-year-old daughter has cerebral palsy and requires full-time care. She lives in supported accommodation funded by NDIS. Both parents contribute to her care. Services Australia assesses child support based on their incomes, with care percentage reflecting their respective involvement in her life.
            </Text>

            <Text style={styles.heading3}>Scenario 3: Mental Health Condition</Text>

            <Text style={styles.paragraph}>
              Emma's 20-year-old son has severe schizophrenia that prevents him from maintaining employment. He lives with Emma and requires ongoing psychiatric care. Services Australia approves ongoing child support based on psychiatric reports confirming he cannot support himself due to his condition.
            </Text>

            <Text style={styles.heading2}>Tax Implications</Text>

            <Text style={styles.paragraph}>
              Adult disabled child maintenance has the same tax treatment as regular child support:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Not tax-deductible for the paying parent
              </Text>
              <Text style={styles.bulletItem}>
                • Not taxable income for the receiving parent
              </Text>
              <Text style={styles.bulletItem}>
                • Not considered income for the adult child
              </Text>
            </View>

            <Text style={styles.heading2}>Interaction With Other Benefits</Text>

            <Text style={styles.heading3}>Disability Support Pension</Text>

            <Text style={styles.paragraph}>
              Child support payments don't affect the adult child's eligibility for DSP. However, if the adult child lives with a parent, this may affect their DSP rate due to living arrangements.
            </Text>

            <Text style={styles.heading3}>NDIS Funding</Text>

            <Text style={styles.paragraph}>
              NDIS funding is separate from child support. Child support covers general living expenses, while NDIS covers disability-specific supports and services.
            </Text>

            <Text style={styles.heading3}>Carer Payment</Text>

            <Text style={styles.paragraph}>
              If a parent receives Carer Payment for caring for the adult disabled child, this doesn't affect the child support assessment. The parent may still be entitled to receive child support.
            </Text>

            <Text style={styles.heading2}>When to Seek Legal Advice</Text>

            <Text style={styles.paragraph}>
              Consider consulting a family lawyer if:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Services Australia denies your application and you believe it should be approved
              </Text>
              <Text style={styles.bulletItem}>
                • The other parent disputes the adult child's eligibility
              </Text>
              <Text style={styles.bulletItem}>
                • You need help gathering appropriate medical evidence
              </Text>
              <Text style={styles.bulletItem}>
                • You want to include additional disability costs through Change of Assessment
              </Text>
              <Text style={styles.bulletItem}>
                • Care arrangements are complex or disputed
              </Text>
              <Text style={styles.bulletItem}>
                • You're considering a Binding Child Support Agreement
              </Text>
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.warningBoxTitle}>⚠️ Complex Cases</Text>
              <Text style={styles.warningBoxText}>
                Adult disabled child maintenance cases can be legally and medically complex. Professional advice ensures you present the strongest possible case and understand all your options.
              </Text>
            </View>

            <Text style={styles.heading2}>Frequently Asked Questions</Text>

            <FAQItem
              question="Can child support continue after a child turns 18 if they have a disability?"
              answer="Yes. If a child has a mental or physical disability that prevents them from supporting themselves, child support can continue indefinitely beyond age 18. The child must be unable to work or earn a living due to their disability, and this must be verified through medical evidence."
            />

            <FAQItem
              question="How do I apply for adult disabled child maintenance in Australia?"
              answer="You apply through Services Australia by completing a Child Support Application form and providing medical evidence of the disability. You'll need documentation from medical professionals showing the child cannot support themselves due to their disability. Services Australia will assess eligibility and establish the maintenance liability."
            />

            <FAQItem
              question="Is the child support amount different for adult disabled children?"
              answer="The calculation uses the same formula as regular child support, but the assessment can continue indefinitely rather than ending at age 18. The amount is based on both parents' incomes, care arrangements, and the costs of the child. Additional disability-related expenses may be considered through a Change of Assessment application."
            />

            <Text style={styles.heading2}>Next Steps</Text>

            <Text style={styles.paragraph}>
              If you're considering applying for adult disabled child maintenance:
            </Text>

            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Gather comprehensive medical evidence of the disability
              </Text>
              <Text style={styles.bulletItem}>
                • Document the adult child's inability to support themselves
              </Text>
              <Text style={styles.bulletItem}>
                • Contact Services Australia to discuss your situation
              </Text>
              <Text style={styles.bulletItem}>
                • Consider consulting a family lawyer for complex cases
              </Text>
              <Text style={styles.bulletItem}>
                • Understand your rights and obligations under the assessment
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
              <Text style={styles.finalCTATitle}>Need Help With Your Child Support Assessment?</Text>
              <Text style={styles.finalCTAText}>
                Our calculator helps you understand your child support obligations, but adult disabled child maintenance cases often require professional legal advice.
              </Text>
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
    ...createShadow({ elevation: 2 }),
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
    ...createShadow({ elevation: 3 }),
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
});
