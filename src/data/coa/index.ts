/**
 * Change of Assessment (CoA) Data Module
 *
 * Public API for CoA reason pages, FAQs, and related utilities.
 */

// Types
export type { CoAFaq, CoAReasonPage } from './types';

// Data
export { COA_FAQ_DATA } from './faqs';
export { COA_REASON_PAGES } from './reasons';

// Import for helpers
import { COA_FAQ_DATA } from './faqs';
import { COA_REASON_PAGES } from './reasons';
import type { CoAFaq, CoAReasonPage } from './types';

/**
 * Gets a CoA reason page by its URL slug
 */
export function getCoAReasonBySlug(slug: string): CoAReasonPage | undefined {
  return COA_REASON_PAGES.find((reason) => reason.slug === slug);
}

/**
 * Gets all slugs for static generation
 */
export function getAllCoAReasonSlugs(): string[] {
  return COA_REASON_PAGES.map((reason) => reason.slug);
}

/**
 * Gets FAQs for a specific Change of Assessment reason by its URL slug
 */
export function getCoAFaqs(slug: string): CoAFaq[] {
  return COA_FAQ_DATA[slug] ?? [];
}

/**
 * Builds FAQPage schema markup for a CoA reason page
 */
export function buildCoAFaqSchema(slug: string) {
  const faqs = getCoAFaqs(slug);

  if (faqs.length === 0) {
    return null;
  }

  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
