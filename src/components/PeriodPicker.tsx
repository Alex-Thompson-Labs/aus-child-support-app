import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { webClickableStyles } from "../utils/responsive";

type Period = "week" | "fortnight" | "year";

interface PeriodPickerProps {
  value: Period;
  onChange: (period: Period) => void;
}

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "fortnight", label: "Fortnight" },
  { value: "year", label: "Year" },
];

export function PeriodPicker({ value, onChange }: PeriodPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const isWeb = Platform.OS === "web";

  const selectedLabel = PERIOD_OPTIONS.find((opt) => opt.value === value)?.label || "Week";

  // For web, use native select for better UX
  if (isWeb) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Period</Text>
        <View style={styles.selectWrapper}>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value as Period)}
            style={{
              width: "100%",
              height: 32,
              backgroundColor: "#334155",
              color: "#ffffff",
              border: "1px solid #475569",
              borderRadius: 6,
              paddingLeft: 10,
              paddingRight: 28,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              outline: "none",
            }}
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <View style={styles.chevron}>
            <Text style={styles.chevronText}>▼</Text>
          </View>
        </View>
      </View>
    );
  }

  // For native, use a custom dropdown
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Period</Text>
      <View style={styles.dropdownContainer}>
        <Pressable
          onPress={() => setIsOpen(!isOpen)}
          style={[styles.dropdownButton, webClickableStyles]}
        >
          <Text style={styles.dropdownButtonText}>{selectedLabel}</Text>
          <Text style={styles.chevronText}>▼</Text>
        </Pressable>

        {isOpen && (
          <View style={styles.dropdownMenu}>
            {PERIOD_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={[
                  styles.dropdownItem,
                  option.value === value && styles.dropdownItemActive,
                ]}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    option.value === value && styles.dropdownItemTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748b", // slate-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selectWrapper: {
    position: "relative",
    width: 100,
  },
  chevron: {
    position: "absolute",
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    pointerEvents: "none",
  },
  chevronText: {
    fontSize: 8,
    color: "#94a3b8", // slate-400
  },
  dropdownContainer: {
    position: "relative",
    zIndex: 10,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#334155", // slate-700
    borderWidth: 1,
    borderColor: "#475569", // slate-600
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 100,
    gap: 8,
  },
  dropdownButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#ffffff",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#334155", // slate-700
    borderWidth: 1,
    borderColor: "#475569", // slate-600
    borderRadius: 6,
    marginTop: 4,
    overflow: "hidden",
    zIndex: 20,
  },
  dropdownItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dropdownItemActive: {
    backgroundColor: "#f59e0b", // amber-500
  },
  dropdownItemText: {
    fontSize: 13,
    color: "#ffffff",
  },
  dropdownItemTextActive: {
    color: "#0f172a", // slate-900
    fontWeight: "600",
  },
});
