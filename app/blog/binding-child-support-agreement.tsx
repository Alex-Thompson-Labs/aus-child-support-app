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
            name: 'What is a Binding Child Support Agreement in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'A Binding Child Support Agreement is a legally enforceable contract between parents that sets child support amounts outside the standard formula. Both parents must get independent legal advice before signing. Once registered, it overrides Services Australia assessments.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I set child support to $0 in a Binding Agreement?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, but it\'s risky. You can agree to $0 child support if both parents consent and get legal advice. However, if circumstances change significantly, the receiving parent can apply to set it aside. Courts scrutinize $0 agreements closely.',
            },
        },
        {
            '@type': 'Question',
            name: 'How do I cancel a Binding Child Support Agreement?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'You cannot unilaterally cancel a Binding Agreement. Options: 1) Both parents agree to terminate it, 2) Apply to court to set it aside (requires proof of fraud, duress, or significant change in circumstances), 3) Wait for expiry date if one exists.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Binding Child Support Agreement Australia: Complete Guide (2026)',
    description: 'Considering a Binding Child Support Agreement? Learn how they work, legal requirements, risks, and when to use them instead of the standard formula.',
    datePublished: '2026-01-24',
    author: { '@type': 'Organization', name: 'AusChildSupport' },
};

export default function BindingChildSupportAgreementBlogPost() {
    const router = useRouter();
    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="Binding Child Support Agreement Australia 2026 Guide"
                description="Binding agreements are permanent—no refunds if circumstances change. See legal requirements + $2,500-6,500 costs. Get legal advice before signing any agreement."
                canonicalPath="/blog/binding-child-support-agreement"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Binding Agreements' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Agreements</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            Binding Child Support Agreement Australia: Complete Guide (2026)
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        Want to set child support amounts outside the standard formula? A Binding Child Support Agreement
                        lets you do that—but it's legally complex and permanent. Here's everything you need to know
                        before signing one, including requirements, risks, and when it makes sense.
                    </Text>

                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            A Binding Child Support Agreement lets parents set their own child support amount outside the formula. Both need legal advice, and it must be fair. Calculate the standard formula amount first.
                        </Text>
                        <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.quickAnswerButtonText}>Calculate Your Amount →</Text>
                        </Pressable>
                    </View>


                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Critical Warning:</Text>
                        <Text style={styles.warningText}>
                            Binding Agreements are PERMANENT and legally enforceable. You cannot cancel them unilaterally.
                            Both parents must get independent legal advice before signing. Don't sign without understanding
                            the long-term consequences.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">What Is a Binding Child Support Agreement?</Text>
                    <Text style={styles.paragraph}>
                        A Binding Child Support Agreement (BCA) is a legally enforceable contract between parents that
                        sets child support amounts, payment methods, and terms outside the Services Australia formula.
                    </Text>

                    <View style={styles.definitionCard}>
                        <Text style={styles.definitionTitle}>Key Characteristics:</Text>
                        <Text style={styles.bulletItem}>• Overrides the standard child support formula</Text>
                        <Text style={styles.bulletItem}>• Legally binding once signed and registered</Text>
                        <Text style={styles.bulletItem}>• Requires independent legal advice for both parents</Text>
                        <Text style={styles.bulletItem}>• Can set amounts higher or lower than formula (including $0)</Text>
                        <Text style={styles.bulletItem}>• Can include non-cash payments (school fees, mortgage)</Text>
                        <Text style={styles.bulletItem}>• Enforceable through courts if breached</Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Binding vs Limited Agreements</Text>
                    <Text style={styles.paragraph}>
                        There are two types of child support agreements in Australia:
                    </Text>

                    <View style={styles.comparisonCard}>
                        <Text style={styles.comparisonTitle}>Binding Agreement:</Text>
                        <Text style={styles.bulletItem}>• Requires independent legal advice (both parents)</Text>
                        <Text style={styles.bulletItem}>• Can deviate significantly from formula</Text>
                        <Text style={styles.bulletItem}>• Very difficult to change or cancel</Text>
                        <Text style={styles.bulletItem}>• More expensive ($2,000-5,000+ in legal fees)</Text>
                    </View>

                    <View style={styles.comparisonCard}>
                        <Text style={styles.comparisonTitle}>Limited Agreement:</Text>
                        <Text style={styles.bulletItem}>• No legal advice required</Text>
                        <Text style={styles.bulletItem}>• Must be at least the formula amount (cannot be less)</Text>
                        <Text style={styles.bulletItem}>• Easier to change or terminate</Text>
                        <Text style={styles.bulletItem}>• Less expensive (can DIY)</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        This guide focuses on Binding Agreements, which are more complex but offer greater flexibility.
                    </Text>

                    <Text style={styles.paragraph}>
                        Before considering a Binding Agreement, understand{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/child-support-reduction-strategies')}
                        >
                            legal strategies to reduce child support
                        </Text>
                        {' '}to see if simpler options might work for your situation.
                    </Text>

                    <Text style={styles.h2} accessibilityRole="header">Legal Requirements for Binding Agreements</Text>
                    <Text style={styles.paragraph}>
                        To be valid, a Binding Child Support Agreement must meet strict legal requirements:
                    </Text>

                    <View style={styles.requirementCard}>
                        <Text style={styles.requirementNumber}>1</Text>
                        <View style={styles.requirementContent}>
                            <Text style={styles.requirementTitle}>Independent Legal Advice</Text>
                            <Text style={styles.requirementText}>
                                Both parents must receive legal advice from separate lawyers. Each lawyer must certify
                                that they explained the agreement's effect, advantages, disadvantages, and rights.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.requirementCard}>
                        <Text style={styles.requirementNumber}>2</Text>
                        <View style={styles.requirementContent}>
                            <Text style={styles.requirementTitle}>Written Agreement</Text>
                            <Text style={styles.requirementText}>
                                Must be in writing and signed by both parents. Verbal agreements are not enforceable.
                                The document must clearly state child support amounts, payment frequency, and duration.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.requirementCard}>
                        <Text style={styles.requirementNumber}>3</Text>
                        <View style={styles.requirementContent}>
                            <Text style={styles.requirementTitle}>Legal Certificates Attached</Text>
                            <Text style={styles.requirementText}>
                                Each parent's lawyer must provide a signed certificate confirming they gave independent
                                legal advice. Without these certificates, the agreement is invalid.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.requirementCard}>
                        <Text style={styles.requirementNumber}>4</Text>
                        <View style={styles.requirementContent}>
                            <Text style={styles.requirementTitle}>Registration with Services Australia</Text>
                            <Text style={styles.requirementText}>
                                The agreement must be registered with Services Australia to be enforceable. Unregistered
                                agreements are not legally binding.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.costCard}>
                        <Text style={styles.costTitle}>💰 Investment Required:</Text>
                        <Text style={styles.bulletItem}>• Legal advice: $1,000-2,500 per parent</Text>
                        <Text style={styles.bulletItem}>• Agreement drafting: $500-1,500</Text>
                        <Text style={styles.bulletItem}>• Registration: Free (Services Australia)</Text>
                        <Text style={styles.costTotal}>Total: $2,500-6,500 for both parents</Text>
                        <Text style={styles.costContext}>
                            Estimated legal costs based on market rates. Actual costs vary by firm and complexity. Compare to $10,000-30,000+ in court costs if challenged later, or years of incorrect payments under the standard formula. Many firms offer fixed-fee packages.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">When to Use a Binding Agreement</Text>
                    <Text style={styles.paragraph}>
                        Binding Agreements make sense in specific situations where the standard formula doesn't fit:
                    </Text>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>1. High-Income Earners</Text>
                        <Text style={styles.scenarioText}>
                            If one parent earns significantly above the child support cap ($175,455 in 2026), you can
                            agree to higher payments that reflect actual costs (private school, extracurriculars).
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Example: Parent earns $500,000. Formula caps at $175,455. Agreement sets $5,000/month to
                            cover private school and activities.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>2. Property Settlement Trade-Off</Text>
                        <Text style={styles.scenarioText}>
                            One parent keeps the family home or receives larger property settlement in exchange for
                            reduced or $0 child support.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Example: Parent A keeps $800,000 home. Parent B agrees to $0 child support for 5 years
                            as part of property settlement.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>3. Non-Cash Payments</Text>
                        <Text style={styles.scenarioText}>
                            Paying parent covers specific expenses directly (school fees, mortgage, health insurance)
                            instead of cash payments.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Example: Parent pays $30,000/year private school fees + $15,000 mortgage instead of
                            $3,750/month cash.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>4. Business Owners / Self-Employed</Text>
                        <Text style={styles.scenarioText}>
                            Income fluctuates significantly. Agreement sets fixed amount to avoid annual reassessments
                            and disputes over business income.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Example: Business owner's income varies $50,000-200,000. Agreement fixes child support at
                            $2,500/month regardless of annual income.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>5. Shared Care with Equal Incomes</Text>
                        <Text style={styles.scenarioText}>
                            Parents have 50/50 care and similar incomes. Agreement sets $0 child support to avoid
                            administrative hassle for minimal payments.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Example: Both parents earn $70,000, 50/50 care. Formula would result in $50/month.
                            Agreement sets $0 to simplify.
                        </Text>
                    </View>

                    <View style={styles.ctaWithNote}>
                        <Pressable
                            style={[styles.ctaButton, isWeb && webClickableStyles]}
                            accessibilityRole="link" onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=binding_agreement')}
                        >
                            <Text style={styles.ctaButtonText}>Get Legal Advice on Binding Agreements →</Text>
                        </Pressable>
                        <Text style={styles.ctaNote}>Free initial consultation • Fixed-fee quotes available</Text>
                    </View>

                    <ContextualWizard
                        preselectedFactors={['property_settlement']}
                        highlightedFactors={['binding_agreement']}
                        blogTopic="binding_agreement"
                        ctaText="Get Your Agreement Drafted – Fixed Fee Quote"
                        analyticsSource="blog_binding_agreement"
                        formReason="binding_agreement"
                        title="Ready to Formalize Your Agreement?"
                        description="Binding agreements must meet strict legal requirements. Select any factors that apply to your situation."
                    />

                    <Text style={styles.h2} accessibilityRole="header">Risks and Disadvantages</Text>
                    <Text style={styles.paragraph}>
                        Binding Agreements are permanent and inflexible. Consider these risks before signing:
                    </Text>

                    <View style={styles.riskCard}>
                        <Text style={styles.riskTitle}>🚨 Risk 1: Cannot Cancel Unilaterally</Text>
                        <Text style={styles.riskText}>
                            Once signed, you cannot cancel the agreement just because you changed your mind. You're
                            locked in unless both parents agree to terminate or you successfully apply to court to
                            set it aside (very difficult).
                        </Text>
                    </View>

                    <View style={styles.riskCard}>
                        <Text style={styles.riskTitle}>🚨 Risk 2: Circumstances Change</Text>
                        <Text style={styles.riskText}>
                            If your income drops, you lose your job, or have more children, the agreement doesn't
                            automatically adjust. You're still obligated to pay the agreed amount.
                        </Text>
                    </View>

                    <View style={styles.riskCard}>
                        <Text style={styles.riskTitle}>🚨 Risk 3: Unfair Agreements Can Be Set Aside</Text>
                        <Text style={styles.riskText}>
                            If the agreement is grossly unfair (e.g., $0 child support with no property trade-off),
                            courts can set it aside. This creates uncertainty and legal costs.
                        </Text>
                    </View>

                    <View style={styles.riskCard}>
                        <Text style={styles.riskTitle}>🚨 Risk 4: Enforcement Issues</Text>
                        <Text style={styles.riskText}>
                            If the paying parent breaches the agreement, the receiving parent must enforce it through
                            courts (expensive and time-consuming). Services Australia won't automatically collect.
                        </Text>
                    </View>

                    <View style={styles.riskCard}>
                        <Text style={styles.riskTitle}>🚨 Risk 5: Legal Costs</Text>
                        <Text style={styles.riskText}>
                            Both parents must pay for independent legal advice ($2,500-6,500 total). If the agreement
                            is later challenged, additional legal costs can reach $10,000-30,000+.
                        </Text>
                    </View>

                    <Text style={styles.paragraph}>
                        If you're facing these risks and need help, consider{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/when-to-hire-family-lawyer')}
                        >
                            when to hire a family lawyer
                        </Text>
                        {' '}to protect your rights and navigate the legal process.
                    </Text>

                    <Text style={styles.h2} accessibilityRole="header">How to Create a Binding Agreement</Text>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>1</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Calculate Standard Formula First</Text>
                            <Text style={styles.stepText}>
                                Use a calculator to determine what you'd pay under the standard formula. This is your
                                baseline for negotiation.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.calculatorCta}>
                        <Text style={styles.calculatorCtaTitle}>📊 Step 1: Calculate Standard Formula</Text>
                        <Text style={styles.calculatorCtaText}>
                            Before negotiating, know your baseline. Use our free calculator to see what you'd pay under
                            the standard formula.
                        </Text>
                        <Pressable
                            style={[styles.calculatorCtaButton, isWeb && webClickableStyles]}
                            accessibilityRole="link" onPress={() => router.push('/')}
                        >
                            <Text style={styles.calculatorCtaButtonText}>Calculate Child Support →</Text>
                        </Pressable>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>2</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Negotiate Terms</Text>
                            <Text style={styles.stepText}>
                                Discuss with the other parent: amount, payment frequency, duration, non-cash payments,
                                review clauses, termination conditions.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>3</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Each Parent Gets Legal Advice</Text>
                            <Text style={styles.stepText}>
                                Hire separate family lawyers. Each lawyer reviews the agreement, explains consequences,
                                and provides a signed certificate.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>4</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Draft and Sign Agreement</Text>
                            <Text style={styles.stepText}>
                                Lawyer drafts the agreement. Both parents sign. Legal certificates are attached.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>5</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Register with Services Australia</Text>
                            <Text style={styles.stepText}>
                                Submit the signed agreement and legal certificates to Services Australia. They review
                                and register it (usually 4-8 weeks).
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>6</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Agreement Takes Effect</Text>
                            <Text style={styles.stepText}>
                                Once registered, the agreement overrides the standard formula. Payments begin according
                                to agreed terms.
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">How to Cancel or Change a Binding Agreement</Text>
                    <Text style={styles.paragraph}>
                        Canceling a Binding Agreement is difficult. Your options:
                    </Text>

                    <View style={styles.optionCard}>
                        <Text style={styles.optionTitle}>Option 1: Mutual Agreement to Terminate</Text>
                        <Text style={styles.optionText}>
                            Both parents agree in writing to end the agreement. This requires cooperation and usually
                            legal advice to draft a termination agreement.
                        </Text>
                        <Text style={styles.optionPros}>✓ Fastest and cheapest if both agree</Text>
                        <Text style={styles.optionCons}>✗ Requires other parent's cooperation</Text>
                    </View>

                    <View style={styles.optionCard}>
                        <Text style={styles.optionTitle}>Option 2: Apply to Court to Set Aside</Text>
                        <Text style={styles.optionText}>
                            Apply to Family Court to have the agreement set aside. You must prove fraud, duress,
                            unconscionable conduct, or significant change in circumstances.
                        </Text>
                        <Text style={styles.optionPros}>✓ Can work if agreement is grossly unfair</Text>
                        <Text style={styles.optionCons}>✗ Expensive ($10,000-30,000+ legal costs)</Text>
                        <Text style={styles.optionCons}>✗ High bar to prove (most applications fail)</Text>
                    </View>

                    <View style={styles.optionCard}>
                        <Text style={styles.optionTitle}>Option 3: Wait for Expiry</Text>
                        <Text style={styles.optionText}>
                            If the agreement has an expiry date, wait for it to end. Then revert to standard formula
                            or negotiate a new agreement.
                        </Text>
                        <Text style={styles.optionPros}>✓ No legal costs</Text>
                        <Text style={styles.optionCons}>✗ Only works if agreement has expiry date</Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <FAQItem
                        question="What is a Binding Child Support Agreement in Australia?"
                        answer="A Binding Child Support Agreement is a legally enforceable contract between parents that sets child support amounts outside the standard formula. Both parents must get independent legal advice before signing. Once registered, it overrides Services Australia assessments."
                    />

                    <FAQItem
                        question="Can I set child support to $0 in a Binding Agreement?"
                        answer="Yes, technically possible. You can agree to $0 child support if both parents consent and get independent legal advice. However, if the agreement is unfair or circumstances change significantly, the receiving parent can apply to court to set it aside. $0 agreements should have a clear justification (e.g., property settlement trade-off)."
                    />

                    <FAQItem
                        question="How do I cancel a Binding Child Support Agreement?"
                        answer="You cannot unilaterally cancel a Binding Agreement. Options: 1) Both parents agree to terminate it, 2) Apply to court to set it aside (requires proof of fraud, duress, or significant change in circumstances), 3) Wait for expiry date if one exists."
                    />

                    <FAQItem
                        question="Do I need a lawyer for a Binding Agreement?"
                        answer="Yes. Both parents must receive independent legal advice from separate lawyers. Each lawyer must provide a signed certificate. Without these certificates, the agreement is invalid and unenforceable."
                    />

                    <FAQItem
                        question="How much does a Binding Agreement cost?"
                        answer="Estimated $2,500-6,500 total for both parents based on market rates. This includes legal advice ($1,000-2,500 per parent) and agreement drafting ($500-1,500). Registration with Services Australia is free. Actual costs vary by firm and complexity. Many firms offer fixed-fee packages. Compare this to $10,000-30,000+ in court costs if an unfair agreement is challenged later."
                    />

                    <View style={styles.calculatorSection}>
                        <Text style={styles.calculatorTitle}>Calculate Standard Formula First</Text>
                        <Text style={styles.calculatorText}>
                            Before negotiating a Binding Agreement, calculate what you'd pay under the standard formula.
                            This is your baseline for negotiation.
                        </Text>
                        <Pressable
                            style={[styles.calculatorButton, isWeb && webClickableStyles]}
                            accessibilityRole="link" onPress={() => router.push('/')}
                        >
                            <Text style={styles.calculatorButtonText}>Calculate Now</Text>
                        </Pressable>
                    </View>

                    <View style={styles.finalCtaSection}>
                        <Text style={styles.finalCtaTitle}>Need Legal Advice on Binding Agreements?</Text>
                        <Text style={styles.finalCtaText}>
                            Our partner lawyers specialize in Binding Child Support Agreements. They can draft, review,
                            or challenge agreements to protect your interests.
                        </Text>
                        <View style={styles.finalCtaTrustSignals}>
                            <Text style={styles.finalCtaTrustItem}>✓ Independent legal advice (required by law)</Text>
                            <Text style={styles.finalCtaTrustItem}>✓ Experience with complex agreements</Text>
                            <Text style={styles.finalCtaTrustItem}>✓ Free initial consultations • Fixed-fee quotes</Text>
                            <Text style={styles.finalCtaTrustItem}>✓ Confidential case assessment</Text>
                        </View>
                        <Pressable
                            style={[styles.primaryButton, isWeb && webClickableStyles]}
                            accessibilityRole="link" onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=binding_agreement')}
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
    bold: { fontWeight: '600', color: '#1e3a8a' },


    quickAnswerBox: { backgroundColor: '#2563eb', borderRadius: 12, padding: 20, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    quickAnswerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
    quickAnswerText: { fontSize: 15, lineHeight: 24, color: '#ffffff', marginBottom: 16, textAlign: 'center' },
    quickAnswerButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
    quickAnswerButtonText: { color: '#2563eb', fontSize: 16, fontWeight: '700' },

    warningBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#f59e0b', padding: 16, marginBottom: 16 },
    warningTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    definitionCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    definitionTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 12 },

    comparisonCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    comparisonTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 12 },

    requirementCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    requirementNumber: { fontSize: 24, fontWeight: '700', color: '#2563EB', marginRight: 16, width: 32 },
    requirementContent: { flex: 1 },
    requirementTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    requirementText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    costCard: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    costTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 12 },
    costTotal: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
    costContext: { fontSize: 14, lineHeight: 22, color: '#64748b', marginTop: 12, fontStyle: 'italic' },

    scenarioCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    scenarioTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    scenarioText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8 },
    scenarioExample: { fontSize: 14, lineHeight: 22, color: '#64748b', fontStyle: 'italic', paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },

    riskCard: { backgroundColor: '#eff6ff', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#dc2626', padding: 16, marginBottom: 16 },
    riskTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
    riskText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    stepCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    stepNumber: { fontSize: 24, fontWeight: '700', color: '#2563EB', marginRight: 16, width: 32 },
    stepContent: { flex: 1 },
    stepTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    stepText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    optionCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    optionTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    optionText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8 },
    optionPros: { fontSize: 14, lineHeight: 22, color: '#2563EB', marginBottom: 4 },
    optionCons: { fontSize: 14, lineHeight: 22, color: '#64748b', marginBottom: 4 },

    ctaWithNote: { marginVertical: 16, alignItems: 'center' },
    ctaButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    ctaButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
    ctaNote: { fontSize: 13, color: '#64748b', marginTop: 8, textAlign: 'center', fontStyle: 'italic' },

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

    // Trust box styles (for legal advice CTA)
    trustBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, marginTop: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }) },
    trustTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },
    trustText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8 },
    trustButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 20, marginTop: 16, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    trustButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },

    // Calculator CTA styles
    calculatorCta: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, marginTop: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    calculatorCtaTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },
    calculatorCtaText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 16 },
    calculatorCtaButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    calculatorCtaButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },

    // Inline link style (for internal links)
    inlineLink: { color: '#2563EB', fontWeight: '600', textDecorationLine: 'underline' },

    // Final CTA trust signals
    finalCtaTrustSignals: { marginBottom: 20, alignSelf: 'stretch' },
    finalCtaTrustItem: { fontSize: 14, lineHeight: 22, color: '#bfdbfe', marginBottom: 6, textAlign: 'center' },
});
