import React, { useState } from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";

interface HelpTooltipProps {
  what: string | React.ReactNode;
  why: string;
  hideWhatLabel?: boolean;
  header?: string;
}

export function HelpTooltip({ what, why, hideWhatLabel, header }: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setIsVisible(!isVisible)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>?</Text>
      </Pressable>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsVisible(false)}
        >
          <Pressable style={styles.tooltip} onPress={(e) => e.stopPropagation()}>
            <View style={styles.content}>
              {header && (
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>{header}</Text>
                </View>
              )}
              {!hideWhatLabel && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>What to enter</Text>
                </View>
              )}
              <View style={styles.section}>
                {typeof what === 'string' ? (
                  <Text style={styles.sectionText}>{what}</Text>
                ) : (
                  what
                )}
              </View>
              {why && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabelWhy}>Why it matters</Text>
                  <Text style={styles.sectionTextWhy}>{why}</Text>
                </View>
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#475569", // slate-600
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  buttonText: {
    color: "#cbd5e1", // slate-300
    fontSize: 12,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  tooltip: {
    width: 256,
    backgroundColor: "#0f172a", // slate-900
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#334155", // slate-700
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    padding: 12,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f59e0b", // amber-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#60a5fa", // blue-400
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  sectionText: {
    color: "#e2e8f0", // slate-200
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  sectionLabelWhy: {
    fontSize: 12,
    fontWeight: "600",
    color: "#34d399", // emerald-400
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  sectionTextWhy: {
    color: "#cbd5e1", // slate-300
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
});

