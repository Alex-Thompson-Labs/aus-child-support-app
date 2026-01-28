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
            name: 'Can I reduce my child support payments in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, through legal methods: 1) Apply for Change of Assessment if circumstances changed significantly, 2) Increase your care percentage, 3) Apply for departure if income dropped, 4) Challenge incorrect income assessment, 5) Negotiate binding agreement. Illegal methods (hiding income, quitting job) result in penalties.',
            },
        },
        {
            '@type': 'Question',
            name: 'What are valid grounds to reduce child support?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Valid grounds: significant income reduction (job loss, illness), increased care of children, new dependents (relevant dependents), high costs of contact, special needs care costs, other parent has high income/resources. Must provide evidence. Frivolous applications are rejected.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Child Support Reduction: 7 Legal Ways to Lower Your Payments',
    description: '7 legal strategies to reduce child support in Australia. Learn valid grounds, application process, and what doesn\'t work. Includes real examples and success rates.',
    datePublished: '2026-01-24',
    author: { '@type': 'Organization', name: 'AusChildSupport' },
};

export default function ChildSupportReductionStrategiesBlogPost() {
    const router = useRouter();
    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="Reduce Child Support Payments Australia 2026 | 7 Legal Ways"
                description="Reduce child support legally—not by hiding income. 7 strategies with 40-80% success rates. Change of Assessment + care increases. See your options now."
                canonicalPath="/blog/child-support-reduction-strategies"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Reduction Strategies' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Reduction Strategies</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            Child Support Reduction: 7 Legal Ways to Lower Your Payments
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        Paying too much child support? There are legal ways to reduce payments—but also many illegal
                        methods that backfire. Here are 7 legitimate strategies, what works, what doesn't, and how
                        to apply without triggering penalties. Note: Outcomes vary by individual circumstances and evidence quality.
                    </Text>

                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            Legal ways to reduce child support include increasing care time, applying for Change of Assessment, or updating income estimates. Avoid illegal strategies that risk penalties. Calculate your current amount below.
                        </Text>
                        <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.quickAnswerButtonText}>Calculate Your Amount →</Text>
                        </Pressable>
                    </View>


                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Legal vs Illegal:</Text>
                        <Text style={styles.warningText}>
                            This guide covers LEGAL reduction strategies. Hiding income, quitting your job, or
                            deliberately reducing earnings to avoid child support is illegal and results in penalties,
                            arrears, and potential criminal charges.
                        </Text>
                    </View>

                    {/* Featured Snippet Optimization */}
                    <Text style={styles.h2} accessibilityRole="header">Can I Reduce Child Support in Australia?</Text>
                    <Text style={styles.paragraph}>
                        Yes, you can reduce child support in Australia through three main ways: 1) Increase your care time (more nights = lower payments), 2) Apply for a Change of Assessment if special circumstances exist (high contact costs, child's income, etc.), or 3) Negotiate a binding child support agreement with the other parent. Simply earning less or having a new baby doesn't automatically reduce payments.
                    </Text>

                    {/* 7 Legal Strategies */}
                    <Text style={styles.h2} accessibilityRole="header">7 Legal Ways to Reduce Child Support</Text>

                    <View style={styles.strategyCard}>
                        <Text style={styles.strategyNumber}>1</Text>
                        <View style={styles.strategyContent}>
                            <Text style={styles.strategyTitle}>Apply for Change of Assessment</Text>
                            <Text style={styles.strategyText}>
                                If your circumstances changed significantly since the last assessment, apply for
                                Change of Assessment. Valid grounds include income reduction, new dependents, high
                                contact costs, or special needs care. Outcomes depend on evidence quality and case specifics.
                            </Text>
                            <Text style={styles.strategyTime}>Timeline: 2-4 months</Text>
                        </View>
                    </View>

                    <ContextualWizard
                        preselectedFactors={['income_resources_not_reflected']}
                        highlightedFactors={['change_circumstances', 'high_costs', 'care_arrangement_change']}
                        blogTopic="reduction"
                        ctaText="Challenge Your Assessment"
                        analyticsSource="blog_reduction_strategies"
                        formReason="special_circumstances"
                        title="Want to Reduce Your Child Support?"
                        description="Select factors that apply. Our partner lawyers specialize in Change of Assessment applications."
                    />

                    <View style={styles.strategyCard}>
                        <Text style={styles.strategyNumber}>2</Text>
                        <View style={styles.strategyContent}>
                            <Text style={styles.strategyTitle}>Increase Your Care Percentage</Text>
                            <Text style={styles.strategyText}>
                                More nights with children = lower child support. Increasing from 14% to 35% care
                                (52 to 128 nights/year) can significantly reduce payments. Must be genuine care increase,
                                not manipulation. Requires documentation and agreement or court order.
                            </Text>
                            <Text style={styles.strategyTime}>Timeline: Immediate upon agreement</Text>
                        </View>
                    </View>

                    <View style={styles.strategyCard}>
                        <Text style={styles.strategyNumber}>3</Text>
                        <View style={styles.strategyContent}>
                            <Text style={styles.strategyTitle}>Challenge Incorrect Income Assessment</Text>
                            <Text style={styles.strategyText}>
                                If Services Australia used wrong income (old tax return, incorrect fringe benefits),
                                provide updated evidence. Common errors: using gross instead of taxable income,
                                including one-time bonuses as ongoing income. Corrections are straightforward when errors are proven.
                            </Text>
                            <Text style={styles.strategyTime}>Timeline: 4-8 weeks</Text>
                        </View>
                    </View>

                    <View style={styles.strategyCard}>
                        <Text style={styles.strategyNumber}>4</Text>
                        <View style={styles.strategyContent}>
                            <Text style={styles.strategyTitle}>Update Income Estimate for Reduced Earnings</Text>
                            <Text style={styles.strategyText}>
                                If income dropped significantly (job loss, illness, business failure), lodge an income
                                estimate or apply for Change of Assessment. Must show income reduction is genuine and not
                                deliberate to avoid child support. Requires evidence of changed circumstances.
                            </Text>
                            <Text style={styles.strategyTime}>Timeline: 2-3 months</Text>
                        </View>
                    </View>

                    <View style={styles.strategyCard}>
                        <Text style={styles.strategyNumber}>5</Text>
                        <View style={styles.strategyContent}>
                            <Text style={styles.strategyTitle}>Claim Relevant Dependents</Text>
                            <Text style={styles.strategyText}>
                                If you have other children (new relationship, stepchildren you support), claim them
                                as relevant dependents. This reduces your child support income based on the Cost of Children
                                table (amount varies by your income and number of dependents). Notify Services Australia within 28 days.
                            </Text>
                            <Text style={styles.strategyTime}>Timeline: Next assessment (or backdated if notified within 28 days)</Text>
                        </View>
                    </View>

                    <View style={styles.strategyCard}>
                        <Text style={styles.strategyNumber}>6</Text>
                        <View style={styles.strategyContent}>
                            <Text style={styles.strategyTitle}>Negotiate Binding Agreement</Text>
                            <Text style={styles.strategyText}>
                                If other parent agrees, negotiate lower amount via Binding Child Support Agreement.
                                Must meet minimum payment thresholds and both parties need independent legal advice.
                                Success depends entirely on the other parent's willingness to negotiate.
                            </Text>
                            <Text style={styles.strategyTime}>Timeline: 1-3 months</Text>
                        </View>
                    </View>

                    <Text style={styles.paragraph}>
                        Binding Agreements are complex legal documents. Learn more about{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/binding-child-support-agreement')}
                        >
                            how Binding Child Support Agreements work
                        </Text>
                        {', including requirements, costs, and risks before pursuing this option.'}
                    </Text>

                    <View style={styles.strategyCard}>
                        <Text style={styles.strategyNumber}>7</Text>
                        <View style={styles.strategyContent}>
                            <Text style={styles.strategyTitle}>Salary Sacrifice to Super (Limited Benefit)</Text>
                            <Text style={styles.strategyText}>
                                Salary sacrificing to superannuation reduces taxable income (up to concessional cap).
                                However, reportable super contributions are added back to child support income, so this
                                provides NO reduction in child support. May reduce tax burden only.
                            </Text>
                            <Text style={styles.strategyTime}>Timeline: Next tax year</Text>
                        </View>
                    </View>

                    <Text style={styles.paragraph}>
                        Complex reduction applications often require legal representation. If you're unsure which strategy
                        is right for you, consider{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/when-to-hire-family-lawyer')}
                        >
                            when to hire a family lawyer
                        </Text>
                        {' '}to maximize your chances of success.
                    </Text>

                    <Pressable style={[styles.ctaButton, isWeb && webClickableStyles]} onPress={() => router.push('/lawyer-inquiry?mode=direct')} accessibilityRole="button">
                        <Text style={styles.ctaButtonText}>Get Legal Advice on Reduction Strategies →</Text>
                    </Pressable>

                    {/* What Doesn't Work */}
                    <Text style={styles.h2} accessibilityRole="header">What DOESN'T Work (And Gets You in Trouble)</Text>

                    <View style={styles.dangerCard}>
                        <Text style={styles.dangerTitle}>❌ Illegal Methods:</Text>
                        <Text style={styles.bulletItem}>• Quitting your job or reducing hours deliberately</Text>
                        <Text style={styles.bulletItem}>• Hiding income (cash payments, offshore accounts)</Text>
                        <Text style={styles.bulletItem}>• Working "under the table"</Text>
                        <Text style={styles.bulletItem}>• Transferring assets to family/friends</Text>
                        <Text style={styles.bulletItem}>• Claiming false business expenses</Text>
                        <Text style={styles.bulletItem}>• Refusing to provide financial records</Text>
                    </View>

                    <View style={styles.consequenceBox}>
                        <Text style={styles.consequenceTitle}>Consequences:</Text>
                        <Text style={styles.bulletItem}>• Earning capacity assessment (based on potential, not actual income)</Text>
                        <Text style={styles.bulletItem}>• Significant financial penalties</Text>
                        <Text style={styles.bulletItem}>• Criminal prosecution for fraud</Text>
                        <Text style={styles.bulletItem}>• Accumulating arrears with penalties</Text>
                        <Text style={styles.bulletItem}>• Enforcement actions (wage garnishment, passport suspension, tax refund intercepts)</Text>
                    </View>

                    <View style={styles.trustBox}>
                        <Text style={styles.trustTitle}>⚠️ Already Tried Illegal Methods? Get Help Now</Text>
                        <Text style={styles.trustText}>
                            If you've already attempted illegal reduction methods, you may be facing penalties or arrears.
                            Our partner lawyers can help you:
                        </Text>
                        <Text style={styles.bulletItem}>• Negotiate payment plans for arrears</Text>
                        <Text style={styles.bulletItem}>• Apply for legitimate reductions going forward</Text>
                        <Text style={styles.bulletItem}>• Respond to Services Australia investigations</Text>
                        <Text style={[styles.trustText, { marginTop: 12 }]}>
                            Early legal intervention can minimize penalties and protect your rights.
                        </Text>
                        <Pressable
                            style={[styles.trustButton, isWeb && webClickableStyles]}
                            accessibilityRole="link" onPress={() => router.push('/lawyer-inquiry?mode=direct')}
                        >
                            <Text style={styles.trustButtonText}>Get Confidential Legal Help →</Text>
                        </Pressable>
                    </View>

                    {/* FAQ */}
                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <FAQItem
                        question="Can I reduce my child support payments in Australia?"
                        answer="Yes, through legal methods: 1) Apply for Change of Assessment if circumstances changed significantly, 2) Increase your care percentage, 3) Apply for departure if income dropped, 4) Challenge incorrect income assessment, 5) Negotiate binding agreement. Illegal methods (hiding income, quitting job) result in penalties."
                    />

                    <FAQItem
                        question="What are valid grounds to reduce child support?"
                        answer="Valid grounds: significant income reduction (job loss, illness), increased care of children, new dependents (relevant dependents), high costs of contact, special needs care costs, other parent has high income/resources. Must provide evidence. Frivolous applications are rejected."
                    />

                    {/* Final CTA */}
                    <View style={styles.finalCtaSection}>
                        <Text style={styles.finalCtaTitle}>Need Help Reducing Child Support?</Text>
                        <Text style={styles.finalCtaText}>
                            Reduction applications require evidence and legal arguments. Our partner lawyers specialize in
                            Change of Assessment applications, income challenges, and binding agreements.
                        </Text>
                        <View style={styles.finalCtaTrustSignals}>
                            <Text style={styles.finalCtaTrustItem}>✓ Free initial consultations available</Text>
                            <Text style={styles.finalCtaTrustItem}>✓ Experience with Services Australia processes</Text>
                            <Text style={styles.finalCtaTrustItem}>✓ No obligation to proceed</Text>
                            <Text style={styles.finalCtaTrustItem}>✓ Confidential case assessment</Text>
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

    warningBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#f59e0b', padding: 16, marginBottom: 16 },
    warningTitle: { fontSize: 15, fontWeight: '600', color: '#1e40af', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    strategyCard: { flexDirection: 'row', backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#bfdbfe' },
    strategyNumber: { fontSize: 24, fontWeight: '700', color: '#2563EB', marginRight: 12, width: 32 },
    strategyContent: { flex: 1 },
    strategyTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 4 },
    strategyText: { fontSize: 14, lineHeight: 22, color: '#475569', marginBottom: 8 },
    strategySuccess: { fontSize: 13, color: '#2563EB', fontWeight: '600', marginBottom: 2 },
    strategyTime: { fontSize: 13, color: '#64748b', fontStyle: 'italic' },

    ctaButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 24, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    ctaButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },

    dangerCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#dc2626' },
    dangerTitle: { fontSize: 16, fontWeight: '600', color: '#1e40af', marginBottom: 12 },

    consequenceBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#dc2626', padding: 20, marginBottom: 24 },
    consequenceTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 12 },

    faqItem: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    faqQuestion: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    faqAnswer: { fontSize: 15, lineHeight: 24, color: '#475569' },

    finalCtaSection: { backgroundColor: '#1e3a8a', borderRadius: 12, padding: 28, marginTop: 32, alignItems: 'center', ...createShadow({ shadowColor: '#1e3a8a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    finalCtaTitle: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 12, textAlign: 'center' },
    finalCtaText: { fontSize: 16, lineHeight: 26, color: '#bfdbfe', marginBottom: 24, textAlign: 'center' },
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 32, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 18, fontWeight: '700' },

    // Info box styles (for Change of Assessment CTA)
    infoBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, marginTop: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    infoTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },
    infoText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 16 },
    infoButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    infoButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },

    // Trust box styles (for illegal methods CTA)
    trustBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, marginTop: 16, marginBottom: 16, borderWidth: 2, borderColor: '#bfdbfe', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    trustTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },
    trustText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8 },
    trustButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 20, marginTop: 16, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    trustButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },

    // Inline link style (for internal links)
    inlineLink: { color: '#2563EB', fontWeight: '600', textDecorationLine: 'underline' },

    // Final CTA trust signals
    finalCtaTrustSignals: { marginBottom: 20, alignSelf: 'stretch' },
    finalCtaTrustItem: { fontSize: 14, lineHeight: 22, color: '#bfdbfe', marginBottom: 6, textAlign: 'center' },
});
