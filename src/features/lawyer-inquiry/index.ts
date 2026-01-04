/**
 * Lawyer Inquiry Feature
 *
 * Public API for the lawyer inquiry feature module.
 */

// Main screen export
export { default as LawyerInquiryScreen } from './LawyerInquiryScreen';

// Types
export * from './types';

// Config
export {
  INQUIRY_TYPE_CONFIG,
  DEFAULT_INQUIRY_CONFIG,
  ENRICHMENT_INQUIRY_TYPES,
  COURT_DATE_ENRICHMENT,
  FINANCIAL_TAG_OPTIONS,
  getEnrichmentFactors,
  getInquiryConfig,
  REASON_PREFILLS,
} from './config';
export type { FinancialTag } from './config';

// Validators (domain-specific only - shared are in src/utils/form-validation)
export {
  validatePostcode,
  validateCourtDate,
  validateFinancialTags,
  validateManualIncome,
  validateManualChildren,
  validateMessage,
  formatCourtDateForReasons,
  buildComplexityTriggers,
} from './validators';

// Hooks
export { useRouteParams } from './hooks/useRouteParams';
export type { ParsedRouteParams } from './hooks/useRouteParams';
export { useInquiryForm } from './hooks/useInquiryForm';
export type { UseInquiryFormProps } from './hooks/useInquiryForm';

// Components (for testing or extension)
export * from './components';

// Styles (for extension or testing)
export {
  containerStyles,
  headerStyles,
  formStyles,
  checkboxStyles,
  buttonStyles,
  circumstancesStyles,
  financialStyles,
  successStyles,
  enrichmentStyles,
  styles,
} from './styles';
