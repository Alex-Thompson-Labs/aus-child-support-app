/**
 * LAZY-LOADED Admin Dashboard Route
 * This file uses React.lazy to code-split the admin dashboard screen
 * Reduces initial bundle size by ~100-200KB (includes Supabase client, tables, etc.)
 */
import { NoIndex } from '@/src/components/seo/NoIndex';
import { LoadingFallback } from '@/src/components/ui/LoadingFallback';
import { lazy, Suspense } from 'react';

const LazyAdminDashboard = lazy(() => import('@/src/pages/admin/AdminDashboardScreen'));

export default function AdminDashboard() {
  return (
    <>
      <NoIndex />
      <Suspense fallback={<LoadingFallback />}>
        <LazyAdminDashboard />
      </Suspense>
    </>
  );
}
