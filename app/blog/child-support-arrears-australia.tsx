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
            name: 'What happens if I don\'t pay child support in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Services Australia can: deduct from wages, intercept tax refunds, suspend passports and driver licenses, register charges on property, issue departure prohibition orders, and pursue criminal prosecution. Interest accrues at 10%+ annually. Arrears don\'t disappear—they follow you until paid.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can child support arrears be written off in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. Child support debt cannot be written off through bankruptcy or time limits. It remains enforceable indefinitely. The only ways to reduce arrears: pay them, negotiate a payment plan, or apply for departure from assessment if circumstances have changed significantly.',
            },
        },
        {
            '@type': 'Question',
            name: 'How long do I have to pay child support arrears?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'There is no time limit. Child support arrears remain enforceable forever, even after children turn 18. Services Australia can pursue collection decades later. Interest continues accruing until paid. The debt passes to your estate if you die.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Child Support Arrears Australia: What Happens If You Don\'t Pay',
    description: 'Behind on child support? Learn what enforcement actions Services Australia can take, how arrears accumulate, and your options to resolve debt before serious consequences.',
    datePublished: '2026-01-24',
    author: { '@type': 'Organization', name: 'AusChildSupport' },
};

export default function ChildSupportArrearsAustraliaBlogPost() {
    const router = useRouter();

    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="Child Support Arrears Australia 2026: Enforcement & Solutions"
                description="Arrears never expire—10% interest compounds forever. Avoid wage garnishment + passport suspension. See payment plan options. Act before enforcement."
                canonicalPath="/blog/child-support-arrears-australia"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Child Support Arrears' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Arrears & Debt</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            Child Support Arrears Australia: What Happens If You Don't Pay
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        Behind on child support payments? You're not alone—thousands of Australian parents owe arrears. 
                        But ignoring child support debt has serious consequences. Services Australia has powerful 
                        enforcement tools, and arrears don't disappear. Here's what happens, how debt accumulates, 
                        and your options to resolve it before things escalate.
                    </Text>

                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            Behind on child support? Services Australia can garnish wages, intercept tax refunds, suspend 
                            passports, or take legal action. Arrears accumulate with interest. Calculate your current amount 
                            and payment plan options below.
                        </Text>
                        <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.quickAnswerButtonText}>Calculate Amount →</Text>
                        </Pressable>
                    </View>

                    <View style={styles.urgentBox}>
                        <Text style={styles.urgentTitle}>🚨 Urgent: Arrears Don't Disappear</Text>
                        <Text style={styles.urgentText}>
                            Child support debt cannot be written off through bankruptcy or time limits. It remains 
                            enforceable indefinitely, even after children turn 18. Interest accrues at 10%+ annually. 
                            The longer you wait, the worse it gets.
                        </Text>
                    </View>

                    {/* What Are Arrears */}
                    <Text style={styles.h2} accessibilityRole="header">What Are Child Support Arrears?</Text>
                    <Text style={styles.paragraph}>
                        Arrears are unpaid child support that has accumulated over time. They occur when you miss 
                        payments, pay less than required, or your assessment increases retroactively. Learn more about{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/child-support-overpayment-refund')}
                        >
                            overpayments and refunds
                        </Text>
                        {' '}if you've paid too much.
                    </Text>

                    <Text style={styles.paragraph}>
                        Common causes of arrears:
                    </Text>

                    <View style={styles.listCard}>
                        <Text style={styles.bulletItem}>• You miss scheduled payments</Text>
                        <Text style={styles.bulletItem}>• Payments are less than the assessed amount</Text>
                        <Text style={styles.bulletItem}>• Your assessment increases retroactively (backdating)</Text>
                        <Text style={styles.bulletItem}>• You stop paying without formal variation</Text>
                        <Text style={styles.bulletItem}>• Employer deductions fail or are insufficient</Text>
                    </View>

                    <View style={styles.listCard}>
                        <Text style={styles.bulletItem}>• You miss scheduled payments</Text>
                        <Text style={styles.bulletItem}>• Payments are less than the assessed amount</Text>
                        <Text style={styles.bulletItem}>• Your assessment increases retroactively (backdating)</Text>
                        <Text style={styles.bulletItem}>• You stop paying without formal variation</Text>
                        <Text style={styles.bulletItem}>• Employer deductions fail or are insufficient</Text>
                    </View>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Example:</Text>
                        <Text style={styles.exampleText}>Your assessment is $1,000/month</Text>
                        <Text style={styles.exampleText}>You pay $600/month for 12 months</Text>
                        <Text style={styles.exampleCalc}>Shortfall: $400/month × 12 = $4,800 arrears</Text>
                        <Text style={styles.exampleCalc}>Plus interest (10% p.a.): ~$240</Text>
                        <Text style={styles.exampleResult}>Total debt after 1 year: $5,040</Text>
                    </View>

                    {/* How Arrears Accumulate */}
                    <Text style={styles.h2} accessibilityRole="header">How Child Support Arrears Accumulate</Text>
                    
                    <Text style={styles.h3} accessibilityRole="header">Interest Charges</Text>
                    <Text style={styles.paragraph}>
                        Services Australia charges interest on overdue child support at rates that compound quickly:
                    </Text>

                    <View style={styles.interestCard}>
                        <Text style={styles.interestTitle}>Current Interest Rates (2026):</Text>
                        <Text style={styles.bulletItem}>• Base rate: 10.01% per annum</Text>
                        <Text style={styles.bulletItem}>• Calculated daily, charged monthly</Text>
                        <Text style={styles.bulletItem}>• Applies to all arrears over 3 months old</Text>
                        <Text style={styles.bulletItem}>• Interest on interest (compound)</Text>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Debt Spiral:</Text>
                        <Text style={styles.warningText}>
                            $10,000 in arrears becomes $11,000 after 1 year, $12,100 after 2 years, $13,310 after 
                            3 years—even if you don't miss another payment. Interest alone adds $3,310 over 3 years.
                        </Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Penalties and Fees</Text>
                    <View style={styles.penaltyCard}>
                        <Text style={styles.penaltyTitle}>Additional Costs:</Text>
                        <Text style={styles.bulletItem}>• Late payment penalties (up to $1,320)</Text>
                        <Text style={styles.bulletItem}>• Court filing fees ($365-$1,000+)</Text>
                        <Text style={styles.bulletItem}>• Legal costs if Services Australia takes court action</Text>
                        <Text style={styles.bulletItem}>• Enforcement costs (sheriff, bailiff fees)</Text>
                    </View>

                    {/* Enforcement Actions */}
                    <Text style={styles.h2} accessibilityRole="header">What Enforcement Actions Can Services Australia Take?</Text>
                    <Text style={styles.paragraph}>
                        Services Australia has extensive powers to collect child support arrears. These escalate 
                        based on debt amount and payment history:
                    </Text>

                    <View style={styles.enforcementCard}>
                        <Text style={styles.enforcementLevel}>Level 1: Administrative Actions</Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Employer deductions:</Text> Automatic wage garnishment (no court order needed)
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Tax refund intercept:</Text> ATO redirects your tax refund to child support
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Centrelink deductions:</Text> Payments reduced to cover arrears
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Bank account garnishment:</Text> Direct deduction from savings/checking
                        </Text>
                    </View>

                    <View style={styles.enforcementCard}>
                        <Text style={styles.enforcementLevel}>Level 2: Travel Restrictions</Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Passport suspension:</Text> Cannot renew or use passport (arrears $2,500+)
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Departure prohibition order:</Text> Cannot leave Australia (arrears $5,000+)
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Driver license suspension:</Text> State-based enforcement (varies by state)
                        </Text>
                    </View>

                    <View style={styles.enforcementCard}>
                        <Text style={styles.enforcementLevel}>Level 3: Property Actions</Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Property charge:</Text> Registered on title (prevents sale without payment)
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Forced sale:</Text> Court can order property sold to pay arrears
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Superannuation splitting:</Text> Access super to pay child support debt
                        </Text>
                    </View>

                    <View style={styles.enforcementCard}>
                        <Text style={styles.enforcementLevel}>Level 4: Legal Action</Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Court proceedings:</Text> Services Australia sues for debt recovery
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Judgment debt:</Text> Court orders payment, enforceable by sheriff
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Criminal prosecution:</Text> Persistent non-payment (rare but possible)
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Jail time:</Text> Up to 12 months for contempt (extreme cases)
                        </Text>
                    </View>

                    <View style={styles.dangerBox}>
                        <Text style={styles.dangerTitle}>🚨 Real Consequences:</Text>
                        <Text style={styles.dangerText}>
                            These aren't threats—Services Australia actively uses these powers. Thousands of parents 
                            have passports suspended, wages garnished, and property charged annually. Don't assume 
                            they won't enforce.
                        </Text>
                    </View>

                    {/* Options to Resolve */}
                    <Text style={styles.h2} accessibilityRole="header">Your Options to Resolve Child Support Arrears</Text>

                    <View style={styles.optionCard}>
                        <Text style={styles.optionNumber}>1</Text>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Pay in Full</Text>
                            <Text style={styles.optionText}>
                                Fastest way to stop interest and enforcement. If you have assets or can borrow, 
                                paying the full amount immediately stops the debt spiral.
                            </Text>
                            <Text style={styles.optionPros}>✓ Stops interest immediately</Text>
                            <Text style={styles.optionPros}>✓ Removes enforcement risk</Text>
                            <Text style={styles.optionCons}>✗ Requires lump sum (often $10,000-50,000+)</Text>
                        </View>
                    </View>

                    <View style={styles.optionCard}>
                        <Text style={styles.optionNumber}>2</Text>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Payment Plan</Text>
                            <Text style={styles.optionText}>
                                Negotiate with Services Australia to pay arrears over time while maintaining current 
                                payments. Plans typically require paying current assessment PLUS arrears installments.
                            </Text>
                            <Text style={styles.optionPros}>✓ Manageable monthly amounts</Text>
                            <Text style={styles.optionPros}>✓ Prevents escalation if you comply</Text>
                            <Text style={styles.optionCons}>✗ Interest continues accruing</Text>
                            <Text style={styles.optionCons}>✗ Must pay current assessment + arrears</Text>
                        </View>
                    </View>

                    <View style={styles.optionCard}>
                        <Text style={styles.optionNumber}>3</Text>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Apply for Departure from Assessment</Text>
                            <Text style={styles.optionText}>
                                If your circumstances have changed significantly (job loss, illness, new dependents), 
                                you can apply to reduce future payments. This doesn't erase arrears but stops them 
                                growing.
                            </Text>
                            <Text style={styles.optionPros}>✓ Reduces future liability</Text>
                            <Text style={styles.optionPros}>✓ Slows arrears growth</Text>
                            <Text style={styles.optionCons}>✗ Doesn't eliminate existing arrears</Text>
                            <Text style={styles.optionCons}>✗ Requires evidence of changed circumstances</Text>
                        </View>
                    </View>

                    <View style={styles.optionCard}>
                        <Text style={styles.optionNumber}>4</Text>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Negotiate with Other Parent</Text>
                            <Text style={styles.optionText}>
                                If the receiving parent agrees, you can negotiate a reduced lump sum settlement or 
                                modified payment plan. Requires formal agreement through Services Australia or court.
                            </Text>
                            <Text style={styles.optionPros}>✓ Potentially reduces total debt</Text>
                            <Text style={styles.optionPros}>✓ Avoids enforcement</Text>
                            <Text style={styles.optionCons}>✗ Requires other parent's cooperation</Text>
                            <Text style={styles.optionCons}>✗ Must be formalized legally</Text>
                        </View>
                    </View>

                    <View style={styles.optionCard}>
                        <Text style={styles.optionNumber}>5</Text>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Get Legal Advice</Text>
                            <Text style={styles.optionText}>
                                If arrears are substantial ($20,000+) or enforcement has started, a family lawyer can 
                                negotiate with Services Australia, challenge incorrect assessments, or represent you 
                                in court.
                            </Text>
                            <Text style={styles.optionPros}>✓ Expert negotiation</Text>
                            <Text style={styles.optionPros}>✓ Can challenge unfair assessments</Text>
                            <Text style={styles.optionCons}>✗ Legal fees ($3,000-10,000+)</Text>
                        </View>
                    </View>

                    <View style={styles.trustCard}>
                        <Text style={styles.trustTitle}>💡 What to Expect From Legal Help:</Text>
                        <Text style={styles.bulletItem}>• Most lawyers respond within 24 hours</Text>
                        <Text style={styles.bulletItem}>• Initial consultations often free or low-cost ($200-400)</Text>
                        <Text style={styles.bulletItem}>• No obligation to proceed after consultation</Text>
                        <Text style={styles.bulletItem}>• Your information remains confidential</Text>
                        <Text style={styles.bulletItem}>• Payment plans available for legal fees</Text>
                    </View>

                    <Pressable
                        style={[styles.ctaButton, isWeb && webClickableStyles]}
                        onPress={() => router.push('/lawyer-inquiry?mode=direct')}
                        accessibilityRole="button"
                    >
                        <Text style={styles.ctaButtonText}>Connect With Family Lawyers →</Text>
                    </Pressable>

                    {/* Common Mistakes */}
                    <Text style={styles.h2} accessibilityRole="header">5 Mistakes That Make Arrears Worse</Text>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>1.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Ignoring Services Australia Letters</Text>
                            <Text style={styles.mistakeText}>
                                Every letter is a warning. Ignoring them doesn't make arrears disappear—it triggers 
                                escalation to enforcement. Respond to every communication.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>2.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Stopping Payments Without Formal Variation</Text>
                            <Text style={styles.mistakeText}>
                                Lost your job? Income dropped? You must apply for variation. Stopping payments without 
                                formal approval creates arrears that you'll owe even if circumstances were genuine.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>3.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Assuming Bankruptcy Clears Child Support Debt</Text>
                            <Text style={styles.mistakeText}>
                                Child support arrears survive bankruptcy. They're not dischargeable. Bankruptcy won't 
                                help—it may make things worse by damaging credit while debt remains.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>4.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Paying Other Parent Directly Without Recording</Text>
                            <Text style={styles.mistakeText}>
                                Cash payments, direct transfers, or paying expenses directly don't count unless 
                                recorded through Services Australia. You'll still owe arrears even if you paid.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>5.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Waiting Until Enforcement Starts</Text>
                            <Text style={styles.mistakeText}>
                                Once enforcement begins (passport suspension, property charge), your options narrow 
                                and costs increase. Act early—negotiate before Services Australia escalates.
                            </Text>
                        </View>
                    </View>

                    {/* Contextual Wizard */}
                    <ContextualWizard
                        preselectedFactors={['overpayment_issue']}
                        highlightedFactors={['income_resources_not_reflected']}
                        blogTopic="arrears"
                        ctaText="Resolve Payment Issues"
                        analyticsSource="blog_child_support_arrears_australia"
                        formReason="special_circumstances"
                        title="Struggling With Arrears?"
                        description="Professional advice can help you negotiate payment plans or challenge incorrect assessments. Select any factors that apply."
                    />

                    {/* FAQ */}
                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <FAQItem
                        question="What happens if I don't pay child support in Australia?"
                        answer="Services Australia can: deduct from wages, intercept tax refunds, suspend passports and driver licenses, register charges on property, issue departure prohibition orders, and pursue criminal prosecution. Interest accrues at 10%+ annually. Arrears don't disappear—they follow you until paid."
                    />

                    <FAQItem
                        question="Can child support arrears be written off in Australia?"
                        answer="No. Child support debt cannot be written off through bankruptcy or time limits. It remains enforceable indefinitely. The only ways to reduce arrears: pay them, negotiate a payment plan, or apply for departure from assessment if circumstances have changed significantly."
                    />

                    <FAQItem
                        question="How long do I have to pay child support arrears?"
                        answer="There is no time limit. Child support arrears remain enforceable forever, even after children turn 18. Services Australia can pursue collection decades later. Interest continues accruing until paid. The debt passes to your estate if you die."
                    />

                    <FAQItem
                        question="Can I go to jail for not paying child support in Australia?"
                        answer="Yes, but it's rare. Criminal prosecution is reserved for persistent, deliberate non-payment. More commonly, you face civil penalties: wage garnishment, passport suspension, property charges. Jail time (up to 12 months) is for contempt of court orders, not the debt itself."
                    />

                    <FAQItem
                        question="What if I genuinely can't afford to pay child support?"
                        answer="Apply immediately for a Change of Assessment or departure from assessment. Provide evidence of changed circumstances (job loss, illness, new dependents). Services Australia can reduce future payments, but you must apply—don't just stop paying. Get legal advice if your application is denied."
                    />

                    {/* Calculate Current Assessment */}
                    <View style={styles.calculatorSection}>
                        <Text style={styles.calculatorTitle}>Calculate Your Current Child Support</Text>
                        <Text style={styles.calculatorText}>
                            Understanding your correct assessment is the first step to resolving arrears. Use our 
                            free calculator to see what you should be paying based on current income and care.
                        </Text>
                        <Pressable
                            style={[styles.calculatorButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.calculatorButtonText}>Calculate Now</Text>
                        </Pressable>
                        <Text style={styles.calculatorDisclaimer}>
                            If your calculator result differs significantly from your assessment, you may have grounds 
                            for variation.
                        </Text>
                    </View>

                    {/* Final CTA */}
                    <View style={styles.finalCtaSection}>
                        <Text style={styles.finalCtaTitle}>Facing Child Support Arrears?</Text>
                        <Text style={styles.finalCtaText}>
                            Don't wait for enforcement to start. Connect with experienced family lawyers who can 
                            negotiate with Services Australia, challenge incorrect assessments, and protect your 
                            rights. Most offer free initial consultations with no obligation to proceed.
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

    quickAnswerBox: { backgroundColor: '#22c55e', borderRadius: 12, padding: 20, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#22c55e', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    quickAnswerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
    quickAnswerText: { fontSize: 15, lineHeight: 24, color: '#ffffff', marginBottom: 16, textAlign: 'center' },
    quickAnswerButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
    quickAnswerButtonText: { color: '#22c55e', fontSize: 16, fontWeight: '700' },

    bulletItem: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8, paddingLeft: 8 },
    bold: { fontWeight: '600', color: '#1e3a8a' },
    
    urgentBox: { backgroundColor: '#fef2f2', borderRadius: 12, borderWidth: 2, borderColor: '#dc2626', padding: 20, marginBottom: 24, ...createShadow({ shadowColor: '#dc2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    urgentTitle: { fontSize: 18, fontWeight: '700', color: '#991b1b', marginBottom: 8 },
    urgentText: { fontSize: 15, lineHeight: 24, color: '#991b1b' },
    
    listCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    
    exampleCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }) },
    exampleTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    exampleText: { fontSize: 14, color: '#475569', marginBottom: 4 },
    exampleCalc: { fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: '#64748b', marginBottom: 4, paddingLeft: 8 },
    exampleResult: { fontSize: 16, fontWeight: '700', color: '#dc2626', marginTop: 8 },
    
    interestCard: { backgroundColor: '#fef3c7', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#fbbf24' },
    interestTitle: { fontSize: 16, fontWeight: '600', color: '#78350f', marginBottom: 12 },
    
    warningBox: { backgroundColor: '#fef3c7', borderRadius: 12, borderWidth: 1, borderColor: '#fbbf24', padding: 16, marginBottom: 16 },
    warningTitle: { fontSize: 15, fontWeight: '600', color: '#78350f', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#78350f' },
    
    penaltyCard: { backgroundColor: '#fef2f2', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#fecaca' },
    penaltyTitle: { fontSize: 16, fontWeight: '600', color: '#991b1b', marginBottom: 12 },
    
    enforcementCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 }) },
    enforcementLevel: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 12 },
    
    dangerBox: { backgroundColor: '#fef2f2', borderRadius: 12, borderWidth: 2, borderColor: '#dc2626', padding: 20, marginBottom: 24, ...createShadow({ shadowColor: '#dc2626', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    dangerTitle: { fontSize: 16, fontWeight: '700', color: '#991b1b', marginBottom: 8 },
    dangerText: { fontSize: 15, lineHeight: 24, color: '#991b1b' },
    
    optionCard: { flexDirection: 'row', backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#86efac' },
    optionNumber: { fontSize: 24, fontWeight: '700', color: '#22c55e', marginRight: 12, width: 32 },
    optionContent: { flex: 1 },
    optionTitle: { fontSize: 16, fontWeight: '600', color: '#14532d', marginBottom: 4 },
    optionText: { fontSize: 14, lineHeight: 22, color: '#14532d', marginBottom: 8 },
    optionPros: { fontSize: 13, color: '#14532d', marginBottom: 2 },
    optionCons: { fontSize: 13, color: '#78350f', marginBottom: 2 },
    
    trustCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, marginVertical: 16, borderWidth: 1, borderColor: '#bfdbfe', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }) },
    trustTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 12 },
    inlineLink: { color: '#2563EB', fontWeight: '600', textDecorationLine: 'underline' },
    
    ctaButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 24, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    ctaButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
    
    mistakeCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    mistakeNumber: { fontSize: 24, fontWeight: '700', color: '#dc2626', marginRight: 12, width: 32 },
    mistakeContent: { flex: 1 },
    mistakeTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginBottom: 4 },
    mistakeText: { fontSize: 14, lineHeight: 22, color: '#475569' },
    
    faqItem: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    faqQuestion: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    faqAnswer: { fontSize: 15, lineHeight: 24, color: '#475569' },
    
    calculatorSection: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 24, marginTop: 32, marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: '#bfdbfe' },
    calculatorTitle: { fontSize: 22, fontWeight: '700', color: '#1e3a8a', marginBottom: 12, textAlign: 'center' },
    calculatorText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 20, textAlign: 'center' },
    calculatorButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 32, marginBottom: 12, ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    calculatorButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
    calculatorDisclaimer: { fontSize: 13, color: '#64748b', textAlign: 'center', fontStyle: 'italic' },
    
    finalCtaSection: { backgroundColor: '#1e3a8a', borderRadius: 12, padding: 28, marginTop: 32, alignItems: 'center', ...createShadow({ shadowColor: '#1e3a8a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    finalCtaTitle: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 12, textAlign: 'center' },
    finalCtaText: { fontSize: 16, lineHeight: 26, color: '#bfdbfe', marginBottom: 24, textAlign: 'center' },
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 32, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 18, fontWeight: '700' },
});
