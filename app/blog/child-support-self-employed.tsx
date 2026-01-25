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
            name: 'How is child support calculated for self-employed parents in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Services Australia uses your Adjusted Taxable Income from your tax return, which includes business income minus allowable deductions. They may add back certain business expenses like depreciation, home office costs, and personal use of business assets. The assessment looks at your actual taxable income, not gross business revenue.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can Services Australia access my business financial records?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Services Australia has legal authority to request business financial records, bank statements, BAS statements, and tax returns. They can also request information directly from the ATO. Refusing to provide records can result in default assessments based on industry averages or penalties.',
            },
        },
        {
            '@type': 'Question',
            name: 'What if my business income varies significantly year to year?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Child support is reassessed annually based on your latest tax return. If your income drops significantly mid-year, you can request an interim assessment. If income fluctuates dramatically, the other parent may apply for a Change of Assessment claiming your earning capacity is higher than reported income.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Child Support for Self-Employed Parents: How Business Income is Assessed',
    description: 'Complete guide to child support for self-employed parents in Australia. Learn how business income is assessed, what expenses are added back, and when you need legal advice.',
    datePublished: '2026-01-24',
    author: { '@type': 'Organization', name: 'AusChildSupport' },
};

export default function ChildSupportSelfEmployedBlogPost() {
    const router = useRouter();

    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="Child Support for Self-Employed Parents: How Business Income is Assessed"
                description="Complete guide to child support for self-employed parents in Australia. Learn how business income is assessed, what expenses are added back, and when you need legal advice."
                canonicalPath="/blog/child-support-self-employed"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Self-Employed Parents' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Self-Employment</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            Child Support for Self-Employed Parents: How Business Income is Assessed
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        Self-employed? Your child support assessment is more complex than wage earners. Services Australia 
                        scrutinizes business income differently, adds back certain expenses, and has legal authority to 
                        access your financial records. Here's what you need to know.
                    </Text>

                    <View style={styles.alertBox}>
                        <Text style={styles.alertTitle}>⚠️ High-Risk Assessment Area</Text>
                        <Text style={styles.alertText}>
                            Self-employment is one of the most disputed areas in child support. Mistakes in reporting 
                            business income can result in underpayment penalties, Change of Assessment applications, 
                            or legal action. This guide covers the basics—complex cases need professional advice.
                        </Text>
                    </View>

                    {/* How Business Income is Assessed */}
                    <Text style={styles.h2} accessibilityRole="header">How Business Income is Assessed</Text>
                    <Text style={styles.paragraph}>
                        Services Australia doesn't use your gross business revenue. They use your Adjusted Taxable Income 
                        (ATI) from your tax return, which includes:
                    </Text>

                    <View style={styles.listCard}>
                        <Text style={styles.listTitle}>✓ What's Included in ATI:</Text>
                        <Text style={styles.bulletItem}>• Net business income (after allowable deductions)</Text>
                        <Text style={styles.bulletItem}>• Reportable fringe benefits</Text>
                        <Text style={styles.bulletItem}>• Reportable superannuation contributions</Text>
                        <Text style={styles.bulletItem}>• Target foreign income</Text>
                        <Text style={styles.bulletItem}>• Tax-free pensions or benefits</Text>
                        <Text style={styles.bulletItem}>• Total net investment losses</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        But here's where it gets complicated: Services Australia can add back certain business expenses 
                        they consider personal benefits rather than legitimate business costs.
                    </Text>

                    {/* Expenses That Get Added Back */}
                    <Text style={styles.h2} accessibilityRole="header">Business Expenses That Get Added Back</Text>
                    <Text style={styles.paragraph}>
                        Even if the ATO allows these deductions, Services Australia may add them back to your income 
                        for child support purposes:
                    </Text>

                    <View style={styles.warningCard}>
                        <Text style={styles.warningCardTitle}>🔍 Commonly Scrutinized Expenses:</Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Depreciation:</Text> Non-cash expense that reduces taxable income 
                            but doesn't affect cash flow
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Home office costs:</Text> Portion deemed personal use (electricity, 
                            internet, mortgage interest)
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Vehicle expenses:</Text> Personal use of business vehicle
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Travel and meals:</Text> Expenses with personal benefit component
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Superannuation contributions:</Text> Above compulsory amounts
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Losses from prior years:</Text> Carried forward to reduce current income
                        </Text>
                    </View>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Real Example:</Text>
                        <Text style={styles.exampleText}>Business owner reports $60,000 taxable income</Text>
                        <Text style={styles.exampleText}>Services Australia adds back:</Text>
                        <Text style={styles.exampleCalc}>+ $15,000 depreciation</Text>
                        <Text style={styles.exampleCalc}>+ $8,000 home office costs</Text>
                        <Text style={styles.exampleCalc}>+ $5,000 vehicle personal use</Text>
                        <Text style={styles.exampleResult}>Assessed income: $88,000 (47% higher)</Text>
                        <Text style={styles.exampleImpact}>
                            This increases child support by approximately $400-600/month depending on care arrangement.
                        </Text>
                    </View>

                    {/* What Services Australia Can Access */}
                    <Text style={styles.h2} accessibilityRole="header">What Financial Records Can Services Australia Access?</Text>
                    <Text style={styles.paragraph}>
                        Services Australia has broad legal powers to verify self-employed income:
                    </Text>

                    <View style={styles.accessCard}>
                        <Text style={styles.accessTitle}>📋 Records They Can Request:</Text>
                        <Text style={styles.bulletItem}>• Complete tax returns (last 2-3 years)</Text>
                        <Text style={styles.bulletItem}>• Business Activity Statements (BAS)</Text>
                        <Text style={styles.bulletItem}>• Profit and loss statements</Text>
                        <Text style={styles.bulletItem}>• Balance sheets</Text>
                        <Text style={styles.bulletItem}>• Bank statements (business and personal)</Text>
                        <Text style={styles.bulletItem}>• Invoices and receipts</Text>
                        <Text style={styles.bulletItem}>• Contracts with clients</Text>
                        <Text style={styles.bulletItem}>• Trust distributions (if applicable)</Text>
                    </View>

                    <View style={styles.dangerBox}>
                        <Text style={styles.dangerTitle}>⚠️ Critical Warning:</Text>
                        <Text style={styles.dangerText}>
                            Services Australia can request information directly from the ATO without your permission. 
                            They can also issue formal notices requiring you to provide records within 28 days. 
                            Refusing or providing false information can result in penalties or default assessments 
                            based on industry averages (often higher than actual income).
                        </Text>
                    </View>

                    {/* Income Fluctuations */}
                    <Text style={styles.h2} accessibilityRole="header">What If Your Business Income Fluctuates?</Text>
                    <Text style={styles.paragraph}>
                        Business income rarely stays consistent. Here's how child support handles fluctuations:
                    </Text>

                    <Text style={styles.h3} accessibilityRole="header">Annual Reassessment</Text>
                    <Text style={styles.paragraph}>
                        Child support is automatically reassessed each year when you lodge your tax return. If your 
                        income drops, your payments adjust accordingly. If it increases, you'll pay more.
                    </Text>

                    <Text style={styles.h3} accessibilityRole="header">Interim Assessments (Income Drops)</Text>
                    <Text style={styles.paragraph}>
                        If your income drops significantly mid-year (business downturn, loss of major client), you can 
                        request an interim assessment. You'll need to provide:
                    </Text>

                    <View style={styles.listCard}>
                        <Text style={styles.bulletItem}>• Evidence of income reduction (recent BAS, bank statements)</Text>
                        <Text style={styles.bulletItem}>• Explanation of why income dropped</Text>
                        <Text style={styles.bulletItem}>• Projection of income for remainder of year</Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Change of Assessment (Income Increases or Hidden)</Text>
                    <Text style={styles.paragraph}>
                        If the other parent believes you're underreporting income or your earning capacity is higher 
                        than reported, they can apply for a Change of Assessment. Common grounds:
                    </Text>

                    <View style={styles.warningCard}>
                        <Text style={styles.warningCardTitle}>🚨 Red Flags That Trigger Change of Assessment:</Text>
                        <Text style={styles.bulletItem}>• Income drops suddenly after separation</Text>
                        <Text style={styles.bulletItem}>• Lifestyle doesn't match reported income (new car, overseas trips)</Text>
                        <Text style={styles.bulletItem}>• Business expenses seem inflated</Text>
                        <Text style={styles.bulletItem}>• Income paid to family members or trusts</Text>
                        <Text style={styles.bulletItem}>• Cash-based business with limited paper trail</Text>
                        <Text style={styles.bulletItem}>• Significant assets but low reported income</Text>
                    </View>

                    <Pressable
                        style={[styles.ctaButton, isWeb && webClickableStyles]}
                        onPress={() => router.push('/blog/complicated-child-support-situations')}
                        accessibilityRole="button"
                    >
                        <Text style={styles.ctaButtonText}>
                            Read: 8 Complicated Situations That Need Legal Advice →
                        </Text>
                    </Pressable>

                    {/* Trusts and Company Structures */}
                    <Text style={styles.h2} accessibilityRole="header">Business Structures: Sole Trader vs Company vs Trust</Text>
                    <Text style={styles.paragraph}>
                        Your business structure significantly affects how income is assessed:
                    </Text>

                    <View style={styles.structureCard}>
                        <Text style={styles.structureTitle}>Sole Trader</Text>
                        <Text style={styles.structureText}>
                            <Text style={styles.bold}>Assessment:</Text> Straightforward—net business income from tax return
                        </Text>
                        <Text style={styles.structureText}>
                            <Text style={styles.bold}>Risk:</Text> Expenses may be added back
                        </Text>
                    </View>

                    <View style={styles.structureCard}>
                        <Text style={styles.structureTitle}>Company (Pty Ltd)</Text>
                        <Text style={styles.structureText}>
                            <Text style={styles.bold}>Assessment:</Text> Salary + dividends + fringe benefits
                        </Text>
                        <Text style={styles.structureText}>
                            <Text style={styles.bold}>Risk:</Text> Retained profits in company may be deemed available income
                        </Text>
                        <Text style={styles.structureText}>
                            <Text style={styles.bold}>Scrutiny:</Text> High—Services Australia may argue you're minimizing 
                            personal income by retaining profits
                        </Text>
                    </View>

                    <View style={styles.structureCard}>
                        <Text style={styles.structureTitle}>Trust</Text>
                        <Text style={styles.structureText}>
                            <Text style={styles.bold}>Assessment:</Text> Trust distributions to you
                        </Text>
                        <Text style={styles.structureText}>
                            <Text style={styles.bold}>Risk:</Text> Extremely high scrutiny—trusts are often used to minimize 
                            child support
                        </Text>
                        <Text style={styles.structureText}>
                            <Text style={styles.bold}>Scrutiny:</Text> Services Australia may argue you control distributions 
                            and should be assessed on full trust income
                        </Text>
                    </View>

                    <View style={styles.dangerBox}>
                        <Text style={styles.dangerTitle}>🚨 Trust Warning:</Text>
                        <Text style={styles.dangerText}>
                            If you control a trust and distribute income to family members (spouse, adult children) 
                            to reduce your personal income, Services Australia can apply for a court order to assess 
                            you on the full trust income. This is a complex legal area—get advice before making 
                            distribution decisions.
                        </Text>
                    </View>

                    {/* Common Mistakes */}
                    <Text style={styles.h2} accessibilityRole="header">5 Common Mistakes Self-Employed Parents Make</Text>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>1.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Assuming ATO Deductions = Child Support Deductions</Text>
                            <Text style={styles.mistakeText}>
                                Just because the ATO allows a deduction doesn't mean Services Australia will. 
                                Depreciation, home office, and vehicle expenses are commonly added back.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>2.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Not Keeping Detailed Records</Text>
                            <Text style={styles.mistakeText}>
                                If you can't prove business expenses are legitimate, Services Australia will disallow 
                                them. Keep receipts, invoices, and documentation for everything.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>3.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Suddenly Reducing Income After Separation</Text>
                            <Text style={styles.mistakeText}>
                                If your income drops significantly right after separation, expect scrutiny. The other 
                                parent can apply for Change of Assessment claiming you're deliberately reducing income.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>4.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Using Business Funds for Personal Expenses</Text>
                            <Text style={styles.mistakeText}>
                                Paying personal expenses through the business (school fees, groceries, holidays) can 
                                be deemed personal income and added to your assessment.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeNumber}>5.</Text>
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeTitle}>Not Getting Legal Advice on Trust Distributions</Text>
                            <Text style={styles.mistakeText}>
                                Trust distributions are heavily scrutinized. Making distribution decisions without 
                                understanding child support implications can result in assessments on income you 
                                didn't personally receive.
                            </Text>
                        </View>
                    </View>

                    {/* When You Need Legal Advice */}
                    <Text style={styles.h2} accessibilityRole="header">When Self-Employed Parents Need Legal Advice</Text>
                    <Text style={styles.paragraph}>
                        Self-employment adds complexity that makes DIY child support risky. Get legal advice if:
                    </Text>

                    <View style={styles.legalAdviceCard}>
                        <Text style={styles.legalAdviceTitle}>🔴 High-Risk Situations:</Text>
                        <Text style={styles.bulletItem}>• Your business uses a company or trust structure</Text>
                        <Text style={styles.bulletItem}>• You distribute income to family members</Text>
                        <Text style={styles.bulletItem}>• Your income fluctuates by more than 25% year-to-year</Text>
                        <Text style={styles.bulletItem}>• The other parent has applied for Change of Assessment</Text>
                        <Text style={styles.bulletItem}>• Services Australia has requested financial records</Text>
                        <Text style={styles.bulletItem}>• You're considering restructuring your business</Text>
                        <Text style={styles.bulletItem}>• Your lifestyle doesn't match reported income</Text>
                        <Text style={styles.bulletItem}>• You have significant business assets but low income</Text>
                    </View>

                    <View style={styles.costBenefitCard}>
                        <Text style={styles.costBenefitTitle}>💰 Cost vs Benefit:</Text>
                        <Text style={styles.costBenefitText}>
                            Legal advice costs $300-500/hour. A mistake in self-employed income assessment can cost 
                            $5,000-20,000/year in overpaid child support or penalties. For complex business structures, 
                            legal advice pays for itself within months.
                        </Text>
                    </View>

                    <Pressable
                        style={[styles.primaryButton, isWeb && webClickableStyles]}
                        onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=hidden_income')}
                        accessibilityRole="button"
                    >
                        <Text style={styles.primaryButtonText}>Connect With Family Lawyers</Text>
                    </Pressable>

                    {/* FAQ */}
                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <FAQItem
                        question="How is child support calculated for self-employed parents in Australia?"
                        answer="Services Australia uses your Adjusted Taxable Income from your tax return, which includes business income minus allowable deductions. They may add back certain business expenses like depreciation, home office costs, and personal use of business assets. The assessment looks at your actual taxable income, not gross business revenue."
                    />

                    <FAQItem
                        question="Can Services Australia access my business financial records?"
                        answer="Yes. Services Australia has legal authority to request business financial records, bank statements, BAS statements, and tax returns. They can also request information directly from the ATO. Refusing to provide records can result in default assessments based on industry averages or penalties."
                    />

                    <FAQItem
                        question="What if my business income varies significantly year to year?"
                        answer="Child support is reassessed annually based on your latest tax return. If your income drops significantly mid-year, you can request an interim assessment. If income fluctuates dramatically, the other parent may apply for a Change of Assessment claiming your earning capacity is higher than reported income."
                    />

                    <FAQItem
                        question="Can I reduce child support by paying myself less from my company?"
                        answer="No. Services Australia can assess you on retained company profits if they believe you're deliberately minimizing personal income to reduce child support. This is called 'income attribution' and requires court orders, but it's commonly applied to self-employed parents who control their income."
                    />

                    <FAQItem
                        question="What happens if I use a trust to distribute business income?"
                        answer="Trusts receive extreme scrutiny. If you control trust distributions and distribute income to family members to reduce your personal income, Services Australia can apply to assess you on the full trust income. Trust structures in child support cases almost always require legal advice."
                    />

                    {/* Calculate Your Estimate */}
                    <View style={styles.calculatorSection}>
                        <Text style={styles.calculatorTitle}>Estimate Your Child Support</Text>
                        <Text style={styles.calculatorText}>
                            Use our free calculator to estimate child support based on your business income. 
                            Enter your taxable income (after deductions) to get an instant estimate.
                        </Text>
                        <Pressable
                            style={[styles.calculatorButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.calculatorButtonText}>Try Free Calculator</Text>
                        </Pressable>
                        <Text style={styles.calculatorDisclaimer}>
                            Note: The calculator uses standard income. If Services Australia adds back business 
                            expenses, your actual assessment will be higher.
                        </Text>
                    </View>

                    {/* Final CTA */}
                    <View style={styles.finalCtaSection}>
                        <Text style={styles.finalCtaTitle}>Self-Employed? Get Expert Advice</Text>
                        <Text style={styles.finalCtaText}>
                            Business income assessments are complex and high-risk. Connect with experienced family 
                            lawyers who understand self-employment and child support.
                        </Text>
                        <Pressable
                            style={[styles.primaryButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=hidden_income')}
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
    
    alertBox: { backgroundColor: '#fef3c7', borderRadius: 12, borderWidth: 2, borderColor: '#fbbf24', padding: 20, marginBottom: 24, ...createShadow({ shadowColor: '#fbbf24', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    alertTitle: { fontSize: 16, fontWeight: '700', color: '#78350f', marginBottom: 8 },
    alertText: { fontSize: 15, lineHeight: 24, color: '#78350f' },
    
    listCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    listTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },
    
    warningCard: { backgroundColor: '#fef2f2', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#fecaca' },
    warningCardTitle: { fontSize: 16, fontWeight: '600', color: '#991b1b', marginBottom: 12 },
    
    exampleCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }) },
    exampleTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    exampleText: { fontSize: 14, color: '#475569', marginBottom: 4 },
    exampleCalc: { fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: '#64748b', marginBottom: 4, paddingLeft: 8 },
    exampleResult: { fontSize: 16, fontWeight: '700', color: '#dc2626', marginTop: 8, marginBottom: 4 },
    exampleImpact: { fontSize: 14, color: '#475569', fontStyle: 'italic', marginTop: 8 },
    
    accessCard: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#86efac' },
    accessTitle: { fontSize: 16, fontWeight: '600', color: '#14532d', marginBottom: 12 },
    
    dangerBox: { backgroundColor: '#fef2f2', borderRadius: 12, borderWidth: 2, borderColor: '#dc2626', padding: 20, marginBottom: 24, ...createShadow({ shadowColor: '#dc2626', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    dangerTitle: { fontSize: 16, fontWeight: '700', color: '#991b1b', marginBottom: 8 },
    dangerText: { fontSize: 15, lineHeight: 24, color: '#991b1b' },
    
    structureCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 }) },
    structureTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    structureText: { fontSize: 14, lineHeight: 22, color: '#475569', marginBottom: 6 },
    
    mistakeCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    mistakeNumber: { fontSize: 24, fontWeight: '700', color: '#dc2626', marginRight: 12, width: 32 },
    mistakeContent: { flex: 1 },
    mistakeTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginBottom: 4 },
    mistakeText: { fontSize: 14, lineHeight: 22, color: '#475569' },
    
    legalAdviceCard: { backgroundColor: '#fef2f2', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#fecaca' },
    legalAdviceTitle: { fontSize: 16, fontWeight: '600', color: '#991b1b', marginBottom: 12 },
    
    costBenefitCard: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#86efac' },
    costBenefitTitle: { fontSize: 16, fontWeight: '600', color: '#14532d', marginBottom: 8 },
    costBenefitText: { fontSize: 15, lineHeight: 24, color: '#14532d' },
    
    ctaButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 20, marginBottom: 16, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    ctaButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
    
    faqItem: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    faqQuestion: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    faqAnswer: { fontSize: 15, lineHeight: 24, color: '#475569' },
    
    calculatorSection: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 24, marginTop: 32, marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: '#bfdbfe' },
    calculatorTitle: { fontSize: 22, fontWeight: '700', color: '#1e3a8a', marginBottom: 12, textAlign: 'center' },
    calculatorText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 20, textAlign: 'center' },
    calculatorButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 28, marginBottom: 12, ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    calculatorButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
    calculatorDisclaimer: { fontSize: 13, color: '#64748b', textAlign: 'center', fontStyle: 'italic' },
    
    finalCtaSection: { backgroundColor: '#1e3a8a', borderRadius: 12, padding: 28, marginTop: 32, alignItems: 'center', ...createShadow({ shadowColor: '#1e3a8a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    finalCtaTitle: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 12, textAlign: 'center' },
    finalCtaText: { fontSize: 16, lineHeight: 26, color: '#bfdbfe', marginBottom: 24, textAlign: 'center' },
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 32, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 18, fontWeight: '700' },
});
