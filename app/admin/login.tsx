/**
 * LAZY-LOADED Admin Login Route
 * This file uses React.lazy to code-split the admin login screen
 * Reduces initial bundle size by ~50-100KB
 */
import { lazy, Suspense } from 'react';
import { LoadingFallback } from '@/src/components/ui/LoadingFallback';

const LazyAdminLogin = lazy(() => import('./login.original'));

export default function AdminLogin() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LazyAdminLogin />
    </Suspense>
  );
}
