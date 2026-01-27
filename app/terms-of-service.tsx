/**
 * Terms of Service Screen
 * 
 * Displays the Terms of Service in a WebView for native platforms
 * and redirects to the static HTML file on web.
 */

import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

export default function TermsOfServiceScreen() {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === 'web') {
      // On web, redirect to the static HTML file
      if (typeof window !== 'undefined') {
        window.location.href = '/terms-of-service.html';
      }
    }
  }, []);

  // For native platforms, we'd show a WebView here
  // For now, just show a loading indicator while redirecting on web
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Native implementation would go here
  // For now, redirect to web version
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});
