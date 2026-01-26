import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundary for analytics components
 * Prevents analytics failures from breaking the app
 */
export class AnalyticsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error but don't break the app
    console.warn('Analytics error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render nothing if analytics fails - app continues normally
      return null;
    }

    return this.props.children;
  }
}
