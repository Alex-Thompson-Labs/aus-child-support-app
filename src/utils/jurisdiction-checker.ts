/**
 * Jurisdiction Checker for Formula 5 Eligibility
 * 
 * Determines if a country is reciprocating, excluded, or non-reciprocating
 * for Australian child support assessments.
 * 
 * - Reciprocating: Australia has agreement, standard assessment applies
 * - Excluded: Cannot accept Australian assessments, may need court order
 * - Non-reciprocating: No agreement, Formula 5 may apply
 */

import { EXCLUDED_JURISDICTIONS, RECIPROCATING_JURISDICTIONS } from './reciprocating-jurisdictions';

export type JurisdictionStatus = 'reciprocating' | 'excluded' | 'non-reciprocating';

/**
 * Check if a country is reciprocating, excluded, or non-reciprocating
 * 
 * @param country Country name (case-insensitive)
 * @returns Jurisdiction status
 */
export function checkJurisdictionStatus(country: string): JurisdictionStatus {
  if (!country || country.trim() === '') {
    return 'non-reciprocating';
  }
  
  const normalizedCountry = country.trim();
  
  // Check reciprocating jurisdictions (case-insensitive)
  const isReciprocating = RECIPROCATING_JURISDICTIONS.some(
    jurisdiction => jurisdiction.toLowerCase() === normalizedCountry.toLowerCase()
  );
  
  if (isReciprocating) {
    return 'reciprocating';
  }
  
  // Check excluded jurisdictions (case-insensitive)
  const isExcluded = EXCLUDED_JURISDICTIONS.some(
    jurisdiction => jurisdiction.toLowerCase() === normalizedCountry.toLowerCase()
  );
  
  if (isExcluded) {
    return 'excluded';
  }
  
  // Not in either list = non-reciprocating
  return 'non-reciprocating';
}

/**
 * Get human-readable explanation for jurisdiction status
 * 
 * @param status Jurisdiction status
 * @returns Plain-language explanation
 */
export function getJurisdictionExplanation(status: JurisdictionStatus): string {
  switch (status) {
    case 'reciprocating':
      return 'Australia has a child support agreement with this country. Standard assessment applies using both parents\' incomes.';
    case 'excluded':
      return 'This country is excluded from Australian child support assessments. You may need an Australian court order instead.';
    case 'non-reciprocating':
      return 'Australia cannot assess child support with this country. Formula 5 applies using only the Australian parent\'s income.';
  }
}

/**
 * Get detailed guidance for each jurisdiction status
 * 
 * @param status Jurisdiction status
 * @returns Detailed guidance object
 */
export function getJurisdictionGuidance(status: JurisdictionStatus): {
  title: string;
  message: string;
  nextSteps: string[];
  formulaApplies: 1 | 2 | 3 | 4 | 5 | null;
} {
  switch (status) {
    case 'reciprocating':
      return {
        title: 'Reciprocating Jurisdiction',
        message: 'Australia has a child support agreement with this country.',
        nextSteps: [
          'Both parents\' incomes will be assessed',
          'Standard formula applies (Formula 1-4)',
          'Assessment can be enforced in both countries',
        ],
        formulaApplies: null, // Standard formulas apply
      };
      
    case 'excluded':
      return {
        title: 'Excluded Jurisdiction',
        message: 'This country cannot accept Australian child support assessments.',
        nextSteps: [
          'You may need an Australian court order',
          'The court order can be sent to the other country',
          'Professional legal advice is strongly recommended',
        ],
        formulaApplies: null, // Court order required
      };
      
    case 'non-reciprocating':
      return {
        title: 'Non-Reciprocating Jurisdiction',
        message: 'Australia cannot assess child support with this country.',
        nextSteps: [
          'Formula 5 applies (simplified assessment)',
          'Only the Australian parent\'s income is assessed',
          'Enforcement may be limited',
          'Consider legal advice for enforcement options',
        ],
        formulaApplies: 5,
      };
  }
}

/**
 * Check if Formula 5 should be used based on jurisdiction status
 * 
 * @param status Jurisdiction status
 * @returns true if Formula 5 applies
 */
export function shouldUseFormula5(status: JurisdictionStatus): boolean {
  return status === 'non-reciprocating';
}

/**
 * Get urgency level for jurisdiction status (for UI styling)
 * 
 * @param status Jurisdiction status
 * @returns Urgency level
 */
export function getJurisdictionUrgency(status: JurisdictionStatus): 'low' | 'medium' | 'high' {
  switch (status) {
    case 'reciprocating':
      return 'low'; // Standard process
    case 'excluded':
      return 'high'; // Requires court order
    case 'non-reciprocating':
      return 'medium'; // Formula 5 applies but enforcement limited
  }
}
