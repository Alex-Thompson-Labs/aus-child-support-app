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
      name: 'Are private school fees included in child support calculations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, private school fees are not automatically included in the standard child support formula. The formula covers basic costs of children including education, but private school fees are considered an additional expense. Parents can seek to include these costs through a Change of Assessment application or a Binding Child Support Agreement.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I force the other parent to pay for private school?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You cannot automatically force the other parent to pay private school fees. However, you can apply for a Change of Assessment citing special circumstances, or seek a court order. The decision depends on factors like the child\'s educational needs, both parents\' financial capacity, and whether private schooling was agreed upon or established before separation.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I include private school fees in a child support agreement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Private school fees can be included in a Binding Child Support Agreement, which both parents must agree to. The agreement should specify how fees are split, who pays for extras like uniforms and excursions, and what happens if circumstances change. The agreement must meet legal requirements and be properly executed to be enforceable.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can private school fees be backdated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Change of Assessment decisions can be backdated up to 18 months from the date of application, subject to the Registrar\'s discretion. Backdating beyond 18 months requires court leave under section 112, which can allow changes up to 7 years prior. The Registrar considers factors like payment capacity and whether delays were reasonable when deciding the date of effect.',
      },
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Private School Fees and Child Support: Complete Guide for Australia',
  description:
    'Comprehensive guide to how private school fees affect child support in Australia. Learn about Change of Assessment applications, Binding Agreements, court orders, and splitting education costs.',
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

export default function PrivateSchoolFeesScreen() {
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
        title="Private School Fees and Child Support Australia 2026: Complete Guide"
        description="Private school fees aren't automatic—you must apply for Change of Assessment. See success criteria + Binding Agreement options. $20k+/year at stake."
        canonicalPath="/blog/private-school-fees-child-support"
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
            <Text style={styles.breadcrumbCurrent}>Private School Fees</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>
              Private School Fees and Child Support: Complete Guide for Australia
            </Text>

            <Text style={styles.meta}>Last updated: January 24, 2026 • 8 min read</Text>

            <Text style={styles.paragraph}>
              One of the most common questions separated parents ask is whether private school fees are included in child support. The short answer is no - private school fees are not automatically covered by the standard child support formula. However, there are several ways parents can arrange for these costs to be shared.
            </Text>

            <View style={styles.quickAnswerBox}>
              <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
              <Text style={styles.quickAnswerText}>
                Private school fees aren't automatically included in child support. You can apply for Change of Assessment 
                or negotiate a Binding Agreement to split education costs. Calculate standard child support below.
              </Text>
              <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={handleCalculatorPress}>
                <Text style={styles.quickAnswerButtonText}>Calculate Amount →</Text>
              </Pressable>
            </View>

            <Text style={styles.paragraph}>
              This comprehensive guide explains how private school fees interact with child support, your options for including these costs, and what factors Services Australia and courts consider when making decisions about educational expenses.
            </Text>

            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={handleCalculatorPress}
              {...webClickableStyles}
            >
              <Text style={styles.ctaButtonText}>Calculate Your Child Support</Text>
            </Pressable>

            <Text style={styles.heading2}>Are private school fees included in child support calculations?</Text>

            <Text style={styles.paragraph}>
              No, private school fees are not automatically included in the standard child support formula in Australia. The formula covers basic educational expenses like public school fees, textbooks, and standard supplies, but private school tuition is considered an additional expense beyond the formula. Parents can seek to include these costs through a Change of Assessment application citing special circumstances, a Binding Child Support Agreement, or a court order.
            </Text>

            <Text style={styles.heading2}>Are Private School Fees Included in Child Support?</Text>

            <Text style={styles.paragraph}>
              The standard child support formula includes a component for education costs, but this covers basic educational expenses like public school fees, textbooks, and standard supplies. Private school tuition is considered an additional expense beyond the formula. For more information on how the formula works, see our guide on{' '}
              <Text
                style={styles.inlineLink}
                onPress={() => router.push('/blog/child-support-formula-australia')}
              >
                the child support formula
              </Text>
              .
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>What the Formula Covers</Text>
              <Text style={styles.infoBoxText}>
                The Costs of Children table used in the child support formula includes allowances for education, but these are based on average costs for all children, not private school tuition. Private school fees typically far exceed these amounts.
              </Text>
            </View>

            <Text style={styles.heading2}>Options for Including Private School Fees</Text>

            <Text style={styles.paragraph}>
              While private school fees aren't automatically included in child support, there are three main ways to have these costs shared between parents:
            </Text>

            <View style={styles.optionCard}>
              <Text style={styles.optionNumber}>1</Text>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Change of Assessment Application</Text>
                <Text style={styles.optionText}>
                  Either parent can apply to Services Australia for a Change of Assessment, citing private school fees as a special circumstance. Services Australia will consider factors like both parents' financial capacity, the child's educational needs, and whether private schooling was agreed upon before separation.
                </Text>
                <Text style={styles.optionExample}>
                  Example: Child has been attending private school since Year 1. Both parents agreed to this before separation. Fees are $15,000/year. Services Australia may adjust the assessment to include a portion of these fees.
                </Text>
              </View>
            </View>

            <View style={styles.optionCard}>
              <Text style={styles.optionNumber}>2</Text>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Binding Child Support Agreement</Text>
                <Text style={styles.optionText}>
                  Parents can create a Binding Child Support Agreement that specifies how private school fees will be split. This requires both parents to agree and must be properly executed with legal advice. The agreement can detail exactly how fees, uniforms, excursions, and other costs are shared.
                </Text>
                <Text style={styles.optionExample}>
                  Example: Agreement states Parent A pays 60% of tuition, Parent B pays 40%. Both parents split uniforms and excursions 50/50. Agreement includes process for fee increases.
                </Text>
              </View>
            </View>

            <View style={styles.optionCard}>
              <Text style={styles.optionNumber}>3</Text>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Court Order</Text>
                <Text style={styles.optionText}>
                  If parents can't agree, either can apply to the Family Court for orders about private school fees. The court will consider the child's best interests, both parents' financial capacity, and whether private schooling is appropriate given the circumstances.
                </Text>
                <Text style={styles.optionExample}>
                  Example: Court orders that both parents contribute to private school fees in proportion to their incomes. Parent earning $120,000 pays 70%, parent earning $50,000 pays 30%.
                </Text>
              </View>
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>⚠️ Important:</Text>
              <Text style={styles.warningText}>
                You cannot unilaterally decide to enroll a child in private school and expect the other parent to pay. Private school decisions should be made jointly, or through formal legal processes if parents disagree.
              </Text>
            </View>

            <Text style={styles.heading2}>Factors Services Australia Considers</Text>

            <Text style={styles.paragraph}>
              When deciding whether to include private school fees in a Change of Assessment, Services Australia considers multiple factors. Learn more about{' '}
              <Text
                style={styles.inlineLink}
                onPress={() => router.push('/special-circumstances')}
              >
                Change of Assessment applications
              </Text>
              {' '}and special circumstances.
            </Text>

            <View style={styles.factorCard}>
              <Text style={styles.factorTitle}>1. Child's Educational Needs</Text>
              <Text style={styles.factorText}>
                Does the child have special educational needs that require private schooling? Is the child gifted and needs specialized programs? Has the child been attending private school for years?
              </Text>
            </View>

            <View style={styles.factorCard}>
              <Text style={styles.factorTitle}>2. Both Parents' Financial Capacity</Text>
              <Text style={styles.factorText}>
                Can both parents afford to contribute to private school fees? Would paying these fees cause financial hardship? What are the parents' respective incomes and expenses?
              </Text>
            </View>

            <View style={styles.factorCard}>
              <Text style={styles.factorTitle}>3. Agreement Before Separation</Text>
              <Text style={styles.factorText}>
                Did both parents agree to private schooling before separation? Was there a pattern of both parents contributing to fees? Did both parents attend school events and participate in the decision?
              </Text>
            </View>

            <View style={styles.factorCard}>
              <Text style={styles.factorTitle}>4. Availability of Public Schools</Text>
              <Text style={styles.factorText}>
                Are there suitable public schools available? Would changing schools disrupt the child's education? Are there specific programs at the private school not available elsewhere?
              </Text>
            </View>

            <View style={styles.factorCard}>
              <Text style={styles.factorTitle}>5. Child's Wishes (if age-appropriate)</Text>
              <Text style={styles.factorText}>
                For older children, their preference may be considered. Has the child expressed a strong desire to continue at their current school? Would changing schools affect their friendships and wellbeing?
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={handleInquiryPress}
              {...webClickableStyles}
            >
              <Text style={styles.ctaButtonText}>Get Legal Help With School Fees →</Text>
            </Pressable>

            <View style={styles.trustBox}>
              <Text style={styles.trustBoxTitle}>💡 What to Expect:</Text>
              <Text style={styles.trustBoxItem}>• Most lawyers respond within 24 hours</Text>
              <Text style={styles.trustBoxItem}>• Initial consultations often free or low-cost</Text>
              <Text style={styles.trustBoxItem}>• No obligation to proceed after consultation</Text>
              <Text style={styles.trustBoxItem}>• Your information remains confidential</Text>
            </View>

            <Text style={styles.heading2}>How to Split Private School Costs</Text>

            <Text style={styles.paragraph}>
              When parents agree (or are ordered) to share private school fees, the split can be structured in several ways:
            </Text>

            <View style={styles.splitCard}>
              <Text style={styles.splitTitle}>Proportional to Income</Text>
              <Text style={styles.splitText}>
                Each parent pays a percentage based on their income. If Parent A earns 70% of combined income, they pay 70% of fees.
              </Text>
              <Text style={styles.splitExample}>
                Parent A: $140,000 income (70%) | Parent B: $60,000 income (30%) | Fees: $20,000/year | Parent A pays $14,000, Parent B pays $6,000
              </Text>
            </View>

            <View style={styles.splitCard}>
              <Text style={styles.splitTitle}>Equal Split (50/50)</Text>
              <Text style={styles.splitText}>
                Both parents pay exactly half of all fees, regardless of income differences. This is simpler but may not be fair if incomes are very different.
              </Text>
              <Text style={styles.splitExample}>
                Fees: $20,000/year | Each parent pays $10,000
              </Text>
            </View>

            <View style={styles.splitCard}>
              <Text style={styles.splitTitle}>Fixed Amount</Text>
              <Text style={styles.splitText}>
                One parent pays a fixed dollar amount, the other pays the remainder. Useful when one parent has limited capacity to pay.
              </Text>
              <Text style={styles.splitExample}>
                Fees: $20,000/year | Parent B pays $5,000 (fixed), Parent A pays $15,000 (remainder)
              </Text>
            </View>

            <View style={styles.splitCard}>
              <Text style={styles.splitTitle}>One Parent Pays All</Text>
              <Text style={styles.splitText}>
                One parent pays all private school fees, but this is reflected in a reduced child support assessment. Less common but possible if one parent strongly wants private schooling.
              </Text>
            </View>

            <Text style={styles.heading2}>What's Included Beyond Tuition?</Text>

            <Text style={styles.paragraph}>
              Private school costs extend beyond tuition fees. When negotiating or applying for cost-sharing, consider:
            </Text>

            <View style={styles.costList}>
              <Text style={styles.costItem}>• Tuition fees (per term or annual)</Text>
              <Text style={styles.costItem}>• Uniforms and sports gear</Text>
              <Text style={styles.costItem}>• Textbooks and stationery</Text>
              <Text style={styles.costItem}>• Technology fees (laptops, tablets)</Text>
              <Text style={styles.costItem}>• Excursions and camps</Text>
              <Text style={styles.costItem}>• Extra-curricular activities (music, sports)</Text>
              <Text style={styles.costItem}>• Building levies and capital contributions</Text>
              <Text style={styles.costItem}>• Before and after school care</Text>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipTitle}>💡 Tip:</Text>
              <Text style={styles.tipText}>
                Be specific in agreements about what's included. Does "school fees" include excursions? Uniforms? Technology? Clear definitions prevent disputes later.
              </Text>
            </View>

            <Text style={styles.heading2}>Common Scenarios</Text>

            <View style={styles.scenarioCard}>
              <Text style={styles.scenarioTitle}>Scenario 1: Child Already in Private School</Text>
              <Text style={styles.scenarioText}>
                Child has attended private school for 5 years. Both parents agreed before separation. Parent A (primary carer) wants to continue, Parent B says they can't afford it.
              </Text>
              <Text style={styles.scenarioOutcome}>
                <Text style={styles.bold}>Likely Outcome:</Text> Services Australia or court will likely order both parents to contribute proportionally to their incomes, given the established pattern and child's need for continuity.
              </Text>
            </View>

            <View style={styles.scenarioCard}>
              <Text style={styles.scenarioTitle}>Scenario 2: One Parent Wants to Enroll Child</Text>
              <Text style={styles.scenarioText}>
                Child currently in public school. Parent A wants to enroll in private school, Parent B disagrees and refuses to contribute.
              </Text>
              <Text style={styles.scenarioOutcome}>
                <Text style={styles.bold}>Likely Outcome:</Text> Without agreement, Parent A would need to demonstrate special educational needs or get a court order. Simply preferring private school isn't enough to force the other parent to pay.
              </Text>
            </View>

            <View style={styles.scenarioCard}>
              <Text style={styles.scenarioTitle}>Scenario 3: Financial Hardship</Text>
              <Text style={styles.scenarioText}>
                Both parents agreed to private school, but Parent B's income has dropped significantly and they genuinely can't afford their share.
              </Text>
              <Text style={styles.scenarioOutcome}>
                <Text style={styles.bold}>Likely Outcome:</Text> Parent B can apply for a Change of Assessment citing financial hardship. The assessment may be adjusted, or the child may need to transfer to public school if neither parent can afford fees.
              </Text>
            </View>

            <View style={styles.scenarioCard}>
              <Text style={styles.scenarioTitle}>Scenario 4: Religious or Cultural Reasons</Text>
              <Text style={styles.scenarioText}>
                Parents want child to attend religious private school for cultural/faith reasons. Both agree on the school but disagree on cost split.
              </Text>
              <Text style={styles.scenarioOutcome}>
                <Text style={styles.bold}>Likely Outcome:</Text> If both agree on the school, they can negotiate cost split through mediation or Binding Agreement. Courts typically order proportional split based on incomes.
              </Text>
            </View>

            <Text style={styles.heading2}>Steps to Apply for Private School Fee Inclusion</Text>

            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>1</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Gather Evidence</Text>
                <Text style={styles.stepText}>
                  Collect school fee schedules, enrollment documents, evidence of prior agreement, child's academic records, and financial statements showing both parents' capacity to pay.
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>2</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Try to Negotiate</Text>
                <Text style={styles.stepText}>
                  Attempt to reach agreement with the other parent first. Use mediation if needed. A Binding Agreement is faster and cheaper than court.
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>3</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Apply for Change of Assessment</Text>
                <Text style={styles.stepText}>
                  If negotiation fails, apply to Services Australia for a Change of Assessment citing private school fees as a special circumstance. Provide all supporting evidence.
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>4</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Consider Court Application</Text>
                <Text style={styles.stepText}>
                  If Services Australia denies your application or you need more comprehensive orders, apply to the Family Court. Get legal advice first.
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>5</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Document Everything</Text>
                <Text style={styles.stepText}>
                  Keep records of all payments, communications about school fees, and changes in circumstances. This protects you if disputes arise later.
                </Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={handleCalculatorPress}
              {...webClickableStyles}
            >
              <Text style={styles.ctaButtonText}>Calculate Your Base Child Support</Text>
            </Pressable>

            <Text style={styles.heading2}>Frequently Asked Questions</Text>

            <FAQItem
              question="Are private school fees included in child support calculations?"
              answer="No, private school fees are not automatically included in the standard child support formula. The formula covers basic costs of children including education, but private school fees are considered an additional expense. Parents can seek to include these costs through a Change of Assessment application or a Binding Child Support Agreement."
            />

            <FAQItem
              question="Can I force the other parent to pay for private school?"
              answer="You cannot automatically force the other parent to pay private school fees. However, you can apply for a Change of Assessment citing special circumstances, or seek a court order. The decision depends on factors like the child's educational needs, both parents' financial capacity, and whether private schooling was agreed upon or established before separation."
            />

            <FAQItem
              question="How do I include private school fees in a child support agreement?"
              answer="Private school fees can be included in a Binding Child Support Agreement, which both parents must agree to. The agreement should specify how fees are split, who pays for extras like uniforms and excursions, and what happens if circumstances change. The agreement must meet legal requirements and be properly executed to be enforceable."
            />

            <FAQItem
              question="What if my ex enrolled our child in private school without my consent?"
              answer="If the other parent enrolled your child without your agreement, you're not automatically obligated to pay. You can refuse to contribute and let them know you don't consent. They would need to apply for a Change of Assessment or court order to compel you to pay, and would need to demonstrate why private schooling is necessary."
            />

            <FAQItem
              question="Can private school fees be backdated?"
              answer="Change of Assessment decisions can be backdated up to 18 months from the date of application, subject to the Registrar's discretion. Backdating beyond 18 months requires court leave under section 112, which can allow changes up to 7 years prior. The Registrar considers factors like payment capacity and whether delays were reasonable when deciding the date of effect."
            />

            <View style={styles.finalCtaCard}>
              <Text style={styles.finalCtaTitle}>Need Help With Private School Fee Disputes?</Text>
              <Text style={styles.finalCtaText}>
                Private school fee disputes can be complex and emotional. Connect with experienced family lawyers who can help you negotiate agreements, apply for Change of Assessment, or represent you in court.
              </Text>
              <View style={styles.trustSignals}>
                <Text style={styles.trustSignalItem}>✓ Free initial consultation</Text>
                <Text style={styles.trustSignalItem}>✓ Specialists in education cost disputes</Text>
                <Text style={styles.trustSignalItem}>✓ Confidential case review</Text>
              </View>
              <Pressable
                style={({ pressed }) => [styles.finalCtaButton, pressed && styles.finalCtaButtonPressed]}
                onPress={handleInquiryPress}
                {...webClickableStyles}
              >
                <Text style={styles.finalCtaButtonText}>Get Legal Help Now</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
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
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  container: {
    flex: 1,
    maxWidth: MAX_CALCULATOR_WIDTH,
    width: '100%',
    alignSelf: 'center',
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexWrap: 'wrap',
  },
  breadcrumbLink: {
    fontSize: 14,
    color: '#2563EB',
    textDecorationLine: isWeb ? 'underline' : 'none',
  },
  breadcrumbSeparator: {
    fontSize: 14,
    color: '#64748b',
    marginHorizontal: 4,
  },
  breadcrumbCurrent: {
    fontSize: 14,
    color: '#64748b',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e3a8a',
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
    color: '#475569',
    marginBottom: 16,
  },

    quickAnswerBox: { backgroundColor: '#2563eb', borderRadius: 12, padding: 20, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    quickAnswerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
    quickAnswerText: { fontSize: 15, lineHeight: 24, color: '#ffffff', marginBottom: 16, textAlign: 'center' },
    quickAnswerButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
    quickAnswerButtonText: { color: '#2563eb', fontSize: 16, fontWeight: '700' },

  heading2: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e3a8a',
    marginTop: 32,
    marginBottom: 16,
    lineHeight: 32,
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3b82f6',
    padding: 20,
    marginBottom: 24,
    ...createShadow({
      shadowColor: '#3b82f6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    }),
  },
  infoBoxTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
  },
  infoBoxText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#1e40af',
  },
  optionCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    }),
  },
  optionNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 16,
    width: 32,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
    marginBottom: 8,
  },
  optionExample: {
    fontSize: 14,
    lineHeight: 22,
    color: '#64748b',
    fontStyle: 'italic',
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
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
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
  },
  factorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    }),
  },
  factorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  factorText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
  },
  ctaButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginVertical: 16,
    alignItems: 'center',
    ...createShadow({
      shadowColor: '#2563EB',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  ctaButtonPressed: {
    opacity: 0.8,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  splitCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    }),
  },
  splitTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  splitText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
    marginBottom: 8,
  },
  splitExample: {
    fontSize: 14,
    lineHeight: 22,
    color: '#64748b',
    fontStyle: 'italic',
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2563eb',
  },
  costList: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  costItem: {
    fontSize: 15,
    lineHeight: 24,
    color: '#0c4a6e',
    marginBottom: 8,
  },
  tipBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
    padding: 16,
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#1e40af',
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
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    }),
  },
  scenarioTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  scenarioText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
    marginBottom: 12,
  },
  scenarioOutcome: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2563eb',
  },
  bold: {
    fontWeight: '700',
    color: '#1e3a8a',
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    }),
  },
  stepNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 16,
    width: 32,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
  },
  faqItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    }),
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
  },
  finalCtaCard: {
    backgroundColor: '#1e3a8a',
    borderRadius: 12,
    padding: 24,
    marginTop: 16,
    alignItems: 'center',
  },
  finalCtaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  finalCtaText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#bfdbfe',
    marginBottom: 20,
    textAlign: 'center',
  },
  finalCtaButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    }),
  },
  finalCtaButtonPressed: {
    opacity: 0.8,
  },
  finalCtaButtonText: {
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
    color: '#bfdbfe',
    marginBottom: 4,
  },
});
