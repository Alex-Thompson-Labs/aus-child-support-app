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
            name: 'Do I still pay child support if I\'m on Centrelink?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, but the amount is usually minimal. If you receive income support (JobSeeker, DSP, Parenting Payment), you typically pay $5-10/week per child. Services Australia uses Formula 2 which accounts for income support. You cannot avoid child support by being on Centrelink.',
            },
        },
        {
            '@type': 'Question',
            name: 'How much child support do I pay on JobSeeker?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'On JobSeeker (2026 rate: ~$750/fortnight), you typically pay $5-10/week per child depending on care arrangement. This is calculated using Formula 2. If you have 0% care, expect $10/week per child. With some care (14%+), payments reduce further.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Child Support and Centrelink: How Income Support Affects Payments',
    description: 'On JobSeeker, DSP, or Parenting Payment? Learn how Centrelink income support affects child support. Understand Formula 2, payment amounts, and your obligations.',
    datePublished: '2026-01-24',
    author: { '@type': 'Organization', name: 'AusChildSupport' },
};

export default function ChildSupportCentrelinkBlogPost() {
    const router = useRouter();
    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="Child Support and Centrelink: How Income Support Affects Payments"
                description="On JobSeeker, DSP, or Parenting Payment? Learn how Centrelink income support affects child support. Understand Formula 2, payment amounts, and your obligations."
                canonicalPath="/blog/child-support-centrelink-income-support"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Centrelink & Income Support' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <CalculatorHeader title="Blog" showBackButton={true} maxWidth={MAX_CALCULATOR_WIDTH} />
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Income Support</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            Child Support and Centrelink: How Income Support Affects Payments
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        On JobSeeker, DSP, or Parenting Payment? You still owe child support—but the amount is usually 
                        minimal. Services Australia uses a special formula (Formula 2) for parents on income support. 
                        Here's how it works, what you'll pay, and your obligations.
                    </Text>

                    <View style={styles.keyFactBox}>
                        <Text style={styles.keyFactTitle}>💡 Key Fact:</Text>
                        <Text style={styles.keyFactText}>
                            Being on Centrelink doesn't eliminate child support. You typically pay $5-10/week per child. 
                            This is automatically deducted from your Centrelink payment if you're registered with 
                            Services Australia.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">How Formula 2 Works (Income Support)</Text>
                    <Text style={styles.paragraph}>
                        When one or both parents receive income support, Services Australia uses Formula 2 instead of 
                        the standard formula. This recognizes that income support recipients have limited capacity to pay.
                    </Text>

                    <View style={styles.formulaCard}>
                        <Text style={styles.formulaTitle}>Formula 2 Calculation:</Text>
                        <Text style={styles.bulletItem}>• Fixed rate per child (not income-based)</Text>
                        <Text style={styles.bulletItem}>• Adjusted for care percentage</Text>
                        <Text style={styles.bulletItem}>• Typically $5-10/week per child</Text>
                        <Text style={styles.bulletItem}>• Automatically deducted from Centrelink payment</Text>
                    </View>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Example: Parent on JobSeeker</Text>
                        <Text style={styles.exampleText}>Parent A: JobSeeker ($750/fortnight)</Text>
                        <Text style={styles.exampleText}>Parent B: Working ($60,000/year)</Text>
                        <Text style={styles.exampleText}>2 children, Parent A has 0% care</Text>
                        <Text style={styles.exampleResult}>Parent A pays: ~$20/week ($87/month)</Text>
                        <Text style={styles.exampleNote}>Deducted automatically from JobSeeker payment</Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Payment Amounts by Income Support Type</Text>

                    <View style={styles.paymentCard}>
                        <Text style={styles.paymentTitle}>JobSeeker Payment</Text>
                        <Text style={styles.paymentAmount}>$5-10/week per child</Text>
                        <Text style={styles.paymentNote}>Depends on care percentage. 0% care = higher end.</Text>
                    </View>

                    <View style={styles.paymentCard}>
                        <Text style={styles.paymentTitle}>Disability Support Pension (DSP)</Text>
                        <Text style={styles.paymentAmount}>$5-10/week per child</Text>
                        <Text style={styles.paymentNote}>Same as JobSeeker. Formula 2 applies.</Text>
                    </View>

                    <View style={styles.paymentCard}>
                        <Text style={styles.paymentTitle}>Parenting Payment Single</Text>
                        <Text style={styles.paymentAmount}>$5-10/week per child</Text>
                        <Text style={styles.paymentNote}>For children from other relationships.</Text>
                    </View>

                    <View style={styles.paymentCard}>
                        <Text style={styles.paymentTitle}>Age Pension</Text>
                        <Text style={styles.paymentAmount}>$5-10/week per child</Text>
                        <Text style={styles.paymentNote}>Rare but possible if children under 18.</Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">What Happens When You Return to Work</Text>
                    <Text style={styles.paragraph}>
                        When you stop receiving income support and return to work, your child support assessment changes:
                    </Text>

                    <View style={styles.transitionCard}>
                        <Text style={styles.transitionTitle}>Transition Process:</Text>
                        <Text style={styles.bulletItem}>1. Notify Services Australia of employment</Text>
                        <Text style={styles.bulletItem}>2. Assessment switches from Formula 2 to Formula 1</Text>
                        <Text style={styles.bulletItem}>3. Payments increase based on new income</Text>
                        <Text style={styles.bulletItem}>4. Change takes effect from next assessment period</Text>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Income Reporting:</Text>
                        <Text style={styles.warningText}>
                            You must report income changes to both Centrelink AND Services Australia. Failing to report 
                            can result in overpayment debt (Centrelink) and underpayment arrears (child support).
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Common Scenarios</Text>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>Both Parents on Income Support</Text>
                        <Text style={styles.scenarioText}>
                            If both parents receive income support, the parent with less care pays the other. Amount 
                            is still $5-10/week per child. If care is equal (50/50), no child support is payable.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>Part-Time Work + Centrelink</Text>
                        <Text style={styles.scenarioText}>
                            If you work part-time and receive partial income support, Services Australia assesses your 
                            total income (wages + Centrelink). You may pay more than Formula 2 rates but less than 
                            full Formula 1.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>Temporary Income Support</Text>
                        <Text style={styles.scenarioText}>
                            Short-term JobSeeker (3-6 months) still triggers Formula 2. When you return to work, 
                            assessment reverts to Formula 1. Notify Services Australia immediately to avoid arrears.
                        </Text>
                    </View>

                    <FAQItem
                        question="Do I still pay child support if I'm on Centrelink?"
                        answer="Yes, but the amount is usually minimal. If you receive income support (JobSeeker, DSP, Parenting Payment), you typically pay $5-10/week per child. Services Australia uses Formula 2 which accounts for income support. You cannot avoid child support by being on Centrelink."
                    />

                    <FAQItem
                        question="How much child support do I pay on JobSeeker?"
                        answer="On JobSeeker (2026 rate: ~$750/fortnight), you typically pay $5-10/week per child depending on care arrangement. This is calculated using Formula 2. If you have 0% care, expect $10/week per child. With some care (14%+), payments reduce further."
                    />

                    <Pressable style={[styles.calculatorButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                        <Text style={styles.calculatorButtonText}>Calculate Your Child Support</Text>
                    </Pressable>

                    <View style={styles.finalCtaSection}>
                        <Text style={styles.finalCtaTitle}>Questions About Income Support & Child Support?</Text>
                        <Text style={styles.finalCtaText}>
                            Formula 2 calculations can be confusing. Connect with family lawyers who understand income 
                            support and child support interactions.
                        </Text>
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
    
    keyFactBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderWidth: 2, borderColor: '#2563EB', padding: 20, marginBottom: 24, ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    keyFactTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    keyFactText: { fontSize: 15, lineHeight: 24, color: '#1e3a8a' },
    
    formulaCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    formulaTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },
    
    exampleCard: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#86efac' },
    exampleTitle: { fontSize: 15, fontWeight: '600', color: '#14532d', marginBottom: 8 },
    exampleText: { fontSize: 14, color: '#14532d', marginBottom: 4 },
    exampleResult: { fontSize: 16, fontWeight: '700', color: '#22c55e', marginTop: 8, marginBottom: 4 },
    exampleNote: { fontSize: 13, color: '#64748b', fontStyle: 'italic' },
    
    paymentCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 }) },
    paymentTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 4 },
    paymentAmount: { fontSize: 20, fontWeight: '700', color: '#2563EB', marginBottom: 4 },
    paymentNote: { fontSize: 13, color: '#64748b' },
    
    transitionCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    transitionTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },
    
    warningBox: { backgroundColor: '#fef3c7', borderRadius: 12, borderWidth: 1, borderColor: '#fbbf24', padding: 16, marginBottom: 16 },
    warningTitle: { fontSize: 15, fontWeight: '600', color: '#78350f', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#78350f' },
    
    scenarioCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    scenarioTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    scenarioText: { fontSize: 14, lineHeight: 22, color: '#475569' },
    
    faqItem: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    faqQuestion: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    faqAnswer: { fontSize: 15, lineHeight: 24, color: '#475569' },
    
    calculatorButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 24, marginTop: 24, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    calculatorButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
    
    finalCtaSection: { backgroundColor: '#1e3a8a', borderRadius: 12, padding: 28, marginTop: 32, alignItems: 'center', ...createShadow({ shadowColor: '#1e3a8a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    finalCtaTitle: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 12, textAlign: 'center' },
    finalCtaText: { fontSize: 16, lineHeight: 26, color: '#bfdbfe', marginBottom: 24, textAlign: 'center' },
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 32, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 18, fontWeight: '700' },
});
