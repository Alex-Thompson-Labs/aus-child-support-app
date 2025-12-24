import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalculatorForm } from "../components/CalculatorForm";
import { CalculatorResults } from "../components/CalculatorResults";
import { useCalculator } from "../hooks/useCalculator";

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

  const handleCourtDateChange = (value: string) => {
    setFormState((prev) => ({ ...prev, courtDate: value }));
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Child Support Calculator</Text>
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
            courtDate={formState.courtDate}
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
            onCourtDateChange={handleCourtDateChange}
          />
        </View>

        {/* Fixed Bottom Payment Card - rendered outside scrollable content */}
        {results && <CalculatorResults results={results} formData={formState} />}
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
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
});

