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
            name: 'Do I still pay child support if I\'m on Centrelink?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, but the amount is usually minimal. If you receive income support (JobSeeker, DSP, Parenting Payment), you typically pay ~$10.60/week total (Minimum Annual Rate). This covers all children in your case, not per child. Services Australia applies this minimum rate when your income is low.',
            },
        },
        {
            '@type': 'Question',
            name: 'How much child support do I pay on JobSeeker?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'On JobSeeker, you typically pay the Minimum Annual Rate (2026: $551/year or ~$10.60/week). This amount is usually per family/case, not per child. If you have 0% care, expect to pay this minimum. With 14% or more care, the minimum rate may still apply depending on the other parent\'s income.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Child Support and Centrelink: How Income Support Affects Payments',
    description: 'On JobSeeker, DSP, or Parenting Payment? Learn how Centrelink income support affects child support. Understand the Minimum Annual Rate, payment amounts, and your obligations.',
    datePublished: '2026-01-24',
    author: { '@type': 'Organization', name: 'AusChildSupport' },
};

export default function ChildSupportCentrelinkBlogPost() {
    const router = useRouter();
    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="Child Support on Centrelink 2026 | Income Support"
                description="On Centrelink? You still pay child support—typically ~$10.60/week total (Minimum Annual Rate). See 2026 rates + your exact obligations. Calculate in 5 minutes."
                canonicalPath="/blog/child-support-centrelink-income-support"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Centrelink & Income Support' },
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
                        <Text style={styles.category}>Income Support</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            Child Support and Centrelink: How Income Support Affects Payments
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        On JobSeeker, DSP, or Parenting Payment? You still owe child support—but the amount is usually
                        minimal. Services Australia applies a <strong>Minimum Annual Rate</strong> for parents on income support.
                        Here's how it works, what you'll pay, and your obligations.
                    </Text>

                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            Receiving Centrelink payments? You pay minimum child support (<Text style={{ fontWeight: '700' }}>$551/year in 2026</Text>) regardless of income. This covers all children in the case (not per child). When you return to work, payments increase based on actual income.
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
                            Being on Centrelink doesn't eliminate child support. You typically pay ~$10.60/week total.
                            This is automatically deducted from your Centrelink payment if you're registered with
                            Services Australia.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">How the Minimum Rate Works (Income Support)</Text>
                    <Text style={styles.paragraph}>
                        When you receive income support, your income is usually below the self-support amount.
                        Instead of the standard formula, Services Australia applies the <strong>Minimum Annual Rate (MAR)</strong>.
                    </Text>

                    <View style={styles.formulaCard}>
                        <Text style={styles.formulaTitle}>Minimum Rate Calculation (2026):</Text>
                        <Text style={styles.bulletItem}>• Fixed annual amount: $551 per year</Text>
                        <Text style={styles.bulletItem}>• Approx. $10.60 per week</Text>
                        <Text style={styles.bulletItem}>• Applies <strong>per case</strong> (not per child)</Text>
                        <Text style={styles.bulletItem}>• Automatically deducted from Centrelink payment</Text>
                    </View>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Example: Parent on JobSeeker</Text>
                        <Text style={styles.exampleText}>Parent A: JobSeeker ($750/fortnight)</Text>
                        <Text style={styles.exampleText}>Parent B: Working ($60,000/year)</Text>
                        <Text style={styles.exampleText}>2 children, Parent A has 0% care</Text>
                        <Text style={styles.exampleResult}>Parent A pays: ~$10.60/week ($551/year)</Text>
                        <Text style={styles.exampleNote}>*Flat rate for the whole case, not $21.20</Text>
                    </View>

                    {/* Featured Snippet Opportunity */}
                    <Text style={styles.h2} accessibilityRole="header">What Is the Minimum Child Support Payment?</Text>
                    <Text style={styles.paragraph}>
                        The minimum annual child support rate in Australia for 2026 is <strong>$551 per year</strong>. This minimum rate applies if your income is below the self-support amount or if you are on income support payments like JobSeeker. It ensures every parent contributes at least a small amount towards their children's costs.
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
                            <Text style={[styles.tableCell, { flex: 1.5, fontWeight: '700', color: '#2563EB' }]}>~$10.60/week</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Depends on care %. 0% care = higher end</Text>
                        </View>

                        <View style={[styles.tableRow, styles.tableRowAlt]}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Disability Support Pension (DSP)</Text>
                            <Text style={[styles.tableCell, { flex: 1.5, fontWeight: '700', color: '#2563EB' }]}>~$10.60/week</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Same as JobSeeker. Minimum rate applies</Text>
                        </View>

                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Parenting Payment Single</Text>
                            <Text style={[styles.tableCell, { flex: 1.5, fontWeight: '700', color: '#2563EB' }]}>~$10.60/week</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>For children from other relationships</Text>
                        </View>

                        <View style={[styles.tableRow, styles.tableRowAlt]}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Age Pension</Text>
                            <Text style={[styles.tableCell, { flex: 1.5, fontWeight: '700', color: '#2563EB' }]}>~$10.60/week</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Rare but possible if children under 18</Text>
                        </View>
                    </View>

                    <View style={styles.keyFactBox}>
                        <Text style={styles.keyFactTitle}>💡 All Income Support Types:</Text>
                        <Text style={styles.keyFactText}>
                            All income support payments result in the same minimum child support amount ($551/year per case) because they all trigger the Minimum Annual Rate assessment, regardless of your other income (as long as it's low).
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
                        <Text style={styles.bulletItem}>2. Assessment switches from Minimum Rate to Formula 1</Text>
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
                            is still ~$10.60/week. If care is equal (50/50), no child support is payable.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>Part-Time Work + Centrelink</Text>
                        <Text style={styles.scenarioText}>
                            If you work part-time and receive partial income support, Services Australia assesses your
                            total income (wages + Centrelink). You may pay more than the minimum rate but less than
                            full Formula 1 based on a higher income.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>Temporary Income Support</Text>
                        <Text style={styles.scenarioText}>
                            Short-term JobSeeker (3-6 months) still triggers the minimum rate. When you return to work,
                            assessment reverts to standard Formula 1 calculation. Notify Services Australia immediately to avoid arrears.
                        </Text>
                    </View>

                    <FAQItem
                        question="Do I still pay child support if I'm on Centrelink?"
                        answer="Yes, but the amount is usually minimal. If you receive income support (JobSeeker, DSP, Parenting Payment), you typically pay ~$10.60/week total. Services Australia applies the Minimum Annual Rate which accounts for your low income. You cannot avoid child support by being on Centrelink."
                    />

                    <FAQItem
                        question="How much child support do I pay on JobSeeker?"
                        answer="On JobSeeker, you typically pay the Minimum Annual Rate ($551/year in 2026, or ~$10.60/week). This covers your whole case (all children). It is not per child."
                    />

                    <View style={styles.internalLinkBox}>
                        <Text style={styles.internalLinkTitle}>📚 Related Reading:</Text>
                        <Pressable
                            style={[styles.internalLink, isWeb && webClickableStyles]}
                            accessibilityRole="link" onPress={() => router.push('/blog/child-support-arrears-australia')}
                        >
                            <Text style={styles.internalLinkText}>
                                Child Support Arrears: Collection & Enforcement →
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.internalLink, isWeb && webClickableStyles]}
                            accessibilityRole="link" onPress={() => router.push('/blog/object-to-child-support-assessment')}
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
                            Calculations can be confusing. Connect with family lawyers who understand income
                            support and child support interactions. Most offer free initial consultations with no
                            obligation to proceed.
                        </Text>
                        <View style={styles.trustSignalsBox}>
                            <Text style={styles.trustSignalItem}>✓ Specialists in income support cases</Text>
                            <Text style={styles.trustSignalItem}>✓ Free initial consultations available</Text>
                            <Text style={styles.trustSignalItem}>✓ Help with Minimum Rate assessments</Text>
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


    quickAnswerBox: { backgroundColor: '#2563eb', borderRadius: 12, padding: 20, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    quickAnswerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
    quickAnswerText: { fontSize: 15, lineHeight: 24, color: '#ffffff', marginBottom: 16, textAlign: 'center' },
    quickAnswerButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
    quickAnswerButtonText: { color: '#2563eb', fontSize: 16, fontWeight: '700' },

    keyFactBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderWidth: 2, borderColor: '#2563EB', padding: 20, marginBottom: 24, ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    keyFactTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    keyFactText: { fontSize: 15, lineHeight: 24, color: '#1e3a8a' },

    formulaCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    formulaTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },

    exampleCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    exampleTitle: { fontSize: 15, fontWeight: '600', color: '#1e40af', marginBottom: 8 },
    exampleText: { fontSize: 14, color: '#475569', marginBottom: 4 },
    exampleResult: { fontSize: 16, fontWeight: '700', color: '#2563eb', marginTop: 8, marginBottom: 4 },
    exampleNote: { fontSize: 13, color: '#64748b', fontStyle: 'italic' },

    paymentCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 }) },
    paymentTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 4 },
    paymentAmount: { fontSize: 20, fontWeight: '700', color: '#2563EB', marginBottom: 4 },
    paymentNote: { fontSize: 13, color: '#64748b' },

    transitionCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    transitionTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },

    warningBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#f59e0b', padding: 16, marginBottom: 16 },
    warningTitle: { fontSize: 15, fontWeight: '600', color: '#1e40af', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#475569' },

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
    trustSignalItem: { fontSize: 14, color: '#bfdbfe', marginBottom: 8, lineHeight: 20 },

    // Table styles
    tableContainer: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }) },
    tableTitle: { fontSize: 18, fontWeight: '700', color: '#1e3a8a', marginBottom: 16, textAlign: 'center' },
    tableHeaderRow: { flexDirection: 'row', backgroundColor: '#eff6ff', borderRadius: 8, padding: 12, marginBottom: 8 },
    tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    tableRowAlt: { backgroundColor: '#f8fafc' },
    tableCell: { fontSize: 14, lineHeight: 20, color: '#475569', paddingHorizontal: 4 },
    tableHeaderCell: { fontWeight: '700', color: '#1e3a8a', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 },
});
