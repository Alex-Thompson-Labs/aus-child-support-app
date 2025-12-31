import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import React, { Suspense, lazy } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCalculator } from "../hooks/useCalculator";
import { useResponsive } from "../utils/responsive";
import { shadowPresets } from "../utils/shadow-styles";

// Code-split heavy components for better LCP
const CalculatorForm = lazy(() => 
  import("../components/CalculatorForm").then(module => ({ default: module.CalculatorForm }))
);
const CalculatorResults = lazy(() => 
  import("../components/CalculatorResults").then(module => ({ default: module.CalculatorResults }))
);

// Lightweight skeleton loaders
function FormSkeleton() {
  return (
    <View style={skeletonStyles.container}>
      <ActivityIndicator size="large" color="#2563eb" />
      <Text style={skeletonStyles.loadingText}>Loading calculator...</Text>
    </View>
  );
}

function ResultsSkeleton() {
  return (
    <View style={skeletonStyles.resultsContainer}>
      <ActivityIndicator size="small" color="#2563eb" />
    </View>
  );
}

export function CalculatorScreen() {
  const {
    formState,
    setFormState,
    errors,
    results,
    isStale,
    setIsStale,
    addChild,
    removeChild,
    updateChild,
    calculate,
    reset,
    resetTimestamp,
  } = useCalculator();

  const { isDesktop } = useResponsive();

  // Handlers
  const handleIncomeAChange = (value: number) => {
    setFormState((prev) => ({ ...prev, incomeA: value }));
    setIsStale(true);
  };
  const handleIncomeBChange = (value: number) => {
    setFormState((prev) => ({ ...prev, incomeB: value }));
    setIsStale(true);
  };
  const handleSupportAChange = (checked: boolean) => {
    setFormState((prev) => ({ ...prev, supportA: checked }));
    setIsStale(true);
  };
  const handleSupportBChange = (checked: boolean) => {
    setFormState((prev) => ({ ...prev, supportB: checked }));
    setIsStale(true);
  };

  const handleRelDepAChange = (updates: Partial<{ u13: number; plus13: number }>) => {
    setFormState((prev) => ({ ...prev, relDepA: { ...prev.relDepA, ...updates } }));
    setIsStale(true);
  };

  const handleRelDepBChange = (updates: Partial<{ u13: number; plus13: number }>) => {
    setFormState((prev) => ({ ...prev, relDepB: { ...prev.relDepB, ...updates } }));
    setIsStale(true);
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
            <Ionicons name="people" size={isDesktop ? 32 : 24} color="#2563eb" />
            <Text
              style={[styles.title, isDesktop && styles.titleDesktop]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              Child Support Calculator
            </Text>
            <Link href={"/blog" as any} asChild>
              <Pressable 
                style={styles.blogButton}
                accessibilityRole="button"
                accessibilityLabel="View blog articles"
                accessibilityHint="Opens the blog page with helpful articles"
              >
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
            <Suspense fallback={<FormSkeleton />}>
              <CalculatorForm {...formProps} isDesktopWeb={isDesktop} />
            </Suspense>
            {/* Bottom padding ensures the floating card doesn't hide the last inputs */}
            <View style={{ height: 140 }} />
          </View>
        </ScrollView>

        {/* Results Card Overlay */}
        {results && (
          <View style={styles.resultsOverlay}>
            <View style={isDesktop ? styles.desktopConstraint : styles.fullWidth}>
              <Suspense fallback={<ResultsSkeleton />}>
                <CalculatorResults
                  results={results}
                  formData={formState}
                  displayMode="modal"
                  isStale={isStale}
                  resetTimestamp={resetTimestamp}
                />
              </Suspense>
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
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    gap: 8, // Reduced gap for more space
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
    fontSize: 18, // Optimized for mobile screens
    fontWeight: "800",
    color: "#0f172a",
    flex: 1, // Take available space
    flexShrink: 1, // Allow shrinking if needed
    textAlign: 'center',
  },
  titleDesktop: {
    fontSize: 28,
    letterSpacing: -0.5,
    marginLeft: 10,
  },
  blogButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexShrink: 0, // Prevent button from shrinking
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

const skeletonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    minHeight: 300,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#475569', // slate-600 - better contrast (6.7:1)
    fontWeight: '500',
  },
  resultsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
    ...shadowPresets.small,
  },
});