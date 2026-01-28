import { ContextualWizard } from '@/src/components/blog/ContextualWizard';
import { PageSEO } from '@/src/components/seo/PageSEO';
import { CalculatorHeader } from '@/src/features/calculator';
import { createBlogStyles } from '@/src/styles/blogStyles';
import { MAX_CALCULATOR_WIDTH, isWeb, webClickableStyles } from '@/src/utils/responsive';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'Can I go to jail for not paying child support in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Generally no, you cannot go to jail simply for owing a debt. However, if a court orders you to pay and you refuse despite having the ability to pay, you could theoretically be charged with contempt of court, but this is extremely rare. The most common enforcement actions are wage types, tax refund intercepts, and travel bans.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can child support take my tax refund?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Services Australia can intercept your tax refund (Section 72 of the CSP Act) to pay off child support debts. This happens automatically if you have a registered debt. They can take the entire refund up to the amount you owe.',
            },
        },
        {
            '@type': 'Question',
            name: 'Does bankruptcy clear child support debt?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. Child support debts are not extinguished by bankruptcy (Bankruptcy Act 1966 Section 153). Services Australia can still collect arrears from your income, including from protected earnings in some cases, even while you are bankrupt.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I be stopped from leaving the country?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. If you have a persistent child support debt, the Registrar can issue a Departure Prohibition Order (DPO) under Section 72D of the CSRC Act. This prevents you from leaving Australia until the debt is paid or a satisfactory arrangement is made.',
            },
        },
        {
            '@type': 'Question',
            name: 'What interest is charged on unpaid child support?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'A Late Payment Penalty applies to child support debts that are not paid by the due date. This is a debt due to the Commonwealth, not the other parent. The penalty is calculated based on the outstanding amount and statutory rates.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'What Happens If You Don\'t Pay Child Support? (2026 Guide)',
    description: 'Services Australia has extensive powers to collect unpaid child support, including wage garnishing, tax refund intercepts, and international travel bans. Learn the risks of non-payment.',
    datePublished: '2026-01-28',
    dateModified: '2026-01-28',
    author: {
        '@type': 'Organization',
        name: 'AusChildSupport',
        url: 'https://auschildsupport.com.au',
    },
    publisher: {
        '@type': 'Organization',
        name: 'AusChildSupport',
        logo: {
            '@type': 'ImageObject',
            url: 'https://auschildsupport.com.au/assets/logo.png',
        },
    },
};

const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [articleSchema, faqSchema],
};

export default function BlogPost() {
    const router = useRouter();
    const styles = createBlogStyles();
    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="What Happens If You Don't Pay Child Support? (2026 Guide)"
                description="Services Australia can garnish wages, seize tax refunds, suspend licenses, and ban international travel. See enforcement powers + payment plans. Act now."
                canonicalPath="/blog/what-happens-if-dont-pay-child-support"
                schema={combinedSchema}
                breadcrumbs={[
                    { label: 'Blog', path: '/blog' },
                    { label: 'Child Support Arrears', path: '/blog/what-happens-if-dont-pay-child-support' },
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
                        <Text style={styles.category}>Enforcement & Arrears</Text>
                        <Text style={styles.h1} accessibilityRole="header">What Happens If You Don't Pay Child Support?</Text>
                        <Text style={styles.publishDate}>Published January 28, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        Ignoring child support payments is one of the most financially dangerous decisions a parent can make. Services Australia has enforcement powers that far exceed those of regular debt collectors, banks, or even the ATO in some respects.
                    </Text>

                    <Text style={styles.paragraph}>
                        Many parents assume that if they stop paying, the debt will just sit there. The reality is that the Australian Government has automated systems designed to intercept your money before it ever reaches your account.
                    </Text>

                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            If you do not pay child support, Services Australia can legally:
                            {'\n'}• Deduct payments directly from your salary (Employer Withholding)
                            {'\n'}• Intercept your tax return (Section 72)
                            {'\n'}• Garnishee funds from your bank account
                            {'\n'}• Stop you from leaving Australia (Departure Prohibition Order)
                            {'\n'}• Charge Late Payment Penalties on the debt
                        </Text>
                        <Pressable style={[styles.calculatorButton, isWeb && webClickableStyles, { marginTop: 16, marginBottom: 0, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' }]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.calculatorButtonText}>Check How Much You Should Pay →</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">1. Employer Withholding (Garnishing Wages)</Text>
                    <Text style={styles.paragraph}>
                        The most common enforcement action is <Text style={styles.bold}>Employer Withholding</Text> (CSRC Act section 72A). Services Australia can issue a notice to your employer requiring them to deduct child support directly from your pay.
                    </Text>

                    <View style={styles.dangerCard}>
                        <Text style={styles.dangerCardTitle}>Employers Must Comply</Text>
                        <Text style={styles.paragraph}>
                            Your employer has no choice. Under Australian law, a child support garnishee notice <Text style={styles.bold}>takes priority</Text> over almost all other deductions, including bank loan repayments and even some court orders.
                        </Text>
                        <Text style={styles.paragraph}>
                            Employers who fail to deduct the money can be personally liable for the debt and face penalties themselves.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">2. Tax Refund Intercepts</Text>
                    <Text style={styles.paragraph}>
                        If you have a child support debt, Services Australia will almost certainly take your tax refund. This is known as a <Text style={styles.bold}>Tax Refund Intercept</Text> (CSRC Act section 72).
                    </Text>
                    <Text style={styles.paragraph}>
                        The ATO and Child Support systems are linked. As soon as you lodge your tax return, if a refund is due, it is automatically flagged and diverted to pay your child support arrears. This happens before you even see the money.
                    </Text>

                    <Text style={styles.h2} accessibilityRole="header">3. Departure Prohibition Orders (Travel Ban)</Text>
                    <Text style={styles.paragraph}>
                        For persistent non-payment, the Registrar can issue a <Text style={styles.bold}>Departure Prohibition Order (DPO)</Text> under Section 72D of the Act.
                    </Text>

                    <View style={styles.urgentCard}>
                        <Text style={styles.urgentCardTitle}>Stuck at the Airport?</Text>
                        <Text style={styles.paragraph}>
                            A DPO prevents you from leaving Australia. The Australian Federal Police (AFP) are notified, and you will be stopped at immigration.
                        </Text>
                        <Text style={styles.paragraph}>
                            We have seen cases where parents are stopped at the airport on their way to a holiday or business trip. A DPO is usually only lifted once the debt is paid in full or a strict lump-sum arrangement is secured.
                        </Text>
                    </View>

                    <View style={styles.frameworkCard}>
                        <Text style={styles.frameworkTitle}>Need Legal Help with a DPO?</Text>
                        <Text style={styles.paragraph}>
                            If you have been issued a DPO unfairly or need to travel for urgent reasons, you may need a lawyer to negotiate with Services Australia or apply for a Departure Authorisation Certificate.
                        </Text>
                        <Pressable style={isWeb && webClickableStyles} onPress={() => router.push('/lawyer-inquiry?mode=direct')} accessibilityRole="button">
                            <Text style={styles.frameworkAction}>Find a Family Lawyer →</Text>
                        </Pressable>
                    </View>

                    {/* Internal Links: Related Content */}
                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>📖 Related Articles</Text>
                        <Text style={styles.infoText}>
                            Learn more about managing child support obligations:
                        </Text>
                        <Pressable style={[styles.infoButton, isWeb && webClickableStyles]} onPress={() => router.push('/blog/child-support-arrears-australia')} accessibilityRole="button">
                            <Text style={styles.infoButtonText}>How to Deal with Arrears →</Text>
                        </Pressable>
                        <Pressable style={[styles.infoButton, isWeb && webClickableStyles, { marginTop: 8 }]} onPress={() => router.push('/blog/child-support-reduction-strategies')} accessibilityRole="button">
                            <Text style={styles.infoButtonText}>Legal Ways to Reduce Payments →</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">4. Late Payment Penalties</Text>
                    <Text style={styles.paragraph}>
                        When you miss a payment, you don't just owe child support—you owe a debt to the Commonwealth. A <Text style={styles.bold}>Late Payment Penalty</Text> (Section 67) is charged on unpaid amounts.
                    </Text>
                    <Text style={styles.paragraph}>
                        Unlike the child support itself (which goes to the other parent), these penalties are kept by the government. While you can apply to have them "remitted" (forgiven) under Section 68, you generally need a very good reason, such as agency error or serious hardship.
                    </Text>

                    <Text style={styles.h2} accessibilityRole="header">5. The "Private Collect" Trap</Text>
                    <Text style={styles.paragraph}>
                        If you have a Private Collect arrangement (where you pay the other parent directly), you might think you are safe from government enforcement. This is a dangerous assumption.
                    </Text>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>The 3-Month Arrears Rule</Text>
                        <Text style={styles.exampleText}>
                            If you stop paying privately, the receiving parent can call Services Australia and switch to "Agency Collect."
                        </Text>
                        <Text style={styles.exampleText}>
                            Under Section 7.3.2 of the Child Support Guide, the Agency can retrospectively collect <Text style={styles.bold}>up to 3 months</Text> of unpaid arrears (and up to 9 months in exceptional circumstances) immediately.
                        </Text>
                        <Text style={styles.exampleResult}>Result: You instantly originate a registered debt and enforcement begins.</Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>Can they take money from my bank account?</Text>
                        <Text style={styles.faqAnswer}>
                            Yes. This is called a "Garnishee Notice" (Section 72A). Services Australia can order your bank to transfer funds from your savings or transaction accounts to cover the debt. They can also garnish funds held by third parties, such as proceeds from the sale of a house.
                        </Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>Does bankruptcy clear child support?</Text>
                        <Text style={styles.faqAnswer}>
                            No. Child support is a "non-provable debt" in bankruptcy. Section 153 of the Bankruptcy Act 1966 specifically excludes child support from being extinguished. You will still owe the money after your bankruptcy ends, and they can continue to collect during bankruptcy.
                        </Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>What if I simply can't afford to pay?</Text>
                        <Text style={styles.faqAnswer}>
                            If your income has dropped, you must update your income estimate with Services Australia immediately. If the assessment is unfair due to special circumstances (e.g., high costs of access), you may need to file a "Change of Assessment" (Reason 8). Ignoring the debt will not make it go away—it will only add penalties.
                        </Text>
                    </View>

                    {/* Contextual Wizard for Financial Hardship */}
                    <ContextualWizard
                        preselectedFactors={['change_circumstances']}
                        highlightedFactors={['income_resources_not_reflected', 'high_contact_costs', 'overpayment_issue']}
                        blogTopic="arrears_enforcement"
                        ctaText="Get Help Resolving Payment Issues"
                        analyticsSource="blog_what_happens_if_dont_pay"
                        formReason="special_circumstances"
                        title="Struggling to Meet Your Obligations?"
                        description="If your circumstances have changed or the assessment is unfair, you may have legal options. Select any factors that apply to your situation."
                    />

                    {/* Trust Signals */}
                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>💡 What a Lawyer Can Do</Text>
                        <Text style={styles.infoText}>
                            • Negotiate payment arrangements with Services Australia
                            {'\n'}• Apply for Change of Assessment if circumstances changed
                            {'\n'}• Challenge DPOs or garnishee orders if issued unfairly
                            {'\n'}• Request remission of late payment penalties
                            {'\n'}• Most offer free initial consultations to assess your case
                        </Text>
                    </View>

                    <View style={styles.finalCtaSection}>
                        <Text style={styles.finalCtaTitle}>Check Your Liability</Text>
                        <Text style={styles.finalCtaText}>
                            Don't guess what you owe. Use our free 2026 calculator to get an accurate estimate of your child support obligations.
                        </Text>
                        <View style={styles.finalCtaTrustSignals}>
                            <Text style={styles.finalCtaTrustItem}>✓ 2026 Tax Rates Applied</Text>
                            <Text style={styles.finalCtaTrustItem}>✓ Accurate Formula Logic</Text>
                            <Text style={styles.finalCtaTrustItem}>✓ Free & Anonymous</Text>
                        </View>
                        <Pressable style={[styles.primaryButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.primaryButtonText}>Use Free Calculator</Text>
                        </Pressable>
                        <Text style={styles.finalCtaDisclaimer}>
                            Disclaimer: This article provides general information only and does not constitute legal advice. Child support laws are complex. Consult a qualified family lawyer for your specific situation.
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}
