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
            name: 'Does my new partner\'s income affect child support in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. Your new partner\'s income is NOT included in the standard child support formula, and the Registrar must legally disregard it. Only your income and the other parent\'s income matter. However, if you deliberately reduce your own income after moving in with a high-earning partner, Services Australia may investigate your earning capacity under Reason 8B.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can my ex apply for a Change of Assessment based on my new partner\'s income?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Not directly. The Registrar must disregard your new partner\'s income. However, your ex can apply under Reason 8B if you deliberately reduced your own income or earning capacity after moving in with a high-earning partner. Most applications fail unless there\'s clear evidence of deliberate income reduction to avoid child support.',
            },
        },
        {
            '@type': 'Question',
            name: 'What if my new partner pays all the bills?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'If your new partner covers expenses AND you deliberately reduced your income or working hours as a result, your ex can apply under Reason 8B (earning capacity). The focus is on whether YOU made deliberate choices to reduce your earning capacity, not on your partner\'s income. Services Australia will assess if you\'re avoiding child support obligations.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'New Partner Income & Child Support Australia 2026 | Does It Affect You?',
    description: 'Remarried or living with a new partner? Learn how their income affects child support in Australia, when Change of Assessment applies, and how to protect your assessment.',
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

export default function NewPartnerIncomeChildSupportBlogPost() {
    const router = useRouter();
    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="New Partner Income & Child Support Australia 2026 | Does It Affect You?"
                description="New partner's income doesn't count—unless they pay all your bills. See when Change of Assessment applies + how to protect yourself. Know your rights."
                canonicalPath="/blog/new-partner-income-child-support"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'New Partner Income' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>New Relationships</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            New Partner Income & Child Support Australia 2026 | Does It Affect You?
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026 • Updated January 27, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        Remarried or living with a new partner? You're probably wondering: does their income affect
                        your child support? The short answer: not directly. But there are exceptions. Here's exactly
                        how new partner income works in Australian child support law, when it matters, and how to
                        protect yourself.
                    </Text>

                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            Your new partner's income doesn't directly affect child support calculations. However, if
                            they support your household, you may apply for Change of Assessment. Calculate your current
                            amount below.
                        </Text>
                        <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.quickAnswerButtonText}>Calculate Your Amount →</Text>
                        </Pressable>
                    </View>

                    <View style={styles.keyRuleBox}>
                        <Text style={styles.keyRuleTitle}>🔑 Key Rule:</Text>
                        <Text style={styles.keyRuleText}>
                            Your new partner's income is NOT included in the child support formula, and the Registrar
                            must legally disregard it. Only YOUR income and the other parent's income count. However,
                            if you deliberately reduce YOUR OWN income after moving in with a high-earning partner,
                            your ex can apply for a Change of Assessment under Reason 8B (earning capacity).
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Does my new partner's income affect child support in Australia?</Text>
                    <Text style={styles.paragraph}>
                        No. Your new partner's income is NOT included in the standard child support formula. Only YOUR income and the other parent's income count. However, there are important exceptions you need to know about.
                    </Text>

                    <Text style={styles.paragraph}>
                        The Australian child support formula uses only two incomes:
                    </Text>

                    <View style={styles.formulaCard}>
                        <Text style={styles.formulaTitle}>Standard Formula Inputs:</Text>
                        <Text style={styles.bulletItem}>• Your taxable income (paying parent)</Text>
                        <Text style={styles.bulletItem}>• Other parent's taxable income (receiving parent)</Text>
                        <Text style={styles.bulletItem}>• Number of children</Text>
                        <Text style={styles.bulletItem}>• Care percentage</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        Your new partner's income is excluded. This applies whether you're married, de facto, or just
                        living together. The formula doesn't care how much your new partner earns.
                    </Text>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Example:</Text>
                        <Text style={styles.exampleText}>Your income: $80,000</Text>
                        <Text style={styles.exampleText}>Ex-partner's income: $60,000</Text>
                        <Text style={styles.exampleText}>New partner's income: $150,000</Text>
                        <Text style={styles.exampleResult}>Child support calculated using: $80,000 + $60,000 = $140,000 combined</Text>
                        <Text style={styles.exampleNote}>New partner's $150,000 is ignored</Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">When Your Earning Capacity Can Be Questioned</Text>
                    <Text style={styles.paragraph}>
                        While new partner income isn't in the formula and must be legally disregarded, your ex can
                        challenge your child support if you deliberately reduce YOUR OWN income or earning capacity
                        after moving in with a high-earning partner. This is assessed under Reason 8B (earning capacity),
                        not based on your partner's income.
                    </Text>

                    <View style={styles.reasonCard}>
                        <Text style={styles.reasonTitle}>Change of Assessment Reason 8B:</Text>
                        <Text style={styles.reasonSubtitle}>"Earning Capacity"</Text>
                        <Text style={styles.reasonText}>
                            Your ex can apply if they believe you deliberately reduced your own income or earning
                            capacity to avoid child support. The Registrar must disregard your new partner's income
                            (section 117(7A)), but can assess whether YOU made deliberate choices to reduce your
                            earning capacity after moving in with a high-earning partner.
                        </Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Scenarios Where Earning Capacity May Be Assessed:</Text>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>1. Deliberately Reducing Income After Re-partnering</Text>
                        <Text style={styles.scenarioText}>
                            If you quit your job or reduce hours AFTER moving in with a high-earning partner, your ex
                            can argue you deliberately reduced your earning capacity to avoid child support obligations.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Example: You earned $100,000, then quit to work part-time ($40,000) after moving in with
                            a partner earning $200,000. Your ex argues this is deliberate income reduction under Reason 8B.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>2. Refusing Reasonable Employment Due to Partner's Support</Text>
                        <Text style={styles.scenarioText}>
                            If you refuse reasonable job offers or promotions because your partner supports you
                            financially, this may be assessed as deliberately limiting your earning capacity.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Example: You're qualified for $90,000 roles but only work part-time for $35,000 because
                            your partner covers expenses. Your ex argues you're not working to your earning capacity.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>3. Restructuring Work to Minimize Income</Text>
                        <Text style={styles.scenarioText}>
                            If you restructure your business or employment to minimize taxable income after re-partnering,
                            this may be investigated as deliberate income reduction.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Example: You previously earned $120,000 as a contractor. After moving in with your partner,
                            you restructure to pay yourself $50,000 and retain profits in a company. This may trigger
                            Reason 8A (income/financial resources) or 8B (earning capacity) assessment.
                        </Text>
                    </View>

                    <View style={styles.scenarioCard}>
                        <Text style={styles.scenarioTitle}>4. Timing of Income Reduction</Text>
                        <Text style={styles.scenarioText}>
                            The timing of income reduction relative to re-partnering is critical. If you reduce income
                            shortly after moving in with a high-earning partner, this raises questions about deliberate
                            avoidance of child support.
                        </Text>
                        <Text style={styles.scenarioExample}>
                            Example: You worked full-time for 5 years post-separation. Within 3 months of moving in with
                            a partner earning $180,000, you reduce to 2 days/week. The timing suggests deliberate reduction.
                        </Text>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Critical Legal Point:</Text>
                        <Text style={styles.warningText}>
                            The Registrar MUST disregard your new partner's income under section 117(7A) of the Child
                            Support Act. Your ex cannot increase your child support based on your partner's income.
                            However, they CAN challenge YOUR OWN earning capacity if you deliberately reduced income
                            after re-partnering. The focus is on YOUR choices, not your partner's income.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">How Services Australia Assesses Earning Capacity</Text>
                    <Text style={styles.paragraph}>
                        If your ex applies for a Change of Assessment under Reason 8B (earning capacity), Services
                        Australia will investigate whether you deliberately reduced your income to avoid child support.
                        Learn more about{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/object-to-child-support-assessment')}
                        >
                            how to object to assessments
                        </Text>
                        {' '}if you disagree with the outcome.
                    </Text>

                    <View style={styles.assessmentCard}>
                        <Text style={styles.assessmentTitle}>Evidence They Consider for Earning Capacity:</Text>
                        <Text style={styles.bulletItem}>• Your income history before and after re-partnering</Text>
                        <Text style={styles.bulletItem}>• Timing of income reduction relative to new relationship</Text>
                        <Text style={styles.bulletItem}>• Your qualifications, skills, and work experience</Text>
                        <Text style={styles.bulletItem}>• Job market opportunities in your field</Text>
                        <Text style={styles.bulletItem}>• Whether you refused reasonable employment</Text>
                        <Text style={styles.bulletItem}>• Legitimate reasons for reduced work (health, childcare, education)</Text>
                        <Text style={styles.bulletItem}>• Whether income reduction appears designed to avoid child support</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        Services Australia will determine whether you deliberately reduced YOUR OWN earning capacity
                        to avoid child support obligations. They cannot consider your partner's income directly, but
                        will assess whether your income reduction was legitimate or designed to avoid obligations.
                        This is assessed case-by-case.
                    </Text>

                    <Pressable
                        style={[styles.ctaButton, isWeb && webClickableStyles]}
                        onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=earning_capacity')}
                        accessibilityRole="button"
                    >
                        <Text style={styles.ctaButtonText}>Get Legal Advice on Earning Capacity Assessment →</Text>
                    </Pressable>

                    <View style={styles.internalLinkBox}>
                        <Text style={styles.internalLinkTitle}>📖 Related Reading:</Text>
                        <Text style={styles.internalLinkText}>
                            Learn more about{' '}
                            <Text
                                style={styles.inlineLink}
                                onPress={() => router.push('/blog/object-to-child-support-assessment')}
                            >
                                how to object to child support assessments
                            </Text>
                            {' '}if you disagree with a Change of Assessment decision. For complex situations, see our guide on{' '}
                            <Text
                                style={styles.inlineLink}
                                onPress={() => router.push('/blog/complicated-child-support-situations')}
                            >
                                complicated child support situations
                            </Text>.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">How to Protect Your Assessment</Text>

                    <View style={styles.protectionCard}>
                        <Text style={styles.protectionNumber}>1</Text>
                        <View style={styles.protectionContent}>
                            <Text style={styles.protectionTitle}>Keep Finances Separate</Text>
                            <Text style={styles.protectionText}>
                                Maintain separate bank accounts. Pay your share of household expenses from your account.
                                Avoid joint accounts or having your partner pay all bills.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.protectionCard}>
                        <Text style={styles.protectionNumber}>2</Text>
                        <View style={styles.protectionContent}>
                            <Text style={styles.protectionTitle}>Document Your Contributions</Text>
                            <Text style={styles.protectionText}>
                                Keep records showing you pay rent, utilities, groceries, and other expenses. If your
                                ex claims your partner supports you, you'll have evidence to refute it.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.protectionCard}>
                        <Text style={styles.protectionNumber}>3</Text>
                        <View style={styles.protectionContent}>
                            <Text style={styles.protectionTitle}>Don't Reduce Income Without Reason</Text>
                            <Text style={styles.protectionText}>
                                If you quit your job or reduce hours after moving in with a new partner, Services
                                Australia may assume you're avoiding child support. Only reduce income for legitimate
                                reasons (health, education, childcare).
                            </Text>
                        </View>
                    </View>

                    <View style={styles.protectionCard}>
                        <Text style={styles.protectionNumber}>4</Text>
                        <View style={styles.protectionContent}>
                            <Text style={styles.protectionTitle}>Be Transparent</Text>
                            <Text style={styles.protectionText}>
                                If Services Australia asks about your living arrangements, answer honestly. Lying or
                                hiding information makes you look like you're avoiding obligations.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.protectionCard}>
                        <Text style={styles.protectionNumber}>5</Text>
                        <View style={styles.protectionContent}>
                            <Text style={styles.protectionTitle}>Get Legal Advice Early</Text>
                            <Text style={styles.protectionText}>
                                If your ex threatens a Change of Assessment based on your new partner's income, get
                                legal advice immediately. A lawyer can help you respond and protect your assessment.
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">What If You're the Receiving Parent?</Text>
                    <Text style={styles.paragraph}>
                        If your ex has a new high-earning partner and you believe they deliberately reduced their income
                        to avoid child support, you can apply for a Change of Assessment under Reason 8B (earning capacity).
                        Here's how:
                    </Text>

                    <View style={styles.receivingCard}>
                        <Text style={styles.receivingTitle}>Steps to Apply:</Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>1. Gather evidence:</Text> Your ex's income history before and
                            after re-partnering, employment records, job advertisements in their field, evidence of
                            refused opportunities
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>2. Complete application:</Text> Use Reason 8B (Earning Capacity) -
                            NOT Reason 8A, as the Registrar must disregard the new partner's income
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>3. Prove deliberate reduction:</Text> Show timing of income drop
                            relative to new relationship, demonstrate your ex's qualifications and market opportunities
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>4. Be specific:</Text> Vague claims fail. Provide dates of
                            re-partnering, income reduction timeline, job market data, and evidence of deliberate choices
                        </Text>
                    </View>

                    <View style={styles.dangerBox}>
                        <Text style={styles.dangerTitle}>🚨 Reality Check:</Text>
                        <Text style={styles.dangerText}>
                            Most applications fail. Services Australia sets a high bar. Simply living with a high
                            earner isn't enough—you must prove DELIBERATE income reduction by your ex to avoid child
                            support. The new partner's income itself cannot be considered. Get legal advice before applying.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <FAQItem
                        question="Does my new partner's income affect child support in Australia?"
                        answer="No. Your new partner's income is NOT included in the standard child support formula, and the Registrar must legally disregard it under section 117(7A). Only your income and the other parent's income matter. However, if you deliberately reduce your own income after moving in with a high-earning partner, Services Australia may investigate your earning capacity under Reason 8B."
                    />

                    <FAQItem
                        question="Can my ex apply for a Change of Assessment based on my new partner's income?"
                        answer="Not directly. The Registrar must disregard your new partner's income under section 117(7A). However, your ex can apply under Reason 8B (earning capacity) if you deliberately reduced your own income or earning capacity after moving in with a high-earning partner. Most applications fail unless there's clear evidence of deliberate income reduction to avoid child support."
                    />

                    <FAQItem
                        question="What if my new partner pays all the bills?"
                        answer="If your new partner covers expenses AND you deliberately reduced your income or working hours as a result, your ex can apply under Reason 8B (earning capacity). The focus is on whether YOU made deliberate choices to reduce your earning capacity, not on your partner's income. Services Australia will assess if you're avoiding child support obligations through deliberate income reduction."
                    />

                    <FAQItem
                        question="Can I reduce my income if my new partner supports me?"
                        answer="You can reduce your income, but if it appears deliberate to avoid child support, Services Australia may assess your earning capacity under Reason 8B. If you quit your job or reduce hours shortly after moving in with a high-earning partner without legitimate reasons (health, education, childcare), your ex can argue you're deliberately avoiding obligations. The Registrar may set your income based on your earning capacity, not actual income."
                    />

                    <FAQItem
                        question="What if my ex's new partner is wealthy?"
                        answer="The new partner's wealth cannot directly increase child support—the Registrar must disregard it. However, you can apply under Reason 8B if your ex deliberately reduced their income after moving in with the wealthy partner. You need evidence of deliberate income reduction (timing, employment history, refused opportunities). Most applications fail without proof of deliberate avoidance of child support obligations."
                    />

                    <View style={styles.calculatorSection}>
                        <Text style={styles.calculatorTitle}>Calculate Your Child Support</Text>
                        <Text style={styles.calculatorText}>
                            Use our free calculator to see your current assessment based on YOUR income only. New
                            partner income is not included in the standard formula.
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
                        <Text style={styles.finalCtaTitle}>Facing a Change of Assessment?</Text>
                        <Text style={styles.finalCtaText}>
                            Connect with experienced family lawyers who can help you respond to Change of Assessment
                            applications or apply for one yourself. Most offer free initial consultations with no
                            obligation to proceed.
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

    quickAnswerBox: { backgroundColor: '#2563eb', borderRadius: 12, padding: 20, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    quickAnswerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
    quickAnswerText: { fontSize: 15, lineHeight: 24, color: '#ffffff', marginBottom: 16, textAlign: 'center' },
    quickAnswerButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
    quickAnswerButtonText: { color: '#2563eb', fontSize: 16, fontWeight: '700' },

    bulletItem: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8, paddingLeft: 8 },
    bold: { fontWeight: '600', color: '#1e3a8a' },

    keyRuleBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderWidth: 2, borderColor: '#3b82f6', padding: 20, marginBottom: 24, ...createShadow({ shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }) },
    keyRuleTitle: { fontSize: 18, fontWeight: '700', color: '#1e40af', marginBottom: 8 },
    keyRuleText: { fontSize: 15, lineHeight: 24, color: '#1e40af' },

    formulaCard: { backgroundColor: '#f0f9ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bae6fd' },
    formulaTitle: { fontSize: 16, fontWeight: '700', color: '#0c4a6e', marginBottom: 12 },

    exampleCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#2563eb', borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    exampleTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    exampleText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 4 },
    exampleResult: { fontSize: 15, lineHeight: 24, color: '#1e3a8a', fontWeight: '600', marginTop: 8 },
    exampleNote: { fontSize: 14, lineHeight: 22, color: '#64748b', fontStyle: 'italic', marginTop: 4 },

    reasonCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    reasonTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 4 },
    reasonSubtitle: { fontSize: 14, color: '#3b82f6', fontStyle: 'italic', marginBottom: 8 },
    reasonText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    scenarioCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    scenarioTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    scenarioText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8 },
    scenarioExample: { fontSize: 14, lineHeight: 22, color: '#64748b', fontStyle: 'italic', paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },

    warningBox: { backgroundColor: '#ffffff', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#f59e0b', padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    warningTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    assessmentCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    assessmentTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 12 },

    protectionCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    protectionNumber: { fontSize: 24, fontWeight: '700', color: '#2563EB', marginRight: 16, width: 32 },
    protectionContent: { flex: 1 },
    protectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    protectionText: { fontSize: 15, lineHeight: 24, color: '#475569' },

    receivingCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    receivingTitle: { fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 12 },

    dangerBox: { backgroundColor: '#ffffff', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#dc2626', padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }) },
    dangerTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    dangerText: { fontSize: 15, lineHeight: 24, color: '#475569' },

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
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 16, fontWeight: '600' },
    inlineLink: { color: '#2563EB', fontWeight: '600', textDecorationLine: 'underline' },
    internalLinkBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#bfdbfe' },
    internalLinkTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    internalLinkText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 16 },
});
