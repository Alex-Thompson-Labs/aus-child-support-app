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
            name: 'How do I calculate child support in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'To calculate child support: 1) Determine both parents\' Adjusted Taxable Income, 2) Subtract the Self-Support Amount ($31,046 in 2026) from each, 3) Calculate income percentages, 4) Look up costs from the official table, 5) Calculate care percentages, 6) Apply the formula: (Income % - Cost %) × Total Costs. Use a calculator for accuracy.',
            },
        },
        {
            '@type': 'Question',
            name: 'What information do I need to calculate child support?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'You need: both parents\' taxable income (from tax returns), number of children and their ages, care arrangement (nights per year with each parent), and any relevant dependents. Optional: other child support cases, income support payments, and special circumstances.',
            },
        },
        {
            '@type': 'Question',
            name: 'Is there a free child support calculator for Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Our free calculator uses the official 2026 Services Australia formula. Enter your income, care arrangement, and children\'s details to get an instant estimate. It handles standard cases (Formulas 1-3) and flags complex situations that need legal advice.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Calculate Child Support in Australia',
    description: 'Step-by-step guide to calculating child support in Australia using the 2026 formula. Includes what information you need and a free calculator.',
    step: [
        { '@type': 'HowToStep', name: 'Gather Required Information', text: 'Collect both parents\' income, care arrangement, and children\'s details' },
        { '@type': 'HowToStep', name: 'Calculate Child Support Income', text: 'Subtract Self-Support Amount from each parent\'s taxable income' },
        { '@type': 'HowToStep', name: 'Determine Income Percentages', text: 'Calculate each parent\'s share of combined income' },
        { '@type': 'HowToStep', name: 'Look Up Costs of Children', text: 'Use official table based on income and children' },
        { '@type': 'HowToStep', name: 'Calculate Care Percentages', text: 'Convert nights per year to care and cost percentages' },
        { '@type': 'HowToStep', name: 'Apply the Formula', text: 'Calculate final amount using income and cost percentages' },
    ],
};

export default function HowToCalculateChildSupportBlogPost() {
    const router = useRouter();

    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="How to Calculate Child Support in Australia: The 2026 Guide"
                description="Step-by-step guide to calculating child support in Australia. Learn what information you need, how the formula works, and use our free calculator for instant results."
                canonicalPath="/blog/how-to-calculate-child-support"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'How to Calculate' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Calculator Guide</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            How to Calculate Child Support in Australia: The 2026 Guide
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        Need to calculate child support? You're in the right place. This guide shows you exactly 
                        what information you need, how the calculation works, and the fastest way to get an accurate estimate.
                    </Text>

                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            Use our free calculator below. It uses the official 2026 Services Australia formula and 
                            gives you an instant, accurate estimate in under 5 minutes.
                        </Text>
                        <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.quickAnswerButtonText}>Calculate Now →</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.paragraph}>
                        Want to understand how it works first? Keep reading for the step-by-step process.
                    </Text>

                    {/* Step 1 */}
                    <Text style={styles.h2} accessibilityRole="header">Step 1: Gather the Information You Need</Text>
                    <Text style={styles.paragraph}>Before you can calculate child support, collect these details:</Text>

                    <View style={styles.checklistCard}>
                        <Text style={styles.checklistTitle}>✓ Income Information</Text>
                        <Text style={styles.checklistItem}>• Your taxable income (from last tax return)</Text>
                        <Text style={styles.checklistItem}>• Other parent's taxable income</Text>
                        <Text style={styles.checklistItem}>• Any reportable fringe benefits or super contributions</Text>
                    </View>

                    <View style={styles.checklistCard}>
                        <Text style={styles.checklistTitle}>✓ Children's Details</Text>
                        <Text style={styles.checklistItem}>• Number of children</Text>
                        <Text style={styles.checklistItem}>• Age of each child</Text>
                        <Text style={styles.checklistItem}>• Whether any children are 18+ in secondary school</Text>
                    </View>

                    <View style={styles.checklistCard}>
                        <Text style={styles.checklistTitle}>✓ Care Arrangement</Text>
                        <Text style={styles.checklistItem}>• How many nights per year each parent has the children</Text>
                        <Text style={styles.checklistItem}>• Whether care is shared equally or one parent has primary care</Text>
                    </View>

                    <View style={styles.checklistCard}>
                        <Text style={styles.checklistTitle}>✓ Other Factors (If Applicable)</Text>
                        <Text style={styles.checklistItem}>• Other children you support (relevant dependents)</Text>
                        <Text style={styles.checklistItem}>• Other child support cases</Text>
                        <Text style={styles.checklistItem}>• Whether either parent receives income support</Text>
                    </View>

                    {/* Step 2 */}
                    <Text style={styles.h2} accessibilityRole="header">Step 2: Calculate Child Support Income</Text>
                    <Text style={styles.paragraph}>
                        Child support income is your taxable income minus the Self-Support Amount (SSA). The SSA is 
                        $31,046 in 2026—the minimum income you need to support yourself.
                    </Text>

                    <View style={styles.formulaCard}>
                        <Text style={styles.formulaTitle}>Formula:</Text>
                        <Text style={styles.formulaText}>Child Support Income = Taxable Income - $31,046</Text>
                    </View>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Example:</Text>
                        <Text style={styles.exampleText}>Parent A earns $80,000</Text>
                        <Text style={styles.exampleCalc}>$80,000 - $31,046 = $48,954 child support income</Text>
                        <Text style={styles.exampleText}>Parent B earns $50,000</Text>
                        <Text style={styles.exampleCalc}>$50,000 - $31,046 = $18,954 child support income</Text>
                    </View>

                    {/* Step 3 */}
                    <Text style={styles.h2} accessibilityRole="header">Step 3: Calculate Income Percentages</Text>
                    <Text style={styles.paragraph}>
                        Add both parents' child support incomes together, then calculate each parent's percentage of the total.
                    </Text>

                    <View style={styles.formulaCard}>
                        <Text style={styles.formulaTitle}>Formula:</Text>
                        <Text style={styles.formulaText}>Income % = (Your Income ÷ Combined Income) × 100</Text>
                    </View>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Example (continued):</Text>
                        <Text style={styles.exampleCalc}>Combined: $48,954 + $18,954 = $67,908</Text>
                        <Text style={styles.exampleCalc}>Parent A: ($48,954 ÷ $67,908) × 100 = 72%</Text>
                        <Text style={styles.exampleCalc}>Parent B: ($18,954 ÷ $67,908) × 100 = 28%</Text>
                    </View>

                    {/* Step 4 */}
                    <Text style={styles.h2} accessibilityRole="header">Step 4: Look Up the Costs of Children</Text>
                    <Text style={styles.paragraph}>
                        Use the official Costs of Children table based on combined income, number of children, and their ages. 
                        This table is updated annually and varies significantly by income level.
                    </Text>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Complex Table:</Text>
                        <Text style={styles.warningText}>
                            The Costs of Children table has hundreds of entries. Manual lookup is error-prone. 
                            Our calculator does this automatically.
                        </Text>
                    </View>

                    {/* Step 5 */}
                    <Text style={styles.h2} accessibilityRole="header">Step 5: Calculate Care and Cost Percentages</Text>
                    <Text style={styles.paragraph}>
                        Convert nights per year into care percentage, then use the formula to calculate cost percentage. 
                        This determines how much of the costs you cover through direct care.
                    </Text>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>💡 Care Percentage Guide:</Text>
                        <Text style={styles.infoText}>
                            52 nights = 14% care | 128 nights = 35% care | 183 nights = 50% care
                        </Text>
                        <Pressable style={[styles.infoButton, isWeb && webClickableStyles]} onPress={() => router.push('/blog/child-support-care-percentage-table')} accessibilityRole="button">
                            <Text style={styles.infoButtonText}>See Full Care Table →</Text>
                        </Pressable>
                    </View>

                    {/* Step 6 */}
                    <Text style={styles.h2} accessibilityRole="header">Step 6: Apply the Formula</Text>
                    <Text style={styles.paragraph}>
                        Subtract your cost percentage from your income percentage. Multiply by the total costs of children. 
                        This is your annual child support amount.
                    </Text>

                    <View style={styles.formulaCard}>
                        <Text style={styles.formulaTitle}>Formula:</Text>
                        <Text style={styles.formulaText}>Annual Amount = (Income % - Cost %) × Total Costs</Text>
                    </View>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Complete Example:</Text>
                        <Text style={styles.exampleText}>Parent A: 72% income, 0% care (0% cost)</Text>
                        <Text style={styles.exampleText}>Parent B: 28% income, 100% care (117% cost)</Text>
                        <Text style={styles.exampleText}>Total costs: $19,000 (from table)</Text>
                        <Text style={styles.exampleCalc}>Parent A: (72% - 0%) × $19,000 = $13,680/year</Text>
                        <Text style={styles.exampleResult}>Parent A pays $13,680/year ($1,140/month)</Text>
                    </View>

                    {/* Why Use Calculator */}
                    <Text style={styles.h2} accessibilityRole="header">Why Use a Calculator Instead?</Text>
                    <Text style={styles.paragraph}>Manual calculation is possible but has significant risks:</Text>

                    <View style={styles.riskCard}>
                        <Text style={styles.riskTitle}>❌ Manual Calculation Risks:</Text>
                        <Text style={styles.bulletItem}>• Costs of Children table has 500+ entries—easy to use wrong value</Text>
                        <Text style={styles.bulletItem}>• Care-to-cost conversion formula is complex with multiple thresholds</Text>
                        <Text style={styles.bulletItem}>• Multi-case adjustments require specialized calculations</Text>
                        <Text style={styles.bulletItem}>• One mistake can result in thousands of dollars error</Text>
                        <Text style={styles.bulletItem}>• Takes 30-60 minutes vs. 5 minutes with calculator</Text>
                    </View>

                    <View style={styles.benefitCard}>
                        <Text style={styles.benefitTitle}>✅ Calculator Benefits:</Text>
                        <Text style={styles.bulletItem}>• Uses official 2026 formula and tables</Text>
                        <Text style={styles.bulletItem}>• Instant results in under 5 minutes</Text>
                        <Text style={styles.bulletItem}>• Handles all formula variations automatically</Text>
                        <Text style={styles.bulletItem}>• Shows full breakdown of calculation</Text>
                        <Text style={styles.bulletItem}>• Flags complex cases that need legal advice</Text>
                        <Text style={styles.bulletItem}>• Free, no registration required</Text>
                    </View>

                    {/* FAQ */}
                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <FAQItem
                        question="How do I calculate child support in Australia?"
                        answer="To calculate child support: 1) Determine both parents' Adjusted Taxable Income, 2) Subtract the Self-Support Amount ($31,046 in 2026) from each, 3) Calculate income percentages, 4) Look up costs from the official table, 5) Calculate care percentages, 6) Apply the formula: (Income % - Cost %) × Total Costs. Use a calculator for accuracy."
                    />

                    <FAQItem
                        question="What information do I need to calculate child support?"
                        answer="You need: both parents' taxable income (from tax returns), number of children and their ages, care arrangement (nights per year with each parent), and any relevant dependents. Optional: other child support cases, income support payments, and special circumstances."
                    />

                    <FAQItem
                        question="Is there a free child support calculator for Australia?"
                        answer="Yes. Our free calculator uses the official 2026 Services Australia formula. Enter your income, care arrangement, and children's details to get an instant estimate. It handles standard cases (Formulas 1-3) and flags complex situations that need legal advice."
                    />

                    {/* Final CTA */}
                    <View style={styles.finalCtaSection}>
                        <Text style={styles.finalCtaTitle}>Calculate Your Child Support Now</Text>
                        <Text style={styles.finalCtaText}>
                            Get an accurate estimate in under 5 minutes using the official 2026 formula. Free, no registration required.
                        </Text>
                        <Pressable style={[styles.primaryButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.primaryButtonText}>Use Free Calculator</Text>
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
    checklistCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    checklistTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    checklistItem: { fontSize: 14, lineHeight: 22, color: '#64748b', marginBottom: 4 },
    formulaCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    formulaTitle: { fontSize: 14, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    formulaText: { fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: '#2563EB' },
    exampleCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 }) },
    exampleTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    exampleText: { fontSize: 14, color: '#64748b', marginBottom: 4 },
    exampleCalc: { fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: '#64748b', marginBottom: 4 },
    exampleResult: { fontSize: 16, fontWeight: '700', color: '#2563EB', marginTop: 8 },
    warningBox: { backgroundColor: '#fef3c7', borderRadius: 12, borderWidth: 1, borderColor: '#fbbf24', padding: 16, marginBottom: 16 },
    warningTitle: { fontSize: 15, fontWeight: '600', color: '#78350f', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#78350f' },
    infoBox: { backgroundColor: '#f0fdf4', borderRadius: 12, borderWidth: 1, borderColor: '#86efac', padding: 16, marginBottom: 16 },
    infoTitle: { fontSize: 15, fontWeight: '600', color: '#14532d', marginBottom: 8 },
    infoText: { fontSize: 15, lineHeight: 24, color: '#14532d', marginBottom: 12 },
    infoButton: { backgroundColor: '#22c55e', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'flex-start' },
    infoButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
    riskCard: { backgroundColor: '#fef2f2', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#fecaca' },
    riskTitle: { fontSize: 16, fontWeight: '600', color: '#991b1b', marginBottom: 12 },
    benefitCard: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#86efac' },
    benefitTitle: { fontSize: 16, fontWeight: '600', color: '#14532d', marginBottom: 12 },
    faqItem: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    faqQuestion: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    faqAnswer: { fontSize: 15, lineHeight: 24, color: '#475569' },
    finalCtaSection: { backgroundColor: '#1e3a8a', borderRadius: 12, padding: 28, marginTop: 32, alignItems: 'center', ...createShadow({ shadowColor: '#1e3a8a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    finalCtaTitle: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 12, textAlign: 'center' },
    finalCtaText: { fontSize: 16, lineHeight: 26, color: '#bfdbfe', marginBottom: 24, textAlign: 'center' },
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 32, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 18, fontWeight: '700' },
});
