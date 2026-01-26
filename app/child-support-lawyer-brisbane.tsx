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
            name: 'How much does a child support lawyer cost in Brisbane?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Family lawyers in Brisbane typically charge between $300 and $500 per hour, which is slightly lower than Sydney or Melbourne rates. Initial consultations usually range from $220 to $440. Fixed fee arrangements are becoming common for specific tasks like binding child support agreements.',
            },
        },
        {
            '@type': 'Question',
            name: 'Where is the Family Court in Brisbane?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'The Federal Circuit and Family Court registry in Brisbane is located at the Harry Gibbs Commonwealth Law Courts Building, 119 North Quay, Brisbane City QLD 4000. This is where most child support disputes and family law matters are heard.',
            },
        },
        {
            '@type': 'Question',
            name: 'Do I need a lawyer for child support in Queensland?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'For routine assessments managed by Services Australia, legal representation isn\'t required. However, considering Queensland\'s high rate of self-employment and small business ownership, lawyers are essential for complex income assessments, business valuations, and binding agreements.',
            },
        },
    ],
};

const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Child Support Lawyers Brisbane',
    description: 'Find specialist child support lawyers in Brisbane and Queensland. Free calculator and legal referrals for complex family law matters.',
    areaServed: {
        '@type': 'City',
        name: 'Brisbane',
    },
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Brisbane',
        addressRegion: 'QLD',
        addressCountry: 'AU',
    },
    priceRange: '$$',
};

export default function BrisbaneLawyerPage() {
    const router = useRouter();
    const webContainerStyle = isWeb ? { maxWidth: MAX_CALCULATOR_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

    return (
        <>
            <PageSEO
                title="Child Support Lawyers Brisbane: Free Calculator & Legal Referrals"
                description="Expert child support lawyers in Brisbane. Get matched with top Queensland family lawyers for complex assessments and court matters. Free initial consultation referrals."
                canonicalPath="/child-support-lawyer-brisbane"
                schema={[localBusinessSchema, faqSchema]}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Brisbane Child Support Lawyers' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <CalculatorHeader
                    title="Brisbane Lawyers"
                    showBackButton={true}
                    maxWidth={MAX_CALCULATOR_WIDTH}
                />

                <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, webContainerStyle]}>
                    <View style={styles.headerSection}>
                        <Text style={styles.locationTag}>Brisbane, QLD</Text>
                        <Text style={styles.h1} accessibilityRole="header">
                            Child Support Lawyers in Brisbane
                        </Text>
                        <Text style={styles.subtitle}>
                            Expert family law advice for Queensland parents. Calculate your assessment first, then find the right legal help.
                        </Text>
                    </View>

                    {/* Calculator CTA */}
                    <View style={styles.calculatorCard}>
                        <Text style={styles.cardTitle}>Know Your Numbers First</Text>
                        <Text style={styles.cardText}>
                            Don't walk into a lawyer's office without the facts. Use our free 2026 calculator
                            to verify your Services Australia assessment instantly.
                        </Text>
                        <Pressable
                            style={[styles.primaryButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.primaryButtonText}>Use Free Calculator</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Child Support in Queensland</Text>
                    <Text style={styles.paragraph}>
                        Queensland parents often face unique child support challenges, particularly involving mining sector
                        incomes (FIFO), small business ownership, and interstate relocation disputes.
                    </Text>
                    <Text style={styles.paragraph}>
                        The Brisbane family courts regularly hear matters regarding:
                    </Text>

                    <View style={styles.listContainer}>
                        <Text style={styles.bulletItem}>• Income determination for self-employed parents</Text>
                        <Text style={styles.bulletItem}>• Departure orders due to high costs of access (travel for visitation)</Text>
                        <Text style={styles.bulletItem}>• Recovery of unpaid child support arrears</Text>
                        <Text style={styles.bulletItem}>• Binding Child Support Agreements</Text>
                    </View>

                    <View style={styles.locationBox}>
                        <Text style={styles.locationTitle}>📍 Court Location in Brisbane:</Text>
                        <Text style={styles.locationText}>
                            <Text style={styles.bold}>Brisbane Registry:</Text> Harry Gibbs Commonwealth Law Courts Building, 119 North Quay, Brisbane City QLD 4000
                        </Text>
                        <Text style={styles.locationText}>
                            Also serving Gold Coast, Sunshine Coast, and Ipswich regions via circuit courts.
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">Legal Costs in Brisbane</Text>
                    <Text style={styles.paragraph}>
                        Legal fees in Brisbane are generally competitive compared to southern capitals.
                    </Text>

                    <View style={styles.costGrid}>
                        <View style={styles.costItem}>
                            <Text style={styles.costLabel}>Hourly Rate</Text>
                            <Text style={styles.costValue}>$300 - $500</Text>
                        </View>
                        <View style={styles.costItem}>
                            <Text style={styles.costLabel}>Initial Consult</Text>
                            <Text style={styles.costValue}>$220 - $440</Text>
                        </View>
                        <View style={styles.costItem}>
                            <Text style={styles.costLabel}>Agreement</Text>
                            <Text style={styles.costValue}>$2,200+</Text>
                        </View>
                        <View style={styles.costItem}>
                            <Text style={styles.costLabel}>Court Day</Text>
                            <Text style={styles.costValue}>$3,300+</Text>
                        </View>
                    </View>

                    <View style={styles.tipBox}>
                        <Text style={styles.tipTitle}>💡 Cost Strategy:</Text>
                        <Text style={styles.tipText}>
                            For non-urgent matters, seek a "Binding Child Support Agreement" rather than court orders.
                            This is often faster and cheaper ($2,000-$4,000) than litigation ($10,000+).
                        </Text>
                    </View>

                    <Text style={styles.h2} accessibilityRole="header">When to Hire a Lawyer</Text>

                    <View style={styles.comparisonTable}>
                        <View style={styles.tableRowHeader}>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>DIY with Calculator</Text>
                            <Text style={[styles.tableHeader, { flex: 1 }]}>Hire a Lawyer</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Standard employee income</Text>
                            <Text style={styles.tableCell}>FIFO / Mining / Business income</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Local parents</Text>
                            <Text style={styles.tableCell}>Interstate / Overseas relocation</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Amicable relationship</Text>
                            <Text style={styles.tableCell}>Domestic violence concerns</Text>
                        </View>
                    </View>

                    {/* Contextual Wizard */}
                    <ContextualWizard
                        preselectedFactors={[]}
                        blogTopic="brisbane_lawyer"
                        ctaText="Find Brisbane Lawyers"
                        analyticsSource="page_brisbane_lawyer"
                        title="Find a Queensland Specialist"
                        description="Share your details to connect with experienced family lawyers in Brisbane and surrounds."
                    />

                    <Text style={styles.h2} accessibilityRole="header">Frequently Asked Questions</Text>

                    <View style={styles.faqContainer}>
                        <FAQItem
                            question="How much does a child support lawyer cost in Brisbane?"
                            answer="Family lawyers in Brisbane typically charge between $300 and $500 per hour, which is slightly lower than Sydney or Melbourne rates. Initial consultations usually range from $220 to $440. Fixed fee arrangements are becoming common for specific tasks like binding child support agreements."
                        />
                        <FAQItem
                            question="Where is the Family Court in Brisbane?"
                            answer="The Federal Circuit and Family Court registry in Brisbane is located at the Harry Gibbs Commonwealth Law Courts Building, 119 North Quay, Brisbane City QLD 4000. This is where most child support disputes and family law matters are heard."
                        />
                    </View>

                    <View style={styles.finalCta}>
                        <Text style={styles.finalCtaTitle}>Get Legal Help in Queensland</Text>
                        <Text style={styles.finalCtaText}>
                            Connect with Brisbane family lawyers who understand local challenges like FIFO adjustments and business income.
                        </Text>
                        <Pressable
                            style={[styles.primaryButton, styles.finalButton, isWeb && webClickableStyles]}
                            onPress={() => router.push('/lawyer-inquiry?mode=direct&city=Brisbane')}
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
});
