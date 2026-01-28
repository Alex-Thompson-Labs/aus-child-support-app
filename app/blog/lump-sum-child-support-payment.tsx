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
            name: 'Can I pay child support as a lump sum in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, typically through a Binding Child Support Agreement or Court Order. The payment creates a credit balance with Services Australia that cancels out your annual liability. The remaining credit is indexed by CPI annually to keep pace with inflation.',
            },
        },
        {
            '@type': 'Question',
            name: 'How much should a lump sum child support payment be?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Calculate the total child support you\'d pay until the child turns 18, then discount it to present value (typically 5-7% annually). For example, $2,000/month for 10 years = $240,000 total, discounted to ~$180,000-200,000 lump sum.',
            },
        },
        {
            '@type': 'Question',
            name: 'What are the risks of lump sum child support payments?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Major risks: 1) Cannot get refund if circumstances change, 2) Receiving parent may mismanage funds, 3) If agreement is set aside, you may owe more, 4) No flexibility for income changes. Get legal advice before agreeing.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Lump Sum Child Support Payment Australia: How It Works (2026)',
    description: 'Considering a lump sum child support payment? Learn how to calculate it, legal requirements, tax implications, and risks before making this permanent decision.',
    datePublished: '2026-01-24',
    author: { '@type': 'Organization', name: 'AusChildSupport' },
};

export default function LumpSumChildSupportPaymentBlogPost() {
    const router = useRouter();
    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="Lump Sum Child Support Payment Australia 2026 | Guide"
                description="Lump sum = permanent—no refunds if circumstances change. $240k over 10 years = $180-200k today. See calculation + risks. Get legal advice before agreeing."
                canonicalPath="/blog/lump-sum-child-support-payment"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Lump Sum Payments' },
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
                        <Text style={styles.category}>Payment Options</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            Lump Sum Child Support Payment Australia: How It Works (2026)
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        Want to pay all your child support at once and be done with it? Lump sum payments are possible
                        in Australia—but they're complex, permanent, and risky. Here's everything you need to know
                        before making this major financial decision.
                    </Text>

                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            A lump sum payment creates a "credit balance" with Services Australia. Your future
                            liabilities are deducted from this credit annually. The unused balance grows with CPI
                            inflation each year.
                        </Text>
                        <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.quickAnswerButtonText}>Calculate Annual Amount →</Text>
                        </Pressable>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Critical Warning:</Text>
                        <Text style={styles.warningText}>
                            Lump sum payments are PERMANENT. You cannot get a refund if your circumstances change,
                            the child dies, or the receiving parent mismanages the money. Get legal and financial
                            advice before proceeding.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">What Is a Lump Sum Child Support Payment?</Text>
                    <Text style={styles.paragraph}>
                        Technically, a lump sum payment creates a credit on your Child Support account. Each year,
                        your annual liability is deducted from this credit instead of you paying cash. While most
                        parents use it to cover the entire period until age 18 ("clean break"), it can be for any
                        amount equal to or greater than your current annual rate.
                    </Text>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Example:</Text>
                        <Text style={styles.exampleText}>Standard assessment: $2,000/month for 10 years</Text>
                        <Text style={styles.exampleText}>Total: $2,000 × 12 months × 10 years = $240,000</Text>
                        <Text style={styles.exampleText}>Lump sum (discounted): $180,000-200,000</Text>
                        <Text style={styles.exampleText}>CPI Indexation: Remaining credit grows with inflation</Text>
                        <Text style={styles.exampleNote}>
                            The credit balance held by the agency is indexed by CPI annually, protecting its value over time.
                        </Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Legal Requirements</Text>
                    <Text style={styles.paragraph}>
                        You cannot simply pay a lump sum and walk away. It must be formalized through a Binding Child
                        Support Agreement (most common) or a Court Order:
                    </Text>

                    <View style={styles.requirementCard}>
                        <Text style={styles.bulletItem}>• Both parents must agree in writing</Text>
                        <Text style={styles.bulletItem}>• Each parent gets independent legal advice</Text>
                        <Text style={styles.bulletItem}>• Agreement registered with Services Australia</Text>
                        <Text style={styles.bulletItem}>• Legal certificates attached</Text>
                        <Text style={styles.bulletItem}>• Agreement specifies lump sum amount and terms</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        Without a Binding Agreement, the lump sum is just a gift—it doesn't discharge your child
                        support obligations. Learn more about{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/binding-child-support-agreement')}
                        >
                            binding child support agreements
                        </Text>.
                    </Text>

                    <Text style={styles.h2} accessibilityRole="header">How to Calculate a Lump Sum Payment</Text>
                    <Text style={styles.paragraph}>
                        Calculating a fair lump sum requires projecting future payments and discounting to present value:
                    </Text>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>1</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Calculate Total Future Payments</Text>
                            <Text style={styles.stepText}>
                                Use the current child support formula to estimate monthly payments. Multiply by the
                                number of months until the child turns 18.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>2</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Account for Income Changes</Text>
                            <Text style={styles.stepText}>
                                If your income is likely to increase, factor in higher future payments. If it's likely
                                to decrease, factor in lower payments.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>3</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Apply Discount Rate</Text>
                            <Text style={styles.stepText}>
                                Discount future payments to present value. Since your credit balance with the
                                agency increases by CPI each year, you should negotiate a discount that reflects
                                this benefit.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>4</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Negotiate Final Amount</Text>
                            <Text style={styles.stepText}>
                                The paying parent wants a higher discount (lower lump sum). The receiving parent wants
                                a lower discount (higher lump sum). Negotiate a fair middle ground.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.calculationCard}>
                        <Text style={styles.calculationTitle}>Sample Calculation:</Text>
                        <Text style={styles.calculationText}>Current assessment: $2,000/month</Text>
                        <Text style={styles.calculationText}>Child's age: 8 (10 years remaining)</Text>
                        <Text style={styles.calculationText}>Total undiscounted: $2,000 × 12 × 10 = $240,000</Text>
                        <Text style={styles.calculationText}>Discount rate: 6% per annum</Text>
                        <Text style={styles.calculationResult}>Present value: ~$190,000</Text>
                        <Text style={styles.calculationNote}>
                            This is a simplified calculation. Get a financial advisor to calculate precise present value.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">When Lump Sum Payments Make Sense</Text>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>1. Property Settlement</Text>
                        <Text style={styles.scenarioText}>
                            One parent keeps the family home or receives a larger property share in exchange for a
                            lump sum child support payment.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Example: Parent A keeps $800,000 home. Parent B pays $200,000 lump sum child support
                            instead of monthly payments.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>2. Emigrating Overseas</Text>
                        <Text style={styles.scenarioText}>
                            Paying parent is moving overseas permanently. Lump sum avoids international enforcement
                            issues and currency fluctuations.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Example: Parent moving to USA pays $250,000 lump sum to avoid ongoing AUD/USD transfers
                            and enforcement complications.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>3. Business Sale or Windfall</Text>
                        <Text style={styles.scenarioText}>
                            Paying parent receives large one-time payment (business sale, inheritance, lottery). Uses
                            windfall to discharge all child support obligations.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Example: Parent sells business for $2M. Pays $300,000 lump sum child support to avoid
                            future assessments on business income.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>4. High-Conflict Relationship</Text>
                        <Text style={styles.scenarioText}>
                            Parents cannot communicate civilly. Lump sum eliminates ongoing financial contact and
                            disputes over payments.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Example: Parents have restraining orders. Lump sum payment allows complete financial
                            separation.
                        </Text>
                    </View>

                    <Pressable
                        style={[styles.ctaButton, isWeb && webClickableStyles]}
                        accessibilityRole="link" onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=binding_agreement')}
                    >
                        <Text style={styles.ctaButtonText}>Get Legal Advice on Lump Sum Payments →</Text>
                    </Pressable>

                    <Text style={styles.h2} accessibilityRole="header">Risks and Disadvantages</Text>

                    <View style={styles.riskCard}>
                        <Text style={styles.riskTitle}>🚨 Risk 1: No Refunds</Text>
                        <Text style={styles.riskText}>
                            If the child dies, moves in with you full-time, or the receiving parent remarries and
                            circumstances change, you cannot get a refund. The money is gone.
                        </Text>
                    </View>

                    <View style={styles.riskCard}>
                        <Text style={styles.riskTitle}>🚨 Risk 2: Mismanagement</Text>
                        <Text style={styles.riskText}>
                            The receiving parent may spend the lump sum irresponsibly. If they blow it on a car or
                            holiday, you still have no ongoing obligation—but your child suffers.
                        </Text>
                    </View>

                    <View style={styles.riskCard}>
                        <Text style={styles.riskTitle}>🚨 Risk 3: Agreement Set Aside</Text>
                        <Text style={styles.riskText}>
                            If the lump sum is grossly inadequate or the agreement is unfair, courts can set it aside.
                            You may then owe additional child support PLUS the lump sum you already paid.
                        </Text>
                    </View>

                    <View style={styles.riskCard}>
                        <Text style={styles.riskTitle}>🚨 Risk 4: Income Changes</Text>
                        <Text style={styles.riskText}>
                            If your income drops significantly (job loss, illness), you're still locked into the lump
                            sum. No flexibility for changed circumstances.
                        </Text>
                    </View>

                    <View style={styles.riskCard}>
                        <Text style={styles.riskTitle}>🚨 Risk 5: Tax Implications</Text>
                        <Text style={styles.riskText}>
                            Lump sum payments may trigger capital gains tax if funded by asset sales. Consult a tax
                            advisor before proceeding.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Tax Implications</Text>
                    <Text style={styles.paragraph}>
                        Child support payments (including lump sums) are generally not tax-deductible for the payer
                        and not taxable income for the receiver. However:
                    </Text>

                    <View style={styles.taxCard}>
                        <Text style={styles.taxTitle}>Tax Considerations:</Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Capital Gains Tax:</Text> If you sell assets to fund the lump
                            sum, CGT may apply
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Property Settlement:</Text> Lump sum as part of property
                            settlement may have different tax treatment
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Superannuation:</Text> Cannot use super to pay lump sum child
                            support (except in limited circumstances)
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Investment Income:</Text> Receiving parent's investment income
                            from lump sum is taxable
                        </Text>
                    </View>

                    <View style={styles.adviceBox}>
                        <Text style={styles.adviceTitle}>💡 Get Professional Advice:</Text>
                        <Text style={styles.adviceText}>
                            Consult both a family lawyer AND a tax advisor before agreeing to a lump sum payment.
                            Tax implications can be significant.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Alternatives to Lump Sum Payments</Text>
                    <Text style={styles.paragraph}>
                        Before committing to a lump sum, consider these alternatives:
                    </Text>

                    <View style={styles.alternativeCard}>
                        <Text style={styles.alternativeTitle}>1. Prepayment (Not Lump Sum)</Text>
                        <Text style={styles.alternativeText}>
                            Pay 12-24 months of child support in advance. This provides security for the receiving
                            parent without the permanence of a lump sum.
                        </Text>
                    </View>

                    <View style={styles.alternativeCard}>
                        <Text style={styles.alternativeTitle}>2. Trust Fund</Text>
                        <Text style={styles.alternativeText}>
                            Establish a trust fund for the child's benefit. Trustee manages funds and distributes
                            according to trust terms. Protects against mismanagement.
                        </Text>
                    </View>

                    <View style={styles.alternativeCard}>
                        <Text style={styles.alternativeTitle}>3. Property Transfer</Text>
                        <Text style={styles.alternativeText}>
                            Transfer property (house, investment property) to the receiving parent instead of cash.
                            Provides long-term security and potential appreciation.
                        </Text>
                    </View>

                    <View style={styles.alternativeCard}>
                        <Text style={styles.alternativeTitle}>4. Binding Agreement with Review Clause</Text>
                        <Text style={styles.alternativeText}>
                            Set fixed monthly payments through Binding Agreement but include review clauses for
                            significant income changes. More flexible than lump sum.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <FAQItem
                        question="Can I pay child support as a lump sum in Australia?"
                        answer="Yes, through a Binding Child Support Agreement or Court Order. The payment sits as a credit on your account and is used to pay your annual liability. The remaining credit balance is indexed by CPI each year."
                    />

                    <FAQItem
                        question="How much should a lump sum child support payment be?"
                        answer="Calculate the total child support you'd pay until the child turns 18, then discount it to present value (typically 5-7% annually). For example, $2,000/month for 10 years = $240,000 total, discounted to ~$180,000-200,000 lump sum."
                    />

                    <FAQItem
                        question="What are the risks of lump sum child support payments?"
                        answer="Major risks: 1) Cannot get refund if circumstances change, 2) Receiving parent may mismanage funds, 3) If agreement is set aside, you may owe more, 4) No flexibility for income changes. Get legal advice before agreeing."
                    />

                    <FAQItem
                        question="Can I get a refund if my child dies after a lump sum payment?"
                        answer="No. Lump sum payments are permanent. If the child dies, you cannot get a refund. This is one of the major risks of lump sum payments. Consider life insurance on the child to mitigate this risk."
                    />

                    <FAQItem
                        question="Is a lump sum child support payment tax-deductible?"
                        answer="No. Child support payments (including lump sums) are not tax-deductible for the payer. They're also not taxable income for the receiver. However, if you sell assets to fund the lump sum, capital gains tax may apply."
                    />

                    <View style={styles.calculatorSection}>
                        <Text style={styles.calculatorTitle}>Calculate Your Child Support First</Text>
                        <Text style={styles.calculatorText}>
                            Before negotiating a lump sum, calculate your standard monthly child support. This is
                            the baseline for determining a fair lump sum amount.
                        </Text>
                        <Pressable
                            style={[styles.calculatorButton, isWeb && webClickableStyles]}
                            accessibilityRole="link" onPress={() => router.push('/')}
                        >
                            <Text style={styles.calculatorButtonText}>Calculate Now</Text>
                        </Pressable>
                    </View>

                    <View style={styles.finalCtaSection}>
                        <Text style={styles.finalCtaTitle}>Need Legal Advice on Lump Sum Payments?</Text>
                        <Text style={styles.finalCtaText}>
                            Connect with experienced family lawyers who can draft Binding Agreements, calculate fair
                            lump sums, and protect your interests. Most offer free initial consultations with no
                            obligation to proceed.
                        </Text>
                        <Pressable
                            style={[styles.primaryButton, isWeb && webClickableStyles]}
                            accessibilityRole="link" onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=binding_agreement')}
                        >
                            <Text style={styles.primaryButtonText}>Get Legal Help</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </SafeAreaView >
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

    quickAnswerBox: { backgroundColor: '#2563eb', borderRadius: 12, padding: 20, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    quickAnswerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
    quickAnswerText: { fontSize: 15, lineHeight: 24, color: '#ffffff', marginBottom: 16, textAlign: 'center' },
    quickAnswerButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
    quickAnswerButtonText: { color: '#2563eb', fontSize: 16, fontWeight: '700' },

    bulletItem: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8, paddingLeft: 8 },
    bold: { fontWeight: '600', color: '#1e3a8a' },

    warningBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#f59e0b', padding: 20, marginBottom: 24 },
    warningTitle: { fontSize: 18, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    exampleCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    exampleTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
    exampleText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 4 },
    exampleNote: { fontSize: 14, lineHeight: 22, color: '#64748b', fontStyle: 'italic', marginTop: 8 },

    requirementCard: { backgroundColor: '#f0f9ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bae6fd' },

    stepCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    stepNumber: { fontSize: 24, fontWeight: '700', color: '#2563EB', marginRight: 16, width: 32 },
    stepContent: { flex: 1 },
    stepTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    stepText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    calculationCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    calculationTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 12 },
    calculationText: { fontSize: 15, lineHeight: 24, color: '#1e40af', marginBottom: 4 },
    calculationResult: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#bfdbfe' },
    calculationNote: { fontSize: 14, lineHeight: 22, color: '#1e40af', fontStyle: 'italic', marginTop: 8 },

    scenarioCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    scenarioTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    scenarioText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8 },
    scenarioExample: { fontSize: 14, lineHeight: 22, color: '#64748b', fontStyle: 'italic', paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },

    riskCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#dc2626' },
    riskTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
    riskText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    taxCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    taxTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 12 },

    adviceBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderWidth: 1, borderColor: '#3b82f6', padding: 16, marginBottom: 16 },
    adviceTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
    adviceText: { fontSize: 15, lineHeight: 24, color: '#1e40af' },

    alternativeCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    alternativeTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    alternativeText: { fontSize: 15, lineHeight: 24, color: '#475569' },

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
    finalCtaText: { fontSize: 15, lineHeight: 24, color: '#bfdbfe', marginBottom: 20, textAlign: 'center' },
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 16, fontWeight: '600' },
    inlineLink: { color: '#2563EB', fontWeight: '600', textDecorationLine: 'underline' },
});
