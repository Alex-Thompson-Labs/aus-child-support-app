/**
 * LAZY-LOADED View Lead Route (Magic Link Access)
 * This file uses React.lazy to code-split the lead viewing screen
 * Public page - no authentication required (security via JWT token)
 */
import { lazy, Suspense } from 'react';
import { LoadingFallback } from '@/src/components/ui/LoadingFallback';

const LazyViewLead = lazy(() => import('./[token].original'));

export default function ViewLead() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LazyViewLead />
    </Suspense>
  );
}
