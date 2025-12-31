import { useColorScheme } from '@/hooks/use-color-scheme';
import { useClientOnly } from '@/src/hooks/useClientOnly';
import { initPerformanceMonitoring } from '@/src/utils/web-vitals';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect } from 'react';
import ReactGA from "react-ga4";
import { ActivityIndicator, InteractionManager, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

// LoadingFallback component for async route loading
function LoadingFallback() {
  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export const unstable_settings = {
  anchor: '(tabs)',
};

// Close button component that matches the breakdown modal pattern
function CloseButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={headerStyles.closeButton}
    >
      <Text style={headerStyles.closeButtonText}>✕</Text>
    </Pressable>
  );
}

const headerStyles = StyleSheet.create({
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f7fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  closeButtonText: {
    color: '#4a5568',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isClient = useClientOnly();

  // Define config constants
  const enableAnalytics = process.env.EXPO_PUBLIC_ENABLE_ANALYTICS !== 'false';

  useEffect(() => {
    // Only run on web client where window is available
    if (Platform.OS === 'web' && isClient && typeof window !== 'undefined') {
      
      // OPTIMIZATION: Defer Analytics to improve LCP
      // We wait for all interactions to finish, then add a 2.5s delay
      if (enableAnalytics) {
        const gaMeasurementId = process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID || "G-53139BKGD7";
        
        const task = InteractionManager.runAfterInteractions(() => {
          const timer = setTimeout(() => {
            try {
              ReactGA.initialize(gaMeasurementId);
              // Track the initial page load AFTER the paint has likely occurred
              ReactGA.send({ hitType: "pageview", page: window.location.pathname });
              console.log("Analytics initialized (deferred)");
            } catch (error) {
              console.error("GA Initialization failed:", error);
            }
          }, 2500); // 2.5 second delay to clear the LCP window

          return () => clearTimeout(timer);
        });

        return () => task.cancel();
      }

      // Initialize Performance Monitoring (lightweight, can stay)
      initPerformanceMonitoring();
    }
  }, [isClient, enableAnalytics]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
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
              headerShown: false
            }}
          />
          <Stack.Screen
            name="admin/dashboard"
            options={{
              title: 'Admin Dashboard',
              headerShown: false
            }}
          />
          <Stack.Screen
            name="admin/lead/[id]"
            options={{
              title: 'Lead Details',
              headerShown: false
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Suspense>
  );
}