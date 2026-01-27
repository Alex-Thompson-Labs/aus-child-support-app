import { useAppTheme } from '@/src/theme';
import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

interface NPCCareValidationModalProps {
  visible: boolean;
  onClose: () => void;
  npcCarePercentage: number;
}

/**
 * Modal shown when NPC has less than 35% care.
 * Explains that no child support is payable in this scenario.
 */
export function NPCCareValidationModal({
  visible,
  onClose,
  npcCarePercentage,
}: NPCCareValidationModalProps) {
  const { colors } = useAppTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.cardBackground }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: colors.warningLight }]}>
              <Text style={styles.iconText}>ℹ️</Text>
            </View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              No Child Support Payable
            </Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              Based on the care arrangements you've entered, the non-parent carer has{' '}
              <Text style={{ fontWeight: '600' }}>{npcCarePercentage.toFixed(0)}% care</Text>.
            </Text>

            <Text style={[styles.message, { color: colors.textSecondary, marginTop: 12 }]}>
              Under Australian child support law, a non-parent carer must have at least{' '}
              <Text style={{ fontWeight: '600' }}>35% care</Text> to be entitled to receive child support payments.
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: colors.primary },
                pressed && styles.buttonPressed,
              ]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: colors.textInverse }]}>
                Understood
              </Text>
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
    padding: 16,
  },
  modal: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 16,
    ...Platform.select({
      web: {
        boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.15)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 25,
        elevation: 10,
      },
    }),
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  infoBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
