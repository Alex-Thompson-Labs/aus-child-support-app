import React from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CalculatorForm } from "../components/CalculatorForm";
import { CalculatorResults } from "../components/CalculatorResults";
import { useCalculator } from "../hooks/useCalculator";
import { useResponsive } from "../utils/responsive";

export function CalculatorScreen() {
  const router = useRouter();
  const {
    formState,
    setFormState,
    errors,
    results,
    addChild,
    removeChild,
    updateChild,
    calculate,
    reset,
  } = useCalculator();

  const { isDesktop } = useResponsive();

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

  // Common form props
  const formProps = {
    incomeA: formState.incomeA,
    incomeB: formState.incomeB,
    supportA: formState.supportA,
    supportB: formState.supportB,
    childrenData: formState.children,
    relDepA: formState.relDepA,
    relDepB: formState.relDepB,
    errors: errors,
    incomePercA: results?.incomePercA,
    incomePercB: results?.incomePercB,
    csiA: results?.CSI_A,
    csiB: results?.CSI_B,
    onIncomeAChange: handleIncomeAChange,
    onIncomeBChange: handleIncomeBChange,
    onSupportAChange: handleSupportAChange,
    onSupportBChange: handleSupportBChange,
    onAddChild: addChild,
    onRemoveChild: removeChild,
    onUpdateChild: updateChild,
    onRelDepAChange: handleRelDepAChange,
    onRelDepBChange: handleRelDepBChange,
    onCalculate: calculate,
    onReset: reset,
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons name="people" size={isDesktop ? 32 : 28} color="#f59e0b" />
            <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
              Child Support Calculator
            </Text>

            {/* TEMPORARY DEV BUTTON - REMOVE BEFORE PRODUCTION */}
            <Pressable
              style={styles.devAdminButton}
              onPress={() => router.push('/admin/login')}
            >
              <Text style={styles.devAdminButtonText}>🔧 Admin</Text>
            </Pressable>
          </View>
        </View>

        <>
          <View style={styles.content}>
            <CalculatorForm {...formProps} isDesktopWeb={false} />
          </View>
          {results && (
            <CalculatorResults 
              results={results} 
              formData={formState} 
              displayMode="modal" 
            />
          )}
        </>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa", // soft warm grey
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0", // subtle border
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    flex: 1,
    position: "relative",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a202c", // near black for high contrast
    letterSpacing: 0.5,
  },
  titleDesktop: {
    fontSize: 28,
  },
  // DEV ADMIN BUTTON - REMOVE BEFORE PRODUCTION
  devAdminButton: {
    position: "absolute",
    right: 20,
    backgroundColor: "#e2e8f0", // light grey
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    opacity: 0.8,
  },
  devAdminButtonText: {
    color: "#4a5568",
    fontSize: 13,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
});

