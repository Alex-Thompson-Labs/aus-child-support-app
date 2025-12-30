/**
 * Complexity Triggers - Simplified User-Facing Reasons
 *
 * This module defines simplified, plain-language reasons for complexity triggers
 * that map to official Services Australia Change of Assessment grounds.
 * Users see conversational language; lawyers receive official CoA reason codes.
 *
 * @module change-of-assessment-reasons
 */

/**
 * Category of complexity trigger for UI grouping
 */
export type ComplexityCategory = 'urgent' | 'income' | 'child' | 'other';

/**
 * Represents a complexity trigger that may warrant legal review
 */
export interface ChangeOfAssessmentReason {
  /** Unique identifier for the reason */
  readonly id: string;
  /** User-facing label in plain language (problem-focused) */
  readonly label: string;
  /** Description emphasizing complexity and why lawyer is needed */
  readonly description: string;
  /** Category for UI grouping: income issues, child-related, or other factors */
  readonly category: ComplexityCategory;
  /** Priority for sorting alerts (1-10, where 1 is most urgent) */
  readonly priority: number;
  /** Maps to official Services Australia CoA reason codes (e.g., '5.2.8', '5.2.9') */
  readonly officialCoAReasons: readonly string[];
}

/**
 * Simplified complexity triggers that map to official CoA grounds.
 *
 * Categories:
 * - income: Issues with reported income vs actual financial position (most common)
 * - child: Child-specific care or educational needs
 * - other: Property settlements or other circumstances
 *
 * Each reason maps to one or more official Services Australia CoA reason codes
 * for legal accuracy in lawyer communications.
 *
 * @constant
 */
export const CHANGE_OF_ASSESSMENT_REASONS: readonly ChangeOfAssessmentReason[] = [
  {
    id: 'court_date_upcoming',
    label: "I have an upcoming court date for child support matters",
    description: "Upcoming court dates are critical events. Professional legal preparation is strongly recommended to protect your interests before your appearance.",
    category: 'urgent',
    priority: 1,
    officialCoAReasons: ['5.2.11'] as const,
  },
  {
    id: 'income_resources_not_reflected',
    label: "Is the other parent hiding any income, property or financial resources that are not reflected in their taxable income",
    description: "When someone's tax return doesn't reflect their true financial position—such as hidden income, cash businesses, trust distributions, investment property, or other assets—a lawyer can help investigate and present evidence to the Registrar or the Court. This requires specialized knowledge of income sources, business structures, and non-taxable resources.",
    category: 'income',
    priority: 4,
    officialCoAReasons: ['5.2.8'] as const,
  },
  {
    id: 'earning_capacity',
    label: "Taxable income below the other parent's earning capacity",
    description: "Earning capacity assessments are complex—lawyers know how to prove someone is deliberately underemployed or not working to their full potential. The Registrar needs specific evidence and legal arguments to adjust for earning capacity.",
    category: 'income',
    priority: 5,
    officialCoAReasons: ['5.2.9'] as const,
  },
  {
    id: 'school_fees',
    label: "Private school fees or educational costs",
    description: "Private school fees and special educational costs beyond standard assumptions require legal arguments for proper consideration in assessments.",
    category: 'child',
    priority: 6,
    officialCoAReasons: ['5.2.3'] as const,
  },
  {
    id: 'special_needs',
    label: "Your child has special needs or high care costs",
    description: "Cases involving disability, medical conditions, or special educational needs require detailed documentation and legal expertise. Lawyers understand what evidence the Registrar requires and how to present care costs that exceed standard assumptions.",
    category: 'child',
    priority: 7,
    officialCoAReasons: ['5.2.2', '5.2.3'] as const,
  },
  {
    id: 'contact_costs',
    label: "High costs of contact (travel for visitation)",
    description: "Significant travel costs for maintaining contact with children can be grounds for adjustment, but require proper documentation and legal presentation.",
    category: 'child',
    priority: 8,
    officialCoAReasons: ['5.2.1'] as const,
  },
  {
    id: 'property_settlement',
    label: "Is there a property settlement to come?",
    description: "Pending property settlements can significantly affect child support obligations. A lawyer can help ensure the settlement is properly considered in your assessment.",
    category: 'other',
    priority: 3,
    officialCoAReasons: ['5.2.11'] as const,
  },
  {
    id: 'child_resources',
    label: "The child has income, property or financial resources",
    description: "When a child has their own income, assets, or financial resources, this can affect the fairness of the child support assessment. Lawyers understand how to present evidence of the child's resources and argue for appropriate adjustments.",
    category: 'other',
    priority: 10,
    officialCoAReasons: ['5.2.4'] as const,
  },
  {
    id: 'duty_to_maintain',
    label: "Necessary commitments to support another person or child",
    description: "If you have a legal duty to maintain another person or child, or have necessary expenses supporting them, this can significantly affect your capacity to pay child support. This includes costs of caring for another child, high contact costs with another child, or support obligations to another person.",
    category: 'other',
    priority: 11,
    officialCoAReasons: ['5.2.9', '5.2.10'] as const,
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
 * Finds the most important reason from a list of selected reason IDs.
 * Importance is determined by priority: lower priority numbers are more urgent (1 is most urgent).
 *
 * @param selectedIds - Array of reason IDs to evaluate
 * @returns The most important reason from the selected IDs, or null if none are valid
 *
 * @example
 * ```typescript
 * const ids = ['property_settlement', 'income_not_reflected', 'invalid_id'];
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

  // Sort by priority (lower number = more urgent) and return the most urgent
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

/**
 * Gets the display info for a complexity category
 *
 * @param category - The complexity category
 * @returns Display title and accent color for the category
 */
export function getCategoryDisplayInfo(category: ComplexityCategory): {
  title: string;
  accentColor: string;
} {
  const displayInfo: Record<ComplexityCategory, { title: string; accentColor: string }> = {
    urgent: { title: 'Urgent Matters', accentColor: '#dc2626' }, // red-600
    income: { title: 'Income Issues', accentColor: '#d97706' }, // amber-600
    child: { title: 'High Costs & Financial Obligations', accentColor: '#7c3aed' }, // violet-600
    other: { title: 'Other Factors', accentColor: '#0891b2' }, // cyan-600
  };

  return displayInfo[category];
}

/**
 * Formats official CoA reason codes for a given reason
 *
 * @param reason - The complexity trigger reason
 * @returns Formatted string of official reason codes (e.g., "Reason 8A, 8B")
 */
export function formatOfficialCoAReasons(reason: ChangeOfAssessmentReason): string {
  if (!reason.officialCoAReasons || reason.officialCoAReasons.length === 0) {
    return '';
  }

  // Map codes to readable names
  const codeNames: Record<string, string> = {
    '5.2.1': 'Reason 1 (High costs of contact)',
    '5.2.2': 'Reason 2 (Special needs care costs)',
    '5.2.3': 'Reason 3 (High costs of caring/educating child)',
    '5.2.4': "Reason 4 (Child's income/resources)",
    '5.2.5': 'Reason 5 (Property settlement impacts capacity)',
    '5.2.6': 'Reason 6 (High child care costs)',
    '5.2.7': 'Reason 7 (Reduced capacity - commitments)',
    '5.2.8': 'Reason 8A (Income/property/resources)',
    '5.2.9': 'Reason 8B (Earning capacity)',
    '5.2.10': 'Reason 9 (Duty to maintain another person)',
    '5.2.11': 'Reason 10 (Other special circumstances)',
  };

  return reason.officialCoAReasons
    .map(code => codeNames[code] || code)
    .join(', ');
}
