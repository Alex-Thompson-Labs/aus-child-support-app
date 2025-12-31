# Web Performance Optimization Guide

## Current State Analysis

**Build Output (Initial):**

- Main bundle: **4.8 MB** 🔴
- Static routes: 11 pages
- Build time: ~1.8s

**Lighthouse Score Target:** 90+ (Performance, Accessibility, Best Practices, SEO)

---

## Bundle Size Analysis

### What's in the 4.8 MB Bundle?

**Large Dependencies (Estimated):**

1. **React Native Web** (~1.2 MB) - Core framework
2. **Expo Router** (~300 KB) - Navigation
3. **Supabase Client** (~500 KB) - Database
4. **PostHog** (~400 KB) - Analytics (shouldn't be loaded on web!)
5. **React Native Reanimated** (~600 KB) - Animations
6. **Lucide Icons** (~200 KB) - Icons
7. **Application Code** (~1.6 MB) - Our code + other deps

### Quick Wins

1. ✅ **PostHog already disabled on web** (see `app/_layout.tsx`)
2. 🎯 **Lazy load admin routes** (only load when needed)
3. 🎯 **Code split inquiry form** (load on demand)
4. 🎯 **Optimize images** (compress, use WebP)
5. 🎯 **Tree-shake unused code**

---

## Performance Optimizations

### 1. Code Splitting & Lazy Loading

**Lazy Load Admin Routes:**

Create `src/components/LazyAdmin.tsx`:

```tsx
import { lazy, Suspense } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Lazy load admin components
const AdminDashboard = lazy(() => import('@/app/admin/dashboard'));
const AdminLogin = lazy(() => import('@/app/admin/login'));

function LoadingFallback() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}

export function LazyAdminDashboard(props: any) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminDashboard {...props} />
    </Suspense>
  );
}

export function LazyAdminLogin(props: any) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminLogin {...props} />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
});
```

**Lazy Load Inquiry Form:**

Create `src/components/LazyInquiryForm.tsx`:

```tsx
import { lazy, Suspense } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const LawyerInquiryScreen = lazy(
  () => import('@/src/screens/LawyerInquiryScreen')
);

function LoadingFallback() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}

export function LazyLawyerInquiry(props: any) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LawyerInquiryScreen {...props} />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
});
```

**Expected Savings:** ~500 KB (admin + inquiry form not loaded on homepage)

---

### 2. Image Optimization

**Current Issue:** Large PNG assets

**Solutions:**

1. **Compress existing images:**

```bash
# Install imagemin CLI
npm install -g imagemin-cli imagemin-pngquant imagemin-mozjpeg

# Compress PNGs
imagemin assets/images/*.png --out-dir=assets/images/optimized --plugin=pngquant

# Compress JPGs
imagemin assets/images/*.jpg --out-dir=assets/images/optimized --plugin=mozjpeg
```

2. **Use WebP format** (50% smaller than PNG):

```bash
# Convert to WebP
npx @squoosh/cli --webp auto assets/images/*.png -d assets/images/webp/
```

3. **Lazy load images:**

```tsx
import { Image } from 'expo-image';

// Use expo-image (already installed) for better performance
<Image
  source={require('@/assets/images/logo.png')}
  style={styles.logo}
  contentFit="contain"
  transition={200}
  placeholder={blurhash} // Optional: show blur while loading
/>;
```

**Expected Savings:** ~200-400 KB

---

### 3. Font Optimization

**Use system fonts on web** (0 KB download):

Update `app/_layout.tsx`:

```tsx
import { Platform } from 'react-native';

// Only load custom fonts on mobile
const customFonts =
  Platform.OS !== 'web'
    ? {
        // Your custom fonts here
      }
    : {};

export default function RootLayout() {
  // Skip font loading on web
  if (Platform.OS === 'web') {
    return <RootContent />;
  }

  // Mobile: load custom fonts
  const [fontsLoaded] = useFonts(customFonts);

  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  return <RootContent />;
}
```

Update global styles:

```css
/* In app/+html.tsx or global CSS */
body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Helvetica Neue', sans-serif;
}
```

**Expected Savings:** ~100-300 KB

---

### 4. Tree-Shaking & Dead Code Elimination

**Optimize imports** (import only what you need):

**Bad:**

```tsx
import * as Icons from 'lucide-react-native'; // Imports ALL icons
```

**Good:**

```tsx
import { Calculator, AlertCircle, HelpCircle } from 'lucide-react-native'; // Only imports 3
```

**Audit current imports:**

```bash
# Find wildcard imports
grep -r "import \* as" src/
```

**Expected Savings:** ~100-200 KB

---

### 5. Compression & Caching

**Add `netlify.toml` for production optimizations:**

Create `/Users/sammcdougal/d/csc/netlify.toml`:

```toml
[build]
  publish = "dist"
  command = "npm run build:web"

# Enable Brotli compression (better than gzip)
[[headers]]
  for = "/*"
  [headers.values]
    # Enable compression
    Content-Encoding = "br"

    # Cache static assets for 1 year
    Cache-Control = "public, max-age=31536000, immutable"

# Cache HTML for shorter time (1 hour)
[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600, must-revalidate"

# Cache service worker
[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"

# Redirect HTTP to HTTPS
[[redirects]]
  from = "http://auschildsupport.com/*"
  to = "https://auschildsupport.com/:splat"
  status = 301
  force = true

# Redirect www to non-www
[[redirects]]
  from = "https://www.auschildsupport.com/*"
  to = "https://auschildsupport.com/:splat"
  status = 301
  force = true
```

**Expected Savings:** 60-70% file size reduction via Brotli compression

---

### 6. React Performance Optimizations

**Memoize expensive calculations:**

Update `src/hooks/useCalculator.ts`:

```tsx
import { useMemo, useCallback } from 'react';

export function useCalculator() {
  // ... existing code

  // Memoize calculation results
  const memoizedResults = useMemo(() => {
    if (!isCalculated) return null;
    return calculateChildSupport(/* params */);
  }, [incomeA, incomeB, childrenData, relDepA, relDepB, isCalculated]);

  // Memoize callbacks
  const handleCalculate = useCallback(() => {
    setIsCalculated(true);
  }, []);

  const handleReset = useCallback(() => {
    // Reset logic
  }, []);

  return {
    // ... other values
    results: memoizedResults,
    onCalculate: handleCalculate,
    onReset: handleReset,
  };
}
```

**Memoize components:**

```tsx
import { memo } from 'react';

// Wrap components that don't need frequent re-renders
export const ChildRow = memo(function ChildRow({ child, onUpdate, onRemove }) {
  // ... component code
});

export const CalculatorResults = memo(function CalculatorResults({ results }) {
  // ... component code
});
```

**Expected Impact:** Faster re-renders, smoother interactions

---

### 7. Service Worker for Offline Support

**Create `public/sw.js`:**

```javascript
const CACHE_NAME = 'cs-calc-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.js',
  '/static/css/main.css',
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch from cache first, network fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

**Register in `app/+html.tsx`:**

```tsx
{
  isWeb && (
    <script
      dangerouslySetInnerHTML={{
        __html: `
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
              .then(() => console.log('SW registered'))
              .catch(() => console.log('SW registration failed'));
          });
        }
      `,
      }}
    />
  );
}
```

**Expected Impact:** Instant repeat visits, offline support

---

## Performance Monitoring

### 1. Web Vitals Tracking

Create `src/utils/web-vitals.ts`:

```typescript
import { Platform } from 'react-native';

/**
 * Core Web Vitals metrics
 */
export interface WebVitals {
  // Largest Contentful Paint (LCP)
  lcp: number | null;
  // First Input Delay (FID)
  fid: number | null;
  // Cumulative Layout Shift (CLS)
  cls: number | null;
  // First Contentful Paint (FCP)
  fcp: number | null;
  // Time to First Byte (TTFB)
  ttfb: number | null;
}

/**
 * Track Core Web Vitals (web only)
 */
export function trackWebVitals(onReport: (vitals: WebVitals) => void) {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return;
  }

  const vitals: WebVitals = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
  };

  // Use web-vitals library if available
  import('web-vitals')
    .then(({ onLCP, onFID, onCLS, onFCP, onTTFB }) => {
      onLCP((metric) => {
        vitals.lcp = metric.value;
        onReport({ ...vitals });
      });

      onFID((metric) => {
        vitals.fid = metric.value;
        onReport({ ...vitals });
      });

      onCLS((metric) => {
        vitals.cls = metric.value;
        onReport({ ...vitals });
      });

      onFCP((metric) => {
        vitals.fcp = metric.value;
        onReport({ ...vitals });
      });

      onTTFB((metric) => {
        vitals.ttfb = metric.value;
        onReport({ ...vitals });
      });
    })
    .catch(() => {
      console.warn('[Web Vitals] Library not available');
    });
}

/**
 * Log Web Vitals to console (dev mode)
 */
export function logWebVitals() {
  if (__DEV__) {
    trackWebVitals((vitals) => {
      console.log('[Web Vitals]', {
        LCP: vitals.lcp ? `${vitals.lcp.toFixed(0)}ms` : 'N/A',
        FID: vitals.fid ? `${vitals.fid.toFixed(0)}ms` : 'N/A',
        CLS: vitals.cls ? vitals.cls.toFixed(3) : 'N/A',
        FCP: vitals.fcp ? `${vitals.fcp.toFixed(0)}ms` : 'N/A',
        TTFB: vitals.ttfb ? `${vitals.ttfb.toFixed(0)}ms` : 'N/A',
      });
    });
  }
}

/**
 * Send Web Vitals to Google Analytics
 */
export function sendWebVitalsToGA() {
  trackWebVitals((vitals) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as any).gtag;

      if (vitals.lcp) {
        gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'LCP',
          value: Math.round(vitals.lcp),
          non_interaction: true,
        });
      }

      if (vitals.fid) {
        gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'FID',
          value: Math.round(vitals.fid),
          non_interaction: true,
        });
      }

      if (vitals.cls) {
        gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'CLS',
          value: Math.round(vitals.cls * 1000),
          non_interaction: true,
        });
      }
    }
  });
}
```

**Install web-vitals:**

```bash
npm install web-vitals
```

**Use in `app/_layout.tsx`:**

```tsx
import { logWebVitals, sendWebVitalsToGA } from '@/src/utils/web-vitals';

export default function RootLayout() {
  useEffect(() => {
    // Track Web Vitals
    logWebVitals();
    sendWebVitalsToGA();
  }, []);

  // ... rest of layout
}
```

---

### 2. Bundle Size Tracking

Add to `package.json`:

```json
{
  "scripts": {
    "build:web": "expo export --platform web",
    "build:analyze": "expo export --platform web && npm run analyze-bundle",
    "analyze-bundle": "npx source-map-explorer 'dist/_expo/static/js/**/*.js'"
  },
  "devDependencies": {
    "source-map-explorer": "^2.5.3"
  }
}
```

**Run bundle analysis:**

```bash
npm run build:analyze
```

This will show you:

- Which dependencies are taking up the most space
- Opportunities for tree-shaking
- Duplicate code across chunks

---

## Lighthouse Testing

### Run Lighthouse Audit

**Option 1: Chrome DevTools (GUI)**

1. Build web app: `npm run build:web`
2. Serve locally: `npx serve dist -p 8080`
3. Open in Chrome: `http://localhost:8080`
4. Open DevTools (F12) → Lighthouse tab
5. Select all categories
6. Click "Analyze page load"

**Option 2: Lighthouse CLI (Automated)**

```bash
# Install Lighthouse
npm install -g lighthouse

# Build and serve
npm run build:web
npx serve dist -p 8080 &

# Run audit
lighthouse http://localhost:8080 \
  --view \
  --output html \
  --output-path ./lighthouse-report.html

# Kill server
killall serve
```

**Option 3: PageSpeed Insights (Production)**
https://pagespeed.web.dev/

- Test live site: `auschildsupport.com`
- Get mobile + desktop scores
- See real-world performance data

---

### Target Scores

**Minimum (Launch):**

- Performance: **80+** 🟡
- Accessibility: **95+** 🟢
- Best Practices: **90+** 🟢
- SEO: **95+** 🟢

**Ideal (Post-Optimization):**

- Performance: **90+** 🟢
- Accessibility: **100** 🟢
- Best Practices: **100** 🟢
- SEO: **100** 🟢

---

## Performance Checklist

### Pre-Launch (Critical)

- [ ] Bundle size < 2 MB (currently 4.8 MB)
- [ ] Lighthouse Performance > 80
- [ ] Lighthouse Accessibility > 95
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3.5s
- [ ] No console errors in production
- [ ] All images optimized/compressed
- [ ] Lazy loading implemented
- [ ] Caching headers configured
- [ ] HTTPS enabled
- [ ] Compression enabled (Brotli/gzip)

### Post-Launch (Optimization)

- [ ] Service worker implemented
- [ ] Offline support working
- [ ] Code splitting for admin routes
- [ ] React.memo applied to heavy components
- [ ] Web Vitals tracking active
- [ ] Bundle analysis completed
- [ ] Performance monitoring dashboard
- [ ] CDN configured (optional)

---

## Quick Wins Summary

| Optimization        | Effort | Impact | Savings          |
| ------------------- | ------ | ------ | ---------------- |
| Compress images     | Low    | High   | 200-400 KB       |
| System fonts on web | Low    | Medium | 100-300 KB       |
| Lazy load admin     | Medium | High   | 400-500 KB       |
| Optimize imports    | Low    | Medium | 100-200 KB       |
| Netlify compression | Low    | High   | 60-70% reduction |
| React.memo          | Medium | Medium | Better UX        |
| Service worker      | High   | Medium | Offline support  |

**Total Potential Savings:** ~1-1.5 MB + 60-70% compression = **Final bundle ~1-1.5 MB**

---

## Monitoring & Maintenance

### Weekly Checks

- Monitor Lighthouse scores
- Check Core Web Vitals in Google Analytics
- Review bundle size trends

### Monthly Audits

- Run full Lighthouse audit
- Check for dependency updates
- Review user performance metrics
- Optimize newly added features

### Tools

- Lighthouse CI for automated testing
- Bundle analyzer for size tracking
- Google Analytics for real user metrics
- Sentry for error tracking (optional)

---

## Resources

### Documentation

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [React Performance](https://react.dev/learn/render-and-commit#optimizing-performance)
- [Expo Web Performance](https://docs.expo.dev/guides/web-performance/)

### Tools

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [Bundle Analyzer](https://www.npmjs.com/package/source-map-explorer)
- [ImageOptim](https://imageoptim.com/) - Image compression

---

## Next Steps

1. ✅ Implement quick wins (images, fonts, lazy loading)
2. ✅ Add performance monitoring
3. ✅ Run Lighthouse audit
4. ✅ Fix critical issues
5. ✅ Re-test and document results
6. ✅ Set up automated monitoring

**Target Timeline:** 1-2 weeks for full optimization
