/**
 * Lead Scoring Configuration
 *
 * Configurable scoring weights and thresholds for lead prioritization.
 * These values can be overridden for A/B testing different scoring strategies.
 */

// ============================================================================
// Types
// ============================================================================

export interface ScoringPoints {
  COURT_DATE_URGENT: number;       // Court date within urgency window
  COURT_DATE_FUTURE: number;       // Court date beyond urgency window
  INTERNATIONAL_JURISDICTION: number; // International case - high complexity
  PROPERTY_SETTLEMENT: number;      // Property settlement pending
  INCOME_ISSUES: number;            // Hidden assets or cash business
  HIGH_VALUE_CASE: number;          // Liability > threshold
  MULTIPLE_COMPLEXITY: number;      // 3+ special circumstances
  POST_SEPARATION_INCOME: number;   // PSI - common, valuable case
  SPECIAL_CIRCUMSTANCE: number;     // Other special circumstance
  SHARED_CARE_DISPUTE: number;      // Care arrangement 35-65%
  BINDING_AGREEMENT: number;        // Interest in binding agreement
}

export interface ScoringThresholds {
  HIGH_VALUE_THRESHOLD: number;           // Dollar amount for high-value cases
  COURT_DATE_URGENCY_DAYS: number;        // Days until court for urgency
  SHARED_CARE_MIN: number;                // Minimum % for shared care dispute
  SHARED_CARE_MAX: number;                // Maximum % for shared care dispute
  MULTIPLE_COMPLEXITY_THRESHOLD: number;  // Number of circumstances for complexity bonus
}

export interface ScoreCategoryThresholds {
  PREMIUM: number;      // Minimum score for Premium category (10+)
  HIGH_VALUE: number;   // Minimum score for High-Value category (7+)
  STANDARD: number;     // Minimum score for Standard category (4+)
  LOW_VALUE: number;    // Minimum score for Low-Value category (2+)
}

export interface ScoringConfig {
  points: ScoringPoints;
  thresholds: ScoringThresholds;
  categoryThresholds: ScoreCategoryThresholds;
  propertySettlementCircumstance: string;
  highValueCircumstances: string[];  // Circumstances with specific high-value scores (excluded from generic +4)
  incomeIssueTags: string[];
}

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_SCORING_POINTS: ScoringPoints = {
  COURT_DATE_URGENT: 10,
  COURT_DATE_FUTURE: 5,
  INTERNATIONAL_JURISDICTION: 8,
  PROPERTY_SETTLEMENT: 8,
  INCOME_ISSUES: 7,
  HIGH_VALUE_CASE: 6,
  SHARED_CARE_DISPUTE: 6,           // Increased from 3 to 6
  MULTIPLE_COMPLEXITY: 5,
  POST_SEPARATION_INCOME: 5,
  SPECIAL_CIRCUMSTANCE: 4,
  BINDING_AGREEMENT: 2,
} as const;

export const DEFAULT_SCORING_THRESHOLDS: ScoringThresholds = {
  HIGH_VALUE_THRESHOLD: 15000,
  COURT_DATE_URGENCY_DAYS: 30,
  SHARED_CARE_MIN: 35,
  SHARED_CARE_MAX: 65,
  MULTIPLE_COMPLEXITY_THRESHOLD: 3,
} as const;

export const DEFAULT_CATEGORY_THRESHOLDS: ScoreCategoryThresholds = {
  PREMIUM: 10,
  HIGH_VALUE: 7,
  STANDARD: 4,
  LOW_VALUE: 2,
} as const;

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  points: DEFAULT_SCORING_POINTS,
  thresholds: DEFAULT_SCORING_THRESHOLDS,
  categoryThresholds: DEFAULT_CATEGORY_THRESHOLDS,
  propertySettlementCircumstance: 'property_settlement_pending',
  highValueCircumstances: [
    'property_settlement_pending',
    'international_jurisdiction',
    'post_separation_income',
  ],
  incomeIssueTags: ['Hidden Assets', 'Cash Business'],
} as const;

// ============================================================================
// Example Alternative Configurations for A/B Testing
// ============================================================================

/**
 * Example: More aggressive scoring that prioritizes urgency
 */
export const URGENCY_FOCUSED_CONFIG: ScoringConfig = {
  ...DEFAULT_SCORING_CONFIG,
  points: {
    ...DEFAULT_SCORING_POINTS,
    COURT_DATE_URGENT: 15,        // Increased from 10
    COURT_DATE_FUTURE: 7,         // Increased from 5
    INTERNATIONAL_JURISDICTION: 10, // Increased from 8
  },
  thresholds: {
    ...DEFAULT_SCORING_THRESHOLDS,
    COURT_DATE_URGENCY_DAYS: 45,  // Extended window
  },
  highValueCircumstances: DEFAULT_SCORING_CONFIG.highValueCircumstances,
};

/**
 * Example: Value-focused scoring that prioritizes high-value cases
 */
export const VALUE_FOCUSED_CONFIG: ScoringConfig = {
  ...DEFAULT_SCORING_CONFIG,
  points: {
    ...DEFAULT_SCORING_POINTS,
    HIGH_VALUE_CASE: 10,          // Increased from 6
    INCOME_ISSUES: 9,             // Increased from 7
    PROPERTY_SETTLEMENT: 10,       // Increased from 8
  },
  thresholds: {
    ...DEFAULT_SCORING_THRESHOLDS,
    HIGH_VALUE_THRESHOLD: 12000,  // Lower threshold for "high value"
  },
  highValueCircumstances: DEFAULT_SCORING_CONFIG.highValueCircumstances,
};

/**
 * Example: Complexity-focused scoring
 */
export const COMPLEXITY_FOCUSED_CONFIG: ScoringConfig = {
  ...DEFAULT_SCORING_CONFIG,
  points: {
    ...DEFAULT_SCORING_POINTS,
    MULTIPLE_COMPLEXITY: 8,       // Increased from 5
    SPECIAL_CIRCUMSTANCE: 6,      // Increased from 4
  },
  highValueCircumstances: DEFAULT_SCORING_CONFIG.highValueCircumstances,
};
