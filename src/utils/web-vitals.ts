/**
 * Web Vitals Performance Monitoring
 *
 * Tracks Core Web Vitals metrics and sends them to Google Analytics
 * Web only - no-op on mobile platforms
 */

import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

/**
 * Core Web Vitals metrics
 */
export interface WebVitals {
  /** Largest Contentful Paint (LCP) - Loading performance */
  lcp: number | null;
  /** First Input Delay (FID) - Interactivity */
  fid: number | null;
  /** Cumulative Layout Shift (CLS) - Visual stability */
  cls: number | null;
  /** First Contentful Paint (FCP) - Loading performance */
  fcp: number | null;
  /** Time to First Byte (TTFB) - Server response time */
  ttfb: number | null;
}

/**
 * Good, Needs Improvement, Poor thresholds
 * Based on Web Vitals recommendations
 */
export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // ms
  FID: { good: 100, poor: 300 },   // ms
  CLS: { good: 0.1, poor: 0.25 },  // score
  FCP: { good: 1800, poor: 3000 }, // ms
  TTFB: { good: 800, poor: 1800 }, // ms
} as const;

/**
 * Get rating for a metric value
 */
function getRating(
  value: number,
  thresholds: { good: number; poor: number }
): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Track Core Web Vitals (web only)
 *
 * @param onReport Callback function called when metrics are reported
 */
export function trackWebVitals(onReport: (vitals: Partial<WebVitals>) => void) {
  if (!isWeb || typeof window === 'undefined') {
    return;
  }

  // Dynamic import to avoid bundling on mobile
  import('web-vitals')
    .then(({ onLCP, onFID, onCLS, onFCP, onTTFB }) => {
      onLCP((metric) => {
        onReport({ lcp: metric.value });
      });

      onFID((metric) => {
        onReport({ fid: metric.value });
      });

      onCLS((metric) => {
        onReport({ cls: metric.value });
      });

      onFCP((metric) => {
        onReport({ fcp: metric.value });
      });

      onTTFB((metric) => {
        onReport({ ttfb: metric.value });
      });
    })
    .catch((error) => {
      console.warn('[Web Vitals] Library not available:', error);
    });
}

/**
 * Log Web Vitals to console (dev mode only)
 */
export function logWebVitals() {
  if (!__DEV__ || !isWeb) {
    return;
  }

  const vitals: Partial<WebVitals> = {};

  trackWebVitals((newVitals) => {
    Object.assign(vitals, newVitals);

    console.log('[Web Vitals]', {
      LCP: vitals.lcp
        ? `${vitals.lcp.toFixed(0)}ms (${getRating(vitals.lcp, WEB_VITALS_THRESHOLDS.LCP)})`
        : 'N/A',
      FID: vitals.fid
        ? `${vitals.fid.toFixed(0)}ms (${getRating(vitals.fid, WEB_VITALS_THRESHOLDS.FID)})`
        : 'N/A',
      CLS: vitals.cls
        ? `${vitals.cls.toFixed(3)} (${getRating(vitals.cls, WEB_VITALS_THRESHOLDS.CLS)})`
        : 'N/A',
      FCP: vitals.fcp
        ? `${vitals.fcp.toFixed(0)}ms (${getRating(vitals.fcp, WEB_VITALS_THRESHOLDS.FCP)})`
        : 'N/A',
      TTFB: vitals.ttfb
        ? `${vitals.ttfb.toFixed(0)}ms (${getRating(vitals.ttfb, WEB_VITALS_THRESHOLDS.TTFB)})`
        : 'N/A',
    });
  });
}

/**
 * Send Web Vitals to Google Analytics
 *
 * Requires Google Analytics (gtag.js) to be loaded
 */
export function sendWebVitalsToGA() {
  if (!isWeb) {
    return;
  }

  trackWebVitals((vitals) => {
    if (typeof window === 'undefined' || !('gtag' in window)) {
      return;
    }

    const gtag = (window as any).gtag;

    if (vitals.lcp !== undefined && vitals.lcp !== null) {
      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: 'LCP',
        value: Math.round(vitals.lcp),
        metric_rating: getRating(vitals.lcp, WEB_VITALS_THRESHOLDS.LCP),
        non_interaction: true,
      });
    }

    if (vitals.fid !== undefined && vitals.fid !== null) {
      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: 'FID',
        value: Math.round(vitals.fid),
        metric_rating: getRating(vitals.fid, WEB_VITALS_THRESHOLDS.FID),
        non_interaction: true,
      });
    }

    if (vitals.cls !== undefined && vitals.cls !== null) {
      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: 'CLS',
        value: Math.round(vitals.cls * 1000), // Convert to integer
        metric_rating: getRating(vitals.cls, WEB_VITALS_THRESHOLDS.CLS),
        non_interaction: true,
      });
    }

    if (vitals.fcp !== undefined && vitals.fcp !== null) {
      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: 'FCP',
        value: Math.round(vitals.fcp),
        metric_rating: getRating(vitals.fcp, WEB_VITALS_THRESHOLDS.FCP),
        non_interaction: true,
      });
    }

    if (vitals.ttfb !== undefined && vitals.ttfb !== null) {
      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: 'TTFB',
        value: Math.round(vitals.ttfb),
        metric_rating: getRating(vitals.ttfb, WEB_VITALS_THRESHOLDS.TTFB),
        non_interaction: true,
      });
    }
  });
}

/**
 * Get performance timing from Navigation Timing API
 */
export function getNavigationTiming() {
  if (!isWeb || typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const timing = window.performance.timing;
  const navigation = window.performance.navigation;

  return {
    // Navigation type
    navigationType: navigation.type, // 0=navigate, 1=reload, 2=back/forward

    // Key timings (in ms relative to navigationStart)
    domainLookup: timing.domainLookupEnd - timing.domainLookupStart,
    tcpConnection: timing.connectEnd - timing.connectStart,
    serverResponse: timing.responseEnd - timing.requestStart,
    domProcessing: timing.domComplete - timing.domLoading,
    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
    pageLoad: timing.loadEventEnd - timing.navigationStart,

    // Total time
    totalTime: timing.loadEventEnd - timing.fetchStart,
  };
}

/**
 * Log navigation timing to console (dev mode only)
 */
export function logNavigationTiming() {
  if (!__DEV__ || !isWeb) {
    return;
  }

  const timing = getNavigationTiming();
  if (timing) {
    console.log('[Performance Timing]', {
      'Domain Lookup': `${timing.domainLookup}ms`,
      'TCP Connection': `${timing.tcpConnection}ms`,
      'Server Response': `${timing.serverResponse}ms`,
      'DOM Processing': `${timing.domProcessing}ms`,
      'DOM Content Loaded': `${timing.domContentLoaded}ms`,
      'Page Load': `${timing.pageLoad}ms`,
      'Total Time': `${timing.totalTime}ms`,
    });
  }
}

/**
 * Get memory usage (Chrome only)
 */
export function getMemoryUsage() {
  if (!isWeb || typeof window === 'undefined') {
    return null;
  }

  const performance = (window.performance as any);
  if (!performance.memory) {
    return null;
  }

  return {
    usedJSHeapSize: performance.memory.usedJSHeapSize,
    totalJSHeapSize: performance.memory.totalJSHeapSize,
    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
    // Percentage of heap used
    heapUsagePercent: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100,
  };
}

/**
 * Log memory usage to console (dev mode, Chrome only)
 */
export function logMemoryUsage() {
  if (!__DEV__ || !isWeb) {
    return;
  }

  const memory = getMemoryUsage();
  if (memory) {
    console.log('[Memory Usage]', {
      'Used Heap': `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      'Total Heap': `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      'Heap Limit': `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
      'Usage': `${memory.heapUsagePercent.toFixed(1)}%`,
    });
  }
}

/**
 * Initialize all performance monitoring (call in root layout)
 */
export function initPerformanceMonitoring() {
  if (!isWeb) {
    return;
  }

  // Log in dev mode
  if (__DEV__) {
    logWebVitals();
    logNavigationTiming();
    logMemoryUsage();
  }

  // Send to GA in production
  if (!__DEV__) {
    sendWebVitalsToGA();
  }
}
