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
            name: 'Is there a free accurate child support calculator for Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Our calculator uses the official 2026 Services Australia formula with current rates and thresholds. It handles standard cases (Formulas 1-3) and provides instant estimates. For complex cases involving self-employment, trusts, or Change of Assessment, the calculator flags when you need professional advice.',
            },
        },
        {
            '@type': 'Question',
            name: 'How accurate is an online child support calculator?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Online calculators are accurate for standard cases where both parents are wage earners with verifiable income. Accuracy decreases for complex situations: self-employment (expenses may be added back), trusts or companies (income attribution), overseas income, or Change of Assessment factors. Use calculators for estimates, not legal advice.',
            },
        },
        {
            '@type': 'Question',
            name: 'What information do I need to use a child support calculator?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'You need: both parents taxable income (from tax returns), number of children and their ages, care arrangement (nights per year with each parent), any relevant dependents, other child support cases (if applicable), and whether either parent receives income support. The calculator takes 3-5 minutes to complete.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Accurate Child Support Calculator Australia: Estimate Your Payments (2026)',
    description: 'Free child support calculator using the official 2026 Services Australia formula. Get instant, accurate estimates in under 5 minutes. Understand what makes calculators accurate and when to get legal advice.',
    datePublished: '2026-01-24',
    author: { '@type': 'Organization', name: 'AusChildSupport' },
};

export default function AccurateChildSupportCalculatorBlogPost() {
    const router = useRouter();

    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="Accurate Child Support Calculator Australia: Estimate Your Payments (2026)"
                description="Free child support calculator using the official 2026 Services Australia formula. Get instant, accurate estimates in under 5 minutes. Understand what makes calculators accurate and when to get legal advice."
                canonicalPath="/blog/accurate-child-support-calculator"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Accurate Calculator' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Calculator Guide</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            Accurate Child Support Calculator Australia: Estimate Your Payments (2026)
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        Need to estimate child support payments? An accurate calculator can save you hours of manual
                        calculation and give you instant results. But not all calculators are equal. Here's what makes
                        a calculator accurate, how to use one effectively, and when estimates aren't enough.
                    </Text>

                    <View style={styles.ctaBox}>
                        <Text style={styles.ctaBoxTitle}>🎯 Try Our Free Calculator</Text>
                        <Text style={styles.ctaBoxText}>
                            Uses the official 2026 Services Australia formula. Get instant, accurate estimates in
                            under 5 minutes. No registration required.
                        </Text>
                        <Pressable
                            style={[styles.ctaBoxButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.ctaBoxButtonText}>Calculate Now →</Text>
                        </Pressable>
                    </View>

                    {/* What Makes a Calculator Accurate */}
                    <Text style={styles.h2} accessibilityRole="header">What Makes a Child Support Calculator Accurate?</Text>
                    <Text style={styles.paragraph}>
                        Not all online calculators use the correct formula or current rates. An accurate calculator must:
                    </Text>

                    <View style={styles.checklistCard}>
                        <Text style={styles.checklistTitle}>✓ Accuracy Requirements:</Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Use the official formula:</Text> Services Australia's 8-step
                            calculation method
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Current rates:</Text> 2026 Self-Support Amount ($31,046),
                            income thresholds, and cost tables
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Handle all formulas:</Text> Formula 1 (basic), Formula 2
                            (income support), Formula 3 (multi-case)
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Accurate care calculations:</Text> Convert nights to care
                            percentage, then to cost percentage
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Include all factors:</Text> Relevant dependents, other cases,
                            income support
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Show breakdown:</Text> Explain how the result was calculated
                        </Text>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Outdated Calculators:</Text>
                        <Text style={styles.warningText}>
                            Many online calculators use old rates (2024 or earlier) or simplified formulas. This can
                            result in estimates that are off by hundreds of dollars per month. Always check the
                            calculator uses 2026 rates.
                        </Text>
                    </View>

                    {/* How to Use Calculator */}
                    <Text style={styles.h2} accessibilityRole="header">How to Use a Child Support Calculator</Text>
                    <Text style={styles.paragraph}>
                        Getting accurate results requires accurate inputs. Here's what you need and how to find it:
                    </Text>

                    <Text style={styles.h3} accessibilityRole="header">Step 1: Gather Income Information</Text>
                    <View style={styles.stepCard}>
                        <Text style={styles.stepTitle}>What You Need:</Text>
                        <Text style={styles.bulletItem}>• Your Adjusted Taxable Income (from last tax return)</Text>
                        <Text style={styles.bulletItem}>• Other parent's Adjusted Taxable Income</Text>
                        <Text style={styles.bulletItem}>• Reportable fringe benefits (if any)</Text>
                        <Text style={styles.bulletItem}>• Reportable super contributions (if any)</Text>

                        <Text style={styles.stepTitle}>Where to Find It:</Text>
                        <Text style={styles.bulletItem}>• Tax return: Notice of Assessment from ATO</Text>
                        <Text style={styles.bulletItem}>• Payslips: Annual income summary</Text>
                        <Text style={styles.bulletItem}>• myGov: ATO section shows taxable income</Text>
                    </View>

                    <View style={styles.tipBox}>
                        <Text style={styles.tipTitle}>💡 Income Tip:</Text>
                        <Text style={styles.tipText}>
                            Use taxable income, not gross income. If you earn $80,000 gross but have $10,000 in
                            deductions, your taxable income is $70,000. That's what the calculator needs.
                        </Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Step 2: Enter Children's Details</Text>
                    <View style={styles.stepCard}>
                        <Text style={styles.stepTitle}>What You Need:</Text>
                        <Text style={styles.bulletItem}>• Number of children</Text>
                        <Text style={styles.bulletItem}>• Age of each child (affects cost table)</Text>
                        <Text style={styles.bulletItem}>• Whether any children are 18+ in secondary school</Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Step 3: Define Care Arrangement</Text>
                    <View style={styles.stepCard}>
                        <Text style={styles.stepTitle}>What You Need:</Text>
                        <Text style={styles.bulletItem}>• Nights per year each parent has the children</Text>
                        <Text style={styles.bulletItem}>• Whether care is consistent or varies</Text>

                        <Text style={styles.stepTitle}>How to Calculate Nights:</Text>
                        <Text style={styles.bulletItem}>• Every second weekend: 52 nights/year (14% care)</Text>
                        <Text style={styles.bulletItem}>• Every second weekend + half school holidays: 128 nights/year (35% care)</Text>
                        <Text style={styles.bulletItem}>• Week on/week off: 183 nights/year (50% care)</Text>
                    </View>

                    <Pressable
                        style={[styles.linkButton, isWeb && webClickableStyles]}
                        onPress={() => router.push('/blog/child-support-care-percentage-table')}
                        accessibilityRole="button"
                    >
                        <Text style={styles.linkButtonText}>See Full Care Percentage Table →</Text>
                    </Pressable>

                    <Text style={styles.h3} accessibilityRole="header">Step 4: Add Other Factors (If Applicable)</Text>
                    <View style={styles.stepCard}>
                        <Text style={styles.stepTitle}>Optional Information:</Text>
                        <Text style={styles.bulletItem}>• Relevant dependents (other children you support)</Text>
                        <Text style={styles.bulletItem}>• Other child support cases</Text>
                        <Text style={styles.bulletItem}>• Whether either parent receives income support</Text>
                    </View>

                    {/* Understanding Results */}
                    <Text style={styles.h2} accessibilityRole="header">Understanding Your Calculator Results</Text>
                    <Text style={styles.paragraph}>
                        A good calculator shows more than just a dollar amount. Look for:
                    </Text>

                    <View style={styles.resultsCard}>
                        <Text style={styles.resultsTitle}>What Results Should Include:</Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Annual amount:</Text> Total child support per year
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Monthly amount:</Text> Divided by 12 for budgeting
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Formula used:</Text> Which calculation method applied
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Breakdown:</Text> How income, care, and costs were calculated
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Complexity warnings:</Text> Flags if your case needs legal advice
                        </Text>
                    </View>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Example Result:</Text>
                        <Text style={styles.exampleText}>Parent A income: $80,000 | Parent B income: $50,000</Text>
                        <Text style={styles.exampleText}>2 children (ages 5, 8) | Parent A has 0% care</Text>
                        <Text style={styles.exampleCalc}>Combined child support income: $67,908</Text>
                        <Text style={styles.exampleCalc}>Parent A income percentage: 72%</Text>
                        <Text style={styles.exampleCalc}>Costs of children: $19,234</Text>
                        <Text style={styles.exampleCalc}>Parent A cost percentage: 0% (no care)</Text>
                        <Text style={styles.exampleResult}>Annual: $13,848 | Monthly: $1,154</Text>
                    </View>

                    {/* When Calculators Are Accurate */}
                    <Text style={styles.h2} accessibilityRole="header">When Calculator Estimates Are Accurate</Text>
                    <Text style={styles.paragraph}>
                        Calculators provide reliable estimates for straightforward cases:
                    </Text>

                    <View style={styles.greenCard}>
                        <Text style={styles.greenCardTitle}>✓ High Accuracy Situations:</Text>
                        <Text style={styles.bulletItem}>• Both parents are wage earners (PAYG employees)</Text>
                        <Text style={styles.bulletItem}>• Income is easily verifiable from tax returns</Text>
                        <Text style={styles.bulletItem}>• No business income, trusts, or companies</Text>
                        <Text style={styles.bulletItem}>• Care arrangement is clear and documented</Text>
                        <Text style={styles.bulletItem}>• No special circumstances or Change of Assessment factors</Text>
                        <Text style={styles.bulletItem}>• Standard formula applies (no income support or multi-case)</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        In these cases, calculator estimates typically match Services Australia assessments within
                        $10-50/month (accounting for rounding differences).
                    </Text>

                    {/* When Calculators Are Less Accurate */}
                    <Text style={styles.h2} accessibilityRole="header">When Calculator Estimates Are Less Accurate</Text>
                    <Text style={styles.paragraph}>
                        Some situations are too complex for standard calculators:
                    </Text>

                    <View style={styles.warningCard}>
                        <Text style={styles.warningCardTitle}>⚠️ Lower Accuracy Situations:</Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Self-employment:</Text> Services Australia may add back business
                            expenses (depreciation, home office, vehicle)
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Trusts or companies:</Text> Income attribution rules may apply,
                            assessing you on income you didn't personally receive
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Overseas income:</Text> Exchange rates, tax treaties, and
                            verification issues
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Change of Assessment:</Text> Special circumstances that justify
                            departure from formula
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Income fluctuations:</Text> Significant year-to-year variations
                            may trigger earning capacity assessments
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>High-value assets:</Text> Lifestyle doesn't match reported income
                        </Text>
                    </View>

                    <View style={styles.dangerBox}>
                        <Text style={styles.dangerTitle}>🚨 When to Get Legal Advice:</Text>
                        <Text style={styles.dangerText}>
                            If your calculator result seems too low or too high compared to your financial reality,
                            or if any of the above complexity factors apply, get professional advice. A calculator
                            can't account for legal arguments or special circumstances.
                        </Text>
                    </View>

                    <View style={styles.internalLinkBox}>
                        <Text style={styles.internalLinkTitle}>📚 Related Reading:</Text>
                        <Pressable
                            style={[styles.internalLink, isWeb && webClickableStyles]}
                            onPress={() => router.push('/blog/complicated-child-support-situations')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.internalLinkText}>
                                8 Situations That Need Legal Advice →
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.internalLink, isWeb && webClickableStyles]}
                            onPress={() => router.push('/blog/when-to-hire-family-lawyer')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.internalLinkText}>
                                When to Hire a Family Lawyer →
                            </Text>
                        </Pressable>
                    </View>

                    {/* Common Calculator Mistakes */}
                    <Text style={styles.h2} accessibilityRole="header">5 Common Calculator Mistakes to Avoid</Text>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>1.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Using Gross Income Instead of Taxable Income</Text>
                            <Text style={styles.mistakeText}>
                                Gross income is before deductions. Taxable income is after. Using gross income will
                                overestimate child support by 10-30%. Always use the taxable income from your tax return.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>2.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Counting Nights Incorrectly</Text>
                            <Text style={styles.mistakeText}>
                                Count overnight stays, not daytime hours. If children sleep at your house 52 nights/year,
                                that's 14% care—even if you see them during the day more often. Care is based on where
                                children sleep.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>3.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Forgetting Reportable Fringe Benefits</Text>
                            <Text style={styles.mistakeText}>
                                Company car? Salary packaging? These are reportable fringe benefits and must be included
                                in income. Check your tax return or payslip for "reportable fringe benefits" amount.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>4.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Not Including All Children</Text>
                            <Text style={styles.mistakeText}>
                                If you have children from multiple relationships, all must be included. The calculator
                                adjusts for multi-case situations using Formula 3.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>5.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Assuming Calculator = Official Assessment</Text>
                            <Text style={styles.mistakeText}>
                                Calculators provide estimates. Services Australia's official assessment is binding.
                                Use calculators for planning, but don't rely on them for legal or financial decisions
                                without verification.
                            </Text>
                        </View>
                    </View>

                    {/* Calculator vs Services Australia */}
                    <Text style={styles.h2} accessibilityRole="header">Calculator Estimate vs Services Australia Assessment</Text>
                    <Text style={styles.paragraph}>
                        Understanding the difference between an estimate and an official assessment:
                    </Text>

                    <View style={styles.comparisonCard}>
                        <Text style={styles.comparisonTitle}>Calculator Estimate:</Text>
                        <Text style={styles.bulletItem}>• Instant results (3-5 minutes)</Text>
                        <Text style={styles.bulletItem}>• Free, no registration</Text>
                        <Text style={styles.bulletItem}>• Based on information you provide</Text>
                        <Text style={styles.bulletItem}>• Not legally binding</Text>
                        <Text style={styles.bulletItem}>• Good for planning and budgeting</Text>
                        <Text style={styles.bulletItem}>• May not account for complex factors</Text>
                    </View>

                    <View style={styles.comparisonCard}>
                        <Text style={styles.comparisonTitle}>Services Australia Assessment:</Text>
                        <Text style={styles.bulletItem}>• Takes 2-4 weeks to process</Text>
                        <Text style={styles.bulletItem}>• Requires formal application</Text>
                        <Text style={styles.bulletItem}>• Verified through ATO and other sources</Text>
                        <Text style={styles.bulletItem}>• Legally binding and enforceable</Text>
                        <Text style={styles.bulletItem}>• Required for child support collection</Text>
                        <Text style={styles.bulletItem}>• Can be appealed if incorrect</Text>
                    </View>

                    <View style={styles.tipBox}>
                        <Text style={styles.tipTitle}>💡 Best Practice:</Text>
                        <Text style={styles.tipText}>
                            Use a calculator first to understand what to expect. Then apply for an official assessment
                            through Services Australia. If the official assessment differs significantly from your
                            calculator estimate, review the assessment carefully or get legal advice.
                        </Text>
                    </View>

                    {/* Contextual Wizard */}
                    <ContextualWizard
                        preselectedFactors={[]}
                        highlightedFactors={['income_resources_not_reflected', 'hiding_income', 'property_settlement']}
                        blogTopic="accurate_calculator"
                        ctaText="Get Expert Help With Complex Calculations"
                        analyticsSource="blog_accurate_calculator"
                        formReason="special_circumstances"
                        title="Is Your Situation Too Complex for a Calculator?"
                        description="If your case involves any of these factors, professional advice ensures accuracy. Most lawyers offer free initial consultations."
                    />

                    {/* FAQ */}
                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <FAQItem
                        question="Is there a free accurate child support calculator for Australia?"
                        answer="Yes. Our calculator uses the official 2026 Services Australia formula with current rates and thresholds. It handles standard cases (Formulas 1-3) and provides instant estimates. For complex cases involving self-employment, trusts, or Change of Assessment, the calculator flags when you need professional advice."
                    />

                    <FAQItem
                        question="How accurate is an online child support calculator?"
                        answer="Online calculators are accurate for standard cases where both parents are wage earners with verifiable income. Accuracy decreases for complex situations: self-employment (expenses may be added back), trusts or companies (income attribution), overseas income, or Change of Assessment factors. Use calculators for estimates, not legal advice."
                    />

                    <FAQItem
                        question="What information do I need to use a child support calculator?"
                        answer="You need: both parents' taxable income (from tax returns), number of children and their ages, care arrangement (nights per year with each parent), any relevant dependents, other child support cases (if applicable), and whether either parent receives income support. The calculator takes 3-5 minutes to complete."
                    />

                    <FAQItem
                        question="Why is my calculator estimate different from Services Australia's assessment?"
                        answer="Common reasons: 1) You used gross income instead of taxable income, 2) Services Australia added back business expenses (if self-employed), 3) Care arrangement was calculated differently, 4) Income information was outdated, or 5) Special circumstances apply. Review the official assessment details or get legal advice if the difference is significant."
                    />

                    <FAQItem
                        question="Can I use a calculator estimate in court?"
                        answer="No. Calculator estimates are not legal documents and cannot be used as evidence in court. You need an official Services Australia assessment or a lawyer's calculation with supporting documentation. Calculators are for planning purposes only."
                    />

                    {/* Try Calculator CTA */}
                    <View style={styles.calculatorSection}>
                        <Text style={styles.calculatorTitle}>Try Our Free Calculator</Text>
                        <Text style={styles.calculatorText}>
                            Get an instant, accurate estimate using the official 2026 Services Australia formula.
                            Takes under 5 minutes. No registration required.
                        </Text>
                        <Pressable
                            style={[styles.calculatorButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.calculatorButtonText}>Calculate Now</Text>
                        </Pressable>
                        <Text style={styles.calculatorFeatures}>
                            ✓ 2026 rates  ✓ All formulas  ✓ Instant results  ✓ Complexity detection
                        </Text>
                    </View>

                    {/* Final CTA */}
                    <View style={styles.finalCtaSection}>
                        <Text style={styles.finalCtaTitle}>Need Help With Complex Child Support?</Text>
                        <Text style={styles.finalCtaText}>
                            If your calculator estimate seems off, or your situation involves self-employment, trusts,
                            or disputes, connect with experienced family lawyers who specialize in child support cases.
                        </Text>
                        <View style={styles.trustSignalsBox}>
                            <Text style={styles.trustSignalItem}>✓ Most lawyers respond within 24 hours</Text>
                            <Text style={styles.trustSignalItem}>✓ Free initial consultations available</Text>
                            <Text style={styles.trustSignalItem}>✓ No obligation to proceed</Text>
                        </View>
                        <Pressable
                            style={[styles.primaryButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.primaryButtonText}>Speak to a Specialist</Text>
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
    bold: { fontWeight: '600', color: '#1e3a8a' },

    ctaBox: { backgroundColor: '#2563EB', borderRadius: 12, padding: 24, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    ctaBoxTitle: { fontSize: 20, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
    ctaBoxText: { fontSize: 15, lineHeight: 24, color: '#ffffff', marginBottom: 16, textAlign: 'center' },
    ctaBoxButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 28 },
    ctaBoxButtonText: { color: '#2563EB', fontSize: 16, fontWeight: '700' },

    checklistCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    checklistTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },

    warningBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderWidth: 1, borderColor: '#bfdbfe', padding: 16, marginBottom: 16 },
    warningTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#1e3a8a' },

    stepCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 }) },
    stepTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginTop: 12, marginBottom: 8 },

    tipBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    tipTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    tipText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    linkButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 20, marginBottom: 16, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    linkButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },

    resultsCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    resultsTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },

    exampleCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }) },
    exampleTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    exampleText: { fontSize: 14, color: '#475569', marginBottom: 4 },
    exampleCalc: { fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: '#64748b', marginBottom: 4, paddingLeft: 8 },
    exampleResult: { fontSize: 16, fontWeight: '700', color: '#2563EB', marginTop: 8 },

    greenCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    greenCardTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },

    warningCard: { backgroundColor: '#f1f5f9', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#cbd5e1' },
    warningCardTitle: { fontSize: 16, fontWeight: '600', color: '#475569', marginBottom: 12 },

    dangerBox: { backgroundColor: '#dbeafe', borderRadius: 12, borderWidth: 2, borderColor: '#3b82f6', padding: 20, marginBottom: 16, ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    dangerTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    dangerText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    ctaButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 20, marginBottom: 16, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    ctaButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },

    mistakeCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    mistakeNumber: { fontSize: 24, fontWeight: '700', color: '#2563EB', marginRight: 12, width: 32 },
    mistakeContent: { flex: 1 },
    mistakeTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginBottom: 4 },
    mistakeText: { fontSize: 14, lineHeight: 22, color: '#475569' },

    comparisonCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 }) },
    comparisonTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },

    faqItem: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    faqQuestion: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    faqAnswer: { fontSize: 15, lineHeight: 24, color: '#475569' },

    calculatorSection: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 24, marginTop: 32, marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: '#bfdbfe' },
    calculatorTitle: { fontSize: 22, fontWeight: '700', color: '#1e3a8a', marginBottom: 12, textAlign: 'center' },
    calculatorText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 20, textAlign: 'center' },
    calculatorButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 32, marginBottom: 12, ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    calculatorButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
    calculatorFeatures: { fontSize: 13, color: '#64748b', textAlign: 'center' },

    finalCtaSection: { backgroundColor: '#1e3a8a', borderRadius: 12, padding: 28, marginTop: 32, alignItems: 'center', ...createShadow({ shadowColor: '#1e3a8a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    finalCtaTitle: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 12, textAlign: 'center' },
    finalCtaText: { fontSize: 16, lineHeight: 26, color: '#bfdbfe', marginBottom: 20, textAlign: 'center' },
    trustSignalsBox: { marginBottom: 24, alignItems: 'flex-start', width: '100%', maxWidth: 400 },
    trustSignalItem: { fontSize: 14, color: '#e0e7ff', marginBottom: 8, lineHeight: 20 },
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 32, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 18, fontWeight: '700' },

    internalLinkBox: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginVertical: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    internalLinkTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },
    internalLink: { paddingVertical: 8 },
    internalLinkText: { fontSize: 15, color: '#2563EB', fontWeight: '500' },
});
