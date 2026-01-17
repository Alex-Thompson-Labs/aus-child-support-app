import { PageSEO } from '@/src/components/seo/PageSEO';
import Accordion from '@/src/components/ui/Accordion';
import { CalculatorHeader } from '@/src/features/calculator';
import { isWeb, MAX_CALCULATOR_WIDTH, webClickableStyles } from '@/src/utils/responsive';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Comprehensive FAQ data aggregated from all pages
const FAQ_DATA = [
    // Calculator FAQs
    {
        category: 'Calculator',
        questions: [
            {
                question: 'How is Australian Child Support calculated in 2026?',
                answer: 'Child support is calculated using the official 8-step formula from Services Australia. It considers both parents\' incomes, the cost of raising children (based on age), care percentages, and any relevant dependents.',
            },
            {
                question: 'Does 50/50 care mean no child support?',
                answer: 'Not necessarily. Even with equal shared care, child support may be payable if there is a significant income difference between the parents. The formula balances care time against each parent\'s capacity to contribute financially.',
            },
            {
                question: 'What income is used for child support?',
                answer: 'Child support uses your Adjusted Taxable Income (ATI), which includes taxable income, reportable fringe benefits, certain tax-free pensions, net investment losses, and reportable superannuation contributions.',
            },
            {
                question: 'What is the Self-Support Amount (SSA)?',
                answer: 'The Self-Support Amount is one-third of the Male Total Average Weekly Earnings (MTAWE). This amount is deducted from each parent\'s ATI before calculating child support. In 2026, this is $31,046 per year.',
            },
            {
                question: 'How does the number of children affect child support?',
                answer: 'More children generally means higher child support. The Costs of Children table uses age groups and combined parental income to determine the total cost, which increases with each additional child.',
            },
            {
                question: 'What are relevant dependents and how do they affect my assessment?',
                answer: 'Relevant dependents are other children you support who are not part of this child support case. Each relevant dependent reduces your child support income by a percentage (24% for one, 34% for two, 40% for three or more).',
            },
            {
                question: 'How accurate is this calculator?',
                answer: 'This calculator uses the exact formula and 2026 rates from Services Australia. However, special circumstances, care changes, or complex income situations may result in a different official assessment.',
            },
            {
                question: 'How often should I recalculate child support?',
                answer: 'You should recalculate when there are significant changes to income, care arrangements, or the number of children. Services Australia typically reassesses annually based on tax returns.',
            },
        ],
    },
    // Change of Assessment FAQs
    {
        category: 'Change of Assessment',
        questions: [
            {
                question: 'What is a Change of Assessment?',
                answer: 'A Change of Assessment is an application to Services Australia to review your child support based on 10 special circumstances, such as high contact costs, hidden income, special needs care costs, or property settlements.',
            },
            {
                question: 'When can I apply for a Change of Assessment?',
                answer: 'You can apply when special circumstances mean the standard formula doesn\'t reflect your true situation. Common reasons include: the other parent has hidden income, you have high travel costs to see your children, or a property settlement affects your capacity to pay.',
            },
            {
                question: 'What are the 10 reasons for a Change of Assessment?',
                answer: 'The reasons include: (1) High costs of contact, (2) Special needs care costs, (3) High education costs, (4) Child\'s income, (5) Transferred benefits, (6) High childcare costs, (7) Reduced capacity, (8A) Hidden income/property, (8B) Earning capacity, (9) Legal duty to others, and (10) Resident child responsibility.',
            },
            {
                question: 'How long does a Change of Assessment take?',
                answer: 'A Change of Assessment typically takes 6-12 weeks from lodgement to decision. Complex cases involving hidden income or multiple reasons may take longer, especially if a conference is required.',
            },
            {
                question: 'What evidence do I need for a Change of Assessment?',
                answer: 'Evidence depends on the reason you\'re applying. Common documents include tax returns, receipts, medical reports, payslips, bank statements, and evidence of the other parent\'s lifestyle or assets.',
            },
            {
                question: 'Can the other parent object to my application?',
                answer: 'Yes. The other parent will be given an opportunity to respond to your application. They can provide their own evidence and attend a conference with the Registrar. Both parties have a chance to explain their situation.',
            },
            {
                question: 'What happens after I lodge an application?',
                answer: 'Services Australia will review your application, request any additional documents, and may schedule a conference call with both parties. A Registrar will make a decision based on all the evidence provided.',
            },
            {
                question: 'Can I appeal a Change of Assessment decision?',
                answer: 'Yes. If you disagree with the decision, you can object within 28 days or apply to the Social Security Appeals Tribunal (SSAT) for review. Legal advice can help you understand your options.',
            },
        ],
    },
    // Legal Help FAQs
    {
        category: 'Legal Help',
        questions: [
            {
                question: 'How do I request a child support review?',
                answer: 'You can request a Change of Assessment through Services Australia. Our inquiry form connects you with family law professionals who can advise on your eligibility and help prepare your application.',
            },
            {
                question: 'How long does a lawyer inquiry take?',
                answer: 'After submitting your details through our form, a family law professional will typically contact you within 1-2 business days to discuss your situation.',
            },
            {
                question: 'Is my information confidential?',
                answer: 'Yes. Your personal and financial information is encrypted and only shared with the legal professionals who will be reviewing your case.',
            },
            {
                question: 'How much does legal advice cost?',
                answer: 'Initial consultations are often free or at a reduced rate. Costs for ongoing representation vary based on complexity. Many lawyers offer no-win, no-fee arrangements for child support matters.',
            },
            {
                question: 'What can a lawyer help with in child support cases?',
                answer: 'A lawyer can help with Change of Assessment applications, objections, SSAT appeals, binding child support agreements, and cases involving hidden income or complex financial structures.',
            },
            {
                question: 'Do I need a lawyer for a Change of Assessment?',
                answer: 'A lawyer is not required, but professional advice can help strengthen your case, especially for complex matters like Reason 8A (hidden income) or when the other parent has legal representation.',
            },
        ],
    },
    // Care Arrangements FAQs
    {
        category: 'Care Arrangements',
        questions: [
            {
                question: 'How does split care affect child support?',
                answer: 'Split care occurs when each parent has different children living with them primarily. Each child is assessed separately, and the parent with less care for each child typically pays support for that child.',
            },
            {
                question: 'How are school holidays counted in care percentage?',
                answer: 'Care is calculated over the entire year, including school holidays. If you have your children during school holidays, these nights are added to your total annual care calculation.',
            },
            {
                question: 'What if the other parent doesn\'t follow the care arrangement?',
                answer: 'If actual care differs from the assessed care by more than 14 nights per year, you can apply to Services Australia to update the assessment. Keep a record of actual care provided.',
            },
            {
                question: 'What is the 14% threshold for care?',
                answer: 'At 14% care (52 nights per year), your cost percentage begins to reduce your child support liability. Below 14%, you may still pay child support but receive no cost offset.',
            },
        ],
    },
    // Special Circumstances FAQs
    {
        category: 'Special Circumstances',
        questions: [
            {
                question: 'When should I apply for a Change of Assessment?',
                answer: 'Apply when the standard formula produces an unfair result due to special circumstances, such as: the other parent has unreported income, you have very high contact costs, or your child has special medical needs.',
            },
            {
                question: 'Can I apply for multiple reasons at once?',
                answer: 'Yes. You can list multiple reasons in one application. Many applicants combine Reason 8A (hidden income) with other financial reasons to present a complete picture of their situation.',
            },
            {
                question: 'What happens after I\'m matched with a lawyer?',
                answer: 'The lawyer will review your calculation, discuss your situation, and advise whether you have grounds for a Change of Assessment. They can help you prepare and lodge your application.',
            },
            {
                question: 'Is there a priority for different reasons?',
                answer: 'All 10 reasons are equally valid, but some are more common and have higher success rates. Reasons 8A (hidden income) and 1 (high contact costs) are frequently applied and have established precedents.',
            },
        ],
    },
];

// Build FAQPage schema from FAQ_DATA
const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA.flatMap((category) =>
        category.questions.map((q) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: q.answer,
            },
        }))
    ),
};

export default function FAQPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const webContainerStyle = isWeb
        ? {
            maxWidth: MAX_CALCULATOR_WIDTH,
            width: '100%' as const,
            alignSelf: 'center' as const,
        }
        : {};

    // Filter FAQ items based on search query
    const filteredFAQData = useMemo(() => {
        if (!searchQuery.trim()) {
            return FAQ_DATA;
        }

        const query = searchQuery.toLowerCase();
        
        return FAQ_DATA.map((category) => ({
            ...category,
            questions: category.questions.filter((item) => {
                const matchesQuestion = item.question.toLowerCase().includes(query);
                const matchesAnswer = item.answer.toLowerCase().includes(query);
                return matchesQuestion || matchesAnswer;
            }),
        })).filter((category) => category.questions.length > 0);
    }, [searchQuery]);

    // Check if search matches answer text (to auto-expand)
    const shouldAutoExpand = (item: { question: string; answer: string }) => {
        if (!searchQuery.trim()) return false;
        const query = searchQuery.toLowerCase();
        const matchesAnswer = item.answer.toLowerCase().includes(query);
        const matchesQuestion = item.question.toLowerCase().includes(query);
        // Auto-expand if answer matches but question doesn't
        return matchesAnswer && !matchesQuestion;
    };

    const hasResults = filteredFAQData.length > 0;

    return (
        <>
            <PageSEO
                title="FAQ | Child Support Calculator Australia"
                description="Frequently asked questions about Australian child support calculations, Change of Assessment applications, care arrangements, and connecting with family law professionals."
                canonicalPath="/faq"
                schema={faqSchema}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                {/* Header */}
                <CalculatorHeader title="FAQ" showBackButton={true} maxWidth={MAX_CALCULATOR_WIDTH} />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, webContainerStyle]}
                >
                    {/* Page Title */}
                    {/* @ts-ignore - Web-only ARIA attributes */}
                    <Text style={styles.pageTitle} accessibilityRole="header" aria-level="1">
                        Frequently Asked Questions
                    </Text>

                    <Text style={styles.introText}>
                        Find answers to common questions about child support in Australia.
                    </Text>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search FAQs..."
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            accessibilityLabel="Search frequently asked questions"
                            accessibilityRole="search"
                        />
                    </View>

                    {/* No Results Message */}
                    {!hasResults && (
                        <View style={styles.noResultsContainer}>
                            <Text style={styles.noResultsText}>
                                No FAQs match your search. Try different keywords or{' '}
                                <Text
                                    style={styles.clearSearchLink}
                                    onPress={() => setSearchQuery('')}
                                >
                                    clear your search
                                </Text>
                                .
                            </Text>
                        </View>
                    )}

                    {/* FAQ Categories */}
                    {filteredFAQData.map((category) => (
                        <View key={category.category} style={styles.categorySection}>
                            {/* @ts-ignore - Web-only ARIA attributes */}
                            <Text style={styles.categoryTitle} accessibilityRole="header" aria-level="2">
                                {category.category}
                            </Text>

                            {category.questions.map((item, index) => (
                                <Accordion
                                    key={`${category.category}-${item.question}-${searchQuery}`}
                                    title={item.question}
                                    defaultOpen={shouldAutoExpand(item)}
                                >
                                    <Text style={styles.answer}>{item.answer}</Text>
                                </Accordion>
                            ))}
                        </View>
                    ))}

                    {/* CTA Section */}
                    {hasResults && (
                        <View style={styles.ctaSection}>
                            <Text style={styles.ctaText}>Need answers for your specific situation?</Text>
                            <View style={styles.ctaButtons}>
                                <Pressable
                                    style={[styles.primaryButton, isWeb && webClickableStyles]}
                                    onPress={() => router.push('/')}
                                    accessibilityRole="button"
                                >
                                    <Text style={styles.primaryButtonText}>Try Calculator</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.secondaryButton, isWeb && webClickableStyles]}
                                    onPress={() => router.push('/lawyer-inquiry')}
                                    accessibilityRole="button"
                                >
                                    <Text style={styles.secondaryButtonText}>Get Legal Help</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        backgroundColor: '#ffffff',
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
    },
    backButtonText: {
        fontSize: 14,
        color: '#2563EB',
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 8,
    },
    introText: {
        fontSize: 16,
        color: '#475569',
        lineHeight: 24,
        marginBottom: 16,
    },
    searchContainer: {
        marginBottom: 24,
    },
    searchInput: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1e293b',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    noResultsContainer: {
        backgroundColor: '#fef3c7',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#fbbf24',
    },
    noResultsText: {
        fontSize: 15,
        color: '#78350f',
        lineHeight: 22,
        textAlign: 'center',
    },
    clearSearchLink: {
        color: '#2563EB',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    categorySection: {
        marginBottom: 24,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2563EB',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#2563EB',
    },
    answer: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 22,
    },
    ctaSection: {
        backgroundColor: '#eff6ff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginTop: 8,
    },
    ctaText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 16,
    },
    ctaButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    primaryButton: {
        backgroundColor: '#2563EB',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#2563EB',
    },
    secondaryButtonText: {
        color: '#2563EB',
        fontSize: 15,
        fontWeight: '600',
    },
});
