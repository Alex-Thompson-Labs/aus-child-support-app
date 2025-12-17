import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { CalculationResults } from "../types/calculator";

interface CalculatorResultsProps {
  results: CalculationResults;
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

export function CalculatorResults({ results }: CalculatorResultsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const monthlyAmount = results.finalPaymentAmount / 12;
  const fortnightlyAmount = results.finalPaymentAmount / 26;
  const dailyAmount = results.finalPaymentAmount / 365;

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

      {/* Cost Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cost of Children</Text>

        <View style={styles.costTotalRow}>
          <Text style={styles.costTotalLabel}>Total Cost</Text>
          <Text style={styles.costTotalAmount}>
            {formatCurrency(results.totalCost)}
          </Text>
        </View>

        <View style={styles.childrenCostList}>
          {results.childResults.map((child, i) => (
            <View key={i} style={styles.childCostItem}>
              <View style={styles.childCostLeft}>
                <View style={styles.childCostNumber}>
                  <Text style={styles.childCostNumberText}>{i + 1}</Text>
                </View>
                <View>
                  <Text style={styles.childCostName}>
                    Child {i + 1} ({child.age})
                  </Text>
                  <Text style={styles.childCostCare}>
                    Care: A {child.roundedCareA}% | B {child.roundedCareB}%
                  </Text>
                </View>
              </View>
              <Text style={styles.childCostAmount}>
                {formatCurrency(child.costPerChild)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Income Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Income Details</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Metric</Text>
            <Text style={[styles.tableHeader, styles.tableRight]}>Parent A</Text>
            <Text style={[styles.tableHeader, styles.tableRight]}>Parent B</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>ATI</Text>
            <Text style={[styles.tableCell, styles.tableRight]}>{formatCurrencyFull(results.ATI_A)}</Text>
            <Text style={[styles.tableCell, styles.tableRight]}>{formatCurrencyFull(results.ATI_B)}</Text>
          </View>
          {(results.relDepDeductibleA > 0 || results.relDepDeductibleB > 0) && (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Less: Rel. Deps</Text>
              <Text style={[styles.tableCell, styles.tableRight]}>{formatCurrencyFull(results.relDepDeductibleA)}</Text>
              <Text style={[styles.tableCell, styles.tableRight]}>{formatCurrencyFull(results.relDepDeductibleB)}</Text>
            </View>
          )}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Less: SSA</Text>
            <Text style={[styles.tableCell, styles.tableRight]}>{formatCurrencyFull(results.SSA)}</Text>
            <Text style={[styles.tableCell, styles.tableRight]}>{formatCurrencyFull(results.SSA)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellBold]}>CSI</Text>
            <Text style={[styles.tableCell, styles.tableCellBold, styles.tableRight]}>{formatCurrencyFull(results.CSI_A)}</Text>
            <Text style={[styles.tableCell, styles.tableCellBold, styles.tableRight]}>{formatCurrencyFull(results.CSI_B)}</Text>
          </View>
        </View>
      </View>

      {/* Child Details */}
      {results.childResults.map((child, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>
            Child {i + 1} ({child.age})
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Metric</Text>
              <Text style={[styles.tableHeader, styles.tableRight]}>Parent A</Text>
              <Text style={[styles.tableHeader, styles.tableRight]}>Parent B</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Care %</Text>
              <Text style={[styles.tableCell, styles.tableRight]}>{child.roundedCareA}%</Text>
              <Text style={[styles.tableCell, styles.tableRight]}>{child.roundedCareB}%</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Cost %</Text>
              <Text style={[styles.tableCell, styles.tableRight]}>{child.costPercA.toFixed(1)}%</Text>
              <Text style={[styles.tableCell, styles.tableRight]}>{child.costPercB.toFixed(1)}%</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>CS %</Text>
              <Text style={[styles.tableCell, styles.tableRight]}>{child.childSupportPercA.toFixed(1)}%</Text>
              <Text style={[styles.tableCell, styles.tableRight]}>{child.childSupportPercB.toFixed(1)}%</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellBold]}>Liability</Text>
              <Text style={[styles.tableCell, styles.tableCellBold, styles.tableRight]}>
                {child.liabilityA > 0 ? formatCurrencyFull(child.liabilityA) : "—"}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellBold, styles.tableRight]}>
                {child.liabilityB > 0 ? formatCurrencyFull(child.liabilityB) : "—"}
              </Text>
            </View>
          </View>
        </View>
      ))}

      {/* Final Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Final Summary</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Metric</Text>
            <Text style={[styles.tableHeader, styles.tableRight]}>Parent A</Text>
            <Text style={[styles.tableHeader, styles.tableRight]}>Parent B</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Total Liability</Text>
            <Text style={[styles.tableCell, styles.tableRight]}>{formatCurrencyFull(results.totalLiabilityA)}</Text>
            <Text style={[styles.tableCell, styles.tableRight]}>{formatCurrencyFull(results.totalLiabilityB)}</Text>
          </View>
          {results.rateApplied !== "None" && (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Rate Applied</Text>
              <Text style={[styles.tableCell, styles.tableRight, styles.tableCellSpan]}>{results.rateApplied}</Text>
            </View>
          )}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellBold]}>Final Liability</Text>
            <Text style={[styles.tableCell, styles.tableCellBold, styles.tableRight]}>{formatCurrencyFull(results.finalLiabilityA)}</Text>
            <Text style={[styles.tableCell, styles.tableCellBold, styles.tableRight]}>{formatCurrencyFull(results.finalLiabilityB)}</Text>
          </View>
        </View>
      </View>

      {/* Reference Values */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Reference Values ({results.year})
        </Text>
        <View style={styles.referenceGrid}>
          <View style={styles.referenceRow}>
            <Text style={styles.referenceLabel}>Self-Support Amount (SSA)</Text>
            <Text style={styles.referenceValue}>{formatCurrencyFull(results.SSA)}</Text>
          </View>
          <View style={styles.referenceRow}>
            <Text style={styles.referenceLabel}>Fixed Annual Rate (FAR)</Text>
            <Text style={styles.referenceValue}>{formatCurrencyFull(results.FAR)}</Text>
          </View>
          <View style={styles.referenceRow}>
            <Text style={styles.referenceLabel}>Min Annual Rate (MAR)</Text>
            <Text style={styles.referenceValue}>{formatCurrencyFull(results.MAR)}</Text>
          </View>
          <View style={styles.referenceRow}>
            <Text style={styles.referenceLabel}>Combined CSI</Text>
            <Text style={styles.referenceValue}>{formatCurrencyFull(results.CCSI)}</Text>
          </View>
        </View>
      </View>
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
    flex: 1,
  },
  referenceValue: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "right",
  },
});

