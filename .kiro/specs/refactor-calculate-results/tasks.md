# Implementation Plan: Refactor calculateResults.ts

## Overview

This plan refactors the monolithic `calculateResults.ts` (~580 lines) into focused, single-responsibility modules. The approach is incremental: extract one module at a time, wire it into the orchestration, and validate with property tests before proceeding.

## Tasks

- [x] 1. Set up project structure and testing framework
  - [x] 1.1 Create `src/utils/engine/` directory structure
    - Create `src/utils/engine/index.ts` with placeholder exports
    - _Requirements: 9.1, 9.4_
  - [x] 1.2 Set up fast-check for property-based testing
    - Install fast-check if not present
    - Create `src/utils/__tests__/calculateResults.property.test.ts` scaffold
    - _Requirements: 8.1, 8.2_

- [x] 2. Extract Form Validator module
  - [x] 2.1 Create `src/utils/form-validator.ts`
    - Extract `validateCalculatorForm` function from calculateResults.ts
    - Export function with same signature
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_
  - [x] 2.2 Update calculateResults.ts to import from form-validator
    - Replace inline validation with import
    - Re-export for backward compatibility
    - _Requirements: 8.3, 8.4_
  - [x] 2.3 Write property test for validation rejects invalid inputs
    - **Property 2: Validation Rejects Invalid Inputs**
    - **Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.6, 1.7**

- [ ] 3. Extract Income Calculator module
  - [ ] 3.1 Create `src/utils/income-calculator.ts`
    - Define `IncomeCalculationInput` and `IncomeCalculationResult` interfaces
    - Implement `calculateIncomes` function
    - Implement `createVirtualDependentChildren` helper
    - Implement `calculateCSI` helper
    - Implement `calculateIncomePercentages` helper
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [ ] 3.2 Update calculateResults.ts to use income-calculator
    - Replace inline income calculations with module call
    - Re-export for backward compatibility
    - _Requirements: 8.3, 8.4_
  - [ ] 3.3 Write property test for CSI formula correctness
    - **Property 3: CSI Formula Correctness**
    - **Validates: Requirements 2.2**
  - [ ] 3.4 Write property test for income percentages sum to 100%
    - **Property 4: Income Percentages Sum to 100%**
    - **Validates: Requirements 2.5**

- [ ] 4. Extract Liability Calculator module
  - [ ] 4.1 Create `src/utils/liability-calculator.ts`
    - Define `LiabilityInput` and `LiabilityResult` interfaces
    - Implement `calculateChildLiability` function
    - Implement `calculateChildSupportPercentage` helper
    - Implement `shouldPayLiability` helper
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [ ] 4.2 Update calculateResults.ts to use liability-calculator
    - Replace inline liability calculations with module call
    - Re-export for backward compatibility
    - _Requirements: 8.3, 8.4_
  - [ ] 4.3 Write property test for liability formula correctness
    - **Property 5: Liability Formula Correctness**
    - **Validates: Requirements 3.2, 3.5**
  - [ ] 4.4 Write property test for zero liability for low care
    - **Property 6: Zero Liability for Low Care**
    - **Validates: Requirements 3.3**
  - [ ] 4.5 Write property test for zero liability for adult children
    - **Property 7: Zero Liability for Adult Children**
    - **Validates: Requirements 3.4**

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Extract Rates Engine module
  - [ ] 6.1 Create `src/utils/engine/rates-engine.ts`
    - Define `RateEligibilityInput`, `RateApplicationResult`, `ApplyRatesInput`, `ApplyRatesResult` interfaces
    - Implement `checkMARApplies` function
    - Implement `checkFARApplies` function
    - Implement `applyRatesToChildren` function
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  - [ ] 6.2 Update engine/index.ts to export rates-engine
    - Re-export all public APIs
    - _Requirements: 9.2, 9.4_
  - [ ] 6.3 Update calculateResults.ts to use rates-engine
    - Replace inline FAR/MAR logic with module call
    - Re-export for backward compatibility
    - _Requirements: 8.3, 8.4_
  - [ ] 6.4 Write property test for MAR eligibility conditions
    - **Property 8: MAR Eligibility Conditions**
    - **Validates: Requirements 4.3**
  - [ ] 6.5 Write property test for FAR eligibility conditions
    - **Property 9: FAR Eligibility Conditions**
    - **Validates: Requirements 4.5**
  - [ ] 6.6 Write property test for FAR 3-child cap
    - **Property 10: FAR 3-Child Cap**
    - **Validates: Requirements 4.7, 5.7**

- [ ] 7. Extract Multi-Case Engine module
  - [ ] 7.1 Create `src/utils/engine/multi-case-engine.ts`
    - Define `SoloCostInput`, `MultiCaseCapInput`, `MultiCaseCapResult`, `MARFARCapInput`, `MARFARCapResult` interfaces
    - Implement `calculateSoloCostPerChild` at module scope (not inside any function)
    - Implement `applyMultiCaseCaps` function
    - Implement `applyMARFARCaps` function
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 10.1, 10.2, 10.3, 10.4_
  - [ ] 7.2 Update engine/index.ts to export multi-case-engine
    - Re-export all public APIs
    - _Requirements: 9.3, 9.4_
  - [ ] 7.3 Update calculateResults.ts to use multi-case-engine
    - Replace inline multi-case cap logic with module call
    - Re-export for backward compatibility
    - _Requirements: 8.3, 8.4_
  - [ ] 7.4 Write property test for multi-case cap uses solo CSI
    - **Property 11: Multi-Case Cap Uses Solo CSI**
    - **Validates: Requirements 5.3**

- [ ] 8. Extract Payment Resolver module
  - [ ] 8.1 Create `src/utils/payment-resolver.ts`
    - Define `PaymentResolutionInput` and `PaymentResolutionResult` interfaces
    - Implement `resolvePayment` function
    - Implement `calculateNPCPayment` helper
    - Implement `determinePayerRole` helper
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  - [ ] 8.2 Update calculateResults.ts to use payment-resolver
    - Replace inline payment resolution with module call
    - Re-export for backward compatibility
    - _Requirements: 8.3, 8.4_
  - [ ] 8.3 Write property test for net payment formula
    - **Property 12: Net Payment Formula**
    - **Validates: Requirements 6.2**
  - [ ] 8.4 Write property test for payer/receiver determination
    - **Property 13: Payer/Receiver Determination**
    - **Validates: Requirements 6.3, 6.4**
  - [ ] 8.5 Write property test for zero payment yields neither
    - **Property 14: Zero Payment Yields Neither**
    - **Validates: Requirements 6.5**

- [ ] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Finalize orchestration and backward compatibility
  - [ ] 10.1 Refactor calculateResults.ts as thin orchestration layer
    - Ensure all module calls are in correct order: validation → income → cost → liability → rates → caps → payment
    - Verify all re-exports are in place
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 9.5, 9.6_
  - [ ] 10.2 Write property test for null on validation failure
    - **Property 15: Null on Validation Failure**
    - **Validates: Requirements 7.3**
  - [ ] 10.3 Write property test for override values take precedence
    - **Property 16: Override Values Take Precedence**
    - **Validates: Requirements 7.5**
  - [ ] 10.4 Write property test for backward compatibility - identical results
    - **Property 1: Backward Compatibility - Identical Results**
    - **Validates: Requirements 8.1, 8.2**

- [ ] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks including property tests are required for comprehensive correctness validation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using fast-check
- The backward compatibility property test (10.4) is the most critical - it ensures the refactored code produces identical results to the original
