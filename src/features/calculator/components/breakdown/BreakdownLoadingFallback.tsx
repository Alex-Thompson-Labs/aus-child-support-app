import { useAppTheme } from '@/src/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

/**
 * Loading fallback component shown while breakdown view is being lazy-loaded.
 * 
 * Displays a spinner and loading message to provide visual feedback
 * during code splitting / dynamic import.
 */
export function BreakdownLoadingFallback() {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.textMuted }]}>
        Loading breakdown...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
