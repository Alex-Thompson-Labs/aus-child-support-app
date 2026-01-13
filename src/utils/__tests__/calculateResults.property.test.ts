/**
 * Property-Based Tests for calculateResults.ts Refactoring
 *
 * Feature: refactor-calculate-results
 *
 * These tests validate correctness properties using fast-check.
 * Each property test runs a minimum of 100 iterations with randomly generated inputs.
 *
 * Properties are organized by the module they validate:
 * - Backward Compatibility (Property 1)
 * - Form Validation (Property 2)
 * - Income Calculator (Properties 3-4)
 * - Liability Calculator (Properties 5-7)
 * - Rates Engine (Properties 8-10)
 * - Multi-Case Engine (Property 11)
 * - Payment Resolver (Properties 12-14)
 * - Orchestration (Properties 15-16)
 */

import * as fc from 'fast-check';
import {
    CalculatorFormState,
    ChildInput,
    MultiCaseInfo,
    OtherCaseChild,
    RelevantDependents,
} from '../calculator';
import { AssessmentYear } from '../child-support-constants';
import { validateCalculatorForm } from '../form-validator';

// ============================================================================
// Generators (Arbitraries)
// ============================================================================

/**
 * Generator for valid child age (0-25)
 */
const childAgeArb = fc.integer({ min: 0, max: 25 });

/**
 * Generator for valid care period
 */
const carePeriodArb = fc.constantFrom(
  'week' as const,
  'fortnight' as const,
  'year' as const,
  'percent' as const
);

/**
 * Generator for valid care amount based on period
 */
const careAmountArb = (period: 'week' | 'fortnight' | 'year' | 'percent') => {
  const maxValues = {
    week: 7,
    fortnight: 14,
    year: 365,
    percent: 100,
  };
  return fc.integer({ min: 0, max: maxValues[period] });
};

/**
 * Generator for a valid child input
 */
const validChildInputArb: fc.Arbitrary<ChildInput> = carePeriodArb.chain(
  (period) => {
    const maxValues = {
      week: 7,
      fortnight: 14,
      year: 365,
      percent: 100,
    };
    const max = maxValues[period];
    
    return fc.integer({ min: 0, max }).chain((careA) => {
      const remainingCare = max - careA;
      return fc.record({
        id: fc.uuid(),
        age: childAgeArb,
        careAmountA: fc.constant(careA),
        careAmountB: fc.integer({ min: 0, max: remainingCare }),
        carePeriod: fc.constant(period),
        careAmountNPC: fc.option(fc.constant(0), { nil: undefined }),
      });
    });
  }
);

/**
 * Generator for valid relevant dependents
 */
const validRelDepArb: fc.Arbitrary<RelevantDependents> = fc.record({
  u13: fc.integer({ min: 0, max: 5 }),
  plus13: fc.integer({ min: 0, max: 5 }),
});

/**
 * Generator for valid other case child
 */
const validOtherCaseChildArb: fc.Arbitrary<OtherCaseChild> = fc.record({
  id: fc.uuid(),
  age: childAgeArb,
});

/**
 * Generator for valid multi-case info
 */
const validMultiCaseArb: fc.Arbitrary<MultiCaseInfo> = fc.record({
  otherChildren: fc.array(validOtherCaseChildArb, { minLength: 0, maxLength: 5 }),
});

/**
 * Generator for valid CalculatorFormState
 */
const validFormStateArb: fc.Arbitrary<CalculatorFormState> = fc.record({
  incomeA: fc.integer({ min: 0, max: 500000 }),
  incomeB: fc.integer({ min: 0, max: 500000 }),
  supportA: fc.boolean(),
  supportB: fc.boolean(),
  children: fc.array(validChildInputArb, { minLength: 0, maxLength: 5 }),
  relDepA: validRelDepArb,
  relDepB: validRelDepArb,
  multiCaseA: validMultiCaseArb,
  multiCaseB: validMultiCaseArb,
  nonParentCarer: fc.record({ enabled: fc.boolean() }),
});

/**
 * Generator for valid assessment year
 */
const validYearArb: fc.Arbitrary<AssessmentYear> = fc.constantFrom(
  '2024-25' as AssessmentYear,
  '2025-26' as AssessmentYear
);

/**
 * Generator for invalid form state (negative income)
 */
const invalidIncomeFormStateArb: fc.Arbitrary<CalculatorFormState> =
  validFormStateArb.map((state) => ({
    ...state,
    incomeA: -Math.abs(state.incomeA) - 1, // Ensure negative
  }));

/**
 * Generator for invalid form state (too many multi-case children)
 */
const invalidMultiCaseFormStateArb: fc.Arbitrary<CalculatorFormState> =
  validFormStateArb.chain((state) =>
    fc.array(validOtherCaseChildArb, { minLength: 11, maxLength: 15 }).map(
      (children) => ({
        ...state,
        multiCaseA: { otherChildren: children },
      })
    )
  );

// ============================================================================
// Property Tests - Scaffold
// ============================================================================

describe('Feature: refactor-calculate-results', () => {
  // Configure fast-check to run minimum 100 iterations
  const fcOptions = { numRuns: 100 };

  describe('Property 1: Backward Compatibility - Identical Results', () => {
    /**
     * Property 1: Backward Compatibility - Identical Results
     * Validates: Requirements 8.1, 8.2
     *
     * For any valid CalculatorFormState and AssessmentYear, the refactored
     * calculateChildSupport function SHALL produce a CalculationResults object
     * that is deeply equal to the result from the original implementation.
     *
     * NOTE: This test will be implemented after the refactoring is complete.
     * It requires saving the original implementation's results for comparison.
     */
    it.todo(
      'should produce identical results after refactoring - **Validates: Requirements 8.1, 8.2**'
    );
  });

  describe('Property 2: Validation Rejects Invalid Inputs', () => {
    /**
     * Property 2: Validation Rejects Invalid Inputs
     * Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.6, 1.7
     *
     * For any CalculatorFormState containing invalid data, the validateCalculatorForm
     * function SHALL return a non-empty FormErrors object.
     */

    it('should reject negative incomes - **Validates: Requirements 1.2**', () => {
      fc.assert(
        fc.property(invalidIncomeFormStateArb, (formState) => {
          const errors = validateCalculatorForm(formState);
          // Should have at least one error for negative income
          return Object.keys(errors).length > 0 && errors.incomeA !== undefined;
        }),
        fcOptions
      );
    });

    it('should reject negative incomeB - **Validates: Requirements 1.2**', () => {
      fc.assert(
        fc.property(
          validFormStateArb.map((state) => ({
            ...state,
            incomeB: -Math.abs(state.incomeB) - 1, // Ensure negative
          })),
          (formState) => {
            const errors = validateCalculatorForm(formState);
            return Object.keys(errors).length > 0 && errors.incomeB !== undefined;
          }
        ),
        fcOptions
      );
    });

    it('should reject too many multi-case children - **Validates: Requirements 1.7**', () => {
      fc.assert(
        fc.property(invalidMultiCaseFormStateArb, (formState) => {
          const errors = validateCalculatorForm(formState);
          // Should have error for too many multi-case children
          return Object.keys(errors).length > 0 && errors.multiCaseA !== undefined;
        }),
        fcOptions
      );
    });

    it('should reject negative care amounts - **Validates: Requirements 1.4**', () => {
      fc.assert(
        fc.property(
          validFormStateArb.chain((state) =>
            fc.record({
              id: fc.uuid(),
              age: childAgeArb,
              careAmountA: fc.integer({ min: -100, max: -1 }), // Negative care
              careAmountB: fc.integer({ min: 0, max: 7 }),
              carePeriod: fc.constant('week' as const),
              careAmountNPC: fc.constant(undefined),
            }).map((child) => ({
              ...state,
              children: [child],
            }))
          ),
          (formState) => {
            const errors = validateCalculatorForm(formState);
            // Should have error for negative care amount
            return Object.keys(errors).length > 0;
          }
        ),
        fcOptions
      );
    });

    it('should reject care amounts exceeding period maximum - **Validates: Requirements 1.3**', () => {
      fc.assert(
        fc.property(
          validFormStateArb.chain((state) =>
            fc.record({
              id: fc.uuid(),
              age: childAgeArb,
              careAmountA: fc.integer({ min: 8, max: 100 }), // Exceeds week max of 7
              careAmountB: fc.constant(0),
              carePeriod: fc.constant('week' as const),
              careAmountNPC: fc.constant(undefined),
            }).map((child) => ({
              ...state,
              children: [child],
            }))
          ),
          (formState) => {
            const errors = validateCalculatorForm(formState);
            // Should have error for care amount exceeding max
            return Object.keys(errors).length > 0;
          }
        ),
        fcOptions
      );
    });

    it('should reject total care exceeding period maximum - **Validates: Requirements 1.5**', () => {
      fc.assert(
        fc.property(
          validFormStateArb.chain((state) =>
            fc.record({
              id: fc.uuid(),
              age: childAgeArb,
              careAmountA: fc.constant(5),
              careAmountB: fc.constant(5), // Total 10 > 7 for week
              carePeriod: fc.constant('week' as const),
              careAmountNPC: fc.constant(undefined),
            }).map((child) => ({
              ...state,
              children: [child],
            }))
          ),
          (formState) => {
            const errors = validateCalculatorForm(formState);
            // Should have error for total care exceeding max
            return Object.keys(errors).length > 0;
          }
        ),
        fcOptions
      );
    });

    it('should reject negative dependent counts - **Validates: Requirements 1.6**', () => {
      fc.assert(
        fc.property(
          validFormStateArb.map((state) => ({
            ...state,
            relDepA: { u13: -1, plus13: 0 },
          })),
          (formState) => {
            const errors = validateCalculatorForm(formState);
            return Object.keys(errors).length > 0 && errors.relDepA !== undefined;
          }
        ),
        fcOptions
      );
    });

    it('should accept valid form state with no errors', () => {
      fc.assert(
        fc.property(validFormStateArb, (formState) => {
          const errors = validateCalculatorForm(formState);
          // Valid form state should have no errors
          return Object.keys(errors).length === 0;
        }),
        fcOptions
      );
    });
  });

  describe('Property 3: CSI Formula Correctness', () => {
    /**
     * Property 3: CSI Formula Correctness
     * Validates: Requirements 2.2
     *
     * For any valid income inputs, the calculated CSI SHALL equal
     * max(0, ATI - SSA - relDepDeductible - multiCaseAllowance).
     */
    it.todo(
      'should calculate CSI correctly - **Validates: Requirements 2.2**'
    );
  });

  describe('Property 4: Income Percentages Sum to 100%', () => {
    /**
     * Property 4: Income Percentages Sum to 100%
     * Validates: Requirements 2.5
     *
     * For any pair of CSI values where CCSI > 0, the sum of incomePercA
     * and incomePercB SHALL equal 100%.
     */
    it.todo(
      'should have income percentages sum to 100% - **Validates: Requirements 2.5**'
    );
  });

  describe('Property 5: Liability Formula Correctness', () => {
    /**
     * Property 5: Liability Formula Correctness
     * Validates: Requirements 3.2, 3.5
     *
     * For any valid liability calculation inputs where liability is payable,
     * the calculated liability SHALL equal (childSupportPercent / 100) * costPerChild.
     */
    it.todo(
      'should calculate liability correctly - **Validates: Requirements 3.2, 3.5**'
    );
  });

  describe('Property 6: Zero Liability for Low Care', () => {
    /**
     * Property 6: Zero Liability for Low Care
     * Validates: Requirements 3.3
     *
     * For any child where the receiving parent has less than 35% care
     * (and no NPC with 35%+ care), the liability to that parent SHALL be zero.
     */
    it.todo(
      'should return zero liability for low care - **Validates: Requirements 3.3**'
    );
  });

  describe('Property 7: Zero Liability for Adult Children', () => {
    /**
     * Property 7: Zero Liability for Adult Children
     * Validates: Requirements 3.4
     *
     * For any child aged 18 or older, both liabilityA and liabilityB SHALL be zero.
     */
    it.todo(
      'should return zero liability for adult children - **Validates: Requirements 3.4**'
    );
  });

  describe('Property 8: MAR Eligibility Conditions', () => {
    /**
     * Property 8: MAR Eligibility Conditions
     * Validates: Requirements 4.3
     *
     * For any parent who receives income support AND has ATI below SSA AND
     * has less than 14% care of all assessable children, the checkMARApplies
     * function SHALL return true.
     */
    it.todo(
      'should correctly determine MAR eligibility - **Validates: Requirements 4.3**'
    );
  });

  describe('Property 9: FAR Eligibility Conditions', () => {
    /**
     * Property 9: FAR Eligibility Conditions
     * Validates: Requirements 4.5
     *
     * For any parent who has ATI below MAX_PPS AND does not receive income support
     * AND the other parent has 66%+ care, the checkFARApplies function SHALL return true.
     */
    it.todo(
      'should correctly determine FAR eligibility - **Validates: Requirements 4.5**'
    );
  });

  describe('Property 10: FAR 3-Child Cap', () => {
    /**
     * Property 10: FAR 3-Child Cap
     * Validates: Requirements 4.7, 5.7
     *
     * For any case where FAR applies to more than 3 children (across all cases),
     * the total FAR liability SHALL be capped at 3 × the yearly FAR amount.
     */
    it.todo(
      'should cap FAR at 3 children - **Validates: Requirements 4.7, 5.7**'
    );
  });

  describe('Property 11: Multi-Case Cap Uses Solo CSI', () => {
    /**
     * Property 11: Multi-Case Cap Uses Solo CSI
     * Validates: Requirements 5.3
     *
     * For any multi-case cap calculation, the solo cost SHALL be calculated
     * using only the payer's preliminary CSI, not the combined CCSI.
     */
    it.todo(
      'should use solo CSI for multi-case cap - **Validates: Requirements 5.3**'
    );
  });

  describe('Property 12: Net Payment Formula', () => {
    /**
     * Property 12: Net Payment Formula
     * Validates: Requirements 6.2
     *
     * For any calculation result, the finalPaymentAmount SHALL equal
     * |finalLiabilityA - finalLiabilityB|.
     */
    it.todo(
      'should calculate net payment correctly - **Validates: Requirements 6.2**'
    );
  });

  describe('Property 13: Payer/Receiver Determination', () => {
    /**
     * Property 13: Payer/Receiver Determination
     * Validates: Requirements 6.3, 6.4
     *
     * For any calculation result where finalPaymentAmount > 0, the payer
     * SHALL be the parent with higher liability and receiver SHALL be
     * the parent with lower liability.
     */
    it.todo(
      'should correctly determine payer and receiver - **Validates: Requirements 6.3, 6.4**'
    );
  });

  describe('Property 14: Zero Payment Yields Neither', () => {
    /**
     * Property 14: Zero Payment Yields Neither
     * Validates: Requirements 6.5
     *
     * For any calculation result where finalPaymentAmount === 0,
     * both payer and receiver SHALL be "Neither".
     */
    it.todo(
      'should set payer and receiver to Neither for zero payment - **Validates: Requirements 6.5**'
    );
  });

  describe('Property 15: Null on Validation Failure', () => {
    /**
     * Property 15: Null on Validation Failure
     * Validates: Requirements 7.3
     *
     * For any CalculatorFormState that fails validation,
     * calculateChildSupport SHALL return null.
     */
    it.todo(
      'should return null on validation failure - **Validates: Requirements 7.3**'
    );
  });

  describe('Property 16: Override Values Take Precedence', () => {
    /**
     * Property 16: Override Values Take Precedence
     * Validates: Requirements 7.5
     *
     * For any call to calculateChildSupport with override values for supportA
     * or supportB, the calculation SHALL use the override values instead of
     * the form state values.
     */
    it.todo(
      'should use override values when provided - **Validates: Requirements 7.5**'
    );
  });
});

// ============================================================================
// Export generators for use in other test files
// ============================================================================

export {
    careAmountArb, carePeriodArb, childAgeArb, invalidIncomeFormStateArb,
    invalidMultiCaseFormStateArb, validChildInputArb, validFormStateArb, validMultiCaseArb,
    validOtherCaseChildArb, validRelDepArb, validYearArb
};

