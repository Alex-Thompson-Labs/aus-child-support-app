import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { CalculationResults } from "../types/calculator";
import { useAnalytics } from "../utils/analytics";
import { detectComplexity, getAlertConfig, type ComplexityFlags, type ComplexityFormData } from "../utils/complexity-detection";
import { ChangeOfAssessmentPrompt } from "./ChangeOfAssessmentPrompt";
import { LawyerAlert } from "./LawyerAlert";
import { ResultsSimpleExplanation } from "./ResultsSimpleExplanation";
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsive, MAX_CONTENT_WIDTH, MAX_MODAL_WIDTH, isWeb, webClickableStyles } from "../utils/responsive";
import { WebInquiryPanel } from "./WebInquiryPanel";

interface CalculatorResultsProps {
  results: CalculationResults;
  formData?: ComplexityFormData;
  displayMode?: 'modal' | 'inline';  // 'modal' = collapsed card + full-screen modal, 'inline' = always visible side panel
  onRequestInquiry?: () => void;  // Callback for web inline inquiry panel
  showInquiryPanel?: boolean;  // Whether to show inquiry panel in right column
  onCloseInquiry?: () => void;  // Close the inquiry panel
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

export function CalculatorResults({
  results,
  formData,
  displayMode = 'modal',
  onRequestInquiry,
  showInquiryPanel = false,
  onCloseInquiry,
}: CalculatorResultsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const analytics = useAnalytics();
  const { isMobile, isDesktop, width } = useResponsive();

  const isInlineMode = displayMode === 'inline';

  const monthlyAmount = results.finalPaymentAmount / 12;
  const fortnightlyAmount = results.finalPaymentAmount / 26;
  const dailyAmount = results.finalPaymentAmount / 365;

  // Track whether navigation is in progress to prevent duplicate navigation
  const [isNavigating, setIsNavigating] = useState(false);

  // Store selected COA reasons from the prompt
  const [selectedCoAReasons, setSelectedCoAReasons] = useState<string[]>([]);

  // Track if we've already fired analytics for this calculation (prevents duplicates)
  const trackedResultsRef = useRef<string | null>(null);

  // Handle COA reasons selection changes
  const handleCoAReasonsChange = useCallback((reasons: string[]) => {
    setSelectedCoAReasons(reasons);
  }, []);

  // Detect complexity and get alert configuration
  const flags = detectComplexity(results, formData ?? {});
  const alertConfig = getAlertConfig(flags, results);

  // Check if calculation is "complete" enough to show complexity alerts
  // Complete means: both parents have non-zero ATI AND at least one child with care set
  const isCalculationComplete = (() => {
    const hasParentAIncome = results.ATI_A > 0;
    const hasParentBIncome = results.ATI_B > 0;
    const hasChildrenWithCare = results.childResults &&
      results.childResults.length > 0 &&
      results.childResults.some(child =>
        (child.roundedCareA !== undefined && child.roundedCareA >= 0) ||
        (child.roundedCareB !== undefined && child.roundedCareB >= 0)
      );

    return hasParentAIncome && hasParentBIncome && hasChildrenWithCare;
  })();

  // Only show complexity alert when calculation is complete
  const shouldShowComplexityAlert = alertConfig && isCalculationComplete;

  // Log for verification (Phase 1 - only in dev)
  if (__DEV__) {
    console.log('[CalculatorResults] Complexity flags:', flags);
    console.log('[CalculatorResults] Alert config:', alertConfig);
    console.log('[CalculatorResults] Is calculation complete:', isCalculationComplete);
    console.log('[CalculatorResults] Should show complexity alert:', shouldShowComplexityAlert);
  }

  // Track calculation_completed event
  useEffect(() => {
    // Don't track if results are undefined/null or invalid
    if (!results || results.finalPaymentAmount === undefined || results.finalPaymentAmount === null) {
      console.log('[Analytics] Skipping tracking - invalid results');
      return;
    }

    // Create a unique key for this calculation based on key values
    const resultsKey = `${results.finalPaymentAmount}_${results.childResults?.length ?? 0}`;

    // Debounce: Only fire if we haven't tracked these exact results yet
    if (trackedResultsRef.current === resultsKey) {
      console.log('[Analytics] Skipping tracking - already tracked these results');
      return;
    }

    // Mark as tracked
    trackedResultsRef.current = resultsKey;

    try {
      // Derive care type from care nights (inline to avoid callback dependency)
      let careType: 'equal' | 'primary' | 'shared' = 'primary';
      if (results.childResults && results.childResults.length > 0) {
        const firstChild = results.childResults[0];
        const carePercA = firstChild.roundedCareA;

        if (carePercA >= 48 && carePercA <= 52) {
          careType = 'equal';
        } else if (carePercA >= 35 && carePercA <= 65) {
          careType = 'shared';
        }
      }

      const childrenCount = results.childResults?.length ?? 0;

      // Check for special circumstances
      // TODO: Update this when private school/medical cost fields are added to formData
      const hasSpecialCircumstances = flags.specialCircumstances;

      const eventProperties = {
        children_count: childrenCount,
        annual_liability: results.finalPaymentAmount,
        care_type: careType,
        has_special_circumstances: hasSpecialCircumstances
      };

      console.log('[Analytics] Tracking calculation_completed:', eventProperties);

      analytics.track('calculation_completed', eventProperties);
    } catch (error) {
      console.error('[Analytics] Error tracking calculation_completed:', error);
    }
  }, [results, analytics]);

  // Find the trigger that fired the alert (primary trigger for display)
  const getTrigger = useCallback((): string => {
    const flagKeys: Array<keyof ComplexityFlags> = ['courtDateUrgent', 'highValue', 'sharedCareDispute', 'specialCircumstances', 'highVariance', 'incomeSuspicion'];
    const triggeredFlag = flagKeys.find(k => flags[k]);

    // Convert camelCase to snake_case for analytics
    if (!triggeredFlag) {
      return 'unknown';
    }

    return triggeredFlag
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, ''); // Remove leading underscore if any
  }, [flags]);

  // Get ALL triggered complexity flags as an array (for combining with COA reasons)
  const getAllTriggers = useCallback((): string[] => {
    const flagKeys: Array<keyof ComplexityFlags> = ['courtDateUrgent', 'highValue', 'sharedCareDispute', 'specialCircumstances', 'highVariance', 'incomeSuspicion'];

    return flagKeys
      .filter(k => flags[k])
      .map(flag =>
        flag
          .replace(/([A-Z])/g, '_$1')
          .toLowerCase()
          .replace(/^_/, '')
      );
  }, [flags]);

  // Navigate to lawyer inquiry form
  const navigateToInquiry = useCallback(() => {
    if (isNavigating) {
      return;
    }

    setIsNavigating(true);

    // Close the modal first
    setIsExpanded(false);

    // Navigate after modal animation completes
    // Using requestAnimationFrame for more reliable timing than setTimeout
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          // Serialize care arrangement data for each child
          const careData = (formData?.children ?? []).map((child, index) => ({
            index,
            careA: results.childResults[index]?.roundedCareA ?? 0,
            careB: results.childResults[index]?.roundedCareB ?? 0
          }));

          router.push({
            pathname: '/lawyer-inquiry',
            params: {
              liability: results.finalPaymentAmount.toString(),
              trigger: getTrigger(),
              // Pass all triggered complexity flags as array for combining with COA reasons
              complexityTriggers: JSON.stringify(getAllTriggers()),
              incomeA: results.ATI_A.toString(),
              incomeB: results.ATI_B.toString(),
              children: (formData?.children?.length ?? 0).toString(),
              careData: JSON.stringify(careData),
              // Include CoA reasons if they were selected
              ...(formData?.selectedCoAReasons && formData.selectedCoAReasons.length > 0
                ? { coaReasons: JSON.stringify(formData.selectedCoAReasons) }
                : {})
            }
          });
        } catch (error) {
          console.error('[CalculatorResults] Navigation error:', error);
        } finally {
          // Reset navigation state after a delay
          setTimeout(() => setIsNavigating(false), 500);
        }
      });
    });
  }, [isNavigating, router, results, formData, getTrigger, analytics]);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isExpanded ? 1 : 0,
      useNativeDriver: false,
      tension: 65,
      friction: 11,
    }).start();
  }, [isExpanded]);

  const toggleExpand = () => {
    const willExpand = !isExpanded;

    // Track analytics only when expanding (not collapsing)
    if (willExpand && !isExpanded) {
      try {
        const childrenCount = results.childResults?.length ?? 0;
        const hasComplexityAlert = alertConfig !== null;

        const eventProperties = {
          annual_liability: results.finalPaymentAmount,
          has_complexity_alert: hasComplexityAlert,
          children_count: childrenCount
        };

        console.log('[Analytics] Tracking breakdown_expanded:', eventProperties);
        analytics.track('breakdown_expanded', eventProperties);

        // Also track CoA prompt shown
        console.log('[Analytics] Tracking coa_prompt_shown:', eventProperties);
        analytics.track('coa_prompt_shown', eventProperties);
      } catch (error) {
        console.error('[Analytics] Error tracking breakdown_expanded:', error);
      }
    }

    setIsExpanded(willExpand);
  };

  // Background color for professional fintech aesthetic - light mode
  const getSolidBackgroundColor = (_payer: string): string => {
    return '#3b82f6'; // Professional blue for result card
  };

  // Web-specific container styles for modal content
  const webModalContainerStyle = isWeb ? {
    maxWidth: MAX_MODAL_WIDTH,
    width: '100%' as const,
    alignSelf: 'center' as const,
  } : {};

  // Web-specific card container styles
  const webCardContainerStyle = isWeb ? {
    maxWidth: MAX_CONTENT_WIDTH,
    width: '100%' as const,
    alignSelf: 'center' as const,
    marginHorizontal: 'auto' as const,
  } : {};

  // Render the expanded full-screen breakdown content
  const renderBreakdownContent = () => (
    <ScrollView
      style={styles.expandedScrollView}
      contentContainerStyle={[styles.expandedContentContainer, { paddingBottom: insets.bottom + 20 }, webModalContainerStyle]}
      showsVerticalScrollIndicator={true}
    >
      {/* Hero Section in Expanded View */}
      <View
        style={[styles.expandedHeroSection, { backgroundColor: getSolidBackgroundColor(results.payer) }]}
      >
        <Text style={styles.expandedHeroLabel}>
          {results.payer === "Neither" ? "No payment required" : `${results.payer} pays`}
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

      {/* Lawyer Alert - only shown when calculation is complete AND complexity flags triggered */}
      {shouldShowComplexityAlert && (
        <LawyerAlert
          title={alertConfig.title}
          message={alertConfig.message}
          urgency={alertConfig.urgency}
          buttonText={alertConfig.buttonText}
          onPress={navigateToInquiry}
          triggerType={getTrigger()}
          annualLiability={results.finalPaymentAmount}
          tip={alertConfig.tip}
        />
      )}

      {/* Change of Assessment Prompt - always shown */}
      <ChangeOfAssessmentPrompt
        results={results}
        formData={formData}
        onNavigate={() => setIsExpanded(false)}
        onCoAReasonsChange={handleCoAReasonsChange}
      />

      <ResultsSimpleExplanation
        results={results}
        formState={{
          supportA: formData?.supportA ?? false,
          supportB: formData?.supportB ?? false
        }}
      />
    </ScrollView>
  );

  // Handle inquiry button press - use callback if provided, otherwise navigate
  const handleInquiryPress = useCallback(() => {
    if (onRequestInquiry) {
      onRequestInquiry();
    } else {
      navigateToInquiry();
    }
  }, [onRequestInquiry, navigateToInquiry]);

  // Inline mode: render as two-column layout (desktop web)
  if (isInlineMode) {
    return (
      <View style={styles.twoColumnLayout}>
        {/* Left Column: Hero + COA */}
        <View style={styles.leftColumn}>
          {/* Hero Section */}
          <View
            style={[styles.inlineHeroSection, { backgroundColor: getSolidBackgroundColor(results.payer) }]}
          >
            <Text style={styles.expandedHeroLabel}>
              {results.payer === "Neither" ? "No payment required" : `${results.payer} pays`}
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

          {/* Change of Assessment Prompt - always shown in left column */}
          <ChangeOfAssessmentPrompt
            results={results}
            formData={formData}
            onNavigate={() => {}}  // No modal to close in inline mode
            onRequestInquiry={handleInquiryPress}
            onCoAReasonsChange={handleCoAReasonsChange}
          />
        </View>

        {/* Right Column: Complexity + Breakdown (or Inquiry Panel) */}
        <ScrollView style={styles.rightColumn} contentContainerStyle={styles.rightColumnContent}>
          {showInquiryPanel ? (
            // Inline inquiry panel
            <WebInquiryPanel
              liability={results.finalPaymentAmount.toString()}
              trigger={getTrigger()}
              complexityTriggers={getAllTriggers()}
              incomeA={results.ATI_A.toString()}
              incomeB={results.ATI_B.toString()}
              children={(formData?.children?.length ?? 0).toString()}
              careData={formData?.children?.map((child, index) => ({
                index,
                careA: child.careAmountA,
                careB: child.careAmountB,
              })) || []}
              coaReasons={selectedCoAReasons.length > 0 ? selectedCoAReasons : null}
              onClose={onCloseInquiry!}
              onSuccess={() => {
                // Stay on success screen - user can close manually
              }}
            />
          ) : (
            <>
              {/* Lawyer Alert - only shown when calculation is complete AND complexity flags triggered */}
              {shouldShowComplexityAlert && (
                <LawyerAlert
                  title={alertConfig.title}
                  message={alertConfig.message}
                  urgency={alertConfig.urgency}
                  buttonText={alertConfig.buttonText}
                  onPress={handleInquiryPress}
                  triggerType={getTrigger()}
                  annualLiability={results.finalPaymentAmount}
                  tip={alertConfig.tip}
                />
              )}

              <ResultsSimpleExplanation
                results={results}
                formState={{
                  supportA: formData?.supportA ?? false,
                  supportB: formData?.supportB ?? false
                }}
              />
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  // Modal mode: collapsed card + full-screen modal (mobile/tablet)
  return (
    <>
      {/* Fixed Bottom Payment Card (Collapsed) */}
      {!isExpanded && (
        <Pressable
          onPress={toggleExpand}
          style={[
            { paddingBottom: Math.max(insets.bottom, 16) },
            isWeb && webClickableStyles,
            isWeb && styles.fixedBottomCardWebWrapper,
          ]}
        >
          <View
            style={[styles.fixedBottomCard, isWeb && styles.fixedBottomCardWeb, { backgroundColor: getSolidBackgroundColor(results.payer) }]}
          >
            {/* Drag Handle */}
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragHandle} />
            </View>

            <View style={styles.collapsedContent}>
              <View style={styles.collapsedLeft}>
                <Text style={styles.collapsedLabel}>
                  {results.payer === "Neither" ? "No payment" : `${results.payer} pays`}
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
        <View style={[styles.expandedContainer, { paddingTop: insets.top }, isWeb && styles.expandedContainerWeb]}>
          {/* Header with Close Button */}
          <View style={[styles.expandedHeader, isWeb && styles.expandedHeaderWeb]}>
            <View style={[styles.expandedHeaderContent, webModalContainerStyle]}>
              <Text style={styles.expandedHeaderTitle}>Full Breakdown</Text>
              <Pressable onPress={toggleExpand} style={[styles.closeButton, isWeb && webClickableStyles]}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  fixedBottomCardWebWrapper: {
    // Center the card on web
  },
  fixedBottomCardWeb: {
    maxWidth: MAX_CONTENT_WIDTH,
    marginHorizontal: 'auto',
    left: 'auto',
    right: 'auto',
    borderRadius: 16,
    marginBottom: 16,
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
    color: "#ffffff", // white
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  collapsedAmount: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  collapsedSubtext: {
    color: "#ffffff", // white
    fontSize: 14,
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
    color: "#ffffff", // white
  },
  collapsedSecondaryLabel: {
    fontSize: 12,
    color: "#ffffff", // white
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
    color: "#ffffff", // white
    fontSize: 12,
    fontWeight: "500",
  },
  expandChevron: {
    color: "#ffffff", // white
    fontSize: 12,
  },

  // Expanded modal styles
  expandedContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa", // soft warm grey
  },
  expandedContainerWeb: {
    // Add subtle padding on web for breathing room
  },
  expandedHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0", // subtle border
    backgroundColor: "#ffffff", // white header
  },
  expandedHeaderWeb: {
    paddingVertical: 16,
  },
  expandedHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  expandedHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a202c", // near black
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f7fafc", // very light grey
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#4a5568", // dark grey
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
    paddingVertical: 32,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  expandedHeroLabel: {
    color: "#ffffff", // white
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  expandedHeroAmount: {
    fontSize: 48,
    fontWeight: "700",
    color: "#1a202c", // near black for maximum contrast on blue
    letterSpacing: -1,
  },
  expandedHeroSubtext: {
    color: "#ffffff", // white
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
    color: "#2d3748", // dark grey on white card
  },
  expandedSecondaryLabel: {
    fontSize: 12,
    color: "#718096", // medium grey
  },
  expandedDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#e2e8f0", // subtle divider
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
    backgroundColor: "#ffffff", // white
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0", // subtle border
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b", // amber-500 - keeping accent
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

  // Inline mode styles (desktop web side panel)
  inlineContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa", // soft warm grey
  },
  inlineContentContainer: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  inlineHeroSection: {
    alignItems: "center",
    paddingVertical: 32,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  // Two-column layout styles (new web layout)
  twoColumnLayout: {
    flexDirection: "row",
    gap: 24,
    alignItems: "flex-start",
  },
  leftColumn: {
    flex: 1,
    minWidth: 300,
    maxWidth: 400,
    gap: 16,
  },
  rightColumn: {
    flex: 1.5,
    minWidth: 350,
  },
  rightColumnContent: {
    gap: 16,
    paddingBottom: 24,
  },

  // Inquiry placeholder styles (temporary)
  inquiryPlaceholder: {
    backgroundColor: "#ffffff", // white
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0", // subtle border
  },
  inquiryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  inquiryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a202c", // near black
  },
  closeInquiryButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f7fafc", // very light grey
    alignItems: "center",
    justifyContent: "center",
  },
  closeInquiryText: {
    color: "#4a5568", // dark grey
    fontSize: 18,
    fontWeight: "500",
  },
  inquiryPlaceholderText: {
    color: "#718096", // medium grey
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 40,
  },
});

