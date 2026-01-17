/**
 * LAZY-LOADED Lawyer Inquiry Route
 * This file uses React.lazy to code-split the lawyer inquiry form
 * Reduces initial bundle size by ~50-100KB
 */
import { PageSEO } from '@/src/components/seo/PageSEO';
import { LoadingFallback } from '@/src/components/ui/LoadingFallback';
import { lazy, Suspense } from 'react';

const LazyLawyerInquiry = lazy(() => import('@/src/pages/LawyerInquiryScreen'));

// FAQPage schema for lawyer inquiry
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I request a child support review?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can request a Change of Assessment through Services Australia if you believe special circumstances justify a different child support amount. Our form connects you with family law professionals who can advise on your eligibility.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a Change of Assessment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Change of Assessment is an application to Services Australia to review your child support based on 10 special circumstances, such as high contact costs, hidden income, or property settlements.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does a lawyer inquiry take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'After submitting your details, a family law professional will typically contact you within 1-2 business days to discuss your situation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my information confidential?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Your personal and financial information is encrypted and only shared with the legal professionals who will be reviewing your case.',
      },
    },
  ],
};

export default function LawyerInquiry() {
  return (
    <>
      <PageSEO
        title="Legal Inquiry | Aus Child Support"
        description="Connect with Australian family law professionals to review your child support situation. Get expert advice on Change of Assessment applications."
        canonicalPath="/lawyer-inquiry"
        schema={faqSchema}
      />
      <Suspense fallback={<LoadingFallback />}>
        <LazyLawyerInquiry />
      </Suspense>
    </>
  );
}
