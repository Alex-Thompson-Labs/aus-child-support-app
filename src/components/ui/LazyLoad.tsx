import React, { ComponentType, Suspense, lazy, useState } from 'react';
import { LazyLoadErrorBoundary } from './LazyLoadErrorBoundary';
import { LoadingFallback } from './LoadingFallback';

interface LazyLoadProps<T> {
  /**
   * Factory function that returns a dynamic import promise
   * Example: () => import('./MyComponent')
   */
  loader: () => Promise<{ default: ComponentType<T> }>;
  
  /**
   * Props to pass to the lazy-loaded component
   */
  componentProps: T;
  
  /**
   * Optional custom loading fallback
   * Defaults to LoadingFallback component
   */
  fallback?: React.ReactNode;
  
  /**
   * Optional custom error fallback
   * Defaults to built-in error UI with retry button
   */
  errorFallback?: React.ReactNode;
}

/**
 * LazyLoad wrapper component for code splitting and lazy loading
 * 
 * Features:
 * - Suspense-based lazy loading with loading fallback
 * - Error boundary for handling import failures
 * - Type-safe component props via TypeScript generics
 * - Retry functionality on error
 * 
 * Usage:
 * ```tsx
 * <LazyLoad
 *   loader={() => import('./PDFExportButton')}
 *   componentProps={{ assessment: myAssessment }}
 * />
 * ```
 * 
 * @template T - Type of props for the lazy-loaded component
 */
export function LazyLoad<T extends Record<string, any>>({
  loader,
  componentProps,
  fallback,
  errorFallback,
}: LazyLoadProps<T>) {
  // Use state to force re-render on retry
  const [key, setKey] = useState(0);
  
  // Create lazy component with current key to force reload on retry
  const LazyComponent = lazy(loader);
  
  const handleRetry = () => {
    setKey((prev) => prev + 1);
  };
  
  return (
    <LazyLoadErrorBoundary fallback={errorFallback} onRetry={handleRetry}>
      <Suspense fallback={fallback || <LoadingFallback />}>
        <LazyComponent key={key} {...componentProps} />
      </Suspense>
    </LazyLoadErrorBoundary>
  );
}

/**
 * Hook for creating a lazy-loaded component with error handling
 * 
 * Usage:
 * ```tsx
 * const PDFButton = useLazyComponent(() => import('./PDFExportButton'));
 * 
 * return (
 *   <Suspense fallback={<LoadingFallback />}>
 *     {PDFButton && <PDFButton assessment={assessment} />}
 *   </Suspense>
 * );
 * ```
 */
export function useLazyComponent<T extends ComponentType<any>>(
  loader: () => Promise<{ default: T }>
): T | null {
  const [Component, setComponent] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  React.useEffect(() => {
    let mounted = true;
    
    loader()
      .then((module) => {
        if (mounted) {
          setComponent(() => module.default);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error('Failed to load component:', err);
          setError(err);
        }
      });
    
    return () => {
      mounted = false;
    };
  }, [loader]);
  
  if (error) {
    return null;
  }
  
  return Component;
}
