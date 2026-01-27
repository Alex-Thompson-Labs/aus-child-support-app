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
            name: 'Can I get a refund if I overpaid child support in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, but only in specific circumstances. If your assessment was reduced retroactively and you overpaid, Services Australia will credit the overpayment against future payments or refund it. However, if you voluntarily paid more than required, refunds are difficult to obtain.',
            },
        },
        {
            '@type': 'Question',
            name: 'How long do I have to claim a child support overpayment?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'You should claim overpayments as soon as you discover them. Services Australia typically reviews overpayments for the current assessment period and up to 18 months prior. Waiting longer may limit your recovery options.',
            },
        },
        {
            '@type': 'Question',
            name: 'What if the receiving parent spent the overpayment?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'If Services Australia determines you overpaid, they will recover it from the receiving parent—even if they already spent it. The receiving parent may have to repay through reduced future payments or direct repayment to Services Australia.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Child Support Overpayment Refund Australia: How to Get Your Money Back',
    description: 'Overpaid child support? Learn how to claim a refund, what evidence you need, and when Services Australia will recover overpayments from the receiving parent.',
    datePublished: '2026-01-24',
    author: { '@type': 'Organization', name: 'AusChildSupport' },
};

export default function ChildSupportOverpaymentRefundBlogPost() {
    const router = useRouter();
    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="Child Support Overpayment Refund Australia 2026: Get Your Money Back"
                description="Overpaid? Services Australia recovers from the other parent—even if they spent it. See refund process + evidence requirements. Claim within 18 months."
                canonicalPath="/blog/child-support-overpayment-refund"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Overpayment Refunds' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Overpayments</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            Child Support Overpayment Refund Australia: How to Get Your Money Back
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        Paid more child support than you owed? Whether your assessment was reduced retroactively or you
                        made calculation errors, you may be entitled to a refund. Here's how to claim overpayments,
                        what Services Australia will do, and how to avoid overpaying in the future.
                    </Text>

                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            If you overpaid child support, Services Australia can recover it from future payments or directly from the receiving parent. You must apply within 12 months. Calculate your correct amount below.
                        </Text>
                        <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.quickAnswerButtonText}>Calculate Your Amount →</Text>
                        </Pressable>
                    </View>


                    <Pressable
                        style={[styles.ctaButton, isWeb && webClickableStyles]}
                        onPress={() => router.push('/')}
                        accessibilityRole="button"
                    >
                        <Text style={styles.ctaButtonText}>Calculate Your Correct Child Support →</Text>
                    </Pressable>

                    <View style={styles.keyPointBox}>
                        <Text style={styles.keyPointTitle}>💡 Key Point:</Text>
                        <Text style={styles.keyPointText}>
                            Services Australia will recover overpayments from the receiving parent if your assessment
                            was reduced retroactively. However, voluntary overpayments (paying more than required) are
                            harder to recover.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Can I get a refund if I overpaid child support in Australia?</Text>
                    <Text style={styles.paragraph}>
                        Yes, you can get a refund if you overpaid child support in Australia, but only in specific circumstances. If your assessment was reduced retroactively and you overpaid based on the higher assessment, Services Australia will credit the overpayment against future payments or issue a refund. However, if you voluntarily paid more than required (goodwill payments or calculation errors on your part), refunds are difficult to obtain and may require legal action.
                    </Text>

                    <Text style={styles.h2} accessibilityRole="header">What Causes Child Support Overpayments?</Text>
                    <Text style={styles.paragraph}>
                        Overpayments occur when you pay more child support than your assessment requires. This is
                        different from{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/child-support-arrears-australia')}
                        >
                            child support arrears
                        </Text>
                        , where you've underpaid.
                    </Text>

                    <View style={styles.causeCard}>
                        <Text style={styles.causeTitle}>1. Assessment Reduced Retroactively</Text>
                        <Text style={styles.causeText}>
                            Your income was reassessed and reduced for past periods. You already paid based on the
                            higher assessment, creating an overpayment.
                        </Text>
                        <Text style={styles.causeExample}>
                            Example: Assessment was $2,000/month. You paid $24,000 for the year. Assessment later
                            reduced to $1,500/month retroactively. Overpayment: $6,000.
                        </Text>
                    </View>

                    <View style={styles.causeCard}>
                        <Text style={styles.causeTitle}>2. Care Percentage Changed</Text>
                        <Text style={styles.causeText}>
                            Your care percentage increased but wasn't updated immediately. You continued paying the
                            higher amount based on old care arrangements.
                        </Text>
                        <Text style={styles.causeExample}>
                            Example: Care changed from 30% to 50% in January. You didn't update until June. Overpaid
                            for 5 months.
                        </Text>
                    </View>

                    <View style={styles.causeCard}>
                        <Text style={styles.causeTitle}>3. Calculation Errors</Text>
                        <Text style={styles.causeText}>
                            Services Australia made an error in calculating your assessment. Once corrected, you've
                            overpaid based on the incorrect assessment.
                        </Text>
                    </View>

                    <View style={styles.causeCard}>
                        <Text style={styles.causeTitle}>4. Voluntary Overpayment</Text>
                        <Text style={styles.causeText}>
                            You voluntarily paid more than required (goodwill, avoiding disputes, or calculation error
                            on your part). These are hardest to recover.
                        </Text>
                    </View>

                    <View style={styles.causeCard}>
                        <Text style={styles.causeTitle}>5. Child Turned 18 or Finished School</Text>
                        <Text style={styles.causeText}>
                            Child support ended but automatic payments continued. You overpaid for months after the
                            obligation ended.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">How to Claim an Overpayment Refund</Text>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>1</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Calculate the Overpayment</Text>
                            <Text style={styles.stepText}>
                                Review your payment history and assessments. Calculate exactly how much you overpaid
                                and for which periods.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>2</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Contact Services Australia</Text>
                            <Text style={styles.stepText}>
                                Call Services Australia (131 272) or submit a written request explaining the overpayment.
                                Provide dates, amounts, and reasons.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>3</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Provide Evidence</Text>
                            <Text style={styles.stepText}>
                                Submit payment records, bank statements, assessment notices, and any correspondence
                                showing the overpayment.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>4</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Services Australia Reviews</Text>
                            <Text style={styles.stepText}>
                                They'll investigate the overpayment, verify your claim, and determine if a refund or
                                credit is appropriate.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>5</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Refund or Credit Applied</Text>
                            <Text style={styles.stepText}>
                                If approved, Services Australia will credit the overpayment against future payments or
                                issue a refund if child support has ended.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.evidenceCard}>
                        <Text style={styles.evidenceTitle}>Evidence to Provide:</Text>
                        <Text style={styles.bulletItem}>• Payment receipts or bank statements</Text>
                        <Text style={styles.bulletItem}>• Assessment notices (old and new)</Text>
                        <Text style={styles.bulletItem}>• Care percentage change documentation</Text>
                        <Text style={styles.bulletItem}>• Communication with Services Australia</Text>
                        <Text style={styles.bulletItem}>• Calculation showing overpayment amount</Text>
                    </View>

                    <Pressable
                        style={[styles.ctaButton, isWeb && webClickableStyles]}
                        onPress={() => router.push('/lawyer-inquiry?mode=direct')}
                        accessibilityRole="button"
                    >
                        <Text style={styles.ctaButtonText}>Get Legal Help With Overpayments →</Text>
                    </Pressable>

                    <Text style={styles.h2} accessibilityRole="header">How Services Australia Handles Overpayments</Text>
                    <Text style={styles.paragraph}>
                        Once Services Australia confirms an overpayment, they have several options:
                    </Text>

                    <View style={styles.optionCard}>
                        <Text style={styles.optionTitle}>Option 1: Credit Against Future Payments</Text>
                        <Text style={styles.optionText}>
                            The overpayment is credited to your account. Your future child support payments are reduced
                            until the credit is exhausted.
                        </Text>
                        <Text style={styles.optionExample}>
                            Overpayment: $6,000 | Current assessment: $2,000/month | Next 3 months: $0 payment
                        </Text>
                    </View>

                    <View style={styles.optionCard}>
                        <Text style={styles.optionTitle}>Option 2: Direct Refund</Text>
                        <Text style={styles.optionText}>
                            If child support has ended or you have no ongoing obligation, Services Australia issues a
                            direct refund to you.
                        </Text>
                    </View>

                    <View style={styles.optionCard}>
                        <Text style={styles.optionTitle}>Option 3: Recovery from Receiving Parent</Text>
                        <Text style={styles.optionText}>
                            Services Australia recovers the overpayment from the receiving parent by reducing their
                            future payments or requesting direct repayment.
                        </Text>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Important:</Text>
                        <Text style={styles.warningText}>
                            The receiving parent cannot refuse to repay an overpayment if Services Australia determines
                            one exists. Even if they already spent the money, they must repay it.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Voluntary Overpayments: Can You Get Them Back?</Text>
                    <Text style={styles.paragraph}>
                        If you voluntarily paid more than your assessment required, recovering the overpayment is difficult:
                    </Text>

                    <View style={styles.voluntaryCard}>
                        <Text style={styles.voluntaryTitle}>When Voluntary Overpayments Are Recoverable:</Text>
                        <Text style={styles.bulletItem}>• You made a genuine calculation error</Text>
                        <Text style={styles.bulletItem}>• The receiving parent agreed to repay</Text>
                        <Text style={styles.bulletItem}>• You can prove the payment was a mistake (not a gift)</Text>
                    </View>

                    <View style={styles.voluntaryCard}>
                        <Text style={styles.voluntaryTitle}>When Voluntary Overpayments Are NOT Recoverable:</Text>
                        <Text style={styles.bulletItem}>• You paid extra as goodwill or to avoid conflict</Text>
                        <Text style={styles.bulletItem}>• You agreed to pay more in a private arrangement</Text>
                        <Text style={styles.bulletItem}>• The receiving parent relied on the extra payments</Text>
                    </View>

                    <View style={styles.adviceBox}>
                        <Text style={styles.adviceTitle}>💡 Legal Advice Needed:</Text>
                        <Text style={styles.adviceText}>
                            If you voluntarily overpaid and the receiving parent won't repay, you may need to take legal
                            action. Consult a family lawyer to assess your options.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">How to Avoid Overpaying Child Support</Text>

                    <View style={styles.preventionCard}>
                        <Text style={styles.preventionNumber}>1</Text>
                        <View style={styles.preventionContent}>
                            <Text style={styles.preventionTitle}>Check Your Assessment Regularly</Text>
                            <Text style={styles.preventionText}>
                                Review your child support assessment every 3-6 months. Ensure the income, care percentage,
                                and number of children are correct.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.preventionCard}>
                        <Text style={styles.preventionNumber}>2</Text>
                        <View style={styles.preventionContent}>
                            <Text style={styles.preventionTitle}>Update Care Changes Immediately</Text>
                            <Text style={styles.preventionText}>
                                If care arrangements change, notify Services Australia within 28 days. Don't wait—every
                                month you delay is a month you might overpay.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.preventionCard}>
                        <Text style={styles.preventionNumber}>3</Text>
                        <View style={styles.preventionContent}>
                            <Text style={styles.preventionTitle}>Report Income Changes</Text>
                            <Text style={styles.preventionText}>
                                If your income drops significantly, apply for a reassessment immediately. Don't continue
                                paying based on old income.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.preventionCard}>
                        <Text style={styles.preventionNumber}>4</Text>
                        <View style={styles.preventionContent}>
                            <Text style={styles.preventionTitle}>Stop Automatic Payments When Child Support Ends</Text>
                            <Text style={styles.preventionText}>
                                When your child turns 18 or finishes school, cancel automatic payments immediately.
                                Verify with Services Australia that your obligation has ended.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.preventionCard}>
                        <Text style={styles.preventionNumber}>5</Text>
                        <View style={styles.preventionContent}>
                            <Text style={styles.preventionTitle}>Don't Pay Extra Without Agreement</Text>
                            <Text style={styles.preventionText}>
                                If you want to pay more than required, formalize it through a Binding Child Support
                                Agreement. Otherwise, you may not be able to recover overpayments.
                            </Text>
                        </View>
                    </View>

                    {/* Contextual Wizard */}
                    <ContextualWizard
                        preselectedFactors={['overpayment_issue']}
                        highlightedFactors={['income_resources_not_reflected']}
                        blogTopic="overpayment"
                        ctaText="Resolve Overpayment Issues"
                        analyticsSource="blog_child_support_overpayment_refund"
                        formReason="special_circumstances"
                        title="Dealing With an Overpayment?"
                        description="Professional advice can help you recover overpayments or challenge incorrect assessments. Select any factors that apply."
                    />

                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <FAQItem
                        question="Can I get a refund if I overpaid child support in Australia?"
                        answer="Yes, but only in specific circumstances. If your assessment was reduced retroactively and you overpaid, Services Australia will credit the overpayment against future payments or refund it. However, if you voluntarily paid more than required, refunds are difficult to obtain."
                    />

                    <FAQItem
                        question="How long do I have to claim a child support overpayment?"
                        answer="You should claim overpayments as soon as you discover them. Services Australia typically reviews overpayments for the current assessment period and up to 18 months prior. Waiting longer may limit your recovery options."
                    />

                    <FAQItem
                        question="What if the receiving parent spent the overpayment?"
                        answer="If Services Australia determines you overpaid, they will recover it from the receiving parent—even if they already spent it. The receiving parent may have to repay through reduced future payments or direct repayment to Services Australia."
                    />

                    <FAQItem
                        question="Can I sue the receiving parent for overpayments?"
                        answer="Only if the overpayment was voluntary and not through Services Australia. If you paid extra directly to the other parent and they won't repay, you may need to take civil legal action. Consult a lawyer first."
                    />

                    <FAQItem
                        question="What if Services Australia refuses to refund my overpayment?"
                        answer="You can request an internal review of their decision. If still denied, you can appeal to the Administrative Appeals Tribunal (AAT). Get legal advice before appealing."
                    />

                    <View style={styles.calculatorSection}>
                        <Text style={styles.calculatorTitle}>Calculate Your Correct Child Support</Text>
                        <Text style={styles.calculatorText}>
                            Use our free calculator to verify your child support assessment. This helps you avoid
                            overpaying and ensures you're paying the correct amount.
                        </Text>
                        <Pressable
                            style={[styles.calculatorButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.calculatorButtonText}>Calculate Now</Text>
                        </Pressable>
                    </View>

                    <View style={styles.finalCtaSection}>
                        <Text style={styles.finalCtaTitle}>Need Help Recovering Overpayments?</Text>
                        <Text style={styles.finalCtaText}>
                            Connect with experienced family lawyers who can help you claim overpayments, challenge
                            Services Australia decisions, or negotiate with the other parent. Most offer free initial
                            consultations with no obligation to proceed.
                        </Text>
                        <Pressable
                            style={[styles.primaryButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.primaryButtonText}>Get Legal Help</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
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
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 32 },
    articleHeader: { marginBottom: 24 },
    category: { fontSize: 14, fontWeight: '600', color: '#2563EB', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
    h1: { fontSize: 32, fontWeight: '700', color: '#1e3a8a', marginBottom: 12, ...(Platform.OS === 'web' ? { lineHeight: 40 } : {}) },
    publishDate: { fontSize: 14, color: '#64748b' },
    intro: { fontSize: 18, lineHeight: 28, color: '#334155', marginBottom: 16, fontWeight: '500' },
    h2: { fontSize: 24, fontWeight: '700', color: '#1e3a8a', marginTop: 32, marginBottom: 16, ...(Platform.OS === 'web' ? { lineHeight: 32 } : {}) },
    paragraph: { fontSize: 16, lineHeight: 26, color: '#475569', marginBottom: 16 },
    bulletItem: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8, paddingLeft: 8 },


    quickAnswerBox: { backgroundColor: '#22c55e', borderRadius: 12, padding: 20, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#22c55e', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    quickAnswerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
    quickAnswerText: { fontSize: 15, lineHeight: 24, color: '#ffffff', marginBottom: 16, textAlign: 'center' },
    quickAnswerButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
    quickAnswerButtonText: { color: '#22c55e', fontSize: 16, fontWeight: '700' },

    keyPointBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderWidth: 2, borderColor: '#3b82f6', padding: 20, marginBottom: 24, ...createShadow({ shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }) },
    keyPointTitle: { fontSize: 18, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
    keyPointText: { fontSize: 15, lineHeight: 24, color: '#1e40af' },

    causeCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    causeTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    causeText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8 },
    causeExample: { fontSize: 14, lineHeight: 22, color: '#64748b', fontStyle: 'italic', paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },

    stepCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    stepNumber: { fontSize: 24, fontWeight: '700', color: '#2563EB', marginRight: 16, width: 32 },
    stepContent: { flex: 1 },
    stepTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    stepText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    evidenceCard: { backgroundColor: '#f0f9ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bae6fd' },
    evidenceTitle: { fontSize: 16, fontWeight: '700', color: '#0c4a6e', marginBottom: 12 },

    optionCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    optionTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    optionText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8 },
    optionExample: { fontSize: 14, lineHeight: 22, color: '#64748b', fontStyle: 'italic', paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: '#10b981' },

    warningBox: { backgroundColor: '#fef3c7', borderRadius: 12, borderWidth: 1, borderColor: '#fbbf24', padding: 16, marginBottom: 16 },
    warningTitle: { fontSize: 16, fontWeight: '700', color: '#92400e', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#92400e' },

    voluntaryCard: { backgroundColor: '#f5f3ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#c4b5fd' },
    voluntaryTitle: { fontSize: 16, fontWeight: '700', color: '#5b21b6', marginBottom: 12 },

    adviceBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderWidth: 1, borderColor: '#3b82f6', padding: 16, marginBottom: 16 },
    adviceTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
    adviceText: { fontSize: 15, lineHeight: 24, color: '#1e40af' },

    preventionCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    preventionNumber: { fontSize: 24, fontWeight: '700', color: '#10b981', marginRight: 16, width: 32 },
    preventionContent: { flex: 1 },
    preventionTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    preventionText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    ctaButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 24, marginVertical: 16, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    ctaButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },

    faqItem: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    faqQuestion: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    faqAnswer: { fontSize: 15, lineHeight: 24, color: '#475569' },

    calculatorSection: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 24, marginTop: 32, marginBottom: 16, alignItems: 'center' },
    calculatorTitle: { fontSize: 20, fontWeight: '700', color: '#1e3a8a', marginBottom: 8, textAlign: 'center' },
    calculatorText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 20, textAlign: 'center' },
    calculatorButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24, ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    calculatorButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },

    finalCtaSection: { backgroundColor: '#1e3a8a', borderRadius: 12, padding: 24, marginTop: 16, alignItems: 'center' },
    finalCtaTitle: { fontSize: 20, fontWeight: '700', color: '#ffffff', marginBottom: 8, textAlign: 'center' },
    finalCtaText: { fontSize: 15, lineHeight: 24, color: '#e0e7ff', marginBottom: 20, textAlign: 'center' },
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 16, fontWeight: '600' },
    inlineLink: { color: '#2563EB', fontWeight: '600', textDecorationLine: 'underline' },
});
