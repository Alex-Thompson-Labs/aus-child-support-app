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
  messageRef: React.RefObject<TextInput | null>;
}

export interface SpecialCircumstancesSectionProps {
  circumstances: (SpecialCircumstance & { urgency: 'URGENT' | 'NORMAL' })[];
}

export interface FinancialSectionProps {
  isDirectMode: boolean;
  // Standard mode props
  liability: string;
  incomeA: string;
  incomeB: string;
  children: string;
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
  // Court date for enrichment
  enrichmentCourtDate: Date | null;
  onEnrichmentCourtDateChange: (date: Date | null) => void;
  // Success state after enrichment submission
  showSuccess: boolean;
}

export interface FormHeaderProps {
  config: InquiryTypeConfig;
}
