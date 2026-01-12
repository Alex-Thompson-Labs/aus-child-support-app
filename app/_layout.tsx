import { useColorScheme } from '@/hooks/use-color-scheme';
import { LoadingFallback } from '@/src/components/ui/LoadingFallback';
import { useClientOnly } from '@/src/hooks/useClientOnly';
import { initPerformanceMonitoring } from '@/src/utils/web-vitals';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Stack, usePathname } from 'expo-router';
import Head from 'expo-router/head';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useCallback, useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { Platform, View } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isClient = useClientOnly();
  const pathname = usePathname();
  const [appIsReady, setAppIsReady] = useState(false);

  // Prepare the app by loading any required resources (fonts, assets, etc.)
  useEffect(() => {
    async function prepare() {
      try {
        // Add any async resource loading here if needed (e.g., fonts)
        // For now, we just mark as ready since fonts are loaded via expo config
      } catch (e) {
        console.warn('Error preparing app:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Callback to hide splash screen once the root view has performed layout
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Hide the splash screen once the app has rendered
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // SEO: Generate Canonical URL (Strip query params and trailing slashes)
  const siteUrl =
    process.env.EXPO_PUBLIC_SITE_URL || 'https://auschildsupport.com';
  // Handle root path and normalize trailing slashes (vercel.json has trailingSlash: false)
  const normalizedPath = pathname === '/' ? '' : pathname.replace(/\/$/, '');
  const canonicalUrl = `${siteUrl}${normalizedPath}`;

  // Define config constants
  const enableAnalytics = process.env.EXPO_PUBLIC_ENABLE_ANALYTICS !== 'false';

  useEffect(() => {
    // Only run on web client where window is available
    if (Platform.OS === 'web' && isClient && typeof window !== 'undefined') {
      // FIX: Set document title for Accessibility score
      document.title = 'Child Support Calculator';

      // OPTIMIZATION: Defer Analytics to improve LCP
      if (enableAnalytics) {
        const gaMeasurementId =
          process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID || 'G-53139BKGD7';

        const requestIdleCallbackPolyfill =
          window.requestIdleCallback ||
          function (cb: IdleRequestCallback) {
            return setTimeout(cb, 1);
          };

        const idleCallbackId = requestIdleCallbackPolyfill(() => {
          const timer = setTimeout(() => {
            try {
              ReactGA.initialize(gaMeasurementId);
              ReactGA.send({
                hitType: 'pageview',
                page: window.location.pathname,
              });
              console.log('Analytics initialized (deferred)');
            } catch (error) {
              console.error('GA Initialization failed:', error);
            }
          }, 2500);

          return () => clearTimeout(timer);
        });

        return () => {
          const cancelIdleCallbackPolyfill =
            window.cancelIdleCallback ||
            function (id: number) {
              clearTimeout(id);
            };
          cancelIdleCallbackPolyfill(idleCallbackId);
        };
      }

      initPerformanceMonitoring();
    }
  }, [isClient, enableAnalytics]);

  // Don't render until app is ready - prevents visual flash
  if (!appIsReady) {
    return <LoadingFallback />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }} onLayout={onLayoutRootView}>
      <Suspense fallback={<LoadingFallback />}>
        {/* SEO: Dynamic Canonical Tag via Expo Head */}
        <Head>
          <link rel="canonical" href={canonicalUrl} />
        </Head>

        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
          <StatusBar style="auto" />
          {Platform.OS === 'web' && <Analytics />}
          {Platform.OS === 'web' && <SpeedInsights />}
        </ThemeProvider>
      </Suspense>
    </View>
  );
}
