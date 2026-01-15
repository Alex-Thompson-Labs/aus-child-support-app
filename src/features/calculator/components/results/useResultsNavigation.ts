/**
 * useResultsNavigation Hook
 * 
 * Manages visibility state, navigation logic, and analytics tracking for the CalculatorResults component.
 * Extracts all state management and side effects related to modal visibility and user interactions.
 */

import { useAnalytics } from '@/src/utils/analytics';
import type { CalculationResults } from '@/src/utils/calculator';
import type { ComplexityFormData } from '@/src/utils/complexity-detection';
import { eventBus, OPEN_BREAKDOWN_EVENT } from '@/src/utils/event-bus';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export interface UseResultsNavigationProps {
  results: CalculationResults;
  formData?: ComplexityFormData;
  resetTimestamp?: number;
}

export interface UseResultsNavigationReturn {
  // Visibility state
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  toggleExpand: () => void;
  
  // Form data management
  localFormData: ComplexityFormData;
  setLocalFormData: React.Dispatch<React.SetStateAction<ComplexityFormData>>;
  currentResultsKey: string;
  
  // Focus management refs
  modalContainerRef: React.RefObject<any>;
  triggerButtonRef: React.RefObject<any>;
  closeButtonRef: React.RefObject<any>;
}

export function useResultsNavigation({
  results,
  formData,
  resetTimestamp = 0,
}: UseResultsNavigationProps): UseResultsNavigationReturn {
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
  useEffect(() => {
    const unsubscribe = eventBus.subscribe(OPEN_BREAKDOWN_EVENT, () => {
      setIsExpanded(true);
    });
    return () => unsubscribe();
  }, []);

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
  useEffect(() => {
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
  useEffect(() => {
    if (resetTimestamp > 0) {
      setLocalFormData((prev) => ({
        ...prev,
        selectedCircumstances: [],
      }));
    }
  }, [resetTimestamp]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Focus trap refs for modal accessibility
  const modalContainerRef = useRef<any>(null);
  const triggerButtonRef = useRef<any>(null);
  const closeButtonRef = useRef<any>(null);

  return {
    isExpanded,
    setIsExpanded,
    toggleExpand,
    localFormData,
    setLocalFormData,
    currentResultsKey,
    modalContainerRef,
    triggerButtonRef,
    closeButtonRef,
  };
}
