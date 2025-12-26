import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, Pressable, StyleSheet, Text, View } from "react-native";
import type { CalculationResults } from "../types/calculator";
import { useAnalytics } from "../utils/analytics";
import {
  CHANGE_OF_ASSESSMENT_REASONS,
  getCoAReasonById,
  getHighestPriorityReason,
  getCategoryDisplayInfo,
  type ChangeOfAssessmentReason,
  type ComplexityCategory,
} from "../utils/change-of-assessment-reasons";
import type { ComplexityFormData } from "../utils/complexity-detection";
import { HelpTooltip } from "./HelpTooltip";

interface ChangeOfAssessmentPromptProps {
  results: CalculationResults;
  formData?: ComplexityFormData;
  onNavigate: () => void; // Callback to close modal before navigation
}

export function ChangeOfAssessmentPrompt({
  results,
  formData,
  onNavigate,
}: ChangeOfAssessmentPromptProps) {
  // State management
  const [isCoAExpanded, setIsCoAExpanded] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<Set<string>>(new Set());
  const [isNavigatingFromCoA, setIsNavigatingFromCoA] = useState(false);

  // Animation
  const coaHeightAnim = useRef(new Animated.Value(0)).current;
  const coaContentHeight = useRef(0);
  const incomeBorderPulse = useRef(new Animated.Value(1)).current;

  // Hooks
  const router = useRouter();
  const analytics = useAnalytics();

  // Guard against empty reasons array
  if (CHANGE_OF_ASSESSMENT_REASONS.length === 0) {
    console.warn("[CoAPrompt] No CoA reasons available");
    return null;
  }

  // Group reasons by category
  const incomeReasons = CHANGE_OF_ASSESSMENT_REASONS.filter((r) => r.category === 'income');
  const childReasons = CHANGE_OF_ASSESSMENT_REASONS.filter((r) => r.category === 'child');
  const otherReasons = CHANGE_OF_ASSESSMENT_REASONS.filter((r) => r.category === 'other');

  // Determine button state and style based on most important selected category
  const mostImportantReason = getHighestPriorityReason(Array.from(selectedReasons));
  const buttonDisabled = selectedReasons.size === 0 || isNavigatingFromCoA;

  const buttonStyle = buttonDisabled
    ? styles.coaButtonDisabled
    : mostImportantReason?.category === 'income'
      ? styles.coaButtonIncome
      : mostImportantReason?.category === 'child'
        ? styles.coaButtonChild
        : styles.coaButtonOther;

  // Expand/collapse animation
  useEffect(() => {
    Animated.spring(coaHeightAnim, {
      toValue: isCoAExpanded ? 1 : 0,
      useNativeDriver: false, // Required for height animation
      tension: 65, // Same as modal animation
      friction: 11, // Same as modal animation
    }).start();
  }, [isCoAExpanded, coaHeightAnim]);

  // Income border pulse animation (continuous when expanded)
  useEffect(() => {
    if (isCoAExpanded && incomeReasons.length > 0) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(incomeBorderPulse, {
            toValue: 1.3,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(incomeBorderPulse, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: false,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [isCoAExpanded, incomeBorderPulse, incomeReasons.length]);

  // Checkbox toggle handler
  const handleCheckboxToggle = useCallback(
    (reasonId: string) => {
      // Functional setState prevents race conditions on rapid toggling
      setSelectedReasons((prev) => {
        const next = new Set(prev); // Create new Set (immutability)
        const wasChecked = next.has(reasonId);

        if (wasChecked) {
          next.delete(reasonId);
        } else {
          next.add(reasonId);
        }

        // Track analytics (debouncing handled by setTimeout)
        setTimeout(() => {
          try {
            analytics.track("coa_reason_toggled", {
              reason_id: reasonId,
              is_checked: !wasChecked,
              total_selected: next.size,
            });
          } catch (error) {
            console.error("[CoAPrompt] Analytics error:", error);
          }
        }, 100);

        return next;
      });
    },
    [analytics]
  );

  // Expand/collapse toggle handler
  const handleToggleExpand = useCallback(() => {
    const willExpand = !isCoAExpanded;
    setIsCoAExpanded(willExpand);

    // Track analytics
    try {
      analytics.track("coa_section_toggled", {
        is_expanded: willExpand,
        annual_liability: results.finalPaymentAmount,
      });
    } catch (error) {
      console.error("[CoAPrompt] Analytics error:", error);
    }
  }, [isCoAExpanded, analytics, results.finalPaymentAmount]);

  // Navigation handler
  const handleNavigateToCoA = useCallback(() => {
    if (isNavigatingFromCoA || selectedReasons.size === 0) {
      return;
    }

    setIsNavigatingFromCoA(true);

    // Track analytics
    try {
      analytics.track("coa_button_clicked", {
        reasons_selected: JSON.stringify(Array.from(selectedReasons)),
        reason_count: selectedReasons.size,
        most_important_category:
          getHighestPriorityReason(Array.from(selectedReasons))?.category ?? null,
        annual_liability: results.finalPaymentAmount,
      });
    } catch (error) {
      console.error("[CoAPrompt] Analytics error:", error);
    }

    // Close modal first (via callback)
    onNavigate();

    // Navigate after modal animation completes
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          // Serialize care arrangement data for each child
          const careData = (formData?.children ?? []).map((_child, index) => ({
            index,
            careA: results.childResults[index]?.roundedCareA ?? 0,
            careB: results.childResults[index]?.roundedCareB ?? 0,
          }));

          router.push({
            pathname: "/lawyer-inquiry",
            params: {
              // Existing params
              liability: results.finalPaymentAmount.toString(),
              trigger: "change_of_assessment",
              incomeA: results.ATI_A.toString(),
              incomeB: results.ATI_B.toString(),
              children: (formData?.children?.length ?? 0).toString(),
              careData: JSON.stringify(careData),

              // NEW CoA params
              coaReasons: JSON.stringify(Array.from(selectedReasons)),
              coaHighestPriority:
                getHighestPriorityReason(Array.from(selectedReasons))?.id ?? "",
            },
          });
        } catch (error) {
          console.error("[CoAPrompt] Navigation failed:", error);
          Alert.alert(
            "Navigation Error",
            "Unable to open inquiry form. Please try again."
          );
        } finally {
          setTimeout(() => setIsNavigatingFromCoA(false), 500);
        }
      });
    });
  }, [
    isNavigatingFromCoA,
    selectedReasons,
    onNavigate,
    router,
    results,
    formData,
    analytics,
  ]);

  // Render checkbox for a reason
  const renderCheckbox = (reason: ChangeOfAssessmentReason) => {
    const isChecked = selectedReasons.has(reason.id);

    return (
      <Pressable
        key={reason.id}
        style={styles.checkboxRow}
        onPress={() => handleCheckboxToggle(reason.id)}
        accessible={true}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isChecked }}
        accessibilityLabel={reason.label}
        accessibilityHint={`Double tap to ${isChecked ? "uncheck" : "check"}`}
      >
        <View
          style={[styles.checkbox, isChecked && styles.checkboxChecked]}
        >
          {isChecked && <Text style={styles.checkboxCheck}>✓</Text>}
        </View>
        <View style={styles.checkboxLabelContainer}>
          <Text style={styles.checkboxLabel}>{reason.label}</Text>
          <HelpTooltip what={reason.description} why={reason.description} />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.coaContainer}>
      {/* Header - Always visible, tappable to expand */}
      <Pressable
        onPress={handleToggleExpand}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Complexity factors. ${
          isCoAExpanded ? "Collapse" : "Expand"
        }`}
        accessibilityState={{ expanded: isCoAExpanded }}
      >
        <View style={styles.coaHeader}>
          <View style={styles.coaHeaderLeft}>
            <Text style={styles.coaTitle}>💭 Is this assessment result unfair?</Text>
            <Text style={styles.coaExplainer}>
              Some situations are too complex for the standard calculator.
              If any of these apply, a lawyer can help you request adjustments.
            </Text>
          </View>
          <Text style={styles.coaChevron}>{isCoAExpanded ? "▼" : "▶"}</Text>
        </View>
      </Pressable>

      {/* Expandable content */}
      <View style={{ overflow: "hidden" }}>
        <Animated.View
          style={{
            maxHeight: coaHeightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 2000], // Large enough to fit all content
            }),
            opacity: coaHeightAnim.interpolate({
              inputRange: [0, 0.3, 1],
              outputRange: [0, 0.5, 1],
            }),
          }}
        >
          <View
            onLayout={(e) => {
              if (coaContentHeight.current === 0) {
                coaContentHeight.current = e.nativeEvent.layout.height;
              }
            }}
          >
          {/* Income Issues Group */}
          {incomeReasons.length > 0 && (
            <View style={styles.reasonGroup}>
              <View style={styles.groupHeader}>
                <Text style={[styles.groupTitle, { color: '#f59e0b' }]}>
                  {getCategoryDisplayInfo('income').emoji} {getCategoryDisplayInfo('income').title}
                </Text>
              </View>
              <Animated.View
                style={[
                  styles.categoryBorder,
                  {
                    borderLeftColor: '#f59e0b',
                    borderLeftWidth: incomeBorderPulse.interpolate({
                      inputRange: [1, 1.3],
                      outputRange: [3, 5],
                    }),
                  }
                ]}
              >
                {incomeReasons.map(renderCheckbox)}

                {/* Forensic Accountant Value-Add Note */}
                {(selectedReasons.has('income_resources_not_reflected') ||
                  selectedReasons.has('earning_capacity')) && (
                  <View style={styles.valueAddNote}>
                    <Text style={styles.valueAddEmoji}>💼</Text>
                    <View style={styles.valueAddTextContainer}>
                      <Text style={styles.valueAddTitle}>Forensic Accountant Value-Add</Text>
                      <Text style={styles.valueAddDescription}>
                        Forensic accountants specialize in uncovering hidden income, verifying actual earning capacity,
                        and providing expert evidence for court proceedings. They can analyze business records, trust
                        distributions, asset holdings, and other financial structures to reveal a parent's true financial
                        position beyond what appears in tax returns.
                      </Text>
                    </View>
                  </View>
                )}
              </Animated.View>
            </View>
          )}

          {/* Child-Related Group */}
          {childReasons.length > 0 && (
            <View style={styles.reasonGroup}>
              <View style={styles.groupHeader}>
                <Text style={[styles.groupTitle, { color: '#10b981' }]}>
                  {getCategoryDisplayInfo('child').emoji} {getCategoryDisplayInfo('child').title}
                </Text>
              </View>
              <View style={[styles.categoryBorder, { borderLeftColor: '#10b981' }]}>
                {childReasons.map(renderCheckbox)}
              </View>
            </View>
          )}

          {/* Other Factors Group */}
          {otherReasons.length > 0 && (
            <View style={styles.reasonGroup}>
              <View style={styles.groupHeader}>
                <Text style={[styles.groupTitle, { color: '#14b8a6' }]}>
                  {getCategoryDisplayInfo('other').emoji} {getCategoryDisplayInfo('other').title}
                </Text>
              </View>
              <View style={[styles.categoryBorder, { borderLeftColor: '#14b8a6' }]}>
                {otherReasons.map(renderCheckbox)}
              </View>
            </View>
          )}

          {/* Bottom section with count and button */}
          <View style={styles.coaFooter}>
            <Text style={styles.selectedCount}>
              {selectedReasons.size} reason
              {selectedReasons.size === 1 ? "" : "s"} selected
            </Text>
            <Pressable
              style={[styles.coaButton, buttonStyle]}
              onPress={handleNavigateToCoA}
              disabled={buttonDisabled}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Talk to a Lawyer About This"
              accessibilityHint={`${selectedReasons.size} reason${
                selectedReasons.size === 1 ? "" : "s"
              } selected`}
              accessibilityState={{ disabled: buttonDisabled }}
            >
              <Text style={styles.coaButtonText}>Talk to a Lawyer About This</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  // Container
  coaContainer: {
    backgroundColor: "#1e293b", // slate-800
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155", // slate-700
    padding: 20,
    marginBottom: 16,
  },

  // Header
  coaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coaHeaderLeft: {
    flex: 1,
  },
  coaTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  coaSubtitle: {
    fontSize: 14,
    color: "#94a3b8", // slate-400
    marginTop: 2,
  },
  coaExplainer: {
    fontSize: 13,
    color: "#64748b", // slate-500
    marginTop: 8,
    lineHeight: 18,
  },
  coaChevron: {
    fontSize: 14,
    color: "#94a3b8", // slate-400
    marginLeft: 12,
  },

  // Groups
  reasonGroup: {
    marginTop: 16,
    marginBottom: 8,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#cbd5e1", // slate-300 (overridden by inline styles)
  },
  categoryBorder: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    // borderLeftColor set inline per category
  },

  // Checkboxes
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#334155", // slate-700
    backgroundColor: "#1e293b", // slate-800
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#2563eb", // blue-600
    borderColor: "#2563eb",
  },
  checkboxCheck: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  checkboxLabelContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#cbd5e1", // slate-300
    lineHeight: 20,
    flex: 1,
  },

  // Footer
  coaFooter: {
    marginTop: 16,
    alignItems: "center",
  },
  selectedCount: {
    fontSize: 14,
    color: "#94a3b8", // slate-400
    marginBottom: 12,
  },
  coaButton: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    width: "100%",
  },
  coaButtonIncome: {
    backgroundColor: "#f59e0b", // amber-500 (income category)
  },
  coaButtonChild: {
    backgroundColor: "#10b981", // emerald-500 (child category)
  },
  coaButtonOther: {
    backgroundColor: "#14b8a6", // teal-500 (other category)
  },
  coaButtonDisabled: {
    backgroundColor: "#64748b", // slate-500
    opacity: 0.6,
  },
  coaButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  coaDisclaimer: {
    fontSize: 12,
    color: "#64748b", // slate-500
    marginTop: 8,
  },

  // Value-Add Note
  valueAddNote: {
    flexDirection: "row",
    backgroundColor: "#0f172a", // slate-900 (darker than container)
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#334155", // slate-700
  },
  valueAddEmoji: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  valueAddTextContainer: {
    flex: 1,
  },
  valueAddTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b", // amber-500 (matches income category)
    marginBottom: 4,
  },
  valueAddDescription: {
    fontSize: 13,
    color: "#94a3b8", // slate-400
    lineHeight: 18,
  },
});
