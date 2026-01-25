/**
 * Formula 2 Validation Tests - Non-Parent Carer
 * 
 * Tests Formula 2 against official Child Support Guide specifications
 * Reference: guides.dss.gov.au/child-support-guide/2/2/3
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

describe('Formula 2 - Non-Parent Carer Tests', () => {
  const year: AssessmentYear = '2026';

  describe('NPC Eligibility and Basic Calculation', () => {
    test('F2-001: NPC with 35% care - minimum threshold', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 80000,
        incomeB: 60000,
        nonParentCarer: { enabled: true },
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0,
          careAmountB: 128, // 35.1% → 35%
          careAmountNPC: 237, // 64.9% → 65%
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      expect(result).not.toBeNull();
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // NPC should have care and cost percentages
        const child = result.childResults[0];
        expect(child.roundedCareNPC).toBe(65);
        expect(child.costPercNPC).toBeGreaterThan(0);
        
        // Should have payment to NPC
        expect(result.paymentToNPC).toBeGreaterThan(0);
      }
    });

    test('F2-002: NPC with less than 35% care - should not trigger Formula 2', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 80000,
        incomeB: 60000,
        nonParentCarer: { enabled: true },
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0,
          careAmountB: 240, // 65.8%
          careAmountNPC: 125, // 34.2% → 34% (below 35%)
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        const child = result.childResults[0];
        expect(child.roundedCareNPC).toBe(34);
        
        // Should not have significant payment to NPC (below threshold)
        // Payment should go to Parent B instead
        expect(result.payer).toBe('Parent A');
        expect(result.receiver).toBe('Parent B');
      }
    });

    test('F2-003: NPC income is NOT used in calculation', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 80000,
        incomeB: 60000,
        nonParentCarer: { enabled: true },
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0,
          careAmountB: 0,
          careAmountNPC: 365, // 100% care
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // CCSI should only include parent incomes
        const expectedCCSI = (80000 - 31046) + (60000 - 31046);
        expect(result.CCSI).toBe(expectedCCSI);
        
        // NPC income should not affect income percentages
        expect(result.incomePercA + result.incomePercB).toBeCloseTo(100, 1);
      }
    });
  });

  describe('Payment Distribution Rules', () => {
    test('F2-004: Rule 1 - Both parents have positive CS%, both pay NPC', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 100000,
        incomeB: 80000,
        nonParentCarer: { enabled: true },
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0, // 0% care → 0% cost
          careAmountB: 0, // 0% care → 0% cost
          careAmountNPC: 365, // 100% care → 100% cost
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        const child = result.childResults[0];
        
        // Both parents should have positive CS%
        expect(child.childSupportPercA).toBeGreaterThan(0);
        expect(child.childSupportPercB).toBeGreaterThan(0);
        
        // Both should pay to NPC
        expect(child.liabilityToNPC_A).toBeGreaterThan(0);
        expect(child.liabilityToNPC_B).toBeGreaterThan(0);
        
        // No payment between parents
        expect(child.liabilityA).toBe(0);
        expect(child.liabilityB).toBe(0);
        
        // Total payment to NPC
        expect(result.paymentToNPC).toBeGreaterThan(0);
      }
    });

    test('F2-005: Rule 2 - One parent positive, other negative with <35% care', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 100000,
        incomeB: 30000,
        nonParentCarer: { enabled: true },
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0, // 0% care
          careAmountB: 73, // 20% care (< 35%)
          careAmountNPC: 292, // 80% care
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        const child = result.childResults[0];
        
        // Parent A should have positive CS%
        expect(child.childSupportPercA).toBeGreaterThan(0);
        
        // Parent B should have negative or zero CS%
        expect(child.childSupportPercB).toBeLessThanOrEqual(0);
        
        // Parent A pays full liability to NPC
        expect(child.liabilityToNPC_A).toBeGreaterThan(0);
        
        // Parent B pays nothing (has <35% care)
        expect(child.liabilityToNPC_B).toBe(0);
        expect(child.liabilityB).toBe(0);
      }
    });

    test('F2-006: Rule 3 - One parent positive, other negative with ≥35% care', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 120000,
        incomeB: 35000,
        nonParentCarer: { enabled: true },
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0, // 0% care → 0% cost
          careAmountB: 128, // 35% care → 25% cost
          careAmountNPC: 237, // 65% care → 63% cost
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        const child = result.childResults[0];
        
        // Parent A should have high positive CS%
        expect(child.childSupportPercA).toBeGreaterThan(0);
        
        // Parent B should have negative CS% (low income, 25% cost)
        expect(child.childSupportPercB).toBeLessThan(0);
        
        // Parent A pays Parent B (for B's negative CS%)
        expect(child.liabilityA).toBeGreaterThan(0);
        
        // Parent A also pays NPC (the balance)
        expect(child.liabilityToNPC_A).toBeGreaterThan(0);
        
        // Parent B receives payment, doesn't pay
        expect(child.liabilityB).toBe(0);
        expect(child.liabilityToNPC_B).toBe(0);
      }
    });
  });

  describe('Cost Percentage with NPC', () => {
    test('F2-007: NPC cost percentage calculated correctly', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 80000,
        incomeB: 60000,
        nonParentCarer: { enabled: true },
        children: [{
          id: '1',
          age: 10,
          careAmountA: 52, // 14.2% → 14% → 24% cost
          careAmountB: 128, // 35.1% → 35% → 25% cost
          careAmountNPC: 185, // 50.7% → 51% → 51% cost
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        const child = result.childResults[0];
        
        // Verify care percentages
        expect(child.roundedCareA).toBe(14);
        expect(child.roundedCareB).toBe(35);
        expect(child.roundedCareNPC).toBe(51);
        
        // Verify cost percentages
        expect(child.costPercA).toBe(24);
        expect(child.costPercB).toBe(25);
        expect(child.costPercNPC).toBe(51);
        
        // Total cost should be 100%
        const totalCost = child.costPercA + child.costPercB + child.costPercNPC;
        expect(totalCost).toBe(100);
      }
    });

    test('F2-008: NPC with primary care (76% cost)', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 80000,
        incomeB: 60000,
        nonParentCarer: { enabled: true },
        children: [{
          id: '1',
          age: 10,
          careAmountA: 52, // 14% care
          careAmountB: 52, // 14% care
          careAmountNPC: 261, // 71.5% → 72% → 76% cost
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        const child = result.childResults[0];
        
        expect(child.roundedCareNPC).toBe(72);
        expect(child.costPercNPC).toBe(76);
      }
    });
  });

  describe('MAR/FAR with NPC', () => {
    test('F2-009: MAR redirected to NPC', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 28000,
        incomeB: 80000,
        supportA: true, // Receives income support
        nonParentCarer: { enabled: true },
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0,
          careAmountB: 0,
          careAmountNPC: 365,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // MAR should apply
        expect(result.MAR_A).toBe(551);
        
        // MAR should be redirected to NPC
        const child = result.childResults[0];
        expect(child.liabilityToNPC_A).toBeGreaterThan(0);
        
        // Payment should go to NPC
        expect(result.paymentToNPC).toBeGreaterThan(0);
      }
    });

    test('F2-010: FAR redirected to NPC', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 25000,
        incomeB: 80000,
        supportA: false, // No income support
        nonParentCarer: { enabled: true },
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0,
          careAmountB: 0,
          careAmountNPC: 365,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // FAR should apply
        expect(result.FAR_A).toBe(1825);
        
        // FAR should be redirected to NPC
        const child = result.childResults[0];
        expect(child.liabilityToNPC_A).toBeGreaterThan(0);
        
        // Payment should go to NPC
        expect(result.paymentToNPC).toBeGreaterThan(0);
      }
    });
  });

  describe('Multiple Children with NPC', () => {
    test('F2-011: Two children, NPC has care of both', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 90000,
        incomeB: 70000,
        nonParentCarer: { enabled: true },
        children: [
          {
            id: '1',
            age: 8,
            careAmountA: 0,
            careAmountB: 128, // 35% care
            careAmountNPC: 237, // 65% care
            carePeriod: 'year',
          },
          {
            id: '2',
            age: 14,
            careAmountA: 0,
            careAmountB: 128, // 35% care
            careAmountNPC: 237, // 65% care
            carePeriod: 'year',
          },
        ],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // Both children should have NPC care
        expect(result.childResults[0].roundedCareNPC).toBe(65);
        expect(result.childResults[1].roundedCareNPC).toBe(65);
        
        // Should use mixed age COTC table
        expect(result.totalCost).toBeGreaterThan(0);
        
        // Total payment to NPC should be sum of both children
        expect(result.paymentToNPC).toBeGreaterThan(0);
      }
    });

    test('F2-012: Different care arrangements per child', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 90000,
        incomeB: 70000,
        nonParentCarer: { enabled: true },
        children: [
          {
            id: '1',
            age: 8,
            careAmountA: 0,
            careAmountB: 0,
            careAmountNPC: 365, // 100% care with NPC
            carePeriod: 'year',
          },
          {
            id: '2',
            age: 14,
            careAmountA: 0,
            careAmountB: 365, // 100% care with Parent B
            careAmountNPC: 0,
            carePeriod: 'year',
          },
        ],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        // Child 1 should have NPC care
        expect(result.childResults[0].roundedCareNPC).toBe(100);
        expect(result.childResults[0].liabilityToNPC_A).toBeGreaterThan(0);
        
        // Child 2 should have Parent B care
        expect(result.childResults[1].roundedCareB).toBe(100);
        expect(result.childResults[1].liabilityA).toBeGreaterThan(0);
        
        // Should have both parent-to-parent and parent-to-NPC payments
        expect(result.paymentToNPC).toBeGreaterThan(0);
      }
    });
  });

  describe('Edge Cases', () => {
    test('F2-013: NPC with 100% care', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 80000,
        incomeB: 60000,
        nonParentCarer: { enabled: true },
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0,
          careAmountB: 0,
          careAmountNPC: 365,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        const child = result.childResults[0];
        
        expect(child.roundedCareNPC).toBe(100);
        expect(child.costPercNPC).toBe(100);
        
        // Both parents should have positive CS% (no cost)
        expect(child.childSupportPercA).toBeGreaterThan(0);
        expect(child.childSupportPercB).toBeGreaterThan(0);
        
        // Both should pay to NPC
        expect(child.liabilityToNPC_A).toBeGreaterThan(0);
        expect(child.liabilityToNPC_B).toBeGreaterThan(0);
      }
    });

    test('F2-014: Adult child with NPC - should be excluded', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 80000,
        incomeB: 60000,
        nonParentCarer: { enabled: true },
        children: [{
          id: '1',
          age: 18,
          careAmountA: 0,
          careAmountB: 0,
          careAmountNPC: 365,
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        const child = result.childResults[0];
        
        // Should be flagged as adult
        expect(child.isAdultChild).toBe(true);
        
        // No liability
        expect(child.liabilityToNPC_A).toBe(0);
        expect(child.liabilityToNPC_B).toBe(0);
        expect(result.finalPaymentAmount).toBe(0);
      }
    });

    test('F2-015: NPC care at exactly 35% boundary', () => {
      const formState: CalculatorFormState = {
        ...createBaseFormState(),
        incomeA: 80000,
        incomeB: 60000,
        nonParentCarer: { enabled: true },
        children: [{
          id: '1',
          age: 10,
          careAmountA: 0,
          careAmountB: 237,
          careAmountNPC: 128, // Exactly 35.1% → 35%
          carePeriod: 'year',
        }],
      };

      const result = calculateChildSupport(formState, year);
      
      if (result && result.resultType !== 'COMPLEXITY_TRAP') {
        const child = result.childResults[0];
        
        // Should be exactly at threshold
        expect(child.roundedCareNPC).toBe(35);
        expect(child.costPercNPC).toBe(25);
        
        // Should trigger Formula 2
        expect(result.paymentToNPC).toBeGreaterThan(0);
      }
    });
  });
});

console.log('Formula 2 validation tests created.');
