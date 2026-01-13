/**
 * Change of Assessment (CoA) Type Definitions
 */

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
 * Represents a FAQ item for a CoA reason
 */
export interface CoAFaq {
  question: string;
  answer: string;
}
