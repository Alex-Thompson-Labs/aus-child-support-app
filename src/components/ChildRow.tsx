import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { ChildInput } from "../types/calculator";
import { CARE_PERIOD_DAYS } from "../utils/child-support-constants";
import { useResponsive, isWeb, webInputStyles, webClickableStyles } from "../utils/responsive";
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

      {/* Single horizontal row: Parent A → Parent B → Period → Age Toggle */}
      <View style={styles.horizontalRow}>
        {/* Parent A */}
        <View style={[styles.itemWrapper, isMobile && styles.itemWrapperMobile]}>
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
        <View style={[styles.itemWrapper, isMobile && styles.itemWrapperMobile]}>
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

        {/* Period Picker */}
        <View style={isMobile && styles.itemWrapperMobile}>
          <PeriodPicker
            value={child.carePeriod}
            onChange={handlePeriodChange}
          />
        </View>

        {/* Age Range Toggle */}
        <View style={[styles.toggleWithLabel, isMobile && styles.itemWrapperMobile]}>
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
              style={[styles.toggleButton, styles.toggleButtonRight, child.age === "13+" && styles.toggleButtonActive, isWeb && webClickableStyles]}
            >
              <Text style={[styles.toggleButtonText, child.age === "13+" && styles.toggleButtonTextActive]}>13+</Text>
            </Pressable>
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
    borderColor: "#475569", // slate-600
    backgroundColor: "transparent",
    marginBottom: 8,
    position: "relative",
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
    color: "#94a3b8", // slate-400
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: "center",
  },
  containerError: {
    borderColor: "#ef4444", // red-500
    backgroundColor: "rgba(239, 68, 68, 0.1)", // red-500 with opacity
  },
  // Single horizontal row layout
  horizontalRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 16,
    backgroundColor: "#0f172a", // slate-900
    padding: 12,
    borderRadius: 8,
    flexWrap: "wrap",
  },
  itemWrapper: {
    alignItems: "center",
    gap: 6,
  },
  itemWrapperMobile: {
    width: "48%",
    marginBottom: 8,
  },
  compactInput: {
    width: 70,
  },
  headerLabelA: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3b82f6", // blue-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerLabelB: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8b5cf6", // violet-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  careInput: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 18,
    textAlign: "center",
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#475569", // slate-600
    borderRadius: 8,
    backgroundColor: "#1e293b", // slate-800
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
    backgroundColor: "#334155", // slate-700
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
    backgroundColor: "#f59e0b", // amber-500
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8", // slate-400
  },
  toggleButtonTextActive: {
    color: "#0f172a", // slate-900
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
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    } : {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
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
    color: "#f87171", // red-400
  },
});

