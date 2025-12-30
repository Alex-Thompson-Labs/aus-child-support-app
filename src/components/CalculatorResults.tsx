import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import ReactGA from "react-ga4"; // Integrated for web lead tracking
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { CalculationResults } from "../types/calculator";
import { detectComplexity, getAlertConfig, type ComplexityFlags, type ComplexityFormData } from "../utils/complexity-detection";
import { formatCurrency } from "../utils/formatters";
import { MAX_MODAL_WIDTH, useResponsive } from "../utils/responsive";
import { shadowPresets } from "../utils/shadow-styles";
import { ChangeOfAssessmentPrompt } from "./ChangeOfAssessmentPrompt";
import { LawyerAlert } from "./LawyerAlert";
import { ResultsSimpleExplanation } from "./ResultsSimpleExplanation";

interface CalculatorResultsProps {
  results: CalculationResults;
  formData?: ComplexityFormData;
  displayMode?: 'modal' | 'inline';
  onRequestInquiry?: () => void;
  showInquiryPanel?: boolean;
  onCloseInquiry?: () => void;
  isStale?: boolean;
}

export function CalculatorResults({
  results,
  formData,
  displayMode = 'modal',
  onRequestInquiry,
  showInquiryPanel = false,
  onCloseInquiry,
  isStale = false,
}: CalculatorResultsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isWeb } = useResponsive();

  const isInlineMode = displayMode === 'inline';
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Track local form data updates (selected CoA reasons and court date)
  // Reset localFormData whenever results change (new calculation)
  const [localFormData, setLocalFormData] = useState<ComplexityFormData>(formData ?? {});
  const [lastResultsKey, setLastResultsKey] = useState('');
  
  // Generate a unique key for the current results
  const currentResultsKey = `${results.finalPaymentAmount}-${results.payer}-${results.childResults.map(c => `${c.roundedCareA}-${c.roundedCareB}`).join('-')}-${results.ATI_A}-${results.ATI_B}`;
  
  // Reset localFormData when results change
  React.useEffect(() => {
    if (currentResultsKey !== lastResultsKey) {
      setLocalFormData(formData ?? {});
      setLastResultsKey(currentResultsKey);
    }
  }, [currentResultsKey, lastResultsKey, formData]);

  // Calculate payment amounts
  const monthlyAmount = results.finalPaymentAmount / 12;
  const fortnightlyAmount = results.finalPaymentAmount / 26;
  const dailyAmount = results.finalPaymentAmount / 365;

  // Complexity Logic - use local form data that includes court date
  const flags = detectComplexity(results, localFormData);
  const alertConfig = getAlertConfig(flags, results, localFormData);

  const isCalculationComplete = (() => {
    const hasIncome = results.ATI_A > 0 || results.ATI_B > 0;
    const hasChildrenWithCare = results.childResults?.some(child => 
      (child.roundedCareA !== undefined && child.roundedCareA >= 0)
    );
    return hasIncome && hasChildrenWithCare;
  })();

  const shouldShowComplexityAlert = alertConfig && isCalculationComplete;

  const getTrigger = useCallback((): string => {
    const flagKeys: Array<keyof ComplexityFlags> = ['courtDateUrgent', 'highValue', 'sharedCareDispute', 'specialCircumstances', 'highVariance', 'incomeSuspicion'];
    const triggeredFlag = flagKeys.find(k => flags[k]);
    return triggeredFlag ? triggeredFlag.replace(/([A-Z])/g, '_$1').toLowerCase() : 'unknown';
  }, [flags]);

  const getAllTriggers = useCallback((): string[] => {
    const flagKeys: Array<keyof ComplexityFlags> = ['courtDateUrgent', 'highValue', 'sharedCareDispute', 'specialCircumstances', 'highVariance', 'incomeSuspicion'];
    return flagKeys.filter(k => flags[k]).map(flag => flag.replace(/([A-Z])/g, '_$1').toLowerCase());
  }, [flags]);

  // Unified Navigation & Analytics Handler
  const navigateToInquiry = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);
    setIsExpanded(false);

    // Track Lead Generation Event on Web
    if (isWeb) {
      ReactGA.event({
        category: "Lead",
        action: "Inquiry_Click",
        label: "Lawyer Form Open",
      });
    }

    requestAnimationFrame(() => {
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
          complexityTriggers: JSON.stringify(getAllTriggers()),
          incomeA: results.ATI_A.toString(),
          incomeB: results.ATI_B.toString(),
          children: (formData?.children?.length ?? 0).toString(),
          careData: JSON.stringify(careData),
          ...(localFormData?.selectedCoAReasons?.length ? { coaReasons: JSON.stringify(localFormData.selectedCoAReasons) } : {}),
          ...(localFormData?.courtDate ? { courtDate: localFormData.courtDate } : {})
        }
      });
      setTimeout(() => setIsNavigating(false), 500);
    });
  }, [isNavigating, router, results, formData, localFormData, getTrigger, getAllTriggers, isWeb]);

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

      {shouldShowComplexityAlert && (
        <LawyerAlert
          title={alertConfig.title}
          message={alertConfig.message}
          urgency={alertConfig.urgency}
          buttonText={alertConfig.buttonText}
          onPress={navigateToInquiry} // Triggers analytics event
        />
      )}

      <ChangeOfAssessmentPrompt 
        key={`${results.finalPaymentAmount}-${results.payer}-${results.childResults.map(c => `${c.roundedCareA}-${c.roundedCareB}`).join('-')}-${results.ATI_A}-${results.ATI_B}`}
        results={results} 
        formData={localFormData} 
        onNavigate={() => setIsExpanded(false)} 
        onCoAReasonsChange={(reasons, courtDate) => {
          setLocalFormData(prev => ({
            ...prev,
            selectedCoAReasons: reasons,
            courtDate: courtDate,
          }));
        }}
      />
      <ResultsSimpleExplanation results={results} formState={{ supportA: formData?.supportA ?? false, supportB: formData?.supportB ?? false }} />
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

  return (
    <>
      {!isExpanded && (
        <Pressable
          onPress={toggleExpand}
          style={[styles.fixedBottomCardWrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}
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
              <Pressable onPress={toggleExpand} style={styles.closeButton}>
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