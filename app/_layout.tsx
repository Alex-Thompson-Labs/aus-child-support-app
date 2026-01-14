import { SemanticColors } from '@/constants/theme';
import { LoadingFallback } from '@/src/components/ui/LoadingFallback';
import { useClientOnly } from '@/src/hooks/useClientOnly';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname } from 'expo-router';
import Head from 'expo-router/head';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useCallback, useEffect } from 'react';
import { Platform, View } from 'react-native';

// Keep the splash screen visible while we fetch resources
// Wrap in try-catch to prevent crashes on web static export
if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => {
    // Ignore errors - splash screen may not be available
  });
}

export const unstable_settings = {
  anchor: '(tabs)',
};

// Lazy load analytics to reduce initial bundle
let analyticsInitialized = false;

function initAnalyticsDeferred() {
  if (analyticsInitialized || Platform.OS !== 'web' || typeof window === 'undefined') {
    return;
  }
  
  const enableAnalytics = process.env.EXPO_PUBLIC_ENABLE_ANALYTICS !== 'false';
  if (!enableAnalytics) return;

  const gaMeasurementId = process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID || 'G-53139BKGD7';

  // Use requestIdleCallback for lowest priority loading
  const requestIdleCallbackPolyfill =
    window.requestIdleCallback ||
    function (cb: IdleRequestCallback) {
      return setTimeout(cb, 1);
    };

  requestIdleCallbackPolyfill(
    async () => {
      try {
        // Dynamic import to avoid blocking initial load
        const [{ initializeAnalytics }, ReactGA] = await Promise.all([
          import('@/src/utils/analytics'),
          import('react-ga4'),
        ]);
        
        initializeAnalytics(gaMeasurementId);
        ReactGA.default.send({
          hitType: 'pageview',
          page: window.location.pathname,
        });
        analyticsInitialized = true;
        console.log('Analytics initialized (deferred)');
      } catch (error) {
        console.error('GA Deferred Loading failed:', error);
      }
    },
    { timeout: 5000 } as any
  );
}

export default function RootLayout() {
  const isClient = useClientOnly();
  const pathname = usePathname();
  // Force light mode
  const colors = SemanticColors.light;

  // Callback to hide splash screen once the root view has performed layout
  const onLayoutRootView = useCallback(async () => {
    if (Platform.OS !== 'web') {
      // Hide the splash screen once the app has rendered (native only)
      try {
        await SplashScreen.hideAsync();
      } catch {
        // Ignore errors - splash screen may not be available
      }
    }
  }, []);

  // SEO: Generate Canonical URL (Strip query params and trailing slashes)
  const siteUrl =
    process.env.EXPO_PUBLIC_SITE_URL || 'https://auschildsupport.com';
  // Handle root path and normalize trailing slashes (vercel.json has trailingSlash: false)
  const normalizedPath = pathname === '/' ? '' : pathname.replace(/\/$/, '');
  const canonicalUrl = `${siteUrl}${normalizedPath}`;

  useEffect(() => {
    // Only run on web client where window is available
    if (Platform.OS === 'web' && isClient && typeof window !== 'undefined') {
      // FIX: Set document title for Accessibility score
      document.title = 'Child Support Calculator';

      // OPTIMIZATION: Defer Analytics to improve LCP
      initAnalyticsDeferred();
    }
  }, [isClient]);

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.background }}
      onLayout={onLayoutRootView}
    >
      <Suspense fallback={<LoadingFallback />}>
        {/* SEO: Dynamic Canonical Tag via Expo Head */}
        <Head>
          <link rel="canonical" href={canonicalUrl} />
        </Head>

        <ThemeProvider value={DefaultTheme}>
          <Stack
            screenOptions={{
              title: 'Child Support Calculator',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: 'modal', title: 'Modal' }}
            />
            <Stack.Screen
              name="special-circumstances"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="about" options={{ headerShown: false }} />
            <Stack.Screen name="contact" options={{ headerShown: false }} />
            <Stack.Screen name="faq" options={{ headerShown: false }} />
            <Stack.Screen name="court-order-tool" options={{ headerShown: false, drawerItemStyle: { display: 'none' } } as any} />
            <Stack.Screen
              name="lawyer-inquiry"
              options={{
                presentation: 'modal',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="admin"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="change-of-assessment/[reason-slug]"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="partner/[slug]"
              options={{
                headerShown: false,
                title: 'Partnership Proposal',
              }}
            />
          </Stack>
          <StatusBar style="dark" />
          {/* {Platform.OS === 'web' && <Analytics />} */}
          {/* {Platform.OS === 'web' && <SpeedInsights />} */}
        </ThemeProvider>
      </Suspense>
    </View>
  );
}
