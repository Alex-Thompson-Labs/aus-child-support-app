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
            name: 'How far back can child support be backdated in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Child support can be backdated up to 18 months before the application date. If you apply on January 1, 2026, Services Australia can backdate to July 1, 2024. You cannot claim child support for periods before this 18-month window.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I get backdated child support if I never applied before?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, but only for the 18 months before your application. If your child is 10 years old and you never applied, you can only claim the last 18 months—not the previous 9+ years. Apply as soon as possible to maximize backdating.',
            },
        },
        {
            '@type': 'Question',
            name: 'Do I have to pay backdated child support immediately?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. Backdated child support becomes arrears. Services Australia typically sets up a payment plan where you pay current child support PLUS installments toward the backdated amount. Lump sum payment is possible but not required.',
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
                title="Backdating Child Support Australia: How Far Back Can You Claim?"
                description="Can child support be backdated? Learn the 18-month rule, how to apply, what evidence you need, and how backdated payments are collected."
                canonicalPath="/blog/backdating-child-support-australia"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Backdating' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <CalculatorHeader title="Blog" showBackButton={true} maxWidth={MAX_CALCULATOR_WIDTH} />
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
                        delay applying and now want to recover missed payments? Here's exactly how backdating works 
                        in Australia, the 18-month rule, and how to maximize your claim.
                    </Text>

                    <View style={styles.keyRuleBox}>
                        <Text style={styles.keyRuleTitle}>🔑 Key Rule:</Text>
                        <Text style={styles.keyRuleText}>
                            Child support can be backdated up to 18 months before your application date. You CANNOT 
                            claim child support for periods before this 18-month window, no matter how long you waited.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">The 18-Month Backdating Rule</Text>
                    <Text style={styles.paragraph}>
                        When you apply for child support, Services Australia can backdate the assessment to a maximum 
                        of 18 months before your application date. This is a hard limit—you cannot claim further back.
                    </Text>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Example 1: Applying Within 18 Months</Text>
                        <Text style={styles.exampleText}>Separated: January 1, 2025</Text>
                        <Text style={styles.exampleText}>Applied for child support: June 1, 2025 (5 months later)</Text>
                        <Text style={styles.exampleResult}>Backdated to: January 1, 2025 (separation date)</Text>
                        <Text style={styles.exampleNote}>You get full backdating because you applied within 18 months</Text>
                    </View>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Example 2: Applying After 18 Months</Text>
                        <Text style={styles.exampleText}>Separated: January 1, 2024</Text>
                        <Text style={styles.exampleText}>Applied for child support: January 1, 2026 (24 months later)</Text>
                        <Text style={styles.exampleResult}>Backdated to: July 1, 2024 (18 months before application)</Text>
                        <Text style={styles.exampleNote}>You lose 6 months of child support because you waited too long</Text>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Critical Timing:</Text>
                        <Text style={styles.warningText}>
                            Apply for child support as soon as possible after separation. Every month you delay is a 
                            month you might lose if you wait longer than 18 months. Don't assume you can "catch up" later.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">When Backdating Applies</Text>
                    <Text style={styles.paragraph}>
                        Backdating applies in several situations:
                    </Text>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>1. First-Time Application</Text>
                        <Text style={styles.scenarioText}>
                            You've never applied for child support before. Services Australia backdates to the earlier 
                            of: separation date OR 18 months before application.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Separated 10 months ago, applying now → Backdated to separation date (full 10 months)
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>2. Income Change Not Reported</Text>
                        <Text style={styles.scenarioText}>
                            The paying parent's income increased significantly but they didn't report it. You can apply 
                            for backdating once you discover the income change.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Parent's income increased from $60K to $120K in 2024. You discover this in 2026. Backdated 
                            to 18 months before your application.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>3. Care Percentage Change</Text>
                        <Text style={styles.scenarioText}>
                            Care arrangements changed but weren't updated with Services Australia. You can apply for 
                            backdating to reflect actual care.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Child moved in with you full-time 12 months ago but assessment wasn't updated. Apply now 
                            → Backdated 12 months.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>4. Paternity Established</Text>
                        <Text style={styles.scenarioText}>
                            Paternity was disputed and recently established through DNA test or court order. Child 
                            support backdated to 18 months before application.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            DNA test confirms paternity in January 2026. Apply immediately → Backdated to July 2024.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">How to Apply for Backdating</Text>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>1</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Apply for Child Support</Text>
                            <Text style={styles.stepText}>
                                Contact Services Australia and apply for child support. Specify that you want backdating 
                                and provide the date you want to backdate to (up to 18 months).
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>2</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Provide Evidence</Text>
                            <Text style={styles.stepText}>
                                Gather evidence supporting your backdating claim: separation documents, care records, 
                                income evidence, communication with other parent.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>3</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Services Australia Reviews</Text>
                            <Text style={styles.stepText}>
                                Services Australia assesses your application and determines the backdating start date. 
                                They'll notify both parents of the decision.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>4</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Backdated Amount Becomes Arrears</Text>
                            <Text style={styles.stepText}>
                                The backdated child support is added to the paying parent's account as arrears. They 
                                must pay current child support PLUS arrears installments.
                            </Text>
                        </View>
                    </View>

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
                        <Text style={styles.ctaButtonText}>Get Legal Help With Backdating →</Text>
                    </Pressable>

                    <Text style={styles.h2} accessibilityRole="header">How Backdated Child Support Is Collected</Text>
                    <Text style={styles.paragraph}>
                        Once backdating is approved, the backdated amount becomes arrears. Services Australia collects 
                        it through:
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
                            Backdated amount: $20,000 | Current child support: $2,000/month | Arrears installment: $500/month
                        </Text>
                        <Text style={styles.timelineResult}>
                            Total monthly payment: $2,500 | Time to clear arrears: 40 months (~3.3 years)
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Common Backdating Mistakes</Text>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>1.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Waiting Too Long to Apply</Text>
                            <Text style={styles.mistakeText}>
                                Separated 3 years ago, applying now? You lose 1.5 years of child support. Apply within 
                                18 months of separation to maximize backdating.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>2.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Not Providing Evidence</Text>
                            <Text style={styles.mistakeText}>
                                Services Australia needs proof of separation date, care arrangements, and income. Without 
                                evidence, they may not approve full backdating.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>3.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Assuming Backdating Is Automatic</Text>
                            <Text style={styles.mistakeText}>
                                You must specifically request backdating and provide the date. Don't assume Services 
                                Australia will automatically backdate to separation.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>4.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Not Updating Care Changes</Text>
                            <Text style={styles.mistakeText}>
                                If care arrangements change, update Services Australia immediately. Waiting to update 
                                limits how far back you can claim adjusted payments.
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Exceptions to the 18-Month Rule</Text>
                    <Text style={styles.paragraph}>
                        In rare cases, backdating beyond 18 months is possible:
                    </Text>

                    <View style={styles.exceptionCard}>
                        <Text style={styles.exceptionTitle}>Exception 1: Special Circumstances</Text>
                        <Text style={styles.exceptionText}>
                            If you can prove special circumstances prevented you from applying earlier (domestic violence, 
                            serious illness, other parent concealed income), Services Australia may allow backdating 
                            beyond 18 months.
                        </Text>
                    </View>

                    <View style={styles.exceptionCard}>
                        <Text style={styles.exceptionTitle}>Exception 2: Court Order</Text>
                        <Text style={styles.exceptionText}>
                            Family Court can order child support backdated beyond 18 months if there's evidence of 
                            fraud, concealment, or other exceptional circumstances.
                        </Text>
                    </View>

                    <View style={styles.exceptionCard}>
                        <Text style={styles.exceptionTitle}>Exception 3: Binding Agreement</Text>
                        <Text style={styles.exceptionText}>
                            If you had a Binding Child Support Agreement that was later set aside, backdating may 
                            extend beyond 18 months to when the agreement started.
                        </Text>
                    </View>

                    <View style={styles.adviceBox}>
                        <Text style={styles.adviceTitle}>💡 Get Legal Advice:</Text>
                        <Text style={styles.adviceText}>
                            If you believe you qualify for an exception, consult a family lawyer immediately. These 
                            cases are complex and require strong evidence.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <FAQItem
                        question="How far back can child support be backdated in Australia?"
                        answer="Child support can be backdated up to 18 months before the application date. If you apply on January 1, 2026, Services Australia can backdate to July 1, 2024. You cannot claim child support for periods before this 18-month window."
                    />

                    <FAQItem
                        question="Can I get backdated child support if I never applied before?"
                        answer="Yes, but only for the 18 months before your application. If your child is 10 years old and you never applied, you can only claim the last 18 months—not the previous 9+ years. Apply as soon as possible to maximize backdating."
                    />

                    <FAQItem
                        question="Do I have to pay backdated child support immediately?"
                        answer="No. Backdated child support becomes arrears. Services Australia typically sets up a payment plan where you pay current child support PLUS installments toward the backdated amount. Lump sum payment is possible but not required."
                    />

                    <FAQItem
                        question="What if I didn't know I had to apply for child support?"
                        answer="Ignorance doesn't extend the 18-month rule. Even if you didn't know you needed to apply, you can only backdate 18 months from your application date. Apply as soon as you separate to avoid losing months."
                    />

                    <FAQItem
                        question="Can backdated child support be waived?"
                        answer="Only if both parents agree through a Binding Child Support Agreement. The receiving parent can choose not to pursue backdated amounts, but this must be formalized. Services Australia won't automatically waive backdated child support."
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
                        <Text style={styles.finalCtaTitle}>Need Help With Backdated Child Support?</Text>
                        <Text style={styles.finalCtaText}>
                            Connect with experienced family lawyers who can help you apply for backdating, gather 
                            evidence, or challenge unfair backdating claims.
                        </Text>
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
    paragraph: { fontSize: 16, lineHeight: 26, color: '#475569', marginBottom: 16 },
    bulletItem: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8, paddingLeft: 8 },
    bold: { fontWeight: '600', color: '#1e3a8a' },
    
    keyRuleBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderWidth: 2, borderColor: '#3b82f6', padding: 20, marginBottom: 24, ...createShadow({ shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }) },
    keyRuleTitle: { fontSize: 18, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
    keyRuleText: { fontSize: 15, lineHeight: 24, color: '#1e40af' },
    
    exampleCard: { backgroundColor: '#fefce8', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#fde047', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    exampleTitle: { fontSize: 16, fontWeight: '700', color: '#713f12', marginBottom: 8 },
    exampleText: { fontSize: 15, lineHeight: 24, color: '#854d0e', marginBottom: 4 },
    exampleResult: { fontSize: 15, lineHeight: 24, color: '#713f12', fontWeight: '600', marginTop: 8 },
    exampleNote: { fontSize: 14, lineHeight: 22, color: '#92400e', fontStyle: 'italic', marginTop: 4 },
    
    warningBox: { backgroundColor: '#fef3c7', borderRadius: 12, borderWidth: 1, borderColor: '#fbbf24', padding: 16, marginBottom: 16 },
    warningTitle: { fontSize: 16, fontWeight: '700', color: '#92400e', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#92400e' },
    
    scenarioCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    scenarioTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    scenarioText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8 },
    scenarioExample: { fontSize: 14, lineHeight: 22, color: '#64748b', fontStyle: 'italic', paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },
    
    stepCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    stepNumber: { fontSize: 24, fontWeight: '700', color: '#2563EB', marginRight: 16, width: 32 },
    stepContent: { flex: 1 },
    stepTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    stepText: { fontSize: 15, lineHeight: 24, color: '#475569' },
    
    evidenceCard: { backgroundColor: '#f0f9ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bae6fd' },
    evidenceTitle: { fontSize: 16, fontWeight: '700', color: '#0c4a6e', marginBottom: 12 },
    
    collectionCard: { backgroundColor: '#ecfdf5', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#a7f3d0' },
    collectionTitle: { fontSize: 16, fontWeight: '700', color: '#065f46', marginBottom: 12 },
    
    timelineCard: { backgroundColor: '#f5f3ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#c4b5fd' },
    timelineTitle: { fontSize: 16, fontWeight: '700', color: '#5b21b6', marginBottom: 8 },
    timelineText: { fontSize: 15, lineHeight: 24, color: '#6b21a8', marginBottom: 8 },
    timelineResult: { fontSize: 15, lineHeight: 24, color: '#5b21b6', fontWeight: '600' },
    
    mistakeCard: { flexDirection: 'row', backgroundColor: '#fef2f2', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#fecaca' },
    mistakeNumber: { fontSize: 20, fontWeight: '700', color: '#dc2626', marginRight: 12, width: 24 },
    mistakeContent: { flex: 1 },
    mistakeTitle: { fontSize: 16, fontWeight: '700', color: '#991b1b', marginBottom: 6 },
    mistakeText: { fontSize: 15, lineHeight: 24, color: '#991b1b' },
    
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
    finalCtaText: { fontSize: 15, lineHeight: 24, color: '#e0e7ff', marginBottom: 20, textAlign: 'center' },
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 16, fontWeight: '600' },
});
