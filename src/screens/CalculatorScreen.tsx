import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCalculator } from "../hooks/useCalculator";
import { CalculatorForm } from "../components/CalculatorForm";
import { CalculatorResults } from "../components/CalculatorResults";

export function CalculatorScreen() {
  const {
    formState,
    setFormState,
    errors,
    results,
    addChild,
    removeChild,
    updateChild,
  } = useCalculator();

  const handleYearChange = (year: typeof formState.year) => {
    setFormState((prev) => ({ ...prev, year }));
  };

  const handleIncomeAChange = (value: number) => {
    setFormState((prev) => ({ ...prev, incomeA: value }));
  };

  const handleIncomeBChange = (value: number) => {
    setFormState((prev) => ({ ...prev, incomeB: value }));
  };

  const handleSupportAChange = (checked: boolean) => {
    setFormState((prev) => ({ ...prev, supportA: checked }));
  };

  const handleSupportBChange = (checked: boolean) => {
    setFormState((prev) => ({ ...prev, supportB: checked }));
  };

  const handleRelDepAChange = (updates: Partial<{ u13: number; plus13: number }>) => {
    setFormState((prev) => ({
      ...prev,
      relDepA: { ...prev.relDepA, ...updates },
    }));
  };

  const handleRelDepBChange = (updates: Partial<{ u13: number; plus13: number }>) => {
    setFormState((prev) => ({
      ...prev,
      relDepB: { ...prev.relDepB, ...updates },
    }));
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Child Support Calculator</Text>
          <View style={styles.yearButtonsContainer}>
            {(["2025", "2024", "2023", "2022", "2021", "2020"] as const).map((yr) => (
              <Pressable
                key={yr}
                onPress={() => handleYearChange(yr)}
                style={[
                  styles.yearButton,
                  formState.year === yr && styles.yearButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.yearButtonText,
                    formState.year === yr && styles.yearButtonTextActive,
                  ]}
                >
                  {yr}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <CalculatorForm
            incomeA={formState.incomeA}
            incomeB={formState.incomeB}
            supportA={formState.supportA}
            supportB={formState.supportB}
            childrenData={formState.children}
            relDepA={formState.relDepA}
            relDepB={formState.relDepB}
            errors={errors}
            incomePercA={results?.incomePercA}
            incomePercB={results?.incomePercB}
            csiA={results?.CSI_A}
            csiB={results?.CSI_B}
            onIncomeAChange={handleIncomeAChange}
            onIncomeBChange={handleIncomeBChange}
            onSupportAChange={handleSupportAChange}
            onSupportBChange={handleSupportBChange}
            onAddChild={addChild}
            onRemoveChild={removeChild}
            onUpdateChild={updateChild}
            onRelDepAChange={handleRelDepAChange}
            onRelDepBChange={handleRelDepBChange}
          />
          {results && <CalculatorResults results={results} />}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // slate-900
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b", // slate-800
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
  yearButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  yearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "#334155", // slate-700
  },
  yearButtonActive: {
    backgroundColor: "#2563eb", // blue-600
  },
  yearButtonText: {
    fontSize: 12,
    color: "#94a3b8", // slate-400
  },
  yearButtonTextActive: {
    color: "#ffffff",
  },
  content: {
    flex: 1,
  },
});

