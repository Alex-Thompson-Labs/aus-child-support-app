/**
 * Safe Hydration Hook
 * 
 * Prevents hydration mismatches by ensuring code only runs on the client.
 * Use this for any code that accesses browser-only APIs (window, localStorage, etc.)
 */

import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

/**
 * Returns true only after the component has mounted on the client.
 * Prevents hydration mismatches by ensuring consistent server/client renders.
 * 
 * @returns boolean - false during SSR and initial render, true after mount
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isClient = useClientOnly();
 *   
 *   if (!isClient) {
 *     return <div>Loading...</div>;
 *   }
 *   
 *   // Safe to use window, localStorage, etc.
 *   return <div>{window.location.pathname}</div>;
 * }
 * ```
 */
export function useClientOnly(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook that returns a value only on the client side.
 * Returns null during SSR and initial render.
 * 
 * @param getValue - Function that returns the value (only called on client)
 * @returns The value from getValue() or null during SSR
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const pathname = useClientValue(() => window.location.pathname);
 *   
 *   return <div>Current path: {pathname || 'Loading...'}</div>;
 * }
 * ```
 */
export function useClientValue<T>(getValue: () => T): T | null {
  const isClient = useClientOnly();
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    if (isClient) {
      setValue(getValue());
    }
  }, [isClient, getValue]);

  return value;
}

/**
 * Safe wrapper for browser-only code.
 * Only executes on web platform with window available.
 * 
 * @param callback - Function to execute (only runs on client)
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   useEffect(() => {
 *     runOnClient(() => {
 *       console.log('Window width:', window.innerWidth);
 *     });
 *   }, []);
 * }
 * ```
 */
export function runOnClient(callback: () => void): void {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    callback();
  }
}

/**
 * Check if code is running on the client (browser) side.
 * This is a synchronous check - use useClientOnly() in components.
 * 
 * @returns boolean - true if running in browser, false during SSR
 */
export function isClient(): boolean {
  return Platform.OS === 'web' && typeof window !== 'undefined';
}
