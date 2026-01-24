import { PageSEO } from '@/src/components/seo/PageSEO';
import { CalculatorHeader } from '@/src/features/calculator';
import { MAX_CALCULATOR_WIDTH, isWeb, webClickableStyles } from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// FAQ Schema
const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'When should I hire a lawyer for child support?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Hire a lawyer if you have self-employment income, trusts or companies, overseas income, high-value assets, multiple relationships with children, court orders that override the formula, Change of Assessment applications, or disputes about income or care. Complex cases have high financial stakes and legal risks that justify professional help.',
            },
        },
        {
            '@type': 'Question',
            name: 'How much does a child support lawyer cost in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Family lawyers typically charge $300-$600 per hour for child support matters. Initial consultations are often free or discounted. Many lawyers offer fixed-fee packages for specific services like Change of Assessment applications ($2,000-$5,000) or objections ($1,500-$3,000). The cost depends on complexity and whether the matter goes to court.',
            },
        },
        {
            '@type': 'Question',
            name: 'What makes child support complicated?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Child support becomes complicated when income is hard to verify (self-employment, trusts, overseas), when there are multiple relationships with children, when court orders exist, when one parent hides assets, when care arrangements are disputed, or when special circumstances apply. These situations require legal expertise to navigate correctly.',
            },
        },
    ],
};

// Article schema
const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Complicated Child Support in Australia: 8 Situations That Need Legal Advice',
    description: 'Self-employed? Trusts? Overseas income? Learn when child support gets too complicated for DIY and why legal advice protects your financial interests.',
    datePublished: '2026-01-24',
    dateModified: '2026-01-24',
    author: {
        '@type': 'Organization',
        name: 'AusChildSupport',
    },
};

export default function ComplicatedChildSupportBlogPost() {
    const router = useRouter();

    const webContainerStyle = isWeb
        ? {
            maxWidth: MAX_CALCULATOR_WIDTH,
            width: '100%' as const,
            alignSelf: 'center' as const,
        }
        : {};

    return (
        <>
            <PageSEO
                title="Complicated Child Support in Australia: 8 Situations That Need Legal Advice"
                description="Self-employed? Trusts? Overseas income? Learn when child support gets too complicated for DIY and why legal advice protects your financial interests."
                canonicalPath="/blog/complicated-child-support-situations"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Complicated Situations' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <CalculatorHeader 
                    title="Blog" 
                    showBackButton={true} 
                    maxWidth={MAX_CALCULATOR_WIDTH} 
                />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, webContainerStyle]}
                >
                    {/* Article Header */}
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Legal Advice</Text>
                        <Text 
                            style={styles.h1}
                            accessibilityRole="header"
                            // @ts-ignore
                            aria-level="1"
                        >
                            Complicated Child Support in Australia: 8 Situations That Need Legal Advice
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    {/* Introduction */}
                    <Text style={styles.intro}>
                        Most child support cases are straightforward. Two parents, regular wages, clear care arrangement. 
                        The formula works. The calculator gives you an accurate estimate.
                    </Text>

                    <Text style={styles.paragraph}>
                        But some situations are complicated. Self-employment income. Family trusts. Overseas assets. 
                        Multiple relationships. Court orders. In these cases, the standard formula doesn't capture 
                        the full picture—and mistakes can cost you thousands of dollars per year.
                    </Text>

                    <Text style={styles.paragraph}>
                        This guide explains eight situations where child support becomes too complicated for DIY, 
                        why legal advice protects your financial interests, and how to find the right lawyer for 
                        your case.
                    </Text>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ High Stakes:</Text>
                        <Text style={styles.warningText}>
                            Complex child support cases often involve $5,000-$20,000+ per year in payments. A lawyer's 
                            fee of $2,000-$5,000 can save you tens of thousands over the life of the assessment.
                        </Text>
                    </View>

                    {/* Situation 1 */}
                    <Text 
                        style={styles.h2}
                        accessibilityRole="header"
                        // @ts-ignore
                        aria-level="2"
                    >
                        Situation 1: Self-Employment or Business Income
                    </Text>

                    <View style={styles.situationCard}>
                        <Text style={styles.situationIcon}>💼</Text>
                        <View style={styles.situationContent}>
                            <Text style={styles.situationTitle}>Why It's Complicated</Text>
                            <Text style={styles.situationDesc}>
                                Self-employed parents can manipulate their taxable income through business expenses, 
                                depreciation, retained earnings, and income splitting. Services Australia may not 
                                accept your tax return at face value.
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Common Issues:</Text>

                    <Text style={styles.bulletItem}>• Business expenses that reduce taxable income but don't reflect true earning capacity</Text>
                    <Text style={styles.bulletItem}>• Income retained in the business rather than drawn as salary</Text>
                    <Text style={styles.bulletItem}>• Fluctuating income year-to-year</Text>
                    <Text style={styles.bulletItem}>• Personal expenses claimed as business deductions</Text>
                    <Text style={styles.bulletItem}>• Income split between family members</Text>

                    <Text style={styles.h3} accessibilityRole="header">What a Lawyer Can Do:</Text>

                    <Text style={styles.bulletItem}>• Analyze financial statements to determine true earning capacity</Text>
                    <Text style={styles.bulletItem}>• Apply for a Change of Assessment based on earning capacity (Reason 8B)</Text>
                    <Text style={styles.bulletItem}>• Challenge artificially low income declarations</Text>
                    <Text style={styles.bulletItem}>• Negotiate fair income figures with the other parent's lawyer</Text>
                    <Text style={styles.bulletItem}>• Represent you at SSAT hearings with financial evidence</Text>

                    <View style={styles.exampleBox}>
                        <Text style={styles.exampleTitle}>Real Example:</Text>
                        <Text style={styles.exampleText}>
                            Parent A declares $45,000 taxable income from their business. But their business turns 
                            over $300,000 and they drive a $80,000 car "for work." A lawyer can argue their true 
                            earning capacity is $100,000+, tripling the child support owed.
                        </Text>
                    </View>

                    <View style={styles.ctaBox}>
                        <Text style={styles.ctaText}>
                            Self-employed or dealing with a self-employed ex? Get legal advice before accepting 
                            their declared income.
                        </Text>
                        <Pressable
                            style={[styles.ctaButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=self_employment')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.ctaButtonText}>Get Legal Help →</Text>
                        </Pressable>
                    </View>

                    {/* Situation 2 */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Situation 2: Trusts, Companies, and Complex Structures
                    </Text>

                    <View style={styles.situationCard}>
                        <Text style={styles.situationIcon}>🏢</Text>
                        <View style={styles.situationContent}>
                            <Text style={styles.situationTitle}>Why It's Complicated</Text>
                            <Text style={styles.situationDesc}>
                                Family trusts and companies can hide income, distribute it to other family members, 
                                or retain it indefinitely. The person controlling the trust may have access to 
                                significant wealth while declaring minimal personal income.
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Red Flags:</Text>

                    <Text style={styles.bulletItem}>• Your ex controls a family trust but declares low personal income</Text>
                    <Text style={styles.bulletItem}>• Trust distributions go to their new partner or parents</Text>
                    <Text style={styles.bulletItem}>• Company profits are retained rather than distributed</Text>
                    <Text style={styles.bulletItem}>• Your ex has a high lifestyle but low taxable income</Text>
                    <Text style={styles.bulletItem}>• Multiple entities (trusts, companies, partnerships) involved</Text>

                    <Text style={styles.h3} accessibilityRole="header">What a Lawyer Can Do:</Text>

                    <Text style={styles.bulletItem}>• Obtain trust deeds and financial statements through discovery</Text>
                    <Text style={styles.bulletItem}>• Analyze trust distributions and beneficiary entitlements</Text>
                    <Text style={styles.bulletItem}>• Apply for Change of Assessment based on income/property/resources (Reason 8A)</Text>
                    <Text style={styles.bulletItem}>• Argue that trust income should be attributed to your ex</Text>
                    <Text style={styles.bulletItem}>• Subpoena financial records if necessary</Text>

                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightTitle}>Legal Expertise Required:</Text>
                        <Text style={styles.highlightText}>
                            Trust law is complex. Services Australia staff aren't equipped to analyze trust structures. 
                            You need a lawyer who understands both family law and tax law to navigate these cases.
                        </Text>
                    </View>

                    <View style={styles.ctaBox}>
                        <Text style={styles.ctaText}>
                            Dealing with trusts or companies? This requires specialist legal advice.
                        </Text>
                        <Pressable
                            style={[styles.ctaButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=trusts_companies')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.ctaButtonText}>Get Legal Help →</Text>
                        </Pressable>
                    </View>

                    {/* Situation 3 */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Situation 3: Overseas Income or Assets
                    </Text>

                    <View style={styles.situationCard}>
                        <Text style={styles.situationIcon}>🌍</Text>
                        <View style={styles.situationContent}>
                            <Text style={styles.situationTitle}>Why It's Complicated</Text>
                            <Text style={styles.situationDesc}>
                                Income earned overseas, foreign investments, offshore accounts, and international 
                                property complicate child support assessments. Currency conversion, tax treaties, 
                                and verification challenges make these cases difficult.
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Complex Scenarios:</Text>

                    <Text style={styles.bulletItem}>• Your ex works overseas but has Australian tax obligations</Text>
                    <Text style={styles.bulletItem}>• Foreign rental income or investment returns</Text>
                    <Text style={styles.bulletItem}>• Offshore bank accounts or assets</Text>
                    <Text style={styles.bulletItem}>• Income in foreign currency requiring conversion</Text>
                    <Text style={styles.bulletItem}>• Tax-free income in certain countries</Text>

                    <Text style={styles.h3} accessibilityRole="header">What a Lawyer Can Do:</Text>

                    <Text style={styles.bulletItem}>• Navigate international tax treaties and reporting requirements</Text>
                    <Text style={styles.bulletItem}>• Obtain foreign financial records through legal channels</Text>
                    <Text style={styles.bulletItem}>• Calculate Australian-equivalent income correctly</Text>
                    <Text style={styles.bulletItem}>• Apply for Change of Assessment if overseas income is hidden</Text>
                    <Text style={styles.bulletItem}>• Coordinate with international enforcement if your ex lives abroad</Text>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>💡 Related:</Text>
                        <Text style={styles.infoText}>
                            If your ex lives overseas, enforcement depends on which country. Read our guide on 
                            international child support for reciprocating jurisdictions.
                        </Text>
                        <Pressable
                            style={[styles.infoButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/blog/international-child-support-australia')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.infoButtonText}>Read International Guide →</Text>
                        </Pressable>
                    </View>

                    <View style={styles.ctaBox}>
                        <Text style={styles.ctaText}>
                            Overseas income or assets involved? Get legal advice on verification and enforcement.
                        </Text>
                        <Pressable
                            style={[styles.ctaButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=overseas_income')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.ctaButtonText}>Get Legal Help →</Text>
                        </Pressable>
                    </View>

                    {/* Situation 4 */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Situation 4: Multiple Relationships with Children
                    </Text>

                    <View style={styles.situationCard}>
                        <Text style={styles.situationIcon}>👨‍👩‍👧‍👦</Text>
                        <View style={styles.situationContent}>
                            <Text style={styles.situationTitle}>Why It's Complicated</Text>
                            <Text style={styles.situationDesc}>
                                When you have children from multiple relationships, the multi-case formula applies. 
                                This formula is complex, involves cost splitting between cases, and can produce 
                                counterintuitive results.
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Multi-Case Complexity:</Text>

                    <Text style={styles.bulletItem}>• Costs are split between all your child support cases</Text>
                    <Text style={styles.bulletItem}>• Your income percentage is calculated across all cases</Text>
                    <Text style={styles.bulletItem}>• Changes in one case affect payments in other cases</Text>
                    <Text style={styles.bulletItem}>• Care arrangements in one case impact calculations in others</Text>
                    <Text style={styles.bulletItem}>• The formula can produce unexpected results</Text>

                    <Text style={styles.h3} accessibilityRole="header">What a Lawyer Can Do:</Text>

                    <Text style={styles.bulletItem}>• Verify Services Australia applied the multi-case formula correctly</Text>
                    <Text style={styles.bulletItem}>• Model different scenarios to optimize your total payments</Text>
                    <Text style={styles.bulletItem}>• Advise on how care changes in one case affect other cases</Text>
                    <Text style={styles.bulletItem}>• Object to assessments if the formula was misapplied</Text>
                    <Text style={styles.bulletItem}>• Coordinate strategy across multiple cases</Text>

                    <View style={styles.exampleBox}>
                        <Text style={styles.exampleTitle}>Why This Matters:</Text>
                        <Text style={styles.exampleText}>
                            In multi-case situations, increasing care in one case can actually increase your payments 
                            in another case due to how costs are split. A lawyer can model these scenarios before 
                            you make care arrangement decisions.
                        </Text>
                    </View>

                    <View style={styles.ctaBox}>
                        <Text style={styles.ctaText}>
                            Children from multiple relationships? The multi-case formula requires expert analysis.
                        </Text>
                        <Pressable
                            style={[styles.ctaButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=multi_case')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.ctaButtonText}>Get Legal Help →</Text>
                        </Pressable>
                    </View>

                    {/* Situation 5 */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Situation 5: Court Orders That Override the Formula
                    </Text>

                    <View style={styles.situationCard}>
                        <Text style={styles.situationIcon}>⚖️</Text>
                        <View style={styles.situationContent}>
                            <Text style={styles.situationTitle}>Why It's Complicated</Text>
                            <Text style={styles.situationDesc}>
                                Existing court orders, consent orders, or binding child support agreements can 
                                override the standard formula. Understanding how these interact with Services 
                                Australia assessments requires legal expertise.
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Court Order Scenarios:</Text>

                    <Text style={styles.bulletItem}>• You have a consent order specifying child support amounts</Text>
                    <Text style={styles.bulletItem}>• A court order includes property settlement in lieu of child support</Text>
                    <Text style={styles.bulletItem}>• Binding child support agreement exists but circumstances have changed</Text>
                    <Text style={styles.bulletItem}>• Court order conflicts with Services Australia assessment</Text>
                    <Text style={styles.bulletItem}>• You want to vary or terminate an existing agreement</Text>

                    <Text style={styles.h3} accessibilityRole="header">What a Lawyer Can Do:</Text>

                    <Text style={styles.bulletItem}>• Review existing orders to determine what's enforceable</Text>
                    <Text style={styles.bulletItem}>• Advise whether to apply for a new assessment or vary the order</Text>
                    <Text style={styles.bulletItem}>• Draft binding child support agreements that protect your interests</Text>
                    <Text style={styles.bulletItem}>• Apply to court to vary or set aside agreements if circumstances changed</Text>
                    <Text style={styles.bulletItem}>• Ensure property settlements are properly credited against child support</Text>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Don't Assume Orders Are Final:</Text>
                        <Text style={styles.warningText}>
                            Court orders and agreements can be varied if circumstances have significantly changed. 
                            A lawyer can assess whether you have grounds to apply for a variation.
                        </Text>
                    </View>

                    <View style={styles.ctaBox}>
                        <Text style={styles.ctaText}>
                            Have existing court orders or agreements? Get legal advice on your options.
                        </Text>
                        <Pressable
                            style={[styles.ctaButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=court_orders')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.ctaButtonText}>Get Legal Help →</Text>
                        </Pressable>
                    </View>

                    {/* Situation 6 */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Situation 6: Hidden Income or Lifestyle Discrepancies
                    </Text>

                    <View style={styles.situationCard}>
                        <Text style={styles.situationIcon}>🕵️</Text>
                        <View style={styles.situationContent}>
                            <Text style={styles.situationTitle}>Why It's Complicated</Text>
                            <Text style={styles.situationDesc}>
                                Your ex declares low income but lives a high lifestyle. New car, expensive holidays, 
                                designer clothes. They're hiding income somewhere—but proving it requires legal 
                                investigation and evidence gathering.
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Red Flags for Hidden Income:</Text>

                    <Text style={styles.bulletItem}>• Lifestyle doesn't match declared income</Text>
                    <Text style={styles.bulletItem}>• Cash business with minimal reported revenue</Text>
                    <Text style={styles.bulletItem}>• Assets purchased but no apparent income source</Text>
                    <Text style={styles.bulletItem}>• New partner's income funding their lifestyle</Text>
                    <Text style={styles.bulletItem}>• Frequent overseas trips despite "low income"</Text>

                    <Text style={styles.h3} accessibilityRole="header">What a Lawyer Can Do:</Text>

                    <Text style={styles.bulletItem}>• Apply for Change of Assessment based on Reason 8A (income/property/resources)</Text>
                    <Text style={styles.bulletItem}>• Subpoena bank records, credit card statements, and financial documents</Text>
                    <Text style={styles.bulletItem}>• Hire forensic accountants to trace hidden income</Text>
                    <Text style={styles.bulletItem}>• Present evidence of lifestyle inconsistent with declared income</Text>
                    <Text style={styles.bulletItem}>• Argue for imputed income based on earning capacity</Text>

                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightTitle}>Success Rate:</Text>
                        <Text style={styles.highlightText}>
                            Change of Assessment applications based on hidden income (Reason 8A) have a moderate 
                            success rate when supported by strong evidence. A lawyer knows what evidence Services 
                            Australia and SSAT will accept.
                        </Text>
                    </View>

                    <View style={styles.ctaBox}>
                        <Text style={styles.ctaText}>
                            Suspect hidden income? Legal investigation can uncover what your ex is hiding.
                        </Text>
                        <Pressable
                            style={[styles.ctaButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=hidden_income')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.ctaButtonText}>Get Legal Help →</Text>
                        </Pressable>
                    </View>

                    {/* Situation 7 */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Situation 7: High-Value or High-Conflict Cases
                    </Text>

                    <View style={styles.situationCard}>
                        <Text style={styles.situationIcon}>💰</Text>
                        <View style={styles.situationContent}>
                            <Text style={styles.situationTitle}>Why It's Complicated</Text>
                            <Text style={styles.situationDesc}>
                                When combined income exceeds $200,000+, or when the other parent has hired a lawyer, 
                                or when there's a history of litigation, you need legal representation to protect 
                                your interests.
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">High-Stakes Indicators:</Text>

                    <Text style={styles.bulletItem}>• Combined parental income over $200,000</Text>
                    <Text style={styles.bulletItem}>• Child support payments over $30,000 per year</Text>
                    <Text style={styles.bulletItem}>• The other parent has hired a lawyer</Text>
                    <Text style={styles.bulletItem}>• History of court proceedings between you</Text>
                    <Text style={styles.bulletItem}>• Significant assets or property involved</Text>

                    <Text style={styles.h3} accessibilityRole="header">Why You Need a Lawyer:</Text>

                    <Text style={styles.bulletItem}>• Level the playing field if the other parent has representation</Text>
                    <Text style={styles.bulletItem}>• Protect against aggressive legal tactics</Text>
                    <Text style={styles.bulletItem}>• Ensure high-income calculations are accurate</Text>
                    <Text style={styles.bulletItem}>• Navigate complex negotiations and settlements</Text>
                    <Text style={styles.bulletItem}>• Represent you in court if necessary</Text>

                    <View style={styles.exampleBox}>
                        <Text style={styles.exampleTitle}>Cost-Benefit Analysis:</Text>
                        <Text style={styles.exampleText}>
                            If child support is $30,000/year and a lawyer can reduce it by 20%, that's $6,000/year 
                            saved. Over 10 years, that's $60,000. A lawyer's fee of $5,000 pays for itself many 
                            times over.
                        </Text>
                    </View>

                    <View style={styles.ctaBox}>
                        <Text style={styles.ctaText}>
                            High-income case or other parent has a lawyer? Don't go unrepresented.
                        </Text>
                        <Pressable
                            style={[styles.ctaButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=high_value')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.ctaButtonText}>Get Legal Help →</Text>
                        </Pressable>
                    </View>

                    {/* Situation 8 */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Situation 8: Change of Assessment Applications
                    </Text>

                    <View style={styles.situationCard}>
                        <Text style={styles.situationIcon}>📋</Text>
                        <View style={styles.situationContent}>
                            <Text style={styles.situationTitle}>Why It's Complicated</Text>
                            <Text style={styles.situationDesc}>
                                Change of Assessment applications involve 10 specific reasons, strict evidence 
                                requirements, and a review process that can take months. The success rate is 
                                significantly higher with legal representation.
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">The 10 Reasons for Change of Assessment:</Text>

                    <Text style={styles.bulletItem}>1. High costs of contact with the child</Text>
                    <Text style={styles.bulletItem}>2. Costs of caring for a child with special needs</Text>
                    <Text style={styles.bulletItem}>3. High costs of educating or training the child</Text>
                    <Text style={styles.bulletItem}>4. The child's income, earning capacity, property, or resources</Text>
                    <Text style={styles.bulletItem}>5. Benefits transferred to the other parent</Text>
                    <Text style={styles.bulletItem}>6. High childcare costs to enable work</Text>
                    <Text style={styles.bulletItem}>7. Reduced capacity due to commitments</Text>
                    <Text style={styles.bulletItem}>8A. Income, property, or financial resources</Text>
                    <Text style={styles.bulletItem}>8B. Earning capacity</Text>
                    <Text style={styles.bulletItem}>9. Legal duty to maintain another person</Text>
                    <Text style={styles.bulletItem}>10. Resident child responsibility</Text>

                    <Text style={styles.h3} accessibilityRole="header">What a Lawyer Can Do:</Text>

                    <Text style={styles.bulletItem}>• Assess which reason(s) apply to your situation</Text>
                    <Text style={styles.bulletItem}>• Gather and organize evidence that meets Services Australia's requirements</Text>
                    <Text style={styles.bulletItem}>• Draft comprehensive applications with supporting documentation</Text>
                    <Text style={styles.bulletItem}>• Represent you at conferences with Services Australia</Text>
                    <Text style={styles.bulletItem}>• Appeal to SSAT if the application is rejected</Text>

                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightTitle}>Success Rates:</Text>
                        <Text style={styles.highlightText}>
                            Professionally prepared Change of Assessment applications have significantly higher 
                            success rates than self-represented applications. Lawyers know what evidence Services 
                            Australia requires and how to present it effectively.
                        </Text>
                    </View>

                    <View style={styles.ctaBox}>
                        <Text style={styles.ctaText}>
                            Considering a Change of Assessment? Legal advice dramatically improves your chances.
                        </Text>
                        <Pressable
                            style={[styles.ctaButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/special-circumstances')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.ctaButtonText}>Explore Change of Assessment →</Text>
                        </Pressable>
                    </View>

                    {/* Why Legal Advice Matters */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Why Legal Advice Matters in Complex Cases
                    </Text>

                    <Text style={styles.paragraph}>
                        Complex child support cases have three characteristics that make legal advice essential:
                    </Text>

                    <View style={styles.reasonCard}>
                        <Text style={styles.reasonNumber}>1</Text>
                        <View style={styles.reasonContent}>
                            <Text style={styles.reasonTitle}>High Financial Stakes</Text>
                            <Text style={styles.reasonDesc}>
                                Complex cases often involve $10,000-$30,000+ per year in child support. Over 10-15 
                                years, that's $100,000-$450,000. A lawyer's fee of $2,000-$10,000 is a small 
                                investment to protect six-figure interests.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.reasonCard}>
                        <Text style={styles.reasonNumber}>2</Text>
                        <View style={styles.reasonContent}>
                            <Text style={styles.reasonTitle}>Legal Risk</Text>
                            <Text style={styles.reasonDesc}>
                                Mistakes in complex cases can be costly and difficult to fix. Incorrect assessments, 
                                missed deadlines, inadequate evidence, or poor strategy can lock you into unfavorable 
                                outcomes for years.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.reasonCard}>
                        <Text style={styles.reasonNumber}>3</Text>
                        <View style={styles.reasonContent}>
                            <Text style={styles.reasonTitle}>Specialized Knowledge Required</Text>
                            <Text style={styles.reasonDesc}>
                                Complex cases require expertise in family law, tax law, trust law, and Services 
                                Australia procedures. This isn't knowledge you can gain from Google searches—it 
                                requires years of professional experience.
                            </Text>
                        </View>
                    </View>

                    {/* What Lawyers Can Do */}
                    <Text style={styles.h2} accessibilityRole="header">
                        What a Child Support Lawyer Can Do for You
                    </Text>

                    <Text style={styles.paragraph}>
                        Family lawyers who specialize in child support provide services that go far beyond what 
                        you can do yourself:
                    </Text>

                    <View style={styles.serviceCard}>
                        <Text style={styles.serviceTitle}>📊 Financial Analysis</Text>
                        <Text style={styles.serviceDesc}>
                            Analyze complex income structures, business financials, trust distributions, and asset 
                            holdings to determine true earning capacity and financial resources.
                        </Text>
                    </View>

                    <View style={styles.serviceCard}>
                        <Text style={styles.serviceTitle}>🔍 Evidence Gathering</Text>
                        <Text style={styles.serviceDesc}>
                            Obtain financial records through discovery, subpoena documents, hire forensic accountants, 
                            and compile evidence that meets legal standards.
                        </Text>
                    </View>

                    <View style={styles.serviceCard}>
                        <Text style={styles.serviceTitle}>📝 Application Preparation</Text>
                        <Text style={styles.serviceDesc}>
                            Draft comprehensive Change of Assessment applications, objections, and appeals with 
                            proper legal language and supporting documentation.
                        </Text>
                    </View>

                    <View style={styles.serviceCard}>
                        <Text style={styles.serviceTitle}>🤝 Negotiation</Text>
                        <Text style={styles.serviceDesc}>
                            Negotiate with the other parent's lawyer to reach fair settlements without lengthy 
                            court proceedings.
                        </Text>
                    </View>

                    <View style={styles.serviceCard}>
                        <Text style={styles.serviceTitle}>⚖️ Representation</Text>
                        <Text style={styles.serviceDesc}>
                            Represent you at Services Australia conferences, SSAT hearings, and Family Court 
                            proceedings if necessary.
                        </Text>
                    </View>

                    <View style={styles.serviceCard}>
                        <Text style={styles.serviceTitle}>🎯 Strategic Advice</Text>
                        <Text style={styles.serviceDesc}>
                            Advise on optimal timing, which legal avenues to pursue, cost-benefit analysis, and 
                            long-term strategy across multiple issues.
                        </Text>
                    </View>

                    {/* Cost vs Risk */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Cost vs. Risk: When Legal Fees Pay for Themselves
                    </Text>

                    <Text style={styles.paragraph}>
                        Many parents hesitate to hire a lawyer because of the cost. But in complex cases, the 
                        cost of NOT having a lawyer is usually much higher.
                    </Text>

                    <View style={styles.comparisonCard}>
                        <Text style={styles.comparisonTitle}>Typical Legal Costs:</Text>
                        <Text style={styles.bulletItem}>• Initial consultation: $0-$300 (often free)</Text>
                        <Text style={styles.bulletItem}>• Hourly rate: $300-$600 per hour</Text>
                        <Text style={styles.bulletItem}>• Change of Assessment application: $2,000-$5,000 (fixed fee)</Text>
                        <Text style={styles.bulletItem}>• Objection or appeal: $1,500-$3,000 (fixed fee)</Text>
                        <Text style={styles.bulletItem}>• SSAT representation: $3,000-$8,000</Text>
                        <Text style={styles.bulletItem}>• Full court proceedings: $10,000-$30,000+</Text>
                    </View>

                    <View style={styles.comparisonCard}>
                        <Text style={styles.comparisonTitle}>Potential Savings/Gains:</Text>
                        <Text style={styles.bulletItem}>• Reducing child support by $5,000/year = $50,000 over 10 years</Text>
                        <Text style={styles.bulletItem}>• Increasing child support by $10,000/year = $100,000 over 10 years</Text>
                        <Text style={styles.bulletItem}>• Avoiding incorrect assessment = $20,000-$100,000+ saved</Text>
                        <Text style={styles.bulletItem}>• Successful Change of Assessment = $30,000-$150,000+ impact</Text>
                    </View>

                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightTitle}>The Math Is Simple:</Text>
                        <Text style={styles.highlightText}>
                            If a lawyer's fee is $5,000 and they save or gain you $10,000+ per year in child support, 
                            the investment pays for itself in 6 months. Over 10 years, you're ahead by $95,000.
                        </Text>
                    </View>

                    {/* FAQ Section */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Frequently Asked Questions
                    </Text>

                    <FAQItem
                        question="When should I hire a lawyer for child support?"
                        answer="Hire a lawyer if you have self-employment income, trusts or companies, overseas income, high-value assets, multiple relationships with children, court orders that override the formula, Change of Assessment applications, or disputes about income or care. Complex cases have high financial stakes and legal risks that justify professional help."
                    />

                    <FAQItem
                        question="How much does a child support lawyer cost in Australia?"
                        answer="Family lawyers typically charge $300-$600 per hour for child support matters. Initial consultations are often free or discounted. Many lawyers offer fixed-fee packages for specific services like Change of Assessment applications ($2,000-$5,000) or objections ($1,500-$3,000). The cost depends on complexity and whether the matter goes to court."
                    />

                    <FAQItem
                        question="What makes child support complicated?"
                        answer="Child support becomes complicated when income is hard to verify (self-employment, trusts, overseas), when there are multiple relationships with children, when court orders exist, when one parent hides assets, when care arrangements are disputed, or when special circumstances apply. These situations require legal expertise to navigate correctly."
                    />

                    <FAQItem
                        question="Can I get legal aid for child support?"
                        answer="Legal aid for child support is limited in Australia. You may qualify if you're on a low income and your case involves family violence, child safety concerns, or complex legal issues. Most child support matters don't qualify for legal aid, but many lawyers offer payment plans or no-win-no-fee arrangements for certain cases."
                    />

                    <FAQItem
                        question="Do I need a lawyer if the other parent has one?"
                        answer="Yes. If the other parent has legal representation, you're at a significant disadvantage without your own lawyer. Their lawyer will use legal strategies, evidence gathering, and procedural knowledge that you can't match without professional help. This is especially critical in high-value or high-conflict cases."
                    />

                    {/* Conclusion */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Don't Navigate Complex Cases Alone
                    </Text>

                    <Text style={styles.paragraph}>
                        Child support is straightforward for most families. But if your situation involves any of 
                        the eight complications we've discussed, you're in territory where mistakes are costly and 
                        legal expertise is essential.
                    </Text>

                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightTitle}>Key Takeaways:</Text>
                        <Text style={styles.bulletItem}>• Complex cases involve high financial stakes ($100,000+ over time)</Text>
                        <Text style={styles.bulletItem}>• Legal mistakes can lock you into unfavorable outcomes for years</Text>
                        <Text style={styles.bulletItem}>• Lawyers provide specialized knowledge you can't gain from Google</Text>
                        <Text style={styles.bulletItem}>• Legal fees typically pay for themselves through better outcomes</Text>
                        <Text style={styles.bulletItem}>• Initial consultations are often free—get advice before deciding</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        Start by using our calculator to understand the standard formula. If your situation is 
                        complex, the calculator will flag it. Then connect with experienced family lawyers who 
                        can protect your interests.
                    </Text>

                    {/* Final CTA */}
                    <View style={styles.finalCtaSection}>
                        <Text style={styles.finalCtaTitle}>Is Your Child Support Situation Complex?</Text>
                        <Text style={styles.finalCtaText}>
                            Get a free initial consultation with family lawyers who specialize in complex child 
                            support cases.
                        </Text>
                        <View style={styles.ctaButtons}>
                            <Pressable
                                style={[styles.primaryButton, isWeb && webClickableStyles]}
                                onPress={() => router.push('/lawyer-inquiry?mode=direct')}
                                accessibilityRole="button"
                            >
                                <Text style={styles.primaryButtonText}>Get Legal Help</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.secondaryButton, isWeb && webClickableStyles]}
                                onPress={() => router.push('/')}
                                accessibilityRole="button"
                            >
                                <Text style={styles.secondaryButtonText}>Try Calculator First</Text>
                            </Pressable>
                        </View>
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
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    articleHeader: {
        marginBottom: 24,
    },
    category: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2563EB',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    h1: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1e3a8a',
        marginBottom: 12,
        ...(Platform.OS === 'web' ? { lineHeight: 40 } : {}),
    },
    publishDate: {
        fontSize: 14,
        color: '#64748b',
    },
    intro: {
        fontSize: 18,
        lineHeight: 28,
        color: '#334155',
        marginBottom: 16,
        fontWeight: '500',
    },
    h2: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e3a8a',
        marginTop: 32,
        marginBottom: 16,
        ...(Platform.OS === 'web' ? { lineHeight: 32 } : {}),
    },
    h3: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e3a8a',
        marginTop: 20,
        marginBottom: 12,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 26,
        color: '#475569',
        marginBottom: 16,
    },
    bulletItem: {
        fontSize: 15,
        lineHeight: 24,
        color: '#475569',
        marginBottom: 8,
        paddingLeft: 8,
    },
    warningBox: {
        backgroundColor: '#fef3c7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fbbf24',
        padding: 16,
        marginBottom: 16,
    },
    warningTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#78350f',
        marginBottom: 8,
    },
    warningText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#78350f',
    },
    situationCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        ...createShadow({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
        }),
    },
    situationIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    situationContent: {
        flex: 1,
    },
    situationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 6,
    },
    situationDesc: {
        fontSize: 14,
        lineHeight: 20,
        color: '#64748b',
    },
    exampleBox: {
        backgroundColor: '#f0fdf4',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#86efac',
        padding: 16,
        marginBottom: 16,
    },
    exampleTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#14532d',
        marginBottom: 8,
    },
    exampleText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#14532d',
        fontStyle: 'italic',
    },
    highlightBox: {
        backgroundColor: '#eff6ff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#bfdbfe',
        padding: 16,
        marginBottom: 16,
        ...createShadow({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 3,
            elevation: 2,
        }),
    },
    highlightTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 8,
    },
    highlightText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#1e40af',
    },
    infoBox: {
        backgroundColor: '#f0fdf4',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#86efac',
        padding: 16,
        marginBottom: 16,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#14532d',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#14532d',
        marginBottom: 12,
    },
    infoButton: {
        backgroundColor: '#22c55e',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
    },
    infoButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    ctaBox: {
        backgroundColor: '#1e3a8a',
        borderRadius: 12,
        padding: 20,
        marginTop: 16,
        marginBottom: 24,
        alignItems: 'center',
    },
    ctaText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#bfdbfe',
        marginBottom: 16,
        textAlign: 'center',
    },
    ctaButton: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        ...createShadow({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        }),
    },
    ctaButtonText: {
        color: '#1e3a8a',
        fontSize: 16,
        fontWeight: '600',
    },
    reasonCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#2563EB',
        ...createShadow({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 3,
            elevation: 2,
        }),
    },
    reasonNumber: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2563EB',
        marginRight: 16,
        minWidth: 40,
    },
    reasonContent: {
        flex: 1,
    },
    reasonTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 6,
    },
    reasonDesc: {
        fontSize: 14,
        lineHeight: 20,
        color: '#64748b',
    },
    serviceCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    serviceTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 6,
    },
    serviceDesc: {
        fontSize: 14,
        lineHeight: 20,
        color: '#64748b',
    },
    comparisonCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        ...createShadow({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 3,
            elevation: 2,
        }),
    },
    comparisonTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 12,
    },
    faqItem: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 8,
    },
    faqAnswer: {
        fontSize: 15,
        lineHeight: 24,
        color: '#475569',
    },
    finalCtaSection: {
        backgroundColor: '#1e3a8a',
        borderRadius: 12,
        padding: 24,
        marginTop: 32,
        alignItems: 'center',
    },
    finalCtaTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 12,
        textAlign: 'center',
    },
    finalCtaText: {
        fontSize: 16,
        lineHeight: 26,
        color: '#bfdbfe',
        marginBottom: 24,
        textAlign: 'center',
    },
    ctaButtons: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 28,
        ...createShadow({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        }),
    },
    primaryButtonText: {
        color: '#1e3a8a',
        fontSize: 17,
        fontWeight: '700',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    secondaryButtonText: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: '600',
    },
});
