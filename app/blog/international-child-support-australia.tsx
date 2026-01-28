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
            name: 'Can Services Australia collect child support from overseas?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, if your ex lives in a reciprocating jurisdiction (80+ countries including the UK, US, Canada, NZ, and all EU countries). Services Australia registers the debt with the overseas country\'s enforcement agency, which collects payment using their local laws.',
            },
        },
        {
            '@type': 'Question',
            name: 'What if my ex moved overseas to avoid paying child support?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Moving overseas doesn\'t eliminate child support obligations. If your ex moved to a reciprocating jurisdiction, Australia can still enforce payment. The debt still exists and can be pursued if your ex returns to Australia or moves to a reciprocating jurisdiction.',
            },
        },
        {
            '@type': 'Question',
            name: 'Does the Hague Convention apply to child support in Australia?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Australia became a Contracting State to the 1973 Hague Convention on the Recognition and Enforcement of Decisions Relating to Maintenance Obligations on 1 February 2002. This treaty allows Australia to enforce child support orders in other Convention countries.',
            },
        },
    ],
};

// Article schema
const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'International Child Support Australia: When Your Ex Lives Overseas',
    description: 'Ex lives overseas? Australian child support still applies. Learn about reciprocating jurisdictions, enforcement options, and what to do next.',
    datePublished: '2026-01-24',
    dateModified: '2026-01-24',
    author: {
        '@type': 'Organization',
        name: 'AusChildSupport',
    },
};

export default function InternationalChildSupportBlogPost() {
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
                title="International Child Support 2026 | Ex Lives Overseas"
                description="Ex fled overseas? 80+ countries enforce Australian child support. See reciprocating jurisdictions + Hague Convention. Moving doesn't erase debt."
                canonicalPath="/blog/international-child-support-australia"
                schema={[articleSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'International Child Support' },
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
                            // @ts-ignore - Web-only ARIA
                            aria-level="1"
                        >
                            International Child Support Australia: When Your Ex Lives Overseas
                        </Text>
                        <Text style={styles.publishDate}>Published January 24, 2026</Text>
                    </View>

                    {/* Introduction */}
                    <Text style={styles.intro}>
                        Your ex-partner has moved to another country. You're still raising your children in Australia.
                        And you're wondering: <Text style={styles.emphasis}>Can I still get child support?</Text>
                    </Text>

                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            Ex lives overseas? Australian child support still applies in reciprocating jurisdictions. 
                            Enforcement varies by country. Calculate your Australian assessment amount below, then seek 
                            legal advice for international enforcement.
                        </Text>
                        <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.quickAnswerButtonText}>Calculate Amount →</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.paragraph}>
                        The short answer is yes—Australian child support laws still apply even when one parent lives overseas.
                        But enforcement depends entirely on which country your ex has moved to. Some countries cooperate with
                        Australia to collect payments. Others don't.
                    </Text>

                    <Text style={styles.paragraph}>
                        This guide explains how international child support works in Australia, which countries enforce
                        Australian child support orders, and what steps you should take if your ex is living abroad.
                    </Text>

                    <Pressable
                        style={[styles.primaryButton, isWeb && webClickableStyles]}
                        accessibilityRole="link" onPress={() => router.push('/')}
                        accessibilityLabel="Calculate child support"
                    >
                        <Text style={styles.primaryButtonText}>Calculate Your Child Support →</Text>
                    </Pressable>

                    {/* Section 1 */}
                    <Text
                        style={styles.h2}
                        accessibilityRole="header"
                        // @ts-ignore
                        aria-level="2"
                    >
                        Can Services Australia collect child support from overseas?
                    </Text>

                    <Text style={styles.paragraph}>
                        Yes, Services Australia can collect child support from overseas if your ex lives in a reciprocating jurisdiction. Australia has child support agreements with over 80 countries including the UK, US, Canada, NZ, and all EU countries. Services Australia registers the debt with the overseas country's enforcement agency, which collects payment using their local laws. If your ex lives in a non-reciprocating jurisdiction, Services Australia cannot enforce payment overseas.
                    </Text>

                    <Text
                        style={styles.h2}
                        accessibilityRole="header"
                        // @ts-ignore
                        aria-level="2"
                    >
                        Does Australian Child Support Apply When My Ex Lives Overseas?
                    </Text>

                    <Text style={styles.paragraph}>
                        Yes. If you and your children live in Australia, the Australian child support formula applies
                        regardless of where your ex-partner lives.
                    </Text>

                    <Text style={styles.paragraph}>
                        Services Australia (the government agency that administers child support) can assess child support
                        even when the paying parent is overseas. The assessment uses the same 8-step formula that applies
                        to all Australian child support cases.
                    </Text>

                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightTitle}>What doesn't change:</Text>
                        <Text style={styles.bulletItem}>• The formula calculation (based on income, care percentage, and number of children)</Text>
                        <Text style={styles.bulletItem}>• Your right to apply for child support</Text>
                        <Text style={styles.bulletItem}>• The paying parent's legal obligation to pay</Text>
                    </View>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>What does change:</Text>
                        <Text style={styles.bulletItem}>• How (or if) Australia can enforce the payment</Text>
                        <Text style={styles.bulletItem}>• Whether Services Australia can collect payments directly</Text>
                        <Text style={styles.bulletItem}>• What legal options you have if your ex refuses to pay</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        The key factor is which country your ex-partner has moved to.
                    </Text>

                    {/* Section 2 */}
                    <Text style={styles.h2} accessibilityRole="header">
                        The Three Types of Countries for Child Support Enforcement
                    </Text>

                    <Text style={styles.paragraph}>
                        Australia categorizes countries into three groups for child support purposes:
                    </Text>

                    <View style={styles.countryTypeCard}>
                        <Text style={styles.countryTypeNumber}>1</Text>
                        <View style={styles.countryTypeContent}>
                            <Text style={styles.countryTypeTitle}>Reciprocating Jurisdictions</Text>
                            <Text style={styles.countryTypeDesc}>80+ countries - Australia has agreements to enforce child support</Text>
                        </View>
                    </View>

                    <View style={styles.countryTypeCard}>
                        <Text style={styles.countryTypeNumber}>2</Text>
                        <View style={styles.countryTypeContent}>
                            <Text style={styles.countryTypeTitle}>Excluded Jurisdictions</Text>
                            <Text style={styles.countryTypeDesc}>7 countries - You need a court order, not a Services Australia assessment</Text>
                        </View>
                    </View>

                    <View style={styles.countryTypeCard}>
                        <Text style={styles.countryTypeNumber}>3</Text>
                        <View style={styles.countryTypeContent}>
                            <Text style={styles.countryTypeTitle}>Non-Reciprocating Jurisdictions</Text>
                            <Text style={styles.countryTypeDesc}>No enforcement agreement exists</Text>
                        </View>
                    </View>

                    <Text style={styles.paragraph}>
                        Your options depend entirely on which category applies to your ex's new country.
                    </Text>

                    {/* Section 3 - Reciprocating */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Reciprocating Jurisdictions: Where Australia Can Enforce Payments
                    </Text>

                    <Text style={styles.paragraph}>
                        A reciprocating jurisdiction is a country that has signed an agreement with Australia to enforce
                        child support orders. These agreements work both ways—Australia enforces their orders, and they
                        enforce ours.
                    </Text>

                    <Text style={styles.h3} accessibilityRole="header">How it works:</Text>
                    <Text style={styles.bulletItem}>1. You apply for child support through Services Australia as normal</Text>
                    <Text style={styles.bulletItem}>2. Services Australia assesses the child support amount using the Australian formula</Text>
                    <Text style={styles.bulletItem}>3. If your ex doesn't pay voluntarily, Services Australia can register the debt in the overseas country</Text>
                    <Text style={styles.bulletItem}>4. The overseas country's enforcement agency collects the payment using their local laws</Text>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>Australia has reciprocating agreements with over 80 countries, including:</Text>
                        <Text style={styles.bulletItem}>• All major English-speaking countries (UK, US, Canada, NZ, Ireland)</Text>
                        <Text style={styles.bulletItem}>• All 27 European Union member states</Text>
                        <Text style={styles.bulletItem}>• Norway, Switzerland</Text>
                        <Text style={styles.bulletItem}>• Singapore, Hong Kong</Text>
                        <Text style={styles.bulletItem}>• South Africa, Israel</Text>
                    </View>

                    <Text style={styles.h3} accessibilityRole="header">The Hague Convention on Child Support</Text>

                    <Text style={styles.paragraph}>
                        Many reciprocating jurisdictions operate under the 1973 Hague Convention on the Recognition and 
                        Enforcement of Decisions Relating to Maintenance Obligations.
                    </Text>

                    <Text style={styles.paragraph}>
                        Australia became a Contracting State to this Convention on 1 February 2002, significantly expanding 
                        enforcement options for parents whose ex-partners live overseas. The Convention allows for recognition 
                        of administrative assessments (not just court orders) and provides for relatively simple and speedy 
                        enforcement of Australian liabilities by overseas authorities.
                    </Text>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>Important limitation:</Text>
                        <Text style={styles.warningText}>
                            Even in reciprocating jurisdictions, enforcement depends on the overseas country's ability to
                            locate your ex and collect payment. If your ex is working cash jobs or hiding assets, enforcement
                            becomes difficult regardless of the agreement.
                        </Text>
                    </View>

                    {/* Section 4 - Excluded */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Excluded Jurisdictions: When You Need a Court Order
                    </Text>

                    <Text style={styles.paragraph}>
                        Seven countries are classified as excluded jurisdictions. For these countries, you cannot use a
                        Services Australia child support assessment. Instead, you must obtain an Australian court order.
                    </Text>

                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightTitle}>The seven excluded jurisdictions are:</Text>
                        <Text style={styles.bulletItem}>• Brunei Darussalam</Text>
                        <Text style={styles.bulletItem}>• Cook Islands</Text>
                        <Text style={styles.bulletItem}>• Israel</Text>
                        <Text style={styles.bulletItem}>• Niue</Text>
                        <Text style={styles.bulletItem}>• Papua New Guinea</Text>
                        <Text style={styles.bulletItem}>• Samoa</Text>
                        <Text style={styles.bulletItem}>• Yukon (in Canada)</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        These jurisdictions have special arrangements with Australia that require court orders rather 
                        than administrative assessments. Services Australia cannot make or continue a child support 
                        assessment if the payer lives in one of these countries.
                    </Text>

                    <Text style={styles.paragraph}>
                        This process is more expensive and time-consuming than a standard Services Australia assessment.
                        Budget for legal fees and court costs.
                    </Text>

                    {/* Section 5 - Non-Reciprocating */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Non-Reciprocating Jurisdictions: The Difficult Cases
                    </Text>

                    <Text style={styles.paragraph}>
                        If your ex lives in a country that is neither a reciprocating jurisdiction nor an excluded
                        jurisdiction, you're in the most difficult situation.
                    </Text>

                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>Countries without enforcement agreements include:</Text>
                        <Text style={styles.bulletItem}>• Most Middle Eastern countries</Text>
                        <Text style={styles.bulletItem}>• Many African countries (except South Africa)</Text>
                        <Text style={styles.bulletItem}>• Some Asian countries (China, Thailand, Indonesia)</Text>
                        <Text style={styles.bulletItem}>• Some South American countries</Text>
                    </View>

                    <Text style={styles.paragraph}>
                        If your ex lives in a non-reciprocating jurisdiction and refuses to pay, your practical options
                        are limited. Many parents in this situation receive no child support. Learn more about{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/overseas-parent-child-support-enforcement')}
                        >
                            overseas parent enforcement strategies
                        </Text>.
                    </Text>

                    {/* What to Do Section */}
                    <Text style={styles.h2} accessibilityRole="header">
                        What You Should Do If Your Ex Lives Overseas
                    </Text>

                    <Text style={styles.paragraph}>
                        Here's a step-by-step action plan based on your situation:
                    </Text>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 1</Text>
                        <Text style={styles.stepTitle}>Identify Which Type of Country Your Ex Lives In</Text>
                        <Text style={styles.stepDesc}>
                            Check whether your ex's country is a reciprocating jurisdiction, excluded jurisdiction, or
                            non-reciprocating jurisdiction. Services Australia maintains an up-to-date list on their website.
                        </Text>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 2</Text>
                        <Text style={styles.stepTitle}>Apply for Child Support Assessment</Text>
                        <Text style={styles.stepDesc}>
                            Even if enforcement is uncertain, apply for a child support assessment through Services Australia.
                            This establishes the official amount your ex owes and creates a legal record of the debt.
                        </Text>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 3</Text>
                        <Text style={styles.stepTitle}>Calculate What You're Owed</Text>
                        <Text style={styles.stepDesc}>
                            Use our free calculator to estimate your child support amount. The Australian child support
                            formula applies regardless of where your ex lives.
                        </Text>
                    </View>

                    <View style={styles.stepCard}>
                        <Text style={styles.stepNumber}>Step 4</Text>
                        <Text style={styles.stepTitle}>Get Legal Advice for Complex Cases</Text>
                        <Text style={styles.stepDesc}>
                            Consult a family lawyer if your ex lives in an excluded jurisdiction, has significant assets
                            overseas, or is deliberately avoiding payment.
                        </Text>
                    </View>

                    {/* Contextual Wizard */}
                    <ContextualWizard
                        preselectedFactors={['international_jurisdiction']}
                        highlightedFactors={['income_resources_not_reflected']}
                        blogTopic="international"
                        ctaText="Get Help With International Cases"
                        analyticsSource="blog_international_child_support_australia"
                        formReason="special_circumstances"
                        title="Dealing With an Overseas Parent?"
                        description="International cases require specialized knowledge of reciprocating jurisdictions and enforcement mechanisms. Select any factors that apply."
                    />

                    {/* FAQ Section */}
                    <Text style={styles.h2} accessibilityRole="header">
                        Frequently Asked Questions
                    </Text>

                    <FAQItem
                        question="Can Services Australia collect child support from overseas?"
                        answer="Yes, if your ex lives in a reciprocating jurisdiction (80+ countries including the UK, US, Canada, NZ, and all EU countries). Services Australia registers the debt with the overseas country's enforcement agency, which collects payment using their local laws. If your ex lives in a non-reciprocating jurisdiction, Services Australia cannot enforce payment overseas."
                    />

                    <FAQItem
                        question="What if my ex moved overseas to avoid paying child support?"
                        answer="Moving overseas doesn't eliminate child support obligations. If your ex moved to a reciprocating jurisdiction, Australia can still enforce payment. If they moved to a non-reciprocating jurisdiction, enforcement is difficult but the debt still exists. Services Australia can pursue the debt if your ex ever returns to Australia or moves to a reciprocating jurisdiction."
                    />

                    <FAQItem
                        question="Does the Hague Convention apply to child support in Australia?"
                        answer="Yes. Australia became a Contracting State to the 1973 Hague Convention on the Recognition and Enforcement of Decisions Relating to Maintenance Obligations on 1 February 2002. This treaty allows Australia to enforce child support orders in other Convention countries. The Convention streamlines international enforcement by standardizing processes and requiring countries to recognize each other's child support orders, including administrative assessments."
                    />

                    {/* CTA Section */}
                    <View style={styles.ctaSection}>
                        <Text style={styles.ctaTitle}>Need Help With International Child Support?</Text>
                        <Text style={styles.ctaText}>
                            International cases require specialized knowledge of reciprocating jurisdictions and
                            enforcement mechanisms. Most family lawyers offer free initial consultations with no
                            obligation to proceed.
                        </Text>
                        <View style={styles.ctaButtons}>
                            <Pressable
                                style={[styles.primaryButton, isWeb && webClickableStyles]}
                                accessibilityRole="link" onPress={() => router.push('/')}
                                accessibilityLabel="Go to calculator"
                            >
                                <Text style={styles.primaryButtonText}>Use Calculator</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.secondaryButton, isWeb && webClickableStyles]}
                                accessibilityRole="link" onPress={() => router.push('/lawyer-inquiry?mode=direct')}
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
    emphasis: {
        fontStyle: 'italic',
        fontWeight: '600',
        color: '#1e3a8a',
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

    inlineLink: {
        color: '#2563EB',
        textDecorationLine: 'underline',
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
    countryTypeCard: {
        flexDirection: 'row',
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
    countryTypeNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2563EB',
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 40,
        marginRight: 12,
    },
    countryTypeContent: {
        flex: 1,
    },
    countryTypeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 4,
    },
    countryTypeDesc: {
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
