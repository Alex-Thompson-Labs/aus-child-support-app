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
            name: 'How much does a child support lawyer cost in Sydney?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Sydney family lawyers charge $350-$600/hour. Initial consultations cost $300-$500. A Change of Assessment application typically costs $3,000-$6,000 total. Complex court proceedings cost significantly more. Many firms offer fixed-fee packages.',
            },
        },
        {
            '@type': 'Question',
            name: 'Where is the Family Court in Sydney?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'The Federal Circuit and Family Court of Australia has registries in Sydney (Lionel Bowen Building, 97-99 Goulburn Street) and Parramatta (Garfield Barwick Commonwealth Law Courts Building, 1-3 George Street). Most child support matters are heard in these courts.',
            },
        },
        {
            '@type': 'Question',
            name: 'Do I need a lawyer for child support in NSW?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'You don&apos;t need a lawyer for standard assessments handled by Services Australia. However, you should hire a lawyer if you are applying for a Change of Assessment, disputing paternity, have complex income structures (trusts/companies), or if the other parent has legal representation.',
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
            name: 'Sydney Child Support Lawyers',
            item: 'https://auschildsupport.com.au/child-support-lawyer-sydney',
        },
    ],
};

const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Child Support Lawyers Sydney',
    description: 'Find specialist child support lawyers in Sydney. Free calculator and legal referrals for Change of Assessment, arrears, and complex family law matters.',
    areaServed: {
        '@type': 'City',
        name: 'Sydney',
    },
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sydney',
        addressRegion: 'NSW',
        addressCountry: 'AU',
    },
    priceRange: '$$',
};

export default function SydneyLawyerPage() {
    const router = useRouter();
    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="Child Support Lawyers Sydney 2026: Free Calculator & Referrals"
                description="Find child support lawyers in Sydney. Free calculator + no-cost referrals to NSW family law experts. Compare rates ($350-$600/hr) and court locations."
                canonicalPath="/child-support-lawyer-sydney"
                schema={[localBusinessSchema, faqSchema, breadcrumbSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Sydney Child Support Lawyers' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <CalculatorHeader
                    title="Sydney Lawyers"
                    showBackButton={true}
                    maxWidth={MAX_CALCULATOR_WIDTH}
                />

                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.headerSection}>
                        <Text style={styles.locationTag}>Sydney, NSW</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            Child Support Lawyers in Sydney
                        </Text>
                        <Text style={styles.subtitle}>
                            Compare your assessment with our free calculator, then connect with top-rated Sydney family lawyers for complex cases.
                        </Text>
                    </View>

                    {/* Calculator CTA - Value First */}
                    <View style={styles.calculatorCard}>
                        <Text style={styles.cardTitle}>Before You Hire a Lawyer...</Text>
                        <Text style={styles.cardText}>
                            Check your accurate child support assessment using the 2026 Services Australia formula.
                            Many parents find they don&apos;t need a lawyer once they understand the calculation.
                        </Text>
                        <Pressable
                            style={[styles.primaryButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.primaryButtonText}>Use Free Calculator</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">How Child Support Works in NSW</Text>
                    <Text style={styles.paragraph}>
                        In New South Wales, child support is governed by federal legislation (Child Support Assessment Act)
                        but disputes are often heard in local registries of the Federal Circuit and Family Court of Australia.
                    </Text>
                    <Text style={styles.paragraph}>
                        Sydney parents often face unique challenges including high costs of living,{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/private-school-fees-child-support')}
                        >
                            private school fee disputes
                        </Text>, and complex income structures. While Services Australia handles standard assessments,
                        NSW courts deal with:
                    </Text>

                    <View style={styles.listContainer}>
                        <Text style={styles.bulletItem}>• Departure orders (appealing assessment decisions)</Text>
                        <Text style={styles.bulletItem}>• Paternity disputes</Text>
                        <Text style={styles.bulletItem}>• Adult child maintenance (for children over 18)</Text>
                        <Text style={styles.bulletItem}>
                            •{' '}
                            <Text
                                style={styles.inlineLink}
                                onPress={() => router.push('/blog/binding-child-support-agreement')}
                            >
                                Binding Child Support Agreements
                            </Text>{' '}
                            (private arrangements outside Services Australia)
                        </Text>
                    </View>

                    <View style={styles.locationBox}>
                        <Text style={styles.locationTitle}>📍 Court Locations in Sydney:</Text>
                        <Text style={styles.locationText}>
                            <Text style={styles.bold}>Sydney Registry:</Text> Lionel Bowen Building, 97-99 Goulburn Street, Sydney NSW 2000
                        </Text>
                        <Text style={styles.locationText}>
                            <Text style={styles.bold}>Parramatta Registry:</Text> 1-3 George Street, Parramatta NSW 2150
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Average Lawyer Costs in Sydney</Text>
                    <Text style={styles.paragraph}>
                        Sydney family lawyers tend to charge slightly higher rates than the national average due to
                        higher operating costs.
                    </Text>

                    <View style={styles.costGrid}>
                        <View style={styles.costItem}>
                            <Text style={styles.costLabel}>Hourly Rate</Text>
                            <Text style={styles.costValue}>$350 - $600</Text>
                        </View>
                        <View style={styles.costItem}>
                            <Text style={styles.costLabel}>Initial Consult</Text>
                            <Text style={styles.costValue}>$300 - $500</Text>
                        </View>
                        <View style={styles.costItem}>
                            <Text style={styles.costLabel}>Agreement</Text>
                            <Text style={styles.costValue}>$2,500+</Text>
                        </View>
                        <View style={styles.costItem}>
                            <Text style={styles.costLabel}>Court Day</Text>
                            <Text style={styles.costValue}>$4,000+</Text>
                        </View>
                    </View>

                    <View style={styles.tipBox}>
                        <Text style={styles.tipTitle}>💡 Cost Saving Tip:</Text>
                        <Text style={styles.tipText}>
                            Many Sydney firms offer a &quot;fixed fee&quot; initial consultation. Use this to get strategic advice
                            on your specific situation before committing to ongoing representation.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">When to Hire a Lawyer vs Use Calculator</Text>

                    <Text style={styles.paragraph}>
                        Still unsure? Our detailed guide explains{' '}
                        <Text
                            style={styles.inlineLink}
                            onPress={() => router.push('/blog/when-to-hire-family-lawyer')}
                        >
                            when to hire a family lawyer
                        </Text>{' '}
                        versus handling child support yourself.
                    </Text>

                    <View style={styles.comparisonTable}>
                        <View style={styles.tableRowHeader}>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Use Calculator When...</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Hire Lawyer When...</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Simple separation (employees)</Text>
                            <Text style={styles.tableCell}>Self-employed / Trust income</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Standard care (e.g. 50/50)</Text>
                            <Text style={styles.tableCell}>Disputed care arrangements</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Both parents cooperate</Text>
                            <Text style={styles.tableCell}>High conflict / Threats</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Agree on school fees</Text>
                            <Text style={styles.tableCell}>Disputed private school fees</Text>
                        </View>
                    </View>

                    {/* Contextual Wizard */}
                    <ContextualWizard
                        preselectedFactors={[]}
                        blogTopic="sydney_lawyer"
                        ctaText="Find Sydney Lawyers"
                        analyticsSource="page_sydney_lawyer"
                        title="Match With a Sydney Specialist"
                        description="Tell us about your situation to connect with the right family lawyer in Sydney or Parramatta."
                    />

                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <View style={styles.faqContainer}>
                        <FAQItem
                            question="How much does a child support lawyer cost in Sydney?"
                            answer="Sydney family lawyers charge $350-$600/hour. Initial consultations cost $300-$500. A Change of Assessment application typically costs $3,000-$6,000 total. Complex court proceedings cost significantly more."
                        />
                        <FAQItem
                            question="Where is the Family Court in Sydney?"
                            answer="The Federal Circuit and Family Court of Australia has registries in Sydney (Lionel Bowen Building, 97-99 Goulburn Street) and Parramatta (Garfield Barwick Commonwealth Law Courts Building, 1-3 George Street). Most child support matters are heard in these courts."
                        />
                        <FAQItem
                            question="Do I need a lawyer for child support in NSW?"
                            answer="You don&apos;t need a lawyer for standard assessments handled by Services Australia. However, you should hire a lawyer if you are applying for a Change of Assessment, disputing paternity, have complex income structures (trusts/companies), or if the other parent has legal representation."
                        />
                    </View>

                    <View style={styles.finalCta}>
                        <Text style={styles.finalCtaTitle}>Get Legal Help in Sydney</Text>
                        <Text style={styles.finalCtaText}>
                            Connect with experienced family lawyers who understand NSW courts and child support laws.
                        </Text>
                        <Pressable
                            style={[styles.primaryButton, styles.finalButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct&city=Sydney')}
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
