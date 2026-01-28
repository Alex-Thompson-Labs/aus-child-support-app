import { ContextualWizard } from '@/src/components/blog/ContextualWizard';
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
            name: 'What does child support cover in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Child support in Australia is a general contribution toward the costs of raising a child. It\'s not itemized for specific expenses. The receiving parent decides how to allocate it across day-to-day costs like food, clothing, housing, education, and activities. The amount is calculated using research into typical family spending patterns.',
            },
        },
        {
            '@type': 'Question',
            name: 'Does child support cover school fees in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Standard child support doesn\'t specifically cover school fees. However, if private school fees are unusually high and both parents agreed to private education, you can apply for a Change of Assessment under Reason 3 to have these costs considered separately. Basic public school costs are included in the general child support amount.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can child support be used for anything?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Child support is a general financial contribution, not earmarked for specific expenses. The receiving parent has discretion to allocate it toward any costs related to raising the child—housing, food, clothing, education, healthcare, activities, or savings. The law doesn\'t require itemized spending reports.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What Does Child Support Cover in Australia? 2026 Guide',
    description: 'Child support is a general contribution toward raising costs, not itemized expenses. Learn what it covers, what it doesn\'t, and how to claim extra costs.',
    datePublished: '2026-01-28',
    dateModified: '2026-01-28',
    author: {
        '@type': 'Organization',
        name: 'AusChildSupport',
    },
};

export default function WhatDoesChildSupportCoverBlogPost() {
    const router = useRouter();

    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="What Does Child Support Cover in Australia? 2026 Guide"
                description="Child support is a general contribution toward raising costs, not itemized expenses. Learn what it covers, what it doesn't, and how to claim extra costs."
                canonicalPath="/blog/what-does-child-support-cover"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'What Child Support Covers' },
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
                    {/* Article Header */}
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Understanding Child Support</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            What Does Child Support Cover in Australia?
                        </Text>
                        <Text style={styles.publishDate}>Published January 28, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        One of the most common questions parents ask: "What exactly does child support pay for?" 
                        The answer might surprise you—it's not as specific as you think.
                    </Text>

                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            Child support in Australia is a general contribution toward the costs of raising a child. 
                            It's not itemized for specific expenses. The receiving parent decides how to allocate it 
                            across day-to-day costs like food, clothing, housing, education, and activities.
                        </Text>
                        <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.quickAnswerButtonText}>Calculate Your Amount →</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.paragraph}>
                        Let's break down what this means in practice, what the law actually says, and when you can 
                        claim additional costs.
                    </Text>

                    {/* Internal Link: Related Content */}
                    <View style={styles.internalLinkBox}>
                        <Text style={styles.internalLinkTitle}>📖 Understanding Child Support</Text>
                        <Text style={styles.internalLinkText}>
                            Before diving into what child support covers, you might want to understand how it's calculated:
                        </Text>
                        <Pressable style={[styles.internalLinkButton, isWeb && webClickableStyles]} onPress={() => router.push('/blog/child-support-formula-australia')} accessibilityRole="button">
                            <Text style={styles.internalLinkButtonText}>How the Formula Works →</Text>
                        </Pressable>
                        <Pressable style={[styles.internalLinkButton, isWeb && webClickableStyles, { marginTop: 8 }]} onPress={() => router.push('/blog/how-to-calculate-child-support')} accessibilityRole="button">
                            <Text style={styles.internalLinkButtonText}>Step-by-Step Calculation Guide →</Text>
                        </Pressable>
                    </View>

                    {/* Featured Snippet Optimization: "How much will I pay" */}
                    <Text style={styles.h2} accessibilityRole="header">How Much Child Support Will I Pay in Australia?</Text>
                    <Text style={styles.paragraph}>
                        Child support in Australia typically ranges from $2,000 to $20,000 per year ($167-$1,667/month), depending on your income, care arrangement, and number of children. Low-income parents pay a minimum of $534/year, while high-income parents ($200k+) can pay $30,000+ annually. The exact amount depends on the 8-step formula that considers both parents' incomes and care percentages.
                    </Text>

                    <View style={styles.rangeTable}>
                        <Text style={styles.tableTitle}>Typical Child Support Ranges (2026)</Text>
                        <View style={styles.tableHeaderRow}>
                            <Text style={styles.tableHeaderCell}>Income Level</Text>
                            <Text style={styles.tableHeaderCell}>Annual Payment</Text>
                            <Text style={styles.tableHeaderCell}>Monthly Payment</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Low income (income support)</Text>
                            <Text style={styles.tableCell}>$534-$1,815</Text>
                            <Text style={styles.tableCell}>$45-$151</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Average income ($50k-$80k)</Text>
                            <Text style={styles.tableCell}>$5,000-$12,000</Text>
                            <Text style={styles.tableCell}>$417-$1,000</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>High income ($100k-$150k)</Text>
                            <Text style={styles.tableCell}>$15,000-$25,000</Text>
                            <Text style={styles.tableCell}>$1,250-$2,083</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Very high income ($200k+)</Text>
                            <Text style={styles.tableCell}>$30,000+</Text>
                            <Text style={styles.tableCell}>$2,500+</Text>
                        </View>
                    </View>

                    {/* Featured Snippet Optimization: "Minimum payment" */}
                    <Text style={styles.h2} accessibilityRole="header">What Is the Minimum Child Support Payment in Australia?</Text>
                    <Text style={styles.paragraph}>
                        The minimum child support payment in Australia is $534 per year (2026 rate) if you receive income support and have at least regular care (2+ nights per fortnight). For low-income payers without income support, the fixed annual rate is $1,815 per child per year, capped at three children. These minimum rates ensure children receive basic financial support regardless of the paying parent's income level.
                    </Text>

                    <View style={styles.minimumRateCard}>
                        <Text style={styles.cardTitle}>Minimum Child Support Rates (2026)</Text>
                        <Text style={styles.bulletItem}>
                            • <Text style={styles.bold}>Income support recipient:</Text> $534/year ($45/month) with regular care
                        </Text>
                        <Text style={styles.bulletItem}>
                            • <Text style={styles.bold}>Low income (no income support):</Text> $1,815/year ($151/month) per child
                        </Text>
                        <Text style={styles.bulletItem}>
                            • <Text style={styles.bold}>Maximum children:</Text> Capped at 3 children for fixed rate
                        </Text>
                        <Text style={styles.bulletItem}>
                            • <Text style={styles.bold}>Care requirement:</Text> Must have less than shared care (under 128 nights/year)
                        </Text>
                    </View>

                    {/* Featured Snippet Opportunity */}
                    <Text style={styles.h2} accessibilityRole="header">How Is Child Support Calculated in Australia?</Text>
                    <Text style={styles.paragraph}>
                        Child support in Australia is calculated using the Services Australia formula that considers both parents' adjusted taxable incomes and care arrangements. The basic formula is: (Your Income % - Your Cost %) × Total Costs of Children. Services Australia applies this to determine who pays, how much, and when. Most parents pay between $1,815 (minimum) and $30,000+ annually depending on income and care.
                    </Text>
                    
                    <View style={styles.disclaimerBox}>
                        <Text style={styles.disclaimerTitle}>📌 Important Note</Text>
                        <Text style={styles.disclaimerText}>
                            This guide covers Formula 1 (the basic formula) for single-case assessments where only parents have care of the children. Complex situations involving multiple child support cases, non-parent carers, or overseas parents may use different formulas (Formula 2-6). Our calculator handles all formula variations automatically.
                        </Text>
                    </View>

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

                    <View style={styles.internalLinkBox}>
                        <Text style={styles.internalLinkTitle}>📖 Related Guides</Text>
                        <Text style={styles.internalLinkText}>
                            Understanding the formula is just the start. Explore these related topics:
                        </Text>
                        <Pressable style={[styles.internalLinkButton, isWeb && webClickableStyles]} onPress={() => router.push('/blog/child-support-formula-australia')} accessibilityRole="button">
                            <Text style={styles.internalLinkButtonText}>Complete Formula Breakdown →</Text>
                        </Pressable>
                        <Pressable style={[styles.internalLinkButton, isWeb && webClickableStyles, { marginTop: 8 }]} onPress={() => router.push('/blog/accurate-child-support-calculator')} accessibilityRole="button">
                            <Text style={styles.internalLinkButtonText}>Why Use a Calculator? →</Text>
                        </Pressable>
                        <Pressable style={[styles.internalLinkButton, isWeb && webClickableStyles, { marginTop: 8 }]} onPress={() => router.push('/blog/child-support-reduction-strategies')} accessibilityRole="button">
                            <Text style={styles.internalLinkButtonText}>Legal Ways to Reduce Payments →</Text>
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

                    {/* Contextual Wizard for Complex Cases */}
                    <ContextualWizard
                        preselectedFactors={['high_costs']}
                        highlightedFactors={['private_school_fees', 'property_settlement', 'change_circumstances']}
                        blogTopic="what_child_support_covers"
                        ctaText="Get Help Claiming Extra Costs"
                        analyticsSource="blog_what_does_child_support_cover"
                        formReason="special_circumstances"
                        title="Need to Claim Costs Beyond Basic Support?"
                        description="If you have unusually high costs (private school, medical, special needs), you may be able to apply for a Change of Assessment. Select any factors that apply."
                    />

                    <View style={styles.trustSignalBox}>
                        <Text style={styles.trustSignalTitle}>💼 What to Expect from a Consultation</Text>
                        <Text style={styles.trustSignalItem}>• Most family lawyers offer free initial consultations (15-30 minutes)</Text>
                        <Text style={styles.trustSignalItem}>• Discuss whether your costs qualify for a Change of Assessment application</Text>
                        <Text style={styles.trustSignalItem}>• No obligation to proceed—just get clarity on your options</Text>
                        <Text style={styles.trustSignalItem}>• Typical consultation fee: $200-400 if not free (often waived for complex cases)</Text>
                    </View>

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
    quickAnswerBox: { backgroundColor: '#2563eb', borderRadius: 12, padding: 20, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    quickAnswerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
    quickAnswerText: { fontSize: 15, lineHeight: 24, color: '#ffffff', marginBottom: 16, textAlign: 'center' },
    quickAnswerButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
    quickAnswerButtonText: { color: '#2563eb', fontSize: 16, fontWeight: '700' },
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
    warningBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#f59e0b', padding: 16, marginBottom: 16 },
    warningTitle: { fontSize: 15, fontWeight: '600', color: '#1e40af', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#475569' },
    infoBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderWidth: 1, borderColor: '#bfdbfe', padding: 16, marginBottom: 16 },
    infoTitle: { fontSize: 15, fontWeight: '600', color: '#1e40af', marginBottom: 8 },
    infoText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 12 },
    infoButton: { backgroundColor: '#2563eb', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'flex-start' },
    infoButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
    riskCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#dc2626' },
    riskTitle: { fontSize: 16, fontWeight: '600', color: '#1e40af', marginBottom: 12 },
    benefitCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    benefitTitle: { fontSize: 16, fontWeight: '600', color: '#1e40af', marginBottom: 12 },
    faqItem: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    faqQuestion: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    faqAnswer: { fontSize: 15, lineHeight: 24, color: '#475569' },
    finalCtaSection: { backgroundColor: '#1e3a8a', borderRadius: 12, padding: 28, marginTop: 32, alignItems: 'center', ...createShadow({ shadowColor: '#1e3a8a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    finalCtaTitle: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 12, textAlign: 'center' },
    finalCtaText: { fontSize: 16, lineHeight: 26, color: '#bfdbfe', marginBottom: 24, textAlign: 'center' },
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 32, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 18, fontWeight: '700' },

    trustSignalBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#bfdbfe' },
    trustSignalTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 12 },
    trustSignalItem: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 6 },

    internalLinkBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#bfdbfe' },
    internalLinkTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    internalLinkText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 16 },
    internalLinkButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 20, alignSelf: 'flex-start', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    internalLinkButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },

    disclaimerBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#2563eb', padding: 16, marginBottom: 16 },
    disclaimerTitle: { fontSize: 15, fontWeight: '600', color: '#1e40af', marginBottom: 8 },
    disclaimerText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    // Featured snippet optimization styles
    rangeTable: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 }) },
    tableTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 12 },
    tableHeaderRow: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#2563eb', paddingBottom: 8, marginBottom: 8 },
    tableHeaderCell: { flex: 1, fontSize: 14, fontWeight: '700', color: '#1e3a8a' },
    tableRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    tableCell: { flex: 1, fontSize: 14, color: '#475569' },
    minimumRateCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#bfdbfe' },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 12 },
    bold: { fontWeight: '700', color: '#1e3a8a' },
});
