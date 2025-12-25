import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { CalculationResults } from "../types/calculator";

interface ResultsSimpleExplanationProps {
  results: CalculationResults;
}

// Helper to format currency
const formatCurrency = (num: number): string => {
  return `$${Math.round(num).toLocaleString()}`;
};

// Helper to format percentage
const formatPercent = (num: number): string => {
  return `${Math.round(num)}%`;
};

export function ResultsSimpleExplanation({ results }: ResultsSimpleExplanationProps) {
  // Calculate the "gap" - the key insight
  const incomeGapA = results.incomePercA - (results.childResults[0]?.costPercA || 0);
  const incomeGapB = results.incomePercB - (results.childResults[0]?.costPercB || 0);
  
  // Determine who pays based on the gap
  const parentAPays = incomeGapA > 0 && incomeGapA > incomeGapB;
  const parentBPays = incomeGapB > 0 && incomeGapB > incomeGapA;
  
  // Get average care percentage across all children
  const avgCareA = results.childResults.length > 0
    ? results.childResults.reduce((sum, child) => sum + child.roundedCareA, 0) / results.childResults.length
    : 0;
  const avgCareB = results.childResults.length > 0
    ? results.childResults.reduce((sum, child) => sum + child.roundedCareB, 0) / results.childResults.length
    : 0;

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.titleLabel}>Why this payment?</Text>
        <Text style={styles.title}>Here's how we calculated {formatCurrency(results.finalPaymentAmount)}/year</Text>
      </View>

      {/* Step 1: Income Split */}
      <View style={styles.step}>
        <View style={styles.stepHeader}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepTitle}>Income Split</Text>
        </View>
        
        <Text style={styles.stepExplanation}>
          First, we calculate each parent's income available for child support by deducting living costs.
        </Text>

        {/* Deduction breakdown for each parent */}
        <View style={styles.deductionCards}>
          {/* Parent A breakdown */}
          <View style={styles.deductionCard}>
            <Text style={[styles.deductionCardTitle, { color: '#3b82f6' }]}>Parent A</Text>
            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>Taxable income</Text>
              <Text style={styles.deductionValue}>{formatCurrency(results.ATI_A)}</Text>
            </View>
            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>− Self-support amount</Text>
              <Text style={styles.deductionValueNegative}>−{formatCurrency(results.SSA)}</Text>
            </View>
            {results.relDepDeductibleA > 0 && (
              <View style={styles.deductionRow}>
                <Text style={styles.deductionLabel}>− Other children</Text>
                <Text style={styles.deductionValueNegative}>−{formatCurrency(results.relDepDeductibleA)}</Text>
              </View>
            )}
            <View style={styles.deductionDivider} />
            <View style={styles.deductionRow}>
              <Text style={styles.deductionTotalLabel}>Child Support Income</Text>
              <Text style={styles.deductionTotalValue}>{formatCurrency(Math.max(0, results.CSI_A))}</Text>
            </View>
          </View>

          {/* Parent B breakdown */}
          <View style={styles.deductionCard}>
            <Text style={[styles.deductionCardTitle, { color: '#8b5cf6' }]}>Parent B</Text>
            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>Taxable income</Text>
              <Text style={styles.deductionValue}>{formatCurrency(results.ATI_B)}</Text>
            </View>
            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>− Self-support amount</Text>
              <Text style={styles.deductionValueNegative}>−{formatCurrency(results.SSA)}</Text>
            </View>
            {results.relDepDeductibleB > 0 && (
              <View style={styles.deductionRow}>
                <Text style={styles.deductionLabel}>− Other children</Text>
                <Text style={styles.deductionValueNegative}>−{formatCurrency(results.relDepDeductibleB)}</Text>
              </View>
            )}
            <View style={styles.deductionDivider} />
            <View style={styles.deductionRow}>
              <Text style={styles.deductionTotalLabel}>Child Support Income</Text>
              <Text style={styles.deductionTotalValue}>{formatCurrency(Math.max(0, results.CSI_B))}</Text>
            </View>
          </View>
        </View>

        {/* Income split summary */}
        <View style={styles.incomeSplitSummary}>
          <Text style={styles.incomeSplitTitle}>Income split:</Text>
        </View>

        <View style={styles.incomeComparison}>
          <View style={styles.incomeRow}>
            <Text style={[styles.incomeLabel, { color: '#3b82f6' }]}>Parent A</Text>
            <Text style={styles.incomeValue}>{formatCurrency(Math.max(0, results.CSI_A))}</Text>
            <View style={styles.percentBadge}>
              <Text style={styles.percentBadgeText}>{formatPercent(results.incomePercA)}</Text>
            </View>
          </View>

          {/* Visual bar */}
          <View style={styles.visualBar}>
            <View style={[styles.barSegmentA, { flex: results.incomePercA }]} />
            <View style={[styles.barSegmentB, { flex: results.incomePercB }]} />
          </View>

          <View style={styles.incomeRow}>
            <Text style={[styles.incomeLabel, { color: '#8b5cf6' }]}>Parent B</Text>
            <Text style={styles.incomeValue}>{formatCurrency(Math.max(0, results.CSI_B))}</Text>
            <View style={styles.percentBadge}>
              <Text style={styles.percentBadgeText}>{formatPercent(results.incomePercB)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.stepConclusion}>
          <Text style={styles.conclusionText}>
            ➜ Parent A should cover <Text style={styles.highlightText}>{formatPercent(results.incomePercA)}</Text> of child costs
          </Text>
          <Text style={styles.conclusionText}>
            ➜ Parent B should cover <Text style={styles.highlightText}>{formatPercent(results.incomePercB)}</Text> of child costs
          </Text>
        </View>
      </View>

      {/* Step 2: Care Split */}
      <View style={styles.step}>
        <View style={styles.stepHeader}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepTitle}>Care Split</Text>
        </View>

        <Text style={styles.stepExplanation}>
          When you care for a child, you cover costs directly (food, activities, etc.). This gives you "credit" toward your share.
        </Text>

        <View style={styles.careComparison}>
          <View style={styles.careRow}>
            <Text style={styles.careLabel}><Text style={{ color: '#3b82f6' }}>Parent A</Text> cares</Text>
            <Text style={styles.carePercent}>{formatPercent(avgCareA)}</Text>
            <Text style={styles.careSubtext}>of the time</Text>
          </View>

          {/* Visual bar for care */}
          <View style={styles.visualBar}>
            <View style={[styles.barSegmentA, { flex: avgCareA }]} />
            <View style={[styles.barSegmentB, { flex: avgCareB }]} />
          </View>

          <View style={styles.careRow}>
            <Text style={styles.careLabel}><Text style={{ color: '#8b5cf6' }}>Parent B</Text> cares</Text>
            <Text style={styles.carePercent}>{formatPercent(avgCareB)}</Text>
            <Text style={styles.careSubtext}>of the time</Text>
          </View>
        </View>

        {/* Care to Cost conversion */}
        <View style={styles.careConversion}>
          <Text style={styles.careConversionTitle}>Care time → Cost credit</Text>
          <Text style={styles.careConversionExplanation}>
            A formula converts care time into cost credit. More care time = more credit, but it's not 1:1.
          </Text>

          <View style={styles.conversionCards}>
            <View style={styles.conversionCard}>
              <Text style={[styles.conversionCardLabel, { color: '#3b82f6' }]}>Parent A</Text>
              <View style={styles.conversionRow}>
                <Text style={styles.conversionValue}>{formatPercent(avgCareA)}</Text>
                <Text style={styles.conversionArrow}>→</Text>
                <Text style={styles.conversionResult}>{formatPercent(results.childResults[0]?.costPercA || 0)}</Text>
              </View>
              <View style={styles.conversionLabels}>
                <Text style={styles.conversionSubLabel}>care time</Text>
                <Text style={styles.conversionSubLabel}>cost credit</Text>
              </View>
            </View>

            <View style={styles.conversionCard}>
              <Text style={[styles.conversionCardLabel, { color: '#8b5cf6' }]}>Parent B</Text>
              <View style={styles.conversionRow}>
                <Text style={styles.conversionValue}>{formatPercent(avgCareB)}</Text>
                <Text style={styles.conversionArrow}>→</Text>
                <Text style={styles.conversionResult}>{formatPercent(results.childResults[0]?.costPercB || 0)}</Text>
              </View>
              <View style={styles.conversionLabels}>
                <Text style={styles.conversionSubLabel}>care time</Text>
                <Text style={styles.conversionSubLabel}>cost credit</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.stepConclusion}>
          <Text style={styles.conclusionText}>
            ➜ Parent A's cost credit: <Text style={styles.highlightText}>
              {formatPercent(results.childResults[0]?.costPercA || 0)}
            </Text>
          </Text>
          <Text style={styles.conclusionText}>
            ➜ Parent B's cost credit: <Text style={styles.highlightText}>
              {formatPercent(results.childResults[0]?.costPercB || 0)}
            </Text>
          </Text>
        </View>
      </View>

      {/* Step 3: The Gap (KEY INSIGHT) */}
      <View style={[styles.step, styles.keyInsightStep]}>
        <View style={styles.stepHeader}>
          <View style={[styles.stepNumber, styles.keyStepNumber]}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepTitle}>The Gap</Text>
          <View style={styles.keyBadge}>
            <Text style={styles.keyBadgeText}>KEY</Text>
          </View>
        </View>

        <Text style={styles.stepExplanation}>
          If your income responsibility is higher than what you cover through care, you pay the difference.
        </Text>

        <View style={styles.gapCalculation}>
          {parentAPays && (
            <>
              <View style={styles.gapRow}>
                <Text style={styles.gapLabel}>Income responsibility</Text>
                <Text style={styles.gapValue}>{formatPercent(results.incomePercA)}</Text>
              </View>
              <View style={styles.gapRow}>
                <Text style={styles.gapLabel}>Covered through care</Text>
                <Text style={styles.gapValue}>− {formatPercent(results.childResults[0]?.costPercA || 0)}</Text>
              </View>
              <View style={styles.gapDivider} />
              <View style={styles.gapRow}>
                <Text style={[styles.gapLabel, styles.gapLabelBold]}>Parent A owes</Text>
                <Text style={[styles.gapValue, styles.gapValueHighlight]}>
                  {formatPercent(Math.max(0, incomeGapA))}
                </Text>
              </View>
            </>
          )}
          
          {parentBPays && (
            <>
              <View style={styles.gapRow}>
                <Text style={styles.gapLabel}>Income responsibility</Text>
                <Text style={styles.gapValue}>{formatPercent(results.incomePercB)}</Text>
              </View>
              <View style={styles.gapRow}>
                <Text style={styles.gapLabel}>Covered through care</Text>
                <Text style={styles.gapValue}>− {formatPercent(results.childResults[0]?.costPercB || 0)}</Text>
              </View>
              <View style={styles.gapDivider} />
              <View style={styles.gapRow}>
                <Text style={[styles.gapLabel, styles.gapLabelBold]}>Parent B owes</Text>
                <Text style={[styles.gapValue, styles.gapValueHighlight]}>
                  {formatPercent(Math.max(0, incomeGapB))}
                </Text>
              </View>
            </>
          )}

          {!parentAPays && !parentBPays && (
            <View style={styles.gapRow}>
              <Text style={styles.gapLabel}>Both parents cover their share through care</Text>
            </View>
          )}
        </View>
      </View>

      {/* Step 4: Total Costs */}
      <View style={styles.step}>
        <View style={styles.stepHeader}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <Text style={styles.stepTitle}>Total Child Costs</Text>
        </View>

        <Text style={styles.stepExplanation}>
          Child costs are calculated based on your combined income and how many children you have.
        </Text>

        {/* Combined income */}
        <View style={styles.costInputRow}>
          <Text style={styles.costInputLabel}>Combined Child Support Income</Text>
          <Text style={styles.costInputValue}>{formatCurrency(results.CCSI)}</Text>
        </View>

        {/* Bracket calculation */}
        {results.costBracketInfo && (
          <View style={styles.bracketCalculation}>
            <Text style={styles.bracketTitle}>
              Your bracket: {formatCurrency(results.costBracketInfo.minIncome)} – {results.costBracketInfo.maxIncome ? formatCurrency(results.costBracketInfo.maxIncome) : "unlimited"}
            </Text>

            <View style={styles.bracketFormula}>
              <View style={styles.bracketRow}>
                <Text style={styles.bracketLabel}>Base amount</Text>
                <Text style={styles.bracketValue}>{formatCurrency(results.costBracketInfo.fixed)}</Text>
              </View>
              {results.costBracketInfo.rate > 0 && (
                <View style={styles.bracketRow}>
                  <Text style={styles.bracketLabel}>+ {Math.round(results.costBracketInfo.rate * 100)}% × {formatCurrency(results.costBracketInfo.incomeInBracket)}</Text>
                  <Text style={styles.bracketValue}>+{formatCurrency(results.costBracketInfo.rate * results.costBracketInfo.incomeInBracket)}</Text>
                </View>
              )}
              <View style={styles.bracketDivider} />
              <View style={styles.bracketRow}>
                <Text style={styles.bracketTotalLabel}>Annual child cost</Text>
                <Text style={styles.bracketTotalValue}>{formatCurrency(results.totalCost)}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Step 5: Your Payment */}
      <View style={[styles.step, styles.finalStep]}>
        <View style={styles.stepHeader}>
          <View style={[styles.stepNumber, styles.finalStepNumber]}>
            <Text style={styles.stepNumberText}>5</Text>
          </View>
          <Text style={styles.stepTitle}>Your Payment</Text>
        </View>

        <Text style={styles.stepExplanation}>
          Apply the gap percentage to the total cost to get the final payment.
        </Text>

        <View style={styles.finalCalculation}>
          {parentAPays && (
            <>
              <View style={styles.finalRow}>
                <Text style={styles.finalLabel}>{formatPercent(Math.max(0, incomeGapA))} of {formatCurrency(results.totalCost)}</Text>
              </View>
              <View style={styles.finalResult}>
                <Text style={styles.finalResultLabel}>Parent A pays</Text>
                <Text style={styles.finalResultValue}>{formatCurrency(results.finalPaymentAmount)}</Text>
                <Text style={styles.finalResultPeriod}>per year</Text>
              </View>
            </>
          )}

          {parentBPays && (
            <>
              <View style={styles.finalRow}>
                <Text style={styles.finalLabel}>{formatPercent(Math.max(0, incomeGapB))} of {formatCurrency(results.totalCost)}</Text>
              </View>
              <View style={styles.finalResult}>
                <Text style={styles.finalResultLabel}>Parent B pays</Text>
                <Text style={styles.finalResultValue}>{formatCurrency(results.finalPaymentAmount)}</Text>
                <Text style={styles.finalResultPeriod}>per year</Text>
              </View>
            </>
          )}

          {!parentAPays && !parentBPays && (
            <View style={styles.finalResult}>
              <Text style={styles.finalResultLabel}>No payment required</Text>
              <Text style={styles.finalResultValue}>$0</Text>
            </View>
          )}
        </View>
      </View>

      {/* Optional: Special rates notice */}
      {results.rateApplied !== "None" && (
        <View style={styles.specialNotice}>
          <Text style={styles.specialNoticeTitle}>ℹ️ Special Rate Applied</Text>
          <Text style={styles.specialNoticeText}>
            {results.rateApplied} was applied instead of the standard formula calculation.
            {results.rateApplied.includes("FAR") && " This happens when income is low but above the minimum threshold."}
            {results.rateApplied.includes("MAR") && " This happens when income is very low and receiving Centrelink support."}
          </Text>
        </View>
      )}

      {/* Notice for $0 payment when low income but has care */}
      {results.finalPaymentAmount === 0 && results.rateApplied === "None" && (
        <>
          {results.ATI_A < results.SSA && avgCareA >= 14 && (
            <View style={styles.specialNotice}>
              <Text style={styles.specialNoticeTitle}>ℹ️ No Payment Required</Text>
              <Text style={styles.specialNoticeText}>
                Parent A's income ({formatCurrency(results.ATI_A)}) is below the self-support amount ({formatCurrency(results.SSA)}), so they have no income-based obligation. Their care time ({formatPercent(avgCareA)}) means they're already contributing by covering costs directly during care.
              </Text>
            </View>
          )}
          {results.ATI_B < results.SSA && avgCareB >= 14 && (
            <View style={styles.specialNotice}>
              <Text style={styles.specialNoticeTitle}>ℹ️ No Payment Required</Text>
              <Text style={styles.specialNoticeText}>
                Parent B's income ({formatCurrency(results.ATI_B)}) is below the self-support amount ({formatCurrency(results.SSA)}), so they have no income-based obligation. Their care time ({formatPercent(avgCareB)}) means they're already contributing by covering costs directly during care.
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  titleSection: {
    marginBottom: 8,
  },
  titleLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b", // slate-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    lineHeight: 28,
  },
  
  // Step container
  step: {
    backgroundColor: "#1e293b", // slate-800
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#334155", // slate-700
  },
  keyInsightStep: {
    backgroundColor: "#1e3a5f", // Darker blue tint
    borderColor: "#2563eb", // blue-600
    borderWidth: 2,
  },
  finalStep: {
    backgroundColor: "#2563eb", // blue-600
    borderColor: "#3b82f6", // blue-500
  },
  
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#334155", // slate-700
    alignItems: "center",
    justifyContent: "center",
  },
  keyStepNumber: {
    backgroundColor: "#2563eb", // blue-600
  },
  finalStepNumber: {
    backgroundColor: "#1e40af", // blue-800
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    flex: 1,
  },
  keyBadge: {
    backgroundColor: "#fbbf24", // amber-400
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  keyBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#000000",
  },
  stepExplanation: {
    fontSize: 14,
    color: "#cbd5e1", // slate-300
    lineHeight: 20,
    marginBottom: 16,
  },
  stepConclusion: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#334155", // slate-700
  },
  conclusionText: {
    fontSize: 14,
    color: "#94a3b8", // slate-400
    lineHeight: 20,
  },
  highlightText: {
    color: "#60a5fa", // blue-400
    fontWeight: "600",
  },

  // Deduction breakdown cards
  deductionCards: {
    gap: 12,
    marginBottom: 16,
  },
  deductionCard: {
    backgroundColor: "#0f172a", // slate-900
    borderRadius: 8,
    padding: 12,
    gap: 6,
  },
  deductionCardTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8", // slate-400
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  deductionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deductionLabel: {
    fontSize: 13,
    color: "#94a3b8", // slate-400
  },
  deductionValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#cbd5e1", // slate-300
  },
  deductionValueNegative: {
    fontSize: 13,
    fontWeight: "500",
    color: "#f87171", // red-400
  },
  deductionDivider: {
    height: 1,
    backgroundColor: "#334155", // slate-700
    marginVertical: 4,
  },
  deductionTotalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
  },
  deductionTotalValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#60a5fa", // blue-400
  },

  // Income split summary
  incomeSplitSummary: {
    marginBottom: 8,
  },
  incomeSplitTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8", // slate-400
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Income comparison
  incomeComparison: {
    gap: 12,
  },
  incomeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  incomeLabel: {
    fontSize: 14,
    color: "#cbd5e1", // slate-300
    flex: 1,
  },
  incomeValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    minWidth: 80,
    textAlign: "right",
  },
  percentBadge: {
    backgroundColor: "#334155", // slate-700
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 56,
    alignItems: "center",
  },
  percentBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#60a5fa", // blue-400
  },

  // Visual bar
  visualBar: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#334155", // slate-700
  },
  barSegmentA: {
    backgroundColor: "#3b82f6", // blue-500
  },
  barSegmentB: {
    backgroundColor: "#8b5cf6", // violet-500
  },

  // Care comparison
  careComparison: {
    gap: 12,
  },
  careRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  careLabel: {
    fontSize: 14,
    color: "#cbd5e1", // slate-300
    flex: 1,
  },
  carePercent: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    minWidth: 60,
    textAlign: "right",
  },
  careSubtext: {
    fontSize: 12,
    color: "#94a3b8", // slate-400
    minWidth: 72,
  },

  // Care to Cost conversion
  careConversion: {
    marginTop: 16,
    backgroundColor: "#0f172a", // slate-900
    borderRadius: 8,
    padding: 12,
  },
  careConversionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8", // slate-400
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  careConversionExplanation: {
    fontSize: 12,
    color: "#64748b", // slate-500
    marginBottom: 12,
    lineHeight: 16,
  },
  conversionCards: {
    flexDirection: "row",
    gap: 12,
  },
  conversionCard: {
    flex: 1,
    backgroundColor: "#1e293b", // slate-800
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
  conversionCardLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748b", // slate-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  conversionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  conversionValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#cbd5e1", // slate-300
  },
  conversionArrow: {
    fontSize: 14,
    color: "#64748b", // slate-500
  },
  conversionResult: {
    fontSize: 16,
    fontWeight: "700",
    color: "#60a5fa", // blue-400
  },
  conversionLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  conversionSubLabel: {
    fontSize: 9,
    color: "#64748b", // slate-500
    textTransform: "uppercase",
  },

  // Gap calculation (THE KEY INSIGHT)
  gapCalculation: {
    backgroundColor: "#0f172a", // slate-900 (darker)
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  gapRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gapLabel: {
    fontSize: 14,
    color: "#94a3b8", // slate-400
  },
  gapLabelBold: {
    fontWeight: "600",
    color: "#ffffff",
  },
  gapValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#cbd5e1", // slate-300
  },
  gapValueHighlight: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fbbf24", // amber-400
  },
  gapDivider: {
    height: 1,
    backgroundColor: "#334155", // slate-700
    marginVertical: 4,
  },

  // Cost input row
  costInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  costInputLabel: {
    fontSize: 13,
    color: "#94a3b8", // slate-400
  },
  costInputValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },

  // Bracket calculation
  bracketCalculation: {
    backgroundColor: "#0f172a", // slate-900
    borderRadius: 8,
    padding: 12,
  },
  bracketTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8", // slate-400
    marginBottom: 12,
  },
  bracketFormula: {
    gap: 8,
  },
  bracketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bracketLabel: {
    fontSize: 13,
    color: "#94a3b8", // slate-400
  },
  bracketValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#cbd5e1", // slate-300
  },
  bracketDivider: {
    height: 1,
    backgroundColor: "#334155", // slate-700
    marginVertical: 4,
  },
  bracketTotalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
  },
  bracketTotalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#60a5fa", // blue-400
  },

  // Total cost box (legacy - keeping for reference)
  totalCostBox: {
    backgroundColor: "#0f172a", // slate-900
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  totalCostLabel: {
    fontSize: 12,
    color: "#94a3b8", // slate-400
    marginBottom: 4,
  },
  totalCostValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
  },

  // Final calculation
  finalCalculation: {
    gap: 12,
  },
  finalRow: {
    alignItems: "center",
  },
  finalLabel: {
    fontSize: 16,
    color: "#bfdbfe", // blue-200
    fontWeight: "500",
  },
  finalResult: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  finalResultLabel: {
    fontSize: 12,
    color: "#bfdbfe", // blue-200
    marginBottom: 4,
  },
  finalResultValue: {
    fontSize: 36,
    fontWeight: "700",
    color: "#8b5cf6", // violet-500
    letterSpacing: -0.5,
  },
  finalResultPeriod: {
    fontSize: 14,
    color: "#bfdbfe", // blue-200
    marginTop: 2,
  },

  // Special notice
  specialNotice: {
    backgroundColor: "#fef3c7", // amber-100
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#fbbf24", // amber-400
  },
  specialNoticeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#78350f", // amber-900
    marginBottom: 4,
  },
  specialNoticeText: {
    fontSize: 13,
    color: "#92400e", // amber-800
    lineHeight: 18,
  },
});
