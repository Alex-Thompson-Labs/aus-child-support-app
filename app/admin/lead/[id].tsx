/**
 * LAZY-LOADED Admin Lead Details Route
 * This file uses React.lazy to code-split the lead details screen
 * Reduces initial bundle size by ~50-100KB (PDF export, detailed views, etc.)
 */
import { NoIndex } from '@/src/components/seo/NoIndex';
import { LoadingFallback } from '@/src/components/ui/LoadingFallback';
import { lazy, Suspense } from 'react';

const LazyAdminLeadDetails = lazy(() => import('@/src/pages/admin/LeadDetailScreen'));

export default function AdminLeadDetails() {
  return (
    <>
      <NoIndex />
      <Suspense fallback={<LoadingFallback />}>
        <LazyAdminLeadDetails />
      </Suspense>
    </>
  );
}
