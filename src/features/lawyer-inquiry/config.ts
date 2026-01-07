/**
 * Lawyer Inquiry Feature - Configuration
 *
 * Inquiry type configurations, enrichment settings, and helper functions.
 */

import { SPECIAL_CIRCUMSTANCES } from '@/src/utils/special-circumstances';
import type { EnrichmentFactor, InquiryTypeConfig } from './types';

// ============================================================================
// Inquiry Type Configuration (Context-Aware UI)
// ============================================================================

/**
 * Configuration for different inquiry types based on blog post deep links.
 * Controls title, subtitle, button text, and pre-filled message.
 */
export const INQUIRY_TYPE_CONFIG: Record<string, InquiryTypeConfig> = {
  hidden_income: {
    title: 'Income Investigation Inquiry',
    subtitle:
      'Speak to a lawyer about uncovering hidden income and establishing special circumstances.',
    buttonText: 'Check Lawyer Availability',
    preFillMessage:
      "I suspect the other parent is minimizing their taxable income. I require legal advice on establishing 'special circumstances' to reflect their true financial capacity.",
  },
  binding_agreement: {
    title: 'Binding Agreement Inquiry',
    subtitle:
      'Get legal advice on drafting, negotiating, or certifying a Binding Child Support Agreement.',
    buttonText: 'Get Free Quote',
    preFillMessage:
      'I am interested in establishing a Binding Child Support Agreement to secure a private arrangement.',
  },
};

export const DEFAULT_INQUIRY_CONFIG: InquiryTypeConfig = {
  title: 'Request Legal Help',
  subtitle: 'Get a confidential case assessment from our verified family law network.',
  buttonText: 'Submit Inquiry',
  preFillMessage: '',
};

// ============================================================================
// Enrichment Configuration (Post-submission data collection)
// ============================================================================

/**
 * Inquiry types that should show the enrichment flow after submission
 */
export const ENRICHMENT_INQUIRY_TYPES = ['hidden_income', 'binding_agreement'];

/**
 * Additional enrichment factor for court date (not in SPECIAL_CIRCUMSTANCES)
 */
export const COURT_DATE_ENRICHMENT: EnrichmentFactor = {
  id: 'enrichment_court_date',
  label: 'I have an upcoming court hearing regarding child support.',
};

/**
 * Financial tag options for the chips selector
 */
export const FINANCIAL_TAG_OPTIONS = [
  'Cash Business',
  'Refusing to Work',
  'Hidden Assets',
  'Family Trusts',
  'Other',
] as const;

export type FinancialTag = (typeof FINANCIAL_TAG_OPTIONS)[number];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get inquiry config by reason parameter
 */
export function getInquiryConfig(reason: string | undefined): InquiryTypeConfig {
  if (reason && INQUIRY_TYPE_CONFIG[reason]) {
    return INQUIRY_TYPE_CONFIG[reason];
  }
  return DEFAULT_INQUIRY_CONFIG;
}

/**
 * Get enrichment factors based on inquiry type.
 * Excludes hidden income option when coming from hidden_income inquiry.
 */
export function getEnrichmentFactors(
  inquiryType: string | undefined
): EnrichmentFactor[] {
  // Start with court date option
  const factors: EnrichmentFactor[] = [COURT_DATE_ENRICHMENT];

  // Add all special circumstances, filtering based on inquiry type
  SPECIAL_CIRCUMSTANCES.forEach((circumstance) => {
    // Skip hidden income option when inquiry is hidden_income
    if (
      inquiryType === 'hidden_income' &&
      circumstance.id === 'income_resources_not_reflected'
    ) {
      return;
    }

    factors.push({
      id: `enrichment_${circumstance.id}`,
      label: circumstance.label,
    });
  });

  return factors;
}

// ============================================================================
// Legacy (kept for backward compatibility)
// ============================================================================

/**
 * Pre-fill messages for direct mode based on reason parameter.
 * @deprecated Use INQUIRY_TYPE_CONFIG instead for new implementations
 */
export const REASON_PREFILLS: Record<string, string> = {
  binding_agreement: INQUIRY_TYPE_CONFIG.binding_agreement.preFillMessage,
  hidden_income: INQUIRY_TYPE_CONFIG.hidden_income.preFillMessage,
};
