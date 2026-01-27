import { isWeb } from '@/src/utils/responsive';
import { shadowPresets } from '@/src/utils/shadow-styles';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * IncomeSupportModal Component
 *
 * A modal that asks if parents' incomes include Government Income Support.
 * Displayed when a parent's income is below the Self-Support Amount (SSA) threshold.
 * Now shows both parents simultaneously for better UX.
 *
 * Created: 2026-01-06
 * Updated: 2026-01-15 - Refactored to show both parents on one screen
 */

interface IncomeSupportModalProps {
    /** Whether the modal is visible */
    visible: boolean;
    /** Whether to show Parent A (You) question */
    askParentA: boolean;
    /** Whether to show Parent B (Other Parent) question */
    askParentB: boolean;
    /** Called when user clicks Continue with their selections */
    onContinue: (parentASupport: boolean, parentBSupport: boolean) => void;
    /** Called when user wants to cancel/close */
    onCancel?: () => void;
}

export function IncomeSupportModal({
    visible,
    askParentA,
    askParentB,
    onContinue,
    onCancel,
}: IncomeSupportModalProps) {
    const [parentASupport, setParentASupport] = useState(false);
    const [parentBSupport, setParentBSupport] = useState(false);

    const handleContinue = () => {
        onContinue(parentASupport, parentBSupport);
        // Reset state for next time
        setParentASupport(false);
        setParentBSupport(false);
    };

    const handleCancel = () => {
        // Reset state
        setParentASupport(false);
        setParentBSupport(false);
        onCancel?.();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Income Support</Text>
                    <Text style={styles.description}>
                        Does the income include Government Income Support?
                    </Text>
                    <Text style={styles.hint}>
                        (e.g., JobSeeker, Parenting Payment, Disability Support Pension)
                    </Text>

                    {/* Parent A Section */}
                    {askParentA && (
                        <View style={styles.parentSection}>
                            <Text style={styles.parentLabel}>Your Income</Text>
                            <View style={styles.toggleRow}>
                                <Pressable
                                    onPress={() => setParentASupport(false)}
                                    style={[
                                        styles.toggleButton,
                                        !parentASupport && styles.toggleButtonActive,
                                        isWeb && webClickableStyles,
                                    ]}
                                    accessibilityRole="button"
                                    accessibilityLabel="Your income does not include government support"
                                >
                                    <Text
                                        style={[
                                            styles.toggleButtonText,
                                            !parentASupport && styles.toggleButtonTextActive,
                                        ]}
                                    >
                                        No
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => setParentASupport(true)}
                                    style={[
                                        styles.toggleButton,
                                        parentASupport && styles.toggleButtonActive,
                                        isWeb && webClickableStyles,
                                    ]}
                                    accessibilityRole="button"
                                    accessibilityLabel="Your income includes government support"
                                >
                                    <Text
                                        style={[
                                            styles.toggleButtonText,
                                            parentASupport && styles.toggleButtonTextActive,
                                        ]}
                                    >
                                        Yes
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    )}

                    {/* Parent B Section */}
                    {askParentB && (
                        <View style={styles.parentSection}>
                            <Text style={styles.parentLabel}>Other Parent&apos;s Income</Text>
                            <View style={styles.toggleRow}>
                                <Pressable
                                    onPress={() => setParentBSupport(false)}
                                    style={[
                                        styles.toggleButton,
                                        !parentBSupport && styles.toggleButtonActive,
                                        isWeb && webClickableStyles,
                                    ]}
                                    accessibilityRole="button"
                                    accessibilityLabel="Other parent's income does not include government support"
                                >
                                    <Text
                                        style={[
                                            styles.toggleButtonText,
                                            !parentBSupport && styles.toggleButtonTextActive,
                                        ]}
                                    >
                                        No
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => setParentBSupport(true)}
                                    style={[
                                        styles.toggleButton,
                                        parentBSupport && styles.toggleButtonActive,
                                        isWeb && webClickableStyles,
                                    ]}
                                    accessibilityRole="button"
                                    accessibilityLabel="Other parent's income includes government support"
                                >
                                    <Text
                                        style={[
                                            styles.toggleButtonText,
                                            parentBSupport && styles.toggleButtonTextActive,
                                        ]}
                                    >
                                        Yes
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    )}

                    {/* Continue Button */}
                    <Pressable
                        onPress={handleContinue}
                        style={[styles.continueButton, isWeb && webClickableStyles]}
                        accessibilityRole="button"
                        accessibilityLabel="Continue with selections"
                    >
                        <Text style={styles.continueButtonText}>Continue</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modal: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        ...shadowPresets.large,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a', // slate-900
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: '#334155', // slate-700
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 8,
    },
    hint: {
        fontSize: 13,
        color: '#64748b', // slate-500
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 24,
    },
    parentSection: {
        marginBottom: 20,
    },
    parentLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e40af', // blue-800
        marginBottom: 10,
    },
    toggleRow: {
        flexDirection: 'row',
        gap: 12,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f5f9', // slate-100
        borderWidth: 2,
        borderColor: '#e2e8f0', // slate-200
    },
    toggleButtonActive: {
        backgroundColor: '#dbeafe', // blue-100
        borderColor: '#3b82f6', // blue-500
    },
    toggleButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748b', // slate-500
    },
    toggleButtonTextActive: {
        color: '#1e40af', // blue-800
    },
    continueButton: {
        backgroundColor: '#0056b3', // Royal Blue (Brand)
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
});

// Web-specific focus styles
const webClickableStyles = {
    cursor: 'pointer',
    outlineStyle: 'none',
} as any;
