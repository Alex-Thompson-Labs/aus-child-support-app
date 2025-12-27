import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CalculatorForm, WebHorizontalForm } from "../components/CalculatorForm";
import { CalculatorResults } from "../components/CalculatorResults";
import { useCalculator } from "../hooks/useCalculator";
import { useResponsive, MAX_CONTENT_WIDTH, MAX_TWO_COLUMN_WIDTH, FORM_COLUMN_WIDTH, COLUMN_GAP, isWeb, webOnlyStyles } from "../utils/responsive";

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

  const { isMobile, isDesktop, isDesktopWeb, isTabletOrDesktop, width } = useResponsive();

  // State for web layout: results hidden until Calculate is pressed
  const [showResults, setShowResults] = useState(false);
  const [showInquiryPanel, setShowInquiryPanel] = useState(false);

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

  // Handle calculate - show results on web
  const handleCalculate = () => {
    calculate();
    if (isTabletOrDesktop) {
      setShowResults(true);
    }
  };

  // Handle reset - hide results and inquiry panel
  const handleReset = () => {
    reset();
    setShowResults(false);
    setShowInquiryPanel(false);
  };

  // Handle request inquiry - show inline panel instead of navigation on web
  const handleRequestInquiry = () => {
    if (isTabletOrDesktop) {
      setShowInquiryPanel(true);
    }
    // For mobile, CalculatorResults handles navigation internally
  };

  // Web-specific wrapper styles for centered, constrained layout
  const webWrapperStyle: any = isWeb ? {
    maxWidth: isDesktopWeb ? MAX_TWO_COLUMN_WIDTH : MAX_CONTENT_WIDTH,
    width: '100%' as const,
    alignSelf: 'center' as const,
    ...webOnlyStyles,
  } : {};

  // Common form props
  const formProps = {
    incomeA: formState.incomeA,
    incomeB: formState.incomeB,
    supportA: formState.supportA,
    supportB: formState.supportB,
    childrenData: formState.children,
    relDepA: formState.relDepA,
    relDepB: formState.relDepB,
    courtDate: formState.courtDate,
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
    onCourtDateChange: handleCourtDateChange,
    onCalculate: handleCalculate,
    onReset: handleReset,
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={[styles.header, isWeb && styles.headerWeb]}>
          <View style={[styles.titleContainer, webWrapperStyle]}>
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

        {isTabletOrDesktop ? (
          // New horizontal layout for tablet/desktop web (≥768px)
          <ScrollView style={styles.webScrollContainer} contentContainerStyle={styles.webScrollContent}>
            {/* Horizontal input bar at top */}
            <WebHorizontalForm {...formProps} />

            {/* Separator line */}
            <View style={styles.separator} />

            {/* Results section - only shown after Calculate */}
            {showResults && results && (
              <View style={[styles.resultsContainer, { maxWidth: MAX_TWO_COLUMN_WIDTH }]}>
                <CalculatorResults
                  results={results}
                  formData={formState}
                  displayMode="inline"
                  onRequestInquiry={handleRequestInquiry}
                  showInquiryPanel={showInquiryPanel}
                  onCloseInquiry={() => setShowInquiryPanel(false)}
                />
              </View>
            )}
          </ScrollView>
        ) : (
          // Single-column layout for mobile (<768px)
          <>
            <View style={styles.content}>
              <CalculatorForm {...formProps} isDesktopWeb={false} />
            </View>
            {/* Fixed Bottom Payment Card - rendered outside scrollable content */}
            {results && <CalculatorResults results={results} formData={formState} displayMode="modal" />}
          </>
        )}
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
    padding: 20,
    paddingTop: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#334155", // slate-700
  },
  headerWeb: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  titleDesktop: {
    fontSize: 28,
  },
  // DEV ADMIN BUTTON - REMOVE BEFORE PRODUCTION
  devAdminButton: {
    position: "absolute",
    right: 20,
    backgroundColor: "#dc2626", // red-600
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  devAdminButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  // New web horizontal layout styles
  webScrollContainer: {
    flex: 1,
  },
  webScrollContent: {
    flexGrow: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#334155", // slate-700
    marginVertical: 0,
  },
  resultsContainer: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  // Legacy two-column layout styles (kept for reference)
  twoColumnContainer: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: COLUMN_GAP,
  },
  formColumn: {
    width: FORM_COLUMN_WIDTH,
    flexShrink: 0,
  },
  resultsColumn: {
    flex: 1,
    alignSelf: "flex-start" as const,
    // Web-only CSS properties for sticky sidebar
    ...(isWeb ? {
      position: "sticky",
      top: 0,
      maxHeight: "100vh",
      overflowY: "auto",
    } : {}),
  } as any,
});

