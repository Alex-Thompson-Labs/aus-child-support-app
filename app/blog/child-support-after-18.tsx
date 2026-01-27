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
            name: 'Does child support automatically stop at 18 in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. Child support continues until the child turns 18 AND finishes secondary school (Year 12), whichever is later. If your child is still in Year 12 at 18, payments continue until they complete Year 12 in the same calendar year.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can child support continue after 18 if my child goes to university?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. Standard child support ends when the child finishes Year 12 or turns 18 (whichever is later). University students are not covered. However, parents can negotiate private agreements for tertiary education costs, or apply for adult child maintenance if the child has a disability.',
            },
        },
        {
            '@type': 'Question',
            name: 'What happens if my child drops out of school before 18?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Child support continues until they turn 18, even if they leave school early. The "secondary school" extension only applies if they\'re still enrolled at 18. If they drop out at 16, payments continue until 18.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Child Support After 18 Australia 2026 | When Does It Stop?',
    description: 'Child turning 18? Learn when child support ends in Australia, what happens if they\'re still in school, university exceptions, and how to handle the transition smoothly.',
    datePublished: '2026-01-24',
    dateModified: '2026-01-27',
    author: { '@type': 'Organization', name: 'AusChildSupport' },
    publisher: {
        '@type': 'Organization',
        name: 'Australian Child Support Calculator',
        logo: {
            '@type': 'ImageObject',
            url: 'https://auschildsupport.com.au/main-page-logo.png',
        },
    },
};

export default function ChildSupportAfter18BlogPost() {
    const router = useRouter();
    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="Child Support After 18 Australia 2026 | When Does It Stop?"
                description="Support doesn't auto-stop at 18 if they're in school. See exact end dates + transition rules. University = no support. Plan ahead now."
                canonicalPath="/blog/child-support-after-18"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Child Support After 18' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Age Transitions</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            Child Support After 18 Australia 2026 | When Does It Stop?
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026 • Updated January 27, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        Your child is turning 18—does child support automatically stop? Not always. Australian law 
                        extends child support if your child is still in secondary school. Here's exactly when payments 
                        end, what happens with university, and how to handle the transition without surprises.
                    </Text>

                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            No, child support doesn't automatically stop at 18. If your child is still in Year 12, 
                            payments continue until they finish school (in the same calendar year). Get your exact amount below.
                        </Text>
                        <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.quickAnswerButtonText}>Calculate Your Amount →</Text>
                        </Pressable>
                    </View>

                    <View style={styles.keyPointBox}>
                        <Text style={styles.keyPointTitle}>📅 The Exact Rule:</Text>
                        <Text style={styles.keyPointText}>
                            Support ends when your child turns 18 AND completes Year 12—whichever happens LAST. 
                            Example: Child turns 18 in February but graduates in November? Support continues until November.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Does child support automatically stop at 18 in Australia?</Text>
                    <Text style={styles.paragraph}>
                        No. The law requires both conditions: your child must turn 18 AND finish Year 12. Whichever 
                        happens later determines when support ends. If your child is still enrolled in secondary school 
                        when they turn 18, payments continue until they complete Year 12—but only within the same 
                        calendar year they turned 18.
                    </Text>

                    <Text style={styles.h2} accessibilityRole="header">When Does Child Support End?</Text>
                    <Text style={styles.paragraph}>
                        The end date depends on your child's education status at age 18:
                    </Text>

                    <View style={styles.tableContainer}>
                        <Text style={styles.tableTitle}>When Child Support Ends: 4 Common Scenarios</Text>
                        
                        <View style={styles.tableHeaderRow}>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 2 }]}>Scenario</Text>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 2 }]}>When Support Ends</Text>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 2 }]}>Example</Text>
                        </View>

                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Finishes Year 12 before 18</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>On 18th birthday</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Graduates Nov 2025, turns 18 Mar 2026 → Ends Mar 2026</Text>
                        </View>

                        <View style={[styles.tableRow, styles.tableRowAlt]}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Still in Year 12 at 18</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>When finishes Year 12 (same calendar year)</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Turns 18 Feb 2026, graduates Nov 2026 → Ends Nov 2026</Text>
                        </View>

                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Drops out before 18</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>On 18th birthday (no extension)</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Drops out at 16, turns 18 in 2026 → Ends at 18</Text>
                        </View>

                        <View style={[styles.tableRow, styles.tableRowAlt]}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Repeats Year 12</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>When finishes (if turns 18 during repeated year)</Text>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Repeats, turns 18 Jan 2026, finishes Nov 2026 → Ends Nov 2026</Text>
                        </View>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">What About University or TAFE?</Text>
                    <Text style={styles.paragraph}>
                        Standard child support does NOT cover tertiary education. Once your child finishes Year 12 
                        (or turns 18 if they've already finished), the legal obligation ends—even if they're enrolled 
                        in university or TAFE. Parents who want to continue financial support must create a voluntary{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/binding-child-support-agreement')}
                        >
                            binding child support agreement
                        </Text>.
                    </Text>

                    <View style={styles.internalLinkBox}>
                        <Text style={styles.internalLinkTitle}>📖 Related Reading:</Text>
                        <Text style={styles.internalLinkText}>
                            Considering voluntary support for university?{' '}
                            <Text
                                style={styles.inlineLink}
                                onPress={() => router.push('/blog/binding-child-support-agreement')}
                            >
                                Learn how binding agreements work
                            </Text>
                            . If your child has a disability,{' '}
                            <Text
                                style={styles.inlineLink}
                                onPress={() => router.push('/blog/adult-disabled-child-maintenance')}
                            >
                                adult child maintenance may apply indefinitely
                            </Text>.
                        </Text>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>Why University Isn't Covered:</Text>
                        <Text style={styles.bulletItem}>• Child support is for dependent children under 18</Text>
                        <Text style={styles.bulletItem}>• University students are considered adults</Text>
                        <Text style={styles.bulletItem}>• They can access Youth Allowance, student loans, part-time work</Text>
                        <Text style={styles.bulletItem}>• Parents can negotiate private agreements for uni costs</Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Can Parents Agree to Continue Support?</Text>
                    <Text style={styles.paragraph}>
                        Yes. Parents can create a private agreement (Binding Child Support Agreement) to continue 
                        financial support during university. This is voluntary and must be formalized:
                    </Text>

                    <View style={styles.agreementCard}>
                        <Text style={styles.agreementTitle}>Private Agreement Options:</Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Binding Agreement:</Text> Legally enforceable, requires independent legal advice
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Limited Agreement:</Text> Registered with Services Australia, less formal
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Informal Arrangement:</Text> Not enforceable, relies on goodwill
                        </Text>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Important:</Text>
                        <Text style={styles.warningText}>
                            Without a formal agreement, you cannot be forced to pay for university. If the other parent 
                            claims you owe support for a 19-year-old uni student, they're wrong—unless you signed an agreement.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Adult Child Maintenance (Disability Exception)</Text>
                    <Text style={styles.paragraph}>
                        If your child has a disability that prevents them from being self-supporting, child support 
                        can continue indefinitely as "adult child maintenance." Learn more about{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/adult-disabled-child-maintenance')}
                        >
                            adult disabled child maintenance
                        </Text>
                        {' '}and how it's calculated.
                    </Text>

                    <View style={styles.disabilityCard}>
                        <Text style={styles.disabilityTitle}>Eligibility Requirements:</Text>
                        <Text style={styles.bulletItem}>• Child has a physical or mental disability</Text>
                        <Text style={styles.bulletItem}>• Disability existed before they turned 18</Text>
                        <Text style={styles.bulletItem}>• Child cannot support themselves due to disability</Text>
                        <Text style={styles.bulletItem}>• Must apply before child turns 18 (or within 12 months)</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        Adult child maintenance is assessed differently than standard child support. It considers the 
                        child's care needs, disability support payments, and both parents' capacity to contribute.
                    </Text>

                    <View style={styles.trustCard}>
                        <Text style={styles.trustTitle}>💡 Need Help With Adult Child Maintenance?</Text>
                        <Text style={styles.trustText}>
                            Most family lawyers offer free initial consultations to assess disability cases. Applications 
                            must be lodged before the child turns 18 (or within 12 months).
                        </Text>
                        <Pressable
                            style={[styles.ctaButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.ctaButtonText}>Get Legal Advice on Adult Child Maintenance →</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">How to Prepare for Child Support Ending</Text>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>1</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Confirm the End Date</Text>
                            <Text style={styles.stepText}>
                                Contact Services Australia 3 months before your child turns 18. Confirm their expected 
                                graduation date and when payments will stop. Get it in writing.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>2</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Update Your Budget</Text>
                            <Text style={styles.stepText}>
                                If you're receiving child support, plan for the income loss. If you're paying, budget 
                                for the extra cash flow. Don't assume it stops automatically—verify.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>3</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Discuss University Costs</Text>
                            <Text style={styles.stepText}>
                                If your child is going to university, discuss with the other parent whether you'll 
                                contribute. Negotiate amounts, duration, and formalize in a Binding Agreement if needed.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>4</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Check for Arrears</Text>
                            <Text style={styles.stepText}>
                                If you're paying child support, verify you have no arrears before it ends. Arrears 
                                remain enforceable even after the child turns 18. Clear them now to avoid future issues.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>5</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Consider Other Children</Text>
                            <Text style={styles.stepText}>
                                If you have multiple children, child support for younger children may increase when 
                                the oldest ages out. Recalculate your assessment to understand the new amount.
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Common Mistakes When Child Support Ends</Text>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>1.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Assuming It Stops Automatically</Text>
                            <Text style={styles.mistakeText}>
                                Services Australia doesn't always update immediately. If you're paying, verify the end 
                                date and stop payments on time. If you're receiving, don't spend money you're not entitled to.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>2.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Forgetting About Arrears</Text>
                            <Text style={styles.mistakeText}>
                                Child support ending doesn't erase arrears. If you owe $10,000 in back payments, you 
                                still owe it after the child turns 18. Services Australia will continue enforcement.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>3.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Not Formalizing University Agreements</Text>
                            <Text style={styles.mistakeText}>
                                Verbal promises to pay for university aren't enforceable. If you agree to contribute, 
                                get a Binding Agreement. Otherwise, the other parent can't force you to pay.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>4.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Ignoring Disability Provisions</Text>
                            <Text style={styles.mistakeText}>
                                If your child has a disability, you must apply for adult child maintenance BEFORE they 
                                turn 18 (or within 12 months). Missing this deadline means child support ends permanently.
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <FAQItem
                        question="Does child support automatically stop at 18 in Australia?"
                        answer="No. Child support continues until the child turns 18 AND finishes secondary school (Year 12), whichever is later. If your child is still in Year 12 at 18, payments continue until they complete Year 12 in the same calendar year."
                    />

                    <FAQItem
                        question="Can child support continue after 18 if my child goes to university?"
                        answer="No. Standard child support ends when the child finishes Year 12 or turns 18 (whichever is later). University students are not covered. However, parents can negotiate private agreements for tertiary education costs, or apply for adult child maintenance if the child has a disability."
                    />

                    <FAQItem
                        question="What happens if my child drops out of school before 18?"
                        answer="Child support continues until they turn 18, even if they leave school early. The 'secondary school' extension only applies if they're still enrolled at 18. If they drop out at 16, payments continue until 18."
                    />

                    <FAQItem
                        question="Can I be forced to pay for my child's university?"
                        answer="No. Once child support ends (at 18 or when they finish Year 12), you cannot be forced to pay for tertiary education. However, you can voluntarily agree to contribute through a Binding Child Support Agreement."
                    />

                    <FAQItem
                        question="What if my child has a disability?"
                        answer="If your child has a disability that prevents them from being self-supporting, you can apply for adult child maintenance. This must be done before they turn 18 (or within 12 months). Adult child maintenance can continue indefinitely."
                    />

                    <View style={styles.calculatorSection}>
                        <Text style={styles.calculatorTitle}>Calculate Your Child Support</Text>
                        <Text style={styles.calculatorText}>
                            Use our free calculator to see your current child support assessment and understand how 
                            it changes when your child turns 18.
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
                        <Text style={styles.finalCtaTitle}>Need Legal Advice on Child Support Transitions?</Text>
                        <Text style={styles.finalCtaText}>
                            Connect with experienced family lawyers who can help with university agreements, adult 
                            child maintenance applications, or arrears resolution. Most offer free initial consultations 
                            with no obligation to proceed.
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
    h3: { fontSize: 20, fontWeight: '600', color: '#1e3a8a', marginTop: 24, marginBottom: 12, ...(Platform.OS === 'web' ? { lineHeight: 28 } : {}) },
    paragraph: { fontSize: 16, lineHeight: 26, color: '#475569', marginBottom: 16 },
    bulletItem: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8, paddingLeft: 8 },
    bold: { fontWeight: '600', color: '#1e3a8a' },
    
    quickAnswerBox: { backgroundColor: '#2563eb', borderRadius: 12, padding: 20, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    quickAnswerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
    quickAnswerText: { fontSize: 15, lineHeight: 24, color: '#ffffff', marginBottom: 16, textAlign: 'center' },
    quickAnswerButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
    quickAnswerButtonText: { color: '#2563eb', fontSize: 16, fontWeight: '700' },
    
    keyPointBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderWidth: 2, borderColor: '#3b82f6', padding: 20, marginBottom: 24, ...createShadow({ shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }) },
    keyPointTitle: { fontSize: 18, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
    keyPointText: { fontSize: 15, lineHeight: 24, color: '#1e40af' },
    
    scenarioCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    scenarioTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    scenarioText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8 },
    scenarioExample: { fontSize: 14, lineHeight: 22, color: '#64748b', fontStyle: 'italic', paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },
    
    infoCard: { backgroundColor: '#f0f9ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bae6fd' },
    infoTitle: { fontSize: 16, fontWeight: '700', color: '#0c4a6e', marginBottom: 12 },
    
    agreementCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    agreementTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 12 },
    
    warningBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#f59e0b', padding: 16, marginBottom: 16 },
    warningTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#475569' },
    
    disabilityCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    disabilityTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 12 },
    
    stepCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    stepNumber: { fontSize: 24, fontWeight: '700', color: '#2563EB', marginRight: 16, width: 32 },
    stepContent: { flex: 1 },
    stepTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    stepText: { fontSize: 15, lineHeight: 24, color: '#475569' },
    
    mistakeCard: { flexDirection: 'row', backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#dc2626' },
    mistakeNumber: { fontSize: 20, fontWeight: '700', color: '#dc2626', marginRight: 12, width: 24 },
    mistakeContent: { flex: 1 },
    mistakeTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 6 },
    mistakeText: { fontSize: 15, lineHeight: 24, color: '#475569' },
    
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
    
    trustCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, marginVertical: 16, borderWidth: 1, borderColor: '#bfdbfe', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }) },
    trustTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    trustText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 16 },
    inlineLink: { color: '#2563EB', fontWeight: '600', textDecorationLine: 'underline' },
    
    finalCtaSection: { backgroundColor: '#1e3a8a', borderRadius: 12, padding: 24, marginTop: 16, alignItems: 'center' },
    finalCtaTitle: { fontSize: 20, fontWeight: '700', color: '#ffffff', marginBottom: 8, textAlign: 'center' },
    finalCtaText: { fontSize: 15, lineHeight: 24, color: '#bfdbfe', marginBottom: 20, textAlign: 'center' },
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 16, fontWeight: '600' },
    internalLinkBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#bfdbfe' },
    internalLinkTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    internalLinkText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 16 },

    // Table styles
    tableContainer: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }) },
    tableTitle: { fontSize: 18, fontWeight: '700', color: '#1e3a8a', marginBottom: 16, textAlign: 'center' },
    tableHeaderRow: { flexDirection: 'row', backgroundColor: '#eff6ff', borderRadius: 8, padding: 12, marginBottom: 8 },
    tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    tableRowAlt: { backgroundColor: '#f8fafc' },
    tableCell: { fontSize: 14, lineHeight: 20, color: '#475569', paddingHorizontal: 4 },
    tableHeaderCell: { fontWeight: '700', color: '#1e3a8a', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 },
});
