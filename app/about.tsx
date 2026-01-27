import { PageSEO } from '@/src/components/seo/PageSEO';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { CalculatorHeader } from '@/src/features/calculator';
import { MAX_CALCULATOR_WIDTH, isWeb, webClickableStyles } from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Schema.org structured data for About page
const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About AusChildSupport',
    description: 'Learn about the Australian Child Support Calculator - a free tool using the official 2026 Services Australia formula.',
    mainEntity: {
        '@type': 'Organization',
        name: 'AusChildSupport',
        url: 'https://auschildsupport.com.au',
        description: 'Free Australian child support calculator using official Services Australia formulas.',
        foundingDate: '2024',
        areaServed: {
            '@type': 'Country',
            name: 'Australia',
        },
    },
};

export default function AboutPage() {
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
                title="About | AusChildSupport"
                description="Learn about the free Australian Child Support Calculator. We use the official 2026 Services Australia formula to help parents estimate child support payments."
                canonicalPath="/about"
                schema={aboutSchema}
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'About' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                {/* Header */}
                <CalculatorHeader title="About Us" showBackButton={true} maxWidth={MAX_CALCULATOR_WIDTH} />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, webContainerStyle]}
                >
                    {/* Breadcrumb Navigation */}
                    <Breadcrumb items={[
                        { label: 'Home', path: '/' },
                        { label: 'About' },
                    ]} />

                    {/* Page Title - H1 for SEO */}
                    <Text 
                        style={styles.pageTitle} 
                        accessibilityRole="header"
                        // @ts-ignore - Web-only ARIA attributes
                        aria-level="1"
                    >
                        About AusChildSupport
                    </Text>

                    {/* Mission Section */}
                    <View style={styles.section}>
                        {/* @ts-ignore - Web-only ARIA attributes */}
                        <Text style={styles.sectionTitle} accessibilityRole="header" aria-level="2">
                            Our Mission
                        </Text>
                        <Text style={styles.bodyText}>
                            We provide the most comprehensive Australian child support tool available. We're the
                            only calculator that handles all 6 Services Australia formulas - from standard
                            separations to complex scenarios involving non-parent carers, overseas parents, and
                            deceased parents. Our goal is to provide accurate estimates while connecting parents
                            with specialist family law advice when complex situations arise.
                        </Text>
                    </View>

                    {/* How It Works Section */}
                    <View style={styles.section}>
                        {/* @ts-ignore - Web-only ARIA attributes */}
                        <Text style={styles.sectionTitle} accessibilityRole="header" aria-level="2">
                            How Our Calculator Works
                        </Text>
                        <Text style={styles.bodyText}>
                            We use the official 2026 Services Australia formulas to calculate child support
                            assessments for all scenarios:
                        </Text>
                        <View style={styles.bulletList}>
                            <Text style={styles.bulletItem}>• Formula 1: Standard separation (Single case)</Text>
                            <Text style={styles.bulletItem}>• Formula 2: Care provided by a Non-Parent Carer (e.g., Grandparent)</Text>
                            <Text style={styles.bulletItem}>• Formula 3: Parents with children from other relationships (Multi-case)</Text>
                            <Text style={styles.bulletItem}>• Formula 4: Non-parent carer with multi-case scenarios</Text>
                            <Text style={styles.bulletItem}>• Formula 5: Overseas parent in reciprocating jurisdiction</Text>
                            <Text style={styles.bulletItem}>• Formula 6: Deceased parent with non-parent carer</Text>
                        </View>
                        <Text style={[styles.bodyText, { marginTop: 12 }]}>
                            Our calculator provides accurate estimates using the 2026 cost of children tables,
                            care percentage adjustments, and relevant dependent considerations. We also identify
                            complex situations (income variations, court orders, Change of Assessment factors)
                            where specialist legal advice may be beneficial.
                        </Text>
                    </View>

                    {/* Disclaimer Section */}
                    <View style={styles.disclaimerCard}>
                        {/* @ts-ignore - Web-only ARIA attributes */}
                        <Text style={styles.disclaimerTitle} accessibilityRole="header" aria-level="2">
                            Important Disclaimer
                        </Text>
                        <Text style={styles.disclaimerText}>
                            This calculator provides estimates only. Official child support assessments are
                            made by Services Australia and may differ based on factors not captured here.
                            This tool is not a substitute for professional legal or financial advice.
                        </Text>
                    </View>

                    {/* Next Steps Section */}
                    <View style={styles.section}>
                        {/* @ts-ignore - Web-only ARIA attributes */}
                        <Text style={styles.sectionTitle} accessibilityRole="header" aria-level="2">
                            Next Steps
                        </Text>
                        <Text style={styles.bodyText}>
                            For questions or feedback about the calculator, visit our blog or use the
                            lawyer inquiry form to connect with family law professionals.
                        </Text>
                        <View style={styles.buttonRow}>
                            <Pressable
                                style={[styles.primaryButton, isWeb && webClickableStyles]}
                                onPress={() => router.push('/')}
                                accessibilityRole="button"
                                accessibilityLabel="Return to calculator"
                            >
                                <Text style={styles.primaryButtonText}>Calculator</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.secondaryButton, isWeb && webClickableStyles]}
                                onPress={() => router.push('/lawyer-inquiry')}
                                accessibilityRole="button"
                                accessibilityLabel="Contact a lawyer"
                            >
                                <Text style={styles.secondaryButtonText}>Talk to a Lawyer</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.secondaryButton, isWeb && webClickableStyles]}
                                onPress={() => Linking.openURL('https://blog.auschildsupport.com.au')}
                                accessibilityRole="button"
                                accessibilityLabel="Visit our blog"
                            >
                                <Text style={styles.secondaryButtonText}>Visit Blog</Text>
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
        fontSize: 32,
        fontWeight: '700',
        color: '#1e3a8a',
        marginBottom: 24,
        ...(Platform.OS === 'web' ? { lineHeight: 40 } : {}),
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 12,
    },
    bodyText: {
        fontSize: 16,
        color: '#475569',
        lineHeight: 26,
    },
    bulletList: {
        marginTop: 12,
        gap: 8,
    },
    bulletItem: {
        fontSize: 16,
        color: '#475569',
        lineHeight: 24,
        paddingLeft: 8,
    },
    disclaimerCard: {
        backgroundColor: '#eff6ff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#bfdbfe',
        padding: 20,
        marginBottom: 24,
        ...createShadow({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 3,
            elevation: 2,
        }),
    },
    disclaimerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 8,
    },
    disclaimerText: {
        fontSize: 15,
        color: '#1e40af',
        lineHeight: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    primaryButton: {
        backgroundColor: '#2563EB',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        ...createShadow({
            shadowColor: '#2563EB',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
        }),
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    secondaryButtonText: {
        color: '#2563EB',
        fontSize: 16,
        fontWeight: '600',
    },
});
