import React, { useState } from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import { shadowPresets } from "../utils/shadow-styles";

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
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  buttonText: {
    color: "#9ca3af", // grey-400
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  tooltip: {
    width: 280,
    backgroundColor: "#ffffff", // white
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb", // grey-200
    ...shadowPresets.medium,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a202c", // near-black
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280", // grey-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionText: {
    color: "#374151", // grey-700
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  sectionLabelWhy: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280", // grey-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionTextWhy: {
    color: "#374151", // grey-700
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
});

