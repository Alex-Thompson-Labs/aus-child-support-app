/**
 * Tests for Complexity Triggers integration in complexity detection
 *
 * Updated for redesigned messaging (Task 2.6):
 * - 5 core reasons instead of 10
 * - Plain language labels instead of bureaucratic terms
 * - Category-based grouping instead of urgency-only
 * - Official CoA codes maintained for lawyers
 */

import type { CalculationResults } from '../../types/calculator';
import { detectComplexity, formatCoAReasonsForLead, getAlertConfig } from '../complexity-detection';

// Base calculation results for testing (low value, no other flags)
const baseResults: CalculationResults = {
  ATI_A: 60000,
  ATI_B: 40000,
  relDepDeductibleA: 0,
  relDepDeductibleB: 0,
  SSA: 35168,
  FAR: 90000,
  MAR: 45000,
  MAX_PPS: 18000,
  CSI_A: 60000,
  CSI_B: 40000,
  CCSI: 100000,
  incomePercA: 60,
  incomePercB: 40,
  totalCost: 12000,
  childResults: [],
  totalLiabilityA: 8000,
  totalLiabilityB: 0,
  finalLiabilityA: 8000,
  finalLiabilityB: 0,
  FAR_A: 90000,
  FAR_B: 45000,
  MAR_A: 45000,
  MAR_B: 22500,
  rateApplied: 'standard',
  payer: 'Parent A',
  receiver: 'Parent B',
  finalPaymentAmount: 8000,
};

describe('detectComplexity - Complexity Triggers Integration', () => {
  describe('Edge Case: selectedCoAReasons is undefined', () => {
    it('should handle undefined selectedCoAReasons gracefully', () => {
      const flags = detectComplexity(baseResults, {});
      
      expect(flags.specialCircumstances).toBe(false);
      expect(() => detectComplexity(baseResults, {})).not.toThrow();
    });

    it('should not crash when formData is explicitly undefined', () => {
      const flags = detectComplexity(baseResults, { selectedCoAReasons: undefined });
      
      expect(flags.specialCircumstances).toBe(false);
    });
  });

  describe('Edge Case: selectedCoAReasons is empty array', () => {
    it('should return false for specialCircumstances when array is empty', () => {
      const flags = detectComplexity(baseResults, { selectedCoAReasons: [] });
      
      expect(flags.specialCircumstances).toBe(false);
    });
  });

  describe('Edge Case: selectedCoAReasons has 1 income reason (high priority)', () => {
    it('should detect income reason: income_lifestyle_mismatch', () => {
      const flags = detectComplexity(baseResults, {
        selectedCoAReasons: ['income_lifestyle_mismatch']
      });

      expect(flags.specialCircumstances).toBe(true);
    });

    it('should detect income reason: earning_capacity', () => {
      const flags = detectComplexity(baseResults, {
        selectedCoAReasons: ['earning_capacity']
      });

      expect(flags.specialCircumstances).toBe(true);
    });
  });

  describe('Edge Case: selectedCoAReasons has 1 child/other reason', () => {
    it('should detect child reason: special_needs', () => {
      const flags = detectComplexity(baseResults, {
        selectedCoAReasons: ['special_needs']
      });

      expect(flags.specialCircumstances).toBe(true);
    });

    it('should detect other reason: property_settlement', () => {
      const flags = detectComplexity(baseResults, { 
        selectedCoAReasons: ['property_settlement'] 
      });
      
      expect(flags.specialCircumstances).toBe(true);
    });
  });

  describe('Edge Case: selectedCoAReasons has mix of urgent + normal', () => {
    it('should detect special circumstances with mixed priority reasons', () => {
      const flags = detectComplexity(baseResults, { 
        selectedCoAReasons: ['income_not_reflected', 'school_fees'] 
      });
      
      expect(flags.specialCircumstances).toBe(true);
    });
  });

  describe('Edge Case: selectedCoAReasons has invalid ID', () => {
    it('should handle invalid IDs gracefully and not crash', () => {
      const flags = detectComplexity(baseResults, { 
        selectedCoAReasons: ['invalid_id_12345'] 
      });
      
      // Invalid ID still counts as "something selected" for flag purposes
      // But getAlertConfig should handle this gracefully
      expect(flags.specialCircumstances).toBe(true);
      expect(() => detectComplexity(baseResults, { 
        selectedCoAReasons: ['invalid_id_12345'] 
      })).not.toThrow();
    });

    it('should handle mix of valid and invalid IDs', () => {
      const flags = detectComplexity(baseResults, { 
        selectedCoAReasons: ['invalid_id', 'income_not_reflected', 'another_invalid'] 
      });
      
      expect(flags.specialCircumstances).toBe(true);
    });

    it('should handle all invalid IDs', () => {
      const flags = detectComplexity(baseResults, { 
        selectedCoAReasons: ['invalid_1', 'invalid_2', 'invalid_3'] 
      });
      
      expect(flags.specialCircumstances).toBe(true);
    });
  });
});

describe('getAlertConfig - Change of Assessment Integration', () => {
  describe('Alert urgency based on priority', () => {
    it('should return HIGH urgency for priority 1 reason (income_not_reflected)', () => {
      const flags = detectComplexity(baseResults, { 
        selectedCoAReasons: ['income_not_reflected'] 
      });
      const alert = getAlertConfig(flags, baseResults, { 
        selectedCoAReasons: ['income_not_reflected'] 
      });
      
      expect(alert).not.toBeNull();
      expect(alert?.urgency).toBe('high');
      expect(alert?.title).toContain('URGENT');
      expect(alert?.title).toContain('Income not accurately reflected');
    });

    it('should return HIGH urgency for priority 2 reason (business_income)', () => {
      const flags = detectComplexity(baseResults, { 
        selectedCoAReasons: ['business_income'] 
      });
      const alert = getAlertConfig(flags, baseResults, { 
        selectedCoAReasons: ['business_income'] 
      });
      
      expect(alert?.urgency).toBe('high');
      expect(alert?.title).toContain('URGENT');
    });

    it('should return HIGH urgency for priority 3 reason (trust_distributions)', () => {
      const flags = detectComplexity(baseResults, { 
        selectedCoAReasons: ['trust_distributions'] 
      });
      const alert = getAlertConfig(flags, baseResults, { 
        selectedCoAReasons: ['trust_distributions'] 
      });
      
      expect(alert?.urgency).toBe('high');
      expect(alert?.title).toContain('URGENT');
    });

    it('should return MEDIUM urgency for priority 4-10 reasons', () => {
      const flags = detectComplexity(baseResults, { 
        selectedCoAReasons: ['school_fees'] 
      });
      const alert = getAlertConfig(flags, baseResults, { 
        selectedCoAReasons: ['school_fees'] 
      });
      
      expect(alert?.urgency).toBe('medium');
      expect(alert?.title).not.toContain('URGENT');
      expect(alert?.title).toContain('Change of Assessment');
    });
  });

  describe('Multiple reasons handling', () => {
    it('should show count when multiple urgent reasons selected', () => {
      const flags = detectComplexity(baseResults, { 
        selectedCoAReasons: ['income_not_reflected', 'business_income', 'trust_distributions'] 
      });
      const alert = getAlertConfig(flags, baseResults, { 
        selectedCoAReasons: ['income_not_reflected', 'business_income', 'trust_distributions'] 
      });
      
      expect(alert?.urgency).toBe('high');
      expect(alert?.title).toContain('3 Factors');
      expect(alert?.message).toContain('Multiple Change of Assessment grounds');
    });

    it('should show count when multiple normal reasons selected', () => {
      const flags = detectComplexity(baseResults, { 
        selectedCoAReasons: ['school_fees', 'contact_costs'] 
      });
      const alert = getAlertConfig(flags, baseResults, { 
        selectedCoAReasons: ['school_fees', 'contact_costs'] 
      });
      
      expect(alert?.urgency).toBe('medium');
      expect(alert?.title).toContain('2 Factors');
    });

    it('should use highest priority for urgency when mix selected', () => {
      const flags = detectComplexity(baseResults, { 
        selectedCoAReasons: ['income_not_reflected', 'school_fees', 'contact_costs'] 
      });
      const alert = getAlertConfig(flags, baseResults, { 
        selectedCoAReasons: ['income_not_reflected', 'school_fees', 'contact_costs'] 
      });
      
      // Should be urgent because income_not_reflected (priority 1) is included
      expect(alert?.urgency).toBe('high');
      expect(alert?.title).toContain('3 Factors');
    });
  });

  describe('Edge case: Invalid IDs in getAlertConfig', () => {
    it('should handle all invalid IDs and show fallback message', () => {
      const flags = detectComplexity(baseResults, { 
        selectedCoAReasons: ['invalid_1', 'invalid_2'] 
      });
      const alert = getAlertConfig(flags, baseResults, { 
        selectedCoAReasons: ['invalid_1', 'invalid_2'] 
      });
      
      // Should return fallback generic message
      expect(alert).not.toBeNull();
      expect(alert?.title).toContain('Special Circumstances');
      expect(alert?.urgency).toBe('medium');
    });

    it('should filter out invalid IDs when mixed with valid', () => {
      const flags = detectComplexity(baseResults, { 
        selectedCoAReasons: ['invalid_id', 'income_not_reflected'] 
      });
      const alert = getAlertConfig(flags, baseResults, { 
        selectedCoAReasons: ['invalid_id', 'income_not_reflected'] 
      });
      
      // Should only count the valid reason
      expect(alert?.title).toContain('Income not accurately reflected');
      expect(alert?.urgency).toBe('high');
    });
  });

  describe('Edge case: getHighestPriorityReason returns null', () => {
    it('should handle when flag is true but formData is missing', () => {
      const flags = { 
        ...detectComplexity(baseResults, {}), 
        specialCircumstances: true // Manually set flag
      };
      const alert = getAlertConfig(flags, baseResults); // No formData
      
      // Should show fallback message
      expect(alert).not.toBeNull();
      expect(alert?.title).toContain('Special Circumstances');
    });

    it('should handle when selectedCoAReasons becomes undefined after detection', () => {
      const flags = detectComplexity(baseResults, { 
        selectedCoAReasons: ['income_not_reflected'] 
      });
      // Pass empty formData to getAlertConfig
      const alert = getAlertConfig(flags, baseResults, {});
      
      expect(alert).not.toBeNull();
      expect(alert?.title).toContain('Special Circumstances');
    });
  });

  describe('XSS prevention in reason labels', () => {
    it('should sanitize reason labels (handled internally by our safe data)', () => {
      const flags = detectComplexity(baseResults, { 
        selectedCoAReasons: ['income_not_reflected'] 
      });
      const alert = getAlertConfig(flags, baseResults, { 
        selectedCoAReasons: ['income_not_reflected'] 
      });
      
      // Our data doesn't have XSS but verify sanitization happens
      expect(alert?.title).not.toContain('<');
      expect(alert?.title).not.toContain('>');
      expect(alert?.message).not.toContain('<');
      expect(alert?.message).not.toContain('>');
    });
  });
});

describe('formatCoAReasonsForLead - Lead Data Generation', () => {
  describe('Edge case: undefined/null input', () => {
    it('should return null for undefined', () => {
      const result = formatCoAReasonsForLead(undefined);
      expect(result).toBeNull();
    });

    it('should return null for null', () => {
      const result = formatCoAReasonsForLead(null);
      expect(result).toBeNull();
    });

    it('should return null for empty array', () => {
      const result = formatCoAReasonsForLead([]);
      expect(result).toBeNull();
    });
  });

  describe('Valid single reason', () => {
    it('should format urgent reason correctly', () => {
      const result = formatCoAReasonsForLead(['income_not_reflected']);
      
      expect(result).not.toBeNull();
      expect(result?.count).toBe(1);
      expect(result?.reasons).toHaveLength(1);
      expect(result?.reasons[0].urgency).toBe('URGENT');
      expect(result?.reasons[0].label).toContain('Income not accurately reflected');
      expect(result?.formattedText).toContain('CHANGE OF ASSESSMENT GROUNDS');
      expect(result?.formattedText).toContain('priority: URGENT');
    });

    it('should format normal reason correctly', () => {
      const result = formatCoAReasonsForLead(['school_fees']);
      
      expect(result).not.toBeNull();
      expect(result?.count).toBe(1);
      expect(result?.reasons[0].urgency).toBe('Normal');
      expect(result?.formattedText).toContain('priority: Normal');
    });
  });

  describe('Multiple reasons', () => {
    it('should sort by priority (most urgent first)', () => {
      const result = formatCoAReasonsForLead([
        'school_fees',           // priority 9
        'income_not_reflected',  // priority 1
        'property_settlement'    // priority 5
      ]);
      
      expect(result).not.toBeNull();
      expect(result?.count).toBe(3);
      expect(result?.reasons).toHaveLength(3);
      
      // Should be sorted: income_not_reflected, property_settlement, school_fees
      expect(result?.reasons[0].label).toContain('Income not accurately reflected');
      expect(result?.reasons[1].label).toContain('Property settlement');
      expect(result?.reasons[2].label).toContain('Private school fees');
    });

    it('should format multiple reasons in email template', () => {
      const result = formatCoAReasonsForLead([
        'income_not_reflected',
        'school_fees'
      ]);
      
      expect(result?.formattedText).toContain('1. Income not accurately reflected');
      expect(result?.formattedText).toContain('2. Private school fees');
      expect(result?.formattedText).toContain('→'); // Description separator
    });
  });

  describe('Invalid IDs', () => {
    it('should filter out invalid IDs and return null if all invalid', () => {
      const result = formatCoAReasonsForLead(['invalid_1', 'invalid_2']);
      
      expect(result).toBeNull();
    });

    it('should filter out invalid IDs and process valid ones', () => {
      const result = formatCoAReasonsForLead([
        'invalid_id',
        'income_not_reflected',
        'another_invalid'
      ]);
      
      expect(result).not.toBeNull();
      expect(result?.count).toBe(1);
      expect(result?.reasons[0].label).toContain('Income not accurately reflected');
    });
  });

  describe('XSS prevention', () => {
    it('should sanitize labels and descriptions', () => {
      const result = formatCoAReasonsForLead(['income_not_reflected']);
      
      // Verify no HTML tags in output
      expect(result?.reasons[0].label).not.toContain('<');
      expect(result?.reasons[0].label).not.toContain('>');
      expect(result?.reasons[0].description).not.toContain('<');
      expect(result?.reasons[0].description).not.toContain('>');
      expect(result?.formattedText).not.toContain('<script>');
    });
  });

  describe('Email template format', () => {
    it('should include all required fields for lawyer email', () => {
      const result = formatCoAReasonsForLead(['income_not_reflected', 'school_fees']);
      
      // Check structure
      expect(result?.formattedText).toContain('CHANGE OF ASSESSMENT GROUNDS:');
      expect(result?.formattedText).toContain('1. ');
      expect(result?.formattedText).toContain('2. ');
      expect(result?.formattedText).toContain('priority:');
      expect(result?.formattedText).toContain('→');
      
      // Check both labels and descriptions are included
      expect(result?.formattedText).toContain('Income not accurately reflected');
      expect(result?.formattedText).toContain('Private school fees');
    });
  });
});

describe('Integration: Full workflow', () => {
  it('should handle complete workflow from detection to alert to lead data', () => {
    const formData = {
      selectedCoAReasons: ['income_not_reflected', 'school_fees']
    };

    // Step 1: Detect complexity
    const flags = detectComplexity(baseResults, formData);
    expect(flags.specialCircumstances).toBe(true);

    // Step 2: Get alert
    const alert = getAlertConfig(flags, baseResults, formData);
    expect(alert).not.toBeNull();
    expect(alert?.urgency).toBe('high'); // Highest priority wins
    expect(alert?.title).toContain('2 Factors');

    // Step 3: Format for lawyers
    const leadData = formatCoAReasonsForLead(formData.selectedCoAReasons);
    expect(leadData).not.toBeNull();
    expect(leadData?.count).toBe(2);
    expect(leadData?.formattedText).toContain('CHANGE OF ASSESSMENT GROUNDS');
  });
});


