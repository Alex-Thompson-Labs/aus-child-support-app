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
            name: 'Do I still pay child support if I\'m on Centrelink?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, but the amount is usually minimal. If you receive income support (JobSeeker, DSP, Parenting Payment), you typically pay $5-10/week per child. Services Australia uses Formula 2 which accounts for income support. You cannot avoid child support by being on Centrelink.',
            },
        },
        {
            '@type': 'Question',
            name: 'How much child support do I pay on JobSeeker?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'On JobSeeker (2026 rate: ~$750/fortnight), you typically pay $5-10/week per child depending on care arrangement. This is calculated using Formula 2. If you have 0% care, expect $10/week per child. With some care (14%+), payments reduce further.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Child Support and Centrelink: How Income Support Affects Payments',
    description: 'On JobSeeker, DSP, or Parenting Payment? Learn how Centrelink income support affects child support. Understand Formula 2, payment amounts, and your obligations.',
    datePublished: '2026-01-24',
    author: { '@type': 'Organization', name: 'AusChildSupport' },
};

export default function ChildSupportCentrelinkBlogPost() {
    const router = useRouter();
    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="Child Support and Centrelink Australia 2026: Income Support Payments"
                description="On Centrelink? You still pay child support—but only $5-10/week per child. See Formula 2 calculation + your exact amount. Calculate in 5 minutes."
                canonicalPath="/blog/child-support-centrelink-income-support"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Centrelink & Income Support' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Income Support</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            Child Support and Centrelink: How Income Support Affects Payments
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        On JobSeeker, DSP, or Parenting Payment? You still owe child support—but the amount is usually
                        minimal. Services Australia uses a special formula (Formula 2) for parents on income support.
                        Here's how it works, what you'll pay, and your obligations.
                    </Text>

                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            Receiving Centrelink payments? You pay minimum child support (<Text style={styles.intro}>
                        On JobSeeker, DSP, or Parenting Payment? You still owe child support—but the amount is usually
                        minimal. Services Australia uses a special formula (Formula 2) for parents on income support.
                        Here's how it works, what you'll pay, and your obligations.
                    </Text>,815/year in 2026) regardless of income. When you return to work, payments increase based on actual income. Calculate your amount below.
                        </Text>
                        <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.quickAnswerButtonText}>Calculate Your Amount →</Text>
                        </Pressable>
                    </View>


                    <Pressable style={[styles.calculatorButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                        <Text style={styles.calculatorButtonText}>Calculate Your Child Support →</Text>
                    </Pressable>

                    <View style={styles.keyFactBox}>
                        <Text style={styles.keyFactTitle}>💡 Key Fact:</Text>
                        <Text style={styles.keyFactText}>
                            Being on Centrelink doesn't eliminate child support. You typically pay $5-10/week per child.
                            This is automatically deducted from your Centrelink payment if you're registered with
                            Services Australia.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">How Formula 2 Works (Income Support)</Text>
                    <Text style={styles.paragraph}>
                        When one or both parents receive income support, Services Australia uses Formula 2 instead of
                        the standard formula. This recognizes that income support recipients have limited capacity to pay.
                    </Text>

                    <View style={styles.formulaCard}>
                        <Text style={styles.formulaTitle}>Formula 2 Calculation:</Text>
                        <Text style={styles.bulletItem}>• Fixed rate per child (not income-based)</Text>
                        <Text style={styles.bulletItem}>• Adjusted for care percentage</Text>
                        <Text style={styles.bulletItem}>• Typically $5-10/week per child</Text>
                        <Text style={styles.bulletItem}>• Automatically deducted from Centrelink payment</Text>
                    </View>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Example: Parent on JobSeeker</Text>
                        <Text style={styles.exampleText}>Parent A: JobSeeker ($750/fortnight)</Text>
                        <Text style={styles.exampleText}>Parent B: Working ($60,000/year)</Text>
                        <Text style={styles.exampleText}>2 children, Parent A has 0% care</Text>
                        <Text style={styles.exampleResult}>Parent A pays: ~$20/week ($87/month)</Text>
                        <Text style={styles.exampleNote}>Deducted automatically from JobSeeker payment</Text>
                    </View>

                    {/* Featured Snippet Opportunity */}
                    <Text style={styles.h2} accessibilityRole="header">What Is the Minimum Child Support Payment?</Text>
                    <Text style={styles.paragraph}>
                        The minimum annual child support rate in Australia for 2026 is approximately $524 per year (indexed annually). This minimum rate applies if your income is below the self-support amount or if you are on income support payments like JobSeeker. It ensures every parent contributes at least a small amount towards their children's costs.
                    </Text>

                    <Text style={styles.h2} accessibilityRole="header">Payment Amounts by Income Support Type</Text>

                    <View style={styles.tableContainer}>
                        <Text style={styles.tableTitle}>Child Support on Centrelink: Payment Amounts (2026)</Text>
                        
                        <View style={styles.tableHeaderRow}>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 2 }]}>Income Support Type</Text>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1.5 }]}>Amount Per Child</Text>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 2 }]}>Notes</Text>
                        </View>

                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>JobSeeker Payment</Text>
                            <Text style={[styles.tableCell, { flex: 1.5, fontWeight: '700', color: '#2563EB' }]}>$5-10/week</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Depends on care %. 0% care = higher end</Text>
                        </View>

                        <View style={[styles.tableRow, styles.tableRowAlt]}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Disability Support Pension (DSP)</Text>
                            <Text style={[styles.tableCell, { flex: 1.5, fontWeight: '700', color: '#2563EB' }]}>$5-10/week</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Same as JobSeeker. Formula 2 applies</Text>
                        </View>

                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Parenting Payment Single</Text>
                            <Text style={[styles.tableCell, { flex: 1.5, fontWeight: '700', color: '#2563EB' }]}>$5-10/week</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>For children from other relationships</Text>
                        </View>

                        <View style={[styles.tableRow, styles.tableRowAlt]}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Age Pension</Text>
                            <Text style={[styles.tableCell, { flex: 1.5, fontWeight: '700', color: '#2563EB' }]}>$5-10/week</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Rare but possible if children under 18</Text>
                        </View>
                    </View>

                    <View style={styles.keyFactBox}>
                        <Text style={styles.keyFactTitle}>💡 All Income Support Types:</Text>
                        <Text style={styles.keyFactText}>
                            All income support payments result in similar child support amounts ($5-10/week per child) because they all trigger Formula 2, which uses fixed rates rather than income-based calculations.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">What Happens When You Return to Work</Text>
                    <Text style={styles.paragraph}>
                        When you stop receiving income support and return to work, your child support assessment changes.
                        Understanding{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/child-support-formula-australia')}
                        >
                            how the child support formula works
                        </Text>
                        {' '}helps you prepare for the transition.
                    </Text>

                    <View style={styles.transitionCard}>
                        <Text style={styles.transitionTitle}>Transition Process:</Text>
                        <Text style={styles.bulletItem}>1. Notify Services Australia of employment</Text>
                        <Text style={styles.bulletItem}>2. Assessment switches from Formula 2 to Formula 1</Text>
                        <Text style={styles.bulletItem}>3. Payments increase based on new income</Text>
                        <Text style={styles.bulletItem}>4. Change takes effect from next assessment period</Text>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Income Reporting:</Text>
                        <Text style={styles.warningText}>
                            You must report income changes to both Centrelink AND Services Australia. Failing to report
                            can result in overpayment debt (Centrelink) and underpayment arrears (child support).
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Common Scenarios</Text>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>Both Parents on Income Support</Text>
                        <Text style={styles.scenarioText}>
                            If both parents receive income support, the parent with less care pays the other. Amount
                            is still $5-10/week per child. If care is equal (50/50), no child support is payable.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>Part-Time Work + Centrelink</Text>
                        <Text style={styles.scenarioText}>
                            If you work part-time and receive partial income support, Services Australia assesses your
                            total income (wages + Centrelink). You may pay more than Formula 2 rates but less than
                            full Formula 1.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>Temporary Income Support</Text>
                        <Text style={styles.scenarioText}>
                            Short-term JobSeeker (3-6 months) still triggers Formula 2. When you return to work,
                            assessment reverts to Formula 1. Notify Services Australia immediately to avoid arrears.
                        </Text>
                    </View>

                    <FAQItem
                        question="Do I still pay child support if I'm on Centrelink?"
                        answer="Yes, but the amount is usually minimal. If you receive income support (JobSeeker, DSP, Parenting Payment), you typically pay $5-10/week per child. Services Australia uses Formula 2 which accounts for income support. You cannot avoid child support by being on Centrelink."
                    />

                    <FAQItem
                        question="How much child support do I pay on JobSeeker?"
                        answer="On JobSeeker (2026 rate: ~$750/fortnight), you typically pay $5-10/week per child depending on care arrangement. This is calculated using Formula 2. If you have 0% care, expect $10/week per child. With some care (14%+), payments reduce further."
                    />

                    <View style={styles.internalLinkBox}>
                        <Text style={styles.internalLinkTitle}>📚 Related Reading:</Text>
                        <Pressable
                            style={[styles.internalLink, isWeb && webClickableStyles]}
                            onPress={() => router.push('/blog/child-support-arrears-australia')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.internalLinkText}>
                                Child Support Arrears: Collection & Enforcement →
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.internalLink, isWeb && webClickableStyles]}
                            onPress={() => router.push('/blog/object-to-child-support-assessment')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.internalLinkText}>
                                How to Object to an Assessment →
                            </Text>
                        </Pressable>
                    </View>

                    <Pressable style={[styles.calculatorButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                        <Text style={styles.calculatorButtonText}>Calculate Your Child Support</Text>
                    </Pressable>

                    <View style={styles.finalCtaSection}>
                        <Text style={styles.finalCtaTitle}>Questions About Income Support & Child Support?</Text>
                        <Text style={styles.finalCtaText}>
                            Formula 2 calculations can be confusing. Connect with family lawyers who understand income
                            support and child support interactions. Most offer free initial consultations with no
                            obligation to proceed.
                        </Text>
                        <View style={styles.trustSignalsBox}>
                            <Text style={styles.trustSignalItem}>✓ Specialists in income support cases</Text>
                            <Text style={styles.trustSignalItem}>✓ Free initial consultations available</Text>
                            <Text style={styles.trustSignalItem}>✓ Help with Formula 2 assessments</Text>
                        </View>
                        <Pressable style={[styles.primaryButton, isWeb && webClickableStyles]} onPress={() => router.push('/lawyer-inquiry?mode=direct')} accessibilityRole="button">
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

    keyFactBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderWidth: 2, borderColor: '#2563EB', padding: 20, marginBottom: 24, ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    keyFactTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    keyFactText: { fontSize: 15, lineHeight: 24, color: '#1e3a8a' },

    formulaCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    formulaTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },

    exampleCard: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#86efac' },
    exampleTitle: { fontSize: 15, fontWeight: '600', color: '#14532d', marginBottom: 8 },
    exampleText: { fontSize: 14, color: '#14532d', marginBottom: 4 },
    exampleResult: { fontSize: 16, fontWeight: '700', color: '#22c55e', marginTop: 8, marginBottom: 4 },
    exampleNote: { fontSize: 13, color: '#64748b', fontStyle: 'italic' },

    paymentCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 }) },
    paymentTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 4 },
    paymentAmount: { fontSize: 20, fontWeight: '700', color: '#2563EB', marginBottom: 4 },
    paymentNote: { fontSize: 13, color: '#64748b' },

    transitionCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    transitionTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },

    warningBox: { backgroundColor: '#fef3c7', borderRadius: 12, borderWidth: 1, borderColor: '#fbbf24', padding: 16, marginBottom: 16 },
    warningTitle: { fontSize: 15, fontWeight: '600', color: '#78350f', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#78350f' },

    scenarioCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    scenarioTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    scenarioText: { fontSize: 14, lineHeight: 22, color: '#475569' },

    faqItem: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    faqQuestion: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    faqAnswer: { fontSize: 15, lineHeight: 24, color: '#475569' },

    calculatorButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 24, marginTop: 24, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    calculatorButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },

    inlineLink: { color: '#2563EB', fontWeight: '600', textDecorationLine: 'underline' },

    finalCtaSection: { backgroundColor: '#1e3a8a', borderRadius: 12, padding: 28, marginTop: 32, alignItems: 'center', ...createShadow({ shadowColor: '#1e3a8a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    finalCtaTitle: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 12, textAlign: 'center' },
    finalCtaText: { fontSize: 16, lineHeight: 26, color: '#bfdbfe', marginBottom: 24, textAlign: 'center' },
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 32, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 18, fontWeight: '700' },

    internalLinkBox: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginVertical: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    internalLinkTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },
    internalLink: { paddingVertical: 8 },
    internalLinkText: { fontSize: 15, color: '#2563EB', fontWeight: '500' },

    trustSignalsBox: { marginBottom: 24, alignItems: 'flex-start', width: '100%', maxWidth: 400 },
    trustSignalItem: { fontSize: 14, color: '#e0e7ff', marginBottom: 8, lineHeight: 20 },

    // Table styles
    tableContainer: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }) },
    tableTitle: { fontSize: 18, fontWeight: '700', color: '#1e3a8a', marginBottom: 16, textAlign: 'center' },
    tableHeaderRow: { flexDirection: 'row', backgroundColor: '#eff6ff', borderRadius: 8, padding: 12, marginBottom: 8 },
    tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    tableRowAlt: { backgroundColor: '#f8fafc' },
    tableCell: { fontSize: 14, lineHeight: 20, color: '#475569', paddingHorizontal: 4 },
    tableHeaderCell: { fontWeight: '700', color: '#1e3a8a', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 },
});
