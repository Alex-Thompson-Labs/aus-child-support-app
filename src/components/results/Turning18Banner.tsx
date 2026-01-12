import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Turning18BannerProps {
    childIndex: number;
}

/**
 * Warning banner displayed for children aged 17, alerting users that
 * child support generally stops at 18 and they should check eligibility
 * for a School Year Extension.
 */
export function Turning18Banner({ childIndex }: Turning18BannerProps) {
    return (
        <View style={styles.banner}>
            <Text style={styles.bannerText}>
                <Text style={styles.bannerIcon}>⏰ </Text>
                <Text style={styles.bannerLabel}>Turning 18 soon?</Text>
                {' '}Child support generally stops at 18. Check your eligibility for a
                'School Year Extension'.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        backgroundColor: '#fef3c7', // Amber-100
        borderWidth: 1,
        borderColor: '#fbbf24', // Amber-400
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginTop: 6,
    },
    bannerIcon: {
        fontSize: 12,
    },
    bannerLabel: {
        fontWeight: '700',
        color: '#92400e', // Amber-800
    },
    bannerText: {
        fontSize: 12,
        color: '#78350f', // Amber-900
        lineHeight: 18,
    },
});
