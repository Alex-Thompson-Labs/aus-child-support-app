import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { CalculationResults } from "../types/calculator";
import { ResultsSimpleExplanation } from "./ResultsSimpleExplanation";
import { LawyerAlert } from "./LawyerAlert";
import { Analytics } from "../utils/analytics";
import { detectComplexity, getAlertConfig } from "../utils/complexity-detection";

interface CalculatorResultsProps {
  results: CalculationResults;
  formData?: any; // TODO: Add proper FormData type
}

// Helper to format currency
const formatCurrency = (num: number | undefined | null): string => {
  if (num === undefined || num === null || isNaN(num)) {
    return "$0";
  }
  return `$${Math.round(num).toLocaleString()}`;
};

// Helper to format currency with decimals
const formatCurrencyFull = (num: number | undefined | null): string => {
  if (num === undefined || num === null || isNaN(num)) {
    return "$0.00";
  }
  return `$${num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export function CalculatorResults({ results, formData }: CalculatorResultsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const monthlyAmount = results.finalPaymentAmount / 12;
  const fortnightlyAmount = results.finalPaymentAmount / 26;
  const dailyAmount = results.finalPaymentAmount / 365;

  // Detect complexity and get alert configuration
  const flags = detectComplexity(results, formData || {});
  const alertConfig = getAlertConfig(flags, results);

  // Log for verification (Phase 1)
  console.log('[CalculatorResults] Complexity flags:', flags);
  console.log('[CalculatorResults] Alert config:', alertConfig);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isExpanded ? 1 : 0,
      useNativeDriver: false,
      tension: 65,
      friction: 11,
    }).start();
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Render the expanded full-screen breakdown content
  const renderBreakdownContent = () => (
    <ScrollView
      style={styles.expandedScrollView}
      contentContainerStyle={[styles.expandedContentContainer, { paddingBottom: insets.bottom + 20 }]}
      showsVerticalScrollIndicator={true}
    >
      {/* Hero Section in Expanded View */}
      <View style={styles.expandedHeroSection}>
        <Text style={styles.expandedHeroLabel}>
          {results.payer === "Neither" ? "No payment required" : `${results.payer} pays ${results.receiver}`}
        </Text>
        <Text style={styles.expandedHeroAmount}>{formatCurrency(results.finalPaymentAmount)}</Text>
        <Text style={styles.expandedHeroSubtext}>per year</Text>
        <View style={styles.expandedSecondaryAmounts}>
          <View style={styles.expandedSecondaryItem}>
            <Text style={styles.expandedSecondaryValue}>{formatCurrency(monthlyAmount)}</Text>
            <Text style={styles.expandedSecondaryLabel}>/month</Text>
          </View>
          <View style={styles.expandedDivider} />
          <View style={styles.expandedSecondaryItem}>
            <Text style={styles.expandedSecondaryValue}>{formatCurrency(fortnightlyAmount)}</Text>
            <Text style={styles.expandedSecondaryLabel}>/fortnight</Text>
          </View>
          <View style={styles.expandedDivider} />
          <View style={styles.expandedSecondaryItem}>
            <Text style={styles.expandedSecondaryValue}>{formatCurrency(dailyAmount)}</Text>
            <Text style={styles.expandedSecondaryLabel}>/day</Text>
          </View>
        </View>
      </View>

      <ResultsSimpleExplanation results={results} />
    </ScrollView>
  );

  return (
    <>
      {/* Fixed Bottom Payment Card (Collapsed) */}
      {!isExpanded && (
        <Pressable
          onPress={toggleExpand}
          style={[styles.fixedBottomCard, { paddingBottom: Math.max(insets.bottom, 16) }]}
        >
          {/* Drag Handle */}
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          <View style={styles.collapsedContent}>
            <View style={styles.collapsedLeft}>
              <Text style={styles.collapsedLabel}>
                {results.payer === "Neither" ? "No payment" : `${results.payer} pays ${results.receiver}`}
              </Text>
              <Text style={styles.collapsedAmount}>{formatCurrency(results.finalPaymentAmount)}</Text>
              <Text style={styles.collapsedSubtext}>per year</Text>
            </View>
            <View style={styles.collapsedRight}>
              <View style={styles.collapsedSecondary}>
                <Text style={styles.collapsedSecondaryValue}>{formatCurrency(monthlyAmount)}</Text>
                <Text style={[styles.collapsedSecondaryLabel, { width: 32 }]}>/mo</Text>
              </View>
              <View style={styles.collapsedSecondary}>
                <Text style={styles.collapsedSecondaryValue}>{formatCurrency(fortnightlyAmount)}</Text>
                <Text style={[styles.collapsedSecondaryLabel, { width: 32 }]}>/fn</Text>
              </View>
              <View style={styles.collapsedSecondary}>
                <Text style={styles.collapsedSecondaryValue}>{formatCurrency(dailyAmount)}</Text>
                <Text style={[styles.collapsedSecondaryLabel, { width: 32 }]}>/day</Text>
              </View>
            </View>
          </View>

          <View style={styles.expandHint}>
            <Text style={styles.expandHintText}>Tap to see full breakdown</Text>
            <Text style={styles.expandChevron}>▲</Text>
          </View>
        </Pressable>
      )}

      {/* Expanded Full-Screen Modal */}
      <Modal
        visible={isExpanded}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={toggleExpand}
      >
        <View style={[styles.expandedContainer, { paddingTop: insets.top }]}>
          {/* Header with Close Button */}
          <View style={styles.expandedHeader}>
            <Text style={styles.expandedHeaderTitle}>Payment Details</Text>
            <Pressable onPress={toggleExpand} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          {/* Drag Handle to Collapse */}
          <Pressable onPress={toggleExpand} style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </Pressable>

          {renderBreakdownContent()}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Fixed bottom card styles (collapsed state)
  fixedBottomCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1e40af", // blue-800
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  dragHandleContainer: {
    alignItems: "center",
    paddingVertical: 4,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
  },
  collapsedContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  collapsedLeft: {
    flex: 1,
  },
  collapsedLabel: {
    color: "#93c5fd", // blue-300
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
  },
  collapsedAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  collapsedSubtext: {
    color: "#93c5fd", // blue-300
    fontSize: 12,
  },
  collapsedRight: {
    gap: 4,
    alignItems: "flex-end",
  },
  collapsedSecondary: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  collapsedSecondaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  collapsedSecondaryLabel: {
    fontSize: 10,
    color: "#93c5fd", // blue-300
  },
  expandHint: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingTop: 8,
    paddingBottom: 4,
  },
  expandHintText: {
    color: "#93c5fd", // blue-300
    fontSize: 11,
    fontWeight: "500",
  },
  expandChevron: {
    color: "#93c5fd", // blue-300
    fontSize: 10,
  },

  // Expanded modal styles
  expandedContainer: {
    flex: 1,
    backgroundColor: "#0f172a", // slate-900
  },
  expandedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b", // slate-800
  },
  expandedHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#334155", // slate-700
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  expandedScrollView: {
    flex: 1,
  },
  expandedContentContainer: {
    padding: 16,
    gap: 16,
  },
  expandedHeroSection: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#2563eb", // blue-600
    borderRadius: 16,
    marginBottom: 8,
  },
  expandedHeroLabel: {
    color: "#bfdbfe", // blue-200
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  expandedHeroAmount: {
    fontSize: 48,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -1,
  },
  expandedHeroSubtext: {
    color: "#bfdbfe", // blue-200
    fontSize: 14,
    marginBottom: 16,
  },
  expandedSecondaryAmounts: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  expandedSecondaryItem: {
    alignItems: "center",
  },
  expandedSecondaryValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
  },
  expandedSecondaryLabel: {
    fontSize: 12,
    color: "#bfdbfe", // blue-200
  },
  expandedDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  // Existing styles (kept for compatibility)
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  heroCard: {
    borderRadius: 16,
    backgroundColor: "#2563eb", // blue-600
    padding: 20,
    overflow: "hidden",
  },
  heroLabel: {
    color: "#bfdbfe", // blue-200
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  amountsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  yearlySection: {
    flex: 1,
  },
  heroAmount: {
    fontSize: 42,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -1,
  },
  heroSubtext: {
    color: "#bfdbfe", // blue-200
    fontSize: 14,
  },
  secondaryAmounts: {
    gap: 4,
    alignItems: "flex-end",
  },
  secondaryItem: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  secondaryValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  secondaryLabel: {
    fontSize: 12,
    color: "#bfdbfe", // blue-200
  },
  card: {
    backgroundColor: "#1e293b", // slate-800
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#334155", // slate-700
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8", // slate-400
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  costTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 16,
  },
  costTotalLabel: {
    color: "#ffffff",
    fontSize: 16,
  },
  costTotalAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  childrenCostList: {
    gap: 8,
  },
  childCostItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#334155", // slate-700
  },
  childCostLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  childCostNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#334155", // slate-700
    alignItems: "center",
    justifyContent: "center",
  },
  childCostNumberText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#cbd5e1", // slate-300
  },
  childCostName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  childCostCare: {
    fontSize: 12,
    color: "#94a3b8", // slate-400
    marginTop: 2,
  },
  childCostAmount: {
    color: "#ffffff",
    fontWeight: "500",
    fontSize: 16,
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chevron: {
    color: "#94a3b8", // slate-400
    fontSize: 12,
  },
  fullBreakdownContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#334155", // slate-700
    gap: 16,
  },
  breakdownSection: {
    gap: 8,
  },
  breakdownSectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b", // slate-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  table: {
    gap: 4,
  },
  tableRow: {
    flexDirection: "row",
    gap: 8,
  },
  tableHeader: {
    flex: 1,
    fontSize: 14,
    color: "#94a3b8", // slate-400
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: "#ffffff",
  },
  tableCellWithHelp: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tableCellBold: {
    fontWeight: "500",
  },
  tableRight: {
    textAlign: "right",
  },
  tableCellSpan: {
    flex: 2,
  },
  referenceGrid: {
    gap: 8,
  },
  referenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  referenceLabel: {
    fontSize: 14,
    color: "#94a3b8", // slate-400
  },
  referenceLabelContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  referenceValue: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "right",
  },

  // Special rate card
  specialRateCard: {
    backgroundColor: "#fef3c7", // amber-100
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b", // amber-500
  },
  specialRateTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400e", // amber-800
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  specialRateValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#78350f", // amber-900
    marginBottom: 8,
  },
  specialRateExplanation: {
    fontSize: 13,
    color: "#92400e", // amber-800
    lineHeight: 18,
  },

  // View toggle styles
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#1e293b", // slate-800
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#2563eb", // blue-600
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#94a3b8", // slate-400
  },
  toggleButtonTextActive: {
    color: "#ffffff",
  },
});

