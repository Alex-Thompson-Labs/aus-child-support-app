import React, { createContext, useContext, useMemo, ReactNode } from 'react';

/**
 * A/B Testing Context
 * 
 * Provides global A/B test variant assignment that is determined once at app startup.
 * This eliminates the need for components to determine their own variants, ensuring:
 * 
 * 1. Consistent variants across all components in a session
 * 2. Immediate rendering without waiting for async storage
 * 3. Single source of truth for A/B testing
 * 4. Easy to add new A/B tests without duplicating logic
 */

export type VariantId = 'A' | 'B';

interface ABTestingContextValue {
  /**
   * Conversion footer variant (50/50 split)
   * Previously managed per-component, now global for consistency
   */
  conversionFooterVariant: VariantId;
  
  /**
   * Add new A/B tests here as needed
   * Example: headerVariant: VariantId;
   */
}

const ABTestingContext = createContext<ABTestingContextValue | undefined>(undefined);

interface ABTestingProviderProps {
  children: ReactNode;
}

/**
 * AB Testing Provider
 * 
 * Should be mounted once at the root of the application (_layout.tsx).
 * Generates all A/B test variants at app startup for consistent experience.
 */
export function ABTestingProvider({ children }: ABTestingProviderProps) {
  // Generate A/B variants once at provider mount (app startup)
  // Uses useMemo with empty deps to ensure variants are stable for the app session
  const contextValue = useMemo<ABTestingContextValue>(() => {
    return {
      // 50/50 split for conversion footer variant
      conversionFooterVariant: Math.random() < 0.5 ? 'A' : 'B',
      
      // Add new A/B tests here
      // headerVariant: Math.random() < 0.5 ? 'A' : 'B',
    };
  }, []);

  return (
    <ABTestingContext.Provider value={contextValue}>
      {children}
    </ABTestingContext.Provider>
  );
}

/**
 * Hook to access A/B testing variants
 * 
 * @throws Error if used outside of ABTestingProvider
 * @returns ABTestingContextValue with all current A/B test variants
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { conversionFooterVariant } = useABTesting();
 *   return <div>Variant: {conversionFooterVariant}</div>;
 * }
 * ```
 */
export function useABTesting(): ABTestingContextValue {
  const context = useContext(ABTestingContext);
  
  if (context === undefined) {
    throw new Error('useABTesting must be used within an ABTestingProvider');
  }
  
  return context;
}

/**
 * Optional: Hook to check if a specific variant is active
 * 
 * @example
 * ```tsx
 * const isVariantA = useIsVariant('conversionFooterVariant', 'A');
 * ```
 */
export function useIsVariant(
  testName: keyof ABTestingContextValue,
  variant: VariantId
): boolean {
  const context = useABTesting();
  return context[testName] === variant;
}
