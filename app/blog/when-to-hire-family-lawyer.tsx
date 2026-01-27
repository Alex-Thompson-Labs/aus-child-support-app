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
            name: 'When should I hire a family lawyer for child support in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Hire a family lawyer when: 1) The other parent is self-employed or has complex income (trusts, companies, overseas assets), 2) You receive a Change of Assessment application or court summons, or 3) Your case involves high conflict (threats, false allegations, parental alienation). These situations have significant financial and legal consequences that require professional representation.',
            },
        },
        {
            '@type': 'Question',
            name: 'How much does a family lawyer cost for child support in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Family lawyers charge $300-600 per hour depending on experience and location. Initial consultations cost $200-400. Simple matters may cost $2,000-5,000 total, while complex cases (Change of Assessment, court proceedings) can cost $10,000-30,000+. Many lawyers offer fixed-fee packages for specific services.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I handle child support without a lawyer?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, if your case is straightforward: both parents are wage earners, income is verifiable, no disputes about care arrangements, and both parties cooperate. Use the free calculator to estimate payments and Services Australia handles administration. However, complex income, disputes, or legal proceedings require professional advice.',
            },
        },
    ],
};

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'When to Hire a Family Lawyer for Child Support: 3 Key Signs',
    description: 'Learn the 3 critical signs you need a family lawyer for child support in Australia. Understand when DIY is risky, what lawyers cost, and how to find the right representation.',
    datePublished: '2026-01-24',
    author: { '@type': 'Organization', name: 'AusChildSupport' },
};

export default function WhenToHireFamilyLawyerBlogPost() {
    const router = useRouter();

    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="When to Hire a Family Lawyer for Child Support Australia 2026"
                description="DIY child support fails with self-employment, trusts, or court orders. 3 signs you need a lawyer. Free consultations. Errors cost $10k-30k+."
                canonicalPath="/blog/when-to-hire-family-lawyer"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'When to Hire a Lawyer' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Legal Advice</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            When to Hire a Family Lawyer for Child Support: 3 Key Signs
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    <Text style={styles.intro}>
                        Most child support cases don't need a lawyer. But some situations are too complex, too
                        high-stakes, or too adversarial to handle alone. Here are the 3 critical signs you need
                        professional legal representation—and what happens if you don't get it.
                    </Text>

                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            Hire a lawyer if: 1) The other parent has complex income (self-employed, trusts, overseas),
                            2) You receive legal documents (Change of Assessment, court summons), or 3) Your case
                            involves high conflict or threats. These situations have serious financial and legal
                            consequences.
                        </Text>
                    </View>

                    {/* When You DON'T Need a Lawyer */}
                    <Text style={styles.h2} accessibilityRole="header">When You DON'T Need a Lawyer</Text>
                    <Text style={styles.paragraph}>
                        Let's start with the good news. Most child support cases are straightforward and don't require
                        legal representation:
                    </Text>

                    <View style={styles.greenCard}>
                        <Text style={styles.greenCardTitle}>✓ DIY-Friendly Situations:</Text>
                        <Text style={styles.bulletItem}>• Both parents are wage earners (PAYG employees)</Text>
                        <Text style={styles.bulletItem}>• Income is easily verifiable (tax returns, payslips)</Text>
                        <Text style={styles.bulletItem}>• No disputes about care arrangements</Text>
                        <Text style={styles.bulletItem}>• Both parties cooperate with Services Australia</Text>
                        <Text style={styles.bulletItem}>• No history of domestic violence or threats</Text>
                        <Text style={styles.bulletItem}>• Standard formula applies (no special circumstances)</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        In these cases, use the free calculator to estimate payments, then let Services Australia
                        handle the administration. You'll save thousands in legal fees.
                    </Text>

                    <Pressable
                        style={[styles.calculatorButton, isWeb && webClickableStyles]}
                        onPress={() => router.push('/')}
                        accessibilityRole="button"
                    >
                        <Text style={styles.calculatorButtonText}>Calculate Your Child Support →</Text>
                    </Pressable>

                    {/* Sign 1: Complex Income */}
                    <Text style={styles.h2} accessibilityRole="header">Sign #1: The Other Parent Has Complex Income</Text>
                    <Text style={styles.paragraph}>
                        This is the number one reason parents need lawyers. Complex income means the other parent can
                        manipulate their reported earnings to reduce child support.
                    </Text>

                    <View style={styles.dangerCard}>
                        <Text style={styles.dangerCardTitle}>🚨 High-Risk Income Situations:</Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Self-employed:</Text> Can inflate business expenses, claim
                            depreciation, or pay personal costs through the business
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Company director:</Text> Can retain profits in the company
                            instead of paying themselves a salary
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Trust beneficiary:</Text> Can distribute income to family
                            members to minimize personal income
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Overseas income:</Text> Difficult to verify, easy to hide
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Cash-based business:</Text> Income is hard to trace and verify
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Multiple income sources:</Text> Rental properties, investments,
                            side businesses
                        </Text>
                    </View>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Real Example:</Text>
                        <Text style={styles.exampleText}>
                            Parent A is a tradie earning $120,000/year. After separation, they register a company
                            and report $45,000 personal income. The remaining $75,000 stays in the company as
                            "retained profits."
                        </Text>
                        <Text style={styles.exampleResult}>Without a lawyer:</Text>
                        <Text style={styles.exampleCalc}>Child support based on $45,000 = ~$200/month</Text>
                        <Text style={styles.exampleResult}>With a lawyer (Change of Assessment):</Text>
                        <Text style={styles.exampleCalc}>Child support based on $120,000 = ~$800/month</Text>
                        <Text style={styles.exampleImpact}>
                            Difference: $7,200/year. Legal fees to achieve this: $3,000-5,000. Pays for itself in
                            6-8 months.
                        </Text>
                    </View>

                    <View style={styles.trustBox}>
                        <Text style={styles.trustTitle}>💡 Suspect the Other Parent is Hiding Income?</Text>
                        <Text style={styles.trustText}>
                            Our partner lawyers specialize in forensic accounting for child support cases. They can:
                        </Text>
                        <Text style={styles.bulletItem}>• Request comprehensive financial disclosure</Text>
                        <Text style={styles.bulletItem}>• Analyze business structures and tax returns</Text>
                        <Text style={styles.bulletItem}>• Apply for Change of Assessment based on earning capacity</Text>
                        <Text style={[styles.trustText, { marginTop: 12 }]}>
                            Most offer free initial consultations to assess your situation.
                        </Text>
                        <Pressable
                            style={[styles.trustButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=hidden_income')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.trustButtonText}>Get Expert Help Uncovering Hidden Income →</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">What a Lawyer Does:</Text>
                    <View style={styles.listCard}>
                        <Text style={styles.bulletItem}>• Requests financial disclosure (BAS, bank statements, tax returns)</Text>
                        <Text style={styles.bulletItem}>• Identifies hidden income or inflated expenses</Text>
                        <Text style={styles.bulletItem}>• Applies for Change of Assessment based on earning capacity</Text>
                        <Text style={styles.bulletItem}>• Subpoenas business records if necessary</Text>
                        <Text style={styles.bulletItem}>• Represents you in SSAT or court if the other parent appeals</Text>
                    </View>

                    <Pressable
                        style={[styles.ctaButton, isWeb && webClickableStyles]}
                        onPress={() => router.push('/blog/child-support-self-employed')}
                        accessibilityRole="button"
                    >
                        <Text style={styles.ctaButtonText}>
                            Read: Child Support for Self-Employed Parents →
                        </Text>
                    </Pressable>

                    {/* Sign 2: Legal Documents */}
                    <Text style={styles.h2} accessibilityRole="header">Sign #2: You Receive Legal Documents</Text>
                    <Text style={styles.paragraph}>
                        If you receive any of these documents, hire a lawyer immediately. These are formal legal
                        proceedings with strict deadlines and serious consequences.
                    </Text>

                    <View style={styles.urgentCard}>
                        <Text style={styles.urgentCardTitle}>⏰ Urgent: Hire a Lawyer Within 7 Days</Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Change of Assessment application:</Text> 28 days to respond
                            or you lose by default
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Court summons:</Text> Must appear on specified date or face
                            penalties
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>SSAT appeal notice:</Text> 28 days to prepare case and evidence
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Subpoena for financial records:</Text> Legal obligation to
                            comply, penalties for non-compliance
                        </Text>
                        <Text style={styles.bulletItem}>
                            <Text style={styles.bold}>Departure from assessment application:</Text> Complex legal
                            arguments required
                        </Text>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Critical Warning:</Text>
                        <Text style={styles.warningText}>
                            Missing deadlines in legal proceedings can result in default judgments against you.
                            This means you automatically lose, even if you have a strong case. Legal documents
                            are not optional—they require immediate professional response.
                        </Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">What a Lawyer Does:</Text>
                    <View style={styles.listCard}>
                        <Text style={styles.bulletItem}>• Reviews legal documents and explains implications</Text>
                        <Text style={styles.bulletItem}>• Prepares formal response within required timeframes</Text>
                        <Text style={styles.bulletItem}>• Gathers evidence and witness statements</Text>
                        <Text style={styles.bulletItem}>• Represents you at hearings (SSAT, Federal Circuit Court)</Text>
                        <Text style={styles.bulletItem}>• Negotiates settlements to avoid court costs</Text>
                    </View>

                    <View style={styles.costCard}>
                        <Text style={styles.costTitle}>💰 Cost Reality Check:</Text>
                        <Text style={styles.costText}>
                            Legal representation for Change of Assessment: $3,000-8,000
                        </Text>
                        <Text style={styles.costText}>
                            Court proceedings: $10,000-30,000+
                        </Text>
                        <Text style={styles.costText}>
                            Cost of losing by default: Potentially $5,000-20,000/year in overpaid or underpaid
                            child support, plus legal costs awarded against you.
                        </Text>
                    </View>

                    <View style={styles.urgentCtaBox}>
                        <Text style={styles.urgentCtaTitle}>⏰ Received Legal Documents? Act Now</Text>
                        <Text style={styles.urgentCtaText}>
                            Don't risk a default judgment. Connect with experienced family lawyers who can respond within required timeframes.
                        </Text>
                        <View style={styles.urgentFeatures}>
                            <Text style={styles.bulletItem}>• Most lawyers respond within 24 hours</Text>
                            <Text style={styles.bulletItem}>• Initial consultations often free or low-cost ($200-400)</Text>
                            <Text style={styles.bulletItem}>• No obligation to proceed after consultation</Text>
                        </View>
                        <Pressable
                            style={[styles.urgentCtaButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.urgentCtaButtonText}>Find a Lawyer Now →</Text>
                        </Pressable>
                        <Text style={styles.urgentCtaDisclaimer}>
                            Free matching service. Your information remains confidential.
                        </Text>
                    </View>

                    {/* Sign 3: High Conflict */}
                    <Text style={styles.h2} accessibilityRole="header">Sign #3: High Conflict or Threats</Text>
                    <Text style={styles.paragraph}>
                        Some separations are adversarial from the start. If your situation involves threats,
                        false allegations, or parental alienation, you need a lawyer to protect your rights and
                        your children.
                    </Text>

                    <View style={styles.dangerCard}>
                        <Text style={styles.dangerCardTitle}>🚨 High-Conflict Warning Signs:</Text>
                        <Text style={styles.bulletItem}>• Threats to withhold children or deny access</Text>
                        <Text style={styles.bulletItem}>• False allegations of abuse or neglect</Text>
                        <Text style={styles.bulletItem}>• Parental alienation (turning children against you)</Text>
                        <Text style={styles.bulletItem}>• Refusal to communicate or cooperate</Text>
                        <Text style={styles.bulletItem}>• History of domestic violence or intervention orders</Text>
                        <Text style={styles.bulletItem}>• Threats to relocate interstate or overseas with children</Text>
                        <Text style={styles.bulletItem}>• Deliberate non-compliance with court orders</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        High-conflict cases rarely stay limited to child support. They escalate to parenting
                        arrangements, property settlement, and sometimes criminal proceedings. Understanding{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/child-support-reduction-strategies')}
                        >
                            legal strategies to reduce child support
                        </Text>
                        {' '}can help you navigate these complex situations. A lawyer helps you:
                    </Text>

                    <View style={styles.listCard}>
                        <Text style={styles.bulletItem}>• Document threats and non-compliance (critical for court evidence)</Text>
                        <Text style={styles.bulletItem}>• Apply for intervention orders if necessary</Text>
                        <Text style={styles.bulletItem}>• Respond to false allegations with evidence</Text>
                        <Text style={styles.bulletItem}>• Protect your parenting rights alongside child support</Text>
                        <Text style={styles.bulletItem}>• Navigate family law system strategically</Text>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Don't Wait:</Text>
                        <Text style={styles.warningText}>
                            High-conflict situations escalate quickly. What starts as a child support dispute can
                            become a full parenting dispute. Early legal intervention prevents costly mistakes and
                            protects your relationship with your children.
                        </Text>
                    </View>

                    {/* How Much Does a Lawyer Cost */}
                    <Text style={styles.h2} accessibilityRole="header">How Much Does a Family Lawyer Cost?</Text>
                    <Text style={styles.paragraph}>
                        Legal fees vary significantly based on complexity, location, and lawyer experience:
                    </Text>

                    <View style={styles.tableContainer}>
                        <Text style={styles.tableTitle}>Family Lawyer Costs in Australia (2026)</Text>
                        
                        <View style={styles.tableHeaderRow}>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 2 }]}>Service Type</Text>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1.5 }]}>Hourly Rate</Text>
                            <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1.5 }]}>Typical Total Cost</Text>
                        </View>

                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Initial consultation</Text>
                            <Text style={[styles.tableCell, { flex: 1.5 }]}>$200-400/hr</Text>
                            <Text style={[styles.tableCell, { flex: 1.5 }]}>$200-400 (1 hour)</Text>
                        </View>

                        <View style={[styles.tableRow, styles.tableRowAlt]}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Simple advice letter</Text>
                            <Text style={[styles.tableCell, { flex: 1.5 }]}>$300-600/hr</Text>
                            <Text style={[styles.tableCell, { flex: 1.5 }]}>$500-1,000</Text>
                        </View>

                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Change of Assessment response</Text>
                            <Text style={[styles.tableCell, { flex: 1.5 }]}>$450-600/hr</Text>
                            <Text style={[styles.tableCell, { flex: 1.5 }]}>$3,000-8,000</Text>
                        </View>

                        <View style={[styles.tableRow, styles.tableRowAlt]}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>SSAT representation</Text>
                            <Text style={[styles.tableCell, { flex: 1.5 }]}>$450-600/hr</Text>
                            <Text style={[styles.tableCell, { flex: 1.5 }]}>$5,000-12,000</Text>
                        </View>

                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>Court proceedings</Text>
                            <Text style={[styles.tableCell, { flex: 1.5 }]}>$600-800/hr</Text>
                            <Text style={[styles.tableCell, { flex: 1.5 }]}>$10,000-30,000+</Text>
                        </View>
                    </View>

                    <View style={styles.tipCard}>
                        <Text style={styles.tipTitle}>💡 Cost-Saving Tips:</Text>
                        <Text style={styles.bulletItem}>• Ask about fixed-fee packages for specific services</Text>
                        <Text style={styles.bulletItem}>• Do your own document gathering to reduce billable hours</Text>
                        <Text style={styles.bulletItem}>• Use initial consultation to get strategic advice, then decide next steps</Text>
                        <Text style={styles.bulletItem}>• Consider unbundled services (lawyer handles only critical parts)</Text>
                        <Text style={styles.bulletItem}>• Check eligibility for Legal Aid (income-tested)</Text>
                    </View>

                    {/* How to Find the Right Lawyer */}
                    <Text style={styles.h2} accessibilityRole="header">How to Find the Right Family Lawyer</Text>
                    <Text style={styles.paragraph}>
                        Not all family lawyers are equal. Child support expertise requires specific knowledge of
                        Services Australia processes, tax law, and business structures. If you're considering a{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/binding-child-support-agreement')}
                        >
                            binding child support agreement
                        </Text>
                        {', you\'ll need a lawyer experienced in drafting these complex documents.'}
                    </Text>

                    <View style={styles.checklistCard}>
                        <Text style={styles.checklistTitle}>✓ What to Look For:</Text>
                        <Text style={styles.bulletItem}>• Specializes in family law (not general practice)</Text>
                        <Text style={styles.bulletItem}>• Experience with child support disputes (ask how many cases)</Text>
                        <Text style={styles.bulletItem}>• Knowledge of business income assessment (if relevant)</Text>
                        <Text style={styles.bulletItem}>• Accredited Family Law Specialist (optional but valuable)</Text>
                        <Text style={styles.bulletItem}>• Clear fee structure and cost estimates</Text>
                        <Text style={styles.bulletItem}>• Good communication (responds within 24-48 hours)</Text>
                        <Text style={styles.bulletItem}>• Strategic approach (not just aggressive litigation)</Text>
                    </View>

                    <View style={styles.redFlagCard}>
                        <Text style={styles.redFlagTitle}>🚩 Red Flags:</Text>
                        <Text style={styles.bulletItem}>• Guarantees specific outcomes (no lawyer can guarantee results)</Text>
                        <Text style={styles.bulletItem}>• Encourages unnecessary litigation</Text>
                        <Text style={styles.bulletItem}>• Vague about costs or refuses to provide estimates</Text>
                        <Text style={styles.bulletItem}>• Poor communication or unresponsive</Text>
                        <Text style={styles.bulletItem}>• No experience with child support cases</Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Questions to Ask in Initial Consultation:</Text>
                    <View style={styles.listCard}>
                        <Text style={styles.bulletItem}>1. How many child support cases have you handled?</Text>
                        <Text style={styles.bulletItem}>2. What's your experience with [my specific issue]?</Text>
                        <Text style={styles.bulletItem}>3. What are my realistic options and likely outcomes?</Text>
                        <Text style={styles.bulletItem}>4. What will this cost (best case and worst case)?</Text>
                        <Text style={styles.bulletItem}>5. What can I do myself to reduce legal fees?</Text>
                        <Text style={styles.bulletItem}>6. How long will this process take?</Text>
                        <Text style={styles.bulletItem}>7. What's your communication process (email, phone, portal)?</Text>
                    </View>

                    {/* Decision Framework */}
                    <Text style={styles.h2} accessibilityRole="header">Decision Framework: DIY vs Lawyer</Text>
                    <Text style={styles.paragraph}>
                        Use this framework to decide if you need a lawyer:
                    </Text>

                    <View style={styles.frameworkCard}>
                        <Text style={styles.frameworkTitle}>🟢 DIY is Safe:</Text>
                        <Text style={styles.bulletItem}>• Both parents are wage earners</Text>
                        <Text style={styles.bulletItem}>• Income is straightforward and verifiable</Text>
                        <Text style={styles.bulletItem}>• No disputes or legal documents received</Text>
                        <Text style={styles.bulletItem}>• Cooperative relationship</Text>
                        <Text style={styles.frameworkAction}>→ Use free calculator, let Services Australia handle it</Text>
                    </View>

                    <View style={styles.frameworkCard}>
                        <Text style={styles.frameworkTitle}>🟡 Get Initial Consultation:</Text>
                        <Text style={styles.bulletItem}>• One parent is self-employed</Text>
                        <Text style={styles.bulletItem}>• Income seems inconsistent with lifestyle</Text>
                        <Text style={styles.bulletItem}>• Considering Change of Assessment</Text>
                        <Text style={styles.bulletItem}>• Moderate conflict but manageable</Text>
                        <Text style={styles.frameworkAction}>→ Pay $200-400 for strategic advice, then decide</Text>
                    </View>

                    <View style={styles.frameworkCard}>
                        <Text style={styles.frameworkTitle}>🔴 Hire Lawyer Immediately:</Text>
                        <Text style={styles.bulletItem}>• Complex income (trusts, companies, overseas)</Text>
                        <Text style={styles.bulletItem}>• Received legal documents or court summons</Text>
                        <Text style={styles.bulletItem}>• High conflict, threats, or false allegations</Text>
                        <Text style={styles.bulletItem}>• Significant financial stakes (high income difference)</Text>
                        <Text style={styles.frameworkAction}>→ Don't delay—hire within 7 days</Text>
                    </View>

                    <ContextualWizard
                        preselectedFactors={[]}
                        highlightedFactors={['income_resources_not_reflected', 'court_order_existing', 'property_settlement', 'international_jurisdiction']}
                        blogTopic="when_to_hire"
                        ctaText="Speak to a Specialist – No Obligation"
                        analyticsSource="blog_when_to_hire_lawyer"
                        formReason="special_circumstances"
                        title="Does Your Situation Require Legal Help?"
                        description="Select any factors that apply. Most lawyers offer free initial consultations to assess your case."
                    />

                    {/* FAQ */}
                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <FAQItem
                        question="When should I hire a family lawyer for child support in Australia?"
                        answer="Hire a family lawyer when: 1) The other parent is self-employed or has complex income (trusts, companies, overseas assets), 2) You receive a Change of Assessment application or court summons, or 3) Your case involves high conflict (threats, false allegations, parental alienation). These situations have significant financial and legal consequences that require professional representation."
                    />

                    <FAQItem
                        question="How much does a family lawyer cost for child support in Australia?"
                        answer="Family lawyers charge $300-600 per hour depending on experience and location. Initial consultations cost $200-400. Simple matters may cost $2,000-5,000 total, while complex cases (Change of Assessment, court proceedings) can cost $10,000-30,000+. Many lawyers offer fixed-fee packages for specific services."
                    />

                    <FAQItem
                        question="Can I handle child support without a lawyer?"
                        answer="Yes, if your case is straightforward: both parents are wage earners, income is verifiable, no disputes about care arrangements, and both parties cooperate. Use the free calculator to estimate payments and Services Australia handles administration. However, complex income, disputes, or legal proceedings require professional advice."
                    />

                    <FAQItem
                        question="What happens if I don't hire a lawyer when I should?"
                        answer="Without a lawyer in complex cases, you risk: missing legal deadlines (resulting in default judgments), accepting unfair assessments (costing thousands per year), failing to identify hidden income, and making procedural errors that weaken your case. The financial cost of not hiring a lawyer often exceeds the legal fees."
                    />

                    <FAQItem
                        question="Can I get Legal Aid for child support cases?"
                        answer="Legal Aid is available for child support cases in limited circumstances, primarily when there's family violence or the case involves complex legal issues. Eligibility is income-tested. Most child support disputes don't qualify for Legal Aid, but it's worth checking your state's Legal Aid office."
                    />

                    {/* Connect with Lawyers CTA */}
                    <View style={styles.finalCtaSection}>
                        <Text style={styles.finalCtaTitle}>Connect With Experienced Family Lawyers</Text>
                        <Text style={styles.finalCtaText}>
                            We connect parents with family lawyers who specialize in child support disputes.
                            Our partner lawyers have experience with complex income assessment, Change of Assessment
                            applications, and high-conflict cases.
                        </Text>
                        <View style={styles.finalCtaTrustSignals}>
                            <Text style={styles.finalCtaTrustItem}>✓ Most lawyers respond within 24 hours</Text>
                            <Text style={styles.finalCtaTrustItem}>✓ Initial consultations often free or low-cost</Text>
                            <Text style={styles.finalCtaTrustItem}>✓ No obligation to proceed</Text>
                            <Text style={styles.finalCtaTrustItem}>✓ Your information remains confidential</Text>
                        </View>
                        <Pressable
                            style={[styles.primaryButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.primaryButtonText}>Find a Family Lawyer</Text>
                        </Pressable>
                        <Text style={styles.finalCtaDisclaimer}>
                            Free matching service. We connect you with lawyers in your area.
                        </Text>
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

    quickAnswerBox: { backgroundColor: '#2563EB', borderRadius: 12, padding: 20, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    quickAnswerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
    quickAnswerText: { fontSize: 15, lineHeight: 24, color: '#ffffff', textAlign: 'center' },

    greenCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    greenCardTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },

    calculatorButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 20, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    calculatorButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },

    dangerCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    dangerCardTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },

    exampleCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }) },
    exampleTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    exampleText: { fontSize: 14, lineHeight: 22, color: '#475569', marginBottom: 8 },
    exampleResult: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginTop: 8, marginBottom: 4 },
    exampleCalc: { fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: '#64748b', marginBottom: 4, paddingLeft: 8 },
    exampleImpact: { fontSize: 14, color: '#475569', fontStyle: 'italic', marginTop: 8 },

    listCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },

    ctaButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 20, marginBottom: 16, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    ctaButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },

    urgentCard: { backgroundColor: '#dbeafe', borderRadius: 12, borderWidth: 2, borderColor: '#3b82f6', padding: 20, marginBottom: 16, ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    urgentCardTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 12 },

    warningBox: { backgroundColor: '#eff6ff', borderRadius: 12, borderWidth: 1, borderColor: '#bfdbfe', padding: 16, marginBottom: 16 },
    warningTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    warningText: { fontSize: 15, lineHeight: 24, color: '#1e3a8a' },

    costCard: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    costTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },
    costText: { fontSize: 14, lineHeight: 22, color: '#475569', marginBottom: 6 },

    pricingCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 }) },
    pricingTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    pricingItem: { fontSize: 14, lineHeight: 22, color: '#475569', marginBottom: 4 },

    tipCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    tipTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },

    checklistCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    checklistTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },

    redFlagCard: { backgroundColor: '#f1f5f9', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#cbd5e1' },
    redFlagTitle: { fontSize: 16, fontWeight: '600', color: '#475569', marginBottom: 12 },

    frameworkCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 }) },
    frameworkTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    frameworkAction: { fontSize: 15, fontWeight: '600', color: '#2563EB', marginTop: 8, fontStyle: 'italic' },

    faqItem: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    faqQuestion: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    faqAnswer: { fontSize: 15, lineHeight: 24, color: '#475569' },

    finalCtaSection: { backgroundColor: '#1e3a8a', borderRadius: 12, padding: 28, marginTop: 32, alignItems: 'center', ...createShadow({ shadowColor: '#1e3a8a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    finalCtaTitle: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 12, textAlign: 'center' },
    finalCtaText: { fontSize: 16, lineHeight: 26, color: '#bfdbfe', marginBottom: 24, textAlign: 'center' },
    primaryButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 32, marginBottom: 12, ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }) },
    primaryButtonText: { color: '#1e3a8a', fontSize: 18, fontWeight: '700' },
    finalCtaDisclaimer: { fontSize: 13, color: '#bfdbfe', textAlign: 'center', fontStyle: 'italic' },

    // Trust box styles (for hidden income CTA)
    trustBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, marginTop: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }) },
    trustTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },
    trustText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8 },
    trustButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 20, marginTop: 16, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    trustButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },

    // Urgent CTA box styles (for legal documents CTA)
    urgentCtaBox: { backgroundColor: '#dbeafe', borderRadius: 12, borderWidth: 2, borderColor: '#3b82f6', padding: 20, marginTop: 16, marginBottom: 16, ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    urgentCtaTitle: { fontSize: 18, fontWeight: '700', color: '#1e3a8a', marginBottom: 12, textAlign: 'center' },
    urgentCtaText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 12, textAlign: 'center' },
    urgentFeatures: { marginBottom: 16 },
    urgentCtaButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 16, paddingHorizontal: 24, marginBottom: 12, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 }) },
    urgentCtaButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
    urgentCtaDisclaimer: { fontSize: 13, color: '#64748b', textAlign: 'center', fontStyle: 'italic' },

    // Info box styles (for special circumstances CTA)
    infoBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, marginTop: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
    infoTitle: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 12 },
    infoText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 16 },
    infoButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }) },
    infoButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },

    // Inline link style (for internal links)
    inlineLink: { color: '#2563EB', fontWeight: '600', textDecorationLine: 'underline' },

    // Final CTA trust signals
    finalCtaTrustSignals: { marginBottom: 20, alignSelf: 'stretch' },
    finalCtaTrustItem: { fontSize: 14, lineHeight: 22, color: '#bfdbfe', marginBottom: 6, textAlign: 'center' },

    // Table styles
    tableContainer: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#e2e8f0', ...createShadow({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }) },
    tableTitle: { fontSize: 18, fontWeight: '700', color: '#1e3a8a', marginBottom: 16, textAlign: 'center' },
    tableHeaderRow: { flexDirection: 'row', backgroundColor: '#eff6ff', borderRadius: 8, padding: 12, marginBottom: 8 },
    tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    tableRowAlt: { backgroundColor: '#f8fafc' },
    tableCell: { fontSize: 14, lineHeight: 20, color: '#475569', paddingHorizontal: 4 },
    tableHeaderCell: { fontWeight: '700', color: '#1e3a8a', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 },
});
