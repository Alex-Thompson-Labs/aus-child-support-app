/**
 * LAZY-LOADED Admin Lead Details Route
 * This file uses React.lazy to code-split the lead details screen
 * Reduces initial bundle size by ~50-100KB (PDF export, detailed views, etc.)
 */
import { lazy, Suspense } from 'react';
import { LoadingFallback } from '@/src/components/ui/LoadingFallback';

const LazyAdminLeadDetails = lazy(() => import('./[id].original'));

export default function AdminLeadDetails() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LazyAdminLeadDetails />
    </Suspense>
  );
}
