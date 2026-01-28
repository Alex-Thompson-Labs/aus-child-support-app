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
      name: 'Does parental leave affect child support payments in Australia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, parental leave typically reduces your income, which can lower your child support assessment. You can lodge an **Estimate of Income** to reflect your reduced earnings during parental leave. When you return to work, your assessment will be recalculated based on your normal income.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I notify Services Australia when I go on parental leave?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, you should notify Services Australia as soon as you know you\'ll be taking parental leave. This allows them to adjust your assessment based on your reduced income. Failing to notify them means you may continue paying based on your full-time income.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Parental Leave Pay counted as income for child support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Parental Leave Pay from Centrelink is counted as taxable income for child support purposes. However, it\'s typically much lower than your normal salary, so your child support assessment will be reduced during the period you receive it.',
      },
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Parental Leave and Child Support Australia 2026 | Complete Guide',
  description: 'How parental leave affects child support in Australia. Learn about temporary assessment changes, Parental Leave Pay, returning to work, and planning ahead for 2026.',
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
  dateModified: '2026-01-27',
};

export default function ParentalLeaveChildSupportScreen() {
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
        title="Parental Leave Child Support Australia 2026 | PPL Guide"
        description="Parental leave income = $0 for child support. See how PPL affects assessments + when to update. Temporary reduction possible. Apply now to reduce payments."
        canonicalPath="/blog/parental-leave-child-support"
        schema={[faqSchema, articleSchema]}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Blog', path: '/blog' },
          { label: 'Parental Leave' },
        ]}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.breadcrumb}>
            <Pressable accessibilityRole="link" onPress={() => router.push('/')} {...webClickableStyles}>
              <Text style={styles.breadcrumbLink}>Home</Text>
            </Pressable>
            <Text style={styles.breadcrumbSeparator}> / </Text>
            <Pressable accessibilityRole="link" onPress={() => router.push('/blog')} {...webClickableStyles}>
              <Text style={styles.breadcrumbLink}>Blog</Text>
            </Pressable>
            <Text style={styles.breadcrumbSeparator}> / </Text>
            <Text style={styles.breadcrumbCurrent}>Parental Leave</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.title} accessibilityRole="header">
              Parental Leave and Child Support Australia 2026 | Complete Guide
            </Text>

            <Text style={styles.meta}>Last updated: January 27, 2026 • 8 min read</Text>

            <Text style={styles.paragraph}>
              Taking parental leave is a significant life event that affects your income and, consequently, your child support obligations. Whether you're the paying or receiving parent, understanding how parental leave impacts child support assessments is crucial for financial planning.
            </Text>

            <View style={styles.quickAnswerBox}>
              <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
              <Text style={styles.quickAnswerText}>
                Taking parental leave? Your child support temporarily decreases based on Parental Leave Pay income.
                Notify Services Australia immediately to avoid overpayments. Calculate your adjusted amount below.
              </Text>
              <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} accessibilityRole="button" onPress={handleCalculatorPress}>
                <Text style={styles.quickAnswerButtonText}>Calculate Amount →</Text>
              </Pressable>
            </View>

            <Text style={styles.paragraph}>
              This comprehensive guide explains how parental leave affects child support, when to notify Services Australia, how Parental Leave Pay is treated, and what happens when you return to work.
            </Text>

            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={handleCalculatorPress}
              {...webClickableStyles}
            >
              <Text style={styles.ctaButtonText}>Calculate Your Child Support →</Text>
            </Pressable>

            <Text style={styles.heading2}>Does parental leave affect child support payments in Australia?</Text>

            <Text style={styles.paragraph}>
              Yes. Parental leave typically reduces your income, which can lower your child support assessment. You can submit an **Estimate of Income** to match your current earnings, rather than your previous year's tax return. When you return to work, your assessment will be recalculated.
            </Text>

            <Text style={styles.heading2}>How Parental Leave Affects Your Income</Text>

            <Text style={styles.paragraph}>
              Parental leave typically involves a significant reduction in income, which directly impacts your child support assessment:
            </Text>

            <View style={styles.impactCard}>
              <Text style={styles.impactTitle}>Before Parental Leave</Text>
              <Text style={styles.impactText}>
                Your child support is calculated based on your full-time salary. For example, if you earn $80,000/year, your assessment is based on this amount.
              </Text>
            </View>

            <View style={styles.impactCard}>
              <Text style={styles.impactTitle}>During Parental Leave</Text>
              <Text style={styles.impactText}>
                Your income drops to Parental Leave Pay (currently $882.75/week or ~$45,900/year) or unpaid leave ($0). Your child support assessment should be recalculated based on this reduced income.
              </Text>
            </View>

            <View style={styles.impactCard}>
              <Text style={styles.impactTitle}>After Returning to Work</Text>
              <Text style={styles.impactText}>
                Your income returns to normal levels, and your child support assessment increases back to the original amount (or adjusted based on your new circumstances).
              </Text>
            </View>

            <View style={styles.keyPointBox}>
              <Text style={styles.keyPointTitle}>💡 Key Point:</Text>
              <Text style={styles.keyPointText}>
                Services Australia won't automatically adjust your assessment when you go on parental leave. You must notify them and lodge an **Estimate of Income** to reduce your payments immediately.
              </Text>
            </View>

            <Text style={styles.heading2}>Lodging an Estimate of Income for Parental Leave</Text>

            <Text style={styles.paragraph}>
              When your income drops due to parental leave, you should lodge an **Estimate of Income**. This tells Services Australia to calculate your payments based on your *current* reduced income rather than your last tax return. For more information on how income changes affect child support, see our guide on{' '}
              <Text
                style={styles.inlineLink}
                onPress={() => router.push('/blog/estimate-vs-actual-income-child-support')}
              >
                estimate vs actual income
              </Text>
              .
            </Text>

            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>1</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Notify Services Australia</Text>
                <Text style={styles.stepText}>
                  Contact Services Australia (131 272) as soon as you know you'll be taking parental leave. Provide your expected leave start date, duration, and estimated income during leave.
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>2</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Provide Evidence</Text>
                <Text style={styles.stepText}>
                  Submit documentation showing your reduced income: employer letter confirming leave dates, Parental Leave Pay approval, or payslips showing reduced earnings.
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>3</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Assessment Adjusted</Text>
                <Text style={styles.stepText}>
                  Services Australia recalculates your child support based on your reduced income during parental leave. This typically takes 2-4 weeks to process.
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>4</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Return to Work Notification</Text>
                <Text style={styles.stepText}>
                  When you return to work, notify Services Australia again. Your assessment will be recalculated based on your normal income.
                </Text>
              </View>
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>⚠️ Important:</Text>
              <Text style={styles.warningText}>
                If you don't notify Services Australia about parental leave, you'll continue paying child support based on your full-time income. This can cause financial hardship and potential overpayments.
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={handleInquiryPress}
              {...webClickableStyles}
            >
              <Text style={styles.ctaButtonText}>Get Legal Help With Assessment Changes →</Text>
            </Pressable>

            <View style={styles.trustBox}>
              <Text style={styles.trustBoxTitle}>💡 What to Expect:</Text>
              <Text style={styles.trustBoxItem}>• Most lawyers respond within 24 hours</Text>
              <Text style={styles.trustBoxItem}>• Initial consultations often free or low-cost</Text>
              <Text style={styles.trustBoxItem}>• No obligation to proceed after consultation</Text>
              <Text style={styles.trustBoxItem}>• Your information remains confidential</Text>
            </View>

            <Text style={styles.heading2}>Parental Leave Pay and Child Support</Text>

            <Text style={styles.paragraph}>
              Parental Leave Pay (PLP) from Centrelink is counted as taxable income for child support purposes:
            </Text>

            <View style={styles.plpCard}>
              <Text style={styles.plpTitle}>Current Parental Leave Pay Rates (2026)</Text>
              <Text style={styles.plpItem}>• Weekly rate: $882.75 (before tax)</Text>
              <Text style={styles.plpItem}>• Annual equivalent: ~$45,900</Text>
              <Text style={styles.plpItem}>• Maximum period: 20 weeks (100 days)</Text>
              <Text style={styles.plpItem}>• Eligibility: Must meet work test and income test</Text>
            </View>

            <View style={styles.exampleCard}>
              <Text style={styles.exampleTitle}>Example: Parental Leave Pay Impact</Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Before Leave:</Text> Parent earning $80,000/year pays $450/month child support for 1 child.
              </Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>During Leave:</Text> Income drops to $45,900 (PLP). Child support reduces to approximately $250/month.
              </Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>After Leave:</Text> Returns to $80,000 income. Child support returns to $450/month.
              </Text>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipTitle}>💡 Tip:</Text>
              <Text style={styles.tipText}>
                Employer-paid parental leave (on top of government PLP) is also counted as income. If your employer tops up your leave to full pay, your child support won't decrease as much.
              </Text>
            </View>

            <Text style={styles.heading2}>Unpaid Parental Leave</Text>

            <Text style={styles.paragraph}>
              If you take unpaid parental leave (no income at all), your child support assessment can be reduced to the minimum. Learn more about{' '}
              <Text
                style={styles.inlineLink}
                onPress={() => router.push('/blog/child-support-centrelink-income-support')}
              >
                how Centrelink income support affects child support
              </Text>
              .
            </Text>

            <View style={styles.internalLinkBox}>
              <Text style={styles.internalLinkTitle}>📖 Related Reading:</Text>
              <Text style={styles.internalLinkText}>
                Learn about{' '}
                <Text
                  style={styles.inlineLink}
                  onPress={() => router.push('/blog/estimate-vs-actual-income-child-support')}
                >
                  estimate vs actual income
                </Text>
                {' '}and how income changes affect child support. For complex situations, see our guide on{' '}
                <Text
                  style={styles.inlineLink}
                  onPress={() => router.push('/blog/child-support-centrelink-income-support')}
                >
                  Centrelink income support
                </Text>.
              </Text>
            </View>

            <View style={styles.unpaidCard}>
              <Text style={styles.unpaidTitle}>Unpaid Leave Scenarios</Text>
              <Text style={styles.unpaidText}>
                <Text style={styles.bold}>Scenario 1: Completely Unpaid</Text> - If you have zero income during unpaid leave, you may qualify for the minimum child support assessment or nil assessment (depending on your circumstances).
              </Text>
              <Text style={styles.unpaidText}>
                <Text style={styles.bold}>Scenario 2: Partial Income</Text> - If you receive some income (e.g., investment income, rental income), your assessment is based on that reduced income.
              </Text>
              <Text style={styles.unpaidText}>
                <Text style={styles.bold}>Scenario 3: Partner's Income</Text> - Your new partner's income is NOT counted for child support, even if they're supporting you during unpaid leave.
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Minimum Child Support</Text>
              <Text style={styles.infoBoxText}>
                Even with zero income, you may still owe minimum child support if you have capacity to pay. Services Australia considers your assets, living expenses, and overall financial situation.
              </Text>
            </View>

            <Text style={styles.heading2}>Returning to Work: What to Expect</Text>

            <Text style={styles.paragraph}>
              When you return to work after parental leave, your child support assessment will change again:
            </Text>

            <View style={styles.returnCard}>
              <Text style={styles.returnNumber}>1</Text>
              <View style={styles.returnContent}>
                <Text style={styles.returnTitle}>Notify Immediately</Text>
                <Text style={styles.returnText}>
                  Tell Services Australia your return-to-work date before you return. This ensures your assessment is updated promptly.
                </Text>
              </View>
            </View>

            <View style={styles.returnCard}>
              <Text style={styles.returnNumber}>2</Text>
              <View style={styles.returnContent}>
                <Text style={styles.returnTitle}>Provide Updated Income</Text>
                <Text style={styles.returnText}>
                  Submit your new payslips or employer letter confirming your return to full-time (or part-time) work and your salary.
                </Text>
              </View>
            </View>

            <View style={styles.returnCard}>
              <Text style={styles.returnNumber}>3</Text>
              <View style={styles.returnContent}>
                <Text style={styles.returnTitle}>Assessment Recalculated</Text>
                <Text style={styles.returnText}>
                  Services Australia recalculates your child support based on your normal income. Payments increase back to pre-leave levels (or adjusted if your income changed).
                </Text>
              </View>
            </View>

            <View style={styles.returnCard}>
              <Text style={styles.returnNumber}>4</Text>
              <View style={styles.returnContent}>
                <Text style={styles.returnTitle}>Part-Time Return</Text>
                <Text style={styles.returnText}>
                  If you return part-time, your assessment is based on your part-time income. Notify Services Australia of your reduced hours and income.
                </Text>
              </View>
            </View>

            <View style={styles.scenarioCard}>
              <Text style={styles.scenarioTitle}>Common Scenario: Gradual Return</Text>
              <Text style={styles.scenarioText}>
                Many parents return to work gradually (e.g., 3 days/week for 3 months, then full-time). Each change in hours/income should be reported to Services Australia for accurate assessment.
              </Text>
              <Text style={styles.scenarioOutcome}>
                <Text style={styles.bold}>Best Practice:</Text> Keep Services Australia updated at each stage. Provide payslips showing your actual earnings to avoid overpaying or underpaying.
              </Text>
            </View>

            <Text style={styles.heading2}>Planning Ahead for Parental Leave</Text>

            <Text style={styles.paragraph}>
              If you're planning to take parental leave, here's how to prepare financially:
            </Text>

            <View style={styles.planCard}>
              <Text style={styles.planTitle}>3-6 Months Before Leave</Text>
              <Text style={styles.planItem}>• Calculate your expected income during leave (PLP + employer top-up)</Text>
              <Text style={styles.planItem}>• Use our calculator to estimate your reduced child support</Text>
              <Text style={styles.planItem}>• Budget for the income reduction</Text>
              <Text style={styles.planItem}>• Discuss with the other parent if you're receiving child support</Text>
            </View>

            <View style={styles.planCard}>
              <Text style={styles.planTitle}>1 Month Before Leave</Text>
              <Text style={styles.planItem}>• Notify Services Australia of your leave dates</Text>
              <Text style={styles.planItem}>• Submit evidence (employer letter, PLP approval)</Text>
              <Text style={styles.planItem}>• Confirm your new assessment amount</Text>
              <Text style={styles.planItem}>• Update payment methods if needed</Text>
            </View>

            <View style={styles.planCard}>
              <Text style={styles.planTitle}>During Leave</Text>
              <Text style={styles.planItem}>• Keep records of all income received</Text>
              <Text style={styles.planItem}>• Monitor your child support payments</Text>
              <Text style={styles.planItem}>• Plan your return-to-work date</Text>
              <Text style={styles.planItem}>• Notify Services Australia if leave extends</Text>
            </View>

            <View style={styles.planCard}>
              <Text style={styles.planTitle}>Before Returning to Work</Text>
              <Text style={styles.planItem}>• Notify Services Australia 2-4 weeks before return</Text>
              <Text style={styles.planItem}>• Provide return-to-work details (date, hours, salary)</Text>
              <Text style={styles.planItem}>• Budget for increased child support payments</Text>
              <Text style={styles.planItem}>• Update automatic payment arrangements</Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={handleCalculatorPress}
              {...webClickableStyles}
            >
              <Text style={styles.ctaButtonText}>Calculate Your Child Support During Leave</Text>
            </Pressable>

            <Text style={styles.heading2}>Special Situations</Text>

            <View style={styles.specialCard}>
              <Text style={styles.specialTitle}>Extended Parental Leave (12+ months)</Text>
              <Text style={styles.specialText}>
                If you take extended unpaid leave beyond the PLP period, your assessment will be based on zero or minimal income. Services Australia may review your capacity to pay based on assets and living expenses.
              </Text>
            </View>

            <View style={styles.specialCard}>
              <Text style={styles.specialTitle}>Second Child Born (Existing Child Support)</Text>
              <Text style={styles.specialText}>
                If you're paying child support for an existing child and have a new baby, your assessment may be adjusted for the new dependent child. Parental leave for the new baby also reduces your income, further lowering your assessment.
              </Text>
            </View>

            <View style={styles.specialCard}>
              <Text style={styles.specialTitle}>Both Parents on Parental Leave</Text>
              <Text style={styles.specialText}>
                If both parents are on parental leave simultaneously (rare but possible), both assessments are based on reduced incomes. The parent with higher income (even if reduced) typically still pays child support.
              </Text>
            </View>

            <View style={styles.specialCard}>
              <Text style={styles.specialTitle}>Parental Leave for Child You Pay Support For</Text>
              <Text style={styles.specialText}>
                If the receiving parent goes on parental leave (e.g., has a new baby with a new partner), their income reduction doesn't affect your child support obligation. Your payments are based on YOUR income, not theirs.
              </Text>
            </View>

            <Text style={styles.heading2}>Frequently Asked Questions</Text>

            <FAQItem
              question="Does parental leave affect child support payments in Australia?"
              answer="Yes, parental leave typically reduces your income, which can lower your child support assessment. You can lodge an Estimate of Income based on your reduced earnings during parental leave. When you return to work, your assessment will be recalculated based on your normal income."
            />

            <FAQItem
              question="Should I notify Services Australia when I go on parental leave?"
              answer="Yes, you should notify Services Australia as soon as you know you'll be taking parental leave. This allows them to adjust your assessment based on your reduced income. Failing to notify them means you may continue paying based on your full-time income."
            />

            <FAQItem
              question="Is Parental Leave Pay counted as income for child support?"
              answer="Yes, Parental Leave Pay from Centrelink is counted as taxable income for child support purposes. However, it's typically much lower than your normal salary, so your child support assessment will be reduced during the period you receive it."
            />

            <FAQItem
              question="What if I return to work part-time after parental leave?"
              answer="If you return part-time, your child support assessment will be based on your part-time income. Notify Services Australia of your reduced hours and provide payslips showing your actual earnings. Your assessment will be adjusted accordingly."
            />

            <FAQItem
              question="Can I get a refund if I overpaid child support during parental leave?"
              answer="If you continued paying full child support during parental leave because you didn't notify Services Australia, you may be able to claim an overpayment. However, this is difficult to recover retroactively. It's crucial to notify them before your leave starts."
            />

            <View style={styles.finalCtaCard}>
              <Text style={styles.finalCtaTitle}>Need Help With Parental Leave and Child Support?</Text>
              <Text style={styles.finalCtaText}>
                Navigating child support during parental leave can be complex. Connect with experienced family lawyers who can help you lodge accurate income estimates, handle disputes, and ensure you're paying the correct amount.
              </Text>
              <View style={styles.trustSignals}>
                <Text style={styles.trustSignalItem}>✓ Free initial consultation</Text>
                <Text style={styles.trustSignalItem}>✓ Specialists in child support estimates</Text>
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
  impactCard: {
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
  impactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  impactText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
  },
  keyPointBox: {
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
  keyPointTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
  },
  keyPointText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#1e40af',
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
  plpCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  plpTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0c4a6e',
    marginBottom: 12,
  },
  plpItem: {
    fontSize: 15,
    lineHeight: 24,
    color: '#0c4a6e',
    marginBottom: 8,
  },
  exampleCard: {
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
  exampleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 12,
  },
  exampleText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
    marginBottom: 8,
  },
  bold: {
    fontWeight: '700',
    color: '#1e3a8a',
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
  unpaidCard: {
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
  unpaidTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 12,
  },
  unpaidText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
    marginBottom: 12,
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
  returnCard: {
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
  returnNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563eb',
    marginRight: 16,
    width: 32,
  },
  returnContent: {
    flex: 1,
  },
  returnTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  returnText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
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
  planCard: {
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
  planTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 12,
  },
  planItem: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
    marginBottom: 8,
  },
  specialCard: {
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
  specialTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  specialText: {
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
  internalLinkBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#bfdbfe' },
  internalLinkTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
  internalLinkText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 16 },
});
