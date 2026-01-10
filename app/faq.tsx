import { PageSEO } from '@/src/components/seo/PageSEO';
import { MAX_FORM_WIDTH, isWeb, webClickableStyles } from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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

    const webContainerStyle = isWeb
        ? {
            maxWidth: MAX_FORM_WIDTH,
            width: '100%' as const,
            alignSelf: 'center' as const,
        }
        : {};

    return (
        <>
            <PageSEO
                title="FAQ | Child Support Calculator Australia"
                description="Frequently asked questions about Australian child support calculations, Change of Assessment applications, and connecting with family law professionals."
                canonicalPath="/faq"
                schema={faqSchema}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable
                        style={[styles.backButton, isWeb && webClickableStyles]}
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/');
                            }
                        }}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                    >
                        <Text style={styles.backButtonText}>{'<'} Back</Text>
                    </Pressable>
                </View>

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

                    {/* FAQ Categories */}
                    {FAQ_DATA.map((category) => (
                        <View key={category.category} style={styles.categorySection}>
                            {/* @ts-ignore - Web-only ARIA attributes */}
                            <Text style={styles.categoryTitle} accessibilityRole="header" aria-level="2">
                                {category.category}
                            </Text>

                            {category.questions.map((item, index) => (
                                <View key={index} style={styles.faqItem}>
                                    <Text style={styles.question}>{item.question}</Text>
                                    <Text style={styles.answer}>{item.answer}</Text>
                                </View>
                            ))}
                        </View>
                    ))}

                    {/* CTA Section */}
                    <View style={styles.ctaSection}>
                        <Text style={styles.ctaText}>Still have questions?</Text>
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
        marginBottom: 24,
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
    faqItem: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        ...createShadow({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 1,
        }),
    },
    question: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 8,
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
