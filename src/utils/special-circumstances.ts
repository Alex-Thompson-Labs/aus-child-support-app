/**
 * Complexity Triggers - Simplified User-Facing Reasons
 *
 * This module defines simplified, plain-language reasons for complexity triggers
 * that map to official Services Australia Change of Assessment grounds.
 * Users see conversational language; lawyers receive official codes.
 *
 * @module special-circumstances
 */

/**
 * Category of complexity trigger for UI grouping
 */
export type ComplexityCategory = 'urgent' | 'income' | 'child' | 'other';

/**
 * Represents a complexity trigger that may warrant legal review
 */
export interface SpecialCircumstance {
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
  readonly officialCodes: readonly string[];
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
export const SPECIAL_CIRCUMSTANCES: readonly SpecialCircumstance[] = [
  // Note: Court date reasons are now dynamic (e.g., court_12_Jan_2026)
  // See createCourtDateReasonId() function below
  {
    id: 'post_separation_income',
    label: 'I have earned extra income (second job/overtime) since we separated.',
    description:
      'Income from a pattern established after separation can be excluded from your ATI for up to 3 years.',
    category: 'income',
    priority: 2,
    officialCodes: ['3.5'] as const,
  },
  {
    id: 'income_resources_not_reflected',
    label:
      'The other parent has income or assets not reflected in their tax return.',
    description:
      "When someone's tax return doesn't reflect their true financial position—such as hidden income, cash businesses, trust distributions, investment property, or other assets—a lawyer can help investigate and present evidence to the Registrar or the Court. This requires specialized knowledge of income sources, business structures, and non-taxable resources.",
    category: 'income',
    priority: 4,
    officialCodes: ['5.2.8'] as const,
  },
  {
    id: 'earning_capacity',
    label: 'The other parent chooses to earn less than they are capable of.',
    description:
      'Earning capacity assessments are complex—lawyers know how to prove someone is deliberately underemployed or not working to their full potential. The Registrar needs specific evidence and legal arguments to adjust for earning capacity.',
    category: 'income',
    priority: 5,
    officialCodes: ['5.2.9'] as const,
  },
  {
    id: 'school_fees',
    label: 'There are high costs for private school or special education.',
    description:
      'Private school fees and special educational costs beyond standard assumptions require legal arguments for proper consideration in assessments.',
    category: 'child',
    priority: 6,
    officialCodes: ['5.2.3'] as const,
  },
  {
    id: 'special_needs',
    label: 'My child(ren) has special needs or high care costs.',
    description:
      'Cases involving disability, medical conditions, or special educational needs require detailed documentation and legal expertise. Lawyers understand what evidence the Registrar requires and how to present care costs that exceed standard assumptions.',
    category: 'child',
    priority: 7,
    officialCodes: ['5.2.2', '5.2.3'] as const,
  },
  {
    id: 'contact_costs',
    label: 'I have high travel costs to spend time with my child(ren).',
    description:
      'Significant travel costs for maintaining contact with children can be grounds for adjustment, but require proper documentation and legal presentation.',
    category: 'child',
    priority: 8,
    officialCodes: ['5.2.1'] as const,
  },
  {
    id: 'high_childcare_costs',
    label: 'I have high childcare costs.',
    description:
      'When childcare costs are significantly higher than what the standard formula accounts for—such as full-time daycare, before/after school care, or holiday programs—a lawyer can help present evidence for an adjustment.',
    category: 'child',
    priority: 9,
    officialCodes: ['5.2.6'] as const,
  },
  {
    id: 'property_settlement',
    label: 'I have a property settlement pending.',
    description:
      'Pending property settlements can significantly affect child support obligations. A lawyer can help ensure the settlement is properly considered in your assessment.',
    category: 'other',
    priority: 3,
    officialCodes: ['5.2.11'] as const,
  },
  {
    id: 'international_jurisdiction',
    label: 'The other parent lives outside of Australia.',
    description:
      'International cases involve complex rules regarding reciprocating and excluded jurisdictions.',
    category: 'other',
    priority: 5,
    officialCodes: ['1.5.1'] as const,
  },
  {
    id: 'child_resources',
    label: 'My child(ren) has their own income or financial resources.',
    description:
      "When a child has their own income, assets, or financial resources, this can affect the fairness of the child support assessment. Lawyers understand how to present evidence of the child's resources and argue for appropriate adjustments.",
    category: 'other',
    priority: 10,
    officialCodes: ['5.2.4'] as const,
  },
  {
    id: 'duty_to_maintain',
    label: 'I have a duty to support another person or child.',
    description:
      'If you have a legal duty to maintain another person or child, or have necessary expenses supporting them, this can significantly affect your capacity to pay child support. This includes costs of caring for another child, high contact costs with another child, or support obligations to another person.',
    category: 'other',
    priority: 11,
    officialCodes: ['5.2.9', '5.2.10'] as const,
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
 * const reason = getSpecialCircumstanceById('income_not_reflected');
 * if (reason) {
 *   console.log(reason.label); // "Income not accurately reflected in ATI"
 * }
 * ```
 */
export function getSpecialCircumstanceById(
  id: string
): SpecialCircumstance | null {
  if (!id || typeof id !== 'string') {
    return null;
  }

  // Check if it's a dynamic court date reason
  if (isCourtDateReason(id)) {
    const date = parseCourtDateFromReasonId(id);
    if (date) {
      return getCourtDateReason(date);
    }
    return null;
  }

  // Otherwise, look up static reason
  const reason = SPECIAL_CIRCUMSTANCES.find((r) => r.id === id);
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
): SpecialCircumstance | null {
  if (!selectedIds || !Array.isArray(selectedIds) || selectedIds.length === 0) {
    return null;
  }

  // Filter to valid reasons only
  const validReasons = selectedIds
    .map((id) => getSpecialCircumstanceById(id))
    .filter((reason): reason is SpecialCircumstance => reason !== null);

  if (validReasons.length === 0) {
    return null;
  }

  // Sort by priority (lower number = more urgent) and return the most urgent
  return validReasons.reduce((highest, current) =>
    current.priority < highest.priority ? current : highest
  );
}

/**
 * Type guard to check if a value is a valid SpecialCircumstance ID
 *
 * @param id - The value to check
 * @returns True if the ID corresponds to a valid reason
 */
export function isValidSpecialCircumstanceId(id: unknown): id is string {
  return typeof id === 'string' && getSpecialCircumstanceById(id) !== null;
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
  const displayInfo: Record<
    ComplexityCategory,
    { title: string; accentColor: string }
  > = {
    urgent: { title: 'Urgent Matters', accentColor: '#dc2626' }, // red-600
    income: { title: 'Income Issues', accentColor: '#d97706' }, // amber-600
    child: { title: 'Costs & Other Factors', accentColor: '#7c3aed' }, // violet-600
    other: { title: 'Costs & Other Factors', accentColor: '#7c3aed' }, // violet-600
  };

  return displayInfo[category];
}

/**
 * Formats official CoA reason codes for a given reason
 *
 * @param reason - The complexity trigger reason
 * @returns Formatted string of official reason codes (e.g., "Reason 8A, 8B")
 */
export function formatOfficialCodes(reason: SpecialCircumstance): string {
  if (!reason.officialCodes || reason.officialCodes.length === 0) {
    return '';
  }

  // Map codes to readable names
  const codeNames: Record<string, string> = {
    '5.2.1': 'Reason 1 (High costs of contact)',
    '5.2.2': 'Reason 2 (Special needs care costs)',
    '5.2.3': 'Reason 3 (High costs of caring/educating child)',
    '5.2.4': "Reason 4 (Child's income/resources)",
    '5.2.5': 'Reason 5 (Property settlement impacts capacity)',
    '5.2.6': 'Reason 6 (High childcare costs)',
    '5.2.7': 'Reason 7 (Reduced capacity - commitments)',
    '5.2.8': 'Reason 8A (Income/property/resources)',
    '5.2.9': 'Reason 8B (Earning capacity)',
    '5.2.10': 'Reason 9 (Duty to maintain another person)',
    '5.2.11': 'Reason 10 (Other special circumstances)',
  };

  return reason.officialCodes.map((code) => codeNames[code] || code).join(', ');
}

/**
 * Creates a dynamic court date reason ID from a date
 * Format: court_DD_MMM_YYYY (e.g., court_12_Jan_2026)
 *
 * @param date - The court date
 * @returns Formatted reason ID
 *
 * @example
 * ```typescript
 * const date = new Date('2026-01-12');
 * const id = createCourtDateReasonId(date);
 * // Returns: 'court_12_Jan_2026'
 * ```
 */
export function createCourtDateReasonId(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `court_${day}_${month}_${year}`;
}

/**
 * Checks if a reason ID is a court date reason
 *
 * @param id - The reason ID to check
 * @returns True if the ID matches the court date pattern
 *
 * @example
 * ```typescript
 * isCourtDateReason('court_12_Jan_2026'); // true
 * isCourtDateReason('income_resources_not_reflected'); // false
 * ```
 */
export function isCourtDateReason(id: string): boolean {
  return (
    id === 'court_date_pending' || /^court_\d{2}_[A-Z][a-z]{2}_\d{4}$/.test(id)
  );
}

/**
 * Parses a court date from a reason ID
 *
 * @param id - The court date reason ID
 * @returns The parsed date, or null if invalid
 *
 * @example
 * ```typescript
 * const date = parseCourtDateFromReasonId('court_12_Jan_2026');
 * // Returns: Date object for January 12, 2026
 * ```
 */
export function parseCourtDateFromReasonId(id: string): Date | null {
  if (!isCourtDateReason(id)) {
    return null;
  }

  try {
    // Extract parts: court_12_Jan_2026 -> ['12', 'Jan', '2026']
    const parts = id.replace('court_', '').split('_');
    if (parts.length !== 3) return null;

    const [day, month, year] = parts;

    // Parse date using standard format
    const dateStr = `${day} ${month} ${year}`;
    const parsed = new Date(dateStr);

    // Validate the date is valid
    if (isNaN(parsed.getTime())) {
      return null;
    }

    return parsed;
  } catch (error) {
    // TODO: Replace with proper error reporting service
    return null;
  }
}

/**
 * Gets a user-facing label for a court date reason
 *
 * @param date - The court date
 * @returns Formatted label for display
 *
 * @example
 * ```typescript
 * const date = new Date('2026-01-12');
 * const label = getCourtDateReasonLabel(date);
 * // Returns: 'I have an upcoming court date (12 Jan 2026)'
 * ```
 */
export function getCourtDateReasonLabel(date: Date): string {
  const formatted = date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `I have an upcoming court hearing regarding child support. (${formatted})`;
}

/**
 * Gets a SpecialCircumstance object for a court date
 * This allows court date reasons to be treated like static reasons
 *
 * @param date - The court date
 * @returns A SpecialCircumstance object
 */
export function getCourtDateReason(date: Date): SpecialCircumstance {
  return {
    id: createCourtDateReasonId(date),
    label: getCourtDateReasonLabel(date),
    description:
      'Upcoming court dates are critical events. Professional legal preparation is strongly recommended to protect your interests before your appearance.',
    category: 'urgent',
    priority: 1,
    officialCodes: ['5.2.11'] as const,
  };
}
