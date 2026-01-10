/**
 * LAZY-LOADED Admin Login Route
 * This file uses React.lazy to code-split the admin login screen
 * Reduces initial bundle size by ~50-100KB
 */
import { NoIndex } from '@/src/components/seo/NoIndex';
import { LoadingFallback } from '@/src/components/ui/LoadingFallback';
import { lazy, Suspense } from 'react';

const LazyAdminLogin = lazy(() => import('@/src/pages/admin/AdminLoginScreen'));

export default function AdminLogin() {
  return (
    <>
      <NoIndex />
      <Suspense fallback={<LoadingFallback />}>
        <LazyAdminLogin />
      </Suspense>
    </>
  );
}
