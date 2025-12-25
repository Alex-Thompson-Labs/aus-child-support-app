import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import type { ChildInput } from "../types/calculator";
import { CARE_PERIOD_DAYS } from "../utils/child-support-constants";

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

  return (
    <View
      style={[
        styles.container,
        isOverLimit && styles.containerError,
      ]}
    >
      <View style={styles.row}>
        {/* Age Buttons */}
        <View style={styles.ageButtons}>
          <Pressable
            onPress={() => onUpdate({ age: "Under 13" })}
            style={[styles.ageButton, child.age === "Under 13" && styles.ageButtonActive]}
          >
            <Text style={[styles.ageButtonText, child.age === "Under 13" && styles.ageButtonTextActive]}>{"<13"}</Text>
          </Pressable>
          <Pressable
            onPress={() => onUpdate({ age: "13+" })}
            style={[styles.ageButton, child.age === "13+" && styles.ageButtonActive]}
          >
            <Text style={[styles.ageButtonText, child.age === "13+" && styles.ageButtonTextActive]}>13+</Text>
          </Pressable>
        </View>

        {/* Care Inputs */}
        <View style={styles.careSection}>
          <Text style={[styles.label, { color: '#3b82f6', fontSize: 14 }]}>A:</Text>
          <TextInput
            style={styles.careInput}
            value={child.careAmountA.toString()}
            onChangeText={handleCareAmountAChange}
            keyboardType="numeric"
            maxLength={5}
          />
          <Text style={[styles.label, { color: '#8b5cf6', fontSize: 14 }]}>B:</Text>
          <TextInput
            style={styles.careInput}
            value={child.careAmountB.toString()}
            onChangeText={handleCareAmountBChange}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>

        {/* Period Buttons + Remove */}
        <View style={styles.periodAndRemove}>
          <View style={styles.periodButtons}>
            {(["week", "fortnight", "year"] as const).map((period) => (
              <Pressable
                key={period}
                onPress={() => handlePeriodChange(period)}
                style={[styles.periodButton, child.carePeriod === period && styles.periodButtonActive]}
              >
                <Text style={[styles.periodButtonText, child.carePeriod === period && styles.periodButtonTextActive]}>
                  {period === "week" ? "wk" : period === "fortnight" ? "fn" : "yr"}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={onRemove}
            style={styles.removeButton}
            accessibilityLabel="Remove child"
          >
            <Text style={styles.removeButtonText}>×</Text>
          </Pressable>
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
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#475569", // slate-600
    backgroundColor: "#334155", // slate-700
    marginBottom: 8,
  },
  containerError: {
    borderColor: "#ef4444", // red-500
    backgroundColor: "rgba(239, 68, 68, 0.1)", // red-500 with opacity
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ageButtons: {
    flexDirection: "row",
    gap: 2,
  },
  ageButton: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: "#475569", // slate-600
  },
  ageButtonActive: {
    backgroundColor: "#f59e0b", // amber-500
  },
  ageButtonText: {
    fontSize: 12,
    color: "#94a3b8", // slate-400
  },
  ageButtonTextActive: {
    color: "#000000",
    fontWeight: "600",
  },
  careSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: 11,
    color: "#94a3b8", // slate-400
  },
  careInput: {
    width: 38,
    paddingHorizontal: 2,
    paddingVertical: 5,
    fontSize: 13,
    textAlign: "center",
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#475569", // slate-600
    borderRadius: 4,
    backgroundColor: "#475569", // slate-600
  },
  periodAndRemove: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  periodButtons: {
    flexDirection: "row",
    gap: 2,
  },
  periodButton: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: "#475569", // slate-600
  },
  periodButtonActive: {
    backgroundColor: "#f59e0b", // amber-500
  },
  periodButtonText: {
    fontSize: 12,
    color: "#94a3b8", // slate-400
  },
  periodButtonTextActive: {
    color: "#000000",
    fontWeight: "600",
  },
  removeButton: {
    padding: 4,
    borderRadius: 4,
  },
  removeButtonText: {
    color: "#64748b", // slate-500
    fontSize: 18,
    fontWeight: "600",
  },
  warning: {
    marginTop: 6,
    fontSize: 11,
    color: "#f87171", // red-400
  },
});

