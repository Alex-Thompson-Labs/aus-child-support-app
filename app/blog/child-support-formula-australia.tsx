import { PageSEO } from '@/src/components/seo/PageSEO';
import { MAX_CALCULATOR_WIDTH, isWeb, webClickableStyles } from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// FAQ Schema
const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'What is the child support formula in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'The Australian child support formula is an 8-step calculation that considers both parents\' incomes, the cost of raising children (based on age and number), care percentages, and any relevant dependents. The formula determines each parent\'s income share and cost share, then calculates who pays whom based on the difference.',
            },
        },
        {
            '@type': 'Question',
            name: 'How does income affect child support in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Your Adjusted Taxable Income (ATI) determines your share of child support costs. After deducting the Self-Support Amount ($31,046 in 2026), your remaining income is compared to the other parent\'s to calculate your income percentage. Higher income means a higher percentage of costs you\'re expected to cover.',
            },
        },
        {
            '@type': 'Question',
            name: 'How does care percentage affect child support?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Care percentage determines your cost percentage—how much of the child\'s costs you\'re expected to cover through direct care. More care means lower child support payments. At 50/50 care, payments depend entirely on income difference. Below 14% care, you get no cost offset.',
            },
        },
        {
            '@type': 'Question',
            name: 'What is the Self-Support Amount in child support?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'The Self-Support Amount (SSA) is the minimum income each parent needs to support themselves. In 2026, it\'s $31,046 per year. This amount is deducted from each parent\'s income before calculating child support, ensuring parents can meet their own basic needs.',
            },
        },
    ],
};

// Article schema
const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Child Support Formula Australia: How Income & Care Work',
    description: 'Complete guide to the Australian child support formula. Learn the 8-step calculation, how income and care percentages affect payments, with real examples.',
    datePublished: '2026-01-24',
    dateModified: '2026-01-24',
    author: {
        '@type': 'Organization',
        name: 'AusChildSupport',
    },
};

export default function ChildSupportFormulaBlogPost() {
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
                title="Child Support Formula Australia: How Income & Care Work"
                description="Complete guide to the Australian child support formula. Learn the 8-step calculation, how income and care percentages affect payments, with real examples."
                canonicalPath="/blog/child-support-formula-australia"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Child Support Formula' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, webContainerStyle]}
                >
                    {/* Article Header */}
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Child Support</Text>
                        <Text
                            style={styles.h1}
                            accessibilityRole="header"
                            // @ts-ignore
                            aria-level="1"
                        >
                            Child Support Formula Australia: How Income & Care Work
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    {/* Introduction */}
                    <Text style={styles.intro}>
                        How does Services Australia calculate child support? Why does your payment change when income
                        or care arrangements change? The answer lies in the 8-step formula that determines every
                        Australian child support assessment.
                    </Text>

                    <Text style={styles.paragraph}>
                        This guide explains the Australian child support formula in plain English. You'll learn how
                        income and care percentages affect payments, what the Self-Support Amount means, and see
                        real examples showing exactly how the calculation works.
                    </Text>

                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightTitle}>📊 The Formula in One Sentence:</Text>
                        <Text style={styles.highlightText}>
                            Child support = (Your income share × Total child costs) - (Your care share × Total child costs)
                        </Text>
                    </View>

                    {/* Featured Snippet Opportunity */}
                    <Text
                        style={styles.h2}
                        accessibilityRole="header"
                        // @ts-ignore
                        aria-level="2"
                    >
                        What Is the Child Support Formula?
                    </Text>

                    <Text style={styles.paragraph}>
                        The Australian child support formula (Formula 1) calculates payments by comparing each parent's share of combined income against their share of care. Specifically, it involves 8 steps: determining child support income, combined income, income percentage, cost of children, care percentage, cost percentage, and finally applying the formula (Income % - Cost %) × Total Costs.
                    </Text>

                    <Text style={styles.paragraph}>
                        Services Australia uses this 8-step formula to calculate child support. Each step builds on
                        the previous one to determine the final payment amount.
                    </Text>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 1</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Calculate Each Parent's Child Support Income</Text>
                            <Text style={styles.stepDesc}>
                                Start with your Adjusted Taxable Income (ATI). Subtract the Self-Support Amount
                                ($31,046 in 2026). The result is your child support income.
                            </Text>
                            <Text style={styles.stepFormula}>
                                Child Support Income = ATI - $31,046
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 2</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Calculate Combined Child Support Income</Text>
                            <Text style={styles.stepDesc}>
                                Add both parents' child support incomes together. This is the total income available
                                for child support.
                            </Text>
                            <Text style={styles.stepFormula}>
                                Combined Income = Parent A Income + Parent B Income
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 3</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Calculate Each Parent's Income Percentage</Text>
                            <Text style={styles.stepDesc}>
                                Divide your child support income by the combined income. This is your income percentage—
                                your share of the total income available for child support.
                            </Text>
                            <Text style={styles.stepFormula}>
                                Income % = (Your Income ÷ Combined Income) × 100
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 4</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Calculate the Costs of the Children</Text>
                            <Text style={styles.stepDesc}>
                                Use the official Costs of Children table based on combined income, number of children,
                                and their ages. This determines the total annual cost of raising the children.
                            </Text>
                            <Text style={styles.stepFormula}>
                                Costs = Table lookup (income, children, ages)
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 5</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Calculate Each Parent's Cost Percentage</Text>
                            <Text style={styles.stepDesc}>
                                Your cost percentage is based on your care percentage. More care = higher cost percentage.
                                This represents how much of the costs you cover through direct care.
                            </Text>
                            <Text style={styles.stepFormula}>
                                Cost % = Formula based on care % (see table below)
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 6</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Calculate Each Parent's Child Support Percentage</Text>
                            <Text style={styles.stepDesc}>
                                Subtract your cost percentage from your income percentage. If positive, you pay.
                                If negative, you receive.
                            </Text>
                            <Text style={styles.stepFormula}>
                                Child Support % = Income % - Cost %
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 7</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Calculate the Annual Child Support Amount</Text>
                            <Text style={styles.stepDesc}>
                                Multiply your child support percentage by the total costs of children. This is your
                                annual child support liability.
                            </Text>
                            <Text style={styles.stepFormula}>
                                Annual Amount = Child Support % × Total Costs
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 8</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Apply Multi-Case Adjustments (If Applicable)</Text>
                            <Text style={styles.stepDesc}>
                                If you have children from multiple relationships, the multi-case formula adjusts
                                your payments across all cases. This is complex and requires special calculation.
                            </Text>
                            <Text style={styles.stepFormula}>
                                Final Amount = Adjusted for multi-case (if applicable)
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>💡 Want to Skip the Math?</Text>
                        <Text style={styles.infoText}>
                            Our calculator does all 8 steps automatically. Just enter your income and care arrangement.
                        </Text>
                        <Pressable
                            style={[styles.infoButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.infoButtonText}>Calculate Your Child Support →</Text>
                        </Pressable>
                    </View>

                    {/* How Income Affects Payments - CONDENSED */}
                    <Text style={styles.h2} accessibilityRole="header">
                        How Income Affects Child Support
                    </Text>

                    <Text style={styles.paragraph}>
                        Your income determines two things: your income percentage (share of costs) and the total
                        costs of children (higher combined income = higher costs from the table). If you're{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/child-support-self-employed')}
                        >
                            self-employed
                        </Text>
                        , income calculation can be more complex.
                    </Text>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Example: Income Impact</Text>
                        <Text style={styles.exampleText}>Parent A: $80,000 | Parent B: $50,000 | 1 child, 0% care for Parent A</Text>
                        <Text style={styles.exampleCalc}>Combined income: $80k + $50k - $62k (SSA×2) = $68,000</Text>
                        <Text style={styles.exampleCalc}>Parent A income %: 62% | Parent B: 38%</Text>
                        <Text style={styles.exampleCalc}>Costs from table: ~$19,000/year</Text>
                        <Text style={styles.exampleResult}>Parent A pays: ~$11,780/year</Text>
                    </View>

                    {/* How Care Affects Payments - CONDENSED */}
                    <Text style={styles.h2} accessibilityRole="header">
                        How Care Percentage Affects Payments
                    </Text>

                    <Text style={styles.paragraph}>
                        Care percentage converts to cost percentage using a formula. More care = higher cost percentage
                        = lower child support payments. See the complete{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/child-support-care-percentage-table')}
                        >
                            care percentage table
                        </Text>
                        {' '}for all thresholds.
                    </Text>

                    <View style={styles.tableContainer}>
                        <Text style={styles.tableTitle}>Care % to Cost % Conversion</Text>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>0-13% care</Text>
                            <Text style={styles.tableCell}>0% cost</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>14-34% care</Text>
                            <Text style={styles.tableCell}>24% + 1% per % over 14%</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>35-47% care</Text>
                            <Text style={styles.tableCell}>45% + 1.5% per % over 35%</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>48-52% care</Text>
                            <Text style={styles.tableCell}>65% + 2% per % over 48%</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>53-65% care</Text>
                            <Text style={styles.tableCell}>76% + 1.5% per % over 53%</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>66-86% care</Text>
                            <Text style={styles.tableCell}>96% + 1% per % over 66%</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>87-100% care</Text>
                            <Text style={styles.tableCell}>117% cost</Text>
                        </View>
                    </View>

                    {/* FAQ */}
                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <FAQItem
                        question="What is the child support formula in Australia?"
                        answer="The Australian child support formula is an 8-step calculation that considers both parents' incomes, the cost of raising children (based on age and number), care percentages, and any relevant dependents. The formula determines each parent's income share and cost share, then calculates who pays whom based on the difference."
                    />

                    <FAQItem
                        question="How does income affect child support in Australia?"
                        answer="Your Adjusted Taxable Income (ATI) determines your share of child support costs. After deducting the Self-Support Amount ($31,046 in 2026), your remaining income is compared to the other parent's to calculate your income percentage. Higher income means a higher percentage of costs you're expected to cover."
                    />

                    <FAQItem
                        question="How does care percentage affect child support?"
                        answer="Care percentage determines your cost percentage—how much of the child's costs you're expected to cover through direct care. More care means lower child support payments. At 50/50 care, payments depend entirely on income difference. Below 14% care, you get no cost offset."
                    />

                    <FAQItem
                        question="What is the Self-Support Amount in child support?"
                        answer="The Self-Support Amount (SSA) is the minimum income each parent needs to support themselves. In 2026, it's $31,046 per year. This amount is deducted from each parent's income before calculating child support, ensuring parents can meet their own basic needs."
                    />

                    {/* Conclusion */}
                    <Text style={styles.h2} accessibilityRole="header">Understanding the Formula</Text>

                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightTitle}>Key Takeaways:</Text>
                        <Text style={styles.bulletItem}>• The formula has 8 steps that build on each other</Text>
                        <Text style={styles.bulletItem}>• Income determines your share of costs (income %)</Text>
                        <Text style={styles.bulletItem}>• Care determines your cost offset (cost %)</Text>
                        <Text style={styles.bulletItem}>• Child support = (Income % - Cost %) × Total costs</Text>
                        <Text style={styles.bulletItem}>• The Self-Support Amount protects basic living standards</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        The formula is complex, but our calculator handles all the math for you. Enter your details
                        and get an instant, accurate estimate.
                    </Text>

                    {/* Final CTA */}
                    <View style={styles.finalCtaSection}>
                        <Text style={styles.ctaTitle}>Calculate Your Child Support</Text>
                        <Text style={styles.ctaText}>
                            Get an instant estimate using the official 2026 formula. Takes 5 minutes.
                        </Text>
                        <Pressable
                            style={[styles.primaryButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.primaryButtonText}>Use Calculator</Text>
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
    highlightBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderWidth: 1, borderColor: '#bfdbfe', padding: 16, marginBottom: 16, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 }) },
    highlightTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    highlightText: { fontSize: 15, lineHeight: 24, color: '#1e40af' },
    inlineLink: { color: '#2563EB', fontWeight: '600', textDecorationLine: 'underline' },
    stepCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#2563EB', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 }) },
    stepNumber: { fontSize: 24, fontWeight: '700', color: '#2563EB', marginRight: 12, minWidth: 50 },
    stepContent: { flex: 1 },
    stepTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 6 },
    stepDesc: { fontSize: 14, lineHeight: 20, color: '#64748b', marginBottom: 8 },
    stepFormula: { fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: '#2563EB', backgroundColor: '#f1f5f9', padding: 8, borderRadius: 6 },
    infoBox: { backgroundColor: '#f0fdf4', borderRadius: 12, borderWidth: 1, borderColor: '#86efac', padding: 16, marginBottom: 16 },
    infoTitle: { fontSize: 15, fontWeight: '600', color: '#14532d', marginBottom: 8 },
    infoText: { fontSize: 15, lineHeight: 24, color: '#14532d', marginBottom: 12 },
    infoButton: { backgroundColor: '#22c55e', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'flex-start' },
    infoButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
    exampleCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 }) },
    exampleTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    exampleText: { fontSize: 14, color: '#64748b', marginBottom: 6 },
    exampleCalc: { fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: '#64748b', marginBottom: 4 },
    exampleResult: { fontSize: 16, fontWeight: '700', color: '#2563EB', marginTop: 8 },
    tableContainer: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    tableTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },
    tableRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    tableCell: { flex: 1, fontSize: 14, color: '#475569' },
    faqItem: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    faqQuestion: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    faqAnswer: { fontSize: 15, lineHeight: 24, color: '#475569' },
    finalCtaSection: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 24, marginTop: 32, alignItems: 'center' },
    ctaTitle: { fontSize: 20, fontWeight: '700', color: '#1e3a8a', marginBottom: 8, textAlign: 'center' },
    ctaText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 20, textAlign: 'center' },
    primaryButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 28, ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    primaryButtonText: { color: '#ffffff', fontSize: 17, fontWeight: '700' },
});
