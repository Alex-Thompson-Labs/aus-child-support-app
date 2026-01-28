import { ContextualWizard } from '@/src/components/blog/ContextualWizard';
import { PageSEO } from '@/src/components/seo/PageSEO';
import { MAX_CALCULATOR_WIDTH, isWeb, webClickableStyles } from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// FAQ Schema for rich results
const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'How long do I have to object to a child support assessment?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'You have 28 days from the date you receive the assessment notice to lodge an objection with Services Australia. This deadline is strict. If you miss it, you may need to apply for an extension with a valid reason, or appeal directly to the Administrative Review Tribunal (ART).',
            },
        },
        {
            '@type': 'Question',
            name: 'What are valid grounds for objecting to a child support assessment?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Valid grounds include: incorrect income information, wrong care percentage, errors in number of children, incorrect relevant dependent allowances, miscalculated multi-case adjustments, or administrative errors by Services Australia. You cannot object simply because you think the amount is too high—you must identify a specific error.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I stop paying child support while my objection is being reviewed?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. You must continue paying the assessed amount while your objection is being reviewed. If your objection is successful and the amount is reduced, you may receive a credit for overpayments. If you stop paying, you will accrue debt and face enforcement action.',
            },
        },
        {
            '@type': 'Question',
            name: 'What happens if my objection is rejected?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'If Services Australia rejects your objection, you have 28 days to appeal to the Administrative Review Tribunal (ART). The ART is an independent body that reviews child support decisions. You can present evidence and attend a hearing. If the ART also rejects your appeal, you can apply for a second review within the ART.',
            },
        },
    ],
};

// Article schema
const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Object to a Child Support Assessment in Australia',
    description: 'Received an unfair child support assessment? Learn how to object within 28 days, what evidence you need, and when to appeal to SSAT.',
    datePublished: '2026-01-24',
    dateModified: '2026-01-24',
    author: {
        '@type': 'Organization',
        name: 'AusChildSupport',
    },
};

export default function ObjectToChildSupportAssessmentBlogPost() {
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
                title="How to Object to Child Support Assessment Australia 2026"
                description="28-day deadline to object—miss it and you're stuck. See valid grounds + evidence requirements. SSAT appeal process explained. Act now to preserve your rights."
                canonicalPath="/blog/object-to-child-support-assessment"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Challenge Assessment' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, webContainerStyle]}
                >
                    {/* Article Header */}
                    <View style={styles.articleHeader}>
                        <Text style={styles.category}>Child Support</Text>
                        <Text
                            style={styles.h1}
                            accessibilityRole="header"
                            // @ts-ignore
                            aria-level="1"
                        >
                            How to Challenge an Unfair Child Support Assessment in Australia
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026 • Updated January 27, 2026</Text>
                    </View>

                    {/* Introduction */}
                    <Text style={styles.intro}>
                        You've received your child support assessment from Services Australia. The amount looks wrong.
                        Maybe they've used incorrect income figures, miscalculated your care percentage, or made an
                        administrative error.
                    </Text>

                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            Disagree with your assessment? You have 28 days to object to Services Australia. Provide 
                            evidence of errors or special circumstances. If rejected, appeal to SSAT. Calculate your 
                            current amount below.
                        </Text>
                        <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.quickAnswerButtonText}>Calculate Correct Amount →</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.paragraph}>
                        You have the right to object to a child support assessment in Australia. But you need to act
                        fast—you only have 28 days from the date you receive the notice.
                    </Text>

                    <Text style={styles.paragraph}>
                        This guide explains how to object to a child support assessment, what grounds are valid, what
                        evidence you need, and what happens if your objection is rejected.
                    </Text>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⏰ Critical Deadline:</Text>
                        <Text style={styles.warningText}>
                            You have 28 days from receiving your assessment notice to lodge an objection. This deadline
                            is strict. Mark it on your calendar immediately.
                        </Text>
                    </View>

                    {/* Section 1: When Can You Object */}
                    <Text
                        style={styles.h2}
                        accessibilityRole="header"
                        // @ts-ignore
                        aria-level="2"
                    >
                        When Can You Object to a Child Support Assessment?
                    </Text>

                    <Text style={styles.paragraph}>
                        You can object to a child support assessment if you believe Services Australia made an error
                        in calculating the amount. But you can't object simply because you think the amount is too high.
                    </Text>

                    <Text style={styles.h3} accessibilityRole="header">Valid Grounds for Objection</Text>

                    <View style={styles.groundCard}>
                        <Text style={styles.groundTitle}>1. Incorrect Income Information</Text>
                        <Text style={styles.groundDesc}>
                            Services Australia used the wrong taxable income, didn't account for income changes, or
                            included income that shouldn't be counted.
                        </Text>
                    </View>

                    <View style={styles.groundCard}>
                        <Text style={styles.groundTitle}>2. Wrong Care Percentage</Text>
                        <Text style={styles.groundDesc}>
                            The assessment doesn't reflect the actual number of nights each parent has the children,
                            or doesn't account for a recent care arrangement change.
                        </Text>
                    </View>

                    <View style={styles.groundCard}>
                        <Text style={styles.groundTitle}>3. Errors in Number of Children</Text>
                        <Text style={styles.groundDesc}>
                            The assessment includes children who shouldn't be included, or excludes children who should be.
                        </Text>
                    </View>

                    <View style={styles.groundCard}>
                        <Text style={styles.groundTitle}>4. Incorrect Relevant Dependent Allowances</Text>
                        <Text style={styles.groundDesc}>
                            Services Australia didn't account for other children you support, or calculated the
                            allowance incorrectly.
                        </Text>
                    </View>

                    <View style={styles.groundCard}>
                        <Text style={styles.groundTitle}>5. Multi-Case Calculation Errors</Text>
                        <Text style={styles.groundDesc}>
                            If you have children from multiple relationships, the multi-case formula may have been
                            applied incorrectly.
                        </Text>
                    </View>

                    <View style={styles.groundCard}>
                        <Text style={styles.groundTitle}>6. Administrative Errors</Text>
                        <Text style={styles.groundDesc}>
                            Services Australia made a clerical mistake, used outdated information, or misapplied the formula.
                        </Text>
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>💡 Not Sure If Your Assessment Is Correct?</Text>
                        <Text style={styles.infoText}>
                            Use our free calculator to check if the amount matches what the formula should produce.
                            If there's a significant difference, you may have grounds for an objection.
                        </Text>
                        <Pressable
                            style={[styles.infoButton, isWeb && webClickableStyles]}
                            accessibilityRole="link" onPress={() => router.push('/')}
                        >
                            <Text style={styles.infoButtonText}>Check Your Assessment →</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">What You Cannot Object To</Text>

                    <Text style={styles.paragraph}>
                        You cannot object to an assessment simply because:
                    </Text>

                    <Text style={styles.bulletItem}>• You think the amount is too high (without identifying a specific error)</Text>
                    <Text style={styles.bulletItem}>• You disagree with the child support formula itself</Text>
                    <Text style={styles.bulletItem}>• You can't afford to pay the assessed amount</Text>
                    <Text style={styles.bulletItem}>• The other parent isn't spending the money on the children</Text>
                    <Text style={styles.bulletItem}>• You want a Change of Assessment (that's a different process)</Text>

                    <Text style={styles.paragraph}>
                        If your situation involves special circumstances not captured by the formula (like hidden income,
                        high contact costs, or special needs), you need to apply for a{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/special-circumstances')}
                        >
                            Change of Assessment
                        </Text>
                        {' '}instead of lodging an objection. Learn more about{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/child-support-reduction-strategies')}
                        >
                            reduction strategies
                        </Text>
                        {' '}if you're seeking to lower your assessment.
                    </Text>

                    {/* Section 2: The 28-Day Deadline */}
                    <Text style={styles.h2} accessibilityRole="header">
                        The 28-Day Deadline: Why It Matters
                    </Text>

                    <Text style={styles.paragraph}>
                        When Services Australia issues a child support assessment, you have 28 days from the date you
                        receive the notice to lodge an objection. This deadline is strict and non-negotiable in most cases.
                    </Text>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ The Clock Starts When You Receive the Notice</Text>
                        <Text style={styles.warningText}>
                            Services Australia considers you to have received the notice 7 days after they send it
                            (for mail) or immediately (for electronic notices). Don't assume you have 28 days from
                            when you actually read it.
                        </Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">What If You Miss the Deadline?</Text>

                    <Text style={styles.paragraph}>
                        If you miss the 28-day deadline, you have two options:
                    </Text>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Option 1</Text>
                        <Text style={styles.stepTitle}>Apply for an Extension</Text>
                        <Text style={styles.stepDesc}>
                            You can ask Services Australia for an extension if you have a valid reason for missing the
                            deadline (e.g., serious illness, family emergency, didn't receive the notice). Extensions
                            are granted at their discretion.
                        </Text>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Option 2</Text>
                        <Text style={styles.stepTitle}>Appeal Directly to ART</Text>
                        <Text style={styles.stepDesc}>
                            You can skip the objection process and appeal directly to the Administrative Review
                            Tribunal (ART) within 13 weeks of the assessment. The ART has more flexibility to
                            consider late applications.
                        </Text>
                    </View>

                    {/* Section 3: How to Lodge */}
                    <Text style={styles.h2} accessibilityRole="header">
                        How to Lodge an Objection
                    </Text>

                    <Text style={styles.paragraph}>
                        Lodging an objection is straightforward, but you need to be thorough and provide evidence.
                    </Text>

                    <Text style={styles.h3} accessibilityRole="header">Step 1: Gather Your Evidence</Text>

                    <Text style={styles.paragraph}>
                        Before you lodge your objection, collect all relevant documents:
                    </Text>

                    <Text style={styles.bulletItem}>• The assessment notice you're objecting to</Text>
                    <Text style={styles.bulletItem}>• Tax returns or income statements showing correct income</Text>
                    <Text style={styles.bulletItem}>• Court orders or parenting plans showing care arrangements</Text>
                    <Text style={styles.bulletItem}>• Calendar or diary showing actual care provided</Text>
                    <Text style={styles.bulletItem}>• Birth certificates for relevant dependent children</Text>
                    <Text style={styles.bulletItem}>• Any correspondence with Services Australia about the assessment</Text>

                    <Text style={styles.h3} accessibilityRole="header">Step 2: Write Your Objection</Text>

                    <Text style={styles.paragraph}>
                        Your objection should clearly state:
                    </Text>

                    <Text style={styles.bulletItem}>• Which assessment you're objecting to (include the reference number)</Text>
                    <Text style={styles.bulletItem}>• What specific error Services Australia made</Text>
                    <Text style={styles.bulletItem}>• What the correct information should be</Text>
                    <Text style={styles.bulletItem}>• What evidence supports your claim</Text>

                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightTitle}>Example Objection Statement:</Text>
                        <Text style={styles.highlightText}>
                            "I object to the child support assessment dated [date] (reference: [number]). The assessment
                            uses my 2024 taxable income of $85,000, but my actual income for 2025 is $65,000 due to
                            reduced work hours. I have attached my recent payslips and a letter from my employer
                            confirming the change. I request the assessment be recalculated using my current income."
                        </Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Step 3: Submit Your Objection</Text>

                    <Text style={styles.paragraph}>
                        You can lodge your objection three ways:
                    </Text>

                    <View style={styles.methodCard}>
                        <Text style={styles.methodTitle}>📱 Online (Fastest)</Text>
                        <Text style={styles.methodDesc}>
                            Log in to your myGov account linked to Services Australia. Go to Child Support →
                            Correspondence → Lodge an objection. Upload your evidence as attachments.
                        </Text>
                    </View>

                    <View style={styles.methodCard}>
                        <Text style={styles.methodTitle}>📞 Phone</Text>
                        <Text style={styles.methodDesc}>
                            Call Services Australia on 131 272. Tell them you want to lodge an objection. They'll
                            record your objection and tell you how to submit evidence.
                        </Text>
                    </View>

                    <View style={styles.methodCard}>
                        <Text style={styles.methodTitle}>✉️ Mail</Text>
                        <Text style={styles.methodDesc}>
                            Write your objection and mail it with copies of your evidence to: Child Support,
                            PO Box 7800, Canberra BC ACT 2610. Send via registered post to prove you met the deadline.
                        </Text>
                    </View>

                    {/* Section 4: What Happens Next */}
                    <Text style={styles.h2} accessibilityRole="header">
                        What Happens After You Lodge an Objection?
                    </Text>

                    <Text style={styles.paragraph}>
                        Once Services Australia receives your objection, here's what to expect:
                    </Text>

                    <View style={styles.timelineCard}>
                        <Text style={styles.timelineStep}>Week 1-2</Text>
                        <Text style={styles.timelineTitle}>Acknowledgment</Text>
                        <Text style={styles.timelineDesc}>
                            Services Australia will send you a letter confirming they received your objection.
                            They'll assign it to an objections officer for review.
                        </Text>
                    </View>

                    <View style={styles.timelineCard}>
                        <Text style={styles.timelineStep}>Week 2-4</Text>
                        <Text style={styles.timelineTitle}>Investigation</Text>
                        <Text style={styles.timelineDesc}>
                            The objections officer reviews your evidence, checks their records, and may contact you
                            or the other parent for additional information.
                        </Text>
                    </View>

                    <View style={styles.timelineCard}>
                        <Text style={styles.timelineStep}>Week 4-8</Text>
                        <Text style={styles.timelineTitle}>Decision</Text>
                        <Text style={styles.timelineDesc}>
                            Services Australia makes a decision and sends you a written notice explaining whether
                            your objection was allowed, partially allowed, or disallowed.
                        </Text>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ You Must Keep Paying</Text>
                        <Text style={styles.warningText}>
                            While your objection is being reviewed, you must continue paying the assessed amount.
                            If you stop paying, you'll accrue debt and face enforcement action. If your objection
                            is successful and the amount is reduced, you'll receive a credit for overpayments.
                        </Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Possible Outcomes</Text>

                    <View style={styles.outcomeCard}>
                        <Text style={styles.outcomeTitle}>✅ Objection Allowed</Text>
                        <Text style={styles.outcomeDesc}>
                            Services Australia agrees with you and issues a new assessment with the corrected amount.
                            Any overpayments are credited to your account.
                        </Text>
                    </View>

                    <View style={styles.outcomeCard}>
                        <Text style={styles.outcomeTitle}>⚖️ Objection Partially Allowed</Text>
                        <Text style={styles.outcomeDesc}>
                            Services Australia agrees with some of your points but not all. The assessment is adjusted
                            but may not be exactly what you requested.
                        </Text>
                    </View>

                    <View style={styles.outcomeCard}>
                        <Text style={styles.outcomeTitle}>❌ Objection Disallowed</Text>
                        <Text style={styles.outcomeDesc}>
                            Services Australia maintains the original assessment. You have 28 days to appeal to the
                            Administrative Review Tribunal (ART) if you disagree.
                        </Text>
                    </View>

                    {/* Section 5: ART Appeals */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Appealing to the Administrative Review Tribunal (ART)
                    </Text>

                    <Text style={styles.paragraph}>
                        If Services Australia rejects your objection, you can appeal to the ART. The ART is an
                        independent tribunal that reviews child support decisions. The ART replaced the former AAT
                        and SSAT in October 2024.
                    </Text>

                    <Text style={styles.h3} accessibilityRole="header">How ART Appeals Work</Text>

                    <Text style={styles.bulletItem}>• You have 28 days from the objection decision to lodge an ART appeal</Text>
                    <Text style={styles.bulletItem}>• The ART reviews all evidence and may request additional documents</Text>
                    <Text style={styles.bulletItem}>• You can attend a hearing (in person, by phone, or video) to present your case</Text>
                    <Text style={styles.bulletItem}>• The other parent may also attend and present their view</Text>
                    <Text style={styles.bulletItem}>• The ART makes an independent decision based on the evidence</Text>
                    <Text style={styles.bulletItem}>• ART decisions typically take 8-12 weeks</Text>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>💡 ART Appeals Are Free</Text>
                        <Text style={styles.infoText}>
                            There's no fee to lodge an ART appeal. You don't need a lawyer, but many people find
                            legal representation helpful, especially for complex cases.
                        </Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">If ART Also Rejects Your Appeal</Text>

                    <Text style={styles.paragraph}>
                        If the ART upholds Services Australia's decision, you may be able to apply for a second review
                        within the ART for certain decisions (such as care percentage decisions). For other decisions,
                        you can appeal to the Federal Court on a question of law. Court appeals are highly formal and
                        legal representation is strongly recommended.
                    </Text>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>💡 When Legal Help Makes the Difference</Text>
                        <Text style={styles.infoText}>
                            ART appeals have significantly higher success rates with legal representation.
                            Lawyers know how to present evidence effectively, cross-examine witnesses, and argue legal points.
                        </Text>
                        <Pressable
                            style={[styles.infoButton, isWeb && webClickableStyles]}
                            accessibilityRole="link" onPress={() => router.push('/blog/when-to-hire-family-lawyer')}
                        >
                            <Text style={styles.infoButtonText}>When to Hire a Lawyer →</Text>
                        </Pressable>
                    </View>

                    {/* Section 6: When to Get Legal Help */}
                    <Text style={styles.h2} accessibilityRole="header">
                        When to Get Legal Help
                    </Text>

                    <Text style={styles.paragraph}>
                        You don't need a lawyer to lodge an objection, but legal advice can significantly improve
                        your chances of success in certain situations.
                    </Text>

                    <Text style={styles.h3} accessibilityRole="header">Consider Legal Help If:</Text>

                    <Text style={styles.bulletItem}>• The assessment involves complex income calculations (self-employment, trusts, overseas income)</Text>
                    <Text style={styles.bulletItem}>• You're objecting to multiple issues at once</Text>
                    <Text style={styles.bulletItem}>• The other parent has legal representation</Text>
                    <Text style={styles.bulletItem}>• Your objection was rejected and you're appealing to the ART</Text>
                    <Text style={styles.bulletItem}>• The financial stakes are high (large assessment amounts)</Text>
                    <Text style={styles.bulletItem}>• You're not confident presenting your case clearly</Text>

                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightTitle}>What a Lawyer Can Do:</Text>
                        <Text style={styles.bulletItem}>• Review your assessment and identify all errors</Text>
                        <Text style={styles.bulletItem}>• Draft a comprehensive objection with proper legal language</Text>
                        <Text style={styles.bulletItem}>• Gather and organize evidence effectively</Text>
                        <Text style={styles.bulletItem}>• Represent you at ART hearings</Text>
                        <Text style={styles.bulletItem}>• Negotiate with the other parent's lawyer</Text>
                        <Text style={styles.bulletItem}>• Advise whether a Change of Assessment application is more appropriate</Text>
                    </View>

                    <View style={styles.ctaSection}>
                        <Text style={styles.ctaTitle}>Need Help With Your Objection?</Text>
                        <Text style={styles.ctaText}>
                            Connect with experienced family lawyers who specialize in child support objections and appeals.
                            Most offer free initial consultations to assess your case.
                        </Text>
                        <View style={styles.trustSignals}>
                            <Text style={styles.trustItem}>✓ Free initial consultation</Text>
                            <Text style={styles.trustItem}>✓ No obligation to proceed</Text>
                            <Text style={styles.trustItem}>✓ Confidential case review</Text>
                        </View>
                        <Pressable
                            style={[styles.primaryButton, isWeb && webClickableStyles]}
                            accessibilityRole="link" onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=assessment_objection')}
                            accessibilityLabel="Get legal help with objection"
                        >
                            <Text style={styles.primaryButtonText}>Get Legal Help</Text>
                        </Pressable>
                    </View>

                    {/* Section 7: Common Mistakes */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Common Mistakes to Avoid
                    </Text>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeTitle}>❌ Missing the 28-Day Deadline</Text>
                        <Text style={styles.mistakeDesc}>
                            This is the most common mistake. Mark your calendar immediately when you receive an
                            assessment. Don't wait until the last minute.
                        </Text>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeTitle}>❌ Objecting Without Evidence</Text>
                        <Text style={styles.mistakeDesc}>
                            Saying "the amount is wrong" isn't enough. You need documents proving the error—tax returns,
                            payslips, court orders, care calendars.
                        </Text>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeTitle}>❌ Stopping Payments During Review</Text>
                        <Text style={styles.mistakeDesc}>
                            You must keep paying while your objection is reviewed. Stopping payments creates debt
                            and enforcement action, even if you're eventually proven right.
                        </Text>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeTitle}>❌ Confusing Objections with Change of Assessment</Text>
                        <Text style={styles.mistakeDesc}>
                            An objection is for errors in the calculation. A Change of Assessment is for special
                            circumstances not captured by the formula. Using the wrong process wastes time.
                        </Text>
                    </View>

                    <View style={styles.mistakeCard}>
                        <Text style={styles.mistakeTitle}>❌ Being Emotional Instead of Factual</Text>
                        <Text style={styles.mistakeDesc}>
                            Focus on facts and evidence, not emotions or complaints about the other parent.
                            Services Australia only cares about whether the calculation is correct.
                        </Text>
                    </View>

                    {/* Contextual Wizard */}
                    <ContextualWizard
                        preselectedFactors={['change_circumstances']}
                        highlightedFactors={['income_resources_not_reflected', 'high_costs']}
                        blogTopic="object_assessment"
                        ctaText="Request a Change of Assessment"
                        analyticsSource="blog_object_to_child_support_assessment"
                        formReason="special_circumstances"
                        title="Ready to Challenge Your Assessment?"
                        description="Change of Assessment applications have strong success rates when properly prepared. Select any factors that apply to your situation."
                    />

                    {/* FAQ Section */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Frequently Asked Questions
                    </Text>

                    <FAQItem
                        question="How long do I have to object to a child support assessment?"
                        answer="You have 28 days from the date you receive the assessment notice to lodge an objection with Services Australia. This deadline is strict. If you miss it, you may need to apply for an extension with a valid reason, or appeal directly to the Administrative Review Tribunal (ART)."
                    />

                    <FAQItem
                        question="What are valid grounds for objecting to a child support assessment?"
                        answer="Valid grounds include: incorrect income information, wrong care percentage, errors in number of children, incorrect relevant dependent allowances, miscalculated multi-case adjustments, or administrative errors by Services Australia. You cannot object simply because you think the amount is too high—you must identify a specific error."
                    />

                    <FAQItem
                        question="Can I stop paying child support while my objection is being reviewed?"
                        answer="No. You must continue paying the assessed amount while your objection is being reviewed. If your objection is successful and the amount is reduced, you may receive a credit for overpayments. If you stop paying, you will accrue debt and face enforcement action."
                    />

                    <FAQItem
                        question="What happens if my objection is rejected?"
                        answer="If Services Australia rejects your objection, you have 28 days to appeal to the Administrative Review Tribunal (ART). The ART is an independent body that reviews child support decisions. You can present evidence and attend a hearing. If the ART also rejects your appeal, you can apply for a second review within the ART for certain decisions, or appeal to the Federal Court on a question of law."
                    />

                    <FAQItem
                        question="Do I need a lawyer to object to a child support assessment?"
                        answer="No, you don't need a lawyer to lodge an objection. Many people successfully object without legal representation. However, a lawyer can help with complex cases, ART appeals, or situations where the other parent has legal representation. Legal advice is particularly valuable if your objection involves complicated income calculations or multiple issues."
                    />

                    {/* Conclusion */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Key Takeaways
                    </Text>

                    <Text style={styles.paragraph}>
                        Objecting to a child support assessment is your right when Services Australia makes an error.
                        But success depends on acting quickly, providing solid evidence, and understanding the process.
                    </Text>

                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightTitle}>Remember:</Text>
                        <Text style={styles.bulletItem}>• You have 28 days from receiving the notice—don't miss this deadline</Text>
                        <Text style={styles.bulletItem}>• You need specific grounds (an error), not just disagreement with the amount</Text>
                        <Text style={styles.bulletItem}>• Gather evidence before you lodge your objection</Text>
                        <Text style={styles.bulletItem}>• Keep paying while your objection is reviewed</Text>
                        <Text style={styles.bulletItem}>• If rejected, you can appeal to the ART within 28 days</Text>
                        <Text style={styles.bulletItem}>• Legal help can improve your chances, especially for complex cases</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        Before you object, verify that your assessment is actually wrong. Use our calculator to check
                        if the amount matches what the formula should produce. If there's a significant difference,
                        you likely have grounds for an objection.
                    </Text>

                    {/* Final CTA */}
                    <View style={styles.finalCtaSection}>
                        <Text style={styles.ctaTitle}>Next Steps</Text>
                        <Text style={styles.ctaText}>
                            Check if your assessment is correct, or get help from experienced family lawyers.
                        </Text>
                        <View style={styles.ctaButtons}>
                            <Pressable
                                style={[styles.primaryButton, isWeb && webClickableStyles]}
                                accessibilityRole="link" onPress={() => router.push('/')}
                                accessibilityLabel="Use calculator"
                            >
                                <Text style={styles.primaryButtonText}>Check Your Assessment</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.secondaryButton, isWeb && webClickableStyles]}
                                accessibilityRole="link" onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=assessment_objection')}
                                accessibilityLabel="Get legal help"
                            >
                                <Text style={styles.secondaryButtonText}>Get Legal Help</Text>
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

    quickAnswerBox: { backgroundColor: '#2563eb', borderRadius: 12, padding: 20, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    quickAnswerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
    quickAnswerText: { fontSize: 15, lineHeight: 24, color: '#ffffff', marginBottom: 16, textAlign: 'center' },
    quickAnswerButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
    quickAnswerButtonText: { color: '#2563eb', fontSize: 16, fontWeight: '700' },

    bulletItem: {
        fontSize: 15,
        lineHeight: 24,
        color: '#475569',
        marginBottom: 8,
        paddingLeft: 8,
    },
    warningBox: {
        backgroundColor: '#eff6ff',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
        padding: 16,
        marginBottom: 16,
    },
    warningTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e40af',
        marginBottom: 8,
    },
    warningText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#475569',
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
        fontStyle: 'italic',
    },
    infoBox: {
        backgroundColor: '#eff6ff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#bfdbfe',
        padding: 16,
        marginBottom: 16,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e40af',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#475569',
        marginBottom: 12,
    },
    infoButton: {
        backgroundColor: '#2563eb',
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
    groundCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
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
    groundTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 6,
    },
    groundDesc: {
        fontSize: 14,
        lineHeight: 20,
        color: '#64748b',
    },
    stepCard: {
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
    stepNumber: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2563EB',
        marginBottom: 4,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 8,
    },
    stepDesc: {
        fontSize: 15,
        lineHeight: 22,
        color: '#475569',
    },
    methodCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
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
    methodTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 8,
    },
    methodDesc: {
        fontSize: 14,
        lineHeight: 20,
        color: '#64748b',
    },
    timelineCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#2563eb',
        ...createShadow({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 3,
            elevation: 2,
        }),
    },
    timelineStep: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2563eb',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    timelineTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 6,
    },
    timelineDesc: {
        fontSize: 14,
        lineHeight: 20,
        color: '#64748b',
    },
    outcomeCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    outcomeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 6,
    },
    outcomeDesc: {
        fontSize: 14,
        lineHeight: 20,
        color: '#64748b',
    },
    mistakeCard: {
        backgroundColor: '#eff6ff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#dc2626',
    },
    mistakeTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e40af',
        marginBottom: 6,
    },
    mistakeDesc: {
        fontSize: 14,
        lineHeight: 20,
        color: '#475569',
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
    ctaSection: {
        backgroundColor: '#1e3a8a',
        borderRadius: 12,
        padding: 24,
        marginTop: 24,
        marginBottom: 24,
        alignItems: 'center',
    },
    finalCtaSection: {
        backgroundColor: '#eff6ff',
        borderRadius: 12,
        padding: 24,
        marginTop: 32,
        alignItems: 'center',
    },
    ctaTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 8,
        textAlign: 'center',
    },
    ctaText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#bfdbfe',
        marginBottom: 20,
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
    primaryButtonText: {
        color: '#1e3a8a',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    secondaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    inlineLink: {
        color: '#2563EB',
        textDecorationLine: isWeb ? 'underline' : 'none',
        fontWeight: '600',
    },
    trustSignals: {
        marginBottom: 16,
        alignItems: 'center',
    },
    trustItem: {
        fontSize: 14,
        color: '#bfdbfe',
        marginBottom: 4,
    },
});
