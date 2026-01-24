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
            name: 'Can I use a calculator if I have a court order for child support?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, but the court order takes precedence. Use a calculator to: 1) Understand what the standard formula would be (to see if your order is fair), 2) Calculate what happens when the order expires, or 3) Prepare evidence for a variation application. The calculator cannot override a court order.',
            },
        },
        {
            '@type': 'Question',
            name: 'What is the difference between a court order and Services Australia assessment?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'A court order is legally binding and set by a judge, often departing from the standard formula for specific reasons. A Services Australia assessment uses the standard formula based on income and care. Court orders override Services Australia assessments. You cannot have both active simultaneously.',
            },
        },
        {
            '@type': 'Question',
            name: 'How do I know if my court order is still valid?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Check your court order for: 1) Expiry date (many orders expire when youngest child turns 18), 2) Review clauses (some orders require review every 2-3 years), 3) Variation triggers (income changes, care changes). If expired or triggered, you can apply for a Services Australia assessment or return to court.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Court Order Child Support Calculator: How to Read Your Court Order (Free Tool)',
    description: 'Have a court order for child support? Learn how to read it, when it expires, and how to use a calculator to understand what happens next. Free tool included.',
    datePublished: '2026-01-24',
    author: { '@type': 'Organization', name: 'AusChildSupport' },
};

export default function CourtOrderChildSupportCalculatorBlogPost() {
    const router = useRouter();

    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="Court Order Child Support Calculator: How to Read Your Court Order (Free Tool)"
                description="Have a court order for child support? Learn how to read it, when it expires, and how to use a calculator to understand what happens next. Free tool included."
                canonicalPath="/blog/court-order-child-support-calculator"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Court Order Calculator' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <CalculatorHeader title="Blog" showBackButton={true} maxWidth={MAX_CALCULATOR_WIDTH} />
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Court Orders</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            Court Order Child Support Calculator: How to Read Your Court Order (Free Tool)
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        Have a court order for child support? You're not alone. Thousands of Australian parents have 
                        court-ordered child support instead of Services Australia assessments. But court orders can be 
                        confusing. Here's how to read yours, when it expires, and how a calculator can help you plan 
                        for what happens next.
                    </Text>

                    <View style={styles.alertBox}>
                        <Text style={styles.alertTitle}>⚖️ Court Order = Legally Binding</Text>
                        <Text style={styles.alertText}>
                            A court order overrides the standard child support formula. You must follow the court order 
                            until it expires, is varied, or is set aside. Using a calculator doesn't change your legal 
                            obligations under the order.
                        </Text>
                    </View>

                    {/* Understanding Court Orders */}
                    <Text style={styles.h2} accessibilityRole="header">Understanding Court Orders vs Services Australia Assessments</Text>
                    <Text style={styles.paragraph}>
                        There are two ways child support is determined in Australia:
                    </Text>

                    <View style={styles.comparisonCard}>
                        <Text style={styles.comparisonTitle}>Services Australia Assessment:</Text>
                        <Text style={styles.bulletItem}>• Uses standard 8-step formula</Text>
                        <Text style={styles.bulletItem}>• Based on income, care, and number of children</Text>
                        <Text style={styles.bulletItem}>• Automatically reassessed annually</Text>
                        <Text style={styles.bulletItem}>• Can be collected through employer deductions</Text>
                        <Text style={styles.bulletItem}>• Most common method (80%+ of cases)</Text>
                    </View>

                    <View style={styles.comparisonCard}>
                        <Text style={styles.comparisonTitle}>Court Order:</Text>
                        <Text style={styles.bulletItem}>• Set by Federal Circuit Court or Family Court</Text>
                        <Text style={styles.bulletItem}>• Can depart from standard formula</Text>
                        <Text style={styles.bulletItem}>• Fixed until expiry or variation</Text>
                        <Text style={styles.bulletItem}>• Legally binding and enforceable</Text>
                        <Text style={styles.bulletItem}>• Used for complex cases or by agreement</Text>
                    </View>

                    <View style={styles.keyPointBox}>
                        <Text style={styles.keyPointTitle}>🔑 Key Point:</Text>
                        <Text style={styles.keyPointText}>
                            You cannot have both a court order and a Services Australia assessment active at the same 
                            time. If you have a court order, Services Australia will not assess child support until 
                            the order expires or is set aside.
                        </Text>
                    </View>

                    {/* How to Read Your Court Order */}
                    <Text style={styles.h2} accessibilityRole="header">How to Read Your Court Order</Text>
                    <Text style={styles.paragraph}>
                        Court orders can be dense legal documents. Here's what to look for:
                    </Text>

                    <Text style={styles.h3} accessibilityRole="header">1. The Amount</Text>
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionText}>
                            Look for phrases like "The respondent shall pay" or "Child support is ordered at". 
                            The amount may be:
                        </Text>
                        <Text style={styles.bulletItem}>• Fixed dollar amount per week/month/year</Text>
                        <Text style={styles.bulletItem}>• Percentage of income</Text>
                        <Text style={styles.bulletItem}>• Formula-based with specific calculations</Text>
                        <Text style={styles.bulletItem}>• Indexed to inflation (CPI adjustments)</Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">2. Payment Terms</Text>
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionText}>Check for:</Text>
                        <Text style={styles.bulletItem}>• Payment frequency (weekly, fortnightly, monthly)</Text>
                        <Text style={styles.bulletItem}>• Payment method (direct transfer, Services Australia collection)</Text>
                        <Text style={styles.bulletItem}>• Start date and first payment due</Text>
                        <Text style={styles.bulletItem}>• Whether payments are in addition to direct costs (school fees, medical)</Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">3. Expiry Date or Trigger</Text>
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionText}>Most orders expire when:</Text>
                        <Text style={styles.bulletItem}>• Youngest child turns 18 (or finishes secondary school)</Text>
                        <Text style={styles.bulletItem}>• Specific date is reached</Text>
                        <Text style={styles.bulletItem}>• Triggering event occurs (remarriage, income change)</Text>
                        <Text style={styles.bulletItem}>• Review date is reached (order requires reassessment)</Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">4. Variation Clauses</Text>
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionText}>Look for clauses that allow changes if:</Text>
                        <Text style={styles.bulletItem}>• Income changes by more than X% (often 15-20%)</Text>
                        <Text style={styles.bulletItem}>• Care arrangement changes</Text>
                        <Text style={styles.bulletItem}>• Either parent remarries or has more children</Text>
                        <Text style={styles.bulletItem}>• Specific review dates (every 2-3 years)</Text>
                    </View>

                    {/* When to Use Calculator */}
                    <Text style={styles.h2} accessibilityRole="header">When to Use a Calculator If You Have a Court Order</Text>
                    <Text style={styles.paragraph}>
                        Even with a court order, a calculator is useful for:
                    </Text>

                    <View style={styles.useCaseCard}>
                        <Text style={styles.useCaseNumber}>1</Text>
                        <View style={styles.useCaseContent}>
                            <Text style={styles.useCaseTitle}>Planning for Order Expiry</Text>
                            <Text style={styles.useCaseText}>
                                If your order expires when your youngest child turns 18, use the calculator now to 
                                estimate what Services Australia would assess. This helps you budget for the transition.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.useCaseCard}>
                        <Text style={styles.useCaseNumber}>2</Text>
                        <View style={styles.useCaseContent}>
                            <Text style={styles.useCaseTitle}>Comparing Order to Formula</Text>
                            <Text style={styles.useCaseText}>
                                Calculate what the standard formula would be. If your court order is significantly 
                                different, you may have grounds to apply for variation (if circumstances have changed).
                            </Text>
                        </View>
                    </View>

                    <View style={styles.useCaseCard}>
                        <Text style={styles.useCaseNumber}>3</Text>
                        <View style={styles.useCaseContent}>
                            <Text style={styles.useCaseTitle}>Preparing Variation Application</Text>
                            <Text style={styles.useCaseText}>
                                If your income or care arrangement has changed significantly, use the calculator to 
                                show what the new assessment would be. This is evidence for your variation application.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.useCaseCard}>
                        <Text style={styles.useCaseNumber}>4</Text>
                        <View style={styles.useCaseContent}>
                            <Text style={styles.useCaseTitle}>Negotiating New Agreement</Text>
                            <Text style={styles.useCaseText}>
                                If you're negotiating to replace the court order with a consent order or binding 
                                agreement, the calculator shows what the baseline formula would be.
                            </Text>
                        </View>
                    </View>

                    <Pressable
                        style={[styles.calculatorButton, isWeb && webClickableStyles]}
                        onPress={() => router.push('/')}
                        accessibilityRole="button"
                    >
                        <Text style={styles.calculatorButtonText}>Try Free Calculator →</Text>
                    </Pressable>

                    {/* When Court Orders Expire */}
                    <Text style={styles.h2} accessibilityRole="header">When Do Court Orders Expire?</Text>
                    <Text style={styles.paragraph}>
                        Court orders don't last forever. Common expiry triggers:
                    </Text>

                    <View style={styles.expiryCard}>
                        <Text style={styles.expiryTitle}>🗓️ Automatic Expiry:</Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Child turns 18:</Text> Most orders expire when the youngest 
                            child reaches 18 (or finishes Year 12 if still in school)
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Specified date:</Text> Order states "until [date]" or "for 
                            [X] years"
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Event occurs:</Text> Order expires on remarriage, cohabitation, 
                            or other specified event
                        </Text>
                    </View>

                    <View style={styles.expiryCard}>
                        <Text style={styles.expiryTitle}>⚖️ Variation or Setting Aside:</Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Material change:</Text> Significant change in income, care, or 
                            circumstances
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Mutual agreement:</Text> Both parties agree to replace order 
                            with new arrangement
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Court application:</Text> One party applies to court to vary 
                            or set aside the order
                        </Text>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Don't Assume Expiry:</Text>
                        <Text style={styles.warningText}>
                            Even if you think your order has expired, continue payments until you have written 
                            confirmation from Services Australia or a new court order. Stopping payments without 
                            confirmation can result in arrears and penalties.
                        </Text>
                    </View>

                    {/* What Happens After Order Expires */}
                    <Text style={styles.h2} accessibilityRole="header">What Happens After Your Court Order Expires?</Text>
                    <Text style={styles.paragraph}>
                        When a court order expires, child support doesn't automatically stop. Here's what happens:
                    </Text>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 1</Text>
                        <Text style={styles.stepTitle}>Order Expires</Text>
                        <Text style={styles.stepText}>
                            The court order is no longer enforceable. You're not legally required to continue payments 
                            at the ordered amount.
                        </Text>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 2</Text>
                        <Text style={styles.stepTitle}>Apply for Services Australia Assessment</Text>
                        <Text style={styles.stepText}>
                            Either parent can apply for a Services Australia assessment. This uses the standard formula 
                            based on current income and care.
                        </Text>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 3</Text>
                        <Text style={styles.stepTitle}>Assessment Issued</Text>
                        <Text style={styles.stepText}>
                            Services Australia calculates child support using the formula. This becomes the new legally 
                            binding amount (unless you return to court or make a binding agreement).
                        </Text>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 4</Text>
                        <Text style={styles.stepTitle}>Payments Adjust</Text>
                        <Text style={styles.stepText}>
                            The new assessment amount may be higher or lower than the court order. Payments adjust to 
                            the new amount from the assessment date.
                        </Text>
                    </View>

                    <View style={styles.tipBox}>
                        <Text style={styles.tipTitle}>💡 Pro Tip:</Text>
                        <Text style={styles.tipText}>
                            Apply for a Services Australia assessment 2-3 months before your court order expires. 
                            This ensures a smooth transition and avoids gaps in child support.
                        </Text>
                    </View>

                    {/* Varying Court Orders */}
                    <Text style={styles.h2} accessibilityRole="header">How to Vary a Court Order</Text>
                    <Text style={styles.paragraph}>
                        If circumstances have changed significantly, you can apply to vary the court order:
                    </Text>

                    <View style={styles.groundsCard}>
                        <Text style={styles.groundsTitle}>Valid Grounds for Variation:</Text>
                        <Text style={styles.bulletItem}>• Significant income change (usually 15%+ increase or decrease)</Text>
                        <Text style={styles.bulletItem}>• Care arrangement has changed</Text>
                        <Text style={styles.bulletItem}>• New children born to either parent</Text>
                        <Text style={styles.bulletItem}>• Health issues affecting earning capacity</Text>
                        <Text style={styles.bulletItem}>• Unemployment or job loss</Text>
                        <Text style={styles.bulletItem}>• Order was based on incorrect information</Text>
                    </View>

                    <View style={styles.processCard}>
                        <Text style={styles.processTitle}>Variation Process:</Text>
                        <Text style={styles.bulletItem}>1. Gather evidence of changed circumstances</Text>
                        <Text style={styles.bulletItem}>2. Calculate what the new amount should be (use calculator)</Text>
                        <Text style={styles.bulletItem}>3. Attempt negotiation with other parent first</Text>
                        <Text style={styles.bulletItem}>4. If no agreement, file application with court</Text>
                        <Text style={styles.bulletItem}>5. Attend court hearing with evidence</Text>
                        <Text style={styles.bulletItem}>6. Court issues varied order or dismisses application</Text>
                    </View>

                    <View style={styles.costCard}>
                        <Text style={styles.costTitle}>💰 Cost Reality:</Text>
                        <Text style={styles.costText}>
                            Court applications cost $365 filing fee plus legal fees ($3,000-10,000+). Only pursue 
                            variation if the financial difference justifies the cost. For small changes, wait until 
                            the order expires and apply for Services Australia assessment.
                        </Text>
                    </View>

                    {/* Common Court Order Scenarios */}
                    <Text style={styles.h2} accessibilityRole="header">Common Court Order Scenarios</Text>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>Scenario 1: Order is Higher Than Formula</Text>
                        <Text style={styles.scenarioText}>
                            Your court order requires $1,500/month, but the calculator shows the formula would be 
                            $900/month.
                        </Text>
                        <Text style={styles.scenarioAction}>What to do:</Text>
                        <Text style={styles.scenarioText}>
                            You must continue paying $1,500/month until the order expires or is varied. If your 
                            circumstances have changed significantly since the order was made, you may have grounds 
                            to apply for variation. Otherwise, wait for expiry and apply for Services Australia 
                            assessment.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>Scenario 2: Order is Lower Than Formula</Text>
                        <Text style={styles.scenarioText}>
                            Your court order requires $600/month, but the calculator shows the formula would be 
                            $1,200/month.
                        </Text>
                        <Text style={styles.scenarioAction}>What to do:</Text>
                        <Text style={styles.scenarioText}>
                            The receiving parent can apply to vary the order if circumstances have changed (e.g., 
                            paying parent's income has increased significantly). If the order was based on accurate 
                            information at the time, they may need to wait for expiry.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>Scenario 3: Order Expires Next Month</Text>
                        <Text style={styles.scenarioText}>
                            Your youngest child turns 18 next month and your court order expires.
                        </Text>
                        <Text style={styles.scenarioAction}>What to do:</Text>
                        <Text style={styles.scenarioText}>
                            Apply for Services Australia assessment now. Use the calculator to estimate the new amount 
                            so you can budget. If the child is still in secondary school, child support continues 
                            until they finish Year 12 (or turn 18, whichever is later).
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>Scenario 4: Income Has Changed Significantly</Text>
                        <Text style={styles.scenarioText}>
                            Your income has dropped 40% due to job loss, but your court order requires fixed payments.
                        </Text>
                        <Text style={styles.scenarioAction}>What to do:</Text>
                        <Text style={styles.scenarioText}>
                            This is grounds for urgent variation. Use the calculator to show what the new assessment 
                            would be. Apply to court for variation immediately—don't wait. Continue paying the ordered 
                            amount until the court varies it (stopping payments can result in arrears).
                        </Text>
                    </View>

                    {/* FAQ */}
                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <FAQItem
                        question="Can I use a calculator if I have a court order for child support?"
                        answer="Yes, but the court order takes precedence. Use a calculator to: 1) Understand what the standard formula would be (to see if your order is fair), 2) Calculate what happens when the order expires, or 3) Prepare evidence for a variation application. The calculator cannot override a court order."
                    />

                    <FAQItem
                        question="What is the difference between a court order and Services Australia assessment?"
                        answer="A court order is legally binding and set by a judge, often departing from the standard formula for specific reasons. A Services Australia assessment uses the standard formula based on income and care. Court orders override Services Australia assessments. You cannot have both active simultaneously."
                    />

                    <FAQItem
                        question="How do I know if my court order is still valid?"
                        answer="Check your court order for: 1) Expiry date (many orders expire when youngest child turns 18), 2) Review clauses (some orders require review every 2-3 years), 3) Variation triggers (income changes, care changes). If expired or triggered, you can apply for a Services Australia assessment or return to court."
                    />

                    <FAQItem
                        question="Can I stop paying child support when my court order expires?"
                        answer="No. When a court order expires, child support obligation continues. Either parent can apply for a Services Australia assessment, which becomes the new legally binding amount. Continue paying until you have written confirmation from Services Australia or a new court order."
                    />

                    <FAQItem
                        question="Do I need a lawyer to vary a court order?"
                        answer="Not legally required, but highly recommended. Court variation applications involve complex legal arguments and evidence requirements. Legal fees ($3,000-10,000+) are significant, but mistakes can cost more. Get at least an initial consultation to understand your options and chances of success."
                    />

                    {/* Use Calculator */}
                    <View style={styles.calculatorSection}>
                        <Text style={styles.calculatorTitle}>Calculate What Happens After Your Order Expires</Text>
                        <Text style={styles.calculatorText}>
                            Use our free calculator to estimate what Services Australia would assess when your court 
                            order expires. Takes 3-5 minutes. No registration required.
                        </Text>
                        <Pressable
                            style={[styles.calculatorButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.calculatorButtonText}>Try Free Calculator</Text>
                        </Pressable>
                        <Text style={styles.calculatorDisclaimer}>
                            Calculator provides estimates only. For legal advice about varying or setting aside a 
                            court order, consult a family lawyer.
                        </Text>
                    </View>

                    {/* Final CTA */}
                    <View style={styles.finalCtaSection}>
                        <Text style={styles.finalCtaTitle}>Need Help With a Court Order?</Text>
                        <Text style={styles.finalCtaText}>
                            Court orders are complex legal documents. If you need to vary an order, understand your 
                            rights, or prepare for order expiry, connect with experienced family lawyers.
                        </Text>
                        <Pressable
                            style={[styles.primaryButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.primaryButtonText}>Get Legal Advice</Text>
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
    
    alertBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderWidth: 2, borderColor: '#2563EB', padding: 20, marginBottom: 24, ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    alertTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    alertText: { fontSize: 15, lineHeight: 24, color: '#1e3a8a' },
    
    comparisonCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 }) },
    comparisonTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    
    keyPointBox: { backgroundColor: '#fef3c7', borderRadius: 12, borderWidth: 1, borderColor: '#fbbf24', padding: 16, marginBottom: 16 },
    keyPointTitle: { fontSize: 15, fontWeight: '600', color: '#78350f', marginBottom: 8 },
    keyPointText: { fontSize: 15, lineHeight: 24, color: '#78350f' },
    
    sectionCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    sectionText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8 },
    
    useCaseCard: { flexDirection: 'row', backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#86efac' },
    useCaseNumber: { fontSize: 24, fontWeight: '700', color: '#22c55e', marginRight: 12, width: 32 },
    useCaseContent: { flex: 1 },
    useCaseTitle: { fontSize: 16, fontWeight: '600', color: '#14532d', marginBottom: 4 },
    useCaseText: { fontSize: 14, lineHeight: 22, color: '#14532d' },
    
    calculatorButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 24, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    calculatorButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
    
    expiryCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 }) },
    expiryTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 12 },
    
    warningBox: { backgroundColor: '#fef3c7', borderRadius: 12, borderWidth: 1, borderColor: '#fbbf24', padding: 16, marginBottom: 16 },
    warningTitle: { fontSize: 15, fontWeight: '600', color: '#78350f', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#78350f' },
    
    stepCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#bfdbfe' },
    stepNumber: { fontSize: 14, fontWeight: '700', color: '#2563EB', marginBottom: 4 },
    stepTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 6 },
    stepText: { fontSize: 14, lineHeight: 22, color: '#475569' },
    
    tipBox: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#86efac' },
    tipTitle: { fontSize: 15, fontWeight: '600', color: '#14532d', marginBottom: 8 },
    tipText: { fontSize: 15, lineHeight: 24, color: '#14532d' },
    
    groundsCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    groundsTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },
    
    processCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    processTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },
    
    costCard: { backgroundColor: '#fef2f2', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#fecaca' },
    costTitle: { fontSize: 16, fontWeight: '600', color: '#991b1b', marginBottom: 8 },
    costText: { fontSize: 15, lineHeight: 24, color: '#991b1b' },
    
    scenarioCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 }) },
    scenarioTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    scenarioText: { fontSize: 14, lineHeight: 22, color: '#475569', marginBottom: 8 },
    scenarioAction: { fontSize: 14, fontWeight: '600', color: '#2563EB', marginTop: 8, marginBottom: 4 },
    
    faqItem: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    faqQuestion: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    faqAnswer: { fontSize: 15, lineHeight: 24, color: '#475569' },
    
    calculatorSection: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 24, marginTop: 32, marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: '#bfdbfe' },
    calculatorTitle: { fontSize: 22, fontWeight: '700', color: '#1e3a8a', marginBottom: 12, textAlign: 'center' },
    calculatorText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 20, textAlign: 'center' },
    calculatorDisclaimer: { fontSize: 13, color: '#64748b', textAlign: 'center', fontStyle: 'italic' },
    
    finalCtaSection: { backgroundColor: '#1e3a8a', borderRadius: 12, padding: 28, marginTop: 32, alignItems: 'center', ...createShadow({ shadowColor: '#1e3a8a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    finalCtaTitle: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 12, textAlign: 'center' },
    finalCtaText: { fontSize: 16, lineHeight: 26, color: '#bfdbfe', marginBottom: 24, textAlign: 'center' },
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 32, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 18, fontWeight: '700' },
});
