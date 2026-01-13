/**
 * Shared Type Definitions
 *
 * Central export point for all shared types.
 * Import from '@/@types' for clean access to all types.
 */

// Calculator types
export type {
    AgeRange,
    CalculationResults,
    CalculatorInputs,
    ChildInput,
    ChildResult,
    CostBracketInfo,
    FormErrors,
    MultiCaseInfo,
    NonParentCarerInfo,
    OtherCaseChild,
    PayerRole,
    RelevantDependents
} from './calculator';

// Supabase/database types
export type {
    LeadSubmission,
    PartnershipProposal,
    ProposalView
} from './supabase';

// Lawyer inquiry form types
export type {
    AdditionalDetailsSectionProps,
    CareDataItem,
    ConsentSectionProps,
    EnrichmentFactor,
    EnrichmentViewProps,
    FinancialSectionProps,
    FormHeaderProps,
    FormTouched,
    InquiryFormErrors,
    InquiryTypeConfig,
    PersonalInfoSectionProps,
    SpecialCircumstancesSectionProps
} from './lawyer-inquiry';

