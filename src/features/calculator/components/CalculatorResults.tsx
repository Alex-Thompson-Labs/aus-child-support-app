import { StepProgressIndicator } from '@/src/components/ui/StepProgressIndicator';
import type { CalculationResults } from '@/src/utils/calculator';
import {
    ComplexityFormData,
} from '@/src/utils/complexity-detection';
import { MAX_CALCULATOR_WIDTH, useResponsive } from '@/src/utils/responsive';
import React, { useEffect } from 'react';
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ResultsHero } from './results/ResultsHero';
import { ResultsInlineSummary } from './results/ResultsInlineSummary';
import { ResultsModalContent } from './results/ResultsModalContent';
import { useResultsNavigation } from './results/useResultsNavigation';

// Re-export event constants for backward compatibility
export { OPEN_BREAKDOWN_EVENT, triggerOpenBreakdown } from '@/src/utils/event-bus';

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
 * - Complexity logic is handled within SmartConversionFooter and SpecialCircumstancesPrompt
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
  const insets = useSafeAreaInsets();
  const { isWeb, isDesktop } = useResponsive();

  // Use custom hook for state and navigation logic
  const {
    isExpanded,
    setIsExpanded,
    toggleExpand,
    localFormData,
    setLocalFormData,
    currentResultsKey,
    modalContainerRef,
    triggerButtonRef,
    closeButtonRef,
  } = useResultsNavigation({
    results,
    formData,
    resetTimestamp,
  });

  const isInlineMode = displayMode === 'inline';
  const hasChildren = formData?.children && formData.children.length > 0;

  // Focus trap effect - manages focus when modal opens/closes
  useEffect(() => {
    if (!isWeb) return;

    if (isExpanded) {
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
  }, [isExpanded, isWeb, closeButtonRef, triggerButtonRef]);

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

  // Handle special circumstances change
  const handleSpecialCircumstancesChange = (reasons: string[]) => {
    setLocalFormData((prev) => ({
      ...prev,
      selectedCircumstances: reasons,
    }));
  };

  // Inline mode: two-column layout
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
        <View style={styles.rightColumn}>
          <ResultsModalContent
            results={results}
            formData={formData}
            localFormData={localFormData}
            currentResultsKey={currentResultsKey}
            isStale={isStale}
            calculatorStartTime={calculatorStartTime}
            isWeb={isWeb}
            onCloseModal={() => setIsExpanded(false)}
            onSpecialCircumstancesChange={handleSpecialCircumstancesChange}
          />
        </View>
      </View>
    );
  }

  // Don't render modal at all if no children exist
  if (!hasChildren) {
    return null;
  }

  // Modal mode: collapsed summary card + expandable modal
  return (
    <>
      {!isExpanded && (
        <ResultsInlineSummary
          results={results}
          supportA={formData?.supportA}
          supportB={formData?.supportB}
          isStale={isStale}
          bottomInset={insets.bottom}
          isWeb={isWeb}
          isDesktop={isDesktop}
          triggerButtonRef={triggerButtonRef}
          onPress={toggleExpand}
        />
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
          <ResultsModalContent
            results={results}
            formData={formData}
            localFormData={localFormData}
            currentResultsKey={currentResultsKey}
            isStale={isStale}
            calculatorStartTime={calculatorStartTime}
            isWeb={isWeb}
            onCloseModal={() => setIsExpanded(false)}
            onSpecialCircumstancesChange={handleSpecialCircumstancesChange}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  expandedContainer: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
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
    fontWeight: '700',
    color: '#1e3a8a',
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
  closeIcon: { 
    fontSize: 22, 
    color: '#1e3a8a' 
  },
  twoColumnLayout: { 
    flexDirection: 'row', 
    gap: 20 
  },
  leftColumn: { 
    flex: 1 
  },
  rightColumn: { 
    flex: 1.5 
  },
});
