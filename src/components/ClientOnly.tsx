/**
 * ClientOnly Component
 * 
 * Wrapper component that only renders children on the client side.
 * Prevents hydration mismatches for components that use browser-only APIs.
 */

import React, { ReactNode } from 'react';
import { useClientOnly } from '../hooks/useClientOnly';

interface ClientOnlyProps {
  /** Content to render only on client */
  children: ReactNode;
  /** Optional fallback to show during SSR/initial render */
  fallback?: ReactNode;
}

/**
 * Renders children only after client-side hydration is complete.
 * Use this to wrap components that access window, localStorage, or other browser APIs.
 * 
 * @example
 * ```tsx
 * <ClientOnly fallback={<div>Loading...</div>}>
 *   <ComponentThatUsesWindow />
 * </ClientOnly>
 * ```
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isClient = useClientOnly();

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
