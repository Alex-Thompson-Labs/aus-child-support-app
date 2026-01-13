import { PageSEO } from '@/src/components/seo/PageSEO';
import { CalculatorHeader } from '@/src/features/calculator';
import { MAX_FORM_WIDTH, isWeb, webClickableStyles } from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
        url: 'https://auschildsupport.com',
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
            maxWidth: MAX_FORM_WIDTH,
            width: '100%' as const,
            alignSelf: 'center' as const,
        }
        : {};

    return (
        <>
            <PageSEO
                title="About | Child Support Calculator Australia"
                description="Learn about the free Australian Child Support Calculator. We use the official 2026 Services Australia formula to help parents estimate child support payments."
                canonicalPath="/about"
                schema={aboutSchema}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                {/* Header */}
                <CalculatorHeader title="About Us" showBackButton={true} maxWidth={MAX_FORM_WIDTH} />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, webContainerStyle]}
                >
                    {/* Page Title */}
                    {/* @ts-ignore - Web-only ARIA attributes */}
                    <Text style={styles.pageTitle} accessibilityRole="header" aria-level="1">
                        About AusChildSupport
                    </Text>

                    {/* Mission Section */}
                    <View style={styles.section}>
                        {/* @ts-ignore - Web-only ARIA attributes */}
                        <Text style={styles.sectionTitle} accessibilityRole="header" aria-level="2">
                            Our Mission
                        </Text>
                        <Text style={styles.bodyText}>
                            We provide a free, accurate Australian child support calculator using the official
                            Services Australia formula. Our goal is to help separated parents understand their
                            estimated child support obligations before contacting Services Australia.
                        </Text>
                    </View>

                    {/* How It Works Section */}
                    <View style={styles.section}>
                        {/* @ts-ignore - Web-only ARIA attributes */}
                        <Text style={styles.sectionTitle} accessibilityRole="header" aria-level="2">
                            How Our Calculator Works
                        </Text>
                        <Text style={styles.bodyText}>
                            Our calculator implements the official 8-step formula used by Services Australia
                            to calculate child support. This includes:
                        </Text>
                        <View style={styles.bulletList}>
                            <Text style={styles.bulletItem}>• Combined income calculations</Text>
                            <Text style={styles.bulletItem}>• Self-support amount deductions</Text>
                            <Text style={styles.bulletItem}>• Cost of children tables (2026 rates)</Text>
                            <Text style={styles.bulletItem}>• Care percentage adjustments</Text>
                            <Text style={styles.bulletItem}>• Relevant dependent considerations</Text>
                            <Text style={styles.bulletItem}>• Minimum and Fixed Annual Rate rules</Text>
                        </View>
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

                    {/* Contact Section */}
                    <View style={styles.section}>
                        {/* @ts-ignore - Web-only ARIA attributes */}
                        <Text style={styles.sectionTitle} accessibilityRole="header" aria-level="2">
                            Contact
                        </Text>
                        <Text style={styles.bodyText}>
                            For questions or feedback about the calculator, visit our blog or use the
                            lawyer inquiry form to connect with family law professionals.
                        </Text>
                        <View style={styles.buttonRow}>
                            <Pressable
                                style={[styles.primaryButton, isWeb && webClickableStyles]}
                                onPress={() => Linking.openURL('https://blog.auschildsupport.com')}
                                accessibilityRole="button"
                                accessibilityLabel="Visit our blog"
                            >
                                <Text style={styles.primaryButtonText}>Visit Blog</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.secondaryButton, isWeb && webClickableStyles]}
                                onPress={() => router.push('/')}
                                accessibilityRole="button"
                                accessibilityLabel="Return to calculator"
                            >
                                <Text style={styles.secondaryButtonText}>Calculator</Text>
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
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1e293b',
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
        backgroundColor: '#fef3c7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f59e0b',
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
        color: '#92400e',
        marginBottom: 8,
    },
    disclaimerText: {
        fontSize: 15,
        color: '#78350f',
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
