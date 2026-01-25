/**
 * Formula 5 Calculator Tests
 * 
 * Tests the Formula 5 calculation logic for non-parent carer scenarios
 * with one parent in a non-reciprocating jurisdiction.
 */

import type { Formula5Input } from '../formula-5-calculator';
import { calculateFormula5, validateFormula5Input } from '../formula-5-calculator';

describe('Formula 5 Calculator', () => {
  // Base test input
  const baseInput: Formula5Input = {
    availableParentATI: 80000,
    availableParentCarePercentage: 0,
    children: [{ age: 10 }],
    hasMultipleCases: false,
    numberOfNonParentCarers: 1,
    reason: 'non-reciprocating',
    overseasParentCountry: 'China',
    selectedYear: 2025,
  };

  describe('Validation', () => {
    it('should validate correct input', () => {
      const result = validateFormula5Input(baseInput);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject negative income', () => {
      const result = validateFormula5Input({
        ...baseInput,
        availableParentATI: -1000,
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('negative');
    });

    it('should reject invalid care percentage', () => {
      const result = validateFormula5Input({
        ...baseInput,
        availableParentCarePercentage: 150,
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('between 0 and 100');
    });

    it('should reject no children', () => {
      const result = validateFormula5Input({
        ...baseInput,
        children: [],
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('At least one child');
    });

    it('should reject invalid two-carer percentages', () => {
      const result = validateFormula5Input({
        ...baseInput,
        numberOfNonParentCarers: 2,
        carer1CarePercentage: 60,
        carer2CarePercentage: 30, // Should total 100
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('total 100%');
    });
  });

  describe('Income Doubling', () => {
    it('should double available parent CSI', () => {
      const result = calculateFormula5(baseInput);
      
      // CSI = ATI - SSA - multi-case allowance (if any)
      // For 2025: SSA = 29,619
      // 80000 - 29619 = 50381 (preliminary CSI)
      expect(result.availableParentCSI).toBeGreaterThan(0);
      
      // Doubled income = CSI * 2
      expect(result.doubledIncome).toBe(result.availableParentCSI * 2);
    });

    it('should handle zero income', () => {
      const result = calculateFormula5({
        ...baseInput,
        availableParentATI: 0,
      });
      
      expect(result.availableParentCSI).toBe(0);
      expect(result.doubledIncome).toBe(0);
    });

    it('should handle income below SSA', () => {
      const result = calculateFormula5({
        ...baseInput,
        availableParentATI: 20000, // Below SSA of 28463
      });
      
      expect(result.availableParentCSI).toBe(0);
      expect(result.doubledIncome).toBe(0);
    });
  });

  describe('Rate Halving', () => {
    it('should halve the final rate', () => {
      const result = calculateFormula5(baseInput);
      
      // Annual rate after halving should be half of before halving
      expect(result.annualRateAfterHalving).toBe(result.annualRateBeforeHalving * 0.5);
    });

    it('should apply halving after cost calculations', () => {
      const result = calculateFormula5(baseInput);
      
      // Verify the calculation flow:
      // 1. COTC calculated from doubled income
      // 2. Parent cost share calculated
      // 3. Rate before halving = COTC - parent cost share
      // 4. Rate after halving = rate before halving * 0.5
      
      const expectedBeforeHalving = result.cotc - result.parentCostShare;
      expect(result.annualRateBeforeHalving).toBeCloseTo(expectedBeforeHalving, 0);
      expect(result.annualRateAfterHalving).toBeCloseTo(expectedBeforeHalving * 0.5, 0);
    });
  });

  describe('Multi-case Scenarios', () => {
    it('should calculate multi-case allowance', () => {
      const result = calculateFormula5({
        ...baseInput,
        hasMultipleCases: true,
        otherCaseChildren: [{ id: 'other1', age: 8 }],
      });
      
      expect(result.multiCaseAllowance).toBeGreaterThan(0);
      // Adjusted CSI should be less than or equal to preliminary CSI
      expect(result.adjustedCSI).toBeLessThanOrEqual(result.availableParentCSI);
    });

    it('should apply multi-case cap when applicable', () => {
      const result = calculateFormula5({
        ...baseInput,
        hasMultipleCases: true,
        otherCaseChildren: [{ id: 'other1', age: 8 }, { id: 'other2', age: 12 }],
      });
      
      if (result.multiCaseCapApplied) {
        expect(result.annualRate).toBe(result.multiCaseCap);
        expect(result.annualRate).toBeLessThan(result.annualRateAfterHalving);
      }
    });
  });

  describe('Two Carer Payment Split', () => {
    it('should split payment proportionally between two carers', () => {
      const result = calculateFormula5({
        ...baseInput,
        numberOfNonParentCarers: 2,
        carer1CarePercentage: 60,
        carer2CarePercentage: 40,
      });
      
      expect(result.paymentToCarer1).toBeDefined();
      expect(result.paymentToCarer2).toBeDefined();
      
      // Verify proportional split
      expect(result.paymentToCarer1).toBeCloseTo(result.annualRate * 0.6, 0);
      expect(result.paymentToCarer2).toBeCloseTo(result.annualRate * 0.4, 0);
      
      // Verify total equals annual rate
      const total = (result.paymentToCarer1 || 0) + (result.paymentToCarer2 || 0);
      expect(total).toBeCloseTo(result.annualRate, 0);
    });

    it('should handle equal split (50/50)', () => {
      const result = calculateFormula5({
        ...baseInput,
        numberOfNonParentCarers: 2,
        carer1CarePercentage: 50,
        carer2CarePercentage: 50,
      });
      
      expect(result.paymentToCarer1).toBeCloseTo(result.annualRate * 0.5, 0);
      expect(result.paymentToCarer2).toBeCloseTo(result.annualRate * 0.5, 0);
    });
  });

  describe('Adult Children', () => {
    it('should exclude adult children (18+) from calculation', () => {
      const result = calculateFormula5({
        ...baseInput,
        children: [{ age: 10 }, { age: 18 }, { age: 20 }],
      });
      
      // Only one child (age 10) should be included
      const assessableChildren = result.childResults.filter(c => !c.isAdultChild);
      expect(assessableChildren.length).toBe(1);
      
      // Adult children should have zero cost
      const adultChildren = result.childResults.filter(c => c.isAdultChild);
      adultChildren.forEach(child => {
        expect(child.costPerChild).toBe(0);
      });
    });
  });

  describe('Periodic Rates', () => {
    it('should calculate monthly and fortnightly rates', () => {
      const result = calculateFormula5(baseInput);
      
      expect(result.monthlyRate).toBeCloseTo(result.annualRate / 12, 2);
      expect(result.fortnightlyRate).toBeCloseTo(result.annualRate / 26, 2);
    });
  });

  describe('Result Metadata', () => {
    it('should include formula number and reason', () => {
      const result = calculateFormula5(baseInput);
      
      expect(result.formulaUsed).toBe(5);
      expect(result.reason).toBe('non-reciprocating');
      expect(result.overseasParentCountry).toBe('China');
    });

    it('should handle special circumstances reason', () => {
      const result = calculateFormula5({
        ...baseInput,
        reason: 'special-circumstances',
      });
      
      expect(result.reason).toBe('special-circumstances');
    });
  });

  describe('Edge Cases', () => {
    it('should handle parent with 100% care (unusual for NPC scenario)', () => {
      const result = calculateFormula5({
        ...baseInput,
        availableParentCarePercentage: 100,
      });
      
      // Parent has 100% care = 100% cost percentage
      // Parent cost share = 100% of COTC
      // Rate before halving = COTC - COTC = 0
      expect(result.parentCostPercentage).toBe(100);
      expect(result.annualRateBeforeHalving).toBe(0);
      expect(result.annualRate).toBe(0);
    });

    it('should handle multiple children of different ages', () => {
      const result = calculateFormula5({
        ...baseInput,
        children: [{ age: 5 }, { age: 10 }, { age: 15 }],
      });
      
      expect(result.childResults.length).toBe(3);
      expect(result.cotc).toBeGreaterThan(0);
    });

    it('should handle very high income', () => {
      const result = calculateFormula5({
        ...baseInput,
        availableParentATI: 500000,
      });
      
      expect(result.availableParentCSI).toBeGreaterThan(0);
      expect(result.doubledIncome).toBeGreaterThan(0);
      expect(result.annualRate).toBeGreaterThan(0);
    });
  });
});
