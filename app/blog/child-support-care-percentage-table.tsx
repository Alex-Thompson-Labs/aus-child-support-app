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
            name: 'How many nights is 50/50 custody in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '50/50 custody (equal shared care) is 182.5 nights per year for each parent. In practice, this is usually 182 or 183 nights. This equals exactly 50% care for child support purposes.',
            },
        },
        {
            '@type': 'Question',
            name: 'What is the 14% care threshold in child support?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'The 14% care threshold (52 nights per year) is when your care percentage starts reducing your child support liability. Below 14%, you pay full child support with no cost offset. At 14% or above, your cost percentage begins to reduce the amount you pay.',
            },
        },
        {
            '@type': 'Question',
            name: 'Do school holidays count towards care percentage?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Care percentage is calculated over the entire year, including school holidays. If you have your children during school holidays, those nights are added to your total annual care calculation. This is why many parents have different care percentages than they expect.',
            },
        },
        {
            '@type': 'Question',
            name: 'What happens if actual care differs from the assessment?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'If actual care differs from the assessed care by more than 14 nights per year (or 5% of care), either parent can apply to Services Australia to update the assessment. Keep accurate records of actual care provided, as you may need to prove the difference.',
            },
        },
    ],
};

// Article schema
const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Official Child Support Care Percentage Table (2026)',
    description: 'Complete care percentage table showing how nights per year convert to child support percentages. Includes thresholds, examples, and how care affects payments.',
    datePublished: '2026-01-24',
    dateModified: '2026-01-24',
    author: {
        '@type': 'Organization',
        name: 'AusChildSupport',
    },
};

export default function CarePercentageTableBlogPost() {
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
                title="Official Child Support Care Percentage Table (2026)"
                description="Complete care percentage table showing how nights per year convert to child support percentages. Includes thresholds, examples, and how care affects payments."
                canonicalPath="/blog/child-support-care-percentage-table"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Care Percentage Table' },
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
                        <Text style={styles.category}>Child Support</Text>
                        <Text 
                            style={styles.h1}
                            accessibilityRole="header"
                            // @ts-ignore
                            aria-level="1"
                        >
                            Official Child Support Care Percentage Table (2026)
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    {/* Introduction */}
                    <Text style={styles.intro}>
                        How many nights per year equals 50/50 custody? What about every second weekend? 
                        Care percentage determines who pays child support and how much.
                    </Text>

                    <Text style={styles.paragraph}>
                        This guide provides the official child support care percentage table used by Services Australia 
                        in 2026. You'll learn how to convert nights per year into care percentages, understand the 
                        critical thresholds, and see exactly how care affects your child support calculation.
                    </Text>

                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightTitle}>📊 Quick Reference:</Text>
                        <Text style={styles.bulletItem}>• 52 nights = 14% care (threshold for cost offset)</Text>
                        <Text style={styles.bulletItem}>• 128 nights = 35% care (regular care threshold)</Text>
                        <Text style={styles.bulletItem}>• 175 nights = 48% care (shared care threshold)</Text>
                        <Text style={styles.bulletItem}>• 183 nights = 50% care (equal shared care)</Text>
                        <Text style={styles.bulletItem}>• 190 nights = 52% care (majority care threshold)</Text>
                    </View>

                    {/* Section 1: The Official Table */}
                    <Text 
                        style={styles.h2}
                        accessibilityRole="header"
                        // @ts-ignore
                        aria-level="2"
                    >
                        The Official Care Percentage Table
                    </Text>

                    <Text style={styles.paragraph}>
                        Services Australia uses this table to convert the number of nights each parent has the children 
                        into a care percentage. This percentage then determines how child support is calculated.
                    </Text>

                    <View style={styles.tableContainer}>
                        <Text style={styles.tableTitle}>Common Care Arrangements</Text>
                        
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeaderCell}>Nights/Year</Text>
                            <Text style={styles.tableHeaderCell}>Care %</Text>
                            <Text style={styles.tableHeaderCell}>Typical Arrangement</Text>
                        </View>

                        <TableRow nights="0-51" percentage="0-13%" arrangement="Minimal contact" />
                        <TableRow nights="52" percentage="14%" arrangement="1 night per week" highlight />
                        <TableRow nights="73" percentage="20%" arrangement="1 night + alternate weekends" />
                        <TableRow nights="104" percentage="28%" arrangement="2 nights per week" />
                        <TableRow nights="128" percentage="35%" arrangement="Every second weekend + 1 weeknight" highlight />
                        <TableRow nights="146" percentage="40%" arrangement="3 nights per week" />
                        <TableRow nights="175" percentage="48%" arrangement="Alternate weeks (7/7)" highlight />
                        <TableRow nights="183" percentage="50%" arrangement="Equal shared care" highlight />
                        <TableRow nights="190" percentage="52%" arrangement="Slightly more than half" highlight />
                        <TableRow nights="219" percentage="60%" arrangement="4 nights per week" />
                        <TableRow nights="292" percentage="80%" arrangement="6 nights per week" />
                        <TableRow nights="313-365" percentage="86-100%" arrangement="Primary care" />
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>💡 Need Your Exact Care Percentage?</Text>
                        <Text style={styles.infoText}>
                            Our calculator automatically converts your care arrangement into the correct percentage 
                            and shows you exactly how it affects your child support.
                        </Text>
                        <Pressable
                            style={[styles.infoButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.infoButtonText}>Calculate Your Child Support →</Text>
                        </Pressable>
                    </View>

                    {/* Section 2: Critical Thresholds */}
                    <Text style={styles.h2} accessibilityRole="header">
                        The Four Critical Care Thresholds
                    </Text>

                    <Text style={styles.paragraph}>
                        Care percentage isn't just a number—specific thresholds dramatically change how child support 
                        is calculated. Understanding these thresholds is crucial for planning care arrangements.
                    </Text>

                    <View style={styles.thresholdCard}>
                        <Text style={styles.thresholdNumber}>14%</Text>
                        <View style={styles.thresholdContent}>
                            <Text style={styles.thresholdTitle}>Cost Offset Threshold (52 nights)</Text>
                            <Text style={styles.thresholdDesc}>
                                Below 14%: You pay full child support with no cost offset for your care.
                            </Text>
                            <Text style={styles.thresholdDesc}>
                                At 14% or above: Your cost percentage begins to reduce your child support liability.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.thresholdCard}>
                        <Text style={styles.thresholdNumber}>35%</Text>
                        <View style={styles.thresholdContent}>
                            <Text style={styles.thresholdTitle}>Regular Care Threshold (128 nights)</Text>
                            <Text style={styles.thresholdDesc}>
                                At 35% or above: You're considered to have "regular care" and your cost percentage 
                                significantly reduces your child support payments.
                            </Text>
                            <Text style={styles.thresholdDesc}>
                                Common arrangement: Every second weekend plus one weeknight.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.thresholdCard}>
                        <Text style={styles.thresholdNumber}>48%</Text>
                        <View style={styles.thresholdContent}>
                            <Text style={styles.thresholdTitle}>Shared Care Threshold (175 nights)</Text>
                            <Text style={styles.thresholdDesc}>
                                At 48% or above: You're in "shared care" territory. Child support may be minimal 
                                or the higher earner may pay the lower earner.
                            </Text>
                            <Text style={styles.thresholdDesc}>
                                Common arrangement: Alternating weeks (7 days on, 7 days off).
                            </Text>
                        </View>
                    </View>

                    <View style={styles.thresholdCard}>
                        <Text style={styles.thresholdNumber}>52%</Text>
                        <View style={styles.thresholdContent}>
                            <Text style={styles.thresholdTitle}>Majority Care Threshold (190 nights)</Text>
                            <Text style={styles.thresholdDesc}>
                                At 52% or above: You have majority care. If you also earn less, you'll likely 
                                receive child support rather than pay it.
                            </Text>
                            <Text style={styles.thresholdDesc}>
                                Just 8 more nights per year than 50/50 can flip who pays whom.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Why Thresholds Matter:</Text>
                        <Text style={styles.warningText}>
                            A difference of just a few nights per year can push you across a threshold and 
                            significantly change your child support. This is why accurate care records are critical.
                        </Text>
                    </View>

                    {/* Section 3: How to Count Nights */}
                    <Text style={styles.h2} accessibilityRole="header">
                        How to Count Nights Correctly
                    </Text>

                    <Text style={styles.paragraph}>
                        Services Australia has specific rules for counting nights. Getting this wrong can result 
                        in an incorrect assessment.
                    </Text>

                    <Text style={styles.h3} accessibilityRole="header">The Basic Rule</Text>

                    <View style={styles.ruleCard}>
                        <Text style={styles.ruleTitle}>A "night" counts when:</Text>
                        <Text style={styles.bulletItem}>• The child sleeps at your home overnight</Text>
                        <Text style={styles.bulletItem}>• You're responsible for the child's care during that night</Text>
                        <Text style={styles.bulletItem}>• The child wakes up at your home the next morning</Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Special Situations</Text>

                    <View style={styles.situationCard}>
                        <Text style={styles.situationTitle}>🏫 School Holidays</Text>
                        <Text style={styles.situationDesc}>
                            School holidays count towards your annual care total. If you have your children for 
                            2 weeks during summer holidays, that's 14 nights added to your yearly total.
                        </Text>
                    </View>

                    <View style={styles.situationCard}>
                        <Text style={styles.situationTitle}>🎄 Public Holidays & Special Days</Text>
                        <Text style={styles.situationDesc}>
                            Christmas, birthdays, and public holidays count as regular nights. If the child sleeps 
                            at your home, it counts—regardless of the occasion.
                        </Text>
                    </View>

                    <View style={styles.situationCard}>
                        <Text style={styles.situationTitle}>✈️ Holidays & Travel</Text>
                        <Text style={styles.situationDesc}>
                            If you take the children on holiday, those nights count towards your care percentage. 
                            This includes interstate or overseas trips.
                        </Text>
                    </View>

                    <View style={styles.situationCard}>
                        <Text style={styles.situationTitle}>🏥 Hospital or Medical Care</Text>
                        <Text style={styles.situationDesc}>
                            If a child is hospitalized during your care time, those nights still count towards 
                            your care percentage if you're the parent providing care at the hospital.
                        </Text>
                    </View>

                    <View style={styles.situationCard}>
                        <Text style={styles.situationTitle}>👵 Third-Party Care (Grandparents, etc.)</Text>
                        <Text style={styles.situationDesc}>
                            If the child stays with grandparents or other relatives during your scheduled care time, 
                            it still counts as your care—as long as you arranged it and remain responsible.
                        </Text>
                    </View>

                    {/* Section 4: Common Care Arrangements */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Common Care Arrangements Explained
                    </Text>

                    <Text style={styles.paragraph}>
                        Here's how typical care arrangements translate into nights per year and care percentages.
                    </Text>

                    <View style={styles.arrangementCard}>
                        <Text style={styles.arrangementTitle}>Every Second Weekend</Text>
                        <Text style={styles.arrangementCalc}>52 weekends ÷ 2 = 26 weekends × 2 nights = 52 nights</Text>
                        <Text style={styles.arrangementResult}>= 14% care</Text>
                        <Text style={styles.arrangementNote}>
                            This is the minimum to reach the 14% threshold where cost offset begins.
                        </Text>
                    </View>

                    <View style={styles.arrangementCard}>
                        <Text style={styles.arrangementTitle}>Every Second Weekend + 1 Weeknight</Text>
                        <Text style={styles.arrangementCalc}>52 nights (weekends) + 52 nights (weekly) = 104 nights</Text>
                        <Text style={styles.arrangementResult}>= 28% care</Text>
                        <Text style={styles.arrangementNote}>
                            Common arrangement for working parents. Significant cost offset applies.
                        </Text>
                    </View>

                    <View style={styles.arrangementCard}>
                        <Text style={styles.arrangementTitle}>Every Second Weekend + 2 Weeknights</Text>
                        <Text style={styles.arrangementCalc}>52 nights (weekends) + 104 nights (2× weekly) = 156 nights</Text>
                        <Text style={styles.arrangementResult}>= 43% care</Text>
                        <Text style={styles.arrangementNote}>
                            Approaching shared care. Child support may be minimal if incomes are similar.
                        </Text>
                    </View>

                    <View style={styles.arrangementCard}>
                        <Text style={styles.arrangementTitle}>Alternating Weeks (7/7)</Text>
                        <Text style={styles.arrangementCalc}>52 weeks ÷ 2 = 26 weeks × 7 nights = 182 nights</Text>
                        <Text style={styles.arrangementResult}>= 50% care (approximately)</Text>
                        <Text style={styles.arrangementNote}>
                            True 50/50 shared care. Child support depends entirely on income difference.
                        </Text>
                    </View>

                    <View style={styles.arrangementCard}>
                        <Text style={styles.arrangementTitle}>5/2/2/5 Schedule</Text>
                        <Text style={styles.arrangementCalc}>5 days + 2 days = 7 days, alternating = ~183 nights each</Text>
                        <Text style={styles.arrangementResult}>= 50% care</Text>
                        <Text style={styles.arrangementNote}>
                            Popular for parents who want 50/50 but prefer shorter blocks than full weeks.
                        </Text>
                    </View>

                    {/* Section 5: How Care Affects Child Support */}
                    <Text style={styles.h2} accessibilityRole="header">
                        How Care Percentage Affects Your Child Support
                    </Text>

                    <Text style={styles.paragraph}>
                        Care percentage affects child support through the "cost percentage" calculation. Here's how 
                        it works:
                    </Text>

                    <View style={styles.formulaCard}>
                        <Text style={styles.formulaTitle}>The Cost Percentage Formula</Text>
                        <Text style={styles.formulaStep}>1. Each parent's care percentage determines their "cost percentage"</Text>
                        <Text style={styles.formulaStep}>2. Cost percentage = How much of the child's costs you're expected to cover</Text>
                        <Text style={styles.formulaStep}>3. Your income percentage minus your cost percentage = Your child support liability</Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">Example: How Care Changes Payments</Text>

                    <View style={styles.exampleCard}>
                        <Text style={styles.exampleTitle}>Scenario: Parent A earns $80,000, Parent B earns $50,000</Text>
                        
                        <View style={styles.exampleRow}>
                            <Text style={styles.exampleLabel}>If Parent A has 0% care:</Text>
                            <Text style={styles.exampleValue}>Pays ~$12,000/year</Text>
                        </View>
                        
                        <View style={styles.exampleRow}>
                            <Text style={styles.exampleLabel}>If Parent A has 14% care (52 nights):</Text>
                            <Text style={styles.exampleValue}>Pays ~$10,500/year</Text>
                        </View>
                        
                        <View style={styles.exampleRow}>
                            <Text style={styles.exampleLabel}>If Parent A has 35% care (128 nights):</Text>
                            <Text style={styles.exampleValue}>Pays ~$7,200/year</Text>
                        </View>
                        
                        <View style={styles.exampleRow}>
                            <Text style={styles.exampleLabel}>If Parent A has 48% care (175 nights):</Text>
                            <Text style={styles.exampleValue}>Pays ~$2,400/year</Text>
                        </View>
                        
                        <View style={styles.exampleRow}>
                            <Text style={styles.exampleLabel}>If Parent A has 50% care (183 nights):</Text>
                            <Text style={styles.exampleValue}>Pays ~$1,800/year</Text>
                        </View>
                    </View>

                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightTitle}>Key Insight:</Text>
                        <Text style={styles.highlightText}>
                            Going from 0% to 14% care saves ~$1,500/year. Going from 35% to 48% care saves ~$4,800/year. 
                            The savings accelerate as you approach 50/50.
                        </Text>
                    </View>

                    {/* Section 6: When Care Changes */}
                    <Text style={styles.h2} accessibilityRole="header">
                        What Happens When Care Arrangements Change?
                    </Text>

                    <Text style={styles.paragraph}>
                        Care arrangements often change over time. Here's what you need to know about updating your 
                        child support assessment.
                    </Text>

                    <Text style={styles.h3} accessibilityRole="header">The 14-Night Rule</Text>

                    <View style={styles.ruleCard}>
                        <Text style={styles.ruleTitle}>Services Australia will update your assessment if:</Text>
                        <Text style={styles.bulletItem}>• Actual care differs from assessed care by more than 14 nights per year, OR</Text>
                        <Text style={styles.bulletItem}>• The difference is more than 5% of care</Text>
                        <Text style={styles.bulletItem}>• The change is expected to last for at least 26 weeks</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        Either parent can apply for a care change assessment. You'll need evidence of the actual 
                        care arrangement—calendars, school records, or written agreements.
                    </Text>

                    <Text style={styles.h3} accessibilityRole="header">How to Apply for a Care Change</Text>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 1</Text>
                        <Text style={styles.stepTitle}>Document the Change</Text>
                        <Text style={styles.stepDesc}>
                            Keep a calendar showing actual nights. Note any patterns or agreements about the new 
                            care arrangement.
                        </Text>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 2</Text>
                        <Text style={styles.stepTitle}>Contact Services Australia</Text>
                        <Text style={styles.stepDesc}>
                            Call 131 272 or apply online through myGov. Tell them the care arrangement has changed 
                            and provide the new pattern.
                        </Text>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 3</Text>
                        <Text style={styles.stepTitle}>Provide Evidence</Text>
                        <Text style={styles.stepDesc}>
                            Submit your care calendar, any written agreements, school records, or other proof of 
                            the actual care arrangement.
                        </Text>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 4</Text>
                        <Text style={styles.stepTitle}>Wait for Assessment</Text>
                        <Text style={styles.stepDesc}>
                            Services Australia will review the evidence and issue a new assessment if the change 
                            meets the threshold. This typically takes 2-4 weeks.
                        </Text>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>⚠️ Important:</Text>
                        <Text style={styles.warningText}>
                            The new assessment usually applies from the date you notify Services Australia, not 
                            from when the care actually changed. Don't delay—apply as soon as the pattern changes.
                        </Text>
                    </View>

                    {/* Section 7: Disputes */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Disputing Care Percentage Assessments
                    </Text>

                    <Text style={styles.paragraph}>
                        What if you and the other parent disagree about the care arrangement? Or Services Australia's 
                        assessment doesn't match reality?
                    </Text>

                    <Text style={styles.h3} accessibilityRole="header">Common Care Disputes</Text>

                    <View style={styles.disputeCard}>
                        <Text style={styles.disputeTitle}>❌ "The other parent isn't following the agreement"</Text>
                        <Text style={styles.disputeDesc}>
                            Keep detailed records of actual care. If the difference exceeds 14 nights per year, 
                            apply for a care change assessment with evidence.
                        </Text>
                    </View>

                    <View style={styles.disputeCard}>
                        <Text style={styles.disputeTitle}>❌ "We don't have a formal agreement"</Text>
                        <Text style={styles.disputeDesc}>
                            Services Australia will assess based on the actual pattern of care. Document what's 
                            actually happening, even without a formal agreement.
                        </Text>
                    </View>

                    <View style={styles.disputeCard}>
                        <Text style={styles.disputeTitle}>❌ "The other parent is claiming more care than they provide"</Text>
                        <Text style={styles.disputeDesc}>
                            Object to the assessment with evidence showing actual care. School attendance records, 
                            medical appointments, and activity schedules can prove your case.
                        </Text>
                    </View>

                    <View style={styles.disputeCard}>
                        <Text style={styles.disputeTitle}>❌ "Care varies week to week"</Text>
                        <Text style={styles.disputeDesc}>
                            Services Australia calculates based on the pattern over a full year. Track care for 
                            several months to establish the average pattern.
                        </Text>
                    </View>

                    <View style={styles.ctaSection}>
                        <Text style={styles.ctaTitle}>Need Help With a Care Dispute?</Text>
                        <Text style={styles.ctaText}>
                            Connect with family lawyers who specialize in child support care arrangement disputes.
                        </Text>
                        <Pressable
                            style={[styles.primaryButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=care_dispute')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.primaryButtonText}>Get Legal Help</Text>
                        </Pressable>
                    </View>

                    {/* FAQ Section */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Frequently Asked Questions
                    </Text>

                    <FAQItem
                        question="How many nights is 50/50 custody in Australia?"
                        answer="50/50 custody (equal shared care) is 182.5 nights per year for each parent. In practice, this is usually 182 or 183 nights. This equals exactly 50% care for child support purposes."
                    />

                    <FAQItem
                        question="What is the 14% care threshold in child support?"
                        answer="The 14% care threshold (52 nights per year) is when your care percentage starts reducing your child support liability. Below 14%, you pay full child support with no cost offset. At 14% or above, your cost percentage begins to reduce the amount you pay."
                    />

                    <FAQItem
                        question="Do school holidays count towards care percentage?"
                        answer="Yes. Care percentage is calculated over the entire year, including school holidays. If you have your children during school holidays, those nights are added to your total annual care calculation. This is why many parents have different care percentages than they expect."
                    />

                    <FAQItem
                        question="What happens if actual care differs from the assessment?"
                        answer="If actual care differs from the assessed care by more than 14 nights per year (or 5% of care), either parent can apply to Services Australia to update the assessment. Keep accurate records of actual care provided, as you may need to prove the difference."
                    />

                    <FAQItem
                        question="Can I negotiate care percentage with the other parent?"
                        answer="You can agree on a care arrangement with the other parent, but Services Australia will assess based on the actual pattern of care, not what you agree to on paper. If you want a specific care percentage for child support purposes, you need to actually provide that level of care."
                    />

                    {/* Conclusion */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Key Takeaways
                    </Text>

                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightTitle}>Remember:</Text>
                        <Text style={styles.bulletItem}>• Care percentage is based on nights per year, not days or hours</Text>
                        <Text style={styles.bulletItem}>• Four critical thresholds: 14%, 35%, 48%, and 52%</Text>
                        <Text style={styles.bulletItem}>• School holidays and special occasions count towards your total</Text>
                        <Text style={styles.bulletItem}>• A few nights difference can significantly change child support</Text>
                        <Text style={styles.bulletItem}>• Keep accurate records—you may need to prove actual care</Text>
                        <Text style={styles.bulletItem}>• Apply for care changes as soon as the pattern changes</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        Understanding care percentage is crucial for accurate child support calculations. Use our 
                        calculator to see exactly how your care arrangement affects your payments.
                    </Text>

                    {/* Final CTA */}
                    <View style={styles.finalCtaSection}>
                        <Text style={styles.ctaTitle}>Calculate Your Child Support</Text>
                        <Text style={styles.ctaText}>
                            Enter your care arrangement and get an instant, accurate child support estimate.
                        </Text>
                        <View style={styles.ctaButtons}>
                            <Pressable
                                style={[styles.primaryButton, isWeb && webClickableStyles]}
                                onPress={() => router.push('/')}
                                accessibilityRole="button"
                            >
                                <Text style={styles.primaryButtonText}>Use Calculator</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.secondaryButton, isWeb && webClickableStyles]}
                                onPress={() => router.push('/faq')}
                                accessibilityRole="button"
                            >
                                <Text style={styles.secondaryButtonText}>More FAQs</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

// Helper Components
function TableRow({ nights, percentage, arrangement, highlight }: { 
    nights: string; 
    percentage: string; 
    arrangement: string;
    highlight?: boolean;
}) {
    return (
        <View style={[styles.tableRow, highlight && styles.tableRowHighlight]}>
            <Text style={styles.tableCell}>{nights}</Text>
            <Text style={[styles.tableCell, styles.tableCellBold]}>{percentage}</Text>
            <Text style={styles.tableCell}>{arrangement}</Text>
        </View>
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
    tableContainer: {
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
    tableTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 12,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    tableRowHighlight: {
        backgroundColor: '#eff6ff',
    },
    tableHeaderCell: {
        flex: 1,
        fontSize: 13,
        fontWeight: '700',
        color: '#1e3a8a',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tableCell: {
        flex: 1,
        fontSize: 14,
        color: '#475569',
    },
    tableCellBold: {
        fontWeight: '600',
        color: '#1e3a8a',
    },
    thresholdCard: {
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
    thresholdNumber: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2563EB',
        marginRight: 16,
        minWidth: 60,
    },
    thresholdContent: {
        flex: 1,
    },
    thresholdTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 8,
    },
    thresholdDesc: {
        fontSize: 14,
        lineHeight: 20,
        color: '#64748b',
        marginBottom: 6,
    },
    ruleCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    ruleTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 8,
    },
    situationCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    situationTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 6,
    },
    situationDesc: {
        fontSize: 14,
        lineHeight: 20,
        color: '#64748b',
    },
    arrangementCard: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    arrangementTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 8,
    },
    arrangementCalc: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 4,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    arrangementResult: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2563EB',
        marginBottom: 8,
    },
    arrangementNote: {
        fontSize: 13,
        lineHeight: 18,
        color: '#64748b',
        fontStyle: 'italic',
    },
    formulaCard: {
        backgroundColor: '#eff6ff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    formulaTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 12,
    },
    formulaStep: {
        fontSize: 14,
        lineHeight: 22,
        color: '#1e40af',
        marginBottom: 6,
    },
    exampleCard: {
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
    exampleTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 12,
    },
    exampleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    exampleLabel: {
        flex: 1,
        fontSize: 14,
        color: '#475569',
    },
    exampleValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2563EB',
    },
    stepCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#22c55e',
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
        color: '#22c55e',
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
    disputeCard: {
        backgroundColor: '#fef2f2',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    disputeTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#991b1b',
        marginBottom: 6,
    },
    disputeDesc: {
        fontSize: 14,
        lineHeight: 20,
        color: '#991b1b',
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
});
