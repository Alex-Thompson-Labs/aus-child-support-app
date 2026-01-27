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
            name: 'How far back can child support be backdated in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'For first-time applications, child support starts from your application date. For Change of Assessment applications (income changes, care changes), backdating up to 18 months is possible. Apply as soon as possible after separation to avoid losing time.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I get backdated child support if I never applied before?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'First-time applications start from the date you apply—not backdated. If you separated 2 years ago but apply today, child support starts today. Apply immediately after separation to maximize your claim period.',
            },
        },
        {
            '@type': 'Question',
            name: 'Do I have to pay backdated child support immediately?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. Backdated amounts become arrears. Services Australia typically sets up a payment plan where you pay current child support PLUS installments toward arrears. Lump sum payment is possible but not required.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Backdating Child Support Australia: How Far Back Can You Claim?',
    description: 'Can child support be backdated? Learn the 18-month rule, how to apply, what evidence you need, and how backdated payments are collected.',
    datePublished: '2026-01-24',
    author: { '@type': 'Organization', name: 'AusChildSupport' },
};

export default function BackdatingChildSupportAustraliaBlogPost() {
    const router = useRouter();
    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="Backdating Child Support Australia 2026: How Far Back Can You Claim?"
                description="Claim up to 18 months backdated child support—but only if you apply now. See evidence requirements + collection process. Don't miss the window."
                canonicalPath="/blog/backdating-child-support-australia"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Backdating' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Backdating</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            Backdating Child Support Australia: How Far Back Can You Claim?
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        Just separated and wondering if you can claim child support for the past year? Or did you
                        delay applying and now want to recover missed payments? Here's exactly how child support
                        start dates work in Australia, when the 18-month backdating rule applies, and how to maximize your claim.
                    </Text>

                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            First-time applications start from your application date. Change of Assessment applications can be backdated up to 18 months. Apply immediately after separation to avoid losing time.
                        </Text>
                        <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.quickAnswerButtonText}>Calculate Your Amount →</Text>
                        </Pressable>
                    </View>

                    <View style={styles.keyRuleBox}>
                        <Text style={styles.keyRuleTitle}>🔑 Key Rule:</Text>
                        <Text style={styles.keyRuleText}>
                            First-time child support applications start from the date you apply—NOT backdated. The 18-month backdating rule applies to Change of Assessment applications (income changes, care changes). Apply immediately after separation to avoid losing time.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">When does child support start in Australia?</Text>
                    <Text style={styles.paragraph}>
                        For first-time applications, child support starts from the date you lodge your application with Services Australia. If you separated 2 years ago but apply today, child support starts today—not from your separation date. This is why applying immediately after separation is critical.
                    </Text>

                    <Text style={styles.h2} accessibilityRole="header">The 18-Month Backdating Rule Explained</Text>
                    <Text style={styles.paragraph}>
                        The 18-month backdating rule applies to Change of Assessment applications—when you're requesting changes to an existing assessment due to income changes, care changes, or special circumstances. If you apply for a Change of Assessment on January 1, 2026, Services Australia can backdate the change to July 1, 2024 (18 months earlier). This is a hard limit—you cannot claim further back without court approval.
                    </Text>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Example 1: First-Time Application (Applied Quickly)</Text>
                        <Text style={styles.exampleText}>Separated: January 1, 2025</Text>
                        <Text style={styles.exampleText}>Applied for child support: June 1, 2025 (5 months later)</Text>
                        <Text style={styles.exampleResult}>Assessment starts: June 1, 2025 (application date)</Text>
                        <Text style={styles.exampleNote}>You lose 5 months because assessment starts from application date, not separation</Text>
                    </View>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Example 2: First-Time Application (Delayed)</Text>
                        <Text style={styles.exampleText}>Separated: January 1, 2024</Text>
                        <Text style={styles.exampleText}>Applied for child support: January 1, 2026 (24 months later)</Text>
                        <Text style={styles.exampleResult}>Assessment starts: January 1, 2026 (application date)</Text>
                        <Text style={styles.exampleNote}>You lose 24 months of child support because you waited to apply</Text>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Critical Timing:</Text>
                        <Text style={styles.warningText}>
                            Apply for child support immediately after separation. First-time applications start from your application date—NOT your separation date. Every month you delay is a month of child support you permanently lose. You cannot "catch up" later.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">When the 18-Month Backdating Rule Applies</Text>
                    <Text style={styles.paragraph}>
                        The 18-month backdating rule applies to Change of Assessment applications, not first-time applications:
                    </Text>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>1. First-Time Application (NO Backdating)</Text>
                        <Text style={styles.scenarioText}>
                            You've never applied for child support before. Your assessment starts from the date you apply—NOT your separation date. There is no backdating for first-time applications.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Separated 10 months ago, applying now → Assessment starts today (you lose 10 months)
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>2. Change of Assessment: Income Change</Text>
                        <Text style={styles.scenarioText}>
                            You have an existing assessment. The paying parent's income increased significantly but they didn't report it. You can apply for a Change of Assessment with backdating up to 18 months.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Parent's income increased from $60K to $120K in 2024. You discover this in January 2026. Apply for Change of Assessment → Backdated to July 2024 (18 months).
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>3. Change of Assessment: Care Change</Text>
                        <Text style={styles.scenarioText}>
                            You have an existing assessment. Care arrangements changed but weren't updated with Services Australia. You can apply for a Change of Assessment with backdating up to 18 months.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Child moved in with you full-time 12 months ago but assessment wasn't updated. Apply for Change of Assessment now → Backdated 12 months.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>4. Paternity Established (First Application)</Text>
                        <Text style={styles.scenarioText}>
                            Paternity was disputed and recently established through DNA test or court order. This is a first-time application, so child support starts from your application date—not backdated.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            DNA test confirms paternity in January 2026. Apply immediately → Assessment starts January 2026 (application date).
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">When You Need Legal Help With Backdating</Text>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>1</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Proving Income Changes</Text>
                            <Text style={styles.stepText}>
                                If the other parent's income increased but they didn't report it, you need to prove the income change occurred and when. This often requires accessing tax records, business financials, or employment records—evidence the other parent may not voluntarily provide.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>2</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Documenting Care Changes</Text>
                            <Text style={styles.stepText}>
                                To backdate a care percentage change, you need documented evidence of when actual care changed: school records, medical appointments, witness statements, communication logs. Weak evidence means Services Australia may reject backdating.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>3</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Applying for Court Leave (Beyond 18 Months)</Text>
                            <Text style={styles.stepText}>
                                If you need backdating beyond 18 months, you must apply to Family Court for leave. This requires demonstrating exceptional circumstances, fraud, or concealment. Court applications require legal representation.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>4</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Responding to Objections</Text>
                            <Text style={styles.stepText}>
                                The other parent can object to your Change of Assessment application. If they dispute your evidence or the backdating period, you may need legal representation to defend your claim and maximize your backdating.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Don't Risk Losing Thousands:</Text>
                        <Text style={styles.warningText}>
                            Weak evidence or incorrect application timing can result in Services Australia rejecting your backdating claim. A single mistake could cost you months or years of child support. Get expert help to maximize your claim.
                        </Text>
                    </View>

                    <Pressable
                        style={[styles.ctaButton, isWeb && webClickableStyles]}
                        onPress={() => router.push('/lawyer-inquiry?mode=direct')}
                        accessibilityRole="button"
                    >
                        <Text style={styles.ctaButtonText}>Get Expert Help With Your Backdating Claim →</Text>
                    </Pressable>

                    <View style={styles.evidenceCard}>
                        <Text style={styles.evidenceTitle}>Evidence to Provide:</Text>
                        <Text style={styles.bulletItem}>• Separation agreement or court order</Text>
                        <Text style={styles.bulletItem}>• Bank statements showing financial separation</Text>
                        <Text style={styles.bulletItem}>• Care records (school pickups, medical appointments)</Text>
                        <Text style={styles.bulletItem}>• Communication with other parent (texts, emails)</Text>
                        <Text style={styles.bulletItem}>• Income evidence (tax returns, payslips)</Text>
                        <Text style={styles.bulletItem}>• Paternity test results (if applicable)</Text>
                    </View>

                    <Pressable
                        style={[styles.ctaButton, isWeb && webClickableStyles]}
                        onPress={() => router.push('/lawyer-inquiry?mode=direct')}
                        accessibilityRole="button"
                    >
                        <Text style={styles.ctaButtonText}>Get Legal Help With Change of Assessment →</Text>
                    </Pressable>

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

                    <Text style={styles.h2} accessibilityRole="header">How Backdated Amounts Are Collected</Text>
                    <Text style={styles.paragraph}>
                        When a Change of Assessment is approved with backdating, the additional amount owed becomes arrears. Services Australia collects it through:
                    </Text>

                    <View style={styles.collectionCard}>
                        <Text style={styles.collectionTitle}>Collection Methods:</Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Payment Plan:</Text> Pay current child support + arrears installments
                            (e.g., $2,000/month current + $500/month arrears)
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Lump Sum:</Text> Pay entire backdated amount immediately (voluntary)
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Tax Refund Intercept:</Text> ATO redirects tax refund to child support
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Wage Garnishment:</Text> Employer deducts from wages automatically
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Enforcement:</Text> If unpaid, Services Australia can suspend
                            passports, register property charges, or take legal action
                        </Text>
                    </View>

                    <View style={styles.timelineCard}>
                        <Text style={styles.timelineTitle}>Typical Payment Timeline:</Text>
                        <Text style={styles.timelineText}>
                            Backdated amount (arrears): $20,000 | Current child support: $2,000/month | Arrears installment: $500/month
                        </Text>
                        <Text style={styles.timelineResult}>
                            Total monthly payment: $2,500 | Time to clear arrears: 40 months (~3.3 years)
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Common Mistakes About Backdating</Text>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>1.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Waiting Too Long to Apply</Text>
                            <Text style={styles.mistakeText}>
                                Separated 3 years ago, applying now? You lose 3 years of child support. First-time applications start from your application date—NOT your separation date. Apply immediately after separation.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>2.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Not Providing Evidence for Change of Assessment</Text>
                            <Text style={styles.mistakeText}>
                                When applying for a Change of Assessment with backdating, Services Australia needs proof of when circumstances changed (income evidence, care records). Without evidence, they may not approve backdating.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>3.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Confusing First Applications with Change of Assessment</Text>
                            <Text style={styles.mistakeText}>
                                First-time applications start from your application date—no backdating. The 18-month backdating rule only applies to Change of Assessment applications for existing assessments.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>4.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Not Updating Care Changes Promptly</Text>
                            <Text style={styles.mistakeText}>
                                If care arrangements change, update Services Australia immediately. Waiting to update limits how far back you can claim adjusted payments (maximum 18 months for Change of Assessment).
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Exceptions to the 18-Month Rule</Text>
                    <Text style={styles.paragraph}>
                        In rare cases, backdating beyond 18 months is possible:
                    </Text>

                    <View style={styles.exceptionCard}>
                        <Text style={styles.exceptionTitle}>Exception 1: Court Leave for Extended Backdating</Text>
                        <Text style={styles.exceptionText}>
                            You can apply to Family Court for leave to backdate a Change of Assessment beyond 18 months (up to 7 years). The court may grant leave if there's evidence of fraud, concealment, or exceptional circumstances that prevented earlier application.
                        </Text>
                    </View>

                    <View style={styles.exceptionCard}>
                        <Text style={styles.exceptionTitle}>Exception 2: Court Orders</Text>
                        <Text style={styles.exceptionText}>
                            Family Court can make orders for child support that apply to periods beyond the normal 18-month limit. This typically requires evidence of special circumstances or misconduct by the other parent.
                        </Text>
                    </View>

                    <View style={styles.exceptionCard}>
                        <Text style={styles.exceptionTitle}>Exception 3: Child Support Agreements Set Aside</Text>
                        <Text style={styles.exceptionText}>
                            If you had a Binding Child Support Agreement that was later set aside by the court, the administrative assessment may apply from when the agreement started, potentially extending beyond 18 months.
                        </Text>
                    </View>

                    <View style={styles.adviceBox}>
                        <Text style={styles.adviceTitle}>💡 Get Legal Advice:</Text>
                        <Text style={styles.adviceText}>
                            If you believe you qualify for an exception, consult a family lawyer immediately. These
                            cases are complex and require strong evidence.
                        </Text>
                    </View>

                    {/* Contextual Wizard */}
                    <ContextualWizard
                        preselectedFactors={['change_circumstances']}
                        highlightedFactors={['income_resources_not_reflected', 'care_arrangement_change']}
                        blogTopic="backdating"
                        ctaText="Get Help With Change of Assessment"
                        analyticsSource="blog_backdating_child_support"
                        formReason="special_circumstances"
                        title="Need Help With Change of Assessment?"
                        description="Change of Assessment applications with backdating require strong evidence and proper documentation. Select any factors that apply to your situation."
                    />

                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <FAQItem
                        question="How far back can child support be backdated in Australia?"
                        answer="For first-time applications, child support starts from your application date—no backdating. For Change of Assessment applications (income changes, care changes), backdating up to 18 months is possible. If you apply for a Change of Assessment on January 1, 2026, Services Australia can backdate to July 1, 2024."
                    />

                    <FAQItem
                        question="Can I get backdated child support if I never applied before?"
                        answer="No. First-time applications start from the date you apply—not backdated. If your child is 10 years old and you never applied, child support starts from today's application date. You cannot claim the previous 10 years. Apply immediately after separation to avoid losing time."
                    />

                    <FAQItem
                        question="Do I have to pay backdated child support immediately?"
                        answer="No. Backdated amounts (from Change of Assessment applications) become arrears. Services Australia typically sets up a payment plan where you pay current child support PLUS installments toward arrears. Lump sum payment is possible but not required."
                    />

                    <FAQItem
                        question="What if I didn't know I had to apply for child support?"
                        answer="Ignorance doesn't change the rules. First-time applications start from your application date. Even if you didn't know you needed to apply, you cannot claim child support for periods before you applied. Apply immediately after separation to avoid losing time."
                    />

                    <FAQItem
                        question="Can backdated child support be waived?"
                        answer="Only if both parents agree through a Binding Child Support Agreement. The receiving parent can choose not to pursue arrears from Change of Assessment backdating, but this must be formalized. Services Australia won't automatically waive arrears."
                    />

                    <View style={styles.calculatorSection}>
                        <Text style={styles.calculatorTitle}>Calculate Your Child Support</Text>
                        <Text style={styles.calculatorText}>
                            Use our free calculator to estimate your child support assessment. This helps you understand
                            how much backdated child support you might owe or receive.
                        </Text>
                        <Pressable
                            style={[styles.calculatorButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.calculatorButtonText}>Calculate Now</Text>
                        </Pressable>
                    </View>

                    <View style={styles.finalCtaSection}>
                        <Text style={styles.finalCtaTitle}>Need Help With Child Support Timing or Change of Assessment?</Text>
                        <Text style={styles.finalCtaText}>
                            Connect with experienced family lawyers who can help you apply for child support immediately after separation, or apply for Change of Assessment with backdating for income or care changes.
                        </Text>
                        <View style={styles.trustSignalsBox}>
                            <Text style={styles.trustSignalItem}>✓ Specialists in Change of Assessment applications</Text>
                            <Text style={styles.trustSignalItem}>✓ Help gathering evidence and documentation</Text>
                            <Text style={styles.trustSignalItem}>✓ Free initial consultations available</Text>
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
    paragraph: { fontSize: 16, lineHeight: 26, color: '#475569', marginBottom: 16 },
    bulletItem: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8, paddingLeft: 8 },
    bold: { fontWeight: '600', color: '#1e3a8a' },


    quickAnswerBox: { backgroundColor: '#2563eb', borderRadius: 12, padding: 20, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    quickAnswerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
    quickAnswerText: { fontSize: 15, lineHeight: 24, color: '#ffffff', marginBottom: 16, textAlign: 'center' },
    quickAnswerButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
    quickAnswerButtonText: { color: '#2563eb', fontSize: 16, fontWeight: '700' },

    keyRuleBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderWidth: 2, borderColor: '#3b82f6', padding: 20, marginBottom: 24, ...createShadow({ shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }) },
    keyRuleTitle: { fontSize: 18, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
    keyRuleText: { fontSize: 15, lineHeight: 24, color: '#1e40af' },

    exampleCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    exampleTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    exampleText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 4 },
    exampleResult: { fontSize: 15, lineHeight: 24, color: '#1e3a8a', fontWeight: '600', marginTop: 8 },
    exampleNote: { fontSize: 14, lineHeight: 22, color: '#64748b', fontStyle: 'italic', marginTop: 4 },

    warningBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#f59e0b', padding: 16, marginBottom: 16 },
    warningTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    scenarioCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    scenarioTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    scenarioText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8 },
    scenarioExample: { fontSize: 14, lineHeight: 22, color: '#64748b', fontStyle: 'italic', paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },

    stepCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    stepNumber: { fontSize: 24, fontWeight: '700', color: '#2563EB', marginRight: 16, width: 32 },
    stepContent: { flex: 1 },
    stepTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    stepText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    evidenceCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    evidenceTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 12 },

    collectionCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    collectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 12 },

    timelineCard: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    timelineTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    timelineText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8 },
    timelineResult: { fontSize: 15, lineHeight: 24, color: '#1e3a8a', fontWeight: '600' },

    mistakeCard: { flexDirection: 'row', backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#dc2626' },
    mistakeNumber: { fontSize: 20, fontWeight: '700', color: '#dc2626', marginRight: 12, width: 24 },
    mistakeContent: { flex: 1 },
    mistakeTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 6 },
    mistakeText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    exceptionCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    exceptionTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    exceptionText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    adviceBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderWidth: 1, borderColor: '#3b82f6', padding: 16, marginBottom: 16 },
    adviceTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
    adviceText: { fontSize: 15, lineHeight: 24, color: '#1e40af' },

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
    trustSignalsBox: { marginBottom: 24, alignItems: 'flex-start', width: '100%', maxWidth: 400 },
    trustSignalItem: { fontSize: 14, color: '#bfdbfe', marginBottom: 8, lineHeight: 20 },
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 16, fontWeight: '600' },

    internalLinkBox: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginVertical: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    internalLinkTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },
    internalLink: { paddingVertical: 8 },
    internalLinkText: { fontSize: 15, color: '#2563EB', fontWeight: '500' },
});
