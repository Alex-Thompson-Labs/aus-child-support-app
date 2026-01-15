/**
 * Lawyer Inquiry Feature - Hooks
 */

export { useRouteParams } from './useRouteParams';
export type { ParsedRouteParams } from './useRouteParams';

export { useInquiryForm } from './useInquiryForm';
export type { LeadFormValue, UseInquiryFormProps } from './useInquiryForm';

// Composed hooks (can be used independently if needed)
export { useInquiryValidation } from './useInquiryValidation';
export type { UseInquiryValidationProps } from './useInquiryValidation';

export { useLeadSubmission } from './useLeadSubmission';
export type { UseLeadSubmissionProps } from './useLeadSubmission';

export { useInquiryState } from './useInquiryState';
export type { UseInquiryStateProps } from './useInquiryState';

