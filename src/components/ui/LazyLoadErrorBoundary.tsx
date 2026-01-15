import React, { Component, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface LazyLoadErrorBoundaryProps {
  children: ReactNode;
  /** Custom render function for error state. Receives error and retry callback. */
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface LazyLoadErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class LazyLoadErrorBoundary extends Component<
  LazyLoadErrorBoundaryProps,
  LazyLoadErrorBoundaryState
> {
  constructor(props: LazyLoadErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): LazyLoadErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // TODO: Replace with proper error reporting service
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      if (fallback) {
        return fallback(error, this.handleRetry);
      }
      return <DefaultErrorFallback onRetry={this.handleRetry} />;
    }

    return children;
  }
}

interface DefaultErrorFallbackProps {
  onRetry: () => void;
}

function DefaultErrorFallback({ onRetry }: DefaultErrorFallbackProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.errorTitle}>Failed to load</Text>
      <Text style={styles.errorMessage}>
        Something went wrong loading this content.
      </Text>
      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [
          styles.retryButton,
          pressed && styles.retryButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Retry loading content"
      >
        <Text style={styles.retryButtonText}>Try Again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonPressed: {
    opacity: 0.8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
