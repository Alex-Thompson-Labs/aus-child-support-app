import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PostHogProvider } from 'posthog-react-native';
import { useEffect } from 'react';
import ReactGA from "react-ga4"; // Added for Web Analytics
import { Platform, Pressable, StyleSheet, Text } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useClientOnly } from '@/src/hooks/useClientOnly';
import { initPerformanceMonitoring } from '@/src/utils/web-vitals';

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

  // Initialize Web-specific monitoring and Analytics (client-side only)
  useEffect(() => {
    if (Platform.OS === 'web' && isClient && typeof window !== 'undefined') {
      // Initialize Performance Monitoring
      initPerformanceMonitoring();
      
      // Initialize Google Analytics 4 with your Measurement ID
      ReactGA.initialize("G-53139BKGD7");
      
      // Track the initial page load - safe to access window now
      ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }
  }, [isClient]);

  const posthogApiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY || 'phc_HsAJl0DQIvAd64OQn37pPPAIG1Yo1WRu7QQGBo0Bv9j';
  const posthogHost = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';
  const enableAnalytics = process.env.EXPO_PUBLIC_ENABLE_ANALYTICS !== 'false';

  const gaMeasurementId = process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID || "G-53139BKGD7";
  ReactGA.initialize(gaMeasurementId);

  const content = (
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
  );

  if (enableAnalytics && posthogApiKey && Platform.OS !== 'web') {
    return (
      <PostHogProvider
        apiKey={posthogApiKey}
        options={{
          host: posthogHost,
          enableSessionReplay: true,
        }}
        autocapture
      >
        {content}
      </PostHogProvider>
    );
  }

  return content;
}