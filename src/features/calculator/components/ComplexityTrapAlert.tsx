import type { ComplexityTrapReason } from '@/src/utils/calculator';
import { isWeb, MAX_CALCULATOR_WIDTH, webClickableStyles } from '@/src/utils/responsive';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

// ============================================================================
// ComplexityTrapAlert - CTA for complex scenarios requiring manual review
// ============================================================================

interface ComplexityTrapAlertProps {
    /** Specific trap reason */
    trapReason: ComplexityTrapReason;
    /** Human-readable reason for display */
    displayReason: string;
}

export function ComplexityTrapAlert({
    displayReason,
}: ComplexityTrapAlertProps) {
    const router = useRouter();

    const handleContactPress = () => {
        router.push({
            pathname: '/lawyer-inquiry',
            params: {
                trigger: 'complexity_trap',
                source: 'calculator',
            },
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {/* Icon */}
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>📋</Text>
                </View>

                {/* Header */}
                <Text style={styles.header}>Specialist Assessment Required</Text>

                {/* Body */}
                <Text style={styles.body}>
                    Your situation involves complex assessment rules (specifically
                    regarding non-parent care with {displayReason}). An automated online
                    estimate may be inaccurate for your specific legal circumstances.
                </Text>

                {/* CTA Button */}
                <Pressable
                    onPress={handleContactPress}
                    style={({ pressed }) => [
                        styles.ctaButton,
                        pressed && styles.ctaButtonPressed,
                        webClickableStyles,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Contact our team for a free review"
                >
                    <Text style={styles.ctaButtonText}>
                        Contact Our Team for a Free Review
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 32,
        maxWidth: MAX_CALCULATOR_WIDTH,
        width: '100%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#2563EB',
        ...Platform.select({
            web: {
                boxShadow: '0px 4px 20px 0px rgba(37, 99, 235, 0.15)',
            },
            default: {
                shadowColor: '#2563EB',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 8,
            },
        }),
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    icon: {
        fontSize: 28,
    },
    header: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1e3a8a',
        textAlign: 'center',
        marginBottom: 16,
    },
    body: {
        fontSize: 16,
        color: '#475569',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 28,
    },
    ctaButton: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 32,
        width: '100%',
        alignItems: 'center',
        ...(isWeb ? ({
            transition: 'transform 0.15s ease, background-color 0.15s ease',
        } as never) : {}),
    },
    ctaButtonPressed: {
        backgroundColor: '#1d4ed8',
        ...(isWeb ? ({
            transform: [{ scale: 0.98 }],
        } as never) : {}),
    },
    ctaButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ffffff',
    },
});
