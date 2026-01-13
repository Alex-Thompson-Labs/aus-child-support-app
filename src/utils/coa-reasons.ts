/**
 * Change of Assessment (CoA) Reason Pages Data
 *
 * Contains all 10 official Services Australia Change of Assessment grounds
 * with SEO metadata, plain English explanations, and example scenarios.
 *
 * @module coa-reasons
 */

import { COA_REASON_PAGES } from '../data/coa-reasons-data';

/**
 * Represents a Change of Assessment reason page
 */
export interface CoAReasonPage {
  /** URL slug (kebab-case) */
  slug: string;
  /** Display number: "1", "2", ..., "8A", "8B", "9", "10" */
  reasonNumber: string;
  /** Official Services Australia code: "5.2.1" - "5.2.11" */
  officialCode: string;
  /** Full SEO title */
  title: string;
  /** Short name for navigation/breadcrumbs */
  shortName: string;
  /** Meta description (150-160 chars) */
  metaDescription: string;
  /** Plain English explanation of this ground */
  plainEnglishExplanation: string;
  /** Example scenario with John and Sarah */
  exampleScenario: {
    title: string;
    content: string;
  };
  /** Related special circumstance ID for pre-selection, or null */
  relatedCircumstanceId: string | null;
  /** Canonical URL path */
  canonicalPath: string;
}


/**
 * All 10 official Change of Assessment reason pages
 */
export { COA_REASON_PAGES };


/**
 * Gets a CoA reason page by its URL slug
 *
 * @param slug - The URL slug to look up
 * @returns The matching CoAReasonPage, or undefined if not found
 */
export function getCoAReasonBySlug(slug: string): CoAReasonPage | undefined {
  return COA_REASON_PAGES.find((reason) => reason.slug === slug);
}

/**
 * Gets all slugs for static generation
 *
 * @returns Array of all reason slugs
 */
export function getAllCoAReasonSlugs(): string[] {
  return COA_REASON_PAGES.map((reason) => reason.slug);
}
