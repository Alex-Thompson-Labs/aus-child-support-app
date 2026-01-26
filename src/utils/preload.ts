/**
 * Preload Strategy for Critical Resources
 * 
 * This module handles intelligent preloading of resources to minimize
 * Total Blocking Time (TBT) while ensuring critical functionality loads first.
 */

import { Platform } from 'react-native';

/**
 * Preload critical calculator dependencies after initial render
 * Uses requestIdleCallback to avoid blocking main thread
 */
export function preloadCalculatorDependencies(): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;

  const idleCallback = (window as any).requestIdleCallback || setTimeout;

  idleCallback(() => {
    // Preload heavy calculation utilities
    Promise.all([
      import('@/src/utils/calculateResults'),
      import('@/src/utils/child-support-calculations'),
      import('@/src/utils/complexity-detection'),
    ]).catch(() => {
      // Fail silently - these will load on-demand if preload fails
    });
  });
}

/**
 * Preload PDF export dependencies when user shows intent
 * (e.g., hovering over export button, scrolling to results)
 */
export function preloadPDFDependencies(): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;

  const idleCallback = (window as any).requestIdleCallback || setTimeout;

  idleCallback(() => {
    Promise.all([
      import('expo-print'),
      import('expo-sharing'),
      import('@/src/utils/exportAssessmentPDF'),
    ]).catch(() => {
      // Fail silently - these will load on-demand if preload fails
    });
  });
}

/**
 * Preload form validation and submission dependencies
 * Called when user starts interacting with inquiry form
 */
export function preloadFormDependencies(): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;

  const idleCallback = (window as any).requestIdleCallback || setTimeout;

  idleCallback(() => {
    Promise.all([
      import('@/src/utils/form-validation'),
      import('@/src/utils/submit-lead'),
      import('@/src/utils/supabase/leads'),
    ]).catch(() => {
      // Fail silently
    });
  });
}
