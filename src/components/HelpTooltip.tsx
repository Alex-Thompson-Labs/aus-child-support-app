import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { shadowPresets } from "../utils/shadow-styles";

interface HelpTooltipProps {
  what: string | React.ReactNode;
  why: string;
  hideWhatLabel?: boolean;
  header?: string;
  iconColor?: string;
  iconBorderColor?: string;
  iconBackgroundColor?: string;
}

export function HelpTooltip({
  what,
  why,
  hideWhatLabel,
  header,
  iconColor,
  iconBorderColor,
  iconBackgroundColor,
}: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setIsVisible(!isVisible)}
        style={[
          styles.button,
          iconBackgroundColor && { backgroundColor: iconBackgroundColor },
          iconBorderColor && { borderColor: iconBorderColor },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Help"
        accessibilityHint="Tap to see more information"
      >
        <Text style={[styles.buttonText, iconColor && { color: iconColor }]}>?</Text>
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
          accessibilityRole="button"
          accessibilityLabel="Close help dialog"
        >
          <Pressable style={styles.tooltip} onPress={(e) => e.stopPropagation()} accessible={true}>
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
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#f3f4f6", // grey-100
    borderWidth: 1.5,
    borderColor: "#9ca3af", // grey-400
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  buttonText: {
    color: "#6b7280", // grey-500
    fontSize: 13,
    fontWeight: "700",
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
    color: "#ea580c", // orange-600
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ea580c", // orange-600
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
    color: "#ea580c", // orange-600
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

