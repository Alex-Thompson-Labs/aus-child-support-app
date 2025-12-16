import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
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

export function CalculatorResults({ results }: CalculatorResultsProps) {
  const [showFullBreakdown, setShowFullBreakdown] = useState(false);
  
  const monthlyAmount = results.finalPaymentAmount / 12;
  const weeklyAmount = results.finalPaymentAmount / 52;
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Hero Payment Card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>
          {results.payer === "Neither" ? "No payment required" : `${results.payer} pays ${results.receiver}`}
        </Text>

        <View style={styles.amountsRow}>
          <View style={styles.yearlySection}>
            <Text style={styles.heroAmount}>{formatCurrency(results.finalPaymentAmount)}</Text>
            <Text style={styles.heroSubtext}>per year</Text>
          </View>
          <View style={styles.secondaryAmounts}>
            <View style={styles.secondaryItem}>
              <Text style={styles.secondaryValue}>{formatCurrency(monthlyAmount)}</Text>
              <Text style={styles.secondaryLabel}>/mo</Text>
            </View>
            <View style={styles.secondaryItem}>
              <Text style={styles.secondaryValue}>{formatCurrency(weeklyAmount)}</Text>
              <Text style={styles.secondaryLabel}>/wk</Text>
            </View>
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

      {/* Expandable Full Breakdown */}
      <View style={styles.card}>
        <Pressable
          onPress={() => setShowFullBreakdown(!showFullBreakdown)}
          style={styles.collapsibleHeader}
        >
          <Text style={styles.cardTitle}>Full Breakdown</Text>
          <Text style={styles.chevron}>{showFullBreakdown ? "▼" : "▶"}</Text>
        </Pressable>
        
        {showFullBreakdown && (
          <View style={styles.fullBreakdownContent}>
            {/* Income Details */}
            <View style={styles.breakdownSection}>
              <Text style={styles.breakdownSectionTitle}>Income Details</Text>
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
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Less: Rel. Deps</Text>
                  <Text style={[styles.tableCell, styles.tableRight]}>{formatCurrencyFull(results.relDepDeductibleA)}</Text>
                  <Text style={[styles.tableCell, styles.tableRight]}>{formatCurrencyFull(results.relDepDeductibleB)}</Text>
                </View>
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
              <View key={i} style={styles.breakdownSection}>
                <Text style={styles.breakdownSectionTitle}>
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
            <View style={styles.breakdownSection}>
              <Text style={styles.breakdownSectionTitle}>Final Summary</Text>
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
            <View style={styles.breakdownSection}>
              <Text style={styles.breakdownSectionTitle}>
                Reference Values ({results.year})
              </Text>
              <View style={styles.referenceGrid}>
                <Text style={styles.referenceLabel}>Self-Support Amount (SSA)</Text>
                <Text style={styles.referenceValue}>{formatCurrencyFull(results.SSA)}</Text>
                
                <Text style={styles.referenceLabel}>Fixed Annual Rate (FAR)</Text>
                <Text style={styles.referenceValue}>{formatCurrencyFull(results.FAR)}</Text>
                
                <Text style={styles.referenceLabel}>Min Annual Rate (MAR)</Text>
                <Text style={styles.referenceValue}>{formatCurrencyFull(results.MAR)}</Text>
                
                <Text style={styles.referenceLabel}>Combined CSI</Text>
                <Text style={styles.referenceValue}>{formatCurrencyFull(results.CCSI)}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    gap: 4,
  },
  referenceLabel: {
    fontSize: 14,
    color: "#94a3b8", // slate-400
  },
  referenceValue: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "right",
  },
});

