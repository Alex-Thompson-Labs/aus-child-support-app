import { ActivityIndicator, StyleSheet, View } from 'react-native';

/**
 * LoadingFallback component for async route loading and Suspense boundaries
 * Used for code-split routes to show a loading indicator while chunks are being fetched
 */
export function LoadingFallback() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
