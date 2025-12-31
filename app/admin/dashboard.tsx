/**
 * LAZY-LOADED Admin Dashboard Route
 * This file uses React.lazy to code-split the admin dashboard screen
 * Reduces initial bundle size by ~100-200KB (includes Supabase client, tables, etc.)
 */
import { lazy, Suspense } from 'react';
import { LoadingFallback } from '@/src/components/ui/LoadingFallback';

const LazyAdminDashboard = lazy(() => import('./dashboard.original'));

export default function AdminDashboard() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LazyAdminDashboard />
    </Suspense>
  );
}
