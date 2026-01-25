/**
 * Formula 6 Calculator Tests
 * 
 * Tests for non-parent carer assessments when one parent is deceased.
 * 
 * Key test scenarios:
 * - Basic calculation (single income, no doubling/halving)
 * - Multi-case scenarios (surviving parent has other children)
 * - Two non-parent carers (payment split)
 * - Edge cases (zero income, 100% care, minimum rates)
 * - Comparison with Formula 5 (different results expected)
 */

import { AssessmentYear } from '../child-support-constants';
import { calculateFormula6, validateFormula6Input, type Formula6Input } from '../formula-6-calculator';

describe('Formula 6 Calculator', () => {
  const selectedYear: AssessmentYear = '2025';
  
  // ============================================================================
  // Validation Tests
  // ============================================================================
  
  describe('validateFormula6Input', () => {
    it('should accept valid input', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = validateFormula6Input(input);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
    
    it('should reject negative income', () => {
      const input: Formula6Input = {
        survivingParentATI: -1000,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = validateFormula6Input(input);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('negative');
    });
    
    it('should reject invalid care percentage', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 150,
        children: [{ age: 10 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = validateFormula6Input(input);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('between 0 and 100');
    });
    
    it('should reject empty children array', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 0,
        children: [],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = validateFormula6Input(input);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('At least one child');
    });
    
    it('should reject two carers with invalid care percentages', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 2,
        carer1CarePercentage: 60,
        carer2CarePercentage: 30, // Total = 90%, not 100%
        selectedYear,
      };
      
      const result = validateFormula6Input(input);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('total 100%');
    });
  });
  
  // ============================================================================
  // Basic Calculation Tests
  // ============================================================================
  
  describe('calculateFormula6 - Basic Scenarios', () => {
    it('should calculate with single income (NO doubling)', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      expect(result.formulaUsed).toBe(6);
      expect(result.survivingParentATI).toBe(80000);
      expect(result.survivingParentCSI).toBeGreaterThan(0);
      
      // Income should NOT be doubled (key difference from Formula 5)
      // COTC should be based on single income
      expect(result.cotc).toBeGreaterThan(0);
      expect(result.cotc).toBeLessThan(25000); // Would be ~25k if doubled
    });
    
    it('should NOT halve the final rate', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      // Annual rate should equal COTC minus cost share (NO halving)
      const expectedRate = result.cotc - result.parentCostShare;
      expect(result.annualRate).toBeCloseTo(expectedRate, 2);
    });
    
    it('should calculate with 0% care (parent has no care)', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      expect(result.parentCarePercentage).toBe(0);
      expect(result.parentCostPercentage).toBe(0);
      expect(result.parentCostShare).toBe(0);
      expect(result.annualRate).toBe(result.cotc);
    });
    
    it('should calculate with partial care (35% care)', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 35,
        children: [{ age: 10 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      expect(result.parentCarePercentage).toBe(35);
      expect(result.parentCostPercentage).toBeGreaterThan(0);
      expect(result.parentCostShare).toBeGreaterThan(0);
      expect(result.annualRate).toBeLessThan(result.cotc);
    });
    
    it('should calculate monthly and fortnightly rates', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      expect(result.monthlyRate).toBeCloseTo(result.annualRate / 12, 2);
      expect(result.fortnightlyRate).toBeCloseTo(result.annualRate / 26, 2);
    });
  });
  
  // ============================================================================
  // Multi-Case Tests
  // ============================================================================
  
  describe('calculateFormula6 - Multi-Case Scenarios', () => {
    it('should apply multi-case allowance', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }],
        hasMultipleCases: true,
        otherCaseChildren: [{ id: 'other1', age: 8 }],
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      expect(result.multiCaseAllowance).toBeGreaterThan(0);
      expect(result.adjustedCSI).toBeLessThan(result.survivingParentCSI + result.multiCaseAllowance);
    });
    
    it('should apply multi-case cap when applicable', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }],
        hasMultipleCases: true,
        otherCaseChildren: [{ id: 'other1', age: 8 }, { id: 'other2', age: 6 }],
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      expect(result.multiCaseCap).toBeDefined();
      expect(result.multiCaseCap).toBeGreaterThan(0);
      
      // If cap is applied, annual rate should equal cap
      if (result.multiCaseCapApplied) {
        expect(result.annualRate).toBe(result.multiCaseCap);
      }
    });
    
    it('should handle multiple children in current case', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }, { age: 8 }, { age: 6 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      expect(result.childResults).toHaveLength(3);
      expect(result.cotc).toBeGreaterThan(0);
      
      // Cost per child should be COTC divided by number of children
      const expectedCostPerChild = result.cotc / 3;
      result.childResults.forEach(child => {
        if (!child.isAdultChild) {
          expect(child.costPerChild).toBeCloseTo(expectedCostPerChild, 2);
        }
      });
    });
  });
  
  // ============================================================================
  // Two Non-Parent Carers Tests
  // ============================================================================
  
  describe('calculateFormula6 - Two Non-Parent Carers', () => {
    it('should split payment between two carers proportionally', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 2,
        carer1CarePercentage: 60,
        carer2CarePercentage: 40,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      expect(result.paymentToCarer1).toBeDefined();
      expect(result.paymentToCarer2).toBeDefined();
      
      // Payments should be proportional to care percentages
      expect(result.paymentToCarer1).toBeCloseTo(result.annualRate * 0.6, 2);
      expect(result.paymentToCarer2).toBeCloseTo(result.annualRate * 0.4, 2);
      
      // Total should equal annual rate
      const total = (result.paymentToCarer1 || 0) + (result.paymentToCarer2 || 0);
      expect(total).toBeCloseTo(result.annualRate, 2);
    });
    
    it('should handle 50/50 split', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 2,
        carer1CarePercentage: 50,
        carer2CarePercentage: 50,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      expect(result.paymentToCarer1).toBeCloseTo(result.annualRate * 0.5, 2);
      expect(result.paymentToCarer2).toBeCloseTo(result.annualRate * 0.5, 2);
    });
    
    it('should handle unequal split (70/30)', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 2,
        carer1CarePercentage: 70,
        carer2CarePercentage: 30,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      expect(result.paymentToCarer1).toBeCloseTo(result.annualRate * 0.7, 2);
      expect(result.paymentToCarer2).toBeCloseTo(result.annualRate * 0.3, 2);
    });
  });
  
  // ============================================================================
  // Edge Cases
  // ============================================================================
  
  describe('calculateFormula6 - Edge Cases', () => {
    it('should handle zero income', () => {
      const input: Formula6Input = {
        survivingParentATI: 0,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      expect(result.survivingParentCSI).toBe(0);
      expect(result.cotc).toBe(0);
      expect(result.annualRate).toBe(0);
    });
    
    it('should handle income below SSA', () => {
      const input: Formula6Input = {
        survivingParentATI: 20000, // Below SSA threshold
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      // CSI should be 0 when income is below SSA
      expect(result.survivingParentCSI).toBe(0);
      expect(result.cotc).toBe(0);
      expect(result.annualRate).toBe(0);
    });
    
    it('should handle 100% care (parent has full care)', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 100,
        children: [{ age: 10 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      expect(result.parentCarePercentage).toBe(100);
      expect(result.parentCostPercentage).toBe(100);
      expect(result.parentCostShare).toBe(result.cotc);
      expect(result.annualRate).toBe(0); // Parent pays nothing (has full care)
    });
    
    it('should exclude adult children (18+) from calculation', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }, { age: 18 }, { age: 20 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      expect(result.childResults).toHaveLength(3);
      
      // Adult children should have zero cost
      const adultChildren = result.childResults.filter(c => c.isAdultChild);
      expect(adultChildren).toHaveLength(2);
      adultChildren.forEach(child => {
        expect(child.costPerChild).toBe(0);
      });
      
      // Only one child (age 10) should contribute to COTC
      const assessableChildren = result.childResults.filter(c => !c.isAdultChild);
      expect(assessableChildren).toHaveLength(1);
    });
    
    it('should handle very high income', () => {
      const input: Formula6Input = {
        survivingParentATI: 500000,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      expect(result.survivingParentCSI).toBeGreaterThan(400000);
      expect(result.cotc).toBeGreaterThan(0);
      expect(result.annualRate).toBeGreaterThan(0);
    });
  });
  
  // ============================================================================
  // Comparison with Formula 5
  // ============================================================================
  
  describe('Formula 6 vs Formula 5 Comparison', () => {
    it('should produce different result than Formula 5 for same income', () => {
      // This test documents the key difference between Formula 5 and Formula 6
      // Formula 5: Doubles income, calculates COTC, then halves result
      // Formula 6: Uses single income, calculates COTC, no halving
      
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const formula6Result = calculateFormula6(input);
      
      // Formula 6 characteristics:
      // - Uses single income (NOT doubled)
      // - No halving of final rate
      // - Result typically higher than Formula 5 for same income
      
      expect(formula6Result.formulaUsed).toBe(6);
      expect(formula6Result.survivingParentCSI).toBeGreaterThan(0);
      expect(formula6Result.annualRate).toBeGreaterThan(0);
      
      // COTC should be based on single income (lower than Formula 5)
      // But no halving means final rate may be higher
      expect(formula6Result.cotc).toBeLessThan(25000); // Would be ~25k if doubled
    });
  });
  
  // ============================================================================
  // Child Results Tests
  // ============================================================================
  
  describe('calculateFormula6 - Child Results', () => {
    it('should provide detailed breakdown for each child', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 0,
        children: [{ age: 10 }, { age: 15 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      expect(result.childResults).toHaveLength(2);
      
      result.childResults.forEach(child => {
        expect(child.age).toBeDefined();
        expect(child.ageRange).toBeDefined();
        expect(child.costPerChild).toBeGreaterThanOrEqual(0);
        expect(child.isAdultChild).toBeDefined();
      });
    });
    
    it('should mark adult children correctly', () => {
      const input: Formula6Input = {
        survivingParentATI: 80000,
        survivingParentCarePercentage: 0,
        children: [{ age: 17 }, { age: 18 }, { age: 19 }],
        hasMultipleCases: false,
        numberOfNonParentCarers: 1,
        selectedYear,
      };
      
      const result = calculateFormula6(input);
      
      expect(result.childResults[0].isAdultChild).toBe(false); // 17
      expect(result.childResults[1].isAdultChild).toBe(true);  // 18
      expect(result.childResults[2].isAdultChild).toBe(true);  // 19
    });
  });
});
