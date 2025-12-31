import React, { lazy, Suspense, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { CalculationResults } from "../types/calculator";
import type { ComplexityFormData } from "../utils/complexity-detection";
import { formatCurrency } from "../utils/formatters";
import { MAX_MODAL_WIDTH, useResponsive } from "../utils/responsive";
import { shadowPresets } from "../utils/shadow-styles";
import { ChangeOfAssessmentPrompt } from "./ChangeOfAssessmentPrompt";
import { SmartConversionFooter } from "./SmartConversionFooter";

// Lazy load the named export
const ResultsSimpleExplanation = lazy(() =>
  import('./ResultsSimpleExplanation').then((module) => ({
    default: module.ResultsSimpleExplanation,
  }))
);

// ============================================================================
// Component Documentation
// ============================================================================
/**
 * CalculatorResults Component
 * 
 * Displays calculation results in either modal or inline mode.
 * Shows payment amounts, breakdown details, CoA prompts, and conversion CTAs.
 * 
 * Parent Component:
 * - src/screens/CalculatorScreen.tsx (line 160) - Main calculator screen
 *   Passes calculation results and form state from useCalculator() hook
 * 
 * Props Interface (CalculatorResultsProps):
 * - results: CalculationResults - Complete calculation results including:
 *   - finalPaymentAmount: number - Annual child support liability
 *   - payer: string - Which parent pays ("Parent A", "Parent B", or "Neither")
 *   - ATI_A: number - Parent A's adjusted taxable income
 *   - ATI_B: number - Parent B's adjusted taxable income
 *   - childResults: Array - Care percentages and calculations per child
 * 
 * - formData?: ComplexityFormData - Optional form state containing:
 *   - children: ChildInput[] - Child care arrangement data
 *   - supportA: boolean - Parent A income support flag
 *   - supportB: boolean - Parent B income support flag
 *   - selectedCoAReasons?: string[] - Pre-selected Change of Assessment reasons
 *   Used for complexity detection and CoA reason persistence
 * 
 * - displayMode?: 'modal' | 'inline' - Display layout mode (default: 'modal')
 *   - 'modal': Floating bottom card that expands to full-screen modal
 *   - 'inline': Two-column layout with results on left, breakdown on right
 * 
 * - onRequestInquiry?: () => void - Optional callback for web inline inquiry panel
 *   If provided, enables inline inquiry mode instead of navigation
 * 
 * - showInquiryPanel?: boolean - Controls inline inquiry panel visibility (default: false)
 *   Used with onRequestInquiry for web inline mode
 * 
 * - onCloseInquiry?: () => void - Optional callback to close inline inquiry panel
 * 
 * - isStale?: boolean - Flag indicating results may be outdated (default: false)
 *   When true, displays strikethrough styling on amounts
 *   Set by parent when form inputs change before recalculation
 * 
 * - resetTimestamp?: number - Timestamp that increments on form reset (default: 0)
 *   Used to clear CoA reasons when form is explicitly reset
 * 
 * Display Modes:
 * 
 * 1. Modal Mode (default):
 *    - Collapsed: Fixed bottom card showing payer and annual amount
 *    - Expanded: Full-screen modal with hero section, breakdown, CoA prompt, footer
 *    - User taps card to expand/collapse
 *    - Returns null if no children exist in calculation
 * 
 * 2. Inline Mode:
 *    - Two-column layout (left: hero, right: breakdown scroll)
 *    - Used for desktop/tablet layouts
 *    - No modal overlay, always visible
 * 
 * Child Components:
 * - ChangeOfAssessmentPrompt - CoA reason selection and navigation
 *   - Receives: results, localFormData, onNavigate callback
 *   - Syncs selectedCoAReasons via onCoAReasonsChange callback
 *   - Key prop ensures remount when calculation changes
 * 
 * - ResultsSimpleExplanation (lazy) - Detailed calculation breakdown
 *   - Receives: results, formState (support flags)
 *   - Code-split for performance (large component)
 *   - Suspense fallback shows loading indicator
 * 
 * - SmartConversionFooter - Conversion CTAs with complexity-based messaging
 *   - Receives: results, carePercentages, formData, onBeforeNavigate
 *   - Handles navigation to /lawyer-inquiry route
 * 
 * State Management:
 * - isExpanded: boolean - Controls modal visibility (modal mode only)
 * - localFormData: ComplexityFormData - Local state preserving CoA reasons
 *   - Merges fresh formData.children from props with preserved selectedCoAReasons
 *   - Prevents CoA selections from being lost when form updates
 *   - Clears on resetTimestamp increment
 * 
 * - isNavigating: boolean - Prevents double navigation during route transitions
 * - lastResultsKey: string - Tracks calculation changes to update formData
 * 
 * Complexity Detection:
 * - Uses detectComplexity() utility with merged formData
 * - Detects: highValue, sharedCareDispute, specialCircumstances, bindingAgreement
 * - Triggers used for navigation params and conversion messaging
 * 
 * Navigation Behavior:
 * - navigateToInquiry() function routes to /lawyer-inquiry with params:
 *   - liability: results.finalPaymentAmount.toString()
 *   - trigger: getTrigger() - Primary complexity flag
 *   - complexityTriggers: JSON.stringify(getAllTriggers()) - All flags
 *   - incomeA: results.ATI_A.toString()
 *   - incomeB: results.ATI_B.toString()
 *   - children: (formData?.children?.length ?? 0).toString()
 *   - careData: JSON.stringify(careData array)
 *   - coaReasons: JSON.stringify(localFormData.selectedCoAReasons) if exists
 * 
 * - Tracks Google Analytics event on web (Lead/Inquiry_Click)
 * - Closes modal before navigation (onNavigate callback)
 * 
 * Key Features:
 * - CoA reason persistence across form updates
 * - Stale result indication with strikethrough styling
 * - Responsive design with web-specific modal constraints
 * - Code-split heavy components for performance
 * - Safe area insets handling for mobile notches
 * - Conditional rendering (returns null if no children)
 * 
 * Performance Optimizations:
 * - ResultsSimpleExplanation lazy loaded (~1153 lines)
 * - Suspense boundaries for loading states
 * - Key-based remounting of ChangeOfAssessmentPrompt on calculation change
 * - Memoized trigger calculation functions
 */

interface CalculatorResultsProps {
  results: CalculationResults;
  formData?: ComplexityFormData;
  displayMode?: 'modal' | 'inline';
  isStale?: boolean;
  resetTimestamp?: number;
}

export function CalculatorResults({
  results,
  formData,
  displayMode = 'modal',
  isStale = false,
  resetTimestamp = 0,
}: CalculatorResultsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const insets = useSafeAreaInsets();
  const { isWeb } = useResponsive();

  const isInlineMode = displayMode === 'inline';

  // Track local form data updates (selected CoA reasons)
  // Preserve CoA reasons across navigation - only update children/support from props
  const [localFormData, setLocalFormData] = useState<ComplexityFormData>(() => ({
    ...formData,
    selectedCoAReasons: formData?.selectedCoAReasons ?? [],
  }));
  const [lastResultsKey, setLastResultsKey] = useState('');

  // Generate a unique key for the current results
  const currentResultsKey = `${results.finalPaymentAmount}-${results.payer}-${results.childResults.map(c => `${c.roundedCareA}-${c.roundedCareB}`).join('-')}-${results.ATI_A}-${results.ATI_B}`;

  // Update formData when results change, but preserve selected CoA reasons
  React.useEffect(() => {
    if (currentResultsKey !== lastResultsKey) {
      setLocalFormData(prev => ({
        ...formData,
        // Preserve selected CoA reasons from previous state
        selectedCoAReasons: prev.selectedCoAReasons ?? formData?.selectedCoAReasons ?? [],
      }));
      setLastResultsKey(currentResultsKey);
    }
  }, [currentResultsKey, lastResultsKey, formData]);

  // Clear CoA reasons when reset is explicitly called
  React.useEffect(() => {
    if (resetTimestamp > 0) {
      setLocalFormData(prev => ({
        ...prev,
        selectedCoAReasons: [],
      }));
    }
  }, [resetTimestamp]);

  // Calculate payment amounts
  const monthlyAmount = results.finalPaymentAmount / 12;
  const fortnightlyAmount = results.finalPaymentAmount / 26;
  const dailyAmount = results.finalPaymentAmount / 365;

  // Check if any children exist in the calculation
  const hasChildren = formData?.children && formData.children.length > 0;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const webModalContainerStyle = isWeb ? { maxWidth: MAX_MODAL_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

  const renderBreakdownContent = () => (
    <ScrollView
      style={styles.expandedScrollView}
      contentContainerStyle={[styles.expandedContentContainer, { paddingBottom: insets.bottom + 20 }, webModalContainerStyle]}
      showsVerticalScrollIndicator={true}
    >
      {/* Hero Section in Expanded View */}
      <View style={styles.expandedHeroSection}>
        <Text style={styles.expandedHeroLabel}>
          {results.payer === "Neither" ? "No payment required" : `${results.payer} pays`}
        </Text>
        <Text style={[styles.expandedHeroAmount, isStale && styles.staleAmount]}>{formatCurrency(results.finalPaymentAmount)}</Text>
        <Text style={styles.expandedHeroSubtext}>per year</Text>
        <View style={styles.expandedSecondaryAmounts}>
          <View style={styles.expandedSecondaryItem}>
            <Text style={[styles.expandedSecondaryValue, isStale && styles.staleAmount]}>{formatCurrency(monthlyAmount)}</Text>
            <Text style={styles.expandedSecondaryLabel}>/month</Text>
          </View>
          <View style={styles.expandedDivider} />
          <View style={styles.expandedSecondaryItem}>
            <Text style={[styles.expandedSecondaryValue, isStale && styles.staleAmount]}>{formatCurrency(fortnightlyAmount)}</Text>
            <Text style={styles.expandedSecondaryLabel}>/fortnight</Text>
          </View>
          <View style={styles.expandedDivider} />
          <View style={styles.expandedSecondaryItem}>
            <Text style={[styles.expandedSecondaryValue, isStale && styles.staleAmount]}>{formatCurrency(dailyAmount)}</Text>
            <Text style={styles.expandedSecondaryLabel}>/day</Text>
          </View>
        </View>
      </View>

      <ChangeOfAssessmentPrompt
        key={`${results.finalPaymentAmount}-${results.payer}-${results.childResults.map(c => `${c.roundedCareA}-${c.roundedCareB}`).join('-')}-${results.ATI_A}-${results.ATI_B}`}
        results={results}
        formData={localFormData}
        onNavigate={() => setIsExpanded(false)}
        onCoAReasonsChange={(reasons) => {
          setLocalFormData(prev => ({
            ...prev,
            selectedCoAReasons: reasons,
          }));
        }}
      />
      {results && (
        <Suspense
          fallback={
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={{ marginTop: 10, color: '#64748b' }}>Loading breakdown...</Text>
            </View>
          }
        >
          <ResultsSimpleExplanation
            results={results}
            formState={{ supportA: formData?.supportA ?? false, supportB: formData?.supportB ?? false }}
          />
        </Suspense>
      )}

      {/* Smart Conversion Footer - Always show at bottom of results */}
      <SmartConversionFooter
        results={results}
        carePercentages={results.childResults.map(child => child.roundedCareA)}
        formData={formData}
        onBeforeNavigate={() => setIsExpanded(false)}
      />
    </ScrollView>
  );

  if (isInlineMode) {
    return (
      <View style={styles.twoColumnLayout}>
        <View style={styles.leftColumn}>
          <View style={styles.inlineHeroSection}>
            <Text style={[styles.expandedHeroAmount, isStale && styles.staleAmount]}>{formatCurrency(results.finalPaymentAmount)}</Text>
            <Text style={styles.expandedHeroLabel}>per year</Text>
          </View>
        </View>
        <ScrollView style={styles.rightColumn}>{renderBreakdownContent()}</ScrollView>
      </View>
    );
  }

  // Don't render modal at all if no children exist
  if (!hasChildren) {
    return null;
  }

  return (
    <>
      {!isExpanded && (
        <Pressable
          onPress={toggleExpand}
          style={[styles.fixedBottomCardWrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}
          accessibilityRole="button"
          accessibilityLabel={`${results.payer === "Neither" ? "No payment required" : `${results.payer} pays ${formatCurrency(results.finalPaymentAmount)} per year`}. Tap to view full breakdown`}
          accessibilityHint="Opens detailed calculation breakdown"
        >
          <View style={[styles.fixedBottomCard, { backgroundColor: '#3b82f6' }]}>
            <View style={styles.dragHandleContainer}><View style={styles.dragHandle} /></View>
            <View style={styles.collapsedContent}>
              <View style={styles.collapsedSummaryRow}>
                <Text style={styles.collapsedLabel}>
                  {results.payer === "Neither" ? "No payment" : `${results.payer} pays `}
                </Text>
                <Text style={[styles.collapsedAmountCondensed, isStale && styles.staleAmount]}>
                  {formatCurrency(results.finalPaymentAmount)}
                </Text>
              </View>
            </View>
            <View style={styles.expandHint}>
              <Text style={styles.expandHintText}>Tap for breakdown ▲</Text>
            </View>
          </View>
        </Pressable>
      )}

      <Modal visible={isExpanded} animationType="slide" presentationStyle="fullScreen" onRequestClose={toggleExpand}>
        <View style={[styles.expandedContainer, { paddingTop: insets.top }]}>
          <View style={styles.expandedHeader}>
            <View style={[styles.expandedHeaderContent, webModalContainerStyle]}>
              <Text style={styles.expandedHeaderTitle}>Full Breakdown</Text>
              <Pressable
                onPress={toggleExpand}
                style={styles.closeButton}
                accessibilityRole="button"
                accessibilityLabel="Close breakdown"
              >
                <Text style={styles.closeIcon}>✕</Text>
              </Pressable>
            </View>
          </View>
          {renderBreakdownContent()}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fixedBottomCardWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  fixedBottomCard: {
    width: '94%',
    maxWidth: 750, // Matches the narrow form width exactly
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    ...shadowPresets.modal,
    alignSelf: 'center', // Ensures it stays centered within its wrapper
  },
  collapsedContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
  },
  collapsedSummaryRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  collapsedLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  collapsedAmountCondensed: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    marginLeft: 6,
  },
  dragHandleContainer: { alignItems: "center", paddingVertical: 6 },
  dragHandle: { width: 30, height: 4, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 2 },
  expandHint: { alignItems: "center", paddingBottom: 4 },
  expandHintText: { color: "#ffffff", fontSize: 11, opacity: 0.8 },
  expandedContainer: { flex: 1, backgroundColor: "#f8f9fa" },
  expandedHeader: { padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#eee" },
  expandedHeaderContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  expandedHeaderTitle: { fontSize: 18, fontWeight: "600" },
  closeButton: { padding: 8 },
  closeIcon: { fontSize: 20, color: '#4a5568' },
  expandedScrollView: { flex: 1 },
  expandedContentContainer: { padding: 16, gap: 16 },
  expandedHeroSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: "#3b82f6",
    borderWidth: 1,
    borderColor: "#3b82f6",
    ...shadowPresets.large,
  },
  expandedHeroLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  expandedHeroAmount: {
    fontSize: 56,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -1,
    marginBottom: 4,
  },
  expandedHeroSubtext: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 20,
  },
  expandedSecondaryAmounts: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    gap: 16,
  },
  expandedSecondaryItem: {
    alignItems: "center",
    flex: 1,
  },
  expandedSecondaryValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  expandedSecondaryLabel: {
    fontSize: 12,
    color: "#ffffff",
  },
  expandedDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  staleAmount: {
    textDecorationLine: "line-through",
    textDecorationColor: "#ef4444",
    textDecorationStyle: "solid",
    opacity: 0.7,
  },
  twoColumnLayout: { flexDirection: "row", gap: 20 },
  leftColumn: { flex: 1 },
  rightColumn: { flex: 1.5 },
  inlineHeroSection: { padding: 20, backgroundColor: "#fff", borderRadius: 12 }
});