import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';

interface AdultChildMaintenanceCardProps {
    childIndex: number;
    childAge: number;
}

/**
 * Information card displayed for children aged 18+ who are excluded from
 * standard child support assessments. Provides information about Adult Child
 * Maintenance via court order and a CTA to contact a lawyer.
 */
export function AdultChildMaintenanceCard({
    childIndex,
    childAge,
}: AdultChildMaintenanceCardProps) {
    const router = useRouter();

    const handleContactLawyer = () => {
        router.push({
            pathname: '/lawyer-inquiry',
            params: {
                trigger: 'adult_child_maintenance',
                complexityTriggers: JSON.stringify(['adult_child_maintenance']),
            },
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.childLabel}>Child {childIndex + 1}</Text>
                <View style={styles.ageBadge}>
                    <Text style={styles.ageBadgeText}>Age {childAge}</Text>
                </View>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>
                    ⚠️ Adult Child (Age 18+)
                </Text>
                <Text style={styles.infoText}>
                    Services Australia cannot assess children over 18. You may be eligible
                    for Adult Child Maintenance via a Court Order if the child is in
                    tertiary education or has a disability.
                </Text>

                <Pressable
                    style={styles.ctaButton}
                    onPress={handleContactLawyer}
                    accessibilityRole="button"
                    accessibilityLabel="Speak to a lawyer about adult child maintenance"
                >
                    <Text style={styles.ctaButtonText}>
                        Speak to a Lawyer (Adult Maintenance)
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    childLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.textSecondary,
    },
    ageBadge: {
        backgroundColor: '#e0e7ff', // Indigo-100
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    ageBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#4338ca', // Indigo-700
    },
    infoBox: {
        backgroundColor: '#dbeafe', // Blue-100
        borderWidth: 1,
        borderColor: '#3b82f6', // Blue-500
        borderRadius: 8,
        padding: 12,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e40af', // Blue-800
        marginBottom: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#1e3a8a', // Blue-900
        lineHeight: 20,
        marginBottom: 12,
    },
    ctaButton: {
        backgroundColor: '#1e40af', // Blue-800
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    ctaButtonText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '600',
    },
});
