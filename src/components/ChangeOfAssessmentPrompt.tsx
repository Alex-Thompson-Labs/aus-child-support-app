import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";
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
import { isWeb, webClickableStyles } from "../utils/responsive";

interface ChangeOfAssessmentPromptProps {
  results: CalculationResults;
  formData?: ComplexityFormData;
  onNavigate: () => void; // Callback to close modal before navigation
  onRequestInquiry?: () => void; // Callback to show inline inquiry panel (web mode)
  onCoAReasonsChange?: (reasons: string[]) => void; // Callback to notify parent of selected reasons
}

export function ChangeOfAssessmentPrompt({
  results,
  formData,
  onNavigate,
  onRequestInquiry,
  onCoAReasonsChange,
}: ChangeOfAssessmentPromptProps) {
  // State management
  const [selectedReasons, setSelectedReasons] = useState<Set<string>>(new Set());
  const [isNavigatingFromCoA, setIsNavigatingFromCoA] = useState(false);

  // Hooks
  const router = useRouter();
  const analytics = useAnalytics();

  // Guard against empty reasons array
  if (CHANGE_OF_ASSESSMENT_REASONS.length === 0) {
    console.warn("[CoAPrompt] No CoA reasons available");
    return null;
  }

  // Group reasons by category (excluding urgent - now handled separately)
  const incomeReasons = CHANGE_OF_ASSESSMENT_REASONS.filter((r) => r.category === 'income');
  const childReasons = CHANGE_OF_ASSESSMENT_REASONS.filter((r) => r.category === 'child');
  const otherReasons = CHANGE_OF_ASSESSMENT_REASONS.filter((r) => r.category === 'other');

  // Determine button state
  const buttonDisabled = selectedReasons.size === 0 || isNavigatingFromCoA;

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

        // Notify parent of change
        const reasonsArray = Array.from(next);
        onCoAReasonsChange?.(reasonsArray);

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
    [analytics, onCoAReasonsChange]
  );

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

    // If onRequestInquiry callback exists (web inline mode), use it instead of navigation
    if (onRequestInquiry) {
      // Call the callback to show inline inquiry panel
      onRequestInquiry();
      // Reset navigation state
      setTimeout(() => setIsNavigatingFromCoA(false), 500);
      return;
    }

    // Otherwise, use navigation (mobile mode)
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
          if (Platform.OS === 'web') {
            alert("Navigation Error\n\nUnable to open inquiry form. Please try again.");
          } else {
            Alert.alert(
              "Navigation Error",
              "Unable to open inquiry form. Please try again."
            );
          }
        } finally {
          setTimeout(() => setIsNavigatingFromCoA(false), 500);
        }
      });
    });
  }, [
    isNavigatingFromCoA,
    selectedReasons,
    onNavigate,
    onRequestInquiry,
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
        style={[styles.checkboxRow, isWeb && webClickableStyles]}
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
          <HelpTooltip what={reason.description} why="" hideWhatLabel />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.coaContainer}>
      {/* Header - Always visible */}
      <View style={styles.coaHeader}>
        <Text style={styles.coaTitle}>Is this assessment result unfair?</Text>
        <Text style={styles.coaDescription}>
          Some situations are too complex for the standard calculator.
          If any of these apply, a lawyer can help you request adjustments.
        </Text>
      </View>

      {/* Category sections */}
      <View style={styles.categorySections}>
          {/* Income Issues Group */}
          {incomeReasons.length > 0 && (
            <View style={styles.reasonGroup}>
              <View style={styles.groupHeader}>
                <Text style={[styles.groupTitle, { color: getCategoryDisplayInfo('income').accentColor }]}>
                  {getCategoryDisplayInfo('income').title}
                </Text>
              </View>
              <View style={styles.checkboxList}>
                {incomeReasons.map(renderCheckbox)}
              </View>
            </View>
          )}

          {/* Child-Related Group */}
          {childReasons.length > 0 && (
            <View style={styles.reasonGroup}>
              <View style={styles.groupHeader}>
                <Text style={[styles.groupTitle, { color: getCategoryDisplayInfo('child').accentColor }]}>
                  {getCategoryDisplayInfo('child').title}
                </Text>
              </View>
              <View style={styles.checkboxList}>
                {childReasons.map(renderCheckbox)}
              </View>
            </View>
          )}

          {/* Other Factors Group */}
          {otherReasons.length > 0 && (
            <View style={styles.reasonGroup}>
              <View style={styles.groupHeader}>
                <Text style={[styles.groupTitle, { color: getCategoryDisplayInfo('other').accentColor }]}>
                  {getCategoryDisplayInfo('other').title}
                </Text>
              </View>
              <View style={styles.checkboxList}>
                {otherReasons.map(renderCheckbox)}
              </View>
            </View>
          )}

      </View>

      {/* Bottom section with button */}
      <View style={styles.coaFooter}>
        <Pressable
          style={[styles.coaButton, buttonDisabled && styles.coaButtonDisabled, isWeb && !buttonDisabled && webClickableStyles]}
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
        {selectedReasons.size > 0 && (
          <Text style={styles.selectedCount}>
            {selectedReasons.size} reason{selectedReasons.size === 1 ? "" : "s"} selected
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container
  coaContainer: {
    backgroundColor: "#ffffff", // white
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb", // grey-200
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  // Header
  coaHeader: {
    marginBottom: 20,
  },
  coaTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a202c", // near-black
    marginBottom: 8,
  },
  coaDescription: {
    fontSize: 14,
    color: "#6b7280", // grey-500
    lineHeight: 21, // 1.5 line height
  },

  // Category sections
  categorySections: {
    gap: 16,
  },

  // Groups
  reasonGroup: {
    marginBottom: 16,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Checkbox list
  checkboxList: {
    gap: 8,
  },

  // Checkboxes
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#d1d5db", // grey-300
    backgroundColor: "#ffffff", // white
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#3b82f6", // blue-600
    borderColor: "#3b82f6",
  },
  checkboxCheck: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  checkboxLabelContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#1a202c", // near-black
    lineHeight: 20,
    flex: 1,
  },

  // Footer
  coaFooter: {
    marginTop: 20,
    gap: 12,
  },
  coaButton: {
    backgroundColor: "#3b82f6", // blue-600
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    width: "100%",
  },
  coaButtonDisabled: {
    backgroundColor: "#93c5fd", // blue-300
  },
  coaButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedCount: {
    fontSize: 14,
    color: "#6b7280", // grey-500
    textAlign: "center",
  },
});
