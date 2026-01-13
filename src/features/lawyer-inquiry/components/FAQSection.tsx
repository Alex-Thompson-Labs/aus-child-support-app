/**
 * FAQ Section Component
 *
 * Displays frequently asked questions in an accordion format.
 * These FAQs match the FAQPage schema defined in app/lawyer-inquiry.tsx
 */

import Accordion from '@/src/components/ui/Accordion';
import { useAppTheme } from '@/src/theme';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const LAWYER_INQUIRY_FAQS = [
    {
        question: 'How do I request a child support review?',
        answer:
            'You can request a Change of Assessment through Services Australia if you believe special circumstances justify a different child support amount. Our form connects you with family law professionals who can advise on your eligibility.',
    },
    {
        question: 'What is a Change of Assessment?',
        answer:
            'A Change of Assessment is an application to Services Australia to review your child support based on 10 special circumstances, such as high contact costs, hidden income, or property settlements.',
    },
    {
        question: 'How long does a lawyer inquiry take?',
        answer:
            'After submitting your details, a family law professional will typically contact you within 1-2 business days to discuss your situation.',
    },
    {
        question: 'Is my information confidential?',
        answer:
            'Yes. Your personal and financial information is securely transmitted and only shared with the legal professionals who will be reviewing your case.',
    },
];

export function FAQSection() {
    const { colors } = useAppTheme();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            marginTop: 24,
            marginBottom: 16,
        },
        title: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.textSecondary,
            marginBottom: 16,
        },
        answerText: {
            fontSize: 14,
            lineHeight: 22,
            color: colors.textMuted,
        },
    }), [colors]);

    return (
        <View style={styles.container}>
            {/* @ts-ignore - Web-only ARIA attributes */}
            <Text style={styles.title} accessibilityRole="header" aria-level="2">
                Frequently Asked Questions
            </Text>
            {LAWYER_INQUIRY_FAQS.map((faq, index) => (
                <Accordion key={index} title={faq.question}>
                    <Text style={styles.answerText}>{faq.answer}</Text>
                </Accordion>
            ))}
        </View>
    );
}
