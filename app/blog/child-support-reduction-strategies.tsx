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
                title="Child Support Reduction: 7 Legal Ways to Lower Your Payments"
                description="7 legal strategies to reduce child support in Australia. Learn valid grounds, application process, and what doesn't work. Includes real examples and success rates."
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
                        to apply without triggering penalties.
                    </Text>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Legal vs Illegal:</Text>
                        <Text style={styles.warningText}>
                            This guide covers LEGAL reduction strategies. Hiding income, quitting your job, or 
                            deliberately reducing earnings to avoid child support is illegal and results in penalties, 
                            arrears, and potential criminal charges.
                        </Text>
                    </View>

                    {/* 7 Legal Strategies */}
                    <Text style={styles.h2} accessibilityRole="header">7 Legal Ways to Reduce Child Support</Text>

                    <View style={styles.strategyCard}>
                        <Text style={styles.strategyNumber}>1</Text>
                        <View style={styles.strategyContent}>
                            <Text style={styles.strategyTitle}>Apply for Change of Assessment</Text>
                            <Text style={styles.strategyText}>
                                If your circumstances changed significantly since the last assessment, apply for 
                                Change of Assessment. Valid grounds include income reduction, new dependents, high 
                                contact costs, or special needs care.
                            </Text>
                            <Text style={styles.strategySuccess}>Success rate: 40-60% (with evidence)</Text>
                            <Text style={styles.strategyTime}>Timeline: 2-4 months</Text>
                        </View>
                    </View>

                    <View style={styles.strategyCard}>
                        <Text style={styles.strategyNumber}>2</Text>
                        <View style={styles.strategyContent}>
                            <Text style={styles.strategyTitle}>Increase Your Care Percentage</Text>
                            <Text style={styles.strategyText}>
                                More nights with children = lower child support. Increasing from 14% to 35% care 
                                (52 to 128 nights/year) can reduce payments by 30-50%. Must be genuine care increase, 
                                not manipulation.
                            </Text>
                            <Text style={styles.strategySuccess}>Success rate: High (if documented)</Text>
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
                                including one-time bonuses as ongoing income.
                            </Text>
                            <Text style={styles.strategySuccess}>Success rate: 70-80% (if error exists)</Text>
                            <Text style={styles.strategyTime}>Timeline: 4-8 weeks</Text>
                        </View>
                    </View>

                    <View style={styles.strategyCard}>
                        <Text style={styles.strategyNumber}>4</Text>
                        <View style={styles.strategyContent}>
                            <Text style={styles.strategyTitle}>Apply for Departure from Assessment</Text>
                            <Text style={styles.strategyText}>
                                If income dropped significantly (job loss, illness, business failure), apply for 
                                departure. Must show income reduction is genuine and not deliberate to avoid child 
                                support.
                            </Text>
                            <Text style={styles.strategySuccess}>Success rate: 50-70% (genuine hardship)</Text>
                            <Text style={styles.strategyTime}>Timeline: 2-3 months</Text>
                        </View>
                    </View>

                    <View style={styles.strategyCard}>
                        <Text style={styles.strategyNumber}>5</Text>
                        <View style={styles.strategyContent}>
                            <Text style={styles.strategyTitle}>Claim Relevant Dependents</Text>
                            <Text style={styles.strategyText}>
                                If you have other children (new relationship, stepchildren you support), claim them 
                                as relevant dependents. This reduces your child support income by $1,786 per dependent 
                                (2026 rate).
                            </Text>
                            <Text style={styles.strategySuccess}>Success rate: 90%+ (if eligible)</Text>
                            <Text style={styles.strategyTime}>Timeline: Next assessment</Text>
                        </View>
                    </View>

                    <View style={styles.strategyCard}>
                        <Text style={styles.strategyNumber}>6</Text>
                        <View style={styles.strategyContent}>
                            <Text style={styles.strategyTitle}>Negotiate Binding Agreement</Text>
                            <Text style={styles.strategyText}>
                                If other parent agrees, negotiate lower amount via Binding Child Support Agreement. 
                                Must meet minimum payment thresholds and both parties need independent legal advice.
                            </Text>
                            <Text style={styles.strategySuccess}>Success rate: Depends on negotiation</Text>
                            <Text style={styles.strategyTime}>Timeline: 1-3 months</Text>
                        </View>
                    </View>

                    <View style={styles.strategyCard}>
                        <Text style={styles.strategyNumber}>7</Text>
                        <View style={styles.strategyContent}>
                            <Text style={styles.strategyTitle}>Salary Sacrifice to Super</Text>
                            <Text style={styles.strategyText}>
                                Salary sacrificing to superannuation reduces taxable income (up to concessional cap). 
                                However, reportable super contributions are added back to child support income. Limited 
                                benefit but can reduce tax burden.
                            </Text>
                            <Text style={styles.strategySuccess}>Success rate: Minimal impact</Text>
                            <Text style={styles.strategyTime}>Timeline: Next tax year</Text>
                        </View>
                    </View>

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
                        <Text style={styles.bulletItem}>• Penalties up to $13,200</Text>
                        <Text style={styles.bulletItem}>• Criminal prosecution (fraud)</Text>
                        <Text style={styles.bulletItem}>• Arrears with 10%+ interest</Text>
                        <Text style={styles.bulletItem}>• Enforcement actions (wage garnishment, passport suspension)</Text>
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
                            Reduction applications require evidence and legal arguments. Connect with family lawyers 
                            who can assess your case and maximize your chances of success.
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
    
    warningBox: { backgroundColor: '#fef3c7', borderRadius: 12, borderWidth: 1, borderColor: '#fbbf24', padding: 16, marginBottom: 16 },
    warningTitle: { fontSize: 15, fontWeight: '600', color: '#78350f', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#78350f' },
    
    strategyCard: { flexDirection: 'row', backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#86efac' },
    strategyNumber: { fontSize: 24, fontWeight: '700', color: '#22c55e', marginRight: 12, width: 32 },
    strategyContent: { flex: 1 },
    strategyTitle: { fontSize: 16, fontWeight: '600', color: '#14532d', marginBottom: 4 },
    strategyText: { fontSize: 14, lineHeight: 22, color: '#14532d', marginBottom: 8 },
    strategySuccess: { fontSize: 13, color: '#22c55e', fontWeight: '600', marginBottom: 2 },
    strategyTime: { fontSize: 13, color: '#64748b', fontStyle: 'italic' },
    
    ctaButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 24, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    ctaButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
    
    dangerCard: { backgroundColor: '#fef2f2', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#fecaca' },
    dangerTitle: { fontSize: 16, fontWeight: '600', color: '#991b1b', marginBottom: 12 },
    
    consequenceBox: { backgroundColor: '#fef2f2', borderRadius: 12, borderWidth: 2, borderColor: '#dc2626', padding: 20, marginBottom: 24, ...createShadow({ shadowColor: '#dc2626', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    consequenceTitle: { fontSize: 16, fontWeight: '700', color: '#991b1b', marginBottom: 12 },
    
    faqItem: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    faqQuestion: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    faqAnswer: { fontSize: 15, lineHeight: 24, color: '#475569' },
    
    finalCtaSection: { backgroundColor: '#1e3a8a', borderRadius: 12, padding: 28, marginTop: 32, alignItems: 'center', ...createShadow({ shadowColor: '#1e3a8a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    finalCtaTitle: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 12, textAlign: 'center' },
    finalCtaText: { fontSize: 16, lineHeight: 26, color: '#bfdbfe', marginBottom: 24, textAlign: 'center' },
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 32, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 18, fontWeight: '700' },
});
