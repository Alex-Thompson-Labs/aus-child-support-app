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
      name: 'What is the difference between estimated and actual income for child support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Estimated income is what Services Australia predicts you\'ll earn this year (often based on last year\'s tax return). Actual income is what you really earned, confirmed by your tax return. Services Australia reconciles these annually, which can result in overpayments or underpayments that need to be adjusted.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if my actual income is different from the estimate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Services Australia will reconcile your assessment once your tax return is processed. If you earned more than estimated, you\'ll owe additional child support (underpayment). If you earned less, you may have overpaid and could receive a credit or refund.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I update my income estimate during the year?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, you can update your income estimate at any time if your circumstances change significantly. Contact Services Australia and provide evidence of your changed income (payslips, employment letter, etc.). This helps avoid large reconciliation adjustments later.',
      },
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Estimate vs Actual Income Child Support Australia 2026 | Complete Guide',
  description: 'Understand estimated vs actual income for child support in Australia. Learn about reconciliation, overpayments, underpayments, and how to update your income estimate to avoid surprises.',
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

export default function EstimateVsActualIncomeScreen() {
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
        title="Estimate vs Actual Income Child Support Australia 2026 | Complete Guide"
        description="Income reconciliation can trigger $1,000s in surprise bills. See estimated vs actual income differences + how to update estimates. Avoid shock payments."
        canonicalPath="/blog/estimate-vs-actual-income-child-support"
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
            <Text style={styles.breadcrumbCurrent}>Estimate vs Actual Income</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>
              Estimate vs Actual Income Child Support Australia 2026 | Complete Guide
            </Text>

            <Text style={styles.meta}>Last updated: January 27, 2026 • 9 min read</Text>

            <Text style={styles.paragraph}>
              Child support assessments in Australia are based on income, but there's often a gap between what Services Australia estimates you'll earn and what you actually earn. This difference can lead to significant adjustments, overpayments, or underpayments when your tax return is processed.
            </Text>

            <View style={styles.quickAnswerBox}>
              <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
              <Text style={styles.quickAnswerText}>
                Child support uses estimated income during the year, then reconciles with actual income from tax returns. 
                Differences create overpayments or underpayments. Calculate your estimated amount below.
              </Text>
              <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={handleCalculatorPress}>
                <Text style={styles.quickAnswerButtonText}>Calculate Amount →</Text>
              </Pressable>
            </View>

            <Text style={styles.paragraph}>
              This comprehensive guide explains the difference between estimated and actual income, how reconciliation works, what happens when they don't match, and how to update your income estimate to avoid surprises.
            </Text>

            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={handleCalculatorPress}
              {...webClickableStyles}
            >
              <Text style={styles.ctaButtonText}>Calculate Your Child Support →</Text>
            </Pressable>

            <Text style={styles.heading2}>What is the difference between estimated and actual income for child support?</Text>

            <Text style={styles.paragraph}>
              Estimated income is what Services Australia predicts you'll earn this year, while actual income is what you really earned (confirmed by your tax return). Understanding this difference is crucial for avoiding financial surprises.
            </Text>

            <View style={styles.comparisonCard}>
              <Text style={styles.comparisonTitle}>Estimated Income</Text>
              <Text style={styles.comparisonText}>
                This is what Services Australia predicts you'll earn in the current financial year. It's usually based on your most recent tax return (last year's income) or your current payslips if you've updated your income.
              </Text>
              <Text style={styles.comparisonExample}>
                Example: Your 2024-25 tax return showed $80,000 income. Services Australia estimates you'll earn $80,000 in 2025-26.
              </Text>
            </View>

            <View style={styles.comparisonCard}>
              <Text style={styles.comparisonTitle}>Actual Income</Text>
              <Text style={styles.comparisonText}>
                This is what you really earned, confirmed by your tax return after the financial year ends. The Australian Taxation Office (ATO) shares this data with Services Australia automatically.
              </Text>
              <Text style={styles.comparisonExample}>
                Example: Your 2025-26 tax return shows you actually earned $90,000 (not the estimated $80,000).
              </Text>
            </View>

            <View style={styles.keyPointBox}>
              <Text style={styles.keyPointTitle}>💡 Key Point:</Text>
              <Text style={styles.keyPointText}>
                Services Australia uses estimated income throughout the year to calculate your child support. Once your tax return is processed, they reconcile the estimate with your actual income and adjust your assessment accordingly.
              </Text>
            </View>

            <Text style={styles.heading2}>When Estimated Income is Used</Text>

            <Text style={styles.paragraph}>
              Services Australia uses estimated income in several situations:
            </Text>

            <View style={styles.situationCard}>
              <Text style={styles.situationTitle}>1. New Assessment</Text>
              <Text style={styles.situationText}>
                When you first apply for child support, Services Australia uses your most recent tax return to estimate your current income. If you don't have a recent tax return, they may use payslips or other evidence.
              </Text>
            </View>

            <View style={styles.situationCard}>
              <Text style={styles.situationTitle}>2. Start of Financial Year</Text>
              <Text style={styles.situationText}>
                At the start of each financial year (July 1), Services Australia automatically uses your previous year's tax return as the estimate for the new year—unless you update it.
              </Text>
            </View>

            <View style={styles.situationCard}>
              <Text style={styles.situationTitle}>3. Income Change Notification</Text>
              <Text style={styles.situationText}>
                If you notify Services Australia of an income change (new job, pay rise, redundancy), they'll use your new estimated income based on the evidence you provide.
              </Text>
            </View>

            <View style={styles.situationCard}>
              <Text style={styles.situationTitle}>4. Self-Employment</Text>
              <Text style={styles.situationText}>
                Self-employed parents often have variable income. Services Australia uses last year's tax return as the estimate, but you can update it if you expect significantly different earnings this year.
              </Text>
            </View>

            <Text style={styles.heading2}>The Reconciliation Process</Text>

            <Text style={styles.paragraph}>
              Reconciliation happens automatically once your tax return is processed. Here's how it works:
            </Text>

            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>1</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>You Lodge Your Tax Return</Text>
                <Text style={styles.stepText}>
                  You submit your tax return to the ATO (usually between July and October for the previous financial year).
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>2</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>ATO Processes Your Return</Text>
                <Text style={styles.stepText}>
                  The ATO processes your return and determines your actual taxable income for the year.
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>3</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>ATO Shares Data with Services Australia</Text>
                <Text style={styles.stepText}>
                  The ATO automatically shares your actual income with Services Australia (usually within 2-4 weeks of processing).
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>4</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Services Australia Reconciles</Text>
                <Text style={styles.stepText}>
                  Services Australia compares your actual income to the estimated income used throughout the year. They recalculate what you should have paid.
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>5</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Adjustment Made</Text>
                <Text style={styles.stepText}>
                  If there's a difference, Services Australia adjusts your assessment. You'll either owe additional child support (underpayment) or receive a credit (overpayment).
                </Text>
              </View>
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>⚠️ Important:</Text>
              <Text style={styles.warningText}>
                Reconciliation can result in large lump sum adjustments. If your actual income was significantly higher than estimated, you may owe thousands of dollars in back child support. If you don't lodge your tax return within 12 months of the financial year ending, Services Australia can determine an income amount for reconciliation purposes.
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={handleInquiryPress}
              {...webClickableStyles}
            >
              <Text style={styles.ctaButtonText}>Get Legal Help With Income Disputes →</Text>
            </Pressable>

            <View style={styles.trustSignalBox}>
              <Text style={styles.trustSignalTitle}>💼 Free Consultation Available:</Text>
              <Text style={styles.trustSignalItem}>• Most lawyers offer free initial consultations (15-30 minutes)</Text>
              <Text style={styles.trustSignalItem}>• No obligation to proceed after consultation</Text>
              <Text style={styles.trustSignalItem}>• Get expert advice on challenging incorrect assessments</Text>
              <Text style={styles.trustSignalItem}>• Understand your options for payment plans or disputes</Text>
            </View>

            <Text style={styles.heading2}>Overpayments: When You Earned Less Than Estimated</Text>

            <Text style={styles.paragraph}>
              If your actual income was lower than the estimate, Services Australia takes no further action. The lower estimate stands, meaning you don't receive a refund or credit for the difference. This is why it's crucial to update your estimate if your income drops significantly during the year.
            </Text>

            <View style={styles.exampleCard}>
              <Text style={styles.exampleTitle}>Overpayment Example</Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Estimated Income:</Text> $80,000 (based on last year's tax return)
              </Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Child Support Paid:</Text> $450/month × 12 months = $5,400
              </Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Actual Income:</Text> $65,000 (you took a pay cut or worked less)
              </Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Should Have Paid:</Text> $350/month × 12 months = $4,200
              </Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Overpayment:</Text> $5,400 - $4,200 = $1,200
              </Text>
            </View>

            <View style={styles.outcomeCard}>
              <Text style={styles.outcomeTitle}>What Happens Next:</Text>
              <Text style={styles.outcomeItem}>• Services Australia takes no further action - the lower estimate stands</Text>
              <Text style={styles.outcomeItem}>• You don't receive a refund for the overpayment</Text>
              <Text style={styles.outcomeItem}>• The assessment remains based on your estimated income, not the lower actual income</Text>
              <Text style={styles.outcomeItem}>• This is why it's important to update your estimate if your income drops significantly</Text>
            </View>

            <Text style={styles.heading2}>Underpayments: When You Earned More Than Estimated</Text>

            <Text style={styles.paragraph}>
              If your actual income was higher than the estimate, you underpaid child support throughout the year:
            </Text>

            <View style={styles.exampleCard}>
              <Text style={styles.exampleTitle}>Underpayment Example</Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Estimated Income:</Text> $80,000 (based on last year's tax return)
              </Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Child Support Paid:</Text> $450/month × 12 months = $5,400
              </Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Actual Income:</Text> $100,000 (you got a pay rise or bonus)
              </Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Should Have Paid:</Text> $600/month × 12 months = $7,200
              </Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Underpayment:</Text> $7,200 - $5,400 = $1,800
              </Text>
            </View>

            <View style={styles.outcomeCard}>
              <Text style={styles.outcomeTitle}>What Happens Next:</Text>
              <Text style={styles.outcomeItem}>• Services Australia adds the $1,800 underpayment to your account as arrears</Text>
              <Text style={styles.outcomeItem}>• You must pay the $1,800 on top of your ongoing child support</Text>
              <Text style={styles.outcomeItem}>• Services Australia may set up a payment plan if you can't pay the lump sum</Text>
              <Text style={styles.outcomeItem}>• The receiving parent receives the additional $1,800</Text>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipTitle}>💡 Estimate Penalties:</Text>
              <Text style={styles.tipText}>
                If your actual income is 110% or more of your estimated income, you'll be charged an estimate penalty of 10% of the difference between what you should have paid and what you did pay. This penalty can be remitted if you have a reasonable explanation. Update your estimate immediately if your income increases to avoid penalties.
              </Text>
            </View>

            <Text style={styles.heading2}>Estimate Penalties: What You Need to Know</Text>

            <Text style={styles.paragraph}>
              If your actual income is significantly higher than your estimate, you may face an estimate penalty on top of the underpayment:
            </Text>

            <View style={styles.penaltyCard}>
              <Text style={styles.penaltyTitle}>When Penalties Apply</Text>
              <Text style={styles.penaltyText}>
                An estimate penalty is charged when your actual income is 110% or more of your estimated income. For example, if you estimated $80,000 but actually earned $88,000 or more (110% = $88,000), a penalty applies.
              </Text>
            </View>

            <View style={styles.penaltyCard}>
              <Text style={styles.penaltyTitle}>Penalty Amount</Text>
              <Text style={styles.penaltyText}>
                The penalty is 10% of the difference between what you should have paid (based on actual income) and what you did pay (based on estimated income). This is a debt owed to the Commonwealth, not to the other parent.
              </Text>
            </View>

            <View style={styles.penaltyCard}>
              <Text style={styles.penaltyTitle}>Penalty Remission</Text>
              <Text style={styles.penaltyText}>
                Services Australia can waive (remit) the penalty if you have a reasonable explanation. Examples include: tax law changes you couldn't predict, genuine mistakes, or circumstances beyond your control. Contact Services Australia immediately if you believe the penalty should be remitted.
              </Text>
            </View>

            <View style={styles.exampleCard}>
              <Text style={styles.exampleTitle}>Estimate Penalty Example</Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Estimated Income:</Text> $80,000
              </Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Actual Income:</Text> $95,000 (118.75% of estimate)
              </Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Should Have Paid:</Text> $7,200 (based on $95,000)
              </Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Did Pay:</Text> $5,400 (based on $80,000 estimate)
              </Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Underpayment:</Text> $1,800
              </Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Estimate Penalty:</Text> $180 (10% of $1,800)
              </Text>
              <Text style={styles.exampleText}>
                <Text style={styles.bold}>Total Owed:</Text> $1,980 ($1,800 + $180 penalty)
              </Text>
            </View>

            <Text style={styles.heading2}>How to Update Your Income Estimate</Text>

            <Text style={styles.paragraph}>
              You can update your income estimate at any time if your circumstances change:
            </Text>

            <View style={styles.updateCard}>
              <Text style={styles.updateNumber}>1</Text>
              <View style={styles.updateContent}>
                <Text style={styles.updateTitle}>Identify the Change</Text>
                <Text style={styles.updateText}>
                  Determine if your income has changed significantly (pay rise, new job, redundancy, reduced hours, business income change).
                </Text>
              </View>
            </View>

            <View style={styles.updateCard}>
              <Text style={styles.updateNumber}>2</Text>
              <View style={styles.updateContent}>
                <Text style={styles.updateTitle}>Gather Evidence</Text>
                <Text style={styles.updateText}>
                  Collect payslips, employment letter, profit/loss statements, or other documents showing your new income level.
                </Text>
              </View>
            </View>

            <View style={styles.updateCard}>
              <Text style={styles.updateNumber}>3</Text>
              <View style={styles.updateContent}>
                <Text style={styles.updateTitle}>Contact Services Australia</Text>
                <Text style={styles.updateText}>
                  Call 131 272 or use your online account to notify them of the income change. Provide the evidence and your estimated annual income.
                </Text>
              </View>
            </View>

            <View style={styles.updateCard}>
              <Text style={styles.updateNumber}>4</Text>
              <View style={styles.updateContent}>
                <Text style={styles.updateTitle}>Assessment Updated</Text>
                <Text style={styles.updateText}>
                  Services Australia updates your assessment based on the new estimate. Your child support payments change from the date of the change (or the date you notify them).
                </Text>
              </View>
            </View>

            <View style={styles.updateCard}>
              <Text style={styles.updateNumber}>5</Text>
              <View style={styles.updateContent}>
                <Text style={styles.updateTitle}>Reconciliation Still Happens</Text>
                <Text style={styles.updateText}>
                  Even if you update your estimate, Services Australia will still reconcile it against your actual income when your tax return is processed.
                </Text>
              </View>
            </View>

            <Text style={styles.heading2}>Common Scenarios</Text>

            <View style={styles.scenarioCard}>
              <Text style={styles.scenarioTitle}>Scenario 1: Pay Rise Mid-Year</Text>
              <Text style={styles.scenarioText}>
                You get a $20,000 pay rise in January. Your estimated income was $80,000, but you'll actually earn $90,000 for the year.
              </Text>
              <Text style={styles.scenarioOutcome}>
                <Text style={styles.bold}>Best Action:</Text> Update your income estimate immediately. Services Australia will increase your child support from January forward, avoiding a large underpayment at reconciliation.
              </Text>
            </View>

            <View style={styles.scenarioCard}>
              <Text style={styles.scenarioTitle}>Scenario 2: Redundancy</Text>
              <Text style={styles.scenarioText}>
                You're made redundant in March. Your estimated income was $80,000, but you'll only earn $60,000 for the year (9 months work + redundancy payout).
              </Text>
              <Text style={styles.scenarioOutcome}>
                <Text style={styles.bold}>Best Action:</Text> Update your estimate immediately. Your child support will reduce from March, preventing overpayment. Note: Redundancy payouts are counted as income.
              </Text>
            </View>

            <View style={styles.scenarioCard}>
              <Text style={styles.scenarioTitle}>Scenario 3: Self-Employment Income Varies</Text>
              <Text style={styles.scenarioText}>
                You're self-employed. Last year you earned $80,000, but this year business is slow and you'll only earn $50,000.
              </Text>
              <Text style={styles.scenarioOutcome}>
                <Text style={styles.bold}>Best Action:</Text> Update your estimate mid-year with profit/loss statements. Services Australia will adjust your assessment, but you'll still reconcile when your tax return is lodged.
              </Text>
            </View>

            <View style={styles.scenarioCard}>
              <Text style={styles.scenarioTitle}>Scenario 4: Bonus or Commission</Text>
              <Text style={styles.scenarioText}>
                Your base salary is $80,000, but you receive a $30,000 bonus in June. Your actual income is $110,000.
              </Text>
              <Text style={styles.scenarioOutcome}>
                <Text style={styles.bold}>Best Action:</Text> If you know you'll receive a bonus, update your estimate before the financial year ends. Otherwise, you'll face a large underpayment at reconciliation.
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
              onPress={handleCalculatorPress}
              {...webClickableStyles}
            >
              <Text style={styles.ctaButtonText}>Calculate Your Child Support Now</Text>
            </Pressable>

            <View style={styles.internalLinkBox}>
              <Text style={styles.internalLinkTitle}>📖 Related Reading:</Text>
              <Text style={styles.internalLinkText}>
                If you're self-employed and your income varies significantly year-to-year, learn about{' '}
                <Text
                  style={styles.inlineLink}
                  onPress={() => router.push('/blog/child-support-self-employed')}
                >
                  child support for self-employed parents
                </Text>
                . For complex income situations, see our guide on{' '}
                <Text
                  style={styles.inlineLink}
                  onPress={() => router.push('/blog/complicated-child-support-situations')}
                >
                  complicated child support situations
                </Text>.
              </Text>
            </View>

            <Text style={styles.heading2}>Tips to Avoid Reconciliation Surprises</Text>

            <View style={styles.avoidCard}>
              <Text style={styles.avoidTitle}>1. Update Your Estimate Proactively</Text>
              <Text style={styles.avoidText}>
                Don't wait for reconciliation. If your income changes significantly (more than 15%), update your estimate immediately.
              </Text>
            </View>

            <View style={styles.avoidCard}>
              <Text style={styles.avoidTitle}>2. Review Your Assessment Regularly</Text>
              <Text style={styles.avoidText}>
                Check your child support assessment every 3-6 months. Ensure the income used matches your current earnings.
              </Text>
            </View>

            <View style={styles.avoidCard}>
              <Text style={styles.avoidTitle}>3. Keep Records</Text>
              <Text style={styles.avoidText}>
                Save payslips, tax returns, and assessment notices. This helps you track whether you're paying the right amount.
              </Text>
            </View>

            <View style={styles.avoidCard}>
              <Text style={styles.avoidTitle}>4. Plan for Bonuses and Commissions</Text>
              <Text style={styles.avoidText}>
                If you receive irregular income (bonuses, commissions), set aside money for potential underpayments at reconciliation.
              </Text>
            </View>

            <View style={styles.avoidCard}>
              <Text style={styles.avoidTitle}>5. Lodge Your Tax Return Promptly</Text>
              <Text style={styles.avoidText}>
                The sooner you lodge, the sooner reconciliation happens. This gives you more time to manage any adjustments. If you don't lodge within 12 months, Services Australia can determine an income for reconciliation, which may not be accurate.
              </Text>
            </View>

            <Text style={styles.heading2}>Frequently Asked Questions</Text>

            <FAQItem
              question="What is the difference between estimated and actual income for child support?"
              answer="Estimated income is what Services Australia predicts you'll earn this year (often based on last year's tax return). Actual income is what you really earned, confirmed by your tax return. Services Australia reconciles these annually, which can result in overpayments or underpayments that need to be adjusted."
            />

            <FAQItem
              question="What happens if my actual income is different from the estimate?"
              answer="Services Australia will reconcile your assessment once your tax return is processed. If you earned more than estimated, you'll owe additional child support (underpayment). If you earned less, you may have overpaid and could receive a credit or refund."
            />

            <FAQItem
              question="Can I update my income estimate during the year?"
              answer="Yes, you can update your income estimate at any time if your circumstances change significantly. Contact Services Australia and provide evidence of your changed income (payslips, employment letter, etc.). This helps avoid large reconciliation adjustments later."
            />

            <FAQItem
              question="How long does reconciliation take?"
              answer="Reconciliation happens after the ATO processes your tax return and shares your income data with Services Australia. They then recalculate your assessment and notify you of any adjustments. If you don't lodge your tax return within 12 months of the financial year ending, Services Australia may determine an income amount for reconciliation purposes."
            />

            <FAQItem
              question="Can I dispute a reconciliation adjustment?"
              answer="Yes, if you believe the reconciliation is incorrect, you can request a review. Contact Services Australia and provide evidence showing why the adjustment is wrong. You may need to check your tax return for errors or provide additional documentation. You can also request remission of estimate penalties if you have a reasonable explanation for the underestimation."
            />

            <View style={styles.finalCtaCard}>
              <Text style={styles.finalCtaTitle}>Need Help With Income Assessments or Reconciliation?</Text>
              <Text style={styles.finalCtaText}>
                Income disputes and reconciliation adjustments can be complex and stressful. Connect with experienced family lawyers who can help you challenge assessments, negotiate payment plans, or resolve disputes with Services Australia.
              </Text>
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
  comparisonCard: {
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
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  comparisonText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
    marginBottom: 8,
  },
  comparisonExample: {
    fontSize: 14,
    lineHeight: 22,
    color: '#64748b',
    fontStyle: 'italic',
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
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
  situationCard: {
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
  situationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  situationText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
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
  outcomeCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  outcomeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0c4a6e',
    marginBottom: 12,
  },
  outcomeItem: {
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
  updateCard: {
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
  updateNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563eb',
    marginRight: 16,
    width: 32,
  },
  updateContent: {
    flex: 1,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  updateText: {
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
  avoidCard: {
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
  avoidTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  avoidText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
  },
  penaltyCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fbbf24',
    ...createShadow({
      shadowColor: '#f59e0b',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    }),
  },
  penaltyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
  },
  penaltyText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#78350f',
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

  trustSignalBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#bfdbfe' },
  trustSignalTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 12 },
  trustSignalItem: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 6 },

  internalLinkBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#bfdbfe' },
  internalLinkTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
  internalLinkText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 16 },
  internalLinkButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 20, alignSelf: 'flex-start', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
  internalLinkButtonPressed: { opacity: 0.8 },
  internalLinkButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  inlineLink: { color: '#2563EB', fontWeight: '600', textDecorationLine: isWeb ? 'underline' : 'none' },
});
