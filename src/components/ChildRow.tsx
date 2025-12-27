import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { ChildInput } from "../types/calculator";
import { CARE_PERIOD_DAYS } from "../utils/child-support-constants";
import { useResponsive, isWeb, webInputStyles, webClickableStyles } from "../utils/responsive";

interface ChildRowProps {
  child: ChildInput;
  onUpdate: (updates: Partial<ChildInput>) => void;
  onRemove: () => void;
}

export function ChildRow({
  child,
  onUpdate,
  onRemove,
}: ChildRowProps) {
  const { isMobile, isDesktop } = useResponsive();

  const maxValue =
    child.carePeriod === "week"
      ? 7
      : child.carePeriod === "fortnight"
        ? 14
        : 365;

  // Responsive input width
  const careInputWidth = isMobile ? 60 : isDesktop ? 80 : 70;

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

  return (
    <View
      style={[
        styles.container,
        isOverLimit && styles.containerError,
      ]}
    >
      <View style={styles.mainRow}>
        {/* Left side: Parent inputs */}
        <View style={styles.parentsSection}>
          <View style={styles.parentColumn}>
            <Text style={styles.headerLabelA}>PARENT A</Text>
            <TextInput
              style={[styles.careInput, { width: careInputWidth }, isWeb && webInputStyles]}
              value={child.careAmountA.toString()}
              onChangeText={handleCareAmountAChange}
              keyboardType="numeric"
              maxLength={5}
              placeholderTextColor="#64748b"
            />
          </View>
          <View style={styles.parentColumn}>
            <Text style={styles.headerLabelB}>PARENT B</Text>
            <TextInput
              style={[styles.careInput, { width: careInputWidth }, isWeb && webInputStyles]}
              value={child.careAmountB.toString()}
              onChangeText={handleCareAmountBChange}
              keyboardType="numeric"
              maxLength={5}
              placeholderTextColor="#64748b"
            />
          </View>
        </View>

        {/* Right side: Controls */}
        <View style={styles.controlsSection}>
          {/* Age toggle */}
          <View style={[styles.toggleGroup, styles.ageToggleGroup]}>
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

          {/* Period toggle */}
          <View style={[styles.toggleGroup, styles.periodToggleGroup]}>
            {(["week", "fortnight", "year"] as const).map((period, index) => (
              <Pressable
                key={period}
                onPress={() => handlePeriodChange(period)}
                style={[
                  styles.toggleButton,
                  index === 0 && styles.toggleButtonLeft,
                  index === 2 && styles.toggleButtonRight,
                  child.carePeriod === period && styles.toggleButtonActive,
                  isWeb && webClickableStyles,
                ]}
              >
                <Text style={[styles.toggleButtonText, child.carePeriod === period && styles.toggleButtonTextActive]}>
                  {period === "week" ? "wk" : period === "fortnight" ? "fn" : "yr"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Remove button - top right corner */}
        <Pressable
          onPress={onRemove}
          style={[styles.removeButton, isWeb && webClickableStyles]}
          accessibilityLabel="Remove child"
        >
          <Text style={styles.removeButtonText}>×</Text>
        </Pressable>
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
  },
  containerError: {
    borderColor: "#ef4444", // red-500
    backgroundColor: "rgba(239, 68, 68, 0.1)", // red-500 with opacity
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    position: "relative",
  },
  parentsSection: {
    flexDirection: "row",
    gap: 16,
    flex: 1,
  },
  parentColumn: {
    alignItems: "center",
    gap: 6,
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
    // Width is now set dynamically via inline style
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
  controlsSection: {
    gap: 6,
    alignItems: "flex-end",
  },
  toggleGroup: {
    flexDirection: "row",
    borderRadius: 6,
    overflow: "hidden",
  },
  ageToggleGroup: {
    marginRight: 32,
  },
  periodToggleGroup: {
    marginRight: 16,
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
    top: -4,
    right: -4,
    padding: 4,
  },
  removeButtonText: {
    color: "#64748b", // slate-500
    fontSize: 18,
    fontWeight: "600",
  },
  warning: {
    marginTop: 8,
    fontSize: 11,
    color: "#f87171", // red-400
  },
});

