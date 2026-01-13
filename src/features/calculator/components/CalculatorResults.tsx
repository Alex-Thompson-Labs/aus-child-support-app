import { LazyLoadErrorBoundary } from '@/src/components/ui/LazyLoadErrorBoundary';
import { StepProgressIndicator } from '@/src/components/ui/StepProgressIndicator';
import { SmartConversionFooter } from '@/src/features/conversion/components/SmartConversionFooter';
import { SpecialCircumstancesPrompt } from '@/src/features/conversion/components/SpecialCircumstancesPrompt';
import { useAnalytics } from '@/src/utils/analytics';
import type { CalculationResults } from '@/src/utils/calculator';
import {
    ComplexityFormData,
    detectComplexity,
} from '@/src/utils/complexity-detection';
import { eventBus } from '@/src/utils/event-bus';
import { formatCurrency } from '@/src/utils/formatters';
import { MAX_CALCULATOR_WIDTH, useResponsive } from '@/src/utils/responsive';
import { shadowPresets } from '@/src/utils/shadow-styles';
import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FtbImpactCard } from './FtbImpactCard';
import { getPayerText, ResultsHero } from './results/ResultsHero';

// ============================================================================
// Event-based breakdown re-open signaling
// Used when returning from lawyer inquiry to re-open the breakdown modal
// ============================================================================

/**
 * Helper to generate income support indicator text for collapsed card
 */
function getIncomeSupportText(
  supportA: boolean,
  supportB: boolean,
  farA: number = 0,
  farB: number = 0
): string | null {
  if (supportA && supportB) {
    return 'Income support applied: You + Other Parent';
  } else if (supportA) {
    return 'Income support applied: You';
  } else if (supportB) {
    return 'Income support applied: Other Parent';
  }
  // Check if FAR is applied without income support
  const isFixedAnnualRate = farA > 0 || farB > 0;
  const isIncomeSupport = supportA || supportB;
  if (isFixedAnnualRate && !isIncomeSupport) {
    return 'Income support not applied: Fixed Annual Rate (FAR) assessment';
  }
  return null;
}

// Lazy load the named export
const ResultsSimpleExplanation = lazy(() =>
  import('./ResultsSimpleExplanation').then((module) => ({
    default: module.ResultsSimpleExplanation,
  }))
);

export const OPEN_BREAKDOWN_EVENT = 'openBreakdownModal';
export const triggerOpenBreakdown = () => {
  eventBus.emit(OPEN_BREAKDOWN_EVENT);
};

// ============================================================================
// Component Documentation
// ============================================================================
/**
 * CalculatorResults Component
 *
 * Displays calculation results in either modal or inline mode.
 * Shows payment amounts, breakdown details, special circumstances prompts, and conversion CTAs.
 *
 * Parent Component:
 * - src/screens/CalculatorScreen.tsx (line 160) - Main calculator screen
 *   Passes calculation results and form state from useCalculator() hook
 *
 * Props Interface (CalculatorResultsProps):
 * - results: CalculationResults - Complete calculation results including:
 *   - finalPaymentAmount: number - Annual child support liability
 *   - payer: string - Which parent pays ("Parent A", "Parent B", or "Neither")
 *   - ATI_A: number - Parent A's adjusted taxable income
 *   - ATI_B: number - Parent B's adjusted taxable income
 *   - childResults: Array - Care percentages and calculations per child
 *
 * - formData?: ComplexityFormData - Optional form state containing:
 *   - children: ChildInput[] - Child care arrangement data
 *   - supportA: boolean - Parent A income support flag
 *   - supportB: boolean - Parent B income support flag
 *   - selectedCircumstances?: string[] - Pre-selected Special Circumstances reasons
 *   Used for complexity detection and persistence
 *
 * - displayMode?: 'modal' | 'inline' - Display layout mode (default: 'modal')
 *   - 'modal': Floating bottom card that expands to full-screen modal
 *   - 'inline': Two-column layout with results on left, breakdown on right
 *
 * - onRequestInquiry?: () => void - Optional callback for web inline inquiry panel
 *   If provided, enables inline inquiry mode instead of navigation
 *
 * - showInquiryPanel?: boolean - Controls inline inquiry panel visibility (default: false)
 *   Used with onRequestInquiry for web inline mode
 *
 * - onCloseInquiry?: () => void - Optional callback to close inline inquiry panel
 *
 * - isStale?: boolean - Flag indicating results may be outdated (default: false)
 *   When true, displays strikethrough styling on amounts
 *   Set by parent when form inputs change before recalculation
 *
 * - resetTimestamp?: number - Timestamp that increments on form reset (default: 0)
 *   Used to clear CoA reasons when form is explicitly reset
 *
 * Display Modes:
 *
 * 1. Modal Mode (default):
 *    - Collapsed: Fixed bottom card showing payer and annual amount
 *    - Expanded: Full-screen modal with hero section, breakdown, special circumstances prompt, footer
 *    - User taps card to expand/collapse
 *    - Returns null if no children exist in calculation
 *
 * 2. Inline Mode:
 *    - Two-column layout (left: hero, right: breakdown scroll)
 *    - Used for desktop/tablet layouts
 *    - No modal overlay, always visible
 *
 * Child Components:
 * - SpecialCircumstancesPrompt - Special Circumstances selection and navigation
 *   - Receives: results, localFormData, onNavigate callback
 *   - Syncs selectedCircumstances via onSpecialCircumstancesChange callback
 *   - Key prop ensures remount when calculation changes
 *
 * - ResultsSimpleExplanation (lazy) - Detailed calculation breakdown
 *   - Receives: results, formState (support flags)
 *   - Code-split for performance (large component)
 *   - Suspense fallback shows loading indicator
 *
 * - SmartConversionFooter - Conversion CTAs with complexity-based messaging
 *   - Receives: results, carePercentages, formData, onBeforeNavigate
 *   - Handles navigation to /lawyer-inquiry route
 *
 * State Management:
 * - isExpanded: boolean - Controls modal visibility (modal mode only)
 * - localFormData: ComplexityFormData - Local state preserving special circumstances
 *   - Merges fresh formData.children from props with preserved selectedCircumstances
 *   - Prevents selections from being lost when form updates
 *   - Clears on resetTimestamp increment
 *
 * - isNavigating: boolean - Prevents double navigation during route transitions
 * - lastResultsKey: string - Tracks calculation changes to update formData
 *
 * Complexity Detection:
 * - Uses detectComplexity() utility with merged formData
 * - Detects: highValue, sharedCareDispute, specialCircumstances, bindingAgreement
 * - Triggers used for navigation params and conversion messaging
 *
 * Navigation Behavior:
 * - navigateToInquiry() function routes to /lawyer-inquiry with params:
 *   - liability: results.finalPaymentAmount.toString()
 *   - trigger: getTrigger() - Primary complexity flag
 *   - complexityTriggers: JSON.stringify(getAllTriggers()) - All flags
 *   - incomeA: results.ATI_A.toString()
 *   - incomeB: results.ATI_B.toString()
 *   - children: (formData?.children?.length ?? 0).toString()
 *   - careData: JSON.stringify(careData array)
 *   - specialCircumstances: JSON.stringify(localFormData.selectedCircumstances) if exists
 *
 * - Tracks Google Analytics event on web (Lead/Inquiry_Click)
 * - Closes modal before navigation (onNavigate callback)
 *
 * Key Features:
 * - Special Circumstances persistence across form updates
 * - Stale result indication with strikethrough styling
 * - Responsive design with web-specific modal constraints
 * - Code-split heavy components for performance
 * - Safe area insets handling for mobile notches
 * - Conditional rendering (returns null if no children)
 *
 * Performance Optimizations:
 * - ResultsSimpleExplanation lazy loaded (~1153 lines)
 * - Suspense boundaries for loading states
 * - Key-based remounting of SpecialCircumstancesPrompt on calculation change
 * - Memoized trigger calculation functions
 */

interface CalculatorResultsProps {
  results: CalculationResults;
  formData?: ComplexityFormData;
  displayMode?: 'modal' | 'inline';
  isStale?: boolean;
  resetTimestamp?: number;
  calculatorStartTime?: number;
}

export function CalculatorResults({
  results,
  formData,
  displayMode = 'modal',
  isStale = false,
  resetTimestamp = 0,
  calculatorStartTime,
}: CalculatorResultsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const analytics = useAnalytics();
  const hasTrackedResultsView = useRef(false);

  // Track results_viewed event when results are first displayed (web only)
  useEffect(() => {
    if (Platform.OS === 'web' && results && !hasTrackedResultsView.current) {
      hasTrackedResultsView.current = true;
      analytics.track('results_viewed', {
        total_liability: results.finalPaymentAmount,
        payer: results.payer,
      });
    }
  }, [results, analytics]);

  // Reset tracking flag when results change significantly
  useEffect(() => {
    hasTrackedResultsView.current = false;
  }, [results.finalPaymentAmount, results.payer]);

  // Listen for event to re-open breakdown modal when returning from lawyer inquiry
  React.useEffect(() => {
    const unsubscribe = eventBus.subscribe(OPEN_BREAKDOWN_EVENT, () => {
      console.log('[CalculatorResults] Received open breakdown event');
      setIsExpanded(true);
    });
    return () => unsubscribe();
  }, []);
  const insets = useSafeAreaInsets();
  const { isWeb } = useResponsive();

  const isInlineMode = displayMode === 'inline';

  // Track local form data updates (selected Special Circumstances)
  // Preserve selections across navigation - only update children/support from props
  const [localFormData, setLocalFormData] = useState<ComplexityFormData>(
    () => ({
      ...formData,
      selectedCircumstances: formData?.selectedCircumstances ?? [],
    })
  );
  const [lastResultsKey, setLastResultsKey] = useState('');

  // Generate a unique key for the current results
  const currentResultsKey = `${results.finalPaymentAmount}-${results.payer}-${results.childResults
    .map((c) => `${c.roundedCareA}-${c.roundedCareB}`)
    .join('-')}-${results.ATI_A}-${results.ATI_B}`;

  // Update formData when results change, but preserve selected CoA reasons
  React.useEffect(() => {
    if (currentResultsKey !== lastResultsKey) {
      setLocalFormData((prev) => ({
        ...formData,
        // Preserve selected Special Circumstances from previous state
        selectedCircumstances:
          prev.selectedCircumstances ?? formData?.selectedCircumstances ?? [],
      }));
      setLastResultsKey(currentResultsKey);
    }
  }, [currentResultsKey, lastResultsKey, formData]);

  // Clear special circumstances when reset is explicitly called
  React.useEffect(() => {
    if (resetTimestamp > 0) {
      setLocalFormData((prev) => ({
        ...prev,
        selectedCircumstances: [],
      }));
    }
  }, [resetTimestamp]);

  // Detected complexity flags - Memoized to prevent re-calculation on every render
  const complexityFlags = React.useMemo(() => {
    return detectComplexity(results, localFormData);
  }, [results, localFormData]);

  // Check if any children exist in the calculation
  const hasChildren = formData?.children && formData.children.length > 0;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Focus trap refs for modal accessibility
  const modalContainerRef = useRef<View>(null);
  const triggerButtonRef = useRef<View>(null);
  const closeButtonRef = useRef<View>(null);
  const previousActiveElement = useRef<Element | null>(null);

  // Focus trap effect - manages focus when modal opens/closes
  useEffect(() => {
    if (!isWeb) return;

    if (isExpanded) {
      // Store the currently focused element to restore later
      previousActiveElement.current = document.activeElement;

      // Focus the close button when modal opens (first focusable element)
      requestAnimationFrame(() => {
        const closeBtn = closeButtonRef.current as unknown as HTMLElement;
        if (closeBtn?.focus) {
          closeBtn.focus();
        }
      });
    } else {
      // Restore focus to trigger button when modal closes
      requestAnimationFrame(() => {
        const triggerBtn = triggerButtonRef.current as unknown as HTMLElement;
        if (triggerBtn?.focus) {
          triggerBtn.focus();
        }
      });
    }
  }, [isExpanded, isWeb]);

  // Keyboard focus trap - using document event listener for web
  useEffect(() => {
    if (!isWeb || !isExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Close on Escape key
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsExpanded(false);
        return;
      }

      // Trap Tab key within modal
      if (event.key === 'Tab') {
        const modalElement = modalContainerRef.current as unknown as HTMLElement;
        if (!modalElement) return;

        // Get all focusable elements within the modal
        const focusableElements = modalElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"]'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        // Shift+Tab on first element -> move to last element
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
        // Tab on last element -> move to first element
        else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, isWeb]);

  const webModalContainerStyle = isWeb
    ? {
      maxWidth: MAX_CALCULATOR_WIDTH,
      width: '100%' as const,
      alignSelf: 'center' as const,
    }
    : {};

  const renderBreakdownContent = () => (
    <ScrollView
      style={styles.expandedScrollView}
      contentContainerStyle={[
        styles.expandedContentContainer,
        { paddingBottom: insets.bottom + 20 },
        webModalContainerStyle,
      ]}
      showsVerticalScrollIndicator={true}
    >
      <ResultsHero
        results={results}
        isStale={isStale}
        variant="modal"
        supportA={formData?.supportA ?? false}
        supportB={formData?.supportB ?? false}
      />

      <SpecialCircumstancesPrompt
        key={currentResultsKey}
        results={results}
        formData={localFormData}
        onNavigate={() => setIsExpanded(false)}
        onSpecialCircumstancesChange={(reasons) => {
          setLocalFormData((prev) => ({
            ...prev,
            selectedCircumstances: reasons,
          }));
        }}
        calculatorStartTime={calculatorStartTime}
      />
      {results && (
        <LazyLoadErrorBoundary>
          <Suspense
            fallback={
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={{ marginTop: 10, color: '#64748b' }}>
                  Loading breakdown...
                </Text>
              </View>
            }
          >
            <ResultsSimpleExplanation
              results={results}
              formState={{
                supportA: formData?.supportA ?? false,
                supportB: formData?.supportB ?? false,
              }}
            />
          </Suspense>
        </LazyLoadErrorBoundary>
      )}

      {/* Smart Conversion Footer - Always show at bottom of results */}
      <SmartConversionFooter
        results={results}
        carePercentages={results.childResults.map(
          (child) => child.roundedCareA
        )}
        formData={localFormData}
        onBeforeNavigate={() => setIsExpanded(false)}
        calculatorStartTime={calculatorStartTime}
      />

      {/* FTB Impact Card - Shows FTB Part A/B implications */}
      <FtbImpactCard
        results={results}
        userIncome={results.ATI_A}
        childCount={formData?.children?.length ?? results.childResults.length}
      />
    </ScrollView>
  );

  if (isInlineMode) {
    return (
      <View style={styles.twoColumnLayout}>
        <View style={styles.leftColumn}>
          <ResultsHero
            results={results}
            isStale={isStale}
            variant="inline"
            supportA={formData?.supportA ?? false}
            supportB={formData?.supportB ?? false}
          />
        </View>
        <ScrollView style={styles.rightColumn}>
          {renderBreakdownContent()}
        </ScrollView>
      </View>
    );
  }

  // Don't render modal at all if no children exist
  if (!hasChildren) {
    return null;
  }

  return (
    <>
      {!isExpanded && (
        <Pressable
          ref={triggerButtonRef}
          onPress={toggleExpand}
          style={[
            styles.fixedBottomCardWrapper,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
          accessibilityRole="button"
          accessibilityLabel={
            results.payer === 'Neither'
              ? 'No payment required. Tap to view full breakdown'
              : `${results.payer} pays ${formatCurrency(results.finalPaymentAmount)} per year. Tap to view full breakdown`
          }
          accessibilityHint="Opens detailed calculation breakdown"
        >
          <View
            style={[styles.fixedBottomCard, { backgroundColor: '#3b82f6' }]}
          >
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragHandle} />
            </View>
            <View style={styles.collapsedContent}>
              <View style={styles.collapsedSummaryRow}>
                <Text style={styles.collapsedLabel}>
                  {getPayerText(results.payer)}
                </Text>
                <Text
                  style={[
                    styles.collapsedAmountCondensed,
                    isStale && styles.staleAmount,
                  ]}
                >
                  {formatCurrency(results.finalPaymentAmount)}
                </Text>
              </View>
              {getIncomeSupportText(
                formData?.supportA ?? false,
                formData?.supportB ?? false,
                results.FAR_A,
                results.FAR_B
              ) && (
                  <View style={styles.collapsedIncomeSupportBadge}>
                    <Text style={styles.collapsedIncomeSupportText}>
                      ✓{' '}
                      {getIncomeSupportText(
                        formData?.supportA ?? false,
                        formData?.supportB ?? false,
                        results.FAR_A,
                        results.FAR_B
                      )}
                    </Text>
                  </View>
                )}
            </View>
            <View style={styles.expandHint}>
              <Text style={styles.expandHintText}>Tap for breakdown ▲</Text>
            </View>
          </View>
        </Pressable>
      )}

      <Modal
        visible={isExpanded}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={toggleExpand}
      >
        <View
          ref={modalContainerRef}
          style={[styles.expandedContainer, { paddingTop: insets.top }]}
          // @ts-ignore - Web-only ARIA attributes
          role="dialog"
          aria-modal={true}
          aria-labelledby="modal-title"
        >
          <View style={styles.expandedHeader}>
            <View
              style={[styles.expandedHeaderContent, webModalContainerStyle]}
            >
              <Text
                // @ts-ignore - Web-only id attribute
                nativeID="modal-title"
                style={styles.expandedHeaderTitle}
              >
                Assessment Breakdown
              </Text>
              <View style={styles.headerActions}>
                {Platform.OS === 'web' && (
                  <PDFExportButton
                    results={results}
                    supportA={formData?.supportA ?? false}
                    supportB={formData?.supportB ?? false}
                    variant="secondary"
                  />
                )}
                <Pressable
                  ref={closeButtonRef}
                  onPress={toggleExpand}
                  style={styles.closeButton}
                  accessibilityRole="button"
                  accessibilityLabel="Close breakdown"
                >
                  <Text style={styles.closeIcon}>✕</Text>
                </Pressable>
              </View>
            </View>
          </View>
          {/* Progress Indicator - Step 2: Estimate */}
          <View style={[
            { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
            webModalContainerStyle,
          ]}>
            <StepProgressIndicator
              currentStep={2}
              compact
              step2Progress={(localFormData.selectedCircumstances?.length ?? 0) > 0 ? 100 : 0}
            />
          </View>
          {renderBreakdownContent()}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fixedBottomCardWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  fixedBottomCard: {
    width: '94%',
    maxWidth: 750, // Matches the narrow form width exactly
    minHeight: 85, // Fixed height to prevent CLS when content varies
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    ...shadowPresets.modal,
    alignSelf: 'center', // Ensures it stays centered within its wrapper
  },
  collapsedContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
  },
  collapsedSummaryRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  collapsedIncomeSupportBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  collapsedIncomeSupportText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  collapsedLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  collapsedAmountCondensed: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  dragHandleContainer: { alignItems: 'center', paddingVertical: 6 },
  dragHandle: {
    width: 30,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  expandHint: { alignItems: 'center', paddingBottom: 4 },
  expandHintText: { color: '#ffffff', fontSize: 11, opacity: 0.8 },
  expandedContainer: { flex: 1, backgroundColor: '#f8f9fa' },
  expandedHeader: {
    padding: 4,
    paddingBottom: 4,
    paddingLeft: 24,
    paddingRight: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 0,
  },
  expandedHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expandedHeaderTitle: {
    fontSize: 18,
    fontWeight: '700', // Bold for strong typography
    color: '#1e3a8a', // blue-900 (Dark Brand Blue)
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: { fontSize: 22, color: '#1e3a8a' }, // blue-900 (matches header title)
  expandedScrollView: { flex: 1 },
  expandedContentContainer: { padding: 16, gap: 16 },
  staleAmount: {
    textDecorationLine: 'line-through',
    textDecorationColor: '#ef4444',
    textDecorationStyle: 'solid',
    opacity: 0.7,
  },
  twoColumnLayout: { flexDirection: 'row', gap: 20 },
  leftColumn: { flex: 1 },
  rightColumn: { flex: 1.5 },
});
