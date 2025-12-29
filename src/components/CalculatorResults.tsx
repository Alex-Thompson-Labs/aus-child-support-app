import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import ReactGA from "react-ga4"; // Integrated for web lead tracking
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { CalculationResults } from "../types/calculator";
import { detectComplexity, getAlertConfig, type ComplexityFlags, type ComplexityFormData } from "../utils/complexity-detection";
import { MAX_MODAL_WIDTH, useResponsive } from "../utils/responsive";
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
}

const formatCurrency = (num: number | undefined | null): string => {
  if (num === undefined || num === null || isNaN(num)) return "$0";
  return `$${Math.round(num).toLocaleString()}`;
};

export function CalculatorResults({
  results,
  formData,
  displayMode = 'modal',
  onRequestInquiry,
  showInquiryPanel = false,
  onCloseInquiry,
}: CalculatorResultsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isWeb } = useResponsive();

  const isInlineMode = displayMode === 'inline';
  const [isNavigating, setIsNavigating] = useState(false);

  // Complexity Logic
  const flags = detectComplexity(results, formData ?? {});
  const alertConfig = getAlertConfig(flags, results);

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
          ...(formData?.selectedCoAReasons?.length ? { coaReasons: JSON.stringify(formData.selectedCoAReasons) } : {})
        }
      });
      setTimeout(() => setIsNavigating(false), 500);
    });
  }, [isNavigating, router, results, formData, getTrigger, getAllTriggers, isWeb]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const webModalContainerStyle = isWeb ? { maxWidth: MAX_MODAL_WIDTH, width: '100%' as const, alignSelf: 'center' as const } : {};

  const renderBreakdownContent = () => (
    <ScrollView
      style={styles.expandedScrollView}
      contentContainerStyle={[styles.expandedContentContainer, { paddingBottom: insets.bottom + 20 }, webModalContainerStyle]}
    >
      <View style={styles.expandedHeroSection}>
        <Text style={styles.expandedHeroLabel}>
          {results.payer === "Neither" ? "No payment required" : `${results.payer} pays`}
        </Text>
        <Text style={styles.expandedHeroAmount}>{formatCurrency(results.finalPaymentAmount)}</Text>
        <Text style={styles.expandedHeroSubtext}>per year</Text>
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

      <ChangeOfAssessmentPrompt results={results} formData={formData} onNavigate={() => setIsExpanded(false)} />
      <ResultsSimpleExplanation results={results} formState={{ supportA: formData?.supportA ?? false, supportB: formData?.supportB ?? false }} />
    </ScrollView>
  );

  if (isInlineMode) {
    return (
      <View style={styles.twoColumnLayout}>
        <View style={styles.leftColumn}>
          <View style={styles.inlineHeroSection}>
            <Text style={styles.expandedHeroAmount}>{formatCurrency(results.finalPaymentAmount)}</Text>
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
                <Text style={styles.collapsedAmountCondensed}>
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
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
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
  expandedContentContainer: { padding: 16 },
  expandedHeroSection: { alignItems: "center", padding: 24, backgroundColor: "#fff", borderRadius: 12, marginBottom: 16 },
  expandedHeroAmount: { fontSize: 48, fontWeight: "800", color: "#1a202c" },
  expandedHeroLabel: { fontSize: 16, color: "#718096" },
  expandedHeroSubtext: { fontSize: 14, color: "#a0aec0" },
  twoColumnLayout: { flexDirection: "row", gap: 20 },
  leftColumn: { flex: 1 },
  rightColumn: { flex: 1.5 },
  inlineHeroSection: { padding: 20, backgroundColor: "#fff", borderRadius: 12 }
});