/**
 * LAZY-LOADED Admin Proposals Route
 * Manages partnership proposals - create, view analytics, copy links
 */
import { NoIndex } from '@/src/components/seo/NoIndex';
import { LoadingFallback } from '@/src/components/ui/LoadingFallback';
import { lazy, Suspense } from 'react';

const LazyProposalsScreen = lazy(
  () => import('@/src/pages/admin/ProposalsScreen')
);

export default function AdminProposals() {
  return (
    <>
      <NoIndex />
      <Suspense fallback={<LoadingFallback />}>
        <LazyProposalsScreen />
      </Suspense>
    </>
  );
}
