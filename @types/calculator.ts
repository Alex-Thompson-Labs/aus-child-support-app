/**
 * Calculator Types
 *
 * Core type definitions for the child support calculation engine.
 * These types are used throughout the application for calculation inputs,
 * results, and multi-case scenarios.
 */

// ============================================================================
// Age & Child Types
// ============================================================================

/** Age range type used by the calculation engine */
export type AgeRange = 'Under 13' | '13+' | '18+';

export interface ChildInput {
  id: string;
  /** Specific age of the child (0-25) */
  age: number;
  careAmountA: number;
  careAmountB: number;
  carePeriod: 'week' | 'fortnight' | 'year' | 'percent';
  /** Care amount for non-parent carer (Formula 4). Optional. */
  careAmountNPC?: number;
}

export interface RelevantDependents {
  u13: number;
  plus13: number;
}

// ============================================================================
// Calculator Input/Output Types
// ============================================================================

export interface CalculatorInputs {
  ATI_A: number;
  ATI_B: number;
  supportA: boolean;
  supportB: boolean;
  children: {
    /** Specific age of the child (0-25) */
    age: number;
    /** Derived age range for calculation engine */
    ageRange: AgeRange;
    careA: number;
    careB: number;
    /** Care percentage for non-parent carer (Formula 4). Optional. */
    careNPC?: number;
  }[];
  relDepA: RelevantDependents;
  relDepB: RelevantDependents;
  /** Multi-case info for Parent A (Formula 3). */
  multiCaseA?: MultiCaseInfo;
  /** Multi-case info for Parent B (Formula 3). */
  multiCaseB?: MultiCaseInfo;
  /** Non-parent carer info (Formula 4). */
  nonParentCarer?: NonParentCarerInfo;
}

export interface ChildResult {
  /** Specific age of the child */
  age: number;
  /** Derived age range for calculation engine */
  ageRange: AgeRange;
  /** True if child is 18+ (excluded from standard calculation) */
  isAdultChild: boolean;
  /** True if child is 17 (included in calculation but with transition warning) */
  isTurning18: boolean;
  careA: number;
  careB: number;
  costPerChild: number;
  roundedCareA: number;
  roundedCareB: number;
  costPercA: number;
  costPercB: number;
  childSupportPercA: number;
  childSupportPercB: number;
  liabilityA: number;
  liabilityB: number;
  finalLiabilityA: number;
  finalLiabilityB: number;
  farAppliedA: boolean;
  farAppliedB: boolean;
  marAppliedA: boolean;
  marAppliedB: boolean;
  // Multi-case cap fields (Formula 3)
  multiCaseCapA?: number;
  multiCaseCapB?: number;
  multiCaseCapAppliedA: boolean;
  multiCaseCapAppliedB: boolean;
  // Non-parent carer fields (Formula 4)
  careNPC?: number;
  roundedCareNPC?: number;
  costPercNPC?: number;
  liabilityToNPC_A?: number;
  liabilityToNPC_B?: number;
}

export interface CostBracketInfo {
  minIncome: number;
  maxIncome: number | null;
  fixed: number;
  rate: number;
  incomeInBracket: number;
}

export interface CalculationResults {
  ATI_A: number;
  ATI_B: number;
  relDepDeductibleA: number;
  relDepDeductibleB: number;
  SSA: number;
  FAR: number;
  MAR: number;
  MAX_PPS: number;
  CSI_A: number;
  CSI_B: number;
  CCSI: number;
  incomePercA: number;
  incomePercB: number;
  totalCost: number;
  costBracketInfo?: CostBracketInfo;
  childResults: ChildResult[];
  totalLiabilityA: number;
  totalLiabilityB: number;
  finalLiabilityA: number;
  finalLiabilityB: number;
  FAR_A: number;
  FAR_B: number;
  MAR_A: number;
  MAR_B: number;
  rateApplied: string;
  payer: string;
  receiver: string;
  finalPaymentAmount: number;
  // Multi-case fields (Formula 3)
  multiCaseAllowanceA: number;
  multiCaseAllowanceB: number;
  multiCaseBreakdownA?: import('../src/utils/child-support-calculations').MultiCaseChildBreakdown[];
  multiCaseBreakdownB?: import('../src/utils/child-support-calculations').MultiCaseChildBreakdown[];
  multiCaseCapA?: number;
  multiCaseCapB?: number;
  multiCaseCapAppliedA: boolean;
  multiCaseCapAppliedB: boolean;
  multiCaseCapBracketInfoA?: CostBracketInfo;
  multiCaseCapBracketInfoB?: CostBracketInfo;
  totalChildrenAllCasesA?: number;
  totalChildrenAllCasesB?: number;
  // MAR/FAR cap explanations for multi-case scenarios
  marCapExplanationA?: string;
  marCapExplanationB?: string;
  farCapExplanationA?: string;
  farCapExplanationB?: string;
  // Non-parent carer fields (Formula 4)
  payerRole: PayerRole;
  paymentToNPC?: number;
}

export interface FormErrors {
  incomeA?: string;
  incomeB?: string;
  children?: string;
  [childId: string]: string | undefined;
}

// ============================================================================
// Multi-case Support Types (Formula 3 & 4)
// ============================================================================

/**
 * Represents a child from another child support case.
 * Used for calculating Multi-case Allowance.
 */
export interface OtherCaseChild {
  id: string;
  /** Specific age of the child (0-25) */
  age: number;
}

/**
 * Multi-case information for a parent.
 * Contains children this parent has in OTHER child support cases.
 */
export interface MultiCaseInfo {
  otherChildren: OtherCaseChild[];
}

/**
 * Non-parent carer information (Formula 4).
 * A non-parent carer (e.g., grandparent) must have at least 35% care.
 * Eligibility is derived from per-child care amounts in ChildInput.careAmountNPC.
 */
export interface NonParentCarerInfo {
  enabled: boolean;
}

/**
 * Payer role determination for multi-case scenarios.
 */
export type PayerRole =
  | 'paying_parent'
  | 'receiving_parent'
  | 'both_paying'
  | 'neither';
