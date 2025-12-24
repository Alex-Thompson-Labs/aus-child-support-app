/**
 * Change of Assessment Reasons - Services Australia Official Grounds
 *
 * This module defines the official reasons for requesting a Change of Assessment
 * under the Child Support (Assessment) Act 1989, as recognized by Services Australia.
 *
 * @module change-of-assessment-reasons
 */

/**
 * Represents a valid reason for requesting a Change of Assessment
 */
export interface ChangeOfAssessmentReason {
  /** Unique identifier for the reason */
  readonly id: string;
  /** User-facing label displayed in UI */
  readonly label: string;
  /** Detailed description for help tooltips and guidance */
  readonly description: string;
  /** Priority level (1 = highest urgency, 10 = lowest) for alert sorting */
  readonly priority: number;
}

/**
 * Official Change of Assessment reasons recognized by Services Australia.
 *
 * Priority levels reflect the urgency and impact on the assessment:
 * - 1-3: Critical income/capacity issues requiring immediate attention
 * - 4-6: Significant financial circumstances affecting capacity to pay
 * - 7-9: Valid grounds but lower urgency
 * - 10: Catch-all for other circumstances
 *
 * @constant
 */
export const CHANGE_OF_ASSESSMENT_REASONS: readonly ChangeOfAssessmentReason[] = [
  {
    id: 'income_not_reflected',
    label: 'Income not accurately reflected in ATI',
    description: 'Your actual income is significantly different from your Adjusted Taxable Income (ATI). This includes income that should be included but is not, or income that has significantly changed since your last tax return.',
    priority: 1,
  },
  {
    id: 'business_income',
    label: 'Business or partnership income not captured',
    description: 'You earn income from a business or partnership that is not accurately reflected in your ATI. This may include retained earnings, director fees, or other business-related income.',
    priority: 2,
  },
  {
    id: 'trust_distributions',
    label: 'Trust distributions not in ATI',
    description: 'You receive distributions from trusts that are not included in your ATI, or trust income is being diverted to minimize child support obligations.',
    priority: 3,
  },
  {
    id: 'other_income',
    label: 'Other substantial income (rental, investments, overseas)',
    description: 'You have significant income from rental properties, investments, overseas sources, or other sources not captured in your ATI.',
    priority: 4,
  },
  {
    id: 'property_settlement',
    label: 'Property settlement impacts capacity to pay',
    description: 'A family law property settlement has significantly affected your financial capacity to pay or receive child support. This includes asset transfers, debts assumed, or ongoing obligations.',
    priority: 5,
  },
  {
    id: 'supporting_children',
    label: 'Supporting other children (relevant dependents)',
    description: 'You are financially supporting other children who are not included in the assessment. This affects your capacity to pay child support.',
    priority: 6,
  },
  {
    id: 'childcare_costs',
    label: 'High costs of child care (medical, disability, special needs)',
    description: 'You incur high child care costs due to the child\'s medical conditions, disability, or special needs that go beyond standard care expenses.',
    priority: 7,
  },
  {
    id: 'contact_costs',
    label: 'High costs of contact (travel for visitation)',
    description: 'You incur substantial travel costs to maintain contact with the child due to geographic distance. These costs significantly impact your capacity to pay.',
    priority: 8,
  },
  {
    id: 'school_fees',
    label: 'Private school fees',
    description: 'You are paying private school fees or other significant educational expenses for the child that are not reflected in the standard assessment.',
    priority: 9,
  },
  {
    id: 'other_circumstances',
    label: 'Other special circumstances',
    description: 'You have other special circumstances not covered by the standard reasons that make the current assessment unjust or inequitable. You will need to provide detailed evidence.',
    priority: 10,
  },
] as const;

/**
 * Retrieves a Change of Assessment reason by its unique identifier.
 *
 * @param id - The unique identifier of the reason to retrieve
 * @returns The matching ChangeOfAssessmentReason, or null if not found
 *
 * @example
 * ```typescript
 * const reason = getCoAReasonById('income_not_reflected');
 * if (reason) {
 *   console.log(reason.label); // "Income not accurately reflected in ATI"
 * }
 * ```
 */
export function getCoAReasonById(id: string): ChangeOfAssessmentReason | null {
  if (!id || typeof id !== 'string') {
    return null;
  }

  const reason = CHANGE_OF_ASSESSMENT_REASONS.find(r => r.id === id);
  return reason ?? null;
}

/**
 * Finds the highest priority reason from a list of selected reason IDs.
 * Priority is determined by the lowest priority number (1 = highest priority).
 *
 * @param selectedIds - Array of reason IDs to evaluate
 * @returns The highest priority reason from the selected IDs, or null if none are valid
 *
 * @example
 * ```typescript
 * const ids = ['school_fees', 'income_not_reflected', 'invalid_id'];
 * const topReason = getHighestPriorityReason(ids);
 * // Returns the 'income_not_reflected' reason (priority 1)
 * ```
 */
export function getHighestPriorityReason(
  selectedIds: string[] | undefined | null
): ChangeOfAssessmentReason | null {
  if (!selectedIds || !Array.isArray(selectedIds) || selectedIds.length === 0) {
    return null;
  }

  // Filter to valid reasons only
  const validReasons = selectedIds
    .map(id => getCoAReasonById(id))
    .filter((reason): reason is ChangeOfAssessmentReason => reason !== null);

  if (validReasons.length === 0) {
    return null;
  }

  // Sort by priority (ascending) and return the first (highest priority)
  return validReasons.reduce((highest, current) =>
    current.priority < highest.priority ? current : highest
  );
}

/**
 * Type guard to check if a value is a valid ChangeOfAssessmentReason ID
 *
 * @param id - The value to check
 * @returns True if the ID corresponds to a valid reason
 */
export function isValidCoAReasonId(id: unknown): id is string {
  return typeof id === 'string' && getCoAReasonById(id) !== null;
}

/**
 * Gets all reason IDs as a typed array
 *
 * @returns Array of all valid reason IDs
 */
export function getAllCoAReasonIds(): readonly string[] {
  return CHANGE_OF_ASSESSMENT_REASONS.map(r => r.id);
}
