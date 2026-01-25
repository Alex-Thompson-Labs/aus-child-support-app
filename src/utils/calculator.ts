/** Age range type used by the calculation engine */
export type AgeRange = 'Under 13' | '13+' | '18+';

export interface ChildInput {
  id: string;
  /** Specific age of the child (0-25) */
  age: number;
  careAmountA: number;
  careAmountB: number;
  carePeriod: 'week' | 'fortnight' | 'year' | 'percent';
  /** Care amount for non-parent carer (Formula 2/4). Optional. */
  careAmountNPC?: number;
  /** Care amount for second non-parent carer (Formula 2/4 two NPC split). Optional. */
  careAmountNPC2?: number;
}

/**
 * Derives the age range string from a specific age number.
 * Used for backward compatibility with the calculation engine.
 * 
 * @param age - Specific age (0-25)
 * @returns Age range string for calculation engine
 */
export function deriveAgeRange(age: number): AgeRange {
  if (age >= 18) return '18+';
  if (age >= 13) return '13+';
  return 'Under 13';
}

/**
 * Memoized version of deriveAgeRange for performance optimization.
 * Caches age range calculations to avoid repeated computation in calculation loops.
 * 
 * Cache is limited to ages 0-25 (valid range for child support calculations).
 */
const ageRangeCache = new Map<number, AgeRange>();

export function deriveAgeRangeMemoized(age: number): AgeRange {
  // Check cache first
  const cached = ageRangeCache.get(age);
  if (cached !== undefined) {
    return cached;
  }

  // Calculate and cache
  const result = deriveAgeRange(age);
  ageRangeCache.set(age, result);
  return result;
}

/**
 * Checks if a child is an adult (18+) for Adult Child Maintenance scenarios.
 * 
 * @param age - Specific age
 * @returns true if child is 18 or older
 */
export function isAdultChild(age: number): boolean {
  return age >= 18;
}

export interface RelevantDependents {
  u13: number;
  plus13: number;
}

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
  multiCaseCapAppliedA: boolean;
  multiCaseCapAppliedB: boolean;
  // MAR/FAR cap explanations for multi-case scenarios
  marCapExplanationA?: string;
  marCapExplanationB?: string;
  farCapExplanationA?: string;
  farCapExplanationB?: string;
  // Non-parent carer fields (Formula 2/4)
  payerRole: PayerRole;
  paymentToNPC?: number;
  // Two NPC payment split (Formula 2/4)
  paymentToNPC1?: number;
  paymentToNPC2?: number;
}

/**
 * Result returned when calculation is bypassed due to complexity trap.
 * Used for lead generation instead of showing inaccurate estimates.
 */
export interface ComplexityTrapCalculationResult {
  /** Discriminator for type checking */
  resultType: 'COMPLEXITY_TRAP';
  /** Specific trap reason */
  trapReason: ComplexityTrapReason;
  /** Human-readable reason for UI display */
  displayReason: string;
}

/**
 * Union type for all possible calculation results
 */
export type CalculationResultUnion = CalculationResults | ComplexityTrapCalculationResult;

/**
 * Type guard to check if result is a complexity trap
 */
export function isComplexityTrap(
  result: CalculationResultUnion | null
): result is ComplexityTrapCalculationResult {
  return result !== null && 'resultType' in result && result.resultType === 'COMPLEXITY_TRAP';
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
 * Reasons for complexity trap - bypasses calculation for lead generation.
 */
export type ComplexityTrapReason =
  | 'FORMULA_4_NPC_MULTI_CASE' // NPC + either parent has other children
  | 'FORMULA_5_OVERSEAS' // NPC + parent living overseas
  | 'FORMULA_6_DECEASED'; // NPC + parent deceased

/**
 * Non-parent carer information (Formula 2/4).
 * A non-parent carer (e.g., grandparent) must have at least 35% care.
 * Eligibility is derived from per-child care amounts in ChildInput.careAmountNPC.
 */
export interface NonParentCarerInfo {
  enabled: boolean;
  /** Is either parent deceased? Triggers Formula 6 trap. */
  hasDeceasedParent?: boolean;
  /** Is either parent living overseas? Triggers Formula 5 trap. */
  hasOverseasParent?: boolean;
  /** Is there a second non-parent carer? (Formula 2/4 two NPC split) */
  hasSecondNPC?: boolean;
}

/**
 * Payer role determination for multi-case scenarios.
 */
export type PayerRole =
  | 'paying_parent'
  | 'receiving_parent'
  | 'both_paying'
  | 'neither';

export interface CalculatorFormState {
  incomeA: number;
  incomeB: number;
  supportA: boolean;
  supportB: boolean;
  children: ChildInput[];
  relDepA: RelevantDependents;
  relDepB: RelevantDependents;
  // Multi-case support (Formula 3)
  multiCaseA: MultiCaseInfo;
  multiCaseB: MultiCaseInfo;
  // Non-parent carer support (Formula 4)

  nonParentCarer: NonParentCarerInfo;
}
