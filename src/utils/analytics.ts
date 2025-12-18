// Analytics wrapper for Posthog
// Usage in components:
// import { useAnalytics } from '@/src/utils/analytics';
// const analytics = useAnalytics();
// analytics.track('event_name', { property: 'value' });

import { usePostHog } from 'posthog-react-native';

// Hook for use in components
export function useAnalytics() {
  const posthog = usePostHog();

  return {
    track: (event: string, properties?: Record<string, any>) => {
      console.log('[Analytics] Track event:', event, properties);
      if (posthog) {
        posthog.capture(event, properties);
      } else {
        console.warn('[Analytics] PostHog not initialized');
      }
    },

    identify: (userId: string, traits?: Record<string, any>) => {
      console.log('[Analytics] Identify user:', userId, traits);
      if (posthog) {
        posthog.identify(userId, traits);
      } else {
        console.warn('[Analytics] PostHog not initialized');
      }
    },

    screen: (name: string, properties?: Record<string, any>) => {
      console.log('[Analytics] Screen view:', name, properties);
      if (posthog) {
        posthog.screen(name, properties);
      } else {
        console.warn('[Analytics] PostHog not initialized');
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