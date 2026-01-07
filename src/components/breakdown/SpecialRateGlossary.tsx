import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SpecialRateGlossaryProps {
    rateApplied: string;
}

/**
 * Displays an expandable glossary explaining FAR (Fixed Annual Rate) or MAR (Minimum Annual Rate).
 * Only renders when a special rate has been applied (rateApplied !== 'None').
 */
export function SpecialRateGlossary({ rateApplied }: SpecialRateGlossaryProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (rateApplied === 'None') {
        return null;
    }

    const isFarRate = rateApplied.includes('FAR');
    const title = isFarRate
        ? 'What is the Fixed Annual Rate?'
        : 'What is the Minimum Annual Rate?';

    return (
        <View style={styles.specialNotice}>
            <Pressable
                onPress={() => setIsExpanded((prev) => !prev)}
                style={styles.specialNoticeHeader}
                accessibilityRole="button"
                accessibilityLabel={`${title} ${isExpanded ? 'Expanded' : 'Collapsed'}. Tap to ${isExpanded ? 'collapse' : 'expand'}.`}
                accessibilityState={{ expanded: isExpanded }}
            >
                <Text style={styles.specialNoticeTitle}>{title}</Text>
                <Text style={styles.specialNoticeChevron}>
                    {isExpanded ? '▼' : '▶'}
                </Text>
            </Pressable>

            {isExpanded && (
                <View style={styles.specialNoticeContent}>
                    {isFarRate ? (
                        <>
                            <Text style={styles.specialNoticeText}>
                                The FAR is for low-income parents whose income doesn&apos;t
                                reflect their capacity to pay. It is a way to prevent parents
                                from reducing their payments by minimising their income. It is a
                                rate paid per child (maximum 3) and requires three eligibility
                                criteria be met:
                            </Text>
                            <Text style={styles.specialNoticeText}>
                                {'\n'}1. The parent must have less than 35% care of the child.
                                {'\n\n'}2. The income used in the assessment must be less than
                                the pension Parenting Payment (single) maximum basic amount -
                                $26,195 (2025)
                                {'\n\n'}3. The parent did not receive an income support payment
                                in the ATI.
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.specialNoticeText}>
                                The MAR is paid per case and is put in place for parents who
                                wouldn&apos;t be able to afford a higher amount. It requires
                                three eligibility criteria be met:
                            </Text>
                            <Text style={styles.specialNoticeText}>
                                {'\n'}1. The parent must have received at least one income
                                support payment in their ATI.
                                {'\n\n'}2. The parent has less than 14% care of all children.
                                {'\n\n'}3. The parent&apos;s ATI must be below the self-support
                                amount.
                            </Text>
                        </>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    specialNotice: {
        backgroundColor: '#f0f9ff',
        borderRadius: 8,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#0ea5e9',
        borderWidth: 1,
        borderColor: '#bae6fd',
    },
    specialNoticeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    specialNoticeTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0369a1',
        flex: 1,
    },
    specialNoticeChevron: {
        fontSize: 14,
        color: '#64748b',
        marginLeft: 8,
    },
    specialNoticeContent: {
        marginTop: 12,
    },
    specialNoticeText: {
        fontSize: 13,
        color: '#64748b', // Slate 500
        lineHeight: 18,
    },
});
