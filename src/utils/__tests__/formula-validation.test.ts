/**
 * Comprehensive Formula Validation Tests
 * 
 * Tests Formulas 1, 2, and 3 against official Child Support Guide specifications
 * Reference: guides.dss.gov.au/child-support-guide
 */

import { calculateChildSupport } from '../calculateResults';
import { CalculatorFormState } from '../calculator';
import { AssessmentYear } from '../child-support-constants';

// Helper to create base form state
const createBaseFormState = (): CalculatorFormState => ({
  incomeA: 0,
  incomeB: 0,
  supportA: false,
  supportB: false,
  relDepA: { u13: 0, plus13: 0 },
  relDepB: { u13: 0, plus13: 0 },
  children: [],
  multiCaseA: { otherChildren: [] },
  multiCaseB: { otherChildren: [] },
  nonParentCarer: { enabled: false },
});

describe('Formula 1 - Basic Formula Tests', () => {
  const year: AssessmentYear = '2026';
  
  // Test constants for 2026
  const SSA = 31046;
  const MAR = 551;
  const FAR = 1825;
  const MAX_PPS = 26720;

  describe('Basic Calculation - Single Child', () => {
    test('F1-001: Standard case with one child, no edge cases', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 80000,
        incomeB: 60000,
        children: [{
          id: '1',
          age: 10,
          careAmountA: 290,
          careAmountB: 75,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      expect(result).not.toBeNull();
      expect(result?.resultType).not.toBe('COMPLEXITY_TRAP');
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // Step 1: CSI calculation
        const expectedCSI_A = 80000 - SSA; // 48,954
        const expectedCSI_B = 60000 - SSA; // 28,954
        
        expect(result.CSI_A).toBe(expectedCSI_A);
        expect(result.CSI_B).toBe(expectedCSI_B);
        
        // Step 2: CCSI
        const expectedCCSI = expectedCSI_A + expectedCSI_B; // 77,908
        expect(result.CCSI).toBe(expectedCCSI);
        
        // Step 3: Income percentages
        const expectedIncomePercA = (expectedCSI_A / expectedCCSI) * 100; // ~62.8%
        const expectedIncomePercB = (expectedCSI_B / expectedCCSI) * 100; // ~37.2%
        
        expect(result.incomePercA).toBeCloseTo(expectedIncomePercA, 1);
        expect(result.incomePercB).toBeCloseTo(expectedIncomePercB, 1);
        
        // Step 4-5: Care and cost percentages
        // 290 nights = 79.5% → rounds to 80% → cost = 76%
        // 75 nights = 20.5% → rounds to 21% → cost = 24%
        expect(result.childResults[0].roundedCareA).toBe(80);
        expect(result.childResults[0].roundedCareB).toBe(21);
        expect(result.childResults[0].costPercA).toBe(76);
        expect(result.childResults[0].costPercB).toBe(24);
        
        // Step 6: Child support percentages
        const expectedCSPercA = expectedIncomePercA - 76;
        const expectedCSPercB = expectedIncomePercB - 24;
        
        expect(result.childResults[0].childSupportPercA).toBeCloseTo(expectedCSPercA, 1);
        expect(result.childResults[0].childSupportPercB).toBeCloseTo(expectedCSPercB, 1);
        
        // One parent should have positive CS%, other negative
        expect(result.payer).toBeDefined();
        expect(result.receiver).toBeDefined();
        expect(result.finalPaymentAmount).toBeGreaterThan(0);
      }
    });

    test('F1-002: Equal shared care (50/50)', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 100000,
        incomeB: 60000,
        children: [{
          id: '1',
          age: 8,
          careAmountA: 183,
          careAmountB: 182,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      expect(result).not.toBeNull();
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // 183 nights = 50.1% → rounds to 50% → cost = 50%
        // 182 nights = 49.9% → rounds to 50% → cost = 50%
        expect(result.childResults[0].roundedCareA).toBe(50);
        expect(result.childResults[0].roundedCareB).toBe(50);
        expect(result.childResults[0].costPercA).toBe(50);
        expect(result.childResults[0].costPercB).toBe(50);
        
        // Higher income parent should pay
        expect(result.payer).toBe('Parent A');
        expect(result.finalPaymentAmount).toBeGreaterThan(0);
      }
    });

    test('F1-003: Multiple children, different ages', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 90000,
        incomeB: 70000,
        children: [
          {
            id: '1',
            age: 6,
            careAmountA: 0,
            careAmountB: 365,
            carePeriod: 'year',
          },
          {
            id: '2',
            age: 14,
            careAmountA: 0,
            careAmountB: 365,
            carePeriod: 'year',
          },
        ],
      };

      const result = calculateChildSupport(formState, year);
      
      expect(result).not.toBeNull();
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // Parent A has 0% care → 0% cost
        // Parent B has 100% care → 100% cost
        expect(result.childResults[0].costPercA).toBe(0);
        expect(result.childResults[0].costPercB).toBe(100);
        expect(result.childResults[1].costPercA).toBe(0);
        expect(result.childResults[1].costPercB).toBe(100);
        
        // Parent A should pay (higher income, no care)
        expect(result.payer).toBe('Parent A');
        
        // Should use mixed age COTC table
        expect(result.totalCost).toBeGreaterThan(0);
      }
    });
  });

  describe('Care Percentage Boundaries', () => {
    test('F1-004: Below regular care (13%)', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 80000,
        incomeB: 60000,
        children: [{
          id: '1',
          age: 10,
          careAmountA: 47, // 12.9% → rounds to 13%
          careAmountB: 318,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        expect(result.childResults[0].roundedCareA).toBe(13);
        expect(result.childResults[0].costPercA).toBe(0); // Below 14% = 0%
      }
    });

    test('F1-005: Regular care threshold (14%)', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 80000,
        incomeB: 60000,
        children: [{
          id: '1',
          age: 10,
          careAmountA: 52, // 14.2% → rounds to 14%
          careAmountB: 313,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        expect(result.childResults[0].roundedCareA).toBe(14);
        expect(result.childResults[0].costPercA).toBe(24); // 14% = 24%
      }
    });

    test('F1-006: Shared care threshold (35%)', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 80000,
        incomeB: 60000,
        children: [{
          id: '1',
          age: 10,
          careAmountA: 128, // 35.1% → rounds to 35%
          careAmountB: 237,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        expect(result.childResults[0].roundedCareA).toBe(35);
        expect(result.childResults[0].costPercA).toBe(25); // 35% = 25%
      }
    });

    test('F1-007: Primary care threshold (66%)', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 80000,
        incomeB: 60000,
        children: [{
          id: '1',
          age: 10,
          careAmountA: 241, // 66.0% → rounds to 66%
          careAmountB: 124,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        expect(result.childResults[0].roundedCareA).toBe(66);
        expect(result.childResults[0].costPercA).toBe(76); // 66% = 76%
      }
    });
  });

  describe('MAR (Minimum Annual Rate) Tests', () => {
    test('F1-008: MAR applies - receives income support, low care', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 28000,
        incomeB: 80000,
        supportA: true, // Receives income support
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0,
          careAmountB: 365,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // MAR should apply for Parent A
        expect(result.MAR_A).toBe(MAR);
        expect(result.rateApplied).toContain('MAR');
        expect(result.finalLiabilityA).toBe(MAR);
      }
    });

    test('F1-009: MAR does NOT apply - has regular care (14%+)', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 28000,
        incomeB: 80000,
        supportA: true,
        children: [{
          id: '1',
          age: 10,
          careAmountA: 52, // 14.2% → 14% (regular care)
          careAmountB: 313,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // MAR should NOT apply (has regular care)
        expect(result.MAR_A).toBe(0);
      }
    });

    test('F1-010: MAR does NOT apply - no income support', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 28000,
        incomeB: 80000,
        supportA: false, // No income support
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0,
          careAmountB: 365,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // MAR should NOT apply, FAR might apply instead
        expect(result.MAR_A).toBe(0);
      }
    });
  });

  describe('FAR (Fixed Annual Rate) Tests', () => {
    test('F1-011: FAR applies - low income, no support, low care', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 25000, // Below SSA
        incomeB: 80000,
        supportA: false, // No income support
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0,
          careAmountB: 365,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // FAR should apply for Parent A
        expect(result.FAR_A).toBe(FAR);
        expect(result.rateApplied).toContain('FAR');
      }
    });

    test('F1-012: FAR capped at 3 children', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 25000,
        incomeB: 80000,
        supportA: false,
        children: [
          { id: '1', age: 6, careAmountA: 0, careAmountB: 365, carePeriod: 'year' },
          { id: '2', age: 8, careAmountA: 0, careAmountB: 365, carePeriod: 'year' },
          { id: '3', age: 10, careAmountA: 0, careAmountB: 365, carePeriod: 'year' },
          { id: '4', age: 12, careAmountA: 0, careAmountB: 365, carePeriod: 'year' },
        ],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // FAR should be capped at 3 children
        expect(result.FAR_A).toBe(FAR * 3);
      }
    });

    test('F1-013: FAR does NOT apply - has shared care (35%+)', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 25000,
        incomeB: 80000,
        supportA: false,
        children: [{
          id: '1',
          age: 10,
          careAmountA: 128, // 35% care
          careAmountB: 237,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // FAR should NOT apply (has 35%+ care)
        expect(result.FAR_A).toBe(0);
      }
    });
  });

  describe('Relevant Dependents', () => {
    test('F1-014: Relevant dependent reduces CSI', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 80000,
        incomeB: 60000,
        relDepA: { u13: 1, plus13: 0 }, // 1 child under 13
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0,
          careAmountB: 365,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // CSI should be reduced by relevant dependent deductible
        expect(result.relDepDeductibleA).toBeGreaterThan(0);
        expect(result.CSI_A).toBe(80000 - SSA - result.relDepDeductibleA);
      }
    });
  });

  describe('Adult Children (18+)', () => {
    test('F1-015: Adult child excluded from calculation', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 80000,
        incomeB: 60000,
        children: [{
          id: '1',
          age: 18,
          careAmountA: 0,
          careAmountB: 365,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // Adult child should be flagged
        expect(result.childResults[0].isAdultChild).toBe(true);
        // Cost per child should be 0
        expect(result.childResults[0].costPerChild).toBe(0);
        // No liability
        expect(result.finalPaymentAmount).toBe(0);
      }
    });

    test('F1-016: Child turning 18', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 80000,
        incomeB: 60000,
        children: [{
          id: '1',
          age: 17,
          careAmountA: 0,
          careAmountB: 365,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // Should be flagged as turning 18
        expect(result.childResults[0].isTurning18).toBe(true);
        // But still included in calculation
        expect(result.childResults[0].costPerChild).toBeGreaterThan(0);
      }
    });
  });
});

describe('Formula 3 - Multi-Case Tests', () => {
  const year: AssessmentYear = '2026';
  const SSA = 31046;

  describe('Multi-Case Allowance', () => {
    test('F3-001: Parent A has other case - allowance reduces CSI', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 100000,
        incomeB: 60000,
        multiCaseA: {
          otherChildren: [{ age: 6 }], // 1 child in another case
        },
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0,
          careAmountB: 365,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // Multi-case allowance should be calculated
        expect(result.multiCaseAllowanceA).toBeGreaterThan(0);
        
        // CSI should be reduced by allowance
        const expectedPreliminaryCSI = 100000 - SSA;
        expect(result.CSI_A).toBe(expectedPreliminaryCSI - result.multiCaseAllowanceA);
        
        // Parent B should have no allowance
        expect(result.multiCaseAllowanceB).toBe(0);
      }
    });

    test('F3-002: Both parents have other cases', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 100000,
        incomeB: 80000,
        multiCaseA: {
          otherChildren: [{ age: 6 }],
        },
        multiCaseB: {
          otherChildren: [{ age: 8 }],
        },
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0,
          careAmountB: 365,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // Both should have allowances
        expect(result.multiCaseAllowanceA).toBeGreaterThan(0);
        expect(result.multiCaseAllowanceB).toBeGreaterThan(0);
      }
    });

    test('F3-003: Multiple other children', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 120000,
        incomeB: 60000,
        multiCaseA: {
          otherChildren: [{ age: 6 }, { age: 8 }], // 2 children in other cases
        },
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0,
          careAmountB: 365,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // Allowance should account for both other children
        expect(result.multiCaseAllowanceA).toBeGreaterThan(0);
      }
    });
  });

  describe('Multi-Case Cap', () => {
    test('F3-004: Multi-case cap applied', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 150000,
        incomeB: 50000,
        multiCaseA: {
          otherChildren: [{ age: 6 }, { age: 8 }],
        },
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0,
          careAmountB: 365,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // Check if cap was applied
        const child = result.childResults[0];
        if (child.multiCaseCapA !== undefined) {
          expect(child.multiCaseCapA).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('MAR/FAR Multi-Case Caps', () => {
    test('F3-005: MAR capped across multiple cases', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 28000,
        incomeB: 80000,
        supportA: true,
        multiCaseA: {
          otherChildren: [{ age: 6 }], // 1 other case (2 total)
        },
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0,
          careAmountB: 365,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // MAR should be split across cases
        expect(result.MAR_A).toBeGreaterThan(0);
        expect(result.marCapExplanationA).toBeDefined();
      }
    });
  });
});

console.log('Formula validation tests created. Run with: npm test tests/formula-validation.test.ts');
