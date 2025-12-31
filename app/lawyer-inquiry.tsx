/**
 * LAZY-LOADED Lawyer Inquiry Route
 * This file uses React.lazy to code-split the lawyer inquiry form
 * Reduces initial bundle size by ~50-100KB
 */
import { lazy, Suspense } from 'react';
import { LoadingFallback } from '@/src/components/ui/LoadingFallback';

const LazyLawyerInquiry = lazy(() => import('./lawyer-inquiry.original'));

export default function LawyerInquiry() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LazyLawyerInquiry />
    </Suspense>
  );
}
