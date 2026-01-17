/**
 * Lawyer Inquiry Feature - Type Definitions
 *
 * Interfaces and types for the lawyer inquiry form, validation,
 * and component props.
 */

import type { SpecialCircumstance } from '@/src/utils/special-circumstances';
import type { TextInput } from 'react-native';

// ============================================================================
// Form State Types
// ============================================================================

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  postcode?: string;
  message?: string;
  consent?: string;
  courtDate?: string;
  financialTags?: string;
  manualIncomeA?: string;
  manualIncomeB?: string;
  manualChildren?: string;
  // PSI & International fields
  separationDate?: string;
  otherParentCountry?: string;
}

export interface FormTouched {
  name: boolean;
  email: boolean;
  phone: boolean;
  postcode: boolean;
  message: boolean;
  consent: boolean;
  courtDate: boolean;
  financialTags: boolean;
  manualIncomeA: boolean;
  manualIncomeB: boolean;
  manualChildren: boolean;
  // PSI & International fields
  separationDate: boolean;
  cohabited6Months: boolean;
  otherParentCountry: boolean;
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface InquiryTypeConfig {
  title: string;
  subtitle: string | null;
  buttonText: string;
  preFillMessage: string;
}

export interface CareDataItem {
  index: number;
  careA: number;
  careB: number;
}

export interface EnrichmentFactor {
  id: string;
  label: string;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface PersonalInfoSectionProps {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  errors: FormErrors;
  touched: FormTouched;
  isSubmitting: boolean;
  onTextChange: (
    field: keyof FormErrors,
    value: string,
    setter: (v: string) => void
  ) => void;
  onBlur: (field: keyof FormErrors) => void;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setPhone: (v: string) => void;
  setPostcode: (v: string) => void;
  emailRef: React.RefObject<TextInput | null>;
  phoneRef: React.RefObject<TextInput | null>;
  postcodeRef: React.RefObject<TextInput | null>;
  messageRef: React.RefObject<TextInput | null>;
}

export interface SpecialCircumstancesSectionProps {
  circumstances: (SpecialCircumstance & { urgency: 'URGENT' | 'NORMAL' })[];
}

export interface FinancialSectionProps {
  isDirectMode: boolean;
  // Standard mode props
  liability: string;
  payer: string; // "Parent A" (You Pay), "Parent B" (You Receive), or "Neither"
  incomeA: string;
  incomeB: string;
  dependentsList: string;
  careData: CareDataItem[];
  // Direct mode props
  manualIncomeA: string;
  manualIncomeB: string;
  manualChildren: string;
  setManualIncomeA: (v: string) => void;
  setManualIncomeB: (v: string) => void;
  setManualChildren: (v: string) => void;
  // Financial tags props
  shouldShowFinancialTags: boolean;
  financialTags: string[];
  setFinancialTags: (v: string[]) => void;
  specialCircumstances: string[] | null;
  // Court date props
  shouldShowCourtDate: boolean;
  courtDate: Date | null;
  onCourtDateChange: (date: Date | null) => void;
  // PSI (Post-Separation Income) conditional fields
  shouldShowPsiFields: boolean;
  separationDate: Date | null;
  onSeparationDateChange: (date: Date | null) => void;
  cohabited6Months: boolean;
  onCohabited6MonthsChange: (value: boolean) => void;
  showPsiWarning: boolean;
  // International Jurisdiction conditional fields
  shouldShowInternationalFields: boolean;
  otherParentCountry: string;
  onOtherParentCountryChange: (country: string) => void;
  internationalWarning: 'excluded' | 'non_reciprocating' | null;
  // Refs for keyboard navigation (direct mode only)
  manualIncomeARef?: React.RefObject<TextInput | null>;
  manualIncomeBRef?: React.RefObject<TextInput | null>;
  manualChildrenRef?: React.RefObject<TextInput | null>;
  // Common
  errors: FormErrors;
  touched: FormTouched;
  isSubmitting: boolean;
  onTextChange: (
    field: keyof FormErrors,
    value: string,
    setter: (v: string) => void
  ) => void;
  onBlur: (field: keyof FormErrors) => void;
}

export interface AdditionalDetailsSectionProps {
  message: string;
  setMessage: (v: string) => void;
  financialTags: string[];
  errors: FormErrors;
  touched: FormTouched;
  isSubmitting: boolean;
  onTextChange: (
    field: keyof FormErrors,
    value: string,
    setter: (v: string) => void
  ) => void;
  onBlur: (field: keyof FormErrors) => void;
  messageRef: React.RefObject<TextInput | null>;
}

export interface ConsentSectionProps {
  consent: boolean;
  onConsentToggle: () => void;
  errors: FormErrors;
  touched: FormTouched;
  isSubmitting: boolean;
  buttonText: string;
  onSubmit: () => void;
}

export interface EnrichmentViewProps {
  reason: string | undefined;
  onSubmit: () => Promise<void>;
  onSkip: () => void;
  isUpdating: boolean;
  selectedFactors: string[];
  onFactorToggle: (factorId: string) => void;
  incomes: { parentA: number; parentB: number };
  childrenCount: number;
  onLiabilityCalculated: (amount: number) => void;
  onPayerRoleCalculated: (payerRole: 'you' | 'other_parent' | null) => void;
  // Country for international jurisdiction
  enrichmentCountry: string;
  onEnrichmentCountryChange: (country: string) => void;
  // Success state after enrichment submission
  showSuccess: boolean;
}

export interface FormHeaderProps {
  config: InquiryTypeConfig;
  /** Source indicator for exit redirect (e.g., "blog" redirects to blog URL) */
  source?: string;
  /** Explicit external URL to redirect to on exit. Takes priority over source. */
  returnTo?: string;
  /** User came from the Full Breakdown modal - navigate back there on close */
  fromBreakdown?: boolean;
}
