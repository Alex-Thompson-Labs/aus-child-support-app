// Analytics wrapper
// - Web: Google Analytics (gtag.js)
// - Mobile (iOS/Android): PostHog
//
// Usage in components:
// import { useAnalytics } from '@/src/utils/analytics';
// const analytics = useAnalytics();
// analytics.track('event_name', { property: 'value' });

import { Platform } from 'react-native';
import { usePostHog } from 'posthog-react-native';

/**
 * Type for analytics event properties
 * Allows string, number, boolean, or null values (matches PostHog's JsonType)
 */
export type AnalyticsPropertyValue = string | number | boolean | null;
export type AnalyticsProperties = Record<string, AnalyticsPropertyValue>;

/**
 * Type for user traits used in identify calls
 */
export type UserTraits = Record<string, AnalyticsPropertyValue>;

// Flag to prevent console.warn spam when analytics not initialized
let hasWarnedNotInitialized = false;

/**
 * Log a warning once when analytics is not initialized
 */
function warnNotInitialized(): void {
  if (!hasWarnedNotInitialized) {
    console.warn('[Analytics] Not initialized - events will only be logged to console');
    hasWarnedNotInitialized = true;
  }
}

// Check if we're on web platform
const isWeb = Platform.OS === 'web';

/**
 * Get the gtag function for Google Analytics (web only)
 */
function getGtag(): ((...args: unknown[]) => void) | null {
  if (isWeb && typeof window !== 'undefined' && 'gtag' in window) {
    return (window as unknown as { gtag: (...args: unknown[]) => void }).gtag;
  }
  return null;
}

/**
 * Track event with Google Analytics
 */
function trackWithGA(event: string, properties?: AnalyticsProperties): void {
  const gtag = getGtag();
  if (gtag) {
    gtag('event', event, properties || {});
  } else {
    warnNotInitialized();
  }
}

/**
 * Set user ID with Google Analytics
 */
function identifyWithGA(userId: string): void {
  const gtag = getGtag();
  if (gtag) {
    gtag('set', { user_id: userId });
  }
}

/**
 * Track page view with Google Analytics
 */
function screenWithGA(name: string, properties?: AnalyticsProperties): void {
  const gtag = getGtag();
  if (gtag) {
    gtag('event', 'page_view', {
      page_title: name,
      ...properties,
    });
  }
}

// Static Analytics object for use without hooks
export const Analytics = {
  track: (event: string, properties?: AnalyticsProperties): void => {
    if (__DEV__) {
      console.log('[Analytics] Track event:', event, properties);
    }
    if (isWeb) {
      trackWithGA(event, properties);
    }
    // Mobile: PostHog handled via useAnalytics hook
  },

  identify: (userId: string, traits?: UserTraits): void => {
    if (__DEV__) {
      console.log('[Analytics] Identify user:', userId, traits);
    }
    if (isWeb) {
      identifyWithGA(userId);
    }
    // Mobile: PostHog handled via useAnalytics hook
  },

  screen: (name: string, properties?: AnalyticsProperties): void => {
    if (__DEV__) {
      console.log('[Analytics] Screen view:', name, properties);
    }
    if (isWeb) {
      screenWithGA(name, properties);
    }
    // Mobile: PostHog handled via useAnalytics hook
  }
};

// Hook for use in components
export function useAnalytics() {
  const posthog = usePostHog();

  return {
    track: (event: string, properties?: AnalyticsProperties): void => {
      if (__DEV__) {
        console.log('[Analytics] Track event:', event, properties);
      }

      if (isWeb) {
        // Web: Use Google Analytics
        trackWithGA(event, properties);
      } else {
        // Mobile: Use PostHog
        if (posthog) {
          posthog.capture(event, properties);
          posthog.flush();
        } else {
          warnNotInitialized();
        }
      }
    },

    identify: (userId: string, traits?: UserTraits): void => {
      if (__DEV__) {
        console.log('[Analytics] Identify user:', userId, traits);
      }

      if (isWeb) {
        identifyWithGA(userId);
      } else {
        if (posthog) {
          posthog.identify(userId, traits);
        } else {
          warnNotInitialized();
        }
      }
    },

    screen: (name: string, properties?: AnalyticsProperties): void => {
      if (__DEV__) {
        console.log('[Analytics] Screen view:', name, properties);
      }

      if (isWeb) {
        screenWithGA(name, properties);
      } else {
        if (posthog) {
          posthog.screen(name, properties);
        } else {
          warnNotInitialized();
        }
      }
    }
  };
}

// Events to track (Phase 1):
// - calculation_completed
// - complexity_alert_shown
// - lawyer_button_clicked
// - inquiry_form_opened
// - inquiry_form_submitted