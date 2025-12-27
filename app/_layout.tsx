import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { PostHogProvider } from 'posthog-react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Get PostHog configuration from environment variables
  // TODO: Move to EXPO_PUBLIC_ prefixed env vars for production
  const posthogApiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY || 'phc_HsAJl0DQIvAd64OQn37pPPAIG1Yo1WRu7QQGBo0Bv9j';
  const posthogHost = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';
  const enableAnalytics = process.env.EXPO_PUBLIC_ENABLE_ANALYTICS !== 'false';

  const content = (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen
          name="lawyer-inquiry"
          options={{
            presentation: 'modal',
            title: 'Get Legal Help',
            headerShown: true
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

  // Only enable PostHog if API key is provided and analytics is enabled
  // PostHog doesn't work on web without additional configuration, so we disable it for web
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