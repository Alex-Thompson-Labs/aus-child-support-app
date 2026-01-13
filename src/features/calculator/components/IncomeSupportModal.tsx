import { isWeb } from '@/src/utils/responsive';
import { shadowPresets } from '@/src/utils/shadow-styles';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * IncomeSupportModal Component
 *
 * A modal that asks if a parent's income includes Government Income Support.
 * Displayed when a parent's income is below the Self-Support Amount (SSA) threshold.
 *
 * Created: 2026-01-06
 */

interface IncomeSupportModalProps {
    /** Whether the modal is visible */
    visible: boolean;
    /** Display name for the parent being asked about */
    parentName: 'You' | 'Other Parent';
    /** Called when user responds "Yes" */
    onYes: () => void;
    /** Called when user responds "No" */
    onNo: () => void;
}

export function IncomeSupportModal({
    visible,
    parentName,
    onYes,
    onNo,
}: IncomeSupportModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onNo}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Income Support</Text>
                    <Text style={styles.question}>
                        Does the income entered for{' '}
                        <Text style={styles.parentName}>{parentName}</Text> include
                        Government Income Support?
                    </Text>
                    <Text style={styles.hint}>
                        (e.g., JobSeeker, Parenting Payment, Disability Support Pension)
                    </Text>
                    <View style={styles.buttonRow}>
                        <Pressable
                            onPress={onNo}
                            style={[styles.button, styles.noButton, isWeb && webClickableStyles]}
                            accessibilityRole="button"
                            accessibilityLabel="No, income does not include government support"
                        >
                            <Text style={styles.noButtonText}>No</Text>
                        </Pressable>
                        <Pressable
                            onPress={onYes}
                            style={[styles.button, styles.yesButton, isWeb && webClickableStyles]}
                            accessibilityRole="button"
                            accessibilityLabel="Yes, income includes government support"
                        >
                            <Text style={styles.yesButtonText}>Yes</Text>
                        </Pressable>
                    </View>
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
    },
    modal: {
        width: 320,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        ...shadowPresets.large,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a', // slate-900
        textAlign: 'center',
        marginBottom: 16,
    },
    question: {
        fontSize: 16,
        color: '#334155', // slate-700
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 8,
    },
    parentName: {
        fontWeight: '700',
        color: '#2563eb', // blue-600
    },
    hint: {
        fontSize: 13,
        color: '#64748b', // slate-500
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noButton: {
        backgroundColor: '#f1f5f9', // slate-100
        borderWidth: 1,
        borderColor: '#e2e8f0', // slate-200
    },
    noButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#475569', // slate-600
    },
    yesButton: {
        backgroundColor: '#0056b3', // Royal Blue (Brand)
    },
    yesButtonText: {
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
