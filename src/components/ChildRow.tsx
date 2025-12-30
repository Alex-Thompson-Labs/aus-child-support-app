import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { createShadow } from "../utils/shadow-styles";
import type { ChildInput } from "../types/calculator";
import { CARE_PERIOD_DAYS } from "../utils/child-support-constants";
import { isWeb, useResponsive, webClickableStyles, webInputStyles } from "../utils/responsive";
import { PeriodPicker } from "./PeriodPicker";

interface ChildRowProps {
  child: ChildInput;
  onUpdate: (updates: Partial<ChildInput>) => void;
  onRemove: () => void;
  childIndex?: number;
  totalChildren?: number;
}

export function ChildRow({
  child,
  onUpdate,
  onRemove,
  childIndex,
  totalChildren,
}: ChildRowProps) {
  const { isMobile } = useResponsive();

  const maxValue =
    child.carePeriod === "week"
      ? 7
      : child.carePeriod === "fortnight"
        ? 14
        : 365;

  // Calculate if total exceeds maximum
  const totalCare = child.careAmountA + child.careAmountB;
  const isOverLimit = totalCare > maxValue;
  const periodLabel = " nights";

  // Helper function to handle care amount changes with auto-adjustment
  const handleCareAmountAChange = (text: string) => {
    const newAmountA = parseFloat(text.replace(/[^0-9.]/g, "")) || 0;
    const newAmountB = Math.max(0, maxValue - newAmountA);
    onUpdate({ careAmountA: newAmountA, careAmountB: newAmountB });
  };

  const handleCareAmountBChange = (text: string) => {
    const newAmountB = parseFloat(text.replace(/[^0-9.]/g, "")) || 0;
    const newAmountA = Math.max(0, maxValue - newAmountB);
    onUpdate({ careAmountA: newAmountA, careAmountB: newAmountB });
  };

  const handlePeriodChange = (period: "week" | "fortnight" | "year") => {
    const maxNights = CARE_PERIOD_DAYS[period] || 14;
    onUpdate({
      carePeriod: period,
      careAmountA: Math.round(maxNights * 0.57),
      careAmountB: Math.round(maxNights * 0.43),
    });
  };

  // Single horizontal row layout (responsive)
  return (
    <View
      style={[
        styles.container,
        !isMobile && styles.containerDesktop,
        isOverLimit && styles.containerError,
      ]}
    >
      {/* Child count indicator */}
      {childIndex !== undefined && totalChildren !== undefined && (
        <Text style={styles.childCountText}>
          Child {childIndex} of {totalChildren}
        </Text>
      )}

      {/* Remove button - top right with better visibility */}
      <Pressable
        onPress={onRemove}
        style={[styles.removeButton, isWeb && webClickableStyles]}
        accessibilityLabel="Remove child"
      >
        <Text style={styles.removeButtonText}>×</Text>
      </Pressable>

      {/* Care arrangement inputs - 2x2 grid on mobile */}
      <View style={styles.horizontalRow}>
        {/* Row 1: Parent A and Parent B - forced side-by-side */}
        <View style={[styles.parentsRow, isMobile && styles.parentsRowMobile]}>
          {/* Parent A */}
          <View style={[styles.itemWrapper, isMobile && styles.parentItemMobile]}>
            <Text style={styles.headerLabelA}>PARENT A</Text>
            <TextInput
              style={[styles.careInput, styles.compactInput, isWeb && webInputStyles]}
              value={child.careAmountA.toString()}
              onChangeText={handleCareAmountAChange}
              keyboardType="numeric"
              maxLength={5}
              placeholderTextColor="#64748b"
            />
          </View>

          {/* Parent B */}
          <View style={[styles.itemWrapper, isMobile && styles.parentItemMobile]}>
            <Text style={styles.headerLabelB}>PARENT B</Text>
            <TextInput
              style={[styles.careInput, styles.compactInput, isWeb && webInputStyles]}
              value={child.careAmountB.toString()}
              onChangeText={handleCareAmountBChange}
              keyboardType="numeric"
              maxLength={5}
              placeholderTextColor="#64748b"
            />
          </View>
        </View>

        {/* Row 2: Period and Age Range - on desktop inline, on mobile second row */}
        <View style={[styles.optionsRow, isMobile && styles.optionsRowMobile]}>
          {/* Period Picker */}
          <View style={isMobile && styles.optionItemMobile}>
            <PeriodPicker
              value={child.carePeriod}
              onChange={handlePeriodChange}
            />
          </View>

          {/* Age Range Toggle */}
          <View style={[styles.toggleWithLabel, isMobile && styles.optionItemMobile]}>
            <Text style={styles.toggleLabel}>Age Range</Text>
            <View style={styles.toggleGroup}>
              <Pressable
                onPress={() => onUpdate({ age: "Under 13" })}
                style={[styles.toggleButton, styles.toggleButtonLeft, child.age === "Under 13" && styles.toggleButtonActive, isWeb && webClickableStyles]}
              >
                <Text style={[styles.toggleButtonText, child.age === "Under 13" && styles.toggleButtonTextActive]}>{"<13"}</Text>
              </Pressable>
              <Pressable
                onPress={() => onUpdate({ age: "13+" })}
                style={[styles.toggleButton, styles.toggleButtonRight, child.age === "13+" && styles.toggleButtonActive13Plus, isWeb && webClickableStyles]}
              >
                <Text style={[styles.toggleButtonText, child.age === "13+" && styles.toggleButtonTextActive]}>13+</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Warning when total exceeds maximum */}
      {isOverLimit && (
        <Text style={styles.warning}>
          Total ({totalCare}
          {periodLabel}) exceeds max ({maxValue})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0", // slate-200 - subtle border
    backgroundColor: "#ffffff", // white background
    marginBottom: 8,
    position: "relative",
    ...createShadow({
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    }),
    ...(isWeb ? {
      scrollSnapAlign: "start",
    } : {}),
  } as any,
  containerDesktop: {
    padding: 16,
  },
  childCountText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b", // slate-500 - neutral label
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: "center",
  },
  containerError: {
    borderColor: "#ef4444", // red-500
    backgroundColor: "#fef2f2", // red-50 - very light red bg
  },
  // Single horizontal row layout
  horizontalRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 16,
    backgroundColor: "#f9fafb", // gray-50 - very light gray
    padding: 12,
    borderRadius: 8,
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
  },
  itemWrapper: {
    alignItems: "center",
    gap: 6,
  },
  // Styles for 2x2 grid layout on mobile
  parentsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 16,
  },
  parentsRowMobile: {
    width: "100%",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 12,
  },
  parentItemMobile: {
    flex: 1,
    minWidth: 0,
  },
  optionsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 16,
  },
  optionsRowMobile: {
    width: "100%",
    justifyContent: "space-between",
    gap: 8,
  },
  optionItemMobile: {
    flex: 1,
    alignItems: "center",
  },
  compactInput: {
    width: 70,
  },
  headerLabelA: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4a5568", // dark grey - consistent
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerLabelB: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4a5568", // dark grey - consistent
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  careInput: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 18,
    textAlign: "center",
    color: "#0f172a", // slate-900 - dark text
    borderWidth: 1,
    borderColor: "#cbd5e1", // slate-300
    borderRadius: 8,
    backgroundColor: "#ffffff", // white input
  },
  toggleWithLabel: {
    alignItems: "center",
    gap: 4,
  },
  toggleLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748b", // slate-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  toggleGroup: {
    flexDirection: "row",
    borderRadius: 6,
    overflow: "hidden",
  },
  toggleButton: {
    width: 32,
    paddingVertical: 4,
    alignItems: "center",
    backgroundColor: "#e2e8f0", // slate-200 - light inactive
    borderWidth: 1,
    borderColor: "#cbd5e1", // slate-300
  },
  toggleButtonLeft: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  toggleButtonRight: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: "#f59e0b", // amber-500 - for <13
    borderColor: "#f59e0b",
  },
  toggleButtonActive13Plus: {
    backgroundColor: "#f59e0b", // amber-500 - for 13+ (matching <13)
    borderColor: "#f59e0b",
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b", // slate-500
  },
  toggleButtonTextActive: {
    color: "#ffffff", // white on amber
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#ef4444", // red-500
    alignItems: "center",
    justifyContent: "center",
    ...(isWeb ? {
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    } : {}),
    ...createShadow({
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 4,
    }),
  } as any,
  removeButtonText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 10,
    marginTop: -1,
  },
  warning: {
    marginTop: 8,
    fontSize: 11,
    color: "#dc2626", // red-600 - darker for readability
    fontWeight: "500",
  },
});

