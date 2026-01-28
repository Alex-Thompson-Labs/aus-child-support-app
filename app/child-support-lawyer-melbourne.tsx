import { ContextualWizard } from '@/src/components/blog/ContextualWizard';
import { PageSEO } from '@/src/components/seo/PageSEO';
import { CalculatorHeader } from '@/src/features/calculator';
import { MAX_CALCULATOR_WIDTH, isWeb, webClickableStyles } from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'How much does a child support lawyer cost in Melbourne?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Family lawyers in Melbourne charge: Hourly rates $300-$550, Initial consultations $250-$450, Fixed-fee consent orders from $2,500, Court representation $3,500+ per day. Many firms offer payment plans or fixed-fee packages for specific services.',
            },
        },
        {
            '@type': 'Question',
            name: 'Where is the Family Court in Melbourne?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'The main Federal Circuit and Family Court registry in Melbourne is located at the Owen Dixon Commonwealth Law Courts Building, 305 William Street, Melbourne VIC 3000. There is also a registry in Dandenong (53-55 Robinson Street).',
            },
        },
        {
            '@type': 'Question',
            name: 'Do I need a lawyer for child support in Victoria?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'For standard assessments, no. But for complex matters like departure orders, adult child maintenance, or disputes over private school fees, legal representation sits highly recommended to navigate the court system effectively.',
            },
        },
    ],
};

const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://auschildsupport.com.au/',
        },
        {
            '@type': 'ListItem',
            position: 2,
            name: 'Melbourne Child Support Lawyers',
            item: 'https://auschildsupport.com.au/child-support-lawyer-melbourne',
        },
    ],
};

const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Child Support Lawyers Melbourne',
    description: 'Find specialist child support lawyers in Melbourne and Victoria. Free calculator and legal referrals for complex family law matters.',
    areaServed: {
        '@type': 'City',
        name: 'Melbourne',
    },
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Melbourne',
        addressRegion: 'VIC',
        addressCountry: 'AU',
    },
    priceRange: '$$',
};

export default function MelbourneLawyerPage() {
    const router = useRouter();
    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="Melbourne Child Support Lawyers | Free Calculator"
                description="Find child support lawyers in Melbourne. Free calculator + no-cost referrals to Victorian family law specialists. Compare rates ($300-$550/hr) before you hire."
                canonicalPath="/child-support-lawyer-melbourne"
                schema={[localBusinessSchema, faqSchema, breadcrumbSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Melbourne Child Support Lawyers' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <CalculatorHeader
                    title="Melbourne Lawyers"
                    showBackButton={true}
                    maxWidth={MAX_CALCULATOR_WIDTH}
                />

                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.headerSection}>
                        <Text style={styles.locationTag}>Melbourne, VIC</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            Child Support Lawyers in Melbourne
                        </Text>
                        <Text style={styles.subtitle}>
                            Navigate Victorian family law with confidence. Calculate your assessment for free, then find specialist legal help.
                        </Text>
                    </View>

                    {/* Calculator CTA */}
                    <View style={styles.calculatorCard}>
                        <Text style={styles.cardTitle}>Check Your Entitlements First</Text>
                        <Text style={styles.cardText}>
                            Use our free 2026 calculator to check your assessment before paying legal fees.
                            Knowing your numbers gives you a stronger position.
                        </Text>
                        <Pressable
                            style={[styles.primaryButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.primaryButtonText}>Use Free Calculator</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Child Support in Victoria</Text>
                    <Text style={styles.paragraph}>
                        While child support is national, local factors in Melbourne like high housing costs and private education
                        often trigger Change of Assessment applications (Reason 8: High costs of access).
                    </Text>
                    <Text style={styles.paragraph}>
                        Melbourne family courts handle thousands of child support matters annually, particularly{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/special-circumstances')}
                        >
                            Change of Assessment applications
                        </Text>{' '}
                        (when the formula produces an unfair result):
                    </Text>

                    <View style={styles.listContainer}>
                        <Text style={styles.bulletItem}>• Departure applications (when the formula produces an unfair result)</Text>
                        <Text style={styles.bulletItem}>• Enforcement of arrears (recovering unpaid support)</Text>
                        <Text style={styles.bulletItem}>• Private school fee disputes</Text>
                        <Text style={styles.bulletItem}>• Binding Child Support Agreements (financial agreements)</Text>
                    </View>

                    <View style={styles.locationBox}>
                        <Text style={styles.locationTitle}>📍 Court Locations in Melbourne:</Text>
                        <Text style={styles.locationText}>
                            <Text style={styles.bold}>Melbourne Registry:</Text> 305 William Street, Melbourne VIC 3000
                        </Text>
                        <Text style={styles.locationText}>
                            <Text style={styles.bold}>Dandenong Registry:</Text> 53-55 Robinson Street, Dandenong VIC 3175
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Legal Costs in Melbourne</Text>
                    <Text style={styles.paragraph}>
                        Expect to pay for quality representation, but many firms offer clear fee structures.
                    </Text>

                    <View style={styles.costGrid}>
                        <View style={styles.costItem}>
                            <Text style={styles.costLabel}>Hourly Rate</Text>
                            <Text style={styles.costValue}>$300 - $550</Text>
                        </View>
                        <View style={styles.costItem}>
                            <Text style={styles.costLabel}>Initial Consult</Text>
                            <Text style={styles.costValue}>$250 - $450</Text>
                        </View>
                        <View style={styles.costItem}>
                            <Text style={styles.costLabel}>Agreement</Text>
                            <Text style={styles.costValue}>$2,500+</Text>
                        </View>
                        <View style={styles.costItem}>
                            <Text style={styles.costLabel}>Court Day</Text>
                            <Text style={styles.costValue}>$3,500+</Text>
                        </View>
                    </View>

                    <View style={styles.tipBox}>
                        <Text style={styles.tipTitle}>💡 Pro Tip:</Text>
                        <Text style={styles.tipText}>
                            Ask for a &ldquo;Costs Agreement&rdquo; upfront. This document outlines estimated total costs for each stage
                            of your matter so there are no surprises.
                        </Text>
                    </View>

                    <Text style={styles.paragraph}>
                        Before paying legal fees, explore{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/child-support-reduction-strategies')}
                        >
                            strategies to reduce your child support
                        </Text>{' '}
                        that you can implement yourself.
                    </Text>

                    <Text style={styles.h2} accessibilityRole="header">When to Hire a Lawyer</Text>

                    <Text style={styles.paragraph}>
                        Not sure if your situation requires legal help? Read our guide on{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/when-to-hire-family-lawyer')}
                        >
                            when you need a lawyer vs DIY calculator
                        </Text>{' '}
                        to make an informed decision.
                    </Text>

                    <View style={styles.comparisonTable}>
                        <View style={styles.tableRowHeader}>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>DIY with Calculator</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Hire a Lawyer</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Standard PAYG income</Text>
                            <Text style={styles.tableCell}>Business / Trust / Cash income</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Agreed care %</Text>
                            <Text style={styles.tableCell}>Disputed care nights</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Good communication</Text>
                            <Text style={styles.tableCell}>High conflict / AVO / IVO</Text>
                        </View>
                    </View>

                    {/* Contextual Wizard */}
                    <ContextualWizard
                        preselectedFactors={[]}
                        blogTopic="melbourne_lawyer"
                        ctaText="Find Melbourne Lawyers"
                        analyticsSource="page_melbourne_lawyer"
                        title="Find a Melbourne Specialist"
                        description="Share your details to connect with experienced family lawyers in Melbourne or Dandenong."
                    />

                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <View style={styles.faqContainer}>
                        <FAQItem
                            question="How much does a child support lawyer cost in Melbourne?"
                            answer="Family lawyers in Melbourne charge: Hourly rates $300-$550, Initial consultations $250-$450, Fixed-fee consent orders from $2,500, Court representation $3,500+ per day. Many firms offer payment plans or fixed-fee packages."
                        />
                        <FAQItem
                            question="Where is the Family Court in Melbourne?"
                            answer="The main Federal Circuit and Family Court registry in Melbourne is located at the Owen Dixon Commonwealth Law Courts Building, 305 William Street, Melbourne VIC 3000. There is also a registry in Dandenong (53-55 Robinson Street)."
                        />
                    </View>

                    <View style={styles.finalCta}>
                        <Text style={styles.finalCtaTitle}>Get Legal Help in Victoria</Text>
                        <Text style={styles.finalCtaText}>
                            Connect with Victorian family lawyers who understand the local court system and child support complexities.
                        </Text>
                        <Pressable
                            style={[styles.primaryButton, styles.finalButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct&city=Melbourne')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.primaryButtonText}>Find a Lawyer Now</Text>
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

    headerSection: { marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    locationTag: { fontSize: 13, fontWeight: '700', color: '#2563EB', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    h1: { fontSize: 32, fontWeight: '800', color: '#1e3a8a', marginBottom: 12, lineHeight: 40 },
    subtitle: { fontSize: 18, color: '#475569', lineHeight: 28 },

    h2: { fontSize: 24, fontWeight: '700', color: '#1e3a8a', marginTop: 32, marginBottom: 16 },
    paragraph: { fontSize: 16, lineHeight: 26, color: '#475569', marginBottom: 16 },

    calculatorCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 24, marginBottom: 32, borderWidth: 1, borderColor: '#bfdbfe', alignItems: 'center' },
    cardTitle: { fontSize: 20, fontWeight: '700', color: '#1e3a8a', marginBottom: 8 },
    cardText: { fontSize: 15, lineHeight: 24, color: '#1e40af', textAlign: 'center', marginBottom: 20 },

    primaryButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 24, ...createShadow({ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }) },
    primaryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },

    listContainer: { marginBottom: 24 },
    bulletItem: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8, paddingLeft: 8 },

    locationBox: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#e2e8f0' },
    locationTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a', marginBottom: 12 },
    locationText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 8 },
    bold: { fontWeight: '600', color: '#0f172a' },

    costGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
    costItem: { flex: 1, minWidth: 140, backgroundColor: '#ffffff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
    costLabel: { fontSize: 13, color: '#64748b', marginBottom: 4, textTransform: 'uppercase', fontWeight: '600' },
    costValue: { fontSize: 18, color: '#2563EB', fontWeight: '700' },

    tipBox: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#86efac' },
    tipTitle: { fontSize: 16, fontWeight: '700', color: '#14532d', marginBottom: 6 },
    tipText: { fontSize: 15, lineHeight: 24, color: '#14532d' },

    comparisonTable: { backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 32 },
    tableRowHeader: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', padding: 12 },
    tableHeader: { fontSize: 14, fontWeight: '700', color: '#475569' },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f8fafc', padding: 12 },
    tableCell: { flex: 1, fontSize: 14, color: '#334155' },

    faqContainer: { gap: 12, marginBottom: 32 },
    faqItem: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    faqQuestion: { fontSize: 16, fontWeight: '600', color: '#1e3a8a', marginBottom: 8 },
    faqAnswer: { fontSize: 15, lineHeight: 24, color: '#475569' },

    finalCta: { backgroundColor: '#1e3a8a', borderRadius: 16, padding: 32, alignItems: 'center' },
    finalCtaTitle: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 12, textAlign: 'center' },
    finalCtaText: { fontSize: 16, color: '#bfdbfe', textAlign: 'center', marginBottom: 24, lineHeight: 24 },
    finalButton: { backgroundColor: '#ffffff', width: '100%', maxWidth: 300, alignItems: 'center' },

    inlineLink: {
        color: '#2563EB',
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
});
