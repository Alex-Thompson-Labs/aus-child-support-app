// Analytics wrapper using react-ga4 (lazy loaded)
// - Web: Google Analytics 4 via react-ga4 (loaded on-demand)
// - Mobile (iOS/Android): Logging only (GA4 not supported natively)
//
// Usage in components:
// import { useAnalytics } from '@/src/utils/analytics';
// const analytics = useAnalytics();
// analytics.track('event_name', { property: 'value' });

import { Platform } from 'react-native';

/**
 * Type for analytics event properties
 * Allows string, number, boolean, or null values
 */
export type AnalyticsPropertyValue = string | number | boolean | null;
export type AnalyticsProperties = Record<string, AnalyticsPropertyValue>;

/**
 * Type for user traits used in identify calls
 */
export type UserTraits = Record<string, AnalyticsPropertyValue>;

// Check if we're on web platform
const isWeb = Platform.OS === 'web';

/**
 * Module-level cache for react-ga4 module
 * Lazy loaded on first use to avoid blocking initial render
 */
let ReactGA: typeof import('react-ga4').default | null = null;

/**
 * Module-level cache for initialization state
 * Once GA4 is initialized successfully, we cache this to avoid
 * repeated checks to ReactGA.isInitialized (which may involve
 * native bridge calls or configuration validation)
 */
let isInitialized = false;

/**
 * Lazy load react-ga4 module
 * Returns the module or null if loading fails (e.g., blocked by ad blocker)
 */
async function loadGA4(): Promise<typeof import('react-ga4').default | null> {
  // Return cached module if already loaded
  if (ReactGA) return ReactGA;
  
  if (!isWeb || typeof window === 'undefined') return null;
  
  try {
    const module = await import('react-ga4');
    ReactGA = module.default;
    return ReactGA;
  } catch (error) {
    // Failed to load react-ga4 - likely blocked by ad blocker or network error
    console.warn('Failed to load react-ga4:', error);
    return null;
  }
}

/**
 * Check if GA4 is initialized (web only)
 * Uses cached state after first successful initialization to avoid
 * repeated native bridge checks or configuration validation
 */
function isGA4Initialized(): boolean {
  // Fast path: Return cached state if already initialized
  if (isInitialized) return true;
  
  if (!isWeb || typeof window === 'undefined' || !ReactGA) return false;
  
  // react-ga4 sets this internally after initialization
  // Adding try-catch significantly improves resilience against blocked scripts
  try {
    const initialized = ReactGA.isInitialized;
    // Cache the positive result to avoid future checks
    if (initialized) {
      isInitialized = true;
    }
    return initialized;
  } catch {
    return false;
  }
}

/**
 * Initialize Google Analytics 4 safely (async)
 * Lazy loads react-ga4 module and sets the module-level cache after successful initialization
 */
export async function initializeAnalytics(measurementId: string): Promise<void> {
  if (!isWeb || typeof window === 'undefined') return;

  try {
    // Lazy load react-ga4 module
    const GA = await loadGA4();
    
    if (GA && !isGA4Initialized()) {
      GA.initialize(measurementId);
      // Set cache flag after successful initialization
      isInitialized = true;
    }
  } catch (error) {
    // Analytics initialization failed - likely blocked by ad blocker
    console.warn('Analytics initialization failed:', error);
  }
}

/**
 * Track event with Google Analytics 4 via react-ga4 (async)
 */
async function trackWithGA(event: string, properties?: AnalyticsProperties): Promise<void> {
  try {
    if (isWeb) {
      const GA = await loadGA4();
      if (GA && isGA4Initialized()) {
        GA.event(event, properties || {});
      }
    }
  } catch (error) {
    // Fail silently - analytics shouldn't break the app
  }
}

/**
 * Set user ID with Google Analytics 4 (async)
 */
async function identifyWithGA(userId: string): Promise<void> {
  try {
    if (isWeb) {
      const GA = await loadGA4();
      if (GA && isGA4Initialized()) {
        GA.set({ user_id: userId });
      }
    }
  } catch (error) {
    // Fail silently - analytics shouldn't break the app
  }
}

/**
 * Track page view with Google Analytics 4 (async)
 */
async function screenWithGA(name: string, properties?: AnalyticsProperties): Promise<void> {
  try {
    if (isWeb) {
      const GA = await loadGA4();
      if (GA && isGA4Initialized()) {
        GA.send({
          hitType: 'pageview',
          page: name,
          ...properties,
        });
      }
    }
  } catch (error) {
    // Fail silently - analytics shouldn't break the app
  }
}

// Static Analytics object for use without hooks
export const Analytics = {
  initialize: (measurementId: string) => {
    // Defer initialization until after initial render using requestIdleCallback
    // with a MINIMUM delay of 2 seconds to ensure analytics don't block initial render
    if (typeof window !== 'undefined') {
      // Use setTimeout to enforce minimum 2-second delay
      setTimeout(() => {
        if ('requestIdleCallback' in window) {
          // Then wait for browser to be idle before initializing
          window.requestIdleCallback(() => {
            initializeAnalytics(measurementId);
          });
        } else {
          // Fallback: just initialize after the timeout
          initializeAnalytics(measurementId);
        }
      }, 2000);
    }
  },

  track: async (event: string, properties?: AnalyticsProperties): Promise<void> => {
    await trackWithGA(event, properties);
  },

  identify: async (userId: string, traits?: UserTraits): Promise<void> => {
    await identifyWithGA(userId);
  },

  screen: async (name: string, properties?: AnalyticsProperties): Promise<void> => {
    await screenWithGA(name, properties);
  },
};

// Hook for use in components
export function useAnalytics() {
  return {
    track: async (event: string, properties?: AnalyticsProperties): Promise<void> => {
      await trackWithGA(event, properties);
    },

    identify: async (userId: string, traits?: UserTraits): Promise<void> => {
      await identifyWithGA(userId);
    },

    screen: async (name: string, properties?: AnalyticsProperties): Promise<void> => {
      await screenWithGA(name, properties);
    },
  };
}

// Events to track (Phase 1):
// - calculation_completed
// - complexity_alert_shown
// - lawyer_button_clicked
// - inquiry_form_opened
// - inquiry_form_submitted
