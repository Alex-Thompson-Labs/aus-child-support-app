import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { CalculationResults } from "../types/calculator";
import { HelpTooltip } from "./HelpTooltip";

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

// Helper to get gradient colors based on payer
const getGradientColors = (payer: string) => {
  if (payer === "Neither") {
    return ['#475569', '#475569', '#334155'] as const; // slate gradient for no payment
  }

  if (payer === "Parent A") {
    return ['#3b82f6', '#1e40af', '#8b5cf6'] as const; // blue → dark blue → purple
  }

  return ['#8b5cf6', '#5b21b6', '#3b82f6'] as const; // purple → dark purple → blue
};

export function ResultsSimpleExplanation({ results }: ResultsSimpleExplanationProps) {
  // Collapsible state management
  const [expandedSteps, setExpandedSteps] = useState({
    step1: false,  // Income Percentages - collapsed
    step2: false,  // Care/Cost Percentage - collapsed
    step3: true,   // Child Support % - EXPANDED
    step4: false,  // Cost of Children - collapsed
    step5: true,   // Assessment Result - EXPANDED
  });

  // Calculate payment periods
  const monthlyAmount = results.finalPaymentAmount / 12;
  const fortnightlyAmount = results.finalPaymentAmount / 26;
  const dailyAmount = results.finalPaymentAmount / 365;

  // Determine who pays based on final liabilities (not gap calculation)
  const parentAPays = results.payer === "Parent A";
  const parentBPays = results.payer === "Parent B";

  return (
    <View style={styles.container}>
      {/* Step 1: Income Split */}
      <View style={styles.step}>
        <Pressable
          onPress={() => setExpandedSteps(prev => ({...prev, step1: !prev.step1}))}
          style={styles.stepHeader}
        >
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepTitle}>INCOME PERCENTAGES</Text>
          <Text style={styles.chevron}>{expandedSteps.step1 ? '▼' : '▶'}</Text>
        </Pressable>

        {expandedSteps.step1 && (
          <>
            <Text style={styles.stepExplanation}>
          By deducting income to reflect the income required to support themselves as well as any children they may care for outside of Child Support.
        </Text>

        {/* Deduction breakdown for each parent */}
        <View style={styles.deductionCards}>
          {/* Parent A breakdown */}
          <View style={styles.deductionCard}>
            <Text style={[styles.deductionCardTitle, { color: '#3b82f6' }]}>PARENT A</Text>
            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>Adjusted taxable income</Text>
              <Text style={styles.deductionValue}>{formatCurrency(results.ATI_A)}</Text>
            </View>
            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>Self-support amount</Text>
              <Text style={styles.deductionValueNegative}>({formatCurrency(results.SSA)})</Text>
            </View>
            {results.relDepDeductibleA > 0 && (
              <View style={styles.deductionRow}>
                <Text style={styles.deductionLabel}>Rel dep allowance</Text>
                <Text style={styles.deductionValueNegative}>({formatCurrency(results.relDepDeductibleA)})</Text>
              </View>
            )}
            <View style={styles.deductionDivider} />
            <View style={styles.deductionRow}>
              <Text style={styles.deductionTotalLabel}>Child Support Income</Text>
              <Text style={[styles.deductionTotalValue, { color: '#3b82f6' }]}>{formatCurrency(Math.max(0, results.CSI_A))}</Text>
            </View>
          </View>

          {/* Parent B breakdown */}
          <View style={styles.deductionCard}>
            <Text style={[styles.deductionCardTitle, { color: '#8b5cf6' }]}>PARENT B</Text>
            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>Adjusted taxable income</Text>
              <Text style={styles.deductionValue}>{formatCurrency(results.ATI_B)}</Text>
            </View>
            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>Self-support amount</Text>
              <Text style={styles.deductionValueNegative}>({formatCurrency(results.SSA)})</Text>
            </View>
            {results.relDepDeductibleB > 0 && (
              <View style={styles.deductionRow}>
                <Text style={styles.deductionLabel}>Rel dep allowance</Text>
                <Text style={styles.deductionValueNegative}>({formatCurrency(results.relDepDeductibleB)})</Text>
              </View>
            )}
            <View style={styles.deductionDivider} />
            <View style={styles.deductionRow}>
              <Text style={styles.deductionTotalLabel}>Child Support Income</Text>
              <Text style={[styles.deductionTotalValue, { color: '#8b5cf6' }]}>{formatCurrency(Math.max(0, results.CSI_B))}</Text>
            </View>
          </View>
        </View>

         {/* Combined child support income - text without container */}
         <Text style={[styles.combinedCSIncomeLabel, { marginTop: 2, marginBottom: 8, fontSize: 14, textAlign: 'center' }]}>
           COMBINED CS INCOME - {formatCurrency(results.CCSI)}
         </Text>

         {/* Divider line */}
         <View style={{ height: 1, backgroundColor: '#334155', marginBottom: 12 }} />

        <Text style={styles.stepExplanation}>
          Each parent's CS income is then expressed as a percentage of the combined total.
        </Text>

        <View style={styles.incomeComparison}>
          <Text style={styles.careHeaderLabel}>
            <Text style={{ color: '#3b82f6' }}>PARENT A</Text> - <Text style={{ color: '#3b82f6' }}>{formatPercent(results.incomePercA)}</Text>
          </Text>

          {/* Visual bar */}
          <View style={styles.visualBar}>
            <View style={[styles.barSegmentA, { flex: results.incomePercA }]} />
            <View style={[styles.barSegmentB, { flex: results.incomePercB }]} />
          </View>

          <Text style={[styles.careHeaderLabel, { textAlign: 'right' }]}>
            <Text style={{ color: '#8b5cf6' }}>PARENT B</Text> - <Text style={{ color: '#8b5cf6' }}>{formatPercent(results.incomePercB)}</Text>
          </Text>
        </View>
          </>
        )}
      </View>

      {/* Step 2: Care Split - Per Child */}
      {results.childResults.map((child, index) => (
        <View key={index} style={styles.step}>
          <Pressable
            onPress={() => setExpandedSteps(prev => ({...prev, step2: !prev.step2}))}
            style={styles.stepHeader}
          >
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>
                2{results.childResults.length > 1 ? String.fromCharCode(97 + index) : ''}
              </Text>
            </View>
            <Text style={styles.stepTitle}>
              CARE/COST PERCENTAGE{results.childResults.length > 1 ? ` - CHILD ${index + 1}` : ''}
            </Text>
            <Text style={styles.chevron}>{expandedSteps.step2 ? '▼' : '▶'}</Text>
          </Pressable>

          {expandedSteps.step2 && (
            <>
              {index === 0 && (
            <Text style={[styles.stepExplanation, { lineHeight: 22 }]}>
              Each parent's nights of care for the child is converted to a <Text style={{ fontWeight: '600', color: '#06b6d4' }}>CARE PERCENTAGE</Text>
              <View style={{ transform: [{ scale: 0.85 }, { translateY: 3 }], marginLeft: 6 }}>
                <HelpTooltip
                  header="CARE ROUNDING RULES"
                  what="Special rules apply. Regardless of the decimal value, percentages below 50% are rounded down to the nearest whole number with ones above being always rounded up."
                  why=""
                  hideWhatLabel
                />
              </View>.
            </Text>
          )}

          <View style={styles.careComparison}>
            <Text style={styles.careHeaderLabel}>
              <Text style={{ color: '#3b82f6' }}>PARENT A</Text> - <Text style={{ color: '#3b82f6' }}>{formatPercent(child.roundedCareA)}</Text>
            </Text>

            {/* Visual bar for care */}
            <View style={styles.visualBar}>
              <View style={[styles.barSegmentA, { flex: child.roundedCareA }]} />
              <View style={[styles.barSegmentB, { flex: child.roundedCareB }]} />
            </View>

             <Text style={[styles.careHeaderLabel, { textAlign: 'right' }]}>
               <Text style={{ color: '#8b5cf6' }}>PARENT B</Text> - <Text style={{ color: '#8b5cf6' }}>{formatPercent(child.roundedCareB)}</Text>
             </Text>

            {index === 0 && (
              <>
                <View style={{ height: 1, backgroundColor: '#334155', marginVertical: 8 }} />

                <Text style={[styles.stepExplanation, { lineHeight: 22 }]}>
                  A formula is then used to convert each parent's care percentage into what is used in the child support formula to reflect the costs of a child the parent is meeting through their own care - this is called a <Text style={{ fontWeight: '600', color: '#06b6d4' }}>COST PERCENTAGE</Text>
                  <View style={{ transform: [{ scale: 0.85 }, { translateY: 3 }], marginLeft: 6 }}>
                    <HelpTooltip
                      header="CARE TO COST CONVERSION"
                      what={
                        <Text style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 20 }}>
                          0 to less than 14%: <Text style={{ color: '#06b6d4' }}>Nil</Text>{'\n\n'}
                          14% to less than 35%: <Text style={{ color: '#06b6d4' }}>24%</Text>{'\n\n'}
                          35% to less than 48%: <Text style={{ color: '#06b6d4' }}>25% plus 2% for each percentage point over 35%</Text>{'\n\n'}
                          48% to 52%: <Text style={{ color: '#06b6d4' }}>50%</Text>{'\n\n'}
                          More than 52% to 65%: <Text style={{ color: '#06b6d4' }}>51% plus 2% for each percentage point over 53%</Text>{'\n\n'}
                          More than 65% to 86%: <Text style={{ color: '#06b6d4' }}>76%</Text>{'\n\n'}
                          More than 86% to 100%: <Text style={{ color: '#06b6d4' }}>100%</Text>
                        </Text>
                      }
                      why=""
                      hideWhatLabel
                    />
                  </View>.
                </Text>
              </>
            )}

            {/* Divider line for additional children */}
            {index > 0 && (
              <View style={{ height: 1, backgroundColor: '#334155', marginTop: 16 }} />
            )}
          </View>

          {/* Care to Cost conversion */}
          <View style={[styles.careConversion, { marginTop: index === 0 ? 3 : 16, padding: 12 }]}>
            <View style={styles.conversionCards}>
              <View style={styles.conversionCard}>
                <Text style={[styles.conversionCardLabel, { color: '#3b82f6', fontSize: 12 }]}>PARENT A</Text>
                <View style={styles.conversionRow}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.conversionValue}>{formatPercent(child.roundedCareA)}</Text>
                    <Text style={styles.conversionSubLabel}>care</Text>
                  </View>
                  <Text style={styles.conversionArrow}>→</Text>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={[styles.conversionResult, { color: '#3b82f6' }]}>{formatPercent(child.costPercA)}</Text>
                    <Text style={styles.conversionSubLabel}>cost</Text>
                  </View>
                </View>
              </View>

              <View style={styles.conversionCard}>
                <Text style={[styles.conversionCardLabel, { color: '#8b5cf6', fontSize: 12 }]}>PARENT B</Text>
                <View style={styles.conversionRow}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.conversionValue}>{formatPercent(child.roundedCareB)}</Text>
                    <Text style={styles.conversionSubLabel}>care</Text>
                  </View>
                  <Text style={styles.conversionArrow}>→</Text>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={[styles.conversionResult, { color: '#8b5cf6' }]}>{formatPercent(child.costPercB)}</Text>
                    <Text style={styles.conversionSubLabel}>cost</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
            </>
          )}
        </View>
      ))}

      {/* Step 3: The Gap - Per Child */}
      {results.childResults.map((child, index) => (
        <View key={index} style={styles.step}>
          <Pressable
            onPress={() => setExpandedSteps(prev => ({...prev, step3: !prev.step3}))}
            style={styles.stepHeader}
          >
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>
                3{results.childResults.length > 1 ? String.fromCharCode(97 + index) : ''}
              </Text>
            </View>
            <Text style={styles.stepTitle}>
              CHILD SUPPORT PERCENTAGE{results.childResults.length > 1 ? ` - CHILD ${index + 1}` : ''}
            </Text>
            <Text style={styles.chevron}>{expandedSteps.step3 ? '▼' : '▶'}</Text>
          </Pressable>

          {expandedSteps.step3 && (
            <>
              {index === 0 && (
            <Text style={styles.stepExplanation}>
              A parent is liable to pay child support when their income percentage exceeds their cost percentage. The difference between these two values is the <Text style={{ fontWeight: '600', color: '#06b6d4' }}>CHILD SUPPORT PERCENTAGE</Text>, which is the formula then uses to help determine the liability amount for the child.
            </Text>
          )}

          <View style={styles.gapCalculation}>
            <View style={styles.gapCards}>
              {/* Parent A Card */}
              <View style={styles.gapCard}>
                <Text style={[styles.gapCardTitle, { color: '#3b82f6' }]}>PARENT A</Text>

                {!child.farAppliedA && !child.marAppliedA ? (
                  <>
                    <View style={styles.gapCardRow}>
                      <Text style={styles.gapCardLabel}>Income %</Text>
                      <Text style={styles.gapCardValue}>{formatPercent(results.incomePercA)}</Text>
                    </View>
                    <View style={styles.gapCardRow}>
                      <Text style={styles.gapCardLabel}>Cost %</Text>
                      <Text style={[styles.gapCardValue, { color: '#f87171' }]}>− ({formatPercent(child.costPercA)})</Text>
                    </View>
                    <View style={styles.gapCardDivider} />
                    <View style={styles.gapCardRow}>
                      <Text style={[styles.gapCardLabel, styles.gapCardLabelBold]}>CS %</Text>
                      <Text style={[
                        styles.gapCardValue,
                        child.childSupportPercA > 0 && styles.gapCardValueHighlight
                      ]}>
                        {child.childSupportPercA > 0 ? formatPercent(child.childSupportPercA) : '—'}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.gapCardSpecialRate}>
                    <Text style={styles.gapCardSpecialRateText}>
                      Low income and provides less than {child.marAppliedA ? '87%' : '66%'} care.
                    </Text>
                    <Text style={styles.gapCardSpecialRateText}>
                      Must pay the {child.farAppliedA ? 'FAR' : 'MAR'}.
                    </Text>
                    <Text style={[styles.gapCardValue, styles.gapCardValueHighlight, { marginTop: 8 }]}>
                      {formatCurrency(child.farAppliedA ? results.FAR : results.MAR)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Parent B Card */}
              <View style={styles.gapCard}>
                <Text style={[styles.gapCardTitle, { color: '#8b5cf6' }]}>PARENT B</Text>

                {!child.farAppliedB && !child.marAppliedB ? (
                  <>
                    <View style={styles.gapCardRow}>
                      <Text style={styles.gapCardLabel}>Income %</Text>
                      <Text style={styles.gapCardValue}>{formatPercent(results.incomePercB)}</Text>
                    </View>
                    <View style={styles.gapCardRow}>
                      <Text style={styles.gapCardLabel}>Cost %</Text>
                      <Text style={[styles.gapCardValue, { color: '#f87171' }]}>− ({formatPercent(child.costPercB)})</Text>
                    </View>
                    <View style={styles.gapCardDivider} />
                    <View style={styles.gapCardRow}>
                      <Text style={[styles.gapCardLabel, styles.gapCardLabelBold]}>CS %</Text>
                      <Text style={[
                        styles.gapCardValue,
                        child.childSupportPercB > 0 && styles.gapCardValueHighlight
                      ]}>
                        {child.childSupportPercB > 0 ? formatPercent(child.childSupportPercB) : '—'}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.gapCardSpecialRate}>
                    <Text style={styles.gapCardSpecialRateText}>
                      Low income and provides less than {child.marAppliedB ? '87%' : '66%'} care.
                    </Text>
                    <Text style={styles.gapCardSpecialRateText}>
                      Must pay the {child.farAppliedB ? 'FAR' : 'MAR'}.
                    </Text>
                    <Text style={[styles.gapCardValue, styles.gapCardValueHighlight, { marginTop: 8 }]}>
                      {formatCurrency(child.farAppliedB ? results.FAR : results.MAR)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
            </>
          )}
        </View>
      ))}

      {/* Step 4: Total Costs */}
      <View style={styles.step}>
        <Pressable
          onPress={() => setExpandedSteps(prev => ({...prev, step4: !prev.step4}))}
          style={styles.stepHeader}
        >
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <Text style={styles.stepTitle}>COST OF CHILDREN</Text>
          <Text style={styles.chevron}>{expandedSteps.step4 ? '▼' : '▶'}</Text>
        </Pressable>

        {expandedSteps.step4 && (
          <>
            <Text style={styles.stepExplanation}>
          The total cost of children for an assessment is calculated using income brackets set by the Department of Social Services. Each bracket has a base cost plus a percentage applied to income within that bracket.
        </Text>

        {/* Combined income */}
        <Text style={[styles.combinedCSIncomeLabel, { marginTop: 12, marginBottom: 12, fontSize: 14, textAlign: 'center' }]}>
          COMBINED CS INCOME - {formatCurrency(results.CCSI)}
        </Text>

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
              {results.childResults.length > 0 && (
                <View style={styles.bracketRow}>
                  <Text style={styles.bracketLabel}>Cost per child ({results.childResults.length})</Text>
                  <Text style={styles.bracketValue}>{formatCurrency(results.totalCost / results.childResults.length)}</Text>
                </View>
              )}
            </View>
          </View>
        )}
          </>
        )}
      </View>

      {/* Step 5: Your Payment */}
      <View style={styles.step}>
        <Pressable
          onPress={() => setExpandedSteps(prev => ({...prev, step5: !prev.step5}))}
          style={styles.stepHeader}
        >
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>5</Text>
          </View>
          <Text style={styles.stepTitle}>ASSESSMENT RESULT</Text>
          <Text style={styles.chevron}>{expandedSteps.step5 ? '▼' : '▶'}</Text>
        </Pressable>

        {expandedSteps.step5 && (
          <>
            <Text style={styles.stepExplanation}>
          Each child's liability rate is calculated by multiplying their cost <Text style={{ color: '#06b6d4' }}>(</Text><Text style={{ fontWeight: '600', color: '#06b6d4' }}>STEP 4</Text><Text style={{ color: '#06b6d4' }}>)</Text> by their child support percentage <Text style={{ color: '#06b6d4' }}>(</Text><Text style={{ fontWeight: '600', color: '#06b6d4' }}>STEP 3</Text><Text style={{ color: '#06b6d4' }}>)</Text>.
        </Text>

        {/* Per-child payment breakdown */}
        {results.childResults.length > 0 && (
          <View style={styles.perChildGapBreakdown}>
            {results.childResults.map((child, index) => {
              // Determine which parent is paying for this child
              const parentAOwesForChild = (child.childSupportPercA > child.childSupportPercB && child.childSupportPercA > 0) || child.farAppliedA || child.marAppliedA;
              const parentBOwesForChild = (child.childSupportPercB > child.childSupportPercA && child.childSupportPercB > 0) || child.farAppliedB || child.marAppliedB;

              // Determine which parent to show for this child
              const showForParentA = parentAOwesForChild;
              const showForParentB = parentBOwesForChild;

              // If neither parent owes, don't show this child
              if (!showForParentA && !showForParentB) {
                return null;
              }

              // Determine color and values based on who owes
              const payingParentColor = showForParentA ? '#3b82f6' : '#8b5cf6';
              const farApplied = showForParentA ? child.farAppliedA : child.farAppliedB;
              const marApplied = showForParentA ? child.marAppliedA : child.marAppliedB;
              const gapPercentage = showForParentA
                ? Math.max(0, child.childSupportPercA)
                : Math.max(0, child.childSupportPercB);
              const liability = showForParentA ? child.finalLiabilityA : child.finalLiabilityB;

              return (
                <View key={index} style={styles.perChildGapRow}>
                  <Text style={styles.perChildGapLabel}>
                    {farApplied ? (
                      `Child ${index + 1} - Fixed annual rate`
                    ) : marApplied ? (
                      `Child ${index + 1} - Minimum annual rate`
                    ) : (
                      <>
                        Child {index + 1}: <Text style={{ color: '#f87171' }}>({formatPercent(gapPercentage)})</Text> × {formatCurrency(child.costPerChild)}
                      </>
                    )}
                  </Text>
                  <Text style={styles.perChildGapValue}>
                    {formatCurrency(liability)}
                  </Text>
                </View>
              );
            })}
            <View style={styles.perChildGapDivider} />
          </View>
        )}

        <View style={styles.stepConclusion}>
          {parentAPays && (
            <LinearGradient
              colors={getGradientColors("Parent A")}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.finalResultGradient}
            >
              <Text style={styles.finalResultLabel}>Parent A pays</Text>
              <Text style={styles.finalResultValue}>{formatCurrency(results.finalPaymentAmount)}</Text>
              <Text style={styles.finalResultPeriod}>per year</Text>
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
            </LinearGradient>
          )}

          {parentBPays && (
            <LinearGradient
              colors={getGradientColors("Parent B")}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.finalResultGradient}
            >
              <Text style={styles.finalResultLabel}>Parent B pays</Text>
              <Text style={styles.finalResultValue}>{formatCurrency(results.finalPaymentAmount)}</Text>
              <Text style={styles.finalResultPeriod}>per year</Text>
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
            </LinearGradient>
          )}

          {!parentAPays && !parentBPays && (
            <LinearGradient
              colors={getGradientColors("Neither")}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.finalResultGradient}
            >
              <Text style={styles.finalResultLabel}>No payment required</Text>
              <Text style={styles.finalResultValue}>$0</Text>
              <Text style={styles.finalResultPeriod}>per year</Text>
            </LinearGradient>
          )}
        </View>
          </>
        )}
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
      {results.finalPaymentAmount === 0 && results.rateApplied === "None" && (() => {
        // Calculate average care for the notice messages
        const avgCareA = results.childResults.length > 0
          ? results.childResults.reduce((sum, child) => sum + child.roundedCareA, 0) / results.childResults.length
          : 0;
        const avgCareB = results.childResults.length > 0
          ? results.childResults.reduce((sum, child) => sum + child.roundedCareB, 0) / results.childResults.length
          : 0;

        return (
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
        );
      })()}
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
    fontSize: 12,
    fontWeight: "600",
    color: "#f59e0b", // amber-500
    flex: 1,
  },
  chevron: {
    fontSize: 16,
    color: "#94a3b8", // slate-400
    marginLeft: "auto",
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
    color: "#f59e0b", // amber-500
  },

  // Combined CS Income bar
  combinedCSIncomeBar: {
    height: 32,
    borderRadius: 6,
    backgroundColor: "#334155", // slate-700
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  combinedCSIncomeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#06b6d4", // cyan-500
    letterSpacing: 0.5,
    textTransform: "uppercase",
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
  careHeaderLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#cbd5e1", // slate-300
    letterSpacing: 0.5,
    textTransform: "uppercase",
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
    marginTop: 8,
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
  // Step 3: Gap calculation cards (side-by-side)
  gapCards: {
    flexDirection: "row",
    gap: 12,
  },
  gapCard: {
    flex: 1,
    backgroundColor: "#1e293b", // slate-800 (matches Step 2)
    borderRadius: 8,
    padding: 12,
  },
  gapCardTitle: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  gapCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  gapCardLabel: {
    fontSize: 12,
    color: "#94a3b8", // slate-400
    flex: 1,
    paddingRight: 4,
  },
  gapCardLabelBold: {
    fontWeight: "600",
    color: "#ffffff",
  },
  gapCardValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#cbd5e1", // slate-300
    textAlign: "right",
  },
  gapCardValueHighlight: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fbbf24", // amber-400
  },
  gapCardDivider: {
    height: 1,
    backgroundColor: "#334155", // slate-700
    marginVertical: 6,
  },
  gapCardSpecialRate: {
    gap: 4,
  },
  gapCardSpecialRateText: {
    fontSize: 11,
    color: "#94a3b8", // slate-400
    lineHeight: 15,
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
    color: "#fbbf24", // amber-400
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

  // Per-child cost breakdown
  perChildCostBreakdown: {
    backgroundColor: "#0f172a", // slate-900
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  perChildCostTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8", // slate-400
    marginBottom: 4,
  },
  perChildCostRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  perChildCostLabel: {
    fontSize: 13,
    color: "#94a3b8", // slate-400
  },
  perChildCostValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#cbd5e1", // slate-300
  },

  // Per-child gap breakdown
  perChildGapBreakdown: {
    backgroundColor: "#0f172a", // slate-900
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  perChildGapRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  perChildGapLabel: {
    fontSize: 13,
    color: "#94a3b8", // slate-400
  },
  perChildGapValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#cbd5e1", // slate-300
  },
  perChildGapDivider: {
    height: 1,
    backgroundColor: "#334155", // slate-700
    marginTop: 4,
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
    color: "#cbd5e1", // slate-300
    fontWeight: "500",
  },
  finalResultGradient: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginTop: 12,
  },
  finalResultLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e2e8f0", // slate-200
    marginBottom: 8,
    textAlign: "center",
  },
  finalResultValue: {
    fontSize: 40,
    fontWeight: "700",
    color: "#fbbf24", // amber-400
    textAlign: "center",
    marginBottom: 4,
  },
  finalResultPeriod: {
    fontSize: 16,
    color: "#cbd5e1", // slate-300
    textAlign: "center",
    marginBottom: 16,
  },
  expandedSecondaryAmounts: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
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
    marginBottom: 4,
  },
  expandedSecondaryLabel: {
    fontSize: 12,
    color: "#cbd5e1", // slate-300
  },
  expandedDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
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
