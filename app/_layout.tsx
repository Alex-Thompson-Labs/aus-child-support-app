import { useColorScheme } from '@/hooks/use-color-scheme';
import { LoadingFallback } from '@/src/components/ui/LoadingFallback';
import { useClientOnly } from '@/src/hooks/useClientOnly';
import { initPerformanceMonitoring } from '@/src/utils/web-vitals';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack, usePathname } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar'; // <--- Make sure this line is present
import { Suspense, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { Platform } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isClient = useClientOnly();
  const pathname = usePathname();

  // SEO: Generate Canonical URL (Strip query params)
  const siteUrl =
    process.env.EXPO_PUBLIC_SITE_URL || 'https://auschildsupport.com';
  // Handle root path logic safely
  const cleanPath = pathname === '/' ? '' : pathname;
  const canonicalUrl = `${siteUrl}${cleanPath}`;

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

  return (
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
            name="lawyer-inquiry"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="admin/login"
            options={{
              presentation: 'modal',
              title: 'Admin Login',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="admin/dashboard"
            options={{
              title: 'Admin Dashboard',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="admin/lead/[id]"
            options={{
              title: 'Lead Details',
              headerShown: false,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Suspense>
  );
}
