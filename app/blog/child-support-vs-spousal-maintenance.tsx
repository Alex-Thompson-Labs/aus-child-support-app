import { ContextualWizard } from '@/src/components/blog/ContextualWizard';
import { PageSEO } from '@/src/components/seo/PageSEO';
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
            name: 'What is the difference between child support and spousal maintenance?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Child support is mandatory, formula-based, and paid for children under 18 through Services Australia. Spousal maintenance is discretionary, court-ordered, and paid to an ex-partner who cannot support themselves. Child support is automatic; spousal maintenance requires a court application proving financial need.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I pay both child support and spousal maintenance?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, you can pay both simultaneously. They are separate legal obligations under different Acts. Child support is assessed under the Child Support (Assessment) Act 1989, while spousal maintenance is ordered under the Family Law Act 1975. Paying spousal maintenance does not reduce your child support obligation.',
            },
        },
        {
            '@type': 'Question',
            name: 'Is spousal maintenance the same as alimony?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, spousal maintenance is the Australian legal term for what is called alimony in other countries like the United States. Australia does not use the term "alimony" in legislation—it is referred to as spousal maintenance under the Family Law Act 1975.',
            },
        },
        {
            '@type': 'Question',
            name: 'How long does spousal maintenance last?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Spousal maintenance duration is determined by the court and varies by case. It can be temporary (until the recipient becomes self-supporting), for a fixed period, or in rare cases, indefinite. It typically ends if the recipient remarries or enters a de facto relationship, or if circumstances change significantly.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Child Support vs Spousal Maintenance Australia: Key Differences',
    description: 'Child support is mandatory and formula-based. Spousal maintenance is discretionary and court-ordered. Learn the key differences, how they work together, and when each applies.',
    datePublished: '2026-01-28',
    dateModified: '2026-01-28',
    author: {
        '@type': 'Organization',
        name: 'AusChildSupport',
    },
};

export default function ChildSupportVsSpousalMaintenanceBlogPost() {
    const router = useRouter();
    const styles = createBlogStyles();
    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    // Custom styles for this post
    const customStyles = {
        quickAnswerButton: {
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.4)',
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 24,
            marginTop: 16,
        },
        quickAnswerButtonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600' as const,
            textAlign: 'center' as const,
        },
        comparisonTable: {
            backgroundColor: '#ffffff',
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
        },
        tableRow: {
            flexDirection: 'row' as const,
            borderBottomWidth: 1,
            borderBottomColor: '#e2e8f0',
            paddingVertical: 12,
        },
        tableHeaderCell: {
            flex: 1,
            fontSize: 14,
            fontWeight: '700' as const,
            color: '#1e293b',
        },
        tableCellBold: {
            flex: 1,
            fontSize: 14,
            fontWeight: '600' as const,
            color: '#475569',
        },
        tableCell: {
            flex: 1,
            fontSize: 14,
            color: '#64748b',
        },
        highlightBox: {
            backgroundColor: '#eff6ff',
            borderLeftWidth: 4,
            borderLeftColor: '#3b82f6',
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
        },
        highlightTitle: {
            fontSize: 16,
            fontWeight: '600' as const,
            color: '#1e40af',
            marginBottom: 12,
        },
        processCard: {
            backgroundColor: '#f8fafc',
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
        },
        processTitle: {
            fontSize: 16,
            fontWeight: '600' as const,
            color: '#1e293b',
            marginBottom: 12,
        },
        mythCard: {
            backgroundColor: '#fef2f2',
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
        },
        mythTitle: {
            fontSize: 16,
            fontWeight: '600' as const,
            color: '#991b1b',
            marginBottom: 8,
        },
        ctaTitle: {
            fontSize: 24,
            fontWeight: '700' as const,
            color: '#1e293b',
            marginBottom: 12,
            textAlign: 'center' as const,
        },
        ctaText: {
            fontSize: 16,
            color: '#64748b',
            marginBottom: 20,
            textAlign: 'center' as const,
        },
        relatedArticles: {
            marginTop: 48,
            padding: 20,
            backgroundColor: '#f8fafc',
            borderRadius: 8,
        },
        relatedTitle: {
            fontSize: 20,
            fontWeight: '600' as const,
            color: '#1e293b',
            marginBottom: 16,
        },
        relatedLink: {
            paddingVertical: 12,
        },
        relatedLinkText: {
            fontSize: 16,
            color: '#2563eb',
            fontWeight: '500' as const,
        },
    };

    return (
        <>
            <PageSEO
                title="Child Support vs Spousal Maintenance Australia 2026"
                description="Child support is mandatory and formula-based. Spousal maintenance is discretionary and court-ordered. Learn key differences and when each applies to your case."
                canonicalPath="/blog/child-support-vs-spousal-maintenance"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Child Support vs Spousal Maintenance' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    {/* Article Header */}
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Understanding Family Law</Text>
                        <Text style={styles.h1} accessibilityRole="header">Child Support vs Spousal Maintenance: What's the Difference?</Text>
                        <Text style={styles.publishDate}>Published January 28, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        After separation, many parents are confused about the difference between child support and spousal maintenance. 
                        Are they the same thing? Can you pay both? Who decides how much?
                    </Text>

                    <Text style={styles.paragraph}>
                        The short answer: they're completely different legal obligations, governed by different laws, with different 
                        eligibility criteria and payment structures.
                    </Text>

                    {/* Featured Snippet Target */}
                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            Child support and spousal maintenance are separate in Australia. Child support is mandatory, formula-based, 
                            and paid for children under 18 through Services Australia. Spousal maintenance is discretionary, court-ordered, 
                            and paid to an ex-partner who cannot support themselves. You can pay both simultaneously. Child support is 
                            automatic; spousal maintenance requires a court application proving financial need.
                        </Text>
                        <Pressable style={[customStyles.quickAnswerButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={customStyles.quickAnswerButtonText}>Calculate Child Support →</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.paragraph}>
                        Let's break down the key differences, how they work together, and what you need to know about each.
                    </Text>

                    {/* Comparison Table */}
                    <Text style={styles.h2} accessibilityRole="header">Side-by-Side Comparison</Text>

                    <View style={customStyles.comparisonTable}>
                        <View style={customStyles.tableRow}>
                            <Text style={customStyles.tableHeaderCell}>Feature</Text>
                            <Text style={customStyles.tableHeaderCell}>Child Support</Text>
                            <Text style={customStyles.tableHeaderCell}>Spousal Maintenance</Text>
                        </View>
                        <View style={customStyles.tableRow}>
                            <Text style={customStyles.tableCellBold}>Who receives it?</Text>
                            <Text style={customStyles.tableCell}>Parent caring for children</Text>
                            <Text style={customStyles.tableCell}>Ex-spouse or ex-partner</Text>
                        </View>
                        <View style={customStyles.tableRow}>
                            <Text style={customStyles.tableCellBold}>Is it mandatory?</Text>
                            <Text style={customStyles.tableCell}>Yes (automatic)</Text>
                            <Text style={customStyles.tableCell}>No (must apply to court)</Text>
                        </View>
                        <View style={customStyles.tableRow}>
                            <Text style={customStyles.tableCellBold}>How is it calculated?</Text>
                            <Text style={customStyles.tableCell}>8-step formula (Services Australia)</Text>
                            <Text style={customStyles.tableCell}>Court discretion (case-by-case)</Text>
                        </View>
                        <View style={customStyles.tableRow}>
                            <Text style={customStyles.tableCellBold}>Governing law</Text>
                            <Text style={customStyles.tableCell}>Child Support (Assessment) Act 1989</Text>
                            <Text style={customStyles.tableCell}>Family Law Act 1975</Text>
                        </View>
                        <View style={customStyles.tableRow}>
                            <Text style={customStyles.tableCellBold}>Who administers it?</Text>
                            <Text style={customStyles.tableCell}>Services Australia</Text>
                            <Text style={customStyles.tableCell}>Family Court / Federal Circuit Court</Text>
                        </View>
                        <View style={customStyles.tableRow}>
                            <Text style={customStyles.tableCellBold}>Duration</Text>
                            <Text style={customStyles.tableCell}>Until child turns 18 (or end of Year 12)</Text>
                            <Text style={customStyles.tableCell}>Varies (temporary, fixed, or indefinite)</Text>
                        </View>
                        <View style={customStyles.tableRow}>
                            <Text style={customStyles.tableCellBold}>Can you pay both?</Text>
                            <Text style={customStyles.tableCell}>Yes</Text>
                            <Text style={customStyles.tableCell}>Yes</Text>
                        </View>
                    </View>

                    {/* What is Child Support */}
                    <Text style={styles.h2} accessibilityRole="header">What is Child Support?</Text>
                    <Text style={styles.paragraph}>
                        Child support is a <Text style={styles.bold}>mandatory financial contribution</Text> from one parent to the other 
                        to help cover the costs of raising children after separation.
                    </Text>

                    <View style={customStyles.highlightBox}>
                        <Text style={customStyles.highlightTitle}>Key Features of Child Support:</Text>
                        <Text style={styles.bulletItem}>• <Text style={styles.bold}>Automatic:</Text> No court application needed—Services Australia calculates it based on a formula</Text>
                        <Text style={styles.bulletItem}>• <Text style={styles.bold}>Formula-based:</Text> Uses the 8-step formula considering both parents' incomes and care arrangements</Text>
                        <Text style={styles.bulletItem}>• <Text style={styles.bold}>For children:</Text> Covers costs of raising children under 18 (or in Year 12)</Text>
                        <Text style={styles.bulletItem}>• <Text style={styles.bold}>Enforceable:</Text> Services Australia can garnish wages, intercept tax refunds, and issue travel bans</Text>
                        <Text style={styles.bulletItem}>• <Text style={styles.bold}>Governed by:</Text> Child Support (Assessment) Act 1989</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        Child support is calculated using your Adjusted Taxable Income (ATI), care percentage, and the number and ages 
                        of children. The formula is standardized—everyone with the same circumstances pays the same amount.
                    </Text>

                    <Pressable style={[styles.ctaButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                        <Text style={styles.ctaButtonText}>Calculate Your Child Support Amount →</Text>
                    </Pressable>

                    {/* Internal Links: Related Content */}
                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>📖 Understanding Child Support</Text>
                        <Text style={styles.infoText}>
                            Learn more about how child support works in Australia:
                        </Text>
                        <Pressable style={[styles.infoButton, isWeb && webClickableStyles]} onPress={() => router.push('/blog/child-support-formula-australia')} accessibilityRole="button">
                            <Text style={styles.infoButtonText}>How the Formula Works →</Text>
                        </Pressable>
                        <Pressable style={[styles.infoButton, isWeb && webClickableStyles, { marginTop: 8 }]} onPress={() => router.push('/blog/what-does-child-support-cover')} accessibilityRole="button">
                            <Text style={styles.infoButtonText}>What Child Support Covers →</Text>
                        </Pressable>
                    </View>

                    {/* What is Spousal Maintenance */}
                    <Text style={styles.h2} accessibilityRole="header">What is Spousal Maintenance?</Text>
                    <Text style={styles.paragraph}>
                        Spousal maintenance (sometimes called "alimony" in other countries) is a <Text style={styles.bold}>court-ordered 
                        payment</Text> from one ex-partner to the other to help them meet reasonable living expenses when they cannot 
                        support themselves.
                    </Text>

                    <View style={customStyles.highlightBox}>
                        <Text style={customStyles.highlightTitle}>Key Features of Spousal Maintenance:</Text>
                        <Text style={styles.bulletItem}>• <Text style={styles.bold}>Discretionary:</Text> Not automatic—you must apply to the Family Court</Text>
                        <Text style={styles.bulletItem}>• <Text style={styles.bold}>Case-by-case:</Text> Court decides based on individual circumstances, not a formula</Text>
                        <Text style={styles.bulletItem}>• <Text style={styles.bold}>For ex-partners:</Text> Paid to former spouse or de facto partner, not children</Text>
                        <Text style={styles.bulletItem}>• <Text style={styles.bold}>Needs-based:</Text> Recipient must prove they cannot reasonably support themselves</Text>
                        <Text style={styles.bulletItem}>• <Text style={styles.bold}>Governed by:</Text> Family Law Act 1975 (Part VIII)</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        Unlike child support, there is no automatic entitlement to spousal maintenance. The court considers factors like:
                    </Text>

                    <Text style={styles.bulletItem}>• The recipient's ability to support themselves (age, health, skills, employment prospects)</Text>
                    <Text style={styles.bulletItem}>• The payer's capacity to pay (income, assets, financial obligations)</Text>
                    <Text style={styles.bulletItem}>• The standard of living during the relationship</Text>
                    <Text style={styles.bulletItem}>• Care responsibilities for children</Text>
                    <Text style={styles.bulletItem}>• Duration of the relationship</Text>

                    {/* When Does Each Apply */}
                    <Text style={styles.h2} accessibilityRole="header">When Does Each Apply?</Text>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Child Support Applies When:</Text>
                        <Text style={styles.bulletItem}>✅ You have children under 18 (or in Year 12)</Text>
                        <Text style={styles.bulletItem}>✅ You and the other parent are separated</Text>
                        <Text style={styles.bulletItem}>✅ The child is not living with both parents equally (or if equal, there's an income difference)</Text>
                        <Text style={[styles.paragraph, { marginTop: 12 }]}>
                            <Text style={styles.bold}>Result:</Text> Services Australia automatically calculates an amount. 
                            You don't need to apply—it happens when either parent contacts Services Australia.
                        </Text>
                    </View>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Spousal Maintenance Applies When:</Text>
                        <Text style={styles.bulletItem}>✅ You were married or in a de facto relationship</Text>
                        <Text style={styles.bulletItem}>✅ You are now separated</Text>
                        <Text style={styles.bulletItem}>✅ One partner cannot reasonably support themselves</Text>
                        <Text style={styles.bulletItem}>✅ The other partner has the capacity to pay</Text>
                        <Text style={[styles.paragraph, { marginTop: 12 }]}>
                            <Text style={styles.bold}>Result:</Text> You must apply to the Family Court or Federal Circuit Court. 
                            The court decides if spousal maintenance is appropriate and, if so, how much and for how long.
                        </Text>
                    </View>

                    {/* Can You Pay Both */}
                    <Text style={styles.h2} accessibilityRole="header">Can You Pay Both Child Support and Spousal Maintenance?</Text>
                    <Text style={styles.paragraph}>
                        Yes. They are separate legal obligations and can exist simultaneously.
                    </Text>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Important:</Text>
                        <Text style={styles.paragraph}>
                            Paying spousal maintenance does NOT reduce your child support obligation. Child support is calculated 
                            independently using the Services Australia formula. However, if you're paying court-ordered spousal 
                            maintenance, you may be able to claim it as a relevant dependent for child support purposes in some cases.
                        </Text>
                    </View>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Example: Paying Both</Text>
                        <Text style={styles.paragraph}>
                            James earns $120,000/year. He has two children (ages 8 and 10) who live primarily with his ex-wife Sarah. 
                            Sarah has been out of the workforce for 10 years and cannot immediately support herself.
                        </Text>
                        <Text style={[styles.paragraph, { marginTop: 8 }]}>
                            <Text style={styles.bold}>Child support:</Text> Services Australia assesses James at $18,500/year based 
                            on the formula (income, care arrangement, children's ages).
                        </Text>
                        <Text style={[styles.paragraph, { marginTop: 8 }]}>
                            <Text style={styles.bold}>Spousal maintenance:</Text> Sarah applies to the Family Court. The court orders 
                            James to pay $800/month ($9,600/year) for 2 years while Sarah retrains and finds employment.
                        </Text>
                        <Text style={[styles.paragraph, { marginTop: 8 }]}>
                            <Text style={styles.bold}>Total:</Text> James pays $28,100/year ($18,500 child support + $9,600 spousal maintenance).
                        </Text>
                    </View>

                    {/* How to Apply */}
                    <Text style={styles.h2} accessibilityRole="header">How to Apply for Each</Text>

                    <View style={customStyles.processCard}>
                        <Text style={customStyles.processTitle}>Applying for Child Support:</Text>
                        <Text style={styles.bulletItem}>1. Contact Services Australia (online, phone, or in person)</Text>
                        <Text style={styles.bulletItem}>2. Provide your income details and care arrangement</Text>
                        <Text style={styles.bulletItem}>3. Services Australia calculates the amount using the formula</Text>
                        <Text style={styles.bulletItem}>4. You receive an assessment notice with the annual and daily rate</Text>
                        <Text style={styles.bulletItem}>5. Payments begin (either private collect or Services Australia collect)</Text>
                        <Text style={[styles.paragraph, { marginTop: 12 }]}>
                            <Text style={styles.bold}>Cost:</Text> Free. No court application needed.
                        </Text>
                    </View>

                    <View style={customStyles.processCard}>
                        <Text style={customStyles.processTitle}>Applying for Spousal Maintenance:</Text>
                        <Text style={styles.bulletItem}>1. Attempt to negotiate with your ex-partner (optional but recommended)</Text>
                        <Text style={styles.bulletItem}>2. File an application with the Family Court or Federal Circuit Court</Text>
                        <Text style={styles.bulletItem}>3. Provide evidence of your financial need and their capacity to pay</Text>
                        <Text style={styles.bulletItem}>4. Attend court hearings (may require multiple appearances)</Text>
                        <Text style={styles.bulletItem}>5. Court makes an order (or dismisses the application)</Text>
                        <Text style={[styles.paragraph, { marginTop: 12 }]}>
                            <Text style={styles.bold}>Cost:</Text> Court filing fees + legal representation (typically $5,000-$20,000+).
                        </Text>
                    </View>

                    {/* Common Misconceptions */}
                    <Text style={styles.h2} accessibilityRole="header">Common Misconceptions</Text>

                    <View style={customStyles.mythCard}>
                        <Text style={customStyles.mythTitle}>❌ Myth: "Child support includes spousal maintenance"</Text>
                        <Text style={styles.paragraph}>
                            <Text style={styles.bold}>Reality:</Text> Child support is only for children. It does not include any 
                            financial support for the other parent. If you need financial support for yourself, you must apply for 
                            spousal maintenance separately.
                        </Text>
                    </View>

                    <View style={customStyles.mythCard}>
                        <Text style={customStyles.mythTitle}>❌ Myth: "I automatically get spousal maintenance if I earn less"</Text>
                        <Text style={styles.paragraph}>
                            <Text style={styles.bold}>Reality:</Text> Spousal maintenance is not automatic. You must apply to the 
                            court and prove you cannot reasonably support yourself. Earning less than your ex-partner is not enough—you 
                            must show genuine financial need.
                        </Text>
                    </View>

                    <View style={customStyles.mythCard}>
                        <Text style={customStyles.mythTitle}>❌ Myth: "Spousal maintenance lasts forever"</Text>
                        <Text style={styles.paragraph}>
                            <Text style={styles.bold}>Reality:</Text> Most spousal maintenance orders are temporary or for a fixed 
                            period (e.g., 2-5 years). The goal is to help the recipient become self-supporting, not provide permanent 
                            income. It typically ends if the recipient remarries or enters a new de facto relationship.
                        </Text>
                    </View>

                    <View style={customStyles.mythCard}>
                        <Text style={customStyles.mythTitle}>❌ Myth: "Paying spousal maintenance reduces child support"</Text>
                        <Text style={styles.paragraph}>
                            <Text style={styles.bold}>Reality:</Text> Child support is calculated independently using the Services 
                            Australia formula. Spousal maintenance payments do not automatically reduce your child support obligation. 
                            However, in some cases, you may be able to claim the recipient as a relevant dependent.
                        </Text>
                    </View>

                    {/* When to Get Legal Advice */}
                    <Text style={styles.h2} accessibilityRole="header">When to Get Legal Advice</Text>
                    <Text style={styles.paragraph}>
                        Child support is straightforward—use our calculator to estimate your amount. But spousal maintenance is complex 
                        and requires legal expertise.
                    </Text>

                    <View style={styles.dangerCard}>
                        <Text style={styles.dangerCardTitle}>Get Legal Advice If:</Text>
                        <Text style={styles.bulletItem}>• You believe you're entitled to spousal maintenance</Text>
                        <Text style={styles.bulletItem}>• Your ex-partner is seeking spousal maintenance from you</Text>
                        <Text style={styles.bulletItem}>• You're paying both child support and spousal maintenance and struggling financially</Text>
                        <Text style={styles.bulletItem}>• Your circumstances have changed significantly (job loss, illness, remarriage)</Text>
                        <Text style={styles.bulletItem}>• You're considering a property settlement and want to understand how it affects maintenance</Text>
                    </View>

                    {/* Contextual Wizard for Spousal Maintenance Cases */}
                    <ContextualWizard
                        preselectedFactors={['property_settlement']}
                        highlightedFactors={['change_circumstances', 'high_costs']}
                        blogTopic="spousal_maintenance"
                        ctaText="Get Advice on Spousal Maintenance"
                        analyticsSource="blog_child_support_vs_spousal_maintenance"
                        formReason="special_circumstances"
                        title="Dealing with Both Child Support and Spousal Maintenance?"
                        description="If you're paying or receiving both, or considering applying for spousal maintenance, professional advice is essential. Select any factors that apply."
                    />

                    {/* Trust Signals */}
                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>💡 What to Expect from a Consultation</Text>
                        <Text style={styles.infoText}>
                            • Discuss whether you qualify for spousal maintenance (or have grounds to oppose it)
                            {'\n'}• Understand how property settlement affects maintenance obligations
                            {'\n'}• Learn about the court application process and likely outcomes
                            {'\n'}• Get cost estimates for legal representation (typically $5,000-$20,000)
                            {'\n'}• Most lawyers offer free initial consultations (15-30 minutes)
                        </Text>
                    </View>

                    {/* FAQ Section */}
                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>Is spousal maintenance the same as alimony?</Text>
                        <Text style={styles.paragraph}>
                            Yes, spousal maintenance is the Australian legal term for what is called alimony in other countries like 
                            the United States. Australia does not use the term "alimony" in legislation—it is referred to as spousal 
                            maintenance under the Family Law Act 1975.
                        </Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>How long does spousal maintenance last?</Text>
                        <Text style={styles.paragraph}>
                            Spousal maintenance duration is determined by the court and varies by case. It can be temporary (until the 
                            recipient becomes self-supporting), for a fixed period (e.g., 2-5 years), or in rare cases, indefinite. 
                            It typically ends if the recipient remarries or enters a de facto relationship, or if circumstances change 
                            significantly.
                        </Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>Can I get spousal maintenance if we were never married?</Text>
                        <Text style={styles.paragraph}>
                            Yes, if you were in a de facto relationship. The Family Law Act 1975 covers both married couples and 
                            de facto couples (including same-sex couples). You must have been in a de facto relationship for at least 
                            2 years, or have a child together, or made substantial contributions to the relationship.
                        </Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>Does a property settlement affect spousal maintenance?</Text>
                        <Text style={styles.paragraph}>
                            Yes. If you receive a significant property settlement, the court may decide you don't need spousal 
                            maintenance (or need less). Conversely, if you receive little or no property, you may have a stronger 
                            case for spousal maintenance. The court considers your overall financial position, including property, 
                            superannuation, and income.
                        </Text>
                    </View>

                    {/* Final CTA */}
                    <View style={styles.finalCtaSection}>
                        <Text style={customStyles.ctaTitle}>Calculate Your Child Support</Text>
                        <Text style={customStyles.ctaText}>
                            Get an instant estimate using the official 2026 Services Australia formula. Takes 5 minutes. 
                            Free, no registration required.
                        </Text>
                        <Pressable style={[styles.primaryButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.primaryButtonText}>Use Free Calculator</Text>
                        </Pressable>
                    </View>

                    {/* Related Articles */}
                    <View style={customStyles.relatedArticles}>
                        <Text style={customStyles.relatedTitle}>Related Articles</Text>
                        <Pressable style={[customStyles.relatedLink, isWeb && webClickableStyles]} onPress={() => router.push('/blog/child-support-formula-australia')} accessibilityRole="button">
                            <Text style={customStyles.relatedLinkText}>→ How the Child Support Formula Works</Text>
                        </Pressable>
                        <Pressable style={[customStyles.relatedLink, isWeb && webClickableStyles]} onPress={() => router.push('/blog/how-to-calculate-child-support')} accessibilityRole="button">
                            <Text style={customStyles.relatedLinkText}>→ How to Calculate Child Support</Text>
                        </Pressable>
                        <Pressable style={[customStyles.relatedLink, isWeb && webClickableStyles]} onPress={() => router.push('/blog/child-support-reduction-strategies')} accessibilityRole="button">
                            <Text style={customStyles.relatedLinkText}>→ How to Reduce Child Support Payments</Text>
                        </Pressable>
                        <Pressable style={[customStyles.relatedLink, isWeb && webClickableStyles]} onPress={() => router.push('/blog/when-to-hire-family-lawyer')} accessibilityRole="button">
                            <Text style={customStyles.relatedLinkText}>→ When to Hire a Family Lawyer</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}
