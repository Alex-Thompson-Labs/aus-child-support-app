// Analytics wrapper using react-ga4
// - Web: Google Analytics 4 via react-ga4
// - Mobile (iOS/Android): Logging only (GA4 not supported natively)
//
// Usage in components:
// import { useAnalytics } from '@/src/utils/analytics';
// const analytics = useAnalytics();
// analytics.track('event_name', { property: 'value' });

import ReactGA from 'react-ga4';
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
 * Check if GA4 is initialized (web only)
 */
function isGA4Initialized(): boolean {
  if (!isWeb || typeof window === 'undefined') return false;
  // react-ga4 sets this internally after initialization
  // Adding try-catch significantly improves resilience against blocked scripts
  try {
    return ReactGA.isInitialized;
  } catch (error) {
    return false;
  }
}

/**
 * Initialize Google Analytics 4 safely
 */
export function initializeAnalytics(measurementId: string): void {
  if (!isWeb || typeof window === 'undefined') return;

  try {
    if (!isGA4Initialized()) {
      ReactGA.initialize(measurementId);
      console.log('Analytics initialized');
    }
  } catch (error) {
    console.warn('GA Initialization failed (likely blocked):', error);
  }
}

/**
 * Track event with Google Analytics 4 via react-ga4
 */
function trackWithGA(event: string, properties?: AnalyticsProperties): void {
  try {
    if (isWeb && isGA4Initialized()) {
      ReactGA.event(event, properties || {});
    }
  } catch (error) {
    // Fail silently - analytics shouldn't break the app
    if (__DEV__) {
      console.warn('GA Track Event failed:', error);
    }
  }
}

/**
 * Set user ID with Google Analytics 4
 */
function identifyWithGA(userId: string): void {
  try {
    if (isWeb && isGA4Initialized()) {
      ReactGA.set({ user_id: userId });
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('GA Identify failed:', error);
    }
  }
}

/**
 * Track page view with Google Analytics 4
 */
function screenWithGA(name: string, properties?: AnalyticsProperties): void {
  try {
    if (isWeb && isGA4Initialized()) {
      ReactGA.send({
        hitType: 'pageview',
        page: name,
        ...properties,
      });
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('GA Screen View failed:', error);
    }
  }
}

// Static Analytics object for use without hooks
export const Analytics = {
  initialize: (measurementId: string) => initializeAnalytics(measurementId),

  track: (event: string, properties?: AnalyticsProperties): void => {
    if (__DEV__) {
      console.log('[Analytics] Track event:', event, properties);
    }
    trackWithGA(event, properties);
  },

  identify: (userId: string, traits?: UserTraits): void => {
    if (__DEV__) {
      console.log('[Analytics] Identify user:', userId, traits);
    }
    identifyWithGA(userId);
  },

  screen: (name: string, properties?: AnalyticsProperties): void => {
    if (__DEV__) {
      console.log('[Analytics] Screen view:', name, properties);
    }
    screenWithGA(name, properties);
  },
};

// Hook for use in components
export function useAnalytics() {
  return {
    track: (event: string, properties?: AnalyticsProperties): void => {
      if (__DEV__) {
        console.log('[Analytics] Track event:', event, properties);
      }
      trackWithGA(event, properties);
    },

    identify: (userId: string, traits?: UserTraits): void => {
      if (__DEV__) {
        console.log('[Analytics] Identify user:', userId, traits);
      }
      identifyWithGA(userId);
    },

    screen: (name: string, properties?: AnalyticsProperties): void => {
      if (__DEV__) {
        console.log('[Analytics] Screen view:', name, properties);
      }
      screenWithGA(name, properties);
    },
  };
}

// Events to track (Phase 1):
// - calculation_completed
// - complexity_alert_shown
// - lawyer_button_clicked
// - inquiry_form_opened
// - inquiry_form_submitted
