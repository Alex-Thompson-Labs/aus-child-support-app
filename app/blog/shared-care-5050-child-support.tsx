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
            name: 'Do I still pay child support with 50/50 care in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, usually. Even with equal care (50/50), the higher-income parent typically pays child support to the lower-income parent. The amount depends on the income difference. Only if both parents earn exactly the same would child support be zero.',
            },
        },
        {
            '@type': 'Question',
            name: 'How is child support calculated for shared care 50/50?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'With 50/50 care, both parents have 50% care percentage and 50% cost percentage. The formula calculates each parent\'s income percentage, then subtracts their cost percentage. The parent with higher income pays the difference multiplied by total costs of children.',
            },
        },
        {
            '@type': 'Question',
            name: 'What if we have 50/50 care but different incomes?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'The higher-income parent pays child support to equalize the financial burden. Example: Parent A earns $100k, Parent B earns $50k. Even with 50/50 care, Parent A pays approximately $400-600/month to Parent B, depending on number and ages of children.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Shared Care 50/50 Child Support: How Equal Care Affects Payments',
    description: 'Have 50/50 care? Learn how shared care affects child support in Australia. Understand the formula, see real examples, and calculate your payments.',
    datePublished: '2026-01-24',
    author: { '@type': 'Organization', name: 'AusChildSupport' },
};

export default function SharedCare5050ChildSupportBlogPost() {
    const router = useRouter();

    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="Shared Care 50/50 Child Support: How Equal Care Affects Payments"
                description="Have 50/50 care? Learn how shared care affects child support in Australia. Understand the formula, see real examples, and calculate your payments."
                canonicalPath="/blog/shared-care-5050-child-support"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Shared Care 50/50' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Shared Care</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            Shared Care 50/50 Child Support: How Equal Care Affects Payments
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        Have 50/50 care and wondering about child support? Many parents assume equal care means
                        no child support. That's rarely true. Even with shared care, the higher-income parent usually
                        pays. Here's how the formula works, real examples, and what to do if you disagree about care
                        percentages.
                    </Text>

                    <View style={styles.mythBox}>
                        <Text style={styles.mythTitle}>❌ Common Myth</Text>
                        <Text style={styles.mythText}>
                            "50/50 care means no child support." FALSE. Child support equalizes the financial
                            burden between parents. Unless both parents earn exactly the same income, the higher
                            earner pays child support even with equal care.
                        </Text>
                    </View>

                    {/* Featured Snippet Opportunity */}
                    <Text style={styles.h2} accessibilityRole="header">Does Child Support Change With 50/50 Custody?</Text>
                    <Text style={styles.paragraph}>
                        Yes, child support changes with 50/50 custody, but it rarely drops to zero. In Australia, payments are based on the income difference between parents. Even with equal care (183 nights each), the higher-income parent typically pays the lower-income parent to equalize the detailed costs of raising children.
                    </Text>

                    <Text style={styles.paragraph}>
                        With equal care (183 nights each per year), both parents have:
                    </Text>

                    <View style={styles.percentageCard}>
                        <Text style={styles.percentageTitle}>50/50 Care Breakdown:</Text>
                        <Text style={styles.bulletItem}>• Care percentage: 50% each</Text>
                        <Text style={styles.bulletItem}>• Cost percentage: 50% each</Text>
                        <Text style={styles.bulletItem}>• Income percentage: Based on actual income</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        The formula calculates: (Income % - Cost %) × Total Costs
                    </Text>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Example: Equal Care, Different Income</Text>
                        <Text style={styles.exampleText}>Parent A: $100,000 income, 50% care</Text>
                        <Text style={styles.exampleText}>Parent B: $50,000 income, 50% care</Text>
                        <Text style={styles.exampleText}>2 children (ages 6, 9)</Text>
                        <Text style={styles.exampleCalc}>Combined child support income: $87,908</Text>
                        <Text style={styles.exampleCalc}>Parent A income %: 67%</Text>
                        <Text style={styles.exampleCalc}>Parent B income %: 33%</Text>
                        <Text style={styles.exampleCalc}>Total costs: $19,500</Text>
                        <Text style={styles.exampleCalc}>Parent A: (67% - 50%) × $19,500 = $3,315/year</Text>
                        <Text style={styles.exampleResult}>Parent A pays $276/month to Parent B</Text>
                    </View>

                    <View style={styles.keyPointBox}>
                        <Text style={styles.keyPointTitle}>🔑 Key Point:</Text>
                        <Text style={styles.keyPointText}>
                            Child support with 50/50 care is based on income difference, not care difference. The
                            higher earner pays to equalize the financial burden of raising children.
                        </Text>
                    </View>

                    {/* Real Examples */}
                    <Text style={styles.h2} accessibilityRole="header">Real Examples: 50/50 Care with Different Incomes</Text>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>Scenario 1: Large Income Gap</Text>
                        <Text style={styles.scenarioText}>Parent A: $120,000 | Parent B: $40,000 | 50/50 care | 1 child (age 10)</Text>
                        <Text style={styles.scenarioCalc}>Combined income: $97,908</Text>
                        <Text style={styles.scenarioCalc}>Parent A: 76% income, 50% cost</Text>
                        <Text style={styles.scenarioCalc}>Parent B: 24% income, 50% cost</Text>
                        <Text style={styles.scenarioCalc}>Total costs: $11,200</Text>
                        <Text style={styles.scenarioResult}>Parent A pays: $2,912/year ($243/month)</Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>Scenario 2: Moderate Income Gap</Text>
                        <Text style={styles.scenarioText}>Parent A: $80,000 | Parent B: $60,000 | 50/50 care | 2 children (ages 5, 8)</Text>
                        <Text style={styles.scenarioCalc}>Combined income: $77,908</Text>
                        <Text style={styles.scenarioCalc}>Parent A: 56% income, 50% cost</Text>
                        <Text style={styles.scenarioCalc}>Parent B: 44% income, 50% cost</Text>
                        <Text style={styles.scenarioCalc}>Total costs: $18,500</Text>
                        <Text style={styles.scenarioResult}>Parent A pays: $1,110/year ($93/month)</Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>Scenario 3: Small Income Gap</Text>
                        <Text style={styles.scenarioText}>Parent A: $70,000 | Parent B: $65,000 | 50/50 care | 1 child (age 14)</Text>
                        <Text style={styles.scenarioCalc}>Combined income: $72,908</Text>
                        <Text style={styles.scenarioCalc}>Parent A: 52% income, 50% cost</Text>
                        <Text style={styles.scenarioCalc}>Parent B: 48% income, 50% cost</Text>
                        <Text style={styles.scenarioCalc}>Total costs: $10,800</Text>
                        <Text style={styles.scenarioResult}>Parent A pays: $216/year ($18/month)</Text>
                    </View>

                    <Pressable
                        style={[styles.calculatorButton, isWeb && webClickableStyles]}
                        onPress={() => router.push('/')}
                        accessibilityRole="button"
                    >
                        <Text style={styles.calculatorButtonText}>Calculate Your 50/50 Child Support →</Text>
                    </Pressable>

                    {/* Common Disputes */}
                    <Text style={styles.h2} accessibilityRole="header">Common 50/50 Care Disputes</Text>

                    <Text style={styles.h3} accessibilityRole="header">1. Disagreement About Actual Care</Text>
                    <Text style={styles.paragraph}>
                        One parent claims 50/50, the other says it's 60/40. This matters because care percentage directly affects child support. Learn more about{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/child-support-care-percentage-table')}
                        >
                            care percentage calculations
                        </Text>
                        .
                    </Text>

                    <View style={styles.impactCard}>
                        <Text style={styles.impactTitle}>Care Percentage Impact:</Text>
                        <Text style={styles.bulletItem}>• 50/50 (183 nights each): 50% care, 50% cost</Text>
                        <Text style={styles.bulletItem}>• 60/40 (219/146 nights): 60% care, 63% cost vs 40% care, 37% cost</Text>
                        <Text style={styles.bulletItem}>• Difference: Can change child support by $200-500/month</Text>
                    </View>

                    <View style={styles.tipBox}>
                        <Text style={styles.tipTitle}>💡 Evidence Matters:</Text>
                        <Text style={styles.tipText}>
                            Keep records: school pickup/dropoff logs, calendar entries, text messages confirming
                            arrangements. Services Australia may request evidence if care is disputed.
                        </Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">2. "I Pay for Everything" Argument</Text>
                    <Text style={styles.paragraph}>
                        Higher-income parent: "I already pay for school fees, sports, clothes. Why do I owe child support?"
                    </Text>

                    <View style={styles.answerBox}>
                        <Text style={styles.answerTitle}>The Formula's Answer:</Text>
                        <Text style={styles.answerText}>
                            Child support covers day-to-day costs (food, housing, utilities). School fees and
                            extracurriculars are separate. The formula assumes both parents contribute to daily costs
                            proportional to their income, regardless of who pays for extras.
                        </Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">3. "We Agreed No Child Support"</Text>
                    <Text style={styles.paragraph}>
                        Many 50/50 parents verbally agree "no child support." This isn't legally binding unless formalized. Learn more about{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/binding-child-support-agreement')}
                        >
                            binding child support agreements
                        </Text>
                        {' '}and how to protect yourself.
                    </Text>

                    <View style={styles.requirementCard}>
                        <Text style={styles.requirementTitle}>Legal Requirements:</Text>
                        <Text style={styles.bulletItem}>• Formalized as Binding Child Support Agreement</Text>
                        <Text style={styles.bulletItem}>• Both parties receive independent legal advice</Text>
                        <Text style={styles.bulletItem}>• Agreement registered with Services Australia</Text>
                        <Text style={styles.bulletItem}>• Meets minimum payment requirements</Text>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Verbal Agreements Don't Count:</Text>
                        <Text style={styles.warningText}>
                            Either parent can apply for Services Australia assessment at any time, regardless of
                            verbal agreements. The assessment will be backdated up to 18 months. Protect yourself
                            with a formal Binding Agreement.
                        </Text>
                    </View>

                    <Pressable
                        style={[styles.ctaButton, isWeb && webClickableStyles]}
                        onPress={() => router.push('/lawyer-inquiry?mode=direct')}
                        accessibilityRole="button"
                    >
                        <Text style={styles.ctaButtonText}>Get Legal Advice on Binding Agreements →</Text>
                    </Pressable>

                    <View style={styles.trustBox}>
                        <Text style={styles.trustBoxTitle}>💡 What to Expect:</Text>
                        <Text style={styles.trustBoxItem}>• Most lawyers respond within 24 hours</Text>
                        <Text style={styles.trustBoxItem}>• Initial consultations often free or low-cost</Text>
                        <Text style={styles.trustBoxItem}>• No obligation to proceed after consultation</Text>
                        <Text style={styles.trustBoxItem}>• Your information remains confidential</Text>
                    </View>

                    {/* FAQ */}
                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <FAQItem
                        question="Do I still pay child support with 50/50 care in Australia?"
                        answer="Yes, usually. Even with equal care (50/50), the higher-income parent typically pays child support to the lower-income parent. The amount depends on the income difference. Only if both parents earn exactly the same would child support be zero."
                    />

                    <FAQItem
                        question="How is child support calculated for shared care 50/50?"
                        answer="With 50/50 care, both parents have 50% care percentage and 50% cost percentage. The formula calculates each parent's income percentage, then subtracts their cost percentage. The parent with higher income pays the difference multiplied by total costs of children."
                    />

                    <FAQItem
                        question="What if we have 50/50 care but different incomes?"
                        answer="The higher-income parent pays child support to equalize the financial burden. Example: Parent A earns $100k, Parent B earns $50k. Even with 50/50 care, Parent A pays approximately $400-600/month to Parent B, depending on number and ages of children."
                    />

                    <FAQItem
                        question="Can we agree to no child support with 50/50 care?"
                        answer="Yes, but it must be formalized as a Binding Child Support Agreement. Verbal agreements aren't legally binding. Either parent can apply for Services Australia assessment at any time, which will override informal arrangements. Get legal advice to create a proper agreement."
                    />

                    <FAQItem
                        question="What if the other parent claims we don't have 50/50 care?"
                        answer="Services Australia may request evidence: school records, calendar entries, text messages confirming arrangements. If you can't prove 50/50, they'll assess based on documented care. Keep detailed records of actual overnight stays to support your claim."
                    />

                    {/* Final CTA */}
                    <View style={styles.finalCtaSection}>
                        <Text style={styles.finalCtaTitle}>Disputes About 50/50 Care or Child Support?</Text>
                        <Text style={styles.finalCtaText}>
                            Care percentage disputes can cost thousands per year. Connect with family lawyers who
                            specialize in shared care arrangements and can protect your rights.
                        </Text>
                        <View style={styles.trustSignals}>
                            <Text style={styles.trustSignalItem}>✓ Free initial consultation</Text>
                            <Text style={styles.trustSignalItem}>✓ Specialists in shared care disputes</Text>
                            <Text style={styles.trustSignalItem}>✓ Confidential case review</Text>
                        </View>
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
    h3: { fontSize: 20, fontWeight: '600', color: '#1e3a8a', marginTop: 24, marginBottom: 12, ...(Platform.OS === 'web' ? { lineHeight: 28 } : {}) },
    paragraph: { fontSize: 16, lineHeight: 26, color: '#475569', marginBottom: 16 },
    bulletItem: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8, paddingLeft: 8 },

    mythBox: { backgroundColor: '#fef2f2', borderRadius: 12, borderWidth: 2, borderColor: '#dc2626', padding: 20, marginBottom: 24, ...createShadow({ shadowColor: '#dc2626', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    mythTitle: { fontSize: 18, fontWeight: '700', color: '#991b1b', marginBottom: 8 },
    mythText: { fontSize: 15, lineHeight: 24, color: '#991b1b' },

    percentageCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    percentageTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },

    exampleCard: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#86efac', ...createShadow({ shadowColor: '#22c55e', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }) },
    exampleTitle: { fontSize: 15, fontWeight: '600', color: '#14532d', marginBottom: 8 },
    exampleText: { fontSize: 14, color: '#14532d', marginBottom: 4 },
    exampleCalc: { fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: '#14532d', marginBottom: 4, paddingLeft: 8 },
    exampleResult: { fontSize: 16, fontWeight: '700', color: '#22c55e', marginTop: 8 },

    keyPointBox: { backgroundColor: '#fef3c7', borderRadius: 12, borderWidth: 1, borderColor: '#fbbf24', padding: 16, marginBottom: 16 },
    keyPointTitle: { fontSize: 15, fontWeight: '600', color: '#78350f', marginBottom: 8 },
    keyPointText: { fontSize: 15, lineHeight: 24, color: '#78350f' },

    scenarioCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 }) },
    scenarioTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    scenarioText: { fontSize: 14, color: '#475569', marginBottom: 8 },
    scenarioCalc: { fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: '#64748b', marginBottom: 4, paddingLeft: 8 },
    scenarioResult: { fontSize: 15, fontWeight: '700', color: '#2563EB', marginTop: 8 },

    calculatorButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 24, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    calculatorButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },

    impactCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    impactTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },

    tipBox: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#86efac' },
    tipTitle: { fontSize: 15, fontWeight: '600', color: '#14532d', marginBottom: 8 },
    tipText: { fontSize: 15, lineHeight: 24, color: '#14532d' },

    answerBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    answerTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    answerText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    requirementCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    requirementTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },

    warningBox: { backgroundColor: '#fef3c7', borderRadius: 12, borderWidth: 1, borderColor: '#fbbf24', padding: 16, marginBottom: 16 },
    warningTitle: { fontSize: 15, fontWeight: '600', color: '#78350f', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#78350f' },

    ctaButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 24, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    ctaButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },

    faqItem: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    faqQuestion: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    faqAnswer: { fontSize: 15, lineHeight: 24, color: '#475569' },

    finalCtaSection: { backgroundColor: '#1e3a8a', borderRadius: 12, padding: 28, marginTop: 32, alignItems: 'center', ...createShadow({ shadowColor: '#1e3a8a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    finalCtaTitle: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 12, textAlign: 'center' },
    finalCtaText: { fontSize: 16, lineHeight: 26, color: '#bfdbfe', marginBottom: 24, textAlign: 'center' },
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 32, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 18, fontWeight: '700' },
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
