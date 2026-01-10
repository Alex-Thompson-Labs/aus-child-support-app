/**
 * LAZY-LOADED View Lead Route (Magic Link Access)
 * This file uses React.lazy to code-split the lead viewing screen
 * Public page - no authentication required (security via JWT token)
 */
import { NoIndex } from '@/src/components/seo/NoIndex';
import { LoadingFallback } from '@/src/components/ui/LoadingFallback';
import { lazy, Suspense } from 'react';

const LazyViewLead = lazy(() => import('@/src/pages/admin/ViewLeadScreen'));

export default function ViewLead() {
  return (
    <>
      <NoIndex />
      <Suspense fallback={<LoadingFallback />}>
        <LazyViewLead />
      </Suspense>
    </>
  );
}
