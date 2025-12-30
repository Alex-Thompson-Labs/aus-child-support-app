import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalculatorForm } from "../components/CalculatorForm";
import { CalculatorResults } from "../components/CalculatorResults";
import { useCalculator } from "../hooks/useCalculator";
import { useResponsive } from "../utils/responsive";
import { shadowPresets } from "../utils/shadow-styles";

export function CalculatorScreen() {
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

  // Handlers
  const handleIncomeAChange = (value: number) => setFormState((prev) => ({ ...prev, incomeA: value }));
  const handleIncomeBChange = (value: number) => setFormState((prev) => ({ ...prev, incomeB: value }));
  const handleSupportAChange = (checked: boolean) => setFormState((prev) => ({ ...prev, supportA: checked }));
  const handleSupportBChange = (checked: boolean) => setFormState((prev) => ({ ...prev, supportB: checked }));

  const handleRelDepAChange = (updates: Partial<{ u13: number; plus13: number }>) => {
    setFormState((prev) => ({ ...prev, relDepA: { ...prev.relDepA, ...updates } }));
  };

  const handleRelDepBChange = (updates: Partial<{ u13: number; plus13: number }>) => {
    setFormState((prev) => ({ ...prev, relDepB: { ...prev.relDepB, ...updates } }));
  };

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
        {/* Responsive Header */}
        <View style={styles.header}>
          <View style={isDesktop ? styles.desktopConstraint : styles.mobileHeaderRow}>
            <Ionicons name="people" size={isDesktop ? 32 : 24} color="#f59e0b" />
            <Text 
              style={[styles.title, isDesktop && styles.titleDesktop]}
              numberOfLines={1} 
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              Child Support Calculator
            </Text>
            <Link href={"/blog" as any} asChild>
              <Pressable style={styles.blogButton}>
                <Text style={styles.blogButtonText}>Blog</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* Form Body */}
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Content Wrapper - Centered for Desktop */}
          <View style={isDesktop ? styles.desktopConstraint : styles.fullWidth}>
            <CalculatorForm {...formProps} isDesktopWeb={isDesktop} />
            {/* Bottom padding ensures the floating card doesn't hide the last inputs */}
            <View style={{ height: 140 }} />
          </View>
        </ScrollView>

        {/* Results Card Overlay */}
        {results && (
          <View style={styles.resultsOverlay}>
            <View style={isDesktop ? styles.desktopConstraint : styles.fullWidth}>
              <CalculatorResults 
                results={results} 
                formData={formState} 
                displayMode="modal" 
              />
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#ffffff",
    width: '100%',
    alignItems: 'center', // Center the content
  },
  mobileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 12, // Add gap between elements
    flexWrap: 'nowrap', // Keep items on same line
  },
  desktopConstraint: {
    width: '100%',
    maxWidth: 850, // Breathing room for single-line title
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 16, // Add gap between elements
  },
  title: {
    fontSize: 18, // Mobile-friendly size
    fontWeight: "800",
    color: "#0f172a",
    marginLeft: 10,
    flexShrink: 1, // Prevents text from forcing vertical stack
  },
  titleDesktop: {
    fontSize: 28,
    letterSpacing: -0.5,
    marginLeft: 10,
  },
  blogButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    ...shadowPresets.small,
  },
  blogButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  resultsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  fullWidth: {
    width: '100%',
  }
});