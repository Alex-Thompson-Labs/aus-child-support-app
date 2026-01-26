import { SemanticColors } from '@/constants/theme';
import { AnalyticsErrorBoundary } from '@/src/components/ui/AnalyticsErrorBoundary';
import { LoadingFallback } from '@/src/components/ui/LoadingFallback';
import { ABTestingProvider } from '@/src/contexts/ABTestingContext';
import { useClientOnly } from '@/src/hooks/useClientOnly';
import { Analytics as AnalyticsUtil } from '@/src/utils/analytics';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname } from 'expo-router';
import Head from 'expo-router/head';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { Platform, View } from 'react-native';

// Lazy load analytics components (non-critical)
const Analytics = lazy(() => import('@vercel/analytics/react').then(m => ({ default: m.Analytics })));
const SpeedInsights = lazy(() => import('@vercel/speed-insights/react').then(m => ({ default: m.SpeedInsights })));

// Keep the splash screen visible while we fetch resources
// Wrap in try-catch to prevent crashes on web static export
try {
  SplashScreen.preventAutoHideAsync();
} catch {
  // Ignore errors - splash screen may not be available on web
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const isClient = useClientOnly();
  const pathname = usePathname();
  // Initialize appIsReady to true on web to allow SSG to render content
  // On native, start false to show splash screen while loading
  const [appIsReady, setAppIsReady] = useState(Platform.OS === 'web');
  // Force light mode
  const colors = SemanticColors.light;

  // Prepare the app by loading any required resources (fonts, assets, etc.)
  useEffect(() => {
    async function prepare() {
      try {
        // Defer non-critical initialization to after first paint
        setAppIsReady(true);
        
        // Initialize analytics and EmailJS after app is ready (non-blocking)
        if (Platform.OS === 'web') {
          // Use requestIdleCallback to defer until browser is idle
          // Delay by 3 seconds to ensure critical rendering is complete
          const idleCallback = (window as any).requestIdleCallback || setTimeout;
          
          idleCallback(() => {
            setTimeout(() => {
              // Lazy load EmailJS
              import('@/src/utils/emailjs').then(({ initEmailJS }) => {
                initEmailJS();
              }).catch(() => {
                // Fail silently - EmailJS is non-critical
              });

              // Initialize Google Analytics 4 (deferred)
              const gaMeasurementId = process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID;
              if (gaMeasurementId) {
                AnalyticsUtil.initialize(gaMeasurementId);
              }
            }, 3000); // 3 second delay for analytics
          });
        }
      } catch (e) {
        console.warn('Error preparing app:', e);
      }
    }

    prepare();

    // Safety fallback: Ensure splash screen hides after 5 seconds
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {
        // Ignore errors if already hidden
      });
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  // Callback to hide splash screen once the root view has performed layout
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Hide the splash screen once the app has rendered
      try {
        await SplashScreen.hideAsync();
      } catch {
        // Ignore errors - splash screen may not be available on web
      }
    }
  }, [appIsReady]);

  // SEO: Generate Canonical URL (Strip query params and trailing slashes)
  const siteUrl =
    process.env.EXPO_PUBLIC_SITE_URL || 'https://auschildsupport.com.au';
  // Handle root path and normalize trailing slashes (vercel.json has trailingSlash: false)
  const normalizedPath = pathname === '/' ? '' : pathname.replace(/\/$/, '');
  const canonicalUrl = `${siteUrl}${normalizedPath}`;



  useEffect(() => {
    // Only run on web client where window is available
    if (Platform.OS === 'web' && isClient && typeof window !== 'undefined') {
      // FIX: Set document title for Accessibility score
      document.title = 'Child Support Calculator';
    }
  }, [isClient]);

  // Don't render until app is ready - prevents visual flash
  if (!appIsReady) {
    return <LoadingFallback />;
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.background }}
      onLayout={onLayoutRootView}
    >
      <Suspense fallback={<LoadingFallback />}>
        {/* SEO: Dynamic Canonical Tag via Expo Head */}
        <Head>
          <link rel="canonical" href={canonicalUrl} />
          
          {/* Font optimization: Add font-display: swap to prevent render blocking */}
          {Platform.OS === 'web' && (
            <style>{`
              /* System font stack with font-display: swap for optimal loading */
              body {
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              }
              
              /* Ensure all font faces use font-display: swap to prevent FOIT (Flash of Invisible Text) */
              @font-face {
                font-family: system-ui;
                font-display: swap;
              }
              
              /* Icon fonts from @expo/vector-icons - apply font-display: swap */
              @font-face {
                font-family: 'Feather';
                font-display: swap;
              }
              
              @font-face {
                font-family: 'Ionicons';
                font-display: swap;
              }
              
              @font-face {
                font-family: 'MaterialIcons';
                font-display: swap;
              }
            `}</style>
          )}
        </Head>

        <ABTestingProvider>
          <ThemeProvider value={DefaultTheme}>
            <Stack
              screenOptions={{
                title: 'Child Support Calculator',
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
            {/* Lazy load analytics components after app is ready */}
            {Platform.OS === 'web' && appIsReady && (
              <AnalyticsErrorBoundary>
                <Suspense fallback={null}>
                  <Analytics />
                  <SpeedInsights />
                </Suspense>
              </AnalyticsErrorBoundary>
            )}
          </ThemeProvider>
        </ABTestingProvider>
      </Suspense>
    </View>
  );
}
