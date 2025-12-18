// Analytics wrapper for Posthog
// Usage in components:
// import { useAnalytics } from '@/src/utils/analytics';
// const analytics = useAnalytics();
// analytics.track('event_name', { property: 'value' });

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

// Flag to prevent console.warn spam when PostHog not initialized
let hasWarnedNotInitialized = false;

/**
 * Log a warning once when PostHog is not initialized
 */
function warnNotInitialized(): void {
  if (!hasWarnedNotInitialized) {
    console.warn('[Analytics] PostHog not initialized - events will only be logged to console');
    hasWarnedNotInitialized = true;
  }
}

// Static Analytics object for use without hooks (Phase 1)
export const Analytics = {
  track: (event: string, properties?: AnalyticsProperties): void => {
    if (__DEV__) {
      console.log('[Analytics] Track event:', event, properties);
    }
    // TODO: Wire up to PostHog in Phase 2
  },

  identify: (userId: string, traits?: UserTraits): void => {
    if (__DEV__) {
      console.log('[Analytics] Identify user:', userId, traits);
    }
    // TODO: Wire up to PostHog in Phase 2
  },

  screen: (name: string, properties?: AnalyticsProperties): void => {
    if (__DEV__) {
      console.log('[Analytics] Screen view:', name, properties);
    }
    // TODO: Wire up to PostHog in Phase 2
  }
};

// Hook for use in components
export function useAnalytics() {
  const posthog = usePostHog();

  return {
    track: (event: string, properties?: AnalyticsProperties): void => {
      if (__DEV__) {
        console.log('[Analytics] Track event:', event, properties);
        console.log('[Analytics] PostHog instance:', posthog ? 'AVAILABLE' : 'NULL');
      }
      if (posthog) {
        console.log('[Analytics] Calling posthog.capture()...');
        posthog.capture(event, properties);
        // Flush immediately to ensure event is sent (especially important for form submissions)
        posthog.flush();
        console.log('[Analytics] posthog.capture() and flush() called successfully');
      } else {
        warnNotInitialized();
      }
    },

    identify: (userId: string, traits?: UserTraits): void => {
      if (__DEV__) {
        console.log('[Analytics] Identify user:', userId, traits);
      }
      if (posthog) {
        posthog.identify(userId, traits);
      } else {
        warnNotInitialized();
      }
    },

    screen: (name: string, properties?: AnalyticsProperties): void => {
      if (__DEV__) {
        console.log('[Analytics] Screen view:', name, properties);
      }
      if (posthog) {
        posthog.screen(name, properties);
      } else {
        warnNotInitialized();
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